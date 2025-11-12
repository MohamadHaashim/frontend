import React, { Component, useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate } from "react-router-dom";
import LogoImage from "../../assets/brand/your-logo.svg";
import './index.css'
import CompanyDetailsForm from "../../components/company-details/form";
interface FormState {
  redirect: string | null,
}
const CompanyDetails = () => {
  const [config, setConfig] = useState<any[]>([]);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const data = await response.json();
        const companyDetailsConfig = data.find((page: any) => page.name === "User Registration")?.configurations.find((c: any) => c.key === "basicInformation");
        if (companyDetailsConfig) {
          setConfig(companyDetailsConfig.fields);
        }
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);
  const [yourLogo, setyourLogo] = useState<string>("");
  const [content, setContent] = useState<any[]>([]);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "Landing Page");
        setContent(value.fields);
        const yourLogoImg = value.fields.find((field: any) => field.components && field.components.some((comp: { title: string; }) => comp.title === "General settings"));
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
      <section className="container login-basic-height-details companyDetails-height">
        <div className="row">
          <div className="col-md-6 login-leftside">

            <img className='logo-style loginfilled-your-logo-icon' src={yourLogo} alt="yourLogo" />

            <h1 className="loginfilled-welcome-to-outfront-container font">
              <p className="loginfilled-welcome-to">Welcome to</p>
              <p className="loginfilled-outfront-media">OutFront Media</p>
            </h1>

            <h1 className="company-details-run-your-next">
              Run your next outdoor Advertising campaign with just a few clicks
            </h1>
          </div>
          <div className="col-md-6 login-rightside companyDetails-rightside">
            <CompanyDetailsForm
              companyNameInput={isFieldEnabled("company name")}
              designationInput={isFieldEnabled("designation")}
              phoneCountryCodeInput={isFieldEnabled("phone number with Country Code")}
              phoneNoInput={isFieldEnabled("business phone number")}
            />
          </div>

        </div>
      </section>
    </DefaultLayout>
  );
}
export default CompanyDetails;
