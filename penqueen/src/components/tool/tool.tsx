import React from "react";
import './tool.css';

interface InputProps {
  id: string;
  label: string;
  type?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  headers?: string[];
  data?: (string | number)[][];
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  type = "text",
  value,
  placeholder,
  onChange,
}) => {
  return (
    <div className="floating-label-input">
      <input
        className="input-text"
        type={type}
        id={id}
        placeholder={placeholder || label}
        value={value}
        onChange={onChange}
        autoComplete="off"
        
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button className={`gradient-btn ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Table: React.FC<TableProps> = ({
  headers = [],
  data = [],
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`table-border p-3 border border-black rounded shadow-sm`}>
      {/* 🔹 Top Controls (Dropdown + Search) */}
      <div className="d-flex justify-content-between align-items-center mb-3 Mobile-res">
       <div className="entries-container">
  <span>Show</span>
  <div className="select-wrapper">
    <select className="entries-select">
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="30">30</option>
    </select>
    <i className="fa-solid fa-caret-down dropdown-icon"></i>
  </div>
  <span>entries</span>
</div>

        <div style={{ width: "250px" }}>
          <Input id="search" label="Search" />
        </div>
      </div>

      {/* 🔹 Table Section */}
      <div className="table-responsive">
        <table
          className={`custom-table table table-bordered table-striped ${className}`}
          {...props}
        >
          {headers.length > 0 && (
            <thead className="table-light">
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))
            ) : (
              children || (
                <tr>
                  <td colSpan={headers.length || 1} className="text-center py-3">
                    No Data Available
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Bottom Controls (Entries Info + Pagination) */}
      <div className="d-flex justify-content-between align-items-center mt-3 Mobile-res">
        <span>Showing 1 to 1 of 1 entries</span>
        <nav aria-label="Page navigation example">
          <ul className="pagination mb-0 gap-1">
            <li className="page-item disabled">
              <a className="page-link" href="#">Previous</a>
            </li>
            <li className="page-item"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item">
              <a className="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

interface FormButtonProps {
  children: React.ReactNode; // button label or icon
  onClick?: () => void;      // optional click handler
  type?: "button" | "submit" | "reset"; // button type
  className?: string;        // optional custom styles
  disabled?: boolean;        // disable button
}

export const FormButton: React.FC<FormButtonProps> = ({
  children,
  className = "",
}) => {
  return (
    <button className={`common-btn btn-size ${className}`}>
      {children}
    </button>
  );
};
