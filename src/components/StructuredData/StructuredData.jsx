import React from "react";
import { Helmet } from "@dr.pogodin/react-helmet";

const StructuredData = () => {
  // Используем фиксированный домен для избежания конфликтов
  const baseUrl = "https://ритуал-век.рф";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Ритуальная служба Век",
    image: [
      `${baseUrl}/logo-vek.svg`,
      `${baseUrl}/logo-vek.svg`,
    ],
    "@id": `${baseUrl}/`,
    url: `${baseUrl}/`,
    telephone: "+7 (920) 366-36-36",
    description:
      "Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремация, памятники. Профессиональные агенты. Звоните +7 (920) 366-36-36",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Красноармейский переулок, 6",
      addressLocality: "Шуя",
      addressRegion: "Ивановская область",
      postalCode: "155900",
      addressCountry: "RU",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 56.847504,
      longitude: 41.378828,
    },
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
            image: [
              `${baseUrl}/logo-vek.svg`,
              `${baseUrl}/logo-vek.svg`,
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              reviewCount: "35",
              bestRating: "5",
              worstRating: "1",
            },
            review: [
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Анна Смирнова",
                },
                datePublished: "2024-08-15",
                reviewBody:
                  "Качественные памятники, профессиональная установка. Благодарны за помощь в трудный момент.",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                  worstRating: "1",
                },
              },
              {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: "Михаил Петров",
                },
                datePublished: "2024-07-22",
                reviewBody:
                  "Отличное качество гранита, красивая работа. Рекомендую всем.",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: "5",
                  bestRating: "5",
                  worstRating: "1",
                },
              },
            ],
            offers: {
              "@type": "Offer",
              availability: "http://schema.org/InStock",
              priceCurrency: "RUB",
              price: "15000",
            },
          },
        },
      ],
    },
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
        opens: "00:00",
        closes: "24:00",
      },
    ],
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
          "Спасибо ребятам. Они проезжали мимо и помогли поднять упавшую плиту на могиле. Побольше бы таких отзывчивых людей!",
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
    </Helmet>
  );
};

export default StructuredData;
