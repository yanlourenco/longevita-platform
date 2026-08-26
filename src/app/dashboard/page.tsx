"use client";

import React, { useState, useMemo } from "react";
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
  ChevronDown
} from "lucide-react";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import HireModal from "@/components/HireModal";
import FeedbackModal from "@/components/FeedbackModal";
import AddCaregiverModal from "@/components/AddCaregiverModal";
import { useApp, Caregiver, Contract } from "@/context/AppContext";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          {/* Seletor de Perfil (Família vs Cuidador) */}
          <div className={`p-4 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
            <div className="bg-neutral-100 p-1 rounded-2xl border border-neutral-200 flex mb-4">
              <button
                onClick={() => {
                  setUserRole("family");
                  setActiveTab("assistidos");
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

            {/* Menu Vertical de Navegação */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-2">
                Navegação Principal
              </span>

              {userRole === "family" ? (
                <>
                  <button
                    onClick={() => {
                      setActiveTab("assistidos");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeTab === "assistidos"
                        ? "bg-[#72b63f]/10 text-[#558a2e] border border-[#72b63f]/25"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart className="w-4 h-4 text-[#72b63f]" />
                      <span>Meus Assistidos</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      1
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("cuidadores");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeTab === "cuidadores"
                        ? "bg-[#02a9b5]/10 text-[#028490] border border-[#02a9b5]/25"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#02a9b5]" />
                      <span>Cuidadores Disponíveis</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      {caregivers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("vinculos");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeTab === "vinculos"
                        ? "bg-neutral-900 text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <HeartHandshake className="w-4 h-4" />
                      <span>Vínculos & Contratos</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-neutral-700">
                      {contracts.length}
                    </span>
                  </button>

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
                      <span>Diário de Bordo</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Ativo
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setActiveTab("vinculos");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      activeTab === "vinculos"
                        ? "bg-[#02a9b5]/10 text-[#028490] border border-[#02a9b5]/25"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <HeartHandshake className="w-4 h-4 text-[#02a9b5]" />
                      <span>Famílias Vinculadas</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                      {caregiverContracts.length}
                    </span>
                  </button>

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
                      <span>Registrar no Diário</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Plantão
                    </span>
                  </button>
                </>
              )}
            </div>

            {/* Ações Rápidas no Menu Lateral */}
            <div className="pt-6 mt-6 border-t border-neutral-100 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 block">
                Ações Rápidas
              </span>

              {userRole === "family" ? (
                <Link
                  href="/assistido/novo"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Cadastrar Novo Familiar
                </Link>
              ) : (
                <button
                  onClick={() => setAddCaregiverModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#02a9b5] hover:bg-[#028490] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Atualizar Perfil Profissional
                </button>
              )}

              <Link
                href="/admin"
                className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-neutral-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
                Acessar Painel ADM
              </Link>
            </div>
          </div>
        </div>

        {/* Rodapé do Sidebar: Perfil do Usuário e Logout */}
        <div className="p-4 border-t border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-neutral-700">
              {userRole === "family" ? "MA" : "AS"}
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-neutral-900 block truncate">
                {userRole === "family" ? "Mariana Albuquerque" : "Ana Silva"}
              </span>
              <span className="text-[11px] text-neutral-500 block truncate font-medium">
                {userRole === "family" ? "Responsável Familiar" : "Enfermeira Padrão"}
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-neutral-200 transition-all"
            title="Sair da conta"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ÁREA DE CONTEÚDO PRINCIPAL (DIREITA)                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header da Área de Conteúdo */}
        <header className="h-16 px-6 bg-white border-b border-neutral-200/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
            <span>Plataforma LongeVita</span>
            <span>/</span>
            <span className="text-neutral-900">
              {userRole === "family" ? "Área da Família" : "Área do Cuidador"}
            </span>
            <span>/</span>
            <span className="text-[#028490] capitalize">
              {activeTab === "assistidos" && "Meus Assistidos"}
              {activeTab === "cuidadores" && "Cuidadores"}
              {activeTab === "vinculos" && "Vínculos & Contratos"}
              {activeTab === "diario" && "Diário de Bordo"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Central de Notificações */}
            <NotificationCenter />

            <Link
              href="/admin"
              className="text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
              ADM
            </Link>
          </div>
        </header>

        {/* Conteúdo Dinâmico da Aba Selecionada */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full">
          {/* ========================================================================= */}
          {/* PERFIL DO CUIDADOR: REGRAS DE VISIBILIDADE E VÍNCULO EXCLUSIVO            */}
          {/* ========================================================================= */}
          {userRole === "caregiver" ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#02a9b5]/10 text-[#028490] text-xs font-bold mb-2 border border-[#02a9b5]/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Painel de Cuidados Profissionais
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                    Famílias Vinculadas & Plantões
                  </h1>
                  <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                    Acesso restrito exclusivamente a famílias com contrato ativo ou proposta formalizada sob a LGPD.
                  </p>
                </div>
              </div>

              {/* Lista de Vínculos do Cuidador */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-[#02a9b5]" />
                  Contratos Ativos e Solicitações Recebidas ({caregiverContracts.length})
                </h3>

                {caregiverContracts.length === 0 ? (
                  <div className="p-12 rounded-2xl bg-white border border-dashed border-neutral-300 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-800">Nenhum Vínculo Ativo</h4>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      Você não possui famílias vinculadas no momento. Novas propostas aparecerão na Central de Notificações.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {caregiverContracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200 flex flex-col justify-between relative overflow-hidden"
                      >
                        <div
                          className={`absolute top-0 right-0 left-0 h-1 ${
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
                                {contract.status === "ativo" ? "Contrato Ativo" : "Proposta Pendente"}
                              </span>
                              <h3 className="text-xl font-bold text-neutral-900 mt-2">
                                {contract.patientName} ({contract.patientAge} anos)
                              </h3>
                              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                                Responsável: {contract.familyName}
                              </p>
                            </div>

                            <div className="text-right">
                              <span className="text-lg font-bold text-neutral-900">
                                R$ {contract.hourlyRate}
                              </span>
                              <span className="text-xs text-neutral-500 block">/hora</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-medium flex items-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 text-[#72b63f] flex-shrink-0" />
                            <span>{contract.patientAddress}</span>
                          </div>

                          <div className="p-3.5 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-800 font-medium mb-5">
                            <span className="font-bold text-neutral-900 block mb-1">
                              Plano de Cuidado & Rotinas:
                            </span>
                            {contract.careNeeds}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-neutral-100 flex items-center gap-2">
                          {contract.status === "ativo" ? (
                            <>
                              {contract.shiftActive ? (
                                <button
                                  onClick={() => endShift(contract.id)}
                                  className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 py-2.5 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                  <Square className="w-4 h-4" />
                                  Concluir Turno & Salvar Diário
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
                            </>
                          ) : (
                            <div className="flex w-full gap-2">
                              <button
                                onClick={() => acceptContract(contract.id)}
                                className="flex-1 rounded-xl bg-[#72b63f] hover:bg-[#63a035] py-2.5 text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5"
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold mb-2 border border-[#72b63f]/20">
                        <Heart className="w-3.5 h-3.5" />
                        Acompanhamento Clínico Familiar
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                        Familiares Assistidos
                      </h1>
                      <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                        Monitoramento de sinais vitais, medicação contínua e relatórios em tempo real.
                      </p>
                    </div>

                    <Link
                      href="/assistido/novo"
                      className="self-start sm:self-auto inline-flex items-center gap-2 bg-[#72b63f] hover:bg-[#63a035] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Familiar
                    </Link>
                  </div>

                  {/* Card de Assistido Principal */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-200 flex flex-col justify-between relative overflow-hidden">
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#72b63f] to-[#02a9b5]" />

                      <div>
                        <div className="flex items-start gap-4 mb-5">
                          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 shadow-sm border border-neutral-200">
                            <img
                              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                              alt="Dona Helena"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="px-2.5 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold border border-[#72b63f]/20">
                                Mãe
                              </span>
                              <span className="text-xs text-neutral-500 font-medium">78 anos</span>
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 truncate">
                              Dona Helena Ribeiro de Castro
                            </h3>
                            <p className="text-xs text-neutral-600 mt-0.5 flex items-center gap-1 font-medium">
                              <Activity className="w-3.5 h-3.5 text-[#02a9b5]" />
                              Mobilidade: Auxílio com Andador
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
                          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">
                              Pressão Arterial
                            </span>
                            <span className="text-sm font-bold text-neutral-900">12x8 mmHg</span>
                          </div>
                          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                            <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-0.5">
                              Glicemia
                            </span>
                            <span className="text-sm font-bold text-neutral-900">104 mg/dL</span>
                          </div>
                          <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-[#02a9b5]/10 border border-[#02a9b5]/20">
                            <span className="text-[10px] uppercase font-bold text-[#028490] block mb-0.5">
                              Cuidadora Ativa
                            </span>
                            <span className="text-sm font-bold text-[#028490]">Ana Silva</span>
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center gap-3 mb-5">
                          <Pill className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <div className="text-xs">
                            <span className="font-bold text-amber-900">Próxima Medicação: </span>
                            <span className="text-amber-800">Losartana 50mg às 12:00</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3.5 border-t border-neutral-100 flex items-center justify-between gap-2.5">
                        <button
                          onClick={() => setActiveTab("diario")}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Diário de Bordo
                        </button>
                        <button
                          onClick={() => setActiveTab("cuidadores")}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Users className="w-3.5 h-3.5 text-[#72b63f]" />
                          Buscar Profissionais
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ABA 2: CUIDADORES DISPONÍVEIS */}
              {activeTab === "cuidadores" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#02a9b5]/10 text-[#028490] text-xs font-bold mb-2 border border-[#02a9b5]/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Listagem Homologada & Atualização em Tempo Real
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                        Cuidadores Especializados
                      </h1>
                      <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                        Profissionais validados com histórico de avaliações, checagem de antecedentes e contratação direta.
                      </p>
                    </div>

                    <button
                      onClick={() => setAddCaregiverModalOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-[#02a9b5] hover:bg-[#028490] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-98"
                    >
                      <UserPlus className="w-4 h-4" />
                      Cadastrar Profissional
                    </button>
                  </div>

                  {/* Barra de Filtros e Busca */}
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
                        max={80}
                        step={5}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-[#02a9b5] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Grade de Cuidadores */}
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredCaregivers.map((caregiver) => (
                      <div
                        key={caregiver.id}
                        className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-sm border border-neutral-200 justify-between transition-all hover:border-neutral-300"
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
                            {caregiver.habilidades.slice(0, 2).map((h, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-neutral-100 text-[10px] font-medium text-neutral-700">
                                {h}
                              </span>
                            ))}
                          </div>
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
                            title="Avaliar Atendimento"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-500" />
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold mb-2 border border-[#72b63f]/20">
                        <HeartHandshake className="w-3.5 h-3.5" />
                        Gestão de Contratos e Vínculos
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                        Contratos de Atendimento
                      </h1>
                      <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                        Acompanhe o status das propostas de cuidado enviadas e os plantões ativos.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {contracts.map((contract) => (
                      <div
                        key={contract.id}
                        className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
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
                                : "Recusado"}
                            </span>
                            <span className="text-xs text-neutral-400 font-medium">{contract.createdAt}</span>
                          </div>

                          <h3 className="text-lg font-bold text-neutral-900">
                            Profissional: {contract.caregiverName}
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
                              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center gap-1.5"
                            >
                              <Star className="w-3.5 h-3.5 text-amber-500" />
                              Avaliar Atendimento
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/80 pb-5">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
                        <FileText className="w-3.5 h-3.5" />
                        Auditoria de Plantão & Relatórios Diários
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                        Diário de Bordo em Tempo Real
                      </h1>
                      <p className="text-neutral-600 text-xs sm:text-sm font-medium mt-1">
                        Registros de rotina preenchidos pelo cuidador com validação presencial de geolocalização.
                      </p>
                    </div>
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
                        className="rounded-2xl bg-white p-5 shadow-sm border border-neutral-200 flex items-start gap-4"
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
            </>
          )}
        </main>
      </div>

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
