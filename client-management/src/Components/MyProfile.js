import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import Sidenav from '../Sidenav/Sidenav'
import { Link, useNavigate } from 'react-router-dom'
import Url from '../Api/Url';
import { toast } from 'react-toastify';
import { FadeLoader } from 'react-spinners';

function MyProfile() {


    let userName = localStorage.getItem("userName")
    let id = localStorage.getItem("id")

    const navigate= useNavigate("")


   

    // User Profile

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("")
  const [name, setName] = useState("");
  const [imgId,setImgId]=useState("")
  const [linkedIn,setLinkedIn]=useState("")
  const[facebook,setFaceBook]=useState("")
  const[twitter,setTwitter]=useState("")
  const[instagram,setInstagram]=useState("")
  const [imgDataId,setImgDataId]=useState("")
  const [img,setImg]=useState("")
  const [loading,setLoading]=useState(true)

  const [user_id,setId]=useState("")
  // const [iddd,setIdd]=useState(null)
  const [delete_id,setIdd]=useState('')
  
  const [file, setFile] = useState(null);
 
     
    const [password,setPassword]=useState("")
    const [password1,setPassword1]=useState("")
    const [password2,setPassword2]=useState("")
    const [submit,setSubmit]=useState(false)
    
   const [showPassword, setShowPassword] = useState(false);

   useEffect(()=>{
getMethod(id)
setTimeout(() => {
  setLoading(false);
}, 1500);
   },[])



   // Reset Api Start 

    const changee = async (e) => {
       e.preventDefault();
       setSubmit(true)
       if(!password||!password1||!password2){
         return;
         
       }
       // console.log("fgctyfty");
       let token = localStorage.getItem("token");
       const response = await fetch(Url.start + Url.change,{
         method: "POST",
         headers: {
           "content-type": "appilication/json",
           Authorization: "Bearer " + token,
         },
         body: JSON.stringify({
           "currentPassword": password,
           "newPassword": password1
         }),
       });
       try {
         const responceData = await response.json();
         console.log(responceData);
         
           setSubmit(false)
           if(responceData.code=="200"){
             toast.success(responceData.message)
             navigate("/Dashboard")
           }
           else{
             toast.error(responceData.message)
           }
         
   
       } catch (error) {
         console.log("Error handled =" + error);
       }
     };

           // Password Eyes
  const togglePasswordVisibility = () => {
   setShowPassword(!showPassword);
 };

    // User Get

  const getMethod = async (id) => {
    // e.preventDefault();
    let token = localStorage.getItem("token");
    const response = await fetch(Url.start+Url.userProfile+id,{
      method: "GET",
      headers: {
        "content-type": "appilication/json",
        Authorization: "Bearer " +token,
      },
    //   body: JSON.stringify({ }),
    });
    try {
      const responceData = await response.json();
    
    var dat=  responceData.result.adminData
    console.log(dat,"dat");
      setId(dat.id)
      setName(dat.user_name)
      setEmail(dat.email)
      setAddress(dat.address)
      setPhone(dat.phone)
      setFaceBook(dat.facebook)
      setInstagram(dat.instagram)
      setTwitter(dat.twitter)
      setLinkedIn(dat.linkedin)
     setImgId(dat.imageData?.altered_file_name)
     setImgDataId(dat.imageData.img_id)
     setImg(dat.imageData.img_id)
    } catch (error) {
      console.log("Error handled =" + error);
    }
  };


  // /Image Upload User

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      // toast.error("Please select a file to upload.");
      return;
    }
  
    setFile(selectedFile); // Set the file state
  
    const formData = new FormData();
    formData.append('file', selectedFile); // Use selectedFile directly

    try {
      const response = await fetch(Url.start+Url.imageUpload, {
        method: "POST",
        body: formData  
      });

      const responseData = await response.json();
      console.log(responseData);

      setImg(responseData.responseData.image_id)
      // setImgId(responseData.result.adminData.imageData.img_id)
      // console.log(responseData.result.adminData.imageData.img_id);
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




    // Tenant Edit Api Start
    const userProfileEdit = async (e) => {
      // e.preventDefault();
      setSubmit(true);
      setLoading(false)
    
     if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/i)) {
      return;
    }
    
     
      let token = localStorage.getItem("token");
      const response = await fetch(Url.start + Url.userProfileUpdate, {
        method: "PUT",
        headers: {
          "content-type": "appilication/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
        
      "userData": {
          "id":user_id,
          "user_name":name ,
          "emailId": email,
          "phone": phone,
          "address":address,
          "img_id":img,
          "twitter":twitter,
          "facebook":facebook,
          "instagram":instagram,
          "linkedin":linkedIn,
          
          
      }
        }),
      });
      try {
        const responceData = await response.json();
        console.log(responceData);
       
        setSubmit(true);
       
        if (responceData.apiStatus.code == "200") {        
          toast.success(responceData.apiStatus.message);
        //  navigate("/MyProfile")
        // getMethod()
        window.location.reload();
         setLoading(false) 
        } else {
          toast.error(responceData.apiStatus.message);
        }
      } catch (error) {
        console.log("Error handled =" + error);
      }
    };


    // Image Delete

    
    const userImageDelete = async () => {
      let token = localStorage.getItem("token");
      const response = await fetch(Url.start + Url.userProfileDelete+user_id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
    
      try {
        const responseData = await response.json();
        if (responseData.apiStatus.code === "200") {
          toast.success(responseData.apiStatus.message);
         getMethod()
        } else {
          toast.error(responseData.apiStatus.message);
        }
      } catch (error) {
        console.log("Error handled =" + error);
      }
    };
   
    
  return (
    <div>
      <Header />
      <Sidenav />
      <main id="main" className="main">
      <div className="pagetitle">
        <div className="row">
            <div className="col-md-12">
              <nav>
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/ClientManagement">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Profile</li>
                </ol>
              </nav>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
            <h1>Profile</h1>
            </div>
             
          </div>


        </div>

        {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                    <FadeLoader color="#36d7b7" />
                  </div>
                ) :   <section style={{paddingTop:"20px"}} class="section profile">
                <div class="row">
                  <div class="col-xl-4">
          
                    <div class="card">
                      <div class="profiles card-body profile-card pt-4 d-flex flex-column align-items-center">
          
                        {/* <img src="assets/img/selvam.JPEG" alt="Profile" class="rounded-circle" /> */}
                        <img
                     class="rounded-circle"
                     src={imgId?Url.start+Url.imageShowed+imgId:"/assets/img/noimages.jpg"}
          
                    />
                        <h2>{userName}</h2>
                        
                        <div class="social-links mt-2">
                          <a href={twitter?twitter:"https://twitter.com/?lang=en"} class="twitter" target="_blank"><i class="bi bi-twitter"></i></a>
                          <a href={facebook?facebook:"https://www.facebook.com/"} class="facebook" target="_blank"><i class="bi bi-facebook"></i></a>
                          <a href={instagram?instagram:"https://www.instagram.com/accounts/login/?hl=en"} class="instagram" target="_blank"><i class="bi bi-instagram"></i></a>
                          <a href={linkedIn?linkedIn:"https://www.linkedin.com/login"} class="linkedin" target="_blank"><i class="bi bi-linkedin"></i></a>
                        </div>
                      </div>
                    </div>
          
                  </div>
          
                  <div class="col-xl-8">
          
                    <div class="card">
                      <div class="card-body pt-3">
                      <ul class="nav nav-tabs nav-tabs-bordered">
          
                          <li class="nav-item">
                            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                          </li>
          
                          <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                          </li>
          
                         
                          <li class="nav-item">
                            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                          </li>
          
                        </ul>
          
          
                        <div class="tab-content pt-2">
          
          <div class="tab-pane fade show active profile-overview" id="profile-overview">
           
            <h5 class="card-title">Profile Details</h5>
          
            <div class="row">
              <div class="col-lg-3 col-md-4 label ">Full Name</div>
              <div class="col-lg-9 col-md-8">{name}</div>
            </div>
          
            <div class="row">
              <div class="col-lg-3 col-md-4 label">Address</div>
              <div class="col-lg-9 col-md-8">{address}</div>
            </div>
          
            <div class="row">
              <div class="col-lg-3 col-md-4 label">Phone</div>
              <div class="col-lg-9 col-md-8">{phone}</div>
            </div>
          
            <div class="row">
              <div class="col-lg-3 col-md-4 label">Email</div>
              <div class="col-lg-9 col-md-8">{email}</div>
            </div>
          
          </div>
          
          <div class="tab-pane fade profile-edit pt-3" id="profile-edit">
          
           
            <form>
              <div class="row mb-3">
                <label for="profileImage" class="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                <div class="col-md-8 col-lg-9">
                  <img
                      className='img-jpg'
                    
                      src={imgId?Url.start+Url.imageShowed+imgId:"/assets/img/noimages.jpg"}
          
                    />
                                  <div class="pt-2">
                                    
                                    {/* <a  style={{marginRight:"5px"}} href="#" class="btn btn-primary btn-sm" title="Upload new profile image"><input style={{display:"none"}} type="file" /><i class="bi bi-upload"></i></a> */}
                                    <a
                                          href="#"
                                          class="btn btn-primary btn-sm "
                                          title="Upload new profile image" 
                                          style={{marginRight:"5px"}}
                                        >
                                          <label for='file'>
                                          <i class="bi bi-upload" style={{color:'white',cursor:'pointer'}}></i>
                                          </label>
                                          <input id='file' onChange={handleSubmit} type="file"></input>
                                        </a>
          
                                   

                                    <Link href="#"   data-bs-toggle="modal"  data-bs-target="#delete"
        className="btn btn-danger btn-sm" title="Remove my profile image">
        <i className="bi bi-trash"></i>
      </Link> 
                                  
                                  </div>
                </div>
              </div>
          
          
          
              <div class="row mb-3">
                <label for="fullName" class="col-md-4 col-lg-3 col-form-label"> Name</label>
                <div class="col-md-8 col-lg-9">
                  <input name="fullName" onChange={(e)=>setName(e.target.value)} type="text" class="form-control" id="fullName" value={name}/>
                </div>
              </div>
          
          
              <div class="row mb-3">
                <label for="Address" class="col-md-4 col-lg-3 col-form-label">Address</label>
                <div class="col-md-8 col-lg-9">
                  <input name="address" onChange={(e)=>setAddress(e.target.value)} type="text" class="form-control" id="Address" value={address}/>
                </div>
              </div>
          
              <div class="row mb-3">
                <label for="Phone" class="col-md-4 col-lg-3 col-form-label">Phone</label>
                <div class="col-md-8 col-lg-9">
                  <input name="phone" onChange={(e)=>setPhone(e.target.value)} type="text" class="form-control" id="Phone" value={phone} />
                </div>
              </div>
          
              <div class="row mb-3">
                <label for="Email" class="col-md-4 col-lg-3 col-form-label">Email</label>
                <div class="col-md-8 col-lg-9">
                  <input name="email" onChange={(e)=>setEmail(e.target.value)} type="email" class="form-control" id="Email" value={email} />
                </div>
              </div>
          
                              <div class="row mb-3">
                                <label for="Twitter" class="col-md-4 col-lg-3 col-form-label">Twitter Profile</label>
                                <div class="col-md-8 col-lg-9">
                                  <input name="twitter" onChange={(e)=>setTwitter(e.target.value)} type="text" class="form-control" id="Twitter" value={twitter}/>
                                </div>
                              </div>
          
                              <div class="row mb-3">
                                <label for="Facebook" class="col-md-4 col-lg-3 col-form-label">Facebook Profile</label>
                                <div class="col-md-8 col-lg-9">
                                  <input name="facebook" onChange={(e)=>setFaceBook(e.target.value)} type="text" class="form-control" id="Facebook" value={facebook}/>
                                </div>
                              </div>
          
                              <div class="row mb-3">
                                <label for="Instagram" class="col-md-4 col-lg-3 col-form-label">Instagram Profile</label>
                                <div class="col-md-8 col-lg-9">
                                  <input name="instagram" onChange={(e)=>setInstagram(e.target.value)} type="text" class="form-control" id="Instagram" value={instagram}/>
                                </div>
                              </div>
          
                              <div class="row mb-3">
                                <label for="Linkedin" class="col-md-4 col-lg-3 col-form-label">Linkedin Profile</label>
                                <div class="col-md-8 col-lg-9">
                                  <input name="linkedin" onChange={(e)=>setLinkedIn(e.target.value)} type="text" class="form-control" id="Linkedin" value={linkedIn}/>
                                </div>
                              </div>
          
                              <div class="text-center">
                                <button onClick={userProfileEdit} type="submit" class="btn btn-primary">Save Changes</button>
                              </div>
          
          
            </form>
          
          </div>
          
          
          
          <div class="tab-pane fade pt-3" id="profile-change-password">
          
          <form class="row  g-3 needs-validation" novalidate>
                                  <div class="col-12">
                                    <label  class="form-label">
                                     Current Password
                                    </label>
                                    <div className='password-input-container'>
                                    <input
                                    value={password}
                                        type={showPassword ? "text" : "password"}
                                      class="form-control"
                                      style={submit&&password.length==0 &&password<3?{borderColor:"red"}:{borderColor:""}}
                                      onChange={(e)=>setPassword(e.target.value)}
                                    />    
                                     <i
                            className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                            id="togglePassword"
                            onClick={togglePasswordVisibility}
                        
                          ></i>  
                                    </div>
                                   
                              {submit&&password.length==0?<div className='text-danger'>Password is required</div>:<></>}
                                    {submit && password.length <3 && password.length !=0 ?<div className="text-danger">Password must be 3 charater</div>:<></>}
                                  </div>
                                  <div class="col-12">
                                    <label  class="form-label">
                                      Password
                                    </label>
                                    <div className='password-input-container'>
                                    <input
                                    value={password1}
                                    onChange={(e)=>setPassword1(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                      class="form-control"
                                      required
                                      style={submit&&password.length==0 &&password<3?{borderColor:"red"}:{borderColor:""}}
                                    />
                                   
                                    <i
                            className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                            // id="togglePassword"
                            onClick={togglePasswordVisibility}
                        
                          ></i>
                                    </div>
                                    {submit&&password1.length==0?<div className='text-danger'>Password is required</div>:<></>}
                                    {submit && password1.length <3 && password1.length !=0 ?<div className="text-danger">Password must be 3 charater</div>:<></>}
                                   
                                  </div>
                                  <div class="col-12">
                                    <label  class="form-label">
                                      Confirm Password
                                    </label>
                                    <div className='password-input-container'>
                                    <input
                                    value={password2}
                                    onChange={(e)=>setPassword2(e.target.value)}
                                    type={showPassword ? "text" : "password"}
                                      class="form-control"
                                      required
                                      // style={submit&&(password1.length==0)?{borderColor:"red"}:{borderColor:""}}
                                      style={submit && (password2.length === 0 || password2 !== password ||password2.length<3) ? { borderColor: "red" } : {}}
                                      />
                                      <i
                            className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}
                            // id="togglePassword"
                            onClick={togglePasswordVisibility}
                        
                          ></i>
                                    </div>
                                   
                                    {submit && password2.length === 0 && <div className='text-danger'>Confirm Password is required</div>}
                                    {submit && password2.length <3 && password1.length !=0 ?<div className="text-danger">Password must be 3 charater</div>:<></>}
                                   {submit && password2 !== password && password2.length !== 0 && <div className='text-danger'>Password and confirm password should be same</div>}
                                  </div>
                                  
                                  {/* <Link to="/Forgot" style={{textAlign:"right",fontSize:"14px"}}>Forgot Password </Link> */}
                               
                               <div className='row'>
                                  <div className='col-md-4'></div>
                                  <div className='col-md-4'>
                                  <button style={{marginTop:"30px"}} onClick={changee}  class="btn btn-primary w-100">
                                      Change Password
                                    </button>
                                  </div>
                                  <div className='col-md-4'></div>
                               </div>
                                 
                                    
                                 
                                 
                                 
                                </form>
          
          </div>
          
          </div>
          
                      </div>
                    </div>
          
                  </div>
                </div>
              </section>
          }



 {/* delete pop-up */}
 <div
          className="modal fade"
          id="delete"
          // data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  User Image
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                Are You Sure Want To Delete User Image <span style={{ color: "red" }}></span>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  data-bs-dismiss="modal"
                  onClick={userImageDelete}
                  type="button"
                  className="btn btn-primary"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
     
      </main>
    </div>
  )
}

export default MyProfile
