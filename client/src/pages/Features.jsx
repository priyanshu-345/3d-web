import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   AURORA BACKGROUND (CSS-only, zero Three.js)
───────────────────────────────────────────── */
const AuroraBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <style>{`
      @keyframes aurora1 {
        0%,100% { transform: translate(-10%,-10%) rotate(0deg) scale(1); }
        33%      { transform: translate(5%,5%) rotate(120deg) scale(1.1); }
        66%      { transform: translate(-5%,10%) rotate(240deg) scale(0.9); }
      }
      @keyframes aurora2 {
        0%,100% { transform: translate(10%,10%) rotate(0deg) scale(1); }
        33%      { transform: translate(-5%,-5%) rotate(-120deg) scale(1.2); }
        66%      { transform: translate(5%,-10%) rotate(-240deg) scale(0.8); }
      }
      @keyframes aurora3 {
        0%,100% { transform: translate(0%,0%) rotate(0deg) scale(1); }
        50%      { transform: translate(-10%,10%) rotate(180deg) scale(1.15); }
      }
      .aurora-blob-1 { animation: aurora1 18s ease-in-out infinite; }
      .aurora-blob-2 { animation: aurora2 22s ease-in-out infinite; }
      .aurora-blob-3 { animation: aurora3 16s ease-in-out infinite; }
    `}</style>
        <div className="absolute inset-0 bg-[#020617]" />
        <div className="aurora-blob-1 absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, #a855f7 50%, transparent 70%)' }} />
        <div className="aurora-blob-2 absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #ec4899 0%, #f59e0b 50%, transparent 70%)' }} />
        <div className="aurora-blob-3 absolute top-[30%] right-[10%] w-[50vw] h-[50vw] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(circle, #10b981 0%, #3b82f6 50%, transparent 70%)' }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
    </div>
);

/* ─────────────────────────────────────────────
   FEATURE DATA
───────────────────────────────────────────── */
const featuresList = [
    {
        category: "Deep Learning & Neural Networks",
        icon: "🧠",
        gradient: "from-purple-600 to-indigo-600",
        glowColor: "rgba(99,102,241,0.4)",
        borderColor: "rgba(99,102,241,0.3)",
        link: null,
        items: [
            { title: "Generative Adversarial Design (GANs)", desc: "AI hallucinates and generates photorealistic interior variations instantly.", icon: "⚡" },
            { title: "NeRF 3D Reconstruction", desc: "Turns 2D photos into navigatable 3D volumetric scenes using Neural Radiance Fields.", icon: "📷" },
            { title: "Semantic Scene Understanding", desc: "Identifies objects, materials, and potential design flaws at a pixel level.", icon: "🔍" },
            { title: "Predictive Style Analytics", desc: "Forecasts future design trends using global metadata analysis.", icon: "📊" },
        ]
    },
    {
        category: "Intelligent Spatial Computing",
        icon: "📐",
        gradient: "from-blue-600 to-cyan-500",
        glowColor: "rgba(59,130,246,0.4)",
        borderColor: "rgba(59,130,246,0.3)",
        link: null,
        items: [
            { title: "Automated Ergonomics Engine", desc: "AI calculates optimal furniture distances for human movement flow.", icon: "🏃" },
            { title: "Real-time Collision Avoidance", desc: "Prevents object overlap and ensures functional operability of doors/drawers.", icon: "🛡️" },
            { title: "Dynamic Vastu/Feng Shui AI", desc: "Scores layouts based on ancient architectural energy principles.", icon: "☯️" },
            { title: "Adaptive Lighting Optimization", desc: "Simulates circadian rhythms to suggest lighting setups for mental well-being.", icon: "💡" },
        ]
    },
    {
        category: "Personalized Design Agents",
        icon: "🤖",
        gradient: "from-emerald-600 to-teal-500",
        glowColor: "rgba(16,185,129,0.4)",
        borderColor: "rgba(16,185,129,0.3)",
        link: "/ai-consultant",
        items: [
            { title: "Psychometric Design Profiling", desc: "Builds a user persona based on psychological color and shape preferences.", icon: "🧬" },
            { title: "Conversational Design Bot", desc: "Context-aware chatbot that modifies 3D models via natural language commands.", icon: "💬" },
            { title: "Budget-Aware AI Curator", desc: "Suggests items that mathematically fit within your financial constraints.", icon: "💰" },
            { title: "Material Sustainability Score", desc: "AI evaluates and recommends eco-friendly material alternatives.", icon: "🌿" },
        ]
    },
    {
        category: "Vision & Rendering AI",
        icon: "👁️",
        gradient: "from-orange-600 to-red-500",
        glowColor: "rgba(249,115,22,0.4)",
        borderColor: "rgba(249,115,22,0.3)",
        link: null,
        items: [
            { title: "Super-Resolution Upscaling", desc: "Enhances texture quality of uploaded reference images using AI.", icon: "🔭" },
            { title: "AI-Driven Style Transfer", desc: "Apply the 'vibes' of a famously designed room to your own space instantly.", icon: "🎨" },
            { title: "Texture Synthesis", desc: "Generates seamless PBR textures from simple color swatches.", icon: "🖼️" },
            { title: "Contextual Image Inpainting", desc: "Intelligently fills/removes objects from scenes while maintaining perspective.", icon: "✏️" },
        ]
    },
    {
        category: "3D Studio Pro",
        icon: "🎨",
        gradient: "from-pink-600 to-rose-500",
        glowColor: "rgba(236,72,153,0.4)",
        borderColor: "rgba(236,72,153,0.3)",
        link: "/advanced-editor",
        items: [
            { title: "Professional 3D Modeling", desc: "Desktop-class 3D modeling tools directly in your browser.", icon: "🏗️" },
            { title: "Procedural House Building", desc: "Generate multi-story luxury homes with a single click.", icon: "🏠" },
            { title: "Advanced Modifiers", desc: "Extrude, Bevel, Mirror, and Array modifiers for complex geometry.", icon: "⚙️" },
            { title: "Real-time Sculpting", desc: "High-performance sculpting with dynamic mesh updates.", icon: "🗿" },
        ]
    },
    {
        category: "Real-Time Cost Engine",
        icon: "💰",
        gradient: "from-amber-500 to-yellow-400",
        glowColor: "rgba(245,158,11,0.4)",
        borderColor: "rgba(245,158,11,0.3)",
        link: null,
        items: [
            { title: "Live Market Pricing", desc: "Real-time material and furniture prices from 500+ vendors across India.", icon: "📈" },
            { title: "Budget Optimization", desc: "AI suggests cost-saving alternatives without compromising design quality.", icon: "🎯" },
            { title: "Contractor Estimation", desc: "Generates detailed labor cost breakdowns by city and project scope.", icon: "👷" },
            { title: "ROI Calculator", desc: "Predicts property value increase from design improvements.", icon: "📊" },
        ]
    },
];

