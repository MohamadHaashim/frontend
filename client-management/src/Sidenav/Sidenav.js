// import React, { useEffect, useState } from 'react'
// import { Link, NavLink, Route, useLocation } from 'react-router-dom'
// function Sidenav() {

 
//   const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

//   const location = useLocation();

//   useEffect(() => {
//     // Check if the current path matches any of the submenu items
//     if (location.pathname.includes('/ClientManagement') ||
//         location.pathname.includes('/User') ||
//         location.pathname.includes('/Domain') ||
//         location.pathname.includes('/Hosting')||
//         location.pathname.includes('/Credentials')) {
//       setIsSubmenuOpen(true);
//     } else {
//       setIsSubmenuOpen(false);
//     }
//   }, [location.pathname]);

//   const toggleSubmenu = () => {
//     setIsSubmenuOpen(!isSubmenuOpen);
//   };
//   const handleLinkClick = () => {
//     setIsSubmenuOpen(false); // Close the submenu when a link is clicked
//   };



  
//   return (
//     <div>
//        {/* <!-- ======= Sidebar ======= --> */}
//   <aside id="sidebar" class="sidebar">

//     <ul class="sidebar-nav" id="sidebar-nav">

//       <li class="nav-item">
//         <Link to="/Dashboard" className={`nav-link collapsed ${location.pathname === '/Dashboard' ? 'active' : ''}`}>
//           <i class="bi bi-grid"></i>
//           <span >Dashboard</span>
//         </Link>
//       </li>
//       {/* <!-- End Dashboard Nav --> */}

//       {/* Components Start */}



// <li className="nav-item">
//       <div className="nav-link collapsed" onClick={toggleSubmenu} style={{ cursor: 'pointer' }}>
       
//         <i className="fa-solid fa-users"></i>
//         <span>Client Management<i class="fa-solid fa-angle-down downaero"></i></span>
//       </div>
//       {isSubmenuOpen && (
//         <ul className="submenu">
//            <li className="nav-item">
//             <Link to="/ClientManagement" className={`nav-link collapsed ${location.pathname === '/ClientManagement' ? 'active' : ''}`}>
//             <i class="fa-solid fa-person-dress"></i>
//               clients
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/User" className={`nav-link collapsed ${location.pathname === '/User' ? 'active' : ''}`}>
//               <i className="fa-solid fa-user"></i>
//               Client User
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/Domain"className={`nav-link collapsed ${location.pathname === '/Domain' ? 'active' : ''}`}>
//               <i className="fa-solid fa-globe"></i>
//               Domain
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/Hosting" className={`nav-link collapsed ${location.pathname === '/Hosting' ? 'active' : ''}`}>
//               <img style={{ width: "20px", marginRight: "5px" }} src='/assets/img/hosting-icon-png-15.jpg' alt="hosting icon" />
//               Hosting
//             </Link>
//           </li>
//           <li class="nav-item">
//         <Link to={"/Credentials"} className={`nav-link collapsed ${location.pathname === '/Credentials' ? 'active' : ''}`}>
//           <img style={{width:"24px",marginRight:"5px"}} src='/assets/img/server.jpg' />
//           <span>Service Credentials</span>
//         </Link>
     
//       </li>
 
//         </ul>
//       )}
//     </li>

   

       
      
      
     

      
//     </ul>

//   </aside>
//   {/* <!-- End Sidebar--> */}

//     </div>
//   )
// }

