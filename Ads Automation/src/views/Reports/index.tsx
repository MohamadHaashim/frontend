import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import "./reports.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Session from "./session";
import Sales from "./sales";
import BuyBox from "./buybox";
import Orders from "./orders";

import Revenue from "./revenue";
import Cvr from "./cvr";
import Tacos from "./tacos";

interface ResultProps {
  searchResult: any;
}
const Report: React.FunctionComponent<ResultProps> = (props) => {
  const [activeTab, setActiveTab] = useState("session");
  const handleTabChange = (tabkey) =>{
    setActiveTab(tabkey)
  }

  return (
    <DashboardLayout>
      <Row className="ms-2 me-3">
       
        <div className="main-content-container mt-3" >
          <div className="dashboard-container campaing-manger ">

            <div className="tab-container">
              <Tabs
                defaultActiveKey="session"
                activeKey={activeTab}
                onSelect={handleTabChange}
                
              >
               
                <Tab eventKey="session" title="Session" >
                  {activeTab=== "session" && (
                    <Session
                      tabName="Session"
                       profileId={props.searchResult}
                                         
                    />
                  )}
                </Tab>
           
                <Tab eventKey="buybox" title="Buybox" >
                  {activeTab === "buybox" && (
                    <BuyBox
                       tabName="Buybox"
                       profileId={props.searchResult}
                      
                    />
                  )}
                </Tab>
                <Tab eventKey="orders" title="Orders" >
                  {activeTab === "orders" && (
                    <Orders
                       tabName="Orders"
                       profileId={props.searchResult}
                      
                    />
                  )}
                </Tab>
                <Tab eventKey="cvr" title="CVR" >
                  {activeTab === "cvr" && (
                    <Cvr
                       tabName="CVR"
                       profileId={props.searchResult}
                      
                    />
                  )}
                </Tab>
                <Tab eventKey="revenue" title="Revenue" >
                  {activeTab === "revenue" && (
                    <Revenue
                       tabName="Revenue"
                       profileId={props.searchResult}
                      
                    />
                  )}
                </Tab>
                <Tab eventKey="sales" title="Sales" >
                  {activeTab === "sales" && (
                    <Sales
                       tabName="Sales"
                       profileId={props.searchResult}
                      
                    />
                  )}
                </Tab>
           
              </Tabs>
            </div>
          </div>
        </div>
      </Row>
    </DashboardLayout>
  );
};

export default Report;
