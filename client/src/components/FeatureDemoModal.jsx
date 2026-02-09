import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureDemoModal = ({ category, isOpen, onClose }) => {
    const [demoState, setDemoState] = useState('idle'); // idle, processing, complete
    const [progress, setProgress] = useState(0);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setDemoState('idle');
            setProgress(0);
        }
    }, [isOpen]);

    const runDemo = () => {
        setDemoState('processing');
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 15;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setDemoState('complete');
            }
            setProgress(p);
        }, 300);
    };

    if (!isOpen) return null;

    // --- Dynamic Content Generators ---
    const getDemoContent = () => {
        switch (category) {
            case "AI + Machine Learning":
                return (
                    <div className="space-y-6">
                        <div className="h-64 bg-gray-900 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#7fff00] transition-colors cursor-pointer" onClick={runDemo}>
                            {demoState === 'idle' && (
                                <>
                                    <span className="text-4xl mb-4">📸</span>
                                    <p className="text-gray-400 font-mono text-sm">Drop Room Image to Scan</p>
                                    <button className="mt-4 px-4 py-2 bg-[#7fff00]/10 text-[#7fff00] rounded-lg text-xs font-bold border border-[#7fff00]/20 hover:bg-[#7fff00]/20">Upload Photo</button>
                                </>
                            )}
                            {demoState === 'processing' && (
                                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center space-y-4">
                                    <div className="text-[#7fff00] font-mono animate-pulse">Scanning Geometry...</div>
                                    <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-[#7fff00] transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                            {demoState === 'complete' && (
                                <div className="absolute inset-0 bg-[#0f170a] flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">✅</div>
                                        <h4 className="text-white font-bold">3D Model Generated!</h4>
                                        <p className="text-xs text-gray-400 mt-2">Walls: 4 | Windows: 2 | Doors: 1</p>
                                        <button className="mt-4 px-4 py-2 bg-[#7fff00] text-black font-bold rounded-lg text-sm hover:scale-105 transition-transform">View in Editor</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "Real-Time Cost Engine":
                return (
                    <div className="bg-[#050805] p-6 rounded-xl border border-[#2f3e23]">
                        <h4 className="text-[#c5b358] font-bold mb-4 uppercase text-xs tracking-wider">Live Budget Estimate</h4>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between items-center text-gray-400">
                                <span>Flooring (Italian Marble)</span>
                                <span>₹ 1,25,000</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span>False Ceiling (POP)</span>
                                <span>₹ 45,000</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span>Modular Kitchen (Hettich)</span>
                                <span>₹ 2,10,000</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span>Paint (Royal Luxury)</span>
                                <span>₹ 35,000</span>
                            </div>
                            <div className="h-px bg-gray-800 my-2"></div>
                            <div className="flex justify-between items-center text-[#7fff00] font-bold text-lg">
                                <span>TOTAL ESTIMATE</span>
                                <span>₹ 4,15,000</span>
                            </div>
                            <div className="text-xs text-gray-600 mt-4 text-center">
                                * Prices updated live from Delhi NCR market
                            </div>
                        </div>
                    </div>
                );

            case "Physics-Based Simulation":
                return (
                    <div className="relative h-64 bg-gradient-to-br from-orange-900/20 to-blue-900/20 rounded-xl overflow-hidden border border-[#2f3e23]">
                        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-white border border-white/10">
                            Simulating: <span className="text-orange-400">Summer Solstice (June 21)</span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="text-center relative z-10">
                                <span className="text-5xl">🌞</span>
                                <p className="mt-4 text-gray-300 font-light text-sm">Light Intensity: 95000 lux</p>
                                <p className="text-gray-300 font-light text-sm">Shadow Angle: 67°</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500"></div>
                    </div>
                );

            default:
                return (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4 opacity-50">🛠️</div>
                        <h3 className="text-white font-bold text-lg mb-2">Interactive Module</h3>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto">This enterprise module connects to our cloud microservices to provide real-time analysis.</p>
                        <button onClick={runDemo} className="mt-6 px-6 py-2 bg-[#2f3e23] hover:bg-[#3f4d36] text-white rounded-lg text-sm transition-colors border border-[#556b2f]">
                            {demoState === 'processing' ? 'Connecting...' : 'Launch Simulation'}
                        </button>
                    </div>
                );
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-[#0a0f08] w-full max-w-2xl rounded-3xl border border-[#2f3e23] shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[#2f3e23] flex items-center justify-between bg-[#1a2315]/50">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <span className="text-[#7fff00]">⚛</span> {category}
                        </h3>
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {getDemoContent()}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-3 bg-[#050805] text-xs text-gray-600 flex justify-between uppercase tracking-wider font-mono">
                        <span>Status: Online</span>
                        <span>Latency: 12ms</span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default FeatureDemoModal;
