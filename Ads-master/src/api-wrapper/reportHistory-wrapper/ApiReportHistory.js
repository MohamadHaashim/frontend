import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/ads/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const APIgetHistory = (id,data) => {
    return axios.post(`${api}${id}/getReportsHistory`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}



export { APIgetHistory }
