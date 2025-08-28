import React from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  className?: string;
  onClick?: () => void;
  elevated?: boolean;
  noPadding?: boolean;
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  onClick,
  elevated = false,
  noPadding = false
}) => {
  return (
    <div 
      className={`${styles.card} ${elevated ? styles.elevated : ''} ${noPadding ? styles.noPadding : ''} ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
