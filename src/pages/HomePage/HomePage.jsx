import React from "react";
import Global from "@/components/Global/Global.jsx";
import InfoSection from "@/components/InfoSection/InfoSection.jsx";
import CallBlock from "@/components/CallBlock/CallBlock.jsx";
import BenefitBlock from "@/components/BenefitBlock/BenefitBlock.jsx";
import "./HomePage.scss";
// Импорт изображений для корректной работы в Vite preview/build
import hearseWebp from "@/assets/images/transport-and-office/hearse-modern.webp";
import hearseJpg from "@/assets/images/transport-and-office/hearse-modern.jpg";
import busWebp from "@/assets/images/transport-and-office/bus-comfort.webp";
import busJpg from "@/assets/images/transport-and-office/bus-comfort.jpg";
import officeWebp from "@/assets/images/transport-and-office/office-facade.webp";
import officeJpg from "@/assets/images/transport-and-office/office-facade.jpg";
// Иконки (высокое качество, прозрачный фон)
import phoneIcon from "@/assets/icons/phone-linear-gold.png";
import benefitIcon from "@/assets/icons/benefit-coin-leaf-gold.png";
// Swiper для отзывов
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/**
 * Главная страница сайта ритуальной службы "Век"
 */
const HomePage = () => {
  // SEO данные для главной страницы
  const seoData = {
    title: "Ритуальная служба Век - Помощь в трудную минуту | Шуя",
    description:
      "Ритуальная служба Век в Шуе. Круглосуточная помощь в организации похорон, кремация, памятники. Профессиональные агенты. Звоните +7 (920) 366-36-36",
    keywords:
      "ритуальные услуги Шуя, похоронное бюро Шуя, организация похорон, кремация Шуя, памятники Шуя, ритуальный агент Шуя, груз 200",
    canonical: typeof window !== "undefined" ? window.location.href : "",
    type: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Главная страница - Ритуальная служба Век",
      description:
        "Ритуальная служба Век - профессиональная помощь в организации похорон в Шуе",
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Что делать, если умер близкий человек?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Вызовите скорую помощь и полицию для констатации смерти. Получите медицинское свидетельство о смерти. Позвоните нам по номеру +7 (920) 366-36-36 - наш агент приедет и поможет с оформлением всех документов.",
            },
          },
        ],
      },
    },
    image: hearseJpg,
  };

  return (
    <Global seo={seoData} pageClass="home-page">
      <main>
        {/* Hero секция */}
        <section className="hero section">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__content">
              <h1 className="hero__title">
                Помощь в трудную минуту. Круглосуточная ритуальная служба в Шуе.
              </h1>
              <p className="hero__subtitle">
                Бесплатно проконсультируем, что делать дальше. Агент приедет в
                течение часа в любую точку города и района.
              </p>
              <div className="hero__cta">
                <a
                  href="tel:+79203663636"
                  className="btn btn--primary btn--lg"
                  aria-label="Вызвать ритуального агента круглосуточно"
                >
                  Вызвать ритуального агента 24/7
                </a>
              </div>
            </div>
            <div className="hero__media" aria-hidden="true">
              <picture>
                <source srcSet={officeWebp} type="image/webp" />
                <img
                  src={officeJpg}
                  alt="Офис ритуальной службы Век в Шуе по адресу Красноармейский переулок, 6"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>
          </div>
        </div>
      </section>

      {/* Первые шаги - переиспользуемый компонент с оригинальной версткой */}
      <InfoSection
        className="first-steps"
        title="Что делать, если умер близкий человек?"
        heading="Мы возьмем все заботы на себя"
        text="Понимаем, как тяжело в такой момент собраться с мыслями. Позвоните нам, и наш специалист немедленно приедет, поможет с оформлением всех документов и полностью возьмет на себя организацию похорон. Вам не придется делать это в одиночку."
        rightContent={
          <CallBlock
            phone="+7 (920) 366-36-36"
            note="Круглосуточно"
            icon={phoneIcon}
            ariaLabel="Связаться по телефону"
            parentClass="first-steps"
          />
        }
      />

      {/* Услуги */}
      <section id="services" className="services section">
        <div className="container">
          <h2 className="services__title">Наши услуги</h2>
          <p className="services__subtitle">
            Берем на себя все заботы по организации и проведению похорон.
          </p>

          <div className="services__grid">
            <div className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 7h16M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7M9 11h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">Организация похорон</h3>
              <p className="service-card__description">
                Полностью организуем прощание: от сбора документов и подготовки
                тела до поминального обеда.
              </p>
              <div className="service-card__actions">
                <a href="#" aria-label="Подробнее: Организация похорон">
                  Подробнее
                </a>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 12h16M7 7l-3 5 3 5M17 7l3 5-3 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">
                Захоронение участников СВО
              </h3>
              <p className="service-card__description">
                Оказываем содействие в организации воинских похорон, помогаем с
                оформлением льгот и почестей.
              </p>
              <div className="service-card__actions">
                <a href="#" aria-label="Подробнее: Захоронение участников СВО">
                  Подробнее
                </a>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 20h16M6 16l6-10 6 10H6z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">
                Благоустройство захоронений
              </h3>
              <p className="service-card__description">
                Устанавливаем памятники и ограды, укладываем плитку. Приводим
                место захоронения в ухоженный вид.
              </p>
              <div className="service-card__actions">
                <a href="#" aria-label="Подробнее: Благоустройство захоронений">
                  Подробнее
                </a>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M4 6h10l6 6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M14 6v6h6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">
                Каталог ритуальных товаров
              </h3>
              <p className="service-card__description">
                Предлагаем гробы, венки, кресты и другие принадлежности
                собственного производства и от проверенных поставщиков.
              </p>
              <div className="service-card__actions">
                <a href="#" aria-label="Подробнее: Каталог ритуальных товаров">
                  Подробнее
                </a>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3 16h18M5 12l2-7h10l2 7M8 16v3m8-3v3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">Груз 200</h3>
              <p className="service-card__description">
                Организуем транспортировку тела усопшего в любой город России и
                страны СНГ.
              </p>
              <div className="service-card__actions">
                <a href="#" aria-label="Подробнее: Груз 200">
                  Подробнее
                </a>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card__icon" aria-hidden="true">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M12 3v18M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="service-card__title">Кремация</h3>
              <p className="service-card__description">
                Помогаем с организацией кремации в г. Иваново, предоставляем
                урны для праха.
              </p>
              <div className="service-card__actions">
                <a href="#" aria-label="Подробнее: Кремация">
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Пособие на погребение - переиспользуемый компонент с оригинальной версткой */}
      <InfoSection
        className="burial-benefit"
        title="Вычитаем пособие на погребение из стоимости услуг"
        text="Государство предоставляет пособие на погребение. Мы поможем вам с оформлением необходимых документов и сразу вычтем эту сумму из итогового счета, чтобы уменьшить ваши расходы."
        rightContent={
          <BenefitBlock
            amount="9165 ₽"
            label="Пособие на погребение"
            icon={benefitIcon}
            ariaLabel="Размер пособия на погребение"
            parentClass="burial-benefit"
          />
        }
      />

      <hr className="divider" aria-hidden="true" />

      {/* Почему нам доверяют */}
      <section id="benefits" className="why-trust section bg-light">
        <div className="container">
          <h2 className="why-trust__title">Почему доверяют службе "Век"</h2>

          <div className="advantages__grid">
            <div className="advantage-card">
              <h3 className="advantage-card__title">
                Работаем круглосуточно, без выходных
              </h3>
              <p className="advantage-card__description">
                Наш телефон доступен 24/7. Агент готов выехать к вам в любое
                время дня и ночи.
              </p>
            </div>

            <div className="advantage-card">
              <h3 className="advantage-card__title">
                Собственное производство
              </h3>
              <p className="advantage-card__description">
                Изготавливаем памятники и ограды без посредников. Это позволяет
                нам контролировать качество и предлагать честные цены.
              </p>
            </div>

            <div className="advantage-card">
              <h3 className="advantage-card__title">
                Учитываем религиозные традиции
              </h3>
              <p className="advantage-card__description">
                Организуем похороны с соблюдением мусульманских и других
                религиозных обрядов.
              </p>
            </div>

            <div className="advantage-card">
              <h3 className="advantage-card__title">Опыт и деликатность</h3>
              <p className="advantage-card__description">
                Наши сотрудники — тактичные и опытные специалисты. Они знают,
                как помочь, не задавая лишних вопросов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* О компании в цифрах */}
      <section id="stats" className="company-stats section">
        <div className="container">
          <div className="company-stats__grid">
            <div className="company-stats__intro">
              <h2 className="company-stats__title">Служба "Век" в цифрах</h2>
              <p className="company-stats__subtitle">
                Помогаем жителям Шуи в трудную минуту. Работаем без перерывов и
                выходных.
              </p>
            </div>
            <div className="company-stats__numbers">
              <div className="stats__grid">
                <div className="stat-item">
                  <div className="stats-number">12+</div>
                  <p className="stat-item__description">лет на рынке</p>
                </div>
                <div className="stat-item">
                  <div className="stats-number">24/7</div>
                  <p className="stat-item__description">
                    работаем без выходных
                  </p>
                </div>
                <div className="stat-item">
                  <div className="stats-number">5</div>
                  <p className="stat-item__description">единиц автопарка</p>
                </div>
                <div className="stat-item">
                  <div className="stats-number">3</div>
                  <p className="stat-item__description">офиса в городе</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Калькулятор стоимости */}
      <section className="calculator section bg-light">
        <div className="container">
          <div className="card">
            <div className="card__body">
              <h2 className="calculator__title">
                Рассчитайте предварительную стоимость похорон
              </h2>
              <p className="calculator__description">
                Чтобы вы могли спланировать бюджет, мы подготовили калькулятор.
                Он поможет узнать ориентировочную стоимость услуг.
              </p>
              <p className="calculator__cta-text">
                Ответьте на несколько вопросов, и наш специалист свяжется с
                вами, чтобы бесплатно проконсультировать и озвучить точный
                расчет.
              </p>
              <div className="calculator__button">
                <button className="btn btn--primary btn--lg">
                  Перейти к расчету
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="reviews section">
        <div className="container">
          <h2 className="reviews__title">Что о нас говорят</h2>
          <Swiper
            className="reviews__slider"
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            a11y={{
              prevSlideMessage: "Предыдущие отзывы",
              nextSlideMessage: "Следующие отзывы",
            }}
          >
            <SwiperSlide>
              <article className="review-card" aria-label="Отзыв клиента">
                <header className="review-card__header">
                  <div className="review-card__author">Анна П.</div>
                  <div
                    className="review-card__rating"
                    aria-label="Оценка 5 из 5"
                  >
                    ★★★★★
                  </div>
                  <div
                    className="review-card__verified"
                    aria-label="Проверенный отзыв"
                  >
                    ✔
                  </div>
                </header>
                <p className="review-card__text">
                  Большое спасибо сотрудникам службы «Век» за профессионализм и
                  деликатность. Помогли во всем, сделали всё достойно.
                </p>
                <footer className="review-card__footer">
                  <a href="#" aria-label="Источник: Яндекс.Бизнес">
                    Источник: Яндекс.Бизнес
                  </a>
                </footer>
              </article>
            </SwiperSlide>
            <SwiperSlide>
              <article className="review-card" aria-label="Отзыв клиента">
                <header className="review-card__header">
                  <div className="review-card__author">Игорь С.</div>
                  <div
                    className="review-card__rating"
                    aria-label="Оценка 5 из 5"
                  >
                    ★★★★★
                  </div>
                  <div
                    className="review-card__verified"
                    aria-label="Проверенный отзыв"
                  >
                    ✔
                  </div>
                </header>
                <p className="review-card__text">
                  Всё организовали быстро и аккуратно. Отдельная благодарность
                  агенту за внимательность к деталям.
                </p>
                <footer className="review-card__footer">
                  <a href="#" aria-label="Источник: Яндекс.Бизнес">
                    Источник: Яндекс.Бизнес
                  </a>
                </footer>
              </article>
            </SwiperSlide>
            <SwiperSlide>
              <article className="review-card" aria-label="Отзыв клиента">
                <header className="review-card__header">
                  <div className="review-card__author">Марина К.</div>
                  <div
                    className="review-card__rating"
                    aria-label="Оценка 5 из 5"
                  >
                    ★★★★★
                  </div>
                  <div
                    className="review-card__verified"
                    aria-label="Проверенный отзыв"
                  >
                    ✔
                  </div>
                </header>
                <p className="review-card__text">
                  Приятные и тактичные люди. Подсказали все шаги, помогли с
                  документами.
                </p>
                <footer className="review-card__footer">
                  <a href="#" aria-label="Источник: Яндекс.Бизнес">
                    Источник: Яндекс.Бизнес
                  </a>
                </footer>
              </article>
            </SwiperSlide>
          </Swiper>
        </div>
      </section>

      {/* Наш транспорт и офис */}
      <section className="transport-office section bg-light">
        <div className="container">
          <h2 className="transport-office__title">Наш транспорт и офис</h2>
          <p className="transport-office__description">
            Мы используем только собственный специализированный транспорт и
            всегда готовы принять вас в нашем офисе. Все по-настоящему.
          </p>

          <div className="transport-gallery">
            <div className="transport-item">
              <div className="transport-item__image">
                <picture>
                  <source srcSet={hearseWebp} type="image/webp" />
                  <img
                    src={hearseJpg}
                    alt="Катафалк ритуальной службы Век в Шуе для достойных проводов"
                    loading="lazy"
                    width="800"
                    height="533"
                  />
                </picture>
              </div>
              <p className="transport-item__caption">
                Специализированный транспорт для достойных проводов.
              </p>
            </div>

            <div className="transport-item">
              <div className="transport-item__image">
                <picture>
                  <source srcSet={busWebp} type="image/webp" />
                  <img
                    src={busJpg}
                    alt="Автобус ритуальной службы Век для перевозки родственников на похороны в Шуе"
                    loading="lazy"
                    width="800"
                    height="533"
                  />
                </picture>
              </div>
              <p className="transport-item__caption">
                Комфортабельные автобусы для перевозки родных и близких к месту
                прощания и поминального обеда.
              </p>
            </div>

            <div className="transport-item">
              <div className="transport-item__image">
                <picture>
                  <source srcSet={officeWebp} type="image/webp" />
                  <img
                    src={officeJpg}
                    alt="Фасад офиса ритуальной службы Век в Шуе на Красноармейском переулке, 6"
                    loading="lazy"
                    width="800"
                    height="533"
                  />
                </picture>
              </div>
              <p className="transport-item__caption">
                Наш офис по адресу Ул. Красноармейский переулок, 6. Здесь вы
                можете получить консультацию и оформить документы в спокойной
                обстановке.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Контакты и карта */}
      <section id="contacts" className="contacts-map section">
        <div className="container">
          <h2 className="contacts-map__title">Свяжитесь с нами</h2>
          <p className="contacts-map__description">
            Мы находимся на связи круглосуточно и готовы ответить на все ваши
            вопросы.
          </p>

          <div className="contacts-content">
            <div className="contacts-info">
              <div className="contact-phone">
                <h3 className="contact-phone__title">Телефон</h3>
                <a
                  href="tel:+79203663636"
                  className="phone-number phone-number--large"
                >
                  +7 (920) 366-36-36
                </a>
              </div>

              <div className="offices-list">
                <h3 className="offices-list__title">Адреса офисов</h3>
                <div className="office-item">
                  <h4 className="office-item__address">
                    г. Шуя, Ул. Красноармейский переулок, 6
                  </h4>
                  <p className="office-item__note">(2 минуты от ЦРБ)</p>
                  <p className="office-item__schedule">
                    График работы: Пн-Вс, с 8:00 до 17:00
                  </p>
                  <p className="office-item__route d-desktop-none">
                    <a
                      className="btn btn--secondary btn--sm"
                      href="https://yandex.uz/maps/-/CCUrZ-xwOC"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Построить маршрут: Красноармейский пер., 6"
                    >
                      Маршрут
                    </a>
                  </p>
                </div>

                <div className="office-item">
                  <h4 className="office-item__address">
                    г. Шуя, Ул. Фабричная, 27
                  </h4>
                  <p className="office-item__note">(ритуальный зал)</p>
                  <p className="office-item__schedule">
                    График работы: Пн-Вс, с 8:00 до 17:00
                  </p>
                  <p className="office-item__route d-desktop-none">
                    <a
                      className="btn btn--secondary btn--sm"
                      href="https://yandex.ru/maps/-/CBBL5DQy~C"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Построить маршрут: Фабричная, 27"
                    >
                      Маршрут
                    </a>
                  </p>
                </div>

                <div className="office-item">
                  <h4 className="office-item__address">
                    г. Шуя, Ул. Генерала Белова, 33
                  </h4>
                  <p className="office-item__schedule">
                    График работы: Пн-Вс, с 8:00 до 17:00
                  </p>
                  <p className="office-item__route d-desktop-none">
                    <a
                      className="btn btn--secondary btn--sm"
                      href="https://yandex.ru/maps/-/CLUSVS6V"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Построить маршрут: Генерала Белова, 33"
                    >
                      Маршрут
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="map-container">
              {/* Место для Яндекс.Карты */}
              <div className="map-placeholder">
                <p>
                  Здесь будет интерактивная Яндекс.Карта с отмеченными офисами
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className="cta-section section bg-dark">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-content__title">
              Нужна помощь? Мы рядом в любое время
            </h2>
            <p className="cta-content__description">
              Наши специалисты готовы приехать к вам и взять на себя все
              организационные вопросы. Звоните прямо сейчас.
            </p>
            <div className="cta-content__actions">
              <a href="tel:+79203663636" className="btn btn--accent btn--lg">
                +7 (920) 366-36-36
              </a>
            </div>
          </div>
        </div>
      </section>
      </main>
    </Global>
  );
};

export default HomePage;
