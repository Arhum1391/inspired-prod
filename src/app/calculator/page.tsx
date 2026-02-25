import { Suspense } from 'react';
import CalculatorPage from '@/components/pages/CalculatorPage';
import PageLoader from '@/components/PageLoader';

export default function Calculator() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CalculatorPage />
    </Suspense>
  );
}

