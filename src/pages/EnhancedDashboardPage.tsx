import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/store/auth';
import { analyticsApi, type DashboardAnalytics, type RecentProject } from '@/api/services';
import styles from './EnhancedDashboardPage.module.css';
import { ProactiveInsightCard } from '@/components/ui/ProactiveInsightCard';
import { GlassCard } from '@/components/ui/GlassCard';

export const EnhancedDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Mock proactive insights for demonstration
  const proactiveInsights = [
    {
      id: 1,
      title: "Requirements Gap Detected",
      description: "3 requirements in Project X lack validation criteria. AI can help generate them.",
      severity: "warning" as const,
      actionText: "Fix Now"
    },
    {
      id: 2,
      title: "Audit Preparation Needed",
      description: "Upcoming compliance audit on Sep 15. 2 projects need documentation review.",
      severity: "alert" as const,
      actionText: "Prepare"
    },
    {
      id: 3,
      title: "Requirement Automation Available",
      description: "New AI templates available for your financial compliance projects.",
      severity: "info" as const,
      actionText: "Explore"
    }
  ];

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
                Create clear, audit-ready specifications with AI assistance.
              </p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.newProjectButton} onClick={() => window.location.assign('/projects/new')}>
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
              {/* Proactive AI Insights */}
              <section className={styles.insightsSection}>
                <h2 className={styles.sectionTitle}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  AI-Generated Insights
                </h2>
                <div className={styles.insightsGrid}>
                  {proactiveInsights.map(insight => (
                    <ProactiveInsightCard
                      key={insight.id}
                      title={insight.title}
                      description={insight.description}
                      severity={insight.severity}
                      actionText={insight.actionText}
                      onAction={() => console.log(`Action clicked for insight ${insight.id}`)}
                    />
                  ))}
                </div>
              </section>

              {/* Quick Stats */}
              <div className={styles.statsGrid}>
                <GlassCard className={styles.statCard}>
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
                </GlassCard>

                <GlassCard className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                    </svg>
                  </div>
                  <div className={styles.statContent}>
                    <h3>{analytics?.specifications?.total_generated ?? 0}</h3>
                    <p>Generated Specs</p>
                  </div>
                </GlassCard>

                <GlassCard className={styles.statCard}>
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
                </GlassCard>

                <GlassCard className={styles.statCard}>
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
                </GlassCard>
              </div>

              {/* Recent Projects with Improved Cards */}
              <section className={styles.projectsSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                    Recent Projects
                  </h2>
                  <button className={styles.viewAllButton} onClick={() => window.location.assign('/projects')}>View All</button>
                </div>
                
                <div className={styles.projectsList}>
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => (
                      <GlassCard key={project.id} className={styles.projectCard}>
                        <div className={styles.projectHeader}>
                          <div className={styles.projectIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                              <line x1="8" y1="21" x2="16" y2="21"/>
                              <line x1="12" y1="17" x2="12" y2="21"/>
                            </svg>
                          </div>
                          <div className={styles.projectTitle}>
                            <h3>{project.name}</h3>
                            <div className={styles.projectMeta}>
                              <span 
                                className={`${styles.chip} ${styles[project.status || 'unknown']}`}
                              >
                                {project.status ? (project.status.charAt(0).toUpperCase() + project.status.slice(1)) : 'Unknown'}
                              </span>
                              <span className={styles.projectDate}>
                                {formatTimeAgo(project.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className={styles.projectDescription}>{project.description}</p>
                        
                        <div className={styles.projectFooter}>
                          <div className={styles.projectStats}>
                            <div className={styles.projectStat}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                              </svg>
                              <span>{project.requirements_count || 0} Requirements</span>
                            </div>
                            <div className={styles.projectStat}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                              </svg>
                              <span>{project.team_members?.length || 0} Members</span>
                            </div>
                          </div>
                          <button 
                            className={styles.projectContinueButton} 
                            onClick={() => window.location.assign(`/projects/${project.id}`)}
                          >
                            Continue
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14"/>
                              <path d="M12 5l7 7-7 7"/>
                            </svg>
                          </button>
                        </div>
                      </GlassCard>
                    ))
                  ) : (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyStateIcon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                          <line x1="9" y1="14" x2="15" y2="14"/>
                        </svg>
                      </div>
                      <p>No recent projects yet.</p>
                      <div className={styles.emptyStateActions}>
                        <button className={styles.newProjectButton} onClick={() => window.location.assign('/projects/new')}>
                          Create Project
                        </button>
                        <button className={styles.viewAllButton} onClick={() => window.location.assign('/projects')}>
                          View All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>
              
              {/* Recommended Templates Section */}
              <section className={styles.templatesSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    Recommended Templates
                  </h2>
                  <button className={styles.viewAllButton}>View All</button>
                </div>
                
                <div className={styles.templatesGrid}>
                  {/* These would be dynamically populated based on user's role and previous projects */}
                  <GlassCard className={styles.templateCard}>
                    <div className={styles.templateIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                        <line x1="12" y1="22.08" x2="12" y2="12"/>
                      </svg>
                    </div>
                    <h3>Financial Compliance</h3>
                    <p>SOX-compliant requirements template with automated validation rules.</p>
                    <div className={styles.templateStats}>
                      <span>23 Sections</span>
                      <span>•</span>
                      <span>97% Approval Rate</span>
                    </div>
                    <button className={styles.useTemplateButton}>
                      Use Template
                    </button>
                  </GlassCard>
                  
                  <GlassCard className={styles.templateCard}>
                    <div className={styles.templateIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <h3>GDPR Compliance</h3>
                    <p>Complete data privacy requirements with built-in regulatory references.</p>
                    <div className={styles.templateStats}>
                      <span>18 Sections</span>
                      <span>•</span>
                      <span>99% Compliance</span>
                    </div>
                    <button className={styles.useTemplateButton}>
                      Use Template
                    </button>
                  </GlassCard>
                  
                  <GlassCard className={styles.templateCard}>
                    <div className={styles.templateIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    </div>
                    <h3>Agile User Stories</h3>
                    <p>Structured user story template with acceptance criteria framework.</p>
                    <div className={styles.templateStats}>
                      <span>12 Sections</span>
                      <span>•</span>
                      <span>Fast Implementation</span>
                    </div>
                    <button className={styles.useTemplateButton}>
                      Use Template
                    </button>
                  </GlassCard>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
