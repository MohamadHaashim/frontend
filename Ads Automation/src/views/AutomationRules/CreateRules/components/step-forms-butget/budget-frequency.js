import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import LogoIcon from "../../../../../assets/brand/logo-icon.svg";
import { isAfter, addDays, format } from "date-fns";
import { CircularProgress } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import MinusIcon from "../../../../../assets/images/icons/minus.png";
import dayjs from "dayjs";
import { InputNumber, TimePicker } from "antd";

function AddRulesBugetFrequency(props) {
  let empty = "01:05 AM";
  const [ruleDataLoading, setRuleDataLoading] = useState(false);
  const [rulesMetaData, setRulesMetaData] = useState({});
  const [reportDurationDetails, setReportDurationDetails] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedInput, setSelectedInput] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [forData, setForData] = useState("");
  const [forData2, setForData2] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [dateRange2, setDateRange2] = useState([new Date(), new Date()]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUnable, setIsUnable] = useState(false);
  const dateRangePickerRef = useRef(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [occurrenceShow, SetOccurrenceShow] = useState("");
  const [dateRangeShow, setDateRangeShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [changeIntervalValue, setChangeItervalvalue] = useState(0);

  const [formValues, setFormValues] = useState([
    {
      time: "",  // Add a separate time field for each form
    },
  ]);

  useEffect(() => {
    console.log("hiiii", props.wizardData.forWizard);
    if (props.wizardData.forWizard) {
      setForData(props.wizardData.forWizard);
      if (props.wizardData.forWizard.length > 0) {
        setFormValues(props.wizardData.forWizard);
      } else {
        setFormValues([
          {
            time: "",
          }])
      }
    }
  }, [props.wizardData]);

  const handleTimeChange = (newTime, index) => {
    const formattedTime = dayjs(newTime).format("hh:mm A");

    // Update the specific form's time value
    const newFormValues = [...formValues];
    newFormValues[index].time = formattedTime;
    setFormValues(newFormValues);
    console.log("Frequency wizard Form Data: ", newFormValues);
    props.parentCallback(newFormValues);
    props.wizardDataCallback(newFormValues);
    wizardUpdate();
  };

  function wizardUpdate() {

    let formData = {
      type: "reportDuration",
      frequency: formValues,
    };
    console.log(formData);

    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  }
  const addFormFields = () => {
    setFormValues([
      ...formValues,
      {
        time: "",
      },
    ]);
  };

  const removeFormFields = (index) => {
    const newFormValues = [...formValues];
    newFormValues.splice(index, 1);
    setFormValues(newFormValues);
  };

  return (
    <>
      <div className="wizard-step pt-4">
        {/* <h5>Frequency</h5> */}
        {!ruleDataLoading ? (
          <div className="card">
            <Row>
              {formValues.map((element, index) => (

                <Col xs={12} sm={6} md={4} lg={3} key={index} className="mb-3">
                  <form>
                    <div className="rule-and-or-container">
                      <div className="form-check">
                        <div className="form-field d-flex">
                          <div className="ms-3 w-100">
                            <TimePicker
                              style={{ height: "40px", width: "100%" }}  // Make TimePicker width responsive
                              value={element.time ? dayjs(element.time, "hh:mm A") : null}
                              onChange={(time) => handleTimeChange(time, index)}
                              format={"hh:mm A"}
                            />
                          </div>
                          <div className="form-action a-3">
                            <div className="mt-1">
                              <button
                                type="button"
                                className="btn btn-link add-more-btn"
                                onClick={addFormFields}
                              >
                                <i className="circle-add-icon"></i>
                              </button>
                            </div>
                            {formValues.length > 1 && index !== 0 && (
                              <div>
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
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                  </form>
                </Col>
              ))}
            </Row>
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
        <div className="datesincustom" value="">
          <style>
            {`
      .hide-toggle-value .rs-picker-toggle-value {
        display: none;
      }
    `}
          </style>
        </div>
      </div>
    </>
  );
}

export default AddRulesBugetFrequency;
