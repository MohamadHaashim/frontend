import { API_URL } from './api-endpoints'

const getToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return token
    }
}

export const fetchVoting = async (body) => {
    try {
        const token = getToken()
        console.log("Body in fetch voting", body)
        const response = await fetch(API_URL.votingList, {
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