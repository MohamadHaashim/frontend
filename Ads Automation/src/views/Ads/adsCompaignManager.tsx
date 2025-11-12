import React, { Component } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col } from "react-bootstrap";
import "./index.css";

import LinkIcon from "../../assets/images/icons/link-icon.svg";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";

import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import Moment from "moment";

import MarketplaceTable from "./table/marketplace-table";
import AdGroupTable from "./table/adgroup-table";
import CampaignTable from "./table/campaign-table";
import PortfoliosTable from "./table/portfolio-table";
import ProductsTable from "./table/products-table";
import TargetingTable from "./table/targeting-table";
import SearchTermsTable from "./table/searchterms-table";
interface ProfileOption {
  value: string; // Adjust the type according to your data
  label: string;
}
interface ResultProps {
  searchResult: any;
}
class AdsCompaignManager extends Component<ResultProps> {
  filterData: any = [];
  current = new Date();
  startDate: any = new Date().setDate(this.current.getDate() - 30);
  endDate = new Date();

  state = {
    globalFilterFromData: [],
    searchKeyFilter: "",
    globalFilterDateRange: [new Date(new Date().setDate(new Date().getDate() - 30)), new Date()] as [Date, Date], 
    metaData: [],
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
    profileOptions: [] as ProfileOption[],
    selectedAccount: "",
    activeTab: "marketplace",
    selectedProfile: "SP",
  };
  constructor(props) {
    super(props);
    this.onChangeDateRangeSubmitGlobal =
      this.onChangeDateRangeSubmitGlobal.bind(this);
    // this.handleTabChange = this.handleTabChange.bind(this);
}

componentDidMount() {
  const accountId = localStorage.getItem("account");
  this.getMetaData();

  if (this.props.searchResult === "") {
    if (accountId) {
      this.setState({ selectedAccount: accountId });
    }
  } else {
    this.setState({ selectedAccount: this.props.searchResult });
  }

  this.startDate = new Date(this.current.setDate(this.current.getDate() - 30));
  this.endDate = new Date();
  this.setState({
    globalFilterDateRange: [this.startDate, this.endDate],
  });

  console.log("Initial Date Range:", this.state.globalFilterDateRange);
}

  componentDidUpdate(prevProps: ResultProps) {
    if (this.props.searchResult !== prevProps.searchResult) {
      this.setState({ selectedAccount: this.props.searchResult });
    }
     console.log(this.props.searchResult);
  }

