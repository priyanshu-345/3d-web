import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import SafeCanvas from './SafeCanvas';
import { OrbitControls, PerspectiveCamera, Environment, Float, Center, Text3D } from '@react-three/drei';

const FloatingIcon = ({ position, rotation, color, scale }) => {
    const meshRef = useRef();

    useFrame((state) => {
        meshRef.current.rotation.y += 0.01;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.8}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                />
            </mesh>
        </Float>
    );
};

const AboutHero3D = () => {
    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 bg-transparent relative">
            <SafeCanvas fallbackLabel="Our Vision in 3D" dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />

                <group>
                    <Center>
                        {/* Abstract Structure representing connectivity and design */}
                        <FloatingIcon position={[-2, 0, 0]} rotation={[0, 0, 0]} color="#6366f1" scale={1.2} />
                        <FloatingIcon position={[0, 1.5, -1]} rotation={[0.5, 0.5, 0]} color="#a855f7" scale={1.5} />
                        <FloatingIcon position={[2, -1, 0.5]} rotation={[-0.5, 0, 0]} color="#ec4899" scale={1} />

                        {/* Connecting Lines (symbolic) */}
                        <line>
                            <bufferGeometry attach="geometry" >
                                <float32BufferAttribute attach="attributes-position" args={[new Float32Array([
                                    -2, 0, 0,
                                    0, 1.5, -1,

                                    0, 1.5, -1,
                                    2, -1, 0.5,

                                    2, -1, 0.5,
                                    -2, 0, 0
                                ]), 3]} />
                            </bufferGeometry>
                            <lineBasicMaterial attach="material" color="white" transparent opacity={0.2} linewidth={1} />
                        </line>
                    </Center>
                </group>

                <Environment preset="city" />
            </SafeCanvas>

            {/* Overlay Text attempting to look like a "Video" Overlay */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl flex justify-between items-center bg-transparent border border-white/10">
                <div>
                    <h3 className="text-white font-bold text-lg">Our Vision in 3D</h3>
                    <p className="text-gray-300 text-sm">Interactive Real-time Rendering Engine</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center animate-pulse cursor-pointer hover:bg-white/20 transition-colors">
                    <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
                </div>
            </div>
        </div>
    );
};

export default AboutHero3D;
