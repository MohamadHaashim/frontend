import axios from "axios";

const api = `${process.env.REACT_APP_API_BASE}/api/amazon/configGoogle/`;
const otherApi = `${process.env.REACT_APP_API_BASE}/api/amazon/`
const authToken = localStorage.getItem('customerAuthToken')
const headers = { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' };



const ApiGoogleLogin = () => {
    return axios.get(`${api}generateAuthUrl`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApicheckGoogleLogin = () => {
    return axios.get(`${api}checkConnectAccount`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApisendGoogleCode = (data) => {
    return axios.post(`${api}connectAccount`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApiUnLinkGoogle = () => {
    return axios.get(`${api}unlinkConnectAccount`, { headers })
        .then(res => res.data).catch(res => res.data)
}

const ApiCampaignRefresh = (id, data) => {
    return axios.post(`${otherApi}ads/${id}/refreshCampaigns`, data, { headers })
        .then(res => res.data).catch(res => res.data)
}


export { ApiCampaignRefresh, ApiGoogleLogin, ApicheckGoogleLogin, ApisendGoogleCode, ApiUnLinkGoogle }
