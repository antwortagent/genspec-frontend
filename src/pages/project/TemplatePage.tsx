import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

export const TemplatePage: React.FC = () => {
  return (
    <GlassCard>
      <h2>Template Preview</h2>
      <p>Template: "E-commerce Web" v1.0</p>
      <button style={{padding:'10px 12px',borderRadius:12}}>Seed Wishlist</button>
    </GlassCard>
  );
};
