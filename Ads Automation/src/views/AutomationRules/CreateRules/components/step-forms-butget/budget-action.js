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

function AddRulesBugetAction(props) {
  const [ruleDataLoading, setRuleDataLoading] = useState(false);
  const [metaDataLoading, setMetaDataLoading] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const [isTargetRule, setIsTargetRule] = useState(true);
  const [rulesMetaData, setRulesMetaData] = useState({});
  const [actionUpToCriteriaDetails, setActionUpToCriteriaDetails] = useState(
    []
  );
  const [newActionUpToCriteriaDetails, setNewActionUpToCriteriaDetails] =
    useState([]);
  const [formValues, setFormValues] = useState([
    {
      conditionFilter: "",
      conditionName: "",
      conditionValue: "",
      target: "",
      unitName: "",
      switch: "List",
      conditionNameOperand: "",
    },
  ]);
  console.log("isTargetRule wizardata--->",props.wizardData);

  console.log(formValues);
  useEffect(() => {
    if (props.rulesMetaData) {
      let actionUpToCriteriaDetails = props.rulesMetaData.actionCriteriaDetails;
      if (actionUpToCriteriaDetails !== undefined) {
        setRulesMetaData(props.rulesMetaData);
        setActionUpToCriteriaDetails(props.rulesMetaData.actionCriteriaDetails);
        setIsTargetRule(props.wizardData.ifWizard.isTargetRule);
        setNewActionUpToCriteriaDetails(
          props.rulesMetaData.actionCriteriaDetails
        );
        console.log( props.rulesMetaData.actionCriteriaDetails);
        setRuleDataLoading(false);
      }
    }
    setMetaData(props.metaData);
  }, [props.rulesMetaData, rulesMetaData, props.metaData, metaData]);

  useEffect(() => {
    if (props.metaData && props.rulesMetaData.actionCriteriaDetails) {
      if (props.metaData.text) {
        buildConditionDropdownData(
          props.rulesMetaData.actionCriteriaDetails.filters,
          props.metaData
        );
        setMetaDataLoading(false);
      }
    }
  }, [props.rulesMetaData, props.metaData]);

  useEffect(() => {
    if (props.wizardData.thenWizard.length > 0) {
      let actionCriteriaList = [];
      let actionCriteriaData = props.wizardData.thenWizard;
      console.log(actionCriteriaData);
      for (let i = 0; i < actionCriteriaData.length; i++) {
        if (actionCriteriaData[i]) {
          if (actionCriteriaData[i].expressions.operand === "ChangeStatus") {
            let obj = {
              conditionFilter: actionCriteriaData[i].expressions.operand,
              conditionName:
                actionCriteriaData[i].expressions.value[0].inputExpression
                  .input,
              target: actionCriteriaData[i].expressions.operand,
              unitName: actionCriteriaData[i].expressions.unit,
              switch: actionCriteriaData[i].expressions.value[0].inputType,
              conditionNameOperand:
                actionCriteriaData[i].expressions.value[0].inputExpression
                  .operand,
            };
            actionCriteriaList.push(obj);
          } else {
            let obj = {
              conditionFilter: actionCriteriaData[i].expressions.operand,
              conditionName: actionCriteriaData[i].expressions.operator,
              target: actionCriteriaData[i].expressions.operand,
              conditionValue:
                actionCriteriaData[i].expressions.value[0].inputExpression
                  .input,
              unitName: actionCriteriaData[i].expressions.unit,
              switch: actionCriteriaData[i].expressions.value[0].inputType,
              conditionNameOperand:
                actionCriteriaData[i].expressions.value[0].inputExpression
                  .operand,
            };
            actionCriteriaList.push(obj);
          }
        }
      }
      setFormValues(actionCriteriaList);
      setIsTargetRule(props.wizardData.ifWizard.isTargetRule);
      if (actionCriteriaList.length < 1) {
        setFormValues([
          ...formValues,
          {
            conditionFilter: "",
            conditionName: "",
            conditionValue: "",
            unitName: "",
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
            conditionValue: "",
            unitName: "",
            switch: "List",
            conditionNameOperand: "",
          },
        ]);
      }
    }
  }, []);
  console.log(formValues);
  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    console.log(newFormValues);
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
    if (e.target.value === "ChangeStatus") {
      newFormValues[i]["unitName"] = "";
    }

    let formData = {
      type: "thenData", // or use a more specific type if needed
      thenData: newFormValues, // or extract specific data if needed
    };
    wizardDataUpdate();
    props.parentCallback(formData);
    props.wizardDataCallback(formData);

    console.log(formData);
  };

  let addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        conditionFilter: "",
        conditionName: "",
        conditionValue: "",
        unitName: "",
        target: "",
        switch: "List",
        conditionNameOperand: "",
      },
    ]);
  };
  let duplicateFormFields = (i) => {
    let newFormValues = [...formValues];
    let duplicateRow = {
      conditionFilter: newFormValues[i].conditionFilter,
      conditionName: newFormValues[i].conditionName,
      conditionValue: newFormValues[i].conditionValue,
      unitName: newFormValues[i].unitName,
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
    let actionCriteria = [];
    for (let i = 0; i < formValues.length; i++) {
      let obj = {
        logicalAND: true,

        expressions: {
          target: "",
          operand: formValues[i].conditionFilter,
          operator: formValues[i].conditionName,
          value: [
            {
              inputType: formValues[i].switch,
              inputExpression: {
                operand: formValues[i].conditionNameOperand,
                input:
                  formValues[i].conditionValue || formValues[i].conditionName,
              },
            },
          ],
          unit: formValues[i].unitName,
        },
      };
      actionCriteria.push(obj);
    }
    let formData = {
      type: "actionCriteria",
      actionCriteria: actionCriteria,
    };
    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  }

  function buildConditionDropdownData(listData, metaDataList) {
    let result = metaDataList;
    if (listData && result) {
      for (let i = 0; i < listData.length; i++) {
        listData[i]["id"] = i + 1;
        listData[i]["selected"] = false;
        let slectedConditionType =
          listData[i]["filterConditionType"].toLowerCase();
        let conditionTypeList = result[slectedConditionType];
        listData[i]["conditionTypes"] = conditionTypeList;
      }
      setNewActionUpToCriteriaDetails(listData);
    }
  }
  const SubSelectOptions = (props) => {
    let { index, eleData } = props;
    console.log(newActionUpToCriteriaDetails);
    if (eleData.conditionFilter) {
      let findIndex = newActionUpToCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      if (findIndex > -1) {
        let conditionData = newActionUpToCriteriaDetails[findIndex];
        let optionData = conditionData.possibleValues;
        if (optionData) {
          // SubSelectOptionss();
          if (optionData.length > 0) {
            return optionData?.map((options, i) => (
              <option key={i} value={options}>
                <div>{options}</div>
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
  const SubSelectOptionss = (props) => {
    let { eleData } = props;

    if (eleData.conditionFilter) {
      let findIndex = newActionUpToCriteriaDetails.findIndex(
        (obj) => obj.name === eleData.conditionFilter
      );

      if (findIndex > -1) {
        let conditionData = newActionUpToCriteriaDetails[findIndex];
        let optionData = conditionData.target[0];
        if (optionData) {
          return optionData.applyTo.map((options, i) => (
            <option key={i} value={options}>
              <div>{options}</div>
            </option>
          ));
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  const SubSelecttargetOptions = (props) => {
    let { index, eleData } = props;
    if (eleData.conditionFilter) {
      let findIndex = newActionUpToCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      if (findIndex > -1) {
        let conditionData = newActionUpToCriteriaDetails[findIndex];
        let optionData = conditionData.target;
        if (optionData) {
          if (optionData.length > 0) {
            return optionData?.map((options, i) => {
              console.log(options);
              return (
                <option key={i} value={options.name}>
                  {options.name}
                </option>
              );
            });
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
      let findIndex = newActionUpToCriteriaDetails.findIndex(
        (obj) => obj.name == eleData.conditionFilter
      );
      if (findIndex > -1) {
        let conditionData = newActionUpToCriteriaDetails[findIndex];
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

  const TargetSelectOptions = (props) => {
    let { index, eleData, target } = props;
    console.log("eleData:", eleData);
    console.log("newActionUpToCriteriaDetails:", newActionUpToCriteriaDetails);
    console.log("target:", target);

    console.log("newActionUpToCriteriaDetails:", eleData);
    if (eleData && eleData.conditionFilter && newActionUpToCriteriaDetails) {
      const findIndex = newActionUpToCriteriaDetails.findIndex(
        (obj) => obj.name === eleData.conditionFilter
      );

      if (findIndex > -1) {
        const conditionData = newActionUpToCriteriaDetails[findIndex];
        const targetData = conditionData.target;
        if (targetData && targetData.length > 0) {
          return targetData.map((options, i) => (
            <option key={i} value={options.name}>
              {options.name}
            </option>
          ));
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <>  <div className="wizard-step pt-4">
    {/* <h5>Action</h5> */}
    {!metaDataLoading && !ruleDataLoading ? (
      <>
        {formValues.map((element, index) => (
          <div className="card" key={index}>
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
                          onChange={(e) => handleChange(index, e)}
                        >
                          {isTargetRule ? (
                            <>
                              <option value="">--Select--</option>
                              {newActionUpToCriteriaDetails.map((list, i) => (
                                <option key={i} value={list.name}>
                                  {list.displayName}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              <option value="">--Select--</option>
                              <option value="ChangeStatus">Change Status</option>
                            </>
                          )}
                        </select>
                      </div>{" "}
                      {element.conditionFilter === "ChangeStatus" ? (
                        <div className="form-field width-40p">
                          <select
                            className="form-select"
                            name="conditionName"
                            value={element.conditionName || ""}
                            onChange={(e) => handleChange(index, e)}
                          >
                            <option value="">--Select--</option>
                            <SubSelectOptions index={index} eleData={element} />
                          </select>
                        </div>
                      ) : null}
                      {element.conditionFilter !== "ChangeStatus" && (
                        <>
                          {element.conditionFilter !== "Change Placements %" &&
                          element.conditionFilter !== "Negative Targets" ? (
                            <div className="form-field width-40p">
                              <select
                                className="form-select"
                                name="unitName"
                                value={element.unitName || ""}
                                onChange={(e) => handleChange(index, e)}
                              >
                                <option value="">--select--</option>
  
                                <UnitSelectOptions
                                  index={index}
                                  eleData={element}
                                />
                              </select>
                            </div>
                          ) : element.conditionFilter === "Negative Targets" ? (
                            <div className="form-field width-40p">
                              <select
                                className="form-select"
                                name="target"
                                value={element.target || ""}
                                onChange={(e) => handleChange(index, e)}
                              >
                                <option value="">--select--</option>
                                <SubSelectOptionss
                                  index={index}
                                  eleData={element}
                                />
                              </select>
                            </div>
                          ) : element.conditionFilter === "Change Placements %" ? (
                            <div className="form-field width-40p">
                              <select
                                className="form-select"
                                name="target"
                                value={element.target || ""}
                                onChange={(e) => handleChange(index, e)}
                              >
                                <option value="">--select--</option>
                                <SubSelecttargetOptions
                                  index={index}
                                  eleData={element}
                                />
                              </select>
                            </div>
                          ) : null}
  
                          <div
                            style={{ position: "relative" }}
                            className="form-field rule-switch-container width-40p"
                          >
                            {element.conditionFilter === "Change Placements %" ? (
                              <div className="dollar-text-end">%</div>
                            ) : null}
                            {element.unitName === "$" &&
                            element.conditionFilter !==
                              "Change Placements %" ? (
                              <div className="dollar-text">$</div>
                            ) : element.unitName === "%" ? (
                              <div className="dollar-text-end">%</div>
                            ) : null}
                            <input
                              style={{
                                paddingLeft: "40px",
                              }}
                              type="number"
                              placeholder={
                                element.unitName === "%"
                                  ? "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Enter percentage"
                                  : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0Enter amount"
                              }
                              name="conditionValue"
                              className="form-control"
                              value={element.conditionValue || ""}
                              onChange={(e) => handleChange(index, e)}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </form>
              </Col>
            </Row>
          </div>
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
          <CircularProgress className="loading" style={{ margin: "auto" }} />
        </div>
      </div>
    )}
  </div>
    </>
  );
}

export default AddRulesBugetAction;
