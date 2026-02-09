import { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Html, Sky, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';

// Complete House Component
function House({ position = [0, 0, 0], scale = 1, wallColor = '#f5f5dc', roofColor = '#8b4513', doorColor = '#654321', windowColor = '#87ceeb' }) {
    return (
        <group position={position} scale={scale}>
            {/* Foundation/Base */}
            <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
                <boxGeometry args={[12, 0.2, 10]} />
                <meshStandardMaterial color="#808080" roughness={0.9} />
            </mesh>

            {/* Ground Floor Walls */}
            {/* Front Wall with Door */}
            <group position={[0, 1.5, 5]}>
                {/* Left part of front wall */}
                <mesh position={[-3.5, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[5, 3, 0.3]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                {/* Right part of front wall */}
                <mesh position={[3.5, 0, 0]} castShadow receiveShadow>
                    <boxGeometry args={[5, 3, 0.3]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                {/* Top part above door */}
                <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[2, 0.5, 0.3]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>

                {/* Front Door */}
                <mesh position={[0, -0.5, 0.1]} castShadow>
                    <boxGeometry args={[1.8, 2.5, 0.1]} />
                    <meshStandardMaterial color={doorColor} roughness={0.5} metalness={0.2} />
                </mesh>
                {/* Door Handle */}
                <mesh position={[0.7, -0.5, 0.2]} castShadow>
                    <sphereGeometry args={[0.08, 16, 16]} />
                    <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
                </mesh>
            </group>

            {/* Back Wall */}
            <mesh position={[0, 1.5, -5]} castShadow receiveShadow>
                <boxGeometry args={[12, 3, 0.3]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Left Wall with Windows */}
            <group position={[-6, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[10, 3, 0.3]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                {/* Windows on left wall */}
                <mesh position={[-2, 0.5, 0.2]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 0.15]} />
                    <meshStandardMaterial color={windowColor} transparent opacity={0.6} metalness={0.5} roughness={0.1} />
                </mesh>
                <mesh position={[2, 0.5, 0.2]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 0.15]} />
                    <meshStandardMaterial color={windowColor} transparent opacity={0.6} metalness={0.5} roughness={0.1} />
                </mesh>
            </group>

            {/* Right Wall with Windows */}
            <group position={[6, 1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[10, 3, 0.3]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                {/* Windows on right wall */}
                <mesh position={[-2, 0.5, -0.2]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 0.15]} />
                    <meshStandardMaterial color={windowColor} transparent opacity={0.6} metalness={0.5} roughness={0.1} />
                </mesh>
                <mesh position={[2, 0.5, -0.2]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 0.15]} />
                    <meshStandardMaterial color={windowColor} transparent opacity={0.6} metalness={0.5} roughness={0.1} />
                </mesh>
            </group>

            {/* First Floor Ceiling / Second Floor Base */}
            <mesh position={[0, 3, 0]} castShadow receiveShadow>
                <boxGeometry args={[12, 0.3, 10]} />
                <meshStandardMaterial color="#d3d3d3" roughness={0.8} />
            </mesh>

            {/* Second Floor Walls */}
            {/* Front Wall Second Floor */}
            <group position={[0, 4.5, 5]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[12, 3, 0.3]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                {/* Windows */}
                <mesh position={[-3, 0, 0.2]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 0.15]} />
                    <meshStandardMaterial color={windowColor} transparent opacity={0.6} metalness={0.5} roughness={0.1} />
                </mesh>
                <mesh position={[3, 0, 0.2]} castShadow>
                    <boxGeometry args={[1.5, 1.2, 0.15]} />
                    <meshStandardMaterial color={windowColor} transparent opacity={0.6} metalness={0.5} roughness={0.1} />
                </mesh>
            </group>

            {/* Back Wall Second Floor */}
            <mesh position={[0, 4.5, -5]} castShadow receiveShadow>
                <boxGeometry args={[12, 3, 0.3]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Left Wall Second Floor */}
            <mesh position={[-6, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 3, 0.3]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Right Wall Second Floor */}
            <mesh position={[6, 4.5, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[10, 3, 0.3]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Roof - Gabled/Pitched Roof */}
            {/* Left Roof Slope */}
            <mesh position={[-3, 7, 0]} rotation={[0, 0, Math.PI / 6]} castShadow receiveShadow>
                <boxGeometry args={[7, 0.2, 10.5]} />
                <meshStandardMaterial color={roofColor} roughness={0.8} />
            </mesh>

            {/* Right Roof Slope */}
            <mesh position={[3, 7, 0]} rotation={[0, 0, -Math.PI / 6]} castShadow receiveShadow>
                <boxGeometry args={[7, 0.2, 10.5]} />
                <meshStandardMaterial color={roofColor} roughness={0.8} />
            </mesh>

            {/* Front Gable */}
            <mesh position={[0, 7.5, 5.2]} castShadow receiveShadow>
                <coneGeometry args={[6.5, 2, 3]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Back Gable */}
            <mesh position={[0, 7.5, -5.2]} castShadow receiveShadow>
                <coneGeometry args={[6.5, 2, 3]} />
                <meshStandardMaterial color={wallColor} roughness={0.7} />
            </mesh>

            {/* Chimney */}
            <group position={[4, 7, -2]}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[0.8, 2.5, 0.8]} />
                    <meshStandardMaterial color="#8b0000" roughness={0.9} />
                </mesh>
                {/* Chimney Top */}
                <mesh position={[0, 1.5, 0]} castShadow>
                    <boxGeometry args={[1, 0.3, 1]} />
                    <meshStandardMaterial color="#8b0000" roughness={0.9} />
                </mesh>
            </group>

            {/* Interior Walls - Ground Floor */}
            {/* Dividing wall creating rooms */}
            <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
                <boxGeometry args={[10, 3, 0.2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.7} />
            </mesh>

            {/* Vertical dividing wall */}
            <mesh position={[-2, 1.5, -2.5]} receiveShadow>
                <boxGeometry args={[8, 3, 0.2]} />
                <meshStandardMaterial color="#ffffff" roughness={0.7} />
            </mesh>

            {/* Stairs */}
            <group position={[4, 0.2, 0]}>
                {[...Array(12)].map((_, i) => (
                    <mesh key={i} position={[0, i * 0.25, i * 0.25]} castShadow receiveShadow>
                        <boxGeometry args={[1.5, 0.1, 0.3]} />
                        <meshStandardMaterial color="#a0522d" roughness={0.8} />
                    </mesh>
                ))}
            </group>

            {/* Front Porch */}
            <group position={[0, 0.3, 6.5]}>
                {/* Porch Floor */}
                <mesh receiveShadow>
                    <boxGeometry args={[8, 0.2, 2]} />
                    <meshStandardMaterial color="#d2b48c" roughness={0.8} />
                </mesh>
                {/* Porch Pillars */}
                <mesh position={[-3.5, 1.5, 0.8]} castShadow>
                    <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.6} />
                </mesh>
                <mesh position={[3.5, 1.5, 0.8]} castShadow>
                    <cylinderGeometry args={[0.2, 0.2, 3, 16]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.6} />
                </mesh>
                {/* Porch Roof */}
                <mesh position={[0, 3.2, 0]} castShadow>
                    <boxGeometry args={[8, 0.2, 2.5]} />
                    <meshStandardMaterial color={roofColor} roughness={0.8} />
                </mesh>
            </group>

            {/* Garage */}
            <group position={[-9, 0, 2]}>
                {/* Garage Walls */}
                <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 3, 6]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                <mesh position={[-3, 1.5, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 3, 6]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>
                <mesh position={[-1.5, 1.5, -3]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[0.3, 3, 6]} />
                    <meshStandardMaterial color={wallColor} roughness={0.7} />
                </mesh>

                {/* Garage Door */}
                <mesh position={[-1.5, 1.2, 3]} castShadow>
                    <boxGeometry args={[5.5, 2.8, 0.1]} />
                    <meshStandardMaterial color="#696969" roughness={0.5} metalness={0.3} />
                </mesh>

                {/* Garage Roof */}
                <mesh position={[-1.5, 3.2, 0]} castShadow receiveShadow>
                    <boxGeometry args={[6, 0.2, 6]} />
                    <meshStandardMaterial color={roofColor} roughness={0.8} />
                </mesh>
            </group>
        </group>
    );
}

// Ground/Terrain Component
function Terrain() {
    return (
        <group>
            {/* Main Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#2d5016" roughness={0.9} />
            </mesh>

            {/* Driveway */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9, 0, 10]} receiveShadow>
                <planeGeometry args={[6, 15]} />
                <meshStandardMaterial color="#404040" roughness={0.8} />
            </mesh>

            {/* Front Pathway */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 10]} receiveShadow>
                <planeGeometry args={[2, 8]} />
                <meshStandardMaterial color="#8b7355" roughness={0.8} />
            </mesh>

            {/* Garden/Lawn Details */}
            {/* Trees */}
            <group position={[15, 0, 10]}>
                {/* Tree Trunk */}
                <mesh position={[0, 2, 0]} castShadow>
                    <cylinderGeometry args={[0.5, 0.6, 4, 8]} />
                    <meshStandardMaterial color="#654321" roughness={0.9} />
                </mesh>
                {/* Tree Foliage */}
                <mesh position={[0, 5, 0]} castShadow>
                    <sphereGeometry args={[2.5, 8, 8]} />
                    <meshStandardMaterial color="#228b22" roughness={0.8} />
                </mesh>
            </group>

            <group position={[-15, 0, -10]}>
                <mesh position={[0, 2, 0]} castShadow>
                    <cylinderGeometry args={[0.5, 0.6, 4, 8]} />
                    <meshStandardMaterial color="#654321" roughness={0.9} />
                </mesh>
                <mesh position={[0, 5, 0]} castShadow>
                    <sphereGeometry args={[2.5, 8, 8]} />
                    <meshStandardMaterial color="#228b22" roughness={0.8} />
                </mesh>
            </group>

            {/* Bushes */}
            {[
                [8, 0, 8],
                [10, 0, 6],
                [-8, 0, 8],
                [-10, 0, 6],
            ].map((pos, i) => (
                <mesh key={i} position={pos} castShadow>
                    <sphereGeometry args={[1, 8, 8]} />
                    <meshStandardMaterial color="#2e8b57" roughness={0.9} />
                </mesh>
            ))}

            {/* Fence */}
            {[...Array(20)].map((_, i) => (
                <mesh key={i} position={[-20 + i * 2, 0.8, 20]} castShadow>
                    <boxGeometry args={[0.1, 1.6, 0.1]} />
                    <meshStandardMaterial color="#8b7355" roughness={0.8} />
                </mesh>
            ))}
            {[...Array(20)].map((_, i) => (
                <mesh key={`h${i}`} position={[-20 + i * 2, 1.2, 20]} castShadow>
                    <boxGeometry args={[2, 0.1, 0.1]} />
                    <meshStandardMaterial color="#8b7355" roughness={0.8} />
                </mesh>
            ))}
        </group>
    );
}

const HouseBuilder = () => {
    const [cameraPreset, setCameraPreset] = useState('perspective');
    const [showGrid, setShowGrid] = useState(true);
    const [showStats, setShowStats] = useState(true);
    const [environmentPreset, setEnvironmentPreset] = useState('sunset');
    const [houseScale, setHouseScale] = useState(1);
    const [wallColor, setWallColor] = useState('#f5f5dc');
    const [roofColor, setRoofColor] = useState('#8b4513');

    const cameraPresets = {
        perspective: { position: [20, 15, 20], name: '🎥 Perspective' },
        front: { position: [0, 8, 30], name: '👁️ Front View' },
        side: { position: [30, 8, 0], name: '↔️ Side View' },
        top: { position: [0, 40, 0], name: '⬆️ Top View' },
        isometric: { position: [25, 20, 25], name: '📐 Isometric' },
        aerial: { position: [15, 30, 15], name: '🚁 Aerial' },
    };

    const colors = [
        { name: 'Beige', value: '#f5f5dc' },
        { name: 'White', value: '#ffffff' },
        { name: 'Cream', value: '#fffdd0' },
        { name: 'Light Gray', value: '#d3d3d3' },
        { name: 'Yellow', value: '#f0e68c' },
        { name: 'Light Blue', value: '#add8e6' },
        { name: 'Peach', value: '#ffdab9' },
        { name: 'Light Green', value: '#90ee90' },
    ];

    const roofColors = [
        { name: 'Brown', value: '#8b4513' },
        { name: 'Dark Red', value: '#8b0000' },
        { name: 'Gray', value: '#696969' },
        { name: 'Black', value: '#2f4f4f' },
        { name: 'Green', value: '#2d5016' },
        { name: 'Blue', value: '#4682b4' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-3 px-6 border-b border-gray-700 shadow-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/gallery" className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                            ← Gallery
                        </Link>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            🏠 3D House Builder
                        </h1>
                        {showStats && (
                            <div className="flex items-center space-x-4 text-sm ml-6">
                                <span className="text-green-400">✓ Complete House Model</span>
                                <span className="text-blue-400">Scale: {houseScale.toFixed(1)}x</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-3">
                        <select
                            value={cameraPreset}
                            onChange={(e) => setCameraPreset(e.target.value)}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm border border-gray-600 hover:border-blue-500 transition-colors"
                        >
                            {Object.entries(cameraPresets).map(([key, preset]) => (
                                <option key={key} value={key}>{preset.name}</option>
                            ))}
                        </select>

                        <select
                            value={environmentPreset}
                            onChange={(e) => setEnvironmentPreset(e.target.value)}
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm border border-gray-600 hover:border-blue-500 transition-colors"
                        >
                            <option value="sunset">🌅 Sunset</option>
                            <option value="dawn">🌄 Dawn</option>
                            <option value="night">🌙 Night</option>
                            <option value="warehouse">🏭 Warehouse</option>
                            <option value="forest">🌲 Forest</option>
                            <option value="city">🏙️ City</option>
                            <option value="park">🌳 Park</option>
                        </select>

                        <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`px-4 py-2 rounded-lg text-sm transition-all ${showGrid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                        >
                            {showGrid ? '📐 Grid On' : '📐 Grid Off'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Controls */}
                <div className="w-72 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 overflow-y-auto border-r border-gray-700 shadow-2xl">
                    <h2 className="text-lg font-bold mb-4 text-blue-400">🎨 Customization</h2>

                    {/* House Scale */}
                    <div className="mb-6 bg-gray-900 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-2 text-purple-400">
                            🏗️ House Scale: {houseScale.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={houseScale}
                            onChange={(e) => setHouseScale(parseFloat(e.target.value))}
                            className="w-full accent-blue-500"
                        />
                    </div>

                    {/* Wall Color */}
                    <div className="mb-6 bg-gray-900 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-3 text-yellow-400">
                            🎨 Wall Color
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {colors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setWallColor(color.value)}
                                    className={`h-10 rounded-lg border-2 transition-all transform hover:scale-110 ${wallColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-gray-600'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Roof Color */}
                    <div className="mb-6 bg-gray-900 rounded-lg p-4">
                        <label className="block text-sm font-semibold mb-3 text-orange-400">
                            🏠 Roof Color
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {roofColors.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setRoofColor(color.value)}
                                    className={`h-10 rounded-lg border-2 transition-all transform hover:scale-110 ${roofColor === color.value ? 'border-white scale-110 shadow-lg' : 'border-gray-600'
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* House Features */}
                    <div className="bg-gray-900 rounded-lg p-4">
                        <h3 className="text-sm font-semibold mb-3 text-green-400">✨ House Features</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span>🚪 Front Door</span>
                                <span className="text-green-400">✓</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🪟 Windows</span>
                                <span className="text-green-400">✓ 8</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🏠 Floors</span>
                                <span className="text-green-400">✓ 2</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🔥 Chimney</span>
                                <span className="text-green-400">✓</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🏛️ Porch</span>
                                <span className="text-green-400">✓</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🚗 Garage</span>
                                <span className="text-green-400">✓</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🪜 Stairs</span>
                                <span className="text-green-400">✓</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>🌳 Landscaping</span>
                                <span className="text-green-400">✓</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 relative bg-gradient-to-br from-sky-200 to-blue-300">
                    <Canvas
                        camera={{ position: cameraPresets[cameraPreset].position, fov: 60 }}
                        shadows
                        gl={{ antialias: true, alpha: false }}
                    >
                        <color attach="background" args={['#87ceeb']} />

                        {/* Lighting */}
                        <ambientLight intensity={0.5} />
                        <directionalLight
                            position={[20, 30, 10]}
                            intensity={1.2}
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                            shadow-camera-far={100}
                            shadow-camera-left={-30}
                            shadow-camera-right={30}
                            shadow-camera-top={30}
                            shadow-camera-bottom={-30}
                        />
                        <pointLight position={[-10, 15, -10]} intensity={0.5} />
                        <hemisphereLight args={['#87ceeb', '#2d5016', 0.6]} />

                        {/* Grid */}
                        {showGrid && (
                            <Grid
                                args={[100, 100]}
                                cellSize={2}
                                cellThickness={0.5}
                                cellColor="#6b7280"
                                sectionSize={10}
                                sectionThickness={1}
                                sectionColor="#4b5563"
                                fadeDistance={80}
                                fadeStrength={1}
                                followCamera={false}
                            />
                        )}

                        {/* Terrain */}
                        <Suspense fallback={null}>
                            <Terrain />
                        </Suspense>

                        {/* House */}
                        <Suspense fallback={
                            <Html center>
                                <div className="text-white text-center bg-gray-900 p-6 rounded-lg">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="font-semibold">Building House...</p>
                                </div>
                            </Html>
                        }>
                            <House scale={houseScale} wallColor={wallColor} roofColor={roofColor} />
                        </Suspense>

                        {/* Contact Shadows */}
                        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={50} blur={2} far={20} />

                        {/* Environment */}
                        <Environment preset={environmentPreset} />
                        <Sky sunPosition={[100, 20, 100]} />

                        {/* Camera Controls */}
                        <OrbitControls
                            enableDamping
                            dampingFactor={0.05}
                            minDistance={5}
                            maxDistance={80}
                            maxPolarAngle={Math.PI / 2.1}
                            enablePan={true}
                            panSpeed={1}
                            rotateSpeed={0.8}
                            zoomSpeed={1.2}
                        />
                    </Canvas>

                    {/* Controls Info */}
                    <div className="absolute bottom-6 right-6 bg-gray-900 bg-opacity-95 rounded-xl p-4 border border-gray-700 text-white shadow-2xl">
                        <div className="font-bold mb-2 text-blue-400 text-sm">🎮 Controls</div>
                        <div className="text-xs space-y-1">
                            <div>🖱️ <strong>Left Click + Drag:</strong> Rotate</div>
                            <div>🖱️ <strong>Right Click + Drag:</strong> Pan</div>
                            <div>🖱️ <strong>Scroll:</strong> Zoom In/Out</div>
                            <div className="mt-2 pt-2 border-t border-gray-700">
                                <div className="text-green-400">📷 {cameraPresets[cameraPreset].name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HouseBuilder;
