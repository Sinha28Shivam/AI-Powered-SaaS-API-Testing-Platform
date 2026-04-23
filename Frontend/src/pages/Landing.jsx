import React from 'react';
import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <header className="landing-header">
          <div className="logo-minimal">AURA API TESTING</div>
          <marquee scrollamount="10" width="80%" style={{ color: 'red', fontSize: '1.5rem', fontWeight: 'bold' }}>
            !!! WELCOME TO MY AWESOME API TESTING HOMEPAGE !!!
          </marquee>
          <nav className="minimal-nav">
            <Link to="/login" className="nav-link">Sign In Here!</Link>
            <Link to="/signup" className="nav-link">Create Account!!!</Link>
          </nav>
        </header>

        <main className="landing-main">
          {/* Unrealistic 3D Object */}
          <Hero3D />

          <div className="hero-text-container">
            <h1 className="display-title">
              <blink>Next Gen API Testing.</blink>
            </h1>
            
            <p className="hero-subtitle">
              The coolest platform designed to elevate your API workflows!
              Best viewed in Netscape Navigator!
            </p>

            <img 
              className="construction-gif"
              src="https://web.archive.org/web/20090829070908/http://www.geocities.com/Heartland/Bluffs/4157/Uconst.gif" 
              alt="Under Construction" 
            />

            <div className="hero-actions">
              <Link to="/signup" className="btn-glass-primary">
                Click Here To Start Building!
              </Link>
              <br/><br/>
              <Link to="/login" className="btn-glass-secondary">
                View Documentation
              </Link>
            </div>
          </div>
        </main>
        
        <footer className="landing-footer">
          <p>You are visitor #000042</p>
          <p>© 1998 Aura API. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
