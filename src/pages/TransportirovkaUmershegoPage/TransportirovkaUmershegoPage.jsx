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
  TRANSPORTIROVKA_UMERSHEGO_SEO_DATA,
  TRANSPORTIROVKA_UMERSHEGO_JSON_LD,
  BREADCRUMBS_DATA,
  HERO_CONTENT,
  SERVICES_CONTENT,
  AUTOPARK_DATA,
  TIMELINE_DATA,
  FAQ_DATA,
  CTA_CONTENT
} from "./content.js";
import "./TransportirovkaUmershegoPage.scss";

/**
 * Страница "Перевозка умерших в Шуе и по России"
 * Услуги ритуального транспорта, катафалк, Груз 200 с описанием автопарка и FAQ
 */
const TransportirovkaUmershegoPage = () => {
  const [faqJsonLd, setFaqJsonLd] = useState(null);

  // SEO данные для страницы - мемоизированы для оптимизации
  const seoData = useMemo(() => ({
    ...TRANSPORTIROVKA_UMERSHEGO_SEO_DATA,
    canonical: TRANSPORTIROVKA_UMERSHEGO_SEO_DATA.ogUrl,
    jsonLd: [TRANSPORTIROVKA_UMERSHEGO_JSON_LD, faqJsonLd].filter(Boolean)
  }), [faqJsonLd]);

  // Обработчик для обновления FAQ JSON-LD
  const handleFaqJsonLdUpdate = useCallback((jsonLd) => {
    setFaqJsonLd(jsonLd);
  }, []);

  // Создание элемента изображения для таблицы
  const createImageElement = useCallback((images, alt, caption) => (
    <div className="data-table__image-container">
      <picture>
        <source srcSet={images.webp} type="image/webp" />
        <img
          src={images.png}
          alt={alt}
          className="data-table__cell-image"
        />
      </picture>
      <span className="data-table__image-caption">
        {caption}
      </span>
    </div>
  ), []);

  // Создание строк таблицы с изображениями
  const autoparkRows = useMemo(() => {
    const { rows, images } = AUTOPARK_DATA;
    return rows.map((row, index) => {
      // Добавляем изображения для первых двух строк
      if (index === 0 && images.hearseModern) {
        const imageElement = createImageElement(
          images.hearseModern,
          'Катафалк "Газель Next"',
          'Катафалк "Газель Next"'
        );
        return [imageElement, row[1], row[2]];
      }

      if (index === 1 && images.hearsePremium) {
        const imageElement = createImageElement(
          images.hearsePremium,
          'Катафалк "Mercedes-Benz"',
          'Катафалк "Mercedes-Benz"'
        );
        return [imageElement, row[1], row[2]];
      }

      return row;
    });
  }, [createImageElement]);

  return (
    <Global seo={seoData} pageClass="transportirovka-umershego-page">
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

        {/* Виды транспортных услуг */}
        <section className="transportirovka-services" aria-labelledby="services-title">
          <div className="container">
            <h2 id="services-title" className="transportirovka-services__title">
              {SERVICES_CONTENT.title}
            </h2>

            <p className="transportirovka-services__description">
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

        {/* Автопарк и стоимость - таблица */}
        <section className="transportirovka-autopark" aria-labelledby="autopark-title">
          <div className="container">
            <h2 id="autopark-title" className="transportirovka-autopark__title">
              {AUTOPARK_DATA.title}
            </h2>

            <p className="transportirovka-autopark__description">
              {AUTOPARK_DATA.description}
            </p>

            <DataTable
              headers={AUTOPARK_DATA.headers}
              rows={autoparkRows}
              stripedMode="row"
              isColumnsEqual={false}
              enhancePrices={false}
              className="transportirovka-autopark__table"
            />

            <p className="transportirovka-autopark__note">
              {AUTOPARK_DATA.note}
            </p>
          </div>
        </section>

        {/* Как заказать транспорт - временная шкала */}
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

export default TransportirovkaUmershegoPage;