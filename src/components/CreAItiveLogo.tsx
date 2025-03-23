
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const CreAItiveLogo: React.FC<LogoProps> = ({ className = '', size = 'medium' }) => {
  const sizes = {
    small: 'w-24',
    medium: 'w-32',
    large: 'w-40',
  };

  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-2">
        <svg 
          className={`${sizes[size]} transition-transform duration-300 hover:scale-105`} 
          viewBox="0 0 120 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M25 20C25 28.2843 18.2843 35 10 35C1.71573 35 -5 28.2843 -5 20C-5 11.7157 1.71573 5 10 5C18.2843 5 25 11.7157 25 20Z" 
            fill="#3AAFA9" 
            fillOpacity="0.2"
          />
          <path 
            d="M20 20C20 25.5228 15.5228 30 10 30C4.47715 30 0 25.5228 0 20C0 14.4772 4.47715 10 10 10C15.5228 10 20 14.4772 20 20Z" 
            stroke="#3AAFA9" 
            strokeWidth="2"
          />
          <path 
            d="M15 20C15 22.7614 12.7614 25 10 25C7.23858 25 5 22.7614 5 20C5 17.2386 7.23858 15 10 15C12.7614 15 15 17.2386 15 20Z" 
            fill="#3AAFA9"
          />
        </svg>
      </div>
      <div className="font-bold text-xl md:text-2xl">
        <span className="text-white">Cre</span>
        <span className="text-vidsmith-accent">AI</span>
        <span className="text-white">tive</span>
      </div>
    </div>
  );
};

export default CreAItiveLogo;
