import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import "./indextable.css";
import { Row, Col } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Moment from "moment";
import load from "../../assets/images/icons/Spinner.gif";
import ConditionFilter from "../../components/Filters/condition-filter";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

let rows= [];
let columns = [];

function CampaignTable(props) {
  let apiEndPoint =
    "https://api.agilensmart.com/Ads/SPCampaignManager/" +
    props.tabName;
  let pageload = true;
  let exporturl = "";
  
  const [metaData, setMetaData] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState([]);
  const [marketplace, setMarketplace] = useState("");

  // let filterData: any = [];
  const [matchType, setMatchtype] = useState("");
  const [globalFilterFromData, setGlobalFilterFromData] = useState([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");


  // aaa
  const [columFiltervalue, setColumFiltervalue] = useState([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState([]);
  const [dropdownDatas, setDropdownDatas] = useState([]);
  const [filter, setFilter] = useState([]);
  const [filterShow, setFilterShow] = useState(false);
  const [sliceIndex, setSliceIndex] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [sortModeldata, setSortModelData] = useState([]);

  let searchKey = "";
  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData, metaData]);

  useEffect(() => {
    setApiLoading(true);
    if (props.condition && props.selectedProfiles && props.filterDateRange) {
      if (filterDateRange !== props.filterDateRange) {
        setFilterDateRange(props.filterDateRange);
      }
      if (filter.length > 0) {
        setFilterShow(true);
      } else {
        setFilterShow(false);
      }
      columns = [];
      fetchData();
    }
  }, [props.condition, props.selectedProfiles, props.filterDateRange, sortModeldata, activePage, perPage, globalFilterFromData,searchKeyFilter]);

  useEffect(() => {
    if (props.tabName && pageload) {
      // fetchData();
      pageload = false;
    }
  }, []);

  const fetchData = async () => {
    setApiLoading(true);
    const token = localStorage.getItem("token");
    if (props.selectedProfiles === "SP") {
      apiEndPoint =
        "https://api.agilensmart.com/Ads/SPCampaignManager/" +
        props.tabName;
    } else if (props.selectedProfiles === "SB") {
      apiEndPoint =
        "https://api.agilensmart.com/Ads/SBCampaignManager/" +
        props.tabName;
    } else if (props.selectedProfiles === "SD") {
      apiEndPoint =
        "https://api.agilensmart.com/Ads/SDCampaignManager/" +
        props.tabName;
    }

    // let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer "+token;
    let url = apiEndPoint;
    let advancedFilters= [];
    let advancedFilterDateRange= {};

    if (globalFilterFromData.length > 0) {
      advancedFilters = globalFilterFromData;
    }
    if (props.filterDateRange.length > 0) {
      advancedFilterDateRange = {
        dateRange: "Custom",
        startDate:
          Moment(props.filterDateRange[0]).format("YYYY-MM-DD") +
          "T13:32:30.064Z",
        endDate:
          Moment(props.filterDateRange[1]).format("YYYY-MM-DD") +
          "T13:32:30.064Z",
      };
    }

    let requestOptions= {};
    if (sortModeldata.length > 0) {
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          profileId: Number(props.condition),
          pageNumber: activePage,
          pageSize: perPage,
          sortOptions: [
            {
              columnName: sortModeldata[0].field,
              direction:
                sortModeldata[0].sort === "asc" ? "Ascending" : "Descending",
            },
          ],
          globalFilters: {
            searchText: searchKeyFilter,
            advancedFilters: advancedFilters,
            dateRanges: advancedFilterDateRange,
          },
        }),
      };
    } else {
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          profileId: Number(props.condition),
          pageNumber: activePage,
          pageSize: perPage,
          globalFilters: {
            searchText: searchKeyFilter,
            advancedFilters: advancedFilters,
            dateRanges: advancedFilterDateRange,
          },
        }),
      };
    }
    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      let result = responceData.result;
      setTotalRow(result.filteredCount);
      setPerPage(result.perPage);
      setActivePage(result.currPage);
      setLastPage(result.lastPage);
      if (result.data && result.data.length > 0) {
        setMarketplace(result.data[0].marketplace);
      }
      setMatchtype(result.data.matchType);

      let headers = responceData.result.headers;
      setDropdownDatas(headers);
      SetDropdownDataFilter(headers);

      if (columns.length < 1) {
        for (let i = 0; headers.length > i; i++) {
          if (headers[i]["keyName"] === "status") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,
              description: headers[i]["fullName"],
              renderCell: (params) => (
                <i
                  className={
                    "status " +
                    (params.row.status === "Paused,Enabled" ||
                    params.row.status === "Enabled,Paused"
                      ? "Paused"
                      : params.row.status)
                  }
                ></i>
              ),
            });
          } else if (headers[i]["keyName"] === "marketplace") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,
              renderCell: (params) => (
                <i className={"flag-" + params.row.marketplace}></i>
              ),
              description: headers[i]["fullName"],
            });
          } else if (headers[i]["keyName"] === "campaignName") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,

              description: headers[i]["fullName"],
            });
          } else if (headers[i]["keyName"] === "campaignBiddingStrategy") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 200,
              description: headers[i]["fullName"],
            });
          } 
          else if (headers[i]["keyName"] === "acos") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.acos} %</span>
              ),
              description: headers[i]["fullName"],
            });
          } 
          else if (headers[i]["keyName"] === "roas") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.roas} %</span>
              ),
              description: headers[i]["fullName"],
            });
          } 
          else if (headers[i]["keyName"] === "clickThroughRate") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.clickThroughRate} %</span>
              ),
              description: headers[i]["fullName"],
            });
          } 
          else if (headers[i]["keyName"] === "cr") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.cr} %</span>
              ),
              description: headers[i]["fullName"],
            });
          } 
          else {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 100,
              flex: 0.5,
              description: headers[i]["fullName"],
            });
          }
        }
      }
      rows = responceData.result.data;
      setApiLoading(false);
    } catch (error) {
      toast("Something went wrong");
      setApiLoading(false);
      rows = [];
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (filter.length > 0) {
      setFilterShow(true);
    } else {
      setFilterShow(false);
    }
  }, [filter]);

  const handleCallback = (childData) => {
    if (childData.length > 0) {
      const newFilters = childData.map((data) => {
        const name = data.conditions[0].columnName;
        const operator = data.conditions[0].operator;
        const value = data.conditions[0].value;
        const secondValue = data.conditions[0].secondValue;
        let newFilter;
        if (name === "Status") {
          const updateValue =
            value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
          newFilter = `${name} = ${updateValue}`;
        } else if (operator === "Between") {
          if (name === "KeywordBid") {
            newFilter = `Bid Between ${value} , ${secondValue}`;
          } else if (name === "ClickThroughRate") {
            newFilter = `CTR Between ${value} , ${secondValue}`;
          } else if (name === "CostPerClick") {
            newFilter = `CPC Between ${value} , ${secondValue}`;
          } else {
            newFilter = `${name} Between ${value} , ${secondValue}`;
          }
        } else {
          if (name === "KeywordBid") {
            newFilter = `Bid ${operator} ${value}`;
          } else if (name === "ClickThroughRate") {
            newFilter = `CTR ${operator} ${value}`;
          } else if (name === "CostPerClick") {
            newFilter = `CPC ${operator} ${value}`;
          } else {
            newFilter = `${name} ${operator} ${value}`;
          }
        }
        return newFilter;
      });
      console.log(newFilters);
      setFilter(newFilters);
    } else {
      setFilter([]);
    }

    setActivePage(1);
    setGlobalFilterFromData(childData);
  };

  const cancelFilter = (i) => {
    const newFilter = filter.slice(0, i);
    setFilter(newFilter);
    setSliceIndex(i);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setActivePage(1);
      setSearchKeyFilter(event.target.value);
      event.preventDefault();
    }
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    setActivePage(1);
    setPerPage(Number(e.target.value));
  };

  // aaa hide data
  const hiddenColumns = columFiltervalue;
  // console.log("hide column : " + hiddenColumns);

  const handleChange = (event, value) => {
    setActivePage(Number(value));
  };

  const handleExportData = async () => {
    setSpinner(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    if (props.selectedProfiles === "SP") {
      exporturl =
        "https://api.agilensmart.com/Ads/SPCampaignManager/Campaigns/Export";
    } else if (props.selectedProfiles === "SB") {
      exporturl =
        "https://api.agilensmart.com/Ads/SBCampaignManager/Campaigns/Export";
    } else if (props.selectedProfiles === "SD") {
      exporturl =
        "https://api.agilensmart.com/Ads/SDCampaignManager/Campaigns/Export";
    }
    try {
      let advancedFilters = [];
      let advancedFilterDateRange = {};

      if (globalFilterFromData.length > 0) {
        advancedFilters = globalFilterFromData;
      }
      if (props.filterDateRange.length > 0) {
        advancedFilterDateRange = {
          dateRange: "Custom",
          startDate:
            Moment(props.filterDateRange[0]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
          endDate:
            Moment(props.filterDateRange[1]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
        };
      }

      const response = await fetch(
        exporturl,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            profileId: Number(props.condition),
            pageNumber: activePage,
            pageSize: perPage,
            globalFilters: {
              searchText: searchKeyFilter,
              advancedFilters: advancedFilters,
              dateRanges: advancedFilterDateRange,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Campaign exported_data ${advancedFilterDateRange.startDate.slice(
        0,
        10
      )} - ${advancedFilterDateRange.endDate.slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Handle success
      console.log("Export successful");
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      toast("Export failed");
      console.error("Error exporting data:", error);
    }
  };


  const handleSortModelChange = (model) => {
    if(model.length > 0){
    console.log(model);
    const data = dropdownDatas.filter(
      (header) => header.keyName === model[0]?.field
    );
    console.log(data);
    setSortModel(model)

    setSortModelData((prevSortModel) => ([{
      ...prevSortModel,
      field: data[0].name,
      sort: model[0].sort
    }]));

  }
  else{
    setSortModel([])
    setSortModelData([])
  }
  };

  const columnsToShow = columns.filter(
    (col) => !hiddenColumns.includes(col.field)
  );

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Row className="mt-2 mb-2">
        <Col>
        <div className="d-flex justify-content-end">
            {/* <Row>
              <Col md={3} className="padding-lr-10"></Col>
              <Col md={9}> */}
                <div>
                  <form>
                  <div className="marketsearch-filter-container search-filter-container">
                      <i className="fa fa-search"></i>
                      <input
                        type="text"
                        placeholder="Search"
                        id="globalSearch"
                        name="globalSearch"
                        onKeyDown={handleKeyDown}
                      />
                    </div>
                  </form>
                </div>
                <div className="mx-2 filter-item filter-link-container dropdownContent">
                  <p
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    data-bs-display="static"
                    className="filter-toggle"
                  >
                    <i className="filter-icon">
                      <img src={FilterIcon} alt="filter icon" />
                    </i>
                    <span className="filter-text">Filter</span>
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
                      parentCallback={handleCallback}
                      sliceIndex={sliceIndex}
                      dropdownData={dropdownDatas}
                      metaData={metaData}
                    />
                  </div>
                </div>
                {!spinner ? (
                  <div
                  className="filter-item export-link-container"
                  onClick={handleExportData}
                >
                  <p className="export-toggle">
                    <i className="export-icon">
                      <img src={ExportIcon} alt="export icon" />
                    </i>
                    <span className="export-text">Export</span>
                  </p>
                </div>
                ) : (
                  <div className="filter-item export-link-container">
                    <img src={load} height={40} width={40} alt="spinner" />
                  </div>
                )}
              {/* </Col>
            </Row> */}
          </div>
        </Col>
      </Row>
      {!apiLoading ? (
        <div>
          {filterShow && (
            <div className="filter-box d-flex  align-items-center">
              <FilterListOutlinedIcon fontSize="medium" />
              {filter.map((item, index) => (
                <div
                  className="filter-content ms-3 d-flex align-items-center justify-content-between"
                  key={index}
                >
                  {item}
                  <CancelOutlinedIcon
                    className="clear-filter ms-2"
                    fontSize="small"
                    onClick={() => cancelFilter(index)}
                  />
                </div>
              ))}
            </div>
          )}

          <div
            style={{ height: "calc(75vh - 120px)", width: "100%" }}
            className="custom-datagrid-container"
          >
            <DataGrid
              rows={rows}
              columns={columnsToShow}
              checkboxSelection={props.checkBox}
              style={{ position: "relative" }}
              hideFooter={true}
              rowHeight={40}
              getRowClassName={(params) =>
                params.id === rows[rows.length - 1].id ? "last-row" : ""
              }
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
            />
            <div className="custom-table-footer">
              <Row>
                <Col md={5}>
                  <form className="table-footer-left">
                    <span>Show </span>
                    <label>
                      <select
                        className="form-select"
                        defaultValue={perPage}
                        onChange={(event) => applyDataLength(event)}
                      >
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                      </select>
                    </label>
                    <span> of {totalRow} total entries</span>
                  </form>
                </Col>
                <Col md={7}>
                  <div className="table-footer-right">
                    <Stack spacing={2}>
                      <Pagination
                        count={lastPage}
                        page={activePage}
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
            <CircularProgress className="loading" style={{ margin: "auto" }} />
          </div>
        </div>
      )}
    </div>
  );
}
export default CampaignTable;
