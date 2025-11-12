import React, { useState, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { DateRangePicker } from "rsuite";
import LogoIcon from "../../../../../assets/brand/logo-icon.svg";
import Moment from "moment";

function AddRulesTimeline(props) {
  const [ruleDataLoading, setRuleDataLoading] = useState(true);
  const [runContinuously, setRunContinuously] = useState(true);
  const [durationChecked, setDurationChecked] = useState(false);
  const [forData, setForData] = useState("");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [reportDurationDetails, setReportDurationDetails] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const dateRangePickerRef = useRef(null);

  useEffect(() => {
    if (props.rulesMetaData) {
      let reportDurationDetails = props.rulesMetaData.reportDurationDetails;
      if (reportDurationDetails !== undefined) {
        const customOption = reportDurationDetails.filter(
          (option) => option === "Custom"
        );
        setReportDurationDetails(customOption);
        setRuleDataLoading(false);
      }
    }
  }, [props.rulesMetaData]);

  const onChangeDateRangeSubmitGlobal = (value) => {
    let formData = {};
    setDateRange(value);
    setIsPickerOpen(false);

    // Handle the date range change here
    console.log("Selected date range:", value);

    // Send the selected date range to forWizard
    const formattedDateRange = value
      ? value.map((date) => format(date, "yyyy-MM-dd"))
      : [];
    formData = {
      type: "schedule",
      schedule: {
        runContinuously: false,
        dateRange: {
          from: formattedDateRange[0],
          to: formattedDateRange[1],
        },
      },
    };

    console.log(formData);
    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  };

  const handleChange = (type) => {
    let formData = {};
    if (type === "run") {
      setRunContinuously(true);
      setDurationChecked(false);
      formData = {
        type: "schedule",
        schedule: {
          runContinuously: true,
          dateRange: null,
        },
      };
    }
    if (type === "date") {
      setRunContinuously(false);
      setDurationChecked(true);
      let current = new Date();
      formData = {
        type: "schedule",
        schedule: {
          runContinuously: false,
          dateRange: {
            from: Moment(new Date()).format(),
            to: Moment(new Date().setDate(current.getDate() + 30)).format(),
          },
        },
      };
      setIsPickerOpen(true); // Show the date range picker when "Date range" is selected
    }

    // Update forData
    setForData(type === "date" ? "Custom" : "");

    props.parentCallback(formData);
    props.wizardDataCallback(formData);
  };

  return (
    <>
      <div className="wizard-step">
        <h5>Timeline</h5>
        <div className="card">
          <Row>
            <Col md={5}>
              <form>
                <div className="rule-and-or-container">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDisabled"
                      id="flexRadioDisabled"
                      checked={runContinuously}
                      onChange={() => handleChange("run")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDisabled"
                    >
                      Run continuously
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field-group">
                    <div className="form-field form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="flexRadioDisabled"
                        id="flexRadioCheckedDisabled"
                        checked={durationChecked}
                        onChange={() => handleChange("date")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioCheckedDisabled"
                      >
                        Date range
                      </label>
                    </div>
                    {!runContinuously && durationChecked && (
                      <div className="form-field" style={{ width: "100px" }}>
                        <div
                          className="datesincustoms"
                          style={{ height: "100px" }}
                        >
                          <style>
                            {`
                              .rs-picker-has-value .rs-btn .rs-picker-toggle-value,
                              .rs-picker-has-value .rs-picker-toggle .rs-picker-toggle-value,
                              .rs-picker-default .rs-picker-toggle.rs-btn {
                                color: #6b7380;
                              }
                              .rs-calendar-body {
                                height: 100px; /* Adjust the height to your preference */
                              }
                            `}
                          </style>
                          <DateRangePicker
                            ref={dateRangePickerRef}
                            placeholder=""
                            format="yyyy-MM-dd"
                            onChange={onChangeDateRangeSubmitGlobal}
                            value={dateRange}
                            open={isPickerOpen}
                            ranges={[]}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}

export default AddRulesTimeline;
