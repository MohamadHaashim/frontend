import React, { useState } from "react";
import Icon from "../../../icon/Icon";
import { UncontrolledDropdown, CardTitle, DropdownMenu, DropdownItem, DropdownToggle } from "reactstrap";
import { DoubleBar } from "../../charts/sales/Charts";
import { Row, Col } from "../../../grid/Grid";
import { Link } from "react-router-dom";

const OrdersOverview = (props) => {
  const [orderOverview, setOverview] = useState("");
  return (
    <React.Fragment>
      <div className="card-title-group align-start mb-3 !pt-4">
        <CardTitle className="card-title">
          <h6 className="title">Orders</h6>
          <p>
            Last {props.timeframe} day/days orders overview.{" "}
            <Link to={`${process.env.PUBLIC_URL}/invoice-list`} className="link link-sm">
              See details
            </Link>
          </p>
        </CardTitle>

      </div>
      <div className="nk-order-ovwg">
        <Row className="g-4 align-end">
          <Col xxl="12">
            <div className="nk-order-ovwg-ck">
              <DoubleBar state={orderOverview} />
            </div>
          </Col>
        
        </Row>
      </div>
    </React.Fragment>
  );
};
export default OrdersOverview;
