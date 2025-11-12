import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {Button, Form} from 'react-bootstrap'
import { toast } from 'react-toastify'
import Url from '../Api/Url'
function Domainform() {
    const navigate = useNavigate()

 // Parent Component Data Move Function 
    const {state} = useLocation()

//  Edit/Create Heading Changed Method 
const [set,setSet]=useState("")

  //  Form validation
  const [submit,setSubmit]=useState(false)
  const [show,setShow] = useState(true)

// Edit Api Id Set Up Method
  const [domain_id,setId]=useState("")

   // Domain Client Name Dropdown

   const [dropdown,setDropDown]=useState([])
   const [dropdown1,setDropDown1]=useState([])

// Domain Create Usestate Method

const [domain,setDomain] =useState("")
const [client,setClient] =useState("")
const [record,setRecord] =useState("")
const [purchase,setPurchase] =useState("")
const [expiry,setExpiry] =useState("")
const [service,setService] =useState("")
const [notification,setNotification]=useState("Email")
const [interval,setInterval]= useState("")
const [prior,setPrior]= useState("")


const [sms,setSms]=useState("")

const [email1,setEmail1]=useState("")


// Notification Email/Sms Changed Function

const emailBtn=(e)=>{
  setNotification(e.target.value);
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
  console.log(phone)
}

// prior function
const priorBtn=(e)=>{
  if(e.target.value=="15 days"){
    setShow(true)
  }
  else{
    setShow(false)
  }
}




useEffect(()=>{

  const queryParams = window.location.pathname;
  const myArray = queryParams.split("/");
  console.log(myArray[2]);
  setSet(myArray[2])

  if(myArray[2] !="Add"){
    

    getMethod(myArray[3])

    
  }

  // console.log("starte",state);

  domainGetDrop()
  domainGetDrop1()
  
},[])



const handleEmailFocus = () => {
  setSms("");  // Clear the SMS field when focusing on the email field
};

const handleSmsFocus = () => {
  setEmail1("");  // Clear the email field when focusing on the SMS field
};

//Domain Create Api Start

const domainCreate = async () => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  
  setSubmit(true)


  if(!domain||!client||!purchase||!expiry||!interval||!prior||!service){
    return;
  }
  // if (email1 == "Email" && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
  //   return;
  // }
  if (email1 && email1 !== "Email" && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
    return;
  }
  if (sms.length < 10 && sms.length > 0) {
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
 
  const response = await fetch(Url.start +Url.domainCreate,{
    method: "POST",
    headers: {
      "content-type": "appilication/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      "domainData": {
        "domain_name":domain ,
        "client_id": client,
        "a_record": record,
        "purchase_date":purchase ,
        "expiry_date":expiry,
        "service_provider_id": service,
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
    console.log(responceData);
    console.log("prior"+email1);
    navigate("/Domain") 
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

//Domain Edit Api Start

console.log(sms);


const domainEdit = async () => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  setSubmit(true)

  if(!domain||!client||!purchase||!expiry||!notification||!interval||!prior||!service||!record){
    return;
   }

  //  if(!domain||!client||!purchase||!expiry||!notification||!interval||!prior||!service||!sms||!record){
  //   return;
  //  }

  if (email1 == "Email" && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
    return;
  }
    // let data="";
    // if(email1 != "Email"){
    //   data=sms
    //   console.log(sms);
      
    // }else{
    //   data=email1
    // }
    const data = notification === "Email" ? email1 : sms;
    console.log(sms,email1);
    
  
  const response = await fetch(Url.start +Url.domainEdit,{
    method: "PUT",
    headers: {
      "content-type": "appilication/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      "domainData": {
        "id":domain_id,
        "domain_name":domain ,
        "client_id": client,
        "a_record": record,
        "purchase_date":purchase ,
        "expiry_date":expiry,
        "service_provider_id": service,
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
    console.log(responceData);

     
    setSubmit(false)
     if (responceData.apiStatus.code == "200") {
      navigate("/Domain")
    toast.success( responceData.apiStatus.message);
    } else {
      toast.error(responceData.apiStatus.message);
    }

  } catch (error) {
    console.log("Error handled =" + error);
  }
};

//Domain GetDropapi start

const domainGetDrop = async () => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  const response = await fetch(Url.start + "api/domain/get/clientdroplist" ,{
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
    // console.log(JSON.stringify(responceData.result.clientData));
    setDropDown(responceData.result.clientData)

   
  } catch (error) {
    console.log("Error handled =" + error);
  }
};

//Domain GetDropapi start

const domainGetDrop1 = async () => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  const response = await fetch(Url.start + "api/domain/get/servicedroplist" ,{
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
    // console.log(JSON.stringify(responceData.result.clientData));
    setDropDown1(responceData.result.serviceData)

   
  } catch (error) {
    console.log("Error handled =" + error);
  }
};

// Get Api

const getMethod = async (domain_id) => {
  // e.preventDefault();
  let token = localStorage.getItem("token");
  const response = await fetch(Url.start+Url.domainGet+domain_id,{
    method: "GET",
    headers: {
      "content-type": "appilication/json",
      Authorization: "Bearer " +token,
    },
  //   body: JSON.stringify({ }),
  });
  try {
    const responceData = await response.json();
    console.log(dat,"praveen");
    var dat=  responceData.result

    console.log(dat,"kkkkk");
    setId(dat.id)
    setDomain(dat.domain_name)
    setClient(dat.client_id)
    setRecord(dat.a_record)
    setPurchase(dat.purchase_date)
    setExpiry(dat.expiry_date)
    setService(dat.service_provider_id)
    setNotification(dat.notification.notification_type)
    setPrior(dat.notification.notification_prior)
    setInterval(dat.notification.notification_interval)
    setEmail1(dat.notification.notification_data)

    if(dat.notification.notification_type=="Email"){
      setEmail1(state.notification.notification_data)
      setShow(true)
    }
    else {
      setSms(dat.notification.notification_data)
      setShow(false)
    }

    
  } catch (error) {
    console.log("Error handled =" + error);
  }
};
 
  return (
    <div>
       <section className="section profile crud-top">
          <div className="card">
            <div className="card-body">
            <div className='row left-join'>
                <div className='col-md-12'>
                <h5 className="card-title">
                     {set} Domain
                  </h5>
                </div>
               
              </div>
                  <Form className="row g-3 left-join">
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Label class="required">Domain Name</Form.Label>
                        <Form.Control type="text" 
                        value={domain}
                        maxlength="200"
                        onChange={(e)=>setDomain(e.target.value)}
                      style={submit&&domain.length==0?{borderColor:"red"}:{borderColor:""}}
                        />
                        {submit&&domain.length==0?<div className="text-danger">Domain name is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                      <Form.Group>
                        <Form.Label class="required">Client Name</Form.Label>
                        <Form.Select value={client} size="xs"  onChange={(e)=>setClient(e.target.value)} style={submit&&client.length==0?{borderColor:"red"}:{borderColor:""}}>
         {set=="Add"?  <option hidden>Select</option>:<></>}
                {dropdown.map((item)=>(

<option value={item.id}>{item.client_name}</option>
))}
                </Form.Select>
                        {submit&&client.length==0?<div className="text-danger">Select your client name</div>:<></>}
                      </Form.Group>
                    </div>
                    <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>A-Record</Form.Label>
                      <Form.Control type="text" 
                      value={record}
                       onChange={(e)=>setRecord(e.target.value)}
                      //  style={submit&&record.length==0?{borderColor:"red"}:{borderColor:""}}
                      />
                      {/* {submit&&record.length==0?<div className="text-danger">Record is empty</div>:<></>} */}
                    </Form.Group>
                    </div>
                    <div className="col-md-4">
                    <Form.Group>
                      <Form.Label className="required">Purchase Date</Form.Label>
                      <Form.Control type="date" 
                     value={purchase}
                       onChange={(e)=>setPurchase(e.target.value)}
                       style={submit&&purchase.length==0?{borderColor:"red"}:{borderColor:""}}
                      />
                      {submit&&purchase.length==0?<div className="text-danger">Purchase date is required</div>:<></>}
                    </Form.Group>
                    </div>
                    <div className="col-md-4">
                    <Form.Group>
                      <Form.Label  className="required">Expiry Date</Form.Label>
                      <Form.Control type="date" 
                      value={expiry}
                       onChange={(e)=>setExpiry(e.target.value)}
                       style={submit&&expiry.length==0?{borderColor:"red"}:{borderColor:""}}
                      />
                      {submit&&expiry.length==0?<div className="text-danger">Expirydate is required</div>:<></>}
                    </Form.Group>
                    </div>
                    <div className="col-md-4">
                    <Form.Group  className="mb-5">
                      <Form.Label className="required">Service Provider Credentials</Form.Label>
                      <Form.Select value={service} size="xs"  onChange={(e)=>setService(e.target.value)} style={submit&&service.length==0?{borderColor:"red"}:{borderColor:""}}>
                      {set=="Add"?  <option hidden>Select</option>:<></>}
                {dropdown1.map((item)=>(
<option value={item.id}>{item.service_name}</option>
))}
                </Form.Select>
                      {submit&&service.length==0?<div className="text-danger">Service is required</div>:<></>}
                    </Form.Group>
                    </div>
                    
                    <h5>Notification :</h5>
                    <div className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label class='required'>Notification Via</Form.Label>
                        <Form.Select onClick={(e)=>emailBtn(e)} size="xs" 
                        value={notification} onChange={(e)=>setNotification(e.target.value)}
                        style={submit&&notification.length==0?{borderColor:"red"}:{borderColor:""}}
                        >
                          {/* <option  hidden>Select</option> */}
                          <option value="Email"> Email</option>
                          <option value="Sms"> Sms</option>
                        </Form.Select>
                        {submit&&notification.length==0?<div className='text-danger'>Notification via is required</div>:<></>}
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
                      // onChange={(e)=>setSms(e.target.value)}
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
                     
                
                    <div className="col-md-6">
                      <Form.Group>
                        <Form.Label class='required'>Prior To</Form.Label>
                        <Form.Select value={prior} onChange={(e)=>setPrior(e.target.value)} style={submit && prior.length==0?{borderColor:"red"}:{borderColor:""}} size="xs">
                      {set=="Add"?<><option hidden>Select</option><option value="15 days">15 days</option><option value="10 days">10 days</option></>
                      :<><option value="15 days">15 days</option><option value="10 days">10 days</option></>}  
                          
                        </Form.Select>
                        {submit && prior.length==0?<div className="text-danger">Prior type is required</div>:<></>}
                      </Form.Group>
                    </div>
                    <div className="col-md-6">
                    <Form.Group>
                    <Form.Label class='required'>Notification Interval</Form.Label>
                        <Form.Select onChange={(e)=>setInterval(e.target.value)} style={submit && interval.length==0?{borderColor:"red"}:{borderColor:""}} size="xs">
                        {set=="Add"?<><option hidden>Select</option><option value="daily">Daily</option>
                        <option value="weekly">Weekly</option></>:<><option value="daily">Daily</option><option value="weekly">Weekly</option></>}
                          
                        </Form.Select>
                        {submit && interval.length==0?<div className="text-danger">Notification interval is required</div>:<></>} 
                      </Form.Group>
                    </div>


                    <div class="text-center" style={{ paddingTop: "15px" }}>
                      <Button
                        className="user-left"
                        onClick={()=>navigate("/Domain")}
                        variant="secondary"
                      >
                        Close
                      </Button>
            {set=="Add"?<Button onClick={domainCreate} variant="primary">Add</Button>:
             <Button onClick={domainEdit} variant="primary">Update</Button> }          
                     
                    </div>
                  </Form>
            </div>
        </div>
        </section>
    </div>
  )
}

export default Domainform
