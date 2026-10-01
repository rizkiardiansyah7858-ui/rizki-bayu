import React, { useState, useMemo } from 'react';
import { Siswa, Kelas, Jurusan } from '../../types';
import {
  Search,
  Plus,
  Filter,
  Download,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  GraduationCap,
} from 'lucide-react';

interface SiswaViewProps {
  siswaList: Siswa[];
  kelasList: Kelas[];
  onAddSiswa: (siswa: Omit<Siswa, 'id'>) => void;
  onUpdateSiswa: (siswa: Siswa) => void;
  onDeleteSiswa: (id: string) => void;
  canEdit: boolean;
}

export const SiswaView: React.FC<SiswaViewProps> = ({
  siswaList,
  kelasList,
  onAddSiswa,
  onUpdateSiswa,
  onDeleteSiswa,
  canEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJurusan, setFilterJurusan] = useState<string>('Semua');
  const [filterKelas, setFilterKelas] = useState<string>('Semua');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [viewingSiswa, setViewingSiswa] = useState<Siswa | null>(null);

  // Form input state
  const [formData, setFormData] = useState({
    nisn: '',
    nis: '',
    nama: '',
    kelasId: kelasList[0]?.id || '',
    jurusan: 'RPL' as Jurusan,
    jenisKelamin: 'L' as 'L' | 'P',
    tempatLahir: 'Tangerang Selatan',
    tanggalLahir: '2007-01-01',
    alamat: '',
    noHp: '',
    namaWali: '',
    noHpWali: '',
    status: 'Aktif' as 'Aktif' | 'Alumni' | 'Pindah',
  });

  const filteredSiswa = useMemo(() => {
    return siswaList.filter((s) => {
      const matchSearch =
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery) ||
        s.nis.includes(searchQuery);

      const matchJurusan = filterJurusan === 'Semua' || s.jurusan === filterJurusan;
      const matchKelas = filterKelas === 'Semua' || s.kelasId === filterKelas;

      return matchSearch && matchJurusan && matchKelas;
    });
  }, [siswaList, searchQuery, filterJurusan, filterKelas]);

  const handleOpenAdd = () => {
    setEditingSiswa(null);
    setFormData({
      nisn: '',
      nis: '',
      nama: '',
      kelasId: kelasList[0]?.id || '',
      jurusan: 'RPL',
      jenisKelamin: 'L',
      tempatLahir: 'Tangerang Selatan',
      tanggalLahir: '2007-05-15',
      alamat: '',
      noHp: '',
      namaWali: '',
      noHpWali: '',
      status: 'Aktif',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (s: Siswa) => {
    setEditingSiswa(s);
    setFormData({
      nisn: s.nisn,
      nis: s.nis,
      nama: s.nama,
      kelasId: s.kelasId,
      jurusan: s.jurusan,
      jenisKelamin: s.jenisKelamin,
      tempatLahir: s.tempatLahir,
      tanggalLahir: s.tanggalLahir,
      alamat: s.alamat,
      noHp: s.noHp,
      namaWali: s.namaWali,
      noHpWali: s.noHpWali,
      status: s.status,
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedKelas = kelasList.find((k) => k.id === formData.kelasId);
    const kelasNama = selectedKelas ? selectedKelas.nama : 'X RPL 1';

    if (editingSiswa) {
      onUpdateSiswa({
        ...editingSiswa,
        ...formData,
        kelasNama,
      });
    } else {
      onAddSiswa({
        ...formData,
        kelasNama,
      });
    }
    setIsFormOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['NISN', 'NIS', 'Nama Lengkap', 'Kelas', 'Jurusan', 'JK', 'No HP', 'Nama Wali', 'Status'];
    const rows = filteredSiswa.map((s) => [
      s.nisn,
      s.nis,
      `"${s.nama}"`,
      s.kelasNama,
      s.jurusan,
      s.jenisKelamin,
      s.noHp,
      `"${s.namaWali}"`,
      s.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_siswa_smk_islamiyah_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
            Data Peserta Didik (Siswa)
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manajemen buku induk siswa SMK Islamiyah Ciputat tahun ajaran 2025/2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-700/80 bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          {canEdit && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Siswa</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama, NISN, atau NIS..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Jurusan:</span>
          </div>
          <select
            value={filterJurusan}
            onChange={(e) => setFilterJurusan(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 text-xs"
          >
            <option value="Semua">Semua Jurusan</option>
            <option value="RPL">RPL (Rekayasa Perangkat Lunak)</option>
            <option value="TKJ">TKJ (Teknik Komputer Jaringan)</option>
            <option value="AKL">AKL (Akuntansi)</option>
            <option value="OTKP">OTKP (Perkantoran)</option>
            <option value="BDP">BDP (Pemasaran)</option>
          </select>

          <div className="flex items-center gap-1.5 text-zinc-400 ml-2">
            <span>Kelas:</span>
          </div>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-emerald-500 text-xs"
          >
            <option value="Semua">Semua Rombel</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student Data Table */}
      <div className="rounded-xl bg-zinc-900/60 border border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono">
                <th className="py-3 px-4 font-medium">NISN / NIS</th>
                <th className="py-3 px-4 font-medium">Nama Siswa</th>
                <th className="py-3 px-4 font-medium">Kelas & Jurusan</th>
                <th className="py-3 px-4 font-medium">L/P</th>
                <th className="py-3 px-4 font-medium">No. Telepon</th>
                <th className="py-3 px-4 font-medium">Nama Wali</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredSiswa.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500">
                    Tidak ditemukan data siswa sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredSiswa.map((siswa) => (
                  <tr key={siswa.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">
                      <div>{siswa.nisn}</div>
                      <div className="text-[11px] text-zinc-500">{siswa.nis}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-zinc-100">
                      {siswa.nama}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-200">{siswa.kelasNama}</div>
                      <div className="text-[11px] text-zinc-400">{siswa.jurusan}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">{siswa.jenisKelamin}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-zinc-400">
                      {siswa.noHp || '-'}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">{siswa.namaWali}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-emerald-400">
                        {siswa.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingSiswa(siswa)}
                          className="p-1 rounded text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800"
                          title="Lihat Profil Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(siswa)}
                              className="p-1 rounded text-zinc-400 hover:text-blue-400 hover:bg-zinc-800"
                              title="Edit Data"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Yakin ingin menghapus data siswa ${siswa.nama}?`)) {
                                  onDeleteSiswa(siswa.id);
                                }
                              }}
                              className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/40 text-xs text-zinc-400 flex items-center justify-between">
          <span className="font-mono">
            Menampilkan {filteredSiswa.length} dari {siswaList.length} siswa
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            SMK Islamiyah Ciputat · Dapodik Sinkron
          </span>
        </div>
      </div>

      {/* Modal: Tambah / Edit Siswa */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-100">
                {editingSiswa ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">NISN (10 Digit)*</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="Contoh: 0067823910"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">NIS Sekolah*</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="Contoh: 23241001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Nama Lengkap Siswa*</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Muhammad Fikri Pratama"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Kelas*</label>
                  <select
                    value={formData.kelasId}
                    onChange={(e) => {
                      const sel = kelasList.find((k) => k.id === e.target.value);
                      setFormData({
                        ...formData,
                        kelasId: e.target.value,
                        jurusan: sel ? sel.jurusan : formData.jurusan,
                      });
                    }}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Jurusan</label>
                  <select
                    value={formData.jurusan}
                    onChange={(e) => setFormData({ ...formData, jurusan: e.target.value as Jurusan })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="RPL">RPL</option>
                    <option value="TKJ">TKJ</option>
                    <option value="AKL">AKL</option>
                    <option value="OTKP">OTKP</option>
                    <option value="BDP">BDP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Jenis Kelamin*</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="L">Laki-Laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={(e) => setFormData({ ...formData, tempatLahir: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={(e) => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  placeholder="Jl. Ki Hajar Dewantara, Ciputat..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Nama Orang Tua / Wali*</label>
                  <input
                    type="text"
                    required
                    value={formData.namaWali}
                    onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">No. WhatsApp Wali*</label>
                  <input
                    type="text"
                    required
                    value={formData.noHpWali}
                    onChange={(e) => setFormData({ ...formData, noHpWali: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="0812-xxxx-xxxx"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  {editingSiswa ? 'Simpan Perubahan' : 'Tambahkan Siswa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Detail Siswa */}
      {viewingSiswa && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Profil Peserta Didik
                </h3>
              </div>
              <button
                onClick={() => setViewingSiswa(null)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center text-sm font-bold font-mono">
                  {viewingSiswa.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-100">{viewingSiswa.nama}</h4>
                  <div className="text-zinc-400 flex items-center gap-2 font-mono mt-0.5">
                    <span>NISN: {viewingSiswa.nisn}</span>
                    <span>·</span>
                    <span>NIS: {viewingSiswa.nis}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-zinc-300">
                <div>
                  <span className="text-zinc-500 block">Rombongan Belajar:</span>
                  <span className="font-semibold text-zinc-100">{viewingSiswa.kelasNama}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Kompetensi Keahlian:</span>
                  <span className="font-semibold text-zinc-100">{viewingSiswa.jurusan}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Jenis Kelamin:</span>
                  <span>{viewingSiswa.jenisKelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Tempat, Tanggal Lahir:</span>
                  <span>{viewingSiswa.tempatLahir}, {viewingSiswa.tanggalLahir}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-zinc-500 block">Alamat Domisili:</span>
                  <span>{viewingSiswa.alamat || '-'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Nama Wali Murid:</span>
                  <span className="font-medium text-zinc-200">{viewingSiswa.namaWali}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">No. Kontak / WA Wali:</span>
                  <span className="font-mono tabular-nums text-emerald-400">{viewingSiswa.noHpWali}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex justify-end">
                <button
                  onClick={() => setViewingSiswa(null)}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
