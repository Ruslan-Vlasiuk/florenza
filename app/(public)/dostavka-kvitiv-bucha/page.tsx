import type { Metadata } from 'next';
import { GeoLandingPage } from '@/components/florenza/GeoLandingPage';

export const metadata: Metadata = {
  title: 'Доставка квітів Буча — від 60 хвилин',
  description:
    'Доставка квітів по Бучі за 60–90 хвилин. Авторські букети Florenza. Тариф 200 грн, безкоштовно від 3000 грн заказу.',
  alternates: { canonical: '/dostavka-kvitiv-bucha' },
};

export default function BuchaDeliveryPage() {
  return (
    <GeoLandingPage
      city="Буча"
      cityGenitive="Бучі"
      cityDative="Бучі"
      tariff={200}
      timeRange="60–90 хвилин"
      areas={['центр', 'Лісова', 'Енергетична', 'Михайлівська', 'Польова', 'Тарасівська']}
      h1Subtitle="Авторська флористика з доставкою по Бучі"
    />
  );
}
