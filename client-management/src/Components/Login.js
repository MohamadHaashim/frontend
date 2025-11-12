import { click } from "@testing-library/user-event/dist/click";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import Url from "../Api/Url";
import { Spinner } from "react-bootstrap";
import { FadeLoader } from 'react-spinners';
function Login() {
  const Navigate = useNavigate();

  const [submit, setSubmit] = useState(false)

  // Login Create Usestate Method
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // State to track loading status during login
  const [loading, setLoading] = useState(true)


  // form resetBtn function
  const reset = () => {
    // setSubmit(false)
    setEmail("")
    setPassword("")
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, [])




  const clientLogin = async (e) => {
    e.preventDefault();
    setSubmit(true);

    if (!email || !password || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    if (password.length < 3) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');

      // Your login logic
      const response = await fetch(
        Url.start + Url.login,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            loginType: "admin",
            user_name: email,
            password: password,
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok && responseData.apiStatus.code === "200") {
        Navigate("/Dashboard");
        localStorage.setItem("userId", responseData.responseData.userDetail.loginid);
        localStorage.setItem("token", responseData.responseData.token);
        localStorage.setItem("userName", responseData.responseData.userDetail.userName);
        localStorage.setItem("id", responseData.responseData.userDetail.loginid);


        toast.success(responseData.apiStatus.message);

      } else {
        toast.error(responseData.apiStatus.message);
      }
    } catch (error) {
      console.error("Error handled=" + error);
      setErrorMessage('Failed to connect to the server. Please try again later.');
    }
    finally {
      setLoading(false);
      setSubmit(false);
    }
  };



  // Password Eyes
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
      <main>
        <div class="container">
          <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div class="container">

              <div class="row justify-content-center">

                <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                  <div class="d-flex justify-content-center py-4">
                    <a

                      class="logo d-flex align-items-center w-auto"
                    >
                      <img src="assets/img/logo.png" alt="" />
                     
                      <span class="d-none d-lg-block">Client Management</span>
                    </a>
                  </div>
                  {/* <!-- End Logo --> */}

                  <div class="card mb-3">
                    <div class="card-body">

                      {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>

                          <FadeLoader color="#36d7b7" />
                        </div>
                      ) : <><div class="pt-4 pb-2">
                        <h5 class="card-title text-center pb-0 fs-4">
                          Login to Your Account
                        </h5>
                        <p class="text-center small">
                          Enter your username & password to login
                        </p>
                      </div><form class="row g-2 needs-validation" novalidate>
                          <div class="col-12">
                            <label class="form-label">
                              Username
                            </label>
                            <input
                              type="text"
                              class="form-control"
                              required
                              onChange={(e) => setEmail(e.target.value)}
                              style={submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
                                ? { borderColor: "red" }
                                : {}} />
                            {submit && email.length === 0 ? (
                              <div className="text-danger">Username is required</div>
                            ) : (
                              <>
                                {submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                                  <div className="text-danger">Invalid email format</div>
                                )}
                              </>
                            )}
                            <div style={{ textAlign: "center" }}>
                              {loading ? <Spinner style={{ width: "5rem", height: "5rem" }} animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </Spinner> : <></>}
                            </div>


                          </div>

                          <div class="col-12">
                            <label class="form-label">
                              Password
                            </label>
                            <div className="password-input-container">
                              <input
                                type={showPassword ? "text" : "password"}
                                class="form-control"
                                required
                                onChange={(e) => setPassword(e.target.value)}

                                style={(submit && password.length == 0) || (submit && password.length < 3) ? { borderColor: "red" } : { borderColor: "" }} />
                              <i
                                className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                                id="togglePassword"
                                onClick={togglePasswordVisibility}

                              ></i>
                            </div>
                            {submit && password.length == 0 ? <div className="text-danger">Password is required</div> : <></>}
                            {submit && password.length < 3 && password.length != 0 ? <div className="text-danger">Password must be 3 charater</div> : <></>}
                          </div>


                          <Link to="/Forgot" style={{ textAlign: "right", fontSize: "14px" }}>Forget Password</Link>
                          <div class="col-12">
                            <button onClick={clientLogin} class="btn btn-primary w-100">


                              Login
                            </button>
                            {loading && <p>Loading...</p>}
                            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                          </div>
                          <div class="col-12">
                            <p class="small mb-0">
                              Don't have account?{" "}
                              <Link to="/Register">Create an account</Link>
                            </p>
                          </div>
                        </form></>
                      }


                    </div>
                  </div>

                  <div class="credits">

                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      {/* <!-- End #main --> */}

    </div>
  );
}

export default Login;
