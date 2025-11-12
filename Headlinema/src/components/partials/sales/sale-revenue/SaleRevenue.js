import React from "react";
import { CardTitle } from "reactstrap";
import { Icon, TooltipComponent } from "../../../Component";
import { BarChart } from "../../charts/sales/Charts";
import axios from "axios";

const BearerAlizonAccessToken = "Bearer" + " " + localStorage.getItem("AlizonAccessToken");
const spAtzAccessToken = localStorage.getItem("spAtzAccessToken");
const MarketplaceIds = localStorage.getItem("MarketplaceIds");
const timestamp = new Date().toISOString().replaceAll("-", "").replaceAll(":", "").replaceAll(".", "");

function SalesThisMonth() {
  const [responseDiv, setResponseDiv] = React.useState("");
  function getStartOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  }

  const startOfMonth = getStartOfMonth();
  const requestUrl = `https://sellingpartnerapi-eu.amazon.com/orders/v0/orders?MarketplaceIds=${MarketplaceIds}&CreatedAfter=${startOfMonth}`;

  return <div> {responseDiv} </div>;
}

function SalesThisWeek() {
  const [responseDiv, setResponseDiv] = React.useState("");
  function getStartOfWeek() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.toISOString();
  }

  const startOfWeek = getStartOfWeek();

  const requestUrl = `https://sellingpartnerapi-eu.amazon.com/orders/v0/orders?MarketplaceIds=${MarketplaceIds}&CreatedAfter=${startOfWeek}`;

 
  return <div> {responseDiv} </div>;
}

const SaleRevenue = (props) => {
  return (
    <React.Fragment>
      <div className="card-title-group align-start mb-2">
        <CardTitle>
          <h6 className="titlepink">Product Sales</h6>
          <p>Last {props.timeframe} day/days sales.</p>
        </CardTitle>
        <div className="card-tools">
          <TooltipComponent
            icon="help-fill"
            iconClass="card-hint"
            direction="left"
            id="tooltip-1"
            text="Revenue from subscription"
          />
        </div>
      </div>
      <div className="align-end gy-3 gx-5 flex-wrap flex-md-nowrap flex-lg-wrap flex-xxl-nowrap">
        <div className="nk-sale-data-group flex-md-nowrap g-4">
          <div className="nk-sale-data">
            <span className="amount">
              <SalesThisMonth />
              <span className="change up text-danger">
                <Icon name="arrow-long-up" />
                16.93%
              </span>
            </span>
            <span className="sub-title">This Month</span>
          </div>
          <div className="nk-sale-data">
            <span className="amount">
              <SalesThisWeek />

              <span className="change down text-success">
                <Icon name="arrow-long-down" />
                2.26%
              </span>
            </span>
            <span className="sub-title">This Week</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default SaleRevenue;
