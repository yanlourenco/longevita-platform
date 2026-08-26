"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Award, CheckCircle2 } from "lucide-react";
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
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black backdrop-blur-sm"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg overflow-hidden rounded-[36px] bg-white p-6 sm:p-8 shadow-2xl border-2 border-neutral-200"
        >
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 text-xs font-extrabold mb-2 border border-cyan-200">
              <Award className="w-3.5 h-3.5 text-[#02a9b5]" />
              Atualização Reativa da Plataforma
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Cadastrar Novo Cuidador
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              O profissional será adicionado e exibido na listagem em tempo real.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Juliana Mendes"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5] shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                  Anos de Experiência
                </label>
                <input
                  type="text"
                  value={experiencia}
                  onChange={(e) => setExperiencia(e.target.value)}
                  placeholder="Ex: 5 anos de experiência"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                  Valor da Hora (R$/h) *
                </label>
                <input
                  type="number"
                  required
                  value={valorHora}
                  onChange={(e) => setValorHora(e.target.value)}
                  placeholder="Ex: 40"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5] shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Especialidade Principal
              </label>
              <input
                type="text"
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value)}
                placeholder="Ex: Especialista em Alzheimer & Pós-Operatório"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Tags / Habilidades (separadas por vírgula)
              </label>
              <input
                type="text"
                value={habilidadesStr}
                onChange={(e) => setHabilidadesStr(e.target.value)}
                placeholder="Ex: Alzheimer, Parkinson, Curativos, Dieta"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5] shadow-sm"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-[#02a9b5] hover:bg-[#0891b2] py-4 text-center text-sm font-extrabold text-white shadow-lg shadow-[#02a9b5]/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <UserPlus className="w-5 h-5" />
                Salvar e Atualizar Listagem Imediatamente
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
