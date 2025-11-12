import React from 'react'
import { API_URL } from './api-endpoints'

export const Login = async (email, password) => {
  try {
    const response = await fetch(API_URL.login, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const apiResponse = await response.json();
    return apiResponse
  } catch (error) {
    console.log("Error in login:", error)
  }
}

export const Logout = async (token) => {
  try {
    const response = await fetch(API_URL.logout, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error("Error in logout:", error); 
  }
}
