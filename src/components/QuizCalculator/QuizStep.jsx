import React from "react";

/**
 * Компонент для отображения одного шага квиза
 * @param {string} title - Заголовок вопроса
 * @param {number} stepNumber - Номер текущего шага
 * @param {React.ReactNode} children - Содержимое шага (варианты ответов или форма)
 */
const QuizStep = ({ title, stepNumber, children }) => {
  return (
    <section className="quiz-step" aria-labelledby={`quiz-step-${stepNumber}`}>
      <header className="quiz-step__header">
        <h3 id={`quiz-step-${stepNumber}`} className="quiz-step__title">
          {title}
        </h3>
      </header>
      
      <div className="quiz-step__content">
        {children}
      </div>
    </section>
  );
};

export default QuizStep;