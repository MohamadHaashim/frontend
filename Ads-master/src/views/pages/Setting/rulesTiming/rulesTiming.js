import React, { useEffect } from "react";
import CampaignSearch from "../campaignSearch/CampaignSearch";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.css";
import DataTable from "react-data-table-component";
import Spinner from "../../../other/Spinner/index";
import { tableStyle } from "../../../other/theme/tableStyle";
import TimeSelectModal from "./TimeSelectModal";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import {
  getRulesTime,
  deleteRulesTimingApi,
} from "../../../../api-wrapper/time-wrapper/ApiRulesTime";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import moment from "moment";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../../other/modal/DeleteModal";

function RulesTiming({ selectedCampagin, timeZoneCountry, switchTab }) {
  const [campaignIds, setcampaignIds] = useState();
  const [campaignModal, setCampaignModal] = useState(false);
  const [allIds, setAllIds] = useState([]);
  const [timingData, setTimingData] = useState();
  const [editId, setEditId] = useState();
  const dispatch = useDispatch();

  // timing modal //
  const [timeModal, setTimeModal] = useState(false);
  const [getTimesArr, setGetTimesArr] = useState([]);

  //get timings data

  const getTimings = (page, perPage) => {
    dispatch(handleLoader(true));
    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    getRulesTime(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res?.isSuccess) {
          setTimingData(res.data);
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        }
      })
      .catch((err) => {
        toast.error("somthing went wrong!!");
      });
  };

  useEffect(() => {
    if (switchTab == "rulesTiming") {
      getTimings();
    }
  }, [switchTab]);

  const columns = [
    {
      name: "Rules",
      selector: (row) => row.ruleName,
    },
    {
      name: "Times",
      selector: (row) => row.times,
      cell: (e) => {
        const timeArr = e?.times.map((item) =>
          moment(item, "HH:mm").format("hh:mm A")
        );
        const timeString = timeArr.join(", ");
        return <>{e.times?.length > 0 ? timeString : "-"}</>;
      },
    },
    {
      name: "Updated At",
      selector: (row) => row.updatedDateTime,
      cell: (e) =>
        e.updatedDateTime
          ? moment(e.updatedDateTime)
              .tz(timeZoneCountry && timeZoneCountry)
              .format("MM/DD/YYYY hh:mm:ss A z")
          : "-",
    },
    {
      name: "Action",
      selector: (row) => "Action",
      width: "250px",
      cell: (e) => (
        <div className="d-flex align-items-center">
          {e.times.length != 0 && (
            <AiOutlineDelete
              className="me-2"
              color={"red"}
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowDeleteModal(true);
                setDeleteId(e._id);
              }}
            />
          )}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-warning"
              onClick={() => {
                setEditId(e._id);
                setTimeModal(true);
                setGetTimesArr(e.times);
              }}
            >
              Scheduler Time
            </button>
          </div>
        </div>
      ),
    },
  ];

  // delete modal//
  const [deleteId, setDeleteId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // delete Time //

  const deleteHandler = () => {
    dispatch(handleLoader(true));
    deleteRulesTimingApi(deleteId)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message);
          getTimings();
          dispatch(handleLoader(false));
        } else {
          toast.error(res.message);
          dispatch(handleLoader(false));
        }
        setDeleteId();
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
    getTimings(currentPage, event);
  };

  const handleChangePage = (page) => {
    getTimings(page);
  };

  return (
    <>
      <div className="campaign_detail ">
        <div className="">
          <div className="row mb-3">
            <div className="col">
              <h4>Rules Schedules</h4>
            </div>
          </div>

          <div className="bg-white">
            <div className="p-0">
              <DataTable
                columns={columns}
                data={timingData}
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
          {/* time select modal */}
          <Modal show={timeModal} className="model rules_model " centered>
            <Modal.Header closeButton onClick={() => setTimeModal(false)}>
              <Modal.Title> Scheduler Time </Modal.Title>
            </Modal.Header>
            <TimeSelectModal
              getTimings={getTimings}
              setTimeModal={setTimeModal}
              getTimesArr={getTimesArr}
              editId={editId}
            />
          </Modal>

          {/* delete modal */}

          <DeleteModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            deleteHandler={deleteHandler}
            name={"Rules Timing"}
          />
        </div>
      </div>
    </>
  );
}

export default RulesTiming;
