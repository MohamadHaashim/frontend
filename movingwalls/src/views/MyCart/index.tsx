import React, { Component, useEffect, useState } from "react";
import AuthLayout from "../../layouts/auth";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import './index.css';
import BackIcon from "../../assets/images/back-icon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker.module.css"
import { addDays, differenceInCalendarDays, format } from "date-fns";
import Image1 from "../../assets/images/DSC_7293-17169.jpg";
import Image3 from "../../assets/images/login-right-bg.png";
import Image4 from "../../assets/images/calender.svg";
import Image5 from "../../assets/images/uiledit.svg";
import Image6 from "../../assets/images/info-icon.svg";
import noImage from "../../assets/images/nomedia.jpg";
import { toast } from "react-toastify";
import { CART_INITIAL_QUERY, CART_PAGE_ITEM, DELETE_CART_PAGE, NEGOTIATE_CAMPAIGN_SEND_REQUEST, REQUEST_FOR_APPROVAL } from "../../Graphql/Queries";
import client from "../../Graphql/apolloClient";
import { useMutation, useQuery } from "@apollo/client";
import { generateMockData } from "../../Graphql/MockData";
import CartDownload from '../../assets/images/CardDowload.png'
import CartSuccess from '../../assets/images/cart-success.png'

interface InventorySummary {
    classicInventories: number;
    digitalInventories: number;
}

interface CampaignInventory {
    billboardAddress: any;
    billboardPotentialViews: number;
    billboardId: string;
    billboardName: string;
    billboardType: string;
    billboardPeriodSubTotalPrice: number;
    billboardReferenceId: string;
    billboardLatitude: number;
    billboardLongitude: number;
    billboardResolutionWidth: string;
    billboardResolutionHeight: string;
    billboardThumbnailUrl: string;
    billboardUniqueReach: number;
    billboardFrequency: number;
}

interface CampaignData {
    id: string;
    userId: string;
    agencyId: string;
    agencyName: string;
    companyId: string;
    companyName: string;
    countryName: string;
    campaignName: string;
    startDate: string;
    endDate: string;
    inventoriesSummary: InventorySummary;
    overAlltotalNet: number;
    overAlltotalTax: number;
    overAlltotalPrice: number;
    overAlltotalUniqueReach: number;
    overAlltotalPotentialViews: number;
    overAlltotalAverageFrequency: number;
    totalDuration: number;
    campaignInventories: CampaignInventory[];
}

interface FormState {
    redirect: string | null;
    startDate: Date | null;
    endDate: Date | null;
    showStartDatePicker: boolean;
    showEndDatePicker: boolean;
}
interface Agency {
    id: string;
    name: string;
}
interface InventorySummary {
    digitalInventories: number;
    classicInventories: number;
}
interface Report {
    preferredPrice: string;
    availableBooking: string;
    billboardPreferredPrice: string;
    userId: string;
    cartItemId: string;
    campaignName: string;
    billboardPotentialViews: string;
    billboardType: string;
    agencyName: Agency;
    inventorySummary: InventorySummary;
    billboardName: string;
    billboardId: string;
    billboardThumbnailUrl: string;
    billboardPeriodSubTotalPrice: string;
    billboardLatitude: string;
    billboardVenueType: string;
    billboardLongitude: string;
    billboardResolutionWidth: string;
    billboardResolutionHeight: string;
}

interface Billboard {
    billboardId: any;
    priceSummary: any;
    id: number;

    inventoryThumbnailUrl: string | undefined;
    inventoryName: string;
    inventoryType: string;
    negotiationSummary: {
        status: string;
        summaryReport: {
            potentialViews: { toLocaleString: () => string };
            uniqueReach: { toLocaleString: () => string };
        };
        mediaOwnerPreferredPrice: {
            nowPayPrice: any;
            totalPrice: number;
        };
        buyerPreferredPrice: {
            nowPayPrice: any;
            totalPrice: number;
        };
    };
}
interface Billboard {
    billboardPotentialViews: number;
    billboardUniqueReach: number;
    billboardName: string;
    billboardType: string;
    billboardResolutionWidth: string;
    billboardResolutionHeight: string;
    billboardPeriodSubTotalPrice: number;
    billboardThumbnailUrl: string;
    availableBooking: boolean;
}


