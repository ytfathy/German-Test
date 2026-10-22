import React from 'react';
import { Volume2, VolumeX, Pause, Flame, Zap, ArrowLeft, ArrowRight, Mic, CheckCircle2, XCircle, BookOpen, RotateCcw } from 'lucide-react';
import { LevelCurriculum, QuestionGate } from '../game/curriculum';

export interface GateFeedback {
  gatePrompt: string;
  chosenOption: string;
  correctOption: string;
  isCorrect: boolean;
  points: number;
  timestamp: number;
}

interface HUDProps {
  level: LevelCurriculum;
  speedKmH: number;
  nitroPct: number;
  distancePct: number;
  score: number;
  streakDays: number;
  comboCount: number;
  upcomingGate: QuestionGate | null;
  gateDistance: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onTriggerVoice: () => void;
  onSteerTouch: (direction: -1 | 0 | 1) => void;
  onNitroTouch: (active: boolean) => void;
  onSelectLaneAnswer?: (laneIndex: 0 | 1 | 2) => void;
  gateFeedback?: GateFeedback | null;
  isReadingAudioPlaying?: boolean;
  onPlayReadingAudio?: () => void;
  onStopReadingAudio?: () => void;
  onOpenLesenStudio?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  level,
  speedKmH,
  nitroPct,
  distancePct,
  score,
  streakDays,
  comboCount,
  upcomingGate,
  gateDistance,
  isMuted,
  onToggleMute,
  onPause,
  onTriggerVoice,
  onSteerTouch,
  onNitroTouch,
  onSelectLaneAnswer,
  gateFeedback,
  isReadingAudioPlaying,
  onPlayReadingAudio,
  onStopReadingAudio,
  onOpenLesenStudio
}) => {
  // Gear estimation from speed
  const gear = speedKmH < 40 ? 1 : speedKmH < 90 ? 2 : speedKmH < 150 ? 3 : speedKmH < 220 ? 4 : speedKmH < 270 ? 5 : 6;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 md:p-6 overflow-hidden select-none">
      {/* TOP HEADER ROW: Level Progress (Left) and Score/Buttons (Right) */}
      <div className="flex items-center justify-between w-full gap-2 pointer-events-none">
        {/* Top-Left: Level Title & Progress */}
        <div className="flex flex-col gap-1 pointer-events-auto bg-slate-950/85 px-3 py-2 md:px-4 md:py-2.5 rounded-xl border border-slate-800 shadow-md max-w-[160px] sm:max-w-[200px] md:max-w-xs shrink-0">
          <div className="flex items-center justify-between gap-2 text-[10px] md:text-xs font-hud">
            <span className="text-cyan-400 font-bold uppercase tracking-wider truncate">{level.title}</span>
            <span className="text-amber-400 font-bold tabular-nums flex-shrink-0">{Math.round(distancePct)}%</span>
          </div>
          {/* Track Progress Bar */}
          <div className="w-full h-1.5 md:h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-amber-500 transition-all duration-100"
              style={{ width: `${Math.min(100, distancePct)}%` }}
            />
          </div>
        </div>

        {/* Top-Right: Score, Combo & Quick Controls */}
        <div className="flex items-center gap-1.5 md:gap-3 pointer-events-auto shrink-0">
          <div className="flex flex-col items-end bg-slate-950/85 px-2.5 md:px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-md">
            <span className="text-[8px] md:text-[9px] font-hud uppercase tracking-widest text-slate-400">PUNKTE</span>
            <div className="font-hud text-base md:text-2xl font-bold text-amber-400 tabular-nums leading-tight">
              {Math.round(score)}
            </div>
            {comboCount > 1 && (
              <span className="text-[8px] md:text-[9px] font-hud text-emerald-400 font-bold animate-pulse">
                {comboCount}x COMBO! 🔥
              </span>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1">
            {onOpenLesenStudio && (
              <button
                onClick={onOpenLesenStudio}
                aria-label="Lesen & Hören Studio öffnen"
                className="px-2 py-1.5 md:py-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/60 text-indigo-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-hud shadow-md"
                title="قسم نصوص القراءة والاستماع (Lesen & Hören)"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Lesen</span>
              </button>
            )}
            <button
              onClick={onTriggerVoice}
              aria-label="Sprach-Radar Checkpoint öffnen"
              className="p-1.5 md:p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center shadow-lg"
              title="Sprach-Radar Aussprache-Training"
            >
              <Mic className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 animate-pulse" />
            </button>
            <button
              onClick={onPause}
              aria-label="Spiel pausieren"
              className="p-1.5 md:p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Ton an' : 'Stumm'}
              className="p-1.5 md:p-2 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* TOP-CENTER: Windshield Question Gantry HUD (Floating below top bar) */}
      {upcomingGate && gateDistance < 18000 && (
        <div className="w-full max-w-lg md:max-w-2xl mx-auto pointer-events-auto transform animate-in fade-in duration-200 px-2 mt-1 sm:mt-2">
          {/* LESETEXT / READING PASSAGE (When question has "isLesen") */}
          {upcomingGate.isLesen && upcomingGate.passage && (
            <div className="mb-1.5 p-2.5 sm:p-3 rounded-xl bg-slate-950/95 border-2 border-amber-500/80 shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
              {/* Header with Title and Audio Button */}
              <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-amber-500/30">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/25 border border-amber-400/60 text-amber-300 font-hud text-[9px] sm:text-[10px] font-black tracking-wider uppercase shrink-0 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-amber-400" />
                    LESEN &amp; HÖREN
                  </span>
                  <span className="font-hud text-xs sm:text-sm font-bold text-white truncate">
                    {upcomingGate.passageTitle || 'Lesetext'}
                  </span>
                </div>

                {/* Audio Recite / Playback Button */}
                <div className="flex items-center gap-1 shrink-0">
                  {isReadingAudioPlaying ? (
                    <button
                      type="button"
                      onClick={onStopReadingAudio}
                      className="px-2 py-1 rounded-md bg-rose-600/90 hover:bg-rose-500 text-white font-hud text-[10px] sm:text-xs font-bold flex items-center gap-1.5 border border-rose-400 shadow-md transition-all active:scale-95 cursor-pointer"
                      title="Audio vorlesen stoppen"
                    >
                      <span className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 bg-white animate-pulse h-2" />
                        <span className="w-0.5 bg-white animate-pulse h-3" />
                        <span className="w-0.5 bg-white animate-pulse h-1.5" />
                      </span>
                      <span>Liest vor... (Stop)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onPlayReadingAudio}
                      className="px-2 py-1 rounded-md bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 hover:text-white font-hud text-[10px] sm:text-xs font-bold flex items-center gap-1.5 border border-amber-400/60 shadow-md transition-all active:scale-95 cursor-pointer"
                      title="Deutschen Text anhören (Speech Audio)"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>🔊 Anhören</span>
                    </button>
                  )}
                </div>
              </div>

              {/* German Reading Passage Text Body */}
              <div className="bg-slate-900/85 rounded-lg p-2 sm:p-2.5 border border-slate-800 text-left">
                <p className="text-amber-100 font-sans font-medium text-xs sm:text-sm leading-relaxed tracking-wide select-text">
                  &ldquo;{upcomingGate.passage}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Question Box */}
          <div className="px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-t-xl bg-slate-950/95 border-t border-x border-cyan-500/80 text-center shadow-xl">
            <span className="text-[8px] sm:text-[9px] md:text-[10px] uppercase font-hud text-emerald-400 font-bold tracking-widest block mb-0.5">
              ⏳ بدون تايمر • خذ وقتك في القراءة • السؤال مستمر حتى تختار (KLICKE 1, 2, 3) ⏳
            </span>
            <p className="font-race text-white text-xs sm:text-sm md:text-base font-bold drop-shadow leading-snug">
              {upcomingGate.prompt}
            </p>
          </div>

          {/* Lane Options Indicator - Clickable / Touchable */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-slate-950/95 border border-cyan-500/50 rounded-b-xl shadow-2xl">
            {upcomingGate.options.map((opt, idx) => {
              const laneLabels = ['[1] Spur A (Links)', '[2] Spur B (Mitte)', '[3] Spur C (Rechts)'];
              const laneIdx = idx as 0 | 1 | 2;

              const isChosenInFeedback =
                gateFeedback &&
                gateFeedback.gatePrompt === upcomingGate.prompt &&
                gateFeedback.chosenOption === opt;
              const isCorrectInFeedback =
                gateFeedback &&
                gateFeedback.gatePrompt === upcomingGate.prompt &&
                gateFeedback.correctOption === opt;

              let buttonTheme =
                idx === 0
                  ? 'border-amber-500/70 text-amber-300 hover:border-amber-400 hover:bg-amber-950/40'
                  : idx === 1
                  ? 'border-cyan-500/70 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/40'
                  : 'border-emerald-500/70 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-950/40';

              if (isChosenInFeedback) {
                buttonTheme = gateFeedback.isCorrect
                  ? 'bg-emerald-600 border-emerald-300 text-white ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/50'
                  : 'bg-rose-600 border-rose-300 text-white ring-2 ring-rose-400 shadow-lg shadow-rose-500/50';
              } else if (isCorrectInFeedback && !gateFeedback.isCorrect) {
                buttonTheme = 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-500 animate-pulse';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectLaneAnswer?.(laneIdx)}
                  className={`px-1.5 sm:px-2 py-1.5 md:py-2 rounded-lg bg-slate-900/90 border text-center flex flex-col justify-center min-h-[46px] sm:min-h-[52px] cursor-pointer transition-all active:scale-95 hover:scale-[1.02] shadow-md ${buttonTheme}`}
                  title={`Wähle "${opt}" (${laneLabels[idx]})`}
                >
                  <span className="text-[7px] sm:text-[8px] md:text-[9px] font-hud block uppercase mb-0.5 opacity-80">
                    {laneLabels[idx]}
                  </span>
                  <span className="font-hud text-[11px] sm:text-xs md:text-sm font-bold block leading-tight break-words">
                    {opt}
                  </span>
                  {isChosenInFeedback && (
                    <span className="text-[8px] sm:text-[9px] font-hud font-black mt-0.5 block">
                      {gateFeedback.isCorrect ? '✅ RICHTIG' : '❌ FALSCH'}
                    </span>
                  )}
                  {!isChosenInFeedback && isCorrectInFeedback && !gateFeedback.isCorrect && (
                    <span className="text-[8px] sm:text-[9px] font-hud font-black mt-0.5 block text-emerald-300">
                      ✓ RICHTIGE ANTWORT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PROMINENT ANSWER FEEDBACK BANNER (Instant Right / Wrong Notification) */}
      {gateFeedback && (
        <div className="fixed top-28 sm:top-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none w-[92%] max-w-lg transition-all animate-in zoom-in-95 duration-200">
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border-2 shadow-2xl backdrop-blur-md flex items-center gap-3.5 sm:gap-4 ${
              gateFeedback.isCorrect
                ? 'bg-emerald-950/95 border-emerald-400 text-white shadow-emerald-500/40 ring-2 ring-emerald-500/30'
                : 'bg-rose-950/95 border-rose-500 text-white shadow-rose-500/40 ring-2 ring-rose-500/30'
            }`}
          >
            {/* Visual Icon Badge */}
            <div
              className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg shrink-0 ${
                gateFeedback.isCorrect ? 'bg-emerald-500 text-slate-950 animate-bounce' : 'bg-rose-600 text-white animate-pulse'
              }`}
            >
              {gateFeedback.isCorrect ? <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" /> : <XCircle className="w-7 h-7 sm:w-8 sm:h-8" />}
            </div>

            <div className="flex flex-col flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-race text-base sm:text-xl font-black uppercase tracking-wider ${
                    gateFeedback.isCorrect ? 'text-emerald-300' : 'text-rose-300'
                  }`}
                >
                  {gateFeedback.isCorrect ? 'RICHTIG! (CORRECT!)' : 'FALSCH! (WRONG!)'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-hud font-black ${
                    gateFeedback.isCorrect
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60'
                      : 'bg-rose-500/25 text-rose-300 border border-rose-400/60'
                  }`}
                >
                  {gateFeedback.isCorrect ? `+${gateFeedback.points} PKT` : '-50 PKT'}
                </span>
              </div>

              {gateFeedback.isCorrect ? (
                <div className="mt-0.5">
                  <p className="text-xs sm:text-sm font-hud text-emerald-100 font-bold truncate">
                    Ausgezeichnet: &quot;{gateFeedback.chosenOption}&quot;
                  </p>
                  <span className="text-[10px] sm:text-xs font-hud text-amber-300 font-bold flex items-center gap-1 mt-0.5">
                    ⚡ 100% NITRO FREIGESCHALTET!
                  </span>
                </div>
              ) : (
                <div className="mt-0.5 flex flex-col gap-0.5 text-xs sm:text-sm font-hud">
                  <div className="text-rose-200">
                    Deine Wahl: <span className="line-through font-bold text-rose-300">&quot;{gateFeedback.chosenOption}&quot;</span>
                  </div>
                  <div className="text-emerald-300 font-extrabold flex items-center gap-1">
                    <span>Richtige Antwort:</span>
                    <span className="bg-emerald-900/80 px-1.5 py-0.5 rounded border border-emerald-500/60 font-black">
                      &quot;{gateFeedback.correctOption}&quot;
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CLUSTER: Speedometer & Nitro Boost Gauge */}
      <div className="flex items-end justify-between gap-2 md:gap-4">
        {/* Speedometer & Gear */}
        <div className="pointer-events-auto flex items-end gap-2 md:gap-3 bg-slate-950/85 p-2 md:p-3 rounded-2xl border border-slate-800 shadow-2xl">
          {/* Digital Speed */}
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] font-hud uppercase tracking-wider text-slate-400">GESCHWINDIGKEIT</span>
            <div className="flex items-baseline gap-1">
              <span className="font-race text-2xl md:text-5xl font-black text-cyan-400 tabular-nums text-glow-cyan">
                {Math.round(speedKmH)}
              </span>
              <span className="text-[10px] md:text-xs font-hud text-slate-400 font-bold">KM/H</span>
            </div>
          </div>

          {/* Gear */}
          <div className="flex flex-col items-center pl-1.5 md:pl-2 border-l border-slate-800">
            <span className="text-[8px] md:text-[9px] font-hud text-slate-400 uppercase">GANG</span>
            <span className="font-race text-sm md:text-lg font-bold text-amber-400">{gear}</span>
          </div>
        </div>

        {/* Mobile On-Screen Steering Buttons */}
        <div className="flex sm:hidden items-center gap-1.5 pointer-events-auto shrink-0">
          <button
            onTouchStart={() => onSteerTouch(-1)}
            onTouchEnd={() => onSteerTouch(0)}
            onMouseDown={() => onSteerTouch(-1)}
            onMouseUp={() => onSteerTouch(0)}
            aria-label="Nach links lenken"
            className="w-10 h-10 rounded-xl bg-slate-900/95 active:bg-cyan-600 border border-slate-700 flex items-center justify-center text-white active:scale-95 shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onTouchStart={() => onSteerTouch(1)}
            onTouchEnd={() => onSteerTouch(0)}
            onMouseDown={() => onSteerTouch(1)}
            onMouseUp={() => onSteerTouch(0)}
            aria-label="Nach rechts lenken"
            className="w-10 h-10 rounded-xl bg-slate-900/95 active:bg-cyan-600 border border-slate-700 flex items-center justify-center text-white active:scale-95 shadow-xl"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Nitro Boost Gauge */}
        <div className="pointer-events-auto flex flex-col items-end bg-slate-950/85 p-1.5 sm:p-2 md:p-3 rounded-2xl border border-slate-800 shadow-2xl shrink-0">
          <div className="flex items-center gap-1 mb-1 text-[9px] sm:text-[10px] md:text-xs font-hud">
            <Zap className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${nitroPct > 20 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
            <span className="text-amber-400 font-bold tracking-wider">
              <span className="hidden sm:inline">NITRO [SHIFT]</span>
              <span className="sm:hidden">NITRO</span>
            </span>
          </div>
          <div className="w-20 sm:w-28 md:w-44 h-2.5 md:h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-75 ${
                nitroPct > 50
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                  : 'bg-amber-600'
              }`}
              style={{ width: `${Math.min(100, nitroPct)}%` }}
            />
          </div>

          {/* Touch Nitro Trigger for mobile */}
          <button
            onTouchStart={() => onNitroTouch(true)}
            onTouchEnd={() => onNitroTouch(false)}
            onMouseDown={() => onNitroTouch(true)}
            onMouseUp={() => onNitroTouch(false)}
            aria-label="Nitro aktivieren"
            className="mt-1 sm:hidden px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white font-race text-[9px] font-bold active:scale-95 shadow-md"
          >
            BOOST 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
