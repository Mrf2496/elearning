import React from 'react';

const RefreshIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 4a14.95 14.95 0 0114.326 9.674M20 20a14.95 14.95 0 01-14.326-9.674" />
  </svg>
);
export default RefreshIcon;