/* ─────────────────────────────────────────────
   INTERACTIVE DEMO PANEL
───────────────────────────────────────────── */
const DemoPanel = ({ feature, onClose }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('idle');
    const [activeItem, setActiveItem] = useState(null);

    const runDemo = () => {
        setStatus('processing');
        setProgress(0);
        let p = 0;
        const iv = setInterval(() => {
            p += Math.random() * 12 + 3;
            if (p >= 100) {
                p = 100;
                clearInterval(iv);
                setStatus('complete');
            }
            setProgress(Math.min(p, 100));
        }, 200);
    };

    const costItems = [
        { label: 'Flooring (Italian Marble)', value: '₹1,25,000' },
        { label: 'False Ceiling (POP)', value: '₹45,000' },
        { label: 'Modular Kitchen (Hettich)', value: '₹2,10,000' },
        { label: 'Paint (Royal Luxury)', value: '₹35,000' },
        { label: 'Furniture & Fixtures', value: '₹1,80,000' },
    ];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
                style={{ background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(30px)' }}
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between"
                    style={{ background: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' to-', ', ')})`.replace(/\w+-\d+/g, c => ({ 'purple-600': '#9333ea', 'indigo-600': '#4f46e5', 'blue-600': '#2563eb', 'cyan-500': '#06b6d4', 'emerald-600': '#059669', 'teal-500': '#14b8a6', 'orange-600': '#ea580c', 'red-500': '#ef4444', 'pink-600': '#db2777', 'rose-500': '#f43f5e', 'amber-500': '#f59e0b', 'yellow-400': '#facc15' }[c] || c)) }}>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{feature.icon}</span>
                        <div>
                            <h3 className="text-white font-bold text-lg">{feature.category}</h3>
                            <p className="text-white/70 text-xs">Interactive Demo Module</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">✕</button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Feature items list */}
                    <div className="grid grid-cols-1 gap-3 mb-6">
                        {feature.items.map((item, i) => (
                            <div key={i}
                                onClick={() => setActiveItem(activeItem === i ? null : i)}
                                className="p-4 rounded-2xl border cursor-pointer transition-all duration-300"
                                style={{
                                    borderColor: activeItem === i ? feature.borderColor : 'rgba(255,255,255,0.08)',
                                    background: activeItem === i ? `${feature.glowColor.replace('0.4', '0.1')}` : 'rgba(255,255,255,0.03)',
                                    boxShadow: activeItem === i ? `0 0 20px ${feature.glowColor}` : 'none'
                                }}>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{item.icon}</span>
                                    <div className="flex-1">
                                        <div className="text-white font-semibold text-sm">{item.title}</div>
                                        {activeItem === i && (
                                            <div className="text-slate-400 text-xs mt-1 leading-relaxed">{item.desc}</div>
                                        )}
                                    </div>
                                    <span className="text-slate-500 text-xs">{activeItem === i ? '▲' : '▼'}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Demo simulation */}
                    {feature.category === "Real-Time Cost Engine" ? (
                        <div className="rounded-2xl p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-4">Live Budget Estimate</h4>
                            <div className="space-y-3">
                                {costItems.map((c, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-400">{c.label}</span>
                                        <span className="text-white font-mono font-bold">{c.value}</span>
                                    </div>
                                ))}
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold">TOTAL ESTIMATE</span>
                                    <span className="text-amber-400 font-black text-lg font-mono">₹5,95,000</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-2xl p-5 border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                            {status === 'idle' && (
                                <div className="text-center py-4">
                                    <div className="text-4xl mb-3">{feature.icon}</div>
                                    <p className="text-slate-400 text-sm mb-4">Click to run an interactive simulation of {feature.category}</p>
                                    <button onClick={runDemo}
                                        className="px-6 py-2.5 rounded-xl font-bold text-white text-sm hover:scale-105 transition-transform"
                                        style={{ background: `linear-gradient(135deg, ${feature.glowColor.replace('0.4', '1')}, ${feature.glowColor.replace('0.4', '0.7')})` }}>
                                        ▶ Launch Simulation
                                    </button>
                                </div>
                            )}
                            {status === 'processing' && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400 animate-pulse">Processing AI Model...</span>
                                        <span className="text-white font-mono">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full transition-all duration-300"
                                            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${feature.glowColor.replace('0.4', '1')}, ${feature.glowColor.replace('0.4', '0.6')})` }} />
                                    </div>
                                    <div className="text-xs text-slate-500 font-mono">
                                        {progress < 30 ? 'Loading neural weights...' : progress < 60 ? 'Analyzing spatial data...' : progress < 90 ? 'Generating output...' : 'Finalizing...'}
                                    </div>
                                </div>
                            )}
                            {status === 'complete' && (
                                <div className="text-center py-4">
                                    <div className="text-4xl mb-2">✅</div>
                                    <h4 className="text-white font-bold mb-1">Simulation Complete!</h4>
                                    <p className="text-slate-400 text-sm mb-4">AI processed 847 data points in 2.3 seconds</p>
                                    {feature.link && (
                                        <Link to={feature.link}
                                            className="inline-block px-6 py-2.5 rounded-xl font-bold text-white text-sm hover:scale-105 transition-transform"
                                            style={{ background: `linear-gradient(135deg, ${feature.glowColor.replace('0.4', '1')}, ${feature.glowColor.replace('0.4', '0.7')})` }}>
                                            Open Full Tool →
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-white/10 flex justify-between text-xs text-slate-600 font-mono">
                    <span>Status: ● Online</span>
                    <span>Latency: 12ms</span>
                    <span>Model: v3.2.1</span>
                </div>
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   FEATURE CARD
───────────────────────────────────────────── */
const FeatureCard = ({ feature, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="rounded-3xl p-7 border cursor-pointer relative overflow-hidden group transition-all duration-400"
            style={{
                borderColor: hovered ? feature.borderColor : 'rgba(255,255,255,0.08)',
                background: hovered ? `rgba(255,255,255,0.06)` : 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(20px)',
                boxShadow: hovered ? `0 0 50px ${feature.glowColor}` : '0 4px 20px rgba(0,0,0,0.3)',
                transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
                transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
            }}
        >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.glowColor.replace('0.4', '0.8')}, transparent)`, opacity: hovered ? 1 : 0 }} />

            {/* Launch button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: `linear-gradient(135deg, ${feature.glowColor.replace('0.4', '0.8')}, ${feature.glowColor.replace('0.4', '0.4')})` }}>
                    ▶
                </div>
            </div>

            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-3xl mb-5 shadow-lg transition-transform duration-300 ${hovered ? 'scale-110' : 'scale-100'}`}>
                {feature.icon}
            </div>

            <h3 className="text-white font-bold text-lg mb-3 leading-tight">{feature.category}</h3>

            {/* Items preview */}
            <ul className="space-y-2.5">
                {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <span className="text-base mt-0.5 shrink-0">{item.icon}</span>
                        <div>
                            <div className="text-slate-300 text-sm font-medium">{item.title}</div>
                            <div className="text-slate-500 text-xs leading-relaxed mt-0.5 line-clamp-1">{item.desc}</div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Click hint */}
            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-500">Click to explore</span>
                {feature.link && (
                    <span className="text-xs font-semibold" style={{ color: feature.glowColor.replace('0.4', '1') }}>
                        Open Tool →
                    </span>
                )}
            </div>
        </div>
    );
};

/* ─────────────────────────────────────────────
   MAIN FEATURES PAGE
───────────────────────────────────────────── */
const Features = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [visibleCards, setVisibleCards] = useState([]);

    useEffect(() => {
        // Stagger card reveal
        featuresList.forEach((_, i) => {
            setTimeout(() => setVisibleCards(prev => [...prev, i]), i * 100 + 300);
        });
    }, []);

    const techStack = [
        { label: 'React + Three.js', icon: '⚛️' },
        { label: 'WebGPU Rendering', icon: '🖥️' },
        { label: 'Node.js + Python', icon: '🐍' },
        { label: 'OpenCV + ML', icon: '👁️' },
        { label: 'Cloud GPU', icon: '☁️' },
        { label: 'PostgreSQL + Redis', icon: '🗄️' },
        { label: 'Kubernetes + AWS', icon: '🚀' },
        { label: 'TensorFlow + PyTorch', icon: '🧠' },
    ];

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            <style>{`
        @keyframes features-fade-up {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .feat-card-visible { animation: features-fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes shimmer-feat {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        .shimmer-feat {
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #f59e0b, #6366f1);
          background-size: 300% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer-feat 5s linear infinite;
        }
        @keyframes float-badge {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        .float-badge { animation: float-badge 3s ease-in-out infinite; }
      `}</style>

            <AuroraBackground />

            {/* ── HEADER ── */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="text-center mb-20">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-6 float-badge">
                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                        Next-Generation AI Platform
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
                        <span className="text-white">Powered by </span>
                        <span className="shimmer-feat">Advanced AI</span>
                    </h1>

                    <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        The most advanced 3D interior design platform powered by AI, Physics, and Real-time Architecture.
                        <span className="block mt-2 text-indigo-400 text-sm font-medium">
                            ↓ Click any card to launch its interactive module
                        </span>
                    </p>

                    {/* Quick stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-10">
                        {[
                            { v: '6', l: 'AI Modules', c: '#6366f1' },
                            { v: '24', l: 'Sub-Features', c: '#a855f7' },
                            { v: '∞', l: 'Possibilities', c: '#ec4899' },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-3xl font-black" style={{ color: s.c }}>{s.v}</div>
                                <div className="text-slate-500 text-xs mt-1">{s.l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── FEATURE GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {featuresList.map((feature, i) => (
                        <div key={i}
                            className={visibleCards.includes(i) ? 'feat-card-visible' : 'opacity-0'}
                            style={{ animationDelay: `${i * 0.05}s` }}>
                            <FeatureCard
                                feature={feature}
                                onClick={() => feature.link
                                    ? window.open(feature.link, '_self')
                                    : setSelectedFeature(feature)
                                }
                            />
                        </div>
                    ))}
                </div>

                {/* ── TECH STACK ── */}
                <div className="border-t border-white/10 pt-16 text-center">
                    <h4 className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-8">
                        Powered By Advanced Architecture
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                        {techStack.map((t, i) => (
                            <div key={i}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-slate-400 text-sm hover:border-indigo-500/40 hover:text-white hover:bg-white/10 transition-all duration-200 cursor-default">
                                <span>{t.icon}</span>
                                <span className="font-mono text-xs">{t.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16">
                        <Link to="/interior-studio"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-lg hover:scale-105 transition-all duration-300 shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)',
                                boxShadow: '0 0 60px rgba(99,102,241,0.4)'
                            }}>
                            🚀 Start Building Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* Demo Modal */}
            {selectedFeature && (
                <DemoPanel feature={selectedFeature} onClose={() => setSelectedFeature(null)} />
            )}
        </div>
    );
};

export default Features;
