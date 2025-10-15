import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 font-semibold transition-colors duration-200 border-2';
  
  const variantStyles = {
    primary: 'bg-kiwi-500 text-white border-kiwi-500 hover:bg-kiwi-600 hover:border-kiwi-600',
    secondary: 'bg-white text-kiwi-500 border-kiwi-500 hover:bg-kiwi-50',
    outline: 'bg-transparent text-black border-black hover:bg-gray-100',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`}
    >
      {children}
    </button>
  );
}

