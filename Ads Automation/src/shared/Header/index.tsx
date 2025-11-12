import React, { Component } from "react";
import "./index.css";
import BellIcon from "../../assets/images/icons/bell-icon.svg";
import ProfileIcon from "../../assets/images/icons/profile-icon.svg";
import ProfileDropIcon from "../../assets/images/icons/profile-down-arrow.svg";
import logouticon from "../../assets/images/icons/logout.png";
import {Navigate } from "react-router-dom";
// import { useLocation } from 'react-router-dom';

import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
  Modal,
  Form,
  Button,
} from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// const location = useLocation();

interface ProfileOption {
  value: string; // Adjust the type according to your data
  label: string;
  countryCode:string
}
interface filteredData {
  value: string; // Adjust the type according to your data
  label: string;
  countryCode:string
}
interface DropdownOption {
  value: string;
  label: string;
}

interface profileId {
  onSearch: (selectedAccount: string) => void;
  // onprop: (selectedprofileId: string) => void;
}

interface HeaderProps extends profileId {}

class Header extends Component<HeaderProps> {
  state = {
    userNames: localStorage.getItem("userName"),
    profileOptions: [] as ProfileOption[],
    filteredData: [] as filteredData[],
    selectedAccount: "",
    Account: localStorage.getItem("account"),
    selectedProfileId: localStorage.getItem("BudgetProfileId"),
    profileAddRemoveOption: "Add",
    profileAddRemoveModal: false,
    addRemoveProfileId:"",
    addRemoveProfileName:"",
    addRemoveMarketplace:"",
    PathName:localStorage.getItem("currentPathname"),
    redirect: null,
    dropdownOptions: [] as DropdownOption[],
    dropdownType: "",
    profileId:""
  };

  constructor(props: profileId) {
    super(props);
    this.handleAccountChange = this.handleAccountChange.bind(this);
    this.handleDropdownChange =this.handleDropdownChange.bind(this);
  } 

