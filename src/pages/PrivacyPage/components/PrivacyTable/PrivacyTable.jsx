// =================
// КОМПОНЕНТ ТАБЛИЦЫ ДЛЯ ПОЛИТИКИ КОНФИДЕНЦИАЛЬНОСТИ - PrivacyTable.jsx
// =================

import "./PrivacyTable.scss";

const PrivacyTable = ({ data }) => {
  return (
    <div className="privacy-table-wrapper">
      <table className="privacy-table">
        <thead>
          <tr>
            <th>Категория ПДн</th>
            <th>Цель обработки</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.category}</td>
              <td>{row.purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrivacyTable;