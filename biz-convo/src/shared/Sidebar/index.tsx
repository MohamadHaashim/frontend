import React, { useEffect, useState } from 'react'
import Navlogo from "../../assets/img/bizconvo-logo.png"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginAPI from '../../api/services/superAdminLogin/superAdmin';
import { toast } from 'react-toastify';
import VendorAPI from '../../api/services/vendorLogin/vendorApi';

function Sidebar() {
  const [wappCount, setwappCount] = useState("");
  const [isEnabled, setisEnabled] = useState("");
  const handleGetWappCount = () => {
    VendorAPI.sideListWappAPI()
        .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
            setwappCount(responseData?.responseData?.totalRecordCount);
            console.log(responseData,"Respo")
          }
          else if(responseData?.apiStatus?.code==="404") {
            setwappCount("")
          }
        })
        .catch((error: any) => {
          console.error("Error during login:", error);
        });
  };
  const handlecatalogEnabled = () => {
    VendorAPI.catalogEnabled()
        .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
            setisEnabled(responseData?.responseData?.is_enabled);
            console.log(responseData,"Respo")
          }
          else if(responseData?.apiStatus?.code==="404") {
            setisEnabled("")
          }
        })
        .catch((error: any) => {
          console.error("Error during login:", error);
        });
  };
  useEffect(() => {
    location.pathname.startsWith("/vendor") && (() => {
  handleGetWappCount();
  handlecatalogEnabled();
})();

  const handleEvent = () => {
    handleGetWappCount();
  };

  window.addEventListener('triggerWappCount', handleEvent);

  return () => {
    window.removeEventListener('triggerWappCount', handleEvent);
  };
}, []);

