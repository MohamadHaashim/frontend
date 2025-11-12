import React, { useEffect, useState } from "react";
import Footer from "../../../../shared/Footer";
import { Link } from "react-router-dom";
import TopNav from "../../../../shared/TopNav";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import { Pagination } from "react-bootstrap";
import VendorAPI from "../../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";

function CatalogDetails() {
  const [modalMode, setModalMode] = useState("create");
  const [submit, setSubmit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setrecordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [btnloading, setbtnLoading] = useState(false);
  const [active, setActive] = useState(true);
  const [catalogName, setcatalogName] = useState("");
  const [catalogType, setcatalogType] = useState<string>("");
  const [bussinessId, setbussinessId] = useState("");
  const [catalogList, setcatalogList] = useState<any>([]);
  const [catalogTypeDrop] = useState([
{ label: "Adoptable pets", icon: <i className="fa-solid fa-paw"></i> },
{ label: "Automotive models", icon: <i className="fa-solid fa-motorcycle"></i> },
{ label: "Avatar", icon: <i className="fa-solid fa-user-tie"></i> },
{ label: "Commerce", icon: <i className="fa-solid fa-dumpster"></i> },
{ label: "Destinations", icon: <i className="fa-solid fa-map-location-dot"></i> },
{ label: "Flights", icon: <i className="fa-solid fa-plane-departure"></i> },
{ label: "Generic", icon: <i className="fa-solid fa-recycle"></i> },
{ label: "Home listings", icon: <i className="fa-solid fa-house-chimney"></i> },
{ label: "Hotels", icon: <i className="fa-solid fa-hotel"></i> },
{ label: "Jobs", icon: <i className="fa-solid fa-street-view"></i> },
{ label: "Local service businesses", icon: <i className="fa-solid fa-business-time"></i> },
{ label: "Location based items", icon: <i className="fa-solid fa-location-crosshairs"></i> },
{ label: "Media titles", icon: <i className="fa-solid fa-photo-film"></i> },
{ label: "Offer items", icon: <i className="fa-solid fa-tags"></i> },
{ label: "Offline commerce", icon: <i className="fa-solid fa-toggle-off"></i> },
{ label: "Test vertical", icon: <i className="fa-solid fa-vial"></i> },
{ label: "Transactable items", icon: <i className="fa-solid fa-globe"></i> },
{ label: "Vehicle offers", icon: <i className="fa-solid fa-car-rear"></i> },
{ label: "Vehicles", icon: <i className="fa-solid fa-truck-moving"></i> }
  ]);

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
        <Pagination.Item
          key="1"
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };
  const openModal = (mode: any) => {
    setModalMode(mode);
  };
   const handlecatalogListAPI = (page: any) => {
      setLoading(true)
      const apiData = {
          pageIndex: page - 1,
          dataLength: recordsPerPage
      };
      VendorAPI.catalogListAPI(apiData)
          .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                  setLoading(false)
                  setcatalogList(responseData.responseData.catalogData)
                  setTotalRecords(responseData.responseData.totalRecordCount)
              } else {
                  setcatalogList([])
                  setLoading(false)
              }
          })
          .catch((error: any) => {
              setLoading(false)
              console.error("Error during login:", error);
              toast.error("An error occurred during login.");
          });
  }
  const resetForm = () => {
      setcatalogName("");
      setcatalogType("");
      setSubmit(false);
      setbtnLoading(false);
  }
  const handlelogBizinfo = () => {
      VendorAPI.catalogBizInfoAPI()
          .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                setbussinessId(responseData?.responseData[0]?.id);
              } else if(responseData.apiStatus.code==="404"){
                  setbussinessId("");
              }
          })
          .catch((error: any) => {
              setLoading(false)
              console.error("Error during login:", error);
              toast.error("An error occurred during login.");
          });
  };
  const handlecreatCatalog = () => {
    setSubmit(true);
    
    if (!catalogName || !catalogType || !bussinessId) {
      return;
    }
    setbtnLoading(true);
    const apiData = {
      name: catalogName,
      vertical: catalogType.toLowerCase().replace(/\s+/g, "_"),
      business_id: bussinessId,
    };
    VendorAPI.catalogCreateAPI(apiData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === "200") {
          // resetForm();
          handlecatalogListAPI(currentPage)
          setSubmit(false);
          setbtnLoading(false);
          toast.success(responseData.apiStatus.message);
          const closeButton = document.getElementById("closeModal");
          if (closeButton) {
            closeButton.click();
          }
        } else {
          toast.error(responseData.apiStatus.message);
          setbtnLoading(false);
        }
      })
      .catch((error: any) => {
        setbtnLoading(false);
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
      });
  };
  const handleSyncCatalog = () => {
    setLoading(true)
    const apiData = {
      business_id: bussinessId,
    };
    VendorAPI.catalogSyncAPI(apiData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === "200") {
          handlecatalogListAPI(currentPage)
          setLoading(false)
          // toast.success(responseData.apiStatus.message);
        } else {
          toast.error(responseData.apiStatus.message);
          setLoading(false)
        }
      })
      .catch((error: any) => {
        setLoading(false)
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
      });
  };
  useEffect(()=>{
    handlecatalogListAPI(currentPage)
  },[currentPage])
  useEffect(()=>{
    handlelogBizinfo()
  },[])
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
                    <Link
                      className="opacity-5 grayFont"
                      to={"/vendor/dashboard"}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item text-sm grayFont active"
                    aria-current="page"
                  >
                    Catalog
                  </li>
                </ol>
                <h6 className="text-start font-weight-bolder mb-0 grayFont">
                  Catalog Management
                </h6>
              </nav>
            </div>
            <div className="col-md-6 text-end dropdown">
              <button
                className="vendor-crt-btn"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                // onClick={() => openModal("create")}
              >
                <span>Create Catalog</span>
              </button>&nbsp;
              <button
                className="vendor-crt-btn"
                onClick={() => handleSyncCatalog()}
              >
                <span>Sync Catalog</span>
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
                                    ) : catalogList.length === 0 ? (
                                        <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                    ) : (
                                        <>
                      <table className="table align-items-center justify-content-center mb-0">
                        <thead>
                          <tr className="vendor-table-mainhead">
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7">
                              Catalog Name
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                              Catalog Type
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                              Bussiness Id
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-start">
                          {catalogList?.map((listData: any) => (
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
                              <span>{listData?.vertical}</span>
                            </td>
                            <td className="align-middle text-start text-sm">
                              <span>{listData?.business_id}</span>
                            </td>
                          </tr>
                         ))}
                        </tbody>
                      </table>
                      {catalogList.length === 0 ? "" :
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
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content all-modal-content">
              <div className="modal-header border-0">
                <h5
                  className="modal-title vendorcreate-modal-title"
                  id="vendorcreateLabel"
                >
                  {modalMode === "create" ? "Add Catalog" : ""}
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
                        style={
                          submit && catalogName.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        onChange={(e) => setcatalogName(e.target.value)}
                        value={catalogName}
                        className="vendor-crt-input"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="vendor-crt-input"
                        className="vendor-crt-label"
                      >
                        <i className="fa-solid fa-scroll"></i> Catalog Name
                      </label>
                    </div>
                    {submit && catalogName.length == 0 ? (
                      <div className="text-danger error-message-required">
                        Catalog name is required{" "}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="col-md-12 login-input-group">
                    <div
                      className="vendor-create-container dropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <input
                        autoComplete="off"
                        type="text"
                        // onClick={handleGetStoreDrop}
                        id="vendor-crt-input"
                        className={`vendor-crt-input loginfilled-frame-username 
                            ${
                                submit && !catalogType ? "error" : ""
                            }`}
                        value={catalogType}
                        placeholder=" "
                        required
                        onChange={(e) => setcatalogType(e.target.value)}
                      />
                      <label
                        htmlFor="vendor-crt-input"
                        className="vendor-crt-label"
                      >
                        <i className="fa-solid fa-newspaper"></i> Catalog Type
                      </label>
                      <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                      <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                        {catalogTypeDrop.length === 0 ? (
                          <li className="dropdown-nodata-found">
                            No data found
                          </li>
                        ) : (
                          catalogTypeDrop.map((dropdownValue, id) => (
                            <li key={id}>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => {
                                  setcatalogType(dropdownValue.label);
                                }}
                              >
                                {dropdownValue.icon} {dropdownValue.label}
                              </a>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                    {submit && catalogType.length == 0 ? (
                      <div className="text-danger error-message-required">
                        Catalog type is required
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* <div className="col-md-12 login-input-group">
                    <div className="vendor-create-container">
                      <input
                        autoComplete="off"
                        type="text"
                        id="vendor-crt-input"
                        disabled
                        style={
                          submit && bussinessId.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\+?[0-9]*$/.test(value)) {
                            setbussinessId(value);
                          }
                        }}
                        value={bussinessId}
                        className="vendor-crt-input"
                        placeholder=" "
                        required
                      />
                      <label
                        htmlFor="vendor-crt-input"
                        className="vendor-crt-label"
                      >
                        <i className="fa-solid fa-house-laptop"></i> Bussiness
                        Id
                      </label>
                    </div>
                    {submit && bussinessId.length == 0 ? (
                      <div className="text-danger error-message-required">
                        Bussiness Id is required{" "}
                      </div>
                    ) : (
                      <></>
                    )}
                  </div> */}
                </div>
              </div>
              <div className="modal-footer border-0 vendorcreate-modal-footer">
                <button
                  id="closeModal"
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                   onClick={resetForm}
                >
                  Close
                </button>
                <button
                  onClick={handlecreatCatalog}
                  type="button"
                  className="btn btn-primary"
                  disabled={btnloading}
                  style={{color:"white"}}
                >
                  {btnloading ? "Submit..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export default CatalogDetails;
