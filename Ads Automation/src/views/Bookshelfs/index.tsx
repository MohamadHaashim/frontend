/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Row, Col, Form } from "react-bootstrap";
import "./index.css";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import ColumnFilter from "../../components/Filters/cloumn-filter";
import ConditionFilter from "../../components/Filters/condition-filter";

import BookshelfTable from "../../components/CusDataTable/bookshelf-table";

import LinkIcon from "../../assets/images/icons/link-icon.svg";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import PauseIcon from "../../assets/images/icons/pause.svg";
import ExportIcon from "../../assets/images/icons/export.svg";
import TagIcon from "../../assets/images/icons/tag-icon.svg";
import Moment from "moment";
import { toast } from "react-toastify";
import { threadId } from "worker_threads";

class Bookshelfs extends Component {
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
    metaData: [],
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
    selectedTab: "Status",
    statusTarget: "",
    targeted: "",
    datainput: "",
    selectedRowid: [],
    marketplace: "",
    selctedunit: "",
    setTagacos: "",
    setexpenses: "",
    SetTagsAdd: "",
    apiLoading: true,
    DataLoading: true,
    countSelected: 0,
    dropdownDataFilter: [
      {
        keyName: "",
        displayName: "",
        selected: false,
      },
    ],
    searchKeyValue: [],
    selectedColumnName: [],

