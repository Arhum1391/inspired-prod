import { Suspense } from 'react';
import PortfolioPage from '@/components/pages/PortfolioPage';
import PageLoader from '@/components/PageLoader';

export default function Portfolio() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PortfolioPage />
    </Suspense>
  );
}

