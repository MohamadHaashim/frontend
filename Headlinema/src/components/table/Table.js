import React, { useEffect, useState } from "react";
import classNames from "classnames";
import ReactCountryFlag from "react-country-flag";
import axios from "axios";
import Url from "../../Api";



const Table = ({ headColor, striped, border, hover, responsive, basicData }) => {
  const userId = localStorage.getItem("userId");
  const Adsdata = JSON.parse(localStorage.getItem("AdsProfiles"));

  const InputSwitch = ({ label, id }) => {
    const [isChecked, setIsChecked] = useState(Adsdata.some((profile) => profile.adsProfileid == id));
    
    const handleChange = (id) => {
      setIsChecked((prevChecked) => !prevChecked);
      const newChecked = !isChecked;
      setIsChecked(newChecked);

      const data = {
        userId: userId,
        adsProfileid: Number(id),
        connectd: newChecked,
      };

      axios
        .put( Url.api + Url.connectedProfileUpdate, data)
        .then((res) => {
          console.log(res.data);
          if (res.data.success === true) {
            console.log(res.data.message);
            if (newChecked) {
              // Toggle the switch on
              const Adsdata = JSON.parse(localStorage.getItem("AdsProfiles"));
              const newData = [...Adsdata, { adsProfileid: String(id), connectd: true }];
              localStorage.setItem("AdsProfiles", JSON.stringify(newData));
            } else {
              // Toggle the switch off
              const Adsdata = JSON.parse(localStorage.getItem("AdsProfiles"));
              const newData = Adsdata.filter((profile) => profile.adsProfileid !== String(id));
              localStorage.setItem("AdsProfiles", JSON.stringify(newData));
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return (
      <React.Fragment>
        <input
          type="checkbox"
          className="custom-control-input"
          checked={isChecked}
          onChange={() => handleChange(id)}
          id={id}
        />
        <label className="custom-control-label" htmlFor={id}>
          {label}
        </label>
      </React.Fragment>
    );
  };

  const tableClass = classNames({
    table: true,
    "table-bordered": border,
    "table-borderless": !border,
    "table-striped": striped,
    "table-hover": hover,
  });

  return (
    <div className={responsive ? "table-responsive" : ""}>
      <table className={tableClass}>
        <thead className={`${headColor ? `thead-${headColor}` : ""}`}>
          <tr>
            {basicData.header.map((item, idx) => {
              return <th key={idx}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {basicData.data.map((item) => {
            return (
              <tr key={item.id}>
                <td>
                  {item.countryCode === "UK" ? (
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
                      countryCode={item.countryCode}
                      style={{
                        width: "1.8em",
                        height: "1.8em",
                        borderRadius: "5px",
                      }}
                      svg
                    />
                  )}
                </td>
                <td>{item.name}</td>
                <td>{item.profileId}</td>
                <td>{item.type}</td>
                <td>
                  {" "}
                  <div className="g-item">
                    <div className="custom-control custom-switch">
                      <InputSwitch id={item.profileId} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
