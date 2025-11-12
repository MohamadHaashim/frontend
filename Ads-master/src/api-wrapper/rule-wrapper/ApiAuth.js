import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/customer/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };

const changePwdApi = (data) => {
    return axios.post(`${api}changePassword`,data, { headers })
        .then(res => res.data).catch(res => res.data)
}

export { changePwdApi}
