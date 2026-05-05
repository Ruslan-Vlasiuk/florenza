import type { GlobalConfig } from 'payload';
import { isAdmin } from '../access/admins';

export const LiyaRules: GlobalConfig = {
  slug: 'liya-rules',
  label: '🤖 Лія — правила (FAQ, ескалації)',
  admin: {
    group: '⚙️ Налаштування',
    description: 'FAQ, тригери ескалацій до людини, заборонені теми.',
  },
  access: { read: isAdmin, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'array',
              label: 'Типові питання і еталонні відповіді',
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
                { name: 'tags', type: 'select', hasMany: true,
                  options: [
                    { label: 'Доставка', value: 'delivery' },
                    { label: 'Оплата', value: 'payment' },
                    { label: 'Повернення', value: 'returns' },
                    { label: 'Свіжість', value: 'freshness' },
                    { label: 'Упаковка', value: 'packaging' },
                    { label: 'Час підготовки', value: 'preparation' },
                  ],
                },
              ],
              defaultValue: [
                { question: 'Скільки коштує доставка?', answer: 'По Ірпеню, Бучі, Гостомелю — 200 грн. Безкоштовна від 3000 грн заказу. Київ — 350 грн.', tags: ['delivery'] },
                { question: 'Чи можна оплатити при доставці?', answer: 'Так, але потрібна часткова передоплата онлайн (10–30%). Решта — кур\'єру готівкою або карткою.', tags: ['payment'] },
                { question: 'Чи можна повернути букет?', answer: 'Квіти — швидкопсувний товар, повернення обмежене. Якщо була проблема з якістю — менеджер особисто розбереться з компенсацією.', tags: ['returns'] },
                { question: 'Скільки простоїть букет?', answer: 'Залежить від квітки і догляду. Троянди — 5–10 днів, півонії — 4–7, гортензії — до 2 тижнів. Кладемо інструкцію в коробку.', tags: ['freshness'] },
                { question: 'Як швидко доставите?', answer: 'Стандартна доставка — від 2-х годин. Термінова — 60–90 хвилин з доплатою 150 грн.', tags: ['delivery'] },
              ],
            },
          ],
        },
        {
          label: 'Тригери ескалації',
          fields: [
            {
              name: 'mandatoryEscalations',
              type: 'array',
              label: 'Обовʼязкові ескалації (потребують людини)',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'description', type: 'textarea' },
                { name: 'keywords', type: 'array',
                  fields: [{ name: 'keyword', type: 'text' }] },
                { name: 'transferMessage', type: 'textarea' },
              ],
              defaultValue: [
                {
                  name: 'Весілля',
                  description: 'Будь-який запит про весілля — обов\'язково менеджеру.',
                  keywords: [{ keyword: 'весілля' }, { keyword: 'наречена' }, { keyword: 'весільн' }, { keyword: 'wedding' }],
                  transferMessage: 'Передаю розмову менеджеру — для весільних композицій вона підбирає особисто.',
                },
                {
                  name: 'Корпоратив >5000 грн',
                  description: 'Великі корпоративні замовлення.',
                  keywords: [{ keyword: 'офіс' }, { keyword: 'корпорат' }, { keyword: 'компанія' }, { keyword: 'ресторан' }, { keyword: 'готель' }],
                  transferMessage: 'Передаю розмову менеджеру — корпоративні запити вона веде особисто.',
                },
                {
                  name: 'Жалобна / делікатна тема',
                  description: 'Похорон, поминки, кладовище — не намагатись продати.',
                  keywords: [{ keyword: 'похорон' }, { keyword: 'поминк' }, { keyword: 'кладовищ' }, { keyword: '9 днів' }, { keyword: '40 днів' }, { keyword: 'річниця смерті' }, { keyword: 'помер' }, { keyword: 'втрат' }],
                  transferMessage: 'Передаю розмову менеджеру — у таких випадках вона особисто підбирає композицію.',
                },
                {
                  name: 'Скарга',
                  description: 'Будь-яка незадоволеність якістю / доставкою.',
                  keywords: [{ keyword: 'скарг' }, { keyword: 'в\'ялий' }, { keyword: 'не таке' }, { keyword: 'не доставили' }, { keyword: 'розчаров' }],
                  transferMessage: 'Розумію. Передаю розмову менеджеру — вона вирішить це особисто.',
                },
                {
                  name: 'Кастомне замовлення',
                  description: 'Нестандартні запити, рідкісні квіти, специфічні побажання.',
                  keywords: [{ keyword: 'кастом' }, { keyword: 'спеціальн' }, { keyword: 'індивідуальн' }, { keyword: 'на замовлення' }],
                  transferMessage: 'Передаю розмову менеджеру — це краще обговорити з нею.',
                },
                {
                  name: 'Прямий запит на людину',
                  description: 'Користувач хоче говорити з людиною.',
                  keywords: [{ keyword: 'людин' }, { keyword: 'оператор' }, { keyword: 'менеджер' }, { keyword: 'не бот' }, { keyword: 'не AI' }, { keyword: 'не штучний' }],
                  transferMessage: 'Звичайно, передаю менеджеру — він зв\'яжеться з вами.',
                },
              ],
            },
          ],
        },
        {
          label: 'Зависла оплата',
          fields: [
            { name: 'unpaidFollowupMinutes', type: 'number', defaultValue: 60,
              label: 'Через скільки хвилин Лія шле фолоу-ап про неоплату' },
            { name: 'unpaidFollowupMessage', type: 'textarea',
              defaultValue: 'Помітила, що ви не завершили оплату — можливо, потрібна допомога?' },
            { name: 'unpaidEscalateMinutes', type: 'number', defaultValue: 120,
              label: 'Через скільки хвилин ескалувати Варварі (з моменту замовлення)' },
            { name: 'unpaidEscalateMessage', type: 'textarea',
              defaultValue: 'Клієнт зацікавився букетом, але не оплатив. Ось вся розмова. Можете приєднатися до діалогу, якщо хочете дотиснути.' },
          ],
        },
        {
          label: 'Заборонені теми',
          fields: [
            {
              name: 'bannedTopics',
              type: 'array',
              fields: [
                { name: 'topic', type: 'text', required: true },
                { name: 'response', type: 'textarea', label: 'Як реагуємо' },
              ],
              defaultValue: [
                { topic: 'Політика', response: 'Це не моя тема. Краще повернемось до квітів — чим можу допомогти?' },
                { topic: 'Особисті думки про публічних людей', response: 'Я тільки про квіти. Що шукаєте?' },
                { topic: 'Знижки понад 30%', response: 'Поточні наші знижки — у каталозі. Більших, на жаль, не пропонуємо.' },
                { topic: 'Контакти інших флористів', response: 'Я допоможу з нашим асортиментом. Якщо ми не підходимо — Варвара може підказати кого порадити.' },
              ],
            },
          ],
        },
        {
          label: 'Сьогодні недоступне',
          fields: [
            {
              name: 'todayUnavailable',
              type: 'textarea',
              label: 'Що сьогодні немає / недоступно (редагується щодня)',
              admin: { description: 'Напр. "сьогодні немає півоній", "не приймаю замовлення на 1000 троянд", "термінова доставка тимчасово недоступна"' },
            },
          ],
        },
        {
          label: 'Цінова політика',
          fields: [
            {
              name: 'pricingNotes',
              type: 'textarea',
              defaultValue: 'Наші ціни — на сайті, чесно вказані. Знижки тільки ті, що зараз активні в каталозі. Не пропонуємо "збити" ціну індивідуально.',
            },
            {
              name: 'partialPrepaymentMin',
              type: 'number',
              defaultValue: 30,
              label: '% мінімальної передоплати при оплаті кур\'єру',
            },
            {
              name: 'partialPrepaymentEnabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Дозволено часткову передоплату',
            },
          ],
        },
      ],
    },
  ],
};
