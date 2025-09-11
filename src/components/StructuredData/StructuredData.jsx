import React from "react";
import { Helmet } from "react-helmet-async";

const StructuredData = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["FuneralService", "LocalBusiness"],
    name: "Ритуальная служба Век",
    image: "https://ритуал-век.рф/logo-vek.svg",
    "@id": "https://ритуал-век.рф/",
    url: "https://ритуал-век.рф/",
    telephone: "+7-920-366-36-36",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Красноармейский переулок, 6",
      addressLocality: "Шуя",
      addressRegion: "Ивановская область",
      postalCode: "155900",
      addressCountry: "RU",
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
      ratingValue: "4.7",
      reviewCount: "35",
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