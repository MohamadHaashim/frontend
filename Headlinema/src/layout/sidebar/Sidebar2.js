import React, { useState } from "react";
import classNames from "classnames";
import SimpleBar from "simplebar-react";
import Logo from "../logo/Logo";
import Menu from "../menu/Menu";
import Toggle from "./Toggle";
import Bg from '../../images/bg.png'
import CryptoMenu from "../menu/CryptoMenu";
import { Button, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { Icon, LangDropdown } from "../../components/Component";
import { Link } from "react-router-dom";

const Sidebar = ({ fixed, theme, className, sidebarToggle, mobileView, ...props }) => {
  const [collapseSidebar, setSidebar] = useState(true);
  const [mouseEnter, setMouseEnter] = useState(false);

  const toggleCollapse = () => {
    setSidebar(!collapseSidebar);
  };

  const handleMouseEnter = () => setMouseEnter(true);
  const handleMouseLeave = () => setMouseEnter(false);

  const classes = classNames({
    "nk-sidebar": true,
    "nk-sidebar-fixed": fixed,
    "is-compact": collapseSidebar,
    "has-hover": collapseSidebar && mouseEnter,
    [`is-light`]: theme === "white",
    [`is-${theme}`]: theme !== "white" && theme !== "light",
    [`${className}`]: className,
  });

  return (
    // backgroundImage:`url(${Bg})`,
    <div className={classes} style={{backgroundSize:'auto', backgroundPositionX:'center', backgroundColor:'#11274b ', backgroundBlendMode:'difference'}} >
      <div className="nk-sidebar-element nk-sidebar-head">
        <div className="nk-menu-trigger !hidden">
          <Toggle className="nk-nav-toggle nk-quick-nav-icon d-xl-none mr-n2" icon="arrow-left" click={sidebarToggle} />
          <Toggle
            className={`nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex ${
              collapseSidebar ? "compact-active" : ""
            }`}
            click={toggleCollapse}
            icon="menu"
          />
        </div>
        <div className={`nk-sidebar-brand ${
              collapseSidebar ? "compact-active" : ""
            }`}>
          <Logo />
        </div>
      </div>
      <div className="nk-sidebar-content" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <SimpleBar className="nk-sidebar-menu">
          <Menu sidebarToggle={sidebarToggle} mobileView={mobileView}/>
        </SimpleBar>
      </div>
    </div>
  );
};
export default Sidebar;
