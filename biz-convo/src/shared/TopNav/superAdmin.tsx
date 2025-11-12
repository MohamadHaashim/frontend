import React, { useEffect } from 'react';
import Userimg from "../../assets/img/bizconvo-bgr-logo.png"
import Userimg1 from "../../assets/img/small-logos/logo-spotify.svg";
import { Link } from 'react-router-dom';
function SuperAdminTopNav() {
   const userName = localStorage.getItem("userName")
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
                        <div className="sadmin-content">
                           <button type="button" style={{cursor:"default"}}>
                              <img
                                 src={Userimg}
                                 style={{cursor:"default"}}
                                 alt="Profile"
                                 className="profile-navbar-img"
                              /> <span className="MuiTypography-root MuiTypography-button css-1w3klud nav-user-name">
                                 {userName}</span>
                           </button>
                        </div>
                     </li>
                  </ul>
               </div>
            </div>
         </nav>
      </>
   );
}
export default SuperAdminTopNav;