import { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PresentationControls, Html } from '@react-three/drei';
import { designsAPI } from '../utils/api';
import * as THREE from 'three';

// Helper component to handle camera transitions
const CameraController = ({ view }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  useEffect(() => {
    if (view) {
      const positions = {
        iso: [15, 15, 15],
        top: [0, 25, 0],
        front: [0, 5, 20],
        side: [20, 5, 0]
      };

      const targetPos = positions[view] || positions.iso;

      // Smoothly animate camera position
      camera.position.set(...targetPos);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    }
  }, [view, camera]);

  return <OrbitControls
    ref={controlsRef}
    args={[camera, gl.domElement]}
    enablePan={true}
    enableZoom={true}
    enableRotate={true}
    minDistance={2}
    maxDistance={100}
    maxPolarAngle={Math.PI / 2} // Prevent going under the floor
  />;
};

// --- Procedural Room Components ---

const RoomShell = ({ wallColor, roomConfig, children }) => {
  const { width, height, length, wallThickness } = roomConfig;

  return (
    <group>
      {/* Floor - Adaptive size */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[width + 40, length + 40]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      <gridHelper args={[width + 40, width + 40, 0x444444, 0x222222]} position={[0, -0.05, 0]} />

      {/* Ceiling - Optional (visible from inside?) - omitted for top-down view clarity, or added high up */}

      {/* Back Wall */}
      <mesh position={[0, height / 2, -length / 2 - wallThickness / 2]} receiveShadow castShadow>
        <boxGeometry args={[width + wallThickness * 2, height, wallThickness]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-width / 2 - wallThickness / 2, height / 2, 0]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, height, length]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Right Wall */}
      <mesh position={[width / 2 + wallThickness / 2, height / 2, 0]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, height, length]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>

      {/* Baseboards / Skirting (Detail) */}
      <mesh position={[0, 0.5, -length / 2 + 0.1]}>
        <boxGeometry args={[width, 1, 0.2]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-width / 2 + 0.1, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, length]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[width / 2 - 0.1, 0.5, 0]}>
        <boxGeometry args={[0.2, 1, length]} />
        <meshStandardMaterial color="#333" />
      </mesh>


      {children}
    </group>
  );
};

