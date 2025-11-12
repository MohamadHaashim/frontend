import { API_URL } from './api-endpoints'

const getToken = () =>{
  const token = localStorage.getItem('token');
  if(token){
    return token
  }
} 
export const addCategory = async (formData) => {
    try {

        const token = getToken();
        console.log("token in add cateogry", token)
        const response = await fetch(API_URL.categoryAdd, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const apiResponse = await response.json();
        return apiResponse;
    } catch (error) {
        console.log("Error in category add:", error)
    }
}

export const fetchCategories = async (body) => {
    try {

      const token = getToken()
        console.log("body in fetch catsse", body)
        console.log("Token in category service", token)

        const response = await fetch(API_URL.categoryList, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body)
        })
        const responseData = await response.json()
        return responseData
    } catch (error) {
        console.log("Error in fetch category", error)
    }
}

export const updateCategory = async (formData) => {
    try {
      const token = getToken()
        const response = await fetch(API_URL.categoryUpdate, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        const responseData = await response.json()
        return responseData;
    } catch (error) {
        console.log("Error in Update category", error)
    }
}

export const deleteCategory = async (categoryId) => {
    try {
      const token = getToken()
        const response = await fetch(API_URL.categoryDelete + categoryId, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.log("Error in delete category", error)
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

export const fetchcategoryfilter = async (body) => {
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