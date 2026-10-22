import React, { useState } from 'react';
import { Trophy, Medal, Flame, Zap, Check, User, X } from 'lucide-react';
import { LeaderboardEntry } from '../game/racingRules';

interface LeaderboardModalProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  onClose: () => void;
  onUpdateUserName: (newName: string) => void;
  currentUserName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  entries,
  currentUserId,
  onClose,
  onUpdateUserName,
  currentUserName
}) => {
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUserName);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border-2 border-amber-500/80 p-6 shadow-2xl text-white animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <h2 className="font-race text-lg font-black tracking-wider text-white">
                GLOBALE AUTOBAHN RANGLISTE
              </h2>
              <p className="text-xs text-slate-400 font-hud">
                Schüler-Fortschritt & Vokabel-Meisterschaft weltweit
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

        {/* User Profile Bar */}
        <div className="my-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl">
              🏎️
            </div>
            <div>
              <span className="text-[10px] uppercase font-hud text-slate-400 block">Dein Fahrer-Profil</span>
              {!editingName ? (
                <div className="flex items-center gap-2">
                  <span className="font-race font-bold text-white text-sm">{currentUserName}</span>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-[11px] text-cyan-400 hover:underline font-hud cursor-pointer"
                  >
                    (Ändern)
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-white font-hud text-xs outline-none"
                    maxLength={20}
                  />
                  <button
                    type="submit"
                    className="p-1 bg-cyan-600 hover:bg-cyan-500 rounded text-white cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-hud text-slate-400 block uppercase">Schule</span>
            <span className="text-xs font-hud text-amber-400 font-bold">Salahaldin School (SIS)</span>
          </div>
        </div>

        {/* Scrollable Leaderboard Table */}
        <div className="overflow-y-auto flex-1 pr-1 space-y-2">
          {entries.map((entry, idx) => {
            const isUser = entry.id === currentUserId;
            const rank = idx + 1;
            const rankBadge =
              rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isUser
                    ? 'bg-amber-500/10 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                {/* Rank & Student Info */}
                <div className="flex items-center gap-3">
                  <span className="font-race font-bold text-base w-8 text-center text-amber-400">
                    {rankBadge}
                  </span>
                  <span className="text-xl">{entry.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-race text-sm font-bold ${isUser ? 'text-amber-300' : 'text-white'}`}>
                        {entry.name}
                      </span>
                      {isUser && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-hud bg-amber-500/20 text-amber-300 font-bold">
                          DU
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-hud text-slate-400 block">
                      {entry.school}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-right">
                  {/* Streak */}
                  <div className="hidden sm:flex flex-col items-center">
                    <div className="flex items-center gap-0.5 text-xs font-hud text-amber-400 font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{entry.streakDays}d</span>
                    </div>
                    <span className="text-[9px] font-hud text-slate-500 uppercase">Serie</span>
                  </div>

                  {/* Accuracy */}
                  <div className="flex flex-col items-end">
                    <span className="font-hud text-xs font-bold text-emerald-400">
                      {entry.accuracy}%
                    </span>
                    <span className="text-[9px] font-hud text-slate-500 uppercase">Aussprache</span>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col items-end min-w-[70px]">
                    <span className="font-race text-sm md:text-base font-black text-amber-400 tabular-nums">
                      {entry.score}
                    </span>
                    <span className="text-[9px] font-hud text-slate-500 uppercase">Punkte</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-hud text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Zurück zur Rennstrecke
          </button>
        </div>
      </div>
    </div>
  );
};
