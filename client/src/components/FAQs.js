import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function FAQs() {
  return (
    <div className="landing-container">
      <nav className="landing-navbar">
        <Link to="/" className="nav-logo">
          <img src="/images/codecollab.png" alt="CodeCollab Logo" />
          <span>CodeCollab</span>
        </Link>
        <div className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/how-it-works">How it works</Link>
          <Link to="/faqs" style={{color: "var(--text-main)"}}>FAQs</Link>
          <Link to="/">Homepage</Link>
        </div>
        <div className="nav-actions">
          <Link to="/join" className="btn btn-login">Login</Link>
          <Link to="/join" className="btn btn-signup">Sign Up</Link>
        </div>
      </nav>

      <main className="hero-section" style={{minHeight: "80vh", paddingTop: "120px", display: "block", textAlign: "left"}}>
        <div className="hero-bg-animation">
          <div className="hero-blob blob-2" style={{opacity: 0.3}}></div>
        </div>
        <div className="container mt-5 text-light" style={{maxWidth: "800px", margin: "0 auto"}}>
          <h1 className="mb-5" style={{color: "var(--text-main)", fontWeight: "bold"}}>Frequently Asked Questions</h1>
          
          <div className="mb-4">
            <h4 style={{color: "var(--accent-light)"}}>Is CodeCollab free to use?</h4>
            <p style={{color: "var(--text-muted)"}}>Yes, CodeCollab is currently completely free to use for individual developers and small teams.</p>
          </div>

          <div className="mb-4">
            <h4 style={{color: "var(--accent-light)"}}>Which programming languages are supported?</h4>
            <p style={{color: "var(--text-muted)"}}>We currently support Python3 and Java. We are constantly working on adding more languages to our compiler engine.</p>
          </div>

          <div className="mb-4">
            <h4 style={{color: "var(--accent-light)"}}>How does real-time collaboration work?</h4>
            <p style={{color: "var(--text-muted)"}}>We use WebSockets to establish a direct connection between your browser and our servers. Any changes made to the code editor are instantly broadcasted to everyone else in the same room.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FAQs;
