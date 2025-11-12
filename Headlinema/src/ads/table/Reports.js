import React, { useState, useEffect } from "react";
import DashboardLayout from "../../pages/DashboardLayout/index";
import { Row, Col } from "react-bootstrap";
import "./index.css";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import Moment from "moment";

import MarketplaceTable from "./marketplace-table";
import AdGroupTable from "./adgroup-table";
import CampaignTable from "./campaign-table";
import PortfoliosTable from "./portfolio-table";
import ProductsTable from "./products-table";
import TargetingTable from "./targeting-table";

import Select from 'react-select';
import Url from "../../Api";
import { useHistory } from 'react-router-dom';

const Reports = ({ searchResult }) => {
  const [globalFilterFromData, setGlobalFilterFromData] = useState([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");
  const [globalFilterDateRange, setGlobalFilterDateRange] = useState([
    Moment().subtract(30, "days").format("DD/MM/YYYY"),
    Moment().format("DD/MM/YYYY"),
  ]);
  const [metaData, setMetaData] = useState([]);
  const [lastUpdatedDate, setLastUpdatedDate] = useState(localStorage.getItem("lastUpdatedDate") || null);
  const [profileOptions, setProfileOptions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [activeTab, setActiveTab] = useState("marketplace");
  const [selectedProfile, setSelectedProfile] = useState("SP");
  const [selectedOption, setSelectedOption] = useState("");
  const [users, setUsers] = useState([])
  const [filteredTableData, setFilteredTableData] = useState([]);
  const [defaultProfile, setDefaultProfile] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [advancedFilterDateRange, setAdvancedFilterDateRange] = useState(null);
  // const [globalFilterDateRange, setGlobalFilterDateRange] = useState([]); // Date range state
  const defaultStartDate = Moment(new Date()).subtract(30, 'days').toDate();
  const defaultEndDate = new Date();
  const history = useHistory();


  useEffect(() => {
    const accountId = localStorage.getItem("account");
    getMetaData();

    if (searchResult === "") {
      if (accountId) {
        setSelectedAccount(accountId);
      }
    } else {
      setSelectedAccount(searchResult);
    }
    console.log(searchResult);
  }, [searchResult]);

  const getUserIdFromLocalStorage = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      console.log("Retrieved User ID from localStorage:", userId);
      return userId;
    } else {
      console.warn("No User ID found in localStorage");
      return null;
    }
  };

  const getMetaData = async () => {
    const token = localStorage.getItem("userToken");
    const AuthToken = "Bearer "+token;
    const url = "https://api.agilensmart.com/MasterData/meta";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responseData = await response.json();
      setMetaData(responseData.result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleNvEnter = (event) => {
    // console.log("Nv Enter:", event);
  };

  const handleCallback = (childData) => {
    setGlobalFilterFromData(childData);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setSearchKeyFilter(event.target.value);
      event.preventDefault();
    }
  };

  const cancelDropdown = () => {
    const eleRm = document.getElementById("dropdownCon");
    eleRm.classList.remove("open");

    const eleRm2 = document.getElementById("dropdownCon2");
    eleRm2.classList.remove("open");
  };

  const openDropdown = () => {
    const eleRm = document.getElementById("dropdownCon2");
    eleRm.classList.remove("open");

    const ele = document.getElementById("dropdownCon");
    ele.classList.add("open");
  };

  const openDropdown2 = () => {
    const eleRm = document.getElementById("dropdownCon");
    eleRm.classList.remove("open");

    const ele = document.getElementById("dropdownCon2");
    ele.classList.add("open");
  };

  const onChangeDateRangeSubmitGlobal = (range) => {
    if (range?.length === 2) {
      const formattedStartDate = Moment(range[0]).format("YYYY-MM-DD");
      const formattedEndDate = Moment(range[1]).format("YYYY-MM-DD");
      console.log("Date Range Selected:", formattedStartDate, formattedEndDate);

      setGlobalFilterDateRange([formattedStartDate, formattedEndDate]);
    } else {
      console.warn("Invalid date range selected");
    }
  };

  const handleTabChange = (tabKey) => {
    console.log(tabKey);
    setActiveTab(tabKey);
  };

  const handleProfileChange = (e) => {
    console.log("Profile Changed:", e.value);
    setSelectedProfile(e.value);
  };

  const customStyles = {
    dropdownIndicator: (base, state) => ({
      ...base,
      transition: "all .2s ease",
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null
    }),
    option: (provided, state) => ({
      ...provided,
      scrollbar: "thin",
      borderColor: "#ebb96e",
      backgroundColor: state.isSelected
        ? "" 
        : state.isFocused
        ? "" 
        : "",
      color: "black",
      "&:active": {
        backgroundColor: state.isFocused || state.isHovered ? "#ebb96e" : "transparent",
        color: "white"
      },
      borderBottom: '1px solid #ccc',
      cursor: "pointer",
      padding: "10px",
    }),
    control: (provided, state) => ({
      ...provided,
      width: "200px",
      marginRight: "-10px",
      borderColor: state.isFocused ? "#ebb96e" : "#ccc", // Focused border color
      borderWidth: "1px", // Ensuring border visibility
      boxShadow: state.isFocused ? "0 0 0 1px #ebb96e" : "", // Optional: Add box-shadow to highlight focus
      ":hover": {
        
        boxShadow: state.isFocused ? "0 0 0 1px #ebb96e" : "",
        borderColor: state.isFocused ? "#ebb96e" : "#ccc", // Retain yellow on hover when focused
      },
    }),
    menu: (provided) => ({
      
      ...provided,
      zIndex: 100,
      width:"200px"
    }),
  };
  

  // Log the initial dropdown value
  useEffect(() => {
    if (defaultProfile) {
      // console.log("Initial dropdown value:", defaultProfile?.value);
      localStorage.setItem('initialId', JSON.stringify(defaultProfile));
    }
  }, [defaultProfile]);


  const handledropdown = (selectedOption) => {
    console.log("Handledropdown", selectedOption?.value);

    if (!selectedOption || selectedOption.value === "all") {
      setSelectedAccount("");
      history.push("/Reports");
    } else {
      setSelectedAccount(selectedOption.value);
      history.push("/Reports", { state: { profileId: defaultProfile.value } });
      console.log("profileId", defaultProfile);
    }
  };

  useEffect(() => {
    handledropdown();
  }, []);

  const allprofile = async () => {
    const token = localStorage.getItem("token");
    const userId = getUserIdFromLocalStorage();

    try {

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
      console.log(data, "allprofiledata;")
      history.push("/Reports", { state: { profileId: selectedOption.value } });
      setUsers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (users && users.length > 0) {
      const uniqueProfiles = users.reduce((acc, current) => {
        if (!acc.some((item) => item.profileId === current.profileId)) {
          acc.push({
            value: current.profileId,
            label: current.accountInfo?.name?.trim() || "Unknown Name",
            id: current.profileId,
          });
        }
        return acc;
      }, []);
      setProfileOptions(uniqueProfiles);
      if (uniqueProfiles.length > 0) {
        setDefaultProfile(uniqueProfiles[0]);
      }
    }
  }, [users]);


  useEffect(() => {
    allprofile();
  }, []);

  return (
    <DashboardLayout>
      <div className="main-cont-header ">
        <Row className="page-header">
          <Col sm={12}>
            <div className="main-con-page-title-container">
              <div className="title">
                {/* <h3 className="page-title">Campaign Manager</h3> */}
              </div>
              <div>
                {profileOptions.length > 0 && (
                  <Select
                    // value={profileOptions}
                    defaultValue={profileOptions}
                    options={profileOptions}
                    onChange={handledropdown}
                    styles={customStyles}
                    isClearable
                  />
                )}
              </div>
              <div className="accounts ms-2">
                {/* <select
                  className="form-select"
                  name="accountSelect"
                  id="accountSelect"
                  style={{ height: "40px", paddingBottom: "10px" }}
                  value={selectedProfile}
                  onChange={handleProfileChange}
                >
                  <option value="SP">Sponsored Product</option>
                  <option value="SB">Sponsored Brand</option>
                  <option value="SD">Sponsored Display</option>
                </select> */}
                <Select
                  defaultValue={{value:"SP",label:"Sponsored Product"}} 
                  options={[{value:"SP",label:"Sponsored Product"},{value:"SB",label:"Sponsored Brand"},{value:"SD",label:"Sponsored Display"}]} 
                  onChange={handleProfileChange} 
                  styles={customStyles} 
                  isClearable 
                />
              </div>
              <div className="filters">
                <DateRangePicker
                  placeholder="Select Date Range"
                  onChange={onChangeDateRangeSubmitGlobal}
                  format="yyyy-MM-dd"
                  disabledDate={(date) => isAfter(date, new Date())}
                  defaultValue={[
                    Moment().subtract(30, "days").toDate(),
                    new Date(),
                  ]}
                />
              </div>

            </div>
          </Col>
        </Row>
      </div>
      <div className="main-content-container mt-4">
        <hr />
        <div className="dashboard-container padding-lr-30 campaing-manger">
          <div className="tab-container container">
            <Tabs
              defaultActiveKey="marketplace"
              activeKey={activeTab}
              onSelect={handleTabChange}
            >
              <Tab eventKey="marketplace" title="Summary">
                {activeTab === "marketplace" && (
                  <MarketplaceTable
                    checkBox={false}
                    tabName="Marketplaces"
                    filterData={globalFilterFromData}
                    condition={selectedAccount}
                    searchKey={searchKeyFilter}
                    filterDateRange={globalFilterDateRange}
                    metaData={metaData}
                    selectedProfiles={selectedProfile}
                  />
                )}
              </Tab>
              <Tab eventKey="portfolios" title="Portfolios">
                {activeTab === "portfolios" && (
                  <PortfoliosTable
                    checkBox={false}
                    tabName="Portfolios"
                    filterData={globalFilterFromData}
                    condition={selectedAccount}
                    searchKey={searchKeyFilter}
                    filterDateRange={globalFilterDateRange}
                    metaData={metaData}
                    selectedProfiles={selectedProfile}
                  />
                )}
              </Tab>
              <Tab eventKey="campaign" title="Campaign">
                {activeTab === "campaign" && (
                  <CampaignTable
                    checkBox={true}
                    tabName="Campaigns"
                    filterData={globalFilterFromData}
                    condition={selectedAccount}
                    searchKey={searchKeyFilter}
                    filterDateRange={globalFilterDateRange}
                    metaData={metaData}
                    selectedProfiles={selectedProfile}
                  />
                )}
              </Tab>
              <Tab eventKey="adgroup" title="Ad Group">
                {activeTab === "adgroup" && (
                  <AdGroupTable
                    checkBox={true}
                    tabName="AdGroups"
                    filterData={globalFilterFromData}
                    condition={selectedAccount}
                    searchKey={searchKeyFilter}
                    filterDateRange={globalFilterDateRange}
                    metaData={metaData}
                    selectedProfiles={selectedProfile}
                  />
                )}
              </Tab>
              {selectedProfile !== "SB" && (
                <Tab eventKey="products" title="Products">
                  {activeTab === "products" && (
                    <ProductsTable
                      checkBox={true}
                      tabName="Products"
                      filterData={globalFilterFromData}
                      condition={selectedAccount}
                      searchKey={searchKeyFilter}
                      filterDateRange={globalFilterDateRange}
                      metaData={metaData}
                      selectedProfiles={selectedProfile}
                    />
                  )}
                </Tab>
              )}
              <Tab eventKey="targeting" title="Targeting">
                {activeTab === "targeting" && (
                  <TargetingTable
                    checkBox={true}
                    tabName="Targets"
                    filterData={globalFilterFromData}
                    condition={selectedAccount}
                    searchKey={searchKeyFilter}
                    filterDateRange={globalFilterDateRange}
                    metaData={metaData}
                    selectedProfiles={selectedProfile}
                  />
                )}
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
// }

export default Reports;

