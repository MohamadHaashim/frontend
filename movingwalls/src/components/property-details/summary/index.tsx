import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Image1 from "../../../assets/images/DSC_7293-17169.jpg";
import Image2 from "../../../assets/images/group-212840670.svg";
import Image9 from "../../../assets/images/group-21.svg";

import { PROPERTY_DETAILS } from "../../../Graphql/Queries";
import client from "../../../Graphql/apolloClient";
import { ADD_TO_CART_SUBMIT, DELETE_CART_SUBMIT, GET_MY_CART_ITEMS } from "../../../Graphql/cartQueries";
import { useMutation, useQuery } from "@apollo/client";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import { generateMockData } from "../../../Graphql/MockData";
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
    resolution1Width: number;
    resolution1Height: number;
    screens: number;
    contentApproval: boolean;
    playerSoftwareModule: {
      active: boolean
    }
  };
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
}
const PropertyDetailsSummary: React.FC<PropertyDetailsStoreValue> = ({
  dataCartList,
  currencyCode,
  refetchCartList,
}) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");
  const companyId = localStorage.getItem("companyId");
  const countryId = localStorage.getItem("countryId");
  const userId = localStorage.getItem("userId")
  const location = useLocation();
  const cardData = location.state?.formData || "";
  const propertyDetailsValue = location.state?.propertyDetailsData || {};
  const currentDate = new Date();
  const [campaignName, setCampaignName] = useState<string | null>(propertyDetailsValue?.campaignName);
  const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
  const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
  const [cartData, setCartData] = useState<any>([{}]);
  const [cartCount, setCartCount] = useState(0);
  const [addtoCartQuery] = useMutation(ADD_TO_CART_SUBMIT);
  const [deleteCartQuery] = useMutation(DELETE_CART_SUBMIT);
  const [soldCampaignViewDetails, setSoldCampaignViewDetails] = useState<any>({});
  const [isInCart, setIsInCart] = useState(false);




  // Fetch property details
  const fetchPropertyDetails = async () => {
    setLoading(true);
    try {
      const { data } = await client.query({
        query: PROPERTY_DETAILS,
        variables: {
          accessToken: token,
          id: propertyDetailsValue?.id,
          companyId: companyId,
          countryId: countryId,
          billboardType: propertyDetailsValue?.type,

        },
      });

      setPropertyDetailsStoreValue(data.propertyDetails);
    }
    catch (error) {
      console.error("Error fetching property details:", error);
    }
    finally {
      setLoading(false);
    }
  };
  // const { loading: loadingCartList, error: errorCartList, data: dataCartList, refetch: refetchCartList } = useQuery(GET_MY_CART_ITEMS, {
  //   variables: {
  //     accessToken: token,
  //     userId: userId
  //   }
  // })
  const [billBoardData, setBillBoardData] = useState<any>([]);
  useEffect(() => {
    if (dataCartList && propertyDetailsStoreValue) {
      const cartDataList = dataCartList?.cartPageItem[0]?.campaignInventories || [];
      setCartData(cartDataList);
    }
  }, [dataCartList, propertyDetailsStoreValue]);





  const addToCart = async (items: any[] | any) => {
    const itemsArray = Array.isArray(items) ? items : [items];
    const formattedItems = itemsArray.map(itemData => {
      const cartItemResolution = itemData.cartItemResolution || (
        itemData.cartItemType === 'CLASSIC'
          ? `${itemData.specification.panelHeight && itemData.specification.panelWidth ? itemData.specification.panelHeight + 'x' + itemData.specification.panelWidth : 'Default Resolution'}`
          : `${itemData.specification.resolution1Height && itemData.specification.resolution1Width
            ? itemData.specification.resolution1Height + 'x' + itemData.specification.resolution1Width
            : 'Default Resolution'}`
      );
      return {
        accessToken: token,
        userId: userId,
        campaignName: campaignName,
        startDate: format(startDate, 'dd MMMM yyyy'),
        endDate: format(endDate, 'dd MMMM yyyy'),
        cartItemName: itemData.cartItemName || itemData.displayName,
        cartItemId: propertyDetailsValue?.id,
        cartItemReferenceId: itemData.cartItemReferenceId || itemData.referenceId,
        cartItemType: itemData.cartItemType || itemData.type,
        cartItemCountry: itemData.cartItemCountry || itemData.stateName,
        cartItemVenueType: itemData.cartItemType || itemData.venueType,
        cartItemResolution: cartItemResolution,
        cartItemThumbnailUrl: itemData.cartItemThumbnailUrl || itemData.thumbnailPath,
        cartItemLatitude: itemData.cartItemLatitude || itemData.latitude,
        cartItemLongitude: itemData.cartItemLongitude || itemData.longitude,
        packageDetails: itemData.packageDetails || "",
      };
    });

    try {
      const { data, errors } = await addtoCartQuery({
        variables: {
          input: formattedItems
        }
      });

      if (data) {
        const { success, message } = data.addtocart.itemData[0];

        if (success) {
          refetchCartList();
          toast.success(message);
          setIsInCart(true);
        } else {
          toast.error(message || "Failed to add item to cart.");
        }
      } else {
        toast.error("No data returned from the server.");
      }
      if (errors) {
        toast.error(errors[0]?.message || "An error occurred while adding to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const [cartId, setcartId] = useState<SssItem[]>([]);
  const deleteCartItem = async (itemData: any) => {

    const matchingCartItem = cartData.find((cartItem: any) => cartItem.billboardName === itemData);

    if (!matchingCartItem) {
      toast.error("Item not found in cart.");
      return;
    }

    // Extract cartItemId from the matching cart item
    const cartItemId = matchingCartItem.cartItemId;

    if (propertyDetailsStoreValue?.displayName === itemData) {
      try {
        const { data, errors } = await deleteCartQuery({
          variables: {
            accessToken: token,
            deleteItemId: cartItemId,
            itemType: "cart-data"
          }
        });

        if (data) {
          if (data.deleteCartItem.success) {

            const updatedBillBoardData = billBoardData.map((obj: { id: any; }) => {
              if (obj.id === matchingCartItem.cartItemId) {
                return { ...obj, isInCart: false };
              }
              return obj;
            });
            setBillBoardData(updatedBillBoardData);
            setCartCount(cartCount - 1);
            refetchCartList();
            setIsInCart(false);
            toast.success(data.deleteCartItem.message);
          } else {
            toast.error(data.deleteCartItem.message);
          }
        }

        if (errors) {
          toast.error(errors[0].message);
        }
      } catch (error) {
      }
    } else {
      toast.error("The cart item does not match the selected property.");
    }
  };

  const ShowAddDeleteCartBtn = (curObj: string) => {
    return cartData.some((cartItem: any) => curObj === cartItem.billboardName);
  };




  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === 'true') {
      generateMockData(PROPERTY_DETAILS)
        .then((mockResponse: any) => {
          const data = mockResponse.data;
          setPropertyDetailsStoreValue(data.propertyDetails);
        })
        .catch((err: any) => {
          console.error("Error generating mock data:", err);
        });
    }
    else {
      fetchPropertyDetails();
      refetchCartList();
      // fetchCartItems();
    }

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
              <img src={propertyDetailsStoreValue?.thumbnailPath && propertyDetailsStoreValue?.thumbnailPath !== "null" ? propertyDetailsStoreValue?.thumbnailPath : NoImage} className="img-fluid rounded-start property_img_fluid" alt="Property Image" />
              {propertyDetailsStoreValue?.specification?.playerSoftwareModule?.active ? (
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
                <p className="propert-details-refid" style={{ marginTop: '-20px', marginBottom: '40px' }}><small className="property-text-muted">{propertyDetailsStoreValue?.referenceId || "N/A"}</small></p>
                <div className="row">
                  <div className=" property-list-unstyled list-space">
                    <div className="row col-md-12 property-row-1 mb-3">
                      <div className="col-md-2 col-sm-6 property-column-1">
                        <p className="property-title-1">Size/resolution</p>
                        <p className="property-value-1">
                          {propertyDetailsStoreValue?.specification?.resolution1Width || "N/A"} x {propertyDetailsStoreValue?.specification?.resolution1Height || "N/A"}

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

                        {
                          propertyDetailsStoreValue?.specification?.contentApproval && (
                            ShowAddDeleteCartBtn(propertyDetailsStoreValue.displayName) ? (

                              <button
                                className="col-md-3 btn btn-primary propety-btn-primarys properties-btn w-100"
                                onClick={() => deleteCartItem(propertyDetailsStoreValue.displayName)}
                              >
                                <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                Delete
                              </button>
                            ) : (
                              <button
                                className="col-md-3 btn btn-primary propety-btn-primarys properties-btn w-100"
                                onClick={() => addToCart(propertyDetailsStoreValue)}
                              >
                                <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />Add to Cart
                              </button>
                            )
                          )
                        }

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

export default PropertyDetailsSummary;
