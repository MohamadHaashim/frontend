import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import BackIcon from "../../assets/images/back-icon.svg";
import './index.css';
import InvoiceDownload from "../../components/invoice/invoice-download";
import InvoiceTable from "../../components/invoice/invoice-table";
import generatePDF from 'react-to-pdf';


const Invoice: React.FC<{ currencyCode: string }> = ({ currencyCode }) => {
  const [localCurrencyCode, setLocalCurrencyCode] = useState(currencyCode || "");
  useEffect(() => {
    if (!currencyCode) {
      const storedCurrencyCode = localStorage.getItem("currencyCode");
      if (storedCurrencyCode) {
        setLocalCurrencyCode(storedCurrencyCode);
      }
    }
  }, [currencyCode]);
  let storedCurrencyCodes = localStorage.getItem("currencyCode");
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const [config, setConfig] = useState<any[]>([]);
  const location = useLocation();
  const campaignId = location.state?.campaignId;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/configJson.json?t=${new Date().getTime()};`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "Terms & conditions");
        setConfig(value.configurations || []);
      } catch (error) {
        console.error("Error fetching config data:", error);
      }
    };

    fetchConfig();
  }, []);

  const [content, setContent] = useState<any[]>([]);
  const [termss, setTerms] = useState<string>("");
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.PUBLIC_URL}/json/contentJson.json`);
        const data = await response.json();
        const value = data.find((page: any) => page.name === "Landing Page");
        setContent(value.fields);

        const values = data.find((page: any) => page.name === "Terms & conditions");
        const termLen = (values.fields[0].components[0].components).length;
        for (let i = 0; i < termLen; i++) {
          if ('key' in values.fields[0].components[0].components[i]) {
            if (values.fields[0].components[0].components[i].key === "terms_conditionsDocument") {
              if ((values.fields[0].components[0].components[i].defaultValue).length > 0) {
                setTerms(values.fields[0].components[0].components[i].defaultValue[0].data.text)
                break;
              }
            }
            else {
              if (values.fields[0].components[0].components[i].key === "TermsText") {
                setTerms(values.fields[0].components[0].components[i].defaultValue)
              }
            }
          }
        }

      } catch (error) {
      }
    };

    fetchContent();
  }, []);


  const isFieldEnabled = (key: string) => {
    const fieldConfig = config.find((field: any) => field.key === key);
    return fieldConfig ? fieldConfig.default : true;
  };

  // Function to download PDF
  const downloadPDF = (filename: string) => {
    if (pdfRef.current) {
      generatePDF(() => pdfRef.current, { filename });
    }
  };

  return (
    <AuthLayout>
      <div className="invoice-full-content">
        <div className="container">
          <div className="mt-4">
            <div className="navbar-back-btn">
              <img alt="Back" src={BackIcon} />
              <Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}> Back</Link>
            </div>
          </div>
          <div className="card card-bottom" ref={pdfRef}>
            <h4 className="invoice-header">Invoice</h4>
            {/* <button onClick={() => downloadPDF('invoice.pdf')} aria-label="Download invoice as PDF">
            Download PDF  
          </button> */}
            <InvoiceDownload
              campaignId={campaignId}
              currencyCode={localCurrencyCode || storedCurrencyCodes}
              downloadPDF={downloadPDF}
            />
            <InvoiceTable campaignId={campaignId} currencyCode={localCurrencyCode || storedCurrencyCodes} />
            <div className="row invoice-table-right">
              {isFieldEnabled("payment invoice") && (
                <div className="col-md-12 invoice-full-page-right-side terms">
                  <h4 className="terms-condtions ">Terms  &  conditions </h4>
                  <p className="terms-para">
                    {termss}
                  </p>
                  {/* <p className="terms-para">
                    By accepting this agreement, the advertiser (the Advertiser”) agrees to be bound by the terms of this agreement.
                  </p> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Invoice;
