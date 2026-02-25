import { Suspense } from 'react';
import HomePage from '@/components/HomePage';
import PageLoader from '@/components/PageLoader';

export default function Home() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomePage />
    </Suspense>
  );
}
