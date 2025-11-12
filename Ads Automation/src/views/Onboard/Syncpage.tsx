import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/brand/logo.svg";

const Syncpage: React.FC = () => {
  const navigate = useNavigate();

  const handleSyncClick = () => {
    // Get userToken from local storage
    const userToken = localStorage.getItem("userToken");

    // Log userToken to the console
    console.log("User Token:", userToken);

    // Construct the URL with userToken
    const url = `https://account.kdp.amazon.com?t=${userToken}`;

    // Open a new window with the provided URL and userToken
    const newWindow = window.open(url, "_blank", "width=800,height=600");

    if (newWindow) {
      // Log to the console in the new window
      newWindow.onload = function () {
        (newWindow as any).console.log("User Token in New Window:", userToken);
      };

      // Set up a timer to periodically check if the new window is closed
      const checkClosed = setInterval(() => {
        if (newWindow.closed) {
          console.log("New Window is Closed");
          // Redirect to the dashboard page when the new window is closed
          navigate("/Dashboard");
          clearInterval(checkClosed); // Clear the interval once redirected
        }
      }, 1000);

      newWindow.focus();
    }
  };

  return (
    <div className="contanier-type2" style={{ marginTop: "150px" }}>
      <div className="login-log text-center">
        <img src={Logo} alt="logo" />
      </div>
      <br />
      <div style={{ marginBottom: "15px" }}>
        <p>Click The Button Below To Log Into The Aimosa Amazon Kdp Account</p>
      </div>
      <div
        className="d-grid onboard-success-btn"
        style={{ boxShadow: "0 0 0px rgba(0, 0, 0, 0.0)" }}
      >
        <div className="col-md-12">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSyncClick}
          >
            Sync
          </button>
        </div>
      </div>
      <div style={{ marginTop: "15px" }}>
        <p>
          Your Privacy is important to us. Logging in with Amazon does not grant
          Aimosa access to your Amazon password, email, or any personal
          information. For more information, please refer to our detailed
          Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Syncpage;
