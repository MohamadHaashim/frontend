import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../../../layouts/DashboardLayout';
import TopNav from '../../../../shared/TopNav';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FadeLoader } from 'react-spinners';
import { Pagination } from 'react-bootstrap';
import VendorAPI from '../../../../api/services/vendorLogin/vendorApi';
import { toast } from 'react-toastify';
import Footer from '../../../../shared/Footer';
import "./group.css";
interface GroupList {
    groupId: string;
    groupUid: string;
    groupName: any;
    description: string;
    groupAddressLine2: string;
    activeStatus: string;
}
function Group() {
    const [redirect, setRedirect] = React.useState<string | null>(null);
    const [modalMode, setModalMode] = useState("create");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [submit, setSubmit] = useState(false);
    const [groupId, setGroupId] = useState("")
    const [isArchive, setisArchive] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage,setrecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [archivecurrentPage, setarchiveCurrentPage] = useState(1);
    const [archivetotalRecords, setarchiveTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [groupListData, setgroupListData] = useState<GroupList[]>([])
    const [groupArchiveListData, setgroupArchiveListData] = useState<GroupList[]>([])
    const [tab, setTab] = useState(true);
    const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
    const[disabled,setdisabled]=useState(false);
    const[archive,setarchive]=useState(true);
    const [deleteAll, setDeleteAll] = useState(false);
    
    const handleSelectAll = () => {
        const allGroupIds = [
            ...groupListData.map(group => group.groupId),
            ...groupArchiveListData.map(group => group.groupId),
        ];
        if (selectedGroupIds.length === allGroupIds.length) {
            setSelectedGroupIds([]);
            setdisabled(false);
        } else {
            setSelectedGroupIds(allGroupIds);
            setdisabled(true);
        }
    };
    const handleCheckboxChange = (groupId: any) => {
        setSelectedGroupIds((prevSelectedIds) => {
            let updatedSelectedIds;
            if (prevSelectedIds.includes(groupId)) {
                updatedSelectedIds = prevSelectedIds.filter(id => id !== groupId);
            } else {
                updatedSelectedIds = [...prevSelectedIds, groupId];
            }
            setdisabled(updatedSelectedIds.length === 0);
            return updatedSelectedIds;
        });
    };
    
    const handleActive = () => {
        setTab(true);
        setdisabled(false);
        setSelectedGroupIds([]);
     }
     const handleArchive = () => {
        setTab(false);
        setdisabled(false);
        setSelectedGroupIds([]);
     }
    // Pagination Method

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePageChange = (pageNumber: any) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        setSelectedGroupIds([]);
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
    // Archive Pagination Method

    const totalArchivePages = Math.ceil(archivetotalRecords / recordsPerPage);

    const handleArchivePageChange = (pageNumber: any) => {
        if (pageNumber < 1 || pageNumber > totalArchivePages) return;
        setarchiveCurrentPage(pageNumber);
        setSelectedGroupIds([]);
    };
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

    const openModal = (mode: any) => {
        setModalMode(mode);
    };
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setSubmit(false)
    }
    const handlecreateGroup = () => {
        setSubmit(true);
        if (!title) {
            return;
        }
        const apiData = {
            ...(modalMode === "edit" && { id: groupId }),
            groupName: title,
            description: description
        };
        const apiCall = modalMode === "create" ? VendorAPI.contactGroupCreateAPI(apiData) : VendorAPI.contactGroupEditAPI(apiData);
        apiCall
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    resetForm();
                    if(tab===true){
                        handlecontactGroupList(currentPage);
                    }
                    else if(tab===false){
                        handleArchivecontactGroupList(archivecurrentPage);
                    }
                    setSubmit(false);
                    toast.success(responseData.apiStatus.message);
                    const closeButton = document.getElementById("closeCreate");
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
    const handleGetcontactGroup = (groupId: any) => {
        VendorAPI.contactGroupGetAPI(groupId)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setTitle(responseData.result.groupName);
                    setDescription(responseData.result.description);
                } else {
                    toast.error(responseData.apiStatus.message);
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error while fetching contact group details:", error);
                toast.error("An error occurred while fetching contact group details.");
            });
    };
    const handlecontactGroupList = (page: any) => {
        setLoading(true)
        const apiData = {
            pageIndex: page - 1,
            dataLength: recordsPerPage
        };
        VendorAPI.contactGroupListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setLoading(false)
                    setgroupListData(responseData.result.GroupData)
                    setTotalRecords(responseData.result.totalRecordCount)
                } else {
                    if (responseData.apiStatus.code == "404") {
                    setgroupListData([])
                    }
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error while fetching group details:", error);
                toast.error("An error occurred while fetching group details.");
            });
    }
    const handleArchivecontactGroupList = (page: any) => {
        setLoading(true)
        const apiData = {
            pageIndex: page - 1,
            dataLength: recordsPerPage
        };
        VendorAPI.contactArchiveGroupListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setLoading(false)
                    setgroupArchiveListData(responseData.result.GroupData)
                    setarchiveTotalRecords(responseData.result.totalRecordCount)
                } else {
                    setgroupArchiveListData([])
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error while fetching archive group details:", error);
                toast.error("An error occurred while fetching archive group details.");
            });
    }
    const handlecontactGroupDelete = (name:any) => {
        VendorAPI.contactGroupDeleteAPI(groupId)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    if(name==="active"){
                    const newTotalRecords = totalRecords - 1;
                    setTotalRecords(newTotalRecords);
                    let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
                    if (currentPage > totalPages) {
                        setCurrentPage(totalPages || 1); 
                    }
                    else if (currentPage < 1) {
                        setCurrentPage(1);
                    }
                }else{
                    let newTotalRecords = archivetotalRecords - 1;
                    setarchiveTotalRecords(newTotalRecords);
                    let totalPages = Math.ceil(newTotalRecords / archivetotalRecords);
                    if (archivecurrentPage > totalPages) {
                        setarchiveCurrentPage(totalPages || 1); 
                    } else if (archivecurrentPage < 1) {
                        setarchiveCurrentPage(1);
                    }
                }
                    const closeButton = document.getElementById("closedeleteModal");
                    if (closeButton) {
                        closeButton.click();
                    }
                    toast.success(responseData.apiStatus.message);
                    {tab===true ?handlecontactGroupList(currentPage):handleArchivecontactGroupList(archivecurrentPage)}   
                } else {
                    toast.error(responseData.apiStatus.message);
                }
            })
            .catch((error: any) => {
                setLoading(false);
                console.error("Error during delete:", error);
                toast.error("An error occurred during deletion.");
            });
    };
    //Group Delete All

   const handlegroupDeleteAll = () => {
    VendorAPI.contactGroupDeleteAllAPI()
       .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
             toast.success(responseData.apiStatus.message);
             setLoading(false)
             setDeleteAll(false)
             setdisabled(true)
             setSelectedGroupIds([])
             const closeButton = document.getElementById("closealldelete");
           if (closeButton) {
            handlecontactGroupList(currentPage);
              closeButton.click();
           }
          } else {
             toast.error(responseData.apiStatus.message);
          }
       })
       .catch((error: any) => {
          setLoading(false)
          console.error("Error during delete all:", error);
          toast.error("An error occurred during delete all.");
       });
 };
    const handleBulkGroupDelete = (name:any) => {
        setLoading(true)
        const apiData = {deleteId:selectedGroupIds};
        VendorAPI.contactBulkGroupDeleteAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === "200") {
                    if(name==="active"){
                        const newTotalRecords = totalRecords - 1;
                    setTotalRecords(newTotalRecords);
                    let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
                    if (currentPage > totalPages) {
                        setCurrentPage(totalPages || 1); 
                    }
                    else if (currentPage < 1) {
                        setCurrentPage(1);
                    }
                    }else{
                        let newTotalRecords = archivetotalRecords - 1;
                        setarchiveTotalRecords(newTotalRecords);
                        let totalPages = Math.ceil(newTotalRecords / archivetotalRecords);
                        if (archivecurrentPage > totalPages) {
                            setarchiveCurrentPage(totalPages || 1); 
                        } else if (archivecurrentPage < 1) {
                            setarchiveCurrentPage(1);
                        }
                    }
                    setLoading(false)
                    setdisabled(true)
                    setSelectedGroupIds([])
                    const closeButton = document.getElementById("closeselecteddelete");
                    if (closeButton) {
                        closeButton.click();
                    }
                    {tab===true ?handlecontactGroupList(currentPage):handleArchivecontactGroupList(archivecurrentPage)}   
                    toast.success(responseData.apiStatus.message)
                } else {
                    setgroupListData([])
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during bulk delete:", error);
                toast.error("An error occurred during bulk deletion.");
            });
    }
    const handleBulkGroupDeactive = () => {
        setLoading(true)
        const apiData = {id:selectedGroupIds};
        VendorAPI.contactGrouparchiveBulkDeactive(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === "200") {
                    setSelectedGroupIds([]);
                    const newTotalRecords = totalRecords - 1;
                    setTotalRecords(newTotalRecords);
                    let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
                    if (currentPage > totalPages) {
                        setCurrentPage(totalPages || 1); 
                    }
                    else if (currentPage < 1) {
                        setCurrentPage(1);
                    }
                    setLoading(false)
                    setdisabled(true)
                    const closeButton = document.getElementById("closearchiveBulkModal");
                    if (closeButton) {
                        handlecontactGroupList(currentPage);
                        closeButton.click();
                    }
                    toast.success(responseData.apiStatus.message)
                } else {
                    setgroupListData([])
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during group deactive:", error);
                toast.error("An error occurred during group deactive.");
            });
    }
    const handleBulkGroupActive = () => {
        setLoading(true)
        const apiData = {id:selectedGroupIds};
        VendorAPI.contactGrouparchiveBulkActive(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === "200") {
                    setSelectedGroupIds([]);
                    let newTotalRecords = archivetotalRecords - 1;
                    setarchiveTotalRecords(newTotalRecords);
                    let totalPages = Math.ceil(newTotalRecords / archivetotalRecords);
                    if (archivecurrentPage > totalPages) {
                        setarchiveCurrentPage(totalPages || 1); 
                    } else if (archivecurrentPage < 1) {
                        setarchiveCurrentPage(1);
                    }
                    setLoading(false)
                    setdisabled(true)
                    const closeButton = document.getElementById("closearchiveBulkModal");
                    if (closeButton) {
                        closeButton.click();
                    }
                    toast.success(responseData.apiStatus.message)
                    handleArchivecontactGroupList(archivecurrentPage);
                } else {
                    setgroupListData([])
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during group active:", error);
                toast.error("An error occurred during group active.");
            });
    }
    const navigate = useNavigate();

    const groupNavigate = (title: any) => {
        let groupDetails = {
            title,
            groupCntStatus: true
        }
        navigate(`/vendor/groupcontacts`, { state: { groupDetails } });
    }
