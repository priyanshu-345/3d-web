import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import AIChatAssistant from '../components/AIChatAssistant';
import TextMorph from '../components/TextMorph';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AdvancedLogo from '../components/AdvancedLogo';

gsap.registerPlugin(ScrollTrigger);

const sidebarLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/interior-studio', label: 'Studio 3D' },
  { path: '/advanced-editor', label: 'Pro Editor' },
  { path: '/features', label: 'Features' },
  { path: '/login', label: 'Log In' },
  { path: '/signup', label: 'Sign Up' },
];

const Home = () => {
  const textRef = useRef(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { scale: 0.8, opacity: 0.8 },
        {
          scale: 1.5,
          opacity: 1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 60%",
            end: "top 10%",
            scrub: 1,
          }
        }
      );
    }
  }, []);

  // Flip Card
  const FeatureCard = ({ icon, title, desc, link, action }) => {
    const [flipped, setFlipped] = useState(false);
    return (
      <div
        className="w-full h-80 cursor-pointer"
        style={{ perspective: '1000px' }}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        onClick={action}
      >
        <div
          className="relative w-full h-full transition-all duration-700"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 w-full h-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center shadow-2xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-6xl mb-6">{icon}</div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">{title}</h3>
            <p className="text-gray-400 text-center text-sm">Hover to see more details</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.5)]"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
            <p className="text-gray-200 text-center mb-6">{desc}</p>
            {link ? (
              <Link
                to={link}
                onClick={e => e.stopPropagation()}
                className="px-6 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm hover:scale-105 transition-transform"
              >
                Try Now
              </Link>
            ) : (
              <button className="px-6 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                Open Tool
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: '#020617' }}>

      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Hero3D />
      </div>

      {/* ══════════════════════════════════════
          HERO SECTION — full screen
      ══════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden z-10 flex flex-col justify-center">

        {/* Sidebar — absolute on left, desktop only */}
        <aside className="absolute left-0 top-0 h-full hidden md:flex w-64 flex-col border-r border-white/10 bg-slate-950/20 px-6 py-8 space-y-8 backdrop-blur-sm z-50">
          <div>
            <p className="text-xs font-semibold tracking-[0.35em] text-slate-400 uppercase">
              Navigation
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {sidebarLinks.map((l) => (
                <Link
                  key={l.path}
                  to={l.path}
                  className={
                    l.path === '/'
                      ? 'rounded-full px-4 py-2 bg-white/10 text-white font-medium shadow-sm hover:bg-white/20 transition'
                      : 'rounded-full px-4 py-2 text-slate-200/90 hover:bg-white/10 hover:text-white transition'
                  }
                >
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="w-full text-left rounded-full px-4 py-2 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition flex items-center gap-2"
              >
                <span>🤖</span> AI Assistant
              </button>
            </div>
          </div>
        </aside>

        {/* Hero content — centred in full width (sidebar overlaps, doesn't push) */}
        <div className="w-full flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-5xl mx-auto pointer-events-auto">

            {/* Logo */}
            <div className="mb-6 fade-in-up delay-100">
              <AdvancedLogo />
            </div>

            {/* Headline */}
            <div ref={textRef} className="origin-center">
              <h1 className="font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl mb-8">
                <TextMorph
                  words={['ARCHITECT', 'REDEFINE', 'ELEVATE', 'TRANSFORM']}
                  className="gradient-text-animated block text-5xl md:text-7xl lg:text-8xl mb-4"
                />
                <span className="tracking-wide text-4xl md:text-6xl lg:text-7xl">
                  YOUR VISION INTO
                </span>
                <span
                  className="text-hologram block mt-6 text-5xl md:text-7xl lg:text-8xl tracking-tighter"
                  data-text="IMMERSIVE REALITY"
                >
                  IMMERSIVE REALITY
                </span>
              </h1>
            </div>

            {/* Subtitle + CTA */}
            <div className="mt-10 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 font-light backdrop-blur-sm bg-black/10 p-6 rounded-2xl border border-white/5">
                Experience the future of architectural visualization.
                <span className="block mt-6">
                  <Link
                    to="/interior-studio"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Launch 3D Studio <span className="text-xl">→</span>
                  </Link>
                </span>
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURED TOOLS
      ══════════════════════════════════════ */}
      <section className="py-32 relative z-10" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-blur-reveal">
              <span className="gradient-text-gold text-glow-gold">Featured</span>{' '}
              <span className="gradient-text-animated text-shimmer">Tools</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="AI Architect Chat"
              desc="Chat with our AI to instantly generate 3D room layouts described in text. Now with 🎤 voice commands!"
              action={() => setIsAssistantOpen(true)}
            />
            <FeatureCard
              icon="📸"
              title="AI Photo Consultant"
              desc="Upload a room photo to get furniture suggestions and view them in AR."
              link="/ai-consultant"
            />
            <FeatureCard
              icon="🏗️"
              title="3D Interior Studio"
              desc="Full-featured drag-and-drop 3D editor for comprehensive house design."
              link="/interior-studio"
            />
            <FeatureCard
              icon="🏠"
              title="House Builder"
              desc="Design entire multi-room homes from scratch with our procedural house generation engine."
              link="/house-builder"
            />
            <FeatureCard
              icon="🎨"
              title="Pro 3D Editor"
              desc="Desktop-class 3D modeling tools in your browser — extrude, sculpt, bevel, and render."
              link="/advanced-editor"
            />
            <FeatureCard
              icon="🌌"
              title="Galaxy Gallery"
              desc="Browse thousands of curated 3D interior designs across every style and room category."
              link="/gallery"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA SECTION — Stunning
      ══════════════════════════════════════ */}
      <section className="py-40 relative overflow-hidden z-10">

        {/* Deep bg */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

        {/* Glowing orbs */}
        <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(168,85,247,0.12) 50%, transparent 70%)' }} />
        <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[8%] w-[350px] h-[350px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)' }} />

        {/* Floating particles */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#f59e0b'][i % 5],
              opacity: 0.5 + Math.random() * 0.5,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}

        {/* Animated gradient border card */}
        <div className="relative max-w-4xl mx-auto px-4 z-10">
          <div
            className="relative rounded-3xl p-[2px]"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899, #6366f1)',
              backgroundSize: '300% 300%',
              animation: 'gradientShift 4s ease infinite',
            }}
          >
            <div className="relative rounded-3xl bg-slate-950/90 backdrop-blur-xl px-10 py-16 text-center overflow-hidden">

              {/* Inner glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)' }} />

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse inline-block" />
                AI-Powered Design Platform
              </div>

              {/* Headline */}
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                <span className="text-white">Ready to </span>
                <TextMorph
                  words={['Build', 'Design', 'Create', 'Visualize']}
                  className="gradient-text-animated"
                />
                <br />
                <span className="text-white">Your Dream?</span>
              </h2>

              {/* Subtitle */}
              <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                Join <span className="text-white font-semibold">12,000+</span> designers and homeowners who
                transformed their spaces with AI-powered 3D design.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                {/* Primary */}
                <Link
                  to="/interior-studio"
                  className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_50px_rgba(99,102,241,0.8)] transition-all duration-300 hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
                >
                  <span className="text-2xl">🚀</span>
                  Launch 3D Studio
                  <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
                </Link>

                {/* Secondary */}
                <Link
                  to="/gallery"
                  className="group inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40 hover:scale-105 transition-all duration-300"
                >
                  <span className="text-2xl">🌌</span>
                  Explore Gallery
                  <span className="group-hover:translate-x-1 transition-transform text-xl">→</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap justify-center gap-6 text-slate-500 text-xs">
                {['✅ No credit card required', '⚡ Instant setup', '🔒 100% secure', '🌍 Works everywhere'].map((b, i) => (
                  <span key={i} className="hover:text-slate-300 transition-colors">{b}</span>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* Float + gradient keyframes */}
        <style>{`
          @keyframes float {
            from { transform: translateY(0px) scale(1); }
            to   { transform: translateY(-18px) scale(1.15); }
          }
          @keyframes gradientShift {
            0%   { background-position: 0% 50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </section>

      {/* AI Chat Assistant */}
      <AIChatAssistant
        isOpenControlled={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  );
};

export default Home;
