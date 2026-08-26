# 📋 Especificações de Desenvolvimento: Plataforma de Cuidado a Idosos (Versão 2.0)

## 🎯 Objetivo
Evoluir a plataforma web para um padrão visual e funcional profissional, integrando sistema de autenticação, personalização visual (favicon), formulário detalhado de perfil assistido com busca preditiva/dinâmica de condições de saúde e microinterações fluidas.

---

## 1. Identidade Visual e Recursos Globais
* **Favicon:** Integrar o arquivo de favicon fornecido em todas as rotas (`<link rel="icon" type="image/x-icon" href="/path/to/favicon.ico">`).
* **Design System & Animações:**
  * Elevar o nível das transições existentes com microinterações suaves (transições de hover com `cubic-bezier`, feedback visual de clique e loaders dinâmicos).
  * Manter paleta de cores acolhedora, acessível e profissional (foco em legibilidade e contraste adequado).
  * Feedback visual instantâneo para validações de formulário e ações concluídas (toasts/snackbars animados).

---

## 2. Telas de Autenticação (Login & Cadastro)
Criar fluxo de autenticação limpo, seguro e responsivo, dividido por perfil de usuário quando aplicável.

### A. Tela de Login
* **Campos:** E-mail (ou CPF) e Senha.
* **Recursos:**
  * Alternador de visibilidade de senha (ícone de olho).
  * Link "Esqueci minha senha" com recuperação amigável.
  * Opção "Lembrar de mim".
  * Validação de formato de e-mail e campo obrigatório em tempo real.

### B. Tela de Cadastro do Contratante
* **Campos Principais:**
  * Nome completo do contratante.
  * CPF e Telefone/WhatsApp (com máscaras dinâmicas de preenchimento).
  * E-mail e confirmação de senha (com medidor de força da senha).
  * Endereço principal (busca automática de CEP via API).

---

## 3. Cadastro Completo do Assistido (Pai, Mãe ou Familiar)
Implementar formulário estruturado (em etapas/stepper para melhorar a experiência do usuário) contendo todos os dados vitais para o cuidado:

### Dados Pessoais e Rotina
* Nome completo, data de nascimento/idade, grau de parentesco e gênero.
* Grau de mobilidade (independente, precisa de apoio, acamado, cadeirante).
* Rotina de alimentação e restrições dietéticas.
* Contatos de emergência e plano de saúde/médico responsável.

### 🔍 Módulo de Busca Dinâmica de Condições e Cuidados de Saúde
* **Campo de Busca Inteligente (Autosuggest/Autocomplete):**
  * Ao digitar, o sistema sugere dinamicamente termos médicos, comorbidades e condições comuns (ex.: *Alzheimer, Parkinson, Diabetes Tipo 2, Hipertensão, Demência Vascular, Osteoporose*).
* **Tagging/Chips:**
  * Ao selecionar o problema, adicioná-lo como uma tag/badge interativa com opção de remoção.
  * Campo adicional para observações específicas de cada condição selecionada (ex.: dosagens, horários de medicação ou cuidados especiais).
* **Campos Complementares:**
  * Lista de medicamentos contínuos.
  * Alergias conhecidas.

---

## 4. Dinamismo e Enriquecimento da Interface
* **Dashboard do Contratante:** Visualização rápida do status do idoso cadastrado, resumo dos cuidados e atalhos para edição.
* **Transições e Modais:** Transições de tela animadas, abertura suave de modais e carregamento assíncrono com skeletons para evitar telas em branco.
* **Responsividade:** Layout 100% otimizado para dispositivos móveis, tablets e desktop.

---

## 🛠️ Critérios Técnicos de Entrega
1. Código limpo, componentizado e de fácil manutenção.
2. Tratamento de erros amigável em todos os inputs.
3. Performance fluida sem engasgos nas animações CSS/JS.