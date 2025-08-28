import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import styles from './EnhancedDashboard.module.css';
import { ProactiveInsightCard } from '../components/ui/ProactiveInsightCard';
import { GlassCard } from '../components/ui/GlassCard';
// Enhanced icons for better visualization
const ProjectIcon = () => (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M3 9H21", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M9 21V9", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
const SpecsIcon = () => (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M14 2V8H20", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M16 13H8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M16 17H8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M10 9H9H8", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
const TimeIcon = () => (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M12 6V12L16 14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
const TeamIcon = () => (_jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }));
// Sample template data
const recommendedTemplates = [
    {
        id: 1,
        name: 'API Requirements',
        description: 'Complete template for defining API requirements with user stories and acceptance criteria',
        popularity: 95,
        category: 'Technical'
    },
    {
        id: 2,
        name: 'Regulatory Compliance',
        description: 'Ensure your product meets industry regulatory standards and compliance requirements',
        popularity: 87,
        category: 'Compliance'
    },
    {
        id: 3,
        name: 'Product Vision Document',
        description: 'Strategic document outlining the vision, goals, and roadmap for product development',
        popularity: 92,
        category: 'Strategy'
    }
];
const recentProjects = [
    {
        id: 1,
        name: 'Jewellery Website',
        status: 'intake',
        lastUpdated: '1 hours ago',
        progress: 25,
        owner: 'You',
        collaborators: 2,
        dueDate: '2025-09-10'
    },
    {
        id: 2,
        name: 'E-Commerce Platform for medicine',
        status: 'intake',
        lastUpdated: '16 days ago',
        progress: 35,
        owner: 'Sarah Chen',
        collaborators: 4,
        dueDate: '2025-09-15'
    },
    {
        id: 3,
        name: 'Acme Chatbot',
        status: 'draft',
        lastUpdated: '16 days ago',
        progress: 60,
        owner: 'You',
        collaborators: 1
    }
];
// Stats data
const statsData = {
    activeProjects: 3,
    generatedSpecs: 12,
    timeSaved: '24.5h',
    teamMembers: 5
};
const EnhancedDashboardPage = () => {
    const [activeTab, setActiveTab] = useState('projects');
    // Get status color based on project status
    const getStatusColor = (status) => {
        switch (status) {
            case 'intake': return styles.statusIntake;
            case 'draft': return styles.statusDraft;
            case 'review': return styles.statusReview;
            case 'completed': return styles.statusCompleted;
            default: return '';
        }
    };
    // Get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case 'intake': return 'Intake';
            case 'draft': return 'Draft';
            case 'review': return 'In Review';
            case 'completed': return 'Completed';
            default: return status;
        }
    };
    return (_jsxs("div", { className: styles.dashboardContainer, children: [_jsxs("div", { className: styles.dashboardHeader, children: [_jsxs("div", { children: [_jsx("h1", { className: styles.welcomeHeading, children: "Welcome to your workspace" }), _jsx("p", { className: styles.welcomeSubheading, children: "Create clear, audit-ready specifications with proactive AI assistance." })] }), _jsxs("div", { className: styles.headerActions, children: [_jsxs("button", { className: styles.newProjectButton, children: [_jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 5V19", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M5 12H19", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }), "New Project"] }), _jsx("button", { className: styles.actionButton, children: _jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M12 3V7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M18.364 5.63604L15.5355 8.46447", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M21 12H17", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M18.364 18.364L15.5355 15.5355", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M12 21V17", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M5.63604 18.364L8.46447 15.5355", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M3 12H7", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M5.63604 5.63604L8.46447 8.46447", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }) })] })] }), _jsxs("div", { className: styles.insightsSection, children: [_jsx("h2", { className: styles.sectionTitle, children: "Proactive Insights" }), _jsxs("div", { className: styles.insightsContainer, children: [_jsx(ProactiveInsightCard, { severity: "warning", title: "Requirements Gap Detected", description: "User authentication requirements in 'E-Commerce Platform' are missing critical security specifications.", actionText: "Review & Fix" }), _jsx(ProactiveInsightCard, { severity: "info", title: "Compliance Check", description: "New GDPR template available that matches your industry requirements.", actionText: "Apply Template" }), _jsx(ProactiveInsightCard, { severity: "success", title: "Audit Ready", description: "'Acme Chatbot' has complete requirements and is ready for compliance review.", actionText: "Start Review" })] })] }), _jsxs("div", { className: styles.statsSection, children: [_jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIconContainer, children: _jsx(ProjectIcon, {}) }), _jsxs("div", { className: styles.statContent, children: [_jsx("span", { className: styles.statValue, children: statsData.activeProjects }), _jsx("span", { className: styles.statLabel, children: "Active Projects" })] })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIconContainer, children: _jsx(SpecsIcon, {}) }), _jsxs("div", { className: styles.statContent, children: [_jsx("span", { className: styles.statValue, children: statsData.generatedSpecs }), _jsx("span", { className: styles.statLabel, children: "Generated Specs" })] })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIconContainer, children: _jsx(TimeIcon, {}) }), _jsxs("div", { className: styles.statContent, children: [_jsx("span", { className: styles.statValue, children: statsData.timeSaved }), _jsx("span", { className: styles.statLabel, children: "Time Saved" })] })] }), _jsxs("div", { className: styles.statCard, children: [_jsx("div", { className: styles.statIconContainer, children: _jsx(TeamIcon, {}) }), _jsxs("div", { className: styles.statContent, children: [_jsx("span", { className: styles.statValue, children: statsData.teamMembers }), _jsx("span", { className: styles.statLabel, children: "Team Members" })] })] })] }), _jsxs("div", { className: styles.contentTabs, children: [_jsxs("div", { className: styles.tabsHeader, children: [_jsx("button", { className: `${styles.tabButton} ${activeTab === 'projects' ? styles.activeTab : ''}`, onClick: () => setActiveTab('projects'), children: "Recent Projects" }), _jsx("button", { className: `${styles.tabButton} ${activeTab === 'templates' ? styles.activeTab : ''}`, onClick: () => setActiveTab('templates'), children: "Recommended Templates" }), _jsx("button", { className: `${styles.tabButton} ${activeTab === 'analytics' ? styles.activeTab : ''}`, onClick: () => setActiveTab('analytics'), children: "Analytics" })] }), _jsxs("div", { className: styles.tabContent, children: [activeTab === 'projects' && (_jsx("div", { className: styles.projectsList, children: _jsxs("table", { className: styles.projectsTable, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Project" }), _jsx("th", { children: "Owner" }), _jsx("th", { children: "Progress" }), _jsx("th", { children: "Status" }), _jsx("th", { children: "Due Date" }), _jsx("th", { children: "Action" })] }) }), _jsx("tbody", { children: recentProjects.map((project) => (_jsxs("tr", { className: styles.projectRow, children: [_jsx("td", { className: styles.projectName, children: _jsxs("div", { className: styles.projectNameContainer, children: [_jsx("span", { className: styles.projectIcon, children: _jsx(ProjectIcon, {}) }), _jsxs("div", { children: [_jsx("span", { className: styles.projectTitle, children: project.name }), _jsxs("span", { className: styles.projectMeta, children: ["Updated ", project.lastUpdated, " \u2022 ", project.collaborators, " collaborators"] })] })] }) }), _jsx("td", { children: project.owner }), _jsxs("td", { children: [_jsx("div", { className: styles.progressBarContainer, children: _jsx("div", { className: styles.progressBar, style: { width: `${project.progress}%` } }) }), _jsxs("div", { className: styles.progressText, children: [project.progress, "%"] })] }), _jsx("td", { children: _jsx("span", { className: `${styles.statusBadge} ${getStatusColor(project.status)}`, children: getStatusLabel(project.status) }) }), _jsx("td", { children: project.dueDate ? new Date(project.dueDate).toLocaleDateString() : '—' }), _jsx("td", { children: _jsx("button", { className: styles.actionLink, children: "Continue" }) })] }, project.id))) })] }) })), activeTab === 'templates' && (_jsx("div", { className: styles.templatesGrid, children: recommendedTemplates.map(template => (_jsxs(GlassCard, { className: styles.templateCard, children: [_jsxs("div", { className: styles.templateHeader, children: [_jsx("span", { className: styles.templateCategory, children: template.category }), _jsxs("span", { className: styles.templatePopularity, children: [template.popularity, "% match"] })] }), _jsx("h3", { className: styles.templateTitle, children: template.name }), _jsx("p", { className: styles.templateDescription, children: template.description }), _jsxs("div", { className: styles.templateActions, children: [_jsx("button", { className: styles.primaryButton, children: "Use Template" }), _jsx("button", { className: styles.secondaryButton, children: "Preview" })] })] }, template.id))) })), activeTab === 'analytics' && (_jsx("div", { className: styles.analyticsContainer, children: _jsxs("div", { className: styles.analyticsPlaceholder, children: [_jsxs("svg", { width: "64", height: "64", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M18 20V10", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M12 20V4", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M6 20V14", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }), _jsx("h3", { children: "Analytics Dashboard" }), _jsx("p", { children: "Track project progress, team performance, and requirement quality metrics" }), _jsx("button", { className: styles.primaryButton, children: "Setup Analytics" })] }) }))] })] })] }));
};
export default EnhancedDashboardPage;
