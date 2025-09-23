// =================
// ОСНОВНАЯ СЕКЦИЯ КОНТЕНТА ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ
// =================

import React from 'react';
import { PRIVACY_CONTENT_SECTIONS, PRIVACY_CONTACT_INFO } from '../../content';
import PrivacyCallout from '../PrivacyCallout/PrivacyCallout';
import PrivacyParagraph from '../PrivacyParagraph/PrivacyParagraph';
import PrivacyTable from '../PrivacyTable/PrivacyTable';
import PrivacyContact from '../PrivacyContact/PrivacyContact';
import './PrivacyContentSection.scss';

/**
 * Основная секция с контентом политики конфиденциальности
 * Содержит все разделы документа и контактную информацию
 */
const PrivacyContentSection = () => {
  const {
    basicTerms,
    operatorData,
    dataProcessingPurposes,
    legalBasis,
    processingConditions,
    userRights,
    cookies,
    finalProvisions
  } = PRIVACY_CONTENT_SECTIONS;

  /**
   * Рендеринг секции с основными понятиями
   */
  const renderBasicTerms = () => (
    <section className="privacy-content__section" id={basicTerms.id}>
      <h2 className="privacy-content__section-title">{basicTerms.title}</h2>
      <PrivacyParagraph>
        <ul>
          {basicTerms.items.map((item, index) => (
            <li key={index}>
              <strong>{item.term}</strong> – {item.definition}
            </li>
          ))}
        </ul>
      </PrivacyParagraph>
    </section>
  );

  /**
   * Рендеринг секции с данными об операторе
   */
  const renderOperatorData = () => (
    <section className="privacy-content__section" id={operatorData.id}>
      <h2 className="privacy-content__section-title">{operatorData.title}</h2>
      <PrivacyParagraph>
        <ul>
          {operatorData.items.map((item, index) => (
            <li key={index}>
              <strong>{item.label}</strong> {item.value}
            </li>
          ))}
        </ul>
      </PrivacyParagraph>
    </section>
  );

  /**
   * Рендеринг секции с целями обработки данных
   */
  const renderDataProcessingPurposes = () => (
    <section className="privacy-content__section" id={dataProcessingPurposes.id}>
      <h2 className="privacy-content__section-title">{dataProcessingPurposes.title}</h2>
      <PrivacyParagraph>
        <p>{dataProcessingPurposes.description}</p>
      </PrivacyParagraph>

      <PrivacyTable data={dataProcessingPurposes.table.rows} />

      <PrivacyParagraph>
        <p><em>{dataProcessingPurposes.conclusion}</em></p>
      </PrivacyParagraph>
    </section>
  );

  /**
   * Рендеринг секции с правовыми основаниями
   */
  const renderLegalBasis = () => (
    <section className="privacy-content__section" id={legalBasis.id}>
      <h2 className="privacy-content__section-title">{legalBasis.title}</h2>
      <PrivacyParagraph>
        <p>{legalBasis.description}</p>
        <ul>
          {legalBasis.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </PrivacyParagraph>
    </section>
  );

  /**
   * Рендеринг секции с условиями обработки
   */
  const renderProcessingConditions = () => (
    <section className="privacy-content__section" id={processingConditions.id}>
      <h2 className="privacy-content__section-title">{processingConditions.title}</h2>

      {processingConditions.subsections.map((subsection, index) => (
        <div key={index} className="privacy-content__subsection">
          <h3 className="privacy-content__subsection-title">{subsection.title}</h3>
          <PrivacyParagraph>
            <p>{subsection.content}</p>
          </PrivacyParagraph>
        </div>
      ))}
    </section>
  );

  /**
   * Рендеринг секции с правами пользователей
   */
  const renderUserRights = () => (
    <section className="privacy-content__section" id={userRights.id}>
      <h2 className="privacy-content__section-title">{userRights.title}</h2>
      <PrivacyParagraph>
        <p>{userRights.description}</p>
        <ul>
          {userRights.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </PrivacyParagraph>
    </section>
  );

  /**
   * Рендеринг секции о cookies
   */
  const renderCookies = () => (
    <section className="privacy-content__section" id={cookies.id}>
      <h2 className="privacy-content__section-title">{cookies.title}</h2>
      <PrivacyParagraph>
        <p>{cookies.content}</p>
      </PrivacyParagraph>
    </section>
  );

  /**
   * Рендеринг заключительных положений
   */
  const renderFinalProvisions = () => (
    <section className="privacy-content__section" id={finalProvisions.id}>
      <h2 className="privacy-content__section-title">{finalProvisions.title}</h2>

      {finalProvisions.subsections.map((subsection, index) => (
        <div key={index} className="privacy-content__subsection">
          <h3 className="privacy-content__subsection-title">{subsection.title}</h3>
          <PrivacyParagraph>
            <p>
              {subsection.content}
              {subsection.policyUrl && (
                <>
                  {" "}
                  <code>{subsection.policyUrl}</code>.
                </>
              )}
            </p>
          </PrivacyParagraph>
        </div>
      ))}
    </section>
  );

  /**
   * Рендеринг контактной информации
   */
  const renderContactInfo = () => (
    <PrivacyContact>
      <h2>{PRIVACY_CONTACT_INFO.title}</h2>
      <p>{PRIVACY_CONTACT_INFO.description}</p>
      <ul>
        {PRIVACY_CONTACT_INFO.items.map((item, index) => (
          <li key={index}>
            {item.type === 'tel' ? (
              <>
                <strong>{item.label}</strong> <a href={item.href}>{item.value}</a>
              </>
            ) : (
              <>
                <strong>{item.label}</strong> {item.value}
              </>
            )}
          </li>
        ))}
      </ul>
    </PrivacyContact>
  );

  return (
    <article className="privacy-content">
      <div className="container">
        {renderBasicTerms()}
        {renderOperatorData()}
        {renderDataProcessingPurposes()}
        {renderLegalBasis()}
        {renderProcessingConditions()}
        {renderUserRights()}
        {renderCookies()}
        {renderFinalProvisions()}
        {renderContactInfo()}
      </div>
    </article>
  );
};

export default PrivacyContentSection;