import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, Grid, Environment, Html, 
  PerspectiveCamera, Sky, ContactShadows,
  useGLTF, PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { CanvasWrapper } from '../components/CanvasErrorBoundary';

// Room Component
function Room({ dimensions, wallColor, floorColor, ceilingColor }) {
  const [width, height, depth] = dimensions;
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={floorColor} roughness={0.8} />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={ceilingColor} roughness={0.9} />
      </mesh>
      
      {/* Walls */}
      {/* Back Wall */}
      <mesh position={[0, height / 2, -depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Front Wall (with opening) */}
      <mesh position={[0, height / 2, depth / 2]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={wallColor} transparent opacity={0.3} />
      </mesh>
      
      {/* Left Wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-width / 2, height / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      
      {/* Right Wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[width / 2, height / 2, 0]}>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
    </group>
  );
}

// Furniture Component
function Furniture({ type, position, scale, rotation, color, onSelect, isSelected }) {
  const meshRef = useRef();
  
  const getGeometry = () => {
    switch (type) {
      case 'sofa':
        return <boxGeometry args={[2, 0.8, 0.9]} />;
      case 'table':
        return <boxGeometry args={[1.2, 0.4, 0.8]} />;
      case 'chair':
        return <boxGeometry args={[0.6, 1, 0.6]} />;
      case 'bed':
        return <boxGeometry args={[2, 0.5, 1.8]} />;
      case 'cabinet':
        return <boxGeometry args={[1, 1.5, 0.5]} />;
      case 'lamp':
        return <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />;
      case 'tv':
        return <boxGeometry args={[1.5, 0.9, 0.1]} />;
      case 'plant':
        return <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      position={position}
      scale={scale}
      rotation={rotation}
    >
      {getGeometry()}
      <meshStandardMaterial
        color={color}
        metalness={type === 'tv' ? 0.8 : 0.2}
        roughness={type === 'tv' ? 0.1 : 0.6}
        emissive={isSelected ? '#444444' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

const InteriorDesignStudio = () => {
  // Room Settings
  const [roomDimensions, setRoomDimensions] = useState([8, 3, 6]); // width, height, depth
  const [wallColor, setWallColor] = useState('#ffffff');
  const [floorColor, setFloorColor] = useState('#8b7355');
  const [ceilingColor, setCeilingColor] = useState('#f5f5f5');
  
  // Furniture
  const [furniture, setFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  
  // Materials & Textures
  const [currentMaterial, setCurrentMaterial] = useState('standard');
  const [materialColor, setMaterialColor] = useState('#3b82f6');
  const [roughness, setRoughness] = useState(0.6);
  const [metalness, setMetalness] = useState(0.2);
  
  // Lighting
  const [lightingPreset, setLightingPreset] = useState('daylight');
  const [ambientIntensity, setAmbientIntensity] = useState(0.6);
  const [directionalIntensity, setDirectionalIntensity] = useState(1.0);
  const [showShadows, setShowShadows] = useState(true);
  
  // Camera
  const [cameraAngle, setCameraAngle] = useState('perspective');
  const [cameraPosition, setCameraPosition] = useState([5, 4, 5]);
  
  // Animation
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  
  // UI State
  const [activeTab, setActiveTab] = useState('room');
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);

  const furnitureTypes = [
    { type: 'sofa', label: '🛋️ Sofa', icon: '🛋️' },
    { type: 'table', label: '🪑 Table', icon: '🪑' },
    { type: 'chair', label: '💺 Chair', icon: '💺' },
    { type: 'bed', label: '🛏️ Bed', icon: '🛏️' },
    { type: 'cabinet', label: '🗄️ Cabinet', icon: '🗄️' },
    { type: 'lamp', label: '💡 Lamp', icon: '💡' },
    { type: 'tv', label: '📺 TV', icon: '📺' },
    { type: 'plant', label: '🌿 Plant', icon: '🌿' },
  ];

  const materialPresets = {
    standard: { roughness: 0.6, metalness: 0.2 },
    glossy: { roughness: 0.1, metalness: 0.1 },
    matte: { roughness: 0.9, metalness: 0.0 },
    metallic: { roughness: 0.2, metalness: 0.8 },
    wood: { roughness: 0.8, metalness: 0.0 },
    fabric: { roughness: 0.9, metalness: 0.0 },
  };

  const lightingPresets = {
    daylight: { ambient: 0.6, directional: 1.0, env: 'sunset' },
    evening: { ambient: 0.4, directional: 0.8, env: 'dawn' },
    night: { ambient: 0.2, directional: 0.5, env: 'night' },
    studio: { ambient: 0.7, directional: 1.2, env: 'studio' },
    warm: { ambient: 0.5, directional: 0.9, env: 'sunset' },
  };

  const colors = [
    '#ffffff', '#f5f5f5', '#e5e5e5', '#d3d3d3',
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#8b7355', '#654321',
    '#000000', '#333333', '#666666', '#999999'
  ];

  const addFurniture = (type) => {
    const newFurniture = {
      id: Date.now(),
      type,
      position: [0, 0.5, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: materialColor,
      material: currentMaterial,
    };
    setFurniture([...furniture, newFurniture]);
    setSelectedFurniture(newFurniture.id);
  };

  const updateFurniture = (id, updates) => {
    setFurniture(furniture.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const deleteFurniture = (id) => {
    setFurniture(furniture.filter(item => item.id !== id));
    if (selectedFurniture === id) {
      setSelectedFurniture(null);
    }
  };

  const duplicateFurniture = (id) => {
    const item = furniture.find(f => f.id === id);
    if (item) {
      const newItem = {
        ...item,
        id: Date.now(),
        position: [item.position[0] + 0.5, item.position[1], item.position[2]],
      };
      setFurniture([...furniture, newItem]);
      setSelectedFurniture(newItem.id);
    }
  };

  const exportDesign = () => {
    const design = {
      room: {
        dimensions: roomDimensions,
        wallColor,
        floorColor,
        ceilingColor,
      },
      furniture: furniture.map(f => ({
        type: f.type,
        position: f.position,
        scale: f.scale,
        rotation: f.rotation,
        color: f.color,
        material: f.material,
      })),
      lighting: {
        preset: lightingPreset,
        ambient: ambientIntensity,
        directional: directionalIntensity,
      },
      metadata: {
        createdAt: new Date().toISOString(),
        furnitureCount: furniture.length,
      },
    };

    const output = JSON.stringify(design, null, 2);
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interior-design-${Date.now()}.json`;
    link.click();
  };

  const captureScreenshot = () => {
    // Screenshot functionality
    alert('Screenshot feature: Right-click on canvas and save image, or use browser screenshot tool');
  };

  const startAnimation = () => {
    setIsAnimating(true);
    // Animation logic here
  };

  const stopAnimation = () => {
    setIsAnimating(false);
  };

  const selectedFurnitureData = furniture.find(f => f.id === selectedFurniture);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-gray-800 text-white py-2 px-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-primary-400 hover:text-primary-300">
              ← Home
            </Link>
            <h1 className="text-lg font-bold">🏠 Interior Design Studio</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={captureScreenshot}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              📸 Screenshot
            </button>
            <button
              onClick={isAnimating ? stopAnimation : startAnimation}
              className={`px-3 py-1 rounded text-sm ${
                isAnimating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isAnimating ? '⏹️ Stop' : '▶️ Animate'}
            </button>
            <button
              onClick={exportDesign}
              className="bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded text-sm"
            >
              💾 Export Design
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-800 text-white overflow-y-auto flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            {['room', 'furniture', 'materials', 'lighting', 'camera'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Room Tab */}
            {activeTab === 'room' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3">Room Settings</h3>
                
                <div>
                  <label className="block text-sm mb-2">Room Dimensions</label>
                  <div className="space-y-2">
                    {['Width', 'Height', 'Depth'].map((dim, idx) => (
                      <div key={dim}>
                        <label className="text-xs text-gray-400">{dim}</label>
                        <input
                          type="number"
                          value={roomDimensions[idx]}
                          onChange={(e) => {
                            const newDims = [...roomDimensions];
                            newDims[idx] = parseFloat(e.target.value) || 1;
                            setRoomDimensions(newDims);
                          }}
                          className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                          step="0.1"
                          min="1"
                          max="20"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Wall Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setWallColor(color)}
                        className={`w-10 h-10 rounded border-2 ${
                          wallColor === color ? 'border-white scale-110' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Floor Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFloorColor(color)}
                        className={`w-10 h-10 rounded border-2 ${
                          floorColor === color ? 'border-white scale-110' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Ceiling Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCeilingColor(color)}
                        className={`w-10 h-10 rounded border-2 ${
                          ceilingColor === color ? 'border-white scale-110' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Furniture Tab */}
            {activeTab === 'furniture' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3">Add Furniture</h3>
                <div className="grid grid-cols-2 gap-2">
                  {furnitureTypes.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => addFurniture(item.type)}
                      className="bg-gray-700 hover:bg-gray-600 p-3 rounded text-left"
                    >
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs">{item.label}</div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-semibold mb-2">Placed Furniture ({furniture.length})</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {furniture.map((item) => {
                      const itemInfo = furnitureTypes.find(f => f.type === item.type);
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedFurniture(item.id)}
                          className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                            selectedFurniture === item.id ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          <span className="text-sm">{itemInfo?.icon} {itemInfo?.label}</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateFurniture(item.id);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              📋
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteFurniture(item.id);
                              }}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Materials Tab */}
            {activeTab === 'materials' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3">Material Presets</h3>
                <div className="space-y-2">
                  {Object.keys(materialPresets).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setCurrentMaterial(preset);
                        const mat = materialPresets[preset];
                        setRoughness(mat.roughness);
                        setMetalness(mat.metalness);
                        if (selectedFurnitureData) {
                          updateFurniture(selectedFurniture, { material: preset });
                        }
                      }}
                      className={`w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-left ${
                        currentMaterial === preset ? 'border-2 border-primary-500' : ''
                      }`}
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm mb-2">Material Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          setMaterialColor(color);
                          if (selectedFurnitureData) {
                            updateFurniture(selectedFurniture, { color });
                          }
                        }}
                        className={`w-10 h-10 rounded border-2 ${
                          materialColor === color ? 'border-white scale-110' : 'border-gray-600'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Roughness: {roughness.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={roughness}
                    onChange={(e) => {
                      setRoughness(parseFloat(e.target.value));
                      if (selectedFurnitureData) {
                        updateFurniture(selectedFurniture, { roughness: parseFloat(e.target.value) });
                      }
                    }}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Metalness: {metalness.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={metalness}
                    onChange={(e) => {
                      setMetalness(parseFloat(e.target.value));
                      if (selectedFurnitureData) {
                        updateFurniture(selectedFurniture, { metalness: parseFloat(e.target.value) });
                      }
                    }}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Lighting Tab */}
            {activeTab === 'lighting' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3">Lighting Presets</h3>
                <div className="space-y-2">
                  {Object.keys(lightingPresets).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setLightingPreset(preset);
                        const light = lightingPresets[preset];
                        setAmbientIntensity(light.ambient);
                        setDirectionalIntensity(light.directional);
                      }}
                      className={`w-full bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded text-left ${
                        lightingPreset === preset ? 'border-2 border-primary-500' : ''
                      }`}
                    >
                      {preset.charAt(0).toUpperCase() + preset.slice(1)}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-sm mb-2">Ambient Intensity: {ambientIntensity.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={ambientIntensity}
                    onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Directional Intensity: {directionalIntensity.toFixed(2)}</label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={directionalIntensity}
                    onChange={(e) => setDirectionalIntensity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showShadows}
                    onChange={(e) => setShowShadows(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Enable Shadows</label>
                </div>
              </div>
            )}

            {/* Camera Tab */}
            {activeTab === 'camera' && (
              <div className="space-y-4">
                <h3 className="font-semibold mb-3">Camera Settings</h3>
                
                <div>
                  <label className="block text-sm mb-2">Camera Angle</label>
                  <select
                    value={cameraAngle}
                    onChange={(e) => setCameraAngle(e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded"
                  >
                    <option value="perspective">Perspective</option>
                    <option value="top">Top View</option>
                    <option value="front">Front View</option>
                    <option value="side">Side View</option>
                    <option value="isometric">Isometric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Camera Position</label>
                  <div className="space-y-2">
                    {['X', 'Y', 'Z'].map((axis, idx) => (
                      <div key={axis}>
                        <label className="text-xs text-gray-400">{axis}</label>
                        <input
                          type="number"
                          value={cameraPosition[idx].toFixed(2)}
                          onChange={(e) => {
                            const newPos = [...cameraPosition];
                            newPos[idx] = parseFloat(e.target.value) || 0;
                            setCameraPosition(newPos);
                          }}
                          className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Show Grid</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showAxes}
                    onChange={(e) => setShowAxes(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm">Show Axes</label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 relative min-w-0" style={{ minHeight: '100%' }}>
          <CanvasWrapper
            furniture={furniture}
            roomDimensions={roomDimensions}
            wallColor={wallColor}
            floorColor={floorColor}
          >
            <Canvas
              camera={{ position: cameraPosition, fov: 50 }}
              shadows={showShadows}
              style={{ width: '100%', height: '100%' }}
            >
            <ambientLight intensity={ambientIntensity} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={directionalIntensity}
              castShadow={showShadows}
            />
            <pointLight position={[-10, 5, -5]} intensity={0.3} />
            <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.4} />
            
            <Environment preset={lightingPresets[lightingPreset].env} />
            
            {showGrid && <Grid args={[20, 20]} cellColor="#4a4a4a" sectionColor="#6a6a6a" />}
            {showAxes && <axesHelper args={[5]} />}
            
            <Room
              dimensions={roomDimensions}
              wallColor={wallColor}
              floorColor={floorColor}
              ceilingColor={ceilingColor}
            />
            
            {furniture.map((item) => (
              <Furniture
                key={item.id}
                type={item.type}
                position={item.position}
                scale={item.scale}
                rotation={item.rotation}
                color={item.color}
                onSelect={() => setSelectedFurniture(item.id)}
                isSelected={selectedFurniture === item.id}
              />
            ))}
            
            {showShadows && <ContactShadows opacity={0.4} scale={10} blur={2} far={10} />}
            
            <OrbitControls enableDamping dampingFactor={0.05} />
            </Canvas>
          </CanvasWrapper>
        </div>

        {/* Right Sidebar - Properties */}
        {selectedFurnitureData && (
          <div className="w-80 bg-gray-800 text-white p-4 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Properties</h2>
              <button
                onClick={() => setSelectedFurniture(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-700 p-3 rounded">
                <p className="text-sm text-gray-400">Furniture Type</p>
                <p className="font-semibold capitalize">{selectedFurnitureData.type}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis, idx) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        value={selectedFurnitureData.position[idx].toFixed(2)}
                        onChange={(e) => {
                          const newPos = [...selectedFurnitureData.position];
                          newPos[idx] = parseFloat(e.target.value) || 0;
                          updateFurniture(selectedFurniture, { position: newPos });
                        }}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        step="0.1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis, idx) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        value={selectedFurnitureData.scale[idx].toFixed(2)}
                        onChange={(e) => {
                          const newScale = [...selectedFurnitureData.scale];
                          newScale[idx] = parseFloat(e.target.value) || 0.1;
                          updateFurniture(selectedFurniture, { scale: newScale });
                        }}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        step="0.1"
                        min="0.1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rotation (degrees)</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis, idx) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        value={(selectedFurnitureData.rotation[idx] * 180 / Math.PI).toFixed(1)}
                        onChange={(e) => {
                          const newRot = [...selectedFurnitureData.rotation];
                          newRot[idx] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                          updateFurniture(selectedFurniture, { rotation: newRot });
                        }}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        step="1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updateFurniture(selectedFurniture, { color })}
                      className={`w-10 h-10 rounded border-2 ${
                        selectedFurnitureData.color === color ? 'border-white scale-110' : 'border-gray-600'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteriorDesignStudio;

