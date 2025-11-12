import React, { Component, useEffect, useState } from "react";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { Alert, Col, Form, Row } from "react-bootstrap";
import avatarLogo from "../../../assets/images/icons/profile-avtar-image.svg";
import ProfileMailLogo from "../../../assets/images/icons/profile-mail-icon.svg";
import ProfilePhoneLogo from "../../../assets/images/icons/profile-phone-icon.svg";
import ProfileEditLogo from "../../../assets/images/icons/profile-edit-icon.svg";
import Navbar from "../Navbar/navbar";
import "./myProfile.css";
import { elements } from "chart.js";
import { toast } from "react-toastify";
import axios from "axios";
import { log } from "console";
import { isInputElement } from "react-router-dom/dist/dom";
interface ProfileState {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  username: any;
  currencyTypeSelection: any;
  pageReadestimate: string;
  pageReadestimateType: string;
  timeZoneSelection: any;
  timeZoneSelectiontType: any;
  id: string;
  showPassword: boolean;
  newPassword: string;
  confirmPassword: string;
  oldPassword: string;
  avatar: string;
  imageUplaod: string;
  profileme: any;
  userimg: any;
  selectedFile: any;
  currency: any;
  pageRead: any;
  ZoneSelection: any;
  userName: string;
  // errors: {
  //   newPassword: string;
  //   confirmPassword: string;
  // };
}

