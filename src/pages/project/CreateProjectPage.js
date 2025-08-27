import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { projectsApi } from '@/api/services';
export const CreateProjectPage = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!name.trim()) {
            setError('Project name is required');
            return;
        }
        try {
            setIsLoading(true);
            const project = await projectsApi.createProject({ name: name.trim(), description });
            navigate(`/projects/${project.id}`);
        }
        catch (e) {
            setError(e?.message || 'Failed to create project');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { style: { padding: 24, maxWidth: 720, margin: '0 auto' }, children: _jsx(GlassCard, { children: _jsxs("form", { onSubmit: onSubmit, style: { padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }, children: [_jsxs("div", { children: [_jsx("h1", { style: { margin: 0 }, children: "Create Project" }), _jsx("p", { style: { margin: 0, color: 'var(--text-muted)' }, children: "Start a new specification workspace" })] }), error && _jsx("div", { style: { color: 'var(--danger)' }, children: error }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 6 }, children: [_jsx("label", { htmlFor: "name", children: "Project name" }), _jsx("input", { id: "name", value: name, onChange: (e) => setName(e.target.value), placeholder: "e.g., E-commerce Platform" })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 6 }, children: [_jsx("label", { htmlFor: "desc", children: "Description (optional)" }), _jsx("textarea", { id: "desc", rows: 4, value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Short context about the project", style: { padding: 10, borderRadius: 10, border: '1px solid var(--border)' } })] }), _jsxs("div", { style: { display: 'flex', gap: 8, justifyContent: 'flex-end' }, children: [_jsx("button", { type: "button", className: "ghost", onClick: () => navigate(-1), children: "Cancel" }), _jsx("button", { type: "submit", className: "primary", disabled: isLoading, children: isLoading ? 'Creating…' : 'Create Project' })] })] }) }) }));
};