// export default Sidenav

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import FontAwesome from 'react-fontawesome'
function Sidenav() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const location = useLocation();

  const Navigate = useNavigate()

  // No Token To Redirect

  let token = localStorage.getItem("token");
 
  if(!token||token==null){
    Navigate("/Login")
  }

  useEffect(() => {
    // Check if the current path matches any of the submenu items
    if (
      location.pathname.includes('/ClientManagement') ||
      location.pathname.includes('/User') ||
      location.pathname.includes('/Domain') ||
      location.pathname.includes('/Hosting') ||
      location.pathname.includes('/Credentials')
    ) {
      setIsSubmenuOpen(true);
    }
  }, [location.pathname]);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  // const location = useLocation();
  // const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  // useEffect(() => {
  //   // Check if the current path is one of the submenu paths
  //   const submenuPaths = ['/ClientManagement', '/User', '/Domain', '/Hosting', '/Credentials'];
  //   if (submenuPaths.includes(location.pathname)) {
  //     setIsSubmenuOpen(true);
  //   }
  // }, [location.pathname]);

  // const toggleSubmenu = () => {
  //   setIsSubmenuOpen(!isSubmenuOpen);
  // };

  return (
    <div>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/Dashboard" className={`nav-link collapsed ${location.pathname === '/Dashboard' ? 'active' : ''}`}>
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>




          {/* <li className="nav-item">
      <a
        className={`nav-link ${isSubmenuOpen ? '' : 'collapsed'}`}
        onClick={toggleSubmenu}
        style={{ cursor: 'pointer' }}
        data-bs-target="#forms-nav"
        data-bs-toggle="collapse"
      >
        <i className="fa-solid fa-users"></i><span>Client Management</span><i className="bi bi-chevron-down ms-auto"></i>
      </a>

      <ul id="forms-nav" className={`nav-content collapse ${isSubmenuOpen ? 'show' : ''}`} data-bs-parent="#sidebar-nav">
        <li className="nav-item">
          <Link to="/ClientManagement" className={`nav-link ${location.pathname === '/ClientManagement' ? 'active' : ''}`}>
          <i className="fa-solid fa-person-dress"></i>
          Clients
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/User" className={`nav-link ${location.pathname === '/User' ? 'active' : ''}`}>
          <i className="fa-solid fa-user"></i>
          Client User
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/Domain" className={`nav-link ${location.pathname === '/Domain' ? 'active' : ''}`}>
          <i className="fa-solid fa-globe"></i>Domain
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/Hosting" className={`nav-link ${location.pathname === '/Hosting' ? 'active' : ''}`}>
          <img
                      // style={{ width: '20px', marginRight: '5px' }}
                      src='/assets/img/Hosting.jpg'
                      alt="hosting icon"
                    />
           Hosting
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/Credentials" className={`nav-link ${location.pathname === '/Credentials' ? 'active' : ''}`}>
          <img
                      // style={{ width: '24px', marginRight: '5px' }}
                      src='/assets/img/server.jpg'
                      alt="server icon"
                    />
            Server Credentials
          </Link>
        </li>
      </ul>
    </li> */}



          {/* <!-- End Dashboard Nav --> */}

          {/* Components Start */}

           <li className="nav-item">
            <div className="nav-link collapsed" onClick={toggleSubmenu} style={{ cursor: 'pointer' }}>
              <i className="fa-solid fa-users"></i>
              <span>
                Client Management
                <i className={`fa-solid fa-angle-down downaero ${isSubmenuOpen ? 'rotate' : ''}`}></i>
              </span>
            </div>
            {isSubmenuOpen && (
              <ul className="submenu">
                <li className="nav-item">
                  <Link
                    to="/ClientManagement"
                    className={`nav-link collapsed ${location.pathname === '/ClientManagement' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-person-dress"></i>
                    Clients
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/User"
                    className={`nav-link collapsed ${location.pathname === '/User' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-user"></i>
                    Client User
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Domain"
                    className={`nav-link collapsed ${location.pathname === '/Domain' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-globe"></i>
                    Domain
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Hosting"
                    className={`nav-link collapsed ${location.pathname === '/Hosting' ? 'active' : ''}`}
                  >
                    <img
                      style={{ width: '20px', marginRight: '5px' }}
                      src='/assets/img/Hosting.jpg'
                      alt="hosting icon"
                    />
                    Hosting
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/Credentials"
                    className={`nav-link collapsed ${location.pathname === '/Credentials' ? 'active' : ''}`}
                  >
                    <img
                      style={{ width: '24px', marginRight: '5px' }}
                      src='/assets/img/server.jpg'
                      alt="server icon"
                    />
                    <span>Service Credentials</span>
                  </Link>
                </li>
              </ul>
            )}
          </li> 
        </ul>
      </aside>
      {/* <!-- End Sidebar--> */}
    </div>
  );
}

export default Sidenav;
