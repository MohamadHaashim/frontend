import React, { useEffect, useRef, useState } from "react";
import Userimg from "../../../../assets/img/team-2.jpg";
import Userimg1 from "../../../../assets/img/small-logos/logo-spotify.svg";
import { Navigate, useNavigate } from "react-router-dom";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import TopNav from "../../../../shared/TopNav";
import { CKEditor } from "ckeditor4-react";
import "./whatsapp-create-template.css";
import { toast } from "react-toastify";
import { text } from "stream/consumers";
import VendorAPI from "../../../../api/services/vendorLogin/vendorApi";
import API from "../../../../api/api";
import API_EP_BOOK from "../../../../api/endpoints";
import { FadeLoader } from "react-spinners";
import Footer from "../../../../shared/Footer";

interface LangCodeDrop {
  id: string;
  language_name: string;
  language_code: string;
}
function WhatsappCreateTemplate() {
  type FormValue = {
    name: string;
    value: string;
  };
  const [redirect, setRedirect] = React.useState<string | null>(null);
  const [langCodeDrop, setlangCodeDrop] = useState<LangCodeDrop[]>([]);
  const navigate = useNavigate();
  const [headerType, setHeaderType] = useState("None");
  const [BodyType, setBodyType] = useState("None");
  const [footerType, setFooterType] = useState("None");
  const [file, setFile] = useState<File | null>(null);
  const [imgValue, setImgValue] = useState("");
  const [imgid, setImgid] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [setValue, setSetValue] = useState("");

  useEffect(() => {
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    setSetValue(myArray[2]);
  });

  const [selectedValue, setSelectedValue] = useState("None");
  const [bodyselectedValue, setBodySelectedValue] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [BodytextInput, setBodyTextInput] = useState<string>("");
  const [bodychildtextInput, setbodychildTextInput] = useState([]);
  const [footertextInput, setFooterTextInput] = useState("");
  const [isAddDisabled, setIsAddDisabled] = useState(false);
  const [showIndex, setShowIndex] = useState(0);
  const [showIndex1, setShowIndex1] = useState(0);
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [editorInstance1, setEditorInstance1] = useState<any>(null);
  const [editorInstanceCaros, setEditorInstanceCaros] = useState<any>(null);
  const [BodytextInput1, setBodyTextInput1] = useState<string>("");
  const [bodyformValues1, setBodyFormValues1] = useState<
    { name: string; value: string }[]
  >([]);
 const [currentIndex, setCurrentIndex] = useState(0);
  const [slides,setslides] = useState<any>([]);
  console.log(slides,"SlidesCarousel")
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };
  // Templatate Create Usestates
  const editorInstanceRef1 = useRef<any>(null);
  useEffect(() => {
    if (editorInstanceRef1.current && BodytextInput1 !== undefined) {
      editorInstanceRef1.current.setData(BodytextInput1);
    }
  }, [BodytextInput1]);
 
  const [names, setNames] = useState("");
  const [whatsappId, setWhatsappId] = useState("");
  const [category, setCategory] = useState("");
  const [languageCode, setLaguageCode] = useState("");
  const [langName, setLangName] = useState("");
  const [getId, setGetId] = useState("");
  const [bodyTextValues, setBodyTextValues] = useState("");
  const [textValues, setTextValues] = useState("");

  useEffect(() => {
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    setGetId(myArray[3]);
  }, []);
  useEffect(() => {
    if (getId && getId !== "undefined" && getId !== "") {
      whatsappGetApi(getId);
    }
  }, [getId]);

  const [buttonQuicktxt, setButtonQuicktxt] = useState("");
  const [buttonPhonetxt, setButtonPhonetxt] = useState("");
  const [buttonPhoneNotxt, setButtonPhoneNotxt] = useState("91");
  const [buttonCopycodetxt, setButtonCopycodetxt] = useState("");
  const [buttonurltxt, setButtonurltxt] = useState("");
  const [buttonwebUrltxt, setButtonwebUrltxt] = useState("");
  const [buttondynamicwebUrltxt, setButtondynamicwebUrltxt] = useState("");
  const [buttonexampleUrltxt, setButtonexampleUrltxt] = useState("");
  const [buttondynamicUrltxt, setButtondynamicUrltxt] = useState("");
  const [buttonQuickOpt, setButtonQuickopt] = useState(false);
  const [buttonPhoneOpt, setButtonPhoneopt] = useState(false);
  const [buttoncopyOpt, setButtoncopyopt] = useState(false);
  const [buttonurlOpt, setButtonurlopt] = useState(false);
  const [buttondynamicurlOpt, setButtondynamicurlopt] = useState(false);
  const [quickbtn, setquickbtn] = useState("None");
  const [phoenobtn, setphoenobtn] = useState("None");
  const [copybtn, setcopybtn] = useState("None");
  const [urlbtn, seturlbtn] = useState("None");
  const [dynamicurlbtn, setdynamicurlbtn] = useState("None");
  const [buttonActive, setbuttonActive] = useState(false);
  const [editorReady, setEditorReady] = useState(false);
  useEffect(() => {
    setEditorReady(true);
  }, []);
  const handleQuickButtonOpt = () => {
    setButtonQuickopt(true);
    setbuttonActive(true);
    setquickbtn("QUICK_REPLY");
  };
  const handlePhoneButtonOpt = () => {
    setButtonPhoneopt(true);
    setbuttonActive(true);
    setphoenobtn("PHONE_NUMBER");
  };
  const handleCopycodeButtonOpt = () => {
    setButtoncopyopt(true);
    setbuttonActive(true);
    setcopybtn("COPY_CODE");
  };
  const handleurlButtonOpt = () => {
    setButtonurlopt(true);
    setbuttonActive(true);
    seturlbtn("URL");
  };
  const handleDynamicurlButtonOpt = () => {
    setButtondynamicurlopt(true);
    setbuttonActive(true);
    setdynamicurlbtn("URL");
  };

  const [carouselsubmit, setcarouselSubmit] = useState(false);
  const [carouselMediaIds, setcarouselMediaIds] = useState<any[]>([]);

  interface HeaderComponent {
    type: "header";
    format: string;
    example: { header_handle: string[] };
  }

  interface BodyComponent {
    type: "body";
    text: string;
    variables: { name: string; value: string }[];
    example: { body_text: string[] };
  }
  interface ButtonComponent {
    type: "buttons";
    buttons: {
      type:
        | "quick_reply"
        | "phone_number"
        | "copy_code"
        | "url";
      text: string;
      phone_number?: string;
      example?: string[];
      url?: string;
    }[];
  }
  interface CarouselItem {
    components: (HeaderComponent | BodyComponent | ButtonComponent)[];
    id: number;
    fileName: string;
  }

  const createNewCarousel = (): CarouselItem => ({
    components: [
      {
        type: "header",
        format: "",
        example: { header_handle: [] },
      },
      {
        type: "body",
        text: "",
        variables: [],
        example: { body_text: [] },
      },
      {
        type: "buttons",
        buttons: [],
      },
    ],
    id: Date.now(),
    fileName: "",
  });
  const [loadings, setLoadings] = useState<{ [key: string]: boolean }>({}); // loading per item
  const handleFileChange1 = async (
    id: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setLoadings((prev) => ({ ...prev, [id]: true }));
    const previewUrl = URL.createObjectURL(selectedFile);
    const fileType = selectedFile.type.startsWith('video') ? 'video' : 'image';
    const indexToUpdate = carousels.findIndex((item) => item.id === id);
    setslides((prevSlides:any) => {
    const newSlides = [...prevSlides];
    const newSlide = {id,
        src: previewUrl,
        type: fileType,
    };

    if (indexToUpdate >= 0) {
      const newSlides = [...prevSlides];
      newSlides[indexToUpdate] = {
        ...newSlides[indexToUpdate],
        ...newSlide,
      };
      return newSlides;
    } else {
      return [...prevSlides, newSlide];
    }
    });

    console.log('Preview URL:', previewUrl);
    setCarousels((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, fileName: selectedFile.name } : item
      )
    );
    try {
    const uploadResult = await handleImgUpload(selectedFile);
    if (!uploadResult) return;

    setcarouselMediaIds((prev) => {
        const newMediaIds = [...prev];
        if (indexToUpdate >= 0) {
        newMediaIds[indexToUpdate] = uploadResult.id;
        }
        return newMediaIds;
    });

    setCarousels((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              components: item.components.map((component) =>
                component.type === "header"
                  ? {
                      ...component,
                      example: {
                        ...component.example,
                        header_handle: [uploadResult.h],
                      },
                    }
                  : component
              ),
            }
          : item
      )
    );
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoadings((prev) => ({ ...prev, [id]: false }));
    }
  };


  const [carousels, setCarousels] = useState<CarouselItem[]>([
    createNewCarousel(),
  ]);
  console.log(carousels,"Carousel")
//   function logSanitizedCarousels(carousels: CarouselItem[]) {
//   const sanitized = carousels.map(({ components }) => ({
//     components: components.map((component) => {
//       switch (component.type) {
//         case "body":
//           return {
//             type: "body",
//             text: component.text,
//             example: component.example,
//           };
//         case "header":
//           return {
//             type: "header",
//             format: component.format,
//             example: component.example,
//           };
//         case "buttons":
//           return component; // sanitize more if needed
//         default:
//           return component;
//       }
//     }),
//   }));

