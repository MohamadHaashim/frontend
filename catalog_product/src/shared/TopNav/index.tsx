import React, { useEffect } from 'react';
import Userimg from "../../assets/img/YallilogoSun.png"
import Userimg1 from "../../assets/img/small-logos/logo-spotify.svg";
import { Link, useNavigate } from 'react-router-dom';
import LoginAPI from '../../api/services/loginApi';
import { toast } from 'react-toastify';
import { baseURL } from '../../api/api';
import noImage from '../../assets/img/no_Image.png';
function TopNav() {
   const navigate = useNavigate();
   const handleBacktoSadmin = (e: any) => {
      e.preventDefault();
      navigate("/super-admin/dashboard", { replace: true });
   };

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
   useEffect(() => {
      window.scrollTo(0, 0);
   }, []);
   return (
      <>
         <nav className="navbar navbar-main navbar-expand-lg px-0 shadow-none border-radius-xl my-2 ms-4" id="navbarBlur" navbar-scroll="true">
            <div className="container-fluid py-1">
               <div className="ms-md-auto d-flex align-items-center">
                  <div className="input-group">
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
                        <a href="javascript:;" className="nav-link text-body p-0" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                           <i className="navbar-notification-icon fa-regular fa-bell-slash cursor-pointer"></i>
                        </a>
                        <ul className="dropdown-menu  dropdown-menu-end  px-1 py-1 me-sm-n4" aria-labelledby="dropdownMenuButton">
                           <li className="mb-2">
                              <a className="dropdown-item border-radius-md" href="javascript:;">
                                 <div className="d-flex py-1">
                                    <div>
                                       {/* <img src={Userimg} className="avatar avatar-sm  me-3 " /> */}
                                        <i className="fa-solid fa-ban p-0"></i>
                                    </div>
                                    <div className="d-flex flex-column justify-content-center">
                                       <h6 className="text-sm font-weight-normal mb-1">
                                          <span className="font-weight-bold mx-2"> No notification</span>
                                       </h6>
                                       {/* <p className="text-xs text-secondary mb-0 ">
                                          <i className="fa fa-clock me-1"></i>
                                          13 minutes ago
                                       </p> */}
                                    </div>
                                 </div>
                              </a>
                           </li>
                        </ul>
                     </li>
                     <li>
                        <div className="dropdown sadmin-content">
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