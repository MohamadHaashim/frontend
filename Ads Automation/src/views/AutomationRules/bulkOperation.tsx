import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import BackArrow from "../../assets/images/icons/back-arrow-icon.svg";
import { Button, Col, Modal, Row } from "react-bootstrap";

const BulkOperation: React.FunctionComponent = () => {
  const [rulesPopupOpen, setrulesPopupOpen] = useState(false);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
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
      ruleId: "55555",
      ruleName: "Demo Rule",
    },
    {
      ruleId: "6666",
      ruleName: "Test1",
    },
    {
      ruleId: "4444",
      ruleName: "Test2",
    },
    {
      ruleId: "2222",
      ruleName: "Test3",
    },
  ]);
  const columns = [
    {
      field: "campaignId",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "campaignName",
      headerName: "Campaign Name",
      flex: 1,
    },
    {
      field: "campaignBudget",
      headerName: "CampaignBudget",
      flex: 0.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
    },
    {
      field: "rules",
      flex: 1,
      headerName: "Rules",
      renderCell: (params) => {
        const ruleNames = params.value.map((rule) => rule.ruleName).join(", ");
        return <span>{ruleNames}</span>;
      },
    },
    // {
    //   field: "action",

    //   headerName: "Action",
    //   renderCell: (params) => {
    //     return <button className="primary me-3">Apply to</button>;
    //   },
    // },
  ];
  const sync = async () => {
    // setLoading(true)
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Rule/SyncCampigns";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({}),
     
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
         console.log(result);
      } else {
        // setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
     useEffect(() => {
      Campaigns()
     }, [])
  const Campaigns = async () => {
    // setLoading(true)
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =
      "https://adsexpert-api.getgrowth.agency/Rule/BulkOperation/Campaigns";
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId:"",
        pageNumber:1,
        pageSize:50,
        globalFilters:{
          searchText:"",
          advancedFilters:null
        }

      }),
     
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
         console.log(result);
      } else {
        // setLoading(false)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const rulesPopup = () => {
    setrulesPopupOpen(true);
  };

  const handleCheckboxToggle = (ruleId: string) => {
    if (selectedRules.includes(ruleId)) {
      setSelectedRules(selectedRules.filter((id) => id !== ruleId));
    } else {
      setSelectedRules([...selectedRules, ruleId]);
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
  const save = () => {
    setrulesPopupOpen(false)
    console.log(selectedRules);
  };
  const handleSelectionChange = (selection) => {
    // 'selection' contains the IDs of the selected rows
    // You can use these IDs to retrieve the corresponding row data
    // and then extract the order IDs
    // const selectedOrderIds = selection.map((selectedRowIndex) => rows[selectedRowIndex].campaignId);
  
    // Do something with the selected order IDs
    console.log("Selected Order IDs:", selection);
  };

  return (
    <DashboardLayout>
      <Row className="ms-2 me-3">
        <div className="main-cont-header ">
          <div className="title">
            <h3 className="page-title">Bulk Operation</h3>
          </div>
        </div>
        <div className="action-row d-flex justify-content-between ">
          <div className="back-arrow-container ">
            <Link to={"/ads/automation-rules"}>
              <i>
                <img src={BackArrow} alt="refresh icon" />
              </i>
              Back
            </Link>
          </div>
          <div>
            <button className="primary me-3" onClick={rulesPopup}>
              Apply to
            </button>

            <button className="primary me-3" onClick={sync}>Sync</button>
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
                        checked={selectAllChecked}
                        onChange={handleSelectAllToggle}
                      />
                      <h6>Select All</h6>
                    </div>
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
                  </div>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  className="btn btn-primary add-rules-btn pt-2"
                  style={{ height: "43px !important" }}
                  onClick={save}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
        <div className="table mt-3 ">
          <DataGrid
            rows={rows}
            columns={columns}
            hideFooter={true}
            checkboxSelection
            rowSelection
            onRowSelectionModelChange={handleSelectionChange}
          />
        </div>
      </Row>
    </DashboardLayout>
  );
};

export default BulkOperation;
