import { API_URL } from './api-endpoints'

const getToken = () =>{
    const token = localStorage.getItem('token');
    if(token){
      return token
    }
}

export const listYearToShowNominees = async () => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.listYearToShowNominees, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in listYearToShowNominees", error)
    }
}

export const addYearToShowNominees = async (body) => {
    try {
        const token = getToken()
        console.log("Body in fetch voting", body)
        const response = await fetch(API_URL.addYearToShowNominees, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in fetch voting", error)
    }
}

export const getVoteLimit = async () => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.getVoteLimit, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in getVoteLimit", error)
    }
}

export const addVoteLimit = async (body) => {
    try {
        const token = getToken()
        console.log("Body in fetch voting", body)
        const response = await fetch(API_URL.addVoteLimit, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in fetch voting", error)
    }
}

export const landingPageLogoList = async () => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.landingPageLogoList, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in Landing page logo", error)
    }
}

export const landingPageLogoUpdate = async (formData) => {
    try {
        const token = getToken()
        console.log("token in add nominee", token)
        const response = await fetch(API_URL.landingPageLogoUpdate, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const apiResponse = await response.json();
        return apiResponse;
    } catch (error) {
        console.log("Error in nominee add:", error)
    }
}