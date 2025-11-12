import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../../../layouts/DashboardLayout';
import TopNav from '../../../../shared/TopNav';
import Footer from '../../../../shared/Footer';
import { Link } from 'react-router-dom';
import VendorAPI from '../../../../api/services/vendorLogin/vendorApi';
import { toast } from 'react-toastify';
import { Pagination } from 'react-bootstrap';
import { FadeLoader } from 'react-spinners';
import './customcontact-field.css';
function ContactCustomField() {
    const [inputDrop] = useState<any[]>([
        {"input_type": "Text","value":"text"},
        {"input_type": "Number","value":"number"},
        {"input_type": "Email","value":"email"},
        {"input_type": "URL","value":"url"},
        {"input_type": "Date","value":"date"},
        {"input_type": "Time","value":"time"},
        {"input_type": "Datetime-local","value":"datetime-local"},
        {"input_type": "Dropdown","value":"Dropdown"},
    ]);
    const [inputListData, setinputListData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage,setrecordsPerPage] = useState(10);
    const [inputType, setInputType] = useState("");
    const [inputTypeValue, setInputTypeValue] = useState("");
    const [inputName, setInputName] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [inputId, setinputId] = useState("");
    const [submit, setSubmit] = useState(false);
    const [active, setActive] = useState(true)
    const [modalMode, setModalMode] = useState("create");
    const [loading, setLoading] = useState(false);
    const [required, setrequired] = useState(false);
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
   const filteredInputDrop = inputDrop.filter((dropdownValue) =>
      (dropdownValue?.input_type || "").toLowerCase().includes((inputType || "").toLowerCase())
   );
   const openModal = (mode: any) => {
   setModalMode(mode);
   };
   const resetForm = () => {
      setInputName("");
      setInputType("");
      setInputs([{ id: Date.now(), value: '' }]);
      setSubmit(false);
      setrequired(false);
   }
   const handlecreateInput = () => {
         setSubmit(true);
         if (!inputName || !inputType ) {
            return;
         }
         if (inputType === "Dropdown") {
         const hasEmptyOption = inputs.some(input => !input.value.trim());
            if (hasEmptyOption) {
               return;
            }
         }
         const apiData = {
            ...(modalMode === "edit" && { id: inputId }),
            name: inputName,
            type: inputTypeValue,
            label: inputName,
            ...(inputType?.toLowerCase() === "dropdown" && {
            options: inputs.map(input => input.value),
            }),
            is_required:required
         };
         const apiCall = modalMode === "create" ? VendorAPI.customFieldcontactCreate(apiData) 
         : VendorAPI.customFieldcontactUpdate(apiData);
         apiCall
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  resetForm();
                  handlecustomFieldList(currentPage);
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
   const handlecustomFieldList = (page: any) => {
         setLoading(true)
         const apiData = {
            pageIndex: page - 1,
            dataLength: recordsPerPage,
            filter:debouncedSearch
         };
         VendorAPI.customFieldcontactList(apiData)
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  setLoading(false)
                  setinputListData(responseData.result.contactCustomFieldData)
                  setTotalRecords(responseData.result.totalRecordCount)
               } else {
                  if (responseData.apiStatus.code == "404") {
                  setinputListData([]);
                  }
                  // toast.error(responseData.apiStatus.message);
                  setLoading(false)
               }
            })
            .catch((error: any) => {
               setLoading(false)
               console.error("Error while fetching custom fieldlist details:", error);
               toast.error("An error occurred while fetching custom fieldlist details.");
            });
   }
   const handlecustomFieldGet = (inputId: any) => {
      VendorAPI.customFieldcontactGet(inputId)
        .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
            const fieldData = responseData.contactCustomFieldData;
            const rawType = fieldData.type;
            const options = fieldData.options || [];
    
            // Normalize type for dropdown
            const isDropdown = rawType.toLowerCase() === 'dropdown' || (rawType === 'text' && options.length > 0);
            const actualType = isDropdown ? 'Dropdown' : rawType;
    
            setInputName(fieldData.name);
            setInputType(actualType);         // For conditional rendering
            setInputTypeValue(actualType);    // If you need original for form submission
    
            const formattedOptions = options.map((opt: string, index: number) => ({
              id: String(index + 1),
              value: opt,
            }));
    
            setInputs(isDropdown ? (formattedOptions.length ? formattedOptions : [{ id: Date.now(), value: '' }]) : [{ id: Date.now(), value: '' }]);
    
            const isRequired = fieldData.is_required;
            setrequired(isRequired === "true");
          } else {
            toast.error(responseData.apiStatus.message);
          }
        })
        .catch((error: any) => {
          setLoading(false);
          console.error("Error while fetching custom field value:", error);
          toast.error("An error occurred while fetching custom field value.");
        });
    };
    
   const [inputs, setInputs] = useState([{ id: Date.now(), value: '' }]);

   const handleChange = (id:any, value:any) => {
      setInputs(inputs.map(input => input.id === id ? { ...input, value } : input));
      console.log(inputs,"Inputzz")
   };

   const handleAdd = (afterId: any) => {
      setInputs(prevInputs => {
         const newInput = { id: Date.now(), value: '' };
         const index = prevInputs.findIndex(input => input.id === afterId);
         const updatedInputs = [...prevInputs];
         updatedInputs.splice(index + 1, 0, newInput); // Insert after current input
         return updatedInputs;
      });
   };
   

   const handleRemove = (id:any) => {
      setInputs(inputs.filter(input => input.id !== id));
   };
   const handlecustomFieldDelete = () => {
      VendorAPI.customFieldcontactDelete(inputId)
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
                  handlecustomFieldList(currentPage);
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
   const handleinputStatus = (name: any) => {
   const apiCall = VendorAPI.customFieldcontactStatus(inputId);
   apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData.apiStatus.message);
               handlecustomFieldList(currentPage);
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
            console.error("Error during field status update:", error);
            toast.error("An error occurred during field status update.");
      });
   };
   
useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearch(search);
          setCurrentPage(1);
        }, 1000);
    
        return () => {
          clearTimeout(handler);
        };
      }, [search]);
    useEffect(()=>{
        handlecustomFieldList(currentPage);
    },[currentPage,recordsPerPage,debouncedSearch])
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

  return (
    <div>
        <DashboardLayout>
                 <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                    <TopNav />
                    <div className="container-fluid py-1">
                       <div className="row">
                          <div className="col-md-6">
                             <nav aria-label="breadcrumb">
                                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                   <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                   <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Contact</li>
                                </ol>
                                <h6 className="text-start font-weight-bolder mb-0">Contact Custom Field</h6>
                             </nav>
                          </div>
                          <div className="col-md-6 text-end">
                             <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorcreate" 
                             onClick={() => openModal("create")}
                             >Create New Custom Field</button>&nbsp;
                          </div>
                       </div>
                    </div>
                    <div className="vendor-maincontent container-fluid py-4">
                       <div className="row">
                          <div className="col-12">
                             <div className="card mb-4">
                                <div className="card-body  px-0 pt-0 pb-2">
                                   <div className="p-0">
                                   <div
                                        className="d-flex justify-content-between align-items-center flex-wrap mb-3 sticky-top-container"
                                        style={{ position: "sticky", top: 14, backgroundColor: "white", zIndex: 1000, padding: "0",borderRadius:"10px" }}
                                        >
                                        <div className="d-flex align-items-center mt-4">
                                            <span className='me-2 show-entries-cnt'>Show</span>
                                            <div className="dropdown">
                                                <button className="btn show-entries-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                    {recordsPerPage}
                                                </button>
                                                <ul className="dropdown-menu show-entries-dropdown">
                                                   <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(10); setCurrentPage(1); }}>10</a></li>
                                                   <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(20); setCurrentPage(1); }}>20</a></li>
                                                   <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(50); setCurrentPage(1); }}>50</a></li>
                                                   <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(100); setCurrentPage(1); }}>100</a></li>
                                                </ul>
                                            </div>
                                            <span className='ms-2 show-entries-cnt'>Entries</span>
                                        </div>
                                        <div className="vendor-create-container pe-4 mt-4" style={{ width: '40%' }}>
                                            <input type="text" id="vendor-crt-input" className="vendor-crt-input"
                                                autoComplete="off" onChange={(e) => setSearch(e.target.value)} value={search}
                                                placeholder=" " required />
                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                <i className="fa-solid fa-magnifying-glass"></i> Search
                                            </label>
                                        </div>
                                    </div>
                                      {
                                         loading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                               <FadeLoader color="#36d7b7" />
                                            </div>
                                         ) : inputListData.length === 0 ? (
                                            <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                         ) : (
                                            <>
                                               <table className="table align-items-center justify-content-center mb-0">
                                                  <thead>
                                                     <tr>
                                                        <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7">Input Name</th>
                                                        <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Input Type</th>
                                                        <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                                                        <th className="store-table-head text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Action</th>
                                                     </tr>
                                                  </thead>
                                                  <tbody className="table-tbody-list">
                                                     {inputListData.map((listData, id) => (
                                                        <tr>
                                                           <td>
                                                              <div className="d-flex px-3">
                                                                 <div className="my-auto">
                                                                    <h6 className="mb-0 text-sm">
                                                                        {listData.name}
                                                                        </h6>
                                                                 </div>
                                                              </div>
                                                           </td>
                                                           <td>
                                                              <span className="text-sm">
                                                                    {listData.type.charAt(0).toUpperCase() + listData.type.slice(1).toLowerCase()}
                                                                 </span>
                                                           </td>
                                                           <td>
                                                         <div className="form-check form-switch ms-1 is-filled">
                                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                                               onChange={() => {
                                                                  if (listData.active_status === "1") {
                                                                     setinputId(listData.id);
                                                                     setActive(false);
                                                                     setInputName(listData?.name)
                                                                  } else if (listData.active_status === "0") {
                                                                     setinputId(listData.id);
                                                                     setActive(true);
                                                                     setInputName(listData?.name)
                                                                  }
                                                               }}
                                                               data-bs-toggle="modal" data-bs-target="#vendorActive"
                                                               checked={listData.active_status === "1"} 
                                                               />
                                                         </div>
                                                      </td>
                                                           <td className="align-middle text-center">
                                                              <div className="actionEdit-tooltip-container">
                                                                 <button 
                                                                 onClick={() => { 
                                                                handlecustomFieldGet(listData.id); 
                                                                openModal("edit"); 
                                                                setinputId(listData.id) 
                                                                }} 
                                                                 className="btn-3 vendorbtn-edit" type="button" data-bs-toggle="modal" data-bs-target="#vendorcreate">
                                                                    <span className="btn-inner--icon"><i className="fa-regular fa-pen-to-square"></i></span>
                                                                 </button>&nbsp;
                                                                 <div className="actionEdit-tooltip-text">
                                                                    Edit
                                                                 </div>
                                                              </div>
                                                              <div className="actionDelete-tooltip-container">
                                                                 <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" 
                                                                 onClick={() => { setinputId(listData.id);setInputName(listData?.name) }}
                                                                  data-bs-target="#vendordelete">
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
                                                     {modalMode === "create" ? "Create New Custom Field" : "Edit Custom Field"}
                                                  </h5>
                                                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                               </div>
                                               <div className="row modal-container-size modal-body vendorcreate-modal-body">
                                                  <div className="row mt-n4">
                                                     <div className="col-md-6 login-input-group">
                                                        <div className="vendor-create-container">
                                                           <input autoComplete="off" onChange={(e) => setInputName(e.target.value)} value={inputName} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !inputName ? 'error' : ''}`} placeholder=" " required />
                                                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-store"></i> Input name</label>
                                                        </div>
                                                        {submit && inputName.length == 0 ? <div className='text-danger error-message-required'>Input name is required</div> : <></>}
                                                     </div>
                                                     
                                                   <div className="col-md-6 login-input-group">
                                                   <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                      <input
                                                         autoComplete="off"
                                                         type="text"
                                                        //  onClick={handleGetStoreDrop}
                                                         id="vendor-crt-input"
                                                         className={`vendor-crt-input loginfilled-frame-username ${submit && !inputType ? 'error' : ''}`}
                                                         value={
                                                            inputType
                                                              ? inputType.charAt(0).toUpperCase() + inputType.slice(1).toLowerCase()
                                                              : ""
                                                          }
                                                         placeholder=" "
                                                         required
                                                         onChange={(e)=>{setInputType(e.target.value)}}
                                                      />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Input type</label>
                                                      <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                      <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                      {filteredInputDrop.length === 0 ? (
                                                            <li className="dropdown-nodata-found">No data found</li>
                                                         ) : (
                                                            filteredInputDrop.map((dropdownValue, id) => (                                                            
                                                            <li key={id}>
                                                               <a
                                                                  className="dropdown-item"
                                                                  href="#"
                                                                  onClick={() => {
                                                                     const inputTypeNormalized = dropdownValue.input_type;
                                                                     setInputTypeValue(inputTypeNormalized);
                                                                     setInputType(inputTypeNormalized);
                                                                   }}                                                               >
                                                                  {dropdownValue.input_type.charAt(0).toUpperCase() + dropdownValue.input_type.slice(1).toLowerCase()}
                                                               </a>
                                                            </li>
                                                         )))}
                                                      </ul>
                                                   </div>
                                                   {submit && inputType.length == 0 ? <div className='text-danger error-message-required'>Input type is required</div> : <></>}
                                                </div>
                                                <div className="col-md-6 mt-2">
                                                      <div className="form-check form-switch ms-1 is-filled">
                                                         <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="flexSwitchCheckDefault"
                                                            onChange={()=>{
                                                               if(required===true){
                                                                  setrequired(false)
                                                               }
                                                               else{
                                                               setrequired(true)}
                                                            }}
                                                            checked={required===true}
                                                         /> <span className="text-xs">Required Field</span>
                                                      </div>
                                                   </div>
                                                {inputType.toLowerCase()==="dropdown" ? (                                                
                                                <div className="container mt-3">
                                                <div className="row">
                                                {inputs.map((input, index) => (
                                                   <div className="col-md-6 mb-3" key={input.id}>
                                                      <div className="d-flex align-items-start gap-2">
                                                         <div className="flex-grow-1 position-relative">
                                                         <input
                                                            autoComplete="off"
                                                            onChange={(e) => handleChange(input.id, e.target.value)}
                                                            value={input.value}
                                                            type="text"
                                                            id={`vendor-crt-input-${input.id}`}
                                                            className={`vendor-crt-input loginfilled-frame-username ${submit && !input.value ? 'error' : ''}`}
                                                            placeholder=" "
                                                            required
                                                         />
                                                         <label htmlFor={`vendor-crt-input-${input.id}`} className="vendor-crt-label">
                                                            <i className="fa-solid fa-store"></i> Option {index + 1}
                                                         </label>
                                                         </div>
                                                         <button type="button" className="customOptionplus" onClick={() => handleAdd(input.id)}>
                                                         <i className="fa-solid fa-plus"></i>
                                                         </button>
                                                         {inputs.length > 1 ? (
                                                         <button
                                                            type="button"
                                                            className="customOptionxmark"
                                                            onClick={() => handleRemove(input.id)}
                                                         >
                                                            <i className="fa-solid fa-xmark"></i>
                                                         </button>
                                                         ) : (
                                                         <button
                                                            type="button"
                                                            className="customOptionxmark"
                                                            disabled
                                                            style={{ cursor: 'not-allowed', opacity: 0.5 }}
                                                            title="Cannot remove the last option"
                                                         >
                                                            <i className="fa-solid fa-xmark"></i>
                                                         </button>
                                                         )}
                                                      </div>
                                                      {submit && !input.value && (<div className="text-danger error-message-required">Option {index + 1} is required</div>)}
                                                   </div>
                                                   ))}
                                                </div>
                                              </div>
                                             ) : null}
                                                  </div>
                                               </div>
                                               <div className="modal-footer vendorcreate-modal-footer border-0">
                                                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" 
                                                  onClick={resetForm} 
                                                  id="closeModal">Close</button>
                                                  {modalMode === "create" ? (
                                                     <button type="button" className="btn btn-primary" 
                                                     onClick={handlecreateInput}
                                                     >
                                                        Create
                                                     </button>
                                                  ) : (
                                                     <button type="button" className="btn btn-primary" 
                                                     onClick={handlecreateInput}
                                                     >
                                                        Update
                                                     </button>
                                                  )}
                                               </div>
                                            </div>
                                         </div>
                                      </div>
                                    {/*Custom Contact Active Modal*/}
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
                                                    <h6 className="modal-confirm-subhead">You want to active this custom field ?</h6>:
                                                    <h6 className="modal-confirm-subhead">You want to deactive this custom field ?</h6>}
                                                    <div></div>
                                                </div>
                                            </div>
                                            <div className="modal-footer text-center vendor-delete-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeactiveModal">No</button>&nbsp;
                                                <button type="button" className="btn btn-primary" 
                                                onClick={()=>{active? handleinputStatus("active"):handleinputStatus("deactive")}}
                                                 >Yes</button>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                     {/*Custom Contact Delete Modal*/}
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
                                                    <h6 className="modal-confirm-subhead">You want to delete this custom field ?</h6>
                                                    </div>
                                            </div>
                                            <div className="modal-footer text-center vendor-delete-footer">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal">No</button>&nbsp;
                                                <button type="button" className="btn btn-primary" 
                                                  onClick={handlecustomFieldDelete} 
                                                >Yes</button>
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
    </div>
  )
}

export default ContactCustomField