const MyCartDetails: React.FC<{ currencyCode: any }> = ({ currencyCode }) => {
    const [localCurrencyCode, setLocalCurrencyCode] = useState(currencyCode || "");
    useEffect(() => {
        if (!currencyCode) {
            const storedCurrencyCode = localStorage.getItem("currencyCode");
            if (storedCurrencyCode) {
                setLocalCurrencyCode(storedCurrencyCode);
            }
        }
    }, [currencyCode]);
    let storedCurrencyCodes = localStorage.getItem("currencyCode");
    const currentDate = new Date();
    const location = useLocation();
    const cardData = location.state || {};
    const formDatas = cardData?.formData || {};
    const formData = cardData?.formData || {};
    const cartformData = cardData?.cartformData || {};
    const updateCampaignList = cardData?.cartformData?.updateCampaignList || {};
    const campaignDataValue = cartformData?.updateCampaignList || {};
    const showRequestOnly = cardData?.showRequestOnly;
    const showSaveAndRequest = cardData?.showSaveAndRequest;
    const defaultCampName = cardData?.defaultCampName;
    const resolvedCurrencyCode = cartformData?.currencyCode || storedCurrencyCodes || localCurrencyCode;


    const [startDate, setStartDate] = useState<Date>(() => {
        return formData?.startDate ? new Date(formData?.startDate) :
            cartformData?.startDate ? new Date(cartformData?.startDate) : new Date();
    });
    console.log(formData?.startDate, "datex");
    console.log(cartformData?.startDate, "datexz");

    const [endDate, setEndDate] = useState<Date>(() => {
        return formData?.endDate ? new Date(formData?.endDate) :
            cartformData?.endDate ? new Date(cartformData?.endDate) : new Date();
    });

    const [campaignName, setCampaignName] = useState<string>(() => {
        const storedCampaignName = localStorage.getItem('campaignName');
        return storedCampaignName || formData?.campaignName || cartformData?.campaignName || defaultCampName || 'Default Campaign';
    });
    const [state, setState] = useState<string>(
        formData?.state || cartformData?.state || 'Default Campaign'
    );
    const [district, setDistrict] = useState<string>(
        formData?.district || cartformData?.district || 'Default Campaign'
    );
    const [totalDays, setTotalDays] = useState<number>(0);

    const calculateTotalDays = (startDate: Date, endDate: Date) => {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const totalDays = timeDiff / (1000 * 3600 * 24);
        return totalDays;
    };

    useEffect(() => {
        if (startDate && endDate) {
            const days = calculateTotalDays(startDate, endDate);
            setTotalDays(days);
        }
    }, [startDate, endDate]);
    useEffect(() => {
        if (campaignName) {
            localStorage.getItem('campaignName');
        }
    }, [campaignName]);

    const handleCampaignNameChanges = (campaignName: string) => {
        setCampaignName(campaignName);
    };



    const [redirect, setRedirect] = useState<string | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [tempStartDate, setTempStartDate] = useState<Date>(currentDate || "");
    const [tempEndDate, setTempEndDate] = useState<Date>(currentDate || "");
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [potentialViews, setPotentialViews] = useState<string>("");
    const [uniqueReach, setUniqueReach] = useState<string>("");
    const [totalDuration, settotalDuration] = useState<string>("");
    const [totalNet, setTotalNet] = useState<string>("");
    const [overAlltotalTax, setoverAlltotalTax] = useState<string>("");
    const [alltotalPrice, setAlltotalPrice] = useState<string>("");
    const [averageFrequency, setAverageFrequency] = useState<string>("");
    const [inventorySummary, setInventorySummary] = useState<InventorySummary | null>(null); // Initialize as null
    const [cartList, setCartList] = useState<Report[]>([]);
    const [loading, setLoading] = useState(false);
    const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
    const [isChecked, setIsChecked] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [deleteContent] = useMutation(DELETE_CART_PAGE);
    const [isNegotiationChecked, setIsNegotiationChecked] = useState(false);
    const [isNegotiationChecked1, setIsNegotiationChecked1] = useState(false);
    const [isNegotiationCheckedProof, setIsNegotiationCheckedProof] = useState(true);
    const [isNegotiationCheckedDelivery, setIsNegotiationCheckedDelivery] = useState(true);
    const [billboardCurrencyCode, setBillboardCurrencyCode] = useState<string>("");
    console.log(currencyCode, "currencyCode");
    const [editableRows, setEditableRows] = useState<{ [key: string]: boolean }>({});
    const [preferredPrices, setPreferredPrices] = useState<{ [key: string]: string | number }>({});
    const [selectedBillboard, setSelectedBillboard] = useState<string[]>([]);
    const [loopingData, setLoopingData] = useState<Billboard | null>(null);
    const [gstName, setGstName] = useState('')
    const [digitalBillboardLength, setDigitalBillboardLength] = useState(0);
    const [classicBillboardLength, setClassicBillboardLength] = useState(0);
    const [campaignId, setCampaignId] = useState<string | null>(cartformData.selectedCampaignId || null);
    const [edit, setEdit] = useState<boolean>(cartformData.edit || false);
    const [itemType, setItemType] = useState<boolean>(cartformData.itemType || false);
    const [campaignType, setcampaignType] = useState<boolean>(cartformData.campaignType || false);
    const [available, setAvailable] = useState('')

    const today = new Date();
    const tomorrow = addDays(today, 0);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const increaseYear = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentYear((prevYear) => prevYear + 1);
    };

    const decreaseYear = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentYear((prevYear) => prevYear - 1);
    };

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setTempStartDate(date);
            setShowMonthPicker(false);
            setShowYearPicker(false);
            setStartDate(date);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setTempEndDate(date);
            setShowMonthPicker(false);
            setShowYearPicker(false);
            setEndDate(date);
        }
    };

    const toggleStartDatePicker = () => {
        setShowStartDatePicker(prev => !prev);
        setTempStartDate(startDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const toggleEndDatePicker = () => {
        setShowEndDatePicker(prev => !prev);
        setTempEndDate(endDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const toggleMonthPicker = () => {
        setShowMonthPicker(prev => !prev);
        setShowYearPicker(false);
    };

    const toggleYearPicker = () => {
        setShowYearPicker(prev => !prev);
        setShowMonthPicker(false);
    };

    const handleMonthSelection = (month: number) => {
        const newStartDate = tempStartDate ? new Date(tempStartDate) : new Date();
        const newEndDate = tempEndDate ? new Date(tempEndDate) : new Date();
        newStartDate.setMonth(month);
        newEndDate.setMonth(month);
        setCurrentYear(currentYear);
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedMonth(month);
        setShowMonthPicker(false);
    };

    const handleYearSelection = (year: number) => {
        setCurrentYear(year);
        const newStartDate = tempStartDate ? new Date(tempStartDate) : new Date();
        const newEndDate = tempEndDate ? new Date(tempEndDate) : new Date();
        newStartDate.setFullYear(year);
        newEndDate.setFullYear(year);
        setSelectedYear(currentYear);
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedYear(year);
        setShowYearPicker(false);
    };

    const handleUpdateStartDate = () => {
        const updatedStartDate = (tempStartDate ?? new Date());
        updatedStartDate.setFullYear(currentYear);
        setStartDate(updatedStartDate);
        handleYearSelection(currentYear);
        setShowStartDatePicker(false);
    };

    const handleUpdateEndDate = () => {
        const updatedEndDate = (tempEndDate ?? new Date());
        updatedEndDate.setFullYear(currentYear);
        setEndDate(updatedEndDate);
        handleYearSelection(currentYear);
        setShowEndDatePicker(false);
    };

    const handleMonthButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };

    //Cart Config
    const [config, setConfig] = useState<any[]>([]);
    const [terms, setConfigTerms] = useState<any[]>([]);

    const fetchConfig = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
            const data = await response.json();
            const value = data.find((page: any) => page.name === "Cart");
            const Termsvalue = data.find((page: any) => page.name === "Terms & conditions");

            // If the configuration is found, set it in state
            if (Termsvalue && Termsvalue.configurations) {
                setConfigTerms(Termsvalue.configurations);
            } else {
                console.error("Terms & conditions configuration not found.");
            }
            setConfig(value?.configurations || []);
            // setConfigTerms(Termsvalue.configurations || []);
        } catch (error) {
            console.error("Error fetching configuration:", error);
        }
    };

    // Check if the field is enabled based on the configuration
    const isFieldEnabled = (key: string, config: any[]) => {
        const fieldConfig = config.flatMap((cfg: any) => cfg.fields).find((field) => field.key === key);
        return fieldConfig ? fieldConfig.default : true;
    };

    const isFieldEnabledTerms = (key: string, terms: any[]) => {
        const fieldConfig = terms.find((field) => field.key === key);
        return fieldConfig ? fieldConfig.default : true;
    };


    useEffect(() => {
        fetchConfig();
    }, []);

    const [content, setContent] = useState<any[]>([]);
    const [termss, setTerms] = useState<string>("");
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
                const data = await response.json();
                const value = data.find((page: any) => page.name === "Landing Page");
                setContent(value.fields);
                const values = data.find((page: any) => page.name === "Terms & conditions");
                const termLen = (values.fields[0].components[0].components).length;
                for (let i = 0; i < termLen; i++) {
                    if ('key' in values.fields[0].components[0].components[i]) {
                        if (values.fields[0].components[0].components[i].key === "terms_conditionsDocument") {
                            if ((values.fields[0].components[0].components[i].defaultValue).length > 0) {
                                setTerms(values.fields[0].components[0].components[i].defaultValue[0].data.text)
                                break;
                            }
                        }
                        else {
                            if (values.fields[0].components[0].components[i].key === "TermsText") {
                                setTerms(values.fields[0].components[0].components[i].defaultValue)
                            }
                        }
                    }
                }

            } catch (error) {
            }
        };

        fetchContent();
    }, []);


    const length = differenceInCalendarDays(new Date(endDate), new Date(startDate));

    const fetchCartList = async () => {
        const token = localStorage.getItem("authToken");
        const selectedCampaignId = localStorage.getItem("selectedCampaignId");
        const userId = localStorage.getItem("userId");

        if (!token) {
            toast.error("No authentication token found.");
            return;
        }

        setLoading(true);

        try {
            const response = await client.query({
                query: CART_PAGE_ITEM,
                variables: {
                    accessToken: token,
                    campaignId: campaignId || "",
                    userId: userId,
                    edit: edit,
                    startDate: format(startDate, edit ? 'yyyy-MM-dd' : 'dd MMMM yyyy'),
                    endDate: format(endDate, edit ? 'yyyy-MM-dd' : 'dd MMMM yyyy'),
                },
                fetchPolicy: "no-cache",
            });

            if (response.errors) {
                console.error("GraphQL Errors:", response.errors);
                toast.error("Failed to fetch reports: " + response.errors.map(err => err.message).join(", "));
                return;
            }

            const campaignDatas = response.data.cartPageItem[0];



            if (!campaignDatas) {
                toast.error("No campaign data found.");
                return;
            }

            setCampaignData(campaignDatas);
            setInventorySummary(campaignDatas.inventoriesSummary);
            setCartList(campaignDatas.campaignInventories);
            // setDigitalBillboardLength(inventorySummary ? inventorySummary?.digitalInventories : 0)
            // setClassicBillboardLength(inventorySummary ? inventorySummary.classicInventories : 0)



            if (campaignDatas.campaignInventories && campaignDatas.campaignInventories.length > 0) {
                const firstBillboard = campaignDatas.campaignInventories.map((item: any) => (item.billboardId));
                setSelectedBillboard(firstBillboard);  // Set selectedBillboard to just the billboardId
            }


            setLoading(false);

            const uniqueCurrencyCodes = campaignDatas.campaignInventories
                .map((list: { billboardCurrencyCode: string }) => list.billboardCurrencyCode)
                .filter((code: string) => code) // Filter out any falsy values
                .reduce((unique: string[], code: string) => {
                    if (!unique.includes(code)) {
                        unique.push(code);
                    }
                    return unique;
                }, []);

            setBillboardCurrencyCode(resolvedCurrencyCode);

            // Other state updates based on the fetched data
            setPotentialViews(campaignDatas?.overAlltotalPotentialViews);
            setUniqueReach(campaignDatas?.overAlltotalUniqueReach);
            setTotalNet(campaignDatas?.overAlltotalPrice);
            setoverAlltotalTax(campaignDatas?.overAlltotalTax);
            setAlltotalPrice(campaignDatas?.overAlltotalNet);
            setAverageFrequency(campaignDatas?.overAlltotalAverageFrequency.toFixed(2));
            setAvailable(campaignDatas?.availableBooking ? 'true' : 'false');

        } catch (err) {
            toast.error("An unexpected error occurred while fetching reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const digitaluniqueBillboards = cartList.filter(
            (inventory, index, self) =>
                index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
                (inventory.billboardType === "digital")
        );
        const classicuniqueBillboards = cartList.filter(
            (inventory, index, self) =>
                index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
                (inventory.billboardType === "classic")
        );
        setDigitalBillboardLength(digitaluniqueBillboards.length);
        setClassicBillboardLength(classicuniqueBillboards.length);
    }, [cartList]);


    const [inputValue, setInputValue] = useState('');
    const [negotiate, { loading: sendRequest, error: sendError }] = useMutation(NEGOTIATE_CAMPAIGN_SEND_REQUEST);

    const [gstValue, setGstValue] = useState('')
    const [percentage, setPercentage] = useState('')

    useEffect(() => {
        const userAccountData = localStorage.getItem('userAccountData');


        if (userAccountData) {
            try {
                const parsedData = JSON.parse(userAccountData);
                setGstValue(parsedData[0]?.country?.tax?.label)
                setPercentage(parsedData[0]?.country?.tax?.percent)
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.error("No user account data found in local storage.");
        }
    }, []);


    const handleBillboardClicks = (inventory: any) => {
        setLoopingData(inventory)


    };

    const handleCampaignAction = async (status: string) => {
        const token = localStorage.getItem("authToken");
        const userNameLogin = localStorage.getItem('userNameLogin');
        const selectedCampaignId = localStorage.getItem('selectedCampaignId');

        if (!token) {
            toast.error("No authentication token found.");
            return;
        }

        if (!campaignData) {
            toast.error("No campaign data available to save.");
            return;
        }

        if (!selectedBillboard) {
            toast.error("No selected billboard found.");
            return;
        }

        setLoading(true);

        try {
            // Remove duplicates from campaignInventories
            const uniqueCampaignInventories = campaignData.campaignInventories.filter((inventory, index, self) =>
                index === self.findIndex((inv) => inv.billboardId === inventory.billboardId)
            );

            const approvalVariables = {
                campaignType: campaignType ? "edit-campaign" : "create-campaign",
                campaignId: campaignData.id,
                input: {
                    accessToken: token,
                    name: campaignName,
                    bookingSource: "ONLINE",
                    startDate: cartformData ? cartformData.startDate : campaignData.startDate,
                    endDate: cartformData ? cartformData.endDate : campaignData.endDate,
                    campaignStatus: status === "Save draft" ? "GENERATED" : status,
                    agency: {
                        id: campaignData.agencyId,
                        name: campaignData.agencyName,
                    },
                    company: {
                        id: campaignData.companyId,
                        name: campaignData.companyName,
                    },
                    user: {
                        id: campaignData.userId,
                        name: userNameLogin,
                    },
                    dsp: campaignData.agencyName,
                    inventoriesSummary: {
                        classicInventories: campaignData.inventoriesSummary.classicInventories,
                        digitalInventories: campaignData.inventoriesSummary.digitalInventories,
                    },
                    priceSummary: {
                        subTotal: campaignData.overAlltotalPrice,
                        netTotal: campaignData.overAlltotalNet,
                        tax: {
                            name: gstValue,
                            value: campaignData.overAlltotalTax,
                            percent: (campaignData.overAlltotalTax / campaignData.overAlltotalPrice) * 100,
                        },
                        currency: {
                            country: campaignData.countryName,
                            symbol: currencyCode,
                            code: currencyCode,
                        },
                    },
                    summaryReport: {
                        potentialViews: campaignData.overAlltotalPotentialViews,
                        uniqueReach: campaignData.overAlltotalUniqueReach,
                        cpm: campaignData.overAlltotalPrice / (campaignData.overAlltotalPotentialViews / 1000),
                        averageFrequency: campaignData.overAlltotalAverageFrequency,
                        totalSpots: uniqueCampaignInventories.length,
                    },
                    reporting: {
                        ...(isFieldEnabled("proof of play", config) && { proofOfPlay: isNegotiationCheckedProof }),
                        ...(isFieldEnabled("play log", config) && { deliveryReports: isNegotiationCheckedDelivery }),
                    },
                    campaignInventories: uniqueCampaignInventories.map((inventory) => ({
                        dsp: campaignData.agencyName,
                        startDate: campaignData.startDate,
                        endDate: campaignData.endDate,
                        companyId: campaignData.companyId,
                        inventoryPrice: inventory.billboardPeriodSubTotalPrice,
                        inventoryName: inventory.billboardName,
                        inventoryId: inventory.billboardId,
                        inventoryReferenceId: inventory.billboardReferenceId,
                        inventoryType: inventory.billboardType,
                        inventoryAddress: inventory.billboardAddress,
                        inventoryVenueType: inventory.billboardType,
                        inventoryResolution: {
                            width: parseFloat(inventory.billboardResolutionWidth),
                            height: parseFloat(inventory.billboardResolutionHeight)
                        },
                        inventoryThumbnailUrl: inventory.billboardThumbnailUrl,
                        inventoryLatitude: inventory.billboardLatitude,
                        inventoryLongitude: inventory.billboardLongitude,
                        inventoryReports: {
                            totalPotentialViews: inventory.billboardPotentialViews,
                            averageFrequency: inventory.billboardFrequency,
                            cpm: inventory.billboardPeriodSubTotalPrice / (inventory.billboardPotentialViews / 1000),
                            totalReach: inventory.billboardUniqueReach,
                        },
                    }))
                },
            };

            const approvalResponse = await client.mutate({
                mutation: REQUEST_FOR_APPROVAL,
                variables: approvalVariables,
                fetchPolicy: "no-cache",
            });

            if (approvalResponse?.data?.requestForApproval?.campaign?.campaignStatus === "REQUESTED") {
                const modalRequestSuccess = new window.bootstrap.Modal(document.getElementById('request_success'));
                modalRequestSuccess.show();
                // setRedirect('/my-campaigns');
            }
            if (approvalResponse?.data?.requestForApproval?.campaign?.campaignStatus === "GENERATED") {
                setRedirect(`${process.env.REACT_APP_BASE_PATH}/my-campaigns`);
            }
            if (approvalResponse.errors || !approvalResponse.data.requestForApproval) {
                console.error("GraphQL Errors during approval request:", approvalResponse.errors);
                toast.error("Failed to request approval: " + (approvalResponse.errors ? approvalResponse.errors.map(err => err.message).join(", ") : "Unknown error"));
                return;
            }

            const negotiationCampaignId = approvalResponse.data.requestForApproval.campaign.id;

            if (isNegotiationChecked && status === "NEGOTIATION_REQUESTED") {
                const negotiationData = {
                    duration: totalDays,
                    billboards: selectedBillboard.map((billboardId: string | number) => {
                        const selectedBillboardData = loopingData;
                        const buyerPreferredPrice = parseFloat(String(preferredPrices[billboardId] || billboardId));
                        const mediaOwnerPreferredPrice = campaignData?.campaignInventories
                            .find(item => item.billboardId === String(billboardId))?.billboardPeriodSubTotalPrice || 0;

                        const potential = campaignData?.campaignInventories
                            .find(item => item.billboardId === String(billboardId))?.billboardPotentialViews || 0;

                        const billboardUniqueReach = campaignData?.campaignInventories
                            .find(item => item.billboardId === String(billboardId))?.billboardUniqueReach || 0;

                        const isSelected = editableRows[billboardId] || false;

                        const nowPayPrice = isSelected
                            ? (buyerPreferredPrice > 0 ? buyerPreferredPrice : mediaOwnerPreferredPrice)
                            : mediaOwnerPreferredPrice;

                        console.log("Selected Billboard Data:", mediaOwnerPreferredPrice);
                        console.log("Buyer Preferred Price:", buyerPreferredPrice);
                        console.log("Media Owner Preferred Price:", mediaOwnerPreferredPrice);
                        console.log("Now Pay Price:", nowPayPrice);

                        return {
                            billboardId: billboardId,
                            negotiationSummary: {
                                buyerPreferredPrice: {
                                    totalPrice: mediaOwnerPreferredPrice,
                                    savingsPrice: 0,
                                    savingsPerc: 0,
                                    nowPayPrice: nowPayPrice,
                                },
                                mediaOwnerPreferredPrice: {
                                    totalPrice: mediaOwnerPreferredPrice,
                                    savingsPrice: 0,
                                    savingsPerc: 0,
                                    nowPayPrice: mediaOwnerPreferredPrice,
                                },
                                contentManagementFeePerc: 0,
                                platformFeePerc: 15,
                                taxPerc: percentage,
                                discountPerc: 0,
                                customFees: [],
                                summaryReport: {
                                    potentialViews: potential,
                                    uniqueReach: billboardUniqueReach,
                                },
                                status: "PENDING",
                                accountType: "EXTERNAL",
                                requestFrom: "MEDIA_BUYERS",
                            },
                        };
                    }),
                };

                const { data: negotiateData, errors: negotiateErrors } = await client.mutate({
                    mutation: NEGOTIATE_CAMPAIGN_SEND_REQUEST,
                    variables: {
                        negotiationData,
                        accessToken: token,
                        campaignId: negotiationCampaignId,
                    },
                });

                if (negotiateErrors) {
                    console.error('GraphQL Errors during negotiation:', negotiateErrors);
                    toast.error("Failed to negotiate: " + (negotiateErrors.map(err => err.message).join(", ") || "Unknown error"));
                    return;
                }

                if (negotiateData && negotiateData.negotiate && negotiateData.negotiate.response) {
                    const success = negotiateData.negotiate.response.success;
                    const message = negotiateData.negotiate.response.message || "Negotiation completed successfully!";

                    if (success) {
                        toast.success(message);
                        setRedirect(`${process.env.REACT_APP_BASE_PATH}/my-campaigns`);
                    } else {
                        console.error("Negotiation failed:", message);
                        toast.error("Negotiation failed: " + message);
                    }
                } else {
                    console.error("Negotiation failed due to invalid response structure:", negotiateData);
                    toast.error("Negotiation failed due to invalid server response.");
                }
            }
        } catch (err) {
            console.error("Error during API calls:", err);
            toast.error("An unexpected error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };





    useEffect(() => {
        if (process.env.REACT_APP_MOCK_DATA === 'true') {
            generateMockData(CART_PAGE_ITEM)
                .then((mockResponse: any) => {
                    const data = mockResponse.data;

                    const campaignDatas = data.cartPageItem[0];



                    if (!campaignDatas) {
                        toast.error("No campaign data found.");
                        return;
                    }

                    setCampaignData(campaignDatas);
                    setInventorySummary(campaignDatas.inventoriesSummary);
                    setCartList(campaignDatas.campaignInventories);



                    if (campaignDatas.campaignInventories && campaignDatas.campaignInventories.length > 0) {
                        const firstBillboard = campaignDatas.campaignInventories.map((item: any) => (item.billboardId));
                        setSelectedBillboard(firstBillboard);  // Set selectedBillboard to just the billboardId
                    }


                    setLoading(false);

                    const uniqueCurrencyCodes = campaignDatas.campaignInventories
                        .map((list: { billboardCurrencyCode: string }) => list.billboardCurrencyCode)
                        .filter((code: string) => code) // Filter out any falsy values
                        .reduce((unique: string[], code: string) => {
                            if (!unique.includes(code)) {
                                unique.push(code);
                            }
                            return unique;
                        }, []);

                    setBillboardCurrencyCode(resolvedCurrencyCode);

                    // Other state updates based on the fetched data
                    setPotentialViews(campaignDatas?.overAlltotalPotentialViews);
                    setUniqueReach(campaignDatas?.overAlltotalUniqueReach);
                    setTotalNet(campaignDatas?.overAlltotalPrice);
                    setoverAlltotalTax(campaignDatas?.overAlltotalTax);
                    setAlltotalPrice(campaignDatas?.overAlltotalNet);
                    setAverageFrequency(campaignDatas?.overAlltotalAverageFrequency.toFixed(2));
                    setAvailable(campaignDatas?.availableBooking ? 'true' : 'false');

                })
                .catch((err: any) => {
                    console.error("Error generating mock data:", err);
                });
        }
        else {
            fetchCartList();
        }
    }, []);



    const handleDeleteItem = (id: string) => {
        setDeleteItemId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    };

    const confirmDelete = async () => {
        const token = localStorage.getItem("authToken");
        if (!token || !deleteItemId) return;

        try {
            const response = await deleteContent({
                variables: {
                    accessToken: token,
                    deleteItemId,
                    itemType: itemType ? 'draft-data' : "cart-data"
                }
            });

            const success = response?.data?.deleteCartItem?.success;
            const message = response?.data?.deleteCartItem?.message || (success ? "Cart item deleted successfully" : "Failed to delete cart item");
            if (success) {
                toast.success(message);
                fetchCartList();
            } else {
                toast.error(message);
            }
            const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
            modal.hide();

        } catch (error) {
            toast.error("Failed to delete content");
            console.error(error);
        } finally {
            setDeleteItemId(null);
        }
    };




    // Handle checkbox change
    const handleCheckboxChanges = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsNegotiationChecked(event.target.checked);
    };

    // Handle table input checkbox change
    const handleCheckboxChanges1 = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsNegotiationChecked1(event.target.checked);
    };


    //   handle proof 

    const handleProof = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsNegotiationCheckedProof(event.target.checked);
    };

    //   handle proof 

    const handleDelete = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
        setIsNegotiationCheckedDelivery(event.target.checked);
    };

    const handleEditClick = () => {
        // Safely find the input element
        const inputElement = document.querySelector('.form-control') as HTMLInputElement | null;

        // Check if the element exists and focus it
        if (inputElement) {
            inputElement.focus();
        } else {
            console.error('Input element not found.');
        }
    };
    const handleNegotiationCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsNegotiationChecked(event.target.checked);
    };

    // Handle individual row negotiation checkbox change
    const handlePreferredPriceChange = (billboardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        // Parse the value from the input field
        const newPreferredPrice = event.target.value;

        // Update the state for the specific billboardId
        setPreferredPrices(prevState => ({
            ...prevState,
            [billboardId]: newPreferredPrice,
        }));

    };

    // Handle checkbox change for enabling/disabling editing
    const handleRowNegotiationCheckboxChange = (billboardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setEditableRows(prevState => ({
            ...prevState,
            [billboardId]: event.target.checked,
        }));
    };





    const navigate = useNavigate();

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    let backLink = `${process.env.REACT_APP_BASE_PATH}/my-campaigns`;
    if (showRequestOnly) {
        backLink = `${process.env.REACT_APP_BASE_PATH}/editcampaign`;
    } else if (showSaveAndRequest) {
        backLink = `${process.env.REACT_APP_BASE_PATH}/propertylist`;
    }
    const handleBackClick = () => {
        navigate(backLink, {
            state: {
                formData: { startDate, endDate, campaignName, state, district }
            }
        });
    };
    return (
        <AuthLayout>
            <>
                <div className="my-cart-page skyblue-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mt-2">
                                    <div className="navbar-back-btn"><img alt="" src={BackIcon} /><a onClick={handleBackClick}> Back</a></div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                                    <span className="loading-circle sp1">
                                        <span className="loading-circle sp2">
                                            <span className="loading-circle sp3"></span>
                                        </span>
                                    </span>
                                </div>
                            ) : (
                                <div className="card drop-shadow border-0">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <h4 className="card_first_header">Campaign estimation</h4>
                                            </div>
                                        </div>
                                        {cartList.length == 0 ? <div className="no-data-found-containers cart-no-data">
                                            <p className="looks-like">Looks like there is nothing in your cart </p>
                                            <button className="billboard-button" onClick={handleBackClick}>Add a billboard</button>
                                        </div> :
                                            <div className="row">

                                                <div className="col-md-8 pt-4 border-right-1">

                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="row mb-3 summary">

                                                                {isFieldEnabled("impressions", config) && (
                                                                    <div className="col-md-3">
                                                                        <p className="label">Potential views</p>
                                                                        <p>{potentialViews}</p>
                                                                    </div>
                                                                )}

                                                                {isFieldEnabled("reach", config) && (
                                                                    <div className="col-md-3">
                                                                        <p className="label">Unique reach</p>
                                                                        <p>{uniqueReach}</p>
                                                                    </div>
                                                                )}

                                                                {isFieldEnabled("average frequency", config) && (
                                                                    <div className="col-md-6">
                                                                        <p className="label">Average frequency</p>
                                                                        <p>{averageFrequency}</p>
                                                                    </div>
                                                                )}

                                                                <div className="col-md-12">
                                                                    <hr className="my-3" />
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <h5>Create a campaign with</h5>
                                                                    {isFieldEnabled("Cartnegotiation", config) && (
                                                                        <label htmlFor="negotiation">Negotiation  <input
                                                                            type="checkbox"
                                                                            id="negotiation"
                                                                            checked={isNegotiationChecked}
                                                                            onChange={handleNegotiationCheckboxChange}
                                                                        /></label>
                                                                    )}
                                                                </div>
                                                                <div className="col-md-12 mt-4">
                                                                    <h5 className="gray">Digital Billboards <span className=" badge">{digitalBillboardLength}</span></h5>
                                                                </div>

                                                                <div className="col-md-12 cart-table">
                                                                    <div className="mycart-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                                        <div className="col-12">
                                                                            <hr />
                                                                        </div>
                                                                        <table className="table table-hover">
                                                                            {/* {/ Table Header /} */}
                                                                            <thead className="thead-dark">
                                                                                <tr>
                                                                                    <th className="card_list_header">Billboard Name</th>
                                                                                    {isNegotiationChecked ? <th style={{ marginRight: '5px' }} className="card_list_header card_llist_header"></th> : ''}
                                                                                    <th className="card_list_header card_list_headers">Impressions</th>
                                                                                    <th className="card_list_header card_llist_header">Size/Resolution</th>
                                                                                    <th className="card_list_header card_llist_header">Negotiation</th>
                                                                                    {isNegotiationChecked && <th className="card_list_header card_llist_header">Preferred Price</th>}
                                                                                    <th className="card_list_header card_llist_header">Price</th>
                                                                                </tr>
                                                                            </thead>

                                                                            {/* {/ Table Body /} */}
                                                                            <tbody>
                                                                                {cartList.length > 0 ? (
                                                                                    cartList.filter(inventory => inventory.billboardType === "digital").length > 0 ? (
                                                                                        cartList
                                                                                            .filter((inventory, index, self) =>
                                                                                                index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
                                                                                                (inventory.billboardType === "digital")
                                                                                            )
                                                                                            // .filter(inventory => inventory.billboardType === "digital")
                                                                                            .map((inventory) => (
                                                                                                <tr onClick={() => handleBillboardClicks(inventory)} key={inventory.billboardId} className="table-row billboard-row card_list_data">
                                                                                                    <td className="d-flex text-center">
                                                                                                        <img
                                                                                                            src={
                                                                                                                inventory.billboardThumbnailUrl &&
                                                                                                                    inventory.billboardThumbnailUrl !== "null" &&
                                                                                                                    inventory.billboardThumbnailUrl.trim() !== ""
                                                                                                                    ? inventory.billboardThumbnailUrl
                                                                                                                    : noImage
                                                                                                            }
                                                                                                            alt={inventory.billboardName || "Billboard Image"}
                                                                                                            className="billboard-img card_list_img img-fluid"
                                                                                                        />

                                                                                                        <span style={{ marginLeft: '2px' }}>
                                                                                                            <p style={{ fontSize: '13px' }} className="semi-bold">{inventory.billboardName}</p>
                                                                                                            <span className={`badge ${inventory?.availableBooking ? 'badge-success' : 'badge-danger'}`}>
                                                                                                                {inventory?.availableBooking ? 'Available' : 'Not Available'}
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    {isNegotiationChecked ? <td style={{ marginRight: '5px' }} className="text-center"></td> : ''}
                                                                                                    <td className="text-center">{inventory.billboardPotentialViews}</td>
                                                                                                    <td className="text-center">
                                                                                                        {inventory.billboardResolutionWidth} x  {inventory.billboardResolutionHeight}
                                                                                                    </td>
                                                                                                    <td className="text-center">
                                                                                                        {isNegotiationChecked ? (
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                checked={editableRows[inventory.billboardId] || false}
                                                                                                                onChange={(e) => handleRowNegotiationCheckboxChange(inventory.billboardId, e)}
                                                                                                                className="card_negotiation_check"
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <input type="checkbox" disabled checked={editableRows[inventory.billboardId] || false} />
                                                                                                        )}
                                                                                                    </td>
                                                                                                    {isNegotiationChecked && (
                                                                                                        <td className="text-center cartpage-input">

                                                                                                            {editableRows[inventory.billboardId] ? (
                                                                                                                <><span>{resolvedCurrencyCode}</span><input

                                                                                                                    type="text"
                                                                                                                    value={preferredPrices[inventory.billboardId] || ''}
                                                                                                                    onChange={(e) => handlePreferredPriceChange(inventory.billboardId, e)}
                                                                                                                    placeholder={resolvedCurrencyCode} /></>
                                                                                                            ) : (
                                                                                                                preferredPrices[inventory.billboardId] ? preferredPrices[inventory.billboardId] : 'Enter value'
                                                                                                            )}
                                                                                                        </td>
                                                                                                    )}
                                                                                                    <td className="text-center">{localCurrencyCode || storedCurrencyCodes} {inventory.billboardPeriodSubTotalPrice}</td>
                                                                                                    <td className="text-center">
                                                                                                        <div
                                                                                                            className="delete-container card_delete_container"
                                                                                                            onClick={() => handleDeleteItem(inventory.cartItemId)}
                                                                                                        >
                                                                                                            <i className="fas fa-trash-alt delete-icon card_delete_icon"></i>
                                                                                                            <span className="billboard-delete card_billboard_delete">Delete</span>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan={isNegotiationChecked ? 7 : 6} className="text-center nodata-found-txt">
                                                                                                No data found
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan={isNegotiationChecked ? 7 : 6} className="text-center nodata-found-txt">
                                                                                            No data found
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>

                                                                    </div>
                                                                </div>




                                                                <div className="col-md-12 mt-4">
                                                                    <h5 className="gray">Classic Billboards <span className=" badge">{classicBillboardLength}</span></h5>
                                                                </div>


                                                                <div className="col-md-12 cart-table">
                                                                    <div className="mycart-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                                        <div className="col-12">
                                                                            <hr />
                                                                        </div>
                                                                        <table className="table  table-hover">
                                                                            {/* {/ Table Header /} */}
                                                                            <thead className="thead-dark">
                                                                                <tr>
                                                                                    <th className="card_list_header">Billboard Name</th>
                                                                                    {isNegotiationChecked ? <th className="card_list_header card_llist_header"></th> : ''}
                                                                                    <th className="card_list_header card_list_headers">Impressions</th>
                                                                                    <th className="card_list_header card_llist_header">Size/Resolution</th>
                                                                                    <th className="card_list_header card_llist_header">Negotiation</th>
                                                                                    {isNegotiationChecked && <th className="card_list_header card_llist_header">Preferred Price</th>}
                                                                                    <th className="card_list_header card_llist_header">Price</th>

                                                                                </tr>
                                                                            </thead>

                                                                            {/* {/ Table Body /} */}
                                                                            <tbody>
                                                                                {cartList.length > 0 ? (
                                                                                    cartList.filter(inventory => inventory.billboardType === "classic").length > 0 ? (
                                                                                        cartList
                                                                                            .filter((inventory, index, self) =>
                                                                                                index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
                                                                                                (inventory.billboardType === "classic")
                                                                                            )
                                                                                            // .filter(inventory => inventory.billboardType === "classic")
                                                                                            .map((inventory) => (
                                                                                                <tr key={inventory.billboardId} className="table-row billboard-row card_list_data ">



                                                                                                    <td className="d-flex text-center">
                                                                                                        <img
                                                                                                            src={
                                                                                                                inventory.billboardThumbnailUrl &&
                                                                                                                    inventory.billboardThumbnailUrl !== "null" &&
                                                                                                                    inventory.billboardThumbnailUrl.trim() !== ""
                                                                                                                    ? inventory.billboardThumbnailUrl
                                                                                                                    : noImage
                                                                                                            }
                                                                                                            alt={inventory.billboardName || "Billboard Image"}
                                                                                                            className="billboard-img card_list_img img-fluid"
                                                                                                        />
                                                                                                        <span style={{ marginLeft: '2px' }}>
                                                                                                            <p style={{ fontSize: '13px' }} className="semi-bold">{inventory.billboardName}</p>
                                                                                                            <span className={`badge ${inventory?.availableBooking ? 'badge-success' : 'badge-danger'}`}>
                                                                                                                {inventory?.availableBooking ? 'Available' : 'Not Available'}
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </td>

                                                                                                    {isNegotiationChecked ? <td className="text-center"></td> : ''}
                                                                                                    <td className="text-center">{inventory.billboardPotentialViews}</td>
                                                                                                    <td className="text-center">
                                                                                                        {inventory.billboardResolutionWidth} x  {inventory.billboardResolutionHeight}
                                                                                                    </td>
                                                                                                    <td className="text-center">
                                                                                                        {isNegotiationChecked ? (
                                                                                                            <input
                                                                                                                type="checkbox"
                                                                                                                checked={editableRows[inventory.billboardId] || false}
                                                                                                                onChange={(e) => handleRowNegotiationCheckboxChange(inventory.billboardId, e)}
                                                                                                                className="card_negotiation_check"
                                                                                                            />
                                                                                                        ) : (
                                                                                                            <input type="checkbox" disabled checked={editableRows[inventory.billboardId] || false} />
                                                                                                        )}
                                                                                                    </td>
                                                                                                    {isNegotiationChecked && (
                                                                                                        <td className="text-center cartpage-input">

                                                                                                            {editableRows[inventory.billboardId] ? (
                                                                                                                <><span>{resolvedCurrencyCode}</span><input

                                                                                                                    type="text"
                                                                                                                    value={preferredPrices[inventory.billboardId] || ''}
                                                                                                                    onChange={(e) => handlePreferredPriceChange(inventory.billboardId, e)}
                                                                                                                    placeholder={resolvedCurrencyCode} /></>
                                                                                                            ) : (
                                                                                                                preferredPrices[inventory.billboardId] ? preferredPrices[inventory.billboardId] : 'Enter value'
                                                                                                            )}
                                                                                                        </td>
                                                                                                    )}
                                                                                                    <td className="text-center">{localCurrencyCode || storedCurrencyCodes} {inventory.billboardPeriodSubTotalPrice}</td>
                                                                                                    <td className="text-center">
                                                                                                        <div
                                                                                                            className="delete-container card_delete_container"
                                                                                                            onClick={() => handleDeleteItem(inventory.cartItemId)}
                                                                                                        >
                                                                                                            <i className="fas fa-trash-alt delete-icon card_delete_icon"></i>
                                                                                                            <span className="billboard-delete card_billboard_delete">Delete</span>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            ))
                                                                                    ) : (
                                                                                        <tr>
                                                                                            <td colSpan={8} className="text-center nodata-found-txt">
                                                                                                No data found
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan={8} className="text-center nodata-found-txt">
                                                                                            No data found
                                                                                        </td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>









                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="mb-3">
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <h5 className="semi-bold">Campaign Name</h5>
                                                                        <div className="input-group card_input_group_1">
                                                                            <input
                                                                                type="text"
                                                                                className="form-control border-bottom-only card_border_bottom_only"
                                                                                placeholder="Edit campaign name"
                                                                                value={campaignName}
                                                                                onChange={(e) => handleCampaignNameChanges(e.target.value)}
                                                                                aria-label="Campaign Name"
                                                                            />
                                                                            <span
                                                                                className="input-group-text search-icon card_search_icon"
                                                                                onClick={handleEditClick}
                                                                            >
                                                                                <img style={{ cursor: 'pointer' }} src={Image5} alt="Edit campaign" />
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="row">
                                                                    <div className="col-md-12 mt-3">
                                                                        <h5 className="semi-bold">Duration</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-6 mt-3">
                                                                        <div className="edit_campaign_date_start edit_campaign_date_starts d-flex align-items-center position-relative">
                                                                            <div onClick={toggleStartDatePicker} className="calendar-icon-wrapper">
                                                                                <img alt="Start Date" src={Image4} className="date-icon" />
                                                                            </div>
                                                                            <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleStartDatePicker}>
                                                                                <p>{format(startDate, "dd MMM yyyy")}</p>
                                                                            </div>
                                                                            {showStartDatePicker && (
                                                                                <div className="datepicker-wrapper">
                                                                                    <div className="close-icon" onClick={toggleStartDatePicker}>
                                                                                        ×
                                                                                    </div>
                                                                                    <p className="card_date_header">Select Campaign start date</p>
                                                                                    {showYearPicker ? (
                                                                                        <div className="year-picker">
                                                                                            <div className="header-container">
                                                                                                <button
                                                                                                    className="monthYearLeftArrow"
                                                                                                    onClick={(e) => { decreaseYear(e); }}
                                                                                                >
                                                                                                    {"«"}
                                                                                                </button>
                                                                                                <span className="montYearValue" onClick={toggleYearPicker}>
                                                                                                    {currentYear}
                                                                                                </span>
                                                                                                <button
                                                                                                    className="monthYearRightArrow"
                                                                                                    onClick={(e) => { increaseYear(e); }}
                                                                                                >
                                                                                                    {"»"}
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="years-grid">
                                                                                                {Array.from({ length: 10 }, (_, i) => (
                                                                                                    <button
                                                                                                        key={i}
                                                                                                        onClick={() => handleYearSelection(currentYear + i - 5)}
                                                                                                        className="year-button"
                                                                                                    >
                                                                                                        {currentYear + i - 5}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : showMonthPicker ? (
                                                                                        <div className="month-picker">
                                                                                            <div className="header-container">
                                                                                                <button
                                                                                                    className="monthYearLeftArrow"
                                                                                                    onClick={(e) => { decreaseYear(e); handleYearSelection(currentYear - 1); }}
                                                                                                >
                                                                                                    {"«"}
                                                                                                </button>
                                                                                                <span className="montYearValue" onClick={toggleMonthPicker}>
                                                                                                    {currentYear}
                                                                                                </span>
                                                                                                <button
                                                                                                    className="monthYearRightArrow"
                                                                                                    onClick={(e) => { increaseYear(e); handleYearSelection(currentYear + 1); }}
                                                                                                >
                                                                                                    {"»"}
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="months-grid">
                                                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                                                    <button
                                                                                                        key={i}
                                                                                                        onClick={() => handleMonthSelection(i)}
                                                                                                        className="month-button"
                                                                                                    >
                                                                                                        {format(new Date(2021, i), "MMM")}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <DatePicker
                                                                                            selected={tempStartDate}
                                                                                            onChange={handleStartDateChange}
                                                                                            inline
                                                                                            minDate={new Date()} // Block all dates before the current date
                                                                                            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
                                                                                                console.log("Current Year:", currentYear);
                                                                                                return (
                                                                                                    <div className="custom-header">
                                                                                                        <button
                                                                                                            onClick={(e) => { handleMonthButtonClick(e); decreaseMonth(); }}
                                                                                                        >
                                                                                                            {"«"}
                                                                                                        </button>
                                                                                                        <span onClick={toggleMonthPicker}>
                                                                                                            {format(date, "MMMM")}
                                                                                                        </span>
                                                                                                        <span onClick={toggleYearPicker}>
                                                                                                            {currentYear}
                                                                                                        </span>
                                                                                                        <button
                                                                                                            onClick={(e) => { handleMonthButtonClick(e); increaseMonth(); }}
                                                                                                        >
                                                                                                            {"»"}
                                                                                                        </button>
                                                                                                    </div>
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                    <button className="update-button" onClick={handleUpdateStartDate}>
                                                                                        Update
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6 mt-3">
                                                                        <div className="edit_campaign_date_end d-flex align-items-center position-relative">
                                                                            <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                                                                <img alt="End Date" src={Image4} className="date-icon" />
                                                                            </div>
                                                                            <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker}>
                                                                                <p>{format(endDate, "dd MMM yyyy")}</p>
                                                                            </div>
                                                                            {showEndDatePicker && (
                                                                                <div className="datepicker-wrapper mycart-datepickerend">
                                                                                    <div className="close-icon" onClick={toggleEndDatePicker}>
                                                                                        ×
                                                                                    </div>
                                                                                    <p className="card_date_header">Select Campaign end date</p>
                                                                                    {showYearPicker ? (
                                                                                        <div className="year-picker">
                                                                                            <div className="header-container">
                                                                                                <button
                                                                                                    className="monthYearLeftArrow"
                                                                                                    onClick={(e) => { decreaseYear(e); }}
                                                                                                >
                                                                                                    {"«"}
                                                                                                </button>
                                                                                                <span className="montYearValue" onClick={toggleYearPicker}>
                                                                                                    {currentYear}
                                                                                                </span>
                                                                                                <button
                                                                                                    className="monthYearRightArrow"
                                                                                                    onClick={(e) => { increaseYear(e); }}
                                                                                                >
                                                                                                    {"»"}
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="years-grid">
                                                                                                {Array.from({ length: 10 }, (_, i) => (
                                                                                                    <button
                                                                                                        key={i}
                                                                                                        onClick={() => handleYearSelection(currentYear + i - 5)}
                                                                                                        className="year-button"
                                                                                                    >
                                                                                                        {currentYear + i - 5}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : showMonthPicker ? (
                                                                                        <div className="month-picker">
                                                                                            <div className="header-container">
                                                                                                <button
                                                                                                    className="monthYearLeftArrow"
                                                                                                    onClick={(e) => { decreaseYear(e); handleYearSelection(currentYear - 1); }}
                                                                                                >
                                                                                                    {"«"}
                                                                                                </button>
                                                                                                <span className="montYearValue" onClick={toggleMonthPicker}>
                                                                                                    {currentYear}
                                                                                                </span>
                                                                                                <button
                                                                                                    className="monthYearRightArrow"
                                                                                                    onClick={(e) => { increaseYear(e); handleYearSelection(currentYear + 1); }}
                                                                                                >
                                                                                                    {"»"}
                                                                                                </button>
                                                                                            </div>
                                                                                            <div className="months-grid">
                                                                                                {Array.from({ length: 12 }, (_, i) => (
                                                                                                    <button
                                                                                                        key={i}
                                                                                                        onClick={() => handleMonthSelection(i)}
                                                                                                        className="month-button"
                                                                                                    >
                                                                                                        {format(new Date(2021, i), "MMM")}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <DatePicker
                                                                                            selected={tempEndDate}
                                                                                            onChange={handleEndDateChange}
                                                                                            inline
                                                                                            // minDate={new Date()}
                                                                                            minDate={startDate ? addDays(startDate, 1) : new Date()}
                                                                                            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
                                                                                                console.log("Current Year:", currentYear);
                                                                                                return (
                                                                                                    <div className="custom-header">
                                                                                                        <button
                                                                                                            onClick={(e) => { handleMonthButtonClick(e); decreaseMonth(); }}
                                                                                                        >
                                                                                                            {"«"}
                                                                                                        </button>
                                                                                                        <span onClick={toggleMonthPicker}>
                                                                                                            {format(date, "MMMM")}
                                                                                                        </span>
                                                                                                        <span onClick={toggleYearPicker}>
                                                                                                            {currentYear}
                                                                                                        </span>
                                                                                                        <button
                                                                                                            onClick={(e) => { handleMonthButtonClick(e); increaseMonth(); }}
                                                                                                        >
                                                                                                            {"»"}
                                                                                                        </button>
                                                                                                    </div>
                                                                                                );
                                                                                            }}
                                                                                        />
                                                                                    )}
                                                                                    <button className="update-button" onClick={handleUpdateEndDate}>
                                                                                        Update
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="mt-4">
                                                                            <h6 className="card_checkbox_head_1">Reporting structure <span className="card_checkbox_head_2">(Select at least one)</span></h6>
                                                                            <h6 className="card_check_icon_msg"><img src={Image6} alt="" />Choose reports to be received for this campaign</h6>
                                                                            {isFieldEnabled("proof of play", config) && (
                                                                                <div className="form-check">
                                                                                    <span>
                                                                                        <input className="form-check-input card_checkbox_content card_form-check-input" type="checkbox" id="delivery-report" checked={isNegotiationCheckedProof} onChange={handleProof} />
                                                                                        <label className="form-check-label checkbox-label card_checkbox_content" htmlFor="proof-of-play"  >
                                                                                            Proof of play
                                                                                        </label>
                                                                                    </span>

                                                                                </div>
                                                                            )}
                                                                            {isFieldEnabled("post campaign report", config) && (
                                                                                <div className="form-check">
                                                                                    <input className="form-check-input card_checkbox_content card_form-check-input" type="checkbox" id="post-campaign-report" checked />
                                                                                    <label className="form-check-label checkbox-label card_checkbox_content" htmlFor="post-campaign-report">
                                                                                        PCR (Post Campaign Report)
                                                                                    </label>
                                                                                </div>
                                                                            )}
                                                                            {isFieldEnabled("play log", config) && (
                                                                                <div className="form-check">
                                                                                    <input className="form-check-input card_checkbox_content card_form-check-input" type="checkbox" id="delivery-report" checked={isNegotiationCheckedDelivery} onChange={handleDelete} />
                                                                                    <label className="form-check-label checkbox-label card_checkbox_content" htmlFor="delivery-report" >
                                                                                        Delivery report
                                                                                    </label>
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="mt-4 card_amount_section">
                                                                            <h6 className="card_checkbox_data_head">Overall campaign duration days: {length}</h6>
                                                                            <div>
                                                                                <div className="d-flex card_checkbox_data_c">
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_1">Sub-total</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_s">{localCurrencyCode || storedCurrencyCodes} </p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_e text-end">{totalNet}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="d-flex card_checkbox_data_c">
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_1">{gstValue} ({percentage}%)</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_s">{localCurrencyCode || storedCurrencyCodes}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_e text-end">{overAlltotalTax}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="d-flex card_checkbox_data_co">
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_01">Net total</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_s1">{localCurrencyCode || storedCurrencyCodes}</p>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="card_checkbox_data_e1 text-end">{alltotalPrice}</p>
                                                                                    </div>
                                                                                </div>

                                                                            </div>
                                                                            <div className="align-self-end">
                                                                                <div className="form-check card_term_condition card_term_con">
                                                                                    <input
                                                                                        className="form-check-input card_checkbox_content card_check_sub1"
                                                                                        type="checkbox"
                                                                                        id="terms-conditions"
                                                                                        checked={isChecked}
                                                                                        onChange={handleCheckboxChange}
                                                                                    />                                                                            <label className="form-check-label checkbox-label card_checkbox_content card_check_sub" htmlFor="terms-conditions">
                                                                                        <span className="text-primary card_chack_prime">By clicking this checkbox,</span> I agree to the terms and conditions.
                                                                                    </label>
                                                                                </div>



                                                                                {showSaveAndRequest && (
                                                                                    <>
                                                                                        <button className="btn card_save_btn" onClick={() => handleCampaignAction("Save draft")}>
                                                                                            Save draft
                                                                                        </button>
                                                                                        <button
                                                                                            className="btn card_req_btn btn-primary"
                                                                                            disabled={!isChecked}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#exampleModal"

                                                                                        >
                                                                                            Request for approval
                                                                                        </button>
                                                                                    </>
                                                                                )}

                                                                                {showRequestOnly && (
                                                                                    <button
                                                                                        className="btn card_req_btn btn-primary"
                                                                                        disabled={!isChecked}
                                                                                        data-bs-toggle="modal"
                                                                                        data-bs-target="#exampleModal"

                                                                                    >
                                                                                        Request for approval
                                                                                    </button>
                                                                                )}





                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                </div>


                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/*Delete Modal */}
                <div className="modal fade" id="deleteModal" aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header cart-delete-header">
                                <h5 className="modal-title cart-delete-title" id="deleteModalLabel">Delete Item ?</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body cart-delete-body">
                                <h3 className="delete-bin"><i className="fa-solid fa-trash-arrow-up"></i></h3>
                                <h6>Do you want to delete this item ?</h6>
                            </div>
                            <div className="modal-footer cart-delete-footer">
                                <button type="button" className="cart-cancel" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="cart-delete" onClick={confirmDelete} data-bs-dismiss="modal">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Terms & condition */}
                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header term-header">
                                <h5 className="modal-title terms-title" id="exampleModalLabel">Terms & conditions</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body term-body">
                                <p>{termss}</p>
                            </div>
                            <div className="modal-footer term-footer">
                                <button type="button" className="btn-term-proceed" data-bs-toggle="modal" data-bs-target="#proccedconfirmsubmit">Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Proceed confirm */}
                <div className="modal fade" id="proccedconfirmsubmit" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header proceedconfirm-header">
                                <h4 className="modal-title proceedconfirm-title" id="exampleModalLabel">Acknowledgement Message</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body proceedconfirm-body">
                                <img src={CartDownload} />
                                <h6 className="basic-acknowledgepopup">Are you sure you want to generate the
                                    proposal for this deal?</h6>
                            </div>
                            <div className="modal-footer proceedconfirm-footer">
                                <button type="button" className="term-cancel" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="term-submit" onClick={() => handleCampaignAction(isNegotiationChecked ? "NEGOTIATION_REQUESTED" : "REQUESTED")} data-bs-dismiss="modal" >Submit</button>                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="request_success" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header proceedconfirm-header">
                                <h4 className="modal-title proceedconfirm-title" id="exampleModalLabel">Success message</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body proceedconfirm-body">
                                <img src={CartSuccess} />
                                <h6 className="payment-letterss">Request for approval sent</h6>
                            </div>
                            <div className="modal-footer proceedconfirm-footer d-flex justify-content-center w-100">
                                <button type="button" className="term-cancel" data-bs-dismiss="modal" onClick={() => { navigate(`${process.env.REACT_APP_BASE_PATH}/my-campaigns`) }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AuthLayout>
    );
}

export default MyCartDetails;

