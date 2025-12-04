import { Suspense } from 'react';
import BookPage from '@/components/pages/BookPage';

export default function Book() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookPage />
    </Suspense>
  );
}
