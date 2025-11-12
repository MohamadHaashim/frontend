import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import client from "../../../Graphql/apolloClient";
import { EXPLORE_PROPERTY_DETAILS } from "../../../Graphql/Queries";
import { GET_LANDING_EXPLORATION } from "../../../Graphql/PropertyListQueries";
import { format } from 'date-fns';

interface PropertyDetails {
    videoSupport: string[];
    imageSupport: string[];
    featureSupport: string[];
    audioSupport: string;
    audioFormats?: string[];
    formats: string;
    panelFormat?: string;
    panels: string[];
    ledPitch: null;
    playerSoftwareModule?: {
        description: string;

    };
    active: string;
    specification: {
        playerSoftware: string;
        contentApproval: string;
        screens: string;
        panel: string;
    }
    resolutionWidth: string;
    resolutionHeight: string;
    panelSize: string;

    billboardSize: string;
    exclusion?: string;
    sellAsNetwork?: string;
}

interface PropertyDetails_props {
    video_sup: Boolean
    play_soft: Boolean
    img_sup: Boolean
    audio_sup: Boolean
    fetaure_sup: Boolean
    panel_sup: Boolean
    no_of_panel: Boolean
    no_of_screen: Boolean
    lead_time: Boolean
    language_sup: Boolean
    resloution_size: Boolean
    video_audio_img_sup: Boolean
    content_approval: Boolean
    total_sql: Boolean
    exclusion: Boolean
    sell_netw: Boolean
}
const ExplorePropertyDetailsSpecification: React.FC<PropertyDetails_props> = ({
    video_sup,
    play_soft,
    img_sup,
    audio_sup,
    fetaure_sup,
    panel_sup,
    no_of_panel,
    no_of_screen,
    lead_time,
    language_sup,
    resloution_size,
    video_audio_img_sup,
    content_approval,
    total_sql,
    exclusion,
    sell_netw
}) => {
    const [redirect, setRedirect] = useState<string | null>(null);
    const [propertyDetailsStoreValue, setPropertyDetailsStoreValue] = useState<PropertyDetails[]>([]);
    const [formats, setFormats] = useState()
    const location = useLocation();
    const propertyDetailsValue = location.state?.propertyDetailsData || {};
    const currentpage = propertyDetailsValue?.currentPage || 0;
    const currentDate = new Date();
    const [startDate, setStartDate] = useState<Date>(propertyDetailsValue?.startDate || currentDate);
    const [endDate, setEndDate] = useState<Date>(propertyDetailsValue?.endDate || currentDate);
    const [loading, setLoading] = useState(false);
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const countryId = localStorage.getItem("countryId");
    const userId = localStorage.getItem("userId")
    console.log(propertyDetailsValue?.type, "type");

    const fetchPropertyDetailsSpecification = async () => {
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
                    const format = matchedBillboard.format;
                    setFormats(format)
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
        fetchPropertyDetailsSpecification();
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }


    return (

        <>
            {propertyDetailsStoreValue.map((val, ind) => (
                <div key={ind}>
                    <h5 className="property-head2">Video Specification</h5>
                    <div className="row">
                        {video_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Video support</p>
                                <p className="property-content-2">
                                    {Array.isArray(val.videoSupport) && val.videoSupport.length > 0
                                        ? val.videoSupport.join(", ")
                                        : 'N/A'}
                                </p>
                            </div>
                        )}

                        {img_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Image support</p>
                                <p className="property-content-2">
                                    {Array.isArray(val.imageSupport) && val.imageSupport.length > 0
                                        ? val.imageSupport.join(", ")
                                        : 'N/A'}
                                </p>
                            </div>
                        )}

                        {fetaure_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Feature support</p>
                                <p className="property-content-2">
                                    {Array.isArray(val.featureSupport) && val.featureSupport.length > 0
                                        ? val.featureSupport.join(", ")
                                        : 'N/A'}
                                </p>
                            </div>
                        )}

                        {audio_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Audio support</p>
                                <p className="property-content-2">
                                    {val.audioSupport === 'true' && Array.isArray(val.audioFormats) && val.audioFormats.length > 0
                                        ? val.audioFormats.join(', ')
                                        : 'N/A'}
                                </p>
                            </div>
                        )}

                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <p className="property-content-1">Panel format</p>
                            <p className="property-content-2">
                                {formats || 'N/A'}
                            </p>
                        </div>
                    </div>

                    <h5 className="property-head2">Board Specification</h5>
                    <div className="row">
                        {panel_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Number of panels</p>
                                <p className="property-content-2">
                                    {val?.specification?.panel || 'N/A'}
                                </p>
                            </div>
                        )}

                        {no_of_screen && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Number of screens</p>
                                <p className="property-content-2">
                                    {val?.specification?.screens || "N/A"}
                                </p>
                            </div>
                        )}

                        {lead_time && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Lead time (Days)</p>
                                <p className="property-content-2">{val.ledPitch || 'N/A'}</p>
                            </div>
                        )}

                        {play_soft && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Player Software</p>
                                <p className="property-content-2">
                                    {val?.specification?.playerSoftware || 'N/A'}
                                </p>
                            </div>
                        )}

                        {resloution_size && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Resolution (W X H)</p>
                                <p className="property-content-2">
                                    {val.resolutionWidth && val.resolutionHeight
                                        ? `${val.resolutionWidth} x ${val.resolutionHeight}`
                                        : 'N/A'}
                                </p>
                            </div>
                        )}

                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <p className="property-content-1">Size (W X H)</p>
                            <p className="property-content-2">
                                {val.panelSize || 'N/A'}
                            </p>
                        </div>

                        {language_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Language support</p>
                                <p className="property-content-2">{"N/A"}</p>
                            </div>
                        )}

                        {content_approval && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Content approval</p>
                                <p className="property-content-2">
                                    {val?.specification?.contentApproval ? "true" : "false"}
                                </p>
                            </div>
                        )}

                        {total_sql && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Total sqft</p>
                                <p className="property-content-2">{val.panelSize || 'N/A'}</p>
                            </div>
                        )}

                        {exclusion && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Exclusion</p>
                                <p className="property-content-2">{'N/A'}</p>
                            </div>
                        )}

                        {sell_netw && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Sell as network</p>
                                <p className="property-content-2">{"No"}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}


        </>

    );
}

export default ExplorePropertyDetailsSpecification;
