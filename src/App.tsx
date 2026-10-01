import React, { useState, useEffect } from 'react';
import {
  User,
  Role,
  Siswa,
  Guru,
  Kelas,
  MataPelajaran,
  JadwalPelajaran,
  AbsensiHarian,
  NilaiSiswa,
  Pengumuman,
  StatusAbsensi,
} from './types';
import {
  INITIAL_USERS,
  INITIAL_SISWA,
  INITIAL_GURU,
  INITIAL_KELAS,
  INITIAL_MAPEL,
  INITIAL_JADWAL,
  INITIAL_ABSENSI,
  INITIAL_NILAI,
  INITIAL_PENGUMUMAN,
} from './data/initialData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { SiswaView } from './components/views/SiswaView';
import { GuruView } from './components/views/GuruView';
import { KelasView } from './components/views/KelasView';
import { MapelView } from './components/views/MapelView';
import { JadwalView } from './components/views/JadwalView';
import { AbsensiView } from './components/views/AbsensiView';
import { NilaiView } from './components/views/NilaiView';
import { PengumumanView } from './components/views/PengumumanView';
import { LaravelDocsView } from './components/views/LaravelDocsView';
import { LoginModal } from './components/modals/LoginModal';
import { PrintReportModal } from './components/modals/PrintReportModal';

