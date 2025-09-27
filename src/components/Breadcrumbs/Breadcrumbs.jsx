import React from "react";
import "./Breadcrumbs.scss";

/**
 * Компонент навигационных хлебных крошек
 * Поддерживает Schema.org BreadcrumbList для SEO
 * @param {Array} items - Массив элементов [{label, href}], последний элемент без href (текущая страница)
 * @param {string} className - Дополнительные CSS классы
 */
const Breadcrumbs = ({ items = [], className = "" }) => {
  if (!items.length) return null;

  const breadcrumbsClassName = ["breadcrumbs", className]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      className={breadcrumbsClassName}
      aria-label="Хлебные крошки"
    >
      <ol className="breadcrumbs__list" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const position = index + 1;

          return (
            <li
              key={index}
              className="breadcrumbs__item"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isLast ? (
                <span
                  className="breadcrumbs__current"
                  itemProp="name"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="breadcrumbs__link"
                  itemProp="item"
                >
                  <span itemProp="name">{item.label}</span>
                </a>
              )}
              <meta itemProp="position" content={position} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;