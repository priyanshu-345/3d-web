import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import SafeCanvas from './SafeCanvas';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const ParticleNetwork = (props) => {
    const ref = useRef();
    const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }), []);

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#6366f1"
                    size={0.005}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.6}
                />
            </Points>
        </group>
    );
};

const NetworkBackground3D = () => {
    return (
        <div className="absolute inset-0 z-0">
            <SafeCanvas fallbackLabel="Particle Network" camera={{ position: [0, 0, 1] }}>
                <ParticleNetwork />
            </SafeCanvas>
        </div>
    );
};

export default NetworkBackground3D;
