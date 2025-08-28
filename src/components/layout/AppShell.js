import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { ProactiveAgentPanel } from './ProactiveAgentPanel';
import { useAuth } from '@/store/auth';
import styles from './AppShell.module.css';
export const AppShell = ({ children }) => {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const isProjectWorkspace = /^\/projects\/(?!new)([^\/]+)(?:\/|$)/.test(pathname);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarVisible(false);
            }
            else {
                setSidebarVisible(true);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarVisible(prev => !prev);
    };
    // This component should only render when authenticated
    // The RequireAuth wrapper handles the redirect to login
    return (_jsxs("div", { className: styles.appShell, children: [_jsx(TopBar, { toggleSidebar: toggleSidebar, isSidebarVisible: sidebarVisible, isMobile: isMobile }), _jsxs("div", { className: styles.content, children: [!isProjectWorkspace && _jsx(Sidebar, { visible: sidebarVisible }), _jsx("main", { className: `${styles.main} ${sidebarVisible ? styles.mainWithShadow : ''}`, children: children ?? _jsx(Outlet, {}) }), _jsx(ProactiveAgentPanel, {})] })] }));
};
