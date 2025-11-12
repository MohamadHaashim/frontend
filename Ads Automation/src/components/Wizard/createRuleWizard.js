import React, { useState, useEffect } from "react";
import { Stepper, Step } from "react-form-stepper";
import "./index.css";

import AddRulesApplyto from "../../views/AutomationRules/CreateRules/components/step-forms/applyto";
import AddRulesIf from "../../views/AutomationRules/CreateRules/components/step-forms/if";
import AddRulesFor from "../../views/AutomationRules/CreateRules/components/step-forms/for";
import AddRulesThen from "../../views/AutomationRules/CreateRules/components/step-forms/then";
import AddRulesUntil from "../../views/AutomationRules/CreateRules/components/step-forms/until";
import { Tab, Tabs } from "@mui/material";
import { useParams } from "react-router";

const CreateRuleWizard = (props) => {
  const [ruleDataLoading, setRuleDataLoading] = useState(true);
  const [curStep, setCurStep] = useState(0);
  const [metaData, setMetaData] = useState([]);
  const [rulesMetaData, setRulesMetaData] = useState({});
  const [wizardData, setWizardData] = useState(props.wizardData);

  

  const handleChange = (event, newStep) => {
    setCurStep(newStep);
  };

  useEffect(() => {
    console.log(props.type);

    if (props.rulesMetaData) {
      let applyToDetails = props.rulesMetaData.applyToDetails;
      if (applyToDetails !== undefined) {
        setRulesMetaData(props.rulesMetaData);
        let marketplaceList = applyToDetails.marketPlaces;
        let newMarketplaceList = [];
        if (marketplaceList.length > 0) {
          for (let i = 0; i < marketplaceList.length; i++) {
            let obj = {
              value: marketplaceList[i].countryCode,
              label: marketplaceList[i].country,
            };
            newMarketplaceList.push(obj);
          }
        }
        setRuleDataLoading(false);
      }
    }
    setMetaData(props.metaData);
  }, [props.rulesMetaData, rulesMetaData, props.metaData, metaData]);

  useEffect(() => {
    setWizardData(props.wizardData);
  }, [props.wizardData]);

  /* Apply to wizard */

  const backClick = () => {
    if (curStep !== 0) {
      setCurStep(curStep - 1);
    }
  };
  const nextClick = () => {
    if (curStep !== 6) {
      setCurStep(curStep + 1);
    }
  };
  const handleCallback = (childData) => {
    props.parentCallback(childData);
  };
  const parentWizardData = (childData) => {
    props.wizardCallback(childData);
  };
  const submitAddRule = () => {
    let submit = {
      type: "submit",
    };
    props.parentCallback(submit);
  };
  return (
    <>
      <div className="wizard-container">
        <div className="wizard-stepper-container  d-flex flex-column align-items-around">
          <Tabs
            defaultActiveKey="Target"
            value={curStep}
            onChange={handleChange}
            className="d-flex flex-column justify-content-end"
          >
            <Tab label="Target" />
            <Tab label="Action" />
            <Tab label="Exception" />
            <Tab label="Frequency" />
            {props.type !== "templateUpdate" && <Tab label="Apply to" />}
          </Tabs>
        </div>
        {/* <hr /> */}
        <div className="wizard-step-container">
          {curStep === 0 && (
            <AddRulesIf
              rulesMetaData={rulesMetaData}
              metaData={metaData}
              parentCallback={handleCallback}
              wizardDataCallback={parentWizardData}
              wizardData={wizardData}
              ruleId={props.ruleId}
            />
          )}
          {curStep === 1 && (
            <AddRulesThen
              rulesMetaData={rulesMetaData}
              metaData={metaData}
              parentCallback={handleCallback}
              wizardDataCallback={parentWizardData}
              wizardData={wizardData}
            />
          )}
          {curStep === 2 && (
            <AddRulesUntil
              rulesMetaData={rulesMetaData}
              metaData={metaData}
              parentCallback={handleCallback}
              wizardDataCallback={parentWizardData}
              wizardData={wizardData}
            />
          )}

          {curStep === 3 && (
            <AddRulesFor
              rulesMetaData={rulesMetaData}
              metaData={metaData}
              parentCallback={handleCallback}
              wizardDataCallback={parentWizardData}
              wizardData={wizardData}
              selectedAccount={props.selectedAccount}
            />
          )}
          {props.type !== "templateUpdate" && curStep === 4 && (
            <AddRulesApplyto
              rulesMetaData={rulesMetaData}
              metaData={metaData}
              parentCallback={handleCallback}
              wizardDataCallback={parentWizardData}
              wizardData={wizardData}
              selectedAccount={props.selectedAccount}
            />
          )}
        </div>
      </div>
      <div className="wizard-nav-btn-container flex-row-reverse">
        <div className="wizard-nav-btn">
          {curStep === 3 && props.type === "templateUpdate" ? (
            <button onClick={submitAddRule} className="green">
              Update Template
            </button>
          ) : curStep !== 4 ? (
            <button onClick={nextClick} className="green">
              Next
            </button>
          ) : (
            <button onClick={submitAddRule} className="green">
              Add Rule
            </button>
          )}
        </div>
 
        <div className="wizard-nav-btn">
          {curStep !== 0 ? (
            <button onClick={backClick} className="outline">
              Back
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};
export default CreateRuleWizard;
