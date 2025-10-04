import React from "react";
import { CALCULATOR_DATA } from "@/constants/content";
import { trackGoal, YANDEX_GOALS } from "@/utils/yandexGoals";
import "./CalculatorSection.scss";

/**
 * Секция калькулятора стоимости на главной странице
 */
const CalculatorSection = ({ openQuiz }) => {
  const handleOpenQuiz = () => {
    // Отправляем цель в Яндекс.Метрику
    trackGoal(YANDEX_GOALS.CALCULATOR_OPEN.id);
    // Открываем калькулятор
    openQuiz();
  };

  return (
    <section className="calculator section bg-light">
      <div className="container">
        <div className="card">
          <div className="card__body">
            <h2 className="calculator__title">{CALCULATOR_DATA.title}</h2>
            <p className="calculator__description">{CALCULATOR_DATA.description}</p>
            <p className="calculator__cta-text">{CALCULATOR_DATA.ctaText}</p>
            <div className="calculator__button">
              <button
                onClick={handleOpenQuiz}
                className="btn btn--primary btn--lg"
                aria-label={CALCULATOR_DATA.ariaLabel}
              >
                {CALCULATOR_DATA.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorSection;