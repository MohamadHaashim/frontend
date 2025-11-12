import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Spinner from "../../../other/Spinner/index";
import { tableStyle } from "../../../other/theme/tableStyle";
import { Modal } from "react-bootstrap";
import {
  getRule,
  deleteRule,
  statusChange,
  updateBulkRule
} from "../../../../api-wrapper/rule-wrapper/ApiRules";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrEdit } from "react-icons/gr";
import { AiOutlineDelete, AiTwotoneFileImage, AiFillTag } from "react-icons/ai";
import DeleteModal from "../../../other/modal/DeleteModal";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import RuleModal from "./RuleModal";
import getSymbolFromCurrency from "currency-symbol-map";
import CampaignListModal from "../campaignListModal/CampaignListModal";
import moment from "moment-timezone";
import * as xlsx from "xlsx";
import {
  getAssignCampaign,
  ApiaddTemplate,
} from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { Link } from "react-router-dom";
import Template from "./Template";
import ReactPaginate from "react-paginate";
import ToTemplate from "./ToTemplate";
import ConfirmModal from "../../../other/modal/ConfirmModal";
function BudgetRule({ selectedCampagin, timeZoneCountry, switchTab, allIds, setAllIds }) {
  const [selectedRows, setSelectedRows] = useState([]);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    console.log("Selected Row IDs:", selectedRows);
    setButtonsVisible(selectedRows.length > 0);
  }, [selectedRows]);


  const selectAllRows = (event) => {
    if (event.target.checked) {
      setSelectedRows(rulesData.map((row) => row._id));
      setIsChecked(true);
    } else {
      setSelectedRows([]);
      setIsChecked(false);
    }
  };


  const columns = [
    {
      name: (
        <div>
          <input
            type="checkbox"
            className="checkbox"
            id="checkbox_selected"
            onChange={selectAllRows}
            checked={isChecked}
            style={{
              width: "50px",
              height: "20px",
            }}
          />
        </div>
      ),
      width: "80px",
      selector: "",
      cell: (e) => (
        <div className="checkbox">
          <input
            type="checkbox"
            id="checkbox_selected"
            checked={isSelected(e._id)}
            onChange={() => handleRowSelect(e._id)}
            style={{
              width: "50px",
              height: "20px",
            }}
          />
        </div>
      ),
    },
    {
      name: "Active",
      width: "80px",
      selector: (row) => row.isActive,
      cell: (e) => (
        <div className=" form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            name="isActive"
            onChange={(event) => statusHandler(event, e._id)}
            checked={e.isActive}
            value={e.isActive}
            style={{ width: "50px", height: "20px" }}
          />
        </div>
      ),
    },
    {
      name: "Rule Name",
      width: "300px",
      selector: (row) => row.ruleName,

      sortable: true,
    },
    {
      name: "Conditions",
      width: "230px",
      cell: (e) => {
        return (
          <div className="rule_type">
            {e?.conditions?.map((el, index) => {
              return mainConditionMaker(
                index,
                el?.conditionType,
                el?.conditionOperator,
                el?.conditionValue,
                el?.conditionValueType
              );
            })}
          </div>
        );
      },
    },
    {
      name: "Action Type",
      width: "230px",
      selector: (row) => row.actionType,
      cell: (e) => {
        let getValueType =
          e?.actionType.actionValueType == "Number"
            ? getSymbolFromCurrency(selectedCampagin.currencyCode)
            : "% of budget";
        return e?.actionType?.actionName == "Paused"
          ? "Campaign Paused"
          : e?.actionType?.actionName == "Enabled"
            ? "Campaign Enabled"
            : e?.actionType?.actionName == "setBudget"
              ? `Set Budget by ${e?.actionType?.actionValue}${getValueType}`
              : `${e?.actionType?.actionName} budget by ${e?.actionType?.actionValue}${getValueType}`;
      },
    },
    {
      name: "Rule Times",
      width: "180px",
      selector: (row) => row.times,
      cell: (e) => {
        const formattedTimes = e.times
          .map((el) => moment(el, "HH:mm").format("hh:mm A"))
          .join(", ");
        return formattedTimes;
      },
    },
    {
      name: "Assign Campaigns",
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
                  setdummyId(e.campaignIds);
                  setdummyRuleId(e._id);
                  getSelectedId(e.campaignIds, e._id);
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
      name: "Updated Date",
      sortable: true,
      width: "230px",
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
      width: "200px",
      cell: (e) => (
        <div className="d-flex align-items-center">
          <GrEdit
            size={18}
            title="Edit Rule"
            color={"green"}
            style={{ cursor: "pointer" }}
            className="me-2"
            onClick={() => {
              setShowRules(true);
              setEditId(e._id);
            }}
          />
          <AiOutlineDelete
            title="Delete Rule"
            className="me-2"
            color={"red"}
            size={20}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowDeleteModal(true);
              setDeleteId(e._id);
            }}
          />
          {/* <AiTwotoneFileImage
            title="Add to Template"
            className="me-2"
            onClick={() => {
              HandleraddTemplate(e._id, e.isTemplate);
            }}
            size={20}
            style={{ cursor: "pointer" }}
          /> */}
          <button
            title="Assign Campaigns"
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

  const isSelected = (rowId) => selectedRows.includes(rowId);

  const handleRowSelect = (rowId) => {
    let updatedSelectedRows;

    if (isSelected(rowId)) {
      updatedSelectedRows = selectedRows.filter((id) => id !== rowId);
    } else {
      updatedSelectedRows = [...selectedRows, rowId];
    }

    setSelectedRows(updatedSelectedRows);

    const allRowsSelected = updatedSelectedRows.length === rulesData.length;
    setIsChecked(allRowsSelected);

    console.log("Count", updatedSelectedRows.length, rulesData.length);
  };


  const HandleraddTemplate = (id, active) => {
    dispatch(handleLoader(true));
    let data = {
      isTemplate: active == true ? false : true,
    };
    ApiaddTemplate(id, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          toast.success(res.message);
          getRules();
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

  // type and subrules condition //
  const [conditionOperators, setConditionOperator] = useState([
    {
      key: "GREATER_THAN",
      value: ">",
    },
    {
      key: "LESS_THAN_OR_EQUAL_TO",
      value: "<=",
    },
    {
      key: "GREATER_THAN_OR_EQUAL_TO",
      value: ">=",
    },
    {
      key: "LESS_THAN",
      value: "<",
    },
    {
      key: "EQUAL_TO",
      value: "==",
    },
  ]);

  const mainConditionMaker = (
    index,
    conditionType,
    conditionOperator,
    conditionValue,
    conditionValueType
  ) => {
    let getOperator = conditionOperators?.find(
      (x) => x.key == conditionOperator
    ).value;
    let getValueType = conditionValueType == "Number" ? "" : "% of budget";
    return (
      <div key={index}>
        {index == 0 ? "" : "And"} {conditionType} {getOperator} {conditionValue}
        {getValueType}
      </div>
    );
  };

  // campaign list //
  const [campaignModal, setCampaignModal] = useState(false);
  const [selectedCampaginId, setSelectedCampaginId] = useState();

  const dispatch = useDispatch();

  // delete modal//
  const [deleteId, setDeleteId] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // confirm modal //
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [schema, setSchema] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  // rules modal
  const [showRules, setShowRules] = useState(false);
  const [editId, setEditId] = useState();
  const [assignId, setAssignId] = useState();
  const [campaignIds, setcampaignIds] = useState();
  const [dummyId, setdummyId] = useState();
  const [dummyRuleId, setdummyRuleId] = useState();
  const [rulesData, setRulesData] = useState();
  const handleClose = (added) => {
    setShowRules(false);
  };

  const getRules = (page, perPage) => {
    dispatch(handleLoader(true));

    let data = {
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };
    getRule(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {
          setRulesData(res.data);
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
    if (switchTab == "budget") {
      getRules();
    }
  }, [switchTab]);

  // selected campaign  id //

  const [selectedModal, setSelectedModal] = useState(false);
  const [listId, setListId] = useState([]);
  const [searchCampaign, setsearchCampaign] = useState("");
  const [searchFlag, setsearchFlag] = useState(false);
  const [totalData, setTotalData] = useState(100);
  const [ListcurrentPage, setListCurrentPage] = useState(1);
  const [ListperPage, setListPerPage] = useState(100);

  const handlePageChange = (event) => {
    setListCurrentPage(event.selected + 1);
  };
  const handleSearch = (e) => {
    setsearchCampaign(e.target.value);
  };

  const getSelectedId = (ids, id, searcha) => {
    dispatch(handleLoader(true));
    let data = {
      search: searcha ? "" : searchCampaign,
      pageNo: searchCampaign ? 1 : ListcurrentPage,
      perPage: 100,
    };

    getAssignCampaign(id ? id : dummyRuleId, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          setListId(res.data);
          setSelectedModal(true);
          setTotalData(res.totalRecords);
          setListCurrentPage(res.currentPageNo);
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

  useEffect(() => {
    if (switchTab == "budget") {
      getSelectedId();
    }
  }, [ListcurrentPage]);

  const dummyCall = () => {
    setsearchCampaign("");
    let arr = [];
    let findData = dummyId;
    dispatch(handleLoader(true));
    let data = {
      search: "",
      pageNo: ListcurrentPage,
      perPage: 100,
    };

    getAssignCampaign(dummyRuleId, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          setTotalData(res.totalRecords);
          setListId(res.data);
          setListCurrentPage(res.currentPageNo);
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
  };

  // delete Rule //

  const deleteHandler = () => {
    dispatch(handleLoader(true));
    deleteRule(deleteId)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message);
          getRules();
          setSelectedRows(selectedRows.filter(rowId => rowId !== deleteId));
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

  const statusHandler = (event, id) => {
    let data = {
      isActive: event.target.checked,
    };
    statusChange(data, id)
      .then((res) => {
        if (res.isSuccess) {
          toast.success(res.message || "Success");
          getRules();
        } else {
          toast.error(res.message || "error");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong");
      });
  };

  const handleAssign = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];

      if (file.name.endsWith(".xlsx")) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const binaryData = event.target.result;

          const base64Data = btoa(binaryData);

          let data = {
            schema: "assigning",
            stream: base64Data,
            ruleIds: selectedRows,
          };
          setShowConfirmModal(true);
          setSchema(data);
        };
        reader.readAsBinaryString(file);
      } else {
        alert("Please upload a valid Excel file (with .xlsx extension).");
      }
    });
    fileInput.click();
  };

  const handleDeAssign = () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';

    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];

      if (file.name.endsWith(".xlsx")) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const binaryData = event.target.result;

          const base64Data = btoa(binaryData);

          let data = {
            schema: "unassigning",
            stream: base64Data,
            ruleIds: selectedRows,
            count: selectedRows.count
          };
          setShowConfirmModal(true);
          setSchema(data);
        };
        reader.readAsBinaryString(file);
      } else {
        alert("Please upload a valid Excel file (with .xlsx extension).");
      }
    });
    fileInput.click();
  };

  const confirmBulk = () => {
    dispatch(handleLoader(true));
    updateBulkRule(schema)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          toast.success(res.message || "Success");
          getRules();
        } else {
          dispatch(handleLoader(false));
          toast.error(res.message || "error");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Something went wrong");
      });
  }

  // const runHandler = () => {
  //   dispatch(handleLoader(true));
  //   getRun()
  //     .then((res) => {
  //       if (res.isSuccess) {
  //         toast.success(res.message);
  //         dispatch(handleLoader(false));
  //       } else {
  //         toast.error(res.message);
  //         dispatch(handleLoader(false));
  //       }
  //     })
  //     .catch((err) => {
  //       dispatch(handleLoader(false));
  //       toast.error("somthing went wrong!!");
  //     });
  // };

  // template //
  const [templateModal, setTemplateModal] = useState(false);
  const [toTemplateModal, setToTemplateModal] = useState(false);
  return (
    <>
      <div className="campaign_detail">
        <div>
          <div className="row mb-3">
            <div className="col-6">
              <h4>Budget Rules</h4>
            </div>
            <div className="col-6 d-flex align-items-center justify-content-end">
              {/* 
              <button className="  border_btn me-2" onClick={() => runHandler()}>
                Run
              </button> */}
              <button
                title="Bulk Assign"
                id="bulkAssignBtn"
                className="blue_btn ms-2"
                hidden={!buttonsVisible}
                onClick={handleAssign}
              >
                Bulk Assign
              </button>
              <button
                title="Bulk DeAssign"
                className="blue_btn ms-2"
                id="bulkDeAssignBtn"
                hidden={!buttonsVisible}
                onClick={handleDeAssign}
              >
                Bulk DeAssign
              </button>
              <button
                title="Add to Template"
                className="border_btn ms-2"
                onClick={() => {
                  setToTemplateModal(true);
                }}
              >
                Add to Template
              </button>
              <button
                title="Add Budget Rule"
                className="blue_btn ms-2"
                onClick={() => {
                  setShowRules(true);
                  setEditId();
                }}
              >
                Add Budget Rule
              </button>
              <button
                title="Add from Template"
                className="border_btn ms-2"
                onClick={() => {
                  setTemplateModal(true);
                }}
              >
                Add from Template
              </button>
            </div>
          </div>
          <div className="bg-white">
            <div className="p-0">
              <DataTable
                columns={columns}
                data={rulesData}
                pagination
                paginationServer
                onChangeRowsPerPage={handleChangeRowsPerPage}
                paginationPerPage={rowsPerPage}
                paginationTotalRows={totalRecords || 0}
                onChangePage={handleChangePage}
                customStyles={tableStyle}
                progressComponent={<Spinner style={{ height: "550px" }} />}
                fixedHeader
              />
            </div>
          </div>
        </div>
        {/* rules modal */}
        <Modal show={showRules} className="model" centered size="lg">
          <Modal.Header closeButton onClick={() => setShowRules(false)}>
            <Modal.Title>
              {editId ? "Edit Budget Rule" : "Add Budget Rule"}{" "}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RuleModal
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setEditId={setEditId}
              editId={editId}
              getRules={getRules}
              selectedCampagin={selectedCampagin}
              setShowRules={setShowRules}
              showRules={showRules}
              handleClose={(e) => handleClose(e)}
              timeZoneCountry={timeZoneCountry}
            />
          </Modal.Body>
        </Modal>
        {/* campaign list */}

        <Modal
          show={campaignModal}
          className="model rules_model"
          centered
          size="lg"
        >
          <Modal.Header>
            <Modal.Title>List of Campaigns </Modal.Title>
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
        <Modal
          show={selectedModal}
          className="model rules_model"
          centered
          size="lg"
        >
          <Modal.Header closeButton onClick={() => setSelectedModal(false)}>
            <Modal.Title>Associated Campaigns </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="budget_campaign_listing">
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
                  onClick={() => {
                    getSelectedId();
                  }}
                >
                  Search
                </button>
                <button
                  className="border_btn ms-2"
                  onClick={() => {
                    dummyCall();
                  }}
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
              {listId.length != 0 && (
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
              )}
            </div>
          </Modal.Body>
        </Modal>
        {/* from template  */}
        <Modal
          show={templateModal}
          className="model rules_model"
          centered
          size="xl"
        >
          <Modal.Header closeButton onClick={() => setTemplateModal(false)}>
            <Modal.Title>Add from Template</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">
            <Template
              selectedCampagin={selectedCampagin}
              getRules={getRules}
              setTemplateModal={setTemplateModal}
            />
          </Modal.Body>
        </Modal>

        {/* to template */}

        <Modal
          show={toTemplateModal}
          className="model rules_model"
          centered
          size="xl"
        >
          <Modal.Header closeButton onClick={() => setToTemplateModal(false)}>
            <Modal.Title>Add To Template</Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">
            <ToTemplate
              selectedCampagin={selectedCampagin}
              getRules={getRules}
              setToTemplateModal={setToTemplateModal}
              timeZoneCountry={timeZoneCountry}
            />
          </Modal.Body>
        </Modal>

        {/* delete modal */}
        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deleteHandler={deleteHandler}
          name={"Rules"}
        />
        <ConfirmModal
          showConfirmModal={showConfirmModal}
          setShowConfirmModal={setShowConfirmModal}
          confirmHandler={confirmBulk}
          name="Rules"
          schema={schema.schema}
          count = {selectedRows.length}
        />
      </div>
    </>
  );
}

export default BudgetRule;
