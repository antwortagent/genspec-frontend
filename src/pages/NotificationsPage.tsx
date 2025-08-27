import React, { useMemo, useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

type Notification = {
  id: string;
  projectId: string;
  projectName: string;
  type: 'template_ready' | 'wishlist_pending_review' | 'voice_complete';
  title: string;
  createdAt: string;
  read?: boolean;
};

const demo: Notification[] = [
  { id: 'n1', projectId: 'p1', projectName: 'E‑commerce', type: 'template_ready', title: 'Template ready, seed wishlist?', createdAt: new Date().toISOString() },
  { id: 'n2', projectId: 'p2', projectName: 'Mobile App', type: 'wishlist_pending_review', title: 'Review items pending', createdAt: new Date(Date.now() - 3600_000).toISOString() },
  { id: 'n3', projectId: 'p1', projectName: 'E‑commerce', type: 'voice_complete', title: 'Voice processing complete', createdAt: new Date(Date.now() - 86_400_000).toISOString() },
];

export const NotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [type, setType] = useState<'all' | Notification['type']>('all');

  const items = useMemo(() => {
    return demo.filter(n => (filter === 'all' || !n.read) && (type === 'all' || n.type === type));
  }, [filter, type]);

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Inbox</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
          <select value={type} onChange={(e) => setType(e.target.value as any)}>
            <option value="all">All types</option>
            <option value="template_ready">Template ready</option>
            <option value="wishlist_pending_review">Wishlist pending review</option>
            <option value="voice_complete">Voice complete</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(n => (
          <GlassCard key={n.id}>
            <div style={{ padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={`chip ${n.type.replace(/-/g,'_')}`}>{n.projectName}</span>
                  <strong>{n.title}</strong>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {n.type === 'template_ready' && (
                  <a className="primary" href={`/projects/${n.projectId}/template`} style={{ textDecoration: 'none' }}>Open</a>
                )}
                {n.type === 'wishlist_pending_review' && (
                  <a className="primary" href={`/projects/${n.projectId}/wishlist`} style={{ textDecoration: 'none' }}>Open</a>
                )}
                {n.type === 'voice_complete' && (
                  <a className="primary" href={`/projects/${n.projectId}/template`} style={{ textDecoration: 'none' }}>Open</a>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
        {items.length === 0 && (
          <GlassCard>
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
              You’re all caught up!
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};
