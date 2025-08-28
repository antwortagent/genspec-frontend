import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ProactiveAgentPanel } from './ProactiveAgentPanel';
import { useAuth } from '@/store/auth';
import styles from './AppShell.module.css';

export const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isProjectWorkspace = /^\/projects\/(?!new)([^\/]+)(?:\/|$)/.test(pathname);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarVisible(false);
      } else {
        setSidebarVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  // This component should only render when authenticated
  // The RequireAuth wrapper handles the redirect to login

  return (
    <div className={styles.appShell}>
      <TopBar 
        toggleSidebar={toggleSidebar} 
        isSidebarVisible={sidebarVisible}
        isMobile={isMobile}
      />
      <div className={styles.content}>
        {!isProjectWorkspace && <Sidebar visible={sidebarVisible} />}
        <main className={`${styles.main} ${sidebarVisible ? styles.mainWithShadow : ''}`}>
          {children ?? <Outlet />}
        </main>
        <ProactiveAgentPanel />
      </div>
    </div>
  );
};
