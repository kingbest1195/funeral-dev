// =================
// КОНТЕНТ СТРАНИЦЫ УСЛУГ - content.js
// Константы и данные для страницы услуг ритуальной службы "Век"
// =================

// Импорты изображений для ритуального магазина (необходимо для production сборки)
import coffinStandardWebp from "@/assets/images-optimized/quiz-icons/coffin-standard.webp";
import coffinStandardPng from "@/assets/images-optimized/quiz-icons/coffin-standard.png";
import wreathFlowersWebp from "@/assets/images-optimized/quiz-icons/wreath-flowers.webp";
import wreathFlowersPng from "@/assets/images-optimized/quiz-icons/wreath-flowers.png";
import crossWoodenWebp from "@/assets/images-optimized/quiz-icons/cross-wooden.webp";
import crossWoodenPng from "@/assets/images-optimized/quiz-icons/cross-wooden.png";
import clothesFormalWebp from "@/assets/images-optimized/quiz-icons/clothes-formal.webp";
import clothesFormalPng from "@/assets/images-optimized/quiz-icons/clothes-formal.png";
import churchItemsWebp from "@/assets/images-optimized/ritual-icons/church-items.webp";
import churchItemsPng from "@/assets/images-optimized/ritual-icons/church-items.png";
import ribbonMourningWebp from "@/assets/images-optimized/quiz-icons/ribbon-mourning.webp";
import ribbonMourningPng from "@/assets/images-optimized/quiz-icons/ribbon-mourning.png";

// Импорты изображений для залов и магазина
import funeralHallBigWebp from "@/assets/images-optimized/funeral-hall/funeral-hall-big.webp";
import funeralHallBigPng from "@/assets/images-optimized/funeral-hall/funeral-hall-big.png";
import funeralHallSmallWebp from "@/assets/images-optimized/funeral-hall/funeral-hall-small.webp";
import funeralHallSmallPng from "@/assets/images-optimized/funeral-hall/funeral-hall-small.png";
import funeralMarketWebp from "@/assets/images-optimized/transport-and-office/funeral-market.webp";
import funeralMarketPng from "@/assets/images-optimized/transport-and-office/funeral-market.png";

// Импорты из глобальных констант
import { SITE_CONFIG, getFullUrl, getOgImageUrl } from "@/constants/content.js";

// SEO данные для страницы услуг
export const USLUGI_SEO_DATA = {
  title: `Ритуальные услуги${SITE_CONFIG.COMMON_TEXTS.LOCATION}: организация похорон и кремация${SITE_CONFIG.COMMON_TEXTS.SITE_TITLE_SUFFIX}`,
  description: `Полный комплекс ритуальных услуг от службы \"Век\"${SITE_CONFIG.COMMON_TEXTS.LOCATION}. Организация похорон, кремация, ритуальные залы для прощания, транспорт, магазин товаров. Деликатная помощь и поддержка 24/7. Звоните.`,
  keywords:
    "ритуальные услуги Шуя, организация похорон Шуя, кремация Шуя, прощальные залы, ритуальный магазин, памятники Шуя",
  type: "website",
  // Open Graph и Twitter Card мета-теги
  ogTitle: `Ритуальные услуги${SITE_CONFIG.COMMON_TEXTS.LOCATION}: полный комплекс услуг${SITE_CONFIG.COMMON_TEXTS.SITE_TITLE_SUFFIX}`,
  ogDescription: `Организация похорон, кремация, ритуальные залы для прощания${SITE_CONFIG.COMMON_TEXTS.LOCATION}. Круглосуточная поддержка, деликатная помощь. Магазин ритуальных товаров.${SITE_CONFIG.COMMON_TEXTS.DESCRIPTION_SUFFIX}`,
  ogImage: getOgImageUrl(SITE_CONFIG.OG_IMAGES.SERVICES),
  ogUrl: getFullUrl("/uslugi"),
  ogType: "website",
  ogSiteName: SITE_CONFIG.SITE_NAME,
  twitterCard: "summary_large_image",
  twitterTitle: `Ритуальные услуги${SITE_CONFIG.COMMON_TEXTS.LOCATION}: полный комплекс услуг${SITE_CONFIG.COMMON_TEXTS.SITE_TITLE_SUFFIX}`,
  twitterDescription: `Организация похорон, кремация, ритуальные залы для прощания${SITE_CONFIG.COMMON_TEXTS.LOCATION}. Круглосуточная поддержка.${SITE_CONFIG.COMMON_TEXTS.DESCRIPTION_SUFFIX}`,
  twitterImage: getOgImageUrl(SITE_CONFIG.OG_IMAGES.SERVICES),
};

