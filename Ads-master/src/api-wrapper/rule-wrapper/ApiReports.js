import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/`;
const authToken = localStorage.getItem("customerAuthToken");
const headers = {
  Authorization: `Bearer ${authToken}`,
  "Content-Type": "application/json",
};

const getReports = (id, data) => {
  return axios
    .post(`${api}ads/${id}/getReports`, data, { headers })
    .then((res) => res.data)
    .catch((res) => res.data);
};
const generateReports = (id) => {
  return axios
    .get(`${api}ads/${id}/generateReport`, { headers })
    .then((res) => res.data)
    .catch((res) => res.data);
};

const getRun = () => {
  return axios
    .get(`${api}budgetRule/cronJobRules`, { headers })
    .then((res) => res.data)
    .catch((res) => res.data);
};

export { getReports, generateReports, getRun };
