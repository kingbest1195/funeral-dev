/**
 * Централизованный модуль для JSON-LD структурированных данных
 * Экспортирует схемы для всех страниц сайта
 * Используется как в React компонентах, так и в статическом генераторе HTML
 */

import { SITE_CONFIG, getFullUrl } from "./content.js";

// Базовая схема LocalBusiness для всех страниц
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
  openingHours: "Mo-Su 00:00-24:00",
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

// Экспорт всех схем для удобного использования
export const JSON_LD_SCHEMAS = {
  uslugi: USLUGI_JSON_LD,
  'organizatsiya-pohoron': ORGANIZATSIYA_POHORON_JSON_LD,
  'transportirovka-umershego': TRANSPORTIROVKA_UMERSHEGO_JSON_LD,
  localBusiness: createLocalBusinessSchema,
};

export default JSON_LD_SCHEMAS;