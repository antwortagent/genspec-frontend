import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import styles from '@/styles/Sidebar.module.css';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
export const Sidebar = ({ visible = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const sidebarRef = useRef(null);
    // Animation effect for sidebar
    useEffect(() => {
        const sidebar = sidebarRef.current;
        if (sidebar) {
            if (visible) {
                sidebar.style.transform = 'translateX(0)';
                sidebar.style.opacity = '1';
            }
            else {
                sidebar.style.transform = 'translateX(-100%)';
                sidebar.style.opacity = '0';
            }
        }
    }, [visible]);
    if (!visible) {
        return null; // Don't render if not visible (on mobile)
    }
    return (_jsxs("aside", { className: styles.sidebar, ref: sidebarRef, style: {
            transition: 'transform 0.3s ease, opacity 0.3s ease',
        }, children: [_jsx("div", { className: styles.sectionLabel, children: "Artifacts" }), _jsxs("nav", { className: styles.nav, children: [_jsxs(NavLink, { to: "/dashboard", className: ({ isActive }) => isActive ? styles.active : styles.navLink, children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("rect", { x: "3", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "3", width: "7", height: "7" }), _jsx("rect", { x: "14", y: "14", width: "7", height: "7" }), _jsx("rect", { x: "3", y: "14", width: "7", height: "7" })] }), "Dashboard"] }), _jsxs(NavLink, { to: "/projects", className: ({ isActive }) => isActive || location.pathname.includes('/projects/') ? styles.active : styles.navLink, children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: _jsx("path", { d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }) }), "Projects"] }), _jsxs(NavLink, { to: "/notifications", className: ({ isActive }) => isActive ? styles.active : styles.navLink, children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("path", { d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" }), _jsx("path", { d: "M13.73 21a2 2 0 0 1-3.46 0" })] }), "Inbox"] })] }), _jsx("div", { className: styles.spacer }), _jsxs("button", { className: styles.create, onClick: () => navigate('/projects/new'), children: [_jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [_jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }), _jsx("line", { x1: "5", y1: "12", x2: "19", y2: "12" })] }), "Create Project"] })] }));
};
