import { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// Basic Shape Component
function Shape({ type, position, scale, color, rotation, onSelect, isSelected }) {
  const meshRef = useRef();
  
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const getGeometry = () => {
    switch (type) {
      case 'box':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case 'cylinder':
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case 'plane':
        return <planeGeometry args={[2, 2]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh 
      ref={meshRef}
      onClick={handleClick} 
      position={position} 
      scale={scale} 
      rotation={rotation}
    >
      {getGeometry()}
      <meshStandardMaterial 
        color={color} 
        emissive={isSelected ? '#444444' : '#000000'}
        emissiveIntensity={isSelected ? 0.2 : 0}
      />
    </mesh>
  );
}

const DesignEditor = () => {
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showProperties, setShowProperties] = useState(false);
  const [currentColor, setCurrentColor] = useState('#3b82f6');
  const sceneRef = useRef();

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#ffffff', '#000000',
    '#64748b', '#f97316', '#06b6d4', '#84cc16'
  ];

  const addShape = (type) => {
    const newShape = {
      id: Date.now(),
      type,
      position: [0, 0, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0],
      color: currentColor,
    };
    setShapes([...shapes, newShape]);
    setSelectedShape(newShape.id);
    setShowAddMenu(false);
    setShowProperties(true);
  };

  const updateShape = (id, updates) => {
    setShapes(shapes.map(shape => 
      shape.id === id ? { ...shape, ...updates } : shape
    ));
  };

  const deleteShape = (id) => {
    setShapes(shapes.filter(shape => shape.id !== id));
    if (selectedShape === id) {
      setSelectedShape(null);
      setShowProperties(false);
    }
  };

  const exportModel = async () => {
    try {
      // Create a simple scene representation
      const sceneData = {
        shapes: shapes.map(shape => ({
          type: shape.type,
          position: shape.position,
          scale: shape.scale,
          rotation: shape.rotation,
          color: shape.color,
        })),
      };

      const output = JSON.stringify(sceneData, null, 2);
      const blob = new Blob([output], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'design.json';
      link.click();
      alert('Design saved! Note: This is a JSON file. For full 3D model export, use Blender desktop app to create .glb files.');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting design. Please try again.');
    }
  };

  const selectedShapeData = shapes.find(s => s.id === selectedShape);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/gallery" className="text-primary-400 hover:text-primary-300 flex items-center mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Gallery
            </Link>
            <h1 className="text-2xl font-bold">3D Design Editor</h1>
            <p className="text-sm text-gray-400">Create your own 3D interior designs</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={exportModel}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              Export Model
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar - Tools */}
        <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Tools</h2>
          
          {/* Add Shapes */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="w-full bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg mb-2 transition-colors"
            >
              + Add Shape
            </button>
            
            {showAddMenu && (
              <div className="bg-gray-700 rounded-lg p-2 space-y-2">
                <button onClick={() => addShape('box')} className="w-full bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left">
                  📦 Cube
                </button>
                <button onClick={() => addShape('sphere')} className="w-full bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left">
                  ⚪ Sphere
                </button>
                <button onClick={() => addShape('cylinder')} className="w-full bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left">
                  🪵 Cylinder
                </button>
                <button onClick={() => addShape('plane')} className="w-full bg-gray-600 hover:bg-gray-500 px-3 py-2 rounded text-left">
                  📄 Plane (Floor/Wall)
                </button>
              </div>
            )}
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Color</label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setCurrentColor(color);
                    if (selectedShapeData) {
                      updateShape(selectedShape, { color });
                    }
                  }}
                  className={`w-10 h-10 rounded border-2 transition-all ${
                    currentColor === color ? 'border-white scale-110' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Shapes List */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Objects ({shapes.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {shapes.map((shape) => (
                <div
                  key={shape.id}
                  onClick={() => {
                    setSelectedShape(shape.id);
                    setShowProperties(true);
                  }}
                  className={`p-2 rounded cursor-pointer flex items-center justify-between ${
                    selectedShape === shape.id ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  <span className="text-sm capitalize">{shape.type}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteShape(shape.id);
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

        {/* 3D Canvas */}
        <div className="flex-1 relative">
          <Canvas ref={sceneRef} camera={{ position: [5, 5, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />
            
            <Grid args={[10, 10]} cellColor="#6f6f6f" sectionColor="#9d4b4b" />
            <axesHelper args={[5]} />
            
            {shapes.map((shape) => (
              <Shape
                key={shape.id}
                type={shape.type}
                position={shape.position}
                scale={shape.scale}
                rotation={shape.rotation}
                color={shape.color}
                onSelect={() => {
                  setSelectedShape(shape.id);
                  setShowProperties(true);
                }}
                isSelected={selectedShape === shape.id}
              />
            ))}
            
            <OrbitControls />
          </Canvas>
        </div>

        {/* Properties Panel */}
        {showProperties && selectedShapeData && (
          <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Properties</h2>
              <button
                onClick={() => setShowProperties(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Position */}
              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        value={selectedShapeData.position[axis === 'x' ? 0 : axis === 'y' ? 1 : 2]}
                        onChange={(e) => {
                          const newPosition = [...selectedShapeData.position];
                          newPosition[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = parseFloat(e.target.value) || 0;
                          updateShape(selectedShape, { position: newPosition });
                        }}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        step="0.1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <label className="block text-sm font-medium mb-2">Scale</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        value={selectedShapeData.scale[axis === 'x' ? 0 : axis === 'y' ? 1 : 2]}
                        onChange={(e) => {
                          const newScale = [...selectedShapeData.scale];
                          newScale[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = parseFloat(e.target.value) || 1;
                          updateShape(selectedShape, { scale: newScale });
                        }}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        step="0.1"
                        min="0.1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rotation */}
              <div>
                <label className="block text-sm font-medium mb-2">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                  {['x', 'y', 'z'].map((axis) => (
                    <div key={axis}>
                      <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                      <input
                        type="number"
                        value={selectedShapeData.rotation[axis === 'x' ? 0 : axis === 'y' ? 1 : 2]}
                        onChange={(e) => {
                          const newRotation = [...selectedShapeData.rotation];
                          newRotation[axis === 'x' ? 0 : axis === 'y' ? 1 : 2] = parseFloat(e.target.value) || 0;
                          updateShape(selectedShape, { rotation: newRotation });
                        }}
                        className="w-full bg-gray-700 text-white px-2 py-1 rounded text-sm"
                        step="0.1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 text-white p-4 border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400">
            💡 <strong>Tips:</strong> Click "Add Shape" to add objects. Click on objects to select and edit properties. 
            Use mouse to rotate, zoom, and pan the view. Export your design when done!
          </p>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;

