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
  habilidades: string[];
  reviews: Review[];
}

export interface Contract {
  id: string;
  caregiverId: string;
  caregiverName: string;
  familyId: string;
  familyName: string;
  patientName: string;
  patientAge: number;
  patientAddress: string;
  careNeeds: string;
  frequency: string;
  status: "pendente" | "ativo" | "recusado" | "encerrado";
  createdAt: string;
  hourlyRate: number;
  shiftActive?: boolean;
}

export interface AppNotification {
  id: string;
  targetRole: "caregiver" | "family" | "admin";
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "solicitacao" | "resposta_aceita" | "resposta_recusada" | "plantao_iniciado" | "plantao_encerrado" | "feedback_recebido" | "alerta_admin";
  contractId?: string;
  caregiverId?: string;
  caregiverName?: string;
  patientName?: string;
}

interface AppContextType {
  userRole: "family" | "caregiver" | "admin";
  setUserRole: (role: "family" | "caregiver" | "admin") => void;
  caregivers: Caregiver[];
  contracts: Contract[];
  notifications: AppNotification[];
  unreadCount: number;
  sendContractProposal: (data: {
    caregiverId: string;
    caregiverName: string;
    patientName: string;
    patientAge: number;
    patientAddress: string;
    careNeeds: string;
    frequency: string;
    hourlyRate: number;
  }) => void;
  acceptContract: (contractId: string) => void;
  rejectContract: (contractId: string) => void;
  startShift: (contractId: string) => void;
  endShift: (contractId: string) => void;
  addCaregiver: (caregiver: Omit<Caregiver, "id" | "reviews">) => void;
  addReview: (caregiverId: string, review: Omit<Review, "id" | "caregiverId" | "date">) => void;
  approveCaregiver: (caregiverId: string) => void;
  triggerDemoAlert: (title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dados Iniciais Ricos
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
    biografia: "Enfermeira padrão com mais de 8 anos de experiência em cuidados intensivos domiciliares de alta complexidade. Focada em atendimento humanizado e rotinas estruturadas.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    statusAprovacao: "aprovado",
    disponibilidade: "Plantão Diurno e Noturno",
    habilidades: ["Alzheimer", "Cuidados com Sonda", "Administração de Medicamentos", "Estímulo Cognitivo"],
    reviews: [
      {
        id: "rev-1",
        caregiverId: "cg-1",
        authorName: "Mariana Albuquerque",
        authorRelation: "Filha da Dona Helena",
        date: "Há 3 dias",
        rating: 5,
        comment: "A Ana cuidou da minha mãe com um carinho e dedicação impecáveis. Muito pontual e atenta a cada detalhe das medicações.",
        tags: ["Especialista em Alzheimer", "Muito Pontual", "Carinhosa"]
      },
      {
        id: "rev-2",
        caregiverId: "cg-1",
        authorName: "Carlos Eduardo Santos",
        authorRelation: "Filho de paciente",
        date: "Há 2 semanas",
        rating: 4.9,
        comment: "Excelente profissional. Nos deu total tranquilidade durante o pós-operatório do meu pai.",
        tags: ["Competência Técnica", "Paciente", "Comunicação Clara"]
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
    biografia: "Técnico de enfermagem dedicado a atividades recreativas, mobilidade e auxílio em rotinas diárias. Paciente, pontual e certificado em primeiros socorros geriátricos.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    statusAprovacao: "aprovado",
    disponibilidade: "Segunda a Sexta (Horário Comercial)",
    habilidades: ["Parkinson", "Mobilidade & Caminhada", "Primeiros Socorros", "Dieta Especial"],
    reviews: [
      {
        id: "rev-3",
        caregiverId: "cg-2",
        authorName: "Roberto Silveira",
        authorRelation: "Neto de paciente",
        date: "Há 1 semana",
        rating: 5,
        comment: "O Carlos conseguiu motivar meu avô a fazer os exercícios de fisioterapia e caminhar no jardim. Nota 10!",
        tags: ["Reabilitação Motora", "Paciente", "Pontual"]
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
    habilidades: ["Curativos Complexos", "Monitoramento de PA/Glicemia", "Apoio Psicoemocional"],
    reviews: [
      {
        id: "rev-4",
        caregiverId: "cg-3",
        authorName: "Fernanda Toledo",
        authorRelation: "Sobrinha de paciente",
        date: "Há 5 dias",
        rating: 5,
        comment: "Profissional extremamente capacitada e carinhosa. Os curativos cicatrizaram perfeitamente graças aos cuidados dela.",
        tags: ["Curativos Perfeitos", "Competência Técnica", "Atenciosa"]
      }
    ]
  }
];

const INITIAL_CONTRACTS: Contract[] = [
  {
    id: "contrato-1",
    caregiverId: "cg-1",
    caregiverName: "Ana Silva",
    familyId: "fam-1",
    familyName: "Família Albuquerque Castro",
    patientName: "Dona Helena Ribeiro de Castro",
    patientAge: 78,
    patientAddress: "Rua Oscar Freire, 1420 - Jardins, São Paulo",
    careNeeds: "Alzheimer Leve, Aferição de Pressão 2x/dia, Dieta pastosa e auxílio na locomoção.",
    frequency: "Plantão Diurno (Segunda a Sexta)",
    status: "ativo",
    createdAt: "Hoje às 08:00",
    hourlyRate: 45,
    shiftActive: true
  },
  {
    id: "contrato-2",
    caregiverId: "cg-2",
    caregiverName: "Carlos Eduardo Mendes",
    familyId: "fam-2",
    familyName: "Família Silveira",
    patientName: "Seu Roberto Albuquerque",
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
    title: "Plantão em Andamento 🟢",
    message: "Ana Silva realizou check-in presencial no endereço da Dona Helena (Geofencing OK).",
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
    title: "Nova Solicitação de Vínculo",
    message: "A Família Silveira enviou uma proposta de plantão diurno para Seu Roberto (R$ 38/h).",
    time: "Hoje às 09:15",
    read: false,
    type: "solicitacao",
    contractId: "contrato-2",
    caregiverName: "Carlos Eduardo Mendes",
    patientName: "Seu Roberto"
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { success, info, error: toastError } = useToast();

  const [userRole, setUserRole] = useState<"family" | "caregiver" | "admin">("admin");
  const [caregivers, setCaregivers] = useState<Caregiver[]>(INITIAL_CAREGIVERS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Contador de não lidas para o papel ativo
  const unreadCount = notifications.filter(
    (n) => !n.read && (userRole === "admin" || n.targetRole === userRole || n.targetRole === "family")
  ).length;

  // 1. Família envia proposta de vínculo para o Cuidador
  const sendContractProposal = (data: {
    caregiverId: string;
    caregiverName: string;
    patientName: string;
    patientAge: number;
    patientAddress: string;
    careNeeds: string;
    frequency: string;
    hourlyRate: number;
  }) => {
    const contractId = `contrato-${Date.now()}`;
    const newContract: Contract = {
      id: contractId,
      caregiverId: data.caregiverId,
      caregiverName: data.caregiverName,
      familyId: "fam-logada",
      familyName: "Família Contratante",
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

    setContracts((prev) => [newContract, ...prev]);

    // Cria notificação para o Cuidador
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "caregiver",
      title: "Nova Solicitação de Contratação!",
      message: `Proposta recebida para cuidar de ${data.patientName} (${data.frequency} - R$ ${data.hourlyRate}/h).`,
      time: "Agora mesmo",
      read: false,
      type: "solicitacao",
      contractId: contractId,
      caregiverId: data.caregiverId,
      caregiverName: data.caregiverName,
      patientName: data.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Proposta de Vínculo Enviada!", `O cuidador ${data.caregiverName} recebeu a notificação com os botões de Aceitar/Recusar.`);
  };

  // 2. Cuidador Aceita o Vínculo
  const acceptContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, status: "ativo" } : c))
    );

    const contract = contracts.find((c) => c.id === contractId);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Proposta Aceita! 🎉",
      message: `${contract?.caregiverName || "O cuidador"} aceitou sua proposta de contratação para ${contract?.patientName}. O vínculo está ativo sob conformidade LGPD.`,
      time: "Agora mesmo",
      read: false,
      type: "resposta_aceita",
      contractId: contractId,
      caregiverName: contract?.caregiverName,
      patientName: contract?.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Vínculo Aprovado!", "O contrato está ativo e a família foi notificada imediatamente.");
  };

  // 3. Cuidador Recusa o Vínculo
  const rejectContract = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, status: "recusado" } : c))
    );

    const contract = contracts.find((c) => c.id === contractId);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Proposta Recusada",
      message: `${contract?.caregiverName || "O cuidador"} não possui disponibilidade para o período solicitado.`,
      time: "Agora mesmo",
      read: false,
      type: "resposta_recusada",
      contractId: contractId,
      caregiverName: contract?.caregiverName,
      patientName: contract?.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    info("Proposta Recusada", "A família foi informada da indisponibilidade.");
  };

  // 4. Iniciar Plantão
  const startShift = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, shiftActive: true } : c))
    );

    const contract = contracts.find((c) => c.id === contractId);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Plantão Iniciado 🟢",
      message: `${contract?.caregiverName} iniciou o atendimento de ${contract?.patientName} (Geofencing validado).`,
      time: "Agora mesmo",
      read: false,
      type: "plantao_iniciado",
      contractId,
      caregiverName: contract?.caregiverName,
      patientName: contract?.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Plantão Iniciado!", "Geolocalização validada e família notificada.");
  };

  // 5. Encerrar Plantão
  const endShift = (contractId: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === contractId ? { ...c, shiftActive: false } : c))
    );

    const contract = contracts.find((c) => c.id === contractId);

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: "family",
      title: "Plantão Concluído com Sucesso ✅",
      message: `${contract?.caregiverName} finalizou o turno com relatório completo no Diário de Bordo. Que tal deixar uma avaliação?`,
      time: "Agora mesmo",
      read: false,
      type: "plantao_encerrado",
      contractId,
      caregiverName: contract?.caregiverName,
      patientName: contract?.patientName
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Plantão Finalizado!", "Relatório diário salvo com sucesso.");
  };

  // 6. Cadastro de Novo Cuidador com Atualização Reativa Imediata
  const addCaregiver = (newCg: Omit<Caregiver, "id" | "reviews">) => {
    const names = newCg.nome.trim().split(" ");
    const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : newCg.nome.slice(0, 2).toUpperCase();

    const created: Caregiver = {
      ...newCg,
      id: `cg-${Date.now()}`,
      initials,
      statusAprovacao: "aprovado",
      reviews: [
        {
          id: `rev-init-${Date.now()}`,
          caregiverId: `cg-${Date.now()}`,
          authorName: "Equipe LongeVita",
          authorRelation: "Validação Oficial",
          date: "Hoje",
          rating: 5,
          comment: "Profissional credenciado com antecedentes criminais e certificados 100% verificados.",
          tags: ["Verificação Oficial", "Documentação OK"]
        }
      ]
    };

    setCaregivers((prev) => [created, ...prev]);
    success("Cuidador Cadastrado!", `${created.nome} foi adicionado(a) e a listagem foi atualizada em tempo real.`);
  };

  // 7. Envio de Feedback e Avaliação
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
      title: "Nova Avaliação Recebida! ⭐",
      message: `${reviewData.authorName} avaliou seu atendimento com nota ${reviewData.rating.toFixed(1)} estrelas: "${reviewData.comment}"`,
      time: "Agora mesmo",
      read: false,
      type: "feedback_recebido"
    };

    setNotifications((prev) => [newNotif, ...prev]);
    success("Avaliação Publicada!", "Obrigado por ajudar a fortalecer o ecossistema LongeVita.");
  };

  // 8. Aprovação Administrativa de Cuidador
  const approveCaregiver = (caregiverId: string) => {
    setCaregivers((prev) =>
      prev.map((cg) =>
        cg.id === caregiverId
          ? { ...cg, antecedentesChecados: true, formacaoVerificada: true, statusAprovacao: "aprovado" }
          : cg
      )
    );
    success("Cuidador Homologado!", "Antecedentes validados e status aprovado na plataforma.");
  };

  // 9. Gatilho de Alerta para Demonstração Executiva
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

  // 10. Marcar Notificações
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        caregivers,
        contracts,
        notifications,
        unreadCount,
        sendContractProposal,
        acceptContract,
        rejectContract,
        startShift,
        endShift,
        addCaregiver,
        addReview,
        approveCaregiver,
        triggerDemoAlert,
        markNotificationAsRead,
        markAllNotificationsAsRead
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
