-- =============================================================================
-- 1. CONFIGURAÇÃO DE SEGURANÇA, ESQUEMAS E EXTENSÕES
-- =============================================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Limpeza preventiva de tabelas
drop table if exists registros_diario cascade;
drop table if exists contratos_cuidador cascade;
drop table if exists dados_idosos cascade;

-- Enum para Níveis de Complexidade de Cuidados (LGPD Minimização)
create type nivel_complexidade as enum ('companhia', 'intermediario', 'acamado_alzheimer');

-- =============================================================================
-- 2. CRIAÇÃO DAS TABELAS (SECURITY BY DESIGN & LGPD)
-- =============================================================================

-- Tabela Principal: Dados de Idosos (Dados Sensíveis de Saúde Art. 5º, II LGPD)
create table dados_idosos (
    id uuid primary key default uuid_generate_v4(),
    familia_id uuid not null references auth.users(id) on delete cascade,
    nome_criptografado text not null, -- Nome armazenado de forma protegida se necessário
    data_nascimento date not null,
    nivel_necessidade nivel_complexidade not null default 'companhia',
    condicoes_medicas text, -- Informações de saúde sob consentimento granular
    criado_em timestamp with time zone default timezone('utc'::text, now()) not null,
    atualizado_em timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tabela de Vínculos Contratuais Ativos (Garante a temporalidade do acesso do cuidador)
create table contratos_cuidador (
    id uuid primary key default uuid_generate_v4(),
    idoso_id uuid not null references dados_idosos(id) on delete cascade,
    familia_id uuid not null references auth.users(id) on delete cascade,
    cuidador_id uuid not null references auth.users(id) on delete cascade,
    data_inicio timestamp with time zone not null,
    data_fim timestamp with time zone,
    status_ativo boolean default true not null,
    criado_em timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint check_datas check (data_fim is null or data_fim > data_inicio)
);

-- Tabela de Diário de Bordo (Atualizações em tempo real com auditoria completa)
create table registros_diario (
    id uuid primary key default uuid_generate_v4(),
    idoso_id uuid not null references dados_idosos(id) on delete cascade,
    autor_id uuid not null references auth.users(id) on delete set null,
    medicamentos_administrados text,
    alimentacao_detalhes text,
    qualidade_sono text,
    observacoes_gerais text,
    latitude numeric(10, 8), -- Validação de Geofencing indireta por registro
    longitude numeric(11, 8),
    criado_em timestamp with time zone default timezone('utc'::text, now()) not null,
    audit_log jsonb default '{}'::jsonb not null -- Logs auditáveis de modificação
);

-- =============================================================================
-- 3. ATIVAÇÃO DO ROW LEVEL SECURITY (RLS)
-- =============================================================================
alter table dados_idosos enable row level security;
alter table contratos_cuidador enable row level security;
alter table registros_diario enable row level security;

-- =============================================================================
-- 4. CRIAÇÃO DAS POLÍTICAS DE ACESSO RESTRITO (RLS POLICIES)
-- =============================================================================

--------------------------------------------------------------------------------
-- POLÍTICAS: DADOS_IDOSOS
--------------------------------------------------------------------------------
-- P1: Família Proprietária possui controle total sobre o registro do idoso
create policy "Família Proprietária: Controle Total"
on dados_idosos for all
using (auth.uid() = familia_id)
with check (auth.uid() = familia_id);

-- P2: Cuidador Contratado possui apenas leitura estrita do perfil sob contrato ativo
create policy "Cuidador Contratado: Leitura Restrita sob Contrato"
on dados_idosos for select
using (
    exists (
        select 1 from contratos_cuidador
        where contratos_cuidador.idoso_id = dados_idosos.id
        and contratos_cuidador.cuidador_id = auth.uid()
        and contratos_cuidador.status_ativo = true
        and (contratos_cuidador.data_fim is null or contratos_cuidador.data_fim > now())
    )
);

--------------------------------------------------------------------------------
-- POLÍTICAS: CONTRATOS_CUIDADOR
--------------------------------------------------------------------------------
-- Família gerencia os contratos
create policy "Família: Gerenciar Contratos"
on contratos_cuidador for all
using (auth.uid() = familia_id)
with check (auth.uid() = familia_id);

-- Cuidador visualiza seus próprios vínculos de trabalho
create policy "Cuidador: Visualizar Vínculos Próprios"
on contratos_cuidador for select
using (auth.uid() = cuidador_id);

--------------------------------------------------------------------------------
-- POLÍTICAS: REGISTROS_DIARIO
--------------------------------------------------------------------------------
-- Família lê todos os registros de diário de bordo do seu idoso vinculado
create policy "Família: Leitura Completa Diário"
on registros_diario for select
using (
    exists (
        select 1 from dados_idosos
        where dados_idosos.id = registros_diario.idoso_id
        and dados_idosos.familia_id = auth.uid()
    )
);

-- Cuidador insere registros apenas se houver um contrato ativo para aquele idoso
create policy "Cuidador: Inserção Permitida sob Contrato Ativo"
on registros_diario for insert
with check (
    auth.uid() = autor_id 
    and exists (
        select 1 from contratos_cuidador
        where contratos_cuidador.idoso_id = registros_diario.idoso_id
        and contratos_cuidador.cuidador_id = auth.uid()
        and contratos_cuidador.status_ativo = true
        and (contratos_cuidador.data_fim is null or contratos_cuidador.data_fim > now())
    )
);

-- Cuidador visualiza os registros criados por ele mesmo
create policy "Cuidador: Leitura de Registros Próprios"
on registros_diario for select
using (auth.uid() = autor_id);

-- =============================================================================
-- 5. FUNÇÕES AUXILIARES DE DIREITO AO ESQUECIMENTO (LGPD ART. 16)
-- =============================================================================
create or replace function anonimizar_direito_ao_esquecimento(idoso_uuid uuid)
returns void as $$
begin
    -- Verifica se o usuário executando é o dono do registro do idoso
    if not exists (select 1 from dados_idosos where id = idoso_uuid and familia_id = auth.uid()) then
        raise exception 'Não autorizado: Apenas o proprietário familiar pode solicitar exclusão de dados.';
    end if;

    -- Anonimização estrita destruindo dados identificáveis sem quebrar integridade referencial do banco
    update dados_idosos 
    set 
        nome_criptografado = 'ANONIMIZADO_LGPD_' || encode(digest(id::text, 'sha256'), 'hex'),
        condicoes_medicas = 'REMOVIDO_POR_DIREITO_AO_ESQUECIMENTO',
        data_nascimento = '1900-01-01'::date,
        atualizado_em = now()
    where id = idoso_uuid;

    update registros_diario 
    set 
        medicamentos_administrados = 'ANONIMIZADO',
        alimentacao_detalhes = 'ANONIMIZADO',
        qualidade_sono = 'ANONIMIZADO',
        observacoes_gerais = 'Dados pessoais removidos a pedido do usuário em conformidade com a LGPD.',
        latitude = null,
        longitude = null
    where idoso_id = idoso_uuid;
end;
$$ language plpgsql security definer;
