import API_EP_BOOK from "../../endpoints";
import API from "../../api";

const signinAPIEP = API_EP_BOOK.SIGNIN_API_EP;
const signupAPIEP = API_EP_BOOK.SIGNUP_API_EP;
const forgotpasswordAPIEP = API_EP_BOOK.FORGOTPASSWORD_API_EP;
const resentMailAPIEP = API_EP_BOOK.RESEND_ACTIVATION_EMAIL_API_EP;
const vendorListAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_LIST;
const vendorCreateAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_CREATE;
const vendorEditAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_EDIT;
const vendorGetAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_GET;
const vendorDeleteAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_DELETE;
const vendorActivateAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_ACTIVE;
const vendorDeactivateAPI = API_EP_BOOK.SUPER_ADMIN_VENDOR_DEACTIVE;

const superAdminLogout = API_EP_BOOK.SIGNOUT_API_EP
const vendorSignInApi = API_EP_BOOK.VENDOR_SIGNIN_API_EP

const LoginAPI = {
  signInAPI: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(signinAPIEP, requestAPIData);
    return getResponse;
  },

  vendorSignInAPI: function (apiData: any) {

    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(vendorSignInApi, requestAPIData);
    return getResponse;
  },

  signupAPI: function () {
    const getResponse = API(signupAPIEP);
    return getResponse;
  },

  signOutAPI: function () {
    const getResponse = API(superAdminLogout);
    return getResponse;
  },

  forgotpasswordAPI: function () {
    const getResponse = API(forgotpasswordAPIEP);
    return getResponse;
  },
  resentActivationMailAPI: function () {
    const getResponse = API(resentMailAPIEP);
    return getResponse;
  },

  //   Vendor List

  vendorListApi: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(vendorListAPI, requestAPIData);
    return getResponse;
  },

  vendorCreateApi: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(vendorCreateAPI, requestAPIData);
    return getResponse;
  },

  vendorUpdateApi: function (apiData: any) {
    const requestAPIData = {
      bodyData: apiData
    };
    const getResponse = API(vendorEditAPI, requestAPIData);
    return getResponse;
  },

  vendorGetApi: function (id: any) {
    const url = vendorGetAPI.url.replace(':id', id);
    const requestAPIData = {
      url: url,
      method: vendorGetAPI.method,
      authorization: vendorGetAPI.authorization
    };
    return API(requestAPIData)
  }
  ,

  vendorDeleteApi: function (id: any) {
    const url = vendorDeleteAPI.url.replace(':id', id);
    const requestAPIData = {
      url: url,
      method: vendorDeleteAPI.method,
      authorization: vendorDeleteAPI.authorization
    };
    return API(requestAPIData)

  },

  vendorActiveApi: function (id: any) {
    const url = vendorActivateAPI.url.replace(':id', id);
    const requestAPIData = {
      url: url,
      method: vendorActivateAPI.method,
      authorization: vendorActivateAPI.authorization
    };
    return API(requestAPIData)
  },

  vendorDeactiveApi: function (id: any) {
    const url = vendorDeactivateAPI.url.replace(':id', id);
    const requestAPIData = {
      url: url,
      method: vendorDeactivateAPI.method,
      authorization: vendorDeactivateAPI.authorization
    };
    return API(requestAPIData)
  }


}
export default LoginAPI;