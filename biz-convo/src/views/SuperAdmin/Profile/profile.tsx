import React from 'react'
import Sidebar from '../../../shared/Sidebar';
import Footer from '../../../shared/Footer';
import Userimg from "../../../assets/img/team-2.jpg"
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import DashboardLayout from '../../../layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import SuperAdminTopNav from '../../../shared/TopNav/superAdmin';
function DashboardVendorProfile() {
   return (
      <>
         <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
               <SuperAdminTopNav />
               <div className="vendor-breadcrumbs container-fluid py-1 px-3">
                  <nav aria-label="breadcrumb">
                     <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/super-admin/dashboard"}>Dashboard</Link></li>
                        <li className="breadcrumb-item text-sm text-dark active" aria-current="page">My Profile</li>
                     </ol>
                     <h6 className="text-start font-weight-bolder mb-0">My Profile</h6>
                  </nav>
               </div>
               <div className="myprofile-maincontent container-fluid py-4">
                  <div className="row myprofile-content">
                     <div className="col-md-6">
                        <h5 className="text-start">Edit Profile</h5>
                        <div className="col-md-12 login-input-group">
                           <div className="edit-container">
                              <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user-secret"></i> Username</label>
                           </div>
                        </div>
                        <div className="row">
                           <div className="col-md-6 login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> First Name</label>
                              </div>
                           </div>
                           <div className="col-md-6 login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Last Name</label>
                              </div>
                           </div>
                           <div className="col-md-6 login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-screen-button"></i> Mobile Number</label>
                              </div>
                           </div>
                           <div className="col-md-6 login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                              </div>
                           </div>
                           <div className="col-md-12 file_upload_field login-input-group">
                              <div className="file-inputs edit-container">
                                 <input
                                    type="file"
                                    name="file-input"
                                    id="file-input"
                                    className="file-input__input"
                                 />
                                 <label className="file-input__label" htmlFor="file-input">
                                    <svg
                                       aria-hidden="true"
                                       focusable="false"
                                       data-prefix="fas"
                                       data-icon="upload"
                                       className="svg-inline--fa fa-upload fa-w-16"
                                       role="img"
                                       xmlns="http://www.w3.org/2000/svg"
                                       viewBox="0 0 512 512"
                                    >
                                       <path
                                          fill="currentColor"
                                          d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                       ></path>
                                    </svg>
                                    <span>Upload file</span></label>
                              </div>
                           </div>
                        </div>

                        <div className="col-md-12 edit-button text-end">
                           <button>Save</button>
                        </div>
                     </div>
                     <div className="col-md-6">
                        <h5 className="text-start">Password</h5>
                        <div className="col-md-12 login-input-group">
                           <div className="edit-container">
                              <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-unlock"></i> Current Password</label>
                           </div>
                        </div>
                        <div className="col-md-12 new-password login-input-group">
                           <div className="edit-container">
                              <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock-open"></i> New Password</label>
                           </div>
                        </div>
                        <div className="col-md-12 new-password login-input-group">
                           <div className="edit-container">
                              <input type="text" id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock"></i> Confirm New Password</label>
                           </div>
                        </div>
                        <div className="col-md-12 new-password login-input-group">
                           <div className="edit-container">
                              <br></br>
                              <br></br>
                           </div>
                        </div>
                        <div className="col-md-12 edit-button text-end">
                           <button>Change Password</button>
                        </div>
                     </div>
                  </div>
                  <Footer />
               </div>
            </main>
         </DashboardLayout>
      </>
   )
}
export default DashboardVendorProfile;