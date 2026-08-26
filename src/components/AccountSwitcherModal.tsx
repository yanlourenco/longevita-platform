"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  UserCheck,
  Heart,
  Stethoscope,
  ShieldCheck,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, UserProfile } from "@/context/AppContext";

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountSwitcherModal({ isOpen, onClose }: AccountSwitcherModalProps) {
  const { users, currentUser, switchUser, logoutUser } = useApp();
  const router = useRouter();

  if (!isOpen) return null;

  const handleSelectUser = (user: UserProfile) => {
    switchUser(user.id);
    onClose();
    if (user.role === "admin") {
      router.push("/admin");
    }
  };

  const handleLogout = () => {
    logoutUser();
    onClose();
    router.push("/login");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-neutral-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-slate-900 via-neutral-900 to-slate-900 text-white flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#72b63f]/20 text-[#8be24d] text-xs font-bold border border-[#72b63f]/30 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Alternância Dinâmica de Contas
              </div>
              <h3 className="text-xl font-black tracking-tight">Seletor de Perfis de Usuário</h3>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">
                Alterne instantaneamente entre famílias, cuidadores ou ADM para inspecionar vínculos exclusivos.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Lista de Contas */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-1 block mb-2">
              Contas Cadastradas & Disponíveis ({users.length})
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {users.map((user) => {
                const isActive = currentUser.id === user.id;
                const isFamily = user.role === "family";
                const isCaregiver = user.role === "caregiver";

                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3.5 relative interactive-card group ${
                      isActive
                        ? "bg-slate-50 border-[#02a9b5] shadow-md ring-2 ring-[#02a9b5]/20"
                        : "bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200 shadow-sm">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-sm ${
                          isFamily ? "bg-[#72b63f]" : isCaregiver ? "bg-[#02a9b5]" : "bg-neutral-900"
                        }`}
                      >
                        {isFamily ? <Heart className="w-2.5 h-2.5" /> : isCaregiver ? <Stethoscope className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                      </div>
                    </div>

                    {/* Dados */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#028490] transition-colors">
                          {user.name}
                        </h4>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isFamily
                              ? "bg-[#72b63f]/10 text-[#558a2e]"
                              : isCaregiver
                              ? "bg-[#02a9b5]/10 text-[#028490]"
                              : "bg-neutral-900 text-white"
                          }`}
                        >
                          {isFamily ? "Família" : isCaregiver ? "Cuidador" : "ADM"}
                        </span>
                      </div>

                      <p className="text-[11px] text-neutral-500 font-medium line-clamp-2 leading-tight">
                        {user.subtitle || user.email}
                      </p>

                      {isActive ? (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#028490]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#72b63f]" />
                          <span>Conta Atual em Uso</span>
                        </div>
                      ) : (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-neutral-400 group-hover:text-[#028490] transition-colors">
                          <span>Entrar com esta conta</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer com CTAs de Cadastro & Desconexão */}
          <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/cadastro/contratante"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 hover:border-[#72b63f] text-neutral-800 hover:text-[#558a2e] text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#72b63f]" />
                Nova Família
              </Link>

              <Link
                href="/cadastro/cuidador"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 hover:border-[#02a9b5] text-neutral-800 hover:text-[#028490] text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-[#02a9b5]" />
                Novo Cuidador
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Desconectar Sessão
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
