import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackgroundVariant3D from '../components/BackgroundVariant3D';
import FeatureDemoModal from '../components/FeatureDemoModal';

const featuresList = [
    {
        category: "Deep Learning & Neural Networks",
        icon: "🧠",
        color: "from-purple-500 to-indigo-500",
        items: [
            { title: "Generative Adversarial Design (GANs)", desc: "AI hallucinates and generates photorealistic interior variations instantly." },
            { title: "NeRF 3D Reconstruction", desc: "Turns 2D photos into navigatable 3D volumetric scenes using Neural Radiance Fields." },
            { title: "Semantic Scene Understanding", desc: "Identifies objects, materials, and potential design flaws at a pixel level." },
            { title: "Predictive Style Analytics", desc: "Forecasts future design trends using global metadata analysis." }
        ]
    },
    {
        category: "Intelligent Spatial Computing",
        icon: "📐",
        color: "from-blue-500 to-cyan-500",
        items: [
            { title: "Automated Ergonomics Engine", desc: "AI calculates optimal furniture distances for human movement flow." },
            { title: "Real-time Collision Avoidance", desc: "Prevents object overlap and ensures functional operability of doors/drawers." },
            { title: "Dynamic Vastu/Feng Shui AI", desc: "Scores layouts based on ancient architectural energy principles." },
            { title: "Adaptive Lighting Optimization", desc: "Simulates circadian rhythms to suggest lighting setups for mental well-being." }
        ]
    },
    {
        category: "Personalized Design Agents",
        icon: "🤖",
        color: "from-green-500 to-emerald-500",
        items: [
            { title: "Psychometric Design Profiling", desc: "Builds a user persona based on psychological color and shape preferences." },
            { title: "Conversational Design Bot", desc: "Context-aware chatbot that modifies 3D models via natural language commands." },
            { title: "Budget-Aware AI Curator", desc: "Suggests items that mathematically fit within your financial constraints." },
            { title: "Material Sustainability Score", desc: "AI evaluates and recommends eco-friendly material alternatives." }
        ]
    },
    {
        category: "Vision & Rendering AI",
        icon: "👁️",
        color: "from-orange-500 to-red-500",
        items: [
            { title: "Super-Resolution Upscaling", desc: "Enhances texture quality of uploaded reference images using AI." },
            { title: "AI-Driven Style Transfer", desc: "Apply the 'vibes' of a famously designed room to your own space instantly." },
            { title: "Texture Synthesis", desc: "Generates seamless PBR textures from simple color swatches." },
            { title: "Contextual Image Inpainting", desc: "Intelligently fills/removes objects from scenes while maintaining perspective." }
        ]
    },
    {
        category: "Blender 3D Studio (Pro)",
        icon: "🎨",
        color: "from-orange-400 to-yellow-500",
        link: "/advanced-editor",
        items: [
            { title: "Professional 3D Modeling", desc: "Desktop-class 3D modeling tools directly in your browser." },
            { title: "Procedural House Building", desc: "Generate multi-story luxury homes with a single click." },
            { title: "Advanced Modifiers", desc: "Extrude, Bevel, Mirror, and Array modifiers for complex geometry." },
            { title: "Real-time Sculpting", desc: "High-performance sculpting with dynamic mesh updates." }
        ]
    }
];

