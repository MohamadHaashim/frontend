import React, { Component, useEffect, useState,useRef } from 'react';
import './BudgetTable.css'
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Row, Col,Spinner } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import isAfter from "date-fns/isAfter";
import moment from "moment-timezone";
// import { FaTrash } from "react-icons/fa";
// import { MdEdit } from "react-icons/md";

interface CampaignHistory{
    runName:string;
    name:string;
    fromStatus:string;
    toStatus:string;
    fromBudget:string;
    toBudget:string;
    historyDate:string;
    historyTime:string;
    type:string;
    spend:string;
    sales:string;
    roas:string
    impressions:string
    cpc:string
    clicks:string
    orders:string
    acos:string
}

interface CampaignHistoryProps{
    condition: string;
  }

  const CampaignHistory: React.FC<CampaignHistoryProps> = (props) => {
  const [CampaignHistory,setCampaignHistory]=useState<CampaignHistory[]>([])
  const [perPage, setPerPage] = useState(50);
  const [totalRow, setTotalRow] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [apiLoading, setApiLoading] = useState(false);
  const [spinner, setSpinner] = useState(false); 
  const [searchText, setSearchText] = useState("");
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [originalCampaignHistory, setOriginalCampaignHistory] = useState(CampaignHistory || []);
  const [date, setDate] = useState<string[]>([]);
  const selectedCampagin = { timezone: 'America/Los_Angeles' }; 

  const [tableData, setTableData] = useState<CampaignHistory[]>(CampaignHistory); 
  const [sortConfig, setSortConfig] = useState<{ key: keyof CampaignHistory; direction: "asc" | "desc" }>({
  key: "runName",
  direction: "asc", 
});

const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

      const handleSort = (key: keyof CampaignHistory) => {
        let direction: "asc" | "desc" = "asc";
      
        if (sortConfig.key === key && sortConfig.direction === "asc") {
          direction = "desc";
        }
      
        const sortedData = [...CampaignHistory].sort((a, b) => {
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
        setCampaignHistory(sortedData);
      };

  const handleChange = (event, value: number) => {
    setActivePage(Number(value))
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    setActivePage(1)
    setPerPage(Number(e.target.value)) 
  };
  
  const handleDateRangeChange = (range) => {
    if (range && range.length === 2) {
      const [startDate, endDate] = range;
      const startFormatted = moment(startDate).format("YYYY-MM-DD");
      const endFormatted = moment(endDate).format("YYYY-MM-DD");
  
      setFormattedStartDate(startFormatted); 
      setFormattedEndDate(endFormatted);     
    }
  };

 

  const fetchreports = async (activePage: number, perPage: number,searchText: string,formattedStartDate: string,formattedEndDate: string, condition: string) => {
    let userToken = localStorage.getItem("budgetOptimizer");
    let AuthToken = "Bearer " + userToken;
    let profileId = localStorage.getItem("BudgetProfileId")
    console.log(profileId,"BudgetProfileId")
    setSpinner(true);
      try {
          const response = await fetch(
              `https://budget-api.getgrowth.agency/api/amazon/ads/${profileId}/getCampaignHistory`,
              {
                  method: 'POST', 
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: AuthToken,
                  },
                  body: JSON.stringify({
                      pageNo: activePage,
                      perPage:perPage ,
                      startDate:formattedStartDate,
                      endDate:formattedEndDate,
                      searchCampaign:searchText,
                  }),
              }
          );

          if (!response.ok) {
              throw new Error('Failed to fetch campaigns data.');
          }

          const data = await response.json();
          if (data?.data) {
            setCampaignHistory(data.data);
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
    fetchreports(activePage,perPage,searchText,formattedStartDate,formattedEndDate,props.condition);
      }, [activePage,perPage,searchText,formattedStartDate,formattedEndDate,props.condition]); 

      const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchText(searchValue);
      
        if (searchValue.trim() === "") {
          // Reset to the original CampaignHistory if search is empty
          setCampaignHistory(originalCampaignHistory || []); // Keep a backup of the original data
        } else {
          // Filter and directly update CampaignHistory
          const filtered = originalCampaignHistory.filter((item) => {
            return (
              item.runName?.toLowerCase().includes(searchValue) ||
              item.name?.toLowerCase().includes(searchValue) ||
              item.fromStatus?.toLowerCase().includes(searchValue) ||
              item.toStatus?.toLowerCase().includes(searchValue) ||
              item.historyDate?.toLowerCase().includes(searchValue) ||
              item.historyTime?.toLowerCase().includes(searchValue)
            );
          });
          setCampaignHistory(filtered);
        }
      };
      useEffect(() => {
        // Initialize original data when the component loads
        setOriginalCampaignHistory(CampaignHistory || []);
      }, [CampaignHistory]);

      useEffect(() => {
        // Ensure both start and end dates are correctly set to the PST timezone
        setDate([
          moment().tz(selectedCampagin?.timezone || 'America/Los_Angeles', true).format("YYYY-MM-DD"), // Start date in PST
          moment().tz(selectedCampagin?.timezone || 'America/Los_Angeles', true).format("YYYY-MM-DD"), // End date in PST
        ]);
      }, [selectedCampagin?.timezone]);
      

  return (
    <div>
      <Row className="mt-2 mb-2">
          <Col style={{justifyContent:"flex-end",display:"flex" }}> 
          <div className="campaigns-history">
          <div className="datepicker">
            <DateRangePicker
              placeholder="Select Date Range"
              className="custom-date-range-picker"
              // onChange={this.onChangeDateRangeSubmitGlobal}
              onChange= {handleDateRangeChange}
              format="yyyy-MM-dd"
              disabledDate={(date) => isAfter(date, new Date())}
              // defaultValue={[this.startDate, this.endDate]}  
              defaultValue={[
                date && date[0] ? moment(date[0]).tz("America/Los_Angeles", true).toDate() : new Date(),
                date && date[1] ? moment(date[1]).tz("America/Los_Angeles", true).toDate() : new Date(),
              ]}
            />
          </div>
          <div className="campaignssearch-container">
            <input
              type="text"
              className="text_search1"
              placeholder="Search..."
              onChange={handleSearch}
            />
          </div>
          </div>
          </Col>
          </Row>    
    <div className='Budget-table' style={{ height: 500, width: "100%" }}>
            <table className= "full-table" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse'}}>
            <thead className='table-heaad'>
                  <tr>
                    <th 
                    onMouseEnter={() => setHoveredColumn('runName')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('runName')}>Name
                      {hoveredColumn === 'runName' || sortConfig.key === 'runName' ? (
                            sortConfig.key === 'runName' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('name')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('name')}>Campaigns
                      {hoveredColumn === 'name' || sortConfig.key === 'name' ? (
                            sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('fromStatus')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('fromStatus')}>Before Status
                      {hoveredColumn === 'fromStatus' || sortConfig.key === 'fromStatus' ? (
                            sortConfig.key === 'fromStatus' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('toStatus')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('toStatus')}>After Status
                      {hoveredColumn === 'toStatus' || sortConfig.key === 'toStatus' ? (
                            sortConfig.key === 'toStatus' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('fromBudget')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('fromBudget')}>Before Budget
                      {hoveredColumn === 'fromBudget' || sortConfig.key === 'fromBudget' ? (
                            sortConfig.key === 'fromBudget' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('toBudget')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('toBudget')}>After Budget
                      {hoveredColumn === 'toBudget' || sortConfig.key === 'toBudget' ? (
                            sortConfig.key === 'toBudget' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('historyDate')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('historyDate')}>Date & Time
                      {hoveredColumn === 'historyDate' || sortConfig.key === 'historyDate' ? (
                            sortConfig.key === 'historyDate' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('type')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('type')}>Campaign Type
                      {hoveredColumn === 'type' || sortConfig.key === 'type' ? (
                            sortConfig.key === 'type' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('spend')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('spend')}>Spend
                      {hoveredColumn === 'spend' || sortConfig.key === 'spend' ? (
                            sortConfig.key === 'spend' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('sales')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('sales')}>Sales
                      {hoveredColumn === 'sales' || sortConfig.key === 'sales' ? (
                            sortConfig.key === 'sales' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('acos')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('acos')}>ACOS
                    {hoveredColumn === 'acos' || sortConfig.key === 'acos' ? (
                            sortConfig.key === 'acos' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('roas')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('roas')}>ROAS
                    {hoveredColumn === 'roas' || sortConfig.key === 'roas' ? (
                            sortConfig.key === 'roas' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                     onMouseEnter={() => setHoveredColumn('impressions')}
                     onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('impressions')}>Impressions
                      {hoveredColumn === 'impressions' || sortConfig.key === 'impressions' ? (
                            sortConfig.key === 'impressions' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('cpc')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('cpc')}>CPC
                    {hoveredColumn === 'cpc' || sortConfig.key === 'cpc' ? (
                            sortConfig.key === 'cpc' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th 
                    onMouseEnter={() => setHoveredColumn('clicks')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('clicks')}>Clicks
                       {hoveredColumn === 'clicks' || sortConfig.key === 'clicks' ? (
                            sortConfig.key === 'clicks' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                    <th
                    onMouseEnter={() => setHoveredColumn('orders')}
                    onMouseLeave={() => setHoveredColumn(null)}
                    onClick={() => handleSort('orders')}>Orders
                       {hoveredColumn === 'orders' || sortConfig.key === 'orders' ? (
                            sortConfig.key === 'orders' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                    </th>
                  </tr>
                </thead>
                <tbody className='tbody-td'>
                {spinner ? (
                <td colSpan={15} style={{ textAlign: 'center', height: '450px', verticalAlign: 'middle' }}>
                  <div className="loading-container">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                </td>
              ) :
                    Array.isArray(CampaignHistory) && CampaignHistory.map((CampaignHistory,index) => (
                        <tr className='tbody-tr:hover' key={index}> 
                             
                            <td>{CampaignHistory.runName}</td>
                            <td>{CampaignHistory.name}</td>
                            <td style={{ color: CampaignHistory.fromStatus === 'PAUSED' ? 'red' : (CampaignHistory.fromStatus === 'ENABLED' ? 'green' : 'black') }}>
                                {CampaignHistory.fromStatus || '-'}
                            </td>
                            <td style={{ color: CampaignHistory.toStatus === 'PAUSED' ? 'red' : (CampaignHistory.toStatus === 'ENABLED' ? 'green' : 'black') }}>
                                {CampaignHistory.toStatus || '-'}
                            </td>
                            <td>${CampaignHistory.fromBudget}</td>
                            <td>{CampaignHistory.toBudget ? `$${CampaignHistory.toBudget}` : '-'}</td>
                            <td>
                              {CampaignHistory.historyDate && CampaignHistory.historyTime ? (
                                (() => {
                                  const timeZoneCountry = "America/Los_Angeles";
                                  const combinedDateTime = `${CampaignHistory.historyDate}T${CampaignHistory.historyTime}:00`; 
                                  const formattedDateTime = moment
                                    .tz(combinedDateTime, timeZoneCountry) 
                                    .format("MM/DD/YYYY hh:mm:ss A z"); 
                                  return formattedDateTime;
                                })()
                              ) : (
                                "-"
                              )}
                            </td> 
                            <td>{CampaignHistory.type}</td>
                            <td>${CampaignHistory.spend}</td>
                            <td>${CampaignHistory.sales}</td>
                            <td>{CampaignHistory.acos}%</td>
                            <td>{CampaignHistory.roas}</td>
                            <td>{CampaignHistory.impressions}</td>
                            <td>${CampaignHistory.cpc}</td>
                            <td>{CampaignHistory.clicks}</td>
                            <td>{CampaignHistory.orders}</td>
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

export default CampaignHistory;

