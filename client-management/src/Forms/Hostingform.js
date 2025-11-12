import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import {Form,Button,FloatingLabel} from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Url from '../Api/Url';
import { toast } from 'react-toastify';
function Hostingform() {

    const navigate = useNavigate()

    
   // Parent Component Data Move Function 
    const {state} = useLocation()

  
  //  Form validation
    const [submit, setSubmit] = useState(false);

    
// Edit Api Id Set Up Method
    const [host_id,setId]=useState("")
  
 
 
    const [show,setShow]=useState(true)


 // Hosting Client Name Dropdown
   const [dropdown,setDropDown]=useState([])
   const [dropdown1,setDropDown1]=useState([])
   
//  Edit/Create Heading Changed Method 
  const [set,setSet]=useState("")
     
 
// Hosting Create Usestate Method
  const [host_name,setHostName]= useState("")
  const [client,setClient]= useState("")
  const [server ,setServer]=useState("")
  const [primary,setPrimary]=useState("")
  const [product,setProduct]= useState("")
  const [plan,setPlan]= useState("")
  const [serverIp,setServerIp]= useState("")
  const [purchase,setPurchase]= useState("")
  const [expiry,setExpiry]= useState("")
  const [type,setType] = useState("")
  const [userName,setUserName]= useState("")
  const [password,setPassword]= useState("")
  const [key,setKey]= useState("")
  const [interval,setInterval]= useState("")
  const [prior,setPrior]= useState("")
  const [notification,setNotification]=useState("Email")
  const [showPassword, setShowPassword] = useState(false);

  const [sms,setSms]=useState("")

  const [email1,setEmail1]=useState("")

// console.log(state)
// Notification Email/Sms Changed Function

  const emailBtn=(e)=>{
    if(e.target.value=="Email"){
      setShow(true)
    }
    else {
      setShow(false)
    }
  }

//  Sms Validate

const handlePhoneChange=(e)=>{
  const value = e.target.value;
  const phone = value.replace(/[^0-9-+()]/g, '');
  setSms(phone);
}

   //   client form close
  
   const closeBtn = () => {
    // setTable(true);
    setSubmit(false);
  };

  
//   form validation
const submitBtn=()=>{
    setSubmit(true)
}



useEffect(()=>{
  
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    console.log(myArray[2]);
    setSet(myArray[2])
   

    if(myArray[2] !="Add"){
      getMethod(myArray[3])

    }
   

    domainGetDrop()
    domainGetDrop1()
 
  },[])

  const handleEmailFocus = () => {
    setSms("");  // Clear the SMS field when focusing on the email field
  };
  
  const handleSmsFocus = () => {
    setEmail1("");  // Clear the email field when focusing on the SMS field
  };
  

  //Hosting Create Api Start

  const hostingCreate = async () => {
    console.log("uheqdqed");
    // e.preventDefault();
    let token = localStorage.getItem("token"); 
    setSubmit(true)

    if(!host_name||!key||!client||!server||!type||!plan||!serverIp||!purchase||!expiry||!userName||!password){
      return;
    }
    
  // if (email1 == "Email" && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
  //   return;
  // }
  if (email1 && email1 !== "Email" && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
    return;
  }

    let data="";
    if(!email1){
      data=sms
    }else{
      data=email1
    }

    if(data==""){
      return
    }
    const response = await fetch(Url.start +Url.hostingCreate1,{
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "hostData": {
          "host_name": host_name,
          "client_id":client,
          "server_name":primary,
          "product": product,
          "plan": plan,
          "server_ip": serverIp,
          "service_provider_id":server ,
          "purchase_date":purchase,
          "expiry_date": expiry,
          "service_credentials": {
              "type_id": type,
              "user_name":userName,
              "password": password,
              "key": key
          },
          "notification": {
              "notification_type": notification,
              "notification_data": data,
              "notification_prior": prior,
              "notification_interval": interval
          }
      }
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      navigate("/Hosting") 
      setSubmit(false)
   

       if (responceData.apiStatus.code == "200") {
      toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }
      
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };


  //Hosting Edit Api Start

  const hostingEdit = async (e) => {
    e.preventDefault();
   
    setSubmit(true)
    if(!host_name||!server||!product||!type||!plan||!serverIp||!purchase||!expiry||!userName||!password){
      return;
    }
  
    if (email1 == "Email" && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    if (sms.length < 10 && sms.length > 0) {
      return;
    }
      // let data="";

      // if(!email1){
      //   data=sms
      // }else{
      //   data=email1
      // }
      const data = notification === "Email" ? email1 : sms;
 
      if(data==""){
        return
      }
      
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start+ Url.hostingEdit1,{
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "hostData": {
            "id": host_id,
            "host_name": host_name,
            "client_id": client,
            "server_name": primary,
            "product":product,
            "plan":plan,
            "server_ip": serverIp,
            "service_provider_id": server,
            "purchase_date": purchase,
            "expiry_date":expiry,
            "service_credentials": {
                "type_id": type,
                "user_name": userName,
                "password": password,
                "key": key
            },
            "notification": {
                "notification_type": notification,
                "notification_data":data,
                "notification_prior": prior,
                "notification_interval": interval
            }
        }
    
      }),
    });
    try {
      const responceData = await response.json();
      console.log("tryrty"+JSON.stringify(responceData));
      
      console.log(server,"server");
      
      if (responceData.apiStatus.code == "200") {
        navigate("/Hosting")
        setSubmit(false)
      toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }

    
     
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  //Hosting GetDropapi start

const domainGetDrop = async () => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  const response = await fetch(Url.start +Url.hostingGetDrop2,{
    method: "GET",
    headers: {
      "content-type": "appilication/json",
      Authorization: "Bearer " +token,
    },
    // body: JSON.stringify({}),
  });
  try {
    const responceData = await response.json();
    console.log(responceData);
    setDropDown(responceData.result.clientData)

   
  } catch (error) {
    console.log("Error handled =" + error);
  }
};

const domainGetDrop1 = async () => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  const response = await fetch(Url.start +Url.hostingGetDrop1,{
    method: "GET",
    headers: {
      "content-type": "appilication/json",
      Authorization: "Bearer " +token,
    },
    // body: JSON.stringify({}),
  });
  try {
    const responceData = await response.json();
    console.log(responceData);
    setDropDown1(responceData.result.serviceData)

   
  } catch (error) {
    console.log("Error handled =" + error);
  }
};

// Get Api

const getMethod = async (host_id) => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  const response = await fetch(Url.start + Url.hostGet + host_id,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },

  });
  try {
    const responceData = await response.json();
    console.log(dat,"praveen");
    var dat=  responceData.result

    console.log(dat,"rrrrrrrr");
    
      setId(dat.hostData.id)
      setHostName(dat.hostData.host_name)
      setClient(dat.hostData.client_id)
      setServer(dat.serviceProvider.serviceProvider_id)
      setProduct(dat.hostData.product)
      setPrimary(dat.hostData.server_name)
      setServerIp(dat.hostData.server_ip)
      setPlan(dat.hostData.plan)
      setPurchase(dat.hostData.purchase_date)
      setExpiry(dat.hostData.expiry_date)
      setKey(dat.service_credentials.key)
      setUserName(dat.service_credentials.user_name)
      setPassword(dat.service_credentials.password)
      setType(dat.service_credentials.type_id) 
      setNotification(dat.notification.notification_type)
      setPrior(dat.notification.notification_prior)
      setInterval(dat.notification.notification_interval)


 
      console.log(dat.hostData.plan);
    
    if(dat.notification.notification_type=="Email"){
      setEmail1(dat.notification.notification_data)
      setShow(true)
    }
    else {
      setShow(false)
      setSms(dat.notification.notification_data)
    }

    
  } catch (error) {
    console.log("Error handled =" + error);
  }
};

  // Password Eyes
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div>
       <section className="section profile crud-top">
          <div className="card">
            <div className="card-body">
            <div className='row left-join'>
                <div className='col-md-12'>
                <h5 className="card-title">
                     {set} Hosting
                  </h5>
                </div>
               
              </div>

              
                  <Form  className="row g-3 left-join">
                  <div class="col-md-6">
                    <Form.Group>
                      <Form.Label className="required">Host Name</Form.Label>
                      <Form.Control type="email"
                      value={host_name}
                      maxlength="200"
                      onChange={(e)=>setHostName(e.target.value)}
                      style={
                        submit && host_name.length == 0
                          ? { borderColor: "red" }
                          : { borderColor: "" }
                      }
                      />
                      {submit && host_name.length==0?<div className="text-danger">Host name is required</div>:<></>}
                    </Form.Group>
                    </div>
                    <div class="col-md-6">
                      <Form.Group>
                        <Form.Label className="required">Client Name</Form.Label>
                        <Form.Select value={client} size="xs"  onChange={(e)=>setClient(e.target.value)} style={submit&&client.length==0?{borderColor:"red"}:{borderColor:""}}>
           {set=="Add"? <option hidden>Select</option>:<></>}
                      {dropdown.map((list)=>(
                        <option value={list.id}>{list.client_name}</option>
                      ))}
                </Form.Select>
                        {submit &&  client.length==0?<div className="text-danger">Client name is required</div>:<></>}
                      </Form.Group>
                    </div>

                    <div class="col-md-4">
                      <Form.Group>
                        <Form.Label class="required">Service Provider Credentials</Form.Label>
                        <Form.Select value={server} size="xs"  onChange={(e)=>setServer(e.target.value)} style={submit&& server.length==0?{borderColor:"red"}:{borderColor:""}}>
        {set=="Add"? <option hidden>Select</option>:<></>}       
                {dropdown1.map((list)=>(
<option value={list.id}>{list.service_name}</option>
))}
                </Form.Select>
                        {submit && server.length==0?<div className="text-danger">Service name is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <div class="col-md-4">
                      <Form.Group>
                        <Form.Label>Product</Form.Label>
                        <Form.Control type="text" 
                        value={product}
                         onChange={(e)=>setProduct(e.target.value)}
                        //  style={
                        //   submit && product.length == 0
                        //     ? { borderColor: "red" }
                        //     : { borderColor: "" }
                        // }
                        />
                        {/* {submit && product.length==0?<div className="text-danger">Product name is empty</div>:<></>} */}
                      </Form.Group>
                    </div>
                    <div class="col-md-4">
                      <Form.Group>
                        <Form.Label>Primary Domain</Form.Label>
                        <Form.Control type="text" 
                        value={primary}
                         onChange={(e)=>setPrimary(e.target.value)}
                        //  style={
                        //   submit && primary.length == 0
                        //     ? { borderColor: "red" }
                        //     : { borderColor: "" }
                        // }
                        />
                        {/* {submit && primary.length==0?<div className="text-danger">Primary domain name is empty</div>:<></>} */}
                      </Form.Group>
                    </div>
                    <div class="col-md-6">
                      <Form.Group>
                        <Form.Label className="required">Plan</Form.Label>
                        <Form.Control type="text" 
                        value={plan}
                         onChange={(e)=>setPlan(e.target.value)}
                         style={
                          submit && plan.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        />
                        {submit && plan.length==0?<div className="text-danger">Plan is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <div class="col-md-6">
                      <Form.Group>
                        <Form.Label className="required">Server IP</Form.Label>
                        <Form.Control type="text" 
                        value={serverIp}
                         onChange={(e)=>setServerIp(e.target.value)}
                         style={
                          submit && serverIp.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        />
                        {submit && serverIp.length==0?<div className="text-danger">Server Ip is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <div class="col-md-6">
                      <Form.Group>
                        <Form.Label  className="required">Purchase Date</Form.Label>
                        <Form.Control type="date" 
                        value={purchase}
                         onChange={(e)=>setPurchase(e.target.value)}
                         style={
                          submit && purchase.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        />
                        {submit && purchase.length==0?<div className="text-danger">Purchase date is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                      <Form.Group className='mb-5'>
                        <Form.Label  className="required">Expiry Date</Form.Label>
                        <Form.Control type="date" 
                        value={expiry}
                         onChange={(e)=>setExpiry(e.target.value)}
                         style={
                          submit && expiry.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        />
                        {submit && expiry.length==0?<div className="text-danger">Expiry date is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <h5>Server Credentials :</h5>
                    <div className="col-md-6">
                      <Form.Group className="mb-3">
                        <Form.Label class="required">Type</Form.Label>
                        <Form.Select size="xs" 
                        value={type}
                         style={
                          submit && type.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        onChange={(e)=>setType(e.target.value)}
                        >
                  {set=="Add"? <option hidden>Select</option>:<></>}
                          <option value="1">cPanel</option>
                          <option value="2">Plesk</option>
                          <option value="3">AWS</option>
                         
                        </Form.Select>
                        
                        {submit && type.length==0?<div className="text-danger">Please select server credentials type</div>:<></>}
                      </Form.Group>
                      <Form.Group className='mb-3 hos'>
                        <Form.Label class="required">Password</Form.Label>
                        <div className='password-input-container'>
                        <Form.Control type={showPassword ? "text" : "password"}
                        value={password}
                          onChange={(e)=>setPassword(e.target.value)}
                          style={
                            submit && password.length == 0
                              ? { borderColor: "red" }
                              : { borderColor: "" }
                          }
                        />
                               <i
                  className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                  id="togglePassword"
                  onClick={togglePasswordVisibility}
              
                ></i>
                        </div>
                       
                        {submit && password.length==0?<div className="text-danger">Password is required</div>:<></>}
                      </Form.Group>
                     
                    </div>
                    <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label class="required">User Name</Form.Label>
                        <Form.Control type="email" 
                        value={userName}
                        onChange={(e)=>setUserName(e.target.value)}
                         style={
                          submit && userName.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        />
                 
                        {submit && userName.length==0?<div className="text-danger">Username is required</div>:<></>}
                      </Form.Group>
                     
                      <Form.Group className="mb-5">
                        <Form.Label class="required">Key</Form.Label>
                        <FloatingLabel>
        <Form.Control
        value={key}
        onChange={(e)=>setKey(e.target.value)}
        style={{
          height: '100px',
          borderColor: submit && key.length === 0 ? 'red' : ''
        }}
          as="textarea"
          placeholder="Leave a comment here"
          // style={{ height: '100px' }}
        />
      </FloatingLabel>
                        {/* <Form.Control type="email" 
                        value={key}
                        onChange={(e)=>setKey(e.target.value)}
                        style={
                          submit && key.length == 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        /> */}
                        {submit && key.length==0?<div className="text-danger">Key is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <h5>Notification :</h5>
                    <div className="col-md-6">
                       <Form.Group className="mb-3">
                        <Form.Label class="required">Notification Via</Form.Label>
                        <Form.Select value={notification} onClick={(e)=>emailBtn(e)} size="xs" onChange={(e)=>setNotification(e.target.value)} style={submit&&notification.length==0?{borderColor:"red"}:{borderColor:""}} >
                          <option value="Email"> Email</option>
                          <option value="Sms"> Sms</option>
                        </Form.Select>
                        {submit && notification.length==0?<div className='text-danger'>Notification via is required</div>:<></>}
                      </Form.Group>

                   </div>  
                  
                  
                 <div className='col-md-6'>
     
                 {show? 
                      <><Form.Label class='required'>Email</Form.Label>
                      <Form.Control type="text"
                      value={email1}
                      style={
                        submit && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
                          ? { borderColor: "red" }
                          : {}
                      }
                      onChange={(e)=>setEmail1(e.target.value)}
                      onFocus={handleSmsFocus}
                      />
                       {submit && email1.length === 0 ? (
    <div className="text-danger">Email is required</div>
  ) : (
    <>
      {submit && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
        <div className="text-danger">Invalid email format</div>
      )}
    </>
  )}
                    
                      </>                  
                     :
                      <><Form.Label class="required">Sms</Form.Label>
                      <Form.Control type="text" 
                        value={sms}
                        maxLength="12"
                      style={submit&&sms.length==0?{borderColor:"red"}:{borderColor:""}}
                      //  onChange={(e)=>setSms(e.target.value)}
                      onChange={handlePhoneChange}
                      onFocus={handleEmailFocus}
                      />
                       {submit&&sms.length==0?<div className='text-danger'>Sms is required</div>:<></>}
                       {submit && sms.length < 10 && sms.length > 0 && (
                    <div className="text-danger">Phone number should be at least 10 digits</div>
                  )}
                      </>
                      }
                    
                    </div>

                    {/* onClick={(e)=>priorBtn(e)} */}

                    <div className="col-md-6">
                    <Form.Group>
                    <Form.Label class="required">Prior To</Form.Label>
                        <Form.Select value={prior}    onChange={(e)=>setPrior(e.target.value)} style={submit&&prior.length==0?{borderColor:"red"}:{borderColor:""}}  size="xs">
                    {set=="Add"?<option hidden>Select</option>:<></>}  
                      <option value="15">15 days</option>
                      <option value="10">10 days</option>
                       
                        </Form.Select> 
                        {submit && prior.length==0?<div className="text-danger">Prior type is required</div>:<></>}
                      </Form.Group>

                    </div>
                    
                    <div className="col-md-6">
                    <Form.Group>
                    <Form.Label class="required">Notification Interval</Form.Label>
                        <Form.Select value={interval} onChange={(e)=>setInterval(e.target.value)} style={submit && interval.length==0?{borderColor:"red"}:{borderColor:""}} size="xs">
                  {set=="Add"? <option  hidden>Select</option>:<></>}       
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                        </Form.Select>
                        {submit && interval.length==0?<div className="text-danger">Interval type is required</div>:<></>} 
                      </Form.Group>
                    </div>
                    
                    
                    <div className="text-center" style={{ paddingTop: "15px" }}>
                      <Button
                        onClick={()=>{closeBtn();navigate("/Hosting")}}
                        className="user-left"
                        variant="secondary"
                      >
                        Close
                      </Button>
                      {set=="Add"? <Button onClick={hostingCreate} variant="primary">Add</Button>:<Button onClick={hostingEdit} variant="primary">Update</Button>}     
                      
                    </div>
                  </Form>

            
              
            </div>
            </div>
    </section>
    </div>
  )
}

export default Hostingform
