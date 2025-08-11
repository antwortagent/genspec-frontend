import React from 'react';

export const GlassCard: React.FC<React.PropsWithChildren<{className?:string}>> = ({children,className}) => {
  return (
    <div className={`glass`} style={{padding:16}}>
      {children}
    </div>
  );
};
