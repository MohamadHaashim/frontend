/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col } from "react-bootstrap";
import "./index.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import LinkIcon from "../../assets/images/icons/link-icon.svg";
import ResetIcon from "../../assets/images/icons/reset-icon.svg";
import BackArrow from "../../assets/images/icons/back-arrow-icon.svg";
import Moment from "moment";

import { Link } from "react-router-dom";
import AutomationRulesChangeLogTable from "../../components/CusDataTable/automation-rules-change-log-table";

class ChangeLogAutomationRules extends Component {
  filterData: any = [];
  state = {
    globalFilterFromData: [],
    searchKeyFilter: "",
    globalFilterDateRange: [],
    filterOptionData: [],
    paginationList: [],
    perPage: 50,
    total: 0,
    currPage: 1,
    lastPage: 0,
    nextPage: 0,
    prevPage: 0,
    dropdownDatas: [],
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
  };
  constructor(props) {
    super(props);
    this.onChangeDateRangeSubmitGlobal =
      this.onChangeDateRangeSubmitGlobal.bind(this);
  }

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

  onChangeDateRangeSubmitGlobal(e) {
    console.log(Moment(e[0]).format("YYYY-MM-DD"));
    console.log(e[1]);
    let dateRange = e;
    if (dateRange.length > 0) {
      this.setState({ globalFilterDateRange: dateRange });
    }
  }

  applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    this.setState({ perPage: parseInt(e.target.value) });
  };

  handleCallbackTotalData = (childData) => {
    console.log("Child Bookshelf Table data: ", childData);
    this.setState({ total: childData.total });
    this.setState({ currPage: childData.currPage });
    this.setState({ lastPage: childData.lastPage });
    this.setState({ nextPage: childData.nextPage });
    this.setState({ perPage: childData.perPage });
    this.setState({ prevPage: childData.prevPage });
    this.setState({ dropdownDatas: childData.dropdownDatas });
  };

  applyPagination = (e, pageNo: any) => {
    console.log("pagination no: ", pageNo);
    this.setState({ currPage: pageNo });
  };
  handleChange = (event, value: number) => {
    this.setState({ currPage: value });
  };

  cancelDropdown = () => {
    const eleRm: any = document.getElementsByClassName("dropdown-menu");
    if (eleRm) {
      if (eleRm.length > 0) {
        eleRm[0].classList.remove("show");
        eleRm[1].classList.remove("show");
      }
    }
  };

  render() {
    return (
      <DashboardLayout>
        <div className="main-cont-header bookself-container">
          <Row className="page-header ">
            <Col>
              <div className="main-con-page-title-container">
                <div className="back-arrow-container">
                  <Link to={"/ads/automation-rules"}>
                    <i>
                      <img src={BackArrow} alt="refresh icon" />
                    </i>
                    Back
                  </Link>
                </div>
              </div>
            </Col>
            <Col className="text-end last-sync">
              {/* <span>Last App Sync :</span>

              <span className="time-summery">
                {" "}
                {this.state.lastUpdatedDate || "Not available"}
              </span> */}
            </Col>
          </Row>
        </div>
        <div className="main-content-container">
          <hr />
          <div className="padding-lr-30 ">
            <Row className="mt-5">
              <Col md={9}>
                <h6>Rules Audit Log</h6>
              </Col>
              <Col>
                <div className="filter-container">
                  <form>
                    <div className="search-filter-container">
                      <i className="fa fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search"
                        id="globalSearch"
                        name="globalSearch"
                        onKeyDown={this.handleKeyDown}
                      />
                    </div>
                  </form>
                </div>
              </Col>
            </Row>
          </div>
          <div className="padding-lr-30">
            <Row>
              <Col>
                <AutomationRulesChangeLogTable
                  checkBox={false}
                  tabName="Marketplaces"
                  filterData={this.state.globalFilterFromData}
                  searchKey={this.state.searchKeyFilter}
                  filterDateRange={this.state.globalFilterDateRange}
                  perPage={this.state.perPage}
                  currPage={this.state.currPage}
                  parentCallback={this.handleCallbackTotalData}
                />
              </Col>
            </Row>
            <div className="custom-table-footer">
              <Row>
                <Col md={5}>
                  <form className="table-footer-left">
                    <span>Show </span>
                    <label>
                      <select
                        className="form-select"
                        defaultValue={this.state.perPage}
                        onChange={(event) => this.applyDataLength(event)}
                      >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                      </select>
                    </label>
                    <span> of {this.state.total} total entries</span>
                  </form>
                </Col>
                <Col md={7}>
                  <div className="table-footer-right">
                    <Stack spacing={2}>
                      <Pagination
                        count={this.state.lastPage}
                        variant="outlined"
                        shape="rounded"
                        onChange={this.handleChange}
                      />
                    </Stack>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default ChangeLogAutomationRules;
