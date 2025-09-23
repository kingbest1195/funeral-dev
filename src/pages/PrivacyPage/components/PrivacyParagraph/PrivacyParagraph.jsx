// =================
// КОМПОНЕНТ ПАРАГРАФА ДЛЯ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ - PrivacyParagraph.jsx
// =================

import "./PrivacyParagraph.scss";

const PrivacyParagraph = ({ children, className = "" }) => {
  return (
    <div className={`privacy-paragraph ${className}`}>
      {children}
    </div>
  );
};

export default PrivacyParagraph;