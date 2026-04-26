import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/florenza/LegalDocumentPage';

export const metadata: Metadata = {
  title: 'Публічна оферта',
  description: 'Публічна оферта Florenza — умови купівлі-продажу квітів і композицій.',
  alternates: { canonical: '/oferta' },
  robots: { index: true, follow: true },
};

export default function OfferPage() {
  return <LegalDocumentPage slug="oferta" />;
}
