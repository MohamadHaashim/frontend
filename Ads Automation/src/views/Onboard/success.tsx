import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Navigate } from "react-router-dom";
import OnboardVideoIcon from "../../assets/images/icons/onboard-video-icon.svg";
import AwsConnectIcon from "../../assets/images/icons/aws-connect-icon.svg";
import LogoIcon from "../../assets/brand/logo-icon.svg";
interface FormState {
  message: string;
  redirect: string | null;
  awsProfilePreferences: [];
  atLeastOneSelected: boolean;
  loading: boolean;
}

class OnboardSuccess extends Component<{}, FormState> {
  loading = false;
  showCont = false;
  users: any = {};
  isCheckAll = false;
  constructor(props: {}) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.state = {
      awsProfilePreferences: [],
      message: "Loading....",
      redirect: null,
      atLeastOneSelected: false,
      loading: false,
    };
  }

  componentDidMount() {
    if (this.users.email === "" || this.users.email === undefined) {
      // this.getUserProfile();
    }
    if (this.loading === false) {
      console.log(window.location.href.split("="));
      let param1 = window.location.href.split("=")[1];
      let code = param1.split("&")[0];
      let param2 = window.location.href.split("=")[2];
      let scope = param2.split("&")[0];
      let param3 = window.location.href.split("=")[3];
      let state = param3.split("&")[0];

      let requestQuery = {
        code: code,
        name: "",
        scope: scope,
        state: state,
      };
      this.setState({ loading: true });
      this.amazonAccountSubmit(requestQuery);
      this.loading = true;
    }
  }

  amazonAccountSubmit(bodyQuery: any) {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;

    fetch("https://api.aimosa.io/AmazonAds/Callback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify(bodyQuery),
    })
      .then((response) => response.json())
      .then((responceData) => {
        console.log("Activation API Response: ", responceData);
        let msg = responceData.message;
        if (responceData.success) {
          this.setState({ message: msg, loading: false });
          this.getUserProfile();
          this.showCont = true;
        } else {
          this.setState({ message: msg, loading: false });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ loading: false }); // Set loading state to false on error
      });
  }

  getUserProfile() {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;

    fetch("https://api.aimosa.io/Users/Profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
    })
      .then((response) => response.json())
      .then((responceData) => {
        console.log("Get User Profile Response: ", responceData);
        if (responceData.success) {
          this.users = responceData.result;
          console.log("Profile data", this.users);
          this.setState({
            awsProfilePreferences: this.users.awsProfilesPreferences,
            loading: false, // Set loading state to false when user profile is fetched
          });
        } else {
          this.setState({ loading: false }); // Set loading state to false on error
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ loading: false }); // Set loading state to false on error
      });
  }

  handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("form submit: ", event);

    this.setState({
      redirect: "/onboarding/browser-extension",
    });
  };

  handleOnChange(event: any, awsProfileData: any) {
    this.setState({
      atLeastOneSelected: false,
    });
    let awsProfilePreferences = this.state.awsProfilePreferences;
    awsProfilePreferences.forEach((chkItem: any) => {
      if (chkItem === awsProfileData) {
        chkItem.isActive = event.target.checked;
      }
    });
    this.setState({
      awsProfilePreferences: awsProfilePreferences,
    });

    this.state.awsProfilePreferences.forEach((chkItem: any) => {
      if (chkItem.isActive === true) {
        this.setState({
          atLeastOneSelected: true,
        });
      }
    });
    console.log("Onclick obj data: ", awsProfilePreferences);
  }
  handleSelectAll(event) {
    let awsProfilePreferences = this.state.awsProfilePreferences;
    awsProfilePreferences.forEach((chkItem: any) => {
      chkItem.isActive = event.target.checked;
    });
    this.setState({
      awsProfilePreferences: awsProfilePreferences,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />;
    }
    return (
      <DefaultLayout>
        <div className="contanier-type2">
          <form onSubmit={this.handleSubmit}>
            <div className="center-title">
              <h2>Welcome to Aimosa</h2>
              <p>Getting ready to begin...</p>
            </div>
            <div className="mb-3">
              <h3 className="mb-2">
                <span>
                  <img
                    className="title-image"
                    src={AwsConnectIcon}
                    alt="aws connect"
                  />
                </span>
                Connect Amazon Data
              </h3>
              {this.state.awsProfilePreferences ? (
                <p>
                  We found{" "}
                  <strong>
                    {this.state.awsProfilePreferences.length} available
                    merchants
                  </strong>{" "}
                  ready to connect.
                </p>
              ) : (
                <p>
                  We found <strong>0 available merchants</strong> ready to
                  connect.
                </p>
              )}
              {this.state.loading ? (
                <div className="loading-container">
                  <div className="loading-text">
                    <span className="logicon">
                      {/* <img src={LogoIcon} alt="logo-small"></img> */}
                    </span>
                    <span>L</span>
                    <span>O</span>
                    <span>A</span>
                    <span>D</span>
                    <span>I</span>
                    <span>N</span>
                    <span>G</span>
                  </div>
                </div>
              ) : (
                <div>
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Country</th>
                        <th>Id</th>
                        <th>Type</th>
                      </tr>
                    </thead>
                    {this.state.awsProfilePreferences && (
                      <tbody>
                        {this.state.awsProfilePreferences.length > 0 &&
                          this.state.awsProfilePreferences.map(
                            (awsProfile: any, i) => (
                              <tr key={"item-" + i}>
                                <td>
                                  <input
                                    type="checkbox"
                                    name="serviceCheck"
                                    id={awsProfile.profileId}
                                    // checked={awsProfile.isActive}
                                    onChange={(event) =>
                                      this.handleOnChange(event, awsProfile)
                                    }
                                  />
                                </td>
                                <td>
                                  <span>
                                    <img
                                      className="image-circle-20"
                                      src={
                                        "../assets/flags/" +
                                        awsProfile.countryCode +
                                        ".png"
                                      }
                                      alt=""
                                    />
                                  </span>
                                  {awsProfile.countryCode}
                                </td>
                                <td>{awsProfile.profileId}</td>
                                <td>Reseller</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    )}
                  </table>
                </div>
              )}
            </div>

            <div className="d-grid onboard-success-btn">
              <div className="row">
                <div className="col-md-6">
                  <button type="button" className="btn btn-primary explore">
                    Back
                  </button>
                </div>
                <div className="col-md-6">
                  {this.state.loading ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => window.location.reload()}
                    >
                      Refresh
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!this.state.atLeastOneSelected}
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </DefaultLayout>
    );
  }
}
export default OnboardSuccess;
