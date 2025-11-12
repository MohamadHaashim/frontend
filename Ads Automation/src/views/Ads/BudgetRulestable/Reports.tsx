import React, { Component, useEffect, useState,useRef } from 'react';
import './BudgetTable.css'
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Row, Col,Spinner } from "react-bootstrap";
// import { FaTrash } from "react-icons/fa";
// import { MdEdit } from "react-icons/md";
import moment from "moment-timezone";

interface reports{
    reportId:string;
    adProduct:string;
    status:string;
    reportTypeId:string;
    startDate:string;
    endDate:string;
    updatedAt:string;
}
interface reportsProps{
    condition: string;
  }

  const Reports: React.FC<reportsProps> = (props) => {
  const [reports,setreports]=useState<reports[]>([])
  const [perPage, setPerPage] = useState(50);
  const [totalRow, setTotalRow] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [apiLoading, setApiLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);  

  const [tableData, setTableData] = useState<reports[]>(reports); // Initialize with the `campaigns` data
    const [sortConfig, setSortConfig] = useState<{ key: keyof reports; direction: "asc" | "desc" }>({
    key: "reportId", // Default sorting key
    direction: "asc", // Default sorting direction
  });
const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const handleChange = (event, value: number) => {
    setActivePage(Number(value))
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    setActivePage(1)
    setPerPage(Number(e.target.value)) 
  };

  const handleSort = (key: keyof reports) => {
    let direction: "asc" | "desc" = "asc";
  
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    
    const sortedData = [...reports].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
  
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
  
   
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
  
      if (aValue && typeof aValue === "object" && "actionName" in aValue) {
        const aSubValue = (aValue as any).actionName ?? "";
        const bSubValue = (bValue as any)?.actionName ?? "";
        return direction === "asc"
          ? aSubValue.localeCompare(bSubValue)
          : bSubValue.localeCompare(aSubValue);
      }
  
      return 0; 
    });
  
    
    setSortConfig({ key, direction });
    setreports(sortedData);
  };

  const fetchreports = async (activePage: number, perPage: number, condition: string) => {
    let userToken = localStorage.getItem("budgetOptimizer");
    let AuthToken = "Bearer " + userToken;
    let profileId = localStorage.getItem("BudgetProfileId")
    console.log(profileId,"BudgetProfileId")
    setSpinner(true);
      try {
          const response = await fetch(
              `https://budget-api.getgrowth.agency/api/amazon/ads/${profileId}/getReports`,
              {
                  method: 'POST', 
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: AuthToken,
                  },
                  body: JSON.stringify({
                      pageNo: activePage,
                      perPage:perPage ,
                      // type: selectedProfile,
                      // status:selectedstatus,
                      // currencyCode: 'USD',
                      // search: searchKeyFilter,
                      // timezone: 'America/Los_Angeles',
                  }),
              }
          );

          if (!response.ok) {
              throw new Error('Failed to fetch campaigns data.');
          }

          const data = await response.json();
          if (data?.data) {
            setreports(data.data);
              console.log(data.data.actionType,"data")
              setTotalRow(data.totalRecords)
              setActivePage(data.currentPageNo)
              setLastPage(data.totalPages)
              
          }
          setSpinner(false);
          console.log(data.data, "Fetched Campaigns Data");
      } catch (err) {
        setSpinner(false);
          console.error(err);
       } finally {
        setApiLoading(false); 
      }

  };

  useEffect(() => {
    fetchreports(activePage,perPage,props.condition);
      }, [activePage,perPage,props.condition]); 

  return (
    <div>
    <div className='Budget-table' style={{ height: 500, width: "100%" ,marginTop:"60px"}}>
            <table className= "full-table" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse'}}>
                <thead className='table-heaad'>
                    <tr>
                        <th 
                        onMouseEnter={() => setHoveredColumn('reportId')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('reportId')}>Report id
                        {hoveredColumn === 'reportId' || sortConfig.key === 'reportId' ? (
                            sortConfig.key === 'reportId' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('adProduct')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('adProduct')}>Ad Product
                       {hoveredColumn === 'adProduct' || sortConfig.key === 'adProduct' ? (
                            sortConfig.key === 'adProduct' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('status')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('status')}>Status
                       {hoveredColumn === 'status' || sortConfig.key === 'status' ? (
                            sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('reportTypeId')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('reportTypeId')}>Report Type
                        {hoveredColumn === 'reportTypeId' || sortConfig.key === 'reportTypeId' ? (
                            sortConfig.key === 'reportTypeId' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('startDate')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('startDate')}>Start Date
                        {hoveredColumn === 'startDate' || sortConfig.key === 'startDate' ? (
                            sortConfig.key === 'startDate' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('endDate')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('endDate')}>End Date
                        {hoveredColumn === 'endDate' || sortConfig.key === 'endDate' ? (
                            sortConfig.key === 'endDate' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('updatedAt')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('updatedAt')}>Updated At
                        {hoveredColumn === 'updatedAt' || sortConfig.key === 'updatedAt' ? (
                            sortConfig.key === 'updatedAt' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                     
                    </tr>
                </thead>
                <tbody className='tbody-td'>
                {spinner ? (
                <td colSpan={8} style={{ textAlign: 'center', height: '450px', verticalAlign: 'middle' }}>
                  <div className="loading-container">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                </td>
              ) :
                    Array.isArray(reports) && reports.map((reports,index) => (
                        <tr className='tbody-tr:hover' key={index}> 
                             
                            <td>{reports.reportId}</td>
                            <td>{reports.adProduct}</td>
                            <td style={{ color: reports.status === 'SUCCESS' ? 'green' : (reports.status === 'PENDING' || reports.status === 'IN_PROGRESS') ? 'red' : 'black' }}>
                            {reports.status}
                            </td>
                            <td>{reports.reportTypeId || '-'}</td>
                            <td>{reports.startDate}</td>
                            <td>{reports.endDate}</td>
                            <td>
                              {reports.updatedAt ? (
                                (() => {
                                  const timeZoneCountry = "America/Los_Angeles"; // Set a default timezone or fetch dynamically
                                  const formattedDateTime = moment(reports.updatedAt)
                                    .tz(timeZoneCountry)
                                    .format("MM/DD/YYYY hh:mm:ss A z");
                                  return formattedDateTime;
                                })()
                              ) : (
                                "-"
                              )}
                            </td>
                        </tr>
                    ) , (
                      <tr>
                        <td  style={{ textAlign: "center" }}>
                        No rows
                        </td>
                      </tr>
                    ))}
                  </tbody>
            </table> 
        </div>
        <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={perPage}
                      onChange={(event) => applyDataLength(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {totalRow} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={lastPage}
                      page={activePage}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div> 
        </div>
        
  );
};

export default Reports;