    // searchKeyValue: string[];
    // globalFilterFromData: [], // Replace 'any' with the actual type
    // searchKeyFilter: '',
    // globalFilterDateRange: [], // Replace 'any' with the actual type
    // filterOptionData: [],
  };
  constructor(props) {
    super(props);
    this.onChangeDateRangeSubmitGlobal =
      this.onChangeDateRangeSubmitGlobal.bind(this);
    //this.state.searchKeyValue
    this.onItemCheck = this.onItemCheck.bind(this);
  }
  componentDidMount() {
    this.getMetaData();
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
    // this.setState({ dropdownDataFilter: childData.dropdownDatas });

    // let newCreateCampaignFormData: any = this.state.dropdownDataFilter;

    // newCreateCampaignFormData.keyName.push(childData.dropdownDatas.keyName);
    // newCreateCampaignFormData.keyName.push(childData.dropdownDatas.keyName);

    this.setState({ dropdownDataFilter: childData.dropdownDatas });
    console.log(
      "childData. dropdownDatas " + JSON.stringify(childData.dropdownDatas)
    );
  };
  handleSelectedRowCallBack = (rowIds) => {
    console.log("Selected Row Id's: ", rowIds);
    this.setState({ selectedRowid: rowIds });
    console.log("Selected Row Id's" + rowIds.length);
    this.setState({ countSelected: rowIds.length });
  };

  applyPagination = (e, pageNo: any) => {
    console.log("pagination no: ", pageNo);
    this.setState({ currPage: pageNo });
  };
  handleChange = (event, value: number) => {
    this.setState({ currPage: value });
  };

  getMetaData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://api.aimosa.io/MasterData/meta";
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
  cancelDropdown = () => {
    const eleRm: any = document.getElementsByClassName("dropdown-menu");
    if (eleRm) {
      if (eleRm.length > 0) {
        eleRm[0].classList.remove("show");
        eleRm[1].classList.remove("show");
      }
    }
  };
  applyColumns = () => {
    // console.log(
    //   "12345678 apply columns : " +
    //     JSON.stringify(this.state.dropdownDataFilter)
    // );
    // aaa
    //setColumFiltervalue(searchKeyValue);
    console.log("searchkey value  " + this.state.searchKeyValue);
    this.setState({ selectedColumnName: this.state.searchKeyValue });
  };
  // set condiction
  // function onItemCheck(e, item) {
  //c   if (e.target.checked === true) {
  //     setSearchKeyValue((current) => [...current, e.target.name]);
  //     //console.log("setSearchKeyValue true " + setSearchKeyValue);
  //   }

  //   if (e.target.checked === false) {
  //     setSearchKeyValue((current) =>
  //       current.filter((item) => item !== e.target.name)
  //     );
  //     //console.log("setSearchKeyValue false " + setSearchKeyValue);
  //   }
  // }
  // const onItemCheck = (e, item) => {
  //   if (e.target.checked == true) {
  //     setSearchKeyValue((current) => [...current, e.target.name]);
  //   }

  //   if (e.target.checked == false) {
  //     setSearchKeyValue((current) =>
  //       current.filter((itemName) => itemName !== e.target.name)
  //     );
  //   }
  // };
  // onItemCheck(e, item) {
  //   //console.log("only name  " + e.target.name);
  //   let newCreateCampaignFormData: any = this.state.searchKeyValue;

  //   if (e.target.checked === true) {
  //     newCreateCampaignFormData.push(e.target.name);
  //     this.setState({ searchKeyValue: newCreateCampaignFormData });
  //     console.log(e.target.checked + "keyData");
  //   }

  //   if (e.target.checked == true) {
  //         this.setState.searchKeyValue((current) => [...current, e.target.name]);
  //       }
  // }
  onItemCheck = (e, item) => {
    this.setState({ searchKeyValue: "" });
    //var { searchKeyValue } = this.state;
    console.log("onclick");
    var data: any = this.state.searchKeyValue;

    if (e.target.checked) {
      var data3 = data.filter((name) => name == e.target.name);
      // console.log("data3= "+data3)
      if (data3 == null || data3 == "") {
        data.push(e.target.name);
        console.log("e.target.name null " + e.target.name);
      }
      // console.log("selected=" + data);
    }

    if (!e.target.checked) {
      var data5 = data.filter((name) => name !== e.target.name);
      data.length = 0;
      data.push(data5);
    }
    console.log("valuesss", data);
    this.setState({ searchKeyValue: data });
  };
  selectTab = (tabName) => {
    this.setState({ selectedTab: tabName });
  };
  handleBulkOperationStaus = (e) => {
    console.log("status" + e.target.value);
    this.setState({ statusTarget: e.target.value });
  };
  handleDailyoperation = (e) => {
    console.log("Datastatus" + e.target.value);
    this.setState({ targeted: e.target.value });
  };
  handleDailyoperation1 = (val) => {
    console.log("Datastatus" + val.target.value);
    this.setState({ datainput: val.target.value });
  };
  handleDailyoperation2 = (e) => {
    console.log("Datastatus" + e.target.value);
    this.setState({ datainput: e.target.value });
  };
  handleExportData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    try {
      const response = await fetch("https://api.aimosa.io/BookShelf/Export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "Bookshelf exported_data.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Handle success
      console.log("Export successful");
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };
  handleAdds = async () => {
    console.log("handleAdds=" + this.state.selectedRowid);

    // if (!this.state.selectedRowid) {
    //   return toast.info("Select rows to update");
    // }
    // if (!this.state.setTagacos) {
    //   return toast.info("Select the Asin values");
    // }
    if (this.state.selectedRowid.length > 0 && this.state.setTagacos)
      console.log("dataghsts=" + this.state.selectedRowid);
    // this.setState({ setTagacos: "" });

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/Bulkoperation",

      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          asin: this.state.selectedRowid,
          tags: [""],
          targetAcos: parseInt(this.state.setTagacos),
          addAdExpenses: null,
        }),
        // abc
      }
    );
    const responceData = await response;
    console.log("best    =s    pathh ", responceData);
    if (responceData.status) {
      let result = responceData;
      toast("Record updated successfully");
      // fetchData();
    } else {
      toast("Unable to update");
    }
    this.setState({ apiLoading: false });
    this.setState({ setTagacos: "" });
  };

  handleAddExpenses = async () => {
    console.log("handleAddExpenses" + this.state.selectedRowid);
    if (this.state.selectedRowid.length > 0 && this.state.setexpenses) {
      // this.setState({ setTagacos: "" });
      // if (!this.state.setexpenses) {
      //   return toast.info("Select rows to update");
      // }
      // if (!this.state.selectedRowid) {
      //   return toast.info("Select the Asin values");
      // }

      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const response = await fetch(
        "https://api.aimosa.io/BookShelf/Bulkoperation",
        //"https://api.aimosa.io/BookShelf/" + clickedId + "/Tag",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            asin: this.state.selectedRowid,
            tags: [""],
            targetAcos: null,
            addAdExpenses: parseInt(this.state.setexpenses),
          }),
          // abc
        }
      );
      const responceData = await response;
      console.log("best    =s    pathh ", responceData);
      if (responceData.status) {
        let result = responceData;
        toast("Record updated successfully");
        // fetchData();
      } else {
        toast("Unable to update");
      }
    }
  };
  handleAddTags = async () => {
    console.log("handleAddTags" + this.state.selectedRowid);

    if (this.state.selectedRowid.length > 0 && this.state.SetTagsAdd) {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const response = await fetch(
        "https://api.aimosa.io/BookShelf/Bulkoperation",
        //"https://api.aimosa.io/BookShelf/" + clickedId + "/Tag",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            asin: this.state.selectedRowid,
            tags: [this.state.SetTagsAdd],
            targetAcos: null,
            addAdExpenses: null,
          }),
          // abc
        }
      );
      const responceData = await response;
      console.log("best    =s    pathh ", responceData);
      if (responceData.status) {
        let result = responceData;
        toast("Record updated successfully");
        // fetchData();
      } else {
        toast("Unable to update");
      }
      this.setState({ DataLoading: false });
    }
  };

  render() {
    return (
      <DashboardLayout>
        <div className="main-cont-header bookself-container">
          <Row className="page-header">
            <Col>
              <div className="main-con-page-title-container">
                <div className="title">
                  <h3 className="page-title">Bookshelf</h3>
                </div>
              </div>
            </Col>
            <Col className="text-end last-sync">
              <span>Last App Sync :</span>

              <span className="time-summery">
                {" "}
                {this.state.lastUpdatedDate || "Not available"}
              </span>
            </Col>
          </Row>
        </div>
        <div className="main-content-container">
          <hr />
          <div className="dashboard-container padding-lr-30">
            <Row>
              <Col md={7}>
                <Row>
                  <Col md={4}>
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
                  </Col>
                  <Col md={4}>
                    <div className="bulk-operation-container width-200 mx-2">
                      <div className="dropdownContent width-200">
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
                        >
                          {/* <li>Add Tags</li> */}
                          <li>
                            <button
                              className="changePassword btnBackgoundRemove disableInput"
                              data-bs-toggle="modal"
                              data-bs-target="#addTagModel1"
                            >
                              {" "}
                              Add Tags
                            </button>
                          </li>
                          <li>
                            <button
                              className="changePassword btnBackgoundRemove disableInput"
                              data-bs-toggle="modal"
                              data-bs-target="#addTagModel2"
                            >
                              {" "}
                              Set Target ACoS
                            </button>
                          </li>
                          <li>
                            <button
                              className="changePassword btnBackgoundRemove disableInput"
                              data-bs-toggle="modal"
                              data-bs-target="#addTagModel3"
                            >
                              {" "}
                              Add Expenses
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                <div className="filter-container">
                  <Row>
                    <Col md={12} className="padding-lr-10">
                      <div className="filter-item filter-link-container dropdownContent">
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
                          className="dropdown-menu dropdown-menu-lg-end"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <ConditionFilter
                            parentCallback={this.handleCallback}
                            dropdownData={this.state.dropdownDatas}
                            metaData={this.state.metaData}
                          />
                        </div>
                      </div>

                      <div className="filter-item column-link-container dropdownContent">
                        <p
                          id="dropdownMenuButton2"
                          data-bs-toggle="dropdown"
                          data-bs-auto-close="outside"
                          aria-expanded="false"
                          data-bs-display="static"
                        >
                          <i>
                            <img src={PauseIcon} alt="filter icon" />
                          </i>
                          <span>Columns</span>
                          <i
                            className="fa fa-angle-down down-arrow-right"
                            aria-hidden="true"
                          ></i>
                        </p>
                        <div
                          className="dropdown-menu dropdown-menu-lg-start"
                          aria-labelledby="dropdownMenuButton1"
                        >
                          <form>
                            <div className="set-max-height-400">
                              {/* <ColumnFilter
                                columnList={this.state.dropdownDatas}
                              /> */}
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th scope="col">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        //checked={checked}
                                        id="mastercheck"
                                        //onChange={(e) => onMasterCheck(e)}
                                      />
                                    </th>
                                    <th scope="col">Column Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {this.state.dropdownDataFilter.map(
                                    (list, i) => (
                                      <tr
                                        key={list.keyName}
                                        // className={
                                        //   list.selected ? "selected" : ""
                                        // }
                                      >
                                        <th scope="row">
                                          <input
                                            type="checkbox"
                                            //checked={list.checked}
                                            className="form-check-input Selected-filter"
                                            // id="rowcheck{user.id}"
                                            onChange={(e) =>
                                              this.onItemCheck(e, list.selected)
                                            }
                                            name={list.keyName}
                                          />
                                        </th>
                                        <td>{list.displayName}</td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <hr />
                            <div className="footer">
                              <button
                                type="button"
                                className="btn btn-default"
                                onClick={this.cancelDropdown}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={this.applyColumns}
                              >
                                Apply
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                      <div className="filter-item export-link-container">
                        <p>
                          <i>
                            <img src={ExportIcon} alt="filter icon" />
                          </i>
                          <span onClick={this.handleExportData}>Export</span>
                        </p>
                      </div>
                      <div className="filter-item export-link-container last">
                        <p>
                          <i>
                            <img src={TagIcon} alt="filter icon" />
                          </i>
                          <span>Manage Tags</span>
                        </p>
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
                <BookshelfTable
                  checkBox={false}
                  tabName="Marketplaces"
                  filterData={this.state.globalFilterFromData}
                  searchKey={this.state.searchKeyFilter}
                  filterDateRange={this.state.globalFilterDateRange}
                  perPage={this.state.perPage}
                  currPage={this.state.currPage}
                  parentCallback={this.handleCallbackTotalData}
                  parentSlectedRowCallBack={this.handleSelectedRowCallBack}
                  reloadTableData={this.state.apiLoading}
                  daatareloading={this.state.DataLoading}
                  hideColumn={this.state.selectedColumnName}
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

            <div
              className="modal fade"
              id="addTagModel2"
              aria-hidden="true"
              aria-labelledby="exampleModalToggleLabel3"
            >
              <div className="modal-dialog ">
                <div className="modal-content addTagModel">
                  <Row className="addTagInputContainer">
                    <Col className="addTagModelContainers">
                      <h4>Set Target ACoS</h4>
                      <p>
                        You will add this tag to the {this.state.countSelected}{" "}
                        product{this.state.countSelected > 1 ? <>s</> : <></>}{" "}
                        that you have selected.
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="enter target AcoS here"
                        onChange={(e) =>
                          this.setState({ setTagacos: e.target.value })
                        }
                        value={this.state.setTagacos}
                      />
                      <div className="addTagBtnContainer">
                        <button
                          className="addTagCancell"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Cancel
                        </button>
                        <button
                          // abc
                          className="addTagSave"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          //onClick={patchTagData}
                          onClick={this.handleAdds}
                        >
                          Save
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="addTagModel3"
              aria-hidden="true"
              aria-labelledby="exampleModalToggleLabel3"
            >
              <div className="modal-dialog ">
                <div className="modal-content addTagModel">
                  <Row className="addTagInputContainer">
                    <Col className="addTagModelContainers">
                      <h4> Add Expenses</h4>
                      <p>
                        You will add this tag to the {this.state.countSelected}{" "}
                        product{this.state.countSelected > 1 ? <>s</> : <></>}{" "}
                        that you have selected.
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="enter target AcoS here"
                        // onChange={(e) => tagInputValue(e)}
                        onChange={(e) =>
                          this.setState({ setexpenses: e.target.value })
                        }
                        value={this.state.setexpenses}
                      />
                      <div className="addTagBtnContainer">
                        <button
                          className="addTagCancell"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Cancel
                        </button>
                        <button
                          // abc
                          className="addTagSave"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={this.handleAddExpenses}
                        >
                          Save
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div
              className="modal fade"
              id="addTagModel1"
              aria-hidden="true"
              aria-labelledby="exampleModalToggleLabel3"
            >
              <div className="modal-dialog ">
                <div className="modal-content addTagModel">
                  <Row className="addTagInputContainer">
                    <Col className="addTagModelContainers">
                      <h4> Add Tag</h4>
                      <p>
                        You will add this tag to the {this.state.countSelected}{" "}
                        product{this.state.countSelected > 1 ? <>s</> : <></>}{" "}
                        that you have selected.
                      </p>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="enter target AcoS here"
                        // onChange={(e) => tagInputValue(e)}
                        onChange={(e) =>
                          this.setState({ SetTagsAdd: e.target.value })
                        }
                        value={this.state.SetTagsAdd}
                      />
                      <div className="addTagBtnContainer">
                        <button
                          className="addTagCancell"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Cancel
                        </button>
                        <button
                          // abc
                          className="addTagSave"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={this.handleAddTags}
                        >
                          Save
                        </button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}

export default Bookshelfs;
