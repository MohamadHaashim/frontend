/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import MinusIcon from "../../../../../assets/images/icons/minus.png";
import LogoIcon from "../../../../../assets/brand/logo-icon.svg";
import SwitchIcon from "../../../../../assets/images/icons/switch-icon.svg";
import DuplicateIcon from "../../../../../assets/images/icons/duplicate-icon.svg";
import RemoveIcon from "../../../../../assets/images/icons/trash-icon.svg";
import moveIcon from "../../../../../assets/images/icons/sort-move-icon.svg";
import { CircularProgress } from "@mui/material";
import isEqual from "lodash/isEqual";

function AddRulesUntil(props) {
  const [ruleDataLoading, setRuleDataLoading] = useState(false);
  const [metaDataLoading, setMetaDataLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [isUnable, setIsUnable] = useState(null);
  const [rulesMetaData, setRulesMetaData] = useState({});
  const [actionCriteriaDetails, setActionCriteriaDetails] = useState([]);
  const [newActionCriteriaDetails, setNewActionCriteriaDetails] = useState([]);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [logicalAnd, setLogicalAnd] = useState(false);
  const [pageData, setPageData] = useState([]);
  const [isTargetRule , setIsTargetRule] =useState(true)

  const [formValues, setFormValues] = useState([
    {
      conditionFilter: "",
      conditionName: "",
      unitName: "",
      conditionValue: "",
      switch: "List",
      conditionNameOperand: "",
    },
  ]);
  const [matchTypes, setMatchTypes] = useState("");
  const [matchTypesSelected, setMatchTypesSelected] = useState({
    autoCampaign: [],
    manualCampaign: { keywordMatch: [], productMatch: [] },
  });
  const [ManualDeselect, setManualDeselect] = useState(false);
  const [Autoselect, setAutoselect] = useState(false);

  const handleManualSelectAll = () => {
    const ManualCampaignCheckboxes = {
      keywordMatch: matchTypes?.manualCampaign?.keywordMatch,
      productMatch: matchTypes?.manualCampaign?.productMatch,
    };
    const ManualCampaignCheckboxesEmpty = {
      keywordMatch: [],
      productMatch: [],
    };

    if (
      matchTypesSelected?.manualCampaign?.keywordMatch.length !== 0 &&
      matchTypesSelected?.manualCampaign?.productMatch.length !== 0
    ) {
      // Deselect All
      setMatchTypesSelected({
        ...matchTypesSelected,
        manualCampaign: ManualCampaignCheckboxesEmpty,
      });
    } else {
      // Select All
      setMatchTypesSelected({
        ...matchTypesSelected,
        manualCampaign: ManualCampaignCheckboxes,
      });
    }
  };
  const handleAutoSelectAll = () => {
    const allAutoCampaigns = matchTypes?.autoCampaign;
    if (matchTypesSelected?.autoCampaign.length !== 0) {
      // Deselect All
      setMatchTypesSelected({
        ...matchTypesSelected,
        autoCampaign: [],
      });
    } else {
      // Select All
      setMatchTypesSelected({
        ...matchTypesSelected,
        autoCampaign: allAutoCampaigns,
      });
    }
  };
  useEffect(() => {
    console.log(matchTypesSelected);

    const specificStructure = {
      autoCampaign: [],
      manualCampaign: { keywordMatch: [], productMatch: [] },
    };

    if (!isEqual(matchTypesSelected, specificStructure)) {
      wizardDataUpdate();
    }
  }, [matchTypesSelected, formValues]);

  useEffect(() => {
    if (props.rulesMetaData) {
      console.log(rulesMetaData);
      setMatchTypes(props.rulesMetaData.applyToDetails?.matchTypes);
      setPageData(props.wizardData.untilWizard);
      setIsTargetRule(props.wizardData.ifWizard.isTargetRule)
      console.log(props.wizardData);
      let actionCriteriaDetails = props.rulesMetaData.actionUpToCriteriaDetails;
      if (actionCriteriaDetails !== undefined) {
        setRulesMetaData(props.rulesMetaData);
        setActionCriteriaDetails(props.rulesMetaData.actionCriteriaDetails);
        setRuleDataLoading(false);
      }
    }
    setMetaData(props.metaData);
  }, [props.rulesMetaData, rulesMetaData, props.metaData, metaData]);

  useEffect(() => {
    console.log(props.metaData.text);
    if (props.metaData && props.rulesMetaData.actionUpToCriteriaDetails) {
      buildConditionDropdownData(
        props.rulesMetaData.actionUpToCriteriaDetails,
        props.metaData
      );
      setMetaDataLoading(false);
    }
  }, [props.rulesMetaData, props.metaData]);

  useEffect(() => {
    console.log(props );
    if (props.wizardData.untilWizard?.data?.length > 0) {
      let actionUpToCriteriaList = [];
      let actionUpToCriteriaData = props.wizardData.untilWizard.data;
      for (let i = 0; i < actionUpToCriteriaData.length; i++) {
        if(actionUpToCriteriaData[i]){
          if (actionUpToCriteriaData[i].expressions.operand === "Status") {
            let obj = {
              conditionFilter: actionUpToCriteriaData[i].expressions.operand,
              conditionName: actionUpToCriteriaData[i].expressions.value[0].inputExpression.input,
              unitName: actionUpToCriteriaData[i].expressions.unit,
              // conditionValue:
              //   actionUpToCriteriaData[i].expressions.value[0].inputExpression
              //     .input,
          
              switch: actionUpToCriteriaData[i].expressions.value[0].inputType,
              conditionNameOperand:
                actionUpToCriteriaData[i].expressions.value[0].inputExpression
                  .operand,
            };
            actionUpToCriteriaList.push(obj);
          }
          else{
            let obj = {
              conditionFilter: actionUpToCriteriaData[i].expressions.operand,
              conditionName: actionUpToCriteriaData[i].expressions.operator,
              unitName: actionUpToCriteriaData[i].expressions.unit,
              conditionValue:
                actionUpToCriteriaData[i].expressions.value[0].inputExpression
                  .input,
              additionalValue:
                actionUpToCriteriaData[i]?.expressions?.value[1]?.inputExpression
                  ?.input ?? "",
              switch: actionUpToCriteriaData[i].expressions.value[0].inputType,
              conditionNameOperand:
                actionUpToCriteriaData[i].expressions.value[0].inputExpression
                  .operand,
            };
            actionUpToCriteriaList.push(obj);
          }
        }
        
      }
      console.log(actionUpToCriteriaList.additionalValue);
      if (actionUpToCriteriaList.additionalValue !== undefined) {
        setShowAdditionalInput(true);
      }
      setFormValues(actionUpToCriteriaList);
      setIsTargetRule(props.wizardData.ifWizard.isTargetRule)
      setMatchTypesSelected(props.wizardData.untilWizard.matchTypes);
      if (actionUpToCriteriaList.length < 1) {
        setFormValues([
          ...formValues,
          {
            conditionFilter: "",
            conditionName: "",
            unitName: "",
            conditionValue: "",
            switch: "List",
            conditionNameOperand: "",
          },
        ]);
      }
    } else {
      if (formValues.length < 1) {
        setFormValues([
          ...formValues,
          {
            conditionFilter: "",
            conditionName: "",
            unitName: "",
            conditionValue: "",
            switch: "List",
            conditionNameOperand: "",
          },
        ]);
      }
    }
  }, []);
  let matchTypesSelect = (matchType, e) => {
    let newMatchTypesSelected = matchTypesSelected;
    if (matchType === "autoCampaign") {
      if (e.target.checked) {
        newMatchTypesSelected["autoCampaign"].push(e.target.value);
      } else {
        let newArray = newMatchTypesSelected["autoCampaign"].filter(
          (item) => item !== e.target.value
        );
        newMatchTypesSelected["autoCampaign"] = newArray;
      }
    }
    if (matchType === "keywordMatch") {
      if (e.target.checked) {
        newMatchTypesSelected["manualCampaign"]["keywordMatch"].push(
          e.target.value
        );
      } else {
        let newArray = newMatchTypesSelected["manualCampaign"][
          "keywordMatch"
        ].filter((item) => item !== e.target.value);
        newMatchTypesSelected["manualCampaign"]["keywordMatch"] = newArray;
      }
    }
    if (matchType === "productMatch") {
      if (e.target.checked) {
        newMatchTypesSelected["manualCampaign"]["productMatch"].push(
          e.target.value
        );
      } else {
        let newArray = newMatchTypesSelected["manualCampaign"][
          "productMatch"
        ].filter((item) => item !== e.target.value);
        newMatchTypesSelected["manualCampaign"]["productMatch"] = newArray;
      }
    }
    console.log(newMatchTypesSelected);
    setMatchTypesSelected(newMatchTypesSelected);

    wizardDataUpdate();
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];

    if (e.target.name === "conditionValue") {
      newFormValues[i]["conditionValue"] = e.target.value;
    } else if (e.target.name === "additionalValue") {
      // Update the specific field for "To" value
      newFormValues[i]["additionalValue"] = e.target.value;
    } else {
      // Update other fields as usual
      newFormValues[i][e.target.name] = e.target.value;

      // Update showAdditionalInput based on conditionName and unitName
      setShowAdditionalInput(
        (e.target.name === "conditionName" && e.target.value === "Between") ||
          (e.target.name === "unitName" &&
            newFormValues[i]["conditionName"] === "Between")
      );
      if (e.target.value === "Spend" || e.target.value === "Bid") {
        newFormValues[i]["unitName"] = "$";
      } else if (e.target.value === "ACOS" || e.target.value === "ROAS") {
        newFormValues[i]["unitName"] = "%";
      }
    }

    // Create the value array with both "From" and "To" values
    let fromValue = {
      inputType: "List",
      inputExpression: {
        operand: "",
        input: newFormValues[i]["conditionValue"],
      },
    };

    let toValue = {
      inputType: "List",
      inputExpression: {
        operand: "",
        input: newFormValues[i]["additionalValue"],
      },
    };

    // Create the formData with "ifData" type
    let formData = {
      type: "actionUpToCriteria",
      ifData: [fromValue, toValue],
      unit: newFormValues[i]["unitName"],
    };

    // Callbacks and updates
    props.parentCallback(formData);
    props.wizardDataCallback(formData);
    wizardDataUpdate();
    console.log(newFormValues);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        targetName: "",
        conditionFilter: "",
        conditionName: "",
        conditionValue: "",
        switch: "List",
        conditionNameOperand: "",
      },
    ]);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
    wizardDataUpdate();
  };
  let switchFormFields = (i) => {
    let newFormValues = [...formValues];
    if (newFormValues[i]["switch"] === "List") {
      newFormValues[i]["switch"] = "Calculated";
    } else {
      newFormValues[i]["switch"] = "List";
    }
    setFormValues(newFormValues);
    wizardDataUpdate();
  };
  let handleSubmit = (event) => {};

  function wizardDataUpdate() {
    let actionUpToCriteria = [];
    for (let i = 0; i < formValues.length; i++) {
      if (formValues[i].conditionFilter === "Status") {
        let obj = {
          logicalAND: logicalAnd,
          expressions: {
            target: formValues[i].targetName,
            operand: formValues[i].conditionFilter,
            operator: "Equal",
            unit: formValues[i].unitName,
          },
        };
        obj.expressions.value = [
          {
            inputType: formValues[i].switch,
            inputExpression: {
              operand: formValues[i].conditionNameOperand,
              input:
                formValues[i].conditionValue || formValues[i].conditionName,
            },
          },
        ];
        actionUpToCriteria.push(obj);
      } else {
        let obj = {
          logicalAND: true,
          expressions: {
            target: formValues[i].targetName,
            operand: formValues[i].conditionFilter,
            operator: formValues[i].conditionName,
            unit: formValues[i].unitName,
          },
        };
        if (formValues[i].conditionName !== "Between") {
          obj.expressions.value = [
            {
              inputType: formValues[i].switch,
              inputExpression: {
                operand: formValues[i].conditionNameOperand,
                input:
                  formValues[i].conditionValue || formValues[i].conditionName,
              },
            },
          ];
        } else {
          obj.expressions.value = [
            {
              inputType: formValues[i].switch,
              inputExpression: {
                operand: formValues[i].conditionNameOperand,
                input:
                  formValues[i].conditionValue || formValues[i].conditionName,
              },
            },
            {
              inputType: formValues[i].switch,
              inputExpression: {
                operand: formValues[i].conditionNameOperand,
                input: formValues[i].additionalValue,
              },
            },
          ];
        }
        actionUpToCriteria.push(obj);
      }
    }
    let ifRequestValue = {
      data: actionUpToCriteria,
      matchTypes: matchTypesSelected,
    };

    let formData = {
      type: "actionUpToCriteria",
      actionUpToCriteria: ifRequestValue,
    };

    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  }
  function buildConditionDropdownData(listData, metaDataList) {
    console.log(listData);
    if (listData && metaDataList) {
      let result = metaDataList.metaData?.data;

      if (listData && result) {
        for (let i = 0; i < listData.length; i++) {
          listData[i]["id"] = i + 1;
          listData[i]["selected"] = false;
          let slectedConditionType =
            listData[i]["filterConditionType"].toLowerCase();
          let conditionTypeList = result[slectedConditionType];
          listData[i]["conditionTypes"] = conditionTypeList;
        }

        setNewActionCriteriaDetails(listData);
        console.log(newActionCriteriaDetails);
      }
    }
  }
  const SubSelectOptions = (props) => {
    console.log(props);
    let { index, eleData } = props;

    if (eleData.conditionFilter) {
      let findIndex = newActionCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      console.log(findIndex);
      if (findIndex > -1) {
        let conditionData = newActionCriteriaDetails[findIndex];
        let optionData = conditionData.conditionTypes;
        console.log(optionData);
        if (optionData) {
          if (optionData.length > 0) {
            return optionData.map((options, i) => (
              <option key={i} value={options.value}>
                {options.name}
              </option>
            ));
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const UnitSelectOptions = (props) => {
    let { index, eleData } = props;
    if (eleData.conditionFilter) {
      let findIndex = newActionCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      if (findIndex > -1) {
        let conditionData = newActionCriteriaDetails[findIndex];
        let optionData = conditionData.units;
        if (optionData) {
          if (optionData.length > 0) {
            return optionData.map((options, i) => (
              <option key={i} value={options}>
                {options}
              </option>
            ));
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  const handleMatchType2 = () => {
    setLogicalAnd(false);
  };
  const handleMatchType = () => {
    setLogicalAnd(true);
  };

  return (
    <>
      <div className="wizard-step pt-4">
        {/* <h5>Automation</h5> */}
        {!metaDataLoading && !ruleDataLoading ? (
          <>
            {formValues.map((element, index) => (
              <>
                {index === 0 && (
                  <div className="rule-and-or-container">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDisabled"
                        id="flexRadioDisabled"
                        onClick={handleMatchType}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDisabled"
                      >
                        Match All
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDisabled"
                        id="flexRadioCheckedDisabled"
                        defaultChecked={true}
                        onClick={handleMatchType2}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioCheckedDisabled"
                      >
                        Match Any
                      </label>
                    </div>
                  </div>
                )}
                <div className="card">
                  <Row>
                    <Col md={12}>
                      {/* {index > 0 && (
                        <div className="mt-1 mb-1">
                          <h2
                            className="btn add-more-btn"             
                          >
                            OR
                          </h2>
                        </div>
                      )} */}
                      <form>
                        <div className="form-row">
                          <div className="ele-move-box">
                            <img src={moveIcon} alt="" />
                          </div>
                          <div className="form-field-group">
                            <div className="form-field width-40p">
                              <select
                                className="form-select"
                                name="conditionFilter"
                                value={element.conditionFilter || ""}
                                onChange={(e) => {
                                  handleChange(index, e);
                                }}
                              >
                                <option value="">--Select--</option>
                                {newActionCriteriaDetails.map((list, i) => (
                                  <option value={list.name}>
                                    {list.displayName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-field width-40p">
                              <select
                                className="form-select"
                                name="conditionName"
                                value={element.conditionName || ""}
                                onChange={(e) => handleChange(index, e)}
                              >
                                <option value="">--Select--</option>
                                <SubSelectOptions
                                  index={index}
                                  eleData={element}
                                />
                              </select>
                            </div>

                            {element.conditionFilter === "CampaignName" && (
                              <div className="form-field width-40p">
                                <input
                                  type="text"
                                  placeholder="Enter Value"
                                  name="conditionValue"
                                  className="form-control"
                                  value={element.conditionValue || ""}
                                  onChange={(e) => handleChange(index, e)}
                                />
                              </div>
                            )}
                            {element.conditionFilter !== "Status" &&
                              element.conditionFilter !== "CampaignName" && (
                                <div className="form-field width-40p">
                                  <input
                                    type="text"
                                    placeholder="Enter value"
                                    name="conditionValue"
                                    className="form-control"
                                    value={element.conditionValue || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                              )}

                            {element.conditionName === "Between" && (
                              <>
                                {" "}
                                <div className="mt-2 me-2">To</div>
                                <div
                                  style={{ display: "flex" }}
                                  className="form-field width-40p"
                                >
                                  <input
                                    type="number"
                                    placeholder="Enter To Value"
                                    name="additionalValue"
                                    className="form-control"
                                    value={element.additionalValue || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="form-action a-3">
                            <div className="mt-1">
                              <button
                                type="button"
                                className="btn btn-link add-more-btn"
                                onClick={() => addFormFields()}
                              >
                                <i class="circle-add-icon"></i>
                              </button>
                            </div>
                            {index !== 0 && (
                              <div className="">
                                <div
                                  className="btn btn-link delete-btn p-0 pt-1"
                                  style={{ textDecoration: "underline" }}
                                  onClick={() => removeFormFields(index)}
                                >
                                  <img
                                    src={MinusIcon}
                                    width="15"
                                    height="15"
                                    alt=""
                                  ></img>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </form>
                    </Col>
                  </Row>
                </div>
              </>
            ))}
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
   {isTargetRule &&
        <Row className="mt-3">
          <form>
            <Row>
              <Col md={12}>
                <h4 className="title">Match Types</h4>
              </Col>

              <Col md={6}>
                {matchTypes?.autoCampaign?.length > 0 && (
                  <div className="gray-box">
                    <div className="gray-box-header">
                      <div>
                        <h4 className="title">Auto Campaign:</h4>
                      </div>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={handleAutoSelectAll}
                        >
                          {matchTypesSelected?.autoCampaign.length === 0
                            ? "Select All"
                            : "Deselect All"}
                        </button>
                      </div>
                    </div>
                    <div className="option-list-container mt-2">
                      {matchTypes?.autoCampaign?.map((list, i) => {
                        let findIndex = -1;
                        if (pageData?.matchTypes?.autoCampaign) {
                          findIndex =
                            pageData?.matchTypes?.autoCampaign.findIndex(
                              (ele) => ele == list
                            );
                        }
                        if (findIndex > -1) {
                          return (
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={list}
                                id={"autoCampain" + i}
                                onChange={(e) =>
                                  matchTypesSelect("autoCampaign", e)
                                }
                                checked={matchTypesSelected.autoCampaign.includes(
                                  list
                                )}
                                defaultChecked={true}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={"autoCampain" + i}
                              >
                                {list}
                              </label>
                            </div>
                          );
                        } else {
                          return (
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value={list}
                                id={"autoCampain" + i}
                                onChange={(e) =>
                                  matchTypesSelect("autoCampaign", e)
                                }
                                checked={matchTypesSelected?.autoCampaign?.includes(
                                  list
                                )}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={"autoCampain" + i}
                              >
                                {list}
                              </label>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>
                )}
              </Col>
              <Col md={6}>
                <div className="gray-box">
                  <div className="gray-box-header">
                    <div>
                      <h4 className="title">Manual Campaign:</h4>
                    </div>
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={handleManualSelectAll}
                      >
                        {matchTypesSelected?.manualCampaign?.keywordMatch
                          .length === 0 &&
                        matchTypesSelected?.manualCampaign?.productMatch
                          .length === 0
                          ? "Select All"
                          : "Deselect All"}
                      </button>
                    </div>
                  </div>

                  <Row>
                    {matchTypes?.manualCampaign?.keywordMatch?.length > 0 && (
                      <Col>
                        <div className="option-list-container mt-2">
                          <h6>Keyword Targeting</h6>
                          {matchTypes?.manualCampaign?.keywordMatch?.map(
                            (list, i) => {
                              let findIndex = -1;
                              if (
                                pageData?.matchTypes?.manualCampaign &&
                                pageData?.matchTypes?.manualCampaign
                                  ?.keywordMatch
                              ) {
                                findIndex =
                                  pageData?.matchTypes?.manualCampaign?.keywordMatch?.findIndex(
                                    (ele) => ele == list
                                  );
                              }
                              if (findIndex > -1) {
                                return (
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={list}
                                      id={"keywordMath" + i}
                                      onChange={(e) =>
                                        matchTypesSelect("keywordMatch", e)
                                      }
                                      checked={matchTypesSelected?.manualCampaign?.keywordMatch?.includes(
                                        list
                                      )}
                                      defaultChecked={true}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"keywordMath" + i}
                                    >
                                      {list}
                                    </label>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={list}
                                      id={"keywordMath" + i}
                                      onChange={(e) =>
                                        matchTypesSelect("keywordMatch", e)
                                      }
                                      checked={matchTypesSelected?.manualCampaign?.keywordMatch?.includes(
                                        list
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"keywordMath" + i}
                                    >
                                      {list}
                                    </label>
                                  </div>
                                );
                              }
                            }
                          )}
                        </div>
                      </Col>
                    )}

                    {matchTypes?.manualCampaign?.productMatch?.length > 0 && (
                      <Col>
                        <div className="option-list-container mt-2">
                          <h6>Product Targeting</h6>
                          {matchTypes?.manualCampaign?.productMatch?.map(
                            (list, i) => {
                              let findIndex = -1;
                              if (
                                pageData?.matchTypes?.manualCampaign &&
                                pageData?.matchTypes?.manualCampaign
                                  .productMatch
                              ) {
                                findIndex =
                                  pageData?.matchTypes?.manualCampaign?.productMatch?.findIndex(
                                    (ele) => ele == list
                                  );
                              }
                              if (findIndex > -1) {
                                return (
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={list}
                                      id={"productMath" + i}
                                      onChange={(e) =>
                                        matchTypesSelect("productMatch", e)
                                      }
                                      checked={matchTypesSelected?.manualCampaign?.productMatch?.includes(
                                        list
                                      )}
                                      defaultChecked={true}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"productMath" + i}
                                    >
                                      {list}
                                    </label>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      value={list}
                                      id={"productMath" + i}
                                      onChange={(e) =>
                                        matchTypesSelect("productMatch", e)
                                      }
                                      checked={matchTypesSelected?.manualCampaign?.productMatch?.includes(
                                        list
                                      )}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={"productMath" + i}
                                    >
                                      {list}
                                    </label>
                                  </div>
                                );
                              }
                            }
                          )}
                        </div>
                      </Col>
                    )}
                  </Row>
                </div>
              </Col>
            </Row>
          </form>
        </Row>
}
      </div>
    </>
  );
}

export default AddRulesUntil;
