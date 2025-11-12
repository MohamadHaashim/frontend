import React, { Component, useEffect } from "react";
import AuthLayout from "../../layouts/auth";
import { Link, Navigate, useLocation } from "react-router-dom";
import BackIcon from "../../assets/images/back-icon.svg";
import './index.css';
import Assign_creative_summary from "../../components/assign_creative/summary";
import Assign_creative_list from "../../components/assign_creative/list";


interface FormState {
    redirect: string | null;
    searchs: string;
}
const getCampaignId = (location: any) => {
    const campaignIdFromState = location.state?.campaignId || localStorage.getItem("selectedCampaignId");
    return campaignIdFromState || '';
};
const getInventoryIds = (location: any) => {
    const inventoryIdsFromState = location.state?.inventoryIds || localStorage.getItem("inventoryIds");
    if (inventoryIdsFromState && typeof inventoryIdsFromState === 'string') {
        try {
            return JSON.parse(inventoryIdsFromState);
        } catch (e) {
            console.error('Error parsing inventoryIds from localStorage', e);
            return [];
        }
    }

    return inventoryIdsFromState || [];
};
const Assign_creative: React.FC = () => {
    const location = useLocation();
    // const { campaignId, inventoryIds } = location.state as { campaignId: string; inventoryIds: string[] };
    const [redirect, setRedirect] = React.useState<string | null>(null);
    // const campaignId = location.state?.campaignId || ''; // Fallback to empty string if undefined
    // const inventoryIds = location.state?.inventoryIds || [];
    const [searchs, setSearchs] = React.useState("");
    const handleSearchChange = (searchTerm: string) => {
        setSearchs(searchTerm);
    };
    const campaignId = getCampaignId(location);
    const inventoryIds = getInventoryIds(location);
    useEffect(() => {
        if (campaignId) {
            localStorage.setItem("selectedCampaignId", campaignId);
        }
        if (inventoryIds && inventoryIds.length > 0) {
            const inventoryIdsJson = JSON.stringify(inventoryIds);
            localStorage.setItem("inventoryIds", inventoryIdsJson);
        }
    }, [campaignId, inventoryIds]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <AuthLayout>
            <>
                <div className="assign-creative-light-skyblue">

                    <div className="container">
                        <div className="mt-2">
                            <div className="navbar-back-btn"><img alt="" src={BackIcon} /><Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}> Back</Link></div>
                        </div>
                        <div className="card border-0 assign_creative_card">
                            <Assign_creative_summary setSearchs={setSearchs} campaignId={campaignId} />
                            <Assign_creative_list searchs={searchs} campaignId={campaignId} inventoryIds={inventoryIds} />
                        </div>
                    </div>
                </div>

            </>
        </AuthLayout>
    );
}

export default Assign_creative;
