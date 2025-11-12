import React, { Component, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import Image1 from "../../../assets/images/search.svg";
import Image2 from "../../../assets/images/group-212841306.svg";
import Image3 from "../../../assets/images/mappin.svg";
import Image6 from "../../../assets/images/cart-icon.svg";
import Image5 from "../../../assets/images/sliders@2x.png";
import Image9 from "../../../assets/images/group-21.svg";
import NoImage from "../../../assets/images/nomedia.jpg";

import './index.css';
import { gql, useMutation, useQuery } from "@apollo/client";
import { GETPROPERTY_LIST } from "../../../Graphql/PropertyListQueries";
import client, { MAPBOX_TOKEN } from "../../../Graphql/apolloClient";

import { ADD_TO_CART_SUBMIT, DELETE_CART_SUBMIT, GET_MY_CART_ITEMS } from "../../../Graphql/cartQueries";
import { toast } from "react-toastify";
import { generateMockData } from "../../../Graphql/MockData";
import { CART_INITIAL_QUERY, CART_PAGE_ITEM, GET_COUNTRY_LIST, GET_DISTRICT_LIST, GET_STATE_LIST, INVOICE, PROPERTY_LIST_VENUE_TYPE_LIST } from "../../../Graphql/Queries";
import { E } from "@faker-js/faker/dist/airline-BLb3y-7w";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
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

interface SssItem {
    id: string;
    cartItemId: string;
    [key: string]: any;
}
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
    specification: {
        screens: string;
    }
    inventoryLatitude?: number;
    inventoryLongitude?: number;
    nowPayPrice: any;
    reasonForRejection: string;

}interface Inventory {
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
type Field = {
    key: string;
    type: string;
    label: string;
    default: boolean | string;
    disabled?: boolean;
    options?: { label: string; value: string }[];
};

type Configuration = {
    key: string;
    label: string;
    fields?: Field[];
    options?: { label: string; value: string }[];
    type?: string;
    default?: boolean | string;
    disabled?: boolean;
};
interface CampaignInventory {
    id: string;
    cartItemId: string;
    [key: string]: any;
}
const locations = [
    '96 sheets',
    'Bulletin',
    'City Lights',
    'Bus Shelter',
    'Gallery'
];

const BillBoardListing = (props: any) => {
    const { currencyCode } = props;
    const [showMap, setShowMap] = useState(false);
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
    const [badges, setBadges] = useState<string[]>([]);
    const [cartDataList, setCartDataList] = useState<CampaignInventory[]>([]);
    const [resultObj, setResultObj] = useState<any>([]);
    const location = useLocation();
    const cardData = location.state || {};
    const formData = cardData?.formData || {};
    const cartformData = cardData?.cartformData || {};
    const currentDate = new Date();
    const [startDate, setStartDate] = useState<Date>(() => {
        return props?.filterData?.startDate ? new Date(props?.filterData.startDate) :
            (formData?.startDate ? new Date(formData.startDate) :
                (cartformData?.startDate ? new Date(cartformData.startDate) : new Date()));
    });

    const [endDate, setEndDate] = useState<Date>(() => {
        return props?.filterData?.endDate ? new Date(props?.filterData.endDate) :
            (formData?.endDate ? new Date(formData.endDate) :
                (cartformData?.endDate ? new Date(cartformData.endDate) : new Date()));
    });
    const [campaignName, setCampaignName] = useState<string>(
        formData?.campaignName || cartformData?.campaignName || props.filterData?.campaignName || 'Default Campaign'
    );
    const [state, setState] = useState<any>(formData?.state || '');
    const [district, setDistrict] = useState<any>(formData?.district || '');

    const [billBoardDataLoading, setBillBoardDataLoading] = useState(false);
    const [billBoardData, setBillBoardData] = useState<any>([]);
    const [classicbillBoardData, setclassicBillBoardData] = useState<any>([]);
    const [digitalbillBoardData, setdigitalBillBoardData] = useState<any>([]);
    const [soldCampaignViewDetails, setSoldCampaignViewDetails] = useState<any>({});
    const [cartData, setCartData] = useState<any>([{}]);
    const [cartCount, setCartCount] = useState(0);
    const [addtoCartQuery] = useMutation(ADD_TO_CART_SUBMIT);
    const [deleteCartQuery] = useMutation(DELETE_CART_SUBMIT);
    const [billboardType, setBillboardType] = useState(formData?.propertyDetails ? formData?.propertyDetailsType : "digital");
    const dataListLength = 12;
    const [totalDataLength, setTotalDataLength] = useState(0);
    const [pageStartData, setPageStartData] = useState(0);
    const [pageEndData, setPageEndData] = useState(0);
    const [locationData, setLocationData] = useState<string[]>([]);
    const [venueTypeData, setVenueTypeData] = useState<string[]>([]);
    const [siteTypeData, setSitetypeData] = useState<string[]>([]);
    const mapContainer = useRef<HTMLDivElement>(null);
    const [mapLat, setMapLat] = useState<number>(0);
    const [mapLng, setMapLng] = useState<number>(0);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup | null>(null);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
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
                initialMap.remove();
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
                marker.setLngLat([mapLng, mapLat]);
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
                            updatedPopupElem.style.fontSize = "25px";
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
            />
            </div>
            <div class="map-popup-body">
              <div class="row">
                <div class="col-md-6">
                  <h3 class="map-popup-title">${inventory?.displayName || "N/A"}</h3>
                  <p class="map-popup-stat-label">Impressions: ${impressions}</p>
                  <p class="map-popup-stat-label"> ${currencyCode} ${prices ? `${prices}.00` : "N/A"}</p>
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

    const handleCheckboxLocation = (badgeValue: string, checked: boolean) => {
        if (badgeValue === 'Indoor') {
            if (checked) {
                setIndoorChecked(true);
                setOutdoorChecked(false);
                setBadges((prevBadges) => [...prevBadges.filter(badge => badge !== 'Outdoor'), 'Indoor']);
                setLocationData((prevBadges) => [...prevBadges.filter(badge => badge !== 'Outdoor'), 'Indoor']);
            } else {
                setIndoorChecked(false);
                setBadges((prevBadges) => prevBadges.filter(badge => badge !== 'Indoor'));
                setLocationData((prevBadges) => prevBadges.filter(badge => badge !== 'Indoor'));
            }
        } else if (badgeValue === 'Outdoor') {
            if (checked) {
                setOutdoorChecked(true);
                setIndoorChecked(false);
                setBadges((prevBadges) => [...prevBadges.filter(badge => badge !== 'Indoor'), 'Outdoor']);
                setLocationData((prevBadges) => [...prevBadges.filter(badge => badge !== 'Indoor'), 'Outdoor']);
            } else {
                setOutdoorChecked(false);
                setBadges((prevBadges) => prevBadges.filter(badge => badge !== 'Outdoor'));
                setLocationData((prevBadges) => prevBadges.filter(badge => badge !== 'Outdoor'));
            }
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
            const newBadges = prevBadges.filter(badge => !badge.includes(screenSize));
            setSitetypeData([...newBadges, `${screenSize}`]);
            return [...newBadges, `${screenSize}`];
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
    // const [state, setState] = useState<string>("");
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
    const [indoorChecked, setIndoorChecked] = useState(false);
    const [outdoorChecked, setOutdoorChecked] = useState(false);



    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const companyId = process.env.REACT_APP_COMPANY_ID;

    const [currentPage, setCurrentPage] = useState(0);
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        fetchBillBoardList();
    }, [props.filterData])
    useEffect(() => {

        if (props?.filterData?.startDate) {
            setStartDate(new Date(props?.filterData.startDate));
        }
        if (props?.filterData?.endDate) {
            setEndDate(new Date(props?.filterData.endDate));
        }
    }, [props?.filterData?.startDate, props?.filterData?.endDate]);
    useEffect(() => {
        if (startDate && endDate) {
            fetchBillBoardList();
        }
    }, [startDate, endDate]);
    const { loading: loadingCartList, error: errorCartList, data: dataCartLists, refetch: refetchCartLists } = useQuery(GET_MY_CART_ITEMS, {
        variables: {
            accessToken: token,
            userId: userId
        }
    })
    useEffect(() => {
        if (dataCartLists) {
            const cartDataLists = dataCartLists.cartpageItem;

            if (cartDataLists) {
                setCartCount(cartDataLists?.length); // Update the count
            } else {
            }

            refetchCartLists(); // Trigger refetch if needed
        }
    }, [dataCartLists]);

    // Sync billboard state with cart data
    useEffect(() => {
        if (dataCartLists) {
            const cartDataList = dataCartLists.cartpageItem;

            if (Array.isArray(billBoardData) && Array.isArray(cartDataList)) {
                const updatedBillBoardData = billBoardData.map(billboard => ({
                    ...billboard,
                    isInCart: cartDataList.some(cartItem => cartItem.cartItemId === billboard.id),
                }));
                setBillBoardData(updatedBillBoardData);
            }
        }
    }, [dataCartLists]);

    const isValidDate = (date: string) => !isNaN(Date.parse(date));



    const validStartDate = isValidDate(cartformData?.startDate)
        ? new Date(cartformData.startDate)
        : new Date(formData.startDate);

    const validEndDate = isValidDate(cartformData?.endDate)
        ? new Date(cartformData.endDate)
        : new Date(formData.endDate);

    const [edit, setEdit] = useState<boolean>(cartformData.edit || false);

    const { data: dataCartList, refetch: refetchCartList } = useQuery(CART_PAGE_ITEM, {
        variables: {
            accessToken: token,
            campaignId: cartformData?.selectedCampaignId || '',
            userId: userId,
            edit: edit,
            startDate: format(validStartDate, 'yyyy-MM-dd'),
            endDate: format(validEndDate, 'yyyy-MM-dd'),
        },
    });

    useEffect(() => {
        if (dataCartList) {

            setTimeout(() => {

                const fetchedCartDataList = dataCartList.cartPageItem;
                const cartDataList = dataCartList.cartPageItem;
                setCartDataList(cartDataList);
                setCartData(cartDataList);
                setcartId(cartDataList);






                let totalCampaignInventoriesLength = 0;

                fetchedCartDataList.map((cartItem: { campaignInventories: string | any[]; }) => {
                    if (cartItem?.campaignInventories) {
                        totalCampaignInventoriesLength = cartItem.campaignInventories.length;
                    } else {
                    }
                });




                // setCartCount(totalCampaignInventoriesLength);



                let resultObj = billBoardData;
                let cartObj = cartDataList;

                if (resultObj.length > 0 && cartObj.length > 0) {

                    cartObj.map((cartItem: { campaignInventories: any[]; }) => {
                        const newBillBoardData = resultObj.map((obj: { id: any; }) => {

                            const cartItemIds = cartItem.campaignInventories.map((inventory) => inventory.billboardId);




                            if (obj.id === cartItemIds) {
                                return { ...obj, isInCart: true };
                            } else {
                                return { ...obj, isInCart: false };
                            }
                        });

                        resultObj = newBillBoardData;
                        setBillBoardData(newBillBoardData);
                    });
                }
                refetchCartList()
            }, 1000);
        }
    }, [dataCartList]);

    useEffect(() => {
        if (process.env.REACT_APP_MOCK_DATA === 'true') {
            generateMockData(GETPROPERTY_LIST).then((mockResponse: any) => {
                const data = mockResponse.data
                setBillBoardDataLoading(false);
                setBillBoardData(data.landingpageExploreProperties)

            }).catch((err: any) => {
                console.error("Error generating mock data:", err);
            });
        } else {
            fetchBillBoardList();
            fetchCartItems(userId);
        }
    }, [search])

    const [cartItemCount, setCartItemCount] = useState(0);
    const { data } = useQuery(PROPERTY_LIST_VENUE_TYPE_LIST);
    const venueTypes = data?.venueTypes || [];
    const { data: myCart, loading, error } = useQuery(CART_INITIAL_QUERY, {
        variables: {
            accessToken: token,
            userId: userId,
        },
    });

    useEffect(() => {
        if (myCart && myCart.cartpageItem) {
            const cartItems = myCart.cartpageItem || [];
            setCartCount(cartItems.length);
        }
    }, [myCart]);


    const fetchCartItems = async (user: any) => {
        try {
            const { data, loading, error } = await client.query({
                query: GET_MY_CART_ITEMS,
                variables: {
                    accessToken: token,
                    userId: user
                }
            })
            if (data) {
                const cartDataList = data.cartpageItem;
                setCartData(cartDataList);
                let cartItemsCount = cartDataList.length;
                setcartId(data.cartpageItem)
                fetchBillBoardList("", data.cartpageItem);
            } else {
                fetchBillBoardList();
            }
        } catch (error) {
            fetchBillBoardList();
        }
    };
    useEffect(() => {
        fetchCartItems(userId);
    }, []);
    useEffect(() => {
        fetchBillBoardList();
    }, [currentPage]);

    useEffect(() => {
        if (props.filterData.startDate && props.filterData.endDate) {
            setStartDate(new Date(props.filterData.startDate));
            setEndDate(new Date(props.filterData.endDate));
        }
    }, [props.filterData]);
    const { refetch: refetchBillBoardList } = useQuery(GETPROPERTY_LIST, {
        variables: {
            accessToken: token,
            sort: "last_modified_date,desc",
            billboard: billboardType,
            userId: userId,
            companyId: companyId,
            page: currentPage,
            size: dataListLength,
            startDate: format(startDate, 'dd MMMM yyyy'),
            endDate: format(endDate, 'dd MMMM yyyy'),
            dspName: "LMX-ECOMMERCE",
            countryId: countryId,
            searchTerm: search,
            filterData: { type: billboardType.toUpperCase(), availableBooking: true, categories: [], format: [], venueType: [] }
        }
    });
    const [digitalTotalSize, setdigitalTotalSize] = useState("")
    const [clasicTotalSize, setclasicTotalSize] = useState("")
    const fetchClassicLength = async () => {
        try {

            const { data, loading, error } = await client.query({
                query: GETPROPERTY_LIST,
                variables: {
                    accessToken: token,
                    sort: "last_modified_date,desc",
                    billboard: 'classic',
                    userId: userId,
                    companyId: companyId,
                    page: currentPage,
                    size: exploreDatas?.exploreData?.classicTotalSize || dataListLength,
                    startDate: format(startDate, 'dd MMMM yyyy'),
                    endDate: format(endDate, 'dd MMMM yyyy'),
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
                setclasicTotalSize(data.landingpageExploreProperties[0]?.totalSize);
                setclassicBillBoardData(data.landingpageExploreProperties);


            }

        } catch (error) {

        }
    };
    const fetchDigitalLength = async () => {
        try {
            const { data, loading, error } = await client.query({
                query: GETPROPERTY_LIST,
                variables: {
                    accessToken: token,
                    sort: "last_modified_date,desc",
                    billboard: 'digital',
                    userId: userId,
                    companyId: companyId,
                    page: currentPage,
                    size: exploreDatas?.exploreData?.digitalTotalSize || dataListLength,
                    startDate: format(startDate, 'dd MMMM yyyy'),
                    endDate: format(endDate, 'dd MMMM yyyy'),
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
                setdigitalTotalSize(data.landingpageExploreProperties[0]?.totalSize);
                setdigitalBillBoardData(data.landingpageExploreProperties);

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
            let categories = locationData.map(category => category.toUpperCase());
            const filterData = {
                type: billboardType.toUpperCase(),
                availableBooking: true,
                categories: categories,
                format: siteTypeData,
                venueType: venueTypeData,
            };
            const { data, loading, error } = await client.query({
                query: GETPROPERTY_LIST,
                variables: {
                    accessToken: token,
                    sort: "last_modified_date,desc",
                    billboard: billboardType,
                    userId: userId,
                    companyId: companyId,
                    page: currentPage,
                    size: dataListLength,
                    startDate: format(startDate, 'dd MMMM yyyy'),
                    endDate: format(endDate, 'dd MMMM yyyy'),
                    dspName: "LMX-ECOMMERCE",
                    countryId: countryId,
                    searchTerm: search,
                    filterData: filterData
                }
            })
            if (data) {
                setBillBoardDataLoading(false);
                let resultObj = data.landingpageExploreProperties;
                setResultObj(resultObj);
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
                    setBillBoardData(data.landingpageExploreProperties);
                }
                setTotalDataLength(data.landingpageExploreProperties[0].totalSize);

                if (data.landingpageExploreProperties[0].totalSize > 0) {
                    if (currentPage === 0) {
                        setPageStartData(1);
                        if (data.landingpageExploreProperties[0].totalSize > dataListLength) {
                            setPageEndData(dataListLength);
                        } else {
                            setPageEndData(data.landingpageExploreProperties[0].totalSize);
                        }
                    } else {
                        const curStartData = dataListLength * currentPage;
                        setPageStartData(curStartData + 1);
                        const curEndData = curStartData + dataListLength;
                        if (data.landingpageExploreProperties[0].totalSize > curEndData) {
                            setPageEndData(curEndData);
                        } else {
                            setPageEndData(data.landingpageExploreProperties[0].totalSize);
                        }
                    }
                }
            }
        } catch (error) {
            setBillBoardDataLoading(false);
        }
    };
    useEffect(() => {
        if (props.filterData.startDate && props.filterData.endDate) {
            setStartDate(new Date(props.filterData.startDate));
            setEndDate(new Date(props.filterData.endDate));
        }
    }, [props.filterData]);

    // Refetch the data whenever startDate or endDate changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                setBillBoardDataLoading(true);

                if (startDate && endDate) {
                    await refetchBillBoardList({
                        startDate: format(startDate, 'dd MMMM yyyy'),
                        endDate: format(endDate, 'dd MMMM yyyy'),
                    });
                }
            } catch (error) {
            } finally {
                setBillBoardDataLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate, refetchBillBoardList]);
    const resetAllStates = () => {
        setBadges([]);
        console.log(badges);
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

    const locations = useLocation();
    const { exploreDatas } = locations.state || {};

    const [loadingCartItemId, setLoadingCartItemId] = useState<string | null>(null);

    const [cartItemIds, setCartItemIds] = useState<any>(null);

    const addToCart = async (items: any[] | any) => {
        setLoadingCartItemId(null);

        const itemsArray = Array.isArray(items) ? items : [items];

        console.log(itemsArray.map((item: any) => (item.panelHeight)));



        const formattedItems = itemsArray.map(itemData => {
            console.log("Item Data:", itemData);  // Ensure the data is correct

            const cartItemResolution = itemData.cartItemResolution || (
                itemData.cartItemType === 'CLASSIC'
                    ? `${itemData.panelHeight && itemData.panelWidth ? itemData.panelHeight + 'x' + itemData.panelWidth : 'Default Resolution'}`
                    : `${itemData.resolutionHeight && itemData.resolutionWidth ? itemData.resolutionHeight + 'x' + itemData.resolutionWidth : 'Default Resolution'}`
            );

            console.log("Resolved Resolution:", cartItemResolution);

            return {
                accessToken: token,
                userId: userId,
                campaignName: campaignName,
                startDate: format(startDate, 'dd MMMM yyyy'),
                endDate: format(endDate, 'dd MMMM yyyy'),
                cartItemName: itemData.cartItemName || itemData.displayName,
                cartItemId: itemData.cartItemId || itemData.id,
                cartItemReferenceId: itemData.cartItemReferenceId || itemData.referenceId,
                cartItemType: itemData.cartItemType || itemData.type,
                cartItemCountry: itemData.cartItemCountry || itemData.countryName,
                cartItemVenueType: itemData.cartItemType || itemData.type,
                cartItemResolution: cartItemResolution,
                cartItemThumbnailUrl: itemData.cartItemThumbnailUrl || itemData.thumbnailPath,
                cartItemLatitude: itemData.cartItemLatitude || itemData.latitude,
                cartItemLongitude: itemData.cartItemLongitude || itemData.longitude,
                packageDetails: itemData.packageDetails || "",
            };
        });

        console.log("Formatted Items:", formattedItems);


        console.log("Formatted Items:", formattedItems);

        console.log(formattedItems);

        try {
            const { data, errors } = await addtoCartQuery({
                variables: {
                    input: formattedItems
                }
            });

            if (data) {

                const itemIds = itemsArray.map(item => item.cartItemId);
                setCartItemIds(itemIds);

                data.addtocart.itemData.forEach((response: any) => {
                    if (response.success) {
                        const newBillBoardData = billBoardData.map((obj: { id: any }) => {
                            if (obj.id === response.id) {
                                return { ...obj, isInCart: true };
                            }
                            return obj;
                        });
                        setBillBoardData(newBillBoardData);
                        setCartCount(cartCount + 1);
                        refetchCartList();
                        refetchCartLists();
                        // localStorage.removeItem("addedBillboardIds");
                        toast.success(response.message);
                    } else {
                        toast.error(response.message);
                    }
                });
            }

            if (errors) {
                toast.error(errors[0].message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoadingCartItemId(null);
        }
    };





    const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    useEffect(() => {
        const fetchAndProcessBillboards = async () => {
            if (isProcessing) return;
            setIsProcessing(true);
            const allBillboardData = [...(digitalbillBoardData || []), ...(classicbillBoardData || [])];

            console.log(allBillboardData);


            if (exploreDatas?.exploreData?.exploreCondtion === true) {
                const addedBillboardIds = JSON.parse(localStorage.getItem("addedBillboardIds") || "[]");

                if (Array.isArray(addedBillboardIds) && Array.isArray(allBillboardData)) {
                    const cartBillboardIds = new Set(
                        dataCartList?.cartPageItem?.flatMap((cartItem: { campaignInventories: any[]; }) =>
                            cartItem.campaignInventories.map(inventory => inventory.billboardId)
                        )
                    );
                    const remainingIds = addedBillboardIds.filter(exploreId => {
                        return !cartBillboardIds.has(exploreId) && !processedIds.has(exploreId);
                    });

                    const inputArray = []; // Initialize the array for storing item data

                    for (const exploreId of remainingIds) {
                        const matchedBillboard = allBillboardData.find(billboard => String(billboard.id) === String(exploreId));
                        console.log("matchbillboardid checking ----line no: 1119", matchedBillboard);


                        if (matchedBillboard) {
                            // Build the item object for each billboard
                            const itemData = {
                                accessToken: token,
                                userId: userId,
                                campaignName: campaignName,
                                startDate: format(startDate, 'dd MMMM yyyy'),
                                endDate: format(endDate, 'dd MMMM yyyy'),
                                cartItemName: matchedBillboard?.displayName || campaignName,
                                cartItemId: matchedBillboard?.id || 'Default ID',
                                cartItemReferenceId: matchedBillboard?.referenceId || 'Default Reference',
                                cartItemType: matchedBillboard?.type || 'Default Type',
                                cartItemCountry: matchedBillboard?.countryName || 'Default Country',
                                cartItemVenueType: matchedBillboard?.venueType || 'Default Venue Type',
                                cartItemResolution: matchedBillboard?.type === 'CLASSIC' ? `${matchedBillboard.panelHeight}x${matchedBillboard.panelWidth}` :
                                    `${matchedBillboard.resolutionHeight}x${matchedBillboard.resolutionWidth}`,
                                cartItemThumbnailUrl: matchedBillboard?.thumbnailPath || 'Default Thumbnail',
                                cartItemLatitude: matchedBillboard?.latitude || 0,
                                cartItemLongitude: matchedBillboard?.longitude || 0,
                                packageDetails: matchedBillboard?.packageDetails || ''
                            };
                            console.log("itemData------>", itemData);


                            inputArray.push(itemData); // Add the item to the array
                            setProcessedIds(prevProcessedIds => {
                                const newProcessedIds = new Set(prevProcessedIds);
                                newProcessedIds.add(matchedBillboard.id);
                                return newProcessedIds;
                            });
                        }
                    }

                    // Once all items are collected, call the mutation to add them all at once
                    if (inputArray.length > 0) {
                        await addToCart(inputArray); // Pass the array of items
                    }
                }
            }
            setIsProcessing(false);
        };

        fetchAndProcessBillboards();
        // localStorage.removeItem("addedBillboardIds");
    }, [exploreDatas, dataCartList, digitalbillBoardData, classicbillBoardData, token, userId, campaignName, startDate, endDate, addToCart, processedIds]);





    const [cartId, setcartId] = useState<SssItem[]>([]);
    const deleteCartItem = async (itemData: any) => {
        // Find the item in the cart data
        const matchingItem = cartDataList.find((list: any) => {
            return list.campaignInventories.some((item: any) => item.billboardId === itemData.id);
        });


        if (!matchingItem) {
            toast.error("Item not found in cart.");
            return;
        }
        const matchedInventory = matchingItem.campaignInventories.find((item: any) => item.billboardId === itemData.id);
        const cartItemId = matchedInventory ? matchedInventory.cartItemId : null;
        const matchFound = invoice?.campaignInventories.some((item: any) => {
            const inventoryId = String(item.inventoryId);
            const resultId = String(itemData.id);

            return inventoryId === resultId;
        });


        const dynamicItemType = matchFound ? 'draft-data' : 'cart-data';


        if (!cartItemId) {
            toast.error("Item's cartItemId not found.");
            return;
        }


        try {
            const { data, errors } = await deleteCartQuery({
                variables: {
                    accessToken: token,
                    deleteItemId: cartItemId,
                    itemType: dynamicItemType
                }
            });

            if (data) {
                if (data.deleteCartItem.success) {
                    // Update UI by removing item from cart and updating billboard data
                    const newBillBoardData = billBoardData.map((obj: { id: any; }) => {
                        if (obj.id === itemData.id) {
                            return { ...obj, isInCart: false };
                        }
                        return obj;
                    });
                    setBillBoardData(newBillBoardData);
                    setCartCount(cartCount - 1);
                    refetchCartList();
                    refetchCartLists();
                    localStorage.removeItem("addedBillboardIds");
                    toast.success(data.deleteCartItem.message);

                } else {
                    toast.error(data.deleteCartItem.message);
                }
            }

            if (errors) {
                toast.error(errors[0].message);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the item.");
        }
    };
    const ShowAddDeleteCartBtn = (curObj: any) => {
        let status = false;
        cartData.some((cartItem: CampaignInventory) => {
            if (cartItem?.campaignInventories?.some(
                (inventory: {
                    billboardId: any; cartItemId: any
                }) => inventory.billboardId === curObj.id
            )) {
                status = true;
            }
        });
        return status;
    };
    // Invoice

    const { data: datass } = useQuery(INVOICE, {
        variables: {
            accessToken: token,
            campId: cartformData?.selectedCampaignId,
        },
    });

    const invoice = datass?.paymentInvoice;
    const isMatchingCampaignss = invoice?.campaignInventories.find((item: { inventoryId: any; }) => {
        const matchFound = resultObj.some((resultItem: any) => {
            const inventoryId = String(item.inventoryId);
            const resultId = String(resultItem.id);


            return inventoryId === resultId;

        });


        return matchFound;
    });

    const soldCampaignDetails = (details: any) => {
        setSoldCampaignViewDetails(details);
    }
    const billboardTypeChange = (eve: any) => {
        setBillboardType(eve);
        setCurrentPage(0);
    }
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
    }, [billboardType, currentPage])
    const { data: datas } = useQuery(INVOICE, {
        variables: {
            accessToken: token,
            campId: cartformData.selectedCampaignId,
        },
    });


    useEffect(() => {

    }, [datas])
    const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setSearch(event.currentTarget.value);
        }
    };
    const inputRef = useRef<HTMLInputElement>(null);
    const handleRotate = () => {
        setSearch('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };
    const Navigate = useNavigate();
    const navigateToCart = () => {
        const cartformData = cardData?.cartformData || {};



        if (cartformData.itsEdits === 'edits') {
            toast.error('Please update the edit campaign');
            const editData = {
                campaignId: cartformData.selectedCampaignId,
                condition: cartformData.condition,
                edit: cartformData.condition === false ? false : true
            };
            Navigate(`${process.env.REACT_APP_BASE_PATH}/editCampaign`, { state: { editData } });
        }
        else {
            const formData = {
                campaignName,
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                campaignId: '',
                edit: false,
                state: state,
                district: district,
            };

            Navigate(`${process.env.REACT_APP_BASE_PATH}/mycart`, { state: { formData, showSaveAndRequest: true } });
        }
    };

    const navigateToProDetails = (id: any, type: any) => {
        const cartformData = cardData?.cartformData || {};
        const propertyDetailsData = {
            id,
            type,
            campaignName,
            startDate,
            endDate,
            state,
            district,
            billboardType,
            currentPage,
            dataListLength,
        }
        Navigate(`${process.env.REACT_APP_BASE_PATH}/property-details`, { state: { propertyDetailsData, showSaveAndRequest: true, selectedCampaignId: cartformData?.selectedCampaignId } });

    };




    const closeFilter = () => {
        setActiveCategoryLocation(null);
        setShowLocationFilters(!showLocationFilters);
    }
    const [config, setConfig] = useState<any[]>([]);
    const [propertyList, setPropertyListTerms] = useState<any[]>([]);

    useEffect(() => {
        fetchConfig();
    }, [])


    const fetchConfig = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
            const data = await response.json();
            const value = data.find((page: any) => page.name === "Property List");
            const Termsvalue = data.find((page: any) => page.name === "Property card details");


            setConfig(value?.configurations || []);

        } catch (error) {
            console.error("Error fetching configuration:", error);
        }
    };

    useEffect(() => {

        if (isFieldEnabled('digital', config)) {

            setBillboardType(formData?.propertyDetails ? formData?.propertyDetailsType : 'digital');
        } else {

            setBillboardType(formData?.propertyDetails ? formData?.propertyDetailsType : 'classic');
        }
    }, [config]);

    const isFieldEnabled = (key: string, config: Configuration[]) => {
        const fieldConfig = config.flatMap(cfg => cfg.fields || []).find(field => field.key === key);
        return fieldConfig ? fieldConfig.default : true;
    };

    const shouldShowLocationTab = (config: any[]) => {

        return isFieldEnabled('environment', config) ||
            isFieldEnabled('select state', config) ||
            isFieldEnabled('select district', config);
    };

    const shouldShowPriceTab = (config: any[]) => {

        return isFieldEnabled('average price', config) ||
            isFieldEnabled('minimum price', config) ||
            isFieldEnabled('maximum price', config);
    };


    const [isMapViewEnabled, setIsMapViewEnabled] = useState(false);
    const [isListMapViewEnabled, setIsListMapViewEnabled] = useState(false);
    const [isListViewEnabled, setIsListViewEnabled] = useState(false);

    useEffect(() => {
        const mapAndListViewConfig = config?.find((config: { key: string; }) => config.key === "MapAndListView");
        if (mapAndListViewConfig) {
            setIsListMapViewEnabled(mapAndListViewConfig.default === "yes");
            setIsListViewEnabled(mapAndListViewConfig.options[0].value === "yes")
            setIsMapViewEnabled(mapAndListViewConfig.options[1].value === "yes")
        }
    }, [config]);





    return (
        <>
            <div className="row property-list-search-container">
                <div className={`col-sm-12 ${showMap ? 'col-md-4' : 'col-md-5'}`}>
                    <div className="input-group assign_creative_input_group g-4">
                        <span className="input-group-text search-icon assign_creative_search_icon">
                            <img src={Image1} alt="" />
                        </span>
                        <input type="text" className="form-control border-bottom-only assign_creative_border_bottom_only " placeholder="Search for billboards" aria-label="Search"
                            //  value={search} onChange={(e) => setSearch(e.target.value)} 
                            ref={inputRef}
                            onKeyDown={handleSearchChange}
                        />
                        <span>
                            <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
                        </span>
                        {isListMapViewEnabled && (
                            <>
                                {isListViewEnabled && (
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
                                        /> */}
                                    </div>
                                )}
                                {isMapViewEnabled && (
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
                                        /> */}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className={`col-sm-12 ${showMap ? 'col-md-8' : 'col-md-7'} property_list_search_con_2`}>
                    <div className="gx-2 gy-2 d-flex justify-content-end property_list_search_con_3">
                        <div className="">
                            <span className="assign_filter_by">Show only:</span>
                        </div>
                        <div className="">
                            <div className="dropdown">
                                <button className="btn btn-sm w-100 border-0 assign_drowdown_head" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {`${billboardType} (${totalDataLength})`} <i className="fa-solid fa-angle-down"></i>
                                </button>
                                <ul className="dropdown-menu assign_dropdown_menu">
                                    {isFieldEnabled('classic', config) && (
                                        <li><a onClick={() => billboardTypeChange('classic')} className="dropdown-item assign_dropdown_item">Classic ({clasicTotalSize})<i className="fa-solid fa-check assign_fa_check"></i></a></li>
                                    )}
                                    {isFieldEnabled('digital', config) && (
                                        <li><a onClick={() => billboardTypeChange('digital')} className="dropdown-item assign_dropdown_item">Digital ({digitalTotalSize})<i className="fa-solid fa-check assign_fa_check"></i></a></li>
                                    )}
                                    {/* <li><a onClick={() =>billboardTypeChange('network')} className="dropdown-item assign_dropdown_item">Network<i className="fa-solid fa-check assign_fa_check"></i></a></li>
                                    <li><a onClick={() =>billboardTypeChange('scrollable')} className="dropdown-item assign_dropdown_item">Scrollable<i className="fa-solid fa-check assign_fa_check"></i></a></li>
                                    <li><a onClick={() =>billboardTypeChange('package')} className="dropdown-item assign_dropdown_item">Package<i className="fa-solid fa-check assign_fa_check"></i></a></li>
                                    <li><a onClick={() =>billboardTypeChange('transit')} className="dropdown-item assign_dropdown_item">Transit<i className="fa-solid fa-check assign_fa_check"></i></a></li> */}
                                </ul>
                            </div>
                        </div>
                        {isFieldEnabled('do you need a filter?', config) && (
                            <div className=" d-flex" >
                                {/* <img className="property_list_filter_icon" onClick={handleLocationFilterClick} src={Image5} alt="" /> */}
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
                                <button className="assign_creative_popup_filter" data-bs-toggle="modal" data-bs-target="#filterModal" onClick={handleLocationFilterClick}>Filter</button>
                            </div>
                        )}
                        <div className="">
                            <div className="property_list_search_card_con">
                                <button className="property_list_search_card" onClick={navigateToCart}>
                                    <svg width="15" height="15" className="detaillocation-frame-inner property-logo-img" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path className="propertyListsvg-path" fill-rule="evenodd" clip-rule="evenodd" d="M12.9231 2.92773L10.7564 0.761104C10.4194 0.42402 9.86825 0.42402 9.53117 0.761104C9.19408 1.09819 9.19408 1.6493 9.53117 1.98639L10.4725 2.92773H12.9226H12.9231ZM0.875675 5.27152H14.1733C14.1757 5.27152 14.1776 5.27152 14.18 5.27152C14.62 5.26817 14.9786 4.90714 14.9786 4.46616C14.9786 4.02325 14.6162 3.66079 14.1733 3.66079H13.6035H11.2061H3.8424H1.44498H0.875675C0.432774 3.66079 0.0703125 4.02325 0.0703125 4.46616C0.0703125 4.90666 0.428943 5.26769 0.868972 5.27152C0.870887 5.27152 0.873281 5.27152 0.875675 5.27152ZM0.967607 6.00458L1.99322 13.6426C2.06026 14.141 2.47922 14.5078 2.98245 14.5078H7.52447H12.0665C12.5692 14.5078 12.9887 14.141 13.0557 13.6426L14.0818 6.00458H0.968086H0.967607ZM3.422 8.0606C3.38322 7.70149 3.64561 7.40798 4.00471 7.40798C4.36382 7.40798 4.68894 7.70149 4.72772 8.0606L5.1711 12.1822C5.20989 12.5413 4.9475 12.8348 4.58839 12.8348C4.22928 12.8348 3.90416 12.5413 3.86538 12.1822L3.422 8.0606ZM6.87184 8.0606C6.87184 7.70149 7.16536 7.40798 7.52447 7.40798C7.88357 7.40798 8.17709 7.70149 8.17709 8.0606V12.1822C8.17709 12.5413 7.88357 12.8348 7.52447 12.8348C7.16536 12.8348 6.87184 12.5413 6.87184 12.1822V8.0606ZM9.87783 12.1822L10.3212 8.0606C10.36 7.70149 10.6851 7.40798 11.0442 7.40798C11.4033 7.40798 11.6652 7.70149 11.6269 8.0606L11.1835 12.1822C11.1448 12.5413 10.8197 12.8348 10.4605 12.8348C10.1014 12.8348 9.83952 12.5413 9.87783 12.1822ZM4.57594 2.92725L5.51728 1.98591C5.85437 1.64882 5.85437 1.09771 5.51728 0.760626C5.1802 0.423541 4.62909 0.423541 4.292 0.760626L2.12538 2.92725H4.57594Z" />
                                    </svg>

                                    {/* <img className="detaillocation-frame-inner property-logo-img" alt="" height="15px" width="17px"
                                        src={Image6} />  */}
                                    Cart ({cartCount})</button>
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
                                                <div className={`col-md-${showMap ? '12' : '4'}`} >
                                                    <div className="property_list_scroll" onClick={() => handleSelectBillboard(listData)}>
                                                        <div className="card props-hover2 mb-3 border-0"  >
                                                            {isFieldEnabled('DisplayImage', config) && (
                                                                listData.thumbnailPath && listData.thumbnailPath !== "null" && listData.thumbnailPath.trim() !== "" ? (
                                                                    <img className="card-img-top" alt={listData.displayName} src={listData.thumbnailPath} />
                                                                ) : (
                                                                    <img className="detaillocation-frame-inner property-logo-img" alt="no image" src={NoImage} />
                                                                )
                                                            )}


                                                            {isFieldEnabled('Availability', config) && (
                                                                listData.active ? (
                                                                    <span className="badge badge-danger status-label props-status-label bg-light text-success">
                                                                        <i className="fa-solid fa-circle"></i> Available
                                                                    </span>
                                                                ) : (
                                                                    <span className="badge badge-danger status-label props-status-label bg-light text-danger">
                                                                        <i className="fa-solid fa-circle"></i> Sold Out
                                                                    </span>
                                                                )
                                                            )}

                                                            <div className="card-img-overlay card-img-overlay-custom">
                                                                {listData.active && isFieldEnabled('AddToCart', config) && (
                                                                    listData.isInCart || ShowAddDeleteCartBtn(listData) ? (
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
                                                                    )
                                                                )}

                                                                {isFieldEnabled('view more', config) && (
                                                                    listData.active ? (
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
                                                                            data-bs-target="#assignCreativeModal"
                                                                            onClick={() => soldCampaignDetails(listData)}
                                                                        >
                                                                            View details
                                                                        </button>
                                                                    )
                                                                )}

                                                            </div>
                                                            <div className="property-card-body property-card-3">
                                                                <div className="d-flex m-0">
                                                                    {isFieldEnabled('display name', config) && (
                                                                        <h6 className="property-card-title3">{listData.displayName}</h6>
                                                                    )}

                                                                    {isFieldEnabled('city', config) && (
                                                                        <p className="property-card-text-3">{listData.countryName}</p>
                                                                    )}
                                                                </div>
                                                                <p className="property-card-text-4">{currencyCode} {listData.sellingRate ? `${listData.sellingRate.monthly.month1}.00` : 'N/A'}</p>
                                                                <div className="list-unstyled">
                                                                    <div className="property-row-3">
                                                                        {isFieldEnabled('resolution/size', config) && (
                                                                            <div className="column property-column-3">
                                                                                <p className="title-msg property-title-msg">Site resolution</p>
                                                                                {listData.type === "DIGITAL" ? (
                                                                                    <p className="value property-title-msg">
                                                                                        {listData.resolutionHeight} X {listData.resolutionWidth}
                                                                                    </p>
                                                                                ) : (
                                                                                    <p className="value property-title-msg">
                                                                                        {listData.panelHeight} X {listData.panelWidth}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                        {isFieldEnabled('screen type', config) && (
                                                                            <div className="column  property-column-3">
                                                                                <p className="title-msg property-title-msg">Number of screens</p>
                                                                                <p className="value  property-title-msg">{listData.specification?.screens}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="property-row-3">

                                                                        {isFieldEnabled('show potential views', config) && (
                                                                            <div className="column  property-column-3">
                                                                                <p className="title-msg property-title-msg">Impressions</p>
                                                                                <p className="value  property-title-msg">{listData.monthlySummary?.totalVisitors}</p>
                                                                            </div>
                                                                        )}

                                                                        {isFieldEnabled('Next Availability', config) && (

                                                                            <div className="column  property-column-3">
                                                                                <p className="title-msg property-title-msg">Next available slot</p>
                                                                                <p className="value  property-title-msg">{listData.nextAvailableDate}</p>
                                                                            </div>
                                                                        )}
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
                                style={{ position: "absolute", top: '22rem', bottom: 0 }} />
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
                                <p className="property-card-text-3">{soldCampaignViewDetails.countryName}</p>
                            </div>
                            <p className="property-card-text-4">{currencyCode} {soldCampaignViewDetails.sellingRate ? `${soldCampaignViewDetails.sellingRate.monthly.month1}.00` : 'N/A'}</p>

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
                                        {
                                            shouldShowLocationTab(config) && (
                                                <p
                                                    className={`property_list_popup_list_header_1 ${activeCategoryLocation === 'location' ? 'active' : ''}`}
                                                    id="locationFilterLink"
                                                    onClick={handleLocationFilterClick}
                                                >
                                                    Location based filters
                                                </p>
                                            )
                                        }
                                        {isFieldEnabled('categories', config) && (
                                            <p
                                                className={`property_list_popup_list_header_1 ${activeCategory?.id === 'venue' ? 'active' : ''}`}
                                                id="locationFilterLink_1"
                                                onClick={handleLocationVenueClick}
                                            >
                                                Venue type
                                            </p>
                                        )}

                                        <p className={`property_list_popup_list_header_1 ${activeCategorySite === 'site' ? 'active' : ''}`}
                                            id="locationFilterLink_3"
                                            onClick={handleLocationSiteClick}>
                                            Site based filters
                                        </p>
                                        <p className={`property_list_popup_list_header_1 ${activeCategoryBill === 'bill' ? 'active' : ''}`}
                                            id="locationFilterLink_4"
                                            onClick={handleLocationBillClick}>
                                            Billboard based filters</p>

                                        {
                                            shouldShowPriceTab(config) && (
                                                <p className={`property_list_popup_list_header_1 ${activeCategoryPrice === 'price' ? 'active' : ''}`}
                                                    id="locationFilterLink_5"
                                                    onClick={handleLocationPriceClick}>
                                                    Price based filters</p>
                                            )
                                        }
                                    </div>
                                    <p className="property_list_popup_list_header_formcheck"><input type="checkbox" checked /> Show unavailable location</p>
                                    <p className="property_list_popup_list_header_formcheck_1"><input type="checkbox" /> Show location without picture</p>
                                </div>

                                <div className="content-column col-md-3" style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                    {showLocationFilters && (
                                        <div id="locationFilters" style={{ borderRight: '1px solid #ddd' }}>

                                            <div className="property_list_popup_list_cm">


                                                {isFieldEnabled('environment', config) && (
                                                    <><h6 className="property_list_popup_list_header">Environment</h6><div className="form-check">
                                                        <label className="form-check-label" htmlFor="indoorCheck">
                                                            <input
                                                                type="radio"
                                                                id="indoorCheck"
                                                                name="indoor"
                                                                onChange={(e) => handleCheckboxLocation('Indoor', e.target.checked)}
                                                                checked={indoorChecked}
                                                            /> Indoor
                                                        </label>
                                                    </div><div className="form-check">
                                                            <label className="form-check-label" htmlFor="outdoorCheck">
                                                                <input
                                                                    type="radio"
                                                                    id="outdoorCheck"
                                                                    name="indoor"
                                                                    onChange={(e) => handleCheckboxLocation('Outdoor', e.target.checked)}
                                                                    checked={outdoorChecked}
                                                                /> Outdoor
                                                            </label>
                                                        </div></>
                                                )}

                                                {isFieldEnabled('select state', config) && (
                                                    <div className="mt-3">
                                                        <label htmlFor="selectState" className="form-label">Select State</label>
                                                        <select
                                                            className="form-select property_list_select_state country-select border rounded-pill"
                                                            onChange={handleCountryChange}
                                                            id="selectState"
                                                            value={country}
                                                            disabled={!isFieldEnabled('select state', config)}
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
                                                )}

                                                {isFieldEnabled('select state', config) && (
                                                    <div className="mt-3">
                                                        <label htmlFor="selectDistrict" className="form-label">Select District</label>
                                                        <select
                                                            className="form-select property_list_select_state country-select border rounded-pill"
                                                            onChange={(e) => setState(e.target.value)}
                                                            value={state}
                                                            id="selectDistrict"
                                                            disabled={!country || !isFieldEnabled('select state', config)}
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
                                                )}
                                                <p className="property_list_popup_list_header_4"></p>
                                                <p className="property_list_popup_list_header_4"></p>
                                                <p className="property_list_popup_list_header_4"></p>
                                                <p className="property_list_popup_list_header_4"> </p>
                                                <p className="property_list_popup_list_header_4"> </p>
                                                <p className="property_list_popup_list_header_4"></p>

                                            </div>
                                        </div>
                                    )}




                                    {isFieldEnabled('categories', config) && showLocationVenue && (
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



                                    {isFieldEnabled('site type', config) && showLocationSite && (
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
                                                            Classic ({clasicTotalSize})
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

                                                        {/* {/ Screen Size /} */}

                                                        {isFieldEnabled('screen Size (Digital)', config) && (
                                                            <><h6 className="property_list_popup_list_header">Screen Size (Digital)</h6>
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
                                                                </p></>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}




                                    {isFieldEnabled('billboard Format Based', config) && showLocationBill && (
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

                                                <div className="category-list">

                                                    {isFieldEnabled('average price', config) && (


                                                        <div className="form-group">
                                                            <h6 className="property_list_popup_list_header">Average price</h6>
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
                                                    )}

                                                    {isFieldEnabled('minimum price', config) && (
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
                                                    )}

                                                    {isFieldEnabled('maximum price', config) && (

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

                                                    )}
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
                                                                        onChange={() => handleCheckboxChange(subCategory)}
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
                                <button type="button" className="assign_creative_footer_btn_1" onClick={() => resetAllStates()}>
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
        </>
    );
}
export default BillBoardListing;

function showPopup(inventory: any) {
    throw new Error("Function not implemented.");
}
