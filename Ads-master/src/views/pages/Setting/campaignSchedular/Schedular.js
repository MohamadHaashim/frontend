import React from "react";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tableStyle } from "../../../other/theme/tableStyle";
import { useState } from "react";
import AddScheduler from "./AddScheduler";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from "../../../other/modal/DeleteModal";
import Time from "./Time";
import {
  APIgetSchedule,
  APIdeleteSchedule,
  getAssignCampaignScheduler,
  APIexportSchedule
} from "../../../../api-wrapper/scheduler-wrapper/ApiSchedule";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import { getAssignCampaign } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import moment from "moment";
import ReactPaginate from 'react-paginate';
import * as xlsx from "xlsx";
function Schedular({ selectedCampagin, timeZoneCountry, switchTab }) {
  const dispatch = useDispatch();

  const [detailFlag, setDetailFlag] = useState(false);
  const [scheduleId, setScheduleId] = useState(null);

  const [copyallIds, setCopyAllIds] = useState([]);
  const [dummyId, setdummyId] = useState();
  const [dummyRuleId, setdummyRuleId] = useState();
  useEffect(() => {
    setDetailFlag(false);
  }, [switchTab]);

  // ---------------------------- schedule ------------------------//
  const columns = [
    {
      name: "Schedule Name",
      selector: (row) => row.scheduleName,
      cell: (e) => (
        <Link
          to
          onClick={() => {
            setDetailFlag(true);
            setScheduleId(e._id);
            setCopyAllIds(e.campaignIds);
          }}
        >
          {e.scheduleName}
        </Link>
      ),
    },
    {
      name: "# of Campaigns",
      selector: (row) => row.campagin,
      cell: (e) => (
        <Link
          to
          onClick={() => {
            setdummyId(e.campaignIds);
            setdummyRuleId(e._id);
            getSelectedId(e.campaignIds, e._id);
          }}
        >
          {" "}
          {e.campaignIds.length}
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
              setEditId(e._id);
              setAddSchedulerModal(true);
              setEditData(e);
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
        </div>
      ),
    },
  ];

  const [selectedModal, setSelectedModal] = useState(false);
  const [listId, setListId] = useState();
  const getSelectedId = (ids, id, searcha) => {

    dispatch(handleLoader(true));
    let data = {
      search: searcha ? '' : searchCampaign,
      pageNo: searchCampaign ? 1 : ListcurrentPage,
      perPage: 100
    }

    getAssignCampaignScheduler(id ? id : dummyRuleId, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false))
          setListId(res.data);
          setSelectedModal(true);
          setTotalData(res.totalRecords)
          setListCurrentPage(res.currentPageNo)
        } else {
          dispatch(handleLoader(false));
          toast.error(res.message);
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error(err);
      });
  };
  const dummyCall = () => {
    setsearchCampaign("")
    let arr = [];
    let findData = dummyId
    dispatch(handleLoader(true));
    let data = {
      search: '',
      pageNo: ListcurrentPage,
      perPage: 100
    }

    getAssignCampaignScheduler(dummyRuleId, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          setTotalData(res.totalRecords)
          setListId(res.data);
          setListCurrentPage(res.currentPageNo)
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

  }
  const [scheduleData, setScheduleData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [addFlag, setAddFlag] = useState(false);

  // add schedule modal //
  const [addSchedulerModal, setAddSchedulerModal] = useState(false);

  //delete schedule modal //
  const [deleteId, setDeleteId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const deleteHandler = () => {
    dispatch(handleLoader(true));
    APIdeleteSchedule(deleteId)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message);
          getSchedule();
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
  const [searchCampaign, setsearchCampaign] = useState("")
  const [totalData, setTotalData] = useState(100);
  const [ListcurrentPage, setListCurrentPage] = useState(1);

  const handlePageChange = event => {
    setListCurrentPage(event.selected + 1)

  }
  useEffect(() => {
    if (switchTab == "scheduler") {
      getSelectedId()
    }

  }, [ListcurrentPage]);

  const handleSearch = e => {

    setsearchCampaign(e.target.value)

  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event));
    getSchedule(currentPage, event);
  };
  const handleChangePage = (page) => {
    getSchedule(page);
  };

  //get  data //

  const getSchedule = (page, perPage) => {
    dispatch(handleLoader(true));

    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    APIgetSchedule(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res?.isSuccess) {
          setScheduleData(res.data);
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
    if (switchTab == "scheduler") {
      getSchedule();
    }
  }, [switchTab]);

  const HandleExports = () => {
    dispatch(handleLoader(true));
    APIexportSchedule(selectedCampagin?.profileId)
      .then((res) => {
        if (res?.isSuccess) {
          const workbook = xlsx.utils.book_new();

          // Create worksheets for each dataset
          const scheduleData = res.schedules.map(item => [item.scheduleName, item.dayName, item.startTime, item.endTime]);
          const scheduleWorksheet = xlsx.utils.aoa_to_sheet([['Schedule Name', 'Day', 'Start Time', 'End Time'], ...scheduleData]);

          const campaignData = res.campaigns.map(item => [item.campaignId, item.campaignName, item.scheduleName]);
          const campaignWorksheet = xlsx.utils.aoa_to_sheet([['Campaign ID', 'Campaign Name', 'Schedule Name'], ...campaignData]);

          // Add worksheets to the workbook with specific sheet names
          xlsx.utils.book_append_sheet(workbook, scheduleWorksheet, 'Schedules');
          xlsx.utils.book_append_sheet(workbook, campaignWorksheet, 'Campaigns');

          // Generate the Excel file and create a download link
          const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
          const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'export-schedules.xlsx';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          dispatch(handleLoader(false));
          toast.success("Export Schedule Download successfully!!");
        }
        else {
          dispatch(handleLoader(false));
        }
      }).catch((err) => {
        dispatch(handleLoader(false));
        toast.error("somthing went wrong!!");
      });
  }

  return (
    <>
      <div className="campaign_detail scheduler">
        {detailFlag ? (
          <Time
            setDetailFlag={setDetailFlag}
            selectedCampagin={selectedCampagin}
            scheduleId={scheduleId}
            getSchedule={getSchedule}
            copyallIds={copyallIds}

          />
        ) : (
          <div className="">
            <div className="row">
              <div className="col">
                <h4>Campaign Schedules</h4>
              </div>
              <div className="col">

                <button
                  className=" blue_btn rule_btn mt-0"
                  onClick={() => {
                    setAddFlag(true);
                    setEditId("");
                    setAddSchedulerModal(true);
                  }}
                >
                  Create Schedule
                </button>
                <button
                  className=" blue_btn rule_btn mt-0"
                  onClick={() => HandleExports()}
                >
                  Export Schedules
                </button>
              </div>
            </div>
            <div className="bg-white">
              <div className="p-0">
                <DataTable
                  columns={columns}
                  data={scheduleData}
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

            {/* add scheduler modal */}

            <Modal
              show={addSchedulerModal}
              className="model rules_model "
              centered
            >
              <Modal.Header
                closeButton
                onClick={() => setAddSchedulerModal(false)}
              >
                <Modal.Title>{editId ? "Edit" : "Add"} Schedule</Modal.Title>
              </Modal.Header>
              <AddScheduler
                addSchedulerModal={addSchedulerModal}
                setAddSchedulerModal={setAddSchedulerModal}
                selectedCampagin={selectedCampagin}
                editId={editId}
                editData={editData}
                getSchedule={getSchedule}
                addFlag={addFlag}
                setAddFlag={setAddFlag}
              />
            </Modal>

            {/* selected campaign */}
            <Modal show={selectedModal} className="model rules_model" centered size="lg">
              <Modal.Header closeButton onClick={() => setSelectedModal(false)}>
                <Modal.Title>Associated Campaigns </Modal.Title>
              </Modal.Header>
              <Modal.Body >
                <div className='budget_campaign_listing'>

                  <div className="budget_campaign">
                    <input
                      type="text"
                      className="text_search"
                      placeholder="Search Here..."
                      value={searchCampaign}
                      onChange={(e) => handleSearch(e)}
                    />
                    <button
                      className="blue_btn ms-2"
                      onClick={() => { getSelectedId() }}
                    >
                      Search
                    </button>
                    <button
                      className="border_btn ms-2"
                      onClick={() => { dummyCall() }}
                    >
                      Reset
                    </button>


                  </div>
                  <div className="select_list">
                    {listId?.length == 0 ? (
                      <h6 className="text-center">Campaigns Not Found</h6>
                    ) : (
                      listId?.map((el) => {
                        return <p className="data_lisiting">{el.name}</p>;
                      })
                    )}

                  </div>
                  {
                    listId?.length != 0 &&
                    <ReactPaginate
                      previousLabel="<<"
                      nextLabel=">>"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakLabel="..."
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      pageCount={totalData / 100}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={5}
                      onPageChange={handlePageChange}
                      containerClassName="pagination"
                      activeClassName="active"
                      forcePage={ListcurrentPage - 1}

                    />
                  }
                </div>
              </Modal.Body>
            </Modal>

            {/* delete modal */}

            <DeleteModal
              showDeleteModal={showDeleteModal}
              setShowDeleteModal={setShowDeleteModal}
              deleteHandler={deleteHandler}
              name={"Campaign Schedules"}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default Schedular;
