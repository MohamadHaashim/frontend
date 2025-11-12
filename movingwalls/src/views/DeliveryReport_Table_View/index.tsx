import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import FilterLogo from "../../assets/images/sliders@2x.png";
import BackIcon from "../../assets/images/back-icon.svg";
import SearchLogo from "../../assets/images/search.svg";
import DoubleChevron from "../../assets/images/doublechevron.svg";
import DownloadImage from "../../assets/images/group-212841535.svg";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import client from "../../Graphql/apolloClient";
import { GRAPHQL_URI } from '../../Graphql/apolloClient';
import { CONTENT_HUB_QUERY, DELETE_CONTENT_MUTATION } from "../../Graphql/Queries";
import './index.css';
interface DeliveryReportTableViewList {
  id: string;
  fileName: string;
  mimeType: string;
  thumbnail: string;
  resolution: string;
  filePath: string;
}

const DeliveryReportTableView = () => {

  return (
    <AuthLayout>
      <>
        <div className="delivery-table-view-content">
          <div className="container mt-2">
            <div className="navbar-back-btn"><img alt="" src={BackIcon} /><Link to={`${process.env.REACT_APP_BASE_PATH}/delivery-view`} >Back</Link> </div>
          </div>
          <div className="container">
            <form className="delivery-table-view-form">
              <div className="delivery-table-view-head">
                <h5>View delivery play log report</h5>
              </div>
              <div className="row">
                <div className="delivery-table-view-date col-md-6">
                  <h6>
                    <span>Date:</span>  29 Jul 2023 - 30 Jul 2023
                  </h6>
                </div>
                <div className="delivery-table-view-buttons col-md-6">
                  <button>
                    <img className="invoice-download-icon delivery-table-view-download" alt="" src={DownloadImage} />Download template
                  </button>
                  {/* <button type="button" className="content-upload" data-bs-toggle="modal" data-bs-target="#FilterUpload"></button> */}
                </div>
                <div className="delivery-table-view-second-head col-md-12">
                  <h6><span>5 spots</span> in this date/time range found</h6>
                </div>
              </div>
              <div className="scrollbar">



                <table className="table table-hover delivery-table-view-table">
                  <thead className="delivery-table-view-thead">
                    <tr>
                      <th scope="col">Delivery date </th>
                      <th scope="col">Start time</th>
                      <th scope="col">End time</th>
                      <th scope="col">Assigned creative</th>
                      <th scope="col">Content duration</th>
                      <th scope="col">Billboard type</th>
                    </tr>
                  </thead>
                  <tbody className="delivery-table-view-tbody">

                    <tr className="delete-cell">
                      <td>23 Jun 2023</td>
                      <td>11:44:44</td>
                      <td>11:44:44</td>
                      <td>Content one</td>
                      <td>27</td>
                      <td>Digital</td>
                    </tr>
                    <tr className="delete-cell">
                      <td>23 Jun 2023</td>
                      <td>11:44:44</td>
                      <td>11:44:44</td>
                      <td>Content one</td>
                      <td>27</td>
                      <td>Digital</td>
                    </tr>
                    <tr className="delete-cell">
                      <td>23 Jun 2023</td>
                      <td>11:44:44</td>
                      <td>11:44:44</td>
                      <td>Content one</td>
                      <td>27</td>
                      <td>Digital</td>
                    </tr>
                    <tr className="delete-cell">
                      <td>23 Jun 2023</td>
                      <td>11:44:44</td>
                      <td>11:44:44</td>
                      <td>Content one</td>
                      <td>27</td>
                      <td>Digital</td>
                    </tr>
                    <tr className="delete-cell">
                      <td>23 Jun 2023</td>
                      <td>11:44:44</td>
                      <td>11:44:44</td>
                      <td>Content one</td>
                      <td>27</td>
                      <td>Digital</td>
                    </tr>
                    {/* <tr>
                      <td colSpan={7} className="text-center contenthub-creatives-nodata">No data found</td>
                    </tr> */}

                  </tbody>
                </table>

              </div>
              <div className="col-md-12">
                <nav aria-label="Page navigation example">
                  <ul className="pagination pagenation-align">
                    <li className="page-item"><a className="page-link page-chevron-left" href="#"><i className="fa-solid fa-angle-left"></i></a></li>
                    <li className="page-item"><a className="page-link page-number" href="#">1</a></li>
                    <li className="page-item"><a className="page-link page-chevron-right" href="#"><i className="fa-solid fa-angle-right"></i></a></li>
                  </ul>
                </nav>
              </div>

            </form>
          </div>
        </div>


      </>
    </AuthLayout>
  );
}

export default DeliveryReportTableView;
