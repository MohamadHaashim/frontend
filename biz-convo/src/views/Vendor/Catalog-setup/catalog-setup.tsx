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
  
function Catalog_Settings() {
    const [phoneInfo, setPhoneInfo] = useState<any[]>([]);
    const [displayPhone, setdisplayPhone] = useState<any[]>([]);
    const [health, setHealth] = useState<any>({});
    const [healthId, setHealthId] = useState<any>({});
    const [entities, setentities] = useState<any[]>([]);
    const [scopes, setscopes] = useState<any[]>([]);
    const [tokenInfo, settokenInfo] = useState<any>({});
    const [showdata, SetShowData] = useState(false);
    const [subscription, setSubscription] = useState(false);
    const [webhook, setWebhook] = useState(false);
    const [whatsappInte, setWhatsappInte] = useState(false);
    const [testContactInte, settestContactInte] = useState(false);
    const [quickHelp, setQuickhelp] = useState(false);
    const [integrationsubmit, setintegrationSubmit] = useState(false);
    const [showbutton, SetShowButton] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [submit1, setSubmit1] = useState(false);
    const [submit2, setSubmit2] = useState(false);
    const [submit3, setSubmit3] = useState(false);
    const [showbutton1, SetShowButton1] = useState(false);
    const [showbutton2, SetShowButton2] = useState(false);
    const [showbutton3, SetShowButton3] = useState(false);
    const [showbuttons, SetShowButtons] = useState(false);
    const [address, setaddress] = useState("");
    const [vertical, setvertical] = useState("");
    const [description, setdescription] = useState("");
    const [indusType, setindusType] = useState<any[]>([]);
    const [about, setabout] = useState("");
    const [email, setemail] = useState("");
    const [website, setwebsite] = useState<string[]>([]);
    const [profilePic, setprofilePic] = useState("");
    const [appId, setappId] = useState("");
    const [testContact, settestContact] = useState("");
    const [appSecreteId, setappSecreteId] = useState("");
    const [bussinessId, setbussinessId] = useState("");
    const [phonenoId, setphonenoId] = useState("");
    const [phoneno, setphoneno] = useState("");
    const [accesstoken, setaccesstoken] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [imgValue, setImgValue] = useState("")
    const [imgid, setImgid] = useState("");
    const [healthError, sethealthError] = useState("");
    const [tokeninfoError, settokeninfoError] = useState("");
    const [phonenoError, setphonenoError] = useState("");
    const [fileName, setFileName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileupdLoading, setprofileupdLoading] = useState(false);
    const loginasSadmin=sessionStorage.getItem("loginAs");
    const wabacatalogAccesstoken=sessionStorage.getItem("wabacatalogAccesstoken");
    const [catalogDropList, setcatalogDropList] = useState<any>([]);
    const [catalogDltDropList, setcatalogDltDropList] = useState<any>([]);
    const [catalogId, setcatalogId] = useState("");
    const [bizId, setbizId] = useState("");
    const [bizName, setbizName] = useState("");
    const [catalogId1, setcatalogId1] = useState("");
    const [catalogName, setcatalogName] = useState("");
    const [catalogName1, setcatalogName1] = useState("");
    const [catalogConfig, setcatalogConfig] = useState(false);
    const [catalogBizConfig, setcatalogBizConfig] = useState(false);
    const [showdata1, SetShowData1] = useState(false);
    const [showdata2, SetShowData2] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const [isLoading4, setIsLoading4] = useState(false);
    const [testsubmit, settestSubmit] = useState(false);
    const navigate=useNavigate();
    
    const ShowTernary = () => {
        if (showdata === true) {
            SetShowData(false)
        }
        else {
            SetShowData(true);
        }
        if(showbutton===true){
            SetShowButton(false);
        }
    };
    const ShowTernary1 = () => {
        if (showdata1 === true) {
            SetShowData1(false)
            SetShowButton2(false);
            setSubmit2(false);
        }
        else {
            SetShowData1(true);
        }
        if(showbutton1===true){
            SetShowButton2(false);
            setSubmit2(false);
        }
    };
    const ShowTernary2 = () => {
        if (showdata2 === true) {
            SetShowData2(false)
            SetShowButton3(false);
            setSubmit1(false);
        }
        else {
            SetShowData2(true);
        }
        if(showbutton3===true){
            SetShowButton3(false);
            setSubmit1(false);
        }
    };
    const QuickHelp = () => {
        if (quickHelp === true) {
            setQuickhelp(false)
        }
        else {
            setQuickhelp(true);
        }
    };
    const ShowButtonData = () => {
        SetShowButton(true);
    }
    const ShowButtonData1 = () => {
        
        if(showbutton1===true){
            SetShowButton1(false)
            SetShowButton(false);
        }else{
            SetShowButton1(true);
        }
       
    }
    const ShowButtonData2 = () => {
        
        if(showbutton2===true){
            SetShowButton2(false)
        }else{
            SetShowButton2(true);
        }
       
    }
    const ShowButtonData3 = () => {
        if(showbutton3===true){
            SetShowButton3(false)
        }else{
            SetShowButton3(true);
        }
       
    }
    const ShowButtonDatas = () => {
        SetShowButtons(true);
        if(showbuttons===true){
            SetShowButtons(false);
        }
    }
    //Facebook Config
    const handleSubscription = () => {
          setSubmit(true);
          if (!appId || !appSecreteId ) {
             return;
          }
          setIsLoading(true);
          const apiData = {
            appId: appId,
            appSecret: appSecreteId,
          };
          const apiCall =  VendorAPI.catalogwhatsappSubscription(apiData);
          apiCall
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                     handlewhatsappwebhookList();
                    // setSubscription(true)
                    setSubmit(false);
                    SetShowData(false)
                    setIsLoading(false);
                   toast.success(responseData.apiStatus.message);
                   setappId("");
                   setappSecreteId("");
                } else {
                   toast.error(responseData.apiStatus.message);
                   setIsLoading(false);
                }
             })
             .catch((error: any) => {
                console.error("Error during subscription:", error);
                setIsLoading(false);
                toast.error("An error occurred while subscription.");
             });
    };
    //Test contact Config
    const handleTestContact = () => {
          setSubmit(true);
          if (!testContact) {
             return;
          }
          const apiData = {test_contact: testContact};
          const apiCall =  VendorAPI.whatsapptestContact(apiData);
          apiCall
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setSubmit(false);
                    SetShowButtons(false);
                    settestContactInte(true);
                    toast.success(responseData.apiStatus.message);
                    settestContact("");
                    handlewhatsappwebhookList()
                } else {
                   toast.error(responseData.apiStatus.message);
                }
             })
             .catch((error: any) => {
                console.error("Error during test contact.:", error);
                toast.error("An error occurred while processing test contact.");
             });
    };
    //Phone.No Config
        const handlewhatsappaddPhoneno = () => {
              setSubmit(true);
              if (!phoneno) {
                 return;
              }
              const apiData = {phone_no_id: phonenoId,display_phone_no:phoneno};
              const apiCall =  VendorAPI.catalogwhatsappaddPhoneno(apiData);
              apiCall
                 .then((responseData: any) => {
                    if (responseData.apiStatus.code === '200') {
                        setSubmit(false);
                        handlewhatsappsetupList();
                        toast.success(responseData.apiStatus.message);
                    } else {
                       toast.error(responseData.apiStatus.message);
                    }
                 })
                 .catch((error: any) => {
                    console.error("Error during add the phone number.:", error);
                    toast.error("An error occurred while adding the phone number.");
                 });
        };
