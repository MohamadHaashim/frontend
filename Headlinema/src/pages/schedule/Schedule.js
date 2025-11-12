import React, { useState, useEffect,useRef } from 'react'
// import { CircularProgress, Pagination, Stack } from "@mui/material";
// import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { Modal, ModalBody, FormGroup, Pagination } from "reactstrap";
import {
    Block,
    BlockDes,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    Row,
    Col,
    Button,
    RSelect,
    PaginationComponent,
} from "../../components/Component";
import { Form, FormCheck, Spinner, Stack } from 'react-bootstrap';
import "./index.css"
import Url from "../../Api";
// import axios, { formToJSON } from 'axios';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
// import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
// import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { TextField } from '@mui/material';
import Moment from 'moment';
import { DateRangePicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import isAfter from "date-fns/isAfter";
import Select from 'react-select';
import DropdownComponent  from './dropdown';

const Schedule = (pageNumber = 1, pageSize = 50) => {

    const [totalRow, setTotalRow] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [activePage, setActivePage] = useState(1);
    const [newPageSize, setnewPageSize] = useState(1);
    const [perPage, setPerPage] = useState(50);
    const [lastPage, setLastPage] = useState(1);
    const [reportData, setreportData] = useState([]);
    const [selectedOption, setSelectedOption] = useState("");
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState([]);
    const [advancedFilterDateRange, setAdvancedFilterDateRange] = useState({
        dateRange: "Custom",
        startDate: Moment().subtract(30, "days").toISOString(),
        endDate: Moment().toISOString(),
    });

    const [totalItems, setTotalItems] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const [totalRow, setTotalRow] = useState(0);
    const [options, setOptions] = useState([
        // options. profileId
    ]);
    const [profileOptions, setProfileOptions] = useState([]);
    const [allData, setAllData] = useState([])
    const [users, setUsers] = useState([])
    const [isFocused, setIsFocused] = useState(false);
    const [all] = useState([{ value: "All Profile", label: "All Profile" }])

    const [selectedChecks, setSelectedChecks] = useState([]);
    const [selectAllChecks, setSelectAllChecks] = useState(false);

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            scrollbar: "thin",
            backgroundColor: state.isSelected
                ? ""
                : state.isFocused
                    ? ""
                    : "transparent", 
            color: "black", 
            "&:active": {
                backgroundColor: state.isFocused || state.isHovered ? "#ebb96e" : "transparent",
                color: "white"
                },
            cursor: "pointer",
            padding: "10px",
            borderBottom: '1px solid #ddd',
        }),
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "transparent", 
            width: "200px",
            border: state.isFocused ? "2px solid #ebb96e" : "1px solid #ccc", 
            boxShadow: state.isFocused ? "0 0 5px #ebb96e" : "none",
            transition: "border-color 0.3s, box-shadow 0.3s",
            outline: "none",
            ":hover": {
                border: state.isFocused ? "2px solid #ebb96e" : "1px solid #ccc", 
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 100,
        }),
        singleValue: (provided) => ({
            ...provided,
            color: "black", 
            backgroundColor: "transparent", 
        }),
        placeholder: (provided) => ({
            ...provided,
            color: "#888", 
        }),
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // useEffect(() => {
    //     fetchAllData();
    // }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(Url.api + Url.Report, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pageNumber: activePage,
                    pageSize: perPage,
                    sortOptions: [
                        {
                            columnName: "Id",
                            direction: "Descending",
                        },
                    ],
                    globalFilters: {
                        searchText: searchText, 
                        dateRanges: {
                            startDate: advancedFilterDateRange?.startDate,
                            endDate: advancedFilterDateRange?.endDate,
                        },
                        advancedFilters: null,
                    },
                    profileId: selectedOption,
                }),
            });

            console.log(response, "Response Reports from API");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data?.result?.data) {
                setreportData(data.result.data);
                setOptions(data.result.data);
                setTotalRow(data.filteredCount || 0);
                setLastPage(data.lastPage || 1);
                setTotalItems(data.result.total)
                console.log(data.result, "profileId");
                console.log(data.result.data[0]?.taskType, "taskdata:");
                fetchAllData()
            } else {
                console.warn("Unexpected response structure:", data);
                
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    useEffect(() => {
        fetchData(activePage, perPage, advancedFilterDateRange,selectedOption,searchText);
    }, [perPage, activePage, advancedFilterDateRange, selectedOption,searchText]);

    useEffect(() => {
        setFilteredTableData(reportData.slice(0, perPage));
    }, [reportData, perPage]);

    const handleChange = async (pageNumber) => {
        currPage = value;
        setActivePage(pageNumber);
        await fetchData(pageNumber, perPage);
        dataLength = perPage;
        backgroundsync();
    };

    console.log(selectedOption, 'idsssssssss');
    const allprofile = async () => {
        const token = localStorage.getItem("token");
        try {
            console.log(selectedOption, "Selected Option");

            // Replace with your actual API URL and UserId
            const response = await fetch(`${Url.api}${Url.profile}?UserId=6747103549544340265f9e77`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            console.log(response, "Response from API");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUsers(data); // Store the fetched data in state
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (users) {
            console.log(users, "Original User Data");

            // Remove duplicate profiles based on `profileId`
            const uniqueProfiles = users
                .filter((value, index, self) =>
                    index === self.findIndex((t) => t.profileId === value.profileId)
                )
                .map((item) => ({
                    value: item.profileId,
                    label: item.accountInfo?.name?.trim() || "Unknown Name",
                    id: item.profileId,
                }));
            // Include "All Profiles" as the first option
            setProfileOptions([{ value: "all", label: "All Profiles" }, ...uniqueProfiles]);
        }
    }, [users]);


    useEffect(() => {
        allprofile();
    }, []);

    const handledropdown = (e) => {
        console.log("Handledropdown", e.value);
        const selectedProfileId = String(e.value);
        setActivePage(1);

        if (selectedProfileId === "all") {
            setSelectedOption("");
            setFilteredTableData([]);
        } else {
            setSelectedOption(selectedProfileId);
        }
        allprofile();
    };

    const applyDataLength = async (e) => {
        let newPageSize = parseInt(e.target.value);
        setPerPage(newPageSize);
        setActivePage(1);
        await fetchData(1, newPageSize);
        // currPage = activePage;
        // backgroundsync();
    };

    useEffect(() => {
        setFilteredTableData(reportData.slice(0, perPage));
    }, [reportData, perPage]);

    useEffect(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        setSelectedDateRange([startDate, endDate]);
    }, []);

    useEffect(()=>{
        setSelectAllChecks(false)
        setSelectedChecks([]);
    },[reportData])
    useEffect(()=>{
        if(selectedChecks.length!==0 && selectedChecks.length!==reportData.length){setSelectAllChecks(false)
    
        }else if(selectedChecks.length!==0 &&  selectedChecks.length==reportData.length){
            setSelectAllChecks(true)
    
        }
     },[selectedChecks])

    const handleSelectedAllCheck=()=>{
        setSelectAllChecks(!selectAllChecks)
        console.log("handleSelectedAllCheck",selectAllChecks,selectedChecks.length)
    
     if(selectAllChecks){
        setSelectAllChecks(false)
    
        setSelectedChecks([]);
     }
    else{
       
        const allIds = reportData.map((item) => item.id);
        console.log("handleSelectedAllCheck allIds",allIds)
    
          setSelectedChecks(allIds);
    }
               
          setSelectAllChecks(!selectAllChecks);
    }

    const handleCheckboxChange = (id) => {
        console.log("handleCheckboxChange",id)
    
        setSelectedChecks((prevSelected) => {
            
            if (prevSelected.includes(id)) {
              return prevSelected.filter((itemId) => itemId !== id);
            }
            
            return [...prevSelected, id];
          });
      };

      const hasApiCallBeenMade = useRef(true);
      useEffect(() => {
        if (!hasApiCallBeenMade.current) {
            setAdvancedFilterDateRange({
                dateRange: "Custom",
                startDate: Moment().subtract(30, "days").toISOString(),
                endDate: Moment().toISOString(),
            });
            hasApiCallBeenMade.current = false;
        }
    }, []);

      const handleDateRangeChange = async (newDateRange) => {
        if (!newDateRange || newDateRange.length < 2 || !newDateRange[0] || !newDateRange[1]) {
            setSelectedDateRange([null, null]);
            setAdvancedFilterDateRange({
                dateRange: "Custom",
                startDate: null,
                endDate: null,
            });
            console.log("Date range cleared.");
            return;
        }
    
        const formatDate = (date) => {
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${year}-${month}-${day}T00:00:00.000Z`;
        };
    
        const startDate = formatDate(newDateRange[0]);
        const endDate = formatDate(newDateRange[1]);
    
        setSelectedDateRange(newDateRange);
        setAdvancedFilterDateRange({
            dateRange: "Custom",
            startDate,
            endDate,
        });
    
        console.log("Selected Date Range:", startDate, "–", endDate);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setSearchText(event.target.value);
            fetchData();
            event.preventDefault();
        }
    };

    const paginate = (value) => {
        console.log("paginate", value)
        setActivePage(value)
    }

    return (
        <>

            <Row className="ms-2 me-3">
                <div className="schedule-container">
                    <div className="action-row d-flex justify-content-between align-items-center">
                        {/* <div className="back-arrow-container d-flex align-items-center  ">
                        </div> */}
                        <div className="d-flex">
                            <form className="me-3">
                                <div className="search-filter-container schedules" style={{ position: 'relative', width: '100%' }}>
                                    <i
                                        className="fa-solid fa-magnifying-glass search_icon"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '10px',
                                            transform: 'translateY(-50%)',
                                            color: '#888',
                                        }}
                                    ></i>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        id="globalSearch"
                                        name="globalSearch"
                                        onChange={(e) => setSearchText(e.target.value)} 
                                        
                                        style={{
                                            // width: "400%",
                                            padding: "10px 10px 10px 40px",
                                            border: isFocused ? "2px solid #ebb96e" : "1px solid #ccc",
                                            borderRadius: "4px",
                                            outline: "none",
                                            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                                            boxShadow: isFocused ? "0 0 5px #ebb96e" : "none",
                                        }}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={() => setIsFocused(false)}
                                        tabIndex={0}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </form>
                            <div className="position-relative">
                               <DropdownComponent/>
                               <span className={`bulkOperations_Badge badge-pill badge-secondary  position-absolute`} style={{display:`${selectedChecks?.length ? "block":"none" } `}}>{selectedChecks.length}</span>

                               </div>
                        </div>

                        <div className="d-flex align-items-center">
                            {/* <div className="dropdown profile-dropdown"> */}
                            <label htmlFor="dropdown"></label>
                            {/* <select
                                id="dropdown"
                                value={selectedOption}
                                onChange={handledropdown}
                                style={{
                                    border: "none",
                                    outline: "none",
                                    height: "35px",
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">All Profiles</option>
                                {options
                                    .filter(
                                        (value, index, self) =>
                                            index === self.findIndex((t) => t.profileId === value.profileId)
                                    )
                                    .map((option, index) => (
                                        <option key={index} value={option.profileId}>
                                            {option.profile}
                                        </option>
                                    ))}
                            </select> */}
                            <Select
                                defaultValue={profileOptions[0] || { value: "all", label: "All Profiles" }}
                                options={profileOptions}
                                onChange={handledropdown}
                                styles={customStyles}
                            />
                            {selectedOption && <p>{ }</p>}
                            {/* </div> */}

                            <div className='date-picker ms-2'>
                                <DateRangePicker format="MM/dd/yyyy" character=" – "
                                    onChange={handleDateRangeChange}
                                    disabledDate={(date) => isAfter(date, new Date())}
                                    value={selectedDateRange}
                                />
                            </div>
                        </div>
                    </div>

                    <table className="table table-hover mt-5 table-light">
                        <thead className="admin-user-table-head">
                            <tr>
                                <th><Form.Check className='thead__Checkbox' type='checkbox'
                                    checked={selectAllChecks}
                                    onChange={handleSelectedAllCheck}
                                     />
                                </th>
                                <th scope="col">Profile</th>
                                <th scope="col">Report Name</th>
                                <th scope="col">Report Status</th>
                                <th scope="col">Created On</th>
                                <th scope="col">Completed On</th>
                                <th scope="col">Failed Reason</th>
                                <th scope="col">Failed On</th>
                            </tr>
                        </thead>
                        <tbody className="admin-user-table-body">

                            {isLoading ? (<tr>
                                <td colSpan="7" className="text-center">
                                    <div className="wrapper">
                                        {/* <img  src="/loader.gif" alt="Loading..." /> */}
                                        <Spinner style={{ height: "30px", width: "30px" }} />
                                        {/*<div className="pie spinner"></div>
                                        <div className="pie filler"></div>
                                        <div className="mask spin"></div>
                                        <div className="mask fill"></div>
                                        <div className="bg"></div> */}
                                    </div>
                                </td>
                            </tr>) : reportData?.length > 0 ? (
                                reportData?.map((report) => (
                                    <tr key={report.id}>
                                         <td>
                                            <Form.Check
                                                checked={report.failureOn ? true : selectedChecks.includes(report.id)} 
                                                onChange={() => handleCheckboxChange(report.id)}
                                                // disabled={!report.failureOn} 
                                                className='custom-checkbox'
                                                type='checkbox'
                                                style={{ margin: "3px", padding: 0, verticalAlign: 'middle' }}
                                            />
                                        </td>
                                        <td>{report.profile}</td>
                                        <td>{report.reportName || "-"}</td>
                                        <td>{report.reportStatus}</td>
                                        <td>{report.completedOn}</td>
                                        <td>{report.completedOn}</td>
                                        <td>{report.failureReason || "-"}</td>
                                        <td>{report.failureOn ? new Date(report.failureOn).toLocaleDateString("en-GB") : "-"}</td>
                                    </tr>
                                ))
                            ) : filteredTableData?.length > 0 ? (
                                filteredTableData.map((report) => (
                                    <tr key={report.id}>
                                        <td>{report.profile}</td>
                                        <td>{report.reportName || "-"}</td>
                                        <td>{report.reportStatus}</td>
                                        <td>{report.completedOn}</td>
                                        <td>{report.completedOn}</td>
                                        <td>{report.failureReason || "-"}</td>
                                        <td>{report.failureOn ? new Date(report.failureOn).toLocaleDateString("en-GB") : "-"}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No data available for the selected date range.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="custom-table-footer">
                        <Row>
                            <Col md={5}>
                                <form className="table-footer-left">
                                    <span>Show</span>
                                    <label>
                                        <select
                                            className="form-select-dropdown"
                                            value={perPage}
                                            onChange={applyDataLength}
                                        >
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                            <option value="150">150</option>
                                            <option value="200">200</option>
                                        </select>
                                    </label>
                                    <span> of {totalItems} total entries</span>
                                </form>
                            </Col>
                            <Col md={7}>
                                <div className="table-footer-right">
                                    <Stack spacing={2}>
                                        <PaginationComponent
                                            // count={lastPage}
                                            // page={activePage}
                                            currentPage={activePage}
                                            totalItems={totalItems}
                                            itemPerPage={perPage}
                                            paginate={paginate}
                                            variant="outlined"
                                            shape="rounded"
                                            onChange={handleChange}
                                        />
                                    </Stack>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Row>
        </>
    )
}

export default Schedule