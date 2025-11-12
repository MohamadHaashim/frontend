import React, { useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import Footer from "../../../shared/Footer";
import general_Logo from "../../../assets/img/bizconvo-logo.png";
import Navlogo from "../../../assets/img/bizconvo-logo.png"
import whaInte from "../../../assets/img/aeDwghR.png";
import whaSetting from "../../../assets/img/G4fMiT9.png"
import TopNav from "../../../shared/TopNav";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import API from "../../../api/api";
import API_EP_BOOK from "../../../api/endpoints";
import { Link, useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import './customCampaign.css';
import imgValue from '../../../assets/img/wallpaperflare.com_wallpaper_Bday.jpg';
import imgValue1 from '../../../assets/img/wallpaperflare.com_wallpaper_Annual.jpg';
import { baseURL } from "../../../api/api";
function CustomCampaign() {
   const [imgactive, setimgActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [removeImg, setremoveImg] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [tempId, settempId] = useState("");
    const [tempName, settempName] = useState("");
    const [tempContent, settempContent] = useState("");
    const [tempImage, settempImage] = useState("");
    const [tempStatus, settempStatus] = useState("");
    const [fileName, setfileName] = useState("");
    const [customListData, setCustomListData] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingImage, setExistingImage] = useState<File | null>(null);
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
    const resetForm=()=>{
      settempId("");
      settempName("");
      settempContent("");
      setSelectedFile(null);
      setremoveImg(false);
    }
    const handleTemplateUpdate = async (file?: File | null) => {
      const formData = new FormData();
      formData.append("id", tempId);
      formData.append("name", tempName);
      formData.append("content", tempContent);
      formData.append("remove_image", removeImg ? "true":"false");
      if (file) {
        formData.append("image_file", file);
      }      
      try {
          const response = await VendorAPI.customCampaignUpdate(formData);
          if (response?.apiStatus?.code==="200") {
            handlecustomCampaignList(currentPage);
              toast.success(response?.apiStatus?.message);
              resetForm();
              const closeButton = document.getElementById("deleteCreate");
              if (closeButton) {
                 closeButton.click();
              }
          } else {
              toast.error(response.apiStatus?.message);
          }
      } catch (error) {
          console.error("Import Error:", error);
          toast.error("An error occurred while importing the file.");
      }
  };
    const handlecustomCampaignList = (page: any) => {
          setLoading(true)
          const apiData = {
            pageIndex: page - 1,
            dataLength: recordsPerPage
          };
          VendorAPI.customCampaignList(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                  setLoading(false)
                  console.log(responseData,"repo")
                  setCustomListData(responseData.result.CampaignDataList)
                } else {
                  if (responseData.apiStatus.code == "404") {
                  setCustomListData([]);
                  }
                  // toast.error(responseData.apiStatus.message);
                  setLoading(false)
                }
            })
            .catch((error: any) => {
                setLoading(false)
                console.error("Error during login:", error);
                toast.error("An error occurred during login.");
            });
      }
      const handlecustomCampaignGet = (tempId: any) => {
          VendorAPI.customCampaignGet(tempId)
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    settempId(responseData?.result?.id);
                    settempName(responseData?.result?.name);
                    settempContent(responseData?.result?.content);
                    settempImage(baseURL+responseData?.result?.image);
                    console.log(responseData?.result?.image,"temp")
                    if(responseData?.result?.image){
                      setimgActive(true)
                    }
                    else{
                      setimgActive(false)
                    }
                    settempStatus(responseData?.result?.activeStatus);
                } else {
                   toast.error(responseData.apiStatus.message);
                }
             })
             .catch((error: any) => {
                setLoading(false)
                console.error("Error during login:", error);
                toast.error("An error occurred during login.");
             });
       };
       const handletempStatus = () => {
             const apiCall = VendorAPI.customCampaignStatus(tempId);
             apiCall
                    .then((responseData: any) => {
                   if (responseData.apiStatus.code === '200') {
                      toast.success(responseData.apiStatus.message);
                      handlecustomCampaignList(currentPage);
                      const closeButton = document.getElementById("closeModal");
                      if (closeButton) {
                         closeButton.click();
                      }
                   } else {
                      toast.error(responseData.apiStatus.message);
                   }
                })
                .catch((error: any) => {
                   setLoading(false)
                   console.error("Error during login:", error);
                   toast.error("An error occurred during login.");
                });
          };
      useEffect(()=>{
        handlecustomCampaignList(currentPage)
      },[])
      useEffect(() => {
            const modalElements = [
              document.getElementById('closeactiveModal'),
              document.getElementById('customTemplate'),
            ];
            const handleHidden = () => {resetForm();};
            modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
            return () => {
              modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
            };
          }, []);
    return (
        <>
<DashboardLayout>
	<main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
		<TopNav />
		<div className="container-fluid py-1">
    <div className="row">
    <div className="col-md-6">
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
					 <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
					<li className="breadcrumb-item text-sm grayFont active" aria-current="page">Settings</li>
				</ol>
				<h6 className="font-weight-bolder text-start mb-0 grayFont">Custom Campaign</h6>
			</nav>
		</div>
  </div>
  </div>
		<div className="dashboard-maincontent container-fluid py-4">
			<div className="card p-3">
				<h5 className="grayFont">
					<i className="fa-solid fa-gift text-dark "></i> Set It, Celebrate It <i className="fa-solid fa-cake-candles text-dark"></i>
				</h5>
				<div className="">
					<div className="container-fluid py-4">
						<div className="row gap-8">
              {
                loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                      <FadeLoader color="#36d7b7" />
                  </div>
                ) : customListData.length === 0 ? (
                  <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                ) : (
                  <>
                  {customListData.map((listData:any) => (
							  <div className="col-md-5 card p-0">
									<div className="modal-content all-modal-content">
										<div className="p-2">
											<h1 className="modal-title fs-6 mb-3 text-start grayFont" id="vendorviewLabel">
                        {listData?.name.charAt(0).toUpperCase() + listData?.name.slice(1)} Template
                      </h1>
										</div>
										<div className="p-0 modal-body text-center ">
											<div className="text-end">
												<div className="template-preview rounded customtemplate-preview-modal m-5">
													<div className="conversation">
														<div className="conversation-container">
															<div className="message received text-start">
																<div className="mt-2 text-sm temp-view-head">
																	<div className="mt-2 template-previewModal-text temp-view-head">
																		<strong>{listData?.name ==="birthday" ? "🎉 Happy Birthday" :"💖 Happy Anniversary"}</strong>
																	</div>
																	<div className='ps-0 rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
																		<img className="w-100 rounded" src={baseURL+listData?.image} alt="" />
																	</div>
																</div>
																<div className="p-2 mt-1 template-previewModal-text temp-view-body">
                                  {listData?.content}
                                </div>
															</div>
                              <div className="row align-items-center">
                                <div className="d-flex justify-content-evenly">
                                  <div>
                                    <button
                                      className="custom-edit-button"
                                      data-bs-toggle="modal"
                                      data-bs-target="#customTemplate"
                                      onClick={() => handlecustomCampaignGet(listData?.id)}
                                    >
                                      <svg className="custom-edit-svgIcon" viewBox="0 0 512 512">
                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="toggle-button-cover">
                                    <div id="button-3" className="button r">
                                      <input
                                        className="checkbox"
                                        type="checkbox"
                                        onClick={() => {settempId(listData?.id);settempStatus(listData?.activeStatus)}}
                                        checked={listData?.activeStatus === "0"}
                                        data-bs-toggle="modal"
                                        data-bs-target="#closeactiveModal"
                                        readOnly
                                      />
                                      <div className="knobs"></div>
                                      <div className="layer"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
							  </div>
                  ))}
              </>
              )}              
						</div>
            
            <div className="modal fade" id="customTemplate" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
               <div className="modal-content all-modal-content modal-container-size vendor-delete-content">
                  <div className="modal-header vendorcontact-modal-header border-0">
                     <h5 className="modal-title vendorcontact-modal-title grayFont" id="vendorcontactLabel">
                        {tempName==="birthday" ? "Birthday Template":"Anniversary Template"}
                     </h5>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                     <div className="row">
                        <div className="col-md-6">
                        <div className="">
                          <div className="modal-content all-modal-content">
                            <div className="p-0 modal-body text-center ">
                              <div className="text-end">
                                <div className="template-preview rounded customtemplate-preview-modal m-5">
                                  <div className="conversation">
                                    <div className="conversation-container">
                                      <div className="message received text-start">
                                        <div className="mt-2 text-sm temp-view-head">
                                          <div className="mt-2 template-previewModal-text temp-view-head">
                                            <strong>{tempName ==="birthday" ? "🎉 Happy Birthday" :"💖 Happy Anniversary"}</strong>
                                          </div>
                                          <div className='ps-0 rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                            {removeImg===false ? <img className="w-100 rounded" src={tempImage} alt="" />:<></>}
                                          </div>
                                        </div>
                                        <div className="p-2 mt-1 template-previewModal-text temp-view-body">
                                          {tempContent}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        </div>
                        <div className="col-md-6">
                          <div className="media-upload-container login-input-group">
                          <label htmlFor="vendor-crt-input-2" className="media-upload-label">
                          <i className="fa fa-photo-film icon-left mt-1" /> 
                          <span className="mt-1">Select Media File</span>
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
                        <p className="text-sm px-3">{fileName&& fileName}</p>
                        {/* <div className="mt-2">
                          <div className="form-check form-switch ms-1 is-filled">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckDefault"
                              /> <span className="text-xs">Remove Image</span>
                          </div>
                        </div> */}
                        {imgactive ? 
                        <div className="d-flex gap-2">
                          <label htmlFor="toggle-remove-image" className="m-2 text-secondary fw-bold">Remove Image <i className="fa-solid fa-images"></i></label>
                          <div className="toggle-button-cover">
                            <div id="button-3" className="button r">
                              <input
                                id="toggle-remove-image"
                                className="checkbox"
                                type="checkbox"
                                readOnly
                                onClick={()=>{
                                  if(removeImg === true){
                                    setremoveImg(false)
                                  }else{
                                  setremoveImg(true)}}}
                                checked={removeImg}
                              />
                              <div className="knobs"></div>
                              <div className="layer"></div>
                            </div>
                          </div>
                        </div>:<></>}
                        <div className="login-input-group">
                            <div className="vendor-create-container">
                                <textarea autoComplete="off" style={{height:"300px"}} onChange={(e)=>settempContent(e.target.value)} value={tempContent} id="vendor-crt-input" 
                                className={`vendor-crt-input loginfilled-frame-username`}
                                placeholder=" " required />
                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-pen-to-square"></i> Content</label>
                            </div>
                          </div>
                     </div>
                     </div>
                  </div>
                  <div className="modal-footer text-end border-0">
                     <button type="button" className="btn btn-secondary" id="deleteCreate" data-bs-dismiss="modal" onClick={()=>{setfileName("");resetForm()}}>Close</button>&nbsp;
                  <button type="button" className="btn btn-primary" onClick={() => handleTemplateUpdate(selectedFile)}>Edit</button>
                  </div>
               </div>
            </div>
         </div>

         <div className="modal fade" id="closeactiveModal" tab-Index="-1" aria-labelledby="vendorActiveLabel" aria-hidden="true">
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
                          {tempStatus === "0" ?
                          <h6 className="modal-confirm-subhead">You want to enable this template ?</h6>:
                          <h6 className="modal-confirm-subhead">You want to disable this template ?</h6>}
                          <div></div>
                      </div>
                    </div>
                    <div className="modal-footer text-center vendor-delete-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeModal">No</button>&nbsp;
                      <button type="button" className="btn btn-primary" 
                      onClick={()=>{ handletempStatus()}} 
                      >Yes</button>
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
</>
    )
}
export default CustomCampaign;