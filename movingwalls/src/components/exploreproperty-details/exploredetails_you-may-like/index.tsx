import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import client from "../../../Graphql/apolloClient";
import { EXPLORE_PROPERTY_DETAILS } from "../../../Graphql/Queries";
import Image2 from "../../../assets/images/group-212840670.svg";
import Image3 from "../../../assets/images/photo-1639054515827-41fb52f3058d.avif";
import Image9 from "../../../assets/images/group-21.svg";
import { useMutation } from "@apollo/client";
import { format } from 'date-fns';
import { toast } from "react-toastify";
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";
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
        playerSoftwareModule: {
            active: boolean
        }
    }
    nextAvailableDate: string | number | null;
    thumbnailPath: string;
    active: boolean;

}

interface PropertyDetailsYouMayLike {
    dataCartList: any;
    currencyCode: any;
    refetchCartList: () => void;
    setCartCount: React.Dispatch<React.SetStateAction<number>>;
    cartCount: number;
}
const ExplorePropertyDetailsYouMayLike: React.FC<PropertyDetailsYouMayLike> = ({
    dataCartList,
    currencyCode,
    refetchCartList,
    setCartCount, cartCount,
}) => {
    const [redirect, setRedirect] = useState<string | null>(null);
    const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
    const location = useLocation();
    const propertyDetailsValue = location.state?.propertyDetailsData || {};
    const matchBillId = propertyDetailsValue?.tobillBoard || [];
    const currentpage = propertyDetailsValue?.currentPage || 0;
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const countryId = localStorage.getItem("countryId");
    const currentDate = new Date();
    const [campaignName, setCampaignName] = useState<string | null>(propertyDetailsValue?.campaignName);
    const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
    const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
    const [isInCart, setIsInCart] = useState(false);
    const [billBoardData, setBillBoardData] = useState<any>([]);
    const [cartData, setCartData] = useState<any>([{}]);
    const [addedBillboardIds, setaddBillboardIds] = useState<string[]>([]);
    // const [cartCount, setCartCount] = useState(0);
    useEffect(() => {
        if (dataCartList && propertyDetailsStoreValue) {
            const cartDataList = dataCartList.cartpageItem;
            setCartData(cartDataList);

            const resultObj = propertyDetailsStoreValue[0]; // Assuming you want to access the first object in the array
            const cartObj = cartDataList;

            if (resultObj && cartObj.length > 0) {
                cartObj.forEach((cartItem: any) => {
                    // Match cart item name with display name
                    if (cartItem.cartItemName === resultObj.displayName) {

                        const updatedBillBoardData = [resultObj].map((obj: { id: any }) => {
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

    const fetchPropertyDetailsYouMayLike = async () => {
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
            console.log('====================================');
            console.log(propertyDetails, "lkjhgfdsasdfghgfdghjh");
            console.log('====================================');
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

                }
            }
        } catch (error) {
            console.error("Error fetching billboard list:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropertyDetailsYouMayLike();
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    const addToCart = (itemData: any) => {
        try {
            const storedBillboardIds = localStorage.getItem('addedBillboardIds');
            let addedBillboardIds = [];
            if (storedBillboardIds) {
                try {
                    addedBillboardIds = JSON.parse(storedBillboardIds);
                    addedBillboardIds = addedBillboardIds.filter((id: any) => typeof id === 'string' && id.trim() !== '');
                } catch (e) {
                    console.error('Error parsing addedBillboardIds, clearing invalid data.');
                    addedBillboardIds = [];
                }
            }
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
                                <img src={val.thumbnailPath && val.thumbnailPath !== "null" && val.thumbnailPath.trim() !== "" ? val.thumbnailPath : NoImage} className="card-img-top"
                                    alt={val.displayName || "Property Image"} />

                                {val?.active ? (
                                    <span className="badge badge-success status-label props-status-label bg-light text-success">
                                        <i className="fa-solid fa-circle"></i> Available
                                    </span>
                                ) : (
                                    <span className="badge badge-danger status-label props-status-label bg-light text-danger">
                                        <i className="fa-solid fa-circle"></i> Sold Out
                                    </span>
                                )}

                                <div className="card-img-overlay card-img-overlay-custom">
                                    {val?.active && (
                                        <>
                                            {(() => {
                                                const storedIdsString = localStorage.getItem("addedBillboardIds");
                                                const storedIds = storedIdsString ? JSON.parse(storedIdsString) : [];
                                                const isInCart = storedIds.includes(val.id) || matchBillId.includes(val.id);

                                                if (isInCart) {
                                                    return (
                                                        <button
                                                            className="btn btn-danger propety-btn-danger"
                                                            onClick={() => deleteCartItem(val)}
                                                        >
                                                            <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                                            Delete
                                                        </button>
                                                    );
                                                } else {
                                                    return (
                                                        <button
                                                            className="btn btn-primary propety-btn-primary w-100"
                                                            onClick={() => addToCart(val)}
                                                        >
                                                            <img className="detaillocation-frame-inner property-logo-img" alt="" src={Image9} />
                                                            Add to Cart
                                                        </button>
                                                    );
                                                }
                                            })()}
                                        </>
                                    )}
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

export default ExplorePropertyDetailsYouMayLike;
