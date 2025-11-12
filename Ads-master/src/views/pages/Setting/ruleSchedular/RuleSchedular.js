import React from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useState } from "react";
import TimingModal from "./TimingModal";
import { Modal } from "react-bootstrap";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import CampaignListModal from "./CampaignListModal";
import DeleteModal from "../../../other/modal/DeleteModal";
import {
  APIgetRuleSchedule,
  APIdeleteRuleSchedule,
} from "../../../../api-wrapper/ruleScheduler-wrapper/ApiRuleScheduler";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCampaign } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { Link } from "react-router-dom";
import moment from "moment";
function RuleSchedular({ selectedCampagin, timeZoneCountry, switchTab }) {
  const dispatch = useDispatch();

  const columns = [
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
      name: "# of Budget Rules",
      selector: (row) => row.campagin,
      cell: (e) => (
        <Link
          to
          onClick={() => {
            setSelectedModal(true);
            setListId(e.ruleNames);
          }}
        >
          {" "}
          {e.ruleIds?.length}
        </Link>
      ),
    },
    {
      name: "Updated At",
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
              setGetTimesArr(e.times);
              // setToTime(e.toTime)
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
              setcampaignIds(e.ruleIds);
            }}
          >
            Assign
          </button>
        </div>
      ),
    },
  ];
  const [tableData, setTableData] = useState([]);

  const [editId, setEditId] = useState("");

  // timing modal //
  const [addFlag, setaddFlag] = useState(false);
  const [timeModal, setTimeModal] = useState(false);
  const [getTimesArr, setGetTimesArr] = useState([{}]);

  // campaign modal //
  const [campaignModal, setCampaignModal] = useState(false);
  const [assignId, setAssignId] = useState();
  const [campaignIds, setcampaignIds] = useState();
  const [selectedCampaginId, setSelectedCampaginId] = useState();

  //get rule schedule data //

  const getRules = (page, perPage) => {
    dispatch(handleLoader(true));

    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    APIgetRuleSchedule(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res?.isSuccess) {
          setTableData(res.data);
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
    if (switchTab == "ruleSchedular") {
      getRules();
    }
  }, [switchTab]);

  // pagination //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event));
    getRules(currentPage, event);
  };

  const handleChangePage = (page) => {
    getRules(page);
  };

  // selected campaign  id //
  const [selectedModal, setSelectedModal] = useState(false);
  const [listId, setListId] = useState();

  // const getSelectedId = (ids) => {
  //     let arr = [];
  //     dispatch(handleLoader(true));
  //     getCampaign(selectedCampagin?.profileId)
  //         .then((res) => {
  //             if (res.isSuccess) {
  //                 dispatch(handleLoader(false));

  //                 // res?.data.map((el) => {
  //                 //     ids?.map((item) => {
  //                 //         if (el.campaignId == item) {
  //                 //             arr.push(el);
  //                 //         }
  //                 //     });
  //                 // });
  //                 setSelectedModal(true);
  //             } else {
  //                 dispatch(handleLoader(false));
  //                 toast.error(res.message);
  //             }
  //         })
  //         .catch((err) => {
  //             dispatch(handleLoader(false));
  //             toast.error(err);
  //         });

  //     setListId(arr);
  // };

  // delete modal//
  const [deleteId, setDeleteId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteHandler = () => {
    dispatch(handleLoader(true));
    APIdeleteRuleSchedule(deleteId)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message);
          getRules();
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

  return (
    <>
      <div className="campaign_detail ">
        <div className="">
          <div className="row">
            <div className="col">
              <h4>Rules Schedules</h4>
            </div>
            <div className="col">
              <button
                className=" blue_btn rule_btn mt-0"
                onClick={() => {
                  setTimeModal(true);
                  setEditId();
                  setaddFlag(true);
                }}
              >
                Create Schedule
              </button>
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

          {/* time select modal */}
          <Modal show={timeModal} className="model rules_model " centered>
            <Modal.Header closeButton onClick={() => setTimeModal(false)}>
              <Modal.Title>
                {editId ? "Edit Schedular Time" : "Add Scheduler Time"}{" "}
              </Modal.Title>
            </Modal.Header>
            <TimingModal
              selectedCampagin={selectedCampagin}
              getRules={getRules}
              getTimesArr={getTimesArr}
              setTimeModal={setTimeModal}
              editId={editId}
              addFlag={addFlag}
              setaddFlag={setaddFlag}
            />
          </Modal>
        </div>
        {/* campaign list */}

        <Modal show={campaignModal} className="model rules_model" centered>
          <Modal.Header closeButton onClick={() => setCampaignModal(false)}>
            <Modal.Title>List of Rules </Modal.Title>
          </Modal.Header>
          <CampaignListModal
            selectedCampagin={selectedCampagin}
            assignId={assignId}
            campaignIds={campaignIds}
            getRules={getRules}
            setCampaignModal={setCampaignModal}
            selectedCampaginId={selectedCampaginId}
            setSelectedCampaginId={setSelectedCampaginId}
          />
        </Modal>

        {/* selected campaign */}
        <Modal show={selectedModal} className="model rules_model" centered>
          <Modal.Header closeButton onClick={() => setSelectedModal(false)}>
            <Modal.Title>Associated Rules </Modal.Title>
          </Modal.Header>
          <div className="selected_id">
            {listId?.length == 0 ? (
              <h6 className="text-center">Rules Not Found</h6>
            ) : (
              listId?.map((el) => {
                return <p className="selected_list">{el}</p>;
              })
            )}
          </div>
        </Modal>

        {/* delete modal */}

        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteHandler={deleteHandler}
          name={"Rule Schedule"}
        />
      </div>
    </>
  );
}

export default RuleSchedular;
