import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Layers,
  MessageSquare,
  Compass,
  ArrowUpRight,
  Star,
  Flame,
  Hammer,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Cpu,
} from 'lucide-react';
import { LeagueId, StoreConfig, SupporterReview } from '../types/store';
import { LEAGUE_PROFILES, PREMIUM_MATERIALS } from '../data/initialStoreData';
import { KeychainArtwork } from './KeychainArtwork';

interface InteractiveAboutProps {
  config: StoreConfig;
  reviews: SupporterReview[];
  onAddReview: (review: Omit<SupporterReview, 'id' | 'date'>) => void;
  onShopLeague: (league: LeagueId) => void;
  onBackHome: () => void;
}

interface ForgeStage {
  step: string;
  title: string;
  temp: string;
  precision: string;
  summary: string;
  detail: string;
  viewMode: 'front' | 'back' | 'exploded';
  finish: '18K Brushed Gold' | 'Anodized Gunmetal' | 'Mirror Surgical Steel';
}

const FORGE_STAGES: ForgeStage[] = [
  {
    step: 'STAGE 01',
    title: '3D CAD Micro-Sculpting & CNC Steel Mold',
    temp: '22°C CLEANROOM',
    precision: '±0.02mm Laser Tolerance',
    summary:
      'Every club crest and 3D shirt silhouette is sculpted in parametric CAD and CNC-milled into hardened H13 tool steel molds.',
    detail:
      'Recessed channels of 0.45mm depth are carved to separate each enamel pigment wall so club colors never bleed.',
    viewMode: 'exploded',
    finish: 'Mirror Surgical Steel',
  },
  {
    step: 'STAGE 02',
    title: '420°C Molten 316L Zinc-Alloy High-Pressure Casting',
    temp: '420°C MOLTEN POUR',
    precision: '68g–78g Solid Core',
    summary:
      'Molten surgical-grade alloy is injected under 160 tons of locking pressure, eliminating air pockets for a dense watch-case heft.',
    detail:
      'Produces 3x the structural density of conventional souvenir keychains with zero brittle joints.',
    viewMode: 'front',
    finish: 'Anodized Gunmetal',
  },
  {
    step: 'STAGE 03',
    title: '800°C Kiln-Fired Vitreous Hard Enamel Inlay',
    temp: '800°C KILN CURE',
    precision: '9H Mohs Surface Hardness',
    summary:
      'Artisans hand-pipette mineral pigments into each recessed crest channel before curing in an 800°C kiln and stone-polishing flush.',
    detail:
      'Creates a glass-smooth, scratch-immune surface that resists keys, coins, and tropical UV exposure.',
    viewMode: 'front',
    finish: '18K Brushed Gold',
  },
  {
    step: 'STAGE 04',
    title: '18K PVD Vacuum Plating & 50W Fiber Laser Etch',
    temp: 'VACUUM CHAMBER',
    precision: '3.5μm PVD Gold Coating',
    summary:
      'Each piece is vacuum-plated in 18K brushed gold or gunmetal and finished with a 50W fiber laser back-plate engraving.',
    detail:
      'Every carabiner spring gate is mechanically cycled 500 times before sealing in its magnetic collector box.',
    viewMode: 'back',
    finish: '18K Brushed Gold',
  },
];

const LEAGUE_VISUAL_SPEC: Record<
  LeagueId,
  {
    modelType: '3D Kit Jersey' | 'Club Shield' | 'Striker Boot' | 'Trophy Edition';
    clubSwatches: Array<{
      name: string;
      primary: string;
      secondary: string;
      accent: string;
      number: string;
    }>;
  }
