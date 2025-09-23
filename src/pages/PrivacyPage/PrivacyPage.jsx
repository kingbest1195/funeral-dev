import React from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import Global from "@/components/Global/Global.jsx";
import PrivacyHeroSection from "./components/PrivacyHeroSection/PrivacyHeroSection.jsx";
import PrivacyContentSection from "./components/PrivacyContentSection/PrivacyContentSection.jsx";
import { PRIVACY_SEO_DATA, PRIVACY_JSON_LD } from "./content.js";
import { getFullUrl } from "@/constants/content.js";
import "./PrivacyPage.scss";

/**
 * Страница политики конфиденциальности ритуальной службы "Век"
 * Включает: hero секцию, основные разделы документа и контактную информацию
 */
const PrivacyPage = () => {
  // SEO данные для страницы политики конфиденциальности из content.js
  const seoData = {
    ...PRIVACY_SEO_DATA,
    canonical: typeof window !== "undefined" ? window.location.href : getFullUrl("/privacy"),
    jsonLd: PRIVACY_JSON_LD
  };

  return (
    <Global seo={seoData} pageClass="privacy-page">
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main>
        {/* Hero секция страницы политики конфиденциальности */}
        <PrivacyHeroSection />

        {/* Основной контент документа */}
        <PrivacyContentSection />
      </main>
    </Global>
  );
};

export default PrivacyPage;