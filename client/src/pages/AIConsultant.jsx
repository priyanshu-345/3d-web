import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { TransformControls, Environment, OrbitControls } from '@react-three/drei';
import blackVideo from './black.mp4';
// Replaced GLB dependencies with built-in shapes to avoid "Duck" issue
        const FurnitureModel = ({type, scale}) => {

    // 1. Procedural Sofa
    const Sofa = () => (
        <group>
            {/* Seat */}
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[2.2, 0.4, 0.9]} />
                <meshStandardMaterial color="#555555" roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.9, -0.35]}>
                <boxGeometry args={[2.2, 0.6, 0.2]} />
                <meshStandardMaterial color="#555555" roughness={0.8} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-1.2, 0.6, 0]}>
                <boxGeometry args={[0.2, 0.8, 0.9]} />
                <meshStandardMaterial color="#555555" roughness={0.8} />
            </mesh>
            <mesh position={[1.2, 0.6, 0]}>
                <boxGeometry args={[0.2, 0.8, 0.9]} />
                <meshStandardMaterial color="#555555" roughness={0.8} />
            </mesh>
            {/* Legs */}
            <mesh position={[-1.1, 0.1, 0.35]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[1.1, 0.1, 0.35]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[-1.1, 0.1, -0.35]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
            <mesh position={[1.1, 0.1, -0.35]}><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#222" /></mesh>
        </group>
        );

    // 2. Procedural Table
    const Table = () => (
        <group>
            {/* Top */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[1.5, 0.1, 1]} />
                <meshStandardMaterial color="#8D6E63" roughness={0.6} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.6, 0.3, -0.4]}>
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.6, 0.3, -0.4]}>
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[-0.6, 0.3, 0.4]}>
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            <mesh position={[0.6, 0.3, 0.4]}>
                <boxGeometry args={[0.1, 0.6, 0.1]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
        </group>
        );

    // 3. Procedural Plant
    const Plant = () => (
        <group>
            {/* Pot */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[0.3, 0.2, 0.6, 32]} />
                <meshStandardMaterial color="#EFEBE9" />
            </mesh>
            {/* Foliage */}
            <mesh position={[0, 0.8, 0]}>
                <dodecahedronGeometry args={[0.5, 1]} />
                <meshStandardMaterial color="#4CAF50" />
            </mesh>
            <mesh position={[0.2, 1.1, 0.1]}>
                <dodecahedronGeometry args={[0.3, 1]} />
                <meshStandardMaterial color="#66BB6A" />
            </mesh>
        </group>
        );

    // 4. Floor Lamp
    const Lamp = () => (
        <group>
            {/* Base */}
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} />
                <meshStandardMaterial color="#212121" />
            </mesh>
            {/* Pole */}
            <mesh position={[0, 1.5, 0]}>
                <cylinderGeometry args={[0.04, 0.04, 3, 16]} />
                <meshStandardMaterial color="#212121" />
            </mesh>
            {/* Shade */}
            <mesh position={[0, 3, 0]}>
                <coneGeometry args={[0.6, 0.8, 32, 1, true]} />
                <meshStandardMaterial color="#FFECB3" transparent opacity={0.9} side={2} />
            </mesh>
            {/* Bulb (Emissive) */}
            <mesh position={[0, 2.8, 0]}>
                <sphereGeometry args={[0.15]} />
                <meshStandardMaterial color="#FFF176" emissive="#FFF176" emissiveIntensity={2} />
            </mesh>
        </group>
        );

    // 5. Chair
    const Chair = () => (
        <group>
            {/* Seat */}
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[0.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#A1887F" />
            </mesh>
            {/* Legs */}
            <mesh position={[0.35, 0.25, 0.35]}><boxGeometry args={[0.08, 0.5, 0.08]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.35, 0.25, 0.35]}><boxGeometry args={[0.08, 0.5, 0.08]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[0.35, 0.25, -0.35]}><boxGeometry args={[0.08, 0.5, 0.08]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.35, 0.25, -0.35]}><boxGeometry args={[0.08, 0.5, 0.08]} /><meshStandardMaterial color="#5D4037" /></mesh>
            {/* Backrest */}
            <mesh position={[0, 1, -0.35]}>
                <boxGeometry args={[0.8, 1, 0.08]} />
                <meshStandardMaterial color="#A1887F" />
            </mesh>
        </group>
        );

    // 6. Bookshelf
    const Bookshelf = () => (
        <group>
            {/* Main Structure */}
            <mesh position={[0, 1.25, 0]}>
                <boxGeometry args={[1.5, 2.5, 0.5]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Shelves (Visual detail usually handled by texture, but we add distinct blocks for items) */}
            <mesh position={[-0.4, 1.8, 0.1]}><boxGeometry args={[0.1, 0.4, 0.3]} /><meshStandardMaterial color="#F44336" /></mesh>
            <mesh position={[-0.25, 1.8, 0.1]}><boxGeometry args={[0.1, 0.45, 0.3]} /><meshStandardMaterial color="#2196F3" /></mesh>
            <mesh position={[0.4, 1, 0.1]}><boxGeometry args={[0.4, 0.1, 0.3]} /><meshStandardMaterial color="#FFC107" /></mesh>
        </group>
        );

    // 7. TV Unit
    const TVUnit = () => (
        <group>
            {/* Base Cabinet */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[2.5, 0.6, 0.6]} />
                <meshStandardMaterial color="#424242" />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[2, 1.1, 0.05]} />
                <meshStandardMaterial color="#111" roughness={0.1} />
            </mesh>
            {/* Stand */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[0.4, 0.2, 0.2]} />
                <meshStandardMaterial color="#222" />
            </mesh>
        </group>
        );

    // 8. Rug
    const Rug = () => (
        <group>
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[3, 2]} />
                <meshStandardMaterial color="#B0BEC5" />
            </mesh>
        </group>
        );

    // 9. Art
    const Art = () => (
        <group>
            <mesh position={[0, 1.5, 0]}>
                <boxGeometry args={[1.2, 1.6, 0.05]} />
                <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            <mesh position={[0, 1.5, 0.03]}>
                <boxGeometry args={[1, 1.4, 0.01]} />
                <meshStandardMaterial color="#FF5722" />
            </mesh>
        </group>
        );

    // 10. Side Table
    const SideTable = () => (
        <group>
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
                <meshStandardMaterial color="#ECEFF1" />
            </mesh>
            <mesh position={[0, 0.25, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
                <meshStandardMaterial color="#CFD8DC" />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
                <meshStandardMaterial color="#CFD8DC" />
            </mesh>
        </group>
        );

    // 11. Shelf (Floating)
    const FloatingShelf = () => (
        <group>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[1.5, 0.1, 0.4]} />
                <meshStandardMaterial color="#795548" />
            </mesh>
        </group>
        );

    // 12. Bean Bag
    const BeanBag = () => (
        <group>
            <mesh position={[0, 0.4, 0]}>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshStandardMaterial color="#E91E63" roughness={0.9} />
            </mesh>
        </group>
        );

    // 13. Bed
    const Bed = () => (
        <group>
            {/* Mattress */}
            <mesh position={[0, 0.3, 0]}>
                <boxGeometry args={[2, 0.4, 2.5]} />
                <meshStandardMaterial color="#EEEEEE" />
            </mesh>
            {/* Frame */}
            <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[2.1, 0.2, 2.6]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 0.75, -1.25]}>
                <boxGeometry args={[2.1, 1.5, 0.1]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Pillows */}
            <mesh position={[-0.5, 0.6, -1]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.7, 0.15, 0.4]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
            <mesh position={[0.5, 0.6, -1]} rotation={[0.2, 0, 0]}>
                <boxGeometry args={[0.7, 0.15, 0.4]} />
                <meshStandardMaterial color="#FFF" />
            </mesh>
            {/* Blanket */}
            <mesh position={[0, 0.35, 0.5]}>
                <boxGeometry args={[2.05, 0.41, 1.5]} />
                <meshStandardMaterial color="#1E88E5" />
            </mesh>
        </group>
        );

    const Box = () => (
        <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
        </mesh>
        );

    const getModel = () => {
        const t = type?.toLowerCase() || '';
        if (t.includes('sofa')) return <Sofa />;
        if (t.includes('coffee table') || (t.includes('table') && !t.includes('side'))) return <Table />;
        if (t.includes('plant') || t.includes('decor') || t.includes('succulent')) return <Plant />;
        if (t.includes('lamp') || t.includes('light')) return <Lamp />;
        if (t.includes('chair')) return <Chair />;
        if (t.includes('bookshelf') || t.includes('cabinet')) return <Bookshelf />;
        if (t.includes('tv') || t.includes('console')) return <TVUnit />;
        if (t.includes('rug') || t.includes('carpet')) return <Rug />;
        if (t.includes('art') || t.includes('painting')) return <Art />;
        if (t.includes('side table') || t.includes('stool')) return <SideTable />;
        if (t.includes('floating')) return <FloatingShelf />;
        if (t.includes('bean')) return <BeanBag />;
        if (t.includes('bed')) return <Bed />;
        return <Box />;
    };

        return (
        <group scale={scale || [1, 1, 1]}>
            <Suspense fallback={null}>
                {getModel()}
            </Suspense>
        </group>
        );
};

        // --- AR View Component ---
        const ARPlacementView = ({image, furnitureType, onClose, mode = 'ar'}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
                <h3 className="text-xl font-bold text-white">
                    {mode === 'ar' ? 'AR Design Mode' : '3D Studio Mode'} ({furnitureType})
                </h3>
                <button
                    onClick={onClose}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium transition-colors border border-white/20"
                >
                    Close
                </button>
            </div>

            {/* Main AR Area */}
            <div className="flex-1 relative w-full h-full overflow-hidden bg-gray-900">

                {/* 1. Background Image (User's Room) - ONLY IN AR MODE */}
                {mode === 'ar' && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={image}
                            alt="Room Background"
                            className="w-full h-full object-cover opacity-100"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                )}

                {/* 3D Background - ONLY IN 3D MODE */}
                {mode === '3d' && (
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-800 to-gray-900">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        </div>
                    </div>
                )}

                {/* 2. 3D Canvas Layer */}
                <div className="absolute inset-0 z-10">
                    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                        <pointLight position={[-5, 5, -5]} intensity={0.5} />
                        <Environment preset="apartment" />

                        {/* Grid for 3D Mode */}
                        {mode === '3d' && <gridHelper args={[20, 20, 0x444444, 0x222222]} />}

                        {/* Interactive Object */}
                        <Suspense fallback={null}>
                            {mode === 'ar' ? (
                                <TransformControls mode="translate" translationSnap={0.5}>
                                    <group>
                                        <FurnitureModel type={furnitureType} scale={[1.2, 1.2, 1.2]} />
                                    </group>
                                </TransformControls>
                            ) : (
                                <group>
                                    <FurnitureModel type={furnitureType} scale={[1.5, 1.5, 1.5]} />
                                    <OrbitControls makeDefault autoRotate autoRotateSpeed={2} minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} enableZoom={true} />
                                </group>
                            )}

                            {mode === 'ar' && (
                                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} enableZoom={true} enablePan={false} />
                            )}
                        </Suspense>
                    </Canvas>
                </div>

                {/* Instructions Overlay */}
                <div className="absolute bottom-10 left-0 w-full text-center z-20 pointer-events-none">
                    <div className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
                        <p className="text-white text-sm font-medium">
                            {mode === 'ar' ? (
                                <>👇 <span className="text-indigo-400 font-bold">Drag Gizmo</span> to Place & Rotate Camera</>
                            ) : (
                                <>✨ <span className="text-indigo-400 font-bold">3D Preview</span> - Drag to Rotate</>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        );
};


