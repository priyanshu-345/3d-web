import { useState, useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls, Grid, Environment, Html,
    PerspectiveCamera, Sky, ContactShadows
} from '@react-three/drei';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { CanvasWrapper } from '../components/CanvasErrorBoundary';

// Multi-Room Component
function MultiRoom({ rooms }) {
    return (
        <group>
            {rooms.map((room) => (
                <group key={room.id} position={room.position}>
                    {/* Floor */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                        <planeGeometry args={[room.dimensions[0], room.dimensions[2]]} />
                        <meshStandardMaterial color={room.floorColor} roughness={0.8} />
                    </mesh>

                    {/* Ceiling */}
                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, room.dimensions[1], 0]}>
                        <planeGeometry args={[room.dimensions[0], room.dimensions[2]]} />
                        <meshStandardMaterial color={room.ceilingColor} roughness={0.9} />
                    </mesh>

                    {/* Walls */}
                    {/* Back Wall */}
                    <mesh position={[0, room.dimensions[1] / 2, -room.dimensions[2] / 2]}>
                        <planeGeometry args={[room.dimensions[0], room.dimensions[1]]} />
                        <meshStandardMaterial color={room.wallColor} />
                    </mesh>

                    {/* Front Wall (transparent) */}
                    <mesh position={[0, room.dimensions[1] / 2, room.dimensions[2] / 2]}>
                        <planeGeometry args={[room.dimensions[0], room.dimensions[1]]} />
                        <meshStandardMaterial color={room.wallColor} transparent opacity={0.3} />
                    </mesh>

                    {/* Left Wall */}
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-room.dimensions[0] / 2, room.dimensions[1] / 2, 0]}>
                        <planeGeometry args={[room.dimensions[2], room.dimensions[1]]} />
                        <meshStandardMaterial color={room.wallColor} />
                    </mesh>

                    {/* Right Wall */}
                    <mesh rotation={[0, -Math.PI / 2, 0]} position={[room.dimensions[0] / 2, room.dimensions[1] / 2, 0]}>
                        <planeGeometry args={[room.dimensions[2], room.dimensions[1]]} />
                        <meshStandardMaterial color={room.wallColor} />
                    </mesh>

                    {/* Room Label */}
                    <Html position={[0, room.dimensions[1] + 0.5, 0]} center>
                        <div className="bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-bold">
                            {room.name}
                        </div>
                    </Html>
                </group>
            ))}
        </group>
    );
}

