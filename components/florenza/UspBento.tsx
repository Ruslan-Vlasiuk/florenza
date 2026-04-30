'use client';

import { motion } from 'framer-motion';
import { Clock, MapPin, Sparkles, MessageCircle } from 'lucide-react';

const ITEMS = [
  {
    icon: Clock,
    title: 'Доставка за 60–90 хвилин',
    body: 'Термінова доставка по Ірпеню, Бучі, Гостомелю — за годину після оплати. Жоден інший флорист в регіоні цього не пропонує.',
  },
  {
    icon: Sparkles,
    title: 'Авторська флористика',
    body: 'Ми не «продаємо квіти». Ми складаємо букети, які тримаються в одному ключі — від кольору до настрою.',
  },
  {
    icon: MessageCircle,
    title: 'Замовлення 24/7',
    body: 'Telegram, Viber або чат на сайті — підкажемо, оформимо, приймемо оплату. Швидко і у будь-який час дня і ночі.',
  },
  {
    icon: MapPin,
    title: 'Ірпінь, Буча, Гостомель, Київ',
    body: 'Бутік в Ірпені, доставка по всьому ИБГ та ближньому Києву. Локально, з рукою на пульсі.',
  },
];

export function UspBento() {
  return (
    <section className="editorial-container py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="p-8 md:p-10 rounded-[var(--radius-lg)] bg-[var(--color-bg-elevated)] border border-[var(--color-border-soft)]"
          >
            <item.icon
              className="text-[var(--color-sage-deep)]"
              size={28}
              strokeWidth={1.4}
            />
            <h3 className="mt-6 font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] leading-tight">
              {item.title}
            </h3>
            <p className="mt-4 text-[var(--color-text-secondary)] leading-relaxed">
              {item.body}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
