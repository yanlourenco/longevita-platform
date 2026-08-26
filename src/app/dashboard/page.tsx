"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  UserPlus
} from "lucide-react";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import HireModal from "@/components/HireModal";
import FeedbackModal from "@/components/FeedbackModal";
import AddCaregiverModal from "@/components/AddCaregiverModal";
import { useApp, Caregiver, Contract } from "@/context/AppContext";

const APPLE_SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 0.8
};

export default function DashboardPage() {
  const {
    userRole,
    setUserRole,
    caregivers,
    contracts,
    startShift,
    endShift,
    acceptContract,
    rejectContract
  } = useApp();

  const [activeTab, setActiveTab] = useState<"assistidos" | "cuidadores" | "vinculos" | "diario">("assistidos");
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);

  // Modais
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [targetHireCaregiver, setTargetHireCaregiver] = useState<Caregiver | null>(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [targetFeedbackCaregiver, setTargetFeedbackCaregiver] = useState<Caregiver | null>(null);
  const [addCaregiverModalOpen, setAddCaregiverModalOpen] = useState(false);

  // Filtros de Cuidadores
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [maxPrice, setMaxPrice] = useState<number>(60);

  // Filtro de Cuidadores Reativo
  const filteredCaregivers = useMemo(() => {
    return caregivers.filter((c) => {
      const matchText =
        c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.habilidades.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchSpecialty =
        selectedSpecialty === "all" ||
        c.especialidade.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        c.habilidades.some((h) => h.toLowerCase().includes(selectedSpecialty.toLowerCase()));

      const matchPrice = c.valorHora <= maxPrice;

      return matchText && matchSpecialty && matchPrice;
    });
  }, [caregivers, searchTerm, selectedSpecialty, maxPrice]);

  // Vínculos Ativos e Pendentes para o Cuidador
  const caregiverContracts = contracts.filter((c) => c.status === "ativo" || c.status === "pendente");

  const openHire = (cg: Caregiver) => {
    setTargetHireCaregiver(cg);
    setHireModalOpen(true);
  };

  const openFeedback = (cg: Caregiver) => {
    setTargetFeedbackCaregiver(cg);
    setFeedbackModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-[#72b63f] selection:text-white pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b-2 border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Logo size="md" />

          {/* Alternador de Perfil (Família vs Cuidador) */}
          <div className="hidden lg:flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
            <button
              onClick={() => setUserRole("family")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                userRole === "family"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
              Visão Família Contratante
            </button>
            <button
              onClick={() => setUserRole("caregiver")}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                userRole === "caregiver"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
              Visão Cuidador Profissional
            </button>
          </div>

          {/* Navegação por Abas */}
          <nav className="hidden md:flex items-center bg-neutral-100 p-1.5 rounded-2xl gap-1 border border-neutral-200">
            {userRole === "family" ? (
              <>
                <button
                  onClick={() => setActiveTab("assistidos")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === "assistidos"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
                  Meus Assistidos
                </button>
                <button
                  onClick={() => setActiveTab("cuidadores")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === "cuidadores"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#02a9b5]" />
                  Cuidadores ({caregivers.length})
                </button>
                <button
                  onClick={() => setActiveTab("vinculos")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === "vinculos"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                  Contratos & Vínculos ({contracts.length})
                </button>
                <button
                  onClick={() => setActiveTab("diario")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === "diario"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Diário de Bordo
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab("vinculos")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === "vinculos"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-[#02a9b5]" />
                  Famílias Vinculadas ({caregiverContracts.length})
                </button>
                <button
                  onClick={() => setActiveTab("diario")}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeTab === "diario"
                      ? "bg-white text-neutral-900 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-500" />
                  Registrar Diário de Bordo
                </button>
              </>
            )}
          </nav>

          {/* Ações, Notificações e Desconectar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin"
              className="text-xs font-black text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1"
            >
              👑 ADM Master
            </Link>

            {/* Central de Notificações Reativa com Badge */}
            <NotificationCenter />

            {userRole === "family" && (
              <Link
                href="/assistido/novo"
                className="hidden sm:inline-flex items-center gap-1.5 bg-gradient-to-r from-[#72b63f] to-[#02a9b5] text-white px-3.5 py-2.5 rounded-2xl text-xs font-extrabold shadow-md shadow-[#02a9b5]/20 hover:opacity-95 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Novo Assistido
              </Link>
            )}

            <Link
              href="/"
              className="text-xs font-extrabold text-neutral-700 hover:text-rose-600 px-3 py-2 rounded-xl hover:bg-neutral-100 border border-neutral-200 transition-colors flex items-center gap-1"
              title="Voltar ao início"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </Link>
          </div>
        </div>

        {/* Mobile Tab Nav */}
        <div className="flex md:hidden border-t border-neutral-200 bg-white px-4 py-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setUserRole(userRole === "family" ? "caregiver" : "family")}
            className="px-3 py-2 text-xs font-extrabold rounded-xl bg-neutral-100 text-neutral-800 border border-neutral-300"
          >
            Modo: {userRole === "family" ? "Família" : "Cuidador"}
          </button>
          <button
            onClick={() => setActiveTab("assistidos")}
            className={`flex-1 py-2 text-center text-xs font-extrabold rounded-xl whitespace-nowrap ${
              activeTab === "assistidos" ? "bg-neutral-900 text-white" : "text-neutral-600"
            }`}
          >
            Assistidos
          </button>
          <button
            onClick={() => setActiveTab("cuidadores")}
            className={`flex-1 py-2 text-center text-xs font-extrabold rounded-xl whitespace-nowrap ${
              activeTab === "cuidadores" ? "bg-neutral-900 text-white" : "text-neutral-600"
            }`}
          >
            Cuidadores
          </button>
          <button
            onClick={() => setActiveTab("vinculos")}
            className={`flex-1 py-2 text-center text-xs font-extrabold rounded-xl whitespace-nowrap ${
              activeTab === "vinculos" ? "bg-neutral-900 text-white" : "text-neutral-600"
            }`}
          >
            Vínculos
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* ========================================================================= */}
        {/* PERFIL DO CUIDADOR: REGRAS DE VISIBILIDADE E VÍNCULO EXCLUSIVO            */}
        {/* ========================================================================= */}
        {userRole === "caregiver" ? (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-neutral-200 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-[#02a9b5] text-xs font-extrabold mb-2 border border-cyan-200">
                  <ShieldCheck className="w-4 h-4" />
                  Painel Exclusivo de Cuidadores Credenciados
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                  Famílias Vinculadas & Plantões
                </h1>
                <p className="text-neutral-600 text-sm font-medium mt-1">
                  Acesso seguro restrito exclusivamente a famílias com contrato ativo ou solicitação aprovada sob a LGPD.
                </p>
              </div>
            </div>

            {/* Lista de Vínculos do Cuidador */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#02a9b5]" />
                Contratos Ativos e Solicitações de Famílias ({caregiverContracts.length})
              </h3>

              {caregiverContracts.length === 0 ? (
                <div className="p-12 rounded-[32px] bg-white border-2 border-dashed border-neutral-300 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-extrabold text-neutral-800">Nenhum Vínculo Ativo no Momento</h4>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    Você não possui famílias vinculadas ativas. Novas solicitações de contratação aparecerão na sua Central de Notificações com opção de aceite.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {caregiverContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="rounded-[32px] bg-white p-6 sm:p-8 shadow-sm border-2 border-neutral-200 flex flex-col justify-between relative overflow-hidden"
                    >
                      <div
                        className={`absolute top-0 right-0 left-0 h-1.5 ${
                          contract.status === "ativo" ? "bg-emerald-500" : "bg-amber-400"
                        }`}
                      />

                      <div>
                        {/* Topo do Card de Família Vinculada */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                                contract.status === "ativo"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border-amber-200"
                              }`}
                            >
                              {contract.status === "ativo" ? "✓ Vínculo Ativo" : "⏳ Proposta Pendente"}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-2">
                              {contract.patientName} ({contract.patientAge} anos)
                            </h3>
                            <p className="text-xs text-neutral-500 font-bold mt-0.5">
                              Contratante: {contract.familyName}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-black text-neutral-900">
                              R$ {contract.hourlyRate}
                            </span>
                            <span className="text-xs text-neutral-500 block">/hora</span>
                          </div>
                        </div>

                        {/* Endereço e Localização */}
                        <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-medium flex items-center gap-2 mb-4">
                          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{contract.patientAddress}</span>
                        </div>

                        {/* Cuidados e Necessidades */}
                        <div className="p-4 rounded-2xl bg-white border-2 border-neutral-200 text-xs text-neutral-800 font-medium mb-5">
                          <span className="font-extrabold text-neutral-900 block mb-1">
                            Plano de Cuidado & Rotinas:
                          </span>
                          {contract.careNeeds}
                        </div>
                      </div>

                      {/* Ações de Plantão / Aceite */}
                      <div className="pt-4 border-t-2 border-neutral-100 flex items-center gap-3">
                        {contract.status === "ativo" ? (
                          <>
                            {contract.shiftActive ? (
                              <button
                                onClick={() => endShift(contract.id)}
                                className="flex-1 rounded-2xl bg-rose-600 hover:bg-rose-700 py-3.5 text-xs font-extrabold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                              >
                                <Square className="w-4 h-4" />
                                Encerrar Plantão & Salvar Diário
                              </button>
                            ) : (
                              <button
                                onClick={() => startShift(contract.id)}
                                className="flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3.5 text-xs font-extrabold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                              >
                                <Play className="w-4 h-4" />
                                Iniciar Plantão Presencial
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="flex w-full gap-2">
                            <button
                              onClick={() => acceptContract(contract.id)}
                              className="flex-1 rounded-2xl bg-[#72b63f] hover:bg-[#65a30d] py-3 text-xs font-extrabold text-white transition-all flex items-center justify-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Aceitar Proposta
                            </button>
                            <button
                              onClick={() => rejectContract(contract.id)}
                              className="flex-1 rounded-2xl bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 py-3 text-xs font-extrabold text-neutral-700 transition-all flex items-center justify-center gap-1.5"
                            >
                              <X className="w-4 h-4" />
                              Recusar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* PERFIL DA FAMÍLIA CONTRATANTE                                             */
          /* ========================================================================= */
          <>
            {/* ABA 1: MEUS ASSISTIDOS */}
            {activeTab === "assistidos" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-neutral-200 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold mb-2 border border-emerald-200">
                      <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                      Painel de Acompanhamento Familiar
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                      Familiares Assistidos
                    </h1>
                    <p className="text-neutral-600 text-sm font-medium mt-1">
                      Monitore o estado de saúde, diário de bordo e equipe de cuidadores vinculados em tempo real.
                    </p>
                  </div>

                  <Link
                    href="/assistido/novo"
                    className="self-start sm:self-auto inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-3.5 rounded-2xl text-xs font-extrabold hover:bg-neutral-800 transition-colors shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Novo Familiar
                  </Link>
                </div>

                {/* Card de Assistido Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="rounded-[32px] bg-white p-6 sm:p-8 shadow-sm border-2 border-neutral-200 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#72b63f] to-[#02a9b5]" />

                    <div>
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 shadow-sm border-2 border-neutral-200">
                          <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                            alt="Dona Helena"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                              Mãe
                            </span>
                            <span className="text-xs text-neutral-500 font-bold">78 anos</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 truncate">
                            Dona Helena Ribeiro de Castro
                          </h3>
                          <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1 font-bold">
                            <Activity className="w-4 h-4 text-[#02a9b5]" />
                            Mobilidade: Precisa de Apoio (Andador)
                          </p>
                        </div>
                      </div>

                      {/* Vitals e Cuidador Atual */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <div className="p-3.5 rounded-2xl bg-neutral-50 border-2 border-neutral-200">
                          <span className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-0.5">
                            Pressão Arterial
                          </span>
                          <span className="text-base font-black text-neutral-900">12x8 mmHg</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-neutral-50 border-2 border-neutral-200">
                          <span className="text-[10px] uppercase font-extrabold text-neutral-500 block mb-0.5">
                            Glicemia Capilar
                          </span>
                          <span className="text-base font-black text-neutral-900">104 mg/dL</span>
                        </div>
                        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-cyan-50/80 border-2 border-cyan-200">
                          <span className="text-[10px] uppercase font-extrabold text-cyan-800 block mb-0.5">
                            Cuidadora Vinculada
                          </span>
                          <span className="text-base font-black text-cyan-950">Ana Silva</span>
                        </div>
                      </div>

                      {/* Próximo Medicamento */}
                      <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center gap-3 mb-6">
                        <Pill className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <div className="text-xs">
                          <span className="font-extrabold text-amber-950">Próxima Medicação: </span>
                          <span className="text-amber-900 font-medium">Losartana 50mg às 12:00</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t-2 border-neutral-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setActiveTab("diario")}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-4 h-4" />
                        Ver Diário de Bordo
                      </button>
                      <button
                        onClick={() => setActiveTab("cuidadores")}
                        className="flex-1 py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-4 h-4 text-emerald-400" />
                        Buscar Novo Cuidador
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ABA 2: CUIDADORES DISPONÍVEIS & SINCRONIZAÇÃO DINÂMICA */}
            {activeTab === "cuidadores" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Header com Botão de Adicionar Cuidador */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-neutral-200 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-[#02a9b5] text-xs font-extrabold mb-2 border border-cyan-200">
                      <ShieldCheck className="w-4 h-4" />
                      Listagem Sincronizada em Tempo Real
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                      Cuidadores Verificados
                    </h1>
                    <p className="text-neutral-600 text-sm font-medium mt-1">
                      Profissionais validados com histórico de avaliações, checagem de antecedentes e contratação imediata.
                    </p>
                  </div>

                  <button
                    onClick={() => setAddCaregiverModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#02a9b5] hover:bg-[#0891b2] text-white px-5 py-3.5 rounded-2xl text-xs font-extrabold shadow-md transition-all active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    + Cadastrar Novo Cuidador
                  </button>
                </div>

                {/* Barra de Filtros e Busca Inteligente */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 sm:p-5 rounded-3xl border-2 border-neutral-200 shadow-sm">
                  {/* Busca por Nome/Especialidade */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome ou especialidade..."
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-xs sm:text-sm font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                    />
                  </div>

                  {/* Filtro por Especialidade */}
                  <div>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-xs sm:text-sm font-bold text-neutral-900 outline-none focus:border-[#02a9b5]"
                    >
                      <option value="all">Todas as Especialidades</option>
                      <option value="Alzheimer">Alzheimer & Demências</option>
                      <option value="Parkinson">Doença de Parkinson</option>
                      <option value="Pós-Cirúrgico">Cuidados Pós-Cirúrgicos</option>
                      <option value="Mobilidade">Reabilitação & Mobilidade</option>
                    </select>
                  </div>

                  {/* Faixa de Preço Máximo */}
                  <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-neutral-50 border-2 border-neutral-200">
                    <span className="text-xs font-extrabold text-neutral-700 whitespace-nowrap">
                      Até R$ {maxPrice}/h
                    </span>
                    <input
                      type="range"
                      min={30}
                      max={80}
                      step={5}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#02a9b5] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Grade de Cuidadores */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCaregivers.map((caregiver) => (
                    <div
                      key={caregiver.id}
                      className="group relative flex flex-col overflow-hidden rounded-[32px] bg-white p-6 shadow-sm border-2 border-neutral-200 justify-between transition-all hover:border-neutral-400 hover:shadow-md"
                    >
                      <div>
                        {/* Topo com Foto e Valor */}
                        <div className="relative mb-5 h-56 w-full overflow-hidden rounded-[24px] bg-neutral-100 border-2 border-neutral-200">
                          <img
                            src={caregiver.foto}
                            alt={caregiver.nome}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-neutral-900 border border-neutral-200 shadow-sm">
                            R$ {caregiver.valorHora}/h
                          </div>
                        </div>

                        {/* Badges e Avaliação */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Antecedentes OK
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-extrabold text-amber-900 border border-amber-200">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {caregiver.avaliacao} ({caregiver.avaliacoesQtd})
                          </span>
                        </div>

                        <h3 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
                          {caregiver.nome}
                        </h3>

                        <p className="mt-1 text-xs text-neutral-600 font-bold line-clamp-1">
                          {caregiver.especialidade} • {caregiver.experiencia}
                        </p>

                        {/* Tags de Habilidade */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {caregiver.habilidades.slice(0, 3).map((h, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-xl bg-neutral-100 text-[11px] font-bold text-neutral-800">
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Preview do Feedback Mais Recente */}
                        {caregiver.reviews.length > 0 && (
                          <div className="mt-4 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                            <p className="text-neutral-700 italic line-clamp-2">
                              "{caregiver.reviews[0].comment}"
                            </p>
                            <span className="text-[11px] font-extrabold text-neutral-500 mt-1 block">
                              — {caregiver.reviews[0].authorName}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Botões de Ação */}
                      <div className="mt-6 pt-4 border-t-2 border-neutral-100 flex items-center gap-2">
                        <button
                          onClick={() => openHire(caregiver)}
                          className="flex-1 rounded-2xl bg-neutral-900 hover:bg-neutral-800 py-3.5 text-center text-xs font-extrabold text-white shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <HeartHandshake className="w-4 h-4 text-emerald-400" />
                          Contratar
                        </button>
                        <button
                          onClick={() => openFeedback(caregiver)}
                          className="px-3.5 py-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold transition-colors flex items-center justify-center"
                          title="Avaliar Cuidador"
                        >
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ABA 3: CONTRATOS & VÍNCULOS ATIVOS */}
            {activeTab === "vinculos" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-neutral-200 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold mb-2 border border-emerald-200">
                      <HeartHandshake className="w-4 h-4 text-emerald-600" />
                      Gestão de Contratos e Propostas
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                      Contratos de Cuidados
                    </h1>
                    <p className="text-neutral-600 text-sm font-medium mt-1">
                      Acompanhe o status das propostas enviadas e os plantões em andamento.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {contracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="p-6 rounded-[32px] bg-white border-2 border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className={`px-3 py-0.5 rounded-full text-xs font-extrabold border ${
                              contract.status === "ativo"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : contract.status === "pendente"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {contract.status === "ativo"
                              ? "✓ Contrato Ativo"
                              : contract.status === "pendente"
                              ? "⏳ Aguardando Resposta do Cuidador"
                              : "✕ Recusado"}
                          </span>
                          <span className="text-xs text-neutral-400 font-bold">{contract.createdAt}</span>
                        </div>

                        <h3 className="text-xl font-extrabold text-neutral-900">
                          Cuidador(a): {contract.caregiverName}
                        </h3>
                        <p className="text-xs text-neutral-600 font-medium mt-0.5">
                          Assistido: <strong>{contract.patientName}</strong> • {contract.frequency} • R$ {contract.hourlyRate}/h
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {contract.status === "ativo" && (
                          <button
                            onClick={() => {
                              const cg = caregivers.find((c) => c.id === contract.caregiverId);
                              if (cg) openFeedback(cg);
                            }}
                            className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-extrabold border border-amber-200 flex items-center gap-1.5"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            Avaliar Cuidador
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ABA 4: DIÁRIO DE BORDO */}
            {activeTab === "diario" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-neutral-200 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-extrabold mb-2 border border-amber-200">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Auditoria & Acompanhamento Diário
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                      Diário de Bordo em Tempo Real
                    </h1>
                    <p className="text-neutral-600 text-sm font-medium mt-1">
                      Atualizações imediatas registradas pelo cuidador com validação de geolocalização e histórico auditável.
                    </p>
                  </div>
                </div>

                <div className="max-w-3xl space-y-4">
                  {[
                    {
                      id: "log-1",
                      hora: "10:30",
                      autor: "Ana Silva (Enfermeira)",
                      titulo: "Medicação Administrada",
                      descricao: "Administrado Losartana Potássica 50mg e suplementação vitamínica. Paciente hidratada com 300ml de água.",
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
                      className="rounded-3xl bg-white p-6 shadow-sm border-2 border-neutral-200 flex items-start gap-4"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex flex-col items-center justify-center flex-shrink-0 text-neutral-800 border border-neutral-200">
                        <Clock className="w-4 h-4 text-[#02a9b5]" />
                        <span className="text-[10px] font-black mt-0.5">{log.hora}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-base font-extrabold text-neutral-900">{log.titulo}</h4>
                          <span className="text-xs font-bold text-neutral-500">{log.autor}</span>
                        </div>
                        <p className="text-sm text-neutral-700 font-medium leading-relaxed">{log.descricao}</p>
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          {log.local}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Modais Globais */}
      <HireModal
        caregiver={targetHireCaregiver}
        isOpen={hireModalOpen}
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

      <AddCaregiverModal
        isOpen={addCaregiverModalOpen}
        onClose={() => setAddCaregiverModalOpen(false)}
      />
    </div>
  );
}
