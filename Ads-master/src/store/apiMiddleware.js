import axios from "axios";
import { FetchFailed, FetchRequested, FetchSucceeded } from "./Action/mockApi";
import * as TYPE from "./Types";
import { BASE_URL } from "./api"
const apiMiddleware = (store) => (next) => (action) => {
  if (next) next(action);

  const { type, payload } = action;
  const accessToken = localStorage.getItem("accessToken")
  const authToken = localStorage.getItem('customerAuthToken')
  const {
    url,
    data,
    request = FetchRequested,
    success = FetchSucceeded,
    error = FetchFailed,
    token,
    method = "get",
    hideLoader,
  } = payload;
  // headers: { Authorization: `Bearer ${ token === 'amazon' ? accessToken:authToken}`, 'Content-Type': 'application/json', },
  return axios({
    // baseURL: BASE_URL,
    method,
    url,
    data,
    headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json', },
  })
    .then((res) => {
      store.dispatch(success(res));
      store.dispatch(FetchSucceeded());
      return res
    })
    .catch((err) => {
      return err.response
    });
};
export default apiMiddleware;
