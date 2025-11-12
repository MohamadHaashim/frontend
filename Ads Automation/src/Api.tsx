const Url ={
    api : "https://adsexpert-api.getgrowth.agency",
    // api :"https://adsexpert-api.getgrowth.agency",

    // admin
    adminSchedulerSummary : "/Admin/Ads/SchedulerSummary",
    adminScheduler :"/Admin/Ads/Scheduler",
    adminProfile :"/Admin/Ads/Profile",
    adminSyncprofiles :"/Admin/Ads/SyncProfiles",
    adminProfiles :"/Admin/Ads/Profiles",
    // BackgroundServices
    backgroundServicesSyncQueue :"/BackgroundServices/Ads/SyncQueue",
    backgroundServicesSyncUserQueue :"/BackgroundServices/Ads/SyncUserQueue",
    backgroundServicesProcessQueue :"/BackgroundServices/Ads/ProcessQueue",
    backgroundServicesProcessFailedTask : "/BackgroundServices/Ads/ProcessFailedTask",
    backgroundServicesSyncZeroImpression :"/BackgroundServices/Ads/SyncZeroImpression",
    backgroundServicesReportsAll: "/BackgroundServices/Reports/All",
    // BulkUpdates
    bulkUpdateBulkRequest : "/BulkUpdates/BulkRequest",
    bulkUpdateProcessBulkRequest : "/BulkUpdates/ProcessBulkRequest",
    // ChangeLog
    changeLogAll :"/ChangeLog/All",
    changeLogExport :"/ChangeLog/Export",
    // MarketingStream
    msSPTrafficAndConversionALL : "/MarketingStream/SPTrafficAndConversion/ALL",
    msSPTrafficAndConversionExport : "/MarketingStream/SPTrafficAndConversion/Export",
    msSPTrafficExport : "/MarketingStream/SPTraffic/Export",
    msSPConversionExport : "/MarketingStream/SPConversion/Export",
    msSBTrafficAndConversionALL : "/MarketingStream/SBTrafficAndConversion/ALL",
    msSBTrafficAndConversionExport : "/MarketingStream/SBTrafficAndConversion/Export",
    msSBTrafficExport : "/MarketingStream/SBTraffic/Export",
    msSBConversionExport : "/MarketingStream/SBConversion/Export",
    msSDTrafficAndConversionALL : "/MarketingStream/SDTrafficAndConversion/ALL",
    msSDTrafficAndConversionExport : "/MarketingStream/SDTrafficAndConversion/Export",
    msSDTrafficExport : "/MarketingStream/SDTraffic/Export",
    msSDConversionExport : "/MarketingStream/SDConversion/Export",
    msSPTraffic : "/MarketingStream/SPTraffic",
    msSPConversion : "/MarketingStream/SPConversion",
    msSBTraffic : "/MarketingStream/SBTraffic",
    msSBConversion : "/MarketingStream/SBConversion",
    msSDTraffic : "/MarketingStream/SDTraffic",
    msSDConversion : "/MarketingStream/SDConversion",
    // MasterData
    masterDataPost : "/MasterData",
    masterDataGet : "/MasterData",
    masterDataDelete : "/MasterData/",           // pass the {id}
    masterDataGetById : "/MasterData/",          // pass the {name}
    // permissions
    permissionsPost : "/Permissions",
    permissionsGet : "/Permissions",
    permissionsPut : "/Permissions/",           // pass the {id}
    permissionsDelete : "/Permissions/",        // pass the {id}
    permissionsGetById : "/Permissions/",       // pass the {id}
    // recommendation
    recommendationApprove : "/Recommendation/Approve",
    recommendationAll : "/Recommendation/All",
    recommendationRemove : "/Recommendation/Remove",
    recommendationComparisonData : "/Recommendation/ComparisonData",
    // roles
    rolesPost : "/Roles",
    rolesGet : "/Roles",
    rolesPut : "/Roles/",
    rolesDelete : "/Roles/",
    rolesGetById : "/Roles/",
    // rule
    rulePost : "/Rule",
    rulePut : "/Rule",
    ruleDelete : "/Rule",
    ruleGetById : "/Rule/",
    ruleBudget : "/Rule/Budget",
    ruleBudgetPut : "/Rule/Budget",
    ruleAll : "/Rule/All",
    ruleCampaignName : "/Rule/CampaignName",
    ruleRuleName : "/Rule/RuleName",
    ruleDuplicate : "/Rule/Duplicate/",              // pass the {id}
    ruleStatus : "/Rule/Status",
    ruleChangeLog : "/Rule/ChangeLog",
    ruleChangeLogAll : "/Rule/ChangeLog/All",
    ruleTemplates : "/Rule/Templates",
    ruleTemplatesDelete : "/Rule/Templates",
    ruleTemplateGetById : "/Rule/Template/",           // pass the {id}
    ruleTemplatesPut : "/Rule/Template",
    ruleTemplatesAll : "/Rule/Templates/All",
    ruleTemplatesStatus : "/Rule/Templates/Status",
    ruleTemplatesDuplicate : "/Rule/Template/Duplicate/",           // pass the {id}
    ruleSyncCampaigns : "/Rule/SyncCampaigns",
    ruleMapCampaigns : "/Rule/MapCampaigns",
    ruleCampaignsPost : "/Rule/BulkOperation/Campaigns",
    ruleCampaignsPut : "/Rule/BulkOperation/Campaigns",
    ruleCampaignsDelete : "/Rule/BulkOperation/Campaigns",
    ruleInitiateRuleAutomation : "/Rule/InitiateRuleAutomation",
    ruleProcessRuleAutomation : "/Rule/ProcessRuleAutomation",
    ruleProcessAdsQueue : "/Rule/ProcessAdsQueue",
    // user
    usersAll : "/Users/All",
    usersPut : "/Users/",           // pass the {id}
    usersDelete : "/Users/",           // pass the {id}
    usersGetById : "/Users/",           // pass the {id}
    usersLogin : "/Users/Login",
    usersRegister : "/Users/Register",
    usersForgotPassword : "/Users/ForgotPassword",
    usersResetPassword : "/Users/ResetPassword",
    usersActivate : "/Users/Activate",
    usersResendActivationEmail : "/Users/ResendActivationEmail",
    usersMe : "/Users/Me",
    usersLogout : "/Users/Logout",
    usersAPICredentials : "/Users/APICredentials",
    usersProfile : "/Users/Profile",
    usersOAuthLogin : "/Users/OAuthLogin",
    usersProfilePreferences : "/Users/Onboarding/ProfilePreferences",
    usersProfileImage : "/Users/ProfileImage",
    usersChangepassword : "/Users/Changepassword",
}
export default Url;