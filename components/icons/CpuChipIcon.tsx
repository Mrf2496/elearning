
import React from 'react';

const CpuChipIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.732l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.732l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 4.21l4.5 2.6M12 17.79l4.5-2.6M12 12.5v5.29M16.5 15.19L12 12.5M3 8l9 5.25L21 8M7.5 19.79V12.5" />
  </svg>
);

export default CpuChipIcon;