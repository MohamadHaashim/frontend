import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Page404 from "./views/Page404";

import VendorLogin from "./views/Vendor/Sign-In/vendorLogin";
import VendorRegister from "./views/Vendor/Sign-Up/vendorRegister";
import ForgotPassword from "./views/Vendor/Forgot-Password";
import SuperAdminLogin from "./views/SuperAdmin/SignIn/superadminLogin";
import Dashboard from "./views/SuperAdmin/Dashboard/dashboard";
import VendorManagement from "./views/SuperAdmin/VendorManagement/vendor-management";
import VendorProfile from "./views/Vendor/Profile/profile";
import VendorDashboard from "./views/Vendor/Dashboard/dashboard";
import VendorStore from "./views/Vendor/Stores/store";
import VendorStaff from "./views/Vendor/Staffs/staffs";
import Campaigns from "./views/Campaign/list/campaigns";
import Createcampaign from "./views/Campaign/create/create-campaign";
import Chatbot from "./views/ChatBot/list/chatbot";
// import CampaignDashboard from "./campaign_dashboard";
import WhatsappTemplate from "./views/WhatsApp/templates/list/whatsapp-template-list";
import WhatsappCreateTemplate from "./views/WhatsApp/templates/create/whatsapp-create-template";
import Sms from "./views/Sms/list/sms";
import DashboardVendorProfile from "./views/SuperAdmin/Profile/profile";
import CampaignDashboard from "./views/Campaign/campaignDashboard/campaign-dashboard";
import CreateSms from "./views/Sms/create/create-sms";
import ChatbotFlow from "./views/ChatBot/flow/flow";
import WhatsappNewCampaign from "./views/WhatsApp/templates/campaign_new/campaign-new-template";
import General_Settings from "./views/Vendor/General/general";
import Whatsapp_Settings from "./views/Vendor/Whatsapp-setup/whatsappset";
import Configuration from "./views/SuperAdmin/Configuration/configuration";
import WhatsApp_Chat from "./views/Vendor/Whatsapp-Chat/whatchat";
import StoreContacts from "./views/Vendor/Contacts/list/contact";
import Group from "./views/Vendor/Contacts/groups/group";
import { useEffect, useRef } from "react";
import Sms_Settings from "./views/Vendor/Sms-setup/sms-setup";
import SmsCampaigns from "./views/Sms-Campaign/sms-list/sms-campaignlist";
import CreatesmsPromotion from "./views/Sms-Campaign/sms-create/sms-campaigncreate";
import PromotionmanagementSmsCreate from "./views/Sms-Campaign/sms-reportcampaignDashboard/sms-campreportDashboard";
import SmsCampaignDashboard from "./views/Sms-Campaign/sms-camapignDashboard/sms-campaignDashboard";
import CustomCampaign from "./views/Vendor/Custom-Campaign/customCampaign";
import ContactCustomField from "./views/Vendor/Contacts/custom-field-contact/customcontact-field";
import CatalogDetails from "./views/Vendor/Catalog-Management/Catalog-Details";
import CatalogProductList from "./views/Vendor/Catalog-Management/Product/list";
import CatalogProductCreate from "./views/Vendor/Catalog-Management/Product/create";
import Catalog_Settings from "./views/Vendor/Catalog-setup/catalog-setup";
import CatalogOrderList from "./views/Vendor/Catalog-Management/Orders";
import ProductImages from "./views/Vendor/Catalog-Management/Product-Images";
import Catalog_Bot from "./views/Vendor/Catalog-Bot/catalog-bot";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelector(".App")?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  
    return (
    <div className="App">
      <Routes>
        <Route path="/super-admin/sign-in" element={<SuperAdminLogin />} />
        <Route path="/super-admin/dashboard" element={<Dashboard />} />
        <Route path="/super-admin/profile" element={<DashboardVendorProfile />} />
        <Route path="/super-admin/vendor-management" element={<VendorManagement />} />
        <Route path="/super-admin/general" element={<Configuration />} />

        <Route path="/" element={<VendorLogin />} />
        <Route path="/sign-up" element={<VendorRegister />} />
        <Route path="/sign-in" element={<VendorLogin />} />
        <Route path="/super-admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Page404 />} />

        <Route path="/vendor/profile" element={<VendorProfile />} />
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/store" element={<VendorStore />} />
        <Route path="/vendor/staff" element={<VendorStaff />} />
        <Route path="/vendor/contacts" element={<StoreContacts />} />
        <Route path="/vendor/groupcontacts" element={<StoreContacts />} />
        <Route path="/vendor/contacts/custom-fields" element={<ContactCustomField />} />
        <Route path="/vendor/contacts/groups" element={<Group />} />
        <Route path="/vendor/campaign" element={<Campaigns />} />
        <Route path="/vendor/campaign/dashboard" element={<CampaignDashboard />} />
        <Route path="/vendor/campaign/dashboard/:id" element={<CampaignDashboard />} />
        <Route path="/vendor/create-campaign" element={<Createcampaign />} />
        <Route path="/vendor/smscampaign-create" element={<CreatesmsPromotion />} />
        <Route path="/vendor/contact/whatsapp/contact/send-template-message/:id" element={<Createcampaign />} />
        <Route path="/vendor/chat-bot" element={<Chatbot />} />
        <Route path="/vendor/chat-bot/flow" element={<ChatbotFlow />} />
        <Route path="/vendor/whatsapp-template" element={<WhatsappTemplate />} />
        <Route path="/vendor/create-whatsapp-template" element={<WhatsappCreateTemplate />} />
        <Route path="/vendor/edit-whatsapp-template" element={<WhatsappCreateTemplate />} />
        <Route path="/vendor/edit-whatsapp-template/:id" element={<WhatsappCreateTemplate />} />
        <Route path='/vendor/campaign/create/new' element={<WhatsappNewCampaign />} />
        <Route path='/vendor/campaign/create/new/:name/:id' element={<WhatsappNewCampaign />} />
        <Route path="/vendor/whatapp-chat" element={<WhatsApp_Chat />} />
        <Route path="/vendor/whatapp-chat/:id" element={<WhatsApp_Chat />} />
        <Route path='/vendor/settings/whatsapp' element={<Whatsapp_Settings />} />
        <Route path='/vendor/settings/sms' element={<Sms_Settings />} />
        <Route path='/vendor/settings/general' element={<General_Settings />} />
        <Route path='/vendor/settings/custom-campaign' element={<CustomCampaign />} />
        <Route path='/vendor/settings/catalog' element={<Catalog_Settings />} />
        <Route path='/vendor/settings/catalog/bot' element={<Catalog_Bot />} />
        <Route path="/vendor/create-sms" element={<CreateSms />} />
        <Route path="/vendor/edit-sms/:id" element={<CreateSms />} />
        <Route path="/vendor/sms-template" element={<Sms />} />
        <Route path="/vendor/sms/campaign" element={<SmsCampaigns />} />
        <Route path="/vendor/sms/campaign/:name/:id" element={<SmsCampaigns />} />
        <Route path="/vendor/sms-campaign/dashboard/:id" element={<SmsCampaignDashboard />} />
        <Route path="/vendor/sms-reportcampaign/dashboard" element={<PromotionmanagementSmsCreate />} />
        <Route path="/vendor/catalog/details" element={<CatalogDetails />} />
        <Route path="/vendor/catalog/product/details" element={<CatalogProductList />} />
        <Route path="/vendor/catalog/product/images" element={<ProductImages />} />
        <Route path="/vendor/catalog/orders" element={<CatalogOrderList />} />
        <Route path="/vendor/catalog/product/create" element={<CatalogProductCreate/>} />
        <Route path="/vendor/catalog/product/edit/:id" element={<CatalogProductCreate/>} />
      </Routes>
      <ToastContainer
        className="toast-position"
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // theme="dark"
        style={{ width: "500px" }}
      // #00D26E
      />
    </div>
  );
  
}

export default App;
