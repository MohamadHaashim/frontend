import React, { Component } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import Navbar from "../Navbar/navbar";
import "./amazonConnection.css";
import AmazonConnectionTable from "../Table/amazonConnectionTable";
export default class AmazonConnection extends Component {
  render() {
    return (
      <DashboardLayout>
        <div className="amazon-conection mt-2 container-fluid">
          <Row>
            <Col md={2}>
              <Navbar />
            </Col>
            <Col md={10}>
              <div className="amazonConnectionCard  p-4">
                <div className="amazonConectionHeading">
                  <h2>Amazon Connection</h2>
                  <button className="btn btn-primary">Add Merchant</button>
                </div>
                <Row>
                  <Col md={12}>
                    <AmazonConnectionTable />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    );
  }
}
