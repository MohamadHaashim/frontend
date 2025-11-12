import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import './index.css';
import { useMutation } from "@apollo/client";
import { REGISTER_MUTATION } from "../../../Graphql/Queries";
import { Spinner } from "react-bootstrap";


const SignUpForm: React.FC<{ firstNameInput: string, lastNameInput: string, emailInput: string, phoneNoInput: string }> = ({ firstNameInput, lastNameInput, emailInput, phoneNoInput }) => {

  const Navigate = useNavigate()
  const [redirect, setRedirect] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false)
  const [register] = useMutation(REGISTER_MUTATION);



  // Phone Validation

  const handlePhoneChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;

    const mobileNumber = value.replace(/[^0-9-+()]/g, '');
    setMobileNumber(mobileNumber);
  }
  const isValidPhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\+[1-9][0-9]{1,14}$/;
    return phoneRegex.test(number);
  };


  const isFormValid = () => {
    return firstName && lastName && mobileNumber && email && userName;
  };

  const nextCompany = () => {
    Navigate(`${process.env.REACT_APP_BASE_PATH}/company-details`)

  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();


    // Validate email format
    if (!firstName || !lastName || !mobileNumber || !userName || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      setSubmit(true);
      return;
    }
    setSubmit(true);

    const userData = {
      firstName,
      lastName,
      mobileNumber,
      email,
      userName,
    };


    Navigate(`${process.env.REACT_APP_BASE_PATH}/company-details`, { state: userData });
  }




  return (
    <>
      <form onSubmit={handleNext}>
        <div className="basic-details-form">
          <h4 className="basic-details-form-headline">Basic details</h4>


          {firstNameInput && (
            <div className="basic-detsils-hatimbig-parent">
              <input
                className="basic-details-hatimbig"
                placeholder="First Name"
                type="text"
                name="fname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <div
                className={`basic-detsils-frame-username ${submit && !firstName ? 'error' : ''}`}
              ></div>
              {submit && firstName.length === 0 ? (
                <div className="text-danger error-message-required">Firstname is required</div>
              ) : <></>}
            </div>
          )}
          {lastNameInput && (
            <div className="basic-detsils-hatimbig-parent">
              <input
                className="basic-details-hatimbig"
                placeholder="Last Name"
                type="text"
                name="lname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              <div
                className={`basic-detsils-frame-lname ${submit && !lastName ? 'error' : ''}`}
              ></div>
              {submit && lastName.length === 0 ? (
                <div className="text-danger error-message-required">Lastname is required</div>
              ) : <></>}
            </div>
          )}
          {phoneNoInput && (
            <div className="basic-detsils-hatimbig-parent">
              <input
                className="basic-details-hatimbig"
                placeholder="Mobile Number"
                type="text"
                name="mnumber"
                value={mobileNumber}
                onChange={handlePhoneChange}
                maxLength={15}
                required
              />
              <div
                className={`basic-detsils-frame-mnumber ${submit &&
                  (!mobileNumber || !isValidPhoneNumber(mobileNumber))
                  ? 'error'
                  : ''
                  }`}
              ></div>

              {mobileNumber.length > 0 && !isValidPhoneNumber(mobileNumber) && (
                <div className="text-danger">
                  Mobile number should include a valid country code.
                </div>
              )}

              {submit && mobileNumber.length === 0 ? (
                <div className="text-danger error-message-required">
                  Mobile number is required
                </div>
              ) : null}
            </div>
          )}
          {emailInput && (
            <div className="basic-detsils-hatimbig-parent">
              <input
                className="basic-details-hatimbig"
                placeholder="Email Id"
                type="text"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <div
                className={`basic-detsils-frame-email ${submit && !email || (email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? 'error' : ''}`}
              ></div>
              {submit && email.length === 0 ? (
                <div className="text-danger error-message-required">Email is required</div>
              ) : (
                <>
                  {email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                    <div className="text-danger">Invalid email format</div>
                  )}
                </>
              )}
            </div>
          )}

          <div className="basic-detsils-hatimbig-parent">
            <input
              className="basic-details-hatimbig"
              placeholder="User Name"
              type="text"
              name="username"
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              required
            />
            <div
              className={`basic-detsils-frame-username ${submit && !userName ? 'error' : ''}`}
            ></div>
            {submit && userName.length === 0 ? (
              <div className="text-danger error-message-required">Username is required</div>
            ) : ""}

          </div>

          <div className="basic-details-register-btn">
            <button
              type="submit"
              disabled={!isFormValid()}
              // className={!isFormValid() ? 'blurred-button' : ''}
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
                "Next"
              )}
            </button>
          </div>

          {/* {error && <div className="error-message">{error}</div>} */}

          <div className="register-link">
            <span className="basic-details-not-a-member">
              Already have an account?{" "}
            </span>
            <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} className="loginfilled-register-now" id="signup-link">Login</Link>
          </div>
        </div>
      </form>
    </>
  );
}







export default SignUpForm;
