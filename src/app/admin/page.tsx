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
  HeartHandshake
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b-2 border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[11px] font-black uppercase tracking-wider">
              👑 Painel Master ADM
            </span>
          </div>

          {/* Alternador Rápido de Papéis para Demonstração */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-2xl border border-neutral-300">
            <button
              onClick={() => {
                setUserRole("admin");
                setActiveTab("visao_geral");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                userRole === "admin"
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              👑 Admin Master
            </button>
            <Link
              href="/dashboard"
              onClick={() => setUserRole("family")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                userRole === "family"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              👨‍👩‍👦 Família
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setUserRole("caregiver")}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${
                userRole === "caregiver"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              🩺 Cuidador
            </Link>
          </div>

          {/* Notificações e Sair */}
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link
              href="/login"
              className="text-xs font-extrabold text-neutral-700 hover:text-rose-600 px-3.5 py-2.5 rounded-2xl hover:bg-neutral-100 border border-neutral-300 transition-colors flex items-center gap-1"
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
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === "visao_geral"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            📊 Visão Geral 360°
          </button>
          <button
            onClick={() => setActiveTab("cuidadores")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === "cuidadores"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            🩺 Gestão de Cuidadores ({caregivers.length})
          </button>
          <button
            onClick={() => setActiveTab("contratos")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === "contratos"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            📋 Contratos & Plantões ({contracts.length})
          </button>
          <button
            onClick={() => setActiveTab("auditoria")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === "auditoria"
                ? "bg-neutral-900 text-white shadow-sm"
                : "bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
            }`}
          >
            ⚡ Simulador de Demonstração
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
            {/* Header de Boas-vindas ADM */}
            <div className="p-6 sm:p-8 rounded-[36px] bg-gradient-to-r from-neutral-900 via-neutral-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30 inline-block mb-3">
                  ● Sistema 100% Operacional & LGPD Compliance
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Painel de Controle Executivo • LongeVita
                </h1>
                <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-2xl font-medium">
                  Monitore em tempo real todos os dados de cuidadores credenciados, contratos de famílias contratantes, registros de sinais vitais e conformidade regulatória.
                </p>
              </div>
            </div>

            {/* Grid de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-[28px] bg-white border-2 border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Cuidadores Homologados</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-[#02a9b5] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-neutral-900">{totalCaregivers}</div>
                <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  100% com antecedentes checados
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-white border-2 border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Vínculos & Contratos</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-neutral-900">{contracts.length}</div>
                <div className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {activeContractsCount} contratos com plantão ativo
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-white border-2 border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Volume Transacionado</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-neutral-900">
                  R$ {(totalVolumeEstimado).toLocaleString("pt-BR")}
                </div>
                <div className="mt-2 text-xs font-bold text-neutral-500">
                  Média de R$ 45/hora por plantão
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-white border-2 border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between text-neutral-500 mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider">Índice de Avaliação</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Star className="w-5 h-5 fill-purple-500" />
                  </div>
                </div>
                <div className="text-3xl font-black text-neutral-900">4.94 ⭐</div>
                <div className="mt-2 text-xs font-bold text-purple-700">
                  100% de satisfação das famílias
                </div>
              </div>
            </div>

            {/* Ações Rápidas de Demonstração */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-white border-2 border-neutral-200 shadow-sm">
              <h3 className="text-lg font-extrabold text-neutral-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Atalhos Rápidos de Demonstração do Projeto
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/dashboard"
                  onClick={() => setUserRole("family")}
                  className="p-5 rounded-2xl bg-neutral-50 hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-300 transition-all text-left group"
                >
                  <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block mb-1">
                    Visão 1 • Família Contratante
                  </span>
                  <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-emerald-950">
                    Acessar Painel da Família →
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Ver rotinas de saúde da Dona Helena, busca preditiva e diário de bordo.
                  </p>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => setUserRole("caregiver")}
                  className="p-5 rounded-2xl bg-neutral-50 hover:bg-cyan-50 border-2 border-neutral-200 hover:border-cyan-300 transition-all text-left group"
                >
                  <span className="text-xs font-extrabold text-[#02a9b5] uppercase tracking-wider block mb-1">
                    Visão 2 • Cuidador Profissional
                  </span>
                  <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-cyan-950">
                    Acessar Painel do Cuidador →
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Ver regras de visibilidade estrita, iniciar plantão e aceitar propostas.
                  </p>
                </Link>

                <Link
                  href="/assistido/novo"
                  className="p-5 rounded-2xl bg-neutral-50 hover:bg-purple-50 border-2 border-neutral-200 hover:border-purple-300 transition-all text-left group"
                >
                  <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block mb-1">
                    Fluxo 3 • Cadastro do Idoso
                  </span>
                  <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-purple-950">
                    Demonstrar Stepper do Idoso →
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1">
                    Busca inteligente de 20+ comorbidades, medicações e cuidados especiais.
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
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                  Cuidadores Credenciados & Verificados
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  Auditoria de antecedentes criminais, certificados e histórico de avaliações.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar cuidador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2.5 rounded-2xl bg-white border-2 border-neutral-300 text-xs sm:text-sm font-medium outline-none focus:border-[#02a9b5]"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="bg-white rounded-[32px] border-2 border-neutral-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-neutral-50 border-b-2 border-neutral-200 text-neutral-600 font-extrabold uppercase text-[11px]">
                    <tr>
                      <th className="p-4 sm:p-5">Cuidador</th>
                      <th className="p-4 sm:p-5">Especialidade</th>
                      <th className="p-4 sm:p-5">Valor / Hora</th>
                      <th className="p-4 sm:p-5">Antecedentes</th>
                      <th className="p-4 sm:p-5">Avaliação</th>
                      <th className="p-4 sm:p-5 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                    {caregivers
                      .filter((c) => c.nome.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((cg) => (
                        <tr key={cg.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="p-4 sm:p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 border">
                                <img src={cg.foto} alt={cg.nome} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-extrabold text-neutral-900 block">{cg.nome}</span>
                                <span className="text-[11px] text-neutral-500 font-bold">{cg.experiencia}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 text-neutral-700 font-semibold">{cg.especialidade}</td>
                          <td className="p-4 sm:p-5 font-black text-neutral-900">R$ {cg.valorHora}/h</td>
                          <td className="p-4 sm:p-5">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Checado & OK
                            </span>
                          </td>
                          <td className="p-4 sm:p-5">
                            <div className="flex items-center gap-1 font-extrabold text-neutral-900">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {cg.avaliacao} ({cg.avaliacoesQtd})
                            </div>
                          </td>
                          <td className="p-4 sm:p-5 text-right">
                            <button
                              onClick={() => approveCaregiver(cg.id)}
                              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-extrabold transition-all"
                            >
                              Homologado
                            </button>
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
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                Contratos e Vínculos Ativos da Plataforma
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Auditoria de termos de consentimento e temporalidade de dados da LGPD.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
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
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {contract.status === "ativo" ? "● Plantão Homologado" : "⏳ Pendente"}
                      </span>
                      <span className="text-xs text-neutral-400 font-bold">{contract.createdAt}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-neutral-900">
                      {contract.patientName} ↔ Cuidador(a) {contract.caregiverName}
                    </h3>
                    <p className="text-xs text-neutral-600 font-medium mt-1">
                      Contratante: <strong>{contract.familyName}</strong> • {contract.patientAddress}
                    </p>
                    <p className="text-xs text-neutral-500 font-bold mt-0.5">
                      Rotina: {contract.careNeeds}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl font-black text-neutral-900">R$ {contract.hourlyRate}/h</span>
                    <span className="text-xs text-emerald-600 block font-bold">Termo LGPD Assinado</span>
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
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                Simulador de Eventos em Tempo Real
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Clique nos botões abaixo durante sua apresentação para disparar notificações e demonstrar a reatividade instantânea da LongeVita.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() =>
                  triggerDemoAlert(
                    "Check-in Realizado com Geofencing 📍",
                    "A cuidadora Ana Silva acaba de realizar check-in presencial no endereço da Dona Helena."
                  )
                }
                className="p-6 rounded-[28px] bg-white hover:bg-emerald-50/60 border-2 border-neutral-200 hover:border-emerald-400 text-left transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-emerald-950">
                  1. Simular Check-in com Geofencing
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Dispara notificação de início de plantão presencial com validação de GPS.
                </p>
              </button>

              <button
                onClick={() =>
                  triggerDemoAlert(
                    "Sinal Vital Registrado 🩺",
                    "Pressão arterial de Dona Helena aferida: 12x8 mmHg. Glicemia: 98 mg/dL (Estável)."
                  )
                }
                className="p-6 rounded-[28px] bg-white hover:bg-cyan-50/60 border-2 border-neutral-200 hover:border-cyan-400 text-left transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-[#02a9b5] flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-cyan-950">
                  2. Simular Aferição de Sinais Vitais
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Adiciona registro instantâneo ao Diário de Bordo da família.
                </p>
              </button>

              <button
                onClick={() =>
                  triggerDemoAlert(
                    "Medicação Administrada 💊",
                    "Losartana 50mg administrada pontualmente às 12:00 com 300ml de água."
                  )
                }
                className="p-6 rounded-[28px] bg-white hover:bg-amber-50/60 border-2 border-neutral-200 hover:border-amber-400 text-left transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-amber-950">
                  3. Simular Administração de Remédio
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Registra confirmação do medicamento diário no sistema auditável.
                </p>
              </button>

              <button
                onClick={() =>
                  triggerDemoAlert(
                    "Nova Proposta de Vínculo Recebida! 🎉",
                    "A Família Albuquerque enviou uma proposta de plantão noturno de R$ 48/hora."
                  )
                }
                className="p-6 rounded-[28px] bg-white hover:bg-purple-50/60 border-2 border-neutral-200 hover:border-purple-400 text-left transition-all group shadow-sm"
              >
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-neutral-900 group-hover:text-purple-950">
                  4. Simular Nova Contratação
                </h4>
                <p className="text-xs text-neutral-600 mt-1">
                  Exibe a notificação com botões de Aceitar/Recusar na Central de Notificações.
                </p>
              </button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
