import { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import SafeCanvas from './SafeCanvas';
import { OrbitControls, Environment, Grid } from '@react-three/drei';

// --- Procedural 3D Models for Chat Visualization ---
const ChatRoomModel = ({ items }) => {
    const Bed = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 0.3, 0]}><boxGeometry args={[2, 0.4, 2.5]} /><meshStandardMaterial color="#EEEEEE" /></mesh>
            <mesh position={[0, 0.1, 0]}><boxGeometry args={[2.1, 0.2, 2.6]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[0, 0.75, -1.25]}><boxGeometry args={[2.1, 1.5, 0.1]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.5, 0.6, -1]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.7, 0.15, 0.4]} /><meshStandardMaterial color="#FFF" /></mesh>
            <mesh position={[0.5, 0.6, -1]} rotation={[0.2, 0, 0]}><boxGeometry args={[0.7, 0.15, 0.4]} /><meshStandardMaterial color="#FFF" /></mesh>
            <mesh position={[0, 0.35, 0.5]}><boxGeometry args={[2.05, 0.41, 1.5]} /><meshStandardMaterial color="#1E88E5" /></mesh>
        </group>
    );

    const Sofa = ({ position }) => (
        <group position={position}>
            <mesh position={[0, 0.4, 0]}><boxGeometry args={[2.2, 0.4, 0.9]} /><meshStandardMaterial color="#424242" /></mesh>
            <mesh position={[0, 0.9, -0.35]}><boxGeometry args={[2.2, 0.6, 0.2]} /><meshStandardMaterial color="#424242" /></mesh>
            <mesh position={[-1.2, 0.6, 0]}><boxGeometry args={[0.2, 0.8, 0.9]} /><meshStandardMaterial color="#424242" /></mesh>
            <mesh position={[1.2, 0.6, 0]}><boxGeometry args={[0.2, 0.8, 0.9]} /><meshStandardMaterial color="#424242" /></mesh>
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
            <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.6, 0.1, 0.6]} /><meshStandardMaterial color="#FF7043" /></mesh>
            <mesh position={[0.25, 0.22, 0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.25, 0.22, 0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[0.25, 0.22, -0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
            <mesh position={[-0.25, 0.22, -0.25]}><cylinderGeometry args={[0.04, 0.04, 0.45]} /><meshStandardMaterial color="#5D4037" /></mesh>
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

// --- Voice Command Hook ---
const useVoiceCommand = ({ onTranscript, onError }) => {
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    // Use refs so the speech recognition callbacks always call the latest version
    const onTranscriptRef = useRef(onTranscript);
    const onErrorRef = useRef(onError);
    useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);
    useEffect(() => { onErrorRef.current = onError; }, [onError]);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setIsListening(false);
            // Use ref to always call the latest callback (avoids stale closure)
            if (onTranscriptRef.current) onTranscriptRef.current(transcript);
        };

        recognition.onerror = (event) => {
            // Silently ignore 'aborted' — this fires when we call .stop()
            if (event.error === 'aborted') {
                setIsListening(false);
                return;
            }
            let msg = 'Voice recognition error.';
            if (event.error === 'not-allowed') msg = 'Microphone access denied. Please allow mic access in your browser settings.';
            else if (event.error === 'no-speech') msg = 'No speech detected. Please try again.';
            else if (event.error === 'network') msg = 'Network error. Please check your internet connection.';
            else if (event.error === 'audio-capture') msg = 'No microphone found. Please connect a microphone.';
            else if (event.error === 'service-not-allowed') msg = 'Speech service not allowed. Try using Chrome browser.';
            setIsListening(false);
            if (onErrorRef.current) onErrorRef.current(msg);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        return () => {
            try { recognition.abort(); } catch (e) { /* ignore */ }
        };
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;
        // If already listening, stop first then restart
        if (isListening) {
            try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
            setIsListening(false);
            // Restart after a brief delay so the browser releases the mic
            setTimeout(() => {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (e) {
                    setIsListening(false);
                }
            }, 200);
            return;
        }
        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            // If recognition was not properly stopped, abort and retry
            try { recognitionRef.current.abort(); } catch (ex) { /* ignore */ }
            setTimeout(() => {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (ex2) {
                    setIsListening(false);
                    if (onErrorRef.current) onErrorRef.current('Could not start voice recognition. Please try again.');
                }
            }, 200);
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
            setIsListening(false);
        }
    }, []);

    return { isListening, isSupported, startListening, stopListening };
};

