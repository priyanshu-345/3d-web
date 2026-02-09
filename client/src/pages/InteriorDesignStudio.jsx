import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
  OrbitControls, Grid, Environment, Sky, TransformControls, useGLTF
} from '@react-three/drei';
import * as THREE from 'three';
import { Link, useLocation } from 'react-router-dom';
import { EditorProvider, useEditor } from '../components/studio/EditorContext';
import Toolbar from '../components/studio/Toolbar';

import BudgetCalculator from '../components/studio/BudgetCalculator';

// --- Assets & Data ---
// --- Real GLTF Models ---
const GltfModel = ({ path, scale = 1, color }) => {
  const { scene } = useGLTF(path);
  const clonedScene = scene.clone();

  // Optional: Apply color override to materials if provided
  if (color) {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        // Clone material to avoid affecting other instances
        child.material = child.material.clone();
        child.material.color.set(color);
      }
    });
  }

  return <primitive object={clonedScene} scale={scale} />;
};

// Pre-load common models
useGLTF.preload('/models/sofa.glb');
useGLTF.preload('/models/table.glb');
useGLTF.preload('/models/flowers.glb');
useGLTF.preload('/models/duck.glb');

// --- Furniture Types Data ---
const furnitureTypes = [
  // Living Room
  { type: 'sofa', label: '🛋️ Modern Sofa', icon: '🛋️', category: 'living' },
  { type: 'armchair', label: '🪑 Armchair', icon: '🪑', category: 'living' },
  { type: 'coffeeTable', label: '☕ Coffee Table', icon: '☕', category: 'living' },
  { type: 'tvUnit', label: '📺 TV Unit', icon: '📺', category: 'living' },

  // Bedroom
  { type: 'bedKing', label: '🛏️ King Bed', icon: '🛏️', category: 'bedroom' },
  { type: 'bedSingle', label: '🛏️ Single Bed', icon: '🛏️', category: 'bedroom' },
  { type: 'wardrobe', label: '🚪 Wardrobe', icon: '🚪', category: 'bedroom' },
  { type: 'nightstand', label: '🗄️ Nightstand', icon: '🗄️', category: 'bedroom' },

  // Kitchen & Dining
  { type: 'diningTable', label: '🍽️ Dining Table', icon: '🍽️', category: 'kitchen' },
  { type: 'kitchenCabinet', label: '🗄️ Cabinet', icon: '🗄️', category: 'kitchen' },
  { type: 'fridge', label: '❄️ Fridge', icon: '❄️', category: 'kitchen' },
  { type: 'stove', label: '🍳 Stove', icon: '🍳', category: 'kitchen' },

  // Office
  { type: 'desk', label: '🖥️ Office Desk', icon: '🖥️', category: 'office' },
  { type: 'bookshelf', label: '📚 Bookshelf', icon: '📚', category: 'office' },
  { type: 'officeChair', label: '🪑 Office Chair', icon: '🪑', category: 'office' },

  // Decor & Misc
  { type: 'plant', label: '🌿 House Plant', icon: '🌿', category: 'decor' },
  { type: 'rug', label: '🧶 Area Rug', icon: '🧶', category: 'decor' },
  { type: 'lampFloor', label: '🛋️ Floor Lamp', icon: '💡', category: 'decor' },
  { type: 'duck', label: '🦆 Rubber Duck', icon: '🦆', category: 'decor', model: '/models/duck.glb' }
];

// --- 3D Components ---

const Wall = ({ start, end, thickness = 0.2, height = 3, color = '#ffffff', opacity = 1 }) => {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const length = startVec.distanceTo(endVec);
  const center = startVec.clone().add(endVec).multiplyScalar(0.5);
  center.y = height / 2;
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh position={center} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color={color} roughness={0.8} transparent={opacity < 1} opacity={opacity} />
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(length, height, thickness)]} />
        <lineBasicMaterial color="#cccccc" />
      </lineSegments>
    </mesh>
  );
};

// --- Procedural Fallback Models ---

const Materials = {
  wood: <meshStandardMaterial color="#8b5a2b" roughness={0.6} />,
  fabric: <meshStandardMaterial color="#6366f1" roughness={0.9} />,
  metal: <meshStandardMaterial color="#4a4a4a" metalness={0.8} roughness={0.2} />,
  white: <meshStandardMaterial color="#ffffff" roughness={0.5} />,
  screen: <meshStandardMaterial color="#000000" roughness={0.2} metalness={0.9} />
};

