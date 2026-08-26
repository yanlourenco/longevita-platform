"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  HeartHandshake,
  Star,
  Activity,
  X,
  CheckCheck
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    userRole,
    acceptContract,
    rejectContract,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const roleNotifications = notifications.filter(
    (n) => n.targetRole === userRole || n.targetRole === "family"
  );

  const displayedNotifications =
    filter === "unread" ? roleNotifications.filter((n) => !n.read) : roleNotifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão de Sino com Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl bg-white hover:bg-neutral-100 border-2 border-neutral-200 text-neutral-800 transition-all shadow-sm active:scale-95"
        title="Central de Notificações"
      >
        <Bell className="w-5 h-5 text-neutral-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown / Painel de Notificações */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-white p-4 shadow-2xl border-2 border-neutral-200 z-50 overflow-hidden"
          >
            {/* Header do Dropdown */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#72b63f]" />
                <h3 className="text-sm font-extrabold text-neutral-900">Notificações</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-extrabold border border-rose-100">
                    {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="text-[11px] font-bold text-[#02a9b5] hover:text-[#0891b2] flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Marcar lidas
                </button>
              )}
            </div>

            {/* Filtro Rápido */}
            <div className="flex bg-neutral-100 p-1 rounded-xl my-3 text-xs font-extrabold">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  filter === "all" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                Todas ({roleNotifications.length})
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  filter === "unread" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"
                }`}
              >
                Não Lidas ({unreadCount})
              </button>
            </div>

            {/* Lista de Notificações */}
            <div className="max-h-80 overflow-y-auto space-y-2.5 pr-1">
              {displayedNotifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Nenhuma notificação no momento.
                </div>
              ) : (
                displayedNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      !notif.read
                        ? "bg-emerald-50/50 border-emerald-200/80 shadow-sm"
                        : "bg-white border-neutral-200/70 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {notif.type === "solicitacao" && (
                          <div className="w-7 h-7 rounded-xl bg-cyan-100 text-[#02a9b5] flex items-center justify-center flex-shrink-0">
                            <HeartHandshake className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === "resposta_aceita" && (
                          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === "resposta_recusada" && (
                          <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                            <XCircle className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === "plantao_iniciado" && (
                          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                            <Activity className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === "feedback_recebido" && (
                          <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                            <Star className="w-4 h-4" />
                          </div>
                        )}
                        <h4 className="text-xs font-extrabold text-neutral-900">{notif.title}</h4>
                      </div>

                      <span className="text-[10px] font-bold text-neutral-400 flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        {notif.time}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-700 font-medium mt-1.5 leading-relaxed">
                      {notif.message}
                    </p>

                    {/* BOTÕES DE ACEITAR OU RECUSAR (GATILHO DO CUIDADOR) */}
                    {notif.type === "solicitacao" && notif.contractId && (
                      <div className="mt-3 pt-2.5 border-t border-cyan-100 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            acceptContract(notif.contractId!);
                          }}
                          className="flex-1 rounded-xl bg-[#72b63f] hover:bg-[#65a30d] py-2 text-center text-xs font-extrabold text-white transition-all flex items-center justify-center gap-1 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Aceitar Vínculo
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            rejectContract(notif.contractId!);
                          }}
                          className="flex-1 rounded-xl bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 py-2 text-center text-xs font-bold text-neutral-600 transition-all flex items-center justify-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Recusar
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
