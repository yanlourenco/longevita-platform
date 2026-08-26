"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Heart, CheckCircle2, MessageSquare } from "lucide-react";
import { useApp, Caregiver } from "@/context/AppContext";

interface FeedbackModalProps {
  caregiver: Caregiver | null;
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TAGS = [
  "Especialista em Alzheimer",
  "Muito Pontual",
  "Paciente",
  "Carinhoso(a)",
  "Competência Técnica",
  "Excelente Comunicação",
  "Primeiros Socorros OK",
  "Super Recomendado"
];

export default function FeedbackModal({ caregiver, isOpen, onClose }: FeedbackModalProps) {
  const { addReview } = useApp();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState("Mariana Albuquerque");
  const [authorRelation, setAuthorRelation] = useState("Filha da assistida");
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Muito Pontual", "Carinhoso(a)"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !caregiver) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    addReview(caregiver.id, {
      authorName,
      authorRelation,
      rating,
      comment,
      tags: selectedTags,
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

          <div className="mb-6 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-extrabold mb-2 border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Avaliação de Desempenho
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Avaliar {caregiver.nome}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-medium mt-1">
              Compartilhe sua experiência para guiar outras famílias no ecossistema LongeVita.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seletor de Estrelas Interativo */}
            <div className="text-center py-3 bg-neutral-50 rounded-2xl border-2 border-neutral-200">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-800 mb-2">
                Sua Nota Geral
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="inline-block mt-2 text-xs font-extrabold text-neutral-700">
                {rating === 5 && "⭐ Experiência Excepcional (5/5)"}
                {rating === 4 && "👍 Muito Bom (4/5)"}
                {rating === 3 && "👌 Atendeu às expectativas (3/5)"}
                {rating <= 2 && "⚠️ Precisa de melhorias (1-2/5)"}
              </span>
            </div>

            {/* Tags de Destaque */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-2">
                Destaques do Atendimento
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        isSelected
                          ? "bg-[#02a9b5] text-white shadow-sm"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {isSelected && "✓ "}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comentário */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-900 mb-1.5">
                Seu Depoimento *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Conte sobre a pontualidade, carinho com o assistido e competência técnica..."
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5] shadow-sm"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-gradient-to-r from-[#72b63f] to-[#02a9b5] py-4 text-center text-sm font-extrabold text-white shadow-lg shadow-[#02a9b5]/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <CheckCircle2 className="w-5 h-5" />
                Publicar Avaliação
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
