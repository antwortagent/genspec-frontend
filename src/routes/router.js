import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import ModernLandingPage from '@/pages/modern/ModernLandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import EnhancedDashboardPage from '@/pages/EnhancedDashboard';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { ProjectLayout } from '@/pages/project/ProjectLayout';
import { VoiceIntakePage } from '@/pages/project/VoiceIntakePage';
import { TemplatePage } from '@/pages/project/TemplatePage';
import { WishlistPage } from '@/pages/project/WishlistPage';
import { ReviewPage } from '@/pages/project/ReviewPage';
import { CreateProjectPage } from '../pages/project/CreateProjectPage';
import { VoiceModelInspector } from '@/components/dev/VoiceModelInspector';
import { useAuth } from '@/store/auth';
const RequireAuth = ({ children }) => {
    const user = useAuth((state) => state.user);
    if (!user) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
const PublicRoute = ({ children }) => {
    const user = useAuth((state) => state.user);
    if (user) {
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export const router = createBrowserRouter([
    {
        path: '/',
        element: _jsx(PublicRoute, { children: _jsx(ModernLandingPage, {}) }),
    },
    {
        path: '/landing-classic',
        element: _jsx(PublicRoute, { children: _jsx(LandingPage, {}) }),
    },
    {
        path: '/login',
        element: _jsx(PublicRoute, { children: _jsx(LoginPage, {}) }),
    },
    {
        path: '/notifications',
        element: (_jsx(RequireAuth, { children: _jsx(DashboardLayout, {}) })),
        children: [
            { index: true, element: _jsx(NotificationsPage, {}) }
        ]
    },
    {
        path: '/dashboard',
        element: (_jsx(RequireAuth, { children: _jsx(DashboardLayout, {}) })),
        children: [
            {
                index: true,
                element: _jsx(EnhancedDashboardPage, {}),
            },
            {
                path: 'classic',
                element: _jsx(DashboardPage, {}),
            },
        ],
    },
    {
        path: '/projects',
        element: (_jsx(RequireAuth, { children: _jsx(DashboardLayout, {}) })),
        children: [
            { index: true, element: _jsx(ProjectsPage, {}) },
            { path: 'new', element: _jsx(CreateProjectPage, {}) },
        ]
    },
    {
        path: '/dev/voice-inspector/:projectId?',
        element: (_jsx(RequireAuth, { children: _jsx(DashboardLayout, {}) })),
        children: [
            { index: true, element: _jsx(VoiceModelInspector, {}) }
        ]
    },
    {
        path: '/projects/:projectId',
        element: (_jsx(RequireAuth, { children: _jsx(DashboardLayout, {}) })),
        children: [
            {
                element: _jsx(ProjectLayout, {}),
                children: [
                    { index: true, element: _jsx(Navigate, { to: "voice", replace: true }) },
                    { path: 'voice', element: _jsx(VoiceIntakePage, {}) },
                    { path: 'template', element: _jsx(TemplatePage, {}) },
                    { path: 'wishlist', element: _jsx(WishlistPage, {}) },
                    { path: 'review', element: _jsx(ReviewPage, {}) },
                ]
            }
        ]
    },
]);
