import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export const NotificationsPage: React.FC = () => {
  return (
    <GlassCard>
      <h2>Inbox</h2>
      <ul>
        <li>Template ready, seed wishlist? <button>Open</button></li>
        <li>Review items pending <button>Open</button></li>
      </ul>
    </GlassCard>
  );
};
