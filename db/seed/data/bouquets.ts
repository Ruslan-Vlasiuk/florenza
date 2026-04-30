/**
 * 30 demo bouquets — editorial Florenza style.
 * Each entry includes Gemini prompt for photo generation + AI-generated description fallback.
 */

export interface DemoBouquet {
  name: string;
  slug: string;
  price: number;
  type: string; // category-type slug
  mainFlower: string; // flower slug
  occasions: string[]; // occasion slugs
  emotionalTone: string[];
  forWhom: 'female' | 'male' | 'neutral';
  composition: Array<{ item: string; count: number; note?: string }>;
  size: { heightCm: number; diameterCm: number; tShirtSize: 'S' | 'M' | 'L' | 'XL' };
  preparationHours: number;
  descriptionShort: string;
  descriptionFull: string;
  imagePrompt: string; // for AI generation
  unsplashKeywords: string[]; // fallback CC0 search terms
  discount?: { type: 'percent' | 'fixed'; amount: number; daysFromNow: number };
}

export const DEMO_BOUQUETS: DemoBouquet[] = [
  {
    name: 'Світанок',
    slug: 'svitanok',
    price: 1800,
    type: 'avtorski',
    mainFlower: 'pivonii',
    occasions: ['na-den-narodzhennya', 'bez-pryvodu'],
    emotionalTone: ['gentle', 'natural'],
    forWhom: 'female',
    composition: [
      { item: 'Півонія сорту Sarah Bernhardt', count: 5 },
      { item: 'Евкаліпт серцелистий', count: 3 },
      { item: 'Крафтова обгортка', count: 1 },
      { item: 'Шовкова стрічка пастельна', count: 1 },
    ],
    size: { heightCm: 30, diameterCm: 28, tShirtSize: 'M' },
    preparationHours: 1,
    descriptionShort: '5 півоній у пастельних рожевих тонах з евкаліптом. Спокійний для очей, теплий для рук.',
    descriptionFull:
      'П\'ять півоній сорту Sarah Bernhardt, ніжно-рожеві, в обрамленні сірувато-зеленого евкаліпта. Делікатна крафт-обгортка з вузликом на тонкому шпагаті. Підійде на ранкову зустріч, тихий день народження або «просто так».',
    imagePrompt:
      'Bouquet of 5 soft pink Sarah Bernhardt peonies with eucalyptus, wrapped in natural craft paper with silk ribbon. Editorial florist photography, soft window light, linen background.',
    unsplashKeywords: ['peony bouquet', 'pink peonies', 'editorial flowers'],
  },
  {
    name: 'Тиха гавань',
    slug: 'tykha-gavan',
    price: 2400,
    type: 'avtorski',
    mainFlower: 'gortenziyi',
    occasions: ['richnytsia', 'bez-pryvodu'],
    emotionalTone: ['gentle', 'classic'],
    forWhom: 'female',
    composition: [
      { item: 'Гортензія блакитна', count: 3 },
      { item: 'Лізіантус білий', count: 5 },
      { item: 'Скімія', count: 2 },
    ],
    size: { heightCm: 35, diameterCm: 32, tShirtSize: 'M' },
    preparationHours: 2,
    descriptionShort: 'Гортензії і лізіантуси у спокійній блакитно-білій палітрі. Безмовна елегантність.',
    descriptionFull:
      'Три повних шапки блакитних гортензій, п\'ять лізіантусів кольору слонової кістки і скімія для текстури. Лаконічна паперова обгортка, без зайвих акцентів.',
    imagePrompt:
      'Hydrangea bouquet in soft blue with white lisianthus and skimmia, neutral paper wrap, editorial moody light, painterly composition.',
    unsplashKeywords: ['hydrangea bouquet', 'blue flowers', 'lisianthus'],
  },
  {
    name: 'Іспанська ніч',
    slug: 'ispanska-nich',
    price: 2900,
    type: 'avtorski',
    mainFlower: 'troyandy',
    occasions: ['richnytsia', 'na-14-lyutogo'],
    emotionalTone: ['bold', 'lush'],
    forWhom: 'female',
    composition: [
      { item: 'Троянда Black Baccara', count: 11 },
      { item: 'Фрезія темно-винна', count: 5 },
      { item: 'Антуріум темний', count: 2 },
    ],
    size: { heightCm: 40, diameterCm: 30, tShirtSize: 'L' },
    preparationHours: 2,
    descriptionShort: 'Темні троянди Black Baccara з винною фрезією. Глибока, дорослі емоції.',
    descriptionFull:
      'Класичні Black Baccara — найтемніші з троянд — з винною фрезією і антуріумом. Дорослий, насичений букет для тих, хто любить контраст і драматизм.',
    imagePrompt:
      'Bouquet of dark Black Baccara roses with burgundy freesia and dark anthurium, dramatic moody lighting, deep red and black tones.',
    unsplashKeywords: ['black rose bouquet', 'dark roses', 'burgundy flowers'],
    discount: { type: 'percent', amount: 15, daysFromNow: 14 },
  },
  {
    name: 'Ранкова квіткарня',
    slug: 'rankova-kvitkarnia',
    price: 1500,
    type: 'monobukety',
    mainFlower: 'tyulpany',
    occasions: ['na-8-bereznya', 'bez-pryvodu'],
    emotionalTone: ['gentle', 'natural'],
    forWhom: 'female',
    composition: [
      { item: 'Тюльпан "French Blend"', count: 25 },
    ],
    size: { heightCm: 35, diameterCm: 25, tShirtSize: 'M' },
    preparationHours: 1,
    descriptionShort: '25 французьких тюльпанів у спокійних відтінках. Щедрий монобукет.',
    descriptionFull:
      'Двадцять п\'ять тюльпанів сорту "French Blend" — приглушені персикові, кремові та м\'ятні відтінки. Класичний монобукет в льняній стрічці, без зайвого декору.',
    imagePrompt:
      'Bouquet of 25 French blend tulips in muted peach, cream, and mint tones, wrapped in linen ribbon. Soft natural light.',
    unsplashKeywords: ['tulips bouquet', 'french tulips', 'pastel flowers'],
  },
  {
    name: 'Майстерна композиція',
    slug: 'maysterna-kompozytsiia',
    price: 3200,
    type: 'kompozytsiyi',
    mainFlower: 'sezonni',
    occasions: ['na-den-narodzhennya', 'richnytsia'],
    emotionalTone: ['classic', 'lush'],
    forWhom: 'neutral',
    composition: [
      { item: 'Жоржини в коробці', count: 7 },
      { item: 'Ранункулюси', count: 9 },
      { item: 'Хеленіум', count: 5 },
      { item: 'Зелень мікс', count: 1 },
    ],
    size: { heightCm: 28, diameterCm: 35, tShirtSize: 'L' },
    preparationHours: 3,
    descriptionShort: 'Сезонна композиція в льняній коробці. Жоржини, ранункулюси, хеленіум.',
    descriptionFull:
      'Композиція в круглій льняній коробці-капелюсі. Жоржини, ранункулюси, хеленіум — насичена палітра пізнього літа. Не потребує вази.',
    imagePrompt:
      'Floral arrangement in linen hat box with dahlias, ranunculus, helenium in late summer warm tones, editorial florist photography.',
    unsplashKeywords: ['flower arrangement box', 'dahlia bouquet', 'autumn flowers'],
  },
  {
    name: 'Невагомий дотик',
    slug: 'nevahomyy-dotyk',
    price: 1950,
    type: 'avtorski',
    mainFlower: 'troyandy',
    occasions: ['na-14-lyutogo', 'bez-pryvodu'],
    emotionalTone: ['gentle', 'classic'],
    forWhom: 'female',
    composition: [
      { item: 'Троянда David Austin Juliet', count: 9 },
      { item: 'Сухоцвіт лагурус', count: 5 },
    ],
    size: { heightCm: 30, diameterCm: 26, tShirtSize: 'M' },
    preparationHours: 2,
    descriptionShort: 'Дев\'ять троянд David Austin Juliet з лагурусом. Тихий, теплий.',
    descriptionFull:
      'Дев\'ять трояндDavid Austin Juliet — крем-абрикосові, з тонкою ванільною ноткою. Доповнено сухоцвітом лагурус для м\'якої текстури.',
    imagePrompt:
      'Bouquet of 9 David Austin Juliet roses in cream-apricot tones with bunny tail grass (lagurus), soft natural daylight, painterly editorial style.',
    unsplashKeywords: ['david austin roses', 'cream roses bouquet', 'editorial flowers'],
  },
  {
    name: 'Перший подих',
    slug: 'pershyi-podykh',
    price: 1100,
    type: 'monobukety',
    mainFlower: 'pivonii',
    occasions: ['narodzhennia-dytyny', 'bez-pryvodu'],
    emotionalTone: ['gentle'],
    forWhom: 'female',
    composition: [
      { item: 'Півонія Coral Charm', count: 3 },
    ],
    size: { heightCm: 25, diameterCm: 20, tShirtSize: 'S' },
    preparationHours: 1,
    descriptionShort: 'Три коралові півонії Coral Charm. Мінімалістично, ніжно.',
    descriptionFull:
      'Три півонії Coral Charm — сорт що відкривається з насичено-коралового у ніжно-персиковий. Букет «на одну подію» — для відвідин у пологовому, для вранішнього сюрпризу.',
    imagePrompt:
      'Three Coral Charm peonies in a minimal bouquet, soft window light, linen wrap, painterly composition.',
    unsplashKeywords: ['coral peonies', 'minimal bouquet', 'three flowers'],
  },
  {
    name: 'Польове письмо',
    slug: 'polove-pysmo',
    price: 1300,
    type: 'avtorski',
    mainFlower: 'sezonni',
    occasions: ['bez-pryvodu', 'na-den-narodzhennya'],
    emotionalTone: ['natural', 'minimal'],
    forWhom: 'neutral',
    composition: [
      { item: 'Космея', count: 11 },
      { item: 'Космос', count: 7 },
      { item: 'Мордовник', count: 5 },
      { item: 'Дикі трави', count: 1 },
    ],
    size: { heightCm: 35, diameterCm: 30, tShirtSize: 'M' },
    preparationHours: 2,
    descriptionShort: 'Польові квіти і дикі трави. Свобода, без формальності.',
    descriptionFull:
      'Космея, космос, мордовник і польові трави — букет, який виглядає як зібраний у полі за годину. Незвичайний, неприборканий.',
    imagePrompt:
      'Wildflower bouquet with cosmos, echinops, wild grasses, casually arranged, natural light, painterly.',
    unsplashKeywords: ['wildflower bouquet', 'meadow flowers', 'natural bouquet'],
  },
  {
    name: 'Венеційський полудень',
    slug: 'venetsiiskyy-poludenʹ',
    price: 4500,
    type: 'avtorski',
    mainFlower: 'troyandy',
    occasions: ['richnytsia', 'na-vesillya'],
    emotionalTone: ['lush', 'classic'],
    forWhom: 'female',
    composition: [
      { item: 'Троянда персикова "Free Spirit"', count: 25 },
      { item: 'Орхідея цимбідіум', count: 3 },
      { item: 'Каштанове листя', count: 5 },
    ],
    size: { heightCm: 45, diameterCm: 40, tShirtSize: 'XL' },
    preparationHours: 3,
    descriptionShort: '25 персикових Free Spirit з орхідеєю. Розкішно, без надмірності.',
    descriptionFull:
      'Великий букет: 25 троянд Free Spirit персикового відтінку, три цимбідіуми кольору слонової кістки, каштанове листя для глибини. Для значущих подій.',
    imagePrompt:
      'Large bouquet of 25 peach Free Spirit roses with cymbidium orchids and chestnut leaves, opulent yet refined, editorial.',
    unsplashKeywords: ['peach roses', 'large bouquet', 'wedding flowers'],
  },
  {
    name: 'Мама',
    slug: 'mama',
    price: 1700,
    type: 'avtorski',
    mainFlower: 'troyandy',
    occasions: ['na-8-bereznya'],
    emotionalTone: ['gentle', 'classic'],
    forWhom: 'female',
    composition: [
      { item: 'Троянда крем "Vendela"', count: 11 },
      { item: 'Гіпсофіла', count: 3 },
    ],
    size: { heightCm: 35, diameterCm: 28, tShirtSize: 'M' },
    preparationHours: 1,
    descriptionShort: '11 кремових троянд з гіпсофілою. Класика, але по-Florenza.',
    descriptionFull:
      'Класичний букет для мами: одинадцять кремових троянд Vendela і легка хмаринка гіпсофіли. Не «банально», а тепло і впізнавано.',
    imagePrompt:
      'Bouquet of 11 cream Vendela roses with baby breath, classical but editorial, soft daylight.',
    unsplashKeywords: ['cream roses', 'mothers day bouquet', 'baby breath'],
    discount: { type: 'percent', amount: 10, daysFromNow: 7 },
  },
  // 20 more bouquets...
  ...generateAdditionalBouquets(),
];

