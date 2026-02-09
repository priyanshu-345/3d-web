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
    // Vertical Text Zoom Effect on Scroll
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { scale: 0.8, opacity: 0.8 },
        {
          scale: 1.5,
          opacity: 1,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 60%", // Start earlier
            end: "top 10%",
            scrub: 1,
          }
        }
      );
    }
  }, []);

  // Custom Card Component with Flip Effect
  const FeatureCard = ({ icon, title, desc, link, action }) => (
    <div className="group w-full h-80 perspective-1000 cursor-pointer" onClick={action}>
      <div className="relative w-full h-full transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
        {/* Front Side */}
        <div className="absolute inset-0 w-full h-full bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden shadow-2xl">
          <div className="text-6xl mb-6">{icon}</div>
          <h3 className="text-2xl font-bold text-white mb-4 text-center">{title}</h3>
          <p className="text-gray-400 text-center text-sm">Hover to see more details</p>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center backface-hidden rotate-y-180 shadow-[0_0_30px_rgba(124,58,237,0.5)]">
          <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
          <p className="text-gray-200 text-center mb-6">{desc}</p>
          {link ? (
            <Link to={link} className="px-6 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm hover:scale-105 transition-transform">
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

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-x-hidden">

      {/* 3D Background - Optimized */}
      <div className="fixed inset-0 z-0">
        <Hero3D />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden z-10 flex flex-col justify-center">
        {/* Sidebar - Hidden on mobile */}
        <aside className="absolute left-0 top-0 h-full hidden md:flex w-64 flex-col border-r border-white/10 bg-slate-950/20 px-6 py-8 space-y-8 backdrop-blur-sm z-20">
          <div>
            <p className="text-xs font-semibold tracking-[0.35em] text-slate-400 uppercase">
              Navigation
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm z-30">
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
              <div className="h-px bg-white/10 my-2"></div>
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="w-full text-left rounded-full px-4 py-2 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition flex items-center gap-2"
              >
                <span>🤖</span> AI Assistant
              </button>
            </div>
          </div>
        </aside>

        {/* Standard Text Layout (Reverted) */}
        <div className="flex-1 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 max-w-6xl mx-auto pointer-events-auto">
            {/* Animating Container */}
            {/* Animating Container */}
            <div className="mb-6 fade-in-up delay-100">
              <AdvancedLogo />
            </div>

            <div ref={textRef} className="origin-center">
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight drop-shadow-2xl mb-8">
                <TextMorph
                  words={['ARCHITECT', 'REDEFINE', 'ELEVATE', 'TRANSFORM']}
                  className="gradient-text-animated block mb-4"
                />
                <span className="text-white tracking-wide">YOUR VISION INTO</span>
                <br />
                <span className="text-hologram text-4xl md:text-6xl lg:text-8xl block mt-6 tracking-tighter" data-text="IMMERSIVE REALITY">
                  IMMERSIVE REALITY
                </span>
              </h1>
            </div>

            <div className="mt-12 max-w-2xl mx-auto">
              <p className="text-xl md:text-2xl text-white/90 font-light backdrop-blur-sm bg-black/10 p-6 rounded-2xl border border-white/5">
                Experience the future of architectural visualization.
                <span className="block mt-6">
                  <Link to="/interior-studio" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-900 rounded-full font-bold hover:scale-105 transition-transform">
                    Launch 3D Studio <span className="text-xl">→</span>
                  </Link>
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Transparent Background */}
      <section className="py-32 relative z-10" id="features">
        {/* Transparent background overlay */}
        <div className="absolute inset-0 bg-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-blur-reveal">
              <span className="gradient-text-gold text-glow-gold">Featured</span> <span className="gradient-text-animated text-shimmer">Tools</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. AI Assistant (Chat Bot Trigger) */}
            <FeatureCard
              icon="🤖"
              title="AI Architect Chat"
              desc="Chat with our AI to instantly generate 3D room layouts described in text."
              action={() => setIsAssistantOpen(true)} // Opens the chat bot
            />

            {/* 2. AI Consultant (AR & Photo Analysis) */}
            <FeatureCard
              icon="📸"
              title="AI Photo Consultant"
              desc="Upload a room photo to get furniture suggestions and view them in AR."
              link="/ai-consultant"
            />

            {/* 3. 3D Studio (Main Editor) */}
            <FeatureCard
              icon="🏗️"
              title="3D Interior Studio"
              desc="Full-featured drag-and-drop 3D editor for comprehensive house design."
              link="/interior-studio"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-transparent">
          {/* Glassmorphic Overlay */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 mix-blend-overlay"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-blur-reveal">
            Ready to <TextMorph words={['Build', 'Design', 'Create', 'Visualize']} className="gradient-text-animated" /> Your Dream?
          </h2>
          <div className="glass-panel inline-flex p-2 rounded-full fade-in-up delay-400">
            <Link
              to="/interior-studio"
              className="px-12 py-6 bg-white text-slate-900 rounded-full font-bold text-2xl btn-hover-premium text-hover-scale shadow-lg"
            >
              Launch 3D Studio
            </Link>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant - Controlled via State */}
      <AIChatAssistant isOpenControlled={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
};

export default Home;
