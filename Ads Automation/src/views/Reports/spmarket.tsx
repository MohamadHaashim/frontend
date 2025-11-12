import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import Moment from "moment";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import load1 from "../../assets/images/icons/Spinner.gif";

interface ResultProps {
  searchResult: any;
}
let columns: GridColDef[] = [];
const SPTraffic: React.FunctionComponent<ResultProps> = (props) => {
  let currPage = 1;
  let dataLength = 50;
  let url ="https://adsexpert-api.getgrowth.agency/MarketingStream/SPTrafficAndConversion/ALL";
  let exportUrl ="";
  const current = new Date();
  const startDate = new Date(current.getTime() - (60 * 60 * 1000));
  startDate.setHours(0, 0, 0, 0);
//  const endDate = new Date(current.getTime() - (2 * 60 * 60 * 1000));
   const endDate = new Date();
  const [globalFilterDateRange, setglobalFilterDateRange] = useState([
    startDate,
    endDate,
  ]);
  const [apiLoading, setApiLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("SP");
  const [rows, setRows] = useState<any[]>([]);
  const [header, setHeader] = useState<any[]>([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [spinner2, setSpinner2] = useState(false);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);

  const onChangeDateRangeSubmitGlobal = (e) => {
    let dateRange = e;
    console.log(dateRange);

    if (dateRange.length > 0) {
      setglobalFilterDateRange(dateRange);
    }
  };
  useEffect(() => {
    setApiLoading(true);
    if (props.searchResult !== "") {
      SpTraffic();
    }
  }, [searchText, props.searchResult,globalFilterDateRange ,selectedAccount,activePage,perPage,sortModeldata]);


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

  const SpTraffic = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let advancedFilterDateRange: any = {};
    if (globalFilterDateRange.length > 0) {
      advancedFilterDateRange = {
        dateRange: "Custom",
        startDate:
        Moment(globalFilterDateRange[0]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") ,
        endDate:
        Moment(globalFilterDateRange[1]).format("YYYY-MM-DDTHH:59:ss.SSS[Z]"),
      };
    }
    if( selectedAccount=== "SP"){
       url ="https://adsexpert-api.getgrowth.agency/MarketingStream/SPTrafficAndConversion/ALL";
    }
    else if(selectedAccount=== "SB"){
       url ="https://adsexpert-api.getgrowth.agency/MarketingStream/SBTrafficAndConversion/ALL";
    }
    else if(selectedAccount=== "SD"){
      url ="https://adsexpert-api.getgrowth.agency/MarketingStream/SDTrafficAndConversion/ALL";
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
          pageNumber: activePage,
          sortOptions: [
            {
              columnName: sortModeldata[0].field,
              direction:
                sortModeldata[0].sort === "asc" ? "Ascending" : "Descending",
            },
          ],
          pageSize: perPage,
          globalFilters: {
            searchText: searchText,
            advancedFilters: null,
            dateRanges: advancedFilterDateRange
          }
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
            advancedFilters: null,
            dateRanges: advancedFilterDateRange
          }
        }),
      };
    }
    
 

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        setApiLoading(false);
        let result = responceData.result;
        console.log(result.data);
        
        setRows(result.data);
        setRows(prevRows => prevRows.map((row, index) => ({ ...row, id: index + 1 })));
        setTotalRow(result.filteredCount);
        setPerPage(result.perPage);
        setActivePage(result.currPage);
        setLastPage(result.lastPage);
        setHeader(result.headers)

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
                        <div
                          className="col-title"
                    
                        >
                          {params.row.campaignName}
                        </div>
                      </div>
                    </>
                  );
                },
              });
            }
             else if (headers[i]["keyName"] === "match_type") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                flex: 0.5,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.match_type}</div>
                      </div>
                    </>
                  );
                },
              });
            } 
             else if (headers[i]["keyName"] === "keyword_type") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                flex: 0.4,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.keyword_type}</div>
                      </div>
                    </>
                  );
                },
              });
            } 
             else if (headers[i]["keyName"] === "keyword_text") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                flex: 0.2,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.keyword_text}</div>
                      </div>
                    </>
                  );
                },
              });
            } 
             else if (headers[i]["keyName"] === "targeting_text") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                flex: 0.4,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.targeting_text}</div>
                      </div>
                    </>
                  );
                },
              });
            } 
             else if (headers[i]["keyName"] === "adgroupName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 150,
                flex: 0.2,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.adgroupName}</div>
                      </div>
                    </>
                  );
                },
              });
            } 
            else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 100,
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

  const handleTrafficExportData = async () => {
    setSpinner(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let advancedFilterDateRange: any = {};
    if (globalFilterDateRange.length > 0) {
      advancedFilterDateRange = {
        dateRange: "Custom",
        startDate:
        Moment(globalFilterDateRange[0]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") ,
        endDate:
        Moment(globalFilterDateRange[1]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      };
    }
   
      if( selectedAccount=== "SP"){
        exportUrl ="https://adsexpert-api.getgrowth.agency/MarketingStream/SPTraffic/Export";
     }
     else if(selectedAccount=== "SB"){
      exportUrl ="https://adsexpert-api.getgrowth.agency/MarketingStream/SBTraffic/Export";
     }
     else if(selectedAccount=== "SD"){
      exportUrl ="https://adsexpert-api.getgrowth.agency/MarketingStream/SDTraffic/Export";
     }
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
          advancedFilters: null,
          dateRanges: advancedFilterDateRange
        },
      }),
    };

    try {
      const response = await fetch(exportUrl, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Traffic_Report_${advancedFilterDateRange.startDate.slice(0, 10)} - ${advancedFilterDateRange.endDate.slice(0, 10)} .csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Handle success
      console.log("Export successful");
      setSpinner(false);
    } catch (error) {
      setSpinner(false);
      toast("Export failed")
      console.error("Error exporting data:", error);
    }
  };

  const handleConversionExportData = async () => {
    setSpinner2(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let advancedFilterDateRange: any = {};
    if (globalFilterDateRange.length > 0) {
      advancedFilterDateRange = {
        dateRange: "Custom",
        startDate:
        Moment(globalFilterDateRange[0]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") ,
        endDate:
        Moment(globalFilterDateRange[1]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      };
    }
   
      if( selectedAccount=== "SP"){
        exportUrl ="https://adsexpert-api.getgrowth.agency/MarketingStream/SPConversion/Export";
     }
     else if(selectedAccount=== "SB"){
      exportUrl ="https://adsexpert-api.getgrowth.agency/MarketingStream/SBConversion/Export";
     }
     else if(selectedAccount=== "SD"){
      exportUrl ="https://adsexpert-api.getgrowth.agency/MarketingStream/SDConversion/Export";
     }
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
          advancedFilters: null,
          dateRanges: advancedFilterDateRange
        },
      }),
    };

    try {
      const response = await fetch(exportUrl, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `Conversion_Report_${advancedFilterDateRange.startDate.slice(0, 10)} - ${advancedFilterDateRange.endDate.slice(0, 10)} .csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      // Handle success
      console.log("Export successful");
      setSpinner2(false);
    } catch (error) {
      setSpinner2(false);
      toast("Export failed")
      console.error("Error exporting data:", error);
    }
  };

  const handeAccountChange =(e)=>{
      columns=[]
        setSelectedAccount(e.target.value)
  }

  const handleSortModelChange = (model) => {
    if(model.length > 0){
    console.log(model);
    const data = header.filter(
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
      <Row className="ms-2 me-2">
        <div className="action-row row d-flex justify-content-between ">
          <div className="col-lg-12 col-xl-6 col-sm-12 mt-4 " >
          <div className="back-arrow-container d-flex align-items-center  ">
            <span className="title me-3">Traffic & Conversion</span>
            <div className="filters">
              <DateRangePicker
                placeholder="Select Date Range"
                onChange={onChangeDateRangeSubmitGlobal}
                format="yyyy-MM-dd HH"
                disabledDate={(date) => isAfter(date, new Date())}
                defaultValue={[startDate, new Date()]}
              />
            </div>
            <div className="accounts ms-3">
                  <select
                    className="form-select"
                    name="accountSelect"
                    id="accountSelect"
                    value={selectedAccount}
                    onChange={handeAccountChange}
                    style={{height:"40px" ,paddingBottom:"10px"}}
                  >
                    <option value="SP">Sponsored Product</option>
                    <option value="SB">Sponsored Brand</option>
                    <option value="SD">Sponsored Display</option>
                  </select>
                </div>
          </div>
          </div>
          <div className=" col-lg-12 col-xl-6 col-sm-12 d-flex justify-content-end mt-4 ">
          <div className="filter-container d-flex align-items-center">
            <div className=" d-flex align-item-center me-3">
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
            </div>
            {!spinner ? (
                <div
                  className="filter-item export-link-container"
                  onClick={handleTrafficExportData}
                >
                  <p style={{border:"1px solid #d1d5db"}} className="me-3 align-content-center">
                    <i>
                      <img src={ExportIcon} alt="filter icon" className="me-2 "  />
                    </i>
                    <span>Traffic </span>
                  </p>
                </div>
              ) : (
                <div className="filter-item export-link-container  text-center">
                  <img src={load1} height={40} width={40} alt="spinner" className="me-5 ms-3" />
                </div>
              )}
            {!spinner2 ? (
                <div
                  className="filter-item export-link-container"
                  onClick={handleConversionExportData}
                >
                  <p style={{border:"1px solid #d1d5db"}}  className="align-content-center">
                    <i>
                      <img src={ExportIcon} alt="filter icon" className="me-2"  />
                    </i>
                    <span>Conversion </span>
                  </p>
                </div>
              ) : (
                <div className="filter-item export-link-container">
                  <img src={load1} height={40} width={40} alt="spinner"  className="me-5 ms-5"  />
                </div>
              )}
          </div>
          </div>
        </div>
        {!apiLoading ? (
          <div style={{ height: "calc(85vh - 120px)", width: "100%" }}>
            <DataGrid
              className="mt-3"
              rows={rows.map((row, index) => ({ ...row, id: index }))}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter={true}
              rowHeight={40}
              sortModel={sortModel}
              sortingMode="server"
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
        ) : (
          <div className="loading-container">
            <div
              style={{
                marginBottom: "250px",
                marginTop: "250px",
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
    </DashboardLayout>
  );
};

export default SPTraffic;
