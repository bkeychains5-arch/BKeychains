import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowRight,
  Sliders,
  Maximize2,
  Minimize2,
  Video,
  Share2,
} from 'lucide-react';
import { StoreConfig } from '../types/store';
import { KeychainArtwork } from './KeychainArtwork';

interface PromoVideoHeroProps {
  config: StoreConfig;
  isOwnerUnlocked: boolean;
  onNavigateShop: () => void;
  onScrollToCustomizer: () => void;
  onOpenShareModal: () => void;
  onOpenVideoEditor: () => void;
}

interface FilmScene {
  id: number;
  timecode: string;
  kicker: string;
  chapterTitle: string;
  caption: string;
  specReadout: string;
  modelType: '3D Kit Jersey' | 'Club Shield' | 'Striker Boot' | 'Trophy Edition';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  kitNumber: string;
  viewMode: 'front' | 'back' | 'exploded';
}

const FILM_SCENES: FilmScene[] = [
  {
    id: 0,
    timecode: '00:00 / 00:24',
    kicker: 'SCENE 01 · DIE-CAST METALLURGY',
    chapterTitle: '420°C MOLTEN ZINC-ALLOY FORGING',
    caption:
      'High-pressure 316L alloy injection creates a 68-gram solid metal palm weight built for matchday intensity.',
    specReadout: 'DENSITY: 7.14 g/cm³ · PRECISION: ±0.05mm',
    modelType: '3D Kit Jersey',
    primaryColor: '#DC2626',
    secondaryColor: '#18181B',
    accentColor: '#FBBF24',
    kitNumber: '07',
    viewMode: 'front',
  },
  {
    id: 1,
    timecode: '00:06 / 00:24',
    kicker: 'SCENE 02 · KILN-FIRED PIGMENTS',
    chapterTitle: 'FOUR ELITE EUROPEAN LEAGUES',
    caption:
      'Premier League, LaLiga, Serie A, and Ligue 1 crests hand-filled with 9H scratch-proof vitreous enamel.',
    specReadout: '800°C KILN CURED · ZERO UV FADING',
    modelType: 'Club Shield',
    primaryColor: '#1D4ED8',
    secondaryColor: '#09090B',
    accentColor: '#FACC15',
    kitNumber: '20',
    viewMode: 'front',
  },
  {
    id: 2,
    timecode: '00:12 / 00:24',
    kicker: 'SCENE 03 · TACTICAL HARDWARE',
    chapterTitle: '15,000-CYCLE CNC SPRING CARABINER',
    caption:
      'Exploded engineering view of our 18K PVD gold split ring, hexagonal gate clip, and woven wrist lanyard.',
    specReadout: '18K PVD VACUUM GOLD · 18KG PULL RATING',
    modelType: 'Striker Boot',
    primaryColor: '#DC2626',
    secondaryColor: '#F8FAFC',
    accentColor: '#F59E0B',
    kitNumber: '14',
    viewMode: 'exploded',
  },
  {
    id: 3,
    timecode: '00:18 / 00:24',
    kicker: 'SCENE 04 · BESPOKE PERSONALIZATION',
    chapterTitle: '50W FIBER LASER BACK ENGRAVING',
    caption:
      'Every keychain includes complimentary reverse laser etching for your name, motto, and squad number.',
    specReadout: 'DEEP METAL ETCH · COMPLIMENTARY STUDIO SERVICE',
    modelType: 'Trophy Edition',
    primaryColor: '#991B1B',
    secondaryColor: '#1E40AF',
    accentColor: '#FBBF24',
    kitNumber: '10',
    viewMode: 'back',
  },
];

