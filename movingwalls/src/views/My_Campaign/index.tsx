import React, { Component, Key, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import SearchIcon from "../../assets/images/Mycampaign/search.svg"
import CustomIcon from "../../assets/images/filter-dropdown-icon.svg"
import FilterIcon from "../../assets/images/listfilter.svg"
import TableIcon from "../../assets/images/tableicon.svg";
import ViewEye from "../../assets/images/vieweye.svg";
import EditIcon from "../../assets/images/edit-icon.svg";
import NoImage from "../../assets/images/nomedia.jpg";

import './index.css'
import { gql, useMutation, useQuery } from "@apollo/client";
import { MY_CAMPAIGN_LIST_QUERY } from "../../Graphql/Queries";
import { generateMockData } from "../../Graphql/MockData";
import Select, { components } from 'react-select'
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import client, { MAPBOX_TOKEN } from "../../Graphql/apolloClient";
interface Campaign {
  summaryReport: any;
  dealId: any;
  negotiationSummary: any;
  reasonForRejection: string;
  inventoryName: string;
  impressions: string;
  location: string;
  id: string;
  name: string;
  campaignStatus: string;
  ColumnKey: any;
  checkedColumns: any;
  column: string;
  modalElement: null
  tabindex: string
}

interface Campaign {
  id: string;
  name: string;
  startDate: { dateStr: string };
  endDate: { dateStr: string };
  inventoriesSummary: { digitalInventories: number };
  campaignStatus: string;
  priceSummary: {
    currency: { code: string; symbol: string };
    netTotal: number;
  };
  campaignId: string;
  reporting: {
    proofOfPlay: boolean;
    deliveryReports: boolean;
  };

  campaignInventories?: Array<{
    id: Key | null | undefined;
    inventoryResolution: string;
    inventoryType: string;
    description: string;
    inventoryVenueType: string;
    dealId: string;
    nowPayPrice: null;
    inventoryReferenceId: string;
    reasonForRejection: string;
    inventoryLongitude: any;
    inventoryLatitude: any;
    inventoryId: string;
    inventoryThumbnailUrl: string;
    inventoryName: string;
    inventoryAddress: string;
    inventoryReports: { totalPotentialViews: number };
  }>;

}

interface Props {
  selectedCampaign: {
    campaignInventories: Inventory[];
  };
  selectedCampaignId: string;
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
  inventoryLatitude?: number;
  inventoryLongitude?: number;
  nowPayPrice: any;
  reasonForRejection: string;

}


declare global {
  interface Window {
    bootstrap: any;
  }
}




// All Campaign Dropdown

const allCampaignDropdownOptions = [
  { value: '', label: 'All Campaigns' },
  { value: 'GENERATED', label: 'Draft' },
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'NEGOTIATION_REQUESTED,NEGOTIATION_APPROVED,UNDER_NEGOTIATION', label: 'Negotiation' },
  { value: 'RE_OPENED', label: 'Re-opened' },
  { value: 'PAYMENT_PENDING', label: 'Payment pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'LIVE', label: 'Live' },
  { value: 'COMPLETED', label: 'Completed' }
]

type ColumnKey = 'Campaign' | 'Duration' | 'Inventories' | 'Status' | 'Impressions' | 'Actual price' | 'Prefered price' | 'Bookings' | 'Action';
const options: ColumnKey[] = [
  'Campaign',
  'Duration',
  'Inventories',
  'Status',
  'Impressions',
  'Actual price',
  'Prefered price',
  'Bookings',
  'Action',
];
const CustomOption = (props: any) => {
  const { data, isSelected } = props;
  return (
    <components.Option {...props}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{data.label}</span>
        {isSelected && (
          <i className="fa-solid fa-check tick-icon-camp" style={{ marginLeft: 'auto' }}></i>
        )}
      </div>
    </components.Option>
  );
};
const MyCampaigns: React.FC<{ list: { id: string, startDate: string, endDate: string, campaignInventories?: any[] }, currencyCode: any }> = ({ list, currencyCode }) => {
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
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [popupValues, selectedValues] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [totalPages, setTotalPages] = useState(0);
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const selectedCampaignId = localStorage.getItem('selectedCampaignId');
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [search, setSearch] = useState<string>("");
  const [selectedCampignView, setSelectedCampignView] = useState(0);
  const [inventoryIds, setInventoryIds] = useState<string[]>([]);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [loadings, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  localStorage.removeItem('campaignName')
  localStorage.removeItem('startDate')
  localStorage.removeItem('endDate')
  localStorage.removeItem('selectedDistrict')
  localStorage.removeItem('selectedState')
  const { data, loading, error, refetch } = useQuery(MY_CAMPAIGN_LIST_QUERY, {
    variables: {
      accessToken: token,
      userId: userId,
      companyId: companyId,
      sort: "lastModifiedDate,desc",
      name: search,
      campaignStatus: selectedStatus,
      page: currentPage - 1,
      size: 10,
    },
    skip: !token || !userId || !companyId,
  });
  const [config, setConfig] = useState<any[]>([]);
  const [content, setContent] = useState<any[]>([]);
  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}json/contentJson.json`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "My Campaigns");
        setContent(value.fields);
      } catch (error) {
        // console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, []);

  // Fetch configuration data
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "My Campaigns");

        setConfig(value.configurations || []);

      } catch (error) {
        // console.error("Error fetching config:", error);
      }
    };
    fetchConfig();
  }, []);

  const isFieldEnabled = (key: string) => {
    const fieldConfig = config.find((field: any) => field.key === key);
    return fieldConfig ? fieldConfig.default : true;
  };
  const fetchCampaignDetails = async () => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem('userId');
    try {
      setLoading(true);
      const { data } = await client.query({
        query: MY_CAMPAIGN_LIST_QUERY,
        variables: {
          accessToken: token,
          userId: userId,
          companyId: companyId,
          sort: "lastModifiedDate,desc",
          name: search,
          campaignStatus: selectedStatus,
          page: currentPage - 1,
          size: 10,
        },
      })
      setCampaigns(data.mycampaignList.content);
      setTotalPages(data.mycampaignList.totalPages);

    } catch (error) {
      console.error("Error fetching property details:", error);
    } finally {
      setLoading(false); // Set loading to false when request finishes (success or error)
    }
  }

  // Pagination Method Start

  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === 'true') {
      generateMockData(MY_CAMPAIGN_LIST_QUERY)
        .then((mockResponse: any) => {
          const data = mockResponse.data;
          setCampaigns(data.mycampaignList.content);
          setTotalPages(data.mycampaignList.totalPages);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error("Error generating mock data:", err);
        });
    } else {
      fetchCampaignDetails();
    }
  }, []); // Run this effect only when mockData changes

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Refetch data whenever the search value changes

  useEffect(() => {
    refetch();
  }, [searchValue, search, refetch]);


  // Pagination Method End

  // Data Stored To Table Mapped

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.error("Error fetching campaigns:", error);
      return;
    }

    if (data && data.mycampaignList) {
      setCampaigns(data.mycampaignList.content);
      setTotalPages(data.mycampaignList.totalPages);
      selectedValues(data.mycampaignList.campaignInventories)

    }
  }, [data, loading, error]);

  // Search Bar

  // const [filteredInventories, setFilteredInventories] = useState<Inventory[]>([]);

  const [value, setValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value); // Update search value
  };

  const handleShowRotate = () => {
    setValue(''); // Update search value
  };
  // Safely access campaignInventories from the selectedCampaign object
  const campaignInventories = selectedCampaign?.campaignInventories || [];

  // Apply the search filter directly on inventoryName without removing duplicates
  const filteredInventories = campaignInventories.filter((inventory) =>
    inventory.inventoryName.toLowerCase().includes(value.toLowerCase()) // Search filter
  );







  const negotiationStatuses = ["NEGOTIATION_REQUESTED", "NEGOTIATION_APPROVED", "UNDER_NEGOTIATION"];
  // Status Filter
  const itemsPerPage = 10;
  const handleFilterChange: any = (event: any) => {
    const status = event.value;

    // Define statuses for negotiation

    const filteredCampaigns = campaigns.filter((campaign: { campaignStatus: any; }) => {

      if (status === negotiationStatuses) {
        return negotiationStatuses.includes(campaign.campaignStatus);
      }

      return !status || campaign.campaignStatus === status;
    });

    // Set the filtered campaigns
    setCampaigns(filteredCampaigns);
    setSelectedStatus(status);

    // Reset the current page to 1
    setCurrentPage(1);

    // Calculate total pages based on filtered data
    const total = Math.ceil(filteredCampaigns.length / itemsPerPage);
    setTotalPages(total);
  };


  // Customize Dropdown 

  const [checkedColumns, setCheckedColumns] = useState<Record<ColumnKey, boolean>>({
    Campaign: true,
    Duration: true,
    Inventories: true,
    Status: true,
    Impressions: true,
    "Actual price": true,
    "Prefered price": true,
    Bookings: true,
    Action: true,
  });

  const [tempCheckedColumns, setTempCheckedColumns] = useState<Record<ColumnKey, boolean>>(checkedColumns);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Function to toggle individual checkbox
  const toggleCheckbox = (column: ColumnKey) => {
    setTempCheckedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Function to apply filters
  const applyFilters = () => {
    setCheckedColumns(tempCheckedColumns);
    setIsDropdownOpen(false);
  };


  const openDropdown = () => {
    setTempCheckedColumns(checkedColumns);
    setIsDropdownOpen(true);
  };

  // Example roles data similar to your Angular example
  const rolesData = [
    { id: 'Campaign', checked: checkedColumns.Campaign },
    { id: 'Duration', checked: checkedColumns.Duration },
    { id: 'Inventories', checked: checkedColumns.Inventories },
    { id: 'Status', checked: checkedColumns.Status },
    { id: 'Impressions', checked: checkedColumns.Impressions },
    { id: 'Actual price', checked: checkedColumns["Actual price"] },
    { id: 'Prefered price', checked: checkedColumns["Prefered price"] },
    { id: 'Bookings', checked: checkedColumns.Bookings },
    { id: 'Action', checked: checkedColumns.Action },
  ];

  const handleViewClick = (id: string) => {
    localStorage.setItem('selectedCampaignId', id);
  };
  const handleProofClick = (id: string, startDate: string, endDate: string) => {
    localStorage.setItem('selectedCampaignId', id);

    const proofData = {
      startDate: startDate,
      endDate: endDate,

    }
    return proofData;
  };
  //AssignCreativeCount click
  const handleViewAssignClick = (id: string, inventoryIds: string[]) => {
    localStorage.setItem('selectedCampaignId', id);
    setCampaignId(id);
    setInventoryIds(inventoryIds);
  };


  const setInventoryViewData = (list: any) => {
    setSelectedCampaign(list);
    setSelectedInventory(list[0]);
  }

  // const handleInventoryClick = (inventory: any, index: any) => {
  //   setSelectedInventory(inventory);
  //   setSelectedCampignView(index);

  // };

  // Customize Dropdwon End
  //Data Search
  const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSearch(event.currentTarget.value);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRotate = () => {
    setSearch('');
    refetch();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };




  const [mapLat, setMapLat] = useState<number>(0); // Default latitude (New York)
  const [mapLng, setMapLng] = useState<number>(0); // Default longitude (New York)
  const [map, setMap] = useState<mapboxgl.Map | null>(null); // Map instance
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null); // Marker instance
  const [currentPopup, setCurrentPopup] = useState<mapboxgl.Popup | null>(null);

  mapboxgl.accessToken = MAPBOX_TOKEN;

  const mapContainer = useRef<HTMLDivElement>(null); // Ref for map container

  // Initialize the map when the component mounts
  useEffect(() => {
    if (mapContainer.current) {
      const initialMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // Map style
        center: [mapLng, mapLat],
        zoom: 12,
      });

      // Add navigation controls (zoom in/out and compass)
      initialMap.addControl(new mapboxgl.NavigationControl(), "top-right");
      setMap(initialMap);

      // Create a marker at the initial coordinates
      const newMarker = new mapboxgl.Marker({ color: '#014DC0' })
        .setLngLat([mapLng, mapLat])
        .addTo(initialMap);

      setMarker(newMarker);

      // Ensure the map resizes when the window resizes or map container size changes
      initialMap.on('load', () => {
        initialMap.resize(); // Force initial resize after the map has loaded
      });

      // Cleanup on unmount
      return () => {
        initialMap.remove();
      };
    }
  }, [mapLat, mapLng]);

  // Update map and marker position when mapLat or mapLng changes
  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [mapLng, mapLat],
        essential: true,
        speed: 0.5,
        curve: 1,
        zoom: 12,
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

  const handleInventoryClick = (inventory: any, index: any) => {
    setSelectedInventory(inventory);
    setSelectedCampignView(index);
    const latitude = inventory.inventoryLatitude || 21.7679;
    const longitude = inventory.inventoryLongitude || 78.8718;
    handleBillboardClick(latitude, longitude);
    showPopup(inventory);
  };

  const handleBillboardClick = (latitude: any, longitude: any) => {
    const newLat = parseFloat(latitude.toString());
    const newLng = parseFloat(longitude.toString());
    if (isNaN(newLat) || isNaN(newLng)) {
      console.error("Invalid latitude or longitude", latitude, longitude);
      return;
    }
    setMapLat(newLat);
    setMapLng(newLng);
  };

  const createPopupContent = (inventory: any) => {
    const address = inventory?.inventoryAddress || "N/A";
    const impressions = inventory?.inventoryReports?.totalPotentialViews || "N/A";
    const price = inventory?.inventoryReports?.totalReach || "N/A";
    const prices = inventory?.inventoryPrice || "N/A";
    return `
      <div class="map-popup-container">
        <div class="map-popup-image-container">
          <img src="${inventory?.inventoryThumbnailUrl &&
        inventory.inventoryThumbnailUrl !== 'null' ? inventory.inventoryThumbnailUrl : NoImage}" alt="Billboard Image" class="map-popup-image">
        </div>
        <div class="map-popup-body">
          <div class="row">
            <div class="col-md-6">
              <h3 class="map-popup-title">${inventory?.inventoryName || "N/A"}</h3>
              <p class="map-popup-stat-label">Impressions: ${impressions}</p>
              <p class="map-popup-stat-label">${localCurrencyCode || storedCurrencyCodes} ${prices}</p>
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

  const showPopup = (inventory: any) => {
    if (marker && map) {
      if (currentPopup) {
        currentPopup.remove();
      }

      if (!marker.getLngLat() || !map) {
        console.error("Marker or map is not properly initialized.");
        return;
      }

      const popupContent = createPopupContent(inventory);

      try {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(popupContent)
          .setLngLat(marker.getLngLat());

        marker.setPopup(popup);
        popup.addTo(map);

        setCurrentPopup(popup);
      } catch (error) {
        console.error("Error showing popup:", error);
      }
    } else {
      console.error("Marker or map instance is not available.");
    }
  };

  useEffect(() => {
    if (!selectedInventory && filteredInventories.length > 0) {
      handleInventoryClick(filteredInventories[0], 0);
    }
  }, [filteredInventories, selectedInventory]);

  useEffect(() => {
    if (map && selectedInventory) {
      showPopup(selectedInventory);
    }
  }, [mapLat, mapLng, selectedInventory]);



  return (
    <AuthLayout>
      <div className="container my-campaign-page p-0">


        <div className="page-top-filer">
          <div className="row">
            <div className="col-md-3">
              <div className="mycampaign-search">
                {isFieldEnabled("searchInOrders") && (
                  <>
                    <img src={SearchIcon} alt="Search Icon" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search for your campaign name"
                      className="border-bottom-only no-focus-border"
                      onKeyDown={handleSearchChange}
                    />

                    <span>
                      <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="mycampaign-filter">
                <div className="row">
                  <div className="col-md-3">
                    <div className="filter-by">
                      <i className="fa fa-filter" aria-hidden="true"></i>
                      <span> Filter by:</span>
                    </div>
                  </div>
                  <div className="col-md-4 p-0">
                    <div className="border-right">
                      {isFieldEnabled("dropdownstatuslist") && (
                        <Select
                          options={allCampaignDropdownOptions}
                          onChange={handleFilterChange}
                          defaultValue={allCampaignDropdownOptions[0]}
                          components={{ Option: CustomOption }}
                        // menuIsOpen={true}
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-5">
                    <div className="custom-dropdown">
                      {isFieldEnabled("customiseTable") && (
                        <>
                          <i className="fa fa-th-list" aria-hidden="true"></i>
                          <button className="dropdown-button" onClick={() => setIsDropdownOpen((prev) => !prev)}>
                            Customize table <i className="fa fa-angle-down" aria-hidden="true"></i>
                          </button>
                        </>
                      )}
                      {isDropdownOpen && (
                        <div className="dropdown-content">
                          {rolesData.map((role) => (
                            <div className="checkbox-label" key={role.id}>
                              <label className="checkbox-container" style={{ cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={tempCheckedColumns[role.id as ColumnKey]}
                                  onChange={() => toggleCheckbox(role.id as ColumnKey)}
                                  disabled={role.id === 'Campaign'}
                                />
                                {role.id}
                              </label>
                              <div className="three-dot-group-icon" style={{ position: "absolute", marginTop: "-30px", marginLeft: "165px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36" fill="currentColor">
                                  <circle cx="8" cy="6" r="2"></circle>
                                  <circle cx="14" cy="6" r="2"></circle>
                                  <circle cx="8" cy="12" r="2"></circle>
                                  <circle cx="14" cy="12" r="2"></circle>
                                  <circle cx="8" cy="18" r="2"></circle>
                                  <circle cx="14" cy="18" r="2"></circle>
                                </svg>
                              </div>
                            </div>
                          ))}
                          <div className="text-center dropdown-apply-btn">
                            <button className="apply-btn" onClick={applyFilters}>
                              Confirm
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="right">
                <div className="mycampaign-start-btn">
                  <button onClick={() => navigate(`${process.env.REACT_APP_BASE_PATH}/create-campaign`)}>
                    <i className="fa-solid fa-bullhorn"></i> Start New Campaign
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination */}
        <div className="my-campaign-list-container">
          <div className="row">
            <div className="col-md-12">
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                  <span className="loading-circle sp1">
                    <span className="loading-circle sp2">
                      <span className="loading-circle sp3"></span>
                    </span>
                  </span>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="no-data-found-container">
                  <p>No data found</p>
                </div>
              ) : (
                <>
                  <div className="homepage-group-footer-top">
                    <button
                      className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    <span className="homepage-page-info">Page {currentPage} of {totalPages}</span>
                    <button
                      className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                  <div className="table-responsive">
                    <table className="table mycampaign-table table-hover">
                      <thead className="mycampaign-thead bg-light">
                        <tr>
                          {Object.keys(checkedColumns).map(column =>
                            checkedColumns[column as ColumnKey] && <th key={column}>{column}</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="mycampaign-tbody">
                        {campaigns.map((list) => (
                          <tr key={list.id}>
                            {checkedColumns.Campaign && (
                              <td className="mycampaign-tbl-campaign">
                                <p className="mycampaign-td-one">{list.name}</p>
                                <span className="mycampaign-tbl-e">{list?.dealId}</span>
                              </td>
                            )}
                            {checkedColumns.Duration && (
                              <td width={150} className="mycampaign-duration">
                                <p>{new Date(list.startDate.dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                <p>{new Date(list.endDate.dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </td>
                            )}
                            {checkedColumns.Inventories && (
                              <td className="mycampaign-inventories">
                                {(list?.campaignInventories ?? []).length}
                              </td>
                            )}
                            {checkedColumns.Status && (
                              <td className="mycampaign-status">{list.campaignStatus}</td>
                            )}
                            {checkedColumns.Impressions && (
                              <td className="mycampaign-status">{list?.summaryReport?.potentialViews || 'N/A'}</td>
                            )}
                            {checkedColumns["Actual price"] && (
                              <td className="mycampaign-price">
                                {['REQUESTED', 'GENERATED', 'APPROVED', 'LIVE', 'REJECTED', 'COMPLETED', 'PAYMENT_PENDING'].includes(list.campaignStatus) && list ? (
                                  `${localCurrencyCode || storedCurrencyCodes} ${list?.priceSummary?.netTotal != null ? list?.priceSummary.netTotal : 'N/A'}`
                                ) :
                                  [...negotiationStatuses].includes(list.campaignStatus) && list ? (
                                    `${localCurrencyCode || storedCurrencyCodes} ${list?.priceSummary?.netTotal.toFixed(2) != null ? list?.priceSummary?.netTotal.toFixed(2) : 'N/A'}`
                                  )
                                    : (
                                      `${list?.priceSummary?.netTotal != null ? list?.priceSummary.netTotal : 'N/A'}`
                                    )}
                              </td>
                            )}



                            {checkedColumns["Prefered price"] && (
                              <td className="mycampaign-price">
                                {[...negotiationStatuses, 'APPROVED'].includes(list.campaignStatus) && list ? (
                                  `${localCurrencyCode}  ${list?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice != null
                                    ? list.negotiationSummary.buyerPreferredPrice.nowPayPrice
                                    : 'N/A'
                                  }`
                                ) : (
                                  `${list?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice != null
                                    ? list.negotiationSummary.buyerPreferredPrice.nowPayPrice
                                    : 'N/A'
                                  }`
                                )}
                              </td>
                            )}

                            {checkedColumns.Bookings && (
                              <td
                                onClick={() => setInventoryViewData(list)}
                                className="mycampaign-booking"
                                data-bs-toggle="modal"
                                data-bs-target="#propertyView"
                              >
                                <i className="fa fa-eye" aria-hidden="true"></i>
                                Show
                              </td>
                            )}
                            {checkedColumns.Action && (
                              <td className="mycampaign-action">
                                {list.campaignStatus === "REJECTED" && <Link onClick={() => setSelectedCampaign(list)} data-bs-toggle="modal"
                                  data-bs-target="#reason" to="">Reason</Link>}
                                {list.campaignStatus === "UNDER_NEGOTIATION" && <Link to={`${process.env.REACT_APP_BASE_PATH}/negotiate`} onClick={() => handleViewClick(list.id)}><i className="fa-regular fa-message"></i> Negotiation</Link>}
                                {list.campaignStatus === "NEGOTIATION_REQUESTED" && <Link to={`${process.env.REACT_APP_BASE_PATH}/negotiate`} onClick={() => handleViewClick(list.id)}><i className="fa-regular fa-message"></i> Negotiation</Link>}
                                {list.campaignStatus === "NEGOTIATION_APPROVED" && <Link to={`${process.env.REACT_APP_BASE_PATH}/payment-pending`} onClick={() => handleViewClick(list.id)} state={{ campaignId: list.id }}><i className="fa-solid fa-credit-card"></i> Pay</Link>}
                                {list.campaignStatus === "RE_OPENED" && <Link to={`${process.env.REACT_APP_BASE_PATH}/negotiate`} onClick={() => handleViewClick(list.id)}><img className="img-icon" src={EditIcon} />Edit</Link>}
                                {list.campaignStatus === "COMPLETED" && (
                                  <div className="mycampaign-view-dropdown">
                                    <div className="view-trigger" >
                                      <i className="fa-solid fa-ellipsis-vertical text-black"></i> View
                                    </div>
                                    <div className="mycampaign-view-dropdown-content">
                                      {/* <Link to="/assign-creative" onClick={() => handleViewClick(list.id)} state={{ campaignId: list.id }}><i className="fa-solid fa-palette"></i> Creative</Link> */}
                                      {isFieldEnabled("creative") && (
                                        <Link
                                          to={`${process.env.REACT_APP_BASE_PATH}/assign-creative`} onClick={() => {
                                            const inventoryIds = list.campaignInventories?.map(inventory => inventory.inventoryId).filter(id => id !== null) || [];
                                          }}
                                          state={{ campaignId: list.id, inventoryIds: list.campaignInventories?.map(inventory => inventory.inventoryId).filter(id => id !== null) || [] }}><i className="fa-solid fa-palette"></i> Creative
                                        </Link>)}

                                      <Link to={`${process.env.REACT_APP_BASE_PATH}/proof-of-play`} onClick={() => handleProofClick(list.id, list.startDate.dateStr, list.endDate.dateStr)}
                                        state={{
                                          campaignId: list.id,
                                          proofData: {
                                            startDate: list.startDate.dateStr,
                                            endDate: list.endDate.dateStr
                                          },
                                        }} ><i className="fa-regular fa-circle-play"></i> Proof of Play</Link>

                                      <Link to={`${process.env.REACT_APP_BASE_PATH}/delivery-report`} onClick={() => handleViewClick(list.id)} state={{ campaignId: list.id }}><i className="fa-solid fa-clipboard-list"></i> Delivery Report</Link>
                                      {isFieldEnabled("paymentInvoice") && (
                                        <Link to={`${process.env.REACT_APP_BASE_PATH}/invoice`} onClick={() => handleViewClick(list.id)} state={{ campaignId: list.id }}><i className="fa-solid fa-file-invoice-dollar"></i> Payment Invoice</Link>)}

                                    </div>
                                  </div>
                                )}
                                {list.campaignStatus === "PAYMENT_PENDING" && <Link to={`${process.env.REACT_APP_BASE_PATH}/payment-pending`} state={{ campaignId: list.id }} onClick={() => handleViewClick(list.id)}><i className="fa-solid fa-credit-card"></i> Pay</Link>}
                                {list.campaignStatus === "GENERATED" && <Link to={`${process.env.REACT_APP_BASE_PATH}/editcampaign`} onClick={() => handleViewClick(list.id)} state={{ campaignId: list.id }}><img className="img-icon" src={EditIcon} />Edit</Link>}
                                {list.campaignStatus === "LIVE" && (
                                  <div className="mycampaign-view-dropdown">
                                    <div className="view-trigger">
                                      <i className="fa-solid fa-ellipsis-vertical text-black"></i> View
                                    </div>
                                    <div className="mycampaign-view-dropdown-content">

                                      {isFieldEnabled("creative") && (
                                        <Link
                                          to={`${process.env.REACT_APP_BASE_PATH}/assign-creative`}
                                          onClick={() => {
                                            const inventoryIds = list.campaignInventories?.map(inventory => inventory.inventoryId).filter(id => id !== null) || [];
                                            handleViewAssignClick(list.id, inventoryIds);
                                          }}
                                          state={{ campaignId: list.id, inventoryIds: list.campaignInventories?.map(inventory => inventory.inventoryId).filter(id => id !== null) || [] }}
                                        >
                                          <i className="fa-solid fa-palette"></i> Creative
                                        </Link>)}



                                      {list.reporting?.proofOfPlay && (
                                        <Link
                                          to={`${process.env.REACT_APP_BASE_PATH}/proof-of-play`}
                                          onClick={() => handleProofClick(list.id, list.startDate.dateStr, list.endDate.dateStr)}
                                          state={{
                                            campaignId: list.id,
                                            proofData: {
                                              startDate: list.startDate.dateStr,
                                              endDate: list.endDate.dateStr
                                            },
                                          }}
                                        >
                                          <i className="fa-regular fa-circle-play"></i> Proof of Play
                                        </Link>
                                      )}


                                      {list.reporting?.deliveryReports && (
                                        <Link
                                          to={`${process.env.REACT_APP_BASE_PATH}/delivery-report`}
                                          onClick={() => handleViewClick(list.id)}
                                          state={{ campaignId: list.id }}
                                        >
                                          <i className="fa-solid fa-clipboard-list"></i> Delivery Report
                                        </Link>
                                      )}

                                      {isFieldEnabled("paymentInvoice") && (
                                        <Link
                                          to={`${process.env.REACT_APP_BASE_PATH}/invoice`}
                                          onClick={() => handleViewClick(list.id)}
                                          state={{ campaignId: list.id }}
                                        >
                                          <i className="fa-solid fa-file-invoice-dollar"></i> Payment Invoice
                                        </Link>)}
                                    </div>
                                  </div>
                                )}
                                {list.campaignStatus === "APPROVED" && (
                                  <div className="mycampaign-view-dropdown">
                                    <div className="view-trigger" >
                                      <i className="fa-solid fa-ellipsis-vertical text-black"></i> View
                                    </div>
                                    <div className="mycampaign-view-dropdown-content">
                                      {isFieldEnabled("creative") && (
                                        <Link to={`${process.env.REACT_APP_BASE_PATH}/assign-creative`} onClick={() => handleViewClick(list.id)}><i className="fa-solid fa-palette"></i> Creative</Link>)}
                                      {isFieldEnabled("paymentInvoice") && (
                                        <Link to={`${process.env.REACT_APP_BASE_PATH}/invoice`} onClick={() => handleViewClick(list.id)} state={{ campaignId: list.id }}><i className="fa-solid fa-file-invoice-dollar"></i> Payment Invoice</Link>)}                                    </div>
                                  </div>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Modal for Campaign Details */}

                  <div className="modal fade propertyViewModal" id="propertyView" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedCampignView(0)}></button>
                        </div>
                        <div className="modal-body">
                          {selectedCampaign && (
                            <div className="row">
                              <div className="col-md-5">
                                <div className="modal-campaing-view-left">
                                  <div className="mycampaign-search ">
                                    <img src={SearchIcon} alt="" />
                                    <input
                                      type="text"
                                      className="border-bottom-only no-focus-border"
                                      placeholder="Search for your campaigns"
                                      value={value}
                                      onChange={handleInputChange}
                                    />
                                    <span>
                                      <i onClick={handleShowRotate} className="fa-solid fa-rotate"></i>
                                    </span>
                                  </div>
                                  <div className="campaign-view-list-container">
                                    {filteredInventories.length > 0 ? (
                                      filteredInventories.map((inventory, index) => (
                                        <div
                                          key={inventory.id}
                                          className={`campaing-view-list ${index === selectedCampignView ? 'active' : ''}`}
                                          onClick={() => handleInventoryClick(inventory, index)}
                                        >
                                          <div className="row">
                                            <div className="col-md-5">
                                              <img
                                                src={inventory.inventoryThumbnailUrl && inventory.inventoryThumbnailUrl !== "null" ? inventory.inventoryThumbnailUrl : NoImage}
                                                alt={inventory.inventoryName}
                                                className="img-fluid"
                                              />
                                            </div>
                                            <div className="col-md-7">
                                              <div className="row">
                                                <div className="col-md-12 mb-3 header">
                                                  <h5>{inventory.inventoryName}</h5>
                                                  <p>{inventory.inventoryReferenceId}</p>
                                                </div>
                                                <div className="col-md-6 content">
                                                  <p className="label">Site Location</p>
                                                  <p className="value">{inventory.inventoryAddress || 'N/A'}</p>
                                                </div>
                                                <div className="col-md-6">
                                                  <p className="label">Impressions</p>
                                                  <p className="value">
                                                    {inventory.inventoryReports?.totalPotentialViews || 'N/A'}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p>No inventories found matching your search criteria.</p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-7">
                                <ul className="nav nav-tabs mycampaign-show-nav-tabs" id="myTab" role="tablist">
                                  <li className="nav-item">
                                    <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Map</button>
                                  </li>
                                  <li className="nav-item">
                                    <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Gallery</button>
                                  </li>
                                </ul>

                                <div className="tab-content">
                                  <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab">
                                    {filteredInventories.length > 0 && selectedInventory ? (
                                      <div>
                                        {selectedInventory.inventoryLatitude && selectedInventory.inventoryLongitude ? (
                                          <div
                                            className="map-container"
                                            ref={mapContainer}
                                            style={{ width: '100%', height: '500px', marginTop: "1rem" }}
                                          />
                                        ) : (
                                          <p>Location coordinates not available.</p>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-center">No inventory selected or no inventories available for the map.</p>
                                    )}
                                    <div className="row map-under-content">
                                      <div className="col-md-3">
                                        <p className="popup-address-values">Site Location</p>
                                        <p>{selectedInventory?.inventoryAddress || 'N/A'}</p>

                                      </div>
                                      <div className="col-md-2">
                                        <p className="popup-address-values">Resolution</p>
                                        <p>{selectedInventory?.inventoryResolution || 'N/A'}</p>

                                      </div>
                                      <div className="col-md-3">
                                        <p className="popup-address-values">Venue Type</p>
                                        <p>{selectedInventory?.inventoryVenueType}</p>

                                      </div>
                                      <div className="col-md-4">
                                        <p className="popup-address-values">Deal Id</p>
                                        <p>{selectedCampaign?.dealId}</p>

                                      </div>
                                    </div>
                                  </div>

                                  <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab">
                                    {filteredInventories.length > 0 && selectedInventory && campaigns && campaigns.length > 0 && (
                                      <div className="inventory-item">
                                        <div className="row inventory-bg-color gallery-side">
                                          <div className="col-md-12">
                                            <img className="full-width-image" src={selectedInventory.inventoryThumbnailUrl &&
                                              selectedInventory.inventoryThumbnailUrl !== 'null' ?
                                              selectedInventory.inventoryThumbnailUrl : NoImage} alt={selectedInventory.inventoryName} />
                                          </div>
                                          <div className="row map-under-content">
                                            <div className="col-md-3">
                                              <p className="popup-address-values">Site Location</p>
                                              <p>{selectedInventory?.inventoryAddress || 'N/A'}</p>

                                            </div>
                                            <div className="col-md-2">
                                              <p className="popup-address-values">Resolution</p>
                                              <p>{selectedInventory?.inventoryResolution || 'N/A'}</p>

                                            </div>
                                            <div className="col-md-3">
                                              <p className="popup-address-values">Venue Type</p>
                                              <p>{selectedInventory?.inventoryVenueType}</p>

                                            </div>
                                            <div className="col-md-4">
                                              <p className="popup-address-values">Deal Id</p>
                                              <p>{selectedCampaign?.dealId}</p>

                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn mycampaign-show-btn" data-bs-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </>
              )}
            </div>
          </div>

        </div>
        {/* Reason Model */}

        <div className="modal fade" id="reason" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="mycampaign-show-modal-content mycampaign-show-cnt row">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">Reasons for Rejection</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {selectedCampaign ? (
                  <div className="reason-rejection">
                    <h5 className="reason-rejection-name">Campaign Name: {selectedCampaign.name}</h5>
                    <h5>Reason for Rejection: {selectedCampaign.reasonForRejection || 'No reason provided'}</h5>
                  </div>
                ) : (
                  <p>No campaign selected.</p>
                )}
              </div>
              <div className="modal-footer mycampaign-show-cnt-footer">
                <button type="button" className="btn mycampaign-show-cnt-closebtn mycampaign-show-btn" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </AuthLayout>
  );
}

export default MyCampaigns;
