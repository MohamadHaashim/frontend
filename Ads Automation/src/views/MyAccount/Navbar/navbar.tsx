import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
export default function Navbar() {
  return (
    <div className="my-account-navbar">
      <ul>
        <li>
          {" "}
          <NavLink to="/my-account/profile">
            <div className="myProfileLogo">
              <i className="profile-logo" />
              My Profile
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-account/billing">
            <div className="bill">
              <i className="profileBilling-logo" />
              Billing & Plan
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-account/notification">
            <i className="profileNotification-logo" />
            Notification
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-account/amazon-connection">
            <i className="amazonConnection-logo" />
            Amazon Connection
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
