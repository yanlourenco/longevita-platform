"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, ArrowRight, CheckCircle2, Star, Users, Lock } from "lucide-react";
import Logo from "@/components/Logo";

export default function CadastroHubPage() {
  return (
    <div className="min-h-screen bg-[#fbfbfd] flex flex-col justify-between selection:bg-[#72b63f] selection:text-white">
      {/* Header */}
      <header className="px-6 py-5 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Logo size="md" />
        <Link
          href="/login"
          className="text-xs sm:text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Já possui conta? <span className="text-[#72b63f] font-bold hover:underline">Fazer Login</span>
        </Link>
      </header>

      {/* Main Hub Selection */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 sm:px-6 flex flex-col justify-center">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            Ecossistema Seguro LongeVita
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Como você deseja começar?
          </h1>
          <p className="mt-2.5 text-neutral-500 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Escolha seu perfil para criarmos uma experiência sob medida para você e sua família.
          </p>
        </div>

        {/* 2 Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Opção 1: Família Contratante */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-[32px] bg-white p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border-2 border-emerald-100 hover:border-[#72b63f] transition-all flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#72b63f]" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 text-[#72b63f] flex items-center justify-center mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#72b63f]">
                Para Filhos, Netos e Familiares
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 mb-3">
                Sou Família Contratante
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                Busco cuidadores certificados, acompanhamento diário com diário de bordo em tempo real e segurança jurídica total.
              </p>

              <div className="space-y-2.5 text-xs text-neutral-600 font-medium mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Cuidadores com antecedentes criminais validados
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Diário de bordo com medicação e sinais vitais
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Contrato digital com proteção LGPD
                </div>
              </div>
            </div>

            <Link
              href="/cadastro/contratante"
              className="w-full rounded-2xl bg-neutral-900 py-4 text-center text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
            >
              Cadastrar como Contratante
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Opção 2: Cuidador Profissional */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-[32px] bg-white p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border-2 border-cyan-100 hover:border-[#02a9b5] transition-all flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-[#02a9b5]" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-cyan-100/70 text-[#02a9b5] flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#02a9b5]">
                Para Enfermeiros e Cuidadores
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 mb-3">
                Sou Cuidador(a) Profissional
              </h2>
              <p className="text-neutral-500 text-sm leading-relaxed mb-6">
                Quero receber oportunidades de plantões perto da minha residência, gerenciar minha agenda e receber pagamentos com garantia.
              </p>

              <div className="space-y-2.5 text-xs text-neutral-600 font-medium mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#02a9b5]" />
                  Acesso a plantões regulares e avulsos
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#02a9b5]" />
                  Registro facilitado de diário de bordo
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#02a9b5]" />
                  Garantia de recebimento pontual
                </div>
              </div>
            </div>

            <Link
              href="/cadastro/cuidador"
              className="w-full rounded-2xl bg-[#02a9b5] py-4 text-center text-sm font-bold text-white shadow-sm hover:bg-[#0891b2] transition-all flex items-center justify-center gap-2"
            >
              Cadastrar como Cuidador
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} LongeVita • Cuidado que conecta. Todos os direitos reservados.
      </footer>
    </div>
  );
}
