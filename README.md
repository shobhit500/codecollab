# CodeCollab - Collaborative Code Editor

CodeCollab is a powerful real-time code collaboration environment. It empowers teams to work together seamlessly in a shared virtual workspace. Built on the **ERN stack (Express.js, React, Node.js)** with **Socket.IO** providing low-latency, real-time synchronization.

## Features

- **Real-Time Synchronization**: Changes appear instantly for all users connected to the same room.
- **Room System**: Generate unique room IDs and share them with teammates to collaborate securely.
- **Syntax Highlighting**: Enhanced code readability with intelligent syntax highlighting using CodeMirror.
- **User Presence**: See exactly who is in the room with you and track their activity.

## Tech Stack

**Client:**
- React.js
- CodeMirror
- Socket.IO Client

**Server:**
- Node.js
- Express.js
- Socket.IO Configuration

## Local Development Setup

To run CodeCollab locally on your own machine:

1. **Clone your repository:**
   ```bash
   git clone <your-repository-url>
   cd codecollab
   ```

2. **Start the server:**
   Navigate to the server directory, install dependencies, and start the node server.
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Start the client:**
   In a separate terminal, navigate to the client directory, install dependencies, and start the React app.
   ```bash
   cd client
   npm install
   npm start
   ```

## Getting Started
Once both servers are running, the application will typically be available at `http://localhost:3000`. Simply create a room and share the Room ID with your peers to begin!