function generateAdditionalBouquets(): DemoBouquet[] {
  const data: Array<Partial<DemoBouquet> & { name: string; slug: string; price: number; _roses?: number; _balloons?: number }> = [
    { name: 'Стара книгарня', slug: 'stara-knyharnia', price: 2100, type: 'avtorski', mainFlower: 'sezonni', occasions: ['bez-pryvodu'], emotionalTone: ['classic'], forWhom: 'neutral' },
    { name: 'Холодна вода', slug: 'kholodna-voda', price: 1600, type: 'monobukety', mainFlower: 'gortenziyi', occasions: ['bez-pryvodu'], emotionalTone: ['minimal'], forWhom: 'neutral' },
    { name: 'Дитячий сміх', slug: 'dytiachyi-smikh', price: 1400, type: 'avtorski', mainFlower: 'tyulpany', occasions: ['narodzhennia-dytyny'], emotionalTone: ['gentle'], forWhom: 'female' },
    { name: 'Поцілунок літа', slug: 'potsiluunok-lita', price: 2200, type: 'avtorski', mainFlower: 'sezonni', occasions: ['na-den-narodzhennya'], emotionalTone: ['lush', 'natural'], forWhom: 'female' },
    { name: 'Камінь і перо', slug: 'kamin-i-pero', price: 2700, type: 'avtorski', mainFlower: 'troyandy', occasions: ['richnytsia'], emotionalTone: ['classic', 'minimal'], forWhom: 'male' },
    { name: 'Опаловий ранок', slug: 'opalovyi-ranok', price: 1900, type: 'kompozytsiyi', mainFlower: 'pivonii', occasions: ['bez-pryvodu'], emotionalTone: ['gentle'], forWhom: 'female' },
    { name: 'Шовкова нитка', slug: 'shovkova-nytka', price: 1450, type: 'monobukety', mainFlower: 'troyandy', occasions: ['na-14-lyutogo'], emotionalTone: ['gentle'], forWhom: 'female' },
    { name: 'Пориск весни', slug: 'porysk-vesny', price: 1750, type: 'avtorski', mainFlower: 'tyulpany', occasions: ['na-8-bereznya'], emotionalTone: ['gentle', 'natural'], forWhom: 'female', discount: { type: 'percent', amount: 20, daysFromNow: 5 } },
    { name: 'Літня альтанка', slug: 'litnia-altanka', price: 2300, type: 'kompozytsiyi', mainFlower: 'sezonni', occasions: ['na-den-narodzhennya'], emotionalTone: ['natural', 'lush'], forWhom: 'female' },
    { name: 'Біла кімната', slug: 'bila-kimnata', price: 2000, type: 'avtorski', mainFlower: 'troyandy', occasions: ['na-vesillya'], emotionalTone: ['minimal', 'classic'], forWhom: 'female' },
    { name: 'Мандариновий сад', slug: 'mandarynovyi-sad', price: 1850, type: 'avtorski', mainFlower: 'sezonni', occasions: ['bez-pryvodu'], emotionalTone: ['bold', 'natural'], forWhom: 'neutral' },
    { name: 'Аромат нового дня', slug: 'aromat-novoho-dnia', price: 1250, type: 'monobukety', mainFlower: 'pivonii', occasions: ['na-den-narodzhennya'], emotionalTone: ['gentle'], forWhom: 'female' },
    { name: 'Вечірній шепіт', slug: 'vechirnii-shepit', price: 2600, type: 'avtorski', mainFlower: 'troyandy', occasions: ['richnytsia'], emotionalTone: ['lush'], forWhom: 'female' },
    { name: 'Альпійська тиша', slug: 'alpiiska-tysha', price: 2150, type: 'kompozytsiyi', mainFlower: 'gortenziyi', occasions: ['bez-pryvodu'], emotionalTone: ['minimal'], forWhom: 'neutral' },
    { name: 'Тепла осінь', slug: 'tepla-osin', price: 1950, type: 'avtorski', mainFlower: 'sezonni', occasions: ['na-den-narodzhennya'], emotionalTone: ['lush', 'natural'], forWhom: 'female' },
    { name: 'Перший лист', slug: 'pershyi-lyst', price: 1100, type: 'monobukety', mainFlower: 'tyulpany', occasions: ['bez-pryvodu'], emotionalTone: ['minimal'], forWhom: 'neutral' },
    { name: 'Сірі стіни', slug: 'siri-stiny', price: 1850, type: 'avtorski', mainFlower: 'sezonni', occasions: ['bez-pryvodu'], emotionalTone: ['minimal', 'classic'], forWhom: 'neutral' },
    { name: 'Букет нареченої', slug: 'buket-narechenoyi', price: 5500, type: 'avtorski', mainFlower: 'pivonii', occasions: ['na-vesillya'], emotionalTone: ['lush', 'classic'], forWhom: 'female' },
    { name: 'Тюльпановий парк', slug: 'tyulpanovyi-park', price: 1350, type: 'monobukety', mainFlower: 'tyulpany', occasions: ['na-8-bereznya'], emotionalTone: ['natural'], forWhom: 'female' },
    { name: 'Прохолодний нічний бриз', slug: 'prokholodnyi-nichnyi-bryz', price: 2400, type: 'avtorski', mainFlower: 'troyandy', occasions: ['richnytsia'], emotionalTone: ['classic'], forWhom: 'female' },
    // === Великі букети троянд ===
    { name: '51 троянда «Доля»', slug: '51-troyanda-dolia', price: 4900, type: 'veliki-troyandy', mainFlower: 'troyandy', occasions: ['richnytsia', 'na-14-lyutogo'], emotionalTone: ['classic', 'lush'], forWhom: 'female', _roses: 51 },
    { name: '75 троянд «Зустріч»', slug: '75-troyand-zustrich', price: 6900, type: 'veliki-troyandy', mainFlower: 'troyandy', occasions: ['richnytsia', 'na-den-narodzhennya'], emotionalTone: ['classic', 'lush'], forWhom: 'female', _roses: 75 },
    { name: '101 троянда «Освідчення»', slug: '101-troyanda-osvidchennya', price: 8900, type: 'veliki-troyandy', mainFlower: 'troyandy', occasions: ['richnytsia', 'na-14-lyutogo'], emotionalTone: ['classic', 'lush', 'bold'], forWhom: 'female', _roses: 101 },
    { name: '151 троянда «Обіцянка»', slug: '151-troyanda-obitsianka', price: 12900, type: 'veliki-troyandy', mainFlower: 'troyandy', occasions: ['richnytsia'], emotionalTone: ['lush', 'bold'], forWhom: 'female', _roses: 151 },
    { name: '201 троянда «Безмірна»', slug: '201-troyanda-bezmirna', price: 16900, type: 'veliki-troyandy', mainFlower: 'troyandy', occasions: ['richnytsia'], emotionalTone: ['lush', 'bold'], forWhom: 'female', _roses: 201 },
    { name: '301 троянда «Неможлива»', slug: '301-troyanda-nemozhlyva', price: 24900, type: 'veliki-troyandy', mainFlower: 'troyandy', occasions: ['richnytsia'], emotionalTone: ['lush', 'bold'], forWhom: 'female', _roses: 301, discount: { type: 'percent', amount: 10, daysFromNow: 14 } },
    // === Повітряні шари ===
    { name: 'Композиція «10 серцевих»', slug: 'shari-10-sertsevykh', price: 850, type: 'shari', mainFlower: 'sezonni', occasions: ['na-14-lyutogo', 'richnytsia'], emotionalTone: ['gentle', 'classic'], forWhom: 'female', _balloons: 10 },
    { name: 'Set «Це хлопчик»', slug: 'shari-tse-khlopchyk', price: 1250, type: 'shari', mainFlower: 'sezonni', occasions: ['narodzhennia-dytyny'], emotionalTone: ['gentle', 'classic'], forWhom: 'neutral', _balloons: 15 },
    { name: 'Set «Це дівчинка»', slug: 'shari-tse-divchynka', price: 1250, type: 'shari', mainFlower: 'sezonni', occasions: ['narodzhennia-dytyny'], emotionalTone: ['gentle'], forWhom: 'neutral', _balloons: 15 },
    { name: '100 хром-шарів', slug: 'shari-100-khrom', price: 4500, type: 'shari', mainFlower: 'sezonni', occasions: ['na-den-narodzhennya', 'na-vypusknyi'], emotionalTone: ['bold', 'lush'], forWhom: 'neutral', _balloons: 100 },
    { name: 'Букет «День народження»', slug: 'shari-den-narodzhennia', price: 1850, type: 'shari', mainFlower: 'sezonni', occasions: ['na-den-narodzhennya'], emotionalTone: ['gentle', 'natural'], forWhom: 'neutral', _balloons: 7 },
    { name: 'Фольговані «Love»', slug: 'shari-love', price: 1450, type: 'shari', mainFlower: 'sezonni', occasions: ['na-14-lyutogo', 'richnytsia'], emotionalTone: ['gentle', 'classic'], forWhom: 'female', _balloons: 9 },
  ];
  return data.map((d) => {
    const roses = (d as any)._roses as number | undefined;
    const balloons = (d as any)._balloons as number | undefined;
    const isBigRose = !!roses;
    const isBalloon = !!balloons;
    let composition: DemoBouquet['composition'];
    let size: DemoBouquet['size'];
    let preparationHours: number;
    let descriptionShort: string;
    let descriptionFull: string;
    let imagePrompt: string;
    let unsplashKeywords: string[];

    if (isBigRose) {
      composition = [
        { item: 'Червона троянда преміум сорту 60 см', count: roses! },
        { item: 'Декоративна стрічка з оксамиту', count: 1 },
        { item: 'Крафтова обгортка ручної роботи', count: 1 },
      ];
      size = { heightCm: roses! >= 151 ? 80 : 65, diameterCm: roses! >= 151 ? 75 : 55, tShirtSize: roses! >= 151 ? 'XL' : 'L' };
      preparationHours = roses! >= 151 ? 24 : 2;
      descriptionShort = `${roses} червоних троянд — букет для жесту, який запам'ятовується.`;
      descriptionFull = `${roses} преміум червоних троянд (60 см стебло) у класичному оформленні. Букет збирається вручну за день до доставки.`;
      imagePrompt = `Massive bouquet of ${roses} red premium roses, 60cm stems, wrapped in craft paper with velvet ribbon, dramatic editorial photography, dark moody background.`;
      unsplashKeywords = ['red roses bouquet', '101 roses', 'huge rose bouquet', 'rose arrangement'];
    } else if (isBalloon) {
      composition = [
        { item: 'Гелієві латексні шари (хром / макарон)', count: balloons! },
        { item: 'Декоративна стрічка', count: 1 },
        { item: 'Крафт-картка з побажанням', count: 1 },
      ];
      size = { heightCm: balloons! >= 50 ? 130 : 80, diameterCm: balloons! >= 50 ? 90 : 50, tShirtSize: balloons! >= 50 ? 'XL' : 'M' };
      preparationHours = balloons! >= 50 ? 6 : 2;
      descriptionShort = `${balloons} гелієвих шарів — святковий настрій, який літає над усіма.`;
      descriptionFull = `${balloons} гелієвих шарів у фірмовій палітрі Florenza. Шари тримаються 8–14 годин залежно від матеріалу. Можна доповнити квітами.`;
      imagePrompt = `${balloons} helium balloons in chrome and macaron pastel colors, tied with silk ribbon, editorial party photography, soft window light, cream background.`;
      unsplashKeywords = ['helium balloons', 'balloon bouquet', 'party balloons', 'pastel balloons'];
    } else {
      composition = [{ item: 'Сезонні квіти за каталогом', count: 1 }];
      size = { heightCm: 30, diameterCm: 28, tShirtSize: 'M' };
      preparationHours = 2;
      descriptionShort = `${d.name} — авторський букет Florenza.`;
      descriptionFull = `${d.name} — авторський букет, складений у фірмовому editorial-стилі Florenza. Унікальна композиція в палітрі бренду.`;
      imagePrompt = `Editorial florist bouquet "${d.name}", soft natural light, painterly, muted palette.`;
      unsplashKeywords = ['editorial flowers', 'bouquet', 'florist'];
    }

    return ({
      composition,
      size,
      preparationHours,
      descriptionShort,
      descriptionFull,
      imagePrompt,
      unsplashKeywords,
      ...d,
    }) as DemoBouquet;
  });
}
