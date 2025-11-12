import React ,{useEffect, useRef, useState} from "react";
import { Link, useNavigate} from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import './sms-campaigncreate.css';
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { isValid, parseISO, format } from 'date-fns';

interface GroupDrop {
    id: string;
    group_name: string;
 }
 interface LangCodeDrop {
    id: string;
    language_name: string;
    language_code: string;
}
 interface TemplateIdDrop {
    id: string;
    templateId: string;
}
 interface SenderIdDrop {
    id: string;
    senderId: string;
}
function CreatesmsPromotion() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleButtonClick = () => {
        fileInputRef.current?.click(); 
    };
    const [timeZoneId, settimeZoneId] = useState('70');
    const [timeZoneName, settimeZoneName] = useState('Asia/Kolkata');
    const [scheduleStatus, setscheduleStatus] = useState(false);
    const [scheduledAt, setscheduledAt] = useState('');
    const [timezoneDrop, setTimezoneDrop] = useState([]);
    const [submit, setSubmit] = useState(false);
    const [groupDropDown, setGroupDropDown] = useState<GroupDrop[]>([]);
    const [langCodeDrop, setlangCodeDrop] = useState<LangCodeDrop[]>([]);
    const [templateIdDrop, settemplateIdDrop] = useState<TemplateIdDrop[]>([]);
    const [senderIdDrop, setsenderIdDrop] = useState<SenderIdDrop[]>([]);
    const [groupName, setGroupName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [languageCode, setLaguageCode] = useState('')
    const [langName, setLangName] = useState('')
    const [smsType,setSmsType]=useState('')
    const[templateId,settemplateId]=useState("");
    const[tempId,settempId]=useState("");
    const[senderId,setsenderId]=useState("");
    const[templateContent,settemplateContent]=useState("");
    const[campaignName,setcampaignName]=useState("");
    const[testMobile,settestMobile]=useState("");
    
    const handlecreateSms = () => {
         setSubmit(true);
         if (!templateId || !groupName || !groupId || !senderId || !campaignName) {
            return;
         }
         const apiData = {
            templateId: templateId,
            groupDetails: {
                groupId: groupId,
                groupName: groupName
             },
            title: campaignName,
            bodycontent: templateContent,
            senderId: senderId,
            langauge: languageCode,
            scheduleStatus: scheduleStatus,
                ...(scheduleStatus ? {
                timezone: {
                    id: timeZoneId,
                    zoneName: timeZoneName
                },
                scheduledAt: isValid(parseISO(scheduledAt))
                    ? format(new Date(scheduledAt), "yyyy-MM-dd HH:mm:ss")
                    : ""
                } : {}),
                isVariable: false
         };
         const apiCall = VendorAPI.smscampaignCreate(apiData);
         apiCall
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  setSubmit(false);
                  toast.success(responseData.apiStatus.message);
                  navigate("/vendor/sms/campaign")
               } else {
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error: any) => {
               console.error("Error during login:", error);
               toast.error("An error occurred during login.");
            });
      };
    const handleGetGroupDrop = () => {
          VendorAPI.contactGroupDropdownAPI()
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                   setGroupDropDown(responseData?.result?.GroupDataDropDown);
                } else {
                   toast.error(responseData.apiStatus.message);
                }
             })
             .catch((error: any) => {
                console.error("Error during login:", error);
                toast.error("An error occurred during login.");
             });
    };
    const filteredGroupDrop = groupDropDown.filter((dropdownValue) =>
        (dropdownValue?.group_name || '').toLowerCase().includes((groupName || "").toLowerCase())
      );
  
    const handleGetSms = (smsId: any) => {
            VendorAPI.smstemplateGet(smsId)
               .then((responseData: any) => {
                  if (responseData.apiStatus.code === '200') {
                    const data=responseData?.result;
                    settemplateContent(data.templateContent);
                  } else {
                     toast.error(responseData.apiStatus.message);
                  }
               })
               .catch((error: any) => {
                  console.error("Error during login:", error);
                  toast.error("An error occurred during login.");
               });
         };
    
  const commontimezonseDropAPI = () => {
        VendorAPI.commontimezonseDropAPI()
           .then((responceData: any) => {
              if (responceData.apiStatus.code === '200') {
                 setTimezoneDrop(responceData?.result?.CountryData)
              }
           })
           .catch((error: any) => {
              console.error("Error during login:", error);
           });
     };
     //Timezone Dropdown Filter
     const filteredTimezoneDrop = timezoneDrop.filter((dropdownValue:any) =>
        (dropdownValue?.timezone_name || '').toLowerCase().includes((timeZoneName || '').toLowerCase())
      );
    const languageCodeDropdwon = () => {
        VendorAPI.languageCodeDropdown()
            .then((responceData: any) => {
                if (responceData.apiStatus.code === '200') {
                    setlangCodeDrop(responceData?.responseData || "")
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
    const smscampaignTempDrop = () => {
        VendorAPI.smscampaignTempDrop()
            .then((responceData: any) => {
                if (responceData.apiStatus.code === '200') {
                    settemplateIdDrop(responceData?.result || "")
                }
            })
            .catch((error: any) => {
                console.error("Error during login:", error);
            });
    };
    //Dropdown Filter
    const filteredTempDrop = templateIdDrop.filter((dropdownValue) =>
        (dropdownValue?.templateId || '').toLowerCase().includes((templateId || '').toLowerCase())
    );
    const smscampaignSenderDrop = () => {
        VendorAPI.smscampaignSenderDrop()
            .then((responceData: any) => {
                if (responceData.apiStatus.code === '200') {
                    setsenderIdDrop(responceData?.result || "")
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
    
    const [togglebox, Settogglebox] = useState(true);
    const [checkboxset, SetCheckBox] = useState(false);
        const OpenToggle = () => {
        SetCheckBox(true);
        setscheduleStatus(true)
        Settogglebox(false);
        if (togglebox === false) {
            Settogglebox(true);
            setscheduleStatus(false)
            SetCheckBox(false)
        }
        }
    useEffect(()=>{
        if(templateId){
            handleGetSms(tempId)
        }
    },[tempId])
    useEffect(()=>{
        handleGetGroupDrop();
        commontimezonseDropAPI();
        languageCodeDropdwon();
        smscampaignTempDrop();
        smscampaignSenderDrop();
    },[])
    return (
        <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                <TopNav />
                <div className="vendor-breadcrumbs container-fluid py-1">
                <div className="row">
                <div className="col-md-6">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                            <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                            <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Create New Campaign</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0 grayFont">Create <i className="fa-regular fa-message"></i> New Campaign</h6>
                    </nav>
                </div>
                <div className="col-md-6 text-end">
                        <button className="vendor-crt-btn" onClick={() => navigate('/vendor/sms/campaign')}><i className="fa-solid fa-chevron-left"></i> Back To Campaign</button>
                     </div>
                     </div>
                     </div>
                <div className="myprofile-maincontent container-fluid py-4">
                    <div className="row myprofile-content">
                        <div className="col-md-12">
                            <h5 className="text-start">Step 1</h5>

                            <div className="row">
                                <div className="col-md-6">
                                <div className="vendor-create-container login-input-group">
                                    <div className="edit-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                        <input
                                            type="text"
                                            id="vendor-crt-input"
                                            className="vendor-crt-input"
                                            placeholder=" "
                                            required
                                            style={submit && templateId.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                            value={templateId}
                                            // onClick={smscampaignTempDrop}
                                            autoComplete="off" onChange={(e) => settemplateId(e.target.value)}
                                        />
                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                        <i className="fa-solid fa-user"></i> Search Template Id
                                        </label>
                                        <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                        <ul className="dropdown-menu template-dropdown w-100" >
                                        {filteredTempDrop.length === 0 ? (
                                            <li className="dropdown-nodata-found">No data found</li>
                                        ) : (
                                            filteredTempDrop.map((dropdownValue, id) => (
                                                <li key={id}>
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => {
                                                            settemplateId(dropdownValue?.templateId);
                                                            settempId(dropdownValue?.id);
                                                        }}
                                                    >
                                                        {dropdownValue?.templateId}
                                                    </a>
                                                </li>
                                            )))}
                                        </ul>
                                    </div>
                                    {submit && templateId.length == 0 ? (
                                    <div className="text-danger error-message-required">Template id is required </div>
                                ) : (
                                    <></>
                                )}
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
                                        
                                    />
                                    <button className="media-upload-button" 
                                    type="button"
                                    onClick={handleButtonClick}>
                                    <i className="fa-solid fa-arrow-up-from-bracket"></i>
                                     Select</button>
                            </div>
                            </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                <div className="vendor-create-container login-input-group">
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
                                    {submit && senderId.length == 0 ? (
                                    <div className="text-danger error-message-required">Sender id is required </div>
                                ) : (
                                    <></>
                                )}
                                </div>
                                </div>
                                
                                
                            <div className="col-md-6 login-input-group">
                            <div className="vendor-create-container">
                                <p className="header">SMS Type</p>
                                <div className="promotionSMS-container">
                                <div className="promotionSMS">
                                    <input
                                    type="radio"
                                    id="implicit"
                                    name="smsType"
                                    value="Implicit"
                                    className="sms-radio"
                                    onClick={()=>setSmsType("Implicit")}
                                    required
                                    />
                                    <label htmlFor="implicit" className="sms-label">
                                    <div className="icon-text-wrapper">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                        width="23px" height="23px" viewBox="0 0 512.000000 512.000000"
                                        preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                        fill="#000000" stroke="none">
                                        <path d="M1384 5102 c-99 -35 -177 -111 -214 -208 -20 -55 -20 -60 -18 -2347
                                        l3 -2292 26 -55 c33 -70 95 -132 167 -167 l57 -28 1155 0 1155 0 57 28 c72 35
                                        134 97 167 167 l26 55 0 2305 0 2305 -26 55 c-33 70 -95 132 -167 167 l-57 28
                                        -1140 2 c-1068 2 -1143 1 -1191 -15z m2353 -178 c21 -17 46 -46 55 -65 17 -32
                                        18 -148 18 -1996 l0 -1963 -1250 0 -1250 0 0 1960 c0 2114 -3 1997 51 2047 62
                                        56 -14 53 1211 51 l1126 -3 39 -31z m-1098 -4313 c64 -46 83 -120 47 -189 -49
                                        -94 -202 -96 -250 -4 -30 59 -25 121 15 167 49 56 131 67 188 26z"/>
                                        <path d="M2163 4690 c-49 -20 -59 -96 -17 -129 26 -20 37 -21 414 -21 377 0
                                        388 1 414 21 32 25 35 75 7 110 l-19 24 -389 2 c-213 1 -398 -2 -410 -7z"/>
                                        <path d="M2392 3560 c-219 -58 -394 -216 -474 -432 -26 -70 -32 -101 -35 -198
                                        -6 -141 10 -219 69 -340 54 -110 177 -237 283 -292 206 -107 444 -107 650 0
                                        106 55 229 182 283 292 59 121 75 199 69 340 -3 96 -9 128 -34 196 -84 225
                                        -251 376 -480 435 -99 25 -233 25 -331 -1z m447 -456 c42 -53 35 -64 -163
                                        -263 -222 -222 -205 -217 -333 -87 -92 92 -100 115 -60 162 36 42 78 37 130
                                        -14 24 -23 47 -42 53 -42 5 0 70 61 144 135 124 125 138 135 172 135 28 0 42
                                        -6 57 -26z"/>
                                        </g>
                                        </svg>

                                        <span>Implicit</span>
                                    </div>
                                    </label>
                                </div>

                                <div className="promotionSMS">
                                    <input
                                    type="radio"
                                    id="explicit"
                                    name="smsType"
                                    value="Explicit"
                                    onClick={()=>setSmsType("Explicit")}
                                    className="sms-radio"
                                    />
                                    <label htmlFor="explicit" className="sms-label">
                                    <div className="icon-text-wrapper">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                        width="23px" height="23px" viewBox="0 0 512.000000 512.000000"
                                        preserveAspectRatio="xMidYMid meet">
                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                        fill="#000000" stroke="none">
                                        <path d="M1133 4776 c-103 -33 -194 -114 -241 -214 l-27 -57 0 -1945 0 -1945
                                        27 -57 c37 -80 107 -152 187 -191 l66 -32 900 0 900 0 65 31 c114 54 197 160
                                        220 283 6 33 10 340 10 807 l0 754 488 0 c425 0 490 2 510 16 l22 15 0 724 0
                                        724 -22 15 c-20 14 -85 16 -510 16 l-488 0 0 349 c0 193 -5 372 -10 402 -23
                                        123 -106 229 -220 283 l-65 31 -885 2 c-712 1 -893 -1 -927 -11z m507 -140 c0
                                        -8 12 -24 26 -35 26 -20 38 -21 375 -21 367 0 388 2 408 46 l11 24 217 0 c208
                                        0 220 -1 268 -24 28 -13 64 -39 82 -57 62 -66 63 -70 63 -479 l0 -370 -634 0
                                        -635 0 -20 -26 c-21 -26 -21 -34 -21 -729 0 -695 0 -703 21 -729 l20 -26 202
                                        0 202 0 90 -172 c110 -210 117 -218 160 -218 46 0 58 18 145 219 l75 171 198
                                        0 197 0 0 -777 c0 -875 4 -821 -77 -894 -81 -74 -29 -70 -983 -67 l-855 3 -41
                                        22 c-53 28 -107 91 -122 142 -17 55 -17 3787 0 3842 16 55 73 118 132 145 49
                                        23 61 24 274 24 186 0 222 -2 222 -14z m2480 -1671 l0 -615 -748 0 c-708 0
                                        -749 -1 -768 -18 -10 -10 -44 -75 -74 -145 -30 -70 -57 -127 -60 -127 -3 0
                                        -35 55 -70 123 -95 180 -73 167 -295 167 l-185 0 0 615 0 615 1100 0 1100 0 0
                                        -615z"/>
                                        <path d="M1659 902 c-15 -13 -22 -30 -22 -52 0 -22 7 -39 22 -52 22 -17 48
                                        -18 391 -18 l369 0 20 26 c27 35 26 59 -4 89 l-24 25 -364 0 c-340 0 -366 -1
                                        -388 -18z"/>
                                        <path d="M2279 3262 c-28 -23 -30 -73 -4 -102 18 -20 29 -20 752 -20 720 0
                                        733 0 753 20 27 27 25 66 -5 95 l-24 25 -724 0 c-689 0 -726 -1 -748 -18z"/>
                                        <path d="M2294 2800 c-11 -4 -27 -22 -34 -40 -12 -28 -11 -34 7 -58 l20 -27
                                        737 -3 c725 -2 736 -2 756 18 27 27 25 66 -5 95 l-24 25 -718 -1 c-395 0 -727
                                        -4 -739 -9z"/>
                                        </g>
                                        </svg>
                                        <span>Explicit</span>
                                    </div>
                                    </label>
                                </div>

                                <div className="promotionSMS">
                                    <input
                                    type="radio"
                                    id="promotional"
                                    name="smsType"
                                    value="Promotional"
                                    onClick={()=>setSmsType("Promotional")}
                                    className="sms-radio"
                                    />
                                    <label htmlFor="promotional" className="sms-label">
                                    <div className="icon-text-wrapper">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                        width="23px" height="23px" viewBox="0 0 512.000000 512.000000"
                                        preserveAspectRatio="xMidYMid meet">

                                        <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                        fill="#000000" stroke="none">
                                        <path d="M466 4949 c-62 -15 -153 -68 -197 -116 -22 -24 -55 -74 -72 -111
                                        l-32 -67 0 -2096 0 -2095 37 -76 c45 -91 103 -147 196 -191 l67 -32 1215 0
                                        1215 0 67 32 c93 44 151 100 196 191 l37 76 3 413 3 414 -30 29 c-37 38 -65
                                        38 -102 1 l-29 -29 0 -383 c0 -270 -4 -394 -12 -423 -16 -55 -99 -138 -154
                                        -154 -60 -17 -2328 -17 -2388 0 -55 16 -138 99 -154 154 -18 60 -18 4088 0
                                        4148 8 26 31 60 63 91 31 32 65 55 91 63 31 9 312 12 1166 12 1116 0 1124 0
                                        1146 20 40 38 37 93 -7 127 -20 15 -2262 17 -2325 2z"/>
                                        <path d="M3016 4868 c-21 -19 -33 -51 -62 -168 -47 -190 -99 -332 -189 -515
                                        -160 -326 -383 -610 -641 -815 -117 -93 -162 -122 -539 -340 -192 -111 -356
                                        -209 -362 -218 -7 -9 -13 -33 -13 -53 0 -35 -4 -40 -63 -75 -259 -157 -350
                                        -480 -210 -746 89 -169 264 -282 458 -295 102 -7 193 14 298 67 75 38 79 39
                                        103 24 17 -12 37 -15 64 -11 l41 5 236 -281 c129 -155 243 -288 251 -295 37
                                        -29 75 -14 307 121 242 139 266 160 248 211 -4 13 -113 149 -242 302 -216 258
                                        -232 279 -215 291 46 34 271 136 392 177 255 87 469 120 772 120 284 0 489
                                        -30 732 -104 53 -17 108 -30 123 -30 38 0 79 44 72 78 -3 15 -114 216 -247
                                        446 -214 373 -238 421 -223 430 51 28 136 125 169 192 92 185 60 395 -82 545
                                        -134 140 -340 185 -518 114 -37 -15 -69 -25 -70 -23 -1 1 -112 193 -246 425
                                        -239 414 -259 443 -305 443 -8 0 -25 -10 -39 -22z m654 -1268 c309 -536 585
                                        -1013 612 -1059 27 -46 47 -85 45 -87 -2 -3 -42 4 -88 15 -535 123 -1134 72
                                        -1602 -138 l-67 -30 -14 22 c-8 12 -114 198 -236 412 -122 215 -224 393 -226
                                        397 -2 3 42 42 98 86 142 110 246 208 355 336 224 262 415 606 513 924 19 61
                                        38 108 41 104 4 -4 260 -446 569 -982z m312 288 c67 -31 119 -82 155 -151 22
                                        -43 27 -65 27 -132 1 -66 -4 -90 -26 -137 -25 -55 -99 -138 -122 -138 -6 0
                                        -82 123 -168 273 l-157 272 27 14 c72 38 179 37 264 -1z m-1794 -1248 c128
                                        -222 231 -409 228 -415 -2 -5 -55 -39 -117 -74 -63 -36 -183 -105 -267 -154
                                        -96 -56 -157 -86 -163 -80 -19 19 -469 807 -466 817 4 13 530 316 542 312 5
                                        -1 114 -184 243 -406z m-694 -399 c108 -187 196 -342 196 -345 0 -12 -114 -67
                                        -171 -82 -175 -45 -370 48 -452 215 -30 62 -32 73 -32 171 0 93 3 112 27 162
                                        33 71 106 151 173 189 28 16 53 29 57 29 3 0 94 -153 202 -339z m1055 -523
                                        c105 -125 191 -230 191 -232 0 -5 -275 -166 -284 -166 -7 0 -419 491 -414 495
                                        1 2 66 40 143 84 132 76 140 80 156 63 9 -9 102 -119 208 -244z"/>
                                        <path d="M4078 4674 c-19 -10 -31 -28 -39 -57 -48 -180 -79 -306 -79 -328 0
                                        -34 39 -69 77 -69 58 0 70 21 118 208 25 96 45 180 45 189 0 21 -55 73 -77 73
                                        -10 -1 -30 -7 -45 -16z"/>
                                        <path d="M640 4627 c-49 -16 -133 -102 -148 -153 -18 -60 -18 -3768 0 -3828
                                        16 -55 99 -138 154 -154 31 -9 284 -12 1036 -12 1128 0 1055 -5 1131 80 24 26
                                        49 66 55 88 8 24 12 113 12 234 0 182 -1 197 -21 222 -16 20 -29 26 -59 26
                                        -30 0 -43 -6 -59 -26 -20 -25 -21 -40 -21 -221 0 -193 0 -194 -25 -218 l-24
                                        -25 -991 0 -991 0 -24 25 -25 24 0 1871 0 1871 25 24 c23 24 29 25 160 25
                                        l135 0 0 -56 c0 -31 5 -75 12 -98 16 -55 99 -138 154 -154 30 -9 198 -12 636
                                        -12 680 0 657 -2 731 80 49 55 67 103 67 184 l0 56 65 0 c57 0 69 3 90 25 33
                                        32 33 78 0 110 -23 24 -30 25 -145 25 -115 0 -122 -1 -145 -25 -24 -23 -25
                                        -31 -25 -135 0 -104 -1 -112 -25 -135 l-24 -25 -591 0 -591 0 -24 25 c-24 23
                                        -25 31 -25 135 0 104 -1 112 -25 135 -24 25 -25 25 -222 24 -113 -1 -213 -6
                                        -233 -12z"/>
                                        <path d="M4580 4115 c-148 -85 -190 -120 -190 -156 0 -28 53 -79 82 -79 27 0
                                        314 162 341 192 40 46 1 129 -60 127 -16 0 -89 -36 -173 -84z"/>
                                        <path d="M4502 3483 c-21 -8 -43 -61 -36 -87 3 -14 14 -32 24 -41 26 -24 347
                                        -107 386 -100 48 8 69 40 65 96 -3 37 -30 49 -203 94 -171 43 -208 49 -236 38z"/>
                                        <path d="M3061 2124 c-20 -25 -21 -39 -21 -261 l0 -234 25 -24 c32 -33 78 -33
                                        110 0 l25 24 0 234 c0 222 -1 236 -21 261 -16 20 -29 26 -59 26 -30 0 -43 -6
                                        -59 -26z"/>
                                        </g>
                                        </svg><span>Promotional</span>
                                    </div>
                                    </label>
                                </div>
                                </div>
                            </div>
                            </div>

                           
                                <div className="col-md-6 login-input-group">
                                    <div className="edit-container">
                                        <input type="text" autoComplete="off" onChange={(e)=>setcampaignName(e.target.value)} value={campaignName} id="vendor-crt-input-1" className={`vendor-crt-input loginfilled-frame-username ${submit && !campaignName ? 'error' : ''}`} placeholder=" " required/>
                                        <label htmlFor="vendor-crt-input-1" className="vendor-crt-label">
                                            <i className="fa-solid fa-user"></i> Campaigns Name
                                        </label>
                                    </div>
                                    {submit && campaignName.length == 0 ? <div className='text-danger error-message-required'>Campaign name is required</div> : <></>}
                                </div>
                           
                                
                                <div className="col-md-6">
                                <div className="vendor-create-container login-input-group">
                                    <div className="edit-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
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
                                            <i className="fa-solid fa-language"></i> Language Code
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
                                </div>
                            <div className="col-md-6 login-input-group">
                            <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                <input type="text" id="vendor-crt-input" 
                                // onClick={handleGetGroupDrop} 
                                value={groupName}
                                autoComplete="off" onChange={(e)=>setGroupName(e.target.value)}
                                className={`vendor-crt-input loginfilled-frame-username ${submit && !groupName ? 'error' : ''}`}
                                placeholder=" " required />
                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Select Contacts Group</label>
                                <i
                                className={"dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"}
                                ></i>
                                <ul className="dropdown-menu template-dropdown w-100">
                                {filteredGroupDrop.length === 0 ? (
                                <li className="dropdown-nodata-found">No data found</li>
                                ) : (
                                filteredGroupDrop.map((dropdownValue, id) => (
                                    <li key={id}>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => { setGroupId(dropdownValue?.id); setGroupName(dropdownValue?.group_name) }}
                                        >
                                            {dropdownValue?.group_name}
                                        </a>
                                    </li>
                                )))}
                                </ul>
                            </div>
                            {submit && groupName.length == 0 ? <div className='text-danger error-message-required'>Group is required</div> : <></>}
                            
                        </div>
                        <div className="col-md-6 login-input-group">
                        <div className="mb-4 mt-n1 text-start campaign-template border" style={{background:"transparent"}}>
                            <h6 className="campaign-temp-head">Schedule</h6>
                            <div className="text-start pt-2 pb-2 form-check form-switch ms-1 is-filled">
                            <input className="form-check-input campaign-create-inputstatus" type="checkbox" id="flexSwitchCheckDefault" checked={togglebox} onChange={OpenToggle} />
                            <span>Now</span>
                            </div>
                            {checkboxset && (
                            <>
                                <div className="vendor-create-container dropdown mt-4" data-bs-toggle="dropdown" aria-expanded="false">
                                    <input type="text" id="vendor-crt-input" 
                                    value={timeZoneName}
                                    // onClick={commontimezonseDropAPI} 
                                    autoComplete="off" onChange={(e)=>settimeZoneName(e.target.value)}
                                    className="vendor-crt-input" placeholder=" " required />
                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label">Select your Timezone</label>
                                    <i
                                        className={"dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"}
                                    ></i>
                                    <ul className="dropdown-menu template-dropdown w-100">
                                    {filteredTimezoneDrop.length === 0 ? (
                                        <li className="dropdown-nodata-found">No data found</li>
                                        ) : (
                                        filteredTimezoneDrop.map((dropdownValue:any) => ( 
                                        <li>
                                        <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => { settimeZoneId(dropdownValue?.id); settimeZoneName(dropdownValue?.timezone_name) }}
                                        >
                                            {dropdownValue?.timezone_name}
                                        </a>
                                        </li>
                                    )))}
                                    </ul>
                                </div>
                                <div className="vendor-create-container mt-4">
                                    <input type="datetime-local" id="vendor-crt-input" onChange={(e) => setscheduledAt(e.target.value)} value={scheduledAt} className="vendor-crt-input" placeholder=" " required />
                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label">Schedule At</label>
                                </div>
                                
                            </>
                            )}

                        </div>
                        </div>
                                <div className="col-md-12 login-input-group">
                                    <div className="edit-container sms-template-content">
                                        <textarea id="vendor-crt-input-5 " onChange={(e)=>settemplateContent(e.target.value)} value={templateContent} className="vendor-crt-input" placeholder=" " required></textarea>
                                        <label htmlFor="vendor-crt-input-5" className="vendor-crt-label">
                                            <i className="fa-solid fa-text-width"></i>Approved Template Content
                                        </label>
                                    </div>
                                    <p className="text-start" style={{ fontSize: "12px", color: "#555" }}>
                                        Approved Template Message Content with (#Var#) variable in it which will be replace by our (#var#) Keywords or normal Text (#var#)
                                    </p>
                                </div>
                                <div className="col-md-6 login-input-group">
                                    <div className="edit-container">
                                        <input type="text" id="vendor-crt-input-6" onChange={(e)=>settestMobile(e.target.value)} className="vendor-crt-input" placeholder=" " required maxLength={20} />
                                        <label htmlFor="vendor-crt-input-6" className="vendor-crt-label">
                                            <i className="fa-solid fa-mobile-screen-button"></i> Enter Test Mobile Number
                                        </label>
                                    </div>
                                    <p className="text-start" style={{ fontSize: "12px", color: "#555" }}>
                                        (Comma-separated. Max 20 characters)
                                    </p>
                                </div>
                                <div className="text-end vendorcreate-modal-footer border-0">
                                    <button type="button" className="btn btn-primary" onClick={handlecreateSms}>Send test message</button>
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

export default CreatesmsPromotion;