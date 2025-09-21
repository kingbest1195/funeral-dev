import React from "react";
import { TRANSPORT_OFFICE_DATA } from "@/constants/content";
import hearseWebp from "@/assets/images-optimized/transport-and-office/hearse-modern.webp";
import hearseJpg from "@/assets/images-optimized/transport-and-office/hearse-modern.png";
import funeralMarketWebp from "@/assets/images-optimized/transport-and-office/funeral-market.webp";
import funeralMarketJpg from "@/assets/images-optimized/transport-and-office/funeral-market.png";
import officeWebp from "@/assets/images-optimized/transport-and-office/office-facade-main.webp";
import officeJpg from "@/assets/images-optimized/transport-and-office/office-facade-main.png";
import "./TransportOfficeSection.scss";

/**
 * Секция "Наш транспорт и офис" на главной странице
 * Точно как в оригинале с тремя элементами и transport-gallery
 */
const TransportOfficeSection = () => {
  // Маппинг изображений для динамического импорта
  const imageMap = {
    "hearse-modern.webp": hearseWebp,
    "hearse-modern.png": hearseJpg,
    "funeral-market.webp": funeralMarketWebp,
    "funeral-market.png": funeralMarketJpg,
    "office-facade-main.webp": officeWebp,
    "office-facade-main.png": officeJpg,
  };

  return (
    <section className="transport-office section bg-light">
      <div className="container">
        <h2 className="transport-office__title">
          {TRANSPORT_OFFICE_DATA.title}
        </h2>
        <p className="transport-office__description">
          {TRANSPORT_OFFICE_DATA.description}
        </p>

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
