import React, { Component } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import Navbar from "../Navbar/navbar";
import "./notification.css";
export default class Notification extends Component {
  render() {
    return (
      <DashboardLayout>
        <div className="container-fluid  my-account-notification">
          <Row>
            <Col md={2}>
              <Navbar />
            </Col>
            <Col md={10}>
              <div className="container notificationCard">
                <Col md={12}>
                  <h2>Notification</h2>
                  <div className="row notificationContainer">
                    <div className="col-md-6 emailNotification">
                      <div className="">
                        <h6>EmailNotifications</h6>
                        <p>
                          Get emails to find out what's going on when you're not
                          online.
                        </p>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Goal/Alerts</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Sales/Royalties Report Notification</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis.
                          </p>
                        </div>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Daily Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>
                        <div className="rightContent">
                          <h6>Weekly Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Monthly Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Quarter Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="emailBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Yearly Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 pushNotification">
                      <div className="">
                        <h6>PushNotifications</h6>
                        <p>
                          Get emails to find out what's going on when you're not
                          online.
                        </p>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Goal/Alerts</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Sales/Royalties Report Notification</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis.
                          </p>
                        </div>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Daily Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Weekly Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Monthly Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Quarter Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                      <div className="pushBodyContent">
                        <div className="form-check form-switch .form-check-input:checked">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id="flexSwitchCheckChecked"
                          />
                        </div>

                        <div className="rightContent">
                          <h6>Yearly Report</h6>
                          <p>
                            Lorem ipsum dolor sit amet consectetur. Et vel
                            ullamcorper pharetra cursus facilisis
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </div>
            </Col>
          </Row>
        </div>
      </DashboardLayout>
    );
  }
}
