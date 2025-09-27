import React from "react";
import Global from "@/components/Global/Global.jsx";
import ServiceHero from "@/components/ServiceHero/ServiceHero.jsx";
import ServicesSection from "@/pages/HomePage/components/ServicesSection/ServicesSection.jsx";
import CTASection from "@/pages/HomePage/components/CTASection/CTASection.jsx";
import FuneralHallsSection from "./components/FuneralHallsSection/FuneralHallsSection.jsx";
import RitualShopSection from "./components/RitualShopSection/RitualShopSection.jsx";
import { USLUGI_SEO_DATA, USLUGI_JSON_LD, USLUGI_HERO_CONTENT } from "./content.js";
import "./UslugiPage.scss";

/**
 * Страница услуг ритуальной службы "Век"
 * Включает: описание услуг, прощальные залы, ритуальный магазин
 */
const UslugiPage = () => {
  // SEO данные для страницы услуг из content.js
  const seoData = {
    ...USLUGI_SEO_DATA,
    canonical: typeof window !== "undefined" ? window.location.href : "",
    jsonLd: USLUGI_JSON_LD
  };

  return (
    <Global seo={seoData} pageClass="uslugi-page">
      <main>
        {/* Hero секция страницы услуг - используем глобальный компонент */}
        <ServiceHero
          title={USLUGI_HERO_CONTENT.title}
          description={USLUGI_HERO_CONTENT.description}
          cta={USLUGI_HERO_CONTENT.cta}
          hasOwnMarginTop={true}
        />

        {/* Основные услуги - используем существующий компонент */}
        <ServicesSection />

        {/* Прощальные залы */}
        <FuneralHallsSection />

        {/* Ритуальный магазин */}
        <RitualShopSection />

        {/* Призыв к действию - используем существующий компонент */}
        <CTASection />
      </main>
    </Global>
  );
};

export default UslugiPage;