import React, { Component, useEffect, useState } from "react";
import AuthLayout from "../../layouts/auth";
import { Link, Navigate, useLocation } from "react-router-dom";
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
import NoImage from "../../assets/images/nomedia.jpg";
import { toast } from "react-toastify";
import { CART_INITIAL_QUERY, CART_PAGE_ITEM, CREATE_CHECKOUT_SESSION, DELETE_CART_PAGE, INVOICE, NEGOTIATE_CAMPAIGN_SEND_REQUEST, REQUEST_FOR_APPROVAL } from "../../Graphql/Queries";
import client from "../../Graphql/apolloClient";
import { useMutation, useQuery } from "@apollo/client";
import { log } from "console";

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
    billboardTotalPrice: number;
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
    name: string;
    inventoryType: string;
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
    billboardtotalPrice: string;
    billboardLatitude: string;
    billboardVenueType: string;
    billboardLongitude: string;
    billboardResolutionWidth: string;
    billboardResolutionHeight: string;
}

interface Billboard {
    inventoryPrice: string;
    inventoryResolutions: any;
    inventoryReports: any;
    availableBooking: any;
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

const PaymentPending: React.FC<{ currencyCode: any }> = ({ currencyCode }) => {
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
    const [startDate, setStartDate] = useState<Date>(() => new Date());
    const [endDate, setEndDate] = useState<Date>(() => new Date());
    const [redirect, setRedirect] = useState(false);
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
    const [loading, setLoading] = useState(false);
    const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
    const [isChecked, setIsChecked] = useState(false);

    const [billboardCurrencyCode, setBillboardCurrencyCode] = useState<string>("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [camName, setCampaignName] = useState('')
    const [subTotal, setSubTotal] = useState('')
    const [gst, setGst] = useState('')
    const [gstName, setGstName] = useState('')
    const [netTotal, setNetTotal] = useState('')
    const [dealId, setDealId] = useState('')
    const [invId, setInvId] = useState('')
    const [images, setImages] = useState('')
    const [accessKey, setAccessKey] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [url, setUrl] = useState('')
    const selectedCampaignId = localStorage.getItem('selectedCampaignId');
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userEmail = localStorage.getItem('userEmail');
    const [available, setAvailable] = useState('')
    let currentDomain = window.location.origin;


    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setTempStartDate(date);
            setShowMonthPicker(false);
            setShowYearPicker(false);
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setTempEndDate(date);
            setShowMonthPicker(false);
            setShowYearPicker(false);
        }
    };

