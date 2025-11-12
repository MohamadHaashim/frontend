import React, { useEffect, useState } from "react";
import Icon from "../../../icon/Icon";
import { Progress, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown } from "reactstrap";
import { PreviewAltCard } from "../../../preview/Preview";
import { PurchasePlanChart } from "../../charts/invest/InvestChart";
import { asinData, asinDataSet2, asinDataSet3, asinDataSet4 } from "./AsinData";

const TopAsin = (props) => {
  const [planSet, setPlanSet] = useState("30");
  const [data, setData] = useState(asinData);

  useEffect(() => {
    let newData;
    if (planSet === "7") {
      newData = asinDataSet2;
    } else if (planSet === "15") {
      newData = asinDataSet3;
    } else {
      newData = asinDataSet4;
    }
    setData(newData);
  }, [planSet]);

  return (
    <PreviewAltCard className="card-full" bodyClass="d-flex flex-column h-100">
      <div className="card-title-group mb-3">
        <div className="card-title">
          <h6 className="title">Top ASINs</h6>
          <p>Last {props.timeframe} day/days top products.</p>
        </div>

      </div>
      <div className="progress-list gy-3">
        {data.map((item, idx) => {
          return (
            <div className="progress-wrap" key={idx}>
              <div className="progress-text">
                <div className="progress-label">{item.pack}</div>
                <div className="progress-amount">{item.amount}%</div>
              </div>
              <Progress className="progress-md" value={item.amount} color={item.color}></Progress>
            </div>
          );
        })}
      </div>

    </PreviewAltCard>
  );
};
export default TopAsin;
