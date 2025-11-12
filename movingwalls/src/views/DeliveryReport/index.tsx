import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/auth";
import client from "../../Graphql/apolloClient";
import { DELIVERY_REPORTS_QUERY } from '../../Graphql/Queries';
import BackIcon from "../../assets/images/back-icon.svg";
import SearchLogo from "../../assets/images/search.svg";
import ViewEye from "../../assets/images/vieweye.svg";
import { toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import { format } from "date-fns";
import NoImage from "../../assets/images/nomedia.jpg";
import './index.css';
import { generateMockData } from "../../Graphql/MockData";

interface Agency {
  id: string;
  name: string;
}

interface StartEndDate {
  date: string;
}
interface InventoryDetails {
  id: string;
  type: string;
  billboardId: string;
}
interface Report {
  id: string;
  campaignName: string;
  campaignId: string;
  campaignStatus: string;
  dealId: string;
  dsp: string;
  agency: Agency;
  startDate: StartEndDate;
  endDate: StartEndDate;
  inventoryName: string;
  inventoryReferenceId: string;
  inventoryId: string;
  inventoryThumbnailUrl: string;
  inventoryPrice: number;
  availableBooking: number;
  nextAvailableDate: string;
  spotsAvailability: number;
  inventoryDetails: InventoryDetails;
}
const getCampaignId = (location: any) => {
  const campaignIdFromState = location.state?.campaignId || localStorage.getItem("selectedCampaignId");
  return campaignIdFromState || '';
};
const DeliveryReport = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  // const campaignId = location.state?.campaignId;

  const campaignId = getCampaignId(location);
  useEffect(() => {
    if (campaignId) {
      localStorage.setItem("selectedCampaignId", campaignId);
    }

  }, [campaignId]);

  const fetchReports = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    setLoading(true);
    try {
      const response = await client.query({
        query: DELIVERY_REPORTS_QUERY,
        variables: {
          accessToken: token,
          campaignId: campaignId,
          page: currentPage - 1,
          size: 5,
          sort: "lastModifiedDate,desc",
          search: search,
        },
        fetchPolicy: "no-cache",
      });

      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        toast.error("Failed to fetch reports: " + response.errors.map(err => err.message).join(", "));
        return;
      }

      setReports(response.data.deliveryReports);
      setTotalPages(response.data.deliveryReports[0]?.totalPages || 0);
    } catch (err) {
      console.error("Fetch Reports Error:", err);
      toast.error("An unexpected error occurred while fetching reports");
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    fetchReports();
  };
  useEffect(() => {
    if (process.env.REACT_APP_MOCK_DATA === 'true') {
      generateMockData(DELIVERY_REPORTS_QUERY).then((mockResponse: any) => {
        setReports(mockResponse.data.deliveryReports);

      }).catch((err: any) => {
        console.error("Error generating mock data:", err);
      });
    } else {
      fetchReports();
    }
  }, [search, currentPage]);

  const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setSearch(event.currentTarget.value);
    }
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRotate = () => {
    setSearch('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  const filteredReports = reports.filter(content =>
    content.inventoryName.toLowerCase().includes(search.toLowerCase())
  );
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)); // in days
    return duration >= 0 ? duration : 0; // Ensure non-negative duration
  };
  // Assuming all reports have the same campaignName and dealId
  const campaignName = reports.length > 0 ? reports[0].campaignName : "N/A";
  const dealId = reports.length > 0 ? reports[0].dealId : "N/A";
  const totalDuration = reports.length > 0
    ? calculateDuration(reports[0].startDate.date, reports[0].endDate.date)
    : 0;


  return (
    <AuthLayout>
      <div className="delivery-report-fullcontent">
        <div className="container mt-2">
          <div className="navbar-back-btn">
            <img alt="" src={BackIcon} /><Link to={`${process.env.REACT_APP_BASE_PATH}/my-campaigns`}> Back</Link>
          </div>
        </div>
        <div className="container delivery-report">
          <form className="delivery-report-form">
            <div className="deliver-reoprt-content mb-3">
              <h2>Delivery report</h2>
              <div className="dellivery-report-content row">
                <div className="col-md-2">
                  <h6>Campaign name</h6>
                  <h4>{campaignName}</h4>
                </div>
                <div className="col-md-3">
                  <h6>Deal ID</h6>
                  <h4>{dealId}</h4>
                </div>
                <div className="col-md-2">
                  <h6>Duration</h6>
                  <h4>{totalDuration} Days</h4>
                </div>
                <div className="delivery-report-input col-md-5">
                  <img src={SearchLogo} alt="" />
                  <input
                    type="text"
                    placeholder="Search for your campaigns"
                    className="border-bottom-only no-focus-border"
                    // value={search}
                    ref={inputRef}
                    onKeyDown={handleSearchChange}
                  // onChange={(e) => setSearch(e.target.value)}
                  />
                  <span className="delivery-rest">
                    <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
                  </span>
                </div>
              </div>
            </div>

            <h3 className="head-bill">Billboards</h3>
            <div className="scrollbar">
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: '40vh' }}>
                  <span className="loading-circle sp1">
                    <span className="loading-circle sp2">
                      <span className="loading-circle sp3"></span>
                    </span>
                  </span>
                </div>
              ) : (
                <table className="table table-hover delivery-report-table">
                  <thead>
                    <tr>
                      <th>Billboard Name</th>
                      <th></th>
                      <th>Billboard ID</th>
                      <th>Start date</th>
                      <th>End date</th>
                      <th>Content type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="delivery-report-table-logo" id="style">
                    {filteredReports.length > 0 ? (
                      filteredReports.map(report => (
                        <tr key={report.id}>
                          <td><img src={report.inventoryThumbnailUrl && report.inventoryThumbnailUrl !== "null" ? report.inventoryThumbnailUrl : NoImage} alt="" className="billboard-logo" /></td>
                          <td className="bill-name">{report.inventoryName}</td>
                          <td>{report.inventoryReferenceId || ' - '}</td>
                          {/* <td>{report.inventoryDetails.id || ' - '}</td> */}
                          <td>{format(report.startDate.date, 'dd MMM yyyy')}</td>
                          <td>{format(report.endDate.date, 'dd MMM yyyy')}</td>
                          <td>{report.inventoryDetails.type}</td>
                          <td className="delivery-view"><img src={ViewEye} alt="" />
                            <Link to={`${process.env.REACT_APP_BASE_PATH}/delivery-view`}>View</Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center delivery-repo-nodata">No data found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="col-md-12">
              <nav aria-label="Page navigation example">
                <ul className="pagination pagenation-align">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <Link className="page-chevron-left page-link" onClick={() => handlePageChange(currentPage - 1)} to="#">
                      <i className="fa-solid fa-angle-left"></i>
                    </Link>
                  </li>
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                      <Link className="page-link" onClick={() => handlePageChange(index + 1)} to="#">
                        {index + 1}
                      </Link>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <Link className="page-chevron-right page-link" onClick={() => handlePageChange(currentPage + 1)} to="#">
                      <i className="fa-solid fa-angle-right"></i>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default DeliveryReport;
