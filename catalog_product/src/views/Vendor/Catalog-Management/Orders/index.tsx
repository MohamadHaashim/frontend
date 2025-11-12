import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from "react-bootstrap";
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
import "./index.css"
import VendorAPI from '../../../../api/services/vendorLogin/vendorApi';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import TopNav from '../../../../shared/TopNav';
import Footer from '../../../../shared/Footer';

type OrderType = {
    id: string;
    name: string;
    qty: string;
    price: string;
    currency: string;
};
function CatalogOrderList() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setrecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [popupList, setPopuplist] = useState([]);
    const [selectedCatalogId, setSelectedCatalogId] = useState(null);
    const [selectedCatalogName, setSelectedCatalogName] = useState('');
    const [orderlist, setOrderList] = useState([]);
    const [OrderID, setOrderID] = useState<OrderType | null>(null);
    const [products, setProduct] = useState([]);
    console.log(products, "products")

    console.log(OrderID, "ddd")
    const location = useLocation();
    const [shopopup, setShowpopup] = useState(() => {
        return location.state?.fromCreatePage ? false : true;
    });

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
  useEffect(() => {
        // Prevent opening if coming from /vendor/catalog/product/create
        if (shopopup) {
            const modalEl = document.getElementById("defaultopenpopup");
            if (modalEl && window.bootstrap) {
                const modal = new window.bootstrap.Modal(modalEl);
                modal.show();
            }
        }
    }, [shopopup]);

   const handleCatalogConfirm = () => {
    setSubmit(true)
        if (!selectedCatalogName) {
            // toast.warning("Please select a catalog first");
            return;
        }
       handleOrderListAPI(1, selectedCatalogId);
       setSubmit(false);
        setCurrentPage(1);
        const modalEl = document.getElementById("defaultopenpopup");
        if (modalEl && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        }
        setShowpopup(false);
    };
    const OpenNoPopup = () => {
        setShowpopup(true);
        setSelectedCatalogName("");
    }
    const carouselid = localStorage.getItem("catalogId1");
    // popupList,
    const handlecatalogListAPI = () => {
        setLoading(true)
        const apiData = {};
        VendorAPI.catalogListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setLoading(false)
                    setPopuplist(responseData.responseData.catalogData)
                } else {
                    setPopuplist([])
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during login:", error);
                toast.error("An error occurred during login.");
            });
    }
    useEffect(() => {
        handlecatalogListAPI();
        handleOrderListAPI(1, carouselid || null); // Use carouselId if available, otherwise null
    }, []);

       const handleOrderListAPI = (page: any, catalogId: any) => {
          setLoading(true)
          const apiData = {
           
              catalogId: carouselid || null,
                   pageIndex: page -1,
              dataLength: recordsPerPage
           
          };
           VendorAPI.OrderListAPI(apiData)
              .then((responseData: any) => {
                  if (responseData.apiStatus.code === '200') {
                      setLoading(false)
                      setOrderList(responseData.responseData.OrderData)
                      setTotalRecords(responseData.responseData.totalRecordCount)
                  } else {
                      setOrderList([])
                      setLoading(false)
                  }
              })
              .catch((error: any) => {
                  setLoading(false)
                  console.error("Error during login:", error);
                  toast.error("An error occurred during login.");
              });
      };
            useEffect(() => {
                if (selectedCatalogId) {
                    handleOrderListAPI(currentPage, selectedCatalogId)
                }
            }, [currentPage]);
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
                                        <Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-sm grayFont active"
                                        aria-current="page"
                                    >
                                        Order
                                    </li>
                                </ol>
                                <h6 className="text-start font-weight-bolder mb-0 grayFont">Order Management</h6>
                            </nav>
                        </div>
                        <div className="col-md-6 text-end dropdown">
                            <button type="button" className="vendor-crt-btn" onClick={OpenNoPopup}>
                                Select Catalog
                            </button>&nbsp;
                            {/* <button onClick={() => navigate("/vendor/catalog/Order/create")}
                                className="vendor-crt-btn"
                            >
                                <span>Add Orders</span>
                            </button> */}
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
                                        ) : orderlist.length === 0 ? (
                                            <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                        ) : (
                                            <>
                                            <table className="table align-items-center justify-content-center mb-0">
                                                <thead>
                                                    <tr className="vendor-table-mainhead">
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7">
                                                            Name
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Currency
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Quantity
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Price
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Status
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                                            Actions
                                                        </th>
                                                        {/*<th></th>*/}
                                                    </tr>
                                                </thead>
                                                <tbody className="text-start">
                                                    {orderlist?.map((listData: any) => (
                                                    <tr
                                                    key={listData.id}
                                                    >
                                                        <td>
                                                            <div className="d-flex ps-3">
                                                                <div className="align-middle text-start text-sm my-auto">
                                                                        <span>{listData?.name}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            <span>{listData?.currency}</span>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            <span>{listData?.qty}</span>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            <span>{listData?.price}</span>
                                                        </td>
                                                        <td>
                                                            <div className="form-check form-switch ms-1 is-filled">
                                                                <input
                                                                    autoComplete="off"
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="flexSwitchCheckDefault"
                                                                // onChange={() => {
                                                                //     if (listData.active_status === "1") {
                                                                //        setbotId(listData.id);
                                                                //        setActive(false);
                                                                //        setBotName(listData?.name)
                                                                //     } else if (listData.active_status === "0") {
                                                                //        setbotId(listData.id);
                                                                //        setActive(true);
                                                                //        setBotName(listData?.name)
                                                                //     }
                                                                //  }}
                                                                //  data-bs-toggle="modal" data-bs-target="#botActive"
                                                                //  checked={listData.active_status === "1"}
                                                                />
                                                            </div>
                                                        </td>
                                                            <td className="action-buttons">
                                                              
                                                                    <button
                                                                    type="button" className="custom-View-button" data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                                    onClick={() => {
                                                                        setOrderID({
                                                                            id: listData?.id,
                                                                            name: listData?.name,
                                                                            qty: listData?.qty,
                                                                            price: listData?.price,
                                                                            currency: listData?.currency,
                                                                        });
                                                                        setProduct(listData?.Products);
                                                                    }}

                                                                    >
                                                                        <i className="fa-solid fa-eye" style={{color:"white"}}></i>
                                                                    </button>
                                                                
                                                            {/* <div className="actionEdit-tooltip-container">
                                                                <button
                                                                        className="btn-3 order-view"
                                                                    type="button"
                                                                    data-bs-toggle="modal"
                                                                    data-bs-target="#exampleModal"
                                                                onClick={() => {openModal("edit");handlebotFlowGet(listData?.id); setbotId(listData?.id)}}
                                                                >
                                                                    <span >
                                                                        View
                                                                        <i className="fa-regular fa-pen-to-square"></i>
                                                                    </span>
                                                                </button>
                                                                &nbsp;
                                                                <div  className="actionEdit-tooltip-text">
                                                                    View
                                                                </div>
                                                            </div>  */}
                                                            {/* <div className="actionDelete-tooltip-container">
                                                                <button
                                                                    className="btn-3 vendorbtn-danger"
                                                                    type="button"
                                                                    data-bs-toggle="modal"
                                                                    // onClick={() => { setbotId(listData?.id);setBotName(listData?.name) }}
                                                                    data-bs-target="#vendordelete"
                                                                >
                                                                    <span className="btn-inner--icon">
                                                                        <i className="fa-regular fa-trash-can"></i>
                                                                    </span>
                                                                </button>
                                                                <div className="actionDelete-tooltip-text">
                                                                    Delete
                                                                </div>
                                                            </div>  */}
                                                        </td>
                                                         
                                                    </tr>
                                                     ))}
                                                </tbody>
                                            </table>
                                            {orderlist.length === 0 ? "" :
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
                    {shopopup && (
                        <div
                            className="modal fade"
                            id="defaultopenpopup"
                            tab-Index="-1"
                            aria-labelledby="vendordeleteLabel"
                            aria-hidden="true"
                            data-bs-backdrop="static" data-bs-keyboard="false"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content all-modal-content vendor-delete-content">
                                    <div className=" vendor-delete-header">
                                        {/* <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button> */}
                                    </div>
                                    <div className="modal-body vendor-delete-body text-start">
                                        <h6>Select Catalog</h6>
                                        <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <input
                                                autoComplete="off"
                                                type="text"
                                                id="vendor-crt-input"
                                                className={`vendor-crt-input loginfilled-frame-username ${submit && !selectedCatalogName ? 'error' : ''}`}
                                                placeholder=" "
                                                value={selectedCatalogName}
                                                readOnly
                                                style={{ cursor: "pointer" }}
                                            />

                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                <svg fill='gray' width="13px" height="13px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                                    <path d="M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 
                                                16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 
                                                32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z"
                                                    /></svg> Catalog Name</label>
                                            <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                            <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                {popupList.length === 0 ? (
                                                    <li className="dropdown-nodata-found">No data found</li>
                                                ) : (
                                                    popupList.map((catalog: any, index) => (
                                                        <li key={catalog.id}>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                                onClick={() => {
                                                                    setSelectedCatalogId(catalog.catalog_id);
                                                                    localStorage.setItem("catalogId1", catalog.catalog_id)
                                                                    setSelectedCatalogName(catalog.name);
                                                                }}
                                                            >
                                                                {catalog.name}
                                                            </a>
                                                        </li>
                                                    ))
                                                )}
                                            </ul>
                                        </div>
                                    {submit && selectedCatalogName.length == 0 ? <div className='text-danger error-message-required'>Catalog Name is required</div> : <></>}
                                    </div>
                                    <div className="modal-footer text-center vendor-delete-footer">
                                        {popupList.length===0 ? 
                                        <button type="button" data-bs-dismiss="modal" className="btn btn-secondary" onClick={()=>navigate("/vendor/catalog/details")}>
                                            Create Catalog
                                        </button>:<></>}
                                        {popupList.length !==0 ?
                                        <button type="button" className="btn btn-primary" onClick={handleCatalogConfirm}>
                                            Yes
                                        </button>:<></>}

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Footer />

                </main>
                {/* Order View modal */}
                <div className="modal fade" id="exampleModal"   role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between border-0">
                                <h5 className="modal-title" id="exampleModalLabel">Order View</h5>
                                <button type="button" className="close border-0 bg-white" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" className='fs-4'>x</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className='row '>
                                  
                                    <div className={`col-md-12`}>
                                    <div className={`mb-3 rounded`}>
                                        <div className='d-flex justify-content-between'>
                                            <p className='fs-6'>Name : {OrderID?.name}</p>
                                        </div>
                                    </div> 
                                    </div> 
                                 
                                    
                                    {products.map((item: any, index) => (
                                        <div className={`${products.length === 0 ? "col-md-12" : "col-md-6"
                                        }`}>
                                        <div className={`bg-light p-3 mb-3 rounded card`} key={index}>
                                            <p>Product details {index + 1}</p>
                                            <img src={item?.imgData?.mainImgUrl} alt="" className='width-25 height-25 rounded'/>
                                            <div className='d-flex justify-content-between'>
                                                <p>Name : {item?.name}</p>
                                                <p>Brand : {item?.brand}</p>
                                                <p>Currency : { item?.currency}</p>

                                            </div>
                                            <div className='d-flex justify-content-between'>
                                                <p>availability : {item?.availability}</p>
                                                <p>visibility : {item?.visibility}</p>
                                                <p>Price: {item?.price} </p>
                                            </div>
                                    
                                            
                                        </div>
                                        </div>
                                    ))}
                                   
                                   
                                    
                                    
                                </div>
                                
                                
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                {/* <button type="button" className="btn btn-primary">Save changes</button> */}
                            </div>
                        </div>
                    </div>
                </div>




            </DashboardLayout>
        </>
    )
}

export default CatalogOrderList
