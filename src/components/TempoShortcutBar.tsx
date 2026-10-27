import React from 'react';
import { ComputedMotorUnit, TempoFilter } from '../types/motor';
import { Bell, Clock, Calendar, AlertOctagon, CheckCircle2, Volume2 } from 'lucide-react';
import { playLuxuryChime, playUrgentAlert } from '../utils/sound';

interface TempoShortcutBarProps {
  units: ComputedMotorUnit[];
  activeTempoFilter: TempoFilter;
  onSelectTempoFilter: (filter: TempoFilter) => void;
}

export const TempoShortcutBar: React.FC<TempoShortcutBarProps> = ({
  units,
  activeTempoFilter,
  onSelectTempoFilter,
}) => {
  // Only consider active units
  const activeUnits = units.filter((u) => !u.is_expired_lunas && u.status !== 'Lunas');

  const countH0 = activeUnits.filter((u) => u.kategori_tempo === 'H-0').length;
  const countH1 = activeUnits.filter((u) => u.kategori_tempo === 'H-1').length;
  const countH2 = activeUnits.filter((u) => u.kategori_tempo === 'H-2').length;
  const countLewat = activeUnits.filter((u) => u.kategori_tempo === 'Lewat').length;

  const totalImpending = countH0 + countH1 + countH2;

  const handleRing = () => {
    if (countH0 > 0 || countLewat > 0) {
      playUrgentAlert();
    } else {
      playLuxuryChime();
    }
  };

  return (
    <div className="mb-6 p-4 rounded-xl luxury-card border border-amber-500/25 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & sound status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/30 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Bell className={`w-5 h-5 ${totalImpending > 0 ? 'animate-bounce text-amber-300' : ''}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Shortcut Pengingat Jatuh Tempo (H-2 s/d H-0)
              </h3>
              {totalImpending > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full font-mono-numbers">
                  {totalImpending} Unit Perlu Perhatian
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter cepat jadwal jatuh tempo dan aktifkan notifikasi berbunyi otomatis pada perangkat
            </p>
          </div>
        </div>

        {/* Action Button: Ring gadget */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            onClick={handleRing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Bunyikan Bel Notifikasi</span>
          </button>
        </div>
      </div>

      {/* Shortcut Filter Pills: H-2, H-1, H-0, Lewat Tempo */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1">
          Shortcut:
        </span>

        {/* Semua */}
        <button
          onClick={() => onSelectTempoFilter('semua')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTempoFilter === 'semua'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          Semua Jadwal
        </button>

        {/* H-0 Hari Ini */}
        <button
          onClick={() => onSelectTempoFilter('H-0')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTempoFilter === 'H-0'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
              : countH0 > 0
              ? 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping inline-block" />
          <span>H-0 Hari Ini</span>
          <span className="font-mono-numbers px-1.5 py-0.2 bg-black/30 rounded text-[10px]">
            {countH0}
          </span>
        </button>

        {/* H-1 Besok */}
        <button
          onClick={() => onSelectTempoFilter('H-1')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTempoFilter === 'H-1'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : countH1 > 0
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 hover:bg-amber-500/25'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>H-1 Besok</span>
          <span className="font-mono-numbers px-1.5 py-0.2 bg-black/30 rounded text-[10px]">
            {countH1}
          </span>
        </button>

        {/* H-2 Lusa */}
        <button
          onClick={() => onSelectTempoFilter('H-2')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTempoFilter === 'H-2'
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
              : countH2 > 0
              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/40 hover:bg-blue-500/25'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>H-2 (2 Hari Lagi)</span>
          <span className="font-mono-numbers px-1.5 py-0.2 bg-black/30 rounded text-[10px]">
            {countH2}
          </span>
        </button>

        {/* Lewat Tempo */}
        <button
          onClick={() => onSelectTempoFilter('lewat')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTempoFilter === 'lewat'
              ? 'bg-red-700 text-white shadow-md shadow-red-700/30'
              : countLewat > 0
              ? 'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/40'
              : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          <span>Lewat Tempo</span>
          <span className="font-mono-numbers px-1.5 py-0.2 bg-black/30 rounded text-[10px]">
            {countLewat}
          </span>
        </button>
      </div>
    </div>
  );
};
