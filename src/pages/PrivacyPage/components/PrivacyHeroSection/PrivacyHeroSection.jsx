// =================
// HERO СЕКЦИЯ СТРАНИЦЫ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ
// =================

import React from 'react';
import { PRIVACY_HERO_CONTENT } from '../../content';
import PrivacyCallout from '../PrivacyCallout/PrivacyCallout';
import './PrivacyHeroSection.scss';

/**
 * Hero секция страницы политики конфиденциальности
 * Отображает заголовок, дату обновления и вводный текст
 */
const PrivacyHeroSection = () => {
  const { title, lastUpdateDate, intro } = PRIVACY_HERO_CONTENT;

  return (
    <section className="privacy-hero">
      <div className="container">
        <header className="privacy-hero__header">
          <h1 className="privacy-hero__title">
            {title}
          </h1>
          <p className="privacy-hero__date">
            <strong>Дата последнего обновления: {lastUpdateDate}</strong>
          </p>
        </header>

        <PrivacyCallout>
          <p>
            {intro.paragraph1} <code>{intro.domainCode}</code> (далее – Сайт).
          </p>
          <p>
            {intro.paragraph2}
          </p>
        </PrivacyCallout>
      </div>
    </section>
  );
};

export default PrivacyHeroSection;