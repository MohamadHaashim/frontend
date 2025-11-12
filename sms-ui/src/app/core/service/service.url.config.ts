import { environment } from '../../../environments/environment';

export class ServiceConfig {
  public static API_ENDPOINT = environment.baseUrl;

  public services = {
    // Login API's
    login: {
      url: ServiceConfig.API_ENDPOINT + 'login',
      header: true,
      autherization: false,
    },
    logout: {
      url: ServiceConfig.API_ENDPOINT + 'logout',
      header: true,
      autherization: true,
    },

    // Upload Assert
    uploadAssert: {
      url: ServiceConfig.API_ENDPOINT + 'upload/assert',
      header: true,
      autherization: false,
    },

    //school API
    schoolCreate:{
      url: ServiceConfig.API_ENDPOINT + 'school/create',
      header: true,
      autherization: true,
    },
    fileUploadSchool: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/school/insert',
      header: true,
      autherization: true,
    },
    fileUpdateSchool: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/school/update',
      header: true,
      autherization: true,
    },
    fileUpdateAdmin: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/admin/update',
      header: true,
      autherization: true,
    },
    fileDeleteSchool: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/school/delete/:schoolId',
      header: true,
      autherization: true,
    },
    fileDeleteAdmin: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/admin/delete/:userId',
      header: true,
      autherization: true,
    },
    fileUploadAdmin: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/admin/insert',
      header: true,
      autherization: true,
    },
    schoolList:{
      url: ServiceConfig.API_ENDPOINT + 'school/list',
      header: true,
      autherization: true,
    },
    schoolGet:{
      url: ServiceConfig.API_ENDPOINT + 'school/get/:schoolId',
      header: true,
      autherization: true,
    },
    schoolNameList: {
      url: ServiceConfig.API_ENDPOINT + 'school/nameList',
      header: true,
      autherization: true,
    },
    schoolUpdate:{
      url: ServiceConfig.API_ENDPOINT + 'school/update',
      header: true,
      autherization: true,
    },
    schoolDelete:{
      url: ServiceConfig.API_ENDPOINT + 'school/delete/:schoolId',
      header: true,
      autherization: true,
    },
    //Admin API
    adminCreate:{
      url: ServiceConfig.API_ENDPOINT + 'admin/create',
      header: true,
      autherization: true,
    },
    adminList:{
      url: ServiceConfig.API_ENDPOINT + 'admin/list',
      header: true,
      autherization: true,
    },
    adminGet:{
      url: ServiceConfig.API_ENDPOINT + 'admin/get/:adminId',
      header: true,
      autherization: true,
    },
    adminUpdate:{
      url: ServiceConfig.API_ENDPOINT + 'admin/update',
      header: true,
      autherization: true,
    },
    adminDelete:{
      url: ServiceConfig.API_ENDPOINT + 'admin/delete/:adminId',
      header: true,
      autherization: true,
    },
    //forgotPassword
    forgotPasword:{
      url:ServiceConfig.API_ENDPOINT+ 'login/forgotPassword',
      header:true,
      autherization:true,
    },
    //resetPassword
    resetPassword:{
      url:ServiceConfig.API_ENDPOINT+ 'login/resetPassword/:token',
      header:true,
      autherization:true,
    },
    //caste API
    casteCreate: {
      url: ServiceConfig.API_ENDPOINT + 'category/create',
      header: true,
      autherization: true,
    },
    casteList:{
      url: ServiceConfig.API_ENDPOINT + 'category/list',
      header: true,
      autherization: true,
    },
    casteGet:{
      url: ServiceConfig.API_ENDPOINT + 'category/get/:casteId',
      header: true,
      autherization: true,
    },
    casteUpdate:{
      url: ServiceConfig.API_ENDPOINT + 'category/update',
      header: true,
      autherization: true,
    },
    casteDelete:{
      url: ServiceConfig.API_ENDPOINT + 'category/delete/:casteId',
      header: true,
      autherization: true,
    },
    //religion create
    religionCreate:{
      url: ServiceConfig.API_ENDPOINT + 'religion/create',
      header: true,
      autherization: true,
    },
    religionList:{
      url: ServiceConfig.API_ENDPOINT + 'religion/list',
      header: true,
      autherization: true,
    },
    religionGet:{
      url: ServiceConfig.API_ENDPOINT + 'religion/get/:religionId',
      header: true,
      autherization: true,
    },
    religionUpdate:{
      url: ServiceConfig.API_ENDPOINT + 'religion/update',
      header: true,
      autherization: true,
    },
    religionDelete:{
      url: ServiceConfig.API_ENDPOINT + 'religion/delete/:religionId',
      header: true,
      autherization: true,
    },
    // User
    register: {
      url: ServiceConfig.API_ENDPOINT + 'register',
      header: true,
      autherization: false,
    },
    forgotPassword: {
      url: ServiceConfig.API_ENDPOINT + 'login/forgotPassword',
      header: true,
      autherization: false,
    },
    forgotPasswordLogin: {
      url: ServiceConfig.API_ENDPOINT + 'login/forgotPasswordLogin',
      header: true,
      autherization: false,
    },
    getUserDetails: {
      url: ServiceConfig.API_ENDPOINT + 'user/getUserDetails',
      header: true,
      autherization: true,
    },
    changePassword: {
      url: ServiceConfig.API_ENDPOINT + 'user/changePassword',
      header: true,
      autherization: true,
    },

    // Student API's
    addStudentPrimaryDetails: {
      url: ServiceConfig.API_ENDPOINT + 'student/addStudentPrimaryDetails',
      header: true,
      autherization: true,
    },
    addStudentPersonalDetails: {
      url: ServiceConfig.API_ENDPOINT + 'student/addStudentPersonalDetails',
      header: true,
      autherization: true,
    },
    addStudentContactDetails: {
      url: ServiceConfig.API_ENDPOINT + 'student/addStudentContactDetails',
      header: true,
      autherization: true,
    },
    addStudentEducationDetails: {
      url: ServiceConfig.API_ENDPOINT + 'student/addStudentEducationDetails',
      header: true,
      autherization: true,
    },
    addStudentCourseDetails: {
      url: ServiceConfig.API_ENDPOINT + 'student/addStudentCourseDetails',
      header: true,
      autherization: true,
    },
    addStudentOtherDetails: {
      url: ServiceConfig.API_ENDPOINT + 'student/addStudentOtherDetails',
      header: true,
      autherization: true,
    },

    getStudentList: {
      url: ServiceConfig.API_ENDPOINT + 'student/getStudentList',
      header: true,
      autherization: true,
    },
    searchForStudent: {
      url: ServiceConfig.API_ENDPOINT + 'student/searchForStudent',
      header: true,
      autherization: true,
    },
    getStudentSinglePrimaryData: {
      url:
        ServiceConfig.API_ENDPOINT +
        'student/getStudentSinglePrimaryData/:studentId',
      header: true,
      autherization: true,
    },
    getStudentProfileDetails: {
      url:
        ServiceConfig.API_ENDPOINT +
        'student/getStudentProfileDetails/:studentId',
      header: true,
      autherization: true,
    },
    getStudentContactDetails: {
      url:
        ServiceConfig.API_ENDPOINT +
        'student/getStudentContactDetails/:studentId',
      header: true,
      autherization: true,
    },
    getStudentEducationDetails: {
      url:
        ServiceConfig.API_ENDPOINT +
        'student/getStudentEducationDetails/:studentId',
      header: true,
      autherization: true,
    },
    getStudentCourseDetails: {
      url:
        ServiceConfig.API_ENDPOINT +
        'student/getStudentCourseDetails/:studentId',
      header: true,
      autherization: true,
    },
    getStudentOtherDetails: {
      url:
        ServiceConfig.API_ENDPOINT +
        'student/getStudentOtherDetails/:studentId',
      header: true,
      autherization: true,
    },

    deleteStudent: {
      url: ServiceConfig.API_ENDPOINT + 'student/deleteStudent/:studentId',
      header: true,
      autherization: true,
    },

    addComments: {
      url: ServiceConfig.API_ENDPOINT + 'comments/addComments',
      header: true,
      autherization: true,
    },
    getCommentList: {
      url: ServiceConfig.API_ENDPOINT + 'comments/getCommentList',
      header: true,
      autherization: true,
    },
    // Praveen staff API's

    addStaffDetails: {
      url: ServiceConfig.API_ENDPOINT + 'staff/create',
      header: true,
      autherization: true,
    },
    fileUploadStaff: {
      url: ServiceConfig.API_ENDPOINT + 'fileUpload/staff/insert',
      header: true,
      autherization: true,
    },
    editStaffDetails: {
      url: ServiceConfig.API_ENDPOINT + 'staff/editStaffDetails',
      header: true,
      autherization: true,
    },
    assignRolesDetails: {
      url: ServiceConfig.API_ENDPOINT + 'admin/assignRole',
      header: true,
      autherization: true,
    },
    assignSubjectsDetails: {
      url: ServiceConfig.API_ENDPOINT + 'subjects/list',
      header: true,
      autherization: true,
    },
    assignSectionsDetails: {
      url: ServiceConfig.API_ENDPOINT + 'sections/list',
      header: true,
      autherization: true,
    },




    assignClassDetails: {
      url: ServiceConfig.API_ENDPOINT + 'staff/assignClassDetails',
      header: true,
      autherization: true,
    },
    assignSubjectDetails: {
      url: ServiceConfig.API_ENDPOINT + 'staff/assignSubjectDetails',
      header: true,
      autherization: true,
    },
    assignRoleDetails: {
      url: ServiceConfig.API_ENDPOINT + 'staff/assignRoleDetails',
      header: true,
      autherization: true,
    },

   

