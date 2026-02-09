import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';

// --- Reusing Procedural Models for Chat Visualization ---
const ChatRoomModel = ({ items }) => {
    // Basic geometries reused from consultant
    const Bed = ({ position }) => (
        <group position={position}>
            {/* Mattress */}
            <mesh position={[0, 0.3, 0]}><boxGeometry args={[2, 0.4, 2.5]} /><meshStandardMaterial color="#EEEEEE" /></mesh>
            {/* Frame */}
            <mesh position={[0, 0.1, 0]}><boxGeometry args={[2.1, 0.2, 2.6]} /><meshStandardMaterial color="#5D4037" /></mesh>
            {/* Headboard */}
            <mesh position={[0, 0.75, -1.25]}><boxGeometry args={[2.1, 1.5, 0.1]} /><meshStandardMaterial color="#5D4037" /></mesh>
            {/* Pillows */}
            <mesh position={[-0.5, 0.6, -1]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.7, 0.15, 0.4]} /><meshStandardMaterial color="#FFF" /></mesh>
            <mesh position={[0.5, 0.6, -1]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.7, 0.15, 0.4]} /><meshStandardMaterial color="#FFF" /></mesh>
            {/* Blanket */}
            <mesh position={[0, 0.35, 0.5]}><boxGeometry args={[2.05, 0.41, 1.5]} /><meshStandardMaterial color="#1E88E5" /></mesh>
        </group>
    );

    const Sofa = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 0.4, 0]}><boxGeometry args={[2.2, 0.4, 0.9]} /><meshStandardMaterial color="#424242" /></mesh>
            <mesh position={[0, 0.9, -0.35]}><boxGeometry args={[2.2, 0.6, 0.2]} /><meshStandardMaterial color="#424242" /></mesh>
            <mesh position={[-1.2, 0.6, 0]}><boxGeometry args={[0.2, 0.8, 0.9]} /><meshStandardMaterial color="#424242" /></mesh>
            <mesh position={[1.2, 0.6, 0]}><boxGeometry args={[0.2, 0.8, 0.9]} /><meshStandardMaterial color="#424242" /></mesh>
            {/* Cushions */}
            <mesh position={[-0.6, 0.65, -0.2]}><boxGeometry args={[0.8, 0.4, 0.2]} /><meshStandardMaterial color="#616161" /></mesh>
            <mesh position={[0.6, 0.65, -0.2]}><boxGeometry args={[0.8, 0.4, 0.2]} /><meshStandardMaterial color="#616161" /></mesh>
        </group>
    );

    const Table = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.8, 0.8, 0.05, 32]} /><meshStandardMaterial color="#F5F5F5" roughness={0.2} /></mesh>
            <mesh position={[0, 0.25, 0]}><cylinderGeometry args={[0.1, 0.1, 0.5, 16]} /><meshStandardMaterial color="#333" /></mesh>
            <mesh position={[0, 0.02, 0]}><cylinderGeometry args={[0.4, 0.4, 0.05, 32]} /><meshStandardMaterial color="#333" /></mesh>
        </group>
    );

    const Chair = ({ position }) => (
        <group position={position}>
            {/* Seat */}
            <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.6, 0.1, 0.6]} /><meshStandardMaterial color="#FF7043" /></mesh>
            {/* Legs */}
            <mesh position={[0.25, 0.22, 0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.25, 0.22, 0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[0.25, 0.22, -0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.25, 0.22, -0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            {/* Back */}
            <mesh position={[0, 0.8, -0.28]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.6, 0.6, 0.05]} /><meshStandardMaterial color="#FF7043" /></mesh>
        </group>
    );

    const Plant = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.3, 0.2, 0.6, 32]} /><meshStandardMaterial color="#fff" /></mesh>
            <mesh position={[0, 0.8, 0]}><dodecahedronGeometry args={[0.4, 0]} /><meshStandardMaterial color="#4CAF50" /></mesh>
            <mesh position={[0.2, 1.0, 0]}><dodecahedronGeometry args={[0.3, 0]} /><meshStandardMaterial color="#66BB6A" /></mesh>
            <mesh position={[-0.2, 0.9, 0.2]}><dodecahedronGeometry args={[0.25, 0]} /><meshStandardMaterial color="#81C784" /></mesh>
        </group>
    );

    const TV = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 0.3, 0]}><boxGeometry args={[2.5, 0.6, 0.6]} /><meshStandardMaterial color="#333" /></mesh>
            <mesh position={[0, 1.1, 0]}><boxGeometry args={[2.5, 1.4, 0.05]} /><meshStandardMaterial color="#111" roughness={0.1} /></mesh>
            {/* Screen Glow */}
            <mesh position={[0, 1.2, 0.03]}><planeGeometry args={[2.4, 1.3]} /><meshStandardMaterial color="#222" emissive="#111" /></mesh>
        </group>
    );

    const Wall = ({ position }) => (
        <mesh position={[position[0], 1.5, position[2]]}>
            <boxGeometry args={[4, 3, 0.2]} />
            <meshStandardMaterial color="#E0E0E0" />
        </mesh>
    );

    const Lamp = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.04, 0.04, 3, 16]} /><meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} /></mesh>
            <mesh position={[0, 3, 0]}><coneGeometry args={[0.6, 0.8, 32, 1, true]} /><meshStandardMaterial color="#FFF" transparent opacity={0.6} side={2} /></mesh>
            <mesh position={[0, 2.8, 0]}><sphereGeometry args={[0.2]} /><meshStandardMaterial emissive="#FFD54F" emissiveIntensity={3} color="#FFD54F" /></mesh>
        </group>
    );

    return (
        <group>
            {items.map((item, index) => {
                // Simple layout algorithm: Grid
                const spacing = 3;
                const row = Math.floor(index / 3);
                const col = index % 3;
                const pos = [(col - 1) * spacing, 0, (row - 1) * spacing];

                if (item.includes('bed')) return <Bed key={index} position={pos} />;
                if (item.includes('sofa')) return <Sofa key={index} position={pos} />;
                if (item.includes('tv')) return <TV key={index} position={pos} />;
                if (item.includes('wall')) return <Wall key={index} position={pos} />;
                if (item.includes('lamp')) return <Lamp key={index} position={pos} />;
                if (item.includes('table')) return <Table key={index} position={pos} />;
                if (item.includes('chair')) return <Chair key={index} position={pos} />;
                if (item.includes('plant')) return <Plant key={index} position={pos} />;
                return null;
            })}
        </group>
    );
};

