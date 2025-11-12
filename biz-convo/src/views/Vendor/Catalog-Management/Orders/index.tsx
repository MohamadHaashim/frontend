import React, { useEffect, useState ,useRef} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Pagination } from "react-bootstrap";
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';
import "./index.css";
import noImage from "../../../../assets/img/no_Image.png";
import VendorAPI from '../../../../api/services/vendorLogin/vendorApi';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import TopNav from '../../../../shared/TopNav';
import Footer from '../../../../shared/Footer';

import $ from 'jquery';
import moment from 'moment';
import 'daterangepicker'; // This attaches to jQuery
import 'daterangepicker/daterangepicker.css'; // CSS import

type OrderType = {
    id: string;
    name: string;
    qty: string;
    price: string;
    currency: string;
    address: string;
    catalogName: string;
    orderStatus: string;
    paymentStatus: string;
};

function CatalogOrderList() {
const inputRef1 = useRef<HTMLInputElement>(null);
const handleDivClick = () => {
    inputRef1.current?.focus();
  };
  const handleRefreshClick = () => {
  setDateRange({ from_date: "", to_date: "" });

   if (inputRef1.current) {
      const $input = $(inputRef1.current);
      const drp = $input.data('daterangepicker');
    if (drp) {
      // Reset calendar to today or empty dates
      const today = moment();

      // Example: reset to today, or clear dates if you want
      drp.setStartDate(today);
      drp.setEndDate(today);

      // Also update input value accordingly
        inputRef1.current.value = `${today.format('DD/MM/YYYY')} - ${today.format('DD/MM/YYYY')}`;


      // Optional: If you want empty input instead of today:
      // inputRef1.current.value = '';
    }
  }
};

  useEffect(() => {
    if (inputRef1.current) {
      const today = moment();
      const formattedValue = `${today.format('DD/MM/YYYY')} (${today.format('ddd')})`;
      inputRef1.current.value = formattedValue;

      // Initialize daterangepicker
      $(inputRef1.current).daterangepicker(
        {
          startDate: today,
          endDate: today,
          locale: {
            format: 'DD/MM/YYYY',
          },
        },
        function (start:any, end:any) {
          setDateRange({
            from_date: start.format('YYYY-MM-DD'),
            to_date: end.format('YYYY-MM-DD'),
          });
        }
      );
    }

    return () => {
      if (inputRef1.current) {
        $(inputRef1.current).data('daterangepicker')?.remove();
      }
    };
  }, []);
  useEffect(() => {
  const injectDaterangepickerOverride = () => {
    const styleId = 'daterangepicker-style-override';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    const css = `
      .daterangepicker.opensright:before {
        right: 15px !important;
        left: auto !important;
      }
        .daterangepicker.opensright:after {
        right: 15px !important;
        left: auto !important;
      }
    `;

    styleEl.innerHTML = css;
  };

  injectDaterangepickerOverride();
}, []);
const [dateRange, setDateRange] = useState({
  from_date: '',
  to_date: '',
});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [exportLoading, setexportLoading] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [recordsPerPage, setrecordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [popupList, setPopuplist] = useState([]);
    const [selectedCatalogId, setSelectedCatalogId] = useState(null);
    const [selectedCatalogName, setSelectedCatalogName] = useState('');
    const [orderlist, setOrderList] = useState([]);
    const [OrderID, setOrderID] = useState<OrderType | null>(null);
    const [products, setProduct] = useState([]);
    const [showBackView, setShowBackView] = useState(false);
    const [headerName, setheaderName] = useState<any[]>([]);
    const [headerId, setheaderId] = useState<string[]>([]);
    const [headerDropDown] = useState<any[]>([
            {
                "id": "1",
                "header_name": "first_name"
            },
            {
                "id": "2",
                "header_name": "last_name"
            },
            {
                "id": "3",
                "header_name": "product_name"
            },
            {
                "id": "4",
                "header_name": "price"
            },
            {
                "id": "5",
                "header_name": "qty"
            },
            {
                "id": "6",
                "header_name": "order_status"
            },
            {
                "id": "7",
                "header_name": "order_time"
            },
            {
                "id": "8",
                "header_name": "payment_status"
            },
            {
                "id": "9",
                "header_name": "product_price"
            },
            {
                "id": "10",
                "header_name": "visibility"
            },
            {
                "id": "11",
                "header_name": "address"
            },
            {
                "id": "12",
                "header_name": "phone_no"
            }
    ])
   
    console.log(products, "products")

    console.log(OrderID, "ddd")
    const location = useLocation();
    // const [shopopup, setShowpopup] = useState(false);
    // useEffect(() => {
    //         const fromCreatePage = location.state?.fromCreatePage;
    //         const hasSeenPopup = localStorage.getItem("catalogId1");
    //         if (!fromCreatePage && !hasSeenPopup) {
    //             setShowpopup(true);
    //             localStorage.setItem("catalogId1", "true");
    //         }
    //     }, [location.state]);
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
//   useEffect(() => {
//         // Prevent opening if coming from /vendor/catalog/product/create
//         if (shopopup) {
//             const modalEl = document.getElementById("defaultopenpopup");
//             if (modalEl && window.bootstrap) {
//                 const modal = new window.bootstrap.Modal(modalEl);
//                 modal.show();
//             }
//         }
//     }, [shopopup]);

   const handleCatalogConfirm = () => {
    setSubmit(true)
        if (!selectedCatalogName) {
            // toast.warning("Please select a catalog first");
            return;
        }
       handleOrderListAPI(1, selectedCatalogId,debouncedSearch);
       setSubmit(false);
        setCurrentPage(1);
        const modalEl = document.getElementById("defaultopenpopup");
        if (modalEl && window.bootstrap) {
            const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
            modalInstance.hide();
        }
        // setShowpopup(false);
    };
    const OpenNoPopup = () => {
        // setShowpopup(true);
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
                console.error("Error while fetching catalog details:", error);
                toast.error("An error occurred while fetching catalog details.");
            });
    }
    
    useEffect(() => {
        // handlecatalogListAPI();
        handleOrderListAPI(currentPage, carouselid,debouncedSearch|| null); // Use carouselId if available, otherwise null
    }, [currentPage,debouncedSearch]);
    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearch(search);
          setCurrentPage(1);
        }, 1000);
    
        return () => {
          clearTimeout(handler);
        };
      }, [search]);

       const handleOrderListAPI = (page: any, catalogId: any,search:any) => {
          setLoading(true)
          const apiData = {
            search:search,
            pageIndex: page -1,
            dataLength: recordsPerPage,
            from_date: dateRange.from_date,
            to_date: dateRange.to_date,
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
                  console.error("Error while fetching order details:", error);
                  toast.error("An error occurred while fetching order details.");
              });
      };
    const handleOrderStatusUpdateAPI = (orderId: any, orderStatus: any) => {
        const apiData = {
        order_id: orderId,
        order_status: orderStatus
        };
        VendorAPI.OrderStatusUpdateAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
            handleOrderListAPI(1, carouselid,debouncedSearch || null);setOpenDropdownId(null)
                } else {

                }
            })
            .catch((error: any) => {
                console.error("Error during order status update:", error);
                toast.error("An error occurred during order status update.");
            });
    };
    const statusOptions = [
    { value: 'Ordered', label: 'Ordered', icon: 'fa-folder-open' },
    { value: 'Packed', label: 'Packed', icon: 'fa-cube' },
    { value: 'Dispatched', label: 'Dispatched', icon: 'fa-suitcase' },
    { value: 'Shipped', label: 'Shipped', icon: 'fa-cart-flatbed' },
    { value: 'Delivered', label: 'Delivered', icon: 'fa-truck-ramp-box' },
    { value: 'Returned', label: 'Returned', icon: 'fa-reply-all' },
    ];
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const toggleDropdown = (id:any) => {
        setOpenDropdownId(prevId => (prevId === id ? null : id));
    };

    const handleExport = async (name:String) => {
          setSubmit(true);
          if (headerName.length === 0) {
            return;
         }
          setexportLoading(true);
          try {
             var response;
             if(name==="headers"){
             response = await VendorAPI.OrderExportAPI({from_date: dateRange.from_date,to_date: dateRange.to_date,headers:headerName.map(item => item.headers)})
             }
             else{
                response = await VendorAPI.OrderExportAPI({})
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
             const fileName = `order_data_${formattedDate}.xlsx`;
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
             setSubmit(false);
          } catch (error) {
             setexportLoading(false);
             setSubmit(false);
             console.error("Error downloading file:", error);
             toast.error("Failed to download the file. Please try again.");
          }
       };

    const handleSelectGroup = (dropdownValue: any) => {
    const alreadySelected = headerName.some(item => item.id === dropdownValue.id);
    console.log(alreadySelected,"alreadySelected")
    if (alreadySelected) {
        setheaderName(prev => prev.filter(group => group.id !== dropdownValue.id));
        console.log(headerName,"setheaderName")
        setheaderId(prev => prev.filter(id => id !== dropdownValue.id));
        console.log(headerId,"setheaderId")
    } else {
        setheaderName(prev => [...prev, { id: dropdownValue.id, headers: dropdownValue.header_name }]);
        console.log(headerName,"setheaderName1")
        setheaderId(prev => [...prev, dropdownValue.id]);
        console.log(headerId,"setheaderId1")
    }
    };
    console.log(headerName,"HName")
    const handleSelectHeaderName = (groupDetails: any) => {
        setheaderName(prev => prev.filter(item => item.id !== groupDetails.id));
        setheaderId(prev => prev.filter(id => id !== groupDetails.id));
    };
    // useEffect(() => {
        // if (selectedCatalogId) {
            // handleOrderListAPI(currentPage, selectedCatalogId,debouncedSearch)
        // }
    // }, [currentPage,debouncedSearch,dateRange]);
    const [isActive, setIsActive] = useState(false);
    const [query, setQuery] = useState('');
     const inputRef = useRef(null);

      const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    if (query.trim() === '') {
      setIsActive(false);
    }
  };

  const handleChange = (e:any) => {
    setQuery(e.target.value);
  };

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
                                        className="breadcrumb-item text-sm text-dark active"
                                        aria-current="page"
                                    >
                                        Order
                                    </li>
                                </ol>
                                <h6 className="text-start font-weight-bolder mb-0 grayFont">Order Management</h6>
                            </nav>
                        </div>
                        <div className="col-md-6 text-end position-relative d-flex justify-content-end align-items-center">
                            
                            <div className={`search-box2 ${search ? 'active' : ''}`}>
                                <input className = "search-text2" type="text" placeholder = "Search Order..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                    <a href="#" className = "search-btn2">
                                        <i className="fas fa-search"></i>
                                    </a>
                            </div>
                            {/* <div className="" >
                            <span className='sort-calendericon cursor-pointer' onClick={handleDivClick}>📅</span>
                            <span className="sort-refreshicon cursor-pointer" onClick={()=>{handleRefreshClick();}}><i className="fa-solid fa-arrows-rotate"></i></span>
                            <input
                                id="date-range-input"
                                type="text"
                                name="dates"
                                className="sort-input"
                                ref={inputRef1}
                                style={{border: '1px solid #ccc',
                                padding: '8px 12px',
                                borderRadius: '10px',
                                display: 'inline-block',
                                cursor: 'pointer',
                                minWidth: '230px',}}
                                defaultValue="00/00/0000 - 00/00/0000"
                            />
                            </div>
                            <button className="ms-3 vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorExport">Export</button> */}
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
                                                            Whatsapp.no
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7">
                                                            Catalog Name
                                                        </th>
                                                        {/* <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Currency
                                                        </th> */}
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Quantity
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Price
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                            Order Date
                                                        </th>
                                                        <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
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
                                                                        <span>{listData?.wa_sender}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex ps-3">
                                                                <div className="align-middle text-start text-sm my-auto">
                                                                        <span>{listData?.catalog_name}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        {/* <td>
                                                            <div className="d-flex ps-3">
                                                                <div className="align-middle text-start text-sm my-auto">
                                                                        <span>{listData?.currency}</span>
                                                                </div>
                                                            </div>
                                                        </td> */}
                                                        <td>
                                                            <div className="d-flex ps-3">
                                                                <div className="align-middle text-start text-sm my-auto">
                                                                        <span>{listData?.qty}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            <span>{listData?.currency=="INR" ? "₹":""} {listData?.price}</span>
                                                        </td>
                                                        <td className="align-middle text-start text-sm">
                                                            {new Date(listData?.order_time).toLocaleString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: '2-digit',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit',
                                                                hour12: true
                                                            }).replace(',', '').replace(' ', ' ')}
                                                        </td>
                                                        <td>
                                                            <span
                                                         className="text-sm font-weight-bold"
                                                         style={{
                                                            color: listData?.order_status==="Ordered"
                                                               ? '#3498db'
                                                               : listData?.order_status === 'Packed'
                                                                  ? '#9b59b6'
                                                                  : listData?.order_status === 'Dispatched'
                                                                     ? '#f39c12'
                                                                     :listData?.order_status === 'Shipped'
                                                                     ? '#e67e22':
                                                                     listData?.order_status === 'Delivered'
                                                                     ? '#2ecc71':
                                                                     listData?.order_status === 'Returned'
                                                                     ? '#e74c3c': 
                                                                     'gray'
                                                         }}
                                                      >
                                                         {listData?.order_status==="Ordered"
                                                            ? <div className="d-flex justify-content-evenly align-items-center">
                                                            <span><i className="fa-solid fa-folder-open"></i> Ordered </span>
                                                            <div className="actionChangeStatus-tooltip-container">
                                                                <span className="ms-2 position-relative dropdown-wrapper">
                                                                    <i
                                                                    className="cursor-pointer text-secondary fa-solid fa-repeat vendorbtn-view"
                                                                    onClick={() => toggleDropdown(listData.id)}
                                                                    ></i>
                                                                    <ul
                                                                    className={`dropdown-menu statusChange-drop ${openDropdownId === listData.id ? 'show' : ''}`}
                                                                    style={{
                                                                        display: openDropdownId === listData.id ? 'block' : 'none',
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: "-60px",
                                                                        marginTop:"10px",
                                                                        zIndex: 1000,
                                                                        borderRadius: "5px",
                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                                                    }}
                                                                    >
                                                                    {statusOptions.map((option) => (
                                                                        <li key={option.value}>
                                                                        <a
                                                                            className="dropdown-item cursor-pointer"
                                                                            onClick={() => handleOrderStatusUpdateAPI(listData.id, option.value)}
                                                                        >
                                                                            <i className={`fa-solid ${option.icon} me-2`}></i> {option.label}
                                                                        </a>
                                                                        </li>
                                                                    ))}</ul>
                                                                </span> 
                                                                        <div className="actionChangeStatus-tooltip-text">
                                                                            Status <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                                        </div>
                                                                    </div>
                                                                
                                                                </div>
                                                            : listData?.order_status === 'Packed'
                                                               ? <div className="d-flex justify-content-evenly align-items-center">
                                                                <span><i className="fa-solid fa-box"></i> Packed </span>
                                                               <div className="actionChangeStatus-tooltip-container">
                                                               <span className="ms-2 position-relative dropdown-wrapper">
                                                                    <i
                                                                    className="cursor-pointer text-secondary fa-solid fa-repeat"
                                                                    onClick={() => toggleDropdown(listData.id)}
                                                                    ></i>
                                                                    <ul
                                                                    className={`dropdown-menu statusChange-drop ${openDropdownId === listData.id ? 'show' : ''}`}
                                                                    style={{
                                                                        display: openDropdownId === listData.id ? 'block' : 'none',
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: "-60px",
                                                                        marginTop:"10px",
                                                                        zIndex: 1000,
                                                                        borderRadius: "5px",
                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                                                    }}
                                                                    >
                                                                    {statusOptions.map((option) => (
                                                                        <li key={option.value}>
                                                                        <a
                                                                            className="dropdown-item cursor-pointer"
                                                                            onClick={() => handleOrderStatusUpdateAPI(listData.id, option.value)}
                                                                        >
                                                                            <i className={`fa-solid ${option.icon} me-2`}></i> {option.label}
                                                                        </a>
                                                                        </li>
                                                                    ))}</ul>
                                                                </span>
                                                                <div className="actionChangeStatus-tooltip-text">
                                                                            Status <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                                        </div>
                                                                    </div>
                                                               </div>
                                                               : listData?.order_status === 'Dispatched'
                                                                  ? <div className="d-flex justify-content-evenly align-items-center">
                                                                  <span><i className="fa-solid fa-suitcase"></i> Dispatched </span>
                                                                  <div className="actionChangeStatus-tooltip-container">
                                                                  <span className="ms-2 position-relative dropdown-wrapper">
                                                                    <i
                                                                    className="cursor-pointer text-secondary fa-solid fa-repeat"
                                                                    onClick={() => toggleDropdown(listData.id)}
                                                                    ></i>
                                                                    <ul
                                                                    className={`dropdown-menu statusChange-drop ${openDropdownId === listData.id ? 'show' : ''}`}
                                                                    style={{
                                                                        display: openDropdownId === listData.id ? 'block' : 'none',
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: "-60px",
                                                                        marginTop:"10px",
                                                                        zIndex: 1000,
                                                                        borderRadius: "5px",
                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                                                    }}
                                                                    >
                                                                    {statusOptions.map((option) => (
                                                                        <li key={option.value}>
                                                                        <a
                                                                            className="dropdown-item cursor-pointer"
                                                                            onClick={() => handleOrderStatusUpdateAPI(listData.id, option.value)}
                                                                        >
                                                                            <i className={`fa-solid ${option.icon} me-2`}></i> {option.label}
                                                                        </a>
                                                                        </li>
                                                                    ))}</ul>
                                                                </span>
                                                                <div className="actionChangeStatus-tooltip-text">
                                                                            Status <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                                        </div>
                                                                    </div>
                                                                  </div>
                                                                  :listData?.order_status === 'Shipped'
                                                                  ? <div className="d-flex justify-content-evenly align-items-center">
                                                                  <span><i className="fa-solid fa-truck"></i> Shipped </span>
                                                                  <div className="actionChangeStatus-tooltip-container">
                                                                  <span className="ms-2 position-relative dropdown-wrapper">
                                                                    <i
                                                                    className="cursor-pointer text-secondary fa-solid fa-repeat"
                                                                    onClick={() => toggleDropdown(listData.id)}
                                                                    ></i>
                                                                    <ul
                                                                    className={`dropdown-menu statusChange-drop ${openDropdownId === listData.id ? 'show' : ''}`}
                                                                    style={{
                                                                        display: openDropdownId === listData.id ? 'block' : 'none',
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: "-60px",
                                                                        marginTop:"10px",
                                                                        zIndex: 1000,
                                                                        borderRadius: "5px",
                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                                                    }}
                                                                    >
                                                                    {statusOptions.map((option) => (
                                                                        <li key={option.value}>
                                                                        <a
                                                                            className="dropdown-item cursor-pointer"
                                                                            onClick={() => handleOrderStatusUpdateAPI(listData.id, option.value)}
                                                                        >
                                                                            <i className={`fa-solid ${option.icon} me-2`}></i> {option.label}
                                                                        </a>
                                                                        </li>
                                                                    ))}</ul>
                                                                </span>
                                                                <div className="actionChangeStatus-tooltip-text">
                                                                            Status <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                                        </div>
                                                                    </div>
                                                                  </div>
                                                                  :listData?.order_status === 'Delivered'
                                                                  ? <div className="d-flex justify-content-evenly align-items-center">
                                                                  <span><i className="fa-solid fa-circle-check"></i> Delivered </span>
                                                                  <div className="actionChangeStatus-tooltip-container">
                                                                  <span className="ms-2 position-relative dropdown-wrapper">
                                                                    <i
                                                                    className="cursor-pointer text-secondary fa-solid fa-repeat"
                                                                    onClick={() => toggleDropdown(listData.id)}
                                                                    ></i>
                                                                    <ul
                                                                    className={`dropdown-menu statusChange-drop ${openDropdownId === listData.id ? 'show' : ''}`}
                                                                    style={{
                                                                        display: openDropdownId === listData.id ? 'block' : 'none',
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: "-60px",
                                                                        marginTop:"10px",
                                                                        zIndex: 1000,
                                                                        borderRadius: "5px",
                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                                                    }}
                                                                    >
                                                                    {statusOptions.map((option) => (
                                                                        <li key={option.value}>
                                                                        <a
                                                                            className="dropdown-item cursor-pointer"
                                                                            onClick={() => handleOrderStatusUpdateAPI(listData.id, option.value)}
                                                                        >
                                                                            <i className={`fa-solid ${option.icon} me-2`}></i> {option.label}
                                                                        </a>
                                                                        </li>
                                                                    ))}</ul>
                                                                </span>
                                                                <div className="actionChangeStatus-tooltip-text">
                                                                            Status <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                                        </div>
                                                                    </div>
                                                                  </div>
                                                                  :listData?.order_status === 'Returned'
                                                                  ? <div className="d-flex justify-content-evenly align-items-center">
                                                                  <span><i className="fa-solid fa-rotate-left"></i> Returned </span>
                                                                  <div className="actionChangeStatus-tooltip-container">
                                                                  <span className="ms-2 position-relative dropdown-wrapper">
                                                                    <i
                                                                    className="cursor-pointer text-secondary fa-solid fa-repeat"
                                                                    onClick={() => toggleDropdown(listData.id)}
                                                                    ></i>
                                                                    <ul
                                                                    className={`dropdown-menu statusChange-drop ${openDropdownId === listData.id ? 'show' : ''}`}
                                                                    style={{
                                                                        display: openDropdownId === listData.id ? 'block' : 'none',
                                                                        position: 'absolute',
                                                                        top: '100%',
                                                                        left: "-60px",
                                                                        marginTop:"10px",
                                                                        zIndex: 1000,
                                                                        borderRadius: "5px",
                                                                        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                                                                    }}
                                                                    >
                                                                    {statusOptions.map((option) => (
                                                                        <li key={option.value}>
                                                                        <a
                                                                            className="dropdown-item cursor-pointer"
                                                                            onClick={() => handleOrderStatusUpdateAPI(listData.id, option.value)}
                                                                        >
                                                                            <i className={`fa-solid ${option.icon} me-2`}></i> {option.label}
                                                                        </a>
                                                                        </li>
                                                                    ))}</ul>
                                                                </span>
                                                                <div className="actionChangeStatus-tooltip-text">
                                                                            Status <i className="fa-solid fa-arrow-right-arrow-left"></i>
                                                                        </div>
                                                                    </div>
                                                                  </div>: 
                                                                  <div className="d-flex justify-content-evenly align-items-center">
                                                                  <span><i className="fa-solid fa-circle-exclamation" style={{color:"#e74c3c"}}></i> Nill </span>
                                                                  </div>
                                                                  }
                                                      </span>
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
                                                                            address: listData?.address,
                                                                            catalogName: listData?.catalog_name,
                                                                            paymentStatus: listData?.payment_status,
                                                                            orderStatus: listData?.order_status,
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
                    {/* {shopopup && (
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
                    )} */}
                    <Footer />

                </main>
                {/* Order Export */}
                <div className="modal fade" id="vendorExport" aria-labelledby="vendorExportLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content all-modal-content">

                        <div className="modal-header vendor-view-header mb-3 d-flex justify-content-between border-0">
                            <h1 className="modal-title fs-6 text-center" id="vendorExportLabel">Export Order</h1>
                           {showBackView &&  <button type="button" className="btn btn-primary" aria-label="Back" onClick={() => {setShowBackView(false);setSubmit(false)}}>
                             Back
                            </button>}
                        </div>

                        {exportLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                            <div className="downloadLoad-container">
                                <span className="download-loader">
                                <div className="downloadLoad-txt">Loading...</div>
                                </span>
                            </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-0 modal-body text-center">
                                    <div className={`flip-container ${showBackView ? 'flipped' : ''}`}>
      <div className="flipper">
        <div className="front">
                                <div className="exportwithData">
                                    <p className="exportwithData-para1">
                                    Export all order data into an Excel file to keep your records organized.
                                    </p>
                                    <div className='d-flex justify-content-between mt-6'>
                                    <button className="exportwithData-btn" onClick={() => handleExport("")}>
                                    Export Excel File With Data
                                    </button>&nbsp;
                                    <button className="ms-2 exportwithData-btn" onClick={() => setShowBackView(true)}>
                                    Export With Filter Excel File
                                    </button>
                                    </div>
                                </div>
                                </div>
                            <div className="back">
                                <div className="exportwithData">
                                    <p className="exportwithData-para1">
                                    Export selected header order data into an Excel file to keep your records organized.
                                    </p>
                                    <div className="login-input-group">
                                        <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <input
                                            type="text"
                                            id="vendor-crt-input"
                                            readOnly
                                            style={
                                                submit && headerName.length === 0
                                                ? { borderColor: "red" }
                                                : {}
                                            }
                                            value={headerName.map(group => group.headers).join(', ')}
                                            className="vendor-crt-input px-3"
                                            placeholder=" "
                                            required
                                            />
                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                            <i className="fa-solid fa-heading"></i>eaders
                                            </label>
                                            <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>

                                            <ul className="contatStore-dropdown-menu template-dropdown dropdown-menu">
                                            {headerDropDown?.map((dropdownValue:any, id:any) => (
                                                <li key={id}>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) => {
                                                    e.preventDefault();
                                                    handleSelectGroup(dropdownValue);
                                                    }}
                                                >
                                                    {dropdownValue?.header_name}
                                                </a>
                                                </li>
                                            ))}
                                            </ul>
                                        </div>

                                        {/* Selected group chips */}
                                        {headerName.map((item, index) => (
                                            <div
                                            className="border mt-1 px-1"
                                            key={index}
                                            style={{
                                                display: 'inline-flex',
                                                marginBottom: '5px',
                                                marginRight: '10px',
                                                borderRadius: '5px',
                                                alignItems: 'center'
                                            }}
                                            >
                                            <span style={{ marginRight: '4px', fontSize: '10px' }}>
                                                {item.headers}
                                            </span>
                                            <button
                                                style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '10px',
                                                color: '#a1a1a1',
                                                padding: '0'
                                                }}
                                                onClick={() => handleSelectHeaderName(item)}
                                            >
                                                <i className="fa-solid fa-xmark group-xmark"></i>
                                            </button>
                                            </div>
                                        ))}

                                        {/* Validation message */}
                                        {submit && headerName.length === 0 && (
                                            <div className="text-danger error-message-required">Header is required</div>
                                        )}
                                        </div>
                                </div>
                                </div>
                                </div>
                                </div>
                                </div>
                            
                            </>
                        )}

                        {/* Footer only visible in front view */}
                        {!showBackView ? 
                            <div className="modal-footer text-end vendor-view-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{setheaderName([]);setSubmit(false)}}>Close</button>
                            </div>
                        :
                        <div className="modal-footer text-end vendor-view-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{setheaderName([]);setSubmit(false);setShowBackView(false)}}>
                                Close
                            </button>&nbsp;
                            
                            {/* <button className="btn btn-primary me-2" onClick={() => setShowBackView(false)}>
                                ←
                                Back
                            </button>&nbsp; */}
                            <button className="btn btn-primary me-2" onClick={() => handleExport("headers")}>
                                Export
                            </button>
                            </div>
                        }
                        </div>
                    </div>
                    </div>

                {/* Order View modal */}
                <div className="modal fade" id="exampleModal"   role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className={`modal-dialog modal-dialog-centered ${ products.length === 1 ? "modal-lg" : "modal-xl" }`} role="document" >                        
                            <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between border-0">
                                <h5 className="modal-title" id="exampleModalLabel">Order View</h5>
                                <button type="button" className="close modal-Xbutton" data-bs-dismiss="modal" aria-label="Close">
                                    <span></span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className='row '>
                                    {/* <div className={`col-md-12`}> */}
                                    <div className={`mb-3 rounded`}>
                                        <div className='row product-cardbox mx-1'>
                                            <div className="col-md-6"><p><span className='fw-bold grayFont'><i className="prodView-icon fa-solid fa-user-tie"></i> Customer Name : </span>{OrderID?.name}</p></div>
                                            <div className="col-md-6"><p><span className='fw-bold grayFont'><i className="prodView-icon fa-solid fa-shop"></i> Catalog Name : </span>{OrderID?.catalogName}</p></div>
                                            <div className="col-md-6"><p><span className='fw-bold grayFont'><i className="prodView-icon fa-solid fa-cash-register"></i> Payment Status : </span>{OrderID?.paymentStatus}</p></div>
                                            <div className="col-md-6"><p><span className='fw-bold grayFont'><i className="prodView-icon fa-solid fa-truck-fast"></i> Order Status : </span>{OrderID?.orderStatus}</p></div>
                                            <div className="col-md-6"><p><span className='fw-bold grayFont'><i className="prodView-icon fa-solid fa-boxes-stacked"></i> Quantity : </span>{OrderID?.qty}</p></div>
                                            <div className="col-md-6"><p><span className='fw-bold grayFont'><i className="prodView-icon fa-solid fa-location-crosshairs"></i> Address : </span>{OrderID?.address}</p></div>
                                        </div>
                                    </div> 
                                    {/* </div>  */}
                                 
                                    
                                    {products.map((item: any, index) => (
                                        <div className={`mt-3 ${products.length === 1 ? "col-md-12" : "col-md-6"
                                        }`}>
                                            <div className='product-cardbox'>
                                        <p className='fs-6 grayFont'><i className="prodView-icon fa-solid fa-cube"></i> <u>Product Details {index+1}</u></p>
                                        {/* <div className={`card rounded-0`} key={index} style={{background: "#cfc1b5"}}>
                                            <img src={item?.imgData?.mainImgUrl} alt="" className='width-25 height-20'/>
                                            
                                            <div className='row p-3 rounded-0'>
                                                <div className="col-md-6">
                                                <p className='grayFont'><span className='fw-bold'>Name :</span> {item?.name}</p></div>
                                                <div className="col-md-6">
                                                <p  className='grayFont'><span className='fw-bold'>Brand :</span> {item?.brand}</p></div>
                                                <div className="col-md-6">
                                                <p className='grayFont'><span className='fw-bold'>Currency :</span> { item?.currency}</p></div>
                                                <div className="col-md-6">
                                                <p className='grayFont'><span className='fw-bold'>Availability :</span> {item?.availability}</p></div>
                                                <div className="col-md-6">
                                                <p className='grayFont'><span className='fw-bold'>Visibility :</span> {item?.visibility}</p></div>
                                                <div className="col-md-6">
                                                <p className='grayFont'><span className='fw-bold'>Price:</span> {item?.price} </p></div>
                                            </div>
                                    
                                            
                                        </div> */}
                                          <div className="circle-wrap mt-2 mb-3">
                                                        <img
                                                            src={item?.imgData?.mainImgUrl ? item?.imgData?.mainImgUrl:noImage}
                                                            alt="Product"
                                                            className="circle-img"
                                                        />
                                                        <div className="circle-text">
                                                            <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-signature"></i> Product Name : </span> {item?.name || "-"}</p>
                                                            <p  className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-ring"></i> Brand : </span> {item?.brand || "-"}</p>
                                                        <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-coins"></i> Currency : </span> { item?.currency || "-"}</p>
                                                        <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-cubes"></i> Availability : </span> {item?.availability || "-"}</p>
                                                        <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-money-bill-wave"></i> Price : </span> {item?.price || "-"} </p>
                                                        <div className='d-flex justify-content-between mt-2'>
                                                            <div className='row'>
                                                                <hr style={{background: "#626262",height: "1.35px"}}/>
                                                                <div className="col-md-6">
                                                                <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-eye"></i> Visibility: </span> {item?.visibility || "-"}</p></div>
                                                                <div className="col-md-6">
                                                                <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-code-compare"></i> Condition: </span> {item?.condition || "-"}</p></div>
                                                                <div className="col-md-6">
                                                                <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-file-signature"></i> Description: </span> {item?.description || "-"}</p></div>
                                                                <div className="col-md-6">
                                                                <p className='grayFont m-0 mb-1'><span className='fw-bold'><i className="prodView-icon fa-solid fa-map-location-dot"></i> Address: </span> {item?.address || "-"}</p></div>
                                                        </div>
                                                        </div>
                                                        </div>
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
