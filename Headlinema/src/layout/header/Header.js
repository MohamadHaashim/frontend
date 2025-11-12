import React from "react";
import classNames from "classnames";
import Toggle from "../sidebar/Toggle";
import Logo from "../logo/Logo";
import News from "../news/News";
import User from "./dropdown/user/User";
import Notification from "./dropdown/notification/Notification";
import LanguageHead from "./dropdown/language/Language";

const Header = ({ fixed, theme, className, setVisibility, ...props }) => {

  const headerClass = classNames({
    "nk-header": true,
    "nk-header-fixed": fixed,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className,
  });
  return (
    <div className={headerClass}>
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ml-n1">
            <Toggle
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none ml-n1"
              icon="menu"
              click={props.sidebarToggle}
            />
          </div>
        
          <div className="nk-header-news">
          <LanguageHead />
          </div>
          <div className="nk-header-tools">
            <ul className="nk-quick-nav">
            <li className="notification-dropdown mr-n1" onClick={() => setVisibility(false)}>
                <Notification />
              </li>
              {/* <li className="language-dropdown d-none d-sm-block mr-n1">
                <LanguageHead />
              </li> */}
              <li className="user-dropdown" onClick={() => setVisibility(false)}>
                <User />
              </li>

            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
