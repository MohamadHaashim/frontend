import React, { useState } from "react";
import Icon from "../../../icon/Icon";
import { UncontrolledDropdown, CardTitle, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { HorizontalBarChart } from "../../charts/sales/Charts";

const BestKeywords = (props) => {
  const [coinOrder, setOrder] = useState("");
  return (
    <React.Fragment>
      <div className="card-title-group align-start mb-2">
        <CardTitle className="card-title">
          <h6 className="title">Keywords: best performing</h6>
          <p>
            Last {props.timeframe} day/days best performing keywords.
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
            <span>First Aid Kit</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#9cabff" }}></span>
            <span>1st Aid Kit</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#8feac5" }}></span>
            <span>Medical Dressings</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#6b79c8" }}></span>
            <span>AED</span>
          </li>
          <li>
            <span className="dot dot-lg sq" style={{ background: "#79f1dc" }}></span>
            <span>Eye Wash</span>
          </li>
        </ul>
      </div>
    </React.Fragment>
  );
};
export default BestKeywords;
