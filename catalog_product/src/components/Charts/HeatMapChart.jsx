import React from "react";
import ReactApexChart from "react-apexcharts";
import { Button, Col, Row, Spinner } from "react-bootstrap";

import MoreActionIcon from "../../assets/images/icons/more-action-icon.svg";
import InfoButton from "../Common/InfoButton";
class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [],
        },
      ],
      options: {
        legend: {
          show: false,
        },
        chart: {
          height: 350,
          type: "treemap",
        },
        dataLabels: {
          style: {
            colors: ["background: #111827"],
          },
        },
        colors: ["#00976D", "#CAFCD0", "#00D26E"],
      },
      areaMapLoad: false,
      heatMapPercentage: 5,
      isLoding: false,
      selectedCategorie: "Marketplace",
      heatMapChartMetaData: [],
      heatMapSpendData: [],
      selectedMetrics: "Spend",
      isLoading: false,
      metaDataLoading: false,
    };
  }
  percentageIncreement = () => {
    this.setState({ heatMapPercentage: this.state.heatMapPercentage + 5 });
    this.getHeatMapChart(
      this.state.selectedCategorie,
      this.state.selectedMetrics,
      this.state.heatMapPercentage + 5
    );
  };
  percentageDecreement = () => {
    if (this.state.heatMapPercentage != 5) {
      this.setState({ heatMapPercentage: this.state.heatMapPercentage - 5 });
      this.getHeatMapChart(
        this.state.selectedCategorie,
        this.state.selectedMetrics,
        this.state.heatMapPercentage - 5
      );
    }
  };
  componentDidMount() {
    // this.getHeatMapChart(
    //   this.state.selectedCategorie,
    //   this.state.selectedMetrics,
    //   this.state.heatMapPercentage
    // );
    this.getMetaData();
  }
  getHeatMapChart = async (selectedCategorie, selectedMetrics, percentage) => {
    this.setState({ isLoading: true });
    console.log("selectedCategorie=" + selectedCategorie);
    console.log("selectedMetrics=" + selectedMetrics);
    console.log("percentage=" + percentage);
    this.setState({ isLoding: true });
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Dashboard/HeatMap";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        globalFilters: {
          searchText: "",
          authors: [],
          bookFormats: [],
          dateRanges: {
            dateRange: "Custom",
            startDate: "2023-12-06T05:11:58.591Z",
            endDate: "2024-01-05T05:11:58.591Z",
          },
          titles: [],
          campaigns: [],
          platforms: [],
          marketPlaces: [],
          adTypes: [],
          advancedFilters: [],
        },
        percentage: percentage,
        categories: selectedCategorie,
        metrics: selectedMetrics,
      }),
    });
    try {
      const responseData = await response.json();
      var data = responseData.result.data;
      var areaMapData = this.state.series;
      areaMapData[0].data = [];
      data.forEach((res) => {
        let obj = { x: res.categorieValue, y: res.metricPercentageValue };
        areaMapData[0].data.push(obj);
      });
      this.setState({});
      this.state.areaMapLoad = true;
      this.setState({ isLoading: false });
      this.setState({ metaDataLoading: false });
    } catch (error) {
      console.error("Error updating data:", error);
      this.setState({ isLoading: false });
      this.setState({ metaDataLoading: false });
    }
  };
  getMetaData = async () => {
    this.setState({ isLoading: true });
    this.setState({ metaDataLoading: true });
    try {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;

      const responseSpend = await fetch(
        "https://api.aimosa.io/MasterData/meta",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
        }
      );

      const responseChartData = await responseSpend.json();
      console.log(responseChartData.result.data.HeatMap);
      this.setState({
        heatMapChartMetaData: responseChartData.result.data.HeatMap,
      });
      this.handleMetricChange(this.state.selectedCategorie);
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  handleSpendChange = (event) => {
    this.setState({ selectedMetrics: event.target.value });

    this.getHeatMapChart(
      this.state.selectedCategorie,
      event.target.value,
      this.state.heatMapPercentage
    );
  };

  handleMetricChange = (event) => {
    var changeValue;
    if (typeof event === "string") {
      changeValue = event;
    } else {
      changeValue = event.target.value;
    }
    this.getHeatMapChart(
      changeValue,
      this.state.selectedMetrics,
      this.state.heatMapPercentage
    );
    this.setState({ selectedCategorie: changeValue });
    var data = this.state.heatMapChartMetaData;
    console.log("dataaaa=" + data);
    // var filterData = this.state.heatMapSpendData;
    var filterData = [];
    var obj = {};
    data.forEach((res) => {
      // console.log(res.name);
      if (res.name == changeValue) {
        // var obj={name:res.childValues}
        // console.log(res.childValues[0]);
        filterData = [];
        for (let i = 0; i < res.childValues.length; i++) {
          // console.log(res.childValues[i]);
          obj = {};
          obj = {
            name: res.childValues[i].name,
            title: res.childValues[i].title,
            subtitle: res.childValues[i].subtitle,
            description: res.childValues[i].description,
          };
          filterData.push(obj);
        }
      }
    });
    this.setState({ heatMapSpendData: filterData });
  };
  render() {
    return (
      <div id="chart">
        {!this.state.metaDataLoading ? (
          <div className="widget-header">
            <Row>
              <Col md={7} className="widget-select-container">
                {/* <span className="dot bg-black"></span> */}
                <div className="input-group filter d-flex align-items-center">
                  <select
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#212529",
                    }}
                    className="form-select widget-select"
                    value={this.state.selectedCategorie}
                    onChange={this.handleMetricChange}
                  >
                    {this.state.heatMapChartMetaData.map((metric) => (
                      <option
                        title={metric.name}
                        key={metric.name}
                        value={metric.name}
                      >
                        <span>{metric.title}</span>
                      </option>
                    ))}
                  </select>

                  {/* <select
                          className="form-select widget-select"
                          id="inputGroupSelect02"
                          defaultValue={"DEFAULT"}
                        >
                          <option value="DEFAULT">Select [Type]</option>
                        </select> */}
                  <InfoButton infoText="Click through rate" />
                  <span className="mx-3">By</span>
                  {/* <span
                  style={{
                    fontWeight: "500",
                    fontSize: "14px",
                  }}
                > */}
                  <select
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#212529",
                    }}
                    className="form-select widget-select"
                    value={this.state.selectedMetrics}
                    onChange={this.handleSpendChange}
                  >
                    {this.state.heatMapSpendData.map((metric) => (
                      <option
                        title={metric.name}
                        key={metric.name}
                        value={metric.name}
                      >
                        <span>{metric.title}</span>
                      </option>
                    ))}
                  </select>
                  {/* </span> */}
                  <InfoButton infoText="Click through rate" />
                </div>
              </Col>
              <Col md={5}>
                <Row>
                  <Col md={10}>
                    <div className="widget-select-container pull-right dot-con">
                      {/* <span className="dot bg-green"></span> */}
                      <div className="input-group filter pull-right">
                        {/* <select
                                className="form-select widget-select"
                                id="inputGroupSelect02"
                                defaultValue={"DEFAULT"}
                              >
                                <option defaultValue={"DEFAULT"}>
                                  Select [Type]
                                </option> */}
                        {/* <option value="1">One</option>
                                <option value="2">Two</option>                               <option value="3">Three</option> */}
                        {/* </select> */}
                        {/* 
                                                         <InfoButton infoText="Click through rate" />       
                                                             */}
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
        ) : (
          <></>
        )}
        {/* {this.state.isLoding ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              height: "100%",
              marginTop: "140px",
            }}
            className="horizontalBarChart"
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <br></br>
            <div className="loading ms-4">Loading...</div>
          </div>
        ) : (
          <>
            {this.state.series[0].data.length > 0 ? (
              <>
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="treemap"
                  height={300}
                  width="100%"
                />
                <div className="Datafilert">
                  <Row>
                    <Col md={5}>
                      <Button
                        className="Minus"
                        onClick={this.percentageDecreement}
                      >
                        -
                      </Button>
                      <Button
                        className="Plus"
                        onClick={this.percentageIncreement}
                      >
                        +
                      </Button>
                      <Button className="Greater">
                        {">"}
                        {this.state.heatMapPercentage}%
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  height: "100%",
                  marginTop: "140px",
                }}
              >
                No Data
              </div>
            )}
          </>
        )} */}
        {!this.state.isLoading ? (
          <>
            {this.state.series[0].data.length > 0 ? (
              <>
                <ReactApexChart
                  options={this.state.options}
                  series={this.state.series}
                  type="treemap"
                  height={300}
                  width="100%"
                />
                <div className="Datafilert">
                  <Row>
                    <Col md={5}>
                      <Button
                        className="Minus"
                        onClick={this.percentageDecreement}
                      >
                        -
                      </Button>
                      <Button
                        className="Plus"
                        onClick={this.percentageIncreement}
                      >
                        +
                      </Button>
                      <Button className="Greater">
                        {">"}
                        {this.state.heatMapPercentage}%
                      </Button>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  height: "100%",
                  marginTop: "140px",
                }}
              >
                No Data
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              height: "100%",
              marginTop: "140px",
            }}
            className="horizontalBarChart"
          >
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <br></br>
            <div className="loading ms-4">Loading...</div>
          </div>
        )}
      </div>
    );
  }
}

export default ApexChart;
