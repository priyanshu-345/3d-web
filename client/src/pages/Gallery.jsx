import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Cloud, Float } from '@react-three/drei';
import TextMorph from '../components/TextMorph';
import LoadingSpinner from '../components/LoadingSpinner';

// --- Advanced Milky Way Effect ---
const MilkyWay = () => {
  const groupRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.02; // Slow rotation
      groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deep Space Stars */}
      <Stars radius={200} depth={100} count={10000} factor={6} saturation={0.8} fade speed={0.5} />

      {/* Nebula / Galaxy Core - Simulated with Clouds/Sparkles */}
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sparkles count={2000} scale={[20, 2, 20]} size={6} speed={0.2} opacity={0.6} color="#db2777" /> {/* Pinkish Core */}
        <Sparkles count={2000} scale={[15, 5, 15]} size={4} speed={0.3} opacity={0.4} color="#7c3aed" /> {/* Purple Haze */}
        <Sparkles count={3000} scale={[30, 10, 30]} size={2} speed={0.5} opacity={0.3} color="#60a5fa" /> {/* Blue Outer */}
      </Float>
    </group>
  );
};

const Gallery = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const categories = ['all', 'living-room', 'bedroom', 'kitchen', 'office', 'bathroom', 'exterior'];

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        setLoading(true);

        // Curated List of Online 3D Models
        const curatedModels = [
          {
            _id: 'living-room-1',
            title: 'Modern Luxury Living Room',
            category: 'living-room',
            description: 'A spacious living room with Italian leather sofa and modern art decor.',
            price: 5000,
            thumbnailUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80',
            modelUrl: '/models/sofa.glb', // Local fallback or download target
            featured: true
          },
          {
            _id: 'kitchen-1',
            title: 'Modular Nordic Kitchen',
            category: 'kitchen',
            description: 'Minimalist kitchen design with granite countertops and smart appliances.',
            price: 8500,
            thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80',
            modelUrl: '/models/box.glb',
            featured: true
          },
          {
            _id: 'bedroom-1',
            title: 'Master Bedroom Suite',
            category: 'bedroom',
            description: 'Cozy master bedroom with king-size bed and ambient lighting.',
            price: 6000,
            thumbnailUrl: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&q=80',
            modelUrl: '/models/box.glb'
          },
          {
            _id: 'office-1',
            title: 'CEO Office Workspace',
            category: 'office',
            description: 'Executive desk setup with ergonomic chair and city view.',
            price: 4500,
            thumbnailUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80',
            modelUrl: '/models/table.glb'
          },
          {
            _id: 'bathroom-1',
            title: 'Spa Retreat Bathroom',
            category: 'bathroom',
            description: 'Modern bathroom with rain shower and marble vanity.',
            price: 3500,
            thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80',
            modelUrl: '/models/flowers.glb'
          },
          {
            _id: 'exterior-1',
            title: 'Modern Villa Facade',
            category: 'exterior',
            description: 'Contemporary villa design with landscaping and outdoor seating.',
            price: 12000,
            thumbnailUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80',
            modelUrl: '/models/helmet.glb'
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setDesigns(curatedModels);
          setError(null);
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error("Failed to fetch designs:", err);
        setError('Could not load designs.');
      }
    };

    fetchDesigns();
  }, []);

  const filteredDesigns = filter === 'all'
    ? designs
    : designs.filter(d => d.category === filter);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* --- Advanced Milky Way Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 5, 20], fov: 60 }}>
          <color attach="background" args={['#050510']} /> {/* Very dark blue/black */}
          <ambientLight intensity={0.2} />
          <MilkyWay />
        </Canvas>
      </div>

      {/* Header */}
      <section className="py-16 relative z-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-blur-reveal">
                <span className="gradient-text-animated text-glow-purple">Galaxy</span> <TextMorph words={['Gallery', 'Showcase', 'Collection', 'Universe']} className="gradient-text-gold" />
              </h1>
              <p className="text-xl text-slate-300 max-w-3xl fade-in-up delay-200">
                Explore our collection of <span className="text-indigo-400 font-semibold">stunning 3D</span> designs floating in the cosmos.
              </p>
            </div>

            <div className="flex-shrink-0 fade-in-right delay-300">
              <Link
                to="/house-builder"
                className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <span className="text-3xl">🏠</span>
                <div className="text-left">
                  <div className="text-sm text-indigo-300 font-medium">NEW!</div>
                  <div>Build Your House</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters (Transparent) */}
      <section className="py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all backdrop-blur-sm border ${filter === category
                  ? 'bg-indigo-600/80 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
              >
                {category === 'all' ? 'All' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid (Transparent Cards) */}
      <section className="py-12 perspectives-container relative z-10">
        <style dangerouslySetInnerHTML={{
          __html: `
          .perspective-card {
            transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            transform-style: preserve-3d;
          }
          .perspective-card:hover {
            transform: translateY(-10px) scale(1.02);
            z-index: 10;
          }
          .floating-badge {
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
        `}} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {filteredDesigns.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10">
              <h3 className="text-2xl font-semibold text-white mb-2">No Designs Found</h3>
              <p className="text-slate-400">Keep exploring the universe.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDesigns.map((design) => (
                <div key={design._id} className="perspective-card group relative bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.3)] transition-all">
                  <Link to={`/model/${design._id}`} className="block">
                    <div className="relative h-72 bg-gray-900/50 overflow-hidden">
                      {/* Animated Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />

                      {design.thumbnailUrl ? (
                        <img
                          src={design.thumbnailUrl.startsWith('http') ? design.thumbnailUrl : `http://localhost:5000${design.thumbnailUrl}`}
                          alt={design.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=3D+Design';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-transparent">
                          <span className="text-4xl">🌌</span>
                        </div>
                      )}

                      {/* 3D Badge */}
                      <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <span className="floating-badge bg-black/50 backdrop-blur-md border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                          3D VIEW
                        </span>
                        {design.featured && (
                          <span className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
                            ★ Star Pick
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 card-content relative z-20">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors shadow-black drop-shadow-md">
                        {design.title}
                      </h3>
                      {design.description && (
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">{design.description}</p>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                        {design.price > 0 && (
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Value</span>
                            <span className="text-lg font-bold text-white">
                              ${design.price.toLocaleString()}
                            </span>
                          </div>
                        )}
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white group-hover:bg-indigo-600 transition-all transform group-hover:rotate-45 border border-white/10 group-hover:border-indigo-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
