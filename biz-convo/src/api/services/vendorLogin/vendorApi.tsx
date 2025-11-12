import API_EP_BOOK from "../../endpoints";
import API from "../../api";

//Store Api
const listStoreAPIEP = API_EP_BOOK.LIST_STORE_API_EP;
const getStoreByIdAPIEP = API_EP_BOOK.GET_STORE_BY_ID_API_EP;
const storeActiveAPIEP = API_EP_BOOK.ACTIVE_STORE_API_EP;
const storeDeactiveAPIEP = API_EP_BOOK.DEACTIVE_STORE_API_EP;
const deleteStoreAPIEP = API_EP_BOOK.DELETE_STORE_API_EP;
const updateStoreByAPIEP = API_EP_BOOK.UPDATE_STORE_API_EP;
const createStore = API_EP_BOOK.CREATE_STORE_API_EP;
const importStore = API_EP_BOOK.IMPORT_STORE_API_EP;
const exportStore = API_EP_BOOK.EXPORT_STORE_API_EP;
const exportHeaderStore = API_EP_BOOK.EXPORT_HEADER_STORE_API_EP;

//Staff Api
const listStaffAPIEP = API_EP_BOOK.LIST_STAFF_API_EP;
const getStaffByIdAPIEP = API_EP_BOOK.GET_STAFF_BY_ID_API_EP;
const staffActiveAPIEP = API_EP_BOOK.ACTIVE_STAFF_API_EP;
const staffDeactiveAPIEP = API_EP_BOOK.DEACTIVE_STAFF_API_EP;
const getStoreDropAPIEP = API_EP_BOOK.LIST_STOREDROP_API_EP;
const deleteStaffAPIEP = API_EP_BOOK.DELETE_STAFF_API_EP;
const updateStaffByAPIEP = API_EP_BOOK.UPDATE_STAFF_API_EP;
const createStaff = API_EP_BOOK.CREATE_STAFF_API_EP;
const importStaff = API_EP_BOOK.IMPORT_STAFF_API_EP;
const exportStaff = API_EP_BOOK.EXPORT_STAFF_API_EP;
const exportHeaderStaff = API_EP_BOOK.EXPORT_HEADER_STAFF_API_EP;

//Contact Api
const contactListAPI = API_EP_BOOK.ADMIN_CONTACT_LIST;
const contactCreateAPI = API_EP_BOOK.ADMIN_CONTACT_CREATE;
const contactEditAPI = API_EP_BOOK.ADMIN_CONTACT_EDIT;
const contactDeleteAPI = API_EP_BOOK.ADMIN_CONTACT_DELETE;
const contactBulkDeleteAPI = API_EP_BOOK.ADMIN_BULK_CONTACT_DELETE_API_EP;
const contactDeleteAllAPI = API_EP_BOOK.ADMIN_CONTACT_DELETE_ALL;
const contactBulkGroupAssignAPI = API_EP_BOOK.ADMIN_BULK_CONTACT_GROUP_ASSIGN_API_EP;
const contactStoreDropdwon = API_EP_BOOK.ADMIN_CONTACT_STORE_DROPDOWN;
const contactGroupDropdwon = API_EP_BOOK.ADMIN_CONTACT_GROUP_DROPDOWN;
const contactGetAPI = API_EP_BOOK.ADMIN_CONTACT_GET;
const importContact = API_EP_BOOK.ADMIN_IMPORT_CONTACT_API_EP;
const exportContact = API_EP_BOOK.ADMIN_EXPORT_CONTACT_API_EP;
const exportHeaderContact = API_EP_BOOK.ADMIN_EXPORT_CONTACT_HEADER_API_EP;

//Custom Field Contact Api
const customFieldcontactList = API_EP_BOOK.CONTACT_CUSTOM_FIELD_LIST;
const customFieldcontactCreate = API_EP_BOOK.CONTACT_CUSTOM_FIELD_CREATE;
const customFieldcontactGet = API_EP_BOOK.CONTACT_CUSTOM_FIELD_GET;
const customFieldcontactUpdate = API_EP_BOOK.CONTACT_CUSTOM_FIELD_UPDATE;
const customFieldcontactDelete = API_EP_BOOK.CONTACT_CUSTOM_FIELD_DELETE;
const customFieldcontactStatus = API_EP_BOOK.CONTACT_CUSTOM_FIELD_STATUS;

//Group Api
const contactGroupListAPI = API_EP_BOOK.CONTACT_GROUP_LIST;
const contactArchiveGroupListAPI = API_EP_BOOK.ARCHIVE_CONTACT_GROUP_LIST;
const contactGroupContactListAPI = API_EP_BOOK.CONTACT_GROUP_CONTACT_LIST;
const contactGroupCreateAPI = API_EP_BOOK.CONTACT_GROUP_CREATE;
const contactGroupEditAPI = API_EP_BOOK.CONTACT_GROUP_EDIT;
const contactGroupDeleteAllAPI = API_EP_BOOK.CONTACT_GROUP_DELETEALL;
const contactGroupDeleteAPI = API_EP_BOOK.CONTACT_GROUP_DELETE;
const contactBulkGroupDeleteAPI = API_EP_BOOK.CONTACT_GROUP_CONTACT_BULK_DELETE;
const contactGroupGetAPI = API_EP_BOOK.CONTACT_GROUP_GET;
const contactGrouparchiveActive = API_EP_BOOK.CONTACT_GROUP_ACTIVE;
const contactGrouparchiveDeactive = API_EP_BOOK.CONTACT_GROUP_DEACTIVE;
const contactGrouparchiveBulkActive = API_EP_BOOK.CONTACT_GROUP_CONTACT_BULK_ARCHIVE;
const contactGrouparchiveBulkDeactive = API_EP_BOOK.CONTACT_GROUP_CONTACT_BULK_UNARCHIVE;

// Whatsapp chat
const whatsappChatsendAPI = API_EP_BOOK.WHATSAPP_CHATSEND;
const whatsappChatListAPI = API_EP_BOOK.WHATSAPP_CHATLIST;
const whatsappChatClearAPI = API_EP_BOOK.WHATSAPP_CHATCLEAR;
const whatsappContactSideListAPI = API_EP_BOOK.WHATSAPP_CONTACTSIDELIST;
const whatsappContactUnreadSideListAPI = API_EP_BOOK.WHATSAPP_CONTACTUNREADSIDELIST;
const sideListWappAPI = API_EP_BOOK.SIDE_LIST_WAPPCOUNT;
const exportChat = API_EP_BOOK.WHATSAPP_CHATEXPORT;

