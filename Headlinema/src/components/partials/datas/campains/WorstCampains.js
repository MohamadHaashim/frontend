import React, { useState } from "react";
import Icon from "../../../icon/Icon";
import { UncontrolledDropdown, CardTitle, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { HorizontalBarChart } from "../../charts/sales/Charts";

const WorstCampains = (props) => {
  const [coinOrder, setOrder] = useState("");
  return (
    <React.Fragment>
      <div className="card-title-group align-start mb-2">
        <CardTitle className="card-title">
          <h6 className="title">Campains: worst performing</h6>
          <p>
            Last {props.timeframe} day/days worst performing campains.
          </p>
        </CardTitle>

      </div>
      <div className="nk-coin-ovwg">
        <div className="nk-coin-ovwg-ck">
          <HorizontalBarChart state={coinOrder} />
        </div>
        <ul className="nk-coin-ovwg-legends">
          <li>
            <span className="dot dot-lg sq" style={{ background: "#f98c45" }}></span>
            <span>Bitcoin</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#9cabff" }}></span>
            <span>Ethereum</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#8feac5" }}></span>
            <span>NioCoin</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#6b79c8" }}></span>
            <span>Litecoin</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#79f1dc" }}></span>
            <span>Bitcoin Cash</span>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};
export default WorstCampains;
