import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { projectsApi } from '@/api/services';
export const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const load = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await projectsApi.getProjects();
            setProjects(data);
            setError(null);
        }
        catch (e) {
            setError(e?.message || 'Failed to load projects');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => { load(); }, [load]);
    const filtered = projects.filter(p => [p.name, p.description].filter(Boolean).some(txt => txt.toLowerCase().includes(query.toLowerCase())));
    return (_jsxs("div", { style: { padding: '24px', maxWidth: 1200, margin: '0 auto' }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, children: [_jsxs("div", { children: [_jsx("h1", { style: { margin: 0 }, children: "Projects" }), _jsx("p", { style: { margin: 0, color: 'var(--text-muted)' }, children: "Browse and manage all your projects" })] }), _jsx("button", { className: "primary", onClick: () => navigate('/projects/new'), children: "New Project" })] }), _jsxs("div", { style: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }, children: [_jsx("input", { type: "text", placeholder: "Search projects...", value: query, onChange: (e) => setQuery(e.target.value), style: { padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', minWidth: 280 } }), _jsx("button", { className: "ghost", onClick: load, children: "Refresh" })] }), isLoading && (_jsx("div", { style: { padding: 40, textAlign: 'center', color: 'var(--text-muted)' }, children: "Loading projects\u2026" })), error && (_jsx("div", { style: { padding: 16, color: 'var(--danger)' }, children: error })), !isLoading && !error && (_jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }, children: [filtered.map((p) => (_jsx(GlassCard, { children: _jsxs("div", { style: { padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("h3", { style: { margin: 0 }, children: p.name }), _jsx("span", { className: `chip ${p.status.replace('-', '_')}`, children: p.status })] }), p.description && (_jsx("p", { style: { margin: 0, color: 'var(--text-muted)', minHeight: 40 }, children: p.description })), _jsx("div", { style: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }, children: _jsx(Link, { to: `/projects/${p.id}`, className: "ghost", style: { textDecoration: 'none' }, children: "Open" }) })] }) }, p.id))), filtered.length === 0 && (_jsx(GlassCard, { children: _jsx("div", { style: { padding: 24, textAlign: 'center' }, children: _jsx("p", { style: { margin: 0, color: 'var(--text-muted)' }, children: "No projects found" }) }) }))] }))] }));
};