const SofaModel = ({ color = '#6366f1' }) => (
  <group>
    {/* Base/Seat */}
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[2.2, 0.5, 0.9]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    {/* Backrest */}
    <mesh position={[0, 0.75, -0.35]}>
      <boxGeometry args={[2.2, 0.5, 0.2]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    {/* Armrests */}
    <mesh position={[-1, 0.5, 0.1]}>
      <boxGeometry args={[0.2, 0.6, 0.7]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    <mesh position={[1, 0.5, 0.1]}>
      <boxGeometry args={[0.2, 0.6, 0.7]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
    {/* Feet */}
    <mesh position={[-1, 0, -0.4]}><cylinderGeometry args={[0.05, 0.03, 0.2]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[1, 0, -0.4]}><cylinderGeometry args={[0.05, 0.03, 0.2]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[-1, 0, 0.4]}><cylinderGeometry args={[0.05, 0.03, 0.2]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[1, 0, 0.4]}><cylinderGeometry args={[0.05, 0.03, 0.2]} /><meshStandardMaterial color="#333" /></mesh>
  </group>
);

const TableModel = () => (
  <group>
    {/* Top */}
    <mesh position={[0, 0.75, 0]}>
      <boxGeometry args={[1.6, 0.05, 0.9]} />
      {Materials.wood}
    </mesh>
    {/* Legs */}
    <mesh position={[-0.7, 0.37, -0.4]}><boxGeometry args={[0.1, 0.75, 0.1]} />{Materials.wood}</mesh>
    <mesh position={[0.7, 0.37, -0.4]}><boxGeometry args={[0.1, 0.75, 0.1]} />{Materials.wood}</mesh>
    <mesh position={[-0.7, 0.37, 0.4]}><boxGeometry args={[0.1, 0.75, 0.1]} />{Materials.wood}</mesh>
    <mesh position={[0.7, 0.37, 0.4]}><boxGeometry args={[0.1, 0.75, 0.1]} />{Materials.wood}</mesh>
  </group>
);

const ChairModel = () => (
  <group>
    {/* Seat */}
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.5, 0.05, 0.5]} />
      {Materials.wood}
    </mesh>
    {/* Back */}
    <mesh position={[0, 0.95, -0.22]}>
      <boxGeometry args={[0.5, 1, 0.05]} />
      {Materials.wood}
    </mesh>
    {/* Legs */}
    <mesh position={[-0.2, 0.22, -0.2]}><cylinderGeometry args={[0.03, 0.03, 0.45]} />{Materials.metal}</mesh>
    <mesh position={[0.2, 0.22, -0.2]}><cylinderGeometry args={[0.03, 0.03, 0.45]} />{Materials.metal}</mesh>
    <mesh position={[-0.2, 0.22, 0.2]}><cylinderGeometry args={[0.03, 0.03, 0.45]} />{Materials.metal}</mesh>
    <mesh position={[0.2, 0.22, 0.2]}><cylinderGeometry args={[0.03, 0.03, 0.45]} />{Materials.metal}</mesh>
  </group>
);

const BedModel = () => (
  <group>
    {/* Mattress & Frame */}
    <mesh position={[0, 0.3, 0]}>
      <boxGeometry args={[1.8, 0.4, 2.2]} />
      {Materials.white}
    </mesh>
    {/* Headboard */}
    <mesh position={[0, 0.75, -1.05]}>
      <boxGeometry args={[1.9, 1.5, 0.1]} />
      <meshStandardMaterial color="#554433" />
    </mesh>
    {/* Pillows */}
    <mesh position={[-0.5, 0.55, -0.8]} rotation={[0.5, 0, 0]}>
      <boxGeometry args={[0.6, 0.3, 0.1]} />
      <meshStandardMaterial color="#eee" />
    </mesh>
    <mesh position={[0.5, 0.55, -0.8]} rotation={[0.5, 0, 0]}>
      <boxGeometry args={[0.6, 0.3, 0.1]} />
      <meshStandardMaterial color="#eee" />
    </mesh>
  </group>
);

const TVUnitModel = () => (
  <group>
    {/* Base Cabinet */}
    <mesh position={[0, 0.25, 0]}>
      <boxGeometry args={[2, 0.5, 0.5]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    {/* TV Screen */}
    <mesh position={[0, 0.85, 0]}>
      <boxGeometry args={[1.5, 0.9, 0.05]} />
      {Materials.screen}
    </mesh>
  </group>
);

const WardrobeModel = () => (
  <group>
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[1.2, 2.2, 0.6]} />
      {Materials.wood}
    </mesh>
    {/* Door Split */}
    <mesh position={[0, 1.1, 0.31]}>
      <boxGeometry args={[0.02, 2.2, 0.01]} />
      <meshStandardMaterial color="#000" />
    </mesh>
    {/* Handles */}
    <mesh position={[-0.1, 1.1, 0.32]}><sphereGeometry args={[0.05]} />{Materials.metal}</mesh>
    <mesh position={[0.1, 1.1, 0.32]}><sphereGeometry args={[0.05]} />{Materials.metal}</mesh>
  </group>
);
// ... (Previous models like SofaModel, TableModel kept as fallbacks or specific variations)

const KitchenCabinetModel = () => (
  <group>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.8, 0.9, 0.6]} />
      <meshStandardMaterial color="#ddd" roughness={0.2} />
    </mesh>
    <mesh position={[0, 0.45, 0.31]}>
      <boxGeometry args={[0.75, 0.85, 0.02]} />
      <meshStandardMaterial color="#fff" />
    </mesh>
    <mesh position={[0.25, 0.6, 0.33]}>
      <cylinderGeometry args={[0.01, 0.01, 0.1]} rotation={[0, 0, 1.57]} />
      <meshStandardMaterial color="#888" metalness={0.8} />
    </mesh>
  </group>
);

