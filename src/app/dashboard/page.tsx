"use client";

import React, { useState, useEffect } from "react";
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
  LogOut
} from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/components/ToastProvider";
import { createClient } from "@/lib/supabase/client";

// Interface do Cuidador
interface Cuidador {
  id: string;
  nome: string;
  especialidade: string;
  experiencia: string;
  avaliacao: number;
  avaliacoesQtd: number;
  valorHora: string;
  foto: string;
  biografia: string;
  antecedentesChecados: boolean;
  formacaoVerificada: boolean;
  disponibilidade: string;
  habilidades: string[];
}

const CUIDADORES_MOCK: Cuidador[] = [
  {
    id: "cuidador-1",
    nome: "Ana Silva",
    especialidade: "Especialista em Alzheimer & Idosos Acamados",
    experiencia: "8 anos de experiência",
    avaliacao: 4.95,
    avaliacoesQtd: 42,
    valorHora: "R$ 45/h",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    biografia: "Enfermeira padrão com mais de 8 anos de experiência em cuidados intensivos domiciliares de alta complexidade. Focada em atendimento humanizado, estímulo cognitivo e rotinas estruturadas de reabilitação.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    disponibilidade: "Plantão Ativo (Hoje até 19:00)",
    habilidades: ["Administração de Medicamentos", "Estímulo Cognitivo", "Cuidados com Sonda", "Fisioterapia Básica"]
  },
  {
    id: "cuidador-2",
    nome: "Carlos Eduardo Mendes",
    especialidade: "Companhia Ativa & Reabilitação Motora",
    experiencia: "6 anos de experiência",
    avaliacao: 4.88,
    avaliacoesQtd: 35,
    valorHora: "R$ 38/h",
    foto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    biografia: "Técnico de enfermagem dedicado a atividades recreativas, mobilidade e auxílio em rotinas diárias. Paciente, pontual e certificado em primeiros socorros geriátricos.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    disponibilidade: "Segunda a Sexta (Horário Comercial)",
    habilidades: ["Passeios & Mobilidade", "Acompanhamento em Consultas", "Preparo de Refeições Nutritivas"]
  },
  {
    id: "cuidador-3",
    nome: "Mariana Oliveira",
    especialidade: "Gerontologia & Cuidados Pós-Cirúrgicos",
    experiencia: "10 anos de experiência",
    avaliacao: 5.0,
    avaliacoesQtd: 58,
    valorHora: "R$ 52/h",
    foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    biografia: "Especialista em geriatria hospitalar e suporte domiciliar avançado. Vasta experiência no controle de sinais vitais, curativos complexos e adaptação de ambientes seguros.",
    antecedentesChecados: true,
    formacaoVerificada: true,
    disponibilidade: "Finais de Semana & Plantões 24h",
    habilidades: ["Curativos Complexos", "Monitoramento de Sinais Vitais", "Apoio Psicoemocional"]
  }
];

const ASSISTIDOS_MOCK = [
  {
    id: "assistido-1",
    nome: "Dona Helena Ribeiro de Castro",
    idade: 78,
    parentesco: "Mãe",
    mobilidade: "Precisa de Apoio (Andador)",
    cuidadorAtivo: "Ana Silva",
    statusCuidador: "Em plantão domiciliar agora",
    condicoes: ["Hipertensão Arterial", "Alzheimer Leve"],
    proximoMedicamento: "Losartana 50mg às 12:00",
    pressaoAtual: "12x8 mmHg",
    glicemia: "104 mg/dL",
    alimentacaoStatus: "Almoço pastoso concluído com 100% de aceitação",
    foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
  }
];

const DIARIO_LOGS = [
  {
    id: "log-1",
    hora: "10:30",
    autor: "Ana Silva (Enfermeira)",
    tipo: "medicacao",
    titulo: "Medicação Administrada",
    descricao: "Administrado Losartana Potássica 50mg e suplementação vitamínica. Paciente hidratada com 300ml de água.",
    local: "São Paulo, SP (Geofencing Validado)"
  },
  {
    id: "log-2",
    hora: "09:00",
    autor: "Ana Silva (Enfermeira)",
    tipo: "alimentacao",
    titulo: "Café da Manhã & Sinais Vitais",
    descricao: "PA aferida: 120/80 mmHg. Glicemia de jejum: 104 mg/dL. Dieta pastosa consumida sem intercorrências.",
    local: "São Paulo, SP"
  },
  {
    id: "log-3",
    hora: "07:45",
    autor: "Sistema LongeVita",
    tipo: "checkin",
    titulo: "Check-in de Cuidador Realizado",
    descricao: "Início do plantão contratual com conformidade LGPD e temporalidade ativa.",
    local: "São Paulo, SP"
  }
];

