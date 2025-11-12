import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { APIgetCampaignHistory } from "../../../../api-wrapper/campaignHistory-wrapper/ApiReportHistory";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useDispatch } from "react-redux";
import { handleLoader } from "../../../../store/Action/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";
import getSymbolFromCurrency from "currency-symbol-map";
import { DateRangePicker } from "rsuite";
import { format } from "date-fns";
import "rsuite/dist/rsuite.min.css";
// import moment from "moment-timezone";

import "./style.css"

function CampaignHistory({ selectedCampagin, timeZoneCountry, switchTab }) {
  const columns = [
    {
      name: "Name",
      id: "id",
      width: "150px",
      sortable: true,
      selector: (row) => row.runName,
    },
    // {
    //   name: "Campaign ID",
    //   id: "id",
    //   width: "150px",
    //   sortable: true,
    //   selector: (row) => row.campaignId,
    // },
    {
      name: "Campaigns",
      width: "350px",
      id: "name",
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Before Status",
      width: "150px",
      selector: (row) => row.fromStatus,
      sortable: true,
      cell: (e) => {
        return (
          <p
            className={`${e.fromStatus === "ENABLED" ? "enable" : ""}${e.fromStatus === "PAUSED" ? "pause" : ""
              }${e.fromStatus === "ARCHIVED" ? "archived" : ""}${e.fromStatus === "ENDED" ? "ended" : ""
              } p-0 m-0`}
          >
            {e.fromStatus ? e.fromStatus : "-"}
          </p>
        );
      },
    },
    {
      name: "After Status",
      width: "150px",
      selector: (row) => row.toStatus,
      sortable: true,
      cell: (e) => {
        return (
          <p
            className={`${e.toStatus === "ENABLED" ? "enable" : ""}${e.toStatus === "PAUSED" ? "pause" : ""
              }${e.toStatus === "ARCHIVED" ? "archived" : ""}${e.toStatus === "ENDED" ? "ended" : ""
              } p-0 m-0`}
          >
            {e.toStatus ? e.toStatus : "-"}
          </p>
        );
      },
    },

    {
      name: "Before Budget",
      selector: (row) => row.fromBudget,
      width: "150px",
      sortable: true,
      cell: (e) => {
        return (
          <>
            <div className="budgetBox">
              <div className="mt-2 px-1">
                <p className="p-0 m-0 tblHead d-flex justify-centent-center align-items-center">
                  {e.fromBudget ? (
                    <>
                      {getSymbolFromCurrency(e?.currencyCode)}
                      {e.fromBudget.toFixed(2)}
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      name: "After Budget",
      selector: (row) => row.toBudget,
      width: "150px",
      sortable: true,
      cell: (e) => {
        return (
          <>
            <div className="budgetBox">
              <div className="mt-2 px-1">
                <p className="p-0 m-0 tblHead d-flex justify-centent-center align-items-center">
                  {e.toBudget ? (
                    <>
                      {getSymbolFromCurrency(e?.currencyCode)}
                      {e.toBudget.toFixed(2)}
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
            </div>
          </>
        );
      },
    },
    {
      name: "Date & Time",
      selector: (row) => row.updatedAt,
      sortable: true,
      width: "250px",
      cell: (e) => {
        return moment(e?.updatedAt)
          .tz(timeZoneCountry && timeZoneCountry)
          .format("MM/DD/YYYY hh:mm:ss A z");
      },
    },
    {
      name: "Campaign Type",
      selector: (row) => row.type,
      width: "200px",
      sortable: true,
      cell: (e) => (
        <div className="flex-column">
          <p className="p-0 m-0 tblHead">{e.type}</p>
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

  const dispatch = useDispatch();
  const [allTableData, setAllTableData] = useState()
  const [tableData, setTableData] = useState();
  const [selectedDate, setselectedDate] = useState();
  const [date, setDate] = useState();
  const [campaignName, setcampaignName] = useState();
  const [timezone, setTimezone] = useState(
    selectedCampagin?.timezone
  );

  const getReportHandler = (page, perPage) => {
    dispatch(handleLoader(true));
    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
      searchCampaign: searchValue ? searchValue : "",
      startDate: date[0],
      endDate: date[1]
    };
    APIgetCampaignHistory(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {
          setTableData(res.data);
          setAllTableData(res.data)
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        } else {
          setTableData([]);
          setAllTableData([])
          toast.error(res.message);
          dispatch(handleLoader(false));
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong!!");
      });
  };

  const getReportHandlerForSearch = () => {
    dispatch(handleLoader(true));
    let data = {
      pageNo: currentPage,
      perPage: rowsPerPage,
      searchCampaign: searchValue ? searchValue : "",
      startDate: date[0],
      endDate: date[1]
    };
    APIgetCampaignHistory(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {
          setTableData(res.data);
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        } else {
          setTableData([]);
          toast.error(res.message);
          dispatch(handleLoader(false));
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong 2!!");
      });
  };

  useEffect(() => {
    if (switchTab == "campaignHistory") {
      getReportHandler();
    }
  }, [switchTab]);

  useEffect(() => {
    setDate([
      moment(new Date()).tz(selectedCampagin?.timezone && selectedCampagin?.timezone)?.format("YYYY-MM-DD"),
      moment(new Date())
        .tz(selectedCampagin?.timezone && selectedCampagin?.timezone)
        ?.format("YYYY-MM-DD"),
    ]);
  }, [])

  // pagination //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState()

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event));
    getReportHandler(currentPage, event);
  };

  const handleSearch = (event) => {
    if (event.target.value === "") {
      // setSearch(false)
      setTableData(allTableData)
    }

    setSearchValue(event.target.value)
  }

  const handleChangePage = (page) => {
    getReportHandler(page);
  };

  const dateChangeHandler = (e) => {
    let arr;
    if (e?.length == 0) {
      arr = [];
    } else {
      arr = [
        moment(e && e[0]).format("YYYY-MM-DD"),
        moment(e && e[1]).format("YYYY-MM-DD"),
      ];
    }

    setDate(arr);

    dispatch(handleLoader(true));
    let data = {
      pageNo: currentPage,
      perPage: rowsPerPage,
      searchCampaign: searchValue ? searchValue : "",
      startDate: arr[0],
      endDate: arr[1]
    };
    APIgetCampaignHistory(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {
          setTableData(res.data);
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        } else {
          setTableData([]);
          // toast.error(res.message);
          dispatch(handleLoader(false));
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong 2!!");
      });
  };

  const handleDateRangeClose = () => {
    // setDateRange([null, null]);
    // setDate([])
    setDate([
      moment(new Date()).startOf("month")?.format("YYYY-MM-DD"),
      moment(new Date())
        .tz(selectedCampagin?.timezone && selectedCampagin?.timezone)
        .endOf("month")
        ?.format("YYYY-MM-DD"),
    ]);


    // setDeveloperData(getAllDeveloperData);
    // setTableData(allTableData)

  };

  return (
    <div className="campaign_detail">
      <div className="">
        <div className="row row-cols-1 row-cols-lg-2 mb-3">
          <div className="col col-lg-4 my-2 my-lg-0">
            <h4>Campaign History</h4>
          </div>

          <div className="col col-lg-8">
            <div className=" row row-cols-1 row-cols-lg-2  d-flex justify-content-end">
              <div className="col col-lg-4 campaign_search">
                <input
                  type="text"
                  className="text_search"
                  placeholder="Search..."
                  onChange={handleSearch}
                />
                <button
                  className="search_go"
                  onClick={getReportHandlerForSearch}
                >
                  GO
                </button>
              </div>
              <div className="col col-lg-4 my-2 my-lg-0">
                <DateRangePicker
                  showOneCalendar
                  size="lg"
                  // onChange={handleDateRangeChange}
                  className="filter_date w-100"
                  placeholder="Select Date"
                  onChange={(e) => dateChangeHandler(e)}
                  format="yyyy-MM-dd"
                  value={[
                    date &&
                    date[0] !== undefined &&
                    moment(date[0], "YYYY-MM-DD").toDate(),

                    date &&
                    date[1] !== undefined &&
                    moment(date[1], "YYYY-MM-DD").toDate(),
                  ]}
                  // value={
                  //   date && date[0] !== undefined
                  //     ? moment(date[0], "YYYY-MM-DD").toDate()
                  //     : null // Pass the start date here
                  // }
                  placement="bottomEnd"
                  onClean={handleDateRangeClose}
                />
              </div>
            </div>
          </div>

          {/* <div className="col-2">
            <button
              className="btn btn btn-success"
              onClick={() => {
                setTableData(allTableData)
                setSearchValue("")
                setDate([
                  moment(new Date()).tz(selectedCampagin?.timezone && selectedCampagin?.timezone).startOf("month")?.format("YYYY-MM-DD"),
                  moment(new Date())
                    .tz(selectedCampagin?.timezone && selectedCampagin?.timezone)
                    .endOf("month")
                    ?.format("YYYY-MM-DD"),
                ]);
              }}
            >
              Clear
            </button> 
        </div> */}
        </div>
        <div className="bg-white">
          <div className="p-0">
            <DataTable
              columns={columns}
              data={tableData}
              pagination
              paginationServer
              onChangeRowsPerPage={handleChangeRowsPerPage}
              paginationPerPage={rowsPerPage}
              paginationTotalRows={totalRecords || 0}
              onChangePage={handleChangePage}
              customStyles={tableStyle}
              fixedHeader
              striped
            />
          </div>
        </div>
      </div>
    </div >
  );
}

export default CampaignHistory;
