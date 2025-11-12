import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg"
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import "./campaign.css";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";
interface CampaignList {
   id: string;
   title: string;
   storeName: any;
   templateName: string;
   tempLang: string;
   activeStatus: string;
   createdDate: string;
   scheduleAt: string;
   sendStatus: string;
   status: string;
}
function Campaigns() {
   const [tab, setTab] = useState(true);
   const [isArchive, setisArchive] = useState(false);
   const [campId, setCampId] = useState('');
   const navigate = useNavigate();
   const handleBacktoSadmin = (e: any) => {
      e.preventDefault();
      navigate("/dashboard", { replace: true });
   };
   const handleActive = () => {
      setTab(true);
   }
   const handleArchive = () => {
      setTab(false);
   }
   const [campaignListData, setCampaignListData] = useState<CampaignList[]>([]);
   const [unarchiveListData, setUnarchiveListData] = useState<CampaignList[]>([]);
   const [loading, setLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);
   const [archivecurrentPage, setarchiveCurrentPage] = useState(1);
   const [archivetotalRecords, setarchiveTotalRecords] = useState(0);
   
   const totalPages = Math.ceil(totalRecords / recordsPerPage);
   const handlePageChange = (pageNumber: any) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
   };
   // Pagination Method
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
   //Archive Pagination Method
   const totalArchivePages = Math.ceil(archivetotalRecords / recordsPerPage);

   const handleArchivePageChange = (pageNumber: any) => {
      if (pageNumber < 1 || pageNumber > totalArchivePages) return;
      setarchiveCurrentPage(pageNumber);
   };

   // Pagination Method
   const renderArchivePaginationItems = () => {
      let items = [];
      const maxPageNumbersToShow = 7;
      const halfRange = Math.floor(maxPageNumbersToShow / 2);

      let startPage, endPage;
      if (totalArchivePages <= maxPageNumbersToShow) {
         startPage = 1;
         endPage = totalArchivePages;
      } else if (archivecurrentPage <= halfRange) {
         startPage = 1;
         endPage = maxPageNumbersToShow;
      } else if (archivecurrentPage + halfRange >= totalArchivePages) {
         startPage = totalArchivePages - maxPageNumbersToShow + 1;
         endPage = totalArchivePages;
      } else {
         startPage = archivecurrentPage - halfRange;
         endPage = archivecurrentPage + halfRange;
      }

      if (startPage > 1) {
         items.push(
            <Pagination.Item key="1" active={1 === archivecurrentPage} onClick={() => handleArchivePageChange(1)}>
               1
            </Pagination.Item>
         );
         if (startPage > 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
         }
      }

      for (let number = startPage; number <= endPage; number++) {
         items.push(
            <Pagination.Item key={number} active={number === archivecurrentPage} onClick={() => handleArchivePageChange(number)}>
               {number}
            </Pagination.Item>
         );
      }

      if (endPage < totalArchivePages) {
         if (endPage < totalArchivePages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
         }
         items.push(
            <Pagination.Item key={totalArchivePages} active={totalArchivePages === archivecurrentPage} onClick={() => handleArchivePageChange(totalArchivePages)}>
               {totalArchivePages}
            </Pagination.Item>
         );
      }

      return items;
   };
   const handleCampaignList = (page: any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.campaignListAPI(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setCampaignListData(responseData?.result?.CampaignDataList)
               setTotalRecords(responseData.result.totalRecordCount)
            } else {
               if (responseData.apiStatus.code == "404") {
               setCampaignListData([]);
               }
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   }
   const handleCampaignArchiveList = (page: any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.campaignArchiveListAPI(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setUnarchiveListData(responseData?.result?.CampaignDataList)
               setarchiveTotalRecords(responseData.result.totalRecordCount)
            } else {
               if (responseData.apiStatus.code == "404") {
               setUnarchiveListData([])
               }
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   }
   //Campaign Delete Active
   const campaignDelete =async (id: any) => {
      try {
         const responseData = await VendorAPI.campaignDelete(id);
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
               closeButton.click();
            }
            toast.success(responseData.apiStatus.message)
            handleCampaignList(currentPage);
            if(tab===true){
               handleCampaignList(currentPage);
           }
           else if(tab===false){
            handleCampaignArchiveList(archivecurrentPage);
           }
         } else {
            toast.error(responseData.apiStatus.message);
         }
   } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred during the get process.");
   }
   }
   //Campaign Archive Active
   const campaignArchiveActive =async (name: any) => {
      try {
         var responseData;
         if(name==="active"){
            responseData= await VendorAPI.campaignarchiveActive(campId);
         }
         else{
            responseData = await VendorAPI.campaignarchiveDeactive(campId);
         }
         if (responseData.apiStatus.code === '200') {
            if (isArchive) {
               toast.success("Campaign Archived");
               let newTotalRecords = totalRecords - 1;
               setTotalRecords(newTotalRecords);
               let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
               if (currentPage > totalPages) {
                     setCurrentPage(totalPages || 1); 
               } else if (currentPage < 1) {
                     setCurrentPage(1);
               }
            const closeButton = document.getElementById("closearchiveModal");
               if (closeButton) {
                  handleCampaignList(currentPage);
                  closeButton.click();
               }
            }
            else{
               toast.success("Campaign Unarchived");
               let newTotalRecords = archivetotalRecords - 1;
               setarchiveTotalRecords(newTotalRecords);
               let totalPages = Math.ceil(newTotalRecords / archivetotalRecords);
               if (archivecurrentPage > totalPages) {
                     setarchiveCurrentPage(totalPages || 1); 
               } else if (archivecurrentPage < 1) {
                     setarchiveCurrentPage(1);
               }
               const closeButton = document.getElementById("closearchiveModal");
               if (closeButton) {
                  handleCampaignArchiveList(archivecurrentPage);
                  closeButton.click();
               }
            }
         }
   } catch (error) {
      console.error("Error during API call:", error);
      toast.error("An error occurred during the get process.");
   }
   }
   
   useEffect(() => {
      if(tab===false){
      handleCampaignArchiveList(archivecurrentPage)
      }
   },[archivecurrentPage,tab])
   useEffect(() => {
      if(tab===true){
      handleCampaignList(currentPage)
      }
   }, [currentPage,tab])
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
                           <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Campaigns</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0 grayFont"><i className="fa-brands fa-whatsapp"></i> Campaigns</h6>
                     </nav>
                  </div>
                  <div className="col-md-6 text-end">
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/create-campaign") }}>Create Campaign</button>
                  </div>
               </div>
            </div>
            <div className="vendor-maincontent container-fluid py-4">
               <div className="row">
                  <div className="col-12">
                     <ul className="campaign-tabs nav nav-tabs">
                        <li className="nav-item" >
                           <button style={tab ? { background: "linear-gradient(310deg, var(--bs-gray-light) 0%, var(--bs-gray-dark) 100%)", color: "white", border: "0px" } : {}} className="nav-link active" aria-current="page" onClick={handleActive}>Active</button>
                        </li>
                        <li className="nav-item">
                           <button style={!tab ? { background: "linear-gradient(310deg, var(--bs-gray-light) 0%, var(--bs-gray-dark) 100%)", color: "white", border: "0px" } : {}} className="nav-link active" aria-current="page" onClick={handleArchive}>Archive</button>
                        </li>
                     </ul>
                     <div className="card mb-4 campaign-table-tabs">


                        {tab ?

                           <div className="card-body px-0 pt-0 pb-2">
                              <div className="table-responsive p-0">
                                 {
                                    loading ? (
                                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>

                                          <FadeLoader color="#36d7b7" />
                                       </div>
                                    ) : campaignListData.length === 0 ? (
                                       <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                    ) : (
                                       <>
                                          <table className="table align-items-center justify-content-center mb-0">
                                             <thead>
                                                <tr className="campaign-action">
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-3">Title</th>
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-2">Template</th>
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-2">Template <br />language</th>
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-2">Created at</th>
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-2">Schedule at</th>
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-2">Status</th>
                                                   <th className="campaign-table-head font-weight-bolder opacity-7 ps-2">Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="campaign-action">
                                             {campaignListData
                                                // .filter((listData:any) => listData.activeStatus === "1")
                                                .map((listData) => (
                                                   <tr>
                                                      <td>
                                                         <div className="d-flex px-2">
                                                            <div className="my-auto">
                                                               <span className="text-sm">
                                                                  {listData?.title}</span>
                                                            </div>
                                                         </div>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {listData?.templateName}</span>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {listData?.tempLang}</span>
                                                      </td>
                                                      <td>
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
                                                      <td>
                                                         <span className="text-sm">
                                                         📅 {new Date(listData.scheduleAt).toLocaleString('en-US', {
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
                                                      <td>
                                                      {listData?.sendStatus === "Executed" ?  
                                                         <span className="text-xs campaign-status">
                                                            {listData?.sendStatus}
                                                         </span>:
                                                         <span className="text-xs campaign-status-warn">
                                                            {listData?.sendStatus}
                                                         </span>}
                                                      </td>
                                                      <td className="align-middle">
                                                      <div className="actionCamp-tooltip-container">
                                                         <button className="btn-3 vendorbtn-edit" onClick={() => navigate(`/vendor/campaign/dashboard/${listData.id}`)} type="button">
                                                         <span className="btn-inner--icon"><i className="fa-solid fa-boxes-stacked"></i></span>
                                                            </button>&nbsp;
                                                            <div className="actionCamp-tooltip-text">
                                                               Campaign dashboard
                                                            </div>
                                                         </div>
                                                         <div className="actionArchive-tooltip-container">
                                                         <button className="btn-3 vendorbtn-archive" type="button" data-bs-toggle="modal" onClick={() => { setCampId(listData?.id);setisArchive(true) }} data-bs-target="#vendorarchive">
                                                         <span className="btn-inner--icon">
                                                               <i className="fa-solid fa-box-archive"></i>
                                                            </span>
                                                            </button>
                                                            &nbsp;
                                                            <div className="actionArchive-tooltip-text">
                                                               Archive
                                                            </div>
                                                         </div>
                                                         <div className="actionDelete-tooltip-container">
                                                         <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" onClick={() => { setCampId(listData?.id) }} data-bs-target="#vendordelete">
                                                         <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-trash-can"></i>
                                                            </span>
                                                            </button>
                                                            &nbsp;
                                                            <div className="actionDelete-tooltip-text">
                                                               Delete
                                                            </div>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                ))}
                                             </tbody>
                                          </table>
                                          {campaignListData.length === 0 ? "" :
                                             <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="store-pagination">
                                                <Pagination>
                                                   <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                                   {renderPaginationItems()}
                                                   <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                                </Pagination>
                                             </div>}
                                       </>
                                    )}
                              </div>
                           </div>
                           :

                           <div className="card-body px-0 pt-0 pb-2">
                              <div className="table-responsive p-0">
                              {
                                    loading ? (
                                       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>

                                          <FadeLoader color="#36d7b7" />
                                       </div>
                                    ) : unarchiveListData.length === 0 ? (
                                       <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                    ) : (
                                       <>
                                 <table className="table align-items-center justify-content-center mb-0">
                                    <thead>
                                       <tr className="campaign-action">
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7">Tille</th>
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">Template</th>
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">Template <br /> language</th>
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">Created at</th>
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">Schedule at</th>
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                                          <th className="campaign-table-head campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">Action</th>
                                       </tr>
                                    </thead>
                                    <tbody className="campaign-action">
                                    {unarchiveListData
                                                // .filter((listData:any) => listData.activeStatus === "0")
                                                .map((listData) => (
                                                   <tr>
                                                      <td>
                                                         <div className="d-flex px-2">
                                                            <div className="my-auto">
                                                               <span className="text-sm">
                                                                  {listData?.title}</span>
                                                            </div>
                                                         </div>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {listData?.templateName}</span>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {listData?.tempLang}</span>
                                                      </td>
                                                      <td>
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
                                                      <td>
                                                         <span className="text-sm">
                                                         📅 {new Date(listData.scheduleAt).toLocaleString('en-US', {
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
                                                      <td>
                                                      {listData?.sendStatus === "Executed" ?  
                                                         <span className="text-xs campaign-status">
                                                            {listData?.sendStatus}
                                                         </span>:
                                                         <span className="text-xs campaign-status-warn">
                                                            {listData?.sendStatus}
                                                         </span>}
                                                      </td>
                                                      <td className="align-middle">
                                                      <div className="actionCamp-tooltip-container">
                                                         <button className="btn-3 vendorbtn-edit" onClick={() => navigate(`/vendor/campaign/dashboard/${listData.id}`)} type="button">
                                                         <span className="btn-inner--icon"><i className="fa-solid fa-boxes-stacked"></i></span>
                                                            </button>&nbsp;
                                                            <div className="actionCamp-tooltip-text">
                                                               Campaign dashboard
                                                            </div>
                                                         </div>
                                                         <div className="actionArchive-tooltip-container">
                                                         <button className="btn-3 vendorbtn-archive" type="button" data-bs-toggle="modal" onClick={() => { setCampId(listData?.id);setisArchive(false) }} data-bs-target="#vendorarchive">
                                                            
                                                         <span className="btn-inner--icon">
                                                               <i className="fa-solid fa-box-archive"></i>
                                                            </span>
                                                            </button>
                                                            &nbsp;
                                                            <div className="actionArchive-tooltip-text">
                                                                  Unarchive
                                                            </div>
                                                         </div>
                                                         <div className="actionDelete-tooltip-container">
                                                         <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" onClick={() => { setCampId(listData?.id) }} data-bs-target="#vendordelete">
                                                         <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-trash-can"></i>
                                                            </span>
                                                            </button>
                                                            &nbsp;
                                                            <div className="actionDelete-tooltip-text">
                                                                  Delete
                                                            </div>
                                                         </div>
                                                      </td>
                                                   </tr>
                                                ))}
                                    </tbody>
                                 </table>
                                 <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="store-pagination">
                                                <Pagination>
                                                   <Pagination.Prev onClick={() => handleArchivePageChange(archivecurrentPage - 1)} disabled={archivecurrentPage === 1} />
                                                   {renderArchivePaginationItems()}
                                                   <Pagination.Next onClick={() => handleArchivePageChange(archivecurrentPage + 1)} disabled={archivecurrentPage === totalArchivePages} />
                                                </Pagination>
                                             </div>
                                 </>
                                    )}
                              </div>
                           </div>}
                     </div>
                  </div>
                  {/*Campaign Delete Modal*/}
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
                                 <h6 className="modal-confirm-subhead">You want to delete this campaign ?</h6>
                                 <div></div>
                              </div>
                           </div>
                           <div className="modal-footer text-center vendor-delete-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal">No</button>&nbsp;
                              <button type="button" className="btn btn-primary" onClick={()=>{campaignDelete(campId)}}>Yes</button>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/*Archive Modal*/}
                  <div className="modal fade" id="vendorarchive" tab-Index="-1" aria-labelledby="vendorarchiveLabel" aria-hidden="true">
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
                                 {isArchive? <h6 className="modal-confirm-subhead">You want to archive this campaign?</h6>:<h6 className="modal-confirm-subhead">You want to unarchive this campaign?</h6>}
                                 <div></div>
                              </div>
                           </div>
                           <div className="modal-footer text-center vendor-delete-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closearchiveModal">No</button>&nbsp;
                              <button type="button" className="btn btn-primary" onClick={()=>{isArchive? campaignArchiveActive("deactive"):campaignArchiveActive("active");}} >Yes</button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <Footer />
            </div>
         </main>
      </DashboardLayout>
   )
}

export default Campaigns