import React from 'react';

const Logo = ({ size = 'default', showText = true }) => {
  const sizes = {
    small: { icon: 'w-8 h-8', text: 'text-lg' },
    default: { icon: 'w-10 h-10', text: 'text-xl' },
    large: { icon: 'w-14 h-14', text: 'text-2xl' },
    hero: { icon: 'w-20 h-20', text: 'text-4xl' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className="flex items-center gap-3 group">
      {/* Animated Logo Icon */}
      <div className={`${s.icon} relative`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
        
        {/* Main logo container */}
        <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 rounded-xl flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          {/* Building/Launch icon */}
          <svg 
            viewBox="0 0 32 32" 
            className="w-2/3 h-2/3 text-white relative z-10"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* House base */}
            <path d="M4 16 L16 6 L28 16" className="group-hover:stroke-white transition-colors" />
            <path d="M6 14 L6 26 L26 26 L26 14" />
            {/* Door */}
            <rect x="13" y="18" width="6" height="8" />
            {/* Windows */}
            <rect x="8" y="17" width="3" height="3" className="fill-cyan-300/30" />
            <rect x="21" y="17" width="3" height="3" className="fill-cyan-300/30" />
            {/* Rocket/Launch element */}
            <path d="M16 6 L16 2 M14 4 L16 2 L18 4" className="stroke-cyan-300" />
          </svg>
        </div>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-heading font-bold ${s.text} text-white leading-none tracking-tight`}>
            Build<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Launch</span>
          </span>
          {size === 'hero' && (
            <span className="text-sm text-muted-foreground mt-1">Renovation Marketplace</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
