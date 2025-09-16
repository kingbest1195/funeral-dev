import React from "react";
import "./Section.scss";

/**
 * Универсальный компонент секции страницы
 * Объединяет стандартную структуру всех секций сайта
 *
 * @param {Object} props - Свойства компонента
 * @param {React.ReactNode} props.children - Содержимое секции
 * @param {string} props.className - Дополнительные CSS классы
 * @param {string} props.id - ID для навигации (якоря)
 * @param {string} props.variant - Вариант оформления ('default', 'compact', 'hero')
 * @param {string} props.background - Фон секции ('default', 'light', 'dark')
 * @param {boolean} props.fullWidth - Убрать container для полноширинной секции
 */
const Section = ({
  children,
  className = "",
  id,
  variant = "default",
  background = "default",
  fullWidth = false,
  ...props
}) => {
  const sectionClasses = [
    "section",
    variant !== "default" ? `section--${variant}` : "",
    background === "light" ? "bg-light" : "",
    background === "dark" ? "bg-dark" : "",
    className
  ].filter(Boolean).join(" ");

  const content = fullWidth ? children : (
    <div className="container">
      {children}
    </div>
  );

  return (
    <section
      className={sectionClasses}
      id={id}
      {...props}
    >
      {content}
    </section>
  );
};

export default Section;