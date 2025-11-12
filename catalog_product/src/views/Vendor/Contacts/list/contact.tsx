import React, { use, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg"
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import Spotify from "../../../assets/img/small-logos/logo-spotify.svg";
import Invision from "../../../assets/img/small-logos/logo-invision.svg";
import Jira from "../../../assets/img/small-logos/logo-jira.svg";
import Slack from "../../../assets/img/small-logos/logo-slack.svg";
import Webdev from "../../../assets/img/small-logos/logo-webdev.svg";
import Adobe from "../../../assets/img/small-logos/logo-xd.svg";
// import LoginAPI from "../../../api/services/superAdminLogin/superAdmin";
import { toast } from "react-toastify";
import './contact.css'
import { setegid, setgroups } from "process";
import { format } from "date-fns";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";
import VendorAPI from "../../../../api/services/vendorLogin/vendorApi";
import API from "../../../../api/api";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import TopNav from "../../../../shared/TopNav";
import API_EP_BOOK from "../../../../api/endpoints";
import Footer from "../../../../shared/Footer";

interface StoreDrop {
   id: string;
   store_name: string;
}
interface GroupDrop {
   id: string;
   group_name: string;
}
interface CountrypDrop {
   id: string;
   name: string;
   iso_code: string;
   name_capitalized: string;
   iso3_code: string;
   iso_num_code: string;
   phone_code: string;
}
interface LangCodeDrop {
   id: string;
   language_name: string;
   language_code: string;
}
function StoreContacts() {
   const [modalMode, setModalMode] = useState("create");
   const openModal = (mode: any) => {
      setModalMode(mode);
   };

   const navigate = useNavigate();
   // Use State
   const location = useLocation();
   const groupDetailsValue = location.state?.groupDetails || {};
   const [listContact, setListContact] = useState([]);
   const [formValues, setFormValues] = useState<{ [key: number]: string }>({});
   const handleChange = (id: number, name: string, value: string) => {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value,  // Using field name as key
      }));
    };
    
   
   const [contactField, setcontactField] = useState<any[]>([]);
   const [listgroupContact, setListgroupContact] = useState([])
   const [langCodeDrop, setlangCodeDrop] = useState<LangCodeDrop[]>([]);
   const [langName, setLangName] = useState('')
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const [deleteId, setDeleteId] = useState('')
   const [loading, setLoading] = useState(false)
   const [submit, setSubmit] = useState(false);
   const [customCampaign, setcustomCampaign] = useState(false);
   const [campaignOpt, setcampaignOpt] = useState(false);
   const [deleteAll, setDeleteAll] = useState(false);
   const [id, setId] = useState('')
   const [fName, setFName] = useState('')
   const [lName, setLName] = useState('')
   const [mobNumber, setMobNumber] = useState('')
   const [languageCode, setLanguageCode] = useState('')
   const [email, setEmail] = useState('')
   const [groups, setGroups] = useState('')
   const [date, setDate] = useState('')
   const [address, setAddress] = useState('')
   const [loyality, setLoyality] = useState('')
   const [anniversary, setAnniversary] = useState('')
   const [saleAmount, setsaleAmount] = useState('')
   const [storeId, setStoreId] = useState('')
   const [storeDropDown, setStoreDropDown] = useState<StoreDrop[]>([])
   const [groupDropDown, setGroupDropDown] = useState<GroupDrop[]>([])
   const [countryDropDown, setCountryDropDown] = useState<CountrypDrop[]>([])
   const [genderDropDown, setgenderDropDown] = useState<string>("");
   const [countryName, setcountryName] = useState('')
   const [storeName, setStoreName] = useState('')
   const [file, setFile] = useState<File | null>(null);
   const [fileName, setFileName] = useState("");
   const [groupName, setGroupName] = useState<any[]>([]);
   const [groupId, setGroupId] = useState<string[]>([]);
   const [search,setSearch]=useState("");
   const [debouncedSearch, setDebouncedSearch] = useState('');
   const EMAIL_VALIDATION_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i
   const [selectedGroupIds, setSelectedGroupIds] = useState<any[]>([]);
   const[disabled,setdisabled]=useState(false);
   const [inputListData, setinputListData] = useState<any[]>([]);
    const handleSelectAll = () => {
      const allGroupIds = listContact.map((contact: any) => contact?.id);
      const allSelected = selectedGroupIds.length === allGroupIds.length;
      if (allSelected) {
          setSelectedGroupIds([]);
          setdisabled(false);
      } else {
            const allGroupIds = listContact.map((contactList:any) => contactList?.id);
            setSelectedGroupIds(allGroupIds);
            setdisabled(true);
        }
    };
    const handleCheckboxChange = (groupId: any) => {
      setSelectedGroupIds((prevSelectedIds) => {
          let updatedSelectedIds;
          if (prevSelectedIds.includes(groupId)) {
              updatedSelectedIds = prevSelectedIds.filter(id => id !== groupId);
          } else {
              updatedSelectedIds = [...prevSelectedIds, groupId];
          }
          setdisabled(updatedSelectedIds.length === 0);
          return updatedSelectedIds;
      });
  };
  const handlePhoneChange = (e: { target: { value: string } }) => {
   let value = e.target.value;
   if (value === "" || /^\+?[0-9]*$/.test(value)) {
      setMobNumber(value);
   }
};
   // Pagination Usestate
   const [currentPage, setCurrentPage] = useState(1);
   const [recordsPerPage,setrecordsPerPage] = useState(10);
   const [totalRecords, setTotalRecords] = useState(0);

   

   

   const isValidDate = (date: string | number): boolean => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
   };

   const resetForm = () => {
      setFName('');
      setLName('');
      setcountryName('');
      setMobNumber('');
      setMobNumber('');
      setLanguageCode('')
      setLangName('')
      setEmail('')
      setGroups('')
      setDate('')
      setAddress('')
      setLoyality('')
      setAnniversary('')
      setgenderDropDown('')
      setStoreId('')
      setStoreName('')
      setsaleAmount('')
      setFileName('')
      setFile(null)
      setGroupName([])
      setFormValues([])
      setGroupId([])
      setSubmit(false)
      setDeleteAll(false)
      setLoading(false)
      setcustomCampaign(false)
      setcampaignOpt(false)
   };

  

   // Contact List Api

   const superAdminConatctList = (page: any,search:string) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: recordsPerPage
      };
      VendorAPI.contactListAPI(apiData)
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               setListContact(responceData?.result?.ContactData)
               setTotalRecords(responceData.result?.totalRecordCount);
               setLoading(false)  
            } else {
               if (responceData.apiStatus.code == "404") {
               setListContact([]);
               }
               setLoading(false)
               // toast.error(responceData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };
   const handlecustomFieldList = () => {
          setLoading(true)
          const apiData = {
             active_status: 1
          };
          VendorAPI.customFieldcontactList(apiData)
             .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                   setLoading(false)
                   setcontactField(responseData.result.contactCustomFieldData)
                   setTotalRecords(responseData.result.totalRecordCount)
                } else {
                   if (responseData.apiStatus.code == "404") {
                    setcontactField([]);
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
   // Group Contact List Api

   const groupConatctList = (page:any) => {
      setLoading(true)
      const apiData = {
         pageIndex: page - 1,
         dataLength: grouprecordsPerPage,
         groupName: groupDetailsValue?.title
      };
      VendorAPI.contactGroupContactListAPI(apiData)
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               setListgroupContact(responceData?.result?.GroupData?.contacts)
               console.log(responceData?.result?.GroupData?.contacts)
               setgroupTotalRecords(responceData.result?.totalRecordCount);
               setLoading(false)
            } else {
               if (responceData.apiStatus.code == "404") {
                  setListgroupContact([]);
                  }
               setLoading(false)
               setTotalRecords(0)
               // toast.error(responceData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };

   const handleSelectGroup = (dropdownValue: GroupDrop) => {
      const alreadySelected = groupName.some(item => item.groupId === dropdownValue.id);;
      if (alreadySelected) {
         setGroupName(groupName.filter(group => group.groupId !== dropdownValue.id));
         setGroupId(groupId.filter(id => id !== dropdownValue.id));
      } else {
         setGroupName([...groupName, { groupId: dropdownValue.id, groupName: dropdownValue.group_name }]);
         setGroupId([...groupId, dropdownValue.id]);
      }
   };
   const handleSelectGroupName = (groupdetails: any) => {
      setGroupName(prevGroupName => prevGroupName.filter(item => item.groupId !== groupdetails.groupId))
   }

   // Create Contact

   const superAdminContactCreate = () => {
      setSubmit(true)
      if (!fName || !mobNumber || !groupName || !storeName) {
         return;
      }
      const isDynamicValid = validateRequiredFields();
      if (!isDynamicValid) {
        return;
      }

      let apiData = {
         ...(modalMode === "edit" && { contactId: id }),
         storeId: storeId,
         firstName: fName,
         lastName: lName,
         gender:genderDropDown,
         mobile: mobNumber,
         email: email,
         custom_fields: contactField
         .filter((field) => formValues[field.name])
         .map((field) => ({
         id: field.id,
         value: formValues[field.name]
         })),
         country: countryName,
         language: languageCode,
         otherInformation: {
            DOB: isValidDate(date) ? format(new Date(date), "MM/dd/yyyy") : "",
            saleAmount:saleAmount,
            anniversary: isValidDate(anniversary) ? format(new Date(anniversary), "MM/dd/yyyy") : "",
            loyality: loyality,
            address: address,
         },
         groupdetails: groupName,
         send_custom_campaign:customCampaign===true ? "1" : "0",
         campaign_opt_out:campaignOpt===true ? "1":"0"
      };

      const apiCall = modalMode === "create" ? VendorAPI.contactCreateAPI(apiData) : VendorAPI.contactEditAPI(apiData);
      apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setSubmit(false)
               resetForm()
               toast.success(responseData.apiStatus.message);
               const closeButton = document.getElementById("closeCreate");
               superAdminConatctList(currentPage,debouncedSearch);

               if (closeButton) {
                  closeButton.click();
               }
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            console.error("Error during API call:", error);
            toast.error("An error occurred during the API call.");
         });
   };
   const validateRequiredFields = () => {
      const missingFields = contactField.filter((field) => {
        return field.is_required === "true" && !formValues[field.name]?.trim();
      });
    
      if (missingFields.length > 0) {
        console.log("Missing fields:", missingFields.map(f => f.label));
      }
    
      return missingFields.length === 0;
    };
    
   //   Get By Id

   const superAdminContactListGet = async (id: any) => {
      try {
         const responseData = await VendorAPI.contactGetAPI(id);
         if (responseData.apiStatus.code === '200') {
            const data = responseData?.result
            setFName(data?.firstName)
            setLName(data?.lastName)
            setgenderDropDown(data?.gender)
            setcountryName(data?.country)
            setStoreId(data?.storeId)
            setStoreName(data?.storeName)
            setDate(data?.otherInformation?.DOB)
            setsaleAmount(data?.otherInformation?.salesAmount)
            setMobNumber(data?.mobile)
            setLangName(data?.language)
            setLanguageCode(data?.language)
            setEmail(data?.email)
            setLoyality(data?.otherInformation?.loyality)
            setAnniversary(data?.otherInformation?.anniversary)
            setAddress(data?.otherInformation?.address)
            const customCampaign=data?.send_custom_campaign;
            setcustomCampaign(customCampaign==="1" ? true : false);
            const campaignOpt=data?.campaign_opt_out;
            setcampaignOpt(campaignOpt==="1" ? true : false);
            const groupNames = data?.groupDetails.map((group: any) => group.groupName);
            setGroupName(data?.groupDetails);
            const groupIds = data?.groupDetails.map((group: any) => group.groupId);
            setGroupId(groupIds);
            const customFields = data?.custom_fields || [];
            const initialFormValues = customFields.reduce((acc:any, field:any) => {
               acc[field.name] = field.value;
               return acc;
            }, {});
            setFormValues(initialFormValues);
         } else {
            toast.error(`get failed: ${responseData.apiStatus.message}`);
         }
      } catch (error) {
         console.error("Error during API call:", error);
         toast.error("An error occurred during the get process.");
      }
   };

   // Delete Contact

   const superAdminContactDelete = async () => {
      // setLoading(true)

      try {
         const responseData = await VendorAPI.contactDeleteAPI(deleteId);
         if (responseData.apiStatus.code === '200') {
            // setLoading(false)
            const newTotalRecords = totalRecords - 1;
            setTotalRecords(newTotalRecords);
            let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
            if (currentPage > totalPages) {
               setCurrentPage(totalPages || 1); 
            }
            else if (currentPage < 1) {
               setCurrentPage(1);
            }
            const closeButton = document.getElementById("deleteCreate");
            if (closeButton) {
               closeButton.click();
            }
            toast.success(responseData.apiStatus.message);
            superAdminConatctList(currentPage,debouncedSearch);
         } else {
            toast.error(`get failed: ${responseData.apiStatus.message}`);
            // setLoading(false)
         }
      } catch (error) {
         console.error("Error during API call:", error);
         toast.error("An error occurred during the get process.");
      }
   };
   const superAdminContactBulkDelete = () => {
           setLoading(true)
           const apiData = {deleteId:selectedGroupIds};
           VendorAPI.contactBulkDeleteAPI(apiData)
               .then((responseData: any) => {
                   if (responseData.apiStatus.code === '200') {
                       setLoading(false)
                       setdisabled(true)
                       setSelectedGroupIds([])
                       const closeButton = document.getElementById("selecteddelete");
                     if (closeButton) {
                        closeButton.click();
                     }
                     superAdminConatctList(currentPage,debouncedSearch);
                     toast.success(responseData.apiStatus.message);
                   } else {
                       setLoading(false)
                   }
               })
               .catch((error: any) => {
                   setLoading(false)
                   console.error("Error during login:", error);
                   toast.error("An error occurred during login.");
               });
       }
       //Contact Delete All

   const handlecontactDeleteAll = () => {
      VendorAPI.contactDeleteAllAPI()
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData.apiStatus.message);
               setLoading(false)
               setDeleteAll(false)
               setdisabled(true)
               setSelectedGroupIds([])
               const closeButton = document.getElementById("alldelete");
             if (closeButton) {
                superAdminConatctList(currentPage,debouncedSearch);
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
   const contactGroupBulkAssign = (e:any) => {
           e.preventDefault();
           setSubmit(true);
           if(groupId.length == 0){
               return
           }
           setLoading(true)
           const apiData = {
            id:selectedGroupIds,
            group_id:groupId
         };
           VendorAPI.contactBulkGroupAssignAPI(apiData)
               .then((responseData: any) => {
                   if (responseData.apiStatus.code === '200') {
                     toast.success(responseData.apiStatus.message)
                       setLoading(false)
                       setdisabled(true)
                       setSelectedGroupIds([])
                       const closeButton = document.getElementById("contactCloseModal");
                     if (closeButton) {
                        superAdminConatctList(currentPage,debouncedSearch);
                        closeButton.click();
                     }
                   } else {
                     toast.error(responseData.apiStatus.message)
                     setLoading(false)
                   }
               })
               .catch((error: any) => {
                   setLoading(false)
                   console.error("Error during login:", error);
                   toast.error("An error occurred during login.");
               });
       }

   // Store Dropdwon

   const handleGetStoreDrop = () => {
      VendorAPI.contactStoreDropdownAPI()
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setStoreDropDown(responseData?.result?.StoreDataDropDown);
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
   //Store Dropdown Filter
   const filteredStoreDrop = storeDropDown.filter((dropdownValue) =>
      (dropdownValue?.store_name || '').toLowerCase().includes((storeName || '').toLowerCase())
    );

   const handleCountryDrop = () => {
      VendorAPI.commonCountryDropAPI()
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setCountryDropDown(responseData?.result?.CountryData);
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
   //CountryDropdown Filter
   const filteredCountryDrop = countryDropDown.filter((dropdownValue) =>
      (dropdownValue?.name || '').toLowerCase().includes((countryName || '').toLowerCase())
   );
   //Group Dropdown

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
            setLoading(false)
            console.error("Error during login:", error);
            toast.error("An error occurred during login.");
         });
   };
   
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
   const [groupcurrentPage, setgroupCurrentPage] = useState(1);
   const [grouprecordsPerPage,setgrouprecordsPerPage] = useState(10);
   const [grouptotalRecords, setgroupTotalRecords] = useState(0);
   // Group Pagination Method

   const totalgroupPages = Math.ceil(grouptotalRecords / grouprecordsPerPage);

   const handlegroupPageChange = (pageNumber: any) => {
      if (pageNumber < 1 || pageNumber > totalgroupPages) return;
      setgroupCurrentPage(pageNumber);
   };
   const rendergroupPaginationItems = () => {
      let items = [];
      const maxPageNumbersToShow = 7;
      const halfRange = Math.floor(maxPageNumbersToShow / 2);

      let startPage, endPage;
      if (totalgroupPages <= maxPageNumbersToShow) {
         startPage = 1;
         endPage = totalgroupPages;
      } else if (groupcurrentPage <= halfRange) {
         startPage = 1;
         endPage = maxPageNumbersToShow;
      } else if (groupcurrentPage + halfRange >= totalgroupPages) {
         startPage = totalgroupPages - maxPageNumbersToShow + 1;
         endPage = totalgroupPages;
      } else {
         startPage = groupcurrentPage - halfRange;
         endPage = groupcurrentPage + halfRange;
      }

      if (startPage > 1) {
         items.push(
            <Pagination.Item key="1" active={1 === groupcurrentPage} onClick={() => handlegroupPageChange(1)}>
               1
            </Pagination.Item>
         );
         if (startPage > 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
         }
      }

      for (let number = startPage; number <= endPage; number++) {
         items.push(
            <Pagination.Item key={number} active={number === groupcurrentPage} onClick={() => handlegroupPageChange(number)}>
               {number}
            </Pagination.Item>
         );
      }

      if (endPage < totalgroupPages) {
         if (endPage < totalgroupPages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
         }
         items.push(
            <Pagination.Item key={totalgroupPages} active={totalgroupPages === groupcurrentPage} onClick={() => handlegroupPageChange(totalgroupPages)}>
               {totalgroupPages}
            </Pagination.Item>
         );
      }

      return items;
   };

   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      if (!file) {
         toast.error("Please select a file to import.");
         return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
         const response = await VendorAPI.importContact(formData);
         if (response.apiStatus?.code === "200") {
            superAdminConatctList(currentPage,debouncedSearch)
            toast.success(response.apiStatus.message);
            document.getElementById("closepopup")?.click();
         } else {
            toast.error(response.apiStatus?.message || "File import failed.");
         }
      } catch (error) {
         console.error("Import Error:", error);
         toast.error("An error occurred while importing the file.");
      }
   };

   const handleExport = async (name:any) => {
      try {
         var response;
         if(name==="withData"){
            response = await VendorAPI.exportContact();
         }else{
            response = await VendorAPI.exportHeaderContact();
         }
         const blob = new Blob([response], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
         const today = new Date();
         const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear().toString().slice(-2)}`;
         const fileName = `contact_data_${formattedDate}.xlsx`;
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement("a");
         link.href = url;
         link.setAttribute("download", fileName);
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         window.URL.revokeObjectURL(url);
         toast.success(`File downloaded: ${fileName}`);
      } catch (error) {
         console.error("Error downloading file:", error);
      }
   };
   const handleNavigate = (contactList: any) => {
      const contactDetailsData = {
         firstName: contactList.firstName,
         lastName: contactList.lastName,
         mobile: contactList.mobile,
         country: contactList.country,
      };

      navigate(`/vendor/contact/whatsapp/contact/send-template-message/${contactList?.id}`, { state: { contactDetailsData } });
   };
   const handleChatNavigate=(contactList:any)=>{
      const chatDetails={
         mobile: contactList.mobile,
         firstName: contactList.firstName,
      }
      navigate(`/vendor/whatapp-chat/${contactList?.id}`,{state:{chatDetails}})
   }

   //Language Drop
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
   //Language Dropdown Filter
   const filteredLangCodeDrop = langCodeDrop.filter((dropdownValue) =>
      (dropdownValue?.language_name || '').toLowerCase().includes((langName || '').toLowerCase())
    );
    const [gpStatus, setGpStatus] = useState<boolean>(false);
    const [gpName, setGpName] = useState<any>('');
    sessionStorage.setItem("groupTitle",groupDetailsValue?.title)
    sessionStorage.setItem("groupStatus",groupDetailsValue?.groupCntStatus)
    
    useEffect(() => {
      const status = sessionStorage.getItem("groupStatus");
      const gpName=sessionStorage.getItem("groupTitle");
      setGpName(gpName);
      setGpStatus(status === "true");
    }, []);
    useEffect(() => {
      if (location.pathname==="/vendor/groupcontacts") {
         groupConatctList(groupcurrentPage)
      }
   }, [location.pathname,gpName,groupcurrentPage])
useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);
   useEffect(() => {
      if(location.pathname==="/vendor/contacts")
      superAdminConatctList(currentPage,debouncedSearch)
   }, [location.pathname,currentPage,recordsPerPage,debouncedSearch])
      
   useEffect(() => {
   const modalElements = [
      document.getElementById('vendorcontact'),
      document.getElementById('contactview'),
      document.getElementById('contactassignGroup'),
      document.getElementById('exampleModal'),
      document.getElementById('vendordelete'),
   ];
   const handleHidden = () => {resetForm();};
   modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
   return () => {
      modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
   };
   }, []);
   useEffect(()=>{
      handleCountryDrop();
      languageCodeDropdwon();
      handleGetStoreDrop();
      handleGetGroupDrop();
      handlecustomFieldList();
   },[])
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <TopNav />
            <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
               <div className="col-md-5">
                  <nav aria-label="breadcrumb">
                     <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm">
                           <Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                        <li
                           className="breadcrumb-item text-sm grayFont active"
                           aria-current="page"
                        >
                           {gpStatus ? gpName + " Group Contacts" : "Customer Details"}
                        </li>
                     </ol>
                     <h6 className="text-start font-weight-bolder mb-0 grayFont">
                        {gpStatus ? gpName + " Group Contacts" : "Customer Details"}
                     </h6>
                  </nav>
               </div>
               <div className="col-md-7 text-end dropdown">
                  {gpStatus ?
                     <button className="vendor-crt-btn" onClick={() => { navigate('/vendor/contacts/groups') }}>
                        <span>Back to Contact Group</span>
                     </button>
                     : ""}&nbsp;
                     {location.pathname==="/vendor/contacts" ?
                     <>
                  <button className="vendor-crt-btn" onClick={() => openModal("create")} data-bs-toggle="modal" data-bs-target="#vendorcontact">
                     <span>Create New Contact</span>
                  </button>
                  &nbsp;
                  <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#exampleModal" >Import Contact</button>&nbsp;</>:<></>}
                  <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorExport">Export Contact</button>
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
                                 ) :(location.pathname==="/vendor/contacts" ?  listContact.length === 0 : listgroupContact.length === 0)  ? (
                                    <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                 ) : (
                                    <><table className="table align-items-center justify-content-center mb-0">
                                       <thead>
                                       {location.pathname==="/vendor/contacts" ?
                                       <>
                                       <div className='d-flex justify-content-between align-items-center position-absolute w-100 px-3 mt-n1'>
                                             {/* Left Section - Select All + Bulk Actions */}
                                             <div className='d-flex align-items-center gap-3 mt-3'>
                                                <button className='bulk-select contact-selectAllbtn' onClick={handleSelectAll}>
                                                   {selectedGroupIds.length === listContact.length ? 'Unselect All' : 'Select All'}
                                                </button>
                                                <div className="dropdown">
                                                   <button className="btn show-entries-btn1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                   Bulk Actions
                                                   </button>
                                                   <ul className="dropdown-menu show-entries-dropdown">
                                                   <li>
                                                      <a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#vendoralldelete" onClick={() => setDeleteAll(true)}>
                                                         Delete All Contacts
                                                      </a>
                                                   </li>
                                                   <li>
                                                      <a
                                                         className={`dropdown-item ${selectedGroupIds.length === 0 ? 'disabled' : ''}`}
                                                         {...(selectedGroupIds.length > 0 && { 'data-bs-toggle': 'modal', 'data-bs-target': '#vendorselecteddelete' })}
                                                         href="#"
                                                         style={{ cursor: selectedGroupIds.length === 0 ? 'not-allowed' : 'pointer' }}
                                                         onClick={(e) => { if (selectedGroupIds.length === 0) e.preventDefault(); }}
                                                      >
                                                         Delete Selected Contacts
                                                      </a>
                                                   </li>
                                                   <li>
                                                      <a
                                                         className={`dropdown-item ${selectedGroupIds.length === 0 ? 'disabled' : ''}`}
                                                         {...(selectedGroupIds.length > 0 && { 'data-bs-toggle': 'modal', 'data-bs-target': '#contactassignGroup' })}
                                                         href="#"
                                                         style={{ cursor: selectedGroupIds.length === 0 ? 'not-allowed' : 'pointer' }}
                                                         onClick={(e) => { if (selectedGroupIds.length === 0) e.preventDefault(); }}
                                                      >
                                                         Assign Group to Selected Contacts
                                                      </a>
                                                   </li>
                                                   </ul>
                                                </div>
                                             </div>

                                             {/* Right Section - Search Input */}
                                             <div className="vendor-create-container mt-4" style={{ width: '40%' }}>
                                                <input
                                                   type="text"
                                                   id="vendor-crt-input"
                                                   className="vendor-crt-input"
                                                   autoComplete="off"
                                                   onChange={(e) => setSearch(e.target.value)} value={search}
                                                   placeholder=" "
                                                   required
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                   <i className="fa-solid fa-magnifying-glass"></i> Search
                                                </label>
                                             </div>
                                             </div>
                                          <div className='d-flex show-entries-main mt-6 px-1'>
                                             <span className='show-entries-cnt'>Show</span> 
                                                   <div className="dropdown">
                                                      <button className="btn show-entries-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                         {recordsPerPage}
                                                      </button>
                                                         <ul className="dropdown-menu show-entries-dropdown">
                                                            <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(10); setCurrentPage(1); }}>10</a></li>
                                                            <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(20); setCurrentPage(1); }}>20</a></li>
                                                            <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(50); setCurrentPage(1); }}>50</a></li>
                                                            <li><a className="dropdown-item" onClick={() => { setrecordsPerPage(100); setCurrentPage(1); }}>100</a></li>
                                                         </ul>
                                                   </div>
                                             <span className='show-entries-cnt1'>Entries</span>
                                          </div>
                                          </>:<></>}
                                          <tr className="vendor-table-mainhead">
                                             {location.pathname==="/vendor/contacts" ?
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7">
                                             Select
                                             </th>:<></>}
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7">
                                                First <br />Name
                                             </th>
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                Last <br />Name
                                             </th>
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                Mobile <br />Number
                                             </th>
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                Language <br />Code
                                             </th>
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                Created On
                                             </th>
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                Country
                                             </th>
                                             <th className="contact-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                                Email
                                             </th>

                                             <th className="contact-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                                Action
                                             </th>
                                          </tr>
                                       </thead>
                                       <tbody className="text-start">
                                          {gpStatus === true ?
                                             listgroupContact?.map((contactList: any) => (
                                                <tr key={contactList.id}>
                                                   {location.pathname==="/vendor/contacts" ?
                                                   <td>
                                                   <span>
                                                      <div className="align-middle text-start text-xs my-auto vendor-contact-select">
                                                         
                                                         <input type="checkbox" checked={selectedGroupIds.includes(contactList?.id)}
                                                         onChange={() => handleCheckboxChange(contactList?.id)}/>
                                                      </div>
                                                      </span>
                                                   </td>:<></>}
                                                   <td>
                                                      <div className="d-flex px-2">
                                                         <div className="align-middle text-start text-sm my-auto">
                                                            <span className="px-2">{contactList?.firstName}</span>
                                                         </div>
                                                      </div>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>{contactList?.lastName}</span>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>
                                                         {contactList?.mobile}
                                                      </span>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      {contactList?.language}
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>
                                                         {new Date(contactList?.createdDate).toLocaleString('en-US', {
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
                                                   <td className="align-middle text-start text-sm">
                                                      <span>{contactList?.country}</span>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>{contactList?.email}</span>
                                                   </td>
                                                   <td className="align-middle vendor-login-td">
                                                      <div className="actionView-tooltip-container">
                                                         <button
                                                            className="btn-3 vendorbtn-view"
                                                            type="button"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#contactview"
                                                            onClick={() => { superAdminContactListGet(contactList?.id) }}
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-solid fa-eye"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionView-tooltip-text">
                                                            View
                                                         </div>
                                                      </div>
                                                      <div className="actionEdit-tooltip-container">
                                                         <button
                                                            className="btn-3 vendorbtn-edit"
                                                            type="button"
                                                            data-bs-toggle="modal" data-bs-target="#vendorcontact"
                                                            onClick={() => { openModal("edit"); superAdminContactListGet(contactList?.id); setId(contactList?.id) }}
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-pen-to-square"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionEdit-tooltip-text">
                                                            Edit
                                                         </div>
                                                      </div>
                                                      <div className="actionChat-tooltip-container">
                                                         <button className="btn-3 vendorbtn-whatsapp"
                                                            type="button"
                                                            onClick={() => handleNavigate(contactList)}
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-comment-dots"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionChat-tooltip-text">
                                                            Send Template Message
                                                         </div>
                                                      </div>
                                                      <div className="actionChat-tooltip-container">
                                                         <button className="btn-3 vendorbtn-whatsapp"
                                                            type="button"
                                                            onClick={() => handleChatNavigate(contactList)}>
                                                            <span className="btn-inner--icon">
                                                               <i className="fab fa-whatsapp"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionChat-tooltip-text">
                                                            Chat
                                                         </div>
                                                      </div>
                                                      <div className="actionDelete-tooltip-container">
                                                         <button
                                                            className="btn-3 vendorbtn-danger"
                                                            type="button"
                                                            data-bs-toggle="modal"
                                                            onClick={() => { setDeleteId(contactList?.id);setFName(contactList?.firstName);setLName(contactList?.lastName) }}
                                                            data-bs-target="#vendordelete"
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-trash-can"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionDelete-tooltip-text">
                                                            Delete
                                                         </div>
                                                      </div>
                                                   </td>
                                                </tr>
                                             )) :
                                             listContact?.map((contactList: any) => (
                                                <tr key={contactList.id}>
                                                   <td>
                                                   <div className="d-flex px-2 ml-5 vendor-contact-select">
                                                   <input type="checkbox" checked={selectedGroupIds.includes(contactList.id)}
                                                   onChange={() => handleCheckboxChange(contactList.id)}/> </div>
                                                </td>
                                                   <td>
                                                      <div className="d-flex px-2">
                                                         <div className="align-middle text-start text-sm my-auto">
                                                            <span className="px-2">{contactList?.firstName}</span>
                                                         </div>
                                                      </div>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>{contactList?.lastName}</span>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>
                                                         {contactList?.mobile}
                                                      </span>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      {contactList?.language}
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                   <span>
                                                         {new Date(contactList?.createdDate).toLocaleString('en-US', {
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
                                                   <td className="align-middle text-start text-sm">
                                                      <span>{contactList?.country}</span>
                                                   </td>
                                                   <td className="align-middle text-start text-sm">
                                                      <span>{contactList?.email}</span>
                                                   </td>
                                                   <td className="align-middle vendor-login-td">
                                                      <div className="actionView-tooltip-container">
                                                         <button
                                                            className="btn-3 vendorbtn-view"
                                                            type="button"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#contactview"
                                                            onClick={() => { superAdminContactListGet(contactList?.id) }}
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-solid fa-eye"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionView-tooltip-text">
                                                            View
                                                         </div>
                                                      </div>
                                                      <div className="actionEdit-tooltip-container">
                                                         <button
                                                            className="btn-3 vendorbtn-edit"
                                                            type="button"
                                                            data-bs-toggle="modal" data-bs-target="#vendorcontact"
                                                            onClick={() => { openModal("edit"); superAdminContactListGet(contactList?.id); setId(contactList?.id) }}
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-pen-to-square"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionEdit-tooltip-text">
                                                            Edit
                                                         </div>
                                                      </div>
                                                      <div className="actionChat-tooltip-container">
                                                         <button className="btn-3 vendorbtn-whatsapp"
                                                            type="button"
                                                            onClick={() => handleNavigate(contactList)}
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-comment-dots"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionChat-tooltip-text">
                                                            Send Template Message
                                                         </div>
                                                      </div>
                                                      <div className="actionChat-tooltip-container">
                                                         <button className="btn-3 vendorbtn-whatsapp"
                                                            type="button"
                                                            onClick={() => handleChatNavigate(contactList)}>
                                                            <span className="btn-inner--icon">
                                                               <i className="fab fa-whatsapp"></i>
                                                            </span>
                                                         </button>
                                                         <div className="actionChat-tooltip-text">
                                                            Chat
                                                         </div>
                                                      </div>
                                                      <div className="actionDelete-tooltip-container">
                                                         <button
                                                            className="btn-3 vendorbtn-danger"
                                                            type="button"
                                                            data-bs-toggle="modal"
                                                            onClick={() => { setDeleteId(contactList?.id);setFName(contactList?.firstName);setLName(contactList?.lastName) }}
                                                            data-bs-target="#vendordelete"
                                                         >
                                                            <span className="btn-inner--icon">
                                                               <i className="fa-regular fa-trash-can"></i>
                                                            </span>
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
                                    {location.pathname === "/vendor/groupcontacts" ? (
                                       listgroupContact.length === 0 ? null : (
                                          <div
                                             style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                                             className="store-pagination"
                                          >
                                             <Pagination>
                                             <Pagination.Prev
                                                onClick={() => handlegroupPageChange(groupcurrentPage - 1)}
                                                disabled={groupcurrentPage === 1}
                                             />
                                             {rendergroupPaginationItems()}
                                             <Pagination.Next
                                                onClick={() => handlegroupPageChange(groupcurrentPage + 1)}
                                                disabled={groupcurrentPage === totalgroupPages}
                                             />
                                             </Pagination>
                                          </div>
                                       )
                                       ) : (
                                       listContact.length === 0 ? null : (
                                          <div
                                             style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
                                             className="store-pagination"
                                          >
                                             <Pagination>
                                             <Pagination.Prev
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                             />
                                             {renderPaginationItems()}
                                             <Pagination.Next
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                             />
                                             </Pagination>
                                          </div>
                                       )
                                       )}

                                       
                                    </>
                                 )}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <Footer />
            </div>
         </main>



         <div className="modal fade" id="vendorcontact" aria-labelledby="vendorcontactLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
               <div className="modal-content all-modal-content vendorcontact-modal-content">
                  <div className="modal-header vendorcontact-modal-header border-0">
                     <h5 className="modal-title vendorcontact-modal-title" id="vendorcontactLabel">
                        {modalMode === "create" ? "Create New Contact" : "Edit Contact"}
                     </h5>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="row modal-container-size modal-body vendorcontact-modal-body">
                     <div className="row mt-n4">
                        {/*{/ <h5 className="text-center mt-4"><u>Vendor Admin User</u></h5> /}*/}
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={fName} className="vendor-crt-input"
                                 style={submit && fName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 autoComplete="off" onChange={(e) => setFName(e.target.value)}
                                 placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> First Name</label>
                           </div>
                           {submit && fName.length == 0 ? (
                              <div className="text-danger error-message-required">First name is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={lName}
                                 autoComplete="off" onChange={(e) => setLName(e.target.value)}
                                 className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Last Name</label>
                           </div>
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container dropdown">
                              <input type="text" id="vendor-crt-input dropdown" data-bs-toggle="dropdown" aria-expanded="false"
                                 onClick={handleCountryDrop} value={countryName}
                                 autoComplete="off" onChange={(e) => setcountryName(e.target.value)} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Country</label>
                              <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              <ul className="dropdown-menu template-dropdown  storename-dropdown-menu">
                              {filteredCountryDrop.length === 0 ? (
                                 <li className="dropdown-nodata-found">No data found</li>
                              ) : (
                                 filteredCountryDrop.map((dropdownValue, id) => (
                                    <li key={id}>
                                       <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() => { setcountryName(dropdownValue?.name) }}
                                       >
                                          {dropdownValue?.name}
                                       </a>
                                    </li>
                                 )))}
                              </ul>

                           </div>
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" autoComplete="off" onChange={handlePhoneChange} value={mobNumber} className="vendor-crt-input" placeholder=" "
                                 style={(submit && !mobNumber) || (mobNumber.length > 0 && mobNumber.length < 10) ? { borderColor: "red" } : { borderColor: "" }}
                                 maxLength={12} required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-button"></i> Mobile Number</label>
                           </div>
                           <div className='error-message-required'>Contact number should starts with country code without 0 or +</div>
                           {submit && mobNumber.length == 0 ? (<div className="text-danger error-message-required">Mobile.no is required </div>) : (<></>)}
                           {mobNumber.length < 10 && mobNumber.length > 0 && (<div className="text-danger error-message-required">Mobile.No should be at least 10 digits</div>)}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="edit-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <input
                                 type="text"
                                 id="vendor-crt-input"
                                 className="vendor-crt-input"
                                 placeholder=" "
                                 required
                                 value={langName}
                                 onClick={languageCodeDropdwon}
                                 autoComplete="off" onChange={(e) => setLangName(e.target.value)}
                              />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                 <i className="fa-solid fa-at"></i> Language Code
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
                                          onClick={() => { setLanguageCode(dropdownValue?.language_code); setLangName(dropdownValue?.language_name); }}
                                       >
                                          {dropdownValue?.language_name}
                                       </a>
                                    </li>
                                 )))}
                              </ul>
                           </div>
                        </div>
                        <div className="col-md-6 login-input-group">
                        <div className="vendor-create-container">
                           <input
                              autoComplete="off"
                              onChange={(e) => setEmail(e.target.value)}
                              value={email}
                              type="text"
                              id="vendor-crt-input"
                              style={
                              email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                 ? { borderColor: "red" }
                                 : {}
                              }
                              className={`vendor-crt-input loginfilled-frame-username ${
                              email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                                 ? "error"
                                 : ""
                              }`}
                              placeholder=" "
                              required
                           />
                           <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                              <i className="fa-solid fa-at"></i> Email
                           </label>
                        </div>
                        {email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                           <div className="text-danger error-message-required">Invalid email format</div>
                        )}
                        </div>

                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <input type="text" id="vendor-crt-input"
                                 style={submit && storeName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                 onClick={handleGetStoreDrop} 
                                 value={storeName}
                                 autoComplete="off" onChange={(e)=>setStoreName(e.target.value)} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Store</label>
                              <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              <ul className="contatStore-dropdown-menu template-dropdown dropdown-menu">
                              {filteredStoreDrop.length === 0 ? (
                                 <li className="dropdown-nodata-found">No data found</li>
                              ) : (
                                 filteredStoreDrop.map((dropdownValue, id) => (
                                    <li key={id}>
                                       <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() => { setStoreName(dropdownValue.store_name); setStoreId(dropdownValue?.id) }}
                                       >
                                          {dropdownValue?.store_name}
                                       </a>
                                    </li>
                                 )))}
                              </ul>
                           </div>
                           {submit && storeName.length == 0 ? (
                              <div className="text-danger error-message-required">Store is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <div>
                                 <input type="text" id="vendor-crt-input" readOnly
                                    style={submit && groupName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                    onClick={handleGetGroupDrop} value={groupName.map(group => group.groupName).join(', ')} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Group</label>
                                 <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              </div>
                              <ul className="contatStore-dropdown-menu template-dropdown dropdown-menu">
                                 {groupDropDown?.map((dropdownValue, id) => (
                                    <li key={id} >
                                       <a
                                          className="dropdown-item "
                                          href="#"
                                          onClick={() => handleSelectGroup(dropdownValue)}
                                       >
                                          {dropdownValue?.group_name}
                                       </a>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           {groupName.map((item, index) => (
                              <div className="border mt-1 px-1" key={index} style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '5px', marginRight: '10px', borderRadius: '5px' }}>
                                 <span style={{ marginRight: '4px', fontSize: '10px', }}>{item.groupName}</span>
                                 <button
                                    style={{
                                       background: 'none',
                                       border: 'none',
                                       cursor: 'pointer',
                                       fontSize: '10px',
                                       color: '#a1a1a1',
                                       padding: '0'
                                    }}
                                    onClick={() => handleSelectGroupName(item)}
                                 >
                                    <i className="fa-solid fa-xmark group-xmark"></i>
                                 </button>
                              </div>
                           ))}
                           {submit && groupName.length == 0 ? (
                              <div className="text-danger error-message-required">Group is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                        <div className="col-md-6 mt-2">
                           <div className="form-check form-switch ms-1 is-filled">
                              <input
                                 className="form-check-input"
                                 type="checkbox"
                                 id="flexSwitchCheckDefault"
                                 onChange={()=>{
                                    if(customCampaign===true){
                                       setcustomCampaign(false)
                                    }
                                    else{
                                    setcustomCampaign(true)}
                                 }}
                                 checked={customCampaign===true}
                              /> <span className="text-xs">Custom Campaign</span>
                           </div>
                        </div>
                        <div className="col-md-6 mt-2">
                           <div className="form-check form-switch ms-1 is-filled">
                              <input
                                 className="form-check-input"
                                 type="checkbox"
                                 id="flexSwitchCheckDefault"
                                 onChange={()=>{
                                    if(campaignOpt===true){
                                       setcampaignOpt(false)
                                    }
                                    else{
                                    setcampaignOpt(true)}
                                 }}
                                 checked={campaignOpt===true}
                              /> <span className="text-xs">Opt out Marketing Messages</span>
                           </div>
                        </div>
                        <div className="campaign-template mt-5">
                           <h6 className="campaign-temp-head">Other Information</h6>
                           <div className="row">
                           <div className="col-md-6 login-input-group">
                              <div className="vendor-contact-container" aria-expanded="false">
                                 <input type="date" id="vendor-crt-input" autoComplete="off" onChange={(e) => setDate(e.target.value)} value={date} className="vendor-crt-input" placeholder=" " />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Date of birth</label>
                              </div>
                              </div>
                              <div className="col-md-6 login-input-group">
                              <div className="vendor-contact-container" aria-expanded="false">
                                 <div className="vendor-create-container">
                                    <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e) => setAddress(e.target.value)} value={address} className="vendor-crt-input" placeholder=" "
                                       required />
                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Address</label>
                                 </div>
                              </div>
                              </div>
                              <div className="col-md-6 login-input-group">
                              <div className="vendor-contact-container" aria-expanded="false">
                                 <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e) => setLoyality(e.target.value)} value={loyality} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Loyalty_rs</label>
                              </div>
                              </div>
                              <div className="col-md-6 login-input-group">
                              <div className=" vendor-contact-container" aria-expanded="false">
                                 <input type="date" id="vendor-crt-input" autoComplete="off" onChange={(e) => setAnniversary(e.target.value)} value={anniversary} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label">Anniversary</label>
                              </div>
                              </div>

                           <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <div>
                                 <input type="text" id="vendor-crt-input" readOnly
                                   value={genderDropDown} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-venus-double"></i> Gender</label>
                                 <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              </div>
                              <ul className="contatStore-dropdown-menu template-dropdown dropdown-menu">
                              <li><a className="dropdown-item" onClick={()=>setgenderDropDown("Male")}>Male</a></li>
                              <li><a className="dropdown-item" onClick={()=>setgenderDropDown("Female")}>Female</a></li>
                              <li><a className="dropdown-item" onClick={()=>setgenderDropDown("Others")}>Others</a></li>
                              </ul>
                           </div>
                           
                        </div>
                        <div className="col-md-6 login-input-group">
                        <div className="vendor-contact-container" aria-expanded="false">
                              <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e) => setsaleAmount(e.target.value)} value={saleAmount} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label">Sale Amount</label>
                           </div>
                        </div>
                        {contactField.map((fieldData: any) => (
                        fieldData.type === "Dropdown" ? (
                           <div className="col-md-6 login-input-group" key={fieldData.id}>
                           <div className="vendor-create-container dropdown">
                               <input
                                   id={`vendor-crt-input-${fieldData.id}`}
                                   className={`vendor-crt-input loginfilled-frame-username ${
                                    submit && fieldData.is_required === "true" && !formValues[fieldData.name]?.trim() ? 'error' : ''
                                  }`}
                                   value={formValues[fieldData.name] || ''}
                                   placeholder=" "
                                   readOnly
                                   data-bs-toggle="dropdown"
                                   aria-expanded="false"
                               />
                               <label htmlFor={`vendor-crt-input-${fieldData.id}`} className="vendor-crt-label">
                                   {fieldData.label}
                               </label>
                               <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                       
                               <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                   {fieldData.options?.length ? (
                                       fieldData.options.map((option: string, idx: number) => (
                                           <li key={idx}>
                                               <a
                                                   className="dropdown-item"
                                                   href="#"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       handleChange(fieldData.id,fieldData.name, option);
                                                   }}>
                                                   {option}
                                               </a>
                                           </li>
                                       ))
                                    ) : (
                                       <li className="dropdown-nodata-found">No data found</li>
                                   )}
                               </ul>
                           </div>
                           {submit && fieldData.is_required === "true" && !formValues[fieldData.name]?.trim() && (
                                 <div className="text-danger error-message-required">
                                    {fieldData.label} is required
                                 </div>
                              )}
                       </div>
                        ) : (
                        <div className="col-md-6 login-input-group" key={fieldData.id}>
                              <div className="vendor-contact-container">
                                 <input
                                    type={fieldData.type}
                                    id={`vendor-crt-input-${fieldData.id}`}
                                    autoComplete="off"
                                    onChange={(e) => handleChange(fieldData.id,fieldData.name, e.target.value)}
                                    value={formValues[fieldData.name] || ''}
                                    className={`vendor-crt-input loginfilled-frame-username ${
                                       submit && fieldData.is_required === "true" && !formValues[fieldData.name]?.trim() ? 'error' : ''
                                     }`}
                                    placeholder=" "
                                    required={fieldData.is_required === "true"}
                                 />
                                 <label htmlFor={`vendor-crt-input-${fieldData.id}`} className="vendor-crt-label">
                                    {fieldData.label}
                                 </label>
                              </div>
                              {submit && fieldData.is_required === "true" && !formValues[fieldData.name]?.trim() && (
                                 <div className="text-danger error-message-required">
                                    {fieldData.label} is required
                                 </div>
                              )}
                        </div>
                        )
                     ))}
                        </div>
                        </div>
                     </div>
                  </div>
                  <div className="modal-footer vendorcreate-modal-footer border-0">
                     <button type="button" className="btn btn-secondary" onClick={resetForm} data-bs-dismiss="modal" id="closeCreate">Close</button>
                     {modalMode === 'create' ? <button onClick={superAdminContactCreate} type="button" className="btn btn-primary">
                        Create
                     </button> : <button onClick={superAdminContactCreate} type="button" className="btn btn-primary">
                        Update
                     </button>}
                  </div>
               </div>
            </div>
         </div>
         {/* Contact Group Assign */}
         <div className="modal fade" id="contactassignGroup" aria-labelledby="contactassignGroupLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content">
                  <div className="modal-header vendor-view-header">
                     <h1 className="modal-title fs-6 mb-3 text-center" id="contactassignGroupLabel">Assign Groups to Selected Contacts</h1>
                  </div>
                  <div className="p-0 modal-body ">
                     <div className="row">
                     <div className="col-md-12 login-input-group" style={{padding:'0 7%'}}>
                           <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                 <input type="text" id="vendor-crt-input px-3" readOnly
                                    style={submit && groupName.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                                    onClick={handleGetGroupDrop} value={groupName.map(group => group.groupName).join(', ')} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Group</label>
                                 <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              <ul className="contatStore-dropdown-menu template-dropdown dropdown-menu">
                                 {groupDropDown?.map((dropdownValue, id) => (
                                    <li key={id} >
                                       <a
                                          className="dropdown-item "
                                          href="#"
                                          onClick={() => handleSelectGroup(dropdownValue)}
                                       >
                                          {dropdownValue?.group_name}
                                       </a>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           {groupName.map((item, index) => (
                              <div className="border mt-1 px-1" key={index} style={{ display: 'inline-flex', marginBottom: '5px', marginRight: '10px', borderRadius: '5px' }}>
                                 <span style={{ marginRight: '4px', fontSize: '10px', }}>{item.groupName}</span>
                                 <button
                                    style={{
                                       background: 'none',
                                       border: 'none',
                                       cursor: 'pointer',
                                       fontSize: '10px',
                                       color: '#a1a1a1',
                                       padding: '0'
                                    }}
                                    onClick={() => handleSelectGroupName(item)}
                                 >
                                    <i className="fa-solid fa-xmark group-xmark"></i>
                                 </button>
                              </div>
                           ))}
                           {submit && groupName.length == 0 ? (
                              <div className="text-danger error-message-required">Group is required </div>
                           ) : (
                              <></>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className="modal-footer text-end vendor-view-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="contactCloseModal" onClick={resetForm}>Close</button>
                     <button type="button" className="btn btn-primary" onClick={contactGroupBulkAssign}>Submit</button>
                  </div>
               </div>
            </div>
         </div>
         {/* Contact Delete */}
         <div className="modal fade" id="vendordelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content vendor-delete-content">
                  <div className=" vendor-delete-header">
                  </div>
                  <div className="modal-body vendor-delete-body">
                     <div className="row">
                        <div className="vendor-delete-icon">
                           <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h5 className="modal-confirm-head">Are You Sure !</h5>
                        <h6 className="modal-confirm-subhead">You want to delete this {fName}{lName} contact permanently?</h6>
                        <div></div>
                     </div>
                  </div>
                  <div className="modal-footer text-center vendor-delete-footer">
                     <button type="button" className="btn btn-secondary" id="deleteCreate" data-bs-dismiss="modal" onClick={resetForm}>No</button>&nbsp;
                     <button type="button" onClick={() => superAdminContactDelete()} className="btn btn-primary">Yes</button>
                  </div>
               </div>
            </div>
         </div>
         {/* Contact Selected Delete */}
         <div className="modal fade" id="vendorselecteddelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content vendor-delete-content">
                  <div className=" vendor-delete-header">
                  </div>
                  <div className="modal-body vendor-delete-body">
                     <div className="row">
                        <div className="vendor-delete-icon">
                           <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h5 className="modal-confirm-head">Are You Sure !</h5>
                        <h6 className="modal-confirm-subhead">You want to delete all selected contact permanently?</h6>
                        <div></div>
                     </div>
                  </div>
                  <div className="modal-footer text-center vendor-delete-footer">
                     <button type="button" className="btn btn-secondary" id="selecteddelete" data-bs-dismiss="modal" onClick={resetForm}>No</button>&nbsp;
                     <button type="button" onClick={() => superAdminContactBulkDelete()} className="btn btn-primary">Yes</button>
                  </div>
               </div>
            </div>
         </div>
         {/* Contact All Delete */}
         <div className="modal fade" id="vendoralldelete" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content vendor-delete-content">
                  <div className=" vendor-delete-header">
                  </div>
                  <div className="modal-body vendor-delete-body">
                     <div className="row">
                        <div className="vendor-delete-icon">
                           <i className="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <h5 className="modal-confirm-head">Are You Sure !</h5>
                        <h6 className="modal-confirm-subhead">You want to delete all contact permanently?</h6>
                        <div></div>
                     </div>
                  </div>
                  <div className="modal-footer text-center vendor-delete-footer">
                     <button type="button" className="btn btn-secondary" id="alldelete" data-bs-dismiss="modal" onClick={resetForm}>No</button>&nbsp;
                     <button type="button" onClick={() => handlecontactDeleteAll()} className="btn btn-primary">Yes</button>
                  </div>
               </div>
            </div>
         </div>

        {/* Contact Export */}
        <div className="modal fade" id="vendorExport" aria-labelledby="vendorExportLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
               <div className="modal-content all-modal-content">
                  <div className="modal-header vendor-view-header">
                     <h1 className="modal-title fs-6 mb-3 text-center" id="vendorExportLabel">Export Contact</h1>
                  </div>
                  <div className="p-0 modal-body text-center ">
                     <div className="exportwithData">
                        <p className="exportwithData-para">Export with Data</p>
                        <p className="exportwithData-para1">You can export all contacts excel file and import it back with updated data.</p>
                        <button className="exportwithData-btn" onClick={()=>{handleExport("withData")}}>
                           Export Excel File With Data
                        </button>
                     </div>
                     {/* <hr className="exportModal-hr"/>
                     <div className="exportwithoutData">
                        <p className="exportwithData-para">Blank Excel Template</p>
                        <p className="exportwithData-para1">You can export blank excel file and fill with data according to column header and import it for updates.</p>
                        <button className="exportwithData-btn" onClick={()=>{handleExport("withoutData")}}>
                           Export Blank Template
                        </button>
                     </div> */}
                  </div>
                  <div className="modal-footer text-end vendor-view-footer">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
               </div>
            </div>
         </div>

         {/* import model */}

         <div className="modal fade" id="contactImport" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
               <div className="modal-content all-modal-content modal-container-size vendor-delete-content">
                  <div className="modal-header vendorcontact-modal-header border-0">
                     <h5 className="modal-title vendorcontact-modal-title" id="vendorcontactLabel">
                        Import Contacts
                     </h5>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>


                  <div className="modal-body">
                     <div className="row">
                        <div className="col-md-12">
                           <div className="use-templates">
                              Please use Template from Export contacts
                           </div>
                        </div>
                        <hr />

                        <div className="col-md-12">
                           <div>You can import excel file with new contacts or existing updated.</div>
                        </div>

                        <div className="col-md-12">
                           <div className="conventions">
                              <p className="p-export">Conventions</p>
                              <p className="p-export">Mobile Number</p>
                              <p>Mobile number treated as unique entity, it should be with country code without prefixing 0 or +, if the Mobile number is found in the records other information for the same will get updated with data from the excel.</p>
                              <p className="p-export">Group</p>
                              <p>Use comma separated group title, make sure groups are already exists into the system. Groups won't be deleted, only new groups will be assigned.</p>

                           </div>
                        </div>

                        <div className="col-md-12">
                           <div className="file-input">
                              <input className="file-input-browser" type="file" name="" id="" />

                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="text-end mt-5 vendor-delete-footer">
                     <button type="button" className="btn btn-secondary import-close-btn" id="deleteCreate" data-bs-dismiss="modal">Close</button>&nbsp;
                     <button type="button" className="btn btn-secondary import-close-btn process-import" id="deleteCreate" data-bs-dismiss="modal">Process Import</button>&nbsp;

                  </div>
               </div>
            </div>
         </div>

         {/* Contact Import Modal */}
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
                        Import Contact
                     </h1>
                     <div>
                        <button className="vendor-crt-btn import-sample-filebtn" onClick={()=>{handleExport("withoutData")}}><i className="fa-solid fa-file-download"></i> Sample File</button>
                     </div>
                  </div>
                  <div className="modal-body text-center">
                     
                     <form className="form-container" encType="multipart/form-data">
                     <div className="upload-files-container" onDragOver={(e) => e.preventDefault()} onDrop={handleFileDrop}>
                           <div className="drag-file-area">
                              <i className="fa-solid fa-cloud-arrow-up import-staff-icon"></i>
                              <h5 className="dynamic-message mt-2 mb-n1 grayFont">
                                 Drop Anywhere to Import
                              </h5>
                              <label className="label grayFont">
                                 or{" "}
                                 <span className="browse-files">
                                    <input
                                       type="file"
                                       className="default-file-input"
                                       onChange={handleFileChange} ref={fileInputRef}
                                    />
                                    <span className="browse-files-text text-dark">
                                       browse file
                                    </span>{" "}
                                    <span className="grayFont">from device</span>
                                 </span>
                              </label>
                           </div>
                           {fileName && (
                              <div className="file-name mt-2">Selected File: {fileName}</div>
                           )}
                        </div>
                     </form>
                  </div>
                  <div className="modal-footer import-popup-footer">
                     
                     <button type="button" onClick={() => { setFileName('') }} className="btn btn-secondary" data-bs-dismiss="modal" id="closepopup">
                        Close
                     </button>
                     <button type="button" className="btn btn-primary import-btn-bg" onClick={handleImport}>
                        Import
                     </button>
                  </div>
               </div>
            </div>
         </div>
         {/* contact view */}

         <div className="modal fade" id="contactview" tab-index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
               <div className="modal-content all-modal-content modal-container-size vendor-delete-content">
                  <div className="modal-header vendorcontact-modal-header border-0">
                     <h5 className="modal-title vendorcontact-modal-title" id="vendorcontactLabel">
                        Contact Details
                     </h5>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                     <div className="row">
                        <div className="col-md-6">
                           <h6 className="text-sm">First Name</h6>
                           <p>{fName}</p>
                        </div>

                        <div className="col-md-6">
                           <h6 className="text-sm">Last Name</h6>
                           <p>{lName}</p>
                        </div>

                        <div className="col-md-6">
                           <h6 className="text-sm">Country Name</h6>
                           <p>{countryName}</p>
                        </div>
                        <div className="col-md-6">
                           <h6 className="text-sm">Mobile</h6>
                           <p>{mobNumber}</p>
                        </div>
                        <div className="col-md-6">
                           <h6 className="text-sm">Language Code</h6>
                           <p>{langName}</p>
                        </div>
                        <div className="col-md-6">
                           <h6 className="text-sm">Email</h6>
                           <p>{email}</p>
                        </div>
                        <div className="col-md-12 mt-3">
                           <div className="create-contact">
                              <h5 className="contact-absolute" >Other Information</h5>
                              <div>DOB: {date}</div>
                              <div className="mt-2 mb-2">Address: {address}</div>
                              <div>loyalty_rs: {loyality}</div>
                           </div>
                        </div>

                     </div>
                  </div>
                  <div className="modal-footer text-end border-0">
                     <button type="button" className="btn btn-secondary" id="deleteCreate" data-bs-dismiss="modal" onClick={resetForm}>Close</button>&nbsp;

                  </div>
               </div>
            </div>
         </div>
      </DashboardLayout>
   )
}

export default StoreContacts;