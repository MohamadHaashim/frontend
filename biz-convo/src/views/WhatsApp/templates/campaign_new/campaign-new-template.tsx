import React, { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Userimg from "../../../assets/img/team-2.jpg";
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import "./campaign-new-template.css";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import TopNav from "../../../../shared/TopNav";
import Footer from "../../../../shared/Footer";
import VendorAPI from "../../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import { isValid, parseISO, format } from 'date-fns';
import API from "../../../../api/api";
import API_EP_BOOK from "../../../../api/endpoints";

interface TempDrop {
   id: string;
   name: string;
}
interface GroupDrop {
   id: string;
   group_name: string;
}
interface Payload {
   [key: string]: any;
}
interface VariableDrop {
   id: string;
   variable_name: string;
}
function Createcampaign() {
   const [variableDrop, setVariableDrop] = useState<VariableDrop[]>([]);
   const [variable_name, setVariable_name] = useState("");
   const [variableId, setVariableId] = useState("");
   const [header_name, setheader_name] = useState("");
   const [headerId, setheaderId] = useState("");
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const [tempDrop, setTempDrop] = useState<TempDrop[]>([]);
   const [timezoneDrop, setTimezoneDrop] = useState([]);
   const [template, setTemplate] = useState(true);
   const [headerActive, setheaderActive] = useState(false);
   const [names, setNames] = useState('')
   const [whatsappId, setWhatsappId] = useState('')
   const [category, setCategory] = useState('')
   const [languageCode, setLaguageCode] = useState('')
   const [getId, setGetId] = useState('')
   const [tempIdId, settempIdId] = useState('')
   const [tempName, settempName] = useState('')
   const [selectedValue, setSelectedValue] = useState('None');
   const [bodyselectedValue, setBodySelectedValue] = useState('');
   const [fileName, setFileName] = useState<string | null>(null);
   const [textInput, setTextInput] = useState('');
   const [BodytextInput, setBodyTextInput] = useState('');
   const [footertextInput, setFooterTextInput] = useState('');
   const [bodyTextValues, setBodyTextValues] = useState('')
   const [bodyTextValues1, setBodyTextValues1] = useState<string[]>([]);
   const [bodyArrayValues, setBodyArrayValues] = useState<string[]>([]);
   const [carousels, setCarousels] = useState<any[]>([]);
   const [carouselMediaIds, setCarouselMediaIds] = useState<any[]>([]);
   console.log(carouselMediaIds,"setFileNames")
   console.log(carousels,"setCarousel")
   const [bodyStringValue, setBodyStringValue] = useState<string>("");
   const [slides,setslides] = useState<any>([]);
   const [carouselTyp, setCarouselTyp] = useState('')
   const [currentIndex, setCurrentIndex] = useState(0);
   const [textValues, setTextValues] = useState('')
   const [phoneNumber, setPhoneNumber] = useState('');
   const [imgValue, setImgValue] = useState('')
   const [vdoValue, setVdoValue] = useState('')
   const [docValue, setDocValue] = useState('')
   const [compbodyActive, setCompbodyActive] = useState(false);
   const [imgActive, setimgActive] = useState(false);
   const [imageInput, setimageInput] = useState(false);
   const [compheaderActive, setCompheaderActive] = useState(false);
   const [compActive, setCompActive] = useState(false);
   const [headerTextInput, setHeaderTextInput] = useState<string>('');
   const [quickbtn, setquickbtn] = useState('None')
   const [phoenobtn, setphoenobtn] = useState('None')
   const [copybtn, setcopybtn] = useState('None')
   const [urlbtns, setUrlbtns] = useState<any>([]);
   const [dynamicurlbtn, setdynamicurlbtn] = useState('None')
   const [buttonQuicktxt, setButtonQuicktxt] = useState('');
   const [buttonPhonetxt, setButtonPhonetxt] = useState('');
   const [buttonPhoneNotxt, setButtonPhoneNotxt] = useState('');
   const [buttonCopycodetxt, setButtonCopycodetxt] = useState('');
   const [buttonurltxts, setButtonurltxts] = useState<string[]>([]);
   const [buttonwebUrltxt, setButtonwebUrltxt] = useState('');
   const [buttondynamicwebUrltxt, setButtondynamicwebUrltxt] = useState('');
   const [buttonexampleUrltxt, setButtonexampleUrltxt] = useState('');
   const [buttondynamicUrltxt, setButtondynamicUrltxt] = useState('');
   const [loading, setLoading] = useState(false);
   const [groupDropDown, setGroupDropDown] = useState<GroupDrop[]>([])
   const [mediaId, setmediaId] = useState("");
   const [groupName, setGroupName] = useState("");
   const [groupId, setGroupId] = useState("");
   const [submit, setSubmit] = useState(false);
   const [imgLoading, setimgLoading] = useState(false);
   const [campaignName, setcampaignName] = useState('');
   const [restrictLangCode, setrestrictLangCode] = useState(false);
   const [timeZoneId, settimeZoneId] = useState('70');
   const [timeZoneName, settimeZoneName] = useState('Asia/Kolkata');
   const [scheduleStatus, setscheduleStatus] = useState(false);
   const [scheduledAt, setscheduledAt] = useState('');
   const [sendNum, setsendNum] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
   const videoLoaded = useRef(false);
 
   const nextSlide = () => {
  requestAnimationFrame(() => {
   const next = (currentCarousel + 1) % slides.length; // Wrap to 0 if at last
    setCurrentCarousel(next);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  });
};
 
 const prevSlide = () => {
  requestAnimationFrame(() => {
   const prev = (currentCarousel - 1 + slides.length) % slides.length; // Wrap to last if at first
    setCurrentCarousel(prev);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  });
};
 
//   useEffect(() => {
//   if (!wrapperRef.current) return;
//   if (!videoLoaded.current) return; // wait until video is ready
 
//   let frameId: number;
//   const observer = new ResizeObserver((entries) => {
//     if (frameId) cancelAnimationFrame(frameId);
//     frameId = requestAnimationFrame(() => {
//       entries.forEach((entry) => {
//         console.log("Observed size:", entry.contentRect);
//       });
//     });
//   });
 
//   observer.observe(wrapperRef.current);
 
//   return () => {
//     if (frameId) cancelAnimationFrame(frameId);
//     observer.disconnect();
//   };
// }, [videoLoaded.current]);
   const navigate = useNavigate();

   const [setValue, setSetValue] = useState("")
   useEffect(() => {
      const queryParams = window.location.pathname;
      const myArray = queryParams.split("/");
      setSetValue(myArray[5]);
      setGetId(myArray[6]);
   })
   useEffect(() => {
      if (getId && getId !== "undefined" && getId !== "") {
         whatsappGetApi(getId);
         // handlesendMsg();
      }
   }, [getId]);
   const [currentCarousel, setCurrentCarousel] = useState(0);
console.log(currentCarousel,"carousel")
  const handleNext = () => {
    if (currentCarousel < carousels.length - 1) {
      setCurrentCarousel(currentCarousel + 1);
      setCurrentIndex(currentCarousel + 1);
    }
  };

  const handlePrevious = () => {
    if (currentCarousel > 0) {
      setCurrentCarousel(currentCarousel - 1);
      setCurrentIndex(currentCarousel - 1);
    }
  };

   const [BodytextNumbers, setBodytextNumbers] = useState<string[]>([]);
   useEffect(() => {
      if (BodytextInput) {
         const removeHtmlTags = (html: string) => {
            return html.replace(/<\/?[^>]+(>|$)/g, '');
         };
         const cleanedText = removeHtmlTags(BodytextInput);
         const regex = /{{(\d+)}}/g;
         const matches = cleanedText.match(regex)
         const numbers = matches ? matches.map(match => match.replace(/[^\d]/g, '')) : [];
         if (numbers.length >= 0) {
            setBodytextNumbers(numbers)

         } else {
            setBodytextNumbers([])
         }
      }
   }, [BodytextInput])
   const [carouselVariables, setCarouselVariables] = useState<
    {
      cardIndex: number;
      variables: {
      type: "body" | "button";
        varName: string;
        varValue: { varTypeName: string; varTypeId: string };
      }[];
    }[]
   >([]);
console.log(JSON.stringify(carouselVariables, null, 2), "→ carouselVariables");
 
  const handleVariableSelect = (
  cardIndex: number,
  varName: string,
  option: { id: string; variable_name: string }
) => {
  setCarouselVariables((prev:any) => {
    const card = prev.find((c:any) => c.cardIndex === cardIndex);
    if (card) {
      const updatedVariables = card.variables.map((v:any) =>
        v.varName === varName
          ? { type: "body", varName, varValue: { varTypeName: option.variable_name, varTypeId: option.id } }
          : v
      );
      if (!updatedVariables.some((v:any) => v.varName === varName)) {
        updatedVariables.push({ type: "body", varName, varValue: { varTypeName: option.variable_name, varTypeId: option.id } });
      }
      return prev.map((c:any) =>
        c.cardIndex === cardIndex ? { ...c, variables: updatedVariables } : c
      );
    } else {
      return [
        ...prev,
        {
          cardIndex,
          variables: [{ type: "body", varName, varValue: { varTypeName: option.variable_name, varTypeId: option.id } }],
        },
      ];
    }
  });
  setInputValues((prev) => ({
    ...prev,
    [`${cardIndex}-${varName}`]: option.variable_name,
  }));
};


const handleInputChange = (
  cardIndex: number,
  inputVarName: string,
  newValue: string
) => {
  // Update local input values
  setInputValues((prev) => ({
    ...prev,
    [`${cardIndex}-${inputVarName}`]: newValue,
  }));

  // Match button vars like "button-0-text"
  const buttonMatch = inputVarName.match(/^button-(\d+)-(text|example)$/);
  const isButton = !!buttonMatch;

  const extractedVarName = isButton ? buttonMatch![1] : inputVarName;
  const type: "body" | "button" = isButton ? "button" : "body";

  console.log("varName:", inputVarName);
  console.log("extractedVarName:", extractedVarName);
  console.log("type:", type);

  const newVar = {
    type,
    varName: extractedVarName,
    varValue: {
      varTypeName: newValue,
      varTypeId: "0",
    },
  };

  // Update carouselVariables with correct type
setCarouselVariables((prev) => {
  const card = prev.find((c) => c.cardIndex === cardIndex);

  if (card) {
    const existingIndex = card.variables.findIndex(
      (v) => v.varName === extractedVarName && v.type === type
    );

    let updatedVariables: {
      type: "body" | "button";
      varName: string;
      varValue: { varTypeName: string; varTypeId: string };
    }[];

    if (existingIndex !== -1) {
      // Update the existing variable
      updatedVariables = [...card.variables];
      updatedVariables[existingIndex] = newVar;
    } else {
      // Append new variable
      updatedVariables = [...card.variables, newVar];
    }

    return prev.map((c) =>
      c.cardIndex === cardIndex
        ? { ...c, variables: updatedVariables }
        : c
    );
  } else {
    // No card exists, create one
    return [
      ...prev,
      {
        cardIndex,
        variables: [newVar],
      },
    ];
  }
});

};







   const [BodytextNumbers1, setBodytextNumbers1] = useState<string[]>([]);
   useEffect(() => {
  if (!carousels || carousels.length === 0) return;

  const card = carousels[currentCarousel];
  const bodyComponent = card.components.find((c: any) => c.type === "BODY");
  const bodyText = bodyComponent?.text || "";

  // Remove HTML tags if any
  const cleanedText = bodyText.replace(/<\/?[^>]+(>|$)/g, "");

  // Find all {{number}} placeholders
  const regex = /{{(\d+)}}/g;
  const matches = [...cleanedText.matchAll(regex)];

  const numbers = matches.map((m) => m[1]);
  setBodytextNumbers1(numbers);
}, [carousels, currentCarousel]);


   const handlePhoneClick = (phone: any) => {
      setPhoneNumber(phone);
   };
   
   const handlecreateCampaign = () => {
      setSubmit(true);
        for (let index = 0; index < carousels.length; index++) {
    const card = carousels[index];

    // Body variables
    const hasEmptyBodyText = BodytextNumbers1.some(varName => {
      const key = `${index}-${varName}`;
      return !inputValues[key];
    });

    // Button variables (text only)
   //  const buttonComponent = card?.components?.find((c: any) => c.type === "BUTTONS");
   //  const buttons = buttonComponent?.buttons || [];
   //  const hasEmptyButtonText = buttons.some((_: any, btnIdx: number) => {
   //    const key = `${index}-button-${btnIdx}-text`;
   //    return !inputValues[key];
   //  });

   //  if (!campaignName || !groupName || !groupId || hasEmptyBodyText || hasEmptyButtonText) {
    if (!campaignName || !groupName || !groupId || hasEmptyBodyText) {
      // Jump to that carousel with missing values
      setCurrentCarousel(index);
      setCurrentIndex(index);
      return; // Stop execution and prevent API call
    }
  }
      // const hasEmptyBodyText = BodytextNumbers.some(item => !inputValues[item]);
      // if (!campaignName || !groupName || !groupId || hasEmptyBodyText) {
      //    return;
      // }
      setLoading(true)
      const apiData = {
         templateId: getId,
         group: {
            groupId: groupId,
            groupName: groupName
         },
         title: campaignName,
         mediaId:imgid,
         ...(carouselTyp==="CAROUSEL" && {
            carouselMedia:carouselMediaIds
         }),
         restrictLangCode: restrictLangCode,
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
         SendNum: sendNum,
         variableIds: [
            imgActive === false ? {
               type: "header",
               variables: [
                  {
                     varName: "1",
                     varValue: {
                        varTypeName: header_name,
                        varTypeId: headerId
                     }
                  }
               ]
            } : null,
            bodyActive === false ?
               {
                  type: "body",
                  variables: bodyVariabledata.map((item, index) => ({
                     varName: `${index + 1}`,
                     varValue: {
                       varTypeName: item.varTypeName,
                       varTypeId: item.varTypeId,
                     },
                   })),
                 } : null,
            carouselTyp === "CAROUSEL" ?{
               type:"carousel",
               cards: carouselVariables.map((card: any) => ({
               variables: card.variables.map((variable: any) => ({
              type: variable.type,
              varName: variable.varName,
              varValue: variable.varValue
            }))
          }))
            }:null,
         ].filter(item => item !== null)
      }
      VendorAPI.campaignCreateAPI(apiData)
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               navigate("/vendor/campaign");
               setLoading(false)
               setSubmit(false);
            } else {
               toast.error(responseData.apiStatus.message);
               setLoading(false)
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
         });
   };
   const whatsappGetApi = async (id: any) => {
      setLoading(true);
      if (getId === id) {
         setTemplate(false);
      }
      else {
         setTemplate(true);
      }
      setWhatsappId(id);

      try {
         const responseData = await VendorAPI.whatsappGet(id);
         if (responseData.apiStatus.code === '200') {
            const data = responseData?.responseData;
           setNames(data?.name);
            setLaguageCode(data?.language);
            setCategory(data?.category);
            const formatPhoneNumber = (raw?: string | null): string => {
               if (!raw || typeof raw !== 'string') return '';
               return raw.startsWith('+')
                  ? raw
                  : raw.length === 11 && raw.startsWith('1')
                     ? `+${raw[0]} ${raw.slice(1, 4)} ${raw.slice(4, 7)} ${raw.slice(7)}`
                     : raw;
            };
            const formatedPhoneNumber = formatPhoneNumber(data?.display_phone_no);
            setPhoneNumber(formatedPhoneNumber);
            
            setLoading(false)
            const componentFormat = data?.components?.[0]?.format?.toLowerCase();
            if (componentFormat) {
               setSelectedValue(componentFormat);
            }
            console.log(selectedValue,"value")
            console.log(componentFormat,"value1")
            const bodyTextComponent = data?.components?.find((comp: any) => comp.example?.body_text);
            const textComponent = data?.components?.find((comp: any) => comp.text);
            if (bodyTextComponent) {
               const bodyText = bodyTextComponent.example.body_text;
               if (bodyText?.[0].length > 1) {
                  const formattedArray = bodyText.shift().map((item: any) => ({
                     type: "text",
                     text: item
                  }));
                  setBodyArrayValues(formattedArray)
               } else {
                  const formattedArray = bodyText.flatMap((innerArray: string[]) =>
                     innerArray.map((item: string) => ({
                        type: "text",
                        text: item
                     }))
                  );
                  setBodyArrayValues(formattedArray)
               }
               if (Array.isArray(bodyText)) {
                  setCompbodyActive(true)
                  setBodyTextValues1(bodyText.flat(Infinity));
               }
            } else if (textComponent) {
               const textData = textComponent.text;
               if (Array.isArray(textData)) {
                  setBodyTextValues(textData[0]);
               } else {
                  setBodyTextValues(textData);
               }
            }
            setimgActive(true)
            data?.components?.forEach((component: any) => {
               switch (component.type) {
                  case "HEADER":
                     if (component?.format === "TEXT" || component?.format === "text") {
                        setheaderActive(true);
                        setTextInput(component.text);
                        setimgActive(true)
                        if (component?.example?.header_text?.[0]) {
                           setHeaderTextInput(component?.example?.header_text?.[0])
                           setimgActive(false)
                        }
                     }
                     if (component?.format === "IMAGE") {
                        setCompActive(component?.format === "IMAGE")
                        setimgActive(true)
                        setimageInput(true)
                        setImgValue(component?.example?.header_handle[0])
                        // setImageUrl(component?.example?.header_handle[0])
                     }
                     else if (component?.format === "VIDEO") {
                        setCompActive(component?.format === "VIDEO")
                        setimgActive(true)
                        setimageInput(true)
                        setVdoValue(component?.example?.header_handle[0])
                     }
                     else if (component?.format === "DOCUMENT") {
                        setCompActive(component?.format === "DOCUMENT")
                        setimgActive(true)
                        setimageInput(true)
                        setDocValue(component?.example?.header_handle[0])
                     }
                     if (component.type === "HEADER") {
                        switch (component.format) {
                           case "IMAGE":
                              setImgValue(component?.example.header_handle[0])
                              setimgActive(true)
                              setimageInput(true)
                              break;
                           case "VIDEO":
                              setVdoValue(component?.example.header_handle[0])
                              setimgActive(true)
                              setimageInput(true)
                              break;
                           case "DOCUMENT":
                              setDocValue(component?.example.header_handle[0])
                              setimgActive(true)
                              setimageInput(true)
                              break;
                           default:
                              break;
                        }
                     }
                     break;
                  case "BODY":
                     setBodyTextInput(component.text);
                     break;
                  case "FOOTER":
                     setFooterTextInput(component.text);
                     break;
                  case "CAROUSEL":
                     setCarouselTyp(component.type);
                     setCarousels(component?.cards);
                     const carouselMedia = responseData?.responseData?.carousel_media || responseData?.responseData?.media_id;
                     const filledMedia = component?.cards?.map((_: any, index: number) => {
                     const match = carouselMedia.find((item: any) => +item.card_index === index + 1);

                     if (!match) return null;

                     return match.media_url && match.media_url.trim() !== "" 
                        ? match.media_url 
                        : match.media_id;
                     });

                     setCarouselMediaIds(filledMedia);
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
                  break;
                  case "BUTTONS":
                     const newUrlbtns: string[] = [];
  const newButtonurltxts: string[] = [];
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
                                 newUrlbtns.push("URL");
          newButtonurltxts.push(buttonsValue?.text);
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
                     setUrlbtns(newUrlbtns);
  setButtonurltxts(newButtonurltxts);
                     break;

                  default:

                     break;
               }
               
            });

         } else {
            setLoading(false)
         }
      } catch (error) {
         setLoading(false)
         console.error("Error during API call:", error);
      }
   };
   const whatsappTemplateDropdwon = () => {
      VendorAPI.whatsappTemplateDropdwon()
         .then((responceData: any) => {
            if (responceData.apiStatus.code === '200') {
               setTempDrop(responceData?.responseData?.templateList?.data)
            }
         })
         .catch((error: any) => {
            console.error("Error during login:", error);
         });
   };
   //Store Dropdown Filter
   const filteredTemplateDrop = tempDrop.filter((dropdownValue) =>
      (dropdownValue?.name || '').toLowerCase().includes((tempName || '').toLowerCase())
    );
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
   const handleTempChange = () => {
      if (template === false) {
         navigate('/vendor/campaign/create/new',{ state: { contactDetailsValue } });
         setTemplate(true)
         setquickbtn("");
         setButtonQuicktxt("");
         setphoenobtn("");
         setButtonPhonetxt("");
         setButtonPhoneNotxt("");
         setcopybtn("");
         setButtonCopycodetxt("");
         setUrlbtns([]);
         setButtonurltxts([]);
         setButtonwebUrltxt("");
         setdynamicurlbtn("");
         setButtondynamicUrltxt("");
         setButtondynamicwebUrltxt("");
         setButtonexampleUrltxt("");
         setHeaderTextInput("");
         setTextInput("");
         setLaguageCode("");
         setCategory("");
         setFooterTextInput("");
         setVariable_name("");
         setSubmit(false);
         Settogglebox(true);
         SetCheckBox(false)
         setscheduledAt('')
         setGroupName('');
         setBodyTextInput('');
         setInputValues({});
         setImgValue('');
         setCompActive(false);
         setimgActive(false);
         setVdoValue("");
         setDocValue('');
         setCarousels([]);
         setCarouselVariables([]);
         setBodytextNumbers([]);
         setBodytextNumbers1([]);
         setFileNames([]);
         setImageUrls([]);
         setImageUrl("");
         setCurrentCarousel(0);
         setCurrentIndex(0);
         setCarouselTyp("");
      }
   }

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
   const ChecklangCode = () => {
      setrestrictLangCode(true)
      if (restrictLangCode === true) {
         setrestrictLangCode(false)
      }
   }
   const location = useLocation();
   const contactDetailsValue = location.state?.contactDetailsValue || {};

   //Group Dropdown
   const handleGetGroupDrop = () => {
      VendorAPI.contactGroupDropdownAPI()
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
            const originalData = responseData?.result?.GroupDataDropDown || [];
            // const updatedData = [{ id: "0", group_name: "All Contacts" }, ...originalData];
            // setGroupDropDown(updatedData);
            setGroupDropDown(responseData?.result?.GroupDataDropDown);
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
         });
   };
   //Group Dropdown Filter
   const filteredGroupDrop = groupDropDown.filter((dropdownValue) =>
      (dropdownValue?.group_name || '').toLowerCase().includes((groupName || '').toLowerCase())
   );

   const [selectedBodytext, setSelectedBodyText] = useState<any[]>([]);
   const [bodyVariabledata, setbodyVariabledata] = useState<any[]>([]);
   const [bodyActive, setbodyActive] = useState(true);
   const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});

   const handleBodyTextSelect = (item: string, option: any) => {
      setbodyVariabledata((prevSelectedValues) => {
        const exists = prevSelectedValues.some((p) => p.itemNumber === item);
        if (exists) {
          return prevSelectedValues.map((prev) =>
            prev.itemNumber === item
              ? { ...prev, varTypeId: option.id, varTypeName: option.variable_name }
              : prev
          );
        } else {
          return [...prevSelectedValues, { varTypeName: option.variable_name, varTypeId: option.id}];
        }
      });
      setInputValues((prevValues) => ({
        ...prevValues,
        [item]: `{{${option.variable_name}}}`,
      }));
      setVariableId(option?.id);
      setVariable_name(option?.variable_name);
    };
    
   useEffect(() => {
      const transformedData = selectedBodytext.map(item => {
         const { itemNumber, ...rest } = item;

         return {
            varName: item.itemNumber,
            varValue: rest
         }
      });
      setbodyVariabledata(transformedData)
      setbodyActive(false)
   }, [selectedBodytext])
   //Variable Dropdown 
   const handleVariableDrop = () => {
      VendorAPI.campaignvariableDropdwon()
         .then((responseData: any) => {
            if (responseData.apiStatus.code === '200') {
               setVariableDrop(responseData.result.VariableDataDropDown);
            } else {
               toast.error(responseData.apiStatus.message);
            }
         })
         .catch((error: any) => {
            setLoading(false)
            console.error("Error during login:", error);
         });
   };
   const [file, setFile] = useState<File | null>(null);
   const [imgid, setImgid] = useState("")
   const [imageUrl, setImageUrl] = useState("")

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
           const selectedFile = event.target.files?.[0];
          if (!selectedFile) return;
          setimgLoading(true)
           const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

            const isImage = imageTypes.includes(selectedFile.type);
            const isVideo = videoTypes.includes(selectedFile.type);

            if (!isImage && !isVideo) {
            if (selectedFile.type.startsWith('image/')) {
                  toast.error("Only JPG, JPEG, and PNG image files are allowed.");
                  setimgLoading(false)
            } else if (selectedFile.type.startsWith('video/')) {
                  toast.error("Only MP4, WEBM, and OGG video files are allowed.");
                  setimgLoading(false)
            } else {
                  toast.error("Unsupported file type.");
                  setimgLoading(false)
            }
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
               console.log(imagePreviewUrl,"selvag")
               setImageUrl(imagePreviewUrl);
       };
