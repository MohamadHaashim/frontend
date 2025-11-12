import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Img from "../../../assets/images/audience.png";
import client from "../../../Graphql/apolloClient";
import { EXPLORE_PROPERTY_BUTTON, GET_PROPERTY_DETAILS, PROPERTY_DETAILS_CHART_QUERY } from "../../../Graphql/Queries";
import Image7 from "../../../assets/images/audience.png";
import { generateMockData } from "../../../Graphql/MockData";

interface PropertyDetails {
  redirect: string | null,
  monthlySummary: {
    reach: number;
    uniqueVisitors: number;
    frequency: number;
    totalVisitors: number;
    seniorPercentage: number;
    adultPercentage: number;
    youngAdultPercentage: number;
    malePercentage: number;
    femalePercentage: number;
  }
}
interface BubbleData {
  name: string;
  value: number;
  secondLevel: BubbleData[];
}

interface Segment {
  name: string;
  firstLevel: BubbleData[];
}
interface PropertyDetails_props {
  impressions: Boolean
  reach: Boolean
  averageFrequency: Boolean
  audienceSegment: Boolean
}
const PropertyDetailsAudience: React.FC<PropertyDetails_props> = ({ impressions, reach, averageFrequency, audienceSegment }) => {

  const [redirect, setRedirect] = useState<string | null>(null);
  const [activeButton, setActiveButton] = useState<'demographics' | 'audienceAnalysis'>('demographics');
  const [explorePropertyStoreValue, setExplorePropertyStoreValue] = useState<PropertyDetails | null>(null);
  const [data, setData] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const token = localStorage.getItem("authToken");
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem("countryId");
  const fetchExplporePropertyChart = async () => {
    try {
      const { data } = await client.query({
        query: GET_PROPERTY_DETAILS,
        variables: {
          accessToken: token,
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          billboardType: propertyDetailsValue?.type,
        }
      })
      setExplorePropertyStoreValue(
        data.propertyDetails);

    } catch (error) {
      console.error("Error fetching exploreProperty:", error);
    }
  }
  const [selectedAudience, setSelectedAudience] = useState('Top 5');

  const handleSelectChange = (event: any) => {
    setSelectedAudience(event.target.value);
  };

  // bubble chart
  const fetchBubbleChart = async () => {

    const id = localStorage.getItem('propertyViewId');
    if (!token || !companyId || !countryId) {
      setError("Missing authentication data. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await client.query({
        query: PROPERTY_DETAILS_CHART_QUERY,
        variables: {
          accessToken: token,
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          rankLimit: selectedAudience,
        },
      });

      const fetchedData = response.data;

      if (
        fetchedData &&
        fetchedData.bubbleChartData &&
        fetchedData.bubbleChartData[0] &&
        fetchedData.bubbleChartData[0].segments
      ) {
        setData(fetchedData.bubbleChartData[0].segments);
      } else {
        throw new Error("Unexpected data format: bubbleChartData or segments missing");
      }
    } catch (error) {
      console.error("Error fetching bubble chart data:", error);
      setError("Error fetching bubble chart data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchExplporePropertyChart();
  //   fetchBubbleChart()
  // }, [selectedAudience])

  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === 'true') {
      generateMockData(EXPLORE_PROPERTY_BUTTON)
        .then((mockResponse: any) => {
          const data = mockResponse.data;
          setExplorePropertyStoreValue(
            data.landingpageExploreButton[0]);
        })
        .catch((err: any) => {
          console.error("Error generating mock data:", err);
        });

      generateMockData(PROPERTY_DETAILS_CHART_QUERY)
        .then((mockResponse: any) => {
          const fetchedData = mockResponse.data;
          setData(fetchedData.bubbleChartData);
        })
        .catch((err: any) => {
          console.error("Error generating mock data:", err);
        });
    }
    else {
      fetchExplporePropertyChart();
      fetchBubbleChart()
    }
  }, [selectedAudience])

  const parentRadius = 50; // Radius for the parent node
  const childRadius = 40; // Radius for the child node
  const radius = 200; // Distance from the center to the pentagon vertices

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const openAudience_Analysis = () => {
    setActiveButton('audienceAnalysis');
  }

  const openDemographic_Details = () => {
    setActiveButton('demographics');
  };
  const gap = 100;



  return (
    <>
      <div className="container audience-content">
        <div className="audience-btns">
          <div className="audience-btn1">
            <button className={`audience-activebuttons ${activeButton === 'demographics' ? 'active' : ''}`}
              onClick={openDemographic_Details}>Demographic details</button>
          </div>

          <div className="audience-btn2">
            {(audienceSegment || impressions || reach || averageFrequency) && (
              <>
                <button
                  className={`audience-activebuttons ${activeButton === 'audienceAnalysis' ? 'active' : ''}`}
                  onClick={openAudience_Analysis}
                >
                  Audience analysis
                </button>
              </>
            )}
          </div>

        </div>

        <div className="audience-value row" >

          <div className="audience-value-label1 col-md-2 col-sm-2">
            {impressions && (
              <>
                <p className="value-label">Impressions</p>
                <h6 className="value-num">{explorePropertyStoreValue?.monthlySummary?.totalVisitors || "0"}</h6>
              </>)}
          </div>

          <div className="audience-value-label2 col-md-2 col-sm-2">
            {reach && (
              <>
                <p className="value-label">Reach</p>
                <h6 className="value-num">{explorePropertyStoreValue?.monthlySummary?.uniqueVisitors || "0"}</h6>
              </>)}
          </div>

          <div className="audience-value-label3 col-md-2 col-sm-2">
            {averageFrequency && (
              <>
                <p className="value-label">Average frequency</p>
                <h6 className="value-num">{explorePropertyStoreValue?.monthlySummary?.frequency.toFixed(2) || "0"}</h6>
              </>)}
          </div>
          {activeButton === 'audienceAnalysis' && (
            <div className="audience-value-label3 audience_segment_label col-md-12 col-sm-12">
              {audienceSegment && (
                <>
                  <h6 className="audience_segment_head">Audience segment: </h6>
                  <select className="audience_segment assign_drowdown_head" value={selectedAudience} onChange={handleSelectChange}>
                    <option className="audience_option assign_dropdown_item assign_dropdown_menu assign_fa_check" value="all">All</option>
                    <option className="audience_option assign_dropdown_item assign_dropdown_menu" value="Top 5">Top 5</option>
                    <option className="audience_option assign_dropdown_item assign_dropdown_menu" value="Top 10">Top 10</option>
                  </select>
                </>)}
            </div>

          )}
        </div>

        {activeButton === 'demographics' && (

          <div className="audience-card row">

            <div className="audiences-card1 col-md-7 col-sm-7 fullwidth">
              <div className="card1-title">Age (in %)</div>
              <div className="card1-chart">
                <div className="card1-y-axis-labels-parent">
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} className="card1-y-axis-label-child">{(60 - i * 10).toString()}</div>
                  ))}
                </div>
                <div className="card1-horizontal-lines-parent">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i} className="card1-horizontal-line-child"></div>
                  ))}
                </div>
                {/* {explorePropertyStoreValue?.monthlySummary?.seniorPercentage} */}
                <div className="card1-bar-chart">
                  <div
                    className="card1-bar seniorgraph"
                    style={{ height: `${explorePropertyStoreValue?.monthlySummary?.seniorPercentage || 0}%` }}
                    data-tooltip={`Senior: ${explorePropertyStoreValue?.monthlySummary?.seniorPercentage || 0}%`}
                  ></div>

                  <div
                    className="card1-bar adultgraph"
                    style={{ height: `${explorePropertyStoreValue?.monthlySummary?.adultPercentage || 0}%` }}
                    data-tooltip={`Adult: ${explorePropertyStoreValue?.monthlySummary?.adultPercentage || 0}%`}
                  ></div>

                  <div
                    className="card1-bar youthgraph"
                    style={{ height: `${explorePropertyStoreValue?.monthlySummary?.youngAdultPercentage || 0}%` }}
                    data-tooltip={`Youth: ${explorePropertyStoreValue?.monthlySummary?.youngAdultPercentage || 0}%`}
                  ></div>
                </div>

              </div>
              <div className="card1-labels-parent">
                <div className="card1-label-child">Senior-{explorePropertyStoreValue?.monthlySummary?.seniorPercentage}</div>
                <div className="card1-label-child">Adult-{explorePropertyStoreValue?.monthlySummary?.adultPercentage}</div>
                <div className="card1-label-child">Youth-{explorePropertyStoreValue?.monthlySummary?.youngAdultPercentage}</div>
              </div>
            </div>
            <div className="col-md-1 col-sm-1 ">
            </div>
            {/* gender chart */}
            <div className="audiences-card2 col-md-4 col-sm-4 fullwidth">
              <div className="gender-chart">Gender</div>
              <div className="gender-chart-circle" style={{
                background: `conic-gradient(
           #0062ff ${explorePropertyStoreValue?.monthlySummary?.malePercentage ?? 0}%, 
           #f44336  ${explorePropertyStoreValue?.monthlySummary?.femalePercentage ?? 0}%,
           #e8f0fe ${explorePropertyStoreValue?.monthlySummary?.malePercentage ?? 0 + (explorePropertyStoreValue?.monthlySummary?.femalePercentage ?? 0)}% 100%
         )`
              }}
                data-male-percentage={`${explorePropertyStoreValue?.monthlySummary?.malePercentage || 0}%`}
                data-female-percentage={`${explorePropertyStoreValue?.monthlySummary?.femalePercentage || 0}%`}
              >
                <div className="gender-chart-label">
                  Male Reach / Female Reach
                </div>
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
        )}


        {activeButton === 'audienceAnalysis' && (
          <div className="audience-analysis fullwidth">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : data.length > 0 ? (
              <svg
                width="100%" // Make the SVG full width of the container
                height="750px" // Make the SVG height 100% based on the container height
                viewBox="0 -150 900 1090" // Set the viewBox to maintain aspect ratio
                preserveAspectRatio="xMidYMid meet" // Preserve the aspect ratio of the graph
              >
                {data.map((segment, index) => {
                  const angle = (index * (2 * Math.PI)) / data.length;
                  const x = Math.cos(angle) * (radius + gap) + 400;
                  const y = Math.sin(angle) * (radius + gap) + 400;

                  return (
                    <g key={index}>
                      <circle
                        cx={x}
                        cy={y}
                        r={parentRadius + 12}
                        fill="none"
                        stroke="#7DA3DC"
                        strokeWidth="2.3"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r={parentRadius + 10}
                        fill="#014DC0"
                        onMouseOver={(e) => {
                          // Show tooltip near the parent circle
                          const tooltip = document.getElementById('tooltip');
                          if (tooltip) {
                            tooltip.style.display = 'block';
                            tooltip.innerHTML = `${segment.name} (Total: ${segment.firstLevel.reduce((sum, child) => sum + child.value, 0)})`;
                            tooltip.style.left = `${x + 15}px`; // Position tooltip based on circle's x coordinate
                            tooltip.style.top = `${y - 30}px`; // Position tooltip above the circle
                          }
                        }}
                        onMouseOut={() => {
                          const tooltip = document.getElementById('tooltip');
                          if (tooltip) {
                            tooltip.style.display = 'none';
                          }
                        }}
                      />
                      <text x={x} y={y} fill="white" textAnchor="middle" dy=".3em" fontSize="14px">
                        {segment.name}
                      </text>

                      {segment.firstLevel.map((child, childIndex) => {
                        const childAngle = (childIndex * (2 * Math.PI)) / segment.firstLevel.length;
                        const childX = x + Math.cos(childAngle) * (radius / 1);
                        const childY = y + Math.sin(childAngle) * (radius / 1);

                        return (
                          <g key={childIndex}>
                            <line
                              x1={x + Math.cos(childAngle) * parentRadius}
                              y1={y + Math.sin(childAngle) * parentRadius}
                              x2={childX - Math.cos(childAngle) * childRadius}
                              y2={childY - Math.sin(childAngle) * childRadius}
                              stroke="#7DA3DC"
                              strokeWidth="2.3"
                            />
                            <circle
                              cx={childX}
                              cy={childY}
                              r={childRadius + 11}
                              fill="#326FCB"
                              onMouseOver={(e) => {
                                // Show tooltip near the child circle
                                const tooltip = document.getElementById('tooltip');
                                if (tooltip) {
                                  tooltip.style.display = 'block';
                                  tooltip.innerHTML = `${child.name} (Value: ${child.value})`;
                                  tooltip.style.left = `${childX - 10}px`; // Position tooltip based on child circle's x coordinate
                                  tooltip.style.top = `${childY - 30}px`; // Position tooltip above the child circle
                                }
                              }}
                              onMouseOut={() => {
                                const tooltip = document.getElementById('tooltip');
                                if (tooltip) {
                                  tooltip.style.display = 'none';
                                }
                              }}
                            />
                            <text x={childX} y={childY} fill="white" textAnchor="middle" dy="0.3em" fontSize="10px">
                              {child.name}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}


                {/* Draw lines between main segment nodes for connectivity */}
                {data.map((_, index) => {
                  const angle = (index * (2 * Math.PI)) / data.length;
                  const nextAngle = ((index + 1) % data.length) * (2 * Math.PI) / data.length;

                  const x1 = Math.cos(angle) * (radius + gap) + 400 + Math.cos(angle) * (parentRadius + 8); // Add gap here
                  const y1 = Math.sin(angle) * (radius + gap) + 400 + Math.sin(angle) * (parentRadius + 8); // Add gap here
                  const x2 = Math.cos(nextAngle) * (radius + gap) + 400 + Math.cos(nextAngle) * (parentRadius + 8); // Add gap here
                  const y2 = Math.sin(nextAngle) * (radius + gap) + 400 + Math.sin(nextAngle) * (parentRadius + 8); // Add gap here

                  return (
                    <line
                      key={`line-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#7DA3DC"
                      strokeWidth="2.3"
                    />
                  );
                })}
              </svg>
            ) : (
              <p>No data available</p>
            )}

            <div
              id="tooltip"
              // className="bubble bubble-bottom-left"
              style={{
                position: 'absolute',
                display: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.596)',
                color: '#fff',
                left: "-40px",
                top: '-50px',
                padding: '5px 10px',
                borderRadius: '20px 20px 20px 20px',
                fontSize: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                cursor: 'pointer',
                scale: '1',

              }}
            />
          </div>
        )}






      </div>
    </>
  );

}
export default PropertyDetailsAudience;







