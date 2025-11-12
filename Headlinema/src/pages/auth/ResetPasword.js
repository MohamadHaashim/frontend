import React, { useEffect, useState } from "react";
import Logo from "../../images/logo.png";
// import LogoDark from "../../images/logo.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle, Button, PreviewCard } from "../../components/Component";
import { FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { notification } from "antd";
import axios from "axios";
import Url from "../../Api";

function ResetPasword() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const resetPassword = () => {
    if (password !== "") {
      const data = {
        password: password,
        token: token,
      };
      axios
        .post(Url.api + Url.resetPassword, data)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            if (res.data.success === true) {
              window.location.href = "/auth-login";
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
          } else if (res.status === 400) {
            notification.warning({
              message: "Warning",
              description: res.data.message,
              duration: 1,
            });
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
          if(error.response.status === 400){
            notification.error({
              message: "Error",
              description: error.response.data.message,
              duration: 1,
            });
          }
          else{
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
        description: "Please enter new password.",
        duration: 1,
      });
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tokens = searchParams.get("token");
    setToken(tokens);
  }, []);

  return (
    <React.Fragment>
      <Head title="Reset-Password" />
      <div className="bg-login">
        <PageContainer>
          <Block className="nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
              <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
                <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
              </Link>
            </div>

            <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
              <BlockHead>
                <BlockContent>
                  <BlockTitle tag="h5">Set new password</BlockTitle>
                </BlockContent>
              </BlockHead>
              <form>
                <FormGroup>
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Password
                    </label>
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="default-01"
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <Button
                    color="primary"
                    size="lg"
                    className="btn-block"
                    onClick={(ev) => {
                      ev.preventDefault();
                      resetPassword();
                    }}
                  >
                    Reset Password
                  </Button>
                </FormGroup>
              </form>
              <div className="form-note-s2 text-center pt-4">
                <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
                  <strong>Return to login</strong>
                </Link>
              </div>
            </PreviewCard>
          </Block>
          <AuthFooter />
        </PageContainer>
      </div>
    </React.Fragment>
  );
}

export default ResetPasword;
