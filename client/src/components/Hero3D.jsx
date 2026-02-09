import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed = 1, rotationSpeed = 1, scale = 1, geometry = 'box' }) => {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2 * rotationSpeed;
        meshRef.current.rotation.y = time * 0.3 * rotationSpeed;
    });

    return (
        <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
                {geometry === 'sphere' && <sphereGeometry args={[0.7, 32, 32]} />}
                {geometry === 'torus' && <torusKnotGeometry args={[0.6, 0.2, 128, 16]} />}
                <MeshDistortMaterial
                    color={color}
                    envMapIntensity={1}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    metalness={0.1}
                    distort={0.4}
                    speed={2}
                />
            </mesh>
        </Float>
    );
};

const Hero3D = () => {
    return (
        <div className="absolute inset-0 z-0 w-full h-full bg-gradient-to-br from-slate-900 to-slate-800">
            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#8b5cf6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#3b82f6" />
                <spotLight
                    position={[0, 15, 0]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                />

                {/* Floating Shapes Composition */}
                <group rotation={[0, 0, Math.PI / 4]}>
                    <FloatingShape position={[0, 0, 0]} color="#6366f1" geometry="torus" scale={2} speed={1.5} />
                    <FloatingShape position={[-3, 2, -2]} color="#a855f7" geometry="sphere" scale={1.2} speed={2} />
                    <FloatingShape position={[3, -2, 2]} color="#3b82f6" geometry="box" scale={1.5} speed={1.2} />
                    <FloatingShape position={[-2, -3, 1]} color="#ec4899" geometry="box" scale={0.8} speed={2.5} />
                    <FloatingShape position={[2, 3, -2]} color="#14b8a6" geometry="sphere" scale={1} speed={1.8} />
                </group>

                {/* Environment for reflections */}
                <Environment preset="city" />

                {/* Particles */}
                <group>
                    {Array.from({ length: 50 }).map((_, i) => (
                        <mesh
                            key={i}
                            position={[
                                (Math.random() - 0.5) * 20,
                                (Math.random() - 0.5) * 20,
                                (Math.random() - 0.5) * 10
                            ]}
                        >
                            <sphereGeometry args={[0.05]} />
                            <meshBasicMaterial color="white" transparent opacity={0.6} />
                        </mesh>
                    ))}
                </group>

            </Canvas>
        </div>
    );
};

export default Hero3D;
