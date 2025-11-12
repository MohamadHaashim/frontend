import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/campaignTiming/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const createCampaignTime = (data) => {
    return axios.post(`${api}createCampaignTiming`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const getCampaignTime = (id, data) => {
    return axios.post(`${api}${id}/getCampaignsTiming`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const getCampaignTimeById = (id) => {
    return axios.get(`${api}getCampaignTiming/${id}`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const updateCampaignTimeById = (id, data) => {
    return axios.post(`${api}updateCampaignTiming/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const deleteTimingApi = (id) =>{
    return axios.delete(`${api}deleteCampaignTiming/${id}`, { headers })
    .then(res => res.data).catch(res => res.data)
}




export { createCampaignTime, getCampaignTime, getCampaignTimeById, updateCampaignTimeById,deleteTimingApi, }
