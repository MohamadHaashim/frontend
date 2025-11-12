import React, { Component } from "react";
import AuthLayout from "../../layouts/auth";
import { Link, Navigate } from "react-router-dom";
import BackIcon from "../../assets/images/back-icon.svg";
import './index.css';

import Image1 from "../../assets/images/unsplashv3qhk9rhtju-3@2x.png";
import Image2 from "../../assets/images/unsplashv3qhk9rhtju-4@2x.png";
import Image3 from "../../assets/images/unsplashv3qhk9rhtju-5@2x.png";


interface FormState {
    redirect: string | null,
}
class DeliveryReportView extends Component<{}, FormState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            redirect: null,
        }
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect} />
        }

        return (
            <AuthLayout>
                <>
                    <div className="propery-light-skyblue">
                        <div className="container">
                            <div className="mt-2">
                                <div className="navbar-back-btn"><img alt="" src={BackIcon} /> <Link to={`${process.env.REACT_APP_BASE_PATH}/delivery-report`}>Back</Link></div>
                            </div>
                            <div className="card border-0 p-4 delivery_report_view_card">
                                <div className="row">
                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 delivery_report_view_header">
                                        <p>View delivery report</p>
                                    </div>
                                    <div className="col-sm-8 col-md-12 col-lg-12 col-xl-8 d-flex gap-5 mt-4">
                                        <p className="delivery_report_view_content_1">Filter</p>
                                        <p className="delivery_report_view_content_2">By billboard :</p>
                                        <p className="delivery_report_view_content_3">UD4A-C-125A01 <i className="fa-solid fa-angle-down"></i></p>
                                        <p className="delivery_report_view_content_4">FBy Created date:</p>
                                        <p className="delivery_report_view_content_5">29 Jul 2023 - 30 Jul 2023 <i className="fa-solid fa-angle-down"></i></p>
                                    </div>
                                    <div className="col-md-4">
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <hr className="my-4" />
                                    </div>
                                </div>

                                <div className="row gap-5">
                                    <div className="row assign_creative_card_scroll delivery_report_view_scroll">

                                        <div className="card col-md-6 col-lg-4 col-xl-3 mb-4 border-0">
                                            <img
                                                src={Image1}
                                                className="card-img-top proof-img-size"
                                                alt="Cannon Hill Inbound 6"
                                            />
                                            <div className="card-body proof-card-body">
                                                <div>
                                                    <h5 className="card-title proof-card-title">Cannon Hill Inbound</h5>
                                                    <p className="card-text proof-card-data">Uploaded on 30 Jun 2023</p>
                                                </div>
                                                <div>
                                                    <Link to={`${process.env.REACT_APP_BASE_PATH}/deliverytableview`} className="btn btn-primary proof-card-btn" >View</Link>
                                                </div>
                                            </div>

                                        </div>

                                        <div className="col-md-6 col-lg-4 col-xl-3 mb-4">
                                            <img
                                                src={Image2}
                                                className="card-img-top proof-img-size"
                                                alt="Cannon Hill Inbound 6"
                                            />
                                            <div className="card-body proof-card-body">
                                                <div>
                                                    <h5 className="card-title proof-card-title">Cannon Hill Inbound</h5>
                                                    <p className="card-text proof-card-data">Uploaded on 30 Jun 2023</p>
                                                </div>
                                                <div>
                                                    <Link to={`${process.env.REACT_APP_BASE_PATH}/deliverytableview`} className="btn btn-primary proof-card-btn" >View</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </AuthLayout>
        );
    }
}
export default DeliveryReportView;
