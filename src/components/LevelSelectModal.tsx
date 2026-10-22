import React from 'react';
import { Map, Star, Play, CheckCircle2, X } from 'lucide-react';
import { CURRICULUM_LEVELS, LevelCurriculum } from '../game/curriculum';

interface LevelSelectModalProps {
  currentLevelId: number;
  completedLevelStars: Record<number, number>;
  onSelectLevel: (level: LevelCurriculum) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevelId,
  completedLevelStars,
  onSelectLevel,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 select-none">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border-2 border-cyan-500/80 p-6 shadow-2xl text-white animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Map className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="font-race text-lg font-black tracking-wider text-white">
                AUTOBAHN STRECKEN-WAHL (8 LEKTIONEN)
              </h2>
              <p className="text-xs text-slate-400 font-hud">
                Jedes Level entspricht einer vollständigen Unterrichtslektion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-4 overflow-y-auto flex-1 pr-1">
          {CURRICULUM_LEVELS.map((lvl) => {
            const isSelected = lvl.id === currentLevelId;
            const stars = completedLevelStars[lvl.id] || 0;

            return (
              <div
                key={lvl.id}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-hud text-amber-400 font-bold">
                      Lektion {lvl.id}
                    </span>
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="font-race text-sm md:text-base font-bold text-white mb-1">
                    {lvl.title}
                  </h3>
                  <p className="text-xs text-cyan-300 font-hud mb-2">
                    {lvl.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-400 font-hud line-clamp-2 leading-relaxed">
                    {lvl.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px] font-hud">
                  <span className="text-slate-400">
                    {lvl.gates.length} Speed-Gates · {lvl.voiceCheckpoints.length} Sprach-Zonen
                  </span>
                  <div className="flex items-center gap-1 text-cyan-400 font-bold">
                    <Play className="w-3 h-3 fill-cyan-400" />
                    <span>Starten</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-2 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-hud text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
