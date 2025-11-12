import React, { Component } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LogoImage from "../../assets/brand/your-logo.svg";
import SignInForm from "../../components/sign-in/form";
import ForgotPasswordForm from "../../components/forgot-password/form";
interface FormState {
  redirect: string | null,
}
class ForgotPassword extends Component<{}, FormState> {
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
      <DefaultLayout>
         <section className="container login-basic-height-details">
          <div className="row">
              <div className="col-md-6 login-leftside">

              <img className='logo-style loginfilled-your-logo-icon' src={LogoImage} alt="edde" />

                  <h1 className="loginfilled-welcome-to-outfront-container font">
                      <p className="loginfilled-welcome-to">Welcome to</p>
                      <p className="loginfilled-outfront-media">OutFront Media</p>
                  </h1>

                  <h1 className="loginfilled-run-your-next">
                      Run your next outdoor Advertising campaign with just a few clicks
                  </h1>
              </div>
              <div className="col-md-6 login-rightside">
              <ForgotPasswordForm />
              </div>

          </div>
      </section>
      </DefaultLayout>
    );
  }
}
export default ForgotPassword;
