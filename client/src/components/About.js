import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css"; // Reuse landing page styles where applicable

function About() {
  return (
    <div className="landing-container">
      <nav className="landing-navbar">
        <Link to="/" className="nav-logo">
          <img src="/images/codecollab.png" alt="CodeCollab Logo" />
          <span>CodeCollab</span>
        </Link>
        <div className="nav-links">
          <Link to="/about" style={{color: "var(--text-main)"}}>About</Link>
          <Link to="/how-it-works">How it works</Link>
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
          <div className="hero-blob blob-1" style={{opacity: 0.3}}></div>
        </div>
        <div className="container mt-5 text-light" style={{maxWidth: "800px", margin: "0 auto"}}>
          <h1 className="mb-4" style={{color: "var(--text-main)", fontWeight: "bold"}}>About CodeCollab</h1>
          <p style={{fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-muted)"}}>
            CodeCollab is a state-of-the-art real-time collaborative coding environment designed for developers, interviewers, and teams. Our mission is to bridge the gap in remote software engineering by providing a seamless, zero-latency platform where multiple users can write, execute, and debug code simultaneously.
          </p>
          <p style={{fontSize: "1.1rem", lineHeight: "1.8", color: "var(--text-muted)"}}>
            Whether you are conducting a technical interview, pair programming on a complex algorithm, or simply teaching a friend how to code, CodeCollab provides all the necessary tools in a beautifully crafted, premium workspace.
          </p>
        </div>
      </main>
    </div>
  );
}

export default About;
