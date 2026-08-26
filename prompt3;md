# 📋 Especificações de Desenvolvimento: Gestão de Vínculos, Notificações e Feedbacks (Versão 3.0)

## 🎯 Objetivo
Implementar as regras de relacionamento entre Cuidadores e Famílias, sistema de notificações de contratação/vínculo, módulo de avaliações/feedbacks de clientes anteriores e sincronização dinâmica da listagem de cuidadores na plataforma.

---

## 1. Regras de Visibilidade e Vínculo (Perfil do Cuidador)
* **Painel Exclusivo de Famílias Vinculadas:**
  * Ao fazer login como cuidador, a tela principal **deve exibir apenas as famílias/idosos com os quais ele possui vínculo ativo ou convite aprovado**.
  * Bloquear o acesso a dados sensíveis de famílias sem contrato ou vínculo confirmado.
* **Card da Família Vinculada:**
  * Exibir nome do contratante, idoso assistido, endereço/região, principais cuidados e botão de ação rápida (ex.: "Ver Ficha Completa" ou "Iniciar Plantão").

---

## 2. Sistema de Notificações em Tempo Real
Implementar uma central de notificações (ícone de sino com badge de contagem) com os seguintes gatilhos:

* **Para o Cuidador:**
  * Nova solicitação de contratação recebida de uma família (com botões de **Aceitar** ou **Recusar** diretamente no card/notificação).
  * Confirmação de novo vínculo ativado.
* **Para a Família / Contratante:**
  * Alerta de resposta do cuidador (se aceitou ou recusou a proposta).
  * Notificação de início/término de turno ou atualizações importantes de rotina.
* **Comportamento Visual:**
  * Banner ou toast animado ao receber nova ação.
  * Histórico de notificações lidas e não lidas.

---

## 3. Módulo de Feedbacks e Avaliações de Clientes Anteriores
* **Seção de Avaliações no Perfil do Cuidador:**
  * Média geral de estrelas (1 a 5 estrelas) e total de atendimentos realizados.
  * Lista de depoimentos reais de contratantes anteriores contendo:
    * Nome do contratante (com foto/avatar).
    * Data da avaliação.
    * Nota atribuída.
    * Comentário sobre pontualidade, carinho, paciência e competência técnica.
    * Tags de destaque (ex.: *"Especialista em Alzheimer"*, *"Muito pontual"*, *"Paciente"*).
* **Modal de Envio de Feedback:**
  * Liberado para a família após a conclusão de um atendimento ou ciclo de contratação.

---

## 4. Sincronização Dinâmica da Aba de Cuidadores
* **Atualização em Tempo Real (Reatividade):**
  * Ao cadastrar um novo cuidador, a aba/página pública de busca de cuidadores deve ser atualizada imediatamente, sem a necessidade de recarregar a página inteira.
* **Card de Apresentação na Listagem:**
  * Foto de perfil, nome, especialidades/experiências, selo de verificado, nota média de feedback e botão "Solicitar Contratação".
* **Filtros Dinâmicos:**
  * Busca por nome, especialidade médica, disponibilidade (diurno/noturno/plantão) e faixa de preço.

---

## 🛠️ Critérios Técnicos de Entrega
1. Gestão de estado reativa para atualizar as listas e notificações instantaneamente.
2. Armazenamento estruturado relacionando `ID_Cuidador` com `ID_Familia` e `Status_Vinculo` (`pendente`, `ativo`, `encerrado`).
3. Interface limpa, humanizada e com feedback visual imediato para cada ação do usuário.


