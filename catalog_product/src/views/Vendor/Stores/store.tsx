import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Spotify from "../../../assets/img/small-logos/logo-spotify.svg";
import Slack from "../../../assets/img/small-logos/logo-slack.svg";

import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import "./store.css"
// import MasterAPI from "../../../api/services/masterApi";
import { toast } from "react-toastify";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { Pagination } from "react-bootstrap";
import API from "../../../api/api";
import API_EP_BOOK from "../../../api/endpoints";
import Footer from "../../../shared/Footer";
import { FadeLoader } from "react-spinners";
import { useErrorHandler } from "../../../ErrorHandleContext";


interface StoreList {
   storeId: string;
   storeUid: string;
   storeName: any;
   storeAddressLine1: string;
   storeAddressLine2: string;
   storeDist: string;
   storeState: string;
   storePincode: string;
   storePhone: string;
   storeEmail: string;
   storeStatus: string;
}

function VendorStore() {
   const navigate = useNavigate();
   const handleError = useErrorHandler();
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [modalMode, setModalMode] = useState("create");
   const [vendorListData, setVendorListData] = useState<StoreList[]>([]);
   const [storeName, setStorename] = useState("")
   const [storeIds, setStoreId] = useState("")
   const [active, setActive] = useState(true)
   const [vendorId, setVendorId] = useState("")
   const [phone, setPhone] = useState("")
   const [address1, setAddress1] = useState("")
   const [address2, setAddress2] = useState("")
   const [district, setDistrict] = useState("")
   const [state, setState] = useState("")
   const [pincode, setPincode] = useState("")
   const [email, setEmail] = useState("")
   const [submit, setSubmit] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(10);
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
   const handlePhoneChange = (e: { target: { value: string } }) => {
      let value = e.target.value;
      if (value === "" || /^\+?[0-9]*$/.test(value)) {
         setPhone(value);
      }
   };
   const openModal = (mode: any) => {
      setModalMode(mode);
   };
   const resetForm = () => {
      setStorename("");
      setVendorId("");
      setPhone("");
      setEmail("");
      setAddress1("");
      setAddress2("");
      setDistrict("");
      setState("");
      setPincode("");
      setFileName("");
      setFile(null);
      setSubmit(false);
   }
   const handlecreateStore = () => {
      setSubmit(true);
      if (!storeName || !phone || !address1 || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
         return;
      }
      const apiData = {
         ...(modalMode === "edit" && { id: storeIds }),
         storeName: storeName,
         addressLine1: address1,
         addressLine2: address2,
         district: district,
         state: state,
         pincode: pincode,
         phone: phone,
         email: email
      };
      const apiCall = modalMode === "create" ? VendorAPI.createStore(apiData) : VendorAPI.updateStore(apiData);
      apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               resetForm();
               handleStoreList(currentPage);
               setSubmit(false);
               toast.success(responseData.apiStatus.message);
               const closeButton = document.getElementById("closeModal");
               if (closeButton) {
                  closeButton.click();
               }
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };
   const handleGetStore = (storeId: any) => {
      VendorAPI.getStoreByIdAPIEP(storeId)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               // setStoreId(responseData.result.store_id);
               setStorename(responseData.result.storeName);
               setAddress1(responseData.result.storeAddressLine1);
               setAddress2(responseData.result.storeAddressLine2);
               setDistrict(responseData.result.storeDist);
               setState(responseData.result.storeState);
               setPincode(responseData.result.storePincode);
               setPhone(responseData.result.storePhone);
               setEmail(responseData.result.storeEmail);
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };
   const handleActiveStore = (name: any) => {
      const apiCall = name === 'active' ? VendorAPI.storeActiveAPIEP(storeIds) : VendorAPI.storeDeactiveAPIEP(storeIds);
      apiCall
             .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData.apiStatus.message);
               handleStoreList(currentPage);
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
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };
   const handleDeleteStore = () => {
      VendorAPI.deleteStoreAPIEP(storeIds)
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
                  handleStoreList(currentPage);
                  closeButton.click();
               }
               toast.success(responseData.apiStatus.message);
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };


   const handleStoreList = (page: any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.listStoreData(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setVendorListData(responseData.result.StoreData)
               setTotalRecords(responseData.result.totalRecordCount)
            } else {
               if (responseData.apiStatus.code == "404") {
               setVendorListData([]);
               }
               // toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false);
            handleError(error);
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   }
   const [file, setFile] = useState<File | null>(null);
   const [fileName, setFileName] = useState("");
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);
         setFileName(selectedFile.name);
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
      }
   };
