"use client";

import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const CustomInput: React.FC<Props> = ({ className = '', ...props }) => {
  const base =
    'w-full h-10 border border-white/30 rounded-lg px-4 bg-transparent text-white/60 placeholder-white/30 text-sm font-normal gilroy-medium outline-none focus:border-white/30 focus:ring-0';

  return <input {...props} className={`${base} ${className}`} />;
};

export default CustomInput;
