'use client';

import Navbar from './Navbar';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden flex flex-col">
      <Navbar variant="hero" />
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div
          className="h-12 w-12 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin"
          aria-hidden
        />
        <p className="text-white/80 text-sm font-medium tracking-wide">
          {message}
        </p>
      </div>
    </div>
  );
}

