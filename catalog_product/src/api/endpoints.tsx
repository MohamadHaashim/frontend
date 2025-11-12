let endpoints = {
	SIGNIN: 'login',
	SADMINSIGNIN: 'superadmin/login',
	SIGNUP: 'register',
	FORGOTPASSWORD: '/Users/ForgotPassword',
	ACTIVATION: '/Users/Activate',
	RESENTACTIVATION: '/Users/ResendActivationEmail',
	SIGNOUT: 'logout',

	RESETPASSWORD: '/Users/ResetPassword',
	UPDATEUSER: '/Users/:id',
	USERBYID: '/Users/:id',
	USERME: '/Users/Me',
	LOGOUT: 'logout',

	USERONBOARDING: '/Users/Onboarding/ProfilePreferences',
	PROFILE: '/Users/Profile',
	UPDATEPROFILE: '/Users/Profile',
	UPDATEPROFILEIMAGE: '/Users/Profile',
	METADATA: '/MasterData',

	//STORE
	LISTSTORE: 'store/list',
	CREATESTORE: 'store/create',
	GETBYIDSTORE: 'store/get/:id',
	IMPORTSTORE: 'store/importstorefromexcel',
	EXPORTSTORE: 'store/exportstoretoexcel',
	EXPORTHEADERSTORE: 'store/exportisheader',
	DELETESTORE: 'store/delete/:id',
	UPDATESTORE: "store/update",
	ACTIVESTORE: "store/active/:id",
	DEACTIVESTORE: "store/deactive/:id",

	//STAFF
	LISTSTAFF: 'staff/list',
	CREATESTAFF: 'staff/create',
	GETSTORELISTDROP: 'store/storedropdown',
	IMPORTSTAFF: 'staff/importstafffromexcel',
	EXPORTSTAFF: 'staff/exportstafftoexcel',
	EXPORTHEADERSTAFF: 'staff/exportisheader',
	GETBYIDSTAFF: 'staff/get/:id',
	DELETESTAFF: 'staff/delete/:id',
	UPDATESTAFF: "staff/update",
	ACTIVESTAFF: "staff/staffactive/:id",
	DEACTIVESTAFF: "staff/staffdeactive/:id",

	//Campaign
	LISTCAMPAIGN: 'campaign/list',
	ARCHIVELISTCAMPAIGN: 'campaign/archive/list',
	LISTCAMPAIGNDASHBOARD: 'campaign/list/dashboard',
	LISTCAMPAIGNQUEUE: 'campaign/list/dashboard/queue',
	LISTCAMPAIGNEXECUTED: 'campaign/list/dashboard/executed',
	CREATECAMPAIGN: 'campaign/create',
	CAMPAIGNDELETE:'campaign/delete/:id',
	CAMPAIGNACTIVE:'campaign/active/:id',
	CAMPAIGNDEACTIVE:'campaign/deactive/:id',

	// Whatsapp chat
	CHATSEND:"whatsappchat/send",
	CHATLIST:"whatsappchat/list",
	CONTACTSIDELIST:"whatsappchat/sidelist",
	CONTACTUNREADSIDELIST:"whatsappchat/sidelistunread",
	SIDELISTWAPPCOUNT:"whatsappchat/sidelistunreadcount",
	CHATCLEAR:"whatsappchat/clearchathistory",

	//Bot Replies 
	BOTREPLYLIST:"botreply/list",
	BOTACTIVESTATUS:"botreply/active/:id",
	BOTDEACTIVESTATUS:"botreply/deactive/:id",
	BOTDELETE:"botreply/delete/:id",
	BOTGET:"botreply/get/:id",
	CHATBOTCREATE:'botreply/create',
	CHATBOTEDIT:'botreply/update',
	CHATBOTDUPLICATE:'botreply/duplicatebotreply',
	CHATBOTIMAGEUPLOAD:'botreply/mediaupload',
	BOTTRIGGERDROP:'botreply/triggerdropdown',
	
	//Bot Flow
	BOTFLOWCREATE:"botflow/create",
	BOTFLOWDUPLICATE:"botflow/duplicatebotflow",
	BOTFLOWLIST:"botflow/list",
	BOTFLOWGET:"botflow/get/:id",
	BOTFLOWUPDTAE:"botflow/update",
	BOTFLOWDELETE:"botflow/delete/:id",
	BOTFLOWACTIVE:"botflow/active/:id",
	BOTFLOWDEACTIVE:"botflow/deactive/:id",

	// Whatsapp
	CREATEWHATSAPPTEMPLATE: 'whatsapp_template/create',
	LANGUAGECODEDROP: 'whatsapp_template/getLanguageCodes',
	GETDROPDOWNWHATSAPPTEMPLATE: 'whatsapp_template/templatedropdown',
	LISTWHATSAPPTEMPLATE: 'whatsapp_template/list',
	SYNCWHATSAPPTEMPLATE: 'whatsapp_template/sync',
	WHATSAPPIMGUPLOAD: 'whatsapp_template/uploadMedia',
	GETWHATSAPPTEMPLATE: 'whatsapp_template/get/:id',
	WHATSAPPTEMPLATEDELETE: 'whatsapp_template/delete/:id/:tempname',
	WHATSAPPTEMPLATE_MSG_SEND: 'whatsapp_template/sendMessage',
	WHATSCAMPAIGNDASHEXECUTEEXPO:'campaign/exporttoexcel/executed/:id',
	WHATSCAMPAIGNDASHQUEUEEXPO:'campaign/exporttoexcel/queue/:id',

	//Sms setup
	SMSSETUPCREATE:"sms/setupsms",
	SMSSETUPCONFIG:"sms/get/configsms",
	SMSTESTCONTACT:"sms/add/testContact",

	//Sms Campaign
	SMSCAMPAIGNLIST:'smsCampaign/list',
	SMSCAMPAIGNDASHLIST:'smsCampaign/list/dashboard',
	SMSCAMPAIGNDASHEXECUTED:'smsCampaign/list/dashboard/executed',
	SMSCAMPAIGNDASHQUEUE:'smsCampaign/list/dashboard/queue',
	SMSCAMPAIGNARCHIVELIST:'smsCampaign/archive/list',
	SMSCAMPAIGNCREATE:'smsCampaign/create',
	SMSCAMPAIGNTEMPDROP:'sms_template/id_dropdown',
	SMSCAMPAIGNSENDERDROP:'sms_template/sender_id_dropdown',
	SMSCAMPAIGNDELETE:'smsCampaign/delete/:id',
	SMSCAMPAIGNACTIVE:'smsCampaign/active/:id',
	SMSCAMPAIGNDEACTIVE:'smsCampaign/deactive/:id',
	SMSCAMPAIGNREPORTLIST:'smsCampaign/report',
	SMSCAMPAIGNEXPORT:'smsCampaign/exceldownload',
	SMSCAMPAIGNDASHEXECUTEEXPO:'smsCampaign/exporttoexcel/executed/:id',
	SMSCAMPAIGNDASHQUEUEEXPO:'smsCampaign/exporttoexcel/queue/:id',

	//Sms Tempalte
	SMSTEMPLATECREATE:'sms_template/create',
	SMSTEMPLATEUPDATE:'sms_template/update',
	SMSTEMPLATELIST:'sms_template/list',
	SMSTEMPLATEACTIVE:'sms_template/active/:id',
	SMSTEMPLATEDEACTIVE:'sms_template/deactive/:id',
	SMSTEMPLATEDELETE:'sms_template/delete/:id',
	SMSTEMPLATEGET:'sms_template/get/:id',

	//Whatsapp Subcription
	WHATSAPPSUBSCRIPTION:"waba/webhook/subscribe",
	WHATSAPPINTEGRATIONSET:"waba/businessInfo/phoneNumbers",
	WHATSAPPHEALTHY:"waba/businessInfo/healthStatus",
	WHATSAPPSETUPLIST:"waba/get/phoneNumbers",
	WHATSAPPWEBHOOKLIST:"waba/get/configStatus",
	WHATSAPPHEALTHLIST:"waba/get/healthStatus",
	WHATSAPPWEBHOOKUNSUB:"waba/webhook/unsubscribe",
	WHATSAPPTOKENINFO:"waba/get/tokenInfo",
	WHATSAPPBUSSINESSINFO:"waba/get/businessProfile",
	WHATSAPPBUSSINESSPROFILE:"waba/update/businessProfile",
	WHATSAPPINDUSTRYDROP:"waba/get/industryList",
	WHATSAPPTESTCONTACT:"waba/add/testContact",

	//Send Message 
	SENDMSG: 'contactgroup/payloadStructure',
	CAMPAIGNVARIABLEDROP: 'common/variabledropdown',
	
	//Vendor
	VENDORSIGNIN: 'superadmin/vendorlogin',
	VENDORLIST: 'superadmin/vendor/list',
	VENDORCREATE: 'superadmin/vendor/create',
	VENDOREDIT: 'superadmin/vendor/update',
	VENDORGET: 'superadmin/vendor/get/:id',
	VENDORDELETE: 'superadmin/vendor/delete/:id',
	VENDORACTIVE: 'superadmin/vendor/useractive/:id',
	VENDORDEACTIVE: 'superadmin/vendor/userdeactive/:id',

	//Contact
	CONTACTCREATE: 'contact/create',
	CONTACTLIST: 'contact/list',
	CONTACTDELETE: 'contact/delete/:id',
	CONTACTBULKDELETE: 'contact/contactselectdelete',
	CONTACTDELETEALL: 'contact/alldelete',
	CONTACTTGET: 'contact/get/:id',
	CONTACTEDIT: 'contact/update',
	CONTACTSTOREDROP: 'store/storedropdown',
	CONTACTGROUPDROP: 'contactgroup/groupdropdown',
	CONTACTGROUPASSIGN: 'contact/contactassigngroup',
	CONTACTIMPORT: 'contact/importContactfromexcel',
	CONTACTEXPORT: 'contact/exportcontacttoexcel',
	CONTACTEXPORTHEADER: 'contact/exportisheader',

	//Custom Contact Field
	CONTACTCUSTOMFIELDCREATE:'contact_custom_field/create',
	CONTACTCUSTOMFIELDLIST:'contact_custom_field/list',
	CONTACTCUSTOMFIELDGET:'contact_custom_field/get/:id',
	CONTACTCUSTOMFIELDUPDATE:'contact_custom_field/update',
	CONTACTCUSTOMFIELDDELETE:'contact_custom_field/delete/:id',
	CONTACTCUSTOMFIELDSTATUS:'contact_custom_field/statusChange/:id',

	//General
	GENERALVENDORGET:'superadmin/vendor/generalvendor',
    
	//Common 
	COMMONSUPERADMINDASHCOUNT: 'common/superAdmindashboardcount',
	COMMONVENDORDASHCOUNT: 'common/vendordashboardcount',
	COMMONCAMPDASHCOUNT: 'common/campaigndashboardcount',
	COMMONCOUNTRYDROP: 'common/countrydropdown',
	TIMEZONEDROP:'common/timezonedropdown',
	MYPROFILEUPDATE:'common/myprofile',
	GETMYPROFILE:'common/getmyprofile',
	CHANGEPASSWORD:'/common/changepassword',

	//Group
	CONTACTGROUPCREATE: 'contactgroup/create',
	CONTACTGROUPLIST: 'contactgroup/list',
	ARCHIVECONTACTGROUPLIST: 'contactgroup/list/archive',
	CONTACTGROUPCONTACTLIST: 'contactgroup/groupbycontact',
	CONTACTGROUPDELETE: 'contactgroup/delete/:id',
	CONTACTBULKGROUPDELETE: 'contactgroup/groupselectdelete',
	CONTACTGROUPDELETEALL: 'contactgroup/alldelete',
	CONTACTGROUPGET: 'contactgroup/get/:id',
	CONTACTGROUPEDIT: 'contactgroup/update',
	CONTACTGROUPACTIVE:'contactgroup/active/:id',
	CONTACTGROUPDEACTIVE:'contactgroup/deactive/:id',
	CONTACTGROUPBULKACTIVE:'contactgroup/activeachieve',
	CONTACTGROUPBULKDEACTIVE:'contactgroup/deactiveachieve',
	
	//Custom Campaign
	CUSTOMCAMPAIGNLIST: 'custom_campaign/list',
	CUSTOMCAMPAIGNUPDATE: 'custom_campaign/update',
	CUSTOMCAMPAIGNGET: 'custom_campaign/get/:id',
	CUSTOMCAMPAIGNSTATUS: 'custom_campaign/statusChange/:id',
	
	//Catalog
	CATALOGLIST: 'catalog/list',
	CATALOGCREATE: 'catalog/create',
	CATALOGSYNC: 'catalog/sync',
	CATALOGBUSSINESSDROP: 'catalog/business_info',
	
	//Catalog Subcription
	CATALOGLINK: 'catalog/updateLinked',
	CATALOGDELETE: 'catalog/deleteLinked',
	CATALOGLISTLINKED: 'catalog/listLinked',
	CATALOGLINKBIZID: 'catalog_waba/update/businessId',
	CATALOGBIZINFO: 'catalog_waba/get/business_info',
	CATALOGWHATSAPPSETUPLIST:"catalog_waba/get/phoneNumbers",
	CATALOGWHATSAPPWEBHOOKLIST:"catalog_waba/get/configStatus",
	CATALOGWHATSAPPHEALTHLIST:"catalog_waba/get/healthStatus",
	CATALOGWHATSAPPTOKENINFO:"catalog_waba/get/tokenInfo",
	CATALOGWHATSAPPINTEGRATIONSET:"catalog_waba/businessInfo/phoneNumbers",
	CATALOGWHATSAPPTESTCONTACT:"catalog_waba/add/testContact",
	CATALOGWHATSAPPHEALTHY:"catalog_waba/businessInfo/healthStatus",
	CATALOGWHATSAPPBUSSINESSINFO:"catalog_waba/get/businessProfile",
	CATALOGWHATSAPPINDUSTRYDROP:"catalog_waba/get/industryList",
	CATALOGWHATSAPPBUSSINESSPROFILE:"catalog_waba/update/businessProfile",
	CATALOGWHATSAPPIMGUPLOAD: 'whatsapp_template/uploadMedia',
	
	//Product 
	PRODUCTLIST: 'catalog_products/list',
	PRODUCTCREATE: 'catalog_products/create',
	PRODUCTEDIT: 'catalog_products/uploadcatalog',
	PRODUCTGET: 'catalog_products/get/:id',
	PRODUCTSYNC: 'catalog_products/sync',
	PRODUCTSTATUSCHANGE: 'catalog_products/publishstatus/:id',
	PRODUCTDELETE: 'catalog_products/delete/:id',

	//Order
	ORDERLIST: '/order/orderlist',
}

