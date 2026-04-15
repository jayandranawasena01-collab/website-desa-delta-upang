import React, { useState, useEffect } from 'react';
import { 
  Menu, X, Home, Info, Users, Newspaper, Phone, 
  MapPin, Mail, ChevronRight, Landmark, ArrowRight
} from 'lucide-react';

export default function App() {
  // State untuk mengatur halaman yang sedang aktif
  const [currentPage, setCurrentPage] = useState('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efek untuk scroll ke atas setiap kali pindah halaman
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-800">
      {/* Header & Navbar */}
      <header className="bg-emerald-800 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo & Title */}
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigateTo('beranda')}
            >
              <div className="bg-white p-2 rounded-full">
                <Landmark className="h-8 w-8 text-emerald-800" />
              </div>
              <div>
                <h1 className="text-xl font-bold leading-tight">Desa Delta Upang</h1>
                <p className="text-xs text-emerald-200">Kec. Makarti Jaya, Kab. Banyuasin</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              <NavButton active={currentPage === 'beranda'} onClick={() => navigateTo('beranda')} icon={<Home className="w-4 h-4 mr-2" />}>Beranda</NavButton>
              <NavButton active={currentPage === 'visimisi'} onClick={() => navigateTo('visimisi')} icon={<Info className="w-4 h-4 mr-2" />}>Visi & Misi</NavButton>
              <NavButton active={currentPage === 'perangkat'} onClick={() => navigateTo('perangkat')} icon={<Users className="w-4 h-4 mr-2" />}>Perangkat Desa</NavButton>
              <NavButton active={currentPage === 'berita'} onClick={() => navigateTo('berita')} icon={<Newspaper className="w-4 h-4 mr-2" />}>Berita</NavButton>
              <NavButton active={currentPage === 'kontak'} onClick={() => navigateTo('kontak')} icon={<Phone className="w-4 h-4 mr-2" />}>Kontak</NavButton>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 rounded-md hover:bg-emerald-700 transition"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-emerald-900 border-t border-emerald-700">
            <div className="flex flex-col px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavButton active={currentPage === 'beranda'} onClick={() => navigateTo('beranda')}>Beranda</MobileNavButton>
              <MobileNavButton active={currentPage === 'visimisi'} onClick={() => navigateTo('visimisi')}>Visi & Misi</MobileNavButton>
              <MobileNavButton active={currentPage === 'perangkat'} onClick={() => navigateTo('perangkat')}>Perangkat Desa</MobileNavButton>
              <MobileNavButton active={currentPage === 'berita'} onClick={() => navigateTo('berita')}>Berita</MobileNavButton>
              <MobileNavButton active={currentPage === 'kontak'} onClick={() => navigateTo('kontak')}>Kontak</MobileNavButton>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'beranda' && <HalamanBeranda navigateTo={navigateTo} />}
        {currentPage === 'visimisi' && <HalamanVisiMisi />}
        {currentPage === 'perangkat' && <HalamanPerangkatDesa />}
        {currentPage === 'berita' && <HalamanBerita />}
        {currentPage === 'kontak' && <HalamanKontak />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Landmark className="h-8 w-8 text-emerald-500" />
                <h3 className="text-xl font-bold">Pemerintah Desa Delta Upang</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">
                Website resmi Pemerintah Desa Delta Upang, Kecamatan Makarti Jaya, Kabupaten Banyuasin, Sumatera Selatan. Media informasi dan transparansi publik.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Tautan Cepat</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigateTo('beranda')} className="text-gray-400 hover:text-emerald-400 flex items-center transition"><ChevronRight className="w-4 h-4 mr-1"/> Beranda</button></li>
                <li><button onClick={() => navigateTo('visimisi')} className="text-gray-400 hover:text-emerald-400 flex items-center transition"><ChevronRight className="w-4 h-4 mr-1"/> Visi & Misi</button></li>
                <li><button onClick={() => navigateTo('perangkat')} className="text-gray-400 hover:text-emerald-400 flex items-center transition"><ChevronRight className="w-4 h-4 mr-1"/> Perangkat Desa</button></li>
                <li><button onClick={() => navigateTo('berita')} className="text-gray-400 hover:text-emerald-400 flex items-center transition"><ChevronRight className="w-4 h-4 mr-1"/> Berita Desa</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Kontak Kami</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-emerald-500 mt-1" />
                  <span>Jl. Poros Desa Delta Upang, Kec. Makarti Jaya, Kab. Banyuasin, Sumsel 30972</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-emerald-500" />
                  <span>(0711) XXXXXXX</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-emerald-500" />
                  <span>pemdes@deltaupang.desa.id</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Pemerintah Desa Delta Upang. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= Komponen Halaman ================= */

