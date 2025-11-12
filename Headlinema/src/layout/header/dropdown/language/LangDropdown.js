import React, { useEffect, useState } from "react";
import { DropdownItem, DropdownMenu } from "reactstrap";
import ReactCountryFlag from "react-country-flag";
import axios from "axios";

function LangDropdown({ className }) {
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [ConnectedAccount, setConnectedAccount] = useState(JSON.parse(localStorage.getItem("AdsProfiles")));
  const AllProfiles = JSON.parse(localStorage.getItem("Profiles"));

  const AccountSelect = (mp) => {
    localStorage.setItem("SelectedProfileName", mp.name);
    localStorage.setItem("SelectedProfileCode", mp.countryCode);
  };
console.log("profiles----->",AllProfiles);


  useEffect(() => {
    
    if (AllProfiles && AllProfiles.length > 0 && ConnectedAccount) {
      
      const connectedProfiles = ConnectedAccount.map((profile) => {
        const connectedProfile = AllProfiles.find((account) => account.profileId == profile.adsProfileid);
        return connectedProfile;
      });

      console.log("------------->",connectedProfiles);
      if (connectedProfiles[0] !== undefined) {
        localStorage.setItem("SelectedProfileName", connectedProfiles[0].name);
        localStorage.setItem("SelectedProfileCode", connectedProfiles[0].countryCode);
      }
      if (ConnectedAccount.length === 0) {
        localStorage.removeItem("SelectedProfileName");
        localStorage.removeItem("SelectedProfileCode");
      }
      if (ConnectedAccount.length === 1) {
        localStorage.setItem("SelectedProfileName", connectedProfiles[0].name);
        localStorage.setItem("SelectedProfileCode", connectedProfiles[0].countryCode);
      }
      setSelectedAccount(connectedProfiles);
    } 
    else if (AllProfiles.length === 0) {
      localStorage.removeItem("AdsProfiles")
      localStorage.removeItem("SelectedProfileName");
      localStorage.removeItem("SelectedProfileCode");
    }
  }, []);


  return (
    <DropdownMenu
      right
      className={` ${className ? className : ""}`}
      style={{ maxHeight: "250px", overflowY: "auto" }}
    >
      {selectedAccount[0] !== undefined && (
        <ul className="language-list">
          {selectedAccount.map((mp, index) => (
            <li key={index}>
              <DropdownItem tag="a" href="#item" className="language-item" onClick={() => AccountSelect(mp)}>
                <span className="me-2">
                  {" "}
                  {mp.countryCode === "UK" ? (
                    <ReactCountryFlag
                      countryCode="GB"
                      style={{
                        width: "1.8em",
                        height: "1.8em",
                        borderRadius: "5px",
                      }}
                      svg
                    />
                  ) : (
                    <ReactCountryFlag
                      countryCode={mp.countryCode}
                      style={{
                        width: "1.8em",
                        height: "1.8em",
                        borderRadius: "5px",
                      }}
                      svg
                    />
                  )}
                </span>
                <span className="language-name">{mp.name}</span>
                <span className="language-name">{mp.countryCode}</span>
              </DropdownItem>
            </li>
          ))}
        </ul>
      )}
    </DropdownMenu>
  );
}

export default LangDropdown;