// JSON-LD структурированные данные для страницы услуг
export const USLUGI_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Ритуальные услуги",
  description: USLUGI_SEO_DATA.description,
  url: getFullUrl("/uslugi"),
  mainEntity: {
    "@type": "Service",
    serviceType: "Ритуальные услуги",
    name: "Полный комплекс ритуальных услуг",
    description:
      "Организация похорон, кремация, ритуальные залы, транспорт, ритуальный магазин",
    provider: {
      "@type": ["FuneralService", "LocalBusiness"],
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
        item: "https://ritual-vek.ru",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Услуги",
        item: "https://ritual-vek.ru/uslugi",
      },
    ],
  },
};

// Контент hero секции
export const USLUGI_HERO_CONTENT = {
  title: "Полный комплекс ритуальных услуг в Шуе",
  description:
    'Мы понимаем, насколько тяжела ваша утрата. Ритуальная служба "Век" готова взять на себя все заботы по организации достойного прощания, предоставив полный спектр услуг — от оформления документов до проведения поминальной трапезы. Наши специалисты деликатно помогут вам на каждом этапе.',
  cta: {
    text: "Круглосуточная консультация: +7 (920) 366-36-36",
    phone: "+79203663636",
    ariaLabel: "Позвонить в ритуальную службу Век",
  },
};

// Контент секции прощальных залов
export const FUNERAL_HALLS_CONTENT = {
  title: "Прощальные залы для церемоний",
  description:
    "Для проведения церемонии прощания мы предлагаем два специально оборудованных зала. Вне зависимости от количества приглашенных, вы сможете в спокойной и достойной обстановке проститься с близким человеком, не ограничиваясь по времени.",
  halls: [
    {
      id: "big-hall",
      title: "Большой зал (до 60 человек)",
      description:
        "Просторный и торжественный зал площадью 200 кв. м, предназначенный для проведения масштабных церемоний прощания. Зал оснащен постаментом для гроба, достаточным количеством сидячих мест и системой кондиционирования, что позволяет с комфортом разместить до 60 гостей.",
      image: {
        webp: funeralHallBigWebp,
        png: funeralHallBigPng,
        alt: "Большой прощальный зал ритуальной службы Век в Шуе",
        width: 600,
        height: 400,
      },
    },
    {
      id: "small-hall",
      title: "Малый зал (до 30 человек)",
      description:
        "Уютный и более камерный зал площадью 80 кв. м. Он идеально подходит для прощания в кругу самых близких людей и рассчитан на комфортное размещение до 30 гостей. Спокойная атмосфера зала позволяет провести церемонию в уединенной обстановке.",
      image: {
        webp: funeralHallSmallWebp,
        png: funeralHallSmallPng,
        alt: "Малый зал для прощания в ритуальной службе Век",
        width: 600,
        height: 400,
      },
    },
  ],
};

// Контент секции ритуального магазина
export const RITUAL_SHOP_CONTENT = {
  title: "Ритуальный магазин: все необходимое в одном месте",
  description:
    "При нашей службе работает магазин, где представлен широкий ассортимент ритуальных принадлежностей. Это избавляет вас от необходимости посещать несколько мест в тяжелое время. Наш агент поможет подобрать все необходимое в соответствии с вашими пожеланиями и бюджетом.",
  subtitle: "В наличии всегда имеются:",
  items: [
    {
      id: "coffins",
      icon: {
        webp: coffinStandardWebp,
        png: coffinStandardPng,
      },
      alt: "Иконка гроба",
      text: "Гробы (от бюджетных моделей до элитных, обитых тканью и лакированных)",
    },
    {
      id: "wreaths",
      icon: {
        webp: wreathFlowersWebp,
        png: wreathFlowersPng,
      },
      alt: "Иконка венков",
      text: "Венки, корзины и цветочные композиции из искусственных и живых цветов",
    },
    {
      id: "crosses",
      icon: {
        webp: crossWoodenWebp,
        png: crossWoodenPng,
      },
      alt: "Иконка креста",
      text: "Кресты на могилу из дерева и металла",
    },
    {
      id: "clothes",
      icon: {
        webp: clothesFormalWebp,
        png: clothesFormalPng,
      },
      alt: "Иконка одежды",
      text: "Одежда, обувь и текстиль для усопших",
    },
    {
      id: "church-items",
      icon: {
        webp: churchItemsWebp,
        png: churchItemsPng,
      },
      alt: "Иконка церковных принадлежностей",
      text: "Церковные принадлежности (свечи, лампады, иконы)",
    },
    {
      id: "ribbons",
      icon: {
        webp: ribbonMourningWebp,
        png: ribbonMourningPng,
      },
      alt: "Иконка траурной ленты",
      text: "Траурные ленты с индивидуальной надписью",
    },
  ],
  image: {
    webp: funeralMarketWebp,
    png: funeralMarketPng,
    alt: "Ритуальный магазин службы Век в Шуе",
    width: 600,
    height: 400,
  },
};
