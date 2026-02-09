import React, { useState, useEffect, useRef } from 'react';

/**
 * 3D Isometric Canvas Renderer - Software-based 3D rendering without WebGL
 * Uses 3D projection mathematics to render on 2D canvas
 */
function Canvas3DIsometric({ furniture = [], roomDimensions = [10, 3, 10], wallColor = '#8B7355', floorColor = '#D2B48C', ceilingColor = '#CCCCCC', rotation = { x: 0.5, y: 0.5, z: 0 } }) {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(0);

  // 3D to 2D isometric projection
  const project3D = (x, y, z, scale = 40) => {
    // Apply rotation
    const cos_x = Math.cos(rotation.x);
    const sin_x = Math.sin(rotation.x);
    const cos_y = Math.cos(rotation.y);
    const sin_y = Math.sin(rotation.y);
    const cos_z = Math.cos(rotation.z);
    const sin_z = Math.sin(rotation.z);

    // Rotate around X axis
    let y1 = y * cos_x - z * sin_x;
    let z1 = y * sin_x + z * cos_x;

    // Rotate around Y axis
    let x1 = x * cos_y + z1 * sin_y;
    let z2 = -x * sin_y + z1 * cos_y;

    // Rotate around Z axis
    let x2 = x1 * cos_z - y1 * sin_z;
    let y2 = x1 * sin_z + y1 * cos_z;

    // Isometric projection
    const screenX = (x2 - y2) * scale;
    const screenY = (x2 + y2) * 0.5 * scale - z2 * scale;

    return { x: screenX, y: screenY, z: z2 };
  };

  const drawCube = (ctx, x, y, z, w, h, d, color, alpha = 1) => {
    const scale = 40;
    
    // Define cube vertices in 3D
    const vertices = [
      // Front face
      { x: x - w/2, y: y, z: z - d/2 },
      { x: x + w/2, y: y, z: z - d/2 },
      { x: x + w/2, y: y + h, z: z - d/2 },
      { x: x - w/2, y: y + h, z: z - d/2 },
      // Back face
      { x: x - w/2, y: y, z: z + d/2 },
      { x: x + w/2, y: y, z: z + d/2 },
      { x: x + w/2, y: y + h, z: z + d/2 },
      { x: x - w/2, y: y + h, z: z + d/2 },
    ];

    // Project all vertices
    const projected = vertices.map(v => project3D(v.x, v.y, v.z, scale));

    // Draw faces
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;

    // Top face (roof)
    ctx.beginPath();
    ctx.moveTo(projected[3].x, projected[3].y);
    ctx.lineTo(projected[2].x, projected[2].y);
    ctx.lineTo(projected[6].x, projected[6].y);
    ctx.lineTo(projected[7].x, projected[7].y);
    ctx.closePath();
    ctx.fillStyle = adjustColor(color, 20);
    ctx.fill();
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Front face
    ctx.beginPath();
    ctx.moveTo(projected[0].x, projected[0].y);
    ctx.lineTo(projected[1].x, projected[1].y);
    ctx.lineTo(projected[2].x, projected[2].y);
    ctx.lineTo(projected[3].x, projected[3].y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(projected[1].x, projected[1].y);
    ctx.lineTo(projected[5].x, projected[5].y);
    ctx.lineTo(projected[6].x, projected[6].y);
    ctx.lineTo(projected[2].x, projected[2].y);
    ctx.closePath();
    ctx.fillStyle = adjustColor(color, -15);
    ctx.fill();
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  const adjustColor = (color, amount) => {
    let usePound = false;
    if (color[0] === '#') {
      color = color.slice(1);
      usePound = true;
    }
    const num = parseInt(color, 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return (usePound ? '#' : '') + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#2a2a4e');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);

    // Draw floor
    drawCube(ctx, 0, 0, 0, roomDimensions[0], 0.1, roomDimensions[2], floorColor, 0.9);

    // Draw walls
    // Back wall
    drawCube(ctx, 0, roomDimensions[1] / 2, -roomDimensions[2] / 2, roomDimensions[0], roomDimensions[1], 0.1, wallColor, 0.8);
    
    // Left wall
    drawCube(ctx, -roomDimensions[0] / 2, roomDimensions[1] / 2, 0, 0.1, roomDimensions[1], roomDimensions[2], wallColor, 0.8);
    
    // Right wall
    drawCube(ctx, roomDimensions[0] / 2, roomDimensions[1] / 2, 0, 0.1, roomDimensions[1], roomDimensions[2], adjustColor(wallColor, -10), 0.8);

    // Draw ceiling
    drawCube(ctx, 0, roomDimensions[1], 0, roomDimensions[0], 0.1, roomDimensions[2], ceilingColor, 0.7);

    // Draw furniture
    furniture.forEach((item) => {
      const furnitureHeight = {
        sofa: 0.8, table: 0.4, chair: 1, bed: 0.5,
        cabinet: 1.5, lamp: 1.5, tv: 0.9, plant: 0.8
      }[item.type] || 0.5;

      const furnitureSize = {
        sofa: { w: 2, d: 0.9 }, table: { w: 1.2, d: 0.8 },
        chair: { w: 0.6, d: 0.6 }, bed: { w: 2, d: 1.8 },
        cabinet: { w: 1, d: 0.5 }, lamp: { w: 0.2, d: 0.2 },
        tv: { w: 1.5, d: 0.1 }, plant: { w: 0.4, d: 0.4 }
      }[item.type] || { w: 1, d: 1 };

      drawCube(
        ctx,
        item.position[0],
        item.position[1],
        item.position[2],
        furnitureSize.w * item.scale[0],
        furnitureHeight * item.scale[1],
        furnitureSize.d * item.scale[2],
        item.color || '#cccccc',
        0.9
      );
    });

    ctx.restore();
  }, [furniture, roomDimensions, wallColor, floorColor, ceilingColor, rotation]);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setAngle(prev => (prev + 0.01) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border-2 border-gray-600 rounded bg-gray-950 w-full"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}

/**
 * Wrapper component that handles WebGL context creation errors
 * Provides a 3D software rendering when WebGL is not available
 */
export function CanvasWrapper({ children, furniture = [], roomDimensions = [10, 3, 10], wallColor = '#8B7355', floorColor = '#D2B48C', ceilingColor = '#CCCCCC' }) {
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [error, setError] = useState(null);
  const [use3DFallback, setUse3DFallback] = useState(false);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
      
      if (!gl) {
        setWebglAvailable(false);
        setError('WebGL is not available in your browser/environment');
        setUse3DFallback(true); // Auto-switch to 3D fallback
      }
    } catch (err) {
      setWebglAvailable(false);
      setError(err.message);
      setUse3DFallback(true);
    }

    // Listen for WebGL errors
    const handleError = (event) => {
      if (event.message && event.message.includes('WebGL')) {
        setWebglAvailable(false);
        setError(event.message);
        setUse3DFallback(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (!webglAvailable && use3DFallback) {
    return (
      <div className="w-full h-full bg-gray-900 p-2 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full">
            <Canvas3DIsometric 
              furniture={furniture} 
              roomDimensions={roomDimensions}
              wallColor={wallColor}
              floorColor={floorColor}
              ceilingColor={ceilingColor}
              rotation={{ x: 0.7, y: 0.5, z: 0 }}
            />
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 py-1 bg-gray-800 rounded">
          🎨 3D Software Renderer (No WebGL) | Left panel to edit furniture
        </div>
      </div>
    );
  }

  return children;
}

/**
 * Higher-order component to wrap Canvas components with error handling
 */
export function withCanvasErrorBoundary(Component) {
  return function CanvasErrorBoundaryWrapper(props) {
    const [error, setError] = useState(null);

    useEffect(() => {
      const handleError = (event) => {
        if (
          event.message &&
          (event.message.includes('WebGL') ||
            event.message.includes('3D') ||
            event.message.includes('Context'))
        ) {
          setError(event.message);
        }
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);

    if (error) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-8 bg-gray-800 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">❌ Rendering Error</h2>
            <p className="text-gray-300 mb-4">
              An error occurred while rendering the 3D scene:
            </p>
            <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded font-mono overflow-auto max-h-32">
              {error}
            </p>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
