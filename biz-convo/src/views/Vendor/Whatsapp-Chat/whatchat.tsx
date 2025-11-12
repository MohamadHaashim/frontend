import { Link, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import './whatchat.css';
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import API from "../../../api/api";
import { toast } from "react-toastify";
import API_EP_BOOK from "../../../api/endpoints";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { format } from "date-fns";
import _ from "lodash";
import { Pagination } from "react-bootstrap";
import Footer from "../../../shared/Footer";


interface Message {
    text: string;
    file: File | null;
    timestamp: string;
    type: "text" | "file";
}
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
const WhatsApp_Chat: React.FC = () => {
    const [ShowChat, setShowChat] = useState(true);
    const [ShowChat1, setShowChat1] = useState(false);
    const [sidelistLoading, setsidelistLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("all");
    const[chatList,setChatListData]=useState<any>([]);
    const[contactSideList,setContactSideList]=useState<any[]>([]);
    const[contactunreadSideList,setContactunreadSideList]=useState<any[]>([]);
    const location = useLocation();
    const contactDetailsValue = location.state?.chatDetails || {};
    const ClickMe = () => {
        setShowChat(true);
        setShowChat1(false);
        setActiveTab("all");

    }

    const ClickMe1 = () => {
        setShowChat(false);
        setShowChat1(true);
        setActiveTab("mine");
    }
    const [langCodeDrop, setlangCodeDrop] = useState<LangCodeDrop[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedSearch1, setDebouncedSearch1] = useState('');
    const [to,setTo] = useState(contactDetailsValue.mobile);
    const [unreadTo, setUnreadTo] = useState<string[]>([]);
    const [isMediaMessage,setisMediaMessage] = useState(false);
    const [mediaType,setmediaType] = useState("");
    const [caption,setcaption] = useState("");
    const [contactName,setcontactName] = useState(contactDetailsValue.firstName);
    const [contactNumber,setcontactNumber] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [showPicker, setShowPicker] = useState(false);
    const [chatPopup, setChatPopup] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [chatloading, setchatLoading] = useState(false);
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
    const [langName, setLangName] = useState('')
    const [groupName, setGroupName] = useState<any[]>([]);
    const [groupId, setGroupId] = useState<string[]>([]);
    const [id, setId] = useState('');
    const [parentWamId, setparentWamId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const [recordsPerPage,setrecordsPerPage] = useState(20);
    const [siderecordsPerPage,setsiderecordsPerPage] = useState(20);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [ListBot, setListBot] = useState(false);
    const [sidecount, setSidecount] = useState(false);
    const [hasMore, sethasMore] = useState();
    const [sidehasMore, setsidehasMore] = useState();
    const [showScrollBottom, setShowScrollBottom] = useState(true);
    const [customCampaign, setcustomCampaign] = useState(false);
    const [campaignOpt, setcampaignOpt] = useState(false);
    const [readCount, setreadCount] = useState(false);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        chatBodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToBottom = () => {
        const el = chatBodyRef.current;
        if (el) {
            el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
    const chatDiv = chatBodyRef.current;

    const handleScroll = () => {
        if (chatDiv) {
        const scrollTop = chatDiv.scrollTop;
        const scrollHeight = chatDiv.scrollHeight - chatDiv.clientHeight;

        setShowScrollTop(scrollTop > 100); // Show top button if scrolled down
        setShowScrollBottom(scrollTop < scrollHeight - 100); // Show bottom button if not at bottom
        }
    };
    
    chatDiv?.addEventListener('scroll', handleScroll);
    return () => chatDiv?.removeEventListener('scroll', handleScroll);
    }, []);
const emojiPickerRef = useRef<HTMLDivElement | null>(null);
const editorWrapperRef = useRef<HTMLDivElement | null>(null);
const editorInstanceRef = useRef<any>(null);
useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
   const emojiPickerEl = emojiPickerRef.current;
   const editorEl = editorWrapperRef.current;
   if (
    showPicker &&
     emojiPickerEl &&
     !emojiPickerEl.contains(event.target as Node) &&
     editorEl &&
     !editorEl.contains(event.target as Node)
   ) {
     setShowPicker(false);
     setTimeout(() => {
          const editor = editorInstanceRef.current;
          if (editor && typeof editor.focus === 'function') {
            editor.focus(); // Safe focus
          }
        }, 50);
      }
 };

 document.addEventListener("mousedown", handleClickOutside);
 return () => {
   document.removeEventListener("mousedown", handleClickOutside);
 };
}, [showPicker]);
    const handleEmojiClick = (emojiObject: EmojiClickData) => {
        setMessage((prev) => prev + emojiObject.emoji);
        // setShowPicker(false);
    };
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const start = (currentPage - 1) * recordsPerPage + 1;
  const end = Math.min(currentPage * recordsPerPage, totalRecords);
    const handlePageChange = (pageNumber: any) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };
    const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 7;


   

    const isNearStart = currentPage <= 4;
    const isNearEnd = currentPage >= totalPages - 3;

    if (totalPages <= maxVisiblePages) {
        // Show all pages
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }
    } else {
        if (isNearStart) {
            // Start part: 1 2 3 4 ... N
            for (let i = 1; i <= 4; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        {i}
                    </Pagination.Item>
                );
            }
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            items.push(
                <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        } else if (isNearEnd) {
            // End part: 1 ... N-3 N-2 N-1 N
            items.push(
                <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            for (let i = totalPages - 3; i <= totalPages; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        {i}
                    </Pagination.Item>
                );
            }
        } else {
            // Middle part: 1 ... C-1 C C+1 ... N
            items.push(
                <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
                    1
                </Pagination.Item>
            );
            items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
            for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                        {i}
                    </Pagination.Item>
                );
            }
            items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
            items.push(
                <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }
    }

    return items;
};

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        console.log(selectedFile);
    
        if (selectedFile) {
            const mimeType = selectedFile.type;
    
            setSelectedFile(selectedFile);
            setisMediaMessage(true);
            setFileName(selectedFile.name);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            
            if (mimeType.startsWith("image/")) {
                setmediaType("image");
            } else if (mimeType.startsWith("video/")) {
                setmediaType("video");
            } else if (mimeType.startsWith("audio/")) {
                setmediaType("audio");
            } else if (mimeType === "application/pdf") {
                setmediaType("document");
            } else if (
                mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                mimeType === "application/msword"
            ) {
                setmediaType("document");
            } else {
                setmediaType("unknown");
            }
        }
    };
    

    const sendMessage = () => {
        if (!message.trim() && !selectedFile) return;
        handleChatsend();
        const formattedTimestamp = new Date().toLocaleString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });

        const newMessage: Message = {
            text: selectedFile ? selectedFile.name : message,
            file: selectedFile,
            timestamp: formattedTimestamp,
            type: selectedFile ? "file" : "text",
        };

        setMessages([...messages, newMessage]);
        setMessage("");
        setSelectedFile(null);
    };
    const resetForm=()=>{
        setSelectedFile(null);
        setcaption("");
        setmediaType("");
        setFileName("");
    }
    const handleChatsend = async () => {
        const formData = new FormData();
        formData.append("to", to);
        formData.append("text", message);
        if (selectedFile) {
            if (!selectedFile) {
                toast.error("Please select a file to import.");
                return;
            }
            formData.append("isMediaMessage", isMediaMessage.toString());
            formData.append("media_type", mediaType);
            formData.append("caption", caption);
            formData.append("file", selectedFile);
        }
        
        try {
            const response = await VendorAPI.whatsappChatsendAPI(formData);
            if (response?.apiStatus?.code==="200") {
                handleChatList(to,false);
                resetForm();
                const closeButton = document.getElementById("wachatImgclose");
                if (closeButton) {
                   closeButton.click();
                }
                // toast.success(response?.apiStatus?.message);
            } else {
                toast.error(response.apiStatus?.message);
            }
        } catch (error) {
            console.error("Import Error:", error);
            toast.error("An error occurred while importing the file.");
        }
    };
  //   Get By Id

  const contactListGet = async (id:any) => {
    try {
       const responseData = await VendorAPI.contactGetAPI(id);
       if (responseData.apiStatus.code === '200') {
          const data = responseData?.result
          setId(data?.contactId)
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
          setAddress(data?.otherInformation?.address);
          const customCampaign=data?.send_custom_campaign;
          setcustomCampaign(customCampaign==="1" ? true : false);
          const campaignOpt=data?.campaign_opt_out;
          setcampaignOpt(campaignOpt==="1" ? true : false);
          const groupNames = data?.groupDetails.map((group: any) => group.groupName);
          setGroupName(data?.groupDetails);
          const groupIds = data?.groupDetails.map((group: any) => group.groupId);
          setGroupId(groupIds);
       } else if(responseData?.apiStatus?.code==="404") {
          setId("");
          setFName("")
          setLName("")
          setgenderDropDown("")
          setcountryName("")
          setStoreId("")
          setStoreName("")
          setDate("")
          setsaleAmount("")
          setMobNumber("")
          setLangName("")
          setLanguageCode("")
          setEmail("")
          setLoyality("")
          setAnniversary("")
          setAddress("")
          setGroupName([]);
          setGroupId([]);
       }
    } catch (error) {
       console.error("Error during API call:", error);
       toast.error("An error occurred during the get process.");
    }
 };  
 const navigate = useNavigate();   
 const handleNavigate = () => {
    const contactDetailsData = {
       firstName: fName,
       lastName: lName,
       mobile: mobNumber,
       country:countryName,
    };

    navigate(`/vendor/contact/whatsapp/contact/send-template-message/${id}`, { state: { contactDetailsData } });
 };
const previousChatRef = useRef<any[]>([]);
const previousToRef = useRef<any>(null);
const isFirstLoadRef = useRef(true);
const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoLoaded = useRef(false);
const [slidesMap, setSlidesMap] = useState<Record<string, any[]>>({});
const [indices, setIndices] = useState<Record<string, number>>({});
 