export default function App() {
  // Current logged in user (default: Admin)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('smk_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Modals for Report Card & Announcement details
  const [reportSiswa, setReportSiswa] = useState<Siswa | null>(null);
  const [selectedPengumuman, setSelectedPengumuman] = useState<Pengumuman | null>(null);

  // Data Collections with localStorage persistence
  const [siswaList, setSiswaList] = useState<Siswa[]>(() => {
    const saved = localStorage.getItem('smk_siswa');
    return saved ? JSON.parse(saved) : INITIAL_SISWA;
  });

  const [guruList, setGuruList] = useState<Guru[]>(() => {
    const saved = localStorage.getItem('smk_guru');
    return saved ? JSON.parse(saved) : INITIAL_GURU;
  });

  const [kelasList, setKelasList] = useState<Kelas[]>(() => {
    const saved = localStorage.getItem('smk_kelas');
    return saved ? JSON.parse(saved) : INITIAL_KELAS;
  });

  const [mapelList, setMapelList] = useState<MataPelajaran[]>(() => {
    const saved = localStorage.getItem('smk_mapel');
    return saved ? JSON.parse(saved) : INITIAL_MAPEL;
  });

  const [jadwalList, setJadwalList] = useState<JadwalPelajaran[]>(() => {
    const saved = localStorage.getItem('smk_jadwal');
    return saved ? JSON.parse(saved) : INITIAL_JADWAL;
  });

  const [absensiList, setAbsensiList] = useState<AbsensiHarian[]>(() => {
    const saved = localStorage.getItem('smk_absensi');
    return saved ? JSON.parse(saved) : INITIAL_ABSENSI;
  });

  const [nilaiList, setNilaiList] = useState<NilaiSiswa[]>(() => {
    const saved = localStorage.getItem('smk_nilai');
    return saved ? JSON.parse(saved) : INITIAL_NILAI;
  });

  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(() => {
    const saved = localStorage.getItem('smk_pengumuman');
    return saved ? JSON.parse(saved) : INITIAL_PENGUMUMAN;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('smk_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('smk_siswa', JSON.stringify(siswaList));
  }, [siswaList]);

  useEffect(() => {
    localStorage.setItem('smk_guru', JSON.stringify(guruList));
  }, [guruList]);

  useEffect(() => {
    localStorage.setItem('smk_kelas', JSON.stringify(kelasList));
  }, [kelasList]);

  useEffect(() => {
    localStorage.setItem('smk_mapel', JSON.stringify(mapelList));
  }, [mapelList]);

  useEffect(() => {
    localStorage.setItem('smk_jadwal', JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    localStorage.setItem('smk_absensi', JSON.stringify(absensiList));
  }, [absensiList]);

  useEffect(() => {
    localStorage.setItem('smk_nilai', JSON.stringify(nilaiList));
  }, [nilaiList]);

  useEffect(() => {
    localStorage.setItem('smk_pengumuman', JSON.stringify(pengumumanList));
  }, [pengumumanList]);

  // Role Switcher Handler
  const handleSwitchRole = (role: Role) => {
    const found = INITIAL_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      setActiveView('dashboard');
    }
  };

  // Siswa Handlers
  const handleAddSiswa = (newSiswaData: Omit<Siswa, 'id'>) => {
    const newSiswa: Siswa = {
      ...newSiswaData,
      id: `sis-${Date.now()}`,
    };
    setSiswaList((prev) => [newSiswa, ...prev]);
  };

  const handleUpdateSiswa = (updatedSiswa: Siswa) => {
    setSiswaList((prev) =>
      prev.map((s) => (s.id === updatedSiswa.id ? updatedSiswa : s))
    );
  };

  const handleDeleteSiswa = (id: string) => {
    setSiswaList((prev) => prev.filter((s) => s.id !== id));
  };

  // Guru Handlers
  const handleAddGuru = (newGuruData: Omit<Guru, 'id'>) => {
    const newGuru: Guru = {
      ...newGuruData,
      id: `guru-${Date.now()}`,
    };
    setGuruList((prev) => [...prev, newGuru]);
  };

  const handleUpdateGuru = (updatedGuru: Guru) => {
    setGuruList((prev) =>
      prev.map((g) => (g.id === updatedGuru.id ? updatedGuru : g))
    );
  };

  const handleDeleteGuru = (id: string) => {
    setGuruList((prev) => prev.filter((g) => g.id !== id));
  };

  // Kelas Handlers
  const handleAddKelas = (newKelasData: Omit<Kelas, 'id'>) => {
    const newKelas: Kelas = {
      ...newKelasData,
      id: `kls-${Date.now()}`,
    };
    setKelasList((prev) => [...prev, newKelas]);
  };

  // Mapel Handlers
  const handleAddMapel = (newMapelData: Omit<MataPelajaran, 'id'>) => {
    const newMapel: MataPelajaran = {
      ...newMapelData,
      id: `mpl-${Date.now()}`,
    };
    setMapelList((prev) => [...prev, newMapel]);
  };

  // Jadwal Handlers
  const handleAddJadwal = (newJadwalData: Omit<JadwalPelajaran, 'id'>) => {
    const newJadwal: JadwalPelajaran = {
      ...newJadwalData,
      id: `jdw-${Date.now()}`,
    };
    setJadwalList((prev) => [...prev, newJadwal]);
  };

  // Absensi Handler
  const handleSaveAbsensi = (data: {
    tanggal: string;
    kelasId: string;
    records: { siswaId: string; status: StatusAbsensi; catatan?: string }[];
  }) => {
    setAbsensiList((prev) => {
      const filtered = prev.filter(
        (a) => !(a.tanggal === data.tanggal && a.kelasId === data.kelasId)
      );
      const newRecord: AbsensiHarian = {
        id: `abs-${Date.now()}`,
        tanggal: data.tanggal,
        kelasId: data.kelasId,
        records: data.records,
      };
      return [...filtered, newRecord];
    });
  };

  // Nilai Batch Handler
  const handleSaveNilaiBatch = (updatedNilaiItems: NilaiSiswa[]) => {
    setNilaiList((prev) => {
      const map = new Map<string, NilaiSiswa>();
      prev.forEach((item) => map.set(item.id, item));
      updatedNilaiItems.forEach((item) => map.set(item.id, item));
      return Array.from(map.values());
    });
  };

  // Pengumuman Handler
  const handleAddPengumuman = (newP: Omit<Pengumuman, 'id'>) => {
    const item: Pengumuman = {
      ...newP,
      id: `pgm-${Date.now()}`,
    };
    setPengumumanList((prev) => [item, ...prev]);
  };

  // Permission checks
  const canEditMaster = currentUser.role === 'admin';
  const canEditAcademic = currentUser.role === 'admin' || currentUser.role === 'guru';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Top Bar Header */}
      <Header
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCodeView={() => setActiveView('laravel-docs')}
        activeView={activeView}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <Sidebar
          currentUser={currentUser}
          activeView={activeView}
          setActiveView={setActiveView}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          counts={{
            siswa: siswaList.length,
            guru: guruList.length,
            kelas: kelasList.length,
            pengumuman: pengumumanList.length,
          }}
        />

        {/* Main Workspace Viewport */}
        <main className="flex-1 md:pl-64 min-w-0 transition-all p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeView === 'dashboard' && (
            <DashboardView
              currentUser={currentUser}
              siswaList={siswaList}
              guruList={guruList}
              kelasList={kelasList}
              jadwalList={jadwalList}
              pengumumanList={pengumumanList}
              nilaiList={nilaiList}
              onNavigate={(v) => setActiveView(v)}
              onSelectPengumuman={(p) => {
                setSelectedPengumuman(p);
                setActiveView('pengumuman');
              }}
            />
          )}

          {activeView === 'siswa' && (
            <SiswaView
              siswaList={siswaList}
              kelasList={kelasList}
              onAddSiswa={handleAddSiswa}
              onUpdateSiswa={handleUpdateSiswa}
              onDeleteSiswa={handleDeleteSiswa}
              canEdit={canEditMaster}
            />
          )}

          {activeView === 'guru' && (
            <GuruView
              guruList={guruList}
              onAddGuru={handleAddGuru}
              onUpdateGuru={handleUpdateGuru}
              onDeleteGuru={handleDeleteGuru}
              canEdit={canEditMaster}
            />
          )}

          {activeView === 'kelas' && (
            <KelasView
              kelasList={kelasList}
              guruList={guruList}
              siswaList={siswaList}
              onAddKelas={handleAddKelas}
              canEdit={canEditMaster}
            />
          )}

          {activeView === 'mapel' && (
            <MapelView
              mapelList={mapelList}
              guruList={guruList}
              onAddMapel={handleAddMapel}
              canEdit={canEditMaster}
            />
          )}

          {activeView === 'jadwal' && (
            <JadwalView
              jadwalList={jadwalList}
              kelasList={kelasList}
              mapelList={mapelList}
              guruList={guruList}
              onAddJadwal={handleAddJadwal}
              canEdit={canEditMaster}
            />
          )}

          {activeView === 'absensi' && (
            <AbsensiView
              absensiList={absensiList}
              kelasList={kelasList}
              siswaList={siswaList}
              onSaveAbsensi={handleSaveAbsensi}
              canEdit={canEditAcademic}
            />
          )}

          {activeView === 'nilai' && (
            <NilaiView
              nilaiList={nilaiList}
              kelasList={kelasList}
              mapelList={mapelList}
              siswaList={siswaList}
              onSaveNilaiBatch={handleSaveNilaiBatch}
              onOpenReportModal={(s) => setReportSiswa(s)}
              canEdit={canEditAcademic}
            />
          )}

          {activeView === 'pengumuman' && (
            <PengumumanView
              pengumumanList={pengumumanList}
              currentUser={currentUser}
              onAddPengumuman={handleAddPengumuman}
              selectedPengumuman={selectedPengumuman}
              setSelectedPengumuman={setSelectedPengumuman}
            />
          )}

          {activeView === 'laravel-docs' && <LaravelDocsView />}
        </main>
      </div>

      {/* Authentication / Role Switching Modal */}
      {isLoginModalOpen && (
        <LoginModal
          currentUser={currentUser}
          onLogin={(u) => setCurrentUser(u)}
          onClose={() => setIsLoginModalOpen(false)}
        />
      )}

      {/* Official E-Rapor SMK Islamiyah Print Modal */}
      {reportSiswa && (
        <PrintReportModal
          siswa={reportSiswa}
          nilaiList={nilaiList}
          kelasList={kelasList}
          onClose={() => setReportSiswa(null)}
        />
      )}
    </div>
  );
}
