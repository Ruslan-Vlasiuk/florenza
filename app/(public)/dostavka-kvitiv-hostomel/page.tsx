import type { Metadata } from 'next';
import { GeoLandingPage } from '@/components/florenza/GeoLandingPage';

export const metadata: Metadata = {
  title: 'Доставка квітів Гостомель — від 60 хвилин',
  description:
    'Доставка квітів по Гостомелю за 60–90 хвилин. Авторські букети Florenza. Тариф 200 грн.',
  alternates: { canonical: '/dostavka-kvitiv-hostomel' },
};

export default function HostomelDeliveryPage() {
  return (
    <GeoLandingPage
      city="Гостомель"
      cityGenitive="Гостомеля"
      cityDative="Гостомелю"
      tariff={200}
      timeRange="60–90 хвилин"
      areas={['центр', 'Свято-Покровська', 'Євгена Рибака', 'Леоніда Бикова', 'Антонова']}
      h1Subtitle="Авторська флористика з доставкою по Гостомелю"
    />
  );
}
