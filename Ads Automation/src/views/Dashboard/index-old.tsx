import React, { Component } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col, Tabs, Tab, Spinner } from "react-bootstrap";
import "./index.css";
import CusDataTable from "../../components/CusDataTable";
import SemiCircleProgressBar from "react-progressbar-semicircle";
import LinkIcon from "../../assets/images/icons/link-icon.svg";
import AddIcon from "../../assets/images/icons/add-icon.svg";
import ResetIcon from "../../assets/images/icons/reset-icon.svg";
import ShareIcon from "../../assets/images/icons/share-icon.svg";
import CalenderIcon from "../../assets/images/icons/calendar-icon.svg";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import MoreActionIcon from "../../assets/images/icons/more-action-icon.svg";
import InfoCircleIcon from "../../assets/images/icons/info-circle-icon.svg";
import Image1 from "../../assets/images/Image-1.png";
import Image2 from "../../assets/images/Image-2.png";
import Image3 from "../../assets/images/Image-3.png";
import Image4 from "../../assets/images/Image-4.png";
import { Link } from "react-router-dom";
import Moment from "moment";
import Areachart from "../../components/Charts/Areachart";
import Charts from "../../components/Charts/Chart";
import ChartsRed from "../../components/Charts/Chart-red";
import Stackedbar from "../../components/Charts/Stackedbar";
import PauseIcon from "../../assets/images/icons/pause.svg";
import ExportIcon from "../../assets/images/icons/export.svg";
import BooksTable from "./table/books-table";
import AuthorsTable from "./table/author-table";
import MarketplaceTable from "./table/marketplace-table";
import BestSeller from "./bestSeller/bestSeller";
import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import RoyaltiesProjected from "../../components/Charts/RoyaltiesProjectedChart";
import SpendChart from "../../components/Charts/SpendChart";
import RoyaltiesProjectedChart from "../../components/Charts/RoyaltiesProjectedChart";
import RoyaltiesDistributionChart from "../../components/Charts/RoyaltiesDistributionChart";
import { Modal } from "antd";
import Synckdpextension from "./Synckdpextension";
let advancedFilterDateRange: any = [];
export default class Dashboard extends Component {
  filterData: any = [];
  current = new Date();
  startDate: any = new Date().setDate(this.current.getDate() - 30);
  endDate = new Date();
  startDateFilter =
    Moment(this.startDate).format("YYYY-MM-DD") + "T00:00:01.064Z";

  endDateFilter = Moment(this.endDate).format("YYYY-MM-DD") + "T23:50:59.064Z";
  constructor(props) {
    super(props);
    this.onChangeDateRangeSubmitGlobal =
      this.onChangeDateRangeSubmitGlobal.bind(this);
    // const currentDate = new Date();
    // const endDate = currentDate.toISOString(); // Current date as the end date
    // currentDate.setDate(currentDate.getDate() - 30); // Subtract 30 days
    // const startDate = currentDate.toISOString();

    // this.state = {
    //   startDate,
    //   endDate,
    //   // Other state variables
    // };
  }
  state = {
    startDate: "",
    endDate: "",
    syncData: "",
    globalFilterFromData: [],
    bestSellerData: [],
    salesAvgValue: "",
    salesMetricName: "",
    salesValue: "",
    budgetAvgValue: "",
    budgetMetricName: "",
    budgetValue: "",
    CPCAvgValue: "",
    CPCMetricName: "",
    CPCValue: "",
    orderAvgValue: "",
    orderMetricName: "",
    orderValue: "",
    searchKeyFilter: "",
    CRData1: "",
    CRData2: "",
    CRAvarageValue: "",
    CRPercentage: "",
    loading: false,
    categories: "",
    salesAvarageValue: "",
    salesPercentage: "",
    royaltiesDistributionValue: "",
    royaltiesDistributionPercentage: "",
    royaltiesProjectedValue: "",
    royaltiesProjectedPercentage: "",
    globalFilterDateRange: [this.startDate, this.endDate],
    spendChartData: [],
    SpenLoading: false,
    isModalVisible: false,
  };

