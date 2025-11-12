import React from "react";
import { CardTitle } from "reactstrap";
import { Icon, TooltipComponent } from "../../../Component";
import { BarChart } from "../../charts/sales/Charts";

const Acos = () => {
  return (
    <React.Fragment>
      <div className="card-title-group align-start mb-2">
        <CardTitle>
          <h6 className="title">ACOS</h6>
        </CardTitle>
        <div className="card-tools">
          <TooltipComponent
            icon="help-fill"
            iconClass="card-hint"
            direction="left"
            id="Tooltip-2"
            text="Total product sales"
          />
        </div>
      </div>
      <div className="align-end flex-sm-wrap g-4 flex-md-nowrap">
        <div className="nk-sale-data">
          <span className="amount">500</span>
          <span className="sub-title">
            <span className="change up text-danger">
              <Icon name="arrow-long-up" />
              5.93%
            </span>
            monthly
          </span>
        </div>
        <div className="nk-sales-ck">
          <BarChart />
        </div>
      </div>
    </React.Fragment>
  );
};
export default Acos;
