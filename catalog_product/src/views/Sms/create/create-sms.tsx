import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import { toast } from "react-toastify";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
interface LangCodeDrop {
    id: string;
    language_name: string;
    language_code: string;
}
interface SenderIdDrop {
    id: string;
    senderId: string;
}
function CreateSms() {
    const navigate = useNavigate();
    const [modalMode, setModalMode] = useState("create");
    const [submit, setSubmit] = useState(false);
    const [senderId, setsenderId] = useState("")
    const [smsType, setsmsType] = useState("")
    const [languageCode, setLaguageCode] = useState('')
    const [langName, setLangName] = useState('')
    const [testMobileNo, settestMobileNo] = useState("")
    const [templateId, settemplateId] = useState("")
    const [templateName, settemplateName] = useState("")
    const [templateContent, settemplateContent] = useState("")
    const [id, setGetId] = useState("");
    const [urlValue, setValue] = useState("");
    const [langCodeDrop, setlangCodeDrop] = useState<LangCodeDrop[]>([]);
    const [senderIdDrop, setsenderIdDrop] = useState<SenderIdDrop[]>([]);
    const [loading, setLoading] = useState(false);
   
    const handlePhoneChange = (e: { target: { value: string } }) => {
        let value = e.target.value;
        if (value === "" || /^\+?[0-9]*$/.test(value)) {
            settestMobileNo(value);
        }
     };
    const handleTempIdChange = (e: { target: { value: string } }) => {
        let value = e.target.value;
        if (value === "" || /^\+?[0-9]*$/.test(value)) {
            settemplateId(value);
        }
     };
    
    const handleGetSms = (smsId: any) => {
        VendorAPI.smstemplateGet(smsId)
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                const data=responseData?.result;
                setsenderId(data?.senderId);
                settemplateId(data?.templateId);
                settemplateName(data?.templateName);
                setsmsType(data?.smsType);
                setLaguageCode(data?.language);
                setLangName(data?.language);
                settemplateContent(data.templateContent);
                settestMobileNo(data?.testMobile);
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

    const handlecreateSms = () => {
          setSubmit(true);
          if (!senderId || !templateId || !templateName || !templateContent) {
             return;
          }
          const apiData = {
             ...(modalMode === "edit" && { id: id }),
             senderId: senderId,
             smsType: smsType,  
             language: languageCode,          
             testMobileNo: testMobileNo,
             templateDetails: {
                templateId: templateId,
                templateName: templateName,
                templateContent: templateContent
            }
          };
          const apiCall = modalMode === "create" ? VendorAPI.smstemplateCreate(apiData) : VendorAPI.smstemplateUpdate(apiData);
          apiCall
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                   setSubmit(false);
                   toast.success(responseData.apiStatus.message);
                    navigate('/vendor/sms')
                } else {
                   toast.error(responseData.apiStatus.message);
                }
             })
             .catch((error: any) => {
                console.error("Error during login:", error);
                toast.error("An error occurred during login.");
             });
       };
       const languageCodeDropdwon = () => {
        VendorAPI.languageCodeDropdown()
            .then((responceData: any) => {
                if (responceData.apiStatus.code === '200') {
                    setlangCodeDrop(responceData?.responseData)
                }
            })
            .catch((error: any) => {
                console.error("Error during login:", error);
            });
    };
    //Dropdown Filter
    const filteredLangCodeDrop = langCodeDrop.filter((dropdownValue) =>
        (dropdownValue?.language_name || '').toLowerCase().includes((langName || '').toLowerCase())
      );
      const smscampaignSenderDrop = () => {
        VendorAPI.smscampaignSenderDrop()
            .then((responceData: any) => {
                if (responceData.apiStatus.code === '200') {
                    setsenderIdDrop(responceData?.result)
                }
            })
            .catch((error: any) => {
                console.error("Error during login:", error);
            });
    };
    //Dropdown Filter
    const filteredSenderDrop = senderIdDrop.filter((dropdownValue) =>
        (dropdownValue?.senderId || '').toLowerCase().includes((senderId || '').toLowerCase())
    );
    
    useEffect(() => {
        const queryParams = window.location.pathname;
        const myArray = queryParams.split("/");
        setValue(myArray[2]);
        setGetId(myArray[3]);
        if(urlValue==="edit-sms"){
            setModalMode('edit')
        }
        else{
            setModalMode('create')
        }
        })
        useEffect(() => {
        if (id && id !== "undefined" && id !== "") {
            handleGetSms(id);
        }
        }, [id]);
        useEffect(()=>{
            smscampaignSenderDrop();
            languageCodeDropdwon();
        },[])
    return (
        <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                <TopNav />
               
                <div className="container-fluid py-1">
                    <div className="row">
                        <div className="col-md-4 text-start mt-1">
                            <h4><i className="fa-regular fa-message"></i> {urlValue==='edit-sms' ? 'Edit SMS Template': 'Add SMS Template'}</h4>
                        </div>
                        <div className="col-md-8 text-end whatsapp-three-btn">
                        <button className="vendor-crt-btn" onClick={() => navigate("/vendor/sms")}>
                          <i className="fa-solid fa-chevron-left"></i> Back
                        </button>
                        </div>
                    </div>
                    </div>
                <div className="myprofile-maincontent container-fluid py-4">
                    <div className="row myprofile-content">
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-6 login-input-group">
                                    <div className="edit-container">
                                        <input type="text" autoComplete="off" onChange={(e) => settemplateName(e.target.value)} value={templateName} id="vendor-crt-input-1" className={`vendor-crt-input loginfilled-frame-username ${submit && !templateName ? 'error' : ''}`} placeholder=" " required />
                                        <label htmlFor="vendor-crt-input-1" className="vendor-crt-label">
                                            <i className="fa-solid fa-user"></i> Template Name
                                        </label>
                                    </div>
                                    {submit && templateName.length == 0 ? <div className='text-danger error-message-required'>Template name is required</div> : <></>}
                                </div>
                                <div className="col-md-6 login-input-group">
                                    <div className="edit-container">
                                        <input type="text" autoComplete="off" onChange={handleTempIdChange} value={templateId} id="vendor-crt-input-2" className={`vendor-crt-input loginfilled-frame-username ${submit && !templateId ? 'error' : ''}`} placeholder=" " required />
                                        <label htmlFor="vendor-crt-input-2" className="vendor-crt-label">
                                            <i className="fa-regular fa-id-badge"></i> Enter Template ID
                                        </label>
                                    </div>
                                {submit && templateId.length == 0 ? <div className='text-danger error-message-required'>Template.Id is required</div> : <></>}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6 login-input-group">
                                <div className="edit-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <input
                                            type="text"
                                            id="vendor-crt-input"
                                            className="vendor-crt-input"
                                            placeholder=" "
                                            required
                                            style={submit && senderId.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                            value={senderId}
                                            // onClick={smscampaignSenderDrop}
                                            autoComplete="off" onChange={(e) => setsenderId(e.target.value)}
                                        />
                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                        <i className="fa-solid fa-share"></i> Sender ID</label>
                                        <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                        <ul className="dropdown-menu template-dropdown w-100" >
                                        {filteredSenderDrop.length === 0 ? (
                                            <li className="dropdown-nodata-found">No data found</li>
                                        ) : (
                                            filteredSenderDrop.map((dropdownValue, id) => (
                                                <li key={id}>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => {
                                                            setsenderId(dropdownValue?.senderId);
                                                        }}
                                                    >
                                                        {dropdownValue?.senderId}
                                                    </a>
                                                </li>
                                            )))}
                                        </ul>
                                    </div>
                                    {submit && senderId.length == 0 ? <div className='text-danger error-message-required'>Sender.Id is required</div> : <></>}
                                </div>
                                <div className="col-md-6 login-input-group">
                                    <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <input type="text" autoComplete="off" onChange={(e) => setsmsType(e.target.value)} value={smsType} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-comment-sms"></i> Sms Type</label>
                                        <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                        <ul className="dropdown-menu w-100">
                                            <li><a className="dropdown-item" href="" onClick={()=>setsmsType("Implicit")}>Implicit</a></li>
                                            <li><a className="dropdown-item" href="" onClick={()=>setsmsType("Explicit")}>Explicit</a></li>
                                            <li><a className="dropdown-item" href="" onClick={()=>setsmsType("Promotional")}>Promotional</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-6 login-input-group">
                                    <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                    <input
                                        type="text"
                                        id="vendor-crt-input"
                                        className="vendor-crt-input"
                                        placeholder=" "
                                        required
                                        value={langName}
                                        // onClick={languageCodeDropdwon}
                                        autoComplete="off" onChange={(e) => setLangName(e.target.value)}
                                    />
                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                        <i className="fa-solid fa-language"></i> Template Language Code
                                    </label>
                                    <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                    <ul className="dropdown-menu template-dropdown w-100" >
                                    {filteredLangCodeDrop.length === 0 ? (
                                        <li className="dropdown-nodata-found">No data found</li>
                                    ) : (
                                        filteredLangCodeDrop.map((dropdownValue, id) => (
                                            <li key={id}>
                                                <a
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={() => {
                                                        setLaguageCode(dropdownValue?.language_code);
                                                        setLangName(dropdownValue?.language_name);
                                                    }}
                                                >
                                                    {dropdownValue?.language_name}
                                                </a>
                                            </li>
                                        )))}
                                    </ul>
                                </div>
                                </div>
                                <div className="col-md-12 login-input-group">
                                    <div className="edit-container sms-template-content">
                                        <textarea autoComplete="off" onChange={(e) => settemplateContent(e.target.value)} value={templateContent} id="vendor-crt-input-5 " className={`vendor-crt-input loginfilled-frame-username ${submit && !templateContent ? 'error' : ''}`} placeholder=" " required></textarea>
                                        <label htmlFor="vendor-crt-input-5" className="vendor-crt-label">
                                            <i className="fa-solid fa-text-width"></i> Template Content
                                        </label>
                                    </div>
                                    {submit && templateContent.length == 0 ? <div className='text-danger error-message-required'>Template content is required</div> : <></>}
                                    <p className="text-start" style={{ fontSize: "12px", color: "#555" }}>
                                        Template message content with (#var#) variables in it, which will be replaced by our (#var#) keyboard or normal text (#var#).
                                    </p>
                                </div>
                                <div className="col-md-6 login-input-group">
                                    <div className="edit-container">
                                        <input type="text" autoComplete="off" onChange={handlePhoneChange} value={testMobileNo} id="vendor-crt-input-6" className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required maxLength={20} />
                                        <label htmlFor="vendor-crt-input-6" className="vendor-crt-label">
                                            <i className="fa-solid fa-mobile-screen-button"></i> Enter Test Mobile Number
                                        </label>
                                    </div>
                                    <p className="text-start" style={{ fontSize: "12px", color: "#555" }}>
                                        (Comma-separated. Max 20 characters)
                                    </p>
                                </div>
                                <div className="text-end vendorcreate-modal-footer  border-0">
                                    <button type="button" className="btn btn-primary " onClick={handlecreateSms}>{urlValue==='edit-sms' ? 'Update Template':'Submit Template'}</button>
                                </div>

                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </main>

        </DashboardLayout>
    );

}

export default CreateSms;