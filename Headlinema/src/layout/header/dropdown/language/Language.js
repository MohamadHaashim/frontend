import React, { useEffect, useState } from "react";
import { DropdownToggle, UncontrolledDropdown } from "reactstrap";
import LangDropdown from "./LangDropdown";
import ReactCountryFlag from "react-country-flag";

function LanguageHead() {

  const [marketplace,setMarketPlace] = useState(localStorage.getItem("SelectedProfileName"));
  const [marketplaceCode,setmarketplaceCode] = useState(localStorage.getItem("SelectedProfileCode"));

  return (
    <UncontrolledDropdown>
      {marketplace !== null &&
      <DropdownToggle
        tag="a"
        href="#toggle"
        onClick={(ev) => ev.preventDefault()}
        className="dropdown-toggle nk-quick-nav-icon"
      >
        <span className="me-2" style={{marginRight:"10px"}}>     
                {marketplaceCode === "UK" ? (
                  <ReactCountryFlag
                    countryCode="GB"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "5px",
                    }}
                    svg
                  />
                ) : (
                  <ReactCountryFlag
                    countryCode={marketplaceCode}
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "5px",
                    }}
                    svg
                  />
                )}
              </span>
   
          <span className="!font-bold text-xs">{marketplace}</span> 
          <span className="!font-bold text-xs user-name dropdown-indicator " style={{marginLeft:"5px"}}>| {marketplaceCode}</span> 
      </DropdownToggle>
}
      <LangDropdown className="dropdown-menu-s1" />
              
    </UncontrolledDropdown>
  );
}

export default LanguageHead;
