"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HeartHandshake, ShieldCheck, Calendar, Clock, ArrowRight } from "lucide-react";
import { useApp, Caregiver } from "@/context/AppContext";

interface HireModalProps {
  caregiver: Caregiver | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HireModal({ caregiver, isOpen, onClose }: HireModalProps) {
  const { sendContractProposal } = useApp();

  const [patientName, setPatientName] = useState("Dona Helena Ribeiro de Castro");
  const [patientAge, setPatientAge] = useState("78");
  const [patientAddress, setPatientAddress] = useState("Rua Oscar Freire, 1420 - Jardins, São Paulo");
  const [frequency, setFrequency] = useState("Plantão 12h (Diurno)");
  const [careNeeds, setCareNeeds] = useState("Acompanhamento de rotina, aferição de pressão 2x/dia e auxílio com alimentação.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !caregiver) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    sendContractProposal({
      caregiverId: caregiver.id,
      caregiverName: caregiver.nome,
      patientName,
      patientAge: Number(patientAge) || 75,
      patientAddress,
      careNeeds,
      frequency,
      hourlyRate: caregiver.valorHora,
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
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold mb-2 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Proposta de Vínculo Seguro LGPD
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Contratar {caregiver.nome}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Valor acordado: <strong>R$ {caregiver.valorHora}/hora</strong> • Antecedentes checados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Nome do Familiar Assistido *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ex: Dona Helena (Mãe)"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                  Idade do Assistido
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Ex: 78"
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                  Frequência Desejada
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium outline-none focus:border-[#72b63f] shadow-sm"
                >
                  <option value="Plantão 12h (Diurno)">Plantão 12h (Diurno)</option>
                  <option value="Plantão 12h (Noturno)">Plantão 12h (Noturno)</option>
                  <option value="Diária Fixa (Seg a Sex)">Diária Fixa (Seg a Sex)</option>
                  <option value="Plantão 24h (Final de Semana)">Plantão 24h (Final de Semana)</option>
                  <option value="Acompanhamento Pontual">Acompanhamento Pontual</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Endereço do Local de Cuidado
              </label>
              <input
                type="text"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Necessidades Especiais & Rotinas
              </label>
              <textarea
                rows={2}
                value={careNeeds}
                onChange={(e) => setCareNeeds(e.target.value)}
                placeholder="Conte brevemente sobre as rotinas, medicações e cuidados diários..."
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f] shadow-sm"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-[#72b63f] via-[#02a9b5] to-[#0891b2] py-4 text-center text-sm font-extrabold text-white shadow-lg shadow-[#02a9b5]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <HeartHandshake className="w-5 h-5" />
                Enviar Proposta de Vínculo
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
