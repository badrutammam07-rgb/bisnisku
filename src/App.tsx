import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MotorUnit, ComputedMotorUnit, StatusFilter, TempoFilter, PaymentEntry } from './types/motor';
import { loadUnits, saveUnits } from './utils/storage';
import { computeUnit } from './utils/calculations';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { TempoShortcutBar } from './components/TempoShortcutBar';
import { UnitTable } from './components/UnitTable';
import { AddUnitModal } from './components/AddUnitModal';
import { EditUnitModal } from './components/EditUnitModal';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { ConfirmLunasModal } from './components/ConfirmLunasModal';
import { BackupModal } from './components/BackupModal';
import { playLuxuryChime, playUrgentAlert, triggerDeviceNotification } from './utils/sound';

export default function App() {
  const [units, setUnits] = useState<MotorUnit[]>(() => loadUnits());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('aktif');
  const [tempoFilter, setTempoFilter] = useState<TempoFilter>('semua');
  const [selectedPemilikDana, setSelectedPemilikDana] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<MotorUnit | null>(null);
  const [paymentUnit, setPaymentUnit] = useState<ComputedMotorUnit | null>(null);
  const [receiptUnit, setReceiptUnit] = useState<ComputedMotorUnit | null>(null);
  const [lunasUnit, setLunasUnit] = useState<ComputedMotorUnit | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Compute all units with dynamic business rules
  const computedUnits = useMemo(() => {
    return units.map((u) => computeUnit(u));
  }, [units]);

  // Keep paymentUnit and receiptUnit up to date
  const activeReceiptUnit = useMemo(() => {
    if (!receiptUnit) return null;
    return computedUnits.find((u) => u.id === receiptUnit.id) || receiptUnit;
  }, [computedUnits, receiptUnit]);

  const activePaymentUnit = useMemo(() => {
    if (!paymentUnit) return null;
    return computedUnits.find((u) => u.id === paymentUnit.id) || paymentUnit;
  }, [computedUnits, paymentUnit]);

  // Handle Add Unit
  const handleAddUnit = (newUnit: MotorUnit) => {
    const updated = [newUnit, ...units];
    setUnits(updated);
    saveUnits(updated);
  };

  // Handle Edit Unit
  const handleUpdateUnit = (updatedUnit: MotorUnit) => {
    const updated = units.map((u) => (u.id === updatedUnit.id ? updatedUnit : u));
    setUnits(updated);
    saveUnits(updated);
  };

  // Handle Update Payments
  const handleUpdatePayments = (unitId: string, payments: PaymentEntry[]) => {
    const updated = units.map((u) => {
      if (u.id === unitId) {
        return {
          ...u,
          pemasukan_detail: payments,
          updated_at: new Date().toISOString(),
        };
      }
      return u;
    });
    setUnits(updated);
    saveUnits(updated);
  };

  // Handle Mark Lunas
  const handleConfirmLunas = (unitId: string) => {
    const nowIso = new Date().toISOString();
    const updated = units.map((u) => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'Lunas' as const,
          tanggal_lunas: nowIso,
          updated_at: nowIso,
        };
      }
      return u;
    });
    setUnits(updated);
    saveUnits(updated);
  };

  // Handle Delete Unit
  const handleDeleteUnit = (unitId: string) => {
    const updated = units.filter((u) => u.id !== unitId);
    setUnits(updated);
    saveUnits(updated);
  };

  // Handle Data Restored
  const handleDataRestored = (restored: MotorUnit[]) => {
    setUnits(restored);
  };

  const totalActiveUnits = computedUnits.filter((u) => !u.is_expired_lunas).length;
  const countH0 = computedUnits.filter((u) => !u.is_expired_lunas && u.status !== 'Lunas' && u.kategori_tempo === 'H-0').length;
  const countH1 = computedUnits.filter((u) => !u.is_expired_lunas && u.status !== 'Lunas' && u.kategori_tempo === 'H-1').length;
  const countH2 = computedUnits.filter((u) => !u.is_expired_lunas && u.status !== 'Lunas' && u.kategori_tempo === 'H-2').length;
  const totalDueAlerts = countH0 + countH1 + countH2;

  // Sound alert on initial load or user activation
  const soundPlayedRef = useRef(false);
  useEffect(() => {
    if (!soundPlayedRef.current && soundEnabled && totalDueAlerts > 0) {
      soundPlayedRef.current = true;
      // Slight delay so audio context initializes with browser user gesture
      const timer = setTimeout(() => {
        if (countH0 > 0) {
          playUrgentAlert();
          triggerDeviceNotification(
            'Motorku - Pengingat Jatuh Tempo Hari Ini (H-0)',
            `Terdapat ${countH0} unit motor yang jatuh tempo hari ini. Mohon lakukan pengecekan.`
          );
        } else {
          playLuxuryChime();
        }
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [soundEnabled, totalDueAlerts, countH0]);

  return (
    <div className="min-h-screen flex flex-col text-slate-100">
      {/* Luxury Top Bar Header with audio controls */}
      <Header
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        totalActiveUnits={totalActiveUnits}
        totalDueAlerts={totalDueAlerts}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial & Operational Summary Cards */}
        <SummaryCards
          units={computedUnits}
          selectedPemilikDana={selectedPemilikDana}
          onSelectPemilikDana={(pemilik) => setSelectedPemilikDana(pemilik)}
          onFilterLelang={() => setStatusFilter('Lelang')}
        />

        {/* Shortcut Bar for H-2 to H-0 Due Dates with Audio Alert */}
        <TempoShortcutBar
          units={computedUnits}
          activeTempoFilter={tempoFilter}
          onSelectTempoFilter={(filter) => setTempoFilter(filter)}
        />

        {/* Unit Data Table */}
        <UnitTable
          units={computedUnits}
          statusFilter={statusFilter}
          onChangeStatusFilter={(status) => setStatusFilter(status)}
          tempoFilter={tempoFilter}
          selectedPemilikDana={selectedPemilikDana}
          onChangePemilikDana={(pemilik) => setSelectedPemilikDana(pemilik)}
          onOpenReceipt={(unit) => setReceiptUnit(unit)}
          onOpenPayments={(unit) => setPaymentUnit(unit)}
          onOpenEdit={(unit) => setEditingUnit(unit)}
          onOpenLunasConfirm={(unit) => setLunasUnit(unit)}
          onDeleteUnit={handleDeleteUnit}
        />
      </main>

      {/* Luxury Footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 bg-[#080c14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
          <p className="font-mono-numbers">
            &copy; {new Date().getFullYear()} <span className="gold-gradient-text font-bold">MOTORKU</span> &mdash; Sistem Manajemen Penitipan, Parkir &amp; Pembiayaan Gadai Motor.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AddUnitModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddUnit={handleAddUnit}
        existingCount={units.length}
      />

      <EditUnitModal
        isOpen={!!editingUnit}
        unit={editingUnit}
        onClose={() => setEditingUnit(null)}
        onUpdateUnit={handleUpdateUnit}
      />

      <PaymentModal
        isOpen={!!activePaymentUnit}
        unit={activePaymentUnit}
        onClose={() => setPaymentUnit(null)}
        onUpdatePayments={handleUpdatePayments}
      />

      <ReceiptModal
        isOpen={!!activeReceiptUnit}
        unit={activeReceiptUnit}
        onClose={() => setReceiptUnit(null)}
      />

      <ConfirmLunasModal
        isOpen={!!lunasUnit}
        unit={lunasUnit}
        onClose={() => setLunasUnit(null)}
        onConfirmLunas={handleConfirmLunas}
      />

      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        units={units}
        onDataRestored={handleDataRestored}
      />
    </div>
  );
}
