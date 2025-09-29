import React from "react";
import { WHY_TRUST_DATA } from "@/constants/content";
import AdvantagesSection from "@/components/AdvantagesSection/AdvantagesSection";
import "./WhyTrustSection.scss";

/**
 * Секция "Почему доверяют" на главной странице
 * Отображает преимущества и причины доверия к компании
 */
const WhyTrustSection = () => {
  return (
    <AdvantagesSection
      id="benefits"
      title={WHY_TRUST_DATA.title}
      advantages={WHY_TRUST_DATA.items}
      columns={4}
      sectionClass="section bg-light"
      className="why-trust"
    />
  );
};

export default WhyTrustSection;