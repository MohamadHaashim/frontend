import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import { Link } from 'react-router-dom'
import TenentForm from '../Forms/TenentForm'
import SuperSidenav from '../Sidenav/SuperSidenav'
import SuperHeader from '../Header/SuperHeader'

function TenentPage() {
   // Add Change Method
  
   const [set,setSet]=useState("")

   useEffect(()=>{
     const queryParams = window.location.pathname;
     const myArray = queryParams.split("/");
   
     setSet(myArray[2]);
   })
  return (
    <div>
        <SuperHeader />
        <SuperSidenav />
        <main id="main" class="main">
        <div class="pagetitle">
        <div className="row">
            <div className="col-md-12">
            <nav>
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <Link to="/TenentManagement">Home</Link>
              </li>
              <li class="breadcrumb-item active">Tenant Management</li>
            </ol>
          </nav>
          </div>
          </div>


          <div className="row">
            <div className="col-md-6">
            <h1>Tenant Management</h1>
            </div>
    {set=="Edit"? <div style={{textAlign:"right"}} className="col-md-6">
            <Link
                to={"/TenentManagement"}
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
                  <Link to={"/TenentManagement"}
                 
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

        <TenentForm />
       
        </main>
    </div>
  )
}

export default TenentPage
