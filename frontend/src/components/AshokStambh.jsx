import React from 'react';

const AshokStambh = ({ className = "w-8 h-8", color = "#1e40af" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ashok Stambh - Simplified version */}
      <g fill={color}>
        {/* Base */}
        <ellipse cx="50" cy="90" rx="25" ry="8" opacity="0.3"/>
        
        {/* Pillar */}
        <rect x="47" y="60" width="6" height="30" rx="3"/>
        
        {/* Lions (simplified) */}
        <circle cx="35" cy="45" r="8"/>
        <circle cx="50" cy="40" r="8"/>
        <circle cx="65" cy="45" r="8"/>
        
        {/* Crown/Top */}        
        <path d="M30 35 L50 25 L70 35 L65 45 L50 40 L35 45 Z"/>
        
        {/* Chakra (wheel) in center */}
        <circle cx="50" cy="70" r="8" fill="none" stroke={color} strokeWidth="1"/>
        <circle cx="50" cy="70" r="2"/>
        
        {/* Spokes */}
        <g stroke={color} strokeWidth="0.5">
          <line x1="50" y1="62" x2="50" y2="78"/>
          <line x1="42" y1="70" x2="58" y2="70"/>
          <line x1="44.3" y1="64.3" x2="55.7" y2="75.7"/>
          <line x1="55.7" y1="64.3" x2="44.3" y2="75.7"/>
        </g>
        
        {/* Motto base */}
        <rect x="35" y="85" width="30" height="4" rx="2" opacity="0.6"/>
      </g>
    </svg>
  );
};

export default AshokStambh;