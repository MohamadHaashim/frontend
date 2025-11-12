import React from 'react'
import Navlogo from "../../../assets/img/bizconvo-logo.png"
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from 'react-router-dom';
import DefaultLayout from '../../../layouts/DefaultLayout';
import DefaultFooter from '../../../shared/Default/Footer/defaultFooter';

function ForgotPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleVendorLogin = (e: any) => {
    e.preventDefault();
    navigate("/vendor/dashboard", { replace: true });
  };
  const handleForgot = () => {
    if (location.pathname === "/super-admin/forgot-password") {
      navigate("/super-admin/sign-in");
    }
    else {
      navigate("/");
    }
  }
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
                      <h3 className="font-weight-bolder text-info text-gradient">Forgot Password</h3>
                      <p className="mb-0">Enter your email Id</p>
                    </div>
                    <div className="card-body">
                      <form role="form" onSubmit={handleVendorLogin}>
                        <label>Email</label>
                        <div className="mb-3">
                          <input type="email" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="email-addon" />
                        </div>

                        <div className="text-center pt-0 px-lg-2 px-1">
                          <p className="text-sm mx-auto m-0 text-end text-small">Back to <Link to="#" onClick={(e) => { e.preventDefault(); handleForgot(); }} className="text-info text-gradient font-weight-bold">
                            Login
                          </Link>

                          </p>
                        </div>
                        <div className="text-center">
                          <button type="submit" className="btn bg-gradient-info w-100 mt-2 mb-0">Submit</button>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-5 mt-2 text-sm mx-auto">
                        {/* Don't have an account?
                        <Link to={"/sign-up"} className="text-info text-gradient font-weight-bold"> Sign up</Link> */}
                      </p>
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

export default ForgotPassword;