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

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendingUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,7 22,7 22,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Basic stats data - to be replaced with real API data
const statsData = {
  activeProjects: 0,
  generatedSpecs: 0,
  timeSaved: '0h',
  teamMembers: 0
};

// Mock data for better visualization
const quickActions = [
  {
    title: "Create New Project",
    description: "Start building with AI-powered specifications",
    icon: <PlusIcon />,
    href: "/projects/new",
    primary: true
  },
  {
    title: "Explore Templates",
    description: "Use pre-built industry templates",
    icon: <SpecsIcon />,
    href: "/templates",
    primary: false
  }
];

const recentActivity = [
  {
    type: "project_created",
    title: "Welcome to GenSpec!",
    description: "Ready to create your first specification",
    time: "Just now",
    icon: <SparklesIcon />
  }
];

const EnhancedDashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      {/* Animated Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeSection}>
            <h1 className={styles.welcomeHeading}>
              Welcome to your workspace
              <span className={styles.sparkleIcon}>
                <SparklesIcon />
              </span>
            </h1>
            <p className={styles.welcomeSubheading}>
              Create clear, audit-ready specifications with proactive AI assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Visuals */}
      <div className={styles.statsGrid}>
        <GlassCard className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <ProjectIcon />
            <div className={styles.statIconGlow}></div>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.activeProjects}</span>
            <span className={styles.statLabel}>Active Projects</span>
            <div className={styles.statTrend}>
              <TrendingUpIcon />
              <span>Ready to start</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <SpecsIcon />
            <div className={styles.statIconGlow}></div>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.generatedSpecs}</span>
            <span className={styles.statLabel}>Generated Specs</span>
            <div className={styles.statTrend}>
              <TrendingUpIcon />
              <span>Get started</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <TimeIcon />
            <div className={styles.statIconGlow}></div>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.timeSaved}</span>
            <span className={styles.statLabel}>Time Saved</span>
            <div className={styles.statTrend}>
              <TrendingUpIcon />
              <span>Potential</span>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className={styles.statCard}>
          <div className={styles.statIconContainer}>
            <TeamIcon />
            <div className={styles.statIconGlow}></div>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{statsData.teamMembers}</span>
            <span className={styles.statLabel}>Team Members</span>
            <div className={styles.statTrend}>
              <TrendingUpIcon />
              <span>Invite team</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Quick Actions */}
        <GlassCard className={styles.quickActionsCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
          </div>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.href} 
                className={`${styles.actionButton} ${action.primary ? styles.primaryAction : styles.secondaryAction}`}
              >
                <div className={styles.actionIcon}>
                  {action.icon}
                </div>
                <div className={styles.actionContent}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className={styles.actionArrow}>
                  <ArrowRightIcon />
                </div>
              </Link>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className={styles.activityCard}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Activity</h2>
          </div>
          <div className={styles.activityList}>
            {recentActivity.map((activity, index) => (
              <div key={index} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  {activity.icon}
                </div>
                <div className={styles.activityContent}>
                  <h3>{activity.title}</h3>
                  <p>{activity.description}</p>
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Getting Started Section */}
      <GlassCard className={styles.gettingStartedCard}>
        <div className={styles.gettingStartedContent}>
          <div className={styles.gettingStartedIcon}>
            <ProjectIcon />
          </div>
          <div className={styles.gettingStartedText}>
            <h3>Ready to build something amazing?</h3>
            <p>Create your first project and experience the power of AI-driven specification generation.</p>
          </div>
          <Link to="/projects/new" className={styles.primaryButton}>
            <PlusIcon />
            Create Your First Project
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default EnhancedDashboardPage;