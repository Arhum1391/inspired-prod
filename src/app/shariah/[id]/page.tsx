import ShariahDetailsPage from '@/components/pages/ShariahDetailsPage';

export default function ShariahDetails({ params }: { params: { id: string } }) {
  return <ShariahDetailsPage fundId={params.id} />;
}

