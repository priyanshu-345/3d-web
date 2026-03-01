import React, { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

// ─── WebGL detection ────────────────────────────────────────
function isWebGLAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}

// ─── CSS Fallback ───────────────────────────────────────────
const Hero3DFallback = () => (
  <div className="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none" style={{
    background: 'linear-gradient(135deg, #020617 0%, #0c0a2a 40%, #1e1b4b 70%, #020617 100%)',
  }}>
    {/* Nebula orbs */}
    {[
      { w: 500, h: 500, t: '5%', l: '10%', c: 'rgba(99,102,241,0.25)', dur: '12s', dx: 60, dy: -40 },
      { w: 450, h: 450, t: '30%', l: '60%', c: 'rgba(168,85,247,0.2)', dur: '15s', dx: -50, dy: 30 },
      { w: 350, h: 350, t: '60%', l: '30%', c: 'rgba(59,130,246,0.18)', dur: '10s', dx: 40, dy: -60 },
      { w: 300, h: 300, t: '70%', l: '75%', c: 'rgba(236,72,153,0.15)', dur: '14s', dx: -35, dy: 50 },
      { w: 400, h: 400, t: '15%', l: '80%', c: 'rgba(14,184,166,0.12)', dur: '11s', dx: 25, dy: -35 },
    ].map((orb, i) => (
      <div key={i} className="absolute rounded-full blur-3xl" style={{
        width: orb.w, height: orb.h, top: orb.t, left: orb.l,
        background: `radial-gradient(circle, ${orb.c}, transparent 70%)`,
        animation: `heroOrb${i} ${orb.dur} ease-in-out infinite alternate`,
      }} />
    ))}

    {/* Star field */}
    {Array.from({ length: 80 }).map((_, i) => (
      <div key={i} className="absolute rounded-full" style={{
        width: `${1 + Math.random() * 3}px`,
        height: `${1 + Math.random() * 3}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        background: ['#6366f1', '#a855f7', '#3b82f6', '#ec4899', '#14b8a6', '#fff'][i % 6],
        opacity: 0.15 + Math.random() * 0.6,
        animation: `heroStar ${3 + Math.random() * 7}s ease-in-out infinite alternate`,
        animationDelay: `${Math.random() * 5}s`,
      }} />
    ))}

    {/* Grid floor perspective */}
    <div className="absolute bottom-0 left-0 right-0 h-[45%] overflow-hidden" style={{
      perspective: '600px',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        transformOrigin: 'bottom center',
        transform: 'rotateX(55deg)',
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'gridScroll 8s linear infinite',
      }} />
    </div>

    {/* Wireframe room outline */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <g stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" fill="none">
        <rect x="200" y="150" width="800" height="500" rx="2">
          <animate attributeName="stroke-dashoffset" from="3000" to="0" dur="4s" fill="freeze" />
          <set attributeName="stroke-dasharray" to="3000" />
        </rect>
        <line x1="200" y1="150" x2="350" y2="50" />
        <line x1="1000" y1="150" x2="850" y2="50" />
        <line x1="350" y1="50" x2="850" y2="50" />
        <line x1="200" y1="650" x2="350" y2="750" />
        <line x1="1000" y1="650" x2="850" y2="750" />
        <line x1="350" y1="750" x2="850" y2="750" />
      </g>
    </svg>

    <style>{`
      @keyframes heroOrb0 { from{transform:translate(0,0) scale(1)} to{transform:translate(60px,-40px) scale(1.2)} }
      @keyframes heroOrb1 { from{transform:translate(0,0) scale(1)} to{transform:translate(-50px,30px) scale(1.15)} }
      @keyframes heroOrb2 { from{transform:translate(0,0) scale(1)} to{transform:translate(40px,-60px) scale(1.25)} }
      @keyframes heroOrb3 { from{transform:translate(0,0) scale(1)} to{transform:translate(-35px,50px) scale(1.1)} }
      @keyframes heroOrb4 { from{transform:translate(0,0) scale(1)} to{transform:translate(25px,-35px) scale(1.18)} }
      @keyframes heroStar { from{transform:translateY(0) scale(1);opacity:.15} to{transform:translateY(-25px) scale(1.5);opacity:.85} }
      @keyframes gridScroll { from{background-position:0 0} to{background-position:0 50px} }
    `}</style>
  </div>
);

// ─── Module-level vars (loaded dynamically) ─────────────────
let Canvas, useFrame, Environment, Float, MeshDistortMaterial, Stars;

// ─── Animated Grid Floor ────────────────────────────────────
const AnimatedGrid = () => {
  const gridRef = useRef();
  useFrame(({ clock }) => {
    if (gridRef.current) {
      gridRef.current.position.z = (clock.getElapsedTime() * 0.5) % 2;
    }
  });

  const gridHelper = useMemo(() => {
    const size = 40;
    const divisions = 40;
    const color1 = new THREE.Color('#1e1b4b');
    const color2 = new THREE.Color('#312e81');
    return { size, divisions, color1, color2 };
  }, []);

  return (
    <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <gridHelper args={[gridHelper.size, gridHelper.divisions, gridHelper.color1, gridHelper.color2]} />
      {/* Glow plane under grid */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
        <planeGeometry args={[40, 40]} />
        <meshBasicMaterial color="#020617" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

// ─── Floating Architecture Shapes ───────────────────────────
const FloatingShape = ({ position, color, speed = 1, rotationSpeed = 1, scale = 1, geometry = 'box' }) => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15 * rotationSpeed;
      meshRef.current.rotation.y = t * 0.25 * rotationSpeed;
      meshRef.current.rotation.z = t * 0.1 * rotationSpeed;
      // Gentle bob
      meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale} castShadow>
        {geometry === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {geometry === 'sphere' && <sphereGeometry args={[0.7, 64, 64]} />}
        {geometry === 'torus' && <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />}
        {geometry === 'octahedron' && <octahedronGeometry args={[0.8, 0]} />}
        {geometry === 'dodecahedron' && <dodecahedronGeometry args={[0.7, 0]} />}
        {geometry === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />}
        {geometry === 'cone' && <coneGeometry args={[0.6, 1.2, 32]} />}
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.3}
          roughness={0.1}
          distort={0.3}
          speed={3}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  );
};

// ─── Wireframe Room ─────────────────────────────────────────
const WireframeRoom = () => {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.15;
    }
  });

  const wireframeMat = useMemo(() => (
    <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.08} />
  ), []);

  return (
    <group ref={groupRef} position={[0, -1, -3]} scale={2.5}>
      {/* Room walls */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 4]} />
        {wireframeMat}
      </mesh>
      {/* Sofa silhouette */}
      <mesh position={[-1.5, 0.4, 1]}>
        <boxGeometry args={[2, 0.6, 0.8]} />
        {wireframeMat}
      </mesh>
      <mesh position={[-1.5, 0.8, 1.35]}>
        <boxGeometry args={[2, 0.6, 0.15]} />
        {wireframeMat}
      </mesh>
      {/* Table */}
      <mesh position={[0.5, 0.3, 0.5]}>
        <boxGeometry args={[1, 0.05, 0.6]} />
        {wireframeMat}
      </mesh>
      {/* Lamp */}
      <mesh position={[2, 0.9, -1]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
        {wireframeMat}
      </mesh>
      <mesh position={[2, 1.5, -1]}>
        <coneGeometry args={[0.3, 0.3, 8]} />
        {wireframeMat}
      </mesh>
      {/* Bookshelf */}
      <mesh position={[2.5, 1.2, -0.5]}>
        <boxGeometry args={[0.6, 2, 0.3]} />
        {wireframeMat}
      </mesh>
    </group>
  );
};

// ─── Swirling Particles ─────────────────────────────────────
const SwirlingParticles = ({ count = 200 }) => {
  const pointsRef = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    const palette = [
      new THREE.Color('#6366f1'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#14b8a6'),
      new THREE.Color('#f59e0b'),
      new THREE.Color('#ffffff'),
    ];
    for (let i = 0; i < count; i++) {
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 4 + Math.random() * 14;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) - 1;
      pos[i * 3 + 2] = r * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      sz[i] = 0.02 + Math.random() * 0.06;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.02) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─── Orbiting Rings ─────────────────────────────────────────
const OrbitingRing = ({ radius = 5, speed = 0.3, color = '#6366f1', tilt = 0 }) => {
  const ringRef = useRef();

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });

  return (
    <group rotation={[tilt, 0, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, 0.015, 16, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.25} />
      </mesh>
    </group>
  );
};

// ─── Dynamic Lights ─────────────────────────────────────────
const DynamicLights = () => {
  const light1 = useRef();
  const light2 = useRef();
  const light3 = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (light1.current) {
      light1.current.position.x = Math.sin(t * 0.5) * 8;
      light1.current.position.z = Math.cos(t * 0.5) * 8;
      light1.current.color.setHSL((t * 0.05) % 1, 0.8, 0.5);
    }
    if (light2.current) {
      light2.current.position.x = Math.sin(t * 0.3 + 2) * 10;
      light2.current.position.y = Math.cos(t * 0.3 + 2) * 6 + 3;
      light2.current.color.setHSL((t * 0.03 + 0.3) % 1, 0.7, 0.5);
    }
    if (light3.current) {
      light3.current.position.z = Math.sin(t * 0.4 + 4) * 8;
      light3.current.position.y = Math.cos(t * 0.4 + 4) * 5;
    }
  });

  return (
    <>
      <pointLight ref={light1} position={[5, 5, 5]} intensity={2} color="#8b5cf6" distance={20} />
      <pointLight ref={light2} position={[-5, 3, -5]} intensity={1.8} color="#3b82f6" distance={18} />
      <pointLight ref={light3} position={[0, -2, 5]} intensity={1.2} color="#ec4899" distance={15} />
      <ambientLight intensity={0.15} />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#6366f1"
        castShadow
      />
    </>
  );
};

// ─── Camera Auto Rotate (replaces OrbitControls) ────────────
const CameraAutoRotate = () => {
  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime() * 0.15;
    camera.position.x = Math.sin(t) * 12;
    camera.position.z = Math.cos(t) * 12;
    camera.position.y = 2 + Math.sin(t * 0.5) * 1.5;
    camera.lookAt(0, 0, 0);
  });
  return null;
};

// ─── Main WebGL Scene ───────────────────────────────────────
const Hero3DWebGL = () => {
  return (
    <div className="absolute inset-0 z-0 w-full h-full" style={{
      background: 'linear-gradient(180deg, #020617 0%, #0c0a2a 50%, #020617 100%)',
      pointerEvents: 'none',
    }}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 2, 12], fov: 55 }}
      >
        {/* Auto-rotating camera (no OrbitControls needed since pointer-events disabled) */}
        <CameraAutoRotate />

        {/* Lights */}
        <DynamicLights />

        {/* Fog for depth */}
        <fog attach="fog" args={['#020617', 10, 30]} />

        {/* Animated grid floor */}
        <AnimatedGrid />

        {/* Wireframe room */}
        <WireframeRoom />

        {/* Orbiting rings */}
        <OrbitingRing radius={6} speed={0.2} color="#6366f1" tilt={Math.PI / 6} />
        <OrbitingRing radius={8} speed={-0.15} color="#a855f7" tilt={-Math.PI / 5} />
        <OrbitingRing radius={10} speed={0.1} color="#3b82f6" tilt={Math.PI / 8} />

        {/* Floating geometric shapes — architecture inspired */}
        <group>
          {/* Central hero shape */}
          <FloatingShape position={[0, 1, 0]} color="#6366f1" geometry="torus" scale={1.8} speed={1.2} rotationSpeed={0.6} />

          {/* Surrounding smaller shapes */}
          <FloatingShape position={[-4, 2.5, -3]} color="#a855f7" geometry="octahedron" scale={1} speed={1.8} rotationSpeed={0.8} />
          <FloatingShape position={[4, -1, 2]} color="#3b82f6" geometry="dodecahedron" scale={1.2} speed={1.5} rotationSpeed={0.7} />
          <FloatingShape position={[-3, -2, 3]} color="#ec4899" geometry="sphere" scale={0.8} speed={2} rotationSpeed={1} />
          <FloatingShape position={[3, 3, -4]} color="#14b8a6" geometry="box" scale={0.9} speed={1.3} rotationSpeed={0.9} />
          <FloatingShape position={[5, 0.5, -2]} color="#f59e0b" geometry="cone" scale={0.7} speed={2.2} rotationSpeed={1.1} />
          <FloatingShape position={[-5, 1, -5]} color="#818cf8" geometry="cylinder" scale={0.6} speed={1.7} rotationSpeed={0.5} />

          {/* Extra distant shapes for depth */}
          <FloatingShape position={[-7, 4, -8]} color="#c084fc" geometry="octahedron" scale={0.5} speed={0.8} rotationSpeed={0.4} />
          <FloatingShape position={[7, -3, -6]} color="#60a5fa" geometry="sphere" scale={0.6} speed={1} rotationSpeed={0.6} />
          <FloatingShape position={[0, 5, -10]} color="#f472b6" geometry="dodecahedron" scale={0.4} speed={0.6} rotationSpeed={0.3} />
        </group>

        {/* Swirling particle cloud */}
        <SwirlingParticles count={200} />

        {/* Starfield */}
        <Stars radius={25} depth={60} count={800} factor={3} saturation={0.5} fade speed={1.5} />

        {/* Environment for reflections */}
        <Environment preset="night" />

      </Canvas>

      {/* Bottom gradient fade so content blends nicely */}
      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
        background: 'linear-gradient(to top, #020617, transparent)',
      }} />
    </div>
  );
};

// ─── Main Export ─────────────────────────────────────────────
const Hero3D = () => {
  const [webglSupported, setWebglSupported] = useState(null);
  const [modulesLoaded, setModulesLoaded] = useState(false);

  useEffect(() => {
    const supported = isWebGLAvailable();
    setWebglSupported(supported);

    if (supported) {
      Promise.all([
        import('@react-three/fiber'),
        import('@react-three/drei'),
      ]).then(([fiberMod, dreiMod]) => {
        Canvas = fiberMod.Canvas;
        useFrame = fiberMod.useFrame;
        Environment = dreiMod.Environment;
        Float = dreiMod.Float;
        MeshDistortMaterial = dreiMod.MeshDistortMaterial;
        Stars = dreiMod.Stars;
        setModulesLoaded(true);
      }).catch(() => {
        setWebglSupported(false);
      });
    }
  }, []);

  if (webglSupported === null || !webglSupported || !modulesLoaded) {
    return <Hero3DFallback />;
  }

  return <Hero3DWebGL />;
};

export default Hero3D;
