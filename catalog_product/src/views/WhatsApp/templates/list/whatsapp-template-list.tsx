import React, { useEffect, useState } from 'react';
import Userimg from "../../../../assets/img/team-2.jpg";
import Userimg1 from "../../../../assets/img/small-logos/logo-spotify.svg";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../layouts/DashboardLayout';
import TopNav from '../../../../shared/TopNav';
import VendorAPI from '../../../../api/services/vendorLogin/vendorApi';
import { toast } from 'react-toastify';
import "./whatsapp-template-list.css"
import { FadeLoader } from 'react-spinners';
import { Pagination } from 'react-bootstrap';
import Footer from '../../../../shared/Footer';

function WhatsappTemplate() {

   const [modalMode, setModalMode] = useState("create");
   const openModal = (mode: any) => {
      setModalMode(mode);
   };
   const handleSubmit = () => {
      if (modalMode === "create") {
      }
   };

   const navigate = useNavigate();
   const handleBacktoSadmin = (e: any) => {
      e.preventDefault();
      navigate("/dashboard", { replace: true });
   };

   const [redirect, setRedirect] = React.useState<string | null>(null);
   const [listWhatsapp, setListWhatsapp] = useState([])
   const [names, setNames] = useState('')
   const [category, setCategory] = useState('')
   const [languageCode, setLaguageCode] = useState('')
   const [headerTextValues, setheaderTextValues] = useState('')
   const [bodyTextValues, setBodyTextValues] = useState('')
   const [footerTextValues, setfooterTextValues] = useState('')
   const [carouselTyp, setCarouselTyp] = useState('')
   const [tempId, setTempId] = useState('')
   const [tempname, setTempName] = useState('')
   const [imgValue, setImgValue] = useState('')
   const [vdoValue, setVdoValue] = useState('')
   const [docValue, setDocValue] = useState('')
   const [loading, setLoading] = useState(false)
   const [loadingbtn, setLoadingbtn] = useState(false)
   const [submit, setSubmit] = useState(false);
   const [slides,setslides] = useState<any>([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);
   const [beforeCursor, setBeforeCursor] = useState("");
   const [afterCursor, setAfterCursor] = useState("");
   const totalPages = Math.ceil(totalRecords / recordsPerPage);
   const [currentIndex, setCurrentIndex] = useState(0);
   
   const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };
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

   useEffect(() => {
      whatsappTemplateList(currentPage);
   }, [currentPage]);

   // Whatsapp List Template API
   const whatsappTemplateList = (page: any) => {
      setLoading(true);
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.whatsappTemplateList(apiData)
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               setListWhatsapp(responceData?.responseData?.TemplateData)
               setBeforeCursor(responceData?.responseData?.paging?.cursors?.before)
               setAfterCursor(responceData?.responseData?.paging?.cursors?.after)
               setTotalRecords(responceData.responseData?.totalRecordCount);
               setLoading(false)
            } else {
               setLoading(false)
               // toast.error(responceData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
            setLoading(false)
         });
   };
   const whatsappSyncAPI = () => {
      setLoading(true);
      const apiData = {limit:"150"};
      VendorAPI.whatsappSyncAPI(apiData)
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               whatsappTemplateList(currentPage);
               setLoading(false)
            } else {
               setLoading(false)
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
            setLoading(false)
         });
   };
   const [buttonQuicktxt, setButtonQuicktxt] = useState('');
   const [buttonPhonetxt, setButtonPhonetxt] = useState('');
   const [buttonPhoneNotxt, setButtonPhoneNotxt] = useState('');
   const [buttonCopycodetxt, setButtonCopycodetxt] = useState('');
   const [buttonurltxt, setButtonurltxt] = useState('');
   const [buttonwebUrltxt, setButtonwebUrltxt] = useState('');
   const [buttondynamicwebUrltxt, setButtondynamicwebUrltxt] = useState('');
   const [buttonexampleUrltxt, setButtonexampleUrltxt] = useState('');
   const [buttondynamicUrltxt, setButtondynamicUrltxt] = useState('');
   const [quickbtn, setquickbtn] = useState('None')
   const [phoenobtn, setphoenobtn] = useState('None')
   const [copybtn, setcopybtn] = useState('None')
   const [urlbtn, seturlbtn] = useState('None')
   const [dynamicurlbtn, setdynamicurlbtn] = useState('None')
   const [hasClicked, setHasClicked] = useState(false);
    const handleClick = (id:any) => {
    if (!hasClicked) {
      whatsappGetApi(id);
      setHasClicked(true);
    }
  };
   //   Get By Id
   const whatsappGetApi = async (id: any) => {
      try {
         const responseData = await VendorAPI.whatsappGet(id);
         if (responseData.apiStatus.code === '200') {
            setHasClicked(false);
            const data = responseData?.responseData;
            const modalElement = document.getElementById('whatsappTempview');
            if (modalElement) {
            const modal = new window.bootstrap.Modal(modalElement);
            modal.show();
            }
            setNames(data?.name);
            data?.components.forEach((component: any) => {
               if (component.type === "HEADER") {
                  setheaderTextValues(component.text);
                  switch (component.format) {
                     case "IMAGE":
                        setImgValue(component?.example.header_handle)
                        break;
                     case "VIDEO":
                        setVdoValue(component?.example.header_handle)
                        break;
                     case "DOCUMENT":
                        setDocValue(component?.example.header_handle)
                        break;
                     default:
                        break;

                  }
               } else if (component.type === "BODY") {
                  setBodyTextValues(component.text);
               } else if (component.type === "FOOTER") {
                  setfooterTextValues(component.text);
               }
               else if (component?.type === "BUTTONS") {
                  component?.buttons.forEach((buttonsValue: any) => {
                     if (buttonsValue) {
                        switch (buttonsValue?.type) {
                           case "QUICK_REPLY":
                              setquickbtn("QUICK_REPLY");
                              setButtonQuicktxt(buttonsValue?.text);
                              break;
                           case "PHONE_NUMBER":
                              setphoenobtn("PHONE_NUMBER");
                              setButtonPhonetxt(buttonsValue?.text);
                              setButtonPhoneNotxt(buttonsValue?.phone_number);
                              break;
                           case "COPY_CODE":
                              setcopybtn("COPY_CODE");
                              setButtonCopycodetxt(buttonsValue?.text);
                              break;
                           case "URL":
                              seturlbtn("URL");
                              setButtonurltxt(buttonsValue?.text);
                              setButtonwebUrltxt(buttonsValue?.text);
                              break;
                           case "URL":
                              setdynamicurlbtn("URL");
                              setButtondynamicUrltxt(buttonsValue?.text);
                              setButtondynamicwebUrltxt(buttonsValue?.text);
                              setButtonexampleUrltxt(buttonsValue?.text);
                              break;
                           default:
                              break;
                        }
                     }
                  });
               }
               else if (component.type === "CAROUSEL") {
                  const formattedSlides = component.cards.map((card: any, index: number) => {
                  const header = card.components.find((c: any) => c.type === "HEADER");
                  const body = card.components.find((c: any) => c.type === "BODY");
                  const buttons = card.components.find((c: any) => c.type === "BUTTONS");

                  // Replace placeholders with example values in body text
                  let bodyText = body?.text || "";
                  // const exampleValues = body?.example?.body_text?.[0] || [];
                  // exampleValues.forEach((val: string, i: number) => {
                  //    bodyText = bodyText.replace(`{{${i + 1}}}`, val);
                  // });

                  // Replace URL placeholders with example
                  const formattedButtons = (buttons?.buttons || []).map((btn: any, btnIdx: number) => {
                     let url = btn.url || "";
                     if (btn.type === "URL" && btn.example?.length > 0) {
                     url = url.replace(`{{1}}`, btn.example[0]);
                     }
                     return {
                     type: btn.type.toLowerCase(),
                     text: btn.text,
                     url
                     };
                  });

                  return {
                     id: index,
                     src: header?.example?.header_handle?.[0] || "",
                     format: header?.format?.toLowerCase() || "image",
                     title: `Slide ${index + 1}`,
                     bodyText,
                     buttons: formattedButtons
                  };
               });

               setslides(formattedSlides);
               setCarouselTyp(component.type);
               }

            });
         } else {
            setHasClicked(false);
            toast.error(`Get failed: ${responseData.apiStatus.message}`);
         }
      } catch (error) {
         setHasClicked(false);
         console.error("Error during API call:", error);
      }
   };

   const handleDeletetemp = () => {
      setLoadingbtn(true)
      VendorAPI.whatsappDeletetemp(tempId, tempname)
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
                  whatsappTemplateList(currentPage);
                  closeButton.click();
               }
               toast.success(responseData.apiStatus.message)
               setLoadingbtn(false)
            } else {
               toast.error(responseData.apiStatus.message);
               setLoadingbtn(false)
            }
         })
         .catch((error: any) => {
            setLoadingbtn(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };
 
   useEffect(() => {
         const modalElements = [
           document.getElementById('whatsappTempview'),
         ];
         const handleHidden = () => {resetForm();};
         modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
         return () => {
           modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
         };
       }, []);
   const resetForm = () => {
      setheaderTextValues('');
      setBodyTextValues('');
      setfooterTextValues('');
      setquickbtn("");
      setphoenobtn("");
      setcopybtn("");
      seturlbtn("");
      setdynamicurlbtn("");
      setButtonQuicktxt("");
      setButtonPhonetxt("");
      setButtonurltxt("");
      setButtondynamicUrltxt("");
      setImgValue('');
      setDocValue('');
      setVdoValue('');
      setCarouselTyp('');
      setslides([]);
      setCurrentIndex(0)
   }
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <TopNav />
            <div className="container-fluid py-1">


               <div className="row">
                  <div className="col-md-4">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                           <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                           <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Whatsapp</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0 grayFont">Whatsapp <i className="fa-brands fa-whatsapp"></i></h6>
                     </nav>
                  </div>
                  <div className="col-md-8 text-end whatsapp-three-btn">
                     <button className="vendor-crt-btn" onClick={() => navigate('/vendor/create-whatsapp-template')}>Create New Template</button>
                     <button className="vendor-crt-btn" onClick={() => whatsappSyncAPI()}>Sync Whatsapp Templates</button>
                     <button className="vendor-crt-btn" onClick={() => navigate('')}>Manage Templates on Meta</button>
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
                                 ) : listWhatsapp.length === 0 ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <>
                                       <table className="table align-items-center justify-content-center mb-0">
                                          <thead>
                                             <tr>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7">Name</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Language</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Category</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Update on</th>
                                                <th className="store-table-head text-secondary text-xxs font-weight-bolder text-center opacity-7 ps-2">Action</th>
                                             </tr>
                                          </thead><tbody>

                                             {listWhatsapp.map((list: any) => (
                                                <tr key={list.id}>
                                                   <td>
                                                      <span className="text-sm ps-3 font-weight-bold">
                                                         {list?.name}</span>

                                                   </td>
                                                   <td>
                                                      <span className="text-sm">
                                                         {list?.language}</span>
                                                   </td>
                                                   <td>
                                                      <span className="text-sm">
                                                         {list?.category}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <span
                                                         className="text-sm font-weight-bold"
                                                         style={{
                                                            color: list?.status === 'APPROVED'
                                                               ? '#2bac32'
                                                               : list?.status === 'REJECTED'
                                                                  ? '#ef5252'
                                                                  : list?.status === 'PENDING'
                                                                     ? '#f1c40f'
                                                                     : 'black'
                                                         }}
                                                      >
                                                         {list?.status === 'APPROVED'
                                                            ? <>
                                                            <i className="fa-regular fa-circle-check"></i> APPROVED
                                                            </>
                                                            : list?.status === 'REJECTED'
                                                               ? <>
                                                               <i className="fa-regular fa-circle-xmark"></i> REJECTED
                                                               </>
                                                               : list?.status === 'PENDING'
                                                                  ? <>
                                                                  <i className="fa-solid fa-spinner"></i> PENDING
                                                                  </>
                                                                  : 'Unknown Status'}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <span className="text-sm">
                                                         {new Date(list.updated_date || "-").toLocaleString('en-US', {
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
                                                   <td className="align-middle text-center">
                                                      <div className="actionCreateCampaign-tooltip-container">
                                                         <button onClick={() => {
                                                            if (list?.status === "APPROVED") {
                                                               navigate(`/vendor/campaign/create/new/${list?.name}/${list?.id}`);
                                                            }
                                                         }} className="btn-3 vendorbtn-bullhorn" type="button">
                                                            <span className="btn-inner--icon"><i className="fa-solid fa-bullhorn"></i></span>
                                                         </button>&nbsp;
                                                         <div className="actionCreateCampaign-tooltip-text">
                                                            Create Campaign
                                                         </div>
                                                      </div>
                                                      <div className="actionView-tooltip-container">
                                                         <button className="btn-3 vendorbtn-view" type="button" onClick={() => { handleClick(list.id)}}>
                                                            <span className="btn-inner--icon"><i className="fa-solid fa-eye"></i></span>
                                                         </button>&nbsp;
                                                         <div className="actionView-tooltip-text">
                                                            View
                                                         </div>
                                                      </div>
                                                     <div className="actionEdit-tooltip-container">
                                                      <button
                                                         onClick={() => {
                                                            if (list?.template_type !== "carousel") {
                                                            navigate(`/vendor/edit-whatsapp-template/${list.id}`);
                                                            }
                                                         }}
                                                         className="btn-3 vendorbtn-edit"
                                                         type="button"
                                                         disabled={list?.template_type === "carousel"}
                                                      style={{
                                                         cursor: list?.template_type === "carousel" ? 'default' : 'pointer'
                                                      }}
                                                      >
                                                         <span className="btn-inner--icon" style={{ visibility: list?.template_type === "carousel" ? 'hidden' : 'visible' }}>
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                         </span>
                                                      </button>
                                                      &nbsp;
                                                      {list?.template_type !== "carousel" && (
                                                         <div className="actionEdit-tooltip-text">
                                                            Edit
                                                         </div>
                                                      )}
                                                      </div>
                                                      <div className="actionDelete-tooltip-container">
                                                         <button className="btn-3 vendorbtn-danger" type="button" data-bs-toggle="modal" onClick={() => { setTempId(list?.id); setTempName(list?.name) }} data-bs-target="#vendordelete">
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
                                       <div className="store-pagination mt-2">
                                          <Pagination>
                                             <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                             {renderPaginationItems()}
                                             <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                          </Pagination>
                                       </div>
                                    </>
                                 )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               {/* Whatsapp Templates View */}
               <div className="modal fade" id="whatsappTempview" aria-labelledby="vendorviewLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                  <div className="modal-dialog modal-dialog-centered template-view-modal-dialog">
                     <div className="modal-content all-modal-content">
                        <div className="modal-header vendor-view-header">
                           <h1 className="modal-title fs-6 mb-3 text-center" id="vendorviewLabel">Template Preview</h1>
                        </div>
                        <div className="p-0 modal-body text-center ">
                           

 
                           <div className="text-end">
                              <div className="template-preview template-preview-modal">
                                 <div className="conversation">
                                    <div className="conversation-container">
                                       <div className="message received text-start z-0">
                                          <div className='mt-2 text-sm temp-view-head'>
                                             <div className='ps-3 mt-2 template-previewModal-text temp-view-head'>
                                                <strong> {headerTextValues}</strong>
                                             </div>
                                             {imgValue ? <div className='ps-0 rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}><img className="w-100 rounded" src={imgValue} alt="" /></div> : null}
                                             {vdoValue ? <div className='rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'gainsboro',pointerEvents: 'auto' }}><video className="w-100 rounded" controls autoPlay loop playsInline><source src={vdoValue} type="video/mp4" /> </video></div> : null}
                                             {/* {vdoValue ? <div className='rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '35px', background: 'gainsboro' }}><i className="fa fa-5x fa-play-circle"></i></div> : null} */}
                                             {docValue ? <div className='ps-0 rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '35px', background: 'gainsboro' }}><i className="fa fa-5x fa-file-alt text-white"></i></div> : null}
                                          </div>
                                          <div className='p-3 mt-1 template-previewModal-text temp-view-body'
                                             dangerouslySetInnerHTML={{
                                                __html: bodyTextValues.replace(/\*(.*?)\*/g, '<b>$1</b>')
                                                   .replace(/_(.*?)_/g, '<i>$1</i>')
                                                   .replace(/~(.*?)~/g, '<strike>$1</strike>')
                                                   .replace(/\n/g, '<br>')
                                             }}>
                                          </div>
                                          <div className='px-3 mb-1 template-previewModal-text temp-view-footer'>
                                             {footerTextValues}
                                          </div>
                                          <div className='px-3  text-center temp-view-buttons'>
                                             {(quickbtn === 'None' || quickbtn === 'QUICK_REPLY') && (
                                                <p className="button-option-style template-previewModal-text text-center">{quickbtn === "QUICK_REPLY" ? <i className="fa-solid fa-reply bt-1"></i> : ""} {buttonQuicktxt}</p>
                                             )}
                                             {(phoenobtn === 'None' || phoenobtn === 'PHONE_NUMBER') && (
                                                <p className="button-option-style template-previewModal-text text-center">{phoenobtn === "PHONE_NUMBER" ? <i className="fa-solid fa-phone"></i> : ""} {buttonPhonetxt}</p>
                                             )}
                                             {(copybtn === 'None' || copybtn === 'COPY_CODE') && (
                                                <p className="button-option-style template-previewModal-text text-center">{copybtn === "COPY_CODE" ? <i className="fa-solid fa-copy"></i> : ""} {copybtn === "COPY_CODE" ? "Copy Code" : ""}</p>
                                             )}
                                             {(urlbtn === 'None' || urlbtn === 'URL') && (
                                                <p className="button-option-style template-previewModal-text text-center">{urlbtn === "URL" ? <i className="fa-solid fa-square-arrow-up-right"></i> : ""} {buttonurltxt}</p>
                                             )}
                                             {(dynamicurlbtn === 'None' || dynamicurlbtn === 'URL') && (
                                                <p className="button-option-style template-previewModal-text text-center">{dynamicurlbtn === "URL" ? <i className="fa-solid fa-square-arrow-up-right"></i> : ""} {buttondynamicUrltxt}</p>
                                             )}
                                          </div>
                                       </div>
                                       {carouselTyp &&(
                                       <div className="main-container-carousels">
                                          <div className="carousel-container">
                                          <div className="wrapper conversation-container px-1 pb-0">
                                          <div className="slider-wrapper">
                                             <div
                                                className="inner"
                                                style={{
                                                width: `${slides.length * 100}%`,
                                                transform: `translateX(-${currentIndex * (100 / slides.length)}%)`
                                                }}
                                             >
                                                {slides.map((slide:any, index:any) => (
                                                <article key={index} style={{ width: `${100 / slides.length}%` }}>
                                                   <div className={`info ${slide.position || ""}`}>
                                                      {/* <h3>{slide.title}</h3> */}
                                                   </div>
                                                   {slide.format === 'video' ? (
                                                      <video src={slide.src} controls />
                                                   ) : (
                                                      <img src={slide.src} alt={slide.title || `Slide ${index}`} />
                                                   )}
                                                </article>
                                                ))}
                                             </div>
                                          </div>

                                          {slides && slides.length >= 2 && (
                                             <div className="slider-nav-buttons modal-slider-nav-buttons ">
                                                <button onClick={(e) => { prevSlide(); e.preventDefault(); }}>❮</button>
                                                <button onClick={(e) => { nextSlide(); e.preventDefault(); }}>❯</button>
                                             </div>
                                          )}

                                          <div className="slider-dot-control">
                                             {slides.map((_:any, index:any) => (
                                                <span
                                                key={index}
                                                className={index === currentIndex ? 'active-dot' : ''}
                                                onClick={() => setCurrentIndex(index)}
                                                />
                                             ))}
                                          </div>

                                          {/* Description and Buttons */}
                                          
                                          </div>
                                          {slides[currentIndex] && slides[currentIndex].bodyText && (
  <div key={slides[currentIndex].id}>
    <p
      style={{ textAlign: "justify", fontSize: "12px", padding: "0 5px" }}
      dangerouslySetInnerHTML={{
        __html: slides[currentIndex].bodyText
          .replace(/\*(.*?)\*/g, "<b>$1</b>")
          .replace(/_(.*?)_/g, "<i>$1</i>")
          .replace(/~(.*?)~/g, "<strike>$1</strike>")
          .replace(/\n/g, "<br>")
      }}
    ></p>
  </div>
)}

{slides[currentIndex] && slides[currentIndex].buttons && (
  <div className="template-buttontxt">
    {slides[currentIndex].buttons.map((button: any, idx: any) => {
      let icon = null;

      if (button.type === "quick_reply") {
        icon = <i className="fa-solid fa-reply bt-1"></i>;
      } else if (button.type === "phone_number") {
        icon = <i className="fa-solid fa-phone"></i>;
      } else if (button.type === "url") {
        icon = <i className="fa-solid fa-square-arrow-up-right"></i>;
      }

      return (
        <p
          key={idx}
          className="template-buttontxt button-option-style text-center"
        >
          {icon} {button.text}
        </p>
      );
    })}
  </div>
)}

                                          </div>

                                          </div>)}
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
               {/*Temp Delete Modal*/}
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
                              <h6 className="modal-confirm-subhead">You want to delete this {tempname} template ?</h6>
                           </div>
                        </div>
                        <div className="modal-footer text-center vendor-delete-footer">
                           <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal">No</button>&nbsp;
                           <button type="button" className="btn btn-primary" onClick={handleDeletetemp} disabled={loadingbtn}>  {loadingbtn ? "Yes...":"Yes"}</button>
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

export default WhatsappTemplate;