import * as types from "../../Types";

const initialState = {
  amazonData: {},
  profileData: {},
  managerAcc: {},
  amazonConnected: "",
};
const AmazonReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.CONNECT_SUCCESS:
      localStorage.setItem(
        "accessToken",
        action.payload.data.data.adsAccessToken
      );
      return {
        ...state,
        amazonData: action.payload.data,
      };
    case types.PROFILE_LIST_SUCCESS:
      return {
        ...state,
        profileData: action.payload.data,
      };
    case types.MAIN_ACC_LIST_SUCCESS:
      return {
        ...state,
        managerAcc: action.payload.data,
      };
    case types.AMAZON_CONNECT_SUCCESS:
      return {
        ...state,
        amazonConnected: action.payload.data,
      };
    case types.AMAZON_UNLINK_SUCCESS:
      return {
        ...state,
        amazonConnected: action.payload.data,
      };
    default:
      return state;
  }
};
export default AmazonReducer;
