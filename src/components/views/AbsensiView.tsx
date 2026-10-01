import React, { useState, useMemo } from 'react';
import { AbsensiHarian, Kelas, Siswa, StatusAbsensi } from '../../types';
import { ClipboardCheck, Check, Save, Calendar, Users, BarChart3 } from 'lucide-react';

interface AbsensiViewProps {
  absensiList: AbsensiHarian[];
  kelasList: Kelas[];
  siswaList: Siswa[];
  onSaveAbsensi: (data: { tanggal: string; kelasId: string; records: { siswaId: string; status: StatusAbsensi; catatan?: string }[] }) => void;
  canEdit: boolean;
}

export const AbsensiView: React.FC<AbsensiViewProps> = ({
  absensiList,
  kelasList,
  siswaList,
  onSaveAbsensi,
  canEdit,
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'rekap'>('input');
  const [selectedKelasId, setSelectedKelasId] = useState<string>(kelasList[0]?.id || '');
  const [selectedTanggal, setSelectedTanggal] = useState<string>('2026-09-30');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Filter students for chosen class
  const classStudents = useMemo(() => {
    return siswaList.filter((s) => s.kelasId === selectedKelasId);
  }, [siswaList, selectedKelasId]);

  // Current attendance draft state: Map<siswaId, { status, catatan }>
  const existingAbsensi = useMemo(() => {
    return absensiList.find(
      (a) => a.kelasId === selectedKelasId && a.tanggal === selectedTanggal
    );
  }, [absensiList, selectedKelasId, selectedTanggal]);

  const [recordsDraft, setRecordsDraft] = useState<Record<string, { status: StatusAbsensi; catatan?: string }>>({});

  // Sync draft when class, date, or existing record changes
  React.useEffect(() => {
    const draft: Record<string, { status: StatusAbsensi; catatan?: string }> = {};
    classStudents.forEach((s) => {
      const match = existingAbsensi?.records.find((r) => r.siswaId === s.id);
      draft[s.id] = {
        status: match ? match.status : 'H',
        catatan: match?.catatan || '',
      };
    });
    setRecordsDraft(draft);
  }, [classStudents, existingAbsensi]);

  const handleStatusChange = (siswaId: string, status: StatusAbsensi) => {
    setRecordsDraft((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        status,
      },
    }));
  };

  const handleCatatanChange = (siswaId: string, catatan: string) => {
    setRecordsDraft((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        catatan,
      },
    }));
  };

  const handleSetAllHadir = () => {
    const updated: Record<string, { status: StatusAbsensi; catatan?: string }> = {};
    classStudents.forEach((s) => {
      updated[s.id] = {
        status: 'H',
        catatan: recordsDraft[s.id]?.catatan || '',
      };
    });
    setRecordsDraft(updated);
  };

  const handleSave = () => {
    const records = classStudents.map((s) => ({
      siswaId: s.id,
      status: recordsDraft[s.id]?.status || 'H',
      catatan: recordsDraft[s.id]?.catatan || '',
    }));

    onSaveAbsensi({
      tanggal: selectedTanggal,
      kelasId: selectedKelasId,
      records,
    });

    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Rekapitulasi Data Calculations
  const rekapData = useMemo(() => {
    return classStudents.map((s) => {
      let h = 0, sakit = 0, izin = 0, alpa = 0;
      absensiList.forEach((abs) => {
        if (abs.kelasId === selectedKelasId) {
          const rec = abs.records.find((r) => r.siswaId === s.id);
          if (rec) {
            if (rec.status === 'H') h++;
            else if (rec.status === 'S') sakit++;
            else if (rec.status === 'I') izin++;
            else if (rec.status === 'A') alpa++;
          }
        }
      });
      const totalDays = h + sakit + izin + alpa;
      const persentase = totalDays > 0 ? Math.round((h / totalDays) * 100) : 100;
      return { siswa: s, h, sakit, izin, alpa, persentase };
    });
  }, [classStudents, absensiList, selectedKelasId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Presensi & Kehadiran Siswa
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Pencatatan kehadiran harian peserta didik SMK Islamiyah Ciputat per rombongan belajar
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('input')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'input'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Input Harian
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'rekap'
                ? 'bg-emerald-600 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Rekap Persentase
          </button>
        </div>
      </div>

      {/* Class & Date Controls */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Rombel:</span>
            <select
              value={selectedKelasId}
              onChange={(e) => setSelectedKelasId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          {activeTab === 'input' && (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Tanggal:</span>
              <input
                type="date"
                value={selectedTanggal}
                onChange={(e) => setSelectedTanggal(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          )}
        </div>

        {activeTab === 'input' && canEdit && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSetAllHadir}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-medium transition-colors"
            >
              Set Semua Hadir (H)
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Presensi</span>
            </button>
          </div>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Data presensi berhasil disimpan ke database sekolah.</span>
        </div>
      )}

      {/* Main Table: Input Harian */}
      {activeTab === 'input' && (
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono">
                  <th className="py-3 px-4 font-medium w-12 text-center">No.</th>
                  <th className="py-3 px-4 font-medium">NISN / NIS</th>
                  <th className="py-3 px-4 font-medium">Nama Siswa</th>
                  <th className="py-3 px-4 font-medium text-center">Status Kehadiran</th>
                  <th className="py-3 px-4 font-medium">Keterangan / Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      Tidak ada siswa terdaftar di rombel ini.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((s, idx) => {
                    const currentStatus = recordsDraft[s.id]?.status || 'H';
                    return (
                      <tr key={s.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-zinc-500 text-center">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">
                          {s.nisn}
                        </td>
                        <td className="py-3 px-4 font-medium text-zinc-100">
                          {s.nama}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                            {(['H', 'S', 'I', 'A'] as StatusAbsensi[]).map((st) => {
                              const isSelected = currentStatus === st;
                              const colors: Record<StatusAbsensi, string> = {
                                H: isSelected ? 'bg-emerald-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200',
                                S: isSelected ? 'bg-blue-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200',
                                I: isSelected ? 'bg-amber-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200',
                                A: isSelected ? 'bg-rose-600 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200',
                              };
                              return (
                                <button
                                  key={st}
                                  type="button"
                                  disabled={!canEdit}
                                  onClick={() => handleStatusChange(s.id, st)}
                                  className={`w-7 h-7 rounded text-xs transition-colors font-mono ${colors[st]}`}
                                  title={
                                    st === 'H' ? 'Hadir' : st === 'S' ? 'Sakit' : st === 'I' ? 'Izin' : 'Alpa'
                                  }
                                >
                                  {st}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            disabled={!canEdit}
                            value={recordsDraft[s.id]?.catatan || ''}
                            onChange={(e) => handleCatatanChange(s.id, e.target.value)}
                            placeholder="Catatan surat / alasan..."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Rekapitulasi Kehadiran */}
      {activeTab === 'rekap' && (
        <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono">
                  <th className="py-3 px-4 font-medium w-12 text-center">No.</th>
                  <th className="py-3 px-4 font-medium">Nama Siswa</th>
                  <th className="py-3 px-4 font-medium text-center text-emerald-400">Hadir (H)</th>
                  <th className="py-3 px-4 font-medium text-center text-blue-400">Sakit (S)</th>
                  <th className="py-3 px-4 font-medium text-center text-amber-400">Izin (I)</th>
                  <th className="py-3 px-4 font-medium text-center text-rose-400">Alpa (A)</th>
                  <th className="py-3 px-4 font-medium text-right">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {rekapData.map((row, idx) => (
                  <tr key={row.siswa.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-500 text-center">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-zinc-100">{row.siswa.nama}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-center text-emerald-400 font-semibold">{row.h}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-center text-blue-400">{row.sakit}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-center text-amber-400">{row.izin}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-center text-rose-400">{row.alpa}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-right font-bold">
                      <span className={row.persentase >= 85 ? 'text-emerald-400' : 'text-amber-400'}>
                        {row.persentase}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