// Furniture Component
function Furniture({ type, position, scale, rotation, color, onSelect, isSelected }) {
    const meshRef = useRef();

    const getGeometry = () => {
        switch (type) {
            case 'sofa': return <boxGeometry args={[2, 0.8, 0.9]} />;
            case 'bed': return <boxGeometry args={[2, 0.5, 1.8]} />;
            case 'table': return <boxGeometry args={[1.2, 0.4, 0.8]} />;
            case 'chair': return <boxGeometry args={[0.6, 1, 0.6]} />;
            case 'tv': return <boxGeometry args={[1.5, 0.9, 0.1]} />;
            case 'lamp': return <cylinderGeometry args={[0.1, 0.1, 1.5, 16]} />;
            case 'plant': return <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />;
            default: return <boxGeometry args={[1, 1, 1]} />;
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
            castShadow
        >
            {getGeometry()}
            <meshStandardMaterial
                color={color}
                metalness={0.2}
                roughness={0.6}
                emissive={isSelected ? '#444444' : '#000000'}
                emissiveIntensity={isSelected ? 0.3 : 0}
            />
        </mesh>
    );
}

const WholeHouseDesigner = () => {
    // Multi-Room State
    const [rooms, setRooms] = useState([
        {
            id: 1,
            name: 'Living Room',
            type: 'living',
            dimensions: [8, 3, 6],
            position: [0, 0, 0],
            wallColor: '#ffffff',
            floorColor: '#8b7355',
            ceilingColor: '#f5f5f5',
            furniture: []
        }
    ]);

    const [selectedRoom, setSelectedRoom] = useState(1);
    const [viewMode, setViewMode] = useState('3d'); // '3d' or 'floorplan'
    const [activeTab, setActiveTab] = useState('rooms');

    // Room Templates
    const roomTemplates = [
        { type: 'living', name: 'Living Room', icon: '🛋️', dimensions: [8, 3, 6], color: '#e3f2fd' },
        { type: 'bedroom', name: 'Bedroom', icon: '🛏️', dimensions: [6, 3, 5], color: '#f3e5f5' },
        { type: 'kitchen', name: 'Kitchen', icon: '🔪', dimensions: [5, 3, 4], color: '#fff3e0' },
        { type: 'bathroom', name: 'Bathroom', icon: '🛁', dimensions: [4, 3, 3], color: '#e0f2f1' },
        { type: 'dining', name: 'Dining Room', icon: '🍽️', dimensions: [6, 3, 5], color: '#fce4ec' },
        { type: 'office', name: 'Office', icon: '🖥️', dimensions: [5, 3, 4], color: '#e8f5e9' },
        { type: 'hallway', name: 'Hallway', icon: '🚪', dimensions: [10, 3, 2], color: '#f5f5f5' },
        { type: 'balcony', name: 'Balcony', icon: '🌿', dimensions: [4, 3, 3], color: '#e8eaf6' },
    ];

    // Add Room
    const addRoom = (template) => {
        const lastRoom = rooms[rooms.length - 1];
        const newPosition = [
            lastRoom.position[0] + lastRoom.dimensions[0] / 2 + template.dimensions[0] / 2 + 1,
            0,
            0
        ];

        const newRoom = {
            id: Date.now(),
            name: `${template.name} ${rooms.length + 1}`,
            type: template.type,
            dimensions: [...template.dimensions],
            position: newPosition,
            wallColor: '#ffffff',
            floorColor: '#8b7355',
            ceilingColor: '#f5f5f5',
            furniture: []
        };

        setRooms([...rooms, newRoom]);
        setSelectedRoom(newRoom.id);
    };

    // Delete Room
    const deleteRoom = (roomId) => {
        if (rooms.length === 1) {
            alert('Cannot delete the last room!');
            return;
        }
        const newRooms = rooms.filter(r => r.id !== roomId);
        setRooms(newRooms);
        if (selectedRoom === roomId) {
            setSelectedRoom(newRooms[0].id);
        }
    };

    // Calculate total house area
    const totalArea = rooms.reduce((sum, room) => {
        return sum + (room.dimensions[0] * room.dimensions[2]);
    }, 0);

    // Export Design
    const exportDesign = () => {
        const design = {
            rooms: rooms.map(r => ({
                name: r.name,
                type: r.type,
                dimensions: r.dimensions,
                position: r.position,
                colors: {
                    wall: r.wallColor,
                    floor: r.floorColor,
                    ceiling: r.ceilingColor
                },
                furniture: r.furniture
            })),
            metadata: {
                totalRooms: rooms.length,
                totalArea: totalArea.toFixed(2),
                createdAt: new Date().toISOString()
            }
        };

        const output = JSON.stringify(design, null, 2);
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `whole-house-design-${Date.now()}.json`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-gray-800 text-white py-2 px-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-primary-400 hover:text-primary-300">
                            ← Home
                        </Link>
                        <h1 className="text-lg font-bold">🏠 Whole House Designer</h1>
                        <div className="text-sm text-gray-400">
                            {rooms.length} Rooms | {totalArea.toFixed(1)} m² Total Area
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setViewMode(viewMode === '3d' ? 'floorplan' : '3d')}
                            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                        >
                            {viewMode === '3d' ? '📐 Floor Plan' : '🎨 3D View'}
                        </button>
                        <button
                            onClick={exportDesign}
                            className="bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded text-sm"
                        >
                            💾 Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-80 bg-gray-800 text-white overflow-y-auto flex-shrink-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-700">
                        {['rooms', 'furniture', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 px-3 py-2 text-sm font-medium ${activeTab === tab
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="p-4">
                        {/* Rooms Tab */}
                        {activeTab === 'rooms' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold mb-3">Add Room</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {roomTemplates.map((template) => (
                                        <button
                                            key={template.type}
                                            onClick={() => addRoom(template)}
                                            className="bg-gray-700 hover:bg-gray-600 p-3 rounded text-left"
                                            style={{ borderLeft: `4px solid ${template.color}` }}
                                        >
                                            <div className="text-2xl mb-1">{template.icon}</div>
                                            <div className="text-xs">{template.name}</div>
                                            <div className="text-xs text-gray-400">
                                                {template.dimensions[0]}×{template.dimensions[2]}m
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="border-t border-gray-700 pt-4">
                                    <h3 className="font-semibold mb-2">Your Rooms ({rooms.length})</h3>
                                    <div className="space-y-2">
                                        {rooms.map((room) => (
                                            <div
                                                key={room.id}
                                                onClick={() => setSelectedRoom(room.id)}
                                                className={`p-3 rounded cursor-pointer ${selectedRoom === room.id ? 'bg-primary-600' : 'bg-gray-700 hover:bg-gray-600'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="font-medium">{room.name}</div>
                                                        <div className="text-xs text-gray-300">
                                                            {room.dimensions[0]}×{room.dimensions[2]}m = {(room.dimensions[0] * room.dimensions[2]).toFixed(1)}m²
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteRoom(room.id);
                                                        }}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Furniture Tab */}
                        {activeTab === 'furniture' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold mb-3">Add Furniture to {rooms.find(r => r.id === selectedRoom)?.name}</h3>
                                <p className="text-sm text-gray-400">
                                    Select a room from the Rooms tab, then add furniture here.
                                </p>
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="space-y-4">
                                <h3 className="font-semibold mb-3">House Settings</h3>
                                <div className="bg-gray-700 p-3 rounded">
                                    <div className="text-sm mb-2">Total Rooms: {rooms.length}</div>
                                    <div className="text-sm mb-2">Total Area: {totalArea.toFixed(2)} m²</div>
                                    <div className="text-sm">View Mode: {viewMode}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3D Canvas */}
                <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-black">
                    <CanvasWrapper rooms={rooms}>
                        <Canvas
                            camera={{ position: viewMode === 'floorplan' ? [0, 20, 0] : [15, 10, 15], fov: 50 }}
                            shadows
                            gl={{ antialias: true, alpha: false }}
                        >
                            <ambientLight intensity={0.6} />
                            <directionalLight position={[10, 10, 5]} intensity={1.0} castShadow />
                            <pointLight position={[-10, 5, -5]} intensity={0.3} />
                            <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={0.4} />

                            <Environment preset="sunset" />
                            <Grid args={[50, 50]} cellColor="#4a4a4a" sectionColor="#6a6a6a" />

                            <MultiRoom rooms={rooms} />

                            <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={50} blur={2} far={10} />

                            <OrbitControls
                                enableDamping
                                dampingFactor={0.05}
                                minDistance={5}
                                maxDistance={50}
                            />
                            <Sky sunPosition={[100, 20, 100]} />
                        </Canvas>
                    </CanvasWrapper>

                    <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-90 rounded-lg p-2 border border-gray-700 text-xs text-white">
                        <div className="font-bold mb-1 text-blue-400">🎮 Controls</div>
                        <div>🖱️ Left: Rotate</div>
                        <div>🖱️ Right: Pan</div>
                        <div>🖱️ Scroll: Zoom</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WholeHouseDesigner;
