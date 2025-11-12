import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import "./index.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Moment from "moment";
import ConditionFilter from "../../../components/Filters/condition-filter";
import load from "../../../assets/images/icons/Spinner.gif";
import FilterIcon from "../../../assets/images/icons/filter-icon.svg";
import ExportIcon from "../../../assets/images/icons/export.svg";
import axios from "axios";
import { toast } from "react-toastify";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';

let rows: any = [];
let columns: GridColDef[] = [];

function PortfoliosTable(props) {
  let apiEndPoint =
    "https://adsexpert-api.getgrowth.agency/Ads/SPCampaignManager/" +
    props.tabName;
  let pageload = true;
  let exporturl =""

  const [metaData, setMetaData] = useState<any>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [filterDateRange, setFilterDateRange] = useState<any[]>([]);

  // aaa
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState<any[]>([]);
  const [columFiltervalue, setColumFiltervalue] = useState<any[]>([]);

  let filterData: any = [];
  let Condition: any = [];
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");
  const [pageLength, setPageLength] = useState(50);
  const [filter, setFilter] = useState<string[]>([]); 
  const [filterShow, setFilterShow] = useState(false);
  const [sliceIndex, setSliceIndex] = useState<any>();
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);

  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData, metaData]);


  useEffect(() => {
    setApiLoading(true);
    if (props.condition && props.selectedProfiles && props.filterDateRange ) {
      if (filterDateRange !== props.filterDateRange) {
        setFilterDateRange(props.filterDateRange);
       
      }
      if(filter.length > 0){
        setFilterShow(true)
      }
      else{
        setFilterShow(false)
      }
      columns=[]
   fetchData()
    }
  }, [props.condition,props.selectedProfiles,props.filterDateRange,sortModeldata,activePage,perPage,globalFilterFromData,searchKeyFilter]);

  useEffect(() => {
    if (props.tabName && pageload) {
      // fetchData();
      pageload = false;
    }
  }, []);

  const fetchData = async () => {
    setApiLoading(true);
    if(props.selectedProfiles === "SP"){
      apiEndPoint= "https://adsexpert-api.getgrowth.agency/Ads/SPCampaignManager/" +  props.tabName;
     }
     else if(props.selectedProfiles === "SB"){
       apiEndPoint= "https://adsexpert-api.getgrowth.agency/Ads/SBCampaignManager/" +  props.tabName;
     }
     else if(props.selectedProfiles === "SD"){
       apiEndPoint= "https://adsexpert-api.getgrowth.agency/Ads/SDCampaignManager/" +  props.tabName;
     }

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = apiEndPoint;
    let advancedFilters: any = [];
    let advancedFilterDateRange: any = {};

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

    let requestOptions: any = {};
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
              direction: sortModeldata[0].sort=== "asc" ?"Ascending":"Descending",
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
              renderCell: (params) => (
                <i className={"status " + params.row.status}></i>
              ),
              description:headers[i]["fullName"]
            });
          } else if (headers[i]["keyName"] === "marketplace") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,
              renderCell: (params) => (
                <i className={"flag-" + params.row.marketplace}></i>
              ),
              description:headers[i]["fullName"]
            });
          } else if (headers[i]["keyName"] === "portfolioName") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 200,
             
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "acos") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span>{params.row.acos} %</span>
              ),
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "roas") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span>{params.row.roas} </span>
              ),
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "clickThroughRate") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span>{params.row.clickThroughRate} %</span>
              ),
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "cr") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span>{params.row.cr} %</span>
              ),
              description:headers[i]["fullName"]
            });
          }
           else {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              minWidth: 100,
              flex:0.5,
              description:headers[i]["fullName"]
            });
          }
        }
      }
      rows = responceData.result.data;
      setApiLoading(false);
    } catch (error) {
      setApiLoading(false);
      toast("Something went wrong");
      setApiLoading(false);
      rows = [];
      console.error("Error fetching data:", error);
    }
  };




  useEffect(() => {
    if(filter.length > 0){
      setFilterShow(true)
    }
    else{
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

  const handleKeyDown = (event: any) => {
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

  const handleChange = (event, value: number) => {

    setActivePage(Number(value))

  };


  const handleExportData = async () => {
    setSpinner(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let advancedFilters: any = [];
    let advancedFilterDateRange: any = {};
  
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
    if(props.selectedProfiles === "SP"){
      exporturl ="https://adsexpert-api.getgrowth.agency/Ads/SPCampaignManager/Portfolios/Export"
    }
    else if(props.selectedProfiles === "SB"){
      exporturl ="https://adsexpert-api.getgrowth.agency/Ads/SBCampaignManager/Portfolios/Export"
    }
    else if(props.selectedProfiles === "SD"){
      exporturl ="https://adsexpert-api.getgrowth.agency/Ads/SDCampaignManager/Portfolios/Export"
    }

    try {
      const response = await fetch(
        exporturl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            profileId:Number(props.condition),
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
      a.download = `Portfolio exported_data ${advancedFilterDateRange.startDate.slice(0, 10)} - ${advancedFilterDateRange.endDate.slice(0, 10)}.csv`;
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

  return (
    <div style={{ height: 500, width: "100%" }}>
      <Row className="mt-2 mb-2">
        <Col md={5}>
       
        </Col>
        <Col>
          <div className="filter-container">
            <Row>
              <Col md={3} className="padding-lr-10"></Col>
              <Col md={9}>
                <div>
                  <form>
                    <div className="search-filter-container">
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
                    <span className="me-2">Filter</span>
                    <i
                      className="fa fa-angle-down down-arrow-right me-1"
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
                {!spinner ? (
                  <div className="filter-item export-link-container" onClick={handleExportData}>
                    <p>
                      <i>
                        <img src={ExportIcon} alt="filter icon" />
                      </i>
                      <span >Export</span>
                    </p>
                  </div>
                ) : (
                  <div className="filter-item export-link-container">
                    <img src={load} height={40} width={40} alt="spinner" />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      {!apiLoading ? (
        <div>
        {filterShow && 
            <div className="filter-box d-flex align-items-center ">
              <FilterListOutlinedIcon  fontSize="medium"/>
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
        <div style={{height: "calc(75vh - 120px)", width: "100%" }}>
          
          <DataGrid
            rows={rows}
            //columns={columns}
            // aaa
            columns={columns.filter(
              (col) => !hiddenColumns.includes(col.field)
            )}
            checkboxSelection={props.checkBox}
            hideFooter={true}
            rowHeight={40}
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
export default PortfoliosTable;
