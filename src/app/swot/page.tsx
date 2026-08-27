"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  AlertCircle,
  Home,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  Heart,
  Zap,
  Lock,
  Clock,
  Smartphone,
  Globe,
  Briefcase
} from "lucide-react";

export default function SWOTPresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = 8;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col justify-between selection:bg-[#02a9b5] selection:text-white font-helvetica relative overflow-hidden">
      {/* Background Ambient Glows with LongeVita Brand Colors */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#72b63f]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#02a9b5]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dynamic Background Wavy Lines Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-15 z-0 overflow-hidden">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonal-waves" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
              <path
                d="M 0 20 Q 30 40 60 20 T 120 20 M 0 60 Q 30 80 60 60 T 120 60 M 0 100 Q 30 120 60 100 T 120 100"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonal-waves)" />
        </svg>
      </div>

      {/* Header Bar */}
      <header className="px-6 py-5 border-b border-white/10 bg-[#070b12]/80 backdrop-blur-md flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center relative">
            <Image src="/logo.svg" alt="LongeVita Logo" width={36} height={36} className="w-full h-full object-contain" />
          </div>
          <div className="font-helvetica font-extrabold tracking-tight text-lg leading-none">
            <span className="text-[#72b63f]">Longe</span>
            <span className="text-[#02a9b5] font-garamond italic font-normal text-xl ml-0.5">Vita</span>
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#72b63f] to-[#02a9b5] text-slate-950 font-helvetica font-bold text-xs flex items-center gap-1.5 hover:brightness-110 transition-all shadow-md shadow-[#02a9b5]/20"
          >
            <Home className="w-3.5 h-3.5" />
            <span>VOLTAR</span>
          </Link>
        </div>
      </header>

      {/* Floating Side Arrow Controls for Quick Navigation */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 disabled:opacity-0 transition-all backdrop-blur-md"
        title="Anterior (Seta Esquerda)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white border border-white/10 disabled:opacity-0 transition-all backdrop-blur-md"
        title="Próximo (Seta Direita / Espaço)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Slide Canvas */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 z-10">
        <div className="w-full max-w-6xl mx-auto">
          {/* SLIDE 0: CAPA */}
          {currentSlide === 0 && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-4 max-w-4xl">
                <div className="inline-block px-3.5 py-1 rounded-full bg-[#02a9b5]/10 border border-[#02a9b5]/30 text-[#02a9b5] text-xs font-helvetica tracking-widest uppercase mb-2">
                  Diagnóstico da Plataforma
                </div>
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-helvetica font-extrabold tracking-tight text-white leading-none">
                  Análise<br />
                  <span className="bg-gradient-to-r from-[#72b63f] via-[#22c55e] to-[#02a9b5] bg-clip-text text-transparent">
                    Estratégica
                  </span>
                </h1>
                <p className="text-2xl sm:text-3xl text-slate-300 font-garamond italic font-light pt-3 flex items-center gap-2">
                  Plataforma: <span className="font-helvetica not-italic font-bold text-[#72b63f]">Longe</span><span className="font-garamond italic font-semibold text-[#02a9b5]">Vita</span>
                </p>
              </div>
            </div>
          )}

          {/* SLIDE 1: PLANO DA APRESENTAÇÃO */}
          {currentSlide === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-in fade-in duration-300">
              <div>
                <h2 className="text-7xl sm:text-8xl md:text-9xl font-helvetica font-extrabold text-white tracking-tight leading-none">
                  Plano
                </h2>
              </div>

              <div className="space-y-6">
                {[
                  { num: "01", text: "FORÇAS", color: "#72b63f" },
                  { num: "02", text: "FRAQUEZAS", color: "#f59e0b" },
                  { num: "03", text: "OPORTUNIDADES", color: "#02a9b5" },
                  { num: "04", text: "AMEAÇAS", color: "#f87171" },
                  { num: "05", text: "ESTRATÉGIAS", color: "#38bdf8" },
                  { num: "06", text: "CONCLUSÃO", color: "#a855f7" }
                ].map((item, index) => (
                  <button
                    key={item.num}
                    onClick={() => setCurrentSlide(index + 2)}
                    className="flex items-center gap-6 text-left group w-full hover:translate-x-2 transition-transform"
                  >
                    <span className="font-helvetica text-4xl sm:text-5xl text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.7)] group-hover:[-webkit-text-stroke:1.5px_#ffffff] font-bold">
                      {item.num}
                    </span>
                    <span className="font-garamond text-2xl sm:text-3xl text-slate-300 group-hover:text-white tracking-wide font-normal flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 2: FORÇAS */}
          {currentSlide === 2 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-xs font-helvetica text-[#72b63f] uppercase tracking-widest font-semibold">01. Análise Interna</span>
                <h2 className="text-5xl sm:text-7xl font-helvetica font-extrabold text-white tracking-tight flex items-center gap-3">
                  Forças <span className="w-3.5 h-3.5 rounded-full bg-[#72b63f]" />
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#72b63f]/20 hover:border-[#72b63f]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#72b63f]/10 border border-[#72b63f]/30 flex items-center justify-center text-[#72b63f]">
                    <Zap className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Socorro de Emergência</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Botão direto para acionar apoio rápido em momentos de crise.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#72b63f]/20 hover:border-[#72b63f]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#72b63f]/10 border border-[#72b63f]/30 flex items-center justify-center text-[#72b63f]">
                    <Search className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Comparação Clara</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Escolha de cuidadores por perfil, histórico e avaliações reais.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#72b63f]/20 hover:border-[#72b63f]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#72b63f]/10 border border-[#72b63f]/30 flex items-center justify-center text-[#72b63f]">
                    <Heart className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Foco Exclusivo</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Plataforma feita 100% para o cuidado e bem-estar do idoso.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#72b63f]/20 hover:border-[#72b63f]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#72b63f]/10 border border-[#72b63f]/30 flex items-center justify-center text-[#72b63f]">
                    <Clock className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Atendimento Rápido</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Conexão direta entre famílias e cuidadores disponíveis.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: FRAQUEZAS */}
          {currentSlide === 3 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-xs font-helvetica text-amber-400 uppercase tracking-widest font-semibold">02. Análise Interna</span>
                <h2 className="text-5xl sm:text-7xl font-helvetica font-extrabold text-white tracking-tight flex items-center gap-3">
                  Fraquezas <span className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-amber-500/20 hover:border-amber-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Users className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Base Inicial</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Necessidade de atrair cuidadores e famílias ao mesmo tempo.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-amber-500/20 hover:border-amber-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Lock className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Custo de Checagem</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Verificação rigorosa de antecedentes exige tempo e investimento.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-amber-500/20 hover:border-amber-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Smartphone className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Uso por Idosos</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Dificuldade com tecnologia exige gestão pelos familiares.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-amber-500/20 hover:border-amber-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Clock className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Suporte Contínuo</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    O sistema de emergência exige operação 24 horas sem falhas.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 4: OPORTUNIDADES */}
          {currentSlide === 4 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-xs font-helvetica text-[#02a9b5] uppercase tracking-widest font-semibold">03. Análise Externa</span>
                <h2 className="text-5xl sm:text-7xl font-helvetica font-extrabold text-white tracking-tight flex items-center gap-3">
                  Oportunidades <span className="w-3.5 h-3.5 rounded-full bg-[#02a9b5]" />
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#02a9b5]/20 hover:border-[#02a9b5]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#02a9b5]/10 border border-[#02a9b5]/30 flex items-center justify-center text-[#02a9b5]">
                    <TrendingUp className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Aumento de Idosos</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Crescimento rápido da população idosa no Brasil a cada ano.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#02a9b5]/20 hover:border-[#02a9b5]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#02a9b5]/10 border border-[#02a9b5]/30 flex items-center justify-center text-[#02a9b5]">
                    <Home className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Cuidado em Casa</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Preferência das famílias por manter o idoso no próprio lar.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#02a9b5]/20 hover:border-[#02a9b5]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#02a9b5]/10 border border-[#02a9b5]/30 flex items-center justify-center text-[#02a9b5]">
                    <Briefcase className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Parcerias com Planos</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Acordos com planos de saúde e clínicas para indicação do serviço.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-[#02a9b5]/20 hover:border-[#02a9b5]/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#02a9b5]/10 border border-[#02a9b5]/30 flex items-center justify-center text-[#02a9b5]">
                    <Globe className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Novos Serviços</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Espaço para integrar telemedicina e entrega de medicamentos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: AMEAÇAS */}
          {currentSlide === 5 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-xs font-helvetica text-rose-400 uppercase tracking-widest font-semibold">04. Análise Externa</span>
                <h2 className="text-5xl sm:text-7xl font-helvetica font-extrabold text-white tracking-tight flex items-center gap-3">
                  Ameaças <span className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertCircle className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Agências Físicas</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Concorrência de empresas tradicionais já conhecidas no mercado local.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Shield className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Cuidados Jurídicos</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Risco de processos em casos de falha ou conduta de terceiros.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Regras Trabalhistas</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Mudanças nas leis sobre profissionais de saúde autônomos.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/40 border border-rose-500/20 hover:border-rose-500/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Users className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl font-helvetica font-bold text-white">Cenário Econômico</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Famílias cortando gastos ou buscando opções informais.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: ESTRATÉGIAS DE AÇÃO */}
          {currentSlide === 6 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-xs font-helvetica text-[#02a9b5] uppercase tracking-widest font-semibold">05. Plano de Ação</span>
                <h2 className="text-5xl sm:text-7xl font-helvetica font-extrabold text-white tracking-tight">
                  Estratégias
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="p-8 rounded-xl bg-slate-900/60 border border-[#02a9b5]/30 hover:border-[#02a9b5] transition-colors space-y-4">
                  <div className="text-xs font-helvetica font-bold text-[#02a9b5]">01 / PARCERIAS</div>
                  <h3 className="text-2xl font-helvetica font-bold text-white">Acordos com Planos de Saúde</h3>
                  <p className="font-garamond text-lg text-slate-200 leading-relaxed font-normal">
                    Usar o botão de socorro como diferencial para oferecer nosso serviço direto para planos e seguradoras como prevenção de problemas.
                  </p>
                </div>

                <div className="p-8 rounded-xl bg-slate-900/60 border border-[#72b63f]/30 hover:border-[#72b63f] transition-colors space-y-4">
                  <div className="text-xs font-helvetica font-bold text-[#72b63f]">02 / SEGURANÇA</div>
                  <h3 className="text-2xl font-helvetica font-bold text-white">Selo de Certificação</h3>
                  <p className="font-garamond text-lg text-slate-200 leading-relaxed font-normal">
                    Fazer a checagem completa de antecedentes e treinar cuidadores no app, gerando confiança total para as famílias.
                  </p>
                </div>

                <div className="p-8 rounded-xl bg-slate-900/60 border border-sky-500/30 hover:border-sky-500 transition-colors space-y-4">
                  <div className="text-xs font-helvetica font-bold text-sky-400">03 / TECNOLOGIA</div>
                  <h3 className="text-2xl font-helvetica font-bold text-white">Aplicativo em 2 Telas</h3>
                  <p className="font-garamond text-lg text-slate-200 leading-relaxed font-normal">
                    Painel completo para os filhos gerenciarem a contratação e uma tela simples de apenas 1 botão para o uso do idoso.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 7: CONCLUSÃO */}
          {currentSlide === 7 && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-xs font-helvetica text-[#72b63f] uppercase tracking-widest font-semibold">06. Síntese</span>
                <h2 className="text-5xl sm:text-7xl font-helvetica font-extrabold text-white tracking-tight">
                  Conclusão
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                <div className="space-y-4 p-6 rounded-xl bg-slate-900/30 border border-[#72b63f]/20">
                  <div className="font-helvetica text-6xl font-extrabold text-transparent [-webkit-text-stroke:2px_#72b63f]">01</div>
                  <h3 className="text-2xl font-helvetica font-bold text-white">Foco em Segurança</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Garantir funcionamento perfeito do botão de socorro e seleção rigorosa de cuidadores.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/30 border border-[#02a9b5]/20">
                  <div className="font-helvetica text-6xl font-extrabold text-transparent [-webkit-text-stroke:2px_#02a9b5]">02</div>
                  <h3 className="text-2xl font-helvetica font-bold text-white">Crescimento por Parcerias</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Crescer vendendo para planos de saúde e hospitais, reduzindo o custo de aquisição.
                  </p>
                </div>

                <div className="space-y-4 p-6 rounded-xl bg-slate-900/30 border border-sky-500/20">
                  <div className="font-helvetica text-6xl font-extrabold text-transparent [-webkit-text-stroke:2px_#38bdf8]">03</div>
                  <h3 className="text-2xl font-helvetica font-bold text-white">Simplicidade no Uso</h3>
                  <p className="font-garamond text-lg text-slate-300 leading-relaxed font-normal">
                    Tornar a experiência fácil para a família e sem barreiras para o idoso assistido.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
