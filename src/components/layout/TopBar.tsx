import React from 'react';
import styles from '@/styles/TopBar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';

export const TopBar: React.FC = () => {
  const { pathname } = useLocation();
  const isAuth = pathname === '/login';
  const { user, logout } = useAuth();
  
  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>GenSpec</Link>
        {!isAuth && (
          <nav style={{marginLeft:'32px',display:'flex',gap:'24px'}}>
            <Link to="/dashboard" style={{color:'var(--text)',textDecoration:'none',fontWeight:'500'}}>
              Dashboard
            </Link>
            <Link to="/projects" style={{color:'var(--text-muted)',textDecoration:'none',fontWeight:'500'}}>
              Projects
            </Link>
            <Link to="/notifications" style={{color:'var(--text-muted)',textDecoration:'none',fontWeight:'500'}}>
              Notifications
            </Link>
          </nav>
        )}
      </div>
      
      {!isAuth && (
        <div className={styles.right}>
          {user && (
            <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
              <span style={{fontSize:'14px',color:'var(--text-muted)'}}>
                {user.email}
              </span>
              <button 
                onClick={logout}
                style={{
                  background:'none',
                  border:'1px solid var(--glass-border)',
                  padding:'6px 12px',
                  borderRadius:'6px',
                  color:'var(--text-muted)',
                  fontSize:'14px',
                  cursor:'pointer'
                }}
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
