import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { ModernLandingPage } from '@/pages/ModernLandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { EnhancedDashboardPage } from '@/pages/EnhancedDashboardPage';
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

const RequireAuth: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const user = useAuth((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PublicRoute: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const user = useAuth((state) => state.user);
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicRoute><ModernLandingPage /></PublicRoute>,
  },
  {
    path: '/landing-classic',
    element: <PublicRoute><LandingPage /></PublicRoute>,
  },
  {
    path: '/login',
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: '/notifications',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <NotificationsPage /> }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <EnhancedDashboardPage />,
      },
      {
        path: 'classic',
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: '/projects',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <ProjectsPage /> },
      { path: 'new', element: <CreateProjectPage /> },
    ]
  },
  {
    path: '/dev/voice-inspector/:projectId?',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <VoiceModelInspector /> }
    ]
  },
  {
    path: '/projects/:projectId',
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      {
        element: <ProjectLayout />,
        children: [
          { index: true, element: <Navigate to="voice" replace /> },
          { path: 'voice', element: <VoiceIntakePage /> },
          { path: 'template', element: <TemplatePage /> },
          { path: 'wishlist', element: <WishlistPage /> },
          { path: 'review', element: <ReviewPage /> },
        ]
      }
    ]
  },
]);