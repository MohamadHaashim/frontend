import React from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import PageContainer from "../../layout/page-container/PageContainer";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import { Link } from "react-router-dom";

const AuthRegistered = () => {
  return (
    <React.Fragment>
      <Head title="AuthRegister" />
      <div className="bg-login" style={{backgroundColor:"white"}}>
        <PageContainer >
          <Block className="nk-block-middle nk-auth-body">
            <div className="brand-logo pb-5">
              <Link to={`${process.env.PUBLIC_URL}/`} className="logo-link">
                <img className="logo-light logo-img logo-img-lg" src={Logo} alt="logo" />
                <img className="logo-dark logo-img logo-img-lg" src={Logo} alt="logo-dark" />
              </Link>
            </div>
            <BlockHead>
              <BlockContent>
                <BlockTitle tag="h4" className="text-white">Thank you for submitting form</BlockTitle>
                <BlockDes className="text-white">
                  <p>
                    You can now <Link to={`${process.env.PUBLIC_URL}/auth-login`}>Sign In</Link> with your new password
                  </p>
                </BlockDes>
              </BlockContent>
            </BlockHead>
          </Block>
          <AuthFooter />
        </PageContainer>
      </div>
    </React.Fragment>
  );
};
export default AuthRegistered;
