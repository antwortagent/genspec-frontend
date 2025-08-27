import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { projectsApi } from '@/api/services';

export const CreateProjectPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
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
    } catch (e: any) {
      setError(e?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: '0 auto' }}>
      <GlassCard>
        <form onSubmit={onSubmit} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h1 style={{ margin: 0 }}>Create Project</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Start a new specification workspace</p>
          </div>
          {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="name">Project name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., E-commerce Platform" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label htmlFor="desc">Description (optional)</label>
            <textarea id="desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short context about the project" style={{ padding: 10, borderRadius: 10, border: '1px solid var(--border)' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="ghost" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="primary" disabled={isLoading}>{isLoading ? 'Creating…' : 'Create Project'}</button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
