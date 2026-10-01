"use client";

import React from "react";
import { MascotMood } from "@/types/landing.types";

export type MascotScene = "locking-in" | "goals" | "reading" | "reward";

interface GonMascotIllustrationProps {
  scene?: MascotScene;
  mood?: MascotMood;
  className?: string;
  isInteractiveActive?: boolean;
}

/**
 * 100% Code-crafted SVG Vector Mascot Illustration of "Bé Gọn" (Smiski-style companion).
 * Built with pure SVG, smooth gradients, and a curated organic palette:
 * - Sage Green (#34623f, #4a7c59)
 * - Butter Yellow (#fde047, #fef08a)
 * - Warm Terracotta (#c96a52, #d97d64)
 * - Linen / Warm Sand (#fbf9f2, #ede5d5)
 *
 * No external images or raster assets needed.
 */
export const GonMascotIllustration: React.FC<GonMascotIllustrationProps> = ({
  scene = "locking-in",
  mood = "locking-in",
  className = "w-full h-auto max-w-[420px]",
  isInteractiveActive = false,
}) => {
  const isHappy = mood === "cheering" || scene === "reward" || isInteractiveActive;

  return (
    <div className={`relative select-none flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 460 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm transition-transform duration-300"
      >
        <defs>
          {/* Soft background ambient gradient */}
          <radialGradient
            id="ambientBackdrop"
            cx="50%"
            cy="45%"
            r="60%"
            fx="50%"
            fy="45%"
          >
            <stop offset="0%" stopColor="#f7f9f6" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#f3f1e7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ebe6d7" stopOpacity="0.5" />
          </radialGradient>

          {/* Warm Lamp Cone / Focus Glow */}
          <linearGradient id="warmLightBeam" x1="0%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.32" />
            <stop offset="70%" stopColor="#fef08a" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
          </linearGradient>

          {/* Bé Gọn Body Shading (Smooth matte clay) */}
          <radialGradient
            id="mascotClayGrad"
            cx="40%"
            cy="35%"
            r="65%"
            fx="35%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#fbf9f1" />
            <stop offset="85%" stopColor="#ece4d2" />
            <stop offset="100%" stopColor="#ddd2bd" />
          </radialGradient>

          {/* Head Sprout (Sage Green) */}
          <linearGradient id="sproutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#679774" />
            <stop offset="60%" stopColor="#34623f" />
            <stop offset="100%" stopColor="#24442c" />
          </linearGradient>

          {/* Sage Laptop Body */}
          <linearGradient id="laptopBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f7c5a" />
            <stop offset="60%" stopColor="#34623f" />
            <stop offset="100%" stopColor="#25462d" />
          </linearGradient>

          {/* Laptop Screen Glow */}
          <linearGradient id="screenGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ebfbee" />
            <stop offset="100%" stopColor="#d2ebd7" />
          </linearGradient>

          {/* Wooden Desk Gradient */}
          <linearGradient id="deskTopGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1e5d2" />
            <stop offset="60%" stopColor="#e3d3bd" />
            <stop offset="100%" stopColor="#cfbea5" />
          </linearGradient>

          {/* Terracotta Pot Gradient */}
          <linearGradient id="potGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e2846d" />
            <stop offset="70%" stopColor="#c96a52" />
            <stop offset="100%" stopColor="#9e4732" />
          </linearGradient>

          {/* Butter Mug Gradient */}
          <linearGradient id="butterMugGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="70%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>

          {/* Drop Shadows */}
          <filter id="clayShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#2d3748" floodOpacity="0.08" />
          </filter>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Backdrop rounded canvas */}
        <rect
          x="12"
          y="12"
          width="436"
          height="336"
          rx="16"
          fill="url(#ambientBackdrop)"
        />

        {/* Subtle grid dots on background */}
        <g opacity="0.35" fill="#34623f">
          <circle cx="50" cy="50" r="1.5" />
          <circle cx="90" cy="50" r="1.5" />
          <circle cx="130" cy="50" r="1.5" />
          <circle cx="170" cy="50" r="1.5" />
          <circle cx="210" cy="50" r="1.5" />
          <circle cx="250" cy="50" r="1.5" />
          <circle cx="290" cy="50" r="1.5" />
          <circle cx="330" cy="50" r="1.5" />
          <circle cx="370" cy="50" r="1.5" />
          <circle cx="410" cy="50" r="1.5" />

          <circle cx="50" cy="90" r="1.5" />
          <circle cx="90" cy="90" r="1.5" />
          <circle cx="370" cy="90" r="1.5" />
          <circle cx="410" cy="90" r="1.5" />

          <circle cx="50" cy="130" r="1.5" />
          <circle cx="410" cy="130" r="1.5" />
        </g>

        {/* 2. Cozy Minimal Desk Lamp (Top-Left) with warm focus beam */}
        <g id="deskLamp">
          {/* Light cone shining onto desk */}
          <polygon
            points="68,76 34,272 175,272 88,76"
            fill="url(#warmLightBeam)"
          />
          {/* Lamp pole */}
          <path
            d="M52 270 L52 110 C52 75 75 65 92 65"
            stroke="#475569"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Lamp head shade (Sage Green with butter yellow rim) */}
          <path
            d="M92 56 L108 76 L76 76 Z"
            fill="#34623f"
            stroke="#25462d"
            strokeWidth="1.5"
          />
          <ellipse cx="92" cy="76" rx="16" ry="3.5" fill="#fef08a" />
          {/* Lamp base */}
          <ellipse cx="52" cy="272" rx="14" ry="4" fill="#334155" />
        </g>

        {/* 3. Wooden Workspace Desk */}
        <g id="deskStructure" filter="url(#clayShadow)">
          {/* Desk surface */}
          <path
            d="M32 260 L428 260 C433 260 436 264 435 268 L429 278 C428 280 425 282 422 282 L38 282 C35 282 32 280 31 278 L25 268 C24 264 27 260 32 260 Z"
            fill="url(#deskTopGrad)"
            stroke="#bba88d"
            strokeWidth="1.5"
          />
          {/* Desk front edge depth */}
          <path
            d="M31 278 L38 282 L422 282 L429 278 L428 287 L420 291 L40 291 L32 287 Z"
            fill="#bba88d"
          />
          {/* Desk legs */}
          <rect x="52" y="291" width="14" height="42" rx="3" fill="#cfbea5" stroke="#a8967b" strokeWidth="1" />
          <rect x="394" y="291" width="14" height="42" rx="3" fill="#cfbea5" stroke="#a8967b" strokeWidth="1" />
        </g>

        {/* 4. Desk Accessories in harmonious palette */}
        {/* Accessory A: Terracotta Pot with mini succulent (Right side) */}
        <g id="terracottaPot" transform="translate(365, 222)">
          {/* Mini succulent leaves (Sage Green) */}
          <path d="M18 18 C14 8 20 0 24 0 C28 0 34 8 30 18 Z" fill="#4a7c59" />
          <path d="M12 20 C6 14 8 6 14 6 C20 6 22 14 18 20 Z" fill="#5c936d" />
          <path d="M36 20 C42 14 40 6 34 6 C28 6 26 14 30 20 Z" fill="#3f6d4d" />
          {/* Pot Rim */}
          <rect x="8" y="18" width="32" height="6" rx="2" fill="#c96a52" stroke="#9e4732" strokeWidth="1" />
          {/* Pot body */}
          <path d="M11 24 L14 42 C14 44 16 46 19 46 L29 46 C32 46 34 44 34 42 L37 24 Z" fill="url(#potGrad)" stroke="#9e4732" strokeWidth="1" />
        </g>

        {/* Accessory B: Butter Yellow Mug with warm tea/matcha steam (Left side) */}
        <g id="butterMug" transform="translate(108, 230)">
          {/* Rising steam trails */}
          <path
            d="M16 4 C14 -2 18 -6 16 -12"
            stroke="#94a3b8"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M23 2 C21 -4 25 -8 23 -14"
            stroke="#94a3b8"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.4"
          />
          {/* Mug handle */}
          <path
            d="M28 12 C34 12 34 24 28 24"
            stroke="#ca8a04"
            strokeWidth="3"
            fill="none"
          />
          {/* Mug Body */}
          <rect x="8" y="8" width="22" height="24" rx="4" fill="url(#butterMugGrad)" stroke="#ca8a04" strokeWidth="1" />
          {/* Matcha inside */}
          <ellipse cx="19" cy="8" rx="10" ry="3" fill="#4a7c59" />
          {/* Mini heart in latte art */}
          <path d="M18 7 C17.5 6 16.5 6 16.5 7 C16.5 8 19 9.5 19 9.5 C19 9.5 21.5 8 21.5 7 C21.5 6 20.5 6 20 7 Z" fill="#f8fafc" opacity="0.8" />
        </g>

        {/* 5. Bé Gọn Character Sitting Behind Laptop */}
        <g id="beGonMascot">
          {/* Mascot Sitting Shadow on Desk */}
          <ellipse cx="230" cy="265" rx="55" ry="10" fill="#a8967b" opacity="0.3" />

          {/* Mascot Torso / Body (Smooth matte clay) */}
          <path
            d="M194 220 C186 200 196 175 230 175 C264 175 274 200 266 220 L272 262 C272 265 269 268 265 268 L195 268 C191 268 188 265 188 262 Z"
            fill="url(#mascotClayGrad)"
            stroke="#d4c7b2"
            strokeWidth="1.5"
            filter="url(#clayShadow)"
          />

          {/* Mascot Head (Smooth round clay form) */}
          <g filter="url(#clayShadow)">
            <ellipse
              cx="230"
              cy="146"
              rx="44"
              ry="40"
              fill="url(#mascotClayGrad)"
              stroke="#d4c7b2"
              strokeWidth="1.5"
            />

            {/* Soft Terracotta Blush Cheeks */}
            <ellipse cx="204" cy="154" rx="6.5" ry="4" fill="#f29e8e" opacity="0.45" />
            <ellipse cx="256" cy="154" rx="6.5" ry="4" fill="#f29e8e" opacity="0.45" />

            {/* Eyes depending on mood */}
            {isHappy ? (
              // Happy / Cheerful curved eyes
              <g stroke="#1e2d24" strokeWidth="3" strokeLinecap="round" fill="none">
                <path d="M210 144 C212 140 218 140 220 144" />
                <path d="M240 144 C242 140 248 140 250 144" />
              </g>
            ) : (
              // Focused dot eyes looking at screen
              <g fill="#1e2d24">
                <circle cx="215" cy="144" r="3.2" />
                <circle cx="245" cy="144" r="3.2" />
                {/* Specular shine */}
                <circle cx="214" cy="143" r="1.1" fill="#ffffff" />
                <circle cx="244" cy="143" r="1.1" fill="#ffffff" />
              </g>
            )}

            {/* Mouth */}
            {isHappy ? (
              <path
                d="M225 156 C227 160 233 160 235 156"
                stroke="#1e2d24"
                strokeWidth="2.4"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <path
                d="M226 156 Q230 158 234 156"
                stroke="#1e2d24"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Iconic 2-Leaf Sprout on Head (Sage Green) */}
            <g id="headSprout">
              {/* Sprout stem */}
              <path
                d="M230 108 L230 96"
                stroke="#34623f"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              {/* Left Leaf */}
              <path
                d="M230 96 C222 92 216 97 220 102 C225 106 230 98 230 96 Z"
                fill="url(#sproutGrad)"
                stroke="#24442c"
                strokeWidth="1"
              />
              {/* Right Leaf */}
              <path
                d="M230 96 C238 90 246 95 242 101 C237 106 230 98 230 96 Z"
                fill="url(#sproutGrad)"
                stroke="#24442c"
                strokeWidth="1"
              />
            </g>
          </g>

          {/* Mascot Hands Typing / Resting on Laptop */}
          <g id="mascotHands">
            {/* Left Hand */}
            <ellipse
              cx="198"
              cy="236"
              rx="9"
              ry="7"
              fill="url(#mascotClayGrad)"
              stroke="#d4c7b2"
              strokeWidth="1.2"
              transform="rotate(-10 198 236)"
            />
            {/* Right Hand */}
            <ellipse
              cx="262"
              cy="236"
              rx="9"
              ry="7"
              fill="url(#mascotClayGrad)"
              stroke="#d4c7b2"
              strokeWidth="1.2"
              transform="rotate(10 262 236)"
            />
          </g>

          {/* 6. Sage Green Laptop Sitting on Desk (Front View) */}
          <g id="sageLaptop" filter="url(#clayShadow)">
            {/* Screen Lid (Opened facing Bé Gọn, showing back to viewer) */}
            <path
              d="M172 214 L288 214 C292 214 295 217 294 221 L286 264 C285 267 282 270 278 270 L182 270 C178 270 175 267 174 264 L166 221 C165 217 168 214 172 214 Z"
              fill="url(#laptopBodyGrad)"
              stroke="#1f3c25"
              strokeWidth="1.5"
            />
            {/* Laptop Base (keyboard deck resting on desk) */}
            <path
              d="M164 268 L296 268 C300 268 303 271 302 274 L298 278 C297 280 294 281 291 281 L169 281 C166 281 163 280 162 278 L158 274 C157 271 160 268 164 268 Z"
              fill="#2d4d36"
              stroke="#1f3c25"
              strokeWidth="1"
            />
            {/* Minimalist Gọn Emblem on Laptop Lid (Sprout + Glow) */}
            <g transform="translate(230, 240)">
              <circle cx="0" cy="0" r="10" fill="#25462d" />
              <path
                d="M-4 3 C-6 -2 0 -5 0 -5 C0 -5 6 -2 4 3 C2 7 -2 7 -4 3 Z"
                fill="#fef08a"
              />
              <path
                d="M-3 -4 C-6 -8 -1 -10 0 -6"
                stroke="#fef08a"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>

          {/* 7. Scene Specific Overlays: Star sparkles for celebration / reward */}
          {isHappy && (
            <g id="celebrationSparkles" filter="url(#softGlow)">
              {/* Golden Star Sparkle 1 */}
              <path
                d="M320 120 L323 130 L333 133 L323 136 L320 146 L317 136 L307 133 L317 130 Z"
                fill="#facc15"
              />
              {/* Golden Star Sparkle 2 */}
              <path
                d="M136 140 L138 147 L145 149 L138 151 L136 158 L134 151 L127 149 L134 147 Z"
                fill="#facc15"
              />
              {/* Mini Sparkle 3 */}
              <circle cx="340" cy="165" r="2.5" fill="#fef08a" />
              <circle cx="120" cy="175" r="2" fill="#fef08a" />
            </g>
          )}

          {/* 8. Floating Status Badge ("Bé Gọn @Deep Work") */}
          <g id="floatingPill" transform="translate(160, 296)">
            <rect
              x="0"
              y="0"
              width="140"
              height="24"
              rx="12"
              fill="#ffffff"
              stroke="#34623f"
              strokeWidth="1.2"
              filter="url(#clayShadow)"
            />
            {/* Green pulsing dot */}
            <circle cx="14" cy="12" r="3.5" fill="#34623f" />
            <text
              x="26"
              y="15.5"
              fill="#34623f"
              fontSize="9.5"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="0.5"
            >
              {isHappy ? "✨ +50 EXP ĐÃ XONG" : "🌿 BÉ GỌN @DEEP WORK"}
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

interface GonFeatureIllustrationProps {
  featureId: string;
  className?: string;
}

/**
 * 100% Code-crafted SVG Vector Illustrations for the 3 Bento Feature Cards:
 * 1. "focus-time": Bé Gọn with Sage Planner & Butter Yellow Hourglass (Mục tiêu & Khóa giờ)
 * 2. "action-notes": Bé Gọn reading Open Book with Terracotta Pencil & Insight Spark (Ghi chép đúc kết)
 * 3. "gamified-rewards": Bé Gọn in cozy Sage Sweater with Steaming Matcha & Golden Star (Động lực tự thưởng)
 */
export const GonFeatureIllustration: React.FC<GonFeatureIllustrationProps> = ({
  featureId,
  className = "w-full h-36",
}) => {
  if (featureId === "focus-time") {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-border dark:border-white/[0.08] bg-[#fbf9f2] dark:bg-[#121915] p-2 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="ftMascot" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8f5eb" />
              <stop offset="100%" stopColor="#e4dac6" />
            </radialGradient>
            <linearGradient id="ftSage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4f7c5a" />
              <stop offset="100%" stopColor="#2c5236" />
            </linearGradient>
            <linearGradient id="ftHourglass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>
          </defs>

          {/* Desk Surface */}
          <rect x="16" y="105" width="208" height="8" rx="2" fill="#e8dac4" stroke="#cbb89b" strokeWidth="1" />

          {/* Bé Gọn Sitting at Desk */}
          <g transform="translate(68, 25)">
            {/* Body */}
            <path d="M12 55 C6 44 14 36 30 36 C46 36 54 44 48 55 L52 80 L8 80 Z" fill="url(#ftMascot)" stroke="#d2c5b0" strokeWidth="1.2" />
            {/* Head */}
            <ellipse cx="30" cy="24" rx="24" ry="22" fill="url(#ftMascot)" stroke="#d2c5b0" strokeWidth="1.2" />
            {/* Sprout on Head */}
            <path d="M30 2 L30 -5" stroke="#34623f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 -5 C24 -8 20 -4 23 0 C27 4 30 -3 30 -5 Z" fill="#4f7c5a" />
            <path d="M30 -5 C36 -8 40 -4 37 0 C33 4 30 -3 30 -5 Z" fill="#34623f" />
            {/* Cheeks & Eyes */}
            <circle cx="21" cy="24" r="2.2" fill="#1e2d24" />
            <circle cx="39" cy="24" r="2.2" fill="#1e2d24" />
            <ellipse cx="14" cy="28" rx="3.5" ry="2" fill="#f29e8e" opacity="0.4" />
            <ellipse cx="46" cy="28" rx="3.5" ry="2" fill="#f29e8e" opacity="0.4" />
            <path d="M28 29 Q30 31 32 29" stroke="#1e2d24" strokeWidth="1.5" strokeLinecap="round" />
          </g>

          {/* Sage Notebook / Planner */}
          <rect x="52" y="92" width="56" height="15" rx="2" fill="url(#ftSage)" stroke="#1f3c25" strokeWidth="1" />
          <line x1="56" y1="99" x2="102" y2="99" stroke="#eaf2ec" strokeWidth="1.2" strokeDasharray="3 2" />

          {/* Butter Yellow Hourglass (Timebox symbol) */}
          <g transform="translate(150, 52)">
            {/* Top & Bottom wood frames */}
            <rect x="4" y="0" width="28" height="5" rx="1.5" fill="#ca8a04" />
            <rect x="4" y="47" width="28" height="5" rx="1.5" fill="#ca8a04" />
            {/* Glass bulb */}
            <path d="M9 5 C9 22 27 22 27 5 Z" fill="#fefce8" stroke="#ca8a04" strokeWidth="1" opacity="0.8" />
            <path d="M9 47 C9 30 27 30 27 47 Z" fill="#fefce8" stroke="#ca8a04" strokeWidth="1" opacity="0.8" />
            {/* Sand stream & pile */}
            <path d="M12 45 C12 37 24 37 24 45 Z" fill="url(#ftHourglass)" />
            <line x1="18" y1="20" x2="18" y2="38" stroke="#eab308" strokeWidth="1.2" strokeDasharray="2 1" />
          </g>

          {/* Floating Pill Tag */}
          <rect x="18" y="14" width="76" height="18" rx="9" fill="#ffffff" stroke="#34623f" strokeWidth="1" />
          <text x="26" y="26" fill="#34623f" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            ⏳ KHÓA GIỜ 90P
          </text>
        </svg>
      </div>
    );
  }

  if (featureId === "action-notes") {
    return (
      <div className={`relative overflow-hidden rounded-lg border border-border dark:border-white/[0.08] bg-[#fbf9f2] dark:bg-[#121915] p-2 flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <radialGradient id="anMascot" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8f5eb" />
              <stop offset="100%" stopColor="#e4dac6" />
            </radialGradient>
            <linearGradient id="anTerra" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2846d" />
              <stop offset="100%" stopColor="#c96a52" />
            </linearGradient>
          </defs>

          {/* Desk Surface */}
          <rect x="16" y="105" width="208" height="8" rx="2" fill="#e8dac4" stroke="#cbb89b" strokeWidth="1" />

          {/* Bé Gọn Reading Curiosity */}
          <g transform="translate(68, 22)">
            {/* Body */}
            <path d="M12 55 C6 44 14 36 30 36 C46 36 54 44 48 55 L52 82 L8 82 Z" fill="url(#anMascot)" stroke="#d2c5b0" strokeWidth="1.2" />
            {/* Head */}
            <ellipse cx="30" cy="24" rx="24" ry="22" fill="url(#anMascot)" stroke="#d2c5b0" strokeWidth="1.2" />
            {/* Sprout on Head */}
            <path d="M30 2 L30 -5" stroke="#34623f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M30 -5 C24 -8 20 -4 23 0 C27 4 30 -3 30 -5 Z" fill="#4f7c5a" />
            <path d="M30 -5 C36 -8 40 -4 37 0 C33 4 30 -3 30 -5 Z" fill="#34623f" />
            {/* Eyes looking down at book */}
            <circle cx="23" cy="26" r="2.2" fill="#1e2d24" />
            <circle cx="37" cy="26" r="2.2" fill="#1e2d24" />
            <ellipse cx="14" cy="28" rx="3.5" ry="2" fill="#f29e8e" opacity="0.4" />
            <ellipse cx="46" cy="28" rx="3.5" ry="2" fill="#f29e8e" opacity="0.4" />
            <path d="M28 32 Q30 34 32 32" stroke="#1e2d24" strokeWidth="1.4" strokeLinecap="round" />

            {/* Glowing Idea Spark above Sprout */}
            <g transform="translate(30, -18)">
              <circle cx="0" cy="0" r="8" fill="#fef08a" opacity="0.4" />
              <path d="M-3 0 L0 -7 L3 0 L7 3 L0 6 L-3 0 Z" fill="#facc15" />
            </g>
          </g>

          {/* Open Study Book */}
          <g transform="translate(64, 82)">
            <path d="M0 16 C16 10 32 10 36 14 C40 10 56 10 72 16 L68 24 C54 18 40 18 36 21 C32 18 18 18 4 24 Z" fill="#ffffff" stroke="#cbb89b" strokeWidth="1" />
            <line x1="12" y1="17" x2="30" y2="17" stroke="#94a3b8" strokeWidth="1" />
            <line x1="42" y1="17" x2="60" y2="17" stroke="#94a3b8" strokeWidth="1" />
          </g>

          {/* Warm Terracotta Pencil */}
          <g transform="translate(154, 96) rotate(-25)">
            <rect x="0" y="0" width="34" height="5" rx="1" fill="url(#anTerra)" stroke="#9e4732" strokeWidth="0.8" />
            <polygon points="34,0 40,2.5 34,5" fill="#e8dac4" />
            <polygon points="38,1.7 40,2.5 38,3.3" fill="#1e293b" />
          </g>

          {/* Floating Pill Tag */}
          <rect x="18" y="14" width="86" height="18" rx="9" fill="#ffffff" stroke="#c96a52" strokeWidth="1" />
          <text x="26" y="26" fill="#c96a52" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
            🧠 Ý CHÍNH → VIỆC LÀM
          </text>
        </svg>
      </div>
    );
  }

  // gamified-rewards
  return (
    <div className={`relative overflow-hidden rounded-lg border border-border dark:border-white/[0.08] bg-[#fbf9f2] dark:bg-[#121915] p-2 flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <radialGradient id="grMascot" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f8f5eb" />
            <stop offset="100%" stopColor="#e4dac6" />
          </radialGradient>
          <linearGradient id="grSweater" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5c8a66" />
            <stop offset="100%" stopColor="#34623f" />
          </linearGradient>
        </defs>

        {/* Cozy Linen Cushion / Floor */}
        <ellipse cx="120" cy="112" rx="75" ry="12" fill="#ece3d2" stroke="#d5c8b2" strokeWidth="1" />

        {/* Bé Gọn Sitting Happily with Sweater & Matcha Cup */}
        <g transform="translate(88, 24)">
          {/* Head */}
          <ellipse cx="32" cy="24" rx="24" ry="22" fill="url(#grMascot)" stroke="#d2c5b0" strokeWidth="1.2" />
          {/* Sprout on Head */}
          <path d="M32 2 L32 -5" stroke="#34623f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 -5 C26 -8 22 -4 25 0 C29 4 32 -3 32 -5 Z" fill="#4f7c5a" />
          <path d="M32 -5 C38 -8 42 -4 39 0 C35 4 32 -3 32 -5 Z" fill="#34623f" />

          {/* Happy Curved Eyes */}
          <path d="M22 24 C24 20 28 20 30 24" stroke="#1e2d24" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <path d="M34 24 C36 20 40 20 42 24" stroke="#1e2d24" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <ellipse cx="16" cy="28" rx="3.5" ry="2" fill="#f29e8e" opacity="0.45" />
          <ellipse cx="48" cy="28" rx="3.5" ry="2" fill="#f29e8e" opacity="0.45" />
          <path d="M29 30 Q32 33 35 30" stroke="#1e2d24" strokeWidth="1.8" strokeLinecap="round" fill="none" />

          {/* Cozy Sage Green Knitted Sweater */}
          <path d="M14 44 C12 36 52 36 50 44 L54 68 C54 74 10 74 10 68 Z" fill="url(#grSweater)" stroke="#24442c" strokeWidth="1.2" />
          {/* Sweater Collar */}
          <ellipse cx="32" cy="43" rx="14" ry="4" fill="#6a9b75" stroke="#24442c" strokeWidth="1" />

          {/* Holding Ceramic Matcha Cup */}
          <g transform="translate(18, 52)">
            {/* Cup */}
            <path d="M4 4 L7 22 C7 24 9 26 14 26 L14 26 C19 26 21 24 21 22 L24 4 Z" fill="#fffbeb" stroke="#ca8a04" strokeWidth="1" />
            <ellipse cx="14" cy="4" rx="10" ry="3" fill="#4a7c59" />
            <path d="M13 3 C12 2 11 2 11 3 C11 4 14 5.5 14 5.5 C14 5.5 17 4 17 3 C17 2 16 2 15 3 Z" fill="#ffffff" opacity="0.9" />
            {/* Hands wrapped around cup */}
            <ellipse cx="3" cy="14" rx="4" ry="3" fill="url(#grMascot)" stroke="#d2c5b0" strokeWidth="1" />
            <ellipse cx="25" cy="14" rx="4" ry="3" fill="url(#grMascot)" stroke="#d2c5b0" strokeWidth="1" />
            {/* Rising steam */}
            <path d="M12 -3 C10 -7 14 -10 12 -14" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.6" />
            <path d="M17 -5 C15 -9 19 -12 17 -16" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.5" />
          </g>
        </g>

        {/* Shining Golden Star Sparkle on Right */}
        <g transform="translate(170, 40)">
          <polygon points="16,0 20,11 32,13 23,21 26,32 16,26 6,32 9,21 0,13 12,11" fill="#facc15" stroke="#eab308" strokeWidth="1" />
          <circle cx="16" cy="16" r="3" fill="#ffffff" />
        </g>

        {/* Floating Pill Tag */}
        <rect x="18" y="14" width="76" height="18" rx="9" fill="#ffffff" stroke="#eab308" strokeWidth="1" />
        <text x="26" y="26" fill="#ca8a04" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
          ⭐ THƯỞNG MATCHA
        </text>
      </svg>
    </div>
  );
};