> = {
  'Premier League': {
    modelType: '3D Kit Jersey',
    clubSwatches: [
      { name: 'Manchester Red Devils #07', primary: '#DC2626', secondary: '#18181B', accent: '#FBBF24', number: '07' },
      { name: 'North London Cannon #14', primary: '#EF4444', secondary: '#F8FAFC', accent: '#D97706', number: '14' },
      { name: 'Merseyside Reds #11', primary: '#B91C1C', secondary: '#991B1B', accent: '#FACC15', number: '11' },
      { name: 'Manchester Sky Blues #09', primary: '#38BDF8', secondary: '#F8FAFC', accent: '#FBBF24', number: '09' },
      { name: 'West London Lions #08', primary: '#1D4ED8', secondary: '#F8FAFC', accent: '#F59E0B', number: '08' },
    ],
  },
  LaLiga: {
    modelType: 'Club Shield',
    clubSwatches: [
      { name: 'Madrid Royal Blancos #15', primary: '#F8FAFC', secondary: '#1E3A8A', accent: '#F59E0B', number: '15' },
      { name: 'Barcelona Blaugrana #10', primary: '#991B1B', secondary: '#1D4ED8', accent: '#FBBF24', number: '10' },
      { name: 'Madrid Rojiblancos #19', primary: '#EF4444', secondary: '#F8FAFC', accent: '#1E3A8A', number: '19' },
      { name: 'San Sebastian Txuri-Urdin #21', primary: '#2563EB', secondary: '#F8FAFC', accent: '#EAB308', number: '21' },
    ],
  },
  'Serie A': {
    modelType: 'Club Shield',
    clubSwatches: [
      { name: 'Milano Nerazzurri #20', primary: '#1D4ED8', secondary: '#09090B', accent: '#FACC15', number: '20' },
      { name: 'Milano Rossoneri #07', primary: '#991B1B', secondary: '#09090B', accent: '#FBBF24', number: '07' },
      { name: 'Torino Bianconeri #10', primary: '#18181B', secondary: '#F8FAFC', accent: '#EAB308', number: '10' },
      { name: 'Roma Giallorossi #10', primary: '#7F1D1D', secondary: '#F59E0B', accent: '#FDE047', number: '10' },
    ],
  },
  'Ligue 1': {
    modelType: '3D Kit Jersey',
    clubSwatches: [
      { name: 'Paris Parc Capitale #10', primary: '#1E293B', secondary: '#E11D48', accent: '#F8FAFC', number: '10' },
      { name: 'Marseille Olympique #93', primary: '#0284C7', secondary: '#F8FAFC', accent: '#EAB308', number: '93' },
      { name: 'Monaco Principality #29', primary: '#DC2626', secondary: '#F8FAFC', accent: '#F59E0B', number: '29' },
      { name: 'Lyon Les Gones #08', primary: '#1E3A8A', secondary: '#DC2626', accent: '#FBBF24', number: '08' },
    ],
  },
};

interface StressTestSpec {
  id: 'drop' | 'scratch' | 'salt';
  title: string;
  standardCode: string;
  loadValue: string;
  bkeychainsResult: string;
  genericPlasticResult: string;
  score: number;
}

const STRESS_TESTS: StressTestSpec[] = [
  {
    id: 'drop',
    title: '2.5m Concrete Stadium Stair Drop Test',
    standardCode: 'ISO-9227 IMPACT PROTOCOL',
    loadValue: '42 Joules Impact Force',
    bkeychainsResult: '100% Structural Integrity — Zero denting or clasp gate failure.',
    genericPlasticResult: 'Acrylic cracks on first impact; thin split ring bends open.',
    score: 99,
  },
  {
    id: 'scratch',
    title: '500-Hour Key-Fob & Coin Pocket Friction Test',
    standardCode: '9H MOHS ABRASION BENCHMARK',
    loadValue: '15,000 Steel Key Scrapes',
    bkeychainsResult: 'Flush kiln-cured hard enamel remains mirror-smooth with 0% paint loss.',
    genericPlasticResult: 'Printed vinyl sticker peels and scratches within 3 weeks.',
    score: 98,
  },
  {
    id: 'salt',
    title: '96-Hour Tropical Rain & Sweat Corrosion Chamber',
    standardCode: 'ASTM B117 SALT FOG TEST',
    loadValue: '5% NaCl @ 35°C Continuous',
    bkeychainsResult: '18K PVD vacuum plating shows 0.0% oxidation or green tarnish.',
    genericPlasticResult: 'Cheap iron plating rusts and stains jersey fabric within days.',
    score: 100,
  },
];

