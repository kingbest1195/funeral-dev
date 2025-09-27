import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import Global from "@/components/Global/Global.jsx";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs.jsx";
import ServiceHero from "@/components/ServiceHero/ServiceHero.jsx";
import ServiceCard from "@/components/ServiceCard/ServiceCard.jsx";
import DataTable from "@/components/DataTable/DataTable.jsx";
import ServiceTimeline from "@/components/ServiceTimeline/ServiceTimeline.jsx";
import FAQAccordion from "@/components/FAQAccordion/FAQAccordion.jsx";
import CTASection from "@/pages/HomePage/components/CTASection/CTASection.jsx";
import {
  ORGANIZATSIYA_POHORON_SEO_DATA,
  ORGANIZATSIYA_POHORON_JSON_LD,
  BREADCRUMBS_DATA,
  HERO_CONTENT,
  SERVICES_CONTENT,
  PACKAGES_DATA,
  TIMELINE_DATA,
  FAQ_DATA,
  CTA_CONTENT
} from "./content.js";
import "./OrganizatsiyaPohoronPage.scss";

/**
 * Страница "Организация похорон в Шуе"
 * Полная организация похорон под ключ с описанием услуг, пакетами, этапами и FAQ
 */
const OrganizatsiyaPohoronPage = () => {
  const [faqJsonLd, setFaqJsonLd] = useState(null);

  // SEO данные для страницы - мемоизированы для оптимизации
  const seoData = useMemo(() => ({
    ...ORGANIZATSIYA_POHORON_SEO_DATA,
    canonical: ORGANIZATSIYA_POHORON_SEO_DATA.ogUrl,
    jsonLd: [ORGANIZATSIYA_POHORON_JSON_LD, faqJsonLd].filter(Boolean)
  }), [faqJsonLd]);

  // Обработчик для обновления FAQ JSON-LD
  const handleFaqJsonLdUpdate = useCallback((jsonLd) => {
    setFaqJsonLd(jsonLd);
  }, []);

  return (
    <Global seo={seoData} pageClass="organizatsiya-pohoron-page">
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

        {/* Что входит в организацию похорон */}
        <section className="organizatsiya-services" aria-labelledby="services-title">
          <div className="container">
            <h2 id="services-title" className="organizatsiya-services__title">
              {SERVICES_CONTENT.title}
            </h2>

            <p className="organizatsiya-services__description">
              {SERVICES_CONTENT.description}
            </p>

            <div className="organizatsiya-services__grid">
              {SERVICES_CONTENT.services.map((service, index) => (
                <ServiceCard
                  key={service.id || index}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  showActions={false}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Стоимость организации похорон - таблица пакетов */}
        <section className="organizatsiya-packages" aria-labelledby="packages-title">
          <div className="container">
            <h2 id="packages-title" className="organizatsiya-packages__title">
              {PACKAGES_DATA.title}
            </h2>

            <p className="organizatsiya-packages__description">
              {PACKAGES_DATA.description}
            </p>

            <DataTable
              headers={PACKAGES_DATA.headers}
              rows={PACKAGES_DATA.rows}
              stripedMode="column"
              isColumnsEqual={true}
              enhancePrices={true}
              className="organizatsiya-packages__table"
            />

            <p className="organizatsiya-packages__note">
              {PACKAGES_DATA.note}
            </p>
          </div>
        </section>

        {/* Порядок действий - временная шкала */}
        <ServiceTimeline
          title={TIMELINE_DATA.title}
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

export default OrganizatsiyaPohoronPage;