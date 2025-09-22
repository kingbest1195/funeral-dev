import React from "react";
import { Helmet } from "@dr.pogodin/react-helmet";

const StructuredData = () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ритуал-век.рф';

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FuneralHome",
    name: "Ритуальная служба Век",
    image: [
      `${baseUrl}/logo-vek.svg`,
      `${baseUrl}/assets/office-facade-main.jpg`
    ],
    "@id": `${baseUrl}/`,
    url: `${baseUrl}/`,
    telephone: "+7 (920) 366-36-36",
    description: "Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремация, памятники. Профессиональные агенты. Звоните +7 (920) 366-36-36",
    priceRange: "$$",
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
      name: "Шуя"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ритуальные услуги",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Организация похорон"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Кремация"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Памятники и ограды",
            description: "Гранитные и мраморные памятники, ограды для мест захоронения",
            category: "Ритуальные товары",
            offers: {
              "@type": "Offer",
              availability: "http://schema.org/InStock",
              priceCurrency: "RUB",
              price: "15000",
              priceRange: "15000-150000"
            }
          }
        }
      ]
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
        closes: "23:59",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "35",
      bestRating: "5",
      worstRating: "1"
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemaData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;