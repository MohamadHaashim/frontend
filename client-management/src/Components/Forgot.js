import React, { useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import Url from '../Api/Url';

function Forgot() {

  // Create Usestate
  const [email, setEmail] = useState("")
  const [submit, setSubmit] = useState(false)
  const [loading, setLoading] = useState(false)


  // Forgot Api Start
  const forgot = async (e) => {
    e.preventDefault();
    setSubmit(true)
    setLoading(true)
    if (!email) {
      return
    };
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.forgot, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "emailId": email
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.code == "200") {
        toast.success(responceData.message)
      }
      else {
        toast.error(responceData.message)
      }
      setSubmit(false)
      setLoading(false)

    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // Resent Api Start
  
  const resend = async (e) => {
    e.preventDefault();
    setSubmit(true)
    if (!email) {
      return
    };
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.resendMail, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "emailId": email
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      if (responceData.code == "200") {
        toast.success(responceData.message)
      }
      else {
        toast.error(responceData.message)
      }
      setSubmit(false)

    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  return (
    <div>
      <main>
        <div class="container">
          <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center hhh">
                  <div class="d-flex justify-content-center py-4">
                    <a
                      href="index.html"
                      class="logo d-flex align-items-center w-auto"
                    >

                      <span class="d-none d-lg-block">Forgot Password</span>
                    </a>
                  </div>
                  {/* <!-- End Logo --> */}

                  <div class="card mb-3">
                    <div class="card-body">


                      <form class="row g-3 needs-validation" novalidate>



                        <div class="col-12">
                          <label class="form-label">
                            Email
                          </label>
                          <input
                            type="text"
                            class="form-control"

                            onChange={(e) => setEmail(e.target.value)}
                            style={
                              submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
                                ? { borderColor: "red" }
                                : {}
                            }
                          />
                          {submit && email.length === 0 ? (
                            <div className="text-danger">Email is required</div>
                          ) : (
                            <>
                              {submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                                <div className="text-danger">Invalid email format</div>
                              )}
                            </>
                          )}
                        </div>

                        {/* <Link to="/Login" style={{textAlign:"right",fontSize:"14px"}}>Sign In </Link> */}
                        <div class="col-12">
                          {loading ?

                            <button class="btn btn-primary w-100">
                              <div style={{ display: "inline", textAlign: "center" }}>
                                <Spinner

                                  as="span"
                                  animation="grow"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                /> 
                                Loading...
                              </div>
                            </button>

                            : <button onClick={forgot} class="btn btn-primary w-100">
                              Submit
                            </button>}
                          <span>

                          </span>




                        </div>
                        <div class="col-6">
                          <p class="small mb-0">
                            Didn't receive mail?{" "}
                            <Link onClick={resend} >Resend Mail</Link>
                          </p>
                        </div>
                        <div class="col-6">
                          <p style={{ float: "right", marginRight: "3px" }} class="small mb-0">
                            Back to <br></br>
                            <Link to="/Login">Sign In</Link>
                          </p>
                        </div>
                      </form>
                      {/* style={{float:"right",marginLeft:"5px"}}  */}

                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Forgot
