import ShariahDetailsPage from '@/components/pages/ShariahDetailsPage';

export default async function ShariahDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ShariahDetailsPage fundId={id} />;
}

