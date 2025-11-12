import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import client from "../../../Graphql/apolloClient";
import { PROPERTY_DETAILS } from "../../../Graphql/Queries";
import Image2 from "../../../assets/images/group-212840670.svg";
import Image3 from "../../../assets/images/photo-1639054515827-41fb52f3058d.avif";
import Image9 from "../../../assets/images/group-21.svg";
import { useMutation } from "@apollo/client";
import { ADD_TO_CART_SUBMIT, DELETE_CART_SUBMIT } from "../../../Graphql/cartQueries";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import NoImage from "../../../assets/images/nomedia.jpg";

interface PropertyDetails {
    displayName: string;
    id: string;
    sellingRate: {
        daily: number;
        monthly: {
            month1: string;
        }
    };
    monthlySummary: {
        totalVisitors: number;
    }
    stateName: string;
    price: {
        openAuctionCurrency: string;
    }
    specification: {
        screens: number;
        resolution1Height: string;
        resolution1Width: string;
        contentApproval: boolean;
        playerSoftwareModule: {
            active: boolean
        }
    }
    nextAvailableDate: string | number | null;
    thumbnailPath: string;

}

interface PropertyDetailsYouMayLike {
    dataCartList: any;
    currencyCode: any;
    refetchCartList: () => void;
}
const PropertyDetailsYouMayLike: React.FC<PropertyDetailsYouMayLike> = ({
    dataCartList,
    currencyCode,
    refetchCartList,
}) => {
    const [redirect, setRedirect] = useState<string | null>(null);
    const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
    const location = useLocation();
    const propertyDetailsValue = location.state?.propertyDetailsData || {};
    const [addtoCartQuery] = useMutation(ADD_TO_CART_SUBMIT);
    const [deleteCartQuery] = useMutation(DELETE_CART_SUBMIT);
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const currentDate = new Date();
    const [campaignName, setCampaignName] = useState<string | null>(propertyDetailsValue?.campaignName);
    const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
    const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
    const [isInCart, setIsInCart] = useState(false);
    const [billBoardData, setBillBoardData] = useState<any>([]);
    const [cartData, setCartData] = useState<any>([{}]);
    // useEffect(() => {
    //     if (dataCartList && propertyDetailsStoreValue) {
    //         const cartDataList = dataCartList?.cartPageItem;
    //         setCartData(cartDataList);

    //         const resultObj = propertyDetailsStoreValue[0]; // Assuming you want to access the first object in the array
    //         const cartObj = cartDataList[0]?.campaignInventories;

    //         if (resultObj && cartObj.length > 0) {
    //             cartObj.forEach((cartItem: any) => {
    //                 // Match cart item name with display name
    //                 if (cartItem.billboardName === resultObj.displayName) {

    //                     const updatedBillBoardData = [resultObj].map((obj: { id: any }) => {
    //                         if (obj.id === cartItem.cartItemId) {
    //                             return { ...obj, isInCart: true };
    //                         } else {
    //                             return { ...obj, isInCart: false };
    //                         }
    //                     });

    //                     setBillBoardData(updatedBillBoardData);
    //                 }
    //             });
    //         }
    //     }
    // }, [dataCartList, propertyDetailsStoreValue]);
    useEffect(() => {
        if (dataCartList && propertyDetailsStoreValue[0]) {
            const cartDataList = dataCartList?.cartPageItem[0]?.campaignInventories || [];
            setCartData(cartDataList);
        }
    }, [dataCartList, propertyDetailsStoreValue]);

    const fetchPropertyDetailsYouMayLike = async () => {
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
        fetchPropertyDetailsYouMayLike();
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    const addToCart = async (items: any[] | any) => {
        const itemsArray = Array.isArray(items) ? items : [items];

        console.log(itemsArray);


        console.log(itemsArray.map((item: any) => (item.panelHeight)));

        const formattedItems = itemsArray.map(itemData => {
            console.log("Item Data:", itemData);  // Ensure the data is correct

            const cartItemResolution = itemData.cartItemResolution || (
                itemData.cartItemType === 'CLASSIC'
                    ? `${itemData.specification.panelHeight && itemData.specification.panelWidth ? itemData.specification.panelHeight + 'x' + itemData.specification.panelWidth : 'Default Resolution'}`
                    : `${itemData.specification.resolution1Height && itemData.specification.resolution1Width
                        ? itemData.specification.resolution1Height + 'x' + itemData.specification.resolution1Width
                        : 'Default Resolution'}`
            );

            console.log("Resolved Resolution:", cartItemResolution);




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

    const deleteCartItem = async (itemData: any) => {

        const matchingCartItem = cartData.find((cartItem: any) => cartItem.billboardName === itemData);


        if (!matchingCartItem) {
            toast.error("Item not found in cart.");
            return;
        }

        // Extract cartItemId from the matching cart item
        const cartItemId = matchingCartItem.cartItemId;
        if (propertyDetailsStoreValue.length > 0 && propertyDetailsStoreValue[0].displayName === itemData) {
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
        let status = false;
        cartData.forEach((cartItem: any) => {
            if (curObj === cartItem.billboardName) {
                status = true;
            }
        });
        return status;
    };


    return (
        <>
            <div className="col-md-12 cart-you-may-like">
                <div className="card-head-line">
                    <h5>You may also like these properties</h5>
                </div>
                {propertyDetailsStoreValue.map((val, ind) => (
                    <div className="row" key={ind}>
                        <div className="col-md-4">
                            <div className="card props-hover mb-3 border-0">
                                <img src={val.thumbnailPath && val.thumbnailPath !== "null" ? val.thumbnailPath : NoImage} className="card-img-top"
                                    alt={val.displayName || "Property Image"} />

                                {val?.specification?.playerSoftwareModule?.active ? (
                                    <span className="badge badge-success status-label props-status-label bg-light text-success">
                                        <i className="fa-solid fa-circle"></i> Available
                                    </span>
                                ) : (
                                    <span className="badge badge-danger status-label props-status-label bg-light text-danger">
                                        <i className="fa-solid fa-circle"></i> Sold Out
                                    </span>
                                )}

                                <div className="card-img-overlay card-img-overlay-custom">
                                    {
                                        // val?.specification?.playerSoftwareModule?.active && (
                                        val?.specification?.contentApproval && (
                                            ShowAddDeleteCartBtn(val.displayName) ? (

                                                <button
                                                    className="btn btn-danger propety-btn-danger"
                                                    onClick={() => deleteCartItem(val.displayName)}
                                                >
                                                    <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                                    Delete
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary propety-btn-primary w-100"
                                                    onClick={() => addToCart(val)}
                                                >
                                                    <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                                    Add to Cart
                                                </button>
                                            )
                                        )
                                    }
                                    <a href="#" className="btn text-light mt-2 border-0">View details</a>
                                </div>
                                <div className="property-card-body property-card-3">
                                    <div className="d-flex m-0">
                                        <h6 className="property-card-title3">{val.displayName}</h6>
                                        <p className="property-card-text-3">{val.stateName || "N/A"}</p>
                                    </div>
                                    <p className="property-card-text-4">{currencyCode} {val.sellingRate?.monthly?.month1 ? `${val.sellingRate?.monthly?.month1}.00` : "N/A"}</p>
                                    <div className="list-unstyled">
                                        <div className="row property-row-3">
                                            <div className="column property-column-3">
                                                <p className="title-msg property-title-msg">Site resolution</p>
                                                <p className="value  property-title-value">{val.specification?.resolution1Width || "N/A"} x {val.specification?.resolution1Height || "N/A"} </p>
                                            </div>
                                            <div className="column property-column-3">
                                                <p className="title-msg property-title-msg">Number of screens</p>
                                                <p className="value  property-title-msg">{val.specification?.screens || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="row property-row-3">
                                            <div className="column property-column-3">
                                                <p className="title-msg property-title-msg">Impressions</p>
                                                <p className="value  property-title-msg">{val.monthlySummary?.totalVisitors || "N/A"}</p>
                                            </div>
                                            <div className="column  property-column-3">
                                                <p className="title-msg property-title-msg">Next available slot</p>
                                                <p className="value  property-title-msg">{val.nextAvailableDate || "N/A"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </>
    );
}

export default PropertyDetailsYouMayLike;
