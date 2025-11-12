import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import DashboardLayout from "../../../../../layouts/DashboardLayout";
import TopNav from "../../../../../shared/TopNav";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../../../shared/Footer";
import CatalogUpload from "../../../../../assets/img/Catalog_img_vdo.jpg";
import "./index.css";
import ReactDOM from "react-dom";
import { Title } from "chart.js";
import VendorAPI from "../../../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { get } from "lodash";
import VariantImagesPreview from "./VariantImagesPreview";
import { v4 as uuidv4 } from 'uuid';

type PreviewFile = {
  file: File;
  url: string;
  type: "image" | "video";
  name: string;
  size: string;
  modifiedTime: string;
};

type Category = {
  name: string;
  subs: string[];
};

const categories: Category[] = [
  {
    name: "Antiques & Collectibles",
    subs: [
      "Collectible Appliances",
      "Collectible Coins & Paper Money",
      "Collectible Electronics",
      "Collectible Furniture",
      "Collectible Glassware",
      "Collectible Knives & Swords",
      "Collectible Tools",
      "Other Collectibles",
    ],
  },
  {
    name: "Arts & Crafts",
    subs: ["Painting", "Drawing", "Crafting", "Pottery", "Other Arts"],
  },
  {
    name: "Auto Parts & Accessories",
    subs: [
      "Engines & Components",
      "Tires & Wheels",
      "Interior Accessories",
      "Exterior Accessories",
    ],
  },
  {
    name: "Books, Movies & Music",
    subs: ["Books", "Movies", "Music CDs", "Vinyl", "Audiobooks"],
  },
  {
    name: "Clothing, Shoes & Accessories",
    subs: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"],
  },
  {
    name: "Electronics",
    subs: ["Mobile Phones", "Laptops", "Tablets", "Wearables", "Cameras"],
  },
];

const formatSize = (bytes: number) => `${(bytes / 1024).toFixed(2)} KB`;
const formatDate = (date: Date) => date.toLocaleString();

