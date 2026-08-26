"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { CheckCircle2, ShieldCheck, Award, Heart, Star, Clock, Calendar, ChevronRight, X, Phone, UserCheck } from "lucide-react";

// Interface TypeScript definindo os dados do cuidador
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

// Mock de dados simulando resposta ultrarrápida do Supabase Realtime
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
    disponibilidade: "Imediata (Plantões Diurnos e Noturnos)",
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

// Configuração das físicas de mola padrão Apple (Spring Animation Rig)
const APPLE_SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 280,
  damping: 28,
  mass: 0.8
};

export default function AntigravityCaregiversDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hiredStatus, setHiredStatus] = useState<string | null>(null);
  const activeCuidador = CUIDADORES_MOCK.find(c => c.id === selectedId);

  const handleHire = (type: string) => {
    setHiredStatus(type);
    setTimeout(() => {
      setHiredStatus(null);
      setSelectedId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] px-4 sm:px-6 py-10 sm:py-16 font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header no Estilo Apple */}
        <header className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-neutral-200/60 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold uppercase tracking-widest text-neutral-600 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Sistema Antigravity • Cuidado & Segurança
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
              Cuidadores Verificados
            </h1>
            <p className="mt-2.5 text-neutral-500 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Profissionais validados com rigorosa checagem de antecedentes e conformidade LGPD para acolher sua família com respeito e excelência.
            </p>
          </div>
          <div className="flex items-center gap-3 self-center sm:self-auto bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-neutral-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-neutral-700">Supabase Realtime Ativo</span>
          </div>
        </header>

        {/* LayoutGroup garante sincronização perfeita do layout dinâmico dos componentes */}
        <LayoutGroup>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {CUIDADORES_MOCK.map((cuidador) => (
              <motion.div
                layoutId={`card-container-${cuidador.id}`}
                key={cuidador.id}
                onClick={() => setSelectedId(cuidador.id)}
                transition={APPLE_SPRING_TRANSITION}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.97 }} // Efeito háptico visual nativo de afundamento Apple
                className="group relative flex flex-col overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-neutral-100/80 cursor-pointer justify-between transition-shadow hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
              >
                <div>
                  <div className="relative mb-5 h-56 w-full overflow-hidden rounded-[20px] bg-neutral-100">
                    <motion.img
                      layoutId={`card-image-${cuidador.id}`}
                      src={cuidador.foto}
                      alt={cuidador.nome}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neutral-800 shadow-sm">
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

          {/* Renderização em Overlay da Visualização Expandida com Shared Layout Animation */}
          <AnimatePresence>
            {selectedId && activeCuidador && (
              <>
                {/* Backdrop escurecido para isolamento focal de fundo */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedId(null)}
                  className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md"
                />

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                  <motion.div
                    layoutId={`card-container-${activeCuidador.id}`}
                    transition={APPLE_SPRING_TRANSITION}
                    className="relative w-full max-w-3xl overflow-hidden rounded-[36px] bg-white p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.2)] max-h-[90vh] overflow-y-auto"
                  >
                    {/* Botão de Fechar no Padrão iOS */}
                    <button
                      onClick={() => setSelectedId(null)}
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
                        <h3 className="text-2xl font-bold text-neutral-900">Solicitação Enviada com Sucesso!</h3>
                        <p className="mt-2 text-neutral-500 max-w-md mx-auto">
                          O contrato para {activeCuidador.nome} foi gerado no sistema com conformidade LGPD e temporalidade restrita.
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
                                <Award className="w-3.5 h-3.5" />
                                Diploma & Especialização Verificados
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
                              onClick={() => handleHire('regular')}
                              className="flex-1 rounded-2xl bg-neutral-900 py-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                              <UserCheck className="w-4 h-4" />
                              Contratar Profissional Regularmente
                            </button>
                            <button 
                              onClick={() => handleHire('plantao')}
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
      </div>
    </div>
  );
}
