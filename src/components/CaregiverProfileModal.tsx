"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Calendar,
  HeartHandshake,
  MessageCircle,
  Calculator,
  CheckCircle2,
  Stethoscope
} from "lucide-react";
import { Caregiver } from "@/context/AppContext";

interface CaregiverProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiver: Caregiver | null;
  onHire: (caregiver: Caregiver) => void;
  onOpenChat: (caregiver: Caregiver) => void;
}

export default function CaregiverProfileModal({
  isOpen,
  onClose,
  caregiver,
  onHire,
  onOpenChat,
}: CaregiverProfileModalProps) {
  // Calculadora de Custo Interativa
  const [calcHoursPerDay, setCalcHoursPerDay] = useState(8);
  const [calcDaysPerWeek, setCalcDaysPerWeek] = useState(5);

  if (!isOpen || !caregiver) return null;

  const weeklyHours = calcHoursPerDay * calcDaysPerWeek;
  const weeklyCost = weeklyHours * caregiver.valorHora;
  const monthlyCost = weeklyCost * 4.33; // Média de semanas no mês

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8"
        >
          {/* Top Banner & Header */}
          <div className="relative bg-gradient-to-r from-[#028490] to-[#02a9b5] px-6 pt-8 pb-16 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Profissional Homologado
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-neutral-900 text-xs font-black shadow-xs">
                <Star className="w-3.5 h-3.5 fill-neutral-900" />
                {caregiver.avaliacao.toFixed(2)} ({caregiver.avaliacoesQtd} avaliações)
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{caregiver.nome}</h2>
            <p className="text-sm font-medium text-white/90 mt-1 max-w-xl">
              {caregiver.especialidade} • {caregiver.experiencia}
            </p>
          </div>

          {/* Avatar Flutuante e Barra de Ações Rápidas */}
          <div className="px-6 sm:px-8 -mt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white p-1.5 shadow-xl border-2 border-white flex-shrink-0">
                <img
                  src={caregiver.foto}
                  alt={caregiver.nome}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="pb-1">
                <div className="text-xs text-neutral-500 font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#02a9b5]" />
                  {caregiver.bairro ? `${caregiver.bairro}, ${caregiver.cidade || "São Paulo"}` : "São Paulo - SP"}
                </div>
                <div className="text-xl sm:text-2xl font-black text-neutral-900 mt-0.5">
                  R$ {caregiver.valorHora} <span className="text-xs text-neutral-500 font-semibold">/ hora</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenChat(caregiver);
                }}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4 text-[#028490]" />
                Conversar
              </button>
              <button
                onClick={() => {
                  onClose();
                  onHire(caregiver);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#028490] hover:bg-[#026c76] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 active:scale-98"
              >
                <HeartHandshake className="w-4 h-4" />
                Contratar Agora
              </button>
            </div>
          </div>

          {/* Conteúdo Principal do Perfil */}
          <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Biografia & Formação */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Sobre o Profissional
              </h3>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80">
                {caregiver.biografia}
              </p>
            </div>

            {/* Formação Acadêmica & Certificações */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-[#028490]" />
                  <h4 className="text-xs font-bold text-neutral-900">Formação Acadêmica</h4>
                </div>
                <p className="text-xs text-neutral-600 font-medium">
                  {caregiver.formacaoAcademica || "Graduação em Enfermagem / Gerontologia"}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Diplomas & Registro Checados
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#028490]" />
                  <h4 className="text-xs font-bold text-neutral-900">Disponibilidade</h4>
                </div>
                <p className="text-xs text-neutral-600 font-medium">
                  {caregiver.disponibilidade}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
                  <Calendar className="w-3.5 h-3.5" />
                  {caregiver.atendimentosConcluidos || 50}+ atendimentos realizados
                </div>
              </div>
            </div>

            {/* Habilidades Clínicas e Cuidados */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                Competências & Cuidados Especiais
              </h3>
              <div className="flex flex-wrap gap-2">
                {(caregiver.habilidades || []).map((hab, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-[#02a9b5]/10 text-[#028490] text-xs font-bold border border-[#02a9b5]/20 flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    {hab}
                  </span>
                ))}
              </div>
            </div>

            {/* Calculadora de Orçamento Estimado */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-neutral-900 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#38d7e5]" />
                  <h3 className="text-sm font-bold">Simulador de Investimento Semanal & Mensal</h3>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/20 text-white">
                  Sem taxas ocultas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-neutral-300 block mb-1 font-medium">
                    Horas de cuidado por dia: <strong>{calcHoursPerDay} horas/dia</strong>
                  </label>
                  <input
                    type="range"
                    min={4}
                    max={24}
                    step={2}
                    value={calcHoursPerDay}
                    onChange={(e) => setCalcHoursPerDay(Number(e.target.value))}
                    className="w-full accent-[#02a9b5] cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-300 block mb-1 font-medium">
                    Dias por semana: <strong>{calcDaysPerWeek} dias/semana</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    step={1}
                    value={calcDaysPerWeek}
                    onChange={(e) => setCalcDaysPerWeek(Number(e.target.value))}
                    className="w-full accent-[#02a9b5] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-neutral-400 block">Total Semanal ({weeklyHours}h/sem):</span>
                  <span className="text-base font-black text-[#8be24d]">
                    R$ {weeklyCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block">Estimativa Mensal (Aprox.):</span>
                  <span className="text-lg font-black text-[#38d7e5]">
                    R$ {monthlyCost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onHire(caregiver);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold shadow-sm transition-all"
                >
                  Contratar com este Plano
                </button>
              </div>
            </div>

            {/* Galeria de Depoimentos e Avaliações de Famílias */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
                  Avaliações & Depoimentos ({caregiver.reviews?.length || 0})
                </h3>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  Média Geral: {caregiver.avaliacao.toFixed(2)}
                </span>
              </div>

              {(!caregiver.reviews || caregiver.reviews.length === 0) ? (
                <div className="p-6 rounded-2xl bg-neutral-50 text-center text-xs text-neutral-500">
                  Nenhum depoimento cadastrado ainda. Seja o primeiro a avaliar este profissional!
                </div>
              ) : (
                <div className="space-y-3">
                  {caregiver.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#02a9b5]/10 text-[#028490] flex items-center justify-center font-bold text-xs">
                            {rev.authorName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-neutral-900 block">
                              {rev.authorName}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium">
                              {rev.authorRelation} • {rev.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(rev.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-700 italic leading-relaxed">
                        "{rev.comment}"
                      </p>

                      {rev.tags && rev.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {rev.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-bold text-neutral-600"
                            >
                              ⭐ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rodapé */}
          <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between gap-4">
            <span className="text-xs text-neutral-500 font-medium">
              Contratação 100% segura com suporte e mediação LongeVita.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-300 transition-colors"
            >
              Fechar Detalhes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
