import React, { Component, useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate } from "react-router-dom";
import LogoImage from "../../assets/brand/your-logo.svg";
import SignUpForm from "../../components/sign-up/form";

interface FormState {
  errorMessage: string;
  redirect: string | null;
}
const SignUp = () => {
  const [config, setConfig] = useState<any[]>([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const data = await response.json();
        const registerConfig = data.find((page: any) => page.name === "User Registration")?.configurations.find((c: any) => c.key === "basicInformation");
        if (registerConfig) {
          setConfig(registerConfig.fields);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  const [content, setContent] = useState<any[]>([]);
  const [yourLogo, setyourLogo] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "Landing Page");
        setContent(value.fields);
        const logoLen = ((value.fields[0].components[0].components[1].components).length)
        for (let i = 0; i < logoLen; i++) {
          if ((value.fields[0].components[0].components[1].components[i].key) == "MediumLogo") {
            setyourLogo(value.fields[0].components[0].components[1].components[i].url)
            break;
          }

        }

      } catch (error) {
      }
    };

    fetchContent();
  }, []);





  const isFieldEnabled = (key: string) => {
    const fieldConfig = config.find((fields: any) => fields.key === key);
    return fieldConfig ? fieldConfig.default : true;
  };
  return (
    <DefaultLayout>
      <section className="container login-basic-height-details basicRegister-height">
        <div className="row">
          <div className="col-md-6 login-leftside">

            <img className='logo-style loginfilled-your-logo-icon' src={yourLogo} alt="yourLogo" />

            <h1 className="loginfilled-welcome-to-outfront-container font">
              <p className="loginfilled-welcome-to">Welcome to</p>
              <p className="loginfilled-outfront-media">OutFront Media</p>
            </h1>

            <h1 className="loginfilled-run-your-next">
              Run your next outdoor Advertising campaign with just a few clicks
            </h1>
          </div>
          <div className="col-md-6 login-rightside register-rightside">
            <SignUpForm
              firstNameInput={isFieldEnabled("first name")}
              lastNameInput={isFieldEnabled("last name")}
              emailInput={isFieldEnabled("email id")}
              phoneNoInput={isFieldEnabled("business phone number")}
            />
          </div>

        </div>
      </section>
    </DefaultLayout>
  );
}
export default SignUp;
