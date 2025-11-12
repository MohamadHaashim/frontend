import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import MyAccountForm from "../../components/my-account/form";
import BackIcon from "../../assets/images/back-icon.svg";
import './index.css'
interface FormState {
  redirect: string | null,
}
class MyAccount extends Component<{}, FormState> {
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
        <div className="myaccount-full-form">
          <div className="container mt-2">
            <div className="navbar-back-btn"><img alt="" src={BackIcon} /><Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`} > Back</Link></div>
          </div>
          <div className="container my-account-form">
            <MyAccountForm />
          </div>
        </div>
      </AuthLayout>
    );
  }
}
export default MyAccount;
