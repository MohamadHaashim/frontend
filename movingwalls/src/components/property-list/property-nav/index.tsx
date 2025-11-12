import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import './index.css';
import Image1 from "../../../assets/images/edittext-1default.svg";
import Image2 from "../../../assets/images/vector-21.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

import Select, { OnChangeValue } from 'react-select'
import client from "../../../Graphql/apolloClient";
import { GET_DISTRICT_LIST, GET_STATE_LIST } from "../../../Graphql/Queries";
import { addDays } from 'date-fns';

function PropertyListNavbar(props: any) {
    const location = useLocation();
    const cardData = location.state || {};
    const formData = cardData?.formData || {};
    const cartformData = cardData?.cartformData || {};
    const currentDate = new Date();
    const [startDate, setStartDate] = useState<Date>(() => {
        return formData?.startDate ? new Date(formData?.startDate) :
            cartformData?.startDate ? new Date(cartformData?.startDate) : new Date();
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        return formData?.endDate ? new Date(formData?.endDate) :
            cartformData?.endDate ? new Date(cartformData?.endDate) : new Date();
    });
    const handleDateChange = () => {
        props.parentCallback({ startDate, endDate });
        localStorage.setItem('startDate', format(startDate, 'yyyy-MM-dd'));
        localStorage.setItem('endDate', format(endDate, 'yyyy-MM-dd'));
    };
    const [campaignName, setCampaignName] = useState<string>(() => {
        const storedCampaignName = localStorage.getItem('campaignName');
        return storedCampaignName || cartformData?.campaignName || formData?.campaignName
    });

    const [redirect, setRedirect] = useState<string | null>(null);
    // const [startDate, setStartDate] = useState<Date>(formData?.startDate || currentDate);
    // const [endDate, setEndDate] = useState<Date>(formData?.endDate || currentDate);
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [tempStartDate, setTempStartDate] = useState<Date>(startDate);
    const [tempEndDate, setTempEndDate] = useState<Date>(endDate);
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [isStateLoading, setIsStateLoading] = useState(false);
    const [stateList, setStateList] = useState<any>([{}]);
    const [stateDropdownOptions, setStateDropdownOptions] = useState([]);
    const formState = { value: formData?.state?.stateId, label: formData?.state?.name }
    const [stateSelectedId, setStateSelectedId] = useState<any>(formState || '');
    const [isDistrictLoading, setIsDistrictLoading] = useState(false);
    const [districtList, setDistrictList] = useState<any>([{}]);
    const [districtDropdownOptions, setDistrictDropdownOptions] = useState<any>([]);
    const formDistrict = { value: formData?.district?.districtId, label: formData?.district?.name }
    const [districtSelectedId, setDistrictSelectedId] = useState<any>(formDistrict || '');
    const countryId = localStorage.getItem('countryId');
    const [panentSendData, setPanentSendData] = useState<any>({
        campaignName: campaignName,
        state: formState,
        district: formDistrict,
        fromDate: startDate || currentDate,
        toDate: endDate || currentDate,
    });
    useEffect(() => {
        if (campaignName) {
            localStorage.setItem('campaignName', campaignName);
        }
    }, [campaignName]);

    const handleCampaignNameChanges = (newCampaignName: string) => {
        setCampaignName(newCampaignName);
    };


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
        setShowEndDatePicker(!showEndDatePicker);
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
        const newStartDate = new Date(tempStartDate);
        const newEndDate = new Date(tempEndDate);
        newStartDate.setMonth(month);
        newEndDate.setMonth(month);
        setCurrentYear(currentYear);
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedMonth(month);
        setShowMonthPicker(false);
    };

    const handleYearSelection = (year: number) => {
        const newStartDate = new Date(tempStartDate);
        const newEndDate = new Date(tempEndDate);
        newStartDate.setFullYear(year);
        newEndDate.setFullYear(year);
        setCurrentYear(year);
        setSelectedYear(currentYear);
        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedYear(year);
        setShowYearPicker(false);
    };

    const handleUpdateStartDate = () => {
        const updatedStartDate = new Date(tempStartDate);
        updatedStartDate.setFullYear(currentYear);
        setStartDate(updatedStartDate);
        let dataSendToparent = { ...panentSendData, toDate: updatedStartDate };
        dataSendToparent.fromDate = updatedStartDate;
        props.parentCallback(dataSendToparent);
        setPanentSendData(dataSendToparent);
        setShowStartDatePicker(false);
        handleDateChange();
    };

    const handleUpdateEndDate = () => {
        const updatedEndDate = new Date(tempEndDate);
        updatedEndDate.setFullYear(currentYear);
        setEndDate(updatedEndDate);
        let dataSendToparent = { ...panentSendData, toDate: updatedEndDate };
        dataSendToparent.toDate = updatedEndDate;
        props.parentCallback(dataSendToparent);
        setPanentSendData(dataSendToparent);
        setShowEndDatePicker(false);
        handleDateChange();
    };
    const handleMonthButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    useEffect(() => {
        handleDateChange();
    }, [startDate, endDate]);
    useEffect(() => {
        fetchStateList();
        if (formData?.state?.stateId) {
            fetchDistrictList(formData?.state?.stateId);
        }
    }, [])

    const fetchStateList = async () => {
        try {
            setIsStateLoading(true);
            const { data } = await client.query({
                query: GET_STATE_LIST,
                variables: {
                    countryId: countryId
                }
            })
            if (data) {
                const states = data.stateList;
                let stateArray: any = [];
                setStateList(data.stateList);
                if (states) {
                    for (let i = 0; i < states.length; i++) {
                        stateArray.push({ value: states[i].stateId, label: states[i].name });
                    }
                }
                setStateDropdownOptions(stateArray)
                setIsStateLoading(false);
                if (stateSelectedId) {
                    fetchDistrictList(stateSelectedId.value);
                }
            }
        } catch (error) {
            console.error("Error fetching State list:", error);
        }
    };
    const fetchDistrictList = async (stateId: any) => {
        try {
            setIsDistrictLoading(true);
            const { data, loading, error } = await client.query({
                query: GET_DISTRICT_LIST,
                variables: {
                    stateid: stateId
                }
            })
            if (data) {
                const districts = data.districtList;
                let districtArray: any = [];
                if (districts) {
                    for (let i = 0; i < districts.length; i++) {
                        districtArray.push({ value: districts[i].districtId, label: districts[i].name });
                    }
                }
                setDistrictDropdownOptions(districtArray)
                setDistrictList(data.districtList)
                setIsDistrictLoading(false);
            }
        } catch (error) {
            console.error("Error fetching District list:", error);
        }
    };
    const handleCampaignNameChange: any = (event: any) => {
        const newCampaignName = event;
        setCampaignName(newCampaignName);
        let dataSendToparent = panentSendData;
        dataSendToparent.campaignName = newCampaignName;
        props.parentCallback(dataSendToparent);
        setPanentSendData(dataSendToparent);
    }

    useEffect(() => {
        const savedState = localStorage.getItem('selectedState');
        const savedDistrict = localStorage.getItem('selectedDistrict');

        const parsedState = savedState ? JSON.parse(savedState) : null;
        const parsedDistrict = savedDistrict ? JSON.parse(savedDistrict) : null;

        if (parsedState) {
            setStateSelectedId(parsedState);
        }

        if (parsedDistrict) {
            setDistrictSelectedId(parsedDistrict);
        }

    }, []);


    const handleStateChange = (event: any) => {
        const selectedState = stateList.find((c: any) => c.stateId === event.value);
        if (!selectedState) return;

        const selectedStateData = { value: selectedState.stateId, label: selectedState.name };
        setStateSelectedId(selectedStateData);
        setDistrictSelectedId(null);


        fetchDistrictList(selectedState.stateId);


        localStorage.setItem('selectedState', JSON.stringify(selectedStateData));

        // Update the parent with the selected state
        let updatedParentData = { ...panentSendData, state: selectedStateData };
        setPanentSendData(updatedParentData);
        props.parentCallback(updatedParentData);
    };

    const handleDistrictChange = (event: any) => {
        const selectedDistrict = districtList.find((c: any) => c.districtId === event.value);
        if (!selectedDistrict) return;

        const selectedDistrictData = { value: selectedDistrict.districtId, label: selectedDistrict.name };
        setDistrictSelectedId(selectedDistrictData);


        localStorage.setItem('selectedDistrict', JSON.stringify(selectedDistrictData));


        let updatedParentData = { ...panentSendData, district: selectedDistrictData };
        setPanentSendData(updatedParentData);
        props.parentCallback(updatedParentData);
    };

    const handleEditClick = () => {
        const inputElement = document.querySelector('.form-control') as HTMLInputElement | null;
        if (inputElement) {
            inputElement.focus();
        } else {
            console.error('Input element not found.');
        }
    };


    return (
        <div className="row property-nav-bar">
            <div className="col-md-12">
                <div className="py-2 text-white property_list_navbar_container">
                    <div className="row g-3 align-items-center">
                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex flex-row property_list_navbar_container_content">
                            <label htmlFor="campaign-name" className="form-label property_list_navbar_header mt-2 mx-2">Campaign Name</label>
                            <div className="input-group property_list_input_group">
                                <input type="text" onChange={(e) => handleCampaignNameChanges(e.target.value)} value={campaignName} className="form-control border-bottom-only property_list_border_bottom_only bg-transparent" aria-label="Search" />
                                <span onClick={handleEditClick} className="input-group-text search-icon property_list_search_icon bg-transparent">
                                    <img style={{ cursor: 'pointer' }} src={Image1} alt="" />
                                </span>
                            </div>
                            <span className="border-start"></span>
                        </div>

                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex flex-row property_list_navbar_container_content">
                            <label htmlFor="state" className="form-label property_list_navbar_header_1 mt-2">State</label>
                            <div className="container">
                                <div className="input-group property_list_input_group">
                                    <Select
                                        options={stateDropdownOptions}
                                        onChange={handleStateChange}
                                        placeholder="Select"
                                        value={stateSelectedId}
                                    />
                                    <span className="edit-icon">
                                        {isStateLoading ? (
                                            <div className="loader-container-small">
                                                <div className="loader-spinner-small"></div>
                                            </div>
                                        ) : (
                                            <img src={Image1} alt="" />
                                        )}
                                    </span>
                                </div>
                            </div>

                            <label htmlFor="district" className="form-label property_list_navbar_header_1 mt-2">District</label>
                            <div className="container">
                                <div className="input-group property_list_input_group">
                                    <Select
                                        options={districtDropdownOptions}
                                        onChange={handleDistrictChange}
                                        placeholder="Select"
                                        value={districtSelectedId}
                                    />
                                    <span className="edit-icon">
                                        {isDistrictLoading ? (
                                            <div className="loader-container-small">
                                                <div className="loader-spinner-small"></div>
                                            </div>
                                        ) : (
                                            <img src={Image1} alt="" />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <span className="border-start"></span>
                        </div>

                        {/* Duration */}
                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex flex-row property_list_navbar_container_content">
                            <label htmlFor="duration" className="form-label property_list_navbar_header_1 mt-2">Duration</label>
                            <div className="property_list_date_start d-flex align-items-center position-relative">
                                <div onClick={toggleStartDatePicker} className="calendar-icon-wrapper">
                                    <img alt="Start Date" src={Image2} className="date-icon" />
                                </div>
                                <div className="date-text-1" style={{ cursor: 'pointer' }} onClick={toggleStartDatePicker}>
                                    <p>{format(startDate, "dd MMM yyyy")}</p>
                                </div>
                                {showStartDatePicker && (
                                    <div className="datepicker-wrapper property-list-date-wrapper">
                                        <div className="close-icon" onClick={toggleStartDatePicker}>×</div>
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
                                                        <button key={i} onClick={() => handleMonthSelection(i)} className="month-button">
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
                                                minDate={currentDate}
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
                                        <button className="update-button" onClick={handleUpdateStartDate}>Update</button>
                                    </div>
                                )}
                            </div>
                            <span className="mt-1">→</span>

                            {/* End Date Picker */}
                            <div className="Property_list_date_end d-flex align-items-center position-relative">
                                <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                    <img alt="End Date" src={Image2} className="date-icon" />
                                </div>
                                <div className="date-text-1" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker}>
                                    <p>{format(endDate, "dd MMM yyyy")}</p>
                                </div>
                                {showEndDatePicker && (
                                    <div className="datepicker-wrapper property-list-date-wrapper">
                                        <div className="close-icon" onClick={toggleEndDatePicker}>×</div>
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
                                                        <button key={i} onClick={() => handleMonthSelection(i)} className="month-button">
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
                                                // minDate={currentDate}
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
                                        <button className="update-button" onClick={handleUpdateEndDate}>Update</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyListNavbar;