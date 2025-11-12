import Userimg from "../../assets/img/team-2.jpg";
import Userimg1 from "../../assets/img/small-logos/logo-spotify.svg";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Navlogo from "../../../assets/img/bizconvo-logo.png";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import "./chatbox.css";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import EmojiPicker from "emoji-picker-react";
import { log } from "node:console";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { Pagination } from "react-bootstrap";
import {baseURL}  from "../../../api/api";
import API from "../../../api/api";
import API_EP_BOOK from "../../../api/endpoints";
import { CKEditor } from 'ckeditor4-react';

function Chatbot() {
 
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isDropdownOpen1, setDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setDropdownOpen2] = useState(false);
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [mediabot, setMediabot] = useState(false);
  const [simplebot, setSimplebot] = useState(false);
  const [advancedbot, setAdvancedbot] = useState(false);
  const [replybutton1, SetReplybuttonradio] = useState(true);
  const [replybutton2, SetReplybuttonradio1] = useState(false);
  const [replybutton3, SetReplybuttonradio2] = useState(false);
  const [botId, setbotId] = useState("");
  const [active, setActive] = useState(true);
  const [botName, setbotName] = useState("");
  const [showBotNameValidation, setShowBotNameValidation] = useState(false);
  const [botList, setbotList] = useState<any[]>([]);
     const [triggerDrop, settriggerDrop] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [triggerId, settriggerId] = useState("");
  const [triggerName, settriggerName] = useState("");
  const [mediaType, setmediaType] = useState("");
  const [responce, setResponce] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedOption, setSelectedOption] = useState("none");
  const [responceTypeSelection, setResponceTypeSelection] = useState("");
  const [imgUrl,setImgUrl]=useState('')
  const [caption,setCaption]=useState('')
  const [response,setResponse] = useState('')
  //Simple CkEditor
  const [responseText,setResponseText]=useState('');
  //Interactive CkEditor
  const [responseText1,setResponseText1]=useState('');
  const [interactiveType, setInteractiveType] = useState("");
  const [resType, setresType] = useState("");
  // const [mediaType, setMediaType] = useState("");
const [mediaText,setMediaText]=useState("")
   const [imgLoading, setimgLoading] = useState(false);

  const [ctaURLInput,setCtaURLInput]=useState("")
  const [ctaTextInput,setCtaTextInput]=useState("")
  const [replyTextInput1,setreplyTextInput1]=useState("")
  const [replyTextInput2,setreplyTextInput2]=useState("")
  const [replyTextInput3,setreplyTextInput3]=useState("")
  const [footerText,setFooterText]=useState("")
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [editorInstance1, setEditorInstance1] = useState<any>(null);
  const isDisabled = ["image", "video", "document"].includes(selectedOption);
  const [isEditBot,setisEditBot]=useState(0)
  const [editId,setEditId]=useState("")
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSelectedOption(value);

  if (["image", "video", "document"].includes(value)) {
    if (interactiveType === "list") {
      setInteractiveType("");
    }
  }
};

