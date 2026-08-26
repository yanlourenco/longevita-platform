"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ToastProvider";

export interface Review {
  id: string;
  caregiverId: string;
  authorName: string;
  authorRelation: string;
  authorAvatar?: string;
  date: string;
  rating: number;
  comment: string;
  tags: string[];
}

export interface Caregiver {
  id: string;
  nome: string;
  initials: string;
  especialidade: string;
  experiencia: string;
  avaliacao: number;
  avaliacoesQtd: number;
  valorHora: number;
  foto: string;
  biografia: string;
  antecedentesChecados: boolean;
  formacaoVerificada: boolean;
  statusAprovacao?: "aprovado" | "pendente" | "rejeitado";
  disponibilidade: string;
  disponivel?: boolean;
  habilidades: string[];
  reviews: Review[];
  vinculosAtivosCount?: number;
}

export interface Assistido {
  id: string;
  familyId: string;
  familyName: string;
  familyContact: string;
  nome: string;
  idade: number;
  foto: string;
  parentesco: string;
  endereco: string;
  bairro: string;
  cidade: string;
  necessidades: string;
  comorbidades: string[];
  medicacoes: { nome: string; horario: string }[];
  rotinas: string[];
  contatoEmergencia: { nome: string; parentesco: string; telefone: string };
  frequenciaPretendida: string;
  orcamentoHora: number;
  status: "disponivel" | "vinculada" | "em_negociacao";
  cuidadorVinculadoId?: string;
  cuidadorVinculadoNome?: string;
  contratoId?: string;
  sinaisVitais?: {
    pressao: string;
    glicemia: string;
    frequenciaCardiaca?: string;
    temperatura?: string;
    atualizadoEm?: string;
  };
}

export interface Contract {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverFoto?: string;
  familyId: string;
  familyName: string;
  assistidoId: string;
  patientName: string;
  patientAge: number;
  patientAddress: string;
  careNeeds: string;
  frequency: string;
  status: "pendente" | "ativo" | "recusado" | "encerrado";
  createdAt: string;
  hourlyRate: number;
  shiftActive?: boolean;
  shiftStartedAt?: string;
  shiftEndedAt?: string;
}

export interface AppNotification {
  id: string;
  targetRole: "caregiver" | "family" | "admin";
  title: string;
  message: string;
  time: string;
  read: boolean;
  type:
    | "solicitacao"
    | "resposta_aceita"
    | "resposta_recusada"
    | "plantao_iniciado"
    | "plantao_encerrado"
    | "feedback_recebido"
    | "alerta_admin"
    | "vinculo_encerrado";
  contractId?: string;
  caregiverId?: string;
  caregiverName?: string;
  assistidoId?: string;
  patientName?: string;
}

interface AppContextType {
  userRole: "family" | "caregiver" | "admin";
  setUserRole: (role: "family" | "caregiver" | "admin") => void;
  caregivers: Caregiver[];
  contracts: Contract[];
  assistidos: Assistido[];
  notifications: AppNotification[];
  unreadCount: number;

  // Gestão de Vínculos & Contratos
  sendContractProposal: (data: {
    caregiverId: string;
    caregiverName: string;
    assistidoId?: string;
    patientName: string;
    patientAge: number;
    patientAddress: string;
    careNeeds: string;
    frequency: string;
    hourlyRate: number;
  }) => void;
  acceptContract: (contractId: string) => void;
  rejectContract: (contractId: string) => void;
  terminateContract: (contractId: string, reason?: string) => void;
  applyToOpportunity: (assistidoId: string, caregiverId: string, customMessage?: string) => void;

  // Plantões
  startShift: (contractId: string) => void;
  endShift: (contractId: string) => void;

  // Gestão de Cuidadores e Avaliações
  addCaregiver: (caregiver: Omit<Caregiver, "id" | "reviews">) => void;
  addReview: (caregiverId: string, review: Omit<Review, "id" | "caregiverId" | "date">) => void;
  approveCaregiver: (caregiverId: string) => void;

  // Gestão Clínica de Assistidos
  updateAssistido: (assistidoId: string, data: Partial<Assistido>) => void;
  addAssistido: (assistido: Omit<Assistido, "id">) => void;

