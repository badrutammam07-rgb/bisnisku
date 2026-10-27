import React from 'react';
import { Plus, Database, Bell, Volume2, Sparkles } from 'lucide-react';
import { playLuxuryChime } from '../utils/sound';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  totalActiveUnits: number;
  totalDueAlerts: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenBackupModal,
  totalActiveUnits,
  totalDueAlerts,
  soundEnabled,
  onToggleSound,
}) => {
  const handleTestChime = () => {
    playLuxuryChime();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0b101b]/90 backdrop-blur-md border-b border-amber-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-6">
          {/* Zone 1: Single text wordmark with luxury golden sheen */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <a href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span className="gold-gradient-text">MOTORKU</span>
                </a>
                <span className="hidden sm:inline-block text-[11px] font-mono-numbers px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-md">
                  {totalActiveUnits} Unit Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Zone 2: Navigation & Notification Gadget Audio Control */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
            <button
              onClick={handleTestChime}
              title="Klik untuk menguji bunyi notifikasi bel di perangkat"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-lg text-slate-200 transition-all cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Tes Bunyi Notifikasi</span>
            </button>

            <button
              onClick={onToggleSound}
              title="Aktifkan / Matikan suara notifikasi otomatis"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Suara: {soundEnabled ? 'Aktif' : 'Mute'}</span>
            </button>

            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Cadangan Data</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action & Mobile Quick Audio */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleTestChime}
              title="Uji Bunyi Gadget"
              className="md:hidden p-2 text-amber-400 bg-slate-900 border border-amber-500/30 rounded-lg"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenBackupModal}
              title="Cadangan Data"
              className="md:hidden p-2 text-slate-300 bg-slate-900 border border-slate-800 rounded-lg"
            >
              <Database className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/25 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Input Data Baru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
