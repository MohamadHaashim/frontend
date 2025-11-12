import React, { useEffect, useState } from "react";
import { getCampaign, ApicheckExcel } from "../../../../api-wrapper/rule-wrapper/ApiCampaign";
import { handleLoader } from "../../../../store/Action/loader";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { OutTable, ExcelRenderer } from "react-excel-renderer";
import * as xlsx from "xlsx";
import sampleFile from '../../../../excelSample/sampleFile.xlsx';
function CampaignSearch({
  campaignIds,
  selectedCampagin,
  allIds,
  setAllIds,
  excelSelected,
  setExcelSelected,
}) {
  const dispatch = useDispatch();
  // campaign list //
  const [validExcelFile, setValidExcelFile] = useState(false);
  const [mixId, setMixId] = useState([]);

  const [campaignList, setCampaignList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [totalData, setTotalData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [searchString, setsearchString] = useState("");
  const [pageset, setpageset] = useState(1);
  const [assignArr, setAssignArr] = useState([]);

  const getData = () => {
    let arr = [];
    let data = {
      search: searchString,
      pageNo: currentPage,
      perPage: perPage,
    };
    dispatch(handleLoader(true));
    getCampaign(selectedCampagin?.profileId, data)
      .then((res) => {
        if (res.isSuccess) {

          dispatch(handleLoader(false));
          setCampaignList(res.data);
          setTotalData(res.totalRecords);
          setCurrentPage(res.currentPageNo);
          setpageset(res.currentPageNo);
          if (campaignIds.length == 0) {
            setselectAllCheck(false);
          } else {
            // let allIdsAvailable = campaignIds.every(id => res.data.some(obj => obj.campaignId === id));
            let allIdsAvailable = res.data.every((x) =>
              allIds.some((obj) => obj === x.campaignId)
            );
            setselectAllCheck(allIdsAvailable);
          }

          res.data.map((el) => {
            arr.push({
              campaignId: el.campaignId,
              name: el.name,
            });
          });
        } else {
          dispatch(handleLoader(false));
          toast.error(res.message);
        }
      })
      .catch((err) => {
        dispatch(handleLoader(false));
        toast.error(err);
      });
    setSearchData(arr);
  };

  useEffect(() => {
    getData();
  }, [currentPage, searchString]);

  const handlePageChange = (event) => {
    setCurrentPage(event.selected + 1);
  };


  const campaignHandler = (e, id, index) => {
    let arr = [...allIds];
    if (e.target.checked) {
      arr.push(id);

      const selectedCampaignIds = arr?.filter((id) =>
        searchData.some((campaign) => campaign.campaignId === id)
      );
      if (searchData.length != 0) {
        setselectAllCheck(selectedCampaignIds?.length === searchData?.length);
      }
    } else {
      arr = allIds.filter((x) => x != id);
      const selectedCampaignIds = arr?.filter((id) =>
        searchData?.some((campaign) => campaign.campaignId === id)
      );
      if (searchData.length != 0) {
        setselectAllCheck(selectedCampaignIds?.length === searchData?.length);
      }
    }
    setAllIds(arr);
  };

  //select all //
  const [selectAllCheck, setselectAllCheck] = useState();

  const selectAllHandler = (e) => {
    let arr = allIds || [];
    if (e.target.checked) {
      setselectAllCheck(true);

      searchData.forEach((el) => {
        arr.push(el.campaignId);
      });
      const uniqueArray = [...new Set(arr)];
      setAllIds(uniqueArray);
    } else {
      setselectAllCheck(false);
      setAllIds((prevIds) =>
        prevIds?.filter(
          (id) => !searchData.map((el) => el.campaignId).includes(id)
        )
      );
    }
  };

  const handleChange = (e) => {
    setsearchString(e.target.value);
    setCurrentPage(1);
    setpageset(1);
  };
  useEffect(() => {
    setAllIds(campaignIds);
  }, [campaignIds]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.name.endsWith(".xlsx")) {

      setValidExcelFile(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const ids = getIdsFromArray(excelData);
      
        setAssignArr(ids)
        let myArrc = [...new Set(allIds.concat(ids.map((element) => String(element))))]

        let senddata = {
          campaignIds: myArrc
        }


        dispatch(handleLoader(true));
        ApicheckExcel(selectedCampagin?.profileId, senddata)
          .then((res) => {
            setExcelSelected(res.data)
            setAllIds(res.data)
            dispatch(handleLoader(false));
          }).catch((err) => {
            dispatch(handleLoader(false));
          });

      };

      reader.readAsBinaryString(file);
      const getIdsFromArray = (arr) => {
        const ids = arr.slice(1).map((item) => item[0]);
        return ids;
      };
    } else {

      alert("Please upload a valid Excel file (with .xlsx extension).");
    }
  };

  const HandleDeAssign = (event) => {
    const file = event.target.files[0];
    if (file.name.endsWith(".xlsx")) {

      setValidExcelFile(true);
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        const ids = getIdsFromArray(excelData);

        let a = ids.map(String)
        const filteredArray = allIds.filter(item => !a.includes(item));
        setAllIds(filteredArray)


      };

      reader.readAsBinaryString(file);
      const getIdsFromArray = (arr) => {
        const ids = arr.slice(1).map((item) => item[0]);
        return ids;
      };
    } else {

      alert("Please upload a valid Excel file (with .xlsx extension).");
    }
  }

  return (
    <>
      <div className="campaginlist_modal mb-4">
        <div className="row col-11 m-auto mt-2 mb-2">
          <div className="col">
            <label className="me-2">
              <b>Search:</b>
            </label>
            <input
              type="text"
              className="input_role"
              value={searchString}
              onChange={(e) => handleChange(e)}
              placeholder="Type here"
            />
          </div>

          <div className="col excel_choose d-flex justify-content-end">
            <div className=" download_sample me-2">
              <a href={sampleFile}
                download="sample excel format"
                target="_blank">
                <button>Download Sample File</button>
              </a>  
            </div>
            <div className="text-end file_option me-2">

              <label className="text-end">
                {" "}
                Assign
                <input
                  type="file"
                  id="myfile"     
                  value=""
                  name="myfile"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {/* <div className="download_sample">
              <button onClick={() => HandleDeAssign()}>De-Assign</button>
            </div> */}
            <div className="text-end file_option me-2">

              <label className="text-end">
                {" "}
                De-Assign
                <input
                  type="file"
                  id="deassign"
                  value=""
                  name="deassign"
                  onChange={HandleDeAssign}
                />
              </label>
            </div>
          </div>


        </div>  

        {validExcelFile && (
          <div className="row col-11">
            <p className="text-end filer_text"> File: Excel file selected</p>
          </div>
        )}
        <div className="row col-11 m-auto mb-2">
          <div className="col">
            <input
              type="checkbox"
              className="me-2"
              value={selectAllCheck}
              checked={selectAllCheck}
              onChange={(e) => selectAllHandler(e)}
            />
            <label>
              <b> All Select</b>
            </label>
          </div>
          <div className="col  d-flex align-items-center justify-content-end">
            <label className="me-2">
              <b>Selected:</b>
            </label>
            <p className="m-0">{allIds.length || 0}  </p>
          </div>
        </div>

        <div className="row col-11 campaign_list">
          {searchData.length == 0 ? (
            <p className="text-center"> Data Not Found !!</p>
          ) : (
            searchData.map((el, index) => {
              return (
                <React.Fragment key={index}>
                  <div className="col-1 pb-2 p-0" style={{ cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      value={allIds?.includes(el.campaignId)}
                      checked={allIds?.includes(el.campaignId)}
                      className="input_rule"
                      onChange={(e) =>
                        campaignHandler(e, el?.campaignId, index)
                      }
                    />
                  </div>
                  <div className="col-5 pb-2 p-0">
                    <label>{el.name} </label>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
        {searchData.length != 0 && (
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
            forcePage={currentPage - 1}
          />
        )}
      </div>
    </>
  );
}

export default CampaignSearch;
