import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function HowItWorks() {
  return (
    <div className="landing-container">
      <nav className="landing-navbar">
        <Link to="/" className="nav-logo">
          <img src="/images/codecollab.png" alt="CodeCollab Logo" />
          <span>CodeCollab</span>
        </Link>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/how-it-works" style={{color: "var(--text-main)"}}>How it works</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/">Homepage</Link>
        </div>
        <div className="nav-actions">
          <Link to="/join" className="btn btn-login">Login</Link>
          <Link to="/join" className="btn btn-signup">Sign Up</Link>
        </div>
      </nav>

      <main className="hero-section" style={{minHeight: "80vh", paddingTop: "120px", display: "block", textAlign: "left"}}>
        <div className="hero-bg-animation">
          <div className="hero-blob blob-1" style={{opacity: 0.2}}></div>
          <div className="hero-blob blob-2" style={{opacity: 0.2}}></div>
        </div>
        <div className="container mt-5 text-light" style={{maxWidth: "800px", margin: "0 auto"}}>
          <h1 className="mb-5" style={{color: "var(--text-main)", fontWeight: "bold"}}>How It Works</h1>
          
          <div className="card bg-dark text-light border-secondary mb-4 p-4" style={{background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"}}>
            <h3 style={{color: "var(--accent-light)"}}>1. Create a Room</h3>
            <p className="mt-2 text-muted">Click on "Sign Up" or "Login" to go to the dashboard. Generate a unique Room ID or enter an existing one along with your username to create a session.</p>
          </div>

          <div className="card bg-dark text-light border-secondary mb-4 p-4" style={{background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"}}>
            <h3 style={{color: "var(--accent-light)"}}>2. Invite Collaborators</h3>
            <p className="mt-2 text-muted">Share your unique Room ID with your friends, colleagues, or interviewees. When they join using your Room ID, they will instantly connect to your session.</p>
          </div>

          <div className="card bg-dark text-light border-secondary mb-4 p-4" style={{background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"}}>
            <h3 style={{color: "var(--accent-light)"}}>3. Code and Compile</h3>
            <p className="mt-2 text-muted">Write code together in real-time. Use the built-in compiler to run your code and see the output instantly on all connected devices.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HowItWorks;
