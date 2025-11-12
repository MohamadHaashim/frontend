import React, { Component, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Image1 from "../../../assets/images/DSC_7293-17169.jpg";
import Image from "../../../assets/images/132566552488339083.jpg";
import Img from "../../../assets/images/login-right-bg.png";
import { GALLERY_IMAGE_ASSETS_QUERY, PROPERTY_DETAILS } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { generateMockData } from "../../../Graphql/MockData";
import Noimage from "../../../assets/images/nomedia.jpg";
import { useQuery } from "@apollo/client";

interface PropertyDetails {
  mainImage: string;
  redirect: string | null;
  thumbnailPath: string;
}

interface PropertyDetails_props {
  assest_img: Boolean
}
type GalleryImageType = {
  __typename: string;
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  duration: number;
  filePath: string;
  thumbnail: string;
  thumbnailAvailable: boolean;
  userId: string;
  companyId: string;
  countryId: string;
  source: string;
  status: string;
  metaData: any;
  resolution: string;
  comments: any;
  maxAssignedCreativeId: any;
  proofOfPlayStatus: any;
  rejectMessage: any;
  title: string | null;
  description: string | null;
  creativeName: string | null;
  creativeAdType: string | null;
  callToActionUrl: string | null;
  callToActionText: string | null;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
};


const PropertyDetailsGallery: React.FC<PropertyDetails_props> = ({ assest_img }) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
  const [mainImage, setMainImage] = useState<string>(Img); // Default main image
  const location = useLocation();
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const propertyDetailsType = location.state?.propertyDetailsData?.billboardType || {};
  const [galleryData, setGalleryData] = useState<GalleryImageType[]>([]);

  const { loading, error, data } = useQuery(GALLERY_IMAGE_ASSETS_QUERY, {
    variables: {
      sort: "last_modified_date,desc",
      metadataBillboardId: propertyDetailsValue?.id,
      metadataType: propertyDetailsType,
    },
  });
  useEffect(() => {
    if (data && data.galleryImageAssets) {
      setGalleryData(data.galleryImageAssets);
    }
  }, [data]);
  const fetchPropertyDetailsGallery = async () => {
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
      setMainImage(data.propertyDetails.thumbnailPath);


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
          setMainImage(data.propertyDetails.thumbnailPath && data.propertyDetails.thumbnailPath !== "null" ? data.propertyDetails.thumbnailPath : Noimage);

        })
        .catch((err: any) => {
          console.error("Error generating mock data:", err);
        });
    }
    else {
      fetchPropertyDetailsGallery();
    }
  }, [])

  if (redirect) {
    return <Navigate to={redirect} />;
  }


  const handleImageClick = (newImage: string) => {
    setMainImage(newImage); // Update the main image on click
  };


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            id="mainImage"
            src={mainImage} // Dynamic image
            className="main-image property-main-image"
            alt="Main Image"
          />
        </div>

        <div className="col-md-6 thumb-container property-thumb-container">
          {galleryData && galleryData.length > 0 ? (
            <div className="row">
              {galleryData.map((val, index) => (
                <div className="col-4" key={index}>
                  <img
                    src={val.thumbnail && val.thumbnail !== "null" ? val.thumbnail : Noimage} // Fallback in case thumbnail is not available
                    className="thumb-image property-thumb-img"
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => handleImageClick(val.thumbnail)} // Handle image click (optional)
                  />
                </div>
              ))}
            </div>
          ) : (
            <p>No gallery images available.</p>
          )}
        </div>
      </div>
    </div>
  );


}


export default PropertyDetailsGallery;
