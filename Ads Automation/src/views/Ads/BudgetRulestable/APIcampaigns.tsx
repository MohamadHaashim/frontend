import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/budgetRule/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const getAssignCampaign = (id, data) => {
    return axios.post(`${api}getAssignCampaigns/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}
const getCampaign = (id, data) => {
    return axios.post(`${api}${id}/getCampaigns`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApiaddTemplate = (id, data) => {
    return axios.post(`${api}addTemplate/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApigetTemplate = (data) => {
    return axios.post(`${api}getAllTemplate`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApiExportTemplate = (id, data) => {
    return axios.post(`${api}${id}/assignTemplate`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApicheckExcel = (id, data) => {
    return axios.post(`${api}${id}/selectedCampaigns`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}



export { ApicheckExcel, getCampaign, getAssignCampaign, ApiaddTemplate, ApigetTemplate, ApiExportTemplate }


