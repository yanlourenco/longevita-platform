"use client";

import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  clickable?: boolean;
  className?: string;
}

export default function Logo({
  size = "md",
  showTagline = true,
  clickable = true,
  className = "",
}: LogoProps) {
  const iconSize = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }[size];

  const titleSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  }[size];

  const taglineSize = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base",
  }[size];

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SVG Icon */}
      <div className={`relative flex-shrink-0 ${iconSize}`}>
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="logoGreen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84cc16" />
              <stop offset="100%" stopColor="#65a30d" />
            </linearGradient>
            <linearGradient id="logoTeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            <linearGradient id="logoHeart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="logoHand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2b984" />
              <stop offset="100%" stopColor="#c28c52" />
            </linearGradient>
          </defs>

          {/* Left Person (Green) */}
          <circle cx="215" cy="115" r="28" fill="url(#logoGreen)" />
          <path
            d="M 215 150 C 170 150 145 190 145 235 C 145 270 175 300 220 325 C 200 290 195 240 215 200 C 230 170 255 160 255 160 C 240 153 228 150 215 150 Z"
            fill="url(#logoGreen)"
          />

          {/* Right Person (Teal) */}
          <circle cx="285" cy="115" r="28" fill="url(#logoTeal)" />
          <path
            d="M 285 150 C 330 150 355 190 355 235 C 355 270 325 300 280 325 C 300 290 305 240 285 200 C 270 170 245 160 245 160 C 260 153 272 150 285 150 Z"
            fill="url(#logoTeal)"
          />

          {/* Central Heart */}
          <path
            d="M 250 265 C 250 265 210 225 210 195 C 210 175 228 165 242 175 C 250 182 250 186 250 186 C 250 186 250 182 258 175 C 272 165 290 175 290 195 C 290 225 250 265 250 265 Z"
            fill="url(#logoHeart)"
          />

          {/* Supporting Hand */}
          <path
            d="M 150 260 C 165 315 220 360 275 360 C 320 360 365 330 380 290 C 382 284 374 280 370 285 C 355 310 320 338 275 338 C 225 338 180 298 165 252 C 162 245 148 252 150 260 Z"
            fill="url(#logoHand)"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight leading-none ${titleSize}`}>
          <span className="text-[#72b63f]">Longe</span>
          <span className="text-[#02a9b5]">Vita</span>
        </span>
        {showTagline && (
          <span className={`font-medium text-neutral-500 tracking-wide mt-0.5 ${taglineSize}`}>
            Cuidado que conecta
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block transition-transform active:scale-95">
        {content}
      </Link>
    );
  }

  return content;
}
