import React, { useState } from 'react';
import { RotateCw, ShoppingBag, Check } from 'lucide-react';
import {
  KeychainModelType,
  HardwareFinish,
  KeychainProduct,
  LeagueId,
} from '../types/store';
import { KeychainArtwork } from './KeychainArtwork';
import { formatRupiah } from '../utils/storeLogic';

interface InteractiveCustomizerProps {
  onAddCustomToBag: (
    product: KeychainProduct,
    finish: HardwareFinish,
    customEngraving: string
  ) => void;
}

interface ClubPreset {
  label: string;
  league: LeagueId;
  primary: string;
  secondary: string;
  accent: string;
}

const CLUB_COLOR_PRESETS: ClubPreset[] = [
  {
    label: 'Manchester Red & Gold',
    league: 'Premier League',
    primary: '#DC2626',
    secondary: '#18181B',
    accent: '#FBBF24',
  },
  {
    label: 'Madrid Royal Blancos',
    league: 'LaLiga',
    primary: '#F8FAFC',
    secondary: '#1E3A8A',
    accent: '#F59E0B',
  },
  {
    label: 'Barcelona Blaugrana',
    league: 'LaLiga',
    primary: '#991B1B',
    secondary: '#1D4ED8',
    accent: '#FBBF24',
  },
  {
    label: 'Milano Nerazzurri',
    league: 'Serie A',
    primary: '#1D4ED8',
    secondary: '#09090B',
    accent: '#FACC15',
  },
  {
    label: 'Paris Midnight Hechter',
    league: 'Ligue 1',
    primary: '#1E293B',
    secondary: '#E11D48',
    accent: '#F8FAFC',
  },
];

const MODEL_TYPES: KeychainModelType[] = [
  '3D Kit Jersey',
  'Club Shield',
  'Striker Boot',
  'Trophy Edition',
];

const FINISH_OPTIONS: HardwareFinish[] = [
  '18K Brushed Gold',
  'Anodized Gunmetal',
  'Mirror Surgical Steel',
];

