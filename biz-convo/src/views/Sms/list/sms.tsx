import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";

function Sms() {
   const navigate = useNavigate();
   const [modalMode, setModalMode] = useState("create");
   const [loading, setLoading] = useState(false);
   const [submit, setSubmit] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);
   const [smslistData, setSmslistData] = useState<any[]>([]);
   const [active, setActive] = useState(true)
   const[templateName,settemplateName]=useState("");
   const[templateContent,settemplateContent]=useState("");
   const[smsId,setsmsId]=useState("");
      // Pagination Method
   
      const totalPages = Math.ceil(totalRecords / recordsPerPage);
   
      const handlePageChange = (pageNumber: any) => {
         if (pageNumber < 1 || pageNumber > totalPages) return;
         setCurrentPage(pageNumber);
      };
      const renderPaginationItems = () => {
         let items = [];
         const maxPageNumbersToShow = 7;
         const halfRange = Math.floor(maxPageNumbersToShow / 2);
   
         let startPage, endPage;
         if (totalPages <= maxPageNumbersToShow) {
            startPage = 1;
            endPage = totalPages;
         } else if (currentPage <= halfRange) {
            startPage = 1;
            endPage = maxPageNumbersToShow;
         } else if (currentPage + halfRange >= totalPages) {
            startPage = totalPages - maxPageNumbersToShow + 1;
            endPage = totalPages;
         } else {
            startPage = currentPage - halfRange;
            endPage = currentPage + halfRange;
         }
   
         if (startPage > 1) {
            items.push(
               <Pagination.Item key="1" active={1 === currentPage} onClick={() => handlePageChange(1)}>
                  1
               </Pagination.Item>
            );
            if (startPage > 2) {
               items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
         }
   
         for (let number = startPage; number <= endPage; number++) {
            items.push(
               <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
                  {number}
               </Pagination.Item>
            );
         }
   
         if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
               items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
               <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
               </Pagination.Item>
            );
         }
   
         return items;
      };
   
   const openModal = (mode: any) => {
      setModalMode(mode);
   };
   const resetForm=()=>{
      settemplateName("");
      settemplateContent("");
      setsmsId("");
   }
   const handleSmsList = (page: any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.smstemplateList(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setSmslistData(responseData.result.smsTemplateDataDetails)
               setTotalRecords(responseData.result.totalRecordCount)
            } else {
               if (responseData.apiStatus.code == "404") {
               setSmslistData([]);
               }
               // toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error fetching SMS list:", error);
            toast.error("An error occurred while fetching SMS list.");
         });
   }
   
   const handleSmsStatus = (name: any) => {
         const apiCall = name === 'active' ? VendorAPI.smstemplateActive(smsId) : VendorAPI.smstemplateDeactive(smsId);
         apiCall
                .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  toast.success(responseData.apiStatus.message);
                  handleSmsList(currentPage);
                  const closeButton = document.getElementById("closeactiveModal");
                  if (closeButton) {
                     closeButton.click();
                  }
               } else {
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error: any) => {
               setLoading(false)
               console.error("Error updating SMS template status:", error);
               toast.error("An error occurred while updating SMS template status.");
            });
      };
   const handleDeleteStore = () => {
         VendorAPI.smstemplateDelete(smsId)
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  const newTotalRecords = totalRecords - 1;
                  setTotalRecords(newTotalRecords);
                  let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
                  if (currentPage > totalPages) {
                     setCurrentPage(totalPages || 1); 
                  }
                  else if (currentPage < 1) {
                     setCurrentPage(1);
                  }
                  const closeButton = document.getElementById("closedeleteModal");
                  if (closeButton) {
                     handleSmsList(currentPage);
                     closeButton.click();
                  }
                  toast.success(responseData.apiStatus.message);
               } else {
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error: any) => {
               setLoading(false)
               console.error("Error during delete:", error);
               toast.error("An error occurred during deletion.");
            });
      };
   useEffect(()=>{
      handleSmsList(currentPage);
   },[currentPage])
   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <TopNav />
            <div className="container-fluid py-1">
               <div className="row">
                  <div className="col-md-6">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                           <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                           <li className="breadcrumb-item text-sm text-dark active" aria-current="page">SMS</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0">SMS <i className="fa-regular fa-message"></i></h6>
                     </nav>
                  </div>
                  <div className="col-md-6 text-end">
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/create-sms") }}>Create New Template</button>&nbsp;
                     <button className="vendor-crt-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#smshelpmodal">Help</button>
                  </div>
               </div>
            </div>
            <div className="vendor-maincontent container-fluid py-4">
               <div className="row">
                  <div className="col-12">
                     <div className="card mb-4">
                        <div className="card-body px-0 pt-0 pb-2">
                           <div className="table-responsive p-0">
                              {
                                 loading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                       <FadeLoader color="#36d7b7" />
                                    </div>
                                 ) : smslistData.length === 0 ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <>
                              <table className="table align-items-center justify-content-center mb-0">
                                 <thead>
                                    <tr className="vendor-table-mainhead">
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Template Name</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Template Id</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Sender Id</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Template Status</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Message Content</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Created</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Actions</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {smslistData.map((listData:any)=>(

                                   
                                    <tr>
                                       <td>
                                          <div className="d-flex px-2">
                                             <div>
                                             </div>
                                             <div className="my-auto">
                                                <h6 className="mb-0 text-sm">{listData?.templateName}</h6>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="align-middle text-start text-sm">
                                          <span className="text-sm">
                                             {listData?.templateId}<br /></span>
                                       </td>
                                       <td className="align-middle text-start text-sm">
                                          <span className="text-sm">
                                             {listData?.senderId}
                                          </span>
                                       </td>
                                       <td>
                                       <div className="form-check form-switch ms-1 is-filled">
                                          <input 
                                          onChange={() => {
                                             if (listData.activeStatus === "1") {
                                                setsmsId(listData?.id);
                                                setActive(false);
                                                settemplateName(listData?.templateName)
                                             } else if (listData.activeStatus === "0") {
                                                setsmsId(listData.id);
                                                setActive(true);
                                                settemplateName(listData?.templateName)
                                             }
                                          }}
                                          className="form-check-input"
                                          type="checkbox"
                                          id="flexSwitchCheckDefault"
                                          data-bs-toggle="modal" data-bs-target="#vendorActive"
                                          checked={listData.activeStatus === "1"}
                                             />
                                       </div>
                                       </td>
                                       <td className="align-middle vendor-login-td" onClick={()=>settemplateContent(listData?.templateContent)} data-bs-toggle="modal" data-bs-target="#contentview">
                                          <span className="text-sm cursor-pointer">
                                             {listData?.templateContent?.length > 20 ? (
                                                <>
                                                {listData.templateContent.substring(0, 5)}...
                                                <svg width="15px" height="15px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="gray" stroke-width="1.5"/>
                                                <path d="M12 7V13" stroke="gray" stroke-width="1.5" stroke-linecap="round"/>
                                                <circle cx="12" cy="16" r="1" fill="gray"/>
                                                </svg>
                                                </>
                                             ) : (
                                                listData.templateContent
                                             )}
                                          </span>
                                          </td>

                                       <td className="align-middle vendor-login-td">
                                          <span className="text-sm">
                                             {new Date(listData.createdDate).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true
                                             }).replace(',', '').replace(' ', ' ')}
                                          </span>
                                       </td>
                                       <td className="align-middle text-center">
                                          <div className="actionEdit-tooltip-container">
                                             <button 
                                             onClick={() => { navigate(`/vendor/edit-sms/${listData?.id}`)}} className="btn-3 vendorbtn-edit" type="button">
                                                <span className="btn-inner--icon"><i className="fa-regular fa-pen-to-square"></i></span>
                                             </button>&nbsp;
                                             <div className="actionEdit-tooltip-text">
                                                Edit
                                             </div>
                                          </div>
                                          <div className="actionDelete-tooltip-container">
                                             <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" 
                                             onClick={() => { setsmsId(listData.id);settemplateName(listData?.templateName) }} data-bs-target="#vendordelete">
                                                <span className="btn-inner--icon"><i className="fa-regular fa-trash-can"></i></span>
                                             </button>
                                             <div className="actionDelete-tooltip-text">
                                                Delete
                                             </div>
                                          </div>
                                       </td>
                                    </tr>
                                     ))}
                                 </tbody>
                              </table>
                              <div className="store-pagination">
                                 <Pagination>
                                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                    {renderPaginationItems()}
                                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                 </Pagination>
                              </div>
                              </>
                                 )}
                           </div>
                           
                        </div>
                     </div>
                  </div>
               </div>
               <Footer />
            </div>
            {/* Sms View */}
            <div className="modal fade" id="contentview" aria-labelledby="vendorviewLabel" aria-hidden="true">
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content all-modal-content">
                     <div className="modal-header vendor-view-header">
                        <h1 className="modal-title fs-6 mb-3 text-center" id="vendorviewLabel">Content</h1>
                     </div>
                     <div className="p-3 modal-body text-center">
                        {templateContent}
                     </div>
                     <div className="modal-footer text-end vendor-view-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>OK</button>
                     </div>
                  </div>
               </div>
            </div>
            {/*Sms Delete Modal*/}
            <div className="modal fade" id="vendordelete" tab-Index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content all-modal-content vendor-delete-content">
                     <div className=" vendor-delete-header">
                        </div>
                     <div className="modal-body vendor-delete-body">
                        <div className="row">
                           <div className="vendor-delete-icon">
                              <i className="fa-solid fa-triangle-exclamation"></i>
                           </div>
                           <h4 className="modal-confirm-head">Are You Sure !</h4>
                           <h6 className="modal-confirm-subhead">You want to delete this {templateName} sms ?</h6>
                           </div>
                     </div>
                     <div className="modal-footer text-center vendor-delete-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal">No</button>&nbsp;
                        <button type="button" className="btn btn-primary" onClick={handleDeleteStore} >Yes</button>
                     </div>
                  </div>
               </div>
            </div>
            {/*Sms Active Modal*/}
            <div className="modal fade" id="vendorActive" tab-Index="-1" aria-labelledby="vendorActiveLabel" aria-hidden="true">
               <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content all-modal-content vendor-delete-content">
                     <div className=" vendor-delete-header">
                        </div>
                     <div className="modal-body vendor-delete-body">
                        <div className="row">
                           <div className="vendor-delete-icon">
                              <i className="fa-solid fa-triangle-exclamation"></i>
                           </div>
                           <h4 className="modal-confirm-head">Are You Sure !</h4>
                           {active ?
                           <h6 className="modal-confirm-subhead">You want to active this {templateName} sms ?</h6>:
                           <h6 className="modal-confirm-subhead">You want to deactive this {templateName} sms ?</h6>}
                           <div></div>
                        </div>
                     </div>
                     <div className="modal-footer text-center vendor-delete-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeactiveModal">No</button>&nbsp;
                        <button type="button" className="btn btn-primary" onClick={()=>{active? handleSmsStatus("active"):handleSmsStatus("deactive")}} >Yes</button>
                     </div>
                  </div>
               </div>
            </div>
            {/* Store Help Modal */}
            <div
               className="modal fade"
               id="smshelpmodal"
               tab-Index="-1"
               aria-labelledby="smshelpmodalLabel"
               aria-hidden="true"
            >
               <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                     <div className="modal-content">
                        <div className="modal-header border-0">
                           <h1 className="modal-title fs-5" id="smsHelpModalLabel">
                              What is SMS Auto-Reply and How to Use It?
                           </h1>
                           <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                           ></button>
                        </div>
                        <div className="modal-body text-start">
                           <h6>What is SMS Auto-Reply?</h6>
                           <p>
                              SMS Auto-Reply allows you to set up automated responses for incoming text messages.
                              When someone sends an SMS with a specific keyword or phrase, the system will automatically send a pre-set reply.
                           </p>
                           <h6>How to Set Up SMS Auto-Reply?</h6>
                           <p>
                              1. Go to the SMS Auto-Reply settings in your dashboard.<br />
                              2. Add a new auto-reply by defining a trigger keyword or phrase and the response message.<br />
                              3. Save your settings, and the system will send the auto-reply whenever the trigger is detected.
                           </p>
                        </div>
                     </div>

                     <div className="modal-footer border-0">
                        <button
                           type="button"
                           className="btn btn-secondary"
                           data-bs-dismiss="modal"
                        >
                           Close
                        </button>
                        {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                     </div>
                  </div>
               </div>
            </div>
         </main>

      </DashboardLayout >
   );

}

export default Sms;