console.log(selectedOption,"option")
  const handleChangeResponce = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setResponceTypeSelection(e.target.value);
    setSelectedOption("");
  };

  const navigate = useNavigate();

  const handleBacktoSadmin = (e: any) => {
    e.preventDefault();
    navigate("/dashboard", { replace: true });
  };
  const [modalMode, setModalMode] = useState("create");
  const openModal = (mode: any) => {
    setModalMode(mode);
  };
  const handleSubmit = () => {
    if (modalMode === "create") {
    }
  };

  const Replybuttonradio = () => {
    SetReplybuttonradio(true);
    SetReplybuttonradio1(false);
    SetReplybuttonradio2(false);
  };
  const Replybuttonradio1 = () => {
    SetReplybuttonradio(false);
    SetReplybuttonradio1(true);
    SetReplybuttonradio2(false);
  };
  const Replybuttonradio2 = () => {
    SetReplybuttonradio(false);
    SetReplybuttonradio1(false);
    SetReplybuttonradio2(true);
  };

  // Button functionality

  const [formValues, setFormValues] = useState([
    {
      button1: "",
      button2: "",
    },
  ]);

  const handleChangeAddButton = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormValues((prev) => {
      const updated = [...prev];

      if (name === "button1" || name === "button2") {
        updated[i] = { ...updated[i], [name]: value };
      }

      return updated;
    });
  };

  const add = (e: any) => {
    e.preventDefault();

    setFormValues([
      ...formValues,
      {
        button1: "",
        button2: "",
      },
    ]);
  };

  // Button functionality

  // interactive functionality

  const [formValuesInterActive, setFormValuesInterActive] = useState([
    {
      button1: "",
      button2: "",
      button3: "",
      button4: "",
      button5: "",
    },
  ]);

  const handleChangeAddButtonInterActive = (
    i: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormValuesInterActive((prev) => {
      const updated = [...prev];

      if (
        name === "button1" ||
        name === "button2" ||
        name === "button3" ||
        name === "button4" ||
        name === "button5"
      ) {
        updated[i] = { ...updated[i], [name]: value };
      }

      return updated;
    });
  };

  const addInteractive = (e: any) => {
    e.preventDefault();

    setFormValuesInterActive([
      ...formValuesInterActive,
      {
        button1: "",
        button2: "",
        button3: "",
        button4: "",
        button5: "",
      },
    ]);
  };

  // interactive functionality

  // add keyword functionality

  const [inputValue, setInputValue] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddKeyword = (value: string) => {
    const cleaned = value.trim();
    if (cleaned && !keywords.includes(cleaned)) {
      setKeywords([...keywords, cleaned]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const handleRemove = (keywordToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  // add keyword functionality
  const emojiPickerRef1 = useRef<HTMLDivElement | null>(null);
  const editorWrapperRef1 = useRef<HTMLDivElement | null>(null);
  const editorInstanceRef1 = useRef<any>(null);
  useEffect(() => {
   const handleClickOutside1 = (event: MouseEvent) => {
     const emojiPickerEl = emojiPickerRef1.current;
     const editorEl = editorWrapperRef1.current;
     if (
       emojiPickerEl &&
       !emojiPickerEl.contains(event.target as Node) &&
       editorEl &&
       !editorEl.contains(event.target as Node)
     ) {
       setShowEmojiPicker1(false);
       setTimeout(() => {
         const editor = editorInstanceRef1.current;
         if (editor) {
         }
       }, 50); 
     }
   };
  
   document.addEventListener("mousedown", handleClickOutside1);
   return () => {
     document.removeEventListener("mousedown", handleClickOutside1);
   };
  }, []);
  const handleEmojiClick1 = (emojiData: { emoji: string }) => {
    if (editorInstance1) {
      const currentContent = editorInstance1.getData();
      editorInstance1.setData(currentContent + emojiData.emoji);
      setResponseText1(currentContent + emojiData.emoji);    
    }
   };
   const [showEmojiPicker1, setShowEmojiPicker1] = useState(false);
   useEffect(() => {
   if (!showEmojiPicker1) {
    const timeout = setTimeout(() => {
       const editor = editorInstanceRef1.current;
       if (editor) {
         editor.focus();
  
         const editable = editor.editable();
         if (editable) {
           const range = editor.createRange();
           range.moveToElementEditEnd(editable);
           editor.getSelection().selectRanges([range]);
         } else {
           console.warn('Editor editable element is null');
         }
       }
     }, 50);
     return () => clearTimeout(timeout);
   }
  }, [showEmojiPicker1]);
  
  //Interactive CkEditor
  const handleEditorChange1 = (event: any) => {
    if (!event.editor) return;
    const editorData = event.editor.getData();
    setResponseText1(editorData);
    if (event?.editor) {
        let htmlText = event.editor.getData()
            .replace(/&nbsp;/g, ' ')
            .replace(/<br\s*\/?>/g, '');
        let formattedText = htmlText
            .replace(/<strong>(.*?)<\/strong>/g, '*$1*')
            .replace(/<em>(.*?)<\/em>/g, '_$1_')
            .replace(/<strike>(.*?)<\/strike>/g, '~$1~')
            .replace(/<s>(.*?)<\/s>/g, '~$1~');
        let cleanText = formattedText.replace(/<(?!\/?(b|i|s)\b)[^>]+>/g, '');
        setResponseText1(cleanText);  
    }
  };
  // const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // const handleEmojiClick = (emojiData: { emoji: string }) => {
  //   if (editorInstance) {
  //     const currentContent = editorInstance.getData();
  //     editorInstance.setData(currentContent + emojiData.emoji);
  //     setResponseText(currentContent + emojiData.emoji);
  //   }
  //   setShowEmojiPicker(false);
  // };
const [showEmojiPicker, setShowEmojiPicker] = useState(false);

const emojiPickerRef = useRef<HTMLDivElement | null>(null);
const editorWrapperRef = useRef<HTMLDivElement | null>(null);
const editorInstanceRef = useRef<any>(null);
useEffect(() => {
 const handleClickOutside = (event: MouseEvent) => {
   const emojiPickerEl = emojiPickerRef.current;
   const editorEl = editorWrapperRef.current;
   if (
     emojiPickerEl &&
     !emojiPickerEl.contains(event.target as Node) &&
     editorEl &&
     !editorEl.contains(event.target as Node)
   ) {
     setShowEmojiPicker(false);
     setTimeout(() => {
       const editor = editorInstanceRef.current;
       if (editor) {
       }
     }, 50); 
   }
 };

 document.addEventListener("mousedown", handleClickOutside);
 return () => {
   document.removeEventListener("mousedown", handleClickOutside);
 };
}, []);
 const handleEmojiClick = (emojiData: { emoji: string }) => {
   if (editorInstance) {
     const currentContent = editorInstance.getData();
     editorInstance.setData(currentContent + emojiData.emoji);
     setResponseText(currentContent + emojiData.emoji);    
   }
 };

 useEffect(() => {
 if (!showEmojiPicker) {
   setTimeout(() => {
     const editor = editorInstanceRef.current;
     if (editor) {
       editor.focus();

       const editable = editor.editable();
       if (editable) {
         const range = editor.createRange();
         range.moveToElementEditEnd(editable);
         editor.getSelection().selectRanges([range]);
       } else {
         console.warn('Editor editable element is null');
       }
     }
   }, 50);
 }
}, [showEmojiPicker]);
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
  const handleBotList = (page: any) => {
    setLoading(true);
    const apiData = {
      pageIndex: page - 1,
      dataLength: 10,
    };
    VendorAPI.botReplyList(apiData)
      .then((responseData: any) => {
        if (responseData?.apiStatus?.code === "200") {
          setLoading(false);
          setbotList(responseData?.result?.BotReplyData);
          setTotalRecords(responseData.result.totalRecordCount);
        } else {
          if (responseData.apiStatus.code == "404") {
            setbotList([]);
          }
          // toast.error(responseData.apiStatus.message);
          setLoading(false);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error("Error during fetching bot list:", error);
        toast.error("An error occurred while fetching the bot flow list.");
      });
  };
  const handlebotStatus = (name: any) => {
    const apiCall =
      name === "active"
        ? VendorAPI.botactiveStatus(botId)
        : VendorAPI.botdeactiveStatus(botId);
    apiCall
      .then((responseData: any) => {
        if (responseData.apiStatus.code === "200") {
          toast.success(responseData.apiStatus.message);
          handleBotList(currentPage);
          const closeButton = document.getElementById("closeactiveModal");
          if (closeButton) {
            closeButton.click();
          }
        } else {
          toast.error(responseData.apiStatus.message);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error("Error during bot status update:", error);
        toast.error("An error occurred while updating the bot status.");
      });
  };
  const handlebotDelete = () => {
    VendorAPI.botdelete(botId)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === "200") {
          const newTotalRecords = totalRecords - 1;
          setTotalRecords(newTotalRecords);
          let totalPages = Math.ceil(newTotalRecords / recordsPerPage);
          if (currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
          } else if (currentPage < 1) {
            setCurrentPage(1);
          }
          const closeButton = document.getElementById("closedeleteModal");
          if (closeButton) {
            handleBotList(currentPage);
            closeButton.click();
          }
          toast.success(responseData.apiStatus.message);
        } else {
          toast.error(responseData.apiStatus.message);
        }
      })
      .catch((error: any) => {
        setLoading(false);
        console.error("Error during delete:", error);
        toast.error("An error occurred during deletion.");
      });
  };
  interface Row {
    id: string;
    uId: string;
    title: string;
    description: string;
  }

  interface Section {
    id: string;
    title: string;
    rows: Row[];
  }
  //  const [listSections, setListSections] =useState<Section[]>([
  //   {
  //     id:"",
  //     title: "",
  //     rows: [
  //       {
  //         id: "",
  //         title: "",
  //         description: ""
  //       },

  //     ]
  //   },

  // ]);
  const [listSections, setListSections] = useState<Section[]>([
    // {
    //   id: Date.now().toString(),
    //   title: "",
    //   rows: [], // <-- start empty
    // },
  ]);
  
  const [showSection, setShowSection] = useState(false);
  const [showAddSection, setshowAddSection] = useState(false);
  const [showRow, setShowRow] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("");
  const addSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: "",
      rows: [],
    };
    setListSections((prev) => [...prev, newSection]);
  };

  const updateSectionTitle = (sectionId: string, newTitle: string) => {
    setListSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, title: newTitle } : section
      )
    );
  };

  const deleteSection = (sectionId: string) => {
    setListSections((prev) =>
      prev.filter((section) => section.id !== sectionId)
    );
    if (listSections.length <= 0) setShowSection(false);
  };

  const addRow = (sectionId: string) => {

    setListSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: [
                ...section.rows,
                {
                  uId: Date.now().toString(),
                  id: "", 
                  title: "",
                  description: "",
                },
              ],
            }
          : section
      )
    );
  };

  const updateRow = (
    sectionId: string,
   
    uId: string,
    id:string,
    field: keyof Row,
    value: string
  ) => {
    setListSections((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              rows: section.rows.map((row) =>
                row.uId === uId ? { ...row, [field]: value } : row
              ),
            }
          : section
      )
    );
  };

  const deleteRow = (sectionId: string, rowIndex: any) => {
  setListSections((prev) =>
    prev.map((section) =>
      section.id === sectionId
        ? {
            ...section,
            rows: section.rows.filter((_, index) => index !== rowIndex),
          }
        : section
    )
  );
};

  

  const handleChangeInteractive = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInteractiveType(e.target.value);
  };

  const handleChangeType = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setresType(e.target.value);
  };
 const resetForm=()=>{
    setbotName("");
    setFooterText("")
    setInputValue("")
    setButtonLabel("")
    setKeywords([]);
    setResponceTypeSelection("");
    setresType("")
    settriggerName("")
    setResponce("");
    setResponseText("")
    setResponseText1("")
    setInteractiveType("");
    setImgUrl("");
    setCaption("");
    setListSections([]);
    setSelectedOption('');
    setCtaTextInput('');
    setCtaURLInput('');
    setisEditBot(0);
    setfileName('');
    setreplyTextInput1('');
    setreplyTextInput2('');
    setreplyTextInput3('');
    setSubmit(false);
    setMediaText('');
 }
 // Create chat Bot
  const handlebotCreate = () => {     
      let apiData 
    if(resType=="media"){  
    
        if(selectedOption=="text"){
          apiData=  {
            botAction: {
              botName: botName,
              intents: keywords,
              trigger: {
                type: triggerName
              },
              responses: [
                {
                  type: selectedOption,

                  
                }
              ]
            }}
        }else{
            apiData=  {
              botAction: {
                botName: botName,
                intents: keywords,
                trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    type: selectedOption,
                    url:imgUrl,
                    caption:caption
                  }
                ]
              }}
          }}  
          if(resType=="text"){          
              apiData=  {
                  botAction: {
                    botName: botName,
                    intents: keywords,
                    trigger: {
                      type: triggerName
                    },
                    responses: [
                      {
                        type: resType,
                        text: responseText,
                        
                      }
                    ]
                  }}}      
           if(interactiveType==="reply"){
            apiData={
              botAction: {
                botName: botName,
                intents:keywords,
              trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    type: resType,
                    media_type:selectedOption,
...(["image"].includes(selectedOption) && mediaText
            ? { header_text: mediaText }
            : {}),                    sub_type:interactiveType,
                    url: selectedOption === "text" ? "" : imgUrl,
                    caption:responseText1,
                    footer:footerText,
                    buttons: [
  replyTextInput1 && { title: replyTextInput1 },
  replyTextInput2 && { title: replyTextInput2 },
  replyTextInput3 && { title: replyTextInput3 },
].filter(Boolean)

                  }
                ]
            }
          }}
          else if(interactiveType==="list"){
            apiData={
              botAction: {
                botName: botName,
                intents:keywords,
              trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    type: resType,
                    media_type:selectedOption,
...(["image", "video", "document"].includes(selectedOption) && mediaText
            ? { header_text: mediaText }
            : {}),                    sub_type:interactiveType,
                    url: selectedOption === "text" ? "" : imgUrl,
                    caption:responseText1,
                    buttonLabel:buttonLabel,
                    listSections:listSections,
                    footer:footerText,
                  }
                ]
            }
          }}
          else if(interactiveType==="cta"){
            apiData=  {
              botAction: {
                botName: botName,
                intents: keywords,
                trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    type: resType,
                    media_type:selectedOption,
...(["image", "video", "document"].includes(selectedOption) && mediaText
            ? { header_text: mediaText }
            : {}),                    sub_type: interactiveType,
                    url: selectedOption === "text" ? "" : imgUrl,
                    caption:responseText1,
                    footer:footerText,
                    buttons: [
                      {
                        title:ctaTextInput,
                        url: ctaURLInput
                      }
                    ]
                  }
                ]
              }}
          }
      const apiCall = VendorAPI.chatCreateAPI(apiData) 
      apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData.apiStatus.message);
              handleBotList(currentPage);
              resetForm();
              setSubmit(false)
               const closeButton = document.getElementById("botModalClose");
               
               if (closeButton) {
                  closeButton.click();
               }
            

            } else {
               toast.error(responseData.apiStatus.message);
              //  setSubmit(false)
            }
         })
         .catch((error: any) => {
          setSubmit(false)
            console.error("Error during bot creation:", error);
            toast.error("An error occurred while bot creation.");
         });
   };

  // Edit chat Bot  
   const handlebotEdit = () => {  
    console.log(resType,"Kandupudipan")   
      let apiData 
   if(resType=="media"){  
      apiData=  {
          botAction: {
            id:editId,
            botName: botName,
            iknow:resType,
            intents: keywords,
            trigger: {
              type: triggerName
            },
            responses: [
              {
                type: selectedOption,
                url:imgUrl,
                caption:caption
              }
            ]
          }}}
          else if(resType=="text"){          
            apiData=  {
              botAction: {
                id:editId,
                  botName: botName,
                  iknow:resType,
                intents: keywords,
                trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    type: resType,
                    text: revertFormattedText(responseText)
                  }
                ]
              }}}      
          else if(interactiveType==="reply"){
            apiData={
              botAction: {
                id:editId,
                botName: botName,
                iknow:resType,
                intents:keywords,
              trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    footer:footerText,
                    type: resType,
                    media_type:selectedOption,
                    header_text:selectedOption ==="image" || selectedOption ==="video"|| selectedOption ==="document" ? "":mediaText,
                    sub_type:interactiveType,
                    url: selectedOption === "text" ? "" : imgUrl,
                    caption:revertFormattedText(responseText1),
                    buttons: [
  replyTextInput1 && { title: replyTextInput1 },
  replyTextInput2 && { title: replyTextInput2 },
  replyTextInput3 && { title: replyTextInput3 },
].filter(Boolean)

                  }
                ]
            }
          }}
          else if(interactiveType==="list"){
        apiData={
          botAction: {
            id:editId,
            botName: botName,
            iknow:resType,
            intents:keywords,
          trigger: {
              type: triggerName
            },
            responses: [
              {
                footer:footerText,
                type: resType,
                media_type:selectedOption,
                header_text:selectedOption ==="image" || selectedOption ==="video"|| selectedOption ==="document" ? "":mediaText,
                sub_type:interactiveType,
                url: selectedOption === "text" ? "" : imgUrl,
                caption:revertFormattedText(responseText1),
                buttonLabel:buttonLabel,
                listSections:listSections
              }
            ]
        }
          }}
          else if(interactiveType==="cta"){
            apiData=  {
              botAction: {
                id:editId,
                botName: botName,
                iknow:resType,
                intents: keywords,
                trigger: {
                  type: triggerName
                },
                responses: [
                  {
                    footer:footerText,
                    type: resType,
                    media_type:selectedOption,
                    header_text:selectedOption ==="image" || selectedOption ==="video"|| selectedOption ==="document" ? "":mediaText,
                    sub_type: interactiveType,
                    url: selectedOption === "text" ? "" : imgUrl,
                    caption: revertFormattedText(responseText1),
                    buttons: [
                      {
                        title:ctaTextInput,
                        url: ctaURLInput
                      }
                    ]
                  }
                ]
              }}
          }
      const apiCall = VendorAPI.chatEditAPI(apiData)
      apiCall
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               toast.success(responseData.apiStatus.message);
              handleBotList(currentPage);
              resetForm();
               const closeButton = document.getElementById("botModalClose");
               if (closeButton) {
                  closeButton.click();
               }
            } else {
               toast.error(responseData.apiStatus.message);
              //  setSubmit(false)
            }
         })
         .catch((error: any) => {
            setSubmit(false)
            console.error("Error during bot update:", error);
            toast.error("An error occurred while bot update.");
         });
   };
   const [duplicateBotId,setDuplicateBotId]=useState("")
  const handleBotDuplicate=()=>{
   let apiData;
   apiData=  {
    id:duplicateBotId
   }
    const apiCall = VendorAPI.chatDuplicateAPI(apiData) 
    apiCall
       .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
            handleBotList(currentPage);
            setDuplicateBotId("")
             toast.success(responseData.apiStatus.message);
             const closeButton = document.getElementById("closeDuplicate");
             if (closeButton) {
                closeButton.click();
             }
           
          } else {
             toast.error(responseData.apiStatus.message);
          }
       })
       .catch((error: any) => {
          setLoading(false)
          console.error("Error during bot duplication:", error);
          toast.error("An error occurred while bot duplication.");
       });
  } 
  const handleGetBotbyID=()=>{
    let apiData;
    apiData=  {
     id:duplicateBotId
    }
     const apiCall = VendorAPI.chatDuplicateAPI(apiData) 
     apiCall
        .then((responseData: any) => {
           if (responseData.apiStatus.code === '200') {
             handleBotList(currentPage);
             setDuplicateBotId("")
              toast.success(responseData.apiStatus.message);
              const closeButton = document.getElementById("closeDuplicate");
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
   }  
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const [fileName, setfileName] = useState("");
   const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "completed">("idle");

   const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    if (!files || files.length === 0) {
      return;
    }
    setimgLoading(true)
    const file1 = files[0];
    setfileName(file1.name);
    const allowedExtensions = {
      images: ['jpg', 'jpeg', 'png'],
      videos: ['mp4', 'mov', 'avi', 'mkv'],
      documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    };
    const extension = (file1.name.split('.').pop() || '')?.toLowerCase();
    const isImage = allowedExtensions.images.includes(extension);
    const isVideo = allowedExtensions.videos.includes(extension);
    const isDocument = allowedExtensions.documents.includes(extension);
    const isValid = isImage || isVideo || isDocument;
    if (!isValid) {
      let message = "Invalid file type.";
      if (file1.type.startsWith("image/")) {
        message = "Only JPG, JPEG, and PNG image files are allowed.";
      } else if (file1.type.startsWith("video/")) {
        message = "Only MP4, MOV, AVI, and MKV video files are allowed.";
      } else if (
        file1.type === "application/pdf" ||
        file1.type === "application/msword" ||
        file1.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file1.type === "application/vnd.ms-excel" ||
        file1.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        message = "Only PDF, DOC, DOCX, XLS, and XLSX document files are allowed.";
      }
    
      toast.error(message);
      setimgLoading(false)
      return;
    }
    const formData1 = new FormData();
    formData1.append("file", file1);
    formData1.forEach((value, key) => {
    });
    const file = files[0];
    const imageUrl = URL.createObjectURL(file);
    setUploadStatus("uploading");
    try {
      const response = await VendorAPI.chatBotImageUploadAPI(formData1)
          if (response?.apiStatus?.code==="200") {
              const path=baseURL+response.result.Path
              setImgUrl(path);
              setimgLoading(false)
              setUploadStatus("completed");
              toast.success(response?.apiStatus?.message);
          } else {
              setUploadStatus("idle"); 
              setimgLoading(false)
              toast.error(response.apiStatus?.message);
          }
      } catch (error) {
          setUploadStatus("idle"); 
          setimgLoading(false)
          console.error("Import Error:", error);
          toast.error("An error occurred while importing the file.");
      }
  }

  const handleTriggerDrop = () => {
    VendorAPI.botTriggerDrop()
        .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
            settriggerDrop(responseData.result.TriggerTypeDataDropDown);
          } else {
              toast.error(responseData.apiStatus.message);
          }
        })
        .catch((error: any) => {
          setLoading(false)
          console.error("Error fetching trigger drop data:", error);
          toast.error("An error occurred while fetching trigger drop data.");
        });
  };
  
  function downloadFile(url:any) {
  const link = document.createElement('a');
  link.href = url;
  link.download = '';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  }
    
  useEffect(() => {
    handleBotList(currentPage);
  }, [currentPage]);
  useEffect(()=>{
    handleTriggerDrop();
  },[])
  const handlebotReplyGet= (botId: any) => {
    resetForm()
    VendorAPI.chatBotGetAPI(botId)
        .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
                handleEditPopulate("Edit",responseData?.result);
            } else {
                toast.error(responseData.apiStatus.message);
                setLoading(false)
            }
        })
        .catch((error: any) => {
            setLoading(false)
            console.error("Error fetching bot reply data:", error);
            toast.error("An error occurred while fetching bot reply data.");
        });
    };
    const getMediaType = (url:any) => {
      if (!url) return null;
    
      const extension = url.split('.').pop().toLowerCase();
    
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
        return 'image';
      } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return 'video';
      } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
        return 'document';
      }
    
      return null;
    };
    const mediatype = getMediaType(imgUrl);
  useEffect(() => {
      setResponseText(responseText);
      setResponseText1(responseText1);
  }, [responseText, responseText1]);
