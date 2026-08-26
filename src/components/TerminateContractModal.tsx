"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertTriangle,
  HeartHandshake,
  ShieldAlert,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { Contract, useApp } from "@/context/AppContext";

interface TerminateContractModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TerminateContractModal({
  contract,
  isOpen,
  onClose
}: TerminateContractModalProps) {
  const { terminateContract } = useApp();
  const [reason, setReason] = useState("conclusao_ciclo");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !contract) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      terminateContract(contract.id, notes || reason);
      setIsSubmitting(false);
      onClose();
    }, 300);
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
          <div className="p-6 bg-rose-50 border-b border-rose-100 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950">Encerrar Vínculo Contratual</h3>
                <p className="text-xs text-rose-700">Desfazer formalização de atendimento</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors border border-rose-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="p-6 space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Assistido:</span>
                <span className="font-bold text-neutral-900">{contract.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Profissional Cuidador:</span>
                <span className="font-bold text-neutral-900">{contract.caregiverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 font-medium">Contratante:</span>
                <span className="font-bold text-neutral-900">{contract.familyName}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 leading-relaxed">
              <RefreshCw className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Sincronização Imediata no Ecossistema</span>
                Ao confirmar o encerramento, o assistido ({contract.patientName}) e o cuidador ({contract.caregiverName}) voltarão instantaneamente a figurar na listagem pública de disponíveis.
              </div>
            </div>

            <div>
              <label className="font-bold text-neutral-800 block mb-1.5 uppercase tracking-wider text-[11px]">
                Motivo do Encerramento
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-medium focus:border-rose-500 outline-none"
              >
                <option value="conclusao_ciclo">Conclusão de ciclo de atendimento / Alta médica</option>
                <option value="ajuste_escala">Necessidade de ajuste na escala ou horários</option>
                <option value="substituicao">Troca de profissional por alinhamento de perfil</option>
                <option value="outro">Outro motivo</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-800 block mb-1.5 uppercase tracking-wider text-[11px]">
                Observações de Fechamento (Opcional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Detalhes adicionais para o registro administrativo..."
                className="w-full p-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 font-medium focus:border-rose-500 outline-none resize-none"
              />
            </div>
          </div>

          {/* Rodapé */}
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? "Encerrando..." : "Confirmar Encerramento"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
