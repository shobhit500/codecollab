import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import Whiteboard from "./Whiteboard";
import { initSocket } from "../Socket";
import { ACTIONS } from "../Constants";
import {
  useNavigate,
  useLocation,
  Navigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";


const LANGUAGES = [
  "python3",
  "java",
];

const BOILERPLATES = {
  python3: `print("Hello World!")`,
  java: `public class MyClass {\n    public static void main(String args[]) {\n        System.out.println("Hello World!");\n    }\n}`
};

function EditorPage() {
  const [clients, setClients] = useState([]);
  const [output, setOutput] = useState("");
  const [isCompileWindowOpen, setIsCompileWindowOpen] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python3");
  const codeRef = useRef(null);
  const pathsRef = useRef([]);
  const [isSocketInitialized, setIsSocketInitialized] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(true);

  // Resizing state
  const [whiteboardWidth, setWhiteboardWidth] = useState(400);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const isDragging = useRef(false);

  const handleMouseMove = useRef((e) => {
    if (!isDragging.current) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 200 && newWidth <= window.innerWidth * 0.8) {
      setWhiteboardWidth(newWidth);
    }
  }).current;

  const handleMouseUp = useRef(() => {
    if (isDragging.current) {
      isDragging.current = false;
      setIsDraggingState(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'default';
    }
  }).current;

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    setIsDraggingState(true);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = 'col-resize';
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [handleMouseMove, handleMouseUp]);

  const Location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();

  const socketRef = useRef(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      setIsSocketInitialized(true);
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          if (socketId !== socketRef.current.id) {
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
            socketRef.current.emit(ACTIONS.SYNC_BOARD, {
              paths: pathsRef.current,
              isOpen: isWhiteboardOpen,
              socketId,
            });
          }
          setClients(clients);
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
      socketRef.current.on(ACTIONS.TOGGLE_WHITEBOARD, ({ isOpen }) => {
        setIsWhiteboardOpen(isOpen);
      });
    };
    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.off(ACTIONS.TOGGLE_WHITEBOARD);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room ID is copied`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  const runCode = async () => {
    setIsCompiling(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || window.location.origin;
      const response = await axios.post(`${backendUrl}/compile`, {
        code: codeRef.current,
        language: selectedLanguage,
      });
      console.log("Backend response:", response.data);
      setOutput(response.data.output || JSON.stringify(response.data));
    } catch (error) {
      console.error("Error compiling code:", error);
      setOutput(error.response?.data?.error || "An error occurred");
    } finally {
      setIsCompiling(false);
    }
  };

  const toggleCompileWindow = () => {
    setIsCompileWindowOpen(!isCompileWindowOpen);
  };

  const toggleWhiteboard = () => {
    const newState = !isWhiteboardOpen;
    setIsWhiteboardOpen(newState);
    if (socketRef.current) {
      socketRef.current.emit(ACTIONS.TOGGLE_WHITEBOARD, { roomId, isOpen: newState });
    }
  };

  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column overflow-hidden">
      <div className="d-flex flex-md-row flex-column flex-grow-1 overflow-hidden">

        <div className="col-md-2 bg-dark text-light d-flex flex-column border-end border-secondary" style={{ zIndex: 2 }}>
          <img
            src="/images/codecollab.png"
            alt="CodeCollab Logo"
            className="img-fluid mx-auto"
            style={{ maxWidth: "150px", marginTop: "1rem" }}
          />
          <hr style={{ marginTop: "-3rem" }} />


          <div className="d-flex flex-column flex-grow-1 overflow-auto">
            <span className="mb-2">Members</span>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>

          <hr />

          <div className="mt-auto mb-3">
            <button className="btn btn-success w-100 mb-2" onClick={copyRoomId}>
              Copy Room ID
            </button>
            <button className="btn btn-danger w-100" onClick={leaveRoom}>
              Leave Room
            </button>
          </div>
        </div>

        <div className="text-light d-flex flex-column p-0 flex-grow-1" style={{ transition: isDraggingState ? 'none' : 'all 0.3s', minWidth: '300px' }}>

          <div className="bg-dark p-2 d-flex justify-content-between align-items-center border-bottom border-secondary">
            <button 
              className={`btn btn-sm ${isWhiteboardOpen ? 'btn-outline-danger' : 'btn-outline-info'}`}
              onClick={toggleWhiteboard}
            >
              {isWhiteboardOpen ? "Close Whiteboard" : "Open Whiteboard"}
            </button>
            <select
              className="form-select w-auto"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-grow-1 overflow-hidden">
            {isSocketInitialized && (
              <Editor
                socketRef={socketRef}
                roomId={roomId}
                onCodeChange={(code) => {
                  codeRef.current = code;
                }}
                language={selectedLanguage}
                boilerplate={BOILERPLATES[selectedLanguage]}
                allBoilerplates={Object.values(BOILERPLATES)}
              />
            )}
          </div>
          
          {/* Compiler Toggle Button placed within Editor column */}
          <div className="bg-dark p-2 border-top border-secondary d-flex justify-content-end">
            <button
              className="btn btn-primary btn-sm"
              onClick={toggleCompileWindow}
            >
              {isCompileWindowOpen ? "Close Compiler" : "Open Compiler"}
            </button>
          </div>
        </div>

        {isWhiteboardOpen && (
          <div 
            onMouseDown={handleMouseDown}
            style={{
              width: "6px",
              cursor: "col-resize",
              backgroundColor: "#2c2e33",
              borderLeft: "1px solid #444",
              borderRight: "1px solid #444",
              zIndex: 10
            }}
            className="resizer-handle d-none d-md-block"
            title="Drag to resize"
          />
        )}

        {isWhiteboardOpen && (
          <div className="p-0" style={{ 
            width: `${whiteboardWidth}px`, 
            transition: isDraggingState ? 'none' : 'width 0.3s', 
            minWidth: '200px',
            flexShrink: 0
          }}>
            {isSocketInitialized && (
              <Whiteboard 
                socketRef={socketRef} 
                roomId={roomId} 
                onPathsChange={(paths) => { pathsRef.current = paths; }} 
                initialPaths={pathsRef.current}
              />
            )}
          </div>
        )}
      </div>

      {/* Compiler Output Window */}
      <div
        className={`bg-dark text-light p-3 ${
          isCompileWindowOpen ? "d-block" : "d-none"
        }`}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: isCompileWindowOpen ? "30vh" : "0",
          transition: "height 0.3s ease-in-out",
          overflowY: "auto",
          zIndex: 1040,
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="m-0">Compiler Output ({selectedLanguage})</h5>
          <div>
            <button
              className="btn btn-success me-2"
              onClick={runCode}
              disabled={isCompiling}
            >
              {isCompiling ? "Compiling..." : "Run Code"}
            </button>
            <button className="btn btn-secondary" onClick={toggleCompileWindow}>
              Close
            </button>
          </div>
        </div>
        <pre className="bg-secondary p-3 rounded">
          {output || "Output will appear here after compilation"}
        </pre>
      </div>
    </div>
  );
}

export default EditorPage;
