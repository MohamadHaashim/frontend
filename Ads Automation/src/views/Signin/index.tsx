import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Link, Navigate, useNavigate } from "react-router-dom";
import SignInWithFacebook from "../../components/sign/SignInWithFacebook";
import SignInWithGoogle from "../../components/sign/GoogleSignIn";
import adsLogo from "../../assets/images/icons/adslogo.png";
interface FormState {
  errorMessage : string,
  redirect: string | null,
  email: string;
  password: string;
  showPassword: boolean;
  errors: {
    email: string;
    password: string;
  };
  loading: boolean;
}

class SignIn extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      errorMessage: "",
      redirect: null,
      email: "",
      password: "",
      showPassword: false,
      errors: {
        email: "",
        password: "",
      },
      loading: false
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  };
  handleSubmit = async(event: React.FormEvent) => {
    this.setState({loading: true});
    
    event.preventDefault();
    const { email, password } = this.state;
    
    // Perform validation
    const errors: FormState["errors"] = {
      email: "",
      password: "",
    };

     if (!email) {
      errors.email = "Email is required";
    } else if (!this.validateEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    if (Object.values(errors).some((error) => error !== "")) {
      this.setState({ errors });
    } 
    else {
      
      console.log("Form submitted");
    }
  try {

    // const response = await fetch('https://adsexpert-api.getgrowth.agency/Users/Login', {
    const response = await fetch('https://adsexpert-api.getgrowth.agency/Users/Login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    })
    const responceData = await response.json();

      if(!responceData.success){
        console.log("error login", responceData);
        if(response.status !== 500){
          this.setState({errorMessage: responceData.message});
        }else{
          this.setState({errorMessage: "Something went wrong"});
        }
       
      } 
    
   
    else if(!responceData.result.user.isActive){
      this.setState({errorMessage: "Please check email to activate your account."});
    } else {
      
      console.log("userName "+ responceData.result.user.userName);
      console.log("email "+ responceData.result.user.email);
      // console.log("response"+ responceData.result.user.);
      console.log("accessToken "+ responceData.result.accessToken);

      localStorage.setItem("userName", responceData.result.user.userName);
      localStorage.setItem("email", responceData.result.user.email);
      localStorage.setItem("userToken", responceData.result.accessToken);
      localStorage.setItem("budgetOptimizer",responceData.result.budgetOptimizer.accessToken);
      if (responceData.result.user.kdpSync && responceData.result.user.isAWSConnected) {
       
        this.setState({
          redirect: "/scheduler"
        });
      } else {
        this.setState({
          redirect: "/scheduler"
        });
      }
    }
    this.setState({loading: false});
  } catch (error) {
    this.setState({loading: false});
    this.setState({errorMessage: "Something went wrong"})
    console.error('Error:', error);
  }
}
  validateEmail = (email: string) => {
    // Email validation logic (you can use a library or a custom regex pattern)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };
  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { email, password, errors,showPassword  } = this.state;
    const isFormValid = email !== '' && password !== '';

    return (
      <div>
        {/* <div className="logo mt-3">
 
        </div> */}
        <div className="contanier-type1">
        
        <div className="box-body">
          <div className="white-box">
          <div className="text-center mb-4">
          <img src="https://getgrowthdigital.com/wp-content/uploads/2023/08/logog1.jpg" alt="" />
        
          </div>
          <form onSubmit={this.handleSubmit}>
            {/* <div className="separator mb-4">Or</div> */}
            { this.state.errorMessage &&
            <p className="text-center text-red">*{this.state.errorMessage}</p>}
            <div className="mb-3">
              <label className="lab">Email</label>
              <input
                type="text"
                name="email"
                className="form-control mt-2"
                
                value={email}
                onChange={this.handleInputChange}
                
              />
              {errors.email && <span className="validation-error">{errors.email}</span>}
            </div>
            <div className="mb-0 password-cont" >
            <label className="lab" >Password</label>
              <input
              name='password'
              type={showPassword ? 'text' : 'password'}               
              className="form-control mt-2"
               
                value={password}
                onChange={this.handleInputChange}
              />
              <span className="show-password"  onClick={this.togglePasswordVisibility}>
            {showPassword ? (
              <i className="fas fa-eye-slash"></i>
            ) : (
              <i className="fas fa-eye"></i>
            )}
          </span>
              {errors.password && <span className="validation-error">{errors.password}</span>}
            </div>
            {/* <div className="mb-1">
              <p className="forgot-password text-right"  >
                <Link to={"/forgot-password"}>Forgot Password?</Link>
              </p>
            </div> */}
            {/* <div className="mb-4 mt-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input login-checkbox"
                  id="customCheck1"
                />
                <label
                  className="custom-control-label ml-3"
                  htmlFor="customCheck1"
                > 
                  Remember me
                </label>
              </div>
            </div> */}
            <div className="d-grid mt-3"  style={{fontWeight:"600 !important"}}>
              <button type="submit" className="btn btn-primary " style={{fontWeight:"600" , fontSize:"20px"} } >
                { !this.state.loading ? ( "Log in" )
                :  (<div className="spinner-box">
                  <div className="pulse-container">  
                    <div className="pulse-bubble pulse-bubble-1"></div>
                    <div className="pulse-bubble pulse-bubble-2"></div>
                    <div className="pulse-bubble pulse-bubble-3"></div>
                  </div>
                </div>)}
              </button>
            </div>
            {/* <div className="new-create-account">
              <p className="text-center">
                No account?{" "}
                <Link to={"/sign-up"}>Sign Up</Link>
              </p>
            </div> */}
          </form>
          </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SignIn;
