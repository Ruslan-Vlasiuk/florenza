import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Inter } from 'next/font/google';
import { Header } from '@/components/florenza/Header';
import { Footer } from '@/components/florenza/Footer';
import { LiyaChatLauncher } from '@/components/florenza/LiyaChatLauncher';
import { LenisProvider } from '@/components/florenza/LenisProvider';
import { LocalBusinessSchema } from '@/components/seo/LocalBusinessSchema';
import { ScrollColorWash } from '@/components/florenza/effects/ScrollColorWash';
import { BackToTop } from '@/components/florenza/BackToTop';
import { SandboxPaymentBanner } from '@/components/florenza/SandboxPaymentBanner';
import { getPayloadClient } from '@/lib/payload-client';
import '../globals.css';

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://florenza-irpin.com'),
  title: {
    default: 'Florenza — флористичний бутік в Ірпені',
    template: '%s — Florenza',
  },
  description:
    'Florenza — преміум флористичний бутік в Ірпені. Авторські букети, доставка по Ірпеню, Бучі, Гостомелю та Києву. Тиха editorial-естетика.',
  keywords: [
    'флорист Ірпінь',
    'доставка квітів Ірпінь',
    'букет Буча',
    'квіти Гостомель',
    'весільна флористика',
    'корпоративна флористика',
    'флорист Київ',
  ],
  authors: [{ name: 'Florenza' }],
  creator: 'Florenza',
  publisher: 'ФОП Каракой В. О.',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'uk_UA',
    url: '/',
    siteName: 'Florenza',
    title: 'Florenza — флористичний бутік в Ірпені',
    description:
      'Преміум авторська флористика. Editorial-естетика. Доставка по ИБГ та ближньому Києву.',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Florenza — флористичний бутік',
    description: 'Преміум авторська флористика в Ірпені',
    images: ['/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F0E8',
};

async function loadPaymentBanner() {
  try {
    const payload = await getPayloadClient();
    const settings: any = await payload.findGlobal({ slug: 'brand-settings' as any });
    return {
      enabled: settings?.paymentMode === 'sandbox',
      text:
        settings?.sandboxBannerText ??
        '🌿 Прийом онлайн-платежів — тестовий режим. Замовлення приймаються, оплата при доставці готівкою або карткою.',
    };
  } catch {
    return { enabled: false, text: '' };
  }
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const banner = await loadPaymentBanner();

  return (
    <html lang="uk" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="florenza-public">
        <SandboxPaymentBanner enabled={banner.enabled} text={banner.text} />
        <ScrollColorWash />
        <LenisProvider>
          <LocalBusinessSchema />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <LiyaChatLauncher />
          <BackToTop />
        </LenisProvider>
      </body>
    </html>
  );
}