const AIConsultant = () => {
    const [image, setImage] = useState(null);
        const [analyzing, setAnalyzing] = useState(false);
        const [result, setResult] = useState(null);
        const [step, setStep] = useState(1); // 1: Upload, 2: Analyzing, 3: Results
        const [arMode, setArMode] = useState(false);
        const [viewMode, setViewMode] = useState('ar'); // 'ar' or '3d'
        const [selectedFurniture, setSelectedFurniture] = useState(null);

        const fileInputRef = useRef(null);
        const videoRef = useRef(null);
        const [cameraActive, setCameraActive] = useState(false);

        // Extended Mock Data with 12 Suggestions
        const mockAIResponse = {
            room_type: "Master Bedroom / Living",
        empty_space: ["Center", "Corners", "Walls"],
        suggestions: [
        {id: 13, name: "Queen Size Bed", type: "bed", reason: "Centerpiece for the bedroom." },
        {id: 1, name: "Modern Grey Sofa", type: "sofa", reason: "Primary seating for the center." },
        {id: 2, name: "Wooden Coffee Table", type: "coffee table", reason: "Essential for the sofa area." },
        {id: 3, name: "Large Potted Plant", type: "plant", reason: "Adds greenery to the corner." },
        {id: 4, name: "Floor Lamp", type: "lamp", reason: "Ambient lighting for evenings." },
        {id: 5, name: "Accent Chair", type: "chair", reason: "Extra seating with style." },
        {id: 6, name: "Bookshelf", type: "bookshelf", reason: "Storage and display space." },
        {id: 7, name: "TV Unit Console", type: "tv unit", reason: "Entertainment center base." },
        {id: 8, name: "Area Rug", type: "rug", reason: "Defines the seating zone." },
        {id: 9, name: "Abstract Wall Art", type: "art", reason: "Adds color to empty walls." },
        {id: 10, name: "Side Table", type: "side table", reason: "Convenience next to sofa." },
        {id: 11, name: "Floating Shelf", type: "floating shelf", reason: "Vertical storage solution." },
        {id: 12, name: "Cozy Bean Bag", type: "bean bag", reason: "Casual seating option." }
        ]
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setImage(reader.result);
        setStep(2);
        simulateAnalysis();
            };
        reader.readAsDataURL(file);
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
            video: {facingMode: "environment" }
            });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
                // Wait for video only when metadata loaded to ensure size is correct
                videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
                };
        setCameraActive(true);
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions or use Upload.");
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
        // Set canvas size to match video stream
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);

        stopCamera();
        setStep(2);
        simulateAnalysis();
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const simulateAnalysis = () => {
            setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
        setResult(mockAIResponse);
        setStep(3);
        }, 2000);
    };

    const resetProcess = () => {
            setImage(null);
        setResult(null);
        setStep(1);
        setAnalyzing(false);
        setArMode(false);
    };

    const openAR = (type, mode = 'ar') => {
            console.log("Opening AR for:", type, mode);
        setSelectedFurniture(type);
        setViewMode(mode);
        setArMode(true);
    };

    return (
        <div className="min-h-screen text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background Video */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-80">
                    <source src={blackVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* AR MODE OVERLAY */}
            {arMode && image && (
                <ARPlacementView
                    image={image}
                    furnitureType={selectedFurniture}
                    onClose={() => setArMode(false)}
                    mode={viewMode}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header only if not in AR mode */}
                {!arMode && (
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-blur-reveal">
                            AI Interior <span className="gradient-text-animated">Consultant</span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                            Snap a photo. Get AI suggestions. <span className="text-indigo-400 font-semibold">Visualize in AR or 3D.</span>
                        </p>
                    </div>
                )}

                {/* STEP 1: UPLOAD / CAMERA */}
                {step === 1 && (
                    <div className="max-w-3xl mx-auto fade-in-up delay-200">
                        <div className={`border-2 border-dashed border-white/10 rounded-3xl p-6 md:p-12 text-center transition-all ${cameraActive ? 'bg-black border-indigo-500 shadow-2xl scale-[1.02]' : 'bg-white/5 hover:bg-white/10'}`}>

                            {!cameraActive ? (
                                <>
                                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Start Your Design</h3>
                                    <p className="text-slate-400 mb-8">Upload or take a picture of your room.</p>

                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <button
                                            onClick={startCamera}
                                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-full font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 text-lg"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                                            Use Camera
                                        </button>
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold transition-all flex items-center justify-center gap-2 text-lg"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                            Upload File
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        className="w-full rounded-2xl shadow-2xl border-4 border-indigo-500/30 object-cover max-h-[70vh]"
                                    ></video>

                                    <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-6 z-10">
                                        <button
                                            onClick={stopCamera}
                                            className="w-12 h-12 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg backdrop-blur"
                                            title="Cancel"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>

                                        <button
                                            onClick={capturePhoto}
                                            className="w-20 h-20 rounded-full bg-white border-4 border-indigo-600 flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_30px_rgba(79,70,229,0.5)] animate-pulse-glow"
                                            title="Click Picture"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-indigo-600"></div>
                                        </button>
                                    </div>

                                    <div className="absolute top-4 bg-black/50 backdrop-blur px-4 py-2 rounded-full text-white text-sm">
                                        Looking for room layout...
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STEP 2: ANALYZING */}
                {step === 2 && (
                    <div className="max-w-4xl mx-auto text-center fade-in-up">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 mb-8 inline-block max-w-full">
                            <img src={image} alt="Analyzing Room" className="max-h-[60vh] object-cover opacity-50 block" />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent w-full h-full animate-scan"></div>

                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <h3 className="text-xl font-bold text-white">Detecting layout...</h3>
                                    <p className="text-slate-400 text-sm mt-1">Analyzing walls, floor, and lighting</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: RESULTS & AR PROMPTS */}
                {step === 3 && result && (
                    <div className="max-w-6xl mx-auto fade-in-up">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                            {/* Left: Original Image */}
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 group h-fit">
                                <img src={image} alt="Analyzed Room" className="w-full h-auto object-cover" />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        Analysed ✓
                                    </div>
                                </div>
                            </div>

                            {/* Right: Recommendations */}
                            <div className="flex flex-col justify-center">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-2">AI Suggestions</h2>
                                    <p className="text-slate-400">
                                        We detected a <span className="text-white font-semibold">{result.room_type}</span> with empty space in the <span className="text-white font-semibold">{result.empty_space.join(" & ")}</span>.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {result.suggestions.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white/5 border border-white/10 p-5 rounded-xl transition-all hover:scale-[1.02] group flex items-start gap-4"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors shrink-0">
                                                {item.type.includes('sofa') && '🛋️'}
                                                {item.type.includes('table') && '🪵'}
                                                {item.type.includes('plant') && '🪴'}
                                                {item.type.includes('decor') && '🪴'}
                                                {item.type.includes('lamp') && '💡'}
                                                {item.type.includes('chair') && '🪑'}
                                                {item.type.includes('shelf') && '📚'}
                                                {item.type.includes('book') && '📚'}
                                                {item.type.includes('tv') && '📺'}
                                                {item.type.includes('art') && '🎨'}
                                                {item.type.includes('rug') && '🧶'}
                                                {item.type.includes('bean') && '🛋️'}
                                                {item.type.includes('bed') && '🛏️'}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className="text-lg font-bold text-white">{item.name}</h4>
                                                </div>
                                                <p className="text-slate-400 text-sm mb-3">{item.reason}</p>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openAR(item.type, 'ar')}
                                                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1 transition-colors"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                                                        AR View
                                                    </button>
                                                    <button
                                                        onClick={() => openAR(item.type, '3d')}
                                                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1 transition-colors border border-white/10"
                                                    >
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                                        3D Model
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={resetProcess}
                                    className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                    Try Another Photo
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        );
};

        export default AIConsultant;