export const InteractiveAbout: React.FC<InteractiveAboutProps> = ({
  config,
  reviews,
  onAddReview,
  onShopLeague,
  onBackHome,
}) => {
  // Interactive Forge Simulator State
  const [activeForgeStep, setActiveForgeStep] = useState(0);
  const [autoCycleForge, setAutoCycleForge] = useState(true);
  const forgeCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive 4-League Explorer State
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>('Premier League');
  const [selectedClubIdx, setSelectedClubIdx] = useState(0);

  // Interactive Material & Stress Test State
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(PREMIUM_MATERIALS[0].id);
  const [activeStressTest, setActiveStressTest] = useState<StressTestSpec>(STRESS_TESTS[0]);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Interactive Supporter Reviews Filter & Form State
  const [reviewLeagueFilter, setReviewLeagueFilter] = useState<LeagueId | 'ALL'>('ALL');
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [reviewLeague, setReviewLeague] = useState<LeagueId>('Premier League');
  const [verifiedPurchase, setVerifiedPurchase] = useState('Manchester Theatre #7 Home Kit Keychain');
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Auto-advance Forge Stage when enabled
  useEffect(() => {
    if (!autoCycleForge) return;
    const timer = window.setInterval(() => {
      setActiveForgeStep((prev) => (prev + 1) % FORGE_STAGES.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [autoCycleForge]);

  // Animated Forge Laser & Thermal Canvas Backdrop
  useEffect(() => {
    const canvas = forgeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const draw = () => {
      tick += 0.04;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Subtle CAD Grid
      ctx.strokeStyle =
        activeForgeStep === 0
          ? 'rgba(56, 189, 248, 0.12)'
          : activeForgeStep === 1
          ? 'rgba(245, 158, 11, 0.14)'
          : 'rgba(250, 204, 21, 0.10)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Sweeping Laser Scan Line
      const scanY = ((Math.sin(tick) + 1) / 2) * h;
      const scanGrad = ctx.createLinearGradient(0, scanY - 20, 0, scanY + 20);
      scanGrad.addColorStop(0, 'rgba(251, 191, 36, 0)');
      scanGrad.addColorStop(0.5, 'rgba(251, 191, 36, 0.45)');
      scanGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 20, w, 40);

      animId = window.requestAnimationFrame(draw);
    };

    animId = window.requestAnimationFrame(draw);
    return () => window.cancelAnimationFrame(animId);
  }, [activeForgeStep]);

  const currentStage = FORGE_STAGES[activeForgeStep] || FORGE_STAGES[0];
  const currentLeagueProfile =
    LEAGUE_PROFILES.find((l) => l.id === selectedLeague) || LEAGUE_PROFILES[0];
  const leagueVisual = LEAGUE_VISUAL_SPEC[selectedLeague];
  const activeClubSwatch =
    leagueVisual.clubSwatches[selectedClubIdx] || leagueVisual.clubSwatches[0];
  const currentMaterial =
    PREMIUM_MATERIALS.find((m) => m.id === selectedMaterialId) || PREMIUM_MATERIALS[0];

  const filteredReviews =
    reviewLeagueFilter === 'ALL'
      ? reviews
      : reviews.filter((r) => r.league === reviewLeagueFilter);

  const triggerStressTest = (spec: StressTestSpec) => {
    setActiveStressTest(spec);
    setIsRunningTest(true);
    setTimeout(() => setIsRunningTest(false), 600);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorName.trim().length < 2 || comment.trim().length < 10) {
      setReviewError('Please enter your full name and a review of at least 10 characters.');
      return;
    }
    setReviewError('');
    onAddReview({
      authorName: authorName.trim(),
      role: role.trim() || 'Club Supporter',
      organization: organization.trim() || `${reviewLeague} Supporters Club`,
      league: reviewLeague,
      rating: 5,
      comment: comment.trim(),
      verifiedPurchase,
    });
    setAuthorName('');
    setRole('');
    setOrganization('');
    setComment('');
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      {/* SECTION 1: CINEMATIC ABOUT HERO & STORY MANIFESTO */}
      <section className="relative border-b border-zinc-800/80 py-12 lg:py-16 bg-gradient-to-b from-zinc-900/60 to-[#09090B]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBackHome}
              className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Back to Main Welcome Page</span>
            </button>

            <div className="text-xs font-mono-num text-amber-400 uppercase tracking-widest">
              BKEYCHAINS INNOVATION & METALLURGY LAB · EST. 2024
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4">
              <div className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                INSIDE BKEYCHAINS · ARCHITECTURAL FOOTBALL HARDWARE
              </div>
              <h1
                className="font-display text-4xl sm:text-6xl font-bold text-white uppercase tracking-tight leading-[0.95]"
                style={{ textWrap: 'balance' }}
              >
                {config.aboutHeadline}
              </h1>
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                {config.aboutStory}
              </p>
            </div>

            <div className="lg:col-span-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 space-y-3">
              <div className="text-xs font-mono-num text-amber-400 uppercase">
                VERIFIED PRODUCTION TELEMETRY
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="font-mono-num text-2xl font-bold text-white">48,200+</div>
                  <div className="text-[11px] text-zinc-400">Collector Pieces Shipped</div>
                </div>
                <div>
                  <div className="font-mono-num text-2xl font-bold text-white">0.02mm</div>
                  <div className="text-[11px] text-zinc-400">CNC Mold Precision</div>
                </div>
                <div>
                  <div className="font-mono-num text-2xl font-bold text-white">800°C</div>
                  <div className="text-[11px] text-zinc-400">Vitreous Enamel Cure</div>
                </div>
                <div>
                  <div className="font-mono-num text-2xl font-bold text-amber-400">100%</div>
                  <div className="text-[11px] text-zinc-400">Corrosion-Free 316L</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE 4-STAGE METALCRAFT FORGE SIMULATOR */}
      <section className="py-16 border-b border-zinc-800/80">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                01. Interactive Manufacturing Process
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
                THE 4-STAGE METALCRAFT FORGE SIMULATOR
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setAutoCycleForge((a) => !a)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase border cursor-pointer ${
                autoCycleForge
                  ? 'bg-amber-400 text-zinc-950 border-amber-400'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800'
              }`}
            >
              {autoCycleForge ? 'Auto-Simulating Stages (On)' : 'Auto-Simulate Paused'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Stage Selector Steps */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              {FORGE_STAGES.map((stage, idx) => {
                const active = activeForgeStep === idx;
                return (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => {
                      setActiveForgeStep(idx);
                      setAutoCycleForge(false);
                    }}
                    className={`w-full text-left p-5 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-zinc-900 border-amber-400 shadow-lg'
                        : 'bg-zinc-900/35 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono-num">
                      <span className={active ? 'text-amber-400 font-bold' : 'text-zinc-400'}>
                        {stage.step} · {stage.temp}
                      </span>
                      <span className="text-zinc-400">{stage.precision}</span>
                    </div>
                    <div className="font-display text-xl font-bold text-white uppercase mt-1">
                      {stage.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Laser Scan Forge Viewport */}
            <div className="lg:col-span-7 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden relative flex flex-col justify-between p-6 sm:p-8 min-h-[420px]">
              <canvas
                ref={forgeCanvasRef}
                width={600}
                height={360}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono-num">
                <span className="text-amber-400 font-bold">
                  LIVE CAD TELEMETRY · {currentStage.step}
                </span>
                <span className="text-zinc-300">{currentStage.precision}</span>
              </div>

              <div className="relative z-10 my-auto py-6 flex flex-col sm:flex-row items-center gap-8">
                <div className="w-52 h-52 shrink-0 mx-auto">
                  <KeychainArtwork
                    modelType="3D Kit Jersey"
                    primaryColor="#DC2626"
                    secondaryColor="#18181B"
                    accentColor="#FBBF24"
                    kitNumber="07"
                    engravingText="FORGED 316L"
                    finish={currentStage.finish}
                    viewMode={currentStage.viewMode}
                    interactiveTilt={{ x: activeForgeStep * 8 - 10, y: 4 }}
                  />
                </div>

                <div className="flex-1 space-y-3 bg-black/60 backdrop-blur-md p-5 rounded-xl border border-zinc-800">
                  <div className="text-xs font-mono-num text-amber-400 uppercase">
                    CHAMBER STATUS: {currentStage.temp}
                  </div>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase leading-tight">
                    {currentStage.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    {currentStage.summary}
                  </p>
                  <p className="text-xs text-zinc-400 leading-relaxed pt-2 border-t border-zinc-800">
                    {currentStage.detail}
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono-num text-zinc-400 pt-3 border-t border-zinc-800/80">
                <span>ALLOY: 316L SURGICAL ZINC</span>
                <span>ENAMEL: 800°C VITREOUS</span>
                <span>LASER: 50W FIBER ETCH</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE 4-LEAGUE & LIVE CLUB COLORWAY EXPLORER */}
      <section className="py-16 border-b border-zinc-800/80 bg-[#09090B]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                02. Interactive Four-League Roster
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
                EXPLORE OUR 4 OFFICIAL EUROPEAN LEAGUES
              </h2>
            </div>

            <div className="text-xs text-zinc-400">
              Select a league and click any club below to preview its live enamel colorway
            </div>
          </div>

          {/* 4 League Selector Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LEAGUE_PROFILES.map((league) => {
              const isSelected = league.id === selectedLeague;
              return (
                <button
                  key={league.id}
                  type="button"
                  onClick={() => {
                    setSelectedLeague(league.id);
                    setSelectedClubIdx(0);
                  }}
                  className={`text-left p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-400'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-num text-xs text-amber-400 uppercase">
                        {league.country}
                      </span>
                      <span className="font-mono-num text-[11px] text-zinc-400">
                        {league.clubsCovered.length} Clubs
                      </span>
                    </div>
                    <div className="font-display text-2xl font-bold text-white uppercase mt-1">
                      {league.id}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-3 line-clamp-2">{league.tagline}</p>
                </button>
              );
            })}
          </div>

          {/* Interactive League Deep-Dive + Live Club Keychain Preview */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono-num text-amber-400">
                <span>LEAGUE DOSSIER · {currentLeagueProfile.country.toUpperCase()}</span>
                <span>{currentLeagueProfile.collectorCount}</span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase">
                {currentLeagueProfile.id} Collection
              </h3>

              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                {currentLeagueProfile.description}
              </p>

              {/* Interactive Club Swatch Selector */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Click a Club to Preview Live Keychain Colorway:
                </div>
                <div className="flex flex-wrap gap-2">
                  {leagueVisual.clubSwatches.map((swatch, idx) => (
                    <button
                      key={swatch.name}
                      type="button"
                      onClick={() => setSelectedClubIdx(idx)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold border inline-flex items-center gap-2 cursor-pointer transition-colors ${
                        selectedClubIdx === idx
                          ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/30"
                        style={{ backgroundColor: swatch.primary }}
                      />
                      <span>{swatch.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-zinc-400">Signature Hardware Spec</div>
                  <div className="text-sm font-semibold text-white">
                    {currentLeagueProfile.signatureFinish}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onShopLeague(currentLeagueProfile.id)}
                  className="px-5 py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Shop All {currentLeagueProfile.id} Keychains</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Live Club Keychain Preview Stage */}
            <div className="lg:col-span-5 rounded-xl bg-zinc-950 border border-zinc-800 p-6 flex flex-col items-center justify-between min-h-[320px]">
              <div className="w-full flex items-center justify-between text-xs font-mono-num text-zinc-400">
                <span>LIVE CLUB PREVIEW</span>
                <span className="text-amber-400">{activeClubSwatch.name}</span>
              </div>

              <div className="w-52 h-52 my-4">
                <KeychainArtwork
                  modelType={leagueVisual.modelType}
                  primaryColor={activeClubSwatch.primary}
                  secondaryColor={activeClubSwatch.secondary}
                  accentColor={activeClubSwatch.accent}
                  kitNumber={activeClubSwatch.number}
                  engravingText={currentLeagueProfile.id}
                />
              </div>

              <div className="text-xs text-zinc-400 text-center">
                {currentLeagueProfile.id} · 316L Zinc-Alloy · 9H Vitreous Enamel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PREMIUM MATERIALS & INTERACTIVE TORTURE-TEST SIMULATOR */}
      <section className="py-16 border-b border-zinc-800/80 bg-[#09090B]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div>
            <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
              03. Metallurgy & Torture-Test Laboratory
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
              PREMIUM MATERIALS & INTERACTIVE DURABILITY LAB
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: 4 Premium Material Specs */}
            <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PREMIUM_MATERIALS.map((mat) => {
                  const active = mat.id === selectedMaterialId;
                  return (
                    <button
                      key={mat.id}
                      type="button"
                      onClick={() => setSelectedMaterialId(mat.id)}
                      className={`text-left p-4 rounded-xl border transition-colors cursor-pointer ${
                        active
                          ? 'bg-zinc-900 border-amber-400'
                          : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-mono-num text-2xl font-bold text-amber-400">
                        {mat.metricValue}
                      </div>
                      <div className="text-xs text-zinc-400">{mat.metricLabel}</div>
                      <div className="text-sm font-bold text-white mt-2">{mat.name}</div>
                    </button>
                  );
                })}
              </div>

              <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-3">
                <div className="text-xs font-mono-num text-amber-400 uppercase">
                  SELECTED MATERIAL SPEC · {currentMaterial.grade}
                </div>
                <h3 className="font-display text-2xl font-bold text-white uppercase">
                  {currentMaterial.name}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {currentMaterial.summary}
                </p>
                <div className="text-xs text-emerald-400 font-medium pt-1">
                  ✓ {currentMaterial.testResult}
                </div>
              </div>
            </div>

            {/* Right: Interactive Stress-Test Simulator */}
            <div className="lg:col-span-6 rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-num text-amber-400 uppercase font-bold">
                    INTERACTIVE TORTURE-TEST BENCHMARK
                  </span>
                  <span className="text-xs font-mono-num text-emerald-400">
                    SCORE: {activeStressTest.score}/100
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white uppercase">
                  Run Live Durability Simulation:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {STRESS_TESTS.map((testItem) => (
                    <button
                      key={testItem.id}
                      type="button"
                      onClick={() => triggerStressTest(testItem)}
                      className={`px-3 py-2.5 rounded-lg text-xs font-bold uppercase border cursor-pointer transition-colors ${
                        activeStressTest.id === testItem.id
                          ? 'bg-amber-400 text-zinc-950 border-amber-400'
                          : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {testItem.id === 'drop'
                        ? '1. 2.5m Drop Test'
                        : testItem.id === 'scratch'
                        ? '2. 9H Key Scratch'
                        : '3. Salt-Spray Rain'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono-num">
                  <span className="text-zinc-300 font-bold">{activeStressTest.title}</span>
                  <span className="text-amber-400">{activeStressTest.loadValue}</span>
                </div>

                {/* Comparison Bars */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-emerald-400">
                        BKeychains 316L Alloy + 9H Hard Enamel
                      </span>
                      <span className="font-mono-num text-emerald-400">
                        {isRunningTest ? 'TESTING...' : `${activeStressTest.score}% INTACT`}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-300"
                        style={{ width: isRunningTest ? '35%' : `${activeStressTest.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-300">{activeStressTest.bkeychainsResult}</p>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-zinc-900">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-rose-400">
                        Standard Plastic / Acrylic Keychain
                      </span>
                      <span className="font-mono-num text-rose-400">22% FAILED</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-rose-500 w-[22%]" />
                    </div>
                    <p className="text-xs text-zinc-400">
                      {activeStressTest.genericPlasticResult}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: VERIFIED SUPPORTER REVIEWS & LIVE SUBMISSION */}
      <section className="py-16 bg-[#09090B]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                04. Verified Collector Community
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
                SUPPORTER REVIEWS & MATCHDAY STORIES ({reviews.length})
              </h2>
            </div>

            {/* Filter Reviews by League */}
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
              {(['ALL', 'Premier League', 'LaLiga', 'Serie A', 'Ligue 1'] as const).map((lg) => (
                <button
                  key={lg}
                  type="button"
                  onClick={() => setReviewLeagueFilter(lg)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                    reviewLeagueFilter === lg
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {lg === 'ALL' ? 'All Reviews' : lg}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredReviews.map((rev) => (
                <article
                  key={rev.id}
                  className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-amber-400">
                      <span className="inline-flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </span>
                      <span className="font-mono-num text-zinc-400">{rev.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      “{rev.comment}”
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80">
                    <div className="text-sm font-bold text-white">{rev.authorName}</div>
                    <div className="text-xs text-zinc-400">
                      {rev.role} · {rev.organization}
                    </div>
                    <div className="text-[11px] text-amber-400/90 mt-1">
                      {rev.league} · Verified: {rev.verifiedPurchase}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Interactive Write a Supporter Review Form */}
            <form
              onSubmit={handleReviewSubmit}
              className="lg:col-span-5 rounded-xl border border-zinc-800 bg-zinc-900/70 p-6 space-y-4"
            >
              <div>
                <h3 className="font-display text-2xl font-bold text-white uppercase">
                  Post Your Collector Review
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Share how your BKeychains piece holds up on matchdays.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="rev-name" className="block text-xs text-zinc-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Bagus Setiawan"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rev-org" className="block text-xs text-zinc-300 mb-1">
                      Fan Chapter / City
                    </label>
                    <input
                      id="rev-org"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g., IndoBarca Bandung"
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="rev-league" className="block text-xs text-zinc-300 mb-1">
                      League Collected
                    </label>
                    <select
                      id="rev-league"
                      value={reviewLeague}
                      onChange={(e) => setReviewLeague(e.target.value as LeagueId)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white"
                    >
                      <option value="Premier League">Premier League</option>
                      <option value="LaLiga">LaLiga</option>
                      <option value="Serie A">Serie A</option>
                      <option value="Ligue 1">Ligue 1</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="rev-comment" className="block text-xs text-zinc-300 mb-1">
                    Your Experience
                  </label>
                  <textarea
                    id="rev-comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe the weight, enamel finish, and durability..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white"
                  />
                </div>
              </div>

              {reviewError && <p className="text-xs text-rose-400">{reviewError}</p>}
              {reviewSuccess && (
                <p className="text-xs text-emerald-400">
                  Thank you! Your supporter review is now live in the feed.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
              >
                Submit Verified Review
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
