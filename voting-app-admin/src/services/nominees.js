import React from 'react'
import { API_URL } from './api-endpoints'

const getToken = () =>{
    const token = localStorage.getItem('token');
    if(token){
      return token
    }
}

// Add Nominee
export const addNominee = async (formData) => {
    try {
        const token = getToken()
        console.log("token in add nominee", token)
        const response = await fetch(API_URL.nomineeAdd, {
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

export const fetchNominees = async (body) => {
    try {
        const token = getToken()
        console.log("Request body in fetchNominees:", body);
        const response = await fetch(API_URL.nomineeList, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"  
            },
            body: JSON.stringify(body)
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in fetchNominees:", error);
    }
}
export const fetchVoiting = async (body) => {
    try {
        const token = getToken()
        console.log("Request body in fetchNominees:", body);
        const response = await fetch(API_URL.votingList, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"  
            },
            body: JSON.stringify(body)
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in fetchNominees:", error);
    }
}


// Update Nominee
export const updateNominee = async (formData) => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.nomineeUpdate, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in Update nominee", error)
    }
}

// Delete Nominee
export const deleteNominee = async (nomineeId) => {
    try {
        const token = getToken()
        const response = await fetch(API_URL.nomineeDelete + nomineeId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in delete nominee", error)
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