const LivingRoomScene = ({ wallColor, roomConfig }) => (
  <RoomShell wallColor={wallColor} roomConfig={roomConfig}>
    {/* Advanced Sofa Set */}
    <group position={[0, 0, -2]}>
      {/* Main Sofa */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[6, 1, 2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, -0.8]} castShadow>
        <boxGeometry args={[6, 1.5, 0.4]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>
      <mesh position={[-2.8, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 1.2, 2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>
      <mesh position={[2.8, 1, 0]} castShadow>
        <boxGeometry args={[0.4, 1.2, 2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>

      {/* Designer Cushions */}
      <mesh position={[-1.5, 1.2, -0.5]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1, 1, 0.3]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[1.5, 1.2, -0.5]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[1, 1, 0.3]} />
        <meshStandardMaterial color="#f1c40f" />
      </mesh>
    </group>

    {/* Modern Coffee Table */}
    <group position={[0, 0, 2]}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#ecf0f1" metalness={0.1} roughness={0.1} />
      </mesh>
      {/* Legs */}
      <mesh position={[-1, 0.4, -1]}>
        <cylinderGeometry args={[0.1, 0.05, 0.8]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </mesh>
      <mesh position={[1, 0.4, 1]}>
        <cylinderGeometry args={[0.1, 0.05, 0.8]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </mesh>
      <mesh position={[-1, 0.4, 1]}>
        <cylinderGeometry args={[0.1, 0.05, 0.8]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </mesh>
      <mesh position={[1, 0.4, -1]}>
        <cylinderGeometry args={[0.1, 0.05, 0.8]} />
        <meshStandardMaterial color="#bdc3c7" metalness={0.8} />
      </mesh>

      {/* Decor Items on Table */}
      <mesh position={[0.5, 1, 0.5]}>
        <boxGeometry args={[0.5, 0.1, 0.8]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      <mesh position={[-0.5, 1.1, -0.2]}>
        <cylinderGeometry args={[0.2, 0.3, 0.6]} />
        <meshStandardMaterial color="#e67e22" />
      </mesh>
    </group>

    {/* Entertainment Unit */}
    <group position={[0, 0.5, 6]} rotation={[0, Math.PI, 0]}>
      <mesh position={[0, 0.5, -4]}>
        <boxGeometry args={[8, 1, 1.5]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      <mesh position={[0, 2.5, -4]}>
        <boxGeometry args={[6, 3.5, 0.1]} />
        <meshStandardMaterial color="black" roughness={0.05} metalness={0.9} />
      </mesh>
      {/* Speakers */}
      <mesh position={[-3.5, 1.5, -4]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[3.5, 1.5, -4]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>

    {/* Rug */}
    <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 8]} />
      <meshStandardMaterial color="#95a5a6" map={null} roughness={1} />
    </mesh>

    {/* Floor Lamp */}
    <group position={[5, 0, -4]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 6]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[1, 1.5, 32, 1, true]} />
        <meshStandardMaterial color="#f1c40f" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>

    {/* Wall Art */}
    <mesh position={[0, 5, -roomConfig.length / 2 - roomConfig.wallThickness / 2 + 0.2]}>
      <boxGeometry args={[4, 3, 0.1]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
    <mesh position={[0, 5, -roomConfig.length / 2 - roomConfig.wallThickness / 2 + 0.22]}>
      <boxGeometry args={[3.6, 2.6, 0.0]} />
      <meshStandardMaterial color="#e74c3c" />
    </mesh>

  </RoomShell>
);

const KitchenScene = ({ wallColor, roomConfig }) => (
  <RoomShell wallColor={wallColor} roomConfig={roomConfig}>
    {/* Modern L-Shape Kitchen */}
    <group position={[-roomConfig.width / 2 + 4, 0, -roomConfig.length / 2 + 4]}>
      {/* Counters */}
      <mesh position={[0, 1.5, -2]} castShadow>
        <boxGeometry args={[12, 3, 2]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <mesh position={[0, 3.1, -2]} castShadow>
        <boxGeometry args={[12.2, 0.1, 2.2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.1} />
      </mesh>

      {/* Side Counter */}
      <mesh position={[5, 1.5, 2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[6, 3, 2]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <mesh position={[5, 3.1, 2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[6.2, 0.1, 2.2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.1} />
      </mesh>

      {/* Upper Cabinets */}
      <mesh position={[0, 6, -3]}>
        <boxGeometry args={[12, 2.5, 1.2]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
    </group>

    {/* Advanced Appliances */}
    {/* Fridge - American Style Double Door */}
    <group position={[-roomConfig.width / 2 + 2, 0, 4]}>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[3, 7, 3]} />
        <meshStandardMaterial color="#dfe6e9" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Handles */}
      <mesh position={[-0.2, 3.5, 1.6]}>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#b2bec3" />
      </mesh>
      <mesh position={[0.2, 3.5, 1.6]}>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#b2bec3" />
      </mesh>
    </group>

    {/* Kitchen Island with Stools */}
    <group position={[2, 0, 2]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 3]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[6.5, 0.1, 3.5]} />
        <meshStandardMaterial color="#fff" roughness={0.1} />
      </mesh>

      {/* Sink details */}
      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[2, 0.05, 1.5]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.8} />
      </mesh>
      {/* Faucet */}
      <mesh position={[0, 3.5, -0.8]} rotation={[0.5, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>

      {/* Bar Stools */}
      {[-2, 0, 2].map(x => (
        <group key={x} position={[x, 0, 2.5]}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.1]} />
            <meshStandardMaterial color="#e67e22" />
          </mesh>
          <mesh position={[0, 0.75, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.5]} />
            <meshStandardMaterial color="#2d3436" />
          </mesh>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.6, 0.6, 0.1]} />
            <meshStandardMaterial color="#2d3436" />
          </mesh>
        </group>
      ))}
    </group>

    {/* Range Hood */}
    <group position={[-roomConfig.width / 2 + 4, 6, -roomConfig.length / 2 + 4]}>
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[1.5, 2, 4]} />
        <meshStandardMaterial color="#636e72" metalness={0.7} />
      </mesh>
    </group>
  </RoomShell>
);

const BedroomScene = ({ wallColor, roomConfig }) => (
  <RoomShell wallColor={wallColor} roomConfig={roomConfig}>
    {/* King Size Bed Setup */}
    <group position={[0, 0.5, -2]}>
      {/* Platform */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[6, 1, 7]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[5.6, 0.8, 6.6]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      {/* Headboard - Tufted style mockup */}
      <mesh position={[0, 2.5, -3.4]}>
        <boxGeometry args={[7, 4, 0.4]} />
        <meshStandardMaterial color="#8d6e63" />
      </mesh>
      {/* 4 Pillows */}
      <mesh position={[-1.5, 1.8, -2.8]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.5, 0.6, 1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[-0.5, 1.9, -2.9]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.5, 0.6, 1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[1.5, 1.8, -2.8]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.5, 0.6, 1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.5, 1.9, -2.9]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[1.5, 0.6, 1]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Comforter */}
      <mesh position={[0, 1.3, 1]}>
        <boxGeometry args={[5.8, 0.9, 4]} />
        <meshStandardMaterial color="#a1887f" />
      </mesh>
    </group>

    {/* Bedside Tables */}
    <group position={[-4, 0, -2]}>
      <mesh position={[0, 1, -1]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Lamp */}
      <mesh position={[0, 2.5, -1]}>
        <cylinderGeometry args={[0.3, 0.4, 1]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.9} />
      </mesh>
    </group>
    <group position={[4, 0, -2]}>
      <mesh position={[0, 1, -1]}>
        <boxGeometry args={[1.5, 2, 1.5]} />
        <meshStandardMaterial color="#5d4037" />
      </mesh>
      {/* Lamp */}
      <mesh position={[0, 2.5, -1]}>
        <cylinderGeometry args={[0.3, 0.4, 1]} />
        <meshStandardMaterial color="#fff" transparent opacity={0.9} />
      </mesh>
    </group>

    {/* Large Wardrobe with Mirror */}
    <group position={[6, 0, 2]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[8, 7, 2]} />
        <meshStandardMaterial color="#4e342e" />
      </mesh>
      {/* Mirror Panel */}
      <mesh position={[0, 3.5, 1.05]}>
        <planeGeometry args={[3, 6]} />
        <meshStandardMaterial color="#b2bec3" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>

    {/* Bedroom Bench */}
    <group position={[0, 0, 3]}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[4, 1, 1.5]} />
        <meshStandardMaterial color="#d7ccc8" />
      </mesh>
    </group>
  </RoomShell>
);

const BathroomScene = ({ wallColor, roomConfig }) => (
  <RoomShell wallColor={wallColor} roomConfig={roomConfig}>
    {/* Luxury Bathtub area */}
    <group position={[-4, 0.5, -3]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[4, 2, 6]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Water */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[3.2, 0.1, 5.2]} />
        <meshStandardMaterial color="#81ecec" transparent opacity={0.8} />
      </mesh>
      {/* Faucet Floor Standing */}
      <group position={[2.2, 0, 0]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshStandardMaterial color="silver" metalness={1} />
        </mesh>
        <mesh position={[-0.5, 2.8, 0]} rotation={[0, 0, -1]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="silver" metalness={1} />
        </mesh>
      </group>
    </group>

    {/* Double Vanity */}
    <group position={[4, 1.5, -4]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5, 3, 2]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[5.2, 0.1, 2.2]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Mirrors */}
      <mesh position={[-1.2, 3.5, 0]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#b2bec3" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.2, 3.5, 0]}>
        <boxGeometry args={[2, 3, 0.1]} />
        <meshStandardMaterial color="#b2bec3" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Sinks */}
      <mesh position={[-1.2, 1.6, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.3]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[1.2, 1.6, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.3]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </group>

    {/* Shower Cabin */}
    <group position={[4, 0, 4]}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4, 0.2, 4]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Glass Walls */}
      <mesh position={[-1.9, 3.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.1, 7, 4]} />
        <meshStandardMaterial color="#a5b1c2" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 3.5, -1.9]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.1, 7, 4]} />
        <meshStandardMaterial color="#a5b1c2" transparent opacity={0.3} />
      </mesh>
      {/* Shower Head */}
      <mesh position={[1, 6, 0]}>
        <cylinderGeometry args={[0.5, 0.1, 0.2]} />
        <meshStandardMaterial color="silver" metalness={1} />
      </mesh>
    </group>
  </RoomShell>
);

const OfficeScene = ({ wallColor, roomConfig }) => (
  <RoomShell wallColor={wallColor} roomConfig={roomConfig}>
    {/* Executive Desk */}
    <group position={[0, 0, -1]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[7, 0.2, 3.5]} />
        <meshStandardMaterial color="#2d3436" roughness={0.2} />
      </mesh>
      <mesh position={[-3, 0.75, 0]}>
        <boxGeometry args={[0.8, 1.5, 3]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh position={[3, 0.75, 0]}>
        <boxGeometry args={[0.8, 1.5, 3]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>

      {/* Computer Setup */}
      {/* Monitor */}
      <mesh position={[0, 2.2, -1]}>
        <boxGeometry args={[3, 1.5, 0.1]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0, 1.8, -1]}>
        <cylinderGeometry args={[0.2, 0.4, 0.5]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      {/* Keyboard & Mouse */}
      <mesh position={[0, 1.6, 0.5]}>
        <boxGeometry args={[1.5, 0.05, 0.6]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1, 1.6, 0.5]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>

    {/* Ergonomic Chair */}
    <group position={[0, 0, 1.5]}>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.8, 0.2, 1.8]} />
        <meshStandardMaterial color="#d63031" />
      </mesh>
      <mesh position={[0, 2.5, 0.8]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[1.8, 3, 0.2]} />
        <meshStandardMaterial color="#d63031" />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 1]} />
        <meshStandardMaterial color="#b2bec3" />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
    </group>

    {/* Library / Shelves */}
    <group position={[-5, 0, -4]}>
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[4, 7, 1]} />
        <meshStandardMaterial color="#636e72" />
      </mesh>
      {/* Books Simulation */}
      {[1, 2, 3, 4, 5, 6].map(i => (
        <mesh key={i} position={[0, i, 0.2]}>
          <boxGeometry args={[3.5, 0.8, 0.8]} />
          <meshStandardMaterial color={`hsl(${i * 60}, 50%, 50%)`} />
        </mesh>
      ))}
    </group>

    {/* Plants */}
    <group position={[5, 0, -4]}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 2]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0, 3, 0]}>
        <dodecahedronGeometry args={[1.5]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>
    </group>
  </RoomShell>
);


