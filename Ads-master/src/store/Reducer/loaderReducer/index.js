import * as types from "../../Types";

const initialState = {
  loader: false,
  loader1:false
};
const LoaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_LOADER:
      return {
        ...state,
         loader: action.payload.data
      }
    case types.GET_LOADER1:
      return { ...state, loader1: action.value }
    default:
      return state;
  }
};
export default LoaderReducer;
