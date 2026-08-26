"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Star,
  Clock,
  Calendar,
  ChevronRight,
  X,
  UserCheck,
  Heart,
  Plus,
  Activity,
  Pill,
  MapPin,
  FileText,
  Users,
  Bell,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  LogOut,
  Search,
  Filter,
  HeartHandshake,
  MessageSquare,
  Award,
  Play,
  Square,
  AlertTriangle,
  UserPlus,
  Stethoscope,
  Building2,
  SlidersHorizontal,
  Menu,
  ChevronDown,
  RefreshCw,
  Send,
  HelpCircle,
  Eye,
  Phone,
  MessageCircle
} from "lucide-react";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import HireModal from "@/components/HireModal";
import FeedbackModal from "@/components/FeedbackModal";
import AddCaregiverModal from "@/components/AddCaregiverModal";
import MedicalFileModal from "@/components/MedicalFileModal";
import TerminateContractModal from "@/components/TerminateContractModal";
import ApplyOpportunityModal from "@/components/ApplyOpportunityModal";
import AccountSwitcherModal from "@/components/AccountSwitcherModal";
import { useApp, Caregiver, Contract, Assistido } from "@/context/AppContext";

export default function DashboardPage() {
  const {
    userRole,
    setUserRole,
    currentUser,
    users,
    caregivers,
    contracts,
    assistidos,
    startShift,
    endShift,
    acceptContract,
    rejectContract,
    logoutUser
  } = useApp();

  // Abas de navegação
  const [activeTab, setActiveTab] = useState<"vinculos" | "explorar" | "propostas" | "ficha" | "diario">("vinculos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modais
  const [accountSwitcherOpen, setAccountSwitcherOpen] = useState(false);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [targetHireCaregiver, setTargetHireCaregiver] = useState<Caregiver | null>(null);

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [targetFeedbackCaregiver, setTargetFeedbackCaregiver] = useState<Caregiver | null>(null);

  const [medicalModalOpen, setMedicalModalOpen] = useState(false);
  const [targetMedicalAssistido, setTargetMedicalAssistido] = useState<Assistido | null>(null);
  const [medicalModalEditable, setMedicalModalEditable] = useState(true);

  const [terminateModalOpen, setTerminateModalOpen] = useState(false);
  const [targetTerminateContract, setTargetTerminateContract] = useState<Contract | null>(null);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [targetOpportunityAssistido, setTargetOpportunityAssistido] = useState<Assistido | null>(null);

  const [addCaregiverModalOpen, setAddCaregiverModalOpen] = useState(false);

  // Card com animação de saída temporária
  const [exitingCardId, setExitingCardId] = useState<string | null>(null);

  // Filtros de Cuidadores
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(120);

  // Filtros de Oportunidades de Famílias
  const [opportunitySearch, setOpportunitySearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  // Sincronização automática do papel com a conta ativa
  useEffect(() => {
    if (currentUser?.role && currentUser.role !== userRole) {
      setUserRole(currentUser.role);
    }
  }, [currentUser]);

  // Cuidadores Disponíveis (filtrados e reativos)
  const availableCaregivers = useMemo(() => {
    return caregivers.filter((c) => {
      // Regra de disponibilidade: se caregiver estiver ativo e disponível
      const isAvailable = c.disponivel !== false;
      const cleanTerm = searchTerm.trim().toLowerCase();
      const matchText =
        !cleanTerm ||
        c.nome.toLowerCase().includes(cleanTerm) ||
        c.especialidade.toLowerCase().includes(cleanTerm) ||
        (c.habilidades || []).some((h) => h.toLowerCase().includes(cleanTerm));

      const matchSpecialty =
        selectedSpecialty === "all" ||
        c.especialidade.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        (c.habilidades || []).some((h) => h.toLowerCase().includes(selectedSpecialty.toLowerCase()));

      const matchPrice = Number(c.valorHora || 0) <= maxPrice;

      return isAvailable && matchText && matchSpecialty && matchPrice;
    });
  }, [caregivers, searchTerm, selectedSpecialty, maxPrice]);

  // Famílias / Oportunidades Disponíveis para Cuidador (status === "disponivel")
  const availableOpportunities = useMemo(() => {
    return assistidos.filter((a) => {
      const isAvailable = a.status === "disponivel";
      const matchText =
        a.nome.toLowerCase().includes(opportunitySearch.toLowerCase()) ||
        a.familyName.toLowerCase().includes(opportunitySearch.toLowerCase()) ||
        a.necessidades.toLowerCase().includes(opportunitySearch.toLowerCase()) ||
        a.comorbidades.some((c) => c.toLowerCase().includes(opportunitySearch.toLowerCase()));

      const matchRegion =
        selectedRegion === "all" ||
        a.bairro.toLowerCase().includes(selectedRegion.toLowerCase()) ||
        a.cidade.toLowerCase().includes(selectedRegion.toLowerCase());

      return isAvailable && matchText && matchRegion;
    });
  }, [assistidos, opportunitySearch, selectedRegion]);

  // Assistidos da Família Logada (Isolamento Estrito)
  const familyAssistidos = useMemo(() => {
    const directMatches = assistidos.filter(
      (a) => a.familyId === currentUser.id || a.familyId === currentUser.familyId
    );
    if (directMatches.length > 0) return directMatches;

    // Fallback padrão se for Mariana Albuquerque (fam-1)
    if (currentUser.id === "fam-1" || currentUser.familyId === "fam-1") {
      return assistidos.filter((a) => a.id === "ast-1");
    }
    // Fallback padrão se for Roberto Silveira (fam-2)
    if (currentUser.id === "fam-2" || currentUser.familyId === "fam-2") {
      return assistidos.filter((a) => a.id === "ast-2");
    }

    return [];
  }, [assistidos, currentUser]);

  // Vínculos Ativos e Pendentes da Família Logada
  const familyContracts = useMemo(() => {
    return contracts.filter((c) => {
      const isMyFamily =
        c.familyId === currentUser.id ||
        c.familyId === currentUser.familyId ||
        c.familyName.toLowerCase() === currentUser.name.toLowerCase() ||
        familyAssistidos.some((a) => a.id === c.assistidoId || a.nome === c.patientName);

      return isMyFamily && (c.status === "ativo" || c.status === "pendente");
    });
  }, [contracts, currentUser, familyAssistidos]);

  // Vínculos Ativos e Pendentes do Cuidador Conectado (Isolamento Estrito)
  const caregiverContracts = useMemo(() => {
    const cgId = currentUser.caregiverId || currentUser.id;
    return contracts.filter((c) => {
      const isMyCaregiver =
        c.caregiverId === cgId ||
        c.caregiverName.toLowerCase() === currentUser.name.toLowerCase();

      return isMyCaregiver && (c.status === "ativo" || c.status === "pendente");
    });
  }, [contracts, currentUser]);

  // Propostas Relevantes para a Conta Conectada
  const userProposals = useMemo(() => {
    if (userRole === "caregiver") {
      const cgId = currentUser.caregiverId || currentUser.id;
      return contracts.filter(
        (c) => c.caregiverId === cgId || c.caregiverName.toLowerCase() === currentUser.name.toLowerCase()
      );
    }
    return contracts.filter((c) => {
      return (
        c.familyId === currentUser.id ||
        c.familyId === currentUser.familyId ||
        c.familyName.toLowerCase() === currentUser.name.toLowerCase() ||
        familyAssistidos.some((a) => a.id === c.assistidoId || a.nome === c.patientName)
      );
    });
  }, [contracts, userRole, currentUser, familyAssistidos]);

  // Disparo de Modal de Contratação com Animação de Saída
  const openHire = (cg: Caregiver) => {
    setTargetHireCaregiver(cg);
    setHireModalOpen(true);
  };

  const handleHireAnimation = (caregiverId: string) => {
    setExitingCardId(caregiverId);
    setTimeout(() => {
      setExitingCardId(null);
    }, 600);
  };

  // Disparo de Prontuário Médico
  const openMedicalChart = (ast: Assistido, editable: boolean = true) => {
    setTargetMedicalAssistido(ast);
    setMedicalModalEditable(editable);
    setMedicalModalOpen(true);
  };

  // Disparo de Encerramento de Contrato
  const openTerminate = (contract: Contract) => {
    setTargetTerminateContract(contract);
    setTerminateModalOpen(true);
  };

  // Disparo de Proposta / Oportunidade
  const openApplyOpportunity = (ast: Assistido) => {
    setTargetOpportunityAssistido(ast);
    setApplyModalOpen(true);
  };

  const openFeedback = (cg: Caregiver) => {
    setTargetFeedbackCaregiver(cg);
    setFeedbackModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row selection:bg-[#72b63f] selection:text-white">
      {/* ========================================================================= */}
      {/* MENU LATERAL ESQUERDO (SIDEBAR FIXO)                                      */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-neutral-200/80 flex flex-col justify-between md:min-h-screen sticky top-0 z-40 md:h-screen md:overflow-y-auto">
        <div>
          {/* Topo do Sidebar: Logo e Toggle Mobile */}
          <div className="p-5 flex items-center justify-between border-b border-neutral-100">
            <Logo size="md" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Seletor Dinâmico de Perfil Contextual (Família vs Cuidador) */}
          <div className={`p-4 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
            <div className="mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block px-1 mb-1.5">
                Alternar Contexto de Usuário
              </span>
              <div className="bg-neutral-100 p-1 rounded-2xl border border-neutral-200 flex">
                <button
                  onClick={() => {
                    setUserRole("family");
                    setActiveTab("vinculos");
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    userRole === "family"
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
                  Família
                </button>
                <button
                  onClick={() => {
                    setUserRole("caregiver");
                    setActiveTab("vinculos");
                  }}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    userRole === "caregiver"
                      ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-[#02a9b5]" />
                  Cuidador
                </button>
              </div>
            </div>

            {/* Menu Vertical de Navegação por 4 Abas */}
            <div className="space-y-1 mt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-2">
                Navegação Integrada
              </span>

              {/* ABA 1: MEUS VÍNCULOS ATIVOS */}
              <button
                onClick={() => {
                  setActiveTab("vinculos");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === "vinculos"
                    ? "bg-[#72b63f]/10 text-[#558a2e] border border-[#72b63f]/30 shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-4 h-4 text-[#72b63f]" />
                  <span>
                    {userRole === "family" ? "Meus Vínculos Ativos" : "Minhas Famílias Vinculadas"}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {userRole === "family" ? familyContracts.length : caregiverContracts.length}
                </span>
              </button>

              {/* ABA 2: EXPLORAR / NOVOS VÍNCULOS */}
              <button
                onClick={() => {
                  setActiveTab("explorar");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === "explorar"
                    ? "bg-[#02a9b5]/10 text-[#028490] border border-[#02a9b5]/30 shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#02a9b5]" />
                  <span>
                    {userRole === "family" ? "Cuidadores Disponíveis" : "Oportunidades / Famílias"}
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {userRole === "family" ? availableCaregivers.length : availableOpportunities.length}
                </span>
              </button>

              {/* ABA 3: NOTIFICAÇÕES & PROPOSTAS */}
              <button
                onClick={() => {
                  setActiveTab("propostas");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === "propostas"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[#02a9b5]" />
                  <span>Notificações & Propostas</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {contracts.filter((c) => c.status === "pendente").length}
                </span>
              </button>

              {/* ABA 4: PERFIL & FICHA MÉDICA / DIÁRIO */}
              {userRole === "family" ? (
                <button
                  onClick={() => {
                    setActiveTab("ficha");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeTab === "ficha"
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Ficha Médica & Assistidos</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {familyAssistidos.length}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setActiveTab("diario");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                    activeTab === "diario"
                      ? "bg-amber-50 text-amber-900 border border-amber-200"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Diário de Bordo & Plantões</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Ativo
                  </span>
                </button>
              )}
            </div>

            {/* Ações Rápidas do Sidebar */}
            <div className="pt-5 mt-5 border-t border-neutral-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block">
                Atalhos Operacionais
              </span>

              {userRole === "family" ? (
                <Link
                  href="/assistido/novo"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Novo Assistido
                </Link>
              ) : (
                <button
                  onClick={() => setAddCaregiverModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#02a9b5] hover:bg-[#028490] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Cadastrar Cuidador
                </button>
              )}

              <Link
                href="/admin"
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-neutral-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
                Acessar Portal ADM
              </Link>
            </div>
          </div>
        </div>

        {/* Rodapé do Sidebar */}
        <div className="p-3.5 border-t border-neutral-200/80 bg-neutral-50/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 border border-neutral-300">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-neutral-900 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-neutral-500 block truncate font-medium">
                  {currentUser.subtitle || (userRole === "family" ? "Família Contratante" : "Cuidador Profissional")}
                </span>
              </div>
            </div>

            <button
              onClick={() => logoutUser()}
              className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-neutral-200 transition-all"
              title="Desconectar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botão de Troca Rápida de Conta */}
          <button
            onClick={() => setAccountSwitcherOpen(true)}
            className="w-full py-2 px-3 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 border border-neutral-200 shadow-2xs hover:border-[#02a9b5]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#02a9b5]" />
            Alternar / Trocar Perfil
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ÁREA DE CONTEÚDO PRINCIPAL (CANVAS DIREITO)                                */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Superior */}
        <header className="h-16 px-6 bg-white border-b border-neutral-200/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
            <span>LongeVita</span>
            <span>/</span>
            <span className="text-neutral-900">
              {userRole === "family" ? "Área da Família" : "Área do Cuidador"}
            </span>
            <span>/</span>
            <span className="text-[#028490] capitalize">
              {activeTab === "vinculos" && (userRole === "family" ? "Vínculos Ativos" : "Famílias Vinculadas")}
              {activeTab === "explorar" && (userRole === "family" ? "Cuidadores Disponíveis" : "Oportunidades de Famílias")}
              {activeTab === "propostas" && "Propostas & Solicitações"}
              {activeTab === "ficha" && "Prontuário & Ficha Clínica"}
              {activeTab === "diario" && "Diário de Bordo"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Botão de Troca Rápida no Topo */}
            <button
              onClick={() => setAccountSwitcherOpen(true)}
              className="text-xs font-bold text-neutral-800 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden bg-neutral-300">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">{currentUser.name.split(" ")[0]}</span>
              <span className="text-[10px] text-neutral-400">▼</span>
            </button>

            <NotificationCenter />
            <Link
              href="/admin"
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-xl border border-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
              ADM
            </Link>
          </div>
        </header>

        {/* Conteúdo Dinâmico por Aba */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full">
          {/* ========================================================================= */}
          {/* ABA 1: MEUS VÍNCULOS ATIVOS (ISOLAMENTO SEGURO POR PERFIL)                 */}
          {/* ========================================================================= */}
          {activeTab === "vinculos" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold mb-2 border border-[#72b63f]/25">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Visualização Restrita sob LGPD
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                    {userRole === "family" ? "Meus Assistidos & Vínculos Ativos" : "Minhas Famílias Vinculadas"}
                  </h1>
                  <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                    {userRole === "family"
                      ? "Acompanhamento exclusivo dos idosos da família e dos cuidadores formalizados."
                      : "Exibição restrita a contratos aprovados com acesso integral à ficha clínica e controle de plantão."}
                  </p>
                </div>

                {userRole === "family" && (
                  <button
                    onClick={() => setActiveTab("explorar")}
                    className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#72b63f] hover:bg-[#63a035] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-98"
                  >
                    <Users className="w-4 h-4" />
                    Contratar Novo Cuidador
                  </button>
                )}
              </div>

              {/* LISTAGEM DE VÍNCULOS */}
              {userRole === "family" ? (
                /* VISÃO DA FAMÍLIA */
                <div className="space-y-6">
                  {familyAssistidos.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white border border-dashed border-neutral-300 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#72b63f] flex items-center justify-center mx-auto">
                        <Heart className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-neutral-800">Nenhum Assistido Cadastrado nesta Conta Familiar</h4>
                      <p className="text-xs text-neutral-500 max-w-md mx-auto">
                        Cadastre seu familiar idoso para configurar a rotina médica, sinais vitais e formalizar propostas com cuidadores qualificados.
                      </p>
                      <Link
                        href="/assistido/novo"
                        className="px-4 py-2.5 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Cadastrar Assistido Agora
                      </Link>
                    </div>
                  ) : (
                    familyAssistidos.map((ast) => {
                      const activeContract = contracts.find(
                        (c) =>
                          (c.assistidoId === ast.id || c.patientName === ast.nome) &&
                          (c.status === "ativo" || c.status === "pendente")
                      );
                      const linkedCaregiver = caregivers.find(
                        (cg) =>
                          (activeContract && (cg.id === activeContract.caregiverId || cg.nome.toLowerCase() === activeContract.caregiverName.toLowerCase())) ||
                          cg.id === ast.cuidadorVinculadoId ||
                          cg.nome === ast.cuidadorVinculadoNome
                      );

                      return (
                        <div
                          key={ast.id}
                          className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-200 relative overflow-hidden transition-all hover:border-neutral-300"
                        >
                        <div
                          className={`absolute top-0 right-0 left-0 h-1.5 ${
                            ast.status === "vinculada"
                              ? "bg-[#72b63f]"
                              : ast.status === "em_negociacao"
                              ? "bg-amber-400"
                              : "bg-blue-500"
                          }`}
                        />

                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                          {/* Info do Assistido */}
                          <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 shadow-sm">
                              <img
                                src={ast.foto}
                                alt={ast.nome}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold border border-[#72b63f]/20">
                                  {ast.parentesco}
                                </span>
                                <span className="text-xs text-neutral-500 font-medium">{ast.idade} anos</span>
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                    ast.status === "vinculada"
                                      ? "bg-[#72b63f]/10 text-[#558a2e] border-[#72b63f]/25"
                                      : ast.status === "em_negociacao"
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : "bg-blue-50 text-blue-800 border-blue-200"
                                  }`}
                                >
                                  {ast.status === "vinculada"
                                    ? "Contrato Ativo"
                                    : ast.status === "em_negociacao"
                                    ? "Proposta em Análise"
                                    : "Buscando Cuidador"}
                                </span>
                              </div>

                              <h3 className="text-xl font-bold text-neutral-900">{ast.nome}</h3>
                              <p className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-[#72b63f]" />
                                {ast.endereco}
                              </p>

                              {/* Tags de Comorbidades */}
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {ast.comorbidades.map((cond, i) => (
                                  <span
                                    key={i}
                                    className="px-2 py-0.5 rounded-md bg-neutral-100 text-[11px] font-semibold text-neutral-700 border border-neutral-200"
                                  >
                                    {cond}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Info do Cuidador Vinculado ou CTA */}
                          <div className="w-full lg:w-80 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                            {linkedCaregiver && activeContract ? (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                                    Profissional Vinculado
                                  </span>
                                  {activeContract.shiftActive && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#72b63f]/15 text-[#558a2e] text-[10px] font-bold border border-[#72b63f]/30 badge-pulse">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#72b63f]" />
                                      Plantão em Andamento
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 border border-neutral-300">
                                    <img
                                      src={linkedCaregiver.foto}
                                      alt={linkedCaregiver.nome}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-sm font-bold text-neutral-900 truncate">
                                      {linkedCaregiver.nome}
                                    </h4>
                                    <p className="text-[11px] text-neutral-600 truncate font-medium">
                                      {linkedCaregiver.especialidade}
                                    </p>
                                    <span className="text-xs font-bold text-[#028490]">
                                      R$ {activeContract.hourlyRate}/h
                                    </span>
                                  </div>
                                </div>

                                <div className="pt-2 border-t border-neutral-200/80 flex items-center gap-2">
                                  <button
                                    onClick={() => openFeedback(linkedCaregiver)}
                                    className="flex-1 py-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-300 transition-colors flex items-center justify-center gap-1"
                                  >
                                    <Star className="w-3.5 h-3.5 text-amber-500" />
                                    Avaliar
                                  </button>
                                  <button
                                    onClick={() => openTerminate(activeContract)}
                                    className="py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors"
                                    title="Encerrar Vínculo"
                                  >
                                    Encerrar
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-2 space-y-2">
                                <span className="text-xs font-bold text-neutral-700 block">
                                  Nenhum Cuidador Contratado
                                </span>
                                <p className="text-[11px] text-neutral-500">
                                  Selecione um profissional verificado para formalizar o atendimento.
                                </p>
                                <button
                                  onClick={() => setActiveTab("explorar")}
                                  className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm"
                                >
                                  Buscar Cuidadores
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Barra Inferior com Sinais Vitais & Prontuário */}
                        <div className="mt-5 pt-4 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-50 border border-neutral-200 font-bold text-neutral-800">
                              <Activity className="w-3.5 h-3.5 text-[#72b63f]" />
                              PA: {ast.sinaisVitais?.pressao || "12x8 mmHg"}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-50 border border-neutral-200 font-bold text-neutral-800">
                              <Heart className="w-3.5 h-3.5 text-rose-500" />
                              Glicemia: {ast.sinaisVitais?.glicemia || "104 mg/dL"}
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 font-bold text-amber-900">
                              <Pill className="w-3.5 h-3.5 text-amber-600" />
                              {ast.medicacoes?.[0] ? `${ast.medicacoes[0].nome} (${ast.medicacoes[0].horario})` : "Medicações OK"}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openMedicalChart(ast, true)}
                              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#02a9b5]" />
                              Ver Ficha Médica Completa
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }))}
                </div>
              ) : (
                /* VISÃO DO CUIDADOR: EXCLUSIVIDADE E ISOLAMENTO */
                <div className="space-y-4">
                  {caregiverContracts.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white border border-dashed border-neutral-300 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-bold text-neutral-800">Nenhum Vínculo Formalizado no Momento</h4>
                      <p className="text-xs text-neutral-500 max-w-md mx-auto">
                        Você não possui contratos ativos no momento. Explore novas famílias que estão buscando atendimento na vitrine de oportunidades.
                      </p>
                      <button
                        onClick={() => setActiveTab("explorar")}
                        className="px-4 py-2.5 rounded-xl bg-[#02a9b5] hover:bg-[#028490] text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5"
                      >
                        <Users className="w-4 h-4" />
                        Explorar Novas Famílias
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {caregiverContracts.map((contract) => {
                        const linkedAst = assistidos.find(
                          (a) => a.id === contract.assistidoId || a.nome === contract.patientName
                        );

                        return (
                          <div
                            key={contract.id}
                            className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-200 flex flex-col justify-between relative overflow-hidden interactive-card"
                          >
                            <div
                              className={`absolute top-0 right-0 left-0 h-1.5 ${
                                contract.status === "ativo" ? "bg-[#72b63f]" : "bg-amber-400"
                              }`}
                            />

                            <div>
                              <div className="flex items-start justify-between gap-3 mb-4">
                                <div>
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                      contract.status === "ativo"
                                        ? "bg-[#72b63f]/10 text-[#558a2e] border-[#72b63f]/25"
                                        : "bg-amber-50 text-amber-800 border-amber-200"
                                    }`}
                                  >
                                    {contract.status === "ativo" ? "Contrato Ativo • LGPD" : "Proposta Pendente"}
                                  </span>
                                  <h3 className="text-xl font-bold text-neutral-900 mt-2">
                                    {contract.patientName} ({contract.patientAge} anos)
                                  </h3>
                                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                                    Família: <strong>{contract.familyName}</strong>
                                  </p>
                                </div>

                                <div className="text-right">
                                  <span className="text-lg font-bold text-neutral-900">
                                    R$ {contract.hourlyRate}
                                  </span>
                                  <span className="text-xs text-neutral-500 block">/hora</span>
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-medium flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-[#72b63f] flex-shrink-0" />
                                <span>{contract.patientAddress}</span>
                              </div>

                              <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 font-medium mb-4">
                                <span className="font-bold text-neutral-900 block mb-1">
                                  Rotina de Atendimento Prescrita:
                                </span>
                                {contract.careNeeds}
                              </div>
                            </div>

                            {/* Ações do Cuidador */}
                            <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2.5">
                              {contract.status === "ativo" ? (
                                <>
                                  <div className="flex gap-2">
                                    {contract.shiftActive ? (
                                      <button
                                        onClick={() => endShift(contract.id)}
                                        className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                      >
                                        <Square className="w-4 h-4" />
                                        Concluir Turno & Diário
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => startShift(contract.id)}
                                        className="flex-1 rounded-xl bg-[#72b63f] hover:bg-[#63a035] py-2.5 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                      >
                                        <Play className="w-4 h-4" />
                                        Iniciar Plantão Presencial
                                      </button>
                                    )}

                                    {linkedAst && (
                                      <button
                                        onClick={() => openMedicalChart(linkedAst, false)}
                                        className="px-3.5 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                                        title="Prontuário Médico"
                                      >
                                        <FileText className="w-3.5 h-3.5 text-[#02a9b5]" />
                                        Ficha
                                      </button>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => openTerminate(contract)}
                                    className="text-[11px] font-bold text-rose-600 hover:underline self-end"
                                  >
                                    Encerrar Vínculo Contratual
                                  </button>
                                </>
                              ) : (
                                <div className="flex w-full gap-2">
                                  <button
                                    onClick={() => acceptContract(contract.id)}
                                    className="flex-1 rounded-xl bg-[#72b63f] hover:bg-[#63a035] py-2.5 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Aceitar Proposta
                                  </button>
                                  <button
                                    onClick={() => rejectContract(contract.id)}
                                    className="flex-1 rounded-xl bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 py-2.5 text-xs font-bold text-neutral-700 transition-all flex items-center justify-center gap-1.5"
                                  >
                                    <X className="w-4 h-4" />
                                    Recusar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: EXPLORAR / NOVOS VÍNCULOS (CUIDADORES OU OPORTUNIDADES)            */}
          {/* ========================================================================= */}
          {activeTab === "explorar" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {userRole === "family" ? (
                /* VITRINE DE CUIDADORES DISPONÍVEIS (PARA FAMÍLIA) */
                <>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#02a9b5]/10 text-[#028490] text-xs font-bold mb-2 border border-[#02a9b5]/25">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Profissionais Homologados com Antecedentes Checados
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                        Cuidadores Disponíveis ({availableCaregivers.length})
                      </h1>
                      <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                        Selecione o profissional ideal para enviar proposta de vínculo com contratação direta.
                      </p>
                    </div>

                    <button
                      onClick={() => setAddCaregiverModalOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-[#02a9b5] hover:bg-[#028490] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98"
                    >
                      <UserPlus className="w-4 h-4" />
                      Cadastrar Cuidador
                    </button>
                  </div>

                  {/* Barra de Filtros */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nome ou especialidade..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                      />
                    </div>

                    <div>
                      <select
                        value={selectedSpecialty}
                        onChange={(e) => setSelectedSpecialty(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-neutral-900 outline-none focus:border-[#02a9b5]"
                      >
                        <option value="all">Todas as Especialidades</option>
                        <option value="Alzheimer">Alzheimer & Demências</option>
                        <option value="Parkinson">Doença de Parkinson</option>
                        <option value="Pós-Cirúrgico">Cuidados Pós-Cirúrgicos</option>
                        <option value="Paliativos">Cuidados Paliativos</option>
                        <option value="Mobilidade">Reabilitação & Mobilidade</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200">
                      <span className="text-xs font-bold text-neutral-700 whitespace-nowrap">
                        Até R$ {maxPrice}/h
                      </span>
                      <input
                        type="range"
                        min={30}
                        max={150}
                        step={5}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-[#02a9b5] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Grade de Cuidadores com Entrada Escalonada */}
                  {availableCaregivers.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white border border-dashed border-neutral-300 text-center space-y-2">
                      <Users className="w-8 h-8 text-neutral-400 mx-auto" />
                      <h4 className="text-sm font-bold text-neutral-800">Nenhum profissional encontrado</h4>
                      <p className="text-xs text-neutral-500">Tente ajustar o filtro de valor ou especialidade médica.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {availableCaregivers.map((caregiver, index) => {
                        const isExiting = exitingCardId === caregiver.id;

                        return (
                          <div
                            key={caregiver.id}
                            style={{ animationDelay: `${index * 80}ms` }}
                            className={`stagger-card interactive-card group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-neutral-200 justify-between ${
                              isExiting ? "animate-card-exit" : ""
                            }`}
                          >
                            <div>
                              <div className="relative mb-3.5 h-44 w-full overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200">
                                <img
                                  src={caregiver.foto}
                                  alt={caregiver.nome}
                                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold text-neutral-900 border border-neutral-200 shadow-sm">
                                  R$ {caregiver.valorHora}/h
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#72b63f]/10 px-2 py-0.5 text-[11px] font-bold text-[#558a2e] border border-[#72b63f]/20">
                                  <ShieldCheck className="w-3 h-3 text-[#72b63f]" />
                                  Antecedentes OK
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {caregiver.avaliacao} ({caregiver.avaliacoesQtd})
                                </span>
                              </div>

                              <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
                                {caregiver.nome}
                              </h3>

                              <p className="mt-0.5 text-xs text-neutral-600 font-medium line-clamp-1">
                                {caregiver.especialidade} • {caregiver.experiencia}
                              </p>

                              <div className="flex flex-wrap gap-1 mt-2.5">
                                {(caregiver.habilidades || []).slice(0, 3).map((h, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-md bg-[#02a9b5]/10 text-[#028490] text-[10px] font-bold">
                                    {h}
                                  </span>
                                ))}
                              </div>

                              {/* Depoimento Recente (Conforme Especificação 3.0 / prompt3.md) */}
                              {caregiver.reviews && caregiver.reviews.length > 0 && (
                                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border-l-3 border-[#02a9b5] text-xs">
                                  <p className="italic text-neutral-600 text-[11px] line-clamp-2 leading-relaxed">
                                    "{caregiver.reviews[0].comment}"
                                  </p>
                                  <span className="text-[10px] font-bold text-neutral-500 mt-1 block">
                                    — {caregiver.reviews[0].authorName} ({caregiver.reviews[0].authorRelation || "Familiar"})
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center gap-2">
                              <button
                                onClick={() => openHire(caregiver)}
                                className="flex-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 py-2 text-center text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-98"
                              >
                                <HeartHandshake className="w-3.5 h-3.5 text-[#72b63f]" />
                                Contratar
                              </button>
                              <button
                                onClick={() => openFeedback(caregiver)}
                                className="px-2.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center"
                                title="Ver Avaliações & Avaliar"
                              >
                                <Star className="w-3.5 h-3.5 text-amber-500" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                /* VITRINE DE OPORTUNIDADES / NOVAS FAMÍLIAS (PARA CUIDADORES) */
                <>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#02a9b5]/10 text-[#028490] text-xs font-bold mb-2 border border-[#02a9b5]/25">
                        <Users className="w-3.5 h-3.5" />
                        Oportunidades em Aberto • Reatividade em Tempo Real
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                        Famílias Buscando Profissionais ({availableOpportunities.length})
                      </h1>
                      <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                        Famílias que ainda não possuem cuidador fixo. Envie sua proposta para início imediato.
                      </p>
                    </div>
                  </div>

                  {/* Filtros de Oportunidades */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-sm">
                    <div className="relative">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={opportunitySearch}
                        onChange={(e) => setOpportunitySearch(e.target.value)}
                        placeholder="Buscar por patologia, necessidade ou nome..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium focus:border-[#02a9b5]"
                      />
                    </div>

                    <div>
                      <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-neutral-900 focus:border-[#02a9b5]"
                      >
                        <option value="all">Todas as Regiões (São Paulo)</option>
                        <option value="Jardins">Jardins</option>
                        <option value="Higienópolis">Higienópolis</option>
                        <option value="Bela Vista">Bela Vista / Paulista</option>
                        <option value="Vila Madalena">Vila Madalena</option>
                      </select>
                    </div>
                  </div>

                  {/* Grade de Oportunidades com Entrada Escalonada */}
                  {availableOpportunities.length === 0 ? (
                    <div className="p-12 rounded-3xl bg-white border border-dashed border-neutral-300 text-center space-y-2">
                      <CheckCircle2 className="w-8 h-8 text-[#72b63f] mx-auto" />
                      <h4 className="text-sm font-bold text-neutral-800">Todas as famílias estão com cuidadores vinculados!</h4>
                      <p className="text-xs text-neutral-500">Novas oportunidades surgirão assim que novas famílias se cadastrarem.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      {availableOpportunities.map((ast, index) => (
                        <div
                          key={ast.id}
                          style={{ animationDelay: `${index * 80}ms` }}
                          className="stagger-card interactive-card rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 shadow-sm">
                                <img
                                  src={ast.foto}
                                  alt={ast.nome}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold border border-blue-200 badge-pulse">
                                    Vaga Aberta
                                  </span>
                                  <span className="text-sm font-bold text-neutral-900">
                                    R$ {ast.orcamentoHora}/h
                                  </span>
                                </div>

                                <h3 className="text-base font-bold text-neutral-900 mt-1">
                                  {ast.nome} ({ast.idade} anos)
                                </h3>
                                <p className="text-xs text-neutral-500 font-medium">
                                  Família Contratante: {ast.familyName}
                                </p>
                              </div>
                            </div>

                            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-medium flex items-center gap-2 mb-3">
                              <MapPin className="w-4 h-4 text-[#72b63f] flex-shrink-0" />
                              <span>{ast.endereco}</span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-neutral-50/50 border border-neutral-200 text-xs text-neutral-800 font-medium mb-3">
                              <span className="font-bold text-neutral-900 block mb-1">
                                Necessidades do Cuidado:
                              </span>
                              {ast.necessidades}
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {ast.comorbidades.map((c, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-0.5 rounded-md bg-[#02a9b5]/10 text-[#028490] text-[10px] font-bold border border-[#02a9b5]/20"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                            <span className="text-xs text-neutral-500 font-medium">
                              Frequência: <strong>{ast.frequenciaPretendida}</strong>
                            </span>
                            <button
                              onClick={() => openApplyOpportunity(ast)}
                              className="px-4 py-2 rounded-xl bg-[#02a9b5] hover:bg-[#028490] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-98"
                            >
                              <Send className="w-3.5 h-3.5" />
                              Propor Atendimento
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: NOTIFICAÇÕES & PROPOSTAS REATIVAS                                   */}
          {/* ========================================================================= */}
          {activeTab === "propostas" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-neutral-200/80 pb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold mb-2">
                  <Bell className="w-3.5 h-3.5 text-[#02a9b5]" />
                  Central Unificada de Propostas
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                  Propostas & Solicitações Contratuais
                </h1>
                <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                  Gerencie ofertas de vínculo, aprove ou recuse em tempo real com sincronização automática do ecossistema.
                </p>
              </div>

              <div className="space-y-3">
                {userProposals.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white border border-dashed border-neutral-300 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-[#02a9b5] flex items-center justify-center mx-auto">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-neutral-800">Nenhuma Proposta Registrada</h4>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      {userRole === "family"
                        ? "Quando você contratar um cuidador ou receber candidaturas de profissionais, elas aparecerão listadas aqui."
                        : "Você ainda não possui propostas enviadas ou recebidas. Acesse a vitrine de oportunidades para se candidatar."}
                    </p>
                    <button
                      onClick={() => setActiveTab("explorar")}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4" />
                      {userRole === "family" ? "Buscar Cuidadores" : "Explorar Oportunidades"}
                    </button>
                  </div>
                ) : (
                  userProposals.map((contract) => (
                    <div
                      key={contract.id}
                      className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 interactive-card"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              contract.status === "ativo"
                                ? "bg-[#72b63f]/10 text-[#558a2e] border-[#72b63f]/25"
                                : contract.status === "pendente"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {contract.status === "ativo"
                              ? "Contrato Ativo"
                              : contract.status === "pendente"
                              ? "Proposta em Análise"
                              : "Encerrado / Recusado"}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">{contract.createdAt}</span>
                        </div>

                        <h3 className="text-lg font-bold text-neutral-900">
                          {contract.caregiverName} ➔ {contract.patientName} ({contract.familyName})
                        </h3>
                        <p className="text-xs text-neutral-600 font-medium mt-0.5">
                          Escala: <strong>{contract.frequency}</strong> • Honorários: R$ {contract.hourlyRate}/h • Endereço: {contract.patientAddress}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {contract.status === "pendente" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptContract(contract.id)}
                              className="px-3.5 py-2 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 active:scale-98"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aceitar & Formalizar
                            </button>
                            <button
                              onClick={() => rejectContract(contract.id)}
                              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 text-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-98"
                            >
                              <X className="w-3.5 h-3.5" />
                              Recusar
                            </button>
                          </div>
                        )}

                        {contract.status === "ativo" && (
                          <button
                            onClick={() => openTerminate(contract)}
                            className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-700 text-neutral-700 text-xs font-bold transition-colors"
                          >
                            Encerrar Vínculo
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* ABA 4: PERFIL & FICHA MÉDICA (PARA FAMÍLIA)                                */}
          {/* ========================================================================= */}
          {activeTab === "ficha" && userRole === "family" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Gerenciamento Clínico & Prontuário
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                    Ficha Médica dos Assistidos
                  </h1>
                  <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                    Edite as patologias, medicações, sinais vitais e rotinas de cuidado dos seus familiares.
                  </p>
                </div>

                <Link
                  href="/assistido/novo"
                  className="inline-flex items-center gap-2 bg-[#72b63f] hover:bg-[#63a035] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Novo Assistido
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {familyAssistidos.length === 0 ? (
                  <div className="p-12 rounded-3xl bg-white border border-dashed border-neutral-300 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#72b63f] flex items-center justify-center mx-auto">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-neutral-800">Nenhum Prontuário Disponível</h4>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      Cadastre o seu familiar assistido para gerenciar histórico clínico, patologias, medicações de uso contínuo e contatos de emergência.
                    </p>
                    <Link
                      href="/assistido/novo"
                      className="px-4 py-2.5 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold shadow-sm transition-all inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Cadastrar Assistido Agora
                    </Link>
                  </div>
                ) : (
                  familyAssistidos.map((ast) => (
                    <div
                      key={ast.id}
                      className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 shadow-sm">
                            <img
                              src={ast.foto}
                              alt={ast.nome}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-bold">
                                {ast.parentesco} • {ast.idade} anos
                              </span>
                              <span className="text-xs text-neutral-500 font-medium">{ast.cidade}</span>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mt-1">{ast.nome}</h3>
                          </div>
                        </div>

                        <button
                          onClick={() => openMedicalChart(ast, true)}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Stethoscope className="w-3.5 h-3.5 text-[#02a9b5]" />
                          Editar Prontuário Clínico
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                            Comorbidades Registradas
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {ast.comorbidades.map((c, i) => (
                              <span key={i} className="text-xs font-bold text-neutral-800">
                                {c}{i < ast.comorbidades.length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                            Últimos Sinais Vitais
                          </span>
                          <span className="text-xs font-bold text-neutral-900 block">
                            PA: {ast.sinaisVitais?.pressao} • Glicemia: {ast.sinaisVitais?.glicemia}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                            Contato de Emergência
                          </span>
                          <span className="text-xs font-bold text-neutral-900 block">
                            {ast.contatoEmergencia.nome} ({ast.contatoEmergencia.telefone})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* ABA 5: DIÁRIO DE BORDO (PARA CUIDADOR)                                     */}
          {/* ========================================================================= */}
          {activeTab === "diario" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="border-b border-neutral-200/80 pb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Auditoria de Plantão & Relatórios Diários
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                  Diário de Bordo em Tempo Real
                </h1>
                <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                  Registros de rotina preenchidos pelo cuidador com validação presencial de geolocalização.
                </p>
              </div>

              <div className="max-w-3xl space-y-3">
                {[
                  {
                    id: "log-1",
                    hora: "10:30",
                    autor: "Ana Silva (Enfermeira)",
                    titulo: "Administração de Medicação",
                    descricao: "Administrado Losartana Potássica 50mg e hidratação hídrica com 300ml de água. Sem queixas álgicas.",
                    local: "São Paulo, SP (Geofencing Validado)"
                  },
                  {
                    id: "log-2",
                    hora: "09:00",
                    autor: "Ana Silva (Enfermeira)",
                    titulo: "Café da Manhã & Sinais Vitais",
                    descricao: "PA aferida: 120/80 mmHg. Glicemia de jejum: 104 mg/dL. Dieta pastosa consumida sem intercorrências.",
                    local: "São Paulo, SP"
                  }
                ].map((log) => (
                  <div
                    key={log.id}
                    className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-200 flex items-start gap-4 interactive-card"
                  >
                    <div className="w-11 h-11 rounded-xl bg-neutral-100 flex flex-col items-center justify-center flex-shrink-0 text-neutral-800 border border-neutral-200">
                      <Clock className="w-3.5 h-3.5 text-[#02a9b5]" />
                      <span className="text-[10px] font-bold mt-0.5">{log.hora}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="text-sm font-bold text-neutral-900">{log.titulo}</h4>
                        <span className="text-xs text-neutral-500 font-medium">{log.autor}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-700 font-normal leading-relaxed">{log.descricao}</p>
                      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#72b63f]" />
                        {log.local}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAIS GLOBAIS DE INTERAÇÃO REATIVA                                       */}
      {/* ========================================================================= */}
      <HireModal
        caregiver={targetHireCaregiver}
        isOpen={hireModalOpen}
        onSuccessAnimation={handleHireAnimation}
        onClose={() => {
          setHireModalOpen(false);
          setTargetHireCaregiver(null);
        }}
      />

      <FeedbackModal
        caregiver={targetFeedbackCaregiver}
        isOpen={feedbackModalOpen}
        onClose={() => {
          setFeedbackModalOpen(false);
          setTargetFeedbackCaregiver(null);
        }}
      />

      <MedicalFileModal
        assistido={targetMedicalAssistido}
        isOpen={medicalModalOpen}
        canEdit={medicalModalEditable}
        onClose={() => {
          setMedicalModalOpen(false);
          setTargetMedicalAssistido(null);
        }}
      />

      <TerminateContractModal
        contract={targetTerminateContract}
        isOpen={terminateModalOpen}
        onClose={() => {
          setTerminateModalOpen(false);
          setTargetTerminateContract(null);
        }}
      />

      <ApplyOpportunityModal
        assistido={targetOpportunityAssistido}
        isOpen={applyModalOpen}
        onClose={() => {
          setApplyModalOpen(false);
          setTargetOpportunityAssistido(null);
        }}
      />

      <AddCaregiverModal
        isOpen={addCaregiverModalOpen}
        onClose={() => setAddCaregiverModalOpen(false)}
      />

      <AccountSwitcherModal
        isOpen={accountSwitcherOpen}
        onClose={() => setAccountSwitcherOpen(false)}
      />
    </div>
  );
}