  componentDidMount() {
    this.updateDataBasedOnPath();
    const lastSelectedProfileId = localStorage.getItem("BudgetProfileId");
    if (lastSelectedProfileId) {
      const matchedProfile = this.state.filteredData.find(
        (profile) => String(profile.value) === String(lastSelectedProfileId)
      );

      if (matchedProfile) {
        this.setState({
          selectedProfileId: lastSelectedProfileId,
          profileId: lastSelectedProfileId,
        });
      }
    }
  
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.PathName !== window.location.pathname) {
      this.setState({ PathName: window.location.pathname }, () => {
        this.updateDataBasedOnPath();
      });
    }
  }

  updateDataBasedOnPath = () => {
    const { PathName } = this.state;

    if (PathName === "/budget/ads-budget-optimizer") {
      this.BudgetOptimizer();
      this.setState({ dropdownType: "BudgetOptimizer" });
    } else {
      this.getProfile();
      this.setState({ dropdownType: "Profile" });
    }
  };

  handleAccountChange(event) {
    const selectedValue = event.target.value;
   const data = this.state.profileOptions.filter((profile) => profile.value === selectedValue)
   console.log(data);
   
   localStorage.setItem("ProfileName", data[0].label);
    this.setState({
      selectedAccount: selectedValue,
      Account: selectedValue,
    });

    localStorage.setItem("account", selectedValue);
    this.props.onSearch(selectedValue);
  }

  getProfile = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    try {
      const response = await fetch(
        "https://adsexpert-api.getgrowth.agency/Users/Profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
        }
      );

      const responseData = await response.json();
      console.log(responseData);
      if(responseData.message === "User is not authenticated"){
        this.setState({
          redirect: "/sign-in"
        });
      }
      else{
        const profiles = responseData.result.awsProfilesPreferences;

      
        const profileOptionss = profiles
          .filter((profile) => profile.isActive === true)
          .map((profile) => ({
            value: profile.profileId,
            label: profile.profileName,
            countryCode:profile.countryCode
          }));
        console.log(profileOptionss);
        const account = localStorage.getItem("account");
        const name =  localStorage.getItem("ProfileName");
        localStorage.setItem("ProfileName" , name ? name : profileOptionss[0].label )
  
        this.props.onSearch(account ? account : profileOptionss[0].value);
        this.setState(
          {
            profileOptions: profileOptionss,
            selectedAccount: profileOptionss[0].value,
            userName: responseData.result.name,
          },
          () => {}
        );
      }
      

    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    const data = this.state.filteredData.filter((profile) => String(profile.value) === String(selectedValue));

    if (data.length > 0) {
      localStorage.setItem("BudgetProfileName", data[0].label);
      this.setState({
        selectedProfileId: selectedValue,
        profileId: selectedValue,
      });

      localStorage.setItem("BudgetProfileId", selectedValue);
      this.props.onSearch(selectedValue);
    } else {
      console.error("No matching profile found for the selected value:", selectedValue);
    }
  };


  BudgetOptimizer = async () => {
    try {
      let budgetOptimizer = localStorage.getItem("budgetOptimizer");
      let AuthToken = "Bearer " + budgetOptimizer;

      const response = await fetch(
        "https://budget-api.getgrowth.agency/api/amazon/ads/dashboard",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
        }
      );

      if (!response.ok) {
        console.error(`API call failed with status: ${response.status}`);
        return;
      }

      const responseData = await response.json();
      console.log("Budget Optimizer Response:", responseData.data);

      const filteredData = responseData.data
        .filter((item) => item.isDashboard === true)
        .map((profile) => ({
          value: profile.profileId,
          label: profile.name,
          countryCode: profile.countryCode,
        }));

      if (filteredData.length === 0) {
        console.warn("No profiles available in filtered data.");
        return;
      }

      const profileId = localStorage.getItem("BudgetProfileId");
      const name = localStorage.getItem("BudgetProfileName");
      localStorage.setItem("BudgetProfileName", name ? name : filteredData[0].label);
      localStorage.setItem("BudgetProfileId", profileId ? profileId : filteredData[0].value);
      this.props.onSearch(profileId ? profileId : filteredData[0].value);

      this.setState(
        {
          filteredData: filteredData,
          dropdownOptions: filteredData,
          selectedProfileId: profileId || filteredData[0].value, 
        },
        () => {}
      );
    } catch (error) {
      console.error("Error occurred while fetching Budget Optimizer data:", error);
    }
  };
  

  logoutHandler = () => {
    localStorage.clear();
  };

  handleradiochange = (e) => {
    console.log(e.target.value);
    this.setState({ profileAddRemoveOption: e.target.value });
  };
  handleCloseAndSetProfileADDRemoveOption = () => {
    this.setState({ profileAddRemoveModal: false });
    this.setState({ profileAddRemoveOption: "Add" });
    this.setState({addRemoveProfileId:"",addRemoveProfileName:"",addRemoveMarketplace:""})
  };
  handleShow = () => {
    this.setState({ profileAddRemoveModal: true });
  };
  handleprofileModalChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target.name);
    
    this.setState({ [name]: value });
  };

  handleProfileAddRemove =()=>{
    const usertoken = localStorage.getItem("userToken")
    if(this.state.profileAddRemoveOption === "Add"){
      const Data ={
        profileId: Number(this.state.addRemoveProfileId),
        profileName:this.state.addRemoveProfileName,
        marketplace:this.state.addRemoveMarketplace,
        isActive:true
      }

      axios
      .post("https://adsexpert-api.getgrowth.agency/BackgroundServices/Ads/profiles" ,Data,  {
        headers: {
            Authorization: `Bearer ${usertoken}`
          }
      })
      .then((res)=>{
        if(res.data.success === true){
             if(res.data.message === "Sync Queued successfully"){
              this.getProfile();
              toast("Profile added successfully")
              this.handleCloseAndSetProfileADDRemoveOption()
              this.setState({addRemoveProfileId:"",addRemoveProfileName:"",addRemoveMarketplace:""})
             }
              else if(res.data.message === "Amazon Profile don't exist"){
                toast("Profile don't exist")
             }
             else if(res.data.message === "ProfileAlreadyActive"){
              this.handleCloseAndSetProfileADDRemoveOption()
              toast("The profile is already active")
           }
             else{
              toast("Something went wrong")
             }
        }
        else{
          toast("Profile added failed")
        }
       
      })
      .catch((error)=>{
          toast("Something went wrong")
          console.log(error);
          
      })
      
      }
      else{
        const Data ={
          profileId: Number(this.state.addRemoveProfileId),
          profileName:this.state.addRemoveProfileName,
          marketplace:this.state.addRemoveMarketplace,
          isActive:false
        }
    
        axios
        .post("https://adsexpert-api.getgrowth.agency/BackgroundServices/Ads/profiles" ,Data,  {
          headers: {
              Authorization: `Bearer ${usertoken}`
            }
        })
        .then((res)=>{
          if(res.data.success === true){
               if(res.data.message === "Sync Queued successfully"){
                this.getProfile();
                toast("Profile removed successfully")
                this.handleCloseAndSetProfileADDRemoveOption()
                this.setState({addRemoveProfileId:"",addRemoveProfileName:"",addRemoveMarketplace:""})
               }
                else if(res.data.message === "Amazon Profile don't exist"){
                  toast("Profile don't exist")
               }
                else if(res.data.message === "ProfileAlreadyInactive"){
                  this.handleCloseAndSetProfileADDRemoveOption()
                  toast("The profile is already inactive")
               }
               else{
                toast("Something went wrong")
               }
          }
          else{
            toast("Profile remove failed")
          }
         
        })
        .catch((error)=>{
            toast("Something went wrong")
            console.log(error);
            
        })
      }

  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }
    const { dropdownType, dropdownOptions,profileOptions } = this.state;
    return (
      <Navbar expand="lg" className="bg-body-tertiary page-top-bar">
        <Container fluid>
          <div className="d-flex align-items-center">
            {/* {this.state.PathName !== "scheduler"  && */}
            <div className="account ms-2">
            {dropdownType === "Profile" && (
              <select
                className="form-select"
                name="TypeSelect"
                id="TypeSelect"
                value={Number(this.state.Account)}
                onChange={this.handleAccountChange}
              >
                {this.state.profileOptions.map((profile) => (
                  <option key={profile.value} value={profile.value}>
                    { `${profile.label} | ${profile.countryCode}`}
                  </option>
                ))}
              </select>
            )}
            </div>
            <div className="account ms-2">
            {dropdownType === "BudgetOptimizer" && this.state.filteredData.length > 0 && (
                <select
                  className="form-select"
                  name="TypeSelect"
                  id="TypeSelect"
                  onChange={this.handleDropdownChange}
                  value={Number(this.state.selectedProfileId)}
                >
                  {this.state.filteredData.map((option, index) => (
                    <option key={index} value={option.value}>
                      {`${option.label} | ${option.countryCode}`}
                    </option>
                  ))}
                </select>
              )}
            </div>


  {/* } */}
            {/* <div className="profileAdd">
              <button
                className="btn btn-primary add-rules-btn pt-2 remove-button"
                style={{ height: "35px !important" }}
                onClick={this.handleShow}
              >
                Profile Add/Remove
              </button>
              <Modal
                show={this.state.profileAddRemoveModal}
                onHide={this.handleCloseAndSetProfileADDRemoveOption}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Profile Add/Remove</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="d-flex mb-3 justify-content-center">
                    <Form.Check
                      type="radio"
                      label="Add Profile"
                      className="user-select-none  me-3"
                      id="radio-add-Profile"
                      name="profileAddRemove"
                      defaultChecked={true}
                      value={"Add"}
                      onChange={this.handleradiochange}
                    />
                    <Form.Check
                      type="radio"
                      label="Remove Profile"
                      className="user-select-none "
                      id="radio-remove-Profile"
                      name="profileAddRemove"
                      value={"Remove"}
                      onChange={this.handleradiochange}
                    />
                  </div>
                  <Form.Label>Profile Id</Form.Label>
                  <Form.Control
                    type="text"
                    className="ProfileId h-100 mb-1"
                    name="addRemoveProfileId"
                    onChange={this.handleprofileModalChange}
                  />
                  <div className="text-center py-2">-Or-</div>
                  <Form.Label className="">Profile Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="ProfileName h-75"
                    name="addRemoveProfileName"
                    onChange={this.handleprofileModalChange}
                  />
                  <Form.Label className="mt-2">Marketplace</Form.Label>
                  <Form.Control
                    type="text"
                    className="Marketplace h-75"
                    name="addRemoveMarketplace"
                    onChange={this.handleprofileModalChange}
                  />
                </Modal.Body>
                <Modal.Footer>
                  {this.state.profileAddRemoveOption === "Add" ? (
                    <Button
                      className="btn btn-primary add-rules-btn pt-2"
                      style={{ height: "43px !important" }}
                      onClick={this.handleProfileAddRemove}
                    >
                      Add
                    </Button>
                  ) : (
                    <Button
                      className="btn btn-primary add-rules-btn pt-2"
                      style={{ height: "43px !important" }}
                      onClick={this.handleProfileAddRemove}
                    >
                      Remove
                    </Button>
                  )}
                </Modal.Footer>
              </Modal>
            </div> */}
          </div>
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          ></Nav>

          <Nav className="profile-view justify-content-end">
            <div className="vr"></div>
            <Nav.Link href="#" className="bell ms-2 me-2 mt-1">
              <img src={BellIcon} alt="" />
            </Nav.Link>
            <div className="vr"></div>
            <NavDropdown
              className="ms-4"
              title={
                <div>
                  <div className="profile-icon">
                    <div className="profile-img">
                      <div className="profile-icon d-flex align-items-center">
                        <img src={ProfileIcon} alt="img" />
                        <span
                          className="ms-2"
                          style={{
                            color: "#6b7280",
                            textDecoration: "none !important",
                          }}
                        >
                          {this.state.userNames}
                        </span>

                        <span>
                          <img src={ProfileDropIcon} alt="drop icon" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              }
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item
             >
                <Link to={"/profile"} style={{textDecoration:"none"}}>
                <div
                  className="myProfileLogo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px",
                    color:"black"
                  }}
                >
                  <i className="profile-logo" />
                  Profile
                </div>
                </Link>
              </NavDropdown.Item>
              <NavDropdown.Item
                href="/sign-in"
                className=""
                onClick={this.logoutHandler}
              >
                <div
                  className="myProfileLogo"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    padding: "8px",
                  }}
                >
                  <img
                    src={logouticon}
                    style={{ width: "20px", height: "20", marginLeft: "1px" }}
                    alt="logout"
                  />
                  Logout
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
    );
  }
}

export default Header;
