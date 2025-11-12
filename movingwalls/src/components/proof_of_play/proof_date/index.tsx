import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Image1 from "../../../assets/images/calender.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './index.css';
import { format } from "date-fns";
import { useQuery } from '@apollo/client';
import { PROOF_OF_PLAY, PROOF_OF_PLAY_ASSERTS } from "../../../Graphql/Queries";

interface ProofInventory {
    inventoryName: string;
    id: string;
    inventoryId: string;
    inventoryType: string;
}

interface ProofValues {
    campaignInventories: ProofInventory[];
    metadata: any;
    campaignName?: string;
    dealId?: string;
    duration?: string;
}

interface ProofOfPlayDate {
    campaignId: string;
}

const ProofOfPlayDate: React.FC<ProofOfPlayDate> = ({ campaignId }) => {


    const location = useLocation();
    const userData = location.state;
    const navigate = useNavigate();


    const locations = useLocation();
    const storedProofData = localStorage.getItem('proofData') ? JSON.parse(localStorage.getItem('proofData')!) : null;
    const { proofData } = locations?.state || storedProofData || {};
    console.log('====================================');
    console.log(storedProofData, "StoredDate");
    console.log('====================================');
    const getValidDate = (date: string | number | Date) => {
        const parsedDate = new Date(date);
        return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;  // Return current date if invalid
    };
    const [redirect, setRedirect] = useState<string | null>(null);
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(proofData?.startDate ? getValidDate(proofData.startDate) : new Date());
    const [endDate, setEndDate] = useState(proofData?.endDate ? getValidDate(proofData.endDate) : new Date());

    const loadDateFromStorage = () => {
        const storedProofData = localStorage.getItem("proofData")
            ? JSON.parse(localStorage.getItem("proofData")!)
            : null;
        const proofData = location.state?.proofData || storedProofData;
        if (proofData) {
            setStartDate(new Date(proofData.startDate));
            setEndDate(new Date(proofData.endDate));
        }
    };
    useEffect(() => {
        loadDateFromStorage();
    }, [location.state]);
    useEffect(() => {
        if (startDate && endDate) {
            localStorage.setItem(
                "proofData",
                JSON.stringify({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                })
            );
        }
    }, [startDate, endDate]);
    useEffect(() => {
    }, [startDate, endDate]);
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [tempStartDate, setTempStartDate] = useState<Date>(currentDate);
    const [tempEndDate, setTempEndDate] = useState<Date>(currentDate);
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [proofValues, setProofValues] = useState<ProofValues | undefined>(undefined);
    const [selectDropdown, setSelectDropdown] = useState<ProofInventory[]>([]);
    const [selectedInventoryId, setSelectedInventoryId] = useState('');
    const [loadingData, setLoadingData] = useState(false);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [errorData, setErrorData] = useState<string | null>(null);
    const [errorAssets, setErrorAssets] = useState<string | null>(null);
    const [createDate, setCreateDate] = useState<string[]>([]);  // Change this to an array
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem('authToken');
    const selectedCampaignId = localStorage.getItem('selectedCampaignId');
    const userId = localStorage.getItem('userId');
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const [mainImage, setMainImage] = useState<string | null>(null);
    const [images, setSelectedImage] = useState<string[]>([]); // To hold image URLs

    const { data: assertsData, loading: assertsLoading, error: assertsError } = useQuery(PROOF_OF_PLAY_ASSERTS, {
        variables: {
            accessToken: token,
            metadataCampaignId: selectedCampaignId,
            metadataMediaOwnerId: userId,
            metadataType: "LMX_POC",
            source: "LMX_COMMERCE",
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            page: 0,
            size: 8,
            sort: "lastModifiedDate,desc",
            billboardId: selectedInventoryId === "all" ? "" : selectedInventoryId,
        }
    });


    useEffect(() => {
        if (assertsLoading) {
            setLoadingAssets(true);
            setErrorAssets(null);
        } else if (assertsError) {
            setLoadingAssets(false);
            setErrorAssets("Error fetching Proof of Play asserts.");
        } else {
            setLoadingAssets(false);
            if (assertsData) {
                const proofOfPlayAssets = assertsData?.proofOfPlayAssets;
                if (proofOfPlayAssets && proofOfPlayAssets?.length > 0) {
                    const assetDurations = proofOfPlayAssets?.map((asset: { duration: number; }) =>
                        asset.duration ? `${asset.duration?.toFixed(2)}` : "N/A"
                    );
                }
            }
        }
    }, [assertsLoading, assertsData, assertsError]);

    useEffect(() => {
        if (assertsData?.proofOfPlayAssets) {
            const thumbnails = assertsData.proofOfPlayAssets.map((asset: { thumbnail: any; }) => asset.thumbnail);
            setSelectedImage(thumbnails);
            const uniqueDates = assertsData.proofOfPlayAssets.map((item: any) => {
                const date = new Date(item.createdDate);
                return date.toLocaleDateString(); // Format date as 'MM/DD/YYYY'
            });
            setCreateDate(uniqueDates); // Store dates for each asset
            setSelectedImage(thumbnails); // Set the images to be displayed
        } else {

        }
    }, [assertsData]);

    // Proof Of Play API
    const { data, loading, error, refetch: refetch } = useQuery(PROOF_OF_PLAY, {
        variables: {
            accessToken: token,
            page: 0,
            campaignId: selectedCampaignId,
            metadataType: "LMX_POCLMX_COMMERCE",
            metadataCampaignId: selectedCampaignId,
            metadataMediaOwnerId: userId,
            source: "LMX_COMMERCE",
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            size: 8,
            sort: "lastModifiedDate,desc",
        },
        skip: !token || !userId || !companyId || !selectedCampaignId,
    });

    useEffect(() => {
        if (proofData) {
            setStartDate(new Date(proofData?.startDate));
            setEndDate(new Date(proofData?.endDate));
        }
    }, [proofData]);
    useEffect(() => {

        if (loading) {
            setLoadingData(true);
            setErrorData(null);
        } else if (error) {
            setLoadingData(false);

            if (error.graphQLErrors) {
                console.error("GraphQL Errors:", error.graphQLErrors);
            }
            if (error.networkError) {
                console.error("Network Error:", error.networkError);
            }
            setErrorData("Error fetching Proof of Play data.");
        } else {
            setLoadingData(false);
            if (data && data.proofOfPlay) {
                const { campaignInventories, startDate, endDate } = data.proofOfPlay;

                // setStartDate(startDate?.date||proofData?.startDate);
                // setEndDate(endDate?.date||proofData?.endDate);

                if (campaignInventories && campaignInventories.length > 0) {
                    setSelectDropdown(campaignInventories);
                    setProofValues(data.proofOfPlay);
                } else {
                    setSelectDropdown([]);
                    setErrorData("No valid campaign inventories found.");
                }
            } else {
                setSelectDropdown([]);
                setErrorData("No valid Proof of Play data received.");
            }
        }
        refetch()
    }, [data, loading, error, refetch]);
    useEffect(() => {
    }, [startDate]);
    const isMatchingCampaign = data?.proofOfPlay?.id === campaignId;
    const filteredDropdown = isMatchingCampaign ? selectDropdown.filter(inventory => inventory.inventoryType) : [];
    const sss = data?.proofOfPlay?.id
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const increaseYear = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentYear((prevYear) => prevYear + 1);
    };
    const decreaseYear = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentYear((prevYear) => prevYear - 1);
    };
    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setTempStartDate(date);
            setShowMonthPicker(false);
            setShowYearPicker(false);
        }
    };
    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setTempEndDate(date);
            setShowMonthPicker(false);
            setShowYearPicker(false);
        }
    };
    const toggleStartDatePicker = () => {
        setShowStartDatePicker(!showStartDatePicker);
        setTempStartDate(startDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };
    const toggleEndDatePicker = () => {
        setShowEndDatePicker(!showStartDatePicker);
        setTempEndDate(endDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };
    const toggleMonthPicker = () => {
        setShowMonthPicker(!showMonthPicker);
        setShowYearPicker(false);
    };

    const toggleYearPicker = () => {
        setShowYearPicker(!showMonthPicker);
        setShowMonthPicker(false);
    };
    const handleMonthSelection = (month: number) => {
        const newStartDate = tempStartDate ? new Date(tempStartDate) : new Date();
        const newEndDate = tempEndDate ? new Date(tempEndDate) : new Date();
        newStartDate.setMonth(month);
        newEndDate.setMonth(month);
        setCurrentYear(currentYear);
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedMonth(month);
        setShowMonthPicker(false);
    };
    const handleYearSelection = (year: number) => {
        setCurrentYear(year);
        const newStartDate = tempStartDate ? new Date(tempStartDate) : new Date();
        const newEndDate = tempEndDate ? new Date(tempEndDate) : new Date();
        newStartDate.setFullYear(year);
        newEndDate.setFullYear(year);
        setSelectedYear(currentYear);
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedYear(year);
        setShowYearPicker(false);
    };
    const handleUpdateStartDate = () => {
        setStartDate(tempStartDate);
        tempStartDate.setFullYear(currentYear);
        handleYearSelection(currentYear); // Update state with the new start date
        setShowStartDatePicker(false); // Close the date picker or perform any other actions
        localStorage.setItem(
            "proofData",
            JSON.stringify({
                startDate: tempStartDate.toISOString(),
                endDate: endDate ? endDate.toISOString() : tempStartDate.toISOString(), // fallback for endDate if it's not set
            })
        );
        navigate(`${process.env.REACT_APP_BASE_PATH}/proof-of-play`, {
            state: { startDate: tempStartDate },
        });
    };


    const handleUpdateEndDate = () => {
        setEndDate(tempEndDate);
        tempEndDate.setFullYear(currentYear);
        handleYearSelection(currentYear);
        setShowEndDatePicker(false);

        // Save startDate and endDate to localStorage
        localStorage.setItem(
            "proofData",
            JSON.stringify({
                startDate: tempStartDate.toISOString(),
                endDate: tempEndDate.toISOString(), // Set the endDate
            })
        );

        // Navigate and pass both start and end date in the state
        navigate(`${process.env.REACT_APP_BASE_PATH}/proof-of-play`, {
            state: {
                startDate: tempStartDate,
                endDate: tempEndDate,
            }
        });
    };

    const handleMonthButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    // ProofOfPlayDate Component

    const handleInventoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newInventoryId = event.target.value;


        let selectedBillboardId = newInventoryId === "all" ? "" : newInventoryId;

        setSelectedInventoryId(newInventoryId);


        localStorage.setItem('selectedInventoryId', newInventoryId);
        localStorage.setItem('billboardId', selectedBillboardId);


        navigate(`${process.env.REACT_APP_BASE_PATH}/proof-of-play`, {
            state: {
                ...userData,
                newInventoryId: selectedBillboardId,
            }
        });
    };
    const handleImageClick = (filePath: string) => {

        setMainImage(filePath);

        setShowModal(true);

    };

    const VideoHandler = (videoSource: any) => {
        let videoSourceData = videoSource.videoData;
        return <video controls autoPlay muted playsInline className="modal-img img-fluid">
            <source src={videoSourceData} type="video/mp4" />
            Your browser does not support the video tag.
        </video>;
    }

    const closeModal = () => {
        setShowModal(false);
    };

    const scrollThumbnails = (direction: "left" | "right") => {
        const container = document.getElementById("thumbnailsContainer");
        const scrollAmount = 150;

        if (container) {
            container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
        }
    };




    return (
        <>
            <h4 className="proof-play-header">Proof of play</h4>
            <div className="row">
                <div className="col-md-3">
                    <label htmlFor="billboard" className="form-label proof-data-2">Select Billboard</label>
                    {loadingData ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                            <span className="loading-circle sp1">
                                <span className="loading-circle sp2">
                                    <span className="loading-circle sp3"></span>
                                </span>
                            </span>
                        </div>
                    ) : errorData ? (
                        <div className="error-message">{errorData}</div>
                    ) : (
                        <div className="input-group proof_input_group_1 card_date_starts">
                            {proofValues && proofValues.campaignInventories && proofValues.campaignInventories.length > 0 && (
                                <select
                                    className="form-select"
                                    onChange={handleInventoryChange}
                                    value={selectedInventoryId}  // Ensure this is set correctly
                                >
                                    <option value="" disabled>Select an inventory</option>
                                    <option value="all">All Inventories</option>
                                    {proofValues.campaignInventories.map((inventory) => (
                                        <option key={inventory.id} value={inventory.id}>
                                            {inventory.inventoryName}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}

                    <span className="border-bottom"></span>
                </div>
                <div className="col-md-3 card_date_start d-flex align-items-center position-relative">
                    <div onClick={toggleStartDatePicker} className="calendar-icon-wrapper">
                        <img alt="Start Date" src={Image1} className="date-icon" />
                    </div>
                    <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleStartDatePicker}>
                        <p>{startDate ? format(startDate, "dd MMM yyyy") : 'No start date set'}</p>
                    </div>

                    {showStartDatePicker && (
                        <div className="datepicker-wrapper">
                            <div className="close-icon" onClick={toggleStartDatePicker}>
                                ×
                            </div>
                            <p className="card_date_header">Select Campaign start date</p>
                            {showYearPicker ? (
                                <div className="year-picker">
                                    <div className="header-container">
                                        <button
                                            className="monthYearLeftArrow"
                                            onClick={(e) => { decreaseYear(e); }}
                                        >
                                            {"«"}
                                        </button>
                                        <span className="montYearValue" onClick={toggleYearPicker}>
                                            {currentYear}
                                        </span>
                                        <button
                                            className="monthYearRightArrow"
                                            onClick={(e) => { increaseYear(e); }}
                                        >
                                            {"»"}
                                        </button>
                                    </div>
                                    <div className="years-grid">
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleYearSelection(currentYear + i - 5)}
                                                className="year-button"
                                            >
                                                {currentYear + i - 5}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : showMonthPicker ? (
                                <div className="month-picker">
                                    <div className="header-container">
                                        <button
                                            className="monthYearLeftArrow"
                                            onClick={(e) => { decreaseYear(e); handleYearSelection(currentYear - 1); }}
                                        >
                                            {"«"}
                                        </button>
                                        <span className="montYearValue" onClick={toggleMonthPicker}>
                                            {currentYear}
                                        </span>
                                        <button
                                            className="monthYearRightArrow"
                                            onClick={(e) => { increaseYear(e); handleYearSelection(currentYear + 1); }}
                                        >
                                            {"»"}
                                        </button>
                                    </div>
                                    <div className="months-grid">
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleMonthSelection(i)}
                                                className="month-button"
                                            >
                                                {format(new Date(2021, i), "MMM")}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <DatePicker
                                    selected={tempStartDate}
                                    onChange={handleStartDateChange}
                                    inline
                                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
                                        console.log("Current Year:", currentYear);
                                        return (
                                            <div className="custom-header">
                                                <button
                                                    onClick={(e) => { handleMonthButtonClick(e); decreaseMonth(); }}
                                                >
                                                    {"«"}
                                                </button>
                                                <span onClick={toggleMonthPicker}>
                                                    {format(date, "MMMM")}
                                                </span>
                                                <span onClick={toggleYearPicker}>
                                                    {currentYear}
                                                </span>
                                                <button
                                                    onClick={(e) => { handleMonthButtonClick(e); increaseMonth(); }}
                                                >
                                                    {"»"}
                                                </button>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                            <button className="update-button" onClick={handleUpdateStartDate}>
                                Update
                            </button>
                        </div>
                    )}
                </div>
                <div className="col-md-3 card_date_end d-flex align-items-center position-relative">
                    <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                        <img alt="End Date" src={Image1} className="date-icon" />
                    </div>
                    <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker}>
                        <p>{format(endDate, "dd MMM yyyy")}</p>
                    </div>
                    {showEndDatePicker && (
                        <div className="datepicker-wrapper">
                            <div className="close-icon" onClick={toggleEndDatePicker}>
                                ×
                            </div>
                            <p className="card_date_header">Select Campaign end date</p>
                            {showYearPicker ? (
                                <div className="year-picker">
                                    <div className="header-container">
                                        <button
                                            className="monthYearLeftArrow"
                                            onClick={(e) => { decreaseYear(e); }}
                                        >
                                            {"«"}
                                        </button>
                                        <span className="montYearValue" onClick={toggleYearPicker}>
                                            {currentYear}
                                        </span>
                                        <button
                                            className="monthYearRightArrow"
                                            onClick={(e) => { increaseYear(e); }}
                                        >
                                            {"»"}
                                        </button>
                                    </div>
                                    <div className="years-grid">
                                        {Array.from({ length: 10 }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleYearSelection(currentYear + i - 5)}
                                                className="year-button"
                                            >
                                                {currentYear + i - 5}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : showMonthPicker ? (
                                <div className="month-picker">
                                    <div className="header-container">
                                        <button
                                            className="monthYearLeftArrow"
                                            onClick={(e) => { decreaseYear(e); handleYearSelection(currentYear - 1); }}
                                        >
                                            {"«"}
                                        </button>
                                        <span className="montYearValue" onClick={toggleMonthPicker}>
                                            {currentYear}
                                        </span>
                                        <button
                                            className="monthYearRightArrow"
                                            onClick={(e) => { increaseYear(e); handleYearSelection(currentYear + 1); }}
                                        >
                                            {"»"}
                                        </button>
                                    </div>
                                    <div className="months-grid">
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleMonthSelection(i)}
                                                className="month-button"
                                            >
                                                {format(new Date(2021, i), "MMM")}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <DatePicker
                                    selected={tempEndDate}
                                    onChange={handleEndDateChange}
                                    inline
                                    // minDate={new Date()}
                                    renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => {
                                        console.log("Current Year:", currentYear);
                                        return (
                                            <div className="custom-header">
                                                <button
                                                    onClick={(e) => { handleMonthButtonClick(e); decreaseMonth(); }}
                                                >
                                                    {"«"}
                                                </button>
                                                <span onClick={toggleMonthPicker}>
                                                    {format(date, "MMMM")}
                                                </span>
                                                <span onClick={toggleYearPicker}>
                                                    {currentYear}
                                                </span>
                                                <button
                                                    onClick={(e) => { handleMonthButtonClick(e); increaseMonth(); }}
                                                >
                                                    {"»"}
                                                </button>
                                            </div>
                                        );
                                    }}
                                />
                            )}
                            <button className="update-button" onClick={handleUpdateEndDate}>
                                Update
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <hr className="my-4" />
                </div>
            </div>
            <div className="row proof-card-scroll">
                <h1 className="proof-img-header">
                    Choose from {images.length > 0 ? images.length : 'No'} sites


                </h1>

                <h1 style={{ paddingTop: '20px' }} className="proof-img-header">{images.length > 0 ? images.length : 'No'} available content</h1>


                {images.map((asset, index) => (
                    <div className="col-md-4 mb-4 proof-cards" key={index}>
                        <div className="card border-0">
                            <img
                                src={asset}
                                className="card-img-top proof-img-size"
                                alt={`Campaign Inventory ${index + 1}`}
                            />
                            <div className="card-body proof-card-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <h5 className="card-title proof-card-title Campaign-Inventory">

                                            {data?.proofOfPlay?.campaignInventories
                                                .find((inventory: {
                                                    id: any; inventoryId: string
                                                }) =>
                                                    inventory.id === assertsData?.proofOfPlayAssets[index]?.metadata?.billboardId)
                                                ?.inventoryName || 'Unknown Inventory'}
                                        </h5>




                                        <p className="proof-card-data Uploaded-Inventory">
                                            {createDate.length > 0 && createDate[index]
                                                ? `Uploaded on ${new Date(createDate[index]).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                })}`
                                                : "No date available"}
                                        </p>
                                    </div>
                                    <div className="col-md-4 img-view-button">
                                        <button
                                            className="btn btn-primary proof-card-btn"
                                            onClick={() => handleImageClick(assertsData.proofOfPlayAssets[index].filePath)}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal fade show proof-popup-back" tabIndex={-1} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content proof-popup-con">
                            <div className="modal-body">
                                <div className="btn-close1">
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={closeModal}  // Close the modal when clicked
                                        aria-label="Close"
                                    ></button>
                                </div>

                                {mainImage && (
                                    <div>


                                        {mainImage.toLowerCase().endsWith(".mp4") || mainImage.toLowerCase().endsWith(".webm") ? (
                                            <VideoHandler videoData={mainImage} />
                                        ) : (
                                            <img src={mainImage} alt="Selected media" className="modal-img img-fluid" />
                                        )}
                                    </div>
                                )}






                                <div className="thumbnails-container-wrapper proof-popup-con2">
                                    <div className="thumbnails-container" id="thumbnailsContainer">
                                        {assertsData.proofOfPlayAssets.map((asset: any, index: number) => (
                                            <img
                                                src={asset.thumbnail}  // Thumbnail image here
                                                className="thumbnail-img"
                                                alt={`Thumbnail ${index + 1}`}
                                                key={index}
                                                onClick={() => {

                                                    handleImageClick(asset.filePath);  // Pass the filePath to handleImageClick
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>


                                <div className="arrow-buttons-container">
                                    <span className="arrow-icon-left" onClick={() => scrollThumbnails("left")}>&lt;</span>
                                    <span className="arrow-icon-right" onClick={() => scrollThumbnails("right")}>&gt;</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProofOfPlayDate;
