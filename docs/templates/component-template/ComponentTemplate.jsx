import React, { useState, useEffect, useRef } from "react";
import "./ComponentTemplate.scss";

// Импорт бизнес-данных и утилит
import { COMPANY_INFO } from "@/helpers";
// import { MODULE_DATA } from "@/constants/content";

// Импорт оптимизированных изображений (при необходимости)
// import imageWebp from "@/assets/images-optimized/image.webp";
// import imageJpg from "@/assets/images/image.jpg";

/**
 * Шаблон компонента для проекта ритуальной службы "Век"
 *
 * Описание назначения компонента и его роли в системе.
 * Примеры использования и особенности.
 *
 * @component
 * @example
 * <ComponentTemplate
 *   title="Заголовок компонента"
 *   description="Описание компонента"
 *   variant="primary"
 *   onAction={() => console.log('Action triggered')}
 * />
 *
 * @param {Object} props - Свойства компонента
 * @param {string} props.title - Заголовок компонента (обязательно)
 * @param {string} [props.description] - Описание компонента (опционально)
 * @param {ReactNode} [props.children] - Дочерние элементы
 * @param {string} [props.className=""] - Дополнительные CSS классы
 * @param {string} [props.variant="default"] - Вариант отображения ('default', 'primary', 'secondary', 'featured')
 * @param {Function} [props.onAction] - Обработчик основного действия
 * @param {string} [props.actionText="Действие"] - Текст кнопки действия
 * @param {boolean} [props.disabled=false] - Состояние отключения
 * @param {boolean} [props.loading=false] - Состояние загрузки
 * @param {string} [props.ariaLabel] - ARIA метка для доступности
 * @param {Object} [props...rest] - Остальные HTML атрибуты
 *
 * @returns {ReactElement} Компонент ComponentTemplate
 */
const ComponentTemplate = ({
  title,
  description,
  children,
  className = "",
  variant = "default",
  onAction,
  actionText = "Действие",
  disabled = false,
  loading = false,
  ariaLabel,
  ...props
}) => {
  // State для управления состоянием компонента
  const [isActive, setIsActive] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  // Refs для прямого доступа к DOM элементам
  const componentRef = useRef(null);
  const actionButtonRef = useRef(null);

  // Effect для инициализации компонента
  useEffect(() => {
    // Логика инициализации
    console.log('ComponentTemplate mounted');

    // Cleanup function
    return () => {
      console.log('ComponentTemplate unmounted');
    };
  }, []);

  // Effect для отслеживания изменений props
  useEffect(() => {
    setInternalLoading(loading);
  }, [loading]);

  // Обработчики событий
  const handleAction = async () => {
    if (disabled || internalLoading) return;

    try {
      setInternalLoading(true);
      setIsActive(true);

      // Выполнение действия
      if (onAction) {
        await onAction();
      }

      console.log('Action completed');
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setInternalLoading(false);
      setIsActive(false);
    }
  };

  // Обработчик keyboard navigation
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAction();
    }
  };

  // Генерация CSS классов
  const componentClasses = [
    "component-template",
    `component-template--${variant}`,
    isActive && "component-template--active",
    internalLoading && "component-template--loading",
    disabled && "component-template--disabled",
    className
  ].filter(Boolean).join(" ");

  // Render функции для сложного контента
  const renderHeader = () => (
    <header className="component-template__header">
      <h2 className="component-template__title">
        {title}
      </h2>
      {description && (
        <p className="component-template__description">
          {description}
        </p>
      )}
    </header>
  );

  const renderContent = () => (
    <div className="component-template__content">
      {children ? (
        children
      ) : (
        <div className="component-template__default-content">
          <p>Контент компонента по умолчанию</p>
        </div>
      )}
    </div>
  );

  const renderActions = () => {
    if (!onAction) return null;

    return (
      <div className="component-template__actions">
        <button
          ref={actionButtonRef}
          type="button"
          className="component-template__action-button"
          onClick={handleAction}
          onKeyPress={handleKeyPress}
          disabled={disabled || internalLoading}
          aria-label={ariaLabel || `${actionText} для ${title}`}
          aria-busy={internalLoading}
        >
          {internalLoading ? (
            <>
              <span className="component-template__spinner" aria-hidden="true"></span>
              <span>Загрузка...</span>
            </>
          ) : (
            actionText
          )}
        </button>
      </div>
    );
  };

  // Основной render
  return (
    <section
      ref={componentRef}
      className={componentClasses}
      role="region"
      aria-label={ariaLabel || title}
      aria-busy={internalLoading}
      {...props}
    >
      {renderHeader()}
      {renderContent()}
      {renderActions()}

      {/* Индикатор загрузки для всего компонента */}
      {internalLoading && (
        <div
          className="component-template__loading-overlay"
          aria-hidden="true"
        >
          <div className="component-template__loading-spinner"></div>
        </div>
      )}
    </section>
  );
};

// Дополнительные экспорты для специализированных версий
export const ComponentTemplateCard = (props) => (
  <ComponentTemplate {...props} variant="card" />
);

export const ComponentTemplateFeatured = (props) => (
  <ComponentTemplate {...props} variant="featured" />
);

// Основной экспорт
export default ComponentTemplate;