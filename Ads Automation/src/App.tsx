import { Routes, Route, useLocation } from "react-router-dom";
// import PrivateRoute from './routes/privateRoutes';

import SignUp from "./views/Signup";
import SignupSuccess from "./views/Signup/signupSuccess";
import ResendActicationMail from "./views/Signup/resendActivationMail";
import ResendActicationMailSuccess from "./views/Signup/resendActivationMailSuccess";
import EmailActivation from "./views/Signup/emailActivation";

import Forgotpassword from "./views/Forgotpassword";
import ForgorpasswordSuccess from "./views/Forgotpassword/forgorpasswordSuccess";
import SetNewPassword from "./views/Forgotpassword/setNewPassword";
import Page404 from "./views/Page404";
import SignIn from "./views/Signin";
import Onboard from "./views/Onboard";
import OnboardFailed from "./views/Onboard/failed";
import OnboardSuccess from "./views/Onboard/success";
import BrowserExtension from "./views/Onboard/browserExtension";
import OnboardComplete from "./views/Onboard/onboardComplete";
import Dashboard from "./views/Dashboard";
import Bookshelfs from "./views/Bookshelfs";
import AutomationRules from "./views/AutomationRules";
import ChangeLogAutomationRules from "./views/AutomationRules/changeLog";

import CreateAutomationRules from "./views/AutomationRules/CreateRules";
import AdsCompaignManager from "./views/Ads/adsCompaignManager";
import BudgetOptimizer from "./views/Ads/BudgetOptimizer"
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MyProfile from "./views/MyAccount/MyProfile/myProfile";
import BillingPlan from "./views/MyAccount/BillingPlan/billingPlan";
import AmazonConnection from "./views/MyAccount/AmazonConnection/amazonConnection";
import Notification from "./views/MyAccount/Notification/notification";
import AdsCreaction from "./views/Ads/creation";
import CreateManualCampaign from "./views/Ads/creation/components/createManualCampaign";
import CreateAutoCampaign from "./views/Ads/creation/components/createAutoCampaign";
import Faq from "./views/Faq/faq";
import Header from "./shared/Header";
import { useState } from "react";
import BulkOperation from "./views/AutomationRules/bulkOperation";
import Campaign from "./views/Campaign/campaign";
import Recommendation from "./views/Recommendation/recommendation";
import AddRules from "./views/AutomationRules/CreateRules/components/add-rule";
import AddNewRules from "./views/AutomationRules/CreateRules/components/add-new-rule";
import AuditLog from "./views/AudidLog";
import Sales from "./views/Reports/sales";
import Report from "./views/Reports";
import SPTraffic from "./views/Reports/spmarket";
import BackgroundSync from "./views/Recommendation/backgroundSync";
import Tacos from "./views/Reports/tacos";
import Settings from "./views/Profile";
import Profile from "./views/Profile";
import Scheduler from "./views/Scheduler/scheduler";
import Template from "./views/AutomationRules/template";
import Admin from "./views/Admin/Profile/index";
import Adminuser from "./views/Admin/users/index";
import AddNewRulesBudget from "./views/AutomationRules/CreateRules/components/add-new-rule-budget";

