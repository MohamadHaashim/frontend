import React from "react";
import { NavLink } from "react-router-dom";
import "./faqSideTab.css";
export default function FaqSideTab() {
  return (
    <div className="faq-side-tab">
      <ul>
        <li>
          {" "}
          <NavLink to={""} className="active">
            <i className="faq-product-icon" />
            Products & Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <i className="faq-flag-icon" />
            Get Started
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <i className="faq-receipt-icon" />
            Subscription & Payment
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <i className="faq-security-icon" />
            Data Security
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <i className="faq-setting-icon" />
            Troubleshooting
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
