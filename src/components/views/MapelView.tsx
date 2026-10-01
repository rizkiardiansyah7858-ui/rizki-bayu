import React, { useState } from 'react';
import { MataPelajaran, Guru } from '../../types';
import { BookOpen, Plus, X } from 'lucide-react';

interface MapelViewProps {
  mapelList: MataPelajaran[];
  guruList: Guru[];
  onAddMapel: (mapel: Omit<MataPelajaran, 'id'>) => void;
  canEdit: boolean;
}

export const MapelView: React.FC<MapelViewProps> = ({
  mapelList,
  guruList,
  onAddMapel,
  canEdit,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [form, setForm] = useState({
    kode: '',
    nama: '',
    kelompok: 'C3 - Kompetensi Keahlian' as any,
    jurusanTerkait: 'RPL' as any,
    kkm: 78,
    jamPerMinggu: 4,
    guruPengampuId: guruList[0]?.id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const guru = guruList.find((g) => g.id === form.guruPengampuId);
    onAddMapel({
      ...form,
      guruPengampuNama: guru ? `${guru.nama}, ${guru.gelar}` : 'Belum Ditentukan',
    });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Mata Pelajaran & Kriteria Ketuntasan Minimal (KKM)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Struktur kurikulum muatan nasional, kewilayahan, dan kejuruan vokasi SMK Islamiyah Ciputat
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Mata Pelajaran</span>
          </button>
        )}
      </div>

      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <th className="py-3 px-4 font-medium">Kode Mapel</th>
                <th className="py-3 px-4 font-medium">Nama Mata Pelajaran</th>
                <th className="py-3 px-4 font-medium">Kelompok Kurikulum</th>
                <th className="py-3 px-4 font-medium">Jurusan</th>
                <th className="py-3 px-4 font-medium">KKM</th>
                <th className="py-3 px-4 font-medium">Jam/Mgg</th>
                <th className="py-3 px-4 font-medium">Guru Pengampu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {mapelList.map((m) => (
                <tr key={m.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-emerald-400">{m.kode}</td>
                  <td className="py-3 px-4 font-semibold text-zinc-100">{m.nama}</td>
                  <td className="py-3 px-4 text-zinc-400">{m.kelompok}</td>
                  <td className="py-3 px-4 font-mono text-zinc-300">
                    {m.jurusanTerkait || 'Semua'}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-emerald-400 font-semibold">
                    {m.kkm}
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">
                    {m.jamPerMinggu} JP
                  </td>
                  <td className="py-3 px-4 text-zinc-300">{m.guruPengampuNama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Tambah Mata Pelajaran</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Kode Mapel*</label>
                  <input
                    type="text"
                    required
                    value={form.kode}
                    onChange={(e) => setForm({ ...form, kode: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: RPL-C3-04"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Kelompok</label>
                  <select
                    value={form.kelompok}
                    onChange={(e) => setForm({ ...form, kelompok: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="A - Muatan Nasional">A - Muatan Nasional</option>
                    <option value="B - Muatan Kewilayahan">B - Muatan Kewilayahan</option>
                    <option value="C1 - Dasar Bidang Keahlian">C1 - Dasar Bidang Keahlian</option>
                    <option value="C2 - Dasar Program Keahlian">C2 - Dasar Program Keahlian</option>
                    <option value="C3 - Kompetensi Keahlian">C3 - Kompetensi Keahlian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Nama Mata Pelajaran*</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Cloud Computing & Keamanan Jaringan"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Jurusan</label>
                  <select
                    value={form.jurusanTerkait}
                    onChange={(e) => setForm({ ...form, jurusanTerkait: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Semua">Semua</option>
                    <option value="RPL">RPL</option>
                    <option value="TKJ">TKJ</option>
                    <option value="AKL">AKL</option>
                    <option value="OTKP">OTKP</option>
                    <option value="BDP">BDP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">KKM (Nilai Minimum)</label>
                  <input
                    type="number"
                    value={form.kkm}
                    onChange={(e) => setForm({ ...form, kkm: parseInt(e.target.value) || 75 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Jam/Minggu (JP)</label>
                  <input
                    type="number"
                    value={form.jamPerMinggu}
                    onChange={(e) => setForm({ ...form, jamPerMinggu: parseInt(e.target.value) || 4 })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Guru Pengampu</label>
                <select
                  value={form.guruPengampuId}
                  onChange={(e) => setForm({ ...form, guruPengampuId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama}, {g.gelar}
                    </option>
                  ))}
                </select>
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
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
