import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

export const LandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <h2>GenSpec</h2>
          </div>
          <div className={styles.navLinks}>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>
          <div className={styles.navActions}>
            <Link to="/login" className={styles.loginButton}>Sign In</Link>
            <Link to="/login" className={styles.ctaButton}>Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            AI-Powered Specification Generation
          </h1>
          <p className={styles.heroSubtitle}>
            Transform your ideas into detailed technical specifications with the power of AI. 
            GenSpec helps teams create comprehensive project documentation in minutes, not hours.
          </p>
          <div className={styles.heroActions}>
            <Link to="/login" className={styles.primaryButton}>
              Start Free Trial
            </Link>
            <button className={styles.secondaryButton}>
              Watch Demo
            </button>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <h3>10,000+</h3>
              <p>Projects Created</p>
            </div>
            <div className={styles.stat}>
              <h3>75%</h3>
              <p>Time Saved</p>
            </div>
            <div className={styles.stat}>
              <h3>500+</h3>
              <p>Happy Teams</p>
            </div>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.mockup}>
            <div className={styles.mockupHeader}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className={styles.mockupContent}>
              <div className={styles.mockupSidebar}></div>
              <div className={styles.mockupMain}>
                <div className={styles.mockupChat}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>Powerful Features</h2>
          <p className={styles.sectionSubtitle}>
            Everything you need to create professional specifications
          </p>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                  <path d="M2 17L12 22L22 17" />
                  <path d="M2 12L12 17L22 12" />
                </svg>
              </div>
              <h3>AI-Powered Generation</h3>
              <p>Advanced AI understands your requirements and generates comprehensive specifications</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h3>Smart Templates</h3>
              <p>Choose from industry-standard templates or create your own custom formats</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>Team Collaboration</h3>
              <p>Work together in real-time with your team to refine and perfect specifications</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3>Export Options</h3>
              <p>Export to PDF, Word, Markdown, or integrate with your favorite tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionContent}>
          <h2 className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Create professional specifications in three simple steps
          </p>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3>Describe Your Project</h3>
              <p>Tell our AI about your project requirements, goals, and constraints using natural language</p>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3>AI Generates Specs</h3>
              <p>Our AI analyzes your input and creates a comprehensive specification document</p>
            </div>
            <div className={styles.stepConnector}></div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3>Review & Export</h3>
              <p>Review, edit, and collaborate on the specs, then export in your preferred format</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Transform Your Workflow?</h2>
          <p>Join thousands of teams already using GenSpec to streamline their specification process</p>
          <Link to="/login" className={styles.ctaButtonLarge}>
            Start Your Free Trial
          </Link>
          <p className={styles.ctaNote}>No credit card required • 14-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h4>GenSpec</h4>
            <p>AI-powered specification generation for modern teams</p>
          </div>
          <div className={styles.footerSection}>
            <h5>Product</h5>
            <a href="#features">Features</a>
            <a href="#docs">Documentation</a>
          </div>
          <div className={styles.footerSection}>
            <h5>Company</h5>
            <a href="#about">About</a>
            <a href="#blog">Blog</a>
            <a href="#careers">Careers</a>
          </div>
          <div className={styles.footerSection}>
            <h5>Support</h5>
            <a href="#help">Help Center</a>
            <a href="#contact">Contact</a>
            <a href="#status">Status</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2025 GenSpec. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
