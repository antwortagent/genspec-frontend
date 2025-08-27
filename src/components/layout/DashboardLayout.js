import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { AppShell } from './AppShell';
import styles from './DashboardLayout.module.css';
export const DashboardLayout = () => {
    return (_jsx("div", { className: styles.dashboardLayout, children: _jsx(AppShell, { children: _jsx(Outlet, {}) }) }));
};
