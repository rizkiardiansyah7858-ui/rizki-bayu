import React, { useState } from 'react';
import { Kelas, Guru, Siswa } from '../../types';
import { Building2, Plus, Users, X, Eye } from 'lucide-react';

interface KelasViewProps {
  kelasList: Kelas[];
  guruList: Guru[];
  siswaList: Siswa[];
  onAddKelas: (kelas: Omit<Kelas, 'id'>) => void;
  canEdit: boolean;
}

export const KelasView: React.FC<KelasViewProps> = ({
  kelasList,
  guruList,
  siswaList,
  onAddKelas,
  canEdit,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);

  const [form, setForm] = useState({
    nama: '',
    tingkat: 'X' as 'X' | 'XI' | 'XII',
    jurusan: 'RPL' as any,
    waliKelasId: guruList[0]?.id || '',
    ruang: 'Lab RPL Gedung B',
    kapasitas: 36,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const wali = guruList.find((g) => g.id === form.waliKelasId);
    onAddKelas({
      ...form,
      waliKelasNama: wali ? `${wali.nama}, ${wali.gelar}` : 'Belum Ditentukan',
    });
    setIsAddOpen(false);
  };

  const getSiswaInKelas = (kelasId: string) => {
    return siswaList.filter((s) => s.kelasId === kelasId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Rombongan Belajar (Kelas)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manajemen rombel, alokasi ruang kelas teori & laboratorium SMK Islamiyah Ciputat
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Rombel Baru</span>
          </button>
        )}
      </div>

      {/* Grid Kelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kelasList.map((k) => {
          const siswaCount = getSiswaInKelas(k.id).length;
          return (
            <div
              key={k.id}
              className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-100 tracking-tight">
                        {k.nama}
                      </h3>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        Tingkat {k.tingkat} · {k.jurusan}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-xs tabular-nums text-emerald-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {siswaCount} / {k.kapasitas} Siswa
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs text-zinc-400 border-t border-zinc-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Wali Kelas:</span>
                    <span className="text-zinc-200 font-medium text-right line-clamp-1 max-w-[170px]">
                      {k.waliKelasNama}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Ruangan:</span>
                    <span className="font-mono text-zinc-300">{k.ruang}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedKelas(k)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 text-xs font-medium transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daftar Siswa Kelas Ini</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Siswa di Kelas */}
      {selectedKelas && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Daftar Siswa Rombel: {selectedKelas.nama}
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Wali Kelas: {selectedKelas.waliKelasNama}
                </p>
              </div>
              <button
                onClick={() => setSelectedKelas(null)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {getSiswaInKelas(selectedKelas.id).length === 0 ? (
                <div className="py-6 text-center text-xs text-zinc-500">
                  Belum ada siswa yang dialokasikan ke kelas ini.
                </div>
              ) : (
                <div className="divide-y divide-zinc-800/60 text-xs">
                  {getSiswaInKelas(selectedKelas.id).map((s, idx) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-zinc-500 w-5 text-right">{idx + 1}.</span>
                        <div>
                          <div className="font-semibold text-zinc-200">{s.nama}</div>
                          <div className="text-[11px] text-zinc-500 font-mono">
                            NISN: {s.nisn} · JK: {s.jenisKelamin}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400">
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
              <button
                onClick={() => setSelectedKelas(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs hover:text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Kelas */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Tambah Kelas Baru</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nama Kelas*</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                  placeholder="Contoh: XII RPL 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Tingkat*</label>
                  <select
                    value={form.tingkat}
                    onChange={(e) => setForm({ ...form, tingkat: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Jurusan*</label>
                  <select
                    value={form.jurusan}
                    onChange={(e) => setForm({ ...form, jurusan: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="RPL">RPL</option>
                    <option value="TKJ">TKJ</option>
                    <option value="AKL">AKL</option>
                    <option value="OTKP">OTKP</option>
                    <option value="BDP">BDP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Wali Kelas*</label>
                <select
                  value={form.waliKelasId}
                  onChange={(e) => setForm({ ...form, waliKelasId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama}, {g.gelar}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Ruangan</label>
                  <input
                    type="text"
                    required
                    value={form.ruang}
                    onChange={(e) => setForm({ ...form, ruang: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                    placeholder="Lab RPL 1"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Kapasitas</label>
                  <input
                    type="number"
                    value={form.kapasitas}
                    onChange={(e) => setForm({ ...form, kapasitas: parseInt(e.target.value) || 36 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Simpan Rombel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
