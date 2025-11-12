import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";

interface FormState {
  redirect: string | null;
  authToken: string | null;
}

interface LandingContentProps {
  showHeadline: boolean;
  showSubHeadline: boolean;
  headline: string;
  subHeadline: string;
}

class LandingContent extends Component<LandingContentProps, FormState> {
  constructor(props: LandingContentProps) {
    super(props);
    this.state = {
      redirect: null,
      authToken: localStorage.getItem('authToken'),
    };
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }

    return (
      <div className="landing-content">
        {this.props.showHeadline && (
          <h1 className="landing-cnt1">{this.props.headline}</h1>
        )}
        {this.props.showSubHeadline && (
          <p className="landing-cnt2">{this.props.subHeadline}</p>
        )}
        {/* {this.state.authToken ? ( */}
        {true ? (
          <Link to={`${process.env.REACT_APP_BASE_PATH}/explore-property`}><button className="btn btn-primary landing-btn1">Show All Properties</button></Link>
        ) : (
          <button className="btn btn-primary landing-btn1" data-bs-toggle="modal" data-bs-target="#redirectToLoginModal">Show All Properties</button>
        )}
      </div>
    );
  }
}

export default LandingContent;
