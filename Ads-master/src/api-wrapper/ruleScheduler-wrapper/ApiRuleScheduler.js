import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/rulesSchedules/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const APIcreateRuleSchedule = (data) => {
     return axios.post(`${api}createSchedule`, data, { headers })
         .then(res => res.data).catch(res => res.data)
}

const APIgetRuleSchedule = (id, data) => {
    return axios.post(`${api}${id}/getSchedules`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIupdateRuleSchedule = (id, data) => {
     return axios.post(`${api}updateSchedule/${id}`, data, { headers })
         .then(res => res.data).catch(res => res.data)
}


const APIdeleteRuleSchedule = (id) =>{
    return axios.delete(`${api}deleteSchedule/${id}`, { headers })
    .then(res => res.data).catch(res => res.data)
}

const APIgetRule = (id) => {
    return axios.get(`${api}${id}/getBudgetRules`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIupdateRule = (id, data) => {
    return axios.post(`${api}updateSchedule/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

export { APIcreateRuleSchedule,APIupdateRuleSchedule,APIgetRuleSchedule,APIgetRule,APIupdateRule,APIdeleteRuleSchedule}
