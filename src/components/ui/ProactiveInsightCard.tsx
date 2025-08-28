import React from 'react';
import styles from './ProactiveInsightCard.module.css';

interface ProactiveInsightCardProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  severity?: 'info' | 'warning' | 'success' | 'alert';
  icon?: React.ReactNode;
}

export const ProactiveInsightCard: React.FC<ProactiveInsightCardProps> = ({
  title,
  description,
  actionText = "View Details",
  onAction,
  severity = 'info',
  icon
}) => {
  const iconMap = {
    info: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    warning: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    success: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    alert: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    )
  };

  return (
    <div className={`${styles.card} ${styles[severity]}`}>
      <div className={styles.iconContainer}>
        {icon || iconMap[severity]}
      </div>
      <div className={styles.content}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
