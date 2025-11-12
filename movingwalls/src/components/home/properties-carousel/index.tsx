import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Get_ThreeBillboard } from "../../../Graphql/Queries";
import NoImage from "../../../assets/images/nomedia.jpg";

const PropertiesCarousel: React.FC<{ currencyCode: any }> = ({ currencyCode }) => {
  const [sortedProperties, setSortedProperties] = useState<any[]>([]);
  const [centerIndex, setCenterIndex] = useState<number>(0);

  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem("countryId");
  const variables = {
    companyId,
    countryId,
  };

  const { data, loading, error } = useQuery(Get_ThreeBillboard, { variables });

  // Auto-scroll effect
  useEffect(() => {
    if (sortedProperties.length > 0) {
      const interval = setInterval(() => {
        setCenterIndex((prevIndex) => (prevIndex + 1) % sortedProperties.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [sortedProperties]);

  useEffect(() => {
    if (!loading && !error && data) {
      setSortedProperties(data.topThreeBillboard || []);
    }
  }, [loading, error, data]);

  const navigate = useNavigate();

  const navigateToProDetails = (id: string, campaignName: string, type: any) => {
    const propertyDetailsData = {
      id,
      campaignName,
      type,
    };
    navigate(`${process.env.REACT_APP_BASE_PATH}/exploreproperty-details`, {
      state: { propertyDetailsData, toexploreproperty: true },
    });
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <span className="loading-circle sp1">
            <span className="loading-circle sp2">
              <span className="loading-circle sp3"></span>
            </span>
          </span>
        </div>
      ) : (
        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-indicators">
            {sortedProperties.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === centerIndex ? "active" : ""}
                aria-current={index === centerIndex ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
                onClick={() => setCenterIndex(index)}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {sortedProperties.map((property, index) => (
              <div
                className={`carousel-item${index === centerIndex ? " active" : ""}`}
                key={property.id}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={property.thumbnailPath || NoImage}
                    className="d-block w-90"
                    style={{
                      height: "500px",
                      objectFit: "cover",
                    }}
                    alt={property.displayName}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <div className="curousel-cnt row">
                      <div
                        className="col-md-6"
                        style={{
                          position: "absolute",
                          left: "20px",
                          color: "#fff",
                          padding: "10px 20px",
                          borderRadius: "5px",
                        }}
                      >
                        <span
                          style={{ marginBottom: "5px" }}
                          className="carousel-caption-title"
                        >
                          {property.displayName}{" "}
                          <span
                            className="carousel-caption-text"
                            style={{ fontSize: "14px", fontWeight: "normal" }}
                          >
                            {property.stateName}
                          </span>
                        </span>
                        <p style={{ margin: 0 }} className="carousel-price">
                          {currencyCode} {property.priceRates ? `${property.priceRates}.00` : "N/A"}
                        </p>
                      </div>
                      <div
                        className="carousel-btn col-md-6"
                        style={{
                          position: "absolute",
                          right: "20px",
                        }}
                      >
                        {/* <button
                          className="btn btn-primary carousel-btn-view"
                          style={{
                            border: "none",
                            borderRadius: "5px",
                          }}
                          onClick={() => navigateToProDetails(property.billboardObjectId, property.campaignName, property.billboardType)}
                        >
                          View details
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            onClick={() =>
              setCenterIndex((prevIndex) =>
                prevIndex === 0 ? sortedProperties.length - 1 : prevIndex - 1
              )
            }
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            onClick={() =>
              setCenterIndex((prevIndex) => (prevIndex + 1) % sortedProperties.length)
            }
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      )}
    </>
  );
};

export default PropertiesCarousel;
