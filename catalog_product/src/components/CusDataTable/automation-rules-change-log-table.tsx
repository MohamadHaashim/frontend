import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import "./index.css";

import LogoIcon from "../../assets/brand/logo-icon.svg";
import ActionDot from "../../assets/images/icons/undo-green-icon.svg";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

let rows: any = [];
let columns: GridColDef[] = [];
let filterData: any = [];

function AutomationRulesChangeLogTable(props: any) {
  let { id } = useParams();
  let apiEndPoint = "https://api.aimosa.io/Rule/ChangeLog";
  let pageload = true;
  const [apiLoading, setApiLoading] = useState(false);
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
    if (pageload) {
      fetchData();
      pageload = false;
    }
  }, []);
  useEffect(() => {
    if (props.currPage || props.perPage || props.searchKey) {
      fetchData();
    }
  }, [props.currPage, props.perPage, props.searchKey]);
  const changelogclick = async (id: any) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch("https://api.aimosa.io/Rule/ChangeLogUndo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        id: id,
      }),
    });
    const responceData = await response;
    console.log("best=s", responceData);
    if (responceData.status == 200) {
      toast("Successfully Undo");
      undoChangeLog();
      fetchData();
    } else {
      toast("Unable to Undo");
    }
  };

  const undoChangeLog = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/AdsAutomation/ProcessAdsQueue",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      }
    );
    const responceData = await response;
    console.log("beghyd", responceData);
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
          id: id,
          pageNumber: props.currPage,
          pageSize: props.perPage,
          globalFilters: {
            searchText: props.searchKey,
          },
        }),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responceData = await response.json();
        console.log("bookself=", responceData);
        if (responceData.result.length < 1) {
          setApiLoading(false);
        }

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
        if (columns.length < 1) {
          let headers = responceData.result.headers;
          for (let i = 0; headers.length > i; i++) {
            if (headers[i]["keyName"] === "time") {
              let disname = headers[i]["displayName"];
              disname = disname.split("(");
              columns.push({
                field: headers[i]["keyName"],
                renderHeader: (params) => (
                  <div className="title-group">
                    {disname[0]}
                    <span>({disname[1]}</span>
                  </div>
                ),
                minWidth: 300,
              });
            } else if (headers[i]["keyName"] === "action") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 200,
                renderCell: (params) => {
                  return (
                    <>
                      {params.row.action && (
                        <div className="col-rulename">
                          <div>
                            <div className="changed-value">
                              {params.row.action.changedValue}
                            </div>
                            <div className="history-value">
                              Prev:{params.row.action.previousValue}.Now:
                              {params.row.action.currentValue}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                },
              });
            } else {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                minWidth: 320,
              });
            }
          }
          columns.push({
            field: "rowAction",
            headerName: "Undo",
            minWidth: 100,
            renderCell: (params) => {
              return (
                <>
                  <div className="col-action-container text-right">
                    <div
                      id={"undo" + params.row.id}
                      className="undo-action-icon"
                      onClick={(e) => changelogclick(params.row.id)}
                    >
                      <img src={ActionDot} alt="actions" /> Undo
                    </div>
                  </div>
                </>
              );
            },
          });
        }
        console.log("Columns header: ", columns);
        rows = responceData.result.data;
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
      <div
        style={{ height: 450, width: "100%" }}
        className="change-log-table-container"
      >
        {!apiLoading ? (
          <>
            <DataGrid
              rows={rows}
              columns={columns}
              checkboxSelection={false}
              hideFooter={true}
              rowHeight={50}
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
export default AutomationRulesChangeLogTable;
