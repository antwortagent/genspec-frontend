import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from '@/styles/Sidebar.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
export const Sidebar = () => {
    const navigate = useNavigate();
    return (_jsxs("aside", { className: styles.sidebar, children: [_jsx("div", { className: styles.sectionLabel, children: "Artifacts" }), _jsxs("nav", { className: styles.nav, children: [_jsx(NavLink, { to: "/dashboard", className: ({ isActive }) => isActive ? styles.active : '', children: "Dashboard" }), _jsx(NavLink, { to: "/projects", className: ({ isActive }) => isActive ? styles.active : '', children: "Projects" }), _jsx(NavLink, { to: "/notifications", className: ({ isActive }) => isActive ? styles.active : '', children: "Inbox" })] }), _jsx("div", { className: styles.spacer }), _jsx("button", { className: styles.create, onClick: () => navigate('/projects/new'), children: "+ Create Project" })] }));
};
