import "./DataTable.scss";

const STRIPED_MODES = ["row", "column", "none"];

// Функция для проверки и обработки цен
const isPriceCell = (content) => {
  if (typeof content !== 'string') return false;
  return /\*\*от\s+\d+[\s\d]*руб\.\*\*/.test(content);
};

const formatPriceCell = (content) => {
  // Удаляем ** и извлекаем цену
  const cleanText = content.replace(/\*\*/g, '');
  const priceMatch = cleanText.match(/от\s+([\d\s]+)\s*руб\./);
  if (priceMatch) {
    const price = priceMatch[1].replace(/\s/g, '');
    return {
      price: price,
      label: 'от',
      currency: 'руб.'
    };
  }
  return null;
};

const DataTable = ({
  headers = [],
  rows = [],
  caption,
  stripedMode = "row",
  isColumnsEqual = false,
  headerImages = [],
  enhancePrices = false,
  className = "",
  ...props
}) => {
  const normalizedMode = STRIPED_MODES.includes(stripedMode)
    ? stripedMode
    : "row";

  const wrapperClassName = ["data-table__wrapper", className]
    .filter(Boolean)
    .join(" ");

  const tableClassName = [
    "data-table",
    `data-table--striped-${normalizedMode}`,
    isColumnsEqual ? "data-table--columns-equal" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={wrapperClassName}>
      <table className={tableClassName} {...props}>
        {caption ? (
          <caption className="data-table__caption">{caption}</caption>
        ) : null}

        {headers.length > 0 ? (
          <thead className="data-table__head">
            <tr className="data-table__row">
              {headers.map((header, index) => (
                <th key={index} scope="col" className="data-table__header-cell">
                  {headerImages[index] ? (
                    <div className="data-table__header-content">
                      <img
                        src={headerImages[index].src}
                        alt={headerImages[index].alt}
                        className="data-table__header-image"
                        width={headerImages[index].width}
                        height={headerImages[index].height}
                      />
                      <span className="data-table__header-text">{header}</span>
                    </div>
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}

        <tbody className="data-table__body">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="data-table__row">
              {Array.isArray(row)
                ? row.map((cell, cellIndex) => {
                    const isPriceRow = rowIndex === 0 && enhancePrices && isPriceCell(cell);
                    const priceData = isPriceRow ? formatPriceCell(cell) : null;

                    return (
                      <td key={cellIndex} className={`data-table__cell ${isPriceRow ? 'data-table__cell--price' : ''}`}>
                        {isPriceRow && priceData ? (
                          <div className="data-table__price">
                            <span className="data-table__price-label">{priceData.label}</span>
                            <span className="data-table__price-amount">{priceData.price}</span>
                            <span className="data-table__price-currency">{priceData.currency}</span>
                          </div>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })
                : Object.values(row).map((cell, cellIndex) => {
                    const isPriceRow = rowIndex === 0 && enhancePrices && isPriceCell(cell);
                    const priceData = isPriceRow ? formatPriceCell(cell) : null;

                    return (
                      <td key={cellIndex} className={`data-table__cell ${isPriceRow ? 'data-table__cell--price' : ''}`}>
                        {isPriceRow && priceData ? (
                          <div className="data-table__price">
                            <span className="data-table__price-label">{priceData.label}</span>
                            <span className="data-table__price-amount">{priceData.price}</span>
                            <span className="data-table__price-currency">{priceData.currency}</span>
                          </div>
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
