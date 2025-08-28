import React from 'react';
import { Link } from 'react-router-dom';
import styles from './ModernLandingPage.module.css';

export const ModernLandingPage: React.FC = () => {
  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span>GenSpec</span>
        </div>
        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <Link to="/login" className={styles.loginButton}>Log In</Link>
          <Link to="/login" className={styles.signupButton}>Sign Up</Link>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1>AI-Powered Requirements Management</h1>
            <p>
              Create clear, audit-ready specifications with proactive AI assistance.
              Perfect for Product Leaders, Project Managers, and Audit Professionals.
            </p>
            <div className={styles.heroCta}>
              <Link to="/login" className={styles.primaryButton}>Get Started</Link>
              <a href="#demo" className={styles.secondaryButton}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                Watch Demo
              </a>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImageContainer}>
              <img src="/hero-dashboard.png" alt="GenSpec Dashboard" />
              <div className={styles.heroImageOverlay}></div>
            </div>
          </div>
        </section>

        <section className={styles.highlights}>
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Audit-Ready Documentation</h3>
            <p>Generate compliant specifications that meet regulatory standards automatically.</p>
          </div>
          
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h3>Proactive Insights</h3>
            <p>AI detects gaps and suggests improvements before they become problems.</p>
          </div>
          
          <div className={styles.highlightCard}>
            <div className={styles.highlightIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
                <line x1="9.69" y1="8" x2="21.17" y2="8"/>
                <line x1="7.38" y1="12" x2="13.12" y2="2.06"/>
                <line x1="9.69" y1="16" x2="3.95" y2="6.06"/>
                <line x1="14.31" y1="16" x2="2.83" y2="16"/>
                <line x1="16.62" y1="12" x2="10.88" y2="21.94"/>
              </svg>
            </div>
            <h3>Voice-to-Spec Technology</h3>
            <p>Speak your requirements and watch them transform into structured documentation.</p>
          </div>
        </section>

        <section id="features" className={styles.features}>
          <div className={styles.sectionHeader}>
            <h2>Powerful Features for Professionals</h2>
            <p>Everything you need to streamline requirements management</p>
          </div>
          
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>Industry-Specific Templates</h3>
              <p>Pre-built templates for finance, healthcare, tech, and more - all compliant with industry standards.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3>Intelligent Wishlist Builder</h3>
              <p>AI suggests requirements based on your project context and industry best practices.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
              <h3>Gap Detection</h3>
              <p>Automatically identify missing requirements, conflicting items, and incomplete specifications.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Collaborative Review</h3>
              <p>Involve stakeholders early with intelligent sharing and commenting features.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <h3>Traceability Matrix</h3>
              <p>Automatic generation of requirement traceability for complete audit trails.</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <h3>Performance Analytics</h3>
              <p>Track time saved, compliance rates, and process improvements with detailed analytics.</p>
            </div>
          </div>
        </section>
        
        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <h2>How It Works</h2>
            <p>Simple, efficient, and intelligent requirements management</p>
          </div>
          
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Voice Intake</h3>
                <p>Speak your requirements naturally or import existing documentation.</p>
              </div>
            </div>
            
            <div className={styles.stepConnector}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Template Selection</h3>
                <p>AI suggests the best template based on your project's needs.</p>
              </div>
            </div>
            
            <div className={styles.stepConnector}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Wishlist Generation</h3>
                <p>AI generates and organizes requirement items for your review.</p>
              </div>
            </div>
            
            <div className={styles.stepConnector}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Review & Approval</h3>
                <p>Collaborate with stakeholders for final approval and documentation.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className={styles.testimonials}>
          <div className={styles.sectionHeader}>
            <h2>What Our Users Say</h2>
            <p>Trusted by professionals across industries</p>
          </div>
          
          <div className={styles.testimonialGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"GenSpec has reduced our requirements gathering time by 70%. The AI suggestions are incredibly accurate for our industry."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>JM</div>
                <div>
                  <h4>Jane Martinez</h4>
                  <p>Product Director, Financial Services</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"Our audit preparation used to take weeks. With GenSpec, we're always audit-ready with compliant documentation."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>RK</div>
                <div>
                  <h4>Robert Kim</h4>
                  <p>Compliance Manager, Healthcare</p>
                </div>
              </div>
            </div>
            
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <p>"The voice-to-spec feature changed everything for our team. Our field staff can now capture requirements on the go."</p>
              </div>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>SP</div>
                <div>
                  <h4>Sarah Patel</h4>
                  <p>Project Manager, Construction</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className={styles.cta}>
          <div className={styles.ctaContent}>
            <h2>Ready to Transform Your Requirements Process?</h2>
            <p>Join thousands of professionals using AI to create better specifications in less time.</p>
            <Link to="/login" className={styles.ctaButton}>
              Start Free Trial
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </section>
      </main>
      
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span>GenSpec</span>
            </div>
            <p>Intelligent requirements management for modern teams.</p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerLinkGroup}>
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Templates</a>
              <a href="#">Security</a>
              <a href="#">Pricing</a>
            </div>
            
            <div className={styles.footerLinkGroup}>
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Guides</a>
              <a href="#">Case Studies</a>
            </div>
            
            <div className={styles.footerLinkGroup}>
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Blog</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© 2025 GenSpec. All rights reserved.</p>
          <div className={styles.footerBottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
