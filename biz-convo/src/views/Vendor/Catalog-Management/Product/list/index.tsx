import React, { useEffect, useRef, useState } from 'react'
import DashboardLayout from '../../../../../layouts/DashboardLayout';
import TopNav from '../../../../../shared/TopNav';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../../../../shared/Footer';
import { toast } from "react-toastify";
import VendorAPI from '../../../../../api/services/vendorLogin/vendorApi';
import { Pagination } from "react-bootstrap";
import { FadeLoader } from "react-spinners";
import { baseURL } from '../../../../../api/api';
import "./index.css";
import ExpandableTable from './ExpandableTable';
function CatalogProductList() {
    const navigate = useNavigate();
    const location = useLocation();
    const [shopopup, setShowpopup] = useState(false);

    useEffect(() => {
        const fromCreatePage = location.state?.fromCreatePage;
        const hasSeenPopup = localStorage.getItem("catalogId");
        if (!fromCreatePage && !hasSeenPopup) {
            setShowpopup(true);
            localStorage.setItem("catalogId", "true");
        }
    }, [location.state]);
    const [loading, setLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [importLoading, setimportLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [recordsPerPage, setrecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [popupList, setPopuplist] = useState([]);
    const [selectedCatalogId, setSelectedCatalogId] = useState<any>(localStorage.getItem("catalogId") || null);
    const [selectedCatalogName, setSelectedCatalogName] = useState('');
    const [retailerId, setretailerId] = useState('');
    const [catalogId, setcatalogId] = useState(localStorage.getItem("catalogId") ||'');
    const [productName, setproductName] = useState('');
    const [status, setStatus] = useState('');
    const [productId, setProductId] = useState('');
    const [productlist, setProductList] = useState([]);

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

    const OpenNoPopup = () => {
        setShowpopup(true);
        setSelectedCatalogName("");
    }

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
                console.error("Error while fetching catalog details:", error);
                toast.error("An error occurred while fetching catalog details.");
            });
    }
    //Store Dropdown Filter
   const filteredCatalogDrop = popupList.filter((dropdownValue:any) =>
      (dropdownValue?.name || '').toLowerCase().includes((selectedCatalogName || '').toLowerCase())
    );
    useEffect(() => {
        handlecatalogListAPI()
    }, [])
useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearch(search);
          setCurrentPage(1);
        }, 1000);
    
        return () => {
          clearTimeout(handler);
        };
      }, [search]);
    const handleProductList = (page: any, catalogId: any,search:any) => {
        setLoading(true)
        const apiData = {
            pageIndex: page - 1,
            dataLength: recordsPerPage,
            catalog_id: catalogId,
            search:search
        };
        VendorAPI.productListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setLoading(false)
                    setProductList(responseData.responseData.CatalogueData);
                    setTotalRecords(responseData.responseData.totalRecordCount);
                } else {
                    setProductList([])
                    setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error while fetching product details:", error);
                toast.error("An error occurred while fetching product details.");
            });
    }
    const handleSyncProduct = () => {
        setLoading(true)
      VendorAPI.productSyncAPI(
        {   limit:"200",
            catalog_id:selectedCatalogId,
        }
      )
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                setLoading(false)
                handleProductList(currentPage, selectedCatalogId,debouncedSearch)
            } else {
               toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during sync product:", error);
            toast.error("An error occurred during sync product.");
         });
   };
    useEffect(() => {
        if (selectedCatalogId) {
            handleProductList(currentPage, selectedCatalogId,debouncedSearch)
        }
    }, [currentPage,debouncedSearch]);

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
    const handleDeleteProduct = () => {
      VendorAPI.productDeleteAPI(retailerId)
         .then((responseData: any) => {
            if (responseData.apiStatus.code == '200') {
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
                  handleProductList(currentPage,selectedCatalogId,debouncedSearch);
                  closeButton.click();
               }
               toast.success(responseData.apiStatus.message);
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
    const handleStatusChange = () => {
        const apiCall = VendorAPI.productStatusChangeAPI(productId);
            apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                toast.success(responseData.apiStatus.message);
                handleProductList(currentPage,selectedCatalogId,debouncedSearch);
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
            console.error("Error during product status update:", error);
            toast.error("An error occurred during product status update.");
            });
    };
    const handleCatalogConfirm = () => {
        setSubmit(true)
        if (!selectedCatalogName) {
            // toast.warning("Please select a catalog first");
            return;
        }
        handleProductList(1, selectedCatalogId,debouncedSearch);
        setSubmit(false);
        setCurrentPage(1);
        const modalEl = document.getElementById("defaultopenpopup");
        if (modalEl && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        }
        setShowpopup(false);
    };
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
      formData.append("product_file", file);
      formData.append("catalog_id", selectedCatalogId);
      try {
         const response = await VendorAPI.productImportAPI(formData);
         if (response.apiStatus?.code === "200") {
            toast.success(response.apiStatus.message);
            handleSyncProduct();
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

     
    return (
        <>
            <DashboardLayout>
                <main className="main-content position-relative  min-vh-100  border-radius-lg ">
                    <TopNav />
                    <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
                        <div className="col-md-5">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                    <li className="breadcrumb-item text-sm">
                                        <Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link>
                                    </li>
                                    <li
                                        className="breadcrumb-item text-sm text-dark active"
                                        aria-current="page"
                                    >
                                        Product
                                    </li>
                                </ol>
                                <h6 className="text-start font-weight-bolder mb-0 grayFont">Product Management</h6>
                            </nav>
                        </div>
                        <div className="col-md-7 text-end position-relative d-flex justify-content-end align-items-center">
                            <div className={`search-box2 ${search ? 'active' : ''}`}>
                                <input className = "search-text2" type="text" placeholder = "Search Product..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                    <a href="#" className = "search-btn2">
                                        <i className="fas fa-search"></i>
                                    </a>
                            </div>
                            <button type="button" className="vendor-crt-btn" onClick={OpenNoPopup}>
                                Select Catalog
                            </button>&nbsp;
                            <button onClick={() => {!selectedCatalogId ? toast.warning("Please choose catalog"):navigate("/vendor/catalog/product/create")}}
                            className="vendor-crt-btn">
                                <span><i className="fa-solid fa-plus"></i> Add Products</span>
                            </button>
                            &nbsp;
                            <button onClick={() => {!selectedCatalogId ? toast.warning("Please choose catalog"): handleSyncProduct()}}
                                className="vendor-crt-btn"
                            >
                                <span><i className="fa-solid fa-arrows-rotate"></i> Sync Products</span>
                            </button>&nbsp;
                            <button type="button" className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                <i className="fa-solid fa-arrow-up-from-bracket"></i> Import
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
                                                )
                                                 : !selectedCatalogId ? (
                                                    <>
                                                        <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>Please choose catalog to see data</span></p>
                                                    </>
                                                ): productlist.length === 0 ? (
                                                    <>
                                                        <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                                    </>
                                                )
                                                 : (
                                                    <>
                                               <ExpandableTable productlist={productlist}setproductName={setproductName} setretailerId={setretailerId} setcatalogId={setcatalogId}/>
                                               {productlist.length === 0 ? "" :
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
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
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
                                                onChange={(e)=>setSelectedCatalogName(e.target.value)}
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
                                                {filteredCatalogDrop.length === 0 ? (
                                                    <li className="dropdown-nodata-found">No data found</li>
                                                ) : (
                                                    filteredCatalogDrop.map((catalog: any, index) => (
                                                        <li key={catalog.id}>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                                onClick={() => {
                                                                    setSelectedCatalogId(catalog.catalog_id);
                                                                    localStorage.setItem("catalogId",catalog.catalog_id)
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
                                        <button type="button" onClick={() => { setShowpopup(false) }} className="btn btn-secondary" data-bs-dismiss="modal" id="closepopup">
                                            Close
                                        </button>
                                        {popupList.length===0 ? 
                                        <button type="button" data-bs-dismiss="modal" className="btn btn-primary" onClick={()=>navigate("/vendor/catalog/details")}>
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
                                    <h6 className="modal-confirm-subhead">You want to delete this {productName} Flow ?</h6>
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
                                <button type="button" className="btn btn-primary" onClick={handleDeleteProduct}>
                                Yes
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*Bot Flow Active Modal*/}
                <div className="modal fade" id="productActive" tab-Index="-1" aria-labelledby="vendorActiveLabel" aria-hidden="true">
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
                                {status!=="published" ?
                                <h6 className="modal-confirm-subhead">You want to active this {productName} staff ?</h6>:
                                <h6 className="modal-confirm-subhead">You want to deactive this {productName} staff ?</h6>}
                                </div>
                        </div>
                        <div className="modal-footer text-center vendor-delete-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeBotModal">No</button>&nbsp;
                            <button type="button" className="btn btn-primary" onClick={()=>{handleStatusChange()}} >Yes</button>
                        </div>
                    </div>
                    </div>
                </div>
            {/* Product Import Modal */}
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
                            Import Product
                            </h1>
                            <div>
                            <button
                            className="vendor-crt-btn import-sample-filebtn"
                            onClick={() => {
                                const url = `${baseURL}uploads/catalog_product_template/catalog_products.csv`;
                                const link = document.createElement("a");
                                link.href = url;
                                link.setAttribute("download", "catalog_products.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            >
                            <i className="fa-solid fa-file-download"></i> Sample File
                            </button>
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
                            <button type="button" onClick={() => { setFileName('');setSubmit(false) }} className="btn btn-secondary" data-bs-dismiss="modal" id="closepopup">
                            Close
                            </button>
                            <button type="button" className="btn btn-primary import-btn-bg" onClick={handleImport}>
                            Import
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </DashboardLayout>
        
        </>
    )
}

export default CatalogProductList