// Staff List

staffList: {
  url: ServiceConfig.API_ENDPOINT + 'staff/list',
  header: true,
  autherization: true,
},
getStaffList: {
  url: ServiceConfig.API_ENDPOINT + 'staff/get/:id',
  header: true,
  autherization: true,
},
getStaffUpdate: {
  url: ServiceConfig.API_ENDPOINT + 'staff/update',
  header: true,
  autherization: true,
},
getStaffDelete: {
  url: ServiceConfig.API_ENDPOINT + 'staff/delete/:id',
  header: true,
  autherization: true,
},

// Nationlity Dropdown
nationalityClassDropdown: {
  url: ServiceConfig.API_ENDPOINT + 'country/list',
  header: true,
  autherization: true,
},
// State Dropdown
stateClassDropdown: {
  url: ServiceConfig.API_ENDPOINT + 'state/list',
  header: true,
  autherization: true,
},

// Roles Dropdown

assignRolesDropdown: {
  url: ServiceConfig.API_ENDPOINT + 'master/roles',
  header: true,
  autherization: true,
},







    deleteStaff: {
      url: ServiceConfig.API_ENDPOINT + 'staff/deleteStaff/:staffId',
      header: true,
      autherization: true,
    },
    // Dashboard API's
    getDashboradSummary: {
      url: ServiceConfig.API_ENDPOINT + 'dashboard/summary/:userId',
      header: true,
      autherization: true,
    },

    // Master API's
    getCategoryList: {
      url: ServiceConfig.API_ENDPOINT + 'master/category',
      header: true,
      autherization: true,
    },
    getCasteList: {
      url: ServiceConfig.API_ENDPOINT + 'master/caste',
      header: true,
      autherization: true,
    },
    getReligionList: {
      url: ServiceConfig.API_ENDPOINT + 'master/religion',
      header: true,
      autherization: true,
    },
    getBloodGroupList: {
      url: ServiceConfig.API_ENDPOINT + 'master/bloodGroup',
      header: true,
      autherization: true,
    },
    getMotherTongueList: {
      url: ServiceConfig.API_ENDPOINT + 'master/motherTonque',
      header: true,
      autherization: true,
    },
    getHobbiesList: {
      url: ServiceConfig.API_ENDPOINT + 'master/hobbies',
      header: true,
      autherization: true,
    },
    getCulturalTalentsList: {
      url: ServiceConfig.API_ENDPOINT + 'master/culturalTalents',
      header: true,
      autherization: true,
    },
    getHowDoYouComeList: {
      url: ServiceConfig.API_ENDPOINT + 'master/howDoYouCome',
      header: true,
      autherization: true,
    },
    getSportsList: {
      url: ServiceConfig.API_ENDPOINT + 'master/sports',
      header: true,
      autherization: true,
    },
    getStateList: {
      url: ServiceConfig.API_ENDPOINT + 'master/state',
      header: true,
      autherization: true,
    },
    getDistrictList: {
      url: ServiceConfig.API_ENDPOINT + 'master/district/:stateId',
      header: true,
      autherization: true,
    },
    getTalukList: {
      url: ServiceConfig.API_ENDPOINT + 'master/taluk/:distId',
      header: true,
      autherization: true,
    },
    getPanchayatList: {
      url: ServiceConfig.API_ENDPOINT + 'master/panchayat/:talukId',
      header: true,
      autherization: true,
    },
    getWardList: {
      url: ServiceConfig.API_ENDPOINT + 'master/ward/:panchayatId',
      header: true,
      autherization: true,
    },
    getAdmittedCategoryList: {
      url: ServiceConfig.API_ENDPOINT + 'master/admittedCategory',
      header: true,
      autherization: true,
    },
    getClassesList: {
      url: ServiceConfig.API_ENDPOINT + 'master/classes',
      header: true,
      autherization: true,
    },
    getSecondaryLanguageList: {
      url: ServiceConfig.API_ENDPOINT + 'master/secondaryLanguage',
      header: true,
      autherization: true,
    },
    addGeneralDetails: {
      url: ServiceConfig.API_ENDPOINT + 'master/addGeneralDetails',
      header: true,
      autherization: true,
    },
    addFeeDetails: {
      url: ServiceConfig.API_ENDPOINT + 'master/addFeeDetails',
      header: true,
      autherization: true,
    },
    addSessionDetails: {
      url: ServiceConfig.API_ENDPOINT + 'master/addSessionDetails',
      header: true,
      autherization: true,
    },
    addSubjectDetails: {
      url: ServiceConfig.API_ENDPOINT + 'master/addSubjectDetails',
      header: true,
      autherization: true,
    },


     // Fees Api Endpoints

     feesList: {
      url: ServiceConfig.API_ENDPOINT + 'fees/list',
      header: true,
      autherization: true,
    },
    addFeesDetails: {
      url: ServiceConfig.API_ENDPOINT + 'fees/create',
      header: true,
      autherization: true,
    },
    getFeesList: {
      url: ServiceConfig.API_ENDPOINT + 'fees/get/:id',
      header: true,
      autherization: true,
    },
    getFeesEdit: {
      url: ServiceConfig.API_ENDPOINT + 'fees/update',
      header: true,
      autherization: true,
    },

    getFeesDelete: {
      url: ServiceConfig.API_ENDPOINT + 'fees/get/:id',
      header: true,
      autherization: true,
    },

    // Fees Section Dropdown 
    feesSectionDropdown: {
      url: ServiceConfig.API_ENDPOINT + 'sections/list',
      header: true,
      autherization: true,
    },
      // Fees Class Dropdown 
      feesClassDropdown: {
        url: ServiceConfig.API_ENDPOINT + 'classes/list',
        header: true,
        autherization: true,
      },



      // General

       // Fees Class Dropdown 
       addGeneralDetail: {
        url: ServiceConfig.API_ENDPOINT + 'master/addGeneral',
        header: true,
        autherization: true,
      },


  };
  

}
