
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import { useEffect, useState } from "react";


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
const Dashboard: React.FunctionComponent<ResultProps> = (props) => {
  let currPage = 1;
  let dataLength = 50;
  const [apiLoading, setApiLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);
  const [header, setHeader] = useState<any[]>([]);


  useEffect(() => {
    setApiLoading(true);
    if (props.searchResult !== "") {
      backgroundsync();
      
    }
  }, [searchText, props.searchResult,sortModeldata]);


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
        pageNumber: currPage,
        sortOptions: [
          {
            columnName: sortModeldata[0].field,
            direction: sortModeldata[0].sort=== "asc" ?"Ascending":"Descending",
          },
        ],
        pageSize: dataLength,
        globalFilters: {
          searchText: searchText,
          advancedFilters: null,
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
            pageNumber: currPage,
            pageSize: dataLength,
            globalFilters: {
              searchText: searchText,
              advancedFilters: null,
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
        setHeader(result.headers);

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
       <div className="action-row d-flex justify-content-between mt-5 ">
          <div className="back-arrow-container d-flex align-items-center mt-4 ps-3   ">
            <span className="title">Dashboard</span>
          </div>
        </div>
          <div className="main-cont-header pt-3 ">
       <Row className="d-flex justify-content-center ">
          
          <div className="top-box d-flex">
            <div
              className="box text-center"
              style={{ backgroundColor: "#FE9900" }}
            >
              <div className="pt-2">50000</div>
              <div>Impression</div>
            </div>
            <div
              className="box text-center"
              style={{ backgroundColor: "#FE9900" }}
            >
              <div className="pt-2">30000</div>
              <div>Clicks</div>
            </div>
            <div
              className="box text-center"
              style={{ backgroundColor: "#FE9900" }}
            >
              <div className="pt-2">10000</div>
              <div>Sales</div>
            </div>
            <div
              className="box text-center"
              style={{ backgroundColor: "#FE9900" }}
            >
              <div className="pt-2">$8000</div>
              <div>ROI</div>
            </div>
          </div>
        </Row>
        </div>

      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 ">
          <div className="back-arrow-container d-flex align-items-center  ">
            
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
          <div style={{ height: "calc(70vh - 120px)", width: "100%" }} className="mb-5" >
            <DataGrid
              className="mt-3"
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
                     sortingMode="server"
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

export default Dashboard;
