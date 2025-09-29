import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import Global from "@/components/Global/Global.jsx";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs.jsx";
import ServiceHero from "@/components/ServiceHero/ServiceHero.jsx";
import Paragraph from "@/components/Paragraph/Paragraph.jsx";
import AdvantagesSection from "@/components/AdvantagesSection/AdvantagesSection.jsx";
import ServiceTimeline from "@/components/ServiceTimeline/ServiceTimeline.jsx";
import FAQAccordion from "@/components/FAQAccordion/FAQAccordion.jsx";
import CTASection from "@/pages/HomePage/components/CTASection/CTASection.jsx";
import {
  PAMYATNIKI_OGRADY_SEO_DATA,
  PAMYATNIKI_OGRADY_JSON_LD,
  BREADCRUMBS_DATA,
  HERO_CONTENT,
  PRODUCTION_CONTENT,
  ADVANTAGES_DATA,
  TIMELINE_DATA,
  FAQ_DATA,
  CTA_CONTENT
} from "./content.js";
import "./PamyatnikiOgradyPage.scss";

/**
 * Страница "Памятники и ограды от производителя в Шуе"
 * Услуги по изготовлению и установке памятников, оград, мемориальных комплексов
 */
const PamyatnikiOgradyPage = () => {
  const [faqJsonLd, setFaqJsonLd] = useState(null);

  // SEO данные для страницы - мемоизированы для оптимизации
  const seoData = useMemo(() => ({
    ...PAMYATNIKI_OGRADY_SEO_DATA,
    canonical: PAMYATNIKI_OGRADY_SEO_DATA.ogUrl,
    jsonLd: [PAMYATNIKI_OGRADY_JSON_LD, faqJsonLd].filter(Boolean)
  }), [faqJsonLd]);

  // Обработчик для обновления FAQ JSON-LD
  const handleFaqJsonLdUpdate = useCallback((jsonLd) => {
    setFaqJsonLd(jsonLd);
  }, []);

  return (
    <Global seo={seoData} pageClass="pamyatniki-ogrady-page">
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main>
        {/* Хлебные крошки */}
        <div className="container">
          <Breadcrumbs items={BREADCRUMBS_DATA} />
        </div>

        {/* Hero секция */}
        <ServiceHero
          title={HERO_CONTENT.title}
          description={HERO_CONTENT.description}
          cta={HERO_CONTENT.cta}
        />

        {/* Что мы производим */}
        <section className="pamyatniki-production" aria-labelledby="production-title">
          <div className="container">
            <h2 id="production-title" className="pamyatniki-production__title">
              {PRODUCTION_CONTENT.title}
            </h2>

            <p className="pamyatniki-production__description">
              {PRODUCTION_CONTENT.description}
            </p>

            <div className="pamyatniki-production__categories">
              {PRODUCTION_CONTENT.items.map((category, categoryIndex) => (
                <div key={categoryIndex} className="production-category">
                  <h3 className="production-category__title">
                    {category.category}
                  </h3>

                  <Paragraph>
                    <ul>
                      {category.services.map((service, serviceIndex) => (
                        <li key={serviceIndex}>
                          <strong>{service.term}</strong> – {service.definition}
                        </li>
                      ))}
                    </ul>
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Наши преимущества */}
        <AdvantagesSection
          title={ADVANTAGES_DATA.title}
          description={ADVANTAGES_DATA.description}
          advantages={ADVANTAGES_DATA.advantages}
          className="pamyatniki-advantages"
        />

        {/* Этапы заказа памятника - временная шкала */}
        <ServiceTimeline
          title={TIMELINE_DATA.title}
          description={TIMELINE_DATA.description}
          steps={TIMELINE_DATA.steps}
        />

        {/* FAQ секция */}
        <FAQAccordion
          title={FAQ_DATA.title}
          items={FAQ_DATA.items}
          onJsonLdUpdate={handleFaqJsonLdUpdate}
        />

        {/* Призыв к действию */}
        <CTASection
          title={CTA_CONTENT.title}
          description={CTA_CONTENT.description}
          buttonText={CTA_CONTENT.phone}
          buttonLink={`tel:${CTA_CONTENT.phone.replace(/[^\d+]/g, '')}`}
        />
      </main>
    </Global>
  );
};

export default PamyatnikiOgradyPage;