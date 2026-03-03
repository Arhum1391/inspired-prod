import { Suspense } from 'react';
import MeetingsPage from '@/components/pages/MeetingsPage';
import LoadingScreen from '@/components/LoadingScreen';

export default async function MeetingsWithSlug({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <MeetingsPage slug={slug} />
    </Suspense>
  );
}

