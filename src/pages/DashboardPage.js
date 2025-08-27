import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/store/auth';
import { analyticsApi } from '@/api/services';
import styles from './DashboardPage.module.css';
export const DashboardPage = () => {
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
    return (_jsx("div", { className: styles.dashboard, children: _jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.main, children: [_jsxs("header", { className: styles.header, children: [_jsxs("div", { children: [_jsxs("h1", { className: styles.title, children: ["Welcome back, ", user?.email?.split('@')[0] || 'User', "!"] }), _jsx("p", { className: styles.subtitle, children: "Create clear, audit-ready specifications with AI assistance." })] }), _jsx("div", { style: { display: 'flex', alignItems: 'center', gap: '1rem' }, children: _jsxs("button", { className: styles.newProjectButton, onClick: () => window.location.assign('/projects/new'), children: [_jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }), "New Project"] }) })] }), isLoading && (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.loadingContainer, children: [_jsx("div", { className: styles.spinner }), _jsx("p", { children: "Loading your dashboard..." })] }), _jsxs("div", { className: styles.skeletonGrid, children: [_jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] }), _jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] }), _jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] }), _jsxs("div", { className: styles.skeletonCard, children: [_jsx("div", { className: styles.skeletonBar, style: { width: '40%' } }), _jsx("div", { className: styles.skeletonBar, style: { width: '60%' } })] })] })] })), error && (_jsxs("div", { className: styles.errorContainer, children: [_jsx("div", { className: styles.errorIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }), _jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })] }) }), _jsx("h3", { children: "Unable to load dashboard" }), _jsx("p", { children: error }), _jsx("button", { onClick: () => fetchDashboardData(1), className: styles.retryButton, children: "Try Again" })] })), !isLoading && !error && analytics && (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.statsGrid, children: [_jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }), _jsx("polyline", { points: "14 2 14 8 20 8" }), _jsx("line", { x1: "16", y1: "13", x2: "8", y2: "13" }), _jsx("line", { x1: "16", y1: "17", x2: "8", y2: "17" }), _jsx("polyline", { points: "10 9 9 9 8 9" })] }) }), _jsxs("div", { className: styles.statContent, children: [_jsx("h3", { children: analytics?.projects?.active ?? 0 }), _jsx("p", { children: "Active Projects" })] })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" }) }) }), _jsxs("div", { className: styles.statContent, children: [_jsx("h3", { children: analytics?.specifications?.total_generated ?? 0 }), _jsx("p", { children: "Generated Specs" })] })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("circle", { cx: "12", cy: "12", r: "10" }), _jsx("polyline", { points: "12,6 12,12 16,14" })] }) }), _jsxs("div", { className: styles.statContent, children: [_jsxs("h3", { children: [Number(analytics?.specifications?.average_time_saved_hours ?? 0).toFixed(1), "h"] }), _jsx("p", { children: "Time Saved" })] })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("path", { d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }), _jsx("circle", { cx: "9", cy: "7", r: "4" }), _jsx("path", { d: "M23 21v-2a4 4 0 0 0-3-3.87" }), _jsx("path", { d: "M16 3.13a4 4 0 0 1 0 7.75" })] }) }), _jsxs("div", { className: styles.statContent, children: [_jsx("h3", { children: analytics?.team?.total_members ?? 0 }), _jsx("p", { children: "Team Members" })] })] })] }), _jsx("div", { className: styles.contentGrid, children: _jsxs("div", { className: styles.section, children: [_jsxs("div", { className: styles.sectionHeader, children: [_jsx("h2", { children: "Recent Projects" }), _jsx("button", { className: styles.viewAllButton, onClick: () => window.location.assign('/projects'), children: "View All" })] }), _jsx("div", { className: styles.projectsList, children: recentProjects.length > 0 ? (recentProjects.map((project) => (_jsxs("div", { className: styles.projectCard, children: [_jsx("div", { className: styles.projectIcon, children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [_jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }), _jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }), _jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })] }) }), _jsxs("div", { className: styles.projectInfo, children: [_jsx("h3", { children: project.name }), _jsx("p", { children: project.description }), _jsxs("div", { className: styles.projectMeta, children: [_jsx("span", { className: styles.projectStatus, style: { color: getProjectStatusColor(project.status || '') }, children: project.status ? (project.status.charAt(0).toUpperCase() + project.status.slice(1)) : 'Unknown' }), _jsx("span", { className: styles.projectDate, children: formatTimeAgo(project.updated_at) })] })] }), _jsx("button", { className: styles.projectAction, onClick: () => window.location.assign(`/projects/${project.id}`), children: _jsx("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: _jsx("path", { d: "M9 18l6-6-6-6" }) }) })] }, project.id)))) : (_jsxs("div", { className: styles.emptyState, children: [_jsx("p", { children: "No recent projects yet." }), _jsxs("div", { style: { display: 'flex', gap: 12, marginTop: 8 }, children: [_jsx("button", { className: styles.newProjectButton, onClick: () => window.location.assign('/projects/new'), children: "Create Project" }), _jsx("button", { className: styles.viewAllButton, onClick: () => window.location.assign('/projects'), children: "View All" })] })] })) })] }) })] }))] }) }) }));
};
