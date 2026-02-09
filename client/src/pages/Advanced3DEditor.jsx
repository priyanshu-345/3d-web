import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera, Environment, Html, useGLTF, TransformControls, Sky, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// Advanced Mesh Editor Component with Gizmo Support
function EditableMesh({ geometry, position, scale, rotation, color, onSelect, isSelected, id, transformMode, onUpdate }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handleTransformEnd = () => {
    if (meshRef.current && onUpdate) {
      onUpdate({
        position: [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z],
        rotation: [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z],
        scale: [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z],
      });
    }
  };

  // Guard against invalid geometry
  if (!geometry) return null;

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        position={position}
        scale={scale}
        rotation={rotation}
        geometry={geometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.3}
          emissive={isSelected ? '#4a90e2' : hovered ? '#2a5080' : '#000000'}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.2 : 0}
          wireframe={false}
        />
      </mesh>
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode={transformMode}
          onMouseUp={handleTransformEnd}
        />
      )}
    </group>
  );
}

// Sample Models Loader with Transform Support
function SampleModel({ url, position, scale, rotation, onLoad, onSelect, isSelected, transformMode, onUpdate }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Only try to load if URL is valid
  const shouldLoad = url && url.length > 0;
  // Use a fallback or null if no URL
  const { scene } = useGLTF(shouldLoad ? url : 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb');

  useEffect(() => {
    if (onLoad && scene) onLoad(scene);
  }, [scene, onLoad]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
  }, [hovered]);

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect && onSelect();
  };

  const handleTransformEnd = () => {
    if (groupRef.current && onUpdate) {
      onUpdate({
        position: [groupRef.current.position.x, groupRef.current.position.y, groupRef.current.position.z],
        rotation: [groupRef.current.rotation.x, groupRef.current.rotation.y, groupRef.current.rotation.z],
        scale: [groupRef.current.scale.x, groupRef.current.scale.y, groupRef.current.scale.z],
      });
    }
  };

  if (!shouldLoad) return null;

  return (
    <group>
      <primitive
        ref={groupRef}
        object={scene}
        position={position}
        scale={scale}
        rotation={rotation || [0, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      />
      {/* Selection Box Visualizer (optional but good for feedback) */}
      {isSelected && (
        <mesh position={position} scale={scale} rotation={rotation || [0, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshBasicMaterial color="#4a90e2" wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {isSelected && groupRef.current && (
        <TransformControls
          object={groupRef.current}
          mode={transformMode}
          onMouseUp={handleTransformEnd}
        />
      )}
    </group>
  );
}

// Animated Background Grid
function AnimatedGrid() {
  const gridRef = useRef();

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={gridRef}>
      <Grid
        args={[30, 30]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#3a3a3a"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#5a5a5a"
        fadeDistance={50}
        fadeStrength={1}
        followCamera={false}
      />
    </group>
  );
}

const Advanced3DEditor = () => {
  const [objects, setObjects] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [transformMode, setTransformMode] = useState('translate');
  const [showPrimitives, setShowPrimitives] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const [mode, setMode] = useState('object');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [environmentPreset, setEnvironmentPreset] = useState('sunset');
  const [showStats, setShowStats] = useState(true);
  const [cameraPreset, setCameraPreset] = useState('perspective');
  const sceneRef = useRef();

  // Camera Presets
  const cameraPresets = {
    perspective: { position: [8, 6, 8], name: '🎥 Perspective' },
    top: { position: [0, 15, 0], name: '⬆️ Top View' },
    front: { position: [0, 5, 15], name: '👁️ Front View' },
    side: { position: [15, 5, 0], name: '↔️ Side View' },
    isometric: { position: [10, 10, 10], name: '📐 Isometric' },
    close: { position: [5, 3, 5], name: '🔍 Close Up' },
  };

  const [cameraPosition, setCameraPosition] = useState(cameraPresets.perspective.position);

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'White', value: '#ffffff' },
    { name: 'Black', value: '#1a1a1a' },
    { name: 'Gray', value: '#64748b' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Lime', value: '#84cc16' },
  ];

  const environmentPresets = [
    'sunset', 'dawn', 'night', 'warehouse', 'forest', 'apartment',
    'studio', 'city', 'park', 'lobby'
  ];

  const sampleModels = [];

  // Enhanced Primitives with Furniture
  const primitives = [
    // Basic Shapes
    { type: 'box', label: 'Box', icon: '📦', args: [1, 1, 1], category: 'Basic' },
    { type: 'sphere', label: 'Sphere', icon: '⚪', args: [0.5, 32, 32], category: 'Basic' },
    { type: 'cylinder', label: 'Cylinder', icon: '🪵', args: [0.5, 0.5, 1, 32], category: 'Basic' },
    { type: 'cone', label: 'Cone', icon: '🔺', args: [0.5, 1, 32], category: 'Basic' },
    { type: 'torus', label: 'Torus', icon: '🍩', args: [0.5, 0.2, 16, 32], category: 'Basic' },
    { type: 'plane', label: 'Plane', icon: '📄', args: [2, 2], category: 'Basic' },

    // Polyhedra
    { type: 'octahedron', label: 'Octahedron', icon: '💎', args: [0.5, 0], category: 'Poly' },
    { type: 'tetrahedron', label: 'Tetrahedron', icon: '🔺', args: [0.5, 0], category: 'Poly' },
    { type: 'dodecahedron', label: 'Dodecahedron', icon: '⚽', args: [0.5, 0], category: 'Poly' },
    { type: 'icosahedron', label: 'Icosahedron', icon: '⚽', args: [0.5, 0], category: 'Poly' },

    // Advanced Shapes
    { type: 'torusKnot', label: 'Torus Knot', icon: '🎀', args: [0.5, 0.15, 100, 16], category: 'Advanced' },
    { type: 'ring', label: 'Ring', icon: '⭕', args: [0.3, 0.7, 32], category: 'Advanced' },
    { type: 'capsule', label: 'Capsule', icon: '💊', args: [0.3, 1, 4, 8], category: 'Advanced' },

    // Furniture - Living Room
    { type: 'sofa', label: 'Sofa', icon: '🛋️', args: [2, 0.8, 0.9], category: 'Furniture' },
    { type: 'chair', label: 'Chair', icon: '💺', args: [0.6, 1, 0.6], category: 'Furniture' },
    { type: 'table', label: 'Table', icon: '🪑', args: [1.2, 0.4, 0.8], category: 'Furniture' },
    { type: 'tv', label: 'TV', icon: '📺', args: [1.5, 0.9, 0.1], category: 'Furniture' },
    { type: 'lamp', label: 'Lamp', icon: '💡', args: [0.1, 0.1, 1.5, 16], category: 'Furniture' },

    // Furniture - Bedroom
    { type: 'bed', label: 'Bed', icon: '🛏️', args: [2, 0.5, 1.8], category: 'Furniture' },
    { type: 'nightstand', label: 'Nightstand', icon: '🗄️', args: [0.5, 0.6, 0.4], category: 'Furniture' },
    { type: 'wardrobe', label: 'Wardrobe', icon: '🚪', args: [1.2, 2, 0.6], category: 'Furniture' },
    { type: 'dresser', label: 'Dresser', icon: '🗃️', args: [1, 1, 0.5], category: 'Furniture' },

    // Furniture - Office
    { type: 'desk', label: 'Desk', icon: '🖥️', args: [1.5, 0.75, 0.8], category: 'Furniture' },
    { type: 'officeChair', label: 'Office Chair', icon: '🪑', args: [0.6, 1.2, 0.6], category: 'Furniture' },
    { type: 'bookshelf', label: 'Bookshelf', icon: '📚', args: [1, 2, 0.3], category: 'Furniture' },
    { type: 'cabinet', label: 'Cabinet', icon: '🗄️', args: [1, 1.5, 0.5], category: 'Furniture' },

    // Furniture - Kitchen/Dining
    { type: 'diningTable', label: 'Dining Table', icon: '🍽️', args: [1.8, 0.75, 1], category: 'Furniture' },
    { type: 'counter', label: 'Counter', icon: '🔪', args: [2, 0.9, 0.6], category: 'Furniture' },
    { type: 'stool', label: 'Stool', icon: '🪑', args: [0.4, 0.8, 0.4], category: 'Furniture' },

    // Decor & Accessories
    { type: 'plant', label: 'Plant', icon: '🌿', args: [0.2, 0.2, 0.8, 16], category: 'Decor' },
    { type: 'vase', label: 'Vase', icon: '🏺', args: [0.15, 0.15, 0.5, 16], category: 'Decor' },
    { type: 'picture', label: 'Picture Frame', icon: '🖼️', args: [0.8, 0.6, 0.05], category: 'Decor' },
    { type: 'mirror', label: 'Mirror', icon: '🪞', args: [1, 1.5, 0.05], category: 'Decor' },
    { type: 'rug', label: 'Rug', icon: '🧶', args: [2, 0.02, 1.5], category: 'Decor' },

    // Architectural
    { type: 'wall', label: 'Wall', icon: '🧱', args: [3, 2.5, 0.2], category: 'Architecture' },
    { type: 'door', label: 'Door', icon: '🚪', args: [0.9, 2, 0.05], category: 'Architecture' },
    { type: 'window', label: 'Window', icon: '🪟', args: [1.2, 1.5, 0.1], category: 'Architecture' },
    { type: 'column', label: 'Column', icon: '🏛️', args: [0.3, 0.3, 2.5, 16], category: 'Architecture' },
    { type: 'stairs', label: 'Stairs', icon: '🪜', args: [1.2, 0.2, 2], category: 'Architecture' },
    { type: 'floor', label: 'Floor Plate', icon: '🔲', args: [4, 0.1, 4], category: 'Architecture' },

    // Extended Furniture - Kitchen
    { type: 'fridge', label: 'Fridge Double', icon: '❄️', args: [1.2, 2, 0.8], category: 'Kitchen' },
    { type: 'stove', label: 'Stove & Oven', icon: '🍳', args: [0.8, 1, 0.8], category: 'Kitchen' },
    { type: 'kitchenIsland', label: 'Kitchen Island', icon: '🏝️', args: [2.5, 1, 1.2], category: 'Kitchen' },
    { type: 'kitchenCabinet', label: 'Wall Cabinet', icon: '📦', args: [1, 0.8, 0.4], category: 'Kitchen' },
    { type: 'sink', label: 'Sink Unit', icon: '🚰', args: [1, 1, 0.8], category: 'Kitchen' },

    // Extended Furniture - Bathroom
    { type: 'bathtub', label: 'Bathtub', icon: '🛁', args: [2, 0.6, 1], category: 'Bathroom' },
    { type: 'toilet', label: 'Toilet', icon: '🚽', args: [0.5, 0.6, 0.7], category: 'Bathroom' },
    { type: 'shower', label: 'Shower Cabin', icon: '🚿', args: [1.2, 2.2, 1.2], category: 'Bathroom' },
    { type: 'vanity', label: 'Vanity Mirror', icon: '🪞', args: [1.2, 1, 0.1], category: 'Bathroom' },

    // Extended Furniture - Living & Bedroom
    { type: 'lSofa', label: 'L-Shape Sofa', icon: '🛋️', args: [2.5, 0.8, 2.5], category: 'Living Room' },
    { type: 'coffeeTable', label: 'Glass Table', icon: '☕', args: [1.2, 0.4, 1.2], category: 'Living Room' },
    { type: 'fireplace', label: 'Fireplace', icon: '🔥', args: [1.5, 1.2, 0.5], category: 'Living Room' },
    { type: 'kingBed', label: 'King Bed', icon: '🛏️', args: [2.2, 0.6, 2.2], category: 'Bedroom' },
    { type: 'beanBag', label: 'Bean Bag', icon: '🛋️', args: [0.8, 0.8, 0.8], category: 'Living Room' },
  ];

  const addPrimitive = (type, args) => {
    // Check if the type should be a real 3D model instead of a primitive
    const modelMap = {
      // Furniture - Living Room
      'sofa': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa/model.gltf',
      'lSofa': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/sofa-corner/model.gltf', // Example URL
      'chair': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/chair/model.gltf',
      'table': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table/model.gltf',
      'coffeeTable': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/table-coffee/model.gltf',
      'tv': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/television/model.gltf',
      'lamp': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/lamp-round-floor/model.gltf',

      // Furniture - Bedroom
      'bed': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bed-single/model.gltf',
      'kingBed': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bed-double/model.gltf',
      'nightstand': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cabinet-bedside/model.gltf',
      'wardrobe': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cabinet-simple/model.gltf',
      'dresser': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cabinet-drawer/model.gltf',

      // Office
      'desk': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/desk/model.gltf',
      'officeChair': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/chair-office/model.gltf',
      'bookshelf': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bookcase-open/model.gltf',

      // Kitchen & Bath
      'fridge': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/kitchen-fridge/model.gltf',
      'stove': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/kitchen-stove/model.gltf',
      'sink': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/kitchen-sink/model.gltf',
      'toilet': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/toilet/model.gltf',
      'plant': 'https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/plant-small/model.gltf',
    };

    // If it's a furniture with a model URL, add it as a model
    if (modelMap[type]) {
      addSampleModel({
        name: type,
        url: modelMap[type],
        scale: [1, 1, 1]
      });
      return;
    }

    let geometry;
    switch (type) {
      case 'box':
        geometry = new THREE.BoxGeometry(...args);
        break;
      case 'sphere':
        geometry = new THREE.SphereGeometry(...args);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(...args);
        break;
      case 'cone':
        geometry = new THREE.ConeGeometry(...args);
        break;
      case 'torus':
        geometry = new THREE.TorusGeometry(...args);
        break;
      case 'plane':
        geometry = new THREE.PlaneGeometry(...args);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(...args);
        break;
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(...args);
        break;
      case 'dodecahedron':
        geometry = new THREE.DodecahedronGeometry(...args);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(...args);
        break;
      case 'torusKnot':
        geometry = new THREE.TorusKnotGeometry(...args);
        break;
      case 'ring':
        geometry = new THREE.RingGeometry(...args);
        break;
      case 'capsule':
        geometry = new THREE.CapsuleGeometry(...args);
        break;
      // For any other fallbacks (like structural elements), use box
      default:
        geometry = new THREE.BoxGeometry(...(args.length ? args : [1, 1, 1]));
    }

    const newObject = {
      id: Date.now(),
      type: 'primitive',
      geometryType: type,
      geometry: geometry,
      position: [0, 0.5, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: currentColor,
      metalness: 0.4,
      roughness: 0.3,
    };
    setObjects([...objects, newObject]);
    setSelectedObject(newObject.id);
    setShowPrimitives(false);
  };

  const addSampleModel = async (model) => {
    try {
      const newObject = {
        id: Date.now(),
        type: 'model',
        modelUrl: model.url,
        modelName: model.name,
        position: [0, 0, 0],
        scale: model.scale || [1, 1, 1],
        rotation: [0, 0, 0],
        color: currentColor,
      };
      setObjects([...objects, newObject]);
      setSelectedObject(newObject.id);
      setShowSamples(false);
    } catch (error) {
      console.error('Error loading model:', error);
    }
  };

  const updateObject = (id, updates) => {
    setObjects(objects.map(obj =>
      obj.id === id ? { ...obj, ...updates } : obj
    ));
  };

  const deleteObject = (id) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedObject === id) {
      setSelectedObject(null);
    }
  };

  const duplicateObject = (id) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      const newObj = {
        ...obj,
        id: Date.now(),
        position: [obj.position[0] + 1, obj.position[1], obj.position[2]],
      };
      setObjects([...objects, newObj]);
      setSelectedObject(newObj.id);
    }
  };

  const extrude = (id) => {
    const obj = objects.find(o => o.id === id);
    if (obj && obj.geometry) {
      const newScale = obj.scale.map(s => s * 1.3);
      updateObject(id, { scale: newScale });
    }
  };

  const bevel = (id) => {
    const obj = objects.find(o => o.id === id);
    if (obj && obj.geometry) {
      const newScale = obj.scale.map(s => s * 0.9);
      updateObject(id, { scale: newScale, metalness: 0.8, roughness: 0.2 });
    }
  };

  const subdivide = (id) => {
    const obj = objects.find(o => o.id === id);
    if (obj && obj.geometryType === 'sphere') {
      const newGeometry = new THREE.SphereGeometry(0.5, 64, 64);
      updateObject(id, { geometry: newGeometry });
    }
  };

  const mirror = (id) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      const newObj = {
        ...obj,
        id: Date.now(),
        position: [-obj.position[0], obj.position[1], obj.position[2]],
      };
      setObjects([...objects, newObj]);
    }
  };

  const arrayModifier = (id, count = 3, offset = 2) => {
    const obj = objects.find(o => o.id === id);
    if (obj) {
      const newObjects = [];
      for (let i = 1; i < count; i++) {
        newObjects.push({
          ...obj,
          id: Date.now() + i,
          position: [obj.position[0] + (offset * i), obj.position[1], obj.position[2]],
        });
      }
      setObjects([...objects, ...newObjects]);
    }
  };

  const exportScene = () => {
    const sceneData = {
      objects: objects.map(obj => ({
        type: obj.type,
        geometryType: obj.geometryType,
        position: obj.position,
        scale: obj.scale,
        rotation: obj.rotation,
        color: obj.color,
        modelUrl: obj.modelUrl,
        metalness: obj.metalness,
        roughness: obj.roughness,
      })),
      metadata: {
        createdAt: new Date().toISOString(),
        objectCount: objects.length,
        environment: environmentPreset,
      },
    };

    const output = JSON.stringify(sceneData, null, 2);
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `3d-scene-${Date.now()}.json`;
    link.click();
  };



  const loadTwoStoryHouse = () => {
    if (confirm('This will clear the current scene. Build Extended 2-Story House?')) {
      const houseObjects = [];
      let idCounter = Date.now();
      const wallColor = '#ecf0f1';
      const floorColor = '#34495e';
      const woodFloorColor = '#d35400';
      const glassColor = '#a5c9ca';

      // ===========================
      // GROUND FLOOR (0 to 3.5m)
      // ===========================

      // Main Floor Plate (Huge: 16x12)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'floor', geometry: new THREE.BoxGeometry(16, 0.2, 12), position: [0, 0, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: woodFloorColor });

      // Exterior Walls (Ground)
      // Back
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(16, 3.5, 0.3), position: [0, 1.75, -6], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      // Front (Partial for door/window)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(5, 3.5, 0.3), position: [-5.5, 1.75, 6], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(5, 3.5, 0.3), position: [5.5, 1.75, 6], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      // Left
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(0.3, 3.5, 12), position: [-8, 1.75, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      // Right
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(0.3, 3.5, 12), position: [8, 1.75, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });

      // Main Entrance Door (Double)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'door', geometry: new THREE.BoxGeometry(3, 2.5, 0.2), position: [0, 1.25, 6], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#5d4037' });

      // Internal Partitions
      // Center Hallway Wall
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(0.2, 3.5, 8), position: [2, 1.75, -2], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      // Kitchen / Living Divider
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(6, 3.5, 0.2), position: [-5, 1.75, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });

      // --- Ground Floor Rooms ---

      // Living Room (Front Left)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'lSofa', geometry: new THREE.BoxGeometry(3, 0.8, 3), position: [-5, 0.4, 3], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#2c3e50' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'coffeeTable', geometry: new THREE.BoxGeometry(1.5, 0.4, 1), position: [-5, 0.4, 3], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#ecf0f1' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'tv', geometry: new THREE.BoxGeometry(2, 1.2, 0.1), position: [-2, 1.5, 3], scale: [1, 1, 1], rotation: [0, -Math.PI / 2, 0], color: 'black' });

      // Kitchen (Back Left)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'kitchenIsland', geometry: new THREE.BoxGeometry(3, 1, 1.5), position: [-5, 0.5, -3], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#bdc3c7' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'fridge', geometry: new THREE.BoxGeometry(1.2, 2.2, 1), position: [-7, 1.1, -5], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#95a5a6' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'stove', geometry: new THREE.BoxGeometry(1, 1, 1), position: [-5, 0.5, -5.5], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#2c3e50' });

      // Dining Area (Right Back)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'diningTable', geometry: new THREE.BoxGeometry(3, 1, 1.5), position: [5, 0.5, -3], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#8e44ad' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'stair', geometry: new THREE.BoxGeometry(2.5, 4, 4), position: [6, 2, 3], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#e67e22' }); // Grand Staircase

      // ===========================
      // SECOND FLOOR (3.5m to 7m)
      // ===========================

      // Floor Plate
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'floor', geometry: new THREE.BoxGeometry(16, 0.2, 12), position: [0, 3.6, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: floorColor });

      // Exterior Walls (2nd Floor)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(16, 3.5, 0.3), position: [0, 5.35, -6], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(0.3, 3.5, 12), position: [-8, 5.35, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(0.3, 3.5, 12), position: [8, 5.35, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });

      // Balcony Front Glass Wall
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'window', geometry: new THREE.BoxGeometry(16, 2.5, 0.1), position: [0, 5, 6], scale: [1, 1, 1], rotation: [0, 0, 0], color: glassColor });

      // Master Bedroom (Left Side)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'kingBed', geometry: new THREE.BoxGeometry(2.5, 0.8, 2.5), position: [-5, 4, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#3498db' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wardrobe', geometry: new THREE.BoxGeometry(2, 2.5, 0.8), position: [-7, 4.8, -5], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#5d4037' });

      // Bathroom (Back Right)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'wall', geometry: new THREE.BoxGeometry(0.2, 3.5, 6), position: [2, 5.35, -3], scale: [1, 1, 1], rotation: [0, 0, 0], color: wallColor });

      // No reliable bathtub model in standard set, keep primitive or use box
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'bathtub', geometry: new THREE.BoxGeometry(2, 0.8, 1.2), position: [6, 4, -4.5], scale: [1, 1, 1], rotation: [0, 0, 0], color: 'white' });
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'shower', geometry: new THREE.BoxGeometry(1.2, 2.5, 1.2), position: [4, 4.8, -4.5], scale: [1, 1, 1], rotation: [0, 0, 0], color: glassColor });

      // Office / Study Area (Front Right)
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'desk', geometry: new THREE.BoxGeometry(2, 0.8, 1), position: [5, 4, 4], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#2c3e50' });

      // Ceiling
      houseObjects.push({ id: idCounter++, type: 'primitive', geometryType: 'floor', geometry: new THREE.BoxGeometry(18, 0.2, 14), position: [0, 7.2, 0], scale: [1, 1, 1], rotation: [0, 0, 0], color: '#7f8c8d' });

      setObjects(houseObjects);
      setSelectedObject(null);
      setCameraPosition([25, 20, 25]); // Zoom out for big house
    }
  };

  const clearScene = () => {
    if (confirm('Clear entire scene?')) {
      setObjects([]);
      setSelectedObject(null);
    }
  };

  const selectedObjectData = objects.find(o => o.id === selectedObject);

  const groupedPrimitives = primitives.reduce((acc, prim) => {
    if (!acc[prim.category]) acc[prim.category] = [];
    acc[prim.category].push(prim);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Compact Top Toolbar */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-2 px-4 border-b border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/gallery" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back
            </Link>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🎨 Advanced 3D Editor
            </h1>
            {showStats && (
              <div className="flex items-center space-x-4 text-xs ml-4">
                <span className="text-blue-400">{objects.length} Objects</span>
                <span className="text-green-400">{selectedObject ? 'Selected' : 'None'}</span>
                <span className="text-purple-400">{mode}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadTwoStoryHouse}
              className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-xs font-bold animate-pulse"
            >
              🏠 Build 2-Floor House
            </button>

            <div className="flex items-center space-x-1 bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setMode('object')}
                className={`px-3 py-1 rounded text-xs transition-all ${mode === 'object' ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
              >
                🎯 Object
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`px-3 py-1 rounded text-xs transition-all ${mode === 'edit' ? 'bg-green-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => setMode('sculpt')}
                className={`px-3 py-1 rounded text-xs transition-all ${mode === 'sculpt' ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
                  }`}
              >
                🎨 Sculpt
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-gray-900 rounded-lg p-1">
              <button
                onClick={() => setTransformMode('translate')}
                className={`px-2 py-1 rounded text-xs ${transformMode === 'translate' ? 'bg-blue-600' : 'bg-gray-800'}`}
                title="Move (G)"
              >
                ↔️
              </button>
              <button
                onClick={() => setTransformMode('rotate')}
                className={`px-2 py-1 rounded text-xs ${transformMode === 'rotate' ? 'bg-blue-600' : 'bg-gray-800'}`}
                title="Rotate (R)"
              >
                🔄
              </button>
              <button
                onClick={() => setTransformMode('scale')}
                className={`px-2 py-1 rounded text-xs ${transformMode === 'scale' ? 'bg-blue-600' : 'bg-gray-800'}`}
                title="Scale (S)"
              >
                ⚖️
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-gray-900 rounded-lg p-1">
              <select
                value={cameraPreset}
                onChange={(e) => {
                  setCameraPreset(e.target.value);
                  setCameraPosition(cameraPresets[e.target.value].position);
                }}
                className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
              >
                {Object.entries(cameraPresets).map(([key, preset]) => (
                  <option key={key} value={key}>{preset.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={clearScene}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
            >
              🗑️
            </button>
            <button
              onClick={exportScene}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
            >
              💾 Export
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Compact Left Sidebar */}
        <div className="w-56 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-3 overflow-y-auto border-r border-gray-700 shadow-2xl">
          <h2 className="text-sm font-bold mb-3 text-blue-400">🛠️ Tools</h2>

          <button
            onClick={() => setShowPrimitives(!showPrimitives)}
            className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg mb-2 text-sm"
          >
            ➕ Primitives {showPrimitives ? '▼' : '▶'}
          </button>
          {showPrimitives && (
            <div className="bg-gray-900 rounded-lg p-2 space-y-2 mb-3 max-h-64 overflow-y-auto">
              {Object.entries(groupedPrimitives).map(([category, prims]) => (
                <div key={category}>
                  <div className="text-xs text-gray-400 mb-1">{category}</div>
                  <div className="grid grid-cols-2 gap-1">
                    {prims.map((prim) => (
                      <button
                        key={prim.type}
                        onClick={() => addPrimitive(prim.type, prim.args)}
                        className="bg-gray-800 hover:bg-gray-700 px-2 py-2 rounded text-xs flex flex-col items-center"
                      >
                        <span className="text-lg">{prim.icon}</span>
                        <span className="text-xs">{prim.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowSamples(!showSamples)}
            className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg mb-2 text-sm"
          >
            📦 Models {showSamples ? '▼' : '▶'}
          </button>
          {showSamples && (
            <div className="bg-gray-900 rounded-lg p-2 space-y-1 mb-3">
              {sampleModels.map((model, idx) => (
                <button
                  key={idx}
                  onClick={() => addSampleModel(model)}
                  className="w-full bg-gray-800 hover:bg-gray-700 px-2 py-2 rounded text-xs text-left"
                >
                  {model.name}
                </button>
              ))}
            </div>
          )}

          {selectedObjectData && (
            <div className="mb-3 border-t border-gray-700 pt-3">
              <h3 className="text-xs font-bold mb-2 text-purple-400">⚡ Modifiers</h3>
              <div className="grid grid-cols-2 gap-1">
                <button onClick={() => extrude(selectedObject)} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs">
                  📏 Extrude
                </button>
                <button onClick={() => bevel(selectedObject)} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs">
                  ✨ Bevel
                </button>
                <button onClick={() => subdivide(selectedObject)} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs">
                  🔲 Subdivide
                </button>
                <button onClick={() => mirror(selectedObject)} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs">
                  🪞 Mirror
                </button>
                <button onClick={() => duplicateObject(selectedObject)} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs">
                  📋 Duplicate
                </button>
                <button onClick={() => arrayModifier(selectedObject, 3, 2)} className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs">
                  🔢 Array
                </button>
              </div>
            </div>
          )}

          <div className="mb-3 border-t border-gray-700 pt-3">
            <label className="block text-xs font-bold mb-2 text-yellow-400">🎨 Colors</label>
            <div className="grid grid-cols-4 gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setCurrentColor(color.value);
                    if (selectedObjectData) {
                      updateObject(selectedObject, { color: color.value });
                    }
                  }}
                  className={`w-full h-8 rounded border-2 ${currentColor === color.value ? 'border-white' : 'border-gray-600'
                    }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold mb-2 text-green-400">📋 Objects ({objects.length})</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {objects.map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => setSelectedObject(obj.id)}
                  className={`p-2 rounded cursor-pointer flex items-center justify-between text-xs ${selectedObject === obj.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                >
                  <span className="flex items-center space-x-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: obj.color }}></span>
                    <span>{obj.modelName || obj.geometryType || 'Object'}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteObject(obj.id);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Large 3D Canvas */}
        <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-black">
          <Canvas
            ref={sceneRef}
            camera={{ position: [8, 6, 8], fov: 50 }}
            shadows
            gl={{ antialias: true, alpha: false }}
          >
            <color attach="background" args={['#0a0a0a']} />

            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, 5, -5]} intensity={0.5} />
            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={0.5} castShadow />

            {showGrid && <AnimatedGrid />}
            {showAxes && <axesHelper args={[5]} />}

            <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={30} blur={2} far={10} />

            <Suspense fallback={
              <Html center>
                <div className="text-white text-center bg-gray-900 p-6 rounded-lg">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="font-semibold">Loading...</p>
                </div>
              </Html>
            }>
              {objects.map((obj) => {
                if (obj.type === 'model') {
                  return (
                    <SampleModel
                      key={obj.id}
                      url={obj.modelUrl}
                      position={obj.position}
                      scale={obj.scale}
                      rotation={obj.rotation}
                      onSelect={() => setSelectedObject(obj.id)}
                      isSelected={selectedObject === obj.id}
                      transformMode={transformMode}
                      onUpdate={(updates) => updateObject(obj.id, updates)}
                    />
                  );
                } else {
                  return (
                    <EditableMesh
                      key={obj.id}
                      id={obj.id}
                      geometry={obj.geometry}
                      position={obj.position}
                      scale={obj.scale}
                      rotation={obj.rotation}
                      color={obj.color}
                      onSelect={() => setSelectedObject(obj.id)}
                      isSelected={selectedObject === obj.id}
                      transformMode={transformMode}
                      onUpdate={(updates) => updateObject(obj.id, updates)}
                    />
                  );
                }
              })}
            </Suspense>

            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minDistance={1}
              maxDistance={100}
              maxPolarAngle={Math.PI / 1.5}
              enablePan={true}
              panSpeed={0.8}
              rotateSpeed={0.8}
              zoomSpeed={1.2}
            />
            <Environment preset={environmentPreset} />
            <Sky sunPosition={[100, 20, 100]} />
          </Canvas>

          <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 rounded-lg p-2 border border-gray-700 text-xs text-white shadow-lg">
            <div className="font-bold mb-1 text-blue-400">🎮 Controls</div>
            <div>🖱️ Left: Rotate</div>
            <div>🖱️ Right: Pan</div>
            <div>🖱️ Scroll: Zoom (1-100)</div>
            <div className="mt-1 text-green-400">📷 {cameraPresets[cameraPreset].name}</div>
          </div>
        </div>

        {/* Compact Right Sidebar - Properties */}
        {selectedObjectData && (
          <div className="w-56 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-3 overflow-y-auto border-l border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-purple-400">⚙️ Properties</h2>
              <button onClick={() => setSelectedObject(null)} className="text-gray-400 hover:text-white">×</button>
            </div>

            <div className="bg-gray-900 rounded-lg p-2 mb-3">
              <div className="text-xs text-gray-400">Type</div>
              <div className="text-sm font-semibold text-blue-400">
                {selectedObjectData.modelName || selectedObjectData.geometryType}
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-3 mb-3">
              <h3 className="text-xs font-bold mb-2 text-green-400">📐 Transform</h3>

              <div className="mb-2">
                <label className="block text-xs text-gray-400 mb-1">Position</label>
                <div className="grid grid-cols-3 gap-1">
                  {['X', 'Y', 'Z'].map((axis, idx) => (
                    <input
                      key={axis}
                      type="number"
                      value={selectedObjectData.position[idx].toFixed(2)}
                      onChange={(e) => {
                        const newPos = [...selectedObjectData.position];
                        newPos[idx] = parseFloat(e.target.value) || 0;
                        updateObject(selectedObject, { position: newPos });
                      }}
                      className="w-full bg-gray-800 text-white px-1 py-1 rounded text-xs"
                      step="0.1"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-2">
                <label className="block text-xs text-gray-400 mb-1">Scale</label>
                <div className="grid grid-cols-3 gap-1">
                  {['X', 'Y', 'Z'].map((axis, idx) => (
                    <input
                      key={axis}
                      type="number"
                      value={selectedObjectData.scale[idx].toFixed(2)}
                      onChange={(e) => {
                        const newScale = [...selectedObjectData.scale];
                        newScale[idx] = parseFloat(e.target.value) || 0.1;
                        updateObject(selectedObject, { scale: newScale });
                      }}
                      className="w-full bg-gray-800 text-white px-1 py-1 rounded text-xs"
                      step="0.1"
                      min="0.1"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Rotation (°)</label>
                <div className="grid grid-cols-3 gap-1">
                  {['X', 'Y', 'Z'].map((axis, idx) => (
                    <input
                      key={axis}
                      type="number"
                      value={(selectedObjectData.rotation[idx] * 180 / Math.PI).toFixed(1)}
                      onChange={(e) => {
                        const newRot = [...selectedObjectData.rotation];
                        newRot[idx] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                        updateObject(selectedObject, { rotation: newRot });
                      }}
                      className="w-full bg-gray-800 text-white px-1 py-1 rounded text-xs"
                      step="1"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-3 mb-3">
              <h3 className="text-xs font-bold mb-2 text-purple-400">✨ Material</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Metalness</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedObjectData.metalness || 0.4}
                    onChange={(e) => updateObject(selectedObject, { metalness: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Roughness</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedObjectData.roughness || 0.3}
                    onChange={(e) => updateObject(selectedObject, { roughness: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => duplicateObject(selectedObject)}
                className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-xs"
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => deleteObject(selectedObject)}
                className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded text-xs"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Advanced3DEditor;
