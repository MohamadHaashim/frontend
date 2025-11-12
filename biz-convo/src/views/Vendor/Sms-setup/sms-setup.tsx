import React, { useEffect, useState } from "react";
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
declare global {
    interface Window {
      bootstrap: any;
    }
  }
  
function Sms_Settings() {
    
    const [showdata, SetShowData] = useState(false);
    const [subscription, setSubscription] = useState(false);
    const [quickHelp, setQuickhelp] = useState(false);
    const [showbutton, SetShowButton] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [testsubmit, settestSubmit] = useState(false);
    const [showbutton1, SetShowButton1] = useState(false);
    const [showbuttons, SetShowButtons] = useState(false);
    const [entityId, setentityId] = useState("");
    const [appSenderId, setappSenderId] = useState("");
    const [apiKey, setapiKey] = useState("");
    const [smsConfig, setsmsConfig] = useState(false);
    const [loading, setLoading] = useState(false);
    const [testContactInte, settestContactInte] = useState(false);
    const [testContact, settestContact] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate=useNavigate();
    
    const ShowTernary = () => {
        if (showdata === true) {
            SetShowData(false)
            setSubmit(false);
        }
        else {
            SetShowData(true);
        }
        if(showbutton===true){
            SetShowButton(false);
            setSubmit(false);
        }
    };
    
    const ShowButtonData = () => {
        SetShowButton(true);
    }
   
    const ShowButtonDatas = () => {
        SetShowButtons(true);
        if(showbuttons===true){
            SetShowButtons(false);
        }
    }
    const handlesmsSetup = () => {
        setSubmit(true);
        if (!appSenderId || !entityId || !apiKey) {
           return;
        }
        const apiData = {
            senderId: appSenderId,
            entityId: entityId,
            apiKey: apiKey,
        };
        const apiCall= VendorAPI.smssetupCreate(apiData);
        apiCall
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                 setSubmit(false);
                 SetShowButton(false);
                 SetShowData(false)
                 setappSenderId("");
                 setentityId("");
                 setapiKey("");
                 handlesmsSetupConfig();
                 toast.success(responseData.apiStatus.message);
              } else {
                 toast.error(responseData.apiStatus.message);
              }
           })
           .catch((error: any) => {
              console.error("Error while fetching sms setup:", error);
              toast.error("An error occurred while fetching sms setup.");
           });
     };
     
     const handlesmsSetupConfig = () => {
        setLoading(true);
        VendorAPI.smssetupConfig()
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                 setsmsConfig(responseData?.responseData?.smsConfigured);
                 setLoading(false);
                 settestContact(responseData?.responseData?.testContact || ''); 
                 settestContactInte(responseData?.responseData?.testContact); 
              } else {
                 toast.error(responseData.apiStatus.message);
                 setLoading(false);
              }
           })
           .catch((error: any) => {
              setLoading(false)
              console.error("Error while fetching sms setup config:", error);
              toast.error("An error occurred while fetching sms setup config.");
        });
     };
      //Test contact Config
         const handleTestContact = () => {
               settestSubmit(true);
               if (!testContact) {
                  return;
               }
               const apiData = {test_contact: testContact};
               const apiCall =  VendorAPI.smssetuptestContact(apiData);
               apiCall
                  .then((responseData: any) => {
                     if (responseData.apiStatus.code === '200') {
                         settestSubmit(false);
                         SetShowButtons(false);
                         settestContactInte(true);
                         toast.success(responseData.apiStatus.message);
                         settestContact("");
                         handlesmsSetupConfig()
                     } else {
                        toast.error(responseData.apiStatus.message);
                     }
                  })
                  .catch((error: any) => {
                     settestSubmit(false);
                     console.error("Error while fetching sms test contact:", error);
                     toast.error("An error occurred while fetching sms test contact.");
                  });
         };
    useEffect(()=>{
        handlesmsSetupConfig();
    },[])
   
    return (
        <>
            <DashboardLayout>
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                    <TopNav />
                    <div className="container-fluid py-1">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Settings</li>
                            </ol>
                            <h6 className="font-weight-bolder text-start mb-0">Sms Settings</h6>
                        </nav>
                    </div>

                    <div className="dashboard-maincontent container-fluid py-4">
                        <div className="card p-3">
                            <h4>Sms Setup</h4>
                            <div className="row">
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                    <FadeLoader color="#36d7b7" />
                                </div>
                            ) : (
                                <div className="row mt-5">
                                    {/* Sms Developer Account */}
                                    <div className="col-md-6">
                                        <div className="campaign-template border shadow-lg mb-5">
                                            <h6 onClick={ShowTernary} className="campaign-temp-head">
                                                Sms Developer Account <span className="setting-whatsapp-ternary">Click to expand/collapse</span>
                                            </h6>
                                            <div className={`campaign-content-wrapper ${showdata ? 'show' : ''}`}>
                                                {showdata && (
                                                    <>
                                                        <div className="mb-3">
                                                            {!showbutton && (
                                                                <p onClick={ShowButtonData} className="whatsapp-tem-setting-btn">Click Here To Update</p>
                                                            )}
                                                            <div className={`campaign-clickbtn-wrapper ${showbutton ? 'show' : ''}`}>
                                                                {showbutton && (
                                                                    <div className="mt-2">
                                                                        <div className="vendor-create-container">
                                                                            <input
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                onChange={(e) => setentityId(e.target.value)}
                                                                                value={entityId}
                                                                                className={`vendor-crt-input loginfilled-frame-username ${submit && !entityId ? 'error' : ''}`}
                                                                                placeholder=" "
                                                                                required
                                                                            />
                                                                            <label className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Entity Id</label>
                                                                        </div>
                                                                        {submit && !entityId && <div className='text-danger error-message-required'>Entity Id is required</div>}

                                                                        <div className="vendor-create-container mt-3">
                                                                            <input
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                onChange={(e) => setappSenderId(e.target.value)}
                                                                                value={appSenderId}
                                                                                className={`vendor-crt-input loginfilled-frame-username ${submit && !appSenderId ? 'error' : ''}`}
                                                                                placeholder=" "
                                                                                required
                                                                            />
                                                                            <label className="vendor-crt-label"><i className="fa-solid fa-share"></i> Sender Id</label>
                                                                        </div>
                                                                        {submit && !appSenderId && <div className='text-danger error-message-required'>Sender Id is required</div>}
                                                                        <div className="vendor-create-container mt-3">
                                                                            <input
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                onChange={(e) => setapiKey(e.target.value)}
                                                                                value={apiKey}
                                                                                className={`vendor-crt-input loginfilled-frame-username ${submit && !apiKey ? 'error' : ''}`}
                                                                                placeholder=" "
                                                                                required
                                                                            />
                                                                            <label className="vendor-crt-label"><i className="fa-brands fa-adn"></i> API Key</label>
                                                                        </div>
                                                                        {submit && !apiKey && <div className='text-danger error-message-required'>API Key is required</div>}
                                                                        <div className="text-end mt-1">
                                                                            <button className="vendor-crt-btn" onClick={handlesmsSetup}>Save</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                {smsConfig ? (
                                                    <p className="setting-whatsapp-con-tic">
                                                        <i className="fa-solid fa-check setting-whatapp-tick"></i> CONFIGURED
                                                    </p>
                                                ) : (
                                                    <p className="setting-whatsapp-con-notconf">
                                                        <i className="fa-solid fa-circle-exclamation"></i> NOT CONFIGURED
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Contact for Campaign */}
                                    <div className="col-md-6">
                                        <div className="campaign-template border shadow-lg mb-5">
                                            <h6 className="campaign-temp-head" onClick={ShowButtonDatas}>
                                                Test Contact for Campaign <span className="setting-whatsapp-ternary">Click to expand/collapse</span>
                                            </h6>
                                            <div className={`campaign-content-wrapper ${showbuttons ? 'show' : ''}`}>
                                                {showbuttons && (
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="vendor-create-container">
                                                                <input autoComplete="off" onChange={(e) => settestContact(e.target.value)} value={testContact} maxLength={12} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${testsubmit && !testContact ? 'error' : ''}`} placeholder=" " required />
                                                                <label className="vendor-crt-label">
                                                                <i className="fa-solid fa-phone"></i> Test Contact Number
                                                                </label>
                                                            </div>
                                                            {/* {submit && testContact.length == 0 ? <div className='text-danger error-message-required'>Test contact.no is required</div> : <></>} */}
                                                            <small>Phone number to test, It should be with country code without 0 or +</small>
                                                            <div className="text-end">
                                                                 <button className="vendor-crt-btn" disabled={isLoading} onClick={handleTestContact}>{isLoading ? ("Save...") : ("Save")}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                            {testContactInte ?
                                                <p className="setting-whatsapp-con-tic"><i className="fa-solid fa-check setting-whatapp-tick"></i> CONFIGURED</p>
                                                :<p className="setting-whatsapp-con-notconf">
                                                <i className="fa-solid fa-circle-exclamation"></i> NOT CONFIGURED
                                                </p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>
                        <Footer />
                    </div>
                </main>
            </DashboardLayout>
        </>
    )
}
export default Sms_Settings;