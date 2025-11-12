import React from 'react';
import Sidebar from '../../shared/Sidebar';
import Header from '../../shared/Header';
import Footer from '../../shared/Footer';
import { Container } from 'react-bootstrap';
import { Navigate } from "react-router-dom";
import './index.css';
// import { useIdleLogout } from "../../useIdleLogout";
interface Props {
  children: React.ReactNode
}

function DashboardLayout(props: Props) {
  // useIdleLogout()
  
  const path = window.location.pathname;
  let token = "";

  if (path.startsWith("/vendor")) {
    token = sessionStorage.getItem("vendorToken") || "";
    if (!token) return <Navigate to="/sign-in" />;
  } else if (path.startsWith("/super-admin")) {
    token = localStorage.getItem("superAdminToken") || "";
    if (!token) return <Navigate to="/super-admin/sign-in" />;
  }
  
  // if (!localStorage.getItem("userToken")) { return <Navigate to={"/sign-in"} />; }

  return (
    <>
      <div className="dashboard-maincontent">
        <Sidebar />
        <>{props.children}</>
      </div>
    </>
  );
}

// const DashboardLayout: React.FunctionComponent<Props> = (props:Props) => {
//     if (!localStorage.getItem("userToken")){return <Navigate to={"/sign-in"} />;}

//     return (
//       <Container className='admin-bg p-0 dashboard-layout' fluid>
//         <div className='sidebar-main-container'>
//           <Sidebar />
//         </div>
//         <div className='maincont'>
//           <Header />
//           <main>{props.children}</main>
//           <Footer />
//         </div>
//       </Container>
//     );
// }
export default DashboardLayout;