import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { AgentPanel } from './AgentPanel';
import { useAuth } from '@/store/auth';
import styles from './AppShell.module.css';
export const AppShell = ({ children }) => {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const isProjectWorkspace = /^\/projects\/(?!new)([^\/]+)(?:\/|$)/.test(pathname);
    // This component should only render when authenticated
    // The RequireAuth wrapper handles the redirect to login
    return (_jsxs("div", { className: styles.appShell, children: [_jsx(TopBar, {}), _jsxs("div", { className: styles.content, children: [!isProjectWorkspace && _jsx(Sidebar, {}), _jsx("main", { className: styles.main, children: children ?? _jsx(Outlet, {}) }), _jsx(AgentPanel, {})] })] }));
};
