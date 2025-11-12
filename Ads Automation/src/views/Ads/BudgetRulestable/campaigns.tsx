import React, { Component, useEffect, useState,useRef } from 'react';
import './BudgetTable.css'
import { Row, Col,Spinner } from "react-bootstrap";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import Tooltip from '@mui/material/Tooltip';

interface Campaign {
    campaignId: string;
    name: string;
    status: string;
    budget: number;
    type: string;
    startDate: string;
    endDate: string | null;
    budgetType:string;
    spend: number;
    sales: number;
    roas:string
    impressions:string
    cpc:string
    clicks:string
    orders:string
    acos:string
    // actionName?: string;
}
interface CampaignsProps{
  condition: string;
}

const Campaigns: React.FC<CampaignsProps> = (props) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);  
    const [perPage, setPerPage] = useState(50);
    const [totalRow, setTotalRow] = useState(0);
    const [activePage, setActivePage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchKeyFilter, setSearchKeyFilter] = useState("");
    const [selectedProfile, setSelectedProfile] = useState("");
    const [selectedstatus, setselectedstatus] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [filterShow, setFilterShow] = useState(false);
  const [filter, setFilter] = useState<string[]>([]); 
  const [spinner, setSpinner] = useState(false);  

  const [tableData, setTableData] = useState<Campaign[]>(campaigns);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Campaign; direction: "asc" | "desc" }>({
  key: "name", 
  direction: "asc",
});
const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

    // const previousProfileIdRef = useRef(localStorage.getItem("BudgetProfileId"));
    let Condition: any = [];
    let rows: any = [];
    let columns: GridColDef[] = [];

    
    const handleSort = (key: keyof Campaign) => {
      let direction: 'asc' | 'desc' = 'asc';
    
      if (sortConfig.key === key && sortConfig.direction === 'asc') {
        direction = 'desc';
      }
    
      const sortedData = [...campaigns].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
    
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
    
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
    
        if (aValue && bValue && typeof aValue === 'string' && typeof bValue === 'string') {
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return direction === 'asc' ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
        }
    
        if (key === 'acos' || key === 'roas') {
          const aNumeric = aValue && typeof aValue === 'string' ? parseFloat(aValue.replace('%', '').trim()) : 0;
          const bNumeric = bValue && typeof bValue === 'string' ? parseFloat(bValue.replace('%', '').trim()) : 0;
          return direction === 'asc' ? aNumeric - bNumeric : bNumeric - aNumeric;
        }
    
        return 0; 
      });
    
      
      setSortConfig({ key, direction });
      setCampaigns(sortedData);
    };
    
    
  
    
    const fetchCampaigns = async (searchKeyFilter: string, selectedProfile: string, selectedstatus: string, activePage: number, perPage: number, condition: string) => {

      let userToken = localStorage.getItem("budgetOptimizer");
      let AuthToken = "Bearer " + userToken;
      let profileId = localStorage.getItem("BudgetProfileId")
      console.log(profileId,"BudgetProfileId")
      setSpinner(true);
      // if (previousProfileIdRef.current !== profileId) {
        try {
            const response = await fetch(
                `https://budget-api.getgrowth.agency/api/amazon/ads/${profileId}/listCampaigns`,
                {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: AuthToken,
                    },
                    body: JSON.stringify({
                        pageNo: activePage,
                        perPage:perPage ,
                        type: selectedProfile,
                        status:selectedstatus,
                        currencyCode: 'USD',
                        search: searchKeyFilter,
                        timezone: 'America/Los_Angeles',
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to fetch campaigns data.');
            }

            const data = await response.json();
            if (data?.data) {
                setCampaigns(data.data);
                setTotalRow(data.totalRecords)
                setActivePage(data.currentPageNo)
                // setPerPage(data.totalPages)
                setLastPage(data.totalPages)
                
            }
            setSpinner(false);
            console.log(data.data, "Fetched Campaigns Data");
            // previousProfileIdRef.current = profileId;
        } catch (err) {
          setSpinner(false);
            console.error(err);
         } finally {
          setApiLoading(false); // Hide loading state
        }
      // }
    };

    useEffect(() => {
        fetchCampaigns(searchKeyFilter,selectedProfile,selectedstatus,activePage,perPage,props.condition);
    }, [searchKeyFilter,selectedProfile,selectedstatus,activePage,perPage,props.condition]); 

    const applyDataLength = (e) => {
        console.log("dataSize: ", e.target.value);
        setActivePage(1)
        setPerPage(Number(e.target.value)) 
      };

      const handleChange = (event, value: number) => {
        setActivePage(Number(value))
      };

      const handleKeyDown = (event: any) => {
      if (event.key === "Enter") {
        setActivePage(1)
        setSearchKeyFilter(event.target.value);
        event.preventDefault();
      }
    };

    const handlestatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setselectedstatus(event.target.value); 
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedProfile(e.target.value);
    };

    const handleRefresh = () => {
      localStorage.removeItem("Sort");
      localStorage.removeItem("SortData");
      window.location.reload();
    };

    return (
      <div style={{ height: 500, width: "100%" }}>  
          <Row className="mt-2 mb-2">
            <Col style={{justifyContent:"flex-end" ,display:"flex" }}>     
            <div className="campaigns" >
            <div
                className="d-flex align-items-center refresh-button me-2"
                onClick={handleRefresh}
              >
            <i
              className="fa-solid fa-arrows-rotate p-2"
              style={{ color: "#9ca3af " }}
            ></i>
          </div>
          <div>
          </div>
      {/* <Row>
        <Col md={3} className="padding-lr-10"></Col>
        <Col md={9}> */}
          <div className="filters">
            {/* Uncomment and use the DateRangePicker if needed */}
            {/* 
            <DateRangePicker
              placeholder="Select Date Range"
              onChange={this.onChangeDateRangeSubmitGlobal}
              format="yyyy-MM-dd"
              disabledDate={(date) => isAfter(date, new Date())}
              defaultValue={[this.startDate, this.endDate]} 
            />
            */}
          </div>
          <div>
            <form>
              <div className="search-filter-container">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  placeholder="Search"
                  id="globalSearch"
                  name="globalSearch"
                  onChange={(e) => setSearchKeyFilter(e.target.value)} 
                  onKeyDown={handleKeyDown}
                />
              </div>
            </form>
          </div>
          <div className="accounts ms-2">
            <select
              className="form-select"
              name="accountSelect"
              id="accountSelect"
              style={{ height: "40px", paddingBottom: "10px" }}
              value={selectedProfile}
              onChange={handleProfileChange}
            >
              <option value="">All</option>
              <option value="Sponsored Products">Sponsored Products</option>
              <option value="Sponsored Brands">Sponsored Brands</option>
              <option value="Sponsored Display">Sponsored Display</option>
            </select>
          </div>
          <div className="accounts ms-2">
            <select
              className="form-select"
              name="accountStatus"
              id="accountStatus"
              style={{ height: "40px", paddingBottom: "10px" }}
              value={selectedstatus}
              onChange={handlestatus}
            >
              <option value="">All</option>
              <option value="ENABLED">Enabled</option>
              <option value="PAUSED">Paused</option>
              <option value="ARCHIVED">Archived</option>
              <option value="ENDED">Ended</option>
            </select>
          </div>
        {/* </Col>
      </Row> */}
    </div>

        </Col>
        </Row>
        <div>
        <div className='Budget-table' style={{ height: 500, width: "100%" }}>
            <table className= "full-table" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead className='table-heaad'>
                    <tr>
                        <th>Active</th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('campaignId')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('campaignId')}>
                        Campaign ID 
                        {hoveredColumn === 'campaignId' || sortConfig.key === 'campaignId' ? (
                            sortConfig.key === 'campaignId' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('name')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('name')}>
                        Campaign Name
                        {hoveredColumn === 'name' || sortConfig.key === 'name' ? (
                            sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        {/* <th>Status</th> */}
                        <th 
                        onMouseEnter={() => setHoveredColumn('status')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('status')}>Status
                        {hoveredColumn === 'status' || sortConfig.key === 'status' ? (
                            sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('budget')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('budget')}>Budget
                        {hoveredColumn === 'budget' || sortConfig.key === 'budget' ? (
                            sortConfig.key === 'budget' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
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
                        onMouseEnter={() => setHoveredColumn('startDate')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('startDate')} >Start Date
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
                        onMouseEnter={() => setHoveredColumn('budgetType')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('budgetType')}>BudgetType
                        {hoveredColumn === 'budgetType' || sortConfig.key === 'budgetType' ? (
                            sortConfig.key === 'budgetType' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
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
                        onClick={() => handleSort('impressions')} >Impressions
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
                  <td colSpan={17} style={{ textAlign: 'center',justifyContent:"center", height:"450px",alignContent:"center", verticalAlign: 'middle' }}>
                <div className="loading-container">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </td>
              ) :Array.isArray(campaigns) && campaigns.map((campaign) => (
                        <tr className='tbody-tr:hover' key={campaign.campaignId}> 
                             <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={campaign.status === "ENABLED"}
                                        disabled
                                    />
                                    <span className="slider"></span>
                                </label>
                            </td>
                            <td>{campaign.campaignId}</td>
                            <td>{campaign.name}</td>
                            <td 
                              className={campaign.status === "DISABLED" ? "status-disabled" : 
                                        campaign.status === "ENABLED" ? "status-enabled" : 
                                        campaign.status === "PAUSED" ? "status-paused" : 
                                        campaign.status === "ARCHIVED" ? "status-archived" : ""}
                              style={{
                                color: campaign.status === "DISABLED" ? "red" : 
                                      campaign.status === "ENABLED" ? "green" : 
                                      campaign.status === "PAUSED" ? "red" : 
                                      campaign.status === "ARCHIVED" ? "blue" : "black"
                              }}
                            >
                              {campaign.status}
                            </td>
                            <td>${campaign.budget.toFixed(2)}</td>
                            <td>{campaign.type}</td>
                            <td>{campaign.startDate}</td>
                            <td>{campaign.endDate || '-'}</td>
                            <td>{campaign.budgetType}</td>
                            <td>${campaign.spend.toFixed(2)}</td>
                            <td>${campaign.sales.toFixed(2)}</td>
                            <td>{campaign.acos}%</td>
                            <td>{campaign.roas}</td>
                            <td>{campaign.impressions}</td>
                            <td>${campaign.cpc}</td>
                            <td>{campaign.clicks}</td>
                            <td>{campaign.orders}</td>
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

export default Campaigns;
