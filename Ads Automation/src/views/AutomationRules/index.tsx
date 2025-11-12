/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import "./index.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import AutomationRulesListTable from "../../components/CusDataTable/automation-rules-list-table";

import LinkIcon from "../../assets/images/icons/link-icon.svg";
import ResetIcon from "../../assets/images/icons/reset-icon.svg";
import Moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { Badge, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Campaign {
  campaignId: number;
  campaignName: string;
  isSelected: boolean;
}
interface SelectedCampaign {
  campaignId: number;
  campaignName: string;
}
interface SelectedCampaigndisabled {
  campaignId: number;
  campaignName: string;
}
interface ResultProps {
  searchResult: any;
}

class AutomationRules extends Component<ResultProps> {
  filterData: any = [];
  state = {
    globalFilterFromData: [],
    searchKeyFilter: "",
    globalFilterDateRange: [],
    filterOptionData: [],
    paginationList: [],
    perPage: 50,
    total: 0,
    filteredCount: 0,
    currPage: 1,
    lastPage: 0,
    nextPage: 0,
    prevPage: 0,
    dropdownDatas: [],
    getSelectedRules: [],
    campaignData: [] as Campaign[],
    isLoading: false,
    pageReload: false,
    campaignShow: false,
    importShow: false,
    selectAllChecked: false,
    campaignSearchKey: "",
    getRulesByStatus: "",
    importOption: "Add",
    importFile: null,
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
    selectedAccount: this.props.searchResult || "",
    selectedCampaigns: [] as SelectedCampaign[],
    selectedCampaignsdisabled: [] as SelectedCampaigndisabled[],
  };
  constructor(props) {
    super(props);
    this.onChangeDateRangeSubmitGlobal =
      this.onChangeDateRangeSubmitGlobal.bind(this);
  }
  cancel() {}

  componentDidMount() {
    localStorage.removeItem("templateId");
    const { searchResult } = this.props;
    console.log(searchResult);
    this.setState({ selectedAccount: searchResult });
    console.log(this.props.searchResult);
  }

  componentDidUpdate(prevProps: ResultProps) {
    if (this.props.searchResult !== prevProps.searchResult) {
      this.setState({ selectedAccount: this.props.searchResult });
      console.log("jjjjj", this.props.searchResult);
    }
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
  CampaignhandleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      this.setState({ campaignSearchKey: event.target.value });
      event.preventDefault();
      this.setState({ isLoading: true });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const formData = new FormData();
      formData.append("ProfileId", String(this.state.selectedAccount));
      formData.append("SearchText", event.target.value);
      let url =
        "https://adsexpert-api.getgrowth.agency/Rule/CampaignName";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: AuthToken,
        },
        body: formData,
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responceData) => {
          if (responceData.success) {
            this.setState({ campaignData: responceData.result });
            this.setState({ isLoading: false });
            console.log(this.state.campaignData);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
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
    this.setState({ filteredCount: childData.filteredCount });
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

  getMetaData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://adsexpert-api.getgrowth.agency/MasterData";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      this.setState({ metaData: responceData.result.data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  handleSelectedRules = (childData) => {
    console.log("Selected Rules List: ", childData);
    this.setState({ getSelectedRules: childData });
  };
  filterRulesByStatus = (statusType) => {
    if (statusType) {
      this.setState({ getRulesByStatus: statusType });
    } else if (statusType == "") {
      this.setState({ getRulesByStatus: statusType });
    }
  };
  updateRulesStatus = (statusType) => {
    if (this.state.getSelectedRules.length > 0) {
      this.setState({ pageReload: false });
      console.log("Enable Rules list: ", this.state.getSelectedRules);
      this.ruleStatusUpdateAPI(statusType);
    }
  };
  ruleStatusUpdateAPI = async (statusType) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://adsexpert-api.getgrowth.agency/Rule/Status",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          ruleId: this.state.getSelectedRules,
          status: statusType,
        }),
      }
    );
    const responceData = await response.json();
    console.log("res=", responceData);
    this.setState({ pageReload: true });
    this.setState({ getSelectedRules: [] });
    toast("Rule(s) " + statusType + " Status updated successfully");
  };

  deleteRule = async () => {
    // alert("Are you sure you want to delete rules?");
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://adsexpert-api.getgrowth.agency/Rule",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          id: this.state.getSelectedRules,
        }),
      }
    );
    const responceData = await response.json();
    this.setState({ pageReload: true });
    this.setState({ getSelectedRules: [] });
    toast("Rule(s) deleted successfully");
  };

  mapCampaigns = async () => {
    if (this.state.getSelectedRules) {
      this.setState({ campaignShow: true });
      this.setState({ isLoading: true });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const formData = new FormData();
      formData.append("ProfileId", String(this.state.selectedAccount));
      if (this.state.importOption === "Add") {
        formData.append("Assign", "true");
      } else {
        formData.append("Assign", "false");
      }
      if (this.state.campaignSearchKey !== "") {
        formData.append("SearchText", this.state.campaignSearchKey);
      }
      if (this.state.getSelectedRules.length === 1) {
        formData.append("RuleId", this.state.getSelectedRules[0]);
      }

      let url =
        "https://adsexpert-api.getgrowth.agency/Rule/CampaignName";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: AuthToken,
        },
        body: formData,
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responceData) => {
          if (responceData.success) {
            this.setState({ campaignData: responceData.result });

            this.setState({ isLoading: false });
            console.log(this.state.campaignData);

            const data = responceData.result;
            const selectedCampaigns = data
              .filter((item) => item.isSelected)
              .map((value) => ({
                campaignId: String(value.campaignId),
                campaignName: value.campaignName,
              }));
            console.log(selectedCampaigns);
            this.setState({ selectedCampaignsdisabled: selectedCampaigns });
            this.setState({ selectedCampaigns: selectedCampaigns });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } 
  };

  handleCheckboxChange = (value) => {
    console.log(value);

    if (value === "selectAll") {
      const selectAllChecked = !this.state.selectAllChecked;
      this.setState({
        selectAllChecked,
        selectedCampaigns: selectAllChecked
          ? this.state.campaignData.map(({ campaignId, campaignName }) => ({
              campaignId,
              campaignName,
            }))
          : [],
      });
    } else {
      const { selectedCampaigns } = this.state;
      const isSelected = selectedCampaigns.some(
        (selectedCampaign) =>
          selectedCampaign.campaignName === value.campaignName
      );
      let updatedSelectedCampaigns;
      if (isSelected) {
        updatedSelectedCampaigns = selectedCampaigns
          .filter(
            (selectedCampaign) =>
              selectedCampaign.campaignName !== value.campaignName
          )
          .map((campaign) => ({
            campaignId: String(campaign.campaignId),
            campaignName: campaign.campaignName,
          }));
      } else {
        updatedSelectedCampaigns = [
          ...selectedCampaigns,
          {
            campaignId: String(value.campaignId),
            campaignName: value.campaignName,
          },
        ];
      }
      this.setState({
        selectedCampaigns: updatedSelectedCampaigns,
        selectAllChecked:
          updatedSelectedCampaigns.length === this.state.campaignData.length,
      });
    }
  };

  resetCampaigns = async () => {
    // Disable the button to prevent multiple clicks
    // this.setState({ resetButtonDisabled: true });
    // let userToken = localStorage.getItem("userToken");
    // let AuthToken = "Bearer " + userToken;
    // let url = "https://api.aimosa.io/Rule/All";
    // try {
    //   const response = await fetch(url, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: AuthToken,
    //     },
    //     body: JSON.stringify({
    //       pageNumber: 0,
    //       pageSize: 0,
    //       globalFilters: {
    //         searchText: "",
    //         advancedFilters: [],
    //       },
    //     }),
    //   });
    //   const data = await response.json();
    //   console.log("Response data:", data);
    //   this.setState({
    //     globalFilterFromData: data.rules,
    //     searchKeyFilter: "",
    //     globalFilterDateRange: [],
    //     pageReload: true,
    //   });
    // } catch (error) {
    //   console.error("Error fetching campaigns:", error);
    // } finally {
    //   this.setState({ resetButtonDisabled: false });
    // }
  };

  save = () => {
    this.setState({ isLoading: true });

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Rule/BulkOperation/Campaigns";

    const updateData = {
      profileId: this.state.selectedAccount,
      campaigns: this.state.selectedCampaigns,
      ruleId: this.state.getSelectedRules,
    };
    console.log(updateData);

    axios
      .put(url, updateData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      })
      .then((res) => {
        this.setState({ isLoading: false });
        this.setState({ pageReload: true });
        this.setState({ getSelectedRules: [] });
        if (res.data.success === true) {
          toast("Rules updated successfully");
          this.setState({ campaignShow: false });
        } else {
          toast("Rules updated failed");
          this.setState({ campaignShow: false });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ campaignShow: false });
      });
  };

  import = () => {
    this.setState({ importShow: true });
  };

  handleFileChange = (event) => {
    this.setState({ importFile: event.target.files[0] });
  };

  handleImport = () => {
    if (this.state.importFile) {
      this.setState({ isLoading: true });
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const formData = new FormData();
      formData.append("file", this.state.importFile);
      formData.append("ProfileId", String(this.state.selectedAccount));
      formData.append("SearchText", "");
      if (this.state.importOption === "Add") {
        formData.append("Assign", "true");
      } else {
        formData.append("Assign", "false");
      }
      if (this.state.getSelectedRules.length === 1) {
        formData.append("RuleId", this.state.getSelectedRules[0]);
      }
      let url =
        "https://adsexpert-api.getgrowth.agency/Rule/CampaignName";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: AuthToken,
        },
        body: formData,
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responceData) => {
          if (responceData.success) {
            this.setState({ campaignData: responceData.result });
            this.setState({ isLoading: false });
            this.setState({ importShow: false });
            console.log(this.state.campaignData);
            const data = responceData.result;
            const selectedCampaigns = data
              .filter((item) => item.isSelected)
              .map((value) => ({
                campaignId: String(value.campaignId),
                campaignName: value.campaignName,
              }));
            console.log(selectedCampaigns);
            this.setState({ selectedCampaignsdisabled: selectedCampaigns });
            this.setState({ selectedCampaigns: selectedCampaigns });
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  };

  refresh = () => {
    window.location.reload();
    localStorage.removeItem("Sort")
    localStorage.removeItem("SortData")
  };

  handleradiochange = (e) => {
    this.setState({ importOption: e.target.value });
  };

  render() {
    return (
      <DashboardLayout>
        <div className="main-cont-header bookself-container">
          <Row className="page-header ">
            <Col>
              <div className="main-con-page-title-container">
                <div className="title">
                  <h3 className="page-title">My Automation Rules</h3>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <div className="main-content-container">
          <hr />
          <div className="padding-lr-30">
            <Row className="mt-5">
              <Col md={7} sm={12}>
                <div className="table-global-action-container">
                  <div className="custom-dropdown-container">
                    <label>Bulk Operation</label>
                    <Badge
                      count={this.state.getSelectedRules.length}
                      color="#fe9900"
                    >
                      <div className="dropdownContent">
                        <p
                          id="dropdownMenuButton1"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          Bulk Operation
                          <i
                            className="fa fa-angle-down down-arrow-right"
                            aria-hidden="true"
                          ></i>
                          <i
                            className="fa fa-angle-up up-arrow-right"
                            aria-hidden="true"
                          ></i>
                        </p>
                        <ul
                          className="dropdown-menu shadow rounded"
                          aria-labelledby="dropdownMenuButton1"
                          style={{ minWidth: "130px" }}
                        >
                          <li
                            onClick={(e) => this.updateRulesStatus("Enabled")}
                          >
                            Enable
                          </li>
                          <li onClick={(e) => this.updateRulesStatus("Paused")}>
                            Pause
                          </li>
                          <Popconfirm
                            title="Delete"
                            description="Are you sure you want to delete rules?"
                            onConfirm={(e) => this.deleteRule()}
                            onCancel={this.cancel}
                            okText="Yes"
                            cancelText="No"
                          >
                            {" "}
                            <li>Delete</li>
                          </Popconfirm>
                          <li onClick={this.mapCampaigns}>Add Campaigns</li>
                        </ul>
                      </div>
                    </Badge>
                    {this.state.campaignShow && (
                      <div>
                        <Modal
                          show={this.state.campaignShow}
                          onHide={() => this.setState({ campaignShow: false })}
                          size="xl"
                          aria-labelledby="example-modal-sizes-title-xl"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title
                              id="example-modal-sizes-title-xl"
                              style={{ fontSize: "17px" }}
                            >
                              Campaigns
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <Row>
                              <Col>
                                <form>
                                  <div className="search-filter-container">
                                    <i className="fa fa-search"></i>
                                    <input
                                      type="text"
                                      placeholder="Search"
                                      id="globalSearch"
                                      name="globalSearch"
                                      onKeyDown={this.CampaignhandleKeyDown}
                                    />
                                  </div>
                                </form>
                              </Col>
                              <Col>
                                <div className="d-flex justify-content-end">
                                  <button className="add" onClick={this.import}>
                                    Import
                                  </button>
                                </div>
                              </Col>
                              <Modal
                                show={this.state.importShow}
                                onHide={() =>
                                  this.setState({
                                    importShow: false,
                                    importOption: "Add",
                                  })
                                }
                              >
                                <Modal.Header closeButton>
                                  <Modal.Title>Import File</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                  <div className="d-flex mb-3 justify-content-center">
                                    <Form.Check
                                      type="radio"
                                      label="Add Campaigns"
                                      className="user-select-none me-3"
                                      id="radio-add-campaigns"
                                      name="campaignOptions"
                                      defaultChecked={true}
                                      value={"Add"}
                                      onChange={this.handleradiochange}
                                    />
                                    <Form.Check
                                      type="radio"
                                      label="Remove Campaigns"
                                      className="user-select-none"
                                      id="radio-remove-campaigns"
                                      name="campaignOptions"
                                      value={"Remove"}
                                      onChange={this.handleradiochange}
                                    />
                                  </div>
                                  <Form.Control
                                    type="file"
                                    className="file"
                                    onChange={this.handleFileChange}
                                  />
                                </Modal.Body>
                                <Modal.Footer>
                                  <Button
                                    className="btn btn-primary add-rules-btn pt-2"
                                    style={{ height: "43px !important" }}
                                    onClick={this.handleImport}
                                  >
                                    Import
                                  </Button>
                                </Modal.Footer>
                              </Modal>
                            </Row>
                            <Row
                              className=" p-1 mb-2 mt-3"
                              style={{ height: "500px" }}
                            >
                              <div className="d-flex mb-2">
                                <input
                                  className="form-check-input me-2"
                                  type="checkbox"
                                  checked={this.state.selectAllChecked}
                                  onChange={() =>
                                    this.handleCheckboxChange("selectAll")
                                  }
                                />
                                <h6 style={{ fontSize: "15px" }}>Select All</h6>
                              </div>
                              {!this.state.isLoading ? (
                                <div
                                  className=" mb-3"
                                  style={{
                                    height: "450px",
                                    overflowY: "auto",
                                  }}
                                >
                                  <Row className="mb-3">
                                    <Col>
                                      {this.state.campaignData
                                        .filter((_, index) => index % 2 === 0)
                                        .map((campaign, index) => (
                                          <div
                                            key={index}
                                            className="d-flex mb-2"
                                          >
                                            <input
                                              className="form-check-input me-2"
                                              type="checkbox"
                                              disabled={this.state.selectedCampaignsdisabled.some(
                                                (selectedCampaign) =>
                                                  selectedCampaign.campaignName ===
                                                  campaign.campaignName
                                              )}
                                              checked={this.state.selectedCampaigns.some(
                                                (selectedCampaign) =>
                                                  selectedCampaign.campaignName ===
                                                  campaign.campaignName
                                              )}
                                              onChange={() =>
                                                this.handleCheckboxChange(
                                                  campaign
                                                )
                                              }
                                            />
                                            <div>{campaign.campaignName}</div>
                                          </div>
                                        ))}
                                    </Col>
                                    <Col>
                                      {this.state.campaignData
                                        .filter((_, index) => index % 2 !== 0)
                                        .map((campaign, index) => (
                                          <div
                                            key={index}
                                            className="d-flex mb-2"
                                          >
                                            <input
                                              className="form-check-input me-2"
                                              type="checkbox"
                                              disabled={this.state.selectedCampaignsdisabled.some(
                                                (selectedCampaign) =>
                                                  selectedCampaign.campaignName ===
                                                  campaign.campaignName
                                              )}
                                              checked={this.state.selectedCampaigns.some(
                                                (selectedCampaign) =>
                                                  selectedCampaign.campaignName ===
                                                  campaign.campaignName
                                              )}
                                              onChange={() =>
                                                this.handleCheckboxChange(
                                                  campaign
                                                )
                                              }
                                            />
                                            <div>{campaign.campaignName}</div>
                                          </div>
                                        ))}
                                    </Col>
                                  </Row>
                                </div>
                              ) : (
                                <div className="loading-container">
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "30%",
                                      left: 0,
                                      width: "100%",
                                      height: "100%",
                                    }}
                                  >
                                    <CircularProgress
                                      className="loading"
                                      style={{ margin: "auto" }}
                                    />
                                  </div>
                                </div>
                              )}
                            </Row>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              className="btn btn-primary add-rules-btn pt-2"
                              style={{ height: "43px !important" }}
                              onClick={this.save}
                            >
                              Add
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    )}
                  </div>
                  <div className="custom-dropdown-container">
                    <label>Show</label>
                    <div className="dropdownContent">
                      <p
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {this.state.getRulesByStatus
                          ? this.state.getRulesByStatus
                          : "All Status"}
                        <i
                          className="fa fa-angle-down down-arrow-right"
                          aria-hidden="true"
                        ></i>
                        <i
                          className="fa fa-angle-up up-arrow-right"
                          aria-hidden="true"
                        ></i>
                      </p>
                      <ul
                        className="dropdown-menu shadow rounded"
                        style={{ minWidth: "100px" }}
                        aria-labelledby="dropdownMenuButton1"
                      >
                        <li onClick={(e) => this.filterRulesByStatus("All Status")}>
                          All Status
                        </li>
                        <li
                          onClick={(e) => this.filterRulesByStatus("Enabled")}
                        >
                          Enabled
                        </li>
                        <li onClick={(e) => this.filterRulesByStatus("Paused")}>
                          Paused
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md={5}>
                <div className="filter-container">
                  <Row>
                    <Col md={12} className="padding-lr-10">
                      <div
                        className="d-flex align-items-center refresh-button me-2"
                        onClick={this.refresh}
                      >
                        <i
                          className="fa-solid fa-arrows-rotate p-2"
                          style={{ color: "#9ca3af " }}
                        ></i>
                      </div>
                      <div>
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
                      <div>
                        <Link
                          to="/ads/add-automation-rules/0"
                          className="btn btn-primary add-rules-btn pt-2"
                          style={{ height: "43px !important" }}
                        >
                          Add Rules
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          <div className="dashboard-container padding-lr-30">
            <Row>
              <Col>
                <AutomationRulesListTable
                  checkBox={false}
                  tabName="Marketplaces"
                  filterData={this.state.globalFilterFromData}
                  searchKey={this.state.searchKeyFilter}
                  filterDateRange={this.state.globalFilterDateRange}
                  perPage={this.state.perPage}
                  currPage={this.state.currPage}
                  parentCallback={this.handleCallbackTotalData}
                  handleSelectedRules={this.handleSelectedRules}
                  fetchRulesByStatus={this.state.getRulesByStatus}
                  pageReload={this.state.pageReload}
                  selectedAccount={this.props.searchResult}
                />
              </Col>
            </Row>
          </div>
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
                  <span> of {this.state.filteredCount} total entries</span>
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
      </DashboardLayout>
    );
  }
}

export default AutomationRules;
