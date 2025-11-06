import { Suspense } from 'react';
import ResearchPage from '@/components/pages/ResearchPage';

export default function Research() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResearchPage />
    </Suspense>
  );
}

