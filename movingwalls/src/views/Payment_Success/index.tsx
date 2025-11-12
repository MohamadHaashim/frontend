import React, { Component, useEffect, useState } from "react";
import DefaultLayout from "../../layouts/default";
import { Link, Navigate } from "react-router-dom";
import './index.css'
import { UPDATESTATUSMUTATION } from "../../Graphql/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
interface FormState {
  redirect: string | null,
}
const Payment_Success: React.FC = () => {


  const [redirect, setRedirect] = useState(false);

  const [url, setUrl] = useState<string>('');



  const backMycampaign = () => {
    setRedirect(true);
  };

  useEffect(() => {
    // Extract the campaign ID from the URL
    const queryParams = window.location.pathname;
    const myArray = queryParams.split("/");

    const campaignId = myArray[2]?.split("=")[1]; // Check if split[2] exists
    if (campaignId) {
      setUrl(campaignId); // Store the ID in the state if valid
    }

  }, []);

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  const [updateCampaignStatus, { data, loading, error }] = useMutation(UPDATESTATUSMUTATION);

  useEffect(() => {
    if (url && token) {
      const handleUpdateStatus = async () => {
        const campaignStatus = "APPROVED";  // Ensure this is always a valid string

        // Debugging: Log campaignStatus to see what value is being passed

        if (!campaignStatus) {
          console.error("Error: campaignStatus is null or undefined.");
          return;
        }

        try {
          const response = await updateCampaignStatus({
            variables: {
              accessToken: token,
              campaignId: url,
              reasonForRejection: "",
              campaignStatus: campaignStatus,
            },
          });

          if (response.data?.updateCampaignStatus?.success) {
            toast.success(response.data.updateCampaignStatus.message);
          } else {
            console.error("Error: Mutation did not return success.");
          }
        } catch (err) {
          console.error("Mutation error:", err);
          toast.error("An error occurred while updating campaign status.");
        }
      };

      handleUpdateStatus(); // Trigger the mutation only after URL and token are available
    }
  }, [url, token, updateCampaignStatus]);

  // This will run when `data` is updated

  if (redirect) {
    return <Navigate to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`} />;
  }


  return (
    <DefaultLayout>
      <div>
        <div className="container">
          <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
            <div className="container">

              <div className="row justify-content-center ">


                <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                  <div className="card">

                    <i className="fa-regular fa-credit-card credit-card"></i>

                    <h6 className="payment-letter">


                      Payment successful !

                    </h6>
                    <h6 className="payment-letters"> Thank you for making the payment</h6>

                    <div className="modal-footer proceedconfirm-footer proceedconfirm-footers d-flex justify-content-center w-100">

                      <button type="button" onClick={backMycampaign} className="term-submit"  >Back to Property listing page</button>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
}

export default Payment_Success;
