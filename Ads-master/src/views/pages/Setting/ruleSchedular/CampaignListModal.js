import React, { useEffect, useState } from "react";
import { getCampaign } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSearchBox from "react-search-box";
import { APIupdateRule, } from "../../../../api-wrapper/ruleScheduler-wrapper/ApiRuleScheduler";
import CampaignSearch from '../campaignSearch/CampaignSearch';
import RuleSearch from './RuleSearch';
function CampaignListModal({
    campaignIds,
    assignId,
    selectedCampagin,
    getRules,
    setCampaignModal,
    timingFlag,
   
}) {
    const dispatch = useDispatch();
    const [allIds, setAllIds] = useState([]);

    
    // campaign list //

    const submitHandler = () => {
        
        dispatch(handleLoader(true));
        let data = {
            ruleIds: allIds,
        };

        APIupdateRule(assignId, data)
            .then((res) => {
                if (res.isSuccess) {
                    dispatch(handleLoader(false));
                    toast.success(res.message);
                    getRules();
                } else {
                    dispatch(handleLoader(false));
                    toast.error(res.message);
                }
            })
            .catch((err) => {
                dispatch(handleLoader(false));
                toast.error(err);
            });
        setCampaignModal(false);
    };

    const cancelHandler = () => {
        setCampaignModal(false);
        getRules();
    }

    return (
        <div>
            <RuleSearch
                selectedCampagin={selectedCampagin}
                assignId={assignId}
                campaignIds={campaignIds}
                getRules={getRules}
                setCampaignModal={setCampaignModal}
                allIds={allIds}
                setAllIds={setAllIds}
            />
            <div className="row">
                <div className="col-12 mb-3 d-flex justify-content-center ">
                    <button
                        className="btn cancel col-3 m-2"
                        type="button"
                        onClick={() => cancelHandler()}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn save col-3 m-2"
                        type="submit"
                        onClick={() => submitHandler()}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>

    );
}

export default CampaignListModal;
