import React from 'react';
import { KeychainModelType, HardwareFinish } from '../types/store';

interface KeychainArtworkProps {
  modelType: KeychainModelType;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  kitNumber: string;
  engravingText?: string;
  finish?: HardwareFinish;
  viewMode?: 'front' | 'back' | 'exploded';
  className?: string;
  interactiveTilt?: { x: number; y: number };
}

export const KeychainArtwork: React.FC<KeychainArtworkProps> = ({
  modelType,
  primaryColor,
  secondaryColor,
  accentColor,
  kitNumber,
  engravingText = 'BKEYCHAINS',
  finish = '18K Brushed Gold',
  viewMode = 'front',
  className = 'w-full h-full',
  interactiveTilt = { x: 0, y: 0 },
}) => {
  const uid = React.useId().replace(/:/g, '');

  const metalPalette =
    finish === '18K Brushed Gold'
      ? { stop1: '#FEF08A', stop2: '#D97706', stop3: '#78350F', rim: '#FDE047' }
      : finish === 'Anodized Gunmetal'
      ? { stop1: '#94A3B8', stop2: '#334155', stop3: '#0F172A', rim: '#CBD5E1' }
      : { stop1: '#F8FAFC', stop2: '#94A3B8', stop3: '#334155', rim: '#FFFFFF' };

  const explodeOffset = viewMode === 'exploded' ? 16 : 0;

  return (
    <div
      className={`relative select-none flex items-center justify-center overflow-hidden ${className}`}
      style={{
        transform: `perspective(800px) rotateX(${interactiveTilt.y}deg) rotateY(${interactiveTilt.x}deg)`,
        transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full max-w-[300px] max-h-[300px] drop-shadow-[0_22px_28px_rgba(0,0,0,0.75)]"
        role="img"
        aria-label={`${modelType} metallic football keychain`}
      >
        <defs>
          <linearGradient id={`metal-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={metalPalette.stop1} />
            <stop offset="50%" stopColor={metalPalette.stop2} />
            <stop offset="100%" stopColor={metalPalette.stop3} />
          </linearGradient>

          <linearGradient id={`enamel1-${uid}`} x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={primaryColor} stopOpacity="0.82" />
          </linearGradient>

          <linearGradient id={`enamel2-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="100%" stopColor={secondaryColor} stopOpacity="0.88" />
          </linearGradient>

          <linearGradient id={`sheen-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>

          <radialGradient id={`glow-${uid}`} cx="50%" cy="48%" r="50%">
            <stop offset="0%" stopColor={primaryColor} stopOpacity="0.28" />
            <stop offset="100%" stopColor="#09090B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Studio Rim Ambient Glow */}
        <circle cx="160" cy="170" r="128" fill={`url(#glow-${uid})`} />

        {/* TOP HARDWARE: Hexagonal Carabiner & Split Ring */}
        <g transform={`translate(0, ${-explodeOffset})`}>
          {/* Woven Ballistic Wrist Tag */}
          <path
            d="M142 12 L178 12 L182 48 L138 48 Z"
            fill="#18181B"
            stroke={metalPalette.stop2}
            strokeWidth="1.5"
          />
          <line x1="146" y1="24" x2="174" y2="24" stroke={accentColor} strokeWidth="2" />
          <text
            x="160"
            y="38"
            textAnchor="middle"
            fill="#E4E4E7"
            fontSize="6.5"
            fontWeight="700"
            letterSpacing="1.5"
          >
            BKEYCHAINS
          </text>

          {/* Heavy Split Ring */}
          <circle
            cx="160"
            cy="68"
            r="22"
            fill="none"
            stroke={`url(#metal-${uid})`}
            strokeWidth="7"
          />
          <circle
            cx="160"
            cy="68"
            r="19"
            fill="none"
            stroke={metalPalette.rim}
            strokeWidth="0.8"
            strokeOpacity="0.6"
          />

          {/* Chain Link Bridge */}
          <rect
            x="153"
            y="84"
            width="14"
            height="24"
            rx="6"
            fill={`url(#metal-${uid})`}
            stroke={metalPalette.stop3}
            strokeWidth="1.5"
          />
        </g>

        {/* Exploded Callout Lines when in Exploded Hardware mode */}
        {viewMode === 'exploded' && (
          <g stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" opacity="0.85">
            <line x1="65" y1="68" x2="132" y2="68" />
            <text x="20" y="65" fill="#FBBF24" fontSize="8" fontWeight="600">
              CNC SPLIT RING
            </text>
            <line x1="215" y1="190" x2="265" y2="190" />
            <text x="225" y="184" fill="#FBBF24" fontSize="8" fontWeight="600">
              316L ZINC CORE
            </text>
          </g>
        )}

        {/* MAIN KEYCHAIN PENDANT BODY */}
        <g transform={`translate(0, ${explodeOffset * 0.6})`}>
          {modelType === '3D Kit Jersey' && (
            <g>
              {/* Outer Metallic Jersey Frame */}
              <path
                d="M118 112 L140 106 L160 118 L180 106 L202 112 L234 142 L214 168 L198 156 L198 258 C198 264 193 268 187 268 L133 268 C127 268 122 264 122 258 L122 156 L106 168 L86 142 Z"
                fill={`url(#metal-${uid})`}
                stroke={metalPalette.rim}
                strokeWidth="2"
              />
              {/* Inner Hard Enamel Fill */}
              <path
                d="M122 117 L141 112 L160 124 L179 112 L198 117 L225 143 L211 161 L193 148 L193 254 L127 254 L127 148 L109 161 L95 143 Z"
                fill={viewMode === 'back' ? `url(#metal-${uid})` : `url(#enamel1-${uid})`}
              />
              {viewMode !== 'back' ? (
                <>
                  {/* Center Vertical Stripe / Panel */}
                  <rect
                    x="146"
                    y="122"
                    width="28"
                    height="132"
                    fill={`url(#enamel2-${uid})`}
                    opacity="0.92"
                  />
                  {/* Gold Trim Collar & Sleeve Cuffs */}
                  <path
                    d="M140 112 L160 126 L180 112"
                    fill="none"
                    stroke={accentColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Chest Mini Crest */}
                  <circle
                    cx="177"
                    cy="152"
                    r="8"
                    fill={accentColor}
                    stroke={`url(#metal-${uid})`}
                    strokeWidth="2"
                  />
                  {/* Recessed Squad Number */}
                  <text
                    x="160"
                    y="214"
                    textAnchor="middle"
                    fill={accentColor}
                    stroke="#09090B"
                    strokeWidth="1.5"
                    fontSize="46"
                    fontWeight="800"
                    fontFamily="Barlow Condensed, sans-serif"
                  >
                    {kitNumber}
                  </text>
                </>
              ) : (
                /* Back Plate Laser Engraving View */
                <g>
                  <rect
                    x="133"
                    y="138"
                    width="54"
                    height="100"
                    rx="4"
                    fill="#18181B"
                    fillOpacity="0.35"
                    stroke={metalPalette.rim}
                    strokeWidth="1"
                  />
                  <text
                    x="160"
                    y="168"
                    textAnchor="middle"
                    fill="#FAFAFA"
                    fontSize="11"
                    fontWeight="700"
                    letterSpacing="1.5"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {engravingText.slice(0, 14).toUpperCase()}
                  </text>
                  <text
                    x="160"
                    y="206"
                    textAnchor="middle"
                    fill={metalPalette.rim}
                    fontSize="28"
                    fontWeight="700"
                    fontFamily="Barlow Condensed, sans-serif"
                  >
                    #{kitNumber}
                  </text>
                  <text
                    x="160"
                    y="228"
                    textAnchor="middle"
                    fill="#E4E4E7"
                    fontSize="6.5"
                    letterSpacing="1.2"
                  >
                    316L ZINC · 68G
                  </text>
                </g>
              )}
              {/* Specular Gloss Overlay */}
              <path
                d="M122 117 L141 112 L160 124 L179 112 L198 117 L225 143 L211 161 L193 148 L193 254 L127 254 Z"
                fill={`url(#sheen-${uid})`}
                pointerEvents="none"
              />
            </g>
          )}

          {modelType === 'Club Shield' && (
            <g>
              {/* Outer Shield Casting */}
              <path
                d="M160 104 L222 124 L216 202 C212 238 188 262 160 274 C132 262 108 238 104 202 L98 124 Z"
                fill={`url(#metal-${uid})`}
                stroke={metalPalette.rim}
                strokeWidth="2.5"
              />
              {/* Inner Shield Recessed Enamel */}
              <path
                d="M160 114 L212 131 L207 199 C203 230 183 251 160 262 C137 251 117 230 113 199 L108 131 Z"
                fill={viewMode === 'back' ? `url(#metal-${uid})` : `url(#enamel1-${uid})`}
              />
              {viewMode !== 'back' ? (
                <>
                  {/* Vertical Cloisonne Stripes */}
                  <path
                    d="M142 122 L178 122 L178 252 L160 260 L142 252 Z"
                    fill={`url(#enamel2-${uid})`}
                  />
                  {/* Inner Metallic Crest Ring */}
                  <circle
                    cx="160"
                    cy="185"
                    r="36"
                    fill="#09090B"
                    fillOpacity="0.45"
                    stroke={`url(#metal-${uid})`}
                    strokeWidth="4"
                  />
                  {/* Championship Stars */}
                  <text
                    x="160"
                    y="142"
                    textAnchor="middle"
                    fill={accentColor}
                    fontSize="13"
                    letterSpacing="4"
                  >
                    ★★★
                  </text>
                  <text
                    x="160"
                    y="198"
                    textAnchor="middle"
                    fill={accentColor}
                    fontSize="36"
                    fontWeight="800"
                    fontFamily="Barlow Condensed, sans-serif"
                  >
                    {kitNumber}
                  </text>
                </>
              ) : (
                <g>
                  <circle
                    cx="160"
                    cy="186"
                    r="42"
                    fill="#09090B"
                    fillOpacity="0.35"
                    stroke={metalPalette.rim}
                    strokeWidth="1.2"
                  />
                  <text
                    x="160"
                    y="180"
                    textAnchor="middle"
                    fill="#FAFAFA"
                    fontSize="10"
                    fontWeight="700"
                    letterSpacing="1.4"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {engravingText.slice(0, 14).toUpperCase()}
                  </text>
                  <text
                    x="160"
                    y="204"
                    textAnchor="middle"
                    fill={metalPalette.rim}
                    fontSize="18"
                    fontWeight="700"
                  >
                    EDITION #{kitNumber}
                  </text>
                </g>
              )}
            </g>
          )}

          {modelType === 'Striker Boot' && (
            <g>
              {/* Sculpted 3D Striker Cleat Silhouette */}
              <path
                d="M114 122 L156 122 L164 176 L228 198 C238 202 242 214 236 224 L104 224 C96 224 92 215 94 202 L106 146 Z"
                fill={`url(#metal-${uid})`}
                stroke={metalPalette.rim}
                strokeWidth="2.2"
              />
              <path
                d="M118 128 L151 128 L159 180 L224 202 C230 205 232 212 228 218 L104 218 L112 148 Z"
                fill={viewMode === 'back' ? `url(#metal-${uid})` : `url(#enamel1-${uid})`}
              />
              {/* Aerodynamic Speed Stripes */}
              {viewMode !== 'back' ? (
                <>
                  <path
                    d="M120 168 L195 198 L182 214 L112 188 Z"
                    fill={`url(#enamel2-${uid})`}
                  />
                  <text
                    x="136"
                    y="164"
                    fill="#FBBF24"
                    stroke="#09090B"
                    strokeWidth="2.5"
                    paintOrder="stroke"
                    fontSize="24"
                    fontWeight="800"
                    fontFamily="Barlow Condensed, sans-serif"
                  >
                    #{kitNumber}
                  </text>
                </>
              ) : (
                <text
                  x="165"
                  y="204"
                  textAnchor="middle"
                  fill="#FAFAFA"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="1.5"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {engravingText.slice(0, 14).toUpperCase()}
                </text>
              )}
              {/* Metallic Studs on Torsion Soleplate */}
              <rect x="104" y="224" width="130" height="8" rx="3" fill={`url(#metal-${uid})`} />
              <rect x="112" y="232" width="10" height="12" rx="2" fill={accentColor} />
              <rect x="132" y="232" width="10" height="12" rx="2" fill={accentColor} />
              <rect x="188" y="232" width="10" height="12" rx="2" fill={accentColor} />
              <rect x="210" y="232" width="10" height="12" rx="2" fill={accentColor} />
            </g>
          )}

          {modelType === 'Trophy Edition' && (
            <g>
              {/* Twin-Handled European Silverware Cup */}
              <path
                d="M126 116 L194 116 L186 196 C184 214 172 224 160 226 C148 224 136 214 134 196 Z"
                fill={`url(#metal-${uid})`}
                stroke={metalPalette.rim}
                strokeWidth="2"
              />
              {/* Left & Right Curved Trophy Handles */}
              <path
                d="M128 128 C98 128 96 178 132 186"
                fill="none"
                stroke={`url(#metal-${uid})`}
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M192 128 C222 128 224 178 188 186"
                fill="none"
                stroke={`url(#metal-${uid})`}
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Enamel Club Ribbon Band */}
              <rect
                x="133"
                y="146"
                width="54"
                height="34"
                rx="4"
                fill={viewMode === 'back' ? '#18181B' : `url(#enamel1-${uid})`}
                stroke={accentColor}
                strokeWidth="1.5"
              />
              <text
                x="160"
                y="169"
                textAnchor="middle"
                fill={viewMode === 'back' ? '#FAFAFA' : accentColor}
                fontSize={viewMode === 'back' ? '9' : '22'}
                fontWeight="800"
                fontFamily="Barlow Condensed, sans-serif"
              >
                {viewMode === 'back'
                  ? engravingText.slice(0, 12).toUpperCase()
                  : `${kitNumber}X KINGS`}
              </text>
              {/* Trophy Pedestal Base */}
              <path
                d="M146 226 L174 226 L182 256 L138 256 Z"
                fill={`url(#enamel2-${uid})`}
                stroke={`url(#metal-${uid})`}
                strokeWidth="2"
              />
              <rect
                x="130"
                y="256"
                width="60"
                height="12"
                rx="3"
                fill={`url(#metal-${uid})`}
              />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
