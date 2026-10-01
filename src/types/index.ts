export type Role = 'admin' | 'guru' | 'siswa';

export interface User {
  id: string;
  username: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
  relatedId?: string; // id of guru or siswa
}

export type Jurusan = 'RPL' | 'TKJ' | 'AKL' | 'OTKP' | 'BDP';

export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  kelasId: string;
  kelasNama: string;
  jurusan: Jurusan;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  alamat: string;
  noHp: string;
  namaWali: string;
  noHpWali: string;
  status: 'Aktif' | 'Alumni' | 'Pindah';
}

export interface Guru {
  id: string;
  nip: string;
  nama: string;
  gelar: string;
  jenisKelamin: 'L' | 'P';
  email: string;
  noHp: string;
  mapelUtama: string;
  waliKelas?: string; // e.g. "X RPL 1"
  pendidikanTerakhir: string;
  statusKepegawaian: 'GTY' | 'GTT' | 'PNS DPK';
}

export interface Kelas {
  id: string;
  nama: string; // e.g. "X RPL 1", "XI TKJ 2"
  tingkat: 'X' | 'XI' | 'XII';
  jurusan: Jurusan;
  waliKelasId: string;
  waliKelasNama: string;
  ruang: string;
  kapasitas: number;
}

export interface MataPelajaran {
  id: string;
  kode: string;
  nama: string;
  kelompok: 'A - Muatan Nasional' | 'B - Muatan Kewilayahan' | 'C1 - Dasar Bidang Keahlian' | 'C2 - Dasar Program Keahlian' | 'C3 - Kompetensi Keahlian';
  jurusanTerkait?: Jurusan | 'Semua';
  kkm: number;
  jamPerMinggu: number;
  guruPengampuId: string;
  guruPengampuNama: string;
}

export interface JadwalPelajaran {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  jamMulai: string; // "07:30"
  jamSelesai: string; // "09:00"
  jamKe: string; // "1 - 2"
  kelasId: string;
  kelasNama: string;
  mapelId: string;
  mapelNama: string;
  guruId: string;
  guruNama: string;
  ruangan: string;
}

export type StatusAbsensi = 'H' | 'S' | 'I' | 'A'; // Hadir, Sakit, Izin, Alpa

export interface PresensiRecord {
  siswaId: string;
  status: StatusAbsensi;
  catatan?: string;
}

export interface AbsensiHarian {
  id: string;
  tanggal: string; // "YYYY-MM-DD"
  kelasId: string;
  records: PresensiRecord[];
}

export interface NilaiSiswa {
  id: string;
  siswaId: string;
  siswaNama: string;
  kelasId: string;
  mapelId: string;
  mapelNama: string;
  semester: 'Ganjil' | 'Genap';
  tahunAjaran: string; // "2025/2026"
  nilaiTugas: number; // 30%
  nilaiUTS: number;   // 30%
  nilaiUAS: number;   // 40%
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
  keterangan: 'Tuntas' | 'Remedial';
  catatanGuru?: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  kategori: 'Akademik' | 'Kegiatan' | 'Ujian' | 'Libur' | 'Kejuruan';
  targetAudience: 'Semua' | 'Guru' | 'Siswa';
  tanggal: string;
  penulis: string;
  konten: string;
  isImportant?: boolean;
}

export interface LaravelCodeFile {
  id: string;
  name: string;
  path: string;
  category: 'Migration' | 'Model' | 'Controller' | 'Route' | 'Config' | 'Panduan';
  language: 'php' | 'sql' | 'bash' | 'markdown';
  content: string;
  description: string;
}
