import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import usLogo from "../../../assets/images/icons/US.svg";
import canadaLogo from "../../../assets/images/icons/canada.svg";
import ukLogo from "../../../assets/images/icons/united-kingdom.svg";
import ITlogo from "../../../assets/flags/IT.png";
import ESlogo from "../../../assets/flags/ES.png";
import DElogo from "../../../assets/flags/DE.png";
import FRlogo from "../../../assets/flags/FR.png";
import AUlogo from "../../../assets/flags/AU.png";
import AElogo from "../../../assets/flags/AE.png";
import BRlogo from "../../../assets/flags/BR.png";
import EGlogo from "../../../assets/flags/EG.png";
import GBlogo from "../../../assets/flags/GB.png";
import INlogo from "../../../assets/flags/IN.png";
import JPlogo from "../../../assets/flags/JP.jpg";
import MXlogo from "../../../assets/flags/MX.png";
import NLlogo from "../../../assets/flags/NL.png";
import SElogo from "../../../assets/flags/SE.png";
import SGlogo from "../../../assets/flags/SG.png";
import PLlogo from "../../../assets/flags/PL.png";
import TRlogo from "../../../assets/flags/TR.png";
const columns: GridColDef[] = [
  {
    field: "contryLogo",
    headerName: "",
    width: 50,

    renderCell: (params) => (
      <img
        src={params.row.contryLogo}
        alt=""
        style={{ width: 30, height: 30, borderRadius: 50 }}
      />
    ),
  },
  { field: "country", headerName: "Country", width: 250 },
  { field: "id", headerName: "ID", width: 250 },
  { field: "types", headerName: "Type", width: 250 },
  {
    field: "dataConnections",
    headerName: "Data Connection",
    width: 250,
    renderCell: (params) => (
      <div className="form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id={`flexSwitchCheckChecked_${params.row.id}`}
          checked={params.row.dataConnections}
          readOnly
        />
      </div>
    ),
  },
];

const AmazonConnectionTable = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let userToken = localStorage.getItem("userToken");
      let AuthToken = "Bearer " + userToken;
      try {
        const response = await fetch("https://api.aimosa.io/AmazonConnection", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthToken,
          },
        });

        const data = await response.json();

        const formattedRows = data.result.map((item) => ({
          id: item.id,
          contryLogo: getCountryLogo(item.marketplace),
          country: item.marketplace,
          types: item.type,
          dataConnections: item.dataConnections,
        }));

        setRows(formattedRows);
        console.log(formattedRows.length);
      } catch (error) {
        console.error("Error fetching Amazon Connection data:", error);
      }
    };

    fetchData();
  }, []);

  const getCountryLogo = (country) => {
    switch (country) {
      case "CA":
        return canadaLogo;
      case "US":
        return usLogo;
      case "UK":
        return ukLogo;
      case "IT":
        return ITlogo;
      case "ES":
        return ESlogo;
      case "DE":
        return DElogo;
      case "FR":
        return FRlogo;
      case "AU":
        return AUlogo;
      case "AE":
        return AElogo;
      case "BR":
        return BRlogo;
      case "EG":
        return EGlogo;
      case "GB":
        return GBlogo;
      case "IN":
        return INlogo;
      case "JP":
        return JPlogo;
      case "MX":
        return MXlogo;
      case "NL":
        return NLlogo;
      case "SE":
        return SElogo;
      case "SG":
        return SGlogo;
      case "PL":
        return PLlogo;
      case "TR":
        return TRlogo;
      default:
        return null;
    }
  };
  return (
    <div
      style={{
        height: 250,
        width: "100%",
        border: "1px solid #E5E7EB",
        borderRadius: "6px",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        checkboxSelection={false}
        hideFooter={true}
        rowHeight={50}
      />
    </div>
  );
};

export default AmazonConnectionTable;