  // Alertas e Notificações
  triggerDemoAlert: (title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// =========================================================================
// DADOS INICIAIS RIGOROSOS (ESTADO PADRÃO)
// =========================================================================

const INITIAL_CAREGIVERS: Caregiver[] = [
  {
    id: "cg-1",
    nome: "Ana Silva",
    initials: "AS",
    especialidade: "Especialista em Alzheimer & Idosos Acamados",
    experiencia: "8 anos de experiência",
    avaliacao: 4.95,
    avaliacoesQtd: 42,
    valorHora: 45,
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    biografia: "Enfermeira padrão com mais de 8 anos de experiência em cuidados intensivos domiciliares de alta complexidade. Focada em atendimento humanizado, estímulo cognitivo e rotinas estruturadas de reabilitação.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    statusAprovacao: "aprovado",
    disponibilidade: "Plantão Diurno e Noturno",
    disponivel: false, // Atualmente vinculada à Dona Helena
    vinculosAtivosCount: 1,
    habilidades: ["Alzheimer", "Cuidados com Sonda", "Administração de Medicamentos", "Estímulo Cognitivo"],
    reviews: [
      {
        id: "rev-1",
        caregiverId: "cg-1",
        authorName: "Mariana Albuquerque",
        authorRelation: "Filha da Dona Helena",
        date: "Há 3 dias",
        rating: 5,
        comment: "A Ana cuida da minha mãe com um carinho e dedicação impecáveis. Muito pontual e atenta a cada detalhe das medicações prescritas.",
        tags: ["Especialista em Alzheimer", "Pontualidade Rigorosa", "Atendimento Humanizado"]
      },
      {
        id: "rev-2",
        caregiverId: "cg-1",
        authorName: "Carlos Eduardo Santos",
        authorRelation: "Filho de paciente",
        date: "Há 2 semanas",
        rating: 4.9,
        comment: "Excelente profissional. Nos deu total tranquilidade durante o pós-operatório do meu pai, controlando sinais vitais com precisão.",
        tags: ["Competência Técnica", "Paciência", "Comunicação Clara"]
      }
    ]
  },
  {
    id: "cg-2",
    nome: "Carlos Eduardo Mendes",
    initials: "CM",
    especialidade: "Companhia Ativa & Reabilitação Motora",
    experiencia: "6 anos de experiência",
    avaliacao: 4.88,
    avaliacoesQtd: 35,
    valorHora: 38,
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    biografia: "Técnico de enfermagem dedicado a atividades de mobilidade, caminhada supervisionada e auxílio em rotinas diárias. Paciente, pontual e certificado em primeiros socorros geriátricos.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    statusAprovacao: "aprovado",
    disponibilidade: "Segunda a Sexta (Horário Comercial)",
    disponivel: true,
    vinculosAtivosCount: 0,
    habilidades: ["Parkinson", "Mobilidade & Caminhada", "Primeiros Socorros", "Dieta Especial"],
    reviews: [
      {
        id: "rev-3",
        caregiverId: "cg-2",
        authorName: "Roberto Silveira",
        authorRelation: "Neto de paciente",
        date: "Há 1 semana",
        rating: 5,
        comment: "O Carlos conseguiu motivar meu avô a realizar os exercícios de fisioterapia e caminhar diariamente. Excelente suporte!",
        tags: ["Reabilitação Motora", "Paciência", "Pontualidade"]
      }
    ]
  },
  {
    id: "cg-3",
    nome: "Mariana Oliveira",
    initials: "MO",
    especialidade: "Gerontologia & Cuidados Pós-Cirúrgicos",
    experiencia: "10 anos de experiência",
    avaliacao: 5.0,
    avaliacoesQtd: 58,
    valorHora: 52,
    foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    biografia: "Especialista em geriatria hospitalar e suporte domiciliar avançado. Vasta experiência no controle de sinais vitais, curativos complexos e adaptação de ambientes seguros.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    statusAprovacao: "aprovado",
    disponibilidade: "Finais de Semana & Plantões 24h",
    disponivel: true,
    vinculosAtivosCount: 0,
    habilidades: ["Curativos Complexos", "Monitoramento de PA/Glicemia", "Apoio Psicoemocional"],
    reviews: [
      {
        id: "rev-4",
        caregiverId: "cg-3",
        authorName: "Fernanda Toledo",
        authorRelation: "Sobrinha de paciente",
        date: "Há 5 dias",
        rating: 5,
        comment: "Profissional extremamente capacitada. Os curativos cicatrizaram com rapidez e perfeição graças ao rigor técnico dela.",
        tags: ["Curativos Avançados", "Rigor Técnico", "Atenção Plena"]
      }
    ]
  },
  {
    id: "cg-4",
    nome: "Fernando Bittencourt",
    initials: "FB",
    especialidade: "Cuidados Paliativos & Apoio Noturno",
    experiencia: "7 anos de experiência",
    avaliacao: 4.92,
    avaliacoesQtd: 29,
    valorHora: 48,
    foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    biografia: "Especialista em suporte noturno seguro, manejo da dor, controle hídrico e posicionamento anatômico para prevenção de úlceras de pressão.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    statusAprovacao: "aprovado",
    disponibilidade: "Plantão Noturno (19h às 07h)",
    disponivel: true,
    vinculosAtivosCount: 0,
    habilidades: ["Manejo da Dor", "Oxigenoterapia", "Posicionamento no Leito", "Suporte Noturno"],
    reviews: [
      {
        id: "rev-5",
        caregiverId: "cg-4",
        authorName: "Juliana Mendes",
        authorRelation: "Filha de paciente",
        date: "Há 3 semanas",
        rating: 4.9,
        comment: "Fernando é muito atento e cuidadoso durante a noite, proporcionando noites de sono tranquilas para toda a família.",
        tags: ["Apoio Noturno", "Atenção Plena", "Manejo da Dor"]
      }
    ]
  }
];

const INITIAL_ASSISTIDOS: Assistido[] = [
  {
    id: "ast-1",
    familyId: "fam-1",
    familyName: "Família Albuquerque Castro",
    familyContact: "(11) 98765-4321",
    nome: "Dona Helena Ribeiro de Castro",
    idade: 78,
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    parentesco: "Mãe",
    endereco: "Rua Oscar Freire, 1420 - Jardins, São Paulo",
    bairro: "Jardins",
    cidade: "São Paulo, SP",
    necessidades: "Alzheimer Leve, Aferição de Pressão 2x/dia, Dieta pastosa e auxílio na locomoção.",
    comorbidades: ["Doença de Alzheimer", "Hipertensão Arterial Sistêmica (Pressão Alta)", "Osteoporose Avançada"],
    medicacoes: [
      { nome: "Donepezila 10mg", horario: "08:00" },
      { nome: "Losartana 50mg", horario: "12:00" },
      { nome: "Quetiapina 25mg", horario: "21:00" }
    ],
    rotinas: ["Caminhada leve 15 min no jardim", "Dieta pastosa sem resíduos", "Aferição de PA e Glicemia matinal"],
    contatoEmergencia: { nome: "Dra. Mariana Albuquerque (Filha)", parentesco: "Filha", telefone: "(11) 98765-4321" },
    frequenciaPretendida: "Plantão Diurno (Segunda a Sexta)",
    orcamentoHora: 45,
    status: "vinculada",
    cuidadorVinculadoId: "cg-1",
    cuidadorVinculadoNome: "Ana Silva",
    contratoId: "contrato-1",
    sinaisVitais: {
      pressao: "12x8 mmHg",
      glicemia: "104 mg/dL",
      frequenciaCardiaca: "72 bpm",
      temperatura: "36.4 °C",
      atualizadoEm: "Hoje às 08:30"
    }
  },
  {
    id: "ast-2",
    familyId: "fam-2",
    familyName: "Família Silveira",
    familyContact: "(11) 97654-3210",
    nome: "Seu Roberto Silveira",
    idade: 82,
    foto: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
    parentesco: "Avô",
    endereco: "Av. Paulista, 900 - Bela Vista, São Paulo",
    bairro: "Bela Vista",
    cidade: "São Paulo, SP",
    necessidades: "Parkinson moderado, fisioterapia motora e caminhada supervisionada.",
    comorbidades: ["Doença de Parkinson", "Diabetes Mellitus Tipo 2"],
    medicacoes: [
      { nome: "Prolopa 200mg", horario: "07:00 / 15:00 / 22:00" },
      { nome: "Metformina 850mg", horario: "12:00" }
    ],
    rotinas: ["Fisioterapia motora", "Banho assistido com cadeira higiênica", "Exercícios de deglutição"],
    contatoEmergencia: { nome: "Carlos Eduardo Silveira (Neto)", parentesco: "Neto", telefone: "(11) 97654-3210" },
    frequenciaPretendida: "Plantão 12h Diurno",
    orcamentoHora: 38,
    status: "em_negociacao",
    cuidadorVinculadoId: "cg-2",
    cuidadorVinculadoNome: "Carlos Eduardo Mendes",
    contratoId: "contrato-2",
    sinaisVitais: {
      pressao: "13x8 mmHg",
      glicemia: "118 mg/dL",
      frequenciaCardiaca: "68 bpm",
      temperatura: "36.6 °C",
      atualizadoEm: "Hoje às 09:00"
    }
  },
  {
    id: "ast-3",
    familyId: "fam-3",
    familyName: "Família Vasconcelos",
    familyContact: "(11) 99123-4567",
    nome: "Dona Lourdes Vasconcelos",
    idade: 85,
    foto: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop",
    parentesco: "Mãe",
    endereco: "Rua Maranhão, 340 - Higienópolis, São Paulo",
    bairro: "Higienópolis",
    cidade: "São Paulo, SP",
    necessidades: "Cuidados pós-cirúrgicos de fêmur, administração de anticoagulantes, curativos e suporte emocional.",
    comorbidades: ["Osteoporose Avançada", "Hipertensão Arterial Sistêmica (Pressão Alta)"],
    medicacoes: [
      { nome: "Enoxaparina 40mg", horario: "10:00" },
      { nome: "Dipirona 500mg se dor", horario: "A cada 6h" }
    ],
    rotinas: ["Mudança de decúbito no leito", "Compressa morna articular", "Controle rigoroso de hematomas"],
    contatoEmergencia: { nome: "Patricia Vasconcelos", parentesco: "Filha", telefone: "(11) 99123-4567" },
    frequenciaPretendida: "Finais de Semana ou Plantão 24h",
    orcamentoHora: 50,
    status: "disponivel",
    sinaisVitais: {
      pressao: "12.5x8 mmHg",
      glicemia: "98 mg/dL",
      frequenciaCardiaca: "75 bpm",
      temperatura: "36.5 °C",
      atualizadoEm: "Ontem às 18:00"
    }
  },
  {
    id: "ast-4",
    familyId: "fam-4",
    familyName: "Família Fagundes",
    familyContact: "(11) 98877-6655",
    nome: "Seu Waldemar Fagundes",
    idade: 79,
    foto: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop",
    parentesco: "Pai",
    endereco: "Rua Harmonia, 520 - Vila Madalena, São Paulo",
    bairro: "Vila Madalena",
    cidade: "São Paulo, SP",
    necessidades: "Demência inicial, estímulo à memória, companhia ativa para passeios e jogos cognitivos.",
    comorbidades: ["Demência Vascular", "Baixa Visão / Glaucoma / Catarata"],
    medicacoes: [
      { nome: "Memantina 10mg", horario: "09:00" },
      { nome: "Colírio Timolol", horario: "08:00 / 20:00" }
    ],
    rotinas: ["Jogos de xadrez e cartas pela manhã", "Passeio na praça", "Leitura guiada de jornais"],
    contatoEmergencia: { nome: "Luciana Fagundes", parentesco: "Filha", telefone: "(11) 98877-6655" },
    frequenciaPretendida: "Segunda a Sexta (13h às 19h)",
    orcamentoHora: 42,
    status: "disponivel",
    sinaisVitais: {
      pressao: "12x7 mmHg",
      glicemia: "95 mg/dL",
      frequenciaCardiaca: "70 bpm",
      temperatura: "36.2 °C",
      atualizadoEm: "Hoje às 07:45"
    }
  }
];

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "contrato-1",
    caregiverId: "cg-1",
    caregiverName: "Ana Silva",
    caregiverFoto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    familyId: "fam-1",
    familyName: "Família Albuquerque Castro",
    assistidoId: "ast-1",
    patientName: "Dona Helena Ribeiro de Castro",
    patientAge: 78,
    patientAddress: "Rua Oscar Freire, 1420 - Jardins, São Paulo",
    careNeeds: "Alzheimer Leve, Aferição de Pressão 2x/dia, Dieta pastosa e auxílio na locomoção.",
    frequency: "Plantão Diurno (Segunda a Sexta)",
    status: "ativo",
    createdAt: "Hoje às 08:00",
    hourlyRate: 45,
    shiftActive: true,
    shiftStartedAt: "Hoje às 08:05"
  },
  {
    id: "contrato-2",
    caregiverId: "cg-2",
    caregiverName: "Carlos Eduardo Mendes",
    caregiverFoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    familyId: "fam-2",
    familyName: "Família Silveira",
    assistidoId: "ast-2",
    patientName: "Seu Roberto Silveira",
    patientAge: 82,
    patientAddress: "Av. Paulista, 900 - Bela Vista, São Paulo",
    careNeeds: "Parkinson moderado, fisioterapia motora e caminhada supervisionada.",
    frequency: "Plantão 12h Diurno",
    status: "pendente",
    createdAt: "Hoje às 09:15",
    hourlyRate: 38,
    shiftActive: false
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    targetRole: "family",
    title: "Plantão Presencial em Andamento",
    message: "Ana Silva realizou check-in presencial no endereço de Dona Helena com validação de geolocalização.",
    time: "Hoje às 08:05",
    read: false,
    type: "plantao_iniciado",
    contractId: "contrato-1",
    caregiverName: "Ana Silva",
    patientName: "Dona Helena"
  },
  {
    id: "notif-2",
    targetRole: "caregiver",
    title: "Nova Solicitação de Vínculo Contratual",
    message: "A Família Silveira enviou uma proposta de plantão diurno para Seu Roberto (R$ 38/h).",
    time: "Hoje às 09:15",
    read: false,
    type: "solicitacao",
    contractId: "contrato-2",
    caregiverName: "Carlos Eduardo Mendes",
    patientName: "Seu Roberto"
  }
];

