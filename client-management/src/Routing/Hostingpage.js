import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import {Form,Button} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Hostingform from '../Forms/Hostingform';

function Hostingpage() {

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
                <Link to="/Hosting">Home</Link>
              </li>
              <li class="breadcrumb-item active">Hosting</li>
            </ol>
          </nav>
          </div>
          </div>


          <div className="row">
            <div className="col-md-6">
            <h1>Hosting</h1>
            </div>
    {set=="Edit"? <div style={{textAlign:"right"}} className="col-md-6">
            <Link
                to={"/Hostingpage/" + "Add"}
                style={{
                  float: "right",
                  marginBottom: "15px",
                  // marginTop: "10px",
                }}
                type="button"
                class="btn btn-primary"
              >
                Add
              </Link>
            </div>: <div  style={{textAlign:"right"}} className="col-md-6">
                  <Link to={"/Hosting"}
                 
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

<Hostingform />

   
      </main>
    </div>
  )
}

export default Hostingpage