//Campaign Archive Active
const contactGrouparchiveActive =async (name: any) => {
    try {
        var responseData;
        if(name==="active"){
            responseData=await VendorAPI.contactGrouparchiveActive(groupId);
        }
        else{
            responseData = await VendorAPI.contactGrouparchiveDeactive(groupId);
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
                handlecontactGroupList(currentPage);
                closeButton.click();
            }
        } else {
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
                handleArchivecontactGroupList(archivecurrentPage);
                closeButton.click();
            }
        }    
    }
    } catch (error) {
        console.error("Error during API call:", error);
        toast.error("An error occurred during the get process.");
    }
    }
 //Campaign Archive Deactive
 const contactGrouparchiveDeactive =async (id: any) => {
    try {
       const responseData = await VendorAPI.contactGrouparchiveDeactive(id);
       if (responseData.apiStatus.code === '200') {
          toast.success("Campaign Archived");
          const newTotalRecords = totalRecords - 1;
            setTotalRecords(newTotalRecords);
            let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
            if (currentPage > totalPages) {
                setCurrentPage(totalPages || 1); 
            }
            else if (currentPage < 1) {
                setCurrentPage(1);
            }
          const closeButton = document.getElementById("closearchiveModal");
               if (closeButton) {
                handlecontactGroupList(currentPage);
                  closeButton.click();
               }
       }
    } catch (error) {
        console.error("Error during API call:", error);
        toast.error("An error occurred during the get process.");
    }
    }
    useEffect(() => {
        if(tab===false){
        handleArchivecontactGroupList(archivecurrentPage);
        }
    }, [archivecurrentPage,tab])
    useEffect(() => {
        if(tab===true){
        handlecontactGroupList(currentPage);
        }
    }, [currentPage,tab,recordsPerPage])
   //For the modal is outside_close

   useEffect(() => {
    const modalElements = [
      document.getElementById('vendorcontact')
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
                <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
                    <div className="col-md-6">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li className="breadcrumb-item text-sm">
                                    <Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                <li
                                    className="breadcrumb-item text-sm text-dark active"
                                    aria-current="page"
                                >
                                    Contact Groups
                                </li>
                            </ol>
                            <h6 className="text-start font-weight-bolder mb-0">
                                Contact Groups
                            </h6>
                        </nav>
                    </div>
                    <div className="col-md-6 text-end dropdown">
                        <button className="vendor-crt-btn"
                            onClick={() => openModal("create")}
                            data-bs-toggle="modal" data-bs-target="#vendorcontact">
                            <span>Add New Group</span>
                        </button>


                    </div>
                </div>
                <div className="vendor-maincontent container-fluid py-4">
                    <div className="row">
                        <div className="col-12">
                        <ul className="campaign-tabs nav nav-tabs">
                        <li className="nav-item" >
                           <button style={tab ? { background: "#014aac", color: "white", border: "0px" } : {}} className="nav-link active" aria-current="page" onClick={handleActive}>Active</button>
                        </li>
                        <li className="nav-item">
                           <button style={!tab ? { background: "#014aac", color: "white", border: "0px" } : {}} className="nav-link active" aria-current="page" onClick={handleArchive}>Archive</button>
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
                                            ) : groupListData.length === 0 ? (
                                                <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                            ) : (
                                                <><table className="table position-relative align-items-center justify-content-center mb-0">
                                                    <thead>
                                                    <div className='d-flex select-btn-main show-entries-main position-absolute'>
                                                    <button className='bulk-select' onClick={handleSelectAll}>
                                                        {selectedGroupIds.length === groupListData.length + groupArchiveListData.length
                                                            ? 'Unselect All'
                                                            : 'Select All'}
                                                    </button>                                                        
                                                    <div className="dropdown">
                                                                <button className="btn show-entries-btn1 dropdown-toggle" 
                                                                // disabled={disabled}
                                                                 type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Bulk Actions
                                                                </button>
                                                                    <ul className="dropdown-menu show-entries-dropdown">
                                                                    <li><a className="dropdown-item" data-bs-toggle="modal"
                                                                            data-bs-target="#allgroupdelete" onClick={()=>setDeleteAll(true)}>Delete All Groups</a></li>
                                                                            <li><a className={`dropdown-item ${selectedGroupIds.length === 0 ? 'disabled' : ''}`}
                                                                    {...(selectedGroupIds.length > 0 && {'data-bs-toggle': 'modal','data-bs-target': '#selectedgroupdelete',})}
                                                                    href="#"
                                                                    style={{ cursor: selectedGroupIds.length === 0 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={(e) => {if (selectedGroupIds.length === 0) e.preventDefault();}}>Delete Selected Groups</a></li>
                                                                    <li><a className={`dropdown-item ${selectedGroupIds.length === 0 ? 'disabled' : ''}`}
                                                                    {...(selectedGroupIds.length > 0 && {'data-bs-toggle': 'modal','data-bs-target': '#vendorarchive',})}
                                                                    href="#"
                                                                    style={{ cursor: selectedGroupIds.length === 0 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={(e) => {if (selectedGroupIds.length === 0) e.preventDefault();setarchive(true);}}>Archive Selected Groups</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex show-entries-main mt-5'>
                                                            <span className='show-entries-cnt'>Show</span> 
                                                                <div className="dropdown">
                                                                    <button className="btn show-entries-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        {recordsPerPage}
                                                                    </button>
                                                                        <ul className="dropdown-menu show-entries-dropdown w-25">
                                                                        <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(10); setCurrentPage(1); }}>10</a></li>
                                                                        <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(20); setCurrentPage(1); }}>20</a></li>
                                                                        <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(50); setCurrentPage(1); }}>50</a></li>
                                                                        <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(100); setCurrentPage(1); }}>100</a></li>
                                                                    </ul>
                                                                </div>
                                                            <span className='show-entries-cnt1'>Entries</span>
                                                        </div>
                                                        <tr className="vendor-table-mainhead">
                                                            <th className="contact-table-head text-xxs font-weight-bolder opacity-7">
                                                                Select
                                                            </th>
                                                            <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                                Title
                                                            </th>
                                                            <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                                Description
                                                            </th>
                                                            <th className="contact-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                                                Action
                                                            </th>
                                                            {/*<th></th>*/}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-start">

                                                        {groupListData?.map((contactGroupList: any) => (
                                                            <tr
                                                                key={contactGroupList.id}
                                                            >
                                                                <td className="align-middle text-start text-xs">
                                                                    <div className="d-flex px-2 ml-5 vendor-contact-select">
                                                                        <input type="checkbox" checked={selectedGroupIds.includes(contactGroupList.groupId)}
                                                                        onChange={() => handleCheckboxChange(contactGroupList.groupId)}/>
                                                                    </div>
                                                                </td>

                                                                <td className="align-middle text-start text-sm">
                                                                    <span>
                                                                        {contactGroupList?.groupName}
                                                                    </span>
                                                                </td>
                                                                <td className="align-middle text-start text-sm">
                                                                    <span>
                                                                        {contactGroupList?.description}
                                                                    </span>
                                                                </td>
                                                                <td className="align-middle text-center vendor-login-td">
                                                                    <div className="actionView-tooltip-container">
                                                                        <button
                                                                            className="btn-3 vendorbtn-view"
                                                                            type="button"
                                                                            onClick={() => { groupNavigate(contactGroupList?.groupName) }}
                                                                        >
                                                                            <span className="btn-inner--icon">
                                                                                <i className="fa-solid fa-user-group"></i>
                                                                            </span>
                                                                        </button>
                                                                        <div className="actionView-tooltip-text">
                                                                            Group
                                                                        </div>
                                                                    </div>
                                                                    &nbsp;
                                                                    <div className="actionEdit-tooltip-container">
                                                                        <button
                                                                            className="btn-3 vendorbtn-edit"
                                                                            type="button"
                                                                            data-bs-toggle="modal" data-bs-target="#vendorcontact"
                                                                            onClick={() => {
                                                                                openModal("edit");
                                                                                handleGetcontactGroup(contactGroupList?.groupId); setGroupId(contactGroupList?.groupId)
                                                                            }}
                                                                        >
                                                                            <span className="btn-inner--icon">
                                                                                <i className="fa-regular fa-pen-to-square"></i>
                                                                            </span>
                                                                        </button>
                                                                        &nbsp;
                                                                        <div className="actionEdit-tooltip-text">
                                                                            Edit
                                                                        </div>
                                                                    </div>
                                                                    <div className="actionArchive-tooltip-container">
                                                                        <button
                                                                            className="btn-3 vendorbtn-archive"
                                                                            type="button"
                                                                            data-bs-toggle="modal" onClick={() => { setGroupId(contactGroupList?.groupId);setisArchive(true) }} data-bs-target="#groupArchive"

                                                                        >
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
                                                                        <button
                                                                            className="btn-3 vendorbtn-danger"
                                                                            type="button"
                                                                            data-bs-toggle="modal"
                                                                            onClick={() => { setGroupId(contactGroupList?.groupId) }}
                                                                            data-bs-target="#vendordelete"
                                                                        >
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
                                                    {groupListData.length === 0 ? "" :
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="store-pagination">
                                                            <Pagination>
                                                                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                                                {renderPaginationItems()}
                                                                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                                            </Pagination>
                                                        </div>
                                                    }
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
                                            ) : groupArchiveListData.length === 0 ? (
                                                <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                            ) : (
                                                <><table className="table position-relative align-items-center justify-content-center mb-0">
                                                    <thead>
                                                    <div className='d-flex show-entries-main ps-3'>
                                                    <button className='bulk-select' onClick={handleSelectAll}>
                                                            {selectedGroupIds.length === groupListData.length + groupArchiveListData.length
                                                                ? 'Unselect All'
                                                                : 'Select All'}
                                                        </button>                                                        
                                                        <div className="dropdown">
                                                                <button className="btn show-entries-btn1 dropdown-toggle" 
                                                                // disabled={disabled} 
                                                                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    Bulk Actions
                                                                </button>
                                                                    <ul className="dropdown-menu show-entries-dropdown">
                                                                    <li><a className="dropdown-item" data-bs-toggle="modal"
                                                                            data-bs-target="#allgroupdelete" onClick={()=>setDeleteAll(true)}>Delete All Groups</a></li>
                                                                            <li><a className={`dropdown-item ${selectedGroupIds.length === 0 ? 'disabled' : ''}`}
                                                                    {...(selectedGroupIds.length > 0 && {'data-bs-toggle': 'modal','data-bs-target': '#selectedgroupdelete',})}
                                                                    href="#"
                                                                    style={{ cursor: selectedGroupIds.length === 0 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={(e) => {if (selectedGroupIds.length === 0) e.preventDefault();}}>Delete Selected Groups</a></li>
                                                                     <li><a className={`dropdown-item ${selectedGroupIds.length === 0 ? 'disabled' : ''}`}
                                                                    {...(selectedGroupIds.length > 0 && {'data-bs-toggle': 'modal','data-bs-target': '#vendorarchive',})}
                                                                    href="#"
                                                                    style={{ cursor: selectedGroupIds.length === 0 ? 'not-allowed' : 'pointer' }}
                                                                    onClick={(e) => {if (selectedGroupIds.length === 0) e.preventDefault();setarchive(false);}}>Unarchive Selected Groups</a></li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex show-entries-main'>
                                                            <span className='show-entries-cnt'>Show</span> 
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
                                                            <span className='show-entries-cnt1'>Entries</span>
                                                        </div>
                                                        <tr className="vendor-table-mainhead">
                                                            <th className="contact-table-head text-xxs font-weight-bolder opacity-7">
                                                                Select
                                                            </th>
                                                            <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                                Title
                                                            </th>
                                                            <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                                Description
                                                            </th>
                                                            <th className="contact-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                                                Action
                                                            </th>
                                                            {/*<th></th>*/}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="text-start">

                                                        {groupArchiveListData?.map((contactGroupList: any) => (
                                                            <tr
                                                                key={contactGroupList.id}
                                                            >
                                                               <td className="align-middle text-start text-xs">
                                                                    <div className="d-flex px-2 ml-5 vendor-contact-select">
                                                                        <input type="checkbox" checked={selectedGroupIds.includes(contactGroupList.groupId)}
                                                                        onChange={() => handleCheckboxChange(contactGroupList.groupId)}/>
                                                                    </div>
                                                                </td>

                                                                <td className="align-middle text-start text-sm">
                                                                    <span>
                                                                        {contactGroupList?.groupName}
                                                                    </span>
                                                                </td>
                                                                <td className="align-middle text-start text-sm">
                                                                    <span>
                                                                        {contactGroupList?.description}
                                                                    </span>
                                                                </td>
                                                                <td className="align-middle text-center vendor-login-td">
                                                                    <div className="actionView-tooltip-container">
                                                                        <button
                                                                            className="btn-3 vendorbtn-view"
                                                                            type="button"
                                                                            onClick={() => { groupNavigate(contactGroupList?.groupName) }}
                                                                        >
                                                                            <span className="btn-inner--icon">
                                                                                <i className="fa-solid fa-user-group"></i>
                                                                            </span>
                                                                        </button>
                                                                        <div className="actionView-tooltip-text">
                                                                            Group
                                                                        </div>
                                                                    </div>
                                                                    &nbsp;
                                                                    <div className="actionEdit-tooltip-container">
                                                                        <button
                                                                            className="btn-3 vendorbtn-edit"
                                                                            type="button"
                                                                            data-bs-toggle="modal" data-bs-target="#vendorcontact"
                                                                            onClick={() => {
                                                                                openModal("edit");
                                                                                handleGetcontactGroup(contactGroupList?.groupId); setGroupId(contactGroupList?.groupId)
                                                                            }}
                                                                        >
                                                                            <span className="btn-inner--icon">
                                                                                <i className="fa-regular fa-pen-to-square"></i>
                                                                            </span>
                                                                        </button>
                                                                        &nbsp;
                                                                        <div className="actionEdit-tooltip-text">
                                                                            Edit
                                                                        </div>
                                                                    </div>
                                                                    <div className="actionArchive-tooltip-container">
                                                                        <button
                                                                            className="btn-3 vendorbtn-archive"
                                                                            type="button"
                                                                            data-bs-toggle="modal" onClick={() => { setGroupId(contactGroupList?.groupId);setisArchive(false) }} data-bs-target="#groupArchive"
                                                                        >
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
                                                                        <button
                                                                            className="btn-3 vendorbtn-danger"
                                                                            type="button"
                                                                            data-bs-toggle="modal"
                                                                            onClick={() => { setGroupId(contactGroupList?.groupId) }}
                                                                            data-bs-target="#vendordelete"
                                                                        >
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
                                                    {groupArchiveListData.length === 0 ? "" :
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} className="store-pagination">
                                                           <Pagination>
                                                                <Pagination.Prev onClick={() => handleArchivePageChange(archivecurrentPage - 1)} disabled={archivecurrentPage === 1} />
                                                                {renderArchivePaginationItems()}
                                                                <Pagination.Next onClick={() => handleArchivePageChange(archivecurrentPage + 1)} disabled={archivecurrentPage === totalArchivePages} />
                                                            </Pagination>
                                                        </div>
                                                    }
                                                </>
                                            )}
                                    </div>
                                </div>
}
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>

            <div className="modal fade" id="vendorcontact" aria-labelledby="vendorcontactLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content all-modal-content vendorcontact-modal-content">
                        <div className="modal-header vendorcontact-modal-header border-0">
                            <h5 className="modal-title vendorcontact-modal-title" id="vendorcontactLabel">
                                {modalMode === "create" ? "Create New Group" : "Edit Group"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="row modal-container-size modal-body vendorcontact-modal-body">
                            <div className="row mt-n4">
                                <div className="col-md-12 login-input-group">
                                    <div className="vendor-create-container">
                                        <input type="text" id="vendor-crt-input" className="vendor-crt-input"
                                            style={submit && title.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                            autoComplete="off" onChange={(e) => setTitle(e.target.value)} value={title}
                                            placeholder=" " required />
                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Title</label>
                                    </div>
                                    {submit && title.length == 0 ? (
                                        <div className="text-danger error-message-required">Title is required </div>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                                <div className="col-md-12 login-input-group">
                                    <div className="vendor-create-container">
                                        <textarea id="vendor-crt-input"
                                            autoComplete="off" onChange={(e) => setDescription(e.target.value)} value={description}
                                            className="vendor-crt-input" placeholder=" " required />
                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Description</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer vendorcreate-modal-footer border-0">
                            <button type="button" className="btn btn-secondary"
                                onClick={resetForm}
                                data-bs-dismiss="modal" id="closeCreate">Close</button>
                            {modalMode === 'create' ? <button
                                onClick={handlecreateGroup}
                                type="button" className="btn btn-primary">
                                Submit
                            </button> : <button
                                onClick={handlecreateGroup}
                                type="button" className="btn btn-primary">
                                Update
                            </button>}
                        </div>
                    </div>
                </div>
            </div>

            {/*Group Delete Modal*/}
            <div className="modal fade" id="vendordelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content all-modal-content vendor-delete-content">
                        <div className=" vendor-delete-header">
                        </div>
                        <div className="modal-body vendor-delete-body">
                            <div className="row">
                                <div className="vendor-delete-icon">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <h5 className='modal-confirm-head'>Are You Sure !</h5>
                                <h6 className='modal-confirm-subhead'>You want to delete this group permanently?</h6>
                                <div></div>
                            </div>
                        </div>
                        <div className="modal-footer text-center vendor-delete-footer">
                            <button type="button" className="btn btn-secondary" id="closedeleteModal" data-bs-dismiss="modal">No</button>&nbsp;
                            <button type="button" onClick={() =>  handlecontactGroupDelete("active")} className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Group Selected Delete Modal*/}
            <div className="modal fade" id="selectedgroupdelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content all-modal-content vendor-delete-content">
                        <div className=" vendor-delete-header">
                        </div>
                        <div className="modal-body vendor-delete-body">
                            <div className="row">
                                <div className="vendor-delete-icon">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <h5 className='modal-confirm-head'>Are You Sure !</h5>
                                <h6 className='modal-confirm-subhead'>You want to delete all selected group permanently?</h6>
                                <div></div>
                            </div>
                        </div>
                        <div className="modal-footer text-center vendor-delete-footer">
                            <button type="button" className="btn btn-secondary" id="closeselecteddelete" data-bs-dismiss="modal">No</button>&nbsp;
                            <button type="button" onClick={() => handleBulkGroupDelete("active")} className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Group All Delete Modal*/}
            <div className="modal fade" id="allgroupdelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content all-modal-content vendor-delete-content">
                        <div className=" vendor-delete-header">
                        </div>
                        <div className="modal-body vendor-delete-body">
                            <div className="row">
                                <div className="vendor-delete-icon">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <h5 className='modal-confirm-head'>Are You Sure !</h5>
                                <h6 className='modal-confirm-subhead'>You want to delete all group permanently?</h6>
                                <div></div>
                            </div>
                        </div>
                        <div className="modal-footer text-center vendor-delete-footer">
                            <button type="button" className="btn btn-secondary" id="closealldelete" data-bs-dismiss="modal">No</button>&nbsp;
                            <button type="button" onClick={() =>  handlegroupDeleteAll()} className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Group Active Modal*/}
            <div className="modal fade" id="vendorarchive" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content all-modal-content vendor-delete-content">
                        <div className=" vendor-delete-header">
                        </div>
                        <div className="modal-body vendor-delete-body">
                            <div className="row">
                                <div className="vendor-delete-icon">
                                    <i className="fa-solid fa-triangle-exclamation"></i>
                                </div>
                                <h5 className='modal-confirm-head'>Are You Sure !</h5>
                                {archive?
                                <h6 className='modal-confirm-subhead'>You want to archive all selected group?</h6>:
                                <h6 className='modal-confirm-subhead'>You want to unarchive all selected group?</h6>}
                                <div></div>
                            </div>
                        </div>
                        <div className="modal-footer text-center vendor-delete-footer">
                            <button type="button" className="btn btn-secondary" id="closearchiveBulkModal" data-bs-dismiss="modal">No</button>&nbsp;
                            <button type="button" onClick={() => archive ? handleBulkGroupDeactive() : handleBulkGroupActive()} className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/*Archive Modal*/}
            <div className="modal fade" id="groupArchive" tab-Index="-1" aria-labelledby="groupArchiveLabel" aria-hidden="true">
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
                                 {isArchive? <h6 className="modal-confirm-subhead">You want to archive this group?</h6>:<h6 className="modal-confirm-subhead">You want to unarchive this group?</h6>}
                              </div>
                           </div>
                           <div className="modal-footer text-center vendor-delete-footer">
                              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closearchiveModal">No</button>&nbsp;
                              <button type="button" className="btn btn-primary" onClick={()=>{isArchive? contactGrouparchiveActive("deactive"):contactGrouparchiveActive("active");}} >Yes</button>
                           </div>
                        </div>
                     </div>
                  </div>
        </DashboardLayout>
    )
}

export default Group