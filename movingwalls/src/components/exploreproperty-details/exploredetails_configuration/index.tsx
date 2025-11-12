import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { EXPLORE_PROPERTY_DETAILS } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { format } from 'date-fns';
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";

interface PropertyDetails {
  referenceId: string;
  name: string;
  format: string;
  mediaOwnerName: string;
  loopDuration: number;
  displayOnTime: string;
  displayOffTime: string;
  sellingRate: {
    daily: number;
    weekly: number;
    spots: number;
  };
  specification: {
    availableHours: string;
    panels: string[];
    billboardSize: string;
  };
  price: {
    spotDuration: number;
    modeOfOperation: string;
    loopDuration: string;
    screenOnTime: string;
    programmaticEnabled: string;
    contentFrequencyPerHour: number;
    clients: number;
    maximumSpotDurationPerDay: number;
    minimumSpotDurationPerDay: number;


  };
  availableDays: string[]
  availableHours: string;
  timezone: string;
}

interface PropertyDetail_props {
  spot_dur: Boolean
  spot_hour: Boolean
  max_spot_day: Boolean
  min_spot_day: Boolean
  loop_dur: Boolean
  opertion_hours: Boolean
  no_clients_hour: Boolean
  mode_of_oper: Boolean
  program_enable: Boolean
  timezone: Boolean
  exposure: Boolean
  near_by_poi: Boolean
  avail_days: Boolean
}
const ExplorePropertyDetailsConfiguration: React.FC<PropertyDetail_props> = ({
  spot_dur,
  spot_hour,
  max_spot_day,
  min_spot_day,
  loop_dur,
  opertion_hours,
  no_clients_hour,
  mode_of_oper,
  program_enable,
  timezone,
  exposure,
  near_by_poi,
  avail_days
}) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
  const location = useLocation();
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const currentpage = propertyDetailsValue?.currentPage || 0;
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem("countryId");
  const userId = localStorage.getItem("userId")
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
  const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
  console.log(propertyDetailsValue?.type, "type");

  const fetchPropertyDetailsConfigration = async () => {
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
          setPropertyDetailsStoreValue([matchedBillboard]);
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
    fetchPropertyDetailsConfigration();
  }, [])

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      {propertyDetailsStoreValue.map((val, ind) => (
        <div key={ind}>
          <h5 className="property-head2">Spot configuration</h5>
          <div className="row">
            {spot_dur && (
              <div className="col-md-2">
                <p className="property-content-1">Spot duration</p>
                <p className="property-content-2">{val.price?.spotDuration || "N/A"}</p>
              </div>
            )}
            {spot_hour && (
              <div className="col-md-2">
                <p className="property-content-1">Spots/hour</p>
                <p className="property-content-2">{val?.price?.contentFrequencyPerHour || "N/A"}</p>
              </div>
            )}
            {max_spot_day && (
              <div className="col-md-2">
                <p className="property-content-1">Maximum spots per day</p>
                <p className="property-content-2">{val?.price?.maximumSpotDurationPerDay || "N/A"}</p>
              </div>
            )}
            {min_spot_day && (
              <div className="col-md-2">
                <p className="property-content-1">Min spots per day</p>
                <p className="property-content-2">{val?.price?.minimumSpotDurationPerDay || "N/A"}</p>
              </div>
            )}
            {loop_dur && (
              <div className="col-md-2">
                <p className="property-content-1">Loop duration (seconds)</p>
                <p className="property-content-2">{val?.price?.loopDuration || "N/A"}</p>
              </div>
            )}
          </div>
          <h5 className="property-head2">Board Configuration</h5>
          <div className="row">
            {opertion_hours && (
              <div className="col-md-2">
                <p className="property-content-1">Operation hours</p>
                <p className="property-content-2">{val?.price?.screenOnTime || "N/A"}</p>
              </div>
            )}
            { }
            <div className="col-md-2">
              <p className="property-content-1">Spot for sale</p>
              <p className="property-content-2">{val.sellingRate?.spots || "N/A"}</p>
            </div>
            {mode_of_oper && (
              <div className="col-md-2">
                <p className="property-content-1">Mode of operation</p>
                <p className="property-content-2">{val?.price?.modeOfOperation || "N/A"}</p>
              </div>
            )}
            {program_enable && (
              <div className="col-md-2">
                <p className="property-content-1">Programmatic enabled</p>
                <p className="property-content-2">{val?.price?.programmaticEnabled ? "Yes" : "No"}</p>
              </div>
            )}
            {no_clients_hour && (
              <div className="col-md-2">
                <p className="property-content-1">No. of clients per Loop</p>
                <p className="property-content-2">{val.price?.clients || "N/A"}</p>
              </div>
            )}
            {timezone && (
              <div className="col-md-2">
                <p className="property-content-1">Timezone</p>
                <p className="property-content-2">{val.timezone || "N/A"}</p>
              </div>
            )}
          </div>

          <h5 className="property-head2">Other configuration</h5>
          <div className="row">
            {near_by_poi && (
              <div className="col-md-2">
                <p className="property-content-1">Nearby POIs</p>
                <p className="property-content-2">N/A</p>
              </div>
            )}
            {avail_days && (
              <div className="col-md-10">
                <p className="property-content-1">Available</p>
                <p className="property-content-2">
                  {Array.isArray(val?.availableDays) && val?.availableDays.length > 0
                    ? val?.availableDays.join(", ")
                    : "N/A"}
                </p>
              </div>
            )}

          </div>
        </div>
      ))}
    </>
  );
}

export default ExplorePropertyDetailsConfiguration;
