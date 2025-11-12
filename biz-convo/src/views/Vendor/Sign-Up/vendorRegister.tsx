import React, { useState } from "react";
import Navlogo from "../../../assets/img/curved-images/curved14.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import LoginAPI from "../../../api/services/loginApi";
import { toast } from "react-toastify";
import "./vendorRegister.css"
function VendorRegister() {
  const [companyName, setcompanyName] = useState('')
  const [type, setType] = useState('')
  const [address, setAddress] = useState('')
  const [mobileno, setMobileno] = useState('')
  const [email, setEmail] = useState('')
  const [userName, setuserName] = useState('')
  const [firstName, setfirstName] = useState('')
  const [lasttName, setlasttName] = useState('')
  const [usermobileno, setusermobileno] = useState('')
  const [userEmail, setuserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setconfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handlePhoneChange = (e: { target: { value: string } }) => {
    let value = e.target.value;
    if (value === "" || /^\+?[0-9]*$/.test(value)) {
      setMobileno(value);
    }
  };
  const isValidPhoneNumber = (number: string): boolean => {
    const phoneRegex = /^\+[1-9][0-9]{1,14}$/;
    return phoneRegex.test(number);
  };
  const handlesuperadminLogin = (e: any) => {
    e.preventDefault();
    if (!password && !confirmpassword) {
      setSubmit(true);
      return;
    }
    if (password !== confirmpassword) {
      setSubmit(true);
      return;
    }
    setLoading(true)
    const apiData = {
      company_name: companyName,
      type: type,
      address: address,
      phone: mobileno,
      email: email,
      userData: {
        first_name: firstName,
        last_name: lasttName,
        username: userName,
        email_id: userEmail,
        password: password,
        confirmPassword: confirmpassword,
        phone: usermobileno
      }
    };
    LoginAPI.signupAPI(apiData)
      .then((responseData: any) => {
        if (responseData.apiStatus.code === '200') {
          setLoading(false)
          toast.success(responseData.apiStatus.message);
          navigate("/");
        } else {
          toast.error(responseData.apiStatus.message);
          // setLoading(false)
        }
      })
      .catch((error: any) => {
        setLoading(false)
        console.error("Error during login:", error);
        toast.error("An error occurred during login.");
      });
  };
  return (
    <>
      <main className="main-content  mt-0">
        <section className="min-vh-100 mb-8">
          <div className="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg" style={{ backgroundImage: `url(${Navlogo})` }}>
            <span className="mask bg-gradient-dark opacity-6"></span>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-5 text-center mx-auto">
                  <h3><i className="text-white fa-solid fa-store"></i></h3>
                  <h3 className="text-white">Register as Vendor/Company</h3>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="row mt-lg-n10 mt-md-n11 mt-n10">
              <div className="col-xl-7 col-lg-5 col-md-7 mx-auto">
                <div className="card z-index-0">
                  <div className="card-header text-center pt-4">
                  </div>
                  <div className="card-body">
                    <form role="form text-left">
                      <div className="row">
                        <div className="mb-3">
                          <input autoComplete="off" onChange={(e) => setcompanyName(e.target.value)} type="text" className={`form-control loginfilled-frame-username ${submit && !companyName ? 'error' : ''}`} placeholder="Comapny Name" aria-label="Comapny Name" aria-describedby="email-addon" required />
                          {submit && companyName.length == 0 ? <div className='text-danger error-message-required'>Company name is required</div> : <></>}
                        </div>
                        <div className="mb-3 col-md-6">
                          <input autoComplete="off" onChange={(e) => setType(e.target.value)} type="email" className={`form-control loginfilled-frame-username ${submit && !type ? 'error' : ''}`} placeholder="Category Type" aria-label="Type" aria-describedby="email-addon" required />
                          {submit && type.length == 0 ? <div className='text-danger error-message-required'>Category type is required</div> : <></>}
                        </div>
                        <div className="mb-3 col-md-6">
                          <input autoComplete="off" onChange={(e) => setAddress(e.target.value)} type="email" className={`form-control loginfilled-frame-username ${submit && !address ? 'error' : ''}`} placeholder="Address" aria-label="Address" aria-describedby="email-addon" required />
                          {submit && address.length == 0 ? <div className='text-danger error-message-required'>Address is required</div> : <></>}
                        </div>
                        <div className="mb-3 col-md-6">
                          <input
                            onChange={handlePhoneChange}
                            maxLength={15}
                            type="text"
                            className={`form-control loginfilled-frame-username ${submit && !mobileno ? 'error' : ''}`}
                            placeholder="Mobile Number"
                            aria-label="Mobile Number"
                            aria-describedby="email-addon"
                            required
                          />
                          {/* {mobileno.length > 0 && !isValidPhoneNumber(mobileno) && (
                            <div className="text-danger error-message-required">
                              Mobile number should include a valid country code.
                            </div>
                          )} */}
                          {submit && mobileno.length === 0 && (
                            <div className='text-danger error-message-required'>Mobile.no is required</div>
                          )}
                        </div>
                        <div className="mb-3 col-md-6">
                          <input autoComplete="off" onChange={(e) => setEmail(e.target.value)} type="email" className={`form-control loginfilled-frame-username ${submit && !email ? 'error' : ''}`} placeholder="Email" aria-label="Email" aria-describedby="email-addon" required />
                          {submit && email.length == 0 ? <div className='text-danger error-message-required'>Email is required</div> : <></>}
                        </div>

                        <span className="mb-3 mt-2 text-center"><u><b>Vendor Admin User</b></u></span>
                        <div className="mb-3">
                          <input autoComplete="off" onChange={(e) => setuserName(e.target.value)} type="text" className={`form-control loginfilled-frame-username ${submit && !userName ? 'error' : ''}`} placeholder="Username" aria-label="Username" aria-describedby="email-addon" required />
                          {submit && userName.length == 0 ? <div className='text-danger error-message-required'>User name is required</div> : <></>}
                        </div>
                        <div className="mb-3 col-md-6">
                          <input autoComplete="off" onChange={(e) => setfirstName(e.target.value)} type="text" className={`form-control loginfilled-frame-username ${submit && !firstName ? 'error' : ''}`} placeholder="First Name" aria-label="First Name" aria-describedby="email-addon" required />
                          {submit && firstName.length == 0 ? <div className='text-danger error-message-required'>First name is required</div> : <></>}
                        </div>
                        <div className="mb-3 mt-2 col-md-6">
                          <input autoComplete="off" onChange={(e) => setlasttName(e.target.value)} type="text" className="form-control" placeholder="Last Name" aria-label="Last Name" aria-describedby="email-addon" />
                        </div>
                        <div className="mb-3 col-md-6">
                          <input autoComplete="off" onChange={(e) => setusermobileno(e.target.value)} type="email" className={`form-control loginfilled-frame-username ${submit && !usermobileno ? 'error' : ''}`} placeholder="Mobile Number" aria-label="Mobile Number" aria-describedby="email-addon" required />
                          {submit && usermobileno.length == 0 ? <div className='text-danger error-message-required'>Mobile.no is required</div> : <></>}
                        </div>
                        <div className="mb-3 col-md-6">
                          <input autoComplete="off" onChange={(e) => setuserEmail(e.target.value)} type="email" className={`form-control loginfilled-frame-username ${submit && !userEmail ? 'error' : ''}`} placeholder="Email" aria-label="Email" aria-describedby="email-addon" required />
                          {submit && userEmail.length == 0 ? <div className='text-danger error-message-required'>Email is required</div> : <></>}
                        </div>
                        <div className="mb-3 col-md-6 vendor-passwordInput">
                          <input autoComplete="off" onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} className={`form-control loginfilled-frame-username ${submit && !password ? 'error' : ''}`} placeholder="Password" aria-label="Password" aria-describedby="password-addon" required />
                          {submit && password.length == 0 ? <div className='text-danger error-message-required'>Password is required</div> : <></>}
                          <i
                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye vendor-passwordInputicon`}
                            id="togglePassword"
                            onClick={togglePasswordVisibility}
                          ></i>
                        </div>
                        <div className="mb-3 col-md-6 vendor-passwordInput">
                          <input autoComplete="off" onChange={(e) => setconfirmPassword(e.target.value)} type={showConfirmPassword ? 'text' : 'password'} 
                          style={
                            submit && confirmpassword.length === 0
                              ? { borderColor: "red" }
                              : confirmpassword.length !== 0 && confirmpassword !== password
                              ? { borderColor: "red" }
                              : {}
                          } 
                          className={`form-control loginfilled-frame-username`} placeholder="Confirm Password" aria-label="Confirm Password" aria-describedby="password-addon" required />
                          {submit && confirmpassword.length == 0 ? <div className='text-danger error-message-required'>Confirm password is required</div> : <></>}
                          {confirmpassword !== password && confirmpassword.length !== 0 && <div className='text-danger error-message-required'>Password and confirm password should be same</div>}
                          <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye vendor-passwordInputicon`}
                            id="togglePassword"
                            onClick={toggleConfirmPasswordVisibility}
                          ></i>
                        </div>
                      </div>
                      <div className="form-check form-check-info text-left">
                        <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          I agree the <a href="javascript:;" className="text-dark font-weight-bolder">Terms and Conditions</a>
                        </label>
                      </div>
                      <div className="text-center">
                        <button type="button" className="btn bg-gradient-dark vendor-registerbtn w-100 my-4 mb-2" onClick={handlesuperadminLogin}>Sign up</button>
                      </div>
                      <p className="text-sm mt-3 mb-0">Already have an account?  <Link to={"/"} className="text-dark font-weight-bolder"> Sign in</Link></p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
export default VendorRegister;