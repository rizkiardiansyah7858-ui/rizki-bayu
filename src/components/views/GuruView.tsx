import React, { useState } from 'react';
import { Guru } from '../../types';
import { Search, Plus, Edit2, Trash2, Users, X, Phone, Mail } from 'lucide-react';

interface GuruViewProps {
  guruList: Guru[];
  onAddGuru: (guru: Omit<Guru, 'id'>) => void;
  onUpdateGuru: (guru: Guru) => void;
  onDeleteGuru: (id: string) => void;
  canEdit: boolean;
}

export const GuruView: React.FC<GuruViewProps> = ({
  guruList,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru,
  canEdit,
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

  const [form, setForm] = useState({
    nip: '',
    nama: '',
    gelar: '',
    jenisKelamin: 'L' as 'L' | 'P',
    email: '',
    noHp: '',
    mapelUtama: '',
    waliKelas: '',
    pendidikanTerakhir: 'S1 Teknik Informatika',
    statusKepegawaian: 'GTY' as 'GTY' | 'GTT' | 'PNS DPK',
  });

  const filtered = guruList.filter((g) =>
    g.nama.toLowerCase().includes(search.toLowerCase()) ||
    g.nip.includes(search) ||
    g.mapelUtama.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingGuru(null);
    setForm({
      nip: '',
      nama: '',
      gelar: 'S.Kom',
      jenisKelamin: 'L',
      email: '',
      noHp: '',
      mapelUtama: '',
      waliKelas: '',
      pendidikanTerakhir: 'S1',
      statusKepegawaian: 'GTY',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (guru: Guru) => {
    setEditingGuru(guru);
    setForm({
      nip: guru.nip,
      nama: guru.nama,
      gelar: guru.gelar,
      jenisKelamin: guru.jenisKelamin,
      email: guru.email,
      noHp: guru.noHp,
      mapelUtama: guru.mapelUtama,
      waliKelas: guru.waliKelas || '',
      pendidikanTerakhir: guru.pendidikanTerakhir,
      statusKepegawaian: guru.statusKepegawaian,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGuru) {
      onUpdateGuru({ ...editingGuru, ...form });
    } else {
      onAddGuru(form);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Tenaga Pendidik & Dewan Guru
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Daftar pengajar kompetensi kejuruan dan muatan nasional SMK Islamiyah Ciputat
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Guru Baru</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama guru, NIP, atau mata pelajaran..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
          {filtered.length} Guru Aktif
        </span>
      </div>

      {/* Guru Table */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <th className="py-3 px-4 font-medium">NIP / NUPTK</th>
                <th className="py-3 px-4 font-medium">Nama Guru & Gelar</th>
                <th className="py-3 px-4 font-medium">Mata Pelajaran Utama</th>
                <th className="py-3 px-4 font-medium">Wali Kelas</th>
                <th className="py-3 px-4 font-medium">Pendidikan</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Kontak</th>
                {canEdit && <th className="py-3 px-4 font-medium text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filtered.map((g) => (
                <tr key={g.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">
                    {g.nip}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-zinc-100">
                      {g.nama}, {g.gelar}
                    </div>
                    <div className="text-[11px] text-zinc-500">
                      {g.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-emerald-400">
                    {g.mapelUtama}
                  </td>
                  <td className="py-3 px-4">
                    {g.waliKelas ? (
                      <span className="font-mono text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
                        {g.waliKelas}
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">{g.pendidikanTerakhir}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[11px] text-zinc-300">
                      {g.statusKepegawaian}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-zinc-500" />
                      <span>{g.noHp}</span>
                    </div>
                  </td>
                  {canEdit && (
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(g)}
                          className="p-1 rounded text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus guru ${g.nama}?`)) onDeleteGuru(g.id);
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Guru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">
                {editingGuru ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">NIP / NUPTK*</label>
                  <input
                    type="text"
                    required
                    value={form.nip}
                    onChange={(e) => setForm({ ...form, nip: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Status Kepegawaian</label>
                  <select
                    value={form.statusKepegawaian}
                    onChange={(e) => setForm({ ...form, statusKepegawaian: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="GTY">GTY (Guru Tetap Yayasan)</option>
                    <option value="GTT">GTT (Guru Tidak Tetap)</option>
                    <option value="PNS DPK">PNS DPK</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-zinc-400 mb-1">Nama Lengkap*</label>
                  <input
                    type="text"
                    required
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                    placeholder="Bambang Sudarmono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Gelar</label>
                  <input
                    type="text"
                    value={form.gelar}
                    onChange={(e) => setForm({ ...form, gelar: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                    placeholder="S.T, M.Kom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Mata Pelajaran Utama</label>
                <input
                  type="text"
                  required
                  value={form.mapelUtama}
                  onChange={(e) => setForm({ ...form, mapelUtama: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Administrasi Infrastruktur Jaringan"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Wali Kelas (Opsional)</label>
                  <input
                    type="text"
                    value={form.waliKelas}
                    onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: XI TKJ 1"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={form.noHp}
                    onChange={(e) => setForm({ ...form, noHp: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="0813-xxxx-xxxx"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
