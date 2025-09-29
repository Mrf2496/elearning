
import React from 'react';

const AwardIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.518l-1.09.288-1.09-.288a.5.5 0 00-.28-.976l1.22-1.222a.5.5 0 01.708 0l1.22 1.222a.5.5 0 00-.28.976z" transform="translate(-3.5 -3)" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-1.5M8.25 18.75l.75-1.3M15.75 18.75l-.75-1.3M4.5 14.25H6M18 14.25h-1.5m-12-4.5H6M18 9.75h-1.5" />
 </svg>
);

export default AwardIcon;
