import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import BillboardLogo from "../../../mailto:assets/images/unsplashv3qhk9rhtju@2x.png";
import './index.css';
import { useQuery } from "@apollo/client";
import { INVOICE } from "../../../Graphql/Queries";
import NoImage from "../../../assets/images/nomedia.jpg";

interface InvoiceTableProps {
  campaignId: string;
  currencyCode: any;
}

interface Billboard {
  priceSummary: any;
  id: number;
  inventoryThumbnailUrl: string | undefined;
  inventoryName: string;
  inventoryType: string;
  negotiationSummary: {
    status: string;
    summaryReport: {
      potentialViews: { toLocaleString: () => string };
      uniqueReach: { toLocaleString: () => string };
    };
    mediaOwnerPreferredPrice: {
      nowPayPrice: any;
      totalPrice: number;
    };
    buyerPreferredPrice: {
      nowPayPrice: any;
      totalPrice: number;
    };
  };
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ campaignId, currencyCode }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  const InvoiceIdDate = location.state;
  const [invoiceId, setInvoiceId] = useState('');
  const [currecyCodeValue, setCurrencyCodeValue] = useState('')

  const { loading, error, data } = useQuery(INVOICE, {
    variables: {
      accessToken: token,
      campId: campaignId,
    },
  });

  const invoice = data?.paymentInvoice;
  const isMatchingCampaign = invoice && invoice?.id;



  useEffect(() => {
    if (invoice && invoice?.priceSummary) {
      setCurrencyCodeValue(currencyCode);
    }
  }, [invoice]);

  const digitalBillboards: Billboard[] = isMatchingCampaign
    ? invoice?.campaignInventories.filter((inventory: Billboard) =>
      inventory?.inventoryType === 'DIGITAL_BILLBOARD' || inventory?.inventoryType === 'digital')
    : [];

  const classicBillboards: Billboard[] = isMatchingCampaign
    ? invoice?.campaignInventories.filter((inventory: Billboard) =>
      inventory?.inventoryType === 'STATIC_BILLBOARD' || inventory.inventoryType === 'CLASSICAL_BILLBOARD' || inventory.inventoryType === 'classic')
    : [];

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

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h5>Error loading invoice: {error.message}</h5>
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
    <>
      <div className="row">
        <div className="col-md-8 invoice-full-page-right-side">
          <div className="row">
            <div className="row">
              <div className="col-md-12">
                <h4 className="billboards">Billboards</h4>
                <h6 className="digital-billboards">Digital Billboards <span className="negosition_header_notification badge">{digitalBillboards.length}</span></h6>
                <div className="invoice-frame-underline-Digital"></div>
              </div>

              <div className="table-scroll">
                <table className="table table-striped">
                  <thead className="table-head">
                    <tr>
                      <th scope="col">Billboard Name</th>

                      <th scope="col">Media</th>
                      <th scope="col">Impressions</th>
                      <th scope="col">Size/Resolution</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {digitalBillboards.length > 0 ? (
                      digitalBillboards.map((item: any) => (
                        <tr key={item.id}>
                          <td>
                            <div className="inventory-item-wrapper">
                              <img
                                src={
                                  item?.inventoryThumbnailUrl &&
                                    item.inventoryThumbnailUrl !== "null" &&
                                    item.inventoryThumbnailUrl.trim() !== ""
                                    ? item.inventoryThumbnailUrl
                                    : NoImage
                                }
                                alt="Campaign Thumbnail"
                                className="invoice-table-img"
                              />

                              <b className="table-Sunnybank">{item?.inventoryName}</b>
                            </div>
                          </td>

                          <td>{item.inventoryType}</td>
                          <td>{item.inventoryReports?.totalPotentialViews || 'N/A'}</td>
                          <td>{item?.inventoryResolutions || 'N/A'}</td>
                          <td>{currecyCodeValue} {item?.inventoryPrice?.toFixed(2) || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr style={{ textAlign: 'center' }}><td colSpan={7}>No billboards found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="invoice-frame-underline"></div>


              <h6 className="digital-billboards">
                Classic Billboards <span className="negosition_header_notification badge">{classicBillboards.length}</span>
              </h6>
              <div className="invoice-frame-underline-Classic"></div>
              <div className="invoice-method-table table-scroll scrollbar">
                <div className="table-wrapper">
                  <table className="table table-striped">
                    <thead className="table-head">
                      <tr>
                        <th scope="col">Billboard Name</th>

                        <th scope="col">Media</th>
                        <th scope="col">Impressions</th>
                        <th scope="col">Size/Resolution</th>
                        <th scope="col">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classicBillboards.length > 0 ? (
                        classicBillboards.map((item: any) => (
                          <tr key={item.id}>
                            <td>
                              <div className="inventory-item-wrapper">
                                <img
                                  src={
                                    item?.inventoryThumbnailUrl &&
                                      item.inventoryThumbnailUrl !== "null" &&
                                      item.inventoryThumbnailUrl.trim() !== ""
                                      ? item.inventoryThumbnailUrl
                                      : NoImage
                                  }
                                  alt="Campaign Thumbnail"
                                  className="invoice-table-img"
                                />
                                <b className="table-Sunnybank">{item?.inventoryName}</b>
                              </div>
                            </td>


                            <td>{item?.inventoryType}</td>
                            <td>{item?.inventoryReports?.totalPotentialViews || 'N/A'}</td>
                            <td>{item?.inventoryResolutions || 'N/A'}</td>
                            <td>{currecyCodeValue} {item?.inventoryPrice && !isNaN(item?.inventoryPrice) ? item?.inventoryPrice.toFixed(2) : 'N/A'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr style={{ textAlign: 'center' }}><td colSpan={7}>No data found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>







              <div className="invoice-frame-underline"></div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="row">
            <div className="col-md-7">
              <p className="price-detail invoice-summary">Invoice Summary</p>
              <h6 className="price-value">Invoice Deal</h6>
            </div>
            <div className="grand-total-frame-underline"></div>
            <div className="col-md-7 bg-color">
              <p className="sub-total">Total Number of Billboards</p>
              <p className="sub-total">Total Number of Impressions</p>
            </div>
            <div className="col-md-5 bg-color">
              <p className="aud-value">{invoice?.campaignInventories?.length}</p>
              <p className="aud-value">
                {invoice?.summaryReport?.potentialViews}
                {/* {/ {invoice.campaignInventories.map((item: any) => item.inventoryReports.totalPotentialViews)|| 'N/A'} /} */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvoiceTable;