const STORAGE_KEY_CAREGIVERS = "longevita_v3_caregivers";
const STORAGE_KEY_ASSISTIDOS = "longevita_v3_assistidos";
const STORAGE_KEY_CONTRACTS = "longevita_v3_contracts";
const STORAGE_KEY_NOTIFICATIONS = "longevita_v3_notifications";
const STORAGE_KEY_ROLE = "longevita_v3_role";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { success, info, error: toastError } = useToast();

  const [userRole, setUserRoleState] = useState<"family" | "caregiver" | "admin">("family");
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);
  const [assistidos, setAssistidos] = useState<Assistido[]>(INITIAL_ASSISTIDOS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hidratação a partir do LocalStorage no cliente
  useEffect(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE);
      if (savedRole && ["family", "caregiver", "admin"].includes(savedRole)) {
        setUserRoleState(savedRole as any);
      }
      const savedCaregivers = localStorage.getItem(STORAGE_KEY_CAREGIVERS);
      if (savedCaregivers) {
        setCaregivers(JSON.parse(savedCaregivers));
      }
      const savedAssistidos = localStorage.getItem(STORAGE_KEY_ASSISTIDOS);
      if (savedAssistidos) {
        setAssistidos(JSON.parse(savedAssistidos));
      }
      const savedContracts = localStorage.getItem(STORAGE_KEY_CONTRACTS);
      if (savedContracts) {
        setContracts(JSON.parse(savedContracts));
      }
      const savedNotifs = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
      }
    } catch (err) {
      console.warn("Falha ao recuperar dados do localStorage:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persistência automática
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, userRole);
      localStorage.setItem(STORAGE_KEY_CAREGIVERS, JSON.stringify(caregivers));
      localStorage.setItem(STORAGE_KEY_ASSISTIDOS, JSON.stringify(assistidos));
      localStorage.setItem(STORAGE_KEY_CONTRACTS, JSON.stringify(contracts));
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(notifications));
    } catch (err) {
      console.warn("Falha ao salvar no localStorage:", err);
    }
  }, [userRole, caregivers, assistidos, contracts, notifications, isHydrated]);

  const setUserRole = (role: "family" | "caregiver" | "admin") => {
    setUserRoleState(role);
  };

  // Contador de não lidas para o papel ativo
  const unreadCount = notifications.filter(
    (n) => !n.read && (userRole === "admin" || n.targetRole === userRole || n.targetRole === "family")
  ).length;

  // 1. Família envia proposta de vínculo para o Cuidador
  const sendContractProposal = (data: {
    caregiverId: string;
    caregiverName: string;
    assistidoId?: string;
    patientName: string;
    patientAge: number;
    patientAddress: string;
    careNeeds: string;
    frequency: string;
    hourlyRate: number;
  }) => {
    const contractId = `contrato-${Date.now()}`;
    const targetAssistidoId = data.assistidoId || "ast-1";

    const targetCaregiver = caregivers.find((c) => c.id === data.caregiverId);

    const newContract: Contract = {
      id: contractId,
      caregiverId: data.caregiverId,
      caregiverName: data.caregiverName,
      caregiverFoto: targetCaregiver?.foto,
      familyId: "fam-1",
      familyName: "Família Albuquerque Castro",
      assistidoId: targetAssistidoId,
      patientName: data.patientName,
      patientAge: data.patientAge,
      patientAddress: data.patientAddress,
      careNeeds: data.careNeeds,
      frequency: data.frequency,
      status: "pendente",
      createdAt: "Agora mesmo",
      hourlyRate: data.hourlyRate,
      shiftActive: false
    };

    // Atualiza status do assistido para em negociação
    setAssistidos((prev) =>
      prev.map((a) =>
        a.id === targetAssistidoId
          ? {
              ...a,
              status: "em_negociacao",
              cuidadorVinculadoId: data.caregiverId,
              cuidadorVinculadoNome: data.caregiverName,
              contratoId: contractId
            }
          : a
      )
    );

    setContracts((prev) => [newContract, ...prev]);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "caregiver",
      title: "Nova Solicitação de Vínculo",
      message: `Proposta recebida para o acompanhamento de ${data.patientName} (${data.frequency} - R$ ${data.hourlyRate}/h).`,
      time: "Agora mesmo",
      read: false,
      type: "solicitacao",
      contractId: contractId,
      caregiverId: data.caregiverId,
      caregiverName: data.caregiverName,
      assistidoId: targetAssistidoId,
      patientName: data.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Proposta de Vínculo Enviada", `O profissional ${data.caregiverName} recebeu a notificação com os termos contratuais.`);
  };

  // 2. Cuidador Aceita o Vínculo (Reatividade Imediata: Família sai da vitrine pública de oportunidades)
  const acceptContract = (contractId: string) => {
    const targetContract = contracts.find((c) => c.id === contractId);
    if (!targetContract) return;

    // Atualiza contrato para Ativo
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, status: "ativo" } : c))
    );

    // Marca o assistido/família como "vinculada" -> DESAPARECE AUTOMATICAMENTE DAS OPORTUNIDADES
    setAssistidos((prev) =>
      prev.map((a) => {
        if (a.id === targetContract.assistidoId || a.nome === targetContract.patientName) {
          return {
            ...a,
            status: "vinculada",
            cuidadorVinculadoId: targetContract.caregiverId,
            cuidadorVinculadoNome: targetContract.caregiverName,
            contratoId: contractId
          };
        }
        return a;
      })
    );

    // Atualiza disponibilidade e contagem do Cuidador
    setCaregivers((prev) =>
      prev.map((cg) => {
        if (cg.id === targetContract.caregiverId) {
          const newCount = (cg.vinculosAtivosCount || 0) + 1;
          return {
            ...cg,
            vinculosAtivosCount: newCount,
            disponivel: newCount < 2 // Ex: se atingir capacidade máxima
          };
        }
        return cg;
      })
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Proposta de Contrato Aprovada",
      message: `${targetContract.caregiverName} aceitou a proposta de atendimento para ${targetContract.patientName}. O vínculo está ativo e formalizado sob conformidade LGPD.`,
      time: "Agora mesmo",
      read: false,
      type: "resposta_aceita",
      contractId: contractId,
      caregiverName: targetContract.caregiverName,
      patientName: targetContract.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Vínculo Contratual Ativado", "O contrato foi formalizado com sucesso e a família foi informada.");
  };

  // 3. Cuidador Recusa o Vínculo
  const rejectContract = (contractId: string) => {
    const targetContract = contracts.find((c) => c.id === contractId);
    if (!targetContract) return;

    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, status: "recusado" } : c))
    );

    // Restaura o assistido para "disponivel"
    setAssistidos((prev) =>
      prev.map((a) => {
        if (a.id === targetContract.assistidoId || a.nome === targetContract.patientName) {
          return {
            ...a,
            status: "disponivel",
            cuidadorVinculadoId: undefined,
            cuidadorVinculadoNome: undefined,
            contratoId: undefined
          };
        }
        return a;
      })
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Indisponibilidade Informada",
      message: `${targetContract.caregiverName} não possui disponibilidade na grade de horários solicitada para ${targetContract.patientName}.`,
      time: "Agora mesmo",
      read: false,
      type: "resposta_recusada",
      contractId: contractId,
      caregiverName: targetContract.caregiverName,
      patientName: targetContract.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    info("Proposta Recusada", "A família foi informada da indisponibilidade na agenda.");
  };

  // 4. Encerrar / Desfazer Vínculo (Single Source of Truth: Família e Cuidador retornam à vitrine pública de disponíveis)
  const terminateContract = (contractId: string, reason?: string) => {
    const targetContract = contracts.find((c) => c.id === contractId);
    if (!targetContract) return;

    // 1. Marca contrato como encerrado
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId
          ? { ...c, status: "encerrado", shiftActive: false, shiftEndedAt: "Agora" }
          : c
      )
    );

    // 2. Restaura o assistido/família para status "disponivel" (VOLTA À VITRINE PÚBLICA COM ANIMAÇÃO)
    setAssistidos((prev) =>
      prev.map((a) => {
        if (a.id === targetContract.assistidoId || a.nome === targetContract.patientName) {
          return {
            ...a,
            status: "disponivel",
            cuidadorVinculadoId: undefined,
            cuidadorVinculadoNome: undefined,
            contratoId: undefined
          };
        }
        return a;
      })
    );

    // 3. Restaura o cuidador para status disponivel: true
    setCaregivers((prev) =>
      prev.map((cg) => {
        if (cg.id === targetContract.caregiverId) {
          const newCount = Math.max(0, (cg.vinculosAtivosCount || 1) - 1);
          return {
            ...cg,
            vinculosAtivosCount: newCount,
            disponivel: true
          };
        }
        return cg;
      })
    );

    // 4. Emite notificações de encerramento
    const notifFam: AppNotification = {
      id: `notif-enc-fam-${Date.now()}`,
      targetRole: "family",
      title: "Vínculo Contratual Encerrado",
      message: `O contrato de atendimento com ${targetContract.caregiverName} foi encerrado. ${targetContract.patientName} está novamente listado para novos cuidadores.`,
      time: "Agora mesmo",
      read: false,
      type: "vinculo_encerrado",
      contractId
    };

    const notifCg: AppNotification = {
      id: `notif-enc-cg-${Date.now()}`,
      targetRole: "caregiver",
      title: "Atendimento Finalizado",
      message: `O vínculo com a ${targetContract.familyName} (${targetContract.patientName}) foi concluído. Sua agenda está aberta para novas oportunidades.`,
      time: "Agora mesmo",
      read: false,
      type: "vinculo_encerrado",
      contractId
    };

    setNotifications((prev) => [notifFam, notifCg, ...prev]);
    info("Vínculo Encerrado", "O contrato foi finalizado. Família e Cuidador estão disponíveis novamente no ecossistema.");
  };

  // 5. Cuidador se candidata a uma família na vitrine de Oportunidades
  const applyToOpportunity = (assistidoId: string, caregiverId: string, customMessage?: string) => {
    const targetAst = assistidos.find((a) => a.id === assistidoId);
    const targetCg = caregivers.find((c) => c.id === caregiverId);
    if (!targetAst || !targetCg) return;

    const contractId = `contrato-${Date.now()}`;

    const newContract: Contract = {
      id: contractId,
      caregiverId: targetCg.id,
      caregiverName: targetCg.nome,
      caregiverFoto: targetCg.foto,
      familyId: targetAst.familyId,
      familyName: targetAst.familyName,
      assistidoId: targetAst.id,
      patientName: targetAst.nome,
      patientAge: targetAst.idade,
      patientAddress: targetAst.endereco,
      careNeeds: targetAst.necessidades,
      frequency: targetAst.frequenciaPretendida,
      status: "pendente",
      createdAt: "Agora mesmo",
      hourlyRate: targetCg.valorHora,
      shiftActive: false
    };

    setContracts((prev) => [newContract, ...prev]);

    setAssistidos((prev) =>
      prev.map((a) =>
        a.id === assistidoId
          ? {
              ...a,
              status: "em_negociacao",
              cuidadorVinculadoId: targetCg.id,
              cuidadorVinculadoNome: targetCg.nome,
              contratoId: contractId
            }
          : a
      )
    );

    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Nova Candidatura de Cuidador",
      message: `${targetCg.nome} (${targetCg.especialidade}) manifestou interesse em acompanhar ${targetAst.nome}.`,
      time: "Agora mesmo",
      read: false,
      type: "solicitacao",
      contractId,
      caregiverName: targetCg.nome,
      patientName: targetAst.nome
    };

    setNotifications((prev) => [notif, ...prev]);
    success("Candidatura Enviada", `Sua proposta foi transmitida para a ${targetAst.familyName}.`);
  };

  // 6. Iniciar Plantão
  const startShift = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId ? { ...c, shiftActive: true, shiftStartedAt: "Agora" } : c
      )
    );

    const contract = contracts.find((c) => c.id === contractId);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Início de Plantão Presencial",
      message: `${contract?.caregiverName} iniciou o atendimento presencial de ${contract?.patientName} (Geofencing e horário validados).`,
      time: "Agora mesmo",
      read: false,
      type: "plantao_iniciado",
      contractId,
      caregiverName: contract?.caregiverName,
      patientName: contract?.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Plantão Registrado", "Check-in presencial confirmado com sucesso.");
  };

  // 7. Encerrar Plantão
  const endShift = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId ? { ...c, shiftActive: false, shiftEndedAt: "Agora" } : c
      )
    );

    const contract = contracts.find((c) => c.id === contractId);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Plantão Concluído",
      message: `${contract?.caregiverName} finalizou o turno de atendimento de ${contract?.patientName}. O relatório de rotinas está disponível no Diário de Bordo.`,
      time: "Agora mesmo",
      read: false,
      type: "plantao_encerrado",
      contractId,
      caregiverName: contract?.caregiverName,
      patientName: contract?.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Plantão Concluído", "Relatório de rotina salvo no Diário de Bordo.");
  };

  // 8. Cadastro de Novo Cuidador
  const addCaregiver = (newCg: Omit<Caregiver, "id" | "reviews">) => {
    const names = newCg.nome.trim().split(" ");
    const initials =
      names.length > 1
        ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
        : newCg.nome.slice(0, 2).toUpperCase();

    const created: Caregiver = {
      ...newCg,
      id: `cg-${Date.now()}`,
      initials,
      disponivel: true,
      vinculosAtivosCount: 0,
      statusAprovacao: "aprovado",
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          caregiverId: `cg-${Date.now()}`,
          authorName: "Auditoria LongeVita",
          authorRelation: "Homologação Técnica",
          date: "Hoje",
          rating: 5,
          comment: "Profissional credenciado com antecedentes criminais e certificados técnicos verificados.",
          tags: ["Verificação Oficial", "Certificação Validada"]
        }
      ]
    };

    setCaregivers((prev) => [created, ...prev]);
    success("Profissional Cadastrado", `${created.nome} foi adicionado(a) e está visível na plataforma.`);
  };

  // 9. Envio de Feedback e Avaliação
  const addReview = (caregiverId: string, reviewData: Omit<Review, "id" | "caregiverId" | "date">) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      caregiverId,
      date: "Hoje",
      ...reviewData
    };

    setCaregivers((prev) =>
      prev.map((cg) => {
        if (cg.id === caregiverId) {
          const updatedReviews = [newRev, ...cg.reviews];
          const newAvg = updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length;
          return {
            ...cg,
            reviews: updatedReviews,
            avaliacao: Number(newAvg.toFixed(2)),
            avaliacoesQtd: cg.avaliacoesQtd + 1
          };
        }
        return cg;
      })
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "caregiver",
      title: "Nova Avaliação Recebida",
      message: `${reviewData.authorName} publicou uma avaliação de ${reviewData.rating.toFixed(1)} estrelas sobre o seu atendimento.`,
      time: "Agora mesmo",
      read: false,
      type: "feedback_recebido"
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Avaliação Registrada", "Obrigado por contribuir com a qualidade do cuidado LongeVita.");
  };

  // 10. Atualização Clínica do Assistido
  const updateAssistido = (assistidoId: string, data: Partial<Assistido>) => {
    setAssistidos((prev) =>
      prev.map((a) => (a.id === assistidoId ? { ...a, ...data } : a))
    );
    success("Prontuário Atualizado", "Os dados clínicos e rotinas foram salvos com sucesso.");
  };

  // 11. Cadastro de Novo Assistido
  const addAssistido = (newAst: Omit<Assistido, "id">) => {
    const created: Assistido = {
      ...newAst,
      id: `ast-${Date.now()}`
    };
    setAssistidos((prev) => [created, ...prev]);
    success("Assistido Cadastrado", `${created.nome} foi cadastrado(a) e está disponível na plataforma.`);
  };

  // 12. Aprovação Administrativa de Cuidador
  const approveCaregiver = (caregiverId: string) => {
    setCaregivers((prev) =>
      prev.map((cg) =>
        cg.id === caregiverId
          ? { ...cg, antecedentesChecados: true, formacaoVerificada: true, statusAprovacao: "aprovado" }
          : cg
      )
    );
    success("Cuidador Homologado", "Antecedentes e credenciais técnicas validados.");
  };

  // 13. Gatilho de Alerta para Demonstração Executiva
  const triggerDemoAlert = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "admin",
      title,
      message,
      time: "Agora mesmo",
      read: false,
      type: "alerta_admin"
    };
    setNotifications((prev) => [newNotif, ...prev]);
    info(title, message);
  };

  // 14. Marcar Notificações
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Resetar para dados padrão caso necessário
  const resetToDefaultData = () => {
    setCaregivers(INITIAL_CAREGIVERS);
    setAssistidos(INITIAL_ASSISTIDOS);
    setContracts(INITIAL_CONTRACTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUserRoleState("family");
    localStorage.clear();
    info("Dados Restaurados", "O ecossistema foi restaurado para os dados iniciais padrão.");
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        caregivers,
        contracts,
        assistidos,
        notifications,
        unreadCount,
        sendContractProposal,
        acceptContract,
        rejectContract,
        terminateContract,
        applyToOpportunity,
        startShift,
        endShift,
        addCaregiver,
        addReview,
        approveCaregiver,
        updateAssistido,
        addAssistido,
        triggerDemoAlert,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp deve ser utilizado dentro de um AppProvider");
  }
  return context;
}
