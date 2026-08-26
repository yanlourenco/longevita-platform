"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShieldCheck, HeartHandshake, Check, Minus } from "lucide-react";
import { Caregiver } from "@/context/AppContext";

interface CaregiverCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregivers: Caregiver[];
  onHire: (caregiver: Caregiver) => void;
  onRemove: (id: string) => void;
}

export default function CaregiverCompareModal({
  isOpen,
  onClose,
  caregivers,
  onHire,
  onRemove,
}: CaregiverCompareModalProps) {
  if (!isOpen || caregivers.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-neutral-800">
            <div>
              <h3 className="text-base font-black tracking-tight">Comparativo Lado a Lado de Cuidadores</h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Compare especialidades, valores/hora, avaliações e certificações para decidir com segurança.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabela de Comparação */}
          <div className="flex-1 overflow-x-auto p-6">
            <div className={`grid gap-4 ${caregivers.length === 1 ? "grid-cols-1" : caregivers.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {caregivers.map((cg) => (
                <div
                  key={cg.id}
                  className="p-5 rounded-2xl bg-neutral-50/80 border border-neutral-200 flex flex-col justify-between relative space-y-4"
                >
                  <button
                    onClick={() => onRemove(cg.id)}
                    className="absolute top-3 right-3 p-1 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-600 transition-colors"
                    title="Remover do comparador"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-neutral-200 flex-shrink-0 shadow-sm">
                        <img src={cg.foto} alt={cg.nome} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 pr-6">
                        <h4 className="text-sm font-bold text-neutral-900 truncate">{cg.nome}</h4>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          {cg.avaliacao.toFixed(2)} ({cg.avaliacoesQtd})
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-neutral-200 text-center">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block">Valor por Hora</span>
                      <span className="text-xl font-black text-neutral-900">R$ {cg.valorHora}</span>
                      <span className="text-[11px] text-neutral-500 font-medium"> / hora</span>
                    </div>

                    <div className="space-y-2 text-xs text-neutral-700">
                      <div>
                        <span className="font-bold text-neutral-900 block text-[11px]">Especialidade Principal:</span>
                        <span className="text-neutral-600">{cg.especialidade}</span>
                      </div>

                      <div>
                        <span className="font-bold text-neutral-900 block text-[11px]">Experiência:</span>
                        <span className="text-neutral-600">{cg.experiencia}</span>
                      </div>

                      <div>
                        <span className="font-bold text-neutral-900 block text-[11px]">Disponibilidade:</span>
                        <span className="text-neutral-600">{cg.disponibilidade}</span>
                      </div>

                      <div>
                        <span className="font-bold text-neutral-900 block text-[11px]">Região / Bairro:</span>
                        <span className="text-neutral-600">{cg.bairro || "São Paulo Capital"}</span>
                      </div>

                      <div>
                        <span className="font-bold text-neutral-900 block text-[11px] mb-1">Principais Habilidades:</span>
                        <div className="flex flex-wrap gap-1">
                          {(cg.habilidades || []).map((h, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white border border-neutral-200 text-[10px] font-bold text-neutral-700">
                              {h}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      onHire(cg);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#028490] hover:bg-[#026c76] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-98"
                  >
                    <HeartHandshake className="w-4 h-4" />
                    Contratar {cg.nome.split(" ")[0]}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
            <span className="text-xs text-neutral-500 font-medium">
              Você pode selecionar até 3 cuidadores para comparar simultaneamente.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
            >
              Fechar Comparador
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
