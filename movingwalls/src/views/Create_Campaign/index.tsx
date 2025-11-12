import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavBar from "../../components/common/NavBar";
import './index.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";
import Image1 from "../../assets/images/calendar.jpg";
import BackIcon from "../../assets/images/back-icon.svg";
import { GET_COUNTRY_LIST, GET_DISTRICT_LIST, GET_STATE_LIST } from "../../Graphql/Queries";
import { useQuery } from "@apollo/client";
import Select, { components, SingleValue } from 'react-select'

const CreateCampaign: React.FC = () => {
    const currentDate = new Date();
    const [redirect, setRedirect] = useState<string | null>(null);
    const location = useLocation();
    const { exploreData } = location.state || {};
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const CustomOption = (props: any) => {
        const { data, isSelected } = props;
        return (
            <components.Option {...props} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{data.label}</span> {/* Option text */}
                {isSelected && <i className="fa-solid fa-check" style={{ color: 'green' }}></i>} {/* Tick on right */}
            </components.Option>
        );
    };

    const CustomOptions = (props:any) => {
        const { data, isSelected } = props;
        return (
            <components.Option {...props} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{data.label}</span> {/* Option text */}
                {isSelected && <i className="fa-solid fa-check" style={{ color: 'green' }}></i>} {/* Tick on right */}
            </components.Option>
        );
    }

    useEffect(() => {

        if (exploreData && exploreData.exploreCondtion == true) {
            const { exploreStartDate, exploreEndDate } = exploreData;

            const start = new Date(exploreStartDate);
            const end = new Date(exploreEndDate);

            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            } else {

                setStartDate(start);
                setEndDate(end);
            }
        } else {
        }
    }, [exploreData]);
    const [tempStartDate, setTempStartDate] = useState<Date | null>(currentDate);
    const [tempEndDate, setTempEndDate] = useState<Date | null>(currentDate);
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [countryOptions, setCountryOptions] = useState<{ id: string; name: string; dialingCode: string }[]>([]);
    const [selectedStateId, setSelectedStateId] = useState<string | undefined>();
    const [country, setCountry] = useState<string>("");
    const [state, setState] = useState<string>("");
    const [stateOptions, setStateOptions] = useState<{
        stateId: string;
        name: string;
    }[]>([]);

    const [district, setDistrict] = useState<string>("");
    const [districtOptions, setDistrictOptions] = useState<{
        districtId: string; value: string; label: string 
}[]>([]);

    const countryId = localStorage.getItem('countryId');
    const Navigate = useNavigate();

    // Calculate tomorrow's date
    const today = new Date();
    const tomorrow = addDays(today, 0); // Tomorrow's date


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
        setShowEndDatePicker(!showEndDatePicker); // Fix here: toggle showEndDatePicker instead of showStartDatePicker
        setTempEndDate(endDate);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const toggleMonthPicker = () => {
        setShowMonthPicker(!showMonthPicker);
        setShowYearPicker(false);
    };

    const toggleYearPicker = () => {
        setShowYearPicker(!showYearPicker);
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
        const updatedStartDate = (tempStartDate ?? new Date());
        updatedStartDate.setFullYear(currentYear);
        setStartDate(updatedStartDate);
        handleYearSelection(currentYear);
        setShowStartDatePicker(false);
    };

    const handleUpdateEndDate = () => {
        const updatedEndDate = (tempEndDate ?? new Date());
        updatedEndDate.setFullYear(currentYear);
        setEndDate(updatedEndDate);
        handleYearSelection(currentYear);
        setShowEndDatePicker(false);
    };

    const handleMonthButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const isFormValid = () => {
        return campaignName && startDate && endDate;
    };

    const handleCampaignSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const selectedState = stateOptions.find(s => s.stateId === state);
            const selectedDistrict = districtOptions.find(c => c.districtId === district);
            const exploreDatas = {
                exploreData
            }
            const formData = {
                campaignName,
                startDate,
                endDate,
                state: selectedState ? selectedState : '',
                district: selectedDistrict ? selectedDistrict : '',
            };

            Navigate(`${process.env.REACT_APP_BASE_PATH}/propertylist`, {
                state: {
                    formData,
                    exploreDatas
                }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const { data: countryData } = useQuery(GET_COUNTRY_LIST);

    useEffect(() => {
        if (countryData && countryData.countryList) {
            setCountryOptions(countryData.countryList);
        }
    }, [countryData]);

    const { data: stateData } = useQuery(GET_STATE_LIST, {
        variables: { countryId: countryId }
    });

    useEffect(() => {
        if (stateData && stateData.stateList) {
            setStateOptions(stateData.stateList);
        }
    }, [stateData]);

    const { data: districtData } = useQuery(GET_DISTRICT_LIST, {
        variables: { stateid: selectedStateId },
        skip: !selectedStateId,
    });
    
    useEffect(() => {
        if (districtData && districtData.districtList) {
            // Transform districtList into the expected format for react-select
            setDistrictOptions(
                districtData.districtList.map((list:any) => ({
                    value: list.districtId ? String(list.districtId) : "", // Convert to string
                    label: list.name || "Unknown District",
                }))
            );
        }
    }, [districtData]);

    const handleStateChange = (newValue: SingleValue<{ value: string; label: string }>) => {
        if (newValue) {
            const selectedState = stateOptions.find(state => state.stateId === newValue.value);
    
            if (selectedState) {
                setSelectedStateId(selectedState.stateId);
                setState(newValue.value);
            } else {
                setCountry("");
            }
        }
    };
    localStorage.removeItem('selectedDistrict')
    localStorage.removeItem('selectedState')


    return (
        <DefaultLayout>
            <NavBar />

            <div className="create-campaign-fullform">
                <div className="container mt-4">
                    <div className="navbar-back-btn">
                        <img alt="Back" src={BackIcon} />
                        <Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}> Back</Link>
                    </div>
                </div>
                <div className="container create-campaign-container">
                    <div className="card campaign-create-card">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="campaign-create-header-content mb-5">
                                    <h2 className="campaign-create-header-heading">Create campaign</h2>
                                    <p className="campaign-create-header-para">Run your next outdoor advertising campaign with just a few clicks.</p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleCampaignSubmit}>
                            <div className="campaign-form">
                                <div className="form-row campaign-name">
                                    <div className="row">
                                        <div className="form-group col-md-12">
                                            <h3 className="campaign-create-label">Create campaign</h3>
                                        </div>
                                        <div className="form-group col-md-12">
                                            <input type="text" className="campaign-input-name border-bottom-only no-focus-border"
                                                onChange={(e) => setCampaignName(e.target.value)}
                                                value={campaignName} placeholder="Enter your campaign here" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row campaign-duration">
                                    <div className="form-group col-md-12">
                                        <h3 className="campaign-create-label">Duration</h3>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card_date_start card_date_starts date-picker">
                                            <div onClick={toggleStartDatePicker} className="calendar-icon-wrapper">
                                                <img alt="Start Date" src={Image1} className="date-icon" />
                                            </div>
                                            <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleStartDatePicker}>
                                                <p>{startDate ? format(startDate, 'dd MMM yyyy') : <span className="date-default-text">From</span>}</p>
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
                                                            minDate={new Date()} // Block all dates before the current date
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
                                    </div>
                                    <div className="col-md-6">
                                        <div className="card_date_end card_date_ends">
                                            <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                                <img alt="End Date" src={Image1} className="date-icon" />
                                            </div>
                                            <div className="date-text" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker}>
                                                <p>{endDate ? format(endDate, 'dd MMM yyyy') : <span className="date-default-text">To</span>}</p>
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
                                                            minDate={startDate ? addDays(startDate, 1) : new Date()}
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
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group campaign-state-text">
                                            <h3 className="campaign-create-label">State</h3>
                                            <div className="create-capaign-hatimbig-parent dropdown-method-topside">
                                            <div className="companyform-group">
                                            <div className="select-container">
                                            <Select
                                                onChange={handleStateChange}
                                                value={stateOptions.find(option => option.stateId === state) ? {
                                                    value: state,
                                                    label: stateOptions.find(option => option.stateId === state)?.name || "Unknown State"
                                                } : null}
                                                id="state"
                                                
                                                className="country-select"
                                                options={stateOptions.map(list => ({
                                                    value: list.stateId,
                                                    label: list.name || "Unknown State"
                                                    
                                                }))}
                                                placeholder="Select State"
                                                isSearchable={true}
                                                components={{ Option: CustomOption }} 
                                            />
                                              
                                            </div>
                                        </div>
                                                <div className="company-details-frame-country"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group campaign-district-text">
                                            <h3 className="campaign-create-label">District</h3>
                                            <div className="create-capaign-hatimbig-parent">
                                                <div className="companyform-group">
                                                <Select
    components={{ Option: CustomOptions }} // Use custom option component
    onChange={(selectedOption: SingleValue<{ value: string; label: string }>) => 
        setDistrict(selectedOption ? selectedOption.value : "")
    }
    value={districtOptions.find(option => option.value === district) || null}
    id="district"
    className="country-select"
    options={districtOptions}
    placeholder="Select District"
    isSearchable={true}
/>
                                                </div>
                                                <div className="company-details-frame-state"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="campagin-submit-btn">
                                    <button type="submit"
                                        disabled={!isFormValid()}
                                        className={`${!isFormValid() ? 'disabled' : ''}`}
                                    >Next</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
};

export default CreateCampaign;
