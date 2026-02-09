import { useEditor } from './EditorContext';

const Toolbar = () => {
    const { activeTool, setActiveTool, snapToGrid, setSnapToGrid } = useEditor();

    const tools = [
        { id: 'select', icon: '👆', label: 'Select' },
        { id: 'wall', icon: '🧱', label: 'Draw Wall' },
        { id: 'floor', icon: '⬜', label: 'Floor' },
        { id: 'door', icon: '🚪', label: 'Door' },
        { id: 'window', icon: '🪟', label: 'Window' },
        { id: 'measure', icon: '📏', label: 'Measure' },
    ];

    return (
        <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-xl flex flex-col gap-2">
            {tools.map((tool) => (
                <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs transition-all ${activeTool === tool.id
                            ? 'bg-indigo-600 text-white shadow-lg scale-105'
                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                        }`}
                    title={tool.label}
                >
                    <span className="text-xl mb-1">{tool.icon}</span>
                </button>
            ))}

            <div className="h-px bg-white/20 my-1" />

            <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs transition-all ${snapToGrid ? 'bg-green-600/80 text-white' : 'text-white/60 hover:bg-white/10'
                    }`}
                title="Snap to Grid"
            >
                🧲
            </button>
        </div>
    );
};

export default Toolbar;
