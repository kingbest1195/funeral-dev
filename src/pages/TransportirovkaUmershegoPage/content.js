// =================
// КОНТЕНТ СТРАНИЦЫ "ПЕРЕВОЗКА УМЕРШИХ" - content.js
// =================

import { SITE_CONFIG, getFullUrl, getOgImageUrl } from "@/constants/content.js";
import { COMPANY_INFO } from "@/helpers/index.js";

// Импорты изображений автопарка
import hearseModernWebp from "@/assets/images-optimized/transport-and-office/hearse-modern.webp";
import hearseModern from "@/assets/images-optimized/transport-and-office/hearse-modern.png";
import hearsePremiumWebp from "@/assets/images-optimized/transport-and-office/hearse-premium.webp";
import hearsePremium from "@/assets/images-optimized/transport-and-office/hearse-premium.png";

// Константы для устранения дублирования
const PAGE_TITLE = `Ритуальный транспорт и перевозка умерших в Шуе – Груз 200 | Служба "Век"`;
const PAGE_DESCRIPTION = `Услуги по перевозке умерших в Шуе и по России (Груз 200). Специализированный ритуальный транспорт (катафалк) для похорон. Бережная и своевременная подача транспорта 24/7. Ритуальная служба "Век".`;
const SHORT_DESCRIPTION = `Услуги по перевозке умерших в Шуе и по России (Груз 200). Специализированный ритуальный транспорт для похорон. Бережная подача транспорта 24/7.`;

// SEO данные для страницы перевозки умерших
export const TRANSPORTIROVKA_UMERSHEGO_SEO_DATA = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords:
    "перевозка умерших Шуя, ритуальный транспорт, катафалк Шуя, груз 200, транспортировка тела умершего, похоронный транспорт",
  type: "webpage",
  ogTitle: PAGE_TITLE,
  ogDescription: SHORT_DESCRIPTION,
  ogImage: getOgImageUrl(SITE_CONFIG.OG_IMAGES.SERVICES),
  ogUrl: getFullUrl("/uslugi/transportirovka-umershego"),
  ogType: "website",
  ogSiteName: SITE_CONFIG.SITE_NAME,
  twitterCard: "summary_large_image",
  twitterTitle: PAGE_TITLE,
  twitterDescription: SHORT_DESCRIPTION,
  twitterImage: getOgImageUrl(SITE_CONFIG.OG_IMAGES.SERVICES),
};

// JSON-LD структурированные данные для страницы
export const TRANSPORTIROVKA_UMERSHEGO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Перевозка умерших в Шуе и по России",
  description: TRANSPORTIROVKA_UMERSHEGO_SEO_DATA.description,
  url: getFullUrl("/uslugi/transportirovka-umershego"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Перевозка умерших",
    name: "Ритуальный транспорт и перевозка умерших",
    description:
      "Транспортировка тела усопшего специализированным транспортом в Шуе и по России",
    serviceOutput: "Транспортировка умерших",
    serviceAudience: {
      "@type": "Audience",
      geographicArea: "Шуя, Ивановская область, Россия",
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.SITE_NAME,
      url: getFullUrl(),
      telephone: COMPANY_INFO.phone.replace(/[^\d+]/g, ''),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Шуя",
        addressRegion: "Ивановская область",
        addressCountry: "RU",
      },
      openingHours: "Mo-Su 00:00-24:00",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Шуя",
      },
      {
        "@type": "Country",
        name: "Россия",
      },
    ],
    offers: {
      "@type": "Offer",
      priceRange: "5000-25000",
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
    },
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: getFullUrl(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Услуги",
        item: getFullUrl("/uslugi"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Перевозка умерших",
        item: getFullUrl("/uslugi/transportirovka-umershego"),
      },
    ],
  },
};

// Хлебные крошки для страницы
export const BREADCRUMBS_DATA = [
  { label: "Главная", href: "/" },
  { label: "Все услуги", href: "/uslugi" },
  { label: "Перевозка умерших" }, // Текущая страница без href
];

// Контент hero секции
export const HERO_CONTENT = {
  title: "Перевозка умерших в Шуе и по России",
  description:
    'Транспортировка тела усопшего — обязательный и ответственный этап похорон, требующий специального транспорта и деликатного подхода. Ритуальная служба "Век" предоставляет полный спектр транспортных услуг: от первой перевозки в морг до организации междугородних перевозок (Груз 200). Мы гарантируем своевременную подачу чистого и оборудованного катафалка в любое время суток.',
  cta: {
    text: `Круглосуточная поддержка: ${COMPANY_INFO.phone}`,
    phone: COMPANY_INFO.phone.replace(/[^\d+]/g, ''),
    ariaLabel: "Позвонить в ритуальную службу Век для заказа транспорта",
  },
};

