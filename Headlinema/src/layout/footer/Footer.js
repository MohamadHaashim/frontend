import React from "react";
import { DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { LangDropdown } from "../../components/Component";

const Footer = () => {
  return (
    <div className="nk-footer">
      <div className="container-fluid">
        <div className="nk-footer-wrap">
          <div className="nk-footer-copyright">
            {" "}
            &copy; 2024 <a href="https://www.headlinema.com/">Headlinema</a>
            . All Rights Reserved.</div>
          <div className="nk-footer-links">
            <ul className="nav nav-sm">
              <li className="nav-item active current-page">
               
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Footer;
