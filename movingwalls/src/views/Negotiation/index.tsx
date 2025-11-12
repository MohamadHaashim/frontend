import React, { Component, useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import BackIcon from "../../assets/images/back-icon.svg";
import BillboardLogo from "../../assets/images/DSC_7293-17169.jpg";
import BillboardLogo1 from "../../assets/images/132566552488339083.jpg";
import BillboardLogo2 from "../../assets/images/photo-1639054515827-41fb52f3058d.avif";
import './index.css'
import { GET_PROPERTY_DETAILS, NEGOTIATE_CAMPAIGN_QUERY, NEGOTIATE_CAMPAIGN_SEND_REQUEST, PROPERTY_DETAILS } from "../../Graphql/Queries";
import { useMutation, useQuery } from "@apollo/client";
import noImage from "../../assets/images/nomedia.jpg"
import { toast } from "react-toastify";
import { log } from "node:console";

interface FormState {
    redirect: string | null,
}
interface Currency {
    country: string;
    symbol: string;
    code: string;
}
interface InputValues {
    [key: string]: string;
}


interface Tax {
    name: string;
    value: number;
    percent: number;
}

interface NegotiationSummaryType {
    status: string;
    summaryReport: number;
}

interface PriceSummary {
    subTotal: number;
    netTotal: number;
    currency?: Currency;
    tax: Tax;
    pcrEnable: boolean;
    summaryReport: number;
    status: string;
}


type NegotiationSummary = {
    mediaOwnerPreferredPrice: {
        totalPrice: number;
        status: string;
    };

};

interface Billboard {
    inventoryId: any;
    map(arg0: (billboardId: any) => {
        billboardId: any;
        negotiationSummary: { buyerPreferredPrice: { totalPrice: number; savingsPrice: number; savingsPerc: number; nowPayPrice: number; }; mediaOwnerPreferredPrice: { totalPrice: number; savingsPrice: number; savingsPerc: number; nowPayPrice: number; }; contentManagementFeePerc: number; platformFeePerc: number; taxPerc: number; discountPerc: number; customFees: never[]; summaryReport: { potentialViews: number; uniqueReach: number; }; status: string; accountType: string; requestFrom: string; };
    }): unknown;
    priceSummary: any;
    id: number;

    inventoryThumbnailUrl: string | undefined;
    inventoryName: string;
    inventoryType: string;
    negotiationSummary: {
        status: string;
        summaryReport: {
            potentialViews: { toLocaleString: () => string };
            uniqueReach: { toLocaleString: () => string };
        };
        mediaOwnerPreferredPrice: {
            nowPayPrice: any;
            totalPrice: number;
        };
        buyerPreferredPrice: {
            nowPayPrice: any;
            totalPrice: number;
        };
    };
}

interface Inventory {
    negotiationSummary: NegotiationSummary;

}

interface NegotiationDateFormat {
    date: string;
    dateStr: string;
    dateFmt: string;
    __typename: string;
}

interface CampaignData {
    priceSummary?: PriceSummary;
    name?: string;
    summaryReport?: {
        potentialViews?: number;
        uniqueReach?: number;
        averageFrequency?: number;
    };
    // priceSummary?: {
    //     netTotal?: number;
    // };
    duration?: string;
    startDate: NegotiationDateFormat;
    endDate: NegotiationDateFormat;
    date: number;
    status: string;
    // Updated negotiationSummary type to correctly define 'mediaOwnerPreferredPrice'
    negotiationSummary?: {
        mediaOwnerPreferredPrice: {
            totalPrice: number;
        };
    };

    mediaOwnerPreferredPrice?: {
        totalPrice: number;
    };
}


interface PropertyDetails {
    referenceId: string;
    latitude: number;
    longitude: number;
    name: string;
    displayName: string;
    price: Price;
}

interface PropertyResponse {
    propertyDetails: PropertyDetails;
}

interface Price {
    contentFrequencyPerHour: string | null;
    maximumSpotDurationPerDay: string | null;
    minimumSpotDurationPerDay: string | null;
}


const NegotiateCampaign: React.FC<{ currencyCode: any }> = ({ currencyCode }) => {
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
    const token = localStorage.getItem('authToken');
    const selectedCampaignId = localStorage.getItem('selectedCampaignId');
    const [value, setValue] = useState<CampaignData | null>(null);

    const [inputValue, setInputValue] = useState('');

    const [date, setDate] = useState('')
    const [propertyValue, setPropertyValue] = useState<PropertyDetails | null>(null);

    const companyId = process.env.REACT_APP_COMPANY_ID;
    const countryId = localStorage.getItem('countryId');
    const [selectedBillboard, setSelectedBillboard] = useState<Billboard | null>(null);
    const [selectedBillboardType, setSelectedBillboardType] = useState('digital');

    const [redirect, setRedirect] = useState<string | null>(null);






    // useEffect(() => {
    //     if (selectedBillboard?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice !== null) {
    //         setInputValue(selectedBillboard?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice.toFixed(2));
    //     }
    // }, [selectedBillboard]);



    const { loading, error, data, refetch: refetchList } = useQuery(NEGOTIATE_CAMPAIGN_QUERY, {
        variables: {
            accessToken: token,
            campaignId: selectedCampaignId,
        },
    });
    useEffect(() => {
        if (data && data.negotiateCampaign) {
            setValue(data.negotiateCampaign);
        }
        refetchList()
    }, [data, refetchList]);


    const negotiation = data?.negotiateCampaign;
    const currencyCodes = localCurrencyCode || storedCurrencyCodes;
    useEffect(() => {
        if (negotiation?.startDate?.date && negotiation?.endDate?.date) {
            const startDate = new Date(negotiation.startDate.date);
            const endDate = new Date(negotiation.endDate.date);

            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                const differenceInMillis = endDate.getTime() - startDate.getTime();
                const totalDays = Math.ceil(differenceInMillis / (1000 * 3600 * 24));
                setDate(`${totalDays}`);
            } else {
                console.error('Invalid startDate or endDate');
                setDate('Invalid Date');
            }
        } else {
            console.error('startDate or endDate is missing');
            setDate('Missing Date');
        }
    }, [negotiation]);


    const isMatchingCampaign = negotiation && negotiation?.id;
    const digitalBillboards: Billboard[] = isMatchingCampaign
        ? negotiation?.campaignInventories.filter((inventory: Billboard) => inventory.inventoryType === 'digital')
        : [];
    const classicBillboards: Billboard[] = isMatchingCampaign
        ? negotiation?.campaignInventories.filter((inventory: Billboard) => inventory.inventoryType === 'classic')
        : [];


    // Multiple to Total ad plays value
    const duration = parseInt(date, 10);
    const totalAdPlays =
        !isNaN(duration) && propertyValue?.price?.contentFrequencyPerHour
            ? duration * parseFloat(propertyValue.price.contentFrequencyPerHour || '0')
            : 'N/A';
    // Property details Query
    const { data: property, refetch } = useQuery(PROPERTY_DETAILS, {
        variables: {
            accessToken: token,
            id: selectedBillboard?.inventoryId,
            companyId: companyId,
            countryId: countryId,
            billboardType: selectedBillboardType,

        },
        skip: !token,
    });



    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return dateString;
        }
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-GB', options);
    }


    useEffect(() => {
        if (property && property?.propertyDetails) {
            setPropertyValue(property?.propertyDetails);
        }
    }, [property]);

    const [inputValues, setInputValues] = useState<InputValues>({});
    const [highlightedId, setHighlightedId] = useState<number | null>(null);

    const handleBillboardClick = (inventory: any) => {
        setHighlightedId(inventory.inventoryId);
        setSelectedBillboard(inventory);
    };

    useEffect(() => {
        if (selectedBillboard) {
            const nowPayPrice = selectedBillboard?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice;
            const inputValue = nowPayPrice != null ? nowPayPrice.toFixed(2) : '';

            setInputValues((prevValues) => ({
                ...prevValues,
                [String(selectedBillboard.inventoryId)]: prevValues[String(selectedBillboard.inventoryId)] || inputValue,  // Ensure it's a string key
            }));
        }
    }, [selectedBillboard]);



    const handleInputChange = (e: { target: { value: string } }, billboardId: string) => {
        const value = e.target.value.replace(`${currencyCodes}`, '').trim();
        const numericValue = parseFloat(value);
        setInputValues((prevValues) => {
            const updatedValues = {
                ...prevValues,
                [billboardId]: isNaN(numericValue) ? '' : value,
            };
            return updatedValues;
        });
    };











    const [negotiate, { loading: sendRequest, error: sendError }] = useMutation(NEGOTIATE_CAMPAIGN_SEND_REQUEST);

    const handleClick = async () => {
        const token = localStorage.getItem('authToken');
        const selectedCampaignId = localStorage.getItem('selectedCampaignId');

        const selectedBillboardId = String(selectedBillboard?.inventoryId || '');
        const enteredPrice = parseFloat(inputValues[selectedBillboardId] || '0.00');

        const negotiationData = {
            duration: duration,
            billboards: negotiation.campaignInventories.map((billboard: any) => {
                const currentBillboardId = String(billboard.inventoryId);
                const isSelectedBillboard = currentBillboardId === selectedBillboardId;

                // Ensure enteredPrice is always used for the selected billboard
                const enteredPriceForBillboard = isSelectedBillboard
                    ? enteredPrice
                    : parseFloat(inputValues[currentBillboardId] || '') || billboard.negotiationSummary.buyerPreferredPrice.nowPayPrice;

                return {
                    billboardId: currentBillboardId,
                    negotiationSummary: {
                        buyerPreferredPrice: {
                            totalPrice: parseFloat(billboard.negotiationSummary.buyerPreferredPrice.totalPrice || '0.0'),
                            savingsPrice: 0,
                            savingsPerc: 0,
                            dailyPrice: parseFloat(billboard.negotiationSummary.buyerPreferredPrice.dailyPrice || '0.0'),
                            nowPayPrice: enteredPriceForBillboard,
                        },
                        mediaOwnerPreferredPrice: {
                            totalPrice: parseFloat(billboard.negotiationSummary.mediaOwnerPreferredPrice.totalPrice || '0.0'),
                            savingsPrice: 0,
                            savingsPerc: 0,
                            dailyPrice: parseFloat(billboard.negotiationSummary.mediaOwnerPreferredPrice.dailyPrice || '0.0'),
                            nowPayPrice: parseFloat(billboard.negotiationSummary.mediaOwnerPreferredPrice.nowPayPrice || '0.0'),
                        },
                        contentManagementFeePerc: 0,
                        platformFeePerc: 15,
                        taxPerc: Math.floor(billboard?.negotiationSummary?.taxPerc || 0),
                        discountPerc: 0,
                        customFees: [],
                        summaryReport: {
                            potentialViews: parseInt(billboard.negotiationSummary?.summaryReport?.potentialViews || '0', 10),
                            uniqueReach: parseInt(billboard.negotiationSummary?.summaryReport?.uniqueReach || '0', 10),
                        },
                        status: "PENDING",
                        accountType: "EXTERNAL",
                        requestFrom: "",
                    },
                };
            }),
        };

        try {
            const { data, errors } = await negotiate({
                variables: { negotiationData, accessToken: token, campaignId: selectedCampaignId },
            });

            if (errors) {
                console.error('GraphQL Errors:', errors);
            } else {
                const negotiationResponse = data.negotiate?.response;
                if (negotiationResponse?.success) {
                    toast.success(negotiationResponse.message);
                    setRedirect(`${process.env.REACT_APP_BASE_PATH}/my-campaigns`);
                } else {
                    console.error('Negotiation failed:', negotiationResponse?.message || 'Unknown error');
                    toast.error('Negotiation failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Network or unexpected error:', error);
            toast.error('An error occurred. Please try again.');
        }
    };


    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <AuthLayout>
            <div className="negotiation-full-content">
                <div className="container">
                    <div className="mt-4">
                        <div className="navbar-back-btn"><img alt="" src={BackIcon} /> <Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`} >Back</Link></div>
                    </div>

                    <div className="card card-bottom p-4">
                        {loading ? (
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                                <span className="loading-circle sp1">
                                    <span className="loading-circle sp2">
                                        <span className="loading-circle sp3"></span>
                                    </span>
                                </span>
                            </div>
                        ) : negotiation.length === 0 ? (
                            <div style={{ textAlign: "center", marginTop: "20px" }}>
                                <h5>No data found</h5>
                            </div>
                        ) : (
                            <div className="row">
                                <div className="col-md-8 invoice-full-page-right-side">
                                    <div>
                                        <div className="row">
                                            <h4 className="col-12 negotiate-header mb-4">Negotiate Campaign</h4>

                                            {isMatchingCampaign && (
                                                <div className="row negotiate-campaign-container">
                                                    <div className="col-md-2">
                                                        <p className="negotiate-field-name">Campaign Name (?)</p>
                                                        <p className="negotiate-field-value">{value?.name || 'No name available'}</p>
                                                    </div>

                                                    <div className="col-md-2">
                                                        <p className="negotiate-field-name">Potential Views (?)</p>
                                                        <p className="negotiate-field-value">
                                                            {value?.summaryReport?.potentialViews?.toLocaleString() || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className="col-md-2">
                                                        <p className="negotiate-field-name">Unique Reach (?)</p>
                                                        <p className="negotiate-field-value">
                                                            {value?.summaryReport?.uniqueReach?.toLocaleString() || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className="col-md-2">
                                                        <p className="negotiate-field-name">Average Frequency (?)</p>
                                                        <p className="negotiate-field-value">
                                                            {value?.summaryReport?.averageFrequency?.toFixed(2) || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className="col-md-2">
                                                        <p className="negotiate-field-name">Duration (?)</p>
                                                        <p className="negotiate-field-value negotiaition-duration">
                                                            {value?.startDate?.date && value?.endDate?.date ? (
                                                                <>
                                                                    <span className="date">{formatDate(value.startDate.date)} </span>


                                                                    <span className="date">{formatDate(value.endDate.date)}</span>
                                                                </>
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </p>
                                                    </div>


                                                    <div className="col-md-2">
                                                        <p className="negotiate-field-name">Net Total (?)</p>
                                                        <p className="negotiate-field-value">
                                                            {value?.priceSummary?.currency?.code || currencyCode} {value?.priceSummary?.netTotal !== undefined
                                                                ? `${value?.priceSummary?.netTotal.toFixed(2)}`
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>




                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            <hr className="my-4 nego-card_border_1" />
                                        </div>
                                    </div>

                                    <h4 className="nogosition_list_header">{digitalBillboards.length} Billboards</h4>

                                    <div className="negosition_table_container" id="style">
                                        <h6 className="nogosition_list_header_1">Digital billboards <span className="negosition_header_notification badge">{digitalBillboards.length}</span></h6>
                                        <div className="scrollbar">
                                            <table className="table table-hover">
                                                <thead className="table-head">
                                                    <tr>
                                                        <th scope="col" className="negosition_list_first_header">Billboard Name</th>
                                                        <th scope="col" className="negosition_list_first_header">Impressions</th>
                                                        <th scope="col" className="negosition_list_first_header">Unique Reach</th>
                                                        <th scope="col" className="negosition_list_first_header">Actual Price</th>
                                                        <th scope="col" className="negosition_list_first_header">Preferred Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {digitalBillboards.length > 0 ? (
                                                        digitalBillboards.map((inventory: Billboard) => {


                                                            return (
                                                                <tr key={inventory.id} onClick={() => handleBillboardClick(inventory)}
                                                                    className={`${highlightedId === inventory.inventoryId ? 'negotiation-highlighted' : ''}`}
                                                                >
                                                                    <td className="d-flex negosition-img">
                                                                        <img className="negosition_list_img" src={inventory?.inventoryThumbnailUrl && inventory?.inventoryThumbnailUrl !== "null" ? inventory?.inventoryThumbnailUrl : noImage} />
                                                                        <span className="negotiation-cnt">
                                                                            <b className="table-Sunnybank negosition_list_sunny">{inventory?.inventoryName}</b>
                                                                            <p className="table-available negosition_text_avail">
                                                                                {inventory?.negotiationSummary?.status || "Status not available"}
                                                                            </p>
                                                                        </span>
                                                                    </td>

                                                                    <td className="negosition_value_imp negosition-img">
                                                                        {inventory.negotiationSummary?.summaryReport?.potentialViews?.toLocaleString() ?? 'N/A'}
                                                                    </td>
                                                                    <td className="negosition_value_imp negosition-img">
                                                                        {inventory.negotiationSummary?.summaryReport?.uniqueReach?.toLocaleString() ?? 'N/A'}
                                                                    </td>
                                                                    <td className="negosition_value_imp negosition-img">
                                                                        {currencyCodes} {inventory.negotiationSummary?.mediaOwnerPreferredPrice?.totalPrice.toFixed(2)}
                                                                    </td>

                                                                    <td className="negotiation_value_imp negosition-img">
                                                                        {highlightedId === inventory.inventoryId ? (
                                                                            // If the row is highlighted, show the value with "AUD" in front of it
                                                                            <span>
                                                                                {inputValues[inventory.inventoryId]
                                                                                    ? `${currencyCodes} ${inputValues[inventory.inventoryId]}`
                                                                                    : `${currencyCodes}` + (inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice != null
                                                                                        ? inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice.toFixed(2)
                                                                                        : 'N/A')}
                                                                            </span>
                                                                        ) : (
                                                                            <span>
                                                                                {inputValues[inventory.inventoryId]
                                                                                    ? `${currencyCodes} ${parseFloat(inputValues[inventory.inventoryId]).toFixed(2)}`
                                                                                    : inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice != null
                                                                                        ? `${currencyCodes} ${inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice.toFixed(2)}`
                                                                                        : 'N/A'}
                                                                            </span>
                                                                        )}
                                                                    </td>



                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={8} className="text-center">No billboards available.</td>
                                                        </tr>
                                                    )}
                                                </tbody>



                                            </table>
                                        </div>

                                        <h6 className="digital-billboards">Classic billboards <span className="negosition_header_notification badge">{classicBillboards.length}</span></h6>
                                        <div className="table-scroll">
                                            <table className="table table-hover">
                                                <thead className="table-head">
                                                    <tr>
                                                        <th scope="col" className="negosition_list_first_header">Billboard Name</th>
                                                        <th scope="col" className="negosition_list_first_header">Impressions</th>
                                                        <th scope="col" className="negosition_list_first_header">Unique Reach</th>
                                                        <th scope="col" className="negosition_list_first_header">Actual Price</th>
                                                        <th scope="col" className="negosition_list_first_header">Preferred Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {classicBillboards.length > 0 ? (
                                                        classicBillboards.map((inventory: Billboard) => {
                                                            return (
                                                                <tr key={inventory.id} onClick={() => handleBillboardClick(inventory)}
                                                                    className={`${highlightedId === inventory.inventoryId ? 'negotiation-highlighted' : ''}`}
                                                                >
                                                                    <td className="d-flex negosition-img">
                                                                        <img className="negosition_list_img" src={inventory?.inventoryThumbnailUrl && inventory?.inventoryThumbnailUrl !== "null" ? inventory?.inventoryThumbnailUrl : noImage} />
                                                                        <span className="negotiation-cnt">
                                                                            <b className="table-Sunnybank negosition_list_sunny">{inventory?.inventoryName}</b>
                                                                            <p className="table-available negosition_text_avail">
                                                                                {inventory?.negotiationSummary?.status || "Status not available"}
                                                                            </p>
                                                                        </span>
                                                                    </td>
                                                                    <td className="negosition_value_imp negosition-img">
                                                                        {inventory?.negotiationSummary?.summaryReport?.potentialViews?.toLocaleString() ?? 'N/A'}
                                                                    </td>
                                                                    <td className="negosition_value_imp negosition-img">
                                                                        {inventory?.negotiationSummary?.summaryReport?.uniqueReach?.toLocaleString() ?? 'N/A'}
                                                                    </td>
                                                                    <td className="negosition_value_imp negosition-img">
                                                                        {currencyCodes} {inventory?.negotiationSummary?.mediaOwnerPreferredPrice?.totalPrice.toFixed(2)}
                                                                    </td>

                                                                    <td className="negotiation_value_imp negosition-img">
                                                                        {highlightedId === inventory.inventoryId ? (
                                                                            // If the row is highlighted, show the value with "AUD" in front of it
                                                                            <span>
                                                                                {inputValues[inventory.inventoryId]
                                                                                    ? `${currencyCodes} ${inputValues[inventory.inventoryId]}`
                                                                                    : `${currencyCodes} ` + (inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice != null
                                                                                        ? inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice.toFixed(2)
                                                                                        : 'N/A')}
                                                                            </span>
                                                                        ) : (
                                                                            <span>
                                                                                {inputValues[inventory.inventoryId]
                                                                                    ? `${currencyCodes} ${parseFloat(inputValues[inventory.inventoryId]).toFixed(2)}`
                                                                                    : inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice != null
                                                                                        ? `${currencyCodes} ${inventory?.negotiationSummary?.buyerPreferredPrice?.nowPayPrice.toFixed(2)}`
                                                                                        : 'N/A'}
                                                                            </span>
                                                                        )}
                                                                    </td>

                                                                </tr>
                                                            );
                                                        })
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={8} className="text-center">No billboards available.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    <div>
                                        <div className="negosition_right_side_container_1">
                                            <div className="row">
                                                <div style={{ textAlign: 'center' }} className="col-md-12">
                                                    <p>Sports / Hour : {propertyValue?.price?.contentFrequencyPerHour ?? 'N/A'}</p>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12 negosition_right_inside_container_1">
                                                        <p>Daily Ad Plays: {
                                                            Number(propertyValue?.price?.contentFrequencyPerHour) * 24 || 'N/A'
                                                        }</p>


                                                        <p>Total Ad Plays : {totalAdPlays}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="negosition_right_side_container_1">
                                            <div className="row">
                                                <div className="d-flex col-md-12">
                                                    <div>
                                                        {selectedBillboard ? (
                                                            <img
                                                                className="invoice-table-img"
                                                                src={selectedBillboard?.inventoryThumbnailUrl && selectedBillboard?.inventoryThumbnailUrl !== "null" ? selectedBillboard?.inventoryThumbnailUrl : noImage}
                                                                alt="Billboard Logo"
                                                            />
                                                        ) : (
                                                            <img className="invoice-table-img" src={noImage} alt="No Images Seleted" />
                                                        )}
                                                    </div>
                                                    <div className="negosition_side_container_img">
                                                        <p>Billboard name: {selectedBillboard ? selectedBillboard?.inventoryName : 'N/A'}</p>
                                                        <p>
                                                            Actual price: {currencyCodes}{' '}
                                                            {selectedBillboard
                                                                ? selectedBillboard?.negotiationSummary?.mediaOwnerPreferredPrice?.totalPrice?.toFixed(2)
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12 negosition_side_container_con_2">
                                                        <p>Preferred price</p>
                                                        <p className="negotiation_side_container_con_3">
                                                            <div className="input-container">
                                                                <span>{currencyCodes}</span>
                                                                <input
                                                                    className="nego-input"
                                                                    value={highlightedId === selectedBillboard?.inventoryId ? inputValues[String(selectedBillboard?.inventoryId)] || '' : ''}
                                                                    type="text"
                                                                    onChange={(e) => {
                                                                        if (selectedBillboard?.inventoryId) {
                                                                            handleInputChange(e, String(selectedBillboard.inventoryId)); // Ensure the id is a string
                                                                        }
                                                                    }}
                                                                    placeholder="Enter amount"
                                                                />





                                                            </div>
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="mt-2 media-owner">Media Owner Feedback</p>
                                                <div className="row">
                                                    <div className="col-md-12 negosition_side_container_con_2">
                                                        <p>
                                                            {selectedBillboard && selectedBillboard?.negotiationSummary?.mediaOwnerPreferredPrice?.nowPayPrice !== null
                                                                ? `${currencyCodes} ${selectedBillboard?.negotiationSummary?.mediaOwnerPreferredPrice?.nowPayPrice.toFixed(2)}`
                                                                : 'Media Owner Counter Offer Will Be Shown Here'}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer border-0 gap-4">
                                    {/* <button type="button" className="btn negosition_footer_btn_1 mt-4" disabled>Save draft</button> */}
                                    <button
                                        type="button"
                                        className="btn btn-primary negosition_footer_btn_2 mt-4"
                                        onClick={handleClick}
                                        disabled={loading}
                                    >
                                        {sendRequest ? 'Sending...' : 'Send request'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthLayout >
    );
}

export default NegotiateCampaign;
