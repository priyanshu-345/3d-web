import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TOOL_TYPES = {
  SELECT: 'select',
  PEN: 'pen',
  LINE: 'line',
  RECT: 'rect',
  CIRCLE: 'circle',
  POLYGON: 'polygon',
  BEZIER: 'bezier',
  TEXT: 'text',
  FILL: 'fill',
  ERASER: 'eraser',
};

const TwoDDesignStudio = () => {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState(TOOL_TYPES.PEN);
  const [color, setColor] = useState('#0ea5e9');
  const [fillColor, setFillColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [lineWidth, setLineWidth] = useState(3);
  const [startPoint, setStartPoint] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [scale, setScale] = useState(1);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [layers, setLayers] = useState([{ id: 0, name: 'Layer 1', visible: true, locked: false }]);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [bezierPoints, setBezierPoints] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(50);
  const [snapToGrid, setSnapToGrid] = useState(false);

  // Canvas size controls
  const [canvasWidth, setCanvasWidth] = useState(1400);
  const [canvasHeight, setCanvasHeight] = useState(800);

  // Cursor style
  const [cursorStyle, setCursorStyle] = useState('crosshair');

  const colors = [
    '#000000', '#4b5563', '#9ca3af', '#ffffff',
    '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
    '#22c55e', '#eab308', '#f97316', '#ef4444',
    '#ec4899', '#14b8a6', '#a855f7', '#facc15',
  ];

  const getPosition = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) * (canvasWidth / rect.width);
    let y = (e.clientY - rect.top) * (canvasHeight / rect.height);

    if (snapToGrid) {
      x = Math.round(x / gridSize) * gridSize;
      y = Math.round(y / gridSize) * gridSize;
    }

    return { x, y };
  };

  const drawGrid = (ctx) => {
    if (!showGrid) return;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = 0; y <= canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  const redrawAll = (ctx) => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    drawGrid(ctx);

    shapes.forEach((shape) => {
      const layer = layers.find(l => l.id === shape.layer);
      if (!layer || !layer.visible) return;

      ctx.strokeStyle = shape.color;
      ctx.fillStyle = shape.fillColor || 'transparent';
      ctx.lineWidth = shape.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (shape.type === TOOL_TYPES.PEN || shape.type === TOOL_TYPES.ERASER) {
        ctx.beginPath();
        for (let i = 0; i < shape.points.length - 1; i++) {
          const p1 = shape.points[i];
          const p2 = shape.points[i + 1];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.stroke();
      }

      if (shape.type === TOOL_TYPES.LINE) {
        const [s, e] = shape.points;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
      }

      if (shape.type === TOOL_TYPES.RECT) {
        const [s, e] = shape.points;
        const w = e.x - s.x;
        const h = e.y - s.y;
        if (shape.filled) {
          ctx.fillRect(s.x, s.y, w, h);
        }
        ctx.strokeRect(s.x, s.y, w, h);
      }

      if (shape.type === TOOL_TYPES.CIRCLE) {
        const [s, e] = shape.points;
        const radius = Math.sqrt((e.x - s.x) ** 2 + (e.y - s.y) ** 2);
        ctx.beginPath();
        ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
        if (shape.filled) {
          ctx.fill();
        }
        ctx.stroke();
      }

      if (shape.type === TOOL_TYPES.POLYGON && shape.points.length > 2) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.closePath();
        if (shape.filled) {
          ctx.fill();
        }
        ctx.stroke();
      }

      if (shape.type === TOOL_TYPES.BEZIER && shape.points.length === 4) {
        const [p0, p1, p2, p3] = shape.points;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.stroke();
      }

      if (shape.type === TOOL_TYPES.TEXT) {
        ctx.font = `${shape.fontSize || 24}px Arial`;
        ctx.fillStyle = shape.color;
        ctx.fillText(shape.text, shape.points[0].x, shape.points[0].y);
      }
    });
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getPosition(e);
    setIsDrawing(true);
    setStartPoint(pos);

    if (tool === TOOL_TYPES.PEN || tool === TOOL_TYPES.ERASER) {
      const strokeColor = tool === TOOL_TYPES.ERASER ? bgColor : color;
      const newShape = {
        type: tool,
        color: strokeColor,
        lineWidth,
        points: [pos],
        layer: currentLayer,
      };
      setShapes((prev) => [...prev, newShape]);
    }

    if (tool === TOOL_TYPES.POLYGON) {
      setPolygonPoints((prev) => [...prev, pos]);
    }

    if (tool === TOOL_TYPES.BEZIER) {
      setBezierPoints((prev) => [...prev, pos]);
      if (bezierPoints.length === 3) {
        const newShape = {
          type: TOOL_TYPES.BEZIER,
          color,
          lineWidth,
          points: [...bezierPoints, pos],
          layer: currentLayer,
        };
        setShapes((prev) => [...prev, newShape]);
        setBezierPoints([]);
        redrawAll(ctx);
      }
    }

    if (tool === TOOL_TYPES.TEXT) {
      const text = prompt('Enter text:');
      if (text) {
        const newShape = {
          type: TOOL_TYPES.TEXT,
          color,
          text,
          fontSize,
          points: [pos],
          layer: currentLayer,
        };
        setShapes((prev) => [...prev, newShape]);
        redrawAll(ctx);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;
    const ctx = canvas.getContext('2d');
    const previewCtx = preview.getContext('2d');
    if (!ctx || !previewCtx) return;

    const pos = getPosition(e);

    if (tool === TOOL_TYPES.PEN || tool === TOOL_TYPES.ERASER) {
      setShapes((prev) => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const last = { ...updated[updated.length - 1] };
        last.points = [...last.points, pos];
        updated[updated.length - 1] = last;
        redrawAll(ctx);
        return updated;
      });
    } else if (startPoint) {
      previewCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      previewCtx.strokeStyle = color;
      previewCtx.fillStyle = fillColor;
      previewCtx.lineWidth = lineWidth;
      previewCtx.setLineDash([5, 5]);

      if (tool === TOOL_TYPES.LINE) {
        previewCtx.beginPath();
        previewCtx.moveTo(startPoint.x, startPoint.y);
        previewCtx.lineTo(pos.x, pos.y);
        previewCtx.stroke();
      }

      if (tool === TOOL_TYPES.RECT) {
        const w = pos.x - startPoint.x;
        const h = pos.y - startPoint.y;
        previewCtx.strokeRect(startPoint.x, startPoint.y, w, h);
      }

      if (tool === TOOL_TYPES.CIRCLE) {
        const radius = Math.sqrt(
          (pos.x - startPoint.x) ** 2 + (pos.y - startPoint.y) ** 2
        );
        previewCtx.beginPath();
        previewCtx.arc(startPoint.x, startPoint.y, radius, 0, Math.PI * 2);
        previewCtx.stroke();
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;
    const ctx = canvas.getContext('2d');
    const previewCtx = preview.getContext('2d');
    if (!ctx || !previewCtx) return;

    const pos = getPosition(e);

    if (
      (tool === TOOL_TYPES.LINE ||
        tool === TOOL_TYPES.RECT ||
        tool === TOOL_TYPES.CIRCLE) &&
      startPoint
    ) {
      const newShape = {
        type: tool,
        color,
        fillColor,
        lineWidth,
        points: [startPoint, pos],
        filled: tool === TOOL_TYPES.RECT || tool === TOOL_TYPES.CIRCLE,
        layer: currentLayer,
      };
      const updated = [...shapes, newShape];
      setShapes(updated);
      redrawAll(ctx);
    }

    previewCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPoint(null);
      const preview = previewRef.current;
      if (preview) {
        const previewCtx = preview.getContext('2d');
        if (previewCtx) {
          previewCtx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
      }
    }
  };

  const finishPolygon = () => {
    if (polygonPoints.length > 2) {
      const newShape = {
        type: TOOL_TYPES.POLYGON,
        color,
        fillColor,
        lineWidth,
        points: polygonPoints,
        filled: true,
        layer: currentLayer,
      };
      setShapes((prev) => [...prev, newShape]);
      setPolygonPoints([]);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) redrawAll(ctx);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setShapes([]);
    setPolygonPoints([]);
    setBezierPoints([]);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    drawGrid(ctx);
  };

  const undoLast = () => {
    const canvas = canvasRef.current;
    if (!canvas || shapes.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const updated = shapes.slice(0, -1);
    setShapes(updated);
    redrawAll(ctx);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `2d-design-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const addLayer = () => {
    const newLayer = {
      id: Date.now(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
    };
    setLayers([...layers, newLayer]);
    setCurrentLayer(newLayer.id);
  };

  const toggleLayerVisibility = (id) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) redrawAll(ctx);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    redrawAll(ctx);
  }, [bgColor, showGrid, gridSize]);

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      if (!container) return;
      const { clientWidth } = container;
      const scaleFactor = clientWidth / canvasWidth;
      setScale(scaleFactor > 1 ? 1 : scaleFactor);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-2 px-4 border-b border-gray-700 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">
              ← Back
            </Link>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ✏️ 2D Design Studio - Blender Style
            </h1>
            <div className="text-xs text-gray-400">
              {shapes.length} objects • Layer: {layers.find(l => l.id === currentLayer)?.name}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={undoLast}
              className="px-3 py-1 rounded text-sm bg-gray-700 hover:bg-gray-600"
            >
              ↶ Undo
            </button>
            <button
              onClick={clearCanvas}
              className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700"
            >
              🗑️ Clear
            </button>
            <button
              onClick={exportImage}
              className="px-3 py-1 rounded text-sm bg-green-600 hover:bg-green-700"
            >
              💾 Export PNG
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-56 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-3 border-r border-gray-700 overflow-y-auto">
          <h2 className="text-sm font-bold mb-3 text-blue-400">🛠️ Tools</h2>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setTool(TOOL_TYPES.SELECT)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.SELECT
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              🖱️ Select
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.PEN)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.PEN
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              ✏️ Pen
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.LINE)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.LINE
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              📏 Line
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.RECT)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.RECT
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              ▭ Rect
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.CIRCLE)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.CIRCLE
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              ◯ Circle
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.POLYGON)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.POLYGON
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              ⬡ Polygon
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.BEZIER)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.BEZIER
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              〰️ Bezier
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.TEXT)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.TEXT
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              🔤 Text
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.FILL)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.FILL
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              🎨 Fill
            </button>
            <button
              onClick={() => setTool(TOOL_TYPES.ERASER)}
              className={`px-2 py-2 rounded text-xs border ${tool === TOOL_TYPES.ERASER
                ? 'bg-blue-600 border-blue-400'
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                }`}
            >
              🧽 Eraser
            </button>
          </div>

          {tool === TOOL_TYPES.POLYGON && polygonPoints.length > 0 && (
            <button
              onClick={finishPolygon}
              className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded mb-3 text-sm"
            >
              ✓ Finish Polygon ({polygonPoints.length} points)
            </button>
          )}

          {tool === TOOL_TYPES.BEZIER && (
            <div className="bg-gray-900 rounded p-2 mb-3 text-xs">
              Bezier: Click 4 points (start, control1, control2, end)
              <div className="text-blue-400 mt-1">{bezierPoints.length}/4 points</div>
            </div>
          )}

          <div className="mb-3 border-t border-gray-700 pt-3">
            <label className="block text-xs text-gray-300 mb-1">
              Stroke Width: {lineWidth}px
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {tool === TOOL_TYPES.TEXT && (
            <div className="mb-3">
              <label className="block text-xs text-gray-300 mb-1">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          <div className="mb-3">
            <label className="block text-xs text-gray-300 mb-2">
              Stroke Color
            </label>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-full h-8 rounded border-2 ${color === c ? 'border-white scale-110' : 'border-gray-600'
                    }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-8 bg-gray-700 rounded cursor-pointer"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-300 mb-2">
              Fill Color
            </label>
            <input
              type="color"
              value={fillColor}
              onChange={(e) => setFillColor(e.target.value)}
              className="w-full h-8 bg-gray-700 rounded cursor-pointer"
            />
          </div>

          <div className="mb-3">
            <label className="block text-xs text-gray-300 mb-2">
              Background
            </label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-full h-8 bg-gray-700 rounded cursor-pointer"
            />
          </div>

          <div className="mb-3 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold mb-2 text-green-400">⚙️ Grid Settings</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs">Show Grid</span>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-1 rounded text-xs ${showGrid ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                {showGrid ? 'ON' : 'OFF'}
              </button>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs">Snap to Grid</span>
              <button
                onClick={() => setSnapToGrid(!snapToGrid)}
                className={`px-2 py-1 rounded text-xs ${snapToGrid ? 'bg-green-600' : 'bg-gray-700'}`}
              >
                {snapToGrid ? 'ON' : 'OFF'}
              </button>
            </div>
            <label className="block text-xs text-gray-300 mb-1">
              Grid Size: {gridSize}px
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="10"
              value={gridSize}
              onChange={(e) => setGridSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

// Canvas Size and Cursor Controls - Insert after line 697 in TwoDDesignStudio.jsx

          <div className="mb-3 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold mb-2 text-yellow-400">📐 Canvas Size</h3>
            
            {/* Preset Sizes */}
            <div className="grid grid-cols-2 gap-1 mb-2">
              <button
                onClick={() => { setCanvasWidth(800); setCanvasHeight(600); }}
                className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600"
              >
                800×600
              </button>
              <button
                onClick={() => { setCanvasWidth(1024); setCanvasHeight(768); }}
                className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600"
              >
                1024×768
              </button>
              <button
                onClick={() => { setCanvasWidth(1400); setCanvasHeight(800); }}
                className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600"
              >
                1400×800
              </button>
              <button
                onClick={() => { setCanvasWidth(1920); setCanvasHeight(1080); }}
                className="px-2 py-1 rounded text-xs bg-gray-700 hover:bg-gray-600"
              >
                1920×1080
              </button>
            </div>
            
            {/* Custom Width */}
            <label className="block text-xs text-gray-300 mb-1">
              Width: {canvasWidth}px
            </label>
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setCanvasWidth(Math.max(400, canvasWidth - 100))}
                className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700"
              >
                -
              </button>
              <input
                type="range"
                min="400"
                max="2400"
                step="100"
                value={canvasWidth}
                onChange={(e) => setCanvasWidth(Number(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={() => setCanvasWidth(Math.min(2400, canvasWidth + 100))}
                className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700"
              >
                +
              </button>
            </div>
            
            {/* Custom Height */}
            <label className="block text-xs text-gray-300 mb-1">
              Height: {canvasHeight}px
            </label>
            <div className="flex gap-1 mb-2">
              <button
                onClick={() => setCanvasHeight(Math.max(300, canvasHeight - 100))}
                className="px-2 py-1 rounded text-xs bg-red-600 hover:bg-red-700"
              >
                -
              </button>
              <input
                type="range"
                min="300"
                max="1800"
                step="100"
                value={canvasHeight}
                onChange={(e) => setCanvasHeight(Number(e.target.value))}
                className="flex-1"
              />
              <button
                onClick={() => setCanvasHeight(Math.min(1800, canvasHeight + 100))}
                className="px-2 py-1 rounded text-xs bg-green-600 hover:bg-green-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3 border-t border-gray-700 pt-3">
            <h3 className="text-xs font-bold mb-2 text-pink-400">🖱️ Cursor Style</h3>
            <select
              value={cursorStyle}
              onChange={(e) => setCursorStyle(e.target.value)}
              className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs border border-gray-600"
            >
              <option value="crosshair">Crosshair</option>
              <option value="pointer">Pointer</option>
              <option value="default">Default</option>
              <option value="move">Move</option>
              <option value="cell">Cell</option>
              <option value="text">Text</option>
              <option value="grab">Grab</option>
              <option value="none">None</option>
            </select>
          </div>




          <div className="border-t border-gray-700 pt-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-purple-400">📚 Layers</h3>
              <button
                onClick={addLayer}
                className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
              >
                + Add
              </button>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setCurrentLayer(layer.id)}
                  className={`p-2 rounded cursor-pointer flex items-center justify-between text-xs ${currentLayer === layer.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                >
                  <span>{layer.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLayerVisibility(layer.id);
                    }}
                    className="text-xs"
                  >
                    {layer.visible ? '👁️' : '🚫'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area - Much Larger */}
        <div className="flex-1 bg-gray-900 flex items-center justify-center p-4">
          <div
            ref={containerRef}
            className="relative bg-gray-800 rounded-lg shadow-2xl overflow-hidden w-full"
          >
            <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between text-xs text-gray-300">
              <span>
                Canvas ({canvasWidth} × {canvasHeight} px)
              </span>
              <span>Zoom: {Math.round(scale * 100)}%</span>
            </div>
            <div className="relative w-full overflow-hidden">
              <div
                className="relative origin-top-left"
                style={{
                  width: canvasWidth,
                  height: canvasHeight,
                  transform: `scale(${scale})`,
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  className="absolute top-0 left-0"
                  style={{ cursor: cursorStyle }}
                />
                <canvas
                  ref={previewRef}
                  width={canvasWidth}
                  height={canvasHeight}
                  className="absolute top-0 left-0 pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoDDesignStudio;
