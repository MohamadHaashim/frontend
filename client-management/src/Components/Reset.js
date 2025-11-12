import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Url from '../Api/Url'

function Reset() {
  const [password, setPassword] = useState("")
  const [password1, setPassword1] = useState("")
  const [submit, setSubmit] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [header, setHeader] = useState("")
  const [error, setError] = useState(true)

  const navigate = useNavigate("")

  useEffect(() => {

    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    console.log(myArray[2]);
    var token = myArray[2]

    if (token) {
      // Call validate API
      validate(token);

      // Update header
      setHeader(token);
    }
    // validate(token)
  }, [])



  // Reset Api Start

  const reset = async (e) => {
    e.preventDefault();
    setSubmit(true)   
    if (!password || !password1) {
      return;
    }
    // console.log("fgctyfty");
    // let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.reset + header, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        // Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "newPassword": password,
        "confirmPassword": password1,
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);


      if (responceData.code == "200") {
        toast.success(responceData.message)
        navigate("/Login")
        setSubmit(false)
      }
      else {
        toast.error(responceData.message)
      }

    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // Valid Token

  const validate = async (token) => {

    const response = await fetch(Url.start + Url.validEmail, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        // Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "token": token
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);

      if (responceData.code == "200") {
        toast.success(responceData.message)
        setError(true)

      }
      else {
        toast.error(responceData.message)
        setError(false)
      }


    } catch (error) {
      console.log("Error handled =" + error);
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
          <section class="sss section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">


                  {error ? <><div class="d-flex justify-content-center py-4">

                    <a

                      class="logo d-flex align-items-center w-auto"
                    >

                      <span class="d-none d-lg-block">Reset Password</span>
                    </a>
                  </div>
                    <div class="card mb-3">
                      <div class="card-body">


                        <form class="row  g-3 needs-validation" novalidate>
                          <div class="col-12 reset">
                            <label class="form-label">
                              Password
                            </label>
                            <div className='password-input-container'>
                              <input
                                value={password}
                                type={showPassword ? "text" : "password"}
                                class="form-control"
                                style={submit && password.length == 0 && password < 3 ? { borderColor: "red" } : { borderColor: "" }}
                                onChange={(e) => setPassword(e.target.value)} />
                              <i
                                className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                                id="togglePassword"
                                onClick={togglePasswordVisibility}

                              ></i>
                            </div>

                            {submit && password.length == 0 ? <div className='text-danger'>Password is required</div> : <></>}
                            {submit && password.length < 3 && password.length != 0 ? <div className="text-danger">Password must be 3 charater</div> : <></>}
                          </div>
                          <div class="col-12">
                            <label class="form-label">
                              Confirm Password
                            </label>
                            <div className='password-input-container'>
                              <input
                                value={password1}
                                type={showPassword ? "text" : "password"}
                                class="form-control"
                                onChange={(e) => setPassword1(e.target.value)}
                                style={submit && (password1.length === 0 || password1 !== password || password1.length < 3) ? { borderColor: "red" } : {}} />
                              <i
                                className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                                id="togglePassword"
                                onClick={togglePasswordVisibility}

                              ></i>
                            </div>

                            {submit && password1.length === 0 && <div className='text-danger'>Confirm Password is required</div>}
                            {submit && password1.length < 3 && password1.length != 0 ? <div className="text-danger">Password must be 3 charater</div> : <></>}
                            {submit && password1 !== password && password1.length !== 0 && <div className='text-danger'>Password and confirm password should be same</div>}
                          </div>



                          <div class="col-12">
                            <button style={{ marginTop: "10px" }} onClick={reset} class="btn btn-primary w-100">
                              Submit
                            </button>

                          </div>
                          <div class="col-12">
                            <p style={{ float: "right", marginRight: "3px" }} class="small mb-0">
                              Back to
                              <Link style={{ marginLeft: "5px" }} to="/Login">Sign In</Link>
                            </p>
                          </div>

                        </form>


                      </div>
                    </div></> :
                    <div class="card mb-3">
                      <div class="card-body">
                        Forgot password link is already expired. Please click on the below button to resent the new link.
                        <button style={{ marginTop: "15px" }} onClick={() => navigate("/Forgot")} class="btn btn-primary w-100">
                          Resend Link
                        </button>
                      </div>
                    </div>
                  }

                </div>

              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Reset
