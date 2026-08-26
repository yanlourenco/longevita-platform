"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  HeartHandshake,
  Stethoscope,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Send,
  AlertCircle
} from "lucide-react";
import { Assistido, useApp } from "@/context/AppContext";

interface ApplyOpportunityModalProps {
  assistido: Assistido | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplyOpportunityModal({
  assistido,
  isOpen,
  onClose
}: ApplyOpportunityModalProps) {
  const { applyToOpportunity, caregivers, currentUser } = useApp();
  const defaultCgId = currentUser.role === "caregiver" ? (currentUser.caregiverId || currentUser.id) : "cg-2";
  const [selectedCaregiverId, setSelectedCaregiverId] = useState(defaultCgId);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser.role === "caregiver") {
      setSelectedCaregiverId(currentUser.caregiverId || currentUser.id);
    }
  }, [currentUser]);

  if (!isOpen || !assistido) return null;

  const currentCaregiver = caregivers.find((c) => c.id === selectedCaregiverId) || caregivers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCaregiver) return;

    setIsSubmitting(true);
    setTimeout(() => {
      applyToOpportunity(assistido.id, currentCaregiver.id, message);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#02a9b5]/20 text-[#02c5d4] text-[11px] font-bold border border-[#02a9b5]/30 mb-2">
                <HeartHandshake className="w-3 h-3" />
                Candidatura de Atendimento
              </div>
              <h3 className="text-lg font-bold">Propor Assistência à Família</h3>
              <p className="text-xs text-neutral-400">
                Envio formal de disponibilidade e honorários para {assistido.familyName}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Card do Assistido */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 border border-neutral-300">
                <img
                  src={assistido.foto}
                  alt={assistido.nome}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-neutral-900 text-sm truncate">{assistido.nome} ({assistido.idade} anos)</h4>
                <p className="text-neutral-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#72b63f]" />
                  {assistido.endereco}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-bold text-neutral-700">
                    Orçamento: R$ {assistido.orcamentoHora}/h
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-[10px] font-bold text-neutral-700 truncate">
                    {assistido.frequenciaPretendida}
                  </span>
                </div>
              </div>
            </div>

            {/* Perfil do Cuidador Conectado */}
            <div>
              <label className="font-bold text-neutral-800 block mb-1.5 uppercase tracking-wider text-[11px]">
                Perfil do Profissional Proponente
              </label>
              <select
                value={selectedCaregiverId}
                onChange={(e) => setSelectedCaregiverId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-medium focus:border-[#02a9b5] outline-none"
              >
                {caregivers.map((cg) => (
                  <option key={cg.id} value={cg.id}>
                    {cg.nome} — {cg.especialidade} (R$ {cg.valorHora}/h)
                  </option>
                ))}
              </select>
            </div>

            {/* Carta de Apresentação / Mensagem */}
            <div>
              <label className="font-bold text-neutral-800 block mb-1.5 uppercase tracking-wider text-[11px]">
                Apresentação & Disponibilidade na Escala
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Olá! Tenho ampla experiência com esse perfil de cuidado e possuo disponibilidade imediata para início..."
                className="w-full p-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-medium focus:border-[#02a9b5] outline-none resize-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#72b63f]/10 border border-[#72b63f]/20 text-[#406822] text-[11px] font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#72b63f] flex-shrink-0" />
              <span>A proposta será notificada instantaneamente no painel da família com selo de verificação técnica.</span>
            </div>

            {/* Botões */}
            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 font-bold border border-neutral-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#02a9b5] hover:bg-[#028490] text-white font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Transmitindo..." : "Enviar Candidatura"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
