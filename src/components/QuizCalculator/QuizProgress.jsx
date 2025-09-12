import React from "react";

/**
 * Компонент для отображения прогресса квиза
 * @param {number} currentStep - Текущий шаг
 * @param {number} totalSteps - Общее количество шагов
 */
const QuizProgress = ({ currentStep, totalSteps }) => {
  // Рассчитываем процент прогресса
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);
  
  return (
    <div className="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax={totalSteps} aria-valuenow={currentStep}>
      <div className="quiz-progress__info">
        <span className="quiz-progress__text">
          Шаг {Math.min(currentStep, totalSteps)} из {totalSteps}
        </span>
        <span className="quiz-progress__percentage">
          {Math.round(progressPercentage)}%
        </span>
      </div>
      
      <div className="quiz-progress__bar">
        <div 
          className="quiz-progress__fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default QuizProgress;