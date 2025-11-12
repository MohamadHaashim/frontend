import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
interface TempDrop {
   id: string;
   name: string;
}
function Createcampaign() {
   const [tempDrop, setTempDrop] = useState<TempDrop[]>([]);
   const [template, setTemplate] = useState(true);
   const [tempIdId, settempIdId] = useState('')
   const [tempName, settempName] = useState('')
   const location = useLocation();
   const contactDetailsValue = location.state?.contactDetailsData || {};
   const navigate = useNavigate();
   const whatsappTemplateDropdwon = () => {
      VendorAPI.whatsappTemplateDropdwon()
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               setTempDrop(responceData?.responseData?.templateList?.data)
            }
            else{
               toast.error(responceData.responseData.error.message)
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
         });
   };
//Template Dropdown Filter
const filteredTemplateDrop = tempDrop.filter((dropdownValue) =>
   (dropdownValue?.name || '').toLowerCase().includes((tempName || '').toLowerCase())
 );
 useEffect(()=>{
   whatsappTemplateDropdwon()
 },[])
   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <TopNav />
            <div className="container-fluid py-1">
               <div className="row">
                  <div className="col-md-6">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                           <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                           <li className="breadcrumb-item text-sm grayFont active" aria-current="page">{contactDetailsValue.firstName ? "Send WhatsApp Template Message" : `Create New Campaigns`}</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0 grayFont">{contactDetailsValue.firstName ? ("Send WhatsApp Template Message") : (<>Create <i className="fa-brands fa-whatsapp"></i> New Campaigns</>)}</h6>
                     </nav>
                  </div>
                  <div className="col-md-6 text-end">
                     {contactDetailsValue.firstName ? (
                        <button className="vendor-crt-btn" onClick={() => navigate('/vendor/contacts')}><i className="fa-solid fa-chevron-left"></i> Back To Contact</button>
                     ) : null} &nbsp;
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/create-campaign") }}>Sync WhatsApp Templates</button>&nbsp;
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/campaign ") }}>Manage Campaigns</button>
                  </div>
               </div>
            </div>
            <div className="myprofile-maincontent container-fluid py-4">
               <div className="row myprofile-content">
                  {contactDetailsValue.firstName ? (
                     <div className="col-md-12 border-bottom mb-4">
                        <p className="text-sm">Name: {contactDetailsValue.firstName} {contactDetailsValue.lastName}</p>
                        <p className="mt-n3 text-sm">Phone: {contactDetailsValue.mobile}</p>
                        <p className="mt-n3 text-sm">Country: {contactDetailsValue.country}</p>
                     </div>
                  ) : null}
                  <div className="col-md-12">
                     <h5 className="text-start">Step 1</h5>
                     {template ? (
                        <div className="col-md-6 login-input-group">
                           <p className="text-start">Select templates</p>
                           <div className="edit-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <input type="text" id="vendor-crt-input" 
                              // onClick={whatsappTemplateDropdwon}
                                 value={tempName}
                                 autoComplete="off"
                                 onChange={(e)=>settempName(e.target.value)}
                                 className="vendor-crt-input cursor-pointer "
                                 placeholder=" "
                                 required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                 <i className="fa-regular fa-circle-check"></i> Select & Configure Template
                              </label>
                              <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              <ul className="dropdown-menu template-dropdown w-100">
                              {filteredTemplateDrop.length === 0 ? (
                                    <li className="dropdown-nodata-found">No data found</li>
                                 ) : (
                                    filteredTemplateDrop.map((dropdownValue, id) => (                                     <li key={id}>
                                       <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() => {
                                             navigate(`/vendor/campaign/create/new/${dropdownValue?.name}/${dropdownValue?.id}`, {
                                                state: { contactDetailsValue }
                                             });
                                             settempIdId(dropdownValue?.id);
                                             settempName(dropdownValue?.name);
                                             setTemplate(false);
                                          }}
                                       >
                                          {dropdownValue?.name}
                                       </a>
                                    </li>
                                 )))}
                              </ul>
                           </div>
                        </div>
                     ) : null}
                  </div>
               </div>
               <Footer />
            </div>
         </main>
      </DashboardLayout>
   )
}
export default Createcampaign;