import React, { useState } from "react";
import Global from "@/components/Global/Global.jsx";
import InfoSection from "@/components/InfoSection/InfoSection.jsx";
import CallBlock from "@/components/CallBlock/CallBlock.jsx";
import BenefitBlock from "@/components/BenefitBlock/BenefitBlock.jsx";
import QuizCalculator from "@/components/QuizCalculator/QuizCalculator.jsx";
import ReviewsWidget from "@/components/ReviewsWidget/ReviewsWidget.jsx";

// Импорт новых компонентов секций
import HeroSection from "./components/HeroSection/HeroSection.jsx";
import ServicesSection from "./components/ServicesSection/ServicesSection.jsx";
import WhyTrustSection from "./components/WhyTrustSection/WhyTrustSection.jsx";
import StatsSection from "./components/StatsSection/StatsSection.jsx";
import CalculatorSection from "./components/CalculatorSection/CalculatorSection.jsx";
import TransportOfficeSection from "./components/TransportOfficeSection/TransportOfficeSection.jsx";
import ContactsMapSection from "./components/ContactsMapSection/ContactsMapSection.jsx";
import CTASection from "./components/CTASection/CTASection.jsx";

// Импорт констант и стилей
import { HOME_SEO_DATA } from "@/constants/content";
import "./HomePage.scss";

// Импорт оптимизированных изображений для InfoSection и BenefitBlock
import phoneIcon from "@/assets/icons-optimized/phone-linear-gold.webp";
import benefitIcon from "@/assets/icons-optimized/benefit-coin-leaf-gold.webp";

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
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Главная страница - Ритуальная служба Век",
      description: HOME_SEO_DATA.description,
      mainEntity: {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Сколько стоят ритуальные услуги в Шуе?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Стоимость ритуальных услуг зависит от выбранного пакета. Базовые услуги начинаются от 25 000 рублей. Точную стоимость можно рассчитать с помощью нашего калькулятора или уточнить по телефону +7 (920) 366-36-36."
            }
          }
        ]
      }
    }
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
              icon={phoneIcon}
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
              icon={benefitIcon}
              ariaLabel="Размер пособия на погребение"
              parentClass="burial-benefit"
            />
          }
        />

        <hr className="divider" aria-hidden="true" />

        {/* Почему доверяют */}
        <WhyTrustSection />

        {/* Статистика компании */}
        <StatsSection />

        {/* Калькулятор стоимости */}
        <CalculatorSection openQuiz={openQuiz} />

        {/* Отзывы */}
        <ReviewsWidget />

        {/* Транспорт и офис */}
        <TransportOfficeSection />

        {/* Контакты и карта */}
        <ContactsMapSection />

        {/* Призыв к действию */}
        <CTASection />

        {/* Квиз-калькулятор */}
        <QuizCalculator isOpen={isQuizOpen} onClose={closeQuiz} />
      </main>
    </Global>
  );
};

export default HomePage;