const APPLE_SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 0.8
};

export default function DashboardPage() {
  const { success } = useToast();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<"assistidos" | "cuidadores" | "diario">("assistidos");
  const [selectedCuidadorId, setSelectedCuidadorId] = useState<string | null>(null);
  const [hiredStatus, setHiredStatus] = useState<string | null>(null);
  const [assistidos, setAssistidos] = useState(ASSISTIDOS_MOCK);
  const [userName, setUserName] = useState("Família");

  useEffect(() => {
    try {
      const storedName = sessionStorage.getItem("longevita_contractor_name");
      if (storedName) setUserName(storedName.split(" ")[0]);

      const demoData = sessionStorage.getItem("longevita_assistido_demo");
      if (demoData) {
        const parsed = JSON.parse(demoData);
        const condicoesParsed = parsed.condicoesMedicas ? JSON.parse(parsed.condicoesMedicas) : {};
        const novoAssistido = {
          id: `assistido-${Date.now()}`,
          nome: parsed.nome,
          idade: 76,
          parentesco: condicoesParsed.parentesco || "Familiar",
          mobilidade: condicoesParsed.mobilidade || "Apoio",
          cuidadorAtivo: "Carlos Eduardo Mendes",
          statusCuidador: "Disponível para agendamento",
          condicoes: condicoesParsed.condicoes?.map((c: any) => c.nome) || ["Cuidados Geriátricos"],
          proximoMedicamento: condicoesParsed.medicamentos?.[0]
            ? `${condicoesParsed.medicamentos[0].nome} às ${condicoesParsed.medicamentos[0].horario}`
            : "Nenhum no momento",
          pressaoAtual: "12x8 mmHg",
          glicemia: "98 mg/dL",
          alimentacaoStatus: condicoesParsed.alimentacao || "Normal",
          foto: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop"
        };
        setAssistidos((prev) => [novoAssistido, ...prev.filter(a => a.id !== novoAssistido.id)]);
      }
    } catch (e) {
      console.warn("Storage check:", e);
    }
  }, []);

  const activeCuidador = CUIDADORES_MOCK.find(c => c.id === selectedCuidadorId);

  const handleHire = (type: string) => {
    setHiredStatus(type);
    success("Contrato LGPD Gerado!", `Vínculo com ${activeCuidador?.nome} registrado com sucesso.`);
    setTimeout(() => {
      setHiredStatus(null);
      setSelectedCuidadorId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] selection:bg-[#72b63f] selection:text-white pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
          <Logo size="md" />

          {/* Navegação por Abas */}
          <nav className="hidden md:flex items-center bg-neutral-100/90 p-1.5 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab("assistidos")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "assistidos"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#72b63f]" />
              Meus Assistidos ({assistidos.length})
            </button>
            <button
              onClick={() => setActiveTab("cuidadores")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "cuidadores"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#02a9b5]" />
              Cuidadores Disponíveis
            </button>
            <button
              onClick={() => setActiveTab("diario")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === "diario"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-500" />
              Diário de Bordo
            </button>
          </nav>

          {/* Ações */}
          <div className="flex items-center gap-3">
            <Link
              href="/assistido/novo"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#72b63f] to-[#02a9b5] text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md shadow-[#02a9b5]/20 hover:opacity-95 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Cadastrar</span> Assistido
            </Link>

            <Link
              href="/login"
              className="text-xs font-bold text-neutral-500 hover:text-rose-500 px-3 py-2 rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </Link>
          </div>
        </div>

        {/* Mobile Tab Nav */}
        <div className="flex md:hidden border-t border-neutral-100 bg-white px-4 py-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("assistidos")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl whitespace-nowrap ${
              activeTab === "assistidos" ? "bg-neutral-900 text-white" : "text-neutral-500"
            }`}
          >
            Meus Assistidos
          </button>
          <button
            onClick={() => setActiveTab("cuidadores")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl whitespace-nowrap ${
              activeTab === "cuidadores" ? "bg-neutral-900 text-white" : "text-neutral-500"
            }`}
          >
            Cuidadores
          </button>
          <button
            onClick={() => setActiveTab("diario")}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-xl whitespace-nowrap ${
              activeTab === "diario" ? "bg-neutral-900 text-white" : "text-neutral-500"
            }`}
          >
            Diário de Bordo
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
        {/* ABA 1: MEUS ASSISTIDOS */}
        {activeTab === "assistidos" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/60 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-100">
                  <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  Painel de Acompanhamento • Olá, {userName}!
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                  Familiares Assistidos
                </h1>
                <p className="text-neutral-500 text-sm sm:text-base mt-1">
                  Monitore o estado de saúde, diário de bordo e equipe de cuidadores vinculados em tempo real.
                </p>
              </div>

              <Link
                href="/assistido/novo"
                className="self-start sm:self-auto inline-flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Adicionar Novo Familiar
              </Link>
            </div>

            {/* Cards de Assistidos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {assistidos.map((assistido) => (
                <div
                  key={assistido.id}
                  className="rounded-[32px] bg-white p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] border border-neutral-100/90 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-[#72b63f] to-[#02a9b5]" />

                  <div>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 shadow-sm">
                        <img
                          src={assistido.foto}
                          alt={assistido.nome}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                            {assistido.parentesco}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium">{assistido.idade} anos</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 truncate">
                          {assistido.nome}
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1 font-medium">
                          <Activity className="w-3.5 h-3.5 text-[#02a9b5]" />
                          Mobilidade: {assistido.mobilidade}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {assistido.condicoes.map((cond, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-neutral-100 text-neutral-700 text-xs font-semibold"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                          Pressão Arterial
                        </span>
                        <span className="text-sm font-extrabold text-neutral-900">{assistido.pressaoAtual}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">
                          Glicemia Capilar
                        </span>
                        <span className="text-sm font-extrabold text-neutral-900">{assistido.glicemia}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-cyan-50/70 border border-cyan-100">
                        <span className="text-[10px] uppercase font-bold text-cyan-800 block mb-0.5">
                          Cuidador(a)
                        </span>
                        <span className="text-sm font-extrabold text-cyan-900">{assistido.cuidadorAtivo}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-3 mb-6">
                      <Pill className="w-5 h-5 text-amber-600 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="font-bold text-amber-900">Próxima Medicação: </span>
                        <span className="text-amber-800">{assistido.proximoMedicamento}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => setActiveTab("diario")}
                      className="flex-1 py-3 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Ver Diário de Bordo
                    </button>
                    <button
                      onClick={() => setActiveTab("cuidadores")}
                      className="flex-1 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                      Chamar Plantão
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ABA 2: CUIDADORES DISPONÍVEIS */}
        {activeTab === "cuidadores" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/60 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-bold mb-2 border border-cyan-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#02a9b5]" />
                  Verificação Rigorosa & Conformidade LGPD
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                  Cuidadores Profissionais Verificados
                </h1>
                <p className="text-neutral-500 text-sm sm:text-base mt-1">
                  Profissionais treinados em enfermagem geriátrica, primeiros socorros e rotinas de reabilitação.
                </p>
              </div>
            </div>

            <LayoutGroup>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {CUIDADORES_MOCK.map((cuidador) => (
                  <motion.div
                    layoutId={`card-container-${cuidador.id}`}
                    key={cuidador.id}
                    onClick={() => setSelectedCuidadorId(cuidador.id)}
                    transition={APPLE_SPRING_TRANSITION}
                    whileHover={{ y: -6, scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative flex flex-col overflow-hidden rounded-[30px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/90 cursor-pointer justify-between transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
                  >
                    <div>
                      <div className="relative mb-5 h-56 w-full overflow-hidden rounded-[22px] bg-neutral-100">
                        <motion.img
                          layoutId={`card-image-${cuidador.id}`}
                          src={cuidador.foto}
                          alt={cuidador.nome}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
                          {cuidador.valorHora}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {cuidador.antecedentesChecados && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100">
                            <ShieldCheck className="w-3 h-3" />
                            Antecedentes OK
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-100">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {cuidador.avaliacao} ({cuidador.avaliacoesQtd})
                        </span>
                      </div>

                      <motion.h3
                        layoutId={`card-title-${cuidador.id}`}
                        className="text-2xl font-bold text-neutral-900 tracking-tight"
                      >
                        {cuidador.nome}
                      </motion.h3>

                      <motion.p
                        layoutId={`card-specialty-${cuidador.id}`}
                        className="mt-1 text-sm text-neutral-500 font-medium line-clamp-2"
                      >
                        {cuidador.especialidade}
                      </motion.p>
                    </div>

                    <div className="mt-8 pt-4 border-t border-neutral-100 flex w-full items-center justify-between">
                      <span className="text-xs font-bold text-neutral-400 group-hover:text-neutral-900 transition-colors uppercase tracking-wider">
                        Ver Perfil Completo
                      </span>
                      <div className="h-9 w-9 rounded-full bg-neutral-900 flex items-center justify-center text-white text-base transition-transform group-hover:translate-x-1">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {selectedCuidadorId && activeCuidador && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedCuidadorId(null)}
                      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
                    />

                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                      <motion.div
                        layoutId={`card-container-${activeCuidador.id}`}
                        transition={APPLE_SPRING_TRANSITION}
                        className="relative w-full max-w-3xl overflow-hidden rounded-[36px] bg-white p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto"
                      >
                        <button
                          onClick={() => setSelectedCuidadorId(null)}
                          className="absolute right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors focus:outline-none"
                        >
                          <X className="w-5 h-5" />
                        </button>

                        {hiredStatus ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-16 text-center"
                          >
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5">
                              <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-neutral-900">Solicitação Registrada!</h3>
                            <p className="mt-2 text-neutral-500 max-w-md mx-auto">
                              O contrato para {activeCuidador.nome} foi gerado no Supabase com conformidade LGPD e temporalidade restrita.
                            </p>
                          </motion.div>
                        ) : (
                          <>
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                              <div className="h-40 w-40 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-[28px] shadow-sm">
                                <motion.img
                                  layoutId={`card-image-${activeCuidador.id}`}
                                  src={activeCuidador.foto}
                                  alt={activeCuidador.nome}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Antecedentes Criminais OK
                                  </span>
                                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                                    ✓ Diploma & Especialização Verificados
                                  </span>
                                </div>

                                <motion.h2
                                  layoutId={`card-title-${activeCuidador.id}`}
                                  className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900"
                                >
                                  {activeCuidador.nome}
                                </motion.h2>

                                <motion.p
                                  layoutId={`card-specialty-${activeCuidador.id}`}
                                  className="text-base text-neutral-500 font-semibold mt-1"
                                >
                                  {activeCuidador.especialidade} • {activeCuidador.experiencia}
                                </motion.p>

                                <div className="mt-4 flex items-center gap-4 text-sm text-neutral-700">
                                  <div className="flex items-center gap-1 font-bold">
                                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                    {activeCuidador.avaliacao} ({activeCuidador.avaliacoesQtd} avaliações)
                                  </div>
                                  <span className="text-neutral-300">•</span>
                                  <div className="font-bold text-neutral-900 text-base">
                                    {activeCuidador.valorHora}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 15 }}
                              transition={{ delay: 0.1, duration: 0.2 }}
                              className="mt-8 border-t border-neutral-100 pt-6 space-y-6"
                            >
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                                  Biografia e Abordagem Humanizada
                                </h4>
                                <p className="text-neutral-600 leading-relaxed text-base">
                                  {activeCuidador.biografia}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                                  Habilidades & Competências
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {activeCuidador.habilidades.map((habilidade, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-xl bg-neutral-100 text-xs font-medium text-neutral-700">
                                      {habilidade}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-2xl bg-neutral-50 p-4 border border-neutral-100 flex items-center gap-3">
                                <Clock className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                                <div className="text-sm">
                                  <span className="font-semibold text-neutral-900">Disponibilidade: </span>
                                  <span className="text-neutral-600">{activeCuidador.disponibilidade}</span>
                                </div>
                              </div>

                              <div className="mt-8 flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                  onClick={() => handleHire("regular")}
                                  className="flex-1 rounded-2xl bg-neutral-900 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                  <UserCheck className="w-4 h-4" />
                                  Contratar Profissional Regularmente
                                </button>
                                <button
                                  onClick={() => handleHire("plantao")}
                                  className="flex-1 rounded-2xl bg-neutral-100 py-4 text-center text-sm font-semibold text-neutral-700 hover:bg-neutral-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                  <Calendar className="w-4 h-4" />
                                  Agendar Plantão de Urgência
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    </div>
                  </>
                )}
              </AnimatePresence>
            </LayoutGroup>
          </motion.div>
        )}

        {/* ABA 3: DIÁRIO DE BORDO */}
        {activeTab === "diario" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200/60 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold mb-2 border border-amber-200">
                  <FileText className="w-3.5 h-3.5" />
                  Auditoria & Acompanhamento Diário
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
                  Diário de Bordo em Tempo Real
                </h1>
                <p className="text-neutral-500 text-sm sm:text-base mt-1">
                  Atualizações imediatas registradas pelo cuidador com validação de geolocalização e histórico auditável.
                </p>
              </div>
            </div>

            <div className="max-w-3xl space-y-4">
              {DIARIO_LOGS.map((log) => (
                <div
                  key={log.id}
                  className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-100 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex flex-col items-center justify-center flex-shrink-0 text-neutral-800">
                    <Clock className="w-4 h-4 text-[#02a9b5]" />
                    <span className="text-[10px] font-bold mt-0.5">{log.hora}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-neutral-900">{log.titulo}</h4>
                      <span className="text-xs font-semibold text-neutral-400">{log.autor}</span>
                    </div>
                    <p className="text-sm text-neutral-600 leading-relaxed">{log.descricao}</p>
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
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
  );
}
