"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Heart,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Lock,
  Sparkles,
  Bell,
  Star,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  LogOut,
  Play,
  Award,
  Zap,
  Eye,
  HeartHandshake,
  SlidersHorizontal,
  Building2,
  Stethoscope,
  FileCheck,
  Layers,
  Menu
} from "lucide-react";
import Logo from "@/components/Logo";
import NotificationCenter from "@/components/NotificationCenter";
import { useApp } from "@/context/AppContext";

export default function AdminPage() {
  const {
    userRole,
    setUserRole,
    caregivers,
    contracts,
    approveCaregiver,
    triggerDemoAlert
  } = useApp();

  const [activeTab, setActiveTab] = useState<"visao_geral" | "cuidadores" | "contratos" | "auditoria">("visao_geral");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Métricas executivas
  const totalCaregivers = caregivers.length;
  const activeContractsCount = contracts.filter((c) => c.status === "ativo").length;
  const totalVolumeEstimado = contracts.reduce((acc, c) => acc + c.hourlyRate * 160, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row selection:bg-[#72b63f] selection:text-white">
      {/* ========================================================================= */}
      {/* MENU LATERAL ESQUERDO (SIDEBAR ADM)                                       */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-neutral-200/80 flex flex-col justify-between md:min-h-screen sticky top-0 z-40 md:h-screen md:overflow-y-auto">
        <div>
          {/* Topo do Sidebar */}
          <div className="p-5 flex items-center justify-between border-b border-neutral-100">
            <Logo size="md" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className={`p-4 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
            {/* Tag de Identificação */}
            <div className="mb-4 p-3 rounded-xl bg-neutral-900 text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#02a9b5]" />
              <div>
                <span className="text-xs font-bold block">Portal ADM</span>
                <span className="text-[10px] text-neutral-400 block font-medium">Gestão & Governança</span>
              </div>
            </div>

            {/* Alternador de Visões */}
            <div className="bg-neutral-100 p-1 rounded-xl border border-neutral-200 flex mb-4">
              <button
                onClick={() => {
                  setUserRole("admin");
                  setActiveTab("visao_geral");
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  userRole === "admin"
                    ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <ShieldCheck className="w-3 h-3 text-[#02a9b5]" />
                ADM
              </button>
              <Link
                href="/dashboard"
                onClick={() => setUserRole("family")}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center gap-1"
              >
                <Heart className="w-3 h-3 text-[#72b63f]" />
                Família
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setUserRole("caregiver")}
                className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold text-neutral-500 hover:text-neutral-900 transition-all flex items-center justify-center gap-1"
              >
                <Stethoscope className="w-3 h-3 text-[#02a9b5]" />
                Cuidador
              </Link>
            </div>

            {/* Menu Vertical de Módulos ADM */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-2">
                Módulos do Sistema
              </span>

              <button
                onClick={() => {
                  setActiveTab("visao_geral");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === "visao_geral"
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Layers className="w-4 h-4 text-[#02a9b5]" />
                <span>Visão Geral 360°</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("cuidadores");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === "cuidadores"
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#02a9b5]" />
                  <span>Gestão de Cuidadores</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {caregivers.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("contratos");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                  activeTab === "contratos"
                    ? "bg-neutral-900 text-white shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileCheck className="w-4 h-4 text-[#72b63f]" />
                  <span>Contratos & Vínculos</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                  {contracts.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("auditoria");
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                  activeTab === "auditoria"
                    ? "bg-amber-50 text-amber-900 border border-amber-200"
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Simulador de Eventos</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rodapé do Sidebar */}
        <div className="p-4 border-t border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex-shrink-0 flex items-center justify-center text-xs font-bold">
              ADM
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-neutral-900 block truncate">
                Administrador
              </span>
              <span className="text-[11px] text-neutral-500 block truncate font-medium">
                Governança LongeVita
              </span>
            </div>
          </div>

          <Link
            href="/login"
            className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-neutral-200 transition-all"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* ÁREA DE CONTEÚDO PRINCIPAL (DIREITA)                                      */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 px-6 bg-white border-b border-neutral-200/80 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
            <span>Plataforma LongeVita</span>
            <span>/</span>
            <span className="text-neutral-900">Portal ADM</span>
            <span>/</span>
            <span className="text-[#028490]">
              {activeTab === "visao_geral" && "Visão Geral"}
              {activeTab === "cuidadores" && "Gestão de Cuidadores"}
              {activeTab === "contratos" && "Contratos & Vínculos"}
              {activeTab === "auditoria" && "Simulador de Eventos"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link
              href="/dashboard"
              className="text-xs font-bold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg border border-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
              Painel Familiar
            </Link>
          </div>
        </header>

        {/* Conteúdo da Aba */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full space-y-6">
          {/* ABA 1: VISÃO GERAL */}
          {activeTab === "visao_geral" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold mb-2 border border-emerald-500/25">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Operação Ativa • Conformidade LGPD Validada
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    Painel de Governança e Auditoria • LongeVita
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-300 max-w-2xl font-normal leading-relaxed">
                    Acompanhamento consolidado de profissionais credenciados, contratos formalizados, registros de saúde em tempo real e integridade regulatória.
                  </p>
                </div>
              </div>

              {/* Grid de Métricas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Cuidadores</span>
                    <div className="w-8 h-8 rounded-xl bg-[#02a9b5]/10 text-[#028490] flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-neutral-900">{totalCaregivers}</div>
                  <div className="mt-1.5 text-xs font-medium text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    100% com checagem de antecedentes
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Contratos Ativos</span>
                    <div className="w-8 h-8 rounded-xl bg-[#72b63f]/10 text-[#558a2e] flex items-center justify-center">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-neutral-900">{contracts.length}</div>
                  <div className="mt-1.5 text-xs font-medium text-neutral-600">
                    {activeContractsCount} contratos em atendimento presencial
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Volume Estimado</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-neutral-900">
                    R$ {(totalVolumeEstimado).toLocaleString("pt-BR")}
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-neutral-500">
                    Média de R$ 45/hora
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Avaliação Média</span>
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-neutral-900">4.94 / 5.0</div>
                  <div className="mt-1.5 text-xs font-medium text-emerald-700">
                    Índice de satisfação elevado
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ABA 2: CUIDADORES */}
          {activeTab === "cuidadores" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    Profissionais Credenciados
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium">
                    Auditoria de antecedentes criminais e especializações técnicas.
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar profissionais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium outline-none focus:border-[#02a9b5]"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Profissional</th>
                      <th className="p-4">Especialidade</th>
                      <th className="p-4">Valor da Hora</th>
                      <th className="p-4">Antecedentes</th>
                      <th className="p-4">Avaliação</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                    {caregivers
                      .filter((c) => c.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((cg) => (
                        <tr key={cg.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                                <img src={cg.foto} alt={cg.nome} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-bold text-neutral-900 block">{cg.nome}</span>
                                <span className="text-[11px] text-neutral-500">{cg.experiencia}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-neutral-700">{cg.especialidade}</td>
                          <td className="p-4 font-bold text-neutral-900">R$ {cg.valorHora}/h</td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-[11px] font-bold border border-[#72b63f]/25">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#72b63f]" />
                              Checado & Aprovado
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 font-bold text-neutral-900">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {cg.avaliacao} ({cg.avaliacoesQtd})
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <span className="px-3 py-1 rounded-lg bg-neutral-900 text-white text-xs font-bold">
                              Homologado
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ABA 3: CONTRATOS */}
          {activeTab === "contratos" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Contratos & Vínculos Formalizados
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  Rastreabilidade e consentimento sob a LGPD.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
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
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          {contract.status === "ativo" ? "Contrato Ativo" : "Proposta em Análise"}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">{contract.createdAt}</span>
                      </div>

                      <h3 className="text-base font-bold text-neutral-900">
                        {contract.patientName} ↔ Profissional {contract.caregiverName}
                      </h3>
                      <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                        Contratante: {contract.familyName} • Local: {contract.patientAddress}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-lg font-bold text-neutral-900">R$ {contract.hourlyRate}/h</span>
                      <span className="text-xs text-[#558a2e] block font-medium">Termo LGPD Assinado</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ABA 4: SIMULADOR DE EVENTOS */}
          {activeTab === "auditoria" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  Simulador de Eventos em Tempo Real
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  Acione os botões de simulação para testar a reatividade de notificações e diário de bordo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() =>
                    triggerDemoAlert(
                      "Check-in Presencial Confirmado",
                      "A cuidadora Ana Silva realizou o check-in presencial no endereço de Dona Helena (Geofencing e horário validados)."
                    )
                  }
                  className="p-5 rounded-2xl bg-white hover:bg-[#72b63f]/5 border border-neutral-200 hover:border-[#72b63f]/40 text-left transition-all group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#72b63f]/10 text-[#558a2e] flex items-center justify-center mb-3">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    1. Simular Check-in com Geofencing
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Gera registro de presença com coordenadas de GPS auditáveis.
                  </p>
                </button>

                <button
                  onClick={() =>
                    triggerDemoAlert(
                      "Sinais Vitais Aferidos",
                      "Pressão arterial de Dona Helena aferida: 12x8 mmHg. Glicemia de jejum: 98 mg/dL (Estável)."
                    )
                  }
                  className="p-5 rounded-2xl bg-white hover:bg-[#02a9b5]/5 border border-neutral-200 hover:border-[#02a9b5]/40 text-left transition-all group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#02a9b5]/10 text-[#028490] flex items-center justify-center mb-3">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    2. Simular Aferição de Sinais Vitais
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Alimenta o Diário de Bordo da família instantaneamente.
                  </p>
                </button>

                <button
                  onClick={() =>
                    triggerDemoAlert(
                      "Medicação Administrada",
                      "Losartana 50mg administrada pontualmente às 12:00 com registro no plano de cuidados."
                    )
                  }
                  className="p-5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 text-left transition-all group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center mb-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    3. Simular Administração de Medicamento
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Registra conformidade com a prescrição médica.
                  </p>
                </button>

                <button
                  onClick={() =>
                    triggerDemoAlert(
                      "Nova Solicitação de Vínculo Contratual",
                      "A Família Albuquerque enviou uma proposta de plantão noturno (R$ 48/hora)."
                    )
                  }
                  className="p-5 rounded-2xl bg-white hover:bg-[#02a9b5]/5 border border-neutral-200 hover:border-[#02a9b5]/40 text-left transition-all group shadow-sm"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#02a9b5]/10 text-[#028490] flex items-center justify-center mb-3">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    4. Simular Proposta de Contratação
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Exibe a notificação com botões de Aceitar/Recusar.
                  </p>
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
