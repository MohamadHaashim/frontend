import React, { useEffect, useState } from "react";
import DownloadImage from "../../../assets/images/group-212841535.svg";
import { Link, Navigate, useLocation } from "react-router-dom";
import { INVOICE } from "../../../Graphql/Queries";
import { useQuery } from "@apollo/client";
import './index.css'

const InvoiceDownload: React.FC<{ campaignId: string; downloadPDF: (filename: string) => void; currencyCode: any }> = ({ campaignId, downloadPDF, currencyCode }) => {
  const token = localStorage.getItem('authToken');
  const selectedCampaignId = localStorage.getItem('selectedCampaignId');
  const [currecyCodeValue, setCurrencyCodeValue] = useState('')


  const { loading, error, data } = useQuery(INVOICE, {
    variables: {
      accessToken: token,
      campId: campaignId,
    },
  });

  const invoice = data?.paymentInvoice;
  const location = useLocation();
  const formData = location.state;

  useEffect(() => {
    if (invoice && invoice.priceSummary) {
      setCurrencyCodeValue(currencyCode);
    }
  }, [invoice]);



  if (loading) {
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


  if (!invoice) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h5>No data found</h5>
      </div>
    );
  }







  return (
    <div id="printable-area" className="row">
      <div className="col-md-8 invoice-full-page-right-side">
        <div className="row">
          <div className="col-md-4">
            <p className="deal-name">Deal name</p>
            <h6 className="deal-name-value">{invoice.name || 'N/A'}</h6>
          </div>
          <div className="col-md-4">
            <p className="deal-name">Date</p>
            <h6 className="deal-name-value">{new Date(invoice?.startDate?.dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(invoice?.endDate?.dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h6>
          </div>
          <div className="col-md-4 download-btn">

            <button onClick={() => downloadPDF('invoice.pdf')} aria-label="Download invoice PDF">
              <img className="invoice-download-icon" alt="Download invoice" src={DownloadImage} />
              Download invoice
            </button>
          </div>
          <div className="col-md-4 created-by-top">
            <p className="deal-name">Created by</p>
            <h6 className="deal-name-value">{invoice?.user?.name || 'N/A'}</h6>
          </div>
          <div className="col-md-4 created-by-top">
            <p className="deal-name">Deal ID</p>
            <h6 className="deal-name-value">{invoice.dealId || 'N/A'}</h6>
          </div>
        </div>
        <div className="invoice-frame-underline"></div>
        <div className="invoice-frame-vrtical-underline"></div>
      </div>

      <div className="col-md-4">
        <div className="row">
          <div className="col-md-7">
            <p className="price-detail">Price details</p>
            <h6 className="price-value">{invoice?.priceSummary?.currency?.code || currencyCode} {invoice?.priceSummary?.netTotal}</h6>
          </div>
          <div className="col-md-5">
            <h5 className="grand-total">GRAND TOTAL</h5>
          </div>
          <div className="grand-total-frame-underline"></div>
          <div className="col-md-7 bg-color">
            <p className="sub-total">Sub-total</p>
            <p className="sub-total">{invoice?.priceSummary?.tax?.name}({invoice?.priceSummary?.tax?.percent}%)</p>
          </div>
          <div className="col-md-5 bg-color">
            <p className="aud-value">
              <span className="aud-value-left">{invoice?.priceSummary?.currency?.code || currencyCode} </span>
              <span className="single-line">{invoice?.priceSummary?.subTotal.toFixed(2)}</span>
            </p>
            <p className="aud-value">
              <span className="aud-value-left">{invoice?.priceSummary?.currency?.code || currencyCode} </span>
              <span className="single-line">{invoice?.priceSummary?.tax?.value.toFixed(2)}</span>
            </p>
          </div>

          <div className="sub-total-frame-underline"></div>
        </div>
      </div>


    </div>
  );
}

export default InvoiceDownload;
