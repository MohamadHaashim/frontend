import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import LogoIcon from "../../../../../assets/brand/logo-icon.svg";
import { isAfter, addDays, format } from "date-fns";
import { CircularProgress } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import dayjs from "dayjs";
import { InputNumber, TimePicker } from "antd";

function AddRulesFor(props) {
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

  useEffect(() => {
    if (forData === "Custom") {
      setIsPickerOpen(true);
    } else {
      setIsPickerOpen(false);
    }
    if (forData !== "" || forData2 !== "") {
      wizardUpdate();
    }
  }, [forData, forData2, selectedDays, selectedInput, selectedTime ,changeIntervalValue]);

  useEffect(() => {
    if (props.rulesMetaData) {
      console.log(props.rulesMetaData);
      const { reportDurationDetails } = props.rulesMetaData;
      const { dateRange } = props.rulesMetaData;
      console.log(dateRange);
      if (reportDurationDetails !== undefined) {
        setRulesMetaData(props.rulesMetaData);
        setReportDurationDetails(reportDurationDetails);
        setDateRange(dateRange);
        setRuleDataLoading(false);
      }
    }
  }, [props.rulesMetaData, rulesMetaData]);

  useEffect(() => {
    const getProfile = async () => {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      try {
        const response = await fetch(
          "https://adsexpert-api.getgrowth.agency/Users/Profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: AuthToken,
            },
          }
        );
        const responseData = await response.json();
        const profiles = responseData.result.awsProfilesPreferences;
        const timeZone = profiles.find(
          (profile) => profile.profileId === props.selectedAccount
        );
        setTimeZone(timeZone.timezone);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    getProfile();
  }, []);

  useEffect(() => {
    console.log("hiiii", props.wizardData.forWizard);
    if (props.wizardData.forWizard) {
      if (props.wizardData.forWizard?.occurrence?.value === "Custom") {
        setForData(props.wizardData.forWizard?.occurrence?.value);
        SetOccurrenceShow("Custom");
        setSelectedDays(props.wizardData.forWizard?.occurrence?.data);
        const timeString = props.wizardData?.forWizard?.occurrence?.time;
        if (timeString) {
          setSelectedTime(timeString[0]);
        }
        console.log(timeString);
      } 
     else  if (props.wizardData.forWizard?.occurrence?.value === "Weekly") {
        setForData(props.wizardData.forWizard?.occurrence?.value);
        SetOccurrenceShow("Weekly");
        setSelectedDays(props.wizardData.forWizard?.occurrence?.data);
        const timeString = props.wizardData?.forWizard?.occurrence?.time;
        if (timeString) {
          setSelectedTime(timeString[0]);
        }
        console.log(timeString);
      } 
     else  if (props.wizardData.forWizard?.occurrence?.value === "Monthly") {
        setForData(props.wizardData.forWizard?.occurrence?.value);
        SetOccurrenceShow("Monthly");
        setSelectedDays(props.wizardData.forWizard?.occurrence?.data);
        const timeString = props.wizardData?.forWizard?.occurrence?.time;
        if (timeString) {
          setSelectedTime(timeString[0]);
        }
        console.log(timeString);
      } 
      
      
      else {
        setForData(props.wizardData.forWizard?.occurrence?.value);
        const timeString = props.wizardData?.forWizard?.occurrence?.time;
        if (timeString) {
          setSelectedTime(timeString[0]);
        }
        console.log(timeString);
      }

      if (props.wizardData.forWizard?.dateRange?.value === "Custom") {
        setForData2(props.wizardData.forWizard?.dateRange?.value);
        setShowDateRangePicker(true);
        setSelectedInput(props.wizardData.forWizard?.dateRange?.data);
      }
      const auto = props.wizardData.forWizard?.automationInterval?.value
      console.log(auto);
       setChangeItervalvalue(Number(auto))

      setForData2(props.wizardData.forWizard?.dateRange?.value);
    }
  }, []);

  const handleChangeDataRange = (e) => {
    const selectedValue = e.target.value;
    setForData2(selectedValue);

    if (selectedValue === "Custom") {
      setIsPickerOpen(true);
    } else {
      setIsPickerOpen(false);
    }
    console.log(forData2);
    setShowDateRangePicker(selectedValue === "Custom");
    // wizardUpdate()
  };

  function wizardUpdate() {
    console.log(selectedTime);

    let formData = {
      type: "reportDuration",
      frequency: {
        occurrence: {
          value: forData,
          data: selectedDays,
          time: [String(selectedTime)],
        },
        dateRange: {
          value: forData2,
          data: selectedInput,
        },
        automationInterval:{
          value:String(changeIntervalValue),
          data:null
        }
      },
    };
    console.log(formData);

    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  }

  const handleChangeOccurrence = (e) => {
    setSelectedDays([])
    const selectedValue = e.target.value;
    console.log(selectedValue);
    setForData(selectedValue);

    // wizardUpdate()
    if (selectedValue === "Custom") {
      SetOccurrenceShow("Custom");
    } 
     else if (selectedValue === "Weekly"){
      SetOccurrenceShow("Weekly");
     }
     else if (selectedValue === "Monthly"){
      SetOccurrenceShow("Monthly");
     }
      else {
      SetOccurrenceShow("");
    }
  };

  const handleCheckboxChange = (selectedDay) => {
    if (selectedDays.includes(selectedDay)) {
      setSelectedDays((prevSelectedDays) =>
        prevSelectedDays.filter((day) => day !== selectedDay)
      );
    } else {
      setSelectedDays((prevSelectedDays) => [...prevSelectedDays, selectedDay]);
    }
    console.log(selectedDays);
  };
  const handleWeekCheckboxChange = (selectedDay) => {
    if (selectedDays.includes(selectedDay)) {
      setSelectedDays((prevSelectedDays) =>
        prevSelectedDays.filter((day) => day !== selectedDay)
      );
    } else {
      setSelectedDays((prevSelectedDays) => [selectedDay]);
    }
    console.log(selectedDays);
  };

  const handleChangeInput = (e) => {
    setSelectedInput([e.target.value]);
  };
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleTimeChange = (newTime) => {
    console.log(newTime);
    const formattedTime = dayjs(newTime).format("hh:mm A");
    console.log(formattedTime);
    setSelectedTime(formattedTime);
  };
  const handleChangeInterval=(e)=>{
    setChangeItervalvalue(e)
  }
  const handleMonthChangeInterval=(e)=>{
    const value =[String(e)]
    setSelectedDays(value)
  }

  return (
    <>
      <div className="wizard-step pt-4">
        {/* <h5>Frequency</h5> */}
        {!ruleDataLoading ? (
          <div className="card">
            <Row>
              <Col md={5}>
                <form>
                  <div className="form-row">
                    <div className="form-field-group">
                      <div className="form-field d-flex">
                        <h4 style={{ width: "150px" }}>Occurrence</h4>
                        <select
                          className="form-select ms-3"
                          style={{ width: "150px" }}
                          name="reportDuration"
                          value={forData}
                          onChange={handleChangeOccurrence}
                        >
                          <option value="Today">--Select--</option>
                          {reportDurationDetails &&
                            reportDurationDetails.map((list, i) => (
                              <option
                                className="option-hover"
                                key={i}
                                value={list}
                              >
                                {list}
                              </option>
                            ))}
                        </select>

                        {occurrenceShow=== "Custom" && (
                          <div
                            className="d-flex align-items-center   "
                            style={{ width: "168px" }}
                          >
                            <div className="me-2">
                              <Dropdown className="ms-3">
                                <Dropdown.Toggle className="dropdown-select mt-4 pt-2">
                                  --Select--
                                  <i
                                    className="fa fa-angle-down down-arrow-right pe-3"
                                    aria-hidden="true"
                                  ></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ width: "150px" }}>
                                  <Dropdown.Item
                                    key="select"
                                    onClick={() =>
                                      handleCheckboxChange("Select")
                                    }
                                  >
                                    --Select--
                                  </Dropdown.Item>
                                  {days.map((list, i) => (
                                    <Dropdown.Item
                                      key={i}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(list);
                                      }}
                                    >
                                      <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        checked={selectedDays.includes(list)}
                                        onChange={() => {}} 
                                      />{" "}
                                      {list}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        )}
                        {occurrenceShow=== "Weekly" && (
                          <div
                            className="d-flex align-items-center   "
                            style={{ width: "168px" }}
                          >
                            <div className="me-2">
                              <Dropdown className="ms-3 ">
                                <Dropdown.Toggle className="dropdown-select mt-4 pt-2">
                                  {selectedDays.length > 0 ? selectedDays : " --Select--"}
                                  <i
                                    className="fa fa-angle-down down-arrow-right pe-3"
                                    aria-hidden="true"
                                  ></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ width: "150px" }}>
                    
                                  {days.map((list, i) => (
                                    <Dropdown.Item
                                      key={i}
                                      onClick={(e) => {
                                        handleWeekCheckboxChange(list);
                                      }}
                                    >
                                      <input
                                        className="form-check-input me-2"
                                        type="checkbox"
                                        checked={selectedDays.includes(list)}
                                        onChange={() => {}} 
                                      />{" "}
                                      {list}
                                    </Dropdown.Item>
                                  ))}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </div>
                        )}
                        {occurrenceShow=== "Monthly" && (
                        <InputNumber
                        className="form-control ms-3"
                        style={{ width: "150px" }}
                        value={selectedDays[0] || 1}
                        onChange={handleMonthChangeInterval}
                        min={1}
                        max={31}
                      />
                        )}

                        
                        <div className="ms-3 mt-2">{timeZone}</div>
                        <div className="ms-3">
                          {selectedTime !== "" && (
                            <TimePicker
                              style={{ height: "40px", width: "130px" }}
                              defaultValue={dayjs(selectedTime, "HH:mm A")}
                              onChange={handleTimeChange}
                              format={"hh:mm A"}
                            />
                          )}
                          {selectedTime === "" && (
                            <TimePicker
                              style={{ height: "40px", width: "130px" }}
                              value={null}
                              onChange={handleTimeChange}
                              format={"hh:mm A"}
                            
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-row mt-3">
                    <div className="form-field-group">
                      <div className="form-field d-flex align-items-center">
                        <h4 style={{ width: "150px" }}>Duration</h4>
                        <select
                          className="form-select ms-3"
                          style={{ width: "150px" }}
                          name="reportDuration"
                          value={forData2}
                          onChange={(e) => {
                            handleChangeDataRange(e);
                          }}
                        >
                          <option value="Today">--Select--</option>
                          {dateRange &&
                            dateRange.map((list, i) => (
                              <option key={i} value={list.value}>
                                {list.name}
                              </option>
                            ))}
                        </select>
                        {showDateRangePicker && (
                          <div>
                            <input
                              type="number"
                              className="form-control ms-3"
                              style={{ width: "150px" }}
                              placeholder="Number of days"
                              value={selectedInput}
                              onChange={handleChangeInput}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-row mt-3">
                    <div className="form-field-group">
                      <div className="form-field d-flex align-items-center">
                        <h4>Change Interval(Hrs)</h4>
                        
                        <InputNumber
                          className="form-control ms-3"
                          style={{ width: "150px" }}
                          value={changeIntervalValue || 0}
                          onChange={handleChangeInterval}
                        />
                        
                      </div>
                    </div>
                  </div>
                </form>
              </Col>
              {/* <Col></Col>
              <Col></Col> */}
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

export default AddRulesFor;
