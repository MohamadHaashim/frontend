import React, { useEffect, useState } from "react";
import { getCampaign } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactSearchBox from "react-search-box";
import {
    createRule,
    getRuleConditions,
    updateRule,
} from "../../../../api-wrapper/rule-wrapper/ApiRules";
import CampaignSearch from '../campaignSearch/CampaignSearch';
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
    const [excelSelected, setExcelSelected] = useState([]);

    // campaign list //


    const submitHandler = () => {
        dispatch(handleLoader(true));
        const concatenatedArray = allIds;
        const newArray = concatenatedArray.map((element) => String(element));

        let data = {
            campaignIds:newArray
        };

        updateRule(assignId, data)
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

    const CancelHandler = () => {
        setCampaignModal(false);
        getRules();
    }
    return (
        <div>
            <CampaignSearch
                selectedCampagin={selectedCampagin}
                assignId={assignId}
                campaignIds={campaignIds}
                getRules={getRules}
                setCampaignModal={setCampaignModal}
                allIds={allIds}
                setAllIds={setAllIds}
                excelSelected={excelSelected}
                setExcelSelected={setExcelSelected}
            />
            <div className="row">
                <div className="col-12 mb-3 d-flex justify-content-center ">
                    <button
                        className="btn cancel col-3 m-2"
                        type="button"
                        onClick={() => CancelHandler()}
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
