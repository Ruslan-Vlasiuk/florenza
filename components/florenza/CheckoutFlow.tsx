'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, cartTotal } from '@/lib/cart/store';
import { formatPrice } from '@/lib/utils/format';
import { StreetCombobox } from './StreetCombobox';
import { PhoneField } from './PhoneField';

const CITY_OPTIONS = [
  { value: 'irpin', label: 'Ірпінь' },
  { value: 'bucha', label: 'Буча' },
  { value: 'hostomel', label: 'Гостомель' },
  { value: 'kyiv', label: 'Київ' },
] as const;
type CityKey = (typeof CITY_OPTIONS)[number]['value'];

type PaymentMode = 'sandbox' | 'production';

type Props = {
  paymentMode: PaymentMode;
};

type DeliverySlotOption = { value: string; label: string };
// 30-минутні вікна — за один слот резервується кур'єр для одного замовлення.
const DELIVERY_SLOTS: DeliverySlotOption[] = (() => {
  const slots: DeliverySlotOption[] = [];
  for (let h = 10; h < 20; h++) {
    for (const m of [0, 30]) {
      const startH = String(h).padStart(2, '0');
      const startM = String(m).padStart(2, '0');
      const endH = String(m === 30 ? h + 1 : h).padStart(2, '0');
      const endM = m === 30 ? '00' : '30';
      const value = `${startH}:${startM}-${endH}:${endM}`;
      const label = `${startH}:${startM}–${endH}:${endM}`;
      slots.push({ value, label });
    }
  }
  return slots;
})();

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function tomorrowIso() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function CheckoutFlow({ paymentMode }: Props) {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [mounted, setMounted] = useState(false);

  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [recipientSame, setRecipientSame] = useState(true);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [addressCity, setAddressCity] = useState<CityKey>('irpin');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressBuilding, setAddressBuilding] = useState('');
  const [addressApartment, setAddressApartment] = useState('');
  const [addressFloor, setAddressFloor] = useState('');
  const [addressEntrance, setAddressEntrance] = useState('');
  const [addressIntercom, setAddressIntercom] = useState('');
  const [courierInstructions, setCourierInstructions] = useState('');

  const [deliveryDate, setDeliveryDate] = useState(tomorrowIso());
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[2].value);
  const [isUrgent, setIsUrgent] = useState(false);

  const [cardMessage, setCardMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'full_online' | 'prepayment_50'>(
    'prepayment_50',
  );

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => setMounted(true), []);

  const itemsSubtotal = mounted ? cartTotal(items) : 0;
  const urgentSurcharge = isUrgent ? 150 : 0;
  const deliveryFee = itemsSubtotal >= 3000 ? 0 : 200;
  const totalAmount = itemsSubtotal + urgentSurcharge + deliveryFee;

  const minDate = useMemo(() => todayIso(), []);

  if (!mounted) {
    return <div className="h-64 animate-pulse rounded-xl bg-[var(--color-cream-soft)]" />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--color-text-secondary)] text-lg mb-6">Кошик порожній.</p>
        <Link
          href="/buketu"
          className="inline-flex items-center px-6 py-3 rounded-md bg-[#2c3e2d] !text-[#f5f0e8] font-medium hover:bg-[#3d5240] transition-colors"
        >
          До каталогу
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    if (!buyerName.trim() || !/^\+380\d{9}$/.test(buyerPhone)) {
      setErrorMsg('Заповніть ім’я та телефон замовника у форматі +380 XX XXX XX XX.');
      return;
    }
    if (!addressStreet.trim() || !addressBuilding.trim()) {
      setErrorMsg('Вкажіть вулицю та номер будинку.');
      return;
    }
    if (!recipientSame && (!recipientName.trim() || !recipientPhone.trim())) {
      setErrorMsg('Вкажіть отримувача або поставте «отримувач — це я».');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          buyer: { name: buyerName.trim(), phone: buyerPhone.trim() },
          recipient: recipientSame
            ? { sameAsBuyer: true }
            : {
                sameAsBuyer: false,
                name: recipientName.trim(),
                phone: recipientPhone.trim(),
              },
          isAnonymous,
          delivery: {
            addressStreet: `${CITY_OPTIONS.find((c) => c.value === addressCity)?.label ?? ''}, ${addressStreet.trim()}`,
            addressBuilding: addressBuilding.trim(),
            addressApartment: addressApartment.trim() || undefined,
            addressFloor: addressFloor.trim() || undefined,
            addressEntrance: addressEntrance.trim() || undefined,
            addressIntercom: addressIntercom.trim() || undefined,
            deliveryDate,
            deliverySlot,
            isUrgent,
            courierInstructions: courierInstructions.trim() || undefined,
          },
          cardMessage: cardMessage.trim() || undefined,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Помилка');
      }
      clear();
      router.push(`/order/${data.orderNumber}?from=checkout`);
    } catch (err) {
      setErrorMsg((err as Error).message ?? 'Помилка обробки замовлення.');
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-start"
    >
      <div className="space-y-10">
        <Section title="Замовник">
          <Field
            label="Ім’я"
            value={buyerName}
            onChange={setBuyerName}
            placeholder="Як до вас звертатись"
            required
          />
          <PhoneField
            label="Телефон"
            value={buyerPhone}
            onChange={setBuyerPhone}
            required
          />
        </Section>

        <Section title="Отримувач">
          <Checkbox
            label="Отримувач — це я"
            checked={recipientSame}
            onChange={setRecipientSame}
          />
          {!recipientSame && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <Field
                label="Ім’я отримувача"
                value={recipientName}
                onChange={setRecipientName}
                placeholder="Кому везти"
              />
              <PhoneField
                label="Телефон отримувача"
                value={recipientPhone}
                onChange={setRecipientPhone}
              />
            </div>
          )}
          {!recipientSame && (
            <Checkbox
              label="Анонімне замовлення (отримувач не побачить замовника)"
              checked={isAnonymous}
              onChange={setIsAnonymous}
            />
          )}
        </Section>

        <Section title="Доставка">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Місто <span className="text-[var(--color-deep-forest)]">*</span>
            </label>
            <select
              value={addressCity}
              onChange={(e) => {
                setAddressCity(e.target.value as CityKey);
                setAddressStreet('');
              }}
              className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors"
              required
            >
              {CITY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Вулиця <span className="text-[var(--color-deep-forest)]">*</span>
              </label>
              <StreetCombobox
                value={addressStreet}
                onChange={setAddressStreet}
                city={addressCity}
                placeholder="Почніть вводити — підкажемо"
                required
              />
            </div>
            <Field
              label="Будинок"
              value={addressBuilding}
              onChange={setAddressBuilding}
              placeholder="12А"
              required
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Кв." value={addressApartment} onChange={setAddressApartment} />
            <Field label="Поверх" value={addressFloor} onChange={setAddressFloor} />
            <Field label="Під’їзд" value={addressEntrance} onChange={setAddressEntrance} />
            <Field label="Домофон" value={addressIntercom} onChange={setAddressIntercom} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Дата доставки
              </label>
              <input
                type="date"
                value={deliveryDate}
                min={minDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
                Вікно для кур&apos;єра (30 хв)
              </label>
              <select
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors"
                required
              >
                {DELIVERY_SLOTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                Кур&apos;єр приїде в межах цих 30 хвилин.
              </p>
            </div>
          </div>

          <Checkbox
            label={`Термінова доставка (60–90 хв, +150 грн)`}
            checked={isUrgent}
            onChange={setIsUrgent}
          />

          <div>
            <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Інструкції кур’єру
            </label>
            <textarea
              value={courierInstructions}
              onChange={(e) => setCourierInstructions(e.target.value)}
              rows={2}
              placeholder="Наприклад: подзвонити за 15 хв"
              className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors"
            />
          </div>
        </Section>

        <Section title="Листівка">
          <textarea
            value={cardMessage}
            onChange={(e) => setCardMessage(e.target.value)}
            rows={3}
            placeholder="Текст листівки до букета (необов’язково)"
            className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors"
            maxLength={500}
          />
        </Section>

        <Section title="Оплата">
          <div className="rounded-md bg-[#229ED9]/8 border border-[#229ED9]/30 px-4 py-3 text-sm text-[var(--color-deep-forest)] mb-4">
            💳 Передоплата йде через наш Telegram-бот після оформлення.{' '}
            {paymentMode === 'sandbox' && (
              <span className="block mt-1 text-xs text-[var(--color-text-muted)]">
                Тестовий режим: онлайн-оплата увімкнеться після модерації мерчанта Mono.
              </span>
            )}
          </div>
          <PaymentRadio
            id="prepayment_50"
            label={`Передоплата 50% (${Math.round(totalAmount / 2)} грн) онлайн + 50% при доставці`}
            description="Передоплата гарантує підготовку букета. Решта — кур’єру готівкою або карткою."
            value="prepayment_50"
            current={paymentMethod}
            onChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
          />
          <PaymentRadio
            id="full_online"
            label={`Повна оплата онлайн (${totalAmount} грн)`}
            description="Сплачуєте все одразу — кур’єру нічого передавати не потрібно."
            value="full_online"
            current={paymentMethod}
            onChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
          />
        </Section>

        {errorMsg && (
          <p
            role="alert"
            className="text-sm text-[var(--color-error,#a33)] border border-[var(--color-error,#a33)]/30 rounded-md px-4 py-3"
          >
            {errorMsg}
          </p>
        )}
      </div>

      <aside className="lg:sticky lg:top-24 rounded-[var(--radius-lg)] border border-[var(--color-border-soft)] bg-white shadow-sm p-6 md:p-8">
        <h2 className="font-[var(--font-display)] text-xl text-[var(--color-deep-forest)] mb-5">
          Ваше замовлення
        </h2>

        <ul className="space-y-3 mb-5">
          {items.map((item) => (
            <li key={item.bouquetId} className="flex gap-3 text-sm">
              <div className="relative w-12 h-14 shrink-0 overflow-hidden rounded-md bg-white">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[var(--color-deep-forest)] truncate">
                  {item.name}
                </p>
                <p className="text-[var(--color-text-muted)]">
                  {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="tabular-nums text-[var(--color-deep-forest)] whitespace-nowrap">
                {formatPrice(item.quantity * item.price)}
              </p>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 text-sm border-t border-[var(--color-border-soft)] pt-4">
          <Row label="Сума букетів" value={formatPrice(itemsSubtotal)} />
          <Row
            label="Доставка"
            value={
              deliveryFee === 0 ? 'Безкоштовно' : formatPrice(deliveryFee)
            }
          />
          {urgentSurcharge > 0 && (
            <Row label="Термінова" value={formatPrice(urgentSurcharge)} />
          )}
        </dl>

        <div className="flex items-baseline justify-between border-t border-[var(--color-border-soft)] pt-4 mt-4 mb-6">
          <span className="text-sm uppercase tracking-wider text-[var(--color-text-muted)]">
            Разом
          </span>
          <span className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)] tabular-nums">
            {formatPrice(totalAmount)}
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="block w-full text-center px-6 py-3.5 rounded-md bg-[#2c3e2d] !text-[#f5f0e8] font-medium hover:bg-[#3d5240] transition-colors disabled:opacity-50"
        >
          {submitting ? 'Оформлюємо…' : 'Оформити замовлення'}
        </button>

        <p className="mt-3 text-xs text-[var(--color-text-muted)] text-center leading-relaxed">
          Натискаючи «Оформити», ви приймаєте{' '}
          <Link href="/oferta" className="underline">
            умови оферти
          </Link>{' '}
          та{' '}
          <Link href="/polityka-konfidentsiynosti" className="underline">
            політику конфіденційності
          </Link>
          .
        </p>
      </aside>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-deep-forest)]">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
        {label}
        {required && <span className="text-[var(--color-deep-forest)]"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-md bg-white border border-[var(--color-border-soft)] text-[var(--color-deep-forest)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-deep-forest)] focus:ring-2 focus:ring-[var(--color-sage)]/40 transition-colors"
      />
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-3 text-sm text-[var(--color-deep-forest)] cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[var(--color-deep-forest)]"
      />
      <span>{label}</span>
    </label>
  );
}

function PaymentRadio({
  id,
  label,
  description,
  value,
  current,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  description: string;
  value: string;
  current: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const selected = current === value;
  return (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 rounded-md border px-4 py-3 cursor-pointer transition-colors ${
        selected
          ? 'border-[var(--color-deep-forest)] bg-[var(--color-cream)]'
          : 'border-[var(--color-border-soft)] bg-white/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        id={id}
        type="radio"
        name="payment"
        value={value}
        checked={selected}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="mt-1 accent-[var(--color-deep-forest)]"
      />
      <div className="flex-1">
        <p className="font-medium text-[var(--color-deep-forest)]">{label}</p>
        <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{description}</p>
      </div>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[var(--color-text-secondary)]">{label}</dt>
      <dd className="tabular-nums text-[var(--color-deep-forest)]">{value}</dd>
    </div>
  );
}
