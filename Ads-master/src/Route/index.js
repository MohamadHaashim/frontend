import React, { lazy } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

const Dashboard = lazy(() => import("../views/pages/Dashboard"));
const Setting = lazy(() => import("../views/pages/Setting"));
const Sidebar = lazy(() => import("../views/layout/sidebar/Sidebar"));
const SignUp = lazy(() => import("../views/pages/SignUp"));
const Login = lazy(() => import("../views/pages/Login"));
const ForgotPassword = lazy(() => import("../views/pages/ForgotPassword"));
const ChangePassword = lazy(() => import("../views/pages/ChangePassword/ChangePassword"));

function RequireAuth() {
  let location = useLocation();
  const token = localStorage.getItem('customerAuthToken');
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

const Routing = () => {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/" element={<RequireAuth />}>
        <Route path="/dashboard" element={<Sidebar subpage={<Dashboard />} />} />
        <Route path="/settings" element={<Sidebar subpage={<Setting />} />} />
        <Route path="/changePassword" element={<Sidebar subpage={<ChangePassword />} />} />

      </Route>
    </Routes>
  );
};

export default Routing;
