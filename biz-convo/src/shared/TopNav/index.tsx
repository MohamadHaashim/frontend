import React, { useEffect, useState } from 'react';
import Userimg from "../../assets/img/team-2.jpg"
import Userimg1 from "../../assets/img/small-logos/logo-spotify.svg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginAPI from '../../api/services/loginApi';
import { toast } from 'react-toastify';
import { baseURL } from '../../api/api';
import noImage from '../../assets/img/no_Image.png';
import "./index.css";
import VendorAPI from '../../api/services/vendorLogin/vendorApi';
function TopNav() {
   const navigate = useNavigate();
   const location = useLocation();
   
   const handleBacktoSadmin = (e: any) => {
      e.preventDefault();
      navigate("/super-admin/dashboard", { replace: true });
   };
function formatBadgeValue(count:any) {
  return count > 99 ? "99+" : count;
}
   const profileImage=sessionStorage.getItem('profileImage');
   const isValidImage = profileImage && 
   profileImage.trim() !== "" &&
   profileImage.trim().toLowerCase() !== "null" && profileImage.trim().toLowerCase() !== "undefined";

   const imageSrc = isValidImage
   ? `${baseURL}${profileImage}`
   : noImage;

   const handleLogout = async () => {
      try {
         const responseData = await LoginAPI.logoutAPI();
         if (responseData.apiStatus.code === '200') {
            toast.success(responseData.apiStatus.message);
            navigate("/")
            const keysToRemove = [
               "userVendorName",
               "vendorToken",
               "wabaAccesstoken",
               "wabacatalogAccesstoken"
           ];
       
           keysToRemove.forEach(key => localStorage.removeItem(key));
           keysToRemove.forEach(key => sessionStorage.removeItem(key));
         } else {
            toast.error(`Logout failed: ${responseData.apiStatus.message}`);
            navigate("/")
         }
      } catch (error) {
         console.error("Error during API call:", error);
         navigate("/")
         toast.error("An error occurred during the logout process.");
      }
   };
   const userVendorName = sessionStorage.getItem("userVendorName")
   const [wappCount, setwappCount] = useState("")
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
//   useEffect(() => {
//    location.pathname.startsWith("/vendor") && handleGetWappCount();
//   const handleEvent = () => {
//     handleGetWappCount();
//   };

//   window.addEventListener('triggerWappCount', handleEvent);

//   return () => {
//     window.removeEventListener('triggerWappCount', handleEvent);
//   };
// }, []);
   // useEffect(() => {
   //    console.log("Teaching_The_Path")
   //    window.scrollTo(0, 0);
   // }, []);
   return (
      <>
         <nav className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl my-2 ms-4" id="navbarBlur" navbar-scroll="true">
            <div className="container-fluid py-1">
               <div className="ms-md-auto d-flex align-items-center">
                  <div className="input-group custom-input-group">
                     <span className="input-group-text text-body transparent"><i className="fas fa-search transparent" aria-hidden="true"></i></span>
                     <input type="text" className="form-control transparent no-focus-borde input-disable" placeholder=""  disabled />
                  </div> 
               </div>
               <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                  <div className="ms-md-auto d-flex align-items-center">
                  {/*
                  <div class="input-group">
                     <span class="input-group-text text-body"><i class="fas fa-search" aria-hidden="true"></i></span>
                     <input type="text" class="form-control" placeholder="Type here..."/>
                  </div>
                  */}
                  </div>
                  <ul className="navbar-nav  justify-content-end">
                     <li className="nav-item dropdown notification-bell pe-2 d-flex align-items-center">
                       
                       {/*Whatsapp notify icon*/ }

                        {/* <Link to={"/vendor/whatapp-chat"} className="nav-link text-body p-0" id="dropdownMenuButton">
                           <i className="fa-brands fa-whatsapp navbar-notification-icon cursor-pointer whatsapp-notification"></i>{wappCount ? <span className="notification-whatsapp-badge">{formatBadgeValue(wappCount)}</span>:<></>}
                        </Link> */}
                        {/* <button aria-label="Chat on WhatsApp" id="whatsapp-btn">
                           <div id="notification-badge">
                              <span className="ping"></span>
                              <span className="count">1</span>
                           </div>

                           <svg
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              height="24"
                              width="24"
                              xmlns="http://www.w3.org/2000/svg"
                           >
                              <path
                                 d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"
                              ></path>
                           </svg>

                           <span id="pulse-ring"></span>
                        </button> */}
                        <a href="javascript:;" className="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                           {/* <i className="navbar-notification-icon fa-regular fa-bell cursor-pointer"></i> */}
                           <i className="navbar-notification-icon fa-regular fa-bell-slash cursor-pointer"></i>
                        </a>
                        <ul className="dropdown-menu  dropdown-menu-end  px-1 py-1 me-sm-n4" aria-labelledby="dropdownMenuButton">
                           <li className="mb-2">
                              <Link className="dropdown-item border-radius-md" to={""}>
                                 <div className="d-flex py-1">
                                    <div>
                                        {/* <img src={Userimg} className="avatar avatar-sm  me-3 " /> */}
                                        <i className="fa-solid fa-ban p-0"></i>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                       <h6 className="text-sm font-weight-normal mb-1">
                                          <span className="font-weight-bold mx-2"> No notification</span>
                                          {/* <span className="font-weight-bold">New message</span> from Laur */}
                                       </h6>
                                       {/* <p className="text-xs text-secondary mb-0 ">
                                          <i className="fa fa-clock me-1"></i>
                                          13 minutes ago
                                       </p> */}
                                    </div>
                                 </div>
                              </Link>
                           </li>
                        </ul>
                     </li>
                     <li>
                        <div className="dropdown sadmin-content" >
                           <button className="dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                              <img
                                 src={imageSrc}
                                 alt="Profile"
                                 className="profile-navbar-img"
                              /> <span className="MuiTypography-root MuiTypography-button css-1w3klud nav-user-name">
                                 {userVendorName}
                              </span>
                           </button>
                           <ul className="dropdown-menu vendor-dropdown" aria-labelledby="dropdownMenuButton1">

                              <li>
                                 <Link className="dropdown-item pl-3" to={"/vendor/profile"}>
                                    <i className="fa-solid fa-user-tie"></i> <span className='ms-1'>My Profile</span>
                                 </Link>
                              </li>
                              {/* <li>
                                 <Link className="dropdown-item" to={"#"}>
                                    <i className="fa fa-cog me-2"></i>Settings
                                 </Link>
                              </li> */}
                              <li >
                                 <Link className="dropdown-item" onClick={handleLogout} to={""}>
                                    <i className="fa fa-sign-out-alt me-2"></i>Logout
                                 </Link>
                              </li>
                           </ul>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>
         </nav>
      </>
   );
}
export default TopNav;