export const TYPES = [
  { name: 'Авторські букети', slug: 'avtorski', sortOrder: 1, description: 'Унікальні композиції від Варвари Каракой. Кожен букет — свій настрій, свій сюжет.' },
  { name: 'Монобукети', slug: 'monobukety', sortOrder: 2, description: 'Букети з однієї квітки — щедрі і виразні в простоті.' },
  { name: 'Композиції в коробках', slug: 'kompozytsiyi', sortOrder: 3, description: 'Готові композиції в льняних або крафтових коробках. Не потребують вази.' },
  { name: 'Весільна флористика', slug: 'vesilna', sortOrder: 4, description: 'Букети нареченої, бутоньєрки, оформлення — для дня, який пам\'ятатимуть.' },
  { name: 'Корпоративна флористика', slug: 'korporatyvna', sortOrder: 5, description: 'B2B-флористика для офісів, готелів, ресторанів і корпоративних подарунків.' },
  { name: 'Подарунки і доповнення', slug: 'podarunky', sortOrder: 6, description: 'Шоколад, листівки, шари — для повноти подарунка.' },
];

export const FLOWERS = [
  { name: 'Троянди', slug: 'troyandy', description: 'Класика, що вміє говорити по-різному залежно від сорту і кольору.', seasonality: { yearRound: true } },
  { name: 'Півонії', slug: 'pivonii', description: 'Літні, ніжні, з характером. Сезон — травень-червень.', seasonality: { yearRound: false, fromMonth: 5, toMonth: 7 } },
  { name: 'Хризантеми', slug: 'khryzantemy', description: 'Восени дають глибину і теплоту, які не дає жодна інша квітка.', seasonality: { yearRound: false, fromMonth: 8, toMonth: 11 } },
  { name: 'Тюльпани', slug: 'tyulpany', description: 'Весна в букеті. М\'які, щедрі, природні.', seasonality: { yearRound: false, fromMonth: 2, toMonth: 5 } },
  { name: 'Гортензії', slug: 'gortenziyi', description: 'Об\'ємні шапки, які тримаються тижнями. Для спокійних букетів.', seasonality: { yearRound: false, fromMonth: 6, toMonth: 10 } },
  { name: 'Лілеї', slug: 'liley', description: 'Великі, ароматні. Для виразних подарунків.', seasonality: { yearRound: true } },
  { name: 'Орхідеї', slug: 'orchideii', description: 'Тропічна екзотика для незвичайних композицій.', seasonality: { yearRound: true } },
  { name: 'Сезонні квіти', slug: 'sezonni', description: 'Те, що зараз в найкращій формі — флорист сам обирає за порою року.', seasonality: { yearRound: true } },
  { name: 'Сухоцвіти', slug: 'sukhotsvity', description: 'Букет, який живе місяцями. Текстура замість свіжості.', seasonality: { yearRound: true } },
  { name: 'Польові', slug: 'polovi', description: 'Дикі, неприборкані, природні. Для тих, хто не любить «причесаності».', seasonality: { yearRound: false, fromMonth: 5, toMonth: 9 } },
];

export const OCCASIONS = [
  { name: 'День народження', slug: 'na-den-narodzhennya', sortOrder: 1, description: 'Найчастіший привід — і найрізноманітніший. Від тихого жесту до великого свята.' },
  { name: '8 березня', slug: 'na-8-bereznya', sortOrder: 2, description: 'Весняний привід. Тюльпани, півонії, ніжні палітри.', recurringDate: { month: 3, day: 8 } },
  { name: '14 лютого', slug: 'na-14-lyutogo', sortOrder: 3, description: 'День, коли букет говорить за вас. Троянди, але не банальні.', recurringDate: { month: 2, day: 14 } },
  { name: 'Народження дитини', slug: 'narodzhennia-dytyny', sortOrder: 4, description: 'М\'які, ніжні палітри. Без різких ароматів.' },
  { name: 'Річниця', slug: 'richnytsia', sortOrder: 5, description: 'Знайомі квіти, нові акценти. Або повторити минулорічний — як ми пам\'ятаємо.' },
  { name: 'Випускний', slug: 'na-vypusknyi', sortOrder: 6, description: 'Святковий, але не дитячий. Для нового етапу.' },
  { name: 'Корпоративні події', slug: 'korporatyvni', sortOrder: 7, description: 'Презентації, відкриття, корпоративи — стримана елегантність.' },
  { name: 'Без приводу', slug: 'bez-pryvodu', sortOrder: 8, description: 'Найкращий привід — без приводу. Просто тому що захотілось.' },
  { name: 'Весілля', slug: 'na-vesillya', sortOrder: 9, description: 'Букет нареченої, бутоньєрки, композиції на столи.' },
];
