import React, { useEffect, useState } from "react";
import Head from "../../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody, FormGroup } from "reactstrap";
import {
  Block,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "../../../../components/Component";
import { countryOptions, userData } from "./UserData";
import { getDateStructured } from "../../../../utils/Utils";
import axios from "axios";
import Url from "../../../../Api";

const UserProfileRegularPage = ({ setProfileName }) => {
  const [modalTab, setModalTab] = useState("1");
  const [userInfo, setUserInfo] = useState([]);
  const [formData, setFormData] = useState({
    userName: " ",
    email: "",
    phonenumber: "",
    dateOfBirth: "",
    addressLine1: " ",
    addressLine2: "",
    state: "",
    country: "",
  });
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {

    axios.get(Url.api + Url.userGetById + userId).then((res) => {
      setUserInfo(res.data.result);
      localStorage.setItem("userEmail", res.data.email);
      setFormData((prevFormData) => ({
        ...prevFormData,
        userName: res.data.result.userName || "",
        phonenumber: res.data.result.phonenumber || "",
        email: res.data.result.email || "",
        dateOfBirth: res.data.result.dateOfBirth || "",
        addressLine1: res.data.result.addressList?.[0]?.addressLine1 || "",
        addressLine2: res.data.result.addressList?.[0]?.addressLine2 || "",
        state: res.data.result.addressList?.[0]?.state || "",
        country: res.data.result.addressList?.[0]?.country || "",
        notification: res.data.result.notifications || ""
      }));
      console.log(formData);
    });
  }, []);

  // useEffect(() => {
  //   setProfileName(formData.name);
  // }, [formData, setProfileName]);

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = () => {
    let submitData = {
      ...formData,
    };
    console.log(submitData);
    const UpdateData = {
      userId: userId,
      userName: submitData.userName,
      phoneNumber: submitData.phonenumber,
      email: submitData.email,
      dateOfBirth: submitData.dateOfBirth,
      addressLine1: submitData.addressLine1,
      addressLine2: submitData.addressLine2,
      state: submitData.state,
      country: submitData.country,
      alerts: submitData.notification[0].alerts ? submitData.notification[0].alerts : false,
      browserCheck: submitData.notification[0].browserCheck ? submitData.notification[0].browserCheck : false,
      newsletters: submitData.notification[0].newsletters ? submitData.notification[0].newsletters : false,
      featureUpdates: submitData.notification[0].featureUpdates ? submitData.notification[0].featureUpdates : false,
      accountTips: submitData.notification[0].accountTips ? submitData.notification[0].accountTips : false,
    };
    console.log(UpdateData);

    axios.put(Url.api + Url.userUpdate, UpdateData).then((res) => {
      console.log(res);
      localStorage.setItem("userName", submitData.userName);
      setUserInfo((user) => ({
        ...user,
        userName: submitData.userName,
        email: submitData.email,
        phonenumber: submitData.phonenumber,
        dateOfBirth: submitData.dateOfBirth,
        addressList: [
          {
            addressLine1: submitData.addressLine1,
            addressLine2: submitData.addressLine2,
            state: submitData.state,
            country: submitData.country,
          },
        ],
      }));
      setModal(false);
      setModal1(false);
    });
  };

  return (
    <React.Fragment>
      <Head title="Account - Profile"></Head>
      <Block className="pt-3 pt-md-5">
        {/* <div className="alert alert-warning">
          <div className="alert-cta flex-wrap flex-md-nowrap">
            <div className="alert-text">
              <p>Upgrade your account to unlock full features.</p>
            </div>
            <ul className="alert-actions gx-3 mt-3 mb-1 my-md-0">
              <li className="order-md-last">
                <a href="#" className="btn btn-sm btn-warning">
                  Upgrade
                </a>
              </li>
              <li>
                <a href="#" className="link link-primary">
                  Learn More
                </a>
              </li>
            </ul>
          </div>
        </div> */}
        <BlockHead>
          <BlockHeadContent>
            <BlockTitle tag="h5">Profile</BlockTitle>
            <BlockDes>
              <p>Basic info, like your name and address, that you use on Headlinema.</p>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>
        <div className="nk-data data-list">
          <div className="data-head">
            <h6 className="overline-title">Basics</h6>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Full Name</span>
              <span className="data-value">{userInfo.userName}</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#link"
                className="link link-primary"
              >
                Change
              </a>
            </div>
          </div>
          {/* <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Display Name</span>
              <span className="data-value">{userInfo.displayName}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div> */}
          <div className="data-item">
            <div className="data-col">
              <span className="data-label">Email</span>
              <span className="data-value">{userInfo.email}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more disable">
                <Icon name="lock-alt"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Phone Number</span>
              <span className="data-value text-soft">{userInfo.phonenumber}</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#link"
                className="link link-primary"
              >
                Change
              </a>
            </div>
          </div>
          {/* <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Date of Birth</span>
              <span className="data-value">{userInfo.dateOfBirth}</span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div>
          <div className="data-item" onClick={() => setModal(true)}>
            <div className="data-col">
              <span className="data-label">Address</span>
              <span className="data-value">
                {userInfo?.addressList && userInfo.addressList[0] && (
                  <>
                    {userInfo.addressList[0].addressLine1}
                    <br />
                    {userInfo.addressList[0].state}, {userInfo.addressList[0].country}
                  </>
                )}
              </span>
            </div>
            <div className="data-col data-col-end">
              <span className="data-more">
                <Icon name="forward-ios"></Icon>
              </span>
            </div>
          </div> */}
        </div>
        <div className="nk-data data-list">
          <div className="data-head">
            <h6 className="overline-title">Preferences</h6>
          </div>
          {/* <div className="data-item">
            <div className="data-col">
              <span className="data-label">Language</span>
              <span className="data-value">English (United State)</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#language"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="link link-primary"
              >
                Change Language
              </a>
            </div>
          </div> */}
          <div className="data-item" onClick={()=>setModal1(true)}>
            <div className="data-col">
              <span className="data-label">Date Format</span>
              <span className="data-value">MM/DD/YYYY</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#link"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="link link-primary"
              >
                Change
              </a>
            </div>
          </div>
          <div className="data-item" onClick={()=>setModal1(true)}>
            <div className="data-col">
              <span className="data-label">Timezone</span>
              <span className="data-value">Bangladesh (GMT +6)</span>
            </div>
            <div className="data-col data-col-end">
              <a
                href="#link"
                onClick={(ev) => {
                  ev.preventDefault();
                }}
                className="link link-primary"
              >
                Change
              </a>
            </div>
          </div>
        </div>
      </Block>

      <Modal isOpen={modal} className="modal-dialog-centered" size="md" toggle={() => setModal(false)}>
        <ModalBody>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setModal(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update Profile</h5>
            <ul className="nk-nav nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "1" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("1");
                  }}
                  href="#personal"
                >
                  Personal
                </a>
              </li>
              {/* <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "2" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("2");
                  }}
                  href="#address"
                >
                  Address
                </a>
              </li> */}
            </ul>
            <div className="tab-content">
              <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="full-name">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        className="form-control"
                        name="userName"
                        onChange={(e) => onInputChange(e)}
                        // value={formData.userName}
                        defaultValue={formData.userName}
                        placeholder="Enter Full name"
                      />
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="display-name">
                        Display Name
                      </label>
                      <input
                        type="text"
                        id="display-name"
                        className="form-control"
                        name="displayName"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.displayName}
                        placeholder="Enter display name"
                      />
                    </FormGroup>
                  </Col> */}
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="phone-no">
                        Phone Number
                      </label>
                      <input
                        type="number"
                        id="phone-no"
                        className="form-control"
                        name="phonenumber"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.phonenumber}
                        placeholder="Phone Number"
                      />
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="birth-day">
                        Date of Birth
                      </label>
                      <DatePicker
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        onChange={(date) =>
                          setFormData({ ...formData, dateOfBirth: date ? getDateStructured(date) : "" })
                        }
                        maxDate={new Date()}
                      />
                    </FormGroup>
                  </Col> */}
                  <Col size="12">
                    <div className="custom-control custom-switch">
                      <input type="checkbox" className="custom-control-input form-control" id="latest-sale" />
                      <label className="custom-control-label" htmlFor="latest-sale">
                        Use full name to display{" "}
                      </label>
                    </div>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={(ev) => {
                            ev.preventDefault();
                            submitForm();
                          }}
                        >
                          Update Profile
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                          }}
                          className="linkback"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              {/* <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="address-l1"
                        name="addressLine1"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.addressLine1}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="address-l2"
                        name="addressLine2"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.addressLine2}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-st">
                        State
                      </label>
                      <input
                        type="text"
                        id="address-st"
                        name="state"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.state}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-county">
                        Country
                      </label>
                      <RSelect
                        options={countryOptions}
                        placeholder="Select a country"
                        defaultValue={[
                          {
                            value: formData.country,
                            label: formData.country,
                          },
                        ]}
                        onChange={(e) => setFormData({ ...formData, country: e.value })}
                      />
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="lg" onClick={() => submitForm()}>
                          Update Address
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                          }}
                          className="linkback"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div> */}
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal isOpen={modal1} className="modal-dialog-centered" size="md" toggle={() => setModal1(false)}>
        <ModalBody>
          <a
            href="#dropdownitem"
            onClick={(ev) => {
              ev.preventDefault();
              setModal1(false);
            }}
            className="close"
          >
            <Icon name="cross-sm"></Icon>
          </a>
          <div className="p-2">
            <h5 className="title">Update Preferences</h5>
            <ul className="nk-nav nav nav-tabs">
              <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "1" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("1");
                  }}
                  href="#personal"
                >
                  Personal
                </a>
              </li>
              {/* <li className="nav-item">
                <a
                  className={`nav-link ${modalTab === "2" && "active"}`}
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModalTab("2");
                  }}
                  href="#address"
                >
                  Address
                </a>
              </li> */}
            </ul>
            <div className="tab-content">
              <div className={`tab-pane ${modalTab === "1" ? "active" : ""}`} id="personal">
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="full-name">
                        Date Format
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        className="form-control"
                        name="userName"
                        onChange={(e) => onInputChange(e)}
                        // value={formData.userName}
                        // defaultValue={formData.userName}
                        placeholder="MM/DD/YYYY"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="phone-no">
                        Timezone
                      </label>
                      <input
                        type="text"
                        id="full-name"
                        className="form-control"
                        name="phonenumber"
                        onChange={(e) => onInputChange(e)}
                        // defaultValue={formData.phonenumber}
                        placeholder="HH:MM:SS"
                      />
                    </FormGroup>
                  </Col>
                  {/* <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="birth-day">
                        Date of Birth
                      </label>
                      <DatePicker
                        selected={formData.dateOfBirth ? new Date(formData.dateOfBirth) : null}
                        dateFormat="dd/MM/yyyy"
                        className="form-control"
                        onChange={(date) =>
                          setFormData({ ...formData, dateOfBirth: date ? getDateStructured(date) : "" })
                        }
                        maxDate={new Date()}
                      />
                    </FormGroup>
                  </Col> */}

                  {/* <Col size="12">
                    <div className="custom-control custom-switch">
                      <input type="checkbox" className="custom-control-input form-control" id="latest-sale" />
                      <label className="custom-control-label" htmlFor="latest-sale">
                        Use full name to display{" "}
                      </label>
                    </div>
                  </Col> */}
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button
                          color="primary"
                          size="lg"
                          onClick={(ev) => {
                            ev.preventDefault();
                            submitForm();
                          }}
                        >
                          Update Profile
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal1(false);
                          }}
                          className="linkback"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
              {/* <div className={`tab-pane ${modalTab === "2" ? "active" : ""}`} id="address">
                <Row className="gy-4">
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="address-l1"
                        name="addressLine1"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.addressLine1}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-l2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        id="address-l2"
                        name="addressLine2"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.addressLine2}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-st">
                        State
                      </label>
                      <input
                        type="text"
                        id="address-st"
                        name="state"
                        onChange={(e) => onInputChange(e)}
                        defaultValue={formData.state}
                        className="form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="form-label" htmlFor="address-county">
                        Country
                      </label>
                      <RSelect
                        options={countryOptions}
                        placeholder="Select a country"
                        defaultValue={[
                          {
                            value: formData.country,
                            label: formData.country,
                          },
                        ]}
                        onChange={(e) => setFormData({ ...formData, country: e.value })}
                      />
                    </FormGroup>
                  </Col>
                  <Col size="12">
                    <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                      <li>
                        <Button color="primary" size="lg" onClick={() => submitForm()}>
                          Update Address
                        </Button>
                      </li>
                      <li>
                        <a
                          href="#dropdownitem"
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModal(false);
                          }}
                          className="linkback"
                        >
                          Cancel
                        </a>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div> */}
            </div>
          </div>
        </ModalBody>
      </Modal>

    </React.Fragment>
  );
};
export default UserProfileRegularPage;
