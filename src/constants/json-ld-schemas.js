/**
 * Централизованный модуль для JSON-LD структурированных данных
 * Экспортирует схемы для всех страниц сайта
 * Используется как в React компонентах, так и в статическом генераторе HTML
 */

import { SITE_CONFIG, getFullUrl } from "./content.js";

// ПОЛНАЯ схема LocalBusiness для главной страницы (статическая версия)
// Эта схема вставляется в статический HTML для гарантированной индексации Яндексом
export const HOME_LOCAL_BUSINESS_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://xn----7sbhmlqd1btk.xn--p1ai/#organization",
  name: "Ритуальная служба Век",
  alternateName: "ИП Шадрина Лариса Геннадьевна",
  legalName: "ИП Шадрина Лариса Геннадьевна",
  telephone: "+7 (920) 366-36-36",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ул. Красноармейский переулок, 6",
    addressLocality: "г. Шуя",
    addressRegion: "Ивановская область",
    addressCountry: "RU",
    postalCode: "155900",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "56.847504",
    longitude: "41.378828",
  },
  openingHours: "Mo-Su 08:00-17:00",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "17:00",
    },
  ],
  url: "https://xn----7sbhmlqd1btk.xn--p1ai",
  image: "https://xn----7sbhmlqd1btk.xn--p1ai/logo-vek.svg",
  logo: "https://xn----7sbhmlqd1btk.xn--p1ai/logo-vek.svg",
  description:
    "Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремация, памятники. Профессиональные агенты. Звоните +7 (920) 366-36-36",
  priceRange: "$$",
  areaServed: {
    "@type": "City",
    name: "Шуя",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Ритуальные услуги",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Организация похорон",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Кремация",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: "Памятники и ограды",
          description:
            "Гранитные и мраморные памятники, ограды для мест захоронения",
          category: "Ритуальные товары",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: 4.89,
            reviewCount: 38,
            bestRating: 5,
            worstRating: 1,
          },
          offers: {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            priceCurrency: "RUB",
            price: "15000",
          },
        },
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.89,
    reviewCount: 38,
    bestRating: 5,
    worstRating: 1,
  },
  review: [
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Николай П.",
      },
      datePublished: "2023-05-04",
      reviewBody:
        "Спасибо, за помощь с обрядом погребения. Ваше внимание и забота достойна уважения.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Алена Горбунова",
      },
      datePublished: "2023-04-17",
      reviewBody:
        "Спасибо ритуальной  службе «Век», все было организованно но высшем уровне, работники относятся с понимаем, цены доступные.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Таня П.",
      },
      datePublished: "2023-04-03",
      reviewBody:
        "Спасибо большое всему коллективу! Помогли во всём по приемлемым ценам и поддержали в трудный момент.",
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      },
    },
    {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Наталья Алексеевна Окунькова",
      },
      datePublished: "2023-03-20",
      reviewBody:
        'Благодарю коллектив ритуальной службы "Век" за отзывчивость и профессионализм. Помогли достойно устроить похороны близкого человека.',
      reviewRating: {
        "@type": "Rating",
        ratingValue: 5,
        bestRating: 5,
        worstRating: 1,
      },
    },
  ],
};

// Базовая схема LocalBusiness для всех страниц (для обратной совместимости)
const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Ритуальная служба Век",
  telephone: "+79203663636",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Красноармейский переулок, 6",
    addressLocality: "Шуя",
    addressRegion: "Ивановская область",
    postalCode: "155900",
    addressCountry: "RU",
  },
  areaServed: {
    "@type": "City",
    name: "Шуя",
  },
  openingHours: "Mo-Su 08:00-17:00",
  url: getFullUrl(),
  description: "Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремация, памятники.",
  priceRange: "$$"
});

// JSON-LD для страницы услуг
export const USLUGI_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Ритуальные услуги",
  description: "Полный комплекс ритуальных услуг от службы \"Век\" в г. Шуя. Организация похорон, кремация, ритуальные залы для прощания, транспорт, магазин товаров. Деликатная помощь и поддержка 24/7.",
  url: getFullUrl("/uslugi"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Ритуальные услуги",
    name: "Полный комплекс ритуальных услуг",
    description: "Организация похорон, кремация, ритуальные залы, транспорт, ритуальный магазин",
    provider: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.SITE_NAME,
      url: getFullUrl(),
      telephone: "+79203663636",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Шуя",
        addressRegion: "Ивановская область",
        addressCountry: "RU",
      },
      openingHours: "Mo-Su 00:00-24:00",
    },
    areaServed: {
      "@type": "City",
      name: "Шуя",
    },
    offers: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Организация похорон",
          description: "Полный комплекс услуг по организации похорон",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Кремация",
          description: "Услуги кремации и сопутствующие услуги",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Прощальные залы",
          description: "Аренда прощальных залов для церемоний",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Ритуальный магазин",
          description: "Продажа ритуальных принадлежностей и атрибутов",
        },
      },
    ],
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
    ],
  },
};

