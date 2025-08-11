import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/store/auth';
import { analyticsApi, type DashboardAnalytics, type RecentProject } from '@/api/services';
import { ChatPanel } from '@/components/layout/ChatPanel';
import { VoicePanel } from '@/components/layout/VoicePanel';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assistantMode, setAssistantMode] = useState<'chat' | 'voice'>('voice');

  const { logout } = useAuth();

  const fetchDashboardData = useCallback(async (attempt = 1) => {
    try {
      setIsLoading(true);
      const [analyticsData, projectsData] = await Promise.all([
        analyticsApi.getDashboardAnalytics(),
        analyticsApi.getRecentProjects(3)
      ]);
      setAnalytics(analyticsData);
      setRecentProjects(projectsData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err);
      if (err?.status === 401) {
        // Session expired -> auto logout
        logout();
        return;
      }
      // Simple retry once for transient errors
      if (attempt < 2) {
        setTimeout(() => fetchDashboardData(attempt + 1), 600);
      } else {
        setError('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'var(--success)';
      case 'completed': return 'var(--primary-1)';
      case 'draft': return 'var(--warning)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>
              Welcome back, {user?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className={styles.subtitle}>
              Ready to create amazing specifications with AI? Let's get started.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className={styles.modeToggle}>
              <button className={`${styles.modeBtn} ${assistantMode === 'chat' ? styles.modeBtnActive : ''}`} onClick={() => setAssistantMode('chat')}>Chat</button>
              <button className={`${styles.modeBtn} ${assistantMode === 'voice' ? styles.modeBtnActive : ''}`} onClick={() => setAssistantMode('voice')}>Voice</button>
            </div>
            <button className={styles.newProjectButton}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Project
            </button>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <>
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading your dashboard...</p>
            </div>
            <div className={styles.skeletonGrid}>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonBar} style={{ width: '40%' }}></div>
                <div className={styles.skeletonBar} style={{ width: '60%' }}></div>
              </div>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonBar} style={{ width: '40%' }}></div>
                <div className={styles.skeletonBar} style={{ width: '60%' }}></div>
              </div>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonBar} style={{ width: '40%' }}></div>
                <div className={styles.skeletonBar} style={{ width: '60%' }}></div>
              </div>
              <div className={styles.skeletonCard}>
                <div className={styles.skeletonBar} style={{ width: '40%' }}></div>
                <div className={styles.skeletonBar} style={{ width: '60%' }}></div>
              </div>
            </div>
          </>
        )}

        {/* Error State */}
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.errorIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Unable to load dashboard</h3>
            <p>{error}</p>
            <button
              onClick={() => fetchDashboardData(1)}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Dashboard Content */}
  {!isLoading && !error && analytics && (
          <>
            {/* Quick Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <h3>{analytics?.projects?.active ?? 0}</h3>
                  <p>Active Projects</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <h3>{analytics?.specifications?.total_generated ?? 0}</h3>
                  <p>Generated Specs</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12,6 12,12 16,14"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <h3>{Number(analytics?.specifications?.average_time_saved_hours ?? 0).toFixed(1)}h</h3>
                  <p>Time Saved</p>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <h3>{analytics?.team?.total_members ?? 0}</h3>
                  <p>Team Members</p>
                </div>
              </div>
            </div>

            {/* Recent Projects only */}
            <div className={styles.contentGrid}>
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2>Recent Projects</h2>
                  <button className={styles.viewAllButton}>View All</button>
                </div>
                <div className={styles.projectsList}>
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <div key={project.id} className={styles.projectCard}>
                        <div className={styles.projectIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                            <line x1="8" y1="21" x2="16" y2="21"/>
                            <line x1="12" y1="17" x2="12" y2="21"/>
                          </svg>
                        </div>
                        <div className={styles.projectInfo}>
                          <h3>{project.name}</h3>
                          <p>{project.description}</p>
                          <div className={styles.projectMeta}>
                            <span 
                              className={styles.projectStatus}
                              style={{ color: getProjectStatusColor(project.status || '') }}
                            >
                              {project.status ? (project.status.charAt(0).toUpperCase() + project.status.slice(1)) : 'Unknown'}
                            </span>
                            <span className={styles.projectDate}>
                              {formatTimeAgo(project.updated_at)}
                            </span>
                          </div>
                        </div>
                        <button className={styles.projectAction}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6"/>
                          </svg>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <p>No recent projects found. Create your first project to get started!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        </div>
        <aside className={styles.assistantColumn}>
          {assistantMode === 'chat' ? <ChatPanel /> : <VoicePanel />}
        </aside>
      </div>
    </div>
  );
};
