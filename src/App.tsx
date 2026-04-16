import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Info, Users, Newspaper, Phone, 
  MapPin, Mail, ChevronRight, Landmark, ArrowRight,
  LogIn, LogOut, Edit, Trash2, Plus, Image as ImageIcon, Save, Upload, CheckCircle2,
  BookOpen, Target, Map, Building2, ChevronDown
} from 'lucide-react';

// ================= FUNGSI KOMPRESI GAMBAR OTOMATIS =================
// Fungsi ini mencegah memori browser penuh (Blank Screen) dengan cara 
// mengecilkan ukuran gambar jauh lebih agresif sebelum disimpan ke LocalStorage
const compressImage = (file: File, maxWidth: number, isLogo: boolean, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target?.result as string;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Mengecilkan dimensi gambar secara ketat agar size base64 menjadi sangat kecil
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Logo menggunakan PNG agar transparan, gambar biasa menggunakan WebP/JPEG dengan kualitas rendah 0.5 (50%)
        const format = isLogo ? 'image/png' : 'image/jpeg';
        const quality = isLogo ? undefined : 0.5;
        const compressedBase64 = canvas.toDataURL(format, quality);
        callback(compressedBase64);
      } else {
        callback(img.src); // Fallback jika gagal compress
      }
    };
  };
};

// Data awal berita
const initialBerita = [
  {
    id: 1,
    judul: "Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap III",
    tanggal: "12 Okt 2024",
    kategori: "Sosial",
    gambar: "https://images.unsplash.com/photo-1593113565694-c6f130d24c3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    excerpt: "Pemerintah Desa Delta Upang kembali menyalurkan Bantuan Langsung Tunai (BLT) yang bersumber dari Dana Desa (DD) kepada keluarga penerima manfaat...\n\n(Teks selengkapnya) Bantuan ini diharapkan dapat meringankan beban ekonomi warga, terutama dalam memenuhi kebutuhan pokok sehari-hari. Kepala Desa menghimbau agar dana tersebut digunakan sebaik-baiknya untuk kebutuhan primer."
  },
  {
    id: 2,
    judul: "Kerja Bakti Bersih Desa Menyambut Musim Penghujan",
    tanggal: "05 Okt 2024",
    kategori: "Kegiatan",
    gambar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    excerpt: "Mengantisipasi datangnya musim penghujan, warga Desa Delta Upang bergotong royong membersihkan saluran air dan fasilitas umum guna mencegah banjir...\n\n(Teks selengkapnya) Kegiatan ini diikuti oleh seluruh elemen masyarakat dari 4 Dusun. Selain membersihkan selokan, warga juga melakukan pemangkasan dahan pohon yang rawan tumbang serta membersihkan area pekarangan fasilitas umum."
  },
  {
    id: 3,
    judul: "Pelatihan Pembuatan Pupuk Kompos untuk Kelompok Tani",
    tanggal: "28 Sep 2024",
    kategori: "Pemberdayaan",
    gambar: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a091c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    excerpt: "BUMDes bekerja sama dengan penyuluh pertanian kecamatan mengadakan pelatihan pembuatan pupuk kompos organik yang diikuti oleh 30 petani lokal...\n\n(Teks selengkapnya) Pelatihan ini bertujuan untuk meningkatkan kemandirian petani dalam penyediaan pupuk, menekan biaya produksi pertanian, sekaligus mengedukasi warga tentang pengelolaan limbah organik menjadi barang bernilai ekonomis tinggi."
  }
];

