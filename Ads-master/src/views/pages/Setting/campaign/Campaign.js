import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { tableStyle } from "../../../other/theme/tableStyle";
import { listAllCampaigns } from "../../../../store/Action/amazonAction";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { AiFillFilter } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import SelectField from "../../../other/SelectField";
import moment from "moment-timezone";
import { handleLoader } from '../../../../store/Action/loader';
import Spinner from "../../../other/Spinner";
import { ApiCampaignRefresh } from '../../../../api-wrapper/auth-wrapper/ApiAuth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Campaign = ({ selectedCampagin, campaignFlag, timeZoneCountry, switchTab = { switchTab } }) => {
  const dispatch = useDispatch();

  const [tblData, setTblData] = useState([]);
  const [id, setId] = useState();
  const [nPages, setNpages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadTbl, setLoadTbl] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState({ value: "", label: "All" });
  const [status, setStatus] = useState({ value: "", label: "All" });
  const [lastUpdated, setlastUpdated] = useState();
  const [pageNo, setpageNo] = useState(1);


  const [boxArr, setboxArr] = useState();

  // search //
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // rules modal //
  const [rulesModal, setRulesModal] = useState(false);

  const columns = [
    {
      name: "Active",
      selector: (row) => row.active,
      id: "Active",
      // style: () => ({
      //     position: "sticky",
      //     left: 0,
      //     zIndex: 1,
      // }),
      cell: (e) => (
        <div className=" form-check form-switch">
          <input
            className="form-check-input"
            checked={e.status === "ENABLED" ? true : false}
            value={true}
            type="checkbox"
            name="isActive"
            style={{ width: "50px", height: "20px" }}
            disabled
          />
        </div>
      ),
    },
    {
      name: "Campaign ID",
      width: "150px",
      //id: "id",
      sortable: true,
      // style: () => ({
      //     position: "sticky",
      //     left: '100px',
      //     zIndex: 1,
      // }),
      selector: (row) => row.campaignId,
    },
    {
      name: "Campaign Name",
      width: "350px",
      //id: "name",
      sortable: true,
      // style: () => ({
      //     position: "sticky",
      //     left: '250px',
      //     backgroundColor: 'white',
      //     zIndex: 1,
      // }),
      selector: (row) => row.name,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (e) => {
        return (
          <p
            className={`${e.status === "ENABLED" ? "enable" : ""}${e.status === "PAUSED" ? "pause" : ""
              }${e.status === "ARCHIVED" ? "archived" : ""}${e.status === "ENDED" ? "ended" : ""
              } p-0 m-0`}
          >
            {e.status}
          </p>
        );
      },
    },
    {
      name: "Budget",
      selector: (row) => row.budget,
      width: "100px",
      sortable: true,
      cell: (e) => {
        return (
          <>
            <div className="budgetBox">
              <div className="mt-2 px-1">
                <p className="p-0 m-0 tblHead d-flex justify-centent-center align-items-center">
                  {getSymbolFromCurrency(e?.currencyCode)}
                  {e.budget.toFixed(2)}
                </p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      name: "Campaign Type",
      selector: (row) => row.type,
      width: "180px",
      sortable: true,
      cell: (e) => (
        <div className="flex-column">
          <p className="p-0 m-0 tblHead">{e.type}</p>
        </div>
      ),
    },

    {
      name: "Start Date",
      selector: (row) => row.startDate,
      width: "120px",
      sortable: true,
      cell: (e) => (
        <div className=" mt-2 px-1">
          <p className="p-0 m-0 tblHead">{e.startDate || "-"}</p>
        </div>
      ),
    },
    {
      name: "End Date",
      selector: (row) => row.endDate,
      width: "120px",
      sortable: true,
      cell: (e) => (
        <div className="mt-2 px-1">
          <p className="p-0 m-0 tblHead">{e.endDate || "-"}</p>
        </div>
      ),
    },

    {
      name: "Budget Type",
      selector: (row) => row.budgetType,
      width: "100px",
      sortable: true,
      cell: (e) => (
        <div className="budgetBox">
          <p className="p-0 m-0 tblHead">{e.budgetType}</p>
        </div>
      ),
    },
    {
      name: "Spend",
      selector: (row) => row.spend,
      sortable: true,
      cell: (e) => (
        <div>
          {getSymbolFromCurrency(e?.currencyCode)}
          {e.spend.toFixed(2)}
        </div>
      ),
    },
    {
      name: "Sales",
      selector: (row) => row.sales,
      sortable: true,
      cell: (e) => (
        <div>
          {getSymbolFromCurrency(e?.currencyCode)}
          {e.sales.toFixed(2)}
        </div>
      ),
    },
    {
      name: "ACOS",
      selector: (row) => row.acos,
      sortable: true,
      cell: (e) => <div>{e.acos.toFixed(2)}%</div>,
    },
    {
      name: "ROAS",
      selector: (row) => row.roas,
      sortable: true,
      cell: (e) => <div>{e.roas}</div>,
    },
    {
      name: "Impressions",
      selector: (row) => row.impressions,
      sortable: true,
      cell: (e) => <div>{e.impressions}</div>,
    },
    {
      name: "CPC",
      selector: (row) => row.cpc,
      sortable: true,
      cell: (e) => (
        <div>
          {getSymbolFromCurrency(e?.currencyCode)}
          {e.cpc.toFixed(2)}
        </div>
      ),
    },
    {
      name: "Clicks",
      selector: (row) => row.clicks,
      sortable: true,
    },
    {
      name: "Orders",
      selector: (row) => row.orders,
      sortable: true,
    },
  ];

  const profileData = useSelector((state) => state.data.profileData);


  useEffect(() => {
    if (switchTab == 'campaign') {

      setId(selectedCampagin?.profileId);
      handleCampaign(1, 10, selectedCampagin?.profileId);

    }

  }, [switchTab, profileData, campaignFlag]);

  const handleCampaign = async (pgno, perPage, id, searchText) => {
    setLoadTbl(true);
    // dispatch(handleLoader(true));

    let data = {
      id: id ? id : selectedCampagin?.profileId,
      params: {
        pageNo: pgno || 1,
        perPage: perPage || 10,
        type: filterType?.value,
        status: status?.value,
        currencyCode: selectedCampagin?.currencyCode,
        search: searchText ? searchText : search,
        timezone: selectedCampagin?.timezone,
      },
    };
    setShowFilter(false);

    try {


      const res = await dispatch(listAllCampaigns(data));

      setLoadTbl(false);


      setNpages(res?.data?.totalRecords || 0);
      setlastUpdated(res.data?.lastUpdateDate);

      if (res?.data?.totalRecords > 0) {
        setTblData(res?.data?.data);
      } else {
        setTblData([]);
      }
    } catch (e) {
      toast.error("Somthing Went Wrong !!")
      setLoadTbl(false);
    }
  };

  const handleChangePage = (page) => {
    handleCampaign(page, rowsPerPage, id, search);
    setpageNo(page)
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    handleCampaign(1, event, id, search);
  };

  const typeOptions = [
    {
      value: "",
      label: "All",
    },
    {
      value: "Sponsored Products",
      label: "Sponsored Products",
    },
    {
      value: "Sponsored Brands",
      label: "Sponsored Brands",
    },
    {
      value: "Sponsored Display",
      label: "Sponsored Display",
    },
  ];

  const statusOptions = [
    {
      value: "",
      label: "All",
    },
    {
      value: "ENABLED",
      label: "Enabled",
    },
    {
      value: "PAUSED",
      label: "Paused",
    },
    {
      value: "ARCHIVED",
      label: "Archived",
    },
    {
      value: "ENDED",
      label: "Ended",
    },
  ];

  const searchHandler = (e) => {
    if (e.target.value == "") {
      setSearch("");
      handleCampaign(1, rowsPerPage, id, "");
    } else {
      setSearch(e.target.value);
    }
  };

  const HandleRefreh = () => {
    setLoadTbl(true);
    let data = {

      pageNo: pageNo || 1,
      perPage: rowsPerPage || 10,
      type: filterType?.value,
      status: status?.value,
      currencyCode: selectedCampagin?.currencyCode,
      search: search,
      timezone: selectedCampagin?.timezone,
    }

    ApiCampaignRefresh(selectedCampagin?.profileId, data)
      .then((res) => {


        setLoadTbl(false);

        setNpages(res?.totalRecords || 0);
        setlastUpdated(res?.lastUpdateDate);
        if (res?.totalRecords > 0) {
          toast.success(res.message)
          setTblData(res?.data);
        } else {
          setTblData([]);
        }
      }).catch((err) => {
        toast.error("Somthing Went Wrong !!")
        setTblData([]);
      });
  }




  return (
    <>
      {
        loadTbl && <div className="loader">
          <Spinner />
        </div>
      }
      <div className="container-fluid ">

      </div>

      <div
        className="container-fluid  form_group p-0 m-0"
        style={{ width: "100%" }}
      >
        {!loadTbl && (
          <div className="row d-flex align-items-center mb-4">
            <div className="col-4 campaign_search">
              <input
                type="text"
                className="text_search"
                placeholder="Search..."
                onChange={(e) => {
                  searchHandler(e);
                }}
              />
              <button
                className="search_go"
                onClick={() => handleCampaign(1, rowsPerPage, id, search)}
              >
                GO
              </button>


            </div>
            <div className="col-1 ">
              <button className="filter_icon" onClick={() => HandleRefreh()}>Refresh</button>
            </div>

            <div className="col-6 text-end">
              {tblData?.length > 0 && lastUpdated && (
                <p className="mb-0">
                  <b>Last Updated Date & Time : </b>
                  {moment(lastUpdated)
                    .tz(timeZoneCountry)
                    .format("MM/DD/YYYY hh:mm:ss A z")}
                </p>
              )}
            </div>
            <div className="col-1 text-end">
              <button className="filter_icon" onClick={() => setShowFilter(true)}>
                <AiFillFilter size={16} color="white" />
              </button>
            </div>
          </div>
        )}


        <Modal
          show={showFilter}
          className="model"
          centered
          style={{ overflow: "visible" }}
        >
          <Modal.Header closeButton onClick={() => setShowFilter(false)}>
            <Modal.Title>Filter</Modal.Title>
          </Modal.Header>
          <div className="p-3">
            <div className="row">
              <div className="col-12">
                <label className="mb-2">Type</label>
                <div className="" style={{ width: "100%" }}>
                  <SelectField
                    handleChange={(e) => {
                      setFilterType(e);
                    }}
                    name="types"
                    options={typeOptions}
                    value={filterType}
                    label="Select Type.."
                  />
                </div>
              </div>

              <div className="col-12 mt-2">
                <label className="mb-2">Status</label>
                <div className="" style={{ width: "100%" }}>
                  <SelectField
                    handleChange={(e) => {
                      setStatus(e);
                    }}
                    name="status"
                    options={statusOptions}
                    value={status}
                    label="Select Status.."
                  />
                </div>
              </div>
            </div>

            <div className="col-12 d-flex justify-content-center pt-3">
              <button
                className="btn cancel col-3 m-2"
                type="button"
                onClick={() => {
                  setShowFilter(false);
                  setFilterType({ value: "", label: "All" });
                  setStatus({ value: "", label: "All" });
                  handleCampaign();
                }}
              >
                Cancel
              </button>
              <button
                className="btn save col-3 m-2"
                onClick={() => handleCampaign(1, rowsPerPage, id, search)}
              >
                Search
              </button>
            </div>
          </div>
        </Modal>
        <div className="bg-white">
          <div className="p-0">
            <DataTable
              columns={columns}
              data={tblData}
              pagination
              paginationServer
              onChangeRowsPerPage={handleChangeRowsPerPage}
              paginationPerPage={rowsPerPage}
              paginationTotalRows={nPages || 0}
              onChangePage={handleChangePage}
              customStyles={tableStyle}
              fixedHeader

            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Campaign;
