import React, { useState, useMemo } from 'react';
import { NilaiSiswa, Kelas, MataPelajaran, Siswa } from '../../types';
import { FileSpreadsheet, Save, Check, Printer, AlertCircle } from 'lucide-react';

interface NilaiViewProps {
  nilaiList: NilaiSiswa[];
  kelasList: Kelas[];
  mapelList: MataPelajaran[];
  siswaList: Siswa[];
  onSaveNilaiBatch: (updatedNilai: NilaiSiswa[]) => void;
  onOpenReportModal: (siswa: Siswa) => void;
  canEdit: boolean;
}

export const NilaiView: React.FC<NilaiViewProps> = ({
  nilaiList,
  kelasList,
  mapelList,
  siswaList,
  onSaveNilaiBatch,
  onOpenReportModal,
  canEdit,
}) => {
  const [selectedKelasId, setSelectedKelasId] = useState<string>(kelasList[0]?.id || '');
  const [selectedMapelId, setSelectedMapelId] = useState<string>(mapelList[0]?.id || '');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>('Ganjil');
  const [tahunAjaran, setTahunAjaran] = useState<string>('2025/2026');
  const [successMsg, setSuccessMsg] = useState(false);

  const selectedMapel = mapelList.find((m) => m.id === selectedMapelId);
  const kkm = selectedMapel?.kkm || 75;

  const classStudents = useMemo(() => {
    return siswaList.filter((s) => s.kelasId === selectedKelasId);
  }, [siswaList, selectedKelasId]);

  // Draft grades state: Map<siswaId, { tugas, uts, uas, catatan }>
  const [gradesDraft, setGradesDraft] = useState<
    Record<string, { tugas: number; uts: number; uas: number; catatan: string }>
  >({});

  // Initialize draft when class/mapel changes
  React.useEffect(() => {
    const draft: Record<string, { tugas: number; uts: number; uas: number; catatan: string }> = {};
    classStudents.forEach((s) => {
      const existing = nilaiList.find(
        (n) => n.siswaId === s.id && n.mapelId === selectedMapelId
      );
      draft[s.id] = {
        tugas: existing ? existing.nilaiTugas : 80,
        uts: existing ? existing.nilaiUTS : 80,
        uas: existing ? existing.nilaiUAS : 80,
        catatan: existing?.catatanGuru || '',
      };
    });
    setGradesDraft(draft);
  }, [classStudents, selectedMapelId, nilaiList]);

  const handleGradeChange = (
    siswaId: string,
    field: 'tugas' | 'uts' | 'uas',
    value: number
  ) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setGradesDraft((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        [field]: clamped,
      },
    }));
  };

  const handleCatatanChange = (siswaId: string, value: string) => {
    setGradesDraft((prev) => ({
      ...prev,
      [siswaId]: {
        ...prev[siswaId],
        catatan: value,
      },
    }));
  };

  const calculateNA = (tugas: number, uts: number, uas: number) => {
    return Math.round((tugas * 0.3) + (uts * 0.3) + (uas * 0.4));
  };

  const getPredikat = (na: number) => {
    if (na >= 90) return 'A';
    if (na >= 80) return 'B';
    if (na >= 70) return 'C';
    return 'D';
  };

  const handleSaveAll = () => {
    const updated: NilaiSiswa[] = classStudents.map((s) => {
      const g = gradesDraft[s.id] || { tugas: 80, uts: 80, uas: 80, catatan: '' };
      const na = calculateNA(g.tugas, g.uts, g.uas);
      const predikat = getPredikat(na);
      const keterangan = na >= kkm ? 'Tuntas' : 'Remedial';

      return {
        id: `nil-${s.id}-${selectedMapelId}`,
        siswaId: s.id,
        siswaNama: s.nama,
        kelasId: selectedKelasId,
        mapelId: selectedMapelId,
        mapelNama: selectedMapel?.nama || '',
        semester,
        tahunAjaran,
        nilaiTugas: g.tugas,
        nilaiUTS: g.uts,
        nilaiUAS: g.uas,
        nilaiAkhir: na,
        predikat,
        keterangan,
        catatanGuru: g.catatan,
      };
    });

    onSaveNilaiBatch(updated);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Penilaian Hasil Belajar & E-Rapor SMK
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Komponen penilaian Tugas (30%), UTS/STS (30%), dan UAS/SAS (40%) dengan KKM otomatis
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm self-start sm:self-auto"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Seluruh Nilai</span>
          </button>
        )}
      </div>

      {/* Selectors Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-zinc-400 mr-2">Rombel:</span>
            <select
              value={selectedKelasId}
              onChange={(e) => setSelectedKelasId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-zinc-400 mr-2">Mata Pelajaran:</span>
            <select
              value={selectedMapelId}
              onChange={(e) => setSelectedMapelId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 max-w-xs truncate"
            >
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama} (KKM: {m.kkm})
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="text-zinc-400 mr-2">Semester:</span>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value as any)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
            >
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
          <span>Standar KKM:</span>
          <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-emerald-400 font-bold">
            {kkm}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Nilai rapor dan perhitungan Nilai Akhir berhasil disimpan.</span>
        </div>
      )}

      {/* Gradebook Table */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <th className="py-3 px-3 w-10 text-center font-medium">No.</th>
                <th className="py-3 px-4 font-medium">Nama Siswa</th>
                <th className="py-3 px-3 font-medium text-center w-24">Tugas (30%)</th>
                <th className="py-3 px-3 font-medium text-center w-24">UTS (30%)</th>
                <th className="py-3 px-3 font-medium text-center w-24">UAS (40%)</th>
                <th className="py-3 px-3 font-medium text-center w-20">NA</th>
                <th className="py-3 px-2 font-medium text-center w-14">Predikat</th>
                <th className="py-3 px-3 font-medium text-center w-24">Status KKM</th>
                <th className="py-3 px-4 font-medium">Catatan / Umpan Balik Guru</th>
                <th className="py-3 px-4 font-medium text-right">E-Rapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {classStudents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-zinc-500">
                    Tidak ada siswa pada rombel yang dipilih.
                  </td>
                </tr>
              ) : (
                classStudents.map((siswa, idx) => {
                  const g = gradesDraft[siswa.id] || { tugas: 80, uts: 80, uas: 80, catatan: '' };
                  const na = calculateNA(g.tugas, g.uts, g.uas);
                  const predikat = getPredikat(na);
                  const isTuntas = na >= kkm;

                  return (
                    <tr key={siswa.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3 px-3 text-center font-mono text-zinc-500">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-zinc-100">
                        <div>{siswa.nama}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          NIS: {siswa.nis}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          disabled={!canEdit}
                          min={0}
                          max={100}
                          value={g.tugas}
                          onChange={(e) =>
                            handleGradeChange(siswa.id, 'tugas', parseInt(e.target.value))
                          }
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          disabled={!canEdit}
                          min={0}
                          max={100}
                          value={g.uts}
                          onChange={(e) =>
                            handleGradeChange(siswa.id, 'uts', parseInt(e.target.value))
                          }
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          disabled={!canEdit}
                          min={0}
                          max={100}
                          value={g.uas}
                          onChange={(e) =>
                            handleGradeChange(siswa.id, 'uas', parseInt(e.target.value))
                          }
                          className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center font-mono text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold tabular-nums text-zinc-100">
                        {na}
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-bold">
                        <span
                          className={
                            predikat === 'A'
                              ? 'text-emerald-400'
                              : predikat === 'B'
                              ? 'text-blue-400'
                              : 'text-amber-400'
                          }
                        >
                          {predikat}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`font-mono text-[11px] font-semibold ${
                            isTuntas ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isTuntas ? 'Tuntas' : 'Remedial'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          disabled={!canEdit}
                          value={g.catatan}
                          onChange={(e) => handleCatatanChange(siswa.id, e.target.value)}
                          placeholder="Catatan perkembangan..."
                          className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onOpenReportModal(siswa)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-[11px]"
                          title="Cetak E-Rapor Siswa"
                        >
                          <Printer className="w-3 h-3 text-emerald-400" />
                          <span>Rapor</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
