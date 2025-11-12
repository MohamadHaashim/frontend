import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg"
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import Spotify from "../../../assets/img/small-logos/logo-spotify.svg";
import Invision from "../../../assets/img/small-logos/logo-invision.svg";
import Jira from "../../../assets/img/small-logos/logo-jira.svg";
import Slack from "../../../assets/img/small-logos/logo-slack.svg";
import Webdev from "../../../assets/img/small-logos/logo-webdev.svg";
import Adobe from "../../../assets/img/small-logos/logo-xd.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import "./staff.css";
import { Pagination } from "react-bootstrap";
import API_EP_BOOK from "../../../api/endpoints";
import API from "../../../api/api";
import Footer from "../../../shared/Footer";
import { FadeLoader } from "react-spinners";

interface StaffList {
   id: string;
   store_id: string;
   uid: string;
   first_name: any;
   last_name: string;
   user_name: string;
   email: string;
   mobile: string;
   created_date: string;
   activeStatus: string;
}
interface StoreDrop {
   id: string;
   store_name: string;
}
function VendorStaff() {
   const navigate = useNavigate();
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const [staffListData, setStaffListData] = useState<StaffList[]>([]);
   const [storeDrop, setStoreDrop] = useState<StoreDrop[]>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);
   const [loading, setLoading] = useState(false);
   const [exportLoading, setexportLoading] = useState(false);
   const [importLoading, setimportLoading] = useState(false);
   const [submit, setSubmit] = useState(false);
   const [modalMode, setModalMode] = useState("create");
   const [staffId, setStaffId] = useState("")
   const [active, setActive] = useState(true)
   const [staffName, setStaffName] = useState("");
   const [storeName, setStoreName] = useState("");
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [storeId, setStoreId] = useState("");
   const [mobileno, setMobileno] = useState("");
   const [email, setEmail] = useState("");
   const [password, setpassword] = useState("");
   const [confirmPassword, setconfirmPassword] = useState("");
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };
   const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
   };
   const handlePhoneChange = (e: { target: { value: string } }) => {
      let value = e.target.value;
      if (value === "" || /^\+?[0-9]*$/.test(value)) {
         setMobileno(value);
      }
   };
   const isValidPhoneNumber = (number: string): boolean => {
      const phoneRegex = /^\+[1-9][0-9]{1,14}$/;
      return phoneRegex.test(number);
   };
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
   
   const resetForm = () => {
      setStaffName("");
      setStoreName("");
      setStaffId("");
      setStoreId("");
      setMobileno("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setpassword("");
      setconfirmPassword("");
      setFileName("");
      setFile(null);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setSubmit(false);
   }

   const handlecreateStaff = () => {
      setSubmit(true);
      if (modalMode === "create") {
         if (!staffName || !mobileno || !firstName || !password || !confirmPassword || !mobileno || !storeId || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
            return;
         }
         else {
            if (!staffName || !mobileno || !firstName || !mobileno || !storeId || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
               return;
            }
         }
      }
      const apiData = {
         ...(modalMode === "edit" && { userId: staffId }),
         firstName: firstName,
         lastName: lastName,
         username: staffName,
         email: email,
         password: password,
         confirmPassword: confirmPassword,
         storeId: storeId,
         phone: mobileno,
         privilege: [{
            privilegeName: "admin",
            privilegeId: 1
         }
         ]
      };
      const apiCall = modalMode === "create" ? VendorAPI.createStaff(apiData) : VendorAPI.updateStaff(apiData);
      apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               resetForm();
               handleStaffList(currentPage);
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
            console.error(modalMode === "create" ? "Error while creating:" : "Error while updating:", error);
            toast.error(modalMode === "create" ?"An error occurred while creating.": "An error occurred while updating.");
         });
   };
   const handleGetStaff = (storeId: any) => {
      VendorAPI.getStaffByIdAPIEP(storeId)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setStoreId(responseData.staffDetails.storeDetails.store_id);
               setStaffName(responseData.staffDetails.user_name);
               setFirstName(responseData.staffDetails.first_name);
               setLastName(responseData.staffDetails.last_name);
               setStoreName(responseData.staffDetails.storeDetails.store_name);
               setEmail(responseData.staffDetails.email);
               setMobileno(responseData.staffDetails.mobile);
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error while fetching staff values:", error);
            toast.error("An error occurred while fetching staff values.");
         });
   };
   const handleActiveStaff = (name: any) => {
      const apiCall = name === 'active' ? VendorAPI.staffActiveAPIEP(staffId) : VendorAPI.staffDeactiveAPIEP(staffId);
         apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData.apiStatus.message);
               handleStaffList(currentPage);
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
            console.error( name === 'active' ? "Error while fetching staff active:":"Error while fetching staff deactive", error);
            toast.error( name === 'active' ? "An error occurred while fetching staff active.":"An error occurred while fetching staff active.");
         });
   };

   const handleGetStoreDrop = () => {
      VendorAPI.getStoreDropAPIEP()
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setStoreDrop(responseData.result.StoreDataDropDown);
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error while fetching store dropdown data:", error);
            toast.error("An error occurred while fetching store dropdown data.");
         });
   };
   //Store Dropdown Filter
   const filteredStoreDrop = storeDrop.filter((dropdownValue) =>
      (dropdownValue?.store_name || '').toLowerCase().includes((storeName || '').toLowerCase())
    );
   const handleDeleteStaff = () => {
      VendorAPI.deleteStaffAPIEP(staffId)
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
                  handleStaffList(currentPage);
                  closeButton.click();
               }
               toast.success(responseData.apiStatus.message)
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

   const handleStaffList = (page: any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.listStaffData(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setLoading(false)
               setStaffListData(responseData.staffDetails.StaffData)
               setTotalRecords(responseData.staffDetails.totalRecordCount)
            } else {
               if (responseData.apiStatus.code == "404") {
               setStaffListData([])
               }
               // toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error while fetching staff details:", error);
            toast.error("An error occurred while fetching staff details.");
         });
   }

   useEffect(() => {
      handleStaffList(currentPage);
   }, [currentPage])
   useEffect(()=>{
      handleGetStoreDrop()
   },[])

   const token = localStorage.getItem("userToken");
   const [file, setFile] = useState<File | null>(null);
   const [fileName, setFileName] = useState("");
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
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
      setSubmit(true);
      if (!file) {return}
      setimportLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      try {
         const response = await VendorAPI.importStaff(formData);
         if (response.apiStatus?.code === "200") {
            handleStaffList(currentPage)
            toast.success(response.apiStatus.message);
            setSubmit(false);
            setimportLoading(false);
            document.getElementById("closepopup")?.click();
         } else {
            toast.error(response.apiStatus?.message || "File import failed.");
            setimportLoading(false);
         }
      } catch (error) {
         console.error("Import Error:", error);
         setimportLoading(false);
         toast.error("An error occurred while importing the file.");
      }
   };

   const handleExport = async (name:any) => {
      setexportLoading(true);
      try {
         var response;
         if(name==="withData"){
            response = await VendorAPI.exportStaff()
         }else{
            response = await VendorAPI.exportHeaderStaff()
         }
         const blob = new Blob([response], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         });

         // Validate that blob has size
         if (blob.size === 0) {
            throw new Error("Empty file received from server.");
         }
         const today = new Date();
         const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear().toString().slice(-2)}`;
         const fileName = `staff_data_${formattedDate}.xlsx`;
         var url = window.URL.createObjectURL(blob);
         var link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", fileName);
         document.body.appendChild(link);
         // link.target="_blank";
         link.click();
         setTimeout(function(){
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
         },100);
         // link.remove();
         toast.success(`File downloaded: ${fileName}`);
         setexportLoading(false);
      } catch (error) {
         setexportLoading(false);
         console.error("Error downloading file:", error);
         toast.error("Failed to download the file. Please try again.");
      }
   };
  
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
      <>
         <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
               <TopNav />
               <div className="container-fluid py-1">
                  <div className="row">
                     <div className="col-md-6">
                        <nav aria-label="breadcrumb">
                           <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                              <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Staffs</li>
                           </ol>
                           <h6 className="text-start font-weight-bolder mb-0">Staffs</h6>
                        </nav>
                     </div>
                     <div className="col-md-6 text-end">
                        <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorcreate" onClick={() => openModal("create")}>Create Staff</button>&nbsp;
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
                                    ) : staffListData.length === 0 ? (
                                       <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                    ) : (
                                       <>
                                          <table className="table align-items-center justify-content-center mb-0">
                                             <thead>
                                                <tr>
                                                   <th className="staff-table-head text-secondary text-sm font-weight-bolder opacity-7">Staff Name</th>
                                                   <th className="staff-table-head text-secondary text-sm font-weight-bolder opacity-7 ps-2">Email</th>
                                                   <th className="staff-table-head text-secondary text-sm font-weight-bolder opacity-7 ps-2">Phone</th>
                                                   <th className="staff-table-head text-secondary text-sm font-weight-bolder opacity-7 ps-2">Created At</th>
                                                   <th className="staff-table-head text-secondary text-sm font-weight-bolder opacity-7 ps-2">Status</th>
                                                   <th className="staff-table-head text-secondary text-sm font-weight-bolder text-center opacity-7 ps-2">Action</th>
                                                </tr>
                                             </thead>
                                             <tbody className="table-tbody-list">
                                                {staffListData.map((listData, id) => (
                                                   <tr>
                                                      <td>
                                                         <div className="d-flex px-2">
                                                            <div>
                                                               <img src={Jira} className="avatar avatar-sm rounded-circle me-2" alt="spotify" />
                                                            </div>
                                                            <div className="my-auto">
                                                               <h6 className="mb-0 text-sm">{listData.user_name}</h6>
                                                            </div>
                                                         </div>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {listData.email}</span>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {listData.mobile}
                                                         </span>
                                                      </td>
                                                      <td>
                                                         <span className="text-sm">
                                                            {new Date(listData.created_date).toLocaleString('en-US', {
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
                                                         <div className="form-check form-switch ms-1 is-filled">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                                               onChange={() => {
                                                                  if (listData.activeStatus === "1") {
                                                                     setStaffId(listData.id);
                                                                     setActive(false);
                                                                     setStaffName(listData?.user_name)
                                                                  } else if (listData.activeStatus === "0") {
                                                                     setStaffId(listData.id);
                                                                     setActive(true);
                                                                     setStaffName(listData?.user_name)
                                                                  }
                                                               }}
                                                               data-bs-toggle="modal" data-bs-target="#vendorActive"
                                                               checked={listData.activeStatus === "1"} />
                                                         </div>
                                                      </td>
                                                      <td className="align-middle text-center">
                                                         <div className="actionView-tooltip-container">
                                                            <button onClick={() => handleGetStaff(listData.id)} className="btn-3 vendorbtn-view" type="button" data-bs-toggle="modal" data-bs-target="#vendorview">
                                                               <span className="btn-inner--icon"><i className="fa-solid fa-eye"></i></span>
                                                            </button>&nbsp;
                                                            <div className="actionView-tooltip-text">
                                                               View
                                                            </div>
                                                         </div>
                                                         <div className="actionEdit-tooltip-container">
                                                            <button onClick={() => { handleGetStaff(listData.id); openModal("edit"); setStaffId(listData.id) }} className="btn-3 vendorbtn-edit" type="button" data-bs-toggle="modal" data-bs-target="#vendorcreate">
                                                               <span className="btn-inner--icon"><i className="fa-regular fa-pen-to-square"></i></span>
                                                            </button>&nbsp;
                                                            <div className="actionEdit-tooltip-text">
                                                               Edit
                                                            </div>
                                                         </div>
                                                         <div className="actionDelete-tooltip-container">
                                                            <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" onClick={() => { setStaffId(listData.id);setStaffName(listData?.user_name) }} data-bs-target="#vendordelete">
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
                                 {/*Staff Create and Edit Modal*/}
                                 <div className="modal fade" id="vendorcreate" tab-Index="-1" aria-labelledby="vendorcreateLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg modal-dialog-centered">
                                       <div className="modal-content all-modal-content vendorcreate-modal-content">
                                          <div className="modal-header vendorcreate-modal-header border-0">
                                             <h5 className="modal-title mb-3 vendorcreate-modal-title" id="vendorcreateLabel">
                                                {modalMode === "create" ? "Create Staff" : "Edit Staff"}
                                             </h5>
                                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                          </div>
                                          <div className="row modal-container-size modal-body vendorcreate-modal-body">
                                             <div className="row mt-n4">
                                                <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container">
                                                      <input autoComplete="off" onChange={(e) => setStaffName(e.target.value)} value={staffName} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !staffName ? 'error' : ''}`} placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Staff Name</label>
                                                   </div>
                                                   {submit && staffName.length == 0 ? <div className='text-danger error-message-required'>Staff Name is required</div> : <></>}
                                                </div>
                                                <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container">
                                                      <input autoComplete="off" onChange={(e) => setFirstName(e.target.value)} value={firstName} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !firstName ? 'error' : ''}`} placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> First Name</label>
                                                   </div>
                                                   {submit && firstName.length == 0 ? <div className='text-danger error-message-required'>First Name is required</div> : <></>}
                                                </div>
                                                <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container">
                                                      <input autoComplete="off" onChange={(e) => setLastName(e.target.value)} value={lastName} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Last Name</label>
                                                   </div>
                                                </div>
                                                <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                      <input
                                                         autoComplete="off"
                                                         type="text"
                                                         onClick={handleGetStoreDrop}
                                                         id="vendor-crt-input"
                                                         className={`vendor-crt-input loginfilled-frame-username ${submit && !storeId ? 'error' : ''}`}
                                                         value={storeName}
                                                         placeholder=" "
                                                         required
                                                         onChange={(e)=>setStoreName(e.target.value)}
                                                      />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Store Name</label>
                                                      <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                      <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                      {filteredStoreDrop.length === 0 ? (
                                                            <li className="dropdown-nodata-found">No data found</li>
                                                         ) : (
                                                            filteredStoreDrop.map((dropdownValue, id) => (                                                            
                                                            <li key={id}>
                                                               <a
                                                                  className="dropdown-item"
                                                                  href="#"
                                                                  onClick={() => { setStoreId(dropdownValue.id); setStoreName(dropdownValue.store_name) }}
                                                               >
                                                                  {dropdownValue.store_name}
                                                               </a>
                                                            </li>
                                                         )))}
                                                      </ul>
                                                   </div>
                                                   {submit && storeId.length == 0 ? <div className='text-danger error-message-required'>Store Name is required</div> : <></>}
                                                </div>

                                                <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container">
                                                      <input autoComplete="off" onChange={handlePhoneChange}
                                                         maxLength={12}
                                                         value={mobileno}
                                                       type="text" id="vendor-crt-input" 
                                                       className={`vendor-crt-input loginfilled-frame-username ${(submit && !mobileno) || (mobileno.length > 0 && mobileno.length < 10) ? 'error' : ''}`} placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-button"></i> Mobile Number</label>
                                                   </div>
                                                   {submit && mobileno.length == 0 ? <div className='text-danger error-message-required'>Mobile.No is required</div> : <></>}
                                                   {mobileno.length < 10 && mobileno.length > 0 && (<div className="text-danger error-message-required">Mobile.No should be at least 10 digits</div>)}
                                                </div>
                                                <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container">
                                                      <input autoComplete="off" onChange={(e) => setEmail(e.target.value)} value={email} type="text" id="vendor-crt-input"
                                                         style={submit && !email || (email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}
                                                         className={`vendor-crt-input loginfilled-frame-username ${submit && !email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) ? 'error' : ''}`} placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                                                   </div>
                                                   {submit && email.length === 0 ? (
                                                      <div className="text-danger error-message-required">Email is required</div>
                                                   ) : (
                                                      <>
                                                         {email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                                                            <div className="text-danger error-message-required">Invalid email format</div>
                                                         )}
                                                      </>
                                                   )}
                                                </div>
                                                {modalMode === "create" ?
                                                   <>
                                                      <div className="col-md-6 login-input-group staff-passwordInput">
                                                         <div className="vendor-create-container">
                                                            <input autoComplete="off" onChange={(e) => setpassword(e.target.value)} value={password} type={showPassword ? 'text' : 'password'} id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !password ? 'error' : ''}`} placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock"></i> Password</label>
                                                         </div>
                                                         {submit && password.length == 0 ? <div className='text-danger error-message-required'>Password is required</div> : <></>}
                                                         <i
                                                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye staff-passwordInputicon`}
                                                            id="togglePassword"
                                                            onClick={togglePasswordVisibility}
                                                         ></i>
                                                      </div>
                                                      <div className="col-md-6 login-input-group staff-passwordInput">
                                                         <div className="vendor-create-container">
                                                            <input autoComplete="off" onChange={(e) => setconfirmPassword(e.target.value)} value={confirmPassword} type={showConfirmPassword ? 'text' : 'password'} id="vendor-crt-input" 
                                                            className={`vendor-crt-input`} 
                                                            style={
                                                               modalMode === 'create' && submit && (
                                                                 confirmPassword.length === 0 ||
                                                                 (confirmPassword.length !== 0 && confirmPassword !== password)
                                                               )
                                                                 ? { borderColor: 'red' }
                                                                 : {}
                                                             } 
                                                             placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-key"></i> Confirm Password</label>
                                                         </div>
                                                         {submit && confirmPassword.length == 0 ? <div className='text-danger error-message-required'>Confirm Password is required</div> : <></>}
                                                         {confirmPassword !== password && confirmPassword.length !== 0 && <div className='text-danger error-message-required'>Password and confirm password should be same</div>}
                                                         <i
                                                            className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye staff-passwordInputicon`}
                                                            id="togglePassword"
                                                            onClick={toggleConfirmPasswordVisibility}
                                                         ></i>
                                                      </div>
                                                   </>
                                                   :
                                                   <>
                                                      <div className="col-md-6 login-input-group staff-passwordInput">
                                                         <div className="vendor-create-container">
                                                            <input autoComplete="off" onChange={(e) => setpassword(e.target.value)} value={password} type={showPassword ? 'text' : 'password'} id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock"></i> Password</label>
                                                         </div>
                                                         <i
                                                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye staff-passwordInputicon`}
                                                            id="togglePassword"
                                                            onClick={togglePasswordVisibility}
                                                         ></i>
                                                      </div>
                                                      <div className="col-md-6 login-input-group staff-passwordInput">
                                                         <div className="vendor-create-container">
                                                            <input autoComplete="off" onChange={(e) => setconfirmPassword(e.target.value)} value={confirmPassword} type={showConfirmPassword ? 'text' : 'password'} id="vendor-crt-input"
                                                             className={`vendor-crt-input`} 
                                                            //  style={
                                                            //    submit &&
                                                            //     confirmPassword.length === 0
                                                            //      ? { borderColor: "red" }
                                                            //      : confirmPassword.length !== 0 && confirmPassword !== password
                                                            //      ? { borderColor: "red" }
                                                            //      : {}
                                                            //  } 
                                                             placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-key"></i> Confirm Password</label>
                                                         </div>
                                                         {confirmPassword !== password && confirmPassword.length !== 0 && <div className='text-danger error-message-required'>Password and confirm password should be same</div>}
                                                         <i
                                                            className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye staff-passwordInputicon`}
                                                            id="togglePassword"
                                                            onClick={toggleConfirmPasswordVisibility}
                                                         ></i>
                                                      </div>
                                                   </>
                                                }

                                             </div>
                                          </div>
                                          <div className="modal-footer vendorcreate-modal-footer border-0">
                                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm} id="closeModal">Close</button>
                                             {modalMode === "create" ? (
                                                <button type="button" className="btn btn-primary" onClick={handlecreateStaff}>
                                                   Create
                                                </button>
                                             ) : (
                                                <button type="button" className="btn btn-primary" onClick={handlecreateStaff}>
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
                                             <h1 className="modal-title fs-6 mb-3 text-center" id="vendorExportLabel">Export Staff</h1>
                                          </div>
                                          {exportLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                <div className="downloadLoad-container"><span className="download-loader">
                                                   <div className="downloadLoad-txt">Loading...</div></span></div>
                                            </div>
                                            ) : (
                                            <> 
                                          <div className="p-0 modal-body text-center ">
                                             <div className="exportwithData">
                                                <p className="exportwithData-para">Export with Data</p>
                                                <p className="exportwithData-para1">You can export all staff excel file and import it back with updated data.</p>
                                                <button className="exportwithData-btn" onClick={()=>{handleExport("withData")}}>
                                                   Export Excel File With Data
                                                </button>
                                             </div>
                                          </div></>)}
                                          <div className="modal-footer text-end vendor-view-footer">
                                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 {/* Staff View */}
                                 <div className="modal fade" id="vendorview" aria-labelledby="vendorviewLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                       <div className="modal-content all-modal-content">
                                          <div className="modal-header vendor-view-header">
                                             <h1 className="modal-title fs-6 mb-3 text-center" id="vendorviewLabel">View</h1>
                                          </div>
                                          <div className="p-0 modal-body text-center ">
                                             <div className="row">
                                                <div className="col-md-4 mt-n3 vendor-login-icon store-view-label">
                                                   <img src={Jira} alt="" />
                                                   <p className="p-0 mt-n4 mb-1">{staffName}</p>
                                                </div>
                                                <div className="col-md-8 mt-1">
                                                   <div className="d-flex gap-3">
                                                   <div className="text-start store-view-label">
                                                         <p className="mb-1">Staff Name:</p>
                                                         <p className="mb-1">Phone:</p>
                                                         <p className="mb-1">Email:</p>
                                                      </div>
                                                      <div className="text-start store-view-label">
                                                         <p className="mb-1">{staffName}</p>
                                                         <p className="mb-1">{mobileno}</p>
                                                         <p className="mb-1 ml-n2">{email}</p>
                                                      </div>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                          <div className="modal-footer text-end vendor-view-footer">
                                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Close</button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 {/*Staff Active Modal*/}
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
                                             <h6 className="modal-confirm-subhead">You want to active this {staffName} staff ?</h6>:
                                             <h6 className="modal-confirm-subhead">You want to deactive this {staffName} staff ?</h6>}
                                             </div>
                                       </div>
                                       <div className="modal-footer text-center vendor-delete-footer">
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeactiveModal">No</button>&nbsp;
                                          <button type="button" className="btn btn-primary" onClick={()=>{active? handleActiveStaff("active"):handleActiveStaff("deactive")}} >Yes</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                                 {/*Staff Delete Modal*/}
                                 <div className="modal fade" id="vendordelete" tab-Index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-centered">
                                       <div className="modal-content all-modal-content vendor-delete-content">
                                          <div className=" vendor-delete-header">
                                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                          </div>
                                          <div className="modal-body vendor-delete-body">
                                             <div className="row">
                                                <div className="vendor-delete-icon">
                                                   <i className="fa-solid fa-triangle-exclamation"></i>
                                                </div>
                                                <h4 className="modal-confirm-head">Are You Sure !</h4>
                                                <h6 className="modal-confirm-subhead">You want to delete this {staffName} staff ?</h6>
                                                </div>
                                          </div>
                                          <div className="modal-footer text-center vendor-delete-footer">
                                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal" onClick={()=>setStaffName("")}>No</button>&nbsp;
                                             <button type="button" className="btn btn-primary" onClick={handleDeleteStaff}>Yes</button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                                 {/* Staff Import Modal */}
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
                                                Import Staff
                                             </h1>
                                             <div>
                                                <button className="vendor-crt-btn import-sample-filebtn" onClick={()=>{handleExport("withoutData")}}><i className="fa-solid fa-file-download"></i> Sample File</button>
                                             </div>
                                          </div>
                                          {importLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                <div className="import-container"><span className="import-loader">
                                                   <div className="import-txt">Loading...</div></span></div>
                                            </div>
                                            ) : (
                                            <> 
                                          <div className="modal-body text-center">
                                             <form className="form-container" encType="multipart/form-data">
                                             <div className="upload-files-container" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
                                                   <div className="drag-file-area" style={submit && !file ? { border: '1.6px dashed red' } : {}}>
                                                      <i className="fa-solid fa-cloud-arrow-up import-staff-icon"></i>
                                                      <h5 className="dynamic-message mt-2 mb-n1">
                                                         Drop Anywhere to Import
                                                      </h5>
                                                      <label className="label">
                                                         or{" "}
                                                         <span className="browse-files">
                                                            <input
                                                               type="file"
                                                               className="default-file-input"
                                                               onChange={handleFileChange}
                                                               ref={fileInputRef}
                                                            />
                                                            <span className="browse-files-text text-primary">
                                                               browse file
                                                            </span>{" "}
                                                            <span>from device</span>
                                                         </span>
                                                      </label>
                                                   </div>
                                                   {submit&& !file &&  (
                                                <div className="text-center text-danger error-message-required mt-n2">
                                                Excel file is required
                                                </div>
                                                )}
                                                   {fileName && (
                                                      <div className="file-name mt-2">Selected File: {fileName}</div>
                                                   )}
                                                </div>
                                             </form>
                                          </div></>)}
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
                              </div>
                           </div>
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

export default VendorStaff;