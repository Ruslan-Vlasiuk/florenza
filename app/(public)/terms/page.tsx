import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/florenza/LegalDocumentPage';

export const metadata: Metadata = {
  title: 'Умови використання',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return <LegalDocumentPage slug="terms" />;
}
