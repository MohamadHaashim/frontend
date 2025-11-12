import { API_URL } from "./api-endpoints";

const getToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return token
    }
}

// export const getVotingEvents = async () => {
//     try {
//         const token = getToken()
//         const response = await fetch(API_URL.eventList, {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         // Parse the JSON response only if the request was successful
//         const apiResponse = await response.json();
//         return apiResponse;
//     } catch (error) {
//         console.error("Error:", error);
//         throw error;
//     }
// };

export const addEvent = async (formData) => {
    try {

        const token = getToken();
        console.log("token in add cateogry", token)
        const response = await fetch(API_URL.eventAdd, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const apiResponse = await response.json();
        return apiResponse;
    } catch (error) {
        console.log("Error in event add:", error)
    }
}

export const fetchEvents = async (body) => {
    try {

        const token = getToken()
        console.log("body in fetch catsse", body)
        console.log("Token in event service", token)

        const response = await fetch(API_URL.eventList, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        const responseData = await response.json()
        return responseData
    } catch (error) {
        console.log("Error in fetch event", error)
    }
}

export const updateEvent = async (formData) => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.eventUpdate, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in Update event", error)
    }
}

export const deleteEvent = async (eventId) => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.eventDelete + eventId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in delete event", error)
    }
}

//get years
export const getYears = async () => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.getYear, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Parse the JSON response only if the request was successful
        const apiResponse = await response.json();
        return apiResponse;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};


export const getEventRelease = async (body) => {
    try {
        const token = getToken()
        // console.log("Request body in fetchNominees:");
        const response = await fetch(API_URL.getEventRelese, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in fetchNominees:", error);
    }
}
export const AddEventRelease = async (body) => {
    try {
        const token = getToken()
        console.log("Request body in Relese:",body);
        const response = await fetch(API_URL.AddEventRelese, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in fetchNominees:", error);
    }
}