// JSON-LD для страницы организации похорон
export const ORGANIZATSIYA_POHORON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Организация похорон в Шуе",
  description: "Профессиональная организация похорон в Шуе от службы \"Век\". Полный комплекс услуг: от оформления документов до проведения поминального обеда. Поможем достойно проститься с близким. Круглосуточная деликатная поддержка.",
  url: getFullUrl("/uslugi/organizatsiya-pohoron"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Организация похорон",
    name: "Полная организация похорон под ключ",
    description: "Профессиональная организация похорон в Шуе с полным комплексом услуг",
    serviceOutput: "Полная организация похорон",
    serviceAudience: {
      "@type": "Audience",
      geographicArea: "Шуя, Ивановская область",
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.SITE_NAME,
      url: getFullUrl(),
      telephone: "+79203663636",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Шуя",
        addressRegion: "Ивановская область",
        addressCountry: "RU",
      },
      openingHours: "Mo-Su 00:00-24:00",
    },
    areaServed: {
      "@type": "City",
      name: "Шуя",
    },
    offers: {
      "@type": "Offer",
      priceRange: "20000-55000",
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
        name: "Организация похорон",
        item: getFullUrl("/uslugi/organizatsiya-pohoron"),
      },
    ],
  },
};

// JSON-LD для страницы перевозки умерших
export const TRANSPORTIROVKA_UMERSHEGO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Перевозка умерших в Шуе и по России",
  description: "Услуги по перевозке умерших в Шуе и по России (Груз 200). Специализированный ритуальный транспорт (катафалк) для похорон. Бережная и своевременная подача транспорта 24/7. Ритуальная служба \"Век\".",
  url: getFullUrl("/uslugi/transportirovka-umershego"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Перевозка умерших",
    name: "Ритуальный транспорт и перевозка умерших",
    description: "Транспортировка тела усопшего специализированным транспортом в Шуе и по России",
    serviceOutput: "Транспортировка умерших",
    serviceAudience: {
      "@type": "Audience",
      geographicArea: "Шуя, Ивановская область, Россия",
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.SITE_NAME,
      url: getFullUrl(),
      telephone: "+79203663636",
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

// JSON-LD для страницы благоустройства могил
export const BLAGOUSTROYSTVO_MOGIL_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Благоустройство могил и мест захоронения в Шуе",
  description: "Услуги по благоустройству могил в Шуе. Укладка плитки, установка цоколя, оград, памятников. Создание мемориальных комплексов. Уход за захоронениями. Гарантия качества.",
  url: getFullUrl("/uslugi/blagoustroystvo-mogil"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Благоустройство мест захоронения",
    name: "Благоустройство могил и мемориальных комплексов",
    description: "Комплексные услуги по благоустройству мест захоронения: укладка плитки, установка цоколя, оград и памятников",
    serviceOutput: "Благоустроенное место захоронения",
    serviceAudience: {
      "@type": "Audience",
      geographicArea: "Шуя, Ивановская область",
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.SITE_NAME,
      url: getFullUrl(),
      telephone: "+79203663636",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Шуя",
        addressRegion: "Ивановская область",
        addressCountry: "RU",
      },
      openingHours: "Mo-Su 00:00-24:00",
    },
    areaServed: {
      "@type": "City",
      name: "Шуя",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Ивановская область",
      },
    },
    offers: [
      {
        "@type": "Offer",
        name: "Укладка плитки на могилу",
        description: "Облицовка территории тротуарной, гранитной или керамогранитной плиткой",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
        },
      },
      {
        "@type": "Offer",
        name: "Установка цоколя",
        description: "Создание прочного фундамента по периметру участка из гранита или бетона",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
        },
      },
      {
        "@type": "Offer",
        name: "Уход за захоронениями",
        description: "Разовый и годовой уход за местами захоронения с фотоотчетом",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
        },
      },
    ],
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
        name: "Благоустройство могил",
        item: getFullUrl("/uslugi/blagoustroystvo-mogil"),
      },
    ],
  },
};