const AIChatAssistant = ({ isOpenControlled, onClose }) => {
    const [localIsOpen, setLocalIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your AI Architect. Type a prompt like 'Add a bed, sofa, and TV' to visualize.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [generatedScene, setGeneratedScene] = useState(null); // Array of items
    const messagesEndRef = useRef(null);

    // Sync external open state if provided
    useEffect(() => {
        if (isOpenControlled !== undefined) {
            setLocalIsOpen(isOpenControlled);
        }
    }, [isOpenControlled]);

    const handleClose = () => {
        setLocalIsOpen(false);
        if (onClose) onClose();
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Processing
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let botResponse = { id: Date.now() + 1, text: "", sender: 'bot' };

            // NLP Logic for "Scene Generation"
            const supportedItems = ['bed', 'sofa', 'tv', 'wall', 'lamp', 'table', 'chair', 'plant'];
            const foundItems = [];

            // Very basic extraction
            if (lowerInput.includes('three wall') || lowerInput.includes('3 wall')) {
                foundItems.push('wall', 'wall', 'wall');
            } else if (lowerInput.includes('wall')) {
                foundItems.push('wall');
            }

            supportedItems.forEach(item => {
                if (lowerInput.includes(item) && item !== 'wall') {
                    foundItems.push(item);
                }
            });

            if (foundItems.length > 0) {
                botResponse.text = `I've generated a 3D design with: ${foundItems.join(', ')}. Check the gallery!`;
                setGeneratedScene(foundItems);
            } else {
                botResponse.text = "I can generate: Bed, Sofa, TV, Wall, Lamp, Table, Chair, Plant. Try asking for these!";
            }

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <div className="pointer-events-auto">
                {localIsOpen ? (
                    <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 w-96 md:w-[28rem] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right" style={{ maxHeight: '80vh' }}>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">🤖</span>
                                <h3 className="font-bold text-white text-sm">AI Interior Architect</h3>
                            </div>
                            <button onClick={handleClose} className="text-white">✕</button>
                        </div>

                        {/* 3D Preview Panel (Dynamic Gallery) */}
                        {generatedScene && (
                            <div className="w-full h-64 bg-gray-900 relative border-b border-slate-700 shrink-0">
                                <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-green-400 font-mono z-10">
                                    LIVE RENDER
                                </div>
                                <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                                    <ambientLight intensity={0.5} />
                                    <directionalLight position={[10, 10, 10]} intensity={1} />
                                    <pointLight position={[-10, 10, -10]} intensity={0.5} />
                                    <OrbitControls autoRotate autoRotateSpeed={1} />
                                    <Grid args={[20, 20]} cellColor="white" sectionColor="gray" fadeDistance={30} />
                                    <Suspense fallback={null}>
                                        <ChatRoomModel items={generatedScene} />
                                    </Suspense>
                                    <Environment preset="city" />
                                </Canvas>
                            </div>
                        )}

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50 scrollbar-thin scrollbar-thumb-slate-700 min-h-[200px]">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-md ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && <div className="text-xs text-slate-400 animate-pulse">AI is generating...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="e.g., '1 bed, 2 walls, 1 lamp'..."
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                />
                                <button onClick={handleSend} className="p-2 bg-indigo-600 rounded-full text-white">
                                    ➜
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setLocalIsOpen(true)}
                        className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:scale-110 transition-transform"
                    >
                        <span className="text-3xl">🤖</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AIChatAssistant;
