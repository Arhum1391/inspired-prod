import { Suspense } from 'react';
import MeetingsPage from '@/components/pages/MeetingsPage';
import PageLoader from '@/components/PageLoader';

export default function Meetings() {
  return (
    <Suspense fallback={<PageLoader />}>
      <MeetingsPage />
    </Suspense>
  );
}