const FridgeModel = () => (
  <group>
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[0.9, 2.0, 0.8]} />
      <meshStandardMaterial color="#eef" metalness={0.3} roughness={0.1} />
    </mesh>
    <mesh position={[0, 1, 0.41]}>
      <boxGeometry args={[0.02, 1.8, 0.02]} />
      <meshStandardMaterial color="#ccc" />
    </mesh>
  </group>
);

const StoveModel = () => (
  <group>
    <mesh position={[0, 0.45, 0]}>
      <boxGeometry args={[0.76, 0.9, 0.7]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    <mesh position={[0, 0.91, 0]}>
      <boxGeometry args={[0.76, 0.02, 0.7]} />
      <meshStandardMaterial color="#111" roughness={0.2} />
    </mesh>
    {/* Burners */}
    <mesh position={[-0.2, 0.93, -0.2]} rotation={[1.57, 0, 0]}><circleGeometry args={[0.1]} /><meshBasicMaterial color="#555" /></mesh>
    <mesh position={[0.2, 0.93, 0.2]} rotation={[1.57, 0, 0]}><circleGeometry args={[0.1]} /><meshBasicMaterial color="#555" /></mesh>
  </group>
);

const LampFloorModel = () => (
  <group>
    <mesh position={[0, 0.05, 0]}><cylinderGeometry args={[0.15, 0.2, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.02, 0.02, 1.8]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.2, 0.4, 0.4]} openEnded /><meshStandardMaterial color="#fff" transparent opacity={0.8} side={THREE.DoubleSide} /></mesh>
    <pointLight position={[0, 1.6, 0]} intensity={1.5} distance={5} color="#ffaa00" />
  </group>
);

// Add Plant Model Procedural Fallback
const PlantModel = () => (
  <group>
    <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.15, 0.1, 0.4]} /><meshStandardMaterial color="#8b4513" /></mesh>
    <mesh position={[0, 0.6, 0]}><dodecahedronGeometry args={[0.4]} /><meshStandardMaterial color="green" /></mesh>
  </group>
);


const WindowModel = () => (
  <group>
    {/* Frame */}
    <mesh position={[0, 1.5, 0]}>
      <boxGeometry args={[1.6, 1.6, 0.1]} />
      <meshStandardMaterial color="#333" />
    </mesh>
    {/* Glass */}
    <mesh position={[0, 1.5, 0]}>
      <planeGeometry args={[1.4, 1.4]} />
      <meshStandardMaterial color="#88ccff" transparent opacity={0.4} side={THREE.DoubleSide} roughness={0} metalness={0.9} />
    </mesh>
    {/* Dividers */}
    <mesh position={[0, 1.5, 0]}><boxGeometry args={[1.4, 0.05, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
    <mesh position={[0, 1.5, 0]}><boxGeometry args={[0.05, 1.4, 0.1]} /><meshStandardMaterial color="#333" /></mesh>
  </group>
);

const DoorModel = () => (
  <group>
    {/* Frame */}
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[1.1, 2.25, 0.1]} />
      <meshStandardMaterial color="#4a3b2a" />
    </mesh>
    {/* Door Panel */}
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[0.9, 2.1, 0.12]} />
      <meshStandardMaterial color="#8b5a2b" />
    </mesh>
    {/* Handle */}
    <mesh position={[0.35, 1.1, 0.08]}>
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0.35, 1.1, -0.08]}>
      <sphereGeometry args={[0.05]} />
      <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
    </mesh>
  </group>
);


