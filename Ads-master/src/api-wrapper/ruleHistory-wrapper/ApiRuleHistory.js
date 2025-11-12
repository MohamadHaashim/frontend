import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/ads/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const APIgetRuleHistory = (id,data) => {
    return axios.post(`${api}${id}/getRulesHistory`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}



export { APIgetRuleHistory }
