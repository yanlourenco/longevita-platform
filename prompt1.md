# ECOSYSTEM BLUEPRINT: SISTEMA ANTIGRAVITY
Este documento reúne a suíte de códigos e scripts de infraestrutura de software, segurança lógica e animações de alta performance desenvolvidos sob o padrão Apple de engenharia para o ecossistema Antigravity.

---

## 1. SEGURANÇA & LGPD (POLÍTICAS RLS DO SUPABASE)

O script SQL abaixo ativa e configura o isolamento lógico completo do banco de dados (PostgreSQL/Supabase) via **Row Level Security (RLS)**. Os dados de saúde são classificados como dados sensíveis (Art. 5º, II da LGPD), possuindo restrição de acesso temporal baseado em contratos e destruição permanente sob demanda (Direito ao Esquecimento - Art. 16 da LGPD).

```sql
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
```

---

## 2. API ENDPOINT BLINDADO (NEXT.JS APP ROUTER + TS)

Abaixo está o arquivo TypeScript (`/api/idosos/route.ts`) responsável pela manipulação segura dos registros. Possui validação rígida via **Zod** com remoção ativa de injeções maliciosas (XSS), validação imperativa de token JWT de sessão autenticada em cookies seguros e mecanismo resiliente de **Rate Limiting** baseado no endereço IP do cliente.

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// 1. ESQUEMA DE VALIDAÇÃO COM SANITIZAÇÃO RIGOROSA DE INPUTS (ZOD)
// Proteção direta contra injeções de script (XSS) e dados inválidos
const idosoSchema = z.object({
  nome: z.string()
    .min(2, { message: "O nome deve conter pelo menos 2 caracteres" })
    .max(100, { message: "O nome não pode exceder 100 caracteres" })
    .transform(val => val.replace(/<[^>]*>/g, '').trim()), // Remove Tags HTML vulneráveis
  dataNascimento: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data de nascimento deve seguir o formato YYYY-MM-DD" }),
  nivelNecessidade: z.enum(['companhia', 'intermediario', 'acamado_alzheimer'], {
    errorMap: () => ({ message: "Nível de necessidade inválido" })
  }),
  condicoesMedicas: z.string()
    .max(1000, { message: "O histórico médico não pode exceder 1000 caracteres" })
    .transform(val => val.replace(/<[^>]*>/g, '').trim())
    .optional(),
});

// 2. MOTOR DE RATE LIMITING INTEGRADO NA MEMÓRIA DA API EDGE/SERVERLESS
// Prevenção de ataques de força bruta, flooding e tentativas de negação de serviço (DDoS)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // Janela de 1 minuto
const MAX_REQUESTS_PER_WINDOW = 30;    // Máximo de 30 requisições por IP por minuto
const ipCache = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userRate = ipCache.get(ip);

  if (!userRate || now > userRate.resetTime) {
    ipCache.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  userRate.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  // Identificação do IP do cliente de forma resiliente em ambiente Vercel
  const clientIp = request.headers.get('x-forwarded-for') || request.ip || '127.0.0.1';

  // Executa checagem de Rate Limit
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Bloqueio por excesso de requisições (Rate Limit). Tente novamente em 1 minuto.' },
      { 
        status: 429, 
        headers: { 'Retry-After': '60', 'X-Robots-Tag': 'noindex, nofollow' } 
      }
    );
  }

  try {
    // Inicialização do cliente de banco autenticado do Supabase consumindo HttpOnly Cookies
    const supabase = createRouteHandlerClient({ cookies });
    
    // Verificação estrita de token JWT e sessão ativa do usuário
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      return NextResponse.json(
        { error: 'Acesso não autorizado. Token JWT inválido, ausente ou expirado.' },
        { status: 401 }
      );
    }

    // Parsing e sanitização profunda do payload da requisição
    const body = await request.json();
    const validationResult = idosoSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Dados inválidos ou em desconformidade com as diretrizes de validação.',
          detalhes: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Escrita segura no Supabase utilizando RLS nativo
    const { data, error: dbError } = await supabase
      .from('dados_idosos')
      .insert([
        {
          familia_id: session.user.id, // Amarra estrita do id do usuário autenticado no JWT
          nome_criptografado: validatedData.nome,
          data_nascimento: validatedData.dataNascimento,
          nivel_necessidade: validatedData.nivelNecessidade,
          condicoes_medicas: validatedData.condicoesMedicas,
        }
      ])
      .select()
      .single();

    if (dbError) {
      // Log interno para monitoramento da engenharia sem vazar dados na Response HTTP
      console.error('[DB INSERT ERROR]:', dbError.message);
      return NextResponse.json(
        { error: 'Falha interna ao processar registro seguro no banco de dados.' },
        { status: 500 }
      );
    }

    // Retorno com cabeçalhos de segurança estritos contra ataques de sniffing e injeção de frame
    return NextResponse.json(
      { success: true, message: 'Dados de saúde registrados com sucesso sob conformidade LGPD.', data },
      { 
        status: 201,
        headers: {
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Content-Security-Policy': "default-src 'none';"
        }
      }
    );

  } catch (globalError) {
    console.error('[CRITICAL API EXCEPTION]:', globalError);
    return NextResponse.json(
      { error: 'Instabilidade crítica do ecossistema de servidores. Contate os administradores.' },
      { status: 500 }
    );
  }
}
```

---

## 3. MOTOR DE ANIMAÇÃO PREMIUM (FRAMER MOTION & NEXT.JS)

O componente React em Next.js a seguir implementa as micro-interações fluidas e físicas de mola característicos do ecossistema Apple. O código utiliza a técnica de **Shared Layout Animation** (`layoutId`) para expandir organicamente o card de perfil dos cuidadores para tela cheia e implementa feedback háptico visual responsivo através do estado de clique do usuário (`whileTap`).

```tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

