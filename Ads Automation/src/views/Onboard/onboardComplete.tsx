import React, { Component } from "react";
import DefaultLayout from "../../layouts/DefaultLayout";
import { Navigate } from "react-router-dom";
import OnboardVideoIcon from "../../assets/images/icons/onboard-video-icon.svg";
import AwsConnectIcon from "../../assets/images/icons/aws-connect-icon.svg";

interface FormState {
  message: string;
  redirect: string | null;
  awsProfilePreferences: [];
  atLeastOneSelected: boolean;
}

class OnboardComplete extends Component<{}, FormState> {
  loading = false;
  showCont = false;
  users:any = {};
  isCheckAll = false;
  constructor(props: {}) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.state = {
      awsProfilePreferences: [],
      message: "Loading....",
      redirect: null,
      atLeastOneSelected: false
    };
  }

  componentDidMount() {
    
  }

  handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    console.log("form submit: ", event);

    this.setState({
      redirect: "/dashboard"
    });
  }

  handleOnChange (event:any, awsProfileData:any){
    
  }
  handleSelectAll(event){
    let awsProfilePreferences = this.state.awsProfilePreferences;
    awsProfilePreferences.forEach((chkItem:any) =>{
      chkItem.isActive = event.target.checked;
    })
    this.setState({
      awsProfilePreferences: awsProfilePreferences
    });
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    return (
      <DefaultLayout>
        <div className="contanier-type2">
          <form onSubmit={this.handleSubmit}>
            <div className="center-title">
              <h2>Welcome to Aimosa</h2>
              <p>Getting ready to begin...</p>
            </div>
            <div className="mb-3" >
              <h3>Data syncing</h3>
              <p>
                Your data is currently syncing. You will receive an email when it is completed.
              </p>
            
            </div>
            <div className="d-grid onboard-success-btn">
              <div className="row">
                <div className="col-md-6">
                  <button type="submit" className="btn btn-primary explore">
                  <img src={OnboardVideoIcon} alt="Icon" /> Explore aimosa
                  </button>
                </div>
                <div className="col-md-6">
                  <button type="submit" className="btn btn-primary">
                    Finish
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </DefaultLayout>
    );
  }
}
export default OnboardComplete;
