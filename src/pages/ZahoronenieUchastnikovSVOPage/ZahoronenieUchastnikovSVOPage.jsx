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
  ZAHORONENIE_UCHASTNIKOV_SVO_SEO_DATA,
  ZAHORONENIE_UCHASTNIKOV_SVO_JSON_LD,
  BREADCRUMBS_DATA,
  HERO_CONTENT,
  SERVICES_CONTENT,
  GUARANTEES_CONTENT,
  TIMELINE_DATA,
  ADVANTAGES_DATA,
  FAQ_DATA,
  CTA_CONTENT,
} from "./content.js";
import "./ZahoronenieUchastnikovSVOPage.scss";

/**
 * Страница "Захоронение участников и ветеранов СВО в Шуе"
 * Услуги по организации похорон военнослужащих с воинскими почестями
 */
const ZahoronenieUchastnikovSVOPage = () => {
  const [faqJsonLd, setFaqJsonLd] = useState(null);

  // SEO данные для страницы - мемоизированы для оптимизации
  const seoData = useMemo(
    () => ({
      ...ZAHORONENIE_UCHASTNIKOV_SVO_SEO_DATA,
      canonical: ZAHORONENIE_UCHASTNIKOV_SVO_SEO_DATA.ogUrl,
      jsonLd: [ZAHORONENIE_UCHASTNIKOV_SVO_JSON_LD, faqJsonLd].filter(Boolean),
    }),
    [faqJsonLd]
  );

  // Обработчик для обновления FAQ JSON-LD
  const handleFaqJsonLdUpdate = useCallback((jsonLd) => {
    setFaqJsonLd(jsonLd);
  }, []);

  return (
    <Global seo={seoData} pageClass="zahoronenie-uchastnikov-svo-page">
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

        {/* Что включает организация воинских похорон */}
        <section
          className="svo-services section"
          aria-labelledby="services-title"
        >
          <div className="container">
            <h2 id="services-title" className="svo-services__title">
              {SERVICES_CONTENT.title}
            </h2>

            <p className="svo-services__description">
              {SERVICES_CONTENT.description}
            </p>

            <Paragraph>
              <ul>
                {SERVICES_CONTENT.items.map((item, index) => (
                  <li key={index}>
                    <strong>{item.term}</strong> – {item.definition}
                  </li>
                ))}
              </ul>
            </Paragraph>
          </div>
        </section>

        {/* Государственные гарантии и компенсации */}
        <section
          className="svo-guarantees section bg-light"
          aria-labelledby="guarantees-title"
        >
          <div className="container">
            <h2 id="guarantees-title" className="svo-guarantees__title">
              {GUARANTEES_CONTENT.title}
            </h2>

            <p className="svo-guarantees__description">
              {GUARANTEES_CONTENT.description}
            </p>

            <div className="svo-guarantees__content">
              <h3 className="svo-guarantees__subtitle">
                {GUARANTEES_CONTENT.subtitle}
              </h3>

              <Paragraph>
                <ul>
                  {GUARANTEES_CONTENT.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </Paragraph>
            </div>

            <p className="svo-guarantees__note">{GUARANTEES_CONTENT.note}</p>
          </div>
        </section>

        {/* Порядок действий - временная шкала */}
        <ServiceTimeline
          title={TIMELINE_DATA.title}
          description={TIMELINE_DATA.description}
          steps={TIMELINE_DATA.steps}
        />

        {/* Наши преимущества */}
        <AdvantagesSection
          title={ADVANTAGES_DATA.title}
          description={ADVANTAGES_DATA.description}
          advantages={ADVANTAGES_DATA.advantages}
          columns={4}
          className="svo-advantages"
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
          buttonLink={`tel:${CTA_CONTENT.phone.replace(/[^\d+]/g, "")}`}
        />
      </main>
    </Global>
  );
};

export default ZahoronenieUchastnikovSVOPage;