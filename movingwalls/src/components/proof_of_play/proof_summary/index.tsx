import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";
import '../proof_summary/index.css';
import { PROOF_OF_PLAY, PROOF_OF_PLAY_ASSERTS } from "../../../Graphql/Queries";
import { format } from "date-fns";

interface ProofOfPlay {
    id: string;
    name: string;
    dealId: string;
    dsp: string;
    bookingSource: string;
}
interface Proof_of_play_summaryProps {
    campaignId: string;
}
const Proof_of_play_summary: React.FC<Proof_of_play_summaryProps> = ({ campaignId }) => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const companyId = process.env.REACT_APP_COMPANY_ID;
    const [proofValues, setProofValues] = useState<ProofOfPlay | null>(null);
    const [duration, setDuration] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const [id, setId] = useState('');

    const location = useLocation();
    const userData = location.state;



    const locations = useLocation();
    const storedProofData = localStorage.getItem('proofData') ? JSON.parse(localStorage.getItem('proofData')!) : null;
    const { proofData } = locations?.state || storedProofData || {};


    useEffect(() => {
        if (proofData) {
            setStartDate(new Date(proofData?.startDate));
            setEndDate(new Date(proofData?.endDate));
        }
    }, [proofData]);



    // Function to calculate the total number of days between two dates
    const calculateDaysDifference = (start: string, end: string): number => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const timeDifference = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
    };

    // Proof Of Play Asserts Api
    const { data: assertsData, loading: assertsLoading, error: assertsError } = useQuery(PROOF_OF_PLAY_ASSERTS, {
        variables: {
            accessToken: token,
            metadataCampaignId: campaignId,
            metadataMediaOwnerId: userId,
            metadataType: "LMX_POC",
            source: "LMX_COMMERCE",
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            page: 0,
            size: 8,
            sort: "lastModifiedDate,desc",
            billboardId: ""
        }
    });

    useEffect(() => {
        if (assertsData && userData) {
            const proofOfPlayAssets = assertsData.proofOfPlayAssets;

            if (proofOfPlayAssets && proofOfPlayAssets.length > 0) {
                const matchingAssets = proofOfPlayAssets.filter((asset: any) => {
                    return asset.inventoryId === userData.newInventoryId; // Corrected filtering logic
                });

                if (matchingAssets.length > 0) {
                    const assetDurations = matchingAssets.map((asset: { duration: number; }) =>
                        asset.duration ? `${asset.duration.toFixed(2)}` : "N/A"
                    );
                    // setDuration(assetDurations.join(", "));
                }
            }
        }
    }, [assertsLoading, assertsData, userData]);


    // Proof Of Play Api
    const { data, loading, error, refetch: refetch } = useQuery(PROOF_OF_PLAY, {
        variables: {
            accessToken: token,
            page: 0,
            campaignId: campaignId,
            metadataType: "LMX_POCLMX_COMMERCE",
            metadataCampaignId: campaignId,
            metadataMediaOwnerId: companyId,
            source: "LMX_COMMERCE",
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
            size: 8,
            sort: "lastModifiedDate,desc",
        },
        skip: !token || !userId || !companyId,
    });



    useEffect(() => {
        if (!loading) {
            if (error) {
                console.error("Error fetching proof of play:", error);
                return;
            }

            if (data && data?.proofOfPlay) {

                const campaignStartDate = data.proofOfPlay.startDate.date;
                const campaignEndDate = data.proofOfPlay.endDate.date;

                setStartDate(new Date(campaignStartDate) || proofData?.startDate || new Date());
                setEndDate(new Date(campaignEndDate) || proofData?.endDate || new Date());

                const campaignDuration = calculateDaysDifference(campaignStartDate, campaignEndDate);
                setDuration(campaignDuration.toString());

                // Store fetched proofOfPlay in state
                setProofValues(data.proofOfPlay);

            }
        }
        refetch()

    }, [data, loading, error, refetch]);

    // Display proofValues state to debug


    // Render loading spinner if either query is still loading
    if (loading || assertsLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                <span className="loading-circle sp1">
                    <span className="loading-circle sp2">
                        <span className="loading-circle sp3"></span>
                    </span>
                </span>
            </div>
        );
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <h2 className="proof-header">Campaign creatives</h2>
                <div className="row mb-4">
                    <div className="col-md-2">
                        <p className="proof-header-1">Campaign name</p>
                        <p className="proof-data-1">{proofValues?.name || "No name available"}</p>
                    </div>
                    <div className="col-md-3">
                        <p className="proof-header-1">Deal ID</p>
                        <p className="proof-data-1">{proofValues?.dealId}</p>
                    </div>
                    <div className="col-md-2">
                        <p className="proof-header-1">Duration</p>
                        <p className="proof-data-1">{duration || "N/A"} Days</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Proof_of_play_summary;