let API_EP_BOOK = {

	SADMINSIGNIN_API_EP: {
		url: endpoints.SADMINSIGNIN, method: 'POST', authorization: false
	},
	SIGNIN_API_EP: {
		url: endpoints.SIGNIN, method: 'POST', authorization: false
	},
	SIGNUP_API_EP: {
		url: endpoints.SIGNUP, method: 'POST', authorization: false
	},
	SIGNOUT_API_EP: {
		url: endpoints.SIGNOUT, method: 'GET', authorization: true
	},

	VENDOR_SIGNIN_API_EP: {
		url: endpoints.VENDORSIGNIN, method: 'POST', authorization: true
	},

	FORGOTPASSWORD_API_EP: {
		url: endpoints.FORGOTPASSWORD, method: 'POST', authorization: false
	},
	ACTIVATION_EMAIL_API_EP: {
		url: endpoints.ACTIVATION, method: 'POST', authorization: false
	},
	RESEND_ACTIVATION_EMAIL_API_EP: {
		url: endpoints.RESENTACTIVATION, method: 'POST', authorization: false
	},

	//General

	GENERAL_VENDOR_GET: {
		url: endpoints.GENERALVENDORGET, method: 'GET', authorization: true
	},
	
	//Custom Campaign

	CUSTOM_CAMPAIGN_LIST_EP: {
		url: endpoints.CUSTOMCAMPAIGNLIST, method: 'POST', authorization: true
	},
	CUSTOM_CAMPAIGN_UPDATE_EP: {
		url: endpoints.CUSTOMCAMPAIGNUPDATE, method: 'POST', authorization: true
	},
	CUSTOM_CAMPAIGN_GET_EP: {
		url: endpoints.CUSTOMCAMPAIGNGET, method: 'GET', authorization: true
	},
	CUSTOM_CAMPAIGN_STATUS_EP: {
		url: endpoints.CUSTOMCAMPAIGNSTATUS, method: 'GET', authorization: true
	},

	//Common

	COMMON_SUPERADMIN_DASHCOUNT: {
		url: endpoints.COMMONSUPERADMINDASHCOUNT, method: 'GET', authorization: true
	},
	COMMON_VENDOR_DASHCOUNT: {
		url: endpoints.COMMONVENDORDASHCOUNT, method: 'GET', authorization: true
	},
	COMMON_CAMP_DASHCOUNT: {
		url: endpoints.COMMONCAMPDASHCOUNT, method: 'POST', authorization: true
	},
	COMMON_COUNTRYDROP_API_EP: {
		url: endpoints.COMMONCOUNTRYDROP, method: 'GET', authorization: true
	},
	COMMON_TIMEZONEDROP_API_EP: {
		url: endpoints.TIMEZONEDROP, method: 'GET', authorization: true
	},
	COMMON_GETMYPROFILE_API_EP: {
		url: endpoints.GETMYPROFILE, method: 'GET', authorization: true
	},
	COMMON_CHANGE_PASSWORD_API_EP: {
		url: endpoints.CHANGEPASSWORD, method: 'POST', authorization: true
	},
	COMMON_MYPROFILEUPDATE_API_EP: {
		url: endpoints.MYPROFILEUPDATE, method: 'POST', authorization: true
	},

	//User

	RESETPASSWORD_API_EP: {
		url: endpoints.RESETPASSWORD, method: 'POST', authorization: true
	},
	UPDATE_USER_API_EP: {
		url: endpoints.UPDATEUSER, method: 'PUT', authorization: true
	},
	GET_USER_BY_ID_API_EP: {
		url: endpoints.USERBYID, method: 'POST', authorization: true
	},
	GET_USER_ME_API_EP: {
		url: endpoints.USERME, method: 'POST', authorization: true
	},
	USER_LOGOUT_API_EP: {
		url: endpoints.LOGOUT, method: 'GET', authorization: true
	},

	// Vendor

	SUPER_ADMIN_VENDOR_LIST: {
		url: endpoints.VENDORLIST, method: 'POST', authorization: true
	},
	SUPER_ADMIN_VENDOR_CREATE: {
		url: endpoints.VENDORCREATE, method: 'POST', authorization: true
	},
	SUPER_ADMIN_VENDOR_EDIT: {
		url: endpoints.VENDOREDIT, method: 'POST', authorization: true
	},
	SUPER_ADMIN_VENDOR_GET: {
		url: endpoints.VENDORGET, method: 'GET', authorization: true
	},
	SUPER_ADMIN_VENDOR_DELETE: {
		url: endpoints.VENDORDELETE, method: 'DELETE', authorization: true
	},
	SUPER_ADMIN_VENDOR_ACTIVE: {
		url: endpoints.VENDORACTIVE, method: 'GET', authorization: true
	},
	SUPER_ADMIN_VENDOR_DEACTIVE: {
		url: endpoints.VENDORDEACTIVE, method: 'GET', authorization: true
	},

	// Contact Api

	ADMIN_CONTACT_LIST: {
		url: endpoints.CONTACTLIST, method: 'POST', authorization: true
	},
	ADMIN_CONTACT_CREATE: {
		url: endpoints.CONTACTCREATE, method: 'POST', authorization: true
	},
	ADMIN_CONTACT_EDIT: {
		url: endpoints.CONTACTEDIT, method: 'PUT', authorization: true
	},
	ADMIN_CONTACT_GET: {
		url: endpoints.CONTACTTGET, method: 'GET', authorization: true
	},
	ADMIN_CONTACT_DELETE_ALL: {
		url: endpoints.CONTACTDELETEALL, method: 'GET', authorization: true
	},
	ADMIN_IMPORT_CONTACT_API_EP: {
		url: endpoints.CONTACTIMPORT, method: 'POST', authorization: true
	},
	ADMIN_EXPORT_CONTACT_API_EP: {
		url: endpoints.CONTACTEXPORT, method: 'GET', authorization: true
	},
	ADMIN_EXPORT_CONTACT_HEADER_API_EP: {
		url: endpoints.CONTACTEXPORTHEADER, method: 'GET', authorization: true
	},
	ADMIN_CONTACT_DELETE: {
		url: endpoints.CONTACTDELETE, method: 'DELETE', authorization: true
	},
	ADMIN_BULK_CONTACT_DELETE_API_EP: {
		url: endpoints.CONTACTBULKDELETE, method: 'POST', authorization: true
	},
	ADMIN_BULK_CONTACT_GROUP_ASSIGN_API_EP: {
		url: endpoints.CONTACTGROUPASSIGN, method: 'POST', authorization: true
	},
	ADMIN_CONTACT_STORE_DROPDOWN: {
		url: endpoints.CONTACTSTOREDROP, method: 'GET', authorization: true
	},
	ADMIN_CONTACT_GROUP_DROPDOWN: {
		url: endpoints.CONTACTGROUPDROP, method: 'GET', authorization: true
	},
	//Custom Field Contact Api

	CONTACT_CUSTOM_FIELD_LIST: {
		url: endpoints.CONTACTCUSTOMFIELDLIST, method: 'POST', authorization: true
	},
	CONTACT_CUSTOM_FIELD_CREATE: {
		url: endpoints.CONTACTCUSTOMFIELDCREATE, method: 'POST', authorization: true
	},
	CONTACT_CUSTOM_FIELD_GET: {
		url: endpoints.CONTACTCUSTOMFIELDGET, method: 'GET', authorization: true
	},
	CONTACT_CUSTOM_FIELD_UPDATE: {
		url: endpoints.CONTACTCUSTOMFIELDUPDATE, method: 'PUT', authorization: true
	},
	CONTACT_CUSTOM_FIELD_STATUS: {
		url: endpoints.CONTACTCUSTOMFIELDSTATUS, method: 'GET', authorization: true
	},
	CONTACT_CUSTOM_FIELD_DELETE: {
		url: endpoints.CONTACTCUSTOMFIELDDELETE, method: 'DELETE', authorization: true
	},

	//Group
	CONTACT_GROUP_LIST: {
		url: endpoints.CONTACTGROUPLIST, method: 'POST', authorization: true
	},
	ARCHIVE_CONTACT_GROUP_LIST: {
		url: endpoints.ARCHIVECONTACTGROUPLIST, method: 'POST', authorization: true
	},
	CONTACT_GROUP_CONTACT_LIST: {
		url: endpoints.CONTACTGROUPCONTACTLIST, method: 'POST', authorization: true
	},
	CONTACT_GROUP_CREATE: {
		url: endpoints.CONTACTGROUPCREATE, method: 'POST', authorization: true
	},
	CONTACT_GROUP_EDIT: {
		url: endpoints.CONTACTGROUPEDIT, method: 'PUT', authorization: true
	},
	CONTACT_GROUP_GET: {
		url: endpoints.CONTACTGROUPGET, method: 'GET', authorization: true
	},
	CONTACT_GROUP_DELETEALL: {
		url: endpoints.CONTACTGROUPDELETEALL, method: 'GET', authorization: true
	},
	CONTACT_GROUP_DELETE: {
		url: endpoints.CONTACTGROUPDELETE, method: 'DELETE', authorization: true
	},
	CONTACT_GROUP_CONTACT_BULK_DELETE: {
		url: endpoints.CONTACTBULKGROUPDELETE, method: 'POST', authorization: true
	},
	CONTACT_GROUP_CONTACT_BULK_ARCHIVE: {
		url: endpoints.CONTACTGROUPBULKACTIVE, method: 'POST', authorization: true
	},
	CONTACT_GROUP_CONTACT_BULK_UNARCHIVE: {
		url: endpoints.CONTACTGROUPBULKDEACTIVE, method: 'POST', authorization: true
	},
	CONTACT_GROUP_ACTIVE: {
		url: endpoints.CONTACTGROUPACTIVE, method: 'GET', authorization: true
	},
	CONTACT_GROUP_DEACTIVE: {
		url: endpoints.CONTACTGROUPDEACTIVE, method: 'GET', authorization: true
	},

	//Master
	GET_METADATA_API_EP: {
		url: endpoints.METADATA + '/Rules_Creation', method: 'GET', authorization: true
	},

	//Campaign
	LIST_CAMPAIGN: {
		url: endpoints.LISTCAMPAIGN, method: 'POST', authorization: true
	},
	ARCHIVE_LIST_CAMPAIGN: {
		url: endpoints.ARCHIVELISTCAMPAIGN, method: 'POST', authorization: true
	},
	LIST_CAMPAIGN_DASHBOARD: {
		url: endpoints.LISTCAMPAIGNDASHBOARD, method: 'POST', authorization: true
	},
	LIST_CAMPAIGN_QUEUE: {
		url: endpoints.LISTCAMPAIGNQUEUE, method: 'POST', authorization: true
	},
	LIST_CAMPAIGN_EXECUTED: {
		url: endpoints.LISTCAMPAIGNEXECUTED, method: 'POST', authorization: true
	},
	CREATE_CAMPAIGN: {
		url: endpoints.CREATECAMPAIGN, method: 'POST', authorization: true
	},
	CAMPAIGN_VARIABLE_DROP: {
		url: endpoints.CAMPAIGNVARIABLEDROP, method: 'GET', authorization: true
	},
	CAMPAIGN_DELETE: {
		url: endpoints.CAMPAIGNDELETE, method: 'DELETE', authorization: true
	},
	CAMPAIGN_ARCHIVE_ACTIVE: {
		url: endpoints.CAMPAIGNACTIVE, method: 'GET', authorization: true
	},
	CAMPAIGN_ARCHIVE_DEACTIVE: {
		url: endpoints.CAMPAIGNDEACTIVE, method: 'GET', authorization: true
	},

	// Whatsapp chat

	WHATSAPP_CHATSEND: {
		url: endpoints.CHATSEND, method: 'POST', authorization: true
	},
	WHATSAPP_CHATLIST: {
		url: endpoints.CHATLIST, method: 'POST', authorization: true
	},
	WHATSAPP_CHATCLEAR: {
		url: endpoints.CHATCLEAR, method: 'POST', authorization: true
	},
	WHATSAPP_CONTACTSIDELIST: {
		url: endpoints.CONTACTSIDELIST, method: 'POST', authorization: true
	},
	WHATSAPP_CONTACTUNREADSIDELIST: {
		url: endpoints.CONTACTUNREADSIDELIST, method: 'POST', authorization: true
	},
	SIDE_LIST_WAPPCOUNT: {
		url: endpoints.SIDELISTWAPPCOUNT, method: 'GET', authorization: true
	},
	//Bot Replies
	BOT_REPLY_LIST: {
		url: endpoints.BOTREPLYLIST, method: 'POST', authorization: true
	},
	BOT_TRIGGER_DROP: {
		url: endpoints.BOTTRIGGERDROP, method: 'GET', authorization: true
	},
	BOT_ACTIVE_STATUS: {
		url: endpoints.BOTACTIVESTATUS, method: 'GET', authorization: true
	},
	BOT_DEACTIVE_STATUS: {
		url: endpoints.BOTDEACTIVESTATUS, method: 'GET', authorization: true
	},
	BOT_GET: {
		url: endpoints.BOTGET, method: 'GET', authorization: true
	},
	BOT_DELETE: {
		url: endpoints.BOTDELETE, method: 'DELETE', authorization: true
	},
	CHAT_BOT_CREATE :{
		url:endpoints.CHATBOTCREATE,method:'POST',authorization:true 
	},
	CHAT_BOT_EDIT :{
		url:endpoints.CHATBOTEDIT,method:'PUT',authorization:true 
	},
	CHAT_BOT_DUPLICATE :{
		url:endpoints.CHATBOTDUPLICATE,method:'POST',authorization:true 
	},
	CHAT_BOT_IMAGE_UPLOAD :{
		url:endpoints.CHATBOTIMAGEUPLOAD,method:'POST',authorization:true 
	},


	//Bot Flow
	BOT_FLOW_CREATE: {
		url: endpoints.BOTFLOWCREATE, method: 'POST', authorization: true
	},
	BOT_FLOW_DUPLICATE: {
		url: endpoints.BOTFLOWDUPLICATE, method: 'POST', authorization: true
	},
	BOT_FLOW_LIST: {
		url: endpoints.BOTFLOWLIST, method: 'POST', authorization: true
	},
	BOT_FLOW_GET: {
		url: endpoints.BOTFLOWGET, method: 'GET', authorization: true
	},
	BOT_FLOW_UPDTAE: {
		url: endpoints.BOTFLOWUPDTAE, method: 'PUT', authorization: true
	},
	BOT_FLOW_DELETE: {
		url: endpoints.BOTFLOWDELETE, method: 'DELETE', authorization: true
	},
	BOT_FLOW_ACTIVE: {
		url: endpoints.BOTFLOWACTIVE, method: 'GET', authorization: true
	},
	BOT_FLOW_DEACTIVE: {
		url: endpoints.BOTFLOWDEACTIVE, method: 'GET', authorization: true
	},

		
	// Whatsapp Subscription
	WHATSAPP_SUBSCRIPTION: {
		url: endpoints.WHATSAPPSUBSCRIPTION, method: 'POST', authorization: true
	},
	WHATSAPP_INTEGRATIONSET: {
		url: endpoints.WHATSAPPINTEGRATIONSET, method: 'POST', authorization: true
	},
	WHATSAPP_HEALTHY: {
		url: endpoints.WHATSAPPHEALTHY, method: 'POST', authorization: true
	},
	WHATSAPP_SETUP_LIST: {
		url: endpoints.WHATSAPPSETUPLIST, method: 'GET', authorization: true
	},
	WHATSAPP_WEBHOOK_LIST: {
		url: endpoints.WHATSAPPWEBHOOKLIST, method: 'GET', authorization: true
	},
	WHATSAPP_HEALTH_LIST: {
		url: endpoints.WHATSAPPHEALTHLIST, method: 'GET', authorization: true
	},
	WHATSAPP_TOKEN_INFO: {
		url: endpoints.WHATSAPPTOKENINFO, method: 'GET', authorization: true
	},
	WHATSAPP_BUSSINESS_INFO: {
		url: endpoints.WHATSAPPBUSSINESSINFO, method: 'GET', authorization: true
	},
	WHATSAPP_BUSSINESS_PROFILE_UPDATE: {
		url: endpoints.WHATSAPPBUSSINESSPROFILE, method: 'POST', authorization: true
	},
	WHATSAPP_WEBHOOK_UNSUB: {
		url: endpoints.WHATSAPPWEBHOOKUNSUB, method: 'DELETE', authorization: true
	},
	WHATSAPP_INDUSTRY_DROP: {
		url: endpoints.WHATSAPPINDUSTRYDROP, method: 'GET', authorization: true
	},
	WHATSAPP_TEST_CONTACT: {
		url: endpoints.WHATSAPPTESTCONTACT, method: 'POST', authorization: true
	},

	// Sms Setup

	SMS_SETUP_CONFIG: {
		url: endpoints.SMSSETUPCONFIG, method: 'GET', authorization: true
	},
	SMS_SETUP_CREATE: {
		url: endpoints.SMSSETUPCREATE, method: 'POST', authorization: true
	},
	SMS_TEST_CONTACT: {
		url: endpoints.SMSTESTCONTACT, method: 'POST', authorization: true
	},

	// Sms Campaign

	SMS_CAMPAIGN_EXPORT: {
		url: endpoints.SMSCAMPAIGNEXPORT, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_DASH_EXECUTE_EXPO: {
		url: endpoints.SMSCAMPAIGNDASHEXECUTEEXPO, method: 'GET', authorization: true
	},
	SMS_CAMPAIGN_DASH_QUEUE_EXPO: {
		url: endpoints.SMSCAMPAIGNDASHQUEUEEXPO, method: 'GET', authorization: true
	},
	SMS_CAMPAIGN_REPORT_LIST: {
		url: endpoints.SMSCAMPAIGNREPORTLIST, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_DASH_LIST: {
		url: endpoints.SMSCAMPAIGNDASHLIST, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_DASH_QUEUE: {
		url: endpoints.SMSCAMPAIGNDASHQUEUE, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_DASH_EXECUTED: {
		url: endpoints.SMSCAMPAIGNDASHEXECUTED, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_LIST: {
		url: endpoints.SMSCAMPAIGNLIST, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_ARCHIVE_LIST: {
		url: endpoints.SMSCAMPAIGNARCHIVELIST, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_CREATE: {
		url: endpoints.SMSCAMPAIGNCREATE, method: 'POST', authorization: true
	},
	SMS_CAMPAIGN_SENDER_DROP: {
		url: endpoints.SMSCAMPAIGNSENDERDROP, method: 'GET', authorization: true
	},
	SMS_CAMPAIGN_TEMP_DROP: {
		url: endpoints.SMSCAMPAIGNTEMPDROP, method: 'GET', authorization: true
	},
	SMS_CAMPAIGN_ACTIVE: {
		url: endpoints.SMSCAMPAIGNACTIVE, method: 'GET', authorization: true
	},
	SMS_CAMPAIGN_DEACTIVE: {
		url: endpoints.SMSCAMPAIGNDEACTIVE, method: 'GET', authorization: true
	},
	SMS_CAMPAIGN_DELETE: {
		url: endpoints.SMSCAMPAIGNDELETE, method: 'DELETE', authorization: true
	},

	// Sms Tempalte

	SMS_TEMPLATE_CREATE: {
		url: endpoints.SMSTEMPLATECREATE, method: 'POST', authorization: true
	},
	SMS_TEMPLATE_UPDATE: {
		url: endpoints.SMSTEMPLATEUPDATE, method: 'PUT', authorization: true
	},
	SMS_TEMPLATE_LIST: {
		url: endpoints.SMSTEMPLATELIST, method: 'POST', authorization: true
	},
	SMS_TEMPLATE_GET: {
		url: endpoints.SMSTEMPLATEGET, method: 'GET', authorization: true
	},
	SMS_TEMPLATE_ACTIVE: {
		url: endpoints.SMSTEMPLATEACTIVE, method: 'GET', authorization: true
	},
	SMS_TEMPLATE_DEACTIVE: {
		url: endpoints.SMSTEMPLATEDEACTIVE, method: 'GET', authorization: true
	},
	SMS_TEMPLATE_DELETE: {
		url: endpoints.SMSTEMPLATEDELETE, method: 'DELETE', authorization: true
	},

	// Whatsapp

	ADMIN_WHATSAPP_CREATE_TEMPLATE: {
		url: endpoints.CREATEWHATSAPPTEMPLATE, method: 'POST', authorization: true
	},
	WHATSAPP_SENDMSG_TEMPLATE: {
		url: endpoints.SENDMSG, method: 'POST', authorization: true
	},
	WHATSAPPTEMPLATE_MSG_SEND: {
		url: endpoints.WHATSAPPTEMPLATE_MSG_SEND, method: 'POST', authorization: true
	},
	WHATS_CAMPAIGN_DASH_QUEUE_EXPO: {
		url: endpoints.WHATSCAMPAIGNDASHQUEUEEXPO, method: 'GET', authorization: true
	},
	WHATS_CAMPAIGN_DASH_EXECUTE_EXPO: {
		url: endpoints.WHATSCAMPAIGNDASHEXECUTEEXPO, method: 'GET', authorization: true
	},
	ADMIN_SYNC_WHATSAPP_TEMPLATE: {
		url: endpoints.SYNCWHATSAPPTEMPLATE, method: 'POST', authorization: true
	},
	ADMIN_WHATSAPP_LIST_TEMPLATE: {
		url: endpoints.LISTWHATSAPPTEMPLATE, method: 'POST', authorization: true
	},
	ADMIN_IMG_UPLOAD_API_EP: {
		url: endpoints.WHATSAPPIMGUPLOAD, method: 'POST', authorization: true
	},
	ADMIN_WHATSAPP_GET: {
		url: endpoints.GETWHATSAPPTEMPLATE, method: 'GET', authorization: true
	},
	WHATSAPP_DELETE: {
		url: endpoints.WHATSAPPTEMPLATEDELETE, method: 'DELETE', authorization: true
	},
	TEMPALTE_WHATSAPPDROP_API_EP: {
		url: endpoints.GETDROPDOWNWHATSAPPTEMPLATE, method: 'GET', authorization: true
	},
	LANGUAGECODE_WHATSAPPDROP_API_EP: {
		url: endpoints.LANGUAGECODEDROP, method: 'GET', authorization: true
	},

	//Store
	LIST_STORE_API_EP: {
		url: endpoints.LISTSTORE, method: 'POST', authorization: true
	},
	IMPORT_STORE_API_EP: {
		url: endpoints.IMPORTSTORE, method: 'POST', authorization: true
	},
	EXPORT_STORE_API_EP: {
		url: endpoints.EXPORTSTORE, method: 'GET', authorization: true
	},
	EXPORT_HEADER_STORE_API_EP: {
		url: endpoints.EXPORTHEADERSTORE, method: 'GET', authorization: true
	},
	CREATE_STORE_API_EP: {
		url: endpoints.CREATESTORE, method: 'POST', authorization: true
	},
	GET_STORE_BY_ID_API_EP: {
		url: endpoints.GETBYIDSTORE, method: 'GET', authorization: true
	},
	ACTIVE_STORE_API_EP: {
		url: endpoints.ACTIVESTORE, method: 'GET', authorization: true
	},
	DEACTIVE_STORE_API_EP: {
		url: endpoints.DEACTIVESTORE, method: 'GET', authorization: true
	},
	UPDATE_STORE_API_EP: {
		url: endpoints.UPDATESTORE, method: 'PUT', authorization: true
	},
	DELETE_STORE_API_EP: {
		url: endpoints.DELETESTORE, method: 'DELETE', authorization: true
	},

	//Staff
	LIST_STAFF_API_EP: {
		url: endpoints.LISTSTAFF, method: 'POST', authorization: true
	},
	LIST_STOREDROP_API_EP: {
		url: endpoints.GETSTORELISTDROP, method: 'GET', authorization: true
	},
	IMPORT_STAFF_API_EP: {
		url: endpoints.IMPORTSTAFF, method: 'POST', authorization: true
	},
	EXPORT_STAFF_API_EP: {
		url: endpoints.EXPORTSTAFF, method: 'GET', authorization: true
	},
	EXPORT_HEADER_STAFF_API_EP: {
		url: endpoints.EXPORTHEADERSTAFF, method: 'GET', authorization: true
	},
	CREATE_STAFF_API_EP: {
		url: endpoints.CREATESTAFF, method: 'POST', authorization: true
	},
	GET_STAFF_BY_ID_API_EP: {
		url: endpoints.GETBYIDSTAFF, method: 'GET', authorization: true
	},
	ACTIVE_STAFF_API_EP: {
		url: endpoints.ACTIVESTAFF, method: 'GET', authorization: true
	},
	DEACTIVE_STAFF_API_EP: {
		url: endpoints.DEACTIVESTAFF, method: 'GET', authorization: true
	},
	UPDATE_STAFF_API_EP: {
		url: endpoints.UPDATESTAFF, method: 'PUT', authorization: true
	},
	DELETE_STAFF_API_EP: {
		url: endpoints.DELETESTAFF, method: 'DELETE', authorization: true
	},

	//Catalog
	LIST_CATALOG_API_EP: {
		url: endpoints.CATALOGLIST, method: 'POST', authorization: true
	},
	CREATE_CATALOG_API_EP: {
		url: endpoints.CATALOGCREATE, method: 'POST', authorization: true
	},
	CATALOG_SYNC_API_EP: {
		url: endpoints.CATALOGSYNC, method: 'POST', authorization: true
	},
	CATALOG_BUSSINESS_DROP_API_EP: {
		url: endpoints.CATALOGBUSSINESSDROP, method: 'GET', authorization: true
	},
	CATALOG_LIST_LINKED_API_EP: {
		url: endpoints.CATALOGLISTLINKED, method: 'GET', authorization: true
	},
	CATALOG_LINK_BIZID_API_EP: {
		url: endpoints.CATALOGLINKBIZID, method: 'POST', authorization: true
	},
	CATALOG_BIZ_INFO_API_EP: {
		url: endpoints.CATALOGBIZINFO, method: 'GET', authorization: true
	},
	CATALOG_LINK_API_EP: {
		url: endpoints.CATALOGLINK, method: 'POST', authorization: true
	},
	CATALOG_DELETE_API_EP: {
		url: endpoints.CATALOGDELETE, method: 'POST', authorization: true
	},
	CATALOG_WHATSAPP_SETUP_LIST: {
		url: endpoints.CATALOGWHATSAPPSETUPLIST, method: 'GET', authorization: true
	},
	CATALOG_WHATSAPP_WEBHOOK_LIST: {
		url: endpoints.CATALOGWHATSAPPWEBHOOKLIST, method: 'GET', authorization: true
	},
	CATALOG_WHATSAPP_HEALTH_LIST: {
		url: endpoints.CATALOGWHATSAPPHEALTHLIST, method: 'GET', authorization: true
	},
	CATALOG_WHATSAPP_TOKEN_INFO: {
		url: endpoints.CATALOGWHATSAPPTOKENINFO, method: 'GET', authorization: true
	},
	CATALOG_WHATSAPP_INTEGRATIONSET: {
		url: endpoints.CATALOGWHATSAPPINTEGRATIONSET, method: 'POST', authorization: true
	},
	CATALOG_WHATSAPP_TEST_CONTACT: {
		url: endpoints.CATALOGWHATSAPPTESTCONTACT, method: 'POST', authorization: true
	},
	CATALOG_WHATSAPP_HEALTHY: {
		url: endpoints.CATALOGWHATSAPPHEALTHY, method: 'POST', authorization: true
	},
	CATALOG_WHATSAPP_BUSSINESS_INFO: {
		url: endpoints.CATALOGWHATSAPPBUSSINESSINFO, method: 'GET', authorization: true
	},
	CATALOG_WHATSAPP_INDUSTRY_DROP: {
		url: endpoints.CATALOGWHATSAPPINDUSTRYDROP, method: 'GET', authorization: true
	},
	CATALOG_WHATSAPP_BUSSINESS_PROFILE_UPDATE: {
		url: endpoints.CATALOGWHATSAPPBUSSINESSPROFILE, method: 'POST', authorization: true
	},
	CATALOG_ADMIN_IMG_UPLOAD_API_EP: {
		url: endpoints.CATALOGWHATSAPPIMGUPLOAD, method: 'POST', authorization: true
	},
	//Catalog Product
	PRODUCT_CREATE_API_EP: {
		url: endpoints.PRODUCTCREATE, method: 'POST', authorization: true
	},
	PRODUCT_EDIT_API_EP: {
		url: endpoints.PRODUCTEDIT, method: 'POST', authorization: true
	},
	PRODUCT_GET_API_EP: {
		url: endpoints.PRODUCTGET, method: 'GET', authorization: true
	},
	PRODUCT_DELETE_API_EP: {
		url: endpoints.PRODUCTDELETE, method: 'DELETE', authorization: true
	},
	PRODUCT_STATUS_CHANGE_API_EP: {
		url: endpoints.PRODUCTSTATUSCHANGE, method: 'GET', authorization: true
	},
	PRODUCT_SYNC_API_EP: {
		url: endpoints.PRODUCTSYNC, method: 'POST', authorization: true
	},
	PRODUCT_LIST_API_EP: {
		url: endpoints.PRODUCTLIST, method: 'POST', authorization: true
	},

	//Order
    ORDER_LIST_API_EP: {
        url: endpoints.ORDERLIST, method: 'POST', authorization: true
    },
	//Rules
	GET_RULES_METADATA_API_EP: {
		url: endpoints.METADATA + '/Rules_Creation', method: 'GET', authorization: true
	}
}

export default API_EP_BOOK;