// Handle Edit - Populate
function renderFormattedText(rawText: string): string {
  let output = rawText;
  output = output.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  output = output.replace(/_(.*?)_/g, '<em>$1</em>');
  output = output.replace(/~(.*?)~/g, '<strike>$1</strike>');
  output = output.replace(/\n/g, '<br>');
  return output;
}
function revertFormattedText(htmlText: string): string {
  let output = htmlText;
  output = output.replace(/<strong>(.*?)<\/strong>/g, '*$1*');
  output = output.replace(/<em>(.*?)<\/em>/g, '_$1_');
  output = output.replace(/<strike>(.*?)<\/strike>/g, '~$1~');
  output = output.replace(/<br\s*\/?>/g, '\n');
  return output;
}

const handleEditPopulate=(value: any,listData:any)=>{
  const messageBody=listData.message_body?.[0]
  setEditId(listData?.id)
  setbotName(listData?.name)
    setKeywords(Array.isArray(listData?.intent) ? listData.intent : []);
    setInteractiveType(messageBody?.sub_type)
    setresType(messageBody?.type)
    setImgUrl(messageBody?.url)
    if((messageBody.type==="image" || messageBody.type==="video" || messageBody.type==="document")){
    setCaption(messageBody?.caption)
    }
    setFooterText(messageBody?.footer)
    settriggerName(listData?.trigger?.name);
    setmediaType(listData.message_type);
    console.log(listData.message_type,"Hello")
    if(messageBody?.url && messageBody.media_type==="image"){
      setSelectedOption("image")
    }
    else if(messageBody?.url && messageBody.media_type==="video"){
      setSelectedOption("video")
    }
    else if(messageBody?.url && messageBody.media_type==="document"){
      setSelectedOption("document")
    }

   if(listData.message_type=="text"){
    if(messageBody){
      const formatted = renderFormattedText(messageBody.text);
    setResponseText(formatted);
  
      }
   }
   if(listData.message_body[0].type=="interactive"){
    if(messageBody){
      const formatted = renderFormattedText(messageBody.caption);
    setResponseText1(formatted);
  
      }
   }

   if((listData.message_type=="interactive_list" && messageBody.media_type==="text") || (listData.message_type=="interactive_reply" && messageBody.media_type==="text") || (listData.message_type=="interactive_cta" && messageBody.media_type==="text")){
    setresType("interactive");
    setSelectedOption("text");
    setMediaText(messageBody.header_text);
   }
   if(listData.message_type==="image"){
    console.log("first",listData.message_type)
    setresType("media")
    setSelectedOption("image")
   }
   if(messageBody.type==="video"){
    setSelectedOption(messageBody.type)
    setresType("media")
   }
   if(messageBody.type==="document"){
    console.log("Inga banga")
    setSelectedOption(messageBody.type)
    setresType("media")
   }

    if(listData.message_type==="interactive_reply"){
      setreplyTextInput1(messageBody.buttons[0]?.title); // Set first button title
      setreplyTextInput2(messageBody.buttons[1]?.title); // Set second button title
      setreplyTextInput3(messageBody.buttons[2]?.title);
    }
    if(listData.message_type==="interactive_cta"){
      if(messageBody){
        const ctaText = messageBody.buttons[0]?.title; 
        const ctaURL = messageBody.buttons[0]?.url;
       
    setCtaTextInput(ctaText)
    setCtaURLInput(ctaURL)
       }
         
    }
     if(listData.message_type==="interactive_list"){
      
  
   
    
   if(messageBody){
  
    setShowSection(true)
    if(messageBody?.listSections?.[0].rows?.length>=0){
      setButtonLabel(messageBody?.buttonLabel)
      setShowRow(true)}
    setListSections(messageBody?.listSections)

   }
     

     }
     setisEditBot(1)
}