console.log(slides,"slides")
  // 🔁 Convert listData to slide format
 useEffect(() => {
  if (Array.isArray(chatList)) {
    const carouselMessages = chatList.filter(
      (msg) =>
        msg.messageAgent === "bot" &&
        msg.message_type === "carousel" &&
        msg.messageBody?.templateText?.cards
    );
 
    const newSlidesMap: Record<string, any[]> = {};
    carouselMessages.forEach((msg) => {
      newSlidesMap[msg.time] = msg.messageBody.templateText.cards.map(
        (card: any, idx: number) => {
          const isVideo = card.header_image_link?.endsWith(".mp4");
          return {
            id: `${msg.time}-${idx}`,
            src: card.header_image_link,
            title: "",
            format: isVideo ? "video" : "image",
            bodyText: card.body_texts,
            buttons:
              card.buttons?.map((btn: any) => ({
                text: btn.value,
                type: btn.sub_type,
              })) || [],
          };
        }
      );
    });
 
    setSlidesMap(newSlidesMap);
 
    // initialize indices for new messages if missing
    setIndices((prev) => {
      const updated = { ...prev };
      Object.keys(newSlidesMap).forEach((key) => {
        if (updated[key] === undefined) updated[key] = 0;
      });
      return updated;
    });
  }
}, [chatList]);
 
 
  // ⬅️ Previous Slide
  const prevSlide = (msgTime: string) => {
  setIndices((prev) => {
    const slides = slidesMap[msgTime] || [];
    const current = prev[msgTime] ?? 0;
    return {
      ...prev,
      [msgTime]: current === 0 ? slides.length - 1 : current - 1,
    };
  });
};
 
  // ➡️ Next Slide
  const nextSlide = (msgTime: string) => {
  setIndices((prev) => {
    const slides = slidesMap[msgTime] || [];
    const current = prev[msgTime] ?? 0;
    return {
      ...prev,
      [msgTime]: current === slides.length - 1 ? 0 : current + 1,
    };
  });
};


