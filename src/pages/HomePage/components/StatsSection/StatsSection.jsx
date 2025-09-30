import React from "react";
import { COMPANY_STATS } from "@/constants/content";

/**
 * Секция статистики компании на главной странице
 */
const StatsSection = () => {
  return (
    <section id="stats" className="company-stats section">
      <div className="container">
        <div className="company-stats__grid">
          <div className="company-stats__intro">
            <h2 className="company-stats__title">{COMPANY_STATS.title}</h2>
            <p className="company-stats__subtitle">{COMPANY_STATS.subtitle}</p>
          </div>
          <div className="company-stats__numbers">
            <div className="stats__grid">
              {COMPANY_STATS.items.map((stat) => (
                <div key={stat.id} className="stat-item">
                  <div className="stats-number">{stat.number}</div>
                  <p className="stat-item__description">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;