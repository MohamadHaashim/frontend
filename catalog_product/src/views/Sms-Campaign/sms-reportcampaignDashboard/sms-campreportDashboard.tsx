import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import './sms-campreportDashboard.css';
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";

function PromotionmanagementSmsCreate() {
   const navigate = useNavigate();
   const [modalMode, setModalMode] = useState("create");
   const [campRepoListData,setcampRepoListData]=useState<any[]>([]);
   const [loading, setLoading] = useState(false);
   const [campDashcount, setcampDashcount] = useState<any>({});
   const [fromDate, setFromDate] = useState('');
   const [toDate, setToDate] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage,setrecordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);
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
   const handlecampRepoList =(page: any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage,
         fromDate: fromDate,
         toDate: toDate
      };
      VendorAPI.smscampaignReportList(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setcampRepoListData(responseData.result.smsCampaignDetails);
               setcampDashcount(responseData?.result);               
               setTotalRecords(responseData.result?.totalRecordCount);
            } else {
               if (responseData.apiStatus.code == "404") {
               setcampRepoListData([]);
               }
               // toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   }
   const handlecampRepoExport =async () => {
      const apiData = {
         fromDate: fromDate,
         toDate: toDate
      };
      try {
         var response;
         response = await VendorAPI.smscampaignExport(apiData);
         const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
         const today = new Date();
         const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear().toString().slice(-2)}`;
         const fileName = `report_data_${formattedDate}.xlsx`;
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", fileName);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
         toast.success(`File downloaded: ${fileName}`);
      } catch (error) {
         console.error("Error downloading file:", error);
      }
   }
  
   useEffect(() => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
      setFromDate(formatDate(startOfMonth));
      setToDate(formatDate(today));
    }, []);
    

    useEffect(()=>{
      if(fromDate && toDate && currentPage && recordsPerPage){
         handlecampRepoList(currentPage);
      }
   },[fromDate,toDate,currentPage,recordsPerPage])
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
                           <li className="breadcrumb-item text-sm grayFont active" aria-current="page">SMS</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0 grayFont">SMS</h6>
                     </nav>
                  </div>
                  <div className="col-md-6 text-end">
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/sms/campaign") }}><i className="fa-solid fa-chevron-left"></i> Back to Campaigns</button>&nbsp;
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/create-smscampaign") }}>Create Campaign</button>&nbsp;
                  </div>
               </div>
            </div>
            <div className="card-body p-3 position-relative">
            <form className="smscard">
            <div>
               <label htmlFor="fromDate" className="textcolor">From</label><br />
               <input
                  type="date"
                  id="fromDate"
                  name="fromDate"
                  className="inputcolor"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
               />
               </div>

               <div>
               <label htmlFor="toDate" className="textcolor">To</label><br />
               <input
                  type="date"
                  id="toDate"
                  name="toDate"
                  className="inputcolor"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
               />
               </div>

               <div>
               <label htmlFor="cLimitars"  className="textcolor">Limit</label><br />
               <select
                  id="cLimitars"
                  name="cLimitars"
                  className="inputcolor"
                  value={recordsPerPage}
                  onChange={(e) => setrecordsPerPage(Number(e.target.value))}
                  >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={40}>40</option>
                  </select>

               </div>

               {/* <div className="submitbutton" >
               <button onClick={handlecampRepoList} type="button" style={{ marginTop: '1.5rem',color:"red",border: '1px solid red',backgroundColor: 'transparent',borderRadius:"7px",width:"100px",height:"30px"}}>                 
               <i className="fa-solid fa-magnifying-glass" style={{marginRight:"5px"}}></i>
                  Search         
                  </button>                  
               </div> */}
               <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
               <div className="dowload" onClick={handlecampRepoExport}>
                 <label htmlFor="dowload"className="dowloadtext cursor-pointer">Dowload</label>
                 <i className="fa-solid fa-download"style={{marginLeft:"5px"}}></i>
               </div>
               </div>
            </form>
            </div>
               <div className="card-body p-3 position-relative" style={{marginTop: "-10px"}}>
               <div className="row" style={{padding:"10px",marginBottom:"-24px"}}>
               <div className="col-lg-12 col-12">
               <div className="row">   
                     <div className="col-lg-3 col-md-3 col-6 dashboard-card">
                        <div className="card">
                              <span className="mask campaign-dash-bg-img1 opacity-10 border-radius-lg"></span>
                              <div className="card-body p-3 position-relative">
                                 <div className="row">
                                    <div className="col-8 text-start">
                                          <div className="icon camp-icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                            <i className="fa-solid fa-check text-white"></i>
                                          </div>
                                          <h5 className=" font-weight-bolder mb-0 mt-3">
                                             {campDashcount?.totalSubmitedCount}
                                          </h5>
                                          <span className=" text-sm">Submitted</span>
                                          {/* <p className=" text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer">Data 2 groups.</p> */}
                                          
                                    </div>
                                    <div className="col-4">
                                          <div className="dropdown text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers1" data-bs-toggle="dropdown" aria-expanded="false">
                                                {/* <i className="fa fa-ellipsis-h "></i> */}
                                             </a>
                                             <ul className="dropdown-menu px-2 py-3" aria-labelledby="dropdownUsers1">
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Something else here</a></li>
                                             </ul>
                                          </div>
                                    </div>
                                 </div>
                              </div>
                        </div>
                     </div>
                     <div className="col-lg-3 col-md-3 col-6 dashboard-card">
                        <div className="card">
                              <span className="mask campaign-dash-bg-img2 opacity-10 border-radius-lg"></span>
                              <div className="card-body p-3 position-relative">
                                 <div className="row">
                                    <div className="col-8 text-start">
                                          <div className="icon camp-icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-solid fa-check-double text-white"></i>
                                          </div>
                                          <h5 className=" font-weight-bolder mb-0 mt-3">
                                             {campDashcount?.totalDeliveredCount}
                                          </h5>
                                          <span className=" text-sm">Delivered</span>
                                          {/* <p className=" text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer">2 Contacts</p> */}
                                    </div>
                                    <div className="col-4">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                {/* <i className="fa fa-ellipsis-h "></i> */}
                                             </a>
                                             <ul className="dropdown-menu px-2 py-3" aria-labelledby="dropdownUsers2">
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Something else here</a></li>
                                             </ul>
                                          </div>
                                    </div>
                                 </div>
                              </div>
                        </div>
                     </div>
                     <div className="col-lg-3 col-md-3 col-6 dashboard-card">
                        <div className="card">
                              <span className="mask campaign-dash-bg-img3 opacity-10 border-radius-lg"></span>
                              <div className="card-body p-3 position-relative">
                                 <div className="row">
                                    <div className="col-8 text-start">
                                          <div className="icon camp-icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                          <i className="fa-solid fa-hourglass-half text-white"></i>                                          </div>
                                          <h5 className=" font-weight-bolder mb-0 mt-3">
                                             {campDashcount?.totalAwaitedCount}
                                          </h5>
                                          <span className=" text-sm">Awaited</span>
                                          {/* <p className=" text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer">2 Contacts</p> */}
                                    </div>
                                    <div className="col-4">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                {/* <i className="fa fa-ellipsis-h "></i> */}
                                             </a>
                                             <ul className="dropdown-menu px-2 py-3" aria-labelledby="dropdownUsers2">
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Something else here</a></li>
                                             </ul>
                                          </div>
                                    </div>
                                 </div>
                              </div>
                        </div>
                     </div>
                     <div className="col-lg-3 col-md-3 col-6 dashboard-card">
                        <div className="card">
                              <span className="mask campaign-dash-bg-img4 opacity-10 border-radius-lg"></span>
                              <div className="card-body p-3 position-relative">
                                 <div className="row">
                                    <div className="col-8 text-start">
                                          <div className="icon camp-icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-solid fa-circle-exclamation text-white"></i>
                                          </div>
                                          <h5 className=" font-weight-bolder mb-0 mt-3">
                                             {campDashcount?.totalFailedCount}
                                          </h5>
                                          <span className=" text-sm">Failed</span>
                                          {/* <p className=" text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer">1 Contacts</p> */}
                                    </div>
                                    <div className="col-4">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                {/* <i className="fa fa-ellipsis-h "></i> */}
                                             </a>
                                             <ul className="dropdown-menu px-2 py-3" aria-labelledby="dropdownUsers2">
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Another action</a></li>
                                                <li><a className="dropdown-item border-radius-md" href="javascript:;">Something else here</a></li>
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
                                 ) : campRepoListData.length === 0 ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <>
                              <table className="table align-items-center justify-content-center mb-0">
                                 <thead>
                                    <tr className="vendor-table-mainhead">
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Date</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Submitted</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Deliver</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Falied</th>
                                       <th className="vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">Awaited</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {campRepoListData.map((listData:any)=>(
                                    <tr>
                                       <td>
                                          <div className="d-flex px-2">

                                             <div>
                                             </div>
                                             <div className="my-auto">
                                                <h6 className="mb-0 text-sm">{listData?.date}</h6>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="align-middle text-start text-sm">
                                          <span className="text-sm">
                                            {listData?.submited}
                                          </span>
                                       </td>
                                       <td className="align-middle text-start text-sm">
                                          <span className="text-sm">
                                             {listData?.delivered}
                                          </span>
                                       </td>
                                       <td className="align-middle vendor-login-td">
                                          <span className="text-sm">
                                             {listData?.failed}
                                          </span>
                                       </td>
                                       <td className="align-middle vendor-login-td">
                                          <span className="text-sm">
                                             {listData?.awaited}
                                          </span>
                                       </td>                                      
                                    </tr>
                                    ))}
                                 </tbody>
                              </table>
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="store-pagination">
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

export default PromotionmanagementSmsCreate;