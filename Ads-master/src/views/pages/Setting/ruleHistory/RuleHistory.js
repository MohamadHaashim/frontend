import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { APIgetRuleHistory } from "../../../../api-wrapper/ruleHistory-wrapper/ApiRuleHistory";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useDispatch } from "react-redux";
import { handleLoader } from "../../../../store/Action/loader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";

function RuleHistory({ selectedCampagin, timeZoneCountry, switchTab }) {
  const columns = [
    {
      name: "Rule Name",
      selector: (row) => row.ruleName,
      sortable: true,
      cell: (e) => {
        return e?.ruleId?.ruleName ? e?.ruleId?.ruleName : "-";
      },
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (e) => (
        <div>
          {e.status == "COMPLETED" ? (
            <div style={{ color: "green" }}>{e.status}</div>
          ) : (
            <div style={{ color: "red" }}>{e.status}</div>
          )}
        </div>
      ),
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
    APIgetRuleHistory(selectedCampagin?.profileId, data)
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
    if (switchTab == "ruleHistory") {
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
            <h4>Rule History</h4>
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

export default RuleHistory;