// --- Main Chat Component ---
const AIChatAssistant = ({ isOpenControlled, onClose }) => {
    const [localIsOpen, setLocalIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your AI Architect 🏠 Type or 🎤 speak a command like 'Add a bed, sofa, and TV' to visualize a 3D room!",
            sender: 'bot'
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [generatedScene, setGeneratedScene] = useState(null);
    const [voiceError, setVoiceError] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpenControlled !== undefined) {
            setLocalIsOpen(isOpenControlled);
        }
    }, [isOpenControlled]);

    const handleClose = () => {
        setLocalIsOpen(false);
        if (onClose) onClose();
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Parse items from text
    const parseItems = (text) => {
        const lowerText = text.toLowerCase();
        const supportedItems = ['bed', 'sofa', 'tv', 'wall', 'lamp', 'table', 'chair', 'plant'];
        const foundItems = [];

        // Handle quantity words
        const quantityMap = { 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'a ': 1, 'an ': 1 };

        // Wall special handling
        if (/three walls?|3 walls?/.test(lowerText)) {
            foundItems.push('wall', 'wall', 'wall');
        } else if (/two walls?|2 walls?/.test(lowerText)) {
            foundItems.push('wall', 'wall');
        } else if (/wall/.test(lowerText)) {
            foundItems.push('wall');
        }

        supportedItems.forEach(item => {
            if (item === 'wall') return; // handled above
            const regex = new RegExp(`(two|three|four|2|3|4)?\\s*${item}s?`, 'i');
            const match = lowerText.match(regex);
            if (match) {
                const qty = match[1];
                const count = qty === 'two' || qty === '2' ? 2
                    : qty === 'three' || qty === '3' ? 3
                        : qty === 'four' || qty === '4' ? 4 : 1;
                for (let i = 0; i < count; i++) foundItems.push(item);
            }
        });

        return foundItems;
    };

    const processCommand = (text) => {
        const userMsg = { id: Date.now(), text, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        setVoiceError('');

        setTimeout(() => {
            const foundItems = parseItems(text);
            let botResponse;

            if (foundItems.length > 0) {
                botResponse = {
                    id: Date.now() + 1,
                    text: `✅ Generated 3D scene with: **${foundItems.join(', ')}**. Rotate the model below!`,
                    sender: 'bot'
                };
                setGeneratedScene(foundItems);
            } else {
                botResponse = {
                    id: Date.now() + 1,
                    text: "🤔 I can generate: **Bed, Sofa, TV, Wall, Lamp, Table, Chair, Plant**. Try: 'Add a bed and two chairs'",
                    sender: 'bot'
                };
            }

            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 800);
    };

    const handleSend = () => {
        if (!input.trim()) return;
        processCommand(input.trim());
    };

    // Voice command handlers — process the transcript directly
    // (not via processCommand ref to avoid stale closure)
    const handleVoiceTranscript = useCallback((transcript) => {
        setInput(transcript);
        // Process with a delay so user sees the transcript in the input first
        setTimeout(() => {
            // Add user message
            const userMsg = { id: Date.now(), text: transcript, sender: 'user' };
            setMessages(prev => [...prev, userMsg]);
            setInput('');
            setIsTyping(true);
            setVoiceError('');

            setTimeout(() => {
                const foundItems = parseItems(transcript);
                let botResponse;
                if (foundItems.length > 0) {
                    botResponse = {
                        id: Date.now() + 1,
                        text: `✅ Generated 3D scene with: **${foundItems.join(', ')}**. Rotate the model below!`,
                        sender: 'bot'
                    };
                    setGeneratedScene(foundItems);
                } else {
                    botResponse = {
                        id: Date.now() + 1,
                        text: "🤔 I can generate: **Bed, Sofa, TV, Wall, Lamp, Table, Chair, Plant**. Try saying: 'Add a bed and two chairs'",
                        sender: 'bot'
                    };
                }
                setMessages(prev => [...prev, botResponse]);
                setIsTyping(false);
            }, 800);
        }, 400);
    }, []);

    const handleVoiceError = useCallback((msg) => {
        setVoiceError(msg);
        setTimeout(() => setVoiceError(''), 4000);
    }, []);

    const { isListening, isSupported, startListening, stopListening } = useVoiceCommand({
        onTranscript: handleVoiceTranscript,
        onError: handleVoiceError,
    });

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes micPulse {
                    0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
                    70% { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
                    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
                }
                .mic-active {
                    animation: micPulse 1s ease-out infinite;
                }
                @keyframes waveBar {
                    0%, 100% { height: 4px; }
                    50% { height: 16px; }
                }
                .wave-bar { animation: waveBar 0.6s ease-in-out infinite; }
                .wave-bar:nth-child(2) { animation-delay: 0.1s; }
                .wave-bar:nth-child(3) { animation-delay: 0.2s; }
                .wave-bar:nth-child(4) { animation-delay: 0.3s; }
                .wave-bar:nth-child(5) { animation-delay: 0.4s; }
            `}} />

            <div className="pointer-events-auto">
                {localIsOpen ? (
                    <div
                        className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 w-96 md:w-[28rem] rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
                        style={{ maxHeight: '85vh' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center shrink-0">
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">🤖</span>
                                <div>
                                    <h3 className="font-bold text-white text-sm">AI Interior Architect</h3>
                                    <p className="text-indigo-200 text-xs">Type or speak your design</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="text-white hover:text-indigo-200 transition-colors text-lg">✕</button>
                        </div>

                        {/* Voice Status Banner */}
                        {isListening && (
                            <div className="bg-red-600/20 border-b border-red-500/30 px-4 py-2 flex items-center gap-3 shrink-0">
                                <div className="flex items-end gap-0.5 h-5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="wave-bar w-1 bg-red-400 rounded-full" style={{ animationDelay: `${i * 0.1}s` }} />
                                    ))}
                                </div>
                                <span className="text-red-300 text-xs font-medium">Listening... Speak now</span>
                                <button
                                    onClick={stopListening}
                                    className="ml-auto text-red-300 hover:text-red-100 text-xs underline"
                                >
                                    Stop
                                </button>
                            </div>
                        )}

                        {/* Voice Error */}
                        {voiceError && (
                            <div className="bg-orange-500/10 border-b border-orange-500/30 px-4 py-2 shrink-0">
                                <p className="text-orange-300 text-xs">⚠️ {voiceError}</p>
                            </div>
                        )}

                        {/* 3D Preview Panel */}
                        {generatedScene && (
                            <div className="w-full h-56 bg-gray-900 relative border-b border-slate-700 shrink-0">
                                <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-xs text-green-400 font-mono z-10 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    LIVE RENDER
                                </div>
                                <div className="absolute top-2 right-2 text-xs text-slate-400 z-10 bg-black/40 px-2 py-1 rounded">
                                    Drag to rotate
                                </div>
                                <SafeCanvas fallbackLabel="3D Room Preview" camera={{ position: [5, 5, 5], fov: 50 }}>
                                    <ambientLight intensity={0.5} />
                                    <directionalLight position={[10, 10, 10]} intensity={1} />
                                    <pointLight position={[-10, 10, -10]} intensity={0.5} />
                                    <OrbitControls autoRotate autoRotateSpeed={1} />
                                    <Grid args={[20, 20]} cellColor="white" sectionColor="gray" fadeDistance={30} />
                                    <Suspense fallback={null}>
                                        <ChatRoomModel items={generatedScene} />
                                    </Suspense>
                                    <Environment preset="city" />
                                </SafeCanvas>
                            </div>
                        )}

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50 min-h-[160px]">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.sender === 'bot' && (
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs mr-2 shrink-0 mt-1">🤖</div>
                                    )}
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-md ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-br-sm'
                                        : 'bg-slate-700/80 text-slate-200 rounded-bl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs">🤖</div>
                                    <div className="bg-slate-700/80 rounded-2xl rounded-bl-sm px-4 py-2.5 flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
                            {/* Voice hint */}
                            {isSupported && (
                                <p className="text-xs text-slate-500 mb-2 text-center">
                                    🎤 Click the mic to speak your design command
                                </p>
                            )}
                            {!isSupported && (
                                <p className="text-xs text-orange-400 mb-2 text-center">
                                    ⚠️ Voice not supported in this browser. Use Chrome for voice commands.
                                </p>
                            )}
                            <div className="flex items-center space-x-2">
                                {/* Mic Button */}
                                {isSupported && (
                                    <button
                                        onClick={isListening ? stopListening : startListening}
                                        title={isListening ? 'Stop listening' : 'Start voice command'}
                                        className={`p-2.5 rounded-full transition-all duration-200 shrink-0 ${isListening
                                            ? 'bg-red-600 text-white mic-active'
                                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                                            }`}
                                    >
                                        {isListening ? (
                                            // Stop icon
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <rect x="6" y="6" width="12" height="12" rx="2" />
                                            </svg>
                                        ) : (
                                            // Mic icon
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                                                <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z" />
                                            </svg>
                                        )}
                                    </button>
                                )}

                                {/* Text Input */}
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={isListening ? '🎤 Listening...' : "e.g., 'Add a bed and 2 chairs'..."}
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-full px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                    disabled={isListening}
                                />

                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isListening}
                                    className="p-2.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setLocalIsOpen(true)}
                        className="flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full shadow-2xl hover:scale-110 transition-transform"
                        title="Open AI Architect"
                    >
                        <span className="text-3xl">🤖</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AIChatAssistant;
