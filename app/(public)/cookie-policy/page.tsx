import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/florenza/LegalDocumentPage';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  alternates: { canonical: '/cookie-policy' },
};

export default function CookiePage() {
  return <LegalDocumentPage slug="cookie-policy" />;
}
