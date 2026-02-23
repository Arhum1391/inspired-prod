import { Suspense } from 'react';
import ResearchPage from '@/components/pages/ResearchPage';
import PageLoader from '@/components/PageLoader';

export default function Research() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResearchPage />
    </Suspense>
  );
}

