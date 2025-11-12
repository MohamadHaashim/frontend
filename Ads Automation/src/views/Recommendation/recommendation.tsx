import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Button, Col, Dropdown, Form, Modal, Row } from "react-bootstrap";
import { DataGrid, GridColDef,GridSortModel, GridRowSelectionModel } from "@mui/x-data-grid";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import view from "../../assets/images/icons/view-report.png";
import view1 from "../../assets/images/icons/view-report-1.png";
import approved from "../../assets/images/icons/approve.png";
import approved1 from "../../assets/images/icons/approve-1.png";
import { Badge, Popconfirm, Tooltip } from "antd";
import { report } from "process";
import ConditionFilter from "../../components/Filters/condition-filter";
import FilterIcon from "../../assets/images/icons/filter-icon.svg";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { param } from "jquery";

let columns: GridColDef[] = [];
let modalColoumns: GridColDef[] = [];

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
const Recommendation: React.FunctionComponent<ResultProps> = (props) => {

  const [isHovered2, setIsHovered2] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [approvePopup, setapprovePopup] = useState(false);
  const [viewDataPopup, setviewDataPopup] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [selectedCompareReport, setSelectedCompareReport] = useState<string[]>(
    []
  );
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [globalFilterFromData, setGlobalFilterFromData] = useState<any[]>([]);
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [reportLoading, setReportLoading] = useState(false);
  const [approvedStatus, setApprovedStatus] = useState(false);
  const [dropdownDatas, setDropdownDatas] = useState<any[]>([]);
  const [metaData, setMetaData] = useState<any>([]);
  const [sliceIndex, setSliceIndex] = useState<any>();
  const [singleApprove, setSingleApprove] = useState({
    id: [],
    customBid: 0,
    description: "",
  });
  const [reportsRow, setReportsRow] = useState<Report[]>([]);
  const [filter, setFilter] = useState<string[]>([]); 
  const [filterShow, setFilterShow] = useState(false);
  const [sortModeldata, setSortModelData] = useState<any>([]);
  const [selectedBid, setSelectedBid] = useState<any>([]);
  const [customBidShow , setCustomBidShow] = useState(true);

  useEffect(() => {
    setApiLoading(true);
    if (props.searchResult !== "") {
      Recommendation();
      getMetaData();
    }
  }, [props.searchResult, selectedCompareReport,sortModeldata,searchText,perPage,activePage,globalFilterFromData]);

  useEffect(() => {
    setProfileId(props.searchResult);
  }, [props.searchResult]);



  useEffect(() => {
    if (modalColoumns.length === 0) {
      const newColumns = [
        { field: "dateRange", headerName: "Days Range", width: 150 },
        { field: "impressions", headerName: "Impression", width: 100, flex: 1 },
        { field: "clicks", headerName: "Clicks", width: 100, flex: 1 },
        { field: "orders", headerName: "Orders", width: 100, flex: 1 },
        {
          field: "acos",
          headerName: "ACOS",
          width: 100,
          flex: 1,
          renderCell: (params) => (
            <span style={{ fontFamily: "Roboto" }}>{params.row.acos}%</span>
          ),
        },
        { field: "spend", headerName: "Spend", width: 100, flex: 1 },
        { field: "roas", headerName: "ROAS", width: 100, flex: 1 },
        { field: "sales", headerName: "Sales", width: 100, flex: 1 },
        { field: "cr", headerName: "CR", width: 100, flex: 1, hidable: true },
        { field: "costPerClick", headerName: "CPR", width: 100, flex: 1 },
        { field: "clickThroughRate", headerName: "CTR", width: 100, flex: 1 },
      ];
      modalColoumns.push(...newColumns);
      console.log(modalColoumns);
    }
  }, []);

  const Recommendation = async () => {
    columns = [];
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Recommendation/All";
    let advancedFilters: any = [];

    if (globalFilterFromData.length > 0) {
      advancedFilters = globalFilterFromData;
    }
    let requestOptions: any = {};
    if (sortModeldata.length > 0) {
      requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          profileId: props.searchResult,
          sortOptions: [
            {
              columnName: sortModeldata[0].field,
              direction: sortModeldata[0].sort=== "asc" ?"Ascending":"Descending",
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        columns = [];
        if (columns.length < 1) {
          const initialHeaders = responceData.result.headers.filter(
            (header) => header.keyName !== "approvedOn"
          );
          console.log(initialHeaders);

          let headers = initialHeaders;
          // let headers = responceData.result.headers;
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
            } else if (headers[i]["keyName"] === "matchType") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 130,
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
                flex: 0.3,
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
                minWidth: 150,
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
                flex: 0.2,
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
            }
            //  else if (headers[i]["keyName"] === "approvedOn") {
            //   columns.push({
            //     field: headers[i]["keyName"],
            //     headerName: headers[i]["displayName"],
            //     minWidth: 130,
            //     renderCell: (params) => {
            //       return (
            //         <>
            //           <div className="col-rulename">
            //             <div className="col-title">{params.row.approvedOn}</div>
            //           </div>
            //         </>
            //       );
            //     },
            //   });
            // }
            else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 100,
              });
            }
          }
        }
        console.log(selectedCompareReport);

        if (selectedCompareReport.length > 0) {
          selectedCompareReport.map((report) => {
            if (report === "Impression") {
              columns.push({
                field: "impressions7D",
                headerName: "Last 7days",
                width: 100,
              });
              columns.push({
                field: "impressions14D",
                headerName: "Last 14days",
                width: 100,
              });
              columns.push({
                field: "impressions30D",
                headerName: "Last 30days",
                width: 100,
              });
            } else if (report === "Spend") {
              columns.push({
                field: "spend7D",
                headerName: "Last 7days",
                width: 100,
              });
              columns.push({
                field: "spend14D",
                headerName: "Last 14days",
                width: 100,
              });
              columns.push({
                field: "spend30D",
                headerName: "Last 30days",
                width: 100,
              });
            } else if (report === "Clicks") {
              columns.push({
                field: "clicks7D",
                headerName: "Last 7days",
                width: 100,
              });
              columns.push({
                field: "clicks14D",
                headerName: "Last 14days",
                width: 100,
              });
              columns.push({
                field: "clicks30D",
                headerName: "Last 30days",
                width: 100,
              });
            } else if (report === "ACOS") {
              columns.push({
                field: "acos7D",
                headerName: "Last 7days",
                width: 100,
                renderCell: (params) => (
                  <span style={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>{params.row.acos7D}%</span>
                ),
              });
              columns.push({
                field: "acos14D",
                headerName: "Last 14days",
                width: 100,
                renderCell: (params) => (
                  <span style={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>{params.row.acos14D}%</span>
                ),
              });
              columns.push({
                field: "acos30D",
                headerName: "Last 30days",
                width: 100,
                renderCell: (params) => (
                  <span style={{ fontFamily: "Roboto, Helvetica, Arial, sans-serif" }}>{params.row.acos30D}%</span>
                ),
              });
            } else if (report === "Orders") {
              columns.push({
                field: "orders7D",
                headerName: "Last 7days",
                width: 100,
              });
              columns.push({
                field: "orders14D",
                headerName: "Last 14days",
                width: 100,
              });
              columns.push({
                field: "orders30D",
                headerName: "Last 30days",
                width: 100,
              });
            }
          });
        }
        columns.push({
          field: "approvedOn",
          headerName: "Approved On",
          minWidth: 130,
          renderCell: (params) => {
            return (
              <>
                <div className="col-rulename">
                  <div className="col-title">{params.row.approvedOn}</div>
                </div>
              </>
            );
          },
        });

        columns.push({
          field: "rowAction",
          sortable: false,
          filterable: false,
          disableColumnMenu: true,
          headerName: "Action",
          width: 90,

          renderCell: (params) => (
            <div>
              <Tooltip placement="top" title="Approve">
                <img
                  className=" me-3"
                  src={
                    hoveredRowId === params.row.id ||
                    params.row.approvedOn !== null
                      ? approved
                      : approved1
                  }
                  height={25}
                  width={25}
                  onMouseEnter={() => setHoveredRowId(params.row.id)}
                  onMouseLeave={() => setHoveredRowId(null)}
                  alt=""
                  onClick={() => approve(params)}
                />
              </Tooltip>
              <Tooltip placement="top" title="Compare">
                <img
                  src={isHovered2 === params.row.id ? view : view1}
                  height={20}
                  onMouseEnter={() => setIsHovered2(params.row.id)}
                  onMouseLeave={() => setIsHovered2(null)}
                  width={20}
                  alt=""
                  onClick={() => {
                    viewData(params);
                  }}
                ></img>
              </Tooltip>
            </div>
          ),
        });
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

  const columnGroupingModel = [
    {
      groupId: "impressions",
      headerName: "Impressions",
      children: [
        { field: "impressions7D" },
        { field: "impressions14D" },
        { field: "impressions30D" },
      ],
    },
    {
      groupId: "spend",
      headerName: "Spend",
      children: [
        { field: "spend7D" },
        { field: "spend14D" },
        { field: "spend30D" },
      ],
    },
    {
      groupId: "clicks",
      headerName: "Clicks",
      children: [
        { field: "clicks7D" },
        { field: "clicks14D" },
        { field: "clicks30D" },
      ],
    },
    {
      groupId: "acos",
      headerName: "ACOS",
      children: [
        { field: "acos7D" },
        { field: "acos14D" },
        { field: "acos30D" },
      ],
    },
    {
      groupId: "orders",
      headerName: "Orders",
      children: [
        { field: "orders7D" },
        { field: "orders14D" },
        { field: "orders30D" },
      ],
    },
  ];

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

  const approve = (params) => {

    const data = [
      {
        prev: params.row.action.previousValue,
        now: params.row.action.currentValue,
      }
    ]
    if(params.row.action.currentValue.toLowerCase() === "enabled" || params.row.action.currentValue.toLowerCase() === "paused"){
      setCustomBidShow(false)
    }
    setSelectedBid(data)
    console.log(params);
    console.log(params.row.id);
    const id = params.row.id;
    setSingleApprove((prev: any) => ({
      ...prev,
      id: [id],
      customBid: params.row.customBid,
      description: params.row.description,
    }));
    setapprovePopup(true);
    if(params.row.approvedOn === null){
      setApprovedStatus(false)
    }else{
      setApprovedStatus(true)
    }
  };

  const viewData = (params) => {
    console.log(params.row.targetId);
    targetId = params.row.targetId;
    setviewDataPopup(true);
    setReportLoading(true);

    axios
      .get(
        `https://adsexpert-api.getgrowth.agency/Recommendation/ComparisonData?TargetId=${params.row.targetId}&Metrics=${params.row.metrics}&Daterange=Last7Days`
      )
      .then((res) => {
        const filteredData = res.data.result.comparissionData.filter(
          (item) => item !== null
        );
        setReportsRow(filteredData);
        setReportLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setReportLoading(false);
      });
  };

  const save = () => {
    setapprovePopup(false);
    setRowSelectionModel([]);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Recommendation/Approve";
    const data = {
      id: singleApprove.id,
      description: singleApprove.description,
      customBid: Number(singleApprove.customBid),
    };
    console.log(data);

    axios
      .post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      })
      .then((response) => {
        if (response.data.success) {
          toast("Approved successfully");
          Recommendation();
        } else {
          toast("Approved failed");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const noteChange = (event) => {
    console.log(event.target.value);
    setSingleApprove((prev) => ({
      ...prev,
      description: event.target.value,
    }));
  };

  const coustumBidChange = (event) => {
    console.log(event.target.value);
    setSingleApprove((prev) => ({
      ...prev,
      customBid: event.target.value,
    }));
  };

  const reports = [
    {
      field: "impressions",
      headerName: "Impression",
      width: 100,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "clicks",
      headerName: "Clicks",
      width: 100,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "orders",
      headerName: "Orders",
      width: 100,
      flex: 1,
      disableColumnMenu: true,
    },
    {
      field: "acos",
      headerName: "ACOS",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "spend",
      headerName: "Spend",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "roas",
      headerName: "ROAS",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "sales",
      headerName: "Sales",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "cr",
      headerName: "CR",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "costPerClick",
      headerName: "CPR",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
    {
      field: "clickThroughRate",
      headerName: "CTR",
      width: 100,
      disableColumnMenu: true,
      flex: 1,
    },
  ];

  const Values = ["Impression", "Clicks", "Orders", "ACOS", "Spend"];

  const handleCheckboxChange = (list: string, e) => {
    setSelectedCompareReport((prevSelectedCompareReport) => {
      // Add item if checked and not already in the list
      if (!prevSelectedCompareReport.includes(list)) {
        return [...prevSelectedCompareReport, list];
      } else {
        // Remove item if unchecked
        return prevSelectedCompareReport.filter((item) => item !== list);
      }
    });
  };

  const BulkApprove = () => {
    console.log(rowSelectionModel);
    setApprovedStatus(false)
    if (rowSelectionModel.length > 0) {
      setapprovePopup(true);
      setSingleApprove((prev: any) => ({
        ...prev,
        id: [...prev.id, ...rowSelectionModel],
      }));
    } else {
      toast("Please select minimum one checkbox");
    }
  };

  const deleteRule = () => {
    if (rowSelectionModel.length > 0) {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url =
        "https://adsexpert-api.getgrowth.agency/Recommendation/Remove";
      const data = {
        id: rowSelectionModel,
      };

      axios
        .post(url, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
        })
        .then((response) => {
          if (response.data.success) {
            toast("Rules removed successfully");
            setRowSelectionModel([]);
            Recommendation();
          } else {
            toast("Rules removed failed");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      toast("Please select minimum one checkbox");
    }
  };
  const cancel = () => {};

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
  setActivePage(1)
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
    if(filter.length > 0){
      setFilterShow(true)
    }
    else{
      setFilterShow(false)
    }
  }, [filter])

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
      field: data[0]?.name ? data[0]?.name : model[0].field,
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
          <div className="back-arrow-container d-flex align-items-center  ">
            <span className="title">Recommendation</span>
            <div className="custom-dropdown-container ms-3">
              <Badge count={rowSelectionModel.length} color="#fe9900">
                <div className="dropdownContent">
                  <p
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Bulk Operation
                    <i
                      className="fa fa-angle-down down-arrow-right"
                      aria-hidden="true"
                    ></i>
                    <i
                      className="fa fa-angle-up up-arrow-right"
                      aria-hidden="true"
                    ></i>
                  </p>
                  <ul
                    className="dropdown-menu shadow rounded"
                    aria-labelledby="dropdownMenuButton1"
                    style={{ minWidth: "130px" }}
                  >
                    <li onClick={BulkApprove}>Approve</li>

                    <Popconfirm
                      title="Delete"
                      description="Are you sure you want to delete rules?"
                      onConfirm={deleteRule}
                      onCancel={cancel}
                      okText="Yes"
                      cancelText="No"
                    >
                      <li>Delete</li>
                    </Popconfirm>
                  </ul>
                </div>
              </Badge>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="">
              <Dropdown className="ms-3">
                <Dropdown.Toggle className="dropdown-select mt-4">
                  Compare
                  <i
                    className="fa fa-angle-down down-arrow-right pe-3"
                    aria-hidden="true"
                  ></i>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: "150px" }} className="p-2">
                  {Values.map((list, i) => (
                    <Dropdown.Item
                      className="mb-2"
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCheckboxChange(list, e);
                      }}
                    >
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        checked={selectedCompareReport.includes(list)}
                      />{" "}
                      {list}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="filter-container ">
              <div className="filter-item  me-3 ms-3 filter-link-container dropdownContent">
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
          {approvePopup && (
            <div>
              <Modal
                show={approvePopup}
                onHide={() => setapprovePopup(false)}
                size="lg"
                aria-labelledby="example-modal-sizes-title-md"
              >
                <Modal.Header closeButton>
                  <Modal.Title
                    id="example-modal-sizes-title-md"
                    style={{ fontSize: "17px" }}
                  >
                    Approve
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    {rowSelectionModel.length === 0 && (
                      <div className="">
                       <div className=" text-center  mb-4 mt-2">
                     <span>  Previous Bid : <span className="fw-bold">$ {selectedBid[0].prev} </span > </span>  <span className="ms-3"> Current Bid : <span className="fw-bold"> $ {selectedBid[0].now}</span></span>
                     </div>
                     {customBidShow &&
                      <div className="bid d-flex mb-4 mt-2">
                        <Form.Label
                          className="me-3 align-content-center"
                          style={{ width: "100px" }}
                        >
                          Custom Bid :{" "}
                        </Form.Label>
                        <Form.Control
                          className="number w-75"
                          type="number"
                          value={singleApprove.customBid}
                          readOnly={approvedStatus === true}
                          onChange={coustumBidChange}
                        />
                      </div>
}
                      </div>
                    )}
                    <div className="bid d-flex mb-2">
                      <Form.Label
                        className=" me-3 align-content-center"
                        style={{ width: "100px" }}
                      >
                        Note :{" "}
                      </Form.Label>

                      <Form.Control
                        className="textarea w-75"
                        type="textarea"
                        style={{ height: "100px" }}
                        as="textarea"
                        placeholder="Description"
                        value={singleApprove.description}
                        readOnly={approvedStatus === true}
                        rows={5}
                        onChange={noteChange}
                      />
                    </div>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="btn btn-primary add-rules-btn pt-2"
                    style={{ height: "43px !important" }}
                    onClick={save}
                    disabled={approvedStatus === true}
                  >
                    Save
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
          {viewDataPopup && (
            <div>
              <Modal
                show={viewDataPopup}
                onHide={() => setviewDataPopup(false)}
                size="lg"
                aria-labelledby="example-modal-sizes-title-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title
                    id="example-modal-sizes-title-lg"
                    style={{ fontSize: "17px" }}
                  >
                    Reports
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    <Col md={4}>
                      {/* <Dropdown className="ms-3" style={{zIndex:"100" }}>
                                <Dropdown.Toggle className="dropdown-select mt-4 pt-2" style={{width:"225px"}}>
                                  Select
                                  <i
                                    className="fa fa-angle-down down-arrow-right pe-3"
                                    aria-hidden="true"
                                  ></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ width: "150px" }}>
                                  {reports.map((list, i) => (
                                    <Dropdown.Item
                                      key={i} 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectChange(list.field ,e);
                                      }}

                                      style={{textDecoration:"none"}}
                                    >
                                      <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        checked={selectedReport.includes(list.field)}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectChange(list.field ,e);
                                        }}
                                      />{" "}
                                      {list.headerName}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown> */}
                    </Col>
                  </Row>
                  <Row>
                    <div className="data mt-3">
                      <DataGrid
                        rows={reportsRow.map((row, index) => ({
                          id: index,
                          ...row,
                        }))}
                        columns={modalColoumns}
                        initialState={{
                          columns: {
                            columnVisibilityModel: {
                              roas: false,
                              sales: false,
                              cr: false,
                              costPerClick: false,
                              clickThroughRate: false,
                            },
                          },
                        }}
                        disableRowSelectionOnClick
                        loading={reportLoading}
                        style={{ height: "214px" }}
                        hideFooter
                      />
                    </div>
                  </Row>
                </Modal.Body>
              </Modal>
            </div>
          )}
        </div>
        {!apiLoading ? (
          <div>
                 {filterShow && 
             <div className="filter-box d-flex  align-items-center">
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
          <div style={{ height: "calc(85vh - 120px)", width: "100%" }}>
            <DataGrid
              className=""
              rows={rows}
              columns={columns}
              disableRowSelectionOnClick
              columnGroupingModel={columnGroupingModel}
              checkboxSelection={true}
              onRowSelectionModelChange={(newSelection) => {
                setRowSelectionModel(newSelection);
              }}
              hideFooter={true}
              rowHeight={70}
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

export default Recommendation;
