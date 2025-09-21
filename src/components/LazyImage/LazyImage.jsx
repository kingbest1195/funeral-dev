import React, { useState, useRef, useCallback } from "react";
import "./LazyImage.scss";

/**
 * Оптимизированный компонент для ленивой загрузки изображений
 * Улучшает LCP и общую производительность страницы
 */
const LazyImage = ({
  src,
  srcWebp,
  alt,
  className = "",
  width,
  height,
  priority = false,
  placeholder = true,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer для lazy loading
  const observerRef = useCallback((node) => {
    if (node && !priority) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: "50px", // Загружать заранее за 50px до видимости
          threshold: 0.1,
        }
      );
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true); // Считаем загруженным чтобы убрать placeholder
  };

  // Если изображение имеет приоритет, загружаем сразу
  const shouldLoad = priority || isInView;

  return (
    <div
      ref={observerRef}
      className={`lazy-image ${className} ${isLoaded ? 'lazy-image--loaded' : ''}`}
      style={{ width, height }}
    >
      {/* Placeholder во время загрузки */}
      {placeholder && !isLoaded && (
        <div
          className="lazy-image__placeholder"
          style={{
            width: width || '100%',
            height: height || '200px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div className="lazy-image__spinner" />
        </div>
      )}

      {/* Основное изображение */}
      {shouldLoad && !hasError && (
        <picture className="lazy-image__picture">
          {srcWebp && (
            <source srcSet={srcWebp} type="image/webp" />
          )}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`lazy-image__img ${isLoaded ? 'lazy-image__img--loaded' : ''}`}
            {...props}
          />
        </picture>
      )}

      {/* Fallback при ошибке загрузки */}
      {hasError && (
        <div className="lazy-image__error">
          <span>Изображение недоступно</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;