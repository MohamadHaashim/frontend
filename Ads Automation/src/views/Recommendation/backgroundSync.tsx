import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { CircularProgress, Pagination, Stack } from "@mui/material";


let columns: GridColDef[] = [];
var targetId = "";
interface Report {
  dateRange: string;
  impressions: number;
  clicks: number;
  orders: number;
  acos: number;
}
interface ResultProps {
  searchResult: any;
}
const BackgroundSync: React.FunctionComponent<ResultProps> = (props) => {
  let currPage = 1;
  let dataLength = 50;
  const [apiLoading, setApiLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);


  useEffect(() => {
    setApiLoading(true);
    if (props.searchResult !== "") {
      backgroundsync();
    }
  }, [searchText, props.searchResult]);


  const applyDataLength = (e) => {
    dataLength = parseInt(e.target.value);
    setPerPage(e.target.value);
    currPage = activePage;
    backgroundsync();
  };

  const backgroundsync = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/BackgroundServices/Reports/All";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: props.searchResult,
        pageNumber: currPage,
        pageSize: dataLength,
        globalFilters: {
          searchText: searchText,
          advancedFilters: null,
        },
      }),
    };

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
                          style={{ overflow: "hidden", whiteSpace: "normal" }}
                        >
                          {params.row.campaignName}
                        </div>
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

  const handleChange = (event, value: number) => {
    currPage = value;
    setActivePage(value);
    dataLength = perPage;
    backgroundsync();
  };



  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      setSearchText(event.target.value);
      event.preventDefault();
    }
  };



  return (
    <DashboardLayout>
      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 ">
          <div className="back-arrow-container d-flex align-items-center  ">
            <span className="title">Background Sync</span>
          </div>
          <div className="d-flex">
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
        {!apiLoading ? (
          <div style={{ height: "calc(85vh - 120px)", width: "100%" }}>
            <DataGrid
              className="mt-3"
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter={true}
              rowHeight={40}
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

export default BackgroundSync;