// Bot Reply
const botReplyList = API_EP_BOOK.BOT_REPLY_LIST;
const chatBotCreateAPI = API_EP_BOOK.CHAT_BOT_CREATE;
const chatBotGetAPI = API_EP_BOOK.BOT_GET;
const chatBotEditAPI = API_EP_BOOK.CHAT_BOT_EDIT;
const chatBotDuplicateAPI = API_EP_BOOK.CHAT_BOT_DUPLICATE;
const chatBotImageUploadAPI = API_EP_BOOK.CHAT_BOT_IMAGE_UPLOAD;
const botactiveStatus = API_EP_BOOK.BOT_ACTIVE_STATUS;
const botdeactiveStatus = API_EP_BOOK.BOT_DEACTIVE_STATUS;
const botdelete = API_EP_BOOK.BOT_DELETE;
const botTriggerDrop = API_EP_BOOK.BOT_TRIGGER_DROP;

// Bot Flow
const botFlowList = API_EP_BOOK.BOT_FLOW_LIST;
const botFlowCreate = API_EP_BOOK.BOT_FLOW_CREATE;
const botFlowDuplicate = API_EP_BOOK.BOT_FLOW_DUPLICATE;
const botFlowGet = API_EP_BOOK.BOT_FLOW_GET;
const botFlowUpdate = API_EP_BOOK.BOT_FLOW_UPDTAE;
const botFlowDelete = API_EP_BOOK.BOT_FLOW_DELETE;
const botFlowActive = API_EP_BOOK.BOT_FLOW_ACTIVE;
const botFlowDeactive = API_EP_BOOK.BOT_FLOW_DEACTIVE;

// Whatsapp Subscription
const whatsappSubscription = API_EP_BOOK.WHATSAPP_SUBSCRIPTION;
const whatsappIntegrationSet = API_EP_BOOK.WHATSAPP_INTEGRATIONSET;
const whatsappHealthy = API_EP_BOOK.WHATSAPP_HEALTHY;
const whatsappsetupList = API_EP_BOOK.WHATSAPP_SETUP_LIST;
const whatsappwebhookList = API_EP_BOOK.WHATSAPP_WEBHOOK_LIST;
const whatsapphealthList = API_EP_BOOK.WHATSAPP_HEALTH_LIST;
const whatsappwebhookUnsub = API_EP_BOOK.WHATSAPP_WEBHOOK_UNSUB;
const whatsapptokenInfo = API_EP_BOOK.WHATSAPP_TOKEN_INFO;
const whatsappbussinessInfo = API_EP_BOOK.WHATSAPP_BUSSINESS_INFO;
const whatsappbussinessProfileUpdate = API_EP_BOOK.WHATSAPP_BUSSINESS_PROFILE_UPDATE;
const whatsappIndustryDrop = API_EP_BOOK.WHATSAPP_INDUSTRY_DROP;
const whatsapptestContact = API_EP_BOOK.WHATSAPP_TEST_CONTACT;
const whatsappaddPhoneno = API_EP_BOOK.WHATSAPP_ADD_PHONENO;

// Sms setup
const smssetupConfig = API_EP_BOOK.SMS_SETUP_CONFIG;
const smssetupCreate = API_EP_BOOK.SMS_SETUP_CREATE;
const smssetuptestContact = API_EP_BOOK.SMS_TEST_CONTACT;

// Sms template
const smscampaignExport = API_EP_BOOK.SMS_CAMPAIGN_EXPORT;
const smscampaignExecuteExport = API_EP_BOOK.SMS_CAMPAIGN_DASH_QUEUE_EXPO;
const smscampaignQueueExport = API_EP_BOOK.SMS_CAMPAIGN_DASH_EXECUTE_EXPO;
const smscampaignList = API_EP_BOOK.SMS_CAMPAIGN_LIST;
const smscampaignDashList = API_EP_BOOK.SMS_CAMPAIGN_DASH_LIST;
const smscampaignQueueList = API_EP_BOOK.SMS_CAMPAIGN_DASH_QUEUE;
const smscampaignExecuteList = API_EP_BOOK.SMS_CAMPAIGN_DASH_EXECUTED;
const smscampaignReportList = API_EP_BOOK.SMS_CAMPAIGN_REPORT_LIST;
const smscampaignArchiveList = API_EP_BOOK.SMS_CAMPAIGN_ARCHIVE_LIST;
const smscampaignCreate = API_EP_BOOK.SMS_CAMPAIGN_CREATE;
const smscampaignTempDrop = API_EP_BOOK.SMS_CAMPAIGN_TEMP_DROP;
const smscampaignSenderDrop = API_EP_BOOK.SMS_CAMPAIGN_SENDER_DROP;
const smscampaignDelete = API_EP_BOOK.SMS_CAMPAIGN_DELETE;
const smscampaignActive = API_EP_BOOK.SMS_CAMPAIGN_ACTIVE;
const smscampaignDeactive = API_EP_BOOK.SMS_CAMPAIGN_DEACTIVE;

// Sms template
const smstemplateList = API_EP_BOOK.SMS_TEMPLATE_LIST;
const smstemplateCreate = API_EP_BOOK.SMS_TEMPLATE_CREATE;
const smstemplateUpdate = API_EP_BOOK.SMS_TEMPLATE_UPDATE;
const smstemplateGet = API_EP_BOOK.SMS_TEMPLATE_GET;
const smstemplateActive = API_EP_BOOK.SMS_TEMPLATE_ACTIVE;
const smstemplateDeactive = API_EP_BOOK.SMS_TEMPLATE_DEACTIVE;
const smstemplateDelete = API_EP_BOOK.SMS_TEMPLATE_DELETE;

// Whatsapp
const whatsappCreateAPI = API_EP_BOOK.ADMIN_WHATSAPP_CREATE_TEMPLATE;
const whatsappSendmsgAPI = API_EP_BOOK.WHATSAPP_SENDMSG_TEMPLATE;
const whatsappMsgSendAPI = API_EP_BOOK.WHATSAPPTEMPLATE_MSG_SEND;
const whatsappListAPI = API_EP_BOOK.ADMIN_WHATSAPP_LIST_TEMPLATE;
const whatsappSyncAPI = API_EP_BOOK.ADMIN_SYNC_WHATSAPP_TEMPLATE;
const whatsappImgUploadAPI = API_EP_BOOK.ADMIN_IMG_UPLOAD_API_EP;
const whatsappGetAPI = API_EP_BOOK.ADMIN_WHATSAPP_GET;
const whatsappDeleteAPI = API_EP_BOOK.WHATSAPP_DELETE;
const whatsappTemplateDropdwon = API_EP_BOOK.TEMPALTE_WHATSAPPDROP_API_EP;
const languageCodeDropdown = API_EP_BOOK.LANGUAGECODE_WHATSAPPDROP_API_EP;
const whatscampaignQueueExport = API_EP_BOOK.WHATS_CAMPAIGN_DASH_QUEUE_EXPO;
const whatscampaignExecuteExport = API_EP_BOOK.WHATS_CAMPAIGN_DASH_EXECUTE_EXPO;

