import API_EP_BOOK from "../endpoints";
import API from "../api";

const getMetaAPIEP= API_EP_BOOK.GET_METADATA_API_EP;
const MasterAPI = {
  getMetaData: function(){
    const getResponse = API(getMetaAPIEP);
    console.log("Get Rules Metadata: ", getResponse);
    return getResponse;
  }
}
export default MasterAPI;