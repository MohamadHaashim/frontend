import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import './index.css';
import Image1 from "../../../assets/images/edittext-1default.svg";
import Image2 from "../../../assets/images/vector-21.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { addDays } from 'date-fns';

const ExploreProperty_navbar: React.FC = () => {
    const location = useLocation();
    const formData = location.state?.formData || "";
    const currentDate = new Date();

    const [redirect, setRedirect] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<Date>(formData?.startDate || currentDate);
    const [endDate, setEndDate] = useState<Date>(formData?.endDate || currentDate);
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
    const [tempStartDate, setTempStartDate] = useState<Date>(startDate);
    const [tempEndDate, setTempEndDate] = useState<Date>(endDate);
    const [showMonthPicker, setShowMonthPicker] = useState<boolean>(false);
    const [showYearPicker, setShowYearPicker] = useState<boolean>(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

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

        setTempStartDate(newStartDate);
        setTempEndDate(newEndDate);
        setSelectedYear(year);
        setShowYearPicker(false);
    };

    const handleUpdateStartDate = () => {
        setStartDate(tempStartDate);
        setShowStartDatePicker(false);
    };

    const handleUpdateEndDate = () => {
        setEndDate(tempEndDate);
        setShowEndDatePicker(false);
    };

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="py-2 text-white explore_property_navbar_container">
                    <div className="row g-3 align-items-center explore_property_nav">
                        {/* Campaign Name */}
                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex flex-row explore_property_navbar_container_content">
                            <label htmlFor="campaign-name" className="form-label explore_property_navbar_header mt-2 mx-2">Campaign Name</label>
                            <div className="input-group explore_property_input_group">
                                <input type="text" value={formData.campaignName} className="form-control border-bottom-only explore_property_border_bottom_only bg-transparent" aria-label="Search" />
                                <span className="input-group-text search-icon explore_property_search_icon bg-transparent">
                                    <img src={Image1} alt="" />
                                </span>
                            </div>
                            <span className="border-start"></span>
                        </div>

                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex flex-row explore_property_navbar_container_content">
                            <label htmlFor="state" className="form-label explore_property_navbar_header_1 mt-2">State</label>
                            <div className="container">
                                <div className="input-group explore_property_input_group">
                                    <input type="text" value={formData.state} className="form-control border-bottom-only explore_property_border_bottom_only bg-transparent" aria-label="Search" />
                                    <span className="input-group-text search-icon explore_property_search_icon bg-transparent">
                                        <img src={Image1} alt="" />
                                    </span>
                                </div>
                                <span className="underline"></span>
                            </div>

                            <label htmlFor="district" className="form-label explore_property_navbar_header_1 mt-2">District</label>
                            <div className="container">
                                <div className="input-group explore_property_input_group">
                                    <input type="text" value={formData.district} className="form-control border-bottom-only explore_property_border_bottom_only bg-transparent" aria-label="Search" />
                                    <span className="input-group-text search-icon explore_property_search_icon bg-transparent">
                                        <img src={Image1} alt="" />
                                    </span>
                                </div>
                                <span className="underline"></span>
                            </div>
                            <span className="border-start"></span>
                        </div>

                        {/* Duration */}
                        <div className="col-sm-12 col-md-12 col-lg-4 col-xl-4 d-flex flex-row explore_property_navbar_container_content">
                            <label htmlFor="duration" className="form-label explore_property_navbar_header_1 mt-2">Duration</label>
                            <div className="explore_property_date_start d-flex align-items-center position-relative">
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
                                                <div className="years-grid">
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <button key={i} onClick={() => handleYearSelection(selectedYear + i)} className="year-button">
                                                            {selectedYear + i}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : showMonthPicker ? (
                                            <div className="month-picker">
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
                                                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                    <div className="custom-header">
                                                        <button onClick={decreaseMonth}>{"«"}</button>
                                                        <span onClick={toggleMonthPicker}>{format(date, "MMMM")}</span>
                                                        <span onClick={toggleYearPicker}>{format(date, "yyyy")}</span>
                                                        <button onClick={increaseMonth}>{"»"}</button>
                                                    </div>
                                                )}
                                            />
                                        )}
                                        <button className="update-button" onClick={handleUpdateStartDate}>Update</button>
                                    </div>
                                )}
                            </div>
                            <span className="mt-1">→</span>

                            {/* End Date Picker */}
                            <div className="explore_property_date_end d-flex align-items-center position-relative">
                                <div onClick={toggleEndDatePicker} className="calendar-icon-wrapper">
                                    <img alt="End Date" src={Image2} className="date-icon" />
                                </div>
                                <div className="date-text-1" style={{ cursor: 'pointer' }} onClick={toggleEndDatePicker} >
                                    <p>{format(endDate, "dd MMM yyyy")}</p>
                                </div>
                                {showEndDatePicker && (
                                    <div className="datepicker-wrapper property-list-date-wrapper">
                                        <div className="close-icon" onClick={toggleEndDatePicker}>×</div>
                                        <p className="card_date_header">Select Campaign end date</p>
                                        {showYearPicker ? (
                                            <div className="year-picker">
                                                <div className="years-grid">
                                                    {Array.from({ length: 10 }, (_, i) => (
                                                        <button key={i} onClick={() => handleYearSelection(selectedYear + i)} className="year-button">
                                                            {selectedYear + i}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : showMonthPicker ? (
                                            <div className="month-picker">
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
                                                minDate={startDate ? addDays(startDate, 1) : new Date()}
                                                renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
                                                    <div className="custom-header">
                                                        <button onClick={decreaseMonth}>{"«"}</button>
                                                        <span onClick={toggleMonthPicker}>{format(date, "MMMM")}</span>
                                                        <span onClick={toggleYearPicker}>{format(date, "yyyy")}</span>
                                                        <button onClick={increaseMonth}>{"»"}</button>
                                                    </div>
                                                )}
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

export default ExploreProperty_navbar;
