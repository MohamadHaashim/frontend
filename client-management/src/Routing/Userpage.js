import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate} from 'react-router-dom';
import {Form,Button} from 'react-bootstrap'
import Header from '../Header/Header';
import Sidenav from '../Sidenav/Sidenav';
import Userform from '../Forms/Userform';
function Userpage() {

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
                <Link to="/User">Home</Link>
              </li>
              <li class="breadcrumb-item active">User Management</li>
            </ol>
          </nav>
          </div>
          </div>


          
          <div className="row">
            <div className="col-md-6">
            <h1>User Management</h1>
            </div>
    {set=="Edit"? <div style={{textAlign:"right"}} className="col-md-6">
            <Link
                to={"/User"}
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
                  <Link to={"/User"}
                 
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

        <Userform />
       
        </main>
    </div>
  )
}

export default Userpage
