import { Suspense } from 'react';
import ShariahPage from '@/components/pages/ShariahPage';

export default function Shariah() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShariahPage />
    </Suspense>
  );
}

