import React, { useState, Suspense } from "react";
import Global from "@/components/Global/Global.jsx";
import InfoSection from "@/components/InfoSection/InfoSection.jsx";
import CallBlock from "@/components/CallBlock/CallBlock.jsx";
import BenefitBlock from "@/components/BenefitBlock/BenefitBlock.jsx";
// Динамический импорт тяжелых компонентов для Code Splitting
const QuizCalculator = React.lazy(() => import("@/components/QuizCalculator/QuizCalculator.jsx"));
const ReviewsWidget = React.lazy(() => import("@/components/ReviewsWidget/ReviewsWidget.jsx"));

// Динамический импорт тяжелых компонентов для Code Splitting
const WhyTrustSection = React.lazy(() => import("./components/WhyTrustSection/WhyTrustSection.jsx"));
const StatsSection = React.lazy(() => import("./components/StatsSection/StatsSection.jsx"));
const TransportOfficeSection = React.lazy(() => import("./components/TransportOfficeSection/TransportOfficeSection.jsx"));
const CTASection = React.lazy(() => import("./components/CTASection/CTASection.jsx"));

// Критичные секции загружаются синхронно
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ServicesSection from "./components/ServicesSection/ServicesSection.jsx";
import CalculatorSection from "./components/CalculatorSection/CalculatorSection.jsx";
import ContactsMapSection from "./components/ContactsMapSection/ContactsMapSection.jsx";

// Импорт констант и стилей
import { HOME_SEO_DATA } from "@/constants/content";
import "./HomePage.scss";

// Импорт оптимизированных изображений для InfoSection и BenefitBlock
import phoneIconWebp from "@/assets/icons-optimized/phone-linear-gold.webp";
import phoneIconPng from "@/assets/icons-optimized/phone-linear-gold.png";
import benefitIconWebp from "@/assets/icons-optimized/benefit-coin-leaf-gold.webp";
import benefitIconPng from "@/assets/icons-optimized/benefit-coin-leaf-gold.png";

/**
 * Главная страница сайта ритуальной службы "Век"
 * Рефакторенная версия с разделением на компоненты
 */
const HomePage = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const openQuiz = () => setIsQuizOpen(true);
  const closeQuiz = () => setIsQuizOpen(false);

  // SEO данные из констант
  const seoData = {
    ...HOME_SEO_DATA,
    canonical: typeof window !== "undefined" ? window.location.href : "",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Главная страница - Ритуальная служба Век",
        description: HOME_SEO_DATA.description,
        url: typeof window !== "undefined" ? window.location.href : "https://xn----7sbhmlqd1btk.xn--p1ai/",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Сколько стоят ритуальные услуги в Шуе?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Стоимость ритуальных услуг зависит от выбранного пакета. Базовые услуги начинаются от 25 000 рублей. Точную стоимость можно рассчитать с помощью нашего калькулятора или уточнить по телефону +7 (920) 366-36-36.",
            },
          },
        ],
      },
    ],
  };

  return (
    <Global seo={seoData} pageClass="home-page">
      <main>
        {/* Hero секция */}
        <HeroSection />

        {/* Первые шаги */}
        <InfoSection
          className="first-steps"
          title="Что делать, если умер близкий человек?"
          heading="Мы возьмем все заботы на себя"
          text="Понимаем, как тяжело в такой момент собраться с мыслями. Позвоните нам, и наш специалист немедленно приедет, поможет с оформлением всех документов и полностью возьмет на себя организацию похорон. Вам не придется делать это в одиночку."
          rightContent={
            <CallBlock
              phone="+7 (920) 366-36-36"
              note="Круглосуточно"
              icon={{ webp: phoneIconWebp, png: phoneIconPng }}
              ariaLabel="Связаться по телефону"
              parentClass="first-steps"
            />
          }
        />

        {/* Услуги */}
        <ServicesSection />

        {/* Пособие на погребение */}
        <InfoSection
          className="burial-benefit"
          title="Вычитаем пособие на погребение из стоимости услуг"
          text="Государство предоставляет пособие на погребение. Мы поможем вам с оформлением необходимых документов и сразу вычтем эту сумму из итогового счета, чтобы уменьшить ваши расходы."
          rightContent={
            <BenefitBlock
              amount="9165 ₽"
              label="Пособие на погребение"
              icon={{ webp: benefitIconWebp, png: benefitIconPng }}
              ariaLabel="Размер пособия на погребение"
              parentClass="burial-benefit"
            />
          }
        />

        <hr className="divider" aria-hidden="true" />

        {/* Почему доверяют - ленивая загрузка */}
        <Suspense fallback={<div className="section-loading" style={{minHeight: '400px'}}></div>}>
          <WhyTrustSection />
        </Suspense>

        {/* Статистика компании - ленивая загрузка */}
        <Suspense fallback={<div className="section-loading" style={{minHeight: '300px'}}></div>}>
          <StatsSection />
        </Suspense>

        {/* Калькулятор стоимости */}
        <CalculatorSection openQuiz={openQuiz} />

        {/* Отзывы */}
        <Suspense fallback={<div className="reviews-loading" style={{minHeight: '400px'}}>Загружаем отзывы...</div>}>
          <ReviewsWidget />
        </Suspense>

        {/* Транспорт и офис - ленивая загрузка */}
        <Suspense fallback={<div className="section-loading" style={{minHeight: '500px'}}></div>}>
          <TransportOfficeSection />
        </Suspense>

        {/* Контакты и карта */}
        <ContactsMapSection />

        {/* Призыв к действию - ленивая загрузка */}
        <Suspense fallback={<div className="section-loading" style={{minHeight: '200px'}}></div>}>
          <CTASection />
        </Suspense>

        {/* Квиз-калькулятор */}
        {isQuizOpen && (
          <Suspense fallback={<div className="quiz-loading">Загружаем калькулятор...</div>}>
            <QuizCalculator isOpen={isQuizOpen} onClose={closeQuiz} />
          </Suspense>
        )}
      </main>
    </Global>
  );
};

export default HomePage;
