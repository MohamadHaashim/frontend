/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import "../index.css";
import LogoIcon from "../../../../assets/brand/logo-icon.svg";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import DashboardLayout from "../../../../layouts/DashboardLayout";
import BackArrow from "../../../../assets/images/icons/back-arrow-icon.svg";
import CreateBudgetRuleWizard from "../../../../components/Wizard/createRuleWizard";
import Url from "../../../../Api";
interface ResultProps {
  searchResult: any;
}

const AddNewRulesBudget: React.FC<ResultProps> = (props) => {
  const [metaData, setMetaData] = useState<any>([]);
  const [rulesMetaData, setRulesMetaData] = useState<any>({});
  const [name, setName] = useState<any>("");
  const [templateId, setTemplateId] = useState<any>("");
  const [selectedAccount, setSelectedAccount] = useState<any>("");
  const { id } = useParams<{ id: string }>();
  const { type } = useParams<{ type: string }>();
  const [marketPlaces, setMarketPlaces] = useState<any>([]);
  const [applyTo, setApplyTo] = useState<any>([]);
  const [matchTypes, setMatchTypes] = useState<any>([]);
  const [targetCriteriaDetails, setTargetCriteriaDetails] = useState<any>([]);
  const [reportDuration, setReportDuration] = useState<any>("");
  const navigate = useNavigate();
  const [actionCriteria, setActionCriteria] = useState<any>([]);
  const [actionUpToCriteria, setActionUpToCriteria] = useState<any>({});
  const [schedule, setSchedule] = useState<any>({
    runContinuously: true,
    dateRange: null,
  });
  const [addRulesObj, setAddRulesObj] = useState<any>({});

  const [getRuleStatus, setGetRuleStatus] = useState<any>(false);
  const [templateShow, setTemplateShow] = useState<any>(true);

  const [wizardData, setWizardData] = useState<any>({
    name: "",
    applyToWizard: [],
    ifWizard: [],
    forWizard: [],
    thenWizard: [],
    untilWizard: {},
    // timelineWizard: { runContinuously: true, dateRange: null },
  });
  const [isChecked, setChecked] = useState(false);

  console.log(type);

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  };
  useEffect(() => {
    setSelectedAccount(props.searchResult);
  }, [props.searchResult]);

  useEffect(() => {
    console.log("kkkkkkk", props);

    const Tempid = localStorage.getItem("templateId");

    setTemplateId(Tempid);
    console.log(templateId);

    if (id !== "0" && templateId === null && type === "rules") {
      setGetRuleStatus(true);
      setTemplateShow(true);
      getRule();
    } else if (id !== "0" && templateId !== null && type === "rules") {
      setTemplateShow(false);
      templateCall();
    } else if (id !== "0" && templateId === null && type === "templateUpdate") {
      setTemplateShow(false);
      templateUpdateData();
    }
  }, [id, templateId]);

  // useEffect(() => {
  //   if(type === "templateUpdate"){
  //     templateUpdateData()
  //   }
  // }, [])

  const wizardCallback = (childData) => {
    console.log(childData);

    if (childData) {
      let newWizardData = wizardData;
      if (childData.type === "applyTo") {
        newWizardData["applyToWizard"] = childData.applyTo;
      }
      if (childData.type === "targetCriteria") {
        newWizardData["ifWizard"] = childData.targetCriteria;
      }
      if (childData.type === "reportDuration") {
        newWizardData["forWizard"] = childData.frequency;
      }
      if (childData.type === "actionCriteria") {
        newWizardData["thenWizard"] = childData.actionCriteria;
      }

      setWizardData(newWizardData);
      console.log("hhhhh", newWizardData);
    }
  };

  const handleCallback = (childData) => {
    console.log("parent log child data: ", childData);

    if (childData.type === "applyTo") {
      setApplyTo(childData.applyTo);
    }
    if (childData.type === "targetCriteria") {
      setTargetCriteriaDetails(childData.targetCriteria);
    }
    if (childData.type === "reportDuration") {
      setReportDuration(childData.frequency);
    }
    if (childData.type === "actionCriteria") {
      setActionCriteria(childData.actionCriteria);
    }

    if (childData.type === "submit") {
      if (id !== "0" && templateId === null && type === "rules") {
        submitUpdateRule();
      } else if (id !== "0" && templateId !== null && type === "rules") {
        submitAddRule();
      } else if (
        id !== "0" &&
        templateId === null &&
        type === "templateUpdate"
      ) {
        templateUpdate();
      } else {
        submitAddRule();
      }
    }
  };

  const submitAddRule = async () => {
    
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = Url.api + Url.ruleBudget;
    console.log("/Rule/Budget======", Url.ruleBudget);
    

    let timeSlots = reportDuration;
    let timeArray:any = [];
    for(let i=0; timeSlots.length > i; i++){
      let pushStr = timeSlots[i].time;
      timeArray.push(pushStr);
    }
    const action = {
      data: actionCriteria,
    };
    const ifdata = {
      data: targetCriteriaDetails.data,
      matchTypes: targetCriteriaDetails.matchTypes,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: selectedAccount,
        name: name,
        isTargetRule: false, //targetCriteriaDetails.isTargetRule
        isCampaignRule: true,
        template: isChecked,
        targetCriteria: ifdata,
        actionCriteria: action,
        times: timeArray,
        applyTo: applyTo,
        applyZeroImpression:targetCriteriaDetails.zeroImpression,
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
        toast.success(responceData.message);
        navigate("/ads/automation-rules");
      } else {
        toast.error(responceData.message);
      }
      // setRedirect("/onboarding");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Error On Creating Rule");
    }
  };

  const templateCall = async () => {
    if (templateId !== "") {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url =Url.api +Url.ruleTemplateGetById + templateId;
      console.log("Rule/Template/======", Url.ruleTemplateGetById + templateId);

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
            template: result.template,
            name: result.ruleName,
            applyToWizard: result.applyTo,
            ifWizard: result.targetCriteria,
            forWizard: result.frequency,
            thenWizard: result.actionCriteria.data,
            untilWizard: result.automationCriteria,
            zeroImpression: result.applyZeroImpression,
            isTargetRule: result.isTargetRule,
          };
          console.log(objWizard);

          setName(result.ruleName);
          setApplyTo(result.applyTo);
          setTargetCriteriaDetails(result.targetCriteria);
          setReportDuration(result.frequency);
          setActionCriteria(result.actionCriteria.data);
          setActionUpToCriteria(result.automationCriteria);
          setWizardData(objWizard);
          console.log(wizardData);
          // props.parentCallback("AddNewRules");
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };
  const templateUpdateData = async () => {
    if (id) {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      let url = Url.api+Url.ruleTemplateGetById+id;
      console.log("Rule/Template/======", Url.ruleTemplateGetById+id);

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
            template: result.template,
            name: result.ruleName,
            applyToWizard: result.applyTo,
            ifWizard: result.targetCriteria,
            forWizard: result.frequency,
            thenWizard: result.actionCriteria.data,
            untilWizard: result.automationCriteria,
            zeroImpression: result.applyZeroImpression,
            isTargetRule: result.isTargetRule,
            
          };
          console.log(objWizard);

          setName(result.ruleName);
          setApplyTo(result.applyTo);
          setTargetCriteriaDetails(result.targetCriteria);
          setReportDuration(result.frequency);
          setActionCriteria(result.actionCriteria.data);
          setActionUpToCriteria(result.automationCriteria);
          setWizardData(objWizard);
          console.log(wizardData);
          // props.parentCallback("AddNewRules");
        } else {
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const getRule = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =Url.api +Url.ruleGetById + id;
    console.log("/Rule/======", Url.ruleGetById + id);

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
          template: result.template,
          name: result.ruleName,
          applyToWizard: result.applyTo,
          ifWizard: result.targetCriteria,
          forWizard: result.frequency,
          thenWizard: result.actionCriteria.data,
          untilWizard: result.automationCriteria,
          zeroImpression: result.applyZeroImpression,
          isTargetRule: result.isTargetRule,
        };
        console.log(objWizard);

        setName(result.ruleName);
        setMarketPlaces(result.marketPlaces);
        setApplyTo(result.applyTo);
        setMatchTypes(result.matchTypes);
        setTargetCriteriaDetails(result.targetCriteria);
        setReportDuration(result.frequency);
        setActionCriteria(result.actionCriteria.data);
        setActionUpToCriteria(result.automationCriteria);
        setChecked(result.template);
        setWizardData(objWizard);
        setGetRuleStatus(false);
        console.log(wizardData);
      } else {
        setGetRuleStatus(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Error On loading Rule");
      setGetRuleStatus(false);
    }
  };

  const submitUpdateRule = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url = Url.api + Url.ruleBudgetPut;
    console.log("Rule/Budget======", Url.ruleBudgetPut);

    const action = {
      data: actionCriteria,
    };
    const ifdata = {
      data: targetCriteriaDetails.data,
      matchTypes: targetCriteriaDetails.matchTypes,
    };
    let timeSlots = reportDuration;
    let timeArray:any = [];
    for(let i=0; timeSlots.length > i; i++){
      let pushStr = timeSlots[i].time;
      timeArray.push(pushStr);
    }
    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: selectedAccount,
        id: id,
        name: name,
        template: isChecked,
        applyTo: applyTo,
        targetCriteria: ifdata,
        actionCriteria: action,
        time:timeArray,
        isCampaignRule: true,
        applyZeroImpression: targetCriteriaDetails.zeroImpression,
        isTargetRule: false, //targetCriteriaDetails.isTargetRule
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
        console.error(result);
        toast("Successfully Rule updated");
        navigate("/ads/automation-rules");
      } else {
        toast("Unable to create Rule");
      }
      // setRedirect("/onboarding");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Error On Creating Rule");
    }
  };

  const templateUpdate = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =Url.api + Url.ruleTemplatesPut;
    console.log("Rule/Template======", Url.ruleTemplatesPut);

    const action = {
      data: actionCriteria,
    };
    const ifdata = {
      data: targetCriteriaDetails.data,
      matchTypes: targetCriteriaDetails.matchTypes,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        profileId: selectedAccount,
        id: id,
        name: name,
        template: isChecked,
        applyTo: applyTo,
        targetCriteria: ifdata,
        frequency: reportDuration,
        actionCriteria: action,
        automationCriteria: actionUpToCriteria,
        applyZeroImpression: targetCriteriaDetails.zeroImpression,
        isTargetRule: targetCriteriaDetails.isTargetRule,
      }),
    };

    try {
      const response = await fetch(url, requestOptions);
      const responceData = await response.json();
      if (responceData.success) {
        let result = responceData.result;
        console.error(result);
        toast("Successfully Template Updated");
        navigate("/ads/rules-template");
      } else {
        toast("Unable to update template");
      }
  
    } catch (error) {
      console.error("Error fetching data:", error);
      toast("Error on updating template");
    }
  };

  let handleChange = (e) => {
    let newFormValues = addRulesObj;
    newFormValues["name"] = e.target.value;
    setName(e.target.value);
    let newWizardDataName = wizardData;
    newWizardDataName["name"] = e.target.value;
    setWizardData(newWizardDataName);
    console.log("Wizard Data: ", newWizardDataName);
  };

  useEffect(() => {
    if (rulesMetaData) {
      if (!rulesMetaData.applyToDetails) {
        getRulesMetaData();
      }
    }
    if (metaData) {
      if (metaData.length < 1) {
        getMetaData();
      }
    }
  }, [metaData, rulesMetaData]);

  const getMetaData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =Url.api +"/MasterData/meta";
    console.log("MasterData/meta======", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      setMetaData({ metaData: responceData.result });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getRulesMetaData = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    let url =Url.api +Url.masterDataGetById +"Budget_Rule_Creation";
    console.log("/MasterData/Budget_Rule_Creation----->",url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    });

    try {
      const responceData = await response.json();
      setRulesMetaData(responceData.result.data);
      console.log("target Api values---------->",responceData.result.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    // Additional logic here if needed
  };

  return (
    <DashboardLayout>
      <div className="main-cont-header bookself-container">
        <Row className="page-header">
          <Col>
            <div className="main-con-page-title-container">
              <div className="back-arrow-container">
                <Link
                  to="/ads/automation-rules"
                  // {
                  //   type === "rules"
                  //     ? id !== "0"
                  //       ? "/ads/automation-rules"
                  //       : "/ads/add-automation-rules/0"
                  //     : "/ads/rules-template"
                  // }
                >
                  <i>
                    <img src={BackArrow} alt="refresh icon" />
                  </i>
                  Back
                </Link>
              </div>
            </div>
          </Col>
          <Col className="text-end last-sync"></Col>
        </Row>
      </div>
      <div className="main-content-container">
        <hr />
        <div className="dashboard-container padding-lr-30 mt-4">
          <div className="add-rule-container add-new-rule">
            <Row>
              <Col>
                <h4>Add Budget Rule</h4>
              </Col>
            </Row>
            {!getRuleStatus ? (
              <Row className="mt-3">
                <Col md={8} className="d-flex">
                  <div className="mb-3 d-flex align-items-center me-5">
                    <h5 className="me-3">Rule Name</h5>
                    <form onSubmit={handleSubmit}>
                      <div>
                        <input
                          className="form-control"
                          type="text"
                          style={{ width: "350px " }}
                          placeholder="Enter rule name "
                          id="globalSearch"
                          name="globalSearch"
                          onChange={(e) => handleChange(e)}
                          defaultValue={name}
                        />
                      </div>
                    </form>
                  </div>
                  
                </Col>
                <Row>
                  <Col className="steperDesign">
                    {rulesMetaData && (
                      <CreateBudgetRuleWizard
                        rulesMetaData={rulesMetaData}
                        type={type}
                        metaData={metaData}
                        parentCallback={handleCallback}
                        wizardData={wizardData}
                        selectedAccount={selectedAccount}
                        wizardCallback={wizardCallback}
                        ruleId={id}
                      />
                    )}
                  </Col>
                </Row>
              </Row>
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
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AddNewRulesBudget;
