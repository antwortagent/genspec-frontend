import React from 'react';
import styles from '@/styles/AgentPanel.module.css';

export const AgentPanel: React.FC = () => {
  return (
    <aside className={styles.panel}>
      <div className={styles.header}>Mentor Agent</div>
      <div className={styles.body}>
        <div className={styles.chatBubble}>Hi! I’ll help you through Stage 1.</div>
        <div className={styles.status}>Voice: idle</div>
      </div>
    </aside>
  );
};
