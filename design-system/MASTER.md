# Florenza — Design System Master

> **Source of truth для дизайн-токенів.** Усі компоненти підкоряються цим правилам.
> Згенеровано вручну за специфікацією `MAIN_TZ.md` секція 4.

---

## Палітра

| Токен | Hex | Призначення |
|---|---|---|
| `cream` | `#F5F0E8` | Основний фон сайту |
| `cream-soft` | `#EFE9DD` | Альтернативний фон, картки |
| `sage` | `#8A9A7B` | Приглушений зелений, акценти |
| `sage-deep` | `#6B7D5E` | Активний стан sage-елементів |
| `deep-forest` | `#2C3E2D` | Основний акцент, brand-колір |
| `deep-forest-soft` | `#3D5240` | Hover-стан акцентів |
| `dusty-rose` | `#C9A395` | Теплий акцент, рідкий |
| `dusty-rose-soft` | `#D8B9AD` | Hover-стан rose |
| `graphite` | `#1A1A1A` | Основний текст |
| `graphite-soft` | `#4A4A4A` | Вторинний текст |

### Рекомендації використання

- **Контраст:** мінімум `deep-forest` на `cream` (4.5:1+)
- **Rose** — тільки для тонких акцентів (CTA-кнопки, теги, badge), не для великих площин
- **Sage** — для іконок, ілюстрацій, тонких рамок
- **Cream + cream-soft** — двохрівневий фон секцій (зебра-pattern)

---

## Типографіка

### Шрифти

| Роль | Шрифт | Fallback |
|---|---|---|
| Display (заголовки H1–H4) | Fraunces (variable) | Georgia, serif |
| Body (текст, описи) | Inter (variable) | system-ui, sans-serif |
| Mono (код, реквізити) | JetBrains Mono | SF Mono, monospace |

### Type scale (mobile-first)

| Рівень | rem | px | Призначення |
|---|---|---|---|
| `xs` | 0.75 | 12 | Caption, label |
| `sm` | 0.875 | 14 | Secondary text |
| `base` | 1.0 | 16 | Body |
| `lg` | 1.125 | 18 | Lead body |
| `xl` | 1.5 | 24 | H4 |
| `2xl` | 2.0 | 32 | H3 |
| `3xl` | 2.75 | 44 | H2, hero secondary |
| `4xl` | 3.5 | 56 | H1 |
| `display` | 4.0 | 64 | Hero (mobile) |
| `display-lg` | 5.5 | 88 | Hero (desktop) |

### Line heights

- `tight` 1.15 — display headings
- `snug` 1.35 — H2/H3
- `relaxed` 1.65 — body
- `loose` 1.85 — long-form (блог, оферта)

### Tracking (letter-spacing)

- `tight` -0.02em — дисплей
- `normal` 0 — body
- `wide` 0.02em — caps
- `wider` 0.08em — для маленьких надписів upper

### Weights

- 300 (Light) — тонкі display
- 400 (Regular) — більшість display + body
- 500 (Medium) — body emphasis, button labels
- 600 (Semibold) — H4, button strong

---

## Spacing scale

Використовуємо Tailwind за замовчуванням (4px-based: `1` = 4px). Поширені значення:

- `1` 4 — щілини
- `2` 8 — компонентні зазори
- `3` 12 — між елементами
- `4` 16 — секції картки
- `6` 24 — між картками
- `8` 32 — між блоками
- `12` 48 — між секціями (mobile)
- `16` 64 — між секціями (desktop)
- `24` 96 — великі секції-розриви
- `32` 128 — hero spacing

---

## Radius

| Токен | px | Призначення |
|---|---|---|
| `none` | 0 | Чисті прямокутники (editorial) |
| `sm` | 4 | Inputs, badges |
| `md` | 8 | Buttons, small cards |
| `lg` | 16 | Bouquet cards, modals |
| `xl` | 24 | Hero cards, big containers |
| `full` | 9999 | Avatar, dot |

