import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { EXPLORE_PROPERTY_BUTTON } from "../../../Graphql/Queries";
import { generateMockData } from "../../../Graphql/MockData";
import NoImage from "../../../assets/images/nomedia.jpg";



const ExploreProperties: React.FC<{ currencyCode: any, countryIds: string }> = ({ currencyCode, countryIds }) => {

  const navigate = useNavigate();
  const isAuthenticated = Boolean(false);
  const [openError, setOpenError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [properties, setProperties] = useState<any[]>([]);
  const cartRef = useRef<HTMLDivElement>(null); // Ref for the cart section
  const [currentIndex, setCurrentIndex] = useState(0); // Index for the carousel
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem('countryId') || countryIds;
  const variables = {
    companyId: companyId,
    countryId: countryId,
  };
  const { data, loading, error } = useQuery(EXPLORE_PROPERTY_BUTTON, {
    variables
  });

  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === "true") {
      // Generate mock data when mockData is true
      generateMockData(EXPLORE_PROPERTY_BUTTON)
        .then((mockResponse) => {
          setProperties(mockResponse.data.landingpageExploreButton);
        })
        .catch((err) => {
          console.error("Error generating mock data:", err);
        });
    } else {
      if (data) {
        setProperties(data.landingpageExploreButton);
      }
    }
  }, [data]);

  useEffect(() => {
    if (properties.length > 3) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [properties]);

  const handlePropertyDetails = (propertyId: any) => {
    if (!isAuthenticated) {
      setOpenError(true);
      setErrorMessage("You need to be logged in to view property details.");
    } else {
      navigate(`/property-details/${propertyId}`);
    }
  };

  const navigateToProDetails = (id: any, type: any, campaignName: any, startDate: any, endDate: any) => {
    const propertyDetailsData = {
      id,
      type,
      campaignName,
      startDate,
      endDate,
      currentPage: 0,
    };
    navigate(`${process.env.REACT_APP_BASE_PATH}/exploreproperty-details`, {
      state: { propertyDetailsData, toexploreproperty: true },
    });
  };

  const visibleProperties = properties.slice(currentIndex, currentIndex + 3);

  return (
    <>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "40vh" }}>
          <span className="loading-circle sp1">
            <span className="loading-circle sp2">
              <span className="loading-circle sp3"></span>
            </span>
          </span>
        </div>
      ) : (
        <div ref={cartRef} className="row">
          {visibleProperties.map((property: any) => (
            <div className="col-md-4" key={property.id}>
              <div className="card explore-card explore-card1">
                <div className="card-frame1">
                  {property.active ? (
                    <span>
                      <i className="fa-solid fa-circle"></i> Available
                    </span>
                  ) : (
                    <span>
                      <i className="fa-solid fa-circle"></i> Sold Out
                    </span>
                  )}
                </div>
                <img src={property.thumbnailPath && property.thumbnailPath !== "null" ? property.thumbnailPath : NoImage} className="card-img" alt={property.displayName} />
                <div className="card-body">
                  <span className="card-title">
                    {property.displayName} <span className="card-text">{property.stateName}</span>
                  </span>
                  <p className="card-price">
                    {currencyCode}{" "}
                    {property?.sellingRate?.monthly?.month1 ? `${property?.sellingRate?.monthly?.month1}.00` : "N/A"}
                  </p>
                  <button
                    className="btn btn-primary card-btn"
                    onClick={() =>
                      navigateToProDetails(property.id, property.type, property.campaignName, property.startDate, property.endDate)
                    }
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ExploreProperties;
