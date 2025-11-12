import React, { Component, useState } from "react";

import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./index.css";
import { Spinner } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../Graphql/Queries";
import { toast } from "react-toastify";
import { MEDIA_URL } from "../../../Graphql/apolloClient";



const RegisterPasswordForm: React.FC = () => {
  const Navigate = useNavigate();
  const [redirect, setRedirect] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false)
  const [register] = useMutation(REGISTER_MUTATION);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };
  const isFormValid = () => {
    return password && confirmPassword;
  };

  const location = useLocation();
  const companyData = location.state;
  console.log(companyData, "dataComp");


  const companyId = process.env.REACT_APP_COMPANY_ID;


  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


  //Register Password Api Intergration

  const handleRegisterPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(companyData, "Data");


    if (!password && !confirmPassword) {
      setSubmit(true);
      return;
    }


    if (!passwordRegex.test(password)) {

      setSubmit(true);
      return;
    }


    if (password !== confirmPassword) {
      setSubmit(true);
      return;
    }

    setSubmit(true);
    setLoading(true);

    try {
      const { data } = await register({
        variables: {

          input: {
            login: companyData.userData.userName,
            firstName: companyData.userData.firstName,
            lastName: companyData.userData.lastName,
            email: companyData.userData.email,
            activated: false,
            langKey: "en",
            password: password,
            accountType: "EXTERNAL",
            companyType: "MEDIA_BUYERS",
            platform: "ECOMMERCE",
            userCompanyAddress: companyData.userCompanyAddress || "No Address Provided",
            phone: companyData.userData.mobileNumber,
            jobTitle: companyData.jobTitle || "No Job Title",
            userCountry: companyData.country || "Unknown Country",
            userCity: companyData.state || "Unknown City",
            industry: companyData.industry || "No Industry",
            rejectReason: "",
            ecommerceDomainName: MEDIA_URL,
            userCompanyName: companyData.userCompanyName,
            userCompanyId: companyData.contactNumber,
            userCompanyPhoneNumber: companyData.selectedCountryDialingCode + companyData.userCompanyPhoneNumber || "No Phone Number",
            admin: false,
            companyId: companyId || 'N/A',
          },



        },
      });

      if (data && data.adduser && data.adduser.message === "success") {
        toast.success("User registered successfully");
        Navigate(`${process.env.REACT_APP_BASE_PATH}/sign-in`);
        setSubmit(false);
        setLoading(false);

      }
      else if (data && data.adduser && data.adduser.message === "error.validation") {
        toast.error("Validation error occurred. Please check the input data.");
      }
      else if (data && data.adduser && data.adduser.message === "login already in use") {
        toast.error("login already in use.");
      }
      else if (data && data.adduser && data.adduser.message === "email already in use") {
        toast.error("email already in use.");
      }
      else {

        setLoading(false);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
      setSubmit(false);
    }
  };

  return (
    <>
      <form>
        <div className="register-password-form">
          <h4 className="register-password-form-headline">Set your password</h4>

          <div className="register-password-hatimbig-parent">
            <input
              className="register-password-hatimbig"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              id="passwordInput"
              name="username"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <div
              className={`loginfilled-frame-username ${submit && !password ? 'error' : ''}`}
            ></div>

            <i
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye`}
              id="togglePassword"
              onClick={togglePasswordVisibility}

            ></i>

            <div
              className={`register-password-frame-password ${submit && (!password || password.length < 8 || !passwordRegex.test(password)) ? 'error' : ''}`}
            ></div>
            {submit && password.length == 0 ? <div className='text-danger error-message-required'>Password is required</div> : <></>}
            {password.length > 0 && !passwordRegex.test(password) && (
              <div className='text-danger error-message-required'>
                Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
              </div>
            )}

          </div>

          <div className="register-password-hatimbig-parent">
            <input
              className="register-password-hatimbig"
              placeholder="Confirm Password"
              type={showPassword1 ? 'text' : 'password'}
              id="cpassword"
              name="username"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
            />
            <i
              className={`fas ${showPassword1 ? 'fa-eye-slash' : 'fa-eye'} password-eye`}
              id="togglePassword"
              onClick={togglePasswordVisibility1}

            ></i>
            <div
              className={`register-password-frame-cpassword ${submit && (confirmPassword.length === 0 || confirmPassword !== password) ? 'error' : ''}`}
            ></div>
            {submit && confirmPassword.length === 0 && <div className='text-danger error-message-required'>Confirm Password is required</div>}
            {confirmPassword !== password && confirmPassword.length !== 0 && <div className='text-danger error-message-required'>Password and confirm password should be same</div>}


          </div>


          <div className="loginfilled-login-btn reg-password-btn">
            <button
              onClick={handleRegisterPassword}

              type="submit"
              disabled={!isFormValid()}
              className={`${!isFormValid() ? 'disabled' : ''
                }`}  >
              {loading ? (
                <div className="spinner-loading">
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Loading...
                </div>
              ) : (
                "Confirm"
              )}
            </button>
          </div>

          <div className="register-link">
            <span className="loginfilled-not-a-member">
              Already have an account?{" "}
            </span>
            <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} className="loginfilled-register-now" id="signup-link">
              Login
            </Link>
          </div>
        </div>
      </form>
    </>
  );
};

export default RegisterPasswordForm;