function HalamanBeranda({ navigateTo }) {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Pemandangan Desa" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-600 bg-opacity-80 text-sm font-semibold mb-4 tracking-wider">
            SELAMAT DATANG DI WEBSITE RESMI
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">Desa Delta Upang</h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Kecamatan Makarti Jaya, Kabupaten Banyuasin <br className="hidden md:block"/> Provinsi Sumatera Selatan
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigateTo('visimisi')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-1"
            >
              Profil Desa
            </button>
            <button 
              onClick={() => navigateTo('berita')}
              className="bg-white hover:bg-gray-100 text-emerald-900 font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-1"
            >
              Berita Terbaru
            </button>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Desa */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-600 rounded-2xl transform translate-x-4 translate-y-4"></div>
                <img 
                  src="https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Foto Kepala Desa" 
                  className="relative rounded-2xl shadow-xl w-64 h-80 object-cover z-10 border-4 border-white"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Sambutan Kepala Desa</h2>
              <div className="w-20 h-1 bg-emerald-500 mb-6"></div>
              <p className="text-gray-600 leading-relaxed text-lg mb-6">
                "Assalamu'alaikum Warahmatullahi Wabarakatuh. Puji syukur kita panjatkan ke hadirat Allah SWT. Selamat datang di website resmi Desa Delta Upang. Melalui media ini, kami berupaya mewujudkan transparansi dan kemudahan akses informasi bagi seluruh warga dan masyarakat luas mengenai program kerja, kegiatan, dan pembangunan di desa kita tercinta."
              </p>
              <div className="font-bold text-gray-800 text-xl">Bapak Fulan, S.E.</div>
              <div className="text-emerald-600 font-medium">Kepala Desa Delta Upang</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">3.250</div>
              <div className="text-emerald-200">Total Penduduk</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">800</div>
              <div className="text-emerald-200">Kepala Keluarga</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">4</div>
              <div className="text-emerald-200">Dusun</div>
            </div>
            <div className="p-4">
              <div className="text-4xl font-bold mb-2">16</div>
              <div className="text-emerald-200">Rukun Tetangga (RT)</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HalamanVisiMisi() {
  return (
    <div className="animate-in fade-in duration-500 py-12 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Visi & Misi</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Arah dan tujuan pembangunan Pemerintah Desa Delta Upang untuk kesejahteraan masyarakat.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Visi */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 border-t-4 border-emerald-500">
            <h3 className="text-2xl font-bold text-emerald-800 mb-4 text-center">VISI</h3>
            <p className="text-xl text-center font-medium text-gray-700 leading-relaxed italic">
              "Terwujudnya Desa Delta Upang yang Mandiri, Sejahtera, Religius, dan Berbudaya melalui Tata Kelola Pemerintahan yang Baik dan Inovatif."
            </p>
          </div>

          {/* Misi */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-emerald-800 mb-6 text-center">MISI</h3>
            <div className="space-y-4">
              {[
                "Meningkatkan kualitas pelayanan publik administrasi kependudukan yang cepat, tepat, dan transparan.",
                "Meningkatkan pembangunan infrastruktur jalan, jembatan, dan fasilitas umum desa yang berkualitas dan merata.",
                "Memberdayakan ekonomi kerakyatan dan pertanian melalui optimalisasi BUMDes dan Kelompok Tani.",
                "Meningkatkan kualitas sumber daya manusia melalui dukungan pada sektor pendidikan dan kesehatan dasar.",
                "Melestarikan nilai-nilai gotong royong, budaya lokal, dan kerukunan antar umat beragama.",
                "Meningkatkan tata kelola pemerintahan desa yang bersih, jujur, transparan dan akuntabel."
              ].map((misi, index) => (
                <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-lg mr-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-lg pt-1">{misi}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HalamanPerangkatDesa() {
  const perangkat = [
    { nama: "Bapak Fulan, S.E.", jabatan: "Kepala Desa", foto: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { nama: "Ahmad Yani, S.IP.", jabatan: "Sekretaris Desa", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { nama: "Siti Rahmawati", jabatan: "Kaur Keuangan", foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { nama: "Budi Santoso", jabatan: "Kaur Perencanaan", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { nama: "Dewi Lestari", jabatan: "Kasi Pemerintahan", foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
    { nama: "Herman Pelani", jabatan: "Kasi Kesejahteraan", foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" },
  ];

  return (
    <div className="animate-in fade-in duration-500 py-12 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Perangkat Desa</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Struktur Organisasi dan Tata Kerja (SOTK) Pemerintah Desa Delta Upang.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {perangkat.map((p, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
              <img 
                src={p.foto} 
                alt={p.nama} 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-1">{p.nama}</h3>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full font-medium">
                  {p.jabatan}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HalamanBerita() {
  const daftarBerita = [
    {
      id: 1,
      judul: "Penyaluran Bantuan Langsung Tunai (BLT) Dana Desa Tahap III",
      tanggal: "12 Okt 2024",
      kategori: "Sosial",
      gambar: "https://images.unsplash.com/photo-1593113565694-c6f130d24c3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      excerpt: "Pemerintah Desa Delta Upang kembali menyalurkan Bantuan Langsung Tunai (BLT) yang bersumber dari Dana Desa (DD) kepada keluarga penerima manfaat..."
    },
    {
      id: 2,
      judul: "Kerja Bakti Bersih Desa Menyambut Musim Penghujan",
      tanggal: "05 Okt 2024",
      kategori: "Kegiatan",
      gambar: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      excerpt: "Mengantisipasi datangnya musim penghujan, warga Desa Delta Upang bergotong royong membersihkan saluran air dan fasilitas umum guna mencegah banjir..."
    },
    {
      id: 3,
      judul: "Pelatihan Pembuatan Pupuk Kompos untuk Kelompok Tani",
      tanggal: "28 Sep 2024",
      kategori: "Pemberdayaan",
      gambar: "https://images.unsplash.com/photo-1592982537447-6f2a6a0a091c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      excerpt: "BUMDes bekerja sama dengan penyuluh pertanian kecamatan mengadakan pelatihan pembuatan pupuk kompos organik yang diikuti oleh 30 petani lokal..."
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 py-12 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Berita & Informasi</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Kabar terbaru seputar kegiatan, pengumuman, dan pembangunan di Desa Delta Upang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {daftarBerita.map((berita) => (
            <div key={berita.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={berita.gambar} 
                  alt={berita.judul} 
                  className="w-full h-full object-cover transition duration-500 hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded">
                  {berita.kategori}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="text-sm text-gray-500 mb-2 flex items-center">
                  <span>{berita.tanggal}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 leading-snug line-clamp-2">
                  {berita.judul}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                  {berita.excerpt}
                </p>
                <button className="mt-auto text-emerald-600 font-semibold hover:text-emerald-800 flex items-center transition">
                  Baca Selengkapnya <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HalamanKontak() {
  return (
    <div className="animate-in fade-in duration-500 py-12 bg-gray-50 min-h-[70vh]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hubungi Kami</h2>
          <div className="w-24 h-1 bg-emerald-500 mx-auto rounded"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Punya pertanyaan atau masukan untuk Pemerintah Desa? Silakan hubungi kami.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info Kontak */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Informasi Kontak</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Alamat Kantor Desa</h4>
                  <p className="text-gray-600 leading-relaxed mt-1">
                    Jl. Poros Desa Delta Upang, Rt. 01 Rw. 01<br/>
                    Kecamatan Makarti Jaya, Kabupaten Banyuasin<br/>
                    Provinsi Sumatera Selatan, 30972
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Telepon / WhatsApp</h4>
                  <p className="text-gray-600 mt-1">(0711) XXXXXXX / 0812-XXXX-XXXX</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">Email</h4>
                  <p className="text-gray-600 mt-1">pemdes@deltaupang.desa.id</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Jam Pelayanan Masyarakat:</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex justify-between"><span>Senin - Kamis</span> <span>08.00 - 15.00 WIB</span></li>
                <li className="flex justify-between"><span>Jumat</span> <span>08.00 - 11.30 WIB</span></li>
                <li className="flex justify-between text-red-500"><span>Sabtu - Minggu</span> <span>Tutup</span></li>
              </ul>
            </div>
          </div>

          {/* Form / Map (Placeholder) */}
          <div className="bg-white p-2 rounded-xl shadow-md h-[500px]">
             {/* Karena tidak bisa embed gmap secara dinamis tanpa key, pakai ilustrasi */}
            <div className="w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 overflow-hidden relative">
              <img 
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Peta" 
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <MapPin className="w-16 h-16 text-emerald-600 mb-2" />
                 <span className="font-bold text-xl text-gray-800">Lokasi Kantor Desa Delta Upang</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= Helper Components ================= */

function NavButton({ children, active, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium flex items-center transition-colors duration-200 ${
        active 
          ? 'bg-emerald-900 text-white' 
          : 'text-emerald-50 hover:bg-emerald-700 hover:text-white'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function MobileNavButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-3 rounded-md text-base font-medium transition-colors ${
        active 
          ? 'bg-emerald-800 text-white border-l-4 border-emerald-400' 
          : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
