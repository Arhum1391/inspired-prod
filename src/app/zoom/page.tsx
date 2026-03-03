'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

const ZoomJoiner = dynamic(() => import('@/components/ZoomJoiner'), { ssr: false });

export default function ZoomPage() {
  const searchParams = useSearchParams();
  const bootcampId = searchParams.get('bootcampId') || '';

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar variant="hero" />

      <main className="flex-1 flex flex-col items-center px-4 py-16">
        <div className="w-full max-w-5xl mt-8">
          <ZoomJoiner bootcampId={bootcampId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

