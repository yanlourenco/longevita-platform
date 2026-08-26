"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, User, CheckCheck, Clock, ShieldCheck, Phone, Stethoscope } from "lucide-react";
import { Caregiver, useApp } from "@/context/AppContext";

interface QuickChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  caregiver: Caregiver | null;
}

interface ChatMessage {
  id: string;
  sender: "user" | "caregiver";
  text: string;
  time: string;
}

export default function QuickChatModal({
  isOpen,
  onClose,
  caregiver,
}: QuickChatModalProps) {
  const { currentUser } = useApp();
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "caregiver",
      text: "Olá! Sou profissional homologado pela LongeVita. Como posso ajudar com os cuidados da sua família hoje?",
      time: "Agora",
    },
  ]);

  if (!isOpen || !caregiver) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputMessage.trim(),
      time: "Agora",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    // Resposta contextual simulada do cuidador
    setTimeout(() => {
      const caregiverResponse: ChatMessage = {
        id: `msg-resp-${Date.now()}`,
        sender: "caregiver",
        text: `Obrigado pelo contato, ${currentUser?.name || "Familiar"}! Tenho total disponibilidade para essa rotina e experiência comprovada em ${caregiver.especialidade}. Se desejar, você pode me enviar uma proposta direta de contratação pelo botão "Contratar" do card.`,
        time: "Agora",
      };
      setMessages((prev) => [...prev, caregiverResponse]);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col h-[560px]"
        >
          {/* Header do Chat */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700">
                  <img
                    src={caregiver.foto}
                    alt={caregiver.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">{caregiver.nome}</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#38d7e5]" />
                </div>
                <span className="text-[11px] text-neutral-400 font-medium block">
                  {caregiver.especialidade} • Online
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#f8fafc]">
            <div className="text-center my-2">
              <span className="text-[10px] font-bold text-neutral-400 bg-white px-3 py-1 rounded-full border border-neutral-200 shadow-2xs">
                Canal Seguro Criptografado LongeVita
              </span>
            </div>

            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1 border border-neutral-300">
                      <img src={caregiver.foto} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${
                      isUser
                        ? "bg-[#028490] text-white rounded-br-xs"
                        : "bg-white text-neutral-800 border border-neutral-200/90 rounded-bl-xs"
                    }`}
                  >
                    <p>{m.text}</p>
                    <div
                      className={`mt-1 flex items-center justify-end gap-1 text-[9px] ${
                        isUser ? "text-white/70" : "text-neutral-400"
                      }`}
                    >
                      <span>{m.time}</span>
                      {isUser && <CheckCheck className="w-3 h-3 text-[#8be24d]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sugestões Rápidas */}
          <div className="px-4 py-2 bg-white border-t border-neutral-100 flex gap-1.5 overflow-x-auto">
            <button
              onClick={() => setInputMessage("Você tem disponibilidade para início imediato?")}
              className="text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors"
            >
              Início imediato?
            </button>
            <button
              onClick={() => setInputMessage("Qual é a sua experiência com medicação e sinais vitais?")}
              className="text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors"
            >
              Medicação & Sinais
            </button>
            <button
              onClick={() => setInputMessage("Gostaria de agendar plantões aos finais de semana.")}
              className="text-[10px] font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors"
            >
              Finais de Semana
            </button>
          </div>

          {/* Input de Envio */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Digite sua dúvida ou mensagem para o cuidador..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-medium focus:outline-none focus:border-[#028490] focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl bg-[#028490] hover:bg-[#026c76] disabled:opacity-40 text-white transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
