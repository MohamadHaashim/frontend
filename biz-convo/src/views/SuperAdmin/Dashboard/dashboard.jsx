import SoftUI from "../../../assets/img/small-logos/logo-xd.svg";
import AddProgress from "../../../assets/img/small-logos/logo-atlassian.svg";
import FixPlat from "../../../assets/img/small-logos/logo-slack.svg";
import LaunchIcon from "../../../assets/img/small-logos/logo-spotify.svg";
import Userimg from "../../../assets/img/team-2.jpg"
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import DashboardLayout from "../../../layouts/DashboardLayout";
import SuperAdminTopNav from "../../../shared/TopNav/superAdmin";
import Footer from "../../../shared/Footer";
import React, { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import noImage from "../../../assets/img/no_Image.png";
import "./dashboard.css"
import {
   Chart as ChartJS,
   LineElement,
   BarElement,
   CategoryScale,
   LinearScale,
   PointElement,
   Tooltip,
   Legend,
} from "chart.js";
import Scrollbar from "smooth-scrollbar";
import LoginAPI from "../../../api/services/superAdminLogin/superAdmin";
import { FadeLoader } from "react-spinners";
import { Link } from "react-router-dom";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { baseURL } from "../../../api/api";
ChartJS.register(
   LineElement,
   BarElement,
   CategoryScale,
   LinearScale,
   PointElement,
   Tooltip,
   Legend
);
function Dashboard() {
   const [sadminDashcount,setSadminDashcount]=useState("")
   const handleSadminDashcount = () => {
         VendorAPI.commonSuperadminDashCount()
            .then((responseData) => {
               if (responseData.apiStatus.code === '200') {
                  setSadminDashcount(responseData?.SuperAdminDashCountData);
               } else {
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error) => {
               setLoading(false)
               console.error("Error while fetching campaign dashboard details:", error);
               toast.error("An error occurred while fetching campaign dashboard details.");
            });
      };
   const chartRef = useRef(null);
   useEffect(() => {
      if (
         navigator.platform.indexOf("Win") > -1 &&
         document.querySelector("#sidenav-scrollbar")
      ) {
         Scrollbar.init(document.querySelector("#sidenav-scrollbar"), {
            damping: 0.5,
         });
      }
      handleSadminDashcount();
   }, []);
   const data = {
      labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [
         {
            label: "Mobile apps",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0,
            borderColor: "#5e72e4",
            backgroundColor: (context) => {
               const ctx = context.chart.ctx;
               const gradient = ctx.createLinearGradient(0, 230, 0, 50);
               gradient.addColorStop(1, "rgba(94, 114, 228, 0.2)");
               gradient.addColorStop(0.2, "rgba(94, 114, 228, 0.0)");
               gradient.addColorStop(0, "rgba(94, 114, 228, 0)");
               return gradient;
            },
            fill: true,
            data: [50, 40, 300, 220, 500, 250, 400, 230, 500],
            maxBarThickness: 6,
         },
      ],
   };
   const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
         legend: {
            display: false,
         },
      },
      interaction: {
         intersect: false,
         mode: "index",
      },
      scales: {
         y: {
            grid: {
               drawBorder: false,
               display: true,
               drawOnChartArea: true,
               drawTicks: false,
               borderDash: [5, 5],
            },
            ticks: {
               display: true,
               padding: 10,
               color: "#fbfbfb",
               font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
               },
            },
         },
         x: {
            grid: {
               drawBorder: false,
               display: false,
               drawOnChartArea: false,
               drawTicks: false,
               borderDash: [5, 5],
            },
            ticks: {
               display: true,
               color: "#ccc",
               padding: 20,
               font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
               },
            },
         },
      },
   };
   ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
      
   
    // Vendor List
   const [listVendor, setListVendor] = useState([])
   const [loading, setLoading] = useState(false);
    const superAdminVendorList = () => {
      setLoading(true)
      const apiData = {
         pageIndex: 0,
         dataLength: 6
      };
      LoginAPI.vendorListApi(apiData)
         .then((responceData) => {
            if (responceData.apiStatus.code === '200') {
               setListVendor(responceData?.responseData?.VendorData)
               setLoading(false)
            } else {
               setLoading(false)
            }
         })
         .catch((error) => {
            console.error("Error during login:", error);
            setLoading(false)
         });
   };
   useEffect(()=>{
      superAdminVendorList()
   },[])
   return (
      <>
          <DashboardLayout>
            <main class="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
               <SuperAdminTopNav />
               <div class="container-fluid py-1">
                  <nav aria-label="breadcrumb">
                     <ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li class="breadcrumb-item text-sm"><a class="opacity-5 text-dark" href="#">Home</a></li>
                        <li class="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
                     </ol>
                     <h6 class="font-weight-bolder text-start mb-0">Dashboard</h6>
                  </nav>
               </div>
               <div class="dashboard-maincontent container-fluid py-4">
               {
                     loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                           <FadeLoader color="#36d7b7" />
                        </div>
                     ) : sadminDashcount.length === 0 ? (
                        <></>
                     ) : (
                        <>
                  <div class="row">
                  
                     <div class="col-lg-12 col-12">
                        <div class="row">
                           <div class="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div class="card">
                                 <span class="mask superadmin-dash-bg-img1 opacity-10 border-radius-lg"></span>
                                 <div class="card-body p-3 position-relative">
                                    <div class="row">
                                       <div class="col-9 text-start">
                                          <div class="icon icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                          <i class="fa-solid fa-store text-white"></i>
                                          </div>
                                          <h5 class=" font-weight-bolder mb-0 mt-3">
                                             {sadminDashcount?.TotalVendors || 0}
                                          </h5>
                                          <span class=" text-sm">Total Vendors</span>
                                       </div>
                                       {/* <div class="col-3">
                                          <div class="dropstart text-end mb-6">
                                             <a href="javascript:;" class="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h "></i>
                                             </a>
                                             <ul class="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/super-admin/vendor-management"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div class="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div class="card">
                                 <span class="mask superadmin-dash-bg-img2 opacity-10 border-radius-lg"></span>
                                 <div class="card-body p-3 position-relative">
                                    <div class="row">
                                       <div class="col-9 text-start">
                                          <div class="icon icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                          <i class="fa-solid fa-chart-line text-white"></i>
                                          </div>
                                          <h5 class=" font-weight-bolder mb-0 mt-3">
                                             {sadminDashcount?.TotalActiveVendors || 0}
                                          </h5>
                                          <span class=" text-sm">Total Active Vendors</span>
                                       </div>
                                       {/* <div class="col-3">
                                          <div class="dropstart text-end mb-6">
                                             <a href="javascript:;" class="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h "></i>
                                             </a>
                                             <ul class="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                             <li><Link className="dropdown-item border-radius-md" to={"/super-admin/vendor-management"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div class="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div class="card">
                                 <span class="mask superadmin-dash-bg-img3 opacity-10 border-radius-lg"></span>
                                 <div class="card-body p-3 position-relative">
                                    <div class="row">
                                    <div class="col-9 text-start">
                                          <div class="icon icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                          <i class="fa-brands fa-whatsapp text-white"></i>
                                          </div>
                                          <h5 class=" font-weight-bolder mb-0 mt-3">
                                             {sadminDashcount?.MessagesInQueue ||0}
                                          </h5>
                                          <span class=" text-sm">Messages in Queue Whatsapp</span>
                                       </div>
                                       {/* <div class="col-3">
                                          <div class="dropstart text-end mb-6">
                                             <a href="javascript:;" class="cursor-pointer" id="dropdownUsers4" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h "></i>
                                             </a>
                                             <ul class="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                             <li><Link className="dropdown-item border-radius-md" to={""}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div class="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div class="card">
                                 <span class="mask superadmin-dash-bg-img4 opacity-10 border-radius-lg"></span>
                                 <div class="card-body p-3 position-relative">
                                    <div class="row">
                                       <div class="col-9 text-start">
                                          <div class="icon icon-shape superadmin-dashboard-iconbg bg-white shadow text-center border-radius-2xl">
                                          <i class="fa-solid fa-message text-white"></i>
                                          </div>
                                          <h5 class=" font-weight-bolder mb-0 mt-3">
                                             0
                                          </h5>
                                          <span class=" text-sm">Messages in Queue SMS</span>
                                       </div>
                                       {/* <div class="col-3">
                                          <div class="dropstart text-end mb-6">
                                             <a href="javascript:;" class="cursor-pointer" id="dropdownUsers4" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h "></i>
                                             </a>
                                             <ul class="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                             <li><Link className="dropdown-item border-radius-md" to={""}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div class="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div class="card">
                                 <span class="mask superadmin-dash-bg-img5 opacity-10 border-radius-lg"></span>
                                 <div class="card-body p-3 position-relative">
                                    <div class="row">
                                       <div class="col-9 text-start">
                                          <div class="icon icon-shape superadmin-dashboard-iconbg bg-white shadow text-center border-radius-2xl">
                                          <i class="fa-solid fa-comments text-white"></i>
                                          </div>
                                          <h5 class=" font-weight-bolder mb-0 mt-3">
                                             0
                                          </h5>
                                          <span class=" text-sm">Total SMS Balance</span>
                                       </div>
                                       {/* <div class="col-3">
                                          <div class="dropstart text-end mb-6">
                                             <a href="javascript:;" class="cursor-pointer" id="dropdownUsers4" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h "></i>
                                             </a>
                                            <ul class="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                             <li><Link className="dropdown-item border-radius-md" to={""}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div class="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div class="card">
                                 <span class="mask superadmin-dash-bg-img6 opacity-10 border-radius-lg"></span>
                                 <div class="card-body p-3 position-relative">
                                    <div class="row">
                                    <div class="col-9 text-start">
                                          <div class="icon icon-shape superadmin-dashboard-iconbg bg-white shadow text-center border-radius-2xl">
                                          <i class="fa-solid fa-envelope-open text-white"></i>
                                          </div>
                                          <h5 class=" font-weight-bolder mb-0 mt-3">
                                             0
                                          </h5>
                                          <span class=" text-sm">Messages Processed</span>
                                       </div>
                                       {/* <div class="col-3">
                                          <div class="dropstart text-end mb-6">
                                             <a href="javascript:;" class="cursor-pointer" id="dropdownUsers4" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="fa fa-ellipsis-h "></i>
                                             </a>
                                            <ul class="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                             <li><Link className="dropdown-item border-radius-md" to={""}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div> */}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  
                  </div>
                  <div class="row my-4">
                     <div class="col-lg-12 col-md-6 mb-md-0 mb-4">
                        <div class="card">
                           <div class="card-header pb-0">
                              <div class="row">
                                 <div class="text-start col-lg-6 col-7">
                                    <h6>Recent Vendor</h6>
                                 </div>
                                 <div class="col-lg-6 col-5 my-auto text-end">
                                    <div class="dropdown float-lg-end pe-4">
                                       <a class="cursor-pointer" id="dropdownTable" data-bs-toggle="dropdown" aria-expanded="false">
                                          <i class="fa fa-ellipsis-v text-secondary"></i>
                                       </a>
                                       <ul class="dropdown-menu px-1 ms-sm-n4 ms-n5" aria-labelledby="dropdownTable">
                                          <li><Link className="dropdown-item border-radius-md" to={"/super-admin/vendor-management"}>View all</Link></li>
                                       </ul>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div class="card-body px-0 pb-2">
                              <div class="table-responsive">
                              {
                                 loading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>

                                       <FadeLoader color="#36d7b7" />
                                    </div>
                                 ) : listVendor.length === 0 ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <>
                                 <table class="table align-items-center mb-0">
                                    <thead>
                                       <tr className="text-start">
                                          <th class="vendor-table-head text-xxs font-weight-bolder opacity-7 ">Vendor Name</th>
                                          <th class="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Contact Details</th>
                                          <th class="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Address</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                    {listVendor.map((vendorList)=>(
                                       <tr>
                                          <td>
                                             <div class="d-flex px-2 py-1">
                                                <div>
                                                   <img src={vendorList?.UserProfileImage ? baseURL+ vendorList?.UserProfileImage :noImage} class="rounded avatar avatar-sm me-3" alt="xd" />
                                                </div>
                                                <div class="d-flex flex-column justify-content-center">
                                                   <h6 class="mb-0 text-sm">{vendorList?.VendorName}</h6>
                                                </div>
                                             </div>
                                          </td>
                                          <td class="align-middle text-start text-sm">
                                             <span class="text-xs font-weight-bold">
                                             {vendorList?.VendorEmail} <br />
                                             {vendorList?.VendorPhone}
                                              </span>
                                          </td>
                                          <td class="align-middle text-start text-sm" style={{whiteSpace:"pre-wrap"}}>
                                          <span class="text-xs font-weight-bold">
                                             {vendorList?.VendorAddress}
                                              </span>
                                          </td>
                                       </tr>
                                    ))}
                                    </tbody>
                                 </table>
                                 </>
                                    )}
                              </div>
                           </div>
                        </div>
                     </div>
                     {/* <div class="col-lg-4 text-start col-md-6">
                        <div class="card h-100">
                           <div class="card-header pb-0">
                              <h6>Vendor overview</h6>
                              <p class="text-sm">
                                 <i class="fa fa-arrow-up text-success" aria-hidden="true"></i>
                                 <span class="font-weight-bold">24%</span> this month
                              </p>
                           </div>
                           <div class="card-body p-3">
                              <div class="timeline timeline-one-side">
                                 <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                       <i class="fa-regular text-success fa-bell"></i>
                                    </span>
                                    <div class="timeline-content">
                                       <h6 class="text-dark text-sm font-weight-bold mb-0">$2400, Design changes</h6>
                                       <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">22 DEC 7:20 PM</p>
                                    </div>
                                 </div>
                                 <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                       <i class="fa-solid fa-folder-open text-danger text-gradient"></i>
                                    </span>
                                    <div class="timeline-content">
                                       <h6 class="text-dark text-sm font-weight-bold mb-0">New order #1832412</h6>
                                       <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">21 DEC 11 PM</p>
                                    </div>
                                 </div>
                                 <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                       <i class="fa-solid fa-cart-arrow-down text-info text-gradient"></i>
                                    </span>
                                    <div class="timeline-content">
                                       <h6 class="text-dark text-sm font-weight-bold mb-0">Server payments for April</h6>
                                       <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">21 DEC 9:34 PM</p>
                                    </div>
                                 </div>
                                 <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                       <i class="fa-solid fa-address-card text-warning text-gradient"></i>
                                    </span>
                                    <div class="timeline-content">
                                       <h6 class="text-dark text-sm font-weight-bold mb-0">New card added for order #4395133</h6>
                                       <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">20 DEC 2:20 AM</p>
                                    </div>
                                 </div>
                                 <div class="timeline-block mb-3">
                                    <span class="timeline-step">
                                       <i class="fa-solid fa-key text-primary text-gradient"></i>
                                    </span>
                                    <div class="timeline-content">
                                       <h6 class="text-dark text-sm font-weight-bold mb-0">Unlock packages for development</h6>
                                       <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">18 DEC 4:54 AM</p>
                                    </div>
                                 </div>
                                 <div class="timeline-block">
                                    <span class="timeline-step">
                                       <i class="fa-solid fa-circle-dollar-to-slot text-info text-gradient"></i>
                                    </span>
                                    <div class="timeline-content">
                                       <h6 class="text-dark text-sm font-weight-bold mb-0">New order #9583120</h6>
                                       <p class="text-secondary font-weight-bold text-xs mt-1 mb-0">17 DEC</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div> */}
                  </div>
                  <div class="row mt-4">
                     {/* <div class="col-lg-5 mb-lg-0 mb-4">
                        <div class="card z-index-2">
                           <div class="card-body p-2">
                              <div class="bg-dark border-radius-md py-3 pe-1 mb-3">
                                 <div class="chart">
                                    <Bar data={data} options={options} />
                                 </div>
                              </div>
                              <h6 class="ms-2 mt-4 mb-0"> Active Users </h6>
                              <p class="text-sm ms-2"> (<span class="font-weight-bolder">+23%</span>) than last week </p>
                              <div class="container border-radius-lg">
                                 <div class="row">
                                    <div class="col-3 py-3 ps-0">
                                       <div class="d-flex mb-2">
                                          <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-primary text-center me-2 d-flex align-items-center justify-content-center">
                                             <svg width="10px" height="10px" viewBox="0 0 40 44" version="1.1" >
                                                <title>document</title>
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                   <g transform="translate(-1870.000000, -591.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                      <g transform="translate(1716.000000, 291.000000)">
                                                         <g transform="translate(154.000000, 300.000000)">
                                                            <path class="color-background" d="M40,40 L36.3636364,40 L36.3636364,3.63636364 L5.45454545,3.63636364 L5.45454545,0 L38.1818182,0 C39.1854545,0 40,0.814545455 40,1.81818182 L40,40 Z" opacity="0.603585379"></path>
                                                            <path class="color-background" d="M30.9090909,7.27272727 L1.81818182,7.27272727 C0.814545455,7.27272727 0,8.08727273 0,9.09090909 L0,41.8181818 C0,42.8218182 0.814545455,43.6363636 1.81818182,43.6363636 L30.9090909,43.6363636 C31.9127273,43.6363636 32.7272727,42.8218182 32.7272727,41.8181818 L32.7272727,9.09090909 C32.7272727,8.08727273 31.9127273,7.27272727 30.9090909,7.27272727 Z M18.1818182,34.5454545 L7.27272727,34.5454545 L7.27272727,30.9090909 L18.1818182,30.9090909 L18.1818182,34.5454545 Z M25.4545455,27.2727273 L7.27272727,27.2727273 L7.27272727,23.6363636 L25.4545455,23.6363636 L25.4545455,27.2727273 Z M25.4545455,20 L7.27272727,20 L7.27272727,16.3636364 L25.4545455,16.3636364 L25.4545455,20 Z"></path>
                                                         </g>
                                                      </g>
                                                   </g>
                                                </g>
                                             </svg>
                                          </div>
                                          <p class="text-xs mt-1 mb-0 font-weight-bold">Users</p>
                                       </div>
                                       <h4 class="font-weight-bolder">36K</h4>
                                       <div class="progress w-75">
                                          <div class="progress-bar bg-dark w-60" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                       </div>
                                    </div>
                                    <div class="col-3 py-3 ps-0">
                                       <div class="d-flex mb-2">
                                          <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-info text-center me-2 d-flex align-items-center justify-content-center">
                                             <svg width="10px" height="10px" viewBox="0 0 40 40" version="1.1">
                                                <title>spaceship</title>
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                   <g transform="translate(-1720.000000, -592.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                      <g transform="translate(1716.000000, 291.000000)">
                                                         <g transform="translate(4.000000, 301.000000)">
                                                            <path class="color-background" d="M39.3,0.706666667 C38.9660984,0.370464027 38.5048767,0.192278529 38.0316667,0.216666667 C14.6516667,1.43666667 6.015,22.2633333 5.93166667,22.4733333 C5.68236407,23.0926189 5.82664679,23.8009159 6.29833333,24.2733333 L15.7266667,33.7016667 C16.2013871,34.1756798 16.9140329,34.3188658 17.535,34.065 C17.7433333,33.98 38.4583333,25.2466667 39.7816667,1.97666667 C39.8087196,1.50414529 39.6335979,1.04240574 39.3,0.706666667 Z M25.69,19.0233333 C24.7367525,19.9768687 23.3029475,20.2622391 22.0572426,19.7463614 C20.8115377,19.2304837 19.9992882,18.0149658 19.9992882,16.6666667 C19.9992882,15.3183676 20.8115377,14.1028496 22.0572426,13.5869719 C23.3029475,13.0710943 24.7367525,13.3564646 25.69,14.31 C26.9912731,15.6116662 26.9912731,17.7216672 25.69,19.0233333 L25.69,19.0233333 Z"></path>
                                                            <path class="color-background" d="M1.855,31.4066667 C3.05106558,30.2024182 4.79973884,29.7296005 6.43969145,30.1670277 C8.07964407,30.6044549 9.36054508,31.8853559 9.7979723,33.5253085 C10.2353995,35.1652612 9.76258177,36.9139344 8.55833333,38.11 C6.70666667,39.9616667 0,40 0,40 C0,40 0,33.2566667 1.855,31.4066667 Z"></path>
                                                            <path class="color-background" d="M17.2616667,3.90166667 C12.4943643,3.07192755 7.62174065,4.61673894 4.20333333,8.04166667 C3.31200265,8.94126033 2.53706177,9.94913142 1.89666667,11.0416667 C1.5109569,11.6966059 1.61721591,12.5295394 2.155,13.0666667 L5.47,16.3833333 C8.55036617,11.4946947 12.5559074,7.25476565 17.2616667,3.90166667 L17.2616667,3.90166667 Z" opacity="0.598539807"></path>
                                                            <path class="color-background" d="M36.0983333,22.7383333 C36.9280725,27.5056357 35.3832611,32.3782594 31.9583333,35.7966667 C31.0587397,36.6879974 30.0508686,37.4629382 28.9583333,38.1033333 C28.3033941,38.4890431 27.4704606,38.3827841 26.9333333,37.845 L23.6166667,34.53 C28.5053053,31.4496338 32.7452344,27.4440926 36.0983333,22.7383333 L36.0983333,22.7383333 Z" opacity="0.598539807"></path>
                                                         </g>
                                                      </g>
                                                   </g>
                                                </g>
                                             </svg>
                                          </div>
                                          <p class="text-xs mt-1 mb-0 font-weight-bold">Clicks</p>
                                       </div>
                                       <h4 class="font-weight-bolder">2m</h4>
                                       <div class="progress w-75">
                                          <div class="progress-bar bg-dark w-90" role="progressbar" aria-valuenow="90" aria-valuemin="0" aria-valuemax="100"></div>
                                       </div>
                                    </div>
                                    <div class="col-3 py-3 ps-0">
                                       <div class="d-flex mb-2">
                                          <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-warning text-center me-2 d-flex align-items-center justify-content-center">
                                             <svg width="10px" height="10px" viewBox="0 0 43 36" version="1.1">
                                                <title>credit-card</title>
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                   <g transform="translate(-2169.000000, -745.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                      <g transform="translate(1716.000000, 291.000000)">
                                                         <g transform="translate(453.000000, 454.000000)">
                                                            <path class="color-background" d="M43,10.7482083 L43,3.58333333 C43,1.60354167 41.3964583,0 39.4166667,0 L3.58333333,0 C1.60354167,0 0,1.60354167 0,3.58333333 L0,10.7482083 L43,10.7482083 Z" opacity="0.593633743"></path>
                                                            <path class="color-background" d="M0,16.125 L0,32.25 C0,34.2297917 1.60354167,35.8333333 3.58333333,35.8333333 L39.4166667,35.8333333 C41.3964583,35.8333333 43,34.2297917 43,32.25 L43,16.125 L0,16.125 Z M19.7083333,26.875 L7.16666667,26.875 L7.16666667,23.2916667 L19.7083333,23.2916667 L19.7083333,26.875 Z M35.8333333,26.875 L28.6666667,26.875 L28.6666667,23.2916667 L35.8333333,23.2916667 L35.8333333,26.875 Z"></path>
                                                         </g>
                                                      </g>
                                                   </g>
                                                </g>
                                             </svg>
                                          </div>
                                          <p class="text-xs mt-1 mb-0 font-weight-bold">Sales</p>
                                       </div>
                                       <h4 class="font-weight-bolder">435$</h4>
                                       <div class="progress w-75">
                                          <div class="progress-bar bg-dark w-30" role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100"></div>
                                       </div>
                                    </div>
                                    <div class="col-3 py-3 ps-0">
                                       <div class="d-flex mb-2">
                                          <div class="icon icon-shape icon-xxs shadow border-radius-sm bg-gradient-danger text-center me-2 d-flex align-items-center justify-content-center">
                                             <svg width="10px" height="10px" viewBox="0 0 40 40" version="1.1">
                                                <title>settings</title>
                                                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                   <g transform="translate(-2020.000000, -442.000000)" fill="#FFFFFF" fill-rule="nonzero">
                                                      <g transform="translate(1716.000000, 291.000000)">
                                                         <g transform="translate(304.000000, 151.000000)">
                                                            <polygon class="color-background" opacity="0.596981957" points="18.0883333 15.7316667 11.1783333 8.82166667 13.3333333 6.66666667 6.66666667 0 0 6.66666667 6.66666667 13.3333333 8.82166667 11.1783333 15.315 17.6716667"></polygon>
                                                            <path class="color-background" d="M31.5666667,23.2333333 C31.0516667,23.2933333 30.53,23.3333333 30,23.3333333 C29.4916667,23.3333333 28.9866667,23.3033333 28.48,23.245 L22.4116667,30.7433333 L29.9416667,38.2733333 C32.2433333,40.575 35.9733333,40.575 38.275,38.2733333 L38.275,38.2733333 C40.5766667,35.9716667 40.5766667,32.2416667 38.275,29.94 L31.5666667,23.2333333 Z" opacity="0.596981957"></path>
                                                            <path class="color-background" d="M33.785,11.285 L28.715,6.215 L34.0616667,0.868333333 C32.82,0.315 31.4483333,0 30,0 C24.4766667,0 20,4.47666667 20,10 C20,10.99 20.1483333,11.9433333 20.4166667,12.8466667 L2.435,27.3966667 C0.95,28.7083333 0.0633333333,30.595 0.00333333333,32.5733333 C-0.0583333333,34.5533333 0.71,36.4916667 2.11,37.89 C3.47,39.2516667 5.27833333,40 7.20166667,40 C9.26666667,40 11.2366667,39.1133333 12.6033333,37.565 L27.1533333,19.5833333 C28.0566667,19.8516667 29.01,20 30,20 C35.5233333,20 40,15.5233333 40,10 C40,8.55166667 39.685,7.18 39.1316667,5.93666667 L33.785,11.285 Z"></path>
                                                         </g>
                                                      </g>
                                                   </g>
                                                </g>
                                             </svg>
                                          </div>
                                          <p class="text-xs mt-1 mb-0 font-weight-bold">Items</p>
                                       </div>
                                       <h4 class="font-weight-bolder">43</h4>
                                       <div class="progress w-75">
                                          <div class="progress-bar bg-dark w-50" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div> */}
                     {/* <div class="col-lg-7 mb-lg-0 mb-4">
                        <div class="card z-index-2 h-100">
                           <div class="card-header pb-0 pt-3 bg-transparent text-start">
                              <h6 class="text-capitalize">Sales overview</h6>
                              <p class="text-sm mb-0">
                                 <i class="fa fa-arrow-up text-success"></i>
                                 <span class="font-weight-bold">4% more</span> in 2021
                              </p>
                           </div>
                           <div class="card-body p-3">
                              <Line ref={chartRef} data={data} options={options} />
                           </div>
                        </div>
                     </div> */}
                  </div>
                  <Footer />
                  </>)}
               </div>
            </main>
         </DashboardLayout>
      </>
   )
}
export default Dashboard;