//Campaign
const campaignListAPI = API_EP_BOOK.LIST_CAMPAIGN;
const campaignArchiveListAPI = API_EP_BOOK.ARCHIVE_LIST_CAMPAIGN;
const campaignListDashboardAPI = API_EP_BOOK.LIST_CAMPAIGN_DASHBOARD;
const campaignListQueueAPI = API_EP_BOOK.LIST_CAMPAIGN_QUEUE;
const campaignListExecutedAPI = API_EP_BOOK.LIST_CAMPAIGN_EXECUTED;
const campaignCreateAPI = API_EP_BOOK.CREATE_CAMPAIGN;
const campaignvariableDropdwon = API_EP_BOOK.CAMPAIGN_VARIABLE_DROP;
const campaignDelete = API_EP_BOOK.CAMPAIGN_DELETE;
const campaignarchiveActive = API_EP_BOOK.CAMPAIGN_ARCHIVE_ACTIVE;
const campaignarchiveDeactive = API_EP_BOOK.CAMPAIGN_ARCHIVE_DEACTIVE;

//General
const generalVendorGet = API_EP_BOOK.GENERAL_VENDOR_GET;

//Custom Campaign
const customCampaignList = API_EP_BOOK.CUSTOM_CAMPAIGN_LIST_EP;
const customCampaignUpdate = API_EP_BOOK.CUSTOM_CAMPAIGN_UPDATE_EP;
const customCampaignGet = API_EP_BOOK.CUSTOM_CAMPAIGN_GET_EP;
const customCampaignStatus = API_EP_BOOK.CUSTOM_CAMPAIGN_STATUS_EP;

//Common
const commonSuperadminDashCount = API_EP_BOOK.COMMON_SUPERADMIN_DASHCOUNT;
const commonVendorDashCount = API_EP_BOOK.COMMON_VENDOR_DASHCOUNT;
const commonCampDashCount = API_EP_BOOK.COMMON_CAMP_DASHCOUNT;
const commonCountryDropAPI = API_EP_BOOK.COMMON_COUNTRYDROP_API_EP;
const commontimezonseDropAPI = API_EP_BOOK.COMMON_TIMEZONEDROP_API_EP;
const commongetMyProfileAPI = API_EP_BOOK.COMMON_GETMYPROFILE_API_EP;
const commonupdateMyProfileAPI = API_EP_BOOK.COMMON_MYPROFILEUPDATE_API_EP;
const commonchangePasswordAPI = API_EP_BOOK.COMMON_CHANGE_PASSWORD_API_EP;

//Catalog Reply
const catalogReplyListAPI = API_EP_BOOK.CATALOG_REPLY_LIST_API_EP;
const catalogReplyEditAPI = API_EP_BOOK.CATALOG_REPLY_EDIT_API_EP;
const catalogReplyGetAPI = API_EP_BOOK.CATALOG_REPLY_GET;

//Catalog
const catalogListAPI = API_EP_BOOK.LIST_CATALOG_API_EP;
const catalogCreateAPI = API_EP_BOOK.CREATE_CATALOG_API_EP;
const catalogSyncAPI = API_EP_BOOK.CATALOG_SYNC_API_EP;
const catalogBussinessDropAPI = API_EP_BOOK.CATALOG_BUSSINESS_DROP_API_EP;
const cataloglistLinkedAPI = API_EP_BOOK.CATALOG_LIST_LINKED_API_EP;
const catalogLinkAPI = API_EP_BOOK.CATALOG_LINK_API_EP;
const catalogLinkBizIdAPI = API_EP_BOOK.CATALOG_LINK_BIZID_API_EP;
const catalogBizInfoAPI = API_EP_BOOK.CATALOG_BIZ_INFO_API_EP;
const catalogDeleteAPI = API_EP_BOOK.CATALOG_DELETE_API_EP;
const catalogwhatsappsetupList = API_EP_BOOK.CATALOG_WHATSAPP_SETUP_LIST;
const catalogwhatsappwebhookList = API_EP_BOOK.CATALOG_WHATSAPP_WEBHOOK_LIST;
const catalogwhatsapphealthList = API_EP_BOOK.CATALOG_WHATSAPP_HEALTH_LIST;
const catalogwhatsapptokenInfo = API_EP_BOOK.CATALOG_WHATSAPP_TOKEN_INFO;
const catalogwhatsappIntegrationSet = API_EP_BOOK.CATALOG_WHATSAPP_INTEGRATIONSET;
const catalogwhatsapptestContact = API_EP_BOOK.CATALOG_WHATSAPP_TEST_CONTACT;
const catalogwhatsappHealthy = API_EP_BOOK.CATALOG_WHATSAPP_HEALTHY;
const catalogwhatsappbussinessInfo = API_EP_BOOK.CATALOG_WHATSAPP_BUSSINESS_INFO;
const catalogwhatsappIndustryDrop = API_EP_BOOK.CATALOG_WHATSAPP_INDUSTRY_DROP;
const catalogwhatsappbussinessProfileUpdate = API_EP_BOOK.CATALOG_WHATSAPP_BUSSINESS_PROFILE_UPDATE;
const catalogwhatsappImgUploadAPI = API_EP_BOOK.CATALOG_ADMIN_IMG_UPLOAD_API_EP;
const catalogwhatsappaddPhoneno = API_EP_BOOK.CATALOG_WHATSAPP_ADD_PHONENO;
const catalogwhatsappSubscription = API_EP_BOOK.CATALOG_WHATSAPP_SUBSCRIPTION;
const catalogwhatsappwebhookUnsub = API_EP_BOOK.CATALOG_WHATSAPP_WEBHOOK_UNSUB;

//Catalog Enabled
const catalogEnabled = API_EP_BOOK.CATALOG_ENABLED_API;


//Product
const productListAPI = API_EP_BOOK.PRODUCT_LIST_API_EP;
const productImgListAPI = API_EP_BOOK.PRODUCT_IMAGE_LIST;
const productCreateAPI = API_EP_BOOK.PRODUCT_CREATE_API_EP;
const productUploadImgAPI = API_EP_BOOK.PRODUCT_UPLOADIMG_API_EP;
const productDeleteImgAPI = API_EP_BOOK.PRODUCT_DELETE_IMG_API_EP;
const productUpdateAPI = API_EP_BOOK.PRODUCT_UPDATE_API_EP;
const productImportAPI = API_EP_BOOK.PRODUCT_IMPORT_API_EP;
const productDeleteAPI = API_EP_BOOK.PRODUCT_DELETE_API_EP;
const productGetAPI = API_EP_BOOK.PRODUCT_GET_API_EP;
const productSyncAPI = API_EP_BOOK.PRODUCT_SYNC_API_EP;
const productStatusChangeAPI = API_EP_BOOK.PRODUCT_STATUS_CHANGE_API_EP;

