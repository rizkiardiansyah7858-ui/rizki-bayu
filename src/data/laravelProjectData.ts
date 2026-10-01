import { LaravelCodeFile } from '../types';

export const LARAVEL_PROJECT_STRUCTURE = `smk-islamiyah-sim/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── SiswaController.php
│   │   │   ├── GuruController.php
│   │   │   ├── KelasController.php
│   │   │   ├── MataPelajaranController.php
│   │   │   ├── JadwalController.php
│   │   │   ├── AbsensiController.php
│   │   │   ├── NilaiController.php
│   │   │   └── PengumumanController.php
│   │   └── Middleware/
│   │       ├── CheckRole.php
│   │       └── Authenticate.php
│   └── Models/
│       ├── User.php
│       ├── Siswa.php
│       ├── Guru.php
│       ├── Kelas.php
│       ├── MataPelajaran.php
│       ├── Jadwal.php
│       ├── Absensi.php
│       ├── PresensiDetail.php
│       ├── Nilai.php
│       └── Pengumuman.php
├── config/
│   ├── app.php
│   ├── auth.php
│   └── database.php
├── database/
│   ├── migrations/
│   │   ├── 2026_01_01_000001_create_users_table.php
│   │   ├── 2026_01_01_000002_create_gurus_table.php
│   │   ├── 2026_01_01_000003_create_kelas_table.php
│   │   ├── 2026_01_01_000004_create_siswas_table.php
│   │   ├── 2026_01_01_000005_create_mata_pelajarans_table.php
│   │   ├── 2026_01_01_000006_create_jadwals_table.php
│   │   ├── 2026_01_01_000007_create_absensis_table.php
│   │   ├── 2026_01_01_000008_create_nilais_table.php
│   │   └── 2026_01_01_000009_create_pengumumans_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── resources/
│   ├── css/
│   │   └── app.css  (TailwindCSS modern dark theme)
│   ├── js/
│   │   └── app.js
│   └── views/
│       ├── layouts/
│       │   ├── app.blade.php
│       │   └── sidebar.blade.php
│       ├── auth/
│       │   └── login.blade.php
│       ├── dashboard/
│       │   └── index.blade.php
│       ├── siswa/
│       │   ├── index.blade.php
│       │   ├── create.blade.php
│       │   └── show.blade.php
│       ├── nilai/
│       │   ├── index.blade.php
│       │   └── cetak-rapor.blade.php
│       └── absensi/
│           ├── index.blade.php
│           └── input.blade.php
├── routes/
│   └── web.php
├── .env.example
├── composer.json
├── package.json
└── tailwind.config.js`;

