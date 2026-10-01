import React, { useState } from 'react';
import { Pengumuman, User } from '../../types';
import { Megaphone, Plus, Calendar, Tag, UserCheck, X } from 'lucide-react';

interface PengumumanViewProps {
  pengumumanList: Pengumuman[];
  currentUser: User;
  onAddPengumuman: (p: Omit<Pengumuman, 'id'>) => void;
  selectedPengumuman: Pengumuman | null;
  setSelectedPengumuman: (p: Pengumuman | null) => void;
}

export const PengumumanView: React.FC<PengumumanViewProps> = ({
  pengumumanList,
  currentUser,
  onAddPengumuman,
  selectedPengumuman,
  setSelectedPengumuman,
}) => {
  const [filterKategori, setFilterKategori] = useState<string>('Semua');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const canCreate = currentUser.role === 'admin' || currentUser.role === 'guru';

  const [form, setForm] = useState({
    judul: '',
    kategori: 'Akademik' as any,
    targetAudience: 'Semua' as any,
    tanggal: new Date().toISOString().split('T')[0],
    penulis: currentUser.name,
    konten: '',
    isImportant: false,
  });

  const filtered = pengumumanList.filter((p) => {
    return filterKategori === 'Semua' || p.kategori === filterKategori;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPengumuman(form);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Papan Pengumuman & Berita Sekolah
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pusat informasi kegiatan akademik, kalender pendidikan, dan edaran dinas SMK Islamiyah Ciputat
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Pengumuman Baru</span>
          </button>
        )}
      </div>

      {/* Filter Category Segmented Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs">
        {['Semua', 'Akademik', 'Kejuruan', 'Ujian', 'Kegiatan', 'Libur'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterKategori(cat)}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterKategori === cat
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Announcement Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedPengumuman(item)}
            className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-emerald-400 font-medium">
                  {item.kategori}
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">{item.tanggal}</span>
              </div>

              <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors leading-snug">
                {item.judul}
              </h3>

              <p className="mt-2 text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                {item.konten}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Ditulis oleh: {item.penulis}</span>
              <span className="font-mono text-emerald-400 group-hover:underline">
                Baca Selengkapnya →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedPengumuman && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-emerald-400 font-medium">
                  {selectedPengumuman.kategori}
                </span>
              </div>
              <button
                onClick={() => setSelectedPengumuman(null)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <h3 className="text-base font-bold text-zinc-100 leading-snug">
                {selectedPengumuman.judul}
              </h3>

              <div className="flex items-center gap-4 text-zinc-500 font-mono text-[11px] pb-3 border-b border-zinc-800">
                <span>Tanggal: {selectedPengumuman.tanggal}</span>
                <span>·</span>
                <span>Oleh: {selectedPengumuman.penulis}</span>
              </div>

              <div className="text-zinc-300 text-xs leading-relaxed whitespace-pre-line">
                {selectedPengumuman.konten}
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setSelectedPengumuman(null)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Buat Pengumuman Baru</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Judul Pengumuman*</label>
                <input
                  type="text"
                  required
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Pengumuman Uji Kompetensi Keahlian (UKK) 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Kategori</label>
                  <select
                    value={form.kategori}
                    onChange={(e) => setForm({ ...form, kategori: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Kejuruan">Kejuruan (PKL/UKK)</option>
                    <option value="Ujian">Ujian / PTS / PAS</option>
                    <option value="Kegiatan">Kegiatan Sekolah</option>
                    <option value="Libur">Hari Libur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Target Audiens</label>
                  <select
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Semua">Semua (Umum)</option>
                    <option value="Guru">Dewan Guru</option>
                    <option value="Siswa">Siswa & Wali Murid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Isi Pesan Pengumuman*</label>
                <textarea
                  required
                  rows={5}
                  value={form.konten}
                  onChange={(e) => setForm({ ...form, konten: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  placeholder="Tuliskan isi pengumuman lengkap..."
                />
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
                  Publikasikan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
