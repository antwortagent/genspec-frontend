import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useParams, Link, useLocation } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import styles from './ProjectLayout.module.css';
import { projectsApi } from '@/api/services';
export const ProjectLayout = () => {
    const { projectId } = useParams();
    const { pathname } = useLocation();
    const step = pathname.endsWith('/voice') ? 'voice' : pathname.endsWith('/template') ? 'template' : pathname.endsWith('/wishlist') ? 'wishlist' : pathname.endsWith('/review') ? 'review' : 'voice';
    const stepOrder = [
        { key: 'voice', label: 'Voice Intake', to: `/projects/${projectId}/voice` },
        { key: 'template', label: 'Template', to: `/projects/${projectId}/template` },
        { key: 'wishlist', label: 'Wishlist', to: `/projects/${projectId}/wishlist` },
        { key: 'review', label: 'Review', to: `/projects/${projectId}/review` },
    ];
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!projectId)
                return;
            try {
                setLoading(true);
                const p = await projectsApi.getProject(projectId);
                if (mounted) {
                    setProject(p);
                    setError(null);
                }
            }
            catch (e) {
                if (mounted)
                    setError('Failed to load project');
            }
            finally {
                if (mounted)
                    setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, [projectId]);
    const statusClass = useMemo(() => {
        const s = project?.status;
        if (!s)
            return 'draft';
        return s.replace('-', '_');
    }, [project?.status]);
    return (_jsxs("div", { className: styles.container, children: [_jsx(GlassCard, { children: _jsxs("div", { className: styles.artifactsCard, children: [_jsxs("div", { className: styles.artifactsHeader, children: [_jsx("h3", { className: styles.artifactsTitle, children: "Artifacts" }), _jsxs(Link, { to: `/projects/${projectId}`, className: styles.projectId, children: ["#", projectId] })] }), _jsx("nav", { className: styles.artifactsNav, children: stepOrder.map(s => (_jsx(NavLink, { to: s.to, className: ({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`, children: s.label }, s.key))) })] }) }), _jsxs("div", { className: styles.stageArea, children: [_jsx(GlassCard, { children: _jsxs("div", { className: styles.headerBar, children: [_jsxs("div", { className: styles.headerLeft, children: [_jsx("h2", { className: styles.projectTitle, children: project?.name || 'Project' }), _jsx("span", { className: `chip ${statusClass}`, children: project?.status || 'draft' })] }), _jsx("div", { className: styles.stepper, children: stepOrder.map((s, idx) => (_jsxs(Link, { to: s.to, className: `${styles.step} ${step === s.key ? styles.stepActive : ''}`, children: [_jsx("span", { className: styles.stepIndex, children: idx + 1 }), _jsx("span", { children: s.label })] }, s.key))) })] }) }), _jsx("div", { className: styles.outletArea, children: _jsx(Outlet, {}) })] })] }));
};
