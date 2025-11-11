import React from 'react';

const KeyIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17.5v3c0 .552-.448 1-1 1s-1-.448-1-1v-3l-1.257-.754A6 6 0 013 12a6 6 0 016-6h.75" />
  </svg>
);
export default KeyIcon;
