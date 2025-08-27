import { jsx as _jsx } from "react/jsx-runtime";
export const GlassCard = ({ children, className }) => {
    return (_jsx("div", { className: `glass ${className ?? ''}`, style: { padding: 16 }, children: children }));
};
