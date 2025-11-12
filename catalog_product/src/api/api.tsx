export const baseURL = "http://192.168.0.101/catalog_management/api/";
// export const baseURL = "https://dfc2a64ef4cb.ngrok-free.app/catalog_management/api/";
// export const baseURL = "https://crm.bizconvo.in/be/api/";


const API: any = async (requestURL: any, requestAPIData: any) => {
  let APIENDPOINT = baseURL + requestURL.url;

  const headersData: Record<string, string> = {};

  if (requestURL.authorization) {
    let token = "";
    const path = window.location.pathname;

  if (path.startsWith("/vendor")) {
    token = sessionStorage.getItem("vendorToken") || "";
  } else if (path.startsWith("/super-admin")) {
    token = localStorage.getItem("superAdminToken") || "";
  }
  headersData["Authorization"] = "Bearer " + token;
  }

  const requestAPIHeader: {
    method: string;
    headers: Record<string, string>;
    body?: FormData | string;
  } = {
    method: requestURL.method,
    headers: headersData,
  };

  if (requestURL.method !== "GET" && requestURL.method !== "DELETE") {
    if (requestAPIData.bodyData instanceof FormData) {
      requestAPIHeader.body = requestAPIData.bodyData;
    } else {
      headersData["Content-Type"] = "application/json";
      // headersData["ngrok-skip-browser-warning"]= "true";
      requestAPIHeader.body = JSON.stringify(requestAPIData.bodyData);
    }
  }

  try {
    const response = await fetch(APIENDPOINT, requestAPIHeader);
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      return await response.blob();
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
  
};

export default API;
