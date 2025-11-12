import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row, Tab, Tabs } from "react-bootstrap";
import { DateRangePicker} from "rsuite";
import isAfter from "date-fns/isAfter";
import Moment from "moment";
import SchedularChart from "./chart";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import axios from "axios";

let columns: GridColDef[] = [];
const Scheduler: React.FunctionComponent = () => {
  const current = new Date();
  const startDate = new Date(current.setDate(current.getDate() - 30));
  const endDate = new Date();

  const [globalFilterDateRange, setglobalFilterDateRange] = useState<[Date, Date]>([
    startDate,
    endDate,
  ]);

  const [chartData, setChartData] = useState({
    reportsData: {
      totalCount: 0,
      successCount: 0,
      failedCount: 0,
    },
    rulesData: {
      totalCount: 0,
      successCount: 0,
      failedCount: 0,
    },
  });
  const [apiLoading, setApiLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [header, setHeader] = useState<any[]>([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [key, setKey] = useState('report');
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);

  const handleSelect = (k) => {
    console.log(`Selected tab: ${k}`);
    setKey(k);
  };

  const onChangeDateRangeSubmitGlobal = (dateRange) => {
    console.log("Date range submitted:", dateRange);

    if (
      dateRange.length === 2 &&
      dateRange[0] instanceof Date &&
      dateRange[1] instanceof Date
    ) {
      setglobalFilterDateRange(dateRange);
    } else {
      console.error("Invalid date range:", dateRange);
    }
  };

  useEffect(() => {
    if(key){
      SchedulerData()
    }

   const Data = {
      startDate:
        Moment(globalFilterDateRange[0]).format("YYYY-MM-DD") +
        "T13:32:30.064Z",
      endDate:
        Moment(globalFilterDateRange[1]).format("YYYY-MM-DD") +
        "T13:32:30.064Z",
    };
    console.log(Data);

    axios
    .post("https://adsexpert-api.getgrowth.agency/Admin/Ads/SchedulerSummary" , Data)
    .then((res)=>{
      console.log(res.data);
      setChartData(res.data.result)
      
    })
    .catch((error)=>{
      console.log(error); 
    })
  }, [globalFilterDateRange ,searchText ,key, activePage, perPage,sortModeldata])



  const SchedulerData = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Admin/Ads/Scheduler";

      

      let requestOptions: any = {};
      if (sortModeldata.length > 0) {
        requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            searchText:searchText,
            pageNumber: activePage,
            pageSize: perPage,
            sortOptions: [
              {
                columnName: sortModeldata[0].field,
                direction:
                  sortModeldata[0].sort === "asc" ? "Ascending" : "Descending",
              },
            ],
            reportsData: key ==="report" ? true : false,
            startDate:
            Moment(globalFilterDateRange[0]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
          endDate:
            Moment(globalFilterDateRange[1]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
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
            searchText:searchText,
            pageNumber: activePage,
            pageSize: perPage,
            reportsData: key ==="report" ? true : false,
            startDate:
            Moment(globalFilterDateRange[0]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
          endDate:
            Moment(globalFilterDateRange[1]).format("YYYY-MM-DD") +
            "T13:32:30.064Z",
          }),
           
        };
      }


    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        setApiLoading(false);
        let result = responceData.result;
        let data = responceData.result.data;
        setRows(data)
        setTotalRow(result.filteredCount);
        setPerPage(result.perPage);
        setActivePage(result.currPage);
        setLastPage(result.lastPage);
        setHeader(result.headers)

        if (columns.length < 1) {
            let headers = responceData.result.headers;
            for (let i = 0; headers.length > i; i++) {
              if (headers[i]["keyName"] === "parentAsin") {
                columns.push({
                  field: headers[i]["keyName"],
                  headerName: headers[i]["displayName"],
                  minWidth: 120,
                  renderCell: (params) => {
                    return (
                      <>
                        <div className="col-rulename">
                          <div className="col-title">{params.row.parentAsin}</div>
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
                  minWidth: 150,
                  flex:1
                   
                });
              }
            }
    
          }
    
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
      <div className="hider"></div>
      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 ">
          <div className="col-lg-12 col-xl-6 col-sm-12 mt-3 ">
            <div className="back-arrow-container d-flex align-items-center  ">
              <span className="title me-3">Dashboard</span>
              <div className="filters">
                <DateRangePicker
                  placeholder="Select Date Range"
                  onChange={onChangeDateRangeSubmitGlobal}
                  format="yyyy-MM-dd"
                  disabledDate={(date) => isAfter(date, new Date())}
                  defaultValue={[startDate, new Date()]}
                />
              </div>
            </div>
          </div>
        </div>

        <Row className="mt-5 d-flex justify-content-center">
          <Col sm={12} md={6}>
          <h5 style={{fontSize:"14px"}} className="mb-2">Reports Sync & Rules Automation </h5>
          <SchedularChart datas={chartData} />
          </Col>
        </Row>
        <Row className="mt-5">
        <Col>
        <Tabs activeKey={key} onSelect={handleSelect} id="my-tabs">
          <Tab eventKey="report" title="Reports">
          </Tab>
          <Tab eventKey="rules" title="Rules">
          </Tab>
        </Tabs>
      </Col>
          <Col className="d-flex justify-content-end">
          <div className="filter-container ">
            <div className=" d-flex align-item-center">
              <form className="me-3">
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
              </div>
          </Col>
        </Row>

        {!apiLoading ? (
          <div style={{ height: "calc(60vh - 120px)", width: "100%" }} className="mt-3">
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

export default Scheduler;
