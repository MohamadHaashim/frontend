import { Routes, Route } from "react-router-dom";
import './App.css';
import Page404 from "./views/Page404";
import SignUp from "./views/Signup";
import SignIn from "./views/Signin";
import LandingPage from "./views/Home";
import MyAccount from "./views/MyAccount";
import DeliveryReport from "./views/DeliveryReport";
import ContentHub from "./views/ContentHub";
import MyCampaigns from "./views/My_Campaign";
import EditCampaigns from "./views/Edit_Campaign";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import PropertyDetails from "./views/PropertyDetails";
import Proof_of_play from "./views/Proof_of_play";
import Assign_creative from "./views/AssignCreative";
import CompanyDetails from "./views/CompanyDetails";
import ForgotPassword from "./views/ForgotPassword";
import RegisterPassword from "./views/RegisterPassword";
import Invoice from "./views/Invoice";
import PropertyList from "./views/PropertyList";
import CreateCampaign from "./views/Create_Campaign";
import DeliveryReportView from "./views/Delivery_report_view";
import NegotiateCampaign from "./views/Negotiation";
import ExploreProperty from "./views/ExploreProperty";
import MyCartDetails from "./views/MyCart";
import DeliveryReportTableView from "./views/DeliveryReport_Table_View";
import { useEffect, useState } from "react";
import PaymentPending from "./views/Payment_Pending";
import Payment_Success from "./views/Payment_Success";
import ExplorePropertyDetails from "./views/ExplorePropertDetails";
function App() {
  const base_path = process.env.REACT_APP_BASE_PATH
  const [activeTheme, setActiveTheme] = useState('theme-blue');
  const [currencyCode, setCurrencyCode] = useState('');
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/theme.json?t=${new Date().getTime()}`);
        const data = await response.json();
        setActiveTheme(`theme-${data.colour}`)


      } catch (error) {
      }
    };
    fetchTheme();
  }, []);


  return (
    <div className={"App " + activeTheme}>
      <Routes>
        <Route path={`${base_path}/`} element={<LandingPage setCurrencyCode={setCurrencyCode} />} />
        <Route path={`${base_path}/sign-in`} element={<SignIn setCurrencyCode={setCurrencyCode} />} />
        <Route path={`${base_path}/landing-page`} element={<LandingPage setCurrencyCode={setCurrencyCode} />} />
        <Route path={`${base_path}/sign-up`} element={<SignUp />} />
        <Route path={`${base_path}/company-details`} element={<CompanyDetails />} />
        <Route path={`${base_path}/forgot-password`} element={<ForgotPassword />} />
        <Route path={`${base_path}/register-password`} element={<RegisterPassword />} />

        <Route path={`${base_path}/property-details`} element={<PropertyDetails currencyCode={currencyCode} />} />
        <Route path={`${base_path}/exploreproperty-details`} element={<ExplorePropertyDetails currencyCode={currencyCode} />} />
        <Route path={`${base_path}/propertylist`} element={<PropertyList currencyCode={currencyCode} />} />
        <Route path={`${base_path}/invoice`} element={<Invoice currencyCode={currencyCode} />} />
        <Route path={`${base_path}/proof-of-play`} element={<Proof_of_play />} />
        <Route path={`${base_path}/assign-creative`} element={<Assign_creative />} />
        <Route path={`${base_path}/mycart`} element={<MyCartDetails currencyCode={currencyCode} />} />
        <Route path={`${base_path}/myaccount`} element={<MyAccount />} />
        <Route path={`${base_path}/delivery-report`} element={<DeliveryReport />} />
        <Route path={`${base_path}/deliverytableview`} element={<DeliveryReportTableView />} />
        <Route path={`${base_path}/delivery-view`} element={<DeliveryReportView />} />
        <Route path={`${base_path}/contenthub`} element={<ContentHub />} />
        <Route path={`${base_path}/my-campaigns`} element={<MyCampaigns list={{ id: "", startDate: "", endDate: "" }} currencyCode={currencyCode} />} />
        <Route path={`${base_path}/create-campaign`} element={<CreateCampaign />} />
        <Route path={`${base_path}/explorenew/create-campaign`} element={<CreateCampaign />} />
        <Route path={`${base_path}/editcampaign`} element={<EditCampaigns currencyCode={currencyCode} />} />
        <Route path={`${base_path}/negotiate`} element={<NegotiateCampaign currencyCode={currencyCode} />} />
        <Route path={`${base_path}/explore-property`} element={<ExploreProperty currencyCode={currencyCode} />} />
        <Route path={`${base_path}/payment-pending`} element={<PaymentPending currencyCode={currencyCode} />} />
        <Route path={`${base_path}/payment-success`} element={<Payment_Success />} />
        <Route path={`${base_path}/payment-success/:id`} element={<Payment_Success />} />
        <Route path="*" element={<Page404 />} />

      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default App;
