import React from 'react';
import { Car, Zap, Gauge, Shield, Lock, Check, X } from 'lucide-react';
import { AVAILABLE_CARS, CarModel } from '../game/racingRules';

interface GarageModalProps {
  currentCar: CarModel;
  onSelectCar: (car: CarModel) => void;
  onClose: () => void;
  totalStarsEarned: number;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  currentCar,
  onSelectCar,
  onClose,
  totalStarsEarned
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 select-none">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border-2 border-cyan-500/80 p-6 shadow-2xl text-white animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Car className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="font-race text-lg font-black tracking-wider text-white">
                AUTOBAHN GARAGE
              </h2>
              <p className="text-xs text-slate-400 font-hud">
                Wähle deinen Hochgeschwindigkeits-Rennwagen
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-hud text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <span>⭐ {totalStarsEarned} Sterne gesammelt</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Schließen"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 overflow-y-auto flex-1 pr-1">
          {AVAILABLE_CARS.map((car) => {
            const isSelected = car.id === currentCar.id;
            const isUnlocked = car.unlockedByDefault || totalStarsEarned >= car.requiredStars;

            return (
              <div
                key={car.id}
                onClick={() => isUnlocked && onSelectCar(car)}
                className={`relative p-4 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : isUnlocked
                    ? 'bg-slate-950/80 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    : 'bg-slate-950/40 border-slate-900 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Car Preview Canvas / Graphic */}
                <div className="relative h-24 rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden mb-3 border border-slate-800">
                  {/* Stylized Vehicle Silhouette */}
                  <div
                    className="w-24 h-12 rounded-xl transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${car.color}, ${car.accentColor})`,
                      boxShadow: isSelected ? `0 0 20px ${car.accentColor}` : 'none'
                    }}
                  />
                  {!isUnlocked && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1">
                      <Lock className="w-5 h-5 text-amber-400" />
                      <span className="text-[10px] font-hud text-amber-300 font-bold">
                        Benötigt {car.requiredStars} ⭐
                      </span>
                    </div>
                  )}
                </div>

                {/* Car Title & Details */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-race text-sm font-bold text-white">{car.name}</h3>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-hud text-cyan-400 font-bold">
                        <Check className="w-3.5 h-3.5" /> AKTIV
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-hud mb-3 leading-snug">
                    {car.description}
                  </p>
                </div>

                {/* Performance Specs */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] font-hud">
                  {/* Top Speed */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-cyan-400" /> V-Max
                    </span>
                    <span className="font-bold text-cyan-300 tabular-nums">{car.topSpeed} km/h</span>
                  </div>
                  {/* Acceleration */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" /> Beschleunigung
                    </span>
                    <span className="font-bold text-amber-300">{(car.acceleration * 100).toFixed(0)}%</span>
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
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-hud text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Auswahl bestätigen
          </button>
        </div>
      </div>
    </div>
  );
};