const SolarFeatureBackground = () => {
    const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const onMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setCursor({ x, y });
        };
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    const parallax = (factor) => ({
        transform: `translate3d(${(cursor.x - 0.5) * factor}px, ${(cursor.y - 0.5) * factor}px, 0)`,
    });

    const ringConfig = [
        { size: 520, color: 'rgba(148,163,184,0.22)' },
        { size: 720, color: 'rgba(56,189,248,0.22)' },
        { size: 940, color: 'rgba(244,114,182,0.22)' },
    ];

    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.28),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(15,23,42,0.95),_black_80%)] opacity-90" />

            {/* Central sun & orbits */}
            <div className="absolute inset-[-20%] flex items-center justify-center opacity-70">
                <div className="solar-orbit solar-orbit-1" />
                <div className="solar-orbit solar-orbit-2" />
                <div className="solar-orbit solar-orbit-3" />
            </div>

            {/* Soft planetary rings with parallax */}
            <div className="absolute inset-0 flex items-center justify-center">
                {ringConfig.map((ring, idx) => (
                    <div
                        key={idx}
                        className="rounded-full border border-white/5 shadow-[0_0_40px_rgba(15,23,42,0.9)]"
                        style={{
                            width: ring.size,
                            height: ring.size,
                            background: `radial-gradient(circle at 30% 25%, rgba(248,250,252,0.9), ${ring.color})`,
                            opacity: 0.6,
                            ...parallax(45 + idx * 14),
                        }}
                    />
                ))}
            </div>

            {/* Stars */}
            <div className="absolute inset-0">
                {Array.from({ length: 55 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-slate-100/90 shadow-[0_0_18px_rgba(148,163,184,0.9)]"
                        style={{
                            width: 2 + (i % 3),
                            height: 2 + (i % 3),
                            top: `${(i * 67) % 100}%`,
                            left: `${(i * 43) % 100}%`,
                            ...parallax(70 + (i % 5) * 10),
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// ... (featuresList)

const Features = () => {
    const [selectedFeature, setSelectedFeature] = useState(null);

    return (
        <div className="min-h-screen bg-[#000000] text-gray-100 overflow-hidden relative">
            <FeatureDemoModal
                category={selectedFeature}
                isOpen={!!selectedFeature}
                onClose={() => setSelectedFeature(null)}
            />

            {/* Background Decor */}
            <BackgroundVariant3D color="#2f3e23" />
            <SolarFeatureBackground />
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/60 via-black/70 to-black/90 pointer-events-none z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                {/* Header */}
                <div className="text-center mb-24 space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight"
                    >
                        Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7fff00] to-[#556b2f]">Interior AI</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        The most advanced 3D interior design platform powered by AI, Physics, and Real-time Architecture.
                        <br /><span className="text-[#7fff00] text-sm mt-2 block opacity-80">(Click any card to launch interactive module)</span>
                    </motion.p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuresList.map((feature, featureIdx) => (
                        <motion.div
                            key={feature.category}
                            onClick={() => feature.link ? window.location.href = feature.link : setSelectedFeature(feature.category)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: featureIdx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="glass-panel p-8 rounded-3xl border border-[#2f3e23] hover:border-[#7fff00]/50 hover:shadow-[0_0_40px_rgba(85,107,47,0.3)] transition-all duration-300 group cursor-pointer relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-8 h-8 rounded-full bg-[#7fff00] text-black flex items-center justify-center font-bold">▶</div>
                            </div>

                            <div className="flex items-center space-x-4 mb-6">
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {feature.category}
                                </h3>
                            </div>

                            <ul className="space-y-4">
                                {feature.items.map((item, idx) => (
                                    <li key={idx} className="flex items-start space-x-3">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7fff00] shadow-[0_0_5px_#7fff00]"></span>
                                        <div>
                                            <strong className="block text-gray-200 text-sm">{item.title}</strong>
                                            <span className="text-xs text-gray-500 leading-relaxed block mt-0.5">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Tech Stack Footer */}
                <div className="mt-32 border-t border-[#2f3e23] pt-16 text-center">
                    <h4 className="text-[#c5b358] font-bold tracking-widest uppercase text-sm mb-8">Powered By Advanced Architecture</h4>
                    <div className="flex flex-wrap justify-center gap-4 text-xs font-mono text-gray-500">
                        <span className="px-3 py-1 bg-[#1a2315] rounded border border-[#2f3e23]">React + Three.js + WebGPU</span>
                        <span className="px-3 py-1 bg-[#1a2315] rounded border border-[#2f3e23]">Node + Python Microservices</span>
                        <span className="px-3 py-1 bg-[#1a2315] rounded border border-[#2f3e23]">OpenCV + ML Models</span>
                        <span className="px-3 py-1 bg-[#1a2315] rounded border border-[#2f3e23]">Cloud GPU Rendering</span>
                        <span className="px-3 py-1 bg-[#1a2315] rounded border border-[#2f3e23]">PostgreSQL + Redis</span>
                        <span className="px-3 py-1 bg-[#1a2315] rounded border border-[#2f3e23]">Kubernetes + AWS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;
