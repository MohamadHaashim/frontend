import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./reports.css";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import ExportIcon from "../../assets/images/icons/export.svg";
import { toast } from "react-toastify";
import load1 from "../../assets/images/icons/Spinner.gif";
import NewChart from "./newchart";
import BasicChart from "./chart";

let columns: GridColDef[] = [];
function Session(props) {
  const [apiLoading, setApiLoading] = useState(false);
  const [rows, setRows] = useState<any[]>([]);
  const [perPage, setPerPage] = useState(50);
  const [spinner, setSpinner] = useState(false);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [header, setHeader] = useState<any[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);

  useEffect(() => {
    if (props.profileId) {
        session();
    }
  }, [props.profileId, searchText,activePage,perPage,sortModeldata]);



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

  const session = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/SellingPartnerService/Sales/Sessions";

      let requestOptions: any = {};
      if (sortModeldata.length > 0) {
        requestOptions = {
          method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: Number(props.profileId),
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
          searchText: searchText,
          advancedFilters: [],
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
            profileId: Number(props.profileId),
            pageNumber: activePage,
            pageSize: perPage,
            globalFilters: {
              searchText: searchText,
              advancedFilters: [],
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
              } else if (headers[i]["keyName"] === "title") {
                columns.push({
                  field: headers[i]["keyName"],
                  headerName: headers[i]["displayName"],
                  minWidth: 250, flex: 1,
                  renderCell: (params) => {
                    return (
                      <>
                        <div className="col-rulename">
                          <div className="col-title">{params.row.title}</div>
                        </div>
                      </>
                    );
                  },
                });
              } else {
                columns.push({
                  field: headers[i]["keyName"],
                  headerName: headers[i]["displayName"],
                  minWidth: 120,
                  maxWidth:120, 
                  
                });
              }
            }
            columns.push({
                field: "chart",
                headerName: "Chart",
                minWidth: 150,
                renderCell: (params) => {  
                  return (
                    <div className="action-icon-box">
                   <NewChart datas={params.row} tabname ={props.tabName} />
                    </div>
                  );
                },
            })
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
  


  const handleExportData = async () => {
    setSpinner(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url2 =
      "https://adsexpert-api.getgrowth.agency/SellingPartnerService/Sales/Session/Export";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
          body: JSON.stringify({
            profileId: Number(props.profileId),
            pageNumber: activePage,
            pageSize: perPage,
            globalFilters: {
              searchText: searchText,
              advancedFilters: [],
            
            },
          }),
        }
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
      a.download = `Session_Report.csv`;
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
    <Row className="ms-2 me-3">
         <div className="action-row d-flex justify-content-between mt-3 " >
          <div className="back-arrow-container d-flex align-items-center  ">
          </div>
          <div className="filter-container">
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
              {!spinner ? (
                <div
                  className="filter-item export-link-container"
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
      {!apiLoading ? (
        <div style={{ height: "calc(80vh - 120px)", width: "100%" }}>
          <DataGrid
            className="mt-3 split-headers"
            rows={rows.map((row, index) => ({ ...row, id: index }))}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter={true}
            rowHeight={50}
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
            <CircularProgress className="loading" style={{ margin: "auto" }} />
          </div>
        </div>
      )}
    </Row>
  );
}

export default Session;
