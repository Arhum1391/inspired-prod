'use client';

import { Suspense } from 'react';
import AboutPage from '@/components/pages/AboutPage';
import PageLoader from '@/components/PageLoader';

export default function About() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AboutPage />
    </Suspense>
  );
}

