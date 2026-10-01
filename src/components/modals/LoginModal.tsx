import React, { useState } from 'react';
import { User, Role } from '../../types';
import { INITIAL_USERS } from '../../data/initialData';
import { ShieldCheck, UserCheck, GraduationCap, X, LogIn, Lock, User as UserIcon } from 'lucide-react';

interface LoginModalProps {
  currentUser: User;
  onLogin: (user: User) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  currentUser,
  onLogin,
  onClose,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (matched) {
      onLogin(matched);
      onClose();
    } else {
      setErrorMsg('Username atau password tidak cocok dengan akun terdaftar.');
    }
  };

  const handleQuickSwitch = (role: Role) => {
    const matched = INITIAL_USERS.find((u) => u.role === role);
    if (matched) {
      onLogin(matched);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Otentikasi & Hak Akses Pengguna
            </h3>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {/* Quick Demo Switcher */}
          <div>
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              Pilih Akun Demo (1-Click Login):
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleQuickSwitch('admin')}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  currentUser.role === 'admin'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1" />
                <span className="font-semibold text-zinc-100 block">Admin</span>
                <span className="text-[10px] text-zinc-500 font-mono">Bpk. Fauzi</span>
              </button>

              <button
                onClick={() => handleQuickSwitch('guru')}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  currentUser.role === 'guru'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-400 mb-1" />
                <span className="font-semibold text-zinc-100 block">Guru</span>
                <span className="text-[10px] text-zinc-500 font-mono">Bu Siti, S.Kom</span>
              </button>

              <button
                onClick={() => handleQuickSwitch('siswa')}
                className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                  currentUser.role === 'siswa'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-amber-400 mb-1" />
                <span className="font-semibold text-zinc-100 block">Siswa</span>
                <span className="text-[10px] text-zinc-500 font-mono">M. Rizky</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px bg-zinc-800 flex-1" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Atau Masuk Manual
            </span>
            <div className="h-px bg-zinc-800 flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-3">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-zinc-400 mb-1">Username / NIP / NISN</label>
              <div className="relative">
                <UserIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin / guru.siti / siswa.rizky"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-400 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors"
              >
                Masuk ke Sistem
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
