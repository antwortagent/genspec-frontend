import React from 'react';
import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import styles from './DashboardLayout.module.css';

export const DashboardLayout: React.FC = () => {
  return (
    <div className={styles.dashboardLayout}>
      <TopBar />
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
