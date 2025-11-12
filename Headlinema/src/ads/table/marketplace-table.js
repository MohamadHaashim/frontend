/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import "./indextable.css";
import { Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Moment from "moment";
import ConditionFilter from "../../components/Filters/condition-filter";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import ExportIcon from "../../assets/images/icons/export.svg";
import load from "../../assets/images/icons/Spinner.gif";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { useLocation } from "react-router-dom";
let rows = [];
let columns = [];

function MarketplaceTable(props) {
  console.log(props,"props is the isidijfl")
  let apiEndPoint =
    "https://api.agilensmart.com/Ads/SPCampaignManager/" +
    props.tabName;

  let pageload = true;
  const [metaData, setMetaData] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [filterDateRange, setFilterDateRange] = useState([]);
  const [spinner, setSpinner] = useState(false);

  // aaa
  const [dropdownDatas, setDropdownDatas] = useState([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState([]);
  const [columFiltervalue, setColumFiltervalue] = useState([]);
  let filterData = [];
  let Condition = [];

  let exporturl = "";
  const [globalFilterFromData, setGlobalFilterFromData] = useState([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");
  const [pageLength, setPageLength] = useState(50);

  const [filter, setFilter] = useState([]);
  const [filterShow, setFilterShow] = useState(false);
  const [sliceIndex, setSliceIndex] = useState();
  const [sortModel, setSortModel] = useState([]);
  const [sortModeldata, setSortModelData] = useState([]);

  const location = useLocation();
  const profileId = location?.state?.state?.profileId || "";
  // console.log("location", profileId)

  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData, metaData]);
  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    setApiLoading(true);
    if (props.condition && props.selectedProfiles && props.filterDateRange) {
      if (filterDateRange !== props.filterDateRange) {
        setFilterDateRange(props.filterDateRange);
      }
      if (filter.length > 0) {
        setFilterShow(true)
      }
      else {
        setFilterShow(false)
      }

      columns = [];
      fetchData();
    }
  }, [props.condition, props.selectedProfiles, props.filterDateRange, sortModeldata, activePage, perPage, globalFilterFromData, searchKeyFilter]);

  useEffect(() => {
    if (props.tabName && pageload) {
      pageload = false;
    }
  }, []);

  useEffect(()=>{
    console.log("this is calling filterdata");
    // fetchData();
  },[props.filterDateRange,props.condition])
  console.log(sortModel);

  const parsedData = JSON.parse(localStorage.getItem('initialId'));
  const initialId = parsedData?.id;

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    setApiLoading(true);
    if (props.selectedProfiles === "SP") {
      apiEndPoint =
        "https://api.agilensmart.com/Ads/SPCampaignManager/" +
        props.tabName;
    } else if (props.selectedProfiles === "SB") {
      apiEndPoint =
        "https://api.agilensmart.com/Ads/SBCampaignManager/" +
        props.tabName;
    }
    else if (props.selectedProfiles === "SD") {
      apiEndPoint =
        "https://api.agilensmart.com/Ads/SDCampaignManager/" +
        props.tabName;
    }

    
    let AuthToken = "Bearer "+token;
    let url = apiEndPoint;
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
    if (Condition.length > 0) {
    }
    let requestOptions = {};
    if (sortModeldata.length > 0) {
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },

        body: JSON.stringify({
          profileId: Number(props.condition) || initialId,
          pageNumber: activePage,
          pageSize: perPage,
          sortOptions: [
            {
              columnName: sortModeldata[0].field,
              direction: sortModeldata[0].sort === "asc" ? "Ascending" : "Descending",
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
          profileId: Number(props.condition) || initialId,
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
      console.log("fetch try")
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      let result = responceData.result;
      console.log("fetch try result", result)

      setTotalRow(result.filteredCount);
      setPerPage(result.perPage);
      setActivePage(result.currPage);
      setLastPage(result.lastPage);
      let headers = responceData.result.headers;

      setDropdownDatas(headers);
      SetDropdownDataFilter(headers);

      if (columns.length < 1) {
        for (let i = 0; headers.length > i; i++) {
          if (headers[i]["keyName"] === "campaignStatus") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <i className={"status " + params.row.campaignStatus}></i>
              ),
              description: headers[i]["fullName"]
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
              description: headers[i]["fullName"]
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
              description: headers[i]["fullName"]
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
              description: headers[i]["fullName"]
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
              description: headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "roi") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.roi} %</span>
              ),
              description: headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "campaign") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,
              description: headers[i]["fullName"]
            });
          } else {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 100,
              flex: 1,
              description: headers[i]["fullName"]
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
      setFilterShow(true)
    }
    else {
      setFilterShow(false)
    }
  }, [filter])

  const handleCallback = (childData) => {
    console.log(childData);
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

    setActivePage(1)
    setGlobalFilterFromData(childData);
  };

  const cancelFilter = (i) => {
    const newFilter = filter.slice(0, i);
    setFilter(newFilter);
    setSliceIndex(i);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setActivePage(1)
      setSearchKeyFilter(event.target.value);
      event.preventDefault();
    }
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    setActivePage(1)
    setPerPage(Number(e.target.value))

  };

  // aaa hide data
  const hiddenColumns = columFiltervalue;
  // console.log("hide column : " + hiddenColumns);

  const handleChange = (event, value) => {

    setActivePage(Number(value))

  };

  // filter
  const filterdData = (e) => {
    console.log("click check button " + e.target.value);
    // aaa
    setColumFiltervalue(e.target.value);
  };

  const handleExportData = async () => {
    setSpinner(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
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
    if (props.selectedProfiles === "SP") {
      exporturl =
        "https://api.agilensmart.com/Ads/SPCampaignManager/MarketPlaces/Export";
    } else if (props.selectedProfiles === "SB") {
      exporturl =
        "https://api.agilensmart.com/Ads/SBCampaignManager/MarketPlaces/Export";
    }
    else if (props.selectedProfiles === "SD") {
      exporturl =
        "https://api.agilensmart.com/Ads/SDCampaignManager/MarketPlaces/Export";
    }
    try {
      const response = await fetch(exporturl, {
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
      });

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Marketplace exported_data ${advancedFilterDateRange.startDate.slice(0, 10)} - ${advancedFilterDateRange.endDate.slice(0, 10)}.csv`;
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
    if (model.length > 0) {
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
    else {
      setSortModel([])
      setSortModelData([])
    }
  };

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
          {filterShow &&
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
          }
          <div style={{ height: "calc(75vh - 120px)", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns.filter(
                (col) => !hiddenColumns.includes(col.field)
              )}
              checkboxSelection={props.checkBox}
              hideFooter={true}
              rowHeight={40}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}

            // getRowClassName={(params) => {
            //   console.log(params);
            //   params.columns.map((column) => {
            //     console.log(column.field);

            //     if (column.field === "clicks") {
            //       return "filter-column-background";
            //     }
            //   });
            //   return "white-column-background";
            // }}
            />
            <div className="custom-table-footer">
              <Row>
                <Col md={5}>
                  <form className="table-footer-left marketplace-footer-left">
                    <span>Show </span>
                    <label>
                      <select
                        className="form-select dropdowns"
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
export default MarketplaceTable;
