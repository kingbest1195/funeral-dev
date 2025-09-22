import React from "react";
import Global from "@/components/Global/Global.jsx";
import ServicesSection from "@/pages/HomePage/components/ServicesSection/ServicesSection.jsx";
import CTASection from "@/pages/HomePage/components/CTASection/CTASection.jsx";
import "./UslugiPage.scss";

/**
 * Страница услуг ритуальной службы "Век"
 * Включает: описание услуг, прощальные залы, ритуальный магазин
 */
const UslugiPage = () => {
  // SEO данные для страницы услуг
  const seoData = {
    title: "Ритуальные услуги в Шуе: организация похорон и кремация – Служба \"Век\"",
    description: "Полный комплекс ритуальных услуг от службы \"Век\" в Шуе. Организация похорон, кремация, ритуальные залы для прощания, транспорт, магазин товаров. Деликатная помощь и поддержка 24/7. Звоните.",
    keywords: "ритуальные услуги Шуя, организация похорон Шуя, кремация Шуя, прощальные залы, ритуальный магазин, памятники Шуя",
    canonical: typeof window !== "undefined" ? window.location.href : "",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Ритуальные услуги",
      description: "Полный комплекс ритуальных услуг от службы \"Век\" в Шуе. Организация похорон, кремация, ритуальные залы для прощания, транспорт, магазин товаров.",
      mainEntity: {
        "@type": "Service",
        serviceType: "Ритуальные услуги",
        provider: {
          "@type": "FuneralHome",
          name: "Ритуальная служба Век"
        },
        areaServed: {
          "@type": "City",
          name: "Шуя"
        }
      }
    }
  };

  return (
    <Global seo={seoData} pageClass="uslugi-page">
      <main>
        {/* Заголовок страницы */}
        <section className="uslugi-hero section">
          <div className="container">
            <h1 className="uslugi-hero__title">
              Полный комплекс ритуальных услуг в Шуе
            </h1>
            <p className="uslugi-hero__description">
              Мы понимаем, насколько тяжела ваша утрата. Ритуальная служба "Век" готова взять на себя все заботы по организации достойного прощания, предоставив полный спектр услуг — от оформления документов до проведения поминальной трапезы. Наши специалисты деликатно помогут вам на каждом этапе.
            </p>
            <div className="uslugi-hero__cta">
              <a
                href="tel:+79203663636"
                className="btn btn--primary"
                aria-label="Позвонить в ритуальную службу Век"
              >
                Круглосуточная консультация: +7 (920) 366-36-36
              </a>
            </div>
          </div>
        </section>

        {/* Основные услуги - используем существующий компонент */}
        <ServicesSection />

        {/* Прощальные залы */}
        <section className="funeral-halls section">
          <div className="container">
            <h2 className="funeral-halls__title">
              Прощальные залы для церемоний
            </h2>
            <p className="funeral-halls__description">
              Для проведения церемонии прощания мы предлагаем два специально оборудованных зала. Вне зависимости от количества приглашенных, вы сможете в спокойной и достойной обстановке проститься с близким человеком, не ограничиваясь по времени.
            </p>

            <div className="funeral-halls__grid">
              {/* Большой зал */}
              <div className="hall-card">
                <h3 className="hall-card__title">
                  Большой зал (до 60 человек)
                </h3>
                <p className="hall-card__description">
                  Просторный и торжественный зал площадью 200 кв. м, предназначенный для проведения масштабных церемоний прощания. Зал оснащен постаментом для гроба, достаточным количеством сидячих мест и системой кондиционирования, что позволяет с комфортом разместить до 60 гостей.
                </p>
                <div className="hall-card__image">
                  <picture>
                    <source
                      srcSet="/src/assets/images-optimized/funeral-hall/funeral-hall-big.webp"
                      type="image/webp"
                    />
                    <img
                      src="/src/assets/images-optimized/funeral-hall/funeral-hall-big.jpg"
                      alt="Большой прощальный зал ритуальной службы Век в Шуе"
                      loading="lazy"
                      width="600"
                      height="400"
                    />
                  </picture>
                </div>
              </div>

              {/* Малый зал */}
              <div className="hall-card">
                <h3 className="hall-card__title">
                  Малый зал (до 30 человек)
                </h3>
                <p className="hall-card__description">
                  Уютный и более камерный зал площадью 80 кв. м. Он идеально подходит для прощания в кругу самых близких людей и рассчитан на комфортное размещение до 30 гостей. Спокойная атмосфера зала позволяет провести церемонию в уединенной обстановке.
                </p>
                <div className="hall-card__image">
                  <picture>
                    <source
                      srcSet="/src/assets/images-optimized/funeral-hall/funeral-hall-small.webp"
                      type="image/webp"
                    />
                    <img
                      src="/src/assets/images-optimized/funeral-hall/funeral-hall-small.jpg"
                      alt="Малый зал для прощания в ритуальной службе Век"
                      loading="lazy"
                      width="600"
                      height="400"
                    />
                  </picture>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ритуальный магазин */}
        <section className="ritual-shop section bg-light">
          <div className="container">
            <h2 className="ritual-shop__title">
              Ритуальный магазин: все необходимое в одном месте
            </h2>
            <div className="ritual-shop__content">
              <div className="ritual-shop__text">
                <p>
                  При нашей службе работает магазин, где представлен широкий ассортимент ритуальных принадлежностей. Это избавляет вас от необходимости посещать несколько мест в тяжелое время. Наш агент поможет подобрать все необходимое в соответствии с вашими пожеланиями и бюджетом.
                </p>

                <h3 className="ritual-shop__subtitle">В наличии всегда имеются:</h3>
                <ul className="ritual-shop__list">
                  <li>
                    <div className="quiz-option__icon">
                      <img
                        src="/src/assets/images-optimized/quiz-icons/coffin-standard.webp"
                        alt="Иконка гроба"
                        loading="lazy"
                      />
                    </div>
                    Гробы (от бюджетных моделей до элитных, обитых тканью и лакированных)
                  </li>
                  <li>
                    <div className="quiz-option__icon">
                      <img
                        src="/src/assets/images-optimized/quiz-icons/wreath-flowers.webp"
                        alt="Иконка венков"
                        loading="lazy"
                      />
                    </div>
                    Венки, корзины и цветочные композиции из искусственных и живых цветов
                  </li>
                  <li>
                    <div className="quiz-option__icon">
                      <img
                        src="/src/assets/images-optimized/quiz-icons/cross-wooden.webp"
                        alt="Иконка креста"
                        loading="lazy"
                      />
                    </div>
                    Кресты на могилу из дерева и металла
                  </li>
                  <li>
                    <div className="quiz-option__icon">
                      <img
                        src="/src/assets/images-optimized/quiz-icons/clothes-formal.webp"
                        alt="Иконка одежды"
                        loading="lazy"
                      />
                    </div>
                    Одежда, обувь и текстиль для усопших
                  </li>
                  <li>
                    <div className="quiz-option__icon">
                      <img
                        src="/src/assets/images-optimized/ritual-icons/church-items.webp"
                        alt="Иконка церковных принадлежностей"
                        loading="lazy"
                      />
                    </div>
                    Церковные принадлежности (свечи, лампады, иконы)
                  </li>
                  <li>
                    <div className="quiz-option__icon">
                      <img
                        src="/src/assets/images-optimized/quiz-icons/ribbon-mourning.webp"
                        alt="Иконка траурной ленты"
                        loading="lazy"
                      />
                    </div>
                    Траурные ленты с индивидуальной надписью
                  </li>
                </ul>
              </div>

              <div className="ritual-shop__image">
                <picture>
                  <source
                    srcSet="/src/assets/images-optimized/transport-and-office/funeral-market.webp"
                    type="image/webp"
                  />
                  <img
                    src="/src/assets/images-optimized/transport-and-office/funeral-market.jpg"
                    alt="Ритуальный магазин службы Век в Шуе"
                    loading="lazy"
                    width="600"
                    height="400"
                  />
                </picture>
              </div>
            </div>
          </div>
        </section>

        {/* Призыв к действию - используем существующий компонент */}
        <CTASection />
      </main>
    </Global>
  );
};

export default UslugiPage;