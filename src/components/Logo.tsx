
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  // Get size dimensions
  const getSizeDimensions = () => {
    switch (size) {
      case 'small': return 'h-6 w-6';
      case 'large': return 'h-12 w-12';
      case 'medium':
      default: return 'h-8 w-8';
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small': return 'text-xs';
      case 'large': return 'text-base';
      case 'medium':
      default: return 'text-sm';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 'text-lg';
      case 'large': return 'text-2xl';
      case 'medium':
      default: return 'text-xl';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${getSizeDimensions()}`}>
        <div className="absolute inset-0 bg-inuka-terracotta rounded-full opacity-20"></div>
        <div className="absolute inset-[3px] bg-inuka-terracotta rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-white font-bold ${getFontSize()}`}>I</span>
        </div>
      </div>
      <span className={`font-bold text-inuka-brown ${getTextSize()}`}>Inuka</span>
    </div>
  );
};

export default Logo;
