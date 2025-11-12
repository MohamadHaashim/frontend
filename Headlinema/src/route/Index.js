import React, { Suspense, useLayoutEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { RedirectAs404 } from "../utils/Utils";

import AccountOverview from "../pages/AccountOverview";

import UserProfile from "../pages/panel/crypto-panel/user/UserProfileLayout";
import Users from "../pages/users/Users";
import Schedule from "../pages/schedule/Schedule";
import Reports from '../ads/table/Reports';

const Pages = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });


  const spId = localStorage.getItem("spId");

  return (
    <Suspense fallback={<div />}>
      <Switch>
        {/*Dashboards*/}
        <Route exact path={`${process.env.PUBLIC_URL}/account-overview`} component={AccountOverview}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/users`} component={Users}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/schedules`} component={Schedule}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/Reports`} component={Reports}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/`}>
          <Redirect to={`${process.env.PUBLIC_URL}/auth-login`}></Redirect>
        </Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user/connections/`} component={UserProfile}></Route>
        <Route exact path={`${process.env.PUBLIC_URL}/user/profile/`} component={UserProfile}></Route>
        {/* <Route exact path={`${process.env.PUBLIC_URL}/user/settings/`} component={UserProfile}></Route> */}
        <Route exact path={`${process.env.PUBLIC_URL}/user/notifications/`} component={UserProfile}></Route>

        <Route component={RedirectAs404}></Route>
      </Switch>
    </Suspense>
  );
};
export default Pages;
