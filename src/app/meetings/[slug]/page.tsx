import { Suspense } from 'react';
import MeetingsPage from '@/components/pages/MeetingsPage';
import LoadingScreen from '@/components/LoadingScreen';

export default async function MeetingsWithSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <MeetingsPage slug={slug} />
    </Suspense>
  );
}

