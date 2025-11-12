import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { PROPERTY_DETAILS } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { generateMockData } from "../../../Graphql/MockData";

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
    contentFrequencyPerHour: number;
    clients: number;
    maximumSpotDurationPerDay: number;
    minimumSpotDurationPerDay: number;
    availableDays: string[]

  };
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
const PropertyDetailsConfiguration: React.FC<PropertyDetail_props> = ({
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


  const fetchPropertyDetailsConfigration = async () => {
    const token = localStorage.getItem("authToken");
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const countryId = localStorage.getItem("countryId");
    try {
      const { data } = await client.query({
        query: PROPERTY_DETAILS,
        variables: {
          accessToken: token,
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          billboardType: propertyDetailsValue?.type

        }
      })
      setPropertyDetailsStoreValue([data.propertyDetails]);

    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  }
  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === 'true') {
      generateMockData(PROPERTY_DETAILS)
        .then((mockResponse: any) => {
          const data = mockResponse.data;
          setPropertyDetailsStoreValue([data.propertyDetails]);
        })
        .catch((err: any) => {
          console.error("Error generating mock data:", err);
        });
    }
    else {
      fetchPropertyDetailsConfigration();
    }
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
                <p className="property-content-2">{val.loopDuration || "N/A"}</p>
              </div>
            )}
          </div>
          <h5 className="property-head2">Board Configuration</h5>
          <div className="row">
            {opertion_hours && (
              <div className="col-md-2">
                <p className="property-content-1">Operation hours</p>
                <p className="property-content-2">{val.displayOnTime || "N/A"}</p>
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
                <p className="property-content-2">N/A</p>
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
                  {Array.isArray(val?.price?.availableDays) && val?.price?.availableDays.length > 0
                    ? val?.price?.availableDays.join(", ")
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

export default PropertyDetailsConfiguration;
