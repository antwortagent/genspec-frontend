import React from 'react';
import styles from './TopBar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';

interface TopBarProps {
  toggleSidebar?: () => void;
  isSidebarVisible?: boolean;
  isMobile?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  toggleSidebar, 
  isSidebarVisible = true,
  isMobile = false
}) => {
  const { pathname } = useLocation();
  const isAuth = pathname === '/login';
  const { user, logout } = useAuth();
  
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {!isAuth && toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className={styles.menuToggle}
            aria-label={isSidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {isSidebarVisible ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        )}
        <Link to="/" className={styles.logo}>GenSpec</Link>
        {!isAuth && !isMobile && (
          <nav className={styles.topNav}>
            <Link to="/dashboard" className={pathname === '/dashboard' ? styles.activeLink : styles.navLink}>
              Dashboard
            </Link>
            <Link to="/projects" className={pathname.startsWith('/projects') ? styles.activeLink : styles.navLink}>
              Projects
            </Link>
            <Link to="/notifications" className={pathname === '/notifications' ? styles.activeLink : styles.navLink}>
              Notifications
            </Link>
          </nav>
        )}
      </div>
      
      {!isAuth && (
        <div className={styles.right}>
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>
                {user.email}
              </span>
              <button 
                onClick={logout}
                className={styles.signOutButton}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
