import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import { AUTHENTICATE_MUTATION, Get_Currency_Code_Details, Media_Id, USER_ACCOUNT_QUERY } from "../../../Graphql/Queries";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import client from "../../../Graphql/apolloClient";



const SignInForm: React.FC<{ usernameInput: string, onCountryChange: (country: string) => void }> = ({ usernameInput, onCountryChange }) => {
  const [redirect, setRedirect] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submit, setSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authenticate] = useMutation(AUTHENTICATE_MUTATION);
  const companyId = process.env.REACT_APP_COMPANY_ID;





  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmit(true);
    setLoading(true);

    if (!username || !password) {
      toast.error("Username and password are required");
      setSubmit(false);
      setLoading(false);
      return;
    }

    const mediaOwnerCompanyId = companyId;
    const concatenatedUsername = `${username}:${mediaOwnerCompanyId}`;

    try {
      const response = await authenticate({
        variables: {
          username: concatenatedUsername,
          password: password,
        },
      });

      const { data, errors } = response;

      // Handle GraphQL errors explicitly
      if (errors && errors.length > 0) {
        const errorStatus = errors[0]?.extensions?.status_code;
        if (errorStatus === 400) {
          toast.error("Invalid username or password");
          setSubmit(false);
          setLoading(false);
          return;
        }
      }

      // If data is null or authentication fails
      if (!data || !data.authenticate) {
        toast.error("An unexpected error occurred");
        setSubmit(false);
        setLoading(false);
        return;
      }

      const token = data.authenticate.authData.accessToken;
      if (token) {
        setSubmit(false);
        setLoading(false);
        toast.success("Login successful");
        localStorage.setItem("authToken", token);

        // Fetch user account data
        const { data: userData } = await client.query({
          query: USER_ACCOUNT_QUERY,
          variables: {
            accessToken: token,
          },
        });

        if (userData && userData.userAccount) {
          const countryId = userData.userAccount[0].country.id;
          const userId = userData.userAccount[0].id;
          const userNameLogin = userData.userAccount[0].login;
          const userEmail = userData.userAccount[0].email;
          const companyId = userData.userAccount[0].companyId;
          const { firstName, lastName } = userData.userAccount[0];
          const userCountry = userData.userAccount[0].country.name;

          onCountryChange(userCountry);
          localStorage.setItem("userAccountData", JSON.stringify(userData.userAccount));
          localStorage.setItem("countryId", countryId);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userNameLogin", userNameLogin);
          localStorage.setItem("userEmail", userEmail);
          localStorage.setItem("companyId", companyId);
          localStorage.setItem("userName", `${firstName} ${lastName}`);

          setRedirect(`${process.env.REACT_APP_BASE_PATH}/my-campaigns`);
        } else {
          toast.error("Failed to retrieve user details");
        }
      } else {
        toast.error("Invalid username or password");
        setSubmit(false);
        setLoading(false);
      }
    } catch (error: any) {
      if (
        error instanceof ApolloError &&
        error.networkError &&
        "statusCode" in error.networkError &&
        (error.networkError as any).statusCode === 400
      ) {
        toast.error("Invalid username or password");
      } else {
        toast.error("An unexpected error occurred");
      }
      setSubmit(false);
      setLoading(false);
    }
  };



  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <form>
      <div className="loginfilled-login-form-parent">
        <div className="image-bg-style">
          <div className="card cart-bg-style">
            <div className="right-side-alignment">
              <h4 className="loginfilled-please-enter-your">
                Please enter your login and password
              </h4>

              {error && <div className="error-message">{error}</div>}
              {usernameInput && (
                <div className="loginfilled-hatimbig-parent username-input-top">
                  <input
                    className="loginfilled-hatimbig"
                    placeholder="User Name"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.trim())}
                  />
                  <div
                    className={`loginfilled-frame-username ${submit && !username ? 'error' : ''}`}
                  ></div>
                  {submit && username.length === 0 ? (
                    <div className="text-danger error-message-required">Username is required</div>
                  ) : ""
                  }
                </div>
              )}
              <div className="loginfilled-hatimbig-parent">
                <input
                  className="loginfilled-hatimbig"
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="passwordInput"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}

                />
                <div
                  className={`loginfilled-frame-password ${submit && !password ? 'error' : ''}`}
                ></div>

                {submit && password.length === 0 && (
                  <div className="text-danger error-message-required">Password is required</div>
                )}
                <i
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye`}
                  id="togglePassword"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: 'pointer' }}
                ></i>

                <div className="forgot-link">
                  <div className="row">
                    <div className="col-md-12 loginfilled-forget-password">
                      <Link to={`${process.env.REACT_APP_BASE_PATH}/forgot-password`}>Forgot password</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="loginfilled-login-btn">

                {loading ? <button type="submit" onClick={handleLogin}>
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
                </button> : <button type="submit" onClick={handleLogin}>
                  Login
                </button>}


              </div>

              <div className="register-link">
                <span className="loginfilled-not-a-member">Not a member yet? </span>
                <Link to={`${process.env.REACT_APP_BASE_PATH}/sign-up`} className="loginfilled-register-now" id="signup-link">
                  Register now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SignInForm;
