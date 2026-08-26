"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HeartHandshake, ShieldCheck, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { useApp, Caregiver } from "@/context/AppContext";

interface HireModalProps {
  caregiver: Caregiver | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessAnimation?: (caregiverId: string) => void;
}

export default function HireModal({ caregiver, isOpen, onClose, onSuccessAnimation }: HireModalProps) {
  const { sendContractProposal, assistidos } = useApp();

  const [selectedAssistidoId, setSelectedAssistidoId] = useState<string>("ast-1");
  const [patientName, setPatientName] = useState("Dona Helena Ribeiro de Castro");
  const [patientAge, setPatientAge] = useState("78");
  const [patientAddress, setPatientAddress] = useState("Rua Oscar Freire, 1420 - Jardins, São Paulo");
  const [frequency, setFrequency] = useState("Plantão 12h (Diurno)");
  const [careNeeds, setCareNeeds] = useState("Acompanhamento de rotina, aferição de pressão 2x/dia e auxílio com alimentação.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedAssistidoId && selectedAssistidoId !== "custom") {
      const ast = assistidos.find((a) => a.id === selectedAssistidoId);
      if (ast) {
        setPatientName(ast.nome);
        setPatientAge(String(ast.idade));
        setPatientAddress(ast.endereco);
        setCareNeeds(ast.necessidades);
      }
    }
  }, [selectedAssistidoId, assistidos]);

  if (!isOpen || !caregiver) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (onSuccessAnimation) {
      onSuccessAnimation(caregiver.id);
    }

    sendContractProposal({
      caregiverId: caregiver.id,
      caregiverName: caregiver.nome,
      assistidoId: selectedAssistidoId !== "custom" ? selectedAssistidoId : undefined,
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
          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#72b63f]/10 text-[#558a2e] text-xs font-bold mb-2 border border-[#72b63f]/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Formalização de Proposta • LGPD
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Contratar {caregiver.nome}
            </h2>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              Valor da hora: <strong>R$ {caregiver.valorHora}/hora</strong> • Antecedentes e credenciais verificados.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {assistidos.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Selecionar Familiar Cadastrado
                </label>
                <select
                  value={selectedAssistidoId}
                  onChange={(e) => setSelectedAssistidoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-neutral-900 font-bold outline-none focus:border-[#72b63f]"
                >
                  {assistidos.map((ast) => (
                    <option key={ast.id} value={ast.id}>
                      {ast.nome} ({ast.idade} anos - {ast.bairro || "São Paulo"})
                    </option>
                  ))}
                  <option value="custom">+ Outro Assistido (Digitar dados manualmente)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Nome do Familiar Assistido *
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Ex: Dona Helena Ribeiro"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Idade do Assistido
                </label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Ex: 78"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                  Frequência do Cuidado
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium outline-none focus:border-[#72b63f]"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Endereço do Atendimento
              </label>
              <input
                type="text"
                value={patientAddress}
                onChange={(e) => setPatientAddress(e.target.value)}
                placeholder="Rua, Número, Bairro, Cidade"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Plano de Cuidados & Rotinas
              </label>
              <textarea
                rows={2}
                value={careNeeds}
                onChange={(e) => setCareNeeds(e.target.value)}
                placeholder="Descreva as medicações, restrições alimentares e rotinas diárias..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#72b63f]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#72b63f] hover:bg-[#63a035] py-3.5 text-center text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <HeartHandshake className="w-4 h-4" />
                Enviar Proposta de Contratação
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
