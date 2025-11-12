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

import Campaigns from './BudgetRulestable/campaigns';
import BudgetRules from "./BudgetRulestable/BudgetRules";
import Reports from "./BudgetRulestable/Reports";
import CampaignHistory from "./BudgetRulestable/CampaignHistory";
import CampaignSchedules from "./BudgetRulestable/CampaignSchedules";

interface ProfileOption {
  value: string; // Adjust the type according to your data
  label: string;
}
interface ResultProps {
  searchResult: any;
}
class BudgetOptimizer extends Component<ResultProps> {
  filterData: any = [];
  current = new Date();
  startDate: any = new Date().setDate(this.current.getDate() - 30);
  endDate = new Date();

  state = {
    globalFilterFromData: [],
    searchKeyFilter: "",
    globalFilterDateRange: [this.startDate, this.endDate],
    metaData: [],
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
    profileOptions: [] as ProfileOption[],
    selectedAccount: "",
    activeTab: "campaigns",
    selectedProfile: "SP",
    activePage:""
  };
  
  constructor(props) {
    super(props);
    this.onChangeDateRangeSubmitGlobal =
      this.onChangeDateRangeSubmitGlobal.bind(this);

    // Ensure startDate and endDate are Date objects
    this.startDate = new Date(); // Replace with the actual start date if needed
    this.endDate = new Date();  // Replace with the actual end date if needed

    this.state = {
      globalFilterDateRange: [this.startDate, this.endDate],
      globalFilterFromData: [], // Default empty array
      searchKeyFilter: '',      // Default empty string
      metaData: [],             // Default empty array
      lastUpdatedDate: null,    // Default null
      profileOptions: [],       // Default empty array for ProfileOption[]
      selectedAccount: '',      // Default empty string
      activeTab: "campaigns",            // Default empty string
      selectedProfile: '',  
      activePage:"3065292213630992",
      
  };
}

  componentDidMount() {
    const profileId = localStorage.getItem("BudgetProfileId");
    this.getMetaData();
    const { searchResult } = this.props;

    if (searchResult === "") {
      if (profileId) {
        this.setState({ selectedAccount: profileId });
      }
    } else {
      this.setState({ selectedAccount: searchResult });
    }

    console.log(this.props.searchResult);
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
      this.setState({activePage:event.target.value});
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

  // onChangeDateRangeSubmitGlobal(e) {
  //   console.log(Moment(e[0]).format("YYYY-MM-DD"));
  //   console.log(e[1]);
  //   let dateRange = e;
  //   if (dateRange.length > 0) {
  //     this.setState({ globalFilterDateRange: dateRange });
  //   }
  // }

  onChangeDateRangeSubmitGlobal(e) {
    console.log(Moment(e[0]).format("YYYY-MM-DD"));
    console.log(Moment(e[1]).format("YYYY-MM-DD")); // Ensure consistent formatting

    if (e && e.length > 0) {
        this.setState({ globalFilterDateRange: e });
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
                  <h3 className="page-title">Budget Optimizer</h3>
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
                defaultActiveKey="campaigns"
                activeKey={this.state.activeTab}
                onSelect={this.handleTabChange}
              >
                <Tab eventKey="campaigns" title="Campaigns">
                  {this.state.activeTab === "campaigns" && (
                    <Campaigns
                    condition={this.state.selectedAccount}
                    />
                  )}
                </Tab>
                <Tab eventKey="BudgetRules" title="Budget Rules">
                  {this.state.activeTab === "BudgetRules" && (
                    // <PortfoliosTable
                    //   checkBox={false}
                    //   tabName="Portfolios"
                    //   filterData={this.state.globalFilterFromData}
                    //   condition={this.state.selectedAccount}
                    //   searchKey={this.state.searchKeyFilter}
                    //   filterDateRange={this.state.globalFilterDateRange}
                    //   metaData={this.state.metaData}
                    //   selectedProfiles={this.state.selectedProfile}
                    // />
                    <BudgetRules
                      condition={this.state.selectedAccount}
                    />
                  )}
                </Tab>
                <Tab eventKey="Reports" title="Reports">
                  {this.state.activeTab === "Reports" && (
                    // <CampaignTable
                    //   checkBox={true}
                    //   // tabName="Campaigns"
                    //   filterData={this.state.globalFilterFromData}
                    //   condition={this.state.selectedAccount}
                    //   searchKey={this.state.searchKeyFilter}
                    //   filterDateRange={this.state.globalFilterDateRange}
                    //   metaData={this.state.metaData}
                    //   selectedProfiles={this.state.selectedProfile}
                    // />
                    <Reports
                        condition={this.state.selectedAccount}
                    />
                  )}
                </Tab>
                <Tab eventKey="adgroup" title="Campaign Schedules">
                  {this.state.activeTab === "adgroup" && (
                    // <AdGroupTable
                    //   checkBox={true}
                    //   tabName="AdGroups"
                    //   filterData={this.state.globalFilterFromData}
                    //   condition={this.state.selectedAccount}
                    //   searchKey={this.state.searchKeyFilter}
                    //   filterDateRange={this.state.globalFilterDateRange}
                    //   metaData={this.state.metaData}
                    //   selectedProfiles={this.state.selectedProfile}
                    // />
                    <CampaignSchedules
                        condition={this.state.selectedAccount}
                    />
                  )}
                </Tab>
                {this.state.selectedProfile !== "SB" ? (
                  <Tab eventKey="CampaignHistory" title="Campaign History">
                    {this.state.activeTab === "CampaignHistory" && (
                      // <ProductsTable
                      //   checkBox={true}
                      //   tabName="Products"
                      //   filterData={this.state.globalFilterFromData}
                      //   condition={this.state.selectedAccount}
                      //   searchKey={this.state.searchKeyFilter}
                      //   filterDateRange={this.state.globalFilterDateRange}
                      //   metaData={this.state.metaData}
                      //   selectedProfiles={this.state.selectedProfile}
                      // />
                      <CampaignHistory
                        condition={this.state.selectedAccount}
                      />
                    )}
                  </Tab>
                ) : null}
                {/* <Tab eventKey="targeting" title="Targeting">
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
                </Tab> */}
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

export default BudgetOptimizer;
