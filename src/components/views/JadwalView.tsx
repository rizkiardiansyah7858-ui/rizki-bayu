import React, { useState } from 'react';
import { JadwalPelajaran, Kelas, MataPelajaran, Guru } from '../../types';
import { CalendarDays, Plus, Clock, MapPin, X, User } from 'lucide-react';

interface JadwalViewProps {
  jadwalList: JadwalPelajaran[];
  kelasList: Kelas[];
  mapelList: MataPelajaran[];
  guruList: Guru[];
  onAddJadwal: (jadwal: Omit<JadwalPelajaran, 'id'>) => void;
  canEdit: boolean;
}

export const JadwalView: React.FC<JadwalViewProps> = ({
  jadwalList,
  kelasList,
  mapelList,
  guruList,
  onAddJadwal,
  canEdit,
}) => {
  const [selectedHari, setSelectedHari] = useState<string>('Semua');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const hariList = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  const [form, setForm] = useState({
    hari: 'Senin' as any,
    jamMulai: '07:30',
    jamSelesai: '09:30',
    jamKe: '1 - 3',
    kelasId: kelasList[0]?.id || '',
    mapelId: mapelList[0]?.id || '',
    guruId: guruList[0]?.id || '',
    ruangan: 'Lab RPL 1',
  });

  const filteredJadwal = jadwalList.filter((j) => {
    const matchHari = selectedHari === 'Semua' || j.hari === selectedHari;
    const matchKelas = selectedKelas === 'Semua' || j.kelasId === selectedKelas;
    return matchHari && matchKelas;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const k = kelasList.find((item) => item.id === form.kelasId);
    const m = mapelList.find((item) => item.id === form.mapelId);
    const g = guruList.find((item) => item.id === form.guruId);

    onAddJadwal({
      ...form,
      kelasNama: k ? k.nama : 'XI RPL 1',
      mapelNama: m ? m.nama : 'Pemrograman Web',
      guruNama: g ? `${g.nama}, ${g.gelar}` : 'Guru',
    });
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Jadwal Pelajaran & KBM Mingguan
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Plotting alokasi jam mengajar, mata pelajaran kejuruan, dan penggunaan laboratorium
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jadwal KBM</span>
          </button>
        )}
      </div>

      {/* Filter Segmented Controls */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        {/* Days selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-zinc-400 mr-2 font-mono">Hari:</span>
          <button
            onClick={() => setSelectedHari('Semua')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedHari === 'Semua'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            Semua Hari
          </button>
          {hariList.map((hari) => (
            <button
              key={hari}
              onClick={() => setSelectedHari(hari)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                selectedHari === hari
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {hari}
            </button>
          ))}
        </div>

        {/* Class Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800 text-xs text-zinc-400">
          <span>Filter Kelas:</span>
          <select
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="Semua">Semua Rombel</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Jadwal Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJadwal.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-zinc-500 rounded-xl bg-zinc-900/40 border border-zinc-800">
            Tidak ada jadwal pelajaran untuk hari atau kelas yang dipilih.
          </div>
        ) : (
          filteredJadwal.map((j) => (
            <div
              key={j.id}
              className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono text-emerald-400 font-semibold">
                    {j.hari} · Jam Ke-{j.jamKe}
                  </span>
                  <span className="font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                    {j.kelasNama}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100 mt-1 line-clamp-2">
                  {j.mapelNama}
                </h3>

                <div className="mt-3 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono text-zinc-300">
                      {j.jamMulai} - {j.jamSelesai} WIB
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-zinc-300 truncate">{j.guruNama}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono text-zinc-400">{j.ruangan}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add Jadwal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">Tambah Jadwal Pelajaran</h3>
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
                  <label className="block text-zinc-400 mb-1">Hari Pelajaran*</label>
                  <select
                    value={form.hari}
                    onChange={(e) => setForm({ ...form, hari: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {hariList.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Jam Ke-</label>
                  <input
                    type="text"
                    required
                    value={form.jamKe}
                    onChange={(e) => setForm({ ...form, jamKe: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                    placeholder="Contoh: 1 - 3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    required
                    value={form.jamMulai}
                    onChange={(e) => setForm({ ...form, jamMulai: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    required
                    value={form.jamSelesai}
                    onChange={(e) => setForm({ ...form, jamSelesai: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Rombel / Kelas*</label>
                <select
                  value={form.kelasId}
                  onChange={(e) => setForm({ ...form, kelasId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Mata Pelajaran*</label>
                <select
                  value={form.mapelId}
                  onChange={(e) => {
                    const m = mapelList.find(item => item.id === e.target.value);
                    setForm({
                      ...form,
                      mapelId: e.target.value,
                      guruId: m?.guruPengampuId || form.guruId,
                    });
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  {mapelList.map((m) => (
                    <option key={m.id} value={m.id}>{m.nama} ({m.kode})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Guru Pengajar</label>
                  <select
                    value={form.guruId}
                    onChange={(e) => setForm({ ...form, guruId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {guruList.map((g) => (
                      <option key={g.id} value={g.id}>{g.nama}, {g.gelar}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Ruangan / Lab</label>
                  <input
                    type="text"
                    required
                    value={form.ruangan}
                    onChange={(e) => setForm({ ...form, ruangan: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="Lab Komputer 1"
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
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