export const App = () => {
  const [searchResult, setSearchResult] = useState("");
  const location = useLocation();
  const handleSearch = (searchTerm: any) => {
    setSearchResult(searchTerm);
  };
  return (
    <div className="App">
      <div className="maincont">
        {location.pathname !== "/sign-in" && location.pathname !== "/" && (
          <Header onSearch={handleSearch} />
        )}
      </div>

      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-up-success" element={<SignupSuccess />} />
        <Route path="/email-activation" element={<EmailActivation />} />
        <Route
          path="/resend-activation-mail"
          element={<ResendActicationMail />}
        />
        <Route
          path="/resend-activation-mail-success"
          element={<ResendActicationMailSuccess />}
        />

        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route
          path="/forgot-password/success"
          element={<ForgorpasswordSuccess />}
        />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/onboarding" element={<Onboard />} />
        <Route path="/onboarding/success" element={<OnboardSuccess />} />
        <Route path="/onboarding/failed" element={<OnboardFailed />} />
        <Route
          path="/onboarding/browser-extension"
          element={<BrowserExtension />}
        />
        <Route path="/onboarding/finish" element={<OnboardComplete />} />

        <Route
          path="/dashboard"
          element={<Dashboard searchResult={searchResult} />}
        />
          <Route path="/scheduler" element={<Scheduler />} />
        <Route
          path="/profile"
          element={<Profile/>}
        />
        <Route path="/faq" element={<Faq />} />
        <Route path="/bookshelfs" element={<Bookshelfs />} />
        <Route path="/ads/bulk-operation" element={<BulkOperation />} />
        <Route
          path="/ads/campaign"
          element={<Campaign searchResult={searchResult} />}
        />
        <Route
          path="/reports/sales"
          element={<Report searchResult={searchResult}  />}
        />
        <Route
          path="/reports/sp-traffic-conversion"
          element={<SPTraffic searchResult={searchResult}  />}
        />
        <Route
          path="/reports/tacos"
          element={<Tacos searchResult={searchResult}  />}
        />
        <Route
          path="/log/recommendation"
          element={<Recommendation searchResult={searchResult} />}
        />
        <Route
          path="/log/background-sync"
          element={<BackgroundSync searchResult={searchResult} />}
        />

        <Route
          path="/ads/automation-rules"
          element={<AutomationRules searchResult={searchResult} />}
        />
        <Route
          path="/ads/rules-template"
          element={<Template searchResult={searchResult} />}
        />

        <Route
          path="/ads/automation-rules/audit-log/:id"
          element={<ChangeLogAutomationRules />}
        />
        <Route
          path="/log/change-log"
          element={<AuditLog searchResult={searchResult} />}
        />
        <Route
          path="/ads/create-automation-rules/:id"
          element={<CreateAutomationRules searchResult={searchResult} />}
        />

        <Route
          path="/ads/add-automation-rules/:id"
          element={<AddRules searchResult={searchResult} />}
        />
        <Route
          path="/ads/add-automation-newrules/:id/:type"
          element={<AddNewRules searchResult={searchResult} />}
        />

        <Route
          path="/ads/add-automation-newbudgetrules/:id/:type"
          element={<AddNewRulesBudget searchResult={searchResult} />}
        />

        <Route
          path="/ads/ads-compaign-manager"
          element={<AdsCompaignManager searchResult={searchResult} />}
        />
        <Route
          path="/budget/ads-budget-optimizer"
          element={<BudgetOptimizer searchResult={searchResult} />}
        />
        <Route path="/ads/ads-creation" element={<AdsCreaction />} />
        <Route
          path="/ads/ads-creation/auto-campaign/:id"
          element={<CreateAutoCampaign />}
        />
        <Route
          path="/ads/ads-creation/auto-campaign/:asin/:id"
          element={<CreateAutoCampaign />}
        />
        <Route
          path="/ads/ads-creation/manual-campaign/:id"
          element={<CreateManualCampaign />}
        />

        <Route path="/my-account/profile" element={<MyProfile />} />
        <Route path="/my-account/billing" element={<BillingPlan />} />
        <Route path="/my-account/notification" element={<Notification />} />
        <Route
          path="/my-account/amazon-connection"
          element={<AmazonConnection />}
        />

      <Route path="/admin/profile" element={<Admin />} />
      <Route path="/admin/user" element={<Adminuser />} />

        {/* Private Route */}
        {/* <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      /> */}
        <Route path="*" element={<Page404 />} />
      </Routes>
      <ToastContainer
        className="toast-position"
        position="bottom-center"
        autoClose={3000}
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
};

export default App;