//   console.log("Sanitized Carousels:", sanitized);
//   console.log("Sanitized carouselMediaIds:", carouselMediaIds);
// }
// logSanitizedCarousels(carousels);

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  function handleHeaderChange(id: number, format: string) {
    setCarousels((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            components: item.components.map((c) =>
              c.type === "header" ? { ...c, format } : c
            ),
          };
        }
        return item;
      })
    );
  }

  // Handle CKEditor body text change
  const editorCarosRefs = useRef<{ [id: number]: any }>({});
  function handleEditorChangeNew(id: number, newText: string) {
  const convertToWhatsAppFormat = (html: string): string => {
    return html
      .replace(/&nbsp;/g, " ")
      .replace(/<br\s*\/?>/gi, "")
      .replace(/<strong>(.*?)<\/strong>/gi, "*$1*")
      .replace(/<b>(.*?)<\/b>/gi, "*$1*")
      .replace(/<em>(.*?)<\/em>/gi, "_$1_")
      .replace(/<i>(.*?)<\/i>/gi, "_$1_")
      .replace(/<strike>(.*?)<\/strike>/gi, "~$1~")
      .replace(/<s>(.*?)<\/s>/gi, "~$1~")
      .replace(/<(?!\/?(b|i|s)\b)[^>]+>/gi, "");
  };

  const formattedText = convertToWhatsAppFormat(newText);

  setCarousels((prev) =>
    prev.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        components: item.components.map((c) => {
          if (c.type === "body") {
            const matches = formattedText.match(/{{\d+}}/g) || [];
            const uniquePlaceholders = Array.from(new Set(matches));

            const existingVars = c.variables || [];
            const existingValues = existingVars.map((v) => v.value);

            const newVars = uniquePlaceholders
              .filter((p) => !existingValues.includes(p))
              .map((p) => ({ name: "", value: p }));

            const filteredVariables = [
              ...existingVars.filter((v) =>
                uniquePlaceholders.includes(v.value)
              ),
              ...newVars,
            ];

            const cleanedText = formattedText.replace(/{{[^}]*}?}?/g, (match) => {
              return /{{\d+}}/.test(match) ? match : "";
            });
            setslides((prevSlides: any[]) => {
              const indexToUpdate = prevSlides.findIndex((slide) => slide.id === id);
              if (indexToUpdate >= 0) {
                const newSlides = [...prevSlides];
                newSlides[indexToUpdate] = {
                  ...newSlides[indexToUpdate],
                  bodyText: cleanedText,
                };
                return newSlides;
              } else {
                return [...prevSlides, { id, bodyText: cleanedText }];
              }
            });

            return {
              ...c,
              text: cleanedText,
              variables: filteredVariables,
            };
          }
          return c;
        }),
      };
    })
  );
}


  function handleAddVariable(id: number) {
    const editor = editorCarosRefs.current[id];

    if (!editor) return;
    setCarousels((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const bodyComponent = item.components.find(
          (c): c is BodyComponent => c.type === "body"
        );
        if (!bodyComponent) return item;
        const currentVars = bodyComponent.variables || [];
        const nextIndex = currentVars.length + 1;
        const newPlaceholder = `{{${nextIndex}}}`;
        const newVariable = {
          name: "",
          value: newPlaceholder,
        };
        const newText = bodyComponent.text + newPlaceholder; 
        editor.focus(); 
        editor.insertText(newPlaceholder); 
        const updatedText = editor.getData();
        return {
          ...item,
          components: item.components.map((c) =>
            c.type === "body"
              ? {
                  ...c,
                  text: updatedText,
                  variables: [...currentVars, newVariable],
                }
              : c
          ),
        };
      })
    );
  }

  // Handle variable name change
  function handleVariableNameChange(id: number, index: number, name: string) {
    setCarousels((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const body = item.components.find(
            (c) => c.type === "body"
          ) as BodyComponent;
          const newVariables = [...(body.variables || [])];
          newVariables[index] = { ...newVariables[index], name };
          return {
            ...item,
            components: item.components.map((c) =>
              c.type === "body"
                ? {
                    ...c,
                    variables: newVariables,
                    example: { body_text: newVariables.map((v) => v.name) },
                  }
                : c
            ),
          };
        }
        return item;
      })
    );
  }

  // Handle removing a variable
  function handleRemoveVariable(id: number, indexToRemove: number) {
    setCarousels((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const body = item.components.find(
            (c) => c.type === "body"
          ) as BodyComponent;
          let newVariables = (body.variables || []).filter(
            (_, i) => i !== indexToRemove
          );
          newVariables = newVariables.map((v, i) => ({
            name: v.name,
            value: `{{${i + 1}}}`,
          }));
          return {
            ...item,
            components: item.components.map((c) =>
              c.type === "body"
                ? {
                    ...c,
                    variables: newVariables,
                    example: { body_text: newVariables.map((v) => v.name) },
                  }
                : c
            ),
          };
        }
        return item;
      })
    );
  }
  let skipReset = false;

const addCarousel = () => {
  let isValid = true;

  for (const item of carousels) {
    const headerComponent = item.components.find(c => c.type === "header");
    const bodyComponent = item.components.find(c => c.type === "body");
    const buttonComponent = item.components.find(c => c.type === "buttons");
    if (!headerComponent || headerComponent.type !== "header" || !("format" in headerComponent) || !headerComponent.format) {
      isValid = false;
    }
    if (!item.fileName) {
      isValid = false;
    }
    if (
      !bodyComponent ||
      bodyComponent.type !== "body" ||
      !("text" in bodyComponent) ||
      !bodyComponent.text ||
      bodyComponent.text.replace(/<[^>]*>/g, "").trim() === ""
    ) {
      isValid = false;
    }

    if (
      !buttonComponent ||
      buttonComponent.type !== "buttons" ||
      !("buttons" in buttonComponent) ||
      buttonComponent.buttons.length === 0
    ) {
      isValid = false;
    } else {
      for (const btn of buttonComponent.buttons) {
        if (!btn.text || !btn.text.trim()) {
          isValid = false;
        }

        if (btn.type === "phone_number") {
          if (!btn.phone_number || !/^\d{10,12}$/.test(btn.phone_number.trim())) {
            isValid = false;
          }
        }

        if (btn.type === "url") {
          if (!btn.url || btn.url.trim() === "") {
            isValid = false;
          }
          if (!btn.example?.[0] || btn.example[0].trim() === "") {
            isValid = false;
          }
        }
      }
    }
  }

  setcarouselSubmit(true);
  if (isValid) {
    console.log("All carousels are valid!");
    document.getElementById("closeModal1")?.click();
    setcarouselSubmit(false);
  } else {
    console.warn("Some inputs are missing or invalid!");
  }
    };

  // Add new carousel
  function handleAddCarousel(afterId?: number) {
    setCarousels((prev) => {
        if (prev.length >= 10) {
      return prev; // Do not add more
    }
      const newItem = createNewCarousel();
      if (afterId === undefined) return [...prev, newItem];
      const idx = prev.findIndex((item) => item.id === afterId);
      if (idx === -1) return [...prev, newItem];
      return [...prev.slice(0, idx + 1), newItem, ...prev.slice(idx + 1)];
    });
  }

  // Remove carousel
function handleRemoveCarousel(id: number) {
  setCarousels((prevCarousels) => {
    if (prevCarousels.length <= 1) return prevCarousels;

    const indexToRemove = prevCarousels.findIndex((item) => item.id === id);
    if (indexToRemove === -1) return prevCarousels;

    // Update slides
    setslides((prevSlides: any[]) => {
      const newSlides = [...prevSlides];
      newSlides.splice(indexToRemove, 1); 
      return newSlides;
    });

    // Update mediaIds
    setcarouselMediaIds((prevMediaIds: any[]) => {
      const newMediaIds = [...prevMediaIds];
      newMediaIds.splice(indexToRemove, 1);
      return newMediaIds;
    });

    // Finally update carousels
    const newCarousels = [...prevCarousels];
    newCarousels.splice(indexToRemove, 1);
    return newCarousels;
  });
}


  // Buttons
  type ButtonType =
    | "quick_reply"
    | "phone_number"
    | "copy_code"
    | "url";
  function handleAddButton(id: number, type: ButtonType) {
    const newButton = getDefaultButtonByType(type);
          if (!newButton) return;

    setCarousels((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updatedComponents = item.components.map((component) => {
          if (component.type !== "buttons") return component;

          const existing = component.buttons.some((btn) => btn.type === type);
          if (existing) return component;

          
          return {
            ...component,
            buttons: [...component.buttons, newButton],
          };
        });

        return { ...item, components: updatedComponents };
      })
    );
    setslides((prevSlides: any[]) => {
    const indexToUpdate = prevSlides.findIndex((slide) => slide.id === id);
    const existingButtons = indexToUpdate >= 0 ? prevSlides[indexToUpdate].buttons || [] : [];
    const updatedButtons = [...existingButtons, newButton];

    const newSlide = {
      id,
      buttons: updatedButtons,
    };

    if (indexToUpdate >= 0) {
      const newSlides = [...prevSlides];
      newSlides[indexToUpdate] = {
        ...newSlides[indexToUpdate],
        ...newSlide,
      };
      return newSlides;
    } else {
      return [...prevSlides, newSlide];
    }
  });
  }
  function getDefaultButtonByType(
    type: ButtonType
  ): ButtonComponent["buttons"][number] {
    switch (type) {
      case "quick_reply":
        return { type: "quick_reply", text: "" };
      case "phone_number":
        return { type: "phone_number", text: "", phone_number: "" };
      case "copy_code":
        return { type: "copy_code", text: "", example: [""] };
      case "url":
        return { type: "url", text: "", url: "", example: [""] };
    }
  }
  function handleButtonChange(
    id: number,
    index: number,
    key: "text" | "phone_number" | "url" | "example",
    value: string
  ) {
    setCarousels((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const buttonComponent = item.components.find(
            (c) => c.type === "buttons"
          ) as ButtonComponent;
          const updatedButtons = [...buttonComponent.buttons];

          if (key === "example") {
            updatedButtons[index].example = [value];
          } else {
            (updatedButtons[index] as any)[key] = value;
          }

          return {
            ...item,
            components: item.components.map((c) =>
              c.type === "buttons"
                ? {
                    ...c,
                    buttons: updatedButtons,
                  }
                : c
            ),
          };
        }
        return item;
      })
    );
  }