const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) {
        setFile(droppedFile);
        setFileName(droppedFile.name);
      }
    };  
   const handleImport = async () => {
      if (!file) {
         toast.error("Please select a file to import.");
         return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
         const response = await VendorAPI.importStore(formData);
         if (response.apiStatus?.code === "200") {
            handleStoreList(currentPage)
            toast.success(response.apiStatus.message);
            document.getElementById("closepopup")?.click();
         } else {
            toast.error(response.apiStatus?.message || "File import failed.");
         }
      } catch (error) {
         console.error("Import Error:", error);
         toast.error("An error occurred while importing the file.");
      }
   };

   const handleExport = async (name:any) => {
      try {
         var response;
         if(name==="withData"){
             response = await VendorAPI.exportStore();
         }else{
             response = await VendorAPI.exportHeaderStore();
         }
         const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
         const today = new Date();
         const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear().toString().slice(-2)}`;
         const fileName = `store_data_${formattedDate}.xlsx`;
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
   };
   useEffect(() => {
      handleStoreList(currentPage);
   }, [currentPage])
   //For the modal is outside_close

   useEffect(() => {
      const modalElements = [
        document.getElementById('vendorview'),
        document.getElementById('vendorcreate'),
        document.getElementById('vendordelete'),
        document.getElementById('exampleModal'),
        document.getElementById('vendorActive'),
      ];
      const handleHidden = () => {resetForm();};
      modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
      return () => {
        modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
      };
    }, []);
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <TopNav />
            <div className="container-fluid py-1">
               <div className="row">
                  <div className="col-md-6">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                           <li className="breadcrumb-item text-sm "><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                           <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Stores</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0 grayFont">Stores</h6>
                     </nav>
                  </div>
                  <div className="col-md-6 text-end">
                     <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorcreate" onClick={() => openModal("create")}>Create Store</button>&nbsp;
                     <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" >Import</button>&nbsp;
                     <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorExport">Export</button>
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
                                 ) : vendorListData.length === 0 ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <>
                                       <table className="table align-items-center justify-content-center mb-0">
                                          <thead>
                                             <tr>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7">Store Name</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Address</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Phone & Email</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Action</th>
                                             </tr>
                                          </thead>
                                          <tbody className="table-tbody-list">
                                             {vendorListData.map((listData, id) => (
                                                <tr>
                                                   <td>
                                                      <div className="d-flex px-2">
                                                         <div>
                                                            <img src={Slack} className="avatar avatar-sm rounded-circle me-2" alt="spotify" />
                                                         </div>
                                                         <div className="my-auto">
                                                            <h6 className="mb-0 text-sm grayFont">{listData.storeName}</h6>
                                                         </div>
                                                      </div>
                                                   </td>
                                                   <td>
                                                      <span className="text-sm">
                                                         {listData.storeAddressLine1}</span>
                                                   </td>
                                                   <td>
                                                      <span className="text-sm">
                                                         {listData.storePhone}<br />
                                                         {listData.storeEmail}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <div className="form-check form-switch ms-1 is-filled">
                                                         <input
                                                            onChange={() => {
                                                               if (listData.storeStatus === "1") {
                                                                  setStoreId(listData.storeId);
                                                                  setActive(false);
                                                                  setStorename(listData?.storeName)
                                                               } else if (listData.storeStatus === "0") {
                                                                  setStoreId(listData.storeId);
                                                                  setActive(true);
                                                                  setStorename(listData?.storeName)
                                                               }
                                                            }}
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckDefault"
                                                            data-bs-toggle="modal" data-bs-target="#vendorActive"
                                                            checked={listData.storeStatus === "1"}
                                                         />

                                                      </div>
                                                   </td>
                                                   <td className="align-middle text-center">
                                                      <div className="actionView-tooltip-container">
                                                         <button onClick={() => handleGetStore(listData.storeId)} data-bs-toggle="modal" data-bs-target="#vendorview" className="btn-3 vendorbtn-view" type="button">
                                                            <span className="btn-inner--icon"><i className="fa-solid fa-eye"></i></span>
                                                         </button>&nbsp;
                                                         <div className="actionView-tooltip-text">
                                                            View
                                                         </div>
                                                      </div>
                                                      <div className="actionEdit-tooltip-container">
                                                         <button onClick={() => { handleGetStore(listData.storeId); openModal("edit"); setStoreId(listData.storeId) }} className="btn-3 vendorbtn-edit" type="button" data-bs-toggle="modal" data-bs-target="#vendorcreate">
                                                            <span className="btn-inner--icon"><i className="fa-regular fa-pen-to-square"></i></span>
                                                         </button>&nbsp;
                                                         <div className="actionEdit-tooltip-text">
                                                            Edit
                                                         </div>
                                                      </div>
                                                      <div className="actionDelete-tooltip-container">
                                                         <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" onClick={() => { setStoreId(listData.storeId);setStorename(listData?.storeName) }} data-bs-target="#vendordelete">
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
                              {/*Store Create and Edit Modal*/}
                              <div className="modal fade" id="vendorcreate" tab-Index="-1" aria-labelledby="vendorcreateLabel" aria-hidden="true">
                                 <div className="modal-dialog modal-lg ">
                                    <div className="modal-content all-modal-content vendorcreate-modal-content">
                                       <div className="modal-header vendorcreate-modal-header border-0">
                                          <h5 className="modal-title mb-3 vendorcreate-modal-title" id="vendorcreateLabel">
                                             {modalMode === "create" ? "Create Store" : "Edit Store"}
                                          </h5>
                                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                       </div>
                                       <div className="row modal-container-size modal-body vendorcreate-modal-body">
                                          <div className="row mt-n4">
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setStorename(e.target.value)} value={storeName} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !storeName ? 'error' : ''}`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-store"></i> Store Name</label>
                                                </div>
                                                {submit && storeName.length == 0 ? <div className='text-danger error-message-required'>Store Name is required</div> : <></>}

                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={handlePhoneChange} value={phone} type="text" id="vendor-crt-input" 
                                                   className={`vendor-crt-input loginfilled-frame-username  ${(submit && !phone) || (phone.length > 0 && phone.length < 10) ? 'error' : ''}`}
                                                   placeholder=" " maxLength={12} required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-button"></i> Mobile Number</label>
                                                </div>
                                                {submit && phone.length == 0 ? <div className='text-danger error-message-required'>Mobile.No is required</div> : <></>}
                                                {phone.length < 10 && phone.length > 0 && (<div className="text-danger error-message-required">Mobile.No should be at least 10 digits</div>)}

                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setEmail(e.target.value)} value={email} type="text" id="vendor-crt-input"
                                                      style={submit && !email || (email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}
                                                      className={`vendor-crt-input loginfilled-frame-username ${submit && !email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) ? 'error' : ''}`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                                                </div>
                                                {submit && email.length === 0 ? (<div className="text-danger error-message-required">Email is required</div>) : (
                                                   <>
                                                      {email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (<div className="text-danger error-message-required">Invalid email format</div>)}
                                                   </>
                                                )}
                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setAddress1(e.target.value)} value={address1} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !address1 ? 'error' : ''}`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-location-dot"></i> Address Line 1</label>
                                                </div>
                                                {submit && address1.length == 0 ? <div className='text-danger error-message-required'>Address Line 1 is required</div> : <></>}

                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setAddress2(e.target.value)} value={address2} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-location-dot"></i> Address Line 2</label>
                                                </div>

                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setDistrict(e.target.value)} value={district} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-map-location-dot"></i> District</label>
                                                </div>

                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setState(e.target.value)} value={state} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-location-crosshairs"></i> State</label>
                                                </div>

                                             </div>
                                             <div className="col-md-6 login-input-group">
                                                <div className="vendor-create-container">
                                                   <input autoComplete="off" onChange={(e) => setPincode(e.target.value)} value={pincode} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-street-view"></i> Pincode</label>
                                                </div>

                                             </div>
                                          </div>
                                       </div>
                                       <div className="modal-footer vendorcreate-modal-footer border-0">
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm} id="closeModal">Close</button>
                                          {modalMode === "create" ? (
                                             <button type="button" className="btn btn-primary" onClick={handlecreateStore}>
                                                Create
                                             </button>
                                          ) : (
                                             <button type="button" className="btn btn-primary" onClick={handlecreateStore}>
                                                Update
                                             </button>
                                          )}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              {/* Staff Export */}
                              <div className="modal fade" id="vendorExport" aria-labelledby="vendorExportLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                       <div className="modal-content all-modal-content">
                                          <div className="modal-header vendor-view-header">
                                             <h1 className="modal-title fs-6 mb-3 text-center" id="vendorExportLabel">Export Store</h1>
                                          </div>
                                          <div className="p-0 modal-body text-center ">
                                             <div className="exportwithData">
                                                <p className="exportwithData-para">Export with Data</p>
                                                <p className="exportwithData-para1">You can export all store excel file and import it back with updated data.</p>
                                                <button className="exportwithData-btn" onClick={()=>{handleExport("withData")}}>
                                                   Export Excel File With Data
                                                </button>
                                             </div>
                                             {/* <hr className="exportModal-hr"/>
                                             <div className="exportwithoutData">
                                                <p className="exportwithData-para">Blank Excel Template</p>
                                                <p className="exportwithData-para1">You can export blank excel file and fill with data according to column header and import it for updates.</p>
                                                <button className="exportwithData-btn" onClick={()=>{handleExport("withoutData")}}>
                                                   Export Blank Template
                                                </button>
                                             </div> */}
                                          </div>
                                          <div className="modal-footer text-end vendor-view-footer">
                                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              {/* Store View */}
                              <div className="modal fade" id="vendorview" aria-labelledby="vendorviewLabel" aria-hidden="true">
                                 <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content all-modal-content">
                                       <div className="modal-header vendor-view-header">
                                          <h1 className="modal-title fs-6 mb-3 text-center" id="vendorviewLabel">View</h1>
                                       </div>
                                       <div className="p-0 modal-body text-center ">
                                          <div className="row">
                                             <div className="col-md-4 mt-n3 vendor-login-icon store-view-label">
                                                <img src={Slack} alt="" />
                                                <p className="p-0 mt-n4 mb-1">{storeName}</p>
                                             </div>
                                             <div className="col-md-8 mt-1">
                                                <div className="d-flex gap-3">
                                                <div className="text-start store-view-label">
                                                      <p className="mb-1">Store Name:</p>
                                                      <p className="mb-1">Address:</p>
                                                      <p className="mb-1">Phone:</p>
                                                      <p className="mb-1">Email:</p>
                                                   </div>
                                                   <div className="text-start store-view-label">
                                                      <p className="mb-1">{storeName}</p>
                                                      <p className="mb-1">{address1}</p>
                                                      <p className="mb-1">{phone}</p>
                                                      <p className="mb-1 ml-n2">{email}</p>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                       <div className="modal-footer text-end vendor-view-footer">
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Close</button>
                                          {/*<button type="button" class="btn btn-primary">Save changes</button>*/}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              {/* Store Import Modal */}
                              <div
                                 className="modal fade"
                                 id="exampleModal"
                                 aria-labelledby="exampleModalLabel"
                                 aria-hidden="true"
                              >
                                 <div className="modal-dialog">
                                    <div className="modal-content all-modal-content">
                                       <div className="modal-header import-popup-header">
                                          <h1 className="modal-title fs-5" id="exampleModalLabel">
                                             Import Store
                                          </h1>
                                          <div>
                                             <button className="vendor-crt-btn import-sample-filebtn" onClick={()=>{handleExport("withoutData")}}><i className="fa-solid fa-file-download"></i> Sample File</button>
                                          </div>
                                       </div>
                                       <div className="modal-body text-center">
                                          <form className="form-container" encType="multipart/form-data">
                                             <div className="upload-files-container" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
                                                <div className="drag-file-area">
                                                   <i className="fa-solid fa-cloud-arrow-up import-staff-icon"></i>
                                                   <h5 className="dynamic-message mt-2 mb-n1 grayFont">
                                                      Drop Anywhere to Import
                                                   </h5>
                                                   <label className="label grayFont">
                                                      or{" "}
                                                      <span className="browse-files">
                                                         <input
                                                            type="file"
                                                            className="default-file-input"
                                                            autoComplete="off" onChange={handleFileChange} ref={fileInputRef}
                                                         />
                                                         <span className="browse-files-text text-dark">
                                                            browse file
                                                         </span>{" "}
                                                         <span className="grayFont">from device</span>
                                                      </span>
                                                   </label>
                                                </div>
                                                {fileName && (
                                                   <div className="file-name mt-2">Selected File: {fileName}</div>
                                                )}
                                             </div>
                                          </form>
                                       </div>
                                       <div className="modal-footer import-popup-footer">
                                          <button type="button" onClick={() => { setFileName('') }} className="btn btn-secondary" data-bs-dismiss="modal" id="closepopup">
                                             Close
                                          </button>
                                          <button type="button" className="btn btn-primary import-btn-bg" onClick={handleImport}>
                                             Import
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              {/*Store Active Modal*/}
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
                                             <h6 className="modal-confirm-subhead">You want to active this {storeName} store ?</h6>:
                                             <h6 className="modal-confirm-subhead">You want to deactive this {storeName} store ?</h6>}
                                             <div></div>
                                          </div>
                                       </div>
                                       <div className="modal-footer text-center vendor-delete-footer">
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeactiveModal">No</button>&nbsp;
                                          <button type="button" className="btn btn-primary" onClick={()=>{active? handleActiveStore("active"):handleActiveStore("deactive")}} >Yes</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                              {/*Store Delete Modal*/}
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
                                             <h6 className="modal-confirm-subhead">You want to delete this {storeName} store ?</h6>
                                             </div>
                                       </div>
                                       <div className="modal-footer text-center vendor-delete-footer">
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal">No</button>&nbsp;
                                          <button type="button" className="btn btn-primary" onClick={handleDeleteStore} >Yes</button>
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
            </div>
         </main>
      </DashboardLayout>
   )
}

export default VendorStore;