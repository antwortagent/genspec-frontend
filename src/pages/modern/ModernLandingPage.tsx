import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './ModernLandingPage.module.css';

// Animated illustration component for the hero section
const HeroIllustration = () => (
  <div className={styles.heroImageContainer}>
    <div className={styles.heroImage}>
      <img src="/dashboard-screenshot.png" alt="GenSpec AI Platform Dashboard" />
      <div className={styles.heroImageOverlay}></div>
    </div>
    <div className={styles.heroOverlayCard}>
      <div className={styles.overlayCardHeader}>
        <div className={styles.cardIconContainer}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
          </svg>
        </div>
        <span>Proactive Insight</span>
      </div>
      <div className={styles.overlayCardContent}>
        <h3>Security Compliance Gap</h3>
        <p>Your payment gateway requirements are missing PCI-DSS compliance specifications.</p>
      </div>
      <div className={styles.overlayCardFooter}>
        <button>Apply Template</button>
      </div>
    </div>
    <div className={styles.heroOverlayCard2}>
      <div className={styles.overlayCardHeader}>
        <div className={`${styles.cardIconContainer} ${styles.cardIconSuccess}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <span>Automated Check</span>
      </div>
      <div className={styles.overlayCardContent}>
        <h3>GDPR Compliant</h3>
        <p>User data handling meets all GDPR requirements. Last verified today.</p>
      </div>
    </div>
  </div>
);

const ModernLandingPage: React.FC = () => {
  return (
    <div className={styles.landingContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>GenSpec</h1>
        </div>
        <nav className={styles.navigation}>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#solutions">Solutions</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>
        </nav>
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.loginButton}>Log In</Link>
          <Link to="/signup" className={styles.signupButton}>Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.highlight}>Proactive AI</span> for Requirements Engineering
          </h1>
          <p className={styles.heroSubtitle}>
            Generate audit-ready specifications with AI assistance that anticipates and addresses compliance requirements before they become issues.
          </p>
          <div className={styles.heroCta}>
            <Link to="/signup" className={styles.primaryButton}>
              Start Free Trial
            </Link>
            <Link to="/demo" className={styles.secondaryButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Watch Demo
            </Link>
          </div>
          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>SOC 2 Compliant</span>
            </div>
            <div className={styles.trustBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Enterprise-grade Security</span>
            </div>
            <div className={styles.trustBadge}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={styles.heroImage}>
            <img src="/dashboard-screenshot.png" alt="GenSpec Platform Dashboard" />
          </div>
          <div className={styles.heroOverlayCard}>
            <div className={styles.overlayCardHeader}>
              <div className={styles.cardIconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </div>
              <span>Proactive Insight</span>
            </div>
            <div className={styles.overlayCardContent}>
              <h3>Security Compliance Gap</h3>
              <p>Your payment gateway requirements are missing PCI-DSS compliance specifications.</p>
            </div>
            <div className={styles.overlayCardFooter}>
              <button>Apply Template</button>
            </div>
          </div>
          <div className={styles.heroOverlayCard2}>
            <div className={styles.overlayCardHeader}>
              <div className={`${styles.cardIconContainer} ${styles.cardIconSuccess}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span>Automated Check</span>
            </div>
            <div className={styles.overlayCardContent}>
              <h3>GDPR Compliant</h3>
              <p>User data handling meets all GDPR requirements. Last verified today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className={styles.clientsSection}>
        <div className={styles.clientsContainer}>
          <h2>Trusted by Industry Leaders</h2>
          <div className={styles.clientLogos}>
            <div className={styles.clientLogo}>Company 1</div>
            <div className={styles.clientLogo}>Company 2</div>
            <div className={styles.clientLogo}>Company 3</div>
            <div className={styles.clientLogo}>Company 4</div>
            <div className={styles.clientLogo}>Company 5</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2>Proactive Requirements Engineering</h2>
          <p>Our AI anticipates compliance needs and automates specification creation</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h3>Automated Specifications</h3>
            <p>Generate comprehensive requirements documents from voice or text inputs with AI that understands industry standards.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Compliance Guardrails</h3>
            <p>Automatically check requirements against regulatory frameworks like GDPR, HIPAA, and ISO standards.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3>Predictive Analytics</h3>
            <p>Identify potential risks and gaps in your requirements before they become costly issues.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </div>
            <h3>Industry Templates</h3>
            <p>Access a library of pre-approved templates tailored for different industries and compliance frameworks.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3>Team Collaboration</h3>
            <p>Real-time collaboration tools with role-based access for product teams, stakeholders, and auditors.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
                <line x1="2" y1="10" x2="6" y2="14" />
                <line x1="14" y1="4" x2="10" y2="4" />
                <line x1="22" y1="10" x2="18" y2="10" />
              </svg>
            </div>
            <h3>Audit Trail</h3>
            <p>Comprehensive change history and approval workflows that ensure audit-readiness at all times.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorksSection}>
        <div className={styles.sectionHeader}>
          <h2>How It Works</h2>
          <p>Four simple steps to transform your requirements process</p>
        </div>
        <div className={styles.workflowSteps}>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>1</div>
            <h3>Voice/Text Intake</h3>
            <p>Capture requirements through natural conversation or text with our AI assistant.</p>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>2</div>
            <h3>Template Selection</h3>
            <p>Choose from industry-specific templates or let AI recommend the best fit.</p>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>3</div>
            <h3>AI Enhancement</h3>
            <p>Our AI identifies gaps, enhances clarity, and ensures compliance.</p>
          </div>
          <div className={styles.stepConnector}></div>
          <div className={styles.workflowStep}>
            <div className={styles.stepNumber}>4</div>
            <h3>Review & Export</h3>
            <p>Collaborate on the final document and export in multiple formats.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className={styles.testimonialsSection}>
        <div className={styles.sectionHeader}>
          <h2>What Our Users Say</h2>
          <p>Join hundreds of product teams that rely on GenSpec</p>
        </div>
        <div className={styles.testimonialCards}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={styles.quoteIcon}>
                <path d="M10 11L7 14 3 14 3 10 7 6 10 6z" />
                <path d="M21 11L18 14 14 14 14 10 18 6 21 6z" />
              </svg>
              <p>"GenSpec has transformed how our team creates specifications. What used to take hours now takes minutes, and the compliance checking has saved us from costly regulatory issues."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>SC</div>
              <div className={styles.authorInfo}>
                <h4>Sarah Chen</h4>
                <p>Lead Product Manager, TechCorp</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={styles.quoteIcon}>
                <path d="M10 11L7 14 3 14 3 10 7 6 10 6z" />
                <path d="M21 11L18 14 14 14 14 10 18 6 21 6z" />
              </svg>
              <p>"As a compliance officer, I appreciate how GenSpec proactively flags potential regulatory issues before they become problems. It's like having an extra team member focused on compliance."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>MJ</div>
              <div className={styles.authorInfo}>
                <h4>Michael Johnson</h4>
                <p>Compliance Director, FinSecure</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialContent}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={styles.quoteIcon}>
                <path d="M10 11L7 14 3 14 3 10 7 6 10 6z" />
                <path d="M21 11L18 14 14 14 14 10 18 6 21 6z" />
              </svg>
              <p>"The audit trails in GenSpec have simplified our certification process. When auditors arrive, we're always ready with complete documentation and change history."</p>
            </div>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>AP</div>
              <div className={styles.authorInfo}>
                <h4>Aisha Patel</h4>
                <p>Project Manager, HealthTech Innovations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to transform your requirements process?</h2>
          <p>Join leading organizations that are saving time and reducing compliance risk with GenSpec.</p>
          <div className={styles.ctaButtons}>
            <Link to="/signup" className={styles.primaryButton}>Start Free Trial</Link>
            <Link to="/demo" className={styles.outlineButton}>Request Demo</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <h3>GenSpec</h3>
            <p>AI-powered requirements engineering for professional teams.</p>
          </div>
          <div className={styles.footerColumn}>
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
              <li><a href="#enterprise">Enterprise</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Resources</h4>
            <ul>
              <li><a href="#documentation">Documentation</a></li>
              <li><a href="#api">API</a></li>
              <li><a href="#guides">Guides</a></li>
              <li><a href="#webinars">Webinars</a></li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2025 GenSpec. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#terms">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernLandingPage;
