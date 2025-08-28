import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/store/auth';
import { analyticsApi } from '@/api/services';
import styles from './EnhancedDashboardPage.module.css';
import { ProactiveInsightCard } from '@/components/ui/ProactiveInsightCard';
import { GlassCard } from '@/components/ui/GlassCard';
export const EnhancedDashboardPage = () => {
    const { user } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            if (err?.status === 401) {
                // Session expired -> auto logout
                logout();
                return;
            }
            // Simple retry once for transient errors
            if (attempt < 2) {
                setTimeout(() => fetchDashboardData(attempt + 1), 600);
            }
            else {
                setError('Failed to load dashboard data');
            }
        }
        finally {
            setIsLoading(false);
        }
    }, [logout]);
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60)
            return 'Just now';
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        return `${Math.floor(diffInSeconds / 86400)} days ago`;
    };
    const getProjectStatusColor = (status) => {
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
            severity: "warning",
            actionText: "Fix Now"
        },
        {
            id: 2,
            title: "Audit Preparation Needed",
            description: "Upcoming compliance audit on Sep 15. 2 projects need documentation review.",
            severity: "alert",
            actionText: "Prepare"
        },
        {
            id: 3,
            title: "Requirement Automation Available",
            description: "New AI templates available for your financial compliance projects.",
            severity: "info",
            actionText: "Explore"
        }
    ];
    return (_jsx("div", { className: styles.dashboard, children: _jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.main, children: [_jsxs("header", { className: styles.header, children: [_jsxs("div", { children: [_jsxs("h1", { className: styles.title, children: ["Welcome back, ", user?.email?.split('@')[0] || 'User', "!"] }), _jsx("p", { className: styles.subtitle, children: "Create clear, audit-ready specifications with AI assistance." })] }), _jsx("div", { className: styles.headerActions, children: _jsxs("button", { className: styles.newProjectButton, onClick: () => window.location.assign('/projects/new'), children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }), "New Project"] }) })] }), isLoading && (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.loadingContainer, children: [_jsx("div", { className: styles.spinner }), _jsx("p", { children: "Loading your dashboard..." })] }), _jsxs("div", { className: styles.skeletonGrid, children: [_jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] }), _jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] }), _jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] })] })] })), error && (_jsxs("div", { className: styles.errorContainer, children: [_jsx("div", { className: styles.errorIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }), _jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })] }) }), _jsx("h3", { children: "Unable to load dashboard" }), _jsx("p", { children: error }), _jsx("button", { onClick: () => fetchDashboardData(1), className: styles.retryButton, children: "Try Again" })] })), !isLoading && !error && analytics && (_jsxs(_Fragment, { children: [_jsxs("section", { className: styles.insightsSection, children: [_jsxs("h2", { className: styles.sectionTitle, children: [_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }), "AI-Generated Insights"] }), _jsx("div", { className: styles.insightsGrid, children: proactiveInsights.map(insight => (_jsx(ProactiveInsightCard, { title: insight.title, description: insight.description, severity: insight.severity, actionText: insight.actionText, onAction: () => console.log(`Action clicked for insight ${insight.id}`) }, insight.id))) })] }), _jsxs("div", { className: styles.statsGrid, children: [_jsxs(GlassCard, { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), _jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), _jsx("polyline", { points: "10 9 9 9 8 9" })] }) }), _jsxs("div", { className: styles.statContent, children: [_jsx("h3", { children: analytics?.projects?.active ?? 0 }), _jsx("p", { children: "Active Projects" })] })] }), _jsxs(GlassCard, { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) }) }), _jsxs("div", { className: styles.statContent, children: [_jsx("h3", { children: analytics?.specifications?.total_generated ?? 0 }), _jsx("p", { children: "Generated Specs" })] })] }), _jsxs(GlassCard, { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12,6 12,12 16,14" })] }) }), _jsxs("div", { className: styles.statContent, children: [_jsxs("h3", { children: [Number(analytics?.specifications?.average_time_saved_hours ?? 0).toFixed(1), "h"] }), _jsx("p", { children: "Time Saved" })] })] }), _jsxs(GlassCard, { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }) }), _jsxs("div", { className: styles.statContent, children: [_jsx("h3", { children: analytics?.team?.total_members ?? 0 }), _jsx("p", { children: "Team Members" })] })] })] }), _jsxs("section", { className: styles.projectsSection, children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsxs("h2", { className: styles.sectionTitle, children: [_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }), "Recent Projects"] }), _jsx("button", { className: styles.viewAllButton, onClick: () => window.location.assign('/projects'), children: "View All" })] }), _jsx("div", { className: styles.projectsList, children: recentProjects.length > 0 ? (recentProjects.map((project) => (_jsxs(GlassCard, { className: styles.projectCard, children: [_jsxs("div", { className: styles.projectHeader, children: [_jsx("div", { className: styles.projectIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }), _jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }), _jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })] }) }), _jsxs("div", { className: styles.projectTitle, children: [_jsx("h3", { children: project.name }), _jsxs("div", { className: styles.projectMeta, children: [_jsx("span", { className: `${styles.chip} ${styles[project.status || 'unknown']}`, children: project.status ? (project.status.charAt(0).toUpperCase() + project.status.slice(1)) : 'Unknown' }), _jsx("span", { className: styles.projectDate, children: formatTimeAgo(project.updated_at) })] })] })] }), _jsx("p", { className: styles.projectDescription, children: project.description }), _jsxs("div", { className: styles.projectFooter, children: [_jsxs("div", { className: styles.projectStats, children: [_jsxs("div", { className: styles.projectStat, children: [_jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }), _jsxs("span", { children: [project.requirements_count || 0, " Requirements"] })] }), _jsxs("div", { className: styles.projectStat, children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }), _jsxs("span", { children: [project.team_members?.length || 0, " Members"] })] })] }), _jsxs("button", { className: styles.projectContinueButton, onClick: () => window.location.assign(`/projects/${project.id}`), children: ["Continue", _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M5 12h14" }), _jsx("path", { d: "M12 5l7 7-7 7" })] })] })] })] }, project.id)))) : (_jsxs("div", { className: styles.emptyState, children: [_jsx("div", { className: styles.emptyStateIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }), _jsx("line", { x1: "9", y1: "14", x2: "15", y2: "14" })] }) }), _jsx("p", { children: "No recent projects yet." }), _jsxs("div", { className: styles.emptyStateActions, children: [_jsx("button", { className: styles.newProjectButton, onClick: () => window.location.assign('/projects/new'), children: "Create Project" }), _jsx("button", { className: styles.viewAllButton, onClick: () => window.location.assign('/projects'), children: "View All" })] })] })) })] }), _jsxs("section", { className: styles.templatesSection, children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsxs("h2", { className: styles.sectionTitle, children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), _jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), _jsx("polyline", { points: "10 9 9 9 8 9" })] }), "Recommended Templates"] }), _jsx("button", { className: styles.viewAllButton, children: "View All" })] }), _jsxs("div", { className: styles.templatesGrid, children: [_jsxs(GlassCard, { className: styles.templateCard, children: [_jsx("div", { className: styles.templateIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }), _jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }), _jsx("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })] }) }), _jsx("h3", { children: "Financial Compliance" }), _jsx("p", { children: "SOX-compliant requirements template with automated validation rules." }), _jsxs("div", { className: styles.templateStats, children: [_jsx("span", { children: "23 Sections" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "97% Approval Rate" })] }), _jsx("button", { className: styles.useTemplateButton, children: "Use Template" })] }), _jsxs(GlassCard, { className: styles.templateCard, children: [_jsx("div", { className: styles.templateIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }), _jsx("polyline", { points: "22 4 12 14.01 9 11.01" })] }) }), _jsx("h3", { children: "GDPR Compliance" }), _jsx("p", { children: "Complete data privacy requirements with built-in regulatory references." }), _jsxs("div", { className: styles.templateStats, children: [_jsx("span", { children: "18 Sections" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "99% Compliance" })] }), _jsx("button", { className: styles.useTemplateButton, children: "Use Template" })] }), _jsxs(GlassCard, { className: styles.templateCard, children: [_jsx("div", { className: styles.templateIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }), _jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }), _jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })] }) }), _jsx("h3", { children: "Agile User Stories" }), _jsx("p", { children: "Structured user story template with acceptance criteria framework." }), _jsxs("div", { className: styles.templateStats, children: [_jsx("span", { children: "12 Sections" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "Fast Implementation" })] }), _jsx("button", { className: styles.useTemplateButton, children: "Use Template" })] })] })] })] }))] }) }) }));
};
