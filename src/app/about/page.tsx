'use client';

import { Suspense } from 'react';
import AboutPage from '@/components/pages/AboutPage';

export default function About() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPage />
    </Suspense>
  );
}

