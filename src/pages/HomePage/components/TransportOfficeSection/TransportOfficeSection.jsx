import React from "react";
import { TRANSPORT_OFFICE_DATA } from "@/constants/content";
import hearseWebp from "@/assets/images/transport-and-office/hearse-modern.webp";
import hearseJpg from "@/assets/images/transport-and-office/hearse-modern.jpg";
import busWebp from "@/assets/images/transport-and-office/bus-comfort.webp";
import busJpg from "@/assets/images/transport-and-office/bus-comfort.jpg";
import officeWebp from "@/assets/images/transport-and-office/office-facade.webp";
import officeJpg from "@/assets/images/transport-and-office/office-facade.jpg";
import "./TransportOfficeSection.scss";

/**
 * Секция "Наш транспорт и офис" на главной странице
 * Точно как в оригинале с тремя элементами и transport-gallery
 */
const TransportOfficeSection = () => {
  // Маппинг изображений для динамического импорта
  const imageMap = {
    "hearse-modern.webp": hearseWebp,
    "hearse-modern.jpg": hearseJpg,
    "bus-comfort.webp": busWebp,
    "bus-comfort.jpg": busJpg,
    "office-facade.webp": officeWebp,
    "office-facade.jpg": officeJpg,
  };

  return (
    <section className="transport-office section bg-light">
      <div className="container">
        <h2 className="transport-office__title">{TRANSPORT_OFFICE_DATA.title}</h2>
        <p className="transport-office__description">{TRANSPORT_OFFICE_DATA.description}</p>

        <div className="transport-gallery">
          {TRANSPORT_OFFICE_DATA.items.map((item) => (
            <div key={item.id} className="transport-item">
              <div className="transport-item__image">
                <picture>
                  <source srcSet={imageMap[item.imageWebp]} type="image/webp" />
                  <img
                    src={imageMap[item.imageJpg]}
                    alt={item.alt}
                    loading="lazy"
                    width="800"
                    height="533"
                  />
                </picture>
              </div>
              <p className="transport-item__caption">{item.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportOfficeSection;