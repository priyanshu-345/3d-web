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
