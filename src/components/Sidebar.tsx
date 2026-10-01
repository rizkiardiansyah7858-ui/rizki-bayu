import React from 'react';
import { User } from '../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileSpreadsheet,
  Megaphone,
  Code2,
  X,
  Sparkles,
  School,
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  activeView: string;
  setActiveView: (view: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  counts: {
    siswa: number;
    guru: number;
    kelas: number;
    pengumuman: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  isMobileOpen,
  setIsMobileOpen,
  counts,
}) => {
  const isAdmin = currentUser.role === 'admin';
  const isGuru = currentUser.role === 'guru';
  const isSiswa = currentUser.role === 'siswa';

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setIsMobileOpen(false);
  };

  const navItemClass = (view: string) => {
    const isActive = activeView === view;
    return `w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
      isActive
        ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold'
        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800/90 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center p-1">
              <School className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-sm font-semibold text-zinc-100 tracking-tight block">
                SMK ISLAMIYAH
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">
                SIAKAD v2.4 · CIPUTAT
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Section: Menu Utama */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Menu Utama
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => handleNavClick('pengumuman')}
                className={navItemClass('pengumuman')}
              >
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-4 h-4" />
                  <span>Pengumuman</span>
                </div>
                {counts.pengumuman > 0 && (
                  <span className="text-[11px] font-mono text-emerald-400">
                    {counts.pengumuman}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Section: Master Data (Hanya Admin) */}
          {isAdmin && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Master Data Sekolah
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('siswa')}
                  className={navItemClass('siswa')}
                >
                  <div className="flex items-center gap-2.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Data Siswa</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {counts.siswa}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('guru')}
                  className={navItemClass('guru')}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Data Guru</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {counts.guru}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('kelas')}
                  className={navItemClass('kelas')}
                >
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-4 h-4" />
                    <span>Data Kelas</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {counts.kelas}
                  </span>
                </button>

                <button
                  onClick={() => handleNavClick('mapel')}
                  className={navItemClass('mapel')}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-4 h-4" />
                    <span>Mata Pelajaran</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Section: Pembelajaran & Akademik (Admin & Guru) */}
          {(isAdmin || isGuru) && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Akademik & Presensi
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('jadwal')}
                  className={navItemClass('jadwal')}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>Jadwal Pelajaran</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('absensi')}
                  className={navItemClass('absensi')}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Presensi & Absensi</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('nilai')}
                  className={navItemClass('nilai')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Nilai & E-Rapor</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Section: Khusus Portal Siswa */}
          {isSiswa && (
            <div>
              <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                Portal Mandiri Siswa
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => handleNavClick('jadwal')}
                  className={navItemClass('jadwal')}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>Jadwal Kelas Saya</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('absensi')}
                  className={navItemClass('absensi')}
                >
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="w-4 h-4" />
                    <span>Presensi Saya</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('nilai')}
                  className={navItemClass('nilai')}
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Rapor & Nilai Saya</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Section: Arsitektur Laravel & Panduan (Bespoke requested by user) */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400">
              Dokumentasi & Source Code
            </div>
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('laravel-docs')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeView === 'laravel-docs'
                    ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-semibold'
                    : 'text-zinc-300 hover:text-emerald-300 hover:bg-zinc-900 border border-zinc-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Struktur Laravel & DB</span>
                </div>
                <span className="text-[10px] font-mono bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded">
                  PHP
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 flex flex-col gap-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Tangerang Selatan</span>
            <span className="font-mono text-emerald-400">Banten</span>
          </div>
          <p className="text-[10px] text-zinc-600 line-clamp-1">
            Jl. Ki Hajar Dewantara No. 23, Ciputat
          </p>
        </div>
      </aside>
    </>
  );
};
