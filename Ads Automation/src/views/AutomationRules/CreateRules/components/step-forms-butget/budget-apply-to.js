/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Pagination, Modal, Form } from "react-bootstrap";

import LogoIcon from "../../../../../assets/brand/logo-icon.svg";
import DuplicateIcon from "../../../../../assets/images/icons/duplicate-icon.svg";
import RemoveIcon from "../../../../../assets/images/icons/trash-icon.svg";

import Select, { components } from "react-select";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { Badge } from "antd";

const InputOption = ({
  getStyles,
  Icon,
  isDisabled,
  isFocused,
  isSelected,
  children,
  innerProps,
  ...rest
}) => {
  const [isActive, setIsActive] = useState(false);
  const onMouseDown = () => setIsActive(true);
  const onMouseUp = () => setIsActive(false);
  const onMouseLeave = () => setIsActive(false);

  // styles
  let bg = "transparent";
  if (isFocused) bg = "#eee";
  if (isActive) bg = "#B2D4FF";

  const style = {
    alignItems: "center",
    backgroundColor: bg,
    color: "inherit",
    display: "flex ",
  };

  // prop assignment
  const props = {
    ...innerProps,
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    style,
  };

  return (
    <components.Option
      {...rest}
      isDisabled={isDisabled}
      isFocused={isFocused}
      isSelected={isSelected}
      getStyles={getStyles}
      innerProps={props}
    >
      <input type="checkbox" defaultChecked={isSelected} />
      {children}
    </components.Option>
  );
};
function AddRulesBugetApplyTo(props) {
  const [ruleDataLoading, setRuleDataLoading] = useState(false);
  const [metaDataLoading, setMetaDataLoading] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [selectedInput, setSelectedInput] = useState("");
  const [selectedCampignShow, setSelectedCampaignShow] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState();
  const [newSelectedOptions, setNewSelectedOptions] = useState([]);
  const [campaignData, setCampaignData] = useState([]);

  const [metaData, setMetaData] = useState([]);
  const [rulesMetaData, setRulesMetaData] = useState({});
  const [actionCriteriaDetails, setActionCriteriaDetails] = useState([]);
  const [actionUpToCriteriaDetails, setActionUpToCriteriaDetails] = useState(
    []
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [show, setShow] = useState(false);
  const [applyTo, setApplyTo] = useState([]);
  const [marketPlaces, setMarketPlaces] = useState([]);
  const [marketPlacesDropdown, setMarketPlacesDropdown] = useState([]);
  const [matchTypes, setMatchTypes] = useState([]);
  const [matchTypesSelected, setMatchTypesSelected] = useState({
    autoCampaign: [],
    manualCampaign: { keywordMatch: [], productMatch: [] },
  });
  const [reportDuriationDetails, setReportDuriationDetails] = useState([]);
  const [targetCriteriaDetails, setTargetCriteriaDetails] = useState([]);
  const [pageData, setPageData] = useState([]);

  const [formValues, setFormValues] = useState([
    { conditionFilter: "", conditionName: "", conditionValue: "" },
  ]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [selectedCampaigns2, setSelectedCampaigns2] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [ruleId, setRuleId] = useState("");
  const [importOption, setImportOption] = useState("Add");

  const handleChangeInput = (e) => {
    if (e.key === "Enter") {
      setSelectedInput(e.target.value);
    }
  };

  const handleCheckboxChange = (clickedCampaign) => {

    if (clickedCampaign === "selectAll") {
      
      const newSelectAllChecked = !selectAllChecked;
      console.log("selectAllIf", newSelectAllChecked);
      setSelectAllChecked(newSelectAllChecked);
      
      if (newSelectAllChecked) {
        console.log("selectAll");
        setSelectedCampaigns(campaignData);
      } else {
        console.log("selectAllDelete");
       
        setSelectedCampaigns([]);
        wizardDataUpdate("empty");
        
        
      }
    }else {
      const isSelected = selectedCampaigns.some(
        (selectedCampaign) =>
          selectedCampaign.campaignName === clickedCampaign.campaignName
      );

      if (isSelected) {
        console.log("l", isSelected);
        const updatedSelectedCampaigns = selectedCampaigns.filter(
          (selectedCampaign) =>
            selectedCampaign.campaignName !== clickedCampaign.campaignName
        );
        console.log("ll", updatedSelectedCampaigns);
        setSelectedCampaigns(updatedSelectedCampaigns);
        wizardDataUpdate();
      } else {
        console.log("k", isSelected);
        const updatedSelectedCampaigns = [
          ...selectedCampaigns,
          clickedCampaign,
        ];
        setSelectedCampaigns(updatedSelectedCampaigns);
        wizardDataUpdate();
      }
    }
  };

  const handleDelete = (campaign) => {
    setSelectedCampaigns2((prevSelected) =>
      prevSelected.filter((c) => c.campaignId !== campaign.campaignId)
    );
  };

  useEffect(() => {
    console.log(props);
    if (props.rulesMetaData) {
      let applyToDetails = props.rulesMetaData.applyToDetails;
      if (applyToDetails !== undefined) {
        if (props.wizardData.id !== 0) {
          setRuleId(props.wizardData.id);
        }
        setRulesMetaData(props.rulesMetaData);
        setActionCriteriaDetails(props.rulesMetaData.actionCriteriaDetails);
        setActionUpToCriteriaDetails(
          props.rulesMetaData.actionUpToCriteriaDetails
        );
        setApplyTo(applyToDetails.applyTo);
        setMarketPlaces(applyToDetails.marketPlaces);
        let marketplaceList = applyToDetails.marketPlaces;
        let newMarketplaceList = [];
        if (marketplaceList && marketplaceList.length > 0) {
          for (let i = 0; i < marketplaceList.length; i++) {
            let obj = {
              value: marketplaceList[i].country,
              label: marketplaceList[i].country,
            };
            newMarketplaceList.push(obj);
          }
        }
        setReportDuriationDetails(props.rulesMetaData.reportDurationDetails);
        setTargetCriteriaDetails(props.rulesMetaData.targetCriteriaDetails);
        setRuleDataLoading(false);
      }
    }
    setMetaData(props.metaData);
  }, [props.rulesMetaData, rulesMetaData, props.metaData, metaData]);

  useEffect(() => {
    if (props.metaData && props.rulesMetaData.applyToDetails) {
      if (props.metaData.text) {
        buildApplyToDropdownData(
          props.rulesMetaData.applyToDetails.applyTo,
          props.metaData
        );
        setMetaDataLoading(false);
      }
    }
  }, [props.rulesMetaData, props.metaData]);

  useEffect(() => {
    console.log(props.selectedAccount);
    if (ruleId !== "") {
      setLoading(true);
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const formData = new FormData();

      if (selectedFile !== null) {
        formData.append("file", selectedFile);
      } else {
        formData.append("file", "");
      }
      if (ruleId !== undefined) {
        formData.append("RuleId", ruleId);
      } else {
        formData.append("RuleId", "");
      }
      if (importOption === "Add") {
        formData.append("Assign", true);
      } else {
        formData.append("Assign", false);
      }
      formData.append("SearchText", selectedInput);
      formData.append("ProfileId", String(props.selectedAccount));

      let url =
        "https://adsexpert-api.getgrowth.agency/Rule/CampaignName";
      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: AuthToken,
        },
        body: formData,
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((responceData) => {
          if (responceData.success) {
            let result = responceData.result;
            console.log(props);
            if (selectedFile !== null) {
              const selectedCampaign = result.filter(
                (campaign) => campaign.isSelected
              );
              if(selectedCampaign && selectedCampaign.length === 0){
                setSelectedCampaigns(selectedCampaign);
                wizardDataUpdate("empty");
              }
              setSelectedCampaigns(selectedCampaign);
            }

            setCampaignData(result);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedInput, ruleId, selectedFile]);

  useEffect(() => {
    console.log(
      "Applyto page Data: ",
      props.wizardData.applyToWizard?.campaigns
    );

    if (
      props.wizardData.applyToWizard &&
      Array.isArray(props.wizardData.applyToWizard)
    ) {
      const selected = props.wizardData.applyToWizard.map((campaign) => ({
        campaignId: campaign.campaignId,
        campaignName: campaign.campaignName,
      }));
      setSelectedCampaigns(selected);
    } else if (props.wizardData.applyToWizard?.campaigns) {
      const selected = props.wizardData.applyToWizard?.campaigns.map(
        (campaign) => ({
          campaignId: campaign.campaignId,
          campaignName: campaign.campaignName,
        })
      );
      setSelectedCampaigns(selected);
    }
  }, []);

  useEffect(() => {
    if (selectedCampaigns && selectedCampaigns.length > 0) {
        wizardDataUpdate();
    }
 
  }, [selectedCampaigns]);

  function wizardDataUpdate(params) {
    if(params === "empty"){
      let applyTo = {};
      applyTo = {
        file: null,
        campaigns: [],
      };
      let formData = {
        type: "applyTo",
        applyTo: applyTo,
      };
  
      props.parentCallback(formData);
      props.wizardDataCallback(formData);

    }
    else{
      console.log(selectedCampaigns);
      const campaigns = selectedCampaigns.map((campaign) => ({
        campaignId: String(campaign.campaignId),
        campaignName: campaign.campaignName,
      }));
      console.log("sdfsd", campaigns);
  
      let applyTo = {};
      applyTo = {
        file: null,
        campaigns: campaigns,
      };
      let formData = {
        type: "applyTo",
        applyTo: applyTo,
      };
  
      props.parentCallback(formData);
      props.wizardDataCallback(formData);
    }
 
  }

  function buildApplyToDropdownData(listData, metaDataList) {
    let result = metaDataList;
    if (listData && result) {
      for (let i = 0; i < listData.length; i++) {
        listData[i]["id"] = i + 1;
        listData[i]["selected"] = false;
        let slectedConditionType = listData[i]["filterConditionType"];
        let conditionTypeList = result[slectedConditionType];
        listData[i]["conditionTypes"] = conditionTypeList;
      }
      setApplyTo(listData);
    }
  }

  const add = () => {
    setSelectedCampaigns2(selectedCampaigns);
    setSelectedCampaignShow(true);
  };

  const sync = async () => {
    setLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = `https://adsexpert-api.getgrowth.agency/Rule/SyncCampaigns?ProfileId=${props.selectedAccount}`;
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
        setLoading(false);
        console.log(result);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShow(false)
   
  };
  const handleShow = () => setShow(true);

  const handleFileChange = (event) => {
    setImportFile(event.target.files[0]);
  };

  const handleImport = () => {
    if (importFile) {
      setSelectedFile(importFile);
    }
    handleClose();
  };

  const handleradiochange = (e) => {
    console.log(e.target.value);
    setImportOption(e.target.value);
  };

  const handleCloseAndSetImportOption = () => {
    handleClose();
    setImportOption("Add");
};
  return (
    <>
      <div className="wizard-step">
        {!metaDataLoading && !ruleDataLoading ? (
          <>
            <Row>
              <Col md={5}>
                <div className="header-search d-flex">
                  <button type="form-control">
                    <i className="fa fa-search"></i>
                  </button>
                  <input
                    type="text"
                    placeholder=""
                    className="form-control"
                    id="applay-search"
                    style={{ color: "black!important ", border: "none" }}
                    onKeyDown={handleChangeInput}
                  />
                </div>
              </Col>
              <Col className="text-end">
                <button className="add me-2" onClick={sync}>
                  Sync
                </button>
                <button className="add me-2" onClick={handleShow}>
                  Import
                </button>
                <button className="add" onClick={add}>
                  Add
                </button>
              </Col>
              <Modal show={show} onHide={handleCloseAndSetImportOption}>
                <Modal.Header closeButton>
                  <Modal.Title>Import File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {ruleId !== undefined &&
                  <div className="d-flex mb-3 justify-content-center">
                    <Form.Check
                      type="radio"
                      label="Add Campaigns"
                      className="user-select-none me-3"
                      id="radio-add-campaigns"
                      name="campaignOptions"
                      defaultChecked={true}
                      value={"Add"}
                      onChange={handleradiochange}
                    />
                    <Form.Check
                      type="radio"
                      label="Remove Campaigns"
                      className="user-select-none"
                      id="radio-remove-campaigns"
                      name="campaignOptions"
                      value={"Remove"}
                      onChange={handleradiochange}
                    />
                  </div>}
                  <Form.Control
                    type="file"
                    className="file"
                    onChange={handleFileChange}
                  />
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    className="btn btn-primary add-rules-btn pt-2"
                    style={{ height: "43px !important" }}
                    onClick={handleImport}
                  >
                    Import
                  </Button>
                </Modal.Footer>
              </Modal>
            </Row>
            {!ruleDataLoading && (
              <div className="card mt-2 ">
                <Row className="Campaign-list mb-2" style={{ height: "400px" }}>
                  {/* <div className="d-flex mb-2">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={selectedCampaigns.length === campaignData.length}
                      onChange={() => handleCheckboxChange("selectAll")}
                    />
                    <Badge
                      count={selectedCampaigns.length}
                      color="#fe9900"
                      offset={[10, 0]}
                      overflowCount={9999999}
                    >
                      {" "}
                      <h5>Select All</h5>
                    </Badge>
                  </div> */}
                  {!Loading ? (
                    <div
                      className=" mb-3"
                      style={{ height: "350px", overflowY: "auto" }}
                    >
                      {campaignData !== null ? (
                        <Row className="mb-3">
                          <Col>
                            {campaignData
                              .filter((_, index) => index % 2 === 0)
                              .map((campaign, index) => (
                                <div key={index} className="d-flex mb-2">
                                  <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    checked={selectedCampaigns.some(
                                      (selectedCampaign) =>
                                        selectedCampaign.campaignName ===
                                        campaign.campaignName
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(campaign)
                                    }
                                  />
                                  <div>{campaign.campaignName}</div>
                                </div>
                              ))}
                          </Col>
                          <Col>
                            {campaignData
                              .filter((_, index) => index % 2 !== 0)
                              .map((campaign, index) => (
                                <div key={index} className="d-flex mb-2">
                                  <input
                                    className="form-check-input me-2"
                                    type="checkbox"
                                    checked={selectedCampaigns.some(
                                      (selectedCampaign) =>
                                        selectedCampaign.campaignName ===
                                        campaign.campaignName
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(campaign)
                                    }
                                  />
                                  <div>{campaign.campaignName}</div>
                                </div>
                              ))}
                          </Col>
                        </Row>
                      ) : (
                        <Row className="text-center mt-5">
                          <div className="mt-5 pt-5">
                            No campaigns available.
                          </div>
                        </Row>
                      )}
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
                        <CircularProgress
                          className="loading"
                          style={{ margin: "auto" }}
                        />
                      </div>
                    </div>
                  )}
                </Row>
                <Row className="Campaign-list">
                  <div
                    className="gray-box"
                    style={{ height: "400px", overflowY: "auto" }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <h5>Selected Campaigns</h5>
                    </div>
                    {selectedCampignShow &&
                      selectedCampaigns2.map((selectedCampaign, index) => (
                        <div
                          key={index}
                          className="d-flex justify-content-between mb-2"
                        >
                          <div>{selectedCampaign.campaignName}</div>
                          <div>
                            <a
                              style={{ textDecoration: "underline" }}
                              onClick={() => handleDelete(selectedCampaign)}
                            >
                              Delete
                            </a>
                          </div>
                        </div>
                      ))}
                  </div>
                </Row>
              </div>
            )}
          </>
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
              <CircularProgress
                className="loading"
                style={{ margin: "auto" }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AddRulesBugetApplyTo;
