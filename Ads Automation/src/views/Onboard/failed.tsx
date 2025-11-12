import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import OnboardIcon from "../../assets/images/icons/onboad-icon.svg";
import OnboardWarningIcon from "../../assets/images/icons/onboard-warning.svg";

interface FormState {
  Region: string;
  errors: {
    Region: string;
  };
}
class OnboardFailed extends Component<{}, FormState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      Region: "",
      errors: {
        Region: ""
      },
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
    event.preventDefault();
    const { Region } = this.state;
    
    // Perform validation
    const errors: FormState["errors"] = {
      Region: "",
    };

    if (Object.values(errors).some((error) => error !== "")) {
      this.setState({ errors });
    } else {
      // Submit the form or perform other actions
      console.log("Form submitted");
    }

    let region = {"Region" : "NA"}
  
    let userToken = localStorage.getItem('userToken')
    let AuthToken = "Bearer " + userToken;
    // Make an API call using fetch or any other library of your choice
    try {
      const response = await fetch('https://api.aimosa.io/AmazonAds/AuthorizationURL?Region=NA', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AuthToken
        },
        })
        const responceData = await response.json();
        console.log("Onboarding response data: ", responceData)
      if(responceData.success === true){
        window.location.href = responceData.result.connectUrls;
      } else {
        // this.setState({
        //   redirect: "/onboarding"
        // });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <DefaultLayout>
        <div className="contanier-type2">
          <form onSubmit={this.handleSubmit}>
            <div className="center-title">
              <h2>Welcome to Aimosa</h2>
              <p>Getting ready to begin...</p>
            </div>
            <div className="mb-3">
              <h3>Amazon connecting</h3>
              <p>
                Integrate your Amazon data, empowering you to analyze and monitor key performance metrics.
              </p>
              <div className="onboard-cont onboard-warring">
                <div className="row">
                  <div className="col-md-1">
                    <img src={OnboardWarningIcon} alt="Icon" />
                  </div>
                  <div className="col-md-11">
                    <p>We apologize for the inconvenience, but it seems that we couldn't successfully link your Amazon account. Please give it another attempt.</p>
                  </div>
                </div>
              </div>
              <div className="onboard-cont onboard-service">
                <div className="row">
                  <div className="col-md-2">
                    <img src={OnboardIcon} alt="Icon" />
                  </div>
                  <div className="col-md-10">
                    <h4 className="mb-0">Amazon</h4>
                    <p className="mb-0">Not connected</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-grid">
              <button type="submit" className="btn btn-primary ">
                Authorize to connect
              </button>
            </div>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}
export default OnboardFailed;
