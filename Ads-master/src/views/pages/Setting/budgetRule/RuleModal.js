import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as yup from "yup";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  createRule,
  getRuleConditions,
  updateRule,
} from "../../../../api-wrapper/rule-wrapper/ApiRules";
import { AiFillDelete } from "react-icons/ai";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { handleLoader } from "../../../../store/Action/loader";
const RuleModal = (props) => {
  const {
    isLoading,
    setIsLoading,
    editId,
    setEditId,
    getRules,
    handleClose,
    selectedRows,
    id,
    showRules,
    setShowRules,
    selectedCampagin,
    timeZoneCountry,
  } = props;
  const dispatch = useDispatch();

  const leadSchema = Yup.object().shape({
    main: yup.array().of(
      yup.object().shape({
        metricName: yup.mixed().required("Question Synonym is Required"),
      })
    ),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    unregister,
  } = useForm({
    resolver: yupResolver(leadSchema),
  });
  const subValueType = [
    { value: "Enabled", label: "Campaign Enabled" },
    { value: "Paused", label: "Campaign Paused" },
    { value: "Increase", label: "Increase Budget" },
    { value: "Decrease", label: "Decrease Budget" },
    { value: "setBudget", label: "Set Budget" },
  ];
  const mainLabel = [
    { value: "Budget", label: "Budget" },
    { value: "Spend", label: "Spend" },
    { value: "ROAS", label: "ROAS" },
    { value: "Sales", label: "Sales" },
    { value: "Clicks", label: "Clicks" },
    { value: "Orders", label: "Orders" },
  ];
  const validatorLabel = [
    { value: "LESS_THAN", label: "Less than" },
    { value: "LESS_THAN_OR_EQUAL_TO", label: "Less than or equal to" },
    { value: "GREATER_THAN_OR_EQUAL_TO", label: "Greater than or equal to" },
    { value: "GREATER_THAN", label: "Greater than" },
    { value: "EQUAL_TO", label: "Equal to" },
  ];
  const selector = [
    { value: "Number", label: "Number" },
    { value: "Percentage", label: "Percentage" },
  ];

  const [ruleName, setRuleName] = useState("");

  const [error, seterror] = useState();
  // ------------------- create/update rules ----------------- //

  const submitHandler = (e) => {
    e.preventDefault();

    let flag = false;
    let sendData = {
      ruleName: ruleName,
      actionType: actionType,
      profileId: selectedCampagin?.profileId,
      conditions: mainRuleData,
      times: timeData,
    };

    let errorData = {};
    if (sendData.ruleName == "") {
      flag = true;
      errorData = {
        ...errorData,
        ruleName: "rulename is required",
      };
    }

    if (sendData.conditions) {
      let mainArr = [];
      sendData?.conditions?.map((el, index) => {
        let subArr = [];
        for (const property in el) {
          if (el[property] === "") {
            flag = true;
            subArr.push({
              [property]: `${property} is required`,
            });
            mainArr[index] = subArr;
          }
        }
      });
      errorData = {
        ...errorData,
        conditions: mainArr,
      };
    }

    if (sendData.actionType) {
      if (sendData?.actionType.actionName == "") {
        flag = true;
        errorData = {
          ...errorData,
          actionName: "actionName is required",
        };
      }
      if (
        sendData?.actionType.actionName != "Paused" &&
        sendData?.actionType.actionName != "Enabled"
      ) {
        if (sendData?.actionType.actionValue == "") {
          flag = true;
          errorData = {
            ...errorData,
            actionValue: "actionValue is required",
          };
        }
        if (sendData?.actionType.actionValueType == "") {
          flag = true;
          errorData = {
            ...errorData,
            actionValueType: "actionValueType is required",
          };
        }
      }
    }

    let mainArrCheck = [];
    sendData?.times?.map((el, index) => {
      let subArr = [];
      if (Object.keys(el).length === 0) {
        flag = true;
        subArr.push({
          Time: `Time is required`,
        });
        mainArrCheck[index] = "Time is required";
      }

      errorData = {
        ...errorData,
        timesErr: mainArrCheck,
      };
    });

    seterror(errorData);

    // API call //
    if (!flag) {
      if (editId) {
        dispatch(handleLoader(true));
        updateRule(editId, sendData)
          .then((res) => {
            if (res.isSuccess) {
              getRules();
              toast.success(res.message);
              dispatch(handleLoader(false));
              setShowRules(false);
            } else {
              toast.error(res.message);
              dispatch(handleLoader(false));
            }
          })
          .catch((err) => {
            toast.error(err);
            dispatch(handleLoader(false));
            setShowRules(false);
          });
      } else {
        dispatch(handleLoader(true));
        createRule(sendData)
          .then((res) => {
            if (res.isSuccess) {
              getRules();
              toast.success(res.message);
              dispatch(handleLoader(false));
              setShowRules(false);
            } else {
              toast.error(res.message);
              dispatch(handleLoader(false));
            }
          })
          .catch((err) => {
            toast.error(err);
            dispatch(handleLoader(false));
            setShowRules(false);
          });
      }
    }
  };

  const errorFun = (index, label, arrayName) => {
    let arr;

    if (arrayName == "condition") {
      arr = error?.conditions[index];
    }
    if (arrayName == "time") {
      arr = error?.time[index];
    }
    return (
      <>
        {arr?.map((obj, i) => {
          if (obj.hasOwnProperty(label)) {
            return (
              <p key={i} className="error">
                {obj[label]}
              </p>
            );
          }
        })}
      </>
    );
  };

  const [actionType, setActionType] = useState({
    actionName: "",
    actionValue: "",
    actionValueType: "",
  });
  const [mainRuleData, setMainRuleData] = useState([
    {
      conditionType: "",
      conditionOperator: "",
      conditionValue: "",
      conditionValueType: "",
    },
  ]);

  const [timeData, setTimeData] = useState([{}]);

  const mainRuleChangeHandler = (e, obj, address_type) => {
    if (address_type) {
      obj[address_type] = e.target.value;
    } else {
      obj[e.target.attributes["data-name"].value] = e.target.value;
    }

    setMainRuleData([...mainRuleData]);
  };

  const addConditionHandler = () => {
    setMainRuleData([
      ...mainRuleData,
      {
        conditionType: "",
        conditionOperator: "",
        conditionValue: "",
        conditionValueType: "",
      },
    ]);
  };

  const handleTimeChange = (index, e) => {
    let arr = timeData;
    arr[index] = e.target.value;
    setTimeData([...arr]);
  };

  const handleAddTimeField = () => {
    setTimeData([...timeData, {}]);
  };

  const handleRemoveTimeField = (index) => {
    let arr = timeData;
    arr.splice(index, 1);
    setTimeData([...arr]);
  };
  const handleRemoveRule = (index) => {
    const newData = [...mainRuleData];
    newData.splice(index, 1);
    setMainRuleData(newData);
  };
  

  const handleActionType = (e) => {
    if (e.target.value == "Paused") {
      setActionType({
        actionName: "Paused",
        actionValue: "",
        actionValueType: "",
      });
    } else {
      setActionType({
        ...actionType,
        [e.target.name]: e.target.value,
      });
    }
  };

  // get rules by id  //
  useEffect(() => {
    if (editId) {
      dispatch(handleLoader(true));
      getRuleConditions(editId)
        .then((res) => {
          if (res.isSuccess) {
            setRuleName(res.data.ruleName);
            setActionType(res.data.actionType);
            setMainRuleData(res.data.conditions);
            setTimeData(res.data.times);
            reset(res.data);
            dispatch(handleLoader(false));
          } else {
            toast.error(res.message);
            dispatch(handleLoader(false));
          }
        })
        .catch((err) => {
          dispatch(handleLoader(false));
          toast.error(err);
        });
    }
  }, [editId]);
  return (
    <div className="new_rule">
      <form>
        {/* ------------- rule name ------------ */}
        <div className="row">
          <div className="col">
            <label>Rule Name:</label>
            <input
              type="text"
              {...register(`ruleName`)}
              onChange={(e) => setRuleName(e.target.value)}
              value={ruleName}
              className="input_rule"
              placeholder="Enter a rule name"
            />
            <p className="error">{error?.ruleName && error.ruleName}</p>
          </div>
        </div>
        <div className="add_border"></div>

        {/* ------------- condition matrix ------------ */}
        <div className="row mt-2">
          <div className="col-11">
            <label>Conditions :</label>
          </div>
          <div className="col-1 text-end">
            <AiOutlinePlus
              size={22}
              className="plus_icon"
              onClick={() => addConditionHandler()}
            />
          </div>
        </div>

        {mainRuleData?.map((element, index) => {
          return (
            <div className="row mb-2 main_row">
              <div className="">
                <select
                  className="form_rule"
                  name="conditionType"
                  {...register(`main.${index}.conditionType`, {
                    onChange: (e) =>
                      mainRuleChangeHandler(e, element, "conditionType"),
                  })}
                  value={element.conditionType}
                >
                  <option hidden>Select</option>
                  {mainLabel.map((el, i) => (
                    <option value={el.value} key={i}>
                      {el.label}
                    </option>
                  ))}
                </select>

                {errorFun(index, "conditionType", "condition")}
              </div>
              <div className="">
                <select
                  name="conditionOperator"
                  className="form_rule"
                  {...register(`main.${index}.conditionOperator`, {
                    onChange: (e) =>
                      mainRuleChangeHandler(e, element, "conditionOperator"),
                  })}
                  value={element.conditionOperator}
                >
                  <option hidden>Select</option>
                  {validatorLabel.map((el, i) => (
                    <option key={i} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>

                {errorFun(index, "conditionOperator", "condition")}
              </div>
              <div className="">
                <input
                  type="number"
                  data-name="conditionValue"
                  className="form_rule"
                  placeholder="Value"
                  {...register(`mainRuleData.${index}.conditionValue`, {
                    onChange: (e) => mainRuleChangeHandler(e, element),
                  })}
                  value={element.conditionValue}
                />

                {errorFun(index, "conditionValue", "condition")}
              </div>
              <div className="">
                <select
                  name="conditionValueType"
                  className="form_rule "
                  {...register(`main.${index}.conditionValueType`, {
                    onChange: (e) =>
                      mainRuleChangeHandler(e, element, "conditionValueType"),
                  })}
                  value={element.conditionValueType}
                >
                  <option hidden>Select</option>
                  {selector.map((el, i) => (
                    <option key={i} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>

                {errorFun(index, "conditionValueType", "condition")}
              </div>

              <div className="minus_icon">
                {index != 0 && (
                  <AiFillDelete
                    size={22}
                    className="icon"
                    onClick={() => handleRemoveRule(index)}
                  />
                )}
              </div>
            </div>
          );
        })}
        <div className="add_border"></div>
        {/* -------------- action type ------------- */}
        <div className="row mt-2">
          <div className="col-11">
            <label>Action Type:</label>
          </div>
        </div>

        <div className="row action_row">
          <div>
            <select
              className="form_rule"
              name="actionName"
              onChange={(e) => {
                handleActionType(e);
              }}
              value={actionType.actionName}
            >
              <option hidden>Select</option>
              {subValueType.map((el, i) => (
                <option key={i} value={el.value}>
                  {el.label}
                </option>
              ))}
            </select>

            <p className="error">{error?.actionName && error.actionName}</p>
          </div>

          <div>
            {actionType.actionName != "Paused" &&
              actionType.actionName != "Enabled" && (
                <>
                  <input
                    type="number"
                    name="actionValue"
                    className="form_rule"
                    placeholder="Value"
                    value={actionType.actionValue}
                    onChange={(e) => handleActionType(e)}
                  />
                  <p className="error">
                    {error?.actionValue && error.actionValue}
                  </p>
                </>
              )}
          </div>

          <div>
            {actionType.actionName != "Paused" &&
              actionType.actionName != "Enabled" && (
                <>
                  <select
                    className="form_rule"
                    name="actionValueType"
                    onChange={(e) => handleActionType(e)}
                    value={actionType.actionValueType}
                  >
                    <option hidden>Select</option>
                    {selector.map((el, i) => (
                      <option key={i} value={el.value}>
                        {el.label}
                      </option>
                    ))}
                  </select>
                  <p className="error">
                    {error?.actionValueType && error.actionValueType}
                  </p>
                </>
              )}
          </div>
        </div>

        <div className="add_border"></div>

        {/* -------------- Time ------------- */}
        <div className="row mt-2">
          <div className="col-11">
            <label>Rule Times :</label>
          </div>
          <div className="col-1 text-end">
            <AiOutlinePlus
              size={22}
              className="plus_icon"
              onClick={() => handleAddTimeField()}
            />
          </div>
        </div>
        <div className="row time_row">
          {timeData?.map((element, index) => {
            return (
              <>
                <div className="mb-2">
                  <input
                    type="time"
                    className="form_rule"
                    placeholder="Value"
                    onChange={(e) => handleTimeChange(index, e)}
                    value={element}
                    id={`mainRuleData-${index}`}
                    name={`mainRuleData-${index}`}
                  />
                  <p className="error">
                    {error?.timesErr.length != 0 && error?.timesErr[index]}
                  </p>
                </div>

                <div className="minus_icon className mb-2">
                  {index != 0 && (
                    <AiFillDelete
                      size={22}
                      className="icon"
                      onClick={() => handleRemoveTimeField(index)}
                    />
                  )}
                </div>
              </>
            );
          })}
        </div>

        <div className="add_border"></div>
        <div className="col-12 d-flex justify-content-center pt-3">
          <button
            className="btn cancel col-3 m-2"
            type="button"
            onClick={() => setShowRules(false)}
          >
            Cancel
          </button>
          <button
            className="btn save col-3 m-2"
            type="submit"
            onClick={(e) => submitHandler(e)}
          >
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};
export default RuleModal;
