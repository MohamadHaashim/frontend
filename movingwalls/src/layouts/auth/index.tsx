import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Navigate } from "react-router-dom";
import './index.css';
import { faker } from "@faker-js/faker";

interface Props {
  children: React.ReactNode
}

const AuthLayout: React.FunctionComponent<Props> = (props: Props) => {

  if (process.env.REACT_APP_MOCK_DATA === 'true') {
    localStorage.setItem("authToken", faker.string.uuid())
  }

  if (!localStorage.getItem("authToken")) { return <Navigate to={`${process.env.REACT_APP_BASE_PATH}/sign-in`} />; }

  return (
    <div className='admin-bg p-0 dashboard-layout'>
      <div className="main-container">
        <Header />
        <main>{props.children}</main>
        <Footer />
      </div>
    </div>
  );
}
export default AuthLayout;