//Simple CkEditor
const handleEditorChange = (event: any) => {
  if (!event.editor) return;
  const editorData = event.editor.getData();
  setResponseText(editorData);
  if (event?.editor) {
      let htmlText = event.editor.getData()
          .replace(/&nbsp;/g, ' ')
          .replace(/<br\s*\/?>/g, '');
      let formattedText = htmlText
          .replace(/<strong>(.*?)<\/strong>/g, '*$1*')
          .replace(/<em>(.*?)<\/em>/g, '_$1_')
          .replace(/<strike>(.*?)<\/strike>/g, '~$1~')
          .replace(/<s>(.*?)<\/s>/g, '~$1~');
      let cleanText = formattedText.replace(/<(?!\/?(b|i|s)\b)[^>]+>/g, '');
      setResponseText(cleanText);  
  }
};
const [submit,setSubmit]=useState(false)
const [listErrors, setListErrors] = useState<SectionError[]>([]);

type RowError = {
  uId: string;
  titleError: boolean;
  descriptionError: boolean;
};

type SectionError = {
  id: string;
  titleError: boolean;
  rows: RowError[];
};

const validateListSectionWithStructure = (
  listSections: any[]
): [boolean, SectionError[]] => {
  const errors: SectionError[] = [];
  let hasErrors = false;

  listSections.forEach((section) => {
    const sectionError: SectionError = {
      id: section.id,
      titleError: !section.title || section.title.trim() === "",
      rows: [],
    };

    if (sectionError.titleError) hasErrors = true;

    if (!Array.isArray(section.rows) || section.rows.length === 0) {
      hasErrors = true;
    } else {
      section.rows.forEach((row: { uId: any; title: string; description: string; }) => {
        const rowError: RowError = {
          uId: row.uId,
          titleError: !row.title || row.title.trim() === "",
          descriptionError: !row.description || row.description.trim() === "",
        };

        if (rowError.titleError || rowError.descriptionError) {
          hasErrors = true;
        }

        sectionError.rows.push(rowError);
      });
    }

    errors.push(sectionError);
  });

  return [!hasErrors, errors];
};
 const handleSubmitBot=()=>{
  setSubmit(true);
 
  if (!botName || !keywords || !triggerName || !resType) {
    console.log("Missing required bot fields");
    return;
  }
  if (!resType) {
    return;
  }
  if ((resType === "text" && !responseText) || (resType === "interactive" && !responseText1)) {
    return;
  }
   // if (selectedOption === "text" &&  !mediaText) {
  //   return;
  // }  
  // if ((resType === "interactive" && !selectedOption)) {
  //   return;
  // }
  if (resType === "interactive" && !interactiveType) {
    return;
  }
  if (
    resType === "media" &&
    ["image", "video", "document"].includes(selectedOption) &&
    !imgUrl
  ) {
    setSelectedOption(selectedOption);
    return;
  }
  

  if (
    interactiveType === "reply" &&
    (!replyTextInput1)
  ) {
    console.log("reply")
    return;
  }

  if (
    interactiveType === "cta" &&
    (!ctaTextInput || !ctaURLInput)
  ) {
    console.log("cta")
    return;
  }
  // if(resType==="interactive"){
  //   if (!imgUrl || !caption) {
  //     setSelectedOption("image")
  //   return;
  //     }
  // }
  if (interactiveType === "list" ) {
    console.log("first")
    // if (!imgUrl || !caption) {
    //   console.log("2")
    //   return;
    // }
    // const [isValid, structuredErrors] = validateListSectionWithStructure(listSections);
    // setListErrors(structuredErrors);

    // if (!isValid) {
    //   console.log("3")
    //   return; 
    // } else {
    //   setListErrors([]);
    // }
  
  }
  
  if(isEditBot==1){ 
    handlebotEdit() 

  }else{
    handlebotCreate()
  }
 }
 

 const divRef = useRef<HTMLDivElement>(null);
 
 // Example function using the ref safely
 const updateResponseText = () => {
   if (divRef.current) {
     setResponseText(divRef.current.innerHTML);
     divRef.current.focus();
   }
 };
 
 const placeCaretAtEnd = (el: HTMLElement) => {
   const range = document.createRange();
   const sel = window.getSelection();
   if (!sel) return;
 
   range.selectNodeContents(el);
   range.collapse(false);
   sel.removeAllRanges();
   sel.addRange(range);
 };
  return (
    <DashboardLayout>
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <TopNav />
        <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
          <div className="col-md-6">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                <li className="breadcrumb-item text-sm">
                  <Link
                    className="opacity-5 text-dark"
                    to={"/vendor/dashboard"}
                  >
                    Dashboard
                  </Link>
                </li>
                <li
                  className="breadcrumb-item text-sm text-dark active"
                  aria-current="page"
                >
                  Chat Bots
                </li>
              </ol>
              <h6 className="text-start font-weight-bolder mb-0">Chat Bots</h6>
            </nav>
          </div>
          <div className="col-md-6 text-end dropdown">
            <button
              className="vendor-crt-btn"
              data-bs-toggle="modal"
              data-bs-target="#createModel"
              // aria-expanded="false"
              onClick={()=>{resetForm();openModal("create")}}
            >
              <span>Create Bot</span>{" "}
            </button>
            &nbsp;
            {/* Create Bot Model */}
            <div
              className="modal fade"
              id="createModel"
              tab-Index="-1"
              aria-labelledby="exampleModalLabel"
              data-bs-backdrop="static" data-bs-keyboard="false"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-lg">
                <div className="modal-content p-3 all-modal-content vendorcontact-modal-content">
              <div className="modal-header p-0 mb-0 d-flex justify-content-between border-0">
                  <h5 className="modal-title ps-3" id="exampleModalLabel">
                    {modalMode === "create" ? "Create Chatbot" : "Edit Chatbot"}
                  </h5>
                  <button type="button" onClick={resetForm} className="close modal-Xbutton" data-bs-dismiss="modal" aria-label="Close">
                      <span></span>
                  </button>
              </div>
              <div className="col-md-12 login-input-group modal-body pb-0">
              <div className="vendor-create-container">
              <input autoComplete="off" value={botName} onChange={(e)=>{setbotName(e.target.value);setShowBotNameValidation(false)}} type="text" id="vendor-crt-input" 
              className={`vendor-crt-input loginfilled-frame-username  ${submit && botName.length==0 ? 'error' : ''}`} placeholder=" " required />
              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-headset"></i> Bot Name</label>
              </div>
              {submit && botName?.length == 0 ? <div className='text-start text-danger error-message-required'>Bot name is required</div> : <></>}

              </div>

            <div className="col-md-12 login-input-group modal-body pt-0 pb-0">
            <div className="vendor-create-container">
            <input autoComplete="off"value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddKeyword(inputValue);
                  }
                }} type="text" id="vendor-crt-input" 
