import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { CircularProgress, Pagination, Stack } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { Badge, Popconfirm, Tooltip } from "antd";

let columns: GridColDef[] = [];
interface ResultProps {
  searchResult: any;
}
const Campaign: React.FunctionComponent<ResultProps> = (props) => {
  let Type = "SP";

  const [rulesPopupOpen, setrulesPopupOpen] = useState(false);
  const [deleterulesPopupOpen, setdeleterulesPopupOpen] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [searchCampaignId, setSearchCampaignId] = useState("");
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiLoading2, setApiLoading2] = useState(false);
  const [deleteAllButtonShow, setDeleteAllButtonShow] = useState(false);
  const [selectedCampaignIDS , setSelectedCampaignIDS] = useState([])
  const [selectedCampaign, setSelectedCampain] = useState([
    {
      campaignId: "",
      campaignName: "",
    },
  ]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [deleteSelected, setDeleteSelected] = useState([
    {
      ruleId: "",
      ruleName: "",
    },
  ]);
  const [deletedRules, setDeletedRules] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState("");
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [selectMethod, setSelectMethod] = useState("");
  const [searchText, setSearchText] = useState("");
  const [campaignId, setCampaignId] = useState(0);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [sortModeldata, setSortModelData] = useState<any>([]);
  const [header, setHeader] = useState<any>([]);
  const [rows, setRows] = useState([
    {
      id: 1,
      campaignId: "67788",
      campaignName: "Gym",
      campaignBudget: "63",
      status: "Enable",
      rules: [
        {
          ruleId: "55555",
          ruleName: "Demo Rule",
        },
        {
          ruleId: "6666",
          ruleName: "Test",
        },
      ],
    },
    {
      id: 2,
      campaignId: "223344",
      campaignName: "Gym2",
      campaignBudget: "63",
      status: "Paused",
      rules: [
        {
          ruleId: "55555",
          ruleName: "Demo Rule",
        },
      ],
    },
  ]);
  const [rules, setRules] = useState([
    {
      ruleId: "",
      ruleName: "",
    },
  ]);

  useEffect(() => {
    console.log(props.searchResult);

    setProfileId(props.searchResult);
  }, [props.searchResult]);

  const sync = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
    `https://adsexpert-api.getgrowth.agency/Rule/SyncCampaigns?ProfileId=${props.searchResult}`;
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
     
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
        console.log(result);
        setApiLoading(false);
      } else {
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

  useEffect(() => {
    setApiLoading(true);
    if (props.searchResult !== "") {
      Campaigns();
    }
  }, [searchText, props.searchResult, selectedProfiles, perPage,sortModeldata,activePage]);

  const Campaigns = async () => {
    setApiLoading(true);

    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Rule/BulkOperation/Campaigns";

    if (selectedProfiles === "SP") {
      Type = "SP";
    } else if (selectedProfiles === "SB") {
      Type = "SB";
    } else if (selectedProfiles === "SD") {
      Type = "SD";
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
          type: Type,
          profileId: props.searchResult,
          sortOptions: [
            {
              columnName: sortModeldata[0].field,
              direction:
                sortModeldata[0].sort === "asc" ? "Ascending" : "Descending",
            },
          ],
          pageNumber: activePage,
          pageSize: perPage,
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
          type: Type,
          profileId: props.searchResult,
          pageNumber: activePage,
          pageSize: perPage,
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
        if (result === null) {
          setRows([]);
        } else {
          setRows(result.data);
        }

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
                flex: 1,
                minWidth: 150,
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
            } else if (headers[i]["keyName"] === "campaignBudget") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                
                minWidth: 150,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">
                          {params.row.campaignBudget}
                        </div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "status") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],    
                minWidth: 130,
                renderCell: (params) => {
                  return (
                    <>
                      <div className="col-rulename">
                        <div className="col-title">{params.row.status}</div>
                      </div>
                    </>
                  );
                },
              });
            } else if (headers[i]["keyName"] === "rules") {
              columns.push({
                field: headers[i]["keyName"],
                headerName: headers[i]["displayName"],
                flex: 1,
                minWidth: 200,
                renderCell: (params) => {
                  const ruleNames = params.value
                    .map((rule) => rule.ruleName)
                    .join(", ");
                  return (
                    <span >
                      {ruleNames ? ruleNames : ""}
                    </span>
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
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            headerName: "Action",
            minWidth: 130,
            renderCell: (params) => {
              return (
                <>
                  <div className="d-flex h-100">
                    <Tooltip placement="top" title="Add Rules">
                      <button
                        className="primary ms-2 me-3 d-flex justify-content-center align-items-center"
                        onClick={() => {
                          rulesPopup(params, "Update");
                        }}
                      >
                        +
                      </button>
                    </Tooltip>
                    <Tooltip placement="top" title="Delete Rules">
                      <button
                        className="primary me-3 d-flex justify-content-center align-items-center"
                        onClick={() => {
                          rulesPopup(params, "Delete");
                        }}
                      >
                        -
                      </button>
                    </Tooltip>
                  </div>
                </>
              );
            },
          });
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

  const handleSelectAllToggle = () => {
    if (selectAllChecked) {
      setSelectedRules([]);
    } else {
      const allRuleIds = rules.map((rule) => rule.ruleId);
      setSelectedRules(allRuleIds);
    }
    setSelectAllChecked(!selectAllChecked);
  };

  const handleCheckboxToggle = (ruleId: string) => {
    if (selectedRules.includes(ruleId)) {
      console.log("kkk");

      const updatedRules = selectedRules.filter((id) => id !== ruleId);
      console.log(updatedRules);
      const deletedRules = selectedRules.filter((id) => id === ruleId);
      setDeletedRules(deletedRules);

      setSelectedRules(updatedRules);
    } else {
      console.log("jjj");
      // If the rule is not selected, add it to selectedRules
      setSelectedRules([...selectedRules, ruleId]);
    }
  };

  const rulesPopup = (params, value) => {
    if (value === "Delete") {
      setdeleterulesPopupOpen(true);
    } else {
      setrulesPopupOpen(true);
    }

    setSelectMethod(value);

    const campaign = [params.row];
    const campaigns = campaign.map((campaign) => ({
      campaignId: campaign.campaignId,
      campaignName: campaign.campaignName,
    }));
    setSelectedCampain(campaigns);
    setSelectedRules(params.row.rules);
    setSearchCampaignId(params.row.campaignId);
    setApiLoading2(true);

    axios
      .post(
        `https://adsexpert-api.getgrowth.agency/Rule/RuleName?CampaignId=${params.row.campaignId}&ProfileId=${props.searchResult}`
      )
      .then((res) => {
        setApiLoading2(false);
        if (res.data.result === null) {
          setRules([]);
        } else {
          setRules(res.data.result);
        }
        console.log(res.data.result);

        const trueValue = res.data.result;
        const selectedRuleIds = trueValue
          .filter((item) => item.isSelected === true)
          .map((item) => item.ruleId);
        setSelectedRules(selectedRuleIds);

        const selectedRule = trueValue
          .filter((item) => item.isSelected === true)
          .map((item) => ({ ruleId: item.ruleId, ruleName: item.ruleName }));

        setDeleteSelected(selectedRule);
        console.log(selectedRuleIds);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const rulesPopupApplayTo = (value) => {
    console.log(value);
    if (selectedCampaignIDS.length < 2) {
      toast("Please select minimum of two check box");
    } else {
      if (value === "DeleteAll") {
        setDeleteAllButtonShow(true);
      }
   
      setrulesPopupOpen(true);
      setSelectMethod(value);
      setApiLoading2(true);
      axios
        .post(
          `https://adsexpert-api.getgrowth.agency/Rule/RuleName?ProfileId=${props.searchResult}`
        )
        .then((res) => {
          setApiLoading2(false);
        
          if (res.data.result === null) {
            setRules([]);
          } else {
            setRules(res.data.result);
          }

          const trueValue = res.data.result;
          const selectedRuleIds = trueValue
            .filter((item) => item.isSelected === true)
            .map((item) => item.ruleId);
          setSelectedRules(selectedRuleIds);

          console.log(selectedRuleIds);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleKeyDown2 = (event: any) => {
    if (event.key === "Enter") {
      setActivePage(1);
      setSearchText(event.target.value);
      event.preventDefault();
    }
  };

  const save = () => {
    setApiLoading(true);
    setSelectedCampaignIDS([])
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Rule/BulkOperation/Campaigns";

    if (selectMethod === "Delete") {
      console.log(selectedCampaign);
      setrulesPopupOpen(false);
      setdeleterulesPopupOpen(false);

      const updateData = {
        profileId: props.searchResult,
        campaigns: selectedCampaign,
        ruleId: deletedRules,
      };
      console.log("delete", updateData);

      axios
        .delete(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          data: updateData,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success === true) {
            toast("Rules deleted successfully");

            Campaigns();
          } else {
            toast("Rules updated failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else if (selectMethod === "DeleteAll") {
      console.log(selectedCampaign);
      setrulesPopupOpen(false);
      setdeleterulesPopupOpen(false);
      setDeleteAllButtonShow(false);

      const updateData = {
        profileId: props.searchResult,
        campaigns: selectedCampaign,
        ruleId: selectedRules,
      };
      console.log("delete", updateData);

      axios
        .delete(url, {
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          data: updateData,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success === true) {
            toast("Rules deleted successfully");
            Campaigns();
          } else {
            toast("Rules updated failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      console.log(selectedCampaign);
      setrulesPopupOpen(false);
      setdeleterulesPopupOpen(false);
      const updateData = {
        profileId: props.searchResult,
        campaigns: selectedCampaign,
        ruleId: selectedRules,
      };
      console.log("update", updateData);

      axios
        .put(url, updateData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
        })
        .then((res) => {
          if (res.data.success === true) {
            toast("Rules updated successfully");
            Campaigns();
          } else {
            toast("Rules updated failed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  const cancel = () => {
    // setrulesPopupOpen(false);
  };

  const handleSelectionChange = (selection) => {
    console.log(selection);
    setSelectedCampaignIDS(selection)

    const selectedRowsData = selection
      .map((selectedId) => {
        const selectedRow = rows.find((row) => row.id === selectedId);
        if (selectedRow) {
          return {
            campaignId: selectedRow.campaignId,
            campaignName: selectedRow.campaignName,
          };
        }
        return null;
      })
      .filter(Boolean);
      
    setSelectedCampain(selectedRowsData);
  };

  const handleKeyDown = (event: any) => {
    console.log(event);

    if (event.key === "Enter") {
      const value = event.target.value;
      event.preventDefault();
      setApiLoading2(true);
      if (searchCampaignId === "") {
        axios
          .post(
            `https://adsexpert-api.getgrowth.agency/Rule/RuleName?ProfileId=${props.searchResult}&SearchText=${value}`
          )
          .then((res) => {
            setApiLoading2(false);
            setRules(res.data.result);
            const trueValue = res.data.result;
            const selectedRuleIds = trueValue
              .filter((item) => item.isSelected === true)
              .map((item) => item.ruleId);
            setSelectedRules(selectedRuleIds);
            console.log(selectedRuleIds);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        axios
          .post(
            `https://adsexpert-api.getgrowth.agency/Rule/RuleName?CampaignId=${searchCampaignId}&ProfileId=${props.searchResult}&SearchText=${value}`
          )
          .then((res) => {
            setApiLoading2(false);
            setRules(res.data.result);
            const trueValue = res.data.result;
            const selectedRuleIds = trueValue
              .filter((item) => item.isSelected === true)
              .map((item) => item.ruleId);
            setSelectedRules(selectedRuleIds);
            console.log(selectedRuleIds);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    }
  };
  const handleProfileChange = (e) => {
    setSelectedProfiles(e.target.value);
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
      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 ">
          <div className="back-arrow-container d-flex align-items-center   ">
            <span className="title">Campaigns</span>
            <div className="custom-dropdown-container ms-3">
            <Badge
                    count={selectedCampaignIDS.length}
                      color="#fe9900" 
                  >
           
              <div className="dropdownContent">
                <p
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                       style={{ height: "38.6px"}}
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
                  <li
                    onClick={() => {
                      rulesPopupApplayTo("DeleteAll");
                    }}
                  >
                    Delete Rules
                  </li>
                  <li
                    onClick={() => {
                      rulesPopupApplayTo("Update");
                    }}
                  >
                    Add Rules
                  </li>
                </ul>
              </div>
              </Badge>
            </div>
            <div className="accounts ">
              <select
                className="form-select"
                name="accountSelect"
                id="accountSelect"
                style={{ height: "38.6px" ,paddingBottom:"10px"}}
                value={selectedProfiles}
                onChange={handleProfileChange}
              >
                <option value="SP">Sponsored Product</option>
                <option value="SB">Sponsored Brand</option>
                <option value="SD">Sponsored Display</option>
              </select>
            </div>
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
                  onKeyDown={handleKeyDown2}
                />
              </div>
            </form>
            <button className="primary me-3" onClick={sync}>
              Sync
            </button>
          </div>
        </div>
        {rulesPopupOpen && (
          <div>
            <Modal
              show={rulesPopupOpen}
              onHide={() => setrulesPopupOpen(false)}
              size="lg"
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="example-modal-sizes-title-lg"
                  style={{ fontSize: "17px" }}
                >
                  Rules
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col></Col>
                  <Col>
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
                  </Col>
                </Row>

                <Row>
                  <div>
                    <div className="selectAll d-flex alignitems-center mb-2">
                      <input
                        type="checkbox"
                        style={{ height: "15px", width: "15px" }}
                        className="me-2 mt-1"
                        checked={selectedRules.length === rules.length}
                        onChange={handleSelectAllToggle}
                      />
                      <h6>Select All</h6>
                    </div>
                    {!apiLoading2 ? (
                      <div>
                        {rules.map((rule) => (
                          <div
                            key={rule.ruleId}
                            className="rules-select d-flex mb-2"
                          >
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={selectedRules.includes(rule.ruleId)}
                              onChange={() => handleCheckboxToggle(rule.ruleId)}
                            />
                            <div>{rule.ruleName}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="loading-container">
                        <div
                          style={{
                            marginBottom: "100px",
                            marginTop: "100px",
                          }}
                        >
                          <CircularProgress
                            className="loading"
                            style={{ margin: "auto" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                {deleteAllButtonShow ? (
                  <Popconfirm
                    title="Delete"
                    description="Are you sure you want to delete rules?"
                    onConfirm={save}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      className="btn btn-primary add-rules-btn pt-2"
                      style={{ height: "43px !important" }}
                      // onClick={save}
                    >
                      Save
                    </Button>
                  </Popconfirm>
                ) : (
                  <Button
                    className="btn btn-primary add-rules-btn pt-2"
                    style={{ height: "43px !important" }}
                    onClick={save}
                  >
                    Save
                  </Button>
                )}
              </Modal.Footer>
            </Modal>
          </div>
        )}
        {deleterulesPopupOpen && (
          <div>
            <Modal
              show={deleterulesPopupOpen}
              onHide={() => setdeleterulesPopupOpen(false)}
              size="lg"
              aria-labelledby="example-modal-sizes-title-lg"
            >
              <Modal.Header closeButton>
                <Modal.Title
                  id="example-modal-sizes-title-lg"
                  style={{ fontSize: "17px" }}
                >
                  Rules
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col></Col>
                  <Col>
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
                  </Col>
                </Row>
                <Row>
                  <div>
                    <div className="selectAll d-flex alignitems-center mb-2">
                      <input
                        type="checkbox"
                        style={{ height: "15px", width: "15px" }}
                        className="me-2 mt-1"
                        checked={selectedRules.length === rules.length}
                        onChange={handleSelectAllToggle}
                      />
                      <h6>Select All</h6>
                    </div>
                    {!apiLoading2 ? (
                      <div>
                        {deleteSelected.map((rule) => (
                          <div
                            key={rule.ruleId}
                            className="rules-select d-flex mb-2"
                          >
                            <input
                              type="checkbox"
                              className="me-2"
                              checked={selectedRules.includes(rule.ruleId)}
                              onChange={() => handleCheckboxToggle(rule.ruleId)}
                            />
                            <div>{rule.ruleName}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="loading-container">
                        <div
                          style={{
                            marginBottom: "100px",
                            marginTop: "100px",
                          }}
                        >
                          <CircularProgress
                            className="loading"
                            style={{ margin: "auto" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Popconfirm
                  title="Delete"
                  description="Are you sure you want to delete rules?"
                  onConfirm={save}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button
                    className="btn btn-primary add-rules-btn pt-2"
                    style={{ height: "43px !important" }}
                    // onClick={save}
                  >
                    Save
                  </Button>
                </Popconfirm>
              </Modal.Footer>
            </Modal>
          </div>
        )}
        {!apiLoading ? (
          <div>
            <DataGrid
              className="mt-3 "
              rows={rows.map((row, index) => ({ ...row, id: index }))}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter={true}
              loading={apiLoading}
              style={{ height: "calc(85vh - 120px)", width: "100%" }}
              checkboxSelection
              rowSelection
              sortModel={sortModel}
                  sortingMode="server"
                  onSortModelChange={handleSortModelChange}
              rowHeight={40}
              onRowSelectionModelChange={(row) => handleSelectionChange(row)}
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

export default Campaign;
