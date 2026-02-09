import { createContext, useContext, useState } from 'react';

const EditorContext = createContext();

export const EditorProvider = ({ children }) => {
    const [activeTool, setActiveTool] = useState('select'); // select, wall, floor, door, window
    const [gridSize, setGridSize] = useState(1);
    const [snapToGrid, setSnapToGrid] = useState(true);

    // Walls State - Initialized with a Larger House Structure with Dividers
    const [walls, setWalls] = useState([
        // Outer Shell (12m x 8m)
        { id: 'w1', start: [-6, 0, -4], end: [6, 0, -4], thickness: 0.2, height: 3, color: '#e5e5e5' }, // Back
        { id: 'w2', start: [-6, 0, 4], end: [6, 0, 4], thickness: 0.2, height: 3, color: '#e5e5e5' },  // Front
        { id: 'w3', start: [-6, 0, -4], end: [-6, 0, 4], thickness: 0.2, height: 3, color: '#e5e5e5' }, // Left
        { id: 'w4', start: [6, 0, -4], end: [6, 0, 4], thickness: 0.2, height: 3, color: '#e5e5e5' },  // Right

        // Internal Divider (Creates a Bedroom and Living Area)
        { id: 'w5', start: [0, 0, -4], end: [0, 0, 1], thickness: 0.2, height: 3, color: '#e5e5e5' },  // center divider partial
    ]);
    const [currentWall, setCurrentWall] = useState(null); // For drawing

    // Objects State
    const [objects, setObjects] = useState([]);
    const [selectedObjectId, setSelectedObjectId] = useState(null);

    // Furniture State
    const [furniture, setFurniture] = useState([]);
    const [selectedFurniture, setSelectedFurniture] = useState(null);
    const [transformMode, setTransformMode] = useState('translate'); // translate, rotate, scale

    // Measurement Units
    const [measurementUnit, setMeasurementUnit] = useState('m'); // m, ft

    // Scene State
    const [roomDimensions, setRoomDimensions] = useState([8, 3, 6]);
    const [lightIntensity, setLightIntensity] = useState(0.5);

    const addWall = (start, end) => {
        const newWall = {
            id: Date.now(),
            start,
            end,
            thickness: 0.2,
            height: 3,
            color: '#ffffff',
        };
        setWalls([...walls, newWall]);
    };

    const updateWall = (id, updates) => {
        setWalls(walls.map(w => w.id === id ? { ...w, ...updates } : w));
    };

    const addFurniture = (item) => {
        setFurniture([...furniture, item]);
        setSelectedFurniture(item.id);
    };

    const updateFurniture = (id, updates) => {
        setFurniture(furniture.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const deleteFurniture = (id) => {
        setFurniture(furniture.filter(f => f.id !== id));
        setSelectedFurniture(null);
    };

    return (
        <EditorContext.Provider value={{
            activeTool, setActiveTool,
            gridSize, setGridSize,
            snapToGrid, setSnapToGrid,
            walls, setWalls, addWall, updateWall,
            currentWall, setCurrentWall,
            objects, setObjects,
            selectedObjectId, setSelectedObjectId,
            furniture, setFurniture, addFurniture, updateFurniture, deleteFurniture,
            selectedFurniture, setSelectedFurniture,
            transformMode, setTransformMode,
            measurementUnit, setMeasurementUnit,
            roomDimensions, setRoomDimensions,
            lightIntensity, setLightIntensity
        }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => useContext(EditorContext);