const handleChatList = (to: any, isManual = true) => {
    if (isManual) {
    setchatLoading(true);
  }
   
    let updatedRecordsPerPage = recordsPerPage;

    if (previousToRef.current !== to) {
    updatedRecordsPerPage = 20;
    setrecordsPerPage(20);
    // window.scrollTo({
    //   top: document.body.scrollHeight,
    //   behavior: 'smooth',
    // });
    scrollToBottom();
    }
// if (isManual) {
//             scrollToBottom();  
//         }
    // Update previousToRef
    previousToRef.current = to;

    const apiData = { filter: 
        { to },
        pageIndex:"0",
        dataLength: recordsPerPage
    };

    VendorAPI.whatsappChatListAPI(apiData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === '200') {
             window.dispatchEvent(new Event('triggerWappCount'));
          const newChatData = responseData.responseData.MessageData;
          const isSame = _.isEqual(previousChatRef.current, newChatData);
          if (!isSame) {
            setChatListData(newChatData);
            sethasMore(responseData?.responseData?.hasMore);
            previousChatRef.current = _.cloneDeep(newChatData);
          } 
        } else if (responseData.apiStatus.code === '404') {
          setChatListData([]);
          previousChatRef.current = []; 
        }
      })
      .catch((error: any) => {
        console.error("Error during chat fetch:", error);       
      })
      .finally(() => {
      if (isManual) {
       setchatLoading(false);
      }
    });
      
};
  
    const idSetRef = useRef(false);
    const handleContactSideList = (page:any,search:string) => {
            setsidelistLoading(true);
            const apiData = {
                pageIndex:"0",
                dataLength:siderecordsPerPage,
                filter:{search:search},
                unread:readCount};
            VendorAPI.whatsappContactSideListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                setLoading(false)
                setsidelistLoading(false)
                const messageData = responseData.responseData.MessageData;
                if (contactDetailsValue && Object.keys(contactDetailsValue).length > 0) {
                const newContact = {
                    contactNumber: contactDetailsValue.mobile,
                    contactName: contactDetailsValue.firstName
                };

                const isDuplicate = messageData.some(
                    (item:any) => item.contactNumber === newContact.contactNumber
                );

                if (!isDuplicate) {
                    const updatedData = [newContact, ...messageData];
                    setContactSideList(updatedData);
                } else {
                    setContactSideList(messageData);
                }
                } else {
                setContactSideList(messageData);
                }
 
            setTotalRecords(responseData?.responseData?.totalRecordCount);
            setsidehasMore(responseData?.responseData?.hasMore);
            setTotalUnreadCount(responseData?.responseData?.totalUnreadCount);
            if (
                location.pathname === "/vendor/whatapp-chat" &&
                !idSetRef.current &&
                messageData.length > 0
            ) {
                if(messageData[0].contactId){
                    setId(messageData[0].contactId);
                }
                else{
                    // setcontactNumber(messageData[0].contactNumber);
                }
                idSetRef.current = true; 
            }
            } else {
               if (responseData.apiStatus.code == "404") {
                setContactSideList([]);
               }
            //    toast.error(responseData.apiStatus.message);
               setLoading(false)
               setsidelistLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            setsidelistLoading(false)
            console.error("Error while fetching contact sidelist details:", error);
            toast.error("An error occurred while fetching contact sidelist details.");
         });
   }
    const handleContactUnreadSideList = (page:any,search:string) => {
            setLoading(true)
            setsidelistLoading(true)
            const apiData = {
                pageIndex:"0",
                dataLength:siderecordsPerPage,
                filter:{search:search},
                };
            VendorAPI.whatsappContactUnreadSideListAPI(apiData)
            .then((responseData: any) => {
                if (responseData.apiStatus.code === '200') {
                setLoading(false)
                setsidelistLoading(false)
                const messageData = responseData.responseData.MessageData;
                if (contactDetailsValue && Object.keys(contactDetailsValue).length > 0) {
                const newContact = {
                    contactNumber: contactDetailsValue.mobile,
                    contactName: contactDetailsValue.firstName
                };

                const isDuplicate = messageData.some(
                    (item:any) => item.contactNumber === newContact.contactNumber
                );

                if (!isDuplicate) {
                    const updatedData = [newContact, ...messageData];
                    setContactunreadSideList(updatedData);
                } else {
                    setContactunreadSideList(messageData);
                }
                } else {
                setContactunreadSideList(messageData);
                }
 
            setTotalRecords(responseData?.responseData?.totalRecordCount);
            setsidehasMore(responseData?.responseData?.hasMore);
            setTotalUnreadCount(responseData?.responseData?.totalUnreadCount);
            if (
                location.pathname === "/vendor/whatapp-chat" &&
                !idSetRef.current &&
                messageData.length > 0
            ) {
                if(messageData[0].contactId){
                    setId(messageData[0].contactId);
                }
                else{
                    // setcontactNumber(messageData[0].contactNumber);
                }
                idSetRef.current = true; 
            }
            } else {
               if (responseData.apiStatus.code == "404") {
                setContactunreadSideList([]);
               }
            //    toast.error(responseData.apiStatus.message);
               setLoading(false)
               setsidelistLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            setsidelistLoading(false)
            console.error("Error while fetching unread sidelist details:", error);
            toast.error("An error occurred while fetching unread sidelist details.");
         });
   }
//    const visibleContacts = readCount
//     ? contactSideList
//     : contactSideList.filter((listData) => Number(listData.unreadCount) > 0);
const handleChatClear = () => {
      const apiData = {contactNumber: to};
      VendorAPI.whatsappChatClearAPI(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData?.apiStatus?.message)
               handleChatList(to,true);
               const closeButton = document.getElementById("closedeleteModal");
               if (closeButton) {
                  closeButton.click();
               }
            } else {
               if (responseData.apiStatus.code == "404") {
               
               }
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            console.error("Error while fetching chat clear:", error);
            toast.error("An error occurred while fetching chat clear.");
         });
   }
   const isValidDate = (date: string | number): boolean => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
    };

   const contactUpdate = () => {
         let apiData = {
            ...({ contactId: id }),
            storeId: storeId,
            firstName: fName,
            lastName: lName,
            gender:genderDropDown,
            mobile: mobNumber,
            email: email,
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
   
         const apiCall = VendorAPI.contactEditAPI(apiData);
         apiCall
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  setLoading(false)
                  toast.success(responseData.apiStatus.message);
                  const closeButton = document.getElementById("closeCreate");
                  handleChatList(to,true);
                  handleContactSideList(currentPage,search)
                  if (closeButton) {
                     closeButton.click();
                  }
               } else {
                  setLoading(false)
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error: any) => {
               console.error("Error during API call:", error);
               toast.error("An error occurred during the API call.");
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
               console.error("Error while fetching store dropdown data:", error);
               toast.error("An error occurred while fetching store dropdown data.");
            });
      };
      //Store Dropdown Filter
      const filteredStoreDrop = storeDropDown.filter((dropdownValue) =>
         dropdownValue?.store_name.toLowerCase().includes(storeName.toLowerCase())
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
               console.error("Error while fetching country dropdown data:", error);
               toast.error("An error occurred while fetching country dropdown data.");
            });
      };
      //CountryDropdown Filter
      const filteredCountryDrop = countryDropDown.filter((dropdownValue) =>
         dropdownValue?.name.toLowerCase().includes(countryName.toLowerCase())
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
               console.error("Error while fetching group dropdown data:", error);
               toast.error("An error occurred while fetching group dropdown data.");
            });
      };
      function formatDate(timeString: string): string {
        // Expecting input format: "Day hh:mm:ss dd-mm-yyyy"
        const parts = timeString.trim().split(' ');
        if (parts.length !== 3) {
            console.warn('Invalid format. Expected "Day hh:mm:ss dd-mm-yyyy"');
            return '';        
        }
    
        const timePart = parts[1]; // "23:30:05"
        const datePart = parts[2]; // "12-06-2025"
    
        // Validate time format
        const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;
        // Validate date format
        const dateRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!timeRegex.test(timePart)) {
            console.warn('Invalid time format: must be hh:mm:ss');
            return '';
        }
    
        if (!dateRegex.test(datePart)) {
            console.warn('Invalid date format: must be dd-mm-yyyy');
            return '';
        }
    
        const [day, month, year] = datePart.split('-');
        const isoDateString = `${year}-${month}-${day}T${timePart}`;
    
        const date = new Date(isoDateString);
    
        // Days and Months
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsOfYear = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
    
        const dayOfWeek = daysOfWeek[date.getDay()];
        const dayOfMonth = date.getDate();
        const monthName = monthsOfYear[date.getMonth()];
        const yearNum = date.getFullYear();
    
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
    
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // Handle 0 => 12
    
        const strMinutes = minutes.toString().padStart(2, '0');
        const strSeconds = seconds.toString().padStart(2, '0');
    
        // Add day suffix (st, nd, rd, th)
        const suffix = (dayOfMonth % 10 === 1 && dayOfMonth !== 11) ? 'st' :
                       (dayOfMonth % 10 === 2 && dayOfMonth !== 12) ? 'nd' :
                       (dayOfMonth % 10 === 3 && dayOfMonth !== 13) ? 'rd' : 'th';
    
        return `${dayOfWeek} ${dayOfMonth}${suffix} ${monthName} ${yearNum} ${hours}:${strMinutes}:${strSeconds} ${ampm}`;
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
    dropdownValue?.language_name.toLowerCase().includes(langName.toLowerCase())
    );
    const handlewhatsappwebhookList = () => {
    const apiCall =  VendorAPI.whatsappwebhookList();
    apiCall
        .then((responseData: any) => {
            const message = responseData?.apiStatus?.message;
            const isWebhookConfigured = responseData?.responseData?.webhook_configured;
            
            if (message === 'Whatsapp not configured!' || isWebhookConfigured === false) {
              const modalElement = document.getElementById('webhookconfigure');
              if (modalElement) {
                const modal = new window.bootstrap.Modal(modalElement);
                modal.show();
              }
            }            
        })
        .catch((error: any) => {
         console.error("Error while fetching WhatsApp webhook list:", error);
         toast.error("An error occurred while fetching WhatsApp webhook list.");
        });
    };
       const [exportLoading, setexportLoading] = useState(false);
    
    const handleExport = async (name:any) => {
          setexportLoading(true);
          try {
             var response =await VendorAPI.exportChat();
             const blob = new Blob([response], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
             });
    
             // Validate that blob has size
             if (blob.size === 0) {
                throw new Error("Empty file received from server.");
             }
             const today = new Date();
             const formattedDate = `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear().toString().slice(-2)}`;
             const fileName = `whatsapp_chat_data_${formattedDate}.xlsx`;
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
          } catch (error) {
             setexportLoading(false);
             console.error("Error downloading file:", error);
             toast.error("Failed to download the file. Please try again.");
          }
       };
    const messageRefs = useRef<any>({});
    useEffect(() => {
    if (chatList.length > 0) {
        setTimeout(() => {
        if (recordsPerPage <= 20) {
            scrollToBottom();
        }
        }, 100);
    }
    }, [chatList]);

    useEffect(() => {
        const modalElements = [
        document.getElementById('exampleModal')
        ];
        const handleHidden = () => {resetForm();};
        modalElements.forEach((modalElement) => {modalElement?.addEventListener('hidden.bs.modal', handleHidden);});
        return () => {
        modalElements.forEach((modalElement) => {modalElement?.removeEventListener('hidden.bs.modal', handleHidden);});
        };
    }, []);
    useEffect(() => {
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    if (!id && myArray[3]) {
        setId(myArray[3]);
        console.log(myArray[3],"ChatIdz")
      }
    })
    useEffect(()=>{
        handlewhatsappwebhookList();
    }, []);
    useEffect(() => {
        const handler = setTimeout(() => {
          
          if (readCount === true) {
          setDebouncedSearch1(search);
          }
          else{
            setDebouncedSearch(search);
          }
          setCurrentPage(1);
        }, 1000);
    
        return () => {
          clearTimeout(handler);
        };
      }, [search]);
    useEffect(() => {
        if (to) {
        const timer = setTimeout(() => {
            handleContactSideList(siderecordsPerPage, debouncedSearch);
        }, 100);
        return () => clearTimeout(timer);
        } else {
            // handleContactSideList(siderecordsPerPage, debouncedSearch);
        }
    }, [debouncedSearch, siderecordsPerPage, to]);
    useEffect(() => {
    const timer = setTimeout(() => {
        if (readCount === true) {
        // Only fetch unread contacts
        handleContactUnreadSideList(siderecordsPerPage, debouncedSearch1);
        } else {
        // Only fetch all contacts
        handleContactSideList(siderecordsPerPage, debouncedSearch1);
        }
    }, 100);

    return () => clearTimeout(timer);
    }, [debouncedSearch1, siderecordsPerPage, readCount]);

    useEffect(() => {
        // const interval = setInterval(() => {
        //     handleChatList(to, false); 
        //     handleContactSideList(siderecordsPerPage, debouncedSearch);
        // }, 10000);
        handleChatList(to, true); 
        // return () => clearInterval(interval);
    }, [to, recordsPerPage]);

    useEffect(()=>{
    if (id && id !== "undefined" && id !== "") {
        contactListGet(id);
        }
    }, [id]);
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
        if(location.pathname==="/vendor/whatapp-chat" && contactSideList.length > 0) {
            if (!sidecount) {
            setTo((contactSideList as any)[0]?.contactNumber);
            setcontactName((contactSideList as any)[0]?.contactName); 
            }
            else{
                setTo(to);
                setcontactName(contactName)
            }       
        }
    }, [contactSideList,sidecount]);
    
    useEffect(() => {
    if (parentWamId) {
        const timeout = setTimeout(() => {
        setparentWamId("");
        }, 3000);
        return () => clearTimeout(timeout);
    }
    }, [parentWamId]);

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
                                        <li className="breadcrumb-item text-sm"><Link className="opacity-5 text-dark" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                        <li className="breadcrumb-item text-sm text-dark active" aria-current="page">WhatsApp Chat</li>
                                    </ol>
                                    <h6 className="text-start font-weight-bolder mb-0">WhatsApp Chat</h6>
                                </nav>
                            </div>
                            <div className="col-md-6 text-end">
                                <button className="vendor-crt-btn" data-bs-toggle="modal" data-bs-target="#vendorExport">Export Chat <i className="fa-regular fa-comments"></i></button>
                            </div>
                        </div>
                        <div className="card p-3 mt-4">
                            <div className="row">
                                <div className="col-md-3">
                                    <h4>WhatsApp Chat</h4>
                                    <p className="whatsapp-chat-hr"></p>
                                    <div className="form-check form-switch ms-1 is-filled">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault"
                                        onChange={()=>setreadCount((prev)=>!prev)}
                                        /> <span>{readCount ?  "Show unread only" :"Show all"}</span>
                                        <span className="actionChathelp-tooltip-container">
                                        <p className="text-end whatsChat-help" style={{ cursor: 'help' }}>?</p>
                                        <div className="actionChathelp-tooltip-text">
                                            Once you get the response by the contact, they will be come in the chat list of this chat <br />
                                            window,alternatively you can click on chat button of the contact list to chat with <br /> the contact
                                        </div>
                                        </span>
                                    </div>
                                    
                                    <div className="mt-3">
                                        <ul className="nav nav-tabs custom-tabs">
                                            <li className="nav-item" onClick={ClickMe}>
                                                <p className={`nav-link ${activeTab === "all" ? "active-tab" : ""}`}>All {totalUnreadCount ? <span className="whatsChat-count">{totalUnreadCount}</span>:<></>}</p>
                                            </li>
                                            <li className="nav-item ms-2 ps-1" onClick={ClickMe1}>
                                                <p className={`nav-link ${activeTab === "mine" ? "active-tab" : ""}`}> Mine </p>
                                            </li>
                                        </ul>
                                        {ShowChat && (
                                            <>
                                                <div className="mt-3">
                                                    <div className="input-group">
                                                        
                                                        <span className="input-group-text text-body"><i className="fas fa-search" aria-hidden="true"></i></span>
                                                        <input type="text" onChange={(e) => setSearch(e.target.value)} autoComplete="off" className="form-control" placeholder="Type here..." />
                                                    </div>

                                                    <div className="mt-2">
                                                        <div className="card px-2 first-colm-scroll">
                                                            
                                                        {(readCount ? contactunreadSideList : contactSideList).length === 0 ? (
                                                        sidelistLoading ? (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "45px" }}>
                                                            <span className="sideList-loader">Loading...</span>
                                                        </div>
                                                        ):(
                                                        <p
                                                            className="table-list-nodata or-text"
                                                            style={{ textAlign: "center", marginTop: "40px" }}
                                                        >
                                                            <span>No data found</span>
                                                        </p>
                                                        )
                                                        ) : (
                                                        (readCount ? contactunreadSideList : contactSideList).map((listData: any) => (
                                                            
                                                            <div
                                                            key={listData?.contactId}
                                                            className={`d-flex flex-column gap-2 mb-1 ${
                                                                to === listData?.contactNumber ? "active-contact" : ""
                                                            }`}
                                                            onClick={() => {
                                                                setTo(listData?.contactNumber);
                                                                setcontactName(listData?.contactName);
                                                                setId(listData?.contactId);
                                                                setSidecount(true);
                                                                setUnreadTo(prev => 
                                                                    prev.includes(listData?.contactNumber) 
                                                                    ? prev 
                                                                    : [...prev, listData?.contactNumber]
                                                                );
                                                            }}
                                                            >
                                                            
                                                            <div className="d-flex gap-2 align-items-center cursor-pointer">
                                                                <div>
                                                                <h5 className="whatsapp-chat-profile-first mt-n1">
                                                                    {listData?.contactName?.trim()
                                                                    ? listData.contactName
                                                                        .trim()
                                                                        .split(" ")
                                                                        .map((word: string) => Array.from(word)[0]?.toUpperCase())
                                                                        .join("")
                                                                    : listData?.contactNumber?.slice(0, 2)}
                                                                </h5>
                                                                </div>
                                                                <div className="pt-3">
                                                                <h6 className="whitespace-pre-wrap">
                                                                    {listData?.contactName} {listData?.contactNumber}
                                                                </h6>
                                                                <p className="whatsapp-chat-profile-first-p mt-n2">
                                                                    {listData?.lastMessageTime}{" "}
                                                                    {!unreadTo.includes(listData?.contactNumber) && listData?.unreadCount ? (
                                                                    <span className="whatsChatSide-Count">
                                                                        {listData.unreadCount}
                                                                    </span>
                                                                    ) : null}
                                                                </p>
                                                                </div>
                                                            </div>
                                                            <hr className="whatsapp-chat-hr" />
                                                            </div>
                                                        ))
                                                        )}

                                                        {/* Show "Load more" only when readCount is false (i.e., showing all contacts) */}
                                                        {!readCount && contactSideList.length > 0 && sidehasMore && (
                                                        <div
                                                            className="text-center bg-white text-sm rounded mb-1 mt-2 p-1 cursor-pointer"
                                                            style={{
                                                            boxShadow:
                                                                "rgb(86 86 86 / 40%) 0px 2px 4px, rgb(223 223 223) 0px 7px 13px -3px, rgb(240 237 237 / 20%) 0px -3px 0px inset",
                                                            }}
                                                            onClick={() => setsiderecordsPerPage(siderecordsPerPage + 20)}
                                                        >
                                                            <i className="fa-solid fa-download"></i> Load more
                                                        </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        <div className="bg-white card campaign-template mt-5">
                                        <h6 className="campaign-temp-head">Notes</h6>
                                        <div>
                                            <h6>{contactName} - Task has been assigned</h6>
                                            <p>Status Updated</p>
                                        </div>
                                        </div>
                                            </>
                                        )}

                                        {ShowChat1 && (
                                            <>
                                                <div className="mt-3">
                                                    <div className="input-group">
                                                        <span className="input-group-text text-body"><i className="fas fa-search" aria-hidden="true"></i></span>
                                                        <input type="text" autoComplete="off" className="form-control" placeholder="Type here..." />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-7">
                                    <div className="chat-container">
                                        <div className="chat-header">
                                            <div className="d-flex gap-2">
                                                <div>
                                                    <h5 className="whatsapp-chat-profile-first">
                                                    {contactName?.trim()
                                                    ? contactName
                                                        .trim()
                                                        .split(' ')
                                                        .map((word: string) => Array.from(word)[0]?.toUpperCase())
                                                        .join('')
                                                    : to?.slice(0, 2)}
                                                    </h5>
                                                </div>
                                                <div>
                                                    <h6 className="text-white">{contactName} - <span className="text-success">{to}</span></h6>
                                                    <p className="whatsapp-chat-profile-first-p mt-n2 text-warning">You can't reply, they need to reply back to start the conversation.</p>
                                                </div>
                                            </div>
                                            <div className="btn-group dropstart">
                                                <i className="fa-solid fa-ellipsis-vertical cursor-pointer" data-bs-toggle="dropdown"></i>
                                                <ul className="dropdown-menu chat-three-dot-drop">
                                                    <li onClick={()=>{handleNavigate()}}><a className="dropdown-item" href=""><i className="fa-solid fa-mars"></i> Send template message</a></li>
                                                    <li><a className="dropdown-item" data-bs-toggle="modal" data-bs-target="#chatdelete" href=""><i className="fa-solid fa-eraser"></i> Clear chat history</a></li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="chat-body" ref={chatBodyRef} >
                                        <div className="conversation whatsapp-chat-msg-design">
                                            <div className="conversation-container chat-message-new">
                                                 {
                                                    chatloading ? (
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                            <span className="loader"></span>
                                                        </div>
                                                    ) : chatList.length === 0 ? (
                                                        <></>
                                                    ) : (
                                                        <>
                                                {hasMore===false ?
                                                <></>:<div className="text-center bg-white text-sm rounded mb-1 shadow p-1 cursor-pointer" onClick={()=>setrecordsPerPage(recordsPerPage+20)}>
                                                    <i className="fa-solid fa-download"></i> Load earlier messages</div>}
                                                {chatList.map((listData: any, id: number) => {
                                                    return(
                                                        
                                                <div key={id} ref={id === chatList.length - 1 ? lastMessageRef : null} >
                                                    {listData?.messageAgent === "user" ? (
                                                    <>
                                                    {listData?.messageAgent === "user" ?
                                                    // <div className="p-2 received val mb-1">
                                                    
                                                    <div ref={(el:any) => (messageRefs.current[listData.wam_id] = el)}
                                                        className={`p-2 received val mb-1 ${
                                                            parentWamId === listData.wam_id ? "highlighted-bot-msg" : ""
                                                        }`}>
                                                        <span className="position-relative d-inline-block">
                                                            {listData.messageBody.MessageMedia?.match(/\.(webp)$/i) && listData?.message_type==="sticker" ?
                                                            <>
                                                                <img style={{width:"35%"}} src={listData.messageBody.MessageMedia} alt="media" />
                                                            </>
                                                            :<></>}
                                                        </span>
                                                        <span className="p-2 chat-msg-1 position-relative d-inline-block">
                                                        
                                                        {listData?.parent_wam_id ? 
                                                        <div className="text-end text-xxs p-0 cursor-pointer"
                                                        onClick={() => {
                                                            setparentWamId(listData?.parent_wam_id||listData?.wam_id);
                                                            setTimeout(() => {
                                                                const target = messageRefs.current[listData?.parent_wam_id];
                                                                if (target) {
                                                                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                                }
                                                            }, 100);
                                                            }}
                                                            >
                                                            <i className="fa-solid fa-link" style={{color:"#8a9aab"}}> <span className="bot-replyTo">Replied To</span></i>
                                                        </div>:<></>}
                                                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',background: "gainsboro",borderRadius:"5px" }} className="w-100">
                                                        {(() => {
                                                            const mediaUrl = listData.messageBody.MessageMedia;
                                                            const message_type = listData.message_type;
                                                            const isWhatsAppCDNImage = mediaUrl?.includes('scontent.whatsapp.net');

                                                            if (mediaUrl?.match(/\.(mp4)$/i)) {
                                                                return <video controls className="w-80" src={mediaUrl} />;
                                                            }
                                                            if (mediaUrl?.match(/\.(jpeg|jpg|png|gif)$/i) || isWhatsAppCDNImage) {
                                                                return <img className="w-50" src={mediaUrl} alt="media" />;
                                                            }
                                                           if (message_type === "location") {
                                                            const latLongMatch = listData.messageBody.messageText?.match(/Lat\s*([-\d.]+),\s*Long\s*([-\d.]+)/i);
                                                            const latitude = latLongMatch?.[1];
                                                            const longitude = latLongMatch?.[2];
                                                            if (!latitude || !longitude) {
                                                                return <p>Invalid location data</p>;
                                                            }
                                                            const dynamicMapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
                                                            return (
                                                                <iframe
                                                                    src={dynamicMapUrl}
                                                                    width="600"
                                                                    height="250"
                                                                    loading="lazy"
                                                                    style={{ border: 0 }}
                                                                    allowFullScreen
                                                                    referrerPolicy="no-referrer-when-downgrade"
                                                                ></iframe>
                                                            ); }
                                                            if (mediaUrl?.match(/\.(mp3|ogg|aac)$/i)) {
                                                                return <audio controls src={mediaUrl} className="p-2"/>;
                                                            }
                                                            if (mediaUrl?.match(/\.(pdf|docx)$/i)) {
                                                                return (
                                                                <a
                                                                    href={mediaUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-50 text-center"
                                                                    style={{ color: '#007bff', textDecoration: 'underline' }}
                                                                >
                                                                    <i className="fa fa-3x fa-file-alt text-white"></i>
                                                                </a>
                                                                );
                                                            }

                                                            return null;
                                                            })()}

                                                        </span>
                                                        {listData?.message_type==="location" ? "": <>{listData?.messageBody?.messageText}</>}
                                                        {(() => {
                                                            if (listData?.message_type === "order") {
                                                                const productItems = listData?.messageBody?.orderText?.product_items || [];
                                                                const totalPrice = productItems.reduce((acc: number, item: any) => {
                                                                return acc + (item.item_price || 0) * (item.quantity || 1);
                                                                }, 0);

                                                                return (
                                                                    <>
                                                                <div style={{background: "#f1f1f1",borderRadius:"5px"}}>
                                                                <div className="row">
                                                                    <div className="col-md-3 p-2 px-3"><img src={productItems[0]?.product_image} style={{width: "60px",borderRadius: "5px"}} alt="Img"/></div>
                                                                <div className="order-details-container mt-2 col-md-9 px-4">
                                                                    <strong className="d-block mb-1">
                                                                        <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                                                            <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                                            fill="#000000" stroke="none">
                                                                            <path d="M78 4789 c-43 -22 -78 -81 -78 -129 0 -50 35 -107 80 -130 37 -19 58
                                                                            -20 444 -20 l406 0 5 -22 c13 -53 535 -2408 535 -2413 0 -2 -19 -14 -42 -26
                                                                            -24 -12 -68 -47 -98 -78 -134 -138 -165 -328 -82 -505 58 -124 183 -220 321
                                                                            -246 30 -5 117 -10 195 -11 109 -1 131 -3 97 -10 -227 -44 -391 -278 -353
                                                                            -505 41 -245 270 -415 508 -376 196 32 344 180 376 376 38 227 -126 461 -353
                                                                            505 -26 5 375 9 971 9 596 0 997 -4 971 -9 -227 -44 -391 -278 -353 -505 32
                                                                            -196 180 -344 376 -376 238 -39 467 131 508 376 38 227 -126 461 -353 505 -34
                                                                            7 -11 9 99 10 122 1 149 4 182 21 45 23 80 80 80 130 0 50 -35 107 -80 130
                                                                            -39 20 -56 20 -1430 20 -1374 0 -1391 0 -1430 20 -45 23 -80 80 -80 130 0 45
                                                                            35 107 73 127 30 17 117 18 1439 23 1401 5 1407 5 1434 26 15 11 36 31 46 45
                                                                            20 26 628 2142 628 2184 0 45 -37 103 -80 125 -39 20 -55 20 -1888 20 l-1849
                                                                            0 -54 247 c-39 179 -61 257 -79 284 -44 69 -41 69 -578 69 -455 -1 -479 -2
                                                                            -514 -21z m4688 -896 c-3 -10 -118 -415 -257 -900 l-252 -883 -1243 0 -1244 0
                                                                            -5 23 c-3 12 -91 407 -195 877 -104 470 -192 865 -195 878 l-5 22 1700 0
                                                                            c1616 0 1701 -1 1696 -17z m-2746 -3003 c45 -23 80 -80 80 -130 0 -76 -74
                                                                            -150 -150 -150 -76 0 -150 74 -150 150 0 48 35 107 78 129 48 26 93 26 142 1z
                                                                            m2120 0 c45 -23 80 -80 80 -130 0 -76 -74 -150 -150 -150 -76 0 -150 74 -150
                                                                            150 0 48 35 107 78 129 48 26 93 26 142 1z"/>
                                                                            </g>
                                                                        </svg> <span className="mt-1">{productItems?.length || 0} items</span> </strong>
                                                                    <div className="product-item d-flex justify-content-between align-items-center mb-1 p-2">
                                                                        <span> ₹ {totalPrice.toFixed(2)} <small>(estimated total)</small> </span> </div>
                                                                </div>
                                                                </div>
                                                                </div>
                                                                </>
                                                                );}
                                                            })()}
                                                        <span className="time-footer text-xxs d-block text-end mt-1">{formatDate(listData?.time)}</span>
                                                        
                                                        </span>
                                                        {listData?.reaction_emoji ?  <span className="chat-reactionEmoji-user">{listData?.reaction_emoji}</span>:<></>}
                                                    </div>:
                                                    <>
                                                     <div className="p-2 received value">
                                                        <span className="p-2 chat-msg-1 position-relative d-inline-block">
                                                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',background: "gainsboro",borderRadius:"5px" }} className="w-100">
                                                        <img className="w-50"  src={listData?.messageBody?.templateText?.headerImage} alt="" />
                                                        </span>
                                                        {listData?.messageBody?.templateText?.bodyText} 
                                                       
                                                        <span className="time-footer text-xxs d-block text-end mt-1">{formatDate(listData?.time)}</span>
                                                        
                                                        </span>
                                                        {listData?.reaction_emoji ?  <span className="chat-reactionEmoji-user">{listData?.reaction_emoji}</span>:<></>}
                                                    </div>
                                                    </>}
                                                    </>
                                                    ) : (
                                                     
                                                    <div ref={(el:any) => (messageRefs.current[listData.wam_id] = el)}
                                                        className={`p-2 text-end position-relative ${
                                                            parentWamId === listData.wam_id ? "highlighted-bot-msg" : ""
                                                        }`}>
                                                        {listData?.messageBody?.templateText ? 
                                                            <span className="p-2 chat-msg-2 position-relative d-inline-block text-start">
                                                            <div className="text-end text-xxs p-0">
                                                                <i className="fa-solid fa-bullhorn" style={{color:"#004aad"}}></i>
                                                            </div>
                                                            <span
                                                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: "gainsboro", borderRadius:"5px" }}
                                                                className="w-100">
                                                                {(() => {
                                                                    const mediaUrl = listData.messageBody.templateText.headerImage || listData.messageBody.MessageMedia;
                                                                    const isWhatsAppCDNImage = mediaUrl?.includes('scontent.whatsapp.net') && mediaUrl.includes('.jpg');
                                                                    if (mediaUrl?.match(/\.(mp4)$/i)|  mediaUrl?.includes('whatsapp.net')) {
                                                                        return <video controls className="w-80" src={mediaUrl} />;
                                                                    }
                                                                    if (mediaUrl?.match(/\.(jpeg|jpg|png)$/i) || isWhatsAppCDNImage) {
                                                                        return <img className="w-50" src={mediaUrl} alt="media" />;
                                                                    }
                                                                    if (mediaUrl?.match(/\.(pdf|docx)$/i)) {
                                                                        return (
                                                                        <a
                                                                            href={mediaUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="w-50 text-center"
                                                                            style={{ color: '#007bff', textDecoration: 'underline' }}
                                                                        >
                                                                            <i className="fa fa-3x fa-file-alt text-white"></i>
                                                                        </a>
                                                                        );
                                                                    }
                                                                    return null;
                                                                    })()}

                                                            </span>
                                                            <div className="px-2 pt-2 bg-whatsapp fw-bold">
                                                                {typeof listData.messageBody.templateText.headerText === 'string'
                                                                ? listData.messageBody.templateText.headerText
                                                                : JSON.stringify(listData.messageBody.templateText.headerText)}
                                                            </div>
                                                            {/* <div className="px-2 pt-2 pb-2 bg-whatsapp whitespace-pre-line">
                                                                {typeof listData.messageBody.templateText.bodyText === 'string'
                                                                    ? listData.messageBody.templateText.bodyText
                                                                    : JSON.stringify(listData.messageBody.templateText.bodyText)}
                                                            </div> */}
                                                            <div className="px-2 pt-2 pb-2 bg-whatsapp">
                                                                {typeof listData?.messageBody?.templateText?.bodyText === 'string' ? (
                                                                    <div
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: listData.messageBody.templateText.bodyText
                                                                                .replace(/\*(.*?)\*/g, '<b>$1</b>')
                                                                                .replace(/_(.*?)_/g, '<i>$1</i>')
                                                                                .replace(/~(.*?)~/g, '<strike>$1</strike>')
                                                                                .replace(/\n/g, '<br>'),
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    JSON.stringify(listData?.messageBody?.templateText?.bodyText)
                                                                )}
                                                            </div>

                                                            <div className="time-footer px-2 pt-2 pb-2 text-xs fs-6 bg-whatsapp ">
                                                                {typeof listData.messageBody.templateText.footerText === 'string'
                                                                ? listData.messageBody.templateText.footerText
                                                                : JSON.stringify(listData.messageBody.templateText.footerText)}
                                                            </div>
                                                            {listData?.message_type==="carousel" &&(
                                                   <div className="main-container-carousels">
                                                                <div className="carousel-container">
                                                                <div className="wrapper conversation-container px-1 pb-0">
                                                                    <div className="slider-wrapper">
                                                                    <div
                                                                        className="inner"
                                                                        style={{
                                                                        width: `${(slidesMap[listData.time]?.length || 0) * 100}%`,
                                                                        transform: `translateX(-${
                                                                            (indices[listData.time] ?? 0) *
                                                                            (100 / (slidesMap[listData.time]?.length || 1))
                                                                        }%)`,
                                                                        transition: "transform 0.3s ease",
                                                                        }}
                                                                    >
                                                                        {slidesMap[listData.time]?.map((slide, index) => (
                                                                        <article
                                                                            key={slide.id}
                                                                            style={{
                                                                            width: `${100 / (slidesMap[listData.time]?.length || 1)}%`,
                                                                            }}
                                                                        >
                                                                            {slide.format === "video" ? (
                                                                            <video
                                                                                src={slide.src}
                                                                                controls
                                                                                onLoadedMetadata={() => {
                                                                                videoLoaded.current = true;
                                                                                requestAnimationFrame(() =>
                                                                                    setIndices((prev) => ({ ...prev }))
                                                                                );
                                                                                }}
                                                                            />
                                                                            ) : (
                                                                            <img src={slide.src} alt={slide.title || `Slide ${index}`} />
                                                                            )}
                                                                        </article>
                                                                        ))}
                                                                    </div>
                                                                    </div>
                                                            
                                                                    {/* Nav buttons */}
                                                                    {(slidesMap[listData.time]?.length || 0) >= 2 && (
                                                                    <div className="slider-nav-buttons modal-slider-nav-buttons">
                                                                        <button onClick={(e) => { e.preventDefault(); prevSlide(listData.time); }}>❮</button>
                                                                        <button onClick={(e) => { e.preventDefault(); nextSlide(listData.time); }}>❯</button>
                                                                    </div>
                                                                    )}
                                                            
                                                                    {/* Dots */}
                                                                    <div className="slider-dot-control">
                                                                    {slidesMap[listData.time]?.map((_, index) => (
                                                                        <span
                                                                        key={index}
                                                                        className={index === (indices[listData.time] ?? 0) ? "active-dot" : ""}
                                                                        onClick={() =>
                                                                            setIndices((prev) => ({ ...prev, [listData.time]: index }))
                                                                        }
                                                                        />
                                                                    ))}
                                                                    </div>
                                                                </div>
                                                                {/* Body text + buttons */}
                                                                    {slidesMap[listData.time]?.[indices[listData.time] ?? 0]?.bodyText && (
                                                                    <div key={slidesMap[listData.time][indices[listData.time]].id}>
                                                                        <p
                                                                        style={{ textAlign: "justify", fontSize: "13px", padding: "0 5px" }}
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: slidesMap[listData.time][indices[listData.time]].bodyText
                                                                            .replace(/\*(.*?)\*/g, "<b>$1</b>")
                                                                            .replace(/_(.*?)_/g, "<i>$1</i>")
                                                                            .replace(/~(.*?)~/g, "<strike>$1</strike>")
                                                                            .replace(/\n/g, "<br>"),
                                                                        }}
                                                                        ></p>
                                                            
                                                                        {slidesMap[listData.time][indices[listData.time]].buttons && (
                                                                        <div className="template-buttontxt">
                                                                            {slidesMap[listData.time][indices[listData.time]].buttons.map(
                                                                            (button: any, idx: number) => {
                                                                                let icon = null;
                                                                                if (button.type === "quick_reply")
                                                                                icon = <i className="fa-solid fa-reply bt-1"></i>;
                                                                                else if (button.type === "phone_number")
                                                                                icon = <i className="fa-solid fa-phone"></i>;
                                                                                else if (button.type === "url")
                                                                                icon = <i className="fa-solid fa-square-arrow-up-right"></i>;
                                                            
                                                                                return (
                                                                                <p
                                                                                    key={idx}
                                                                                    className="template-buttontxt button-option-style text-center"
                                                                                >
                                                                                    {icon} {button.text}
                                                                                </p>
                                                                                );
                                                                            }
                                                                            )}
                                                                        </div>
                                                                        )}
                                                                    </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                            {listData.messageStatus === "failed" && (
                                                                <span className="d-block template-failed-msg mt-0 pt-2 pb-2 px-2 text-danger bg-whatsapp mb-0">
                                                                <i className="fa-solid fa-circle-exclamation failed-txt text-danger"></i>
                                                                {listData?.error_message}
                                                                </span>
                                                            )}
                                                            <div className="template-buttontxt bg-white">
                                                                
                                                                {listData.messageBody.templateText.buttons?.map((button:any, idx:any) => {
                                                                let icon = null;
                                                                let url = null;
                                                                switch (button.type) {
                                                                    case 'QUICK_REPLY':
                                                                    icon = <i className="fa-solid fa-reply bt-1"></i>;
                                                                    break;
                                                                    case 'PHONE_NUMBER':
                                                                    icon = <i className="fa-solid fa-phone"></i>;
                                                                    break;
                                                                    case 'COPY_CODE':
                                                                    icon = <i className="fa-solid fa-copy"></i>;
                                                                    break;
                                                                    case 'URL':
                                                                    icon = <i className="fa-solid fa-square-arrow-up-right"></i>;
                                                                    break;
                                                                    default:
                                                                    icon = null;
                                                                }
                                                                const text = typeof button.text === 'string' ? button.text : JSON.stringify(button.text);
                                                                return (
                                                                    <a key={idx} href={button.url} target="blank" className="border-top m-0 p-2 template-buttontxt button-option-style text-center d-block">
                                                                    {icon} {text} 
                                                                    </a>
                                                                );
                                                                })}
                                                            </div>
                                                            
                                                            <span className="time-footer text-xxs d-block text-end mt-1">
                                                                {typeof listData.time === 'string' ? formatDate(listData.time) : JSON.stringify(listData.time)}
                                                                {listData?.messageStatus ==="sent" ?
                                                                    <>
                                                                    <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" height="13" viewBox="0 0 72 72"><path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z" fill="#899499"></path></svg>                                                      
                                                                    </>
                                                                    :listData?.messageStatus ==="delivered" ?
                                                                    <>
                                                                    <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#899499"></path></svg>
                                                                    </>
                                                                    :listData?.messageStatus==="read"?
                                                                    <>
                                                                    <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"></path></svg></>
                                                                    :listData?.messageStatus==="failed"?
                                                                    <>
                                                                    <i className="fa-solid fa-circle-exclamation whachat-failed text-danger"></i></>
                                                                    :""
                                                                    }
                                                                </span>
                                                                {listData?.reaction_emoji ?  <span className="chat-reactionEmoji-bot">{listData?.reaction_emoji}</span>:<></>}
                                                            </span> 
                                                        
                                                        :  
                                                        listData?.messageBody?.botText ? 
                                                            <span className="p-2 chat-msg-2 position-relative d-inline-block text-start">
                                                            <div className="text-end text-xxs p-0">
                                                                <i className="fa-solid fa-robot" style={{color:"#8a9aab"}}></i>
                                                            </div>
                                                            <span
                                                                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: "gainsboro", borderRadius:"5px" }}
                                                                className="w-100"
                                                            >
                                                                {listData.messageBody.botText.headerImage?.match(/\.(mp4)$/i) ? (
                                                                <video controls className="w-80" src={listData.messageBody.botText.headerImage} />
                                                                ) : listData.messageBody.botText.headerImage?.match(/\.(jpeg|jpg|png)$/i) ? (
                                                                <img className="w-50" src={listData.messageBody.botText.headerImage} alt="" />
                                                                ) : listData.messageBody.botText?.headerImage.match(/\.(pdf|docx)$/i) ? (
                                                                <a
                                                                    href={listData.messageBody.botText.headerImage}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-50 text-center"
                                                                    style={{ color: '#007bff', textDecoration: 'underline' }}
                                                                >
                                                                    <i className="fa fa-3x fa-file-alt text-white"></i>
                                                                </a>
                                                                ) : null}
                                                            </span>
                                                            <div className="px-2 pt-2 pb-2 bg-whatsapp">
                                                                {typeof listData?.messageBody?.botText?.bodyText === 'string' ? (
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                    __html: listData.messageBody.botText.bodyText
                                                                        // Formatting replacements
                                                                        .replace(/\*(.*?)\*/g, '<b>$1</b>')
                                                                        .replace(/_(.*?)_/g, '<i>$1</i>')
                                                                        .replace(/~(.*?)~/g, '<strike>$1</strike>')
                                                                        .replace(/\n/g, '<br>')
                                                                        // URL replacement: find http or https links and wrap with <a> tag
                                                                        .replace(
                                                                        /(https?:\/\/[^\s<]+)/g,
                                                                        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
                                                                        ),
                                                                    }}
                                                                />
                                                                ) : (
                                                                JSON.stringify(listData?.messageBody?.botText?.bodyText)
                                                                )}
                                                            </div>

                                                            <div className="time-footer px-2 pt-2 pb-2 text-xs fs-6 bg-whatsapp ">
                                                                {typeof listData?.messageBody?.botText?.footerText === 'string'
                                                                ? listData?.messageBody?.botText?.footerText
                                                                : JSON.stringify(listData?.messageBody?.botText?.footerText)}
                                                            </div>
                                                            {listData.messageStatus === "failed" && (
                                                                <span className="d-inline-block template-failed-msg mt-0 pt-2 pb-2 px-2 text-danger bg-whatsapp">
                                                                <i className="fa-solid fa-circle-exclamation failed-txt text-danger"></i>
                                                                Message failed to send because more than 24 hours have passed since the customer last replied to this number
                                                                </span>
                                                            )}
                                                            <div className="template-buttontxt bg-white">
                                                                {listData?.messageBody?.botText?.buttons?.menuButton ?
                                                                <>
                                                                {listData?.messageBody?.botText?.buttons?.sections?.length > 0 && (
                                                                <>
                                                                    <p className="cursor-pointer template-buttontxt text-center button-option-style px-6 border-top py-2 m-0" onClick={() => {setListBot(prev => !prev)}}>
                                                                        <i className="fa-solid fa-list"></i> {listData?.messageBody?.botText?.buttons?.menuButton}
                                                                    </p>
                                                                   { ListBot && listData.messageBody.botText.buttons.sections.map((section: any, sectionIdx: number) =>
                                                                    section?.rows?.length > 0 &&
                                                                        section.rows.map((row: any, rowIdx: number) => (
                                                                        <p
                                                                            key={`${sectionIdx}-${rowIdx}`}
                                                                            className="template-buttontxt button-option-style px-6 border-top py-2 m-0 text-center"
                                                                        >
                                                                            <strong className="text-sm text-capitalize" style={{color:"#32325c"}}>{section.title}</strong>
                                                                            <p className="p-0 m-0" style={{color:"#000",fontSize:"14px"}}>{row.title}</p>
                                                                            <p className="p-0 m-0" style={{color:"#000",fontSize:"14px"}}>{row.description}</p>
                                                                        </p>
                                                                        ))
                                                                    )}
                                                                </>
                                                                )}
                                                                </>:
                                                                <>
                                                                {Array.isArray(listData?.messageBody?.botText?.buttons) &&
                                                                listData.messageBody.botText.buttons.map((button: any, idx: number) => {
                                                                    let icon = null;

                                                                    switch (button?.type) {
                                                                    case 'reply':
                                                                        icon = <i className="fa-solid fa-reply bt-1"></i>;
                                                                        break;
                                                                    default:
                                                                        icon = null;
                                                                    }

                                                                    const text = typeof button?.reply?.title === 'string'
                                                                    ? button.reply.title
                                                                    : JSON.stringify(button?.reply?.title);

                                                                    return (
                                                                    <p key={idx} className="template-buttontxt align-center text-center button-option-style px-5 border-top py-2 m-0">
                                                                        {icon} {text}
                                                                    </p>
                                                                    );
                                                                })}
                                                                </>}

                                                            </div>
                                                            <span className="time-footer text-xxs d-block text-end mt-1">
                                                                {typeof listData.time === 'string' ? formatDate(listData.time) : JSON.stringify(listData.time)}
                                                                {listData?.messageStatus ==="sent" ?
                                                                    <>
                                                                    <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" height="13" viewBox="0 0 72 72"><path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z" fill="#899499"></path></svg>                                                      
                                                                    </>
                                                                    :listData?.messageStatus ==="delivered" ?
                                                                    <>
                                                                    <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#899499"></path></svg>
                                                                    </>
                                                                    :listData?.messageStatus==="read"?
                                                                    <>
                                                                    <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"></path></svg></>
                                                                    :listData?.messageStatus==="failed"?
                                                                    <>
                                                                    <i className="fa-solid fa-circle-exclamation whachat-failed text-danger"></i></>
                                                                    :""
                                                                    }
                                                                </span>
                                                                {listData?.reaction_emoji ?  <span className="chat-reactionEmoji-bot">{listData?.reaction_emoji}</span>:<></>}
                                                            </span> :
                                                        <span className="p-2 chat-msg-2 position-relative d-inline-block text-start">
                                                        <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',background: "gainsboro",borderRadius:"5px" }} className="w-100">
                                                        {listData?.messageBody?.MessageMedia?.match(/\.(mp4)$/i) ? (
                                                            <video controls className="w-80" src={listData.messageBody.MessageMedia} />
                                                        ) : listData?.messageBody?.MessageMedia?.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                                            <img className="w-50" src={listData.messageBody.MessageMedia} alt="" />
                                                        ) : listData?.messageBody?.MessageMedia?.match(/\.(mp3|ogg|aac)$/i) ? (
                                                            <audio controls className="p-2" src={listData.messageBody.MessageMedia}/>
                                                        ) : listData?.messageBody?.MessageMedia?.match(/\.(pdf|docx)$/i) ? (
                                                            <a
                                                            href={listData.messageBody.MessageMedia}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-50 text-center"
                                                            style={{ color: '#007bff', textDecoration: 'underline' }}
                                                            >
                                                            <i className="fa fa-3x fa-file-alt text-white"></i>
                                                            </a>
                                                        ) : null}
                                                        </span>
                                                        {listData?.messageBody.messageText}
                                                        {listData?.messageStatus === "failed" ? (
                                                        <span className="d-inline-block failed-msg text-danger">
                                                            <i className="fa-solid fa-circle-exclamation failed-txt text-danger"></i>
                                                             Message failed to send because more than 24 hours have passed since the customer last replied to this number
                                                        </span>
                                                        ) : null}
                                                        <span className="time-footer text-xxs d-block text-end mt-1">{formatDate(listData?.time)}
                                                            {listData?.messageStatus ==="sent"
                                                            ?<>
                                                            <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="13" height="13" viewBox="0 0 72 72"><path d="M57.658,12.643c1.854,1.201,2.384,3.678,1.183,5.532l-25.915,40c-0.682,1.051-1.815,1.723-3.064,1.814	C29.764,59.997,29.665,60,29.568,60c-1.146,0-2.241-0.491-3.003-1.358L13.514,43.807c-1.459-1.659-1.298-4.186,0.36-5.646	c1.662-1.46,4.188-1.296,5.646,0.361l9.563,10.87l23.043-35.567C53.329,11.971,55.806,11.442,57.658,12.643z" fill="#899499"></path></svg>                                                      
                                                            </>
                                                            :listData?.messageStatus ==="delivered" ?
                                                            <>
                                                            <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#899499"></path></svg>
                                                            </>
                                                            :listData?.messageStatus==="read"?
                                                            <>
                                                            <svg className="tick-align" xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"></path></svg></>
                                                            :listData?.messageStatus==="failed"?
                                                            <>
                                                            <i className="fa-solid fa-circle-exclamation whachat-failed text-danger"></i></>
                                                            :""
                                                            }
                                                            </span>
                                                            {listData?.reaction_emoji ?  <span className="chat-reactionEmoji-bot">{listData?.reaction_emoji}</span>:<></>}
                                                        </span>
                                                        }
                                                    </div>
                                                    )}
                                                </div>
                                                )})}
                                                </>)}
                                            </div>
                                            
                                            {chatList.length === 0 ? 
                                            <></>:
                                            <>
                                            {/* Scroll to Top Button */}
                                            {showScrollTop && (
                                                <button
                                                onClick={scrollToTop}
                                                className="scroll-btn scroll-btn-right scroll-top"
                                                >
                                                <i className="fa-solid fa-chevron-up"></i>
                                                </button>
                                            )}

                                            {/* Scroll to Bottom Button */}
                                            {showScrollBottom && (
                                                <button
                                                onClick={scrollToBottom}
                                                className="scroll-btn scroll-btn-left scroll-bottom"
                                                >
                                                <i className="fa-solid fa-chevron-down"></i>
                                                </button>
                                            )}
                                            </>}
                                            </div>
                                        </div>


                                        <div className="chat-footer">
                                            <div className="chat-input-container" ref={editorWrapperRef}>
                                                <button className="emoji-btn" onClick={() => setShowPicker((prev) => !prev)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#aba9a9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <circle cx="12" cy="12" r="10"></circle>
                                                        <path d="M15 16a3 3 0 0 1-6 0"></path>
                                                        <line x1="9" y1="9" x2="9.01" y2="9"></line>
                                                        <line x1="15" y1="9" x2="15.01" y2="9"></line>
                                                    </svg>
                                                </button>
                                                {showPicker && (
                                                    <div ref={emojiPickerRef} className="emoji-dropdown-whtaspp">
                                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                    </div>
                                                )}

                                                {/* {/ Message Input /} */}
                                                <input
                                                    type="text"
                                                    className="chat-input"
                                                    placeholder="Type a message..."
                                                    value={message} 
                                                    autoComplete="off" onChange={(e) => setMessage(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          e.preventDefault();  // prevent form submission or new line if any
                                                          sendMessage();
                                                        }
                                                    }}
                                                />

                                                {/* {/ File Upload /} */}
                                                <div className="btn-group dropup">
                                                    <button className="file-btn" data-bs-toggle="dropdown">
                                                        <i className="fa-solid fa-paperclip"></i>
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li onClick={() => setChatPopup(1)} data-bs-toggle="modal" data-bs-target="#exampleModal"><a className="dropdown-item"><i className="fa-solid fa-file"></i> Send Document</a></li>
                                                        <li onClick={() => setChatPopup(2)} data-bs-toggle="modal" data-bs-target="#exampleModal"><a className="dropdown-item"><i className="fa-solid fa-image"></i> Send Image</a></li>
                                                        <li onClick={() => setChatPopup(3)} data-bs-toggle="modal" data-bs-target="#exampleModal"><a className="dropdown-item"><i className="fa-solid fa-camera"></i> Send Video</a></li>
                                                        <li onClick={() => setChatPopup(4)} data-bs-toggle="modal" data-bs-target="#exampleModal"><a className="dropdown-item"><i className="fa-solid fa-microphone"></i> Send Audio</a></li>
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* {/ Send Button /} */}
                                            <button className="footer-btn-send" onClick={sendMessage}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M2.01 21L23 12L2.01 3L2 10l15 2l-15 2z"></path>
                                                </svg>
                                            </button>
                                        </div>

                                        {/* {/ Modal for File Upload /} */}
                                        <div className="modal fade" id="exampleModal" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content all-modal-content">
                                                    <div className="modal-header border-0">
                                                        <h5 className="modal-title vendorcreate-modal-title">Send Media</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                                    </div>
                                                    <div className="modal-body">
                                                        {chatPopup && (
                                                            <div className="file-upload-container  position-relative">
                                                                <input type="file" id="fileUpload" className="file-whatsapp-popup" onChange={handleFileChange} ref={fileInputRef}/>
                                                                <p className="position-absolute w-100 mt-5 text-center">{fileName ? `Selected File: ${fileName}` : ""}</p>
                                                            
                                                                <label htmlFor="fileUpload" className="custom-file-label fw-normal">
                                                                    {chatPopup === 1 ? "Select Document" :
                                                                        chatPopup === 2 ? "Select Image" :
                                                                            chatPopup === 3 ? "Select Video" : "Select Audio"}
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                
                                                    <div className="col-md-12 px-3 login-input-group">
                                                <div className="vendor-create-container">
                                                    {chatPopup === 4 ? <></>:<>
                                                   <input autoComplete="off" onChange={(e)=>setcaption(e.target.value)} value={caption} type="text" id="vendor-crt-input" 
                                                   className={`vendor-crt-input loginfilled-frame-username`}
                                                   placeholder=" " required />
                                                   <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-button"></i> Caption/Text</label>
                                                </>}
                                                </div>
                                             </div>
                                                    <div className="modal-footer border-0">
                                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="wachatImgclose" onClick={resetForm}>Close</button>
                                                        <button type="button" className="btn btn-primary" onClick={sendMessage}>Send</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    
                                    <div className="bg-white card campaign-template mt-5">
                                        <h6 className="campaign-temp-head">Contact Info</h6>
                                        <div>
                                            <div className="text-end">
                                               {id ? <button className="whatsapp-border-btn-0" type="button" data-bs-toggle="modal" data-bs-target="#vendorview" onClick={()=>contactListGet(id)}><i className="fa-solid fa-pen"></i>  Edit Contact</button>:<></>}
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            <h6 className="mt-n2">Name</h6>
                                            <p className="mt-n2">{contactName}</p>
                                            <h6 className="mt-n2">Phone</h6>
                                            <p className="mt-n2">{mobNumber}</p>
                                            <h6 className="mt-n2">Email</h6>
                                            <p className="mt-n2">{email}</p>
                                            <h6 className="mt-n2">Language</h6>
                                            <p className="mt-n2">{languageCode}</p>
                                            <h6 className="mt-n2">Group Name</h6>
                                            <p className="mt-n2">{groupName?.map((group: any) => group.groupName).join(", ")}</p>
                                        </div>
                                    </div>
                                    <div className="modal fade" id="vendorviews" aria-labelledby="vendorviewLabel" aria-hidden="true">
                                        <div className="modal-dialog modal-lg">
                                            <div className="modal-content all-modal-content vendorcreate-modal-content">
                                                <div className="modal-header vendorcreate-modal-header">
                                                    <h1 className="modal-title vendorcreate-modal-title fs-6 text-center" id="vendorviewLabel">Edit Contact</h1>
                                                </div>
                                                <div className="p-0 modal-body text-center">
                                                    <div className="row ms-4 mx-4">
                                                        <div className="col-md-6 login-input-group">
                                                            <div className="vendor-create-container">
                                                                <input type="text" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-file-signature"></i> First Name</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 login-input-group">
                                                            <div className="vendor-create-container">
                                                                <input type="text" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-file-signature"></i> Last Name</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 login-input-group">
                                                            <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <input
                                                                    type="text"
                                                                    autoComplete="off"
                                                                     onClick={handleGetStoreDrop}
                                                                    id="vendor-crt-input"
                                                                    className={`vendor-crt-input`}
                                                                    //  value={storeName}
                                                                    placeholder=" "
                                                                    required
                                                                    readOnly
                                                                />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-earth-americas"></i> Country</label>
                                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                                <ul className="dropdown-menu storename-dropdown-menu">

                                                                    <li>
                                                                        <a
                                                                            className="dropdown-item"
                                                                            href="#"
                                                                        >
                                                                            Other
                                                                        </a>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 login-input-group">
                                                            <div className="vendor-create-container">
                                                                <input type="number" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-location-crosshairs"></i> Mobile Number</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 login-input-group">
                                                            <div className="vendor-create-container">
                                                                <input type="text" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-code-compare"></i> Language Code</label>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 login-input-group">
                                                            <div className="vendor-create-container">
                                                                <input type="text" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-envelope"></i>  Email</label>
                                                            </div>
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
                                                    </div>
                                                    <div className="campaign-template mt-5 mx-4">
                                                        <h6 className="campaign-temp-head">Other Information</h6>
                                                        <div className="row">
                                                            <div className="col-md-6 login-input-group">
                                                                <div className="vendor-create-container">
                                                                <input type="date" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-calendar"></i> DOB</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 login-input-group">
                                                                <div className="vendor-create-container">
                                                                    <input type="text" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-address-book"></i> Address</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 login-input-group">
                                                                <div className="vendor-create-container">
                                                                    <input type="text" autoComplete="off" id="vendor-crt-input" className={`vendor-crt-input`} placeholder=" " required />
                                                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-street-view"></i> Loyalty_rs</label>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6 login-input-group">
                                                                <div className=" vendor-contact-container" aria-expanded="false">
                                                                    <input type="date" id="vendor-crt-input" autoComplete="off" className="vendor-crt-input" placeholder=" " required />
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
                                                                    <input type="text" id="vendor-crt-input" autoComplete="off" className="vendor-crt-input" placeholder=" " required />
                                                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label">Sale Amount</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className="modal-footer text-end vendor-view-footer ms-4 mx-4">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Submit</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal fade" id="vendorview" aria-labelledby="vendorcontactLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
               <div className="modal-content all-modal-content vendorcontact-modal-content">
                  <div className="modal-header vendorcontact-modal-header border-0">
                     <h5 className="modal-title vendorcontact-modal-title" id="vendorcontactLabel" onClick={contactListGet}>
                        Edit Contact
                     </h5>
                     <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="row modal-container-size modal-body vendorcontact-modal-body">
                     <div className="row mt-n4">
                        {/*{/ <h5 className="text-center mt-4"><u>Vendor Admin User</u></h5> /}*/}
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container">
                              <input type="text" id="vendor-crt-input" value={fName} className="vendor-crt-input"
                                
                                 autoComplete="off" onChange={(e) => setFName(e.target.value)}
                                 placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> First Name</label>
                           </div>
                          
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
                              <input type="text" id="vendor-crt-input" autoComplete="off" value={mobNumber} className="vendor-crt-input" placeholder=" "
                                 
                                 maxLength={12} required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-button"></i> Mobile Number</label>
                           </div>
                           
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
                              <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e) => setEmail(e.target.value)} value={email} 
                              placeholder=" "
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
                                 required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                           </div>
                           {email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                           <div className="text-danger error-message-required">Invalid email format</div>
                        )}
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <input type="text" id="vendor-crt-input"
                                
                                 onClick={handleGetStoreDrop} value={storeName}
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
                           
                        </div>
                        <div className="col-md-6 login-input-group">
                           <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <div>
                                 <input type="text" id="vendor-crt-input" readOnly
                                    
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
                        </div>
                        </div>
                     </div>
                  </div>
                  <div className="modal-footer vendorcreate-modal-footer border-0">
                     <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeCreate">Close</button>
                     <button onClick={contactUpdate} type="button" className="btn btn-primary">
                           Submit
                     </button>
                  </div>
               </div>
            </div>
         </div>
                                    <div className="bg-white card campaign-template mt-5">
                                        <h6 className="campaign-temp-head">Assign Team Member</h6>
                                        <div>
                                            <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    className={"vendor-crt-input loginfilled-frame-username"}
                                                    placeholder=" "
                                                    required
                                                    readOnly
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-phone"></i> Not Assigned</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu storename-dropdown-menu team-dropdown-menu">
                                                    <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        > Not Assigned
                                                        </a>
                                                    </li>
                                                    <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        > GRP Mr
                                                        </a>
                                                    </li>
                                                </ul>

                                            </div>
                                            <div className="text-end">
                                                <button className="vendor-crt-btn" >Save</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white card campaign-template mt-5">
                                        <h6 className="campaign-temp-head">Priority / Task Status</h6>
                                        <div>
                                            <div className="vendor-create-container dropdown mt-3" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    className={"vendor-crt-input loginfilled-frame-username"}
                                                    placeholder=" "
                                                    required
                                                    readOnly
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" 
                                                    width="13px" height="13px" viewBox="0 0 52 52" enable-background="new 0 0 52 52">
                                                <g>
                                                    <path fill="gray" d="M9,3.5C9,2.7,8.3,2,7.5,2h-3C3.7,2,3,2.7,3,3.5v45C3,49.3,3.7,50,4.5,50h3C8.3,50,9,49.3,9,48.5V3.5z"/>
                                                    <path fill="gray" d="M47.5,7.7c-16,8.4-14.2-8.8-33.5-2.1c-0.6,0.2-1,0.8-1,1.4v23.3c0,0.7,0.7,1.2,1.3,0.9
                                                        c19.2-6.4,17.2,11.2,33.9,1.8c0.5-0.3,0.8-0.8,0.8-1.3V8.5C49,7.8,48.2,7.3,47.5,7.7z"/>
                                                </g>
                                                </svg> Priority</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu storename-dropdown-menu team-dropdown-menu">
                                                <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        > High
                                                        </a>
                                                    </li>
                                                    <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        >Medium
                                                        </a>
                                                    </li>
                                                    <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        >Low
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="vendor-create-container dropdown mt-3" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    className={"vendor-crt-input loginfilled-frame-username"}
                                                    placeholder=" "
                                                    required
                                                    readOnly
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                                <svg fill="gray" height="13px" width="13px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
                                                    viewBox="0 0 470.767 470.767">
                                                <g>
                                                    <path d="M362.965,21.384H289.62L286.638,7.99C285.614,3.323,281.467,0,276.685,0h-82.618c-4.782,0-8.913,3.323-9.953,7.99
                                                        l-2.967,13.394h-73.36c-26.835,0-48.654,21.827-48.654,48.662v352.06c0,26.835,21.819,48.662,48.654,48.662h255.179
                                                        c26.835,0,48.67-21.827,48.67-48.662V70.046C411.635,43.211,389.8,21.384,362.965,21.384z M379.831,422.105
                                                        c0,9.295-7.563,16.858-16.866,16.858H107.786c-9.287,0-16.85-7.563-16.85-16.858V70.046c0-9.295,7.563-16.857,16.85-16.857h66.294
                                                        l-1.692,7.609c-0.684,3.02,0.062,6.188,1.988,8.596c1.94,2.415,4.876,3.82,7.965,3.82h106.082c3.091,0,6.026-1.405,7.951-3.82
                                                        c1.942-2.415,2.687-5.575,2.004-8.596l-1.692-7.609h66.279c9.303,0,16.866,7.563,16.866,16.857V422.105z"/>
                                                    <path d="M170.835,188.426h43.249l-10.279-7.019c-14.506-9.899-18.232-29.693-8.325-44.197c9.893-14.489,29.693-18.239,44.197-8.324
                                                        l1.694,1.157v-12.136c0-7.866-6.383-14.248-14.242-14.248h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.271
                                                        C156.595,182.045,162.978,188.426,170.835,188.426z"/>
                                                    <path d="M303.256,110.313l-49.85,47.194l-22.704-15.49c-7.221-4.962-17.13-3.083-22.099,4.162
                                                        c-4.954,7.251-3.09,17.144,4.178,22.098l33.28,22.727c2.718,1.864,5.839,2.772,8.961,2.772c3.96,0,7.888-1.474,10.933-4.356
                                                        l59.167-56.014c6.382-6.033,6.645-16.104,0.62-22.479C319.686,104.552,309.637,104.28,303.256,110.313z"/>
                                                    <path d="M170.835,297.669H214.1l-10.295-7.027c-14.506-9.901-18.232-29.693-8.325-44.197c9.893-14.498,29.693-18.248,44.197-8.325
                                                        l1.694,1.158v-12.136c0-7.865-6.383-14.248-14.242-14.248h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.279
                                                        C156.595,291.286,162.978,297.669,170.835,297.669z"/>
                                                    <path d="M303.256,219.555l-49.85,47.186l-22.704-15.49c-7.221-4.97-17.13-3.098-22.099,4.162
                                                        c-4.954,7.253-3.09,17.144,4.178,22.099l33.28,22.727c2.718,1.864,5.839,2.772,8.961,2.772c3.96,0,7.888-1.476,10.933-4.356
                                                        l59.167-56.007c6.382-6.033,6.645-16.096,0.62-22.479C319.686,213.793,309.637,213.529,303.256,219.555z"/>
                                                    <path d="M227.129,322.135h-56.294c-7.857,0-14.24,6.383-14.24,14.248v56.271c0,7.865,6.383,14.248,14.24,14.248h56.294
                                                        c7.859,0,14.242-6.383,14.242-14.248v-56.271C241.371,328.518,234.988,322.135,227.129,322.135z"/>
                                                </g>
                                                </svg> Task Status</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu storename-dropdown-menu team-dropdown-menu">
                                                <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        > Yet to start
                                                        </a>
                                                    </li>
                                                    <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        >Inprogress
                                                        </a>
                                                    </li>
                                                    <li >
                                                        <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        >Completed
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="text-end mt-3">
                                                <button className="vendor-crt-btn" >Save</button>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Webhook Configure Modal*/}
                        <div className="modal fade" id="webhookconfigure" tab-index="-1" aria-labelledby="webhookconfigureLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                            <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content all-modal-content vendor-delete-content">
                                <div className=" vendor-delete-header">
                                </div>
                                <div className="modal-body vendor-delete-body">
                                    <div className="row">
                                        <div className="vendor-delete-icon">
                                        <i className="fa-solid fa-triangle-exclamation text-warning danger-iconz "></i>
                                        </div>
                                        <h5 className="modal-confirm-head">No Webhook Configured <i className="fa-solid fa-gears"></i></h5>
                                        <h6 className="modal-confirm-subhead">Please set up a webhook to enable this feature !</h6>
                                        <div></div>
                                    </div>
                                </div>
                                <div className="modal-footer text-center vendor-delete-footer">
                                    <button type="button" className="btn btn-primary" onClick={()=>navigate('/vendor/settings/whatsapp')} data-bs-dismiss="modal">Set Up Webhook</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        {/* Chat Export */}
                        <div className="modal fade" id="vendorExport" aria-labelledby="vendorExportLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content all-modal-content">
                                    <div className="modal-header vendor-view-header">
                                        <h1 className="modal-title fs-6 mb-3 text-center" id="vendorExportLabel">Export Chat</h1>
                                    </div>
                                    {exportLoading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                <div className="downloadLoad-container"><span className="download-loader">
                                                   <div className="downloadLoad-txt">Loading...</div></span></div>
                                            </div>
                                            ) : (
                                            <> 
                                    <div className="p-0 modal-body text-center ">
                                        <div className="exportwithData">
                                        <p className="exportwithData-para">Export all chat data into an Excel file to keep your records organized.</p>
                                        <p className="exportwithData-para1"></p>
                                        <button className="exportwithData-btn" 
                                        onClick={()=>{handleExport("withData")}}
                                        >
                                            Export Excel File With Data
                                        </button>
                                        </div>
                                    </div></>)}
                                    <div className="modal-footer text-end vendor-view-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                            </div>
                        {/*Chat Delete Modal*/}
                        <div className="modal fade" id="chatdelete" tab-Index="-1" aria-labelledby="vendordeleteLabel" aria-hidden="true">
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
                                    <div>
                                    <h4 className="modal-confirm-head">Are you sure you want to clear chat history for this contact?                                                </h4>
                                    <h6 className="modal-confirm-subhead">Only chat history will be deleted permanently, it won't delete campaign messages.</h6>
                                    </div>
                                    </div>
                                </div>
                                <div className="modal-footer text-center vendor-delete-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closedeleteModal">No</button>&nbsp;
                                    <button type="button" className="btn btn-primary" onClick={handleChatClear}>Yes</button>
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

export default WhatsApp_Chat;
