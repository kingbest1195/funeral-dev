import React, { useState, useRef, useEffect, Suspense } from "react";
import { CONTACTS_MAP_DATA } from "@/constants/content";
import "./ContactsMapSection.scss";

// Динамический импорт карты для оптимизации
const YandexMap = React.lazy(() => import("@/components/YandexMap"));

/**
 * Секция "Контакты и карта" на главной странице
 * Отображает телефон, адреса офисов и место для карты
 */
const ContactsMapSection = () => {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadMap) {
            setShouldLoadMap(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoadMap]);

  return (
    <section id="contacts" className="contacts-map section">
      <div className="container">
        <h2 className="contacts-map__title">{CONTACTS_MAP_DATA.title}</h2>
        <p className="contacts-map__description">{CONTACTS_MAP_DATA.description}</p>

        <div className="contacts-content">
          <div className="contacts-info">
            <div className="contact-phone">
              <h3 className="contact-phone__title">{CONTACTS_MAP_DATA.phone.title}</h3>
              <a
                href={CONTACTS_MAP_DATA.phone.href}
                className="phone-number phone-number--large"
              >
                {CONTACTS_MAP_DATA.phone.number}
              </a>
            </div>

            <div className="offices-list">
              <h3 className="offices-list__title">{CONTACTS_MAP_DATA.offices.title}</h3>
              {CONTACTS_MAP_DATA.offices.items.map((office) => (
                <div key={office.id} className="office-item">
                  <h4 className="office-item__address">{office.address}</h4>
                  {office.note && (
                    <p className="office-item__note">{office.note}</p>
                  )}
                  <p className="office-item__schedule">{office.schedule}</p>
                  <p className="office-item__route d-desktop-none">
                    <a
                      className="btn btn--secondary btn--sm"
                      href={office.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={office.ariaLabel}
                    >
                      Маршрут
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="map-container" ref={mapRef}>
            {shouldLoadMap ? (
              <Suspense
                fallback={
                  <div className="map-loading" style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Загружаем карту...
                  </div>
                }
              >
                <YandexMap
                  offices={CONTACTS_MAP_DATA.offices.items}
                  height={400}
                  className="contacts-map__yandex-map"
                />
              </Suspense>
            ) : (
              <div className="map-placeholder" style={{ height: '400px', backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Карта загрузится при прокрутке</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsMapSection;