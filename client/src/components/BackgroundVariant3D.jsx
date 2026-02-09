import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

const FloatingParticles = (props) => {
    const ref = useRef();
    // Different distribution for variation: cylinder vs sphere
    const positions = useMemo(() => random.inSphere(new Float32Array(3000), { radius: 1.2 }), []);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 15;
        ref.current.rotation.y -= delta / 10;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#aa44ff" // Purple/Pink varied
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
};

const BackgroundVariant3D = ({ color = "#aa44ff" }) => {
    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <FloatingParticles color={color} />
            </Canvas>
        </div>
    );
};

export default BackgroundVariant3D;
