/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Row, Col } from "react-bootstrap";
import "./index.css";

import { Link } from "react-router-dom";
import LinkIcon from "../../../assets/images/icons/link-icon.svg";
import BackArrow from "../../../assets/images/icons/back-arrow-icon.svg";

  import AddRules from "./components/add-rule";
  import AddNewRules from "./components/add-new-rule";
  interface ResultProps {
    searchResult: any;
  }
  const CreateAutomationRules: React.FC<ResultProps>  = (props) => {
    const { id } = useParams();
  const [showPanel, setShowPanel] = useState("Default");
  const lastUpdatedDate = localStorage.getItem("lastUpdatedDate") || null;
  const[account ,setAccount]=useState("")

  useEffect(() => {
    const accountId = localStorage.getItem("account");
    if(props.searchResult ===""){
      setAccount(String(accountId));

    }
    else{
      setAccount(props.searchResult);
    }
    
console.log(id);

    if (id === "0") {
      setShowPanel("Default");
    } 
    else if(id === "*"){
      setShowPanel("Default");
    }

      else {
      setShowPanel("AddNewRules");
    }
  }, [id, props.searchResult]);

    const handleCallback = (loadPanelName) => {
      setShowPanel(loadPanelName);
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
        <div className="dashboard-container padding-lr-30 mt-4">
          {showPanel === "Default" && (
            <AddRules parentCallback={handleCallback} selectedAccount={account}  />
          )}

          {/* {showPanel === "AddNewRules" && (
            <AddNewRules parentCallback={handleCallback} id={id} selectedAccount={account} />
          )} */}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateAutomationRules;
