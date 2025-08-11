import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export const ReviewPage: React.FC = () => {
  return (
    <GlassCard>
      <h2>Review</h2>
      <p>Approved: 8 / In Review: 3 / Rejected: 1</p>
      <button style={{padding:'10px 12px',borderRadius:12}}>Confirm Wishlist Complete</button>
    </GlassCard>
  );
};