<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cuidadores Disponíveis | Cuidado & Acolhimento</title>

  <!-- Favicon Integrado -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>">

  <!-- Fonte Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <style>
    :root {
      --primary: #2563eb;
      --primary-hover: #1d4ed8;
      --primary-light: #eff6ff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
      --bg-page: #f8fafc;
      --card-bg: #ffffff;
      --star-color: #f59e0b;
      --success: #10b981;
      --radius: 14px;
      --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', sans-serif;
    }

    body {
      background-color: var(--bg-page);
      color: var(--text-main);
      padding: 32px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Topo & Barra de Ações */
    .page-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 28px;
    }

    .page-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .page-header p {
      color: var(--text-muted);
      font-size: 0.95rem;
      margin-top: 4px;
    }

    .btn-add {
      background: var(--primary);
      color: #fff;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: var(--transition);
    }

    .btn-add:hover {
      background: var(--primary-hover);
      transform: translateY(-2px);
    }

    /* Filtros e Busca */
    .filter-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      min-width: 260px;
      padding: 12px 16px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      background: #fff;
      outline: none;
      font-size: 0.95rem;
      transition: var(--transition);
    }

    .search-input:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    /* Grid de Cuidadores */
    .caregivers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    /* Card de Cuidador */
    .caregiver-card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius);
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: var(--transition);
      animation: fadeIn 0.3s ease-out;
    }

    .caregiver-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .card-top {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .caregiver-info h2 {
      font-size: 1.15rem;
      font-weight: 600;
      color: var(--text-main);
    }

    .experience {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
    }

    .stars {
      color: var(--star-color);
      font-size: 0.95rem;
    }

    .rating-score {
      font-weight: 700;
      font-size: 0.88rem;
    }

    .review-count {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Tags */
    .specialties {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 16px;
    }

    .tag {
      background: var(--primary-light);
      color: var(--primary);
      font-size: 0.78rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
    }

    /* Seção de Feedback Recente */
    .feedback-preview {
      background: #f8fafc;
      border-left: 3px solid var(--primary);
      border-radius: 4px;
      padding: 10px 14px;
      margin-bottom: 20px;
      font-size: 0.85rem;
    }

    .feedback-text {
      color: #334155;
      font-style: italic;
      line-height: 1.4;
      margin-bottom: 6px;
    }

    .feedback-author {
      font-weight: 600;
      color: var(--text-muted);
      font-size: 0.78rem;
    }

    /* Rodapé do Card */
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-color);
      padding-top: 16px;
      margin-top: auto;
    }

    .hourly-rate {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .hourly-rate span {
      font-size: 0.8rem;
      font-weight: 400;
      color: var(--text-muted);
    }

    .btn-hire {
      background: var(--primary);
      color: #fff;
      border: none;
      padding: 9px 16px;
      border-radius: 6px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
    }

    .btn-hire:hover {
      background: var(--primary-hover);
    }

    /* Modais */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.5);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 100;
      padding: 16px;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-box {
      background: #fff;
      width: 100%;
      max-width: 480px;
      border-radius: var(--radius);
      padding: 28px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      animation: modalPop 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes modalPop {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      font-size: 1.3rem;
      font-weight: 700;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.4rem;
      cursor: pointer;
      color: var(--text-muted);
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      margin-bottom: 6px;
    }

    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
    }

    .form-group input:focus, .form-group textarea:focus {
      border-color: var(--primary);
    }

    /* Toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 14px 20px;
      border-radius: 8px;
      background: var(--success);
      color: #fff;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 200;
    }

    .toast.show {
      transform: translateY(0);
      opacity: 1;
    }
  </style>
</head>
<body>

  <div class="container">
    <!-- Topo -->
    <header class="page-header">
      <div>
        <h1>Cuidadores Especializados</h1>
        <p>Encontre profissionais qualificados para o cuidado do seu familiar.</p>
      </div>
      <button class="btn-add" id="btnOpenAddModal">
        <span>+</span> Cadastrar Novo Cuidador
      </button>
    </header>

    <!-- Filtros de Busca -->
    <div class="filter-bar">
      <input type="text" id="searchInput" class="search-input" placeholder="Buscar por nome ou especialidade (ex.: Alzheimer, Parkinson)...">
    </div>

    <!-- Grade Reativa de Cuidadores -->
    <main class="caregivers-grid" id="caregiversGrid"></main>
  </div>

  <!-- Modal: Contratação / Solicitação de Vínculo -->
  <div class="modal-overlay" id="hireModal">
    <div class="modal-box">
      <div class="modal-header">
        <h2 id="hireModalTitle">Solicitar Contratação</h2>
        <button class="btn-close" onclick="closeModal('hireModal')">&times;</button>
      </div>
      <form id="hireForm">
        <div class="form-group">
          <label>Assistido (Pai / Mãe)</label>
          <input type="text" id="hirePatientName" placeholder="Ex: Maria dos Santos (82 anos)" required>
        </div>
        <div class="form-group">
          <label>Frequência Desejada</label>
          <select id="hireFrequency" required>
            <option value="Plantão 12h (Diurno)">Plantão 12h (Diurno)</option>
            <option value="Plantão 12h (Noturno)">Plantão 12h (Noturno)</option>
            <option value="Diária Fixa (Seg a Sex)">Diária Fixa (Seg a Sex)</option>
            <option value="Acompanhamento Pontual">Acompanhamento Pontual</option>
          </select>
        </div>
        <div class="form-group">
          <label>Mensagem / Necessidades Especiais</label>
          <textarea id="hireNotes" rows="3" placeholder="Conte brevemente sobre as rotinas e medicações..."></textarea>
        </div>
        <button type="submit" class="btn-add" style="width: 100%; justify-content: center;">Enviar Proposta de Vínculo</button>
      </form>
    </div>
  </div>

  <!-- Modal: Cadastro de Novo Cuidador -->
  <div class="modal-overlay" id="addModal">
    <div class="modal-box">
      <div class="modal-header">
        <h2>Cadastrar Cuidador</h2>
        <button class="btn-close" onclick="closeModal('addModal')">&times;</button>
      </div>
      <form id="addCaregiverForm">
        <div class="form-group">
          <label>Nome Completo</label>
          <input type="text" id="newName" placeholder="Ex: Juliana Mendes" required>
        </div>
        <div class="form-group">
          <label>Anos de Experiência</label>
          <input type="number" id="newExp" placeholder="Ex: 5" min="1" required>
        </div>
        <div class="form-group">
          <label>Valor da Hora (R$)</label>
          <input type="number" id="newRate" placeholder="Ex: 35" min="10" required>
        </div>
        <div class="form-group">
          <label>Especialidades (separadas por vírgula)</label>
          <input type="text" id="newTags" placeholder="Ex: Alzheimer, Mobilidade Reduzida, Hipertensão" required>
        </div>
        <button type="submit" class="btn-add" style="width: 100%; justify-content: center;">Salvar e Atualizar Aba</button>
      </form>
    </div>
  </div>

  <!-- Notificação Toast -->
  <div class="toast" id="toast">Proposta de contratação enviada com sucesso!</div>

  <script>
    // --- Base de Dados Inicial (Reativa) ---
    const caregivers = [
      {
        id: 1,
        name: "Carla Silveira",
        initials: "CS",
        experience: "6 anos de experiência",
        rating: 4.9,
        reviewsCount: 14,
        rate: 38,
        tags: ["Alzheimer", "Cuidados Pós-Cirúrgicos", "Mobilidade"],
        latestFeedback: {
          text: "A Carla cuidou da minha mãe com um carinho ímpar. Sempre pontual e atenta aos remédios.",
          author: "Mariana R. (Filha de paciente)"
        }
      },
      {
        id: 2,
        name: "Roberto Albuquerque",
        initials: "RA",
        experience: "8 anos de experiência",
        rating: 5.0,
        reviewsCount: 22,
        rate: 45,
        tags: ["Parkinson", "Fisioterapia Leve", "Dieta Especial"],
        latestFeedback: {
          text: "Profissional extremamente capacitado para idosos com Parkinson. Nos deu muita segurança.",
          author: "Carlos E. (Filho de paciente)"
        }
      },
      {
        id: 3,
        name: "Aline Duarte",
        initials: "AD",
        experience: "4 anos de experiência",
        rating: 4.8,
        reviewsCount: 9,
        rate: 32,
        tags: ["Hipertensão", "Companhia Ativa", "Estimulação Cognitiva"],
        latestFeedback: {
          text: "Muito atenciosa e paciente. Conseguiu estimular meu pai a caminhar novamente.",
          author: "Fernanda T. (Familiar contratante)"
        }
      }
    ];

    let selectedCaregiver = null;

    // --- Renderização Dinâmica ---
    function renderStars(rating) {
      const fullStars = Math.floor(rating);
      let starsHtml = '★'.repeat(fullStars);
      if (rating % 1 !== 0) starsHtml += '☆';
      return starsHtml.padEnd(5, '☆');
    }

    function renderCaregivers(list) {
      const grid = document.getElementById('caregiversGrid');
      grid.innerHTML = '';

      if (list.length === 0) {
        grid.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1; text-align: center; padding: 40px 0;">Nenhum cuidador encontrado com esses critérios.</p>';
        return;
      }

      list.forEach(c => {
        const card = document.createElement('div');
        card.className = 'caregiver-card';
        card.innerHTML = `
          <div>
            <div class="card-top">
              <div class="avatar">${c.initials}</div>
              <div class="caregiver-info">
                <h2>${c.name}</h2>
                <div class="experience">${c.experience}</div>
                <div class="rating-row">
                  <span class="stars">${renderStars(c.rating)}</span>
                  <span class="rating-score">${c.rating.toFixed(1)}</span>
                  <span class="review-count">(${c.reviewsCount} avaliações)</span>
                </div>
              </div>
            </div>

            <div class="specialties">
              ${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>

            <div class="feedback-preview">
              <p class="feedback-text">"${c.latestFeedback.text}"</p>
              <span class="feedback-author">— ${c.latestFeedback.author}</span>
            </div>
          </div>

          <div class="card-footer">
            <div class="hourly-rate">R$ ${c.rate} <span>/ hora</span></div>
            <button class="btn-hire" onclick="openHireModal(${c.id})">Contratar</button>
          </div>
        `;
        grid.appendChild(card);
      });
    }

    // --- Filtro em Tempo Real ---
    document.getElementById('searchInput').addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      const filtered = caregivers.filter(c => 
        c.name.toLowerCase().includes(val) || 
        c.tags.some(tag => tag.toLowerCase().includes(val))
      );
      renderCaregivers(filtered);
    });

    // --- Abertura e Fechamento de Modais ---
    function openHireModal(id) {
      selectedCaregiver = caregivers.find(c => c.id === id);
      document.getElementById('hireModalTitle').textContent = `Contratar ${selectedCaregiver.name}`;
      document.getElementById('hireModal').classList.add('active');
    }

    function closeModal(modalId) {
      document.getElementById(modalId).classList.remove('active');
    }

    document.getElementById('btnOpenAddModal').addEventListener('click', () => {
      document.getElementById('addModal').classList.add('active');
    });

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
      }
    });

    // --- Submissão de Contratação (Notificação e Vínculo) ---
    document.getElementById('hireForm').addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal('hireModal');
      showToast(`Proposta enviada para ${selectedCaregiver.name}! Aguarde a confirmação de vínculo.`);
      document.getElementById('hireForm').reset();
    });

    // --- Submissão de Novo Cuidador (Atualização Reativa) ---
    document.getElementById('addCaregiverForm').addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('newName').value.trim();
      const exp = document.getElementById('newExp').value;
      const rate = document.getElementById('newRate').value;
      const tags = document.getElementById('newTags').value.split(',').map(t => t.trim()).filter(Boolean);

      const names = name.split(' ');
      const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();

      const newCaregiver = {
        id: Date.now(),
        name: name,
        initials: initials,
        experience: `${exp} anos de experiência`,
        rating: 5.0,
        reviewsCount: 1,
        rate: Number(rate),
        tags: tags.length ? tags : ["Acompanhamento Geral"],
        latestFeedback: {
          text: "Perfil recém-verificado pela plataforma com certificações validadas.",
          author: "Equipe Cuidado & Acolhimento"
        }
      };

      // Insere no início da lista e re-renderiza imediatamente
      caregivers.unshift(newCaregiver);
      renderCaregivers(caregivers);

      closeModal('addModal');
      document.getElementById('addCaregiverForm').reset();
      showToast('Cuidador cadastrado com sucesso e listagem atualizada!');
    });

    // --- Toast Utilitário ---
    function showToast(message) {
      const toast = document.getElementById('toast');
      toast.textContent = message;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3800);
    }

    // Inicialização
    renderCaregivers(caregivers);
  </script>
</body>
</html>