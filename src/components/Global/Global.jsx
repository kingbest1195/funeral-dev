import React from "react";
import { COMPANY_INFO, devLog } from "../../helpers/index.js";
import iconPhone from "../../assets/icons/icon-phone.svg";
import logoUrl from "../../assets/icons/logo-vek.svg";
// Favicons (импорт для корректной работы Vite с хешированными путями)
import favicon32 from "../../assets/favicons/favicon-32x32.png";
import favicon16 from "../../assets/favicons/favicon-16x16.png";
import appleTouchIcon from "../../assets/favicons/apple-touch-icon.png";
import siteManifestUrl from "../../assets/favicons/site.webmanifest";
import faviconIco from "../../assets/favicons/favicon.ico";
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
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isOpening, setIsOpening] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const headerRef = React.useRef(null);
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

    // Favicon / App icons
    const ensureLink = (rel, attrs = {}) => {
      let link = document.querySelector(
        `link[rel="${rel}"]${
          attrs.sizes
            ? `[sizes="${attrs.sizes}"]`
            : attrs.type
            ? `[type="${attrs.type}"]`
            : attrs.href
            ? `[href="${attrs.href}"]`
            : ""
        }`
      );
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
        document.head.appendChild(link);
      } else {
        Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
      }
    };

    // Добавляем стандартные фавиконки из src/assets/favicons
    ensureLink("icon", { type: "image/png", sizes: "32x32", href: favicon32 });
    ensureLink("icon", { type: "image/png", sizes: "16x16", href: favicon16 });
    ensureLink("apple-touch-icon", { sizes: "180x180", href: appleTouchIcon });
    ensureLink("manifest", { href: siteManifestUrl });
    ensureLink("icon", { href: faviconIco });

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

  // Блокировка скролла и закрытие на Escape / ресайз
  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("no-scroll");
      // Компенсация ширины скроллбара, чтобы не дергался макет
      const scrollbar =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollbar > 0) {
        document.body.style.paddingRight = `${scrollbar}px`;
      }
    } else {
      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";
    }

    const handleKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    const handleResize = () => {
      if (window.innerWidth > 1024) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleResize);
    const handleClickOutside = (e) => {
      if (!isMenuOpen) return;
      const headerEl = headerRef.current;
      if (headerEl && !headerEl.contains(e.target)) {
        // клик вне зоны хедера/меню — закрываем быстро
        setIsClosing(true);
        setIsMenuOpen(false);
        setTimeout(() => setIsClosing(false), 250);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [isMenuOpen]);

  // Блокируем скролл на время закрывающей анимации
  React.useEffect(() => {
    if (isClosing) {
      document.body.classList.add("no-scroll");
    } else if (!isMenuOpen) {
      document.body.classList.remove("no-scroll");
    }
  }, [isClosing, isMenuOpen]);

  return (
    <div
      className={`global ${pageClass}${isMenuOpen ? " global--menu-open" : ""}`}
    >
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
        ref={headerRef}
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
              <a
                href={`tel:${COMPANY_INFO.phone.replace(/\D/g, "")}`}
                className="phone-number phone-number--hero"
                onClick={handlePhoneClick}
                aria-label={`Позвонить по номеру ${COMPANY_INFO.phone}`}
              >
                {COMPANY_INFO.phone}
              </a>
              <span className="global__schedule global__schedule--inline">
                ({COMPANY_INFO.phoneSchedule})
              </span>
              <button
                className="global__call-circle"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.location.href = `tel:${COMPANY_INFO.phone.replace(
                      /\D/g,
                      ""
                    )}`;
                  }
                }}
                aria-label="Позвонить сейчас"
                type="button"
              >
                <img
                  src={iconPhone}
                  alt=""
                  width="22"
                  height="22"
                  aria-hidden="true"
                />
              </button>
              <button
                className={`global__menu-burger${isMenuOpen ? " is-open" : ""}${
                  isOpening ? " is-opening" : ""
                }${isClosing ? " is-closing" : ""}`}
                aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
                type="button"
                onClick={() => {
                  if (isMenuOpen) {
                    // Старт закрывающей анимации: убираем открытую метку сразу
                    setIsClosing(true);
                    setIsMenuOpen(false);
                    const scrollbar =
                      window.innerWidth - document.documentElement.clientWidth;
                    if (scrollbar > 0) {
                      document.body.style.paddingRight = `${scrollbar}px`;
                    }
                    window.setTimeout(() => {
                      setIsClosing(false);
                      document.body.style.paddingRight = "";
                    }, 250);
                  } else {
                    setIsOpening(true);
                    setIsMenuOpen(true);
                    window.setTimeout(() => setIsOpening(false), 500);
                  }
                }}
              >
                <svg
                  className="global__burger-icon"
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  {/* Линии для эффекта перетекания */}
                  <g className="morph-lines" aria-hidden="true">
                    <line
                      className="morph-line morph-line--top"
                      x1="4"
                      y1="6"
                      x2="20"
                      y2="6"
                    />
                    <line
                      className="morph-line morph-line--middle"
                      x1="4"
                      y1="12"
                      x2="20"
                      y2="12"
                    />
                    <line
                      className="morph-line morph-line--bottom"
                      x1="4"
                      y1="18"
                      x2="20"
                      y2="18"
                    />
                  </g>
                  <path
                    className={`icon-burger${isMenuOpen ? " is-hidden" : ""}`}
                    fill="#ffffff"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
                  />
                  <path
                    className={`icon-close${isMenuOpen ? "" : " is-hidden"}`}
                    fill="#ffffff"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289Z"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Мобильное меню */}
          <div
            id="mobile-menu"
            className={`global__mobile-menu${
              isMenuOpen ? " global__mobile-menu--open" : ""
            }${isClosing ? " global__mobile-menu--closing" : ""}`}
            role="navigation"
            aria-label="Мобильная навигация"
          >
            <nav className="global__mobile-nav">
              <ul className="global__mobile-nav-list">
                <li>
                  <a href="#services" onClick={() => setIsMenuOpen(false)}>
                    Услуги
                  </a>
                </li>
                <li>
                  <a href="#benefits" onClick={() => setIsMenuOpen(false)}>
                    Почему мы
                  </a>
                </li>
                <li>
                  <a href="#stats" onClick={() => setIsMenuOpen(false)}>
                    О компании
                  </a>
                </li>
                <li>
                  <a href="#contacts" onClick={() => setIsMenuOpen(false)}>
                    Контакты
                  </a>
                </li>
              </ul>
            </nav>
            <div className="global__mobile-contacts">
              <p className="office-item__route">
                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\D/g, "")}`}
                  className="btn btn--secondary btn--sm"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={`Позвонить по номеру ${COMPANY_INFO.phone}`}
                >
                  Позвонить
                </a>
              </p>
              <span className="global__mobile-schedule">
                {COMPANY_INFO.phoneSchedule}
              </span>
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
      <span className="global__mobile-call-icon" aria-hidden="true">
        <img src={iconPhone} alt="" width="24" height="24" />
      </span>
      <span className="global__mobile-call-text">Позвонить</span>
    </a>
  );
};

export default Global;
