import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";

import LogoIcon from "../../../../../assets/brand/logo-icon.svg";
import MinusIcon from "../../../../../assets/images/icons/minus.png";
import SwitchIcon from "../../../../../assets/images/icons/switch-icon.svg";
import DuplicateIcon from "../../../../../assets/images/icons/duplicate-icon.svg";
import RemoveIcon from "../../../../../assets/images/icons/trash-icon.svg";
import moveIcon from "../../../../../assets/images/icons/sort-move-icon.svg";
import { CircularProgress } from "@mui/material";
import isEqual from "lodash/isEqual";

function AddRulesIf(props) {
  const [ruleDataLoading, setRuleDataLoading] = useState(false);
  const [metaDataLoading, setMetaDataLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [rulesMetaData, setRulesMetaData] = useState({});
  const [targetCriteriaDetails, setTargetCriteriaDetails] = useState([]);
  const [filterCriteriaDetails, setFilterCriteriaDetails] = useState([]);
  const [showAdditionalInput, setShowAdditionalInput] = useState(false);
  const [zeroImpression, setZeroImpression] = useState(false);
  const [logicalAnd, setLogicalAnd] = useState(true);
  const [pageData, setPageData] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      targetName: "",
      conditionFilter: "",
      conditionName: "",
      unitName: "",
      conditionValue: "",
      switch: "List",
      conditionNameOperand: "",
    },
  ]);
  const [matchTypes, setMatchTypes] = useState("");
  const [targetOrAd, setTargetOrAd] = useState("Target");
  const [targetOrAdbool, setTargetOrAdBool] = useState(true);
  const [updateWizardData, setUpdateWizardData] = useState(false);
  const [matchTypesSelected, setMatchTypesSelected] = useState({
    autoCampaign: [],
    manualCampaign: { keywordMatch: [], productMatch: [] },
  });

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
  }, [matchTypesSelected, formValues,logicalAnd]);

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
  useEffect(() => {
    if (props.rulesMetaData) {
      setMatchTypes(props.rulesMetaData.applyToDetails?.matchTypes);
      setPageData(props.wizardData.ifWizard);
   
      console.log(pageData);
      let targetCriteriaDetails = props.rulesMetaData.targetCriteriaDetails;

      if (targetCriteriaDetails !== undefined) {
        setRulesMetaData(props.rulesMetaData);
        setTargetCriteriaDetails(props.rulesMetaData.targetCriteriaDetails);

        setFilterCriteriaDetails(
          props.rulesMetaData.targetCriteriaDetails.filters
        );
        console.log(props.rulesMetaData.targetCriteriaDetails.filters);
        setRuleDataLoading(false);
      }
    }
    setMetaData(props.metaData);
  }, [props.rulesMetaData, rulesMetaData, props.metaData, metaData]);

  useEffect(() => {
    if (props.metaData && props.rulesMetaData.targetCriteriaDetails) {
      // console.log(props.wizardData.ifWizard);
      buildConditionDropdownData(
        props.rulesMetaData.targetCriteriaDetails.filters,
        props.metaData
      );
      setMetaDataLoading(false);
    }
  }, [props.rulesMetaData, props.metaData]);

  function buildConditionDropdownData(listData, metaDataList) {
    if (listData && metaDataList) {
      let result = metaDataList.metaData?.data;

      console.log(listData);
      console.log(result);

      if (listData && result) {
        for (let i = 0; i < listData.length; i++) {
          listData[i]["id"] = i + 1;
          listData[i]["selected"] = false;
          let slectedConditionType =
            listData[i]["filterConditionType"].toLowerCase();

          let conditionTypeList = result[slectedConditionType];
          listData[i]["conditionTypes"] = conditionTypeList;
        }
        console.log(listData);
        setFilterCriteriaDetails(listData);
      }
    }
  }

  useEffect(() => {
    if (props.wizardData.ifWizard.data?.length > 0) {
      console.log(props);
      
      let targetCriteriaList = [];
      let targetCriteriaData = props.wizardData.ifWizard.data;
      console.log(targetCriteriaData);
      if(props.wizardData.ifWizard.isTargetRule === false){
        console.log("hhhhkkkkkk");
        
        setTargetOrAd("Product")
        setTargetOrAdBool(false)
      }else {
        setTargetOrAd("Target")
        setTargetOrAdBool(true)
      }

      for (let i = 0; i < targetCriteriaData.length; i++) {
        if (targetCriteriaData[i]) {
          if (
            targetCriteriaData[i].expressions.operand == "CampaignStatus" ||
            targetCriteriaData[i].expressions.operand == "AdGroupStatus" ||
            targetCriteriaData[i].expressions.operand == "TargetStatus"
          ) {
            let obj = {
              targetName: targetCriteriaData[i].target,
              conditionFilter: targetCriteriaData[i].expressions.operand,
              conditionName:
                targetCriteriaData[i].expressions.value[0].inputExpression
                  .input,
              unitName: targetCriteriaData[i].expressions.unit,
              // conditionValue:
              //   targetCriteriaData[i].expressions.value[0].inputExpression.input,
              switch: targetCriteriaData[i].expressions.value[0].inputType,
              conditionNameOperand:
                targetCriteriaData[i].expressions.value[0].inputExpression
                  .operand,
            };
            targetCriteriaList.push(obj);
            console.log("target", targetCriteriaData);
          } else {
            let obj = {
              targetName: targetCriteriaData[i].target,
              conditionFilter: targetCriteriaData[i].expressions.operand,
              conditionName: targetCriteriaData[i].expressions.operator,
              unitName: targetCriteriaData[i].expressions.unit,
              conditionValue:
                targetCriteriaData[i].expressions.value[0].inputExpression
                  .input,
              additionalValue:
                targetCriteriaData[i]?.expressions?.value[1]?.inputExpression
                  ?.input ?? "",
              switch: targetCriteriaData[i].expressions.value[0].inputType,
              conditionNameOperand:
                targetCriteriaData[i].expressions.value[0].inputExpression
                  .operand,
            };
            targetCriteriaList.push(obj);

            console.log("target", targetCriteriaList);
          }
        }
      }
      if (targetCriteriaList.additionalValue !== undefined) {
        setShowAdditionalInput(true);
      }

      setFormValues(targetCriteriaList);
      setMatchTypesSelected(props.wizardData.ifWizard.matchTypes);
      setLogicalAnd()
      console.log(formValues);
      if (targetCriteriaList.length < 1) {
        setFormValues([
          ...formValues,
          {
            targetName: "",
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
            targetName: "",
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
      if(props.wizardData.isTargetRule === false){
        setTargetOrAd("Product")
        setTargetOrAdBool(false)
        setUpdateWizardData(true);
      }else {
        setTargetOrAd("Target")
        setTargetOrAdBool(true)
        setUpdateWizardData(true);
      }
    setZeroImpression(props.wizardData.ifWizard.zeroImpression);

    console.log(props.wizardData.zeroImpression);
  }, [props.wizardData]);

  useEffect(() => {
    console.log(props);
    if (props.wizardData.ifWizard.zeroImpression === undefined) {
      setZeroImpression(props.wizardData.zeroImpression);
    } else {
      setZeroImpression(props.wizardData.ifWizard.zeroImpression);
    }
  }, []);

  useEffect(() => {
    console.log(props);
    if (props.wizardData.ifWizard.isTargetRule === undefined) {
      setTargetOrAdBool(props.wizardData.isTargetRule);

      if(props.wizardData.isTargetRule === false){
        setTargetOrAd("Product")
        setTargetOrAdBool(false)
      }else {
        setTargetOrAd("Target")
        setTargetOrAdBool(true)
      }
    } else {
      setTargetOrAdBool(props.wizardData.isTargetRule);
  
      if(props.wizardData.isTargetRule === false){
        setTargetOrAd("Product")
        setTargetOrAdBool(false)
      }else {
        setTargetOrAd("Target")
        setTargetOrAdBool(true)
      }

    }
    setUpdateWizardData(true);
  }, []);

  useEffect(() => {
    console.log(props);
    if (props.wizardData.isTargetRule === undefined) {
      setTargetOrAdBool(props.wizardData.isTargetRule);

      if(props.wizardData.isTargetRule === false){
        setTargetOrAd("Product")
        setTargetOrAdBool(false)
      }else {
        setTargetOrAd("Target")
        setTargetOrAdBool(true)
      }
    } else {
      setTargetOrAdBool(props.wizardData.isTargetRule);
  
      if(props.wizardData.isTargetRule === false){
        setTargetOrAd("Product")
        setTargetOrAdBool(false)
      }else {
        setTargetOrAd("Target")
        setTargetOrAdBool(true)
      }

    }
    setUpdateWizardData(true);
  }, []);

  useEffect(() => {
    console.log(props);
    if (updateWizardData) {
      wizardDataUpdate();
      setUpdateWizardData(false); 
    }
  }, [updateWizardData]);
  


  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    console.log(e.target.name);
    console.log(e.target.value);

    if (e.target.name === "conditionValue") {
      newFormValues[i]["conditionValue"] = e.target.value;
    } else if (e.target.name === "additionalValue") {
      newFormValues[i]["additionalValue"] = e.target.value;
    } else {
      newFormValues[i][e.target.name] = e.target.value;
      console.log(e.target.name);
      console.log(e.target.value);
      setShowAdditionalInput(
        (e.target.name === "conditionName" && e.target.value === "Between") ||
          (e.target.name === "unitName" &&
            newFormValues[i]["conditionName"] === "Between")
      );
      if (e.target.value === "Spend" || e.target.value === "Bid") {
        newFormValues[i]["unitName"] = "$";
      } else if (
        e.target.value === "ACOS" ||
        e.target.value === "ROAS" ||
        e.target.value === "ClickThroughRate" ||
        e.target.value === "CR"
      ) {
        newFormValues[i]["unitName"] = "%";
      }
    }

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
    console.log(newFormValues[i]["additionalValue"]);
    // Create the value array with both "From" and "To" values
    let formData = {
      type: "targetCriteria",
      ifData: [fromValue, toValue],
      unit: newFormValues[i]["unitName"],
    };

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
        unitName: "",
        conditionValue: "",

        switch: "List",
        conditionNameOperand: "",
      },
    ]);
  };
  let duplicateFormFields = (i) => {
    let newFormValues = [...formValues];
    let duplicateRow = {
      targetName: newFormValues[i].targetName,
      conditionFilter: newFormValues[i].conditionFilter,
      conditionName: newFormValues[i].conditionName,
      unitName: newFormValues[i].unitName,
      conditionValue: newFormValues[i].conditionValue,
      switch: newFormValues[i].switch,
      conditionNameOperand: newFormValues[i].conditionNameOperand,
    };

    newFormValues.push(duplicateRow);
    setFormValues(newFormValues);
    wizardDataUpdate();
  };
  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
    console.log(newFormValues);
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

  function wizardDataUpdate() {
    console.log("wizard", formValues);
    
    let targetCriteria = [];
    for (let i = 0; i < formValues.length; i++) {
      if (
        formValues[i].conditionFilter === "AdGroupStatus" ||
        formValues[i].conditionFilter === "CampaignStatus" ||
        formValues[i].conditionFilter === "TargetStatus"
      ) {
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
        targetCriteria.push(obj);
      } else {
        let obj = {
          logicalAND: logicalAnd,
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

        targetCriteria.push(obj);
      }
    }
    let ifRequestValue = {
      data: targetCriteria,
      matchTypes: matchTypesSelected,
      zeroImpression: zeroImpression,
      isTargetRule:targetOrAdbool
    };

    let formData = {
      type: "targetCriteria",
      targetCriteria: ifRequestValue,
    };
    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  }

  const SubSelectOptions = (props) => {
    let { index, eleData } = props;
    console.log(eleData);

    if (eleData.conditionFilter) {
      let findIndex = filterCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      console.log(findIndex);
      if (findIndex > -1) {
        let conditionData = filterCriteriaDetails[findIndex];
        console.log(conditionData);
        let optionData = conditionData.conditionTypes;

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
    console.log(eleData);
    if (eleData.conditionFilter) {
      let findIndex = filterCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      if (findIndex > -1) {
        let conditionData = filterCriteriaDetails[findIndex];
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
    setUpdateWizardData(true);
  };

  const handleMatchType = () => {
    setLogicalAnd(true);
    setUpdateWizardData(true);
  };

  const handleZeroImpression = () => {
    setZeroImpression(!zeroImpression);
    console.log(!zeroImpression);
    setUpdateWizardData(true);
  };

  const handletargetChange = (e) => {
    console.log(e.target.value);
    setTargetOrAd(e.target.value);
    if (e.target.value === "Product") {
      setTargetOrAdBool(false);
    } else {
      setTargetOrAdBool(true);
    }
    setUpdateWizardData(true);
   
  };

  return (
    <>
      <div className="wizard-step pt-4">
        {/* <h5>Target</h5> */}
        {!metaDataLoading && !ruleDataLoading ? (
          <>
            {formValues.map((element, index) => (
              <>
                {index === 0 && (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="rule-and-or-container">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name={"operation" + index}
                            id={"andOperation" + index}
                            onClick={handleMatchType}
                            defaultChecked={true}
                          />
                          <label
                            className="form-check-label"
                            for={"andOperation" + index}
                          >
                            Match All
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            onClick={handleMatchType2}
                            name={"operation" + index}
                            id={"orOperation" + index}
                          />
                          <label
                            className="form-check-label"
                            for={"orOperation" + index}
                          >
                            Match Any
                          </label>
                        </div>
                      </div>
                      <div>
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          onClick={handleZeroImpression}
                          checked={zeroImpression}
                        ></input>
                        <label className="form-check-label">
                          Include Zero Impression
                        </label>
                      </div>
                    </div>
                    <div className="mt-2 mb-3">
                      <div className="form-field" style={{ width: "12%" }}>
                        <select
                          className="form-select"
                          name="conditionFilter"
                          value={targetOrAd}
                          disabled={props.ruleId !== "0"}
                          onChange={(e) => {
                            handletargetChange(e);
                          }}
                        >
                          <option value="Target">Target</option>
                          <option value="Product">SKU Optimisation</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}
                <div className="card">
                  <Row>
                    <Col md={12}>
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
                                {filterCriteriaDetails.map((list, i) => (
                                  <option value={list.name}>
                                    {list.displayName}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-field  width-40p">
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
                            {element.conditionFilter === "ACOS " ? (
                              <div className="form-field width-30">
                                <select
                                  className="form-select"
                                  name="unitName"
                                  value={element.unitName || ""}
                                  onChange={(e) => handleChange(index, e)}
                                >
                                  <option value="">--Select--</option>
                                  <UnitSelectOptions
                                    index={index}
                                    eleData={element}
                                  />
                                </select>
                              </div>
                            ) : null}

                            {element.conditionFilter === "ACOSs" ? (
                              <div className="dollar-text-end">%</div>
                            ) : null}
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
                            {element.conditionFilter !== "CampaignStatus" &&
                              element.conditionFilter !== "AdGroupStatus" &&
                              element.conditionFilter !== "TargetStatus" &&
                              element.conditionFilter !== "CampaignName" && (
                                <div className="form-field width-40p">
                                  <input
                                    type="number"
                                    placeholder="Enter Value"
                                    name="conditionValue"
                                    className="form-control"
                                    value={element.conditionValue || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                              )}

                            {element.conditionName === "Between" && (
                              <>
                                <div className="mt-2 me-2">To</div>
                                <div
                                  className="form-field width-40p"
                                  style={{ display: "flex" }}
                                >
                                  <input
                                    type="number"
                                    placeholder="Enter Value"
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
                                  className="btn btn-link delete-btn  p-0 pt-1"
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
        {targetOrAdbool && (
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
        )}
      </div>
    </>
  );
}

export default AddRulesIf;
