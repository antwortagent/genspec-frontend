import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export const VoiceIntakePage: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
    } else {
      setIsRecording(true);
    }
  };

  return (
    <div style={{padding:"24px",maxWidth:"800px",margin:"0 auto"}}>
      <GlassCard>
        <div style={{padding:"40px",textAlign:"center"}}>
          <h1>Tell us about your project</h1>
          <button onClick={toggleRecording} className="primary">
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          {hasRecorded && <p>Recording complete! Proceed to template selection.</p>}
        </div>
      </GlassCard>
    </div>
  );
};
