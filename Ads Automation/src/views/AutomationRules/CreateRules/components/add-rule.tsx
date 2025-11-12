/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import "../index.css";
import CreateRuleWizard from "../../../../components/Wizard/createRuleWizard";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { event } from "jquery";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import BackArrow from "../../../../assets/images/icons/back-arrow-icon.svg";
// import BackArrow from "../../assets/images/icons/back-arrow-icon.svg";



interface Template {
  id: string;
  templateName: string;
}

function AddRules(props) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [metaData, setMetaData] = useState<any>([]);
  const [rulesMetaData, setRulesMetaData] = useState<any>({});
  const [name, setName] = useState<any>("");
  const [wizardData, setWizardData] = useState<any>({
    name: "",
    applyToWizard: [],
    ifWizard: [],
    forWizard: {},
    thenWizard: [],
    untilWizard: {},
  });
  const [applyTo, setApplyTo] = useState<any>([]);
  const navigate = useNavigate();
 
  const [targetCriteriaDetails, setTargetCriteriaDetails] = useState<any>([]);
  const [reportDuration, setReportDuration] = useState<any>("");
  const [actionCriteria, setActionCriteria] = useState<any>([]);
  const [actionUpToCriteria, setActionUpToCriteria] = useState<any>([]);
  

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedTemplateId(selectedId);
    console.log("Selected Template ID:", selectedTemplateId);
  
  };

  useEffect(() => {
    if(selectedTemplateId !== ""){
      localStorage.setItem("templateId",selectedTemplateId )
      navigate("/ads/add-automation-newrules/" +selectedTemplateId +"/rules");
    }
  }, [selectedTemplateId])

  let loadPanel = (panelName, event) => {
    navigate("/ads/add-automation-newrules/0/rules");
  };
  
  useEffect(() => {
    template();
    localStorage.removeItem("templateId")
    
  }, []);
 

  const template = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://adsexpert-api.getgrowth.agency/Rule/Templates";
    const requestOptions = {
      method: "GET",
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
        setTemplates(result);
      } else {
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const templateCall = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = "https://adsexpert-api.getgrowth.agency/Rule/Template/"+selectedTemplateId;
    const requestOptions = {
      method: "GET",
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
        console.error("Get Rules: ", result);
        let objWizard = {
          id: result.id,
          template:result.template,
          name: result.ruleName,
          applyToWizard: result.applyTo,
          ifWizard: result.targetCriteria,
          forWizard: result.frequency,
          thenWizard: result.actionCriteria.data,
          untilWizard: result.automationCriteria,
        };
        console.log(objWizard);
        
        setName(result.ruleName);
     
        setApplyTo(result.applyTo);
   
        setTargetCriteriaDetails(result.targetCriteria);
        setReportDuration(result.frequency);
        setActionCriteria(result.actionCriteria.data);
        setActionUpToCriteria(result.automationCriteria);
        // setChecked(result.template)
        setWizardData(objWizard);
    
        console.log(wizardData);
        props.parentCallback("AddNewRules");
       navigate("/ads/create-automation-newrules/" +selectedTemplateId);
       
      } else {
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  return (
  
     <DashboardLayout>
      <div className="main-cont-header bookself-container">
        <Row className="page-header">
          <Col>
            <div className="main-con-page-title-container">
              <div className="back-arrow-container">
                <Link to={"/ads/automation-rules"}>
                  <i>
                    <img src={BackArrow} alt="refresh icon" />
                  </i>
                  Back
                </Link>
              </div>
            </div>
          </Col>
          <Col className="text-end last-sync">
          </Col>
        </Row>
      </div>
      <div className="main-content-container">
        <hr />
        <div className="dashboard-container padding-lr-30 mt-4 ps-4">
      <div className="add-rule-container">
        <Row>
          <Col>
            <h4>Add Rule</h4>
            <p>
              You can choose rule from our template below or you can also create
              your custom rule.
            </p>
          </Col>
        </Row>
        <Row className="">
          <Col md={4}>
            <div
              className="rule-box mt-2"
              onClick={(eve) => loadPanel("AddNewRules", eve)}
            >
              <i className="radio-icon"></i>
              <div className="box-header ">
                {" "}
                <i className="fa-solid fa-ellipsis-vertical"></i>Custom Rules
              </div>
              <div className=" p-3">
                <p>You can create your own rules according to what you want.</p>
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="rule-box mt-2" >
              <i className="radio-icon"></i>
              <div className="box-header">
                <i className="fa-solid fa-ellipsis-vertical"></i>Template
              </div>
              <div className=" pt-3">
                <form>
                  <select
                    className="form-select w-50"
                    value={selectedTemplateId}
                    aria-label="Default select example"
                    
                    onChange={(e) => handleTemplateChange(e)}
                  >
                    <option value="">--select--</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id} onClick={(eve) => loadPanel("AddNewRules", eve)} >
                        {template.templateName}
                      </option>
                    ))}
                  </select>
                </form>
              </div>
            </div>
          </Col>
        </Row>

      </div>
      </div>
      </div>
      
    </DashboardLayout>
 
  );
}

export default AddRules;
