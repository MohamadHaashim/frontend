import React, { Component, useState } from "react";
import LandingLayout from "../../layouts/landing";
import { Link } from "react-router-dom";
import './index.css';
import LogoImage from "../../assets/brand/home-logo.svg";
import BillBoardListingExploreProperty from "../../components/explore_property/property-listing";
interface ExplorePropertyListProps {
    currencyCode: any;
}
class ExploreProperty extends Component<ExplorePropertyListProps> {
    state = {
        filterChildData: {},
        headerLogo: "",
        config: [],
        authToken: "",
        currencyCode: this.props.currencyCode || localStorage.getItem("currencyCode")

    }
    constructor(props: any) {
        super(props);
        // this.state = {
        //     redirect: null,
        // }
    }
    componentDidMount() {
        this.fetchContent();
    }
    fetchContent = async () => {
        try {
            const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
            const data = await response.json();
            const value = data.find((page: any) => page.name === "Landing Page");

            if (value) {
                this.setState({ content: value.fields });
                const logoComponents = value.fields[0]?.components[0]?.components[1]?.components || [];
                const mediumLogo = logoComponents.find((comp: any) => comp.key === "MediumLogo");
                if (mediumLogo) {
                    this.setState({ headerLogo: mediumLogo.url });
                }
            }
        } catch (error) {
            console.error("Error fetching content:", error);
        }
    };

    handleCallback = (childData: any) => {
        this.setState({ filterChildData: childData });
    }
    isFieldEnabled = (key: string, config: any[]) => {
        const fieldConfig = config.find((field) => field.key === key);
        return fieldConfig ? fieldConfig.default : true;
    };

    render() {

        const isFieldEnabledGeneric = (key: string) => this.isFieldEnabled(key, this.state.config);

        return (
            <div >
                <LandingLayout>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <nav className="navbar navbar-expand-lg">
                                    <Link to={`${process.env.REACT_APP_BASE_PATH}/landing-page`}>
                                        {isFieldEnabledGeneric("logo") && (
                                            <img className="logo-img" src={this.state.headerLogo} alt="Your Logo" />
                                        )}
                                    </Link>
                                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                                        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                        <span className="navbar-toggler-icon"></span>
                                    </button>
                                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                                        <form className=" nav-btn landing-nav">
                                            <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`}><button className="landing-btn login-btn btn-with-icon" type="button"><i className="fa fa-bullhorn" aria-hidden="true"></i> Start New Campaign</button></Link>
                                            <Link to={`${process.env.REACT_APP_BASE_PATH}/landing-page`}>
                                                {isFieldEnabledGeneric("login") && (
                                                    <button className="landing-btn login-btn" type="button" onClick={() => { localStorage.removeItem('isPopupSubmited'); localStorage.removeItem('addedBillboardIds'); }}>Home</button>
                                                )}
                                            </Link>
                                            <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`}>
                                                {isFieldEnabledGeneric("login") && (
                                                    <button className="landing-btn login-btn" type="button">Login</button>
                                                )}
                                            </Link>
                                        </form>
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="container p-0">
                        <BillBoardListingExploreProperty filterData={this.state.filterChildData} currencyCode={this.state.currencyCode} />
                    </div>
                </LandingLayout>
            </div>
        );
    }
}
export default ExploreProperty;