//Order
const OrderListAPI = API_EP_BOOK.ORDER_LIST_API_EP;
const OrderExportAPI = API_EP_BOOK.ORDER_EXPORT_API_EP;
const OrderStatusUpdateAPI = API_EP_BOOK.ORDER_STATUS_UPDATE_API_EP;

const VendorAPI = {
    
    //General
    generalVendorGet: function () {
        const requestAPIData = {
            url: generalVendorGet.url,
            method: generalVendorGet.method,
            authorization: generalVendorGet.authorization,
        };
        return API(requestAPIData);
    },
    //Custom Campaign
    customCampaignGet: function (id: any) {
        const url = customCampaignGet.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: customCampaignGet.method,
            authorization: customCampaignGet.authorization
        };

        return API(requestAPIData)
    },
    customCampaignStatus: function (id: any) {
        const url = customCampaignStatus.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: customCampaignStatus.method,
            authorization: customCampaignStatus.authorization
        };

        return API(requestAPIData)
    },
    customCampaignList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(customCampaignList, requestAPIData);
        return getResponse;
    },
    customCampaignUpdate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(customCampaignUpdate, requestAPIData);
        return getResponse;
    },
    //Common
    commonSuperadminDashCount: function () {
        const requestAPIData = {
            url: commonSuperadminDashCount.url,
            method: commonSuperadminDashCount.method,
            authorization: commonSuperadminDashCount.authorization,
        };
        return API(requestAPIData);
    },
    commonVendorDashCount: function () {
        const requestAPIData = {
            url: commonVendorDashCount.url,
            method: commonVendorDashCount.method,
            authorization: commonVendorDashCount.authorization,
        };
        return API(requestAPIData);
    },
    commonCampDashCount: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(commonCampDashCount, requestAPIData);
        return getResponse;
    },
    commonCountryDropAPI: function () {
        const requestAPIData = {
            url: commonCountryDropAPI.url,
            method: commonCountryDropAPI.method,
            authorization: commonCountryDropAPI.authorization,
        };
        return API(requestAPIData);
    },
    commontimezonseDropAPI: function () {
        const requestAPIData = {
            url: commontimezonseDropAPI.url,
            method: commontimezonseDropAPI.method,
            authorization: commontimezonseDropAPI.authorization,
        };
        return API(requestAPIData);
    },
    commongetMyProfileAPI: function () {
        const requestAPIData = {
            url: commongetMyProfileAPI.url,
            method: commongetMyProfileAPI.method,
            authorization: commongetMyProfileAPI.authorization,
        };
        return API(requestAPIData);
    },
    commonupdateMyProfileAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(commonupdateMyProfileAPI, requestAPIData);
        return getResponse;
    },
    commonchangePasswordAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(commonchangePasswordAPI, requestAPIData);
        return getResponse;
    },
    //Campaign
    campaignListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(campaignListAPI, requestAPIData);
        return getResponse;
    },
    campaignArchiveListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(campaignArchiveListAPI, requestAPIData);
        return getResponse;
    },
    campaignListDashboardAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(campaignListDashboardAPI, requestAPIData);
        return getResponse;
    },
    campaignListQueueAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(campaignListQueueAPI, requestAPIData);
        return getResponse;
    },
    campaignListExecutedAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(campaignListExecutedAPI, requestAPIData);
        return getResponse;
    },
    campaignCreateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(campaignCreateAPI, requestAPIData);
        return getResponse;
    },
    campaignvariableDropdwon: function () {
        const apiUrl = campaignvariableDropdwon.url;
        const requestAPIData = {
            url: apiUrl,
            method: campaignvariableDropdwon.method,
            authorization: campaignvariableDropdwon.authorization
        };
        return API(requestAPIData);
    },
    campaignDelete: function (id: any) {
        const url = campaignDelete.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: campaignDelete.method,
            authorization: campaignDelete.authorization
        };

        return API(requestAPIData)
    },
    campaignarchiveActive: function (id: any) {
        const url = campaignarchiveActive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: campaignarchiveActive.method,
            authorization: campaignarchiveActive.authorization
        };

        return API(requestAPIData)
    },
    campaignarchiveDeactive: function (id: any) {
        const url = campaignarchiveDeactive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: campaignarchiveDeactive.method,
            authorization: campaignarchiveDeactive.authorization
        };

        return API(requestAPIData)
    },

    // Whatsapp chat

    whatsappChatsendAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappChatsendAPI, requestAPIData);
        return getResponse;
    },
    whatsappChatListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappChatListAPI, requestAPIData);
        return getResponse;
    },
    whatsappChatClearAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappChatClearAPI, requestAPIData);
        return getResponse;
    },
    whatsappContactSideListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappContactSideListAPI, requestAPIData);
        return getResponse;
    },
    whatsappContactUnreadSideListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappContactUnreadSideListAPI, requestAPIData);
        return getResponse;
    },
    sideListWappAPI: function () {
        const getResponse = API(sideListWappAPI);
        return getResponse;
    },
    exportChat: function () {
        const apiUrl = exportChat.url;
        const requestAPIData = {
            url: apiUrl,
            method: exportChat.method,
            authorization: exportChat.authorization
        };
        return API(requestAPIData);
    },
    // Bot Reply

    botReplyList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(botReplyList, requestAPIData);
        return getResponse;
    },
    chatBotGetAPI: function (botId: any) {
        const apiUrl = chatBotGetAPI.url.replace(':id', botId);
        const requestAPIData = {
            url: apiUrl,
            method: chatBotGetAPI.method,
            authorization: chatBotGetAPI.authorization
        };
        return API(requestAPIData);
    },
    botactiveStatus: function (botId: any) {
        const apiUrl = botactiveStatus.url.replace(':id', botId);
        const requestAPIData = {
            url: apiUrl,
            method: botactiveStatus.method,
            authorization: botactiveStatus.authorization
        };
        return API(requestAPIData);
    },
    botdeactiveStatus: function (botId: any) {
        const apiUrl = botdeactiveStatus.url.replace(':id', botId);
        const requestAPIData = {
            url: apiUrl,
            method: botdeactiveStatus.method,
            authorization: botdeactiveStatus.authorization
        };
        return API(requestAPIData);
    },
    botdelete: function (botId: any) {
        const apiUrl = botdelete.url.replace(':id', botId);
        const requestAPIData = {
            url: apiUrl,
            method: botdelete.method,
            authorization: botdelete.authorization
        };
        return API(requestAPIData);
    },
    botTriggerDrop: function () {
        const getResponse = API(botTriggerDrop);
        return getResponse;
    },

    // ChatBot
    chatCreateAPI: function (apiData: any) {
    const requestAPIData = {bodyData: apiData }; 
    const getResponse = API(chatBotCreateAPI, requestAPIData)
    return getResponse;}, 

    chatBotImageUploadAPI: function (apiData: any) {
    const requestAPIData = {bodyData: apiData }; 
    const getResponse = API(chatBotImageUploadAPI, requestAPIData)
    return getResponse;}, 

    chatEditAPI: function (apiData: any) {
        const requestAPIData = {bodyData: apiData }; 
        const getResponse = API(chatBotEditAPI, requestAPIData)
        return getResponse;}, 
    chatDuplicateAPI: function (apiData: any) {
        const requestAPIData = {bodyData: apiData }; 
        const getResponse = API(chatBotDuplicateAPI, requestAPIData)
        return getResponse;},
    // Bot Flow

    botFlowList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(botFlowList, requestAPIData);
        return getResponse;
    },
    botFlowCreate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(botFlowCreate, requestAPIData);
        return getResponse;
    },
    botFlowDuplicate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(botFlowDuplicate, requestAPIData);
        return getResponse;
    },
    botFlowUpdate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(botFlowUpdate, requestAPIData);
        return getResponse;
    },
    botFlowGet: function (id: any) {
        const url = botFlowGet.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: botFlowGet.method,
            authorization: botFlowGet.authorization
        };

        return API(requestAPIData)
    },
    botFlowDelete: function (id: any) {
        const url = botFlowDelete.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: botFlowDelete.method,
            authorization: botFlowDelete.authorization
        };

        return API(requestAPIData)
    },
    botFlowActive: function (id: any) {
        const url = botFlowActive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: botFlowActive.method,
            authorization: botFlowActive.authorization
        };

        return API(requestAPIData)
    },
    botFlowDeactive: function (id: any) {
        const url = botFlowDeactive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: botFlowDeactive.method,
            authorization: botFlowDeactive.authorization
        };

        return API(requestAPIData)
    },

    // Whatsapp Subscription

    whatsappSubscription: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappSubscription, requestAPIData);
        return getResponse;
    },
    whatsappIntegrationSet: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappIntegrationSet, requestAPIData);
        return getResponse;
    },
    whatsappHealthy: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappHealthy, requestAPIData);
        return getResponse;
    },
    whatsappsetupList: function () {
         const requestAPIData = {
            url: whatsappsetupList.url,
            method: whatsappsetupList.method,
            authorization: whatsappsetupList.authorization,
        };
        return API(requestAPIData);
    },
    whatsappwebhookList: function () {
         const requestAPIData = {
            url: whatsappwebhookList.url,
            method: whatsappwebhookList.method,
            authorization: whatsappwebhookList.authorization,
        };
        return API(requestAPIData);
    },
    whatsapphealthList: function () {
         const requestAPIData = {
            url: whatsapphealthList.url,
            method: whatsapphealthList.method,
            authorization: whatsapphealthList.authorization,
        };
        return API(requestAPIData);
    },
    whatsappwebhookUnsub: function () {
         const requestAPIData = {
            url: whatsappwebhookUnsub.url,
            method: whatsappwebhookUnsub.method,
            authorization: whatsappwebhookUnsub.authorization,
        };
        return API(requestAPIData);
    },
    whatsapptokenInfo: function () {
         const requestAPIData = {
            url: whatsapptokenInfo.url,
            method: whatsapptokenInfo.method,
            authorization: whatsapptokenInfo.authorization,
        };
        return API(requestAPIData);
    },
    whatsappbussinessInfo: function () {
         const requestAPIData = {
            url: whatsappbussinessInfo.url,
            method: whatsappbussinessInfo.method,
            authorization: whatsappbussinessInfo.authorization,
        };
        return API(requestAPIData);
    },
    whatsappbussinessProfileUpdate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappbussinessProfileUpdate, requestAPIData);
        return getResponse;
    },
    whatsapptestContact: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsapptestContact, requestAPIData);
        return getResponse;
    },
    whatsappaddPhoneno: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappaddPhoneno, requestAPIData);
        return getResponse;
    },
    whatsappIndustryDrop: function () {
        const apiUrl = whatsappIndustryDrop.url;
        const requestAPIData = {
            url: apiUrl,
            method: whatsappIndustryDrop.method,
            authorization: whatsappIndustryDrop.authorization
        };
        return API(requestAPIData);
    },
    
    // Sms Setup 

    smssetupCreate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smssetupCreate, requestAPIData);
        return getResponse;
    },
    smssetuptestContact: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smssetuptestContact, requestAPIData);
        return getResponse;
    },
    smssetupConfig: function () {
        const apiUrl = smssetupConfig.url;
        const requestAPIData = {
            url: apiUrl,
            method: smssetupConfig.method,
            authorization: smssetupConfig.authorization
        };
        return API(requestAPIData);
    },
    // Sms Campaign 
    smscampaignExecuteExport: function (id: any) {
        const url = smscampaignExecuteExport.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smscampaignExecuteExport.method,
            authorization: smscampaignExecuteExport.authorization
        };
        return API(requestAPIData)
    },
    smscampaignQueueExport: function (id: any) {
        const url = smscampaignQueueExport.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smscampaignQueueExport.method,
            authorization: smscampaignQueueExport.authorization
        };
        return API(requestAPIData)
    },
    smscampaignReportList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignReportList, requestAPIData);
        return getResponse;
    },
    smscampaignExport: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignExport, requestAPIData);
        return getResponse;
    },
    smscampaignList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignList, requestAPIData);
        return getResponse;
    },
    smscampaignDashList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignDashList, requestAPIData);
        return getResponse;
    },
    smscampaignQueueList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignQueueList, requestAPIData);
        return getResponse;
    },
    smscampaignExecuteList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignExecuteList, requestAPIData);
        return getResponse;
    },
    smscampaignArchiveList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignArchiveList, requestAPIData);
        return getResponse;
    },
    smscampaignCreate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smscampaignCreate, requestAPIData);
        return getResponse;
    },
    smscampaignSenderDrop: function () {
        const apiUrl = smscampaignSenderDrop.url;
        const requestAPIData = {
            url: apiUrl,
            method: smscampaignSenderDrop.method,
            authorization: smscampaignSenderDrop.authorization
        };
        return API(requestAPIData);
    },
    smscampaignTempDrop: function () {
        const apiUrl = smscampaignTempDrop.url;
        const requestAPIData = {
            url: apiUrl,
            method: smscampaignTempDrop.method,
            authorization: smscampaignTempDrop.authorization
        };
        return API(requestAPIData);
    },
    smscampaignActive: function (id: any) {
        const url = smscampaignActive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smscampaignActive.method,
            authorization: smscampaignActive.authorization
        };
        return API(requestAPIData)
    },
    smscampaignDeactive: function (id: any) {
        const url = smscampaignDeactive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smscampaignDeactive.method,
            authorization: smscampaignDeactive.authorization
        };
        return API(requestAPIData)
    },
    smscampaignDelete: function (id: any) {
        const url = smscampaignDelete.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smscampaignDelete.method,
            authorization: smscampaignDelete.authorization
        };
        return API(requestAPIData)
    },
    // Sms Template 

    smstemplateList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smstemplateList, requestAPIData);
        return getResponse;
    },
    smstemplateCreate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smstemplateCreate, requestAPIData);
        return getResponse;
    },
    smstemplateUpdate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(smstemplateUpdate, requestAPIData);
        return getResponse;
    },
    smstemplateGet: function (id: any) {
        const url = smstemplateGet.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smstemplateGet.method,
            authorization: smstemplateGet.authorization
        };
        return API(requestAPIData)
    },
    smstemplateActive: function (id: any) {
        const url = smstemplateActive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smstemplateActive.method,
            authorization: smstemplateActive.authorization
        };
        return API(requestAPIData)
    },
    smstemplateDeactive: function (id: any) {
        const url = smstemplateDeactive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smstemplateDeactive.method,
            authorization: smstemplateDeactive.authorization
        };
        return API(requestAPIData)
    },
    smstemplateDelete: function (id: any) {
        const url = smstemplateDelete.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: smstemplateDelete.method,
            authorization: smstemplateDelete.authorization
        };
        return API(requestAPIData)
    },
    // Whatsapp 

    whatsappTemplateCreate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappCreateAPI, requestAPIData);
        return getResponse;
    },
    whatsappSendmsgAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappSendmsgAPI, requestAPIData);
        return getResponse;
    },
    whatsappMsgSendAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappMsgSendAPI, requestAPIData);
        return getResponse;
    },
    whatsappTemplateList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappListAPI, requestAPIData);
        return getResponse;
    },
    whatsappSyncAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(whatsappSyncAPI, requestAPIData);
        return getResponse;
    },
    whatsappImgUploadAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(whatsappImgUploadAPI, requestAPIData);
        return getResponse;
    },
    whatsappGet: function (id: any) {
        const url = whatsappGetAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: whatsappGetAPI.method,
            authorization: whatsappGetAPI.authorization
        };

        return API(requestAPIData)
    },
    whatsappDeletetemp: function (id: any, tempname: any) {
        const url = whatsappDeleteAPI.url.replace(':id', id).replace(':tempname', tempname);;
        const requestAPIData = {
            url: url,
            method: whatsappDeleteAPI.method,
            authorization: whatsappDeleteAPI.authorization
        };

        return API(requestAPIData)
    },
    whatsappTemplateDropdwon: function () {
        const apiUrl = whatsappTemplateDropdwon.url;
        const requestAPIData = {
            url: apiUrl,
            method: whatsappTemplateDropdwon.method,
            authorization: whatsappTemplateDropdwon.authorization
        };
        return API(requestAPIData);
    },
    languageCodeDropdown: function () {
        const apiUrl = languageCodeDropdown.url;
        const requestAPIData = {
            url: apiUrl,
            method: languageCodeDropdown.method,
            authorization: languageCodeDropdown.authorization
        };
        return API(requestAPIData);
    },
    whatscampaignExecuteExport: function (storeId: any) {
        const apiUrl = whatscampaignExecuteExport.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: whatscampaignExecuteExport.method,
            authorization: whatscampaignExecuteExport.authorization
        };
        return API(requestAPIData);
    },
    whatscampaignQueueExport: function (storeId: any) {
        const apiUrl = whatscampaignQueueExport.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: whatscampaignQueueExport.method,
            authorization: whatscampaignQueueExport.authorization
        };
        return API(requestAPIData);
    },
    // STORE API'S START
    listStoreData: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(listStoreAPIEP, requestAPIData);
        return getResponse;
    },
    createStore: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(createStore, requestAPIData);
        return getResponse;
    },
    importStore: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(importStore, requestAPIData);
        return getResponse;
    },
    exportStore: function () {
        const apiUrl = exportStore.url;
        const requestAPIData = {
            url: apiUrl,
            method: exportStore.method,
            authorization: exportStore.authorization,
        };
        return API(requestAPIData);
    },
    exportHeaderStore: function () {
        const apiUrl = exportHeaderStore.url;
        const requestAPIData = {
            url: apiUrl,
            method: exportHeaderStore.method,
            authorization: exportHeaderStore.authorization,
        };
        return API(requestAPIData);
    },
    getStoreByIdAPIEP: function (storeId: any) {
        const apiUrl = getStoreByIdAPIEP.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: getStoreByIdAPIEP.method,
            authorization: getStoreByIdAPIEP.authorization
        };
        return API(requestAPIData);
    },
    storeActiveAPIEP: function (storeId: any) {
        const apiUrl = storeActiveAPIEP.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: storeActiveAPIEP.method,
            authorization: storeActiveAPIEP.authorization
        };
        return API(requestAPIData);
    },
    storeDeactiveAPIEP: function (storeId: any) {
        const apiUrl = storeDeactiveAPIEP.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: storeDeactiveAPIEP.method,
            authorization: storeDeactiveAPIEP.authorization
        };
        return API(requestAPIData);
    },
    updateStore: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(updateStoreByAPIEP, requestAPIData);
        return getResponse;
    },
    deleteStoreAPIEP: function (storeId: any) {
        const apiUrl = deleteStoreAPIEP.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: deleteStoreAPIEP.method,
            authorization: deleteStoreAPIEP.authorization
        };
        return API(requestAPIData);
    },
    // STORE API'S END

    // STAFF API'S START
    listStaffData: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(listStaffAPIEP, requestAPIData);
        return getResponse;
    },
    createStaff: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(createStaff, requestAPIData);
        return getResponse;
    },
    importStaff: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(importStaff, requestAPIData);
        return getResponse;
    },
    exportStaff: function () {
        const apiUrl = exportStaff.url;
        const requestAPIData = {
            url: apiUrl,
            method: exportStaff.method,
            authorization: exportStaff.authorization
        };
        return API(requestAPIData);
    },
    exportHeaderStaff: function () {
        const apiUrl = exportHeaderStaff.url;
        const requestAPIData = {
            url: apiUrl,
            method: exportHeaderStaff.method,
            authorization: exportHeaderStaff.authorization,
            responseType:'blob',
        };
        return API(requestAPIData);
    },
    staffActiveAPIEP: function (storeId: any) {
        const apiUrl = staffActiveAPIEP.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: staffActiveAPIEP.method,
            authorization: staffActiveAPIEP.authorization
        };
        return API(requestAPIData);
    },
    staffDeactiveAPIEP: function (storeId: any) {
        const apiUrl = staffDeactiveAPIEP.url.replace(':id', storeId);
        const requestAPIData = {
            url: apiUrl,
            method: staffDeactiveAPIEP.method,
            authorization: staffDeactiveAPIEP.authorization
        };
        return API(requestAPIData);
    },
    getStaffByIdAPIEP: function (staffId: any) {
        const apiUrl = getStaffByIdAPIEP.url.replace(':id', staffId);
        const requestAPIData = {
            url: apiUrl,
            method: getStaffByIdAPIEP.method,
            authorization: getStaffByIdAPIEP.authorization
        };
        return API(requestAPIData);
    },

    getStoreDropAPIEP: function () {
        const apiUrl = getStoreDropAPIEP.url;
        const requestAPIData = {
            url: apiUrl,
            method: getStoreDropAPIEP.method,
            authorization: getStoreDropAPIEP.authorization
        };
        return API(requestAPIData);
    },
    updateStaff: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(updateStaffByAPIEP, requestAPIData);
        return getResponse;
    },
    deleteStaffAPIEP: function (staffId: any) {
        const apiUrl = deleteStaffAPIEP.url.replace(':id', staffId);
        const requestAPIData = {
            url: apiUrl,
            method: deleteStaffAPIEP.method,
            authorization: deleteStaffAPIEP.authorization
        };
        return API(requestAPIData);
    },
    // STAFF API'S END

    // CONTACT API'S START
    contactCreateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactCreateAPI, requestAPIData);
        return getResponse;
    },
    contactListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactListAPI, requestAPIData);
        return getResponse;
    },
    importContact: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(importContact, requestAPIData);
        return getResponse;
    },
    exportContact: function (id?: any) {
    let url = exportContact.url;

    if (id) {
        // Replace ':id' if id exists
        url = url.replace(':id', id);
    } else {
        // Remove '/:id' from the URL if id is not provided
        url = url.replace(/\/:id$/, '');
    }

    const requestAPIData = {
        url: url,
        method: exportContact.method,
        authorization: exportContact.authorization
    };

    return API(requestAPIData);
},

    exportHeaderContact: function () {
        const apiUrl = exportHeaderContact.url;
        const requestAPIData = {
            url: apiUrl,
            method: exportHeaderContact.method,
            authorization: exportHeaderContact.authorization
        };
        return API(requestAPIData);
    },
    contactEditAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactEditAPI, requestAPIData);
        return getResponse;
    },
    contactBulkDeleteAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactBulkDeleteAPI, requestAPIData);
        return getResponse;
    },
    contactBulkGroupAssignAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactBulkGroupAssignAPI, requestAPIData);
        return getResponse;
    },

    contactDeleteAPI: function (id: any) {
        const url = contactDeleteAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: contactDeleteAPI.method,
            authorization: contactDeleteAPI.authorization
        };
        return API(requestAPIData)

    },

    contactGetAPI: function (id: any) {
        const url = contactGetAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: contactGetAPI.method,
            authorization: contactGetAPI.authorization
        };

        return API(requestAPIData)
    },

    contactStoreDropdownAPI: function () {
        const getResponse = API(contactStoreDropdwon);
        return getResponse;
    },

    contactGroupDropdownAPI: function () {
        const getResponse = API(contactGroupDropdwon);
        return getResponse;
    },
    contactDeleteAllAPI: function () {
        const getResponse = API(contactDeleteAllAPI);
        return getResponse;
    },
    // CONTACT API'S END

    // CUSTOM FIELD CONTACT API'S START
    customFieldcontactCreate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(customFieldcontactCreate, requestAPIData);
        return getResponse;
    },
    customFieldcontactList: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(customFieldcontactList, requestAPIData);
        return getResponse;
    },
    customFieldcontactUpdate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(customFieldcontactUpdate, requestAPIData);
        return getResponse;
    },
    customFieldcontactGet: function (id: any) {
        const url = customFieldcontactGet.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: customFieldcontactGet.method,
            authorization: customFieldcontactGet.authorization
        };
        return API(requestAPIData)
    },
    customFieldcontactStatus: function (id: any) {
        const url = customFieldcontactStatus.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: customFieldcontactStatus.method,
            authorization: customFieldcontactStatus.authorization
        };
        return API(requestAPIData)
    },
    customFieldcontactDelete: function (id: any) {
        const url = customFieldcontactDelete.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: customFieldcontactDelete.method,
            authorization: customFieldcontactDelete.authorization
        };
        return API(requestAPIData)
    },
    // CUSTOM FIELD CONTACT API'S END

    // CONTACT_GROUP API'S START
    contactGroupCreateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactGroupCreateAPI, requestAPIData);
        return getResponse;
    },
    contactGroupListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactGroupListAPI, requestAPIData);
        return getResponse;
    },
    contactArchiveGroupListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactArchiveGroupListAPI, requestAPIData);
        return getResponse;
    },
    contactGroupContactListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactGroupContactListAPI, requestAPIData);
        return getResponse;
    },
    contactGroupEditAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactGroupEditAPI, requestAPIData);
        return getResponse;
    },
    contactGroupDeleteAllAPI: function () {
        const getResponse = API(contactGroupDeleteAllAPI);
        return getResponse;
    },
    contactBulkGroupDeleteAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactBulkGroupDeleteAPI, requestAPIData);
        return getResponse;
    },
    contactGrouparchiveBulkActive: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactGrouparchiveBulkActive, requestAPIData);
        return getResponse;
    },
    contactGrouparchiveBulkDeactive: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(contactGrouparchiveBulkDeactive, requestAPIData);
        return getResponse;
    },

    contactGroupDeleteAPI: function (id: any) {
        const url = contactGroupDeleteAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: contactGroupDeleteAPI.method,
            authorization: contactGroupDeleteAPI.authorization
        };
        return API(requestAPIData)

    },

    contactGroupGetAPI: function (id: any) {
        const url = contactGroupGetAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: contactGroupGetAPI.method,
            authorization: contactGroupGetAPI.authorization
        };

        return API(requestAPIData)
    },
    contactGrouparchiveActive: function (id: any) {
        const url = contactGrouparchiveActive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: contactGrouparchiveActive.method,
            authorization: contactGrouparchiveActive.authorization
        };

        return API(requestAPIData)
    },
    contactGrouparchiveDeactive: function (id: any) {
        const url = contactGrouparchiveDeactive.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: contactGrouparchiveDeactive.method,
            authorization: contactGrouparchiveDeactive.authorization
        };

        return API(requestAPIData)
    },
    // CONTACT_GROUP API'S END

    // CATALOG REPLY API'S START
    catalogReplyListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogReplyListAPI, requestAPIData);
        return getResponse;
    },
    catalogReplyEditAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogReplyEditAPI, requestAPIData);
        return getResponse;
    },
    catalogReplyGetAPI: function (id: any) {
        const url = catalogReplyGetAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: catalogReplyGetAPI.method,
            authorization: catalogReplyGetAPI.authorization
        };

        return API(requestAPIData)
    },
    // CATALOG REPLY API'S END

    // CATALOG API'S START
    catalogListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogListAPI, requestAPIData);
        return getResponse;
    },
    catalogCreateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogCreateAPI, requestAPIData);
        return getResponse;
    },
    catalogSyncAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogSyncAPI, requestAPIData);
        return getResponse;
    },
    catalogLinkAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogLinkAPI, requestAPIData);
        return getResponse;
    },
    catalogLinkBizIdAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogLinkBizIdAPI, requestAPIData);
        return getResponse;
    },
    catalogDeleteAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogDeleteAPI, requestAPIData);
        return getResponse;
    },
    catalogBizInfoAPI: function () {
        const getResponse = API(catalogBizInfoAPI);
        return getResponse;
    },
    cataloglistLinkedAPI: function () {
        const getResponse = API(cataloglistLinkedAPI);
        return getResponse;
    },
    catalogBussinessDropAPI: function () {
        const getResponse = API(catalogBussinessDropAPI);
        return getResponse;
    },
    catalogwhatsapphealthList: function () {
         const requestAPIData = {
            url: catalogwhatsapphealthList.url,
            method: catalogwhatsapphealthList.method,
            authorization: catalogwhatsapphealthList.authorization,
        };
        return API(requestAPIData);
    },
    catalogwhatsappwebhookList: function () {
         const requestAPIData = {
            url: catalogwhatsappwebhookList.url,
            method: catalogwhatsappwebhookList.method,
            authorization: catalogwhatsappwebhookList.authorization,
        };
        return API(requestAPIData);
    },
    catalogwhatsappsetupList: function () {
         const requestAPIData = {
            url: catalogwhatsappsetupList.url,
            method: catalogwhatsappsetupList.method,
            authorization: catalogwhatsappsetupList.authorization,
        };
        return API(requestAPIData);
    },

    catalogwhatsapptokenInfo: function () {
         const requestAPIData = {
            url: catalogwhatsapptokenInfo.url,
            method: catalogwhatsapptokenInfo.method,
            authorization: catalogwhatsapptokenInfo.authorization,
        };
        return API(requestAPIData);
    },
    catalogwhatsappIntegrationSet: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(catalogwhatsappIntegrationSet, requestAPIData);
        return getResponse;
    },
    catalogwhatsappHealthy: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(catalogwhatsappHealthy, requestAPIData);
        return getResponse;
    },
    catalogwhatsappbussinessInfo: function () {
         const requestAPIData = {
            url: catalogwhatsappbussinessInfo.url,
            method: catalogwhatsappbussinessInfo.method,
            authorization: catalogwhatsappbussinessInfo.authorization,
        };
        return API(requestAPIData);
    },
    catalogwhatsappIndustryDrop: function () {
        const apiUrl = whatsappIndustryDrop.url;
        const requestAPIData = {
            url: apiUrl,
            method: catalogwhatsappIndustryDrop.method,
            authorization: catalogwhatsappIndustryDrop.authorization
        };
        return API(requestAPIData);
    },
    catalogwhatsappbussinessProfileUpdate: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(catalogwhatsappbussinessProfileUpdate, requestAPIData);
        return getResponse;
    },
    catalogwhatsappImgUploadAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(catalogwhatsappImgUploadAPI, requestAPIData);
        return getResponse;
    },
    catalogwhatsappaddPhoneno: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(catalogwhatsappaddPhoneno, requestAPIData);
        return getResponse;
    },
    catalogwhatsappSubscription: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        };
        const getResponse = API(catalogwhatsappSubscription, requestAPIData);
        return getResponse;
    },
    catalogwhatsappwebhookUnsub: function () {
         const requestAPIData = {
            url: catalogwhatsappwebhookUnsub.url,
            method: catalogwhatsappwebhookUnsub.method,
            authorization: catalogwhatsappwebhookUnsub.authorization,
        };
        return API(requestAPIData);
    },
    //CatalogEnabled
    catalogEnabled: function () {
         const requestAPIData = {
            url: catalogEnabled.url,
            method: catalogEnabled.method,
            authorization: catalogEnabled.authorization,
        };
        return API(requestAPIData);
    },
    // CATALOG API'S END

    // PRODUCT API'S START
    productListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productListAPI, requestAPIData);
        return getResponse;
    },
    productImgListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productImgListAPI, requestAPIData);
        return getResponse;
    },
    productCreateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productCreateAPI, requestAPIData);
        return getResponse;
    },
    productUploadImgAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productUploadImgAPI, requestAPIData);
        return getResponse;
    },
    productDeleteImgAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productDeleteImgAPI, requestAPIData);
        return getResponse;
    },
    productUpdateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productUpdateAPI, requestAPIData);
        return getResponse;
    },
    productImportAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productImportAPI, requestAPIData);
        return getResponse;
    },
    productDeleteAPI: function (id: any) {
        const url = productDeleteAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: productDeleteAPI.method,
            authorization: productDeleteAPI.authorization
        };

        return API(requestAPIData)
    },
    productGetAPI: function (id: any) {
        const url = productGetAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: productGetAPI.method,
            authorization: productGetAPI.authorization
        };

        return API(requestAPIData)
    },
    productSyncAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(productSyncAPI, requestAPIData);
        return getResponse;
    },
    productStatusChangeAPI: function (id: any) {
        const url = productStatusChangeAPI.url.replace(':id', id);
        const requestAPIData = {
            url: url,
            method: productStatusChangeAPI.method,
            authorization: productStatusChangeAPI.authorization
        };

        return API(requestAPIData)
    },
    // PRODUCT API'S END

    // ORDER API'S START
    OrderListAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(OrderListAPI, requestAPIData);
        return getResponse;
    },
    OrderExportAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(OrderExportAPI, requestAPIData);
        return getResponse;
    },
    OrderStatusUpdateAPI: function (apiData: any) {
        const requestAPIData = {
            bodyData: apiData
        }; const getResponse = API(OrderStatusUpdateAPI, requestAPIData);
        return getResponse;
    },
    // ORDER API'S END
}
export default VendorAPI;