import React, { useEffect, useState } from "react";

function ConditionFilter(props) {
  const [metaData, setMetaData] = useState("");
  const [isunable, setIsUnable] = useState(null);
  const [isinput, setIsInput] = useState(null);
  const [formValues, setFormValues] = useState([
    {
      columnName: "",
      conditionName: "",
      conditionValue: "",
      conditionbetweenValue: "",
      filterName:""
    },
  ]);
  const [dropdownData, setDropdownDatas] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const handleChange = (i, e) => {
    let newFormValues = [...formValues];

    newFormValues[i][e.target.name] = e.target.value;
  
    if (e.target.name === "columnName") {
    newFormValues[i]["filterName"] = e.target.options[e.target.selectedIndex].id;
      setSelectedColumn(e.target.value);
    } else if (e.target.name === "conditionName") {
      setSelectedCondition(e.target.value);
    }
      // if(e.target.name)
 
 if (newFormValues.some((item) => item.conditionName === "")) {
  setFormValues((prevFormValues) => {
    newFormValues[i]["filterName"] = e.target.options[e.target.selectedIndex].id;
    const updatedFormValues = prevFormValues.map((item) => {
      if (item.conditionName === "") {
        return {
          ...item,
          conditionName: "Equal"
        };
      }
      return item;
    });

    return updatedFormValues;
  });
}
    else{
      setFormValues(newFormValues);
    }

  
    console.log(formValues);
  };

  const addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        columnName: "",
        conditionName: "",
        conditionValue: "",
        conditionbetweenValue: "",
           filterName:""
      },
    ]);
  };

  const removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };
  useEffect(() => {
      if (props.sliceIndex > 0 ){

        const newFilter = formValues.slice(0, props.sliceIndex);
        setFormValues(newFilter);
  
        let filterArray = [];
        for (let i = 0; newFilter.length > i; i++) {
          let getColumnName = dropdownData[newFilter[i].columnName]["name"];
          let filterCondition = {
            logicalOperator: "And",
            conditions: [
              {
                logicalOperator: "And",
                operator: newFilter[i].conditionName,
                value: newFilter[i].conditionValue,
                secondValue: newFilter[i].conditionbetweenValue || null,
                columnName: getColumnName,
              },
            ],
          };
          
          filterArray.push(filterCondition);
        }
    
        console.log("filter", filterArray);
    
        props.parentCallback(filterArray);
      }
      else if (props.sliceIndex === 0) {
        console.log(props.sliceIndex);
        setFormValues([
          {
            columnName: "",
            conditionName: "",
            conditionValue: "",
            conditionbetweenValue: "",
               filterName:""
          },
        ]);
        props.parentCallback([]);
      }
    
  
  }, [props.sliceIndex])

  const handleSubmit = (event) => {
    let filterArray = [];
    for (let i = 0; formValues.length > i; i++) {
      let getColumnName = dropdownData[formValues[i].columnName]["name"];
      let filterCondition = {
        logicalOperator: "And",
        conditions: [
          {
            logicalOperator: "And",
            operator: formValues[i].conditionName,
            value: formValues[i].conditionValue,
            secondValue: formValues[i].conditionbetweenValue || null,
            columnName: getColumnName,
          },
        ],
      };
      
      filterArray.push(filterCondition);
    }

    console.log("filter", filterArray);

    props.parentCallback(filterArray);
    
    const eleRm = document.getElementsByClassName("dropdown-menu");
    if (eleRm) {
      if (eleRm.length > 0) {
        for (let i = 0; i < eleRm.length; i++) {
          eleRm[i].classList.remove("show");
        }
      }
    }
    event.preventDefault();
  };

  useEffect(() => {
    console.log("Meta data - condition filter: ", props);
    if (props.metaData) {
      setMetaData(props.metaData);
    }
  }, [props.metaData]);

  useEffect(() => {
    console.log(props);

    if (props.dropdownData.length > 0) {
      console.log("Condition dropdown option data: ", props.dropdownData);

      buildConditionDropdownData(props.dropdownData, props.metaData?.data);
    }
  }, [props.dropdownData, dropdownData]);

  const buildConditionDropdownData = (listData, metaDataList) => {
    console.log("njndj", listData);
    let result = metaDataList;
    console.log("hhhh", result);
    if (listData && result) {
      for (let i = 0; i < listData.length; i++) {
        listData[i]["id"] = i + 1;
        listData[i]["selected"] = false;
        let slectedConditionType = listData[i]["filterConditionType"];
        let conditionTypeList = result[slectedConditionType];
        listData[i]["conditionTypes"] = conditionTypeList;
      }
      setDropdownDatas(listData);
   
    }
  };

  const SubSelectOptions = (props) => {
    let { index, eleData } = props;
    if (eleData.columnName) {
      let conditionData = dropdownData[eleData.columnName];
      let optionData = conditionData.conditionTypes;
      if (optionData && optionData.length > 0) {
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
  };

  const cancelDropdown = () => {
    const eleRm = document.getElementsByClassName("dropdown-menu");
    if (eleRm) {
      if (eleRm.length > 0) {
        for (let i = 0; i < eleRm.length; i++) {
          eleRm[i].classList.remove("show");
        }
      }
    }
    setFormValues([
      {
        columnName: "",
        conditionName: "",
        conditionValue: "",
        conditionbetweenValue: "",
         filterName:""
      },
    ]);
    props.parentCallback([]);
  };

  const handleStatusHandler = (e) => {
    const status = e.target.options[e.target.selectedIndex].id;
    console.log(e.target.options[e.target.selectedIndex]);
    
    setIsUnable(status);
    setIsInput(null);

  };

  const statusDropdownDataValues = [
    {
      name: "Enabled",
      value: "ENABLED",
    },
    {
      name: "Paused",
      value: "PAUSED",
    },
  ];

  const betweenValuesHandler = (e) => {
    const betweenOperator = e.target.value;
    setIsInput(betweenOperator);
  };
  const statusFilters = ["Status", "Campaign Status", "AdGroup Status"];

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <table className="condition-filter" style={{borderSpacing:" 5px",borderCollapse: " separate"}}>
        <tbody>
          {formValues.map((element, index) => (
            <tr key={index}>
              <td>
                <select
                  style={{
                    marginTop:
                      selectedColumn === "impression" &&
                      selectedCondition === "Between Two Values"
                        ? "-55px"
                        : "0",
                  }}
                  className="form-select"
                  name="columnName"
                  value={element.columnName || ""}
                  onChange={(e) => {
                    handleChange(index, e);
                    handleStatusHandler(e);
                  }}
                >
                  <option value="">--Select--</option>
                  {dropdownData.map((list, i) => (
                    <option value={i} id={list.displayName} key={i}>
                      {list.displayName}
                    </option>
                  ))}
                </select>
              </td>
              { (element.filterName !== "Status" &&  element.filterName !== "Bidding Strategy" && element.filterName !== "Campaign Status" && element.filterName !== "AdGroup Status" )? (
                <td>
                  <select
                    style={{
                      marginTop:
                        selectedColumn === "impression" &&
                        selectedCondition === "Between Two Values"
                          ? "-55px"
                          : "0",
                    }}
                    className="form-select"
                    name="conditionName"
                    value={element.conditionName || ""}
                    onChange={(e) => {
                      handleChange(index, e);
                      betweenValuesHandler(e);
                    }}
                  >
                    <option value="">--Select--</option>
                    <SubSelectOptions index={index} eleData={element} />
                  </select>
                </td>
              ) : null}
              {element.filterName === "Bidding Strategy"? (
                <td>
                  <select
                    style={{
                      marginTop:
                        selectedColumn === "impression" &&
                        selectedCondition === "Between Two Values"
                          ? "-55px"
                          : "0",
                    }}
                    className="form-select"
                    name="conditionValue"
                    value={element.conditionValue || ""}
                    onChange={(e) => {
                      handleChange(index, e);
                      betweenValuesHandler(e);
                    }}
                  >
                    <option value="">--Select--</option>
                    <SubSelectOptions index={index} eleData={element} />
                  </select>
                </td>
              ) : null}
              <td>
              {statusFilters.includes(element.filterName) ? (
                  <div>
                    <select
                      className="form-select"
                      name="conditionValue"
                      value={element.conditionValue || ""}
                      onChange={(e) => {
                        handleChange(index, e);
                      }}
                    >
                      <option value="">--Select--</option>
                      {statusDropdownDataValues.map((list, i) => (
                        <option value={list.value} key={i}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                  </div>
               ) : element.filterName === "Bidding Strategy" ? (
                null
              ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Value"
                      name="conditionValue"
                      className="form-control"
                      value={element.conditionValue || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                )}
                {element.conditionName === "Between" ? (
                  <div>
                    <div className="text-center mt-2 mb-2">
                      <span className="">To</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Second-Value"
                      name="conditionbetweenValue"
                      className="form-control"
                      value={element.conditionbetweenValue || ""}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </div>
                ) : null}
              </td>
              <td>
                {index ? (
                  <button
                    type="button"
                    className="btn btn-default"
                    onClick={() => removeFormFields(index)}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          type="button"
          className="btn btn-link add-more-btn"
          onClick={() => addFormFields()}
        >
          <i className="circle-add-icon" /> Add More
        </button>
      </div>
      <hr />
      <div className="footer">
        <button
          type="button"
          className="btn btn-default"
          onClick={cancelDropdown}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Apply
        </button>
      </div>
    </form>
  );
}

export default ConditionFilter;
