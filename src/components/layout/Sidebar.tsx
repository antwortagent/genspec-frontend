import React from 'react';
import styles from '@/styles/Sidebar.module.css';
import { Link, NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sectionLabel}>Artifacts</div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? styles.active : ''}>Dashboard</NavLink>
        <Link to="#" className={styles.disabled}>Projects</Link>
        <NavLink to="/notifications" className={({isActive}) => isActive ? styles.active : ''}>Inbox</NavLink>
      </nav>
      <div className={styles.spacer} />
      <button className={styles.create}>+ Create Project</button>
    </aside>
  );
};
