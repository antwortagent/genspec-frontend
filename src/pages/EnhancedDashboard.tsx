import React from 'react';
import { Link } from 'react-router-dom';

import { GlassCard } from '../components/ui/GlassCard';
import styles from './EnhancedDashboard.module.css';

// Enhanced icons for better visualization
const ProjectIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpecsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TimeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TeamIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Basic stats data - to be replaced with real API data
const statsData = {
  activeProjects: 0,
  generatedSpecs: 0,
  timeSaved: '0h',
  teamMembers: 0
};

const EnhancedDashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.welcomeHeading}>Welcome to your workspace</h1>
          <p className={styles.welcomeSubheading}>
            Create clear, audit-ready specifications with proactive AI assistance.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <ProjectIcon />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.activeProjects}</span>
            <span className={styles.statLabel}>Active Projects</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <SpecsIcon />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.generatedSpecs}</span>
            <span className={styles.statLabel}>Generated Specs</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <TimeIcon />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.timeSaved}</span>
            <span className={styles.statLabel}>Time Saved</span>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <TeamIcon />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.teamMembers}</span>
            <span className={styles.statLabel}>Team Members</span>
          </div>
        </div>
      </div>

      {/* Empty State - to be replaced with actual content */}
      <div className={styles.emptyState}>
        <GlassCard className={styles.emptyStateCard}>
          <div className={styles.emptyStateContent}>
            <div className={styles.emptyStateIcon}>
              <ProjectIcon />
            </div>
            <h3>No projects yet</h3>
            <p>Get started by creating your first project</p>
            <Link to="/projects/new">
              <button className={styles.primaryButton}>Create Project</button>
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default EnhancedDashboardPage;