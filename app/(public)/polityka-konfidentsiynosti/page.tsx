import type { Metadata } from 'next';
import { LegalDocumentPage } from '@/components/florenza/LegalDocumentPage';

export const metadata: Metadata = {
  title: 'Політика конфіденційності',
  description:
    'Як Florenza обробляє ваші персональні дані. Без email, без third-party tracking, без cookie banner.',
  alternates: { canonical: '/polityka-konfidentsiynosti' },
};

export default function PrivacyPage() {
  return <LegalDocumentPage slug="polityka-konfidentsiynosti" />;
}
