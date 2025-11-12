import React, { useState } from 'react'
import Navlogo from "../src/assets/img/bizconvo-logo.png"
import { Link, useNavigate } from "react-router-dom";
import DefaultLayout from '../../../layouts/DefaultLayout';
import DefaultFooter from '../../../shared/Default/Footer/defaultFooter';
import { toast } from 'react-toastify';
import LoginAPI from '../../../api/services/loginApi';
import "./superadminLogin.css";
import { Spinner } from 'react-bootstrap';
function SuperAdminLogin() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handlesuperadminLogin = (e: any) => {
    e.preventDefault();
    setSubmit(true);
    if(!password||!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)){
      return
    }
    setLoading(true)
    const apiData = {
      email_id: email,
      password: password
    };
    LoginAPI.sAdminsignInAPI(apiData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === '200') {
          setLoading(false)
          localStorage.setItem("userName", responseData.responseData?.userDetail?.username);
          localStorage.setItem("superAdminToken", responseData.responseData.token);
          navigate("/super-admin/dashboard");
          toast.success(responseData.apiStatus.message);
        } else {
          toast.error(responseData.apiStatus.message);
          setLoading(false)
        }
      })
      .catch((error: any) => {
        setLoading(false)
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
      });
  };

  return (
    <DefaultLayout>

      <main className="main-content  mt-0">
        <section>
          <div className="page-header min-vh-75">
            <div className="container">
              <div className="row">
                <div className="col-xl-4 col-lg-5 col-md-6 text-start d-flex flex-column mx-auto">
                  <div className="card card-plain mt-8">
                    <div className="card-header pb-0 bg-transparent">
                      <h3 className="font-weight-bolder text-info text-gradient">Welcome back</h3>
                      <p className="mb-0">Enter your email and password to sign in</p>
                    </div>
                    <div className="card-body">
                      <form role="form">
                        <label>Email</label>
                        <div className="mb-3">
                          <input autoComplete="off" onChange={(e) => { setEmail(e.target.value); setLoading(false); }} type="email"
                            style={submit && !email || (email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) ? { borderColor: "red" } : { borderColor: "" }}

                            className={`form-control loginfilled-frame-username ${submit && !email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) ? 'error' : ''}`} placeholder="Email" aria-label="Email" aria-describedby="email-addon" />
                          {submit && email.length === 0 ? (
                            <div className="text-danger error-message-required">Email is required</div>
                          ) : (
                            <>
                              {email.length > 0 && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                                <div className="text-danger error-message-required">Invalid email format</div>
                              )}
                            </>
                          )}
                        </div>
                        <label>Password</label>
                        <div className="mb-3 sadmin-passwordInput">
                          <input autoComplete="off" onChange={(e) => { setPassword(e.target.value); setLoading(false); }} type={showPassword ? 'text' : 'password'}
                            className={`form-control loginfilled-frame-username ${submit && !password ? 'error' : ''}`} placeholder="Password" aria-label="Password" aria-describedby="password-addon" />
                          {submit && password.length == 0 ? <div className='text-danger error-message-required'>Password is required</div> : <></>}
                          <i
                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye sadmin-passwordInputicon`}
                            id="togglePassword"
                            onClick={togglePasswordVisibility}
                          ></i>
                        </div>
                        <div className="text-center pt-0 px-lg-2 px-1 mb-4">
                          <p className="text-sm mx-auto m-0 text-end text-small">
                            {/* <Link to={"/super-admin/forgot-password"} className="text-info text-gradient"> Forgot Password</Link> */}
                          </p>
                        </div>
                        <div className="text-center">

                          {loading ? (
                            <button className="btn bg-gradient-info w-100 mt-2 mb-0" type="submit" disabled>
                              <div className="spinner-loading">
                                <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                Loading...
                              </div>
                            </button>
                          ) : (
                            <button className="btn bg-gradient-info w-100 mt-3 mb-0" type="submit" onClick={handlesuperadminLogin}>
                              Login
                            </button>
                          )}


                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 bg-login-query">
                  <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                    <div className="oblique-image login-sadmin bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"></div>
                  </div>
                  <div className="oblique position-absolute top-50 w-50 text-start">
                    <h4 className="mt-5 text-white font-weight-bolder position-relative">
                      Engage Your Customers on <br />WhatsApp Like Never Before <br /> <span className="biz-login-content-side">BIZ CONVO</span>
                    </h4>
                    <p className="login-bg-text-go position-relative">
                      Unlock the full potential of customer engagement with <br /> <span className="biz-login-content-side-1">BIZ CONVO</span> your comprehensive WhatsApp <br /> Marketing Platform.
                    </p>
                  </div>
                </div>  <div className="col-md-6 bg-login-query">
                  <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                    <div className="oblique-image login-sadmin bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"></div>
                  </div>
                  <div className="oblique position-absolute top-50 w-50 text-start">
                    <h4 className="mt-5 text-white font-weight-bolder position-relative">
                      Engage Your Customers on <br />WhatsApp Like Never Before <br /> <span className="biz-login-content-side">BIZ CONVO</span>
                    </h4>
                    <p className="login-bg-text-go position-relative">
                      Unlock the full potential of customer engagement with <br /> <span className="biz-login-content-side-1">BIZ CONVO</span> your comprehensive WhatsApp <br /> Marketing Platform.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>
      <DefaultFooter />
    </DefaultLayout>
  )
}

export default SuperAdminLogin