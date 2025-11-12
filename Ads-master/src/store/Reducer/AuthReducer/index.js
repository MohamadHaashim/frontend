import * as types from "../../Types";

const initialState = {
  loader: false,
  userData: {},
  userProfile: {},
};
const AuthReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_LOADER:
      return {
        ...state,
         loader: action.payload.data
      }
    case types.SIGN_IN_SUCCESS:
      localStorage.setItem("customerAuthToken", action.payload.data.authToken);
      return {
        ...state,
        userData: action.payload.data,
      };
    case types.GET_PROFILE_SUCCESS:
      return {
        ...state,
        userProfile: action.payload.data,
      };
    case types.USER_LOGOUT:
      localStorage.removeItem("customerAuthToken");
      return initialState;
    default:
      return state;
  }
};
export default AuthReducer;
