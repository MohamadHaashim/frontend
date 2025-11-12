import React from "react";
import { useNavigate } from "react-router-dom";
import logingimage from '../../assets/photos/loginbackground.jpg';
import penqueenlogo from '../../assets/photos/MyBrandingbalck.png';
import "./Login.css";

const Login: React.FC = () => {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const navigate = useNavigate();

  

 return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 vw-100 box-body"
      style={{
        backgroundImage: logingimage ? `url(${logingimage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <form onSubmit={()=>{navigate("/dashboard");}} className="login-card text-center">
        <div className="justify-content-center d-flex mt-4">
        <img
          src={penqueenlogo}
          alt="PenQueen Logo"
          className="logo-3d"
          style={{ width: "200px"}}
        />
        </div>

        {/* <div className="mb-3 text-start">
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
            // required
          />
        </div> */}
        <div className="floating-label-input">
          <input className="input-text" type="email" id="email" placeholder="Email" autoComplete="off" />
          <label htmlFor="email">Email</label>
        </div>

        {/* <div className="mb-3 text-start">
          <label htmlFor="password" className="form-label fw-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
            // required
          />
        </div> */}

        <div className="floating-label-input">
          <input 
            className="input-text" 
            type="password" 
            id="password" 
            placeholder="password" 
            autoComplete="off" 
          />
          <label htmlFor="password">Password</label>
        </div>

         <div className="password-manager mb-6">
          <a href="#" className="forgot-password">Forgot Password</a>
        </div>

        <button type="submit" className="login-btn">
          Login
        </button>
        
      </form>
    </div>
  );
};


export default Login;
