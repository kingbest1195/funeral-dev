import React from "react";

// Импорт оптимизированных иконок (PNG + WebP)
import coffinTraditional from "@/assets/images/quiz-icons/coffin-traditional-optimized.png";
import coffinTraditionalWebP from "@/assets/images/quiz-icons/coffin-traditional.webp";
import urnCeramic from "@/assets/images/quiz-icons/urn-ceramic-optimized.png";
import urnCeramicWebP from "@/assets/images/quiz-icons/urn-ceramic.webp";
import coffinEconomy from "@/assets/images/quiz-icons/coffin-economy-optimized.png";
import coffinEconomyWebP from "@/assets/images/quiz-icons/coffin-economy.webp";
import coffinStandard from "@/assets/images/quiz-icons/coffin-standard-optimized.png";
import coffinStandardWebP from "@/assets/images/quiz-icons/coffin-standard.webp";
import coffinPremium from "@/assets/images/quiz-icons/coffin-premium-optimized.png";
import coffinPremiumWebP from "@/assets/images/quiz-icons/coffin-premium.webp";
import urnEconomy from "@/assets/images/quiz-icons/urn-economy-optimized.png";
import urnEconomyWebP from "@/assets/images/quiz-icons/urn-economy.webp";
import urnStandard from "@/assets/images/quiz-icons/urn-standard-optimized.png";
import urnStandardWebP from "@/assets/images/quiz-icons/urn-standard.webp";
import urnPremium from "@/assets/images/quiz-icons/urn-premium-optimized.png";
import urnPremiumWebP from "@/assets/images/quiz-icons/urn-premium.webp";
import wreathFlowers from "@/assets/images/quiz-icons/wreath-flowers-optimized.png";
import wreathFlowersWebP from "@/assets/images/quiz-icons/wreath-flowers.webp";
import crossWooden from "@/assets/images/quiz-icons/cross-wooden-optimized.png";
import crossWoodenWebP from "@/assets/images/quiz-icons/cross-wooden.webp";
import ribbonMourning from "@/assets/images/quiz-icons/ribbon-mourning-optimized.png";
import ribbonMourningWebP from "@/assets/images/quiz-icons/ribbon-mourning.webp";
import clothesFormal from "@/assets/images/quiz-icons/clothes-formal-optimized.png";
import clothesFormalWebP from "@/assets/images/quiz-icons/clothes-formal.webp";
import busTransport from "@/assets/images/quiz-icons/bus-transport-optimized.png";
import busTransportWebP from "@/assets/images/quiz-icons/bus-transport.webp";
import noBus from "@/assets/images/quiz-icons/no-bus-optimized.png";
import noBusWebP from "@/assets/images/quiz-icons/no-bus.webp";

/**
 * Маппинг названий иконок к оптимизированным изображениям
 * Включает как PNG (fallback), так и WebP (современные браузеры) версии
 */
const iconMap = {
  "coffin": { png: coffinTraditional, webp: coffinTraditionalWebP },
  "urn": { png: urnCeramic, webp: urnCeramicWebP },
  "coffin-simple": { png: coffinEconomy, webp: coffinEconomyWebP },
  "coffin-wooden": { png: coffinStandard, webp: coffinStandardWebP },
  "coffin-premium": { png: coffinPremium, webp: coffinPremiumWebP },
  "urn-simple": { png: urnEconomy, webp: urnEconomyWebP },
  "urn-wooden": { png: urnStandard, webp: urnStandardWebP },
  "urn-premium": { png: urnPremium, webp: urnPremiumWebP },
  "wreath": { png: wreathFlowers, webp: wreathFlowersWebP },
  "cross": { png: crossWooden, webp: crossWoodenWebP },
  "ribbon": { png: ribbonMourning, webp: ribbonMourningWebP },
  "clothes": { png: clothesFormal, webp: clothesFormalWebP },
  "bus": { png: busTransport, webp: busTransportWebP },
  "no-bus": { png: noBus, webp: noBusWebP }
};

/**
 * Компонент для варианта ответа в квизе
 * @param {string} label - Текст варианта ответа
 * @param {string} value - Значение варианта
 * @param {string} icon - Название иконки
 * @param {string} type - Тип выбора: "single" или "multiple"
 * @param {boolean} isSelected - Выбран ли вариант
 * @param {function} onClick - Обработчик клика
 */
const QuizOption = ({ 
  label, 
  value, 
  icon, 
  type = "single", 
  isSelected = false, 
  onClick 
}) => {
  const handleClick = () => {
    onClick(value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      className={`quiz-option ${isSelected ? "quiz-option--selected" : ""} quiz-option--${type}`}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role={type === "multiple" ? "checkbox" : "radio"}
      aria-checked={isSelected}
      aria-label={label}
    >
      <div className="quiz-option__content">
        <div className="quiz-option__icon">
          {iconMap[icon] && (
            <picture>
              <source srcSet={iconMap[icon].webp} type="image/webp" />
              <img 
                src={iconMap[icon].png} 
                alt={`Иконка для ${label}`}
                loading="lazy"
                width="64"
                height="64"
              />
            </picture>
          )}
        </div>
        
        <span className="quiz-option__label">{label}</span>
        
        {type === "multiple" && (
          <div className="quiz-option__checkbox">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleClick}
              tabIndex={-1}
              aria-hidden="true"
            />
            <span className="quiz-option__checkmark"></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizOption;