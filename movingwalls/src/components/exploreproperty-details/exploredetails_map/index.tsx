import React, { Component, useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import client, { MAPBOX_TOKEN } from "../../../Graphql/apolloClient";
import { EXPLORE_PROPERTY_DETAILS } from "../../../Graphql/Queries";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";
import { format } from 'date-fns';
import NoImage from "../../../assets/images/nomedia.jpg";

interface PropertyDetails {
  mediaOwnerName: string;
  facingDirection: string;
  stateName: string;
  type: string;
  venueType: string;
  thumbnailPath: string;
  totalVisitors: string;
  displayName: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  specification: {
    resolution1Width: number;
    resolution1Height: number;
  }
  sellingRate: {
    daily: number;
    monthly: {
      month1: string;
    }
  };
  monthlySummary: {
    totalVisitors: number;
  };
  price: {
    screenOnTime: string;
  }
}

interface PropertyDetail_props {
  site_owner: Boolean
  access: Boolean
  facing: Boolean
  board_face: Boolean
  site_address: Boolean
  category: Boolean
  active: Boolean
  billBoard_type: Boolean
  available: Boolean
  currencyCode: any
}

const ExplorePropertyDetailsMap: React.FC<PropertyDetail_props> = ({
  site_owner,
  access,
  facing,
  board_face,
  site_address,
  category,
  active,
  billBoard_type,
  available,
  currencyCode
}) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapLat, setMapLat] = useState<number>(0);
  const [mapLng, setMapLng] = useState<number>(0);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem("countryId");
  const userId = localStorage.getItem("userId");
  const location = useLocation();
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const currentpage = propertyDetailsValue?.currentPage || 0;
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
  const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);

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
  }, [mapLat, mapLng]);

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

      if (propertyDetailsValue?.id) {
        showPopup(propertyDetailsStoreValue);
      }
    }
  }, [mapLat, mapLng, map, marker, propertyDetailsStoreValue]);

  const createPopupContent = (propertyDetailsStoreValue: any) => {

    return `
      <div class="map-popup-container">
        <div class="map-popup-image-container">
          <img src="${propertyDetailsStoreValue?.thumbnailPath && propertyDetailsStoreValue?.thumbnailPath !== "null" && propertyDetailsStoreValue?.thumbnailPath.trim() !== "" ? propertyDetailsStoreValue?.thumbnailPath : NoImage}" alt="Billboard Image" class="map-popup-image">
        </div>
        <div class="map-popup-body">
          <div class="row">
            <!-- Left column (Title & Location) -->
            <div class="col-md-6">
              <h3 class="map-popup-title">${propertyDetailsStoreValue?.displayName || 'N/A'}</h3>
              <p class="map-popup-stat-label">Impressions: ${propertyDetailsStoreValue?.monthlySummary?.totalVisitors}</p>
              </div>
            <!-- Right column (Location & Price) -->
            <div class="col-md-6">
              <p class="map-popup-location">${propertyDetailsStoreValue?.formattedAddress || "N/A"}</p>
            <p class="map-popup-price">Unique Reach : ${currencyCode} ${propertyDetailsStoreValue?.sellingRate?.monthly?.month1 ? `${propertyDetailsStoreValue?.sellingRate?.monthly?.month1}.00` : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const showPopup = (propertyDetailsStoreValue: any) => {
    if (marker && map) {
      const popupContent = createPopupContent(propertyDetailsStoreValue);
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);
      marker.setPopup(popup);
      popup.addTo(map);
    }
  };

  useEffect(() => {
    if (propertyDetailsValue?.id) {
      showPopup(propertyDetailsStoreValue);
    }
  }, [propertyDetailsValue?.id]);

  console.log(propertyDetailsValue?.type, "type");

  const fetchPropertyDetailsMap = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: EXPLORE_PROPERTY_DETAILS,
        variables: {
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          billboardType: propertyDetailsValue?.type.toLowerCase(),

        },
      });

      const propertyDetails = data?.propertyDetailsWithoutLogin;
      const billboardObjectId = propertyDetails?.billboardObjectId;
      if (billboardObjectId) {
        await fetchBillBoardList(billboardObjectId);
      }
    } catch (error) {
      console.error("Error fetching property details:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchBillBoardList = async (billboardObjectId: string, cartItems: any = "") => {
    setLoading(true);
    try {
      setBillBoardData([]);

      const filterData = {
        type: propertyDetailsValue?.type,
        availableBooking: true,
        categories: propertyDetailsValue?.categories,
        format: propertyDetailsValue?.siteTypeData,
        venueType: propertyDetailsValue?.venueTypeData,
      };
      const lowercaseType = propertyDetailsValue?.type?.toLowerCase();

      const { data } = await client.query({
        query: GET_LANDING_EXPLORATION,
        variables: {
          sort: "last_modified_date,desc",
          billboard: lowercaseType,
          userId: userId,
          companyId: companyId,
          page: currentpage,
          size: 12,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          dspName: "LMX-ECOMMERCE",
          countryId: countryId,
          searchTerm: "",
          filterData: filterData,
        },
      });

      if (data) {
        let resultObj = data.landingpageExplorePropertiesNotoken;
        if (resultObj.length > 0 && cartItems.length > 0) {
          resultObj = resultObj.map((obj: any) => {
            const isInCart = cartItems.some((cartItem: any) => cartItem.cartItemId === obj.id);
            return { ...obj, isInCart };
          });
        }
        setBillBoardData(resultObj);
        const matchedBillboard = resultObj.find((billboard: any) => billboard.id === billboardObjectId);
        if (matchedBillboard) {
          setPropertyDetailsStoreValue(matchedBillboard);
          setMapLat(matchedBillboard.latitude);
          setMapLng(matchedBillboard.longitude)
        }
      }
    } catch (error) {
      console.error("Error fetching billboard list:", error);
    } finally {
      setLoading(false);
    }
  };

  const [billBoardData, setBillBoardData] = useState<any>([]);
  useEffect(() => {
    fetchPropertyDetailsMap();
  }, [])

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>

      <div className="row" >
        <div className="col-md-8">
          <div className="map-section">
            <div
              ref={mapContainer}
              style={{ position: "absolute", top: '23rem', bottom: '5rem', width: "60%", height: '30%' }}
            />
          </div>
        </div>
        <div className="col-md-4">
          <div className="location-details">
            <div className="row property-row-2">
              {site_owner && (
                <div className="column property-column-2">
                  <p className="property-content-1">Site owner</p>
                  <p className="property-content-2">{propertyDetailsStoreValue?.mediaOwnerName}</p>
                </div>
              )}
              {facing && (
                <div className="column property-column-2">
                  <p className="property-content-1">Facing</p>
                  <p className="property-content-2">{propertyDetailsStoreValue?.facingDirection}</p>
                </div>
              )}
            </div>
            <div className="row property-row-2">
              {category && (
                <div className="column property-column-2">
                  <p className="property-content-1">Media</p>
                  <p className="property-content-2">{propertyDetailsStoreValue?.type}</p>
                </div>
              )}
              {site_address && (
                <div className="column property-column-2">
                  <p className="property-content-1">Site address</p>
                  <p className="property-content-2">{propertyDetailsStoreValue?.formattedAddress || "N/A"}</p>
                </div>
              )}
            </div>

            <div className="row property-row-2">
              <div className="column property-column-2">
                <p className="property-content-1">Location type</p>
                <p className="property-content-2">{propertyDetailsStoreValue?.venueType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default ExplorePropertyDetailsMap;
