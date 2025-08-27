import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
export const VoiceIntakePage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [hasRecorded, setHasRecorded] = useState(false);
    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            setHasRecorded(true);
        }
        else {
            setIsRecording(true);
        }
    };
    return (_jsx("div", { style: { padding: "24px", maxWidth: "800px", margin: "0 auto" }, children: _jsx(GlassCard, { children: _jsxs("div", { style: { padding: "40px", textAlign: "center" }, children: [_jsx("h1", { children: "Tell us about your project" }), _jsx("button", { onClick: toggleRecording, className: "primary", children: isRecording ? "Stop Recording" : "Start Recording" }), hasRecorded && _jsx("p", { children: "Recording complete! Proceed to template selection." })] }) }) }));
};