export default class MyProfile extends Component<{}, ProfileState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      username: "",
      currencyTypeSelection: [],
      pageReadestimate: "",
      pageReadestimateType: "",
      timeZoneSelection: "",
      id: "",
      profileme: "",
      showPassword: false,
      newPassword: "",
      confirmPassword: "",
      avatar: "",
      imageUplaod: "",
      userimg: "",
      selectedFile: "",
      currency: "",
      pageRead: "",
      ZoneSelection: "",
      timeZoneSelectiontType: "",
      userName: "",
      oldPassword: "",
    };
  }
  data = {
    userEmail: localStorage.getItem("email"),
    localUserName: localStorage.getItem("userName"),
  };

  componentDidMount() {
    this.getProfile();
    this.getCurrencyType();
    this.getTimeZoneSelection();
    this.getpageReadestimate();
    // this.getImageUpload();

    let profileName = localStorage.getItem("userName");
    this.setState({ profileme: profileName });
  }
  getProfile = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;

    try {
      const response = await fetch("https://api.aimosa.io/Users/Me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      });

      const responceData = await response.json();
      console.log(this.state.timeZoneSelectiontType);
      console.log(responceData.result.pageReadestimate);
      console.log(this.state.pageReadestimate);

      console.log("get=", responceData.result);
      this.setState({ name: responceData.result.name });
      this.setState({ email: responceData.result.email });
      this.setState({ currency: responceData.result.currencyTypeSelection });
      this.setState({
        pageReadestimateType: responceData.result.pageReadestimate,
      });
      this.setState({
        timeZoneSelectiontType: responceData.result.timeZoneSelection,
      });
      this.setState({ username: responceData.result.username });
      this.setState({ id: responceData.result.id });
      this.setState({ password: responceData.result.password });
      this.setState({ phoneNumber: responceData.result.phone });
      this.setState({ userimg: responceData.result.image });
      console.log(responceData.result.image);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  handleEventCurrency = (e) => {
    this.setState({ currency: e.target.value });
  };
  handleEventpageRead = (e) => {
    this.setState({ pageRead: e.target.value });
  };
  handleEvent = (e) => {
    this.setState({ ZoneSelection: e.target.value });
    // this.setState({ timeZoneSelectiontType: e.target.value });
  };

  saveChangesClick = async (event) => {
    event.preventDefault();
    const selectedPlan1: any = document.querySelectorAll(
      ".disableInput.editable"
    );
    // console.log(selectedPlan1.length);
    console.log(this.state.currency);
    // console.log(selectedPlan1.length);
    // console.log(selectedPlan1.length);

    if (selectedPlan1.length > 0) {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      const {
        name,
        username,
        email,
        phoneNumber,
        currency,
        pageRead,
        ZoneSelection,
      } = this.state;
      const response = await fetch("https://api.aimosa.io/Users/Profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
        body: JSON.stringify({
          name,
          username,
          email,
          phoneNumber,
          currencyTypeSelection: currency,
          pageReadestimate: this.state.pageRead,
          timeZoneSelection: this.state.ZoneSelection,
        }),
      });
      const responceData = await response.json();
      console.log("res=", responceData);
      // this.getProfile();
      if (response.status === 200) {
        toast("Profile updated successfully");
      }

      const selectedPlan: any = document.querySelectorAll(".disableInput");
      if (selectedPlan.length > 0) {
        for (let i = 0; i < selectedPlan.length; i++) {
          selectedPlan[i].disabled = true;
          selectedPlan[i].classList.remove("editable");
        }
      }
    } else {
      alert("First make changes");
    }
    const clearEle: any = document.querySelectorAll(
      ".profileEditBtn.editableBtnOn"
    );
    for (var i = 0; i < clearEle.length; i++) {
      clearEle[i].classList.remove("editableBtnOn");
    }
  };
  handleEditClick = () => {
    const selectedPlan: any = document.querySelectorAll(".disableInput");
    if (selectedPlan.length > 0) {
      for (let i = 0; i < selectedPlan.length; i++) {
        selectedPlan[i].disabled = false;
        selectedPlan[i].classList.add("editable");
      }
    }

    const selectedPlan1: any = document.querySelectorAll(".profileEditBtn");
    if (selectedPlan.length > 0) {
      for (let i = 0; i < selectedPlan1.length; i++) {
        selectedPlan1[i].disabled = false;
        selectedPlan1[i].classList.add("editableBtnOn");
      }
    }
  };

  handleUserName = (e) => {
    this.setState({ username: e.target.value });
  };
  handlephoneNumber = (e) => {
    this.setState({ phoneNumber: e.target.value });
  };
  handleEventPageReadestime = (e) => {};
  handleEventTimeZone = (e) => {};
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {};

  changePassword = async (event: React.FormEvent) => {
    const { newPassword, confirmPassword, oldPassword } = this.state;

    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password Not Same");
    } else if (!newPassword || !confirmPassword || !oldPassword) {
      alert("New Password, Confirm Password, and Old Password are Required");
    } else {
      event.preventDefault();

      var data: any = document.getElementById("cancelPasswordBtn");

      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;

      const { id } = this.state;

      const response = await fetch(
        "https://api.aimosa.io/Users/Changepassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
          body: JSON.stringify({
            id: id,
            oldPassword, // Include the old password
            Password: newPassword,
          }),
        }
      );
      console.log(oldPassword);
      console.log(confirmPassword);
      const responceData = await response.json();
      this.setState({ newPassword: "" });
      this.setState({ confirmPassword: "" });
      this.setState({ oldPassword: "" }); // Clear the old password

      data.click();
      toast("Password changed successfully");
      this.getProfile();

      const selectedPlan: any = document.querySelectorAll(".disableInput");
      if (selectedPlan.length > 0) {
        for (let i = 0; i < selectedPlan.length; i++) {
          selectedPlan[i].disabled = true;
          selectedPlan[i].classList.remove("editable");
        }
      }

      const clearEle: any = document.querySelectorAll(
        ".profileEditBtn.editableBtnOn"
      );
      for (var i = 0; i < clearEle.length; i++) {
        clearEle[i].classList.remove("editableBtnOn");
      }
    }
  };

  togglePasswordVisibility = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };
  passwordChangeCancelBtn() {}
  editCancelClick = () => {
    const selectedPlan: any = document.querySelectorAll(".disableInput");
    if (selectedPlan.length > 0) {
      for (let i = 0; i < selectedPlan.length; i++) {
        selectedPlan[i].disabled = true;
        selectedPlan[i].classList.remove("editable");
      }
    }
    const clearEle: any = document.querySelectorAll(
      ".profileEditBtn.editableBtnOn"
    );
    for (var i = 0; i < clearEle.length; i++) {
      clearEle[i].classList.remove("editableBtnOn");
    }
  };
  handleImageChange = (e) => {};

  handleImageUpload = async () => {
    console.log("avatar ", this.state.imageUplaod);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const { id } = this.state;
    const response = await fetch("https://api.aimosa.io/Users/ProfileImage", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: AuthToken,
      },
      body: JSON.stringify({
        id,
        image: this.state.imageUplaod,
      }),
    });
    const responceData = await response.json();
    console.log("res=", responceData);
  };
  getCurrencyType = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/MasterData/Profile_CurrencyTypeSelection",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      }
    );
    const responceData = await response.json();
    console.log("currency=", responceData.result.data.columns);
    console.log(this.state.pageReadestimate);

    console.log(responceData.result.data.columns);
    const currenctData: any = responceData.result.data.columns;
    this.setState({
      currencyTypeSelection: currenctData,
    });
    console.log("CurrencyCode ", this.state.currencyTypeSelection);
  };
  getTimeZoneSelection = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/MasterData/Profile_TimeZoneSelection",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      }
    );
    const responceData = await response.json();
    console.log("currency=", responceData.result.data.columns);
    console.log(responceData.result.data.columns);
    const currenctData: any = responceData.result.data.columns[0];
    this.setState({
      timeZoneSelection: currenctData,
    });
    console.log("timeZoneSelection ", this.state.timeZoneSelection);
  };
  getpageReadestimate = async () => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const response = await fetch(
      "https://api.aimosa.io/MasterData/Profile_Page_Read_Estimate",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      }
    );
    const responceData = await response.json();
    console.log("pageReadestimate=", responceData.result.data.columns);

    const pageReadestimate: any = responceData.result.data.columns[0].rate;
    this.setState({
      pageReadestimate: pageReadestimate,
    });
    console.log("pageReadestimate ", this.state.pageReadestimate);
  };
  handleFileChange = async (e) => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const selectedFile = e.target.files[0];

    try {
      if (selectedFile) {
        console.log("File selected:", selectedFile);

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.put(
          "https://api.aimosa.io/Users/ProfileImage",
          formData,
          {
            headers: {
              Authorization: AuthToken,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Image uploaded:", response.data);
        this.setState({ userimg: response.data.result.image });

        this.getProfile();
      } else {
        console.error("Please select a file to upload");
      }

      localStorage.removeItem("userImage");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  handleOldPasswordChange = (e) => {
    this.setState({ oldPassword: e.target.value });
  };
  render() {
    const { id, newPassword, confirmPassword, showPassword, oldPassword } =
      this.state;
    const labelStyle = {
      color: "#00976d", // Set color for the label text
    };

    console.log("New Password:", newPassword);

    return (
      <DashboardLayout>
        <div className="container-fluid my-accout-profile">
          <Row>
            <Col md={2}>
              <Navbar />
            </Col>
            <Col md={10}>
              <div className="container profileCard">
                <div className="profileHeading">
                  <h2
                    style={{
                      color: "#111827",
                      fontSize: "24px",
                      fontWeight: "500",
                    }}
                  >
                    My Profile
                  </h2>
                </div>
                <Row className="avartarheader">
                  <Col md={10}>
                    <Row>
                      <Col md={12} className="avatarNamediv">
                        <div className="avatarImg">
                          {this.state.userimg == null ? (
                            <> {/* Render nothing if userimg is null */}</>
                          ) : (
                            <img
                              src={this.state.userimg}
                              alt="avatar"
                              width={90}
                            />
                          )}
                        </div>
                        <div className="nameDiv">
                          <h5> {this.state.profileme} </h5>
                          <div className="emailPhoneField">
                            <div className="mailHead">
                              <div className="mail">
                                <img
                                  src={ProfileMailLogo}
                                  alt="mail-icon"
                                  width={20}
                                  height={20}
                                />
                                <p> {this.data.userEmail}</p>
                              </div>
                            </div>
                            <div className="phoneHead">
                              <div className="phone">
                                <img
                                  src={ProfilePhoneLogo}
                                  alt="mail"
                                  width={20}
                                  height={20}
                                />
                                {/* <p>{this.state.phoneNumber} */}
                                {this.state.phoneNumber == null ? (
                                  <>{this.state.phoneNumber}</>
                                ) : (
                                  <p> {this.state.phoneNumber}</p>
                                )}
                              </div>
                            </div>
                          </div>

                          <p>
                            <span className="uploadPictureLink">
                              {/* <button
                                onChange={(e) => this.handleFileChange(e)}
                                style={{ opacity: "0" }}
                              >
                                Choose File
                              </button>s
                              { <input */}
                              {/* <label htmlFor="inputElement" style={{ color: }}>Choose File</label>
                              <input
                                type="button"
                                id="inputElement"
                                // value={inputValue}
                                onChange={(e) => this.handleFileChange(e)}
                                style={{ opacity: "0" }}
                              /> */}
                              <label htmlFor="fileInput" style={labelStyle}>
                                UploadPicture
                              </label>
                              <input
                                type="file"
                                id="fileInput"
                                onChange={(e) => this.handleFileChange(e)}
                                style={{ display: "none" }}
                              />
                            </span>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={2}>
                    <div className="profileEditBtnContainer">
                      <button
                        className="profileEditBtn"
                        onClick={this.handleEditClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-pencil-fill me-2 mb-1"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  </Col>
                </Row>
                <Row className="profile-form">
                  <Col md={6}>
                    <Row>
                      <Col md={12}>
                        <label>Name</label>
                        <input
                          type="text"
                          disabled
                          className="form-control disableInput  "
                          value={this.state.profileme}
                          onChange={this.handleUserName}
                          // <h5> {this.state.profileme} </h5>
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <label>Mobile Number</label>
                        <input
                          type="number"
                          disabled
                          className="form-control disableInput  "
                          value={this.state.phoneNumber}
                          onChange={this.handlephoneNumber}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="sample">
                        <label>Password</label>
                        <div className="form-input">
                          <button
                            className="changePassword disableInput"
                            data-bs-toggle="modal"
                            data-bs-target="#changePasswordModel"
                            disabled
                          >
                            Change Password
                          </button>
                          <input
                            type="password"
                            disabled
                            value={this.state.password}
                            className="form-control disableInput"
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col md={6}>
                    <Row>
                      <Col md={12}>
                        <label>Currency Type Selection</label>
                        <select
                          className="form-select form-select-lg form-control drapDownDefaultSelectDarkColor disableInput"
                          aria-label=".form-select-lg example"
                          disabled
                          // value={this.state.currency}
                          onChange={(e) => this.handleEventCurrency(e)}
                        >
                          <option selected hidden>
                            {this.state.currency || "Select currency"}
                          </option>
                          {this.state.currencyTypeSelection.map((list, i) => (
                            <option value={list.currencyCodes}>
                              {list.countryCodes}
                            </option>
                          ))}
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <label>Page Read Estimate</label>
                        <select
                          className="form-select form-select-lg form-control drapDownDefaultSelectDarkColor disableInput"
                          aria-label=".form-select-lg example"
                          disabled
                          onChange={(e) => this.handleEventpageRead(e)}
                        >
                          <option selected hidden className="">
                            {this.state.pageReadestimateType ||
                              " Select pageReadestimate"}
                          </option>
                          <option key={1} value={this.state.pageReadestimate}>
                            {this.state.pageReadestimate}
                          </option>
                        </select>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <label>Time Zone Selection</label>
                        <select
                          className="form-select form-select-lg form-control drapDownDefaultSelectDarkColor  disableInput"
                          aria-label=".form-select-lg example"
                          disabled
                          // onChange={this.handleEventTimeZone}
                          onChange={(e) => this.handleEvent(e)}
                        >
                          <option selected hidden className="">
                            {this.state.timeZoneSelectiontType || "Select time"}
                          </option>
                          <option
                            key={1}
                            value={this.state.timeZoneSelection.EasternTimeZone}
                          >
                            {this.state.timeZoneSelection.EasternTimeZone}
                          </option>
                          <option
                            key={2}
                            value={this.state.timeZoneSelection.CentralTimeZone}
                          >
                            {this.state.timeZoneSelection.CentralTimeZone}
                          </option>
                          <option
                            key={3}
                            value={this.state.timeZoneSelection.WesternTimeZone}
                          >
                            {this.state.timeZoneSelection.WesternTimeZone}
                          </option>
                        </select>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div className="submitBtn">
                  <Col md={12}>
                    <button
                      className="cancelBtn"
                      onClick={this.editCancelClick}
                    >
                      Cancel
                    </button>
                    <button
                      className="saveChangesBtn"
                      onClick={this.saveChangesClick}
                    >
                      Save Changes
                    </button>
                  </Col>
                </div>
              </div>
            </Col>
          </Row>
          <div
            className="modal fade"
            id="changePasswordModel"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content changePasswordModel">
                <Row className="changePasswordHeading">
                  <Form id="passwordForm">
                    <Col md={12} className="changePasswordForm">
                      <div>
                        <h5 style={{ marginRight: "149px" }}>
                          Change Password
                        </h5>

                        <h6 className="single-line">
                          Change a New Password For : {this.data.userEmail}
                        </h6>
                      </div>{" "}
                      <div className="oldPassword">
                        <div className="form-input">
                          <label>Old Password</label>
                          <input
                            type="password"
                            placeholder="Enter your Old Password"
                            className="form-control"
                            onChange={this.handleOldPasswordChange}
                            value={oldPassword}
                          />
                        </div>
                      </div>
                      <div className="newPassword">
                        <div className="form-input">
                          <label>New Password</label>
                          <input
                            type="password"
                            placeholder="Enter your New Password"
                            className="form-control"
                            onChange={(e) =>
                              this.setState({ newPassword: e.target.value })
                            }
                            value={newPassword}
                          />
                        </div>
                      </div>
                      <div className="confirmPassword sample">
                        <label>Confirm Password</label>
                        <div className="form-input ">
                          <span
                            className="show-password"
                            onClick={this.togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <i className="fas fa-eye-slash"></i>
                            ) : (
                              <i className="fas fa-eye"></i>
                            )}
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Confirm"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) =>
                              this.setState({ confirmPassword: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </Col>
                    <div className="saveContent">
                      <button
                        type="reset"
                        className="cancelPasswordBtn"
                        id="cancelPasswordBtn"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={this.passwordChangeCancelBtn}
                      >
                        X
                      </button>
                      <button
                        type="button"
                        className="cangePasswordBtn"
                        onClick={this.changePassword}
                      >
                        Change Password
                      </button>
                    </div>
                  </Form>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}