// Контент секции "Виды транспортных услуг"
export const SERVICES_CONTENT = {
  title: "Виды транспортных услуг",
  description:
    "Мы готовы предоставить транспорт для любых целей, связанных с прощанием и погребением.",
  items: [
    {
      term: "Перевозка тела в морг",
      definition:
        "Оперативная и бережная транспортировка усопшего из дома, больницы или другого места в морг города Шуя. Наш специализированный транспорт готов к выезду 24/7.",
    },
    {
      term: "Ритуальный транспорт на похороны (катафалк)",
      definition:
        "Предоставление катафалка для траурного кортежа в день похорон. Стандартный маршрут включает перевозку гроба с телом из морга к месту прощания (прощальный зал, храм, дом), а затем — к месту захоронения на кладбище.",
    },
    {
      term: "Транспорт для сопровождающих",
      definition:
        "При необходимости мы можем организовать пассажирский транспорт (автобус или микроавтобус) для перевозки родственников и близких на кладбище и к месту проведения поминального обеда.",
    },
    {
      term: "Груз 200 (междугородняя перевозка)",
      definition:
        "Организация перевозки тела усопшего на дальние расстояния по России и в страны СНГ. Услуга включает подготовку тела, сбор полного пакета сопроводительных документов и предоставление специально оборудованного транспорта для дальней дороги.",
    },
  ],
};

// Контент таблицы автопарка
export const AUTOPARK_DATA = {
  title: "Наш автопарк и стоимость услуг",
  description:
    "Мы располагаем собственным парком специализированных автомобилей, что позволяет нам предлагать честные цены и гарантировать высокий уровень сервиса.",
  note: "*Стоимость рассчитывается индивидуально и зависит от типа транспорта, маршрута и времени аренды. Мы гарантируем полную прозрачность и фиксируем цену в договоре.*",
  headers: ["Автомобиль", "Описание", "Область применения"],
  images: {
    hearseModern: { webp: hearseModernWebp, png: hearseModern },
    hearsePremium: { webp: hearsePremiumWebp, png: hearsePremium }
  },
  rows: [
    [
      "", // Первая колонка будет заменена изображением
      "Практичный и надежный автомобиль, оборудованный подиумом для гроба и посадочными местами для 5-6 сопровождающих. Оптимальный выбор для перевозок в пределах города и района.",
      "Местные перевозки, стандартные похороны",
    ],
    [
      "", // Первая колонка будет заменена изображением
      "Автомобиль представительского класса для торжественного траурного кортежа. Оснащен системой климат-контроля и обеспечивает максимальный комфорт для 2-4 сопровождающих.",
      "Торжественные церемонии, премиум услуги",
    ]
  ],
};

// Контент временной шкалы (3 шага)
export const TIMELINE_DATA = {
  title: "Как заказать ритуальный транспорт",
  description: "Процесс заказа максимально прост и не займет много времени.",
  steps: [
    {
      title: "Шаг 1. Ваш звонок.",
      description:
        `Вы звоните нам по номеру ${COMPANY_INFO.phone}, сообщаете маршрут, желаемое время и количество сопровождающих.`,
    },
    {
      title: "Шаг 2. Консультация и расчет.",
      description:
        "Наш специалист подбирает для вас оптимальный вариант транспорта, рассчитывает итоговую стоимость и подтверждает заказ.",
    },
    {
      title: "Шаг 3. Подача транспорта.",
      description:
        "Наш водитель подает чистый и подготовленный автомобиль точно в назначенное время и место.",
    },
  ],
};

// Контент FAQ секции
export const FAQ_DATA = {
  title: "Часто задаваемые вопросы (FAQ)",
  items: [
    {
      question: "Можно ли родственникам сопровождать гроб в катафалке?",
      answer:
        "Да, большинство наших автомобилей оборудованы посадочными местами для сопровождающих (от 2 до 6 человек). Пожалуйста, уточните количество пассажиров при заказе.",
    },
    {
      question: "Выполняете ли вы перевозку в другие города?",
      answer:
        'Да, мы оказываем услугу "Груз 200" для перевозки усопших в любую точку России. Мы полностью берем на себя оформление документов и подготовку к транспортировке.',
    },
    {
      question: "Насколько быстро вы можете подать транспорт для перевозки в морг?",
      answer:
        "Мы понимаем срочность ситуации. Специализированный транспорт для перевозки тела в морг выезжает сразу после вашего звонка и прибывает в кратчайшие сроки.",
    },
  ],
};

// Контент для CTA секции
export const CTA_CONTENT = {
  title: "Нужен ритуальный транспорт? Мы на связи 24/7",
  description:
    "Мы гарантируем бережное отношение, пунктуальность и профессионализм на каждом этапе перевозки. Свяжитесь с нами для заказа транспорта или получения подробной консультации.",
  phone: COMPANY_INFO.phone,
};