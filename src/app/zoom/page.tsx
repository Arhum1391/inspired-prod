'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const ZoomJoiner = dynamic(() => import('@/components/ZoomJoiner'), { ssr: false });

function ZoomContent() {
  const searchParams = useSearchParams();
  const bootcampId = searchParams.get('bootcampId') || '';

  return (
    <div className="w-full max-w-5xl mt-8">
      <ZoomJoiner bootcampId={bootcampId} />
    </div>
  );
}

export default function ZoomPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar variant="hero" />

      <main className="flex-1 flex flex-col items-center px-4 py-16">
        <Suspense fallback={<div className="w-full max-w-5xl mt-8 min-h-[200px] animate-pulse bg-white/5 rounded-lg" />}>
          <ZoomContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

