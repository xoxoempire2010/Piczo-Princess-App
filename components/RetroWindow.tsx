import React from 'react';

interface RetroWindowProps {
  title: string;
  children: React.ReactNode;
  icon?: string;
  className?: string;
  headerColor?: string;
}

const RetroWindow: React.FC<RetroWindowProps> = ({ title, children, icon = '💖', className = '', headerColor = 'bg-gradient-to-r from-pink-400 to-purple-400' }) => {
  return (
    <div className={`border-2 border-white/50 rounded-lg bg-white/40 backdrop-blur-xl shadow-lg overflow-hidden flex flex-col ${className}`}>
      <div className={`${headerColor} p-1 px-3 flex items-center justify-between border-b-2 border-white/30`}>
        <div className="flex items-center gap-2 text-white font-pixel tracking-wider text-xl drop-shadow-md">
          <span>{icon}</span>
          <span>{title}</span>
        </div>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white cursor-pointer" />
          <div className="w-3 h-3 rounded-full bg-white/50 hover:bg-white cursor-pointer" />
        </div>
      </div>
      <div className="p-4 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default RetroWindow;