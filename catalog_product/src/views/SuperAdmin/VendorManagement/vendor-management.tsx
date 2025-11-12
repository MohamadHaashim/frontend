import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../shared/Footer";
import Invision from "../../../assets/img/small-logos/logo-invision.svg";
import SuperAdminTopNav from "../../../shared/TopNav/superAdmin";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { toast } from "react-toastify";
import LoginAPI from "../../../api/services/superAdminLogin/superAdmin";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";
import './vendor-management.css'
import { baseURL } from "../../../api/api";
import noImage from "../../../assets/img/no_Image.png";
import { useErrorHandler } from "../../../ErrorHandleContext";

function VendorManagement() {
   const [modalMode, setModalMode] = useState("create");
   const openModal = (mode: any) => {
      setModalMode(mode);

   };

   const navigate = useNavigate();
   const handleError = useErrorHandler();
   const [listVendor, setListVendor] = useState([])
   const [companyName, setCompanyName] = useState('')
   const [companyEmail, setCompanyEmail] = useState('')
   const [companyPhone, setCompanyPhone] = useState('')
   const [companyAddress, setCompanyAddress] = useState('')
   const [companyType, setCompanyType] = useState('')
   const [vendorUserName, setVendorUserName] = useState('')
   const [vendorPassword, setVendorPassword] = useState('')
   const [vendorCPassword, setVendorCPassword] = useState('')
   const [vendorEmail, setVendorEmail] = useState('')
   const [vendorPhone, setVendorPhone] = useState('')
   const [vendorFName, setVendorFName] = useState('')
   const [vendorLName, setVendorLName] = useState('')
   const [vendorLogo, setVendorLogo] = useState('')
   const [status, setStatus] = useState('')
   const [deleteId, setDeleteId] = useState('')
   const [loading, setLoading] = useState(false)
   const [token, setToken] = useState('')
   const [vendorId, setVendorId] = useState('')
   const [active, setActive] = useState(true)
   const [submit, setSubmit] = useState(false);
   const [id, setId] = useState('')
   const [userId, userSetId] = useState('')

   // Pagination Usestate
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);

   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

   const handleLogin = (e: any) => {
      e.preventDefault();
      navigate("/vendor/dashboard", { replace: true });
   };
   const handlePhoneChange = (e: { target: { value: string } }) => {
      let value = e.target.value;
      if (value === "" || /^\+?[0-9]*$/.test(value)) {
         setCompanyPhone(value);
      }
   };
   const handleVendorPhoneChange = (e: { target: { value: string } }) => {
      let value = e.target.value;
      if (value === "" || /^\+?[0-9]*$/.test(value)) {
         setVendorPhone(value);
      }
   };
   
   useEffect(() => {
      superAdminVendorList(currentPage)
   }, [currentPage])

   useEffect(() => {
   }, [id, userId])

   const [showPassword, setShowPassword] = useState(false);
   const [showCPassword, setShowCPassword] = useState(false);
   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };
   const togglePasswordVisibility1 = () => {
      setShowCPassword(!showCPassword)
   };

   // Vendor List

   const superAdminVendorList = (page: number) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };

      LoginAPI.vendorListApi(apiData)
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {

               setListVendor(responceData?.responseData?.VendorData)
               setTotalRecords(responceData.responseData?.totalRecordCount);
               setLoading(false)
            } else {
               if (responceData.apiStatus.code == "404") {
                  setListVendor([])
               }
               setLoading(false)
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
            setLoading(false)
            handleError(error);
         });
   };


   // Pagination Method

   const totalPages = Math.ceil(totalRecords / recordsPerPage);

   const handlePageChange = (pageNumber: any) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
   };

   // Vendor Create


   const resetForm = () => {
      setCompanyName('');
      setCompanyEmail('');
      setCompanyPhone('');
      setCompanyAddress('');
      setCompanyType('');
      setVendorUserName('');
      setVendorPassword('');
      setVendorCPassword('');
      setVendorEmail('');
      setVendorPhone('');
      setVendorFName('');
      setVendorLName('');
      setSelectedFile(null);
      settempImage('');
      setfileName('');
      setSubmit(false)
   };


   const superAdminVendorCreate = (e:any) => {
      e.preventDefault();
      setSubmit(true)
      if (modalMode === "create") {
      if (!companyName || !companyAddress || !companyEmail || !companyPhone || !companyType || !vendorFName || !vendorUserName || !vendorEmail || !vendorPhone || !vendorCPassword || !vendorPassword) {
         return;
      }
   }else{
      if (!companyName || !companyAddress || !companyEmail || !companyPhone || !companyType || !vendorFName || !vendorUserName || !vendorEmail || !vendorPhone) {
         return;
      }
   }
      
      if (modalMode === "create") {
      }
      const formData = new FormData();

      if (modalMode === "edit") {
         formData.append("id", id);
         formData.append("userData[user_id]", userId);
      }

      formData.append("company_name", companyName);
      formData.append("type", companyType);
      formData.append("address", companyAddress);
      formData.append("phone", companyPhone);
      formData.append("email", companyEmail);
      formData.append("userData[first_name]", vendorFName);
      formData.append("userData[last_name]", vendorLName);
      formData.append("userData[username]", vendorUserName);
      formData.append("userData[email_id]", vendorEmail);
      formData.append("userData[password]", vendorPassword);
      formData.append("userData[confirmPassword]", vendorCPassword);
      formData.append("userData[phone]", vendorPhone);
      formData.append("userData[role_name]", "vendor_super_admin");
      selectedFile && formData.append("userData[profile_image]", selectedFile);

      const apiCall = modalMode === "create"
         ? LoginAPI.vendorCreateApi(formData)
         : LoginAPI.vendorUpdateApi(formData);
         apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setSubmit(false)
               resetForm()
               
               toast.success(responseData.apiStatus.message);
               const closeButton = document.getElementById("closeCreate");
               superAdminVendorList(currentPage);

               if (closeButton) {
                  closeButton.click();
               }
               if (responseData.responseData.profile_image) {
                  sessionStorage.setItem("profileImage", responseData.responseData.profile_image);
               }
            } else {
               setSubmit(false)
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setSubmit(false)
            console.error("Error during API call:", error);
            toast.error("An error occurred during the API call.");
         });
   };


   //   Get By Id

   const superAdminVendorListGet = async (id: any) => {
      try {
         // Make the API call with the provided ID
         const responseData = await LoginAPI.vendorGetApi(id);
         if (responseData.apiStatus.code === '200') {
            const data = responseData?.responseData
            setCompanyName(data?.VendorName);
            setCompanyEmail(data?.VendorEmail);
            setCompanyPhone(data?.VendorPhone);
            setCompanyAddress(data?.VendorAddress);
            setCompanyType(data?.VendorType);
            setVendorUserName(data?.UserUserName)
            setVendorEmail(data?.UserEmail)
            setVendorPhone(data?.UserPhone)
            setVendorFName(data?.UserFirstName)
            setVendorLName(data?.UserLastName)
            setVendorLogo(data?.UserProfileImage)
            // toast.success(responseData.apiStatus.message);
         } else {
            toast.error(`get failed: ${responseData.apiStatus.message}`);
         }
      } catch (error) {
         console.error("Error during API call:", error);
         toast.error("An error occurred during the get process.");
      }
   };


   //Vendor Delete

   const superAdminVendorListDelete = async () => {
      try {
         const responseData = await LoginAPI.vendorDeleteApi(deleteId);
         if (responseData.apiStatus.code === '200') {
            const newTotalRecords = totalRecords - 1;
            setTotalRecords(newTotalRecords);
            let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
            if (currentPage > totalPages) {
               setCurrentPage(totalPages);
            }
            const closeButton = document.getElementById("deleteCreate");
            if (closeButton) {
               superAdminVendorList(currentPage);
               closeButton.click();
            }
            toast.success(responseData.apiStatus.message);
         } else {
            toast.error(`get failed: ${responseData.apiStatus.message}`);
         }
      } catch (error) {
         console.error("Error during API call:", error);
         toast.error("An error occurred during the get process.");
      }
   };

   // Vendor Active 

   const superAdminActiveGet = async (name: any) => {
      try {
         var responseData;
         if(name==="active"){
             responseData = await LoginAPI.vendorActiveApi(vendorId);
         }
         else{
          responseData = await LoginAPI.vendorDeactiveApi(vendorId);
         }
         if (responseData.apiStatus.code === '200') {
            superAdminVendorList(currentPage)
            const closeButton = document.getElementById("closeactiveModal");
            if (closeButton) {
               closeButton.click();
            }
            toast.success(responseData.apiStatus.message);
         } else {
            toast.error(`get failed: ${responseData.apiStatus.message}`);
         }
      } catch (error) {
         console.error("Error during API call:", error);
         toast.error("An error occurred during the get process.");
      }
   };

   // Vendor Direct Login

   const superAdminVendorLogin = (e: any) => {
      e.preventDefault();
      setSubmit(true)
      setLoading(true)
      let apiData = {
         vendorId: vendorId,
      };
      LoginAPI.vendorSignInAPI(apiData)
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               // localStorage.setItem("userVendorName", responceData.responseData?.userDetail?.username);
               // localStorage.setItem("vendorToken", responceData.responseData.token);
               // localStorage.setItem("loginAs", responceData.responseData.userDetail.logInAs);
               // localStorage.setItem("profileImage", responceData.responseData.userDetail.profile_image);
               sessionStorage.setItem("userVendorName", responceData.responseData?.userDetail?.username);
               sessionStorage.setItem("vendorToken", responceData.responseData.token);
               sessionStorage.setItem("loginAs", responceData.responseData.userDetail.logInAs);
               sessionStorage.setItem("profileImage", responceData.responseData.userDetail.profile_image);
               window.open('/vendor/dashboard', '_blank');
               setLoading(false)
               // toast.success(responceData.apiStatus.message);
            } else {
               setLoading(false)
               toast.error(responceData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setSubmit(false)
            setLoading(false)
            console.error("Error during API call:", error);
            toast.error("An error occurred during the API call.");
         });
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
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [fileName, setfileName] = useState("");
   const [tempImage, settempImage] = useState("");
   const fileInputRef = useRef<HTMLInputElement | null>(null);
       const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         const selectedFile = event.target.files?.[0];
         if (selectedFile) {
             setSelectedFile(selectedFile);
             setfileName(selectedFile.name);
             if (fileInputRef.current) {
                 fileInputRef.current.value = "";
             }
             const imagePreviewUrl = URL.createObjectURL(selectedFile);
               settempImage(imagePreviewUrl);
         }
       };