const FurnitureModel = ({ item, isSelected, onClick }) => {
  const getModel = () => {
    // If a GLB model exists in the mapping, use it (Only for items that explicitly have it like duck)
    const typeDef = furnitureTypes.find(t => t.type === item.type);
    if (typeDef && typeDef.model) {
      return <GltfModel path={typeDef.model} scale={item.scale} color={item.color !== '#cccccc' ? item.color : undefined} />;
    }

    // Otherwise fall back to procedural
    switch (item.type) {
      // Structure
      case 'window': return <WindowModel />;
      case 'door': return <DoorModel />;

      // Living
      case 'sofa': return <SofaModel color={item.color} />;
      case 'armchair': return <ChairModel />;
      case 'coffeeTable': return <TableModel />;
      case 'tvUnit': return <TVUnitModel />;

      // Bedroom
      case 'bedKing': return <BedModel />;
      case 'bedSingle': return <group scale={[0.6, 1, 1]}><BedModel /></group>;
      case 'wardrobe': return <WardrobeModel />;
      case 'nightstand': return <group scale={[0.6, 0.6, 0.6]}><mesh position={[0, 0.4, 0]}><boxGeometry /><meshStandardMaterial color={item.color || '#8b5a2b'} /></mesh></group>;

      // Kitchen
      case 'diningTable': return <TableModel />; // Reuse TableModel
      case 'kitchenCabinet': return <KitchenCabinetModel />;
      case 'fridge': return <FridgeModel />;
      case 'stove': return <StoveModel />;

      // Office
      case 'desk': return <TableModel />;
      case 'bookshelf': return <WardrobeModel />; // Reuse for now
      case 'officeChair': return <ChairModel />;

      // Decor
      case 'plant': return <PlantModel />;
      case 'rug': return <mesh rotation={[-1.57, 0, 0]} position={[0, 0.01, 0]}><planeGeometry args={[2, 3]} /><meshStandardMaterial color={item.color || '#aa4444'} roughness={1} /></mesh>;
      case 'lampFloor': return <LampFloorModel />;

      default: return (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      );
    }
  };

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      scale={item.scale}
      onClick={onClick}
      name={item.id.toString()}
    >
      <Suspense fallback={<mesh><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color="orange" wireframe /></mesh>}>
        {getModel()}
      </Suspense>
      {isSelected && <axesHelper args={[2]} />}
      {isSelected && (
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[0.1]} />
          <meshBasicMaterial color="#7fff00" wireframe />
        </mesh>
      )}
    </group>
  );
};

const EditorScene = () => {
  const {
    activeTool, walls, addWall, currentWall, setCurrentWall,
    snapToGrid, gridSize,
    furniture, selectedFurniture, setSelectedFurniture, updateFurniture, transformMode,
    lightIntensity = 0.5
  } = useEditor();

  const { scene } = useThree();
  const selectedObject = selectedFurniture ? scene.getObjectByName(selectedFurniture.toString()) : null;

  const snap = (val) => snapToGrid ? Math.round(val / gridSize) * gridSize : val;
  const getPoint = (e) => [snap(e.point.x), 0, snap(e.point.z)];

  const handlePointerDown = (e) => {
    if (activeTool === 'wall' && e.button === 0) {
      e.stopPropagation();
      const point = getPoint(e);
      if (!currentWall) setCurrentWall({ start: point, end: point });
      else {
        addWall(currentWall.start, point);
        setCurrentWall(null);
      }
    } else if (activeTool === 'select') {
      setSelectedFurniture(null);
    }
  };

  const handlePointerMove = (e) => {
    if (activeTool === 'wall' && currentWall) {
      const point = getPoint(e);
      if (point[0] !== currentWall.end[0] || point[2] !== currentWall.end[2]) {
        setCurrentWall({ ...currentWall, end: point });
      }
    }
  };

  const handleTransformEnd = () => {
    if (selectedObject && selectedFurniture) {
      updateFurniture(selectedFurniture, {
        position: [selectedObject.position.x, selectedObject.position.y, selectedObject.position.z],
        rotation: [selectedObject.rotation.x, selectedObject.rotation.y, selectedObject.rotation.z],
        scale: [selectedObject.scale.x, selectedObject.scale.y, selectedObject.scale.z],
      });
    }
  };

  return (
    <>
      <group onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
        {/* Floor & Grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#8b7355" roughness={0.8} />
        </mesh>
        <Grid args={[20, 20]} cellSize={1} cellThickness={1} cellColor="#ffffff" sectionSize={5} sectionThickness={1.5} sectionColor="#dddddd" fadeDistance={30} infiniteGrid={false} position={[0, 0.01, 0]} />

        {/* Lighting */}
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={lightIntensity} />
        <directionalLight position={[10, 20, 10]} intensity={lightIntensity * 2} castShadow />

        {/* Walls */}
        {walls.map(wall => <Wall key={wall.id} {...wall} />)}
        {currentWall && <Wall start={currentWall.start} end={currentWall.end} color="#6366f1" opacity={0.5} />}

        {/* Furniture */}
        {furniture.map(item => (
          <FurnitureModel
            key={item.id}
            item={item}
            isSelected={selectedFurniture === item.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFurniture(item.id);
            }}
          />
        ))}

        {/* Controls */}
        {selectedFurniture && selectedObject && (
          <TransformControls
            object={selectedObject}
            mode={transformMode}
            onMouseUp={handleTransformEnd}
          />
        )}

        {/* Toggleable World Axes */}
        {lightIntensity === 20 && <axesHelper args={[20]} />}
      </group>
      <OrbitControls
        makeDefault
        enabled={activeTool !== 'wall'}
        minDistance={2}
        maxDistance={25}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN
        }}
      />
    </>
  );
};

