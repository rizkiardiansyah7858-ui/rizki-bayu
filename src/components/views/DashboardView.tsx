import React from 'react';
import { User, Siswa, Guru, Kelas, JadwalPelajaran, Pengumuman, NilaiSiswa } from '../../types';
import {
  GraduationCap,
  Users,
  Building2,
  CalendarCheck,
  Megaphone,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  ClipboardCheck,
  Calendar,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface DashboardViewProps {
  currentUser: User;
  siswaList: Siswa[];
  guruList: Guru[];
  kelasList: Kelas[];
  jadwalList: JadwalPelajaran[];
  pengumumanList: Pengumuman[];
  nilaiList: NilaiSiswa[];
  onNavigate: (view: string) => void;
  onSelectPengumuman: (item: Pengumuman) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  siswaList,
  guruList,
  kelasList,
  jadwalList,
  pengumumanList,
  nilaiList,
  onNavigate,
  onSelectPengumuman,
}) => {
  const totalSiswa = siswaList.filter(s => s.status === 'Aktif').length;
  const totalGuru = guruList.length;
  const totalKelas = kelasList.length;

  // Distribution by major
  const jurusanStats = [
    { name: 'RPL', label: 'Rekayasa Perangkat Lunak', count: siswaList.filter(s => s.jurusan === 'RPL').length, color: 'bg-emerald-500' },
    { name: 'TKJ', label: 'Teknik Komputer & Jaringan', count: siswaList.filter(s => s.jurusan === 'TKJ').length, color: 'bg-blue-500' },
    { name: 'AKL', label: 'Akuntansi & Keuangan Lembaga', count: siswaList.filter(s => s.jurusan === 'AKL').length, color: 'bg-amber-500' },
    { name: 'OTKP', label: 'Otomatisasi Tata Kelola Perkantoran', count: siswaList.filter(s => s.jurusan === 'OTKP').length, color: 'bg-purple-500' },
    { name: 'BDP', label: 'Bisnis Daring & Pemasaran', count: siswaList.filter(s => s.jurusan === 'BDP').length, color: 'bg-rose-500' },
  ];

  // Today's schedule (e.g. Senin)
  const todaySchedules = jadwalList.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/40 p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
            <span>SIAKAD SMK ISLAMIYAH CIPUTAT</span>
            <span>·</span>
            <span>SEMESTER GANJIL 2025/2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">
            Selamat Datang, {currentUser.name}
          </h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Portal operasional terpadu manajemen data siswa, tenaga pendidik, jadwal pelajaran, presensi harian, penilaian rapor, dan pengumuman resmi lingkungan sekolah.
          </p>

          {/* Quick Action buttons */}
          <div className="mt-4 flex flex-wrap gap-2.5">
            {currentUser.role === 'admin' && (
              <>
                <button
                  onClick={() => onNavigate('siswa')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Tambah Data Siswa</span>
                </button>
                <button
                  onClick={() => onNavigate('absensi')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Input Presensi Kelas</span>
                </button>
              </>
            )}

            {currentUser.role === 'guru' && (
              <>
                <button
                  onClick={() => onNavigate('absensi')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Catat Kehadiran Hari Ini</span>
                </button>
                <button
                  onClick={() => onNavigate('nilai')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Input Nilai Rapor</span>
                </button>
              </>
            )}

            {currentUser.role === 'siswa' && (
              <>
                <button
                  onClick={() => onNavigate('nilai')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Lihat E-Rapor Saya</span>
                </button>
                <button
                  onClick={() => onNavigate('jadwal')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cek Jadwal Pelajaran</span>
                </button>
              </>
            )}

            <button
              onClick={() => onNavigate('laravel-docs')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors"
            >
              <span>Lihat Struktur & Kode Laravel</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Total Siswa Aktif</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-zinc-100">
            {totalSiswa}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 flex items-center gap-1">
            <span className="text-emerald-400">100%</span>
            <span>terdata di sistem Dapodik</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Tenaga Pendidik / Guru</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-zinc-100">
            {totalGuru}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Guru Tetap Yayasan (GTY) & GTT
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Rombongan Belajar (Kelas)</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-zinc-100">
            {totalKelas}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Tingkat X, XI, dan XII Kejuruan
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 transition-colors">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium">Rata-rata Presensi</span>
            <CalendarCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-zinc-100">
            96.8%
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Tingkat kehadiran minggu ini</span>
          </div>
        </div>
      </div>

      {/* Grid: Vocational Programs & Schedule Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Program Keahlian / Jurusan */}
        <div className="lg:col-span-2 rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100">
                Kompetensi Keahlian SMK Islamiyah
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Distribusi jumlah peserta didik per bidang peminatan kejuruan
              </p>
            </div>
            <button
              onClick={() => onNavigate('siswa')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Kelola Siswa →
            </button>
          </div>

          <div className="space-y-3.5">
            {jurusanStats.map((j) => {
              const percentage = totalSiswa > 0 ? Math.round((j.count / totalSiswa) * 100) : 0;
              return (
                <div key={j.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-200">
                      {j.name} <span className="text-zinc-500 font-normal">· {j.label}</span>
                    </span>
                    <span className="font-mono tabular-nums text-zinc-400">
                      {j.count} Siswa ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${j.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick info footer */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kurikulum Merdeka & Vokasi Industri Berbasis Karakter Islami</span>
            </span>
            <span className="font-mono text-zinc-500">Akreditasi A</span>
          </div>
        </div>

        {/* Right: Pengumuman Terkini */}
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-zinc-100">
                Pengumuman Sekolah
              </h3>
            </div>
            <button
              onClick={() => onNavigate('pengumuman')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Semua →
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {pengumumanList.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPengumuman(item)}
                className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/70 hover:border-zinc-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-mono text-emerald-400">{item.kategori}</span>
                  <span className="text-zinc-500">{item.tanggal}</span>
                </div>
                <h4 className="text-xs font-medium text-zinc-200 group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {item.judul}
                </h4>
                <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {item.konten}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Today's Teaching & Learning Schedule */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Jadwal Pembelajaran Hari Ini
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Kegiatan belajar mengajar aktif di ruang teori dan laboratorium kejuruan
            </p>
          </div>
          <button
            onClick={() => onNavigate('jadwal')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Lihat Jadwal Lengkap →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                <th className="pb-2.5 font-medium">Jam & Hari</th>
                <th className="pb-2.5 font-medium">Kelas</th>
                <th className="pb-2.5 font-medium">Mata Pelajaran</th>
                <th className="pb-2.5 font-medium">Guru Pengampu</th>
                <th className="pb-2.5 font-medium">Ruang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {todaySchedules.map((j) => (
                <tr key={j.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 font-mono text-emerald-400">
                    {j.jamMulai} - {j.jamSelesai} (Jam {j.jamKe})
                  </td>
                  <td className="py-3 font-semibold text-zinc-200">{j.kelasNama}</td>
                  <td className="py-3 font-medium text-zinc-100">{j.mapelNama}</td>
                  <td className="py-3 text-zinc-400">{j.guruNama}</td>
                  <td className="py-3 font-mono text-zinc-400">{j.ruangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
