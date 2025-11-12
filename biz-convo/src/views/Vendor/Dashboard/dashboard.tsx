import SoftUI from "../../../assets/img/small-logos/logo-xd.svg";
import AddProgress from "../../../assets/img/small-logos/logo-atlassian.svg";
import FixPlat from "../../../assets/img/small-logos/logo-slack.svg";
import LaunchIcon from "../../../assets/img/small-logos/logo-spotify.svg";
import DashboardLayout from "../../../layouts/DashboardLayout";
import TopNav from "../../../shared/TopNav";
import Footer from "../../../shared/Footer";
import "./dashboard.css"
import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import VendorAPI from "../../../api/services/vendorLogin/vendorApi";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";

function VendorDashboard() {
   const [redirect, setRedirect] = React.useState<string | null>(null);
   const navigate = useNavigate();
   
   const [vendorDashcount,setVendorDashcount]=useState<any>("")
   const [loading, setLoading] = useState(false);


   const handleVendorDashcount = () => {
      setLoading(true)
            VendorAPI.commonVendorDashCount()
               .then((responseData:any) => {
                  if (responseData.apiStatus.code === '200') {
                     setVendorDashcount(responseData?.VendorDashCountData);
                     // setVendorDashcount("");
                     setLoading(false)
                  } else {
                     toast.error(responseData.apiStatus.message);
                     setLoading(false)
                  }
               })
               .catch((error:any) => {
                  console.error("Error while fetching dahboard count:", error);
                  toast.error("An error occurred while fetching dahboard count.");
                  setLoading(false)
               });
   };
   useEffect(()=>{
      handleVendorDashcount();
   },[])
   if (redirect) {
      return <Navigate to={redirect} />;
   }
   return (
      <>
         <DashboardLayout>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg ">
               <TopNav />
               <div className="container-fluid py-1">
                  <nav aria-label="breadcrumb">
                     <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                        <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="#">Home</a></li>
                        <li className="breadcrumb-item text-sm text-dark active" aria-current="page">Dashboard</li>
                     </ol>
                     <h6 className="font-weight-bolder text-start mb-0">Dashboard</h6>
                  </nav>
               </div>
               <div className="dashboard-maincontent container-fluid py-4">
               {
                        loading ? (
                           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "100px" }}>
                              <FadeLoader color="#36d7b7" />
                           </div>
                        ) : vendorDashcount.length === 0 ? (
                           <p className="" style={{ textAlign: "center", marginTop: "40px" }}><span>
                              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 512 512">
                                 <path d="M0 0 C2.1198433 0.0056486 4.23967858 0.00846379 6.35952759 0.0110817 C26.90876038 0.04796487 47.20245193 0.45946186 67.58584595 3.31805801 C68.90952917 3.49711854 70.23326122 3.67581845 71.55703735 3.85419083 C122.10618129 10.7519002 161.99715664 22.87437544 199.58584595 58.31805801 C200.36959595 59.04766739 201.15334595 59.77727676 201.96084595 60.52899551 C246.20161285 103.03173229 256.87271381 167.97321338 258.693573 226.79831314 C258.74930531 230.49916141 258.77664528 234.19884115 258.78897095 237.90008926 C258.79179832 238.57637564 258.7946257 239.25266201 258.79753876 239.94944191 C258.81241841 243.54603185 258.82171203 247.14258302 258.82608032 250.73920059 C258.83041279 253.63288723 258.84411448 256.52626689 258.86709595 259.41986465 C259.07109196 285.67523071 257.56872945 311.62284962 253.27334595 337.56805801 C253.06387329 338.86541885 252.85440063 340.16277969 252.63858032 341.4994545 C245.28859483 386.25892924 231.90547881 420.10300068 200.58584595 453.31805801 C199.85623657 454.10180801 199.1266272 454.88555801 198.37490845 455.69305801 C155.57595956 500.24214979 90.27638402 510.59645208 31.10108948 512.42578506 C27.52674671 512.4810209 23.95355962 512.5083338 20.3788147 512.52118301 C19.06685623 512.52819733 17.75489777 512.53521164 16.40318298 512.54243851 C12.19323232 512.56183151 7.98333677 512.56687235 3.77334595 512.56805801 C3.05619415 512.56849987 2.33904236 512.56894173 1.60015869 512.56939697 C-19.88157172 512.5763392 -41.09596572 512.29262146 -62.41415405 509.31805801 C-63.70869507 509.14645157 -65.00323608 508.97484512 -66.33700562 508.79803848 C-123.55513301 501.15002596 -173.89688934 484.10638108 -210.45516968 436.68744278 C-245.09649875 390.67863511 -253.41426233 330.59176764 -253.61727905 274.11102676 C-253.62780052 272.14308907 -253.62780052 272.14308907 -253.63853455 270.13539505 C-253.65792755 265.92544439 -253.66296839 261.71554884 -253.66415405 257.50555801 C-253.66459591 256.78840622 -253.66503777 256.07125443 -253.66549301 255.33237076 C-253.67243459 233.85265288 -253.3997857 212.63327349 -250.41415405 191.31805801 C-250.23502298 189.98901301 -250.05632561 188.65990949 -249.87802124 187.33075333 C-245.81401581 157.40883305 -240.95374301 127.08707284 -226.41415405 100.31805801 C-225.59817749 98.77891739 -225.59817749 98.77891739 -224.76571655 97.20868301 C-217.29031399 83.71649302 -207.4622158 71.76033947 -196.76327515 60.71405411 C-195.54666068 59.45516856 -194.34836607 58.17864047 -193.1524353 56.90008926 C-170.24546708 32.97691543 -140.58720361 18.16238506 -108.53915405 11.25555801 C-107.77734833 11.08852371 -107.0155426 10.92148941 -106.23065186 10.74939346 C-94.6253594 8.21783618 -82.98357064 6.13098144 -71.22665405 4.44305801 C-70.55853699 4.34564316 -69.89041992 4.2482283 -69.20205688 4.14786148 C-46.21087322 0.84801317 -23.20467134 -0.06283861 0 0 Z " fill="#CBE0FB" transform="translate(253.41415405273438,-0.3180580139160156)"/>
                                 <path d="M0 0 C2.24115589 -0.01032669 4.48215867 -0.027738 6.72325516 -0.04687119 C10.30997097 -0.07560287 13.89608797 -0.08155094 17.4828968 -0.07092667 C19.43966642 -0.06906841 21.39642734 -0.0854798 23.35312271 -0.1026268 C43.72989585 0.05272796 58.0030967 8.93263382 73.13264847 21.42709732 C73.67679398 21.87214615 74.22093948 22.31719498 74.78157425 22.77573013 C90.93282573 36.01317202 106.64931398 50.45542213 120.13264847 66.42709732 C120.93960159 67.34490982 121.74655472 68.26272232 122.57796097 69.20834732 C136.98158732 85.69536933 150.0631932 102.48740218 150.74202347 125.11069107 C150.77914444 126.18934937 150.81626541 127.26800766 150.85451126 128.37935257 C151.34146967 144.07799361 151.37619166 159.78476251 151.38264847 175.48959732 C151.38375311 176.72422148 151.38375311 176.72422148 151.38488007 177.98378754 C151.40157173 200.97698557 151.07210634 223.90146371 149.82014847 246.86459732 C149.73186783 248.54055481 149.73186783 248.54055481 149.64180374 250.25037003 C149.04471044 261.23531117 148.18485786 272.14064855 146.67171097 283.04037857 C146.55466309 283.89127563 146.4376152 284.7421727 146.31702042 285.61885452 C144.73837566 296.17830196 140.55429973 304.94988027 134.13264847 313.42709732 C133.64409378 314.09225357 133.15553909 314.75740982 132.65217972 315.44272232 C122.16203312 328.60073336 107.00865924 335.09269048 90.68709183 336.95175552 C41.57231651 342.18571483 -9.65553586 343.10013317 -58.92985153 339.11459732 C-59.65712448 339.05592484 -60.38439743 338.99725235 -61.13370895 338.93680191 C-68.92885538 338.27511666 -76.66754241 337.22826724 -84.39469528 336.01694107 C-85.12914368 335.90670105 -85.86359207 335.79646103 -86.62029648 335.6828804 C-98.80902552 333.66600028 -108.34988785 327.18239594 -116.86735153 318.42709732 C-117.57504684 317.74002701 -118.28274216 317.0529567 -119.01188278 316.34506607 C-130.36870405 304.64080858 -133.81234833 290.43988088 -135.24503708 274.68979263 C-135.42318657 272.74968111 -135.61665338 270.81099478 -135.81071091 268.87240982 C-138.05209184 245.54852286 -138.02848806 222.03158005 -138.03532028 198.62240982 C-138.03772852 196.63248748 -138.04013974 194.64256513 -138.0427807 192.65264308 C-138.05081002 186.42983421 -138.05337548 180.2070397 -138.05265427 173.98422623 C-138.05205415 167.66762918 -138.06262026 161.35111767 -138.07839793 155.0345422 C-138.09167254 149.51338068 -138.09683011 143.99224648 -138.09619886 138.47106922 C-138.0959499 135.21650006 -138.09945283 131.96202231 -138.10937691 128.70746613 C-138.16061847 110.18250759 -137.3153454 91.88963074 -135.86735153 73.42709732 C-135.78743658 72.38579288 -135.70752163 71.34448845 -135.62518501 70.27162933 C-134.09586307 50.53121508 -129.65605809 32.39380362 -113.98844528 18.95834732 C-101.19972604 8.50608441 -89.12941981 5.13679559 -72.86735153 3.42709732 C-71.63146286 3.29029556 -70.39557419 3.1534938 -69.12223434 3.01254654 C-46.13188066 0.5333339 -23.10246004 0.08396147 0 0 Z " fill="#0561DC" transform="translate(249.86735153198242,85.57290267944336)"/>
                                 <path d="M0 0 C1.24869873 -0.01369629 2.49739746 -0.02739258 3.78393555 -0.04150391 C4.48632858 -0.04920807 5.18872162 -0.05691223 5.91239929 -0.06484985 C22.04359095 0.43625431 35.18880948 11.24594442 47 21 C47.54414551 21.44504883 48.08829102 21.89009766 48.64892578 22.34863281 C64.80017726 35.5860747 80.51666551 50.02832481 94 66 C94.80695313 66.9178125 95.61390625 67.835625 96.4453125 68.78125 C106.4404287 80.22209807 116.77752727 92.57013458 122 107 C122.433125 108.175625 122.86625 109.35125 123.3125 110.5625 C123.92288608 113.61443041 124.07070721 116.12578793 124.04296875 119.21484375 C124.03676514 120.11195068 124.03056152 121.00905762 124.02416992 121.93334961 C124.01619385 122.61534424 124.00821777 123.29733887 124 124 C82.76063048 124.37879729 82.76063048 124.37879729 63.625 123.25 C62.42415771 123.18828613 61.22331543 123.12657227 59.98608398 123.06298828 C42.7202276 121.88657679 28.23695318 115.49990883 16.2890625 102.83203125 C4.12268156 87.77976814 2.3246295 71.72006711 1 53 C0.90952393 51.81647949 0.81904785 50.63295898 0.72583008 49.41357422 C-0.02903711 38.765483 -0.11806909 28.17136164 -0.0625 17.5 C-0.05746689 15.79036592 -0.05290724 14.08073037 -0.04882812 12.37109375 C-0.03798452 8.24735865 -0.02082351 4.12369628 0 0 Z " fill="#3A3B57" transform="translate(276,86)"/>
                                 <path d="M0 0 C5.40251796 4.25947024 9.75772499 9.62802052 11.8125 16.25 C12.59512025 25.31383447 13.08406823 34.4341102 7.8125 42.25 C7.43480469 42.83523438 7.05710937 43.42046875 6.66796875 44.0234375 C2.78421956 49.20959201 -2.6616821 52.55298416 -7.98046875 56.10546875 C-10.65636775 57.89483361 -13.28387153 59.71599676 -15.875 61.625 C-16.77798828 62.28628906 -16.77798828 62.28628906 -17.69921875 62.9609375 C-19.92607918 64.88971425 -21.10692056 66.58119062 -21.4609375 69.51953125 C-21.49445313 70.35871094 -21.52796875 71.19789063 -21.5625 72.0625 C-21.95510979 76.78070533 -23.00063063 79.60786358 -26.1875 83.25 C-29.39157303 85.59965355 -32.29024765 85.79561533 -36.1875 85.25 C-39.61515324 83.18227415 -41.89459412 81.12871765 -43.1875 77.25 C-44.04655205 68.49994122 -43.43515004 61.48151773 -38.1875 54.25 C-33.53959545 49.06579877 -27.71363719 45.51114541 -21.80078125 41.92578125 C-17.26751347 39.01879787 -13.24498632 36.33957143 -11.1875 31.25 C-10.44560311 25.84475119 -10.1344407 21.72428302 -13.375 17.1875 C-20.25238003 12.44974932 -27.04043798 12.49825264 -35.1875 13.25 C-40.60827274 14.87530835 -43.97380144 18.73345067 -47.1875 23.25 C-47.89697626 24.63479254 -48.58424819 26.03116381 -49.25 27.4375 C-51.85966017 32.81093413 -51.85966017 32.81093413 -55.1875 34.25 C-59.87423361 34.94596232 -63.11374461 34.92109712 -67.1875 32.375 C-70.57632919 28.77436899 -70.64932676 25.91676468 -70.59375 21.109375 C-69.41907361 12.84146044 -63.71816254 5.24182826 -57.1875 0.25 C-39.2976145 -11.39218702 -17.82614291 -12.47152204 0 0 Z " fill="#F3F7FE" transform="translate(285.1875,240.75)"/>
                                 <path d="M0 0 C3.3125 1.6875 3.3125 1.6875 5 5 C5.87599047 10.84742358 6.02903921 15.98003414 3.3125 21.3125 C-2.01996586 24.02903921 -7.15257642 23.87599047 -13 23 C-16.3125 21.3125 -16.3125 21.3125 -18 18 C-18.87599047 12.15257642 -19.02903921 7.01996586 -16.3125 1.6875 C-10.98003414 -1.02903921 -5.84742358 -0.87599047 0 0 Z " fill="#CCE1FD" transform="translate(260,336)"/>
                              </svg>
                           </span>
                           <p className="table-list-nodata or-text" style={{ textAlign: "center", marginTop: "10px",background:"#f5f5f5" }}>
                              <span style={{ background:"#f5f5f5" }}>No data found</span></p>
                           </p>
                        ) : (
                           <>
                  <div className="row">
                     
                     <div className="col-lg-12 col-12">
                        <div className="row">
                        <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                          <i className="fa-solid fa-store vendor-dashboard-icon"></i>        
                                          </div>
                                          <h5 className="font-weight-bolder mb-0 mt-3">
                                             {vendorDashcount?.contactCount || 0}
                                          </h5>
                                          <span className="vendordash-total">Total Customer</span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/contacts")}}>Manage Customers</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h text-dark"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/contacts"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img1 opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-brands fa-whatsapp text-white"></i>
                                          </div>
                                          <h5 className="font-weight-bolder mb-0 mt-3">
                                             {vendorDashcount?.WhatsappQueueCount || 0}
                                          </h5>
                                          <span className="vendordash-total">Queue Whatsapp</span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/campaign")}}>Manage Queue Whatsapp</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h text-dark"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/campaign"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img2 opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-solid fa-message text-white"></i>
                                          </div>
                                          <h5 className="font-weight-bolder mb-0 mt-3">
                                             0
                                          </h5>
                                          <span className="vendordash-total">Messages in Queue SMS</span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/sms/campaign")}}>Manage Queue SMS</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h text-dark"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/sms/campaign"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-6 dashboard-card">
                              <div className="card">
                                 <span className="mask vendor-dash-bg-img3 opacity-10 border-radius-lg"></span>
                                 <div className="card-body p-3 position-relative">
                                    <div className="row">
                                       <div className="col-9 text-start">
                                          <div className="icon icon-shape bg-dark vendor-dashboard-iconbg shadow text-center border-radius-2xl">
                                             <i className="fa-solid fa-comments text-white"></i>
                                          </div>
                                          <h5 className="font-weight-bolder mb-0 mt-3">
                                             0
                                          </h5>
                                          <span className="vendordash-total">Total SMS Balance </span>
                                          <p className="text-sm text-start font-weight-bolder mt-auto mb-0 cursor-pointer" onClick={()=>{navigate("/vendor/sms/campaign")}}>Manage SMS Balance</p>
                                       </div>
                                       <div className="col-3">
                                          <div className="dropstart text-end mb-6">
                                             <a href="javascript:;" className="cursor-pointer" id="dropdownUsers2" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i className="fa fa-ellipsis-h text-dark"></i>
                                             </a>
                                             <ul className="dropdown-menu vendor-dashboard-card" aria-labelledby="dropdownUsers2">
                                                <li><Link className="dropdown-item border-radius-md" to={"/vendor/sms/campaign"}>View all</Link></li>
                                             </ul>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                      
                  </div>
                  <Footer />
                  </>)} 
               </div>
            </main>
         </DashboardLayout>
      </>
   )
}
export default VendorDashboard;