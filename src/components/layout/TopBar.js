import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from '@/styles/TopBar.module.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/store/auth';
export const TopBar = () => {
    const { pathname } = useLocation();
    const isAuth = pathname === '/login';
    const { user, logout } = useAuth();
    return (_jsxs("header", { className: styles.topbar, children: [_jsxs("div", { className: styles.left, children: [_jsx(Link, { to: "/", className: styles.logo, children: "GenSpec" }), !isAuth && (_jsxs("nav", { style: { marginLeft: '32px', display: 'flex', gap: '24px' }, children: [_jsx(Link, { to: "/dashboard", style: { color: 'var(--text)', textDecoration: 'none', fontWeight: '500' }, children: "Dashboard" }), _jsx(Link, { to: "/projects", style: { color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }, children: "Projects" }), _jsx(Link, { to: "/notifications", style: { color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }, children: "Notifications" })] }))] }), !isAuth && (_jsx("div", { className: styles.right, children: user && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '16px' }, children: [_jsx("span", { style: { fontSize: '14px', color: 'var(--text-muted)' }, children: user.email }), _jsx("button", { onClick: logout, style: {
                                background: 'none',
                                border: '1px solid var(--glass-border)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                color: 'var(--text-muted)',
                                fontSize: '14px',
                                cursor: 'pointer'
                            }, children: "Sign out" })] })) }))] }));
};