useEffect(() => {
    const modalElements = [
      document.getElementById('vendorcreate'),
      document.getElementById('vendorview'),
      document.getElementById('vendorlogin'),
    ];
    const handleHidden = () => {resetForm();};
    modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
    return () => {
      modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
    };
  }, []);

   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <SuperAdminTopNav />
            <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
               <div className="col-md-6">
                  <nav aria-label="breadcrumb">
                     <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/super-admin/dashboard"}>Dashboard</Link></li>
                        <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Vendor Management</li>
                     </ol>
                     <h6 className="text-start font-weight-bolder mb-0 grayFont">Vendor Management</h6>
                  </nav>
               </div>
               <div className="col-md-6 text-end">
                  <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorcreate" onClick={() => openModal("create")}>Create Vendor</button>
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
                                 ) : listVendor.length === 0 ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <><table className="table align-items-center justify-content-center mb-0">
                                       <thead>
                                          <tr className="vendor-table-mainhead">
                                             <th className="vendor-table-head opacity-7">Vendor</th>
                                             <th className="vendor-table-head opacity-7 ps-2">Admin Details</th>
                                             <th className="vendor-table-head opacity-7 ps-2">Login Details</th>
                                             <th className="vendor-table-head opacity-7 ps-2">Status</th>
                                             <th className="vendor-table-head opacity-7 ps-2">Vendor Login</th>
                                             <th className="vendor-table-head text-center opacity-7 ps-2">Action</th>
                                             {/*<th></th>*/}
                                          </tr>
                                       </thead>
                                       <tbody>

                                          {listVendor.map((vendorItem: any) => (
                                             <tr key={vendorItem.id}>
                                                <td>
                                                   <div className="d-flex px-2">
                                                      <div>
                                                         <img src={vendorItem.UserProfileImage ? baseURL + vendorItem.UserProfileImage : noImage} className="avatar avatar-sm me-2" alt="spotify" />
                                                      </div>
                                                      <div className="my-auto">
                                                         <h6 className="grayFont mb-0 text-sm ps-3">{vendorItem?.VendorName}</h6>
                                                      </div>
                                                   </div>
                                                </td>
                                                <td className="align-middle text-start">
                                                   <span className="text-sm">
                                                      {vendorItem?.UserFirstName} {vendorItem?.UserLastName}<br />{vendorItem?.VendorPhone}<br />
                                                      {vendorItem?.VendorEmail} </span>
                                                </td>
                                                <td className="align-middle text-start">
                                                   <span className="text-sm">
                                                      {vendorItem?.UserUserName}<br />
                                                      {vendorItem?.VendorEmail}
                                                   </span>
                                                </td>
                                                <td>
                                                   <div className="form-check form-switch ms-1 is-filled">

                                                      <input
                                                         onChange={() => {
                                                            setVendorUserName(vendorItem?.UserUserName)
                                                            if (vendorItem.VendorStatus === "1") {
                                                               setVendorId(vendorItem.VendorId);
                                                               setActive(false);
                                                            } else if (vendorItem.VendorStatus === "0") {
                                                               setVendorId(vendorItem.VendorId);
                                                               setActive(true);
                                                            }
                                                         }}
                                                         className="form-check-input"
                                                         type="checkbox"
                                                         id="flexSwitchCheckDefault"
                                                         data-bs-toggle="modal" data-bs-target="#vendorActive"
                                                         checked={vendorItem?.VendorStatus === "1"} />
                                                   </div>

                                                </td>
                                                <td className="align-middle vendor-login-td">
                                                   <button onClick={() => { setVendorId(vendorItem?.VendorId);setVendorUserName(vendorItem?.UserUserName) }} className="btn btn-icon btn-3 btn-success vendor-login-btn" type="button" data-bs-toggle="modal" data-bs-target="#vendorlogin">
                                                      <span className="btn-inner--icon"><i className="fa-solid fa-arrow-right-to-bracket"></i></span>
                                                      <span className="btn-inner--text vendor-login-txt"> Login</span>
                                                   </button>
                                                </td>
                                                <td className="align-middle vendor-login-td">
                                                   <div className="actionView-tooltip-container">
                                                      <button className="btn-3 vendorbtn-view" type="button" data-bs-toggle="modal" data-bs-target="#vendorview" onClick={() => { superAdminVendorListGet(vendorItem?.VendorId); }}>
                                                         <span className="btn-inner--icon"><i className="fa-solid fa-eye"></i></span>
                                                      </button>&nbsp;
                                                      <div className="actionView-tooltip-text">
                                                         View
                                                      </div>
                                                   </div>
                                                   <div className="actionEdit-tooltip-container">
                                                      <button className="btn-3 vendorbtn-edit" type="button" data-bs-toggle="modal" data-bs-target="#vendorcreate" onClick={() => { openModal("edit"); setId(vendorItem?.VendorId); userSetId(vendorItem?.UserId); superAdminVendorListGet(vendorItem?.VendorId); }}>
                                                         <span className="btn-inner--icon"><i className="fa-regular fa-pen-to-square"></i></span>
                                                      </button>&nbsp;
                                                      <div className="actionEdit-tooltip-text">
                                                         Edit
                                                      </div>
                                                   </div>
                                                   <div className="actionDelete-tooltip-container">
                                                      <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" onClick={() => { setDeleteId(vendorItem?.VendorId);setVendorUserName(vendorItem?.UserUserName) }} data-bs-target="#vendordelete">
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
                                       <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="store-pagination">
                                          <Pagination>
                                             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                             {renderPaginationItems()}
                                             <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                          </Pagination>
                                       </div></>
                                 )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <Footer />
            </div>



         </main>

         {/*Vendor Create and Edit Modal*/}
         <div className="modal fade" id="vendorcreate" tab-index="-1" aria-labelledby="vendorcreateLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
               <div className="modal-content all-modal-content vendorcreate-modal-content">
                  <div className="modal-header vendorcreate-modal-header">
                     <h5 className="modal-title vendorcreate-modal-title" id="vendorcreateLabel">
                        {modalMode === "create" ? "Create Vendor" : "Edit Vendor"}
                     </h5>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="row modal-container-size modal-body vendorcreate-modal-body">
                     <div className="row">

                        {modalMode === "edit" ? <div className="col-md-12 login-input-group">
                           <div className="vendor-create-container">
                              <input disabled type="text" id="vendor-crt-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="vendor-crt-input" placeholder=" "
                                 style={submit && companyName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-building"></i> Company Name</label>

                           </div>
                           {submit && companyName.length == 0 ? (
                              <div className="text-danger error-message-required">Company name is required </div>
                           ) : (
                              <></>
                           )}
                        </div> : <div className="col-md-12 login-input-group">
                           <div className="vendor-create-container">
                              <input autoComplete="off" type="text" id="vendor-crt-input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="vendor-crt-input" placeholder=" "
                                 style={submit && companyName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-building"></i> Company Name</label>

                           </div>
                           {submit && companyName.length == 0 ? (
                              <div className="text-danger error-message-required">Company name is required </div>
                           ) : (
                              <></>
                           )}
                        </div>}


                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input autoComplete="off" type="text" id="vendor-crt-input" value={companyType} onChange={(e) => setCompanyType(e.target.value)} className="vendor-crt-input" placeholder=" "
                                 style={submit && companyType.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-brands fa-dropbox"></i> Category Type</label>
                           </div>
                           {submit && companyType.length == 0 ? (
                              <div className="text-danger error-message-required">Category type is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input autoComplete="off" type="text" id="vendor-crt-input" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)}
                                 style={submit && companyAddress.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-location-dot"></i> Address</label>
                           </div>
                           {submit && companyAddress.length == 0 ? (
                              <div className="text-danger error-message-required">Company address is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={companyPhone} autoComplete="off" onChange={handlePhoneChange}
                                 style={(submit && !companyPhone) || (companyPhone.length > 0 && companyPhone.length < 10) ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " maxLength={12} required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-screen-button"></i> Mobile Number</label>
                           </div>
                           {submit && companyPhone.length == 0 ? (
                              <div className="text-danger error-message-required">Mobile.no is required </div>
                           ) : (
                              <></>
                           )}
                           {companyPhone.length < 10 && companyPhone.length > 0 && (<div className="text-danger error-message-required">Mobile.No should be at least 10 digits</div>)}
                        </div>
                        {modalMode === "edit" ? <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input disabled type="email" id="vendor-crt-input" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)}
                                 style={submit && !companyEmail || (companyEmail.length > 0 && !companyEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                           </div>
                           {submit && companyEmail.length === 0 ? (
                              <div className="text-danger error-message-required">Email is required</div>
                           ) : (
                              <>

                                 {companyEmail.length > 0 && !EMAIL_VALIDATION_REGEX.test(companyEmail) && (
                                    <div className="text-danger error-message-required">Invalid email format</div>
                                 )}
                              </>
                           )}
                        </div>:
                        <div className="col-md-6 login-input-group">
                        <div className="vendor-create-container">
                           <input type="email" id="vendor-crt-input" value={companyEmail} autoComplete="off" onChange={(e) => setCompanyEmail(e.target.value)}
                              style={submit && !companyEmail || (companyEmail.length > 0 && !companyEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}
                              className="vendor-crt-input" placeholder=" " required />

                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                        </div>
                        {submit && companyEmail.length === 0 ? (
                           <div className="text-danger error-message-required">Email is required</div>
                        ) : (
                           <>

                              {companyEmail.length > 0 && !EMAIL_VALIDATION_REGEX.test(companyEmail) && (
                                 <div className="text-danger error-message-required">Invalid email format</div>
                              )}
                           </>
                        )}
                     </div>}
                        <h5 className="text-center mt-4"><u>Vendor Admin User</u></h5>
                        {modalMode === "edit" ?
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input disabled type="text" id="vendor-crt-input" value={vendorUserName} onChange={(e) => setVendorUserName(e.target.value)}
                                 style={submit && vendorUserName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-address-card"></i> Username</label>
                           </div>
                           {submit && vendorUserName.length == 0 ? (
                              <div className="text-danger error-message-required">User name is required </div>
                           ) : (
                              <></>
                           )}
                        </div>:
                        <div className="col-md-6 login-input-group">
                        <div className="vendor-create-container">
                           <input type="text" id="vendor-crt-input" value={vendorUserName} autoComplete="off" onChange={(e) => setVendorUserName(e.target.value)}
                              style={submit && vendorUserName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                              className="vendor-crt-input" placeholder=" " required />

                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-address-card"></i> Username</label>
                        </div>
                        {submit && vendorUserName.length == 0 ? (
                           <div className="text-danger error-message-required">User name is required </div>
                        ) : (
                           <></>
                        )}
                     </div>}
                     <div className="col-md-6">
                          <div className="media-upload-container login-input-group">
                          <label htmlFor="vendor-crt-input-2" className="media-upload-label">
                          <i className="fa-brands fa-vimeo icon-left mt-1" /> 
                          <span className="mt-1">Select Vendor Logo</span>
                          </label>
                          <input
                              type="file"
                              id="vendor-crt-input-2"
                              className="media-upload-input"
                              accept="image/*,video/*"
                              multiple
                              required
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ cursor: "pointer" }}
                          />
                          <button className="media-upload-button" 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          >
                          <i className="fa-solid fa-arrow-up-from-bracket text-dark"></i>
                            Select</button>
                        </div>
                        <p className="text-sm mb-0 p-0" style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                           {fileName && fileName}
                        </p>
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={vendorFName} autoComplete="off" onChange={(e) => setVendorFName(e.target.value)}
                                 style={submit && vendorFName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> First Name</label>
                           </div>
                           {submit && vendorFName.length == 0 ? (
                              <div className="text-danger error-message-required">First name is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={vendorLName} autoComplete="off" onChange={(e) => setVendorLName(e.target.value)} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Last Name</label>
                           </div>
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={vendorPhone} autoComplete="off" onChange={handleVendorPhoneChange}
                                 style={(submit && !vendorPhone) || (vendorPhone.length > 0 && vendorPhone.length < 10) ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " maxLength={12} required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-button"></i> Mobile Number</label>
                           </div>
                           {submit && vendorPhone.length == 0 ? (
                              <div className="text-danger error-message-required">Mobile.no is required </div>
                           ) : (
                              <></>
                           )}
                           {vendorPhone.length < 10 && vendorPhone.length > 0 && (<div className="text-danger error-message-required">Mobile.No should be at least 10 digits</div>)}
                        </div>
                        
                        {modalMode === "edit" ?<div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input disabled type="email" id="vendor-crt-input" value={vendorEmail} onChange={(e) => setVendorEmail(e.target.value)}
                                 style={submit && !vendorEmail || (vendorEmail.length > 0 && !vendorEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " required />

                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                           </div>
                           {submit && vendorEmail.length === 0 ? (
                              <div className="text-danger error-message-required">Vendor email is required</div>
                           ) : (
                              <>

                                 {vendorEmail.length > 0 && !EMAIL_VALIDATION_REGEX.test(vendorEmail) && (
                                    <div className="text-danger error-message-required">Invalid email format</div>
                                 )}
                              </>
                           )}
                        </div>:
                        <div className="col-md-6 login-input-group">
                        <div className="vendor-create-container">
                           <input type="email" id="vendor-crt-input" value={vendorEmail} autoComplete="off" onChange={(e) => setVendorEmail(e.target.value)}
                              style={submit && !vendorEmail || (vendorEmail.length > 0 && !vendorEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}
                              className="vendor-crt-input" placeholder=" " required />

                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                        </div>
                        {submit && vendorEmail.length === 0 ? (
                           <div className="text-danger error-message-required">Vendor email is required</div>
                        ) : (
                           <>

                              {vendorEmail.length > 0 && !EMAIL_VALIDATION_REGEX.test(vendorEmail) && (
                                 <div className="text-danger error-message-required">Invalid email format</div>
                              )}
                           </>
                        )}
                     </div>}



                        {modalMode === "edit" ? '' : <><div className="col-md-6 login-input-group vendor-passwordInput">
                           <div className="vendor-create-container">
                              <input type={showPassword ? 'text' : 'password'} id="vendor-crt-input" value={vendorPassword} autoComplete="off" onChange={(e) => setVendorPassword(e.target.value)}
                                 style={submit && vendorPassword.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 className="vendor-crt-input" placeholder=" " required />


                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock"></i> Password</label>
                           </div>
                           {submit && vendorPassword.length == 0 ? <div className='text-danger error-message-required'>Password is required</div> : <></>}
                           {/* {vendorPassword.length > 0 && !passwordRegex.test(vendorPassword) && (
                              <div className='text-danger error-message-required'>
                                 Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
                              </div>
                           )} */}
                           <i
                              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye vendor-passwordInputicon`}
                              id="togglePassword"
                              onClick={togglePasswordVisibility}
                           ></i>
                        </div>
                        <div className="col-md-6 login-input-group vendor-passwordInput">
                              <div className="vendor-create-container">
                                 <input type={showCPassword ? 'text' : 'password'} id="vendor-crt-input" value={vendorCPassword} autoComplete="off" onChange={(e) => setVendorCPassword(e.target.value)}
                                 style={
                                    submit && vendorCPassword.length === 0
                                      ? { borderColor: "red" }
                                      : vendorCPassword.length !== 0 && vendorCPassword !== vendorPassword
                                      ? { borderColor: "red" }
                                      : {}
                                  } 
                                 className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-key"></i> Confirm Password</label>
                              </div>
                              {submit && vendorCPassword.length === 0 && <div className='text-danger error-message-required'>Confirm password is required</div>}
                              {vendorCPassword !== vendorPassword && vendorCPassword.length !== 0 && <div className='text-danger error-message-required'>Password and confirm password should be same</div>}
                              <i className={`fas ${showCPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye vendor-passwordInputicon`} id="togglePassword" onClick={togglePasswordVisibility1}></i>
                        </div></>}
                     </div>
                  </div>
                  <div className="modal-footer vendorcreate-modal-footer">
                     <button type="button" className="btn btn-secondary" onClick={resetForm} data-bs-dismiss="modal" id="closeCreate">Close</button>
                     {modalMode === "create" ? <button type="button" className="btn btn-primary" onClick={superAdminVendorCreate}>Create</button> : <button type="button" className="btn btn-primary" onClick={superAdminVendorCreate}>Update</button>}


                  </div>
               </div>
            </div>
         </div>
         {/*Vendor Login Modal*/}
         <div className="modal fade text-center" id="vendorlogin" tab-index="-1" aria-labelledby="vendorloginLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content vendor-delete-content">
                  <div className=" vendor-delete-header">
                  </div>
                  <div className="modal-body vendor-delete-body">
                     <div className="row">
                        <div className="vendor-login-icon">
                        <i className="fa-solid fa-unlock"></i></div>
                        <h5 className="modal-confirm-head">Are You Sure !</h5>
                        <h6 className="modal-confirm-subhead">You want to login this {vendorUserName} vendor ?</h6>
                        <div></div>
                     </div>
                  </div>
                  <div className="modal-footer text-center vendor-delete-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>&nbsp;
                     <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={superAdminVendorLogin}>Yes</button>
                  </div>
               </div>
            </div>
         </div>
         {/*Vendor View Modal*/}
         <div className="modal fade" id="vendorview" aria-labelledby="vendorviewLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content">
                  <div className="modal-header vendor-view-header">
                     <h1 className="modal-title fs-6 mb-3 text-center" id="vendorviewLabel">View</h1>
                  </div>
                  <div className="p-0 modal-body text-center ">
                     <div className="row">
                        <div className="col-md-4 mt-n3 vendor-login-icon store-view-label">
                           <img className="rounded" src={vendorLogo ? baseURL+vendorLogo:noImage} alt="" />
                           <p className="p-0 mt-n3 mb-1">{vendorFName}</p>
                        </div>
                        <div className="col-md-8 mt-1">
                           <div className="d-flex gap-3">
                              <div className="text-start store-view-label">
                                 <p className="mb-1">Name:</p>
                                 <p className="mb-1">Phone:</p>
                                 <p className="mb-1">Email:</p>
                              </div>
                              <div className="text-start store-view-label">
                                 <p className="mb-1">{vendorFName}</p>
                                 <p className="mb-1">{vendorPhone}</p>
                                 <p className="mb-1 ml-n2">{vendorEmail}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="modal-footer text-end vendor-view-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                     {/*<button type="button" class="btn btn-primary">Save changes</button>*/}
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
                        <h6 className="modal-confirm-subhead">You want to active this {vendorUserName} vendor ?</h6>:
                        <h6 className="modal-confirm-subhead">You want to deactive this {vendorUserName} vendor ?</h6>}
                     </div>
                  </div>
                  <div className="modal-footer text-center vendor-delete-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeactiveModal">No</button>&nbsp;
                     <button type="button" className="btn btn-primary" onClick={()=>{active? superAdminActiveGet("active"):superAdminActiveGet("deactive")}} >Yes</button>
                  </div>
               </div>
            </div>
         </div>

         {/*Vendor Delete Modal*/}
         <div className="modal fade" id="vendordelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content vendor-delete-content">
                  <div className=" vendor-delete-header">
                  </div>
                  <div className="modal-body vendor-delete-body">
                     <div className="row">
                        <div className="vendor-delete-icon">
                           <i className="fa-solid fa-triangle-exclamation text-warning danger-iconz "></i>
                        </div>
                        <h5 className="modal-confirm-head">Are You Sure !</h5>
                        <h6 className="modal-confirm-subhead">You want to delete this {vendorUserName} vendor ?</h6>
                        <div></div>
                     </div>
                  </div>
                  <div className="modal-footer text-center vendor-delete-footer">
                     <button type="button" className="btn btn-secondary" id="deleteCreate" data-bs-dismiss="modal">No</button>&nbsp;
                     <button type="button" onClick={superAdminVendorListDelete} className="btn btn-primary">Yes</button>
                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   )
}
export default VendorManagement;