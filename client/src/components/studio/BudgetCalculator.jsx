// Imports
import { useFrame, useThree } from '@react-three/fiber';
import SafeCanvas from '../SafeCanvas';
import { useGLTF, Environment, Float, Stars, Sparkles } from '@react-three/drei';
import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

// --- 3D Background Component ---
const ScrollAnimationModel = () => {
    const meshRef = useRef();
    const { camera } = useThree();

    // Load Model (using the sofa as a fallback/example)
    const { scene } = useGLTF('/models/sofa.glb');

    useEffect(() => {
        // Initial State
        camera.position.set(0, 2, 10);
        if (meshRef.current) {
            meshRef.current.position.set(0, -1, -5);
            meshRef.current.rotation.set(0, 0, 0);
        }

        // Scroll Animation Logic
        const handleWheel = (e) => {
            const delta = e.deltaY * 0.005;

            // GSAP Animation based on scroll direction
            // Move Forward/Back logic
            if (meshRef.current) {
                // If scrolling down (positive delta), move forward and rotate
                // If scrolling up, return

                // We'll create a timeline-like effect based on cumulative scroll or just reaction
                // For this specific 'cinematic' request:
                // Move forward towards camera, rotate Y, then move back

                gsap.to(meshRef.current.position, {
                    z: meshRef.current.position.z + (delta * 5), // Move based on scroll
                    duration: 1,
                    ease: "power2.out",
                    overwrite: 'auto'
                });

                gsap.to(meshRef.current.rotation, {
                    y: meshRef.current.rotation.y + (delta * 2), // Rotate based on scroll
                    duration: 1,
                    ease: "power2.out",
                    overwrite: 'auto'
                });

                // Limits to keep it in view roughly
                if (meshRef.current.position.z > 5) gsap.to(meshRef.current.position, { z: 5, duration: 0.5 });
                if (meshRef.current.position.z < -10) gsap.to(meshRef.current.position, { z: -10, duration: 0.5 });
            }
        };

        window.addEventListener('wheel', handleWheel);
        return () => window.removeEventListener('wheel', handleWheel);
    }, [camera]);

    // Continuous floating for "alive" feel
    useFrame((state) => {
        if (meshRef.current) {
            // subtle additional motion
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <group ref={meshRef}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <primitive object={scene} scale={1.5} />
            </Float>
            {/* Particles for "Cinematic" feel */}
            <Sparkles count={500} scale={12} size={4} speed={0.4} opacity={0.5} color="#4f46e5" />
        </group>
    );
};

// --- Budget Calculator Component ---
const BudgetCalculator = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        area: '',
        style: 'premium',
        items: {
            furniture: true,
            material: true,
            falseCeiling: false,
            painting: true,
            flooring: false
        }
    });

    const styles = [
        { id: 'basic', label: 'Basic', rate: 1200, icon: '🏠', desc: 'Essential functional design' },
        { id: 'premium', label: 'Premium', rate: 2200, icon: '✨', desc: 'High-quality finish & decor' },
        { id: 'luxury', label: 'Luxury', rate: 3500, icon: '💎', desc: 'Top-tier Italian marble & lighting' }
    ];

    const calculateTotal = () => {
        const area = parseFloat(formData.area) || 0;
        const styleRate = styles.find(s => s.id === formData.style)?.rate || 0;
        let multiplier = 1;
        if (formData.items.falseCeiling) multiplier += 0.15;
        if (formData.items.flooring) multiplier += 0.2;
        // Furniture adds lump sum estimate per sqft usually, but let's keep it simple factor

        return Math.round(area * styleRate * multiplier);
    };

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else onComplete(formData);
    };

    const toggleItem = (key) => {
        setFormData(prev => ({
            ...prev,
            items: { ...prev.items, [key]: !prev.items[key] }
        }));
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
            {/* --- 3D Background --- */}
            <div className="absolute inset-0 z-0 select-none">
                <SafeCanvas fallbackLabel="Budget Calculator 3D" camera={{ position: [0, 0, 10], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={1} />
                    <Environment preset="city" />
                    <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    <ScrollAnimationModel />
                </SafeCanvas>
                {/* Overlay Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 pointer-events-none"></div>
            </div>

            <div className="relative z-10 w-full max-w-2xl bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[600px] animate-fade-in-up">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2 text-shadow-lg">Budget Calculator 💰</h2>
                        <p className="text-slate-300 text-sm font-medium">Plan your dream space before you design.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-indigo-400 font-bold text-lg">Step {step}/3</div>
                        <div className="w-24 h-1 bg-slate-700/50 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" style={{ width: `${(step / 3) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    {step === 1 && (
                        <div className="space-y-8 animate-fade-in-up">
                            <div>
                                <label className="block text-slate-300 font-bold mb-4 text-lg">Enter Carpet Area (sq. ft)</label>
                                <input
                                    type="number"
                                    value={formData.area}
                                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                    placeholder="e.g. 1200"
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-6 py-4 text-2xl font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-700"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 font-bold mb-4 text-lg">Select Design Style</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {styles.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setFormData({ ...formData, style: s.id })}
                                            className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden ${formData.style === s.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg scale-105' : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 text-slate-300'}`}
                                        >
                                            <div className="text-4xl mb-3">{s.icon}</div>
                                            <div className="font-bold text-xl mb-1">{s.label}</div>
                                            <div className={`text-xs ${formData.style === s.id ? 'text-indigo-200' : 'text-slate-500'}`}>{s.desc}</div>
                                            <div className="mt-3 text-sm font-mono opacity-80">₹{s.rate}/sq.ft</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in-up">
                            <h3 className="text-xl font-bold text-white mb-4">What do you need?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { key: 'furniture', label: 'Furniture Work', icon: '🛋️' },
                                    { key: 'material', label: 'Civil/Material Work', icon: '🧱' },
                                    { key: 'painting', label: 'Wall Painting', icon: '🎨' },
                                    { key: 'falseCeiling', label: 'False Ceiling', icon: '✨' },
                                    { key: 'flooring', label: 'Flooring Change', icon: '🟧' },
                                ].map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => toggleItem(item.key)}
                                        className={`flex items-center p-4 rounded-xl border transition-all ${formData.items[item.key] ? 'bg-indigo-500/20 border-indigo-500 text-white' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'}`}
                                    >
                                        <div className={`w-6 h-6 rounded flex items-center justify-center mr-4 border ${formData.items[item.key] ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                                            {formData.items[item.key] && '✓'}
                                        </div>
                                        <span className="text-2xl mr-3">{item.icon}</span>
                                        <span className="font-bold">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center space-y-8 animate-fade-in-up flex flex-col items-center justify-center h-full">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-2xl mb-4 animate-bounce">
                                🚀
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-300 mb-2">Estimated Budget Range</h3>
                                <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    ₹ {(calculateTotal() * 0.9).toLocaleString()} - {(calculateTotal() * 1.1).toLocaleString()}
                                </div>
                                <p className="text-slate-400 mt-4 max-w-md mx-auto">
                                    Based on a {formData.area} sq.ft {formData.style} design. <br />
                                    Now let's bring this to life in 3D!
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-slate-900/50 flex justify-between">
                    {step > 1 ? (
                        <button onClick={() => setStep(step - 1)} className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:bg-white/10 transition-colors">
                            Back
                        </button>
                    ) : <div></div>}

                    <button
                        onClick={handleNext}
                        disabled={step === 1 && !formData.area}
                        className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${step === 1 && !formData.area ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-white text-indigo-900 hover:scale-105 shadow-lg shadow-indigo-500/20'}`}
                    >
                        {step === 3 ? 'Start Designing 3D Room →' : 'Next Step'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BudgetCalculator;