// JSON-LD для страницы кремации
export const KREMATSIYA_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Организация кремации в Шуе",
  description: "Полная организация кремации в Шуе от ритуальной службы \"Век\". Помощь в оформлении документов, проведение прощания, доставка праха. Узнайте стоимость и порядок процедуры. Круглосуточная поддержка.",
  url: getFullUrl("/uslugi/krematsiya"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Организация кремации",
    name: "Полная организация кремации",
    description: "Комплексные услуги по организации кремации: оформление документов, проведение церемонии прощания, доставка праха",
    serviceOutput: "Организация кремации и доставка праха",
    serviceAudience: {
      "@type": "Audience",
      geographicArea: "Шуя, Ивановская область",
    },
    provider: {
      "@type": "LocalBusiness",
      name: "Ритуальная служба Век",
      url: getFullUrl(),
      telephone: "+79203663636",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Шуя",
        addressRegion: "Ивановская область",
        addressCountry: "RU",
      },
      openingHours: "Mo-Su 00:00-24:00",
    },
    areaServed: {
      "@type": "City",
      name: "Шуя",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Ивановская область",
      },
    },
    offers: [
      {
        "@type": "Offer",
        name: "Пакет 'Эконом'",
        description: "Базовая организация кремации с гробом и оформлением документов",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "25000",
          priceCurrency: "RUB",
        },
      },
      {
        "@type": "Offer",
        name: "Пакет 'Стандарт'",
        description: "Организация кремации с залом прощания и урной для праха",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "45000",
          priceCurrency: "RUB",
        },
      },
      {
        "@type": "Offer",
        name: "Пакет 'Премиум'",
        description: "Полная организация кремации с сопровождением агента",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "70000",
          priceCurrency: "RUB",
        },
      },
    ],
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
        name: "Кремация",
        item: getFullUrl("/uslugi/krematsiya"),
      },
    ],
  },
};

// JSON-LD для страницы памятников и оград
export const PAMYATNIKI_OGRADY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Изготовление памятников и оград в Шуе",
  description: "Изготовление и установка гранитных и мраморных памятников, оград и мемориальных комплексов в Шуе. Собственное производство. Гарантия качества, доступные цены. Закажите бесплатный 3D-макет.",
  url: getFullUrl("/uslugi/pamyatniki-ogrady"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Изготовление памятников и оград",
    name: "Памятники и ограды от производителя",
    description: "Собственное производство памятников из гранита и мрамора, металлических и кованых оград, мемориальных комплексов в Шуе",
    serviceOutput: "Изготовление и установка памятников",
    serviceAudience: {
      "@type": "Audience",
      geographicArea: "Шуя, Ивановская область",
    },
    provider: {
      "@type": "Organization",
      name: "Ритуальная служба Век",
      telephone: "+79203663636",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Шуя",
        addressRegion: "Ивановская область",
        addressCountry: "Россия",
      },
    },
    areaServed: {
      "@type": "City",
      name: "Шуя",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Ивановская область",
      },
    },
    offers: [
      {
        "@type": "Offer",
        name: "Гранитные памятники",
        description: "Вертикальные и горизонтальные памятники из карельского гранита",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
        },
      },
      {
        "@type": "Offer",
        name: "Мраморные памятники",
        description: "Памятники из уральского мрамора с художественной обработкой",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
        },
      },
      {
        "@type": "Offer",
        name: "Мемориальные комплексы",
        description: "Эксклюзивные мемориальные комплексы с полным благоустройством",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "RUB",
        },
      },
    ],
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
        name: "Памятники и ограды",
        item: getFullUrl("/uslugi/pamyatniki-ogrady"),
      },
    ],
  },
};

// JSON-LD для страницы "Захоронение участников СВО"
export const ZAHORONENIE_UCHASTNIKOV_SVO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Организация похорон участников и ветеранов боевых действий (СВО)",
  description:
    "Помощь в организации похорон участников и ветеранов СВО в Шуе. Полное сопровождение: оформление льгот, взаимодействие с военкоматом, организация воинских почестей.",
  url: getFullUrl("/uslugi/zahoronenie-uchastnikov-svo"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Организация похорон участников СВО",
    name: "Похороны участников и ветеранов боевых действий с воинскими почестями",
    description:
      "Полное сопровождение при организации похорон участников и ветеранов СВО в Шуе. Оформление документов, взаимодействие с военкоматом, воинские почести, помощь в получении государственных компенсаций.",
    provider: {
      "@type": "LocalBusiness",
      name: SITE_CONFIG.SITE_NAME,
      url: getFullUrl(),
      telephone: "+79203663636",
    },
    areaServed: {
      "@type": "City",
      name: "Шуя",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "RUB",
      price: "0",
      description:
        "Расходы полностью компенсируются государством согласно Федеральному закону",
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
        name: "Все услуги",
        item: getFullUrl("/uslugi"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Захоронение участников СВО",
        item: getFullUrl("/uslugi/zahoronenie-uchastnikov-svo"),
      },
    ],
  },
};

// Экспорт всех схем для удобного использования
export const JSON_LD_SCHEMAS = {
  uslugi: USLUGI_JSON_LD,
  'organizatsiya-pohoron': ORGANIZATSIYA_POHORON_JSON_LD,
  'transportirovka-umershego': TRANSPORTIROVKA_UMERSHEGO_JSON_LD,
  'blagoustroystvo-mogil': BLAGOUSTROYSTVO_MOGIL_JSON_LD,
  'krematsiya': KREMATSIYA_JSON_LD,
  'pamyatniki-ogrady': PAMYATNIKI_OGRADY_JSON_LD,
  'zahoronenie-uchastnikov-svo': ZAHORONENIE_UCHASTNIKOV_SVO_JSON_LD,
  localBusiness: createLocalBusinessSchema,
};

export default JSON_LD_SCHEMAS;