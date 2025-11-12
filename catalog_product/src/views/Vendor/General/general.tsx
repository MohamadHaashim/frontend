import DashboardLayout from "../../../layouts/DashboardLayout";
import Footer from "../../../shared/Footer";
import general_Logo from "../../../assets/img/bizconvo-logo.png"
import TopNav from "../../../shared/TopNav";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoginAPI from "../../../api/services/superAdminLogin/superAdmin";
import { Link } from "react-router-dom";
interface CountrypDrop {
    id: string;
    name: string;
    iso_code: string;
    name_capitalized: string;
    iso3_code: string;
    iso_num_code: string;
    phone_code: string;
 }
 interface LangCodeDrop {
    id: string;
    language_name: string;
    language_code: string;
}
function General_Settings() {
    const [loading, setLoading] = useState(false);
    const [vendorId, setvendorId] = useState("");
    const [vendorType, setvendorType] = useState("");
    const [vendorName, setvendorName] = useState("");
    const [vendorEmail, setvendorEmail] = useState("");
    const [vendorPhone, setvendorPhone] = useState("");
    const [vendorAddress, setvendorAddress] = useState("");
    const [vendorPostalcode, setvendorPostalcode] = useState("");
    const [vendorCity, setvendorCity] = useState("");
    const [vendorState, setvendorState] = useState("");
    const [vendorCountryName, setvendorCountryName] = useState("");
    const [vendorbussinessPhone, setvendorbussinessPhone] = useState("");
    const [vendorcontactEmail, setvendorcontactEmail] = useState("");
    const [vendorTimezonename, setvendorTimezonename] = useState("");
    const [vendorLanguageName, setvendorLanguageName] = useState("");
    const [countryDropDown, setCountryDropDown] = useState<CountrypDrop[]>([])
    const [langCodeDrop, setlangCodeDrop] = useState<LangCodeDrop[]>([]);
    const [timezoneDrop, setTimezoneDrop] = useState([]);
    
const handleVendorget = () => {
        VendorAPI.generalVendorGet()
           .then((responseData: any) => {
              if (responseData.apiStatus.code === '200') {
                 const data=responseData?.responseData;
                 setvendorId(data?.VendorId);
                 setvendorType(data?.VendorType);
                 setvendorName(data?.VendorName);
                 setvendorEmail(data?.VendorEmail);
                 setvendorAddress(data?.VendorAddress);
                 setvendorPostalcode(data?.VendorPincode);
                 setvendorCity(data?.VendorCity);
                 setvendorState(data?.VendorState);
                 setvendorCountryName(data?.VendorCountry);
                 setvendorbussinessPhone(data?.VendorPhone);
                 setvendorTimezonename(data?.VendorTimezone);
                 setvendorLanguageName(data?.VendorLanguage);
              } else {
                 toast.error(responseData.apiStatus.message);
              }
           })
           .catch((error: any) => {
              setLoading(false)
              console.error("Error during login:", error);
              toast.error("An error occurred during login.");
           });
     };
     const superAdminVendorEdit= () => {
           let apiData = {
                id:vendorId,
                type:vendorType,
                address: vendorAddress,
                phone: vendorbussinessPhone,
                pincode:vendorPostalcode,
                city:vendorCity,
                state:vendorState,
                country:vendorCountryName,
                timezone:vendorTimezonename,
                language:vendorLanguageName,
           };
           const apiCall = LoginAPI.vendorUpdateApi(apiData);
           apiCall
              .then((responseData: any) => {
                 if (responseData.apiStatus.code === '200') {
                    toast.success(responseData.apiStatus.message);
                    
                 } else {
                    toast.error(responseData.apiStatus.message);
                 }
              })
              .catch((error: any) => {
                 console.error("Error during API call:", error);
                 toast.error("An error occurred during the API call.");
              });
        };
        const handleCountryDrop = () => {
           VendorAPI.commonCountryDropAPI()
              .then((responseData: any) => {
                 if (responseData.apiStatus.code === '200') {
                    setCountryDropDown(responseData?.result?.CountryData);
                 } else {
                    toast.error(responseData.apiStatus.message);
                 }
              })
              .catch((error: any) => {
                 setLoading(false)
                 console.error("Error during login:", error);
                 toast.error("An error occurred during login.");
              });
        };
        //CountryDropdown Filter
        const filteredCountryDrop = countryDropDown.filter((dropdownValue) =>
            (dropdownValue?.name || '')?.toLowerCase().includes((vendorCountryName || "").toLowerCase())        
    );
    const languageCodeDropdwon = () => {
            VendorAPI.languageCodeDropdown()
                .then((responceData: any) => {
                    if (responceData.apiStatus.code === '200') {
                        setlangCodeDrop(responceData?.responseData)
                    }
                })
                .catch((error: any) => {
                    console.error("Error during login:", error);
                });
        };
    //Dropdown Filter
    const filteredLangCodeDrop = langCodeDrop.filter((dropdownValue) =>
        (dropdownValue?.language_name || '').toLowerCase().includes((vendorLanguageName|| "").toLowerCase())
        );
        const commontimezonseDropAPI = () => {
            VendorAPI.commontimezonseDropAPI()
                .then((responceData: any) => {
                    if (responceData.apiStatus.code === '200') {
                        setTimezoneDrop(responceData?.result?.CountryData)
                    }
                })
                .catch((error: any) => {
                    console.error("Error during login:", error);
                });
            };
            //Timezone Dropdown Filter
            const filteredTimezoneDrop = timezoneDrop.filter((dropdownValue:any) =>
            (dropdownValue?.timezone_name || '').toLowerCase().includes((vendorTimezonename|| "").toLowerCase())
            );
     useEffect(()=>{
        handleVendorget();
        handleCountryDrop();
        languageCodeDropdwon();
        commontimezonseDropAPI();
     },[])
    return (
        <>
            <DashboardLayout>
                <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
                    <TopNav />
                    <div className="container-fluid py-1">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                <li className="breadcrumb-item text-sm"><Link className="opacity-5 grayFont" to={"/vendor/dashboard"}>Dashboard</Link></li>
                                <li className="breadcrumb-item text-sm grayFont active" aria-current="page">Settings</li>
                            </ol>
                            <h6 className="font-weight-bolder text-start mb-0 grayFont">Settings</h6>
                        </nav>
                    </div>
                    <div className="dashboard-maincontent container-fluid py-4">
                        <div className="card p-3">
                            <h3 className="grayFont">General Settings</h3>

                            <div className="campaign-template mt-5">
                                <h6 className="campaign-temp-head">Basic Settings</h6>
                                <div className="row">
                                    <div className="col-md-12 login-input-group">
                                        <div className="vendor-create-container">
                                            <input type="text" autoComplete="off" id="vendor-crt-input" onChange={(e)=>setvendorName(e.target.value)} value={vendorName} className="vendor-crt-input" placeholder=" " required />
                                            <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-book-open-reader"></i> Vendor Title</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="campaign-template mt-5">
                                <h6 className="campaign-temp-head">Business Information</h6>
                                <div className="campaign-template border mt-5 shadow-lg mb-5 ">
                                    <h6 className="campaign-temp-head">Address & Contact</h6>
                                    <div className="row">
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" autoComplete="off" onChange={(e)=>setvendorAddress(e.target.value)} value={vendorAddress} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-address-card"></i> Address line</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" autoComplete="off" onChange={(e)=>setvendorPostalcode(e.target.value)} value={vendorPostalcode} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-signs-post"></i> Postal Code</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" autoComplete="off" onChange={(e)=>setvendorCity(e.target.value)} value={vendorCity} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-city"></i> City</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" autoComplete="off" onChange={(e)=>setvendorState(e.target.value)} value={vendorState} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-building"></i> State</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    autoComplete="off"
                                                    className={"vendor-crt-input loginfilled-frame-username"}
                                                    placeholder=" "
                                                    required
                                                    // onClick={handleCountryDrop}
                                                    onChange={(e)=>setvendorCountryName(e.target.value)}
                                                    value={vendorCountryName}
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-earth-americas"></i> Select Country</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                {filteredCountryDrop.length === 0 ? (
                                                    <li className="dropdown-nodata-found">No data found</li>
                                                ) : (
                                                    filteredCountryDrop.map((dropdownValue, id) => (
                                                        <li key={id}>
                                                        <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={() => { setvendorCountryName(dropdownValue?.name) }}
                                                        >
                                                            {dropdownValue?.name}
                                                        </a>
                                                        </li>
                                                    )))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" autoComplete="off" onChange={(e)=>setvendorbussinessPhone(e.target.value)} value={vendorbussinessPhone} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-business-time"></i> Business Phone</label>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container">
                                                <input type="text" autoComplete="off" onChange={(e)=>setvendorEmail(e.target.value)} value={vendorEmail} id="vendor-crt-input" className="vendor-crt-input" placeholder=" " required />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-envelope"></i> Contact Email</label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className="campaign-template border mt-5 shadow-lg mb-5 ">
                                    <h6 className="campaign-temp-head">Other</h6>
                                    <div className="row">
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    className={"vendor-crt-input loginfilled-frame-username"}
                                                    placeholder=" "
                                                    required
                                                    value={vendorTimezonename}
                                                    // onClick={commontimezonseDropAPI} 
                                                    autoComplete="off" onChange={(e)=>setvendorTimezonename(e.target.value)}
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-clock"></i> Select Timezone</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                {filteredTimezoneDrop.length === 0 ? (
                                                            <li className="dropdown-nodata-found">No data found</li>
                                                         ) : (
                                                            filteredTimezoneDrop.map((dropdownValue:any) => ( 
                                                         <li>
                                                            <a
                                                               className="dropdown-item"
                                                               href="#"
                                                               onClick={() => {setvendorTimezonename(dropdownValue?.timezone_name) }}
                                                            >
                                                               {dropdownValue?.timezone_name}
                                                            </a>
                                                         </li>
                                                      )))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-4 login-input-group">
                                            <div className="vendor-create-container dropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                                <input
                                                    type="text"
                                                    id="vendor-crt-input"
                                                    className={"vendor-crt-input loginfilled-frame-username"}
                                                    placeholder=" "
                                                    required
                                                    value={vendorLanguageName}
                                                    // onClick={languageCodeDropdwon}
                                                    autoComplete="off" onChange={(e) => setvendorLanguageName(e.target.value)}
                                                />
                                                <label htmlFor="vendor-crt-input" className="vendor-crt-label"><i className="fa-solid fa-language"></i> Language</label>
                                                <i className="dropdown-icon font-size-dash-arrow fa-solid fa-chevron-down"></i>
                                                <ul className="dropdown-menu template-dropdown storename-dropdown-menu">
                                                {filteredLangCodeDrop.length === 0 ? (
                                                    <li className="dropdown-nodata-found">No data found</li>
                                                ) : (
                                                    filteredLangCodeDrop.map((dropdownValue, id) => (
                                                        <li key={id}>
                                                            <a
                                                                className="dropdown-item"
                                                                href="#"
                                                                onClick={() => {
                                                                    setvendorLanguageName(dropdownValue?.language_name);
                                                                }}
                                                            >
                                                                {dropdownValue?.language_name}
                                                            </a>
                                                        </li>
                                                    )))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-end">
                                <button className="vendor-crt-btn" onClick={superAdminVendorEdit}>Save</button>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </main>
            </DashboardLayout>
        </>
    )
}
export default General_Settings;