import { MotorUnit } from '../types/motor';
import { toISODateString } from './calculations';

const STORAGE_KEY = 'motorku_data_v1';

// Generate sample seed data relative to current date
function getInitialSeedData(): MotorUnit[] {
  const now = new Date();

  // Unit 1: Jatuh tempo H-0 (Hari Ini)
  const d30 = new Date(now);
  d30.setDate(d30.getDate() - 30);
  const dueToday = new Date(now);

  // Unit 2: Jatuh tempo H-1 (Besok)
  const d29 = new Date(now);
  d29.setDate(d29.getDate() - 29);
  const dueTomorrow = new Date(now);
  dueTomorrow.setDate(dueTomorrow.getDate() + 1);

  // Unit 3: Jatuh tempo H-2 (Lusa / 2 Hari Lagi)
  const d28 = new Date(now);
  d28.setDate(d28.getDate() - 28);
  const dueLusa = new Date(now);
  dueLusa.setDate(dueLusa.getDate() + 2);

  // Unit 4: Overdue / Status Lelang (>90 hari tanpa bayar)
  const d100 = new Date(now);
  d100.setDate(d100.getDate() - 100);
  const dueOverdue = new Date(now);
  dueOverdue.setDate(dueOverdue.getDate() - 70);

  // Unit 5: Lunas
  const d20 = new Date(now);
  d20.setDate(d20.getDate() - 19);
  const lunas2DaysAgo = new Date(now);
  lunas2DaysAgo.setDate(lunas2DaysAgo.getDate() - 2);

  return [
    {
      id: 'unit-001',
      no_struk: 'MK-2024-001',
      tanggal_masuk: toISODateString(d30),
      jenis_motor: 'Honda Vario 160 CBS',
      nama_pemilik: 'Budi Santoso',
      no_whatsapp: '081234567890',
      tahun: 2023,
      nopol: 'B 3456 KLT',
      jasa_parkir: 5000,
      nominal_pokok: 3500000,
      pemilik_dana: 'Pribadi',
      tanggal_jatuh_tempo: toISODateString(dueToday), // H-0 Hari Ini
      pemasukan_detail: [
        {
          id: 'pay-001-1',
          tanggal: toISODateString(new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)),
          jumlah: 50000,
          catatan: 'Cicilan jasa parkir minggu 2',
        },
      ],
      status: 'Parkir',
      created_at: d30.toISOString(),
      updated_at: now.toISOString(),
      catatan: 'BPKB asli dititipkan, kunci kontak 2 pcs.',
    },
    {
      id: 'unit-002',
      no_struk: 'MK-2024-002',
      tanggal_masuk: toISODateString(d29),
      jenis_motor: 'Honda Scoopy Prestige',
      nama_pemilik: 'Dewi Lestari',
      no_whatsapp: '081298765432',
      tahun: 2023,
      nopol: 'B 4821 SYZ',
      jasa_parkir: 5000,
      nominal_pokok: 2800000,
      pemilik_dana: 'Mamah',
      tanggal_jatuh_tempo: toISODateString(dueTomorrow), // H-1 Besok
      pemasukan_detail: [],
      status: 'Parkir',
      created_at: d29.toISOString(),
      updated_at: now.toISOString(),
      catatan: 'STNK asli dan kunci remote cadangan.',
    },
    {
      id: 'unit-003',
      no_struk: 'MK-2024-003',
      tanggal_masuk: toISODateString(d28),
      jenis_motor: 'Yamaha Aerox 155 VVA',
      nama_pemilik: 'Rian Ardiansyah',
      no_whatsapp: '081988776655',
      tahun: 2022,
      nopol: 'B 1289 EFG',
      jasa_parkir: 10000,
      nominal_pokok: 4000000,
      pemilik_dana: 'Pecel',
      tanggal_jatuh_tempo: toISODateString(dueLusa), // H-2 (2 Hari Lagi)
      pemasukan_detail: [
        {
          id: 'pay-003-1',
          tanggal: toISODateString(new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)),
          jumlah: 100000,
          catatan: 'Titipan jasa parkir tahap 1',
        },
      ],
      status: 'Parkir',
      created_at: d28.toISOString(),
      updated_at: now.toISOString(),
      catatan: 'Kondisi mulus, spion original lengkap.',
    },
    {
      id: 'unit-004',
      no_struk: 'MK-2024-004',
      tanggal_masuk: toISODateString(d100),
      jenis_motor: 'Yamaha NMAX 155 Connected',
      nama_pemilik: 'Agus Setiawan',
      no_whatsapp: '085711223344',
      tahun: 2022,
      nopol: 'D 6789 ZX',
      jasa_parkir: 10000,
      nominal_pokok: 5000000,
      pemilik_dana: 'Mamah',
      tanggal_jatuh_tempo: toISODateString(dueOverdue), // Lewat Tempo
      pemasukan_detail: [], // > 90 hari tanpa bayar -> Lelang otomatis
      status: 'Parkir',
      created_at: d100.toISOString(),
      updated_at: now.toISOString(),
      catatan: 'Pemilik belum bisa dihubungi sejak bulan ke-2.',
    },
    {
      id: 'unit-005',
      no_struk: 'MK-2024-005',
      tanggal_masuk: toISODateString(d20),
      jenis_motor: 'Vespa Sprint 150 i-Get ABS',
      nama_pemilik: 'Doni Prasetyo',
      no_whatsapp: '081399881122',
      tahun: 2023,
      nopol: 'B 5500 VSP',
      jasa_parkir: 15000,
      nominal_pokok: 7000000,
      pemilik_dana: 'Pribadi',
      pemasukan_detail: [
        {
          id: 'pay-005-1',
          tanggal: toISODateString(lunas2DaysAgo),
          jumlah: 300000,
          catatan: 'Pelunasan seluruh jasa parkir',
        },
      ],
      status: 'Lunas',
      tanggal_lunas: lunas2DaysAgo.toISOString(),
      created_at: d20.toISOString(),
      updated_at: lunas2DaysAgo.toISOString(),
      catatan: 'Sudah ditebus lunas.',
    },
  ];
}

export function loadUnits(): MotorUnit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialSeedData();
      saveUnits(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    const initial = getInitialSeedData();
    saveUnits(initial);
    return initial;
  } catch (err) {
    console.error('Failed to load Motorku units:', err);
    return getInitialSeedData();
  }
}

export function saveUnits(units: MotorUnit[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(units));
  } catch (err) {
    console.error('Failed to save Motorku units:', err);
  }
}

export function resetToSeedData(): MotorUnit[] {
  const initial = getInitialSeedData();
  saveUnits(initial);
  return initial;
}
