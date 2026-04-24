import React, { useState, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ACTIONS } from "../Constants";

const Whiteboard = ({ socketRef, roomId, onPathsChange, initialPaths }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const isUpdatingFromSocket = useRef(false);
  const updateTimeoutRef = useRef(null);
  const [strokeColor, setStrokeColor] = useState("#a5b4fc");

  const lastVersion = useRef(0);

  const getElementsVersion = (elements) => {
    if (!elements) return 0;
    let sum = 0;
    for (let i = 0; i < elements.length; i++) {
      sum += elements[i].version || 0;
    }
    return sum + elements.length;
  };

  const emitTimeoutRef = useRef(null);
  const lastEmitTime = useRef(0);
  const THROTTLE_MS = 100;

  const pendingPathsRef = useRef(null);
  const onPathsChangeRef = useRef(onPathsChange);

  useEffect(() => {
    onPathsChangeRef.current = onPathsChange;
  }, [onPathsChange]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const handleDrawing = ({ paths }) => {
      if (Array.isArray(paths)) {
        if (!excalidrawAPI) {
          // API not ready, store pending paths
          pendingPathsRef.current = paths;
          return;
        }

        isUpdatingFromSocket.current = true;
        
        if (onPathsChangeRef.current) {
          onPathsChangeRef.current(paths);
        }
        
        excalidrawAPI.updateScene({ elements: paths, commitToHistory: false });
        
        if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = setTimeout(() => {
          isUpdatingFromSocket.current = false;
        }, 100);
      }
    };

    socket.on(ACTIONS.DRAWING, handleDrawing);

    return () => {
      socket.off(ACTIONS.DRAWING, handleDrawing);
    };
  }, [socketRef, excalidrawAPI]);

  useEffect(() => {
    if (excalidrawAPI && pendingPathsRef.current) {
      const paths = pendingPathsRef.current;
      pendingPathsRef.current = null;
      
      isUpdatingFromSocket.current = true;
      if (onPathsChangeRef.current) onPathsChangeRef.current(paths);

      excalidrawAPI.updateScene({ elements: paths, commitToHistory: false });
      
      if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = setTimeout(() => {
        isUpdatingFromSocket.current = false;
      }, 100);
    }
  }, [excalidrawAPI]);

  const handleChange = (elements, appState) => {
    if (isUpdatingFromSocket.current) return;
    
    if (onPathsChangeRef.current) {
      onPathsChangeRef.current(elements);
    }

    if (socketRef.current) {
      const now = Date.now();
      if (now - lastEmitTime.current >= THROTTLE_MS) {
        socketRef.current.emit(ACTIONS.DRAWING, { roomId, paths: elements });
        lastEmitTime.current = now;
      } else {
        if (emitTimeoutRef.current) clearTimeout(emitTimeoutRef.current);
        emitTimeoutRef.current = setTimeout(() => {
          socketRef.current.emit(ACTIONS.DRAWING, { roomId, paths: elements });
          lastEmitTime.current = Date.now();
        }, THROTTLE_MS);
      }
    }
  };

  const handleStrokeColorChange = (e) => {
    const color = e.target.value;
    setStrokeColor(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({ appState: { currentItemStrokeColor: color } });
    }
  };

  return (
    <div className="d-flex flex-column h-100 bg-dark border-start border-secondary whiteboard-container">
      <style>
        {`
          /* Hide Excalidraw top taskbars and default tools */
          .whiteboard-container .excalidraw .layer-ui__wrapper .App-menu_top,
          .whiteboard-container .excalidraw .layer-ui__wrapper header {
            display: none !important;
          }
          /* Custom scrollbar hiding */
          .custom-toolbar::-webkit-scrollbar {
            display: none;
          }
          .custom-toolbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>
      {/* Custom Top Horizontal Toolbar */}
      <div className="d-flex flex-row align-items-center p-2 bg-dark border-bottom border-secondary position-relative custom-toolbar w-100" style={{ zIndex: 10, overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
        <div className="d-flex align-items-center flex-shrink-0 ms-2">
          <label className="text-secondary me-2 mb-0" style={{ fontSize: "0.8rem" }}>Color</label>
          <input 
            type="color" 
            value={strokeColor} 
            onChange={handleStrokeColorChange} 
            className="form-control form-control-color p-0 border-0"
            style={{ width: "28px", height: "28px", cursor: "pointer" }}
            title="Stroke Color"
          />
        </div>
      </div>

      <div className="flex-grow-1 position-relative" style={{ minHeight: "600px", zIndex: 1 }}>
        <Excalidraw
          excalidrawAPI={(api) => setExcalidrawAPI(api)}
          onChange={handleChange}
          zenModeEnabled={true}
          viewModeEnabled={false}
          initialData={{
            elements: initialPaths && initialPaths.length > 0 ? initialPaths : [],
            appState: { 
              theme: "dark", 
              viewBackgroundColor: "#1e1e1e",
              currentItemStrokeColor: strokeColor,
              activeTool: { type: "freedraw", customType: null }
            },
          }}
        />
      </div>
    </div>
  );
};

export default Whiteboard;
