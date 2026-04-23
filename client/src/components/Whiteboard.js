import React, { useState, useEffect, useRef } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import { ACTIONS } from "../Constants";

const Whiteboard = ({ socketRef, roomId, onPathsChange, initialPaths }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const isUpdatingFromSocket = useRef(false);
  const [activeTool, setActiveTool] = useState("freedraw");
  const [strokeColor, setStrokeColor] = useState("#a5b4fc");

  useEffect(() => {
    if (socketRef.current && excalidrawAPI) {
      socketRef.current.on(ACTIONS.DRAWING, ({ paths }) => {
        if (paths && paths.length > 0) {
          isUpdatingFromSocket.current = true;
          excalidrawAPI.updateScene({ elements: paths });
          setTimeout(() => { isUpdatingFromSocket.current = false; }, 100);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.DRAWING);
      }
    };
  }, [socketRef, excalidrawAPI]);

  const handleChange = (elements, appState) => {
    if (isUpdatingFromSocket.current) return;
    
    if (onPathsChange) {
      onPathsChange(elements);
    }

    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.DRAWING, { roomId, paths: elements });
    }
  };

  const setTool = (tool) => {
    setActiveTool(tool);
    if (excalidrawAPI) {
      const targetTool = tool === 'highlighter' ? 'freedraw' : tool;
      
      // Attempt to use the explicit setActiveTool method if it exists
      if (typeof excalidrawAPI.setActiveTool === 'function') {
        excalidrawAPI.setActiveTool({ type: targetTool });
      } else {
        // Fallback for older versions
        excalidrawAPI.updateScene({ appState: { activeTool: { type: targetTool, customType: null } } });
      }
      
      // Update specific styling properties based on the tool
      if (tool === 'highlighter') {
        excalidrawAPI.updateScene({ appState: { currentItemOpacity: 40, currentItemStrokeWidth: 6 } });
      } else if (tool === 'freedraw') {
        excalidrawAPI.updateScene({ appState: { currentItemOpacity: 100, currentItemStrokeWidth: 2 } });
      }
    }
  };

  const handleUndo = () => {
    if (excalidrawAPI && excalidrawAPI.actionManager) {
      excalidrawAPI.actionManager.executeAction("undo");
    }
  };

  const handleRedo = () => {
    if (excalidrawAPI && excalidrawAPI.actionManager) {
      excalidrawAPI.actionManager.executeAction("redo");
    }
  };

  const handleStrokeColorChange = (e) => {
    const color = e.target.value;
    setStrokeColor(color);
    if (excalidrawAPI) {
      excalidrawAPI.updateScene({ appState: { currentItemStrokeColor: color } });
    }
  };



  const ToolBtn = ({ tool, icon, label }) => (
    <button
      className={`btn btn-sm mb-2 w-100 ${activeTool === tool ? "btn-primary" : "btn-outline-secondary text-light"}`}
      onClick={() => setTool(tool)}
      title={label}
      style={{ fontSize: "1.2rem", padding: "0.4rem 0" }}
    >
      {icon}
    </button>
  );



  return (
    <div className="d-flex h-100 bg-dark border-start border-secondary whiteboard-container">
      <style>
        {`
          /* Hide Excalidraw top taskbars and default tools */
          .whiteboard-container .excalidraw .layer-ui__wrapper .App-menu_top,
          .whiteboard-container .excalidraw .layer-ui__wrapper header {
            display: none !important;
          }
        `}
      </style>
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
            },
          }}
        />
      </div>
      
      {/* Custom Right Vertical Toolbar */}
      <div className="d-flex flex-column align-items-center p-2 bg-dark border-start border-secondary position-relative" style={{ width: "60px", zIndex: 10 }}>
        <div className="mb-3 text-info fw-bold" style={{ fontSize: "0.7rem", textAlign: "center", marginTop: "10px" }}>Tools</div>
        
        <ToolBtn tool="freedraw" icon="✏️" label="Pen" />
        <ToolBtn tool="highlighter" icon="🖍️" label="Highlighter" />
        <ToolBtn tool="eraser" icon="🧼" label="Eraser" />
        
        <hr className="w-100 border-secondary my-1" />
        
        <button
          className="btn btn-sm mb-2 w-100 btn-outline-secondary text-light"
          onClick={handleUndo}
          title="Undo"
          style={{ fontSize: "1.2rem", padding: "0.4rem 0" }}
        >
          ↩️
        </button>
        <button
          className="btn btn-sm mb-2 w-100 btn-outline-secondary text-light"
          onClick={handleRedo}
          title="Redo"
          style={{ fontSize: "1.2rem", padding: "0.4rem 0" }}
        >
          ↪️
        </button>

        <hr className="w-100 border-secondary my-1" />
        
        <div className="mb-2 w-100 text-center">
          <label className="text-secondary" style={{ fontSize: "0.6rem", marginBottom: "2px" }}>Color</label>
          <input 
            type="color" 
            value={strokeColor} 
            onChange={handleStrokeColorChange} 
            className="form-control form-control-color p-0 border-0 mx-auto"
            style={{ width: "24px", height: "24px", cursor: "pointer" }}
            title="Stroke Color"
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
