import React from "react";
import EnglishFlag from "../../images/flags/english.png";
import UkFlag from "../../images/flags/uk.png";
import { DropdownItem, DropdownMenu } from "reactstrap";

function LangDropdown  ({ className, size }, props)  {

  const UKLanguageSelect = () => {
    props.UKLanguageSelect;
  }

  const USLanguageSelect = () => {
    props.USLanguageSelect;
  }

  return (
    <DropdownMenu right className={`${size ? `dropdown-menu-${size}` : ""} ${className ? className : ""}`}>
      <ul className="language-list">
        <li>
          <DropdownItem tag="a" href="#item" className="language-item" onClick={USLanguageSelect}>
            <img src={EnglishFlag} alt="" className="language-flag" />
            <span className="language-name">US - www.amazon.com</span>
          </DropdownItem>
        </li>
        <li>
          <DropdownItem tag="a" href="#item" className="language-item" onClick={UKLanguageSelect}>
            <img src={UkFlag} alt="" className="language-flag" />
            <span className="language-name">UK - www.amazon.uk</span>
          </DropdownItem>
        </li>

      </ul>
    </DropdownMenu>
  );
};

export default LangDropdown;
