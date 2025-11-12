import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Image1 from "../../../assets/images/DSC_7293-17169.jpg";
import Image2 from "../../../assets/images/group-212840670.svg";
import Image9 from "../../../assets/images/group-21.svg";

import { EXPLORE_PROPERTY_DETAILS } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { useMutation, useQuery } from "@apollo/client";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";
import NoImage from "../../../assets/images/nomedia.jpg";


// set the type
interface PropertyDetails {
  id: string;
  displayName: string;
  name: string;
  isInCart?: boolean;
  stateName: string;
  referenceId: string;
  thumbnailPath: string;
  price: {
    openAuctionCurrency: string;
  }
  sellingRate: {
    daily: number;
    monthly: {
      month1: string;
    }
  };
  specification: {

    screens: number;
    playerSoftwareModule: {
      active: boolean
    }
  };
  active: boolean
  resolutionWidth: number;
  resolutionHeight: number;
  monthlySummary: {
    totalVisitors: number;
  };
  nextAvailableDate: string | null;
}
interface SssItem {
  id: string;
  cartItemId: string;
  [key: string]: any;
}
interface PropertyDetailsStoreValue {
  dataCartList: any;
  currencyCode: any;
  refetchCartList: () => void;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
  cartCount: number;
}
const ExplorePropertyDetailsSummary: React.FC<PropertyDetailsStoreValue> = ({
  dataCartList,
  currencyCode,
  refetchCartList,
  setCartCount, cartCount,
}) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const companyId = process.env.REACT_APP_COMPANY_ID;
  const countryId = localStorage.getItem("countryId");
  const userId = localStorage.getItem("userId")
  const location = useLocation();
  const cardData = location.state?.formData || "";
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const currentpage = propertyDetailsValue?.currentPage || 0;
  const currentDate = new Date();
  const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
  const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
  const [campaignName, setCampaignName] = useState<string | null>(propertyDetailsValue?.campaignName);
  const [cartData, setCartData] = useState<any>([{}]);
  const [soldCampaignViewDetails, setSoldCampaignViewDetails] = useState<any>({});
  const [isInCart, setIsInCart] = useState(false);



  console.log(propertyDetailsValue?.type, "type");

  // Fetch property details
  const fetchPropertyDetails = async () => {
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
    if (dataCartList && propertyDetailsStoreValue) {
      const cartDataList = dataCartList.cartpageItem;
      setCartData(cartDataList);

      const resultObj = propertyDetailsStoreValue;
      const cartObj = cartDataList;

      if (resultObj && cartObj.length > 0) {
        cartObj.forEach((cartItem: any) => {
          // Match cart item name with display name
          if (cartItem.cartItemName === resultObj.displayName) {

            const updatedBillBoardData = [resultObj].map((obj: { id: any; }) => {
              if (obj.id === cartItem.cartItemId) {
                return { ...obj, isInCart: true };
              } else {
                return { ...obj, isInCart: false };
              }
            });

            setBillBoardData(updatedBillBoardData);
          }
        });
      }
    }
  }, [dataCartList, propertyDetailsStoreValue]);



  const [addedBillboardIds, setaddBillboardIds] = useState<string[]>([]);

  const addToCart = (itemData: any) => {
    try {
      const storedBillboardIds = localStorage.getItem('addedBillboardIds');
      const addedBillboardIds = storedBillboardIds ? JSON.parse(storedBillboardIds) : [];
      const isItemInCart = addedBillboardIds.includes(itemData.id);

      if (!isItemInCart) {
        const newBillBoardData = billBoardData.map((obj: { id: any }) => {
          if (obj.id === itemData.id) {
            return { ...obj, isInCart: true };
          }
          return obj;
        });

        setBillBoardData(newBillBoardData);
        const updatedIds = [...addedBillboardIds, itemData.id];
        setaddBillboardIds(updatedIds);
        localStorage.setItem('addedBillboardIds', JSON.stringify(updatedIds));
        setCartCount(cartCount + 1);

        toast.success(`${itemData.name} has been added to your cart!`);
      } else {
        toast.info(`${itemData.name} is already in your cart.`);
      }
    } catch (error) {
      toast.error("Something went wrong while adding to the cart.");
    }
  };


  const deleteCartItem = (itemData: any) => {
    try {
      const storedBillboardIds = localStorage.getItem('addedBillboardIds');
      let addedBillboardIds = storedBillboardIds ? JSON.parse(storedBillboardIds) : [];
      const isItemInCart = addedBillboardIds.includes(itemData.id);
      if (isItemInCart) {
        const updatedIds = addedBillboardIds.filter((id: any) => id !== itemData.id);
        setaddBillboardIds(updatedIds);
        localStorage.setItem('addedBillboardIds', JSON.stringify(updatedIds));
        const newBillBoardData = billBoardData.map((obj: { id: any }) => {
          if (obj.id === itemData.id) {
            return { ...obj, isInCart: false };
          }
          return obj;
        });

        setBillBoardData(newBillBoardData);
        setCartCount(cartCount - 1);
        toast.success(`${itemData.name} has been removed from your cart!`);
      } else {
        toast.info(`${itemData.name} is not in your cart.`);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the item from the cart.");
    }
  };


  useEffect(() => {
    fetchPropertyDetails();

  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }



  return (
    <>
      <div className="container mt-4">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
            <span className="loading-circle sp1">
              <span className="loading-circle sp2">
                <span className="loading-circle sp3"></span>
              </span>
            </span>
          </div>
        ) : (
          <div className="row"  >
            <div className="col-md-4 col-sm-12 position-relative">
              <img src={propertyDetailsStoreValue?.thumbnailPath && propertyDetailsStoreValue?.thumbnailPath !== "null" && propertyDetailsStoreValue?.thumbnailPath.trim() !== "" ? propertyDetailsStoreValue?.thumbnailPath : NoImage} className="img-fluid rounded-start property_img_fluid" alt="Property Image" />

              {propertyDetailsStoreValue?.active ? (
                <span className="badge badge-success status-label props-status-label bg-light text-success">
                  <i className="fa-solid fa-circle"></i> Available
                </span>
              ) : (
                <span className="badge badge-danger status-label props-status-label bg-light text-danger">
                  <i className="fa-solid fa-circle"></i> Sold Out
                </span>
              )}

            </div>
            <div className="col-md-8 col-sm-12">
              <div className="property-card-body-1">
                <div className="row property-head mb-2">
                  <div className="col-md-4 col-sm-12">
                    <p className="property-card-title">{propertyDetailsStoreValue?.displayName}</p>
                  </div>
                  <div className="col-md-5 col-sm-12">
                    <p className="property-card-text">{propertyDetailsStoreValue?.stateName}</p>
                  </div>
                  <div className="col-md-3 col-sm-12">
                    <b className="property-card-amount">
                      {currencyCode} {propertyDetailsStoreValue?.sellingRate?.monthly?.month1 ? `${propertyDetailsStoreValue?.sellingRate?.monthly?.month1}.00` : "N/A"}
                    </b>
                  </div>
                </div>
                <p style={{ marginTop: '-20px', marginBottom: '40px' }}><small className="property-text-muted">{propertyDetailsStoreValue?.referenceId || "N/A"}</small></p>
                <div className="row">
                  <div className=" property-list-unstyled list-space">
                    <div className="row col-md-12 property-row-1 mb-3">
                      <div className="col-md-2 col-sm-6 property-column-1">
                        <p className="property-title-1">Size/resolution</p>
                        <p className="property-value-1">
                          {propertyDetailsStoreValue?.resolutionWidth || "N/A"} x {propertyDetailsStoreValue?.resolutionHeight || "N/A"}

                        </p>
                      </div>
                      <div className="col-md-2 col-sm-6 property-column-1">
                        <p className="property-title-1">Number of screens</p>
                        <p className="property-value-1">
                          {propertyDetailsStoreValue?.specification?.screens || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-2 col-sm-6 property-column-1">
                        <p className="property-title-1">Impressions</p>
                        <p className="property-value-1">
                          {propertyDetailsStoreValue?.monthlySummary?.totalVisitors || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-3 col-sm-6 property-column-1">
                        <p className="property-title-1">Next available slot</p>
                        <p className="property-value-1">
                          {propertyDetailsStoreValue?.nextAvailableDate || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-3 col-sm-6 property-column-1">
                        {propertyDetailsStoreValue?.active && (
                          <>
                            {(() => {
                              const storedIdsString = localStorage.getItem("addedBillboardIds");
                              const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
                              const isInCart = storedIds.includes(propertyDetailsStoreValue.id);
                              if (isInCart) {
                                return (
                                  <button
                                    className="col-md-3 btn btn-primary propety-btn-primarys properties-btn w-100"
                                    onClick={() => deleteCartItem(propertyDetailsStoreValue)}
                                  >
                                    <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                    Delete
                                  </button>
                                );
                              } else {
                                return (
                                  <button
                                    className="col-md-3 btn btn-primary propety-btn-primarys properties-btn w-100"
                                    onClick={() => addToCart(propertyDetailsStoreValue)}
                                  >
                                    <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                    Add to Cart
                                  </button>
                                );
                              }
                            })()}
                          </>
                        )}
                      </div>




                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </>
  );
}

export default ExplorePropertyDetailsSummary;
