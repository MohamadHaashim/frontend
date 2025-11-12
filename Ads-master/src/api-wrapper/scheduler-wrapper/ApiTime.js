import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/adSchedules/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };


const APIcreateTime = (data, id) => {
    return axios.post(`${api}createScheduleTime/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIgetTime = (data, id,) => {
    return axios.post(`${api}getScheduleTimes/${id}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIupdateTime = (data, scheduleId, timeId) => {
    return axios.post(`${api}updateScheduleTime/${scheduleId}/${timeId}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}


const APIdeleteTime = (scheduleId, timeId) => {
    return axios.delete(`${api}deleteScheduleTime/${scheduleId}/${timeId}`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const APIstatus = (data,scheduleId, timeId) => {
    return axios.post(`${api}changeScheduleStatus/${scheduleId}/${timeId}`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

export { APIcreateTime, APIgetTime, APIupdateTime, APIdeleteTime,APIstatus }
