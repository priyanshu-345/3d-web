import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TextMorph from '../components/TextMorph';

/* ─────────────────────────────────────────────
   CSS GALAXY BACKGROUND (zero WebGL, instant load)
───────────────────────────────────────────── */
const GalaxyBackground = () => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#020617', overflow: 'hidden' }}>
    {/* Galaxy core glow */}
    <div style={{
      position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
      width: '500px', height: '500px', borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(255,213,128,0.2) 0%, rgba(99,102,241,0.1) 40%, transparent 70%)',
      filter: 'blur(40px)',
      animation: 'galCore 15s ease-in-out infinite alternate',
    }} />
    {/* Spiral arm 1 */}
    <div style={{
      position: 'absolute', top: '20%', left: '10%', width: '60vw', height: '60vw', borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)',
      filter: 'blur(30px)',
      animation: 'galArm1 20s linear infinite',
    }} />
    {/* Spiral arm 2 */}
    <div style={{
      position: 'absolute', bottom: '10%', right: '5%', width: '50vw', height: '50vw', borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(236,72,153,0.1) 0%, transparent 70%)',
      filter: 'blur(30px)',
      animation: 'galArm2 25s linear infinite',
    }} />
    {/* Nebula cloud */}
    <div style={{
      position: 'absolute', top: '60%', left: '30%', width: '40vw', height: '30vw', borderRadius: '50%',
      background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)',
      filter: 'blur(25px)',
      animation: 'galArm1 18s linear infinite reverse',
    }} />
    {/* Star particles - CSS */}
    {Array.from({ length: 60 }).map((_, i) => (
      <div key={i} style={{
        position: 'absolute',
        width: `${1 + Math.random() * 2.5}px`,
        height: `${1 + Math.random() * 2.5}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        borderRadius: '50%',
        background: ['#ffd580', '#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#fff'][i % 6],
        opacity: 0.2 + Math.random() * 0.6,
        animation: `galStar ${3 + Math.random() * 5}s ease-in-out infinite alternate`,
        animationDelay: `${Math.random() * 4}s`,
      }} />
    ))}
    <style>{`
      @keyframes galCore { from{transform:translate(-50%,-50%) scale(1)} to{transform:translate(-50%,-50%) scale(1.3)} }
      @keyframes galArm1 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes galArm2 { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
      @keyframes galStar { from{transform:scale(1);opacity:.2} to{transform:scale(1.8);opacity:.9} }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────
   GALLERY DATA
───────────────────────────────────────────── */
const designs = [
  {
    _id: 'living-room-1', title: 'Modern Luxury Living Room', category: 'living-room',
    description: 'A spacious living room with Italian leather sofa and modern art decor.',
    price: 5000, featured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=600',
    tag: '🛋️ Living', color: '#6366f1'
  },
  {
    _id: 'kitchen-1', title: 'Modular Nordic Kitchen', category: 'kitchen',
    description: 'Minimalist kitchen design with granite countertops and smart appliances.',
    price: 8500, featured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
    tag: '🍳 Kitchen', color: '#f59e0b'
  },
  {
    _id: 'bedroom-1', title: 'Master Bedroom Suite', category: 'bedroom',
    description: 'Cozy master bedroom with king-size bed and ambient lighting.',
    price: 6000, featured: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80&w=600',
    tag: '🛏️ Bedroom', color: '#a855f7'
  },
  {
    _id: 'office-1', title: 'CEO Office Workspace', category: 'office',
    description: 'Executive desk setup with ergonomic chair and city view.',
    price: 4500, featured: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=600',
    tag: '💼 Office', color: '#10b981'
  },
  {
    _id: 'bathroom-1', title: 'Spa Retreat Bathroom', category: 'bathroom',
    description: 'Modern bathroom with rain shower and marble vanity.',
    price: 3500, featured: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600',
    tag: '🚿 Bathroom', color: '#3b82f6'
  },
  {
    _id: 'exterior-1', title: 'Modern Villa Facade', category: 'exterior',
    description: 'Contemporary villa design with landscaping and outdoor seating.',
    price: 12000, featured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=600',
    tag: '🏡 Exterior', color: '#ec4899'
  },
  {
    _id: 'villa-1', title: '🏰 Luxury Villa — Complete Estate', category: 'villa',
    description: 'Full luxury villa with swimming pool, garage with 2 cars, lush garden, all rooms fully furnished — living, bedroom, kitchen, office, bathroom — plus outdoor terrace and car parking.',
    price: 85000, featured: true,
    thumbnailUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=600',
    tag: '🏰 Villa', color: '#f59e0b'
  },
];

const categories = ['all', 'living-room', 'bedroom', 'kitchen', 'office', 'bathroom', 'exterior', 'villa'];

/* ─────────────────────────────────────────────
   GALLERY CARD
───────────────────────────────────────────── */
const GalleryCard = ({ design, index }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        animation: `gallery-card-in 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s both`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <Link to={`/model/${design._id}`} className="block">
        {/* Image */}
        <div className="relative h-64 overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <img
            src={design.thumbnailUrl}
            alt={design.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease, transform 0.7s ease' }}
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: `${design.color}cc`, backdropFilter: 'blur(8px)' }}>
              {design.tag}
            </span>
          </div>

          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
            <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md border border-white/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
              3D VIEW
            </span>
            {design.featured && (
              <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full text-xs font-bold text-center">
                ★ Featured
              </span>
            )}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{ background: `${design.color}22` }}>
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/30">
              👁️
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-white font-bold text-lg mb-1.5 group-hover:text-indigo-300 transition-colors line-clamp-1">
            {design.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">{design.description}</p>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Starting at</div>
              <div className="text-white font-black text-lg">${design.price.toLocaleString()}</div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-indigo-500 group-hover:bg-indigo-600 transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom color accent */}
        <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
          style={{ background: `linear-gradient(90deg, transparent, ${design.color}, transparent)` }} />
      </Link>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN GALLERY PAGE
───────────────────────────────────────────── */
const ITEMS_PER_PAGE = 6;

const Gallery = () => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = designs.filter(d => {
    const matchCat = filter === 'all' || d.category === filter;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedItems = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setCurrentPage(1); }, [filter, search]);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      <style>{`
        @keyframes gallery-card-in {
          from { opacity:0; transform:translateY(30px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes gal-shimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .gal-shimmer {
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f59e0b, #6366f1);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gal-shimmer 5s linear infinite;
        }
        @keyframes float-hero {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        .float-hero { animation: float-hero 4s ease-in-out infinite; }
      `}</style>

      {/* Galaxy Background */}
      <GalaxyBackground />

      {/* ── HEADER ── */}
      <section className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="flex-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-5 float-hero">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                {designs.length} Curated Designs
              </div>

              <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                <span className="gal-shimmer">Galaxy</span>{' '}
                <TextMorph words={['Gallery', 'Showcase', 'Collection', 'Universe']} className="text-white" />
              </h1>
              <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                Explore stunning 3D interior designs floating in the cosmos.
                <span className="text-indigo-400"> Click any design</span> to view in full 3D.
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0">
              <Link to="/house-builder"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-white hover:scale-105 transition-all duration-300 shadow-xl"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', boxShadow: '0 0 30px rgba(99,102,241,0.4)' }}>
                <span className="text-2xl">🏠</span>
                <div className="text-left">
                  <div className="text-xs text-indigo-200">NEW!</div>
                  <div>Build Your House</div>
                </div>
              </Link>
              <Link to="/interior-studio"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-2xl font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 hover:scale-105 transition-all duration-300">
                <span className="text-2xl">🏗️</span>
                <div>Open 3D Studio</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTERS ── */}
      <section className="relative z-10 py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search designs..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white/8 transition-all"
              style={{ backdropFilter: 'blur(16px)' }}
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)}
                className="px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300"
                style={{
                  background: filter === cat ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)',
                  color: filter === cat ? '#fff' : '#94a3b8',
                  border: filter === cat ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: filter === cat ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
                  transform: filter === cat ? 'scale(1.05)' : 'scale(1)',
                }}>
                {cat === 'all' ? '✨ All' : cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Result count */}
          <p className="text-slate-500 text-sm">
            Showing <span className="text-white font-semibold">{paginatedItems.length}</span> of {filtered.length} designs
            {totalPages > 1 && <span className="text-slate-600 ml-2">— Page {safePage} of {totalPages}</span>}
          </p>
        </div>
      </section>

      {/* ── GALLERY GRID ── */}
      <section className="relative z-10 py-8 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24 rounded-3xl border border-white/10"
              style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)' }}>
              <div className="text-6xl mb-4">🌌</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Designs Found</h3>
              <p className="text-slate-400">Try a different search or category</p>
              <button onClick={() => { setFilter('all'); setSearch(''); }}
                className="mt-6 px-6 py-3 rounded-xl font-bold text-white border border-white/20 hover:bg-white/10 transition-colors">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedItems.map((design, i) => (
                <GalleryCard key={design._id} design={design} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PAGINATION ── */}
      {totalPages > 1 && (
        <section className="relative z-10 pb-24 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            {/* Prev */}
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: safePage <= 1 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300"
                style={{
                  background: page === safePage ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: page === safePage ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  boxShadow: page === safePage ? '0 0 20px rgba(99,102,241,0.3)' : 'none',
                  transform: page === safePage ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {page}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                background: safePage >= totalPages ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Gallery;
