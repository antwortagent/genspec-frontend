import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';
import { projectsApi, type Project } from '@/api/services';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await projectsApi.getProjects();
      setProjects(data);
      setError(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = projects.filter(p =>
    [p.name, p.description].filter(Boolean).some(txt => txt!.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Projects</h1>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>Browse and manage all your projects</p>
        </div>
        <button className="primary" onClick={() => navigate('/projects/new')}>New Project</button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', minWidth: 280 }}
        />
        <button className="ghost" onClick={load}>Refresh</button>
      </div>

      {isLoading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading projects…</div>
      )}
      {error && (
        <div style={{ padding: 16, color: 'var(--danger)' }}>{error}</div>
      )}

      {!isLoading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((p) => (
            <GlassCard key={p.id}>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0 }}>{p.name}</h3>
                  <span className={`chip ${p.status.replace('-', '_')}`}>{p.status}</span>
                </div>
                {p.description && (
                  <p style={{ margin: 0, color: 'var(--text-muted)', minHeight: 40 }}>{p.description}</p>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <Link to={`/projects/${p.id}`} className="ghost" style={{ textDecoration: 'none' }}>Open</Link>
                </div>
              </div>
            </GlassCard>
          ))}
          {filtered.length === 0 && (
            <GlassCard>
              <div style={{ padding: 24, textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>No projects found</p>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
};
