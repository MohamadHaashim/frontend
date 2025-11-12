import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import axios from "axios";
import LogoIcon from "../../../assets/brand/logo-icon.svg";
const columns: GridColDef[] = [
  { field: "billingId", headerName: "ID", width: 200 },
  { field: "paymentMethod", headerName: "Payment Method", width: 250 },
  { field: "description", headerName: "Description", width: 250 },
  { field: "issuedDate", headerName: "Issued Date", width: 150 },
  { field: "amount", headerName: "Amount", type: "number", width: 150 },
];
let rows: any = [];
function BillingTable() {
  let dataLength = 50;
  let currPage = 1;
  const [apiLoading, setApiLoading] = useState(false);
  const [perPage, setPerPage] = useState(50);
  const [lastPage, setLastPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [totalRow, setTotalRow] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setApiLoading(true);
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    const apiUrl =
      "https://api.aimosa.io/BillingAndPlaning/BillingHistory";

    const requestBody = {
      pageNumber: currPage,
      pageSize: dataLength,
      globalFilters: {
        searchText: ""
      },
    };
    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      });
      const responceData = await response.data;
      rows = responceData.result.data;
      let result = responceData.result;
      setTotalRow(result.total);
      setPerPage(result.perPage);
      setActivePage(result.currPage);
      setLastPage(result.lastPage);
      setApiLoading(false);
    } catch (error) {
      // Handle errors
      console.error("Error fetching data:", error);
    }
  };
  const applyDataLength = (e) =>{
    console.log("dataSize: ", e.target.value);
    dataLength = parseInt(e.target.value);
    fetchData();
  }
  const handleChange = (event, value: number) =>{
    currPage = value;
    fetchData();
  };
  return (
    <div
      style={{
        height: 450,
      }}
    >
      {!apiLoading ? (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            checkboxSelection={false}
            hideFooter={true}
          />
          <div className='custom-table-footer'>
            <Row>
              <Col md={5}>
                <form className='table-footer-left'>
                  <span>Show </span>
                  <label>
                    <select className="form-select" defaultValue={perPage} onChange={event =>applyDataLength(event)}>
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
                <div  className='table-footer-right'>
                  <Stack spacing={2}>
                    <Pagination count={lastPage} page={activePage} variant="outlined" shape="rounded" onChange={handleChange} />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div className="loading-text">
            <span className="logicon">
              {/* <img src={LogoIcon} alt="logo-small"></img> */}
            </span>
            <span>L</span>
            <span>O</span>
            <span>A</span>
            <span>D</span>
            <span>I</span>
            <span>N</span>
            <span>G</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default BillingTable;