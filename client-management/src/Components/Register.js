import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Url from '../Api/Url'
import { toast } from 'react-toastify'
function Register() {

  const Navigate = useNavigate();


  // Register Create Usestate Method

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password1, setPassword1] = useState("")
  const [phone, setPhone] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  // Form Validation Method
  const [submit, setSubmit] = useState(false)

  // Phone Validation

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const phone = value.replace(/[^0-9-+()]/g, '');
    setPhone(phone);
  }


  // Register Api Method Start
  const registerBtn = async (e) => {
    e.preventDefault()
    setSubmit(true);
    if (!name || !password || !email || !password1 || !phone || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }


    // setSubmit(true);
    let token = localStorage.getItem("token");

    const response = await fetch(
      Url.start + "api/register",
      {
        method: "POST",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token
        },
        body: JSON.stringify({
          "type": "user",
          "userData": {
            "user_name": name,
            "emailId": email,
            "password": password,
            "confirmPassword": password1,
            "phone": phone
          }
        }),
      }
    );
    try {
      const responceData = await response.json();
      console.log(responceData);
      setSubmit(false)
      if (responceData.apiStatus.code == 200) {
        Navigate("/Login")
        toast.success(responceData.apiStatus.message)
      }
      else {
        toast.error(responceData.apiStatus.message);
      }
    }
    catch (error) {
      console.log("Error handled=" + error);
    }
  }

  // Password Eyes
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='container'>
      <div className='register-page'>
        {/* <!-- End Logo --> */}

        <div class="card mb-3" >
          <div class="card-body">
            <div class="">
              <h5 class="card-title text-center pb-0 fs-4">
                Register Your Account
              </h5>

            </div>

            <form class="row g-3">
              <div class="col-12">
                <label class="form-label">
                  Name
                </label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  value={name}
                  class="form-control"
                  required
                  style={submit && name.length == 0 ? { borderColor: "red" } : { borderColor: "" }}
                />
                {submit && name.length == 0 ? <div className='text-danger'>Name is required</div> : <></>}
              </div>
              <div class="col-12">
                <label class="form-label">
                  Email
                </label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  value={email}
                  class="form-control"
                  required
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
              <div class="col-12">
                <label class="form-label">
                  Password
                </label>
                <div class='password-input-container'>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    class="form-control"
                    required
                    style={submit && password.length == 0 && password < 3 ? { borderColor: "red" } : { borderColor: "" }}
                  />
                  <i
                    className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                    // id="togglePassword"
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
                <div class='password-input-container'>
                  <input
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    class="form-control"
                    required
                    // style={submit&&(password1.length==0)?{borderColor:"red"}:{borderColor:""}}
                    style={submit && (password1.length === 0 || password1 !== password || password1.length < 3) ? { borderColor: "red" } : {}}
                  />
                  <i
                    className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                    // id="togglePassword"
                    onClick={togglePasswordVisibility}

                  ></i>
                </div>

                {submit && password1.length === 0 && <div className='text-danger'>Confirm Password is required</div>}
                {submit && password1.length < 3 && password1.length != 0 ? <div className="text-danger">Password must be 3 charater</div> : <></>}
                {submit && password1 !== password && password1.length !== 0 && <div className='text-danger'>Password and confirm password should be same</div>}
              </div>

              <div class="col-12">
                <label class="form-label">
                  Phone
                </label>
                <input
                  value={phone}

                  onChange={handlePhoneChange}
                  type="text"
                  class="form-control"
                  maxLength="12"
                  required

                  style={
                    submit && (phone.length < 10 || phone.length === 0)
                      ? { borderColor: 'red' }
                      : {}
                  }
                />
                {submit && phone.length == 0 ? <div className='text-danger'>Phone number is required</div> : <></>}
                {submit && phone.length < 10 && phone.length > 0 && (
                  <div className="text-danger">Phone number should be at least 10 digits</div>
                )}
              </div>
              <div class="col-12">
                <button onClick={registerBtn} class="btn btn-primary w-100">
                  Register
                </button>
              </div>

              <div class="col-12">
                <p class="small mb-0">
                  Already have an account?{" "}
                  <Link to="/Login" >Sign In</Link>
                </p>
              </div>
            </form>


          </div>
        </div>


      </div>
    </div>
  )
}

export default Register