const location = useLocation();
  const isWhatsAppChatRoute = location.pathname === "/vendor/whatapp-chat";
 
  const [isSidebarOpen, setSidebarOpen] = useState(() => !isWhatsAppChatRoute);
  useEffect(() => {
  const appElement = document.querySelector(".App") as HTMLElement | null;
  const isChat = isWhatsAppChatRoute;

  setSidebarOpen(!isChat);

  if (appElement) {
    appElement.style.overflowY = isChat ? "visible" : "auto";
  }
}, [location.pathname]);

  const [superadminSidebar, setsuperadminSidebar] = useState(["/super-admin/dashboard", "/super-admin/vendor-management", "/super-admin/profile", "/super-admin/general"].includes(location.pathname));
  const isChatBotRoute = ["/vendor/chat-bot", "/vendor/chat-bot/flow"].includes(location.pathname);
  const isStoreRoute = ["/vendor/store", "/vendor/staff"].includes(location.pathname);
  const isContentHubRoute = ["/vendor/sms-template", "/vendor/whatsapp-template","/vendor/create-sms","/vendor/create-whatsapp-template","/vendor/edit-whatsapp-template","/vendor/edit-sms"].some(path => location.pathname.startsWith(path))
  const isContactRoute = ["/vendor/contacts", "/vendor/contacts/groups","/vendor/contacts/custom-fields","/vendor/groupcontacts"].includes(location.pathname);
  const isPromotionRoute = ["/vendor/sms/campaign", "/vendor/campaign", "/vendor/campaign/dashboard","/vendor/sms-campaign/dashboard","/vendor/smscampaign-create","/vendor/create-campaign","/vendor/settings/custom-campaign"].some(path => location.pathname.startsWith(path));
  const isSettingsRoute = ["/vendor/settings/general", "/vendor/settings/whatsapp","/vendor/settings/sms","/vendor/settings/catalog","/vendor/settings/catalog/bot"].includes(location.pathname);
  const isCatalogRoute = ["/vendor/catalog/details", "/vendor/catalog/product/details","/vendor/catalog/orders","/vendor/catalog/product/create","/vendor/catalog/product/edit"].some(path => location.pathname.startsWith(path));
  const [isDropdownOpen, setDropdownOpen] = useState(isStoreRoute);
  const [isDropdownOpen1, setDropdownOpen1] = useState(isContentHubRoute);
  const [isDropdownOpen2, setDropdownOpen2] = useState(isContactRoute);
  const [isDropdownOpen3, setDropdownOpen3] = useState(isChatBotRoute);
  const [isDropdownOpen4, setDropdownOpen4] = useState(isSettingsRoute);
  const [isDropdownOpen5, setDropdownOpen5] = useState(isPromotionRoute);
  const [isDropdownOpen6, setDropdownOpen6] = useState(isCatalogRoute);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  const toggleDropdown1 = () => {
    setDropdownOpen1(!isDropdownOpen1);
  };
  const toggleDropdown2 = () => {
    setDropdownOpen2(!isDropdownOpen2);
  };
  const toggleDropdown3 = () => {
    setDropdownOpen3(!isDropdownOpen3);
  };
  const toggleDropdown4 = () => {
    setDropdownOpen4(!isDropdownOpen4);
  };
  const toggleDropdown5 = () => {
    setDropdownOpen5(!isDropdownOpen5);
  };
  const toggleDropdown6 = () => {
    setDropdownOpen6(!isDropdownOpen6);
  };

 
  useEffect(() => {
    const validRoutes = ["/vendor/store", "/vendor/staff"];
    const validRoutes1 = ["/vendor/sms-template", "/vendor/whatsapp-template","/vendor/create-sms","/vendor/create-whatsapp-template","/vendor/edit-whatsapp-template","/vendor/edit-sms"];
    const validRoutes2 = ["/vendor/contacts", "/vendor/contacts/groups","/vendor/contacts/custom-fields","/vendor/groupcontacts"];
    const validRoutes3 = ["/vendor/chat-bot", "/vendor/chat-bot/flow"];
    const validRoutes4 = ["/vendor/settings/general", "/vendor/settings/whatsapp","/vendor/settings/sms","/vendor/settings/catalog","/vendor/settings/catalog/bot"];
    const validRoutes5 = ["/vendor/sms/campaign", "/vendor/campaign","/vendor/campaign/dashboard","/vendor/sms-campaign/dashboard","/vendor/smscampaign-create","/vendor/create-campaign","/vendor/settings/custom-campaign"];
    const validRoutes6 = ["/vendor/catalog/details", "/vendor/catalog/product/details","/vendor/catalog/orders","/vendor/catalog/product/create","/vendor/catalog/product/edit","/vendor/catalog/product/images","/vendor/catalog/product/images"];
    const allowedPaths = [
  "/vendor/catalog/product/create",
  "/vendor/catalog/product/details",
  "/vendor/catalog/product/edit",
];

const isAllowed = allowedPaths.some((path) =>
  location.pathname.startsWith(path)
);

if (!isAllowed) {
  localStorage.removeItem("catalogId");
}

    if (location.pathname !== "/vendor/catalog/orders") {
      localStorage.removeItem("catalogId1");
    }

    if (validRoutes.includes(location.pathname)) {
      setDropdownOpen(true);
    }else if (validRoutes1.some(path => location.pathname.startsWith(path))) {
      setDropdownOpen1(true);
    }else if (validRoutes2.includes(location.pathname)) {
      setDropdownOpen2(true);
    }else if (validRoutes3.includes(location.pathname)) {
      setDropdownOpen3(true);
    }else if (validRoutes4.includes(location.pathname)) {
      setDropdownOpen4(true);
    }else if (validRoutes5.some(path => location.pathname.startsWith(path))) {
      setDropdownOpen5(true);
    }else if (validRoutes6.some(path => location.pathname.startsWith(path))) {
      setDropdownOpen6(true);
    }
    else{
      setDropdownOpen(false);
      setDropdownOpen1(false);
      setDropdownOpen2(false);
      setDropdownOpen3(false);
      setDropdownOpen4(false);
      setDropdownOpen5(false);
      setDropdownOpen6(false);
    }
    
  }, [location.pathname]);
   // log out
   const navigate = useNavigate();
   const superAdminLogout = async () => {
 
     try {
 
       const responseData = await LoginAPI.signOutAPI();
       if (responseData.apiStatus.code === '200') {
         toast.success(responseData.apiStatus.message);
         navigate("/super-admin/sign-in")
         const keysToRemove = [
           "superAdminToken",
           "userName",
       ];
   
       keysToRemove.forEach(key => localStorage.removeItem(key));
       } else {
         toast.error(`Logout failed: ${responseData.apiStatus.message}`);
         navigate("/super-admin/sign-in")
       }
     } catch (error) {
       console.error("Error during API call:", error);
       navigate("/super-admin/sign-in")
       toast.error("An error occurred during the logout process.");
     }
   };
   
  return (
    <>
      {/* <button className="z-1 mt-n1 sidebar-toggle-btn d-lg-none" onClick={toggleSidebar}>
        <i className="fa-solid fa-bars-staggered text-dark"></i>
      </button> */}
{(!isSidebarOpen || isWhatsAppChatRoute) && (
      <div>
        <button
        className="z-1 mt-n1 sidebar-toggle-btn border-0 bg-transparent"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        style={{fontSize:"24px",position:"absolute",top:"25px",left:"25px"}}
      >
        <i className="fa-solid fa-bars-staggered text-dark"></i>
      </button>
      </div>
    )}

    {(!isWhatsAppChatRoute || isSidebarOpen) && (
      <aside className={`sidenav navbar  navbar-vertical navbar-expand-xs border-0  fixed-start bg-white 
        ${isSidebarOpen ? "show-sidebar" : "hide-sidebar"}`} id="sidenav-main">
        <div className="sidenav-header">
          <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-xl-none"
            aria-hidden="true" onClick={toggleSidebar}></i>
          <a><img className="logo" src={Navlogo} /></a>
        </div>
        <hr className="horizontal dark mt-0" />
        <div className="collapse navbar-collapse  w-auto sidenav-scrollbar" id="sidenav-collapse-main ">
          {superadminSidebar ?
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/super-admin/dashboard' ? 'active' : ''}`} to={"/super-admin/dashboard"}>
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="12px" height="12px" viewBox="0 0 45 40" version="1.1">
                      <title>shop </title>
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g transform="translate(-1716.000000, -439.000000)" fill="#FFFFFF" fill-rule="nonzero">
                          <g transform="translate(1716.000000, 291.000000)">
                            <g transform="translate(0.000000, 148.000000)">
                              <path className="color-background opacity-6" d="M46.7199583,10.7414583 L40.8449583,0.949791667 C40.4909749,0.360605034 39.8540131,0 39.1666667,0 L7.83333333,0 C7.1459869,0 6.50902508,0.360605034 6.15504167,0.949791667 L0.280041667,10.7414583 C0.0969176761,11.0460037 -1.23209662e-05,11.3946378 -1.23209662e-05,11.75 C-0.00758042603,16.0663731 3.48367543,19.5725301 7.80004167,19.5833333 L7.81570833,19.5833333 C9.75003686,19.5882688 11.6168794,18.8726691 13.0522917,17.5760417 C16.0171492,20.2556967 20.5292675,20.2556967 23.494125,17.5760417 C26.4604562,20.2616016 30.9794188,20.2616016 33.94575,17.5760417 C36.2421905,19.6477597 39.5441143,20.1708521 42.3684437,18.9103691 C45.1927731,17.649886 47.0084685,14.8428276 47.0000295,11.75 C47.0000295,11.3946378 46.9030823,11.0460037 46.7199583,10.7414583 Z"></path>
                              <path className="color-background" d="M39.198,22.4912623 C37.3776246,22.4928106 35.5817531,22.0149171 33.951625,21.0951667 L33.92225,21.1107282 C31.1430221,22.6838032 27.9255001,22.9318916 24.9844167,21.7998837 C24.4750389,21.605469 23.9777983,21.3722567 23.4960833,21.1018359 L23.4745417,21.1129513 C20.6961809,22.6871153 17.4786145,22.9344611 14.5386667,21.7998837 C14.029926,21.6054643 13.533337,21.3722507 13.0522917,21.1018359 C11.4250962,22.0190609 9.63246555,22.4947009 7.81570833,22.4912623 C7.16510551,22.4842162 6.51607673,22.4173045 5.875,22.2911849 L5.875,44.7220845 C5.875,45.9498589 6.7517757,46.9451667 7.83333333,46.9451667 L19.5833333,46.9451667 L19.5833333,33.6066734 L27.4166667,33.6066734 L27.4166667,46.9451667 L39.1666667,46.9451667 C40.2482243,46.9451667 41.125,45.9498589 41.125,44.7220845 L41.125,22.2822926 C40.4887822,22.4116582 39.8442868,22.4815492 39.198,22.4912623 Z"></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span className="nav-link-text trxt ms-1">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${location.pathname === '/super-admin/vendor-management' ? 'active' : ''}`} to={"/super-admin/vendor-management"}>
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="12px" height="12px" viewBox="0 0 42 42" version="1.1" >
                      <title>office</title>
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                        <g transform="translate(-1869.000000, -293.000000)" fill="#FFFFFF" fill-rule="nonzero">
                          <g transform="translate(1716.000000, 291.000000)">
                            <g id="office" transform="translate(153.000000, 2.000000)">
                              <path className="color-background opacity-6" d="M12.25,17.5 L8.75,17.5 L8.75,1.75 C8.75,0.78225 9.53225,0 10.5,0 L31.5,0 C32.46775,0 33.25,0.78225 33.25,1.75 L33.25,12.25 L29.75,12.25 L29.75,3.5 L12.25,3.5 L12.25,17.5 Z"></path>
                              <path className="color-background" d="M40.25,14 L24.5,14 C23.53225,14 22.75,14.78225 22.75,15.75 L22.75,38.5 L19.25,38.5 L19.25,22.75 C19.25,21.78225 18.46775,21 17.5,21 L1.75,21 C0.78225,21 0,21.78225 0,22.75 L0,40.25 C0,41.21775 0.78225,42 1.75,42 L40.25,42 C41.21775,42 42,41.21775 42,40.25 L42,15.75 C42,14.78225 41.21775,14 40.25,14 Z M12.25,36.75 L7,36.75 L7,33.25 L12.25,33.25 L12.25,36.75 Z M12.25,29.75 L7,29.75 L7,26.25 L12.25,26.25 L12.25,29.75 Z M35,36.75 L29.75,36.75 L29.75,33.25 L35,33.25 L35,36.75 Z M35,29.75 L29.75,29.75 L29.75,26.25 L35,26.25 L35,29.75 Z M35,22.75 L29.75,22.75 L29.75,19.25 L35,19.25 L35,22.75 Z"></path>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <span className="nav-link-text ms-1">Vendor Management</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`cursor-pointer nav-link ${["/super-admin/general"].includes(location.pathname)
                  ? "active"
                  : ""}`}
                  onClick={toggleDropdown} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="15px" height="15px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8l-.7 0c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 
              10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9
               16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5
                9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
                  </div>
                  <span className="nav-link-text ms-1">Configuration</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen ? "up" : "down"
                      } `}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/super-admin/general" ? "active" : ""
                        }`}
                      to={"/super-admin/general"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12px"
                          height="12px"
                          viewBox="0 0 576 512"
                        >
                          <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z" />
                        </svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">General</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link onClick={superAdminLogout} className={`nav-link`} to={""}>
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="12px" height="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" /></svg>
                  </div>
                  <span className="nav-link-text ms-1">Logout</span>
                </Link>
              </li>
            </ul>
            :
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/vendor/dashboard" ? "active" : ""
                    }`}
                  to={"/vendor/dashboard"}
                >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12px"
                      height="12px"
                      viewBox="0 0 512 512"
                    >
                      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM256 416c35.3 0 64-28.7 64-64c0-17.4-6.9-33.1-18.1-44.6L366 161.7c5.3-12.1-.2-26.3-12.3-31.6s-26.3 .2-31.6 12.3L257.9 288c-.6 0-1.3 0-1.9 0c-35.3 0-64 28.7-64 64s28.7 64 64 64zM176 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm352-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
                    </svg>
                  </div>
                  <span className="nav-link-text trxt ms-1">Dashboard</span>
                </Link>
              </li>
              <li className="nav-item position-relative">
                <Link
                className={`nav-link ${["/vendor/whatapp-chat"].some(path => {
                  const isActive = location.pathname.startsWith(path);
                  return isActive;
                }) ? "active" : ""}`}
                  to={"/vendor/whatapp-chat"}
                >
                  {wappCount ? <span className='whatschat-count'>{wappCount}</span>:<></>}
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                  </div>
                  <span className="nav-link-text trxt ms-1">WhatsApp Chat</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link className={`cursor-pointer nav-link ${["/vendor/store", "/vendor/staff"].includes(location.pathname)
                  ? "active"
                  : ""}`}
                  onClick={toggleDropdown} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12px"
                      height="12px"
                      viewBox="0 0 640 512"
                    >
                      <path d="M36.8 192l566.3 0c20.3 0 36.8-16.5 36.8-36.8c0-7.3-2.2-14.4-6.2-20.4L558.2 21.4C549.3 8 534.4 0 518.3 0L121.7 0c-16 0-31 8-39.9 21.4L6.2 134.7c-4 6.1-6.2 13.2-6.2 20.4C0 175.5 16.5 192 36.8 192zM64 224l0 160 0 80c0 26.5 21.5 48 48 48l224 0c26.5 0 48-21.5 48-48l0-80 0-160-64 0 0 160-192 0 0-160-64 0zm448 0l0 256c0 17.7 14.3 32 32 32s32-14.3 32-32l0-256-64 0z" />
                    </svg>
                  </div>
                  <span className="nav-link-text ms-1">Store Management</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen ? "up" : "down"
                      } `}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/store" ? "active" : ""
                        }`}
                      to={"/vendor/store"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12px"
                          height="12px"
                          viewBox="0 0 576 512"
                        >
                          <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0L109.6 0C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9c0 0 0 0-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3L448 384l-320 0 0-133.4c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3L64 384l0 64c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-64 0-131.4c-4 1-8 1.8-12.3 2.3z" />
                        </svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">Stores</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/vendor/staff" ? "active" : ""
                        }`}
                      to={"/vendor/staff"}
                    >
                      <div className="icon icon-shape icon-sm shadow vendorsidebar-child border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12px"
                          height="12px"
                          viewBox="0 0 640 512"
                        >
                          <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" />
                        </svg>
                      </div>
                      <span className="nav-link-text ms-1">Staffs</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link
                  className={`cursor-pointer nav-link ${["/vendor/sms-template", "/vendor/whatsapp-template", "/vendor/create-sms", "/vendor/create-whatsapp-template","/vendor/edit-whatsapp-template","/vendor/edit-sms"]
                    .some(path => {
                    const isActive = location.pathname.startsWith(path);
                    return isActive;
                  })
                    ? "active"
                    : ""}`}
                  onClick={toggleDropdown1} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      width="12px"
                      height="12px"
                    >
                      <path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z" />
                    </svg>{" "}
                  </div>
                  <span className="nav-link-text ms-1">Content Hub</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen1 ? "up" : "down"
                      }`}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen1 ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link  ${["/vendor/sms-template", "/vendor/create-sms","/vendor/edit-sms"]
                        .some(path => {
                          const isActive = location.pathname.startsWith(path);
                          return isActive;
                        })
                        ? "active" : ""
                        }`}
                      to={"/vendor/sms-template"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12px"
                          height="12px"
                          viewBox="0 0 512 512"
                        >
                          <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z" />
                        </svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">Sms</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${["/vendor/whatsapp-template", "/vendor/create-whatsapp-template","/vendor/edit-whatsapp-template"]
                        .some(path => {
                          const isActive = location.pathname.startsWith(path);
                          return isActive;
                        })
                        ? "active" : ""
                        }`}
                      to={"/vendor/whatsapp-template"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                      </div>
                      <span className="nav-link-text ms-1">WhatsApp</span>
                    </Link>
                  </li>
                </ul>
              </li>
              {isEnabled && (
              <li className="nav-item">
                <Link
                  className={`cursor-pointer nav-link ${["/vendor/catalog/details", "/vendor/catalog/product/details","/vendor/catalog/orders","/vendor/catalog/product/create","/vendor/catalog/product/edit","/vendor/catalog/product/images"]
                    .some(path => {
                    const isActive = location.pathname.startsWith(path);
                    return isActive;
                  }) ? "active" : ""}`}
                  onClick={toggleDropdown6} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 32C0 14.3 14.3 0 32 0L160 0c17.7 0 32 14.3 32 32l0 384c0 53-43 96-96 96s-96-43-96-96L0 32zM223.6 425.9c.3-3.3 .4-6.6 .4-9.9l0-262 75.4-75.4c12.5-12.5 32.8-12.5 45.3 0l90.5 90.5c12.5 12.5 12.5 32.8 0 45.3L223.6 425.9zM182.8 512l192-192L480 320c17.7 0 32 14.3 32 32l0 128c0 17.7-14.3 32-32 32l-297.2 0zM128 64L64 64l0 64 64 0 0-64zM64 192l0 64 64 0 0-64-64 0zM96 440a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>                     {" "}
                  </div>
                  <span className="nav-link-text ms-1 grayFont">Catalog Management</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen6 ? "up" : "down"
                      }`}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen6 ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link  ${["/vendor/catalog/details"].includes(location.pathname) ? "active" : ""
                        }`}
                      to={"/vendor/catalog/details"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                      <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z"/></svg>                      
                      </div>
                      <span className="nav-link-text trxt ms-1 grayFont">Catalog</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link  ${["/vendor/catalog/product/details","/vendor/catalog/product/create","/vendor/catalog/product/edit"]
                        .some(path => {
                    const isActive = location.pathname.startsWith(path);
                    return isActive;
                  }) ? "active" : ""}`}
                      to={"/vendor/catalog/product/details"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64l0 48-128 0 0-48zm-48 48l-64 0c-26.5 0-48 21.5-48 48L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-208c0-26.5-21.5-48-48-48l-64 0 0-48C336 50.1 285.9 0 224 0S112 50.1 112 112l0 48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1 grayFont">Product</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link  ${["/vendor/catalog/product/images"]
                        .some(path => {
                    const isActive = location.pathname.startsWith(path);
                    return isActive;
                  }) ? "active" : ""}`}
                      to={"/vendor/catalog/product/images"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17px" height="17px" viewBox="0 0 640 640"><path d="M128 160C128 124.7 156.7 96 192 96L512 96C547.3 96 576 124.7 576 160L576 416C576 451.3 547.3 480 512 480L192 480C156.7 480 128 451.3 128 416L128 160zM56 192C69.3 192 80 202.7 80 216L80 512C80 520.8 87.2 528 96 528L456 528C469.3 528 480 538.7 480 552C480 565.3 469.3 576 456 576L96 576C60.7 576 32 547.3 32 512L32 216C32 202.7 42.7 192 56 192zM224 224C241.7 224 256 209.7 256 192C256 174.3 241.7 160 224 160C206.3 160 192 174.3 192 192C192 209.7 206.3 224 224 224zM420.5 235.5C416.1 228.4 408.4 224 400 224C391.6 224 383.9 228.4 379.5 235.5L323.2 327.6L298.7 297C294.1 291.3 287.3 288 280 288C272.7 288 265.8 291.3 261.3 297L197.3 377C191.5 384.2 190.4 394.1 194.4 402.4C198.4 410.7 206.8 416 216 416L488 416C496.7 416 504.7 411.3 508.9 403.7C513.1 396.1 513 386.9 508.4 379.4L420.4 235.4z"/></svg>                      
                      </div>
                      <span className="nav-link-text trxt ms-1 grayFont">Product Images</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${["/vendor/catalog/orders"].includes(location.pathname) ? "active" : ""
                        }`}
                      to={"/vendor/catalog/orders"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M24 0C10.7 0 0 10.7 0 24S10.7 48 24 48l45.5 0c3.8 0 7.1 2.7 7.9 6.5l51.6 271c6.5 34 36.2 58.5 70.7 58.5L488 384c13.3 0 24-10.7 24-24s-10.7-24-24-24l-288.3 0c-11.5 0-21.4-8.2-23.6-19.5L170.7 288l288.5 0c32.6 0 61.1-21.8 69.5-53.3l41-152.3C576.6 57 557.4 32 531.1 32L360 32l0 102.1 23-23c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-64 64c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l23 23L312 32 120.1 32C111 12.8 91.6 0 69.5 0L24 0zM176 512a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm336-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z"/></svg>                      </div>
                      <span className="nav-link-text ms-1 grayFont">Order</span>
                    </Link>
                  </li>
                </ul>
              </li>)}

              <li className="nav-item">
                <Link
                  className={`cursor-pointer nav-link ${["/vendor/contacts", "/vendor/contacts/groups","/vendor/groupcontacts","/vendor/contacts/custom-fields"].includes(location.pathname)
                    ? "active"
                    : ""}`}
                  onClick={toggleDropdown2} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12px"
                      height="12px"
                      viewBox="0 0 512 512"
                    >
                      <path d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM208 288l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z" />
                    </svg>
                  </div>
                  <span className="nav-link-text ms-1">Contact</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen2 ? "up" : "down"
                      }`}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen2 ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${["/vendor/contacts","/vendor/groupcontacts"].includes(location.pathname)
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/contacts"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12px"
                          height="12px"
                          viewBox="0 0 640 512"
                        >
                          <path d="M64 64a64 64 0 1 1 128 0A64 64 0 1 1 64 64zM25.9 233.4C29.3 191.9 64 160 105.6 160l44.8 0c27 0 51 13.4 65.5 34.1c-2.7 1.9-5.2 4-7.5 6.3l-64 64c-21.9 21.9-21.9 57.3 0 79.2L192 391.2l0 72.8c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-115.7c-26.5-9.5-44.7-35.8-42.2-65.6l4.1-49.3zM448 64a64 64 0 1 1 128 0A64 64 0 1 1 448 64zM431.6 200.4c-2.3-2.3-4.9-4.4-7.5-6.3c14.5-20.7 38.6-34.1 65.5-34.1l44.8 0c41.6 0 76.3 31.9 79.7 73.4l4.1 49.3c2.5 29.8-15.7 56.1-42.2 65.6L576 464c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-72.8 47.6-47.6c21.9-21.9 21.9-57.3 0-79.2l-64-64zM272 240l0 32 96 0 0-32c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l64 64c9.4 9.4 9.4 24.6 0 33.9l-64 64c-6.9 6.9-17.2 8.9-26.2 5.2s-14.8-12.5-14.8-22.2l0-32-96 0 0 32c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-64-64c-9.4-9.4-9.4-24.6 0-33.9l64-64c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2z" />
                        </svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Customer Details
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/contacts/groups"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/contacts/groups"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12px"
                          height="12px"
                          viewBox="0 0 640 512"><path d="M72 88a56 56 0 1 1 112 0A56 56 0 1 1 72 88zM64 245.7C54 256.9 48 271.8 48 288s6 31.1 16 42.3l0-84.7zm144.4-49.3C178.7 222.7 160 261.2 160 304c0 34.3 12 65.8 32 90.5l0 21.5c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-26.8C26.2 371.2 0 332.7 0 288c0-61.9 50.1-112 112-112l32 0c24 0 46.2 7.5 64.4 20.3zM448 416l0-21.5c20-24.7 32-56.2 32-90.5c0-42.8-18.7-81.3-48.4-107.7C449.8 183.5 472 176 496 176l32 0c61.9 0 112 50.1 112 112c0 44.7-26.2 83.2-64 101.2l0 26.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32zm8-328a56 56 0 1 1 112 0A56 56 0 1 1 456 88zM576 245.7l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM320 32a64 64 0 1 1 0 128 64 64 0 1 1 0-128zM240 304c0 16.2 6 31 16 42.3l0-84.7c-10 11.3-16 26.1-16 42.3zm144-42.3l0 84.7c10-11.3 16-26.1 16-42.3s-6-31.1-16-42.3zM448 304c0 44.7-26.2 83.2-64 101.2l0 42.8c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-42.8c-37.8-18-64-56.5-64-101.2c0-61.9 50.1-112 112-112l32 0c61.9 0 112 50.1 112 112z" /></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Groups
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/contacts/custom-fields"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/contacts/custom-fields"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12px"
                          height="12px" viewBox="0 0 512 512"><path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg></div>
                      <span className="nav-link-text trxt ms-1">
                        Custom Fields
                      </span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${["/vendor/campaign","/vendor/sms/campaign", "/vendor/campaign/dashboard", "/vendor/create-campaign", "/vendor/campaign/create/new", "/vendor/contact/whatsapp/contact/","/vendor/smscampaign-create","/vendor/sms-reportcampaign/dashboard","/vendor/sms-campaign/dashboard","/vendor/settings/custom-campaign"].some(path => {
                    const isActive = location.pathname.startsWith(path);
                    return isActive;
                  }) ? "active" : ""}`}
                  onClick={toggleDropdown5} to={''}
                >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="12px" height="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M480 32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9L381.7 53c-48 48-113.1 75-181 75l-8.7 0-32 0-96 0c-35.3 0-64 28.7-64 64l0 96c0 35.3 28.7 64 64 64l0 128c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-128 8.7 0c67.9 0 133 27 181 75l43.6 43.6c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-147.6c18.6-8.8 32-32.5 32-60.4s-13.4-51.6-32-60.4L480 32zm-64 76.7L416 240l0 131.3C357.2 317.8 280.5 288 200.7 288l-8.7 0 0-96 8.7 0c79.8 0 156.5-29.8 215.3-83.3z" /></svg>
                  </div>
                  <span className="nav-link-text trxt ms-1">Promotion Management</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen5 ? "up" : "down"
                      }`}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen5 ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${["/vendor/sms/campaign","/vendor/smscampaign-create","/vendor/sms-reportcampaign/dashboard","/vendor/sms-campaign/dashboard"].some(path => {
                        const isActive = location.pathname.startsWith(path);
                        return isActive;})
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/sms/campaign"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12px"
                          height="12px"
                          viewBox="0 0 512 512"
                        >
                          <path d="M64 0C28.7 0 0 28.7 0 64L0 352c0 35.3 28.7 64 64 64l96 0 0 80c0 6.1 3.4 11.6 8.8 14.3s11.9 2.1 16.8-1.5L309.3 416 448 416c35.3 0 64-28.7 64-64l0-288c0-35.3-28.7-64-64-64L64 0z" />
                        </svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        SMS
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                     className={`nav-link ${["/vendor/campaign","/vendor/campaign/create/new","/vendor/create-campaign"].some(path => {
                      const isActive = location.pathname.startsWith(path);
                      return isActive;
                    })
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/campaign"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                      <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Whatsapp
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/settings/custom-campaign"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/custom-campaign"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width='13' height='13'><path d="M560 160A80 80 0 1 0 560 0a80 80 0 1 0 0 160zM55.9 512l325.2 0 75 0 122.8 0c33.8 0 61.1-27.4 61.1-61.1c0-11.2-3.1-22.2-8.9-31.8l-132-216.3C495 196.1 487.8 192 480 192s-15 4.1-19.1 10.7l-48.2 79L286.8 81c-6.6-10.6-18.3-17-30.8-17s-24.1 6.4-30.8 17L8.6 426.4C3 435.3 0 445.6 0 456.1C0 487 25 512 55.9 512z"/></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Custom Campaign
                      </span>
                    </Link>
                  </li>
                </ul>
              </li>
              
              <li className="nav-item">
                <Link
                  className={`cursor-pointer nav-link ${["/vendor/chat-bot", "/vendor/chat-bot/flow"].includes(location.pathname)
                    ? "active"
                    : ""}`}
                  onClick={toggleDropdown3} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width='13' height='13' viewBox="0 0 640 512"><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z" /></svg>
                  </div>
                  <span className="nav-link-text ms-1">Chat bot</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen3 ? "up" : "down"
                      }`}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen3 ? "d-block" : "d-none"
                    }`}
                >
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/chat-bot"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/chat-bot"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width='12' height='12'>
                          <path d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 
                      96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448
                       416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/>
                        </svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        List
                      </span>
                    </Link>
                  </li>
                  {/* <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/vendor/chat-bot/flow"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/chat-bot/flow"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width='12' height='12'>
                          <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" /></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Flows
                      </span>
                    </Link>
                  </li> */}
                </ul>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === "/Report" ? "active" : ""
                    }`}
                  to={"/Report"}
                >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg width="12px" height="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M160 80c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 352c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-352zM0 272c0-26.5 21.5-48 48-48l32 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48L0 272zM368 96l32 0c26.5 0 48 21.5 48 48l0 288c0 26.5-21.5 48-48 48l-32 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48z" /></svg>
                  </div>
                  <span className="nav-link-text trxt ms-1">Report</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`cursor-pointer nav-link ${["/vendor/settings/general", "/vendor/settings/whatsapp","/vendor/settings/sms","/vendor/settings/catalog","/vendor/settings/catalog/bot"].includes(location.pathname)
                    ? "active"
                    : ""}`}
                  onClick={toggleDropdown4} to={''}              >
                  <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='13' height='13'><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" /></svg>
                  </div>
                  <span className="nav-link-text ms-1">Settings</span>
                  <i
                    className={`font-size-dash-arrow vendor-sidebar-chevron fa-solid fa-chevron-${isDropdownOpen4 ? "up" : "down"
                      }`}
                  ></i>
                </Link>
                <ul
                  className={`nav-dropdown list-group ${isDropdownOpen4 ? "d-block" : "d-none"
                    }`}
                >
                  {/* <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/settings/custom-campaign"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/custom-campaign"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width='13' height='13'><path d="M560 160A80 80 0 1 0 560 0a80 80 0 1 0 0 160zM55.9 512l325.2 0 75 0 122.8 0c33.8 0 61.1-27.4 61.1-61.1c0-11.2-3.1-22.2-8.9-31.8l-132-216.3C495 196.1 487.8 192 480 192s-15 4.1-19.1 10.7l-48.2 79L286.8 81c-6.6-10.6-18.3-17-30.8-17s-24.1 6.4-30.8 17L8.6 426.4C3 435.3 0 445.6 0 456.1C0 487 25 512 55.9 512z"/></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Custom Campaign
                      </span>
                    </Link>
                  </li> */}
                  <li className="nav-item">
                    <Link
                      className={`mt-2 nav-link ${location.pathname === "/vendor/settings/general"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/general"}
                    >
                      <div className="icon icon-shape icon-sm vendorsidebar-child shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='13' height='13'><path d="M256 64c53 0 96 43 96 96s-43 96-96 96s-96 43-96 96s43 96 96 96C150 448 64 362 64 256S150 64 256 64zm0 448A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm32-352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>

                      </div>
                      <span className="nav-link-text trxt ms-1">
                        General
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/vendor/settings/whatsapp"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/whatsapp"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Whatsapp Setup
                      </span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/vendor/settings/sms"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/sms"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                      <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3c0 0 0 0 0 0c0 0 0 0 0 0s0 0 0 0s0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM96 212.8c0-20.3 16.5-36.8 36.8-36.8l19.2 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-19.2 0c-2.7 0-4.8 2.2-4.8 4.8c0 1.6 .8 3.1 2.2 4l29.4 19.6c10.3 6.8 16.4 18.3 16.4 30.7c0 20.3-16.5 36.8-36.8 36.8L112 304c-8.8 0-16-7.2-16-16s7.2-16 16-16l27.2 0c2.7 0 4.8-2.2 4.8-4.8c0-1.6-.8-3.1-2.2-4l-29.4-19.6C102.2 236.7 96 225.2 96 212.8zM372.8 176l19.2 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-19.2 0c-2.7 0-4.8 2.2-4.8 4.8c0 1.6 .8 3.1 2.2 4l29.4 19.6c10.2 6.8 16.4 18.3 16.4 30.7c0 20.3-16.5 36.8-36.8 36.8L352 304c-8.8 0-16-7.2-16-16s7.2-16 16-16l27.2 0c2.7 0 4.8-2.2 4.8-4.8c0-1.6-.8-3.1-2.2-4l-29.4-19.6c-10.2-6.8-16.4-18.3-16.4-30.7c0-20.3 16.5-36.8 36.8-36.8zm-152 6.4L256 229.3l35.2-46.9c4.1-5.5 11.3-7.8 17.9-5.6s10.9 8.3 10.9 15.2l0 96c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48-19.2 25.6c-3 4-7.8 6.4-12.8 6.4s-9.8-2.4-12.8-6.4L224 240l0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-96c0-6.9 4.4-13 10.9-15.2s13.7 .1 17.9 5.6z"/></svg>                      </div>
                      <span className="nav-link-text trxt ms-1">
                        Sms Setup
                      </span>
                    </Link>
                  </li>
                  {isEnabled && (
                    <>
                  <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/vendor/settings/catalog"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/catalog"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                      <svg width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z"/></svg>                      
                      </div>
                      <span className="nav-link-text trxt ms-1 grayFont">
                        Catalog Setup
                      </span>
                    </Link>
                  </li>

                  {/* <li className="nav-item">
                    <Link
                      className={`nav-link ${location.pathname === "/vendor/settings/catalog/bot"
                        ? "active"
                        : ""
                        }`}
                      to={"/vendor/settings/catalog/bot"}
                    >
                      <div className="icon icon-shape vendorsidebar-child icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 576 512"><g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" stroke="none"><path d="M3455 4786 c-37 -17 -70 -52 -84 -89 -7 -18 -11 -138 -11 -323 l0 -294 160 0 161 0 -3 309 c-3 295 -4 311 -24 337 -11 15 -32 37 -46 47 -34 25 -113 32 -153 13z"/><path d="M1284 3741 c-148 -42 -270 -167 -308 -316 -14 -52 -16 -192 -16 -1102 0 -725 3 -1058 11 -1095 28 -131 123 -253 244 -309 83 -40 145 -49 316 -49 l147 0 4 -162 c3 -148 5 -167 27 -212 31 -63 90 -122 150 -149 71 -33 189 -31 256 5 28 15 183 137 345 272 l295 245 497 1 c326 0 515 4 550 11 119 25 221 97 289 202 71 110 69 72 69 1239 0 1152 2 1108 -63 1216 -37 62 -103 127 -167 165 -102 59 -52 57 -1375 56 -1124 0 -1214 -2 -1271 -18z m2158 -969 c40 -25 78 -91 78 -137 0 -39 -35 -106 -68 -130 -27 -20 -43 -20 -892 -20 -849 0 -865 0 -892 20 -33 24 -68 91 -68 130 0 41 36 110 68 131 15 10 43 21 62 25 19 4 404 6 855 6 l820 -2 37 -23z m-482 -694 c50 -34 72 -71 77 -125 5 -65 -26 -120 -87 -150 l-44 -23 -586 0 c-549 0 -588 2 -626 19 -61 28 -89 73 -89 143 0 63 19 97 75 136 l33 22 607 0 607 0 33 -22z"/><path d="M505 3022 c-68 -33 -127 -92 -159 -161 -20 -45 -21 -58 -21 -486 0 -430 0 -441 22 -487 46 -100 137 -170 242 -187 l51 -8 0 678 0 679 -37 0 c-21 0 -65 -13 -98 -28z"/><path d="M4480 2371 l0 -678 51 8 c105 17 196 87 242 187 22 46 22 57 22 487 0 428 -1 441 -21 486 -47 100 -167 189 -256 189 l-38 0 0 -679z"/></g></svg>
                     </div>
                      <span className="nav-link-text trxt ms-1 grayFont">
                        Catalog Bot
                      </span>
                    </Link>
                  </li> */}
                  </>)}
                </ul>
              </li>
            </ul>
          }




        </div>
      </aside>)}
    </>
  )
}

export default Sidebar