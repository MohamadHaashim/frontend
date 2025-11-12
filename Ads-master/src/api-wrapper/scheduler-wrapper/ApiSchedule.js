import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/adSchedules/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const APIcreateSchedule = (data) => {
    return axios.post(`${api}createSchedule`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIgetSchedule = (id, data) => {
    return axios.post(`${api}${id}/getSchedules`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIupdateSchedule = (id, data) => {
    return axios.post(`${api}updateSchedule/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}


const APIdeleteSchedule = (id) => {
    return axios.delete(`${api}deleteSchedule/${id}`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const getAssignCampaignScheduler = (id, data) => {
    return axios.post(`${api}getAssignCampaigns/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}
const APIexportSchedule = (id) => {
    return axios.get(`${api}${id}/exportSheet`, { headers })
        .then(res => res.data).catch(res => res.data)
}

export { APIexportSchedule, getAssignCampaignScheduler, APIcreateSchedule, APIgetSchedule, APIupdateSchedule, APIdeleteSchedule }
