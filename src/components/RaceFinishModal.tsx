import React from 'react';
import { Trophy, Star, Gauge, Clock, Target, Play, RotateCcw, List } from 'lucide-react';
import { LevelCurriculum } from '../game/curriculum';

interface RaceFinishModalProps {
  level: LevelCurriculum;
  stats: {
    timeSeconds: number;
    maxSpeed: number;
    gatesHit: number;
    totalGates: number;
    score: number;
    stars: number;
  };
  onNextLevel: () => void;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  hasNextLevel: boolean;
}

export const RaceFinishModal: React.FC<RaceFinishModalProps> = ({
  level,
  stats,
  onNextLevel,
  onRestart,
  onOpenLeaderboard,
  hasNextLevel
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border-2 border-amber-500/90 p-6 shadow-[0_0_60px_rgba(245,158,11,0.35)] text-white animate-in zoom-in-95 duration-200 text-center">
        {/* Fanfare Trophy Header */}
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 mb-3">
          <Trophy className="w-10 h-10 text-amber-400" />
        </div>

        <h2 className="font-race text-2xl md:text-3xl font-black tracking-wider text-white">
          ZIEL ERREICHT!
        </h2>
        <p className="text-xs text-amber-400 font-hud uppercase tracking-widest mt-1 mb-4">
          {level.title} ERFOLGREICH GEMEISTERT
        </p>

        {/* 3 Stars Award */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((star) => (
            <div
              key={star}
              className={`p-2 rounded-xl border transition-all transform ${
                star <= stats.stars
                  ? 'bg-amber-500/20 border-amber-400 text-amber-400 scale-110 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-950 border-slate-800 text-slate-700'
              }`}
            >
              <Star
                className={`w-7 h-7 ${star <= stats.stars ? 'fill-amber-400' : ''}`}
              />
            </div>
          ))}
        </div>

        {/* Mastery Metric Tiles */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-left">
          {/* Final Score */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-hud text-slate-400 uppercase tracking-wider block">
              PUNKTE
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-race text-xl font-bold text-amber-400 tabular-nums">
                {stats.score}
              </span>
            </div>
          </div>

          {/* Max Speed */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-hud text-slate-400 uppercase tracking-wider block">
              HÖCHSTGESCHWINDIGKEIT
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="font-race text-xl font-bold text-cyan-400 tabular-nums">
                {Math.round(stats.maxSpeed)} <span className="text-xs font-hud text-slate-400">km/h</span>
              </span>
            </div>
          </div>

          {/* Lap Time */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-hud text-slate-400 uppercase tracking-wider block">
              RENNZEIT
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-slate-300" />
              <span className="font-hud text-lg font-bold text-white tabular-nums">
                {stats.timeSeconds.toFixed(1)}s
              </span>
            </div>
          </div>

          {/* Vokabel-Tore */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-hud text-slate-400 uppercase tracking-wider block">
              VOKABEL-TORE
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Target className="w-4 h-4 text-emerald-400" />
              <span className="font-hud text-lg font-bold text-emerald-400 tabular-nums">
                {stats.gatesHit} / {stats.totalGates}
              </span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2.5">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              data-start="true"
              aria-label="Nächste Lektion starten"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 text-white font-race font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-98 transition-transform cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>NÄCHSTE LEKTION STARTEN</span>
            </button>
          ) : (
            <button
              onClick={onOpenLeaderboard}
              data-start="true"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 text-white font-race font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Trophy className="w-4 h-4 fill-white" />
              <span>RANGLISTE & MEISTERSCHAFT ANSEHEN</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onRestart}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-hud text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Nochmal fahren</span>
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-hud text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Rangliste</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
