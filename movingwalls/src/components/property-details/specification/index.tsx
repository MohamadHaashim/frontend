import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import client from "../../../Graphql/apolloClient";
import { PROPERTY_DETAILS } from "../../../Graphql/Queries";
import { generateMockData } from "../../../Graphql/MockData";
interface PropertyDetails {
    videoSupport: string[];
    imageSupport: string[];
    featureSupport: string[];
    audioSupport: string;
    audioFormats?: string[];
    format: string;
    panelFormat?: string;
    panels: string[];
    ledPitch: null;
    playerSoftwareModule?: {
        description: string;
        active: string;
    };
    resolution1Width: string;
    resolution1Height: string;
    panel1Size: string;
    screens: string;
    panel: string;
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
const PropertyDetailsSpecification: React.FC<PropertyDetails_props> = ({
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
    const [format, setFormat] = useState()
    const location = useLocation();
    const propertyDetailsValue = location.state?.propertyDetailsData || {};


    const fetchPropertyDetailsSpecification = async () => {
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
            setPropertyDetailsStoreValue([data.propertyDetails.specification]);
            const format = data.propertyDetails.format;
            setFormat(format)

        } catch (error) {
            console.error("Error fetching property details:", error);
        }
    }

    useEffect(() => {
        if (process.env.REACT_APP_MOCK_DATA === 'true') {
            generateMockData(PROPERTY_DETAILS)
                .then((mockResponse: any) => {
                    const data = mockResponse.data;
                    setPropertyDetailsStoreValue([data.propertyDetails.specification]);
                })
                .catch((err: any) => {
                    console.error("Error generating mock data:", err);
                });
        }
        else {
            fetchPropertyDetailsSpecification();
        }
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
                        {panel_sup && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Panel format</p>
                                <p className="property-content-2">
                                    {format || 'N/A'}
                                </p>
                            </div>
                        )}
                    </div>

                    <h5 className="property-head2">Board Specification</h5>
                    <div className="row">

                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <p className="property-content-1">Number of panels</p>
                            <p className="property-content-2">
                                {val.panel || 'N/A'}
                            </p>
                        </div>


                        {no_of_screen && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Number of screens</p>
                                <p className="property-content-2">
                                    {val.screens || "N/A"}
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
                                    {val.playerSoftwareModule?.description || 'Broadsign'}
                                </p>
                            </div>
                        )}

                        {resloution_size && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Resolution (W X H)</p>
                                <p className="property-content-2">
                                    {val.resolution1Width && val.resolution1Height
                                        ? `${val.resolution1Width} x ${val.resolution1Height}`
                                        : 'N/A'}
                                </p>
                            </div>
                        )}

                        <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                            <p className="property-content-1">Size (W X H)</p>
                            <p className="property-content-2">
                                {val.panel1Size || '3.0 ft X 6.0 ft'}
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
                                    {val.playerSoftwareModule?.active ? "true" : "false"}
                                </p>
                            </div>
                        )}

                        {total_sql && (
                            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
                                <p className="property-content-1">Total sqft</p>
                                <p className="property-content-2">{val.panel1Size || 'N/A'}</p>
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

export default PropertyDetailsSpecification;
