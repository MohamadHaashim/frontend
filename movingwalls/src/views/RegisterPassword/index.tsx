import React, { Component } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate } from "react-router-dom";
import LogoImage from "../../assets/brand/your-logo.svg";
import RegisterPasswordForm from "../../components/register-password/form";
interface FormState {
  redirect: string | null,
  content: any,
  headerLogo: string | null,
}
class RegisterPassword extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      redirect: null,
      content: [],
      headerLogo: null,
    }
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
  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    return (
      <DefaultLayout>
        <section className="container login-basic-height-details registerPassword-height">
          <div className="row">
            <div className="col-md-6 login-leftside">

              <img className='logo-style loginfilled-your-logo-icon' src={this.state.headerLogo || LogoImage} alt="edde" />

              <h1 className="loginfilled-welcome-to-outfront-container font">
                <p className="loginfilled-welcome-to">Welcome to</p>
                <p className="loginfilled-outfront-media">OutFront Media</p>
              </h1>

              <h1 className="loginfilled-run-your-next">
                Run your next outdoor Advertising campaign with just a few clicks
              </h1>
            </div>
            <div className="col-md-6 login-rightside registerPassword-rightside">
              <RegisterPasswordForm />
            </div>

          </div>
        </section>
      </DefaultLayout>
    );
  }
}
export default RegisterPassword;
