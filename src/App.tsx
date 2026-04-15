import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, MapPin, Phone, Mail, Facebook, Twitter, Instagram, 
  Linkedin, Share2, User, LogOut, Plus, Trash2, Edit, Upload, Calendar, ArrowUp,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// --- Types ---
interface Teacher {
  id: number;
  name: string;
  position: string;
  photoUrl: string;
}

interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
  author: string;
}

interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string;
}

// --- Components ---

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onLoginClick, isLoggedIn, onLogout, scrollToSection, onViewDashboard, schoolName }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Beranda', id: 'home' },
    { name: 'Visi Misi', id: 'visimisi' },
    { name: 'Statistik', id: 'stats' },
    { name: 'Tenaga Pendidik', id: 'teachers' },
    { name: 'Berita', id: 'news' },
  ];

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className="font-bold text-2xl text-blue-600">{schoolName}</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </button>
            ))}
            {isLoggedIn ? (
              <div className="flex gap-2">
                 <button 
                  onClick={onViewDashboard}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <User size={16} /> Dashboard
                </button>
                <button 
                  onClick={onLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition flex items-center gap-2"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={onLoginClick}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2"
              >
                <User size={16} /> Admin
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.name}
              </button>
            ))}
            {isLoggedIn ? (
               <>
                <button 
                  onClick={() => { onViewDashboard(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-blue-600 font-medium"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { onLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-red-600 font-medium"
                >
                  Logout
                </button>
               </>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsOpen(false); }}
                className="block w-full text-left px-3 py-2 text-blue-600 font-medium"
              >
                Login Admin
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ schoolName, heroImage, registrationLink }: { schoolName: string, heroImage: string, registrationLink: string }) => (
  <section 
    id="home" 
    className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-cover bg-center"
    style={{ backgroundImage: `url('${heroImage}')` }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-black/60 z-0"></div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Mewujudkan Generasi <span className="text-blue-400">Cerdas</span> & <span className="text-blue-400">Berkarakter</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Selamat Datang di Website Resmi {schoolName}. Tempat terbaik untuk menumbuhkan potensi anak sejak dini dengan kurikulum merdeka.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('visimisi')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-full text-lg font-semibold transition-all shadow-lg hover:shadow-blue-500/30"
          >
            Jelajahi Profil
          </button>
          <a 
            href={registrationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-blue-900 px-8 py-3.5 rounded-full text-lg font-semibold transition-all inline-block"
          >
            Daftar Sekarang
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const VisiMisi = ({ visi, misi }: { visi: string, misi: string[] }) => (
  <section id="visimisi" className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visi & Misi</h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-blue-50 p-8 rounded-2xl border border-blue-100 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-200 p-2 rounded-lg">🎯</span> Visi
          </h3>
          <p className="text-gray-700 leading-relaxed text-lg">
            "{visi}"
          </p>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-sky-50 p-8 rounded-2xl border border-sky-100 shadow-sm"
        >
          <h3 className="text-2xl font-bold text-sky-800 mb-4 flex items-center gap-2">
            <span className="bg-sky-200 p-2 rounded-lg">🚀</span> Misi
          </h3>
          <ul className="space-y-3 text-gray-700">
            {misi.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1.5 w-2 h-2 bg-sky-500 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

const Stats = ({ stats }: { stats: Stat[] }) => {
  return (
    <section id="stats" className="py-16 bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.id || index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-4"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-blue-100 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Teachers = ({ teachers }: { teachers: Teacher[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -320 : 320;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="teachers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tenaga Pendidik</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Guru-guru profesional yang siap membimbing putra-putri Anda.</p>
        </div>

        <div className="relative group px-4 md:px-12">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 md:-ml-6 border border-gray-100"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 md:-mr-6 border border-gray-100"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {teachers.map((teacher) => (
              <motion.div 
                key={teacher.id}
                whileHover={{ y: -10 }}
                className="min-w-[280px] md:min-w-[300px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 snap-center"
              >
                <div className="h-64 overflow-hidden">
                  <img 
                    src={teacher.photoUrl} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Image'; }}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{teacher.name}</h3>
                  <p className="text-blue-600 font-medium">{teacher.position}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const News = ({ articles, onArticleClick }: { articles: Article[], onArticleClick: (article: Article) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -350 : 350;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="news" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Berita & Kegiatan</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600">Informasi terbaru seputar kegiatan sekolah dan prestasi siswa.</p>
        </div>

        <div className="relative group px-4 md:px-12">
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 md:-ml-6 border border-gray-100"
            aria-label="Previous"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-blue-600 hover:bg-blue-50 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 md:-mr-6 border border-gray-100"
            aria-label="Next"
          >
            <ChevronRight size={24} />
          </button>

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {articles.map((article) => (
              <motion.div 
                key={article.id}
                whileHover={{ y: -5 }}
                className="min-w-[300px] md:min-w-[350px] flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 snap-center cursor-pointer group"
                onClick={() => onArticleClick(article)}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={article.imageUrl} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=News'; }}
                  />
                  <div className="absolute bottom-3 left-3 z-20 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-blue-800 flex items-center gap-1">
                    <Calendar size={12} /> {article.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                    {article.content}
                  </p>
                  <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-2 transition-transform">
                    Baca Selengkapnya →
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ArticleModal = ({ article, onClose }: { article: Article | null, onClose: () => void }) => {
  if (!article) return null;

  const shareUrl = window.location.href; // In real app, this would be specific article URL
  const shareText = `Check out this article: ${article.title}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
        break;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative h-64 sm:h-80">
            <img 
              src={article.imageUrl} 
              alt={article.title} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=News'; }}
            />
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
              <span className="flex items-center gap-1"><User size={14} /> {article.author}</span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{article.title}</h2>
            
            <div className="prose prose-blue max-w-none text-gray-700 whitespace-pre-wrap">
              {article.content}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Share2 size={16} /> Bagikan Artikel
              </h4>
              <div className="flex gap-3">
                <button onClick={() => handleShare('facebook')} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"><Facebook size={18} /></button>
                <button onClick={() => handleShare('twitter')} className="bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 transition"><Twitter size={18} /></button>
                <button onClick={() => handleShare('whatsapp')} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition"><Phone size={18} className="rotate-90" /></button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Footer = ({ 
  schoolName, 
  contactAddress, 
  contactPhone, 
  contactEmail,
  socialFacebook,
  socialInstagram,
  socialTwitter,
  socialLinkedin
}: { 
  schoolName: string, 
  contactAddress: string, 
  contactPhone: string, 
  contactEmail: string,
  socialFacebook: string,
  socialInstagram: string,
  socialTwitter: string,
  socialLinkedin: string
}) => (
  <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-blue-500">{schoolName}</span>
          </h3>
          <p className="mb-6 text-gray-400">
            Membangun generasi emas yang berakhlak mulia, cerdas, dan siap menghadapi tantangan masa depan.
          </p>
          <div className="flex space-x-4">
            {socialFacebook && socialFacebook !== '#' && <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Facebook size={20} /></a>}
            {socialInstagram && socialInstagram !== '#' && <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>}
            {socialTwitter && socialTwitter !== '#' && <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Twitter size={20} /></a>}
            {socialLinkedin && socialLinkedin !== '#' && <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition"><Linkedin size={20} /></a>}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6">Kontak Kami</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin className="text-blue-500 flex-shrink-0 mt-1" size={18} />
              <span>{contactAddress}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-blue-500 flex-shrink-0" size={18} />
              <span>{contactPhone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-blue-500 flex-shrink-0" size={18} />
              <span>{contactEmail}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-6">Lokasi</h4>
          <div className="rounded-xl overflow-hidden h-48 bg-gray-800">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.051862547671!2d106.82496467499066!3d-6.256900693731603!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3d32924483d%3A0x74d587057c20a363!2sSekolah%20Dasar%20Negeri%20Pela%20Mampang%2009%20Pagi!5e0!3m2!1sid!2sid!4v1709823456789!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} {schoolName}. All rights reserved.
      </div>
    </div>
  </footer>
);

const AdminLogin = ({ onLogin, onClose }: { onLogin: (token: string) => void, onClose: () => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      if (data.success) {
        onLogin(data.token);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      // Fallback for Vercel/Static deployment
      console.warn('Backend not reachable, using client-side fallback');
      if (username === 'admin' && password === 'admin123') {
        onLogin('demo-token');
      } else {
        setError('Login failed (Backend unreachable & Invalid Demo Credentials)');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = ({ 
  teachers, 
  articles, 
  stats,
  schoolName,
  heroImage,
  visi,
  misi,
  registrationLink,
  contactAddress,
  contactPhone,
  contactEmail,
  socialFacebook,
  socialInstagram,
  socialTwitter,
  socialLinkedin,
  onLogout, 
  refreshData,
  onHome
}: { 
  teachers: Teacher[], 
  articles: Article[], 
  stats: Stat[],
  schoolName: string,
  heroImage: string,
  visi: string,
  misi: string[],
  registrationLink: string,
  contactAddress: string,
  contactPhone: string,
  contactEmail: string,
  socialFacebook: string,
  socialInstagram: string,
  socialTwitter: string,
  socialLinkedin: string,
  onLogout: () => void,
  refreshData: () => void,
  onHome: () => void
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'articles' | 'stats' | 'settings'>('teachers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form States
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // Stats Form
  const [statLabel, setStatLabel] = useState('');
  const [statValue, setStatValue] = useState('');
  const [statIcon, setStatIcon] = useState('');

  // Settings State
  const [settingsSchoolName, setSettingsSchoolName] = useState(schoolName);
  const [settingsHeroImage, setSettingsHeroImage] = useState(heroImage);
  const [settingsVisi, setSettingsVisi] = useState(visi);
  const [settingsMisi, setSettingsMisi] = useState(misi.join('\n'));
  const [settingsRegistrationLink, setSettingsRegistrationLink] = useState(registrationLink);
  const [settingsContactAddress, setSettingsContactAddress] = useState(contactAddress);
  const [settingsContactPhone, setSettingsContactPhone] = useState(contactPhone);
  const [settingsContactEmail, setSettingsContactEmail] = useState(contactEmail);
  const [settingsSocialFacebook, setSettingsSocialFacebook] = useState(socialFacebook);
  const [settingsSocialInstagram, setSettingsSocialInstagram] = useState(socialInstagram);
  const [settingsSocialTwitter, setSettingsSocialTwitter] = useState(socialTwitter);
  const [settingsSocialLinkedin, setSettingsSocialLinkedin] = useState(socialLinkedin);

  useEffect(() => {
    setSettingsSchoolName(schoolName);
    setSettingsHeroImage(heroImage);
    setSettingsVisi(visi);
    setSettingsMisi(misi.join('\n'));
    setSettingsRegistrationLink(registrationLink);
    setSettingsContactAddress(contactAddress);
    setSettingsContactPhone(contactPhone);
    setSettingsContactEmail(contactEmail);
    setSettingsSocialFacebook(socialFacebook);
    setSettingsSocialInstagram(socialInstagram);
    setSettingsSocialTwitter(socialTwitter);
    setSettingsSocialLinkedin(socialLinkedin);
  }, [schoolName, heroImage, visi, misi, registrationLink, contactAddress, contactPhone, contactEmail, socialFacebook, socialInstagram, socialTwitter, socialLinkedin]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Always update LocalStorage first (Local-First)
    const newSettings = {
      school_name: settingsSchoolName,
      hero_image: settingsHeroImage,
      visi: settingsVisi,
      misi: JSON.stringify(settingsMisi.split('\n').filter(m => m.trim() !== '')),
      registration_link: settingsRegistrationLink,
      contact_address: settingsContactAddress,
      contact_phone: settingsContactPhone,
      contact_email: settingsContactEmail,
      social_facebook: settingsSocialFacebook,
      social_instagram: settingsSocialInstagram,
      social_twitter: settingsSocialTwitter,
      social_linkedin: settingsSocialLinkedin
    };
    localStorage.setItem('settings', JSON.stringify(newSettings));

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'school_name', value: settingsSchoolName }),
      });
      
      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'hero_image', value: settingsHeroImage }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'visi', value: settingsVisi }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'misi', value: JSON.stringify(settingsMisi.split('\n').filter(m => m.trim() !== '')) }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'registration_link', value: settingsRegistrationLink }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact_address', value: settingsContactAddress }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact_phone', value: settingsContactPhone }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'contact_email', value: settingsContactEmail }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'social_facebook', value: settingsSocialFacebook }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'social_instagram', value: settingsSocialInstagram }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'social_twitter', value: settingsSocialTwitter }),
      });

      await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'social_linkedin', value: settingsSocialLinkedin }),
      });

      refreshData();
      alert('Pengaturan berhasil disimpan');
    } catch (error) {
      console.warn('Backend sync failed, using local data');
      refreshData();
      alert('Pengaturan berhasil disimpan (Local)');
    }
  };

  const handleUpdateStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    // Always update LocalStorage first
    const localStats = JSON.parse(localStorage.getItem('stats') || '[]');
    const updatedStats = localStats.map((s: any) => 
      s.id === editingItem.id ? { ...s, label: statLabel, value: statValue, icon: statIcon } : s
    );
    localStorage.setItem('stats', JSON.stringify(updatedStats));

    try {
      await fetch(`/api/stats/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: statLabel, value: statValue, icon: statIcon }),
      });
      setIsModalOpen(false);
      setEditingItem(null);
      refreshData();
    } catch (error) {
      console.warn('Backend sync failed, using local data');
      setIsModalOpen(false);
      setEditingItem(null);
      refreshData();
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setPosition('');
    setTitle('');
    setContent('');
    setFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, type: 'teacher' | 'article' | 'stat') => {
    setEditingItem(item);
    if (type === 'teacher') {
      setName(item.name);
      setPosition(item.position);
      setFile(null);
    } else if (type === 'article') {
      setTitle(item.title);
      setContent(item.content);
      setFile(null);
    } else if (type === 'stat') {
      setStatLabel(item.label);
      setStatValue(item.value);
      setStatIcon(item.icon);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    
    // Always update LocalStorage first
    if (activeTab === 'teachers') {
      const localTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const updatedTeachers = localTeachers.filter((t: any) => t.id !== id);
      localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
    } else {
      const localArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      const updatedArticles = localArticles.filter((a: any) => a.id !== id);
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
    }

    try {
      const endpoint = activeTab === 'teachers' ? `/api/teachers/${id}` : `/api/articles/${id}`;
      await fetch(endpoint, { method: 'DELETE' });
      refreshData();
    } catch (error) {
      console.warn('Backend sync failed, using local data');
      refreshData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'stats') {
      handleUpdateStat(e);
      return;
    }

    const formData = new FormData();
    if (activeTab === 'teachers') {
      formData.append('name', name);
      formData.append('position', position);
      if (file) formData.append('photo', file);
    } else {
      formData.append('title', title);
      formData.append('content', content);
      formData.append('author', 'Admin');
      if (file) formData.append('image', file);
    }

    // Helper for image conversion
    const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

    let imageUrl = '';
    if (file) {
      imageUrl = await toBase64(file);
    } else if (editingItem) {
      imageUrl = activeTab === 'teachers' ? editingItem.photoUrl : editingItem.imageUrl;
    } else {
      imageUrl = activeTab === 'teachers' 
        ? 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'
        : 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }

    // Always update LocalStorage first
    if (activeTab === 'teachers') {
      const localTeachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      if (editingItem) {
         const updatedTeachers = localTeachers.map((t: any) => 
           t.id === editingItem.id ? { ...t, name, position, photoUrl: imageUrl } : t
         );
         localStorage.setItem('teachers', JSON.stringify(updatedTeachers));
      } else {
         const newTeacher = { id: Date.now(), name, position, photoUrl: imageUrl };
         localStorage.setItem('teachers', JSON.stringify([...localTeachers, newTeacher]));
      }
    } else {
      const localArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      if (editingItem) {
         // Article edit logic (simplified for demo)
         const updatedArticles = localArticles.map((a: any) => 
           a.id === editingItem.id ? { ...a, title, content, imageUrl } : a
         );
         localStorage.setItem('articles', JSON.stringify(updatedArticles));
      } else {
         const newArticle = { 
           id: Date.now(), 
           title, 
           content, 
           imageUrl, 
           date: new Date().toISOString().split('T')[0], 
           author: 'Admin' 
         };
         localStorage.setItem('articles', JSON.stringify([...localArticles, newArticle]));
      }
    }

    try {
      const url = activeTab === 'teachers' 
        ? (editingItem ? `/api/teachers/${editingItem.id}` : '/api/teachers')
        : (editingItem ? `/api/articles/${editingItem.id}` : '/api/articles'); 

      if (activeTab === 'articles' && editingItem) {
          // We handle local edit above, so we can proceed or skip API if we know it fails
      }

      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });
      if (!res.ok) throw new Error('API Error');

      setIsModalOpen(false);
      refreshData();
    } catch (error) {
      console.warn('Backend sync failed, using local data');
      setIsModalOpen(false);
      refreshData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <div className="flex gap-3">
            <button onClick={onHome} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
               Lihat Website
            </button>
            <button onClick={onLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('teachers')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'teachers' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manajemen Guru
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'articles' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manajemen Artikel
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'stats' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Statistik
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex-1 py-4 text-center font-medium ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Pengaturan
            </button>
          </div>

          <div className="p-6">
            {activeTab !== 'settings' && activeTab !== 'stats' && (
              <div className="flex justify-end mb-6">
                <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                  <Plus size={18} /> Tambah {activeTab === 'teachers' ? 'Guru' : 'Artikel'}
                </button>
              </div>
            )}

            {activeTab === 'teachers' && (
              <div className="grid gap-4">
                {teachers.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      <img src={t.photoUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900">{t.name}</h4>
                        <p className="text-sm text-gray-500">{t.position}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(t, 'teacher')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'articles' && (
              <div className="grid gap-4">
                {articles.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      <img src={a.imageUrl} alt={a.title} className="w-16 h-12 rounded object-cover" />
                      <div>
                        <h4 className="font-bold text-gray-900 line-clamp-1">{a.title}</h4>
                        <p className="text-sm text-gray-500">{a.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* <button onClick={() => openEditModal(a)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button> */}
                      <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="grid gap-4">
                {stats.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{s.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-900">{s.label}</h4>
                        <p className="text-sm text-gray-500">{s.value}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(s, 'stat')} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama Sekolah</label>
                    <input 
                      type="text" 
                      value={settingsSchoolName}
                      onChange={(e) => setSettingsSchoolName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="Masukkan nama sekolah"
                    />
                    <p className="mt-2 text-sm text-gray-500">Nama ini akan muncul di header, footer, dan halaman utama website.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL Foto Hero Section</label>
                    <input 
                      type="text" 
                      value={settingsHeroImage}
                      onChange={(e) => setSettingsHeroImage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="mt-2 text-sm text-gray-500">Masukkan URL gambar untuk background hero section.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visi</label>
                    <textarea 
                      value={settingsVisi}
                      onChange={(e) => setSettingsVisi(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-24"
                      placeholder="Masukkan visi sekolah"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Misi</label>
                    <textarea 
                      value={settingsMisi}
                      onChange={(e) => setSettingsMisi(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition h-48"
                      placeholder="Masukkan misi sekolah (satu per baris)"
                    />
                    <p className="mt-2 text-sm text-gray-500">Pisahkan setiap poin misi dengan baris baru (Enter).</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Pendaftaran</label>
                    <input 
                      type="text" 
                      value={settingsRegistrationLink}
                      onChange={(e) => setSettingsRegistrationLink(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      placeholder="https://forms.google.com/..."
                    />
                    <p className="mt-2 text-sm text-gray-500">Link yang akan dibuka saat tombol 'Daftar Sekarang' diklik.</p>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Kontak Kami (Footer)</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                        <input 
                          type="text" 
                          value={settingsContactAddress}
                          onChange={(e) => setSettingsContactAddress(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="Jl. Pendidikan No. 123..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                        <input 
                          type="text" 
                          value={settingsContactPhone}
                          onChange={(e) => setSettingsContactPhone(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="(021) 1234-5678"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input 
                          type="text" 
                          value={settingsContactEmail}
                          onChange={(e) => setSettingsContactEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="info@sekolah.sch.id"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Sosial Media (Footer)</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                        <input 
                          type="text" 
                          value={settingsSocialFacebook}
                          onChange={(e) => setSettingsSocialFacebook(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="https://facebook.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                        <input 
                          type="text" 
                          value={settingsSocialInstagram}
                          onChange={(e) => setSettingsSocialInstagram(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="https://instagram.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter (X) URL</label>
                        <input 
                          type="text" 
                          value={settingsSocialTwitter}
                          onChange={(e) => setSettingsSocialTwitter(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="https://twitter.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                        <input 
                          type="text" 
                          value={settingsSocialLinkedin}
                          onChange={(e) => setSettingsSocialLinkedin(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Simpan Perubahan
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold mb-4">
              {activeTab === 'stats' ? 'Edit Statistik' : (editingItem ? 'Edit' : 'Tambah')} {activeTab === 'teachers' ? 'Guru' : 'Artikel'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'teachers' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Jabatan</label>
                    <input type="text" value={position} onChange={e => setPosition(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                </>
              )}
              
              {activeTab === 'articles' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Judul Artikel</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Konten</label>
                    <textarea value={content} onChange={e => setContent(e.target.value)} className="w-full border p-2 rounded h-32" required />
                  </div>
                </>
              )}

              {activeTab === 'stats' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Label</label>
                    <input type="text" value={statLabel} onChange={e => setStatLabel(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nilai</label>
                    <input type="text" value={statValue} onChange={e => setStatValue(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                    <input type="text" value={statIcon} onChange={e => setStatIcon(e.target.value)} className="w-full border p-2 rounded" required />
                  </div>
                </>
              )}
              
              {activeTab !== 'stats' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Foto</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition relative">
                    <input 
                      type="file" 
                      onChange={e => setFile(e.target.files ? e.target.files[0] : null)} 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <div className="flex flex-col items-center text-gray-500">
                      <Upload size={24} className="mb-2" />
                      <span className="text-sm">{file ? file.name : 'Klik untuk upload foto'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Batal</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [schoolName, setSchoolName] = useState('SD Harapan Bangsa');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
  const [visi, setVisi] = useState('Terwujudnya peserta didik yang beriman, cerdas, terampil, mandiri, dan berwawasan global.');
  const [misi, setMisi] = useState([
    'Melaksanakan pembelajaran yang aktif, kreatif, dan menyenangkan.',
    'Menanamkan nilai-nilai keimanan dan ketaqwaan.',
    'Mengembangkan bakat dan minat siswa melalui ekstrakurikuler.',
    'Mewujudkan lingkungan sekolah yang bersih dan asri.'
  ]);
  const [registrationLink, setRegistrationLink] = useState('#');
  const [contactAddress, setContactAddress] = useState('Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345');
  const [contactPhone, setContactPhone] = useState('(021) 1234-5678');
  const [contactEmail, setContactEmail] = useState('info@sdharapanbangsa.sch.id');
  const [socialFacebook, setSocialFacebook] = useState('#');
  const [socialInstagram, setSocialInstagram] = useState('#');
  const [socialTwitter, setSocialTwitter] = useState('#');
  const [socialLinkedin, setSocialLinkedin] = useState('#');
  const [view, setView] = useState<'home' | 'admin'>('home');

  const fetchData = async () => {
    try {
      // Try LocalStorage First (Local-First Architecture for Vercel Demo)
      const localTeachers = localStorage.getItem('teachers');
      const localArticles = localStorage.getItem('articles');
      const localStats = localStorage.getItem('stats');
      const localSettings = localStorage.getItem('settings');

      if (localTeachers) setTeachers(JSON.parse(localTeachers));
      if (localArticles) setArticles(JSON.parse(localArticles));
      if (localStats) setStats(JSON.parse(localStats));
      if (localSettings) {
        const settings = JSON.parse(localSettings);
        if (settings.school_name) setSchoolName(settings.school_name);
        if (settings.hero_image) setHeroImage(settings.hero_image);
        if (settings.visi) setVisi(settings.visi);
        if (settings.misi) {
          try {
             setMisi(typeof settings.misi === 'string' ? JSON.parse(settings.misi) : settings.misi);
          } catch(e) { setMisi(settings.misi || []) }
        }
        if (settings.registration_link) setRegistrationLink(settings.registration_link);
        if (settings.contact_address) setContactAddress(settings.contact_address);
        if (settings.contact_phone) setContactPhone(settings.contact_phone);
        if (settings.contact_email) setContactEmail(settings.contact_email);
        if (settings.social_facebook) setSocialFacebook(settings.social_facebook);
        if (settings.social_instagram) setSocialInstagram(settings.social_instagram);
        if (settings.social_twitter) setSocialTwitter(settings.social_twitter);
        if (settings.social_linkedin) setSocialLinkedin(settings.social_linkedin);
      }

      // If we have local data, we can stop or try to fetch fresh data
      // For this demo, if local data exists, we prioritize it to ensure persistence
      if (localTeachers && localArticles && localStats && localSettings) {
        return; 
      }

      const tRes = await fetch('/api/teachers');
      if (!tRes.ok) throw new Error('API Error');
      const aRes = await fetch('/api/articles');
      const sRes = await fetch('/api/settings');
      const stRes = await fetch('/api/stats');
      
      const tData = await tRes.json();
      const aData = await aRes.json();
      const sData = await sRes.json();
      const stData = await stRes.json();

      setTeachers(tData);
      setArticles(aData);
      setStats(stData);
      
      // Seed LocalStorage if empty
      if (!localTeachers) localStorage.setItem('teachers', JSON.stringify(tData));
      if (!localArticles) localStorage.setItem('articles', JSON.stringify(aData));
      if (!localStats) localStorage.setItem('stats', JSON.stringify(stData));

      const settings = sData;
      if (settings.school_name) {
        setSchoolName(settings.school_name);
      }
      if (settings.hero_image) {
        setHeroImage(settings.hero_image);
      }
      if (settings.visi) {
        setVisi(settings.visi);
      }
      if (settings.misi) {
        try {
          setMisi(JSON.parse(settings.misi));
        } catch (e) {
          console.error("Failed to parse misi", e);
        }
      }
      if (settings.registration_link) {
        setRegistrationLink(settings.registration_link);
      }
      if (settings.contact_address) {
        setContactAddress(settings.contact_address);
      }
      if (settings.contact_phone) {
        setContactPhone(settings.contact_phone);
      }
      if (settings.contact_email) {
        setContactEmail(settings.contact_email);
      }
      if (settings.social_facebook) setSocialFacebook(settings.social_facebook);
      if (settings.social_instagram) setSocialInstagram(settings.social_instagram);
      if (settings.social_twitter) setSocialTwitter(settings.social_twitter);
      if (settings.social_linkedin) setSocialLinkedin(settings.social_linkedin);
      
      // Seed Settings
      if (!localSettings) {
         const settingsObj = {
            school_name: settings.school_name,
            hero_image: settings.hero_image,
            visi: settings.visi,
            misi: settings.misi,
            registration_link: settings.registration_link,
            contact_address: settings.contact_address,
            contact_phone: settings.contact_phone,
            contact_email: settings.contact_email,
            social_facebook: settings.social_facebook || '#',
            social_instagram: settings.social_instagram || '#',
            social_twitter: settings.social_twitter || '#',
            social_linkedin: settings.social_linkedin || '#'
         };
         localStorage.setItem('settings', JSON.stringify(settingsObj));
      }

    } catch (e) {
      console.error("Failed to fetch data, using mock data", e);
      
      // Mock Data Fallback (Only if LocalStorage is also empty)
      if (!localStorage.getItem('teachers')) {
        const mockTeachers = [
          { id: 1, name: 'Budi Santoso', position: 'Kepala Sekolah', photoUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
          { id: 2, name: 'Siti Aminah', position: 'Guru Matematika', photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' },
          { id: 3, name: 'Ahmad Rizki', position: 'Guru Olahraga', photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80' }
        ];
        setTeachers(mockTeachers);
        localStorage.setItem('teachers', JSON.stringify(mockTeachers));
      }

      if (!localStorage.getItem('articles')) {
        const mockArticles = [
          { id: 1, title: 'Penerimaan Siswa Baru 2024', content: 'SD Harapan Bangsa membuka pendaftaran siswa baru untuk tahun ajaran 2024/2025. Segera daftarkan putra-putri Anda!', imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', date: '2024-01-01', author: 'Admin' },
          { id: 2, title: 'Juara 1 Lomba Cerdas Cermat', content: 'Selamat kepada tim cerdas cermat SD Harapan Bangsa yang telah meraih juara 1 tingkat kecamatan.', imageUrl: 'https://images.unsplash.com/photo-1577896335477-2858506f970d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', date: '2024-02-15', author: 'Admin' }
        ];
        setArticles(mockArticles);
        localStorage.setItem('articles', JSON.stringify(mockArticles));
      }

      if (!localStorage.getItem('stats')) {
        const mockStats = [
          { id: 1, label: 'Siswa', value: '450+', icon: '🎓' },
          { id: 2, label: 'Guru', value: '32', icon: '👩‍🏫' },
          { id: 3, label: 'Kelas', value: '18', icon: '🏫' },
          { id: 4, label: 'Prestasi', value: '120+', icon: '🏆' }
        ];
        setStats(mockStats);
        localStorage.setItem('stats', JSON.stringify(mockStats));
      }
      
      if (!localStorage.getItem('settings')) {
         const mockSettings = {
            school_name: 'SD Harapan Bangsa',
            hero_image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            visi: 'Terwujudnya peserta didik yang beriman, cerdas, terampil, mandiri, dan berwawasan global.',
            misi: JSON.stringify([
              'Melaksanakan pembelajaran yang aktif, kreatif, dan menyenangkan.',
              'Menanamkan nilai-nilai keimanan dan ketaqwaan.',
              'Mengembangkan bakat dan minat siswa melalui ekstrakurikuler.',
              'Mewujudkan lingkungan sekolah yang bersih dan asri.'
            ]),
            registration_link: '#',
            contact_address: 'Jl. Pendidikan No. 123, Jakarta Selatan, DKI Jakarta 12345',
            contact_phone: '(021) 1234-5678',
            contact_email: 'info@sdharapanbangsa.sch.id',
            social_facebook: '#',
            social_instagram: '#',
            social_twitter: '#',
            social_linkedin: '#'
         };
         localStorage.setItem('settings', JSON.stringify(mockSettings));
      }
    }
  };

  useEffect(() => {
    fetchData();
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setView('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setView('home');
  };

  const handleViewDashboard = () => {
    setView('admin');
  };

  const handleViewHome = () => {
    setView('home');
  };

  const scrollToSection = (id: string) => {
    setView('home');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (view === 'admin' && isLoggedIn) {
    return (
      <AdminDashboard 
        teachers={teachers} 
        articles={articles} 
        stats={stats}
        schoolName={schoolName}
        heroImage={heroImage}
        visi={visi}
        misi={misi}
        registrationLink={registrationLink}
        contactAddress={contactAddress}
        contactPhone={contactPhone}
        contactEmail={contactEmail}
        socialFacebook={socialFacebook}
        socialInstagram={socialInstagram}
        socialTwitter={socialTwitter}
        socialLinkedin={socialLinkedin}
        onLogout={handleLogout} 
        refreshData={fetchData}
        onHome={handleViewHome}
      />
    );
  }

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Navbar 
        onLoginClick={() => setShowLoginModal(true)} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        scrollToSection={scrollToSection}
        onViewDashboard={handleViewDashboard}
        schoolName={schoolName}
      />
      
      <main>
        <Hero schoolName={schoolName} heroImage={heroImage} registrationLink={registrationLink} />
        <VisiMisi visi={visi} misi={misi} />
        <Stats stats={stats} />
        <Teachers teachers={teachers} />
        <News articles={articles} onArticleClick={setSelectedArticle} />
      </main>

      <Footer 
        schoolName={schoolName} 
        contactAddress={contactAddress}
        contactPhone={contactPhone}
        contactEmail={contactEmail}
        socialFacebook={socialFacebook}
        socialInstagram={socialInstagram}
        socialTwitter={socialTwitter}
        socialLinkedin={socialLinkedin}
      />
      <ScrollToTop />

      {showLoginModal && (
        <AdminLogin onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />
      )}

      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
      )}
    </div>
  );
}
