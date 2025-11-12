import React, { Component } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import FaqSideTab from "./SideTab/faqSideTab";
import "./faq.css";
import ProductServiceTitleIcon from "../../assets/images/icons/product-service-title-icon.svg";
export default class Faq extends Component {
  state = {
    lastUpdatedDate: localStorage.getItem("lastUpdatedDate") || null,
  }
  render() {
    return (
      <DashboardLayout>
        <div className="main-cont-header bookself-container">
          <Row className="page-header">
            <Col>
              <div className="main-con-page-title-container">
                <div className="title">
                  <h3 className="page-title">FAQ</h3>
                </div>
              </div>
            </Col>
            <Col className="text-end last-sync">
              <span>Last App Sync :</span>

              <span className="time-summery">
                {" "}
                {this.state.lastUpdatedDate || "Not available"}
              </span>
            </Col>
          </Row>
        </div>
        <div className="main-content-container faq-container">
          <hr />
          <div className="container-fluid">
            <div className="faq-header-bg">
              <Row className="justify-content-center">
                <Col md={5}>
                  <div className="faq-header-title">Hello, how can we help?</div>
                  <div>
                    <form>
                      <div className="search-filter-container">
                        <i className="fa fa-search"></i>
                        <input
                          type="text"
                          placeholder="Search a questions..."
                          id="globalSearch"
                          name="globalSearch"
                          className="faq-header-input"
                        />
                      </div>
                    </form>
                  </div>
                  <p>or select a category to quickly find the help you require.</p>
                </Col>
              </Row>
            </div>
          </div>
          <div className="container-fluid mt-5 padding-lr-30">
            <Row>
              <Col md={3}>
                <FaqSideTab />
              </Col>
              <Col md={9}>
                <div className="container faq-qa-card">
                  <Col md={12}>
                    <div className="faq-qa-header-container">
                      <div className="faq-qa-header">
                        <div className="faq-qa-header-image">
                          <img src={ProductServiceTitleIcon} alt="Product Service Title Icon" />
                        </div>
                      </div>
                      <div className="faq-qa-header">
                        <h2>Product & Services</h2>
                        <p>Get help with products & services</p>
                      </div>
                    </div>
                    <div className="row faq-qa-card-container">
                      <div className="accordion accordion-flush" id="accordionFlushExample">
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="true" aria-controls="flush-collapseOne">
                              Will I be notified once my order has shipped?
                            </button>
                          </h2>
                          <div id="flush-collapseOne" className="accordion-collapse collapse show" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              For the peace of your mind, we offer extended warranty plans that add additional year(s) of protection to the standard manufacturer’s warranty provided by us. To purchase or find out more about the extended warranty program, visit Extended Warranty section here.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                              How can I purchase additional warranty coverage?
                            </button>
                          </h2>
                          <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              For the peace of your mind, we offer extended warranty plans that add additional year(s) of protection to the standard manufacturer’s warranty provided by us. To purchase or find out more about the extended warranty program, visit Extended Warranty section here.
                            </div>
                          </div>
                        </div>
                        <div className="accordion-item">
                          <h2 className="accordion-header" id="flush-headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                              Where can I find warranty information?
                            </button>
                          </h2>
                          <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body">
                              For the peace of your mind, we offer extended warranty plans that add additional year(s) of protection to the standard manufacturer’s warranty provided by us. To purchase or find out more about the extended warranty program, visit Extended Warranty section here.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}
