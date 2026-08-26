"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface AddCaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCaregiverModal({ isOpen, onClose }: AddCaregiverModalProps) {
  const { addCaregiver } = useApp();

  const [nome, setNome] = useState("");
  const [experiencia, setExperiencia] = useState("5 anos de experiência");
  const [valorHora, setValorHora] = useState("40");
  const [especialidade, setEspecialidade] = useState("Acompanhamento Geriátrico & Rotinas");
  const [habilidadesStr, setHabilidadesStr] = useState("Alzheimer, Mobilidade Reduzida, Administração de Remédios");
  const [disponibilidade, setDisponibilidade] = useState("Plantões Diurnos e Noturnos");
  const [biografia, setBiografia] = useState("Profissional dedicado ao cuidado humanizado de idosos.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setIsSubmitting(true);

    const habilidades = habilidadesStr
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    addCaregiver({
      nome,
      initials: nome.slice(0, 2).toUpperCase(),
      especialidade,
      experiencia,
      avaliacao: 5.0,
      avaliacoesQtd: 1,
      valorHora: Number(valorHora) || 40,
      foto: "https://images.unsplash.com/photo-1594824813591-12cbe53589c5?q=80&w=600&auto=format&fit=crop",
      biografia,
      antecedentesChecados: true,
      formacaoVerificada: true,
      disponibilidade,
      habilidades: habilidades.length ? habilidades : ["Cuidado Geriátrico"],
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-neutral-200"
        >
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#02a9b5]/10 text-[#028490] text-xs font-bold mb-2 border border-[#02a9b5]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Credenciamento de Profissional
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Cadastrar Novo Cuidador
            </h2>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              O profissional será adicionado e homologado para exibição imediata na listagem.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Juliana Mendes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Tempo de Experiência
                </label>
                <input
                  type="text"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  placeholder="Ex: 5 anos de experiência"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Valor da Hora (R$/h) *
                </label>
                <input
                  type="number"
                  required
                  value={valorHora}
                  onChange={(e) => setValorHora(e.target.value)}
                  placeholder="Ex: 40"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Especialidade Técnica
              </label>
              <input
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Ex: Especialista em Alzheimer & Pós-Operatório"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Habilidades & Competências (separadas por vírgula)
              </label>
              <input
                type="text"
                value={habilidadesStr}
                onChange={(e) => setHabilidadesStr(e.target.value)}
                placeholder="Ex: Alzheimer, Parkinson, Curativos, Dieta Pastosa"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#02a9b5] hover:bg-[#028490] py-3.5 text-center text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <UserPlus className="w-4 h-4" />
                Cadastrar e Homologar Profissional
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
