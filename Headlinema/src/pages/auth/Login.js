import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, FormGroup, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "axios";
import Url from "../../Api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");
  const [user, setUser] = useState("");
  const [passw, setPassw] = useState("");

  const onFormSubmit = () => {
    // if(user === "Headlinema" && passw ==="headlinema@123"){
    //   window.history("/")
    // }
console.log("dhdh");

setLoading(true);
    const config = {
      method: "post",
      url: Url.api + Url.userLogin,
      headers: {},
      data: { email: user, password: passw },
    };

    axios(config)
      .then(function (response) {
       
        if (response.data.success === true) {
          setLoading(false);

          localStorage.setItem("userName", response.data.result?.userLogin?.username);
          localStorage.setItem("userId", response.data.result?.userLogin?.userId);
          localStorage.setItem("userEmail",response.data.result?.userLogin?.userEmail)
          localStorage.setItem("userEmail",response.data.result?.userLogin?.useremail)
          localStorage.setItem("token",response.data.result.accessToken)
          // console.log(userEmail,"-------",useremail);
          
          const profile = response.data.result?.profiles;
          localStorage.setItem("Profiles", JSON.stringify(profile));
          const Spprofile = response.data?.spRegions;
          localStorage.setItem("SPProfiles", JSON.stringify(Spprofile));
          const Vpprofile = response.data?.vendorRegions;
          localStorage.setItem("VPProfiles", JSON.stringify(Vpprofile));
          const AdsProfile = response.data.result?.adsProfileIds;
          localStorage.setItem("AdsProfiles", JSON.stringify(AdsProfile));
          
          localStorage.setItem("adsConnected", response.data.connected === false || response.data.connected === null ? "notConnected" : "Connected");
          localStorage.setItem("spId", response.data.spConnected === false || response.data.spConnected === null ? "notConnected" : "Connected");
          localStorage.setItem("vpId", response.data.spVendorConnected === false || response.data.spVendorConnected === null ? "notConnected" : "Connected");
         localStorage.setItem("RegionCode", "NA");
         localStorage.setItem("RegionName", "North America");
          const adsConnected = localStorage.getItem("adsConnected");
          
          if (adsConnected === "notConnected"){
            window.history.pushState(
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/users"}`,
              "auth-login",
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/users"}`
            );
          }
          else{
            window.history.pushState(
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/users"}`,
              "auth-login",
              `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/users"}`
            );
          }
           
            window.location.reload();
        
        } else {
          window.history.pushState(
            `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/auth-login"}`,
            "auth-login",
            `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/auth-login"}`
          );
          setLoading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setTimeout(() => {
          setError("Cannot login with credentials");
          setLoading(false);
        }, 2000);
      });
  };

  const { errors, register, handleSubmit } = useForm();

  return (
    <React.Fragment>
      <Head title="Login" />
      <div className="bg-login">
        <PageContainer>
          <Block className="nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
              <div className="logo-link">
                <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
              </div>
            </div>

            <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
              <BlockHead>
                <BlockContent>
                  <BlockTitle tag="h4">Sign-In</BlockTitle>
                  <BlockDes>
                    <p>Access Headlinema using your email and Password.</p>
                  </BlockDes>
                </BlockContent>
              </BlockHead>
              {errorVal && (
                <div className="mb-3">
                  <Alert color="danger" className="alert-icon">
                    {" "}
                    <Icon name="alert-circle" /> Unable to login with credentials{" "}
                  </Alert>
                </div>
              )}
              <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="text"
                      id="default-01"
                      name="name"
                      ref={register({ required: "This field is required" })}
                      placeholder="Enter your email"
                      onChange={(e) => setUser(e.target.value)}
                      className="form-control-lg form-control"
                    />
                    {errors.name && <span className="invalid">{errors.name.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                    <Link className="link link-primary link-sm" to={`${process.env.PUBLIC_URL}/auth-reset`}>
                      Forgot password?
                    </Link>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setPassState(!passState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${passState ? "is-hidden" : "is-shown"}`}
                    >
                      <Icon name="eye" className="passcode-icon icon-show"></Icon>

                      <Icon name="eye-off" className="passcode-icon icon-hide"></Icon>
                    </a>
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      name="passcode"
                      ref={register({ required: "This field is required" })}
                      placeholder="Enter your password"
                      onChange={(e) => setPassw(e.target.value)}
                      className={`form-control-lg form-control ${passState ? "is-hidden" : "is-shown"}`}
                    />
                    {errors.passcode && <span className="invalid">{errors.passcode.message}</span>}
                  </div>
                </FormGroup>
                <FormGroup>
                  {/* <Link to="/"> */}
                  <Button size="lg" className="btn-block" type="submit" color="primary">
                    {loading ? <Spinner size="sm" color="light" /> : "Sign in"}
                  </Button>
                  {/* </Link> */}
                </FormGroup>
              </Form>
              {/* <div className="form-note-s2 text-center pt-4">
                {" "}
                New on our platform? <Link to={`${process.env.PUBLIC_URL}/auth-register`}>Create an account</Link>
              </div> */}
            </PreviewCard>
          </Block>
          <AuthFooter />
        </PageContainer>
      </div>
    </React.Fragment>
  );
};
export default Login;
