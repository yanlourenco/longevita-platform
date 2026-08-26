"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DominoFall from "@/components/DominoFall";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

interface SplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
  alwaysShow?: boolean;
}

export default function SplashScreen({
  onComplete,
  minDuration = 2600,
  alwaysShow = false,
}: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Se não for alwaysShow, checa se já viu na sessão
    if (!alwaysShow) {
      const shown = typeof window !== "undefined" ? sessionStorage.getItem("longevita_splash_v1") : null;
      if (shown) {
        setIsVisible(false);
        return;
      }
    }

    const taglineTimer = setTimeout(() => {
      setTaglineVisible(true);
    }, 600);

    const exitTimer = setTimeout(() => {
      handleDismiss();
    }, minDuration);

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(exitTimer);
    };
  }, [minDuration, alwaysShow]);

  const handleDismiss = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("longevita_splash_v1", "true");
    }
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 600);
    }
  };

  if (!mounted || !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(14px)",
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#071317] text-white overflow-hidden select-none"
        >
          {/* Luzes Ambientais de Fundo com Gradientes da Marca */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#02a9b5]/25 to-[#72b63f]/25 rounded-full blur-[140px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#028490]/20 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-[#72b63f]/15 rounded-full blur-[90px] pointer-events-none" />

          {/* Container Central */}
          <div className="relative z-10 flex flex-col items-center px-4 max-w-2xl w-full text-center">
            {/* Badge de Segurança Inicial */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold mb-6 border border-white/15 backdrop-blur-md"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#38d7e5]" />
              Plataforma Integrada de Cuidados
            </motion.div>

            {/* Ícone SVG Oficial da LongeVita */}
            <motion.div
              initial={{ scale: 0, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: 0.15,
              }}
              className="w-28 h-28 sm:w-36 sm:h-36 mb-6 drop-shadow-[0_16px_40px_rgba(2,169,181,0.45)] relative"
            >
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <defs>
                  <linearGradient id="splashGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8be24d" />
                    <stop offset="100%" stopColor="#65a30d" />
                  </linearGradient>
                  <linearGradient id="splashTeal" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38d7e5" />
                    <stop offset="100%" stopColor="#0891b2" />
                  </linearGradient>
                  <linearGradient id="splashHeart" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f87171" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                  <linearGradient id="splashHand" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fed7aa" />
                    <stop offset="100%" stopColor="#c28c52" />
                  </linearGradient>
                </defs>

                {/* Pessoa Esquerda (Verde) */}
                <circle cx="215" cy="115" r="28" fill="url(#splashGreen)" />
                <path
                  d="M 215 150 C 170 150 145 190 145 235 C 145 270 175 300 220 325 C 200 290 195 240 215 200 C 230 170 255 160 255 160 C 240 153 228 150 215 150 Z"
                  fill="url(#splashGreen)"
                />

                {/* Pessoa Direita (Ciano/Teal) */}
                <circle cx="285" cy="115" r="28" fill="url(#splashTeal)" />
                <path
                  d="M 285 150 C 330 150 355 190 355 235 C 355 270 325 300 280 325 C 300 290 305 240 285 200 C 270 170 245 160 245 160 C 260 153 272 150 285 150 Z"
                  fill="url(#splashTeal)"
                />

                {/* Coração Central */}
                <path
                  d="M 250 265 C 250 265 210 225 210 195 C 210 175 228 165 242 175 C 250 182 250 186 250 186 C 250 186 250 182 258 175 C 272 165 290 175 290 195 C 290 225 250 265 250 265 Z"
                  fill="url(#splashHeart)"
                />

                {/* Mão de Suporte */}
                <path
                  d="M 150 260 C 165 315 220 360 275 360 C 320 360 365 330 380 290 C 382 284 374 280 370 285 C 355 310 320 338 275 338 C 225 338 180 298 165 252 C 162 245 148 252 150 260 Z"
                  fill="url(#splashHand)"
                />
              </svg>
            </motion.div>

            {/* Animação Domino Fall Oficial com o Nome LongeVita */}
            <div className="w-full flex justify-center items-center py-2 overflow-visible">
              <DominoFall
                text="LongeVita"
                tag="h1"
                color="#FFFFFF"
                startRotation={-90}
                startOpacity={0}
                stagger={0.07}
                font={{
                  fontFamily: "var(--font-geist-sans), Inter, sans-serif",
                  fontWeight: 900,
                  fontSize: 72,
                  lineHeight: "1.1em",
                  letterSpacing: "-0.03em",
                  textAlign: "center",
                }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 18,
                  mass: 1,
                }}
              />
            </div>

            {/* Subtítulo / Tagline da Marca */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: taglineVisible ? 1 : 0, y: taglineVisible ? 0 : 15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-3 flex items-center justify-center gap-2"
            >
              <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#02a9b5]" />
              <span className="text-xs sm:text-sm font-bold tracking-widest text-[#38d7e5] uppercase">
                Cuidado que conecta
              </span>
              <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#72b63f]" />
            </motion.div>

            {/* Barra de Progresso Elegante */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: minDuration / 1000, ease: "linear" }}
              className="w-36 sm:w-48 h-1 bg-gradient-to-r from-[#72b63f] via-[#38d7e5] to-[#02a9b5] rounded-full mt-8 origin-left shadow-[0_0_14px_rgba(2,169,181,0.6)]"
            />
          </div>

          {/* Botão Pular / Entrar Direto */}
          <button
            onClick={handleDismiss}
            className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs font-bold transition-all border border-white/15 backdrop-blur-md shadow-sm active:scale-95"
          >
            Entrar direto &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
