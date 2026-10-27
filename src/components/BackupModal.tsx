import React, { useRef } from 'react';
import { MotorUnit } from '../types/motor';
import { saveUnits, resetToSeedData } from '../utils/storage';
import { X, Download, Upload, RotateCcw } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  units: MotorUnit[];
  onDataRestored: (units: MotorUnit[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  units,
  onDataRestored,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(units, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `motorku-backup-${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          if (confirm(`Ditemukan ${parsed.length} data unit. Pulihkan data ini dan timpa data saat ini?`)) {
            saveUnits(parsed);
            onDataRestored(parsed);
            alert('Data berhasil dipulihkan!');
            onClose();
          }
        } else {
          alert('Format file JSON tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON: ' + (err instanceof Error ? err.message : 'Error'));
      }
    };
    reader.readAsText(file);
  };

  const handleResetSeed = () => {
    if (confirm('Kembalikan ke data contoh default? Semua data baru yang dibuat akan direset.')) {
      const reset = resetToSeedData();
      onDataRestored(reset);
      alert('Data telah dikembalikan ke contoh awal.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="luxury-card bg-[#0d1424] border border-amber-500/30 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="gold-gradient-text">Cadangkan &amp; Pulihkan Data</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simpan berkas offline agar data Motorku Anda selalu aman
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 space-y-4">
          {/* Export */}
          <div className="p-4 border border-slate-800 rounded-xl bg-slate-900/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Unduh Cadangan (JSON)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simpan {units.length} unit motor ke berkas offline
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 border border-slate-800 rounded-xl bg-slate-900/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Pulihkan dari Berkas</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Unggah berkas cadangan JSON
              </p>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Impor</span>
              </button>
            </div>
          </div>

          {/* Reset Demo */}
          <div className="p-4 border border-rose-950/60 rounded-xl bg-rose-950/20 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-semibold text-rose-300">Muat Ulang Data Sampel</h3>
              <p className="text-[11px] text-rose-400/80 mt-0.5">
                Kembali ke 5 data contoh bawaan
              </p>
            </div>
            <button
              onClick={handleResetSeed}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-rose-300 bg-rose-950/40 border border-rose-800/60 hover:bg-rose-900/40 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