// --- Properties Panel ---
const PropertiesPanel = () => {
  const { selectedFurniture, furniture, updateFurniture } = useEditor();

  if (!selectedFurniture) return null;

  const item = furniture.find(f => f.id === selectedFurniture);
  if (!item) return null;

  const updateProp = (prop, axis, value) => {
    const newProp = [...item[prop]];
    newProp[axis] = parseFloat(value);
    updateFurniture(item.id, { [prop]: newProp });
  };

  const axisLabels = [
    { label: 'X', desc: 'Left/Right' },
    { label: 'Y', desc: 'Up/Down' },
    { label: 'Z', desc: 'Front/Back' }
  ];

  return (
    <div className="w-96 min-w-[24rem] bg-slate-900/60 backdrop-blur-md border-l border-white/10 flex flex-col z-20 shadow-xl overflow-y-auto transition-all duration-300 absolute right-0 top-14 bottom-0">
      <div className="p-4 border-b border-white/10 bg-slate-900/50">
        <h3 className="font-bold text-slate-200">Properties</h3>
        <span className="text-xs text-indigo-400 font-mono uppercase">{item.type}</span>
      </div>

      <div className="p-4 space-y-6">
        {/* Position Group */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>📍 Position</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {axisLabels.map((axis, i) => (
              <div key={axis.label} className="flex items-center space-x-3 bg-slate-800/50 p-2 rounded-lg border border-white/5">
                <div className="w-20">
                  <span className="text-indigo-400 font-bold">{axis.label}</span>
                  <span className="text-[10px] text-slate-500 block">{axis.desc}</span>
                </div>
                <input
                  type="number"
                  step={0.1}
                  value={item.position[i]}
                  onChange={(e) => updateProp('position', i, e.target.value)}
                  className="flex-1 bg-transparent border-none text-right text-sm text-white focus:ring-0 outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scale Group */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>📐 Size (Scale)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['W (Width)', 'H (Height)', 'D (Depth)'].map((axis, i) => (
              <div key={axis}>
                <label className="text-[10px] text-slate-400 block mb-1 text-center">{axis}</label>
                <input
                  type="number"
                  step={0.1}
                  value={item.scale[i]}
                  onChange={(e) => updateProp('scale', i, e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded p-1 text-sm text-center focus:border-indigo-500 outline-none text-white"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation Group */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span>🔄 Rotation</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['X', 'Y', 'Z'].map((axis, i) => (
              <div key={axis}>
                <label className="text-[10px] text-slate-400 block mb-1 text-center">{axis}</label>
                <input
                  type="number"
                  step={0.1}
                  value={item.rotation[i]}
                  onChange={(e) => updateProp('rotation', i, e.target.value)}
                  className="w-full bg-slate-800/50 border border-white/10 rounded p-1 text-sm text-center focus:border-indigo-500 outline-none text-white"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StudioContent = ({ budgetData }) => {
  const {
    activeTool, setActiveTool, addFurniture, selectedFurniture, deleteFurniture, setTransformMode,
    furniture, setFurniture, updateFurniture, walls, setWalls,
    gridSize, setGridSize, lightIntensity, setLightIntensity,
    roomDimensions, setRoomDimensions
  } = useEditor();
  const [activeTab, setActiveTab] = useState('structure');
  const [showExportMessage, setShowExportMessage] = useState(false);
  const location = useLocation();

  // Handle AI Auto-Creation Commands
  // Handle AI Auto-Creation Commands & Budget Data
  useEffect(() => {
    // Priority to Budget Data if available
    if (budgetData?.area) {
      const areaSqFt = parseFloat(budgetData.area);
      const totalAreaSqM = areaSqFt * 0.0929;

      // Calculate Aspect Ratio (approx 4:3 or golden ratio-ish)
      const width = Math.sqrt(totalAreaSqM * 1.3);
      const depth = totalAreaSqM / width;

      const w2 = width / 2;
      const d2 = depth / 2;

      // --- 1. Walls Generation (Outer Shell + Internal Partitions) ---
      const newWalls = [];
      const addW = (s, e, h = 3) => newWalls.push({ id: `w-${newWalls.length}`, start: s, end: e, thickness: 0.2, height: h, color: '#f0f0f0' });

      // Outer Perimeter
      addW([-w2, 0, -d2], [w2, 0, -d2]); // Back
      addW([-w2, 0, d2], [w2, 0, d2]);   // Front
      addW([-w2, 0, -d2], [-w2, 0, d2]); // Left
      addW([w2, 0, -d2], [w2, 0, d2]);   // Right

      // Internal Divider 1: Horizontal Split (Back Zone vs Front Zone)
      const midDepth = -d2 + (depth * 0.6); // 60% back, 40% front (Living)
      addW([-w2, 0, midDepth], [w2, 0, midDepth]);

      // Internal Divider 2: Vertical Split Back (Bed vs Kitchen)
      const midWidth = -w2 + (width * 0.5);
      addW([midWidth, 0, -d2], [midWidth, 0, midDepth]);

      // Internal Divider 3: Bathroom (Small corner in Bedroom)
      const bathW = width * 0.2;
      const bathD = depth * 0.25;
      addW([-w2 + bathW, 0, -d2], [-w2 + bathW, 0, -d2 + bathD]);
      addW([-w2, 0, -d2 + bathD], [-w2 + bathW, 0, -d2 + bathD]);

      // Internal Divider 4: Pooja Room (Small enclave in Hall/Living)
      // Placed in Front-Right (North-East usually preferred, but relative here)
      const poojaSize = Math.min(2, width * 0.15);
      addW([w2 - poojaSize, 0, midDepth], [w2 - poojaSize, 0, midDepth + poojaSize]); // Side
      addW([w2 - poojaSize, 0, midDepth + poojaSize], [w2, 0, midDepth + poojaSize]); // Front

      // --- 2. Furniture Placement ---
      const newFurniture = [];
      const addF = (type, pos, rot = [0, 0, 0], scale = [1, 1, 1]) => {
        newFurniture.push({ id: `f-${newFurniture.length}`, type, position: pos, rotation: rot, scale, color: '#ffffff' });
      };

      // Bedroom (Back Left) - Main Bed
      addF('bedKing', [-w2 + (width * 0.25), 0, -d2 + (depth * 0.3)], [0, 0, 0], [1.2, 1.2, 1.2]);
      addF('wardrobe', [-w2 + 0.5, 0, midDepth - 0.5], [0, 1.57, 0]); // Against partition

      // Bathroom (In corner)
      // (Simplified with just a door or fake item for now)
      addF('door', [-w2 + bathW, 0, -d2 + (bathD / 2)], [0, 1.57, 0]);

      // Kitchen & Dining (Back Right)
      addF('kitchenCabinet', [w2 - 0.5, 0, -d2 + 1], [0, -1.57, 0]); // Right wall
      addF('fridge', [w2 - 1, 0, -d2 + 0.5], [0, 0, 0]);
      addF('stove', [w2 - 2, 0, -d2 + 0.5], [0, 0, 0]);
      // Dining Table
      addF('diningTable', [midWidth + (width * 0.25), 0, -d2 + (depth * 0.4)], [0, 0, 0]);

      // Living Room & Hall (Front Area)
      // Sofa facing center
      addF('sofa', [-w2 + 1, 0, d2 - 2], [0, 1.57, 0]);
      addF('coffeeTable', [-w2 + 2.5, 0, d2 - 2], [0, 0, 0]);
      addF('tvUnit', [midWidth, 0, d2 - 2], [0, -1.57, 0]); // Center divider? No, place against virtual wall

      // Hall / Entrance Area
      addF('rug', [0, 0, d2 - 4], [0, 0, 0], [2, 2, 2]);

      // Pooja Room
      // Small platform or simplified
      addF('plant', [w2 - (poojaSize / 2), 0, midDepth + (poojaSize / 2)], [0, 0, 0], [0.5, 0.5, 0.5]);
      addF('lampFloor', [w2 - (poojaSize / 2), 0, midDepth + (poojaSize / 2)], [0, 0, 0]); // Lamp as Diya

      // Doors & Windows
      addF('door', [0, 0, d2], [0, 0, 0]); // Main Entrance
      addF('door', [midWidth, 0, midDepth], [0, 0, 0]); // Kitchen Entry
      addF('door', [-w2 + (width * 0.25), 0, midDepth], [0, 0, 0]); // Bedroom Entry

      const winY = 1.5;
      addF('window', [-w2, 1.5, -d2 + (depth * 0.3)], [0, 1.57, 0]); // Bed Window
      addF('window', [w2, 1.5, -d2 + (depth * 0.3)], [0, 1.57, 0]); // Kitchen Window
      addF('window', [0, 1.5, d2], [0, 0, 0]); // Front Window

      // Update State
      if (setWalls) setWalls(newWalls);
      if (setFurniture) setFurniture(newFurniture);

      // Adjust Camera/Grid
      if (setRoomDimensions) setRoomDimensions([width, 3, depth]);
      if (setGridSize) setGridSize(Math.max(1, Math.round(width / 10)));

    } else if (location.state?.autoCreate) {
      // Fallback to old simple auto-create
      const type = location.state.autoCreate;
      if (type === 'living-room') {
        // ... (Old logic irrelevant if budgetData is main flow)
        addFurniture({ id: Date.now(), type: 'sofa', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#6366f1' });
      }
      window.history.replaceState({}, document.title);
    }
  }, [budgetData, location.state]);

  const handleExport = () => {
    const project = {
      _id: `proj-${Date.now()}`,
      title: `My Dream Project ${new Date().toLocaleDateString()}`,
      description: 'Custom 3D Interior Design created in Studio.',
      category: 'living-room',
      thumbnailUrl: '',
      walls,
      furniture,
      createdAt: new Date().toISOString(),
      isCustom: true
    };
    const existing = JSON.parse(localStorage.getItem('savedProjects') || '[]');
    localStorage.setItem('savedProjects', JSON.stringify([project, ...existing]));
    setShowExportMessage(true);
    setTimeout(() => setShowExportMessage(false), 3000);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden relative">
      {showExportMessage && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce">
          ✅ Project Exported to Gallery!
        </div>
      )}

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-slate-900/60 backdrop-blur-md border-b border-white/10 z-30 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
            ←
          </Link>
          <h1 className="font-bold text-lg tracking-wide">Studio <span className="text-indigo-500">Pro</span></h1>
          {budgetData && (
            <div className="hidden md:flex flex-col ml-6 px-4 py-1 bg-slate-800/50 rounded-lg border border-white/5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Estimated Budget</span>
              <span className="text-sm font-bold text-emerald-400">₹ {(budgetData.area * (budgetData.style === 'luxury' ? 3500 : budgetData.style === 'premium' ? 2200 : 1200)).toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button onClick={() => setLightIntensity ? setLightIntensity(prev => prev === 0.5 ? 20 : 0.5) : null} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-sm font-medium transition-colors">
            {lightIntensity === 0.5 ? 'Show Axes' : 'Hide Axes'}
          </button>
          <button className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 rounded-md text-sm font-medium transition-colors">Save Project</button>
          <button onClick={handleExport} className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-md text-sm font-medium transition-colors">Export to Gallery</button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="w-80 mt-14 bg-slate-900/60 backdrop-blur-md border-r border-white/10 flex flex-col z-20 shadow-2xl">
        {/* Tabs */}
        <div className="flex text-xs font-medium border-b border-white/10 bg-transparent">
          {['structure', 'furniture', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 uppercase tracking-wider transition-colors ${activeTab === tab ? 'bg-white/10 text-indigo-400 border-b-2 border-indigo-400' : 'text-slate-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-600">
          {/* STRUCTURE TAB */}
          {activeTab === 'structure' && (
            <div className="space-y-4">
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase">Creation Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveTool('wall')}
                    className={`p-3 rounded-lg text-left flex flex-col items-center justify-center transition-all ${activeTool === 'wall' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    <span className="text-2xl mb-1">🧱</span>
                    <span className="text-xs font-bold">Draw Wall</span>
                  </button>
                  <button
                    onClick={() => setActiveTool('select')}
                    className={`p-3 rounded-lg text-left flex flex-col items-center justify-center transition-all ${activeTool === 'select' ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}
                  >
                    <span className="text-2xl mb-1">👆</span>
                    <span className="text-xs font-bold">Select/Edit</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase">Structure Items</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      addFurniture({ id: Date.now(), type: 'window', position: [0, 1.5, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#333' });
                      setActiveTool('select');
                    }}
                    className="p-3 rounded-lg text-left flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-2xl mb-1">🪟</span>
                    <span className="text-xs font-bold">Add Window</span>
                  </button>

                  <button
                    onClick={() => {
                      addFurniture({ id: Date.now(), type: 'door', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], color: '#554433' });
                      setActiveTool('select');
                    }}
                    className="p-3 rounded-lg text-left flex flex-col items-center justify-center bg-slate-700 hover:bg-slate-600 transition-all hover:-translate-y-0.5"
                  >
                    <span className="text-2xl mb-1">🚪</span>
                    <span className="text-xs font-bold">Add Door</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FURNITURE TAB */}
          {activeTab === 'furniture' && (
            <div className="space-y-6">
              {['living', 'bedroom', 'kitchen', 'dining', 'office', 'decor'].map(cat => (
                <div key={cat}>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 border-b border-white/10 pb-1">{cat}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {furnitureTypes.filter(f => f.category === cat).map(item => (
                      <button
                        key={item.type}
                        onClick={() => {
                          addFurniture({
                            id: Date.now(),
                            type: item.type,
                            position: [0, 0, 0],
                            rotation: [0, 0, 0],
                            scale: [1, 1, 1],
                            color: '#cccccc'
                          });
                          setActiveTool('select');
                        }}
                        className="flex flex-col items-center p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all hover:-translate-y-0.5 hover:shadow-lg group"
                      >
                        <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</span>
                        <span className="text-[10px] text-slate-300 font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Grid Size</label>
                <input
                  type="range" min="0.5" max="5" step="0.5"
                  value={gridSize} onChange={(e) => setGridSize(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-right text-xs text-slate-500">{gridSize}m</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Ambient Light</label>
                <input
                  type="range" min="0" max="2" step="0.1"
                  value={lightIntensity || 0.5} onChange={(e) => setLightIntensity?.(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative bg-gray-950">
        {/* Floating Toolbar */}
        <div className="absolute top-4 left-4 z-10">
          <Toolbar />
        </div>

        {/* Mode Indicator */}
        <div className="absolute top-4 left-20 right-4 z-10 flex justify-between items-start pointer-events-none">
          <div className="bg-slate-800/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700 shadow-lg">
            <span className="text-indigo-400 font-bold uppercase text-xs tracking-wider block">Current Mode</span>
            <span className="text-white font-bold">{activeTool === 'wall' ? 'DRAWING WALLS' : 'SELECT & EDIT'}</span>
          </div>
          <div className="flex space-x-2 pointer-events-auto">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold shadow-lg text-sm transition-colors">
              Export Project
            </button>
          </div>
        </div>

        {/* Selected Item Controls */}
        {selectedFurniture && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur px-6 py-3 rounded-2xl flex items-center space-x-4 border border-slate-700 shadow-2xl z-10 animate-fade-in">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Actions</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <div className="flex space-x-2">
              <button onClick={() => setTransformMode('translate')} className="p-2 hover:bg-slate-700 rounded-lg text-indigo-400 transition-colors" title="Move">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
              </button>
              <button onClick={() => setTransformMode('rotate')} className="p-2 hover:bg-slate-700 rounded-lg text-indigo-400 transition-colors" title="Rotate">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <button onClick={() => setTransformMode('scale')} className="p-2 hover:bg-slate-700 rounded-lg text-indigo-400 transition-colors" title="Scale">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
              </button>
            </div>
            <div className="h-4 w-px bg-slate-700"></div>
            <button onClick={() => deleteFurniture(selectedFurniture)} className="p-2 hover:bg-red-900/50 rounded-lg text-red-500 transition-colors" title="Delete">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        )}

        <Canvas shadows camera={{ position: [5, 8, 8], fov: 60 }} className="bg-gradient-to-br from-slate-900 to-slate-950">
          <Suspense fallback={null}>
            <EditorScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Right Properties Panel */}
      <PropertiesPanel />
    </div>
  );
}

const InteriorDesignStudio = () => {
  const [budgetData, setBudgetData] = useState(null);

  if (!budgetData) {
    return <BudgetCalculator onComplete={setBudgetData} />;
  }

  return (
    <EditorProvider>
      <StudioContent budgetData={budgetData} />
    </EditorProvider>
  );
};

export default InteriorDesignStudio;
