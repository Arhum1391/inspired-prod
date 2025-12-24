import { Suspense } from 'react';
import MeetingsPage from '@/components/pages/MeetingsPage';

export default function MeetingsWithSlug({
  params,
}: {
  params: { name: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingsPage slug={params.name} />
    </Suspense>
  );
}

