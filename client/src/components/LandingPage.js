import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const handleAuthClick = (e) => {
    e.preventDefault();
    navigate("/join");
  };

  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-navbar">
        <Link to="/" className="nav-logo">
          <img src="/images/codecollab.png" alt="CodeCollab Logo" />
          <span>CodeCollab</span>
        </Link>
        
        <div className="nav-links">
          <Link to="/about">About📚</Link>
          <Link to="/how-it-works">How it works❓</Link>
          <Link to="/faqs">FAQs❓</Link>
          <Link to="/">Home🏠</Link>
        </div>

        <div className="nav-actions">
          <Link to="/join" className="btn btn-login">Login</Link>
          <Link to="/join" className="btn btn-signup">Sign Up</Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="hero-section">
        {/* Dynamic Background Elements */}
        <div className="hero-bg-animation">
          <div className="hero-blob blob-1"></div>
          <div className="hero-blob blob-2"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">✨ Empowering Developers Worldwide</div>
          <h1 className="hero-title">Good codes comes from great Teamwork 💪</h1>
          <p className="hero-subtitle">
            Experience real-time collaborative coding with zero latency. CodeCollab is the ultimate workspace for pair programming, interviews, and team projects 🚀.
          </p>

          <div className="hero-image-container">
            <img 
              src="/images/hero_code.png" 
              alt="Futuristic Code Representation" 
              className="hero-image"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="nav-logo" style={{ marginBottom: '1rem' }}>
              <img src="/images/codecollab.png" alt="CodeCollab Logo" />
              <span>CodeCollab</span>
            </div>
            <p>Building the future of collaborative software engineering, one line of code at a time.</p>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <a href="#contact">Contact Us</a>
            <a href="#help">Help Center</a>
            <a href="#faqs">FAQs</a>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <p>Email: hello@codecollab.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CodeCollab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
