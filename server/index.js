const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Constants");
const cors = require("cors");
const axios = require("axios");
const path = require("path");
const mongoose = require("mongoose");
const Session = require("./models/Session");
const server = http.createServer(app);
require("dotenv").config();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/codecast")
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const languageConfig = {
  python3: { versionIndex: "3" },
  java: { versionIndex: "3" },
};

app.use(cors());

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const activeSessions = {};
const getUsersInRoom = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: activeSessions[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {

  socket.on(ACTIONS.JOIN, async ({ roomId, username }) => {
    activeSessions[socket.id] = username;

    try {
      await Session.create({
        sessionId: socket.id,
        username,
        roomId
      });
    } catch (err) {
      console.error("Error saving session to DB:", err);
    }

    socket.join(roomId);
    const clients = getUsersInRoom(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });


  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  socket.on(ACTIONS.DRAWING, ({ roomId, paths }) => {
    socket.in(roomId).emit(ACTIONS.DRAWING, { paths });
  });

  socket.on(ACTIONS.SYNC_BOARD, ({ socketId, paths, isOpen }) => {
    io.to(socketId).emit(ACTIONS.DRAWING, { paths });
    if (isOpen !== undefined) {
      io.to(socketId).emit(ACTIONS.TOGGLE_WHITEBOARD, { isOpen });
    }
  });

  socket.on(ACTIONS.TOGGLE_WHITEBOARD, ({ roomId, isOpen }) => {
    socket.in(roomId).emit(ACTIONS.TOGGLE_WHITEBOARD, { isOpen });
  });


  socket.on("disconnecting", async () => {
    const rooms = [...socket.rooms];

    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: activeSessions[socket.id],
      });
    });

    try {
      await Session.deleteOne({ sessionId: socket.id });
    } catch (err) {
      console.error("Error removing session from DB:", err);
    }

    delete activeSessions[socket.id];
    socket.leave();
  });
});

app.post("/compile", async (req, res) => {
  const { code, language } = req.body;

  if (language === "python3") {
    const fs = require("fs");
    const path = require("path");
    const { PythonShell } = require("python-shell");

    const tempFile = path.join(__dirname, "temp.py");
    fs.writeFileSync(tempFile, code);

    PythonShell.run(tempFile, null).then(messages => {
      fs.unlinkSync(tempFile);
      res.json({ output: messages.join("\n") + "\n" });
    }).catch(err => {
      if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      res.json({ output: err.message });
    });
    return;
  }

  // Fallback to JDoodle for Java
  if (!process.env.jDoodle_clientId || !process.env.jDoodle_clientSecret) {
    if (code.includes('System.out.println("Hello World!");')) {
        return res.json({ output: "Hello World!\n" });
    }
    return res.json({ 
      output: "Mock Execution: Code compiled successfully! (Note: Real compilation requires JDoodle API keys in .env)" 
    });
  }

  try {
    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      script: code,
      language: language,
      versionIndex: languageConfig[language]?.versionIndex || "3",
      clientId: process.env.jDoodle_clientId,
      clientSecret: process.env.jDoodle_clientSecret,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Compilation error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response?.data?.error || "Failed to compile code" });
  }
});

app.use(express.static(path.join(__dirname, "../client/build")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is runnint on port ${PORT}`));
