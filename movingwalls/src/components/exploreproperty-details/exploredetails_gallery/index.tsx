import React, { Component, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Image1 from "../../../assets/images/DSC_7293-17169.jpg";
import Image from "../../../assets/images/132566552488339083.jpg";
import Img from "../../../assets/images/login-right-bg.png";
import { EXPLORE_PROPERTY_DETAILS, GALLERY_IMAGE_ASSETS_QUERY } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";
import { format } from 'date-fns';
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

const ExplorePropertyDetailsGallery: React.FC<PropertyDetails_props> = ({ assest_img }) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
  const [mainImage, setMainImage] = useState<string>(Img); // Default main image
  const location = useLocation();
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const currentpage = propertyDetailsValue?.currentPage || 0;
  const [loading, setLoading] = useState(false);
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem("countryId");
  const userId = localStorage.getItem("userId");
  const currentDate = new Date();

  const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
  const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
  const propertyDetailsType = location.state?.propertyDetailsData?.billboardType || location.state?.propertyDetailsData?.type || {};
  const [galleryData, setGalleryData] = useState<GalleryImageType[]>([]);
  console.log(propertyDetailsType, "prtype");
  console.log(propertyDetailsValue?.type, "type");

  const { error, data } = useQuery(GALLERY_IMAGE_ASSETS_QUERY, {
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
          setMainImage(matchedBillboard?.thumbnailPath && matchedBillboard?.thumbnailPath !== "null" ? matchedBillboard?.thumbnailPath : Noimage);
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
    fetchPropertyDetailsGallery();
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
            src={mainImage}
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


export default ExplorePropertyDetailsGallery;