const ModelViewer = () => {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [wallColor, setWallColor] = useState('#e6e6e6');
  const [lightingPreset, setLightingPreset] = useState('sunset');
  const [showControls, setShowControls] = useState(true);
  const [cameraView, setCameraView] = useState('iso');

  // New States for Room Customization
  const [roomConfig, setRoomConfig] = useState({
    width: 25,
    height: 12,
    length: 20,
    wallThickness: 1.0
  });

  const lightingPresets = {
    sunset: { env: 'sunset', ambient: 0.5, directional: 1.0 },
    dawn: { env: 'dawn', ambient: 0.4, directional: 0.8 },
    night: { env: 'night', ambient: 0.2, directional: 0.5 },
    studio: { env: 'studio', ambient: 0.6, directional: 1.2 },
    city: { env: 'city', ambient: 0.5, directional: 1.0 },
  };

  const wallColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Warm White', value: '#fffdd0' },
    { name: 'Beige', value: '#f5f5dc' },
    { name: 'Light Gray', value: '#d3d3d3' },
    { name: 'Soft Blue', value: '#e0f7fa' },
    { name: 'Sage Green', value: '#dcedc8' },
    { name: 'Blush Pink', value: '#f8bbd0' },
    { name: 'Olive Dark', value: '#556b2f' },
  ];

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    try {
      setLoading(true);

      const curatedModels = [
        { _id: 'living-room-1', title: 'Modern Luxury Living Room', category: 'living-room', price: 5000, description: 'Complete living room with sofa, coffee table, and entertainment unit.' },
        { _id: 'kitchen-1', title: 'Modular Nordic Kitchen', category: 'kitchen', price: 8500, description: 'Fully equipped kitchen with island, cabinets, and appliances.' },
        { _id: 'bedroom-1', title: 'Master Bedroom Suite', category: 'bedroom', price: 6000, description: 'Relaxing bedroom with king-size bed, wardrobe, and side tables.' },
        { _id: 'office-1', title: 'CEO Office Workspace', category: 'office', price: 4500, description: 'Professional workspace with executive desk and library.' },
        { _id: 'bathroom-1', title: 'Spa Retreat Bathroom', category: 'bathroom', price: 3500, description: 'Luxury bathroom with bathtub and modern vanity.' },
        { _id: 'exterior-1', title: 'Modern Villa Facade', category: 'exterior', price: 12000, description: 'Exterior view of a modern villa.' }
      ];

      const foundModel = curatedModels.find(m => m._id === id);

      if (foundModel) {
        setDesign(foundModel);
        setError(null);
      } else {
        // Fallback/Legacy
        const data = await designsAPI.getById(id);
        setDesign(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching design:', err);
      // Fallback for demo if API fails
      setDesign({ title: 'Unknown Design', category: 'living-room', price: 0 });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const renderScene = () => {
    if (!design) return null;
    switch (design.category) {
      case 'kitchen': return <KitchenScene wallColor={wallColor} roomConfig={roomConfig} />;
      case 'bedroom': return <BedroomScene wallColor={wallColor} roomConfig={roomConfig} />;
      case 'office': return <OfficeScene wallColor={wallColor} roomConfig={roomConfig} />;
      case 'bathroom': return <BathroomScene wallColor={wallColor} roomConfig={roomConfig} />;
      default: return <LivingRoomScene wallColor={wallColor} roomConfig={roomConfig} />;
    }
  };

  const updateRoomConfig = (key, value) => {
    setRoomConfig(prev => ({ ...prev, [key]: parseFloat(value) }));
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading 3D model...</p>
    </div>
  </div>;

  if (!design) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Design</h2>
        <p className="text-gray-600 mb-6">{error || 'Design not found'}</p>
        <Link
          to="/gallery"
          className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Back to Gallery
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      {!fullscreen && (
        <div className="bg-gray-800 text-white py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <Link to="/gallery" className="text-primary-400 hover:text-primary-300 flex items-center mb-2">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg> Back to Gallery
              </Link>
              <h1 className="text-2xl font-bold">{design.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => setShowControls(!showControls)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors">
                {showControls ? 'Hide Controls' : 'Show Controls'}
              </button>
              <button onClick={() => setFullscreen(!fullscreen)} className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors">
                {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Header */}
      {fullscreen && (
        <div className="fixed top-0 left-0 right-0 bg-gray-800 bg-opacity-90 text-white py-2 px-4 z-50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/gallery"
              className="text-primary-400 hover:text-primary-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
            <h1 className="text-lg font-bold">{design.title}</h1>
          </div>
          <button
            onClick={() => setFullscreen(false)}
            className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors"
          >
            Exit Fullscreen
          </button>
        </div>
      )}

      {/* 3D Viewer */}
      <div className={`${fullscreen ? 'fixed inset-0 z-40' : 'relative'} bg-gray-900`} style={{ height: fullscreen ? '100vh' : 'calc(100vh - 100px)', marginTop: fullscreen ? '40px' : '0' }}>
        <Canvas shadows gl={{ antialias: true }}>
          <Suspense fallback={
            <Html center>
              <div className="text-white text-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading 3D model...</p>
              </div>
            </Html>
          }>
            <color attach="background" args={['#111']} />

            {/* Lighting */}
            <ambientLight intensity={lightingPresets[lightingPreset].ambient} />
            <directionalLight position={[10, 20, 10]} intensity={lightingPresets[lightingPreset].directional} castShadow shadow-mapSize={[2048, 2048]} />
            <pointLight position={[-10, 5, -5]} intensity={0.5} />
            <Environment preset={lightingPresets[lightingPreset].env} />

            <PresentationControls global={false} enabled={false}>
              {renderScene()}
            </PresentationControls>

            {/* Controls & Camera */}
            <CameraController view={cameraView} />

          </Suspense>
        </Canvas>

        {/* Control Panel */}
        {showControls && (
          <div className={`absolute ${fullscreen ? 'top-16 right-4' : 'top-4 right-4'} bg-black/80 text-white p-5 rounded-xl shadow-2xl z-50 max-w-sm backdrop-blur-md border border-gray-800 overflow-y-auto max-h-[85vh]`}>
            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
              <h3 className="font-bold text-lg text-primary-400">Studio Controls</h3>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Live</span>
            </div>

            {/* Room Dimensions Control */}
            <div className="mb-6 border-b border-gray-700 pb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">📏 Room Dimensions</label>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Width</span>
                    <span>{roomConfig.width}m</span>
                  </div>
                  <input
                    type="range" min="10" max="60" step="1"
                    value={roomConfig.width}
                    onChange={(e) => updateRoomConfig('width', e.target.value)}
                    className="w-full accent-primary-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Height</span>
                    <span>{roomConfig.height}m</span>
                  </div>
                  <input
                    type="range" min="8" max="25" step="1"
                    value={roomConfig.height}
                    onChange={(e) => updateRoomConfig('height', e.target.value)}
                    className="w-full accent-primary-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Length/Depth</span>
                    <span>{roomConfig.length}m</span>
                  </div>
                  <input
                    type="range" min="10" max="60" step="1"
                    value={roomConfig.length}
                    onChange={(e) => updateRoomConfig('length', e.target.value)}
                    className="w-full accent-primary-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Wall Thickness</span>
                    <span>{roomConfig.wallThickness.toFixed(1)}m</span>
                  </div>
                  <input
                    type="range" min="0.2" max="3" step="0.1"
                    value={roomConfig.wallThickness}
                    onChange={(e) => updateRoomConfig('wallThickness', e.target.value)}
                    className="w-full accent-primary-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Camera Views */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">📷 Camera Perspective</label>
              <div className="grid grid-cols-4 gap-2">
                {['iso', 'top', 'front', 'side'].map(view => (
                  <button
                    key={view}
                    onClick={() => setCameraView(view)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${cameraView === view ? 'bg-primary-600 text-white shadow-lg scale-105' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {view.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Color Picker */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">🎨 Wall Paint</label>
              <div className="grid grid-cols-4 gap-2">
                {wallColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setWallColor(color.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all shadow-lg ${wallColor === color.value ? 'border-primary-400 scale-110 ring-2 ring-primary-500/50' : 'border-gray-600'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Lighting Preset */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">💡 Ambiance</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(lightingPresets).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setLightingPreset(preset)}
                    className={`text-xs uppercase font-bold py-2 px-2 rounded-lg transition-all ${lightingPreset === preset ? 'bg-primary-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-4 border-t border-gray-700 pt-4 space-y-2 font-mono">
              <div className="flex items-center gap-2"><span className="text-primary-400">🖱️ Left</span> <span>Rotate View</span></div>
              <div className="flex items-center gap-2"><span className="text-primary-400">🖱️ Right</span> <span>Pan Camera</span></div>
              <div className="flex items-center gap-2"><span className="text-primary-400">🖱️ Scroll</span> <span>Zoom (1x - 100x)</span></div>
            </div>
          </div>
        )}

        {/* Show Controls Button (when hidden) */}
        {!showControls && (
          <button
            onClick={() => setShowControls(true)}
            className={`absolute ${fullscreen ? 'top-16 right-4' : 'top-4 right-4'} bg-gray-800 bg-opacity-90 text-white p-3 rounded-lg shadow-xl z-50 hover:bg-opacity-100 transition-all`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ModelViewer;
