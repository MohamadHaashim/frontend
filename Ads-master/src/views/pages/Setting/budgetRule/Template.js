import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { tableStyle } from "../../../other/theme/tableStyle";
import Spinner from "../../../other/Spinner/index";
import {
  ApigetTemplate,
  ApiExportTemplate,
} from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";
import getSymbolFromCurrency from "currency-symbol-map";
function Template({ selectedCampagin, getRules, setTemplateModal }) {
  const dispatch = useDispatch();

  const [checkRule, setcheckRule] = useState([]);

  const columns = [
    {
      name: "Rule Name",
      selector: (row) => row.ruleName,
      sortable: true,
    },
    {
      name: "Conditions",
      width: "200px",
      sortable: true,
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
      width: "200px",
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
          : `${e?.actionType?.actionName} budget by ${e?.actionType?.actionValue}${getValueType}`;
      },
    },
    {
      name: "Rule Times",
      width: "200px",
      selector: (row) => row.times,
      cell: (e) => {
        const formattedTimes = e.times
          .map((el) => moment(el, "HH:mm").format("hh:mm A"))
          .join(", ");
        return <div className="rule_type">{formattedTimes}</div>;
      },
    },
    {
      name: "Origin",
      selector: (row) => row.profileName,
      sortable: true,
    },
  ];
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

  const [templateData, settemplateData] = useState();
  const [search, setsearch] = useState("");
  const handleSearch = (e) => {
    setsearch(e.target.value);
  };
  const HandlegetTemplate = (page, perPage, searchName) => {
    dispatch(handleLoader(true));
    let data = {
      search: searchName,
      pageNo: page ? page : currentPage,
      perPage: perPage ? perPage : rowsPerPage,
    };

    ApigetTemplate(data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          settemplateData(res.data);
          setTotalRecords(res.totalRecords);
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
    HandlegetTemplate();
  }, []);

  // pagination //
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setcurrentPage] = useState(1);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event));
    HandlegetTemplate(currentPage, event);
  };

  const handleChangePage = (page) => {
    HandlegetTemplate(page);
  };

  const handleChange = (state) => {
    setcheckRule(state.selectedRows.map((x) => x._id));
  };

  const HandleImport = () => {
    dispatch(handleLoader(true));
    let data = {
      ruleIds: checkRule,
    };
    ApiExportTemplate(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {
          dispatch(handleLoader(false));
          settemplateData(res.data);

          toast.success(res.message);
          getRules(1, 10);
          setTotalRecords(res.totalRecords);
          setTemplateModal(false);
        } else {
          dispatch(handleLoader(false));
          toast.error(res.message);
          setTemplateModal(false);
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error(err);
        setTemplateModal(false);
      });
  };
  return (
    <>
      <div className="template_search row">
        {templateData?.length != 0 && (
          <div className="col-12 inner_search">
            <input
              type="text"
              placeholder="Search By Rule Name..."
              value={search}
              onChange={(e) => handleSearch(e)}
            />
            <button
              className=" blue_btn ms-1"
              type="submit"
              onClick={() =>
                HandlegetTemplate(currentPage, rowsPerPage, search)
              }
            >
              Search
            </button>
            <button
              className="border_btn ms-1"
              type="button"
              onClick={() => {
                setsearch("");
                HandlegetTemplate(currentPage, rowsPerPage, "");
              }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={templateData}
        pagination
        paginationServer
        selectableRows
        onSelectedRowsChange={handleChange}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        paginationPerPage={rowsPerPage}
        paginationTotalRows={totalRecords || 0}
        onChangePage={handleChangePage}
        customStyles={tableStyle}
        progressComponent={<Spinner style={{ height: "550px" }} />}
        fixedHeader
      />
      <div className="col-12 d-flex justify-content-center pt-3">
        {checkRule.length != 0 && (
          <button
            className="btn save col-2 m-2"
            type="button"
            onClick={() => HandleImport()}
          >
            Import Rule
          </button>
        )}
      </div>
    </>
  );
}

export default Template;
