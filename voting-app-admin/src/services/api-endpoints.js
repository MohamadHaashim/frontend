import { environment } from "../environments/enviornments";

const API_BASE_URL = environment.apiBaseUrl;

export const API_URL = {

  //login
  login: API_BASE_URL + "login",

  //login
  logout: API_BASE_URL + "logout",

  //Category
  categoryAdd: API_BASE_URL + "category_admin/create",
  categoryList: API_BASE_URL + "category_admin/list",
  categoryUpdate: API_BASE_URL + "category_admin/update",
  categoryDelete: API_BASE_URL + "category_admin/delete/",

  //nominees
  nomineeAdd: API_BASE_URL + "nominees_admin/create",
  nomineeList: API_BASE_URL + "nominees_admin/list",
  nomineeUpdate: API_BASE_URL + "nominees_admin/update",
  nomineeDelete: API_BASE_URL + "nominees_admin/delete/",

  //events
  eventAdd: API_BASE_URL + "events_admin/create",
  eventList: API_BASE_URL + "events_admin/list",
  eventUpdate: API_BASE_URL + "events_admin/update",
  eventDelete: API_BASE_URL + "events_admin/delete/",

  getEventRelese:API_BASE_URL+"events_admin/getEventRelease",
  AddEventRelese:API_BASE_URL+"events_admin/setEventRelease",
  
  //get year list
  getYear: API_BASE_URL + "nominees_admin/getYear",

  // //get voting event list
  // getVotingEvents: API_BASE_URL + "events_admin/list",

  //voting list
  votingList: API_BASE_URL + "voting_admin/list",

  //settings
  addYearToShowNominees: API_BASE_URL + "nominees_admin/showToUser",
  listYearToShowNominees: API_BASE_URL + "nominees_admin/showToUserYearList",

  addVoteLimit: API_BASE_URL + "voting_admin/addVoteLimit",
  getVoteLimit: API_BASE_URL + "voting_admin/getVoteLimit",

  //Landing Page Logo List
  landingPageLogoList: API_BASE_URL + "image_admin/list",
  landingPageLogoUpdate: API_BASE_URL + "image_admin/update",
  landingPageLogoDelete: API_BASE_URL + "image_admin/delete",

};
