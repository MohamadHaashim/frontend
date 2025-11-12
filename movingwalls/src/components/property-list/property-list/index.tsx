import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Img from "../../../assets/images/audience.png";
import client from "../../../Graphql/apolloClient";
import { PROPERTY_DETAILS, PROPERTY_DETAILS_CHART_QUERY } from "../../../Graphql/Queries";
import "./index.css"
interface PropertyDetails {
  redirect: string | null,
  reach: number;
  frequency: number;
  totalVisitors: number;

}
interface FirstLevel {
  name: string;
  value: number;
  secondLevel: any[];
}

interface Segment {
  name: string;
  firstLevel: FirstLevel[];
}

interface BubbleGraph {
  segments: Segment[];
}

const PropertyList: React.FC = () => {

  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
  const [propertyDetailsStoreChartValue, setPropertyDetailsStoreChartValue] = useState<BubbleGraph[]>([]);
  const location = useLocation();
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const companyId = process.env.REACT_APP_COMPANY_ID;

  const fetchPropertyDetailChartSummary = async () => {
    const token = localStorage.getItem("authToken");
    const countryId = localStorage.getItem("state");
    try {
      const { data } = await client.query({
        query: PROPERTY_DETAILS,
        variables: {
          accessToken: token,
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          // rankLimit:"Top 5"
        }
      })
      setPropertyDetailsStoreValue([data.propertyDetails.monthlySummary]);

    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  }

  const fetchPropertyDetailChartBar = async () => {
    const token = localStorage.getItem("authToken");
    const countryId = localStorage.getItem("state");
    try {
      const { data } = await client.query({
        query: PROPERTY_DETAILS_CHART_QUERY,
        variables: {
          accessToken: token,
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          rankLimit: "all"
        }
      })
      setPropertyDetailsStoreChartValue([data.bubbleChartData]);

    } catch (error) {
      console.error("Error fetching property details:", error);
    }
  }

  useEffect(() => {
    fetchPropertyDetailChartSummary();
    fetchPropertyDetailChartBar();
  }, [])

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const openAudience_Analysis = () => {

  }

  return (
    <>
      <div className="container audience-content">
        <div className="audience-btns">
          <div className="audience-btn1">
            <button>Demographic details</button>
          </div>
          <div className="audience-btn2">
            <button onClick={openAudience_Analysis}>Audience analysis</button>
          </div>
        </div>

        {propertyDetailsStoreValue.map((val, ind) => (
          <div className="audience-value row" key={ind}>
            <div className="audience-value-label1 col-md-2 col-sm-2">
              <p className="value-label">Impressions</p>
              <h6 className="value-num">{val.totalVisitors || "0"}</h6>
            </div>
            <div className="audience-value-label2 col-md-2 col-sm-2">
              <p className="value-label">Reach</p>
              <h6 className="value-num">{val.reach || "0"}</h6>
            </div>
            <div className="audience-value-label3 col-md-2 col-sm-2">
              <p className="value-label">Average frequency</p>
              <h6 className="value-num">{val.frequency || "0"}</h6>
            </div>
            <div className="audience-value-label3 col-md-6 col-sm-6">
            </div>
          </div>
        ))}

        <div className="audience-card row">

          <div className="audiences-card1 col-md-7 col-sm-7 fullwidth">
            <div className="card1-title">Age (in %)</div>
            <div className="card1-chart">
              <div className="card1-y-axis-labels-parent">
                <div className="card1-y-axis-label-child">60</div>
                <div className="card1-y-axis-label-child">50</div>
                <div className="card1-y-axis-label-child">40</div>
                <div className="card1-y-axis-label-child">30</div>
                <div className="card1-y-axis-label-child">20</div>
                <div className="card1-y-axis-label-child">10</div>
                <div className="card1-y-axis-label-child">0</div>
              </div>
              <div className="card1-horizontal-lines-parent">
                <div className="card1-horizontal-line-child"></div>
                <div className="card1-horizontal-line-child"></div>
                <div className="card1-horizontal-line-child"></div>
                <div className="card1-horizontal-line-child"></div>
                <div className="card1-horizontal-line-child"></div>
                <div className="card1-horizontal-line-child"></div>
                <div className="card1-horizontal-line-child"></div>
              </div>
              <div className="card1-bar-chart">
                <div className="card1-bar" style={{ height: "5%" }}></div>
                <div className="card1-bar" style={{ height: "50%" }}></div>
                <div className="card1-bar" style={{ height: "80%" }}></div>
              </div>
            </div>
            <div className="card1-labels-parent">
              <div className="card1-label-child">Senior-65+</div>
              <div className="card1-label-child">Senior-65+</div>
              <div className="card1-label-child">Senior-65+</div>
            </div>
          </div>
          <div className="col-md-1 col-sm-1 ">
          </div>
          {/* gender chart */}
          <div className="audiences-card2 col-md-4 col-sm-4 fullwidth">
            <div className="gender-chart">Gender</div>
            <div className="gender-chart-circle">
              <div className="gender-chart-label">Male Reach/Female Reach</div>
            </div>
            <div className="gender-category">
              <div className="gender-category-item">
                <span className="gender-category-color male-color"></span>
                Male
              </div>
              <div className="gender-category-item">
                <span className="gender-category-color female-color"></span>
                Female
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

}
export default PropertyList;
