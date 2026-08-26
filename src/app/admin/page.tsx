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
  Layers
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

  // Métricas executivas
  const totalCaregivers = caregivers.length;
  const activeContractsCount = contracts.filter((c) => c.status === "ativo").length;
  const totalVolumeEstimado = contracts.reduce((acc, c) => acc + c.hourlyRate * 160, 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-[#72b63f] selection:text-white pb-24">
      {/* Navbar Superior Executiva */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-neutral-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-bold uppercase tracking-wider">
              Painel ADM
            </span>
          </div>

          {/* Alternador de Visões do Ecossistema */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              onClick={() => {
                setUserRole("admin");
                setActiveTab("visao_geral");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                userRole === "admin"
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
              ADM
            </button>
            <Link
              href="/dashboard"
              onClick={() => setUserRole("family")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                userRole === "family"
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
              Família
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setUserRole("caregiver")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                userRole === "caregiver"
                  ? "bg-white text-neutral-900 shadow-sm border border-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#02a9b5]" />
              Cuidador
            </Link>
          </div>

          {/* Notificações e Desconectar */}
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link
              href="/login"
              className="text-xs font-bold text-neutral-600 hover:text-rose-600 px-3.5 py-2.5 rounded-xl hover:bg-neutral-100 border border-neutral-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </Link>
          </div>
        </div>

        {/* Abas Administrativas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 border-t border-neutral-100 py-2.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab("visao_geral")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "visao_geral"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Visão Geral Executiva
          </button>
          <button
            onClick={() => setActiveTab("cuidadores")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "cuidadores"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Gestão de Profissionais ({caregivers.length})
          </button>
          <button
            onClick={() => setActiveTab("contratos")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "contratos"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            Contratos & Vínculos ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab("auditoria")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "auditoria"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Simulador de Eventos
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* ========================================================================= */}
        {/* ABA 1: VISÃO GERAL 360° (MÉTRICAS EXECUTIVAS)                            */}
        {/* ========================================================================= */}
        {activeTab === "visao_geral" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Header de Governança */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 text-white shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/25">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Operação Ativa • Conformidade LGPD Validada
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Painel de Governança e Auditoria • LongeVita
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-300 max-w-2xl font-normal leading-relaxed">
                  Acompanhamento consolidado de profissionais credenciados, contratos formalizados, registros de saúde em tempo real e integridade regulatória.
                </p>
              </div>
            </div>

            {/* Grid de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Cuidadores Credenciados</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider">Contratos & Vínculos</span>
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
                  <span className="text-xs font-bold uppercase tracking-wider">Volume Gerenciado</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-neutral-900">
                  R$ {(totalVolumeEstimado).toLocaleString("pt-BR")}
                </div>
                <div className="mt-1.5 text-xs font-medium text-neutral-500">
                  Valor médio: R$ 45/hora
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

            {/* Módulos de Acesso Rápido */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#02a9b5]" />
                Navegação entre Perfis da Plataforma
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/dashboard"
                  onClick={() => setUserRole("family")}
                  className="p-5 rounded-2xl bg-neutral-50 hover:bg-[#72b63f]/5 border border-neutral-200 hover:border-[#72b63f]/40 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-[#558a2e] uppercase tracking-wider block mb-1">
                    Visão • Família Contratante
                  </span>
                  <h4 className="text-sm font-extrabold text-neutral-900 group-hover:text-emerald-950">
                    Acessar Painel da Família →
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Monitoramento de sinais vitais, medicação e diário de bordo da Dona Helena.
                  </p>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setUserRole("caregiver")}
                  className="p-5 rounded-2xl bg-neutral-50 hover:bg-[#02a9b5]/5 border border-neutral-200 hover:border-[#02a9b5]/40 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-[#028490] uppercase tracking-wider block mb-1">
                    Visão • Cuidador Profissional
                  </span>
                  <h4 className="text-sm font-extrabold text-neutral-900 group-hover:text-cyan-950">
                    Acessar Painel do Cuidador →
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Regras de visibilidade estrita, plantão presencial e gestão de propostas.
                  </p>
                </Link>

                <Link
                  href="/assistido/novo"
                  className="p-5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 hover:border-neutral-400 transition-all text-left group"
                >
                  <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
                    Fluxo • Admissão do Idoso
                  </span>
                  <h4 className="text-sm font-extrabold text-neutral-900">
                    Cadastrar Novo Assistido →
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Formulário em 3 etapas com busca preditiva de 20+ comorbidades e rotinas.
                  </p>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: GESTÃO DE CUIDADORES & HOMOLOGAÇÃO                                  */}
        {/* ========================================================================= */}
        {activeTab === "cuidadores" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  Profissionais Homologados & Credenciamento
                </h2>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  Verificação de antecedentes criminais, diplomas técnicos e métricas de desempenho.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrar por nome ou área..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium outline-none focus:border-[#02a9b5]"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="p-4">Profissional</th>
                      <th className="p-4">Especialidade</th>
                      <th className="p-4">Valor da Hora</th>
                      <th className="p-4">Antecedentes</th>
                      <th className="p-4">Avaliação Média</th>
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
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* ABA 3: GESTÃO DE CONTRATOS & VÍNCULOS LGPD                                 */}
        {/* ========================================================================= */}
        {activeTab === "contratos" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Contratos & Vínculos Formalizados
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Rastreabilidade de plantões e temporalidade de consentimento sob a LGPD.
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

                    <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                      {contract.patientName} ↔ Profissional {contract.caregiverName}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-0.5 font-medium">
                      Contratante: {contract.familyName} • Local: {contract.patientAddress}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Plano: {contract.careNeeds}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xl font-bold text-neutral-900">R$ {contract.hourlyRate}/h</span>
                    <span className="text-xs text-[#558a2e] block font-medium mt-0.5">Termo LGPD Homologado</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* ABA 4: SIMULADOR DE DEMONSTRAÇÃO AO VIVO (SHOWCASE)                        */}
        {/* ========================================================================= */}
        {activeTab === "auditoria" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Simulador de Eventos em Tempo Real
              </h2>
              <p className="text-xs text-neutral-500 font-medium mt-0.5">
                Acione os botões de simulação para demonstrar a reatividade de notificações e relatórios de diário de bordo.
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
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-950">
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
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-cyan-950">
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
                className="p-5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-left transition-all group shadow-sm"
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
                <h4 className="text-sm font-bold text-neutral-900 group-hover:text-cyan-950">
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
  );
}
