import React from "react";
import { toast } from "react-toastify";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import Navbar from "../Navbar/navbar";
import VisaLogo from "../../../assets/images/visa-logo.png";
import ProCrown from "../../../assets/images/proCrown.png";
import CrownIcon from "../../../assets/images/icons/crownLogo.svg";
import "./billingPlan.css";
import BillingTable from "../Table/billingTable";
export default function BillingPlan() {
  const notify = () => toast("My card has been changed successfully");
  const selectPlan = (eve) => {
    const selectedPlan: any = document.querySelectorAll(".plan-container");
    if (selectedPlan.length > 0) {
      const clearEle: any = document.querySelectorAll(
        ".plan-container.selected"
      );
      for (var i = 0; i < clearEle.length; i++) {
        clearEle[i].classList.remove("selected");
      }
      for (let i = 0; i < selectedPlan.length; i++) {
        if (selectedPlan[i].contains(eve.target)) {
          selectedPlan[i].classList.add("selected");
        }
      }
    }
  };
  return (
    <DashboardLayout>
      <div className="container-fluid  my-account-billing">
        <div className="row">
          <Col md={2}>
            <Navbar />
          </Col>
         <Col md={10}>
            <div className="container billingCard">
              <div className="Billingheading">
                <h2>Billing & Plan</h2>
              </div>
              {/* free */}
              <Row className="freePlanHeading">
                <Col md={9} className="freePlanContainer">
                  <h4>Free Plan</h4>
                  <h3>
                    $0<small>/month</small>
                  </h3>
                  <p className="upgradePlanAlink">
                    Free plan for monthly royalties below $500{" "}
                    <a
                      data-bs-toggle="modal"
                      href="#exampleModalToggle"
                      role="button"
                    >
                      Upgrade Plan
                    </a>{" "}
                    to access all Aimosa features.
                  </p>
                </Col>
                <Col md={3}>
                  <div className="upgradePlanBtn">
                    <button>
                      <a
                        data-bs-toggle="modal"
                        href="#exampleModalToggle"
                        role="button"
                      >
                        Upgrade Plan
                      </a>
                    </button>
                  </div>
                </Col>
              </Row>
              {/* pro */}

              <Row className="proVersionHeader">
                <Col md={10} className="proVersionContainer">
                  <div className="proVersionContent">
                    <img src={CrownIcon} alt="logo" width={30} />
                    <h4>PRO Version</h4>
                  </div>
                  <h3>
                    $9.99<small>/month</small>{" "}
                  </h3>
                  <p>
                    Your next payment is $9.99 on Dec 5th. Your payment will be
                    automatically renewed each month.*VAT & local taxes may
                    apply.{" "}
                  </p>
                </Col>
                <Col md={2}>
                  <div className="cancelRenewalBtn">
                    <h6>Cancel Renewal</h6>
                  </div>
                </Col>
              </Row>

              {/* payment */}
              <div className="paymentheading">
                <h2>Payment Methods</h2>
              </div>
              <Row className="paymentContainer">
                <Col md={9} className="visaContent">
                  <div className="visaLogo">
                    <img src={VisaLogo} alt="visalogo" width={70} />
                  </div>

                  <h6>Dayu Nugraha</h6>
                  <h6>**********52552</h6>
                </Col>
                <Col md={3}>
                  <div className="dropdownContent">
                    {/* dropdown */}
                    <p
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-three-dots-vertical"
                        viewBox="0 0 16 16"
                      >
                        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                      </svg>
                    </p>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <p
                          className="dropdown-item"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop"
                        >
                          Edit card
                        </p>
                      </li>
                      <li>
                        <p className="dropdown-item text-danger">Delete</p>
                      </li>
                    </ul>
                  </div>
                  <div className="expireContent">
                    <h6>Card expires at 12/16</h6>
                  </div>
                </Col>
              </Row>

              {/* Billing History */}
              <Row className="billingHistory">
                <Col md={8}>
                  {" "}
                  <h2>Billing History</h2>
                </Col>
                <Col md={4}>
                  <Col md={12} className="searchBox">
                    <div className="form-input">
                      <span className="icon">
                        <i className="fa fa-search" aria-hidden="true"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Search"
                        className="form-control"
                      />
                    </div>
                  </Col>
                </Col>
              </Row>

              <BillingTable />
            </div>
          </Col>
        </div>

        {/* upgrade model */}
        <div
          className="modal fade"
          id="exampleModalToggle"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content upgradeModel">
              <div className="modal-body upgradeModelBody">
                <Row>
                  <Col md={12}>
                    <h3>Upgrade to PRO Version</h3>
                    <p>
                      Upgrade to our Pro Version and unlock all the exciting
                      features.
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <div className="card plan-container" onClick={selectPlan}>
                      <i className="plan-status-icon" />
                      <h3>Monthly Plan</h3>
                      <h2>
                        $9.99
                        <small>/month</small>
                      </h2>
                      <p>*Billed Monthly</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="card plan-container" onClick={selectPlan}>
                      <i className="plan-status-icon" />
                      <h3>Yearly Plan</h3>
                      <div className="discount">
                        <h2>
                          $99
                          <small>/year</small>
                        </h2>
                        <span>Save up to $20</span>
                      </div>
                      <p>*Billed anually</p>
                    </div>
                  </Col>
                  <Col md={12}>
                    <Row>
                      <Col md={6}>
                        <button
                          className="btn btnforCancel"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        >
                          Cancel
                        </button>
                      </Col>
                      <Col md={6}>
                        <button
                          className="btn selectedPayNowBtn payNow-btn "
                          data-bs-target="#exampleModalToggle2"
                          data-bs-toggle="modal"
                          data-bs-dismiss="modal"
                        >
                          Pay Now
                        </button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
        {/* payment model */}
        <div
          className="modal fade"
          id="exampleModalToggle2"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel2"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content paymentModel">
              <div className="closeIcon">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <Row className="saveCardHeading">
                <Col md={12} className="saveCardForm ">
                  <h5>a discription</h5>
                  <div className="email">
                    <div className="form-input">
                      <span className="icon">
                        <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="cardDetails">
                    <div className="form-input cardNumber">
                      <span className="icon">
                        <i className="fa fa-credit-card" aria-hidden="true"></i>
                      </span>
                      <input
                        type="number"
                        name="email"
                        placeholder="Card number"
                        className="form-control"
                      />
                    </div>
                    <div className="monthyearCvv">
                      <div className="form-input monthyear">
                        <span className="icon">
                          <i className="fa fa-calendar" aria-hidden="true"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className=" form-input cvv">
                        <span className="icon">
                          <i className="fa fa-lock" aria-hidden="true"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="readMe">
                    <input type="checkbox" /> Remember me
                  </div>
                </Col>
                <div className="payContent">
                  <button
                    type="button"
                    className="btn saveCard payButton"
                    data-bs-target="#exampleModalToggle3"
                    data-bs-toggle="modal"
                    data-bs-dismiss="modal"
                  >
                    Pay $0.10
                  </button>
                </div>
              </Row>
            </div>
          </div>
        </div>
        {/* proCrown model */}
        <div
          className="modal fade"
          id="exampleModalToggle3"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel3"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content proCrownModel">
              <Row className="proCrownImageContainer">
                <Col md={12}>
                  <div className="proCrownImg">
                    <img src={ProCrown} alt="Crown image" height={150} />
                  </div>
                  <Row className="proCrownHeading">
                    <h4>Successfully Upgrade to PRO Version</h4>
                    <p>
                      Congratulations! You have successfully upgraded your
                      account to <b>PRO Version</b>. Enjoy unlimited services
                      from us right now.
                    </p>
                  </Row>
                </Col>
                <div className="proCrownOkbtnContainer">
                  <button
                    type="button"
                    className="crownOkBtn"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    ok
                  </button>
                </div>
              </Row>
            </div>
          </div>
        </div>
        {/* model for card edit */}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content editCardModel">
              <div className="closeIcon">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <Row className="editCardHeading">
                <Col md={12} className="editCardForm">
                  <h5>Edit My Card</h5>
                  <div className="email">
                    <div className="form-input">
                      <span className="icon">
                        <i className="fa fa-envelope-o" aria-hidden="true"></i>
                      </span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="cardDetails">
                    <div className="form-input cardNumber">
                      <span className="icon">
                        <i className="fa fa-credit-card" aria-hidden="true"></i>
                      </span>
                      <input
                        type="number"
                        name="email"
                        placeholder="Card number"
                        className="form-control"
                      />
                    </div>
                    <div className="monthyearCvv">
                      <div className="form-input monthyear">
                        <span className="icon">
                          <i className="fa fa-calendar" aria-hidden="true"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className=" form-input cvv">
                        <span className="icon">
                          <i className="fa fa-lock" aria-hidden="true"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="CVC"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="readMe">
                    <input type="checkbox" /> Remember me
                  </div>
                </Col>
                <div className="saveContent">
                  <button
                    type="button"
                    className="btn saveCard saveCardBtn"
                    data-bs-dismiss="modal"
                    onClick={notify}
                  >
                    Save Card
                  </button>
                </div>
              </Row>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
    // new
  );
}
