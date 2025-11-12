import React, { Component, useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate } from "react-router-dom";
import LogoImage from "../../assets/brand/your-logo.svg";
import SignInForm from "../../components/sign-in/form";
import client from "../../Graphql/apolloClient";
import { Get_Currency_Code_Details } from "../../Graphql/Queries";
interface FormState {
  redirect: string | null,
}
interface SignInProps {
  setCurrencyCode: React.Dispatch<React.SetStateAction<string>>;
}

const SignIn: React.FC<SignInProps> = ({ setCurrencyCode }) => {
  const [config, setConfig] = useState<any[]>([]);
  const [country, setCountry] = useState<string>('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const data = await response.json();
        const loginConfig = data.find((page: any) => page.name === "User Registration")?.configurations.find((c: any) => c.key === "login");

        if (loginConfig) {
          setConfig(loginConfig.fields);
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
  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry);
  };
  useEffect(() => {
    if (country) {
      fetchCurrencyCode();
    }
  }, [country]);

  const fetchCurrencyCode = async () => {
    const variables = {
      countryCurrencyCode: country
    };
    try {
      const { data } = await client.query({
        query: Get_Currency_Code_Details,
        variables,
      });
      const { country, currencyCode } = data.currencyCodeDetails;
      setCurrencyCode(currencyCode);
      localStorage.setItem("currencyCode", data.currencyCodeDetails.currencyCode)
    } catch (err) {
      console.error("Fetch Content Error:", err);
    }
  }


  return (
    <DefaultLayout>
      <section className="container login-basic-height-details">
        <div className="row">
          <div className="col-md-6 login-leftside">

            <img className='logo-style loginfilled-your-logo-icon' src={yourLogo} alt="edde" />

            <h1 className="loginfilled-welcome-to-outfront-container font">
              <p className="loginfilled-welcome-to">Welcome to</p>
              <p className="loginfilled-outfront-media">OutFront Media</p>
            </h1>

            <h1 className="loginfilled-run-your-next">
              Run your next outdoor Advertising campaign with just a few clicks
            </h1>
          </div>
          <div className="col-md-6 login-rightside">
            <SignInForm onCountryChange={handleCountryChange}
              usernameInput={isFieldEnabled("username Login")} />
          </div>

        </div>
      </section>
    </DefaultLayout>
  );
}

export default SignIn;