function CatalogProductCreate() {
  const [catalogCondition, setcatalogCondition] = useState<string>("");
  const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const currencies = [
    {
      code: "INR",
      label: "INR - Indian Rupee",
      symbol: "₹",
      placeholder: "Enter amount",
    },
    {
      code: "USD",
      label: "USD - US Dollar",
      symbol: "$",
      placeholder: "Enter amount",
    },
    {
      code: "EUR",
      label: "EUR - Euro",
      symbol: "€",
      placeholder: "Enter amount",
    },
    {
      code: "HRK",
      label: "HRK - Croatian Kuna",
      symbol: "kn",
      placeholder: "Enter amount",
    },
    {
      code: "HTG",
      label: "HTG - Haitian Gourde",
      symbol: "G",
      placeholder: "Enter amount",
    },
    {
      code: "HUF",
      label: "HUF - Hungarian Forint",
      symbol: "Ft",
      placeholder: "Enter amount",
    },
    {
      code: "IDR",
      label: "IDR - Indonesian Rupiah",
      symbol: "Rp",
      placeholder: "Enter amount",
    },
    {
      code: "ILS",
      label: "ILS - Israeli New Shekel",
      symbol: "₪",
      placeholder: "Enter amount",
    },
  ];

  const catalogId = localStorage.getItem("catalogId");

  const [setValue, setSetValue] = useState("");
  const [getId, setgetId] = useState("");

  useEffect(() => {
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    setSetValue(myArray[2]);
    setgetId(myArray[5]);
  });  
  useEffect(() => {
        if (getId && getId !== "undefined" && getId !== "") {
           productGetApi(getId);
           // handlesendMsg();
        }
     }, [getId]);
     console.log(getId,typeof getId, "getId"); 
  const [touched, setTouched] = useState(false);
  const maxChars = 9999;
  const [currency, setCurrency] = useState(currencies[0]); // default to USD
  const [amount, setAmount] = useState("");
  const [salePrice, setsalePrice] = useState("");
  const [catConditionDrop] = useState<any[]>([
    { id: 1, label: "New", value: "NEW" },
    { id: 2, label: "Refurbished", value: "REFURBISHED" },
    { id: 3, label: "Used (like new)", value: "USED_LIKE_NEW" },
    { id: 4, label: "Used (good)", value: "USED_GOOD" },
    { id: 5, label: "Used (fair)", value: "USED_FAIR" },
  ]);

  const [open, setOpen] = useState(false);
  const [panelFlipped, setPanelFlipped] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [subSearchTerm, setSubSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Open dropdown, focus search
  // const handleInputClick = () => {
  //     setOpen(true);
  //     setPanelFlipped(false);
  //     setActiveIdx(null);
  //     setSearchTerm("");
  //     setSubSearchTerm("");
  //     setTimeout(() => searchInputRef.current?.focus(), 25);
  // };

  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const [condDropdownPos, setCondDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  }>({ top: 0, left: 0, width: 0 });
  const condBtnRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleDown = (e: MouseEvent) => {
      if (
        condBtnRef.current &&
        !condBtnRef.current.contains(e.target as Node) &&
        !document
          .querySelector(".custom-condition-list-pop")
          ?.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDown);
    return () => {
      document.removeEventListener("mousedown", handleDown);
    };
  }, [dropdownOpen]);

  const handleInputClick = () => {
    setOpen(true);
    setPanelFlipped(false);
    setActiveIdx(null);
    setSearchTerm("");
    setSubSearchTerm("");
    setTimeout(() => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      searchInputRef.current?.focus();
    }, 25);
  };

  // Click outside/esc to close
  useEffect(() => {
    if (!open) return;
    const handleDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        !document
          .querySelector(".dropdown-menu-wrapper")
          ?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // Filtered categories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered subcategories
  const filteredSubs =
    activeIdx !== null
      ? categories[activeIdx].subs.filter((sub) =>
          sub.toLowerCase().includes(subSearchTerm.toLowerCase())
        )
      : [];

  const handleCategoryClick = (i: number) => {
    setActiveIdx(i);
    setPanelFlipped(true);
    setSubSearchTerm("");
  };

  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubCategoryClick = (sub: string) => {
    if (activeIdx !== null) {
      const mainCategory = categories[activeIdx].name;
      setSelectedCategory(`${mainCategory} > ${sub}`);
      setPanelFlipped(false);
      setOpen(false);
    }
  };

  const handleBack = () => {
    setPanelFlipped(false);
    setActiveIdx(null);
    setTimeout(() => searchInputRef.current?.focus(), 40);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = currencies.find((c) => c.code === e.target.value);
    if (selected) {
      setCurrency(selected);
      setAmount(""); // Optionally reset amount when currency changes
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  // const toggleDropdown = () => setIsOpen(prev => !prev);
  const navigate = useNavigate();
  const handleItemClick = () => {
    setIsOpen(false);
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  // const mediaSave = () => {
  //   console.log(previewFiles, "previewFiles sss");
  //   if (previewFiles.length === 1) {
  //     // document.getElementById("closepopup")?.click();
  //   }
  //   document.getElementById("closepopup")?.click();
  // };
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = Array.from(e.target.files ?? []); // safely handle null

  //   const previewData: PreviewFile[] = files.map((file) => ({
  //     file,
  //     url: URL.createObjectURL(file),
  //     type: file.type.startsWith("image") ? "image" : "video",
  //     name: file.name,
  //     size: formatSize(file.size),
  //     modifiedTime: formatDate(
  //       file.lastModified ? new Date(file.lastModified) : new Date()
  //     ),
  //   }));

  //   setPreviewFiles((prev) => [...prev, ...previewData]);
  // };
  type PreviewKey = `${string}-${number}`;
type PreviewMap = Record<PreviewKey, PreviewFile[]>;

const [previewMap, setPreviewMap] = useState<PreviewMap>({});
console.log("img previewMap",previewMap);
 const [selectedIndices, setSelectedIndices] = useState<{
    pIndex: number;
    vIndex: number;
  } | null>(null);
 const previewFiles = selectedIndices
    ? previewMap[`${selectedIndices.pIndex}-${selectedIndices.vIndex}`] || []
    : [];
const mediaSave = () => {
  if (selectedIndices) {
    const key = `${selectedIndices.pIndex}-${selectedIndices.vIndex}` as PreviewKey;
    console.log(previewMap[key], "Saved for", key);
  }

  document.getElementById("closepopup")?.click();
};

const handleClose = () => {
  if (selectedIndices) {
    const key = `${selectedIndices.pIndex}-${selectedIndices.vIndex}` as PreviewKey;
    setPreviewMap((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files ?? []);
  const previewData: PreviewFile[] = files.map((file) => ({
    file,
    url: URL.createObjectURL(file),
    type: file.type.startsWith("image") ? "image" : "video",
    name: file.name,
    size: formatSize(file.size),
    modifiedTime: formatDate(new Date(file.lastModified)),
  }));

  if (selectedIndices) {
    const key = `${selectedIndices.pIndex}-${selectedIndices.vIndex}` as PreviewKey;
    setPreviewMap((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ...previewData],
    }));
//     handleVariantChange(
//       selectedIndices.pIndex,
//       selectedIndices.vIndex,
//       "images",
// files
//     );
  }
};

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleDelete = (indexToRemove: number) => {
  if (!selectedIndices) return;

  const { pIndex, vIndex } = selectedIndices;
  const key = `${pIndex}-${vIndex}`as `${number}-${number}`;

  setPreviewMap((prev) => {
    const updatedPreviewFiles = prev[key]?.filter((_, idx) => idx !== indexToRemove) || [];
    return { ...prev, [key]: updatedPreviewFiles };
  });

  // setProductForm((prev) => {
  //   const newForm = [...prev];
  //   const variantImages = newForm[pIndex].variants[vIndex].images;
  //   newForm[pIndex].variants[vIndex].images = variantImages.filter(
  //     (_, idx) => idx !== indexToRemove
  //   );
  //   return newForm;
  // });
};

  // const handleDelete = (indexToRemove: number) => {
  //   setPreviewFiles((prev) =>
  //     prev.filter((_, index) => index !== indexToRemove)
  //   );
  // };
  const [checked, setChecked] = useState(false);

  // State for rows
  const [rows, setRows] = useState([
    { id: Date.now(), type: "main", data: {} },
  ]);

  // State for which row's dropdown is open

  const dropdownTriggerRef = useRef<HTMLElement | null>(null);

  // const DROPDOWN_HEIGHT = 150;

  // const toggleDropdown = (index: any, event: React.MouseEvent<HTMLDivElement>,) => {
  //  const triggerEl = event.currentTarget;
  //   if (!triggerEl) return;

  //   dropdownTriggerRef.current = triggerEl;

  //   const rect = triggerEl.getBoundingClientRect();
  //   const DROPDOWN_HEIGHT = 120;

  //   const shouldOpenAbove =
  //     window.innerHeight - rect.bottom < DROPDOWN_HEIGHT &&
  //     rect.top > DROPDOWN_HEIGHT;

  //   const top = shouldOpenAbove
  //     ? rect.top - DROPDOWN_HEIGHT
  //     : rect.bottom;

  //   const left = rect.left

  //   setDropdownPosition({ top, left });
  //   setOpenDropdownIndex(prev => (prev === index ? null : index));
  //   };
  // useEffect(() => {
  //   if (openDropdownIndex === null || !dropdownTriggerRef.current) return;

  //   const updatePosition = () => {
  //   const rect = dropdownTriggerRef.current!.getBoundingClientRect();
  //   const top =  rect.bottom;
  //   const left = rect.left + (openDropdownIndex === rows.length - 1 ? 15 : 0);

  //     setDropdownPosition({ top, left });
  //   };

  //   updatePosition();

  //   window.addEventListener("scroll", updatePosition, true);
  //   window.addEventListener("resize", updatePosition);

  //   return () => {
  //     window.removeEventListener("scroll", updatePosition, true);
  //     window.removeEventListener("resize", updatePosition);
  //   };
  // }, [openDropdownIndex]);

  // ACTIONS
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null
  );
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });
  const tableRef = useRef<HTMLDivElement | null>(null);
  const dropdownTriggerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [openDropdownAction, setOpenDropdownAction] = useState<string | null>(
    null
  );
  const actionDDref = useRef<HTMLDivElement | null>(null);
  const toggleDropdown = (key: string) => {
    const el = dropdownTriggerRefs.current[key];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const shouldOpenAbove =
      window.innerHeight - rect.bottom < 120 && rect.top > 120;

    const top = shouldOpenAbove ? rect.top - 120 : rect.bottom;
    const left = rect.left;

    setDropdownPosition({ top, left });
    setOpenDropdownAction((prev) => (prev === key ? null : key));
  };
  useEffect(() => {
    if (!openDropdownAction) return;

    const el = dropdownTriggerRefs.current[openDropdownAction];
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const top = rect.bottom;
    const left = rect.left;

    setDropdownPosition({ top, left });

    const update = () => {
      const r = el.getBoundingClientRect();
      setDropdownPosition({ top: r.bottom, left: r.left });
    };

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [openDropdownAction]);

  useEffect(() => {
    if (!openDropdownAction) return;

    const handleClickOutside = (event: MouseEvent) => {
      const triggerEl = dropdownTriggerRefs.current[openDropdownAction];
      const menuEl = actionDDref.current;

      const target = event.target as Node;

      if (triggerEl?.contains(target) || menuEl?.contains(target)) {
        return; // click is inside, do nothing
      }

      setOpenDropdownAction(null); // close dropdown
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownAction]);
  // Category
  const categTriggerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const categDropdownRef = useRef<HTMLDivElement | null>(null);
  const [openCategKey, setOpenCategKey] = useState<string | null>(null);
  const [categDropdownPos, setCategDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const handleInputClickCat = (pIndex: number, vIndex: number) => {
    const key = `${pIndex}-${vIndex}`;
    const triggerEl = categTriggerRefs.current[key];
    if (!triggerEl) return;
    setOpen(true);
    setPanelFlipped(false);
    setActiveIdx(null);
    setSearchTerm("");
    setSubSearchTerm("");
    setTimeout(() => {
      if (containerRef.current) {
        const rect = triggerEl.getBoundingClientRect();

        setCategDropdownPos({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
      searchInputRef.current?.focus();
    }, 25);
    setOpenCategKey((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (!openCategKey) return;

    const [pIndexStr, vIndexStr] = openCategKey.split("-");
    const key = `${pIndexStr}-${vIndexStr}`;
    const triggerEl = categTriggerRefs.current[key];
    if (!triggerEl) return;

    const updatePosition = () => {
      const rect = triggerEl.getBoundingClientRect();
      setCategDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [openCategKey]);
  useEffect(() => {
    if (!openCategKey) return;

    const handleClickOutside = (e: MouseEvent) => {
      const activeTriggerRef = categTriggerRefs.current[openCategKey];
      const dropdownEl = categDropdownRef.current;

      // ✅ Close only if click is outside BOTH the trigger and the dropdown
      if (
        activeTriggerRef &&
        dropdownEl &&
        !activeTriggerRef.contains(e.target as Node) &&
        !dropdownEl.contains(e.target as Node)
      ) {
        setOpenCategKey(null);
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openCategKey]);

  // Condition
  const [openDropdownKey, setOpenDropdownKey] = useState<string | null>(null);

  const condBtnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openDropdown = (pIndex: number, vIndex: number) => {
    const key = `${pIndex}-${vIndex}`;
    const triggerEl = condBtnRefs.current[key];
    if (!triggerEl) return;

    const rect = triggerEl.getBoundingClientRect();

    const top = rect.bottom + window.scrollY;
    const left = rect.left + window.scrollX;
    const width = rect.width;

    setCondDropdownPos({ top, left, width });
    setOpenDropdownKey(key); // store which dropdown is open
  };

  useEffect(() => {
    if (!openDropdownKey) return;

    const [pIndex, vIndex] = openDropdownKey.split("-").map(Number);
    const triggerEl = condBtnRefs.current[openDropdownKey];
    if (!triggerEl) return;

    const updatePosition = () => {
      const rect = triggerEl.getBoundingClientRect();
      const top = rect.bottom + window.scrollY;
      const left = rect.left + window.scrollX;
      const width = rect.width;
      setCondDropdownPos({ top, left, width });
    };

    updatePosition();

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [openDropdownKey]);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropdownKey &&
        dropdownTriggerRef.current &&
        !dropdownTriggerRef.current.contains(e.target as Node)
      ) {
        setOpenDropdownKey(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdownKey]);
// SCROLL x
useEffect(() => {
 if (tableRef.current) {
    tableRef.current.style.overflowX = openCategKey || openDropdownKey ? "hidden" : "auto";
  }
}, [openCategKey,openDropdownKey]);
  // Add Variant
  // const handleAddVariant = (rowIndex: any) => {
  //   const newRows = [...rows];
  //   newRows.splice(rowIndex + 1, 0, {
  //     id: Date.now(),
  //     type: "variant",
  //     data: {},
  //   });
  //   setRows(newRows);
  //   setOpenDropdownIndex(null); // close after action
  // };

  // // Duplicate Item
  // const handleDuplicateItem = (rowIndex: number, count: number = 1) => {
  //   const newRows = [...rows];
  //   const baseRow = rows[rowIndex];

  //   for (let i = 0; i < count; i++) {
  //     newRows.splice(rowIndex + 1 + i, 0, { ...baseRow, id: Date.now() + i });
  //   }

  //   setRows(newRows);
  //   setOpenDropdownIndex(null);
  // };

  // const [myState, setState] = useState({
  //   title: "",
  //   description: "",
  //   websiteLink: "",
  //   price: "",
  //   salePrice: "",
  //   facebookProduct: "",
  //   condition: "",
  //   availability: "false",
  //   status: "",
  //   brand: "",
  //   content_id: "",
  //   currency: "",
  //   image: null,
  // });

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value, type } = e.target;

  //   // Special handling for checkbox
  //   if (type === "checkbox") {
  //     setState((prev) => ({
  //       ...prev,
  //       [name]: (e.target as HTMLInputElement).checked ? "true" : "false",
  //     }));
  //     return;
  //   }

  //   // Special handling for currency dropdown
  //   if (name === "currency") {
  //     const selected = currencies.find((c) => c.code === value);
  //     if (selected) setCurrency(selected);
  //   }

  //   setState((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [btnloading, setbtnLoading] = useState(false);

  const handleproductcreate = (productForm: Product[]) => {
    let hasError = false;
    setbtnLoading(true);
  const newErrors: { [key: string]: boolean } = {};

  productForm.forEach((product, pIndex) => {
    product.variants.forEach((variant, vIndex) => {
      const key = `${pIndex}-${vIndex}`;
      const imageKey = `${key}-images`;
      if (!variant.title || variant.title.trim() === "") {
        newErrors[`${pIndex}-${vIndex}`] = true;
        hasError = true;
      }
    if (!variant.images || variant.images.length === 0) {
        newErrors[imageKey] = true;
        hasError = true;
      }
      if (!variant.description || variant.description.trim() === "") {
        newErrors[`${pIndex}-${vIndex}-description`] = true;
        hasError = true;
      }
      if (!variant.url || variant.url.trim() === "") {
        newErrors[`${pIndex}-${vIndex}-url`] = true;
        hasError = true;
      }
    });
  });

  if (hasError) {
    setErrors(newErrors);
    return;
  }
    const formData = buildProductFormData(productForm);
const apiCall = getId
    ? VendorAPI.productUpdateAPI
    : VendorAPI.productCreateAPI;

      apiCall(formData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code == "200") {
          toast.success(responseData.apiStatus.message);
          setbtnLoading(false);
          navigate("/vendor/catalog/product/details");
        } else {
          toast.error(responseData.apiStatus.message);
          setbtnLoading(false);
        }
      })
      .catch((error: any) => {
        setbtnLoading(false);
        console.error("Error during product create:", error);
        toast.error("An error occurred while creating the product.");
      });
  };


//   const productGetApi = async (id: any) => {
//   try {
//     const responseData = await VendorAPI.productGetAPI(id);

//     if (responseData.apiStatus.code === '200') {
//       const catalog = responseData.responseData.catalogview;
//       const mainImgUrl = catalog.imgData?.mainImgUrl;
//       const imageUrls = catalog.imgData?.mainImgUrl || [];

//       let images: File[] = [];
// console.log(mainImgUrl,imageUrls,catalog,"mainImgUrl,imageUrls");
//       // Fetch mainImgUrl if present
//       if (mainImgUrl) {
//         try {
//           const response = await fetch(mainImgUrl, { mode: 'cors' });
//           if (!response.ok) {
//             console.error(`Image fetch failed for mainImgUrl:`, response.statusText);
//           } else {
//             const blob = await response.blob();
//             const fileName = mainImgUrl.split('/').pop() || 'file';
//             const file = new File([blob], fileName, { type: blob.type });
//             images.push(file);
//           }
//         } catch (error) {
//           console.error("Error fetching mainImgUrl:", error);
//         }
//       }

//       // Fetch other imageUrls
//       for (const url of imageUrls) {
//         try {
//           const response = await fetch(url, { mode: 'cors' });
//           if (!response.ok) {
//             console.error(`Image fetch failed for ${url}:`, response.statusText);
//             continue;
//           }
//           const blob = await response.blob();
//           const fileName = url.split('/').pop() || 'file';
//           const file = new File([blob], fileName, { type: blob.type });
//           images.push(file);
//         } catch (error) {
//           console.error("Error fetching image:", error);
//         }
//       }

//       const key = `0-0` as PreviewKey;

//       const previewData = images.map((file) => ({
//         url: URL.createObjectURL(file),
//         name: file.name,
//         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//         modifiedTime: new Date(file.lastModified).toLocaleString(),
//         type: file.type.includes("image") ? "image" as const : "video" as const,
//         file,
//       }));

//       setPreviewMap(prev => ({
//         ...prev,
//         [key]: previewData,
//       }));

//       // Build variant & product as you had before
//       const variant: Variant = {
//         variant_id: 1,
//         item_group_id: Number(catalog.item_group_id || 1),
//         retailer_id: "",
//         title: catalog.name || "",
//         currency: catalog.currency || "INR",
//         price: catalog.price || "",
//         sale_price: "",
//         sale_price_enabled: false,
//         availability: catalog.availability?.toLowerCase() === "in stock",
//         description: catalog.description || "",
//         brand: catalog.brand || "",
//         condition: catalog.condition?.toUpperCase() || "NEW",
//         url: catalog.link || "",
//         category: catalog.category || "",
//         catalog_id: catalog.catalog_id || "",
//         content_id: catalog.product_id || "",        
//         status: true,
//         images, // array of all images fetched
//         product_id: catalog.product_id || "",
//       };

//       const product: Product = {
//         item_group_id: variant.item_group_id,
//         variants: [variant],
//       };

//       setProductForm([product]);
//     }
//   } catch (error) {
//     console.error("Error during API call:", error);
//   }
// };

  

  // const handleproductcreate = () => {
  //   const formData = new FormData();

  //   // Sync derived states before sending
  //   // const finalState = {
  //   //   ...myState,
  //   //   price: myState.price, // from currency input state
  //   //   salePrice: checked ? myState.salePrice : "",
  //   //   currency: currency.code,
  //   //   catalogId: 750712011140271,
  //   //   facebookProduct:
  //   //     activeIdx !== null
  //   //       ? categories[activeIdx].name +
  //   //         (panelFlipped && subSearchTerm ? ` > ${subSearchTerm}` : "")
  //   //       : myState.facebookProduct,
  //   //   condition: catalogCondition,
  //   // };

  //   // formData.append("name", finalState.title);
  //   // formData.append("description", finalState.description);
  //   // formData.append("url", finalState.websiteLink);
  //   // formData.append("price", finalState.price);
  //   // formData.append("sale_price", finalState.salePrice);
  //   // formData.append("category", finalState.facebookProduct);
  //   // formData.append("catalog_id", String(1050629163946384));
  //   // formData.append("condition", "new");
  //   // formData.append(
  //   //   "availability",
  //   //   myState.availability === "true" ? "in stock" : "out of stock"
  //   // );
  //   // formData.append("brand", finalState.brand);
  //   // formData.append("retailer_id", finalState.content_id);
  //   // formData.append("currency", finalState.currency);

  //   // previewFiles.forEach((item) => {
  //   //   formData.append("image_url", item.file);
  //   // });

  //   VendorAPI.productCreateAPI(formData)
  //     .then((responseData: any) => {
  //       if (responseData.apiStatus.code === "200") {
  //         toast.success(responseData.apiStatus.message);
  //         navigate("/vendor/catalog/product/details");
  //       } else {
  //         toast.error(responseData.apiStatus.message);
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.error("Error during product create:", error);
  //       toast.error("An error occurred while creating the product.");
  //     });
  // };

const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    const imageUrl = '/catalog_management/api/uploads/catalog_product/main_image/68ad500d0ae576.07910597_nikon_d300_1.jpg';
    console.log('Fetching image from:', imageUrl);

    fetch(imageUrl)
      .then(res => {
        console.log('Fetch response:', res);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.blob();
      })
      .then(blob => {
        const localUrl = URL.createObjectURL(blob);
        console.log('Blob converted to local URL:', localUrl);
        setImgSrc(localUrl);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  }, []);
//  const productGetApi = async (id: any) => {
//   try {
//     const responseData = await VendorAPI.productGetAPI(id);

//     if (responseData.apiStatus.code === '200') {
//       const catalog = responseData.responseData.catalogview;
//       const fullUrl = catalog.imgData?.mainImgUrl;

//       let images: File[] = [];

//       // Fetch main image if present
//       if (fullUrl) {
//         try {
//           console.log("📡 Fetching main image:", fullUrl);

//           const response = await fetch(fullUrl, { mode: 'cors' });
//           console.log("🌐 Fetch response:", response);

//           if (!response.ok) {
//             console.error(`❌ Failed to fetch image: ${response.statusText}`);
//           } else {
//             const blob = await response.blob();
//             console.log("✅ Blob fetched:", blob);

//             const fileName = fullUrl.split('/').pop() || 'image.jpg';
//             const file = new File([blob], fileName, {
//               type: blob.type || 'image/jpeg',
//             });

//             console.log("✅ File created:", file);
//             images.push(file);
//           }
//         } catch (error) {
//           console.error("❌ Error fetching image:", error);
//         }
//       }

//       // Generate preview data
//       const previewData = images.map((file) => ({
//         url: URL.createObjectURL(file),
//         name: file.name,
//         size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
//         modifiedTime: new Date(file.lastModified).toLocaleString(),
//         type: file.type?.includes("image") ? "image" : "image", // fallback
//         file,
//       }));

//       const key = `0-0` as PreviewKey;

//       // ✅ Set preview
//       setPreviewMap((prev) => ({
//         ...prev,
//         [key]: previewData,
//       }));

//       console.log("🖼️ Preview data set:", previewData);

//       // ✅ Build and set product
//       const variant: Variant = {
//         variant_id: 1,
//         item_group_id: Number(catalog.item_group_id || 1),
//         retailer_id: "",
//         title: catalog.name || "",
//         currency: catalog.currency || "INR",
//         price: catalog.price || "",
//         sale_price:catalog.sale_price || "",
//         sale_price_enabled:catalog.sale_price?true: false,
//         availability: catalog.availability?.toLowerCase() === "in stock",
//         description: catalog.description || "",
//         brand: catalog.brand || "",
//         condition: catalog.condition?.toUpperCase() || "NEW",
//         url: catalog.link || "",
//         category: catalog.category || "",
//         catalog_id: catalog.catalog_id || "",
//         content_id: catalog.product_id || "",
//         status: true,
//         images,
//         product_id: catalog.product_id || "",
//       };

//       const product: Product = {
//         item_group_id: variant.item_group_id,
//         variants: [variant],
//       };

//       setProductForm([product]);

//       console.log("📦 Final product set:", product);
//     }
//   } catch (error) {
//     console.error("❌ Error during API call:", error);
//   }
// };

const productGetApi = async (id: any) => {
  try {
    const responseData = await VendorAPI.productGetAPI(id);

    if (responseData.apiStatus.code === '200') {
      const catalog = responseData.responseData.catalogview;
      const mainImgUrl = catalog.imgData?.mainImgUrl;
      const additionalImages = responseData.responseData.additionalImages || [];

      // Helper to fetch image URL and convert to File
      const fetchImageAsFile = async (url: string): Promise<File | null> => {
        try {
          const response = await fetch(url, { mode: 'cors' });
          if (!response.ok) {
            console.error(`Failed to fetch image from ${url}: ${response.statusText}`);
            return null;
          }
          const blob = await response.blob();
          const fileName = url.split('/').pop() || 'image.jpg';
          return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
        } catch (error) {
          console.error(`Error fetching image from ${url}`, error);
          return null;
        }
      };

      // Fetch all images sequentially (can also use Promise.all)
      const files: File[] = [];

      if (mainImgUrl) {
        const mainFile = await fetchImageAsFile(mainImgUrl);
        if (mainFile) files.push(mainFile);
      }

      for (const imgObj of additionalImages) {
        const file = await fetchImageAsFile(imgObj.image_url);
        if (file) files.push(file);
      }

      // Build variant with all images
      const variant: Variant = {
        variant_id: 1,
        item_group_id: catalog.item_group_id,
        retailer_id: "",
        title: catalog.name || "",
        currency: catalog.currency || "INR",
        price: catalog.price || "",
        sale_price: catalog.sale_price || "",
        sale_price_enabled: !!catalog.sale_price,
        availability: catalog.availability?.toLowerCase() === "in stock",
        description: catalog.description || "",
        brand: catalog.brand || "",
        condition: catalog.condition?.toUpperCase() || "NEW",
        url: catalog.link || "",
        category: catalog.category || "",
        catalog_id: catalog.catalog_id || "",
        content_id: catalog.product_id || "",
        status: true,
        images: files,
        product_id: catalog.product_id || "",
      };

      const product: Product = {
        item_group_id: variant.item_group_id,
        variants: [variant],
      };

      setProductForm([product]);

    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }
};
  const getBack = () => {
    navigate("/vendor/catalog/product/details", {
      state: { fromCreatePage: true },
    });
  };

  //

  interface Variant {
    variant_id: number;
    retailer_id: string;
    item_group_id: string;
    title: string;
    currency: string;
    price: string;
    sale_price: string;
    sale_price_enabled?: boolean;
    availability: boolean;
    description: string;
    brand: string;
    condition: string;
    url: string;
    category: string;
    catalog_id: string;
    status: boolean;
    content_id: string;
    images: File[];
    product_id?: string; // for edit case
  }

  interface Product {
    item_group_id: string;
    variants: Variant[];
  }

  const defaultVariant = (item_group_id: string, variant_id = 1): Variant => ({
    variant_id,
    item_group_id,
    retailer_id: "",
    title: "",
    currency: "INR",
    price: "",
    sale_price: "",
    sale_price_enabled: false,
    availability: true,
    description: "",
    brand: "",
    condition: "NEW",
    url: "",
    category: "",
    catalog_id: "",
    content_id: "",
    status: true,

    images: [],
  });
  const initialGroupId = uuidv4();
  const [productForm, setProductForm] = useState<Product[]>([
    {
      item_group_id: initialGroupId,
      variants: [defaultVariant(initialGroupId, 1)],
    },
  ]);
  const handleAddProduct = () => {
     const newGroupId = uuidv4(); 
    // const newGroupId = productForm.length + 1;
    setProductForm((prev) => [
      ...prev,
      {
        item_group_id: newGroupId,
        variants: [defaultVariant(newGroupId, 1)],
      },
    ]);
  };

  //  const handleAddVariant = (productIndex: number) => {
  //   setProductForm((prev) => {
  //     const updated = [...prev];
  //     const item = updated[productIndex];
  //     const nextVariantId = item.variants.length; // starts from 0,1,2...
  //     item.variants.push(defaultVariant(item.item_group_id, nextVariantId));
  //     return updated;
  //   });
  //   setOpenDropdownIndex(null);
  // };

  const handleAddVariant = (productIndex: number, vIndex: number) => {
    setProductForm((prev) => {
    //   const updated = [...prev];
    //   const product = updated[productIndex];

    //   const nextVariantId = product.variants.length + 1;

    //   // Use current counter as item_group_id for Add Variant phase
    //   const newVariant: Variant = {
    //     ...defaultVariant(addVariantGroupCounter.current, nextVariantId),
    //     item_group_id: addVariantGroupCounter.current,
    //   };

    //   product.variants.push(newVariant);

    //   return updated;
    // });
    // setOpenDropdownIndex(null);
     const updated = [...prev];
    const product = updated[productIndex];

    const nextVariantId = product.variants.length + 1;

    // Use the product's existing item_group_id
    const newVariant: Variant = {
      ...defaultVariant(product.item_group_id, nextVariantId),
      item_group_id: product.item_group_id,
    };

    product.variants.push(newVariant);

    return updated;
  });

  setOpenDropdownIndex(null);
  };

  // const handleVariantChange = (
  //   productIndex: number,
  //   variantIndex: number,
  //   field: keyof Variant,
  //   value: string | boolean | File[]
  // ) => {
  //   console.log(
  //     productIndex,
  //     variantIndex,
  //     field,
  //     value,
  //     "handleVariantChange func"
  //   );
  //   setProductForm((prev) => {
  //     const updated = [...prev];
  //     const variant = updated[productIndex].variants[variantIndex];

  //     if (field === "images" && Array.isArray(value)) {
  //       variant.images = [...variant.images, ...value];
  //     } else {
  //       (variant as any)[field] = value;
  //     }

  //     return updated;
  //   });
  // };

const handleVariantChange = (
  productIndex: number,
  variantIndex: number,
  field: keyof Variant,
  value: string | boolean | File[]
) => {
  console.log(productIndex, variantIndex, field, value, "handleVariantChange func");

  setProductForm((prev) => {
    return prev.map((product, pIdx) => {
      if (pIdx !== productIndex) return product;

      return {
        ...product,
        variants: product.variants.map((variant, vIdx) => {
          if (vIdx !== variantIndex) return variant;

          if (field === "images" && Array.isArray(value)) {
            return {
              ...variant,
              images: [...variant.images, ...value],
            };
          }

          return {
            ...variant,
            [field]: value,
          };
        }),
      };
    });
  });
};

  const toggleSalePriceEnabled = (pIndex: number, vIndex: number) => {
    const updatedForm = [...productForm];
    const variant = updatedForm[pIndex].variants[vIndex];

    variant.sale_price_enabled = !variant.sale_price_enabled;

    // Optionally clear the input when unchecked
    if (!variant.sale_price_enabled) {
      variant.sale_price = "";
    }

    setProductForm(updatedForm);
  };
  const handleDeleteImage = (
  productIndex: number,
  variantIndex: number,
  imageIndex: number
) => {
  setProductForm((prev) => {
    return prev.map((product, pIdx) => {
      if (pIdx !== productIndex) return product;
      return {
        ...product,
        variants: product.variants.map((variant, vIdx) => {
          if (vIdx !== variantIndex) return variant;
          return {
            ...variant,
            images: variant.images.filter((_, idx) => idx !== imageIndex),
          };
        }),
      };
    });
  });
};

 
  // const handleDuplicateToNewItemGroup = (variant: Variant) => {
  //   const newItemGroupId = 0; // always reset to 0 for duplicates

  //   const duplicatedVariant: Variant = {
  //     ...variant,
  //     variant_id: 1,
  //     item_group_id: newItemGroupId,
  //     images: [...variant.images],
  //   };

  //   setProductForm((prev) => [
  //     ...prev,
  //     {
  //       item_group_id: newItemGroupId,
  //       variants: [duplicatedVariant],
  //     },
  //   ]);
  // };

  const addVariantGroupCounter = useRef(1);

  const handleDuplicateToNewItemGroup = (
    productIndex: number,
    variant: Variant
  ) => {
    // const newItemGroupId = addVariantGroupCounter.current + 1; // Increment for each duplicate actio

    // const duplicatedVariant: Variant = {
    //   ...variant,
    //   variant_id: 1,
    //   item_group_id: newItemGroupId,
    //   images: [...variant.images],
    // };

    // const newProduct: Product = {
    //   item_group_id: newItemGroupId,
    //   variants: [duplicatedVariant],
    // };

    // // Reset "Add Variant phase" counter — next Add Variant should bump group id
    // addVariantGroupCounter.current += 1;

    // setProductForm((prev) => {
    //   const updated = [...prev];
    //   updated.splice(productIndex + 1, 0, newProduct);
    //   return updated;
    // });
  //   setProductForm((prev) => {
  //   // 🔍 Find the highest existing item_group_id
  //   const maxGroupId = prev.length > 0
  //     ? Math.max(...prev.map(p => p.item_group_id))
  //     : 0;

  //   // 🆕 Assign a new item_group_id
  //   const newItemGroupId = maxGroupId + 1;

  //   // ✅ Update the counter (optional, if you're still using it elsewhere)
  //   addVariantGroupCounter.current = newItemGroupId + 1;

  //   const duplicatedVariant: Variant = {
  //     ...variant,
  //     variant_id: 1, // Reset variant ID
  //     item_group_id: newItemGroupId,
  //     images: [...variant.images],
  //   };

  //   const newProduct: Product = {
  //     item_group_id: newItemGroupId,
  //     variants: [duplicatedVariant],
  //   };

  //   const updated = [...prev];
  //   updated.splice(productIndex + 1, 0, newProduct);

  //   return updated;
  // });
   const currentProductForm = [...productForm];

  // const maxGroupId = currentProductForm.length > 0
  //   ? Math.max(...currentProductForm.map(p => p.item_group_id))
  //   : 0;

  const newItemGroupId = uuidv4();
  const newVariantId = 1;

  const duplicatedImages = [...variant.images];
  const duplicatedVariant: Variant = {
    ...variant,
    variant_id: newVariantId,
    item_group_id: newItemGroupId,
    images: duplicatedImages,
  };

  const newProduct: Product = {
    item_group_id: newItemGroupId,
    variants: [duplicatedVariant],
  };
  const newPreviewKey: PreviewKey = `${newItemGroupId}-${newVariantId}`;
  const previews = duplicatedImages.map((file) => ({
    url: URL.createObjectURL(file),
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    modifiedTime: new Date(file.lastModified).toLocaleString(),
    type: file.type.startsWith("image") ? "image" : "video",
    file,
  }));

  
  const updatedForm = [...currentProductForm];
  updatedForm.splice(productIndex + 1, 0, newProduct);
  setProductForm(updatedForm);

  // ✅ Set preview images immediately
setPreviewMap((prevMap) => ({
    ...prevMap,
    [newPreviewKey]: previews,
  }));
  };

 
  const [isFocusedDescription, setIsFocusedDescription] = useState(false);

  console.log(productForm, "img");

  const buildProductFormData = (productForm: Product[]): FormData => {
    const formData = new FormData();

    let index = 0; // single counter for all variants

    productForm.forEach((product, pIndex) => {
      // formData.append(`products[${pIndex}][item_group_id]`, product.item_group_id.toString());
      product.variants.forEach((variant) => {
        // Generate random 10-digit retailer_id
        const randomRetailerId =getId ? variant.retailer_id : Math.floor(
          1000000000 + Math.random() * 9000000000
        ).toString();

        // Get catalog_id from localStorage (fallback if not found)
        const catalog_id = getId ? variant.catalog_id:localStorage.getItem("catalogId") || "";

        formData.append(`retailer_id[${index}]`, randomRetailerId);
        formData.append(
          `item_group_id[${index}]`,
          variant.item_group_id.toString()
        );
        formData.append(`name[${index}]`, variant.title);
        formData.append(`currency[${index}]`, variant.currency);
        formData.append(`price[${index}]`, String(variant.price));
        formData.append(`sale_price[${index}]`, String(variant.sale_price));
        formData.append(
          `availability[${index}]`,
          variant.availability ? "in stock" : "out of stock"
        );
        formData.append(`description[${index}]`, variant.description);
        formData.append(`brand[${index}]`, variant.brand);
        formData.append(`condition[${index}]`, variant.condition.toLowerCase());
        formData.append(`url[${index}]`, variant.url);
        formData.append(`category[${index}]`, variant.category);
        formData.append(`catalog_id[${index}]`, catalog_id);
        formData.append(`content_id[${index}]`, variant.content_id);
        if(getId && variant.product_id){
          formData.append(`product_id[${index}]`, variant.product_id);
        }
        // Use first image as image_url
        if (variant.images.length > 0) {
        // First image as thumbnail
        formData.append(`image_url[${index}]`, variant.images[0]);

        // Remaining images as additional_image_urls[index][i]
        if (variant.images.length > 1) {
        variant.images.slice(1).forEach((file, i) => {
          formData.append(`additional_image_urls[${index}][${i}]`, file);
        });}
      }


        index++;
      });
    });

    return formData;
  };


  const [deleteTarget, setDeleteTarget] = useState<{
  pIndex: number;
  vIndex: number;
} | null>(null);

  const handleDeleteVariant = (productIndex: number, variantIndex: number) => {
    setProductForm((prev) => {
      const updated = [...prev];
      const product = updated[productIndex];

      if (
        product &&
        product.variants &&
        product.variants.length > variantIndex
      ) {
        product.variants.splice(variantIndex, 1);
      }

      return updated;
    });
    setOpenDropdownIndex(null);
  };
const isSalePriceValid = (variant:any) => {
  const priceNum = parseFloat(variant.price);
  const salePriceNum = parseFloat(variant.sale_price);
  if (isNaN(priceNum) || isNaN(salePriceNum)) return true; // If not numbers yet, no error
  return salePriceNum < priceNum;
};

  const formData = buildProductFormData(productForm);

  formData.forEach((value, key) => {
    if (value instanceof File) {
      console.log(
        `${key}: [File] name=${value.name}, type=${value.type}, size=${value.size}`
      );
    } else {
      console.log(`${key}: ${value}`);
    }
  });
  return (
    <>
      <DashboardLayout>
        <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
          <TopNav />
          <div className="row vendor-breadcrumbs container-fluid py-1 px-3">
            <div className="col-md-6">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                  <li className="breadcrumb-item text-sm">
                    <Link
                      className="opacity-5 grayFont"
                      to={"/vendor/dashboard"}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item text-sm text-dark active"
                    aria-current="page"
                  >
                    Product
                  </li>
                </ol>
                <h6 className="text-start font-weight-bolder mb-0 grayFont">
                  {getId ? "Update Product" : "Create Product"}
                </h6>
              </nav>
            </div>
            <div className="col-md-6 text-end dropdown">
              <button className="vendor-crt-btn" onClick={getBack}>
                <span>
                  <i className="fa-solid fa-chevron-left"></i> Back
                </span>
              </button>
            </div>
          </div>

          <div className="vendor-maincontent container-fluid py-4">
            <div className="row">
              <div className="col-12">
                <div className="card mb-4">
                  <div className="card-body px-0 pt-0 pb-2">
                    <div
                      className="table-responsive p-0 table-scroll-wrapper"
                      ref={tableRef}
                    >
                      {/* {
                                        loading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                                                <FadeLoader color="#36d7b7" />
                                            </div>
                                        ) : flowListData.length === 0 ? (
                                            <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "40px" }}><span>No data found</span></p>
                                        ) : (
                                            <> */}
                      <table className="table align-items-center justify-content-center mb-0">
                        <thead>
                          <tr className="vendor-table-mainhead">
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder sticky-col-1">
                              Actions
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder ps-2 sticky-col-2">
                              Images & Videos
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Title
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Description
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Website link
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Price
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Sale Price
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Facebook product category (Optional)
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Condition
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder text-center opacity-7 ps-3">
                              Availability
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder text-center opacity-7 ps-3">
                              Status
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Brand (Optional)
                            </th>
                            <th className="text-uppercase vendor-table-head text-xxs font-weight-bolder opacity-7 ps-3">
                              Content ID (Optional)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-start">
                          {productForm.map((product, pIndex) =>
                            product.variants.map((variant, vIndex) => {
                              const selectedCurrency =
                                currencies.find(
                                  (cur) => cur.code === variant.currency
                                ) || currencies[0];
                                const isLastRow =
        // pIndex === productForm.length - 1 &&
        vIndex === product.variants.length - 1;
        const showAddButtonRow =
        product.variants.length > 1 && isLastRow;

        const imgKey = `${pIndex}-${vIndex}`as `${number}-${number}`;
console.log("img key",imgKey);
const previews = previewMap[imgKey] || [];
                              return (
                                  <React.Fragment key={`${product.item_group_id}-${variant.variant_id}`}>
                                <tr
                                  key={`${product.item_group_id}-${variant.variant_id}`}
                                  className={showAddButtonRow || product.variants.length >1? 'no-bottom-border' : ''}
                                >
                                  {/* DELETE BUTTON & DROPDOWN */}

                                  {/* ADD Duplicate  */}
                                  <td
                                    className="sticky-col-1"
                                    style={{ zIndex: 25 }}
                                  >
                                    <div className="d-flex justify-content-center px-3">
                                      <button
                                        className="btn-3 vendorbtn-danger"
                                        type="button"
                                        onClick={() => setDeleteTarget({ pIndex, vIndex })}
                                        data-bs-target="#vendordelete"
                                        data-bs-toggle="modal"
                                      >
                                        <i className="fa-regular fa-trash-can"></i>
                                      </button>
                                      <div className="catalog-dropdown-container">
                                        <div
                                          className="catalog-dropdown"
                                          ref={(el) => {
                                            dropdownTriggerRefs.current[
                                              `${pIndex}-${vIndex}`
                                            ] = el;
                                          }}
                                          onClick={() =>
                                            toggleDropdown(
                                              `${pIndex}-${vIndex}`
                                            )
                                          }
                                          // onClick={(e) => toggleDropdown(pIndex, e)}
                                        >
                                          <i className="fa-solid fa-clone "></i>
                                          <i
                                            className={`catalog-chevron fas fa-angle-down ${
                                              openDropdownIndex === pIndex
                                                ? "catalog-rotate-dropdown-arrow"
                                                : ""
                                            }`}
                                          ></i>
                                        </div>

                                        {openDropdownAction ===
                                          `${pIndex}-${vIndex}` &&
                                          tableRef.current &&
                                          ReactDOM.createPortal(
                                            <div
                                              ref={actionDDref}
                                              className="catalog-dropdown-menu"
                                              style={{
                                                position: "fixed",
                                                top: `${dropdownPosition.top}px`,
                                                left: `${dropdownPosition.left}px`,
                                                zIndex: 9999,
                                              }}
                                            >
                                              {[
                                                {
                                                  iconClass:
                                                    "fa-regular fa-square-plus",
                                                  label: "Add Variant",
                                                  action: () =>
                                                {handleAddVariant(
                                                  pIndex,
                                                  vIndex
                                                );toggleDropdown(
                                          `${pIndex}-${vIndex}`
                                        )}
                                                },
                                                {
                                                  iconClass:
                                                    "fa-regular fa-clone",
                                                  label: "Duplicate Item",
                                                  action: () =>{
                                                    handleDuplicateToNewItemGroup(
                                                      pIndex,
                                                      variant
                                                    );toggleDropdown(
                                          `${pIndex}-${vIndex}`
                                        )}
                                                },
                                              ].map((item, idx) => (
                                                <span
                                                  key={idx}
                                                  onClick={item.action}
                                                  className="text-start"
                                                >
                                                  <i
                                                    className={item.iconClass}
                                                    style={{
                                                      marginRight: "8px",
                                                    }}
                                                  ></i>
                                                  {item.label}
                                                </span>
                                              ))}
                                            </div>,
                                            document.body
                                          )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Images */}
                                  <td
                                    className={`text-center align-middle  text-sm sticky-col-2 ${
                                      (variant.images.length ) === 0 &&
                                      "text-center"
                                    }`}
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                    style={{ cursor: "pointer", zIndex: 25,height: "60px",padding: 0 }}
                                    // onClick={() => {
                                    //   setSelectedIndices({ pIndex, vIndex });setbtnLoading(false);
                                    //   setErrors((prev) => ({
                                    //     ...prev,
                                    //     [`${pIndex}-${vIndex}-images`]: false,
                                    //   }));
                                    //   const imgs = variant.images.map(
                                    //     (file) => {
                                    //       const url = URL.createObjectURL(file);
                                    //       return {
                                    //         url,
                                    //         name: file.name,
                                    //         size: `${(
                                    //           file.size /
                                    //           1024 /
                                    //           1024
                                    //         ).toFixed(2)} MB`,
                                    //         modifiedTime: new Date(
                                    //           file.lastModified
                                    //         ).toLocaleString(),
                                    //         type: file.type.includes("image")
                                    //           ? ("image" as const)
                                    //           : ("video" as const),
                                    //         file,
                                    //       };
                                    //     }
                                    //   );
                                    //   setPreviewFiles(imgs);
                                    // }}
                                    onClick={() => {
  setSelectedIndices({ pIndex, vIndex });
  setbtnLoading(false);
  setErrors((prev) => ({
    ...prev,
    [`${pIndex}-${vIndex}-images`]: false,
  }));

  const key = `${pIndex}-${vIndex}` as PreviewKey;

  const imgs = variant.images.map((file) => ({
    url: URL.createObjectURL(file),
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    modifiedTime: new Date(file.lastModified).toLocaleString(),
    type: file.type.startsWith("image") ? "image" : "video",
    file,
  }));

  setPreviewMap((prev) => ({ ...prev, [key]: imgs }));
}}

                                  >
                                    
                                    {variant.images.length === 0 ? (
                                      <>
                                      <svg
                                        version="1.0"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="33px"
                                        height="33px"
                                        viewBox="0 0 512.000000 512.000000"
                                        preserveAspectRatio="xMidYMid meet"
                                      >
                                        {" "}
                                        <g
                                          transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                          fill="#000000"
                                          stroke="none"
                                        >
                                          {" "}
                                          <path d="M595 4820 c-220 -30 -422 -174 -519 -371 -82 -168 -77 -54 -74 -1804 l3 -1550 27 -80 c61 -179 187 -329 339 -404 168 -82 30 -75 1633 -79 l1428 -3 62 -43 c519 -369 1241 -182 1521 393 159 326 131 722 -72 1029 -144 217 -422 392 -695 437 l-37 6 -3 962 -3 962 -26 72 c-85 232 -243 385 -469 455 l-75 23 -1490 1 c-820 1 -1517 -2 -1550 -6z m3042 -275 c145 -43 262 -162 299 -304 12 -46 14 -192 14 -840 l0 -785 -372 371 c-362 360 -374 372 -419 378 -33 5 -55 3 -75 -8 -16 -9 -276 -263 -579 -566 l-550 -551 -385 384 c-357 356 -388 385 -427 391 -28 4 -50 2 -70 -8 -15 -9 -205 -193 -420 -410 l-393 -394 0 991 c0 1074 -1 1048 54 1147 49 88 156 172 261 205 32 10 355 13 1526 13 1294 1 1492 -1 1536 -14z m131 -2236 c-103 -32 -167 -64 -288 -144 -315 -208 -492 -626 -425 -1006 17 -101 75 -275 110 -335 l26 -44 -1263 3 c-892 2 -1279 7 -1316 15 -168 36 -294 155 -337 317 -12 47 -15 124 -15 385 l0 325 426 433 c234 237 431 432 437 432 7 0 181 -169 387 -375 400 -400 406 -405 480 -385 28 8 149 124 590 565 l555 555 358 -358 357 -357 -82 -26z m425 -224 c189 -21 395 -146 512 -310 224 -315 184 -733 -94 -1005 -143 -139 -322 -210 -531 -210 -216 0 -405 82 -561 244 -137 141 -196 281 -206 486 -11 234 58 409 227 581 127 129 272 199 450 219 74 8 87 7 203 -5z" />{" "}
                                          <path d="M1861 3700 c-106 -22 -203 -99 -249 -198 -23 -49 -27 -70 -27 -147 0 -78 4 -97 28 -147 60 -122 164 -190 303 -196 125 -6 217 37 294 136 64 83 86 205 55 308 -50 170 -231 279 -404 244z" />{" "}
                                          <path d="M4030 1879 c-30 -12 -346 -323 -366 -361 -46 -87 14 -188 111 -188 47 0 69 12 128 68l47 46 0 -288 c0 -272 1 -291 20 -321 39 -64 125 -81 184 -38 53 38 56 58 56 364 l0 283 54 -53 c46 -46 61 -54 101 -59 107 -12 174 81 131 181 -17 40 -331 352 -369 366 -34 13 -63 13 -97 0z" />{" "}
                                        </g>{" "}
                                      </svg> 
                                      <span>
                                        {errors[`${pIndex}-${vIndex}-images`] && (
                                          <i className="fa-solid fa-triangle-exclamation text-danger text-sm"></i>
                                        )}
                                      </span>
                                      </>
                                    ) : (
                                      <>
                                        {/* <div
                                          style={{
                                            position: "relative",
                                            // width: `${40 + (variant.images.length - 1) * 8}px`, // dynamic width
                                            width: "100%",
                                            height: "40px",
                                            // maxWidth: "100px",
                                            display: "inline-block",
                                            overflow: "hidden",
                                          }}
                                        >
                                          {
                                          variant.images.slice(0, 4).map((file, idx) => {
          const url = file.url;

                                            //  const preview = previewFiles[idx];
                                            //  const url = variant.images?.url;
                                              const isImage =
                                                file.type.includes("image");

                                              return isImage ? (
                                                <img
                                                  key={idx}
                                                  src={url}
                                                  alt="preview"
                                                  style={{
                                                    position: "absolute",
                                                    left: `${idx * 18}px`,
                                                    top: `${
                                                      Math.min(idx, 3) * 2
                                                    }px`,
                                                    zIndex:
                                                      variant.images.length -
                                                      idx,
                                                    background: "#fff",
                                                    width: "40px",
                                                    height: "40px",
                                                    marginLeft: "2px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ccc",
                                                    boxShadow:
                                                      "0 1px 4px rgba(0,0,0,0.2)",
                                                    transition:
                                                      "transform 0.2s ease, z-index 0.2s ease",
                                                    cursor: "pointer",
                                                  }}
                                                  onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform =
                                                      "scale(1.1)";
                                                    e.currentTarget.style.zIndex =
                                                      "999";
                                                  }}
                                                  onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform =
                                                      "scale(1)";
                                                    e.currentTarget.style.zIndex =
                                                      (
                                                        variant.images.length -
                                                        idx
                                                      ).toString();
                                                  }}
                                                />
                                              ) : (
                                                <video
                                                  key={idx}
                                                  src={url}
                                                  style={{
                                                    position: "absolute",
                                                    left: `${idx * 18}px`,
                                                    top: `${
                                                      Math.min(idx, 3) * 2
                                                    }px`,
                                                    zIndex:
                                                      variant.images.length -
                                                      idx,
                                                    background: "#fff",
                                                     marginLeft: "2px",
                                                    width: "40px",
                                                    height: "40px",
                                                    objectFit: "cover",
                                                    borderRadius: "4px",
                                                    border: "1px solid #ccc",
                                                    boxShadow:
                                                      "0 1px 4px rgba(0,0,0,0.2)",
                                                    transition:
                                                      "transform 0.2s ease, z-index 0.2s ease",
                                                    cursor: "pointer",
                                                  }}
                                                  onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform =
                                                      "scale(1.1)";
                                                    e.currentTarget.style.zIndex =
                                                      "999";
                                                  }}
                                                  onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform =
                                                      "scale(1)";
                                                    e.currentTarget.style.zIndex =
                                                      (
                                                        variant.images.length -
                                                        idx
                                                      ).toString();
                                                  }}
                                                  muted
                                                  // autoPlay
                                                  loop
                                                  playsInline
                                                />
                                              );
                                            })}

                                          {variant.images.length > 4 && (
                                            <div
                                              style={{
                                                position: "absolute",
                                                left: `${4 * 20}px`,
                                                top: "0px",
                                                zIndex: 0,
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "4px",
                                                background: "#eee",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "14px",
                                                border: "1px solid #ccc",
                                                boxShadow:
                                                  "0 1px 4px rgba(0,0,0,0.2)",
                                              }}
                                            >
                                              +{variant.images.length - 4}
                                            </div>
                                          )}
                                        </div> */}
                                        <VariantImagesPreview variant={variant} />
                                      </>
                                    )}
                                  </td>
                                  {/* title */}
                                  <td
                                    className=" align-middle col-md-12 text-start text-sm"
                                    catalogInput-tdwidth
                                  >
                                    <div className="w-100">
                                      <div className="">
                                        <div className="vendor-create-container w-100">
                                          <input
                                            autoComplete="off"
                                            type="text"
                                            name="title"
                                            id="vendor-crt-input"
                                            className={`vendor-crt-input catalogInput-Width 
                                              ${errors[`${pIndex}-${vIndex}`] ? "error" : ""}`}
                                            placeholder=" "
                                            value={variant.title}
                                            onChange={(e) =>
                                              {handleVariantChange(
                                                pIndex,
                                                vIndex,
                                                "title",
                                                e.target.value
                                              );setbtnLoading(false);
                                            setErrors((prev) => ({
                                            ...prev,
                                            [`${pIndex}-${vIndex}`]: false,
                                          }));}
                                            }
                                          />
                                          <label
                                            htmlFor="vendor-crt-input"
                                            className="vendor-crt-label"
                                          >
                                            <i className="fa-brands fa-battle-net"></i>{" "}
                                            Title
                                          </label>
                                        </div>
                                        {/* {errors[`${pIndex}-${vIndex}`] && (
                                          <div className="text-danger error-message-required">Title is required</div>
                                        )} */}
                                      </div>
                                    </div>
                                    </td>

                                  {/* Description */}
                                  <td className="align-middle col-md-12 text-start text-sm catalogInput-tdwidth">
                                    <div className="">
                                      <div
                                        className="description-wrapper"
                                        style={{ position: "relative" }}
                                      >
                                        {/* Active textarea */}
                                        <textarea
                                          className={`mt-1 active-textarea vendor-crt-input ${errors[`${pIndex}-${vIndex}-description`] ? "error" : ""}`}
                                          placeholder="Describe the features and benefits"
                                          name="description"
                                          value={variant.description}
                                          onChange={(e) =>
                                            {handleVariantChange(
                                              pIndex,
                                              vIndex,
                                              "description",
                                              e.target.value
                                            );setbtnLoading(false);
                                          setErrors((prev) => ({
                                            ...prev,
                                            [`${pIndex}-${vIndex}-description`]: false,
                                          }));}
                                          }
                                          onFocus={(e) => {
                                            e.currentTarget.style.height =
                                              "150px"; // expand on focus
                                            e.currentTarget.style.zIndex = "2"; // bring above others
                                            e.currentTarget.style.overflowY =
                                              "auto"; // enable scroll
                                          }}
                                          onBlur={(e) => {
                                            e.currentTarget.style.height =
                                              "40px"; // shrink back
                                            e.currentTarget.style.zIndex = "1"; // reset
                                            e.currentTarget.style.overflowY =
                                              "hidden"; // hide scroll in compact mode
                                          }}
                                          maxLength={maxChars}
                                          style={{
                                            width: "100%",
                                            height: "40px", // compact size
                                            transition: "all 0.3s ease",
                                            borderRadius: "10px",
                                            border: "1px solid #ccc",
                                            padding: "10px",
                                            resize: "none",
                                            position: "relative",
                                            zIndex: 1,
                                            background: "white",
                                            overflowY: "hidden",
                                            fontSize: "14px", // default no scroll
                                          }}
                                        />

                                        {/* Character counter */}
                                        <span
                                          style={{
                                            position: "absolute",
                                            bottom: "5px",
                                            right: "10px",
                                            fontSize: "10px",
                                            color: "#666",
                                            zIndex: 3,
                                          }}
                                        >
                                          {variant.description?.length || 0}/
                                          {maxChars}
                                        </span>
                                      </div>
                                      {/* {errors[`${pIndex}-${vIndex}`] && (
                                          <div className="text-danger error-message-required">Description is required</div>
                                        )} */}
                                    </div>
                                  </td>

                                  {/* URL */}
                                  <td className=" align-middle col-md-12 text-start text-sm catalogInput-tdwidth ">
                                    <div className="w-100">
                                      <div className="">
                                        <div className="vendor-create-container w-100">
                                          <input
                                            autoComplete="off"
                                            type="text"
                                            name="websiteLink"
                                            value={variant.url}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              handleVariantChange(pIndex, vIndex, "url", value);
                                              setbtnLoading(false);

                                              const isValid = urlRegex.test(value);
                                              setErrors((prev) => ({
                                                ...prev,
                                                [`${pIndex}-${vIndex}-url`]: !isValid,
                                              }));
                                            }}
                                            id="vendor-crt-input"
                                            className={`vendor-crt-input catalogInput-Width 
                                              ${errors[`${pIndex}-${vIndex}-url`] ? "error" : ""}`}
                                            placeholder=" "
                                            required
                                          />
                                          
                                          <label
                                            htmlFor="vendor-crt-input"
                                            className="vendor-crt-label"
                                          >
                                            <i className="fa-solid fa-globe"></i>{" "}
                                            Website link
                                          </label>
                                        </div>
                                        {errors[`${pIndex}-${vIndex}-url`] && (
                                          <small className="text-danger">Please enter a valid website link.</small>
                                        )}
                                      </div>
                                    </div>
                                  </td>

                                  {/* Currency */}
                                  <td
                                    key={`${pIndex}-${vIndex}`}
                                    className="catalogInput-tdwidth"
                                  >
                                    <div className={`wrapper catalogCurrency-cnt`}>
                                      <form className="form-inline">
                                        <div className={`input-group ${errors[`${pIndex}-${vIndex}`] ? "error" : ""}`}>
                                          <div className="currency-addon">
                                            <select
                                              style={{
                                                outline: "none",
                                                boxShadow: "none",
                                                border: "none",
                                              }}
                                              className="currency-selector"
                                              name="currency"
                                              value={variant.currency}
                                              onChange={(e) =>
                                                {handleVariantChange(
                                                  pIndex,
                                                  vIndex,
                                                  "currency",
                                                  e.target.value
                                                );
                                              setErrors((prev) => ({
                                            ...prev,
                                            [`${pIndex}-${vIndex}`]: false,
                                          }))}
                                              }
                                            >
                                              {currencies.map((cur) => (
                                                <option
                                                  key={cur.code}
                                                  value={cur.code}
                                                  data-symbol={cur.symbol}
                                                  data-placeholder={
                                                    cur.placeholder
                                                  }
                                                >
                                                  {cur.code}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <div className="currency-symbol">
                                            {selectedCurrency.symbol}
                                          </div>
                                          <input
                                            style={{ boxShadow: "none" }}
                                            type="text"
                                            className="form-control catalog-currencyInpt currency-amount px-2"
                                            placeholder={
                                              selectedCurrency.placeholder
                                            }
                                            name="price"
                                            value={variant.price}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                pIndex,
                                                vIndex,
                                                "price",
                                                e.target.value
                                              )
                                            }
                                          />
                                        </div>
                                      </form>
                                    </div>
                                  </td>

                                  {/*sale_price  */}
                                  <td>
                                    <div
                                      className={`position-relative custom-amount-box catalogCurrency-cnt
                                        ${variant.sale_price_enabled ? "checked" : ""}
                                        ${variant.sale_price_enabled && !isSalePriceValid(variant) ? "error" : ""}
                                      `}
                                      >
                                      <div
                                        className={`checkbox-box ${
                                          variant.sale_price_enabled
                                            ? "checked"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          toggleSalePriceEnabled(pIndex, vIndex)
                                        }
                                      >
                                        {variant.sale_price_enabled && (
                                          <svg
                                            version="1.0"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14px"
                                            height="14px"
                                            viewBox="0 0 512.000000 512.000000"
                                            preserveAspectRatio="xMidYMid meet"
                                          >
                                            <g
                                              transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                              stroke="none"
                                            >
                                              <path
                                                d="M4805 4281 c-1007 -372 -2093 -1036 -3085 -1884 -103 -88 -138 -113
                                                            -146 -104 -7 7 -136 198 -288 424 -153 227 -286 418 -297 424 -28 15 -31 13
                                                            -474 -369 -290 -249 -381 -333 -383 -352 -2 -21 118 -156 732 -822 405 -437
                                                            743 -799 752 -802 28 -11 56 17 118 115 239 378 626 898 916 1229 514 587
                                                            1046 1073 2100 1917 252 201 269 222 218 257 -12 9 -25 16 -28 16 -3 -1 -63
                                                            -22 -135 -49z"
                                              />
                                            </g>
                                          </svg>
                                        )}
                                      </div>
                                      <input
                                        type="text"
                                        disabled={!variant.sale_price_enabled}
                                        name="sale_price"
                                        className={`amount-input`}
                                        value={variant.sale_price}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            pIndex,
                                            vIndex,
                                            "sale_price",
                                            e.target.value
                                          )
                                        }
                                      />
                                      <span
                                        className="currency-symbol position-absolute border-0"
                                        style={{ left: "42px" }}
                                      >
                                        {selectedCurrency.symbol}
                                      </span>
                                    </div>
                                  </td>

                                  {/* Cateory */}
                                  <td
                                    className="text-center align-middle vendor-login-td"
                                    style={{ position: "relative", zIndex: 1 }}
                                  >
                                    <div
                                      className="dropdown-container "
                                      ref={(el) => {
                                        categTriggerRefs.current[
                                          `${pIndex}-${vIndex}`
                                        ] = el;
                                      }}
                                      style={{
                                        width: 350,
                                        position: "relative",
                                      }}
                                    >
                                      <input
                                        className="vendor-crt-input loginfilled-frame-username"
                                        id="vendor-crt-input"
                                        type="text"
                                        placeholder="Select Categorie"
                                        readOnly
                                        value={
                                          productForm[pIndex].variants[vIndex]
                                            .category || ""
                                        }
                                        onClick={() => {
                                          handleInputClickCat(pIndex, vIndex);
                                        }}
                                      />
                                      <span
                                        className={`dropdown-chevron${
                                          openCategKey === `${pIndex}-${vIndex}` ? " open" : ""
                                        }`}
                                        aria-hidden="true"
                                      >
                                        &#9662;
                                      </span>
                                      {openCategKey === `${pIndex}-${vIndex}` &&
                                        ReactDOM.createPortal(
                                          <div
                                            className={`dropdown-menu-wrapper open`}
                                            tabIndex={-1}
                                            ref={categDropdownRef} // 👈 ADD THIS
                                            style={{
                                              position: "absolute",
                                              top: categDropdownPos.top,
                                              left: categDropdownPos.left,
                                              width: categDropdownPos.width,
                                              zIndex: 20,
                                            }}
                                          >
                                            <div className="panel-flip">
                                              <div
                                                className={`inner-flip${
                                                  panelFlipped
                                                    ? " show-sub"
                                                    : ""
                                                }`}
                                              >
                                                <div className="menu-panel">
                                                  <input
                                                    className="search-internal"
                                                    type="text"
                                                    placeholder="Search"
                                                    value={searchTerm}
                                                    onChange={(e) =>
                                                      setSearchTerm(
                                                        e.target.value
                                                      )
                                                    }
                                                    ref={searchInputRef}
                                                    autoFocus={
                                                      open && !panelFlipped
                                                    }
                                                    onKeyDown={(e) => {
                                                      if (
                                                        (
                                                          e as React.KeyboardEvent
                                                        ).key === "Escape"
                                                      )
                                                        setOpen(false);
                                                    }}
                                                  />
                                                  <ul className="menu-list">
                                                    {filteredCategories.length ===
                                                    0 ? (
                                                      <li
                                                        style={{
                                                          color: "#b0b3bb",
                                                          fontStyle: "italic",
                                                        }}
                                                      >
                                                        No categories found
                                                      </li>
                                                    ) : (
                                                      filteredCategories.map(
                                                        (cat, i) => {
                                                          const realIdx =
                                                            categories.findIndex(
                                                              (c) =>
                                                                c.name ===
                                                                cat.name
                                                            );
                                                          return (
                                                            <li
                                                              key={cat.name}
                                                              className={
                                                                activeIdx ===
                                                                realIdx
                                                                  ? "active"
                                                                  : ""
                                                              }
                                                            >
                                                              <span
                                                                className="cat-name"
                                                                onClick={() => {
                                                                  handleCategoryClick(
                                                                    realIdx
                                                                  );
                                                                }}
                                                              >
                                                                {cat.name}
                                                              </span>
                                                              <span className="arrow">
                                                                &#8250;
                                                              </span>
                                                            </li>
                                                          );
                                                        }
                                                      )
                                                    )}
                                                  </ul>
                                                </div>
                                                <div className="submenu-panel">
                                                  <div
                                                    className="back-row"
                                                    tabIndex={0}
                                                    onClick={handleBack}
                                                  >
                                                    <span className="back-arrow">
                                                      &#8249;
                                                    </span>
                                                    <span id="catTitle">
                                                      {activeIdx !== null
                                                        ? categories[activeIdx]
                                                            .name
                                                        : ""}
                                                    </span>
                                                  </div>
                                                  <input
                                                    className="search-internal"
                                                    type="text"
                                                    placeholder="Search Subcategories"
                                                    style={{
                                                      marginTop: "8px",
                                                      marginBottom: "4px",
                                                    }}
                                                    value={subSearchTerm}
                                                    onChange={(e) =>
                                                      setSubSearchTerm(
                                                        e.target.value
                                                      )
                                                    }
                                                    autoFocus={panelFlipped}
                                                    onKeyDown={(e) => {
                                                      if (
                                                        (
                                                          e as React.KeyboardEvent
                                                        ).key === "Escape"
                                                      )
                                                        setOpen(false);
                                                    }}
                                                  />
                                                  <ul className="submenu-list">
                                                    {panelFlipped &&
                                                      filteredSubs.length ===
                                                        0 && (
                                                        <li
                                                          style={{
                                                            color: "#b0b3bb",
                                                            fontStyle: "italic",
                                                          }}
                                                        >
                                                          No subcategories found
                                                        </li>
                                                      )}
                                                    {panelFlipped &&
                                                      filteredSubs.map(
                                                        (sub) => (
                                                          <li
                                                            key={sub}
                                                            onClick={() => {
                                                              handleVariantChange(
                                                                pIndex,
                                                                vIndex,
                                                                "category",
                                                                sub
                                                              );
                                                              setOpen(false);
                                                              setOpenCategKey(
                                                                null
                                                              );
                                                              setPanelFlipped(
                                                                false
                                                              );
                                                              setActiveIdx(
                                                                null
                                                              );
                                                            }}
                                                          >
                                                            {sub}
                                                          </li>
                                                        )
                                                      )}
                                                  </ul>
                                                </div>
                                              </div>
                                            </div>
                                          </div>,
                                          document.body
                                        )}
                                    </div>
                                  </td>

                                  {/* Condition Dropdown */}
                                  <td
                                    className="align-middle col-md-12 text-start text-sm catalogInput-tdwidth mt-2"
                                    style={{
                                      minWidth: 210,
                                      position: "relative",
                                    }}
                                  >
                                    <div className="custom-condition-dropdown-wrap ">
                                      <div
                                        className={`vendor-crt-input catalogInput-Width custom-condition-field${
                                          dropdownOpen ? " open" : ""
                                        }`}
                                        // ref={condBtnRef}
                                        ref={(el) => {
                                          condBtnRefs.current[
                                            `${pIndex}-${vIndex}`
                                          ] = el;
                                          if (
                                            openDropdownKey ===
                                            `${pIndex}-${vIndex}`
                                          ) {
                                            dropdownTriggerRef.current = el;
                                          }
                                        }}
                                        tabIndex={0}
                                        onClick={() =>
                                          openDropdown(pIndex, vIndex)
                                        }
                                        // onBlur={() => setTimeout(() => setOpenDropdownKey(null), 110)}
                                        role="button"
                                        aria-haspopup="listbox"
                                        aria-expanded={
                                          openDropdownKey ===
                                          `${pIndex}-${vIndex}`
                                        }
                                        // onClick={() => {
                                        //   if (
                                        //     !dropdownOpen &&
                                        //     condBtnRef.current
                                        //   ) {
                                        //     const rect =
                                        //       condBtnRef.current.getBoundingClientRect();
                                        //     setCondDropdownPos({
                                        //       top: rect.bottom + window.scrollY,
                                        //       left: rect.left + window.scrollX,
                                        //       width: rect.width,
                                        //     });
                                        //   }
                                        //   setDropdownOpen((o) => !o);
                                        // }}
                                        // onBlur={() =>
                                        //   setTimeout(
                                        //     () => setDropdownOpen(false),
                                        //     110
                                        //   )
                                        // }
                                        // role="button"
                                        // aria-haspopup="listbox"
                                        // aria-expanded={dropdownOpen}
                                      >
                                        {productForm[pIndex].variants[vIndex]
                                          .condition ? (
                                          <span>
                                            {
                                              productForm[pIndex].variants[
                                                vIndex
                                              ].condition
                                            }
                                          </span>
                                        ) : (
                                          <span className="custom-condition-placeholder vendor-create-container w-100">
                                            Select condition
                                          </span>
                                        )}
                                        <span
                                          className={`custom-condition-chevron${
                                            dropdownOpen ? " active" : ""
                                          }`}
                                        >
                                          &#9662;
                                        </span>
                                      </div>
                                      {openDropdownKey ===
                                        `${pIndex}-${vIndex}` &&
                                        ReactDOM.createPortal(
                                          <div
                                            className="custom-condition-list-pop"
                                            role="listbox"
                                            style={{
                                              position: "absolute",
                                              top: condDropdownPos.top,
                                              left: condDropdownPos.left,
                                              width: condDropdownPos.width,
                                              zIndex: 3000,
                                            }}
                                          >
                                            <ul className="custom-condition-list">
                                              {catConditionDrop.length === 0 ? (
                                                <li
                                                  className="custom-condition-item"
                                                  style={{
                                                    color: "#b1bac9",
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  No data found
                                                </li>
                                              ) : (
                                                catConditionDrop.map(
                                                  (dropdownValue) => (
                                                    <li
                                                      key={dropdownValue.value}
                                                      className={`custom-condition-item${
                                                        productForm[pIndex]
                                                          .variants[vIndex]
                                                          .condition ===
                                                        dropdownValue.value
                                                          ? " selected"
                                                          : ""
                                                      }`}
                                                      onClick={(e) => {
                                                        handleVariantChange(
                                                          pIndex,
                                                          vIndex,
                                                          "condition",
                                                          dropdownValue.value
                                                        );
                                                        setOpenDropdownKey(
                                                          null
                                                        );
                                                      }}
                                                      role="option"
                                                      aria-selected={
                                                        productForm[pIndex]
                                                          .variants[vIndex]
                                                          .condition ===
                                                        dropdownValue.value
                                                      }
                                                    >
                                                      {dropdownValue.label}
                                                    </li>
                                                  )
                                                )
                                              )}
                                            </ul>
                                          </div>,
                                          document.body
                                        )}
                                    </div>
                                  </td>

                                  {/* Availabitlity */}
                                  <td className="text-center align-middle vendor-login-td">
                                    <div className="form-check form-switch ms-1 mt-1 is-filled">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="flexSwitchCheckDefault"
                                        name="availability"
                                        checked={variant.availability}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            pIndex,
                                            vIndex,
                                            "availability",
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <span className="text-sm fs-6">
                                        In Stock
                                      </span>
                                    </div>
                                  </td>

                                  {/* Satus */}
                                  <td className="text-center align-middle vendor-login-td">
                                    <div className="form-check form-switch mt-1 ms-1 is-filled">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="status"
                                        checked={variant.status}
                                        onChange={(e) =>
                                          handleVariantChange(
                                            pIndex,
                                            vIndex,
                                            "status",
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </div>
                                  </td>

                                  {/* Brand */}
                                  <td className=" align-middle col-md-12 text-start text-sm catalogInput-tdwidth ">
                                    <div className="w-100">
                                      <div className="">
                                        <div className="vendor-create-container w-100">
                                          <input
                                            autoComplete="off"
                                            type="text"
                                            id="vendor-crt-input"
                                            className="vendor-crt-input catalogInput-Width"
                                            placeholder=" "
                                            name="brand"
                                            value={variant.brand}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                pIndex,
                                                vIndex,
                                                "brand",
                                                e.target.value
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor="vendor-crt-input"
                                            className="vendor-crt-label"
                                          >
                                            <i className="fa-solid fa-award"></i>{" "}
                                            Brand
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Content Id */}
                                  <td className=" align-middle col-md-12 text-start text-sm catalogInput-tdwidth ">
                                    <div className="w-100">
                                      <div className="">
                                        <div className="vendor-create-container w-100">
                                          <input
                                            autoComplete="off"
                                            type="text"
                                            id="vendor-crt-input"
                                            className="vendor-crt-input catalogInput-Width"
                                            placeholder=" "
                                            name="content_id"
                                            value={variant.content_id}
                                            onChange={(e) =>
                                              handleVariantChange(
                                                pIndex,
                                                vIndex,
                                                "content_id",
                                                e.target.value
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor="vendor-crt-input"
                                            className="vendor-crt-label"
                                          >
                                            <i className="fa-solid fa-square-pen"></i>{" "}
                                            Content Id
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                 
                                </tr>
                                  {showAddButtonRow && product.variants.length > 1 && (
            <tr className="add-button-row no-top-border">
              <td className="sticky-col-1"></td>
              <td className="sticky-col-2"></td>
              <td colSpan={999} className="text-start text-muted pt-2">
                <button
                  type="button"
                  className=" btn border shadow-none "
                  
                  onClick={()=> handleAddVariant(pIndex,vIndex)} // <-- implement this
                  
                >
                  + Add Another Variant
                </button>
              </td>
            </tr>
          )}
                                </React.Fragment>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="btn-group">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleAddProduct()}
                      >
                        + New Item
                      </button>
                      {/* <button
                        type="button"
                        className="btn btn-primary rounded-end"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="catalog-chevron fas fa-angle-down"></i>
                      </button> */}
                      {/* <ul className="dropdown-menu">
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            // onClick={() => handleDuplicateItem(0, 5)}
                          >
                            5 Items
                          </a>
                        </li>
                        <li>
                          <a
                            className="dropdown-item"
                            href="#"
                            // onClick={() => handleDuplicateItem(0, 10)}
                          >
                            10 Items
                          </a>
                        </li>
                      </ul> */}
                    </div>
                  </div>

                  <div className="text-end p-3">
                    <Link to={"/vendor/catalog/product/details"}>
                      {" "}
                      <button
                        className="btn btn-secondary"
                        style={{ marginRight: "5px" }}
                      >
                        Cancel
                      </button>{" "}
                    </Link>
                    <button
                      className="btn btn-primary"
                      disabled={btnloading}
                  style={{color:"white"}}
                      onClick={() => handleproductcreate(productForm)}
                    >
                      {/* {btnloading ? "Upload items..." : "Upload items"} */}
                      {btnloading 
  ? getId 
    ? "Update items..." 
    : "Upload items..." 
  : getId 
    ? "Update items" 
    : "Upload items"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                    Add Images and Videos
                  </h1>
                </div>
                <div className="ps-3">
                  <p className="text-sm">
                    Your images and videos need to be at least 500 × 500 pixels,
                    and no larger than 8 MB for images and 100 MB for videos.
                  </p>
                </div>
                <div className="modal-body text-center px-3 p-0">
                  <form
                    className="form-container"
                    encType="multipart/form-data"
                  >
                    <div
                      className="upload-files-container"
                      onDragOver={(e) => e.preventDefault()}
                      //  onDrop={handleFileDrop}
                    >
                      <div className="drag-file-area">
                        <div>
                          <img
                            onClick={handleImageClick}
                            className="browse-files-text w-75 mb-4"
                            src={CatalogUpload}
                            alt=""
                          />
                        </div>
                        <p className="dynamic-message mt-2 mb-n1 tblName">
                          Drop Anywhere to Import
                        </p>
                        <label className="label tblName">
                          or{" "}
                          <span className="browse-files">
                            <input
                              multiple
                              type="file"
                              className="default-file-input"
                              onChange={(e) => {
                                const files = e.target.files
                                  ? Array.from(e.target.files)
                                  : [];
                                handleFileChange(e);
                                if (selectedIndices) {
                                  handleVariantChange(
                                    selectedIndices.pIndex,
                                    selectedIndices.vIndex,
                                    "images",
                                    files
                                  );
                                }
                              }}
                              ref={fileInputRef}
                            />
                            <span className="browse-files-text text-dark">
                              browse file
                            </span>{" "}
                            <span className="tblName">from device</span>
                          </span>
                        </label>
                      </div>
                      <div className="upload-container">
                        {previewFiles.map((item, index) => (
                          <div className="upload-item" key={index}>
                            <div className="upload-thumbnail">
                              {item.type === "image" ? (
                                <img src={item.url} alt={item.name} />
                              ) : (
                                <video controls>
                                  <source
                                    src={item.url}
                                    type={item.file.type}
                                  />
                                </video>
                              )}
                            </div>
                            <div className="upload-details">
                              <p>
                                <strong>{item.name}</strong>
                              </p>
                              <p>Size: {item.size}</p>
                              <p>Modified Time: {item.modifiedTime}</p>
                              <button
                                type="button"
                                onClick={() => {
                                  handleDelete(index);
                                  if (selectedIndices) {
                                    handleDeleteImage(
                                      selectedIndices.pIndex,
                                      selectedIndices.vIndex,
                                      index
                                    );
                                  }
                                }}
                              >
                                <i className="fa-solid fa-trash catalog-imgUpload"></i>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer d-flex border-0 justify-content-end">
                  <button
                    type="button"
                    //  onClick={() => { setFileName('') }}
                    className="bg-transparent border-0"
                    data-bs-dismiss="modal"
                    id="closepopup"
                  ></button>
                  <button
                    type="button"
                    //  onClick={() => { setFileName('') }}
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="closepopup1"
                    // onClick={() => setPreviewMap({})}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary import-btn-bg"
                    onClick={mediaSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>

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
                <h4 className="modal-confirm-head">Are You Sure !</h4>
                <h6 className="modal-confirm-subhead">
                  You want to delete this product ?
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
              <button type="button" className="btn btn-primary"
              onClick={() => {
    if (deleteTarget) {
      handleDeleteVariant(deleteTarget.pIndex, deleteTarget.vIndex);
      setDeleteTarget(null);
    }
  }}data-bs-dismiss="modal">
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
          <Footer />
        </main>
      </DashboardLayout>
    </>
  );
}

export default CatalogProductCreate;


