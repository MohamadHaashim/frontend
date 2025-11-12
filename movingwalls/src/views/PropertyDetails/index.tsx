import React, { Component, useEffect, useState } from "react";
import AuthLayout from "../../layouts/auth";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import BackIcon from "../../assets/images/back-icon.svg";
import './index.css';
import PropertyDetailsSummary from "../../components/property-details/summary";
import PropertyDetailsMap from "../../components/property-details/map";
import PropertyDetailsSpecification from "../../components/property-details/specification";
import PropertyDetailsAudience from "../../components/property-details/audience";
import PropertyDetailsGallery from "../../components/property-details/gallery";
import PropertyDetailsConfiguration from "../../components/property-details/configuration";
import PropertyDetailsYouMayLike from "../../components/property-details/you-may-like";
import { useQuery } from "@apollo/client";
import { GET_MY_CART_ITEMS } from "../../Graphql/cartQueries";
import { format } from 'date-fns';
import { CART_PAGE_ITEM } from "../../Graphql/Queries";


interface FormState {
    redirect: string | null,
}

const PropertyDetails: React.FC<{ currencyCode: any }> = ({ currencyCode }) => {
    const [localCurrencyCode, setLocalCurrencyCode] = useState(currencyCode || "");
    useEffect(() => {
        if (!currencyCode) {
            const storedCurrencyCode = localStorage.getItem("currencyCode");
            if (storedCurrencyCode) {
                setLocalCurrencyCode(storedCurrencyCode);
            }
        }
    }, [currencyCode]);
    let storedCurrencyCodes = localStorage.getItem("currencyCode");
    const [redirect, setRedirect] = useState<string | null>(null);
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId")
    const [config, setConfig] = useState<any[]>([]);
    const location = useLocation();
    const propertyDetailsValue = location.state?.propertyDetailsData || {};
    const propertyDetailsType = location.state?.propertyDetailsData?.billboardType || {};
    const showSaveAndRequest = location.state?.showSaveAndRequest || {};
    const showExpoPro = location.state?.showExpoPro || false;
    const { loading: loadingCartList, error: errorCartList, data: dataCartList, refetch: refetchCartList } = useQuery(CART_PAGE_ITEM, {
        variables: {
            accessToken: token,
            campaignId: propertyDetailsValue?.id || '',
            userId: userId,
            edit: false,
            startDate: format(propertyDetailsValue?.startDate, 'yyyy-MM-dd'),
            endDate: format(propertyDetailsValue?.endDate, 'yyyy-MM-dd'),
        }
    });
    // Fetch configuration data
    const fetchConfig = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
            const data = await response.json();
            const value = data.find((page: any) => page.name === "Property details");
            setConfig(value.configurations || []);
        } catch (error) {
            console.error("Error fetching configuration:", error);
        }
    };

    // const showSaveAndRequest1 = propertyDetailsValue?.showSaveAndRequest;


    const [startDate, setStartDate] = useState<Date>(() => {
        return propertyDetailsValue?.startDate ? new Date(propertyDetailsValue?.startDate) :
            new Date();
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        return propertyDetailsValue?.endDate ? new Date(propertyDetailsValue?.endDate) :
            new Date();
    });
    const [campaignName, setCampaignName] = useState<string>(
        propertyDetailsValue?.campaignName || 'Default Campaign'
    );
    const [state, setState] = useState<string>(
        propertyDetailsValue?.state || 'Default Campaign'
    );
    const [district, setDistrict] = useState<string>(
        propertyDetailsValue?.district || 'Default Campaign'
    );
    useEffect(() => {
        fetchConfig();
    }, []);

    // Check if a field is enabled
    const isFieldEnabled = (key: string) => {
        for (const section of config) {
            const field = section.fields.find((f: any) => f.key === key);
            if (field) {
                return field.default;
            }
        }
        // Default to true if key is not found
        return true;
    };
    const navigate = useNavigate();

    if (redirect) {
        return <Navigate to={redirect} />;
    }
    let backLink = "";
    if (showSaveAndRequest) {
        backLink = `${process.env.REACT_APP_BASE_PATH}/propertylist`;
    }
    const propertyDetails = true;
    const handleBackClick = () => {
        navigate(backLink, {
            state: {
                formData: { startDate, endDate, campaignName, state, district, propertyDetails, propertyDetailsType }
            }
        });
    };
    return (
        <AuthLayout>
            <>
                <div className="propery-light-skyblue">
                    <div className="container">
                        <div className="mt-2">
                            <div className="navbar-back-btn"><img alt="" src={BackIcon} /> <a onClick={handleBackClick}> Back</a></div>
                        </div>
                        <div className=" card border-0 my-4">
                            <div className="row g-0 property-main-row">
                                <div className="col-md-12 mb-4">

                                    <div className="row g-0 property-main-row">
                                        <PropertyDetailsSummary dataCartList={dataCartList} currencyCode={localCurrencyCode || storedCurrencyCodes} refetchCartList={refetchCartList} />
                                    </div>
                                </div>
                                <div className="container mt-0">
                                    <div className="row prop-loc-con property-main-row">
                                        <div className="col-md-12">
                                            <ul className="nav nav-tabs property-nav-tabs" id="propertyTab" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button className="tab nav-link active text-dark" id="location-tab" data-bs-toggle="tab"
                                                        data-bs-target="#location" type="button" role="tab" aria-controls="location"
                                                        aria-selected="true">Location
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link text-dark " id="specification-tab" data-bs-toggle="tab"
                                                        data-bs-target="#specification" type="button" role="tab"
                                                        aria-controls="specification" aria-selected="false">Specification
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link text-dark" id="audience-tab" data-bs-toggle="tab"
                                                        data-bs-target="#audience" type="button" role="tab" aria-controls="audience"
                                                        aria-selected="false">Audience
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link text-dark " id="gallery-tab" data-bs-toggle="tab"
                                                        data-bs-target="#gallery" type="button" role="tab" aria-controls="gallery"
                                                        aria-selected="false">Gallery
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link text-dark " id="configuration-tab" data-bs-toggle="tab"
                                                        data-bs-target="#configuration" type="button" role="tab"
                                                        aria-controls="configuration" aria-selected="false">Configuration
                                                    </button>
                                                </li>
                                            </ul>
                                            <div className="tab-content property-tab-content" id="propertyTabContent">
                                                <div className="tab-pane fade show active" id="location" role="tabpanel"
                                                    aria-labelledby="location-tab">
                                                    <PropertyDetailsMap currencyCode={localCurrencyCode || storedCurrencyCodes}
                                                        site_owner={isFieldEnabled("site owner")}
                                                        access={isFieldEnabled("access")}
                                                        facing={isFieldEnabled("facing")}
                                                        board_face={isFieldEnabled("board facing")}
                                                        site_address={isFieldEnabled("site address")}
                                                        category={isFieldEnabled("category")}
                                                        active={isFieldEnabled("active")}
                                                        billBoard_type={isFieldEnabled("billboard type")}
                                                        available={isFieldEnabled("availability")}
                                                    />
                                                </div>
                                                <div className="tab-pane fade" id="specification" role="tabpanel"
                                                    aria-labelledby="specification-tab">
                                                    <PropertyDetailsSpecification
                                                        video_sup={isFieldEnabled("video support")}
                                                        play_soft={isFieldEnabled("PlaySoftware")}
                                                        img_sup={isFieldEnabled("image support")}
                                                        audio_sup={isFieldEnabled("audio support")}
                                                        fetaure_sup={isFieldEnabled("feature support")}
                                                        panel_sup={isFieldEnabled("panel format")}
                                                        no_of_panel={isFieldEnabled("number of panels")}
                                                        no_of_screen={isFieldEnabled("number of screens")}
                                                        lead_time={isFieldEnabled("lead time(Days)")}
                                                        language_sup={isFieldEnabled("language support")}
                                                        resloution_size={isFieldEnabled("resolution/size")}
                                                        video_audio_img_sup={isFieldEnabled("video/audio/image Support")}
                                                        content_approval={isFieldEnabled("content approval")}
                                                        total_sql={isFieldEnabled("total Sqft")}
                                                        exclusion={isFieldEnabled("exclusion")}
                                                        sell_netw={isFieldEnabled("sell as network")} />
                                                </div>
                                                <div className="tab-pane fade" id="audience" role="tabpanel" aria-labelledby="audience-tab">
                                                    <PropertyDetailsAudience
                                                        impressions={isFieldEnabled("impressions")}
                                                        reach={isFieldEnabled("reach")}
                                                        averageFrequency={isFieldEnabled("average frequency")}
                                                        audienceSegment={isFieldEnabled("audience segment")}
                                                    />
                                                </div>
                                                <div className="tab-pane fade" id="gallery" role="tabpanel" aria-labelledby="gallery-tab">
                                                    <PropertyDetailsGallery
                                                        assest_img={isFieldEnabled("gallery")}
                                                    />
                                                </div>
                                                <div className="tab-pane fade" id="configuration" role="tabpanel"
                                                    aria-labelledby="configuration-tab">
                                                    <PropertyDetailsConfiguration
                                                        spot_dur={isFieldEnabled("spot duration")}
                                                        spot_hour={isFieldEnabled("spots/hour")}
                                                        max_spot_day={isFieldEnabled("max. Spot/Day")}
                                                        min_spot_day={isFieldEnabled("min. Spot/Day")}
                                                        loop_dur={isFieldEnabled("loop duration")}
                                                        opertion_hours={isFieldEnabled("operations hours")}
                                                        no_clients_hour={isFieldEnabled("no.of Clients per Hour")}
                                                        mode_of_oper={isFieldEnabled("mode of operation")}
                                                        program_enable={isFieldEnabled("programmatic enabled")}
                                                        timezone={isFieldEnabled("timezone")}
                                                        exposure={isFieldEnabled("exposure")}
                                                        near_by_poi={isFieldEnabled("near by POI")}
                                                        avail_days={isFieldEnabled("available days")}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container mt-4">
                                    <PropertyDetailsYouMayLike dataCartList={dataCartList} currencyCode={localCurrencyCode || storedCurrencyCodes} refetchCartList={refetchCartList} />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </>
        </AuthLayout>
    );
}

export default PropertyDetails;
