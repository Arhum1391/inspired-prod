interface PageLoaderProps {
  message?: string;
}

/**
 * Centered full-screen loader for Suspense fallbacks and page transitions.
 * Matches app theme with a polished spinner and optional message.
 */
export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
      {/* Spinner - gradient ring */}
      <div
        className="h-12 w-12 rounded-full border-2 border-white/10 border-t-indigo-500 animate-spin"
        aria-hidden
      />
      <p className="text-white/80 text-sm font-medium tracking-wide">
        {message}
      </p>
    </div>
  );
}
