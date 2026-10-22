import React, { useEffect } from 'react';
import { Volume2, VolumeX, Trophy, Car, Map, Play, Flame, BookOpen } from 'lucide-react';
import { soundEngine } from '../game/audio';
import { LevelCurriculum } from '../game/curriculum';
import { CarModel } from '../game/racingRules';

interface TitleScreenProps {
  onStartRace: () => void;
  onOpenLevels: () => void;
  onOpenLeaderboard: () => void;
  onOpenGarage: () => void;
  onOpenLesenStudio: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentLevel: LevelCurriculum;
  currentCar: CarModel;
  streakDays: number;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartRace,
  onOpenLevels,
  onOpenLeaderboard,
  onOpenGarage,
  onOpenLesenStudio,
  isMuted,
  onToggleMute,
  currentLevel,
  currentCar,
  streakDays
}) => {
  // Bind Enter and Space to start
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') {
        e.preventDefault();
        onStartRace();
      }
      if (e.code === 'KeyM') {
        onToggleMute();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onStartRace, onToggleMute]);

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-6 md:p-12 overflow-hidden bg-radial from-slate-900 via-slate-950 to-black select-none">
      {/* Background road horizon grid animation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="w-full h-full bg-[linear-gradient(to_bottom,transparent_40%,rgba(6,182,212,0.25)_80%,rgba(245,158,11,0.3)_100%)]" />
        <div className="absolute bottom-0 w-full h-64 border-t border-cyan-500/30 bg-[radial-gradient(ellipse_at_bottom,rgba(6,182,212,0.2),transparent_70%)]" />
      </div>

      {/* Top Header Controls */}
      <div className="relative z-10 flex items-center justify-between">
        {/* Streak & School Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-hud text-sm font-semibold">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{streakDays} TAGE SERIE</span>
          </div>
          <div className="hidden sm:flex items-center px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-300 text-xs font-hud">
            🇩🇪 DEUTSCH GRAND PRIX
          </div>
        </div>

        {/* Top Right Utility Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLeaderboard}
            aria-label="Rangliste öffnen"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 text-xs font-hud transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Rangliste</span>
          </button>

          <button
            onClick={onOpenGarage}
            aria-label="Garage öffnen"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 text-slate-200 text-xs font-hud transition-colors cursor-pointer"
          >
            <Car className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Garage</span>
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Ton einschalten' : 'Stummschalten'}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* Hero Centerpiece: Bespoke SVG Title Lockup */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto max-w-4xl mx-auto px-4">
        {/* Inline SVG Title Lockup */}
        <div className="w-full max-w-lg mb-4">
          <svg viewBox="0 0 520 120" className="w-full h-auto drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]">
            <defs>
              <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
            </defs>

            {/* Racing Speed Lines */}
            <path d="M 20 25 L 180 25 M 60 18 L 220 18 M 10 32 L 140 32" stroke="#38bdf8" strokeWidth="3" opacity="0.6" strokeDasharray="12 8" />

            {/* Bespoke Typography */}
            <text x="260" y="55" textAnchor="middle" fill="url(#metalGrad)" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="42" letterSpacing="4">
              AUTOBAHN
            </text>
            <text x="260" y="100" textAnchor="middle" fill="url(#titleGrad)" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="38" letterSpacing="8">
              DEUTSCH
            </text>
          </svg>
        </div>

        {/* Narrative Subtitle */}
        <p className="text-slate-300 text-sm md:text-base font-hud max-w-md mb-6 leading-relaxed">
          Das rasante Vokabel-Rennspiel mit Echtzeit-Spracherkennung, PB3s Abenteuern und Autobahn-Action!
        </p>

        {/* Active Stage Card */}
        <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 shadow-lg mb-8 max-w-md w-full justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-hud tracking-widest text-cyan-400 font-bold">Aktuelle Strecke</span>
            <div className="font-race text-white text-sm md:text-base font-bold">{currentLevel.title}</div>
            <div className="text-xs text-slate-400 font-hud">{currentLevel.subtitle}</div>
          </div>
          <button
            onClick={onOpenLevels}
            aria-label="Strecke wechseln"
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-hud flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Wechseln</span>
          </button>
        </div>

        {/* CTA Buttons Row: Racing & Dedicated Reading Studio */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xl justify-center">
          {/* Primary Start CTA Button */}
          <button
            onClick={onStartRace}
            data-start="true"
            aria-label="Rennen starten"
            className="w-full sm:w-auto flex-1 group relative rounded-xl bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 p-[2px] shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_45px_rgba(245,158,11,0.7)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <div className="px-6 py-3 rounded-[10px] bg-slate-950/95 flex items-center justify-center gap-2.5">
              <Play className="w-5 h-5 text-amber-400 fill-amber-400 group-hover:animate-ping" />
              <span className="font-race text-base sm:text-lg font-black tracking-wider text-white">
                RENNEN STARTEN
              </span>
            </div>
          </button>

          {/* Dedicated Lesen & Hören Studio Button */}
          <button
            onClick={onOpenLesenStudio}
            aria-label="Lesen & Hören Studio öffnen"
            className="w-full sm:w-auto flex-1 group relative rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_rgba(99,102,241,0.7)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <div className="px-5 py-2.5 rounded-[10px] bg-slate-950/95 flex items-center justify-center gap-2.5">
              <BookOpen className="w-5 h-5 text-indigo-400 group-hover:animate-bounce" />
              <div className="flex flex-col text-left">
                <span className="font-race text-xs sm:text-sm font-black text-indigo-300 tracking-wide">
                  📖 LESEN &amp; HÖREN
                </span>
                <span className="text-[10px] font-hud text-slate-300">
                  Hör- &amp; Lesestudio (Ohne Timer / بدون تايمر)
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Flat Bottom Control Hints (Ultra Mode compliant: single flat line) */}
      <div className="relative z-10 text-center text-xs text-slate-400 font-hud">
        WASD / Pfeiltasten Lenken & Gas · Leertaste / Shift Nitro-Boost · M Stumm · P Pause
      </div>
    </div>
  );
};