export const InteractiveCustomizer: React.FC<InteractiveCustomizerProps> = ({
  onAddCustomToBag,
}) => {
  const [selectedModel, setSelectedModel] = useState<KeychainModelType>('3D Kit Jersey');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [selectedFinish, setSelectedFinish] = useState<HardwareFinish>('18K Brushed Gold');
  const [kitNumber, setKitNumber] = useState('10');
  const [engravingText, setEngravingText] = useState('CAPTAIN XI');
  const [viewMode, setViewMode] = useState<'front' | 'back' | 'exploded'>('front');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const preset = CLUB_COLOR_PRESETS[selectedPresetIndex] || CLUB_COLOR_PRESETS[0];
  const customPriceIdr = 159000;

  const handleAddBespokeKeychain = () => {
    const customProduct: KeychainProduct = {
      id: `custom-${selectedModel.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: `Bespoke ${selectedModel} #${kitNumber || '10'} (${preset.label})`,
      clubInspiration: `${preset.label} · Custom Studio Forge`,
      league: preset.league,
      modelType: selectedModel,
      priceIdr: customPriceIdr,
      weightGrams: 70,
      materialSpec: `${selectedFinish} · Custom Laser Engraving`,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
      kitNumber: kitNumber || '10',
      engravingDefault: engravingText || 'BKEYCHAINS',
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      editionTag: 'Custom Studio',
      description: `Custom-configured ${selectedModel} in ${preset.label} enamel with "${engravingText}" laser-etched on the reverse.`,
    };

    onAddCustomToBag(customProduct, selectedFinish, `${engravingText} #${kitNumber}`);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  return (
    <section id="customizer-section" className="py-16 border-b border-zinc-800/80 bg-[#09090B]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
              03. Interactive 3D Model Showcase & Customizer
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
              INSPECT & CONFIGURE YOUR MATCHDAY MODEL
            </h2>
          </div>
          <div className="text-xs text-zinc-400 font-mono-num">
            LIVE CAD PREVIEW · 360° TILT & LASER ENGRAVING
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Interactive Viewport Stage */}
          <div className="lg:col-span-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between min-h-[440px]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-zinc-400 font-mono-num">
                MODEL: {selectedModel.toUpperCase()} · {preset.league.toUpperCase()}
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                {(['front', 'back', 'exploded'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap shrink-0 cursor-pointer ${
                      viewMode === mode
                        ? 'bg-amber-400 text-zinc-950'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mode === 'front'
                      ? 'Front Enamel'
                      : mode === 'back'
                      ? 'Back Engraving'
                      : 'Exploded Spec'}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Keychain Render */}
            <div className="my-auto py-4 flex items-center justify-center">
              <div className="w-64 h-64 sm:w-72 sm:h-72">
                <KeychainArtwork
                  modelType={selectedModel}
                  primaryColor={preset.primary}
                  secondaryColor={preset.secondary}
                  accentColor={preset.accent}
                  kitNumber={kitNumber || '10'}
                  engravingText={engravingText || 'BKEYCHAINS'}
                  finish={selectedFinish}
                  viewMode={viewMode}
                  interactiveTilt={{ x: rotationAngle, y: Math.round(rotationAngle / 3) }}
                />
              </div>
            </div>

            {/* Interactive Angle Slider */}
            <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <RotateCw className="w-4 h-4 text-amber-400 shrink-0" />
                <label htmlFor="angle-slider" className="text-xs text-zinc-300 whitespace-nowrap">
                  Perspective Angle ({rotationAngle}°)
                </label>
                <input
                  id="angle-slider"
                  type="range"
                  min={-25}
                  max={25}
                  value={rotationAngle}
                  onChange={(e) => setRotationAngle(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
              <button
                type="button"
                onClick={() => setRotationAngle(0)}
                className="text-xs text-zinc-400 hover:text-white underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Right Configuration Panel */}
          <div className="lg:col-span-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Step 1: Select Silhouette */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  1. Select Keychain Architecture
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {MODEL_TYPES.map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setSelectedModel(model)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap truncate cursor-pointer ${
                        selectedModel === model
                          ? 'bg-amber-400 text-zinc-950 border-amber-400'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Club Enamel Colorway */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  2. Club Enamel Colorway ({preset.league})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CLUB_COLOR_PRESETS.map((item, idx) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setSelectedPresetIndex(idx)}
                      className={`px-3 py-2 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                        selectedPresetIndex === idx
                          ? 'bg-zinc-800 border-amber-400 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-medium truncate">{item.label}</span>
                      <span className="flex items-center gap-1 shrink-0 ml-2">
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: item.primary }}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: item.secondary }}
                        />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Metal Plating Finish */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  3. Hardware Metal Finish
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {FINISH_OPTIONS.map((fin) => (
                    <button
                      key={fin}
                      type="button"
                      onClick={() => setSelectedFinish(fin)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap truncate cursor-pointer ${
                        selectedFinish === fin
                          ? 'bg-zinc-100 text-zinc-950 border-white'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {fin}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Custom Squad Number & Laser Engraving */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="custom-kit-num" className="block text-xs text-zinc-300 mb-1">
                    Squad Number
                  </label>
                  <input
                    id="custom-kit-num"
                    type="text"
                    maxLength={2}
                    value={kitNumber}
                    onChange={(e) => setKitNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm font-mono-num text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="custom-engraving" className="block text-xs text-zinc-300 mb-1">
                    Reverse Laser Engraving (Max 14 Chars)
                  </label>
                  <input
                    id="custom-engraving"
                    type="text"
                    maxLength={14}
                    value={engravingText}
                    onChange={(e) => {
                      setEngravingText(e.target.value);
                      setViewMode('back');
                    }}
                    placeholder="YOUR NAME / MOTTO"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm font-mono-num text-white uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Add Custom Keychain CTA */}
            <div className="pt-5 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-400">Bespoke Studio Price (Includes Laser Etch)</div>
                <div className="font-mono-num text-2xl font-bold text-white">
                  {formatRupiah(customPriceIdr)}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddBespokeKeychain}
                className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added Custom Model to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Custom Keychain to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
