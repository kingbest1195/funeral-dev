import React, { useEffect, useState, useId, useRef } from "react";
import "./PopupNotification.scss";

// Импорт иконок
import successIcon from "../../assets/icons/notification-success.png";
import errorIcon from "../../assets/icons/notification-error.png";
import loadingIcon from "../../assets/icons/notification-loading.png";
import infoIcon from "../../assets/icons/notification-info.png";

// Константы
const ANIMATION_DURATION = 300; // ms
const ANIMATION_DELAY = 10; // ms для плавного появления
const DEFAULT_DURATION = 5000; // ms
const SCROLLBAR_WIDTH = 15; // px

/**
 * Переиспользуемый компонент уведомлений для замены alert/confirm
 * Следует дизайн-системе проекта и принципам UI-гайда
 * 
 * @param {string} type - Тип уведомления: 'success' | 'error' | 'loading' | 'info'
 * @param {string} title - Заголовок уведомления
 * @param {string} message - Текст сообщения
 * @param {boolean} isVisible - Видимость уведомления
 * @param {function} onClose - Обработчик закрытия
 * @param {number} duration - Время автозакрытия в мс (0 = без автозакрытия)
 * @param {boolean} closable - Можно ли закрыть вручную
 * @param {function} onAction - Обработчик для кнопки действия
 * @param {string} actionText - Текст кнопки действия
 * @param {string} actionUrl - Ссылка для кнопки действия
 * @param {string} image - URL изображения для отображения в уведомлении
 * @param {string} imageAlt - Alt текст для изображения
 * @param {string} className - Дополнительные CSS классы
 */
