import React from 'react';
import styles from '@/styles/Sidebar.module.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sectionLabel}>Artifacts</div>
      <nav className={styles.nav}>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? styles.active : ''}>Dashboard</NavLink>
        <NavLink to="/projects" className={({isActive}) => isActive ? styles.active : ''}>Projects</NavLink>
        <NavLink to="/notifications" className={({isActive}) => isActive ? styles.active : ''}>Inbox</NavLink>
      </nav>
      <div className={styles.spacer} />
      <button className={styles.create} onClick={() => navigate('/projects/new')}>+ Create Project</button>
    </aside>
  );
};
