import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import Global from "@/components/Global/Global.jsx";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs.jsx";
import ServiceHero from "@/components/ServiceHero/ServiceHero.jsx";
import Paragraph from "@/components/Paragraph/Paragraph.jsx";
import DataTable from "@/components/DataTable/DataTable.jsx";
import ServiceTimeline from "@/components/ServiceTimeline/ServiceTimeline.jsx";
import FAQAccordion from "@/components/FAQAccordion/FAQAccordion.jsx";
import CTASection from "@/pages/HomePage/components/CTASection/CTASection.jsx";
import {
  BLAGOUSTROYSTVO_MOGIL_SEO_DATA,
  BLAGOUSTROYSTVO_MOGIL_JSON_LD,
  BREADCRUMBS_DATA,
  HERO_CONTENT,
  SERVICES_CONTENT,
  EXAMPLES_DATA,
  TIMELINE_DATA,
  FAQ_DATA,
  CTA_CONTENT
} from "./content.js";
import "./BlagoustroystvomMogilPage.scss";

/**
 * Страница "Благоустройство могил и мест захоронения в Шуе"
 * Услуги по благоустройству, примеры работ, этапы работ и FAQ
 */
const BlagoustroystvomMogilPage = () => {
  const [faqJsonLd, setFaqJsonLd] = useState(null);

  // SEO данные для страницы - мемоизированы для оптимизации
  const seoData = useMemo(() => ({
    ...BLAGOUSTROYSTVO_MOGIL_SEO_DATA,
    canonical: BLAGOUSTROYSTVO_MOGIL_SEO_DATA.ogUrl,
    jsonLd: [BLAGOUSTROYSTVO_MOGIL_JSON_LD, faqJsonLd].filter(Boolean)
  }), [faqJsonLd]);

  // Обработчик для обновления FAQ JSON-LD
  const handleFaqJsonLdUpdate = useCallback((jsonLd) => {
    setFaqJsonLd(jsonLd);
  }, []);

  // Создание элемента изображения для таблицы примеров
  const createImageElement = useCallback((images, alt, title) => (
    <div className="data-table__image-container">
      <picture>
        <source srcSet={images.webp} type="image/webp" />
        <img
          src={images.png}
          alt={alt}
          className="data-table__cell-image"
          loading="lazy"
          width="400"
          height="300"
        />
      </picture>
      <span className="data-table__image-caption">
        {title}
      </span>
    </div>
  ), []);

  // Создание строк таблицы примеров работ
  const examplesRows = useMemo(() => {
    return EXAMPLES_DATA.examples.map((example) => {
      const imageElement = createImageElement(
        example.images,
        example.alt,
        example.title
      );
      return [imageElement, example.description];
    });
  }, [createImageElement]);

  return (
    <Global seo={seoData} pageClass="blagoustroystvo-mogil-page">
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

        {/* Услуги по благоустройству */}
        <section className="blagoustservices" aria-labelledby="services-title">
          <div className="container">
            <h2 id="services-title" className="blagoustservices__title">
              {SERVICES_CONTENT.title}
            </h2>

            <p className="blagoustservices__description">
              {SERVICES_CONTENT.description}
            </p>

            <Paragraph>
              <ul>
                {SERVICES_CONTENT.services.map((service, index) => (
                  <li key={index}>
                    <strong>{service.title}</strong> – {service.description}
                  </li>
                ))}
              </ul>
            </Paragraph>
          </div>
        </section>

        {/* Примеры работ - таблица с изображениями */}
        <section className="blagoustexamples" aria-labelledby="examples-title">
          <div className="container">
            <h2 id="examples-title" className="blagoustexamples__title">
              {EXAMPLES_DATA.title}
            </h2>

            <p className="blagoustexamples__description">
              {EXAMPLES_DATA.description}
            </p>

            <DataTable
              headers={EXAMPLES_DATA.headers}
              rows={examplesRows}
              stripedMode="row"
              isColumnsEqual={false}
              enhancePrices={false}
              className="blagoustexamples__table"
            />

            <p className="blagoustexamples__note">
              {EXAMPLES_DATA.note}
            </p>
          </div>
        </section>

        {/* Этапы работ - временная шкала */}
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

export default BlagoustroystvomMogilPage;