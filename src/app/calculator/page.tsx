import { Suspense } from 'react';
import CalculatorPage from '@/components/pages/CalculatorPage';

export default function Calculator() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CalculatorPage />
    </Suspense>
  );
}