const [fileNames, setFileNames] = useState<string[]>([]);
const [imageUrls, setImageUrls] = useState<string[]>([]);

const handleFileChange1 = (event: React.ChangeEvent<HTMLInputElement>, indexToReplace: number) => {
  const selectedFile = event.target.files?.[0];
  if (!selectedFile) return;
setimgLoading(true)
  const imageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const videoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

  let format: 'image' | 'video' | null = null;

  if (imageTypes.includes(selectedFile.type)) {
    format = 'image';
  } else if (videoTypes.includes(selectedFile.type)) {
    format = 'video';
  } else {
    toast.error("Only JPG, JPEG, PNG images and MP4, WebM, OGG videos are allowed.");
    setimgLoading(false)
    return;
  }

  const previewUrl = URL.createObjectURL(selectedFile);

  // Replace media at a specific index
  setslides((prevSlides: any) => {
    const updatedSlides = [...prevSlides];
    if (indexToReplace < updatedSlides.length) {
      updatedSlides[indexToReplace] = {
        ...updatedSlides[indexToReplace],
        src: previewUrl,
        format,
        title: selectedFile.name
      };
    } else {
      toast.error("Invalid index to replace media.");
      setimgLoading(false);
    }
    return updatedSlides;
  });
console.log(slides,"Slidezzzz")
  // Optional: Update file names and URLs
  setFileNames(prev => {
    const updated = [...prev];
    updated[indexToReplace] = selectedFile.name;
    return updated;
  });

  setImageUrls(prev => {
    const updated = [...prev];
    updated[indexToReplace] = previewUrl;
    return updated;
  });

  handleImgUpload(selectedFile);
};


   const handleImgUpload = async (file: File) => {
      if (!file) {
         toast.error("Please select a file to import.");
         return;
      }
      const formData = new FormData();
      formData.append("media_file", file);
      try {
         const response = await VendorAPI.whatsappImgUploadAPI(formData);
         if (response?.apiStatus?.code==="200") {
               setImgValue(response?.responseData?.h)
               setImgid(response?.responseData?.id)
               const mediaId = response?.responseData?.id;

               setCarouselMediaIds((prev) => {
            const updated = [...prev];
            updated[currentCarousel] = mediaId;
            return updated;
         });
               toast.success(response?.apiStatus?.message);
               setimgLoading(false)
         } else {
               toast.error(response.apiStatus?.message);
               setimgLoading(false)
         }
      } catch (error) {
         console.error("Import Error:", error);
         setimgLoading(false)
         toast.error("An error occurred while importing the file.");
      }
   };
   const [minDateTime, setMinDateTime] = useState('');
   useEffect(() => {
   const now = new Date();
   const formatted = now.toISOString().slice(0,16);
   setMinDateTime(formatted);
   }, []);
   useEffect(()=>{
   handleGetGroupDrop();
   whatsappTemplateDropdwon();
   commontimezonseDropAPI();
   handleVariableDrop();
   },[])
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <DashboardLayout>
         <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
            <TopNav />
            <div className="container-fluid py-1">
               <div className="row">
                  <div className="col-md-6">
                     <nav aria-label="breadcrumb">
                        <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                           <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="javascript:;">Dashboard</a></li>
                           <li className="breadcrumb-item text-sm text-dark active" aria-current="page">{contactDetailsValue.firstName ? "Send WhatsApp Template Message" : "Create New Campaign"}</li>
                        </ol>
                        <h6 className="text-start font-weight-bolder mb-0">{contactDetailsValue.firstName ? ("Send WhatsApp Template Message") : (<>Create <i className="fa-brands fa-whatsapp"></i> New Campaign</>)}</h6>
                     </nav>
                  </div>
                  <div className="col-md-6 text-end">
                     {contactDetailsValue.firstName ? (
                        <button className="vendor-crt-btn" onClick={() => navigate('/vendor/contacts')}><i className="fa-solid fa-chevron-left"></i> Back To Contact</button>
                     ) : null} &nbsp;
                     <button className="vendor-crt-btn" onClick={() => { whatsappGetApi(getId) }}>Sync WhatsApp Templates</button>&nbsp;
                     <button className="vendor-crt-btn" onClick={() => { navigate("/vendor/campaign") }}>Manage Campaigns</button>
                  </div>
               </div>
            </div>
            <div className="myprofile-maincontent container-fluid py-4">
               <div className="row myprofile-content">
                  {contactDetailsValue.firstName ? (
                     <div className="col-md-12 border-bottom mb-4">
                        <p className="text-sm">Name: {contactDetailsValue.firstName} {contactDetailsValue.lastName}</p>
                        <p className="mt-n3 text-sm">Phone: {contactDetailsValue.mobile}</p>
                        <p className="mt-n3 text-sm">Country: {contactDetailsValue.country}</p>
                     </div>
                  ) : null}
                  <div className="col-md-12">
                     <h5 className="text-start">Step 1</h5>
                     {template ? (
                        <div className="col-md-6 login-input-group">
                           <p className="text-start">Select templates</p>
                           <div className="edit-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                              <input type="text" id="vendor-crt-input" 
                              onClick={whatsappTemplateDropdwon}
                              autoComplete="off" onChange={(e)=>settempName(e.target.value)}
                                 value={tempName}
                                 className="vendor-crt-input cursor-pointer"
                                 placeholder=" "
                                 required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label">
                                 <i className="fa-regular fa-circle-check"></i> Select & Configure Template
                              </label>
                              <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                              <ul className="dropdown-menu template-dropdown w-100" >
                              {filteredTemplateDrop.length === 0 ? (
                                    <li className="dropdown-nodata-found">No data found</li>
                                 ) : (
                                    filteredTemplateDrop.map((dropdownValue, id) => ( 
                                    <li key={id}>
                                       <a
                                          className="dropdown-item"
                                          href="#"
                                          onClick={() => { navigate(`/vendor/campaign/create/new/${dropdownValue?.name}/${dropdownValue?.id}`,{ state: { contactDetailsValue } }); settempIdId(dropdownValue?.id); settempName(dropdownValue?.name); setTemplate(false)}}
                                       >
                                          {dropdownValue?.name}
                                       </a>
                                    </li>
                                 )))}
                              </ul>
                           </div>
                        </div>
                     ) : (
                        <>
                           {
                              loading ? (
                                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                    <FadeLoader color="#36d7b7" />
                                 </div>
                              ) : (

                                 <div className="row">
                                    <div className="col-md-6 text-start ">
                                       <div className="campaign-template camp-template mb-4">
                                          <h6 className="campaign-temp-head">Template <span className="campaign-temp-change cursor-pointer" onClick={() => { handleTempChange(); settempName("") }}>Change</span></h6>
                                          <p>{textInput}</p>
                                          <p>Language Code: {languageCode}</p>
                                          <p>Category: <b>{category}</b></p>
                                       </div>
                                       {imgActive === false || headerTextInput ?
                                          <div className="text-start campaign-template">
                                             <h6 className="campaign-temp-head">Header</h6>
                                             <div className="row">

                                                <div className="col-md-12 mt-2">
                                                   {` Assign content for {{1}} variable`}
                                                   <div className="vendor-create-container mt-3 dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                      <input type="text" id="vendor-crt-input mb-3" 
                                                      onClick={handleVariableDrop}
                                                         value={header_name} 
                                                         autoComplete="off"
                                                         onChange={(e) => {
                                                            const value = e.target.value;
                                                            setheader_name(value);
                                                            setheaderId("0");
                                                          }}
                                                         className={`vendor-crt-input loginfilled-frame-username ${submit && !header_name ? 'error' : ''}`} placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label">Choose or write your own</label>
                                                      <i
                                                         className={"dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"}
                                                      ></i>
                                                      <ul className="dropdown-menu template-dropdown w-100">
                                                         {variableDrop?.map((dropdownValue, id) => (
                                                            <li key={id}>
                                                               <a
                                                                  className="dropdown-item"
                                                                  href="#"
                                                                  onClick={() => { setheaderId(dropdownValue?.id); setheader_name(dropdownValue?.variable_name) }}
                                                               >
                                                                  {dropdownValue?.variable_name}
                                                               </a>
                                                            </li>
                                                         ))}
                                                      </ul>
                                                   </div>
                                                   {submit && header_name.length == 0 ? <div className='text-danger error-message-required'>Field is required</div> : <></>}
                                                </div>

                                             </div>
                                          </div>
                                          : <></>}
                                       {BodytextNumbers.length > 0 && <div className="text-start campaign-template">
                                          <h6 className="campaign-temp-head">Body</h6>
                                          <div className="row">
                                          {BodytextNumbers.map((item) => (
                                                <div className="col-md-6 mt-2" key={item}>
                                                   {` Assign content for {{${item}}} variable`}
                                                   <div className="vendor-create-container mt-3 dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                      <input
                                                         type="text"
                                                         id={`vendor-crt-input-${item}`}
                                                         onClick={handleVariableDrop}
                                                         autoComplete="off"
                                                         value={inputValues[item] || ''}
                                                         onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            setInputValues((prev) => ({ ...prev, [item]: newValue }));
                                                            setbodyVariabledata((prevSelectedValues) => {
                                                              const exists = prevSelectedValues.some((p) => p.itemNumber === item);
                                                              if (exists) {
                                                                return prevSelectedValues.map((prev) =>
                                                                  prev.itemNumber === item
                                                                    ? { ...prev, varTypeId: "0", varTypeName: newValue }
                                                                    : prev
                                                                );
                                                              } else {
                                                                return [
                                                                  ...prevSelectedValues,
                                                                  { itemNumber: item, varTypeId: "0", varTypeName: newValue },
                                                                ];
                                                              }
                                                            });
                                                          }}
                                                         className={`vendor-crt-input loginfilled-frame-username ${submit && !inputValues[item] ? 'error' : ''}`}
                                                         placeholder=""
                                                         required
                                                      />
                                                      <label htmlFor={`vendor-crt-input-${item}`} className="vendor-crt-label">Choose or write your own</label>
                                                      <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                      <ul className="dropdown-menu template-dropdown w-100">
                                                         {variableDrop?.map((dropdownValue, id) => (
                                                            <li key={id}>
                                                               <a
                                                                  className="dropdown-item"
                                                                  href="#"
                                                                  onClick={() => {
                                                                     handleBodyTextSelect(item, dropdownValue);
                                                                     setInputValues((prev) => ({
                                                                        ...prev,
                                                                        [item]: `${dropdownValue.variable_name}`,
                                                                      }));
                                                                     setVariableId(dropdownValue?.id);
                                                                     setVariable_name(dropdownValue?.variable_name);
                                                                  }}
                                                               >
                                                                  {dropdownValue?.variable_name}
                                                               </a>
                                                            </li>
                                                         ))}
                                                      </ul>
                                                   </div>
                                                   {submit && !inputValues[item] && (
                                                      <div className="invalid-feedback d-block">Field is required</div>
                                                   )}
                                                </div>
                                             ))}
                                             
                                          </div>
                                       </div>}
                                    <div>
                                       {BodytextNumbers1.length > 0 && (
                                       <div className="text-start campaign-template mt-4">
                                          <h6 className="campaign-temp-head">Carousel Body {currentCarousel + 1}</h6>
                                          <div className="row">
                                             {BodytextNumbers1.map((varName) => {
                                             const inputKey = `${currentCarousel}-${varName}`;
                                             const value = inputValues[inputKey] || (() => {
                                                const card = carouselVariables.find((c) => c.cardIndex === currentCarousel);
                                                const variableObj = card?.variables.find((v) => v.varName === varName && v.type === "body");
                                                return variableObj?.varValue.varTypeName || '';
                                             })();
                                             return (
                                                <div className={`${BodytextNumbers1.length === 1 ? "col-md-12" : "col-md-6 mt-2"}`} key={varName}>
                                                   {`Assign content for {{${varName}}} variable`}
                                                   <div className="vendor-create-container mt-3 dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                   <input
                                                      type="text"
                                                      id={`vendor-crt-input-${varName}`}
                                                      autoComplete="off"
                                                      value={value}
                                                      onChange={(e) => handleInputChange(currentCarousel, varName, e.target.value)}
                                                      className={`vendor-crt-input loginfilled-frame-username ${submit && !value ? 'error' : ''}`}
                                                      placeholder=""
                                                      required
                                                   />
                                                   <label htmlFor={`vendor-crt-input-${varName}`} className="vendor-crt-label">
                                                      Choose or write your own
                                                   </label>
                                                   <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                   <ul className="dropdown-menu template-dropdown w-100">
                                                      {variableDrop?.map((option) => (
                                                         <li key={option.id}>
                                                         <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={(e) => {
                                                               e.preventDefault();
                                                               handleVariableSelect(currentCarousel, varName, option);
                                                            }}
                                                         >
                                                            {option.variable_name}
                                                         </a>
                                                         </li>
                                                      ))}
                                                   </ul>
                                                   </div>
                                                   {submit && !value && <div className="invalid-feedback d-block">Field is required</div>}
                                                </div>
                                             );
                                             })}
                                          </div>
                                          <div className="d-flex justify-content-between mt-4">
                                                   <button
                                                   onClick={handlePrevious}
                                                   disabled={currentCarousel === 0}
                                                   className="bg-secondary border-0 text-white rounded"
                                                   >
                                                   ❮
                                                   </button>
                                                   <div>
                                                      <span className="me-3">
                                                         Showing entries {currentCarousel + 1} of {carousels.length}
                                                      </span>
                                                   </div>
                                                   <button
                                                   onClick={handleNext}
                                                   disabled={currentCarousel === carousels.length - 1}
                                                   className="bg-secondary border-0 text-white rounded"
                                                   >
                                                   ❯
                                                   </button>
                                                </div>
                                       </div>
                                       
                                       )}
                                       {(() => {
                                       const card = carousels[currentCarousel];
                                       const buttonComponent = card?.components?.find((c:any) => c.type === "BUTTONS");
                                       if (!buttonComponent) {
                                          return null;
                                       }
                                       const buttons = buttonComponent?.buttons || [];
                                       const format = carousels[currentCarousel]?.components?.find((c: any) => c.type === "HEADER")?.format;

                                       const uniqueButtons = buttons.filter((btn:any, index:any, self:any) =>
                                          self.findIndex((b:any) => b.type === btn.type && b.text === btn.text) === index
                                       );

                                       return (
                                          <div className="text-start campaign-template mt-4">
                                             <h6 className="campaign-temp-head">Carousel Buttons {currentCarousel + 1}</h6>
                                             <div className="row">
                                             {uniqueButtons.map((btn:any, idx:any) => {
                                                const textVarName = `button-${idx}-text`;
                                                const exampleVarName = `button-${idx}-example`;

                                                const textValue = inputValues[`${currentCarousel}-${textVarName}`] || '';
                                                const exampleValue = inputValues[`${currentCarousel}-${exampleVarName}`] || '';

                                                return (
                                                   <React.Fragment key={`button-${idx}`}>
                                                   <div className={`${uniqueButtons.length === 1 ? "col-md-12" : "col-md-6"} login-input-group`}>
                                                      {`Assign content for Button {{${idx + 1}}}`}
                                                      <div className="vendor-create-container mt-3">
                                                         <input
                                                         autoComplete="off"
                                                         type="text"
                                                         id={`vendor-crt-input-button-${idx}`}
                                                         value={textValue}
                                                         onChange={(e) => handleInputChange(currentCarousel, textVarName, e.target.value)}
                                                         className={`vendor-crt-input loginfilled-frame-username`}
                                                         // className={`vendor-crt-input loginfilled-frame-username ${submit && !textValue ? 'error' : ''}`}
                                                         placeholder=" "
                                                         maxLength={12}
                                                         required
                                                         />
                                                         <label htmlFor={`vendor-crt-input-button-${idx}`} className="vendor-crt-label">Button Text</label>
                                                      </div>
                                                      {/* {submit && !textValue && <div className="invalid-feedback d-block">Field is required</div>} */}
                                                   </div>
                                                   </React.Fragment>
                                                );
                                             })}
                                             </div>
                                             <div className="col-md-12 mt-3 mb-5 file_upload_field">
                                                   <div className="mb-2">Carousel Image</div>
                                                      <div className="file-inputs edit-container">
                                                         <input
                                                            type="file"
                                                            name="file-input"
                                                            id="file-input"
                                                            className="file-input__input"
                                                            accept={format==="IMAGE" ? ".jpg,.jpeg,.png" : ".mp4,.mov,.avi,.wmv,.mkv,.flv"}
                                                            onChange={(e) => handleFileChange1(e, currentCarousel)}
                                                         />
                                                         <label className="file-input__label" htmlFor="file-input" style={{background:"white"}}>
                                                            <svg
                                                               aria-hidden="true"
                                                               focusable="false"
                                                               data-prefix="fas"
                                                               data-icon="upload"
                                                               className="svg-inline--fa fa-upload fa-w-16"
                                                               role="img"
                                                               xmlns="http://www.w3.org/2000/svg"
                                                               viewBox="0 0 512 512"
                                                            >
                                                               <path
                                                                  fill="currentColor"
                                                                  d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                                               ></path>
                                                            </svg>
                                                            <span>Upload Media {imgLoading ? <span className="media-loader"></span>:<></>}</span> <span className="mx-2">{fileNames[currentCarousel]}</span></label>
                                                      </div>
                                                   </div>
                                             <div className="d-flex justify-content-between mt-4">
                                                   <button
                                                   onClick={handlePrevious}
                                                   disabled={currentCarousel === 0}
                                                   className="bg-secondary border-0 text-white rounded"
                                                   >
                                                   ❮
                                                   </button>
                                                   <div>
                                                      <span className="me-3">
                                                         Showing entries {currentCarousel + 1} of {carousels.length}
                                                      </span>
                                                   </div>
                                                   <button
                                                   onClick={handleNext}
                                                   disabled={currentCarousel === carousels.length - 1}
                                                   className="bg-secondary border-0 text-white rounded"
                                                   >
                                                   ❯
                                                   </button>
                                                </div>
                                          </div>
                                       );
                                       })()}
                                       </div>
                                       <h5 className="text-start">Step 2</h5>
                                       <div className="text-start campaign-template mt-4">
                                          <h6 className="campaign-temp-head">Contact and Schedule</h6>
                                          <div className="vendor-create-container mt-2">
                                             <input type="text" id="vendor-crt-input"
                                                autoComplete="off" onChange={(e) => setcampaignName(e.target.value)}
                                                className={`vendor-crt-input loginfilled-frame-username ${submit && !campaignName ? 'error' : ''}`}
                                                placeholder=" " required />
                                             <label htmlFor="vendor-crt-input" className="vendor-crt-label">Campaign Title</label>
                                          </div>
                                          {submit && campaignName.length == 0 ? <div className='text-danger error-message-required'>Campaign title is required</div> : <></>}

                                          <p className="pt-2 campaign-groupcnt">Groups/Contact</p>
                                          <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                             <input type="text" id="vendor-crt-input" 
                                                onClick={handleGetGroupDrop} 
                                                value={groupName}
                                                autoComplete="off" onChange={(e)=>setGroupName(e.target.value)}
                                                className={`vendor-crt-input loginfilled-frame-username ${submit && !groupName ? 'error' : ''}`}
                                                placeholder=" " required />
                                             <label htmlFor="vendor-crt-input" className="vendor-crt-label">Select Contacts Group</label>
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
                                          {imageInput ? 
                                          <div className="col-md-12 mt-3 mb-6 file_upload_field">
                                                      <div className="file-inputs edit-container">
                                                         <input
                                                            type="file"
                                                            name="file-input"
                                                            id="file-input"
                                                            className="file-input__input"
                                                            accept={selectedValue==="image" ? ".jpg,.jpeg,.png" : ".mp4,.mov,.avi,.wmv,.mkv,.flv"}
                                                            onChange={handleFileChange}
                                                         />
                                                         <label className="file-input__label" htmlFor="file-input" style={{background:"white"}}>
                                                            <svg
                                                               aria-hidden="true"
                                                               focusable="false"
                                                               data-prefix="fas"
                                                               data-icon="upload"
                                                               className="svg-inline--fa fa-upload fa-w-16"
                                                               role="img"
                                                               xmlns="http://www.w3.org/2000/svg"
                                                               viewBox="0 0 512 512"
                                                            >
                                                               <path
                                                                  fill="currentColor"
                                                                  d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                                                               ></path>
                                                            </svg>
                                                            <span>Upload Media</span> {imgLoading ? <span className="media-loader"></span>:<></>}<span className="mx-2">{fileName}</span></label>
                                                      </div>
                                                   </div>:""}
                                          <div className="text-start pt-3 pb-3 form-check form-switch ms-1 is-filled">
                                             <input className="form-check-input campaign-create-inputstatus" type="checkbox" checked={restrictLangCode} onChange={ChecklangCode} id="flexSwitchCheckDefault" />
                                             <span className="">Restrict by Language Code - Send only to the contacts whose language code matches with template language code.</span>
                                          </div>
                                          
                                          <div className="mb-4 text-start campaign-template border border-light">
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
                                                      onClick={commontimezonseDropAPI} 
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
                                                      <input type="datetime-local" id="vendor-crt-input" min={minDateTime} onChange={(e) => setscheduledAt(e.target.value)} value={scheduledAt} className="vendor-crt-input" placeholder=" " required />
                                                      <label htmlFor="vendor-crt-input" className="vendor-crt-label">Schedule At</label>
                                                   </div>
                                                </>
                                             )}
                                          </div>
                                       </div>
                                       <div className="text-start campaign-template mt-5">
                                          <h6 className="campaign-temp-head">Send using Phone Number</h6>
                                          <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                             <input type="text" readOnly value={phoneNumber} id="vendor-crt-input" className="vendor-crt-input cursor-pointer" placeholder=" " required />
                                             <label htmlFor="vendor-crt-input" className="vendor-crt-label"> Phone Number</label>
                                             <i
                                                className={"dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"}
                                             ></i>
                                             <ul className="dropdown-menu template-dropdown w-100">
                                                <li><a className="dropdown-item" onClick={() => handlePhoneClick(phoneNumber)}>{phoneNumber}</a></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="col-md-6 text-start sticky-top h-100">
                                       <div className="campaign-template">
                                          <h6 className="campaign-temp-head">Message Preview</h6>
                                          <div className="campaign-msgImg">
                                             <div className="conversation">
                                                <div className="conversation-container">
                                                   <div className=" p-4 message received z-0" >
                                                      <p className="campaign-msg-cnt template-headertxt"><b>{textInput}
                                                         {imgValue ? <div className='ps-0 rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            {/* <i className="fa fa-5x fa-image text-white"></i> */}
                                                            <img className="w-100" src={imageUrl||imgValue} alt="" />
                                                            </div> : null}
                                                         {(vdoValue) && (
                                                         <div
                                                            className="rounded"
                                                            style={{
                                                               display: 'flex',
                                                               justifyContent: 'center',
                                                               alignItems: 'center',
                                                               background: 'gainsboro',
                                                               pointerEvents: 'auto',
                                                            }}
                                                         >
                                                            <video
                                                               className="w-100 rounded"
                                                               controls
                                                               autoPlay
                                                               loop
                                                               playsInline
                                                               src={imageUrl || vdoValue}
                                                            />
                                                         </div>
                                                         )}
                                                         {docValue ? <div className='ps-0 rounded' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '35px', background: 'gainsboro' }}><i className="fa fa-5x fa-file-alt text-white"></i></div> : null}
                                                      </b></p>
                                                      <p className="campaign-msg-cnt template-bodytxt"
                                                         dangerouslySetInnerHTML={{
                                                            __html: BodytextInput
                                                               .replace(/\*(.*?)\*/g, '<b>$1</b>')
                                                               .replace(/_(.*?)_/g, '<i>$1</i>')
                                                               .replace(/~(.*?)~/g, '<strike>$1</strike>')
                                                               .replace(/\n/g, '<br>')
                                                         }}
                                                      ></p>
                                                      <p className="campaign-msg-cnt template-footertxt">{footertextInput} </p>
                                                      <div className="template-buttontxt">
                                                         {(quickbtn === 'None' || quickbtn === 'QUICK_REPLY') && (
                                                            <p className="template-buttontxt button-option-style text-center">{quickbtn === "QUICK_REPLY" ? <i className="fa-solid fa-reply bt-1"></i> : ""} {buttonQuicktxt}</p>
                                                         )}
                                                         {(phoenobtn === 'None' || phoenobtn === 'PHONE_NUMBER') && (
                                                            <p className="template-buttontxt button-option-style text-center">{phoenobtn === "PHONE_NUMBER" ? <i className="fa-solid fa-phone"></i> : ""} {buttonPhonetxt}</p>
                                                         )}
                                                         {(copybtn === 'None' || copybtn === 'COPY_CODE') && (
                                                            <p className="template-buttontxt button-option-style text-center">{copybtn === "COPY_CODE" ? <i className="fa-solid fa-copy"></i> : ""} {copybtn === "COPY_CODE" ? "Copy Code" : ""}</p>
                                                         )}
                                                         {urlbtns.length > 0 && urlbtns.map((btn:any, index:any) => (
  <p key={index} className="button-option-style template-previewModal-text text-center">
    <i className="fa-solid fa-square-arrow-up-right"></i> {buttonurltxts[index]}
  </p>
))}
                                                         {(dynamicurlbtn === 'None' || dynamicurlbtn === 'URL') && (
                                                            <p className="template-buttontxt button-option-style text-center">{dynamicurlbtn === "URL" ? <i className="fa-solid fa-square-arrow-up-right"></i> : ""} {buttondynamicUrltxt}</p>
                                                         )}
                                                      </div>
                                                   </div>
                                       {carouselTyp &&(
                                       <div className="main-container-carousels">
                                          <div
                                                style={{
                                                   display: "flex",
                                                   width: `${slides.length * 100}%`,
                                                   transform: `translateX(-${currentIndex * (100 / slides.length)}%)`,
                                                   transition: "transform 0.3s ease"
                                                }}
                                             />
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
                                                      <video src={slide.src} controls
                                                       onLoadedMetadata={() => {
                                                         videoLoaded.current = true;
                                                         requestAnimationFrame(() => setCurrentIndex((prev) => prev));
                                                      }}/>
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
                                          <div className="campaign-msgCnt">
                                             <p>
                                                <b>Please note:</b> Words like {"{{1}}"}, {"{{abc}}"} etc. are dynamic variables and will be replaced based on your selections.
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                    <div className="my-4 text-start">
                                       <button className="campaign-create-btn" onClick={() => { handlecreateCampaign() }} disabled={imgLoading}
                                          style={{
    opacity: imgLoading ? 0.8 : 1,
    cursor: imgLoading ? 'not-allowed' : 'pointer',
  }}> {imgLoading ? "Schedule Campaign...":"Schedule Campaign"}</button>
                                    </div>
                                 </div>
                              )}
                        </>
                     )}
                  </div>
               </div>
               <Footer />
            </div>
         </main>
      </DashboardLayout>
   )
}
export default Createcampaign;