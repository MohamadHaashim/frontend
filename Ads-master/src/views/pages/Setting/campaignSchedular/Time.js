import React from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useEffect } from "react";
import AddTime from "./AddTime";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "../../../other/modal/DeleteModal";
import CampaignSearch from "../campaignSearch/CampaignSearch";
import {
  APIgetTime,
  APIdeleteTime,
  APIstatus,
} from "../../../../api-wrapper/scheduler-wrapper/ApiTime";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import { APIupdateSchedule } from "../../../../api-wrapper/scheduler-wrapper/ApiSchedule";
import moment from "moment";
function Time({
  setDetailFlag,
  selectedCampagin,
  scheduleId,
  copyallIds,
  getSchedule,
}) {
  const dispatch = useDispatch();

  const detailDataCol = [
    {
      name: "Active",
      selector: (row) => row.isActive,

      cell: (e) => (
        <div className=" form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="isActive"
            style={{ width: "50px", height: "20px" }}
            onChange={(event) => statusHandler(event, e._id)}
            checked={e.isActive}
            value={e.isActive}
          />
        </div>
      ),
    },
    {
      name: "Day Of Week",
      selector: (row) => row.dayName,
    },
    {
      name: "Start Time",
      selector: (row) => moment(row.startTime, "HH:mm").format("hh:mm A"),
    },
    {
      name: "End Time",
      selector: (row) => moment(row.endTime, "HH:mm").format("hh:mm A"),
    },
    {
      name: "Action",
      selector: (row) => row.isActive,
      width: "250px",
      cell: (e) => (
        <div className="d-flex align-items-center">
          <GrEdit
            size={18}
            color={"green"}
            style={{ cursor: "pointer" }}
            className="me-2"
            onClick={() => {
              setTimeModal(true);
              setFormData(e);
              settimeId(e._id);
            }}
          />
          <AiOutlineDelete
            className="me-2"
            color={"red"}
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              settimeShowDeleteModal(true);
              settimeId(e._id);
            }}
          />
        </div>
      ),
    },
  ];

  const [detailData, setDetailData] = useState([]);
  const [formData, setFormData] = useState();
  const [addFlag, setAddFlag] = useState(false);
  const [timeId, settimeId] = useState();
  const [allIds, setAllIds] = useState([]);
  const [scheduleName, setScheduleName] = useState();

  const [excelSelected, setExcelSelected] = useState([]);


  // pagination //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event));
    getTime(currentPage, event);
  };
  const handleChangePage = (page) => {
    getTime(page);
  };

  //get  data //

  const getTime = (page, perPage) => {
    dispatch(handleLoader(true));

    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    APIgetTime(data, scheduleId)
      .then((res) => {
        if (res?.isSuccess) {
          setScheduleName(res.scheduleName);
          setDetailData(res.data);
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong!!");
      });
  };

  useEffect(() => {
    if (scheduleId) {
      getTime();
    }
  }, [scheduleId]);

  // delete time modal //

  const [timeshowDeleteModal, settimeShowDeleteModal] = useState(false);

  const deleteTimeHandler = () => {
    dispatch(handleLoader(true));
    APIdeleteTime(scheduleId, timeId)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message);
          getTime();
          dispatch(handleLoader(false));
        } else {
          toast.error(res.message);
          dispatch(handleLoader(false));
        }
        settimeId();
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong!!");
      });
  };

  // time modal //
  const [timeModal, setTimeModal] = useState(false);

  // status change //
  const statusHandler = (event, timeId) => {
    dispatch(handleLoader(true));

    let data = {
      isActive: event.target.checked,
    };
    APIstatus(data, scheduleId, timeId)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message || "Success");
          getTime();
          dispatch(handleLoader(false));
        } else {
          toast.error(res.message || "error");
          dispatch(handleLoader(false));
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error(err.message || "Something went wrong");
      });
  };

  const campaignListHandler = () => {
    const concatenatedArray = allIds;
    const newArray = concatenatedArray.map((element) => String(element));

    let data = {
      campaignIds: newArray
    };


    APIupdateSchedule(scheduleId, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          toast.success(res.message);
          setDetailFlag(false)
          getSchedule();
        } else {
          dispatch(handleLoader(false));
          toast.error(res.message);
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("Something went wrong, please try again");
      });
  };
  useEffect(() => {
    if (copyallIds) {
      setAllIds(copyallIds);
    }
  }, [copyallIds]);

  return (
    <>
      <div className="time">
        <div className="row mb-3">
          <div className="col-6">
            <h4>{scheduleName}</h4>
          </div>
          <div className="col-6 d-flex align-items-center justify-content-end">
            <button
              className="mb-0 blue_btn rule_btn mt-0"
              onClick={() => setDetailFlag(false)}
            >
              Back To Schedules
            </button>
            <button
              className=" blue_btn border_btn mt-0"
              onClick={() => {
                setTimeModal(true);
                setAddFlag(true);
                settimeId();
              }}
            >
              Add Time
            </button>
          </div>
        </div>

        <div className="bg-white">
          <div className="p-0">
            <DataTable
              columns={detailDataCol}
              data={detailData}
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

        {/* campaign detail */}
        <div className="row">
          <h5>Associated Campaigns</h5>

          <CampaignSearch
            campaignIds={copyallIds}
            selectedCampagin={selectedCampagin}
            allIds={allIds}
            setAllIds={setAllIds}
            excelSelected={excelSelected}
            setExcelSelected={setExcelSelected}
          />
        </div>

        <div className="d-flex justify-content-center">
          <button
            className="btn cancel col-3 m-2 "
            type="button"
            onClick={() => campaignListHandler()}
          >
            Save
          </button>
        </div>

        {/* add time modal */}

        <Modal show={timeModal} className="model rules_model " centered>
          <Modal.Header closeButton onClick={() => setTimeModal(false)}>
            <Modal.Title>{timeId ? "Edit" : "Add"} Time </Modal.Title>
          </Modal.Header>
          <AddTime
            setTimeModal={setTimeModal}
            scheduleId={scheduleId}
            formData={formData}
            setFormData={setFormData}
            addFlag={addFlag}
            setAddFlag={setAddFlag}
            getTime={getTime}
            timeId={timeId}
          />
        </Modal>

        {/* delete time modal */}

        <DeleteModal
          showDeleteModal={timeshowDeleteModal}
          setShowDeleteModal={settimeShowDeleteModal}
          deleteHandler={deleteTimeHandler}
          name={"Time"}
        />
      </div>
    </>
  );
}

export default Time;
