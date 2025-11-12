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
import {
  getCampaignTime,
  deleteTimingApi,
} from "../../../../api-wrapper/time-wrapper/ApiCampaignTime";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Link } from "react-router-dom";
import { getCampaign } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "../../../other/modal/DeleteModal";
import CampaignListModal from "./CampaignListModal";
function CampaignTiming({ selectedCampagin, timeZoneCountry, switchTab }) {
  const [campaignIds, setcampaignIds] = useState();
  const [campaignModal, setCampaignModal] = useState(false);
  const [allIds, setAllIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timingData, setTimingData] = useState();
  const [selectedCampaginId, setSelectedCampaginId] = useState();

  // timing modal //
  const [timeModal, setTimeModal] = useState(false);
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [editId, setEditId] = useState("");
  const [assignId, setAssignId] = useState();

  // pagination //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);

  // delete modal//
  const [deleteId, setDeleteId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const columns = [
    {
      name: "From Time",
      selector: (row) => moment(row.fromTime, "HH:mm").format("hh:mm A"),
    },
    {
      name: "To Time",
      selector: (row) => moment(row.toTime, "HH:mm").format("hh:mm A"),
    },
    {
      name: "Assign Campaign",
      sortable: true,
      cell: (e) => {
        return (
          <>
            {e?.campaignIds?.length == 0 ? (
              0
            ) : (
              <Link
                className="rule_type"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  getSelectedId(e.campaignIds);
                }}
              >
                {e?.campaignIds?.length}
              </Link>
            )}
          </>
        );
      },
    },
    {
      name: "Updated At",
      sortable: true,
      selector: (row) => row.updatedAt,
      cell: (e) => {
        return moment(e?.updatedAt)
          .tz(timeZoneCountry && timeZoneCountry)
          .format("MM/DD/YYYY hh:mm:ss A z");
      },
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
              setFromTime(e.fromTime);
              setToTime(e.toTime);
              setEditId(e._id);
            }}
          />
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
          <button
            className="btn btn-warning"
            onClick={() => {
              setCampaignModal(true);
              setAssignId(e._id);
              setcampaignIds(e.campaignIds);
            }}
          >
            Assign
          </button>
        </div>
      ),
    },
  ];

  // selected campaign  id //
  const [selectedModal, setSelectedModal] = useState(false);
  const [listId, setListId] = useState();

  const getSelectedId = (ids) => {
    let arr = [];
    dispatch(handleLoader(true));
    getCampaign(selectedCampagin?.profileId)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));

          res.data.map((el) => {
            ids.map((item) => {
              if (el.campaignId == item) {
                arr.push(el);
              }
            });
          });
          setSelectedModal(true);
        } else {
          dispatch(handleLoader(false));
          toast.error(res.message);
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error(err);
      });

    setListId(arr);
  };

  //get timings data

  const getTimings = (page, perPage) => {
    dispatch(handleLoader(true));

    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    getCampaignTime(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res?.isSuccess) {
          setTimingData(res.data);
          dispatch(handleLoader(false));
          setTotalRecords(res?.totalRecords);
          setcurrentPage(res.currentPageNo);
        } else {
          dispatch(handleLoader(false));
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong!!");
      });
  };

  useEffect(() => {
    if (switchTab == "campaignTiming") {
      getTimings();
    }
  }, [switchTab]);

  // delete Time //

  const deleteHandler = () => {
    dispatch(handleLoader(true));
    deleteTimingApi(deleteId)
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

  // edit Timing //

  return (
    <>
      <div className="campaign_detail ">
        <div className="">
          <div className="row">
            <div className="col">
              <h4>Campaign Timing</h4>
            </div>
            <div className="col">
              <button
                className=" blue_btn rule_btn mt-0"
                onClick={() => {
                  setTimeModal(true);
                  setFromTime(null);
                  setToTime(null);
                  setEditId("");
                }}
              >
                Add Scheduler Time
              </button>
            </div>
          </div>

          <div className="bg-white">
            <div className="p-0">
              <DataTable
                columns={columns}
                data={timingData}
                pagination
                paginationServer
                // onChangeRowsPerPage={handleChangeRowsPerPage}
                // paginationPerPage={rowsPerPage}
                // paginationTotalRows={totalRecords || 0}
                // onChangePage={handleChangePage}
                customStyles={tableStyle}
                fixedHeader
              />
            </div>
          </div>

          {/* time select modal */}
          <Modal show={timeModal} className="model rules_model " centered>
            <Modal.Header closeButton onClick={() => setTimeModal(false)}>
              <Modal.Title>
                {editId ? "Edit Schedular Time" : "Add Scheduler Time"}{" "}
              </Modal.Title>
            </Modal.Header>
            <TimeSelectModal
              setTimeModal={setTimeModal}
              fromTime={fromTime}
              setFromTime={setFromTime}
              toTime={toTime}
              setToTime={setToTime}
              timeZoneCountry={timeZoneCountry}
              selectedCampagin={selectedCampagin}
              editId={editId}
              getTimings={getTimings}
            />
          </Modal>
        </div>
        {/* campaign list */}

        <Modal show={campaignModal} className="model rules_model" centered>
          <Modal.Header closeButton onClick={() => setCampaignModal(false)}>
            <Modal.Title>List of Campaigns </Modal.Title>
          </Modal.Header>
          <CampaignListModal
            selectedCampagin={selectedCampagin}
            assignId={assignId}
            campaignIds={campaignIds}
            getRules={getTimings}
            setCampaignModal={setCampaignModal}
            selectedCampaginId={selectedCampaginId}
            setSelectedCampaginId={setSelectedCampaginId}
          />
        </Modal>

        {/* selected campaign */}
        <Modal show={selectedModal} className="model rules_model" centered>
          <Modal.Header closeButton onClick={() => setSelectedModal(false)}>
            <Modal.Title>Associated Campaigns </Modal.Title>
          </Modal.Header>
          <div className="selected_id">
            {listId?.length == 0 ? (
              <h6 className="text-center">Campaigns Not Found</h6>
            ) : (
              listId?.map((el) => {
                return <p className="selected_list">{el.name}</p>;
              })
            )}
          </div>
        </Modal>

        {/* delete modal */}

        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteHandler={deleteHandler}
          name={"Campaign Timing"}
        />
      </div>
    </>
  );
}

export default CampaignTiming;
