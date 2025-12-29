import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import PartnerPage from '@/components/pages/PartnerPage';
import { getPartnerBySlug } from '@/data/partners';

export default function PartnerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PartnerPageContent params={params} />
    </Suspense>
  );
}

async function PartnerPageContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerBySlug(slug);

  if (!partner) {
    notFound();
  }

  return (
    <PartnerPage
      partnerName={partner.name}
      heading={partner.heading}
      description={partner.description}
      link={partner.link}
      steps={partner.steps}
      benefits={partner.benefits}
      videoId={partner.videoId}
    />
  );
}