export const PromoVideoHero: React.FC<PromoVideoHeroProps> = ({
  config,
  isOwnerUnlocked,
  onNavigateShop,
  onScrollToCustomizer,
  onOpenShareModal,
  onOpenVideoEditor,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isCinemaWide, setIsCinemaWide] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [progress, setProgress] = useState(8);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const hasCustomVideo = Boolean(config.customVideoUrl && config.customVideoUrl.trim().length > 0);

  // Scrubber & Scene Progression
  useEffect(() => {
    if (!isPlaying || hasCustomVideo) return;
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev >= 100 ? 0 : prev + 1.25;
        const sceneIdx = Math.min(3, Math.floor((next / 100) * 4));
        setActiveSceneIndex(sceneIdx);
        return next;
      });
    }, 120);

    return () => window.clearInterval(interval);
  }, [isPlaying, hasCustomVideo]);

  // Animated Stadium Floodlights & Forge Sparks Canvas Backdrop inside the Video Player
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasCustomVideo) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let tick = 0;

    const particles = Array.from({ length: 28 }, (_, i) => ({
      x: (i * 37) % 640,
      y: (i * 53) % 360,
      vx: ((i % 5) - 2) * 0.45,
      vy: -0.6 - (i % 4) * 0.35,
      size: 1.2 + (i % 3) * 1.1,
      alpha: 0.25 + (i % 5) * 0.14,
    }));

    const renderFrame = () => {
      tick += isPlaying ? 0.035 : 0.005;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Deep Stadium Night Sky Gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#09090B');
      bgGrad.addColorStop(0.55, '#121217');
      bgGrad.addColorStop(1, '#09090B');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Sweeping Stadium Volumetric Floodlight Beams
      const beamAngle1 = Math.sin(tick * 0.7) * 0.25;
      ctx.save();
      ctx.translate(w * 0.2, -20);
      ctx.rotate(beamAngle1);
      const beam1 = ctx.createLinearGradient(0, 0, 0, h * 1.1);
      beam1.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      beam1.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = beam1;
      ctx.beginPath();
      ctx.moveTo(-30, 0);
      ctx.lineTo(30, 0);
      ctx.lineTo(170, h * 1.2);
      ctx.lineTo(-170, h * 1.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      const beamAngle2 = Math.cos(tick * 0.55) * 0.25;
      ctx.save();
      ctx.translate(w * 0.8, -20);
      ctx.rotate(beamAngle2);
      const beam2 = ctx.createLinearGradient(0, 0, 0, h * 1.1);
      beam2.addColorStop(0, 'rgba(225, 29, 72, 0.18)');
      beam2.addColorStop(1, 'rgba(225, 29, 72, 0)');
      ctx.fillStyle = beam2;
      ctx.beginPath();
      ctx.moveTo(-30, 0);
      ctx.lineTo(30, 0);
      ctx.lineTo(160, h * 1.2);
      ctx.lineTo(-160, h * 1.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Subtle Architectural Pitch Grid Perspective Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 48) {
        ctx.beginPath();
        ctx.moveTo(gx, h * 0.65);
        ctx.lineTo((gx - w / 2) * 1.5 + w / 2, h);
        ctx.stroke();
      }

      // Rising Molten Gold Forge Sparks
      for (const p of particles) {
        if (isPlaying) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < 0) p.y = h;
          if (p.x < 0) p.x = w;
          if (p.x > w) p.x = 0;
        }
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = window.requestAnimationFrame(renderFrame);
    };

    animId = window.requestAnimationFrame(renderFrame);
    return () => window.cancelAnimationFrame(animId);
  }, [isPlaying, hasCustomVideo]);

  // Sync HTML5 <video> play/pause/mute when owner uses custom video
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !hasCustomVideo) return;
    vid.muted = isMuted;
    if (isPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [isPlaying, isMuted, hasCustomVideo, config.customVideoUrl]);

  const currentScene = FILM_SCENES[activeSceneIndex] || FILM_SCENES[0];

  const handleSelectScene = (idx: number) => {
    setActiveSceneIndex(idx);
    setProgress(idx * 25 + 4);
  };

  return (
    <section className="relative border-b border-zinc-800/80 bg-[#09090B] py-10 lg:py-14">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* WELCOME PROMO VIDEO SHOWCASE STAGE */}
        <div
          className={`grid grid-cols-1 ${
            isCinemaWide ? 'lg:grid-cols-1' : 'lg:grid-cols-12'
          } gap-8 lg:gap-10 items-stretch`}
        >
          {/* Left Column: High-Impact Athletic Flagship Copy (Hidden only when Cinema Wide is expanded) */}
          {!isCinemaWide && (
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-bold tracking-widest text-amber-400 uppercase">
                  {config.heroKicker}
                </div>

                <h1
                  className="font-display text-4xl sm:text-5xl lg:text-[3.6rem] font-bold tracking-tight text-white uppercase leading-[0.95]"
                  style={{ textWrap: 'balance' }}
                >
                  {config.heroHeadline}
                </h1>

                <p className="text-zinc-300 text-base leading-relaxed">
                  {config.heroSubheadline}
                </p>

                {/* Unboxed Metadata Bar */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400 pt-1">
                  <span className="text-zinc-200 font-semibold">Premier League</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-200 font-semibold">LaLiga</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-200 font-semibold">Serie A</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-zinc-200 font-semibold">Ligue 1</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-num text-amber-400 font-bold">
                    From Rp 119.000
                  </span>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onNavigateShop}
                    className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-transform active:scale-[0.99] inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Shop Official Catalog (IDR)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onScrollToCustomizer}
                    className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>3D Model Customizer</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="button"
                    onClick={onOpenShareModal}
                    className="text-zinc-400 hover:text-white text-xs font-medium inline-flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Share Official Store Link</span>
                  </button>

                  {isOwnerUnlocked && (
                    <button
                      type="button"
                      onClick={onOpenVideoEditor}
                      className="text-amber-400 hover:text-amber-300 text-xs font-semibold inline-flex items-center gap-1.5 underline underline-offset-4 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Change Welcome Video / Text (Owner)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Column (or Full Width in Theater Mode): Live Welcome Promotional Video Player */}
          <div className={isCinemaWide ? 'lg:col-span-1' : 'lg:col-span-7 flex flex-col'}>
            <div
              className="relative flex-1 rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col justify-between min-h-[450px] shadow-2xl"
              data-testid="promo-video-player"
            >
              {/* Background Canvas or Custom Uploaded <video> */}
              {hasCustomVideo ? (
                <video
                  ref={videoRef}
                  src={config.customVideoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={360}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
              )}

              {/* Top Scrim & Film Header */}
              <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-3.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-zinc-950 font-mono-num text-[10px] font-bold uppercase shrink-0">
                    WELCOME FILM
                  </span>
                  <span className="text-xs font-semibold text-zinc-100 truncate">
                    {config.promoVideoTitle}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {!hasCustomVideo && (
                    <span className="font-mono-num text-xs text-amber-400">
                      {currentScene.timecode}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCinemaWide((w) => !w)}
                    aria-label={
                      isCinemaWide ? 'Exit Widescreen Video Mode' : 'Expand Widescreen Video Mode'
                    }
                    className="p-1.5 rounded bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 cursor-pointer"
                  >
                    {isCinemaWide ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Center Interactive Video Stage */}
              {!hasCustomVideo ? (
                <div className="relative z-10 flex-1 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 py-4 gap-6">
                  {/* Animated 3D Keychain in Spotlight */}
                  <div className="w-52 h-52 sm:w-60 sm:h-60 mx-auto shrink-0">
                    <KeychainArtwork
                      modelType={currentScene.modelType}
                      primaryColor={currentScene.primaryColor}
                      secondaryColor={currentScene.secondaryColor}
                      accentColor={currentScene.accentColor}
                      kitNumber={currentScene.kitNumber}
                      engravingText="BKEYCHAINS 26"
                      viewMode={currentScene.viewMode}
                      interactiveTilt={{
                        x: isPlaying ? Math.sin((progress / 100) * Math.PI * 4) * 18 : 0,
                        y: isPlaying ? Math.cos((progress / 100) * Math.PI * 2) * 8 : 0,
                      }}
                    />
                  </div>

                  {/* Kinetic Commercial Film Telemetry & Story Overlay */}
                  <div className="flex-1 space-y-2.5 text-left bg-black/45 backdrop-blur-sm p-5 rounded-xl border border-white/10">
                    <div className="font-mono-num text-[11px] text-amber-400 tracking-widest uppercase">
                      {currentScene.kicker}
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-wide leading-tight">
                      {currentScene.chapterTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {currentScene.caption}
                    </p>
                    <div className="pt-2 border-t border-white/10 font-mono-num text-[11px] text-zinc-400">
                      {currentScene.specReadout}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex-1 flex items-end p-6 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                  <div className="space-y-1">
                    <div className="text-xs font-mono-num text-amber-400 uppercase">
                      CUSTOM OWNER PROMO VIDEO ACTIVE
                    </div>
                    <h2 className="font-display text-3xl font-bold text-white uppercase">
                      {config.promoVideoTitle}
                    </h2>
                  </div>
                </div>
              )}

              {/* Bottom Video Scrubber & Controls */}
              <div className="relative z-10 bg-zinc-950/95 border-t border-zinc-800 p-4 space-y-3">
                {!hasCustomVideo && (
                  <div
                    className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPct = Math.max(
                        0,
                        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
                      );
                      setProgress(clickPct);
                      setActiveSceneIndex(Math.min(3, Math.floor((clickPct / 100) * 4)));
                    }}
                  >
                    <div
                      className="bg-amber-400 h-full transition-all duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPlaying((p) => !p)}
                      aria-label={isPlaying ? 'Pause Promo Video' : 'Play Promo Video'}
                      className="px-3.5 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>{isPlaying ? 'Pause Video' : 'Play Video'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted((m) => !m)}
                      aria-label={isMuted ? 'Unmute Video Audio' : 'Mute Video Audio'}
                      className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                    </button>
                  </div>

                  {!hasCustomVideo && (
                    <div
                      className="flex items-center gap-1.5"
                      role="group"
                      aria-label="Promo video chapters"
                    >
                      {FILM_SCENES.map((scene, index) => (
                        <button
                          key={scene.id}
                          type="button"
                          onClick={() => handleSelectScene(index)}
                          className={`px-2.5 py-1 rounded text-xs font-mono-num transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            activeSceneIndex === index
                              ? 'bg-zinc-100 text-zinc-950 font-bold'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                          }`}
                        >
                          CH 0{index + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Quantitative Proof Bar */}
        <div className="pt-8 border-t border-zinc-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-white">
              48,200+
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Matchday Keychains Delivered Since 2024
            </div>
          </div>
          <div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-white">
              68 Grams
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Solid 316L Zinc-Alloy Casting Weight
            </div>
          </div>
          <div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-white">
              4 Leagues
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Premier League · LaLiga · Serie A · Ligue 1
            </div>
          </div>
          <div>
            <div className="font-mono-num text-2xl sm:text-3xl font-bold text-amber-400">
              4.94 / 5.0
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              Verified Collector Rating Across 2,400+ Orders
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
