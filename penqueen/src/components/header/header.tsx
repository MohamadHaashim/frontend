import React,{useRef,useState,useEffect} from "react";
import "../../pages/login/login.css"
import portfolio from '../../../src/assets/photos/Haashimportolio.png'
import { NavLink } from "react-router-dom";

interface HeaderProps {
  toggleSidebar: () => void;
  userName: string;
  companyName: string;
  staff: string;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, userName, companyName, staff }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light navbar-bgcolor shadow-sm px-3"
    style={{ 
        // width: "1500px",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999, }}>
      <span className="navbar-brand mb-0 h1 text-white ms-5" > 
        <NavLink 
        to="/salesbill"
         className="text-white text-decoration-none"
        >
        {companyName}</NavLink>
        </span>
      <div className="text-white inline-block" onClick={toggleSidebar} style={{color:"white"}}>  
        {/* <span className="text-white inline-block"></span> */}
        <i className="fa-solid fa-bars-staggered"></i>
      </div>
      {/* Spacer */}
      <div className="flex-grow-1"></div>

      {/* User info */}
      <div className="d-flex align-items-center me-5">
        <img
          src={portfolio}
          alt="User Avatar"
          className="rounded-circle me-3"
          width={32}
          height={32}
        />
        <div className="d-flex flex-column" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <span className="me-2 fw-semibold text-white">{userName}</span>
        <span className="me-2 fw-semibold text-white">{staff}</span>
        </div>
       <span
          className={`inline-block transition-transform duration-300 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <i className="fa-solid fa-circle-chevron-down text-white"></i>
        </span>
        {dropdownOpen && (
          <div className="position-absolute header-dropdown end-0 bg-white shadow rounded w-48 py-2">
            <button className="dropdown-item px-4 py-2 text-dark w-100 text-start hover:bg-gray-100">
              Change Password
            </button>
            <button className="dropdown-item px-4 py-2 text-dark w-100 text-start hover:bg-gray-100">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