**Дефолт для бренду:** `lg` для основних карток. Не використовуємо `xl+` агресивно — це не «friendly app».

---

## Shadows (subtle, editorial)

```css
--shadow-soft: 0 1px 2px rgba(44, 62, 45, 0.04), 0 4px 12px rgba(44, 62, 45, 0.04);
--shadow-card: 0 2px 4px rgba(44, 62, 45, 0.03), 0 8px 24px rgba(44, 62, 45, 0.06);
--shadow-hover: 0 4px 8px rgba(44, 62, 45, 0.06), 0 16px 40px rgba(44, 62, 45, 0.10);
```

**Принцип:** тіні майже непомітні, але дають глибину. Без агресивного box-shadow.

---

## Containers

| Токен | px | Призначення |
|---|---|---|
| `narrow` | 880 | Прозовий контент (блог, оферта, about) |
| `default` | 1280 | Каталог, головна |
| `wide` | 1440 | Hero-секції, full-bleed |

---

## Animation timing

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* плавне затухання */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1); /* для page transitions */
--duration-fast: 200ms;     /* hover, focus */
--duration-base: 300ms;     /* default transitions */
--duration-slow: 500ms;     /* page transitions, reveals */
--duration-very-slow: 800ms; /* hero animations */
```

**Принцип:** на mobile усі тривалості **-30%** (тачскрин швидше переключає увагу).

---

## Touch targets (mobile-first)

- Мінімум **48×48 px** для тач-таргетів
- Мінімум **8 px** між інтерактивними елементами
- Кнопки в формах — повна ширина на mobile (≤768)

---

## Accessibility

- Контраст **WCAG AA** мінімум (4.5:1 для тексту, 3:1 для UI)
- `prefers-reduced-motion` — анімації вимикаються
- `focus-visible` стан — обов'язковий outline
- ARIA-розмітка для всіх інтерактивних елементів
- alt-теги для всіх зображень (генерує AI на основі image_generation_context)

---

## Mobile-first ефекти (швидка довідка)

| Ефект | Mobile | Desktop |
|---|---|---|
| Кастомний курсор | ❌ (tap-ripple) | ✅ (лепесток) |
| Magnetic buttons | press-and-hold + haptic | mouse-pull magnetic |
| Image hover swap | tap-to-preview або auto-rotate | hover swap |
| Parallax | scroll-velocity | mouse-parallax |
| Sticky filters | bottom-sheet (свайп) | left column |
| 3D rotation | swipe-жест | drag mouse |
| Page transitions | 200ms | 300ms |
| Marquee pause | swipe-to-pause | hover-pause |

---

## Performance budget

- **Lighthouse Performance Mobile ≥85** (hard rule)
- **LCP < 2.5s, FCP < 1.5s, CLS < 0.1** на 4G
- **JS bundle < 150 KB gzipped** на критичних сторінках
- Усі анімації через CSS `transform` / `opacity` (не layout properties)
- `will-change` тільки на елементах в активному руху
- `prefers-reduced-motion` респектується скрізь

---

## Anti-patterns (НЕ робимо)

- ❌ Золоті градієнти, foiling, металік
- ❌ Реалістичні ілюстрації квітів
- ❌ Watercolor ефекти
- ❌ Rainbow палітри
- ❌ Frames, boxes, орнаменти
- ❌ Скриптові handwriting шрифти
- ❌ Times New Roman (banal serif)
- ❌ Емоджі в брендингу (🌹 🌷)
- ❌ CAPS-розставлені «CHANEL»-стиль
- ❌ Italics в основному wordmark
- ❌ Particle-ефекти лепестків
- ❌ Кінетична типографіка
- ❌ WebGL-фон на hero
- ❌ Cookie banner
- ❌ Push-сповіщення в браузері

---

**Цей файл — фундамент. Від нього починаємо кожен компонент.**
