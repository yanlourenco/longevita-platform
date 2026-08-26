"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2 } from "lucide-react";
import { useApp, Caregiver } from "@/context/AppContext";

interface FeedbackModalProps {
  caregiver: Caregiver | null;
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TAGS = [
  "Especialista em Alzheimer",
  "Pontualidade Rigorosa",
  "Paciência & Carinho",
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
  const [selectedTags, setSelectedTags] = useState<string[]>(["Pontualidade Rigorosa", "Paciência & Carinho"]);
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
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              Avaliação de Desempenho
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Avaliar {caregiver.nome}
            </h2>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              Compartilhe sua experiência técnica e humanizada sobre o atendimento prestado.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seletor de Estrelas Interativo */}
            <div className="text-center py-3 bg-neutral-50 rounded-2xl border border-neutral-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 mb-2">
                Nota Geral do Atendimento
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <span className="inline-block mt-2 text-xs font-bold text-neutral-700">
                {rating === 5 && "Excelente (5.0 / 5.0)"}
                {rating === 4 && "Muito Bom (4.0 / 5.0)"}
                {rating === 3 && "Satisfatório (3.0 / 5.0)"}
                {rating <= 2 && "Abaixo do Esperado (1.0 - 2.0 / 5.0)"}
              </span>
            </div>

            {/* Tags de Destaque */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Competências em Destaque
              </label>
              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
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
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1">
                Relato do Atendimento *
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Descreva a pontualidade, comunicação, administração de medicações e zelo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-neutral-900 font-medium placeholder:text-neutral-500 outline-none focus:border-[#02a9b5]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#02a9b5] hover:bg-[#028490] py-3.5 text-center text-xs font-bold text-white shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                Registrar Avaliação Oficial
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
