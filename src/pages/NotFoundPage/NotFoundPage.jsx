import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { COMPANY_INFO } from "@/helpers/index.js";
import { SITE_CONFIG, getFullUrl, getOgImageUrl } from "@/constants/content.js";
import Global from "@/components/Global/Global.jsx";
import "./NotFoundPage.scss";

const NotFoundPage = () => {
  const seoData = {
    title: `Страница не найдена | ${SITE_CONFIG.SITE_NAME}`,
    description:
      `Запрашиваемая страница не найдена. Свяжитесь с ${SITE_CONFIG.SITE_NAME}${SITE_CONFIG.COMMON_TEXTS.LOCATION} по телефону${SITE_CONFIG.COMMON_TEXTS.DESCRIPTION_SUFFIX} или вернитесь на главную страницу.`,
    keywords:
      `страница не найдена, 404, ${SITE_CONFIG.SITE_NAME}, Шуя, контакты`,
    type: "webpage",
    canonical: getFullUrl("/404"),
    // Open Graph и Twitter Card мета-теги
    ogTitle: `Страница не найдена${SITE_CONFIG.COMMON_TEXTS.SITE_TITLE_SUFFIX}`,
    ogDescription: `Запрашиваемая страница не найдена. Свяжитесь с службой Век${SITE_CONFIG.COMMON_TEXTS.LOCATION}:${SITE_CONFIG.COMMON_TEXTS.DESCRIPTION_SUFFIX} или вернитесь на главную.`,
    ogImage: getOgImageUrl(SITE_CONFIG.OG_IMAGES.DEFAULT),
    ogUrl: typeof window !== "undefined" ? window.location.href : "",
    ogType: "website",
    ogSiteName: SITE_CONFIG.SITE_NAME,
    twitterCard: "summary_large_image",
    twitterTitle: `Страница не найдена${SITE_CONFIG.COMMON_TEXTS.SITE_TITLE_SUFFIX}`,
    twitterDescription: `Запрашиваемая страница не найдена. Свяжитесь с службой Век${SITE_CONFIG.COMMON_TEXTS.LOCATION}:${SITE_CONFIG.COMMON_TEXTS.DESCRIPTION_SUFFIX}`,
    twitterImage: getOgImageUrl(SITE_CONFIG.OG_IMAGES.DEFAULT),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Страница не найдена",
      description: "Запрашиваемая страница не найдена",
      url: typeof window !== "undefined" ? window.location.href : "",
      publisher: {
        "@type": "Organization",
        name: SITE_CONFIG.SITE_NAME,
        telephone: COMPANY_INFO.phone,
      },
      inLanguage: "ru-RU",
    },
  };

  const handlePhoneClick = () => {
    // Аналитика для отслеживания звонков с 404 страницы
    if (typeof gtag !== "undefined") {
      gtag("event", "phone_call_404", {
        event_category: "contact",
        event_label: COMPANY_INFO.phone,
        page_title: "404 - Страница не найдена",
      });
    }
  };

  return (
    <Global seo={seoData} pageClass="not-found-page">
      <Helmet>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="not-found-page__content">
        <div className="container">
          <article className="not-found-page__card">
            {/* Код ошибки */}
            <div className="not-found-page__error-code" aria-label="Код ошибки 404">
              404
            </div>

            {/* Заголовок */}
            <header className="not-found-page__header">
              <h1 className="not-found-page__title">
                Страница не найдена
              </h1>
              <p className="not-found-page__subtitle">
                К сожалению, запрашиваемая страница не существует или была перемещена.
              </p>
            </header>

            {/* Контент */}
            <section className="not-found-page__message">
              <p>
                Возможно, вы перешли по устаревшей ссылке или допустили опечатку в адресе.
                Мы всегда готовы помочь вам найти нужную информацию.
              </p>
            </section>

            {/* Действия */}
            <section className="not-found-page__actions">
              <div className="not-found-page__buttons">
                <Link
                  to="/"
                  className="btn btn--primary btn--lg not-found-page__home-btn"
                  aria-label="Вернуться на главную страницу ритуальной службы Век"
                >
                  <span className="not-found-page__btn-icon" aria-hidden="true">🏠</span>
                  На главную
                </Link>

                <a
                  href={`tel:${COMPANY_INFO.phone.replace(/\D/g, "")}`}
                  className="btn btn--secondary btn--lg not-found-page__phone-btn"
                  onClick={handlePhoneClick}
                  aria-label={`Позвонить в ритуальную службу по номеру ${COMPANY_INFO.phone}`}
                >
                  <span className="not-found-page__btn-icon" aria-hidden="true">📞</span>
                  {COMPANY_INFO.phone}
                </a>
              </div>

              <p className="not-found-page__phone-note">
                Наш телефон работает <strong>{COMPANY_INFO.phoneSchedule.toLowerCase()}</strong>
              </p>
            </section>

            {/* Дополнительная помощь */}
            <section className="not-found-page__help">
              <h2 className="not-found-page__help-title">Как мы можем помочь</h2>
              <div className="not-found-page__help-content">
                <div className="not-found-page__help-item">
                  <h3>🕒 Круглосуточная поддержка</h3>
                  <p>
                    Наши специалисты готовы ответить на любые вопросы
                    и оказать помощь в трудную минуту.
                  </p>
                </div>

                <div className="not-found-page__help-item">
                  <h3>🚗 Выезд агента</h3>
                  <p>
                    Мы можем приехать к вам для консультации
                    и решения всех организационных вопросов.
                  </p>
                </div>

                <div className="not-found-page__help-item">
                  <h3>💬 Бесплатная консультация</h3>
                  <p>
                    Позвоните нам, и мы подробно расскажем
                    о наших услугах и ценах.
                  </p>
                </div>
              </div>
            </section>

            {/* Контактная информация */}
            <footer className="not-found-page__contact">
              <div className="not-found-page__contact-info">
                <h3 className="not-found-page__contact-title">
                  {COMPANY_INFO.name}
                </h3>
                <p className="not-found-page__contact-tagline">
                  Помощь в трудную минуту в {COMPANY_INFO.city}
                </p>
                <address className="not-found-page__address">
                  {COMPANY_INFO.offices[0].address}
                  <br />
                  <span className="not-found-page__schedule">
                    Офис: {COMPANY_INFO.workSchedule}
                  </span>
                </address>
              </div>
            </footer>
          </article>
        </div>
      </div>
    </Global>
  );
};

export default NotFoundPage;