    const toggleStartDatePicker = () => {
        setShowStartDatePicker(!showStartDatePicker);
        setTempStartDate(startDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const toggleEndDatePicker = () => {
        setShowEndDatePicker(!showEndDatePicker);
        setTempEndDate(endDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const toggleMonthPicker = () => {
        setShowMonthPicker(!showMonthPicker);
        setShowYearPicker(false);
    };

    const toggleYearPicker = () => {
        setShowYearPicker(!showYearPicker);
        setShowMonthPicker(false);
    };

    const handleMonthSelection = (month: number) => {
        const newStartDate = new Date(tempStartDate);
        const newEndDate = new Date(tempEndDate);
        newStartDate.setMonth(month);
        newEndDate.setMonth(month);

        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedMonth(month);
        setShowMonthPicker(false);
    };

    const handleYearSelection = (year: number) => {
        const newStartDate = new Date(tempStartDate);
        const newEndDate = new Date(tempEndDate);
        newStartDate.setFullYear(year);
        newEndDate.setFullYear(year);

        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedYear(year);
        setShowYearPicker(false);
    };

    const handleUpdateStartDate = () => {
        setStartDate(tempStartDate);
        setShowStartDatePicker(false);
    };

    const handleUpdateEndDate = () => {
        setEndDate(tempEndDate);
        setShowEndDatePicker(false);
    };
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
    };


    const [createCheckoutSession, { data: payment, loading: payLoading, error: payError }] = useMutation(CREATE_CHECKOUT_SESSION);





    // Invoice Qurey

    const { error, data } = useQuery(INVOICE, {
        variables: {
            accessToken: token,
            campId: selectedCampaignId,
        },
    });

    useEffect(() => {
        if (data) {
            const campaignData = data.paymentInvoice;
            setCampaignName(campaignData.name)
            setPotentialViews(campaignData?.summaryReport?.potentialViews || 'N/A');
            setUniqueReach(campaignData?.summaryReport?.uniqueReach || 'N/A');
            setDealId(campaignData?.dealId)
            setInvId(campaignData?.id)
            setTotalNet(
                campaignData?.summaryReport?.averageFrequency
                    ? campaignData.summaryReport.averageFrequency.toFixed(2)
                    : 'N/A'
            );
            setSubTotal(campaignData?.priceSummary?.subTotal.toFixed(2))
            setNetTotal(campaignData?.priceSummary?.netTotal)
            setGst(campaignData?.priceSummary?.tax?.value.toFixed(2))
            setGstName(campaignData?.priceSummary?.tax?.name)
            setBillboardCurrencyCode(localCurrencyCode || storedCurrencyCodes);
            setStartDate(new Date(campaignData?.startDate.date));
            setEndDate(new Date(campaignData?.endDate.date));
            setImages(campaignData?.campaignInventories[0]?.inventoryThumbnailUrl)
        }


    }, [data, loading]);



    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Find the "Tech configuration" object
                const techConfig = data.find((page: { name: string }) => page.name === "Tech configuration");

                if (techConfig) {
                    // Find the "payment gateway configuration" within the configurations array
                    const paymentConfig = techConfig.configurations.find((config: { key: string }) => config.key === "payment gateway configuration");

                    if (paymentConfig) {
                        // Extract the access and secret keys from the fields array
                        const accessKey = paymentConfig.fields.find((field: { key: string }) => field.key === "payment access key")?.default || "";
                        const secretKey = paymentConfig.fields.find((field: { key: string }) => field.key === "payment secret key")?.default || "";

                        setAccessKey(accessKey);
                        setSecretKey(secretKey);


                    } else {
                        console.error("Payment gateway configuration not found.");
                    }
                } else {
                    console.error("Tech configuration not found.");
                }
            } catch (error) {
                console.error("Error fetching config data:", error);
            }
        };

        fetchConfig();
    }, []); //




    // Table Values Loop Method

    const invoice = data?.paymentInvoice;
    const isMatchingCampaign = invoice && invoice?.id === selectedCampaignId;



    const digitalBillboards: Billboard[] = isMatchingCampaign
        ? invoice?.campaignInventories.filter((inventory: Billboard) => inventory.inventoryType === 'digital')
        : [];
    const classicBillboards: Billboard[] = isMatchingCampaign
        ? invoice?.campaignInventories.filter((inventory: Billboard) => inventory.inventoryType === 'classic')
        : [];

    const today = new Date();
    const tomorrow = addDays(today, 0);



    // State to store total days
    const [totalDays, setTotalDays] = useState<number>(0);

    // Function to calculate total days between start and end dates
    const calculateTotalDays = (startDate: Date, endDate: Date) => {
        const timeDiff = endDate.getTime() - startDate.getTime();
        const totalDays = timeDiff / (1000 * 3600 * 24); // Convert milliseconds to days
        return totalDays;
    };

    // Recalculate total days when startDate or endDate changes
    useEffect(() => {
        if (startDate && endDate) {
            const days = calculateTotalDays(startDate, endDate);
            setTotalDays(days);
        }
    }, [startDate, endDate]);

    const handlePaymentPending = async () => {
        try {
            const { data } = await createCheckoutSession({
                variables: {
                    basket: {
                        id: invId,
                        accessToken: token,
                        price: netTotal,
                        campaignName: camName,
                        dealId: dealId,
                        email: userEmail,
                        userId: userId,
                        currency: billboardCurrencyCode,

                    },
                    payPublicKey: accessKey,
                    paySecretKey: secretKey,
                    siteType: 'react',
                    currentDomain: currentDomain,
                },
            });


            const { url } = data.createCheckoutSession;
            // Redirect user to the Stripe checkout page
            if (url) {
                window.location.href = url;
            } else {
                toast.error("Payment session creation failed. Please try again.");
            }

        } catch (err) {
            console.error("Error creating checkout session:", err);
        }
    };


    const length = differenceInCalendarDays(new Date(endDate), new Date(startDate));
    // Campaign Name Edit

    const handleEditClick = () => {
        // Safely find the input element
        setIsDisabled(false)
        const inputElement = document.querySelector('.form-control') as HTMLInputElement | null;
        // Check if the element exists and focus it
        if (inputElement) {
            inputElement.focus();
        } else {
            console.error('Input element not found.');
        }
    };
    const [percentage, setPercentage] = useState('')



    useEffect(() => {
        const userAccountData = localStorage.getItem('userAccountData');


        if (userAccountData) {
            try {
                const parsedData = JSON.parse(userAccountData);
                setPercentage(parsedData[0]?.country?.tax?.percent)
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        } else {
            console.error("No user account data found in local storage.");
        }
    }, []);

    // Bcak to propert page

    const backToPropertList = () => {
        setRedirect(true);
    };

    if (redirect) {
        return <Navigate to={`${process.env.REACT_APP_BASE_PATH}/propertylist`} />;
    }
    let backLink = `${process.env.REACT_APP_BASE_PATH}/my-campaigns`;
    return (
        <AuthLayout>
            <>
                <div className="my-cart-page skyblue-bg">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="mt-2">
                                    <div className="navbar-back-btn"><img alt="" src={BackIcon} /><Link to={backLink}> Back</Link></div>
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
                                        <div className="row">

                                            <div className="col-md-8 pt-4 border-right-1">

                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <div className="row mb-3 summary">
                                                            <div className="col-md-3">
                                                                <p className="label">Potential views(?)</p>
                                                                <p> {potentialViews}</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <p className="label">Unique reach(?)</p>
                                                                <p> {uniqueReach}</p>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <p className="label">Average frequency(?)</p>
                                                                <p>{totalNet}</p>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <hr className="my-3" />
                                                            </div>
                                                        </div>
                                                        <div className="row">

                                                            <div className="col-md-12 mt-4">
                                                                <h5 className="gray">Digital Billboards <span className=" badge">{digitalBillboards.length} </span></h5>
                                                            </div>

                                                            <div className="col-md-12">
                                                                <div className="mycart-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                                    <div className="col-12">
                                                                        <hr />
                                                                    </div>
                                                                    <table className="table  table-hover">
                                                                        {/* Table Header */}
                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th className="card_list_header">Billboard Name</th>
                                                                                <th className="card_list_header"></th>
                                                                                <th className="card_list_header card_list_headers">Impressions</th>
                                                                                <th className="card_list_header card_llist_header">Size/Resolution</th>

                                                                                <th className="card_list_header card_llist_header">Price</th>

                                                                            </tr>
                                                                        </thead>

                                                                        {/* Table Body */}
                                                                        <tbody>
                                                                            {digitalBillboards.length > 0 ? (
                                                                                // Ensure the inventoryType is "DIGITAL_BILLBOARD" before mapping
                                                                                digitalBillboards.filter(inventory => inventory.inventoryType === "digital").length > 0 ? (
                                                                                    digitalBillboards
                                                                                        .filter(inventory => inventory.inventoryType === "digital") // Filter for digital billboards
                                                                                        .map((inventory) => (
                                                                                            <tr key={inventory.id} className="table-row billboard-row card_list_data">
                                                                                                <td>
                                                                                                    <img
                                                                                                        src={inventory.inventoryThumbnailUrl && inventory.inventoryThumbnailUrl !== "null" ? inventory.inventoryThumbnailUrl : NoImage}
                                                                                                        alt={inventory.inventoryName}
                                                                                                        className="billboard-img card_list_img img-fluid"
                                                                                                    />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <p className="semi-bold">{inventory.inventoryName}</p>
                                                                                                    <span className={`badge ${inventory?.availableBooking ? 'badge-success' : 'badge-danger'}`}>
                                                                                                        {inventory?.availableBooking ? 'Available' : 'Not Available'}
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td>{inventory.inventoryReports.totalPotentialViews}</td>
                                                                                                <td>
                                                                                                    {inventory.inventoryResolutions ? `${inventory.inventoryResolutions.width} x ${inventory.inventoryResolutions.height}` : 'N/A'}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {billboardCurrencyCode} {inventory.inventoryPrice || 'N/A'}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan={5} className="text-center nodata-found-txt">
                                                                                            No data found
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan={5} className="text-center nodata-found-txt">
                                                                                        No data found
                                                                                    </td>
                                                                                </tr>
                                                                            )}
                                                                        </tbody>

                                                                    </table>
                                                                </div>
                                                            </div>




                                                            <div className="col-md-12 mt-4">
                                                                <h5 className="gray">Classic Billboards <span className=" badge">{classicBillboards.length}</span></h5>
                                                            </div>


                                                            <div className="col-md-12">
                                                                <div className="mycart-scrollbar" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                                                    <div className="col-12">
                                                                        <hr />
                                                                    </div>
                                                                    <table className="table  table-hover">
                                                                        {/* Table Header */}
                                                                        <thead className="thead-dark">
                                                                            <tr>
                                                                                <th className="card_list_header">Billboard Name</th>
                                                                                <th className="card_list_header"></th>
                                                                                <th className="card_list_header card_list_headers">Impressions</th>
                                                                                <th className="card_list_header card_llist_header">Size/Resolution</th>

                                                                                <th className="card_list_header card_llist_header">Price</th>

                                                                            </tr>
                                                                        </thead>

                                                                        {/* Table Body */}
                                                                        <tbody>
                                                                            {classicBillboards.length > 0 ? (
                                                                                // Ensure the inventoryType is "DIGITAL_BILLBOARD" before mapping
                                                                                classicBillboards.filter(inventory => inventory.inventoryType === "clasic").length > 0 ? (
                                                                                    classicBillboards
                                                                                        .filter(inventory => inventory.inventoryType === "clasic") // Filter for digital billboards
                                                                                        .map((inventory) => (
                                                                                            <tr key={inventory.id} className="table-row billboard-row card_list_data">
                                                                                                <td>
                                                                                                    <img
                                                                                                        src={inventory.inventoryThumbnailUrl && inventory.inventoryThumbnailUrl !== "null" ? inventory.inventoryThumbnailUrl : NoImage}
                                                                                                        alt={inventory.inventoryName}
                                                                                                        className="billboard-img card_list_img img-fluid"
                                                                                                    />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <p className="semi-bold">{inventory.inventoryName}</p>
                                                                                                    <span className={`badge ${inventory?.availableBooking ? 'badge-success' : 'badge-danger'}`}>
                                                                                                        {inventory?.availableBooking ? 'Available' : 'Not Available'}
                                                                                                    </span>
                                                                                                </td>
                                                                                                <td>{inventory.inventoryReports.totalPotentialViews}</td>
                                                                                                <td>
                                                                                                    {inventory.inventoryResolutions ? `${inventory.inventoryResolutions.width} x ${inventory.inventoryResolutions.height}` : 'N/A'}
                                                                                                </td>
                                                                                                <td>
                                                                                                    {billboardCurrencyCode} {inventory.inventoryPrice || 'N/A'}
                                                                                                </td>
                                                                                            </tr>
                                                                                        ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan={5} className="text-center nodata-found-txt">
                                                                                            No data found
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            ) : (
                                                                                <tr>
                                                                                    <td colSpan={5} className="text-center nodata-found-txt">
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
                                                                            value={camName}
                                                                            disabled
                                                                            onChange={(e) => setCampaignName(e.target.value)}
                                                                            aria-label="Campaign Name"
                                                                        />
                                                                        <span
                                                                            className="input-group-text search-icon card_search_icon"
                                                                            onClick={handleEditClick}
                                                                            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                                                                        >
                                                                            <img style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} src={Image5} alt="Edit campaign" />
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div>


                                                            {/* Duration */}

                                                            <div className="row">
                                                                <div className="col-md-12 mt-3">
                                                                    <h5 className="semi-bold">Duration</h5>
                                                                </div>
                                                            </div>

                                                            <div className="row">

                                                                {/* <div className="col-md-6 mt-3">
                            <div className="edit_campaign_date_start edit_campaign_date_starts d-flex align-items-center position-relative">
                                <div onClick={toggleStartDatePicker} className="calendar-icon-wrapper">
                                    <img alt="Start Date" src={Image4} className="date-icon calendar-icon-wrapper" />
                                </div>
                                <div className="date-text-1">
                                <p>{startDate ? format(startDate, "dd MMM yyyy") : "Select a start date"}</p>

                                   
                                    
                                </div>
                                {showStartDatePicker && (
                                    <div className="datepicker-wrapper property-list-date-wrapper">
                                        <div className="close-icon" onClick={toggleStartDatePicker}>×</div>
                                        <p className="card_date_header">Select Campaign start date</p>
                                        {showYearPicker ? (
                                            <div className="year-picker">
                                                <div className="years-grid">
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <button key={i} onClick={() => handleYearSelection(selectedYear + i)} className="year-button">
                                                            {selectedYear + i}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : showMonthPicker ? (
                                            <div className="month-picker">
                                                <div className="months-grid">
                                                    {Array.from({ length: 12 }, (_, i) => (
                                                        <button key={i} onClick={() => handleMonthSelection(i)} className="month-button">
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
                                                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                    <div className="custom-header">
                                                        <button onClick={decreaseMonth}>{"«"}</button>
                                                        <span onClick={toggleMonthPicker}>{format(date, "MMMM")}</span>
                                                        <span onClick={toggleYearPicker}>{format(date, "yyyy")}</span>
                                                        <button onClick={increaseMonth}>{"»"}</button>
                                                    </div>
                                                )}
                                            />
                                        )}
                                        <button className="update-button" onClick={handleUpdateStartDate}>Update</button>
                                    </div>
                                )}
                            </div>
                         
                            </div> */}

                                                                <div className="row">
                                                                    <div className="col-md-6 mt-3" style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.8 : 1 }}>
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
                                                                                            <div className="years-grid">
                                                                                                {Array.from({ length: 10 }, (_, i) => (
                                                                                                    <button
                                                                                                        key={i}
                                                                                                        onClick={() => handleYearSelection(selectedYear + i)}
                                                                                                        className="year-button"
                                                                                                    >
                                                                                                        {selectedYear + i}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : showMonthPicker ? (
                                                                                        <div className="month-picker">
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
                                                                                            minDate={tomorrow}
                                                                                            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                                                                <div className="custom-header">
                                                                                                    <button onClick={decreaseMonth}>{"«"}</button>
                                                                                                    <span onClick={toggleMonthPicker}>
                                                                                                        {format(date, "MMMM")}
                                                                                                    </span>
                                                                                                    <span onClick={toggleYearPicker}>
                                                                                                        {format(date, "yyyy")}
                                                                                                    </span>
                                                                                                    <button onClick={increaseMonth}>{"»"}</button>
                                                                                                </div>
                                                                                            )}
                                                                                        />
                                                                                    )}
                                                                                    <button className="update-button" onClick={handleUpdateStartDate}>
                                                                                        Update
                                                                                    </button>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6 mt-3" style={{ pointerEvents: isDisabled ? 'none' : 'auto', opacity: isDisabled ? 0.8 : 1 }}>
                                                                        <div className="edit_campaign_date_end d-flex align-items-center position-relative">
                                                                            <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                                                                <img alt="End Date" src={Image4} className="date-icon" />
                                                                            </div>
                                                                            <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker}>
                                                                                <p>{format(endDate, "dd MMM yyyy")}</p>
                                                                            </div>
                                                                            {showEndDatePicker && (
                                                                                <div className="datepicker-wrapper payment-pending-datepicker">
                                                                                    <div className="close-icon" onClick={toggleEndDatePicker}>
                                                                                        ×
                                                                                    </div>
                                                                                    <p className="card_date_header">Select Campaign end date</p>
                                                                                    {showYearPicker ? (
                                                                                        <div className="year-picker">
                                                                                            <div className="years-grid">
                                                                                                {Array.from({ length: 10 }, (_, i) => (
                                                                                                    <button
                                                                                                        key={i}
                                                                                                        onClick={() => handleYearSelection(selectedYear + i)}
                                                                                                        className="year-button"
                                                                                                    >
                                                                                                        {selectedYear + i}
                                                                                                    </button>
                                                                                                ))}
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : showMonthPicker ? (
                                                                                        <div className="month-picker">
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
                                                                                            // minDate={tomorrow}
                                                                                            minDate={startDate ? addDays(startDate, 1) : new Date()}
                                                                                            renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                                                                <div className="custom-header">
                                                                                                    <button onClick={decreaseMonth}>{"«"}</button>
                                                                                                    <span onClick={toggleMonthPicker}>
                                                                                                        {format(date, "MMMM")}
                                                                                                    </span>
                                                                                                    <span onClick={toggleYearPicker}>
                                                                                                        {format(date, "yyyy")}
                                                                                                    </span>
                                                                                                    <button onClick={increaseMonth}>{"»"}</button>
                                                                                                </div>
                                                                                            )}
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




                                                            </div>

                                                            <div className="row">
                                                                <div className="col-md-12">


                                                                    <div className="mt-4 card_amount_section">
                                                                        <h6 className="card_checkbox_data_head">Overall campaign duration days: {length}</h6>
                                                                        <div>
                                                                            <div className="d-flex card_checkbox_data_c">
                                                                                <div>
                                                                                    <p className="card_checkbox_data_1">Sub-total</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="card_checkbox_data_s">{billboardCurrencyCode} </p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="card_checkbox_data_e text-end">{subTotal}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex card_checkbox_data_c">
                                                                                <div>
                                                                                    <p className="card_checkbox_data_1">{gstName} ({percentage}%)</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="card_checkbox_data_s">{billboardCurrencyCode}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="card_checkbox_data_e text-end">{gst}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="d-flex card_checkbox_data_co">
                                                                                <div>
                                                                                    <p className="card_checkbox_data_01">Net total</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="card_checkbox_data_s1">{billboardCurrencyCode}</p>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="card_checkbox_data_e1 text-end">{netTotal}</p>
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                        <div className="align-self-end">






                                                                            <button data-bs-toggle="modal" data-bs-target="#proccedconfirmsubmit" style={{ marginLeft: '0', marginTop: '40px' }} className="card_save_btns proceed-btn" >
                                                                                Proceed To Pay
                                                                            </button>










                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </div>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>




                {/* Proceed confirm */}
                <div className="modal fade" id="proccedconfirmsubmit" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header proceedconfirm-header">
                                <h4 className="modal-title proceedconfirm-title" id="exampleModalLabel">Payment Confirmation</h4>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body proceedconfirm-body">
                                <i className="fa-regular fa-credit-card credit-card"></i>
                                <h6 className="payment-letter">Are you sure you want to generate the
                                    proposal for this deal?</h6>
                            </div>
                            <div className="modal-footer proceedconfirm-footer d-flex justify-content-center w-100">
                                <button type="button" className="term-cancel" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" className="term-submit" onClick={handlePaymentPending} data-bs-dismiss="modal" >Pay</button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="proccedconfirmsubmits" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header proceedconfirm-header">

                                {/* <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> */}
                            </div>
                            <div className="modal-body proceedconfirm-body">
                                <i className="fa-regular fa-credit-card credit-card"></i>
                                <h6 className="payment-letter">
                                    Payment successful !
                                    Thank you for making the payment
                                </h6>
                            </div>
                            <div className="modal-footer proceedconfirm-footer proceedconfirm-footers d-flex justify-content-center w-100">

                                <button type="button" onClick={backToPropertList} className="term-submit" data-bs-dismiss="modal" >Back to Property listing page</button>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        </AuthLayout>
    );
}

export default PaymentPending;