//Whatsapp Config
const [isLoading1, setIsLoading1] = useState(false);
    const handleSetup = () => {
          setintegrationSubmit(true);
          if (!bussinessId || !accesstoken ) {
             return;
          }
          sessionStorage.setItem("wabacatalogAccesstoken",accesstoken)
          setIsLoading1(true);
          const apiData = {
            // phone_number_id:phonenoId,
            wa_business_acc_id: bussinessId,
            access_token: accesstoken.trim(),
          };
          const apiCall =  VendorAPI.catalogwhatsappIntegrationSet(apiData);
          apiCall
             .then((responseData: any) => {
                if (responseData.apiStatus.code === "200") {
                    setphonenoError("")
                    handleHealthy();
                    handlewhatsappwebhookList();
                    handlewhatsappsetupList();
                    handlewhatsapptokenInfo();
                    setWhatsappInte(true)
                    setintegrationSubmit(false);
                    SetShowButton1(false);
                    setIsLoading1(false);
                    setPhoneInfo(responseData.responseData)
                    setdisplayPhone(responseData.responseData);
                   setbussinessId("");
                   setaccesstoken("");
                   setphonenoId("");
                } else {
                   toast.error(responseData.apiStatus.message);
                   setIsLoading1(false);
                }
             })
             .catch((error: any) => {
                console.error("Error during WhatsApp integration setup:", error);
                setIsLoading1(false);
                toast.error("An error occurred during WhatsApp integration setup.");
             });
       };
    //Over Health
    const handleHealthy = () => {
          const apiData = {
            wa_business_acc_id: bussinessId,
            access_token: accesstoken,
          };
          const apiCall =  VendorAPI.catalogwhatsappHealthy(apiData);
          apiCall
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    sethealthError("")
                    setWhatsappInte(true)
                    setintegrationSubmit(false);
                    SetShowButton1(false);
                    setHealth(responseData?.responseData?.health_status)
                    setHealthId(responseData?.responseData)
                    setentities(responseData?.responseData?.health_status?.entities)
                } else {
                   toast.error(responseData.apiStatus.message);
                }
             })
             .catch((error: any) => {
                console.error("Error during during health check:", error);
                toast.error("An error occurred during during health check.");
             });
    };
     const formatPhoneNumber = (raw: string) => {
        if (!raw || typeof raw !== 'string') return '';
        return raw.startsWith('+')
            ? raw
            : raw.length === 11 && raw.startsWith('1')
                ? `+${raw[0]} ${raw.slice(1, 4)} ${raw.slice(4, 7)} ${raw.slice(7)}`
                : raw;
    };
    //PhoneNumber List
    const handlewhatsappsetupList = () => {
        setLoading(true)
          const apiCall =  VendorAPI.catalogwhatsappsetupList();
          apiCall
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setphonenoError("")
                    setintegrationSubmit(false);
                    setLoading(false);
                    SetShowButton1(false);
                    setPhoneInfo(responseData.responseData)
                    setdisplayPhone(responseData.responseData);
                    const verifiedPhone = responseData.responseData.find((item: any) => item.config_status === true);
                    setphonenoId(verifiedPhone?.id)
                    if (verifiedPhone?.display_phone_number) {
                        const formattedPhone = formatPhoneNumber(verifiedPhone.display_phone_number);
                        setphoneno(formattedPhone);
                    }
                } else {
                    setLoading(false)
                //    toast.error(responseData.apiStatus.message);
                setphonenoError(responseData.apiStatus.message);
                }
             })
             .catch((error: any) => {
                setLoading(false)
                console.error("Error while fetching WhatsApp setup list:", error);
                toast.error("An error occurred while fetching WhatsApp setup list.");
             });
    };
    //configList
    const handlewhatsappwebhookList = () => {
        const apiCall =  VendorAPI.catalogwhatsappwebhookList();
        apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                setSubscription(responseData?.responseData.webhook_configured)
                setWebhook(responseData?.responseData.whatsapp_configured)
                setWhatsappInte(responseData?.responseData.whatsapp_configured)
                settestContactInte(responseData?.responseData?.test_contact); 
                settestContact(responseData?.responseData?.test_contact || ''); 
            } else {
                toast.error(responseData.apiStatus.message);
            }
            })
            .catch((error: any) => {
            console.error("Error while fetching WhatsApp webhook list:", error);
            toast.error("An error occurred while fetching WhatsApp webhook list.");
            });
        };
    //health List
    const handlewhatsapphealthList = () => {
        const apiCall =  VendorAPI.catalogwhatsapphealthList();
        apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                    setintegrationSubmit(false);
                    SetShowButton1(false);
                    setHealth(responseData?.responseData?.health_status)
                    setHealthId(responseData?.responseData)
                    sethealthError("")
                    setentities(responseData?.responseData?.health_status?.entities || [])
            } else {
                // toast.error(responseData.apiStatus.message);
                sethealthError(responseData.apiStatus.message);
            }
            })
            .catch((error: any) => {
            console.error("Error while fetching WhatsApp health data:", error);
            toast.error("An error occurred while fetching WhatsApp health data.");
            });
        };
    //token Info    
    const handlewhatsapptokenInfo = () => {
        const apiCall =  VendorAPI.catalogwhatsapptokenInfo();
        apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                settokenInfo(responseData?.responseData);
                settokeninfoError("");
                setscopes(responseData?.responseData?.scopes || [])  
            } else {
                toast.error(responseData.apiStatus.message);
                settokeninfoError(responseData.apiStatus.message);
            }
            })
            .catch((error: any) => {
            console.error("Errorwhile fetching WhatsApp token info:", error);
            toast.error("An error occurredwhile fetching WhatsApp token info.");
            });
        };
    //Bussiness info    
    const handlewhatsappbussinessInfo = () => {
        setprofileupdLoading(true)
        const apiCall =  VendorAPI.catalogwhatsappbussinessInfo();
        apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                setprofileupdLoading(false)
                setaddress(responseData?.responseData[0]?.address);
                setabout(responseData?.responseData[0]?.about);
                setdescription(responseData?.responseData[0]?.description);
                setemail(responseData?.responseData[0]?.email);
                setvertical(responseData?.responseData[0]?.vertical);
                setprofilePic(responseData?.responseData[0]?.profile_picture_url);
                setwebsite(responseData?.responseData[0]?.websites || []);
                // const modalElement = document.getElementById('vendorview');
                // if (modalElement) {
                // const modal = new window.bootstrap.Modal(modalElement);
                // modal.show();
                // }
            } else {
                setprofileupdLoading(false)
                toast.error(responseData.apiStatus.message);
            }
            })
            .catch((error: any) => {
                setprofileupdLoading(false)
            console.error("Error while fetching WhatsApp business info:", error);
            toast.error("An error occurred while fetching WhatsApp business info");
            });
        };
        const resetForm=()=>{
            setFileName("")
        }
    //IndustryDrop
        const handleIndustryDrop = () => {
            VendorAPI.catalogwhatsappIndustryDrop()
                .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setindusType(responseData.responseData);
                } else {
                    toast.error(responseData.apiStatus.message);
                }
                })
                .catch((error: any) => {
                
                console.error("Error while fetching industry types:", error);
                toast.error("An error occurred while fetching industry types.");
                });
        };
    //Bussiness Info Profile Update
    const handlewhaprofileUpdate = () => {
        const apiData = {
            about: about,
            address: address,
            description: description,
            vertical: vertical,
            email: email,
            websites:website,
            ...(imgValue && { profile_picture_handle: imgValue }) 
        };
        const apiCall =  VendorAPI.catalogwhatsappbussinessProfileUpdate(apiData);
        apiCall
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                  const closeButton = document.getElementById("whaprofileUpdateClose");
                if (closeButton) {
                   closeButton.click();
                }
                resetForm();
                 toast.success(responseData.apiStatus.message);
              } else {
                 toast.error(responseData.apiStatus.message);
              }
           })
           .catch((error: any) => {
              console.error("Error during profile update:", error);
              toast.error("An error occurred during profile update.");
           });
  };
  //Profile Img Upload
      const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFile = event.target.files?.[0];
  
          if (selectedFile) {
              const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
              if (!validTypes.includes(selectedFile.type)) {
                  toast.error("Only JPG, JPEG, and PNG files are allowed.");
                  return;
              }
              if (file && selectedFile.name === file.name && selectedFile.size === file.size && selectedFile.lastModified === file.lastModified) {
                  console.log("Same file selected, skipping upload.");
              } else {
                  setFile(selectedFile);
                  setFileName(selectedFile.name);
                  handleImgUpload(selectedFile);
              }
              const imagePreviewUrl = URL.createObjectURL(selectedFile);
              setprofilePic(imagePreviewUrl);
          }
      };
      
      const handleImgUpload = async (file: File) => {
          if (!file) {
              toast.error("Please select a file to import.");
              return;
          }
          const formData = new FormData();
          formData.append("media_file", file);
          try {
              const response = await VendorAPI.catalogwhatsappImgUploadAPI(formData);
              if (response?.apiStatus?.code==="200") {
                  setImgValue(response?.responseData?.h)
                  setImgid(response?.responseData?.id)
                  toast.success(response?.apiStatus?.message);
              } else {
                  toast.error(response.apiStatus?.message);
              }
          } catch (error) {
              console.error("Import Error:", error);
              toast.error("An error occurred while importing the file.");
          }
      };
    const handlewhatsappwebhookUnsub = () => {
        const apiCall =  VendorAPI.catalogwhatsappwebhookUnsub();
        apiCall
            .then((responseData: any) => {
            if (responseData.apiStatus.code === "200") {
                handlewhatsappsetupList()
                handlewhatsappwebhookList()
                handlewhatsapphealthList()
            } else {
            }
            })
            .catch((error: any) => {
            console.error("Error during unsubscribing:", error);
            toast.error("An error occurred while unsubscribing.");
            });
        };
        const formatDate = (unixTimestamp:any) => {
            if (!unixTimestamp) return "N/A";
            
            const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
        
            const dayOfWeek = days[date.getUTCDay()];
            const day = date.getUTCDate();
            const month = months[date.getUTCMonth()];
            const year = date.getUTCFullYear();
        
            // Adding suffix for day (st, nd, rd, th)
            const suffix = (day === 1 || day === 21 || day === 31) ? "st"
                : (day === 2 || day === 22) ? "nd"
                : (day === 3 || day === 23) ? "rd"
                : "th";
        
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            const seconds = date.getUTCSeconds().toString().padStart(2, "0");
        
            const ampm = hours >= 12 ? "pm" : "am";
            const formattedHours = hours % 12 || 12; // Adjust for 12-hour format
        
            return `${dayOfWeek} ${day}${suffix} ${month} ${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
        };
        const handlecatalogListAPI = () => {
        const apiData = {};
        VendorAPI.catalogListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                    setLoading(false)
                    setcatalogDropList(responseData.responseData.catalogData)
                } else if(responseData?.apiStatus?.code==="404") {
                    setcatalogDropList([]);
                    
                }
            })
            .catch((error: any) => {
                console.error("Error while fetching catalog list:", error);
                toast.error("An error occurred while fetching catalog list.");
            });
    }
    const handleloglistLinked = () => {
            VendorAPI.cataloglistLinkedAPI()
                .then((responseData: any) => {
                    if (responseData.apiStatus.code === '200') {
                     setcatalogDltDropList(responseData?.responseData?.linkedCatalog)
                     setcatalogConfig(responseData?.responseData?.linkedCatalog[0]?.id);
                     setcatalogId1(responseData?.responseData?.linkedCatalog[0]?.id);
                     setcatalogId(responseData?.responseData?.linkedCatalog[0]?.id);
                     setcatalogName(responseData?.responseData?.linkedCatalog[0]?.name);
                     setcatalogName1(responseData?.responseData?.linkedCatalog[0]?.name);
                    } else if(responseData.apiStatus.code==="404"){
                        setcatalogDltDropList([]);
                        setcatalogConfig(false);
                        setcatalogName("");
                        setcatalogName1("");
                        setcatalogId("");
                        setcatalogId1("");
                    }
                })
                .catch((error: any) => {
                    setLoading(false)
                    console.error("Error while fetching linked catalogs:", error);
                    toast.error("An error occurred while fetching linked catalogs.");
                });
        };
    const handlelogBizinfo = () => {
            VendorAPI.catalogBizInfoAPI()
                .then((responseData: any) => {
                    if (responseData.apiStatus.code === '200') {
                     setcatalogBizConfig(responseData?.responseData[0]?.id);
                     setbizId(responseData?.responseData[0]?.id);
                     setbizName(responseData?.responseData[0]?.name);
                    } else if(responseData.apiStatus.code==="404"){
                        setcatalogBizConfig(false);
                        setbizId("");
                        setbizName("");
                    }
                })
                .catch((error: any) => {
                    setLoading(false)
                    console.error("Error while fetching business info:", error);
                    toast.error("An error occurred while fetching business info.");
                });
        };
    const handlecatalogLink = () => {
        setSubmit2(true);
        setIsLoading2(true);
        if(catalogConfig){
            setIsLoading2(false);
            toast.warn("Delete the existing catalog link before update");
            return;
        }
        if (!catalogId) {
           return;
        }
        const apiData = {
            catalog_id: catalogId,
        };
        const apiCall= VendorAPI.catalogLinkAPI(apiData);
        apiCall
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                 setSubmit2(false);
                 setIsLoading2(false);
                 SetShowData1(false)
                 SetShowButton2(false);
                 toast.success(responseData.apiStatus.message);
                 handleloglistLinked();
              } else {
                 toast.error(responseData.apiStatus.message);
                 setIsLoading2(false);
              }
           })
           .catch((error: any) => {
              console.error("Error while linking the catalog:", error);
              setIsLoading2(false);
              toast.error("An error occurred while linking the catalog.");
           });
     };
    const handlebizIdLink = () => {
        setSubmit1(true);
        setIsLoading3(true);
        if (!bizId) {
           return;
        }
        const apiData = {
            business_id: bizId,
        };
        const apiCall= VendorAPI.catalogLinkBizIdAPI(apiData);
        apiCall
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                 setSubmit1(false);
                 setIsLoading3(false);
                 SetShowData2(false)
                 SetShowButton3(false);
                 toast.success(responseData.apiStatus.message);
                 handlelogBizinfo();
              } else {
                 toast.error(responseData.apiStatus.message);
                 setIsLoading3(false);
              }
           })
           .catch((error: any) => {
              console.error("Error while linking the Business ID:", error);
              setIsLoading3(false);
              toast.error("An error occurred while linking the Business ID.");
           });
     };
    const handlecatalogUnlink = () => {
        setSubmit3(true);
        setIsLoading4(true);
        if (!catalogId1) {
           return;
        }
        const apiData = {
            catalog_id: catalogId1,
        };
        const apiCall= VendorAPI.catalogDeleteAPI(apiData);
        apiCall
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                 setSubmit3(false);
                 setIsLoading4(false);
                 SetShowData(false);
                 SetShowButtons(false)
                 toast.success(responseData.apiStatus.message);
                 handleloglistLinked();
              } else {
                 toast.error(responseData.apiStatus.message);
                 setIsLoading4(false);

              }
           })
           .catch((error: any) => {
              setIsLoading4(false);
              console.error("Error while unlinking the catalog:", error);
              toast.error("An error occurred while unlinking the catalog.");
           });
     };
    useEffect(()=>{
        // handlesmsSetupConfig();
        handlecatalogListAPI();
        handleloglistLinked();
        handlelogBizinfo();
    },[])
       useEffect(()=>{
        handlewhatsappsetupList()
        handlewhatsapphealthList()
        handlewhatsapptokenInfo()
        handlewhatsappwebhookList()
       },[])
        useEffect(() => {
        let apiWebsites = website || [];
        if (apiWebsites.length < 2) {
            apiWebsites = [
            ...apiWebsites,
            ...Array(2 - apiWebsites.length).fill(""),
            ];
        }
        setwebsite(apiWebsites);
        }, [website]);
    return (
        <>
            <DashboardLayout>
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                    <TopNav />
                    <div className="container-fluid py-1">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                <li className="breadcrumb-item text-sm active text-dark grayFont" aria-current="page">Settings</li>
                            </ol>
                            <h6 className="font-weight-bolder text-start mb-0 grayFont">Catalog Settings</h6>
                        </nav>
                    </div>

                    <div className="dashboard-maincontent container-fluid py-4">
                        <div className="card p-3">
                            <h4 className="grayFont">Catalog API Setup</h4>
                            <div className="row">
                            {loading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                    <FadeLoader color="#36d7b7" />
                                </div>
                                 ) : (
                                <> 
                                <div className="col-md-7">
                                    <div className="campaign-template border shadow-lg">
                                        <h6 className="campaign-temp-head">Connect WhatsApp Manually</h6>
                                        <div className="campaign-template border mt-5  shadow-lg mb-5 ">
                                            <h6 onClick={ShowTernary} className="campaign-temp-head">Facebook Developer Account & Facebook App <span className="setting-whatsapp-ternary" >Click to expand/collapse</span></h6>
                                            <div className={`campaign-content-wrapper ${showdata ? 'show' : ''}`}>
                                            {showdata && (
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-8">
                                                            To get started you should have Facebook App, you mostly need to select Business as type of your app.
                                                        </div>
                                                        <div className="col-md-4 text-center" onClick={() => window.open("https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#set-up-developer-assets", "_blank")}>
                                                            <h6 className="text-sm cursor-pointer">Help & More Information <i className="fa-solid fa-arrow-up-right-from-square"></i></h6>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button className="mt-3 whatapp-button-settings"onClick={() => window.open("https://developers.facebook.com/apps/", "_blank")}>Create or Select Facebook App <i className="fa-solid fa-arrow-up-right-from-square"></i></button>
                                                    </div>
                                                    <div className="mt-3 mb-3">
                                                        Once you have the Facebook app, add your App ID below, you will find it in App Settings <i className="fa-solid fa-angle-right"></i> Basic
                                                    </div>
                                                    <div className="mb-3">
                                                        {showbutton === true ?
                                                            ""
                                                            :
                                                            <p onClick={ShowButtonData} className="whatsapp-tem-setting-btn">Click Here To Update</p>}
                                                        <div className={`campaign-clickbtn-wrapper ${showbutton ? 'show' : ''}`}>
                                                        {showbutton && (
                                                            <>
                                                                <div className="mt-2">
                                                                    <div className="vendor-create-container">
                                                                        <input type="text" id="vendor-crt-input" 
                                                                        autoComplete="off" onChange={(e) => setappId(e.target.value)} value={appId}
                                                                        className={`vendor-crt-input loginfilled-frame-username ${submit && !appId ? 'error' : ''}`}
                                                                        placeholder=" " required />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Facebook App ID</label>
                                                                    </div>
                                                                    {submit && appId.length == 0 ? <div className='text-danger error-message-required'>App.Id is required</div> : <></>}
                                                                    <div className="vendor-create-container mt-3">
                                                                        <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e) => setappSecreteId(e.target.value)} value={appSecreteId}
                                                                        className={`vendor-crt-input loginfilled-frame-username ${submit && !appSecreteId ? 'error' : ''}`}
                                                                         placeholder=" " required />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Facebook App Secret</label>
                                                                    </div>
                                                                    {submit && appSecreteId.length == 0 ? <div className='text-danger error-message-required'>Appsecrete.Id is required</div> : <></>}
                                                                    <div className="text-end mt-1">
                                                                        <button className="vendor-crt-btn" onClick={handleSubscription} disabled={isLoading}>{isLoading ? "Save...":"Save"}</button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    </div>

                                                </>
                                            )}
                                            </div>
                                            <div className="mt-2">
                                                {subscription?  <p className="setting-whatsapp-con-tic">
                                                <i className="fa-solid fa-check setting-whatapp-tick"></i> CONFIGURED
                                                </p>:
                                                <p className="setting-whatsapp-con-notconf">
                                                <i className="fa-solid fa-circle-exclamation"></i> NOT CONFIGURED
                                                </p>}
                                            </div>
                                            <div className="mt-2 ">
                                                {subscription ?  
                                                <>
                                                <p className="setting-whatsapp-con-tic">
                                                <i className="fa-solid fa-check setting-whatapp-tick"></i> WEBHOOK CONFIGURED
                                                </p>
                                                <button className="settings-whats-btn-dis" onClick={handlewhatsappwebhookUnsub}>Disconnect Webhook</button>
                                                </>
                                                :
                                                <p className="setting-whatsapp-con-notconf">
                                                <i className="fa-solid fa-circle-exclamation"></i> NOT WEBHOOK CONFIGURED
                                                </p>}
                                                
                                            </div>
                                        </div>
                                        <div className="campaign-template border mt-5 shadow-lg mb-5 ">
                                            <h6 onClick={ShowButtonData1} className="campaign-temp-head">WhatsApp Integration Setup  <span className="setting-whatsapp-ternary" > Click to expand/collapse</span></h6>
                                            <div className={`campaign-content-wrapper ${showbutton1 ? 'show' : ''}`}>
                                            {showbutton1 && (
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <p className="text-sm"> You should have whatsapp_business_management and whatsapp_business_messaging permission  </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <button className="mt-3 whatapp-button-settings mb-2" onClick={()=>{QuickHelp()}}>Quick Help</button>
                                                        <div className={`campaign-content-wrapper ${quickHelp ? 'show' : ''}`}>
                                                        {quickHelp ?
                                                        <>
                                                        <p className="mt-2 mb-1 text-sm">Once you created your app you now need to choose WhatsApp from list click on the setup as shown in the below screenshot</p>
                                                        <img className="mt-2 mb-1 w-25" src={whaInte} alt="" />
                                                        <p className="mt-2 mb-1 text-sm">You may need to select or setup Meta Business Account, once done go to API setup from sidebar under the WhatsApp menu item as shown in the below screenshot</p>
                                                        <img className="mt-2 mb-1 w-25" src={whaSetting} alt="" />
                                                        </>
                                                        :<></>}
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 mb-4">
                                                        {showbutton === true ?
                                                            ""
                                                            :
                                                            <p onClick={ShowButtonData} className="whatsapp-tem-setting-btn">Click Here To Update</p>}
                                                        <div className={`campaign-clickbtn-wrapper ${showbutton ? 'show' : ''}`}>
                                                        {showbutton && (
                                                            <>
                                                           <div className="col-md-12 text-end">
                                                                <h6 className="text-sm cursor-pointer">
                                                                    <span onClick={() => window.open("https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#1--acquire-an-access-token-using-a-system-user-or-facebook-login", "_blank")}>
                                                                        Help & More Information
                                                                    </span> 
                                                                    <i onClick={() => window.open("https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#1--acquire-an-access-token-using-a-system-user-or-facebook-login", "_blank")} className="fa-solid fa-arrow-up-right-from-square px-2"></i>
                                                                    <span>|</span>
                                                                    <span className="px-2" onClick={() => window.open("https://www.cloudperitus.com/blog/whatsapp-cloud-api-integration-generating-permanent-access-token", "_blank")}>
                                                                        External Help
                                                                    </span>
                                                                    <i onClick={() => window.open("https://www.cloudperitus.com/blog/whatsapp-cloud-api-integration-generating-permanent-access-token", "_blank")} className="fa-solid fa-arrow-up-right-from-square"></i>
                                                                </h6>
                                                            </div>
                                                                <div className="">
                                                                    <div className="vendor-create-container">
                                                                        <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setaccesstoken(e.target.value)} value={accesstoken} 
                                                                        className={`vendor-crt-input loginfilled-frame-username ${integrationsubmit && !accesstoken ? 'error' : ''}`}
                                                                        placeholder=" " required />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Access Token</label>
                                                                    </div>
                                                                    {integrationsubmit && accesstoken.length == 0 ? <div className='text-danger error-message-required'>Access token is required</div> : <></>}
                                                                    <div className="mt-2">
                                                                        <p className="text-sm">You can either use Temporary access token or Permanent Access token, as the Temporary token expires in 24 hours its strongly recommended that you should create Permanent token.</p>
                                                                    </div>
                                                                    {/* <div className="vendor-create-container mt-3">
                                                                        <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setphonenoId(e.target.value)} value={phonenoId} 
                                                                       className={`vendor-crt-input loginfilled-frame-username ${integrationsubmit && !phonenoId ? 'error' : ''}`}
                                                                        placeholder=" " required />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Phone Number Id</label>
                                                                    </div>
                                                                    {integrationsubmit && phonenoId.length == 0 ? <div className='text-danger error-message-required'>Phone.no id is required</div> : <></>} */}
                                                                    <div className="vendor-create-container mt-3">
                                                                        <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setbussinessId(e.target.value)} value={bussinessId} 
                                                                       className={`vendor-crt-input loginfilled-frame-username ${integrationsubmit && !bussinessId ? 'error' : ''}`}
                                                                        placeholder=" " required />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> WhatsApp Business Account ID</label>
                                                                    </div>
                                                                    {integrationsubmit && bussinessId.length == 0 ? <div className='text-danger error-message-required'>Whatsapp bussiness id is required</div> : <></>}
                                                                    <div className="text-end mb-2">
                                                                        <button className="vendor-crt-btn" onClick={handleSetup} disabled={isLoading1}>{isLoading1 ? "Save...":"Save"}</button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    </div>

                                                </>
                                            )}
                                            </div>
                                            <div className="mt-2">
                                                {whatsappInte ?
                                                <p className="setting-whatsapp-con-tic"><i className="fa-solid fa-check setting-whatapp-tick"></i> CONFIGURED</p>
                                                :<p className="setting-whatsapp-con-notconf">
                                                <i className="fa-solid fa-circle-exclamation"></i> NOT CONFIGURED
                                                </p>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="campaign-template border shadow-lg mt-4">
                                        <h6 className="campaign-temp-head">Access Token Information</h6>
                                        <div>
                                            <h6 className="grayFont">Permission scopes</h6>
                                            <p>{scopes.join(', ')}</p>
                                            <h6 className="grayFont">Issued at</h6>
                                            <p>{formatDate(tokenInfo?.issued_at)}</p>
                                            <h6 className="grayFont">Expiry at</h6>
                                            <p>{tokenInfo?.expires_at ===0 ? "N/A" :tokenInfo?.expires_at}</p>
                                            {tokeninfoError &&(<p className="text-danger text-xs">{tokeninfoError}</p>)}
                                            <p className="border"></p>
                                            {wabacatalogAccesstoken ?
                                            <Link className="setting-whats-share-debug" target="_blank" to={(`https://developers.facebook.com/tools/debug/accesstoken/?access_token=${wabacatalogAccesstoken}&version=v23.0`)}>Debug Token <i className="fa-solid fa-arrow-up-right-from-square"></i></Link>
                                            :null}                                        </div>
                                    </div>
                                    <div className="campaign-template border shadow-lg mb-5 mt-5">
                                            <h6 onClick={ShowTernary2} className="campaign-temp-head">
                                                Bussiness Id <span className="setting-whatsapp-ternary">Click to expand/collapse</span>
                                            </h6>
                                            <div className={`campaign-content-wrapper ${showdata2 ? 'show' : ''}`} style={{overflow:'visible'}}>
                                                {showdata2 && (
                                                    <>
                                                        <div className="mb-3" style={{overflow:"visible"}}>
                                                            {!showbutton3 && (
                                                                <p onClick={ShowButtonData3} className="whatsapp-tem-setting-btn">Click Here To Update</p>
                                                            )}
                                                            <div className={`campaign-clickbtn-wrapper ${showbutton3 ? 'show' : ''}`} style={{overflow:'visible'}}>
                                                                {showbutton3 && (
                                                                    <>
                                                                    <div className="mt-2">
                                                                        <div className="vendor-create-container">
                                                                        <input type="text" id="vendor-crt-input" 
                                                                        autoComplete="off" onChange={(e) => setbizId(e.target.value)} value={bizId}
                                                                        className={`vendor-crt-input loginfilled-frame-username ${submit1 && !bizId ? 'error' : ''}`}
                                                                        placeholder=" " required />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Bussiness Id</label>
                                                                    </div>
                                                                    {submit1 && bizId.length == 0 ? <div className='text-danger error-message-required'>Catalog Name is required</div> : <></>}
                                                                    </div>
                                                                    <div className="text-end mt-1">
                                                                        <button className="vendor-crt-btn" disabled={isLoading3} onClick={handlebizIdLink}>{isLoading3 ? ("Save...") : ("Save")}</button>
                                                                    </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                {catalogBizConfig ? (
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
                                    <div className="campaign-template border shadow-lg mb-5 mt-5">
                                            <h6 onClick={ShowTernary1} className="campaign-temp-head">
                                                Link Catalog <span className="setting-whatsapp-ternary">Click to expand/collapse</span>
                                            </h6>
                                            <div className={`campaign-content-wrapper ${showdata1 ? 'show' : ''}`} style={{overflow:'visible'}}>
                                                {showdata1 && (
                                                    <>
                                                        <div className="mb-3" style={{overflow:"visible"}}>
                                                            {!showbutton2 && (
                                                                <p onClick={ShowButtonData2} className="whatsapp-tem-setting-btn">Click Here To Update</p>
                                                            )}
                                                            <div className={`campaign-clickbtn-wrapper ${showbutton2 ? 'show' : ''}`} style={{overflow:'visible'}}>
                                                                {showbutton2 && (
                                                                    <div className="mt-2">
                                                                        <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <input
                                                                            autoComplete="off"
                                                                            type="text"
                                                                            // onClick={handleGetStoreDrop}
                                                                            id="vendor-crt-input"
                                                                            className={`vendor-crt-input loginfilled-frame-username ${submit2 && !catalogId ? 'error' : ''}`}
                                                                            value={catalogName}
                                                                            placeholder=" "
                                                                            required
                                                                            readOnly
                                                                            onChange={(e)=>setcatalogId(e.target.value)}
                                                                        />
                                                                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Catalog Name</label>
                                                                        <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                                        <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                                        {catalogDropList.length === 0 ? (
                                                                                <li className="dropdown-nodata-found">No data found</li>
                                                                            ) : (
                                                                                catalogDropList.map((dropdownValue:any, id:any) => (                                                            
                                                                                <li key={id}>
                                                                                <a
                                                                                    className="dropdown-item"
                                                                                    href="#"
                                                                                    onClick={() => { setcatalogId(dropdownValue.catalog_id);setcatalogName(dropdownValue?.name)}}
                                                                                >
                                                                                    {dropdownValue.name}
                                                                                </a>
                                                                                </li>
                                                                            )))}
                                                                        </ul>
                                                                    </div>
                                                                    {submit2 && catalogId.length == 0 ? <div className='text-danger error-message-required'>Catalog Name is required</div> : <></>}
                                                                    <div className="text-end mt-1">
                                                                            <button className="vendor-crt-btn" disabled={isLoading2} onClick={handlecatalogLink}>{isLoading2 ? ("Save...") : ("Save")}</button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                {catalogConfig ? (
                                                    <p className="setting-whatsapp-con-tic">
                                                        <i className="fa-solid fa-check setting-whatapp-tick"></i> LINKED
                                                    </p>
                                                ) : (
                                                    <p className="setting-whatsapp-con-notconf">
                                                        <i className="fa-solid fa-circle-exclamation"></i> NOT LINKED
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {catalogConfig ? 
                                            <>
                                        <div className="campaign-template border shadow-lg mb-5">
                                            <h6 className="campaign-temp-head" onClick={ShowButtonDatas}>
                                                Delete Catalog <span className="setting-whatsapp-ternary">Click to expand/collapse</span>
                                            </h6>
                                            <div className={`campaign-content-wrapper ${showbuttons ? 'show' : ''}`}>
                                                {showbuttons && (
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="mt-2">
                                                                <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <input
                                                                    autoComplete="off"
                                                                    type="text"
                                                                    // onClick={handleGetStoreDrop}
                                                                    id="vendor-crt-input"
                                                                    className={`vendor-crt-input loginfilled-frame-username ${submit3 && !catalogId1 ? 'error' : ''}`}
                                                                    value={catalogName1}
                                                                    placeholder=" "
                                                                    required
                                                                    onChange={(e)=>setcatalogId1(e.target.value)}
                                                                />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Catalog Name</label>
                                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                                <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                                {catalogDltDropList.length === 0 ? (
                                                                        <li className="dropdown-nodata-found">No data found</li>
                                                                    ) : (
                                                                        catalogDltDropList.map((dropdownValue:any, id:any) => (                                                            
                                                                        <li key={id}>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href="#"
                                                                            onClick={() => { setcatalogId1(dropdownValue.id);setcatalogName1(dropdownValue?.name)}}
                                                                        >
                                                                            {dropdownValue.name}
                                                                        </a>
                                                                        </li>
                                                                    )))}
                                                                </ul>
                                                            </div>
                                                            </div>
                                                            <div className="text-end">
                                                                 <button className="vendor-crt-btn" disabled={isLoading4} onClick={handlecatalogUnlink}>{isLoading4 ? ("Save...") : ("Save")}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                            {catalogConfig ? (
                                                    <p className="setting-whatsapp-con-tic">
                                                        <i className="fa-solid fa-check setting-whatapp-tick"></i> LINKED
                                                    </p>
                                                ) : (
                                                    <p className="setting-whatsapp-con-notconf">
                                                        <i className="fa-solid fa-circle-exclamation"></i> NOT LINKED
                                                    </p>
                                                )}
                                            </div>
                                        </div></>:<></>}
                                    <div className="campaign-template border shadow-lg mt-4">
                                        <h6 className="campaign-temp-head">Access Token Information</h6>
                                        <div>
                                            <div className="vendor-create-container dropdown mt-3" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    className={`vendor-crt-input loginfilled-frame-username ${submit && !phoneno ? 'error' : ''}`}
                                                    placeholder=" "
                                                    required
                                                    value={formatPhoneNumber(phoneno)}
                                                    readOnly
                                                    autoComplete="off"
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-phone"></i> Select Default Phone Number</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu storename-dropdown-menu">
                                                    {displayPhone.length === 0 ? (
                                                            <li className="dropdown-nodata-found">No data found</li>
                                                         ) : (
                                                            displayPhone.map((dropdownValue:any, id:any) => (                                                            
                                                            <li key={id}>
                                                               <a
                                                                  className="dropdown-item"
                                                                  href="#"
                                                                  onClick={() => { setphonenoId(dropdownValue.id); setphoneno(dropdownValue.display_phone_number) }}
                                                               >
                                                                  {formatPhoneNumber(dropdownValue.display_phone_number)}
                                                               </a>
                                                            </li>
                                                        )))}
                                                </ul>
                                            </div>
                                            {submit && phoneno.length == 0 ? <div className='text-danger error-message-required'>Phone.no is required</div> : <></>}
                                            <div className="text-end">
                                                <button className="vendor-crt-btn" onClick={handlewhatsappaddPhoneno}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="campaign-template border mt-5 shadow-lg mb-5">
                                    <h6 className="campaign-temp-head" onClick={ShowButtonDatas}>
                                        Test Contact for Campaign  
                                        <span className="setting-whatsapp-ternary"> Click to expand/collapse</span>
                                    </h6>

                                    <div className={`campaign-content-wrapper ${showbuttons ? 'show' : ''}`}>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="vendor-create-container">
                                                    <input autoComplete="off" onChange={(e) => settestContact(e.target.value)} value={testContact} maxLength={12} type="text" id="vendor-crt-input" className={`vendor-crt-input loginfilled-frame-username ${submit && !testContact ? 'error' : ''}`} placeholder=" " required />
                                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                        <i className="fa-solid fa-book-open-reader"></i> Test Contact Number
                                                    </label>
                                                </div>
                                                <small>WhatsApp number to test, It should be with country code without 0 or +</small>
                                                <div className="text-end">
                                                    <button className="vendor-crt-btn" onClick={handleTestContact}>Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                    {testContactInte ?
                                        <p className="setting-whatsapp-con-tic"><i className="fa-solid fa-check setting-whatapp-tick"></i> CONFIGURED</p>
                                        :<p className="setting-whatsapp-con-notconf">
                                        <i className="fa-solid fa-circle-exclamation"></i> NOT CONFIGURED
                                        </p>}
                                    </div>
                                </div> */}

                                    {/* <div className="m-3">
                                        <h4 className="grayFont">It's ready</h4>
                                        <p>In order to send template message you should have created and approved templates for WhatsApp Business.</p>
                                        <div className="d-flex gap-3">
                                            <button className="whatspp-set-btn-1" onClick={() => window.open("/vendor/whatsapp-template", "_blank")}>Manage Template</button>
                                            <button className="whatspp-set-btn-2" onClick={() => window.open("/vendor/contacts", "_blank")}>Manage Contacts</button>
                                            <button className="whatspp-set-btn-3 bg-dark" onClick={() => window.open("/vendor/create-campaign", "_blank")}>Create New Campaign</button>
                                            <button className="whatspp-set-btn-4">Disconnect Account</button>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="col-md-5">
                                    <div className="campaign-template border shadow-lg">
                                        <h6 className="campaign-temp-head">Default Phone Number</h6>
                                        <div className="campaign-template border mt-5  shadow-lg mb-5 ">
                                            <h6 className="campaign-temp-head">Phone Numbers</h6>
                                            {whatsappInte? 
                                            <div className="p-3">
                                                {phoneInfo.filter((listData: any) => listData?.config_status === true).map((listData:any)=>(
                                                <React.Fragment key={listData?.id}>
                                                <h6 className="grayFont">Phone Number ID</h6>
                                                <p>{listData?.id}</p>
                                                <h6 className="grayFont">Verified Name</h6>
                                                <p>{listData?.verified_name}</p>
                                                <h6 className="grayFont">Display Phone Number</h6>
                                                <p>{listData?.display_phone_number}</p>
                                                <h6 className="grayFont">Quality Rating</h6>
                                                <p className="text-success">{listData?.quality_rating}</p>
                                                </React.Fragment>
                                                ))}  
                                                {phonenoError && (<p className="text-danger text-xs">{phonenoError}</p> )}
                                                {phoneInfo.length===1 &&(<button className="whatsapp-border-btn-0" type="button" data-bs-toggle="modal"
                                                data-bs-target="#vendorview" onClick={handlewhatsappbussinessInfo}><i className="fa-solid fa-pen"></i> Update Bussiness Profile</button>)}
                                            </div>:<></>
                                            }
                                            <p className="border"></p>
                                            <div className="d-flex gap-1">
                                                <button className="whatsapp-border-btn-1" onClick={handlewhatsappsetupList}>Re-sync Phone Numbers</button>
                                                <button className="whatsapp-border-btn-2">Manage Phone Numbers <i className="fa-solid fa-arrow-up-right-from-square"></i></button>
                                            </div>
                                        </div>
                                       {loginasSadmin ?
                                        <>
                                        <div className="campaign-template border mt-5  shadow-lg mb-5 ">
                                            <h6 className="campaign-temp-head">Overall Health </h6>
                                            <div className="p-3">
                                                <h6 className="grayFont">WhatsApp Business ID</h6>
                                                <p>{healthId?.id}</p>
                                                <h6 className="grayFont">Status as at</h6>
                                                <p>
                                                {new Date(healthId?.status_checked_at).toLocaleString('en-US', {
                                                               year: 'numeric',
                                                               month: 'short',
                                                               day: '2-digit',
                                                               hour: '2-digit',
                                                               minute: '2-digit',
                                                               second: '2-digit',
                                                               hour12: true
                                                            }).replace(',', '').replace(' ', ' ')}
                                                    </p>
                                                <h6 className="grayFont">Overall Health</h6>
                                                <p>{health?.can_send_message}</p>
                                                {healthError && (<p className="text-danger text-xs">{healthError}</p>)}
                                            </div>
                                        </div>
                                        <>
                                       
                                        {entities.map((listData:any)=>(
                                        <>
                                        <div className="campaign-template border mt-5  shadow-lg mb-5 ">
                                            <h6 className="campaign-temp-head">{listData?.entity_type} - {listData?.id}</h6>
                                            <div>
                                                <h6 className="grayFont">Can Send Message</h6>
                                                <p>{listData?.can_send_message}</p>
                                            </div>
                                        </div>
                                        </>
                                         ))}
                                        </>
                                        </>:<></>}
                                        <div>
                                            <button className="whatsapp-border-btn-3" onClick={handlewhatsapptokenInfo}>Refresh Status</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal fade" id="vendorview" aria-labelledby="vendorviewLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-lg">
                                        <div className="modal-content all-modal-content vendorcreate-modal-content">
                                            <div className="modal-header vendorcreate-modal-header">
                                                <h1 className="modal-title vendorcreate-modal-title fs-6 mb-5 text-center" id="vendorviewLabel">Update Business Profile</h1>
                                            </div>
                                            {profileupdLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                <span className="tab-loader"></span>
                                            </div>
                                            ) : (
                                            <> 
                                            <div className="p-0 modal-body text-center ">
                                                <div className="row">
                                                    <div className="col-md-12 mt-n3 vendor-login-icon store-view-label">
                                                        <img className="rounded" src={profilePic} alt="" />
                                                    </div>
                                                </div>
                                                <div className="text-start ms-4 mx-4 campaign-template">
                                                    <h6 className="campaign-temp-head text-center">New Profile Image</h6>
                                                    <div className="row">
                                                        <div className="col-md-12 login-input-group">
                                                            <div className="file-inputs px-4 ps-3">
                                                                <input
                                                                    type="file"
                                                                    name="file-input"
                                                                    id="file-input"
                                                                    className="file-input__input"
                                                                    onChange={handleFileChange}
                                                                />
                                                                <label className="profile_file-input__label" htmlFor="file-input">
                                                                    <span className="text-center fs-6">Select Image</span>
                                                                </label>
                                                                <h6 className="text-center fs-6 text-secondary text-xs fw-normal">{fileName}</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row ms-4 mx-4">
                                                    <div className="col-md-12 login-input-group">
                                                        <div className="vendor-create-container">
                                                            <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setaddress(e.target.value)} value={address} className={`vendor-crt-input`} placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-location-crosshairs"></i> Address</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 login-input-group">
                                                        <div className="vendor-create-container">
                                                            <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setdescription(e.target.value)} value={description} className={`vendor-crt-input`} placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-audio-description"></i> Description</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 login-input-group">
                                                        <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                            <input
                                                                type="text"
                                                                id="vendor-crt-input" autoComplete="off" onChange={(e)=>setvertical(e.target.value)} value={vertical}
                                                                className={`vendor-crt-input`}
                                                                onClick={handleIndustryDrop}
                                                                placeholder=" "
                                                                required
                                                                readOnly
                                                            />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Industry type</label>
                                                            <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                            <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                            {indusType.length === 0 ? (
                                                            <li className="dropdown-nodata-found">No data found</li>
                                                         ) : (
                                                            indusType.map((dropdownValue, id) => (                                                            
                                                            <li key={id}>
                                                               <a
                                                                  className="dropdown-item"
                                                                  href="#"
                                                                  onClick={() => { setvertical(dropdownValue.industry_type) }}
                                                               >
                                                                  {dropdownValue.industry_type}
                                                               </a>
                                                            </li>
                                                         )))}
                                                            </ul>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12 login-input-group">
                                                        <div className="vendor-create-container">
                                                            <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setabout(e.target.value)} value={about}  className={`vendor-crt-input`} placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-address-card"></i> About</label>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 login-input-group">
                                                        <div className="vendor-create-container">
                                                            <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setemail(e.target.value)} value={email} className={`vendor-crt-input`} placeholder=" " required />
                                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-regular fa-envelope"></i> Email</label>
                                                        </div>

                                                    </div>
                                                    {website.map((site, index) => (
                                                        <div key={index} className="col-md-12 login-input-group">
                                                            <div className="vendor-create-container">
                                                                <input
                                                                    type="text"
                                                                    id={`vendor-crt-input-${index}`}
                                                                    autoComplete="off" onChange={(e) => {
                                                                        const updatedWebsites = [...website];
                                                                        updatedWebsites[index] = e.target.value;
                                                                        setwebsite(updatedWebsites);
                                                                    }}
                                                                    value={site}
                                                                    className="vendor-crt-input"
                                                                    placeholder=" "
                                                                    required
                                                                />
                                                                <label htmlFor={`vendor-crt-input-${index}`} className="vendor-crt-label">
                                                                    <i className="fa-solid fa-earth-americas"></i> Website {index + 1}
                                                                </label>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            </>)}
                                            <div className="modal-footer text-end vendor-view-footer ms-4 mx-4">
                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="whaprofileUpdateClose">Close</button>
                                                <button type="button" className="btn btn-primary" onClick={handlewhaprofileUpdate}>Update</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>)}
                            </div>
                            
                        </div>
                        <Footer />
                    </div>
                </main>
            </DashboardLayout>
        </>
    )
}
export default Catalog_Settings;