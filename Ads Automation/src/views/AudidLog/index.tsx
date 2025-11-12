import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { DataGrid, GridSortModel, GridColDef } from "@mui/x-data-grid";
import load1 from "../../assets/images/icons/Spinner.gif";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import ConditionFilter from "../../components/Filters/condition-filter";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

let rows: any = [];
let columns: GridColDef[] = [];
interface ResultProps {
  searchResult: any;
}
const AuditLog: React.FunctionComponent<ResultProps> = (props) => {
  let apiEndPoint =
    "https://adsexpert-api.getgrowth.agency/Rule/ChangeLog";

  let filterData: any = [];
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [row, setRows] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [spinner, setSpinner] = useState(false);
  const ProfileName = localStorage.getItem("ProfileName");
  const [filter, setFilter] = useState<string[]>([]);
  const [filterShow, setFilterShow] = useState(false);
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);
  const [metaData, setMetaData] = useState<any>([]);
  const [sliceIndex, setSliceIndex] = useState<any>();
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);

  useEffect(() => {
    if (props.searchResult) {
      AuditLogs();
      getMetaData();
    }
  }, [props.searchResult, sortModeldata, perPage, searchText, activePage, globalFilterFromData
  ]);

  const AuditLogs = async () => {
    setApiLoading(true);
    setRows([]);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://adsexpert-api.getgrowth.agency/ChangeLog/All";
    let advancedFilters: any = [];

    if (globalFilterFromData.length > 0) {
      advancedFilters = globalFilterFromData;
    }
    let requestOptions: any = {};
    if (sortModeldata.length > 0) {
      requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          profileId: props.searchResult,
          sortOptions: [
            {
              columnName: sortModeldata[0].field,
              direction:
                sortModeldata[0].sort === "asc" ? "Ascending" : "Descending",
            },
          ],
          pageNumber: activePage,
          pageSize: perPage,
          globalFilters: {
            searchText: searchText,
            advancedFilters: advancedFilters,
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
          profileId: props.searchResult,
          pageNumber: activePage,
          pageSize: perPage,
          globalFilters: {
            searchText: searchText,
            advancedFilters: advancedFilters,
          },
        }),
      };
    }

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        setApiLoading(false);
        let result = responceData.result;
        setRows(result.data);
        setTotalRow(result.filteredCount);
        setPerPage(result.perPage);
        setActivePage(result.currPage);
        setLastPage(result.lastPage);
        setDropdownDatas(result.headers);

        if (columns.length < 1) {
          let headers = responceData.result.headers;
          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "campaignName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 0.5,
                minWidth: 200,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">
                          {params.row.campaignName}
                        </div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "matchType") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                flex: 0.5,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.matchtype}</div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "adGroupName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                // flex: 0.3,
                minWidth: 170,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">
                          {params.row.adGroupName}
                        </div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "ruleName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 0.2,
                minWidth: 130,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.ruleName}</div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "target") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 0.3,
                minWidth: 130,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.target}</div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "action") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 220,
                flex: 0.2,

                renderCell: (params) => {
                  return (
                    <>
                      {params.value && (
                        <div className="col-rulename">
                          <div>
                            {params.value.changedValue !== null && (
                              <div
                                className="changed-value"
                                style={{ color: "#000000DE" }}
                              >
                                Difference : {params.value.changedValue}
                              </div>
                            )}
                            <div className="history-value">
                              Prev : {params.value.previousValue} Now :{" "}
                              {params.value.currentValue}
                            </div>
                            <div></div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "time") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 170,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.time}</div>
                      </div>
                    </>
                  );
                },
              });
            } else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 150,
              });
            }
          }
        }
        console.log(columns);
      } else {
        setRows([]);
        setApiLoading(false);
      }
    } catch (error) {
      setApiLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const applyDataLength = (e) => {
    setActivePage(1);
    setPerPage(Number(e.target.value));
  };

  const handleChange = (event, value: number) => {
    setActivePage(Number(value));
  };

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setActivePage(1);
      setSearchText(event.target.value);
      event.preventDefault();
    }
  };

  const handleExportData = async () => {
    setSpinner(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url2 =
      "https://adsexpert-api.getgrowth.agency/ChangeLog/Export";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: props.searchResult,
        pageNumber: activePage,
        pageSize: perPage,
        globalFilters: {
          searchText: searchText,
          advancedFilters: [],
        },
      }),
    };
    try {
      const response = await fetch(url2, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${ProfileName}_Changelog.csv`;
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

  const handleCallback = (childData) => {
    console.log(childData);
    if (childData.length > 0) {
      const newFilters = childData.map((data) => {
        const name = data.conditions[0].columnName;
        const operator = data.conditions[0].operator;
        const value = data.conditions[0].value;
        const secondValue = data.conditions[0].secondValue;
        let newFilter;
        newFilter = `${name} ${operator} ${value}`;
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
  const getMetaData = async () => {
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
      setMetaData(responceData.result);
    } catch (error) {
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

  const cancelFilter = (i) => {
    const newFilter = filter.slice(0, i);
    setFilter(newFilter);
    setSliceIndex(i);
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
    setSortModelData([])
    setSortModel([])
  }
  };

  return (
    <DashboardLayout>
      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 pt-2 mb-4 ">
          <div className="back-arrow-container d-flex align-items-center   ">
            <span className="title">Change Log</span>
          </div>

          <div className="filter-container ">
            <div className=" d-flex align-items-center">
              <form className="">
                <div className="search-filter-container ">
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
              <div className="filter-container">
                <div className="filter-item  ms-3 me-3 filter-link-container dropdownContent">
                  <p
                    id="dropdownMenuButton1"
                    className="mb-0 align-content-center"
                    data-bs-toggle="dropdown"
                    // style={{ border: "1px solid #d1d5db" , width:"100px"}}
                    data-bs-auto-close="outside"
                    aria-expanded="false"
                    data-bs-display="static"
                  >
                    <i>
                      <img src={FilterIcon} alt="filter icon" />
                    </i>
                    <span className="me-2 " style={{ fontSize: "14px" }}>
                      Filter
                    </span>
                    <i
                      className="fa fa-angle-down down-arrow-right me-1 "
                      aria-hidden="true"
                    ></i>
                  </p>
                  <div
                    className="dropdown-menu dropdown-menu-lg-end"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <ConditionFilter
                      parentCallback={handleCallback}
                      dropdownData={dropdownDatas}
                      metaData={metaData}
                      sliceIndex={sliceIndex}
                    />
                  </div>
                </div>
              </div>
              {!spinner ? (
                <div
                  className="filter-item export-link-container "
                  onClick={handleExportData}
                >
                  <p>
                    <i>
                      <img src={ExportIcon} alt="filter icon" />
                    </i>
                    <span>Export</span>
                  </p>
                </div>
              ) : (
                <div className="filter-item export-link-container">
                  <img src={load1} height={40} width={40} alt="spinner" />
                </div>
              )}
            </div>
          </div>
        </div>

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
            style={{ height: "calc(85vh - 120px)", width: "100%" }}
            className="change-log-table-container "
          >
            {!apiLoading ? (
              <>
                <DataGrid
                  rows={row}
                  columns={columns}
                  checkboxSelection={false}
                  hideFooter={true}
                  rowHeight={70}
                  disableRowSelectionOnClick
                  sortModel={sortModel}
                  sortingMode="server"
                  onSortModelChange={handleSortModelChange}
                />
              </>
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
          </div>
        </div>

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
      </Row>
    </DashboardLayout>
  );
};

export default AuditLog;