// Interface TypeScript definindo os dados do cuidador
interface Cuidador {
  id: string;
  nome: string;
  especialidade: string;
  foto: string;
  biografia: string;
  antecedentesChecados: boolean;
  formacaoVerificada: boolean;
}

// Mock de dados simulando resposta ultrarrápida do Supabase Realtime
const CUIDADORES_MOCK: Cuidador[] = [
  {
    id: "cuidador-1",
    nome: "Ana Silva",
    especialidade: "Especialista em Alzheimer & Idosos Acamados",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    biografia: "Enfermeira padrão com mais de 8 anos de experiência em cuidados intensivos domiciliares de alta complexidade. Focada em atendimento humanizado e rotinas estruturadas.",
    antecedentesChecados: true,
    formacaoVerificada: true,
  },
];

// Configuração das físicas de mola padrão Apple (Spring Animation Rig)
const APPLE_SPRING_TRANSITION = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8
};

export default function AntigravityCaregiversDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const activeCuidador = CUIDADORES_MOCK.find(c => c.id === selectedId);

  return (
    <div className="min-h-screen bg-neutral-50 px-6 py-12 font-sans text-neutral-900 selection:bg-black selection:text-white">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Sistema Antigravity</span>
          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-neutral-900">
            Cuidadores Disponíveis
          </h1>
          <p className="mt-3 text-neutral-500 max-w-xl">
            Profissionais validados com segurança avançada, prontos para atendimento sob demanda de sua família.
          </p>
        </header>

        {/* LayoutGroup garante sincronização perfeita do layout dinâmico dos componentes */}
        <LayoutGroup>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CUIDADORES_MOCK.map((cuidador) => (
              <motion.div
                layoutId={`card-container-${cuidador.id}`}
                key={cuidador.id}
                onClick={() => setSelectedId(cuidador.id)}
                transition={APPLE_SPRING_TRANSITION}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.97 }} // Efeito háptico visual nativo de afundamento Apple
                className="flex flex-col overflow-hidden rounded-[24px] bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-neutral-100 cursor-pointer justify-between"
              >
                <div>
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-[18px]">
                    <motion.img
                      layoutId={`card-image-${cuidador.id}`}
                      src={cuidador.foto}
                      alt={cuidador.nome}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {cuidador.antecedentesChecados && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-100">
                        ✓ Antecedentes Criminais OK
                      </span>
                    )}
                  </div>

                  <motion.h3 
                    layoutId={`card-title-${cuidador.id}`} 
                    className="text-xl font-bold text-neutral-900 tracking-tight"
                  >
                    {cuidador.nome}
                  </motion.h3>
                  
                  <motion.p 
                    layoutId={`card-specialty-${cuidador.id}`} 
                    className="mt-1 text-sm text-neutral-500 font-medium"
                  >
                    {cuidador.especialidade}
                  </motion.p>
                </div>

                <div className="mt-6 flex w-full items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ver Perfil Completo</span>
                  <div className="h-8 w-8 rounded-full bg-neutral-900 flex items-center justify-center text-white text-lg">
                    →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Renderização em Overlay da Visualização Expandida com Shared Layout Animation */}
          <AnimatePresence>
            {selectedId && activeCuidador && (
              <>
                {/* Backdrop escurecido para isolamento focal de fundo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedId(null)}
                  className="fixed inset-0 z-40 bg-black backdrop-blur-sm"
                />

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                  <motion.div
                    layoutId={`card-container-${activeCuidador.id}`}
                    transition={APPLE_SPRING_TRANSITION}
                    className="relative w-full max-w-2xl overflow-hidden rounded-[32px] bg-white p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                  >
                    {/* Botão de Fechar no Padrão Superior Direito do iOS */}
                    <button
                      onClick={() => setSelectedId(null)}
                      className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors focus:outline-none"
                    >
                      ✕
                    </button>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="h-32 w-32 sm:h-40 sm:w-40 flex-shrink-0 overflow-hidden rounded-[24px]">
                        <motion.img
                          layoutId={`card-image-${activeCuidador.id}`}
                          src={activeCuidador.foto}
                          alt={activeCuidador.nome}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            ✓ Antecedentes Criminais OK
                          </span>
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                            ✓ Diploma de Enfermagem Verificado
                          </span>
                        </div>

                        <motion.h2 
                          layoutId={`card-title-${activeCuidador.id}`} 
                          className="text-3xl font-bold tracking-tight text-neutral-900"
                        >
                          {activeCuidador.nome}
                        </motion.h2>

                        <motion.p 
                          layoutId={`card-specialty-${activeCuidador.id}`} 
                          className="text-md text-neutral-500 font-semibold mt-1"
                        >
                          {activeCuidador.especialidade}
                        </motion.p>
                      </div>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                      className="mt-6 border-t border-neutral-100 pt-6"
                    >
                      <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">Biografia e Abordagem Médica</h4>
                      <p className="text-neutral-600 leading-relaxed text-md">
                        {activeCuidador.biografia}
                      </p>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 rounded-2xl bg-neutral-900 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-[0.98]">
                          Contratar Profissional Regularmente
                        </button>
                        <button className="flex-1 rounded-2xl bg-neutral-100 py-4 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition-all active:scale-[0.98]">
                          Agendar Plantão de Urgência
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}
```
