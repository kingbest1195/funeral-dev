import React from "react";
import "./SectionTitle.scss";

/**
 * Переиспользуемый компонент заголовка секции
 * Использует адаптивную типографику с clamp() согласно плану оптимизации
 */
const SectionTitle = ({ 
  children, 
  level = "h2", 
  className = "",
  centered = false,
  ...props 
}) => {
  const Tag = level;
  const baseClass = "section-title";
  const classes = [
    baseClass,
    level === "h1" ? `${baseClass}--h1` : `${baseClass}--h2`,
    centered ? `${baseClass}--centered` : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default SectionTitle;