import React, { useRef, useState, useEffect } from 'react';

// Check WebGL availability
function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
        return !!gl;
    } catch (e) {
        return false;
    }
}

// CSS-only fallback logo when WebGL is not available
const LogoFallback = () => {
    return (
        <div
            className="w-32 h-32 flex items-center justify-center relative"
            style={{ perspective: '400px' }}
        >
            {/* Outer ring */}
            <div
                className="absolute"
                style={{
                    width: '80px', height: '80px',
                    border: '3px solid #6366f1',
                    borderRadius: '50%',
                    animation: 'logoSpin 6s linear infinite',
                    boxShadow: '0 0 20px rgba(99,102,241,0.5), inset 0 0 15px rgba(99,102,241,0.2)',
                }}
            />
            {/* Inner ring */}
            <div
                className="absolute"
                style={{
                    width: '60px', height: '60px',
                    border: '2px solid #a855f7',
                    borderRadius: '50%',
                    transform: 'rotateX(60deg)',
                    animation: 'logoSpin 4s linear infinite reverse',
                    boxShadow: '0 0 15px rgba(168,85,247,0.5), inset 0 0 10px rgba(168,85,247,0.2)',
                }}
            />
            {/* Inner cube (diamond shape) */}
            <div
                className="absolute"
                style={{
                    width: '30px', height: '30px',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(99,102,241,0.4))',
                    transform: 'rotate(45deg)',
                    animation: 'logoPulse 3s ease-in-out infinite',
                    boxShadow: '0 0 20px rgba(99,102,241,0.6)',
                    borderRadius: '4px',
                }}
            />
            {/* Center dot */}
            <div
                className="absolute"
                style={{
                    width: '8px', height: '8px',
                    background: 'cyan',
                    borderRadius: '50%',
                    boxShadow: '0 0 12px cyan, 0 0 25px rgba(0,255,255,0.5)',
                    animation: 'logoPulse 2s ease-in-out infinite alternate',
                }}
            />
            {/* Sparkle particles */}
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: '3px', height: '3px',
                        background: '#c084fc',
                        top: `${50 + 40 * Math.sin((i / 8) * Math.PI * 2)}%`,
                        left: `${50 + 40 * Math.cos((i / 8) * Math.PI * 2)}%`,
                        animation: `sparkle ${1.5 + i * 0.2}s ease-in-out infinite alternate`,
                        animationDelay: `${i * 0.15}s`,
                        opacity: 0.6,
                    }}
                />
            ))}

            <style>{`
        @keyframes logoSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: rotate(45deg) scale(1); opacity: 0.8; }
          50%      { transform: rotate(45deg) scale(1.15); opacity: 1; }
        }
        @keyframes sparkle {
          from { opacity: 0.2; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
        </div>
    );
};

// Full 3D logo with WebGL (lazy loaded)
const Logo3D = React.lazy(() =>
    Promise.all([
        import('@react-three/fiber'),
        import('@react-three/drei'),
    ]).then(([fiberMod, dreiMod]) => {
        const { Canvas, useFrame } = fiberMod;
        const { Float, PerspectiveCamera, Center, Sparkles } = dreiMod;

        const LogoModel = () => {
            const meshRef = React.useRef();

            useFrame((state) => {
                const time = state.clock.getElapsedTime();
                if (meshRef.current) {
                    meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
                    meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
                }
            });

            return (
                <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                    <group ref={meshRef}>
                        {/* Outer Ring */}
                        <mesh rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[1.8, 0.1, 16, 100]} />
                            <meshStandardMaterial color="#6366f1" emissive="#4f46e5" emissiveIntensity={2} toneMapped={false} />
                        </mesh>

                        {/* Inner Ring */}
                        <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                            <torusGeometry args={[1.4, 0.08, 16, 100]} />
                            <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={2} toneMapped={false} />
                        </mesh>

                        {/* Central Cube */}
                        <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                            <boxGeometry args={[1, 1, 1]} />
                            <meshPhysicalMaterial
                                color="#ffffff"
                                roughness={0}
                                metalness={1}
                                transmission={1}
                                thickness={1.5}
                                clearcoat={1}
                            />
                        </mesh>

                        {/* Center sphere */}
                        <Center position={[0, 0, 0.6]}>
                            <mesh>
                                <sphereGeometry args={[0.2]} />
                                <meshBasicMaterial color="cyan" />
                            </mesh>
                        </Center>
                    </group>

                    {/* Particle Glow */}
                    <Sparkles count={50} scale={4} size={4} speed={0.4} opacity={0.5} color="#c084fc" />
                </Float>
            );
        };

        // Return as default export for React.lazy
        const Logo3DComponent = () => (
            <div className="w-32 h-32">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                    <LogoModel />
                </Canvas>
            </div>
        );

        return { default: Logo3DComponent };
    })
);

const AdvancedLogo = () => {
    const [webglSupported] = useState(() => isWebGLAvailable());

    return (
        <div className="flex flex-row items-center justify-center gap-2 relative z-20 pointer-events-none fade-in-up">
            {webglSupported ? (
                <React.Suspense fallback={<LogoFallback />}>
                    <Logo3D />
                </React.Suspense>
            ) : (
                <LogoFallback />
            )}
            <h2 className="text-3xl font-bold tracking-[0.15em] text-white text-glow-blue uppercase font-sans flex flex-col leading-none text-left">
                <span>Interior</span>
                <span className="text-indigo-400 text-4xl">Designer</span>
            </h2>
        </div>
    );
};

export default AdvancedLogo;
