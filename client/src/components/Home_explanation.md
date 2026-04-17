# Home.js Component Explanation

This document explains the code and functionality of the `Home.js` component found in `client/src/components/Home.js` of the CodeCollab project.

---

## Purpose
This component renders the landing page where users can:
- Enter a Room ID and Username to join a collaborative coding room
- Generate a new Room ID

---

## Key Features
- **Room ID and Username Inputs:**
  - Controlled input fields for the user to enter a room ID and username.
- **Room ID Generation:**
  - Users can click "New Room" to generate a random 6-character room ID.
- **Join Room:**
  - Users can join a room by clicking the JOIN button or pressing Enter.
  - If either field is empty, an error notification is shown.
  - On success, navigates to the editor page for the room, passing the username.
- **Notifications:**
  - Uses `react-hot-toast` to show success or error messages.
- **Styling:**
  - Uses Bootstrap classes for responsive and modern UI.

---

## Code Walkthrough

### Imports
- `useState` (React): For managing form state.
- `toast` (react-hot-toast): For notifications.
- `useNavigate` (react-router-dom): For navigation between pages.

### State
- `roomId`: Stores the current value of the Room ID input.
- `username`: Stores the current value of the Username input.

### Functions
- `generateRoomId(e)`: Prevents default form action, generates a random 6-character string, sets it as the Room ID, and shows a success toast.
- `joinRoom()`: Checks if both Room ID and Username are filled. If not, shows an error toast. If yes, navigates to `/editor/{roomId}` and passes the username in state, then shows a success toast.
- `handleInputEnter(e)`: If the Enter key is pressed, calls `joinRoom()`.

### JSX Structure
- **Container:** Centered card using Bootstrap grid and utility classes.
- **Logo:** Displays the app logo at the top.
- **Title:** "Enter the ROOM ID".
- **Inputs:**
  - Room ID input (with onChange and onKeyUp handlers)
  - Username input (with onChange and onKeyUp handlers)
- **Join Button:** Calls `joinRoom()` on click.
- **New Room Link:** Calls `generateRoomId()` on click.

---

## Summary
The `Home.js` component is the entry point for users to join or create a collaborative coding session. It handles user input, validation, navigation, and provides a user-friendly interface with helpful notifications.

---

**File Location:**
```
client/src/components/Home.js
```

**Related UI:**
This component matches the join/create room page shown in your screenshot.
