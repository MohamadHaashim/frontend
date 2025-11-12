import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";
import './campaign-dashboard.css';
interface CampaignDetails {
    templateName: string,
    campaignName: string,
    tempalte_language: string,
    scheduleAt: any,
    status: string
}
interface CampaignQueueList {
    first_name: string,
    last_name: string,
    phone_number: string,
    message_status: string,
    error_message: string,
    updated_date: string
}
interface CampaignExecuteList {
    first_name: string,
    last_name: string,
    phone_number: string,
    message_status: string,
    error_message: string,
    updated_date: string
}
function CampaignDashboard() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(true);
    const [getId, setGetId] = useState('');
    const [loading, setLoading] = useState(false);
    const [queueloading, setqueueLoading] = useState(false);
    const [executeloading, seexecutetLoading] = useState(false);
    const [campaigndetails, setCampaigndetails] = useState<any>({});
    const [campQueueList, setcampQueueList] = useState<CampaignQueueList[]>([]);
    const [campExecuteList, setcampExecuteList] = useState<CampaignExecuteList[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage,setrecordsPerPage] = useState(10);
    const [recordsQueuePerPage,setrecordsQueuePerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [queuecurrentPage, setqueueCurrentPage] = useState(1);
    const [queuetotalRecords, setqueueTotalRecords] = useState(0);
    const [search,setSearch]=useState("");
    const [queuesearch,setqueueSearch]=useState("");
    const [campDashcount,setcampDashcount]=useState<any>("")
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [queuedebouncedSearch, setqueueDebouncedSearch] = useState('');
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
    //Queue Pagination
    const totalQueuePages = Math.ceil(queuetotalRecords / recordsQueuePerPage);
    
    const handleQueuePageChange = (pageNumber: any) => {
        if (pageNumber < 1 || pageNumber > totalQueuePages) return;
        setqueueCurrentPage(pageNumber);
    };
    const renderQueuePaginationItems = () => {
        let items = [];
        const maxPageNumbersToShow = 7;
        const halfRange = Math.floor(maxPageNumbersToShow / 2);

        let startPage, endPage;
        if (totalQueuePages <= maxPageNumbersToShow) {
            startPage = 1;
            endPage = totalQueuePages;
        } else if (queuecurrentPage <= halfRange) {
            startPage = 1;
            endPage = maxPageNumbersToShow;
        } else if (queuecurrentPage + halfRange >= totalQueuePages) {
            startPage = totalQueuePages - maxPageNumbersToShow + 1;
            endPage = totalQueuePages;
        } else {
            startPage = queuecurrentPage - halfRange;
            endPage = queuecurrentPage + halfRange;
        }

        if (startPage > 1) {
            items.push(
            <Pagination.Item key="1" active={1 === queuecurrentPage} onClick={() => handleQueuePageChange(1)}>
                1
            </Pagination.Item>
            );
            if (startPage > 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            }
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
            <Pagination.Item key={number} active={number === queuecurrentPage} onClick={() => handleQueuePageChange(number)}>
                {number}
            </Pagination.Item>
            );
        }

        if (endPage < totalQueuePages) {
            if (endPage < totalQueuePages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            }
            items.push(
            <Pagination.Item key={totalQueuePages} active={totalQueuePages === queuecurrentPage} onClick={() => handleQueuePageChange(totalQueuePages)}>
                {totalQueuePages}
            </Pagination.Item>
            );
        }

        return items;
    };
    const handleQuene = () => {
        setTab(true);
        setSearch("")
        handlecampaignQueueList(queuecurrentPage,queuesearch);
    }
    const handleExecuted = () => {
        setTab(false);
        setqueueSearch("")
        handlecampaignExecuteList(currentPage,search);
    }

    const handlecampaignList = () => {
        setLoading(true)
        const apiData = {
            templateId: getId,
        }
        VendorAPI.campaignListDashboardAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setCampaigndetails(responseData?.result?.campaignDetails)
                    if(campExecuteList){
                        setTab(false);
                    }
                    setLoading(false)
                } else {
                    // toast.error(responseData.apiStatus.message);
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error while fetching campaign details:", error);
                toast.error("An error occurred while fetching campaign details");
            });
    };

    const handlecampDashCount = () => {
        // setLoading(true)
        const apiData = {
            campaignId: getId,
        }
        VendorAPI.commonCampDashCount(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setcampDashcount(responseData?.CampaignDashCountData)
                } else {
                    // toast.error(responseData.apiStatus.message);
                    // setLoading(false)
                }
            })
            .catch((error: any) => {
                // setLoading(false)
                console.error("Error while fetching campaign dashboard count:", error);
                toast.error("An error occurred while fetching campaign dashboard count");
            });
    };

    const handlecampaignQueueList = (page: any,search:string) => {
        setqueueLoading(true)
        const apiData = {
           pageIndex: page - 1,
            dataLength:recordsQueuePerPage,
            campaignId: getId,
            filterBy:search,
        }
        VendorAPI.campaignListQueueAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setcampQueueList(responseData?.queueData || [])
                    setqueueTotalRecords(responseData?.totalRecordCount)
                    handlecampDashCount()
                    setqueueLoading(false)
                } else {
                    if (responseData.apiStatus.code == "401") {
                        setcampQueueList([])
                    }
                    // toast.error(responseData.apiStatus.message);
                    setqueueLoading(false)
                }
            })
            .catch((error: any) => {
                setqueueLoading(false)
                console.error("Error while loading campaign queue:", error);
                toast.error("An error occurred while loading campaign queue");
            });
    };

    const handlecampaignExecuteList = (page: any,search:string) => {
        seexecutetLoading(true)
        const apiData = {
           pageIndex: page - 1,
            dataLength:recordsPerPage,
            campaignId: getId,
            filterBy:search,
        }
        VendorAPI.campaignListExecutedAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setcampExecuteList(responseData?.executedData || [])
                    setTotalRecords(responseData?.totalRecordCount)
                    handlecampDashCount()
                    seexecutetLoading(false)
                } else {
                    if (responseData.apiStatus.code == "401") {
                        setcampExecuteList([])
                    }
                    // toast.error(responseData.apiStatus.message);
                    seexecutetLoading(false)
                }
            })
            .catch((error: any) => {
                seexecutetLoading(false)
                console.error("Error while loading campaign execute:", error);
                toast.error("An error occurred while loading campaign execute.");
            });
    };

    const handleRefresh=()=>{
        if(tab===true){
            handlecampaignQueueList(queuecurrentPage,queuesearch);
        }
        else if(tab===false){
            handlecampaignExecuteList(currentPage, search);
        }
    }
    const handleReportExport = async () => {
        try {
           var response;
           if(tab===true){
            response = await VendorAPI.whatscampaignQueueExport(getId);
            }
            else if(tab===false){
                response = await VendorAPI.whatscampaignExecuteExport(getId);
            }
           const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
           const today = new Date();
           const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear().toString().slice(-2)}`;
           var fileName;
           if(tab===true){
            fileName = `whhatsapp_execute_data_${formattedDate}.xlsx`;
           }
           else{
             fileName = `whatsapp_queue_data_${formattedDate}.xlsx`;
           }
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
        if (getId) {
            handlecampaignList();
            handlecampDashCount();
        }
    }, [getId]);
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearch(search);
          setCurrentPage(1);
        }, 1000);
    
        return () => {
          clearTimeout(handler);
        };
      }, [search]);
    useEffect(() => {
        const handler = setTimeout(() => {
          setqueueDebouncedSearch(queuesearch);
          setqueueCurrentPage(1);
        }, 1000);
    
        return () => {
          clearTimeout(handler);
        };
      }, [queuesearch]);
    useEffect(() => {
        if (getId) {
            handlecampaignExecuteList(currentPage, debouncedSearch);
        }
    }, [getId, currentPage, debouncedSearch,recordsPerPage]);
    
    useEffect(() => {
        if (getId) {
            handlecampaignQueueList(queuecurrentPage,queuedebouncedSearch);
        }
    }, [getId, queuecurrentPage,queuedebouncedSearch, recordsQueuePerPage]);

    
    useEffect(() => {
        const queryParams = window.location.pathname;
        const myArray = queryParams.split("/");
        const idFromUrl = myArray[4];
        if (idFromUrl) {
            setGetId(idFromUrl);
        }
    })
    return (
        <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                <TopNav />
                <div className="container-fluid py-1">
                    <div className="row">
                        <div className="col-md-6">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                    <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/create-campaign"}>Create Campaign</Link></li>
                                    <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Campaign Dashboard</li>
                                </ol>
                                <h6 className="text-start font-weight-bolder mb-0">Campaign Dashboard</h6>
                            </nav>
                        </div>
                        <div className="col-md-6 text-end">
                            <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/campaign") }}><i className="fa-solid fa-chevron-left"></i> Back to Campaigns</button>&nbsp;
                            <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/create-campaign") }}>Create Campaign</button>
                        </div>
                    </div>
                </div>
                {
                    loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>

                            <FadeLoader color="#36d7b7" />
                        </div>
                    ) : campaigndetails.length === 0 ? (
                        <p className="myprofile-content table-list-nodata or-text" style={{ textAlign: "center", margin: "40px 3%" }}><span>No data found</span></p>
                    ) : (
                        <>
                            <div className="maincontent container-fluid py-4">
                                <div className="d-flex  text-start gap-4">
                                    <div className=" w-50 myprofile-content">
                                    <div className="mb-2 icon camp-icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                        <i className="fa-solid fa-bullhorn text-white"></i>
                                    </div>
                                    <div className="row">
                                    <div className="col-md-6">
                                    <div className="campaign-dash-fonts">Campaign Name</div>
                                    <h6 className="campaign-dash-fonts">{campaigndetails?.campaignName}</h6>
                                    </div>

                                    <div className="col-md-6 col-sm-12">
                                    <div className="campaign-dash-fonts">Template Name</div>
                                    <h6 className="campaign-dash-fonts">{campaigndetails?.templateName}</h6>
                                    </div>

                                    <div className="col-md-6">
                                    <div className="campaign-dash-fonts">Template Language</div>
                                    <h6 className="campaign-dash-fonts">{campaigndetails?.tempalte_language}</h6>
                                    </div>
                                    <div className="col-md-6">
                                    <div className="campaign-dash-fonts">Created at</div>
                                    <h6 className="campaign-dash-fonts">
                                    {new Date(campaigndetails?.createdAt).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true
                                    }).replace(',', '').replace(' ', ' ')}
                                    </h6>
                                    </div>
                                    </div>
                                    </div>
                                    <div className="w-50 myprofile-content">
                                        <div className="mb-2 icon camp-icon-shape  superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                        <i className="fa-solid fa-hourglass-start text-white"></i>
                                    </div>
                                    <div className="row">
                                    <div className="col-md-6">
                                    <div className=" campaign-dash-fonts">Execution Scheduled at</div>
                                        <h6 className="campaign-dash-fonts">
                                            {new Date(campaigndetails?.scheduleAt).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: true
                                                }).replace(',', '').replace(' ', ' ')}
                                        </h6>
                                    </div>
                                    <div className="col-md-6">
                                    <div className=" campaign-dash-fonts">Execution Status</div>
                                        <div className="custom-Executed">
                                        {campaigndetails?.sendStatus === "Executed" ?<span className="campaign-dash-execute">{campaigndetails?.sendStatus}</span> : 
                                        <span className="text-xs campaign-status-warn">{campaigndetails? campaigndetails.sendStatus :""}</span>}</div>
                                    </div>
                                    <div className="col-md-6">
                                    {campaigndetails?.groupName ? 
                                    <>
                                    <div className="campaign-dash-fonts">All contacts from: </div>
                                    <h6 className="campaign-dash-fonts">{campaigndetails?.groupName}</h6>
                                    </>:<></>}
                                    </div>
                                    
                                    </div>
                                    </div>
                                </div>
                            </div>
                            </>
                            )}
                            <div className="dashboard-maincontent container-fluid py-4">
                                <div className="row">
                                    <div className="col-lg-12 col-12">
                                        <div className="row">
                                            <div className="col-lg-3 col-md-3 col-6 dashboard-card">
                                                <div className="card">
                                                    <span className="mask campaign-dash-bg-img1 opacity-10 border-radius-lg"></span>
                                                    <div className="card-body p-3 position-relative">
                                                        <div className="row">
                                                            <div className="col-8 text-start">
                                                                <div className="icon camp-icon-shape bg-dark superadmin-dashboard-iconbg shadow text-center border-radius-2xl">
                                                                    <i className="fa-solid fa-store text-white"></i>
                                                                </div>
                                                                <h5 className=" font-weight-bolder mb-0 mt-3">
                                                                    {campDashcount?.TotalContacts || 0}
                                                                </h5>
                                                                <span className=" text-sm">Total Contacts</span>
                                                                {/* <p className=" text-xxs text-start font-weight-bolder mt-auto mb-0 cursor-pointer"></p> */}
                                                                
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
                                                                    <i className="fa-solid fa-check text-white"></i>
                                                                </div>
                                                                <h5 className=" font-weight-bolder mb-0 mt-3">
                                                                    <span>
                                                                    {
                                                                        Number(campDashcount?.TotalDelivered || 0) +
                                                                        Number(campDashcount?.TotalRead || 0) +
                                                                        Number(campDashcount?.TotalSent || 0)
                                                                    }
                                                                    </span>

                                                                </h5>
                                                                <span className=" text-sm">Total Delivered</span>
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
                                                                    <i className="fa-solid fa-list-check text-white"></i>
                                                                </div>
                                                                <h5 className=" font-weight-bolder mb-0 mt-3">
                                                                    {campDashcount?.TotalRead || 0}
                                                                </h5>
                                                                <span className=" text-sm">Total Read</span>
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
                                                                    {campDashcount?.TotalFailed || 0}
                                                                </h5>
                                                                <span className=" text-sm">Total Failed</span>
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
                                        <div className="vendor-maincontent py-4">
                                            <div className="row align-items-center mt-3">
                                                {/* Tabs on the left, buttons on the right */}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    {/* Tabs Section */}
                                                    <ul className="campaign-tabs nav nav-tabs">
                                                        <li className="nav-item">
                                                            <button
                                                                style={tab ? { background: "#014aac", color: "white", border: "0px" } : {}}
                                                                className="nav-link active"
                                                                aria-current="page"
                                                                onClick={handleQuene}
                                                            >
                                                                Queue
                                                            </button>
                                                        </li>
                                                        <li className="nav-item">
                                                            <button
                                                                style={!tab ? { background: "#014aac", color: "white", border: "0px" } : {}}
                                                                className="nav-link active"
                                                                aria-current="page"
                                                                onClick={handleExecuted}
                                                            >
                                                                Executed
                                                            </button>
                                                        </li>
                                                    </ul>
                                                    <div className="d-flex gap-2">
                                                        <button className="button-header text-xs camp-dash-rebtn" onClick={handleRefresh}>
                                                            <i className="fa-solid fa-arrows-rotate"></i> Refresh
                                                        </button>
                                                        <button onClick={handleReportExport} className="button-header text-xs camp-dash-rebtn">
                                                            <i className="fa-solid fa-download"></i> Report
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Campaign Table Tabs */}
                                            <div className="card mb-4 campaign-table-tabs">
                                                {tab ? (
                                                    <div className="card-body px-0 pt-0 pb-2">
                                                        <div className="table-responsive p-0">
                                                        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                                                        <div className="d-flex align-items-center mt-4">
                                                            <span className='me-2 show-entries-cnt'>Show</span>
                                                            <div className="dropdown">
                                                                <button className="btn show-entries-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                    {recordsQueuePerPage}
                                                                </button>
                                                                <ul className="dropdown-menu show-entries-dropdown">
                                                                    <li><a className="dropdown-item" onClick={() => { setrecordsQueuePerPage(5); setqueueCurrentPage(1); }}>5</a></li>
                                                                    <li><a className="dropdown-item" onClick={() => { setrecordsQueuePerPage(10); setqueueCurrentPage(1); }}>10</a></li>
                                                                    <li><a className="dropdown-item" onClick={() => { setrecordsQueuePerPage(15); setqueueCurrentPage(1); }}>15</a></li>
                                                                    <li><a className="dropdown-item" onClick={() => { setrecordsQueuePerPage(20); setqueueCurrentPage(1); }}>20</a></li>
                                                                </ul>
                                                            </div>
                                                            <span className='ms-2 show-entries-cnt'>Entries</span>
                                                        </div>
                                                        <div className="vendor-create-container pe-4 mt-4" style={{ width: '40%' }}>
                                                            <input type="text" id="vendor-crt-input" className="vendor-crt-input"
                                                                autoComplete="off" onChange={(e) => setqueueSearch(e.target.value)} value={queuesearch}
                                                                placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                                <i className="fa-solid fa-magnifying-glass"></i> Search
                                                            </label>
                                                        </div>
                                                    </div>
                                                        
                                                            <table className="table align-items-center justify-content-center mb-0">
                                                            {
                                                        queueloading ? (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                            <span className="tab-loader"></span>
                                                        </div>
                                                        ) : campQueueList.length === 0 ? (
                                                        <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                                        ) : (
                                                        <>
                                                                <thead>
                                                                    <tr className="campaign-action">
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7">NAME</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">PHONE NUMBER</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">DELIVERY STATUS</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">LAST STATUS UPDATE AT</th>
                                                                    </tr>
                                                                </thead>
                                                                
                                                                <tbody className="campaign-action">
                                                                    {campQueueList.map((queueList) => (
                                                                        <tr>
                                                                            <td><span className="text-sm ps-3">{queueList?.first_name} {queueList?.last_name}</span></td>
                                                                            <td><span className="text-sm">{queueList?.phone_number}</span></td>
                                                                            <td>
                                                                            {queueList?.message_status === "queued" ? (
                                                                                <>
                                                                                <i className="fa-solid fa-q"></i> <span className="text-sm">{queueList?.message_status}</span>
                                                                                </>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            </td>
                                                                            <td>
                                                                            <span className="text-sm">
                                                                               📅 {queueList?.updated_date
                                                                                    ? new Date(queueList.updated_date).toLocaleString('en-US', {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: '2-digit',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                        second: '2-digit',
                                                                                        hour12: true
                                                                                    }).replace(',', '')
                                                                                    : 'N/A'}
                                                                                </span>

                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                </>
                                                            )}
                                                            </table>
                                                            {campQueueList.length > 0 &&( 
                                                            <div className="store-pagination">
                                                                <Pagination>
                                                                <Pagination.Prev onClick={() => handleQueuePageChange(queuecurrentPage - 1)} disabled={queuecurrentPage === 1} />
                                                                {renderQueuePaginationItems()}
                                                                <Pagination.Next onClick={() => handleQueuePageChange(queuecurrentPage + 1)} disabled={queuecurrentPage === totalQueuePages} />
                                                                </Pagination>
                                                            </div>
                                                            )}
                                                            
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="card-body px-0 pt-0 pb-2">
                                                        <div className="table-responsive p-0">
                                                        
                                                        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
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
                                                            <table className="table align-items-center justify-content-center mb-0">
                                                            {
                                                            executeloading ? (
                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                                     <span className="tab-loader"></span>
                                                                </div>
                                                            ) : campExecuteList.length === 0 ? (
                                                                <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                                            ) : (
                                                                <>
                                                                <thead>
                                                                    <tr className="campaign-action">
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7">Name</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">PHONE NUMBER</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">DELIVERY STATUS</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-3">REASON</th>
                                                                        <th className="text-uppercase campaign-table-head text-xxs font-weight-bolder opacity-7 ps-2">LAST STATUS UPDATE AT</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="campaign-action">
                                                                    {campExecuteList.map((executedList) => (
                                                                        <tr>
                                                                            <td><span className="text-sm ps-3">{executedList?.first_name} {executedList?.last_name}</span></td>
                                                                            <td><span className="text-sm">{executedList?.phone_number}</span></td>
                                                                            <td>{executedList?.message_status ==="sent"
                                                                                ?<>
                                                                                <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" height="13" viewBox="0 0 72 72"><path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z" fill="#899499"></path></svg>                                                      
                                                                                <span className="text-sm">Sent</span>
                                                                                </>
                                                                                :executedList?.message_status ==="delivered" ?
                                                                                <>
                                                                                <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#899499"></path></svg>
                                                                                <span className="text-sm">Delivered</span>
                                                                                </>
                                                                                :executedList?.message_status==="read"?
                                                                                <>
                                                                                <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"></path></svg>
                                                                                <span className="text-sm">Read</span>
                                                                                </>
                                                                                :executedList?.message_status==="failed"?
                                                                                <>
                                                                                <div className="actionCampFailedMsg-tooltip-container">
                                                                                <div className="actionChathelp-tooltip-text" style={{ whiteSpace: 'pre-wrap' }}>
                                                                                    <i className="fa-solid fa-circle-exclamation text-warning"></i> {executedList?.error_message}
                                                                                </div>
                                                                                <i className="fa-solid fa-triangle-exclamation text-danger"></i> <span className="text-sm text-danger"> Failed - <span className="text-xs">Message Undeliverable</span></span></div></>
                                                                                :""
                                                                                }</td>
                                                                                <td className="text-xs ps-3" style={{ whiteSpace: 'pre-wrap' }}>
                                                                                    {executedList?.error_message ? <>{executedList?.error_message}</>:<></>}
                                                                                </td>
                                                                            <td>
                                                                            <span className="text-sm">
                                                                               📅 {executedList?.updated_date
                                                                                    ? new Date(executedList.updated_date).toLocaleString('en-US', {
                                                                                        year: 'numeric',
                                                                                        month: 'short',
                                                                                        day: '2-digit',
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit',
                                                                                        second: '2-digit',
                                                                                        hour12: true
                                                                                    }).replace(',', '')
                                                                                    : 'N/A'}
                                                                                </span>

                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                                </>
                                                        )}
                                                            </table>
                                                            {campExecuteList.length > 0 && (
                                                                <div className="store-pagination">
                                                                    <Pagination>
                                                                        <Pagination.Prev
                                                                            onClick={() => handlePageChange(currentPage - 1)}
                                                                            disabled={currentPage === 1}
                                                                        />
                                                                        {renderPaginationItems()}
                                                                        <Pagination.Next
                                                                            onClick={() => handlePageChange(currentPage + 1)}
                                                                            disabled={currentPage === totalPages}
                                                                        />
                                                                    </Pagination>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
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
export default CampaignDashboard;