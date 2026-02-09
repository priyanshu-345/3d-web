import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Text3D, Center, useMatcapTexture, Sparkles } from '@react-three/drei';

const LogoModel = () => {
    const meshRef = useRef();
    // Using a standard matcap or material if texture fails

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2; // Gentle sway
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

                {/* Inner Ring (Rotates Opposite) */}
                <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                    <torusGeometry args={[1.4, 0.08, 16, 100]} />
                    <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={2} toneMapped={false} />
                </mesh>

                {/* Central Cube / Shape */}
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

                {/* 3D Text Inside (Abstract Representation) */}
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

const AdvancedLogo = () => {
    return (
        <div className="flex flex-row items-center justify-center gap-2 relative z-20 pointer-events-none fade-in-up">
            <div className="w-32 h-32">
                <Canvas>
                    <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                    <LogoModel />
                </Canvas>
            </div>
            <h2 className="text-3xl font-bold tracking-[0.15em] text-white text-glow-blue uppercase font-sans flex flex-col leading-none text-left">
                <span>Interior</span>
                <span className="text-indigo-400 text-4xl">Designer</span>
            </h2>
        </div>
    );
};

export default AdvancedLogo;
