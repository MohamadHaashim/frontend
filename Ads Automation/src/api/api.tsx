const baseURL =   "https://api.aimosa.io";
const API: any = async (
  requestURL, requestAPIData
) => {
  let APIENDPOINT = baseURL + requestURL.url;
  
  if(requestAPIData && requestAPIData.getData){
    for (var key in requestAPIData.getData) {
      console.log("Get Data KEY: ",key);
      console.log("Get Data KEY VALUE: ",requestAPIData.getData[key]);
    }
  }
  const headersData = {
    "Content-Type": "application/json",
  }
  if(requestURL.authorization){
    headersData["Authorization"] =  "Bearer " + localStorage.getItem("userToken");
  }

  const requestAPIHeader = {
    method: requestURL.method,
    headers: headersData
  }
  if(requestURL.method !== "GET"){
    requestAPIHeader["body"] =  JSON.stringify(requestAPIData.bodyData);
  }
  
  const response = await fetch( 
    APIENDPOINT, 
    requestAPIHeader
  );
  try {
    const responceData = await response.json();
    return responceData.result;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default API;