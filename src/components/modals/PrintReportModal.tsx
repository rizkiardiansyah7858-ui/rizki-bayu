import React from 'react';
import { Siswa, NilaiSiswa, Kelas } from '../../types';
import { Printer, X, Download } from 'lucide-react';

interface PrintReportModalProps {
  siswa: Siswa;
  nilaiList: NilaiSiswa[];
  kelasList: Kelas[];
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  siswa,
  nilaiList,
  kelasList,
  onClose,
}) => {
  const siswaNilai = nilaiList.filter((n) => n.siswaId === siswa.id);
  const kelas = kelasList.find((k) => k.id === siswa.kelasId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-6 flex flex-col">
        {/* Modal Top Bar (Hidden on print) */}
        <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-zinc-100">
              Pratinjau Cetak E-Rapor Siswa · SMK Islamiyah Ciputat
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Report Document (White page preview with authentic Indonesian school styling) */}
        <div className="p-8 sm:p-12 bg-white text-black font-sans print:p-0 overflow-y-auto max-h-[80vh] print:max-h-none">
          {/* Kop Surat Resmi */}
          <div className="border-b-2 border-black pb-3 mb-6 text-center relative">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 shrink-0 flex items-center justify-center">
                <img
                  src="/src/assets/images/smk_islamiyah_emblem_1790826415634.jpg"
                  alt="Logo Sekolah"
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-wide uppercase leading-tight">
                  YAYASAN PENDIDIKAN ISLAMIYAH CIPUTAT
                </h1>
                <h2 className="text-lg sm:text-xl font-extrabold uppercase leading-tight tracking-wider">
                  SMK ISLAMIYAH CIPUTAT
                </h2>
                <p className="text-[11px] text-gray-700 leading-snug mt-1">
                  NPSN: 20603412 · Akreditasi "A" (Amat Baik) · Bidang Keahlian: Teknologi Informasi & Bisnis Manajemen
                </p>
                <p className="text-[10px] text-gray-600">
                  Jl. Ki Hajar Dewantara No. 23, Ciputat, Kota Tangerang Selatan, Banten 15411 · Telp: (021) 7401234
                </p>
              </div>
            </div>
            <div className="border-b border-black mt-2" />
          </div>

          {/* Judul Rapor */}
          <div className="text-center my-4">
            <h3 className="text-sm font-bold uppercase underline tracking-wider">
              LAPORAN HASIL PENILAIAN CAPAIAN KOMPETENSI PESERTA DIDIK
            </h3>
            <p className="text-xs text-gray-700 font-medium mt-0.5">
              Semester Ganjil · Tahun Pelajaran 2025/2026
            </p>
          </div>

          {/* Student Identitas Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-xs my-4 border border-gray-300 p-3 rounded">
            <div className="flex">
              <span className="w-32 text-gray-600">Nama Peserta Didik</span>
              <span className="w-4">:</span>
              <span className="font-bold">{siswa.nama}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">Kelas / Rombel</span>
              <span className="w-4">:</span>
              <span className="font-bold">{siswa.kelasNama}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">NISN / NIS</span>
              <span className="w-4">:</span>
              <span className="font-mono">{siswa.nisn} / {siswa.nis}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">Program Keahlian</span>
              <span className="w-4">:</span>
              <span>{siswa.jurusan}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">Wali Kelas</span>
              <span className="w-4">:</span>
              <span>{kelas?.waliKelasNama || '-'}</span>
            </div>
            <div className="flex">
              <span className="w-32 text-gray-600">Status Kelulusan</span>
              <span className="w-4">:</span>
              <span className="font-semibold text-emerald-800">MEMENUHI KKM</span>
            </div>
          </div>

          {/* Table Nilai */}
          <div className="my-5">
            <table className="w-full text-left text-xs border-collapse border border-gray-400">
              <thead>
                <tr className="bg-gray-100 text-gray-900 border-b border-gray-400 text-center font-bold">
                  <th className="border border-gray-400 py-2 px-2 w-8">No</th>
                  <th className="border border-gray-400 py-2 px-3 text-left">Mata Pelajaran</th>
                  <th className="border border-gray-400 py-2 px-2 w-14">KKM</th>
                  <th className="border border-gray-400 py-2 px-2 w-16">Nilai Akhir</th>
                  <th className="border border-gray-400 py-2 px-2 w-14">Predikat</th>
                  <th className="border border-gray-400 py-2 px-2 w-20">Keterangan</th>
                  <th className="border border-gray-400 py-2 px-3 text-left">Deskripsi Kemajuan Belajar</th>
                </tr>
              </thead>
              <tbody>
                {siswaNilai.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="border border-gray-400 py-4 text-center text-gray-500">
                      Nilai untuk siswa ini belum diinput oleh dewan guru pengampu.
                    </td>
                  </tr>
                ) : (
                  siswaNilai.map((item, idx) => (
                    <tr key={item.id} className="border-b border-gray-300">
                      <td className="border border-gray-400 py-2 px-2 text-center font-mono">{idx + 1}</td>
                      <td className="border border-gray-400 py-2 px-3 font-medium">{item.mapelNama}</td>
                      <td className="border border-gray-400 py-2 px-2 text-center font-mono">75</td>
                      <td className="border border-gray-400 py-2 px-2 text-center font-bold font-mono">{item.nilaiAkhir}</td>
                      <td className="border border-gray-400 py-2 px-2 text-center font-bold">{item.predikat}</td>
                      <td className="border border-gray-400 py-2 px-2 text-center font-semibold text-emerald-800">
                        {item.keterangan}
                      </td>
                      <td className="border border-gray-400 py-2 px-3 text-[11px] leading-relaxed text-gray-700">
                        {item.catatanGuru || 'Menunjukkan penguasaan materi yang sangat baik sesuai standar kompetensi.'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Kehadiran & Ekstrakurikuler */}
          <div className="grid grid-cols-2 gap-4 text-xs my-4">
            <div className="border border-gray-400 p-3 rounded">
              <h4 className="font-bold border-b border-gray-300 pb-1 mb-2">Rekapitulasi Kehadiran Siswa</h4>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>1. Sakit (S)</span>
                  <span className="font-mono font-bold">1 Hari</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Izin (I)</span>
                  <span className="font-mono font-bold">0 Hari</span>
                </div>
                <div className="flex justify-between">
                  <span>3. Tanpa Keterangan / Alpa (A)</span>
                  <span className="font-mono font-bold">0 Hari</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-400 p-3 rounded">
              <h4 className="font-bold border-b border-gray-300 pb-1 mb-2">Catatan Karakter & Akhlak</h4>
              <p className="text-[11px] text-gray-700 leading-relaxed italic">
                "Ananda memiliki budi pekerti yang luhur, taat beribadah, santun terhadap guru, dan berdisiplin tinggi dalam menyelesaikan tugas kejuruan."
              </p>
            </div>
          </div>

          {/* Tanda Tangan Resmi */}
          <div className="mt-10 pt-4 grid grid-cols-3 text-center text-xs gap-4">
            <div>
              <p className="text-gray-600 mb-16">Mengetahui,<br />Orang Tua / Wali Murid</p>
              <p className="font-bold underline">{siswa.namaWali}</p>
            </div>

            <div>
              <p className="text-gray-600 mb-16">
                Ciputat, 30 September 2026<br />Wali Kelas
              </p>
              <p className="font-bold underline">{kelas?.waliKelasNama || 'Siti Aminah, S.Kom'}</p>
              <p className="text-[10px] text-gray-600 font-mono">NIP. 198405122010012004</p>
            </div>

            <div>
              <p className="text-gray-600 mb-16">
                Mengetahui,<br />Kepala SMK Islamiyah Ciputat
              </p>
              <p className="font-bold underline">Drs. H. M. Syukri, M.M</p>
              <p className="text-[10px] text-gray-600 font-mono">NIP. 196803151993031004</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
