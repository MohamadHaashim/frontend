import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/budgetRule/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };

const createRule = (data) => {
    return axios.post(`${api}createRule`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const getRule = (id,data) => {
    return axios.post(`${api}${id}/getBudgetRules`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const deleteRule = (id) => {
    return axios.delete(`${api}deleteRule/${id}`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const statusChange = (data,id) => {
    return axios.post(`${api}changeStatus/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const getRuleConditions = (id) => {
    return axios.get(`${api}getRule/${id}`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const updateRule = (id, data) => {
    return axios.post(`${api}updateRule/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApiToTemplate = (data) => {
    return axios.post(`${api}addTemplate`, data, { headers })
    .then(res => res.data).catch(res => res.data)
}

const updateBulkRule = (data) => {
    return axios.post(`${api}updateBulkRule`, data, { headers })
    .then(res => res.data).catch(res => res.data)
}

export {ApiToTemplate, createRule, getRule, deleteRule, statusChange,getRuleConditions,updateRule, updateBulkRule}
