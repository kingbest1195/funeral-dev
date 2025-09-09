import React from "react";
import { COMPANY_INFO, devLog } from "../../helpers/index.js";
import logoUrl from "../../../docs/logo-vek.png";
import "./Global.scss";

/**
 * Глобальная обертка для всех страниц проекта
 * Содержит общие элементы: хедер, футер, SEO мета-теги, структурированные данные
 * @param {Object} props - Пропсы компонента
 * @param {React.ReactNode} props.children - Дочерние элементы (контент страницы)
 * @param {Object} props.seo - SEO данные для страницы
 * @param {string} props.pageClass - Дополнительный класс для страницы
 */
const Global = ({ children, seo = {}, pageClass = "" }) => {
  const [isHeaderScrolled, setIsHeaderScrolled] = React.useState(false);
  const {
    title = "Ритуальная служба Век - Помощь в трудную минуту | Шуя",
    description = "Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремация, памятники. Звоните +7 (920) 366-36-36",
    keywords = "ритуальные услуги Шуя, похоронное бюро Шуя, организация похорон, кремация, памятники, ритуальная служба",
    canonical = "",
    type = "website",
    image = "",
    jsonLd = null,
  } = seo;

  // Структурированные данные для LocalBusiness
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "FuneralHome",
    name: COMPANY_INFO.name,
    telephone: COMPANY_INFO.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: COMPANY_INFO.city,
      addressRegion: COMPANY_INFO.region,
      addressCountry: "RU",
    },
    openingHours: COMPANY_INFO.workSchedule,
    url: typeof window !== "undefined" ? window.location.origin : "",
    image: image || "",
    description: description,
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Шуя",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Ритуальные услуги",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Организация похорон",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Кремация",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Product",
            name: "Памятники и ограды",
          },
        },
      ],
    },
  };

  // Объединяем структурированные данные (поддержка массива)
  const structuredData = Array.isArray(jsonLd)
    ? [localBusinessJsonLd, ...jsonLd]
    : jsonLd
    ? [localBusinessJsonLd, jsonLd]
    : [localBusinessJsonLd];

  React.useEffect(() => {
    // Обновляем мета-теги при изменении SEO данных
    document.title = title;

    // Обновляем или создаем мета-теги
    const updateMetaTag = (name, content, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let tag = document.querySelector(selector);

      if (!tag) {
        tag = document.createElement("meta");
        if (property) {
          tag.setAttribute("property", name);
        } else {
          tag.setAttribute("name", name);
        }
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // Основные мета-теги
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    // Open Graph
    updateMetaTag("og:title", title, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:locale", "ru_RU", true);

    if (image) {
      updateMetaTag("og:image", image, true);
    }

    // Twitter Card
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);

    if (image) {
      updateMetaTag("twitter:image", image);
    }

    // Canonical URL
    if (canonical) {
      let canonicalTag = document.querySelector('link[rel="canonical"]');
      if (!canonicalTag) {
        canonicalTag = document.createElement("link");
        canonicalTag.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalTag);
      }
      canonicalTag.setAttribute("href", canonical);
    }

    // JSON-LD структурированные данные
    let jsonLdScript = document.querySelector(
      'script[type="application/ld+json"]'
    );
    if (jsonLdScript) {
      document.head.removeChild(jsonLdScript);
    }

    jsonLdScript = document.createElement("script");
    jsonLdScript.type = "application/ld+json";
    jsonLdScript.textContent = JSON.stringify(structuredData);
    document.head.appendChild(jsonLdScript);
  }, [title, description, keywords, canonical, type, image, jsonLd]);

  // Обработка клика по телефону для аналитики
  const handlePhoneClick = () => {
    // Здесь можно добавить отправку события в аналитику
    if (typeof gtag !== "undefined") {
      gtag("event", "phone_call", {
        event_category: "contact",
        event_label: COMPANY_INFO.phone,
      });
    }
  };

  React.useEffect(() => {
    const onScroll = () => {
      setIsHeaderScrolled(window.scrollY > 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`global ${pageClass}`}>
      {/* Skip to main content для accessibility */}
      <a
        href="#main-content"
        className="global__skip-link visually-hidden-focusable"
      >
        Перейти к основному содержанию
      </a>

      {/* Header */}
      <header
        className={`global__header${
          isHeaderScrolled ? " global__header--scrolled" : ""
        }`}
        role="banner"
      >
        <div className="container">
          <div className="global__header-content">
            {/* Логотип */}
            <div className="global__logo">
              <a
                href="/"
                className="global__logo-link"
                aria-label={COMPANY_INFO.name}
              >
                <img
                  src={logoUrl}
                  className="global__logo-img"
                  alt={`${COMPANY_INFO.name} — логотип`}
                  decoding="async"
                  fetchpriority="high"
                />
                <span className="sr-only">{COMPANY_INFO.name}</span>
              </a>
              <p className="global__tagline" aria-label="Локация">
                {COMPANY_INFO.city}, {COMPANY_INFO.region}
              </p>
            </div>

            {/* Навигация + контакты */}
            <nav className="global__nav" aria-label="Основная навигация">
              <ul className="global__nav-list">
                <li>
                  <a href="#services">Услуги</a>
                </li>
                <li>
                  <a href="#benefits">Почему мы</a>
                </li>
                <li>
                  <a href="#stats">О компании</a>
                </li>
                <li>
                  <a href="#contacts">Контакты</a>
                </li>
              </ul>
            </nav>
            <div className="global__contacts">
              <div className="global__phone-block">
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\D/g, "")}`}
                  className="phone-number phone-number--hero"
                  onClick={handlePhoneClick}
                  aria-label={`Позвонить по номеру ${COMPANY_INFO.phone}`}
                >
                  {COMPANY_INFO.phone}
                </a>
                <p className="global__schedule">
                  ({COMPANY_INFO.phoneSchedule})
                </p>
              </div>
              <button
                className="btn btn--secondary btn--sm global__callback-btn"
                onClick={() => {
                  devLog("Открыть форму обратного звонка");
                }}
                aria-label="Заказать обратный звонок"
              >
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main id="main-content" className="global__main" role="main">
        {children}
      </main>

      {/* Footer будет здесь */}
      <footer className="global__footer" role="contentinfo">
        <div className="container">
          <div className="global__footer-content">
            {/* Основная информация */}
            <div className="global__footer-info">
              <h2 className="company-name">{COMPANY_INFO.name}</h2>
              <p className="global__footer-description">
                Помощь в трудную минуту. Организация достойного прощания с
                вашими близкими.
              </p>
            </div>

            {/* Контакты в футере */}
            <div className="global__footer-contacts">
              <h3 className="global__footer-title">Контакты</h3>
              <p>
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\D/g, "")}`}
                  className="phone-number"
                  onClick={handlePhoneClick}
                >
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p className="global__footer-schedule">
                Телефон: {COMPANY_INFO.phoneSchedule}
              </p>
              <p className="global__footer-schedule">
                Офис: {COMPANY_INFO.workSchedule}
              </p>
            </div>

            {/* Офисы */}
            <div className="global__footer-offices">
              <h3 className="global__footer-title">Наши офисы</h3>
              {COMPANY_INFO.offices.map((office) => (
                <div key={office.id} className="global__footer-office">
                  <p className="global__footer-address">
                    {office.address}
                    {office.description && (
                      <span className="global__footer-office-note">
                        {" "}
                        ({office.description})
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="global__footer-bottom">
            <div className="global__legal">
              <p>
                {COMPANY_INFO.legalName || COMPANY_INFO.name}
                {COMPANY_INFO.inn ? ` · ИНН: ${COMPANY_INFO.inn}` : ""}
                {COMPANY_INFO.ogrn ? ` · ОГРН: ${COMPANY_INFO.ogrn}` : ""}
                {COMPANY_INFO.privacyUrl ? (
                  <>
                    {" · "}
                    <a href={COMPANY_INFO.privacyUrl}>
                      Политика конфиденциальности
                    </a>
                  </>
                ) : null}
              </p>
            </div>
            <div className="global__copyright">
              <p>
                © {new Date().getFullYear()} {COMPANY_INFO.name}. Все права
                защищены.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Кнопка "Наверх" */}
      <BackToTopButton />

      {/* Виджет быстрого звонка для мобильных */}
      <MobileCallButton />
    </div>
  );
};

// Компонент кнопки "Наверх"
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <button
      className="global__back-to-top"
      onClick={scrollToTop}
      aria-label="Вернуться наверх"
      type="button"
    >
      ↑
    </button>
  );
};

// Компонент мобильной кнопки звонка
const MobileCallButton = () => {
  const handleClick = () => {
    if (typeof gtag !== "undefined") {
      gtag("event", "mobile_call_button", {
        event_category: "contact",
        event_label: COMPANY_INFO.phone,
      });
    }
  };

  return (
    <a
      href={`tel:${COMPANY_INFO.phone.replace(/\D/g, "")}`}
      className="global__mobile-call-button d-desktop-none"
      onClick={handleClick}
      aria-label={`Позвонить ${COMPANY_INFO.phone}`}
    >
      <span className="global__mobile-call-icon">📞</span>
      <span className="global__mobile-call-text">Позвонить</span>
    </a>
  );
};

export default Global;
