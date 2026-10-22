import React from 'react';
import { Play, RotateCcw, Map, Home } from 'lucide-react';
import { LevelCurriculum } from '../game/curriculum';

interface PauseModalProps {
  level: LevelCurriculum;
  onResume: () => void;
  onRestart: () => void;
  onOpenLevelSelect: () => void;
  onReturnToTitle: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  level,
  onResume,
  onRestart,
  onOpenLevelSelect,
  onReturnToTitle
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 select-none">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border-2 border-slate-700 p-6 shadow-2xl text-white animate-in zoom-in-95 duration-150 text-center">
        <h2 className="font-race text-2xl font-black tracking-wider text-white mb-1">
          PAUSIERT
        </h2>
        <p className="text-xs text-cyan-400 font-hud mb-6">
          {level.title}
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-race font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-colors cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>WEITERFAHREN</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-hud font-bold text-xs text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Strecke neu starten</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-hud font-bold text-xs text-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Map className="w-4 h-4" />
            <span>Andere Lektion wählen</span>
          </button>

          <button
            onClick={onReturnToTitle}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 font-hud font-bold text-xs text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
          >
            <Home className="w-4 h-4" />
            <span>Hauptmenü</span>
          </button>
        </div>
      </div>
    </div>
  );
};
