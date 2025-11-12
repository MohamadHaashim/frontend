const baseURL = "https://";
const API: any = async (
  requestURL: any, requestAPIData: any
) => {
  let APIENDPOINT = baseURL + requestURL.url;

  if (requestAPIData && requestAPIData.getData) {
    for (var key in requestAPIData.getData) {
    }
  }
  const headersData: any = {
    "Content-Type": "application/json",
  }
  if (requestURL.authorization) {
    headersData["Authorization"] = "Bearer " + localStorage.getItem("userToken");
  }

  const requestAPIHeader: any = {
    method: requestURL.method,
    headers: headersData
  }
  if (requestURL.method !== "GET") {
    requestAPIHeader["body"] = JSON.stringify(requestAPIData.bodyData);
  }

  const response = await fetch(
    APIENDPOINT,
    requestAPIHeader
  );
  try {
    const responceData = await response.json();
    return responceData.result;
  } catch (error) {
  }
};

export default API;