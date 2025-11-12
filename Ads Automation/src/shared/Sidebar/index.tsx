import React, { useState } from "react";
import "./index.css";
import { Link } from "react-router-dom";

import Logo from "../../assets/brand/logo-icon-white.svg";
import LogoL from "../../assets/brand/logo-white.svg";
import menuItems from "./menu.json";
import menuItemsBottom from "./menu-bottom.json";
import sideHrLine from "../../assets/images/side-menu-hr-line.svg";
import { useLocation } from "react-router-dom";
import { elements } from "chart.js";

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // console.log(splitLocation[1]);

  localStorage.setItem("currentPathname" , splitLocation[1])
  

  // document.addEventListener('click', function(event:any){
  //   const yourContainer:any = document.querySelector('.sidebar');
  //   if(event.target){
  //     if(!yourContainer.contains(event.target)) {
  //       const ele:any = document.getElementById('sideMenubar');
  //       if(ele.length > 0){
  //         ele.classList.remove('open');
  //       }
  //     }
  //   }
  // });

  function collapseMenu(e) {
    const ele: any = document.getElementById("sideMenubar");
    localStorage.setItem("currentPathname" , splitLocation[1])
    localStorage.removeItem("Sort")
    localStorage.removeItem("SortData")
    //ele.classList.add('open');
  }

  // function collapseSubmenu(e) {
  //   if (e.target.closest(".has-submenu")) {
  //     let mainParent = e.target.closest(".sidebar");
  //     let allSubmenuContainer = mainParent.getElementsByClassName("submenu-dropdown");

  //     // Close all submenus except the clicked one
  //     for (let i = 0; allSubmenuContainer.length > i; i++) {
  //       if (!allSubmenuContainer[i].contains(e.target)) {
  //         allSubmenuContainer[i].classList.remove("open");
  //       }
  //     }

  //     // Toggle submenu visibility
  //     let ele = e.target.closest(".has-submenu");
  //     let submenuContainer = ele.getElementsByClassName("submenu-dropdown");
  //     for (let i = 0; submenuContainer.length > i; i++) {
  //       submenuContainer[i].classList.toggle("open");
  //     }
  //   }
  // }
  const collapseSubmenu = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
    localStorage.setItem("currentPathname" , splitLocation[1])
    
  };

  return (
    <div id="sideMenubar" className="sidebar" onClick={collapseMenu}>
      <div className="header-wrapper">
        <div className="brand-logo">
          {/* <img src={Logo} alt="logo" className="logosmall" />
          <img src={LogoL} alt="logo" className="logolarge" /> */}
          <h5 className="mt-3 ps-3" style={{ color: "white" }}>
            Get Growth Digital
          </h5>
        </div>
      </div>
      <div>
        <nav>
          <ul className="menus">
            {menuItems.map((menu, index) => {
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
