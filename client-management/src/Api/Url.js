let Url = {
  start:"http://192.168.0.122/client_management_api/",
  // start:"https://d8d4-183-82-178-141.ngrok-free.app/client_management_api/",
  // start: "http://clientmanagementapi.hermonsolutions.com",
  clientCreate: "/client/create",
  login: "/login",
  clientList: "/client/list",
  clientEdit: "/client/update",
  clientDelete: "/client/delete/",

  userCreate: "/user/create",
  userList: "/user/list",
  userEdit: "/user/update",
  userDelete: "/user/delete/",

  domainCreate: "/domain/create",
  domainList: "/domain/list",
  domainEdit: "/domain/update",
  domainDelete: "/domain/delete/",

  hostingCreate1: "/hosting/create",
  hostingList: "/hosting/list",
  hostingEdit1: "/hosting/update",
  hostingDelete: "/hosting/delete/",

  credentialCreate: "/service_provider/create",
  credentialList: "/service_provider/list",
  credentialEdit: "/service_provider/update",
  credentialDelete: "/service_provider/delete/",

  tenantCreate: "/tenant/create",
  tenantList: "/tenant/list",
  tenantEdit: "/tenant/update",
  tenantDelete: "/tenant/delete/",

  // Method

  logout: "/logout/",
  forgot: "/login/forgotPassword",
  reset: "/login/resetPassword/",
  change: "/login/changePassword",
  validEmail: "/login/validateToken",

  // Get Api
  getApi: "/client/get/",
  tenantGet: "/tenant/get/",
  domainGet: "/domain/get/",
  serviceGet: "/service_provider/get/",
  hostGet: "/hosting/get/",
  userGet: "/user/get/",

  // Image Upload Api In Client

  imageUpload: "/fileUpload/imageInsert",

  // Image Upload Api In Tenant

  imageUpload: "/fileUpload/imageInsert",

  // Image Show

  imageShowed: "/uploads/images/",

  // Forgot
  resendMail: "/login/resendMail",

  // HostingGet Drop

  hostingGetDrop1: "/hosting/get/servicelist",
  hostingGetDrop2: "/hosting/get/clientlist",

  // Service Offered Dynamic Image

  // serviceOffered:"http://192.168.0.101/client_management_api/api/",
  serviceOffered: "http://clientmanagementapi.hermonsolutions.com",

  // Image Upload

  superProfile: "/tenant/getsuperadmin/",
  userProfile: "/client/get/getadmin/",

  // My Profile User Update
  userProfileUpdate: "/register/update",

  // My Profile User Delete
  userProfileDelete: "/register/delete/",
};

export default Url;