const PopupNotification = ({
  type = "info",
  title = "",
  message = "",
  isVisible = false,
  onClose,
  duration = DEFAULT_DURATION,
  closable = true,
  onAction,
  actionText = "",
  actionUrl = "",
  image = "",
  imageAlt = "",
  className = "",
  ...props
}) => {
  const [show, setShow] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);
  const uniqueId = useId(); // Уникальный ID для accessibility
  const dialogRef = useRef(null);

  // Управление видимостью с анимацией
  useEffect(() => {
    if (isVisible) {
      setShow(true);
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsAnimating(true), ANIMATION_DELAY);
    } else {
      setIsAnimating(false);
      // Ждем завершения анимации исчезновения
      setTimeout(() => setShow(false), ANIMATION_DURATION);
    }
  }, [isVisible]);

  // Автозакрытие
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  // Обработчик закрытия с анимацией
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Обработчик клавиши Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && closable && isVisible) {
        handleClose();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isVisible, closable]);

  // Блокировка скролла и управление фокусом при показе модального окна
  useEffect(() => {
    if (isVisible) {
      // Сохраняем ранее фокусированный элемент
      const previouslyFocusedElement = document.activeElement;
      
      // Блокируем скролл
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${SCROLLBAR_WIDTH}px`; // Компенсируем исчезновение скроллбара
      
      // Фокусируемся на диалоге после появления
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.focus();
        }
      }, ANIMATION_DELAY);
      
      return () => {
        // Восстанавливаем скролл при закрытии
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        
        // Возвращаем фокус на предыдущий элемент
        if (previouslyFocusedElement && previouslyFocusedElement.focus) {
          previouslyFocusedElement.focus();
        }
      };
    }
  }, [isVisible]);

  // Получение иконки по типу
  const getIcon = () => {
    const icons = {
      success: successIcon,
      error: errorIcon,
      loading: loadingIcon,
      info: infoIcon
    };
    return icons[type] || icons.info;
  };

  // Получение заголовка по умолчанию
  const getDefaultTitle = () => {
    const defaultTitles = {
      success: "Успешно",
      error: "Ошибка",
      loading: "Обработка...",
      info: "Информация"
    };
    return title || defaultTitles[type] || "Уведомление";
  };

  // Класс для семантической роли
  const getAriaRole = () => {
    switch (type) {
      case "error":
        return "alert";
      case "loading":
        return "status";
      default:
        return "status";
    }
  };

  // Не рендерим, если компонент скрыт
  if (!show) {
    return null;
  }

  // Классы для компонента
  const baseClass = "popup-notification";
  const classes = [
    baseClass,
    `${baseClass}--${type}`,
    isAnimating ? `${baseClass}--visible` : "",
    className
  ].filter(Boolean).join(" ");

  return (
    <dialog
      ref={dialogRef}
      className={`${baseClass}__overlay ${isAnimating ? `${baseClass}__overlay--visible` : ""}`}
      open={show}
      onClick={closable ? handleClose : undefined}
      aria-modal="true"
      tabIndex={-1}
      {...props}
    >
      <article 
        className={classes}
        role={getAriaRole()}
        aria-live={type === "error" ? "assertive" : "polite"}
        aria-labelledby={`${uniqueId}-title`}
        aria-describedby={message ? `${uniqueId}-message` : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Иконка */}
        <div className={`${baseClass}__icon`}>
          <img 
            src={getIcon()} 
            alt="" 
            role="presentation"
            className={`${baseClass}__icon-image ${type === "loading" ? `${baseClass}__icon-image--loading` : ""}`}
          />
        </div>

        {/* Изображение (если указано) */}
        {image && (
          <div className={`${baseClass}__image`}>
            <img 
              src={image} 
              alt={imageAlt || ""} 
              className={`${baseClass}__image-content`}
            />
          </div>
        )}

        {/* Контент */}
        <div className={`${baseClass}__content`}>
          <h3 
            id={`${uniqueId}-title`}
            className={`${baseClass}__title`}
          >
            {getDefaultTitle()}
          </h3>
          
          {message && (
            <p 
              id={`${uniqueId}-message`}
              className={`${baseClass}__message`}
            >
              {message}
            </p>
          )}

          {/* Кнопки действий */}
          {(onAction || closable) && (
            <div className={`${baseClass}__actions`}>
              {/* Акцентная кнопка (только если указаны текст и действие/ссылка) */}
              {onAction && actionText && (
                <>
                  {actionUrl ? (
                    <a
                      href={actionUrl}
                      className={`${baseClass}__action-button ${baseClass}__action-button--primary`}
                      onClick={onAction}
                    >
                      {actionText}
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={`${baseClass}__action-button ${baseClass}__action-button--primary`}
                      onClick={onAction}
                    >
                      {actionText}
                    </button>
                  )}
                </>
              )}
              
              {/* Кнопка закрытия */}
              {closable && (
                <button
                  type="button"
                  className={`${baseClass}__close-button ${baseClass}__close-button--secondary`}
                  onClick={handleClose}
                  aria-label="Закрыть уведомление"
                >
                  Понятно, закрыть
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    </dialog>
  );
};

/**
 * Хук для управления уведомлениями
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (config) => {
    const id = Date.now() + Math.random();
    const notification = { id, ...config, isVisible: true };
    
    setNotifications(prev => [...prev, notification]);

    // Автоудаление
    if (config.duration !== 0) {
      setTimeout(() => {
        hideNotification(id);
      }, config.duration || DEFAULT_DURATION);
    }

    return id;
  };

  const hideNotification = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isVisible: false }
          : notification
      )
    );

    // Удаление из массива после анимации
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, ANIMATION_DURATION);
  };

  const hideAllNotifications = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isVisible: false }))
    );

    setTimeout(() => {
      setNotifications([]);
    }, ANIMATION_DURATION);
  };

  return {
    notifications,
    showNotification,
    hideNotification,
    hideAllNotifications,
    // Удобные методы
    success: (title, message, options = {}) => showNotification({ type: "success", title, message, ...options }),
    error: (title, message, options = {}) => showNotification({ type: "error", title, message, duration: 0, ...options }),
    info: (title, message, options = {}) => showNotification({ type: "info", title, message, ...options }),
    loading: (title, message, options = {}) => showNotification({ type: "loading", title, message, duration: 0, closable: false, ...options })
  };
};

/**
 * Контейнер для отображения множественных уведомлений
 */
export const NotificationContainer = ({ notifications = [], onClose }) => {
  if (!notifications.length) {
    return null;
  }

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <PopupNotification
          key={notification.id}
          {...notification}
          onClose={() => onClose && onClose(notification.id)}
        />
      ))}
    </div>
  );
};

export default PopupNotification;