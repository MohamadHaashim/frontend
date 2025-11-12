import React from "react";
import classNames from "classnames";
import ReactCountryFlag from "react-country-flag";
// import { basicData } from "./TableData";

const Table2 = ({ headColor, striped, border, hover, responsive, basicData }) => {
  const tableClass = classNames({
    table: true,
    "table-bordered": border,
    "table-borderless": !border,
    "table-striped": striped,
    "table-hover": hover,
  });
  return (
    <div className={responsive ? "table-responsive" : ""}>
      <table className={tableClass}>
        <thead className={`${headColor ? `thead-${headColor}` : ""}`}>
          <tr>
            {basicData.header.map((item, idx) => {
              return <th key={idx}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {basicData.data.map((item) => {
            return (
              <tr key={item.id}>
                <td> 
                    {item.sellingPartnerId || ""}       
                </td>
                <td>{item.region}</td>
                <td>{item.connectedOn}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table2;
