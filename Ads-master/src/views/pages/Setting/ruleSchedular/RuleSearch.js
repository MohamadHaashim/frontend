import React, { useEffect, useState } from "react";
import { getCampaign } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { APIgetRule } from '../../../../api-wrapper/ruleScheduler-wrapper/ApiRuleScheduler';
function RuleSearch({
    campaignIds,
    selectedCampagin,
    allIds,
    setAllIds
}) {

    const dispatch = useDispatch();
    // campaign list //

    const [campaignList, setCampaignList] = useState([]);
    const [searchData, setSearchData] = useState([]);

    useEffect(() => {
        let arr = [];
        dispatch(handleLoader(true));
        APIgetRule(selectedCampagin?.profileId)
            .then((res) => {
                if (res.isSuccess) {
                    dispatch(handleLoader(false));
                    setCampaignList(res.data);

                    if (res.data.length == campaignIds?.length) {
                        setselectAllCheck(true);
                    } else {
                        setselectAllCheck(false);
                    }
                    res.data.map((el) => {
                        arr.push({
                            _id: el._id,
                            ruleName: el.ruleName,

                        });
                    });
                } else {
                    dispatch(handleLoader(false));
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                dispatch(handleLoader(false));
                toast.error(err);
            });
        setSearchData(arr);
    }, []);

    const campaignHandler = (e, id, index) => {

        let arr = allIds ? [...allIds] : []
        if (e.target.checked) {
            arr.push(id);

            const selectedCampaignIds = arr?.filter((id) =>
                searchData.some((campaign) => campaign.campaignId === id)
            );
            if (searchData.length != 0) {
                setselectAllCheck(selectedCampaignIds?.length === searchData?.length);
            }
        } else {
            arr = allIds.filter((x) => x != id);
            const selectedCampaignIds = arr?.filter((id) =>
                searchData?.some((campaign) => campaign.campaignId === id)
            );
            if (searchData.length != 0) {
                setselectAllCheck(selectedCampaignIds?.length === searchData?.length);
            }
        }
        setAllIds(arr);
    };

    //select all //
    const [selectAllCheck, setselectAllCheck] = useState();

    const selectAllHandler = (e) => {
        let arr = allIds || [];
        if (e.target.checked) {
            setselectAllCheck(true);

            searchData.forEach((el) => {
                arr.push(el._id);
            });
            const uniqueArray = [...new Set(arr)];
            setAllIds(uniqueArray);
        } else {
            setselectAllCheck(false);
            setAllIds((prevIds) =>
                prevIds?.filter(
                    (id) => !searchData.map((el) => el._id).includes(id)
                )
            );
        }
    };

    const [searchString, setsearchString] = useState("");


    const handleChange = (e) => {
        
        const searchString = e.target.value.trim().toLowerCase();
        setsearchString(e.target.value);

        if (searchString !== "") {
            const filteredData = campaignList?.filter((l) =>
                l.ruleName.toLowerCase().includes(searchString)
            );
            setSearchData(filteredData);

                if(filteredData.length != 0){
                    const selectedCampaignIds = allIds?.filter((id) =>
                    filteredData.some((campaign) =>
                        campaign._id.toString().toLowerCase().includes(id.toString().toLowerCase())
                    )
                );
                if (filteredData?.length !== 0) {
                    setselectAllCheck(selectedCampaignIds?.length === filteredData?.length);
                }
                }
                else{
                    if (filteredData?.length !== 0) {
                        setselectAllCheck(0 === filteredData?.length);
                    }
                }
        

          
        } else {
            setSearchData(campaignList);
            setselectAllCheck(allIds?.length === campaignList?.length);
        }
    };

    useEffect(() => {
        setAllIds(campaignIds);
    }, [campaignIds]);

    return (
        <>
            <div className="campaginlist_modal mb-4">
                <div className="row col-11  mt-3 mb-3 inner_campaign">
                    <div className="col-3 ps-0">
                        <input
                            type="checkbox"
                            className="me-2 ms-1"
                            value={selectAllCheck}
                            checked={selectAllCheck}
                            onChange={(e) => selectAllHandler(e)}
                        />
                        <label>
                            <b> All Select</b>
                        </label>
                    </div>

                    <div className="col-5">
                        <label className="me-2">
                            <b>Search:</b>
                        </label>
                        <input
                            type="text"
                            className="input_role"
                            value={searchString}
                            onChange={(e) => handleChange(e)}
                            placeholder="Type here"
                        />
                    </div>
                    <div className="col-3 d-flex align-items-center">
                        <label className="me-2">
                            <b>Selected:</b>
                        </label>
                        <p className="m-0">{allIds?.length || 0}</p>
                    </div>
                </div>

                <div className="row col-11 campaign_list">
                    {searchData.length == 0 ? (
                        <p className="text-center"> Data Not Found !!</p>
                    ) : (
                        searchData?.map((el, index) => {
                            
                            return (
                                <React.Fragment key={index}>
                                    <div className="col-1 pb-2" style={{ cursor: "pointer" }}>
                                        <input
                                            type="checkbox"
                                            value={allIds?.includes(el._id)}
                                            checked={allIds?.includes(el._id)}
                                            className="input_rule"
                                            onChange={(e) => campaignHandler(e, el?._id, index)}
                                        />
                                    </div>
                                    <div className="col-5 pb-2">
                                        <label>{el.ruleName} </label>
                                    </div>
                                </React.Fragment>
                            );
                        })
                    )}
                </div>


            </div>
        </>
    )
}

export default RuleSearch