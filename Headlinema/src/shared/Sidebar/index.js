import React, { useState } from "react";
import "./index.css";
import { Link, useLocation } from "react-router-dom";

import Logo from "../../assets/brand/logo-icon-white.svg";
import LogoL from "../../assets/brand/logo-white.svg";
import menuItems from "./menu.json";
import menuItemsBottom from "./menu-bottom.json";
import sideHrLine from "../../assets/images/side-menu-hr-line.svg";

// LocalStorage value
const roleValue = ["Admin"];

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Check if the user role in localStorage is an admin
  const isAdmin = () => {
    const role = localStorage.getItem("checkRole") || "";
    return roleValue.includes(role);
  };

  localStorage.setItem("currentPathname", splitLocation[1]);

  function collapseMenu(e) {
    const ele = document.getElementById("sideMenubar");
    localStorage.setItem("currentPathname", splitLocation[1]);
    localStorage.removeItem("Sort");
    localStorage.removeItem("SortData");
  }

  const collapseSubmenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
    localStorage.setItem("currentPathname", splitLocation[1]);
  };

  return (
    <div id="sideMenubar" className="sidebar" onClick={collapseMenu}>
      <div className="header-wrapper">
        <div className="brand-logo">
          <h5 className="mt-3 ps-3" style={{ color: "white" }}>
            Get Growth Digital
          </h5>
        </div>
      </div>
      <div>
        <nav>
          <ul className="menus">
            {menuItems.map((menu, index) => {
              // Render only if user is admin or menu item is not admin-specific
              if (menu.name === "Admin" && !isAdmin()) return null;

              const submenuList = menu.submenuList || [];
              return (
                <li
                  className={`menu-items ${
                    splitLocation[1] === menu.active ? "active" : ""
                  } ${menu.hasSubMenu ? "has-submenu" : ""}`}
                  key={index}
                  onClick={() => collapseSubmenu(index)}
                >
                  <Link to={menu.to}>
                    <i className={menu.icon}></i>
                    <span className="mb-1">{menu.name}</span>
                  </Link>
                  {menu.hasSubMenu && (
                    <ul
                      className={`submenu-dropdown ${
                        activeSubMenu === index ? "open" : ""
                      }`}
                    >
                      {submenuList.map((submenu, subIndex) => (
                        <li
                          className={`menu-items ${
                            splitLocation[2] === submenu.active ? "active" : ""
                          }`}
                          key={subIndex}
                        >
                          <Link to={submenu.to}>
                            <span>{submenu.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <ul className="menus bottom">
            <div className="hr-line-conainer">
              <img src={sideHrLine} alt="hr line" />
            </div>
            {menuItemsBottom.map((menu, index) => {
              return (
                <li
                  className={"menu-items" + (menu.active ? " active" : "")}
                  key={index}
                >
                  <Link to={menu.to}>
                    <i className={menu.icon}></i>
                    <span>{menu.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
