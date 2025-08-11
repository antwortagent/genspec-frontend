import React from 'react';
import { Outlet, NavLink, useParams } from 'react-router-dom';
import { GlassCard } from '@/components/ui/GlassCard';

export const ProjectLayout: React.FC = () => {
  const { projectId } = useParams();
  return (
    <div style={{display:'grid',gridTemplateColumns:'280px 1fr',gap:16}}>
      <GlassCard>
        <h3>Artifacts</h3>
        <nav style={{display:'flex',flexDirection:'column',gap:8}}>
          <NavLink to={`/projects/${projectId}/wishlist`}>Wishlist</NavLink>
        </nav>
      </GlassCard>
      <div>
        <Outlet />
      </div>
    </div>
  );
};
