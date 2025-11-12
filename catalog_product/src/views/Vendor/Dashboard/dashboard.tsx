import SoftUI from "../../../assets/img/small-logos/logo-xd.svg";
import AddProgress from "../../../assets/img/small-logos/logo-atlassian.svg";
import FixPlat from "../../../assets/img/small-logos/logo-slack.svg";
import LaunchIcon from "../../../assets/img/small-logos/logo-spotify.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import "./dashboard.css"
import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";

function VendorDashboard() {
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const navigate = useNavigate();
   
   const [vendorDashcount,setVendorDashcount]=useState<any>("")
   const [loading, setLoading] = useState(false);


   const handleVendorDashcount = () => {
      setLoading(true)
            VendorAPI.commonVendorDashCount()
               .then((responseData:any) => {
                  if (responseData.apiStatus.code === '200') {
                     setVendorDashcount(responseData?.VendorDashCountData);
                     setLoading(false)
                  } else {
                     toast.error(responseData.apiStatus.message);
                     setLoading(false)
                  }
               })
               .catch((error:any) => {
                  console.error("Error during login:", error);
                  toast.error("An error occurred during login.");
                  setLoading(false)
               });
   };
   useEffect(()=>{
      handleVendorDashcount();
   },[])
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <>
         <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
               <TopNav />
               <div className="container-fluid py-1">
                  <nav aria-label="breadcrumb">
                     <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm"><a className="opacity-5 grayFont" href="#">Home</a></li>
                        <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Vendor Dashboard</li>
                     </ol>
                     <h6 className="font-weight-bolder text-start mb-0 grayFont">Vendor Dashboard</h6>
                  </nav>
               </div>
               <div className="dashboard-maincontent container-fluid py-4">
               {
                        loading ? (
                           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                              <FadeLoader color="#36d7b7" />
                           </div>
                        ) : vendorDashcount.length === 0 ? (
                           <></>
                        ) : (
                           <>
                  <div className="row">
                     
                     <div className="col-lg-12 col-12">
                        <div className="row">
                        <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                          <i className="fa-solid fa-store vendor-dashboard-icon"></i>        
                                          </div>
                                          <h5 className="grayFont font-weight-bolder mb-0 mt-3">
                                             {vendorDashcount?.contactCount || 0}
                                          </h5>
                                          <span className="vendordash-total">Total Customer</span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/contacts")}}>Manage Customers</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h grayFont"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/contacts"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img1 opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-brands fa-whatsapp text-white"></i>
                                          </div>
                                          <h5 className="grayFont font-weight-bolder mb-0 mt-3">
                                             {vendorDashcount?.WhatsappQueueCount || 0}
                                          </h5>
                                          <span className="vendordash-total">Queue Whatsapp</span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/campaign")}}>Manage Queue Whatsapp</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h grayFont"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/campaign"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img2 opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-solid fa-message text-white"></i>
                                          </div>
                                          <h5 className="grayFont font-weight-bolder mb-0 mt-3">
                                            0
                                          </h5>
                                          <span className="vendordash-total">Messages in Queue SMS</span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/sms/campaign")}}>Manage Queue SMS</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h grayFont"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/sms/campaign"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img3 opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-solid fa-comments text-white"></i>
                                          </div>
                                          <h5 className="grayFont font-weight-bolder mb-0 mt-3">
                                             0
                                          </h5>
                                          <span className="vendordash-total">Total SMS Balance </span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/sms/campaign")}}>Manage SMS Balance</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h grayFont"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/sms/campaign"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                      
                  </div>
                  <Footer />
                  </>)} 
               </div>
            </main>
         </DashboardLayout>
      </>
   )
}
export default VendorDashboard;