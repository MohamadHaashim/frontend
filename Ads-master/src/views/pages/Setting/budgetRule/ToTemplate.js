import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Spinner from "../../../other/Spinner/index";
import { tableStyle } from "../../../other/theme/tableStyle";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";
import getSymbolFromCurrency from "currency-symbol-map";
import {
    getRule,
    ApiToTemplate
} from "../../../../api-wrapper/rule-wrapper/ApiRules";
function ToTemplate(props) {

    const dispatch = useDispatch();

    const {
        selectedCampagin,
        getRules,
        setToTemplateModal,
        timeZoneCountry,
    } = props
    const [arg, setarg] = useState({ pageNo: 1, perPage: 10 });
    const [rulesData, setRulesData] = useState();
    const columns = [
        {
            name: "",
            width: "50px",
            selector: (row) => row.isTemplate,
            cell: (e) => {
                return (
                    <input
                        type="checkbox"
                        checked={selectedRows.includes(e._id)}
                        onChange={() => handleRowSelected(e._id)}
                    />
                )
            }
        },

        {
            name: "Rule Name",

            selector: (row) => row.ruleName,
            sortable: true,
        },
        {
            name: "Conditions",
            width: "200px",
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
                return <div className="rule_type">{formattedTimes}</div>

            },
        },



    ];
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

    const getToTemplateData = (arg) => {
        dispatch(handleLoader(true));

        let data = {
            ...arg
        };
        getRule(selectedCampagin?.profileId, data)
            .then((res) => {
                if (res.isSuccess) {
                    setRulesData(res.data);
                    setSelectedRows(res.data?.filter((row) => row.isTemplate).map((row) => row._id));
                    dispatch(handleLoader(false));
                    setTotalRecords(res?.totalRecords);
                    setcurrentPage(res.currentPageNo);
                }
            })
            .catch((err) => {
                toast.error("somthing went wrong!!");
            });
    };
    const [selectedRows, setSelectedRows] = useState([]);
    useEffect(() => {
        getToTemplateData(arg)
    }, []);

    // pagination //
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setcurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);


    const handlePerRowsChange = async (newPerPage, page) => {
        setRowsPerPage(newPerPage);
        getToTemplateData({ pageNo: page, perPage: newPerPage });
    };

    const handlePageChange = (page) => {
        getToTemplateData({ pageNo: page, perPage: perPage });
    };

    //  checkbox check //

    const [checkRule, setcheckRule] = useState([]);

    const handleChange = (state) => {
        // setSelectedRows(state.selectedRows.map((x) => x._id));
        const { selectedRows } = state;
        setSelectedRows(selectedRows.map((row) => row._id));
    };


    // add to template api call //
    const HandleImport = () => {
        dispatch(handleLoader(true));

        let data = {
            profileId: selectedCampagin?.profileId,
            ruleIds: selectedRows,
        };
        ApiToTemplate(data)
            .then((res) => {
                if (res.isSuccess) {
                    dispatch(handleLoader(false));

                    toast.success(res.message);
                    getRules(1, 10);
                    setTotalRecords(res.totalRecords);
                    setToTemplateModal(false);
                } else {
                    dispatch(handleLoader(false));
                    toast.error(res.message);

                }
            })
            .catch((err) => {
                dispatch(handleLoader(false));
                toast.error(err);
                setToTemplateModal(false);
            });
    };

    // const handleRowSelected = (state) => {
    //     setSelectedRows(state.selectedRows.map((row) => row._id));
    //   };
    const [search, setsearch] = useState("");
    const handleSearch = (e) => {
        setsearch(e.target.value);
    };
    const handleRowSelected = (id) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((x) => x !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };


    return (
        <>
            {/* <div className="template_search row">
                {rulesData?.length != 0 && (
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
                                getToTemplateData({search:search})
                            }
                        >
                            Search
                        </button>
                        <button
                            className="border_btn ms-1"
                            type="button"
                            onClick={() => {
                                setsearch("");
                                getToTemplateData({search:""})
                            }}
                        >
                            Reset
                        </button>
                    </div>
                )}
            </div> */}

            <DataTable
                columns={columns}
                data={rulesData}
                pagination
                paginationServer

                //   onSelectedRowsChange={handleRowSelected}
                //   selectableRowSelected={(row) => selectedRows.includes(row._id)}

                //   selectableRows={rulesData?.map((row) => row._id) || []}

                paginationPerPage={rowsPerPage}
                paginationTotalRows={totalRecords || 0}

                customStyles={tableStyle}
                progressComponent={<Spinner style={{ height: "550px" }} />}
                fixedHeader
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handlePerRowsChange}
            />


            <div className="col-12 d-flex justify-content-center pt-3">


                <button
                    className="btn save col-2 m-2"
                    type="button"
                    onClick={() => HandleImport()}
                >
                    Add To Template
                </button>


            </div>
        </>
    )
}

export default ToTemplate