import React, { useEffect, useRef } from 'react';
import styles from '@/styles/Sidebar.module.css';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  visible?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Animation effect for sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (sidebar) {
      if (visible) {
        sidebar.style.transform = 'translateX(0)';
        sidebar.style.opacity = '1';
      } else {
        sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.opacity = '0';
      }
    }
  }, [visible]);

  if (!visible) {
    return null; // Don't render if not visible (on mobile)
  }

  return (
    <aside 
      className={styles.sidebar} 
      ref={sidebarRef}
      style={{
        transition: 'transform 0.3s ease, opacity 0.3s ease',
      }}
    >
      <div className={styles.sectionLabel}>Artifacts</div>
      <nav className={styles.nav}>
        <NavLink 
          to="/dashboard" 
          className={({isActive}) => isActive ? styles.active : styles.navLink}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          Dashboard
        </NavLink>
        <NavLink 
          to="/projects" 
          className={({isActive}) => isActive || location.pathname.includes('/projects/') ? styles.active : styles.navLink}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
          Projects
        </NavLink>
        <NavLink 
          to="/notifications" 
          className={({isActive}) => isActive ? styles.active : styles.navLink}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Inbox
        </NavLink>
      </nav>
      <div className={styles.spacer} />
      <button 
        className={styles.create} 
        onClick={() => navigate('/projects/new')}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create Project
      </button>
    </aside>
  );
};
