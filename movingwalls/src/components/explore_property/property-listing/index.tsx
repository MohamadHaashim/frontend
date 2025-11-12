import React, { Component, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import Image1 from "../../../assets/images/search.svg";
import Image2 from "../../../assets/images/group-212841306.svg";
import Image3 from "../../../assets/images/mappin.svg";
import Image6 from "../../../assets/images/cart-icon.svg";
import Image5 from "../../../assets/images/sliders@2x.png";
import Image7 from "../../../assets/images/calendar.jpg";
import Image8 from "../../../assets/images/vector-41.svg";
import Image9 from "../../../assets/images/group-21.svg";
import NoImage from "../../../assets/images/nomedia.jpg";
import DatePicker from "react-datepicker";
import LogoImage from "../../../assets/brand/your-logo.svg";
import './index.css';
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";
import client, { MAPBOX_TOKEN } from "../../../Graphql/apolloClient";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { toast } from "react-toastify";
import { generateMockData } from "../../../Graphql/MockData";
import { AUTHENTICATE_MUTATION, GET_DISTRICT_LIST, GET_STATE_LIST, PROPERTY_LIST_VENUE_TYPE_LIST, SUBMIT_ENQUIRY, USER_ACCOUNT_QUERY } from "../../../Graphql/Queries";
import { Badge, Spinner } from "react-bootstrap";
import { addDays } from 'date-fns';

type SubCategory = {
    id: string;
    name: string;
    value: string;
    child?: GrandSubCategory[];
};
type GrandSubCategory = {
    id: string;
    name: string;
    value: string;
};
type Category = {
    id: string;
    name: string;
    value: string;
    child: SubCategory[];
};
interface Inventory {
    dealId: string;
    inventoryVenueType: string;
    description: string;
    name: string;
    inventoryType: string;
    inventoryResolution: string;
    inventoryId: string;
    inventoryName: string;
    inventoryThumbnailUrl: string;
    inventoryAddress: string;
    inventoryReferenceId: string;
    inventoryReports: {
        totalPotentialViews: number;
    };
    inventoryLatitude?: number;
    inventoryLongitude?: number;
    nowPayPrice: any;
    reasonForRejection: string;
}
interface SssItem {
    id: string;
    cartItemId: string;
    [key: string]: any;
}
const BillBoardListingExploreProperty = (props: any) => {
    const navigate = useNavigate();
    const { currencyCode } = props;
    const [showMap, setShowMap] = useState(false);
    const [id, setId] = useState(null);
    const [billBoardType, setBillBoardType] = useState(null);
    const [showLocationFilters, setShowLocationFilters] = useState(false);
    const [showLocationVenue, setShowLocationVenue] = useState(false);
    const [showLocationSite, setShowLocationSite] = useState(false);
    const [showLocationBill, setShowLocationBill] = useState(false);
    const [showLocationPrice, setShowLocationPrice] = useState(false);
    const [showLocationFinancial, setShowLocationFinancial] = useState(false);
    const [showLocationAirport, setShowLocationAirport] = useState(false);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [activeSubCategory, setActiveSubCategory] = useState<SubCategory | null>(null);
    const [activeGradSubCategory, setActiveGradSubCategory] = useState<GrandSubCategory | null>(null);
    const [activeCategoryLocation, setActiveCategoryLocation] = useState<string | null>();
    const [activeCategorySite, setActiveCategorySite] = useState<string | null>();
    const [activeCategoryBill, setActiveCategoryBill] = useState<string | null>();
    const [activeCategoryPrice, setActiveCategoryPrice] = useState<string | null>();
    const [activeCategoryAirports, setActiveCategoryAirports] = useState<string | null>();
    const [activeCategoryTransit, setActiveCategoryTransit] = useState<string | null>();
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
    const [badges, setBadges] = useState<string[]>([]);
    const location = useLocation();
    const cardData = location.state || {};
    const formData = cardData?.formData || {};
    const cartformData = cardData?.cartformData || {};
    const { startDate: startDateFromState, endDate: endDateFromState } = location.state?.formData || {};
    const currentDate = new Date();
    const monthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthendDate = new Date(currentDate?.getFullYear(), currentDate?.getMonth() + 1, 0);
    const [startDate, setStartDate] = useState<Date>(startDateFromState || currentDate);
    const [endDate, setEndDate] = useState<Date>(endDateFromState || monthendDate);
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [tempStartDate, setTempStartDate] = useState<Date>(startDate);
    const [tempEndDate, setTempEndDate] = useState<Date>(endDate);
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    //selectDatepopup
    const [startDates, setStartDates] = useState<Date>(startDateFromState || currentDate);
    const [endDates, setEndDates] = useState<Date>(endDateFromState || monthendDate);
    const [showStartDatePickers, setShowStartDatePickers] = useState<boolean>(false);
    const [showEndDatePickers, setShowEndDatePickers] = useState<boolean>(false);
    const [tempStartDates, setTempStartDates] = useState<Date>(startDate);
    const [tempEndDates, setTempEndDates] = useState<Date>(endDate);
    const [showMonthPickers, setShowMonthPickers] = useState<boolean>(false);
    const [showYearPickers, setShowYearPickers] = useState<boolean>(false);
    const [selectedMonths, setSelectedMonths] = useState<number>(currentDate.getMonth());
    const [selectedYears, setSelectedYears] = useState<number>(currentDate.getFullYear());
    //Submit date popup
    const [submitstartDates, setSubmitStartDates] = useState<Date | null>(currentDate);
    const [submitendDates, setSubmitEndDates] = useState<Date | null>(monthendDate);
    const [showSubmitStartDatePickers, setShowSubmitStartDatePickers] = useState<boolean>(false);
    const [showSubmitEndDatePickers, setShowSubmitEndDatePickers] = useState<boolean>(false);
    const [tempSubmitStartDates, setTempSubmitStartDates] = useState<Date | null>(submitstartDates);
    const [tempSubmitEndDates, setTempSubmitEndDates] = useState<Date | null>(submitendDates);
    const [showSubmitMonthPickers, setSubmitShowMonthPickers] = useState<boolean>(false);
    const [showSubmitYearPickers, setSubmitShowYearPickers] = useState<boolean>(false);
    const [selectedSubmitMonths, setSubmitSelectedMonths] = useState<number>(currentDate.getMonth());
    const [selectedSubmitYears, setSubmitSelectedYears] = useState<number>(currentDate.getFullYear());
    const [campaignName, setCampaignName] = useState<string>(
        formData?.campaignName || cartformData?.campaignName || 'Default Campaign'
    );
    localStorage.removeItem('campaignName')
    const [billBoardDataLoading, setBillBoardDataLoading] = useState(false);
    const [billBoardData, setBillBoardData] = useState<any>([]);
    const [soldCampaignViewDetails, setSoldCampaignViewDetails] = useState<any>({});
    const [cartData, setCartData] = useState<any>([{}]);
    // const [cartCount, setCartCount] = useState(formData.matchcartCount | 0);
    const exploreCartCount = localStorage.getItem("exploreCartCount")
    const [cartCount, setCartCount] = useState(exploreCartCount ? parseInt(exploreCartCount) : 0);
    // const [billboardType, setBillboardType] = useState("digital");
    const [billboardType, setBillboardType] = useState(formData?.propertyDetails ? formData?.propertyDetailsType : "digital");
    const dataListLength = 12;
    const [totalDataLength, setTotalDataLength] = useState(0);
    const [pageStartData, setPageStartData] = useState(0);
    const [pageEndData, setPageEndData] = useState(0);
    const [locationData, setLocationData] = useState<string[]>([]);
    const [venueTypeData, setVenueTypeData] = useState<string[]>([]);
    const [siteTypeData, setSitetypeData] = useState<string[]>([]);
    const [typeData, setTypeData] = useState<string[]>([]);
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapLat, setMapLat] = useState<number>(0);
    const [mapLng, setMapLng] = useState<number>(0);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup | null>(null);
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(localStorage.getItem('isPopupSubmited') || 'no');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginsubmit, setLoginSubmit] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [startDatesubmit, setstartDateSubmit] = useState(false);
    const [endDatesubmit, setendDateSubmit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [authenticate] = useMutation(AUTHENTICATE_MUTATION);
    const [submitEnquiry] = useMutation(SUBMIT_ENQUIRY);
    const [submitName, setSubmitName] = useState('');
    const [submitCompanyName, setSubmitCompanyName] = useState('');
    const [submitEmail, setSubmitEmail] = useState('');
    const [submitPhone, setSubmitPhone] = useState('');
    const [submitAddress, setSubmitAddress] = useState('');
    const [submitStartDate, setSubmitStartDate] = useState('');
    const [submitEndDate, setSubmitEndDate] = useState('');
    const [addedBillboardIds, setaddBillboardIds] = useState<string[]>([]);
    const successModalRef = useRef<any>(null);
    const [redirect, setRedirect] = useState<string | null>(null);
    const [loadings, setLoading] = useState(false);
    const modalRef = useRef<HTMLButtonElement | null>(null);
    const [errors, setError] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const [content, setContent] = useState<any[]>([]);
    const [yourLogo, setyourLogo] = useState<string>("");
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
                const data = await response.json();
                const value = data.find((page: any) => page.name === "Landing Page");
                setContent(value.fields);
                const logoLen = ((value.fields[0].components[0].components[1].components).length)
                for (let i = 0; i < logoLen; i++) {
                    if ((value.fields[0].components[0].components[1].components[i].key) == "MediumLogo") {
                        setyourLogo(value.fields[0].components[0].components[1].components[i].url)
                        break;
                    }

                }

            } catch (error) {
            }
        };

        fetchContent();
    }, []);
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoginSubmit(true);
        setLoadingLogin(true);

        if (!username || !password) {
            setLoginSubmit(false);
            setLoadingLogin(false);
            return;
        }

        const mediaOwnerCompanyId = companyId;
        const concatenatedUsername = `${username}:${mediaOwnerCompanyId}`;

        try {
            const { data, errors } = await authenticate({
                variables: {
                    username: concatenatedUsername,
                    password: password,
                }
            });
            if (errors && errors.length > 0) {
                const errorStatus = errors[0]?.extensions?.status_code;
                if (errorStatus === 400) {
                    toast.error("Invalid username or password");
                    setSubmit(false);
                    setLoading(false);
                    return;
                }
            }

            if (data?.authenticate?.authData?.accessToken) {
                const token = data.authenticate.authData.accessToken;
                document.getElementById("explore-login-close-btn")?.click();
                localStorage.setItem("authToken", token);
                const { data: userData } = await client.query({
                    query: USER_ACCOUNT_QUERY,
                    variables: { accessToken: token },
                });
                if (userData && userData.userAccount) {
                    const user = userData.userAccount[0];
                    const { firstName, lastName, country, id, login, email, companyId } = user;
                    localStorage.setItem("userAccountData", JSON.stringify(userData.userAccount));
                    localStorage.setItem("countryId", country.id);
                    localStorage.setItem("userId", id);
                    localStorage.setItem('userNameLogin', login);
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("companyId", companyId);
                    localStorage.setItem("userName", `${firstName} ${lastName}`);

                    const exploreData = {
                        exploreStartDate: format(startDates, 'yyyy-MM-dd'),
                        exploreEndDate: format(endDates, 'yyyy-MM-dd'),
                        exploreCondtion: true,
                        addedBillboardIds,
                        digitalTotalSize,
                        classicTotalSize
                    };

                    navigate(`${process.env.REACT_APP_BASE_PATH}/explorenew/create-campaign`, { state: { exploreData } });
                    toast.success("Login successful");

                } else {
                    toast.error("Failed to retrieve user details");
                }
            } else {
                toast.error("Invalid username or password");
            }

        } catch (error: any) {
            if (
                error instanceof ApolloError &&
                error.networkError &&
                "statusCode" in error.networkError &&
                (error.networkError as any).statusCode === 400
            ) {
                toast.error("Invalid username or password");
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoginSubmit(false);
            setLoadingLogin(false);
        }
    };


    //Submit Enquiry 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const phoneRegex = /^(\+91)?[0-9]{10,13}$/;
    const phoneRegex = /^\+(\d{1,4})\d{10,14}$/;
    const handleSubmitEnquiry = async (event: any) => {
        event.preventDefault();
        setError(null);
        setSubmit(true);
        setstartDateSubmit(true);
        setendDateSubmit(true);
        setLoading(true);
        if (!emailRegex.test(submitEmail)) {
            return;
        }
        if (submitPhone.length === 0 || !phoneRegex.test(submitPhone)) {
            return;
        }

        try {
            const response = await submitEnquiry({
                variables: {
                    name: submitName,
                    companyName: submitCompanyName,
                    email: submitEmail,
                    phone: submitPhone,
                    address: submitAddress,
                    startDate: submitstartDates ? format(submitstartDates, 'yyyy-MM-dd') : null,  // Check if startDate is not null
                    endDate: submitendDates ? format(submitendDates, 'yyyy-MM-dd') : null,  // Check if endDate is not null
                    addedBillboardIds,
                    companyId: companyId,
                    countryId: countryId,
                }
            });
            if (response.data.submitEnquiry.message) {
                document.getElementById("explore-login-submit-btn")?.click();
                setSubmit(false);
                setstartDateSubmit(false);
                setendDateSubmit(false);
                setLoading(false);
                if (successModalRef.current) {

                    const modal = new window.bootstrap.Modal(successModalRef.current);
                    modal.show();
                }
            } else if (response.data.errors && response.data.errors.length > 0) {
                const errorMessage = response.data.errors[0].message;
                toast.error(`Error: ${errorMessage}`);
                setSubmit(false);
                setstartDateSubmit(false);
                setendDateSubmit(false);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error submitting enquiry:", error);
            setSubmit(false);
            setstartDateSubmit(false);
            setendDateSubmit(false);
            setLoading(false);
            toast.error("An unexpected error occurred. Please try again later.");
        }
    };

    const handleSubmitSuccess = () => {
        navigate(`${process.env.REACT_APP_BASE_PATH}/landing-page`)
        localStorage.removeItem("addedBillboardIds")
        document.getElementById("explore-login-submit-btn")?.click();

    }

    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN;
        if (mapContainer.current && showMap && billBoardData.length > 0) {
            const initialMap = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [mapLng, mapLat],
                zoom: 13.5,
            });

            initialMap.addControl(new mapboxgl.NavigationControl(), "top-right");
            setMap(initialMap);

            if (billBoardData.length > 0) {
                const firstBillboard = billBoardData[0];
                const firstLat = firstBillboard.latitude;
                const firstLng = firstBillboard.longitude;
                const newMarker = new mapboxgl.Marker({ color: '#014DC0' })
                    .setLngLat([firstLng, firstLat])
                    .addTo(initialMap);

                setMarker(newMarker);
                setSelectedInventory(firstBillboard);
                showPopup(firstBillboard);
            }

            return () => {
                initialMap?.remove();
            };
        }
    }, [mapContainer, showMap, billBoardData]);

    useEffect(() => {
        if (map && billBoardData.length > 0) {
            map.flyTo({
                center: [mapLng, mapLat],
                essential: true,
                speed: 2.5,
                curve: 1,
                zoom: 13.5,
            });
            if (marker) {
                marker?.setLngLat([mapLng, mapLat]);
            } else {
                const newMarker = new mapboxgl.Marker({ color: '#014DC0' })
                    .setLngLat([mapLng, mapLat])
                    .addTo(map);
                setMarker(newMarker);
            }
            if (selectedInventory) {
                showPopup(selectedInventory);
            }
        }
    }, [mapLat, mapLng, map, marker, selectedInventory]);

    const handleSelectBillboard = (inventory: any) => {
        setSelectedInventory(inventory);
        const latitude = inventory.latitude || 21.7679;
        const longitude = inventory.longitude || 78.8718;
        handleBillboardClick(latitude, longitude);
        showPopup(inventory);
    };

    const handleBillboardClick = (latitude: string | number, longitude: string | number) => {
        const newLat = parseFloat(latitude.toString());
        const newLng = parseFloat(longitude.toString());
        if (isNaN(newLat) || isNaN(newLng)) {
            console.error("Invalid latitude or longitude", latitude, longitude);
            return;
        }
        setMapLat(newLat);
        setMapLng(newLng);
    };
    const showPopup = (inventory: any) => {
        if (marker && map && billBoardData.length > 0) {
            if (currentPopup) {
                currentPopup.remove();
                setCurrentPopup(null);
            }
            const markerLngLat = marker.getLngLat();
            if (!markerLngLat || !map) {
                console.error("Marker or map is not properly initialized.");
                return;
            }

            const popupContent = createPopupContent(inventory);
            if (!popupContent) {
                console.error("Popup content is invalid or undefined.");
                return;
            }

            try {
                const popup = new mapboxgl.Popup()
                    .setLngLat(markerLngLat)
                    .setHTML(popupContent)
                    .addTo(map);
                const popupElem = popup.getElement();
                if (popupElem) {
                    popupElem.style.fontSize = "15px";
                } else {
                    setTimeout(() => {
                        const updatedPopupElem = popup.getElement();
                        if (updatedPopupElem) {
                            // updatedPopupElem.style.fontSize = "25px";
                        }
                    }, 100);
                }
                setCurrentPopup(popup);
            } catch (error) {
                console.error("Error showing popup:", error);
            }
        } else {
            console.error("Marker or map instance is not available.");
        }
    };






    const createPopupContent = (inventory: any) => {
        const address = inventory?.countryName || "N/A";
        const impressions = inventory?.monthlySummary?.totalVisitors || "N/A";
        const price = inventory?.monthlySummary?.uniqueVisitors || "N/A";
        const prices = inventory?.sellingRate?.monthly?.month1 || "N/A";
        return `
          <div class="map-popup-container">
            <div class="map-popup-image-container">
            <img 
            src="${inventory?.thumbnailPath && inventory.thumbnailPath !== 'null' && inventory.thumbnailPath.trim() !== '' ? inventory.thumbnailPath : NoImage}" 
            alt="Billboard Image" 
            class="map-popup-image"
            />            </div>
            <div class="map-popup-body">
              <div class="row">
                <div class="col-md-6">
                  <h3 class="map-popup-title">${inventory?.displayName || "N/A"}</h3>
                  <p class="map-popup-stat-label">Impressions: ${impressions}</p>
                  <p class="map-popup-stat-label">${currencyCode} ${prices ? `${prices}.00` : "N/A"}</p>
                </div>
                <div class="col-md-6">
                  <p class="map-popup-location">${address}</p>
                  <p class="map-popup-price">Unique Reach : ${price}</p>
                </div>
              </div>
            </div>
          </div>
        `;
    };
    useEffect(() => {
        if (!selectedInventory && billBoardData.length > 0) {
            handleSelectBillboard(billBoardData[0]);
        }
    }, [billBoardData, selectedInventory])
    useEffect(() => {
        if (map && selectedInventory) {
            showPopup(selectedInventory);
        }
    }, [mapLat, mapLng, selectedInventory]);


    const [isMapHighlighted, setIsMapHighlighted] = useState(false);
    const [isLocHighlighted, setIsLocHighlighted] = useState(false);

    const handleShowMap = () => {
        setShowMap(!showMap);
    };
    const locHighlight = () => {
        setIsLocHighlighted(true);
        setIsMapHighlighted(false);
    }
    const mapHighlight = () => {
        setIsMapHighlighted(true);
        setIsLocHighlighted(false)
    }
    useEffect(() => {
        locHighlight();
    }, []);


    const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };
    const handleSubmit = () => {
        setStartDates(startDates);
        setStartDate(startDates);
        setEndDates(endDates);
        setEndDate(endDates);
        setIsSubmitted("yes");
        localStorage.setItem("isPopupSubmited", "yes");
        // fetchBillBoardList();
    };
    const closeFilter = () => {
        setActiveCategoryLocation(null);
        setShowLocationFilters(!showLocationFilters);
    }
    const handleLocationFilterClick = () => {
        setShowLocationFilters(!showLocationFilters);
        setActiveCategoryLocation(activeCategoryLocation === 'location' ? null : 'location');
        setActiveCategory(null);
        setActiveCategorySite(null);
        setActiveCategoryBill(null);
        setActiveCategoryPrice(null);
        setShowLocationVenue(false);
        setShowLocationSite(false);
        setShowLocationBill(false);
        setShowLocationPrice(false);
        setShowLocationFinancial(false);
        setShowLocationAirport(false);
    };

    const handleLocationVenueClick = () => {
        setShowLocationVenue(!showLocationVenue);
        setActiveCategory(activeCategory?.id === 'venue' ? null : { id: 'venue', name: 'Venue', value: 'Venue type', child: [] });
        setActiveCategoryLocation(null);
        setActiveCategorySite(null);
        setActiveCategoryBill(null);
        setActiveCategoryPrice(null);
        setActiveSubCategory(null);
        setActiveGradSubCategory(null);
        setShowLocationFilters(false);
        setShowLocationSite(false);
        setShowLocationBill(false);
        setShowLocationPrice(false);
    };

    const handleLocationSiteClick = () => {
        setShowLocationSite(!showLocationSite);
        setActiveCategorySite(activeCategorySite === 'site' ? null : 'site');
        setActiveCategoryLocation(null);
        setActiveCategory(null);
        setActiveSubCategory(null);
        setActiveGradSubCategory(null);
        setActiveCategoryBill(null);
        setActiveCategoryPrice(null);
        setShowLocationFilters(false);
        setShowLocationVenue(false);
        setShowLocationBill(false);
        setShowLocationPrice(false);
    };

    const handleLocationBillClick = () => {
        setShowLocationBill(!showLocationBill);
        setActiveCategoryBill(activeCategoryBill === 'bill' ? null : 'bill');
        setActiveCategoryLocation(null);
        setActiveCategory(null);
        setActiveSubCategory(null);
        setActiveGradSubCategory(null);
        setActiveCategorySite(null);
        setActiveCategoryPrice(null);
        setShowLocationFilters(false);
        setShowLocationVenue(false);
        setShowLocationSite(false);
        setShowLocationPrice(false);
    };

    const handleLocationPriceClick = () => {
        setShowLocationPrice(!showLocationPrice);
        setActiveCategoryPrice(activeCategoryPrice === 'price' ? null : 'price');
        setActiveCategoryLocation(null);
        setVenueTypeData(['']);
        setActiveCategory(null);
        setActiveSubCategory(null);
        setActiveGradSubCategory(null);
        setActiveCategorySite(null);
        setActiveCategoryBill(null);
        setShowLocationFilters(false);
        setShowLocationVenue(false);
        setShowLocationSite(false);
        setShowLocationBill(false);
    };
    const [minPrice, setMinPrice] = useState(1);
    const [maxPrice, setMaxPrice] = useState(3500);
    const handleMinPriceChange = (e: any) => {
        const value = Math.min(e.target.value, maxPrice);
        setMinPrice(Number(value));
    };
    const handleMaxPriceChange = (e: any) => {
        const value = Math.max(e.target.value, minPrice);
        setMaxPrice(Math.min(Number(value), 3500));
    };
    const handlePriceRangeChange = () => {
        const badgeValue = `Price: ${minPrice} - ${maxPrice}`;
        if (!badges.includes(badgeValue)) {
            setBadges([...badges, badgeValue]);
        }
    };
    const handleLocationFinancialClick = (category: Category) => {
        if (category !== activeCategory) {
            setShowLocationFinancial(true);
            setActiveCategory(category);
            setActiveSubCategory(null);
            setActiveGradSubCategory(null);
        }
    };

    const handleSubCategoryClick = (subCategory: SubCategory) => {
        if (subCategory !== activeSubCategory) {
            setActiveSubCategory(subCategory);
            setActiveGradSubCategory(null);
            setVenueTypeData((prevVenueTypeData) => {
                if (!prevVenueTypeData.includes(subCategory.value)) {
                    return [...prevVenueTypeData, subCategory.value];
                }
                return prevVenueTypeData;
            });
            handleAddBadge(subCategory.value);
        }
    };

    const handleGradSubCategoryClick = (gradSubCategory: GrandSubCategory) => {
        if (gradSubCategory !== activeGradSubCategory) {
            setActiveGradSubCategory(gradSubCategory);
            setVenueTypeData((prevVenueTypeData) => {
                if (!prevVenueTypeData.includes(gradSubCategory.value)) {
                    return [...prevVenueTypeData, gradSubCategory.value];
                }
                return prevVenueTypeData;
            });
            handleAddBadge(gradSubCategory.value);
        }
    };
    const handleAddBadge = (badgeValue: string) => {
        if (!badges.includes(badgeValue)) {
            setBadges([...badges, badgeValue]);
        }
    };
    const [indoorChecked, setIndoorChecked] = useState(false);
    const [outdoorChecked, setOutdoorChecked] = useState(false);
    const handleCheckboxLocation = (badgeValue: string, checked: boolean) => {
        if (badgeValue === 'Indoor') {
            setIndoorChecked(true);
            setOutdoorChecked(false);
            setBadges((prevBadges) => [...prevBadges.filter(badge => badge !== 'Outdoor'), 'Indoor']);
            setLocationData((prevBadges) => [...prevBadges.filter(badge => badge !== 'Outdoor'), 'Indoor']);
        }
        if (badgeValue === 'Outdoor') {
            setOutdoorChecked(true);
            setIndoorChecked(false);
            setBadges((prevBadges) => [...prevBadges.filter(badge => badge !== 'Indoor'), 'Outdoor']);
            setLocationData((prevBadges) => [...prevBadges.filter(badge => badge !== 'Indoor'), 'Outdoor']);
        }
    };


    const handleCheckboxChange = (gradSubCategory: GrandSubCategory) => {
        if (badges.includes(gradSubCategory.value)) {
            setBadges(badges.filter(badge => badge !== gradSubCategory.value));
        } else {
            setBadges([...badges, gradSubCategory.value]);
        }
    };
    const [classicChecked, setclassicChecked] = useState(false);
    const [digitalChecked, setdigitalChecked] = useState(false);
    const [networkChecked, setNetworkChecked] = useState(false);
    const [scrollableChecked, setScrollableChecked] = useState(false);
    const [packageChecked, setPackageChecked] = useState(false);
    const [transitChecked, setTransitChecked] = useState(false);
    const [selectedSiteType, setSelectedSiteType] = useState<string | null>(null);
    const handleSiteTypeChange = (badgeValue: string) => {
        setSelectedSiteType(badgeValue);
        setBadges((prevBadges) => {
            return [
                ...prevBadges.filter(
                    (badge) =>
                        badge !== 'Classic' &&
                        badge !== 'Digital' &&
                        badge !== 'Network' &&
                        badge !== 'Scrollable' &&
                        badge !== 'Package' &&
                        badge !== 'Transit'
                ),
                badgeValue,
            ];
        });
        setBillboardType(badgeValue.toLowerCase());
    };


    const handleScreenSizeChange = (e: any) => {
        const screenSize = e.target.value;
        setBadges((prevBadges) => {
            if (e.target.checked) {
                return [...prevBadges, screenSize];
            } else {
                return prevBadges.filter(badge => badge !== screenSize);
            }
        });
        setSitetypeData((prevBadges) => {
            if (e.target.checked) {
                return [...prevBadges, screenSize];
            } else {
                return prevBadges.filter(badge => badge !== screenSize);
            }
        });
    };

    const [sheetsChecked, setSheetsChecked] = useState(false);
    const [bulletin, setBulletin] = useState(false);
    const [cityLights, setcityLights] = useState(false);
    const [busShelter, setbusShelter] = useState(false);
    const [gallery, setGallery] = useState(false);
    const handleCheckboxLocationBill = (badgeValue: string, checked: boolean) => {
        if (checked) {
            if (!badges.includes(badgeValue)) {
                setBadges((prevBadges) => [...prevBadges, badgeValue]);
            }
            if (!selectedCheckboxes.includes(badgeValue)) {
                setSitetypeData((prevSelected) => [...prevSelected, badgeValue]);
            }
            if (badgeValue === '96 sheets') {
                setSheetsChecked(true);
            } else if (badgeValue === 'Bulletin') {
                setBulletin(true);
            } else if (badgeValue === 'City Lights') {
                setcityLights(true);
            } else if (badgeValue === 'Bus Shelter') {
                setbusShelter(true);
            } else if (badgeValue === 'Gallery') {
                setGallery(true);
            }
        } else {
            setBadges((prevBadges) => prevBadges.filter((badge) => badge !== badgeValue));
            setSitetypeData((prevSelected) =>
                prevSelected.filter((value) => value !== badgeValue)
            );
            if (badgeValue === '96 sheets') {
                setSheetsChecked(false);
            } else if (badgeValue === 'Bulletin') {
                setBulletin(false);
            } else if (badgeValue === 'City Lights') {
                setcityLights(false);
            } else if (badgeValue === 'Bus Shelter') {
                setbusShelter(false);
            } else if (badgeValue === 'Gallery') {
                setGallery(false);
            }
        }
    };

    const handleRemoveBadge = (badgeToRemove: string) => {
        setBadges(badges.filter(badge => badge !== badgeToRemove));
        if (badgeToRemove.startsWith('Price:')) {
            setMinPrice(1);
            setMaxPrice(3500);
        }
        switch (badgeToRemove) {
            case 'Indoor':
                setIndoorChecked(false);
                setLocationData([]);
                break;
            case 'Outdoor':
                setOutdoorChecked(false);
                setLocationData([]);
                break;
            case '96 sheets':
                setSheetsChecked(false);
                setSitetypeData([]);
                break;
            case 'Bulletin':
                setBulletin(false);
                setSitetypeData([]);
                break;
            case 'City Lights':
                setcityLights(false);
                setSitetypeData([]);
                break;
            case 'Bus Shelter':
                setbusShelter(false);
                setSitetypeData([]);
                break;
            case 'Gallery':
                setGallery(false);
                setSitetypeData([]);
                break;
            case 'Classic':
                setclassicChecked(false);
                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Digital':
                setdigitalChecked(false);
                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Network':
                setNetworkChecked(false);
                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Scrollable':
                setScrollableChecked(false);
                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Package':
                setPackageChecked(false);
                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Transit':
                setTransitChecked(false);
                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Small (15 sqft)':

                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Medium (15-99 sqft)':

                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case 'Large (100-249 sqft)':

                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            case ' Extra Large (249 sqft)':

                setSelectedSiteType(null);
                setSitetypeData([]);
                break;
            default:
                break;
        }
    };

    // Country List Dropdwon
    const [selectedCountryId, setSelectedCountryId] = useState<string | undefined>();
    const [countryOptions, setCountryOptions] = useState<{ id: string; name: string; dialingCode: string; districtId: string }[]>([]);
    const [stateOptions, setStateOptions] = useState<{
        stateId: string | null;
        id: string;
        name: string;
    }[]>([]);
    const [country, setCountry] = useState<string>("");
    const [state, setState] = useState<string>("");
    const { data: countryData } = useQuery(GET_DISTRICT_LIST, {
        variables: { stateid: selectedCountryId },
    });

    useEffect(() => {
        if (countryData && countryData.districtList) {
            setCountryOptions(countryData.districtList);
        }
    }, [countryData]);

    // State List Dropdwon
    const countryId = localStorage.getItem('countryId');
    const { data: stateData } = useQuery(GET_STATE_LIST, {
        variables: { countryId: countryId },
        skip: !countryId,
    });

    useEffect(() => {
        if (stateData && stateData.stateList) {
            setStateOptions(stateData.stateList);
        }
    }, [stateData]);

    const handleCountryChange = (e: { target: { value: string } }) => {
        const selectedId = e.target.value;
        const selectedCountry = stateOptions.find(country => country.stateId === selectedId);
        if (selectedCountry) {
            setSelectedCountryId(selectedId);
            setCountry(selectedId);
        } else {
            setCountry("");
        }
    };
    const resetAllStates = () => {
        setBadges([]);
        setLocationData([]);
        setVenueTypeData([]);
        setSitetypeData([]);
        setMinPrice(1);
        setMaxPrice(3500);
        setIndoorChecked(false);
        setOutdoorChecked(false);
        setSheetsChecked(false);
        setBulletin(false);
        setcityLights(false);
        setbusShelter(false);
        setGallery(false);
        // setActiveCategoryLocation(null);
        // setActiveCategory(null);
        // setActiveCategorySite(null);
        // setActiveCategoryBill(null);
        // setActiveCategoryPrice(null);
        setShowLocationVenue(false);
        setShowLocationFinancial(false);
        setShowLocationAirport(false);
        setclassicChecked(false);
        setdigitalChecked(false);
        setNetworkChecked(false);
        setScrollableChecked(false);
        setPackageChecked(false);
        setTransitChecked(false);
        setSelectedSiteType(null);
        setState("");
        setCountry("");
        refetchBillBoardList();
    };


    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        fetchBillBoardList();
    }, [props.filterData])

    useEffect(() => {
        if (process.env.REACT_APP_MOCK_DATA === 'true') {
            generateMockData(GET_LANDING_EXPLORATION).then((mockResponse: any) => {
                const data = mockResponse.data
                setBillBoardDataLoading(false);
                setBillBoardData(data.landingpageExplorePropertiesNotoken)

            }).catch((err: any) => {
                console.error("Error generating mock data:", err);
            });
        } else {
            fetchBillBoardList();
            // fetchCartItems();
        }

    }, [search])

    const [cartItemCount, setCartItemCount] = useState(0);
    const { data } = useQuery(PROPERTY_LIST_VENUE_TYPE_LIST);
    const venueTypes = data?.venueTypes || [];
    // const { data: myCart, loading, error } = useQuery(CART_INITIAL_QUERY, {
    //     variables: {
    //         accessToken: token,
    //         userId: userId,
    //     },
    // });

    useEffect(() => {
        fetchBillBoardList();
    }, [currentPage, search, startDate, endDate]);
    const { loading: loadingCartList, error: errorCartList, data: dataCartList, refetch: refetchBillBoardList } = useQuery(GET_LANDING_EXPLORATION, {
        variables: {
            sort: "last_modified_date,desc",
            billboard: billboardType,
            userId: userId,
            companyId: companyId,
            page: currentPage,
            size: dataListLength,
            startDate: format(startDates, 'yyyy-MM-dd'),
            endDate: format(endDates, 'yyyy-MM-dd'),
            dspName: "LMX-ECOMMERCE",
            countryId: countryId,
            searchTerm: search,
            filterData: { type: billboardType.toUpperCase(), availableBooking: true, categories: [], format: [], venueType: [] }
        }
    });
    const [digitalTotalSize, setdigitalTotalSize] = useState("")
    const [classicTotalSize, setclassicTotalSize] = useState("")
    const fetchClassicLength = async () => {
        try {

            const { data, loading, error } = await client.query({
                query: GET_LANDING_EXPLORATION,
                variables: {

                    sort: "last_modified_date,desc",
                    billboard: 'classic',
                    userId: userId,
                    companyId: companyId,
                    page: currentPage,
                    size: dataListLength,
                    startDate: format(startDates, 'yyyy-MM-dd'),
                    endDate: format(endDates, 'yyyy-MM-dd'),
                    dspName: "LMX-ECOMMERCE",
                    countryId: countryId,
                    searchTerm: search,
                    filterData: {
                        type: 'classic',
                        availableBooking: true,
                        categories: [],
                        format: [],
                        venueType: []
                    }
                }
            });

            if (data) {
                setclassicTotalSize(data.landingpageExplorePropertiesNotoken[0]?.totalSize);
            }

        } catch (error) {

        }
    };
    const fetchDigitalLength = async () => {
        try {
            const { data, loading, error } = await client.query({
                query: GET_LANDING_EXPLORATION,
                variables: {

                    sort: "last_modified_date,desc",
                    billboard: 'digital',
                    userId: userId,
                    companyId: companyId,
                    page: currentPage,
                    size: dataListLength,
                    startDate: format(startDates, 'yyyy-MM-dd'),
                    endDate: format(endDates, 'yyyy-MM-dd'),
                    dspName: "LMX-ECOMMERCE",
                    countryId: countryId,
                    searchTerm: search,
                    filterData: {
                        type: 'digital',
                        availableBooking: true,
                        categories: [],
                        format: [],
                        venueType: []
                    }
                }
            });

            if (data) {
                setdigitalTotalSize(data.landingpageExplorePropertiesNotoken[0]?.totalSize);
            }

        } catch (error) {
        }
    };
    useEffect(() => {
        fetchClassicLength();
        fetchDigitalLength();
    })

    const fetchBillBoardList = async (searchValue: any = "", cartItems: any = "") => {
        try {
            setBillBoardDataLoading(true);
            setBillBoardData([]);

            let categories = locationData.map(category => category.toUpperCase());
            const filterData = {
                type: billboardType.toUpperCase(),
                availableBooking: true,
                categories: categories,
                format: siteTypeData,
                venueType: venueTypeData,
            };
            const { data, loading, error } = await client.query({
                query: GET_LANDING_EXPLORATION,
                variables: {
                    sort: "last_modified_date,desc",
                    billboard: billboardType,
                    userId: userId,
                    companyId: companyId,
                    page: currentPage,
                    size: dataListLength,
                    startDate: format(startDates, 'yyyy-MM-dd'),
                    endDate: format(endDates, 'yyyy-MM-dd'),
                    dspName: "LMX-ECOMMERCE",
                    countryId: countryId,
                    searchTerm: search,
                    filterData: filterData
                }
            })
            if (data) {
                setBillBoardDataLoading(false);
                let resultObj = data.landingpageExplorePropertiesNotoken;
                let cartObj = cartItems;
                if (resultObj.length > 0 && cartObj.length > 0) {
                    cartObj.map((cartItem: any) => {
                        const newBillBoardData = resultObj.map((obj: { id: any; }) => {
                            if (obj.id === cartItem.cartItemId) {
                                return { ...obj, isInCart: true };
                            } else {
                                return { ...obj, isInCart: false };
                            }
                            // return obj;
                        });
                        resultObj = newBillBoardData;
                        setBillBoardData(newBillBoardData);
                    });

                } else {
                    setBillBoardData(data.landingpageExplorePropertiesNotoken);
                }
                setTotalDataLength(data.landingpageExplorePropertiesNotoken[0].totalSize);
                if (data.landingpageExplorePropertiesNotoken[0].totalSize > 0) {
                    if (currentPage === 0) {
                        setPageStartData(1);
                        if (data.landingpageExplorePropertiesNotoken[0].totalSize > dataListLength) {
                            setPageEndData(dataListLength);
                        } else {
                            setPageEndData(data.landingpageExplorePropertiesNotoken[0].totalSize);
                        }
                    } else {
                        const curStartData = dataListLength * currentPage;
                        setPageStartData(curStartData + 1);
                        const curEndData = curStartData + dataListLength;
                        if (data.landingpageExplorePropertiesNotoken[0].totalSize > curEndData) {
                            setPageEndData(curEndData);
                        } else {
                            setPageEndData(data.landingpageExplorePropertiesNotoken[0].totalSize);
                        }
                    }
                }
            }
        } catch (error) {
            setBillBoardDataLoading(false);
        }
    };
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem("isPopupSubmited");
        localStorage.removeItem("addedBillboardIds");
        localStorage.removeItem("exploreCartCount");
        setCartCount(0);
    });
    window.addEventListener('popstate', () => {
        localStorage.removeItem("isPopupSubmited");
        localStorage.removeItem("addedBillboardIds");
        localStorage.removeItem("exploreCartCount");
        setCartCount(0);
    });
    const [tobillBoard, setToBillBoard] = useState<any>([])
    const addToCart = (itemData: any) => {
        try {
            const storedBillboardIds = localStorage.getItem('addedBillboardIds');
            const addedBillboardIds = storedBillboardIds ? JSON.parse(storedBillboardIds) : [];

            const isItemInCart = addedBillboardIds.includes(itemData.id);
            if (!isItemInCart) {

                const newBillBoardData = billBoardData.map((obj: { id: any; }) => {
                    if (obj.id === itemData.id) {
                        return { ...obj, isInCart: true };
                    }
                    return obj;
                });

                setBillBoardData(newBillBoardData);
                const updatedIds = [...addedBillboardIds, itemData.id];
                localStorage.setItem('addedBillboardIds', JSON.stringify(updatedIds));

                setaddBillboardIds(updatedIds); // Update the state with new IDs
                setToBillBoard(updatedIds)

                setCartCount(cartCount + 1);

                toast.success(`${itemData.name} has been added to your cart!`);
            } else {
                toast.info(`${itemData.name} is already in your cart.`);
            }

        } catch (error) {
            toast.error("Something went wrong while adding to the cart.");
        }
    }

    const [cartId, setcartId] = useState<SssItem[]>([]);

    const deleteCartItem = (itemData: any) => {
        try {
            const storedBillboardIds = localStorage.getItem('addedBillboardIds');
            const addedBillboardIds = storedBillboardIds ? JSON.parse(storedBillboardIds) : [];

            const isItemInCart = addedBillboardIds.includes(itemData.id);

            if (isItemInCart) {
                const newBillBoardData = billBoardData.map((obj: { id: any; }) => {
                    if (obj.id === itemData.id) {
                        return { ...obj, isInCart: false }; // Mark as not in cart
                    }
                    return obj;
                });

                setBillBoardData(newBillBoardData);
                const updatedIds = addedBillboardIds.filter((id: any) => id !== itemData.id);
                localStorage.setItem('addedBillboardIds', JSON.stringify(updatedIds)); // Update localStorage
                setaddBillboardIds(updatedIds); // Update state with the new IDs
                setToBillBoard([])
                setCartCount(cartCount - 1); // Decrease the cart count
                toast.success(`${itemData.name} has been removed from your cart!`);

            } else {
                toast.info(`${itemData.name} is not in your cart.`);
            }

        } catch (error) {
            toast.error("Something went wrong while deleting the item from the cart.");
        }
    };
    const soldCampaignDetails = (details: any) => {
        setSoldCampaignViewDetails(details);
    }
    const [previousSiteTypeData, setPreviousSiteTypeData] = useState<string[]>([]);
