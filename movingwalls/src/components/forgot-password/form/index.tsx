import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import './index.css';
import { useMutation } from "@apollo/client";
import { FORGET_PASSWORD } from "../../../Graphql/Queries";
import { toast } from "react-toastify";
import { Spinner } from "react-bootstrap";
import { REACT_APP_PLATFORM_BASE_URL } from "../../../Graphql/apolloClient";

const ForgotPasswordForm: React.FC = () => {
  const [forgot, { data, loading, error }] = useMutation(FORGET_PASSWORD);
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState<string | null>(null);
  const [submit, setSubmit] = useState(false);
  const token = localStorage.getItem('authToken');
  const publisherId = process.env.REACT_APP_COMPANY_ID;
  const navigate = useNavigate();


  const handleBackToLogin = () => {
    setRedirect(true);
  };

  const isFormValid = () => {
    return email;
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    setSubmit(true)
    try {
      const { data } = await forgot({
        variables: {
          email,
          platformSource: "ECOMMERCE",
          platformBaseUrl: REACT_APP_PLATFORM_BASE_URL,
          publisherId: publisherId
        }
      });

      if (data && data.forgetPassword) {
        const message = data.forgetPassword.message;
        setSubmit(false)
        if (message === "Provided email address is not registered") {
          toast.error("The email address is not registered. Please check and try again.");
        } else if (message === "error.validation") {
          toast.error("An error occurred. Please try again.");
        } else {
          toast.success(message);
          setRedirectLogin(`${process.env.REACT_APP_BASE_PATH}/sign-in`)
        }
      }



    } catch (error) {
      console.error("Error sending password reset link:", error);
      toast.error("Failed to send password reset link. Please try again.");
    }
  };

  if (redirect) {
    return <Navigate to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} />;
  }
  else if (redirectLogin) {
    return <Navigate to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} />
  }

  return (
    <>
      <form >
        <div className="loginfilled-login-form-parent">
          <div className="image-bg-style">
            <div className='card cart-bg-style'>
              <div className="right-side-alignment">
                <h4 className="loginfilled-please-enter-your">Forgot Password?</h4>
                {error && <div className="error-message">{error.message}</div>}
                <div className="loginfilled-hatimbig-parent username-input-top">
                  <input
                    className="loginfilled-hatimbig"
                    placeholder="Enter your email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div
                    className={`forgot-underline-border ${submit && !email || (email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? 'error' : ''}`}
                  ></div>

                  {submit && email.length === 0 ? (
                    <div className="text-danger error-message-required">Email is required</div>
                  ) : (
                    <>
                      {email.length > 0 && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                        <div className="a-link-send-message"><svg style={{ marginTop: "-5px" }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5C15.2467 0.5 19.5 4.7533 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.7533 19.5 0.5 15.2467 0.5 10Z" fill="white" />
                          <path d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5C15.2467 0.5 19.5 4.7533 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.7533 19.5 0.5 15.2467 0.5 10Z" fill="white" />
                          <path d="M0.5 10C0.5 4.7533 4.7533 0.5 10 0.5C15.2467 0.5 19.5 4.7533 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.7533 19.5 0.5 15.2467 0.5 10Z" stroke="#5A5A5A" />
                          <path d="M9.48625 8.6876H10.5578C10.816 8.6876 10.971 8.80377 10.971 9.06196C10.971 9.26856 10.9452 9.48802 10.9065 9.69462C10.7644 10.4693 10.6224 11.2569 10.4804 12.0315C10.4288 12.2897 10.3771 12.5479 10.3513 12.8062C10.3384 12.9353 10.3513 13.0644 10.39 13.1805C10.4287 13.3484 10.5579 13.4387 10.7256 13.4129C10.8677 13.4 10.9968 13.3483 11.1388 13.2967C11.2421 13.258 11.3454 13.1805 11.4487 13.1418C11.6036 13.0772 11.7456 13.1934 11.6941 13.3484C11.6682 13.4388 11.6166 13.542 11.5391 13.6066C11.1389 14.0068 10.6613 14.2521 10.0932 14.2521C9.82199 14.2521 9.56379 14.2521 9.29271 14.2134C8.85376 14.1488 8.29855 13.6066 8.376 13.0385C8.4276 12.6383 8.49217 12.2509 8.55674 11.8636C8.67292 11.1793 8.78909 10.4951 8.91824 9.8108C8.93112 9.77207 8.93112 9.72038 8.93112 9.68165C8.93112 9.39762 8.8407 9.29431 8.55676 9.2556C8.44058 9.24272 8.31143 9.22975 8.19525 9.19102C8.05323 9.13942 7.98866 9.03612 8.00163 8.91985C8.01451 8.80367 8.09205 8.72623 8.24696 8.70038C8.32441 8.6875 8.41482 8.6875 8.49228 8.6875C8.81496 8.68759 9.15062 8.68759 9.48626 8.68759L9.48625 8.6876Z" fill="#014DC0" />
                          <path d="M10.1209 6C10.7277 6 11.2054 6.49063 11.2054 7.11033C11.2054 7.71714 10.7148 8.2078 10.1209 8.2078C9.5141 8.2078 9.02344 7.70428 9.02344 7.09747C9.02344 6.49066 9.51407 6 10.1209 6Z" fill="#014DC0" />
                        </svg> A link will be sent to your email ID to reset your password</div>
                      )}
                      {email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                        <div className="text-danger">Invalid email format</div>
                      )}
                    </>
                  )}
                </div>
                <div className="loginfilled-login-btn forgot">
                  <button
                    onClick={handleSubmit}

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
                      "Send Link"
                    )}
                  </button>
                </div>

                <div className="forgot-login-btn">
                  <button type="button" onClick={handleBackToLogin}>Back to login</button>
                </div>

                <div className="register-link">
                  <span className="forgot-not-a-member">Not a member yet? </span>
                  <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-up`} className="loginfilled-register-now" id="signup-link">Register now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ForgotPasswordForm;
