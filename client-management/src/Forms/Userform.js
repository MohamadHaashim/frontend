import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap'
import Header from '../Header/Header';
import Sidenav from '../Sidenav/Sidenav';
import Url from '../Api/Url';
import { toast } from 'react-toastify';
function Userform() {

  const Navigate = useNavigate()


  // Parent Component Data Move Function 
  const { state } = useLocation();


  //  Form validation
  const [submit, setSubmit] = useState(false)

  // Phone Validation

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const phone = value.replace(/[^0-9-+()]/g, '');
    setPhone(phone);
  }

  // User Create Usestate Method
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [select, setSelect] = useState("");
  const [user_id, setId] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);

  //  Edit/Create Heading Changed Method 
  const [set, setSet] = useState("")


  // User Client Name Dropdown
  const [dropdown, setDropDown] = useState([])


  useEffect(() => {

    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    console.log(myArray[2]);
    setSet(myArray[2])
    // setId(myArray[3])

    if (myArray[2] != "Add") {

      getMethod(myArray[3])
    }

    clientGetDrop()

  }, [])

  //   client form close

  const closeBtn = () => {
    setSubmit(false);
  };


  //User Create Api Start

  const userCreate = async (e) => {
    e.preventDefault();
    setSubmit(true)
    if (!name || !select || !phone || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    if (phone.length < 10 && phone.length > 0) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.userCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({

        "userData": {
          "user_name": name,
          "emailId": email,
          "phone": phone,
          "client_id": select
        }
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);



      if (responceData.apiStatus.code == "200") {
        Navigate("/User")
        setSubmit(false)
        toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }


    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // User Edit Usestate Method

  const userEdit = async () => {
    // e.preventDefault();
    setSubmit(true)
    if (!phone || !name) {
      return;
    }
    if (phone.length < 10 && phone.length > 0) {
      return;
    }
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.userEdit, {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({

        "userData": {
          "id": user_id,
          "user_name": name,
          "email_id": email,
          "phone": phone,
          "client_id": select

        }
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      Navigate("/User")
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


  // Get Api

  const getMethod = async (user_id) => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.userGet + user_id, {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      //   body: JSON.stringify({ }),
    });
    try {
      const responceData = await response.json();
      console.log(dat, "praveen");

      var dat = responceData.result.userData

      console.log(dat, "dat");

      setId(dat.id);
      setName(dat.user_name)
      setEmail(dat.email_id)
      setPhone(dat.phone)
      setSelect(dat.client_id)
      console.log(dat.client_id);

    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  //User GetDropapi start

  const clientGetDrop = async () => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + "api/client/get/clientdroplist", {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      console.log(JSON.stringify(responceData.result.clientData));
      setDropDown(responceData.result.clientData)


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
      <section class="section profile crud-top">
        <div className="card">
          <div className="card-body">
            <div className='row left-join'>
              <div className='col-md-12'>
                <h5 className="card-title">
                  {set} User
                </h5>
              </div>

            </div>
            <Form className="row g-3 left-join">
              <div className="col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label class="required">
                    User Name{" "}
                    {/* <span style={{ fontSize: "19px" }} className="text-danger">
                    *
                  </span>{" "} */}
                  </Form.Label>
                  <Form.Control
                    value={name}
                    type="email"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="enter your user name"
                    style={
                      submit && name.length == 0
                        ? { borderColor: "red" }
                        : { borderColor: "" }
                    }
                  />
                  {submit && name.length == 0 ? (
                    <div className="text-danger">Username is required</div>
                  ) : (
                    <></>
                  )}

                </Form.Group>
              </div>


              {set == "Add" ? <div className="col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label class="required">Client Name </Form.Label>
                  <Form.Select value={select} size="xs" onChange={(e) => setSelect(e.target.value)} style={submit && select.length == 0 ? { borderColor: "red" } : { borderColor: "" }}>
                    <option hidden>Select</option>
                    {dropdown.map((item) => (
                      <option value={item.id}>{item.client_name}</option>
                    ))}

                  </Form.Select>
                  {submit && select.length == 0 ? <div className="text-danger">Select your client name</div> : <></>}
                </Form.Group>
              </div> : <div className="col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label class="required">Client Name </Form.Label>
                  <Form.Select value={select} size="xs" onChange={(e) => setSelect(e.target.value)} style={submit && select.length == 0 ? { borderColor: "red" } : { borderColor: "" }}>
                    {/* <option hidden>Select</option> */}
                    {dropdown.map((item) => (

                      <option value={item.id}>{item.client_name}</option>
                    ))}
                  </Form.Select>
                  {submit && select.length == 0 ? <div className="text-danger">Please select any type</div> : <></>}
                </Form.Group>
              </div>}



              <div class="col-md-6">
                {set == "Add" ? <Form.Group className="mb-1">

                  <Form.Label class="required">Email </Form.Label>
                  <Form.Control
                    value={email}
                    type="email"
                    maxlength="200"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={
                      submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
                        ? { borderColor: "red" }
                        : {}
                    }
                  />
                  {submit && email.length === 0 ? (
                    <div className="text-danger">Email is required</div>
                  ) : (
                    <>
                      {submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                        <div className="text-danger">Invalid email format</div>
                      )}
                    </>
                  )}

                </Form.Group> : <Form.Group className="mb-1">

                  <Form.Label class="required">Email </Form.Label>
                  <Form.Control
                    value={email}
                    disabled
                    name='email'
                    type="email"
                    maxlength="200"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={
                      submit && email.length === 0
                        ? { borderColor: "red" }
                        : {}
                    }
                  />

                  {submit && email.length === 0 ? (
                    <div className="text-danger">Email is required</div>
                  ) : (
                    <>
                      {submit && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                        <div className="text-danger">Invalid email format</div>
                      )}
                    </>
                  )}
                </Form.Group>
                }
              </div>
              <div class="col-md-6">
                <Form.Group className="mb-1">
                  <Form.Label class="required">Phone </Form.Label>
                  <Form.Control
                    value={phone}
                    maxLength="12"
                    type="text"
                    placeholder="Enter your phone number"
                    onChange={handlePhoneChange}
                    style={
                      submit && (phone.length < 10 || phone.length === 0)
                        ? { borderColor: 'red' }
                        : {}
                    }
                  />

                </Form.Group>
                {submit && phone.length == 0 ? <div className='text-danger'>Phone number is required</div> : <></>}
                {submit && phone.length < 10 && phone.length > 0 && (
                  <div className="text-danger">Phone number should be at least 10 digits</div>
                )}
              </div>

            </Form>
            <div class="text-center" style={{ paddingTop: "15px" }}>
              <Button onClick={() => { closeBtn(); Navigate("/User") }} className="user-left" variant="secondary">
                Close
              </Button>
              {set == "Add" ? <Button onClick={userCreate} variant="primary">Add</Button> : <Button onClick={userEdit} variant="primary">Update</Button>}

            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Userform
