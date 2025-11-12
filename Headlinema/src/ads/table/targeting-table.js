import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import "./indextable.css";
import CircularProgress from "@mui/material/CircularProgress";
import { Row, Col, Modal, Button } from "react-bootstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import load from "../../assets/images/icons/Spinner.gif";
import Moment from "moment";
import ConditionFilter from "../../components/Filters/condition-filter";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import ExportIcon from "../../assets/images/icons/export.svg";
import axios from "axios";
import { toast } from "react-toastify";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { Badge } from "antd";

let rows= [];
let columns = [];

function TargetingTable(props) {
  let apiEndPoint =
    "https://api.agilensmart.com/Ads/SPCampaignManager/" +
    props.tabName;
  let apiEndPoint2 =
    "https://api.agilensmart.com/Ads/SBCampaignManager/" +
    props.tabName;
  let pageload = true;
  let currPage = 1;
  let dataLength = 50;
  let exporturl = "";
  const [selectedRowid, setSelectedRows] = useState([]);
  const [metaData, setMetaData] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [filterDateRange, setFilterDateRange] = useState([]);
  let filterData = [];
  const [globalFilterFromData, setGlobalFilterFromData] = useState([]);
  const [searchKeyFilter, setSearchKeyFilter] = useState("");

  // aaa
  const [columFiltervalue, setColumFiltervalue] = useState([]);
  const [dropdownDataFilter, SetDropdownDataFilter] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [searchKeyValue, setSearchKeyValue] = useState([]);
  const [dropdownDatas, setDropdownDatas] = useState([]);
  const [checked, setChecked] = useState(false);
  const [pageLength, setPageLength] = useState(50);
  const [filter, setFilter] = useState([]);
  const [filterShow, setFilterShow] = useState(false);
  const [sliceIndex, setSliceIndex] = useState();
  const [statusModal, setStatusModal] = useState(false);
  const [bidModal, setBidModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [bidValue, setBidValue] = useState("");
  const [bidValue1, setBidValue1] = useState("Select Bid");
  const [bidValue2, setBidValue2] = useState("Select Unit");
  const [selectedStatusRow, setSelectedStatusRow] = useState([]);
  const [sortModel, setSortModel] = useState([]);
  const [sortModeldata, setSortModelData] = useState([]);

  let searchKey = "";
  useEffect(() => {
    setMetaData(props.metaData);
  }, [props.metaData, metaData]);

  useEffect(() => {
    if (props.tabName && pageload) {
      // fetchData();
      pageload = false;
    }
  }, []);

  useEffect(() => {
    setApiLoading(true);
    if (props.condition && props.selectedProfiles && props.filterDateRange) {
      if (filterDateRange !== props.filterDateRange) {
        setFilterDateRange(props.filterDateRange);
      }
      if(filter.length > 0){
        setFilterShow(true)
      }
      else{
        setFilterShow(false)
      }
      filterData=globalFilterFromData
      searchKey = searchKeyFilter
      columns = [];
      fetchData();
    }
  }, [props.condition,props.selectedProfiles,props.filterDateRange,sortModeldata,activePage,perPage,globalFilterFromData,searchKeyFilter]);

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
      setApiLoading(false);
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
          }

          
          else if (headers[i]["keyName"] === "adKeywordStatus") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,
              renderCell: (params) => (
                <i className={"status " + params.row.adKeywordStatus}></i>
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
          } 
          else if (headers[i]["keyName"] === "campaignName") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,
             
              description:headers[i]["fullName"]
            });
          } 
          else if (headers[i]["keyName"] === "keyword") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,
             
              description:headers[i]["fullName"]
            });
          } 
          else if (headers[i]["keyName"] === "adGroupName") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,
              
              description:headers[i]["fullName"]
            });
          } 
          else if (headers[i]["keyName"] === "targeting") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,  
              description:headers[i]["fullName"]
            });
          } 
          else if (headers[i]["keyName"] === "portfolioName") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 150,  
              description:headers[i]["fullName"]
            });
          } 
          else if (headers[i]["keyName"] === "targetingText") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 250,
           
              description:headers[i]["fullName"]
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
              description:headers[i]["fullName"]
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
              description:headers[i]["fullName"]
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
              description:headers[i]["fullName"]
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
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "acosClicks7d") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.acosClicks7d}%</span>
              ),
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "roasClicks7d") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 80,

              renderCell: (params) => (
                <span >{params.row.roasClicks7d}%</span>
              ),
              description:headers[i]["fullName"]
            });
          }
          else if (headers[i]["keyName"] === "matchType") {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 100,
              
              editable:true,
              description:headers[i]["fullName"]
            });
          } else {
            columns.push({
              field: headers[i]["keyName"],
              headerName: headers[i]["displayName"],
              width: 100,
              
              description:headers[i]["fullName"]
            
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
          } else if (name === "Cost") {
            newFilter = `Spend ${value} , ${secondValue}`;
          } else if (name === "TargetingText") {
            newFilter = `Targeting ${value} , ${secondValue}`;
          } else if (name === "AcosClicks14d" || name === "AcosClicks7d" ) {
            newFilter = `ACOS ${value} , ${secondValue}`;
          } else if (name === "RoasClicks14d" ||name === "RoasClicks7d"  ) {
            newFilter = `ROAS ${value} , ${secondValue}`;
          } else if (name === "Sales14d" || name === "Sales17" ) {
            newFilter = `Sales ${value} , ${secondValue}`;
          } else if (name === "Purchases14d" || name === "Purchases7d") {
            newFilter = `Orders ${value} , ${secondValue}`;
          } else if (name === "Purchases") {
            newFilter = `Orders ${value} , ${secondValue}`;
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
          } else if (name === "Cost") {
            newFilter = `Spend ${operator} ${value}`;
          } else if (name === "TargetingText") {
            newFilter = `Targeting ${operator} ${value}`;
          } else if (name === "AcosClicks14d" || name === "AcosClicks7d" ) {
            newFilter = `ACOS ${operator} ${value}`;
          } else if (name === "RoasClicks14d" ||name === "RoasClicks7d"  ) {
            newFilter = `ROAS ${operator} ${value}`;
          } else if (name === "Sales14d" || name === "Sales17" ) {
            newFilter = `Sales ${operator} ${value}`;
          } else if (name === "Purchases14d" || name === "Purchases7d") {
            newFilter = `Orders ${operator} ${value}`;
          } else if (name === "Purchases") {
            newFilter = `Orders ${operator} ${value}`;
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

    searchKey = searchKeyFilter;
    setGlobalFilterFromData(childData);
    filterData = childData;
    dataLength = Number(pageLength);
    fetchData();
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

  let userToken = localStorage.getItem("userToken");
  let AuthToken = "Bearer " + userToken;

  const handleExportData = async () => {
    setSpinner(true);
    if (props.selectedProfiles === "SP") {
      exporturl =
        "https://api.agilensmart.com/Ads/SPCampaignManager/Targets/Export";
    } else if (props.selectedProfiles === "SB") {
      exporturl =
        "https://api.agilensmart.com/Ads/SBCampaignManager/Targets/Export";
    } else if (props.selectedProfiles === "SD") {
      exporturl =
        "https://api.agilensmart.com/Ads/SDCampaignManager/Targets/Export";
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
      a.download = `Targeting exported_data ${advancedFilterDateRange.startDate.slice(
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

  const ChangeStatus = () => {
    const Data = {
      type: "Target",
      reportType:props.selectedProfiles,
      operation: "Status",
      value: {
        Status: selectedStatus,
        Target: selectedStatusRow,
      },
      identifiers: null,
    };
    const formattedObject = {
      ...Data,
      value: JSON.stringify(Data.value),
    };
    console.log(formattedObject);
    if (formattedObject) {
      setSelectedStatusRow([])
      const Status = async () => {
        let userToken = localStorage.getItem("userToken");
        let AuthToken = "Bearer " + userToken;
        let url =
          "https://api.agilensmart.com/BulkUpdates/BulkRequest";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify(formattedObject),
        };
        try {
          const response = await fetch(url, requestOptions);
          const responceData = await response.json();
          console.log(responceData);
          setSelectedRows([])
           if(responceData.success === true){
        
    filterData = globalFilterFromData;
    searchKey = searchKeyFilter;
    dataLength = Number(pageLength);
            toast(responceData.message)
            fetchData()
           }
           else{
            toast(responceData.message)
           }
           setSelectedStatus("Select Status");
          setStatusModal(false);
        } catch (error) {
          setSelectedStatus("Select Status");
          console.log(error);
          setStatusModal(false);
        }
      };
      Status();
    }
  };
  const ChangeBid = () => {
    const Data = {
      type: "Target",
      reportType:props.selectedProfiles,
      operation: "Default Bid",
      value: {
        DefaultBid: {
          ActionType: bidValue1,
          BidValue: bidValue,
          Unit: bidValue2,
        },
        Target: selectedStatusRow,
      },
      identifiers: null,
    };
    const formattedObject = {
      ...Data,
      value: JSON.stringify(Data.value),
    };
    console.log(formattedObject);

    if(formattedObject){
      setSelectedStatusRow([])
      const Bid = async () => {
        let userToken = localStorage.getItem("userToken");
        let AuthToken = "Bearer " + userToken;
        let url =
          "https://api.agilensmart.com/BulkUpdates/BulkRequest";
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify(formattedObject),
        };
        try {
          const response = await fetch(url, requestOptions);
          const responceData = await response.json();
          console.log(responceData);
          setSelectedRows([])
          if(responceData.success === true){
            filterData = globalFilterFromData;
            searchKey = searchKeyFilter;
            dataLength = Number(pageLength);
            toast(responceData.message)
            fetchData()
           }
           else{
            toast(responceData.message)
           }
          setBidValue("")
          setBidValue1("Select Bid")
          setBidValue2("Select Unit")
          setBidModal(false);
        } catch (error) {
          console.log(error);
          setBidValue("")
          setBidValue1("Select Bid")
          setBidValue2("Select Unit")
          setBidModal(false);
        }
      };
      Bid();
    }
  };


  const handleStatus = (e) => {
    setSelectedStatus(e.target.value);
  };
  const handleBid = (e) => {
    setBidValue(e.target.value);
  };
  const handleBid1 = (e) => {
    setBidValue1(e.target.value);
  };
  const handleBid2 = (e) => {
    setBidValue2(e.target.value);
  };
  
  const bulkStatus = () => {
    if(selectedRowid.length >0){
      
      setStatusModal(true)
    }
    else{
      toast("Please select minimum one checkbox")
    }

  };
  const bulkBid = () => {
    if(selectedRowid.length > 0){
      setBidModal(true)
    }
    else{
      toast("Please select minimum one checkbox")
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
       
          <Col>
            <div className="custom-dropdown-container">
            <Badge count={selectedRowid.length} color="#fe9900">
          <div className="dropdownContent">
            <button
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                height: "40px",
                paddingBottom: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "5px",
                border: "1px solid #d1d5db",
                width: "100%",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              className="btn"
            >
              Bulk Operation
              <i
                className="fa fa-angle-down"
                aria-hidden="true"
                id="dropdownArrow"
              ></i>
            </button>

            <ul
              className="dropdown-menu shadow rounded"
              style={{ minWidth: "136px" }}
              aria-labelledby="dropdownMenuButton1"
            >
              <li onClick={bulkStatus}>
                <a className="dropdown-item" href="#">
                  Status
                </a>
              </li>
              <li onClick={bulkBid}>
                <a className="dropdown-item" href="#">
                  Bid
                </a>
              </li>
            </ul>
          </div>
        </Badge>
            </div>
          </Col>

        {statusModal && (
          <Modal
            show={statusModal}
            onHide={() => setStatusModal(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Status
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="">
                <select
                  className="form-select"
                  onChange={handleStatus}
                  value={selectedStatus}
                >
                  <option disabled>Select Status</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <div>
                  <Button
                    className="secondary"
                    onClick={() => setStatusModal(false)}
                  >
                    Close
                  </Button>
                </div>
                <div>
                  <Button
                    className="btn btn-primary add-rules-btn "
                    onClick={ChangeStatus}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}
        {bidModal && (
          <Modal
            show={bidModal}
            onHide={() => setBidModal(false)}
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">Bid</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="">
                <select
                  className="form-select"
                  onChange={handleBid1}
                  value={bidValue1}
                >
                  <option disabled>Select Bid</option>
                  <option value="Increase bid by">Increase bid by</option>
                  <option value="Lower bid by">Lower bid by</option>
                  <option value="Set bid to">Set bid to</option>
                </select>
              </div>
              <div className="mt-3">
                <input
                  className="form-control"
                  value={bidValue}
                  onChange={handleBid}
                  style={{ height: "34.85px" }}
                  placeholder="Enter Bid Value"
                ></input>
              </div>
              <div className="mt-3">
                <select
                  className="form-select"
                  onChange={handleBid2}
                  value={bidValue2}
                >
                  <option disabled>Select Unit</option>
                  <option value="%">%</option>
                  <option value="$">$</option>
                </select>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <div>
                  <Button
                    className="secondary"
                    onClick={() => setBidModal(false)}
                  >
                    Close
                  </Button>
                </div>
                <div>
                  <Button
                    className="btn btn-primary add-rules-btn "
                    onClick={ChangeBid}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        )}

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
          <div style={{ height: "calc(75vh - 120px)", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns.filter(
                (col) => !hiddenColumns.includes(col.field)
              )}
           
              checkboxSelection={props.checkBox}
              onRowSelectionModelChange={(id) => {
                const selectedIDs = new Set(id);
                if(props.selectedProfiles === "SD"){
                  const selectedRows = rows
                  .filter((row) => id.includes(row.id))
                  .map((row) => ({
                    TargetId: row.targetingId,
                    Type: row.matchType,
                    ProfileId: props.condition,
                  }));
                setSelectedStatusRow(selectedRows);
                // console.log(selectedRows);
                }
                else{
                  const selectedRows = rows
                  .filter((row) => id.includes(row.id))
                  .map((row) => ({
                    TargetId: row.keywordId,
                    Type: row.matchType,
                    ProfileId: props.condition,
                  }));
                setSelectedStatusRow(selectedRows);
                // console.log(selectedRows);
                }  
                // console.log("idssss" + id);
                setSelectedRows(id);
                // console.log("selected" + selectedRowid);
              }}
              disableRowSelectionOnClick
              hideFooter={true}
              sortingMode="server"
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
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
export default TargetingTable;