  getMetaData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/MasterData/meta";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      this.setState({ metaData: responceData.result });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  handleNvEnter = (event) => {
    console.log("Nv Enter:", event);
  };
  handleCallback = (childData) => {
    this.setState({ globalFilterFromData: childData });
    this.filterData = childData;
  };
  handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      this.setState({ searchKeyFilter: event.target.value });
      event.preventDefault();
    }
  };

  cancelDropdown = () => {
    const eleRm: any = document.getElementById("dropdownCon");
    eleRm.classList.remove("open");

    const eleRm2: any = document.getElementById("dropdownCon2");
    eleRm2.classList.remove("open");
  };

  openDropdown(e) {
    const eleRm: any = document.getElementById("dropdownCon2");
    eleRm.classList.remove("open");

    const ele: any = document.getElementById("dropdownCon");
    ele.classList.add("open");
  }
  openDropdown2(e) {
    const eleRm: any = document.getElementById("dropdownCon");
    eleRm.classList.remove("open");

    const ele: any = document.getElementById("dropdownCon2");
    ele.classList.add("open");
  }

  onChangeDateRangeSubmitGlobal(e: [Date, Date] | null) {
    if (e && Array.isArray(e) && e[0] instanceof Date && e[1] instanceof Date) {
      console.log("Start Date:", e[0].toISOString());
      console.log("End Date:", e[1].toISOString());
      this.setState({ globalFilterDateRange: e });
    } else {
      console.error("Invalid date range:", e);
    }
  }

  handleTabChange = (tabKey) => {
    console.log(tabKey);
    this.setState({ activeTab: tabKey });
  };

  handleProfileChange = (e) => {
    this.setState({ selectedProfile: e.target.value });
  };

  render() {
    return (
      <DashboardLayout>
        <div className="main-cont-header ">
          <Row className="page-header ">
            <Col sm={12}>
              <div className="main-con-page-title-container">
                <div className="title">
                  <h3 className="page-title">Campaign Manager</h3>
                </div>

                <div className="filters">
                  <DateRangePicker
                    placeholder="Select Date Range"
                    onChange={(e) => this.onChangeDateRangeSubmitGlobal(e)}
                    format="yyyy-MM-dd"
                    shouldDisableDate={(date) => isAfter(date, new Date())}
                    defaultValue={this.state.globalFilterDateRange} 
                  />
                </div>
                <div className="accounts ms-2">
                  <select
                    className="form-select"
                    name="accountSelect"
                    id="accountSelect"
                    style={{ height: "40px", paddingBottom: "10px" }}
                    value={this.state.selectedProfile}
                    onChange={this.handleProfileChange}
                  >
                    <option value="SP">Sponsored Product</option>
                    <option value="SB">Sponsored Brand</option>
                    <option value="SD">Sponsored Display</option>
                  </select>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="main-content-container mt-4">
          <hr />
          <div className="dashboard-container padding-lr-30 campaing-manger">
            <div className="tab-container">
              <Tabs
                defaultActiveKey="marketplace"
                activeKey={this.state.activeTab}
                onSelect={this.handleTabChange}
              >
                <Tab eventKey="marketplace" title="Summary">
                  {this.state.activeTab === "marketplace" && (
                    <MarketplaceTable
                      checkBox={false}
                      tabName="Marketplaces"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                      selectedProfiles={this.state.selectedProfile}
                    />
                  )}
                </Tab>
                <Tab eventKey="portfolios" title="Portfolios">
                  {this.state.activeTab === "portfolios" && (
                    <PortfoliosTable
                      checkBox={false}
                      tabName="Portfolios"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                      selectedProfiles={this.state.selectedProfile}
                    />
                  )}
                </Tab>
                <Tab eventKey="campaign" title="Campaign">
                  {this.state.activeTab === "campaign" && (
                    <CampaignTable
                      checkBox={true}
                      tabName="Campaigns"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                      selectedProfiles={this.state.selectedProfile}
                    />
                  )}
                </Tab>
                <Tab eventKey="adgroup" title="Ad Group">
                  {this.state.activeTab === "adgroup" && (
                    <AdGroupTable
                      checkBox={true}
                      tabName="AdGroups"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                      selectedProfiles={this.state.selectedProfile}
                    />
                  )}
                </Tab>
                {this.state.selectedProfile !== "SB" ? (
                  <Tab eventKey="products" title="Products">
                    {this.state.activeTab === "products" && (
                      <ProductsTable
                        checkBox={true}
                        tabName="Products"
                        filterData={this.state.globalFilterFromData}
                        condition={this.state.selectedAccount}
                        searchKey={this.state.searchKeyFilter}
                        filterDateRange={this.state.globalFilterDateRange}
                        metaData={this.state.metaData}
                        selectedProfiles={this.state.selectedProfile}
                      />
                    )}
                  </Tab>
                ) : null}
                <Tab eventKey="targeting" title="Targeting">
                  {this.state.activeTab === "targeting" && (
                    <TargetingTable
                      checkBox={true}
                      tabName="Targets"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                      selectedProfiles={this.state.selectedProfile}
                    />
                  )}
                </Tab>
                {/* <Tab eventKey="products" title="Products">
                  {this.state.activeTab === "products" && (
                    <ProductsTable
                      checkBox={true}
                      tabName="Products"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                    />
                  )}
                </Tab>
                <Tab eventKey="searchterms" title="Search Terms">
                  {this.state.activeTab === "searchterms" && (
                    <SearchTermsTable
                      checkBox={false}
                      tabName="SearchTerms"
                      filterData={this.state.globalFilterFromData}
                      condition={this.state.selectedAccount}
                      searchKey={this.state.searchKeyFilter}
                      filterDateRange={this.state.globalFilterDateRange}
                      metaData={this.state.metaData}
                    />
                  )}
                </Tab> */}
              </Tabs>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default AdsCompaignManager;
