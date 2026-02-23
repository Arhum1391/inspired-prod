import { Suspense } from 'react';
import ShariahPage from '@/components/pages/ShariahPage';
import PageLoader from '@/components/PageLoader';

export default function Shariah() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ShariahPage />
    </Suspense>
  );
}