export const LARAVEL_CODE_FILES: LaravelCodeFile[] = [
  {
    id: 'sql-schema',
    name: 'schema.sql (MySQL DDL Lengkap)',
    path: 'database/schema.sql',
    category: 'Migration',
    language: 'sql',
    description: 'Skrip skema MySQL lengkap dengan relasi Foreign Key, index, dan tipe data optimal.',
    content: `-- ========================================================
-- DATABASE SCHEMA: SISTEM INFORMASI AKADEMIK SMK ISLAMIYAH CIPUTAT
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`smk_islamiyah_db\` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE \`smk_islamiyah_db\`;

-- 1. TABEL USERS & OTENTIKASI
CREATE TABLE \`users\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'guru', 'siswa') NOT NULL DEFAULT 'siswa',
  \`remember_token\` VARCHAR(100) NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_users_role\` (\`role\`)
) ENGINE=InnoDB;

-- 2. TABEL GURU & TENAGA PENDIDIK
CREATE TABLE \`gurus\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` BIGINT UNSIGNED NULL,
  \`nip\` VARCHAR(30) NOT NULL UNIQUE,
  \`nama\` VARCHAR(150) NOT NULL,
  \`gelar\` VARCHAR(50) NOT NULL,
  \`jenis_kelamin\` ENUM('L', 'P') NOT NULL,
  \`email\` VARCHAR(100) NOT NULL,
  \`no_hp\` VARCHAR(25) NOT NULL,
  \`pendidikan_terakhir\` VARCHAR(100) NOT NULL,
  \`status_kepegawaian\` ENUM('GTY', 'GTT', 'PNS DPK') NOT NULL DEFAULT 'GTY',
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_guru_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 3. TABEL KELAS
CREATE TABLE \`kelas\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`nama\` VARCHAR(30) NOT NULL UNIQUE, -- Contoh: "X RPL 1", "XI TKJ 1"
  \`tingkat\` ENUM('X', 'XI', 'XII') NOT NULL,
  \`jurusan\` ENUM('RPL', 'TKJ', 'AKL', 'OTKP', 'BDP') NOT NULL,
  \`wali_kelas_id\` BIGINT UNSIGNED NULL,
  \`ruang\` VARCHAR(50) NOT NULL,
  \`kapasitas\` INT UNSIGNED NOT NULL DEFAULT 36,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_kelas_wali\` FOREIGN KEY (\`wali_kelas_id\`) REFERENCES \`gurus\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 4. TABEL SISWA
CREATE TABLE \`siswas\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`user_id\` BIGINT UNSIGNED NULL,
  \`nisn\` VARCHAR(15) NOT NULL UNIQUE,
  \`nis\` VARCHAR(15) NOT NULL UNIQUE,
  \`nama\` VARCHAR(150) NOT NULL,
  \`kelas_id\` BIGINT UNSIGNED NOT NULL,
  \`jurusan\` ENUM('RPL', 'TKJ', 'AKL', 'OTKP', 'BDP') NOT NULL,
  \`jenis_kelamin\` ENUM('L', 'P') NOT NULL,
  \`tempat_lahir\` VARCHAR(100) NOT NULL,
  \`tanggal_lahir\` DATE NOT NULL,
  \`alamat\` TEXT NOT NULL,
  \`no_hp\` VARCHAR(25) NULL,
  \`nama_wali\` VARCHAR(150) NOT NULL,
  \`no_hp_wali\` VARCHAR(25) NOT NULL,
  \`status\` ENUM('Aktif', 'Alumni', 'Pindah') NOT NULL DEFAULT 'Aktif',
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_siswa_user\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL,
  CONSTRAINT \`fk_siswa_kelas\` FOREIGN KEY (\`kelas_id\`) REFERENCES \`kelas\` (\`id\`) ON DELETE RESTRICT,
  INDEX \`idx_siswa_kelas\` (\`kelas_id\`),
  INDEX \`idx_siswa_jurusan\` (\`jurusan\`)
) ENGINE=InnoDB;

-- 5. TABEL MATA PELAJARAN (MAPEL)
CREATE TABLE \`mata_pelajarans\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`kode\` VARCHAR(20) NOT NULL UNIQUE,
  \`nama\` VARCHAR(150) NOT NULL,
  \`kelompok\` ENUM('A - Muatan Nasional', 'B - Muatan Kewilayahan', 'C1 - Dasar Bidang Keahlian', 'C2 - Dasar Program Keahlian', 'C3 - Kompetensi Keahlian') NOT NULL,
  \`jurusan_terkait\` VARCHAR(20) NULL DEFAULT 'Semua',
  \`kkm\` DECIMAL(5,2) NOT NULL DEFAULT 75.00,
  \`jam_per_minggu\` INT UNSIGNED NOT NULL DEFAULT 4,
  \`guru_pengampu_id\` BIGINT UNSIGNED NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_mapel_guru\` FOREIGN KEY (\`guru_pengampu_id\`) REFERENCES \`gurus\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 6. TABEL JADWAL PELAJARAN
CREATE TABLE \`jadwals\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`hari\` ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu') NOT NULL,
  \`jam_mulai\` TIME NOT NULL,
  \`jam_selesai\` TIME NOT NULL,
  \`jam_ke\` VARCHAR(20) NOT NULL,
  \`kelas_id\` BIGINT UNSIGNED NOT NULL,
  \`mata_pelajaran_id\` BIGINT UNSIGNED NOT NULL,
  \`guru_id\` BIGINT UNSIGNED NOT NULL,
  \`ruangan\` VARCHAR(50) NOT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`fk_jadwal_kelas\` FOREIGN KEY (\`kelas_id\`) REFERENCES \`kelas\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_jadwal_mapel\` FOREIGN KEY (\`mata_pelajaran_id\`) REFERENCES \`mata_pelajarans\` (\`id\`) ON DELETE RESTRICT,
  CONSTRAINT \`fk_jadwal_guru\` FOREIGN KEY (\`guru_id\`) REFERENCES \`gurus\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 7. TABEL PRESENSI / ABSENSI
CREATE TABLE \`absensis\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`tanggal\` DATE NOT NULL,
  \`kelas_id\` BIGINT UNSIGNED NOT NULL,
  \`guru_id\` BIGINT UNSIGNED NOT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_absensi_kelas_tanggal\` (\`tanggal\`, \`kelas_id\`),
  CONSTRAINT \`fk_absensi_kelas\` FOREIGN KEY (\`kelas_id\`) REFERENCES \`kelas\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_absensi_guru\` FOREIGN KEY (\`guru_id\`) REFERENCES \`gurus\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE \`absensi_details\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`absensi_id\` BIGINT UNSIGNED NOT NULL,
  \`siswa_id\` BIGINT UNSIGNED NOT NULL,
  \`status\` ENUM('H', 'S', 'I', 'A') NOT NULL DEFAULT 'H', -- Hadir, Sakit, Izin, Alpa
  \`catatan\` VARCHAR(255) NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_detail_absensi_siswa\` (\`absensi_id\`, \`siswa_id\`),
  CONSTRAINT \`fk_detail_absensi\` FOREIGN KEY (\`absensi_id\`) REFERENCES \`absensis\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_detail_siswa\` FOREIGN KEY (\`siswa_id\`) REFERENCES \`siswas\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. TABEL NILAI / RAPOR SISWA
CREATE TABLE \`nilais\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`siswa_id\` BIGINT UNSIGNED NOT NULL,
  \`mata_pelajaran_id\` BIGINT UNSIGNED NOT NULL,
  \`guru_id\` BIGINT UNSIGNED NOT NULL,
  \`semester\` ENUM('Ganjil', 'Genap') NOT NULL DEFAULT 'Ganjil',
  \`tahun_ajaran\` VARCHAR(10) NOT NULL DEFAULT '2025/2026',
  \`nilai_tugas\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  \`nilai_uts\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  \`nilai_uas\` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  \`nilai_akhir\` DECIMAL(5,2) GENERATED ALWAYS AS ((\`nilai_tugas\` * 0.3) + (\`nilai_uts\` * 0.3) + (\`nilai_uas\` * 0.4)) STORED,
  \`predikat\` CHAR(1) NOT NULL DEFAULT 'C',
  \`keterangan\` ENUM('Tuntas', 'Remedial') NOT NULL DEFAULT 'Tuntas',
  \`catatan_guru\` TEXT NULL,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_nilai_siswa_mapel_semester\` (\`siswa_id\`, \`mata_pelajaran_id\`, \`semester\`, \`tahun_ajaran\`),
  CONSTRAINT \`fk_nilai_siswa\` FOREIGN KEY (\`siswa_id\`) REFERENCES \`siswas\` (\`id\`) ON DELETE CASCADE,
  CONSTRAINT \`fk_nilai_mapel\` FOREIGN KEY (\`mata_pelajaran_id\`) REFERENCES \`mata_pelajarans\` (\`id\`) ON DELETE RESTRICT,
  CONSTRAINT \`fk_nilai_guru\` FOREIGN KEY (\`guru_id\`) REFERENCES \`gurus\` (\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 9. TABEL PENGUMUMAN
CREATE TABLE \`pengumumans\` (
  \`id\` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`judul\` VARCHAR(200) NOT NULL,
  \`kategori\` ENUM('Akademik', 'Kegiatan', 'Ujian', 'Libur', 'Kejuruan') NOT NULL,
  \`target_audience\` ENUM('Semua', 'Guru', 'Siswa') NOT NULL DEFAULT 'Semua',
  \`konten\` TEXT NOT NULL,
  \`penulis\` VARCHAR(100) NOT NULL,
  \`is_important\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;`,
  },
  {
    id: 'routes-web',
    name: 'routes/web.php (Routing & Hak Akses RBAC)',
    path: 'routes/web.php',
    category: 'Route',
    language: 'php',
    description: 'Konfigurasi route Laravel dengan proteksi middleware otentikasi dan pengecekan role.',
    content: `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\AuthController;
use App\\Http\\Controllers\\DashboardController;
use App\\Http\\Controllers\\SiswaController;
use App\\Http\\Controllers\\GuruController;
use App\\Http\\Controllers\\KelasController;
use App\\Http\\Controllers\\MataPelajaranController;
use App\\Http\\Controllers\\JadwalController;
use App\\Http\\Controllers\\AbsensiController;
use App\\Http\\Controllers\\NilaiController;
use App\\Http\\Controllers\\PengumumanController;

/*
|--------------------------------------------------------------------------
| Web Routes - SMK ISLAMIYAH CIPUTAT
|--------------------------------------------------------------------------
*/

// Auth Routes (Publik)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->name('login.post');
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Protected Routes (Harus Login)
Route::middleware(['auth'])->group(function () {
    
    // Dashboard (Bisa diakses Admin, Guru, Siswa dengan tampilan terpersonalisasi)
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/pengumuman', [PengumumanController::class, 'index'])->name('pengumuman.index');
    Route::get('/pengumuman/{id}', [PengumumanController::class, 'show'])->name('pengumuman.show');

    // ==========================================
    // AREA ADMIN ONLY (Akses Penuh Master Data)
    // ==========================================
    Route::middleware(['role:admin'])->group(function () {
        // Data Siswa
        Route::resource('siswa', SiswaController::class);
        Route::post('siswa/import', [SiswaController::class, 'importExcel'])->name('siswa.import');
        Route::get('siswa/export/excel', [SiswaController::class, 'exportExcel'])->name('siswa.export');

        // Data Guru
        Route::resource('guru', GuruController::class);

        // Data Kelas
        Route::resource('kelas', KelasController::class);

        // Mata Pelajaran
        Route::resource('mapel', MataPelajaranController::class);

        // Jadwal Pelajaran (Admin can modify master schedule)
        Route::resource('jadwal', JadwalController::class);

        // Pengumuman Management
        Route::resource('pengumuman', PengumumanController::class)->except(['index', 'show']);
    });

    // ==========================================
    // AREA GURU & ADMIN (Input Nilai & Presensi)
    // ==========================================
    Route::middleware(['role:admin,guru'])->group(function () {
        // Absensi Siswa
        Route::get('absensi', [AbsensiController::class, 'index'])->name('absensi.index');
        Route::get('absensi/input/{kelas_id}', [AbsensiController::class, 'create'])->name('absensi.create');
        Route::post('absensi/store', [AbsensiController::class, 'store'])->name('absensi.store');
        Route::get('absensi/rekap/{kelas_id}', [AbsensiController::class, 'rekap'])->name('absensi.rekap');

        // Input & Kelola Nilai Rapor
        Route::get('nilai', [NilaiController::class, 'index'])->name('nilai.index');
        Route::get('nilai/input/{kelas_id}/{mapel_id}', [NilaiController::class, 'inputForm'])->name('nilai.input');
        Route::post('nilai/store-batch', [NilaiController::class, 'storeBatch'])->name('nilai.storeBatch');
    });

    // ==========================================
    // AREA SISWA & WALI MURID (Portal Mandiri)
    // ==========================================
    Route::middleware(['role:siswa,admin,guru'])->group(function () {
        Route::get('rapor/cetak/{siswa_id}', [NilaiController::class, 'cetakRapor'])->name('rapor.cetak');
        Route::get('jadwal-saya', [JadwalController::class, 'jadwalSaya'])->name('jadwal.saya');
        Route::get('absensi-saya', [AbsensiController::class, 'absensiSaya'])->name('absensi.saya');
    });
});`,
  },
  {
    id: 'controller-siswa',
    name: 'SiswaController.php (CRUD Data Siswa)',
    path: 'app/Http/Controllers/SiswaController.php',
    category: 'Controller',
    language: 'php',
    description: 'Controller untuk manajemen data siswa SMK, validasi NISN/NIS, relasi kelas, dan pencarian.',
    content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Siswa;
use App\\Models\\Kelas;
use Illuminate\\Http\\Request;

class SiswaController extends Controller
{
    public function index(Request $request)
    {
        $query = Siswa::with('kelas');

        // Filter berdasarkan pencarian nama / NISN / NIS
        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        // Filter Jurusan
        if ($request->filled('jurusan') && $request->jurusan !== 'Semua') {
            $query->where('jurusan', $request->jurusan);
        }

        // Filter Kelas
        if ($request->filled('kelas_id')) {
            $query->where('kelas_id', $request->kelas_id);
        }

        $siswas = $query->latest()->paginate(15);
        $kelasList = Kelas::orderBy('nama')->get();

        return view('siswa.index', compact('siswas', 'kelasList'));
    }

    public function create()
    {
        $kelasList = Kelas::all();
        return view('siswa.create', compact('kelasList'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|size:10|unique:siswas,nisn',
            'nis' => 'required|string|max:15|unique:siswas,nis',
            'nama' => 'required|string|max:150',
            'kelas_id' => 'required|exists:kelas,id',
            'jurusan' => 'required|in:RPL,TKJ,AKL,OTKP,BDP',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'no_hp' => 'nullable|string|max:25',
            'nama_wali' => 'required|string|max:150',
            'no_hp_wali' => 'required|string|max:25',
            'status' => 'required|in:Aktif,Alumni,Pindah',
        ]);

        Siswa::create($validated);

        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa SMK Islamiyah Ciputat berhasil ditambahkan.');
    }

    public function show(Siswa $siswa)
    {
        $siswa->load(['kelas', 'nilais.mataPelajaran']);
        return view('siswa.show', compact('siswa'));
    }

    public function update(Request $request, Siswa $siswa)
    {
        $validated = $request->validate([
            'nisn' => 'required|string|size:10|unique:siswas,nisn,' . $siswa->id,
            'nis' => 'required|string|max:15|unique:siswas,nis,' . $siswa->id,
            'nama' => 'required|string|max:150',
            'kelas_id' => 'required|exists:kelas,id',
            'jurusan' => 'required|in:RPL,TKJ,AKL,OTKP,BDP',
            'jenis_kelamin' => 'required|in:L,P',
            'tempat_lahir' => 'required|string|max:100',
            'tanggal_lahir' => 'required|date',
            'alamat' => 'required|string',
            'no_hp' => 'nullable|string|max:25',
            'nama_wali' => 'required|string|max:150',
            'no_hp_wali' => 'required|string|max:25',
            'status' => 'required|in:Aktif,Alumni,Pindah',
        ]);

        $siswa->update($validated);

        return redirect()->route('siswa.index')
            ->with('success', 'Perubahan data siswa berhasil diperbarui.');
    }

    public function destroy(Siswa $siswa)
    {
        $siswa->delete();
        return redirect()->route('siswa.index')
            ->with('success', 'Data siswa berhasil dihapus dari sistem.');
    }
}`,
  },
  {
    id: 'controller-nilai',
    name: 'NilaiController.php (Perhitungan Nilai & E-Rapor)',
    path: 'app/Http/Controllers/NilaiController.php',
    category: 'Controller',
    language: 'php',
    description: 'Controller untuk kalkulasi nilai rapor (Tugas 30%, UTS 30%, UAS 40%), KKM, dan cetak rapor.',
    content: `<?php

namespace App\\Http\\Controllers;

use App\\Models\\Nilai;
use App\\Models\\Siswa;
use App\\Models\\Kelas;
use App\\Models\\MataPelajaran;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Auth;

class NilaiController extends Controller
{
    public function index(Request $request)
    {
        $kelasList = Kelas::all();
        $mapelList = MataPelajaran::all();

        $selectedKelasId = $request->kelas_id ?? ($kelasList->first()->id ?? null);
        $selectedMapelId = $request->mapel_id ?? ($mapelList->first()->id ?? null);

        $nilais = [];
        if ($selectedKelasId && $selectedMapelId) {
            $nilais = Nilai::with('siswa')
                ->whereHas('siswa', function ($q) use ($selectedKelasId) {
                    $q->where('kelas_id', $selectedKelasId);
                })
                ->where('mata_pelajaran_id', $selectedMapelId)
                ->get();
        }

        return view('nilai.index', compact('kelasList', 'mapelList', 'nilais', 'selectedKelasId', 'selectedMapelId'));
    }

    public function storeBatch(Request $request)
    {
        $request->validate([
            'mata_pelajaran_id' => 'required|exists:mata_pelajarans,id',
            'semester' => 'required|in:Ganjil,Genap',
            'tahun_ajaran' => 'required|string',
            'nilai' => 'required|array',
            'nilai.*.siswa_id' => 'required|exists:siswas,id',
            'nilai.*.tugas' => 'required|numeric|min:0|max:100',
            'nilai.*.uts' => 'required|numeric|min:0|max:100',
            'nilai.*.uas' => 'required|numeric|min:0|max:100',
            'nilai.*.catatan' => 'nullable|string|max:255',
        ]);

        $mapel = MataPelajaran::findOrFail($request->mata_pelajaran_id);

        foreach ($request->nilai as $item) {
            $tugas = (float)$item['tugas'];
            $uts = (float)$item['uts'];
            $uas = (float)$item['uas'];

            // Formula Pembobotan SMK Islamiyah: 30% Tugas + 30% UTS + 40% UAS
            $na = round(($tugas * 0.3) + ($uts * 0.3) + ($uas * 0.4), 2);

            // Predikat Penilaian
            $predikat = 'D';
            if ($na >= 90) $predikat = 'A';
            elseif ($na >= 80) $predikat = 'B';
            elseif ($na >= 70) $predikat = 'C';

            // Status Ketuntasan berdasarkan KKM Mapel
            $keterangan = ($na >= $mapel->kkm) ? 'Tuntas' : 'Remedial';

            Nilai::updateOrCreate(
                [
                    'siswa_id' => $item['siswa_id'],
                    'mata_pelajaran_id' => $mapel->id,
                    'semester' => $request->semester,
                    'tahun_ajaran' => $request->tahun_ajaran,
                ],
                [
                    'guru_id' => Auth::user()->id,
                    'nilai_tugas' => $tugas,
                    'nilai_uts' => $uts,
                    'nilai_uas' => $uas,
                    'nilai_akhir' => $na,
                    'predikat' => $predikat,
                    'keterangan' => $keterangan,
                    'catatan_guru' => $item['catatan'] ?? null,
                ]
            );
        }

        return back()->with('success', 'Seluruh nilai berhasil disimpan dan dihitung otomatis.');
    }

    public function cetakRapor($siswa_id)
    {
        $siswa = Siswa::with(['kelas.waliKelas', 'nilais.mataPelajaran'])->findOrFail($siswa_id);
        
        // Authorization check jika role siswa
        if (Auth::user()->role === 'siswa' && Auth::user()->id !== $siswa->user_id) {
            abort(403, 'Akses tidak diizinkan untuk melihat rapor siswa lain.');
        }

        return view('nilai.cetak-rapor', compact('siswa'));
    }
}`,
  },
  {
    id: 'model-siswa',
    name: 'Siswa.php (Eloquent Model)',
    path: 'app/Models/Siswa.php',
    category: 'Model',
    language: 'php',
    description: 'Model Eloquent Siswa dengan relasi ke Kelas, Nilai, dan Rekap Presensi.',
    content: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class Siswa extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nisn',
        'nis',
        'nama',
        'kelas_id',
        'jurusan',
        'jenis_kelamin',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'no_hp',
        'nama_wali',
        'no_hp_wali',
        'status',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi ke Kelas
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    // Relasi ke Daftar Nilai
    public function nilais()
    {
        return $this->hasMany(Nilai::class);
    }

    // Relasi ke Detail Presensi
    public function presensiDetails()
    {
        return $this->hasMany(PresensiDetail::class);
    }
}`,
  },
  {
    id: 'guide-setup',
    name: 'PANDUAN_INSTALASI_SMK.md',
    path: 'docs/PANDUAN_INSTALASI_SMK.md',
    category: 'Panduan',
    language: 'markdown',
    description: 'Panduan lengkap langkah demi langkah menjalankan aplikasi di server sekolah / XAMPP lokal.',
    content: `# PANDUAN INSTALASI & MENJALANKAN APLIKASI
## SISTEM INFORMASI AKADEMIK SMK ISLAMIYAH CIPUTAT

Aplikasi ini dibangun menggunakan **Laravel 11**, **PHP 8.2+**, **MySQL**, dan **TailwindCSS** dengan arsitektur modern berdesain gelap (*dark theme*) yang dirancang khusus untuk efisiensi operasional harian sekolah.

---

### 1. Kebutuhan Sistem (Prerequisites)
Sebelum menjalankan instalasi, pastikan lingkungan server atau komputer lokal Anda telah terpasang:
- **PHP** >= 8.2 (dengan ekstensi: \`pdo_mysql\`, \`mbstring\`, \`openssl\`, \`tokenizer\`, \`xml\`, \`ctype\`, \`json\`, \`bcmath\`)
- **Composer** >= 2.6
- **MySQL Database Server** >= 8.0 atau **MariaDB** >= 10.4 (Bisa menggunakan XAMPP/Laragon)
- **Node.js** >= 18.x & **NPM** >= 9.x
- **Git** (Opsional untuk version control)

---

### 2. Langkah-Langkah Instalasi Bertahap

#### Tahap 1: Persiapan Database MySQL
1. Buka aplikasi **phpMyAdmin** atau terminal MySQL:
   \`\`\`sql
   CREATE DATABASE smk_islamiyah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   \`\`\`
2. Anda juga dapat langsung mengimpor file \`schema.sql\` yang tersedia di tab Skema Database.

#### Tahap 2: Konfigurasi Proyek Laravel
1. Buka terminal di folder proyek dan salin file konfigurasi environment:
   \`\`\`bash
   cp .env.example .env
   \`\`\`
2. Sesuaikan koneksi database di file \`.env\`:
   \`\`\`env
   APP_NAME="SMK Islamiyah Ciputat"
   APP_ENV=local
   APP_KEY=
   APP_DEBUG=true
   APP_URL=http://localhost:8000

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=smk_islamiyah_db
   DB_USERNAME=root
   DB_PASSWORD=
   \`\`\`

#### Tahap 3: Install Dependensi PHP via Composer
Jalankan perintah berikut untuk mengunduh semua library dependensi Laravel:
\`\`\`bash
composer install
\`\`\`

#### Tahap 4: Generate Application Key
\`\`\`bash
php artisan key:generate
\`\`\`

#### Tahap 5: Eksekusi Migrasi Database & Seeding Data Awal
Eksekusi migrasi tabel dan pengisian data master awal (akun Admin, Guru, Siswa, Kelas, Mapel):
\`\`\`bash
php artisan migrate --seed
\`\`\`

#### Tahap 6: Compile Asset Frontend (Tailwind CSS)
Pasang package frontend dan build asset:
\`\`\`bash
npm install
npm run build
# Atau untuk mode pengembangan real-time:
# npm run dev
\`\`\`

#### Tahap 7: Jalankan Web Server Lokal
Jalankan development server Laravel:
\`\`\`bash
php artisan serve
\`\`\`
Buka browser dan akses alamat: **http://127.0.0.1:8000**

---

### 3. Akun Default untuk Pengujian (Hak Akses)
Sistem memiliki 3 tingkat hak akses (Role-Based Access Control):

| Peran (Role) | Username | Password | Deskripsi Wewenang |
| :--- | :--- | :--- | :--- |
| **Administrator** | \`admin\` | \`password123\` | Akses penuh master data siswa, guru, kelas, mapel, jadwal, sistem |
| **Guru Pengajar** | \`guru.siti\` | \`password123\` | Akses presensi kelas, input nilai mata pelajaran, lihat jadwal mengajar |
| **Siswa / Wali** | \`siswa.rizky\` | \`password123\` | Portal mandiri cetak rapor, lihat jadwal kelas, dan rekap absensi |

---

### 4. Panduan Alur Kerja Operasional Sekolah

1. **Awal Tahun Ajaran**:
   - Admin membuat master **Data Kelas** dan menunjuk **Wali Kelas**.
   - Admin mengimpor atau menambahkan **Data Siswa Baru** dan menetapkannya ke kelas.
   - Admin menyusun **Mata Pelajaran** dan alokasi **Guru Pengampu**.
   - Admin menyusun **Jadwal Pelajaran** mingguan.

2. **Operasional Harian**:
   - Guru membuka menu **Absensi**, memilih kelas yang diajar, dan mengklik "Set Semua Hadir" lalu menandai siswa yang Sakit (S), Izin (I), atau Alpa (A).
   - Pengumuman penting sekolah diposting melalui menu **Pengumuman**.

3. **Tengah & Akhir Semester**:
   - Guru mata pelajaran menginput nilai Tugas, PTS/UTS, dan PAS/UAS pada menu **Nilai**.
   - Sistem secara otomatis menghitung Nilai Akhir (NA), menentukan predikat (A/B/C/D), serta status ketuntasan berdasarkan KKM.
   - Siswa dan wali murid dapat mengunduh serta mencetak **E-Rapor SMK Islamiyah Ciputat** resmi berformat kop sekolah.`,
  },
];