className={`vendor-crt-input loginfilled-frame-username ${
  submit && (keywords.length === 0 || keywords.some(kw => !/^[a-zA-Z0-9 _]*$/i.test(kw))) ? 'error' : ''
}`} 
placeholder=" " 
required 
/>
                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-keyboard"></i> Add Keywords</label>
                {showSuggestions && inputValue && (
                <div
                  className="text-start dropdown-suggestion bg-white border rounded mt-1 px-2 py-1"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    zIndex: 10,
                    width: "100%",
                    cursor: "pointer",
                  }}
                  onClick={() => handleAddKeyword(inputValue)}
                >
                  Add "{inputValue}"
                </div>
              )}
              
              </div>
              <div className="text-start px-3 ">
                  {keywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="chip d-inline-flex align-items-center px-2 me-2 border rounded-pill"
                      style={{ width: "auto", maxWidth: "100%",fontSize:"12px" }}
                    >
                      <span className="me-1">{keyword}</span>
                      <span
                        className="close-icon ms-1 text-danger"
                        style={{ cursor: "pointer", fontWeight: "bold",border:"0.5px solid red",background:"transparent" }}
                        onClick={() => handleRemove(keyword)}
                      >
                        ×
                      </span>
                    </div>
                  ))}
                </div>
                {submit && keywords?.length === 0 ? (<div className="text-start text-danger error-message-required">Keyword is required</div>) : (
                    <>
                      {keywords.length > 0 && keywords.some(kw => !/^[a-zA-Z0-9 ]*$/i.test(kw)) && (<div className="text-start text-danger error-message-required">Special characters are not allowed</div>)}
                    </>
                )}
              </div>

                <div className="col-md-12 px-3 login-input-group">
                  <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <input
                        autoComplete="off"
                        type="text"
                      //  onClick={handleTriggerDrop}
                        id="vendor-crt-input"
                        className={`vendor-crt-input loginfilled-frame-username  ${submit && triggerName.length==0 ? 'error' : ''}`}
                        value={triggerName}
                        placeholder=" "
                        required
                        onChange={(e)=>settriggerName(e.target.value)}
                    />
                    <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-id-card-clip"></i> Trigger Type</label>
                    <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                    <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                    {triggerDrop.length === 0 ? (
                          <li className="dropdown-nodata-found">No data found</li>
                        ) : (
                          triggerDrop.map((dropdownValue, id) => (                                                            
                          <li key={id}>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => { settriggerId(dropdownValue.id); settriggerName(dropdownValue.name) }}
                              >
                                {dropdownValue.name}
                              </a>
                          </li>
                        )))}
                    </ul>
                  </div>
                  {submit && triggerName?.length == 0 ? <div className='text-start text-danger error-message-required'>Trigger type is required</div> : <></>}                                                   
              </div>
                  <div className="card card-details shadow-sm rounded border chat-form-card p-3 border mt-5">
                    <div className="modal-header  border-0">
                      <h1
                        className="modal-title campaign-temp-head responce-name-title"
                        id="exampleModalLabel"
                      >
                        Responce Type
                      </h1>
                    </div>

                    <div className="modal-body four-input row">
                      <div className="col-md-3 four-input-one">
                        <label className="radio-container full-click">
                          <input
                            value="text"
                            type="radio"
                            id="simleText"
                             name="responseType"
                            onChange={handleChangeType}
                            checked={resType === "text"}
                            

                          />
                          <span>Simple</span>
                        </label>
                      </div>
                      <div className="col-md-3 four-input-sec">
                        <label className="radio-container full-click">
                          <input
                            value="media"
                            type="radio"
                            id="media"
                             name="responseType"
                             checked={resType === "media"}

                            onChange={handleChangeType}

                          />
                          <span>Media</span>
                        </label>
                      </div>
                      <div className="col-md-3 four-input-sec">
                        <label className="radio-container full-click">
                          <input
                            value="interactive"
                            type="radio"
                            id="interactive"
                             name="responseType"
                             checked={resType === "interactive"}
                            onChange={handleChangeType}

                          />
                          <span>Interactive</span>
                        </label>
                      </div>
                      {submit && resType?.length===0 ? <div className='text-start text-danger error-message-required'>Bot reply type field is required</div> : <></> }
                    </div>
                  </div>

                  <div className="modal-header row border-0">
                  <div className="col-md-12 px-3">
                      {resType === "interactive" && (
                          <div className="d-flex flex-column" ref={editorWrapperRef1}>
                          <label className="button-label text-start">Response Text<span className=" text-danger mx-2">{(submit && !responseText1)?"*Response Text is required":"" }</span></label>
                          <CKEditor
                            initData={responseText1}
                            onInstanceReady={(event) => {
                              editorInstanceRef1.current = event.editor;
                           setEditorInstance1(event.editor);
                           }}
                            onChange={handleEditorChange1}
                            config={{
                            toolbar: [
                            ["Bold", "Italic",],
                            ],
                            versionCheck: false,
                            resize_enabled: false,
                            removePlugins: "about",
                            ignoreUnsupportedBanner: true,
                            enterMode: 2,
                            shiftEnterMode: 2,
                            autoParagraph: false,
                            entities: false,
                            entities_latin: false,
                            basicEntities: false,
                            fillEmptyBlocks: false,
                            }}
                            />
                            <button
                              className="toolbar-btn text-end mt-1"
                              onClick={(e) =>{
                                e.preventDefault()
                                setShowEmojiPicker1(!showEmojiPicker1)
                              }
                                
                              }
                            >
                              ADD EMOJI
                            </button>
                          </div>
                       )}
                      {showEmojiPicker1 && (
                      <div
                        ref={emojiPickerRef1}
                        className="characters"
                        style={{ position: "absolute", zIndex: 10 }}
                      >
                        <EmojiPicker onEmojiClick={handleEmojiClick1} />
                      </div>

                    )} 
                    </div>
                    <div className="col-md-12 px-3">
                      {resType === "text" && (
                          <div className="d-flex flex-column" ref={editorWrapperRef}>
                          <label className="button-label text-start">Response Text<span className=" text-danger mx-2">{(submit && !responseText)?"*Response Text is required":"" }</span></label>
                          <CKEditor
                            initData={responseText}
                            onInstanceReady={(event) => {
                              editorInstanceRef.current = event.editor;
                           setEditorInstance(event.editor);
                           }}
                            onChange={handleEditorChange}
                            config={{
                            toolbar: [
                            ["Bold", "Italic",],
                            ],
                            versionCheck: false,
                            resize_enabled: false,
                            removePlugins: "about",
                            ignoreUnsupportedBanner: true,
                            enterMode: 2,
                            shiftEnterMode: 2,
                            autoParagraph: false,
                            entities: false,
                            entities_latin: false,
                            basicEntities: false,
                            fillEmptyBlocks: false,
                            }}
                            />
                            <button
                              className="toolbar-btn text-end mt-1"
                              onClick={(e) =>{
                                e.preventDefault()
                                setShowEmojiPicker(!showEmojiPicker)
                              }
                                
                              }
                            >
                              ADD EMOJI
                            </button>
                          </div>
                       )}
                      {showEmojiPicker && (
                      <div
                        ref={emojiPickerRef}
                        className="characters"
                        style={{ position: "absolute", zIndex: 10 }}
                      >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </div>

                    )} 
                    </div>
                    <div className="col-md-12">
                      {(resType === "media"|| resType ==="interactive") && (
                        <div>
                           <div className="modal-header border-0">
                    <h1
                      className="modal-title responce-name-title"
                      id="exampleModalLabel"
                    >
                      Media Type
                    </h1>
                  </div>

                  <div className="modal-body four-input row">
                    {[
                      ...(resType === "interactive"
                        ? [
                            {
                              value: "text",
                              label: "Text",
                              icon: "fa-regular fa-file-lines",
                            },
                          ]
                        : []),
                      {
                        value: "image",
                        label: "Image",
                        icon: "fa-solid fa-image",
                      },
                      {
                        value: "video",
                        label: "Video",
                        icon: "fa-solid fa-video",
                      },
                      {
                        value: "document",
                        label: "Document",
                        icon: "fa-regular fa-file",
                      },
                    ].map((item, index) => (
                      <div key={item.value} className="col-md-3">
                        <label
                        className={`radio-containers text-center p-3 rounded cursor-pointer 
                          ${selectedOption === item.value ? "chatbot-selected-option" : ""}`}                          
                        htmlFor={`option-${item.value}`}
                        >
                          <div>
                            <i className={`${item.icon} chatbox-icon-size`}></i>
                          </div>
                          <input
                            type="radio"
                            id={`option-${item.value}`}
                            name="options"
                            value={item.value}
                            className="form-check-input mb-2"
                            onChange={handleChange}
                            style={{ display: "none" }}
                          />
                          <div>{item.label}</div>
                        </label>
                      </div>
                      
                    ))}
                  {/* {submit && selectedOption?.length===0 ? <div className='text-start text-danger error-message-required'>Media type is required</div> : <></> } */}

                  </div>
                        </div>
                      )}
                    </div>
                    <div className="col-md-4">
                      {responceTypeSelection === "custom" && (
                        <div>
                          <label className="button-label">
                            Custom Method Responce
                          </label>
                          <select className="chat-bot-inputss" name="" id="">
                            <option value="">Get Loyality Status</option>
                            <option value="">Get Daily Updates</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="modal-header border-0">
                    <div className="col-md-12 px-3 login-input-group">
                      {resType==="interactive" && selectedOption === "text" && (
                        <div>
                        <div className="vendor-create-container">
                        <input
                          type="text"
                          placeholder=""
                          id="vendor-crt-input"
                          className={`vendor-crt-input loginfilled-frame-username`}
                          // ${submit && mediaText?.length==0 ? 'error' : ''}
                          value={mediaText}
                          onChange={(e)=>setMediaText(e.target.value)}
                        />
                        <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-pen-to-square"></i> Header Text</label>
                        </div>
                        {/* {submit && mediaText.length === 0 && (
                        <div className="text-start text-danger error-message-required mt-1">
                          Header text is required
                        </div>
                        )} */}
                      </div>)}
                      {(resType === "media" || resType === "interactive") && selectedOption === "image" && (
                      <div>
                        <div className={`media-upload-container loginfilled-frame-username 
                        ${submit&&(!imgUrl || imgUrl?.length === 0) ? 'error' : ''}`}>
                        <label htmlFor="vendor-crt-input-2" className="media-upload-label">
                        <i className="fa-solid fa-image icon-left mt-1" /> 
                        <span className="mt-1">Upload Image</span>
                        </label>
                        {/* Image Preview Box */}
                        {mediatype === "image" && imgUrl && (
                        <div className="image-preview-wrapper position-relative">
                        <img className="preview-image rounded" src={imgUrl} alt="Uploaded Preview" />
                        <div className={`upload-spinner-overlay ${uploadStatus}`}>
                          {uploadStatus !== 'completed' ? (
                            <div className="spinner-with-text">
                              <div className="spinner"></div>
                            </div>
                          ) : (
                            <div className="tick-icon">&#10003;</div>
                          )}
                        </div>
                      </div>
                        )}
                        <input
                        type="file"
                        id="vendor-crt-input-2"
                        className="media-upload-input"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ cursor: "pointer" }}
                        />
                        <button className="media-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>
                        <i className="fa-solid fa-arrow-up-from-bracket text-dark"></i> Select
                        </button>
                      </div>
                      {submit&&(!imgUrl || imgUrl?.length === 0) && (
                      <div className="text-start text-danger error-message-required mt-1">
                        Image is required
                      </div>
                      )}
                      </div>
                      )}
                      <p className="text-sm text-start mb-0 p-0" style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                      {mediatype === "image" && selectedOption === "image" ?  fileName :""}
                      </p>
                      {(resType === "media" || resType === "interactive") && selectedOption === "video" && (
                        <div>
                        <div className={`media-upload-container loginfilled-frame-username 
                          ${submit&&(!imgUrl || imgUrl.length === 0) ? 'error' : ''}`}>
                        <label htmlFor="vendor-crt-input-2" className="media-upload-label">
                        <i className="fa-solid fa-video icon-left mt-1" /> 
                        <span className="mt-1">Upload Video </span>
                        </label>
                        {mediatype==="video" && imgUrl ? <video className="w-25 rounded" controls><source src={imgUrl} type="video/mp4" /></video>:""}
                      <input
                        type="file"
                        id="vendor-crt-input-2"
                        className="media-upload-input"
                          accept="video/*"
                          ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ cursor: "pointer" }}
                      />
                      <button className="media-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>
                        <i className="fa-solid fa-arrow-up-from-bracket text-dark"></i>Select</button>
                      </div>
                      {submit&&(!imgUrl || imgUrl?.length === 0) && (
                        <div className="text-start text-danger error-message-required mt-1">
                          Video is required
                        </div>
                        )}
                      </div>
                      )}
                      <p className="text-sm text-start mb-0 p-0" style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                        {mediatype === "video" && selectedOption === "video" ? fileName :""}
                      </p>
                      {(resType === "media" || resType === "interactive") && selectedOption === "document" && (
                        <div>
                        <div className={`media-upload-container loginfilled-frame-username
                          ${submit&&(!imgUrl || imgUrl?.length === 0) ? 'error' : ''}`}>
                        <label htmlFor="vendor-crt-input-2" className="media-upload-label">
                        <i className="fa-solid fa-file icon-left mt-1" /> 
                        <span className="mt-1">Upload Document</span>
                        </label>
                        {mediatype === "document" ? (
                          <button
                            className="media-upload-button"
                            type="button"
                            onClick={() => downloadFile(imgUrl)}
                          >
                            <i className="fa-solid fa-file-export text-dark"></i> Media Link
                          </button>
                        ) : null}

                      <input
                        type="file"
                        id="vendor-crt-input-2"
                        className="media-upload-input"
                        accept=".pdf,.doc,.docx,.txt"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ cursor: "pointer" }}
                        />

                        <button className="media-upload-button" type="button" onClick={() => fileInputRef.current?.click()}>
                          <i className="fa-solid fa-arrow-up-from-bracket text-dark"></i>Select</button>
                        </div>
                        {submit&&(!imgUrl || imgUrl?.length === 0) && (
                        <div className="text-start text-danger error-message-required mt-1">
                          Document is required
                        </div>
                        )}
                      </div>
                      )}
                       <p className="text-sm text-start mb-0 p-0" style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                          {mediatype==="document" && selectedOption === "document" ? fileName:""}
                        </p>
                      {resType === "media" && 
                      (selectedOption === "image" || selectedOption === "video" || selectedOption === "document") && (
                        <div className="col-md-12 login-input-group">
                          <div className="vendor-create-container">
                            <input 
                              autoComplete="off" 
                              type="text" 
                              id="vendor-crt-input" 
                              value={caption || ""}
                              onChange={(e) => setCaption(e.target.value)}
                              className={`vendor-crt-input loginfilled-frame-username ${
                                submit &&
                                (
                                  (selectedOption === "image" && imgUrl) || 
                                  (selectedOption === "video" && imgUrl) || 
                                  (selectedOption === "document" && imgUrl)
                                ) &&
                                (!caption || caption.trim() === "") ? 'error' : ''
                              }`}
                              placeholder=" " 
                              required 
                            />
                            <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                              <i className="fa-solid fa-store"></i> Captions
                            </label>
                          </div>

                          {submit &&
                            (
                              (selectedOption === "image" && imgUrl) ||
                              (selectedOption === "video" && imgUrl) ||
                              (selectedOption === "document" && imgUrl)
                            ) &&
                            (!caption || caption.trim() === "") && (
                            <div className="text-start text-danger error-message-required mt-1">
                              Caption is required
                            </div>
                          )}
                        </div>
                    )}

                    </div>
                  </div>
                  {resType === "interactive" && (
                    <div className="card card-details shadow-sm rounded border chat-form-card p-4">
                      <div className="d-flex gap-4 ">
                        <div className="col-md-3 four-input-sec">
                          <label className="radio-container full-click">
                            <input
                              onChange={handleChangeInteractive}
                              value="reply"
                              type="radio"
                              id="replyButton"
                              name="interactive"
                              checked={interactiveType === "reply"}
                            />
                            <span>Reply Buttons</span>
                          </label>
                        </div>
                        <div className="col-md-3 four-input-sec">
                          <label className="radio-container full-click">
                            <input
                              onChange={handleChangeInteractive}
                              value="cta"
                              type="radio"
                              id="cta"
                              name="interactive"
                              checked={interactiveType === "cta"}

                            />
                            <span>CTA URL Button</span>
                          </label>
                        </div>
                        <div className="col-md-3 four-input-sec">
                          <label className="radio-container full-click"  style={{
                              backgroundColor: isDisabled ? "#f0f0f0" : "transparent",
                              pointerEvents: isDisabled ? "none" : "auto",
                              opacity: isDisabled ? 0.5 : 1,
                              cursor: isDisabled ? "not-allowed" : "pointer",
                            }}>
                            <input
                              onChange={handleChangeInteractive}
                              value="list"
                              type="radio"
                              id="list"
                              name="interactive"
                              checked={interactiveType === "list"}
                              disabled={isDisabled}
                            />
                            <span>List Message</span>
                          </label>
                        </div>
                      </div>
                      {submit && interactiveType?.length===0 ? <div className='text-start text-danger error-message-required'>The interactive type field is required</div> : <></> }

                      {interactiveType == "reply" && (
                        <div className="row">
                        <div className="col-md-4 login-input-group ">
                        <div className="vendor-create-container">
                           <input autoComplete="off" type="text" id="vendor-crt-input"  value={replyTextInput1}
                              onChange={(e)=>setreplyTextInput1(e.target.value)}
                            className={`vendor-crt-input loginfilled-frame-username  ${submit && replyTextInput1?.length==0 ? 'error' : ''}`} placeholder=" " required />
                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Button 1 Label</label>
                        </div>
                        {submit && replyTextInput1?.length == 0 ? <div className='text-start text-danger error-message-required'>Button 1 is required</div> : <></>}

                     </div>
                          <div className="col-md-4 login-input-group">
                        <div className="vendor-create-container">
                           <input autoComplete="off" type="text" id="vendor-crt-input"  value={replyTextInput2}
                              onChange={(e)=>setreplyTextInput2(e.target.value)}
                            className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Button 2 Label (optional)</label>
                        </div>
                     </div>
                          <div className="col-md-4 login-input-group">
                        <div className="vendor-create-container">
                           <input autoComplete="off" type="text" id="vendor-crt-input"  value={replyTextInput3}
                              onChange={(e)=>setreplyTextInput3(e.target.value)}
                            className={`vendor-crt-input loginfilled-frame-username`} placeholder=" " required />
                           <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Button 3 Label (optional)</label>
                        </div>
                     </div>
                        </div>
                      )}

                      {interactiveType == "cta" && (
                        <div className="px-2">
                          <div className="d-flex gap-1">
                              <div className="col-md-6 login-input-group">
                        <div className="vendor-create-container">
                           <input autoComplete="off" type="text" id="vendor-crt-input"  value={ctaTextInput}
                                onChange={(e) => setCtaTextInput(e.target.value)}     
                            className={`vendor-crt-input loginfilled-frame-username  ${submit && ctaTextInput?.length==0 ? 'error' : ''}`} placeholder=" " required />
                           <label htmlFor="vendor-crt-input" className="vendor-crt-label">CTA Button Display Text<span className="required-star">*</span></label>
                        </div>
                        {submit && ctaTextInput?.length == 0 ? <div className='text-start text-danger error-message-required'>CTA text is required</div> : <></>}

                     </div>
                            <div className="col-md-6 login-input-group">
                        <div className="vendor-create-container">
                           <input autoComplete="off" type="text" id="vendor-crt-input"   value={ctaURLInput}
                                  onChange={(e) => setCtaURLInput(e.target.value)}     
                            className={`vendor-crt-input loginfilled-frame-username  ${submit && ctaURLInput?.length==0 ? 'error' : ''}`} placeholder=" " required />
                           <label htmlFor="vendor-crt-input" className="vendor-crt-label">CTA Button URL<span className="required-star">*</span></label>
                        </div>
                        {submit && ctaURLInput?.length == 0 ? <div className='text-start text-danger error-message-required'>CTA URL is required</div> : <></>}

                     </div>
                            <div className="col-md-4"></div>
                          </div>
                        </div>
                      )}
                      
                      {interactiveType == "list" && (
                        <div className="text-start">
                          <div className="col-md-12 login-input-group">
                        <div className="vendor-create-container">
                          <input
                            autoComplete="off"
                            type="text"
                            id="vendor-crt-input"
                            className={`vendor-crt-input loginfilled-frame-username ${
                              submit && !buttonLabel ? "error" : ""
                            }`}
                            placeholder=" "
                            value={buttonLabel}
                            onChange={(e) => setButtonLabel(e.target.value)}
                            required
                          />
                          <label
                            htmlFor="vendor-crt-input"
                            className="vendor-crt-label"
                          >
                            Button Label
                          </label>
                        </div>
                        {submit && buttonLabel?.length == 0 ? <div className='text-start text-danger error-message-required'>Button label is required</div> : <></>}

                      </div>

                          {showSection && (
                            <div >
                              {listSections.map((section) => (
                                <div
                                  key={section.id}
                                  style={{
                                    border: "1px solid #ccc",
                                    marginBottom: 16,
                                    padding: 8,
                                  }}
                                  className="row card card-details shadow-sm rounded border chat-form-card p-3 border mt-5">
                                  <div className="modal-header  border-0">
                                    <h1
                                      className="modal-title campaign-temp-head responce-name-title"
                                      id="exampleModalLabel"
                                    >
                                      Section
                                    </h1>
                                  </div>
                                 
                                  <div className="col-md-12 text-end text-xs mt-n4" onClick={() => deleteSection(section.id)}>
                                      <i className="fa fa-times text-danger"></i>
                                  </div>
                                  <div className="col-md-12 login-input-group">
                                  <div className="vendor-create-container">
                                  <input
                                    value={section.title}
                                    onChange={(e) =>
                                      updateSectionTitle(
                                        section.id,
                                        e.target.value
                                      )
                                    }
                                    className={`vendor-crt-input loginfilled-frame-username submit`}  
                                      // ${submit && !section.title ? "error" : ""} `}
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    Section Title
                                  </label>
                                  </div>
                                  {/* {submit && (!section.title || section.title.trim() === "") ? (<div className="text-start text-danger error-message-required">Section Title is required</div>) : null} */}
                                  </div>
                                  {showRow && section.rows.map((row,rowIndex) => (
                                  <div
                                    className="card card-details shadow-sm rounded border chat-form-card p-3 border mt-5"
                                    key={row.uId}
                                  >
                                    <div className="modal-header border-0">
                                      <h1 className="modal-title campaign-temp-head responce-name-title" id="exampleModalLabel">
                                        Row
                                      </h1>
                                    </div>
                                    <div
                                      className="col-md-12 text-end text-xs mt-n4"
                                      onClick={() => deleteRow(section.id, rowIndex)}
                                    >
                                      <i className="fa fa-times text-danger"></i>
                                    </div>

                                    {/* Row for two side-by-side inputs */}
                                    <div className="row">
                                      {/* <div className="col-md-6 px-3 login-input-group">
                                        <div className="vendor-create-container">
                                          <input
                                            value={row.id}
                                            onChange={(e) =>
                                              updateRow(section.id, row.uId,row.id, "id", e.target.value)
                                            }
                                            placeholder=""
                                            className={`vendor-crt-input loginfilled-frame-username`}
                                              // ${ submit && !row.id ? "error" : ""}`}
                                          />
                                          <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                          Row ID
                                          </label>
                                        </div>
                                        {submit && (!row.id || row.id.trim() === "") ? (
                                          <div className="text-start text-danger error-message-required">
                                            Row Id is required
                                          </div>
                                        ) : null}

                                      </div> */}

                                      <div className="col-md-6 px-2 login-input-group">
                                        <div className="vendor-create-container">
                                          <input
                                            value={row.title}
                                            onChange={(e) =>
                                              updateRow(section.id, row.uId,row.id, "title", e.target.value)
                                            }
                                            placeholder=""
                                            max-lenght={24}
                                            className={`vendor-crt-input loginfilled-frame-username`}/>
                                          <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                          Row Title
                                          </label>
                                        </div>
                                        {/* {submit && (!row.title || row.title.trim() === "") ? (
                                          <div className="text-start text-danger error-message-required">
                                            Row Title is required
                                          </div>
                                        ) : null} */}

                                      </div>
                                      <div className="col-md-6 px-2 login-input-group">
                                  <div className="vendor-create-container">
                                    <input
                                      value={row.description}
                                      onChange={(e) =>
                                        updateRow(section.id, row.uId,row.id, "description", e.target.value)
                                      }
                                      className={`vendor-crt-input loginfilled-frame-username`}
                                      placeholder=""
                                    />
                                    <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                    Row Description (optional)
                                    </label>
                                  </div>
                                  {/* {submit && (!row.description || row.description.trim() === "") ? (
                                    <div className="text-start text-danger error-message-required">
                                      Row Description is required
                                    </div>
                                  ) : null} */}

                                </div>
                                    </div>

                                {/* Full-width input */}
                                
                              </div>
                              
                            ))}
                              <div className="col-md-2">
                                  <button className="vendor-crt-btn"
                                    onClick={() => {
                                      addRow(section.id);
                                      setShowRow(true);
                                    }}
                                  >
                                    Add Row
                                  </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                              <button className="vendor-crt-btn" onClick={()=>{setShowSection(true);addSection()}}>Add Section</button>

                        </div>
                      )}
                      <div className="col-md-12 login-input-group">
                        <div className="vendor-create-container">
                          <input
                            autoComplete="off"
                            type="text"
                            id="vendor-crt-input"
                            className={`vendor-crt-input loginfilled-frame-username`}
                            placeholder=" "
                            required
                            value={footerText}
                            onChange={(e)=>setFooterText(e.target.value)}
                          />
                          <label
                            htmlFor="vendor-crt-input"
                            className="vendor-crt-label"
                          >
                            Footer Text
                            (optional)
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="modal-footer border-0">
                  <button type="button" id="botModalClose" className="vendor-crt-btn" style={{background:"#71717a"}} onClick={resetForm}data-bs-dismiss="modal">Close</button>
                    <button
                      type="submit"
                      className="vendor-crt-btn"
                      // data-bs-dismiss="modal"
                      onClick={(e)=>{e.preventDefault();handleSubmitBot()}}
                      >
                      {modalMode === "create" ? "Submit" : "Update"}
                    </button>
                    {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                  </div>
                  {/* </form> */}
                </div>
              </div>
            </div>
            <button
              className="vendor-crt-btn"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Help
            </button>
          </div>

          {/* <!-- Modal --> */}

          <div
            className="modal fade"
            id="exampleModal"
            tab-Index="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header border-0">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    What are the Bots Replies and How to use it?
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body text-start">
                  <h6>Whats are Bots</h6>
                  <p className="text-sm">
                    Bots are instructions given to the system so when you get
                    message you can set reply message so it will get triggered
                    automatically.
                  </p>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  {/* <button type="button" class="btn btn-primary">Save changes</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="vendor-maincontent container-fluid py-4">
          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-body px-0 pt-0 pb-2">
                  <div className="table-responsive p-0">
                    {loading ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "100px",
                        }}
                      >
                        <FadeLoader color="#36d7b7" />
                      </div>
                    ) : botList.length === 0 ? (
                      <p
                        className="table-list-nodata or-text"
                        style={{ textAlign: "center", marginTop: "40px" }}
                      >
                        <span>No data found</span>
                      </p>
                    ) : (
                      <>
                        <table className="table align-items-center justify-content-center mb-0">
                          <thead>
                            <tr className="vendor-table-mainhead">
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                                Name
                              </th>
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                Bot Type
                              </th>
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                Trigger Type
                              </th>
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                Trigger Subject
                              </th>
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                Status
                              </th>
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder opacity-7 ps-2">
                                Created At
                              </th>
                              <th className="chatbot-table-head vendor-table-head text-xxs font-weight-bolder text-center opacity-7 ps-2">
                                Action
                              </th>
                              {/*<th></th>*/}
                            </tr>
                          </thead>
                          <tbody className="text-start">
                            {botList.map((listData: any) => (
                              <tr>
                                <td>
                                  <div className="d-flex px-2">
                                    <div className="align-middle text-start text-sm my-auto">
                                      <span>{listData?.name}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle text-start text-sm">
                                  <span>{listData?.message_type}</span>
                                </td>
                                <td className="align-middle text-start text-sm">
                                  <span>{listData?.trigger?.name}</span>
                                </td>
                                <td className="align-middle text-start text-sm">
                                  <span>{Array.isArray(listData?.intent) ? listData.intent.join(", ") : ""}</span>
                                </td>
                                <td>
                                  <div className="form-check form-switch ms-1 is-filled">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="flexSwitchCheckDefault"
                                      onChange={() => {
                                        if (listData.active_status === "1") {
                                          setbotId(listData.id);
                                          setActive(false);
                                          setbotName(listData?.name);
                                        } else if (
                                          listData.active_status === "0"
                                        ) {
                                          setbotId(listData.id);
                                          setActive(true);
                                          setbotName(listData?.name);
                                        }
                                      }}
                                      data-bs-toggle="modal"
                                      data-bs-target="#vendorActive"
                                      checked={listData.active_status === "1"}
                                    />
                                  </div>
                                </td>
                                <td className="text-sm">
                                  <span>
                                    {new Date(listData.created_date)
                                      .toLocaleString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "2-digit",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true,
                                      })
                                      .replace(",", "")
                                      .replace(" ", " ")}
                                  </span>
                                </td>

                                <td className="align-middle vendor-login-td">
                                  <div className="actionDuplicate-tooltip-container">
                                    <button
                                      className="btn-3 vendorbtn-view"
                                      type="button"
                                      data-bs-toggle="modal"
                                      data-bs-target="#vendordelete1"
                                      onClick={() => {setDuplicateBotId(listData.id);setbotName(listData?.name);}}
                                    >
                                      <span className="btn-inner--icon text-secondary">
                                        <i className="fa-solid fa-clone"></i>
                                      </span>
                                    </button>
                                    &nbsp;
                                    <div className="actionDuplicate-tooltip-text">
                                      Duplicate
                                    </div>
                                  </div>
                                  <div className="actionEdit-tooltip-container">
                                    <button
                                      className="btn-3 vendorbtn-edit"
                                      type="button"
                                      data-bs-toggle="modal"
                                      data-bs-target="#createModel"
                                      onClick={() => {handlebotReplyGet(listData?.id);openModal("edit")}}
                                    >
                                      <span className="btn-inner--icon">
                                        <i className="fa-regular fa-pen-to-square"></i>
                                      </span>
                                    </button>
                                    &nbsp;
                                    <div className="actionEdit-tooltip-text">
                                      Edit
                                    </div>
                                  </div>
                                  <div className="actionDelete-tooltip-container">
                                    <button
                                      className="btn-3 vendorbtn-danger"
                                      type="button"
                                      data-bs-toggle="modal"
                                      onClick={() => {
                                        setbotId(listData.id);
                                        setbotName(listData?.name);
                                      }}
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
                        <div className="store-pagination">
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
      <div
        className="modal fade"
        id="vendorcreate"
        tab-Index="-1"
        aria-labelledby="vendorcreateLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content vendorcreate-modal-content">
            <div className="modal-header vendorcreate-modal-header">
              <h5
                className="modal-title vendorcreate-modal-title"
                id="vendorcreateLabel"
              >
                {modalMode === "create" ? "Create Bot" : "Edit Bot"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="row modal-container-size modal-body vendorcreate-modal-body">
              <div className="row">
                <div className="col-md-12 login-input-group">
                  <div className="vendor-create-container">
                    <input
                      type="text"
                      id="vendor-crt-input"
                      className="vendor-crt-input"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="vendor-crt-input"
                      className="vendor-crt-label"
                    >
                      <i className="fa-solid fa-user"></i> Name
                    </label>
                  </div>
                </div>
                <div className="col-md-6 login-input-group">
                  <div className="dropdown vendor-create-container">
                    <input
                      type="text"
                      id="vendor-crt-input"
                      className="vendor-crt-input"
                      placeholder=" "
                      required
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    />
                    <label
                      htmlFor="vendor-crt-input"
                      className="vendor-crt-label"
                    >
                      <i className="fa-solid fa-shapes"></i> Trigger Type
                    </label>
                    <i
                      className={`dropdown-icon font-size-dash-arrow fa-solid fa-chevron-${
                        isDropdownOpen2 ? "up" : "down"
                      }`}
                    ></i>
                    <ul className="dropdown-menu dropdown-increase-size">
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Welcome
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Is
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Start With
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Ends With
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Contains Whole word
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Contains
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Stop Promotional
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item-data" href="#">
                          Start Promotional
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6 login-input-group">
                  <div className="vendor-create-container">
                    <input
                      type="text"
                      id="vendor-crt-input"
                      className="vendor-crt-input"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="vendor-crt-input"
                      className="vendor-crt-label"
                    >
                      <i className="fa-solid fa-shapes"></i> Reply Trigger
                      Subject
                    </label>
                  </div>
                </div>
                <div className="col-md-12 login-input-group">
                  {simplebot && (
                    <div>
                      <div className="vendor-create-container">
                        <textarea
                          id="vendor-crt-input"
                          className="vendor-crt-input create-bot-textarea"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="vendor-crt-input"
                          className="vendor-crt-label"
                        >
                          <i className="fa-solid fa-message"></i> Reply Message
                        </label>
                      </div>
                      <div>
                        <p className="text-start bot-create-textarea">
                          <i className="fa-solid fa-triangle-exclamation danger-icon-create-bot"></i>
                          You are free to use the following dynamic variables
                          for reply text, which will get replaced with the
                          contact's concerned field value.
                        </p>
                        <p className="text-start bot-create-textarea-2">
                          {
                            "{first_name} {last_name} {full_name} {phone_number} {email} {country} {language_code} {DOB} {Address} {loyalty_rs}"
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {mediabot && (
                    <div className="vendor-create-container dropdown">
                      <input
                        type="text"
                        id="vendor-crt-input"
                        className="vendor-crt-input"
                        placeholder=" "
                        required
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <label
                        htmlFor="vendor-crt-input"
                        className="vendor-crt-label"
                      >
                        <i className="fa-solid fa-message"></i> Header Type
                      </label>
                      <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                      <ul className="dropdown-menu dropdown-increase-size">
                        <li>
                          <a className="dropdown-item-data" href="#">
                            Image
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item-data" href="#">
                            Video
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item-data" href="#">
                            Document
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item-data" href="#">
                            Audio
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}

                  {advancedbot && (
                    <div>
                      <div className="d-flex gap-4 mt-2">
                        <div
                          className="form-check text-start"
                          onClick={Replybuttonradio}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />{" "}
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault1"
                          >
                            Reply Buttons
                          </label>
                        </div>
                        <div
                          className="form-check text-start"
                          onClick={Replybuttonradio1}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                          />{" "}
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault2"
                          >
                            CTA URL Button
                          </label>
                        </div>
                        <div
                          className="form-check text-start"
                          onClick={Replybuttonradio2}
                        >
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault3"
                          />{" "}
                          <label
                            className="form-check-label"
                            htmlFor="flexRadioDefault3"
                          >
                            List Message
                          </label>
                        </div>
                      </div>
                      <div>
                        {replybutton1 && (
                          <div className="text-start">
                            <div className="row">
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Button
                                    1 Label
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Button
                                    2 Label (optional)
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Button
                                    3 Label (optional)
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Footer
                                    Text (optional)
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {replybutton2 && (
                          <div>
                            <div className="row">
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> CTA
                                    Button Display Text
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> CTA
                                    Button URL
                                  </label>
                                </div>
                              </div>
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Footer
                                    Text (optional)
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {replybutton3 && (
                          <div>
                            <div className="row">
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Button
                                    Label
                                  </label>
                                </div>
                                <div className="text-start">
                                  <button className="vendor-crt-btn">
                                    Add section
                                  </button>
                                </div>
                              </div>
                              <div className="col-md-12 login-input-group">
                                <div className="vendor-create-container">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-solid fa-user"></i> Footer
                                    Text (optional)
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    {mediabot ? (
                      <p className="text-start bot-create-textarea">
                        You can have comma-separated multiple triggers.
                      </p>
                    ) : (
                      <div>
                        {/* <p className="text-start bot-create-textarea">
                            <i className="fa-solid fa-triangle-exclamation danger-icon-create-bot"></i>
                            You are free to use the following dynamic variables
                            for reply text, which will get replaced with the
                            contact's concerned field value.
                          </p>
                          <p className="text-start bot-create-textarea-2">
                            {
                              "{first_name} {last_name} {full_name} {phone_number} {email} {country} {language_code} {DOB} {Address} {loyalty_rs}"
                            }
                          </p> */}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-check form-switch ms-1 is-filled text-start active">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                    />{" "}
                    <span> Status</span>
                  </div>
                  <div className="form-check form-switch ms-1 is-filled text-start mt-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                    />{" "}
                    <span>Validate Bot Reply by Sending Test Message</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer vendorcreate-modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
              >
                {modalMode === "create" ? "Create" : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*Bot Active Modal*/}
      <div
        className="modal fade"
        id="vendorActive"
        tab-Index="-1"
        aria-labelledby="vendorActiveLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content all-modal-content vendor-delete-content">
            <div className=" vendor-delete-header"></div>
            <div className="modal-body vendor-delete-body">
              <div className="row">
                <div className="vendor-delete-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h4 className="modal-confirm-head">Are You Sure !</h4>
                {active ? (
                  <h6 className="modal-confirm-subhead">
                    You want to active this {botName} chat ?
                  </h6>
                ) : (
                  <h6 className="modal-confirm-subhead">
                    You want to deactive this {botName} chat ?
                  </h6>
                )}
              </div>
            </div>
            <div className="modal-footer text-center vendor-delete-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="closeactiveModal"
              >
                No
              </button>
              &nbsp;
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  active
                    ? handlebotStatus("active")
                    : handlebotStatus("deactive");
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*Bot Delete Modal*/}
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
            <div className="modal-body vendor-delete-body">
              <div className="row">
                <div className="vendor-delete-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h4 className="modal-confirm-head">Are You Sure !</h4>
                <h6 className="modal-confirm-subhead">
                  You want to delete this {botName} bot ?
                </h6>
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlebotDelete}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/*Vendor Delete Modal*/}
      <div
        className="modal fade"
        id="vendordelete"
        tab-Index="-1"
        aria-labelledby="vendordeleteLabel"
        aria-hidden="true"
      >
        <div className="text-center modal-dialog modal-dialog-centered">
          <div className="modal-content vendor-delete-content">
            <div className=" vendor-delete-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body vendor-delete-body">
              <div className="row">
                <div className="vendor-delete-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h4 className="store-are-sure">Are You Sure !</h4>
                <h6 className="store-delete-size">
                  You want to delete this vendor ?
                </h6>
                <div></div>
              </div>
            </div>
            <div className="modal-footer text-center vendor-delete-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                No
              </button>
              &nbsp;
              <button type="button" className="btn btn-primary">
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="vendordelete1"
        tab-Index="-1"
        aria-labelledby="vendordeleteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content vendor-delete-content">
            <div className=" vendor-delete-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body vendor-delete-body">
              <div className="row">
                <div className="vendor-delete-icon">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
                <h4 className="modal-confirm-head">Are You Sure !</h4>
                <h6 className="modal-confirm-subhead">
                  You want to duplicate this {botName} bot reply?
                </h6>
                <div></div>
              </div>
            </div>
            <div className="modal-footer text-center vendor-delete-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                id="closeDuplicate"
              >
                No
              </button>
              &nbsp;
              <button type="button" className="btn btn-primary" onClick={()=>handleBotDuplicate()}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Chatbot;
