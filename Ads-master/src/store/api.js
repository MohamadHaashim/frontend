const BASE_URL = process.env.REACT_APP_API_BASE
export const API = {
  amazonGetData: BASE_URL + "/api/amazon/configAds/configAccount",
  amazonConnect: BASE_URL + "/api/amazon/configAds/connectAccount",
  checkConnectAccount: BASE_URL + '/api/amazon/configAds/checkConnectAccount',
  unlinkConnectAccount: BASE_URL + '/api/amazon/configAds/unlinkConnectAccount',
  listProfiles: BASE_URL + "/api/amazon/ads/listProfiles",
  listCampaigns: BASE_URL + "/api/amazon/ads/",
  getSingleCampaigns: BASE_URL + "/api/amazon/ads/",
  mainAccountList: BASE_URL + "/api/amazon/ads/managerAccounts",
  signUp: BASE_URL + "/api/amazon/customer/register",
  SignIn: BASE_URL + "/api/amazon/customer/login",
  forgotPassword: BASE_URL + "/api/amazon/customer/forgetPassword",
  otpVerify: BASE_URL + "/api/amazon/customer/verifyOtp",
  resetPassword: BASE_URL + "/api/amazon/customer/resetPassword",
  getUserProfile: BASE_URL + "/api/amazon/customer/getProfile",
  createRule: BASE_URL + "/api/amazon/ads/",
  changeStatus: BASE_URL + "/api/amazon/ads/changeStatus",
  searchProfile: BASE_URL + "/api/amazon/ads/listProfiles",
  listDashboardProfiles: BASE_URL + "/api/amazon/ads/dashboard"
};