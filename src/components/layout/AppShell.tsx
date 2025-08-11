import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { AgentPanel } from './AgentPanel';
import { useAuth } from '@/store/auth';
import styles from './AppShell.module.css';

export const AppShell: React.FC = () => {
  const { user } = useAuth();

  // This component should only render when authenticated
  // The RequireAuth wrapper handles the redirect to login

  return (
    <div className={styles.appShell}>
      <TopBar />
      <div className={styles.content}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
        <AgentPanel />
      </div>
    </div>
  );
};
