import "./DataTable.scss";

const STRIPED_MODES = ["row", "column", "none"];

const DataTable = ({
  headers = [],
  rows = [],
  caption,
  stripedMode = "row",
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
  ].join(" ");

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
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}

        <tbody className="data-table__body">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="data-table__row">
              {Array.isArray(row)
                ? row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="data-table__cell">
                      {cell}
                    </td>
                  ))
                : Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex} className="data-table__cell">
                      {cell}
                    </td>
                  ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
