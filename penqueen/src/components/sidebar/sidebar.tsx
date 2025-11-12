import React, { useState,useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import "../../pages/login/login.css"
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [openModule, setOpenModule] = useState<string | null>(null);
//   const styles = {
//   textWhite: { color: "white" },
//   textPurple: { color: "purple" }
// };
  const renderText = (text: string) => (sidebarOpen ? <span className="fw-semibold">{text}</span> : null);

  const handleModuleClick = (moduleName: string) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
    setOpenModule(openModule === moduleName ? null : moduleName);
  };

  useEffect(() => {
    if (!sidebarOpen) {
      setOpenModule(null);
    }
  }, [sidebarOpen]);

  const getNavLinkStyle = (isActive: boolean): React.CSSProperties => ({
    color: isActive ? "white" : "black",
    fontWeight: isActive ? 500 : 500,
    textDecoration: "none",
    transition: "color 0.3s ease",
  });

  return (
    <div
      className="position-fixed top-0 start-0 h-100 p-3 custom-bgcolor shadow"
      style={{
        width: sidebarOpen ? "250px" : "80px",
        overflow: "hidden",
        transition: "width 0.3s ease-in-out",
        zIndex: 1050,
      }}
    >
      <hr className="text-white" /> 
      <ul 
      className="nav nav-pills flex-column"
      style={{ marginTop: "50px" }}
      >
        {/* Master module with sub-modules */}
        <li className="nav-item mb-1">
          <button
            type="button"
            className="nav-link text-dark w-100 d-flex justify-content-between align-items-center btn bg-white rounded shadow-sm px-3 py-2 border-0 transition-all"
            // onClick={() => toggleModule("master")}
            onClick={() => handleModuleClick("master")}
            style={{
              transition: "all 0.3s ease",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <i className="fa-solid fa-user-tie"></i>
              {/* <span className="fw-semibold">Master</span> */}
              {renderText("Master")}

            </div>

            {sidebarOpen && (
              <FontAwesomeIcon
                icon={openModule === "master" ? faCaretUp : faCaretDown}
              />
            )}
          </button>

          {openModule === "master" && (
            <ul className="nav flex-column sidebar-li mt-1">
              <li>
                <NavLink
                  to="/master/usermaster"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}
                >
                  User Master
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/master/itemmaster"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Item Master
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/master/pricelist"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Price List
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/master/itemcategorymaster"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Item Category Master
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Purchase */}
        <li className="mt-2 nav-item mb-1">
           <button
            className="nav-link text-dark w-100 d-flex justify-content-between align-items-center btn btn-link bg-white rounded"
            // onClick={() => toggleModule("purchase")}
            onClick={() => handleModuleClick("purchase")}

          >
            <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-cart-shopping"></i>
            {/* <span className="fw-semibold">Purchase</span> */}
            {renderText("Purchase")}
            </div>
            {sidebarOpen && (
              <FontAwesomeIcon
                icon={openModule === "purchase" ? faCaretUp : faCaretDown}
              />
            )}
          </button>
          {openModule === "purchase" && (
            <ul className="nav flex-column sidebar-li mt-1">
              <li>
                <NavLink
                  to="/purchase/purchaseOrder"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  purchase Order
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/purchase/ItemMaster"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Po Item Master
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Inventory with sub-modules */}
        <li className="nav-item mb-1">
          <button
            className="nav-link text-dark w-100 d-flex justify-content-between align-items-center btn btn-link mt-2 bg-white rounded"
            // onClick={() => toggleModule("inventory")}
            onClick={() => handleModuleClick("inventory")}

          >
            <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-warehouse"></i>
            {/* <span className="fw-semibold">Inventory</span> */}
            {renderText("Inventory")}

            </div>
            {/* <FontAwesomeIcon
              icon={openModule === "inventory" ? faCaretUp : faCaretDown}
            /> */}
            {sidebarOpen && (
              <FontAwesomeIcon
                icon={openModule === "inventory" ? faCaretUp : faCaretDown}
              />
            )}
          </button>

          {openModule === "inventory" && (
            <ul className="nav flex-column sidebar-li mt-1">
              <li>
                <NavLink
                  to="/inventory/stockMaster"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Stock Inventory Master
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/inventory/orders"
                  className={({ isActive }) =>
                    "nav-link text-dark" + (isActive ? " active" : "")
                  }
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Stock Addition
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Manufacturing */}
        <li className="nav-item mb-1">
          <button
            className="nav-link text-dark w-100 d-flex justify-content-between align-items-center btn btn-link mt-2 bg-white rounded"
            // onClick={() => toggleModule("Manufacturing")}
            onClick={() => handleModuleClick("Manufacturing")}
          >
            <div className="d-flex align-items-center gap-2">
           <i className="ri-tools-fill"></i>

            {/* <span className="fw-semibold">Manufacturing</span> */}
            {renderText("Manufacturing")}
            </div>
            {/* <FontAwesomeIcon
              icon={openModule === "Manufacturing" ? faCaretUp : faCaretDown}
            /> */}
            {sidebarOpen && (
              <FontAwesomeIcon
                icon={openModule === "Manufacturing" ? faCaretUp : faCaretDown}
              />
            )}
          </button>
          {openModule === "Manufacturing" && (
            <ul className="nav flex-column sidebar-li mt-1">
              <li>
                <NavLink
                  to="/manufacturing/shopexpenses"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Shop Expenses
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/manufacturing/deliverychallan"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Delivery Challan 
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Sales */}
        <li className="nav-item mb-1">
          <button
            className="nav-link text-dark w-100 d-flex justify-content-between align-items-center btn btn-link mt-2 bg-white rounded"
            // onClick={() => toggleModule("Sales")}
            onClick={() => handleModuleClick("Sales")}
          >
            <div className="d-flex align-items-center gap-2">
            <i className="fa-solid fa-store"></i>
            {/* <span className="fw-semibold">Sales</span> */}
            {renderText("Sales")}
            </div>
            {/* <FontAwesomeIcon
              icon={openModule === "Sales" ? faCaretUp : faCaretDown}
            /> */}
            {sidebarOpen && (
              <FontAwesomeIcon
                icon={openModule === "sales" ? faCaretUp : faCaretDown}
              />
            )}
          </button>
          {openModule === "Sales" && (
            <ul className="nav flex-column sidebar-li mt-1">
              <li>
                <NavLink
                  to="/sales/salesinvoice"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Sales Invoice
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/sales/savesales"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Save Sales 
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Reports */}
        <li className="nav-item mb-1">
          <button
            className="nav-link text-dark w-100 d-flex justify-content-between align-items-center btn btn-link mt-2 bg-white rounded"
            // onClick={() => toggleModule("Reports")}
            onClick={() => handleModuleClick("Reports")}
          >
            <div className="d-flex align-items-center gap-2">
            <i className="ri-alarm-warning-fill"></i>
            {renderText("Reports")}
            </div>
            {/* <FontAwesomeIcon
              icon={openModule === "Reports" ? faCaretUp : faCaretDown}
            /> */}
            {sidebarOpen && (
              <FontAwesomeIcon
                icon={openModule === "reports" ? faCaretUp : faCaretDown}
              />
            )}
          </button>
          {openModule === "Reports" && (
            <ul className="nav flex-column sidebar-li mt-1">
              <li>
                <NavLink
                  to="/reports/salesinvoice"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Sales Invoice
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Reports/savesales"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active-link" : ""}`
                  } 
                  style={({ isActive }) => getNavLinkStyle(isActive)}

                >
                  Save Sales 
                </NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