const [previousVenueTypeData, setPreviousVenueTypeData] = useState<string[]>([]);
const [previousLocationData, setPreviousLocationData] = useState<string[]>([]);

    const billboardTypeChange = (eve: string) => {
        setBillboardType(eve);
        setCurrentPage(0);
    
        if (eve === 'digital') {
            // Reset all data for digital
            setSitetypeData([]);
            setVenueTypeData([]);
            setLocationData([]);
        } else {
            // For classic, restore the previous data
            setSitetypeData(previousSiteTypeData);
            setVenueTypeData(previousVenueTypeData);
            setLocationData(previousLocationData);
        }
    };
    const paginationPlus = () => {
        const newPage = currentPage + 1
        setCurrentPage(newPage)
    }
    const paginationMinus = () => {
        const newPage = currentPage - 1
        setCurrentPage(newPage)
    }
    useEffect(() => {
        fetchBillBoardList();
    }, [billboardType, currentPage, search])


    const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setSearch(event.currentTarget.value);
            fetchBillBoardList(event.currentTarget.value);
        }
    };

    const ShowAddDeleteCartBtn = (curObj: any) => {
        let status = false;
        cartData.map((cartItem: any) => {
            if (curObj.id === cartItem.cartItemId) {
                status = true;
            }
        });
        return status;
    }
    const navigateToProDetails = (id: any, type: any) => {
        let categories = locationData.map(category => category.toUpperCase());
        const propertyDetailsData = {
            id,
            type,
            campaignName,
            startDates,
            endDates,
            tobillBoard,
            cartCount,
            billboardType,
            isSubmitted,
            currentPage,
            categories,
            siteTypeData,
            venueTypeData
        }
        navigate(`${process.env.REACT_APP_BASE_PATH}/exploreproperty-details`, { state: { propertyDetailsData } });

    };
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
        setTempStartDates(startDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const toggleEndDatePicker = () => {
        setShowEndDatePicker(!showEndDatePicker);
        setTempEndDate(endDate);
        setTempEndDates(endDate);
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

    const handleUpdateStartDate = async () => {
        setStartDate(tempStartDate);
        setStartDates(tempStartDate);
        setShowStartDatePicker(false);
        setBillBoardDataLoading(true);
        setIsSubmitted("yes");
        localStorage.setItem("isPopupSubmited", "yes");
        try {
            await refetchBillBoardList({
                startDate: format(tempStartDate, 'yyyy-MM-dd'),
            });
        } catch (error) {
        } finally {
            setBillBoardDataLoading(false);
            setIsSubmitted("yes");
        }
    };

    const handleUpdateEndDate = async () => {
        setEndDate(tempEndDate);
        setEndDates(tempEndDate);
        setShowEndDatePicker(false);
        setBillBoardDataLoading(true);
        setIsSubmitted("yes");
        localStorage.setItem("isPopupSubmited", "yes");
        try {
            await refetchBillBoardList({
                endDate: format(tempEndDate, 'yyyy-MM-dd'),
            });
        } catch (error) {
        } finally {
            setBillBoardDataLoading(false);
            setIsSubmitted("yes");
        }
    };


    const handleMonthButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    //Select date popoup

    const handleStartDateChanges = (date: Date | null) => {
        if (date) {
            setTempStartDates(date);
            setShowMonthPickers(false);
            setShowYearPickers(false);
        }
    };

    const handleEndDateChanges = (date: Date | null) => {
        if (date) {
            setTempEndDates(date);
            setShowMonthPickers(false);
            setShowYearPickers(false);
        }
    };

    const toggleStartDatePickers = () => {
        setShowStartDatePickers(!showStartDatePickers);
        setTempStartDates(startDates);
        setShowMonthPickers(false);
        setShowYearPickers(false);
    };

    const toggleEndDatePickers = () => {
        setShowEndDatePickers(!showEndDatePickers);
        setTempEndDates(endDates);
        setShowMonthPickers(false);
        setShowYearPickers(false);
    };

    const toggleMonthPickers = () => {
        setShowMonthPickers(!showMonthPickers);
        setShowYearPickers(false);
    };

    const toggleYearPickers = () => {
        setShowYearPickers(!showYearPickers);
        setShowMonthPickers(false);
    };

    const handleMonthSelections = (month: number) => {
        const newStartDate = new Date(tempStartDates);
        const newEndDate = new Date(tempEndDates);
        newStartDate.setMonth(month);
        newEndDate.setMonth(month);

        setTempStartDates(newStartDate);
        setTempEndDates(newEndDate);
        setSelectedMonths(month);
        setShowMonthPickers(false);
    };

    const handleYearSelections = (year: number) => {
        const newStartDate = new Date(tempStartDates);
        const newEndDate = new Date(tempEndDates);
        newStartDate.setFullYear(year);
        newEndDate.setFullYear(year);

        setTempStartDates(newStartDate);
        setTempEndDates(newEndDate);
        setSelectedYears(year);
        setShowYearPickers(false);
    };

    const handleUpdateStartDates = () => {
        setStartDates(tempStartDates);
        setShowStartDatePickers(false);

    };

    const handleUpdateEndDates = () => {
        setEndDates(tempEndDates);
        setShowEndDatePickers(false);

    };

    const handleMonthButtonClicks = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    //submit PopupDate

    const handleSubmitStartDateChange = (date: Date | null) => {
        if (date) {
            setTempSubmitStartDates(date);
            setSubmitShowMonthPickers(false);
            setSubmitShowYearPickers(false);
        }
    };

    const handleSubmitEndDateChange = (date: Date | null) => {
        if (date) {
            setTempSubmitEndDates(date);
            setSubmitShowMonthPickers(false);
            setSubmitShowYearPickers(false);
        }
    };

    // Toggle date picker visibility
    const toggleSubmitStartDatePicker = () => {
        setShowSubmitStartDatePickers(!showSubmitStartDatePickers);
        setTempSubmitStartDates(submitstartDates);
        setSubmitShowMonthPickers(false);
        setSubmitShowYearPickers(false);
    };

    const toggleSubmitEndDatePicker = () => {
        setShowSubmitEndDatePickers(!showSubmitEndDatePickers);
        setTempSubmitEndDates(submitendDates);
        setSubmitShowMonthPickers(false);
        setSubmitShowYearPickers(false);
    };

    // Show month or year pickers
    const toggleSubmitMonthPicker = () => {
        setSubmitShowMonthPickers(!showSubmitMonthPickers);
        if (!showSubmitMonthPickers) {
            setSubmitShowYearPickers(false);
        }
    };

    const toggleSubmitYearPicker = () => {
        setSubmitShowYearPickers(!showSubmitYearPickers);
        if (!showSubmitYearPickers) {
            setSubmitShowMonthPickers(false);
        }
    };

    // Handle month and year selection
    const handleSubmitMonthSelection = (month: number) => {
        const newStartDate = new Date(tempSubmitStartDates || currentDate); // Fallback to currentDate if null
        const newEndDate = new Date(tempSubmitEndDates || currentDate); // Fallback to currentDate if null
        newStartDate.setMonth(month);
        newEndDate.setMonth(month);

        setTempSubmitStartDates(newStartDate);
        setTempSubmitEndDates(newEndDate);
        setSubmitSelectedMonths(month);
        setSubmitShowMonthPickers(false);
    };

    const handleSubmitYearSelection = (year: number) => {
        const newStartDate = new Date(tempSubmitStartDates || currentDate);
        const newEndDate = new Date(tempSubmitEndDates || currentDate);
        newStartDate.setFullYear(year);
        newEndDate.setFullYear(year);

        setTempSubmitStartDates(newStartDate);
        setTempSubmitEndDates(newEndDate);
        setSubmitSelectedYears(year);
        setSubmitShowYearPickers(false);
    };

    // Update start and end dates when confirmed
    const handleSubmitUpdateStartDate = () => {
        if (!tempSubmitStartDates) {
            setstartDateSubmit(true)
        }
        else {
            setSubmitStartDates(tempSubmitStartDates);
            setShowSubmitStartDatePickers(false);
            setstartDateSubmit(false);
        }
    };

    const handleSubmitUpdateEndDate = () => {
        if (!tempSubmitEndDates) {

            setendDateSubmit(true);
        } else {
            setSubmitEndDates(tempSubmitEndDates);
            setShowSubmitEndDatePickers(false);
            setendDateSubmit(false);
        }
    };

    const handleSubmitMonthButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };



    const inputRef = useRef<HTMLInputElement>(null);
    const handleRotate = () => {
        setSearch('');
        fetchBillBoardList();
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    if (redirect) {
        return <Navigate to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} />;
    }
    return (
        <>
            <div className="row property-list-search-container">
                <div className={`col-sm-12 ${showMap ? 'col-md-4' : 'col-md-5'}`}>
                    <div className="input-group assign_creative_input_group g-4">
                        <span className="input-group-text search-icon assign_creative_search_icon">
                            <img src={Image1} alt="" />
                        </span>
                        <input type="text" className="form-control border-bottom-only assign_creative_border_bottom_only " placeholder="Search for billboards"
                            aria-label="Search"
                            ref={inputRef}
                            //  value={search} onChange={(e) => setSearch(e.target.value)} 
                            onKeyDown={handleSearchChange}
                        />
                        <span>
                            <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
                        </span>
                        <div>
                            <i className={`property_list_search_location_logo fa-solid fa-list listview-filter-button-child active-toggle ${isLocHighlighted ? 'lochighlighted' : ''}`} id="listicon"
                                onClick={() => { locHighlight(); handleShowMap() }}
                                style={{ cursor: 'pointer' }}></i>
                            {/* <img
                                src={Image2}
                                alt="List View"
                                className={`property_list_search_location_logo ${isLocHighlighted ? 'lochighlighted' : ''}`}
                                onClick={() => { locHighlight(); handleShowMap() }}
                                style={{ cursor: 'pointer' }}
                            />                        */}
                        </div>
                        <div>
                            <i className={`property_list_search_location_logo property_list_map fa-solid fa-location-dot listview-map-pin-icon ${isMapHighlighted ? 'maphighlighted' : ''}`}
                                onClick={() => { mapHighlight(); handleShowMap() }}
                                style={{ cursor: 'pointer' }} id="mapicon"></i>
                            {/* <img
                                src={Image3}
                                alt="Show Map"
                                className={`property_list_search_location_logo property_list_map ${isMapHighlighted ? 'maphighlighted' : ''}`}
                                onClick={() => { mapHighlight(); handleShowMap() }}
                                style={{ cursor: 'pointer', width: '70%' }}
                            />                        */}
                        </div>
                    </div>
                </div>

                <div className={`col-sm-12 ${showMap ? 'col-md-8' : 'col-md-7'} property_list_search_con_2`}>
                    <div className="gx-2 gy-2 d-flex justify-content-between align-items-center property_list_search_con_3">

                        <div className="d-flex flex-column">
                            <label htmlFor="duration" className="form-label exploreproperty_list_navbar_header_1 mt-2">Duration</label>
                            <div className="d-flex align-items-center">
                                {/* Start Date Picker */}
                                <div className="property_list_date_start d-flex align-items-center position-relative">
                                    <div onClick={toggleStartDatePicker} className="calendar-icon-wrapper">
                                        <img alt="Start Date" src={Image7} className="date-icon" />
                                    </div>
                                    <div className="date-text-1 explore-date" onClick={toggleStartDatePicker}>
                                        <p style={{ "borderBottom": "1.5px solid black" }}>
                                            {startDate ? format(startDate, "dd MMM yyyy") : "Select Start Date"}
                                        </p>
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
                                                    minDate={currentDate}
                                                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                        <div className="custom-header">
                                                            <button onClick={(e) => { handleMonthButtonClick(e); decreaseMonth(); }}>{"«"}</button>
                                                            <span onClick={toggleMonthPicker}>
                                                                {format(date, "MMMM")}
                                                            </span>
                                                            <span onClick={toggleYearPicker}>
                                                                {format(date, "yyyy")}
                                                            </span>
                                                            <button onClick={(e) => { handleMonthButtonClick(e); increaseMonth(); }}>{"»"}</button>
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

                                <span className="mt-1 mx-2">→</span>

                                <div className="property_list_date_end d-flex align-items-center position-relative">
                                    <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                        <img alt="End Date" src={Image7} className="date-icon" />
                                    </div>
                                    <div className="date-text-1 explore-date explore-enddate" onClick={toggleEndDatePicker}>
                                        <p style={{ "borderBottom": "1.5px solid black" }}>
                                            {endDate ? format(endDate, "dd MMM yyyy") : "Select End Date"}
                                        </p>
                                    </div>
                                    {showEndDatePicker && (
                                        <div className="datepicker-wrapper">
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
                                                    // minDate={currentDate}
                                                    minDate={startDate ? addDays(startDate, 1) : new Date()}
                                                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                        <div className="custom-header">
                                                            <button onClick={(e) => { handleMonthButtonClick(e); decreaseMonth(); }}>{"«"}</button>
                                                            <span onClick={toggleMonthPicker}>
                                                                {format(date, "MMMM")}
                                                            </span>
                                                            <span onClick={toggleYearPicker}>
                                                                {format(date, "yyyy")}
                                                            </span>
                                                            <button onClick={(e) => { handleMonthButtonClick(e); increaseMonth(); }}>{"»"}</button>
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

                        {/* "Show only" Dropdown */}
                        <div className="d-flex align-items-center">
                            <div>
                                <span className="assign_filter_by">Show only:</span>
                            </div>
                            <div>
                                <div className="dropdown">
                                    <button
                                        className="btn btn-sm w-100 border-0 assign_drowdown_head"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        {`${billboardType} (${totalDataLength})`} <i className="fa-solid fa-angle-down"></i>
                                    </button>
                                    <ul className="dropdown-menu assign_dropdown_menu">
                                        <li>
                                            <a onClick={() => billboardTypeChange('classic')} className="dropdown-item assign_dropdown_item">
                                                Classic ({classicTotalSize})<i className="fa-solid fa-check assign_fa_check"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a onClick={() => billboardTypeChange('digital')} className="dropdown-item assign_dropdown_item">
                                                Digital ({digitalTotalSize})<i className="fa-solid fa-check assign_fa_check"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Filter and Cart */}
                            <div className="d-flex">
                                {/* <img className="property_list_filter_icon" src={Image5} alt="" /> */}
                                <svg className="property_list_filter_icon" width="15" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
                                    <g clip-path="url(#clip0_819_70172)">
                                        <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M10.3516 14.163C10.3516 13.804 10.6426 13.513 11.0016 13.513H16.2516C16.6105 13.513 16.9016 13.804 16.9016 14.163C16.9016 14.522 16.6105 14.813 16.2516 14.813L11.0016 14.813C10.6426 14.813 10.3516 14.522 10.3516 14.163Z"></path>
                                        <path fill="#232222" fill-rule="evenodd" clip-rule="evenodd" d="M2.10156 14.163C2.10156 13.804 2.39258 13.513 2.75156 13.513H8.00156C8.36055 13.513 8.65156 13.804 8.65156 14.163C8.65156 14.522 8.36055 14.813 8.00156 14.813H2.75156C2.39258 14.813 2.10156 14.522 2.10156 14.163Z"></path>
                                        <path fill="#232222" fill-rule="evenodd" clip-rule="evenodd" d="M8.85156 8.49636C8.85156 8.13737 9.14258 7.84635 9.50156 7.84635L16.2516 7.84635C16.6105 7.84635 16.9016 8.13737 16.9016 8.49635C16.9016 8.85534 16.6105 9.14635 16.2516 9.14635H9.50156C9.14258 9.14635 8.85156 8.85534 8.85156 8.49636Z"></path>
                                        <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M2.10156 8.49636C2.10156 8.13737 2.39258 7.84635 2.75156 7.84635H6.50156C6.86055 7.84635 7.15156 8.13737 7.15156 8.49636C7.15156 8.85534 6.86055 9.14635 6.50156 9.14635H2.75156C2.39258 9.14635 2.10156 8.85534 2.10156 8.49636Z"></path>
                                        <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M11.8516 2.82969C11.8516 2.4707 12.1426 2.17969 12.5016 2.17969L16.2516 2.17969C16.6105 2.17969 16.9016 2.4707 16.9016 2.82969C16.9016 3.18867 16.6105 3.47969 16.2516 3.47969L12.5016 3.47969C12.1426 3.47969 11.8516 3.18867 11.8516 2.82969Z"></path>
                                        <path fill="#232222" fill-rule="evenodd" clip-rule="evenodd" d="M2.10156 2.82969C2.10156 2.4707 2.39258 2.17969 2.75156 2.17969L9.50156 2.17969C9.86055 2.17969 10.1516 2.4707 10.1516 2.82969C10.1516 3.18867 9.86055 3.47969 9.50156 3.47969L2.75156 3.47969C2.39258 3.47969 2.10156 3.18867 2.10156 2.82969Z"></path>
                                        <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M11.0016 16.938C10.6426 16.938 10.3516 16.647 10.3516 16.288V12.038C10.3516 11.679 10.6426 11.388 11.0016 11.388C11.3605 11.388 11.6516 11.679 11.6516 12.038V16.288C11.6516 16.647 11.3605 16.938 11.0016 16.938Z"></path>
                                        <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M6.50156 11.2714C6.14258 11.2714 5.85156 10.9803 5.85156 10.6214L5.85156 6.37136C5.85156 6.01237 6.14258 5.72136 6.50156 5.72136C6.86055 5.72136 7.15156 6.01237 7.15156 6.37135V10.6214C7.15156 10.9803 6.86055 11.2714 6.50156 11.2714Z"></path>
                                        <path fill="var(--btn-bg-color)" fill-rule="evenodd" clip-rule="evenodd" d="M12.5016 5.60469C12.1426 5.60469 11.8516 5.31367 11.8516 4.95469V0.704687C11.8516 0.345702 12.1426 0.0546875 12.5016 0.0546875C12.8605 0.0546875 13.1516 0.345702 13.1516 0.704687V4.95469C13.1516 5.31367 12.8605 5.60469 12.5016 5.60469Z"></path>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_819_70172">
                                            <rect width="17" height="18" fill="white" transform="translate(0.5 17) rotate(-90)"></rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <button className="assign_creative_popup_filter" onClick={handleLocationFilterClick} data-bs-toggle="modal" data-bs-target="#filterModal">Filter</button>
                            </div>
                            <div>
                                <div className="property_list_search_card_con">
                                    {/* <button className="property_list_search_card" onClick={navigateToCart}> */}
                                    <button className="property_list_search_card" data-bs-toggle="modal" data-bs-target="#exploreLogin">
                                        <svg width="15" height="15" className="detaillocation-frame-inner property-logo-img" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path className="propertyListsvg-path" fill-rule="evenodd" clip-rule="evenodd" d="M12.9231 2.92773L10.7564 0.761104C10.4194 0.42402 9.86825 0.42402 9.53117 0.761104C9.19408 1.09819 9.19408 1.6493 9.53117 1.98639L10.4725 2.92773H12.9226H12.9231ZM0.875675 5.27152H14.1733C14.1757 5.27152 14.1776 5.27152 14.18 5.27152C14.62 5.26817 14.9786 4.90714 14.9786 4.46616C14.9786 4.02325 14.6162 3.66079 14.1733 3.66079H13.6035H11.2061H3.8424H1.44498H0.875675C0.432774 3.66079 0.0703125 4.02325 0.0703125 4.46616C0.0703125 4.90666 0.428943 5.26769 0.868972 5.27152C0.870887 5.27152 0.873281 5.27152 0.875675 5.27152ZM0.967607 6.00458L1.99322 13.6426C2.06026 14.141 2.47922 14.5078 2.98245 14.5078H7.52447H12.0665C12.5692 14.5078 12.9887 14.141 13.0557 13.6426L14.0818 6.00458H0.968086H0.967607ZM3.422 8.0606C3.38322 7.70149 3.64561 7.40798 4.00471 7.40798C4.36382 7.40798 4.68894 7.70149 4.72772 8.0606L5.1711 12.1822C5.20989 12.5413 4.9475 12.8348 4.58839 12.8348C4.22928 12.8348 3.90416 12.5413 3.86538 12.1822L3.422 8.0606ZM6.87184 8.0606C6.87184 7.70149 7.16536 7.40798 7.52447 7.40798C7.88357 7.40798 8.17709 7.70149 8.17709 8.0606V12.1822C8.17709 12.5413 7.88357 12.8348 7.52447 12.8348C7.16536 12.8348 6.87184 12.5413 6.87184 12.1822V8.0606ZM9.87783 12.1822L10.3212 8.0606C10.36 7.70149 10.6851 7.40798 11.0442 7.40798C11.4033 7.40798 11.6652 7.70149 11.6269 8.0606L11.1835 12.1822C11.1448 12.5413 10.8197 12.8348 10.4605 12.8348C10.1014 12.8348 9.83952 12.5413 9.87783 12.1822ZM4.57594 2.92725L5.51728 1.98591C5.85437 1.64882 5.85437 1.09771 5.51728 0.760626C5.1802 0.423541 4.62909 0.423541 4.292 0.760626L2.12538 2.92725H4.57594Z" />
                                        </svg>
                                        {/* <img className="detaillocation-frame-inner property-logo-img" alt="" height="15px" width="17px" src={Image6} /> */}
                                        Cart ({cartCount})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row property-list-main-container">
                <div className={`col-md-${showMap ? '4' : '12'}`}>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <p className="property_list_avil_content">Available Billboards</p>
                                </div>
                                <div className="d-flex">
                                    <p className="property_list_pagination_content">Showing {pageStartData} to {pageEndData} of {totalDataLength}</p>
                                    {currentPage > 0 ? (
                                        <button className="property_list_pagination_left active" onClick={paginationMinus}> {"<"} </button>
                                    ) : (
                                        <button className="property_list_pagination_left">{"<"}</button>
                                    )}
                                    {totalDataLength > pageEndData ? (
                                        <button className="property_list_pagination_right" onClick={paginationPlus}>{" > "}</button>
                                    ) : (
                                        <button className="property_list_pagination_left">{">"}</button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">

                            {billBoardDataLoading ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                                    <span className="loading-circle sp1">
                                        <span className="loading-circle sp2">
                                            <span className="loading-circle sp3"></span>
                                        </span>
                                    </span>
                                </div>) : (
                                <>
                                    {billBoardData.length > 0 ? (
                                        <div className={`${showMap ? ' show-map' : ' hide-map'}` + " row"}>
                                            {billBoardData.map((listData: any, i: any) => (
                                                <div className={`col-md-${showMap ? '12' : '4'}`}>
                                                    <div className="property_list_scroll" onClick={() => handleSelectBillboard(listData)}>
                                                        <div className="card props-hover2 mb-3 border-0">
                                                            {listData.thumbnailPath && listData.thumbnailPath !== "null" && listData.thumbnailPath.trim() !== "" ? (
                                                                <img className="card-img-top" alt={listData.displayName} src={listData.thumbnailPath} />
                                                            ) : (
                                                                <img className="detaillocation-frame-inner property-logo-img" alt="no image" src={NoImage} />
                                                            )}
                                                            {listData.active ? (
                                                                <span className="badge badge-danger status-label props-status-label bg-light text-success"><i
                                                                    className="fa-solid fa-circle"></i> Available</span>
                                                            ) : (
                                                                <span className="badge badge-danger status-label props-status-label bg-light text-danger"><i
                                                                    className="fa-solid fa-circle"></i> Sold Out</span>
                                                            )}

                                                            <div className="card-img-overlay card-img-overlay-custom">
                                                                {isSubmitted === "no" ? (
                                                                    (() => {
                                                                        const storedBillboardIds = localStorage.getItem('addedBillboardIds');
                                                                        const addedBillboardIds = storedBillboardIds ? JSON.parse(storedBillboardIds) : [];
                                                                        const isInCart = addedBillboardIds.includes(listData.id);

                                                                        return isInCart ? (
                                                                            <button
                                                                                className="btn btn-danger propety-btn-danger"
                                                                                onClick={() => deleteCartItem(listData)}
                                                                            >
                                                                                <img
                                                                                    className="detaillocation-frame-inner property-logo-img"
                                                                                    alt=""
                                                                                    src={Image9}
                                                                                />
                                                                                Delete from Cart
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-primary propety-btn-primary w-100"
                                                                                data-bs-toggle="modal"
                                                                                data-bs-target="#exploreDate"
                                                                            >
                                                                                <img
                                                                                    className="detaillocation-frame-inner property-logo-img"
                                                                                    alt=""
                                                                                    src={Image9}
                                                                                />
                                                                                Add to Cart
                                                                            </button>
                                                                        );
                                                                    })()
                                                                ) : (

                                                                    (() => {
                                                                        const storedBillboardIds = localStorage.getItem('addedBillboardIds');
                                                                        const addedBillboardIds = storedBillboardIds ? JSON.parse(storedBillboardIds) : [];
                                                                        const isInCart = addedBillboardIds.includes(listData.id);

                                                                        return isInCart ? (
                                                                            <button
                                                                                className="btn btn-danger propety-btn-danger"
                                                                                onClick={() => deleteCartItem(listData)}
                                                                            >
                                                                                <img
                                                                                    className="detaillocation-frame-inner property-logo-img"
                                                                                    alt=""
                                                                                    src={Image9}
                                                                                />
                                                                                Delete from Cart
                                                                            </button>
                                                                        ) : (
                                                                            <button
                                                                                className="btn btn-primary propety-btn-primary w-100"
                                                                                onClick={() => addToCart(listData)}
                                                                            >
                                                                                <img
                                                                                    className="detaillocation-frame-inner property-logo-img"
                                                                                    alt=""
                                                                                    src={Image9}
                                                                                />
                                                                                Add to Cart
                                                                            </button>
                                                                        );
                                                                    })()
                                                                )}

                                                                {isSubmitted === "yes" ? (
                                                                    <button
                                                                        className="btn text-light mt-2 border-0 property-logo-view-details"
                                                                        onClick={() => navigateToProDetails(listData.id, listData.type)}
                                                                    >
                                                                        View details
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn text-light mt-2 border-0 property-logo-view-details"
                                                                        data-bs-toggle="modal"
                                                                        data-bs-target="#exploreDate"
                                                                    >
                                                                        View details
                                                                    </button>
                                                                )}
                                                            </div>



                                                            <div className="property-card-body property-card-3">
                                                                <div className="d-flex m-0">
                                                                    <h6 className="property-card-title3">{listData.displayName}</h6>
                                                                    <p className="property-card-text-3">{listData.stateName}</p>
                                                                </div>
                                                                <p className="property-card-text-4">{currencyCode} {listData.sellingRate ? `${listData.sellingRate.monthly.month1}.00` : 'N/A'}</p>
                                                                <div className="list-unstyled">
                                                                    <div className="property-row-3">
                                                                        <div className="column  property-column-3">
                                                                            <p className="title-msg property-title-msg">Site resolution</p>
                                                                            <p className="value  property-title-msg">
                                                                                {listData.type === "DIGITAL" ? (
                                                                                    <p className="value property-title-msg">
                                                                                        {listData.resolutionHeight} X {listData.resolutionWidth}
                                                                                    </p>
                                                                                ) : (
                                                                                    <p className="value property-title-msg">
                                                                                        {listData.panelHeight} X {listData.panelWidth}
                                                                                    </p>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="column  property-column-3">
                                                                            <p className="title-msg property-title-msg">Number of screens</p>
                                                                            <p className="value  property-title-msg">{listData.specification?.screens}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="property-row-3">
                                                                        <div className="column  property-column-3">
                                                                            <p className="title-msg property-title-msg">Impressions</p>
                                                                            <p className="value  property-title-msg">{listData.monthlySummary?.totalVisitors}</p>
                                                                        </div>
                                                                        <div className="column  property-column-3">
                                                                            <p className="title-msg property-title-msg">Next available slot</p>
                                                                            <p className="value  property-title-msg">{listData.nextAvailableDate}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    ) : (<div className="text-center">No Data found...</div>)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {showMap && (
                    <div className="col-md-8">
                        <div className="map-section">
                            <div className="mapbox-section"
                                ref={mapContainer}
                                style={{ position: "absolute", top: '18rem', bottom: 0 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="modal fade property-unavailable" id="assignCreativeModal" aria-labelledby="assignCreativeLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog ">
                    <div className="modal-content">
                        <div className="modal-header property_list_popup_header ">
                            <h5 className="modal-title property_list_popup_header_content " id="assignCreativeLabel">Property unavailable</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {soldCampaignViewDetails.thumbnailPath ? (
                                <img className="card-img-top" alt={soldCampaignViewDetails.displayName} src={soldCampaignViewDetails.thumbnailPath} />
                            ) : (
                                <img className="detaillocation-frame-inner property-logo-img" alt="no image" src={NoImage} />
                            )}
                            {soldCampaignViewDetails.availableBooking ? (
                                <span className="badge badge-danger status-label props-status-label bg-light text-success"><i
                                    className="fa-solid fa-circle"></i> Available</span>
                            ) : (
                                <span className="badge badge-danger status-label props-status-label bg-light text-danger"><i
                                    className="fa-solid fa-circle"></i> Sold Out</span>
                            )}
                            <div className="d-flex m-0">
                                <h6 className="property-card-title3">{soldCampaignViewDetails.displayName}</h6>
                                <p className="property-card-text-3">{soldCampaignViewDetails.stateName}</p>
                            </div>
                            <p className="property-card-text-4">{currencyCode} {soldCampaignViewDetails.sellingRate ? soldCampaignViewDetails.sellingRate.monthly.month1 : ''}</p>

                            <p className="property_list_popup_notify_content">This property seems to be unavailable at this moment, try changing your campaign duration as per next available slot</p>

                            <div className="column  property-column-3">
                                <p className="title-msg property-title-msg">Next available slot</p>
                                <p className="value  property-title-msg">{soldCampaignViewDetails.nextAvailableDate}</p>
                            </div>

                            <button className="property_list_popup_gotit_btn" data-bs-dismiss="modal" aria-label="Close">Got it</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="filterModal" aria-labelledby="filterModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header property_list_filter_popup_header border-0" >
                            <h5 className="modal-title property_list_filter_popup_header_content" id="filterModalLabel">Filters</h5>
                            <button type="button" onClick={closeFilter} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body ">
                            <div className="modal-header selected-filters d-flex">
                                <p className="property_list_filter_popup_selected_input_header">Selected inputs</p>
                                <div className="property_list_scrollbar" id="style">
                                    <div>
                                        {badges.map((badge, index) => (
                                            <span className="badge property_list_filter_popup_selected_input" key={index}>
                                                {badge}
                                                <button
                                                    type="button"
                                                    className="btn-close btn text-primary property_list_filter_popup_selected_input_close"
                                                    aria-label="Close"
                                                    onClick={() => handleRemoveBadge(badge)}
                                                ></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex row">
                                {/* Filters Column */}
                                <div className="filter-column col-md-3" style={{ borderRight: '1px solid #ddd', borderLeft: '1px solid #ddd', paddingLeft: '0px', paddingRight: '0px' }}>
                                    <h6 className="property_list_popup_list_header">Filters</h6>
                                    <div className="category-list">
                                        <p className={`property_list_popup_list_header_1 ${activeCategoryLocation === 'location' ? 'active' : ''}`}
                                            id="locationFilterLink"
                                            onClick={handleLocationFilterClick}>
                                            Location based filters
                                        </p>
                                        <p
                                            className={`property_list_popup_list_header_2 ${activeCategory?.id === 'venue' ? 'active' : ''}`}
                                            id="locationFilterLink_1"
                                            onClick={handleLocationVenueClick}
                                        >
                                            Venue type
                                        </p>
                                        <p className={`property_list_popup_list_header_2 ${activeCategorySite === 'site' ? 'active' : ''}`}
                                            id="locationFilterLink_3"
                                            onClick={handleLocationSiteClick}>
                                            Site based filters
                                        </p>
                                        <p className={`property_list_popup_list_header_2 ${activeCategoryBill === 'bill' ? 'active' : ''}`}
                                            id="locationFilterLink_4"
                                            onClick={handleLocationBillClick}>
                                            Billboard based filters</p>
                                        <p className={`property_list_popup_list_header_2 ${activeCategoryPrice === 'price' ? 'active' : ''}`}
                                            id="locationFilterLink_5"
                                            onClick={handleLocationPriceClick}>
                                            Price based filters</p>
                                    </div>
                                    <p className="property_list_popup_list_header_formcheck"><input type="checkbox" checked /> Show unavailable location</p>
                                    <p className="property_list_popup_list_header_formcheck_1"><input type="checkbox" /> Show location without picture</p>
                                </div>

                                <div className="content-column col-md-3" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                    {showLocationFilters && (
                                        <div id="locationFilters" style={{ borderRight: '1px solid #ddd' }}>
                                            <h6 className="property_list_popup_list_header">Environment</h6>
                                            <div className="property_list_popup_list_cm">
                                                <div className="form-check">
                                                    <label className="form-check-label" htmlFor="indoorCheck">
                                                        <input
                                                            type="radio"
                                                            id="indoorCheck"
                                                            name="indoor"
                                                            onChange={(e) => handleCheckboxLocation('Indoor', e.target.checked)}
                                                            checked={indoorChecked}
                                                        /> Indoor
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <label className="form-check-label" htmlFor="outdoorCheck">
                                                        <input
                                                            type="radio"
                                                            id="outdoorCheck"
                                                            name="indoor"
                                                            onChange={(e) => handleCheckboxLocation('Outdoor', e.target.checked)}
                                                            checked={outdoorChecked}
                                                        /> Outdoor
                                                    </label>
                                                </div>

                                                <div className="mt-3">
                                                    <label htmlFor="selectState" className="form-label">Select State</label>
                                                    <select
                                                        className="form-select property_list_select_state country-select border rounded-pill"
                                                        onChange={handleCountryChange}
                                                        id="selectState"
                                                        value={country}

                                                    >
                                                        <option disabled value="">State</option>
                                                        {stateOptions.length > 0 ? (
                                                            stateOptions.map((list) => (
                                                                list.stateId ? (
                                                                    <option key={list.stateId} value={list.stateId}>
                                                                        {list.name}
                                                                    </option>
                                                                ) : null
                                                            ))
                                                        ) : (
                                                            <option value="">No state available</option>
                                                        )}
                                                    </select>
                                                </div>

                                                <div className="mt-3">
                                                    <label htmlFor="selectState" className="form-label">Select District</label>
                                                    <select
                                                        className="form-select property_list_select_state country-select border rounded-pill"
                                                        onChange={(e) => setState(e.target.value)}
                                                        value={state}
                                                        id="selectDistrict"
                                                        disabled={!country}
                                                    >
                                                        <option disabled value="">District</option>
                                                        {countryOptions.length > 0 ? (
                                                            countryOptions.map((country) => (
                                                                <option key={country.districtId} value={country.districtId}>
                                                                    {country.name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option value="">No district available</option>
                                                        )}
                                                    </select>
                                                </div>

                                                <p className="property_list_popup_list_header_4"></p>
                                                <p className="property_list_popup_list_header_4"></p>
                                                <p className="property_list_popup_list_header_4"></p>
                                                <p className="property_list_popup_list_header_4"> </p>
                                                <p className="property_list_popup_list_header_4"> </p>
                                                <p className="property_list_popup_list_header_4"></p>

                                            </div>
                                        </div>
                                    )}

                                    {showLocationVenue && (
                                        <div className="filter-column" style={{ borderRight: '1px solid #ddd', paddingRight: '0px' }}>
                                            <div className="row assign_creative_card_scroll">
                                                <h6 className="property_list_popup_list_header">Categories</h6>
                                                <div className="category-list">
                                                    {venueTypes?.map((category: Category, index: any) => (
                                                        <p
                                                            key={category.id || index}
                                                            className={`property_list_popup_list_header_1 ${activeCategory?.id === category.id ? 'active' : ''}`}  // Add active class here
                                                            onClick={() => handleLocationFinancialClick(category)}
                                                        >
                                                            {category.value}
                                                            <i className="fa-solid fa-chevron-right property_list_popup_rightarrow"></i>
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {showLocationSite && (
                                        <div className="filter-column" style={{ borderRight: '1px solid #ddd', paddingRight: '0px', paddingLeft: '12px' }}>
                                            <div className="filter-column" style={{ borderRight: '1px solid #ddd', paddingRight: '0px', paddingLeft: '12px' }}>
                                                <div className="row assign_creative_card_scroll">
                                                    <h6 className="property_list_popup_list_header">Site types</h6>
                                                    <div className="category-list">
                                                        <p className="property_list_popup_list_header_3">
                                                            <input
                                                                type="radio"
                                                                name="site-type"
                                                                value="Classic"
                                                                checked={selectedSiteType === 'Classic'}
                                                                onChange={() => handleSiteTypeChange('Classic')}
                                                            />
                                                            Classic ({classicTotalSize})
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="radio"
                                                                name="site-type"
                                                                value="Digital"
                                                                checked={selectedSiteType === 'Digital'}
                                                                onChange={() => handleSiteTypeChange('Digital')}
                                                            />
                                                            Digital ({digitalTotalSize})
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="radio"
                                                                name="site-type"
                                                                value="Network"
                                                                checked={selectedSiteType === 'Network'}
                                                                onChange={() => handleSiteTypeChange('Network')}
                                                            />
                                                            Network
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="radio"
                                                                name="site-type"
                                                                value="Scrollable"
                                                                checked={selectedSiteType === 'Scrollable'}
                                                                onChange={() => handleSiteTypeChange('Scrollable')}
                                                            />
                                                            Scrollable
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="radio"
                                                                name="site-type"
                                                                value="Package"
                                                                checked={selectedSiteType === 'Package'}
                                                                onChange={() => handleSiteTypeChange('Package')}
                                                            />
                                                            Package
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="radio"
                                                                name="site-type"
                                                                value="Transit"
                                                                checked={selectedSiteType === 'Transit'}
                                                                onChange={() => handleSiteTypeChange('Transit')}
                                                            />
                                                            Transit
                                                        </p>
                                                        <h6 className="property_list_popup_list_header">Screen Size (Digital)</h6>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="checkbox"
                                                                name="site-types"
                                                                value="Small (15 sqft)"
                                                                onChange={handleScreenSizeChange}
                                                                checked={badges.includes('Small (15 sqft)')}
                                                            /> Small (15 sqft)
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="checkbox"
                                                                name="site-types"
                                                                value="Medium (15-99 sqft)"
                                                                onChange={handleScreenSizeChange}
                                                                checked={badges.includes('Medium (15-99 sqft)')}
                                                            /> Medium (15-99 sqft)
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="checkbox"
                                                                name="site-types"
                                                                value="Large (100-249 Sqft)"
                                                                onChange={handleScreenSizeChange}
                                                                checked={badges.includes('Large (100-249 Sqft)')}
                                                            /> Large (100-249 sqft)
                                                        </p>
                                                        <p className="property_list_popup_list_header_4">
                                                            <input
                                                                type="checkbox"
                                                                name="site-types"
                                                                value="Extra Large (249 Sqft)"
                                                                onChange={handleScreenSizeChange}
                                                                checked={badges.includes('Extra Large (249 Sqft)')}
                                                            /> Extra Large (249 sqft)
                                                        </p>



                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {showLocationBill && (
                                        <div className="filter-column" style={{ borderRight: '1px solid #ddd', paddingRight: '0px', paddingLeft: '12px' }}>
                                            <div className="row assign_creative_card_scroll">
                                                <h6 className="property_list_popup_list_header">Bill format based</h6>
                                                <div className="category-list">
                                                    <p className="property_list_popup_list_header_3" ><input type="checkbox" onChange={(e) => handleCheckboxLocationBill('96 sheets', e.target.checked)} checked={sheetsChecked} /> 96 sheets </p>
                                                    <p className="property_list_popup_list_header_4"><input type="checkbox" onChange={(e) => handleCheckboxLocationBill('Bulletin', e.target.checked)} checked={bulletin} /> Bulletin</p>
                                                    <p className="property_list_popup_list_header_4"><input type="checkbox" onChange={(e) => handleCheckboxLocationBill('City Lights', e.target.checked)} checked={cityLights} /> City Lights</p>
                                                    <p className="property_list_popup_list_header_4"><input type="checkbox" onChange={(e) => handleCheckboxLocationBill('Bus Shelter', e.target.checked)} checked={busShelter} /> Bus Shelter </p>
                                                    <p className="property_list_popup_list_header_4"><input type="checkbox" onChange={(e) => handleCheckboxLocationBill('Gallery', e.target.checked)} checked={gallery} /> Gallery </p>
                                                    <p className="property_list_popup_list_header_4"></p>
                                                    <p className="property_list_popup_list_header_4"></p>
                                                    <p className="property_list_popup_list_header_4"></p>
                                                    <p className="property_list_popup_list_header_4"> </p>
                                                    <p className="property_list_popup_list_header_4"> </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}


                                    {showLocationPrice && (
                                        <div className="filter-column" style={{ borderRight: '1px solid #ddd', paddingRight: '0px', paddingLeft: '12px' }}>
                                            <div className="row assign_creative_card_scroll">
                                                <h6 className="property_list_popup_list_header">Average price</h6>
                                                <div className="category-list">
                                                    <div className="form-group">
                                                        <input
                                                            type="range"
                                                            className="form-range"
                                                            min="1"
                                                            max="3500"
                                                            step="10"
                                                            value={minPrice}
                                                            onChange={handleMinPriceChange}
                                                        />
                                                    </div>

                                                    <div className="input-group assign_creative_input_group mt-4">
                                                        <p className="property_list_popup_list_header_5">Min price</p>
                                                        <input
                                                            type="number"
                                                            className="form-control border-bottom-only assign_creative_border_bottom_only"
                                                            aria-label="Search"
                                                            value={minPrice}
                                                            onChange={handleMinPriceChange}
                                                        />
                                                    </div>

                                                    <div className="input-group assign_creative_input_group mt-4">
                                                        <p className="property_list_popup_list_header_5">Max price</p>
                                                        <input
                                                            type="number"
                                                            className="form-control border-bottom-only assign_creative_border_bottom_only"
                                                            aria-label="Search"
                                                            value={maxPrice}
                                                            onChange={handleMaxPriceChange}
                                                        />
                                                    </div>
                                                    <button onClick={handlePriceRangeChange} className="btn btn-primary mt-4 assign_creative_footer_btn_2">
                                                        Apply Price Range
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="content-column col-md-3" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                    {showLocationFinancial && activeCategory && (
                                        <div className="filter-column" style={{ borderRight: '1px solid #ddd', paddingLeft: '0px' }}>
                                            <h6 className="property_list_popup_list_header">Sub-categories</h6>
                                            <div className="category-list">
                                                {activeCategory.child?.map((subCategory: SubCategory, index: any) => {
                                                    const isEmptyChild = !subCategory.child || subCategory.child.length === 0;
                                                    return (
                                                        <div key={subCategory.id || index} className="category-item">
                                                            {isEmptyChild ? (
                                                                <label className="subcategorycheckbox">
                                                                    <input
                                                                        style={{ marginRight: '5px' }}
                                                                        type="checkbox"
                                                                        checked={badges.includes(subCategory.value)}
                                                                        onChange={() => handleCheckboxChange(subCategory)} // Define your checkbox handling function
                                                                    />
                                                                    {subCategory.value}
                                                                </label>
                                                            ) : (
                                                                <p
                                                                    className={`property_list_popup_list_header_1 ${activeSubCategory?.id === subCategory.id ? 'active' : ''}`}
                                                                    onClick={() => handleSubCategoryClick(subCategory)}
                                                                >
                                                                    {subCategory.value}
                                                                    <i className="fa-solid fa-chevron-right property_list_popup_rightarrow"></i>
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="content-column col-md-3" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                    {showLocationFinancial && activeSubCategory && (
                                        <div className="filter-column" style={{ borderLeft: '1px solid #ddd' }}>
                                            <h6 className="property_list_popup_list_header">Products</h6>
                                            <div className="category-list">
                                                {activeSubCategory.child?.map((gradSubCategory: GrandSubCategory, index: number) => (
                                                    <div key={gradSubCategory.id || index} className="d-flex align-items-center">
                                                        <input
                                                            type="checkbox"
                                                            id={`checkbox-${gradSubCategory.id}`}
                                                            checked={badges.includes(gradSubCategory.value)}
                                                            onChange={() => handleCheckboxChange(gradSubCategory)}
                                                            className="grdcategory-checkbox"
                                                        />
                                                        <p
                                                            className={`property_list_popup_list_header_3 ${activeGradSubCategory?.id === gradSubCategory.id ? 'active' : ''}`}
                                                            onClick={() => handleGradSubCategoryClick(gradSubCategory)}
                                                        >
                                                            {gradSubCategory.value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn assign_creative_footer_btn_1" onClick={() => resetAllStates()}>
                                    Reset
                                </button>
                                <button type="button" className="btn btn-primary assign_creative_footer_btn_2" data-bs-dismiss="modal" onClick={() => { setCurrentPage(0); fetchBillBoardList() }}>
                                    Apply filters
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="exploreDate" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content explore-content">
                        <div className="modal-header explore_property_filter_popup_header border-0" >
                            <h5 className="modal-title exploredate_title">Select Dates</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body explore_datebody">
                            <div className="explore_startDate">
                                <label htmlFor="explore_startDate">Start Date:</label>
                                <div className="property_list_date_start d-flex align-items-center position-relative">
                                    <div onClick={toggleStartDatePickers} className="calendar-icon-wrapper">
                                        <img alt="Start Date" src={Image7} className="date-icon" />
                                    </div>
                                    <div className="date-text-1 explore-date" onClick={toggleStartDatePickers}>
                                        <p style={{ "borderBottom": "1.5px solid black" }}>
                                            {startDates ? format(startDates, "dd MMM yyyy") : "Select Start Date"}
                                        </p>
                                    </div>
                                    {showStartDatePickers && (
                                        <div className="datepicker-wrapper">
                                            <div className="close-icon" onClick={toggleStartDatePickers}>×</div>
                                            <p className="card_date_header">Select Campaign start date</p>
                                            {showYearPickers ? (
                                                <div className="year-picker">
                                                    <div className="years-grid">
                                                        {Array.from({ length: 10 }, (_, i) => (
                                                            <button key={i} onClick={() => handleYearSelections(selectedYears + i)} className="year-button">
                                                                {selectedYears + i}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : showMonthPickers ? (
                                                <div className="month-picker">
                                                    <div className="months-grid">
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <button key={i} onClick={() => handleMonthSelections(i)} className="month-button">
                                                                {format(new Date(2021, i), "MMM")}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <DatePicker
                                                    selected={tempStartDates}
                                                    onChange={handleStartDateChanges}
                                                    inline
                                                    minDate={currentDate}
                                                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                        <div className="custom-header">
                                                            <button onClick={(e) => { handleMonthButtonClicks(e); decreaseMonth(); }}>{"«"}</button>
                                                            <span onClick={toggleMonthPickers}>{format(date, "MMMM")}</span>
                                                            <span onClick={toggleYearPickers}>{format(date, "yyyy")}</span>
                                                            <button onClick={(e) => { handleMonthButtonClicks(e); increaseMonth(); }}>{"»"}</button>
                                                        </div>
                                                    )}
                                                />
                                            )}
                                            <button className="update-button" onClick={handleUpdateStartDates}>Update</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="explore_endDate">
                                <label htmlFor="explore_endDate">End Date:</label>
                                <div className="property_list_date_end d-flex align-items-center position-relative">
                                    <div onClick={toggleEndDatePickers} className="calendar-icon-wrapper">
                                        <img alt="End Date" src={Image7} className="date-icon" />
                                    </div>
                                    <div className="date-text-1 explore-date explore-enddate" onClick={toggleEndDatePickers}>
                                        <p style={{ "borderBottom": "1.5px solid black" }}>
                                            {endDates ? format(endDates, "dd MMM yyyy") : "Select End Date"}
                                        </p>
                                    </div>
                                    {showEndDatePickers && (
                                        <div className="datepicker-wrapper">
                                            <div className="close-icon" onClick={toggleEndDatePickers}>×</div>
                                            <p className="card_date_header">Select Campaign end date</p>
                                            {showYearPickers ? (
                                                <div className="year-picker">
                                                    <div className="years-grid">
                                                        {Array.from({ length: 10 }, (_, i) => (
                                                            <button key={i} onClick={() => handleYearSelections(selectedYears + i)} className="year-button">
                                                                {selectedYears + i}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : showMonthPickers ? (
                                                <div className="month-picker">
                                                    <div className="months-grid">
                                                        {Array.from({ length: 12 }, (_, i) => (
                                                            <button key={i} onClick={() => handleMonthSelections(i)} className="month-button">
                                                                {format(new Date(2021, i), "MMM")}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <DatePicker
                                                    selected={tempEndDates}
                                                    onChange={handleEndDateChanges}
                                                    inline
                                                    // minDate={currentDate}
                                                    minDate={startDates ? addDays(startDates, 1) : new Date()}
                                                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                        <div className="custom-header">
                                                            <button onClick={(e) => { handleMonthButtonClicks(e); decreaseMonth(); }}>{"«"}</button>
                                                            <span onClick={toggleMonthPickers}>{format(date, "MMMM")}</span>
                                                            <span onClick={toggleYearPickers}>{format(date, "yyyy")}</span>
                                                            <button onClick={(e) => { handleMonthButtonClicks(e); increaseMonth(); }}>{"»"}</button>
                                                        </div>
                                                    )}
                                                />
                                            )}
                                            <button className="update-button" onClick={handleUpdateEndDates}>Update</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-primary explore_dateSubmit" data-bs-dismiss="modal" aria-label="Close" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* cartloginPopup */}
            <div className="modal fade" id="exploreLogin" aria-labelledby="exploreLoginLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="exploremodal-content">
                        <div className="modal-header explorelogin_header">
                            <h1 className="modal-title fs-5" id="exploreLoginLabel"></h1>
                            <button id="explore-login-close-btn" type="button" ref={modalRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body row explorelogin-body">
                            <div className="exploreLogin_left col-md-6">
                                <div className="explorelogin-leftside">

                                    <img className='explorelogo-style exploreloginfilled-your-logo-icon' src={yourLogo} alt="edde" />

                                    <h1 className="exploreloginfilled-welcome-to-outfront-container font">
                                        <p className="loginfilled-welcome-to">Welcome to</p>
                                        <p className="loginfilled-outfront-media">OutFront Media</p>
                                    </h1>

                                    <h1 className="exploreloginfilled-run-your-next">
                                        Run your next outdoor Advertising campaign with just a few clicks
                                    </h1>
                                </div>
                            </div>
                            <div className="exploreLogin_right col-md-6">
                                <form>
                                    <div className="loginfilled-login-form-parents exploreloginfilled-login-form-parent">
                                        <div className="image-bg-style">
                                            <div className="card cart-bg-style explore-rightside">
                                                <div className="right-side-alignment exploreright-side-alignment">
                                                    <h4 className="exploreloginfilled-please-enter-your">
                                                        Please enter your login and password
                                                    </h4>

                                                    {errors && <div className="error-message">{errors}</div>}

                                                    <div className="loginfilled-hatimbig-parent username-input-top">
                                                        <input
                                                            className="loginfilled-hatimbig"
                                                            placeholder="User Name"
                                                            type="text"
                                                            name="username"
                                                            value={username}
                                                            onChange={(e) => setUsername(e.target.value)}
                                                        />
                                                        <div
                                                            className={`loginfilled-frame-username ${loginsubmit && !username ? 'error' : ''}`}
                                                        ></div>
                                                        {loginsubmit && username.length === 0 ? (
                                                            <div className="text-danger error-message-required">Username is required</div>
                                                        ) : ""
                                                        }
                                                    </div>

                                                    <div className="loginfilled-hatimbig-parent">
                                                        <input
                                                            className="loginfilled-hatimbig"
                                                            placeholder="Password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            id="passwordInput"
                                                            name="password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}

                                                        />
                                                        <div
                                                            className={`loginfilled-frame-password ${loginsubmit && !password ? 'error' : ''}`}
                                                        ></div>

                                                        {loginsubmit && password.length === 0 && (
                                                            <div className="text-danger error-message-required">Password is required</div>
                                                        )}
                                                        <i
                                                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye`}
                                                            id="togglePassword"
                                                            onClick={togglePasswordVisibility}
                                                            style={{ cursor: 'pointer' }}
                                                        ></i>

                                                        <div className="forgot-link">
                                                            <div className="row">
                                                                <div className="col-md-12 loginfilled-forget-password explore-forgetpassword">
                                                                    <a href={`${process.env.REACT_APP_BASE_PATH}/forgot-password`}>Forgot password</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="exploreloginfilled-login-btn">

                                                        {loadingLogin ? <button type="submit" onClick={handleLogin}>
                                                            <div className="spinner-loading">
                                                                <Spinner
                                                                    as="span"
                                                                    animation="grow"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                                Loading...
                                                            </div>
                                                        </button> : <button type="submit" onClick={handleLogin}>
                                                            Login
                                                        </button>}


                                                    </div>

                                                    <div className="register-link">
                                                        <span className="loginfilled-not-a-member">
                                                            <a href={`${process.env.REACT_APP_BASE_PATH}/sign-up`} className="exploreloginfilled-register-now" id="signup-link">
                                                                Sign Up
                                                            </a>
                                                        </span>
                                                        <span className="signup-line"> | </span>
                                                        <Link to="" data-bs-toggle="modal" data-bs-target="#exploreSubmit" className="exploreloginfilled-register-now" id="signup-link">
                                                            Submit Enquiry
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* submitEnquiryPopup */}

            <div className="modal fade" id="exploreSubmit" aria-labelledby="exploreSubmitLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header exploreSubmit-header">
                            <h1 className="modal-title fs-5" id="exploreSubmitLabel">Submit Enquiry</h1>
                            <button id="explore-login-submit-btn" type="button" ref={modalRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body exploreSubmit-body">
                            <h6>General details</h6>
                            <div className="row">
                                {errors && <div className="error-message">{errors}</div>}
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="submitName" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className={`form-control exploreSubmitInput ${submit && submitName.length === 0 ? 'error-border' : ''}`}
                                        id="submitName"
                                        value={submitName}
                                        onChange={(e) => setSubmitName(e.target.value)}
                                    />
                                    <div
                                        className={`loginfilled-frame-username ${submit && !submitName ? 'error' : ''}`}
                                    ></div>
                                    {submit && submitName.length === 0 ? (
                                        <div className="text-danger error-message-required">Username is required</div>
                                    ) : ""
                                    }
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="submitCompanyName" className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className={`form-control exploreSubmitInput ${submit && submitCompanyName.length === 0 ? 'error-border' : ''}`}
                                        id="submitCompanyName"
                                        value={submitCompanyName}
                                        onChange={(e) => setSubmitCompanyName(e.target.value)}
                                    />
                                    <div
                                        className={`loginfilled-frame-username ${submit && !submitCompanyName ? 'error' : ''}`}
                                    ></div>
                                    {submit && submitCompanyName.length === 0 ? (
                                        <div className="text-danger error-message-required">Company Name is required</div>
                                    ) : ""
                                    }
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="submitEmail" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className={`form-control exploreSubmitInput ${submit && submitEmail.length === 0 ? 'error-border' : ''}`}
                                        id="submitEmail"
                                        value={submitEmail}
                                        onChange={(e) => setSubmitEmail(e.target.value)}
                                    />
                                    <div
                                        className={`loginfilled-frame-username ${submit && !emailRegex.test(submitEmail) ? 'error' : ''}`}
                                    ></div>
                                    {submit && !emailRegex.test(submitEmail) ? (
                                        <div className="text-danger error-message-required">Please enter a valid email address</div>
                                    ) : ""
                                    }
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="submitPhone" className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className={`form-control exploreSubmitInput ${submit && submitPhone.length === 0 ? 'error-border' : ''}`}
                                        id="submitPhone"
                                        value={submitPhone}
                                        onChange={(e) => setSubmitPhone(e.target.value)}
                                    />
                                    <div
                                        className={`loginfilled-frame-username ${submit && !phoneRegex.test(submitPhone) ? 'error' : ''}`}
                                    ></div>
                                    {submit && submitPhone.length === 0 ? (
                                        <div className="text-danger error-message-required">Phone number is required</div>
                                    ) : ""}
                                    {submit && !phoneRegex.test(submitPhone) && submitPhone.length > 0 ? (
                                        <div className="text-danger error-message-required">Please enter a valid phone number.</div>
                                    ) : ""}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="submitAddress" className="form-label">Address</label>
                                    <input
                                        type="text"
                                        className="form-control exploreSubmitInput border-bottom-only no-focus-border"
                                        id="submitAddress"
                                        value={submitAddress}
                                        onChange={(e) => setSubmitAddress(e.target.value)}
                                    />
                                </div>

                                <h6>Schedule details</h6>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="submitStartDate" className="form-label">Start Date</label>

                                    <div className="property_list_date_start submitenquiry-dates-popup d-flex align-items-center position-relative">
                                        <div onClick={toggleSubmitStartDatePicker} className="calendar-icon-wrapper">
                                            <img alt="Start Date" src={Image7} className="date-icon" />
                                        </div>
                                        <div className="date-text-1 explore-date" onClick={toggleSubmitStartDatePicker}>
                                            <p>
                                                {submitstartDates ? format(submitstartDates, "dd MMM yyyy") : "Select Start Date"}
                                            </p>
                                        </div>
                                        {showSubmitStartDatePickers && (
                                            <div className="datepicker-wrapper">
                                                <div className="close-icon" onClick={toggleSubmitStartDatePicker}>
                                                    ×
                                                </div>
                                                <p className="card_date_header">Select Campaign start date</p>
                                                {showSubmitYearPickers ? (
                                                    <div className="year-picker">
                                                        <div className="years-grid">
                                                            {Array.from({ length: 10 }, (_, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleSubmitYearSelection(selectedSubmitYears + i)}
                                                                    className="year-button"
                                                                >
                                                                    {selectedSubmitYears + i}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : showSubmitMonthPickers ? (
                                                    <div className="month-picker">
                                                        <div className="months-grid">
                                                            {Array.from({ length: 12 }, (_, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleSubmitMonthSelection(i)}
                                                                    className="month-button"
                                                                >
                                                                    {format(new Date(2021, i), "MMM")}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <DatePicker
                                                        selected={tempSubmitStartDates}
                                                        onChange={handleSubmitStartDateChange}
                                                        inline
                                                        minDate={currentDate}
                                                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                            <div className="custom-header">
                                                                <button onClick={(e) => { handleSubmitMonthButtonClick(e); decreaseMonth(); }}>{"«"}</button>
                                                                <span onClick={toggleSubmitMonthPicker}>
                                                                    {format(date, "MMMM")}
                                                                </span>
                                                                <span onClick={toggleSubmitYearPicker}>
                                                                    {format(date, "yyyy")}
                                                                </span>
                                                                <button onClick={(e) => { handleSubmitMonthButtonClick(e); increaseMonth(); }}>{"»"}</button>
                                                            </div>
                                                        )}
                                                    />
                                                )}
                                                <button className="update-button" onClick={handleSubmitUpdateStartDate}>
                                                    Update
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`loginfilled-frame-username ${startDatesubmit && !submitStartDate ? 'error' : ''}`}
                                    ></div>
                                    {/* {startDatesubmit && submitStartDate.length === 0 ? (
                                        <div className="text-danger error-message-required">Start date is required</div>
                                    ) : ""
                                    } */}
                                </div>
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="submitEndDate" className="form-label">End Date</label>

                                    <div className="property_list_date_end submitenquiry-dates-popup d-flex align-items-center position-relative">
                                        <div onClick={toggleSubmitEndDatePicker} className="calendar-icon-wrapper">
                                            <img alt="End Date" src={Image7} className="date-icon" />
                                        </div>
                                        <div className="date-text-1 explore-date explore-enddate" onClick={toggleSubmitEndDatePicker}>
                                            <p>
                                                {submitendDates ? format(submitendDates, "dd MMM yyyy") : "Select End Date"}
                                            </p>
                                        </div>
                                        {showSubmitEndDatePickers && (
                                            <div className="datepicker-wrapper">
                                                <div className="close-icon" onClick={toggleSubmitEndDatePicker}>
                                                    ×
                                                </div>
                                                <p className="card_date_header">Select Campaign end date</p>
                                                {showSubmitYearPickers ? (
                                                    <div className="year-picker">
                                                        <div className="years-grid">
                                                            {Array.from({ length: 10 }, (_, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleSubmitYearSelection(selectedSubmitYears + i)}
                                                                    className="year-button"
                                                                >
                                                                    {selectedSubmitYears + i}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : showSubmitMonthPickers ? (
                                                    <div className="month-picker">
                                                        <div className="months-grid">
                                                            {Array.from({ length: 12 }, (_, i) => (
                                                                <button
                                                                    key={i}
                                                                    onClick={() => handleSubmitMonthSelection(i)}
                                                                    className="month-button"
                                                                >
                                                                    {format(new Date(2021, i), "MMM")}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <DatePicker
                                                        selected={tempSubmitEndDates}
                                                        onChange={handleSubmitEndDateChange}
                                                        inline
                                                        // minDate={currentDate}
                                                        minDate={startDate ? addDays(startDate, 1) : new Date()}
                                                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                            <div className="custom-header">
                                                                <button onClick={(e) => { handleSubmitMonthButtonClick(e); decreaseMonth(); }}>{"«"}</button>
                                                                <span onClick={toggleSubmitMonthPicker}>
                                                                    {format(date, "MMMM")}
                                                                </span>
                                                                <span onClick={toggleSubmitYearPicker}>
                                                                    {format(date, "yyyy")}
                                                                </span>
                                                                <button onClick={(e) => { handleSubmitMonthButtonClick(e); increaseMonth(); }}>{"»"}</button>
                                                            </div>
                                                        )}
                                                    />
                                                )}
                                                <button className="update-button" onClick={handleSubmitUpdateEndDate}>
                                                    Update
                                                </button>
                                            </div>
                                        )}

                                    </div>

                                    <div
                                        className={`loginfilled-frame-username ${endDatesubmit && !submitEndDate ? 'error' : ''}`}
                                    ></div>
                                    {/* {endDatesubmit && submitEndDate.length === 0 ? (
                                        <div className="text-danger error-message-required">End date is required</div>
                                    ) : ""
                                    } */}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="exploreSubmitClose" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="exploreSubmitRequest"
                                onClick={handleSubmitEnquiry}

                            >
                                Request for approval
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Submit Success */}
            <div className="modal fade" id="successModal" tabIndex={-1} aria-labelledby="successModalLabel" aria-hidden="true" ref={successModalRef}>
                <div className="modal-dialog modal-dialog-centered model-xl">
                    <div className="modal-content">
                        <div className="modal-header assign_creative_apply_success_header">
                            <h5 className="modal-title assign_creative_apply_success_header_content" id="successModalLabel">Success message</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <i className="fa-regular fa-thumbs-up assign_creative_popup_success_icon"></i>
                            <p className="assign_creative_popup_success_con_2">Successfully submitted enquiry
                                Our representative will reach out to you shortly</p>
                        </div>
                        <div className="modal-footer justify-content-center border-0">
                            <button type="button" className="assign_creative_footer_btn_1" data-bs-dismiss="modal" ref={modalRef} onClick={handleSubmitSuccess}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default BillBoardListingExploreProperty;

function showPopup(inventory: any) {
    throw new Error("Function not implemented.");
}
