import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  FloatingLabel,
  Spinner,
  FormLabel,
} from "react-bootstrap";
// import Multiselect from 'multiselect-react-dropdown';
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import Url from "../Api/Url";
import { toast } from "react-toastify";

function Clientform({ initialFileName }) {
  const Navigate = useNavigate();

  const [service, setService] = useState("");

  const [dropdownVisible, setDropdownVisible] = useState(false);

  // State to track loading status during login
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (id) => {
    setService(service, id);
    // console.log("erweererrer");
    console.log(JSON.stringify(service), "sfdfds");
    setDropdownVisible(false); // Hide dropdown after selection
  };

  //  contact person
  const [person, setPerson] = useState("No");

  // Function to handle radio button click for "Yes"
  const handleYesClick = () => {
    setPerson("Yes");
    console.log("yes");
  };

  // Function to handle radio button click for "No"
  const handleNoClick = () => {
    setPerson("No");
    console.log("no");
  };

  // Phone Validation

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const phone = value.replace(/[^0-9-+()]/g, "");
    setPhone(phone);
  };

  // Phone Validation

  const handlePhoneChange1 = (e) => {
    const value = e.target.value;
    const phone = value.replace(/[^0-9-+()]/g, "");
    setPhone1(phone);
  };
  // Parent Component Data Move Function
  const { state } = useLocation();

  //  Form Validation
  const [submit, setSubmit] = useState(false);

  // client create usestate method

  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [email1, setEmail1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [fileName, setFileName] = useState([]);

  // const [file, setFile] = useState(null);
  // set value for default selection
  const [selectedValue, setSelectedValue] = useState([]);
  const [img, setImg] = useState(null);
  const [imgId, setImgId] = useState("");

  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setImageName(selectedFile ? selectedFile.name : "");
  };

  //  Edit/Create Heading Changed Method
  const [set, setSet] = useState("");

  // Edit Api Id Set Up Method
  const [client_id, setId] = useState("");

  const [idd, setIdd] = useState("");

  useEffect(() => {
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    setIdd(myArray[3]);
    setSet(myArray[2]);

    if (myArray[2] != "Add") {
      getMethod(myArray[3]);
    }
  }, []);

  // client form close

  const clientForm = () => {
    setSubmit(false);
  };

  // client Create Api Start

  const clientCreate = async (e) => {
    e.preventDefault();
    setSubmit(true);
    setLoading(true);

    if (
      !clientName ||
      !email ||
      !phone ||
      !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)
    ) {
      return;
    }
    if (phone.length < 10 && phone.length > 0) {
      return;
    }
    if (phone1.length < 10 && phone1.length > 0) {
      return;
    }

    let token = localStorage.getItem("token");

    var bodyData = {};

    if (person == "Yes") {
      bodyData = {
        client_name: clientName,
        email: email,
        phone: phone,
        address: address,
        service_offer: selectedValue,
        img_id: img,
        userData: {
          user_name: name,
          emailId: email1,
          phone: phone1,
        },
      };
    } else {
      bodyData = {
        client_name: clientName,
        email: email,
        phone: phone,
        address: address,
        service_offer: selectedValue,
        img_id: img,
      };
    }
    const response = await fetch(Url.start + Url.clientCreate, {
      method: "POST",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },

      body: JSON.stringify(bodyData),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      setSubmit(false);
      setLoading(false);
      if (responceData.apiStatus.code == "200") {
        Navigate("/ClientManagement");
        toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // client edit api start

  const clientEdit = async () => {
    setSubmit(true);

    if (!clientName || !email || !phone) {
      return;
    }
    if (phone.length < 10 && phone.length > 0) {
      return;
    }

    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + "/client/update", {
      method: "PUT",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        id: idd,
        client_name: clientName,
        email: email,
        phone: phone,
        address: address,
        service_id: selectedValue,
        img_id: img,
        userData: {
          userName: name,
          email: email1,
          phone: phone1,
        },
      }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData);
      setSubmit(false);
      if (responceData.apiStatus.code == "200") {
        Navigate("/ClientManagement");
        toast.success(responceData.apiStatus.message);
      } else {
        toast.error(responceData.apiStatus.message);
      }
      console.log(fileName, "ssss");
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  // Client Get

  const getMethod = async (idd) => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.getApi + idd, {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      //   body: JSON.stringify({ }),
    });
    try {
      const responceData = await response.json();
      console.log(responceData, "praveen");
      var dat = responceData.result.clientData;
      console.log(dat, "j");

      setIdd(dat.id);
      setClientName(dat.client_name);
      setEmail(dat.email);
      setAddress(dat.address);
      setPhone(dat.phone);
      setName(dat.userData?.user_name);
      setEmail1(dat.userData?.email_id);
      setPhone1(dat.userData?.phone);

      setFileName(dat.serviceData);
      setSelectedValue(dat.serviceData.map((list) => list.service_id));

      setImgId(dat.imgData?.altered_file_name);
      setFile(dat.imgData?.altered_file_name);

      console.log(imgId);
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  //Client GetDropapi start

  const clientGetDrop = async () => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost/client_management_api/api/client/get/serviceofferedlist",
      {
        method: "GET",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token,
        },
        // body: JSON.stringify({}),
      }
    );
    try {
      const responceData = await response.json();
      console.log(responceData);
      // setDropDown(responceData.result.serviceData)
      // setService(responceData.result.serviceData[0].service_id)
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  //  Image Upload

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      // toast.error("Please select a file to upload.");
      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(Url.start + Url.imageUpload, {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      console.log(responseData);

      setImg(responseData.responseData.image_id);
      // console.log(responseData.responseData.image_id);
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

  const data = [
    {
      value: 1,
      label: "Domain",
    },
    {
      value: 2,
      label: "Hosting",
    },
  ];

  // handle onChange event of the dropdown
  const handleChange = (e) => {
    // console.log(e,"testing");
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
    console.log(JSON.stringify(selectedValue), "ryoeryfef");
  };

  // service offered

  const removeItem = (service_id) => {
    setFileName((prevFileName) =>
      prevFileName.filter((item) => item.service_id !== service_id)
    );
    setSelectedValue((prevSelectedValue) =>
      prevSelectedValue.filter((id) => id !== service_id)
    );
  };
  return (
    <div>
      <section class="section profile crud-top">
        <div className="card">
          <div className="card-body">
            <div className="row left-join">
              <div className="col-md-6">
                <h5 className="card-title">{set} Client</h5>
              </div>
            </div>

            <Form className="row g-3 left-join">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label class="required">Client Name</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="200"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    style={
                      submit && clientName.length == 0
                        ? { borderColor: "red" }
                        : { borderColor: "" }
                    }
                  />
                  {submit && clientName.length == 0 ? (
                    <div className="text-danger">Clientname is required</div>
                  ) : (
                    <></>
                  )}
                </Form.Group>
              </div>

              <div className="col-md-6">
                {set == "Add" ? (
                  <>
                    <Form.Label>Client Image</Form.Label>
                    <div className="input-group border-3">
                      <Form.Group style={{ width: "100%" }}>
                        <Form.Control
                          type="file"
                          name="file"
                          // value={file}
                          readOnly
                          onChange={handleSubmit}
                        />
                      </Form.Group>
                    </div>
                  </>
                ) : (
                  <>
                    <Form.Label>Client Image</Form.Label>
                    <div className="input-group border-3">
                      <Form.Group style={{ width: "100%" }}>
                        <Form.Control
                          type="file"
                          name="file"
                          // value={file}
                          readOnly
                          onChange={handleSubmit}
                        />
                      </Form.Group>
                      {imgId ? <span>Image Name : {imgId}</span> : <></>}
                    </div>
                  </>
                )}
              </div>

              {/* {client} */}

              <div class="col-md-6">
                {set == "Add" ? (
                  <Form.Group>
                    <Form.Label className="required">Email</Form.Label>
                    <Form.Control
                      type="email"
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
                        {submit &&
                          !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                            <div className="text-danger">
                              Invalid email format
                            </div>
                          )}
                      </>
                    )}
                  </Form.Group>
                ) : (
                  <Form.Group>
                    <Form.Label className="required">Email</Form.Label>
                    <Form.Control
                      type="email"
                      maxlength="200"
                      disabled
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
                        {submit &&
                          !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                            <div className="text-danger">
                              Invalid email format
                            </div>
                          )}
                      </>
                    )}
                  </Form.Group>
                )}
              </div>
              <div class="col-md-6">
                <Form.Group>
                  <Form.Label className="required">Phone</Form.Label>
                  <Form.Control
                    type="text"
                    maxlength="12"
                    value={phone}
                    onChange={handlePhoneChange}
                    style={
                      submit && (phone.length < 10 || phone.length === 0)
                        ? { borderColor: "red" }
                        : {}
                    }
                  />
                  {submit && phone.length == 0 ? (
                    <div className="text-danger">Phone number is required</div>
                  ) : (
                    <></>
                  )}
                  {submit && phone.length < 10 && phone.length > 0 && (
                    <div className="text-danger">
                      Phone number should be at least 10 digits
                    </div>
                  )}
                </Form.Group>
              </div>

              <div class="col-md-6">
                <Form.Group>
                  <Form.Label>Service Offered</Form.Label>

                  <Select
                    className="dropdown"
                    checked={selectedValue}
                    value={data.filter((obj) =>
                      selectedValue.includes(obj.value)
                    )} // set selected values
                    options={data}
                    onChange={handleChange}
                    isMulti
                    isClearable
                  />

                  {set == "Edit" ? (
                    <div>
                      {fileName.map((item, index) => (
                        <li style={{ display: "inline" }} key={index}>
                          {item.service_name}{" "}
                          <button
                            className="bbb"
                            type="button"
                            onClick={() => removeItem(item.service_id)}
                          >
                            x
                          </button>
                        </li>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label>Address</Form.Label>
                  <FloatingLabel
                    controlId="floatingTextarea"
                    // label="Comments"
                  >
                    <Form.Control
                      value={address}
                      as="textarea"
                      placeholder="Leave a comment here"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
              </div>

              {/* contact person */}
              {set === "Add" && (
                <div className="col-md-12">
                  <Form.Label>
                    Contact Person :{" "}
                    <span className="yes-no">
                      <input
                        type="radio"
                        name="person"
                        value="Yes"
                        onClick={handleYesClick}
                        checked={person === "Yes"}
                      />{" "}
                      Yes{" "}
                      <input
                        type="radio"
                        name="person"
                        value="No"
                        onClick={handleNoClick}
                        checked={person === "No"}
                      />{" "}
                      No{" "}
                    </span>{" "}
                  </Form.Label>
                </div>
              )}

              {/* Form fields */}
              {set === "Add" && person === "Yes" && (
                <>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label class="required">Username</Form.Label>
                      <Form.Control
                        type="email"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        style={
                          submit && name.length === 0
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                      />
                      {submit && name.length === 0 && (
                        <div className="text-danger">Username is required</div>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label class="required">Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email1}
                        onChange={(e) => setEmail1(e.target.value)}
                        style={
                          submit && email1.length === 0
                            ? { borderColor: "red" }
                            : {}
                        }
                      />
                      {submit && email1.length === 0 ? (
                        <div className="text-danger">Email is required</div>
                      ) : (
                        <>
                          {submit &&
                            !email1.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i) && (
                              <div className="text-danger">
                                Invalid email format
                              </div>
                            )}
                        </>
                      )}
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label class="required">Phone</Form.Label>
                      <Form.Control
                        type="email"
                        value={phone1}
                        maxLength="12"
                        onChange={handlePhoneChange1}
                        style={
                          submit && (phone1.length < 10 || phone.length === 0)
                            ? { borderColor: "red" }
                            : {}
                        }
                      />
                      {submit && phone1.length == 0 ? (
                        <div className="text-danger">
                          Phone number is required
                        </div>
                      ) : (
                        <></>
                      )}
                      {submit && phone1.length < 10 && phone.length > 0 && (
                        <div className="text-danger">
                          Phone number should be at least 10 digits
                        </div>
                      )}
                    </Form.Group>
                  </div>
                </>
              )}

              {/* {set==="Edit" && (name && email1 && phone1) ?
  <>
    <div className="col-md-4">
      <Form.Group>
        <Form.Label class="required">Username</Form.Label>
        <Form.Control
          type="email"
          disabled
          value={name} />
      </Form.Group>
    </div>
    <div className="col-md-4">
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          disabled
          value={email1} />
      </Form.Group>
    </div>
    <div className="col-md-4">
      <Form.Group>
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="email"
          disabled
          value={phone1} />
      </Form.Group>
    </div>
  </>
  :
  <h5 onClick={() => console.log("Clicked to show why")}>Client With User Not Mapping</h5>
} */}

              {set === "Edit" && name && email1 && phone1 ? (
                <>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label class="required">Username</Form.Label>
                      <Form.Control type="email" disabled value={name} />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" disabled value={email1} />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control type="email" disabled value={phone1} />
                    </Form.Group>
                  </div>
                </>
              ) : set === "Edit" && !name && !email1 && !phone1 ? (
                <>
                  <div className="row">
                    <div className="col-md-4"></div>
                    <div style={{ paddingTop: "25px" }} className="col-md-4">
                      <div className="card outline">
                        <Form.Label style={{ textAlign: "center" }}>
                          User Not Mapped With Client
                        </Form.Label>
                      </div>
                    </div>
                    <div className="col-md-4"></div>
                  </div>
                </>
              ) : null}

              {/* {set === "Edit" && (
                <>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label class="required">Username</Form.Label>
                      <Form.Control
                        type="email"
                        disabled
                        value={name}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        disabled
                        value={email1}
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group>
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="email"
                        disabled
                        value={phone1}
                      />
                    </Form.Group>
                  </div>
                </>
              )}  */}
            </Form>
            <div class="text-center" style={{ paddingTop: "15px" }}>
              <Button
                onClick={() => {
                  clientForm();
                  Navigate("/ClientManagement");
                }}
                className="user-left"
                variant="secondary"
              >
                Close
              </Button>
              {set == "Add" ? (
                <Button onClick={clientCreate} variant="primary">
                  Add
                </Button>
              ) : (
                <Button onClick={clientEdit} variant="primary">
                  Update
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Clientform;
