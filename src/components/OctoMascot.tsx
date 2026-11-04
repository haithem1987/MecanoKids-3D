import React from 'react';

interface Props {
  width?: number;
  className?: string;
}

/** Animated octopus mechanic mascot — 8 tentacles, each holding a tool. */
export function OctoMascot({ width = 160, className }: Props) {
  const h = Math.round(width * 1.1);
  return (
    <svg
      viewBox="0 0 200 220"
      width={width}
      height={h}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .octo-body { animation: octoBodyPulse 3s ease-in-out infinite; transform-origin: 100px 95px; }
          .octo-arm { animation: octoArmWave 2.4s ease-in-out infinite; transform-origin: 100px 140px; }
          .octo-arm-1 { animation-delay: 0s; }
          .octo-arm-2 { animation-delay: 0.2s; }
          .octo-arm-3 { animation-delay: 0.4s; }
          .octo-arm-4 { animation-delay: 0.6s; }
          .octo-arm-5 { animation-delay: 0.8s; }
          .octo-arm-6 { animation-delay: 1.0s; }
          .octo-arm-7 { animation-delay: 1.2s; }
          .octo-arm-8 { animation-delay: 1.4s; }
          .octo-blink { animation: octoBlink 4s ease-in-out infinite; transform-origin: 86px 90px; }
          .octo-tool { animation: octoToolSpin 2s ease-in-out infinite alternate; }
          .octo-tool-1 { animation-delay: 0.1s; transform-origin: 32px 155px; }
          .octo-tool-2 { animation-delay: 0.4s; transform-origin: 50px 175px; }
          .octo-tool-3 { animation-delay: 0.7s; transform-origin: 72px 185px; }
          .octo-tool-4 { animation-delay: 0.3s; transform-origin: 92px 188px; }
          .octo-tool-5 { animation-delay: 0.6s; transform-origin: 112px 185px; }
          .octo-tool-6 { animation-delay: 0.2s; transform-origin: 134px 178px; }
          .octo-tool-7 { animation-delay: 0.5s; transform-origin: 152px 165px; }
          .octo-tool-8 { animation-delay: 0.8s; transform-origin: 168px 148px; }
        }
        @keyframes octoBodyPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes octoArmWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(4deg); }
          75% { transform: rotate(-4deg); }
        }
        @keyframes octoBlink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.08); }
        }
        @keyframes octoToolSpin {
          from { transform: rotate(-5deg); }
          to { transform: rotate(5deg); }
        }
      `}</style>

      {/* Tentacles (behind body) */}
      <g opacity="0.9">
        {/* arm 1 — left far */}
        <path className="octo-arm octo-arm-1" d="M68 140 Q40 155 28 170 Q22 180 32 185 Q38 188 42 178 Q48 165 60 158 Q72 150 80 148" fill="none" stroke="#6d28d9" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 2 */}
        <path className="octo-arm octo-arm-2" d="M78 148 Q58 168 48 185 Q44 195 54 196 Q62 196 64 185 Q68 172 80 162 Q88 156 92 152" fill="none" stroke="#7c3aed" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 3 */}
        <path className="octo-arm octo-arm-3" d="M90 152 Q78 175 76 192 Q75 202 85 202 Q93 202 93 192 Q94 178 100 165 Q104 158 106 154" fill="none" stroke="#8b5cf6" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 4 center-left */}
        <path className="octo-arm octo-arm-4" d="M100 154 Q96 177 97 195 Q98 205 108 203 Q115 201 113 191 Q110 177 112 162 Q113 155 114 152" fill="none" stroke="#8b5cf6" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 5 center-right */}
        <path className="octo-arm octo-arm-5" d="M114 152 Q118 175 122 192 Q125 203 134 200 Q141 196 136 186 Q130 174 128 160 Q126 153 122 148" fill="none" stroke="#7c3aed" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 6 */}
        <path className="octo-arm octo-arm-6" d="M122 148 Q136 168 148 182 Q156 191 164 185 Q170 178 162 170 Q152 160 142 150 Q134 142 128 140" fill="none" stroke="#7c3aed" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 7 */}
        <path className="octo-arm octo-arm-7" d="M128 142 Q148 155 162 164 Q172 170 176 162 Q178 154 168 148 Q156 141 144 136 Q136 132 130 134" fill="none" stroke="#6d28d9" strokeWidth="11" strokeLinecap="round"/>
        {/* arm 8 — right far */}
        <path className="octo-arm octo-arm-8" d="M132 134 Q155 138 170 138 Q180 138 180 128 Q180 120 170 122 Q158 124 146 128 Q138 130 134 132" fill="none" stroke="#6d28d9" strokeWidth="11" strokeLinecap="round"/>
      </g>

      {/* Body */}
      <g className="octo-body">
        {/* Head dome */}
        <ellipse cx="100" cy="75" rx="52" ry="48" fill="#7c3aed"/>
        {/* Head highlight */}
        <ellipse cx="84" cy="58" rx="18" ry="12" fill="#a78bfa" opacity="0.5"/>
        {/* Body lower */}
        <ellipse cx="100" cy="120" rx="46" ry="32" fill="#7c3aed"/>
        {/* Mantle */}
        <path d="M54 100 Q54 148 100 148 Q146 148 146 100" fill="#8b5cf6"/>

        {/* Eyes */}
        <circle cx="82" cy="88" r="13" fill="white"/>
        <circle cx="118" cy="88" r="13" fill="white"/>
        <circle cx="85" cy="90" r="8" fill="#1e1b4b"/>
        <circle cx="121" cy="90" r="8" fill="#1e1b4b"/>
        {/* Pupils shine */}
        <circle cx="88" cy="87" r="3" fill="white"/>
        <circle cx="124" cy="87" r="3" fill="white"/>
        {/* Blink overlay (animates scaleY) */}
        <ellipse className="octo-blink" cx="86" cy="90" rx="13" ry="13" fill="#7c3aed"/>

        {/* Smile */}
        <path d="M88 110 Q100 122 112 110" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"/>

        {/* Cheek blush */}
        <ellipse cx="70" cy="100" rx="8" ry="5" fill="#c4b5fd" opacity="0.6"/>
        <ellipse cx="130" cy="100" rx="8" ry="5" fill="#c4b5fd" opacity="0.6"/>
      </g>

      {/* Tools on tentacle tips */}
      {/* 🔧 wrench */}
      <text className="octo-tool octo-tool-1" x="26" y="188" fontSize="16" textAnchor="middle">🔧</text>
      {/* 🪛 screwdriver */}
      <text className="octo-tool octo-tool-2" x="46" y="200" fontSize="14" textAnchor="middle">🪛</text>
      {/* ⚙️ gear */}
      <text className="octo-tool octo-tool-3" x="70" y="208" fontSize="15" textAnchor="middle">⚙️</text>
      {/* 🔨 hammer */}
      <text className="octo-tool octo-tool-4" x="92" y="210" fontSize="14" textAnchor="middle">🔨</text>
      {/* 🔩 bolt */}
      <text className="octo-tool octo-tool-5" x="114" y="208" fontSize="14" textAnchor="middle">🔩</text>
      {/* 🔍 magnifier */}
      <text className="octo-tool octo-tool-6" x="136" y="202" fontSize="14" textAnchor="middle">🔍</text>
      {/* ✏️ pencil */}
      <text className="octo-tool octo-tool-7" x="156" y="190" fontSize="14" textAnchor="middle">✏️</text>
      {/* ⭐ star */}
      <text className="octo-tool octo-tool-8" x="174" y="174" fontSize="14" textAnchor="middle">⭐</text>
    </svg>
  );
}
