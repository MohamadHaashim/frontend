import API_EP_BOOK from "../endpoints";
import API from "../api";

const signinAPIEP = API_EP_BOOK.SIGNIN_API_EP;
const sAdminsignInAPI = API_EP_BOOK.SADMINSIGNIN_API_EP;
const logoutInAPI = API_EP_BOOK.USER_LOGOUT_API_EP;
const signupAPIEP = API_EP_BOOK.SIGNUP_API_EP;
const forgotpasswordAPIEP = API_EP_BOOK.FORGOTPASSWORD_API_EP;
const resentMailAPIEP = API_EP_BOOK.RESEND_ACTIVATION_EMAIL_API_EP;
const LoginAPI = {
  signupAPI: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    }; const getResponse = API(signupAPIEP, requestAPIData);
    return getResponse;
  },
  signInAPI: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(signinAPIEP, requestAPIData);
    return getResponse;
  },
  sAdminsignInAPI: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(sAdminsignInAPI, requestAPIData);
    return getResponse;
  },
  logoutAPI: function () {
    const getResponse = API(logoutInAPI);
    return getResponse;
  },

  forgotpasswordAPI: function () {
    const getResponse = API(forgotpasswordAPIEP);
    return getResponse;
  },
  resentActivationMailAPI: function () {
    const getResponse = API(resentMailAPIEP);
    return getResponse;
  }
}
export default LoginAPI;