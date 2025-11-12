import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import "./index.css";

import LogoIcon from "../../assets/brand/logo-icon.svg";
import ActionDot from "../../assets/images/icons/more-action-icon.svg";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// let rows: any = [];
let columns: GridColDef[] = [];
let filterData: any = [];

function AutomationRulesListTable(props: any) {
  let apiEndPoint = "https://api.aimosa.io/Rule/All";
  let pageload = true;
  const [apiLoading, setApiLoading] = useState(false);
  const [rows, setIsRows] = useState<any>([]);
  const [tagInput, setTagInputValue] = useState("");
  const [clickedId, setClickedId] = useState("");
  const [rowSelectionModel, setRowSelectionModel] =
    React.useState<GridRowSelectionModel>([]);
  const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#001912",
      color: "rgba(255, 255, 255, 0.87)",
      maxWidth: 350,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #001912",
    },
  }));
  useEffect(() => {
    props.handleSelectedRules(rowSelectionModel);
  }, [rowSelectionModel]);
  useEffect(() => {
    if (pageload) {
      fetchData();
      pageload = false;
    }
  }, []);
  useEffect(() => {
    if (props.fetchRulesByStatus) {
      fetchData();
    }
  }, [props.fetchRulesByStatus]);
  useEffect(() => {
    if (props.pageReload) {
      fetchData();
    }
  }, [props.pageReload]);
  useEffect(() => {
    if (props.currPage || props.perPage) {
      fetchData();
    }
    if (props.filterData || props.searchKey) {
      fetchData();
    }
  }, [props.currPage, props.perPage, props.filterData, props.searchKey]);

  const tagInputValue = (e: any) => {
    setTagInputValue(e.target.value);
  };
  const clickedIdValue = (data: any) => {
    var idValue = data.id;
    setClickedId(idValue);
  };
  const removeClick = async (tag: any, id: any) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/" + id + "/Tag",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          tag: [tag],
        }),
      }
    );
    const responceData = await response.json();
    console.log("best=s", responceData);
    fetchData();
  };

  const patchTagData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/BookShelf/" + clickedId + "/Tag",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          tags: [tagInput],
        }),
      }
    );
    const responceData = await response;
    console.log("best=s", responceData);
    fetchData();
  };
  const deleteRule = async (id: any) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch("https://api.aimosa.io/Rule", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        id: [id],
      }),
    });
    const responceData = await response.json();
    // this.setState({ pageReload: true });
    // this.setState({ getSelectedRules: [] });
    console.log("deleteRule" + JSON.stringify(responceData));

    if (responceData.success == true) {
      toast("Successfully Deleted");
    } else {
      toast("unable to Deleted");
    }
    fetchData();
  };
  const Duplicaate = async (id: any) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch("https://api.aimosa.io/Rule/Duplicate/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({}),
    });
    const responceData = await response.json();
    // this.setState({ pageReload: true });
    // this.setState({ getSelectedRules: [] });
    // toast("Rule(s) deleted successfully");
    console.log("Duplicaate" + JSON.stringify(responceData));

    if (responceData.success == true) {
      toast("Successfully Duplicated");
    } else {
      toast("unable to Duplicate");
    }
    fetchData();
  };

  const statusHandler = (params: any) => {
    setIsRows((prevRows: any) =>
      prevRows.map((row: any) =>
        row.id === params.row.id
          ? { ...row, status: row.status === "Paused" ? "Enabled" : "Paused" }
          : row
      )
    );
    const switchHandler = async () => {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;

      const response = await fetch("https://api.aimosa.io/Rule/Status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          ruleId: [params.row.id],
          status: params.row.status === "Paused" ? "Enabled" : "Paused",
        }),
      });

      const responseData = await response.json();
      console.log("Duplicate" + JSON.stringify(responseData));

      if (responseData.success === true) {
        const toastMessage =
          params.row.status === "Paused"
            ? "Successfully Enabled"
            : "Successfully Paused";
        toast(toastMessage);
      } else {
        toast("Unable to Perform Action");
      }

      fetchData();
    };

    switchHandler();
  };
  const fetchData = async () => {
    if (!apiLoading) {
      setApiLoading(true);
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url = apiEndPoint;
      let advancedFilters: any = [];

      if (props.filterData && props.filterData.length > 0) {
        advancedFilters = props.filterData;
      }
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          pageNumber: props.currPage,
          pageSize: props.perPage,
          globalFilters: {
            searchText: props.searchKey,
            advancedFilters: [props.fetchRulesByStatus],
          },
        }),
        // body: JSON.stringify({
        //   pageNumber: props.currPage,
        //   pageSize: props.perPage,
        //   globalFilters: {
        //     searchText: props.searchKey,
        //     advancedFilters: props.fetchRulesByStatus || null,
        //   },
        // }),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        console.log("bookself=", responceData);

        let pageConfigDetails = {
          total: responceData.result.total,
          currPage: responceData.result.currPage,
          lastPage: responceData.result.lastPage,
          nextPage: responceData.result.nextPage,
          perPage: responceData.result.perPage,
          prevPage: responceData.result.prevPage,
          dropdownDatas: responceData.result.headers,
        };

        props.parentCallback(pageConfigDetails);
        console.log("Bookshelf API Response: ", responceData);
        if (columns.length < 1) {
          let headers = responceData.result.headers;
          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "status") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                width: 80,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckChecked"
                          onChange={() => statusHandler(params)}
                          checked={
                            params.row.status === "Enabled" ? true : false
                          }
                        />
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "ruleName") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 300,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.ruleName}</div>
                        <div className="market-place ">
                          <div>Marketplace: </div>
                          {params.row.marketPlaces.map((marketPlaces: any, i: any) => (
                            <HtmlTooltip
                              placement="bottom-start"
                              title={
                                <React.Fragment>
                                  <div>{marketPlaces}</div>
                                </React.Fragment>
                              }
                            >
                              <div
                                className={
                                  "flag-container flag-" + marketPlaces
                                }
                              ></div>
                            </HtmlTooltip>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "applyTo") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 180,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.applyTo.map((applyTo: any, i: any) => (
                          <div>{applyTo}</div>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "matchTypes") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 150,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.matchTypes.map((value: any, i: any) => (
                          <div>{value}</div>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "targetCriteria") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                width: 200,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.targetCriteria.map((value: any, i: any) => (
                          <div>{value}</div>
                        ))}
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "actionCriteria") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        {params.row.actionCriteria}
                      </div>
                    </>
                  );
                },
              });
            } else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 100,
              });
            }
          }
          columns.push({
            field: "rowAction",
            headerName: "",
            width: 50,
            renderCell: (params) => {
              return (
                <>
                  <div className="col-action-container text-right">
                    <div
                      id={"dropdownMenuButton" + params.row.id}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={ActionDot} alt="actions" />
                    </div>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby={"dropdownMenuButton" + params.row.id}
                    >
                      <li>
                        <Link
                          to={
                            "/ads/automation-rules/change-log/" + params.row.id
                          }
                        >
                          <p className="dropdown-item">Changelog</p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/ads/create-automation-rules/" + params.row.id}
                        >
                          <p className="dropdown-item">Edit</p>
                        </Link>
                      </li>
                      <li>
                        <p
                          className="dropdown-item"
                          onClick={(e) => Duplicaate(params.row.id)}
                        >
                          Duplicate
                        </p>
                      </li>
                      <li>
                        <p
                          className="dropdown-item text-red"
                          onClick={(e) => deleteRule(params.row.id)}
                        >
                          Delete
                        </p>
                      </li>
                    </ul>
                  </div>
                </>
              );
            },
          });
        }
        console.log("Columns header: ", columns);
        setIsRows(responceData.result.data);
        setApiLoading(false);
        console.log("Row data: ", rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const selectedRules = (e: any) => {
    console.log("select checkbox: ", e);
    let bulckOperationData = {
      type: "delete",
      data: rowSelectionModel,
    };
    console.log(bulckOperationData);
  };

  return (
    <div className="mt-4">
      <div style={{ height: 450, width: "100%" }}>
        {!apiLoading ? (
          <>
            <div
              className="modal fade"
              id="addTagModel"
              aria-hidden="true"
              aria-labelledby="exampleModalToggleLabel3"
            >
              <div className="modal-dialog ">
                <div className="modal-content addTagModel">
                  <Row className="addTagInputContainer">
                    <Col md={12}>
                      <input
                        type="text"
                        className="form-control"
                        onChange={tagInputValue}
                      />
                    </Col>
                    <div className="addTagbtnContainer">
                      <button
                        type="button"
                        className="addTagBtn btn btn-primary"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        // onClick={() => patchTagData(params.id)}
                        onClick={patchTagData}
                      >
                        Add
                      </button>
                    </div>
                  </Row>
                </div>
              </div>
            </div>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection={true}
              hideFooter={true}
              rowHeight={100}
              onRowSelectionModelChange={(newSelection) => {
                setRowSelectionModel(newSelection);
              }}
              disableRowSelectionOnClick
            />
          </>
        ) : (
          <div className="loading-container">
            <div className="loading-text">
              <span className="logicon">
                <img src={LogoIcon} alt="logo-small"></img>
              </span>
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
              <span>I</span>
              <span>N</span>
              <span>G</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AutomationRulesListTable;