// Data awal perangkat desa (Tampilan Card)
const initialPerangkat = [
  { id: 1, nama: "Zaenal Efendi, S.IP", jabatan: "Kepala Desa", foto: "https://lh3.googleusercontent.com/d/1L5Y15w_obbihHFz4rUMrOAci5V7TtAIz" },
  { id: 2, nama: "Ahmad Yani, S.IP.", jabatan: "Sekretaris Desa", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: 3, nama: "Siti Rahmawati", jabatan: "Kaur Keuangan", foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: 4, nama: "Budi Santoso", jabatan: "Kaur Perencanaan", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: 5, nama: "Dewi Lestari", jabatan: "Kasi Pemerintahan", foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: 6, nama: "Herman Pelani", jabatan: "Kasi Kesejahteraan", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
];

// Data awal lembaga pemerintahan desa lainnya (Tampilan Tabel)
const initialLembaga = [
  { id: 1, kategori: 'bpd', nama: 'Suryadi, S.H.', jabatan: 'Ketua BPD', jenisKelamin: 'Laki-laki', umur: 45, foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 2, kategori: 'pkk', nama: 'Ibu Ratna', jabatan: 'Ketua Tim Penggerak PKK', jenisKelamin: 'Perempuan', umur: 42, foto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 3, kategori: 'kadus', nama: 'Bambang Irawan', jabatan: 'Kepala Dusun I', jenisKelamin: 'Laki-laki', umur: 50, foto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 4, kategori: 'rt', nama: 'Suharto', jabatan: 'Ketua RT 01', jenisKelamin: 'Laki-laki', umur: 48, foto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' }
];

// Data awal profil desa
const initialProfil = [
  {
    id: 1,
    iconName: "BookOpen",
    judul: "Sejarah",
    gambar: "https://images.unsplash.com/photo-1572005996025-06900f6b6474?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    konten: "Desa Delta Upang memiliki sejarah panjang yang mengakar pada nilai-nilai perjuangan dan semangat gotong royong masyarakat pesisir. Sejak awal berdirinya, desa ini terus berkembang menjadi pusat harmoni sosial tempat bertemunya keberagaman budaya yang menyatu dalam kehangatan.\n\nPerjalanan panjang desa ini tidak lepas dari peran serta tetua adat dan tokoh masyarakat yang bahu-membahu membangun peradaban dari tanah yang dulunya terpencil menjadi kawasan yang kian maju dan terbuka terhadap inovasi."
  },
  {
    id: 2,
    iconName: "Target",
    judul: "Visi & Misi",
    gambar: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    konten: "VISI KAMI:\n\"Terwujudnya Desa Delta Upang yang Mandiri, Sejahtera, Religius, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Inovatif.\"\n\nMISI DESA:\n1. Meningkatkan kualitas pelayanan publik administrasi kependudukan yang cepat, tepat, dan transparan.\n2. Meningkatkan pembangunan infrastruktur jalan, jembatan, dan fasilitas umum desa yang berkualitas dan merata.\n3. Memberdayakan ekonomi kerakyatan dan pertanian melalui optimalisasi BUMDes dan Kelompok Tani.\n4. Meningkatkan kualitas sumber daya manusia melalui dukungan pada sektor pendidikan dan kesehatan dasar.\n5. Melestarikan nilai-nilai gotong royong, budaya lokal, dan kerukunan antar umat beragama."
  },
  {
    id: 3,
    iconName: "Map",
    judul: "Kondisi geografis",
    gambar: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    konten: "Terletak di bentang alam yang subur dan dialiri oleh perairan sungai yang strategis di Kecamatan Makarti Jaya, Desa Delta Upang menyimpan potensi agraris dan perikanan yang sangat melimpah.\n\nKondisi topografi dataran rendah dengan curah hujan yang seimbang menjadikan tanah di desa kami sangat cocok untuk pengembangan sektor pertanian unggulan. Suasana pedesaan yang asri, udara yang segar, serta hamparan alam yang masih terjaga menjadikan Delta Upang tidak hanya makmur secara ekonomi namun juga nyaman untuk ditinggali."
  },
  {
    id: 4,
    iconName: "Building2",
    judul: "Struktur organisasi",
    gambar: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    konten: "Pemerintahan Desa Delta Upang didukung oleh struktur organisasi yang tangguh, responsif, dan adaptif terhadap kemajuan zaman. Diisi oleh putra-putri terbaik desa yang berdedikasi tinggi, kami melayani masyarakat dengan sepenuh hati.\n\nSetiap fungsi pemerintahan, mulai dari Kepala Desa, Sekretaris, jajaran Kepala Urusan (Kaur), Kepala Seksi (Kasi), hingga Kepala Dusun, berjalan secara sinergis dengan menjunjung tinggi prinsip transparansi dan profesionalisme demi kemajuan bersama seluruh elemen masyarakat Delta Upang."
  }
];

// Data awal konten beranda
const initialBeranda = {
  heroBg: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  logoHero: "", // State untuk Logo Hero (Atas)
  headerLogo: "", // State untuk Logo di Header (Kiri Atas)
  namaDesa: "Delta Upang",
  deskripsiDesa: "Kecamatan Makarti Jaya, Kabupaten Banyuasin \nProvinsi Sumatera Selatan",
  fotoKades: "https://lh3.googleusercontent.com/d/1L5Y15w_obbihHFz4rUMrOAci5V7TtAIz",
  namaKades: "Zaenal Efendi, S.IP",
  jabatanKades: "Kepala Desa Delta Upang",
  sambutanKades: "Assalamu'alaikum Warahmatullahi Wabarakatuh. Puji syukur kita panjatkan ke hadirat Allah SWT. Selamat datang di website resmi Desa Delta Upang. Melalui media ini, kami berupaya mewujudkan transparansi dan kemudahan akses informasi bagi seluruh warga dan masyarakat luas mengenai program kerja, kegiatan, dan pembangunan di desa kita tercinta.",
  stats: [
    { id: 1, num: "3.250", label: "Total Penduduk", subLaki: "1.874", subPerempuan: "1.815" },
    { id: 2, num: "800", label: "Kepala Keluarga" },
    { id: 3, num: "4", label: "Dusun" },
    { id: 4, num: "16", label: "Rukun Tetangga (RT)" }
  ]
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State Active Tabs
  const [activeProfilTab, setActiveProfilTab] = useState<number | null>(null);
  const [activePemerintahTab, setActivePemerintahTab] = useState<string>('perangkat');
  
  // States untuk mengatur dropdown
  const [isDesktopProfilOpen, setIsDesktopProfilOpen] = useState(false);
  const [isMobileProfilOpen, setIsMobileProfilOpen] = useState(false);
  const [isDesktopPemerintahOpen, setIsDesktopPemerintahOpen] = useState(false);
  const [isMobilePemerintahOpen, setIsMobilePemerintahOpen] = useState(false);
  
  // State Admin
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('desa_admin_status') === 'true';
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // States Data (Diperbarui versi kuncinya agar me-reset data yang menyebabkan blank screen)
  const [daftarBerita, setDaftarBerita] = useState(() => {
    const saved = localStorage.getItem('desa_data_berita_v4');
    return saved ? JSON.parse(saved) : initialBerita;
  });
  
  const [daftarPerangkat, setDaftarPerangkat] = useState(() => {
    const saved = localStorage.getItem('desa_data_perangkat_v4');
    return saved ? JSON.parse(saved) : initialPerangkat;
  });

  const [daftarLembaga, setDaftarLembaga] = useState(() => {
    const saved = localStorage.getItem('desa_data_lembaga_v3');
    return saved ? JSON.parse(saved) : initialLembaga;
  });

  const [daftarProfil, setDaftarProfil] = useState(() => {
    const saved = localStorage.getItem('desa_data_profil_v3');
    return saved ? JSON.parse(saved) : initialProfil;
  });
  
  const [dataBeranda, setDataBeranda] = useState(() => {
    const saved = localStorage.getItem('desa_data_beranda_v9');
    return saved ? JSON.parse(saved) : initialBeranda;
  });

  // SKRIP SAPU JAGAT (AUTO-CLEANUP): Menghapus file sampah memori browser versi lama yang bikin memori penuh
  useEffect(() => {
    try {
      const currentKeys = [
        'desa_admin_status',
        'desa_data_berita_v4',
        'desa_data_perangkat_v4',
        'desa_data_lembaga_v3',
        'desa_data_profil_v3',
        'desa_data_beranda_v9'
      ];
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('desa_') && !currentKeys.includes(key)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (e) {
      console.error("Cleanup error:", e);
    }
  }, []);

  // Efek klik di luar untuk menutup dropdown desktop
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsDesktopProfilOpen(false);
      setIsDesktopPemerintahOpen(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Saat halaman atau tab berubah, otomatis scroll ke atas agar informasi yang dipilih langsung terlihat
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [currentPage, activeProfilTab, activePemerintahTab]);

  // Efek Penyimpanan ke LocalStorage dengan Try...Catch yang lebih aman
  useEffect(() => { 
    try { localStorage.setItem('desa_admin_status', isAdmin.toString()); } catch(e){} 
  }, [isAdmin]);
  
  useEffect(() => { 
    try { localStorage.setItem('desa_data_berita_v4', JSON.stringify(daftarBerita)); } catch(e){ console.error(e); } 
  }, [daftarBerita]);
  
  useEffect(() => { 
    try { localStorage.setItem('desa_data_perangkat_v4', JSON.stringify(daftarPerangkat)); } catch(e){ console.error(e); } 
  }, [daftarPerangkat]);
  
  useEffect(() => { 
    try { localStorage.setItem('desa_data_lembaga_v3', JSON.stringify(daftarLembaga)); } catch(e){ console.error(e); } 
  }, [daftarLembaga]);
  
  useEffect(() => { 
    try { localStorage.setItem('desa_data_profil_v3', JSON.stringify(daftarProfil)); } catch(e){ console.error(e); } 
  }, [daftarProfil]);
  
  useEffect(() => { 
    try { 
      localStorage.setItem('desa_data_beranda_v9', JSON.stringify(dataBeranda)); 
    } catch (e) {
      alert("Gagal menyimpan perubahan: Memori browser masih penuh. Harap hapus cache secara manual.");
    }
  }, [dataBeranda]);

  const navigateTo = (page: string, tabId: any = null) => {
    setCurrentPage(page);
    
    if (page === 'profil' && tabId !== null) {
      setActiveProfilTab(tabId);
    }
    if (page === 'pemerintah' && tabId !== null) {
      setActivePemerintahTab(tabId);
    }

    // Menutup menu mobile & dropdown saat pindah halaman atau selesai memilih
    setIsMobileMenuOpen(false);
    setIsMobileProfilOpen(false);
    setIsDesktopProfilOpen(false);
    setIsMobilePemerintahOpen(false);
    setIsDesktopPemerintahOpen(false);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    if (username === '1603142311930004' && password === 'admin123') {
      setIsAdmin(true);
      setShowLoginModal(false);
    } else {
      alert('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    if(window.confirm('Yakin ingin keluar dari sesi Admin?')) {
      setIsAdmin(false);
    }
  };

  // Daftar Menu Dropdown Pemerintah
  const menuPemerintah = [
    { id: 'perangkat', label: 'Perangkat Desa' },
    { id: 'bpd', label: 'BPD' },
    { id: 'pkk', label: 'PKK' },
    { id: 'kadus', label: 'Kepala Dusun' },
    { id: 'rt', label: 'Ketua RT' }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800 relative selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Styles for Animations */}
      <style>
        {`
          @keyframes float-animation {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
          .animate-float {
            animation: float-animation 3.5s ease-in-out infinite;
          }
          @keyframes roll-left {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-roll {
            display: inline-block;
            white-space: nowrap;
            animation: roll-left 15s linear infinite;
          }
        `}
      </style>

      {/* Header & Navbar */}
      <header className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white sticky top-0 z-40 shadow-xl border-b border-emerald-700">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div 
              className="flex items-center gap-4 cursor-pointer group"
              onClick={() => navigateTo('beranda')}
            >
              <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-xl border border-white/20 group-hover:bg-white transition duration-300 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden">
                {dataBeranda.headerLogo ? (
                  <img src={dataBeranda.headerLogo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Landmark className="h-6 w-6 md:h-7 md:w-7 text-white group-hover:text-emerald-800 transition duration-300" />
                )}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-extrabold tracking-tight leading-none drop-shadow-md">Desa Delta Upang</h1>
                <p className="text-xs text-emerald-200 font-medium mt-1 tracking-wide">Kec. Makarti Jaya, Kab. Banyuasin</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1 items-center bg-black/20 p-1.5 rounded-2xl backdrop-blur-md border border-white/10">
              <NavButton active={currentPage === 'beranda'} onClick={() => navigateTo('beranda')} icon={<Home className="w-4 h-4 mr-2" />}>Beranda</NavButton>
              
              {/* Dropdown Profil Desa */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    setIsDesktopPemerintahOpen(false);
                    if (currentPage === 'profil') {
                      setIsDesktopProfilOpen(!isDesktopProfilOpen);
                    } else {
                      navigateTo('profil', daftarProfil[0]?.id);
                      setIsDesktopProfilOpen(true);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold flex items-center transition-all duration-300 text-sm tracking-wide ${
                    currentPage === 'profil'
                      ? 'bg-white text-emerald-900 shadow-md'
                      : 'text-white hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Profil Desa
                  <ChevronDown className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-300 ${isDesktopProfilOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-gray-100 transition-all duration-300 transform origin-top z-50 overflow-hidden ${
                  isDesktopProfilOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}>
                  <div className="flex flex-col py-1.5">
                    {daftarProfil.map((profil: any) => (
                      <button
                        key={profil.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('profil', profil.id);
                        }}
                        className={`text-left px-5 py-3 text-sm font-bold transition-all duration-200 relative overflow-hidden ${
                           activeProfilTab === profil.id && currentPage === 'profil'
                             ? 'text-emerald-700 bg-emerald-50/80'
                             : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                        }`}
                      >
                         {activeProfilTab === profil.id && currentPage === 'profil' && (
                           <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600"></span>
                         )}
                         {profil.judul}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dropdown Pemerintah Desa */}
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => {
                    setIsDesktopProfilOpen(false);
                    if (currentPage === 'pemerintah') {
                      setIsDesktopPemerintahOpen(!isDesktopPemerintahOpen);
                    } else {
                      navigateTo('pemerintah', 'perangkat');
                      setIsDesktopPemerintahOpen(true);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl font-bold flex items-center transition-all duration-300 text-sm tracking-wide ${
                    currentPage === 'pemerintah'
                      ? 'bg-white text-emerald-900 shadow-md'
                      : 'text-white hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Pemerintah Desa
                  <ChevronDown className={`w-4 h-4 ml-1 opacity-70 transition-transform duration-300 ${isDesktopPemerintahOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-gray-100 transition-all duration-300 transform origin-top z-50 overflow-hidden ${
                  isDesktopPemerintahOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
                }`}>
                  <div className="flex flex-col py-1.5">
                    {menuPemerintah.map((menu: any) => (
                      <button
                        key={menu.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateTo('pemerintah', menu.id);
                        }}
                        className={`text-left px-5 py-3 text-sm font-bold transition-all duration-200 relative overflow-hidden ${
                           activePemerintahTab === menu.id && currentPage === 'pemerintah'
                             ? 'text-emerald-700 bg-emerald-50/80'
                             : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                        }`}
                      >
                         {activePemerintahTab === menu.id && currentPage === 'pemerintah' && (
                           <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600"></span>
                         )}
                         {menu.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <NavButton active={currentPage === 'berita'} onClick={() => navigateTo('berita')} icon={<Newspaper className="w-4 h-4 mr-2" />}>Berita</NavButton>
              <NavButton active={currentPage === 'kontak'} onClick={() => navigateTo('kontak')} icon={<Phone className="w-4 h-4 mr-2" />}>Kontak</NavButton>
              
              {/* Tombol Admin Panel */}
              <div className="pl-2 ml-1 border-l border-white/20 flex items-center">
                {isAdmin ? (
                  <button onClick={handleLogout} className="flex items-center text-sm font-bold bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-xl transition shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                    <LogOut className="w-4 h-4 mr-2" /> Keluar
                  </button>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="flex items-center text-sm font-bold bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl transition border border-white/10">
                    <LogIn className="w-4 h-4 mr-2" /> Admin
                  </button>
                )}
              </div>
            </nav>

            {/* Mobile Menu Toggle & Admin */}
            <div className="lg:hidden flex items-center gap-3">
               {isAdmin ? (
                  <button onClick={handleLogout} className="p-2.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)] rounded-xl text-white">
                    <LogOut className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={() => setShowLoginModal(true)} className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white">
                    <LogIn className="w-5 h-5" />
                  </button>
                )}
              <button 
                className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-emerald-950/95 backdrop-blur-xl border-t border-white/10">
            <div className="flex flex-col px-4 pt-2 pb-4 space-y-2">
              <MobileNavButton active={currentPage === 'beranda'} onClick={() => navigateTo('beranda')}>Beranda</MobileNavButton>
              
              {/* Dropdown Profil Desa Mobile */}
              <div>
                <button
                  onClick={() => {
                    setIsMobileProfilOpen(!isMobileProfilOpen);
                    setIsMobilePemerintahOpen(false);
                  }}
                  className={`flex items-center justify-between w-full text-left px-5 py-4 rounded-xl text-lg font-bold transition-all ${
                    currentPage === 'profil' || isMobileProfilOpen
                      ? 'bg-emerald-800 text-white border-l-4 border-emerald-400 shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                  }`}
                >
                  <span>Profil Desa</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobileProfilOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileProfilOpen && (
                  <div className="flex flex-col bg-emerald-900/50 rounded-xl mt-2 mx-2 overflow-hidden border border-white/5 animate-in slide-in-from-top-2 duration-200">
                    {daftarProfil.map((profil: any) => (
                      <button
                        key={profil.id}
                        onClick={() => navigateTo('profil', profil.id)}
                        className={`text-left px-6 py-3.5 text-sm font-bold transition-colors border-l-2 ${
                          activeProfilTab === profil.id && currentPage === 'profil'
                            ? 'border-emerald-400 text-white bg-emerald-800/50'
                            : 'border-transparent text-emerald-200 hover:bg-emerald-800 hover:text-white'
                        }`}
                      >
                        {profil.judul}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dropdown Pemerintah Desa Mobile */}
              <div>
                <button
                  onClick={() => {
                    setIsMobilePemerintahOpen(!isMobilePemerintahOpen);
                    setIsMobileProfilOpen(false);
                  }}
                  className={`flex items-center justify-between w-full text-left px-5 py-4 rounded-xl text-lg font-bold transition-all ${
                    currentPage === 'pemerintah' || isMobilePemerintahOpen
                      ? 'bg-emerald-800 text-white border-l-4 border-emerald-400 shadow-inner'
                      : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                  }`}
                >
                  <span>Pemerintah Desa</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isMobilePemerintahOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobilePemerintahOpen && (
                  <div className="flex flex-col bg-emerald-900/50 rounded-xl mt-2 mx-2 overflow-hidden border border-white/5 animate-in slide-in-from-top-2 duration-200">
                    {menuPemerintah.map((menu: any) => (
                      <button
                        key={menu.id}
                        onClick={() => navigateTo('pemerintah', menu.id)}
                        className={`text-left px-6 py-3.5 text-sm font-bold transition-colors border-l-2 ${
                          activePemerintahTab === menu.id && currentPage === 'pemerintah'
                            ? 'border-emerald-400 text-white bg-emerald-800/50'
                            : 'border-transparent text-emerald-200 hover:bg-emerald-800 hover:text-white'
                        }`}
                      >
                        {menu.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <MobileNavButton active={currentPage === 'berita'} onClick={() => navigateTo('berita')}>Berita</MobileNavButton>
              <MobileNavButton active={currentPage === 'kontak'} onClick={() => navigateTo('kontak')}>Kontak</MobileNavButton>
            </div>
          </div>
        )}
      </header>

      {/* Pesan Alert Login Admin Aktif */}
      {isAdmin && (
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 text-sm font-medium text-center shadow-inner flex items-center justify-center gap-2 z-30 relative">
           <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mode Admin Aktif: Anda dapat mengedit konten halaman ini.
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'beranda' && (
          <HalamanBeranda 
            navigateTo={navigateTo} 
            isAdmin={isAdmin} 
            dataBeranda={dataBeranda} 
            setDataBeranda={setDataBeranda} 
          />
        )}
        {currentPage === 'profil' && (
          <HalamanProfilDesa 
            isAdmin={isAdmin}
            daftarProfil={daftarProfil}
            setDaftarProfil={setDaftarProfil}
            initialTabId={activeProfilTab}
            navigateTo={navigateTo}
          />
        )}
        {currentPage === 'pemerintah' && (
          <HalamanPemerintahan 
            isAdmin={isAdmin}
            activeTab={activePemerintahTab}
            daftarPerangkat={daftarPerangkat}
            setDaftarPerangkat={setDaftarPerangkat}
            daftarLembaga={daftarLembaga}
            setDaftarLembaga={setDaftarLembaga}
          />
        )}
        {currentPage === 'berita' && (
          <HalamanBerita 
            isAdmin={isAdmin} 
            daftarBerita={daftarBerita} 
            setDaftarBerita={setDaftarBerita} 
          />
        )}
        {currentPage === 'kontak' && <HalamanKontak />}
      </main>

      {/* Footer Elegan */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8 border-t-[6px] border-emerald-600">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-800 p-2.5 rounded-lg shadow-lg shadow-emerald-900/50">
                  <Landmark className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">Desa Delta Upang</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-6 font-medium">
                Website resmi Pemerintah Desa Delta Upang, Kecamatan Makarti Jaya, Kabupaten Banyuasin, Sumatera Selatan. Melayani masyarakat dengan transparansi dan inovasi.
              </p>
            </div>
            <div className="md:pl-8">
              <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                <span className="w-8 h-1 bg-emerald-500 rounded-full mr-3"></span> Tautan Cepat
              </h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigateTo('beranda')} className="text-gray-400 hover:text-emerald-400 font-medium flex items-center transition duration-200 hover:translate-x-2"><ChevronRight className="w-4 h-4 mr-2 text-emerald-500"/> Beranda</button></li>
                <li><button onClick={() => navigateTo('profil', daftarProfil[0]?.id)} className="text-gray-400 hover:text-emerald-400 font-medium flex items-center transition duration-200 hover:translate-x-2"><ChevronRight className="w-4 h-4 mr-2 text-emerald-500"/> Profil Desa</button></li>
                <li><button onClick={() => navigateTo('pemerintah', 'perangkat')} className="text-gray-400 hover:text-emerald-400 font-medium flex items-center transition duration-200 hover:translate-x-2"><ChevronRight className="w-4 h-4 mr-2 text-emerald-500"/> Pemerintah Desa</button></li>
                <li><button onClick={() => navigateTo('berita')} className="text-gray-400 hover:text-emerald-400 font-medium flex items-center transition duration-200 hover:translate-x-2"><ChevronRight className="w-4 h-4 mr-2 text-emerald-500"/> Berita Desa</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                <span className="w-8 h-1 bg-emerald-500 rounded-full mr-3"></span> Kontak
              </h4>
              <ul className="space-y-4 text-gray-400 font-medium">
                <li className="flex items-start group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-emerald-900/50 transition mr-4">
                    <MapPin className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="pt-1">Jl. Poros Desa Delta Upang, Kec. Makarti Jaya, Kab. Banyuasin, Sumsel 30972</span>
                </li>
                <li className="flex items-center group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-emerald-900/50 transition mr-4">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>(0711) XXXXXXX</span>
                </li>
                <li className="flex items-center group">
                  <div className="bg-white/5 p-2 rounded-lg group-hover:bg-emerald-900/50 transition mr-4">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span>pemdes@deltaupang.desa.id</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm font-medium">
            <p>&copy; {new Date().getFullYear()} Pemerintah Desa Delta Upang. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>

      {/* Modal Login Elegan */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 animate-in zoom-in-95 duration-300 border border-emerald-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-extrabold text-gray-800 flex items-center tracking-tight">
                <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                  <LogIn className="w-6 h-6 text-emerald-600" />
                </div>
                Login Admin
              </h3>
              <button onClick={() => setShowLoginModal(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                <label className="block text-sm font text-gray-500 mb-2">Hubungi admin untuk mendapatkan username dan password</label>
                <input 
                  type="text" 
                  name="username" 
                  required
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  placeholder="Masukkan username"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  name="password" 
                  required
                  className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  placeholder="Masukkan password"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5 mt-4"
              >
                Masuk ke Dasbor
              </button>
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mt-4">
                <p className="text-xs text-emerald-800 text-center font-medium">
                  Peringatan!:<br/>Jangan berikan informasi apapun mengenai username dan password ke pada siapapun: <b></b><b></b>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= Komponen Halaman ================= */

function HalamanBeranda({ navigateTo, isAdmin, dataBeranda, setDataBeranda }: any) {
  const [showEditor, setShowEditor] = useState(false);
  const [editForm, setEditForm] = useState(dataBeranda);

  const handleHeroBgChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 1200, false, (base64) => {
        setEditForm((prev: any) => ({ ...prev, heroBg: base64 }));
      });
      e.target.value = '';
    }
  };

  const handleLogoHeroChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 400, true, (base64) => {
        setEditForm((prev: any) => ({ ...prev, logoHero: base64 }));
      });
      e.target.value = '';
    }
  };

  const handleHeaderLogoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 300, true, (base64) => {
        setEditForm((prev: any) => ({ ...prev, headerLogo: base64 }));
      });
      e.target.value = '';
    }
  };

  const handleFotoKadesUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 400, false, (base64) => {
        setEditForm((prev: any) => ({ ...prev, fotoKades: base64 }));
      });
      e.target.value = '';
    }
  };

  const handleStatChange = (id: any, field: string, value: any) => {
    setEditForm((prev: any) => ({
      ...prev,
      stats: prev.stats.map((s: any) => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    setDataBeranda(editForm);
    setShowEditor(false);
  };

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={dataBeranda.heroBg} 
            alt="Pemandangan Desa" 
            className="w-full h-full object-cover transition-transform duration-[10s] hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>

        {isAdmin && (
          <div className="absolute top-6 left-6 z-20">
             <button 
               onClick={() => { setEditForm(dataBeranda); setShowEditor(true); }} 
               className="cursor-pointer bg-white/90 backdrop-blur hover:bg-white text-emerald-800 px-6 py-3 rounded-2xl font-bold flex items-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all hover:scale-105 border border-white/50"
             >
                <Edit className="w-5 h-5 mr-3 text-emerald-600" /> 
                Edit Konten Beranda
             </button>
          </div>
        )}
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center text-white mt-12 md:mt-16">
          
          {/* Logo Custom di Hero Atas dengan Animasi Naik Turun (Float) */}
          {dataBeranda.logoHero && (
            <img 
              src={dataBeranda.logoHero} 
              alt="Logo" 
              className="h-28 md:h-36 mx-auto drop-shadow-2xl object-contain animate-float" 
            />
          )}

          {/* Teks Berjalan (Marquee) di bawah Logo */}
          <div className="w-full max-w-4xl mx-auto overflow-hidden relative mb-6 mt-4 py-2">
            <div className="animate-roll whitespace-nowrap">
              <span 
                className="text-xl md:text-2xl lg:text-3xl font-black tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]"
              >
                Selamat Datang di Website Resmi
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
            Desa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-100">{dataBeranda.namaDesa}</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-lg whitespace-pre-line">
            {dataBeranda.deskripsiDesa}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button 
              onClick={() => navigateTo('profil')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-4 px-10 rounded-2xl shadow-[0_10px_25px_rgba(5,150,105,0.4)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(5,150,105,0.5)] border border-emerald-500"
            >
              Profil Desa
            </button>
            <button 
              onClick={() => navigateTo('berita')}
              className="bg-white hover:bg-gray-50 text-emerald-900 font-bold text-lg py-4 px-10 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.2)] transition-all transform hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.3)] border border-transparent"
            >
              Berita Terbaru
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="fill-gray-50 w-full h-auto">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-gray-50 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-bl-full -z-10 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-50 rounded-tr-full -z-10 opacity-50"></div>

            <div className="w-full md:w-1/3 flex justify-center z-10">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-700 rounded-2xl transform translate-x-4 translate-y-4 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform duration-500 shadow-lg"></div>
                <img 
                  src={dataBeranda.fotoKades} 
                  alt="Foto Kepala Desa" 
                  className="relative rounded-2xl shadow-xl w-64 h-80 object-cover z-10 border-4 border-white"
                  onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&q=80' }}
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 z-10">
              <span className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2 block">Sambutan Hangat</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Kepala Desa</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mb-8"></div>
              <p className="text-gray-600 leading-relaxed text-lg mb-8 italic relative whitespace-pre-line">
                <span className="absolute -top-4 -left-4 text-6xl text-emerald-200 opacity-50">"</span>
                {dataBeranda.sambutanKades}
                <span className="absolute -bottom-8 ml-2 text-6xl text-emerald-200 opacity-50">"</span>
              </p>
              <div>
                <div className="font-extrabold text-gray-900 text-2xl mt-4">{dataBeranda.namaKades}</div>
                <div className="text-emerald-600 font-bold mt-1 text-lg">{dataBeranda.jabatanKades}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative bg-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1592982537447-6f2a6a0a091c?w=1920&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }}></div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {dataBeranda.stats.map((stat: any) => (
              <div key={stat.id} className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.1)] hover:bg-white/10 transition-colors flex flex-col justify-center h-full relative overflow-hidden">
                <div className="text-5xl font-extrabold text-white mb-2 drop-shadow-md">{stat.num}</div>
                <div className="text-emerald-200 font-bold text-lg tracking-wide">{stat.label}</div>

                {stat.id === 1 && (
                  <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-white/10 w-full">
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-white text-xl">{stat.subLaki || "1.650"}</span>
                      <span className="text-[11px] text-emerald-100/90 font-bold uppercase tracking-wider mt-0.5">Laki-laki</span>
                    </div>
                    <div className="w-px bg-white/20"></div>
                    <div className="flex flex-col items-center">
                      <span className="font-extrabold text-white text-xl">{stat.subPerempuan || "1.600"}</span>
                      <span className="text-[11px] text-emerald-100/90 font-bold uppercase tracking-wider mt-0.5">Perempuan</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Edit Konten Beranda Khusus Admin */}
      {showEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto border border-emerald-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                   <Home className="w-6 h-6 text-emerald-600" />
                </div>
                Pengaturan Konten Beranda
              </h3>
              <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="font-extrabold text-lg text-emerald-800 mb-4 flex items-center">
                   <span className="w-6 h-1 bg-emerald-500 rounded-full mr-3"></span> Bagian Hero (Atas)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Edit Background Hero */}
                  <div className="col-span-full mb-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Gambar Latar Belakang (Hero)</label>
                    <div className="flex items-center gap-5">
                      {editForm.heroBg ? (
                         <img src={editForm.heroBg} alt="Preview Latar" className="w-32 h-20 object-cover rounded-xl shadow-sm border border-gray-200" />
                      ) : (
                         <div className="w-32 h-20 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                           <ImageIcon className="w-6 h-6 text-gray-400" />
                         </div>
                      )}
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 px-5 py-2 rounded-xl font-bold flex items-center justify-center transition-all w-max shadow-sm">
                          <Upload className="w-5 h-5 mr-2" /> Ganti Gambar Latar
                          <input type="file" accept="image/*" className="hidden" onChange={handleHeroBgChange} />
                        </label>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Gambar pemandangan untuk latar atas. Otomatis dikompres.</p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Logo Header */}
                  <div className="col-span-full mb-2">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Logo Navigasi Header (Pojok Kiri Atas)</label>
                    <div className="flex items-center gap-5">
                      {editForm.headerLogo ? (
                         <img src={editForm.headerLogo} alt="Preview Logo Header" className="w-16 h-16 object-contain bg-emerald-900 rounded-xl shadow-sm border border-emerald-800 p-2" />
                      ) : (
                         <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                           <Landmark className="w-6 h-6 text-gray-400" />
                         </div>
                      )}
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 px-5 py-2 rounded-xl font-bold flex items-center justify-center transition-all w-max shadow-sm">
                          <Upload className="w-5 h-5 mr-2" /> {editForm.headerLogo ? 'Ganti Logo Header' : 'Upload Logo Header'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleHeaderLogoChange} />
                        </label>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Logo untuk navigasi pojok kiri atas. Bebas atau biarkan default.</p>
                      </div>
                    </div>
                  </div>

                  {/* Edit Logo Tengah */}
                  <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Logo Teks Hero (Bagian Tengah)</label>
                    <div className="flex items-center gap-5">
                      {editForm.logoHero ? (
                         <img src={editForm.logoHero} alt="Preview Logo Hero" className="w-24 h-24 object-contain bg-gray-200 rounded-xl shadow-sm border border-gray-300 p-2" />
                      ) : (
                         <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                           <ImageIcon className="w-6 h-6 text-gray-400" />
                         </div>
                      )}
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 px-5 py-2 rounded-xl font-bold flex items-center justify-center transition-all w-max shadow-sm">
                          <Upload className="w-5 h-5 mr-2" /> {editForm.logoHero ? 'Ganti Logo Hero' : 'Upload Logo Hero'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleLogoHeroChange} />
                        </label>
                        <p className="text-sm text-gray-500 mt-2 font-medium">Bisa menggunakan file berformat PNG transparan.</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Desa</label>
                    <input 
                      type="text" required
                      value={editForm.namaDesa}
                      onChange={(e) => setEditForm({...editForm, namaDesa: e.target.value})}
                      className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi / Sub-judul (Gunakan Enter untuk baris baru)</label>
                    <textarea 
                      required rows={3}
                      value={editForm.deskripsiDesa}
                      onChange={(e) => setEditForm({...editForm, deskripsiDesa: e.target.value})}
                      className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium leading-relaxed" 
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="font-extrabold text-lg text-emerald-800 mb-4 flex items-center">
                   <span className="w-6 h-1 bg-emerald-500 rounded-full mr-3"></span> Bagian Sambutan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap Kepala Desa</label>
                    <input 
                      type="text" required
                      value={editForm.namaKades}
                      onChange={(e) => setEditForm({...editForm, namaKades: e.target.value})}
                      className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan (Teks)</label>
                    <input 
                      type="text" required
                      value={editForm.jabatanKades}
                      onChange={(e) => setEditForm({...editForm, jabatanKades: e.target.value})}
                      className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                    />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Foto Kepala Desa</label>
                    <div className="flex items-center gap-5">
                      <img src={editForm.fotoKades} alt="Preview Kades" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-300" />
                      <div className="flex-1">
                        <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 px-5 py-2 rounded-xl font-bold flex items-center justify-center transition-all w-max shadow-sm">
                          <Upload className="w-5 h-5 mr-2" /> Ganti Foto
                          <input type="file" accept="image/*" className="hidden" onChange={handleFotoKadesUpload} />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Isi Pesan Sambutan</label>
                    <textarea 
                      required rows={6}
                      value={editForm.sambutanKades}
                      onChange={(e) => setEditForm({...editForm, sambutanKades: e.target.value})}
                      className="w-full px-5 py-3 bg-white border border-gray-300 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium leading-relaxed" 
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h4 className="font-extrabold text-lg text-emerald-800 mb-4 flex items-center">
                   <span className="w-6 h-1 bg-emerald-500 rounded-full mr-3"></span> Pengaturan Angka Statistik Dasar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editForm.stats.map((stat: any, index: number) => (
                    <div key={stat.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                      <div className="font-bold text-gray-500 text-sm border-b pb-1">Kolom {index + 1}</div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Angka / Jumlah</label>
                         <input 
                           type="text" required
                           value={stat.num}
                           onChange={(e) => handleStatChange(stat.id, 'num', e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-700 mb-1">Label (Contoh: Total Penduduk)</label>
                         <input 
                           type="text" required
                           value={stat.label}
                           onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                         />
                      </div>
                      {stat.id === 1 && (
                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 mt-1">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Laki-laki</label>
                            <input 
                              type="text" required
                              value={stat.subLaki || ''}
                              onChange={(e) => handleStatChange(stat.id, 'subLaki', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Perempuan</label>
                            <input 
                              type="text" required
                              value={stat.subPerempuan || ''}
                              onChange={(e) => handleStatChange(stat.id, 'subPerempuan', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" 
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-3xl">
                <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5">
                  <Save className="w-5 h-5 mr-2" /> Simpan Perubahan Beranda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== KOMPONEN PROFIL DESA ==============
function HalamanProfilDesa({ isAdmin, daftarProfil, setDaftarProfil, initialTabId, navigateTo }: any) {
  const [activeTabId, setActiveTabId] = useState(initialTabId || daftarProfil[0]?.id);
  const [showEditor, setShowEditor] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Pastikan ada tab yang aktif & sinkron dengan klik dari Dropdown Navbar
  useEffect(() => {
    if (initialTabId) {
      setActiveTabId(initialTabId);
    } else if (daftarProfil.length > 0 && !daftarProfil.find((p: any) => p.id === activeTabId)) {
      setActiveTabId(daftarProfil[0].id);
    }
  }, [initialTabId, daftarProfil, activeTabId]);

  const activeProfil = daftarProfil.find((p: any) => p.id === activeTabId);

  const handleDelete = (id: any) => {
    if (window.confirm('Yakin ingin menghapus bagian profil ini?')) {
      setDaftarProfil(daftarProfil.filter((p: any) => p.id !== id));
    }
  };

  const openEditor = (profil: any = null) => {
    if (profil) {
      setEditData(profil);
    } else {
      setEditData({ id: null, iconName: 'BookOpen', judul: '', konten: '', gambar: '' });
    }
    setShowEditor(true);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (editData.id) {
      setDaftarProfil(daftarProfil.map((p: any) => p.id === editData.id ? editData : p));
    } else {
      const newProfil = { ...editData, id: Date.now() };
      setDaftarProfil([...daftarProfil, newProfil]);
      setActiveTabId(newProfil.id); 
    }
    setShowEditor(false);
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 1200, false, (base64) => {
        setEditData({ ...editData, gambar: base64 });
      });
      e.target.value = '';
    }
  };

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'Target': return <Target className={className} />;
      case 'Map': return <Map className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'BookOpen':
      default: return <BookOpen className={className} />;
    }
  };

  const isVisiMisi = activeProfil && activeProfil.judul.toLowerCase().includes('visi');
  let visiText = "";
  let misiList: string[] = [];

  if (isVisiMisi && activeProfil) {
    const text = activeProfil.konten;
    const misiIndex = text.toUpperCase().indexOf('MISI');
    
    if (misiIndex !== -1) {
        visiText = text.substring(0, misiIndex).replace(/VISI KAMI:/i, '').replace(/"/g, '').trim();
        const rawMisiText = text.substring(misiIndex);
        const cleanMisiText = rawMisiText.replace(/^MISI( DESA)?:\s*/i, '');
        misiList = cleanMisiText.split('\n').map((m: string) => m.replace(/^\d+[\.\)]\s*/, '').trim()).filter((m: string) => m);
    } else {
        visiText = text;
    }
  }

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 py-16 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col items-center justify-center">
        
        <div className="text-center mb-10 w-full max-w-4xl mx-auto">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2 block">Informasi Publik</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Profil Desa</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 text-lg leading-relaxed">
            Mengenal lebih dekat sejarah, visi misi, letak geografis, dan struktur organisasi Pemerintah Desa Delta Upang.
          </p>
        </div>

        {isAdmin && (
          <div className="w-full max-w-5xl mb-6 flex justify-end">
            <button 
              onClick={() => openEditor()} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center transition-all"
            >
              <Plus className="w-5 h-5 mr-2" /> Tambah Bagian Profil
            </button>
          </div>
        )}

        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[500px] flex flex-col mx-auto">
          {activeProfil ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex-grow flex flex-col">
              
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button onClick={() => openEditor(activeProfil)} className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl shadow-lg transition">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(activeProfil.id)} className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl shadow-lg transition">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}

              {activeProfil.gambar && (
                <div className="relative w-full h-64 md:h-96 overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={activeProfil.gambar} 
                    alt={activeProfil.judul} 
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                      <div className="flex items-center gap-3 text-emerald-300 mb-3">
                        {renderIcon(activeProfil.iconName, "w-6 h-6")}
                        <span className="font-bold tracking-widest uppercase text-sm">Bagian Profil</span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                        {activeProfil.judul}
                      </h3>
                  </div>
                </div>
              )}

              <div className={`p-6 md:p-12 flex-grow flex flex-col ${!activeProfil.gambar && 'pt-16 md:pt-20'}`}>
                {!activeProfil.gambar && (
                   <div className="mb-10 text-center">
                     <div className="inline-flex justify-center items-center bg-emerald-100 text-emerald-600 p-4 rounded-2xl mb-6 shadow-sm">
                       {renderIcon(activeProfil.iconName, "w-10 h-10")}
                     </div>
                     <h3 className="text-3xl md:text-5xl font-extrabold text-emerald-900 tracking-tight">
                       {activeProfil.judul}
                     </h3>
                   </div>
                )}
                
                <div className="flex-grow max-w-4xl mx-auto w-full">
                  {isVisiMisi ? (
                    <div className="space-y-12">
                      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl shadow-2xl p-8 md:p-14 text-center transform hover:scale-[1.02] transition-transform duration-300">
                        <h3 className="text-2xl font-extrabold text-white mb-6 tracking-widest">VISI KAMI</h3>
                        <p className="text-xl md:text-3xl text-emerald-50 font-medium leading-tight italic drop-shadow-md">
                          "{visiText}"
                        </p>
                      </div>

                      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-14 border border-gray-100 relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-[100px] -z-10"></div>
                        <h3 className="text-2xl md:text-3xl font-extrabold text-emerald-900 mb-8 text-center tracking-widest">MISI DESA</h3>
                        <div className="space-y-5">
                          {misiList.map((misi: string, index: number) => (
                            <div key={index} className="flex items-start bg-gray-50 hover:bg-emerald-50 p-5 md:p-6 rounded-2xl transition-colors duration-300 border border-gray-100 hover:border-emerald-200">
                              <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-black text-lg md:text-xl mr-4 md:mr-5 shadow-sm">
                                {index + 1}
                              </div>
                              <p className="text-gray-700 text-base md:text-xl font-medium pt-1 md:pt-1.5 leading-relaxed">{misi}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                      {activeProfil.konten}
                    </div>
                  )}
                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex justify-end w-full max-w-4xl mx-auto">
                  <button 
                    onClick={() => navigateTo('beranda')}
                    className="flex items-center text-sm md:text-base font-bold text-gray-500 hover:text-emerald-700 bg-gray-50 hover:bg-emerald-50 px-6 py-3.5 rounded-xl border border-gray-200 hover:border-emerald-200 transition-all shadow-sm hover:shadow-md"
                  >
                    <ArrowRight className="w-5 h-5 mr-2 rotate-180" /> Kembali ke Halaman Utama
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-16 text-center h-full flex flex-col items-center justify-center text-gray-400">
              <Info className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-xl font-medium">Data profil belum tersedia.</p>
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto border border-emerald-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                   <Info className="w-6 h-6 text-emerald-600" />
                </div>
                {editData.id ? 'Edit Bagian Profil' : 'Tambah Bagian Profil Baru'}
              </h3>
              <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Tab / Menu</label>
                  <input 
                    type="text" required
                    value={editData.judul}
                    onChange={(e) => setEditData({...editData, judul: e.target.value})}
                    placeholder="Contoh: Sejarah Desa"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Ikon</label>
                  <div className="relative">
                    <select 
                      required
                      value={editData.iconName}
                      onChange={(e) => setEditData({...editData, iconName: e.target.value})}
                      className="w-full px-5 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium appearance-none"
                    >
                      <option value="BookOpen">Buku (Sejarah/Cerita)</option>
                      <option value="Target">Target (Visi/Misi)</option>
                      <option value="Map">Peta (Geografis/Lokasi)</option>
                      <option value="Building2">Gedung (Struktur/Organisasi)</option>
                      <option value="Info">Info (Umum)</option>
                    </select>
                    <div className="absolute left-4 top-3.5 text-emerald-600 pointer-events-none">
                      {renderIcon(editData.iconName, "w-5 h-5")}
                    </div>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Gambar Latar Header (Opsional)</label>
                  <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    {editData.gambar ? (
                      <img src={editData.gambar} alt="Preview" className="w-32 h-20 object-cover rounded-xl shadow-sm border border-gray-200" />
                    ) : (
                      <div className="w-32 h-20 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 px-5 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-sm w-max">
                        <Upload className="w-5 h-5 mr-2" /> Upload Gambar Header
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <p className="text-sm text-gray-500 mt-2 font-medium">Gambar akan tampil cantik di atas teks.</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Isi Paragraf Profil (Gunakan enter untuk baris baru)</label>
                  <textarea 
                    required rows={10}
                    value={editData.konten}
                    onChange={(e) => setEditData({...editData, konten: e.target.value})}
                    placeholder="Ketikkan isi informasi di sini secara menarik dan meyakinkan..."
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium leading-relaxed" 
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-3xl">
                <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5">
                  <Save className="w-5 h-5 mr-2" /> Simpan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== KOMPONEN BARU: HALAMAN PEMERINTAHAN (GABUNGAN PERANGKAT & LEMBAGA DESA) ==============
function HalamanPemerintahan({ isAdmin, activeTab, daftarPerangkat, setDaftarPerangkat, daftarLembaga, setDaftarLembaga }: any) {
  const isPerangkat = activeTab === 'perangkat' || !activeTab;
  
  // States Khusus Perangkat (Tampilan Card)
  const [showEditorPerangkat, setShowEditorPerangkat] = useState(false);
  const [editDataPerangkat, setEditDataPerangkat] = useState<any>(null);

  // States Khusus Lembaga (Tampilan Tabel)
  const [showEditorLembaga, setShowEditorLembaga] = useState(false);
  const [editDataLembaga, setEditDataLembaga] = useState<any>(null);

  const getTabTitle = (tabId: string) => {
    switch(tabId) {
      case 'bpd': return 'Badan Permusyawaratan Desa (BPD)';
      case 'pkk': return 'Pemberdayaan Kesejahteraan Keluarga (PKK)';
      case 'kadus': return 'Daftar Kepala Dusun';
      case 'rt': return 'Daftar Ketua RT';
      default: return 'Struktur Organisasi';
    }
  };

  const getTabSubtitle = (tabId: string) => {
    switch(tabId) {
      case 'bpd': return 'Daftar anggota BPD yang bertugas menyalurkan aspirasi masyarakat.';
      case 'pkk': return 'Tim Penggerak PKK yang berfokus pada pemberdayaan dan kesejahteraan keluarga.';
      case 'kadus': return 'Daftar perangkat kewilayahan yang bertugas membantu Kepala Desa di wilayah Dusun.';
      case 'rt': return 'Daftar Ketua Rukun Tetangga (RT) yang menjadi ujung tombak pelayanan masyarakat.';
      default: return 'Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa Delta Upang.';
    }
  };

  /* ==== LOGIKA UNTUK PERANGKAT DESA (CARD) ==== */
  const handleDeletePerangkat = (id: any) => {
    if (window.confirm('Yakin ingin menghapus perangkat desa ini?')) {
      setDaftarPerangkat(daftarPerangkat.filter((p: any) => p.id !== id));
    }
  };
  const openEditorPerangkat = (perangkat: any = null) => {
    if (perangkat) setEditDataPerangkat(perangkat);
    else setEditDataPerangkat({ id: null, nama: '', jabatan: '', foto: '' });
    setShowEditorPerangkat(true);
  };
  const handleSavePerangkat = (e: any) => {
    e.preventDefault();
    if (editDataPerangkat.id) {
      setDaftarPerangkat(daftarPerangkat.map((p: any) => p.id === editDataPerangkat.id ? editDataPerangkat : p));
    } else {
      setDaftarPerangkat([...daftarPerangkat, { ...editDataPerangkat, id: Date.now() }]);
    }
    setShowEditorPerangkat(false);
  };
  const handleImageUploadPerangkat = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 600, false, (base64) => {
        setEditDataPerangkat({ ...editDataPerangkat, foto: base64 });
      });
      e.target.value = '';
    }
  };

  /* ==== LOGIKA UNTUK LEMBAGA (TABEL) ==== */
  const filteredLembaga = daftarLembaga.filter((l: any) => l.kategori === activeTab);
  
  const handleDeleteLembaga = (id: any) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      setDaftarLembaga(daftarLembaga.filter((l: any) => l.id !== id));
    }
  };
  const openEditorLembaga = (lembaga: any = null) => {
    if (lembaga) setEditDataLembaga(lembaga);
    else setEditDataLembaga({ id: null, kategori: activeTab, nama: '', jabatan: '', jenisKelamin: 'Laki-laki', umur: '', foto: '' });
    setShowEditorLembaga(true);
  };
  const handleSaveLembaga = (e: any) => {
    e.preventDefault();
    if (editDataLembaga.id) {
      setDaftarLembaga(daftarLembaga.map((l: any) => l.id === editDataLembaga.id ? editDataLembaga : l));
    } else {
      setDaftarLembaga([...daftarLembaga, { ...editDataLembaga, id: Date.now() }]);
    }
    setShowEditorLembaga(false);
  };
  const handleImageUploadLembaga = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 400, false, (base64) => {
        setEditDataLembaga({ ...editDataLembaga, foto: base64 });
      });
      e.target.value = '';
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 py-16 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4 lg:px-8 relative">
        
        {/* Header Bersama */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2 block">
            Pemerintahan Desa
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            {getTabTitle(activeTab)}
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            {getTabSubtitle(activeTab)}
          </p>
        </div>

        {/* =========== TAMPILAN PERANGKAT DESA (CARD) =========== */}
        {isPerangkat && (
          <div className="animate-in fade-in duration-500">
            {isAdmin && (
              <div className="mb-10 flex justify-end bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                <button 
                  onClick={() => openEditorPerangkat()} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-8 rounded-xl shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5 flex items-center transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Tambah Perangkat
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {daftarPerangkat.length === 0 && (
                 <div className="col-span-full text-center text-gray-500 py-20 bg-white rounded-3xl border border-dashed border-gray-300 font-medium text-lg">Belum ada data perangkat desa.</div>
              )}

              {daftarPerangkat.map((p: any) => (
                <div key={p.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100 group relative">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <button onClick={() => openEditorPerangkat(p)} className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl shadow-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeletePerangkat(p.id)} className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl shadow-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={p.foto} 
                      alt={p.nama} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80' }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-8 text-center relative bg-white -mt-4 rounded-t-3xl z-10">
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{p.nama}</h3>
                    <span className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-1.5 rounded-full font-bold">
                      {p.jabatan}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========== TAMPILAN LEMBAGA/LAINNYA (TABEL) =========== */}
        {!isPerangkat && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
            {isAdmin && (
              <div className="mb-6 flex justify-end">
                <button 
                  onClick={() => openEditorLembaga()} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Tambah Data
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {filteredLembaga.length === 0 ? (
                 <div className="text-center text-gray-500 py-16 bg-white font-medium text-lg">Belum ada data tersedia.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead>
                      <tr className="bg-emerald-50 text-emerald-800 text-sm tracking-wide uppercase border-b-2 border-emerald-100">
                        <th className="px-6 py-5 font-bold">No</th>
                        <th className="px-6 py-5 font-bold">Foto</th>
                        <th className="px-6 py-5 font-bold">Nama Lengkap</th>
                        <th className="px-6 py-5 font-bold">Jabatan</th>
                        <th className="px-6 py-5 font-bold">Jenis Kelamin</th>
                        <th className="px-6 py-5 font-bold">Umur</th>
                        {isAdmin && <th className="px-6 py-5 font-bold text-center">Aksi</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLembaga.map((item: any, index: number) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-500">{index + 1}</td>
                          <td className="px-6 py-4">
                            <img 
                              src={item.foto || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&q=80'} 
                              alt={item.nama} 
                              className="w-14 h-14 rounded-xl object-cover shadow-sm border border-gray-200 bg-white"
                              onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=150&q=80' }}
                            />
                          </td>
                          <td className="px-6 py-4 font-extrabold text-gray-900 text-base">{item.nama}</td>
                          <td className="px-6 py-4 text-emerald-700 font-bold bg-emerald-50/50 rounded-lg inline-block mt-3.5 mb-1.5 ml-4 px-3 py-1 border border-emerald-100/50">{item.jabatan}</td>
                          <td className="px-6 py-4 font-medium text-gray-700">{item.jenisKelamin}</td>
                          <td className="px-6 py-4 font-medium text-gray-700">{item.umur} Thn</td>
                          {isAdmin && (
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button onClick={() => openEditorLembaga(item)} className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition" title="Edit">
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteLembaga(item.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Hapus">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL EDITOR PERANGKAT DESA ================= */}
      {showEditorPerangkat && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto border border-emerald-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                   <Users className="w-6 h-6 text-emerald-600" />
                </div>
                {editDataPerangkat.id ? 'Edit Perangkat' : 'Tambah Perangkat Baru'}
              </h3>
              <button onClick={() => setShowEditorPerangkat(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSavePerangkat} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" required
                    value={editDataPerangkat.nama}
                    onChange={(e) => setEditDataPerangkat({...editDataPerangkat, nama: e.target.value})}
                    placeholder="Contoh: Bapak Fulan, S.E."
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan</label>
                  <input 
                    type="text" required
                    value={editDataPerangkat.jabatan}
                    onChange={(e) => setEditDataPerangkat({...editDataPerangkat, jabatan: e.target.value})}
                    placeholder="Contoh: Sekretaris Desa"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Foto Profil</label>
                  <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    {editDataPerangkat.foto ? (
                      <img src={editDataPerangkat.foto} alt="Preview" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 px-5 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-sm">
                        <Upload className="w-5 h-5 mr-2" /> Upload Foto Baru
                        <input type="file" accept="image/*" required={!editDataPerangkat.foto} className="hidden" onChange={handleImageUploadPerangkat} />
                      </label>
                      <p className="text-sm text-gray-500 mt-3 font-medium">Otomatis dikecilkan agar memori aman.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-3xl">
                <button type="button" onClick={() => setShowEditorPerangkat(false)} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5">
                  <Save className="w-5 h-5 mr-2" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL EDITOR LEMBAGA DESA (TABEL) ================= */}
      {showEditorLembaga && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-emerald-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                   <Users className="w-6 h-6 text-emerald-600" />
                </div>
                {editDataLembaga.id ? 'Edit Data' : 'Tambah Data Baru'}
              </h3>
              <button onClick={() => setShowEditorLembaga(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveLembaga} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    type="text" required
                    value={editDataLembaga.nama}
                    onChange={(e) => setEditDataLembaga({...editDataLembaga, nama: e.target.value})}
                    placeholder="Masukkan nama lengkap"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jabatan</label>
                  <input 
                    type="text" required
                    value={editDataLembaga.jabatan}
                    onChange={(e) => setEditDataLembaga({...editDataLembaga, jabatan: e.target.value})}
                    placeholder="Contoh: Ketua RT 01"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
                  <div className="relative">
                    <select 
                      required
                      value={editDataLembaga.jenisKelamin}
                      onChange={(e) => setEditDataLembaga({...editDataLembaga, jenisKelamin: e.target.value})}
                      className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium appearance-none"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Umur (Tahun)</label>
                  <input 
                    type="number" required min="18" max="90"
                    value={editDataLembaga.umur}
                    onChange={(e) => setEditDataLembaga({...editDataLembaga, umur: e.target.value})}
                    placeholder="Contoh: 45"
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Foto Profil</label>
                  <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    {editDataLembaga.foto ? (
                      <img src={editDataLembaga.foto} alt="Preview" className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-200" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 px-5 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-sm w-max">
                        <Upload className="w-5 h-5 mr-2" /> Upload Foto Baru
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUploadLembaga} />
                      </label>
                      <p className="text-sm text-gray-500 mt-2 font-medium">Opsional. Otomatis dikecilkan agar aman.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-3xl">
                <button type="button" onClick={() => setShowEditorLembaga(false)} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5">
                  <Save className="w-5 h-5 mr-2" /> Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function HalamanBerita({ isAdmin, daftarBerita, setDaftarBerita }: any) {
  const [showEditor, setShowEditor] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [selectedBerita, setSelectedBerita] = useState<any>(null);

  const handleDelete = (id: any) => {
    if (window.confirm('Yakin ingin menghapus berita ini?')) {
      setDaftarBerita(daftarBerita.filter((b: any) => b.id !== id));
    }
  };

  const openEditor = (berita: any = null) => {
    if (berita) {
      setEditData(berita);
    } else {
      setEditData({ id: null, judul: '', tanggal: '', kategori: '', excerpt: '', gambar: '' });
    }
    setShowEditor(true);
  };

  const handleSave = (e: any) => {
    e.preventDefault();
    if (editData.id) {
      setDaftarBerita(daftarBerita.map((b: any) => b.id === editData.id ? editData : b));
      if (selectedBerita && selectedBerita.id === editData.id) {
        setSelectedBerita(editData);
      }
    } else {
      const newBerita = { ...editData, id: Date.now() };
      setDaftarBerita([newBerita, ...daftarBerita]);
    }
    setShowEditor(false);
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      compressImage(file, 800, false, (base64) => {
        setEditData({ ...editData, gambar: base64 });
      });
      e.target.value = '';
    }
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 py-16 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4 lg:px-8 relative">
        
        {selectedBerita ? (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8 duration-500">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
               <button 
                 onClick={() => setSelectedBerita(null)} 
                 className="flex items-center text-emerald-600 hover:text-emerald-800 font-bold transition px-4 py-2 hover:bg-emerald-50 rounded-xl"
               >
                  <ArrowRight className="w-5 h-5 mr-2 rotate-180" /> Kembali ke Daftar Berita
               </button>
            </div>
            
            <div className="w-full h-64 md:h-[450px] overflow-hidden bg-gray-200">
               <img 
                 src={selectedBerita.gambar} 
                 alt={selectedBerita.judul} 
                 className="w-full h-full object-cover"
                 onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80' }}
               />
            </div>
            
            <div className="p-8 md:p-14">
               <div className="flex items-center gap-4 mb-6">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
                    {selectedBerita.kategori}
                  </span>
                  <span className="text-sm font-bold text-gray-500">{selectedBerita.tanggal}</span>
               </div>
               <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                 {selectedBerita.judul}
               </h2>
               <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-full mb-10"></div>
               
               <div className="text-gray-700 text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedBerita.excerpt}
               </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-16">
              <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2 block">Pusat Informasi</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Berita & Informasi</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 mx-auto rounded-full"></div>
              <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                Kabar terbaru seputar kegiatan, pengumuman, dan pembangunan di Desa Delta Upang.
              </p>
            </div>

            {isAdmin && (
              <div className="mb-10 flex justify-end bg-emerald-50 p-4 rounded-2xl border border-emerald-100 shadow-sm">
                <button 
                  onClick={() => openEditor()} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-8 rounded-xl shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5 flex items-center transition-all"
                >
                  <Plus className="w-5 h-5 mr-2" /> Tulis Berita Baru
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {daftarBerita.length === 0 && (
                 <div className="col-span-full text-center text-gray-500 py-20 bg-white rounded-3xl border border-dashed border-gray-300 font-medium text-lg">Belum ada berita yang diterbitkan.</div>
              )}

              {daftarBerita.map((berita: any) => (
                <div key={berita.id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col relative border border-gray-100 group overflow-hidden">
                  {isAdmin && (
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                      <button onClick={() => openEditor(berita)} className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl shadow-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(berita.id)} className="bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl shadow-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <div className="relative h-60 overflow-hidden bg-gray-200">
                    <img 
                      src={berita.gambar} 
                      alt={berita.judul} 
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                      onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600&q=80' }}
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full shadow-sm border border-emerald-100">
                      {berita.kategori}
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="text-sm font-bold text-gray-400 mb-3 flex items-center">
                      <span>{berita.tanggal}</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-4 leading-tight line-clamp-2 group-hover:text-emerald-700 transition-colors">
                      {berita.judul}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-grow line-clamp-3 text-lg leading-relaxed">
                      {berita.excerpt}
                    </p>
                    
                    <button 
                      onClick={() => setSelectedBerita(berita)}
                      className="mt-auto text-emerald-600 font-extrabold hover:text-emerald-800 flex items-center transition group-hover:underline decoration-2 underline-offset-4"
                    >
                      Baca Selengkapnya <ArrowRight className="w-5 h-5 ml-1.5 transform group-hover:translate-x-1 transition" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-emerald-100 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                <div className="bg-emerald-100 p-2 rounded-xl mr-3">
                   <Newspaper className="w-6 h-6 text-emerald-600" />
                </div>
                {editData.id ? 'Edit Berita' : 'Tambah Berita Baru'}
              </h3>
              <button onClick={() => setShowEditor(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Judul Berita</label>
                  <input 
                    type="text" required
                    value={editData.judul}
                    onChange={(e) => setEditData({...editData, judul: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                  <select 
                    required
                    value={editData.kategori}
                    onChange={(e) => setEditData({...editData, kategori: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Sosial">Sosial</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Pemberdayaan">Pemberdayaan</option>
                    <option value="Pemerintahan">Pemerintahan</option>
                    <option value="Pengumuman">Pengumuman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal Publikasi</label>
                  <input 
                    type="text" required placeholder="Contoh: 15 Okt 2024"
                    value={editData.tanggal}
                    onChange={(e) => setEditData({...editData, tanggal: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium" 
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-3">Gambar / Foto Berita</label>
                  <div className="flex items-center gap-5 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                    {editData.gambar ? (
                      <img src={editData.gambar} alt="Preview" className="w-32 h-32 object-cover rounded-xl shadow-sm border border-gray-200" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center border border-gray-300 border-dashed">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer bg-white text-emerald-700 border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 px-5 py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-sm">
                        <Upload className="w-5 h-5 mr-2" /> Upload Foto Baru
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      <p className="text-sm text-gray-500 mt-3 font-medium">Otomatis di-compress agar memori tidak penuh.</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan / Isi Berita</label>
                  <textarea 
                    required rows={5}
                    value={editData.excerpt}
                    onChange={(e) => setEditData({...editData, excerpt: e.target.value})}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium leading-relaxed" 
                  ></textarea>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-6 sticky bottom-0 bg-white p-4 -mx-8 -mb-8 rounded-b-3xl">
                <button type="button" onClick={() => setShowEditor(false)} className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold transition-colors">
                  Batal
                </button>
                <button type="submit" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] hover:shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:-translate-y-0.5">
                  <Save className="w-5 h-5 mr-2" /> Simpan Berita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function HalamanKontak() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 py-16 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm mb-2 block">Layanan Pengaduan</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Hubungi Kami</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 mx-auto rounded-full"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Punya pertanyaan, masukan, atau perlu layanan dari Pemerintah Desa? Silakan kunjungi atau hubungi kami.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-gray-100 h-full flex flex-col justify-between relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-50 rounded-tl-full -z-10"></div>

            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Informasi Kontak</h3>
              <div className="space-y-8">
                <div className="flex items-start group">
                  <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-emerald-100 group-hover:border-emerald-600">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-extrabold text-gray-900 text-xl">Alamat Kantor Desa</h4>
                    <p className="text-gray-600 leading-relaxed mt-2 text-lg">
                      Jl. Poros Desa Delta Upang, Rt. 01 Rw. 01<br/>
                      Kecamatan Makarti Jaya, Kabupaten Banyuasin<br/>
                      Provinsi Sumatera Selatan, 30972
                    </p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-emerald-100 group-hover:border-emerald-600">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-extrabold text-gray-900 text-xl">Telepon / WhatsApp</h4>
                    <p className="text-gray-600 mt-2 text-lg font-medium">(0711) XXXXXXX / 0812-XXXX-XXXX</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600 mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-emerald-100 group-hover:border-emerald-600">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div className="pt-1">
                    <h4 className="font-extrabold text-gray-900 text-xl">Email</h4>
                    <p className="text-gray-600 mt-2 text-lg font-medium">pemdes@deltaupang.desa.id</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-100 bg-gray-50 -mx-10 -mb-10 p-10 md:p-12 rounded-b-3xl">
              <h4 className="font-extrabold text-gray-900 mb-5 text-xl">Jam Pelayanan Masyarakat:</h4>
              <ul className="text-gray-700 space-y-3 text-lg">
                <li className="flex justify-between items-center bg-white p-3 px-4 rounded-xl shadow-sm border border-gray-100"><span className="font-bold">Senin - Kamis</span> <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg">08.00 - 15.00 WIB</span></li>
                <li className="flex justify-between items-center bg-white p-3 px-4 rounded-xl shadow-sm border border-gray-100"><span className="font-bold">Jumat</span> <span className="text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-lg">08.00 - 11.30 WIB</span></li>
                <li className="flex justify-between items-center bg-rose-50 p-3 px-4 rounded-xl shadow-sm border border-rose-100"><span className="font-bold text-rose-800">Sabtu - Minggu</span> <span className="text-rose-700 font-bold">Tutup</span></li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-3 rounded-3xl shadow-xl h-full min-h-[500px] border border-gray-100">
            <div className="w-full h-full bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-500 overflow-hidden relative group cursor-pointer">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Peta" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                 <div className="bg-white p-4 rounded-full shadow-2xl mb-4 group-hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] transition-all">
                   <MapPin className="w-10 h-10 text-emerald-600" />
                 </div>
                 <span className="font-extrabold text-2xl text-white drop-shadow-lg text-center px-4">Lokasi Kantor <br/> Desa Delta Upang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Helper Components ================= */

function NavButton({ children, active, onClick, icon }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-xl font-bold flex items-center transition-all duration-300 text-sm tracking-wide ${
        active 
          ? 'bg-white text-emerald-900 shadow-md' 
          : 'text-white hover:bg-white/10 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function MobileNavButton({ children, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-5 py-4 rounded-xl text-lg font-bold transition-all ${
        active 
          ? 'bg-emerald-800 text-white border-l-4 border-emerald-400 shadow-inner' 
          : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
