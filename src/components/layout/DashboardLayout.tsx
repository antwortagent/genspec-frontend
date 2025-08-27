import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';
import styles from './DashboardLayout.module.css';

export const DashboardLayout: React.FC = () => {
  return (
    <div className={styles.dashboardLayout}>
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  );
};
