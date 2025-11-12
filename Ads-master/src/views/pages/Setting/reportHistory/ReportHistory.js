import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { APIgetHistory } from "../../../../api-wrapper/reportHistory-wrapper/ApiReportHistory";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useDispatch } from "react-redux";
import { handleLoader } from "../../../../store/Action/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";
function ReportHistory({ selectedCampagin, timeZoneCountry, switchTab }) {
  const columns = [
    {
      name: "Report Id",
      selector: (row) => row.reportId,
      sortable: true,
    },
    {
      name: "Ad Product",
      selector: (row) => row.adProduct,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (e) => (
        <div>
          {e.status == "COMPLETED" || e.status == "SUCCESS" ? (
            <div style={{ color: "green" }}>{e.status}</div>
          ) : (
            <div style={{ color: "red" }}>{e.status}</div>
          )}
        </div>
      ),
    },

    {
      name: "Report Type",
      selector: (row) => row.reportTypeId,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.startDate,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.endDate,
      sortable: true,
    },
    {
      name: "Created At",
      selector: (row) => row.createdAt,
      sortable: true,
      cell: (e) => {
        return moment(e?.createdAt)
          .tz(timeZoneCountry && timeZoneCountry)
          .format("MM/DD/YYYY hh:mm:ss A z");
      },
    },
    {
      name: "Updated At",
      selector: (row) => row.updatedAt,
      sortable: true,
      cell: (e) => {
        return moment(e?.updatedAt)
          .tz(timeZoneCountry && timeZoneCountry)
          .format("MM/DD/YYYY hh:mm:ss A z");
      },
    },
  ];
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState();

  const getReportHandler = (page, perPage) => {
    dispatch(handleLoader(true));
    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    APIgetHistory(selectedCampagin?.profileId, data)
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
        toast.error("somthing went wrong!!");
      });
  };

  useEffect(() => {
    if (switchTab == "reportHistory") {
      getReportHandler();
    }
  }, [switchTab]);

  // pagination //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event));
    getReportHandler(currentPage, event);
  };

  const handleChangePage = (page) => {
    getReportHandler(page);
  };

  return (
    <div className="campaign_detail">
      <div className="">
        <div className="row mb-3">
          <div className="col">
            <h4>Report History</h4>
          </div>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportHistory;
