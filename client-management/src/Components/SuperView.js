import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Sidenav from "../Sidenav/Sidenav";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ClientManagement from "./ClientManagement";
import SuperSidenav from "../Sidenav/SuperSidenav";
import Url from "../Api/Url";

function View() {
  // Parent Component Data Move Function
  const { state } = useLocation();

  const navigate = useNavigate();

  const [pic, setPic] = useState("");

  //Get Create

  const [tenentName, setTenentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [address1, setAddress1] = useState("");
  const [name, setName] = useState("");
  const [email1, setEmail1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageName1, setImageName1] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    // setData(state)

    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");
    console.log(myArray[2]);
    getMethod(myArray[2]);

    console.log(state, "stateeeeeee");
  }, []);

  // Tenant Get

  const getMethod = async (id) => {
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start + Url.tenantGet + id, {
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " + token,
      },
      //   body: JSON.stringify({ }),
    });
    try {
      const responceData = await response.json();

      var dat = responceData.result.tenantData;
      console.log(dat, "dat");

      setId(dat.id);
      setTenentName(dat.tenant_name);
      setEmail(dat.email);
      setAddress(dat.address);
      setPhone(dat.phone);
      setName(dat.userData?.user_name);
      setEmail1(dat.userData?.email);
      setPhone1(dat.userData?.phone);
      setAddress1(dat.userData?.address);
      setImageName(dat.imageData?.altered_file_name);
      setImageName1(dat.userData.imageData1?.altered_file_name);

      //  console.log(dat.userData.imgData?.altered_file_name,"edwed");
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };

  const image = "D:Clients Management\new-projectpublicassetsimg\noimage.jpg";
  return (
    <div>
      <Header />
      <SuperSidenav />
      <main id="main" className="main">
        <div className="pagetitle">
          <div className="row">
            <div className="col-md-12">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/TenentManagement">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Tenant Management</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h1>Tenant Management View</h1>
            </div>
            <div style={{ textAlign: "right" }} className="col-md-6">
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
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div>
              <div>
                <div className="row outline m-1">
                  <div className="col-md-4 image-color">
                    <div className="images">
                      <img
                        className="img-jpg"
                        src={
                          imageName
                            ? Url.start + Url.imageShowed + imageName
                            : "/assets/img/noimages.jpg"
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="tenant-top">
                      <div className="tenant-bottom bold">
                        <h5>Tenant Name</h5>
                        <p className="h5-clr">{tenentName}</p>
                      </div>
                      <div className="tenant-bottom bold">
                        <h5>Email</h5>
                        <p className="h5-clr">{email}</p>
                      </div>
                      <div className="tenant-bottom bold">
                        <h5>Phone</h5>
                        <p className="h5-clr">{phone}</p>
                      </div>
                      <div className="tenant-bottom bold">
                        <h5>Address</h5>
                        <p className="h5-clr">{address}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div>
              <div>
                <div className="row outline m-1 tenatnt-ref-container">
                  <div className="col-md-12">
                    <div className="tenant-contact-ref-info-con">
                      <div className="contact-ref-title">Contact Persons Details</div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="row contact-ref-person-con">
                      <div className="col-md-12">
                        <div className="ref-title">Manager</div>
                      </div>
                      <div className="col-md-3 left">
                        <div className="image-ref">
                          <img className="img-jpg" src={
                              imageName1
                                ? Url.start + Url.imageShowed + imageName1
                                : "/assets/img/noimage.jpg"
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-9 right">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Contact Person Name</div>
                              <p className="h5-clr">{name}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Email</div>
                              <p className="h5-clr">{email1}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Phone</div>
                              <p className="h5-clr">{phone1}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Address</div>
                              <p className="h5-clr">{address1}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="row contact-ref-person-con">
                      <div className="col-md-12">
                        <div className="ref-title">Sales Man</div>
                      </div>
                      <div className="col-md-3 left">
                        <div className="image-ref">
                          <img className="img-jpg" src={
                              imageName1
                                ? Url.start + Url.imageShowed + imageName1
                                : "/assets/img/noimage.jpg"
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-9 right">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Contact Person Name</div>
                              <p className="h5-clr">{name}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Email</div>
                              <p className="h5-clr">{email1}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Phone</div>
                              <p className="h5-clr">{phone1}</p>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="contact-ref-details bold">
                              <div className="sub-title">Address</div>
                              <p className="h5-clr">{address1}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-8">
                        
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

   
      </main>


    </div>
  );
}

export default View;
