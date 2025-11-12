import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/rulesTiming/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };

const getRulesTime = (id,data) => {
    return axios.post(`${api}${id}/getRulesTiming`,data, { headers })
        .then(res => res.data).catch(res => res.data)
}
// rulesTiming/updateRulesTiming/:ruleId
const updateRuleTime = (id,data) => {
    return axios.post(`${api}updateRulesTiming/${id}`,data, { headers })
    .then(res => res.data).catch(res => res.data)
}

const deleteRulesTimingApi = (id) =>{
    return axios.delete(`${api}deleteRulesTiming/${id}`, { headers })
    .then(res => res.data).catch(res => res.data)
}
export { getRulesTime , updateRuleTime,deleteRulesTimingApi}
