import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { AgentPanel } from './AgentPanel';
import { useAuth } from '@/store/auth';
import styles from './AppShell.module.css';

export const AppShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const isProjectWorkspace = /^\/projects\/(?!new)([^\/]+)(?:\/|$)/.test(pathname);

  // This component should only render when authenticated
  // The RequireAuth wrapper handles the redirect to login

  return (
    <div className={styles.appShell}>
      <TopBar />
      <div className={styles.content}>
  {!isProjectWorkspace && <Sidebar />}
        <main className={styles.main}>
          {children ?? <Outlet />}
        </main>
        <AgentPanel />
      </div>
    </div>
  );
};
