import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './Dashboard/Dashboard';

import User from './Components/User';
import Login from './Components/Login';
import Domain from './Components/Domain';
import Hosting from './Components/Hosting';
import Credentials from './Components/Credentials';
import ClientManagement from './Components/ClientManagement';
import { ToastContainer, toast } from "react-toastify";
import Register from './Components/Register';

import Url from './Api/Url';
import Userpage from './Routing/Userpage';
import Domainpage from './Routing/Domainpage';
import Hostingpage from './Routing/Hostingpage';
import Credentialspage from './Routing/Credentialspage';
import Clientform from './Forms/Clientform';
import Clientpage from './Routing/Clientpage';
import Userform from './Forms/Userform';
import Domainform from './Forms/Domainform';
import Hostingform from './Forms/Hostingform';
import Credentialsform from './Forms/Credentialsform';

import Forgot from './Components/Forgot';
import Reset from './Components/Reset';
import Change from './Components/Change';
import View from './Components/View';

import SuperAdmin from './Components/SuperAdmin';
import SuperDashboard from './Dashboard/SuperDashboard';
import TenentManagement from './Components/TenentManagement';

import TenentForm from './Forms/TenentForm';
import TenentPage from './Routing/TenentPage';
import SuperView from './Components/SuperView';
import MyProfile from './Components/MyProfile';
import SuperProfile from './Components/SuperProfile';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SuperAdmin/>}/>
          <Route path='/Login' element={<Login />} />
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/SuperProfile' element={<SuperProfile />} />
          <Route path='/MyProfile' element={<MyProfile/>} />
          <Route path='/User' element={<User />} />
          <Route path='/Domain' element={<Domain />} />
          <Route path='/Hosting' element={<Hosting />} />
          <Route path='/Credentials' element={<Credentials />} />
          <Route path='/ClientManagement' element={<ClientManagement />} />
          <Route path='/Register' element={<Register />} />
          <Route path='/Url' element={<Url/>}/>

{/* add page routing */}

          <Route path='/Clientpage/Edit/:id' element={<Clientpage />} />
          <Route path='/Clientpage/Add' element={<Clientpage />} />
          <Route path='/Clientpage' element={<Clientpage />} />
          <Route path='/Userpage/Add' element={<Userpage/>}/>
          <Route path='/Userpage/Edit/:id' element={<Userpage/>}/>
          <Route path='/Domainpage/Add' element={<Domainpage/>}/>
          <Route path='/Domainpage/Edit/:id' element={<Domainpage/>}/>
          <Route path='/Hostingpage/Add' element={<Hostingpage/>}/>
          <Route path='/Hostingpage/Edit/:id' element={<Hostingpage/>}/>
          <Route path='/Credentialspage/Add' element={<Credentialspage/>}/>
          <Route path='/Credentialspage/Edit/:id' element={<Credentialspage/>}/>
          <Route path='/TenentPage/Add' element={<TenentPage/>}/>
          <Route path='/TenentPage/Edit/:id' element={<TenentPage/>}/>

          {/* form component */}
          <Route path='/TenentForm' element={<TenentForm/>}/>
          <Route path='/Clientform' element={<Clientform/>}/>
          <Route path='/Userform' element={<Userform/>}/>
          <Route path='/Domainform' element={<Domainform/>}/>
          <Route path='/Hostingform' element={<Hostingform/>}/>
          <Route path='/Credentialsform' element={<Credentialsform/>}/>
          <Route path='/Forgot' element={<Forgot/>}/>
          <Route path='/Reset/:token' element={<Reset/>}/>
          <Route path='/Change' element={<Change/>}/>
          <Route path='/View/:id' element={<View/>}/>
          <Route path='/View' element={<View/>}/>
          <Route path='SuperView' element={<SuperView />}/>
          <Route path='SuperView/:id' element={<SuperView />}/>
          
          {/* Super Admin */}

          <Route path='/SuperDashboard' element={<SuperDashboard/>}/>
          <Route path='/TenentManagement' element={<TenentManagement/>}/>
         
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
        theme="dark"
      />

    </div>
  );
}

export default App;




