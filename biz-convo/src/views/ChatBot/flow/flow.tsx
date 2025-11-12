import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navlogo from "../../../assets/img/bizconvo-logo.png";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { Pagination } from 'react-bootstrap';
import { FadeLoader } from "react-spinners";

function ChatbotFlow() {


    const navigate = useNavigate();

    const [modalMode, setModalMode] = useState("create");
    const [title, setTitle] = useState("");
    const [triggerSubject, settriggerSubject] = useState("");
    const [botId, setbotId] = useState("");
    const [submit, setSubmit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage,setrecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(true)
    const[botName,setBotName]=useState("");
    const [flowListData, setflowListData] = useState<any[]>([])
    // Pagination Method

    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    const handlePageChange = (pageNumber: any) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
        setflowListData([]);
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
        setTitle("");
        settriggerSubject("");
        setSubmit(false)
    }
    const handlecreatebotFlow = () => {
        setSubmit(true);
        if (!title||!triggerSubject) {
            return;
        }
        const apiData = {
            ...(modalMode === "edit" && { id: botId }),
            name: title,
            description: triggerSubject
        };
        const apiCall = modalMode === "create" ? VendorAPI.botFlowCreate(apiData) : VendorAPI.botFlowUpdate(apiData);
        apiCall
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    resetForm();
                    handlebotFlowList(currentPage);
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
                console.error("Error during the bot flow operation:", error);
                toast.error("An error occurred during the bot flow operation.");
            });
    };
    const handleduplicatebotFlow = () => {
        setSubmit(true);
        
        setLoading(true)
        const apiData = {id: botId};
        const apiCall = VendorAPI.botFlowDuplicate(apiData);
        apiCall
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    resetForm();
                    handlebotFlowList(currentPage);
                    setLoading(false)
                    setSubmit(false);
                    toast.success(responseData.apiStatus.message);
                    const closeButton = document.getElementById("cloaseduplicateModal");
                    if (closeButton) {
                        closeButton.click();
                    }
                } else {
                    toast.error(responseData.apiStatus.message);
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during duplicate bot flow:", error);
                toast.error("An error occurred during the duplicate bot flow process.");
            });
    };
    const handlebotFlowList = (page: any) => {
        setLoading(true)
        const apiData = {
            pageIndex: page - 1,
            dataLength: recordsPerPage
        };
        VendorAPI.botFlowList(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setLoading(false)
                    setflowListData(responseData.result.BotFlowData)
                    setTotalRecords(responseData.result.totalRecordCount)
                } else {
                    if (responseData.apiStatus.code == "404") {
                    setflowListData([])
                    }
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during fetching bot flow list:", error);
                toast.error("An error occurred while fetching the bot flow list.");
            });
    }
    const handlebotFlowGet= (botId: any) => {
            VendorAPI.botFlowGet(botId)
                .then((responseData: any) => {
                    if (responseData.apiStatus.code === '200') {
                        setTitle(responseData.result.name);
                        settriggerSubject(responseData.result.description);
                    } else {
                        toast.error(responseData.apiStatus.message);
                        setLoading(false)
                    }
                })
                .catch((error: any) => {
                    setLoading(false)
                    console.error("Error during fetching bot flow:", error);
                    toast.error("An error occurred while fetching the bot flow.");
                });
        };
        const handleActiveBotflow = (name: any) => {
              const apiCall = name === 'active' ? VendorAPI.botFlowActive(botId) : VendorAPI.botFlowDeactive(botId);
                 apiCall
                 .then((responseData: any) => {
                    if (responseData.apiStatus.code === '200') {
                       toast.success(responseData.apiStatus.message);
                       handlebotFlowList(currentPage);
                       const closeButton = document.getElementById("closeBotModal");
                       if (closeButton) {
                          closeButton.click();
                       }
                    } else {
                       toast.error(responseData.apiStatus.message);
                    }
                 })
                 .catch((error: any) => {
                    setLoading(false)
                    console.error("Error during bot flow update:", error);
                    toast.error("An error occurred during bot flow update.");
                 });
           };
           const handledeletebotFlow = () => {
                 VendorAPI.botFlowDelete(botId)
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
                             handlebotFlowList(currentPage);
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
              //For the modal is outside_close
              
                 useEffect(() => {
                    const modalElements = [
                      document.getElementById('exampleModal')];
                    const handleHidden = () => {resetForm();};
                    modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
                    return () => {
                      modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
                    };
                  }, []);
              
    useEffect(()=>{
        handlebotFlowList(currentPage);
    },[currentPage])
    return (
        <>
            <DashboardLayout>
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                    <TopNav />
                    <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
                        <div className="col-md-6">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                    <li className="breadcrumb-item text-sm">
                                    <Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-sm text-dark active"
                                        aria-current="page"
                                    >
                                        Flows
                                    </li>
                                </ol>
                                <h6 className="text-start font-weight-bolder mb-0">Flows</h6>
                            </nav>
                        </div>
                        <div className="col-md-6 text-end dropdown">
                            <button
                                className="vendor-crt-btn"
                                data-bs-toggle="modal"
                                data-bs-target="#exampleModal"
                                onClick={() => openModal("create")}
                            >
                                <span>Create Flow</span>
                            </button>
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
                                            ) : flowListData.length === 0 ? (
                                                <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                            ) : (
                                                <>
                                            <table className="table align-items-center justify-content-center mb-0">
                                                <thead>
                                                    <tr className="vendor-table-mainhead">
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7">
                                                            Title
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Start Trigger Subject
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Status
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                                            Action
                                                        </th>
                                                        {/*<th></th>*/}
                                                    </tr>
                                                </thead>
                                                <tbody className="text-start">
                                                {flowListData?.map((listData: any) => (
                                                            <tr
                                                                key={listData.id}
                                                            >
                                                        <td>
                                                            <div className="d-flex px-2">
                                                                <div className="align-middle text-start text-sm my-auto">
                                                                    <span>{listData?.name}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            <span>{listData?.description}</span>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch ms-1 is-filled">
                                                                <input
                                                                    autoComplete="off"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="flexSwitchCheckDefault"
                                                                    onChange={() => {
                                                                        if (listData.active_status === "1") {
                                                                           setbotId(listData.id);
                                                                           setActive(false);
                                                                           setBotName(listData?.name)
                                                                        } else if (listData.active_status === "0") {
                                                                           setbotId(listData.id);
                                                                           setActive(true);
                                                                           setBotName(listData?.name)
                                                                        }
                                                                     }}
                                                                     data-bs-toggle="modal" data-bs-target="#botActive"
                                                                     checked={listData.active_status === "1"}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="text-center align-middle vendor-login-td">
                                                        <div className="actionDuplicate-tooltip-container">
                                                            <button
                                                                className="btn-3 vendorbtn-view"
                                                                type="button"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#vendordelete1"
                                                                onClick={() => { setbotId(listData?.id);setBotName(listData?.name) }}
                                                            >
                                                                <span className="btn-inner--icon text-secondary">
                                                                    <i className="fa-solid fa-clone"></i>
                                                                </span>
                                                            </button>
                                                            &nbsp;
                                                            <div className="actionDuplicate-tooltip-text">
                                                                Duplicate
                                                                </div>
                                                            </div>
                                                            <div className="actionEdit-tooltip-container">
                                                            <button
                                                                className="btn-3 vendorbtn-edit"
                                                                type="button"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#exampleModal"
                                                                onClick={() => {openModal("edit");handlebotFlowGet(listData?.id); setbotId(listData?.id)}}
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
                                                            <div className="actionDelete-tooltip-container">
                                                            <button
                                                                className="btn-3 vendorbtn-danger"
                                                                type="button"
                                                                data-bs-toggle="modal"
                                                                onClick={() => { setbotId(listData?.id);setBotName(listData?.name) }}
                                                                data-bs-target="#vendordelete"
                                                            >
                                                                <span className="btn-inner--icon">
                                                                    <i className="fa-regular fa-trash-can"></i>
                                                                </span>
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
                                            {flowListData.length === 0 ? "" :
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />

                </main>
 {/* <!-- Modal --> */}
 <div
    className="modal fade"
    id="exampleModal"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    >
    <div className="modal-dialog">
        <div className="modal-content all-modal-content">
            <div className="modal-header border-0">
                <h5
                    className="modal-title vendorcreate-modal-title"
                    id="vendorcreateLabel"
                >
                    {modalMode === "create" ? "Add New Bot Flow" : "Edit Bot Flow"}
                </h5>
                <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
                <div className="row">
                    <div className="col-md-12 login-input-group">
                        <div className="vendor-create-container">
                            <input
                                autoComplete="off"
                                type="text"
                                id="vendor-crt-input"
                                style={submit && title.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                onChange={(e) => setTitle(e.target.value)} value={title}
                                className="vendor-crt-input"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="vendor-crt-input"
                                className="vendor-crt-label"
                            >
                                <i className="fa-brands fa-battle-net"></i> Title
                            </label>
                        </div>
                        {submit && title.length == 0 ? (
                <div className="text-danger error-message-required">Title is required </div>
            ) : (
                <></>
            )}
                    </div>
                    <div className="col-md-12 login-input-group">
                        <div className="vendor-create-container">
                            <input
                                autoComplete="off"
                                type="text"
                                id="vendor-crt-input"
                                style={submit && triggerSubject.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                onChange={(e) => settriggerSubject(e.target.value)} value={triggerSubject}
                                className="vendor-crt-input"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="vendor-crt-input"
                                className="vendor-crt-label"
                            >
                                <i className="fa-solid fa-shapes"></i> Start Trigger
                                Subject
                            </label>
                        </div>
                        {submit && triggerSubject.length == 0 ? (
                <div className="text-danger error-message-required">Trigger
                                Subject is required </div>
            ) : (
                <></>
            )}
                    </div>
                </div>
            </div>
            <div className="modal-footer border-0 vendorcreate-modal-footer">
                <button
                    id="closeModal"
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Close
                </button>
                <button onClick={handlecreatebotFlow} type="button" className="btn btn-primary">
                    Submit
                </button>
            </div>
        </div>
    </div>
    </div>
       {/*Bot Flow Active Modal*/}
       <div className="modal fade" id="botActive" tab-Index="-1" aria-labelledby="vendorActiveLabel" aria-hidden="true">
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
                                             <h6 className="modal-confirm-subhead">You want to active this {botName} staff ?</h6>:
                                             <h6 className="modal-confirm-subhead">You want to deactive this {botName} staff ?</h6>}
                                             </div>
                                       </div>
                                       <div className="modal-footer text-center vendor-delete-footer">
                                          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeBotModal">No</button>&nbsp;
                                          <button type="button" className="btn btn-primary" onClick={()=>{active? handleActiveBotflow("active"):handleActiveBotflow("deactive")}} >Yes</button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                {/*Vendor Delete Modal*/}
                <div
                    className="modal fade"
                    id="vendordelete"
                    tab-Index="-1"
                    aria-labelledby="vendordeleteLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content all-modal-content vendor-delete-content">
                            <div className=" vendor-delete-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body vendor-delete-body text-center">
                                <div className="row">
                                    <div className="vendor-delete-icon">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <h4 className="modal-confirm-head">Are You Sure !</h4>
                                    <h6 className="modal-confirm-subhead">You want to delete this {botName} Flow ?</h6>
                                    <div></div>
                                </div>
                            </div>
                            <div className="modal-footer text-center vendor-delete-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    id="closedeleteModal"
                                >
                                    No
                                </button>
                                &nbsp;
                                <button type="button" className="btn btn-primary" onClick={handledeletebotFlow}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal fade"
                    id="vendordelete1"
                    tab-Index="-1"
                    aria-labelledby="vendordeleteLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content all-modal-content vendor-delete-content">
                            <div className=" vendor-delete-header">
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body vendor-delete-body text-center">
                                <div className="row">
                                    <div className="vendor-delete-icon">
                                        <i className="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <h4 className="modal-confirm-head">Are You Sure !</h4>
                                    <h6 className="modal-confirm-subhead">You want to duplicate this {botName} Flow?</h6>
                                    <div></div>
                                </div>
                            </div>
                            <div className="modal-footer  text-center vendor-delete-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    id="cloaseduplicateModal"
                                >
                                    No
                                </button>
                                &nbsp;
                                <button type="button" onClick={handleduplicatebotFlow} className="btn btn-primary">
                                    Yes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </>
    );
}

export default ChatbotFlow;