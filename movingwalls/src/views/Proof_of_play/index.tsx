import React, { Component } from "react";
import AuthLayout from "../../layouts/auth";
import { Link, Navigate, useLocation } from "react-router-dom";
import BackIcon from "../../assets/images/back-icon.svg";
import '../Proof_of_play/index.css';

import Proof_of_play_summary from "../../components/proof_of_play/proof_summary";
import Proof_of_play_date from "../../components/proof_of_play/proof_date";

interface FormState {
    redirect: string | null,
}
const Proof_of_play: React.FC = () => {
    const location = useLocation();
    const { campaignId } = location.state as { campaignId: string };
    const [redirect, setRedirect] = React.useState<string | null>(null);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <AuthLayout>
            <>
                <div className="light-skyblue">

                    <div className="container">
                        <div className="mt-2">
                            <div className="navbar-back-btn"><img alt="" src={BackIcon} /><Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}> Back</Link></div>
                        </div>

                        <div className="card border-0 proof-card-main">
                            <Proof_of_play_summary campaignId={campaignId} />

                            <div className="row mb-4 proof-con-2">
                                <Proof_of_play_date campaignId={campaignId} />
                            </div>
                        </div>
                    </div>
                </div>

            </>
        </AuthLayout>
    );
}

export default Proof_of_play;