function handleRemoveButton(
  id: number,
  type: ButtonComponent["buttons"][number]["type"]
) {
  // 1. Update carousels
  setCarousels((prev) =>
    prev.map((item) => {
      if (item.id !== id) return item;

      return {
        ...item,
        components: item.components.map((component) => {
          if (component.type !== "buttons") return component;

          // ✅ Remove all buttons of the given type
          const updatedButtons = component.buttons.filter(
            (btn) => btn.type !== type
          );

          return {
            ...component,
            buttons: updatedButtons,
          };
        }),
      };
    })
  );

  // 2. Update slides
  setslides((prevSlides: any[]) =>
    prevSlides.map((slide) => {
      if (slide.id !== id) return slide;

      const updatedButtons = (slide.buttons || []).filter(
        (btn: any) => btn.type !== type
      );

      return {
        ...slide,
        buttons: updatedButtons,
      };
    })
  );
}


  // Reset single carousel  to initial state
  
  function resetCarousels() {
    setCarousels([createNewCarousel()]);
    setcarouselSubmit(false);
    setslides([]);
  }

  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const handleCategorySelect = (categoryValue: any) => {
    setCategory(categoryValue);
  };

  // Handle dropdown selection
  const handleDropdownClick = (type: string) => {
    setSelectedValue(type);
    setHeaderType(type);
    setBodyType(type);
    setFooterType(type);

    if (type === "text") {
      setTextInput("");
    }
    if (type === "None") {
      setTextInput("");
      setHeaderTextInput("");
      setFormValue(null);
      setIsAddDisabled(false);
    }
  };
  useEffect(() => {
    setBodyTextInput(BodytextInput);
  }, [BodytextInput, BodyType]);

  const handleBoxClick = () => {
    const fileInput = document.getElementById(
      "file-input"
    ) as HTMLInputElement | null;
    if (fileInput) {
      let acceptedTypes = "";
      switch (selectedValue) {
        case "image":
          acceptedTypes = "image/*";
          break;
        case "video":
          acceptedTypes = "video/*";
          break;
        case "document":
          acceptedTypes = ".pdf, .doc, .docx, .txt";
          break;
        default:
          acceptedTypes = "*/*";
      }

      fileInput.accept = acceptedTypes;
      setFileName("");
      fileInput.click();
    }
  };

  const handleTextInputChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setTextInput(event.target.value);
  };

  const [formValue, setFormValue] = useState<FormValue | null>(null);
  const [headerTextInput, setHeaderTextInput] = useState<string>("");
  const [bodyformValues, setBodyFormValues] = useState<
    { name: string; value: string }[]
  >([]);
  console.log(bodyformValues, "Carousel Variables bodyformValues");
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formValue) {
      // Check if formValue is not null
      setFormValue({
        ...formValue, // Spread the current formValue
        name: e.target.value, // Update the name field
      });
    }
  };

  const handleHeaderTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedHeaderText = e.target.value;
    if (updatedHeaderText === "") {
      setFormValue(null);
      setIsAddDisabled(false);
    }
    setHeaderTextInput(updatedHeaderText);
    setTextInput(updatedHeaderText);
  };
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    setFormValue({ name: "", value: "1" });
    if (!formValue?.value) {
      setHeaderTextInput((prev) => prev + `{{${formValue?.value || 1}}}`);
      setTextInput((prev) => prev + `{{${formValue?.value || 1}}}`);
    }
    setIsAddDisabled(true);
  };

  const bodyadd = (e: React.FormEvent) => {
    e.preventDefault();
    setBodyFormValues((prevFormValues) => {
      const newIndex = prevFormValues.length + 1;
      const newVariable = `{{${newIndex}}}`;

      if (prevFormValues.some((item) => item.value === newVariable)) {
        return prevFormValues;
      }

      if (editorInstance) {
        const editorContent = editorInstance.getData();

        if (!editorContent.includes(newVariable)) {
          editorInstance.insertHtml(`<span>${newVariable}</span>`);
        }
      }
      return [...prevFormValues, { name: "", value: newVariable }];
    });

    setShowIndex((prevIndex) => prevIndex + 1);
  };

  const handleBodyChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userTypedText = e.target.value;
    const fixedPart = `{{${index + 1}}}`;
    setBodyFormValues((prevFormValues) =>
      prevFormValues.map((item, i) =>
        i === index
          ? { ...item, value: `${fixedPart}`, name: userTypedText }
          : item
      )
    );
  };

  const handleFooterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFooterTextInput(e.target.value);
  };
  const editorInstanceRef = useRef<any>(null);
  useEffect(() => {
    if (editorInstanceRef.current && BodytextInput !== undefined) {
      editorInstanceRef.current.setData(BodytextInput);
    }
  }, [BodytextInput]);
  const handleEditorChange = (event: any) => {
    if (!event.editor) return;
    const editorData = event.editor.getData();
    setBodyTextInput(editorData);
    if (event?.editor) {
      let htmlText = event.editor
        .getData()
        .replace(/&nbsp;/g, " ")
        .replace(/<br\s*\/?>/g, "");
      let formattedText = htmlText
        .replace(/<strong>(.*?)<\/strong>/g, "*$1*")
        .replace(/<em>(.*?)<\/em>/g, "_$1_")
        .replace(/<strike>(.*?)<\/strike>/g, "~$1~")
        .replace(/<s>(.*?)<\/s>/g, "~$1~");
      let cleanText = formattedText.replace(/<(?!\/?(b|i|s)\b)[^>]+>/g, "");
      setBodyTextInput(cleanText);

      const variablePattern = /{{\d+}}/g;
      const foundVariables = cleanText.match(variablePattern) || [];

      setBodyFormValues((prevFormValues) => {
        let updatedFormValues = foundVariables.map((variable: any) => {
          let existingItem = prevFormValues.find((item) =>
            item.value.startsWith(variable)
          );

          return existingItem ? existingItem : { value: `${variable} ` };
        });

        return updatedFormValues;
      });
    }
  };

  // Whatsapp Create Template Api
  const vendorWhatsappTemplateCreate = (e: any) => {
    e.preventDefault();
    setSubmit(true);
    if (!names && !langName && !category) {
      return;
    }
    //   setLoading(true)
    setIsLoading(true);
    let apiData = {
      ...(setValue === "edit-whatsapp-template" && { template_id: whatsappId }),
      name: names.toLowerCase(),
      category: category,
      ...(imgid && { mediaId: imgid }),
      language: languageCode,
      ...(selectedValue === "carousel" ? { carouselMediaIds } : null),
      components: [
        // HEADER component
        headerType === "text"
          ? {
              ...(headerType && textInput
                ? {
                    type: "HEADER",
                    format: headerType.toUpperCase(),
                    text: textInput,
                    ...(formValue?.name?.trim() && {
                      example: {
                        header_text: [formValue?.name.trim()],
                      },
                    }),
                  }
                : null),
            }
          : headerType === "image" ||
            headerType === "video" ||
            headerType === "document"
          ? {
              type: "HEADER",
              format: headerType,
              example: {
                header_handle: [imgValue],
              },
            }
          : null,
        // BODY component
        {
          type: "BODY",
          text: BodytextInput,
          ...(bodyformValues.length > 0 && {
            example: {
              body_text: [bodyformValues.map((param) => param.name.trim())],
            },
          }),
        },

        // FOOTER component
        footertextInput
          ? {
              type: "FOOTER",
              text: footertextInput,
            }
          : null,
        // BUTTON component
        buttonActive
          ? {
              type: "BUTTONS",
              buttons: [
                buttonQuicktxt && {
                  type: quickbtn,
                  text: buttonQuicktxt,
                },
                buttonPhonetxt &&
                  buttonPhoneNotxt && {
                    type: phoenobtn,
                    text: buttonPhonetxt,
                    phone_number: buttonPhoneNotxt,
                  },
                buttonCopycodetxt && {
                  type: copybtn,
                  example: buttonCopycodetxt,
                },
                buttonurltxt && {
                  type: urlbtn,
                  text: buttonurltxt,
                  url: buttonwebUrltxt,
                },
                buttondynamicUrltxt && {
                  type: dynamicurlbtn,
                  text: buttondynamicUrltxt,
                  url: buttondynamicwebUrltxt,
                  example: [buttonexampleUrltxt],
                },
              ].filter(Boolean),
            }
          : null,
          selectedValue==="carousel"?
          {
            type:"carousel",
            cards:carousels.map(({ components }) => ({
            components: components.map((component) => {
            switch (component.type) {
              case "body":
                return {
                  type: "body",
                  text: component.text,
                 ...(component.variables && component.variables.length > 0
    ? {
        example: {
          body_text: component.variables.map((v) => v.name),
        },
      }
    : null)
                };
              case "header":
                return {
                  type: "header",
                  format: component.format,
                  example: component.example,
                };
              case "buttons":
                return {
                  type: "buttons",
                  buttons: component.buttons,
                };
              default:
                return component;
            }
          }),
        })),
          }:null
      ].filter(
        (component) => component !== null && Object.keys(component).length > 0
      ),
    };
    VendorAPI.whatsappTemplateCreate(apiData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === "200") {
          toast.success(responseData.apiStatus.message);
          setIsLoading(false);
          setSubmit(false);
          navigate("/vendor/whatsapp-template");
        } else {
          setIsLoading(false);
          // setSubmit(false);
          toast.error(
            responseData.responseData?.error?.message ||
              responseData?.apiStatus?.message
          );
        }
      })
      .catch((error: any) => {
        console.error("Error during API call:", error);
      });
  };

  //   Get By Id
  const whatsappGetApi = async (id: any) => {
    setWhatsappId(id);
    setLoading(true);

    try {
      const responseData = await VendorAPI.whatsappGet(id);
      if (responseData.apiStatus.code === "200") {
        const data = responseData?.responseData;
        setNames(data?.name);
        setLaguageCode(data?.language);
        setLangName(data?.language);
        setCategory(data?.category);

        const componentFormat = data?.components?.[0]?.format?.toLowerCase();
        if (componentFormat) {
          setSelectedValue(componentFormat);
          setHeaderType(componentFormat);
          setLoading(false);
        }
        const bodyText = data?.components?.[1]?.text;
        if (bodyText) {
          setBodyTextValues(bodyText);
          setLoading(false);
        }
        data?.components?.forEach((component: any) => {
          switch (component.type) {
            case "HEADER":
              setTextInput(component?.text);
              setHeaderTextInput(component?.text);
              setLoading(false);
              if (
                component?.example?.header_text?.[0] ||
                component?.example?.header_handle?.[0]
              ) {
                setIsAddDisabled(true);
                setImgValue(component?.example?.header_handle?.[0]);
                setFormValue((prev) => ({
                  name: component?.example?.header_text?.[0],
                  value: "1",
                }));
              }
              break;
            case "BODY":
              let output = component.text;
              output = output.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
              output = output.replace(/_(.*?)_/g, "<em>$1</em>");
              output = output.replace(/~(.*?)~/g, "<strike>$1</strike>");
              output = output.replace(/\n/g, "<br>");
              setBodyTextInput(output);

              setLoading(false);
              if (component?.text && component?.example?.body_text[0]) {
                setbodychildTextInput(component?.example?.body_text[0]);
                const newValues = component?.example?.body_text[0]?.map(
                  (item: string, index: number) => ({
                    value: `{{${index + 1}}}`, // Dynamic name based on index
                    name: item, // Item value from bodyText
                  })
                );
                setBodyFormValues([...newValues]);
                setLoading(false);
                if (editorInstance) {
                  editorInstance.setData(component?.text);
                }
              } else if (component?.text) {
                setbodychildTextInput(component?.text);
                setLoading(false);
              }
              break;
            case "FOOTER":
              setLoading(false);
              setFooterTextInput(component?.text);
              break;
            case "BUTTONS":
              setLoading(false);
              component?.buttons.forEach((buttonsValue: any) => {
                if (buttonsValue) {
                  switch (buttonsValue?.type) {
                    case "QUICK_REPLY":
                      setButtonQuickopt(true);
                      setbuttonActive(true);
                      setquickbtn("QUICK_REPLY");
                      setButtonQuicktxt(buttonsValue?.text);
                      break;
                    case "PHONE_NUMBER":
                      setButtonPhoneopt(true);
                      setbuttonActive(true);
                      setphoenobtn("PHONE_NUMBER");
                      setButtonPhonetxt(buttonsValue?.text);
                      setButtonPhoneNotxt(buttonsValue?.phone_number);
                      break;
                    case "COPY_CODE":
                      setButtoncopyopt(true);
                      setbuttonActive(true);
                      setcopybtn("COPY_CODE");
                      setButtonCopycodetxt(buttonsValue?.text);
                      break;
                    case "URL":
                      if (buttonsValue?.text && buttonsValue?.text?.url) {
                        setButtonurlopt(true);
                        setbuttonActive(true);
                        seturlbtn("URL");
                        setButtonurltxt(buttonsValue?.text);
                        setButtonwebUrltxt(buttonsValue?.url);
                      } else {
                        setButtondynamicurlopt(true);
                        setbuttonActive(true);
                        setdynamicurlbtn("URL");
                        setButtondynamicUrltxt(buttonsValue?.text);
                        setButtondynamicwebUrltxt(buttonsValue?.url);
                        setButtonexampleUrltxt(buttonsValue?.example?.[0]);
                      }
                      break;
                    default:
                      break;
                  }
                }
              });
              break;
            default:
              break;
          }
        });
      } else {
        setLoading(false);
        // Handle API error (optional)
        // toast.error(`get failed: ${responseData.apiStatus.message}`);
      }
    } catch (error) {
      console.error("Error during API call:", error);
      setLoading(false);
    }
  };

  const languageCodeDropdwon = () => {
    VendorAPI.languageCodeDropdown()
      .then((responceData: any) => {
        if (responceData.apiStatus.code === "200") {
          setlangCodeDrop(responceData?.responseData);
        }
      })
      .catch((error: any) => {
        console.error("Error during login:", error);
      });
  };
  //Dropdown Filter
  const filteredLangCodeDrop = langCodeDrop.filter((dropdownValue) =>
    (dropdownValue?.language_name || "")
      .toLowerCase()
      .includes((langName || "").toLowerCase())
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

      if (selectedFile) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      const validTypes = [...validImageTypes, ...validVideoTypes];

      if (!validTypes.includes(selectedFile.type)) {
        if (selectedFile.type.startsWith("image/")) {
          toast.error("Only JPG, JPEG, and PNG image files are allowed.");
        } else if (selectedFile.type.startsWith("video/")) {
          toast.error("Only MP4, WEBM, and OGG video files are allowed.");
        } else {
          toast.error("Unsupported file type selected.");
        }
        return;
      }
      if (
        file &&
        selectedFile.name === file.name &&
        selectedFile.size === file.size &&
        selectedFile.lastModified === file.lastModified
      ) {
        console.log("Same file selected, skipping upload.");
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        handleImgUpload(selectedFile);
      }
      const imagePreviewUrl = URL.createObjectURL(selectedFile);
      setImageUrl(imagePreviewUrl);
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
      const response = await VendorAPI.whatsappImgUploadAPI(formData);
      if (response?.apiStatus?.code === "200") {
        setImgValue(response?.responseData?.h);
        setImgid(response?.responseData?.id);
        toast.success(response?.apiStatus?.message);
        return {
          h: response.responseData.h,
          id: response.responseData.id,
        };
      } else {
        toast.error(response.apiStatus?.message);
      }
    } catch (error) {
      console.error("Import Error:", error);
      toast.error("An error occurred while importing the file.");
    }
  };

  useEffect(() => {
    languageCodeDropdwon();
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <DashboardLayout>
      <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
        <TopNav />
        <div className="container-fluid py-1">
          <div className="row">
            <div className="col-md-4 text-start mt-1">
              <h4>
                <i className="fa-brands fa-whatsapp"></i>{" "}
                {setValue === "create-whatsapp-template"
                  ? "Create" + " New Template"
                  : "Edit" + " Template"}
              </h4>
              <h3></h3>
            </div>
            <div className="col-md-8 text-end whatsapp-three-btn">
              {setValue == "create-whatsapp-template" ? (
                <>
                  <button
                    className="vendor-crt-btn"
                    onClick={() => navigate("/vendor/whatsapp-template")}
                  >
                    <i className="fa-solid fa-chevron-left"></i> Back to
                    Templates
                  </button>
                  <button
                    className="vendor-crt-btn"
                    onClick={() => navigate("")}
                  >
                    Help{" "}
                  </button>
                </>
              ) : (
                ""
              )}
              {/* Edit Condition */}
              {setValue === "edit-whatsapp-template" ? (
                <>
                  <button
                    className="vendor-crt-btn"
                    onClick={() => navigate("/vendor/whatsapp-template")}
                  >
                    <i className="fa-solid fa-chevron-left"></i> Back to
                    Templates
                  </button>
                  <button
                    className="vendor-crt-btn"
                    onClick={() => navigate("")}
                  >
                    Edit this Template on Meta{" "}
                    <i className="fas fa-external-link-alt"></i>
                  </button>
                  <button
                    className="vendor-crt-btn"
                    onClick={() => navigate("")}
                  >
                    Help
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
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
        ) : (
          <>
            <div className="vendor-maincontent container-fluid py-4">
              <div className="row">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-body px-0 pt-0 pb-2">
                      <form action="">
                        <div className="row">
                          <div
                            className="col-md-7 login-input-group"
                            style={{ padding: "25px" }}
                          >
                            <div className="vendor-create-container">
                              <input
                                type="text"
                                id="vendor-crt-input"
                                className="vendor-crt-input"
                                placeholder=" "
                                required
                                style={
                                  submit && names.length == 0
                                    ? { borderColor: "red" }
                                    : { borderColor: "" }
                                }
                                value={names}
                                autoComplete="off"
                                onChange={(e) => setNames(e.target.value)}
                              />
                              <label
                                htmlFor="vendor-crt-input"
                                className="vendor-crt-label"
                              >
                                <i className="fa-solid fa-user"></i> Template
                                Name
                              </label>
                            </div>
                            {submit && names.length == 0 ? (
                              <div className="text-danger error-message-required">
                                Template name is required{" "}
                              </div>
                            ) : (
                              <></>
                            )}
                            <div className="vendor-create-container login-input-group">
                              <div
                                className="edit-container dropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <input
                                  type="text"
                                  id="vendor-crt-input"
                                  className="vendor-crt-input"
                                  placeholder=" "
                                  required
                                  style={
                                    submit && langName.length == 0
                                      ? { borderColor: "red" }
                                      : { borderColor: "" }
                                  }
                                  value={langName}
                                  onClick={languageCodeDropdwon}
                                  autoComplete="off"
                                  onChange={(e) => setLangName(e.target.value)}
                                />
                                <label
                                  htmlFor="vendor-crt-input"
                                  className="vendor-crt-label"
                                >
                                  <i className="fa-solid fa-language"></i>{" "}
                                  Template Language Code
                                </label>
                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                <ul className="dropdown-menu template-dropdown w-100">
                                  {filteredLangCodeDrop.length === 0 ? (
                                    <li className="dropdown-nodata-found">
                                      No data found
                                    </li>
                                  ) : (
                                    filteredLangCodeDrop.map(
                                      (dropdownValue, id) => (
                                        <li key={id}>
                                          <a
                                            className="dropdown-item"
                                            href="#"
                                            onClick={() => {
                                              setLaguageCode(
                                                dropdownValue?.language_code
                                              );
                                              setLangName(
                                                dropdownValue?.language_name
                                              );
                                            }}
                                          >
                                            {dropdownValue?.language_name}
                                          </a>
                                        </li>
                                      )
                                    )
                                  )}
                                </ul>
                              </div>
                              {submit && langName.length == 0 ? (
                                <div className="text-danger error-message-required">
                                  Language name is required{" "}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>

                            <div className="vendor-create-container login-input-group">
                              <div
                                className="vendor-create-container dropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <input
                                  type="text"
                                  id="vendor-crt-input"
                                  className="vendor-crt-input"
                                  placeholder=" "
                                  required
                                  style={
                                    submit && category.length == 0
                                      ? { borderColor: "red" }
                                      : { borderColor: "" }
                                  }
                                  readOnly
                                  value={category}
                                />
                                <label
                                  htmlFor="vendor-crt-input"
                                  className="vendor-crt-label"
                                >
                                  <i className="fa-solid fa-list"></i> Category
                                </label>
                                <i
                                  className={
                                    "dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"
                                  }
                                ></i>
                                <ul className="dropdown-menu dropdown-values">
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleCategorySelect("MARKETING")
                                      }
                                    >
                                      MARKETING
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleCategorySelect("UTILITY")
                                      }
                                    >
                                      UTILITY
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              {submit && category.length == 0 ? (
                                <div className="text-danger error-message-required">
                                  Category is required{" "}
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                            <div className="vendor-create-container login-input-group">
                              <div
                                className="vendor-create-container dropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <input
                                  type="text"
                                  value={selectedValue}
                                  readOnly
                                  id="vendor-crt-input"
                                  className="vendor-crt-input"
                                  placeholder=" "
                                  required
                                />
                                <label
                                  htmlFor="vendor-crt-input"
                                  className="vendor-crt-label"
                                >
                                  <i className="fa-brands fa-font-awesome"></i>{" "}
                                  Header Type
                                </label>
                                <i
                                  className={
                                    "dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"
                                  }
                                ></i>
                                <ul className="dropdown-menu dropdown-values">
                                  <li>
                                    <a
                                      className={`dropdown-item ${
                                        selectedValue === "None" ? "active" : ""
                                      }`}
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("None")
                                      }
                                    >
                                      None
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item hederline-text"
                                      href=""
                                    >
                                      Text
                                    </a>
                                    <a
                                      className="dropdown-item headertype-values"
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("text")
                                      }
                                    >
                                      Text
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item hederline-text"
                                      href=""
                                    >
                                      Carousel
                                    </a>
                                    <a
                                      className="dropdown-item headertype-values"
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("carousel")
                                      }
                                    >
                                      Carousel
                                    </a>
                                  </li>

                                  <a
                                    className="dropdown-item hederline-text"
                                    href=""
                                  >
                                    Media
                                  </a>

                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("image")
                                      }
                                    >
                                      Image
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("video")
                                      }
                                    >
                                      Video
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("document")
                                      }
                                    >
                                      Document
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() =>
                                        handleDropdownClick("location")
                                      }
                                    >
                                      Location
                                    </a>
                                  </li>
                                </ul>
                              </div>

                              {selectedValue === "text" && (
                                <>
                                  <div>
                                    <div className="duplicate-values">
                                      {/* Input for name field */}
                                      <input
                                        type="text"
                                        value={headerTextInput} // Bind to name
                                        onChange={handleHeaderTextChange}
                                        placeholder="Enter name"
                                        style={{ width: "100%" }}
                                        className="selected-value-box"
                                      />
                                    </div>

                                    <button
                                      onClick={add}
                                      className="add-variables mt-2 mb-2"
                                      disabled={isAddDisabled}
                                      style={{
                                        cursor: isAddDisabled
                                          ? "not-allowed"
                                          : "pointer",
                                        opacity: isAddDisabled ? 0.5 : 1,
                                        pointerEvents: isAddDisabled
                                          ? "none"
                                          : "auto",
                                      }}
                                    >
                                      + Add variable
                                    </button>
                                  </div>
                                </>
                              )}
                              {formValue && (
                                <>
                                  {selectedValue === "text" && (
                                    <div className="input-container d-flex">
                                      <span className="fixed-part">{`{{${formValue.value}}}`}</span>
                                      <input
                                        type="text"
                                        value={formValue.name}
                                        onChange={handleNameChange}
                                        placeholder=""
                                        style={{ width: "100%" }}
                                        className="editable-input"
                                      />
                                    </div>
                                  )}
                                </>
                              )}
                              {selectedValue !== "text" &&
                                selectedValue &&
                                headerType !== "location" &&
                                headerType !== "carousel" &&
                                headerType !== "None" && (
                                  <div
                                    className="selected-value-box"
                                    onClick={handleBoxClick}
                                    style={{
                                      border: "1px solid #ccc",
                                      padding: "10px",
                                      marginTop: "10px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    {imgValue ? <img className="template-editImg" src={imgValue} alt="" /> : ""}
                                    {`Select ${selectedValue}`}
                                    <br />
                                    {fileName}
                                  </div>
                                )}

                              <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleFileChange} />

                              <div></div>
                            </div>

                            <div className="col-md-12 login-input-group">
                              <div
                                className="edit-container sms-template-content"
                                style={{ marginTop: "49px" }}
                              >
                                {editorReady && (
                                  <CKEditor
                                    initData={BodytextInput}
                                    onInstanceReady={(event) => {
                                      setEditorInstance(event.editor);
                                    }}
                                    onChange={handleEditorChange}
                                    config={{
                                      toolbar: [
                                        [
                                          "Bold",
                                          "Italic",
                                          "Underline",
                                          "Strike",
                                        ],
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
                                )}
                              </div>
                            </div>
                            <div style={{ padding: "10px" }}>
                              <button
                                onClick={bodyadd}
                                className="add-variables"
                              >
                                + Add variable
                              </button>
                            </div>
                            {bodyformValues?.map((list, index) => (
                              <div
                                key={index}
                                className="input-container d-flex"
                              >
                                <span className="fixed-part">{`{{${
                                  index + 1
                                }}}`}</span>
                                <input
                                  type="text"
                                  value={list.name}
                                  autoComplete="off"
                                  onChange={(e) => handleBodyChange(index, e)}
                                  placeholder=""
                                  className="editable-input w-100"
                                />
                              </div>
                            ))}

                            {headerType !== "carousel" ? (
                              <>
                                <div className="vendor-create-container mt-5 login-input-group">
                                  <input
                                    type="text"
                                    id="vendor-crt-input"
                                    className="vendor-crt-input"
                                    placeholder=" "
                                    required
                                    value={footertextInput}
                                    onChange={handleFooterChange}
                                  />
                                  <label
                                    htmlFor="vendor-crt-input"
                                    className="vendor-crt-label"
                                  >
                                    <i className="fa-regular fa-window-restore"></i>{" "}
                                    Footer (Optional)
                                  </label>
                                </div>
                                <div className="whatsapp-content">
                                  <div className="vendor-create-container whatsapp-under-buttons login-input-group">
                                    <div className="campaign-templates m-3 p-2 w-100">
                                      <h6 className="campaign-temp-head">
                                        Buttons (Optional)
                                      </h6>
                                      <h6 className="create-word p-1">
                                        Create buttons that let customers
                                        respond to your message or take action.
                                      </h6>
                                      <div className="buttons-options">
                                        {buttonQuickOpt ? (
                                          <div className="row quick-replybtn">
                                            <div className="col-md-6">
                                              <p className="text-xs">
                                                Quick Reply Button
                                              </p>
                                            </div>
                                            <div
                                              className="col-md-6 text-end text-xs"
                                              onClick={(e) => {
                                                setButtonQuickopt(false);
                                                setbuttonActive(false);
                                                setquickbtn("None");
                                                setButtonQuicktxt("");
                                              }}
                                            >
                                              <i className="fa fa-times text-danger"></i>
                                            </div>
                                            <div className="col-md-12 login-input-group">
                                              <p className="text-xs">
                                                Button Text
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtonQuicktxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttonQuicktxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-a"></i>
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {buttonPhoneOpt ? (
                                          <div className="row mt-3 quick-replybtn">
                                            <div className="col-md-6">
                                              <p className="text-xs">
                                                Phone Number Button
                                              </p>
                                            </div>
                                            <div
                                              className="col-md-6 text-end text-xs"
                                              onClick={() => {
                                                setbuttonActive(false);
                                                setButtonPhoneopt(false);
                                                setphoenobtn("None");
                                                setButtonPhoneNotxt("91");
                                                setButtonPhonetxt("");
                                              }}
                                            >
                                              <i className="fa fa-times text-danger"></i>
                                            </div>
                                            <div className="col-md-12 login-input-group">
                                              <p className="text-xs">
                                                Button Text
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtonPhonetxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttonPhonetxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-a"></i>
                                                </label>
                                              </div>
                                              <br />
                                              <p className="text-xs">
                                                Phone Number
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  maxLength={12}
                                                  onChange={(e) => {
                                                    setButtonPhoneNotxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttonPhoneNotxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-phone"></i>
                                                </label>
                                              </div>
                                              <div className="error-message-required">
                                                Contact number should starts
                                                with country code without 0 or +
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {buttoncopyOpt ? (
                                          <div className="row mt-3 quick-replybtn">
                                            <div className="col-md-6">
                                              <p className="text-xs">
                                                Coupon Code Copy Button
                                              </p>
                                            </div>
                                            <div
                                              className="col-md-6 text-end text-xs"
                                              onClick={() => {
                                                setbuttonActive(false);
                                                setButtoncopyopt(false);
                                                setcopybtn("None");
                                                setButtonCopycodetxt("");
                                              }}
                                            >
                                              <i className="fa fa-times text-danger"></i>
                                            </div>
                                            <div className="col-md-12 login-input-group">
                                              <p className="text-xs">Example</p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtonCopycodetxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttonCopycodetxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                ></label>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {buttonurlOpt ? (
                                          <div className="row mt-3 quick-replybtn">
                                            <div className="col-md-6">
                                              <p className="text-xs">
                                                URL Button
                                              </p>
                                            </div>
                                            <div
                                              className="col-md-6 text-end text-xs"
                                              onClick={() => {
                                                setbuttonActive(false);
                                                setButtonurlopt(false);
                                                seturlbtn("None");
                                                setButtonurltxt("");
                                                setButtonwebUrltxt("");
                                              }}
                                            >
                                              <i className="fa fa-times text-danger"></i>
                                            </div>
                                            <div className="col-md-12 login-input-group">
                                              <p className="text-xs">
                                                Button Text
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtonurltxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttonurltxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-a"></i>
                                                </label>
                                              </div>
                                              <br />
                                              <p className="text-xs">
                                                Website URL
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtonwebUrltxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttonwebUrltxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-link"></i>
                                                </label>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                        {buttondynamicurlOpt ? (
                                          <div className="row mt-3 quick-replybtn">
                                            <div className="col-md-6">
                                              <p className="text-xs">
                                                Dynamic URL Button
                                              </p>
                                            </div>
                                            <div
                                              className="col-md-6 text-end text-xs"
                                              onClick={() => {
                                                setbuttonActive(false);
                                                setButtondynamicurlopt(false);
                                                setdynamicurlbtn("None");
                                                setButtondynamicUrltxt("");
                                                setButtondynamicwebUrltxt("");
                                                setButtonexampleUrltxt("");
                                              }}
                                            >
                                              <i className="fa fa-times text-danger"></i>
                                            </div>
                                            <div className="col-md-12 login-input-group">
                                              <p className="text-xs">
                                                Button Text
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtondynamicUrltxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttondynamicUrltxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-a"></i>
                                                </label>
                                              </div>
                                              <br />
                                              <p className="text-xs">
                                                Website URL
                                              </p>
                                              <div className="vendor-create-container">
                                                <input
                                                  type="text"
                                                  autoComplete="off"
                                                  onChange={(e) => {
                                                    setButtondynamicwebUrltxt(
                                                      e.target.value
                                                    );
                                                  }}
                                                  value={buttondynamicwebUrltxt}
                                                  id="vendor-crt-input"
                                                  className={`vendor-crt-input`}
                                                  placeholder=" "
                                                  required
                                                />
                                                <label
                                                  htmlFor="vendor-crt-input"
                                                  className="vendor-crt-label"
                                                >
                                                  <i className="fa-solid fa-link"></i>
                                                </label>
                                                <p className="staff-passwordInputicon text-sm">
                                                  {"{{1}}"}
                                                </p>
                                              </div>
                                              <div className="col-md-12 login-input-group">
                                                <p className="text-xs">
                                                  Example
                                                </p>
                                                <div className="vendor-create-container">
                                                  <input
                                                    type="text"
                                                    autoComplete="off"
                                                    onChange={(e) => {
                                                      setButtonexampleUrltxt(
                                                        e.target.value
                                                      );
                                                    }}
                                                    value={buttonexampleUrltxt}
                                                    id="vendor-crt-input"
                                                    className={`vendor-crt-input`}
                                                    placeholder=" "
                                                    required
                                                  />
                                                  <label
                                                    htmlFor="vendor-crt-input"
                                                    className="vendor-crt-label"
                                                  ></label>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                      <button
                                        className="vendor-crt-btn2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleQuickButtonOpt();
                                        }}
                                      >
                                        <i className="fa-solid fa-reply"></i>{" "}
                                        Quick Replay Button
                                      </button>
                                      <button
                                        className="vendor-crt-btn2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handlePhoneButtonOpt();
                                        }}
                                      >
                                        <i className="fa-solid fa-phone"></i>{" "}
                                        Phone Number Button
                                      </button>
                                      <button
                                        className="vendor-crt-btn2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleCopycodeButtonOpt();
                                        }}
                                      >
                                        <i className="fa-solid fa-clipboard"></i>{" "}
                                        Copy Code Button
                                      </button>
                                      <button
                                        className="vendor-crt-btn2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleurlButtonOpt();
                                        }}
                                      >
                                        <i className="fa-solid fa-link"></i> URL
                                        Button
                                      </button>
                                      <button
                                        className="vendor-crt-btn2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleDynamicurlButtonOpt();
                                        }}
                                      >
                                        <i className="fa-solid fa-link"></i>{" "}
                                        Dynamic URL Button
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            {headerType === "carousel" ? (
                              <>
                                <div className="row w-100 py-2">
                                  <hr className="carousel-line-top" />
                                  <div className="col-md-6 text-start px-4 align-center d-flex align-items-center">
                                    <span>Carousel Cards</span>
                                  </div>
                                  <div className="col-md-6 text-end px-0 ">
                                    <button
                                      className="btn btn-primary mb-0"
                                      data-bs-toggle="modal"
                                      data-bs-target="#vendorcreate"
                                      onClick={(e) => {
                                        e.preventDefault();
                                      }}
                                    >
                                      <i className="fa-solid fa-plus"></i>{" "}
                                      Carousel
                                    </button>
                                  </div>
                                  <hr className="carousel-line-bottom" />
                                </div>
                                {/* Carousel Create */}
                                <div
                                  className="modal fade"
                                  id="vendorcreate"
                                  data-bs-backdrop="static"
                                  data-bs-keyboard="false"
                                  tab-Index="-1"
                                  aria-labelledby="vendorcreateLabel"
                                  aria-hidden="true"
                                >
                                  <div
                                    className={`modal-dialog  ${
                                      carousels.length >= 2
                                        ? "modal-xl"
                                        : "modal-lg"
                                    }`}
                                  >
                                    <div className="modal-content all-modal-content vendorcreate-modal-content">
                                      <div className="modal-header vendorcreate-modal-header border-0">
                                        <h5
                                          className="modal-title mb-3 vendorcreate-modal-title"
                                          id="vendorcreateLabel"
                                        >
                                          Create Carousel
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
                                          {carousels.map((item) => {
                                            const headerComponent =
                                              item.components.find(
                                                (c) => c.type === "header"
                                              ) as HeaderComponent;
                                            const bodyComponent =
                                              item.components.find(
                                                (c) => c.type === "body"
                                              ) as BodyComponent;
                                            const buttonComponent =
                                              item.components.find(
                                                (c) => c.type === "buttons"
                                              ) as ButtonComponent;

                                            return (
                                              <div
                                                key={item.id}
                                                className={`mb-5 ${
                                                  carousels.length >= 2
                                                    ? "col-md-6"
                                                    : "col-md-12"
                                                }`}
                                              >
                                                <div className="row mt-n4 mb-4">
                                                  <div className="col-md-6 mt-3 text-sm">
                                                    Header Type{" "}
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </div>
                                                  <div className="col-md-6 mt-3 text-sm text-end">
                                                    <button
                                                      type="button"
                                                      className="carousel-plus bg-transparent border-0"
                                                      onClick={() =>
                                                        handleAddCarousel(
                                                          item.id
                                                        )
                                                      }
                                                       disabled={carousels.length >= 10}
                                                    >
                                                      <i className="fa-solid fa-plus"></i>
                                                    </button>
                                                    {carousels.length >= 2 && (
                                                      <button
                                                        className="carousel-xmark bg-transparent border-0"
                                                        onClick={() =>
                                                          handleRemoveCarousel(
                                                            item.id
                                                          )
                                                        }
                                                      >
                                                        <i className="fa-solid fa-xmark"></i>
                                                      </button>
                                                    )}
                                                  </div>
                                                  <div className="col-md-6 login-input-group mt-n3 mb-0">
                                                    <div
                                                      className={`promotionSMS w-100 ${carouselsubmit &&!headerComponent.format ? 'error' : ''}`}
                                                      onClick={() =>
                                                        handleHeaderChange(
                                                          item.id,
                                                          "image"
                                                        )
                                                      }
                                                    >
                                                      <input
                                                        type="radio"
                                                        id={`image${item.id}`}
                                                        name={`smsType${item.id}`}
                                                        checked={
                                                          headerComponent.format ===
                                                          "image"
                                                        }
                                                        className="carousel-media-radio"
                                                        onChange={() =>
                                                          handleHeaderChange(
                                                            item.id,
                                                            "image"
                                                          )
                                                        }
                                                        required
                                                      />
                                                      <label
                                                        htmlFor={`image${item.id}`}
                                                        className="sms-label"
                                                      >
                                                        <div className="icon-text-wrapper">
                                                          <svg
                                                            version="1.0"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="30px"
                                                            height="30px"
                                                            viewBox="0 0 512.000000 512.000000"
                                                            preserveAspectRatio="xMidYMid meet"
                                                          >
                                                            <g
                                                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                              fill="#000000"
                                                              stroke="none"
                                                            >
                                                              <path
                                                                d="M1209 4882 c-126 -33 -248 -132 -305 -247 -55 -113 -54 -85 -53
                                                        -1435 0 -685 4 -1279 8 -1321 7 -68 13 -83 59 -151 84 -124 185 -200 303 -227
                                                        29 -7 643 -11 1770 -11 1702 0 1728 0 1792 20 121 38 225 125 282 238 57 114
                                                        55 54 55 1447 0 1409 3 1335 -61 1456 -38 70 -126 157 -197 193 -117 59 -12
                                                        56 -1877 55 -1583 0 -1715 -1 -1776 -17z m3494 -316 c42 -17 85 -68 92 -109 3
                                                        -18 4 -413 3 -878 l-3 -847 -385 450 c-212 247 -407 470 -433 494 -74 71 -124
                                                        89 -237 89 -81 0 -103 -4 -150 -26 -31 -14 -73 -41 -95 -60 -21 -19 -218 -249
                                                        -437 -511 -219 -263 -402 -478 -406 -478 -4 0 -74 67 -156 149 -186 187 -221
                                                        206 -366 206 -160 -1 -153 4 -588 -429 l-372 -371 2 1110 c3 1100 3 1110 24
                                                        1145 11 19 38 45 60 57 l39 23 1688 0 c1403 0 1693 -2 1720 -14z m-929 -1138
                                                        c14 -13 250 -286 526 -608 l501 -585 -3 -162 c-3 -179 -8 -193 -78 -240 l-33
                                                        -23 -1699 0 c-1503 0 -1702 2 -1728 15 -17 9 -30 19 -30 23 0 12 863 869 888
                                                        882 23 11 36 0 240 -203 120 -119 230 -220 245 -226 40 -15 103 -14 137 4 15
                                                        8 239 268 499 580 326 391 477 565 490 565 11 0 31 -10 45 -22z"
                                                              />
                                                              <path
                                                                d="M1813 4245 c-81 -22 -132 -52 -193 -114 -164 -164 -168 -418 -9 -586
                                                        87 -92 185 -135 309 -135 123 0 222 43 308 133 62 66 89 119 108 210 63 302
                                                        -224 572 -523 492z m158 -321 c93 -48 55 -194 -50 -194 -104 0 -146 137 -57
                                                        191 38 23 67 24 107 3z"
                                                              />
                                                              <path
                                                                d="M450 3177 c-19 -12 -42 -36 -51 -52 -26 -44 -390 -1447 -396 -1525
                                                        -14 -183 95 -374 261 -455 53 -26 323 -102 1066 -300 547 -147 1281 -343 1630
                                                        -436 349 -94 660 -177 690 -185 63 -16 176 -18 239 -3 122 28 261 139 316 252
                                                        16 33 55 170 93 322 61 250 64 267 52 307 -33 111 -165 153 -251 81 -42 -36
                                                        -47 -51 -113 -319 -32 -127 -66 -245 -77 -262 -26 -44 -75 -72 -125 -72 -35 0
                                                        -538 132 -2074 545 -151 40 -504 135 -785 210 -280 75 -521 144 -535 154 -33
                                                        24 -70 89 -70 125 0 16 83 349 185 738 102 390 185 725 185 745 0 50 -27 100
                                                        -69 129 -48 32 -124 33 -171 1z"
                                                              />
                                                            </g>
                                                          </svg>
                                                          <span>Image</span>
                                                        </div>
                                                      </label>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-6 login-input-group mt-n3 mb-0">
                                                    <div
                                                      className={`promotionSMS w-100 ${carouselsubmit &&!headerComponent.format ? 'error' : ''}`}
                                                      onClick={() =>
                                                        handleHeaderChange(
                                                          item.id,
                                                          "video"
                                                        )
                                                      }
                                                    >
                                                      <input
                                                        type="radio"
                                                        id={`video${item.id}`}
                                                        name={`smsType${item.id}`}
                                                        checked={
                                                          headerComponent.format ===
                                                          "video"
                                                        }
                                                        className="carousel-media-radio"
                                                        onChange={() =>
                                                          handleHeaderChange(
                                                            item.id,
                                                            "video"
                                                          )
                                                        }
                                                        required
                                                      />
                                                      <label
                                                        htmlFor={`video${item.id}`}
                                                        className="sms-label"
                                                      >
                                                        <div className="icon-text-wrapper">
                                                          <svg
                                                            version="1.0"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="30px"
                                                            height="30px"
                                                            viewBox="0 0 512.000000 512.000000"
                                                            preserveAspectRatio="xMidYMid meet"
                                                          >
                                                            <g
                                                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                              fill="#000000"
                                                              stroke="none"
                                                            >
                                                              <path
                                                                d="M765 4376 c-64 -28 -106 -109 -90 -173 8 -35 41 -80 68 -96 17 -9
                                                            260 -13 1079 -17 1048 -5 1057 -5 1084 -26 67 -50 69 -56 72 -280 l3 -204
                                                            -1281 0 c-1421 0 -1361 3 -1477 -66 -105 -62 -176 -158 -208 -281 -23 -87 -22
                                                            -2030 0 -2118 21 -78 58 -145 114 -201 58 -59 104 -88 180 -114 61 -20 72 -20
                                                            1499 -18 l1437 3 76 36 c85 41 160 110 202 187 45 82 57 151 57 319 l0 153
                                                            201 0 200 0 457 -365 c251 -201 472 -370 490 -376 67 -22 149 18 178 88 12 27
                                                            14 260 14 1355 l0 1323 -23 39 c-36 63 -114 92 -179 67 -13 -5 -230 -174 -482
                                                            -375 l-459 -366 -199 0 -198 0 0 153 c0 167 -11 231 -56 319 -34 66 -114 145
                                                            -187 183 l-57 30 0 215 c0 232 -8 287 -54 378 -34 66 -100 135 -169 176 -115
                                                            68 -82 66 -1229 66 -836 -1 -1039 -3 -1063 -14z m2441 -1122 c15 -11 37 -33
                                                            48 -48 21 -27 21 -35 24 -1019 2 -1108 7 -1035 -67 -1084 l-34 -23 -1387 0
                                                            -1387 0 -34 23 c-73 49 -69 -21 -69 1069 0 668 3 986 11 1005 14 37 47 73 84
                                                            89 25 11 275 13 1407 11 1373 -2 1377 -2 1404 -23z m1614 -1079 c0 -813 -2
                                                            -975 -13 -968 -8 4 -152 118 -320 253 l-307 245 0 472 0 471 313 250 c171 138
                                                            315 251 320 251 4 1 7 -438 7 -974z m-940 0 l0 -395 -150 0 -150 0 0 395 0
                                                            395 150 0 150 0 0 -395z"
                                                              />
                                                              <path
                                                                d="M695 2966 c-37 -16 -70 -52 -84 -89 -7 -19 -11 -197 -11 -525 0 -496
                                                            0 -497 23 -536 45 -80 6 -76 772 -76 758 0 724 -3 772 69 l23 34 0 516 c0 500
                                                            -1 517 -20 549 -12 19 -38 41 -63 52 -40 19 -72 20 -712 19 -536 0 -676 -2
                                                            -700 -13z m1195 -606 l0 -320 -495 0 -495 0 0 320 0 320 495 0 495 0 0 -320z"
                                                              />
                                                              <path
                                                                d="M2573 2810 c-127 -77 -71 -274 78 -274 145 0 201 190 80 271 -43 29
                                                            -113 31 -158 3z"
                                                              />
                                                              <path
                                                                d="M2569 2157 c-122 -81 -65 -271 81 -271 146 0 203 190 81 271 -23 16
                                                            -49 23 -81 23 -32 0 -58 -7 -81 -23z"
                                                              />
                                                            </g>
                                                          </svg>
                                                          <span>Video</span>
                                                        </div>
                                                      </label>
                                                    </div>
                                                  </div>
                                                  {headerComponent.format &&(
                                                  <>
                                                  <div className="col-md-12 mt-3 mb-n3 text-sm">
                                                    Select Media File{" "}
                                                    <span className="text-danger">
                                                      *
                                                    </span>
                                                  </div>
                                                  
                                                  <div className="col-md-12 edit-name">
                                                    <div
                                                      className={`media-upload-container login-input-group ${carouselsubmit && !item.fileName ? 'error' : ''}`}

                                                    >
                                                      <label
                                                        htmlFor={`file-input-${item.id}`}
                                                        className="media-upload-label"
                                                      >
                                                        <i className="fa-regular fa-file-image icon-left mt-1" />
                                                        <span className="mt-1">
                                                          Select Media File
                                                        </span>
                                                      </label>
                                                      <input
                                                        type="file"
                                                        id={`file-input-${item.id}`}
                                                        className="media-upload-input"
                                                        accept={headerComponent.format === "image" ? ".jpg,.jpeg,.png" : ".mp4,.mov,.avi,.wmv,.mkv,.flv"}
                                                        onChange={(e) =>
                                                          handleFileChange1(
                                                            item.id,
                                                            e
                                                          )
                                                        }
                                                        ref={(el) => {
                                                          fileInputRefs.current[
                                                            item.id
                                                          ] = el;
                                                        }}
                                                        style={{
                                                          cursor: "pointer",
                                                          display: "none",
                                                        }}
                                                      />
                                                       {loadings[item.id] ? (
                                                              <span className="imageLoaders"></span>
                                                          ) : (
                                                              null
                                                          )}
                                                      <button
                                                        className="media-upload-button"
                                                        type="button"
                                                        onClick={() =>{
                                                          fileInputRefs.current[
                                                            item.id
                                                          ]?.click();
                                                          }
                                                        }
                                                      >
                                                        <i className="fa-solid fa-arrow-up-from-bracket text-dark"></i>{" "}
                                                        Select
                                                      </button>
                                                    </div>
                                                    <p
                                                      className="text-sm mb-0 p-0"
                                                      style={{
                                                        maxWidth: "400px",
                                                        wordBreak: "break-word",
                                                      }}
                                                    >
                                                      {item.fileName &&
                                                        item.fileName}
                                                    </p>
                                                  </div></>)}

                                                  <div className="col-md-12 login-input-group">
                                                    <div className="col-md-12 login-input-group">
                                                      <div className="col-md-12 mb-n4 text-sm">
                                                        Body Text{" "}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </div>
                                                      <div
                                                        className={`edit-container sms-template-content ${
                                                        carouselsubmit &&
                                                        !(
                                                            item.components.find(
                                                            (c): c is BodyComponent => c.type === "body"
                                                            )?.text?.trim()
                                                        )
                                                            ? "error"
                                                            : ""
                                                        }`}
                                                        style={{
                                                          marginTop: "33px",
                                                        }}
                                                      >
                                                        {editorReady &&
                                                          (() => {
                                                            const bodyComponent =
                                                              item.components.find(
                                                                (
                                                                  c
                                                                ): c is BodyComponent =>
                                                                  c.type ===
                                                                  "body"
                                                              );
                                                            const bodyText =
                                                              bodyComponent?.text ||
                                                              "";

                                                            return (
                                                              <CKEditor
                                                                initData={
                                                                  bodyText
                                                                }
                                                                onInstanceReady={(
                                                                  event
                                                                ) => {
                                                                  setEditorInstance1(
                                                                    event.editor
                                                                  );
                                                                  editorCarosRefs.current[
                                                                    item.id
                                                                  ] =
                                                                    event.editor;
                                                                }}
                                                                onChange={(
                                                                  event
                                                                ) => {
                                                                  const data =
                                                                    event.editor.getData();
                                                                  handleEditorChangeNew(
                                                                    item.id,
                                                                    data
                                                                  );
                                                                }}
                                                                config={{
                                                                  toolbar: [
                                                                    [
                                                                      "Bold",
                                                                      "Italic",
                                                                      "Underline",
                                                                      "Strike",
                                                                    ],
                                                                  ],
                                                                  versionCheck:
                                                                    false,
                                                                  resize_enabled:
                                                                    false,
                                                                  removePlugins:
                                                                    "about",
                                                                  ignoreUnsupportedBanner:
                                                                    true,
                                                                  enterMode: 2,
                                                                  shiftEnterMode: 2,
                                                                  autoParagraph:
                                                                    false,
                                                                  entities:
                                                                    false,
                                                                  entities_latin:
                                                                    false,
                                                                  basicEntities:
                                                                    false,
                                                                  fillEmptyBlocks:
                                                                    false,
                                                                }}
                                                              />
                                                            );
                                                          })()}
                                                      </div>
                                                    </div>
                                                  </div>

                                                  <div>
                                                    <button
                                                      type="button"
                                                      className="add-variables mt-1"
                                                      onClick={() =>
                                                        handleAddVariable(
                                                          item.id
                                                        )
                                                      }
                                                    >
                                                      + Add Variable
                                                    </button>
                                                  </div>
                                                  {bodyComponent.variables.map(
                                                    (v, idx) => (
                                                      <div
                                                        className="col-md-12"
                                                        key={idx}
                                                      >
                                                        <div className="input-container d-flex mt-3">
                                                          <span className="fixed-part">
                                                            {v.value}
                                                          </span>
                                                          <input
                                                            type="text"
                                                            className="editable-input me-2"
                                                            value={v.name}
                                                            onChange={(e) =>
                                                              handleVariableNameChange(
                                                                item.id,
                                                                idx,
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        </div>
                                                      </div>
                                                    )
                                                  )}

                                                  {/* Buttons Section */}
                                                  <div className="col-md-12 mt-4">
                                                    <div className="whatsapp-content">
                                                      <div
                                                        className={`vendor-create-container whatsapp-under-buttons login-input-group ${
                                                        carouselsubmit && buttonComponent.buttons.length === 0 ? "error" : ""
                                                        }`}
                                                        > 
                                                        <div className="campaign-templates m-3 p-2 w-100">
                                                          <h6 className="campaign-temp-head">
                                                            Buttons (Required)
                                                          </h6>
                                                          <h6 className="create-word p-1 ms-2">
                                                            Create buttons that
                                                            let customers
                                                            respond to your
                                                            message or take
                                                            action.
                                                          </h6>
                                                          <div className="buttons-options">
                                                            {/* Quick Reply Button */}
                                                            {buttonComponent?.buttons.map(
                                                              (btn, index) => {
                                                                switch (
                                                                  btn.type
                                                                ) {
                                                                  case "quick_reply":
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          btn.type
                                                                        }
                                                                        className="row quick-replybtn mb-3"
                                                                      >
                                                                        <div className="col-md-6">
                                                                          <p className="text-xs">
                                                                            Quick
                                                                            Reply
                                                                            Button
                                                                          </p>
                                                                        </div>
                                                                        <div
                                                                          className="col-md-6 text-end text-xs"
                                                                          onClick={() =>
                                                                            handleRemoveButton(
                                                                              item.id,
                                                                              "quick_reply"
                                                                            )
                                                                          }
                                                                        >
                                                                          <i className="fa fa-times text-danger"></i>
                                                                        </div>
                                                                        <div className="col-md-12 login-input-group">
                                                                          <p className="text-xs">
                                                                            Button
                                                                            Text
                                                                          </p>
                                                                          <div className="vendor-create-container">
                                                                            <input
                                                                              type="text"
                                                                              autoComplete="off"
                                                                              value={
                                                                                btn.text
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                handleButtonChange(
                                                                                  item.id,
                                                                                  index,
                                                                                  "text",
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              id="vendor-crt-input"
                                                                              className={`vendor-crt-input ${
                                                                                carouselsubmit && !btn.text.trim() ? "error" : ""
                                                                                }`}
                                                                              placeholder=" "
                                                                              required
                                                                            />
                                                                            <label
                                                                              htmlFor="vendor-crt-input"
                                                                              className="vendor-crt-label"
                                                                            >
                                                                              <i className="fa-solid fa-a"></i>
                                                                            </label>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    );

                                                                  case "phone_number":
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          btn.type
                                                                        }
                                                                        className="row quick-replybtn mb-3"
                                                                      >
                                                                        <div className="col-md-6">
                                                                          <p className="text-xs">
                                                                            Phone
                                                                            Number
                                                                            Button
                                                                          </p>
                                                                        </div>
                                                                        <div
                                                                          className="col-md-6 text-end text-xs"
                                                                          onClick={() =>
                                                                            handleRemoveButton(
                                                                              item.id,
                                                                              "phone_number"
                                                                            )
                                                                          }
                                                                        >
                                                                          <i className="fa fa-times text-danger"></i>
                                                                        </div>
                                                                        <div className="col-md-12 login-input-group">
                                                                          <p className="text-xs">
                                                                            Button
                                                                            Text
                                                                          </p>
                                                                          <div className="vendor-create-container">
                                                                            <input
                                                                              type="text"
                                                                              autoComplete="off"
                                                                              value={
                                                                                btn.text
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                handleButtonChange(
                                                                                  item.id,
                                                                                  index,
                                                                                  "text",
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              id="vendor-crt-input"
                                                                              className={`vendor-crt-input ${
                                                                              carouselsubmit && !btn.text.trim() ? "error" : ""
                                                                              }`}
                                                                              placeholder=" "
                                                                              required
                                                                            />
                                                                            <label
                                                                              htmlFor="vendor-crt-input"
                                                                              className="vendor-crt-label"
                                                                            >
                                                                              <i className="fa-solid fa-a"></i>
                                                                            </label>
                                                                          </div>
                                                                          <br />
                                                                          <p className="text-xs">
                                                                            Phone
                                                                            Number
                                                                          </p>
                                                                          <div className="vendor-create-container">
                                                                            <input
                                                                              type="text"
                                                                              autoComplete="off"
                                                                              maxLength={
                                                                                12
                                                                              }
                                                                              value={
                                                                                btn.phone_number ||
                                                                                ""
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                handleButtonChange(
                                                                                  item.id,
                                                                                  index,
                                                                                  "phone_number",
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              id="vendor-crt-input"
                                                                                className={`vendor-crt-input ${
                                                                                carouselsubmit &&
                                                                                (!btn.phone_number )
                                                                                    // || !/^\d{10,12}$/.test(btn.phone_number.trim()))
                                                                                    ? "error"
                                                                                    : ""
                                                                                }`}                                                                              placeholder=" "
                                                                              required
                                                                            />
                                                                            <label
                                                                              htmlFor="vendor-crt-input"
                                                                              className="vendor-crt-label"
                                                                            >
                                                                              <i className="fa-solid fa-phone"></i>
                                                                            </label>
                                                                          </div>
                                                                          <div className="error-message-required">
                                                                            Contact
                                                                            number
                                                                            should
                                                                            starts
                                                                            with
                                                                            country
                                                                            code
                                                                            without
                                                                            0 or
                                                                            +
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    );

                                                                  case "url":
                                                                    return (
                                                                      <div
                                                                        key={
                                                                          btn.type
                                                                        }
                                                                        className="row quick-replybtn mb-3"
                                                                      >
                                                                        <div className="col-md-6">
                                                                          <p className="text-xs">
                                                                            Dynamic
                                                                            URL
                                                                            Button
                                                                          </p>
                                                                        </div>
                                                                        <div
                                                                          className="col-md-6 text-end text-xs"
                                                                          onClick={() =>
                                                                            handleRemoveButton(
                                                                              item.id,
                                                                              "url"
                                                                            )
                                                                          }
                                                                          style={{
                                                                            cursor:
                                                                              "pointer",
                                                                          }}
                                                                        >
                                                                          <i className="fa fa-times text-danger"></i>
                                                                        </div>
                                                                        <div className="col-md-12 login-input-group">
                                                                          <p className="text-xs">
                                                                            Button
                                                                            Text
                                                                          </p>
                                                                          <div className="vendor-create-container">
                                                                            <input
                                                                              type="text"
                                                                              autoComplete="off"
                                                                              value={
                                                                                btn.text
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                handleButtonChange(
                                                                                  item.id,
                                                                                  index,
                                                                                  "text",
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              id="vendor-crt-input"
                                                                              className={`vendor-crt-input ${
                                                                              carouselsubmit && !btn.text.trim() ? "error" : ""
                                                                              }`}
                                                                              placeholder=" "
                                                                              required
                                                                            />
                                                                            <label
                                                                              htmlFor="vendor-crt-input"
                                                                              className="vendor-crt-label"
                                                                            >
                                                                              <i className="fa-solid fa-a"></i>
                                                                            </label>
                                                                          </div>
                                                                          <br />
                                                                          <p className="text-xs">
                                                                            Website
                                                                            URL
                                                                          </p>
                                                                          <div className="vendor-create-container">
                                                                            <input
                                                                              type="text"
                                                                              autoComplete="off"
                                                                              value={
                                                                                btn.url ||
                                                                                ""
                                                                              }
                                                                              onChange={(
                                                                                e
                                                                              ) =>
                                                                                handleButtonChange(
                                                                                  item.id,
                                                                                  index,
                                                                                  "url",
                                                                                  e
                                                                                    .target
                                                                                    .value
                                                                                )
                                                                              }
                                                                              id="vendor-crt-input"
                                                                              className={`vendor-crt-input ${
                                                                                carouselsubmit &&
                                                                                (!btn.url)
                                                                                    // || !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w.-]*)*\/?$/.test(
                                                                                    //   btn.url.trim()
                                                                                    // ))
                                                                                    ? "error"
                                                                                    : ""
                                                                                }`}
                                                                              placeholder=" "
                                                                              required
                                                                            />
                                                                            <label
                                                                              htmlFor="vendor-crt-input"
                                                                              className="vendor-crt-label"
                                                                            >
                                                                              <i className="fa-solid fa-link"></i>
                                                                            </label>
                                                                            <p className="carousel-btnVar text-sm">
                                                                              {
                                                                                "{{1}}"
                                                                              }
                                                                            </p>
                                                                          </div>
                                                                          <div className="col-md-12 login-input-group">
                                                                            <p className="text-xs">
                                                                              Example
                                                                            </p>
                                                                            <div className="vendor-create-container">
                                                                              <input
                                                                                type="text"
                                                                                autoComplete="off"
                                                                                value={
                                                                                  btn
                                                                                    .example?.[0] ||
                                                                                  ""
                                                                                }
                                                                                onChange={(
                                                                                  e
                                                                                ) =>
                                                                                  handleButtonChange(
                                                                                    item.id,
                                                                                    index,
                                                                                    "example",
                                                                                    e
                                                                                      .target
                                                                                      .value
                                                                                  )
                                                                                }
                                                                                id="vendor-crt-input"
                                                                                className={`vendor-crt-input ${
                                                                                    carouselsubmit && !btn.example?.[0]?.trim() ? "error" : ""
                                                                                    }`}                                                                                placeholder=" "
                                                                                required
                                                                              />
                                                                              <label
                                                                                htmlFor="vendor-crt-input"
                                                                                className="vendor-crt-label"
                                                                              ></label>
                                                                            </div>
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    );

                                                                  default:
                                                                    return null;
                                                                }
                                                              }
                                                            )}

                                                            {/* Buttons Add Controls */}
                                                            <div className="button-control-group mt-3">
                                                              <button
                                                                type="button"
                                                                className="vendor-crt-btn2 me-2"
                                                                onClick={() =>
                                                                  handleAddButton(
                                                                    item.id,
                                                                    "quick_reply"
                                                                  )
                                                                }
                                                              >
                                                                <i className="fa-solid fa-reply"></i>{" "}
                                                                Quick Reply
                                                                Button
                                                              </button>
                                                              <button
                                                                type="button"
                                                                className="vendor-crt-btn2 me-2"
                                                                onClick={() =>
                                                                  handleAddButton(
                                                                    item.id,
                                                                    "phone_number"
                                                                  )
                                                                }
                                                              >
                                                                <i className="fa-solid fa-phone"></i>{" "}
                                                                Phone Number
                                                                Button
                                                              </button>
                                                              <button
                                                                type="button"
                                                                className="vendor-crt-btn2"
                                                                onClick={() =>
                                                                  handleAddButton(
                                                                    item.id,
                                                                    "url"
                                                                  )
                                                                }
                                                              >
                                                                <i className="fa-solid fa-link"></i>{" "}
                                                                Dynamic URL
                                                                Button
                                                              </button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      <div className="modal-footer vendorcreate-modal-footer border-0">
                                        <button
                                          type="button"
                                          className="btn btn-secondary"
                                          data-bs-dismiss="modal"
                                          onClick={resetCarousels}
                                          id="closeModal"
                                        >
                                          Close
                                        </button>
                                        <button
                                          type="button"
                                          className="bg-transparent border-0 m-0 p-0"
                                          data-bs-dismiss="modal"
                                          id="closeModal1"
                                        >
                                        </button>
                                        <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={addCarousel}
                                        disabled={Object.values(loadings).some((val) => val)}
                                        style={{ color: Object.values(loadings).some((val) => val) ? '#fff' : '#fff' }}
                                      >
                                        {Object.values(loadings).some((val) => val) ? 'Add...' : 'Add'}
                                      </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="col-md-5 sticky-top h-100">
                            <h5 className="mt-4">Template Preview</h5>
                            <div className="text-end">
                              <div className="template-preview px-2">
                                <div className="conversation">
                                  <div className="conversation-container">
                                    <div className="message received z-0">
                                      {/* <span className="metadata"><span className="time"></span></span> */}
                                      {headerType && BodyType && footerType && (
                                        <div className="lw-whatsapp-header-placeholder header-value-right-side text-start">
                                          {headerType === "text" && (
                                            <p className="template-headertxt fw-bold">
                                              {textInput}
                                            </p>
                                          )}

                                          {headerType === "video" && (
                                            <div
                                              style={{
                                                display: "flex",
                                                // padding: "35px",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              <video className="w-100 rounded" src={imageUrl || imgValue} controls autoPlay loop playsInline></video>
                                              {/* <i className="fa fa-5x fa-play-circle"></i> */}
                                            </div>
                                          )}
                                          {headerType === "image" && (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                              }}
                                            >
                                              {/* <i className="fa fa-5x fa-image text-white"></i> */}
                                              <img
                                                className="w-100 rounded"
                                                src={imageUrl || imgValue}
                                                alt=""
                                              />
                                            </div>
                                          )}

                                          {headerType === "location" && (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "35px",
                                                background: "gainsboro",
                                              }}
                                            >
                                              <i className="fa fa-5x fa-map-marker-alt text-white"></i>
                                            </div>
                                          )}

                                          {headerType === "document" && (
                                            <div
                                              style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                padding: "35px",
                                                background: "gainsboro",
                                              }}
                                            >
                                              <i className="fa fa-5x fa-file-alt text-white"></i>
                                            </div>
                                          )}
                                          <div>
                                            {(BodyType === "None" ||
                                              BodyType === "text" ||
                                              BodyType === "image" ||
                                              BodyType === "video" ||
                                              BodyType === "document" ||
                                              BodyType === "location" ||
                                              BodyType === "carousel") && (
                                              <p
                                                className="template-bodytxt mt-3"
                                                dangerouslySetInnerHTML={{
                                                  __html: BodytextInput.replace(
                                                    /\*(.*?)\*/g,
                                                    "<b>$1</b>"
                                                  )
                                                    .replace(
                                                      /_(.*?)_/g,
                                                      "<i>$1</i>"
                                                    )
                                                    .replace(
                                                      /~(.*?)~/g,
                                                      "<strike>$1</strike>"
                                                    )
                                                    .replace(/\n/g, "<br>"),
                                                }}
                                              ></p>
                                            )}
                                          </div>
                                          <div>
                                            {(footerType === "None" ||
                                              footerType === "text" ||
                                              footerType === "image" ||
                                              footerType === "video" ||
                                              footerType === "document" ||
                                              footerType === "location") && (
                                              <p className="template-footertxt">
                                                {footertextInput}
                                              </p>
                                            )}
                                          </div>
                                          <div className="template-buttontxt">
                                            {(quickbtn === "None" ||
                                              quickbtn === "QUICK_REPLY") && (
                                              <p className="template-buttontxt button-option-style text-center">
                                                {quickbtn === "QUICK_REPLY" ? (
                                                  <i className="fa-solid fa-reply bt-1"></i>
                                                ) : (
                                                  ""
                                                )}{" "}
                                                {buttonQuicktxt}
                                              </p>
                                            )}
                                            {(phoenobtn === "None" ||
                                              phoenobtn === "PHONE_NUMBER") && (
                                              <p className="template-buttontxt button-option-style text-center">
                                                {phoenobtn ===
                                                "PHONE_NUMBER" ? (
                                                  <i className="fa-solid fa-phone"></i>
                                                ) : (
                                                  ""
                                                )}{" "}
                                                {buttonPhonetxt}
                                              </p>
                                            )}
                                            {(copybtn === "None" ||
                                              copybtn === "COPY_CODE") && (
                                              <p className="template-buttontxt button-option-style text-center">
                                                {copybtn === "COPY_CODE" ? (
                                                  <i className="fa-solid fa-copy"></i>
                                                ) : (
                                                  ""
                                                )}{" "}
                                                {copybtn === "COPY_CODE"
                                                  ? "Copy Code"
                                                  : ""}
                                              </p>
                                            )}
                                            {(urlbtn === "None" ||
                                              urlbtn === "URL") && (
                                              <p className="template-buttontxt button-option-style text-center">
                                                {urlbtn === "URL" ? (
                                                  <i className="fa-solid fa-square-arrow-up-right"></i>
                                                ) : (
                                                  ""
                                                )}{" "}
                                                {buttonurltxt}
                                              </p>
                                            )}
                                            {(dynamicurlbtn === "None" ||
                                              dynamicurlbtn === "URL") && (
                                              <p className="template-buttontxt button-option-style text-center">
                                                {dynamicurlbtn === "URL" ? (
                                                  <i className="fa-solid fa-square-arrow-up-right"></i>
                                                ) : (
                                                  ""
                                                )}{" "}
                                                {buttondynamicUrltxt}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {selectedValue==="carousel" && ( 
                                <div className="main-container-carousel">
                                 <div className="carousel-container">
                                <div className="wrapper conversation-container">
                                    <div className="slider-wrapper">
                                    <div
                                        className="inner"
                                        style={{ width: `${slides.length * 100}%`, transform: `translateX(-${currentIndex * (100 / slides.length)}%)` }}
                                    >
                                        {slides.map((slide:any, index:any) => (
                                        <article key={index} style={{ width: `${100 / slides.length}%` }}>
                                            {slide.type === 'image' ? (
                                              <img src={slide.src} alt={`Slide ${index}`} />
                                            ) : (
                                              <video src={slide.src} controls />
                                            )}
                                        </article>
                                        ))}
                                    </div>
                                    </div>
                                    {slides && slides.length >= 2 && (
                                    <div className="slider-nav-buttons">
                                    <button onClick={(e)=>{prevSlide();e.preventDefault()}}>❮</button>
                                    <button onClick={(e)=>{nextSlide();e.preventDefault()}}>❯</button>
                                    </div>)}
                                    <div className="slider-dot-control">
                                    {slides.map((_:any, index:any) => (
                                        <span
                                        key={index}
                                        className={index === currentIndex ? 'active-dot' : ''}
                                        onClick={() => setCurrentIndex(index)}
                                        />
                                    ))}
                                    </div>
                                    
                                    </div>
                                    {slides[currentIndex] && slides[currentIndex].bodyText && (
                                    <div key={slides[currentIndex].id}>
                                        <p
                                        style={{ textAlign: "justify", fontSize: "14px", padding: "0 5px" }}
                                        dangerouslySetInnerHTML={{
                                            __html: slides[currentIndex].bodyText
                                            .replace(/\*(.*?)\*/g, "<b>$1</b>")
                                            .replace(/_(.*?)_/g, "<i>$1</i>")
                                            .replace(/~(.*?)~/g, "<strike>$1</strike>")
                                            .replace(/\n/g, "<br>"),
                                        }}
                                        ></p>
                                        </div>)}
                                        {/* Render buttons if available */}
                                        {slides[currentIndex] && slides[currentIndex].buttons && (
                                        <div className="template-buttontxt">
                                            {slides[currentIndex].buttons.map((button: any, idx: number) => {
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
                          <div className="whatsapp-btn text-center">
                            <button
                              onClick={vendorWhatsappTemplateCreate}
                              disabled={isLoading}
                              className="btn btn-primary "
                            >
                              {isLoading ? "Submit..." : "Submit"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </>
        )}
      </main>
    </DashboardLayout>
  );
}

export default WhatsappCreateTemplate;
