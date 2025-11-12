import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../../../shared/Sidebar';
import Footer from '../../../shared/Footer';
import Userimg from "../../../assets/img/team-2.jpg"
import Userimg1 from "../../../assets/img/small-logos/logo-spotify.svg"
import DashboardLayout from '../../../layouts/DashboardLayout';
import TopNav from '../../../shared/TopNav';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import VendorAPI from '../../../api/services/vendorLogin/vendorApi';
import { toast } from 'react-toastify';
import { baseURL } from '../../../api/api';
import noImage from "../../../assets/img/no_Image.png";
function VendorProfile() {
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const[username,setUsername]=useState("");
   const[firstname,setFirstname]=useState("");
   const[lastname,setLastname]=useState("");
   const[email,setEmail]=useState("");
   const[mobile,setMobile]=useState("");
   const[oldPassword,setoldPassword]=useState("");
   const[newPassword,setnewPassword]=useState("");
   const[confirmPassword,setconfirmPassword]=useState("");
   const[vendorLogo,setVendorLogo]=useState("");
   const [removeImg, setremoveImg] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
   const [newshowPassword, setnewShowPassword] = useState(false);
   const toggleNewPasswordVisibility = () => {
      setnewShowPassword(!newshowPassword);
    };
   const [confshowPassword, setConfShowPassword] = useState(false);
   const toggleConfPasswordVisibility = () => {
      setConfShowPassword(!confshowPassword);
    };
    const removeImage=()=>{
      setremoveImg((prev)=>!prev)
    }
   const navigate=useNavigate();
   const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const [fileName, setfileName] = useState("");
   const [tempImage, settempImage] = useState("");
   const fileInputRef = useRef<HTMLInputElement | null>(null);
   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   const selectedFile = event.target.files?.[0];
   if (selectedFile) {
         setSelectedFile(selectedFile);
         setfileName(selectedFile.name);
         if (fileInputRef.current) {
            fileInputRef.current.value = "";
         }
         const imagePreviewUrl = URL.createObjectURL(selectedFile);
         settempImage(imagePreviewUrl);
   }
   };
   const handleupdateMyProfile = () => {
      const formData = new FormData();
    
      formData.append("firstName", firstname);
      formData.append("lastName", lastname);
      formData.append("userName", username);
      formData.append("phone", mobile);
      formData.append("emailId", email);
      formData.append("remove_image", removeImg ? "true":"false");
      selectedFile && formData.append("profile_image", selectedFile);
    
      VendorAPI.commonupdateMyProfileAPI(formData)
        .then((responseData: any) => {
          if (responseData.apiStatus.code === '200') {
            toast.success(responseData.apiStatus.message);
            sessionStorage.setItem("userVendorName", username);
            if (removeImg) {
               sessionStorage.removeItem("profileImage");
             } else if (responseData.responseData.profile_image) {
               sessionStorage.setItem("profileImage", responseData.responseData.profile_image);
             }
            navigate('/vendor/dashboard');
          } else {
            toast.error(responseData.apiStatus.message);
          }
        })
        .catch((error: any) => {
          console.error("Error during login:", error);
          toast.error("An error occurred during login.");
        });
    };
    
   const handlechangePassword = () => {
         const apiData = {
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
         };
          VendorAPI.commonchangePasswordAPI(apiData) 
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  toast.success(responseData.apiStatus.message);
                  navigate('/vendor/dashboard')
               } else {
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error: any) => {
             
               console.error("Error during login:", error);
               toast.error("An error occurred during login.");
            });
      };
   const handleGetStore = () => {
         VendorAPI.commongetMyProfileAPI()
            .then((responseData: any) => {
               if (responseData.apiStatus.code === '200') {
                  setFirstname(responseData?.UserData?.first_name);
                  setLastname(responseData?.UserData?.last_name);
                  setUsername(responseData?.UserData?.username);
                  setEmail(responseData?.UserData?.email);
                  setMobile(responseData?.UserData?.mobile);
                  setVendorLogo(responseData?.UserData?.profile_image)
               } else {
                  toast.error(responseData.apiStatus.message);
               }
            })
            .catch((error: any) => {
               console.error("Error during login:", error);
               toast.error("An error occurred during login.");
            });
      };
      useEffect(()=>{
         handleGetStore();
      },[])
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <>
         <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
               <TopNav />
               <div className="vendor-breadcrumbs container-fluid py-1 px-3">
                  <nav aria-label="breadcrumb">
                     <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                        <li className="breadcrumb-item text-sm grayFont active" aria-current="page">My Profile</li>
                     </ol>
                     <h6 className="text-start font-weight-bolder mb-0 grayFont">My Profile</h6>
                  </nav>
               </div>
               <div className="myprofile-maincontent container-fluid py-4">
                  <div className="row myprofile-content">
                     <div className="col-md-6">
                        <h5 className="text-start"><img src={vendorLogo ? baseURL + vendorLogo : noImage} className="avatar avatar-sm me-2" alt="spotify" /> Vendor Edit Profile </h5>
                        <div className="col-md-12 login-input-group">
                           <div className="edit-container">
                              <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setUsername(e.target.value)} value={username} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user-secret"></i> Username</label>
                           </div>
                        </div>
                        <div className="row">
                           <div className="col-md-6 edit-name login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setFirstname(e.target.value)} value={firstname} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> First Name</label>
                              </div>
                           </div>
                           <div className="col-md-6 login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setLastname(e.target.value)} value={lastname} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-user"></i> Last Name</label>
                              </div>
                           </div>
                           <div className="col-md-6 edit-name login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setMobile(e.target.value)} value={mobile} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-mobile-screen-button"></i> Mobile Number</label>
                              </div>
                           </div>
                           <div className="col-md-6 login-input-group">
                              <div className="edit-container">
                                 <input type="text" id="vendor-crt-input" autoComplete="off" onChange={(e)=>setEmail(e.target.value)} value={email} className="vendor-crt-input" placeholder=" " required />
                                 <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-at"></i> Email</label>
                              </div>
                           </div>
                        
                        <div className="col-md-6 edit-name">
                          <div className="media-upload-container login-input-group">
                          <label htmlFor="vendor-crt-input-2" className="media-upload-label">
                          <i className="fa-brands fa-vimeo icon-left mt-1" /> 
                          <span className="mt-1 ">Vendor Logo</span>
                          </label>
                          <input
                              type="file"
                              id="vendor-crt-input-2"
                              className="media-upload-input"
                              accept="image/*"
                              multiple
                              required
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ cursor: "pointer" }}
                          />
                          <button className="media-upload-button" 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          >
                          <i className="fa-solid fa-arrow-up-from-bracket text-dark"></i>
                            Select</button>
                        </div>
                        <p className="text-sm mb-0 p-0" style={{ maxWidth: '400px', wordBreak: 'break-word' }}>
                           {fileName && fileName}
                        </p>
                        </div>
                        <div className="col-md-6 login-input-group ">
                           <div className="edit-container ">
                              <div className="form-check form-switch ms-1 is-filled mt-2">
                                 <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onClick={()=>removeImage()}
                                    id="flexSwitchCheckDefault"
                                 />
                                 <span className="text-xs">Remove Image</span>
                              </div>
                           </div>
                        </div>
                           <div className="col-md-12 edit-button text-end">
                              <button onClick={handleupdateMyProfile}>Save</button>
                           </div>
                        </div>
                     </div>
                     <div className="col-md-6">
                        <h5 className="text-start mt-2">Password</h5>
                        <div className="col-md-12 login-input-group staff-passwordInput" style={{marginTop:"39px"}}>
                           <div className="edit-container">
                              <input type={showPassword ? 'text' : 'password'} id="vendor-crt-input" name="fake-lastname"
                                 autoComplete="new-password" onChange={(e)=>setoldPassword(e.target.value)} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-unlock"></i> Current Password</label>
                           </div>
                           <i
                            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye sadmin-passwordInputicon`}
                            id="togglePassword"
                            onClick={togglePasswordVisibility}
                          ></i>
                        </div>
                        <div className="col-md-12 new-password login-input-group staff-passwordInput">
                           <div className="edit-container">
                              <input type={newshowPassword ? 'text' : 'password'} id="vendor-crt-input" autoComplete="off" onChange={(e)=>setnewPassword(e.target.value)} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock-open"></i> New Password</label>
                           </div>
                           <i
                            className={`fas ${newshowPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye sadmin-passwordInputicon`}
                            id="togglePassword"
                            onClick={toggleNewPasswordVisibility}
                          ></i>
                        </div>
                        <div className="col-md-12 new-password login-input-group staff-passwordInput">
                           <div className="edit-container">
                              <input type={confshowPassword ? 'text' : 'password'} id="vendor-crt-input" autoComplete="off" onChange={(e)=>setconfirmPassword(e.target.value)} className="vendor-crt-input" placeholder=" " required />
                              <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-lock"></i> Confirm New Password</label>
                           </div>
                           {confirmPassword !== newPassword && confirmPassword.length !== 0 && <div className='text-danger error-message-required'>Password and confirm password should be same</div>}
                           <i
                            className={`fas ${confshowPassword ? 'fa-eye-slash' : 'fa-eye'} password-eye sadmin-passwordInputicon`}
                            id="togglePassword"
                            onClick={toggleConfPasswordVisibility}
                          ></i>
                        </div>
                        <div className="col-md-12 edit-button py-2 login-input-group "></div>
                        <div className="col-md-12 edit-button text-end mt-5">
                           <button onClick={handlechangePassword}>Change Password</button>
                        </div>
                     </div>
                  </div>
                  <Footer />
               </div>
            </main>
         </DashboardLayout>
      </>
   )
}
export default VendorProfile;