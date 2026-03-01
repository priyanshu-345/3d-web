import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';

/**
 * Detect WebGL support once and cache the result.
 */
let _webglResult = null;
function isWebGLAvailable() {
  if (_webglResult !== null) return _webglResult;
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    _webglResult = !!gl;
  } catch {
    _webglResult = false;
  }
  return _webglResult;
}

/**
 * Beautiful CSS fallback shown when WebGL is not available.
 * Adapts its message based on the `fallbackLabel` prop.
 */
const WebGLFallback = ({ label = '3D View', className = '', style = {} }) => (
  <div
    className={`relative w-full h-full min-h-[200px] overflow-hidden ${className}`}
    style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      ...style,
    }}
  >
    {/* Animated gradient orbs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '45%', height: '45%', top: '10%', left: '15%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)',
          animation: 'sfOrb1 8s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl"
        style={{
          width: '40%', height: '40%', bottom: '10%', right: '10%',
          background: 'radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)',
          animation: 'sfOrb2 10s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: '30%', height: '30%', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)',
          animation: 'sfOrb3 7s ease-in-out infinite alternate',
        }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: ['#6366f1','#a855f7','#3b82f6','#ec4899','#fff'][i % 5],
            opacity: 0.25 + Math.random() * 0.4,
            animation: `sfParticle ${4 + Math.random() * 5}s ease-in-out infinite alternate`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
    </div>

    {/* Centred label */}
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center px-4">
      <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <p className="text-white/60 text-sm font-medium tracking-wide">{label}</p>
        <p className="text-white/30 text-xs mt-1">WebGL not available – using visual fallback</p>
      </div>
    </div>

    <style>{`
      @keyframes sfOrb1  { from{transform:translate(0,0) scale(1)}  to{transform:translate(30px,-20px) scale(1.12)} }
      @keyframes sfOrb2  { from{transform:translate(0,0) scale(1)}  to{transform:translate(-25px,15px) scale(1.08)} }
      @keyframes sfOrb3  { from{transform:translate(-50%,-50%) scale(1)} to{transform:translate(-50%,-50%) scale(1.18)} }
      @keyframes sfParticle { from{transform:translateY(0) scale(1);opacity:.25} to{transform:translateY(-16px) scale(1.3);opacity:.75} }
    `}</style>
  </div>
);

/**
 * SafeCanvas — drop-in replacement for `<Canvas>` from @react-three/fiber.
 *
 * Usage:  import SafeCanvas from '../components/SafeCanvas';
 *         <SafeCanvas fallbackLabel="Room Editor" ...canvasProps>
 *           <mesh>...</mesh>
 *         </SafeCanvas>
 *
 * All standard Canvas props are forwarded when WebGL is available.
 */
const SafeCanvas = ({ children, fallbackLabel, fallbackClassName, fallbackStyle, ...canvasProps }) => {
  const webgl = useMemo(() => isWebGLAvailable(), []);

  if (!webgl) {
    return (
      <WebGLFallback
        label={fallbackLabel}
        className={fallbackClassName}
        style={fallbackStyle}
      />
    );
  }

  return <Canvas {...canvasProps}>{children}</Canvas>;
};

export default SafeCanvas;
export { isWebGLAvailable, WebGLFallback };
