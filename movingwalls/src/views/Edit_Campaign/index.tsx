import React, { Component, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import BackIcon from "../../assets/images/back-icon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import noImage from "../../assets/images/nomedia.jpg";
import Image2 from "../../assets/images/group-212840670.svg";
import Image4 from "../../assets/images/calender.svg";
import Image5 from "../../assets/images/uiledit.svg";
import './index.css';
import { gql, useMutation, useQuery } from "@apollo/client";
import { EDIT_CAMPAIGN, DELETE_CONTENT_MUTATION, CART_INITIAL_QUERY, DELETE_CART_PAGE } from "../../Graphql/Queries";
import { toast } from "react-toastify";
import client, { MAPBOX_TOKEN } from "../../Graphql/apolloClient";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { addDays } from 'date-fns';

interface Agency {
  id: string;
  name: string;
}

interface MovingObject {
  id: number;
  name: string;
  coordinates: number[];
}


interface Report {
  userId: string;
  cartItemId: string;
  campaignName: string;
  billboardPotentialViews: string;
  billboardType: string;
  agencyName: Agency;
  billboardName: string;
  billboardId: string;
  billboardThumbnailUrl: string;
  billboardtotalPrice: number;
  billboardPeriodSubTotalPrice: number;
  billboardCurrencyCode: string;
  billboardLatitude: string;
  billboardVenueType: string;
  billboardLongitude: string;
  billboardResolutionWidth: string;
  billboardResolutionHeight: string;
  inventoriesSummary: {
    classicInventories: string;
    digitalInventories: string;
  }
}
const EditCampaigns: React.FC<{ currencyCode: any }> = ({ currencyCode }) => {
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
  const [redirect, setRedirect] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(currentDate);
  const [endDate, setEndDate] = useState<Date>(currentDate);
  const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [tempStartDate, setTempStartDate] = useState<Date>(currentDate);
  const [tempEndDate, setTempEndDate] = useState<Date>(currentDate);
  const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
  const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [campaignName, setCampaignName] = useState<string>("");
  const [editCampaignList, setEditCampaignList] = useState<Report[]>([]);
  const [digitalBillboardLength, setDigitalBillboardLength] = useState(0);
  const [classicBillboardLength, setClassicBillboardLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLat, setMapLat] = useState<number>(0);
  const [mapLng, setMapLng] = useState<number>(0);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [deleteContent] = useMutation(DELETE_CART_PAGE);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const isValidDate = startDate instanceof Date && !isNaN(startDate.getTime());
  const [selectedBillboardId, setSelectedBillboardId] = useState(null);
  const location = useLocation();
  const ediData = location.state || {};
  const cartformData = ediData?.editData || {};

  // Destructure the values you need
  const { campaignId, condition, edit } = cartformData;

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
    setShowEndDatePicker(!showStartDatePicker);
    setTempEndDate(endDate);
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const toggleMonthPicker = () => {
    setShowMonthPicker(!showMonthPicker);
    setShowYearPicker(false);
  };

  const toggleYearPicker = () => {
    setShowYearPicker(!showMonthPicker);
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
    setShowStartDatePicker(false);
    localStorage.setItem('startDate', updatedStartDate.toISOString());
  };

  const handleUpdateEndDate = () => {
    const updatedEndDate = (tempEndDate ?? new Date());
    updatedEndDate.setFullYear(currentYear);
    setEndDate(updatedEndDate);
    setShowEndDatePicker(false);
    localStorage.setItem('endDate', updatedEndDate.toISOString());
  };
  const handleMonthButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const fetchEditCampaign = async () => {
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
        query: EDIT_CAMPAIGN,
        variables: {
          accessToken: token,
          campaignId: selectedCampaignId,
          edit: edit ? false : true,
          userId: userId
        },
        fetchPolicy: "no-cache",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        toast.error("Failed to fetch reports: " + response.errors.map(err => err.message).join(", "));
        return;
      }

      const campaignData = response.data.editPageItem[0];

      setEditCampaignList(response.data.editPageItem[0].campaignInventories);
      setLoading(false);
      if (campaignData) {
        // setCampaignName(campaignData?.campaignName);
        if (campaignData && !localStorage.getItem('campaignName')) {
          setCampaignName(campaignData?.campaignName);
          localStorage.setItem('campaignName', campaignData?.campaignName);
        }
        // setDigitalBillboardLength(campaignData?.inventoriesSummary.digitalInventories);
        // setClassicBillboardLength(campaignData?.inventoriesSummary.classicInventories);

        if (campaignData?.startDate && !localStorage.getItem('startDate')) {
          const parsedStartDate = new Date(campaignData.startDate);
          if (!isNaN(parsedStartDate.getTime())) {
            setStartDate(parsedStartDate);
            localStorage.setItem('startDate', campaignData.startDate);
          }
        }

        if (campaignData?.endDate && !localStorage.getItem('endDate')) {
          const parsedEndDate = new Date(campaignData.endDate);
          if (!isNaN(parsedEndDate.getTime())) {
            setEndDate(parsedEndDate);
            localStorage.setItem('endDate', campaignData.endDate);
          }
        }

      }

    } catch (err) {
      toast.error("An unexpected error occurred while fetching reports");
    } finally {
    }
  };
  useEffect(() => {
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');

    if (storedStartDate) {
      setStartDate(new Date(storedStartDate));
    }

    if (storedEndDate) {
      setEndDate(new Date(storedEndDate));
    }
  }, []);

  useEffect(() => {
    const storedCampaignName = localStorage.getItem('campaignName');
    if (storedCampaignName) {
      setCampaignName(storedCampaignName);
    }
  }, []);
  const [deleteBillboardId, setDeleteBillboardId] = useState("");
  const handleDeleteItem = (id: string) => {
    setDeleteItemId(id);
    setDeleteBillboardId(id);
    const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  };

  const confirmDelete = () => {
    const updatedCampaignList = editCampaignList.filter(
      (inventory) => inventory.cartItemId !== deleteItemId
    );
    setEditCampaignList(updatedCampaignList);
    toast.success("Billboard deleted successfully");
    const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
    modal.hide();
    setDeleteItemId(null);
  };

  //BillboardDelete

  const confirmDeleteCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !deleteBillboardId) return;
    setLoading(true);
    try {
      const response = await deleteContent({
        variables: {
          accessToken: token,
          deleteItemId: deleteBillboardId,
          itemType: "draft-data"
        }
      });
    } catch (error) {
      toast.error("Failed to delete content");
      console.error(error);
    } finally {
      setDeleteItemId(null);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEditCampaign();
  }, []);
  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;

    if (mapContainer.current) {
      const initialMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [mapLng, mapLat],
        zoom: 12,
      });
      initialMap.addControl(new mapboxgl.NavigationControl(), "top-right");
      setMap(initialMap);

      const newMarker = new mapboxgl.Marker({ color: '#014DC0' })
        .setLngLat([mapLng, mapLat])
        .addTo(initialMap);
      setMarker(newMarker);
      return () => {
        initialMap.remove();
      };
    }
  }, [mapLat, mapLng, selectedBillboardId]);

  useEffect(() => {
    if (map) {
      map.flyTo({
        center: [mapLng, mapLat],
        essential: true,
        speed: 0.1,
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
    }
  }, [mapLat, mapLng, map, marker]);

  const handleBillboardClick = (latitude: string, longitude: string) => {
    const newLat = parseFloat(latitude);
    const newLng = parseFloat(longitude);

    setMapLat(newLat || mapLat);
    setMapLng(newLng || mapLng);

  };
  const handleSelectBillboard = (billboardId: any, latitude: string, longitude: string) => {
    setSelectedBillboardId(billboardId);
    handleBillboardClick(latitude, longitude);
  };
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const [cartItemCount, setCartItemCount] = useState(0);

  const { data: myCart } = useQuery(CART_INITIAL_QUERY, {
    variables: {
      accessToken: token,
      userId: userId,
    },
  });

  useEffect(() => {
    if (myCart && myCart.cartpageItem) {
      localStorage.setItem("myCart", JSON.stringify(myCart.cartpageItem));
      const cartItems = myCart.cartpageItem || [];
      setCartItemCount(cartItems.length);
    }
  }, [myCart]);
  const selectedCampaignId = localStorage.getItem("selectedCampaignId");
  const [itsEdits, setEdits] = useState('')


  useEffect(() => {
    setEdits('edits')
  }, [])

  const Navigate = useNavigate();
  const navigateToCart = async () => {
    await confirmDeleteCart();

    const cartformData = {
      campaignName,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      selectedCampaignId,
      edit: true,
      itemType: true,
      campaignType: true,
      currencyCode,
      updateCampaignList: editCampaignList,
    };

    Navigate(`${process.env.REACT_APP_BASE_PATH}/mycart`, { state: { cartformData, showRequestOnly: true } });
  };


  const navigateToPropertlist = async () => {
    await confirmDeleteCart();
    const cartformData = {
      campaignName,
      edit: true,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      selectedCampaignId,
      itsEdits,
    };

    localStorage.setItem('campaignName', campaignName);
    Navigate(`${process.env.REACT_APP_BASE_PATH}/propertylist`, { state: { cartformData, showSaveAndRequest: true } });
  };
  const handleEditClick = () => {
    const inputElement = document.querySelector('.form-control') as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
    } else {
      console.error('Input element not found.');
    }
  };
  useEffect(() => {
    const digitaluniqueBillboards = editCampaignList.filter(
      (inventory, index, self) =>
        index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
        (inventory.billboardType === "digital" || inventory.billboardType === "DIGITAL_BILLBOARD")
    );
    const classicuniqueBillboards = editCampaignList.filter(
      (inventory, index, self) =>
        index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
        (inventory.billboardType === "classic" || inventory.billboardType === "CLASSIC_BILLBOARD")
    );
    setDigitalBillboardLength(digitaluniqueBillboards.length);
    setClassicBillboardLength(classicuniqueBillboards.length);
  }, [editCampaignList]);
  return (
    <AuthLayout>
      <>
        <div className="property fullcontent-skyblue">
          <div className="container">
            <div className="mt-2">
              <div className="navbar-back-btn">
                <img alt="" src={BackIcon} />
                <Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}> Back</Link>
              </div>
            </div>
            <div className="editcampaign-full-content">
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                  <span className="loading-circle sp1">
                    <span className="loading-circle sp2">
                      <span className="loading-circle sp3"></span>
                    </span>
                  </span>
                </div>
              ) : (
                <div className="container editcampaign-grand-parent">
                  <form className="card p-4 border-0">
                    <div className="editcampaign-head">
                      <h5>Edit Campaign</h5>
                    </div>
                    {editCampaignList.length === 0 ? (
                      <div className="no-data-found-containers cart-no-data">
                        <p className="looks-like">No Data Found</p>
                      </div>
                    ) : (
                      <><div className="editcampaign-parent row">
                        <div className="col-md-4">
                          <div className="mb-3 card_camp_first">
                            <label htmlFor="campaign-name" className="form-label editcampaign-search">Campaign Name</label>
                            <div className="input-group card_input_group_1">
                              <input
                                type="text"
                                className="form-control border-bottom-only card_border_bottom_only"
                                placeholder="New campaign"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                aria-label="Search" />
                              <span onClick={handleEditClick} className="input-group-text search-icon card_search_icon">
                                <img style={{ cursor: 'pointer' }} src={Image5} alt="" />
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="editcampaign-duration col-md-4">
                          <h4>Duration</h4>
                          <div className="editcampaign-date_section">
                            <div className="edit_campaign_date_start d-flex align-items-center position-relative">
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

                            <div className="edit_campaign_date_end d-flex align-items-center position-relative">
                              <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                <img alt="End Date" src={Image4} className="date-icon" />
                              </div>
                              <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker}>
                                <p>{format(endDate, "dd MMM yyyy")}</p>
                              </div>
                              {showEndDatePicker && (
                                <div className="datepicker-wrapper">
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
                        <div className="editcampaign-buttons col-md-4">
                          <button className="editcampaign-billboard" onClick={navigateToPropertlist}>Add billboards</button>
                          <button className="editcampaign-cart" onClick={navigateToCart}><img className="detaillocation-frame-inner property-logo-img" alt="" height="15px" width="17px"
                            src={Image2} /> Cart ({cartItemCount})</button>
                        </div>
                      </div><div className="row">
                          <div className="col-12">
                            <hr className="my-4" />
                          </div>
                        </div><div className="row">
                          <p className="editcampaign-cnt-note"><svg style={{ marginTop: "-4px", marginRight: "5px" }}
                            width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.62902 1.76959L0.854978 14.3348C0.715313 14.6036 0.641413 14.9083 0.640631 15.2186C0.639849 15.5289 0.712212 15.8341 0.850521 16.1037C0.988829 16.3733 1.18826 16.598 1.42898 16.7553C1.66969 16.9127 1.9433 16.9973 2.22258 17.0007H15.7707C16.0499 16.9973 16.3235 16.9127 16.5643 16.7553C16.805 16.598 17.0044 16.3733 17.1427 16.1037C17.281 15.8341 17.3534 15.5289 17.3526 15.2186C17.3518 14.9083 17.2779 14.6036 17.1383 14.3348L10.3642 1.76959C10.2216 1.50842 10.0209 1.2925 9.78135 1.14264C9.5418 0.992788 9.27153 0.914062 8.99662 0.914062C8.72171 0.914063 8.45144 0.992788 8.21189 1.14264C7.97234 1.2925 7.77159 1.50842 7.62902 1.76959Z" stroke="#FF0000" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8.99609 6.33594V9.89046" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8.99609 13.4453H9.00518" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg> Note :<span className="editcampaign-cnt-note-1"> Spot is not available for the below Highlighted Billboards. Please remove it.</span></p>
                          <div className="editcampaign-content-lft col-md-8">
                            <div className="container my-4 ">
                              <div className="row scrollbar">
                                <h4 className="card_second_header_1">Digital Billboards <span className="edit_campaign_header_notification badge">{digitalBillboardLength}</span></h4>

                                <div className="row editCampaign-list-header">
                                  <div className="col-md-3 card_list_header">Billboard Name</div>
                                  <div className="col-md-2 card_list_header"></div>
                                  <div className="col-md-2 card_list_header card_list_headers">Impressions</div>
                                  <div className="col-md-3 card_list_header card_llist_header">Size/Resolution</div>
                                  <div className="col-md-2 card_list_header card_list_headerss">Price</div>
                                  <div className="col-md-1 card_list_header"></div>
                                </div>

                                {editCampaignList.length > 0 ? (
                                  editCampaignList
                                    .filter((inventory, index, self) => index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
                                      (inventory.billboardType === "digital" || inventory.billboardType === "DIGITAL_BILLBOARD")
                                    )
                                    // .filter(inventory => inventory.billboardType === "digital" || inventory.billboardType === "DIGITAL_BILLBOARD")
                                    .map((inventory) => (
                                      <div
                                        key={inventory.billboardId}
                                        className={`row align-items-center billboard-row card_list_datas editlistcart ${selectedBillboardId === inventory.billboardId ? 'highlighted' : ''}`}
                                        onClick={() => handleSelectBillboard(inventory.billboardId, inventory.billboardLatitude, inventory.billboardLongitude)}
                                      >
                                        <div className="col-md-2">
                                          <img
                                            src={
                                              inventory.billboardThumbnailUrl &&
                                                inventory.billboardThumbnailUrl !== "null" &&
                                                inventory.billboardThumbnailUrl.trim() !== ""
                                                ? inventory.billboardThumbnailUrl
                                                : noImage
                                            }
                                            alt="Sunnybank Outbound"
                                            className="billboard-img card_list_img"
                                          />
                                        </div>

                                        <div className="col-md-3">
                                          <p className="card_list_sunny">{inventory.billboardName}</p>
                                          <div className="card_text_avail">Available</div>
                                        </div>

                                        <div className="col-md-2 card_value_imp editcaetImpression">
                                          {inventory.billboardPotentialViews}
                                        </div>

                                        <div className="col-md-2 card_value_imp editcartresolution">
                                          {inventory.billboardResolutionWidth} x {inventory.billboardResolutionHeight}
                                        </div>

                                        <div className="col-md-2 card_value_imp card_value_impp editcartprice">
                                          {localCurrencyCode || storedCurrencyCodes} {inventory.billboardPeriodSubTotalPrice}
                                        </div>

                                        <div className="col-md-1 card_value_imp d-flex">
                                          <div className="delete-container card_delete_container" onClick={() => handleDeleteItem(inventory.cartItemId)}>
                                            <i className="fas fa-trash-alt delete-icon card_delete_icon"></i>
                                            <span className="billboard-delete card_billboard_delete ">Delete</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <div>
                                    <div className="text-center nodata-found-txt">No data found</div>
                                  </div>
                                )}

                                <h4 className="mt-4 card_second_header_1">Classic Billboards <span className="edit_campaign_header_notification badge">{classicBillboardLength}</span></h4>

                                <div className="row list-header">
                                  <div className="col-md-3 card_list_header">Billboard Name</div>
                                  <div className="col-md-2 card_list_header"></div>
                                  <div className="col-md-2 card_list_header card_list_headers">Impressions</div>
                                  <div className="col-md-3 card_list_header card_llist_header">Size/Resolution</div>
                                  <div className="col-md-2 card_list_header card_list_headerss">Price</div>
                                  <div className="col-md-1 card_list_header"></div>
                                </div>

                                {editCampaignList.length > 0 ? (
                                  editCampaignList
                                    .filter((inventory, index, self) => index === self.findIndex((item) => item.billboardId === inventory.billboardId) &&
                                      (inventory.billboardType === "classic" || inventory.billboardType === "CLASSIC_BILLBOARD")
                                    )
                                    // .filter(inventory => inventory.billboardType === "classic" || inventory.billboardType === "CLASSIC_BILLBOARD" || inventory.billboardType === "STATIC_BILLBOARD")
                                    .map((inventory) => (
                                      <div
                                        key={inventory.billboardId}
                                        className={`row align-items-center billboard-row card_list_datas editlistcart ${selectedBillboardId === inventory.billboardId ? 'highlighted' : ''}`}
                                        onClick={() => handleSelectBillboard(inventory.billboardId, inventory.billboardLatitude, inventory.billboardLongitude)}
                                      >
                                        <div className="col-md-2">
                                          <img
                                            src={
                                              inventory.billboardThumbnailUrl &&
                                                inventory.billboardThumbnailUrl !== "null" &&
                                                inventory.billboardThumbnailUrl.trim() !== ""
                                                ? inventory.billboardThumbnailUrl
                                                : noImage
                                            }
                                            alt="Sunnybank Outbound"
                                            className="billboard-img card_list_img"
                                          />
                                        </div>
                                        <div className="col-md-3">
                                          <p className="card_list_sunny"> {inventory.billboardName}</p>
                                          <strong></strong>
                                          <div className="card_text_avail">Available</div>
                                        </div>
                                        <div className="col-md-2 card_value_imp  editcaetImpression">
                                          {inventory.billboardPotentialViews}
                                        </div>
                                        <div className="col-md-2 card_value_imp editcartresolution">
                                          {inventory.billboardResolutionWidth} x {inventory.billboardResolutionHeight}
                                        </div>
                                        <div className="col-md-2 card_value_imp editcartprice">
                                          {localCurrencyCode || storedCurrencyCodes} {inventory.billboardPeriodSubTotalPrice}
                                        </div>
                                        <div className="col-md-1 card_value_imp d-flex">
                                          <div className="delete-container card_delete_container" onClick={() => handleDeleteItem(inventory.cartItemId)}>
                                            <i className="fas fa-trash-alt delete-icon card_delete_icon"></i>
                                            <span className="billboard-delete card_billboard_delete">Delete</span>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <div>
                                    <div className="text-center nodata-found-txt">No data found</div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="modal-footer border-0">
                              <button type="button" className="btn edit_campaign_footer_btn_1" onClick={navigateToCart}>Campaign estimation</button>
                              <button type="button" className="btn btn-primary edit_campaign_footer_btn_2" onClick={navigateToCart}>Update campaign</button>
                            </div>
                          </div>
                          <div className="editcampaign-content-rit col-md-4">
                            <div>
                              <div
                                ref={mapContainer}
                                style={{ position: "absolute", top: '15rem', bottom: 0, width: "30%", height: '60%' }} />
                            </div>
                          </div>
                        </div></>
                    )}
                  </form>

                </div>
              )}

            </div>
          </div>
        </div >
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
      </>
    </AuthLayout>
  );
}

export default EditCampaigns;
