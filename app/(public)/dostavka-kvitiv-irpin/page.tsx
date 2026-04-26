import type { Metadata } from 'next';
import { GeoLandingPage } from '@/components/florenza/GeoLandingPage';

export const metadata: Metadata = {
  title: 'Доставка квітів Ірпінь — від 60 хвилин',
  description:
    'Доставка квітів по Ірпеню за 60–90 хвилин. Авторські букети Florenza. Тариф 200 грн, безкоштовно від 3000 грн заказу.',
  alternates: { canonical: '/dostavka-kvitiv-irpin' },
};

export default function IrpinDeliveryPage() {
  return (
    <GeoLandingPage
      city="Ірпінь"
      cityGenitive="Ірпеня"
      cityDative="Ірпеню"
      tariff={200}
      timeRange="60–90 хвилин"
      areas={[
        'центр (вул. Соборна, Шевченка)',
        'Покровська',
        'Романовка',
        'Райдужна',
        'Озерна',
        'Лесі Українки',
      ]}
      h1Subtitle="Авторська флористика з доставкою по Ірпеню"
    />
  );
}
