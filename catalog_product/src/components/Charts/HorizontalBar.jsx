import React from "react";
import ReactApexChart from "react-apexcharts";
import MoreActionIcon from "../../assets/images/icons/more-action-icon.svg";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import InfoButton from "../Common/InfoButton";
class HorizontalBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          data: [],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 400,
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        colors: ["#00645D", "#CAFCD0", "#00D26E"],
        xaxis: {
          categories: [],
        },
      },
      selectedCategorie: "Marketplace",
      horizontalBarMetaData: [],
      horizontalBarSpendData: [],
      selectedMetrics: "Budget",
      isLoading: false,
      metaDataLoading: false,
    };
  }
  componentDidMount() {
    // this.getHorizontalBarChart(
    //   this.state.selectedCategorie,
    //   this.state.selectedMetrics
    // );
    this.getMetaData();
    // this.handleMetricChange(this.state.selectedCategorie);
  }
  getHorizontalBarChart = async (selectedCategorie, selectedMetrics) => {
    this.setState({ isLoading: true });
    console.log("selectedMetricss=" + selectedMetrics);
    console.log("selectedCategorie=" + selectedCategorie);

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/Dashboard/HorizontalChart";
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
            startDate: "2023-12-03T09:16:12.789Z",
            endDate: "2024-01-03T09:16:12.789Z",
          },
          titles: [],
          campaigns: [],
          platforms: [],
          marketPlaces: [],
          adTypes: [],
          advancedFilters: [],
        },
        pageNumber: 0,
        pageSize: 0,
        categories: selectedCategorie,
        metrics: selectedMetrics,
      }),
    });
    try {
      const responseData = await response.json();
      // console.log(responseData.result.data);
      var data = responseData.result.data;

      // console.log(data.length);

      let yData = this.state.series;
      yData[0].data = [];
      let xData = this.state.options;
      xData.xaxis.categories = [];
      data.forEach((res) => {
        for (let value in res) {
          // console.log("ress=" + value);
          if (value == "xAxis") {
            yData[0].data.push(res[value]);
            // this.setState({ series: yData });
          } else {
            xData.xaxis.categories.push(res[value]);
            // this.setState({ options: xData });
          }
        }
      });
      console.log("yData=" + JSON.stringify(yData));
      this.setState({ series: yData });
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
      this.setState({
        horizontalBarMetaData: responseChartData.result.data.HorizontalChart,
      });

      this.handleMetricChange(this.state.selectedCategorie);
    } catch (error) {
      console.error(error);
      this.setState({ metaDataLoading: false });
      return error;
    }
  };
  handleSpendChange = (event) => {
    this.setState({ selectedMetrics: event.target.value });

    this.getHorizontalBarChart(
      this.state.selectedCategorie,
      event.target.value
    );
  };
  handleMetricChange = (event) => {
    var changeValue;
    if (typeof event === "string") {
      changeValue = event;
    } else {
      changeValue = event.target.value;
    }
    this.getHorizontalBarChart(changeValue, this.state.selectedMetrics);
    this.setState({ selectedCategorie: changeValue });
    var data = this.state.horizontalBarMetaData;
    // var filterData = this.state.horizontalBarSpendData;
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
    this.setState({ horizontalBarSpendData: filterData });
  };

  render() {
    return (
      <div id="chart">
        {!this.state.metaDataLoading ? (
          <div className="widget-header">
            <Row>
              <Col md={7} className="widget-select-container">
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
                    {this.state.horizontalBarMetaData.map((metric) => (
                      <option
                        title={metric.name}
                        key={metric.name}
                        value={metric.name}
                      >
                        <span>{metric.title}</span>
                      </option>
                    ))}
                  </select>

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
                    {this.state.horizontalBarSpendData.map((metric) => (
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
                  <Col md={10}></Col>
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
        {!this.state.isLoading ? (
          <>
            {this.state.series[0].data.length > 0 &&
            this.state.options.xaxis.categories.length > 0 ? (
              <ReactApexChart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                height={300}
                width="100%"
              />
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
export default HorizontalBar;
