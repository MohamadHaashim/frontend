import React, { useEffect, useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard } from "../../components/Component";
import { FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import Url from "../../Api";

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const sendLink = () => {
    if (email !== "") {
      const data = {
        email: email,
      };

      axios
        .post(Url.api + Url.forgotPassword, data)
        .then((res) => {
          if (res.status === 200) {
            if (res.data.success === true) {
              setSuccess(true);
              notification.success({
                message: "Success",
                description: res.data.message,
                duration: 1,
              });
            } else {
              notification.error({
                message: "Error",
                description: res.data.message,
                duration: 1,
              });
            }
          } else {
            notification.error({
              message: "Error",
              description: "Something went wrong",
              duration: 1,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 400) {
            notification.error({
              message: "Error",
              description: error.response.data.message,
              duration: 1,
            });
          } else {
            notification.error({
              message: "Error",
              description: "Something went wrong",
              duration: 1,
            });
          }
        });
    } else {
      notification.warning({
        message: "Warning",
        description: "Please enter email.",
        duration: 1,
      });
    }
  };

  return (
    <React.Fragment>
      <Head title="Forgot-Password" />
      <div className="bg-login">
        <PageContainer>
          <Block className="nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
              <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
                <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
              </Link>
            </div>
            {success ? (
              <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                <BlockHead>
                  <BlockContent>
                    <BlockTitle tag="h5">Check your email to reset the password</BlockTitle>
                    <BlockDes className="pt-2">
                      <p>Click the password reset link sent to <span style={{color:"#c26712"}}>{email}</span> </p>
                      <p>Didn't receive the email? Please check spam folder</p>
                    </BlockDes>
                  </BlockContent>
                </BlockHead>

                <div className="form-note-s2 text-center ">
                  <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                    <strong>Return to login</strong>
                  </Link>
                </div>
              </PreviewCard>
            ) : (
              <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
                <BlockHead>
                  <BlockContent>
                    <BlockTitle tag="h5">Reset password</BlockTitle>
                    <BlockDes>
                      <p>
                        If you forgot your password, well, then we’ll email you instructions to reset your password.
                      </p>
                    </BlockDes>
                  </BlockContent>
                </BlockHead>
                <form>
                  <FormGroup>
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="default-01">
                        Email
                      </label>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="default-01"
                      placeholder="Enter your email"
                      value={email}
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      color="primary"
                      size="lg"
                      className="btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        sendLink();
                      }}
                    >
                      Send Reset Link
                    </Button>
                  </FormGroup>
                </form>
                <div className="form-note-s2 text-center pt-4">
                  <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                    <strong>Return to login</strong>
                  </Link>
                </div>
              </PreviewCard>
            )}
          </Block>
          <AuthFooter />
        </PageContainer>
      </div>
    </React.Fragment>
  );
};
export default ForgotPassword;
