import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import { Form,Button,FloatingLabel } from 'react-bootstrap'
import { Link, Navigate, Route, useLocation,useHistory, useNavigate  } from 'react-router-dom';
import Clientform from '../Forms/Clientform';
import Footer from '../Footer/Footer';
function Clientpage() {

  // Add Change Method

  const [set,setSet]=useState("")

  useEffect(()=>{
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    setSet(myArray[2]);
  })

  return (
    <div>
      <Header />
      <Sidenav />
      <main id="main" class="main">
        <div class="pagetitle">
        <div className="row">
            <div className="col-md-12">
            <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/ClientManagement">Home</Link>
              </li>
              <li class="breadcrumb-item active">ClientManagement</li>
            </ol>
          </nav>
          </div>
          </div>


          <div className="row">
            <div className="col-md-6">
            <h1>Client Management</h1>
            </div>
    {set=="Edit"? <div style={{textAlign:"right"}} className="col-md-6">
            <Link
                // to={"/Clientpage/" + "Add"}
                to={"/ClientManagement"}
                style={{
                  float: "right",
                  marginBottom: "15px",
                  // marginTop: "10px",
                }}
                type="button"
                class="btn btn-primary"
              >
                Back
              </Link>
            </div>: <div  style={{textAlign:"right"}} className="col-md-6">
                  <Link to={"/ClientManagement"}
                 
                  style={{
                    float: "right",
                    marginBottom: "15px",
                  }}
                  type="button"
                  class="btn btn-primary"
                  >
                    Back
                  </Link>
              </div>}      
       

          </div>
            
        
        </div>

        {/* table */}

      <Clientform />
      
     
      </main>



    </div>
  )
}

export default Clientpage
