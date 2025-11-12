import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { CHANGE_PASSWORD, UPDATE_PROFILE_MUTATION } from "../../../Graphql/Queries";
import { toast } from "react-toastify";
import './index.css'

import { Navigate, useNavigate } from "react-router-dom";


const MyAccountForm: React.FC = () => {
  interface UserAccount {
    userName: string;
    firstName: string;
    lastName: string;
    login: string;
    phone: string;
    email: string;
    companyName: string;
    userCompanyAddress: string;
    userCompanyPhoneNumber: string;
    designation: string;
  }


  const [password, setPassword] = useState('')
  const [cPassword, setCPassword] = useState('')



  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cName, setCName] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [workCNumber, setWorkCNumber] = useState('');
  const [designation, setDesignation] = useState('');
  const [cPhoneNumber, setCPhoneNumber] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [submit, setSubmit] = useState(false)

  const [userCompanyId, setUserCompanyId] = useState('')
  const [eCommercDomainName, setECommerceDomainName] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const navigate = useNavigate();
  const [changePassword, { data, error }] = useMutation(CHANGE_PASSWORD);

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const uId = localStorage.getItem('uId')
  const companyId = localStorage.getItem('companyId')

  const [loading, setLoading] = useState(false)

  const [redirect, setRedirect] = useState<string | null>(null);
  const modalRef = useRef<HTMLButtonElement | null>(null);

  const [updateUser] = useMutation(UPDATE_PROFILE_MUTATION);

  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);

  useEffect(() => {
    const userAccountData = localStorage.getItem('userAccountData');

    if (userAccountData) {
      try {
        const parsedData = JSON.parse(userAccountData);
        {
          parsedData.map((list: any) => (
            setFirstName(list.firstName),
            setLastName(list.lastName),
            setUserName(list.login),
            setMobileNumber(list.phone),
            setEmail(list.email),
            setCName(list.userCompanyName),
            setCAddress(list.userCompanyAddress),
            setDesignation(list.designation || "N/A"),
            setCountry(list.country.countryId),
            setState(list.state || "N/A"),
            setWorkCNumber(list.number || 'N/A'),
            setCPhoneNumber(list.userCompanyPhoneNumber),
            setIndustry(list.industry || 'N/A'),
            setECommerceDomainName(list.ecommerceDomainName),
            setUserCompanyId(list.userCompanyId)

          ))
        }

      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("No user account data found in local storage.");
    }
  }, []);

  // Change Password

  const handleChangePassword = async () => {
    setSubmit(true);

    if (!password && !cPassword) {
      return;
    }

    try {
      const { data } = await changePassword({
        variables: {
          accessToken: token, // Assume you have token and userId from the context or props
          newPassword: password,
          userId: userId,
        },
      });

      // Handle success
      if (data && data.changePassword.response.success) {
        setSubmit(false);
        toast.success(data.changePassword.response.message);

        // Programmatically close the modal using the modalRef
        if (modalRef.current) {
          modalRef.current.click(); // Trigger the close button's click event to close the modal
        }
      }
    } catch (err) {
      toast.error('Error changing password');
      setSubmit(false);
    }
  };



  // Update Profile
  const handleUpdateUser = () => {

    if (!companyId) {
      toast.error("Company ID is required.");
      return;
    }
    setLoading(true)

    updateUser({
      variables: {
        input: {
          id: userId,
          accessToken: token,
          login: userName,
          firstName: firstName,
          lastName: lastName,
          email: email,
          activated: true,
          langKey: "en",
          accountType: "EXTERNAL",
          companyType: "MEDIA_BUYERS",
          platform: "ECOMMERCE",
          companyId: companyId || 'N/A',
          admin: true,
          phone: "+123456789",
          ecommerceDomainName: eCommercDomainName,
          userCompanyName: cName,
          userCompanyId: userCompanyId,
          userCompanyAddress: cAddress,
          userCompanyPhoneNumber: workCNumber,
          rejectReason: "",
          jobTitle: designation,
          userId: userId,
          userCountry: country,
          userCity: "Western Australia",
          industry: industry,
          country: {
            id: country,
            countryId: "australia",
            name: "Australia",
            nameJa: "Australia",
            latitude: -24.152823,
            longitude: 133.768253,
            zoom: 8,
            mediaOwnerTermsAndConditions: "null",
            buyerTermsAndConditions: "null",
            swLat: -38.122505,
            swLng: 113.641302,
            seLat: -38.122505,
            seLng: 154.114933,
            neLat: 0,
            neLng: 0,
            nwLat: -11.055568,
            nwLng: 113.641302,
            population: 24669600,
            iso: "AU",
            postalformat: "9999",
            postalname: "Postal code",
            geopc: 1,
            active: true,
            dialingCode: "+61",
            timezone: "null",
            miDataSensorStatus: "null",
            tax: {
              label: "GST",
              percent: 10
            },
            region: "",
            weekends: "null",
            locale: "en",
            trCountryName: "Australia",
            internetEmissionFactor: "null",
            carbonEmissionFactor: "null"
          }

        }
      }
    })
      .then(response => {
        if (response.data.updateUser) {
          // setRedirect('/sign-in')
          toast.success(response.data.updateUser.message);
          localStorage.setItem('userName', firstName + " " + lastName)
          setLoading(false)

        } else {
          toast.error("No update information returned");
        }
      })
      .catch(err => {
        console.error("Error updating user", err);
      });
  };



  if (redirect) {
    return <Navigate to={redirect} />;
  }



  return (
    <>

      {loading ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
        <span className="loading-circle sp1">
          <span className="loading-circle sp2">
            <span className="loading-circle sp3"></span>
          </span>
        </span>
      </div> :
        <form className="account-form row">
          <div className="account-head col-md-12">
            <h2>My accounts </h2>
          </div>

          <div className="account-headlf col-md-6">
            <h3>Company details</h3>
            <div className="account-form-left row">
              <div className="account-field-left col-md-6">
                <label htmlFor="inputEmail4" className="form-label">First Name</label>
                <input
                  id="inputFirstName"
                  value={firstName}
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="account-field-left col-md-6">
                <label htmlFor="inputEmail4" className="form-label">Last name</label>
                <input
                  id="inputLastName"
                  value={lastName}
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  className="form-control"
                />
              </div>
              <div className="account-field-left col-md-6">
                <label htmlFor="inputEmail4" className="form-label">User name </label>
                <input
                  id="inputUserName"
                  value={userName}
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  disabled
                  className="form-control" />
              </div>
              <div className="account-field-left col-md-6">
                <label htmlFor="inputEmail4" className="form-label">Mobile number</label>
                <input
                  id="inputMobileNumber"
                  value={mobileNumber}
                  type="text"
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="form-control" />
              </div>
              <div className="account-field-left col-md-6">
                <label htmlFor="inputEmail4" className="form-label">Email ID</label>
                <input
                  id="inputEmail"
                  value={email}
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control" />
              </div>
            </div>
          </div>
          <div className="account-headrg col-md-6">
            <h3>Company details</h3>
            <div className="account-form-right row">
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Designation</label>
                <input
                  // id="inputDesignation"
                  value={designation}
                  type="text"
                  onChange={(e) => setDesignation(e.target.value)}
                  disabled
                  className="form-control" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Comapany Name</label>
                <input
                  id="inputCompanyName"
                  value={cName}
                  type="text"
                  disabled
                  onChange={(e) => setCName(e.target.value)}
                  className="form-control" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Country</label>
                <input
                  value={country}
                  disabled
                  onChange={(e) => setCountry(e.target.value)}
                  type="text" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">State</label>
                <input
                  disabled
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  type="text" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Company address</label>
                <input
                  id="inputCompanyAddress"
                  value={cAddress}
                  disabled
                  type="text"
                  onChange={(e) => setCAddress(e.target.value)}
                  className="form-control" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Work contact number</label>
                <input
                  id="inputWorkContactNumber"
                  value={workCNumber}
                  type="text"
                  disabled
                  onChange={(e) => setWorkCNumber(e.target.value)}
                  className="form-control" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Company’s phone number</label>
                <input
                  id="inputCompanyPhoneNumber"
                  value={cPhoneNumber}
                  type="text"
                  disabled
                  onChange={(e) => setCPhoneNumber(e.target.value)}
                  className="form-control" />
              </div>
              <div className="account-field-right col-md-6">
                <label htmlFor="inputtext4" className="form-label">Industry</label>
                <input
                  id="inputIndustry"
                  value={industry}
                  disabled
                  type="text"
                  onChange={(e) => setIndustry(e.target.value)}
                  className="form-control" />
              </div>
              <div className="account-field-right-button row">
                <div className="account-field-right-btn1 col-md-6">
                  <button type="button" className="btn" data-bs-toggle="modal" data-bs-target="#Reset-password">Click here to Change Password</button>
                </div>
                <div className="account-field-right-btn2 col-md-6">
                  <button type="button" onClick={handleUpdateUser} className="btn btn-primary">Update Profile</button>
                </div>
              </div>
            </div>
          </div>
        </form>}





      <div className="modal fade" id="Reset-password" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content myacc-reset-password-popup">
            <div className="modal-header myacc-reset-password-header">
              <h6 className="modal-title fs-5" id="staticBackdropLabel">Reset your password</h6>
              <button
                type="button"
                className="myacc-reset-password-close"
                data-bs-dismiss="modal"
                ref={modalRef} // Use the ref here
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body myacc-reset-password-body row">
              <div className="myacc-reset-new-password col-md-12">
                <label>Enter your new password</label>
                <div className="input-group myacc-setpassword">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*************"
                    value={password}
                  />
                  <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </span>
                </div>
                {submit && password.length === 0 && <div className="text-danger error-message-required">Password is required</div>}
                {password.length > 0 && !passwordRegex.test(password) && (
                  <div className="text-danger error-message-required">
                    Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.
                  </div>
                )}
              </div>
              <div className="myacc-reset-confirm-password col-md-12">
                <label>Confirm password</label>
                <div className="input-group myacc-setpassword">
                  <input
                    type={showPassword1 ? 'text' : 'password'}
                    className="form-control"
                    placeholder="*************"
                    value={cPassword}
                    onChange={(e) => setCPassword(e.target.value)}
                  />
                  <span className="input-group-text" onClick={togglePasswordVisibility1} style={{ cursor: 'pointer' }}>
                    <i className={showPassword1 ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </span>
                </div>
                {submit && cPassword.length === 0 && <div className="text-danger error-message-required">Confirm Password is required</div>}
                {cPassword !== password && cPassword.length !== 0 && <div className="text-danger error-message-required">Password and confirm password should be same</div>}
              </div>
            </div>
            <div className="modal-footer myacc-reset-password-popup-footer row">
              <div className="myacc-forgot col-md-12">
                <button onClick={() => navigate(`${process.env.REACT_APP_BASE_PATH}/forgot-password`)} type="button" className="btn myacc-reset-password-forgetbtn" data-bs-dismiss="modal">
                  Forget password?
                </button>
              </div>
              <div className="myacc-save col-md-12">
                <button type="button" onClick={handleChangePassword} className="myacc-reset-password-savebtn">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>






    </>
  );
};

export default MyAccountForm;
