import { jsx as _jsx } from "react/jsx-runtime";
import styles from './GlassCard.module.css';
export const GlassCard = ({ children, className, onClick, elevated = false, noPadding = false }) => {
    return (_jsx("div", { className: `${styles.card} ${elevated ? styles.elevated : ''} ${noPadding ? styles.noPadding : ''} ${className ?? ''}`, onClick: onClick, children: children }));
};
