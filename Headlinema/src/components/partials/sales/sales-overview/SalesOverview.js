import React from "react";
import { DropdownItem, DropdownToggle, DropdownMenu, UncontrolledDropdown } from "reactstrap";
import { Icon } from "../../../Component";
import { LineChart } from "../../charts/sales/Charts";

const SalesOverview = (props) => {
  return (
    <React.Fragment>
      <div className="card-title-group align-start gx-3 mb-3">
        <div className="card-title">
          <h6 className="title">Sales</h6>
          <p>
            Last {props.timeframe} day/days sales overview.{" "}
            <a
              href="#details"
              onClick={(ev) => {
                ev.preventDefault();
              }}
            >
              See Details
            </a>
          </p>
        </div>
        <div className="card-tools">
          <UncontrolledDropdown>
            <DropdownToggle tag="div" color="transparent">
              <a
                href="#toggle"
                onClick={(ev) => ev.preventDefault()}
                className="btn btn-primary btn-dim d-none d-sm-inline-flex"
              >
                <Icon className="d-none d-sm-inline" name="download-cloud" />
                <span>
                  <span className="d-none d-md-inline">Download</span> Report
                </span>
              </a>
              <a
                href="#toggle"
                onClick={(ev) => ev.preventDefault()}
                className="btn btn-primary btn-icon btn-dim d-sm-none"
              >
                <Icon name="download-cloud" />
              </a>
            </DropdownToggle>
            <DropdownMenu right>
              <ul className="link-list-opt no-bdr">
                <li>
                  <DropdownItem
                    tag="a"
                    href="#dropdownitem"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    <span>Download Mini Version</span>
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem
                    tag="a"
                    href="#dropdownitem"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    <span>Download Full Version</span>
                  </DropdownItem>
                </li>
                <li className="divider"></li>
                <li>
                  <DropdownItem
                    tag="a"
                    href="#dropdownitem"
                    onClick={(ev) => {
                      ev.preventDefault();
                    }}
                  >
                    <Icon name="opt-alt" />
                    <span>Options</span>
                  </DropdownItem>
                </li>
              </ul>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>
      <div className="nk-sale-data-group align-center justify-between gy-3 gx-5">
        <div className="nk-sale-data">
        </div>
        <div className="nk-sale-data">
          <span className="amount sm">
          </span>
        </div>
      </div>
      <div className="nk-sales-ck large pt-4">
        <LineChart timeframe={props.timeframe}/>
      </div>
    </React.Fragment>
  );
};
export default SalesOverview;
