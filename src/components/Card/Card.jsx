import React from "react";
import "./Card.scss";

/**
 * Переиспользуемый базовый компонент карточки
 * Содержит общие стили (фон, тень, рамка, padding) согласно плану оптимизации
 */
const Card = ({ 
  children, 
  className = "", 
  variant = "default",
  padding = "default",
  hover = false,
  ...props 
}) => {
  const baseClass = "card";
  const classes = [
    baseClass,
    `${baseClass}--${variant}`,
    `${baseClass}--padding-${padding}`,
    hover ? `${baseClass}--hover` : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

/**
 * Компонент для тела карточки
 */
export const CardBody = ({ children, className = "", ...props }) => {
  return (
    <div className={`card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Компонент для хедера карточки
 */
export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`card__header ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Компонент для футера карточки
 */
export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;