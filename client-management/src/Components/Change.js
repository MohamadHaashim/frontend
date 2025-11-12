import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Url from '../Api/Url';

function Change() {

    const navigate= useNavigate("")
     
     const [password,setPassword]=useState("")
     const [password1,setPassword1]=useState("")
     const [password2,setPassword2]=useState("")
     const [submit,setSubmit]=useState(false)
     
    const [showPassword, setShowPassword] = useState(false);

    // Reset Api Start
     const changee = async (e) => {
        e.preventDefault();
        setSubmit(true)
        if(!password||!password1||!password2){
          return;
          
        }
        // console.log("fgctyfty");
        let token = localStorage.getItem("token");
        const response = await fetch(Url.start + Url.change,{
          method: "POST",
          headers: {
            "content-type": "appilication/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            "currentPassword": password,
            "newPassword": password1
          }),
        });
        try {
          const responceData = await response.json();
          console.log(responceData);
          
            setSubmit(false)
            if(responceData.code=="200"){
              toast.success(responceData.message)
              navigate("/Dashboard")
            }
            else{
              toast.error(responceData.message)
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
                  <div class="d-flex justify-content-center py-4">
                    <a
                      href="index.html"
                      class="logo d-flex align-items-center w-auto"
                    >
                     
                      <span class="d-none d-lg-block">Change Password</span>
                    </a>
                  </div>
                  {/* <!-- End Logo --> */}

                  <div class="card mb-3">
                    <div class="card-body">
                     

                      <form class="row  g-3 needs-validation" novalidate>
                        <div class="col-12">
                          <label  class="form-label">
                           Current Password
                          </label>
                          <div className='password-input-container'>
                          <input
                          value={password}
                              type={showPassword ? "text" : "password"}
                            class="form-control"
                            style={submit&&password.length==0 &&password<3?{borderColor:"red"}:{borderColor:""}}
                            onChange={(e)=>setPassword(e.target.value)}
                          />    
                           <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                  id="togglePassword"
                  onClick={togglePasswordVisibility}
              
                ></i>  
                          </div>
                         
                    {submit&&password.length==0?<div className='text-danger'>Password is required</div>:<></>}
                          {submit && password.length <3 && password.length !=0 ?<div className="text-danger">Password must be 3 charater</div>:<></>}
                        </div>
                        <div class="col-12">
                          <label  class="form-label">
                            Password
                          </label>
                          <div className='password-input-container'>
                          <input
                          value={password1}
                          onChange={(e)=>setPassword1(e.target.value)}
                          type={showPassword ? "text" : "password"}
                            class="form-control"
                            required
                            style={submit&&password.length==0 &&password<3?{borderColor:"red"}:{borderColor:""}}
                          />
                          {submit&&password1.length==0?<div className='text-danger'>Password is required</div>:<></>}
                          {submit && password1.length <3 && password1.length !=0 ?<div className="text-danger">Password must be 3 charater</div>:<></>}
                          <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                  // id="togglePassword"
                  onClick={togglePasswordVisibility}
              
                ></i>
                          </div>
                         
                        </div>
                        <div class="col-12">
                          <label  class="form-label">
                            Confirm Password
                          </label>
                          <div className='password-input-container'>
                          <input
                          value={password2}
                          onChange={(e)=>setPassword2(e.target.value)}
                          type={showPassword ? "text" : "password"}
                            class="form-control"
                            required
                            // style={submit&&(password1.length==0)?{borderColor:"red"}:{borderColor:""}}
                            style={submit && (password2.length === 0 || password2 !== password ||password2.length<3) ? { borderColor: "red" } : {}}
                            />
                            <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                  // id="togglePassword"
                  onClick={togglePasswordVisibility}
              
                ></i>
                          </div>
                         
                          {submit && password2.length === 0 && <div className='text-danger'>Confirm Password is required</div>}
                          {submit && password2.length <3 && password1.length !=0 ?<div className="text-danger">Password must be 3 charater</div>:<></>}
                         {submit && password2 !== password && password2.length !== 0 && <div className='text-danger'>Password and confirm password should be same</div>}
                        </div>
                        
                        <Link to="/Forgot" style={{textAlign:"right",fontSize:"14px"}}>Forgot Password </Link>
                        <div class="col-12">
                          <button onClick={changee}  class="btn btn-primary w-100">
                            Submit
                          </button>
                       
                        </div>
                       
                      </form>

                      
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

export default Change
