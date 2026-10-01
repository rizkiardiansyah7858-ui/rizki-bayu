import React, { useState } from 'react';
import { LARAVEL_PROJECT_STRUCTURE, LARAVEL_CODE_FILES } from '../../data/laravelProjectData';
import { LaravelCodeFile } from '../../types';
import {
  FolderTree,
  Database,
  Code2,
  BookOpen,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  FileCode,
} from 'lucide-react';

export const LaravelDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'struktur' | 'database' | 'sourcecode' | 'panduan'>('panduan');
  const [selectedFileId, setSelectedFileId] = useState<string>('sql-schema');
  const [copied, setCopied] = useState(false);

  const selectedFile = LARAVEL_CODE_FILES.find((f) => f.id === selectedFileId) || LARAVEL_CODE_FILES[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-emerald-950/30 border border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
          <Terminal className="w-4 h-4" />
          <span>LARAVEL 11 · PHP 8.2+ · MYSQL 8.0 · TAILWINDCSS</span>
        </div>
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
          Arsitektur Backend, Database & Panduan Menjalankan Bertahap
        </h2>
        <p className="mt-1 text-xs text-zinc-400 max-w-3xl leading-relaxed">
          Dokumentasi teknis menyeluruh sistem informasi akademik SMK Islamiyah Ciputat: struktur direktori MVC, skrip DDL MySQL relasional lengkap, controller logika bisnis, dan instruksi instalasi langkah demi langkah.
        </p>

        {/* Navigation Tabs */}
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setActiveTab('panduan')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'panduan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>1. Panduan Bertahap Menjalankan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('database');
              setSelectedFileId('sql-schema');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'database'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>2. Skema Database MySQL (DDL)</span>
          </button>

          <button
            onClick={() => setActiveTab('struktur')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'struktur'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>3. Struktur Direktori Proyek</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('sourcecode');
              if (selectedFileId === 'sql-schema') setSelectedFileId('routes-web');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'sourcecode'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>4. Source Code Laravel & RBAC</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Panduan Instalasi Bertahap */}
      {activeTab === 'panduan' && (
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-6 text-xs text-zinc-300">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Panduan Langkah Demi Langkah Menjalankan Aplikasi di Server / Komputer Sekolah
              </h3>
              <p className="text-zinc-500 mt-0.5">
                Ikuti tahap demi tahap untuk menjalankan server lokal XAMPP atau VPS Linux Ubuntu
              </p>
            </div>
            <button
              onClick={() => handleCopy(LARAVEL_CODE_FILES.find((f) => f.id === 'guide-setup')?.content || '')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin Panduan'}</span>
            </button>
          </div>

          {/* Stepper Stages */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">1</span>
                <span>Tahap 1: Verifikasi Kebutuhan Sistem (Prerequisites)</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Pastikan komputer server atau laptop tim IT SMK Islamiyah sudah terpasang:
              </p>
              <ul className="list-disc pl-11 space-y-1 text-zinc-400 font-mono text-[11px]">
                <li>PHP &gt;= 8.2 (dengan ekstensi pdo_mysql, mbstring, openssl, tokenizer, xml, ctype, json, bcmath)</li>
                <li>Composer &gt;= 2.6 (<code className="text-emerald-400">composer -V</code>)</li>
                <li>MySQL Database Server &gt;= 8.0 atau MariaDB (Bisa lewat XAMPP / Laragon)</li>
                <li>Node.js &gt;= 18.x & NPM (<code className="text-emerald-400">node -v</code>)</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">2</span>
                <span>Tahap 2: Pembuatan Database MySQL</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Buka phpMyAdmin di browser (<code className="text-zinc-200">http://localhost/phpmyadmin</code>) atau command prompt MySQL, lalu jalankan query SQL:
              </p>
              <div className="pl-7">
                <pre className="p-3 rounded bg-zinc-900 border border-zinc-800 text-emerald-300 font-mono text-[11px] overflow-x-auto">
CREATE DATABASE smk_islamiyah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
                </pre>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">3</span>
                <span>Tahap 3: Konfigurasi Environment (.env)</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Salin file template <code className="text-zinc-200">.env.example</code> menjadi <code className="text-zinc-200">.env</code> dan atur kredensial koneksi database:
              </p>
              <div className="pl-7">
                <pre className="p-3 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto">
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
                </pre>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">4</span>
                <span>Tahap 4: Instalasi Dependensi PHP & Generate Kunci Enkripsi</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Buka terminal di root folder proyek Laravel, lalu jalankan dua perintah berikut:
              </p>
              <div className="pl-7 space-y-1.5 font-mono text-[11px]">
                <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">composer install</pre>
                <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">php artisan key:generate</pre>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">5</span>
                <span>Tahap 5: Jalankan Migrasi Database & Seeder Data Awal</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Perintah ini akan secara otomatis menciptakan seluruh tabel database (users, guru, siswa, kelas, mapel, jadwal, absensi, nilai, pengumuman) beserta data uji coba:
              </p>
              <div className="pl-7 font-mono text-[11px]">
                <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">php artisan migrate --seed</pre>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">6</span>
                <span>Tahap 6: Build Asset Frontend Tailwind CSS</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Compile style dark theme modern dan bundle JavaScript:
              </p>
              <div className="pl-7 font-mono text-[11px]">
                <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">npm install && npm run build</pre>
              </div>
            </div>

            {/* Step 7 */}
            <div className="p-4 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-[10px]">7</span>
                <span>Tahap 7: Menjalankan Web Server Lokal</span>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Jalankan web server Laravel built-in:
              </p>
              <div className="pl-7 font-mono text-[11px]">
                <pre className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400">php artisan serve</pre>
              </div>
              <p className="text-zinc-400 pl-7 leading-relaxed">
                Buka peramban browser dan akses: <code className="text-emerald-400 font-mono font-bold">http://127.0.0.1:8000</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Skema Database MySQL (schema.sql) */}
      {activeTab === 'database' && (
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden flex flex-col">
          <div className="p-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold text-zinc-200">
                database/schema.sql (MySQL DDL Script)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleDownload(
                    'smk_islamiyah_schema.sql',
                    LARAVEL_CODE_FILES.find((f) => f.id === 'sql-schema')?.content || ''
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs border border-zinc-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Unduh schema.sql</span>
              </button>
              <button
                onClick={() =>
                  handleCopy(
                    LARAVEL_CODE_FILES.find((f) => f.id === 'sql-schema')?.content || ''
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Seluruh SQL'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-950 overflow-x-auto max-h-[600px] overflow-y-auto">
            <pre className="font-mono text-xs text-emerald-300/90 leading-relaxed">
              {LARAVEL_CODE_FILES.find((f) => f.id === 'sql-schema')?.content}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: Struktur Direktori */}
      {activeTab === 'struktur' && (
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                Pohon Struktur Direktori Proyek Laravel 11 (smk-islamiyah-sim)
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Struktur rapi sesuai standar best practice Laravel MVC dengan pemisahan Controller, Model, dan Blade
              </p>
            </div>
            <button
              onClick={() => handleCopy(LARAVEL_PROJECT_STRUCTURE)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Salin Tree</span>
            </button>
          </div>

          <div className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto">
            <pre>{LARAVEL_PROJECT_STRUCTURE}</pre>
          </div>
        </div>
      )}

      {/* TAB 4: Source Code Laravel */}
      {activeTab === 'sourcecode' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* File Selector Sidebar */}
          <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 p-4 space-y-2">
            <div className="text-xs font-mono uppercase text-zinc-500 tracking-wider mb-2">
              Daftar Berkas PHP & Route
            </div>
            {LARAVEL_CODE_FILES.filter((f) => f.id !== 'guide-setup').map((file) => (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`w-full text-left p-2.5 rounded-lg text-xs transition-all ${
                  selectedFileId === file.id
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <div className="font-mono text-[11px] truncate">{file.name}</div>
                <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  {file.category}
                </div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-3 rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden flex flex-col">
            <div className="p-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-zinc-200 block">
                  {selectedFile.path}
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  {selectedFile.description}
                </span>
              </div>
              <button
                onClick={() => handleCopy(selectedFile.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin Kode'}</span>
              </button>
            </div>

            <div className="p-4 bg-zinc-950 overflow-x-auto max-h-[600px] overflow-y-auto">
              <pre className="font-mono text-xs text-zinc-200 leading-relaxed">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
