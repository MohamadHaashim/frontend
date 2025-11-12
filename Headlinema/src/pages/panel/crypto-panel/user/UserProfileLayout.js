import React, { useState, useEffect } from "react";
import Content from "../../../../layout/content/Content";
import UserProfileRegularPage from "./UserProfileRegular";
import UserProfileSettingPage from "./UserProfileSetting";
import UserProfileNotificationPage from "./UserProfileNotification";
import UserProfileConnectedPage from "./UserProfileConnected";
import { Route, Switch,  NavLink } from "react-router-dom";
import { BlockDes, BlockHead, BlockHeadContent, BlockTitle, Icon, } from "../../../../components/Component";
import {  Nav, NavItem, Tooltip } from "reactstrap";

const UserProfileLayout = () => {
  const [tooltipOpen , setOpen] = useState(false);
  const toggle = () => {setOpen(!tooltipOpen)};

  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [profileName, setProfileName] = useState("ABC name");
  // const [userId, setuserId] = useState(null);

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };


  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document.getElementsByClassName("nk-header")[0].addEventListener("click", function () {
      updateSm(false);
    });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Content>
        <BlockHead>
          <BlockHeadContent>
            <BlockTitle tag="h2" className="fw-normal">Account</BlockTitle>
            <BlockDes>
            <p>You have full control to manage your own account setting. <span className="text-primary">
              <Icon name="info" id="id"></Icon></span>
              </p>
              <Tooltip placement="right" isOpen={tooltipOpen} target="id" toggle={toggle}>
                Tooltip on right
              </Tooltip>
            </BlockDes>
          </BlockHeadContent>
        </BlockHead>
        <Nav 
        className={`nk-nav nav nav-tabs ${
          sm ? "content-active" : ""
        }`}>
          <NavItem className="nav-item" onClick={() => updateSm(false)}>
            <NavLink
              to={`${process.env.PUBLIC_URL}/user/profile`}
              className={
                window.location.pathname === `${process.env.PUBLIC_URL}/user/profile` ? "nav-link active" : "nav-link"
              }
            >
              <span>Profile</span>
            </NavLink>
          </NavItem>
          {/* <NavItem className="nav-item" onClick={() => updateSm(false)}>
            <NavLink
              to={`${process.env.PUBLIC_URL}/user/settings`}
              className={
                window.location.pathname === `${process.env.PUBLIC_URL}/user/settings` ? "nav-link active" : "nav-link"
              }
            >
              <span>Settings</span>
            </NavLink>
          </NavItem> */}
          <NavItem className="nav-item" onClick={() => updateSm(false)}>
            <NavLink
              to={`${process.env.PUBLIC_URL}/user/notifications`}
              className={
                window.location.pathname === `${process.env.PUBLIC_URL}/user/notifications`
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              <span>Notifications</span>
            </NavLink>
          </NavItem>
          <NavItem className="nav-item" onClick={() => updateSm(false)}>
            <NavLink 
              to={`${process.env.PUBLIC_URL}/user/connections`}
              className={
                window.location.pathname === `${process.env.PUBLIC_URL}/user/connections` ? "nav-link active" : "nav-link"
              }
            >
              <span>Connections</span>
            </NavLink>
          </NavItem>
        </Nav>
        <div
              className={` ${
                sm ? "content-active" : ""
              }`}
            ></div>
        {sm && mobileView && <div onClick={() => updateSm(!sm)}></div>}
        <Switch>
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/user/profile`}
            render={() => <UserProfileRegularPage updateSm={updateSm} sm={sm} setProfileName={setProfileName} />}
          ></Route>
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/user/notifications`}
            render={() => <UserProfileNotificationPage updateSm={updateSm} sm={sm} />}
          ></Route>
          <Route
            exact
            path={`${process.env.PUBLIC_URL}/user/connections`}
            render={() => <UserProfileConnectedPage updateSm={updateSm} sm={sm} />}
          ></Route>
          {/* <Route
            exact
            path={`${process.env.PUBLIC_URL}/user/settings`}
            render={() => <UserProfileSettingPage updateSm={updateSm} sm={sm} />}
          ></Route> */}
        </Switch>
      </Content>
    </React.Fragment>
  );
};

export default UserProfileLayout;
