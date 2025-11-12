import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  getReports,
  generateReports,
  getRun,
} from "../../../../api-wrapper/rule-wrapper/ApiReports";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useDispatch } from "react-redux";
import { handleLoader } from "../../../../store/Action/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";
function Reports({ selectedCampagin, timeZoneCountry, switchTab }) {
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
  const [reportsData, setReportsData] = useState();

  const getReportHandler = (page, perPage) => {
    dispatch(handleLoader(true));
    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    getReports(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {
          setReportsData(res.data);
          setUpdatedDate(res.data[0]);
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        } else {
          setReportsData([]);
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
    if (switchTab == "report") {
      getReportHandler();
    }
  }, [switchTab]);

  const GenerateReportHandler = () => {
    dispatch(handleLoader(true));
    generateReports(selectedCampagin?.profileId)
      .then((res) => {
        if (res.isSuccess) {
          getReportHandler();
          toast.success(res.message);

          dispatch(handleLoader(false));
        } else {
          toast.error(res.message);
          dispatch(handleLoader(false));
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong!!");
      });
  };

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

  // date condition //
  const [statusLabel, setStatusLabel] = useState("Generate Report");
  const [updatedDate, setUpdatedDate] = useState("");

  useEffect(() => {
    if (updatedDate) {
      if (
        moment().tz(timeZoneCountry).format("MM/DD/YYYY") ==
          moment(updatedDate.endDate).format("MM/DD/YYYY") &&
        updatedDate.status != "COMPLETED"
      ) {
        setStatusLabel("Check Report Status");
      } else {
        setStatusLabel("Generate Report");
      }
    }
  }, [updatedDate]);
  return (
    <>
      <div className="campaign_detail">
        <div className="">
          <div className="row mb-3">
            <div className="col">
              <h4>Reports</h4>
            </div>
            <div className="col">
              {/* <button className={statusLabel == 'Generate Report' ? "blue_btn rule_btn mt-0" :"border_btn rule_btn p-2 rule_btn mt-0"} onClick={() => GenerateReportHandler()}>
                                {statusLabel}
                            </button> */}
            </div>
          </div>

          <div className="bg-white">
            <div className="p-0">
              <DataTable
                columns={columns}
                data={reportsData}
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
    </>
  );
}

export default Reports;
