import React from "react";
import axios from "axios";

const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
const MarketplaceIds = localStorage.getItem("MarketplaceIds");
const timestamp = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replaceAll(".", "");

function Sales() {
  const [responseDiv, setResponseDiv] = React.useState("");
  const OrderStatuses = "Unshipped";
  const LastUpdatedAfter = "2022-10-01T16:42:18";
  const requestUrl = `https://sellingpartnerapi-eu.amazon.com/orders/v0/orders?MarketplaceIds=${MarketplaceIds}&OrderStatuses=${OrderStatuses}&LastUpdatedAfter=${LastUpdatedAfter}`;

  React.useEffect(() => {
    
    var data = JSON.stringify({
      "url": requestUrl,
      "access_key": spAtzAccessToken,
      "request_type": "GET",
      "body": ""
    });
    
    var config = {
      method: 'post',
    maxBodyLength: Infinity,
      url: 'https://api.agilensmart.com/api/fetch-amazon-api',
      headers: { 
        'Authorization': BearerAlizonAccessToken, 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      console.log(response.data.payload.Orders);
    })
    .catch(function (error) {
      console.log(error);
    });

  }, []);

  return <div> {responseDiv} </div>;
}

export default Sales;
