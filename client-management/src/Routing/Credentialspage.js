import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import{Form,Button} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import Credentialsform from '../Forms/Credentialsform';

function Credentialspage() {

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
                <Link to="/Credentials">Home</Link>
              </li>
              <li class="breadcrumb-item active">Service Provider Credentials</li>
            </ol>
          </nav>
          </div>
          </div>


          <div className="row">
            <div className="col-md-6">
            <h1>Service Provider Credentials</h1>
            </div>
    {set=="Edit"? <div style={{textAlign:"right"}} className="col-md-6">
            <Link
                to={"/Crendentials/" + "Add"}
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
                  <Link to={"/Credentials"}
                 
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

<Credentialsform />

    {/* <section class="section profile crud-top">
          <div className="card">
            <div className="card-body">
              <div className='row'>
                <div className='col-md-6'>
                <h5 className="card-title">
                     {set} Credentials
                  </h5>
                </div>
                <div className='col-md-6'>
                  <div className=' but-right card-title'>
                 <button  type="button"
                  class="btn btn-primary back-but" onClick={()=>navigate("/Credentials")}>Back</button>
                  </div>
                </div>
              </div>
                  
                  <Form>
                    <Form.Group>
                      <Form.Label>Url</Form.Label>
                      <Form.Control type="email"
                      onChange={(e)=>setUrl(e.target.value)}
                      style={submit&&url.length==0?{borderColor:"red"}:{borderColor:""}}
                      />
                      {submit&&url.length==0?<div className="text-danger">Url is required</div>:<></>}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>User Name</Form.Label>
                      <Form.Control type="email"
                       onChange={(e)=>setUserName(e.target.value)}
                       style={submit&&userName.length==0?{borderColor:"red"}:{borderColor:""}}
                      />
                      {submit&&userName.length==0?<div className="text-danger">Username is required</div>:<></>}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="email" 
                       onChange={(e)=>setPassword(e.target.value)}
                       style={submit&&password.length==0?{borderColor:"red"}:{borderColor:""}}
                      />
                      {submit&&password.length==0?<div className="text-danger">Password is required</div>:<></>}
                    </Form.Group>
                    <div className="text-center" style={{ paddingTop: "15px" }}>
                      <Button
                        onClick={()=>{closeBtn();navigate("/Credentials")}}
                        className="user-left"
                        variant="secondary"
                      >
                        Close
                      </Button>
             {set=="Add"?<Button onClick={submitBtn} variant="primary">Create</Button>: <Button onClick={submitBtn} variant="primary">Update</Button>}    
                     
                    </div>
                  </Form>
               
            </div>
            </div>
    </section> */}

      </main>
    </div>
  )
}

export default Credentialspage
