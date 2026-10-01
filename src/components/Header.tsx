import React from 'react';
import { User, Role } from '../types';
import { Bell, LogOut, ShieldCheck, UserCheck, GraduationCap, Menu, Sparkles, Code2 } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onSwitchRole: (role: Role) => void;
  onOpenLoginModal: () => void;
  onOpenCodeView: () => void;
  activeView: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchRole,
  onOpenLoginModal,
  onOpenCodeView,
  activeView,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const getViewTitle = (view: string) => {
    switch (view) {
      case 'dashboard': return 'Dashboard Utama';
      case 'siswa': return 'Data Induk Siswa';
      case 'guru': return 'Data Guru & Tenaga Kependidikan';
      case 'kelas': return 'Manajemen Kelas & Rombel';
      case 'mapel': return 'Mata Pelajaran & KKM';
      case 'jadwal': return 'Jadwal Pelajaran Mingguan';
      case 'absensi': return 'Presensi & Absensi Siswa';
      case 'nilai': return 'Penilaian & E-Rapor SMK';
      case 'pengumuman': return 'Papan Pengumuman & Berita';
      case 'laravel-docs': return 'Arsitektur Laravel & Panduan';
      default: return 'Portal Akademik';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 sm:px-6 flex items-center justify-between">
      {/* Zone 1: Brand & Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center overflow-hidden shrink-0 shadow-sm shadow-emerald-900/20">
            <img
              src="/src/assets/images/smk_islamiyah_emblem_1790826415634.jpg"
              alt="Logo SMK Islamiyah Ciputat"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback styled crest icon
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100 leading-tight">
              SMK Islamiyah Ciputat
            </h1>
            <div className="text-[11px] text-zinc-400 hidden sm:flex items-center gap-1.5 font-mono">
              <span>{getViewTitle(activeView)}</span>
              <span>·</span>
              <span className="text-emerald-400">TP 2025/2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Zone 2: Fast Role Switcher & Laravel Quick Access */}
      <div className="hidden lg:flex items-center gap-1.5 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800/80 text-xs">
        <span className="text-zinc-500 px-2 font-mono text-[11px]">Role Aktif:</span>
        <button
          onClick={() => onSwitchRole('admin')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
            currentUser.role === 'admin'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
          title="Login sebagai Administrator Sekolah"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => onSwitchRole('guru')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
            currentUser.role === 'guru'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
          title="Login sebagai Guru (Siti Aminah, S.Kom)"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Guru</span>
        </button>
        <button
          onClick={() => onSwitchRole('siswa')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
            currentUser.role === 'siswa'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
          title="Login sebagai Siswa (M. Rizky Pratama)"
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Siswa</span>
        </button>
      </div>

      {/* Zone 3: Actions & User Info */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenCodeView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-emerald-300 hover:border-emerald-500/40 hover:bg-zinc-800 transition-colors"
          title="Lihat Arsitektur Laravel, Skema MySQL & Panduan Bertahap"
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Source Code Laravel</span>
        </button>

        <div className="h-5 w-px bg-zinc-800 hidden sm:block" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-xs font-semibold font-mono">
            {currentUser.avatar || currentUser.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-medium text-zinc-200 truncate max-w-[140px]">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
              {currentUser.role}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenLoginModal}
          className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          title="Ganti Akun / Info Login"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
