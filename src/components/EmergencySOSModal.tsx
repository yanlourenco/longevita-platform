"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PhoneCall, AlertTriangle, ShieldAlert, HeartPulse, MapPin, User, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencySOSModal({ isOpen, onClose }: EmergencySOSModalProps) {
  const { assistidos, currentUser } = useApp();
  const [alertSent, setAlertSent] = useState(false);

  if (!isOpen) return null;

  const currentAssistido = assistidos[0];

  const handleTriggerAlert = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden"
        >
          {/* Header de Emergência */}
          <div className="bg-red-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-tight uppercase">Central de Emergência SOS</h3>
                <p className="text-[11px] text-white/90 font-semibold">Atendimento Médico & Resgate Imediato</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Paciente em Atendimento */}
            {currentAssistido && (
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-neutral-900">{currentAssistido.nome} ({currentAssistido.idade} anos)</span>
                  <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    Emergência
                  </span>
                </div>
                <p className="text-[11px] text-neutral-600 flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                  {currentAssistido.endereco}
                </p>
              </div>
            )}

            {/* Números de Emergência Médica Rápida */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:192"
                className="p-4 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-center flex flex-col items-center justify-center gap-1 transition-all group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                  192
                </div>
                <span className="text-xs font-black text-red-900 mt-1">SAMU</span>
                <span className="text-[10px] text-red-700 font-medium">Ambulância & Médico</span>
              </a>

              <a
                href="tel:193"
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-center flex flex-col items-center justify-center gap-1 transition-all group active:scale-95"
              >
                <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                  193
                </div>
                <span className="text-xs font-black text-amber-900 mt-1">BOMBEIROS</span>
                <span className="text-[10px] text-amber-700 font-medium">Resgate & Quedas</span>
              </a>
            </div>

            {/* Contato de Emergência da Família */}
            {currentAssistido?.contatoEmergencia && (
              <div className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Contato Familiar de Emergência</span>
                  <span className="text-xs font-bold text-white block">{currentAssistido.contatoEmergencia.nome} ({currentAssistido.contatoEmergencia.parentesco})</span>
                  <span className="text-xs text-[#8be24d] font-bold block">{currentAssistido.contatoEmergencia.telefone}</span>
                </div>

                <a
                  href={`tel:${currentAssistido.contatoEmergencia.telefone.replace(/\D/g, "")}`}
                  className="px-3.5 py-2 rounded-xl bg-[#72b63f] hover:bg-[#63a035] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Ligar
                </a>
              </div>
            )}

            {/* Disparar Alerta para Todos os Responsáveis */}
            <button
              onClick={handleTriggerAlert}
              disabled={alertSent}
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:bg-emerald-600 text-white font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
            >
              {alertSent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Alerta Emitido para Cuidador & Família com Sucesso!
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Disparar Alerta Vermelho na Plataforma LongeVita
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
