import React, { useEffect, useState } from 'react'
import { Button, FloatingLabel, Form } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom';
import Url from '../Api/Url';
import { toast } from 'react-toastify';

function TenentForm() {

  // Navigate Method
  const Navigate = useNavigate()

  // Parent Component Data Move Function
  const { state } = useLocation();


  // client create usestate method

  const [tenentName, setTenentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [address1, setAddress1] = useState("");
  const [name, setName] = useState("");
  const [email1, setEmail1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [password, setPassword] = useState("")
  const [linkedIn, setLinkedIn] = useState("")
  const [facebook, setFaceBook] = useState("")
  const [twitter, setTwitter] = useState("")
  const [instagram, setInstagram] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [idd, setIdd] = useState("");

  const [imgId1, setImgId1] = useState('')
  const [imgId2, setImgId2] = useState('')

  const [img, setImg] = useState(null)
  const [img1, setImg1] = useState(null)


  const [file, setFile] = useState(null);

  const [imgId, setImgId] = useState("")

  //  Edit/Create Heading Changed Method
  const [set, setSet] = useState("");

  //  Form Validation
  const [submit, setSubmit] = useState(false);

  // Phone Validation

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const phone = value.replace(/[^0-9-+()]/g, '');
    setPhone(phone);
  }

  // Phone Validation

  const handlePhoneChange1 = (e) => {
    const value = e.target.value;
    const phone = value.replace(/[^0-9-+()]/g, '');
    setPhone1(phone);
  }

  useEffect(() => {

    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    // setIdd(myArray[3])
    setSet(myArray[2]);
    setIdd(myArray[3])
    if (myArray[2] != "Add") {
      getMethod(myArray[3])
    }

  }, []);

  // Tenant Create

  const tenantCreate = async () => {
    // e.preventDefault();
    setSubmit(true);
    if (!tenentName || !address || !name || !address1) {
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }

    if (!email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    if (phone.length < 10 && phone.length > 0) {
      return;
    }
    if (phone1.length < 10 && phone1.length > 0) {
      return;
    }

    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.tenantCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({

        "tenantname": tenentName,
        "email": email,
        "phone": phone,
        "address": address,
        "img_id": img1,
        "userData": {
          "user_name": name,
          "emailId": email1,
          "phone": phone1,
          "password": password,
          "address": address1,
          "img_id": img,
          "twitter": twitter,
          "facebook": facebook,
          "instagram": instagram,
          "linkedin": linkedIn,


        }
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      Navigate("/TenentManagement");
      setSubmit(false);
      console.log(responceData.result.tenantData);

      if (responceData.apiStatus.code == "200") {
        toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };


  // Tenant Edit Api Start
  const tenantEdit = async (e) => {
    // e.preventDefault();
    setSubmit(true);

    if (!tenentName || !phone || !address || !name || !phone1) {
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }

    if (!email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    if (phone.length < 10 && phone.length > 0) {
      return;
    }
    if (phone1.length < 10 && phone1.length > 0) {
      return;
    }

    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.tenantEdit, {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "id": idd,
        "tenantname": tenentName,
        "email": email,
        "phone": phone,
        "address": address,
        "img_id": img1,
        "userData": {
          "user_name": name,
          "emailId": email1,
          "password": password,
          "phone": phone1,
          "address": address1,
          "img_id": img,
          "twitter": twitter,
          "facebook": facebook,
          "instagram": instagram,
          "linkedin": linkedIn

        }
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      Navigate("/TenentManagement");
      setSubmit(false);

      if (responceData.apiStatus.code == "200") {
        toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // Tenant Get

  const getMethod = async (idd) => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.tenantGet + idd, {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      //   body: JSON.stringify({ }),
    });
    try {
      const responceData = await response.json();

      var dat = responceData.result.tenantData
      console.log(dat, "dat");



      setIdd(dat.id)
      setTenentName(dat.tenant_name)
      setEmail(dat.email)
      setAddress(dat.address)
      setPhone(dat.phone)
      setName(dat.userData.user_name)
      setEmail1(dat.userData.email)
      setPhone1(dat.userData.phone)
      setAddress1(dat.userData.address)
      setPassword(dat.userData.password)
      setFaceBook(dat.userData.facebook)
      setInstagram(dat.userData.instagram)
      setTwitter(dat.userData.twitter)
      setLinkedIn(dat.userData.linkedin)
      setImgId1(dat.imageData?.altered_file_name)
      setImgId2(dat.userData.imageData1?.altered_file_name)

    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // Image Upload User

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(Url.start + Url.imageUpload, {
        method: "POST",
        body: formData
      });

      const responseData = await response.json();
      console.log(responseData);

      setImg(responseData.responseData.image_id)
      console.log(responseData.responseData.image_id);
      if (responseData.apiStatus.code === "200") {
        toast.success(responseData.apiStatus.message);
      } else {
        toast.error(responseData.apiStatus.message);
      }
    } catch (error) {
      console.log("Error handled =", error);
      toast.error("An error occurred while uploading the image.");
    }
  };


  // Image Upload Tenant

  const handleSubmit1 = async (e) => {
    e.preventDefault();



    const selectedFile = e.target.files[0];
    if (!selectedFile) {

      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(Url.start + Url.imageUpload, {
        method: "POST",
        body: formData
      });

      const responseData = await response.json();
      console.log(responseData);

      setImg1(responseData.responseData.image_id)
      console.log(responseData.responseData.image_id);
      if (responseData.apiStatus.code === "200") {
        toast.success(responseData.apiStatus.message);
      } else {
        toast.error(responseData.apiStatus.message);
      }
    } catch (error) {
      console.log("Error handled =", error);
      toast.error("An error occurred while uploading the image.");
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

            <div className="row left-join">
              <div className="col-md-12">
                <h5 className="card-title">{set} tenant</h5>
              </div>

            </div>

            <Form className="row g-3 left-join">

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label class="required">Tenant Name</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="200"
                    value={tenentName}
                    onChange={(e) => setTenentName(e.target.value)}
                    style={
                      submit && tenentName.length == 0
                        ? { borderColor: "red" }
                        : { borderColor: "" }
                    }
                  />
                  {submit && tenentName.length == 0 ? (
                    <div className="text-danger">Tenant name is required</div>
                  ) : (
                    <></>
                  )}

                </Form.Group>
              </div>
              <div className="col-md-6">
                {set == "Add" ? <><Form.Label>Tenant Image</Form.Label><div className="input-group border-3">
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Control
                      type="file"

                      name="file"
                      // value={file}
                      readOnly
                      onChange={handleSubmit1} />
                  </Form.Group>

                </div></> : <><Form.Label>Tenant Image</Form.Label><div className="input-group border-3">
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Control
                      type="file"

                      name="file"
                      // value={file}
                      readOnly
                      onChange={handleSubmit1} />
                  </Form.Group>

                  {imgId1 ? <span>Image Name : {imgId1}</span> : <></>}


                </div></>}
              </div>

              <div class="col-md-6">
                <Form.Group>
                  <Form.Label class="required">Email</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="200"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label class="required">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="12"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={
                      submit && (phone.length < 10 || phone.length === 0)
                        ? { borderColor: 'red' }
                        : {}
                    }
                  />
                  {submit && phone.length == 0 ? <div className='text-danger'>Phone number is required</div> : <></>}
                  {submit && phone.length < 10 && phone.length > 0 && (
                    <div className="text-danger">Phone number should be at least 10 digits</div>
                  )}

                </Form.Group>
              </div>

              <div className="col-md-12">
                <Form.Group className="mb-4">
                  <Form.Label className='required'>Address</Form.Label>
                  <FloatingLabel
                    controlId="floatingTextarea"
                  // label="Comments"
                  >
                    <Form.Control
                      value={address}
                      as="textarea"
                      placeholder="Leave a comment here"
                      onChange={(e) => setAddress(e.target.value)}
                      style={
                        submit && address.length == 0


                          ? { borderColor: 'red' }
                          : {}
                      }

                    />
                  </FloatingLabel>
                  {submit && address.length == 0 ? <div className='text-danger'>Address  is required</div> : <></>}
                </Form.Group>
              </div>

              <h5 style={{ paddingBottom: "10px" }}>Contact Person</h5>

              <div className="col-md-6">
                {set == "Add" ? <><Form.Label>User Image</Form.Label><div className="input-group border-3">
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Control
                      type="file"

                      name="file"
                      // value={file}
                      readOnly
                      onChange={handleSubmit} />
                  </Form.Group>

                </div></> : <><Form.Label>User Image</Form.Label><div className="input-group border-3">
                  <Form.Group style={{ width: "100%" }}>
                    <Form.Control
                      type="file"

                      name="file"
                      // value={file}
                      readOnly
                      onChange={handleSubmit} />
                  </Form.Group>
                  {imgId2 ? <span>Image Name : {imgId2}</span> : <></>}
                </div></>}
              </div>



              <div className="col-md-6">
                <Form.Group>
                  <Form.Label class="required">User Name</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="200"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={
                      submit && name.length == 0
                        ? { borderColor: "red" }
                        : { borderColor: "" }
                    }
                  />

                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label class="required">Email</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="200"
                    value={email1}
                    onChange={(e) => setEmail1(e.target.value)}
                    style={
                      submit && !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
                        ? { borderColor: "red" }
                        : {}
                    }
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

                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group>
                  <Form.Label class="required">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="12"
                    value={phone1}
                    onChange={handlePhoneChange1}
                    style={
                      submit && (phone1.length < 10 || phone.length === 0)
                        ? { borderColor: 'red' }
                        : {}
                    }
                  />
                  {submit && phone1.length == 0 ? <div className='text-danger'>Phone number is required</div> : <></>}
                  {submit && phone1.length < 10 && phone.length > 0 && (
                    <div className="text-danger">Phone number should be at least 10 digits</div>
                  )}

                </Form.Group>
              </div>
              {set == "Add" ? <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className='required'>Address</Form.Label>
                  <FloatingLabel
                    controlId="floatingTextarea"
                  // label="Comments"
                  >
                    <Form.Control
                      value={address1}
                      as="textarea"
                      placeholder="Leave a comment here"
                      onChange={(e) => setAddress1(e.target.value)}
                      style={
                        submit && address1.length == 0


                          ? { borderColor: 'red' }
                          : {}
                      }
                    />
                  </FloatingLabel>
                  {submit && address1.length == 0 ? <div className='text-danger'>Address  is required</div> : <></>}
                </Form.Group>

              </div> : <div className="col-md-12">
                <Form.Group className="mb-4">
                  <Form.Label className='required'>Address</Form.Label>
                  <FloatingLabel
                    controlId="floatingTextarea"
                  // label="Comments"
                  >
                    <Form.Control
                      value={address1}
                      as="textarea"
                      placeholder="Leave a comment here"
                      onChange={(e) => setAddress1(e.target.value)}
                      style={
                        submit && address1.length == 0


                          ? { borderColor: 'red' }
                          : {}
                      }
                    />
                  </FloatingLabel>
                  {submit && address1.length == 0 ? <div className='text-danger'>Address  is required</div> : <></>}
                </Form.Group>

              </div>}
              {set == "Add" ? <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="required">Password</Form.Label>
                  <div className="password-input-container">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      maxlength="200"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                </Form.Group>
              </div> :

                <></>
              }
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label className='mb-1'>Linked In</Form.Label>
                  <Form.Control
                    type="text"
                    value={linkedIn}
                    onChange={(e) => setLinkedIn(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label className='mb-1'>Facebook</Form.Label>
                  <Form.Control
                    type="text"
                    value={facebook}
                    onChange={(e) => setFaceBook(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label className='mb-1'>Instagram</Form.Label>
                  <Form.Control
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}

                  />


                </Form.Group>
              </div>
              <div className="col-md-3">
                <Form.Group>
                  <Form.Label className='mb-1'>Twitter</Form.Label>
                  <Form.Control
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </Form.Group>
              </div>

            </Form>

            <div class="text-center" style={{ paddingTop: "25px" }}>
              <Button
                onClick={() => {

                  Navigate("/TenentManagement");
                }}
                className="user-left"
                variant="secondary"
              >
                Close
              </Button>
              {set == "Add" ? (
                <Button onClick={tenantCreate} variant="primary">
                  Add
                </Button>
              ) : (
                <Button onClick={tenantEdit} variant="primary">
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>



    </div>
  )
}

export default TenentForm