  componentDidMount(): void {
    this.getSalesDateRange();
    this.getCPCDateRange();
    this.getBudgetDateRange();
    this.getCR();
    this.getSpendChartData();
    this.getOrderDateRange();
    this.getChartRoyaltiesDistributionData();
    this.getChartRoyaltiesProjectedData();

    console.log("Date=" + this.state.globalFilterDateRange);
  }
  getSpendChartData = async () => {
    try {
      this.setState({
        salesAvarageValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      this.setState({ SpenLoading: true });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;

      const responseBudget = await fetch(
        "https://api.aimosa.io/Dashboard/ChartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            marketPlaces: ["AU"],

            metricName: "Sales",
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
          }),
        }
      );
      const responseChartData = await responseBudget.json();
      var chartData = responseChartData.result;
      this.setState({ spendChartData: chartData });
      this.setState({
        salesAvarageValue: chartData.seriesData[0].avrage.toFixed(3),
      });
      this.setState({
        salesPercentage: chartData.seriesData[0].percentageChange.toFixed(1),
      });

      this.setState({ SpenLoading: false });
      // console.log("Chart==" + this.state.categories);
      // console.log("Chart==" + this.state.chertRed.nameValue);
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  getChartRoyaltiesDistributionData = async () => {
    try {
      this.setState({
        royaltiesDistributionValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const responseBudget = await fetch(
        "https://api.aimosa.io/Dashboard/ChartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            name: "LineChart",
            metricName: "RoyaltiesDistribution",
            marketPlaces: ["AU"],
          }),
        }
      );
      const responseChartData = await responseBudget.json();
      console.log("DistribustionResponseChartData==", responseChartData.result);
      var chartData = responseChartData.result;
      this.setState({
        royaltiesDistributionValue: chartData.seriesData[0].avrage,
      });
      this.setState({
        royaltiesDistributionPercentage:
          chartData.seriesData[0].percentageChange,
      });
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  getChartRoyaltiesProjectedData = async () => {
    try {
      this.setState({
        royaltiesProjectedValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const responseBudget = await fetch(
        "https://api.aimosa.io/Dashboard/ChartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            name: "LineChart",
            metricName: "RoyaltiesProjected",
            marketPlaces: ["AU"],
          }),
        }
      );
      try {
        const responseChartData = await responseBudget.json();
        console.log("RoyaltiesProjected==", responseChartData.result);
        var chartData = responseChartData.result;

        if (chartData.seriesData[0].avrage) {
          this.setState({
            royaltiesProjectedValue: chartData.seriesData[0].avrage,
          });
        }
        if (chartData.seriesData[0].percentageChange) {
          this.setState({
            royaltiesDistributionPercentage:
              chartData.seriesData[0].percentageChange,
          });
        }
      } catch {
        this.setState({
          royaltiesProjectedPercentage: " ",
        });
        this.setState({
          royaltiesProjectedValue: " ",
        });
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  lastAppSyncClick = () => {
    this.setState({
      isModalVisible: true,
    });
  };

  handleModalClose = () => {
    this.setState({
      isModalVisible: false,
    });
  };
  getCR = async () => {
    try {
      this.setState({ loading: true });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;

      const response = await fetch(
        "https://api.aimosa.io/Dashboard/ChartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            metricName: "CR",
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            marketPlaces: ["AU"],
          }),
        }
      );
      const responceData = await response.json();

      console.log("dataCR=" + responceData.result.seriesData[0].data);

      let cr = responceData.result.seriesData[0].data + "";
      let crrr: any = cr.split(",", 1);
      let dataFirstValue = parseInt(crrr, 10);
      var data1 = dataFirstValue.toFixed();
      let c = responceData.result.seriesData[0].data + "";
      let crrrr: any = c.split(",");
      let dataSecondValue = parseInt(crrrr[1], 10);
      var data2 = dataSecondValue.toFixed();

      // var data2= dataSecondValue.toFixed(3);
      var crData = responceData.result.seriesData[0];
      // console.log("ddd=" + responceData);
      // console.log("CRData=" + crData.data);
      // console.log("CRAvrage=" + crData.avrage);
      // console.log("CRPercentage=" + crData.percentageChange);

      this.setState({ CRData1: data1 });
      this.setState({ CRData2: data2 });
      this.setState({
        CRAvarageValue: responceData.result.seriesData[0].avrage.toFixed(),
      });
      this.setState({
        CRPercentage:
          responceData.result.seriesData[0].percentageChange.toFixed(2),
      });
      // console.log("ddd=" + responceData);
      // console.log("CRData=" + this.state.CRData);
      // console.log("CRAvrage=" + this.state.CRAvarageValue);
      // console.log("CRPercentage=" + this.state.CRPercentage);
      this.setState({ loading: false });
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  onChangeDateRangeSubmitGlobal = async (e) => {
    let dateRanges = e;
    if (dateRanges.length > 0) {
      this.setState({ globalFilterDateRange: dateRanges });
      if (this.state.globalFilterDateRange.length > 0) {
        advancedFilterDateRange = {
          dateRange: "Custom",
          startDate:
            Moment(this.state.globalFilterDateRange[0]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
          endDate:
            Moment(this.state.globalFilterDateRange[1]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
        };
      }

      // console.log("Date=", advancedFilterDateRange);
      this.getSalesDateRange();
      this.getCPCDateRange();
      this.getBudgetDateRange();
      // this.getCR();
      this.getSpendChartData();
      this.getOrderDateRange();
      this.getChartRoyaltiesDistributionData();
      this.getChartRoyaltiesProjectedData();
    }
  };
  getCPCDateRange = async () => {
    try {
      this.setState({
        CPCValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const responseCPC = await fetch(
        "https://api.aimosa.io/Dashboard/Metrics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            metricName: "CPC",
            marketPlaces: ["AU"],
          }),
        }
      );
      const responceCPCData = await responseCPC.json();
      // console.log("sale=", responceCPCData.result);
      this.setState({ CPCAvgValue: responceCPCData.result[0].avgvalue });
      this.setState({ CPCMetricName: responceCPCData.result[0].matricName });
      if (responceCPCData.result[0].value) {
        this.setState({ CPCValue: responceCPCData.result[0].value.toFixed(3) });
      }
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  getBudgetDateRange = async () => {
    try {
      this.setState({
        budgetValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const responseBudget = await fetch(
        "https://api.aimosa.io/Dashboard/Metrics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            metricName: "Budget",
            marketPlaces: ["AU"],
          }),
        }
      );
      const responseBudgetData = await responseBudget.json();
      // console.log("budget==", responseBudgetData.result);
      this.setState({ budgetAvgValue: responseBudgetData.result[0].avgvalue });
      this.setState({
        budgetMetricName: responseBudgetData.result[0].matricName,
      });
      if (responseBudgetData.result[0].value) {
        this.setState({
          budgetValue: responseBudgetData.result[0].value.toFixed(3),
        });
      }
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  getSalesDateRange = async () => {
    try {
      this.setState({
        salesValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const responseSales = await fetch(
        "https://api.aimosa.io/Dashboard/Metrics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            metricName: "Sales",
            marketPlaces: ["AU"],
          }),
        }
      );
      const responceSalesData = await responseSales.json();
      // console.log("sale=", responceSalesData.result);
      this.setState({ salesAvgValue: responceSalesData.result[0].avgvalue });
      this.setState({
        salesMetricName: responceSalesData.result[0].matricName,
      });
      if (responceSalesData.result[0].value) {
        this.setState({
          salesValue: responceSalesData.result[0].value.toFixed(3),
        });
      }
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  getOrderDateRange = async () => {
    try {
      this.setState({
        orderValue: (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ),
      });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const responseSales = await fetch(
        "https://api.aimosa.io/Dashboard/Metrics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            dateRanges: {
              dateRange: "Custom",
              startDate: this.startDateFilter,
              endDate: this.endDateFilter,
            },
            marketPlaces: ["AU"],
            metricName: "Order",
          }),
        }
      );
      const responceSalesData = await responseSales.json();
      console.log("order=", responceSalesData.result);
      console.log("orderavg=" + responceSalesData.result[0].value);

      this.setState({ orderAvgValue: responceSalesData.result[0].avgvalue });
      this.setState({
        orderMetricName: responceSalesData.result[0].matricName,
      });

      this.setState({
        orderValue: responceSalesData.result[0].value,
      });
    } catch (error) {
      console.error(error); // You might send an exception to your error tracker like AppSignal
      return error;
    }
  };
  selectPlan = (eve) => {
    const selectedPlan: any = document.querySelectorAll(".filterBtnClick");
    if (selectedPlan.length > 0) {
      const clearEle: any = document.querySelectorAll(
        ".filterBtnClick.selected"
      );
      for (var i = 0; i < clearEle.length; i++) {
        clearEle[i].classList.remove("selected");
      }
      for (let i = 0; i < selectedPlan.length; i++) {
        if (selectedPlan[i].contains(eve.target)) {
          selectedPlan[i].classList.add("selected");
        }
      }
    }
  };

  cancelDropdown = () => {
    const eleRm: any = document.getElementsByClassName("dropdown-menu");
    for (let i = 0; i < eleRm.length; i++) {
      eleRm[i].classList.remove("show");
    }
  };

  render() {
    return (
      <DashboardLayout>
        <div className="main-cont-header dashboard-container">
          <Row className="page-header">
            <Col>
              <Row>
                <Col md={8} style={{ display: "flex" }}>
                  <div className="input-group calender">
                    <span
                      className="input-group-text"
                      id="inputGroup-sizing-sm"
                    >
                      <img src={CalenderIcon} alt="calender icon" />

                      {/* <input
                      type="date"
                      className="form-control"
                      placeholder="Select a timeline"
                      aria-label="Username"
                      aria-describedby="addon-wrapping"
                      onChange={this.dateTimeLine}
                    /> */}
                      <DateRangePicker
                        placeholder="Select a timeline"
                        onOk={this.onChangeDateRangeSubmitGlobal}
                        format="yyyy-MM-dd"
                        disabledDate={(date) => isAfter(date, new Date())}
                        defaultValue={[this.startDate, new Date()]}
                      />
                    </span>
                  </div>
                  <div className="filter-item filter-link-container dropdownContent global-dashboard-filter">
                    <p
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                      data-bs-display="static"
                    >
                      <i>
                        <img src={FilterIcon} alt="filter icon" />
                      </i>
                      <span>Filter</span>
                      <i
                        className="fa fa-angle-down down-arrow-right"
                        aria-hidden="true"
                      ></i>
                    </p>
                    <div
                      className="dropdown-menu dropdown-menu-lg-start"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <h6 className="modelText">Filter</h6>
                      <Row>
                        <Col md={6}>
                          <label>Title</label>
                          <select className="form-control">
                            <option>select one</option>
                          </select>
                        </Col>
                        <Col md={6}>
                          <label>Marketplace</label>
                          <select className="form-control">
                            <option>select one</option>
                          </select>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <label>Author</label>
                          <select className="form-control">
                            <option>select one</option>
                          </select>
                        </Col>
                        <Col md={6}>
                          <label>Book Format</label>
                          <select className="form-control">
                            <option>select one</option>
                          </select>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <label>Ad Type</label>
                          <div className="adTypeButtons">
                            <button
                              className="filterBtnClick"
                              onClick={this.selectPlan}
                            >
                              All Type
                            </button>
                            <button
                              className="filterBtnClick"
                              onClick={this.selectPlan}
                            >
                              Auto
                            </button>
                            <button
                              className="filterBtnClick"
                              onClick={this.selectPlan}
                            >
                              Manual
                            </button>
                          </div>
                        </Col>
                        <Col md={6}>
                          <label>Campaign</label>
                          <select className="form-control">
                            <option>select one</option>
                          </select>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <label>Platform</label>
                          <select className="form-control">
                            <option>select one</option>
                          </select>
                        </Col>
                        <div className="col-md-6"></div>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <div className="filterModelBottomButtoms">
                            <button
                              className="filterModelCancelBtn"
                              onClick={this.cancelDropdown}
                            >
                              Cancel
                            </button>
                            <button className="filterModelApplyFilterBtn" onClick={this.cancelDropdown}>
                              Apply Filter
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col className="text-end last-sync">
              <span>
                <i>
                  <img
                    src={LinkIcon}
                    alt="refresh icon"
                    onClick={this.lastAppSyncClick}
                    style={{ cursor: "pointer" }}
                  />
                </i>{" "}
                Sync Kdp
                {this.state.syncData}
              </span>
            </Col>
            <Modal
              title="Sync Data"
              visible={this.state.isModalVisible}
              onCancel={this.handleModalClose}
              footer={null}
            >
              <p>{this.state.syncData}</p>
              <Synckdpextension />
            </Modal>
          </Row>
          <Row>
            <Col className="dashoard-nav mt-4 mb-4">
              <Link to={""}>Dashboard</Link> {">"} Default
            </Col>
            <Col>
              <div className="d-flex justify-content-end header-actions mt-4">
                <div className="text-green px-3">
                  <i>
                    <img src={AddIcon} alt="add icon" />
                  </i>{" "}
                  Add
                </div>
                <div className="px-3">
                  <i>
                    <img src={ResetIcon} alt="reset  icon" />
                  </i>{" "}
                  Reset
                </div>
                <div className="px-3">
                  <i>
                    <img src={ShareIcon} alt="share icon" />
                  </i>{" "}
                  Share
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="dashboard-container dashboard-page padding-lr-30">
          <Row>
            <Col md={6}>
              <Row>
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <div className="widget-container height-220">
                        <div className="widget-header mb-4">
                          <Row>
                            <Col md={9} className="widget-select-container">
                              <div className="input-group filter">
                                <select
                                  defaultValue={"DEFAULT"}
                                  className="form-select widget-select"
                                  id="inputGroupSelect02"
                                >
                                  <option value="DEFAULT">Select</option>
                                  <option value="1">One</option>
                                  <option value="2">Two</option>
                                  <option value="3">Three</option>
                                </select>
                                <span>
                                  <img
                                    src={InfoCircleIcon}
                                    alt="more action icon"
                                  />
                                </span>
                              </div>
                            </Col>
                            <Col md={3} className="p-0">
                              <div className="more-action-icon">
                                <img
                                  src={MoreActionIcon}
                                  alt="info circle icon"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <SemiCircleProgressBar
                          percentage={33}
                          showPercentValue
                          diameter={115}
                          stroke={"#00D26E"}
                          strokeWidth={8}
                        />
                        <div>
                          <p className="widget-p-sub-text">$200/$5</p>
                        </div>
                        <div className="widget-status-container up">24.5%</div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="widget-container height-220">
                        <div className="widget-header mb-4">
                          <Row>
                            <Col md={9} className="widget-select-container">
                              <div className="input-group filter">
                                <select
                                  className="form-select widget-select"
                                  id="inputGroupSelect02"
                                  defaultValue={"DEFAULT"}
                                >
                                  <option value="DEFAULT">CR</option>
                                  <option value="1">One</option>
                                  <option value="2">Two</option>
                                  <option value="3">Three</option>
                                </select>
                                <span>
                                  <img
                                    src={InfoCircleIcon}
                                    alt="more action icon"
                                  />
                                </span>
                              </div>
                            </Col>
                            <Col md={3} className="p-0">
                              <div className="more-action-icon">
                                <img
                                  src={MoreActionIcon}
                                  alt="info circle icon"
                                />
                              </div>
                            </Col>
                          </Row>
                        </div>
                        {!this.state.loading ? (
                          <div className="spinHeader">
                            <Spinner animation="border" role="status">
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </Spinner>
                          </div>
                        ) : (
                          <>
                            <SemiCircleProgressBar
                              percentage={this.state.CRAvarageValue}
                              showPercentValue
                              diameter={115}
                              stroke={"#ED787F"}
                              strokeWidth={8}
                            />
                            <div>
                              <p className="widget-p-sub-text">
                                {this.state.CRData1 == null ? (
                                  <>
                                    ${this.state.CRData1}/{this.state.CRData2}
                                  </>
                                ) : (
                                  <>no data</>
                                )}
                                /
                                {this.state.CRData2 == null ? (
                                  <>
                                    ${this.state.CRData1}/{this.state.CRData2}
                                  </>
                                ) : (
                                  <>no data</>
                                )}
                              </p>
                            </div>
                            <div className="widget-status-container down">
                              {this.state.CRPercentage}%
                            </div>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Col>
                <Col md={6}>
                  <div className="widget-container height-220">
                    <div className="widget-header">
                      <Row>
                        <Col md={9} className="widget-select-container">
                          <div className="input-group filter">
                            <select
                              className="form-select widget-select"
                              id="inputGroupSelect02"
                              defaultValue={"DEFAULT"}
                            >
                              <option value="DEFAULT">
                                Royalties [Distribution]
                              </option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                            <span>
                              <img
                                src={InfoCircleIcon}
                                alt="more action icon"
                              />
                            </span>
                          </div>
                        </Col>
                        <Col md={3} className="p-0">
                          <div className="more-action-icon">
                            <img src={MoreActionIcon} alt="info circle icon" />
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <RoyaltiesDistributionChart />
                    {/* < RedChart /> */}
                    <div className="widget-footer">
                      <Row>
                        <Col md={7}>
                          <div className="widget-footer-title">
                            {/* ${this.state.royaltiesDistributionValue} */}
                            {this.state.royaltiesDistributionValue == null ? (
                              <>{this.state.royaltiesDistributionValue}%</>
                            ) : (
                              <p className="noData">no data</p>
                            )}
                          </div>
                        </Col>
                        <Col md={5} className="align-end">
                          <div className="widget-status-container up">
                            {this.state.royaltiesDistributionPercentage}%
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={6}>
                  <div className="widget-container height-220">
                    <div className="widget-header">
                      <Row>
                        <Col md={9} className="widget-select-container">
                          <div className="input-group filter">
                            <select
                              className="form-select widget-select"
                              id="inputGroupSelect02"
                              defaultValue={"DEFAULT"}
                            >
                              <option value="DEFAULT">Spend [Total]</option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                            <span>
                              <img
                                src={InfoCircleIcon}
                                alt="more action icon"
                              />
                            </span>
                          </div>
                        </Col>
                        <Col md={3} className="p-0">
                          <div className="more-action-icon">
                            <img src={MoreActionIcon} alt="info circle icon" />
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {/* <ChartsRed chart={this.state.categories} /> */}
                    {/* {this.state.SpenLoading  ? <>loading</>: */}
                    <SpendChart data={this.state.spendChartData} />
                    {/* } */}

                    <div className="widget-footer">
                      <Row>
                        <Col md={7}>
                          <div className="widget-footer-title">
                            {/* ${this.state.salesAvarageValue} */}
                            {this.state.salesAvarageValue == null ? (
                              <>{this.state.salesAvarageValue}%</>
                            ) : (
                              <p className="noData">no data</p>
                            )}
                          </div>
                        </Col>
                        <Col md={5} className="align-end">
                          <div className="widget-status-container down">
                            {this.state.salesPercentage}%
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="widget-container height-220">
                    <div className="widget-header">
                      <Row>
                        <Col md={9} className="widget-select-container">
                          <div className="input-group filter">
                            <select
                              className="form-select widget-select"
                              id="inputGroupSelect02"
                              defaultValue={"DEFAULT"}
                            >
                              <option value="DEFAULT">
                                Royalties [Projected]
                              </option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                            <span>
                              <img
                                src={InfoCircleIcon}
                                alt="more action icon"
                              />
                            </span>
                          </div>
                        </Col>
                        <Col md={3} className="p-0">
                          <div className="more-action-icon">
                            <img src={MoreActionIcon} alt="info circle icon" />
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <RoyaltiesProjected />
                    <div className="widget-footer">
                      <Row>
                        <Col md={7}>
                          <div className="widget-footer-title">
                            {this.state.royaltiesProjectedValue == null ? (
                              <>{this.state.royaltiesProjectedValue}%</>
                            ) : (
                              <p className="noData">no data</p>
                            )}
                          </div>
                        </Col>
                        <Col md={5} className="align-end">
                          <div className="widget-status-container up">
                            {this.state.royaltiesProjectedPercentage == null ? (
                              <>{this.state.royaltiesProjectedPercentage}%</>
                            ) : (
                              <>0%</>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <div className="widget-container height-110">
                <div className="widget-header">
                  <Row>
                    <Col md={9} className="widget-select-container">
                      <div className="input-group filter">
                        <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">Budget</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        <span>
                          <img src={InfoCircleIcon} alt="more action icon" />
                        </span>
                      </div>
                    </Col>
                    <Col md={3} className="p-0">
                      <div className="more-action-icon">
                        <img src={MoreActionIcon} alt="info circle icon" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="widget-footer">
                  <Row>
                    <Col md={7}>
                      <div className="widget-footer-title">
                        {/* ${this.state.budgetValue} */}
                        {this.state.budgetValue == null ? (
                          <>${this.state.budgetValue}%</>
                        ) : (
                          <p className="noData">no data</p>
                        )}
                      </div>
                    </Col>
                    <Col md={5} className="align-end">
                      <div className="widget-status-container down">
                        {this.state.budgetAvgValue}%
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="widget-container height-110">
                <div className="widget-header">
                  <Row>
                    <Col md={9} className="widget-select-container">
                      <div className="input-group filter">
                        <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">CPC</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        <span>
                          <img src={InfoCircleIcon} alt="more action icon" />
                        </span>
                      </div>
                    </Col>
                    <Col md={3} className="p-0">
                      <div className="more-action-icon">
                        <img src={MoreActionIcon} alt="info circle icon" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="widget-footer">
                  <Row>
                    <Col md={7}>
                      <div className="widget-footer-title">
                        {/* ${this.state.CPCValue} */}
                        {this.state.CPCValue == null ? (
                          <>${this.state.CPCValue}%</>
                        ) : (
                          <p className="noData">no data</p>
                        )}
                      </div>
                    </Col>
                    <Col md={5} className="align-end">
                      <div className="widget-status-container up">
                        {this.state.CPCAvgValue}%
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="widget-container height-110">
                <div className="widget-header">
                  <Row>
                    <Col md={9} className="widget-select-container">
                      <div className="input-group filter">
                        <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">Sales [Ad]</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        <span>
                          <img src={InfoCircleIcon} alt="more action icon" />
                        </span>
                      </div>
                    </Col>
                    <Col md={3} className="p-0">
                      <div className="more-action-icon">
                        <img src={MoreActionIcon} alt="info circle icon" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="widget-footer">
                  <Row>
                    <Col md={7}>
                      <div className="widget-footer-title">
                        {/* ${this.state.salesValue} */}
                        {this.state.salesValue == null ? (
                          <>${this.state.salesValue}%</>
                        ) : (
                          <p className="noData">no data</p>
                        )}
                      </div>
                    </Col>
                    <Col md={5} className="align-end">
                      <div className="widget-status-container up">
                        {this.state.salesAvgValue}%
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
            <Col md={3}>
              <div className="widget-container height-110">
                <div className="widget-header">
                  <Row>
                    <Col md={9} className="widget-select-container">
                      <div className="input-group filter">
                        <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">Orders [Ad]</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        <span>
                          <img src={InfoCircleIcon} alt="more action icon" />
                        </span>
                      </div>
                    </Col>
                    <Col md={3} className="p-0">
                      <div className="more-action-icon">
                        <img src={MoreActionIcon} alt="info circle icon" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="widget-footer">
                  <Row>
                    <Col md={7}>
                      <div className="widget-footer-title">
                        {/* {this.state.orderValue} */}
                        {this.state.orderValue == null ? (
                          <>{this.state.orderValue}%</>
                        ) : (
                          <p className="noData">no data</p>
                        )}
                      </div>
                    </Col>
                    <Col md={5} className="align-end">
                      <div className="widget-status-container up">
                        {this.state.orderAvgValue}%
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="widget-container height-350px">
                <div className="widget-header">
                  <Row>
                    <Col md={5} className="widget-select-container dot-con">
                      <span className="dot bg-black"></span>
                      <div className="input-group filter">
                        <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">Select [Type]</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        <span>
                          <img src={InfoCircleIcon} alt="more action icon" />
                        </span>
                      </div>
                    </Col>
                    <Col md={7} className="p-0">
                      <Row>
                        <Col md={10}>
                          <div className="widget-select-container pull-right dot-con">
                            <span className="dot bg-green"></span>
                            <div className="input-group filter pull-right">
                              <select
                                className="form-select widget-select"
                                id="inputGroupSelect02"
                                defaultValue={"DEFAULT"}
                              >
                                <option defaultValue={"DEFAULT"}>
                                  Select [Type]
                                </option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                              </select>
                              <span>
                                <img
                                  src={InfoCircleIcon}
                                  alt="more action icon"
                                />
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={2}>
                          <div className="more-action-icon">
                            <img src={MoreActionIcon} alt="info circle icon" />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Areachart />
              </div>
            </Col>
            <Col md={6}>
              <div className="widget-container height-350px">
                <div className="widget-header">
                  <Row>
                    <Col md={5} className="widget-select-container dot-con">
                      <span className="dot bg-black"></span>

                      <div className="input-group filter">
                        <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">Select [Type]</option>
                          <option value="1">One</option>
                          <option value="2">Two</option>
                          <option value="3">Three</option>
                        </select>
                        <span>
                          <img src={InfoCircleIcon} alt="more action icon" />
                        </span>
                      </div>
                    </Col>
                    <Col md={7} className="p-0">
                      <Row>
                        <Col md={10}>
                          <div className="widget-select-container pull-right dot-con">
                            <span className="dot bg-green"></span>
                            <div className="input-group filter">
                              <select
                                className="form-select widget-select"
                                id="inputGroupSelect02"
                                defaultValue={"DEFAULT"}
                              >
                                <option value="DEFAULT">Select [Type]</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                              </select>
                              <span>
                                <img
                                  src={InfoCircleIcon}
                                  alt="more action icon"
                                />
                              </span>
                            </div>
                          </div>
                        </Col>
                        <Col md={2}>
                          <div className="more-action-icon">
                            <img src={MoreActionIcon} alt="info circle icon" />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
                <Stackedbar />
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="top-seller-title">
                Top Bestseller Book
                <div className="dropdown">
                  <select className="dropdown-content" defaultValue={"DEFAULT"}>
                    <option value="DEFAULT">Royalties [TypeNet]</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                  </select>
                  <div className="info icon">
                    <span>
                      <img src={InfoCircleIcon} alt="more action icon" />
                    </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <BestSeller />
          <Row>
            <Col className="tabsContainer">
              <Tabs
                defaultActiveKey="books"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="books" title="BOOKS">
                  <BooksTable
                    filterData={this.state.globalFilterFromData}
                    searchKey={this.state.searchKeyFilter}
                    filterDateRange={this.state.globalFilterDateRange}
                  />
                </Tab>
                <Tab eventKey="authors" title="AUTHORS">
                  <AuthorsTable
                    filterData={this.state.globalFilterFromData}
                    searchKey={this.state.searchKeyFilter}
                    filterDateRange={this.state.globalFilterDateRange}
                  />
                </Tab>
                <Tab eventKey="marketplace" title="MARKETPLACE">
                  <MarketplaceTable
                    filterData={this.state.globalFilterFromData}
                    searchKey={this.state.searchKeyFilter}
                    filterDateRange={this.state.globalFilterDateRange}
                  />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    );
  }
}
