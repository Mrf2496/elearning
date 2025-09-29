import React from 'react';

const HomeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M4.5 12.75l.75 8.25H18.75l.75-8.25M9.75 21V15a2.25 2.25 0 012.25-2.25h0A2.25 2.25 0 0114.25 15v6" />
  </svg>
);

export default HomeIcon;
