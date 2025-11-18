import React from 'react';

interface NeonButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'pink' | 'blue' | 'purple';
  className?: string;
  disabled?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ children, onClick, variant = 'pink', className = '', disabled = false }) => {
  const baseStyles = "relative font-pixel text-lg px-6 py-2 border-2 uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    pink: "border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-white hover:shadow-neon-pink shadow-[0_0_10px_rgba(255,110,199,0.4)]",
    blue: "border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-black hover:shadow-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.4)]",
    purple: "border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white hover:shadow-[0_0_15px_#bc13fe] shadow-[0_0_10px_rgba(188,19,254,0.4)]",
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* Shine effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 hover:opacity-10 transition-opacity" />
      {children}
    </button>
  );
};

export default NeonButton;