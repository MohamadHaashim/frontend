import React, { Component, useEffect, useState,useRef ,useCallback} from 'react';
import './BudgetTable.css'
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Row, Col,Spinner,Modal, Form } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import load from "../../../assets/images/icons/Spinner.gif";
import axios from 'axios';
import ReactPaginate from "@mui/material/Pagination"; 
import moment from "moment-timezone";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Popconfirm } from "antd";
import ActionDot from "../../../assets/images/icons/more-action-icon.svg";
import { AiOutlinePlus } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import {  TimePicker } from "antd";
import dayjs from 'dayjs';
import fileDownload from "react-file-download";
import { getCampaign, ApicheckExcel } from "./APIcampaigns";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx";
import { handleLoader } from './loader';

interface ActionType {
  actionName: string;
  actionValue: number;
  actionValueType: string;
}

interface BudgetRules {
  [x: string]: any;
  actionType: ActionType;
  _id: string;
  customerId: string;
  profileId: number;
  ruleName: string;
  isActive: boolean;
  campaignIds: string[];
  ruletime?: number;
  assigncampaigns?: string;
  updatedAt?: string;
  conditions:string;
  times:string;
 
}
interface BudgetRulesProps{
  condition: string;
}
interface Assign{
  campaignId: any;
  name:string;
  pageCount: number;
}
type select = {
  campaignId: number;
  name: string;
};
interface updated{
  _id:any
}


  const BudgetRules: React.FC<BudgetRulesProps> = (props) => {
    

  const [Budgetrules,setBudgetrules]=useState<BudgetRules[]>([])
  const [perPage, setPerPage] = useState(50);
  const [totalRow, setTotalRow] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [apiLoading, setApiLoading] = useState(false);
  const [toTemplateModal, setToTemplateModal] = useState<any | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [editRules, setEditRules] = useState<string[]>([]);
  const [editId, setEditId] = useState();
  const [templateModal, setTemplateModal] = useState<any | null>(null);
  const [spinner, setSpinner] = useState(false);  
  const [ids,setId]=useState("");
  const [clickedId, setClickedId] = useState(null);
  const [assign, setAssign] = useState<Assign[] | null>(null); 
  const [showAssign, setShowAssign] = useState(false);
  const [searchCampaign, setsearchCampaign] = useState("");
  const [searchCampaignpopup, setsearchCampaignpopup] = useState("");

  const [showOptions, setShowOptions] = useState<string | null>(null);
  const[showmodal,setshowmodal]=useState(false);
  const[fromtemplateshowmodal,setfromtemplateshowmodal]=useState(false);
  const[showRulesshowmodal,setshowRulesshowmodal]=useState(false);

  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [selectedCheckstemplateModal, setselectedCheckstemplateModal] = useState<string[]>([]);
  const [selectAllChecks, setSelectAllChecks] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(templateModal || []);

  const [ruleid, setruleid] = useState<any[] | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [validExcelFile, setValidExcelFile] = useState(false);

  const [selectAllCheck, setselectAllCheck] = useState<boolean>(false);
  const [searchData, setSearchData] = useState<any[]>([]); 

const [allIds, setAllIds] = useState<any>([]);
const [selectAllCheckpopup, setSelectAllCheckpopup] = useState(false); 
const [deletepopup, setdeletepopup] = useState(false); 
const [updateid, setupdateid] = useState<updated | null>(null); 
const [Campaignsid, setCampaignsid] = useState(""); 

// campaignsis pagination data 

const [ActivePagecampaignsid,setActivePagecampaignsid] =useState(1)
const [TotalRowcampaignsid,setTotalRowcampaignsid]=useState(0)
const [PerPagecampaignsid,setPerPagecampaignsid]=useState(50)
const [currentRuleId, setCurrentRuleId] = useState<string | null>(null);
const [totalpagescampaignsid ,settotalpagescampaignsid]=useState(1)
const [LastPagecampaignsid ,setLastPagecampaignsid]=useState(1)

const [profileId, setProfileId] = useState<string | null>(null);
const [isActive ,setisActive]=useState(false)

//Addtotemplate pagination 
const [ActivePageAddtotemplate,setActiveAddtotemplate] =useState(1)
const [TotalRowAddtotemplate,setTotalRowAddtotemplate]=useState(0)
const [PerPageAddtotemplate,setPerPageAddtotemplate]=useState(50)
const [LastPagAddtotemplate ,setLastAddtotemplate]=useState(1)

//AddFromtemplate pagination 
const [ActivePageAddfromtemplate,setActiveAddfromtemplate] =useState(1)
const [TotalRowAddfromtemplate,setTotalRowAddfromtemplate]=useState(0)
const [PerPageAddfromtemplate,setPerPageAddfromtemplate]=useState(50)
const [LastPagAddfromtemplate ,setLastAddfromtemplate]=useState(1)

//Assign pagination 
const [ActivePageAssign, setActiveAssign] = useState(1); 
const [TotalRowAssign,setTotalRowAssign]=useState(0)
const [PerPageAssign,setPerPageAssign]=useState(50)
const [LastPagAssign ,setLastAssign]=useState(1)

const [selectedTemplateIds, setSelectedTemplateIds] = useState<any>([]);
const [budgetRules, setBudgetRules] = useState(Budgetrules);
const [Assignselect, setAssignselecte] = useState(Budgetrules);

const [AssignsselectedAssignIds, setAssignsSelectedAssignIds] = useState<any>([]);

const[Assignedruleids,setAssignedruleids]= useState("");
const[campaignslist,setcampaignslist]= useState([]);
const[getcampaigns,setgetcampaigns]= useState([]);

const dispatch = useDispatch();
const [ excelSelected, setExcelSelected] = useState("");

const [selectedData,setselectedData]=useState<any[]>([]);

const [tableData, setTableData] = useState<BudgetRules[]>([]);
const [sortConfig, setSortConfig] = useState<{ key: keyof BudgetRules; direction: 'asc' | 'desc' }>({
  key: 'ruleName', 
  direction: 'asc',
});;
const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);


const handleSort = (key: keyof BudgetRules) => {
  let direction: 'asc' | 'desc' = 'asc';

  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }

  const sortedData = [...Budgetrules].sort((a, b) => {
    const aValue = a[key] ?? ''; 
    const bValue = b[key] ?? ''; 

    if (typeof aValue === 'object' && aValue !== null && aValue.actionName) {
      const aSubValue = aValue.actionName ?? ''; 
      const bSubValue = bValue.actionName ?? '';

      return direction === 'asc' 
        ? aSubValue.localeCompare(bSubValue) 
        : bSubValue.localeCompare(aSubValue); 
    }

    if (typeof aValue === 'string' || typeof bValue === 'string') {
      return direction === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

   
    if (typeof aValue === 'number' || typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  setSortConfig({ key, direction });
  setBudgetrules(sortedData); 
};

  const mainLabel = [
    { value: "Budget", label: "Budget" },
    { value: "Spend", label: "Spend" },
    { value: "ROAS", label: "ROAS" },
    { value: "Sales", label: "Sales" },
    { value: "Clicks", label: "Clicks" },
    { value: "Orders", label: "Orders" },
  ];

  const validatorLabel = [
    { value: "LESS_THAN", label: "Less than" },
    { value: "LESS_THAN_OR_EQUAL_TO", label: "Less than or equal to" },
    { value: "GREATER_THAN_OR_EQUAL_TO", label: "Greater than or equal to" },
    { value: "GREATER_THAN", label: "Greater than" },
    { value: "EQUAL_TO", label: "Equal to" },
  ];

  const selector = [
    { value: "Number", label: "Number" },
    { value: "Percentage", label: "Percentage" },
  ];

  const subValueType = [
    { value: "Enabled", label: "Campaign Enabled" },
    { value: "Paused", label: "Campaign Paused" },
    { value: "Increase", label: "Increase Budget" },
    { value: "Decrease", label: "Decrease Budget" },
    { value: "setBudget", label: "Set Budget" },
  ];
  const [timeData, setTimeData] = useState([{}]);

  const [mainRuleData, setMainRuleData] = useState([
    {
      conditionType: "",
      conditionOperator: "",
      conditionValue: "",
      conditionValueType: "",
    },
  ]);

  const [actionType, setActionType] = useState({
    actionName: "",
    actionValue: "",
    actionValueType: "",
  });

const [ruleName, setRuleName] = useState("");

  const [fields, setFields] = useState([
    { ruleType1: "", ruleType2: "", value: "", ruleType3: "" },
  ]);

  
  const downloadExcelFile = async (selectedData: any[]): Promise<void> => {
    try {
      // Create a new workbook and worksheet
      const ws = xlsx.utils.json_to_sheet(selectedData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Sheet1");
  
      // Generate Excel file as a Blob
      const excelBuffer = xlsx.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
      // Trigger download
      fileDownload(blob, "sampleFile.xlsx");
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleInputChange = (e) => {
    setsearchCampaign(e.target.value); 
  };


 
  const handleSearchClick = () => {
    if (Budgetrules.length > 0) {
      handlecampaignsid(Budgetrules[0]._id); 
    } else {
      console.error("No BudgetRules available to assign");
    }
  };

  const addfromtemplatehandleSearchClick = () => {
    if (searchQuery.trim() === '') {
      
      setFilteredData(templateModal || []); 
    } else {
      const filtered = (templateModal || []).filter(item =>
        (item.ruleName && item.ruleName.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (item.profilename && item.profilename.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      setFilteredData(filtered); 
    }
  };

  useEffect(() => {
    addfromtemplatehandleSearchClick();
  }, [searchQuery]);
  
  const addfromtemplatehandleReset = () => {
    setSearchQuery(''); 
    
  };

  const handleRemoveTimeField = (index) => {
    let arr = timeData;
    arr.splice(index, 1);
    setTimeData([...arr]);
  };
  const handleRemoveRule = (index) => {
    const newData = [...mainRuleData];
    newData.splice(index, 1);
    setMainRuleData(newData);
  };

  const handleAddTimeField = () => {
    setTimeData([...timeData, {}]);
  };

  const addConditionHandler = () => {
    setMainRuleData((prevData) => [
      ...prevData,
      {
        conditionType: "",
        conditionOperator: "",
        conditionValue: "",
        conditionValueType: "",
      },
    ]);
  };
  
  
  const handleReset = async () => {
    setsearchCampaign("");  
  };
  

  const handleChange = (event, value: number) => {
    setActivePage(Number(value))
  };

  const handleChangecampaignsid = (event, value: number) => {
    setActivePagecampaignsid(Number(value))
  };

  const handleChangeassign = (event, value) => {
      setActiveAssign(Number(value))
  };

  const handleAddtotemplate = (event, value: number) => {
    setActiveAddtotemplate(Number(value))
  };
  const handleAddfromtemplate = (event, value: number) => {
    setActiveAddfromtemplate(Number(value))
  };

  const applyDataLength = (e) => {
    setActivePage(1)
    setPerPage(Number(e.target.value)) 
  };
  const applyDataLengthcampaignsid = (e) => {
    setActivePagecampaignsid(1)
    setPerPagecampaignsid(Number(e.target.value)) 
  };

  const applyDataLengthAssign = (e) => {
      setActiveAssign(1); 
      setPerPageAssign(Number(e.target.value)) 
  };

  const applyDataLengthAddtotemplate = (e) => {
    setActiveAddtotemplate(1)
    setPerPageAddtotemplate(Number(e.target.value)) 
  };
  const applyDataLengthAddfromtemplate = (e) => {
    setActiveAddfromtemplate(1)
    setPerPageAddfromtemplate(Number(e.target.value)) 
  };

  const toggleOptions = (id: string) => {
    setShowOptions(showOptions === id ? null : id); 
  };

  const fetchBudgetRules = async (activePage: number, perPage: number, condition: string) => {
    const userToken = localStorage.getItem("budgetOptimizer");
    const AuthToken = "Bearer " + userToken;
    const profileId = localStorage.getItem("BudgetProfileId");

   
    // setApiLoading(true); 
    try {
        const response = await fetch(`https://budget-api.getgrowth.agency/api/amazon/budgetRule/${profileId}/getBudgetRules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
            },
            body: JSON.stringify({
                pageNo: activePage,
                perPage: perPage,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to fetch campaigns data.");
        }

        const data = await response.json();
        if (data?.data) {
            setBudgetrules(data.data);
            // setToTemplateModal(data.data);
            // setruleid(data.data);
            setCampaignsid(data.campaignIds);
            setTotalRow(data.totalRecords);
            setActivePage(data.currentPageNo);
            setLastPage(data.totalPages);
        }
    } catch (err) {
        console.error(err);
    } finally {
        setApiLoading(false); 
    }
};


  const handleActiveStatus = async (_id:any,isActive: boolean) => {
    let userToken = localStorage.getItem("budgetOptimizer");
    let AuthToken = "Bearer " + userToken;
    let profileId = localStorage.getItem("BudgetProfileId");
    console.log(profileId,"BudgetProfileId")
   
      try {
          const response = await fetch(
              `https://budget-api.getgrowth.agency/api/amazon/budgetRule/changeStatus/${_id}`,
              {
                  method: 'POST', 
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: AuthToken,
                  },
                  body: JSON.stringify({
                    isActive:isActive
                  }),
              }
          );

          if (!response.ok) {
              throw new Error('Failed to fetch campaigns data.');
          }

          const data = await response.json();
          if (data?.data) {
            setisActive(data.data)
              
          }
          fetchBudgetRules(activePage,perPage,props.condition);
      } catch (err) {
        
          console.error(err);
       } finally {
        setApiLoading(false); 
      }
  };
  

useEffect(() => {
    const initialSelected = Budgetrules.filter((rule) => rule.isTemplate).map((rule) => rule._id);
    setSelectedTemplateIds(initialSelected);
    console.log("Initial selected IDs:", initialSelected);
}, [Budgetrules]);


  useEffect(() => {
        fetchBudgetRules(activePage,perPage,props.condition);
        // handleActiveStatus(_id,isActive);
      }, [activePage,perPage,props.condition,]); 

      
      
      const handleDelete = (rule: BudgetRules) => {
        setdeletepopup(true);
        
      };

      useEffect(() => {
        if (toTemplateModal && Array.isArray(toTemplateModal)) {
          
          const selectedIds = toTemplateModal.map(item => item._id);
          
          setSelectedChecks(selectedIds); 
          
        }
        if (templateModal && Array.isArray(templateModal)) {
          
          const selectedtemplateModal = templateModal?.map(item => item._id);

          console.log("selectedtemplateModal",templateModal,selectedtemplateModal)
         
          setselectedCheckstemplateModal(selectedtemplateModal);
        }
      }, [toTemplateModal,templateModal]); 

        const formatTimes = (times: string | string[]) => {
          
          const chunkedTimes = Array.isArray(times) ? chunkArray(times, 4) : chunkArray(times.split(','), 2);

          return chunkedTimes.map((chunk, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row' }}>
              {chunk.map((time, index) => {
                const [hours, minutes] = time.split(':').map(Number);
                const formattedTime = new Date(2000, 0, 1, hours, minutes);
                return (
                  <div key={index} style={{ marginRight: '10px' }}>
                    {formattedTime.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </div>
                );
              })}
            </div>
          ));
        };

      const chunkArray = (array: string[], size: number): string[][] => {
        const chunked: string[][] = []; 
        for (let i = 0; i < array.length; i += size) {
          chunked.push(array.slice(i, i + size));
        }
        return chunked;
      };

      const handlecampaignsid = async (id: string,search: string = "") => {
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
        console.log(id,"idz");
        setCurrentRuleId(id)
        // setSpinner(true);
        try {
          const response = await fetch (
            `https://budget-api.getgrowth.agency/api/amazon/budgetRule/getAssignCampaigns/${id}`,
            {
              method: 'POST', 
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: AuthToken,
              },
              body: JSON.stringify({
              search: searchCampaign,
              pageNo: ActivePagecampaignsid,
              perPage: PerPagecampaignsid,
            })
          }
        );
          // setSpinner(false);
          const data = await response.json();
          if (data.data.length > 0) {
            setAssign(data.data);
            if (!showAssign) {
                setShowAssign(true);  
            }
        } else {
            setAssign([]); 
        }
          setgetcampaigns(data.data)
          setActivePagecampaignsid(data.currentPageNo)
          setTotalRowcampaignsid(data.totalRecords)
          settotalpagescampaignsid(data.totalpagescampaignsid)
          setLastPagecampaignsid(data.totalPages)
        } catch (error) {
          setSpinner(false);
          console.error("Error fetching data:", error);
        }
      };

      useEffect(() => {
        if (currentRuleId) {
          handlecampaignsid(currentRuleId);
        }
      }, [searchCampaign,ActivePagecampaignsid, PerPagecampaignsid, currentRuleId]);
    
      const handleSelectedAllCheck=()=>{
        setSelectAllChecks(!selectAllChecks)
        console.log("handleSelectedAllCheck",selectAllChecks,selectedChecks.length)
    
     if(selectAllChecks){
        setSelectAllChecks(false)
    
        setSelectedChecks([]);
     }
    else{
       
        const allIds = toTemplateModal.map((item) => item._id);
        console.log("handleSelectedAllCheck allIds",allIds)
    
          setSelectedChecks(allIds);
    }
               
          setSelectAllChecks(!selectAllChecks);
    }

      const handleAddToTemplateClick = async (ActivePageAddtotemplate: number, PerPageAddtotemplate: number) => {
        setshowmodal(true)
        let userToken = localStorage.getItem('budgetOptimizer');
        let AuthToken = 'Bearer ' + userToken;
        let profileId = localStorage.getItem('BudgetProfileId');
        console.log(profileId, 'BudgetProfileId');
        setSpinner(true);
      
        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/budgetRule/${profileId}/getBudgetRules`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: AuthToken,
              },
              body: JSON.stringify({
                pageNo: ActivePageAddtotemplate,
                perPage: PerPageAddtotemplate,
              }),
            }
          );
      
          if (!response.ok) {
            throw new Error('Failed to fetch campaigns data.');
          }
      
          const data = await response.json();
          if (data?.data) {
            setToTemplateModal(data.data); 
            setActiveAddtotemplate(data.currentPageNo)
            setTotalRowAddtotemplate(data.totalRecords)
            setLastAddtotemplate(data.totalPages)
           
          }
          setSpinner(false);
        } catch (err) {
          setSpinner(false);
          console.error(err);
        } finally {
          setApiLoading(false);
        }
      };

       useEffect(() => {
        if(showmodal === true){
        handleAddToTemplateClick(ActivePageAddtotemplate, PerPageAddtotemplate);
        }
      }, [ActivePageAddtotemplate, PerPageAddtotemplate]);

      const handleAddfromTemplateClick = async (activePage: number, perPage: number) => {
        setfromtemplateshowmodal(true)
        let userToken = localStorage.getItem('budgetOptimizer');
        let AuthToken = 'Bearer ' + userToken;
        let profileId = localStorage.getItem('BudgetProfileId');
        console.log(profileId, 'BudgetProfileId');
        setSpinner(true);
      
        try {
          const response = await fetch(
            ` https://budget-api.getgrowth.agency/api/amazon/budgetRule/getAllTemplate`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: AuthToken,
              },
              body: JSON.stringify({
                pageNo: ActivePageAddfromtemplate,
                perPage: PerPageAddfromtemplate,
              }),
            }
          );
      
          if (!response.ok) {
            throw new Error('Failed to fetch campaigns data.');
          }
      
          const data = await response.json();
          if (data?.data) {
            setTemplateModal(data.data);
            setTotalRowAddfromtemplate(data.totalRecords);
            setActiveAddfromtemplate(data.currentPageNo);
            setLastAddfromtemplate(data.totalPages);
          }
          setSpinner(false);
          console.log(data.data, 'Fetched Campaigns Data');
        } catch (err) {
          setSpinner(false);
          console.error(err);
        } finally {
          setApiLoading(false);
        }
      } 

      useEffect(() => {
        if(fromtemplateshowmodal === true){
        handleAddfromTemplateClick(ActivePageAddfromtemplate, PerPageAddfromtemplate);
        }
      }, [ActivePageAddfromtemplate, PerPageAddfromtemplate]);

      

      const handleCheckboxChangeselectedCheckstemplateModal = (_id: string) => {
        console.log("handleCheckboxChange", _id);
    
    
        setselectedCheckstemplateModal((prevSelected) => {
          if (prevSelected.includes(_id)) {
            return prevSelected.filter((itemId) => itemId !== _id);
          }
          return [...prevSelected, _id];
        });
      };

      const handleTimeChange = (index, e) => {
        let arr = [...timeData];
        arr[index] = e ? e.format('HH:mm') : ''; 
        setTimeData(arr);
      };

      const handleupdate = async (id:any) => {
        const userToken = localStorage.getItem("budgetOptimizer");
        let profileId = localStorage.getItem("BudgetProfileId")
        console.log(profileId)
        const AuthToken = "Bearer " + userToken;
     
        const payload = {
          ruleName, 
          actionType:actionType,
          profileId: profileId, 
          conditions: mainRuleData, 
          times: timeData, 
        };
      
        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/budgetRule/updateRule/${id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
              body: JSON.stringify(payload),
            }
          );
      
          if (!response.ok) {
           toast(`HTTP error! Status: ${response.status}`);
           setShowRules(false);
          }
      
          const data = await response.json();
          setShowRules(false);
          toast.success(data.message || "Updated successfully!");
          fetchBudgetRules(activePage,perPage,props.condition);
        } catch (toast) {
          console.error("Error fetching data:", toast);
        }
      };
      const handleApply = async () => {
        const userToken = localStorage.getItem("budgetOptimizer");
        let profileId = localStorage.getItem("BudgetProfileId")
        console.log(profileId)
        const AuthToken = "Bearer " + userToken;
        const payload = {
          ruleName, 
          actionType:actionType,
          profileId: profileId, 
          conditions: mainRuleData, 
          times: timeData, 
        };
      
        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/budgetRule/createRule`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
              body: JSON.stringify(payload),
            }
          );
      
          if (!response.ok) {
           toast(`HTTP error! Status: ${response.status}`);
           setShowRules(false);
          }
      
          const data = await response.json();
          setShowRules(data.data);
          setShowRules(false);
          toast.success(data.message || "Created Successfully!");
          fetchBudgetRules(activePage,perPage,props.condition);
        } catch (toast) {
          console.error("Error fetching data:", toast);
        }
      };

     const handlEdit = async (id: any) => {
        const userToken = localStorage.getItem("budgetOptimizer");
        let profileId = localStorage.getItem("BudgetProfileId");
        console.log(profileId);
        const AuthToken = "Bearer " + userToken;

        if (!id) {
          
          setRuleName('');
          setMainRuleData([]);
          setActionType({
            actionName: '',
            actionValue: '',
            actionValueType: ''
          });
          setTimeData([]);
          setShowRules(true);
          return;
        }

        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/budgetRule/getRule/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
            }
          );

          if (!response.ok) {
            toast(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setEditRules(data.data);
          setId(id);
          setRuleName(data.data.ruleName);
          setMainRuleData(data.data.conditions || []);
          setActionType(data.data.actionType || {});
          setTimeData(data.data.times || []);
          setShowRules(true);
          // toast.success(data.message || "Rule Created Sucessfully");
          
          
        } catch (toast) {
          console.error("Error fetching data:", toast);
        }
      };
      
      const handleAssign = async (profileId, _id, searchCampaignpopup) => {
        console.log(_id, "useEffect");
        console.log(searchCampaignpopup);
    
        if (typeof _id === "string") {
            setIsPopupVisible(true);
            setProfileId(profileId);
            setAssignedruleids(_id);
            console.log(_id, "campaignsid");
            
            const userToken = localStorage.getItem("budgetOptimizer");
            const AuthToken = "Bearer " + userToken;
            
            fetchData(profileId, searchCampaignpopup, AuthToken);
        }
    };
    
    const fetchData = async (profileId, searchValue, AuthToken) => {
        try {
            const response = await fetch(
                `https://budget-api.getgrowth.agency/api/amazon/budgetRule/${profileId}/getCampaigns`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: AuthToken,
                    },
                    body: JSON.stringify({
                        search: searchValue,
                        pageNo: ActivePageAssign,
                        perPage: PerPageAssign,
                    }),
                }
            );
    
            const data = await response.json();
            setruleid(data.data);
            setcampaignslist(data.data);
            setActiveAssign(data.activePage);
            setLastAssign(data.totalPages);
            setTotalRowAssign(data.totalRecords);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setSpinner(false);
        }
    };
    
    // Using useEffect to refetch data when searchCampaignpopup changes
    useEffect(() => {
        if (profileId) {
            const userToken = localStorage.getItem("budgetOptimizer");
            const AuthToken = "Bearer " + userToken;
            fetchData(profileId, searchCampaignpopup, AuthToken);
        }
    }, [searchCampaignpopup,ActivePageAssign, PerPageAssign]);
        useEffect(() => {
          if (isPopupVisible && ruleid && Array.isArray(ruleid)) {
            console.log(searchCampaignpopup,"1sxsxsxs")
            const assignProfileId = profileId; 
            handleAssign(assignProfileId, ruleid,searchCampaignpopup);
            console.log(ActivePageAssign,"2")
          }
          console.log(PerPageAssign,"3")
        }, [isPopupVisible, ruleid,searchCampaignpopup, ActivePageAssign, PerPageAssign]);
      
      const handleActionType = (e) => {
        if (e.target.value == "Paused") {
          setActionType({
            actionName: "Paused",
            actionValue: "",
            actionValueType: "",
          });
        } else {
          setActionType({
            ...actionType,
            [e.target.name]: e.target.value,
          });
        }
      };   

      useEffect(() => {
        const initialSelected = Budgetrules.filter((rule) => rule.isTemplate).map((rule) => rule._id);
        setSelectedTemplateIds(initialSelected);
        console.log("Initial selected IDs:", initialSelected);
    }, [Budgetrules]);

      const handleCheckboxChange = (item) => {
        console.log("handleCheckboxChange triggered for:", item);
        const updatedRules = budgetRules.map((rule) =>
            rule._id === item._id ? { ...rule, isTemplate: !rule.isTemplate } : rule
        );
        setBudgetRules(updatedRules);
        const isAlreadySelected = selectedTemplateIds.includes(item._id);
        const updatedSelectedTemplateIds = isAlreadySelected
            ? selectedTemplateIds.filter((id) => id !== item._id) 
            : [...selectedTemplateIds, item._id]; 
        setSelectedTemplateIds(updatedSelectedTemplateIds);
        console.log("Updated selectedTemplateIds:", updatedSelectedTemplateIds);
      };

      // useEffect(() => {
      //   const initialAssignSelected = campaignslist
      //     .filter((campaign: any) =>
      //       getcampaigns.some((getcampaign: any) => getcampaign.campaignId === campaign.campaignId)
      //     )
      //     .map((campaign: any) => campaign.campaignId); 
      
      //   setAllIds(initialAssignSelected);
      //   console.log("Initial Assign selected IDs:", initialAssignSelected);
      // }, [campaignslist, getcampaigns]);

      
       const handleAssigncampaignHandler = (
            e: React.ChangeEvent<HTMLInputElement>,
            item: any,
            campaignId: any
          ) => {
            let arr = [...allIds];
            let schedules=[...selectedData]; 
            if (e.target.checked) {
              if (!arr.includes(campaignId)) {
                arr.push(campaignId);
              }
              schedules.push(item);
            } else {
              arr = arr.filter((id) => id !== campaignId)
              schedules = schedules.filter((schedule) => schedule !== campaignId);
            }
          
            console.log(arr, "; Updated allIds");
            console.log(schedules, ": Schedules");
          
            setselectedData(schedules); 
            setAllIds(arr);
          };
      
      

      // const selectAllHandler = (e) => {
      //   let arr = allIds || [];
      //   if (e.target.checked) {
      //     setselectAllCheck(true);
    
      //     searchData.forEach((el) => {
      //       arr.push(el.campaignId);
      //     });
      //     const uniqueArray = [...new Set(arr)];
      //     setAllIds(uniqueArray);
      //   } else {
      //     setselectAllCheck(false);
      //     setAllIds((prevIds) =>
      //       prevIds?.filter(
      //         (id) => !searchData.map((el) => el.campaignId).includes(id)
      //       )
      //     );
      //   }
      // };
    
      const selectAllHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
      
        if (checked) {
          const newAllIds = searchData?.map((item) => item.campaignId) || [];
          setAllIds(newAllIds);
        } else {
          setAllIds([]);
        }
        setSelectAllCheckpopup(checked);
      };


      // const selectAllHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      //   const checked = e.target.checked;
      
      //   if (checked) {
      //     const newAllIds = searchData.map((item) => item.campaignId);
      //     setAllIds(newAllIds);
      //   } else {
      //     setAllIds([]); 
      //   }
      
      //   setSelectAllCheckpopup(checked); 
      // };

      const deleterule = async (id: any) => {
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
       
          try {
            const response = await fetch (
              `https://budget-api.getgrowth.agency/api/amazon/budgetRule/deleteRule/${id}`,
              {
                method: 'DELETE', 
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AuthToken,
                },
            }
          );
            setSpinner(false);
            const data = await response.json();
            toast.success(data.message || "Deleted Successfully!");
            fetchBudgetRules(activePage,perPage,props.condition);
          } catch (error) {
            setSpinner(false);
            console.error("Error fetching data:", error);
          }
      };
      
      const AddtoTemplatebutton = async () => {
        const userToken = localStorage.getItem("budgetOptimizer");
        const profileId = localStorage.getItem("BudgetProfileId");
        const AuthToken = "Bearer " + userToken;
    
        // Prepare ruleIds with selected rule IDs
        const ruleIds = Budgetrules.filter((rule) => rule.isTemplate).map((rule) => rule._id);
    
        if (ruleIds.length === 0) {
            toast.warning("No rules selected for the template.");
            return;
        }
    
        const AddtoTemplatePayload = {
            profileId: profileId,
            ruleIds: selectedTemplateIds,
        };
    
        try {
            const response = await fetch(`https://budget-api.getgrowth.agency/api/amazon/budgetRule/addTemplate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: AuthToken,
                },
                body: JSON.stringify(AddtoTemplatePayload),
            });
    
            console.log("Payload sent to API:", AddtoTemplatePayload);
    
            if (!response.ok) {
                toast.error(`HTTP error! Status: ${response.status}`);
                return;
            }
    
            const data = await response.json();
            toast.success(data.message || "Created Successfully!");
        } catch (error) {
            console.error("Error sending data to API:", error);
            toast.error("Failed to send data to the server.");
        }
    };
     
    const Assigncampaigns = async () => {
      
        const userToken = localStorage.getItem("budgetOptimizer");
        const profileId = localStorage.getItem("BudgetProfileId");
        const AuthToken = "Bearer " + userToken;

        const campaignIds = allIds
        const Assigncampaigns = {
          campaignIds,
        };
    
        try {
            const response = await fetch(`https://budget-api.getgrowth.agency/api/amazon/budgetRule/updateRule/${Assignedruleids}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: AuthToken,
                },
                body: JSON.stringify(Assigncampaigns),
            });
    
            console.log("Payload sent to API:", Assigncampaigns);
            console.log(Assignedruleids,"id ? or data?")
            if (!response.ok) {
                toast.error(`HTTP error! Status: ${response.status}`);
                return;
            }
    
            const data = await response.json();
            toast.success(data.message || "Created Successfully!");
            setIsPopupVisible(false);
            fetchBudgetRules(activePage,perPage,props.condition);
        } catch (error) {
            console.error("Error sending data to API:", error);
            toast.error("Failed to send data to the server.");
        }
    };
        
    const getIdsFromArray = (arr) => arr.slice(1).map((item) => item[0]);



         const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
              const userToken = localStorage.getItem("budgetOptimizer");
              const AuthToken = "Bearer " + userToken;
              const profileId = localStorage.getItem("BudgetProfileId");
            
              const file = event.target.files?.[0];
              if (!file) return;
            
              if (file.name.endsWith(".xlsx")) {
                setValidExcelFile(true);
            
                const reader = new FileReader();
            
                reader.onload = async (e) => {
                  const data = e.target?.result;
                  const workbook = xlsx.read(data, { type: "binary" });
                  const firstSheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[firstSheetName];
                  const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            
                  const ids = getIdsFromArray(excelData);
                  setAssign(ids);
            
                  const campaignIds = Array.from(new Set([...allIds, ...ids.map(String)]));
            
                  // const sendData = {
                  //   campaignIds: myArrc,
                  // };
            
                  dispatch(handleLoader(true));
            
                  try {
                    const response = await fetch(
                      `https://budget-api.getgrowth.agency/api/amazon/budgetRule/${profileId}/selectedCampaigns`, 
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: AuthToken,
                        },
                        body: JSON.stringify({
                          campaignIds,
                          // profileId,
                          // sendData,
                        }),
                      }
                    );
            
                    const res = await response.json(); // Parse the JSON response
            
                    if (res.isSuccess) {
                      setExcelSelected(res.data);
                      setAllIds(res.data);
                    } else {
                      toast.error(res.message);
                    }
                  } catch (err) {
                    console.error("API Error:", err);
                    toast.error("Failed to assign campaigns.");
                  } finally {
                    dispatch(handleLoader(false));
                  }
                };
            
                reader.readAsBinaryString(file);
              } else {
                alert("Please upload a valid Excel file (.xlsx)");
              }
            };
        
        
            const handleDeAssign = (event) => {
              const file = event.target.files[0];
              if (!file) return;
            
              if (file.name.endsWith(".xlsx")) {
                setValidExcelFile(true);
                const reader = new FileReader();
            
                reader.onload = (e) => {
                  const data = e.target?.result;
                  const workbook = xlsx.read(data, { type: "binary" });
                  const firstSheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[firstSheetName];
                  const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
            
                  const ids = getIdsFromArray(excelData).map(String);
                  const filteredArray = allIds.filter((item) => !ids.includes(item));
            
                  setAllIds(filteredArray);
                };
            
                reader.readAsBinaryString(file);
              } else {
                alert("Please upload a valid Excel file (.xlsx)");
              }
            };

  return (
    <div>
       <div>
        <Row className="mt-2 mb-2">
          <Col style={{justifyContent:"flex-end",display:"flex" }}>  
         
          <div className="campaigns">
            <div className='display: flex;justify-content: flex-end'> 
            <button
                title="Add Budget Rule"
                className="handleAddToTemplateClick"
                onClick={() => {
                  setShowRules(true);
                  // setEditId();
                }}
              >
                Add Budget Rule
              </button>
          <button
                title="Add to Template"
                className="Top-button"
                onClick={() => handleAddToTemplateClick(ActivePageAddtotemplate, PerPageAddtotemplate)}
                >
                Add to Template
              </button>
          </div>
          
              <button
                title="Add from Template"
                className="Top-button"
                onClick={() => handleAddfromTemplateClick(ActivePageAddfromtemplate, PerPageAddfromtemplate)}
              >
                Add from Template
              </button>
      </div>
      </Col>
      </Row>
    </div>
    <div className='Budget-table'>
            <table className= "full-table" cellPadding="10" style={{ borderCollapse: 'collapse'}}>
                <thead className='table-heaad'>
                    <tr>
                    <th>
                      <Form.Check className='thead__Checkbox' type='checkbox'
                          checked={selectAllChecks}
                          // onChange={handleSelectedAllCheck}
                            />
                        </th>
                        <th>Active</th>
                        <th 
                        onMouseEnter={() => setHoveredColumn('ruleName')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('ruleName')}>Rule Name
                        {hoveredColumn === 'ruleName' || sortConfig.key === 'ruleName' ? (
                            sortConfig.key === 'ruleName' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th >Conditions</th>
                        {/* <th onClick={() => handleSort('conditions')}>Conditions
                        {sortConfig.key === 'conditions' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                        </th> */}
                        <th 
                        onMouseEnter={() => setHoveredColumn('actionType')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('actionType')}>Action Type
                        {hoveredColumn === 'actionType' || sortConfig.key === 'actionType' ? (
                            sortConfig.key === 'actionType' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th >Rule Time</th>
                        {/* <th onClick={() => handleSort('ruletime')}>Rule Time
                        {sortConfig.key === 'ruletime' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                        </th> */}
                        <th style={{ padding: "0px 0px 0px 0px" }} >Assign Campaigns</th>
                        {/* <th onClick={() => handleSort('assigncampaigns')}>Assign Campaigns
                        {sortConfig.key === 'assigncampaigns' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                        </th> */}
                        <th style={{ padding: "0px 59px" }}
                         onMouseEnter={() => setHoveredColumn('updatedAt')}
                         onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('updatedAt')}>Update Date
                        {hoveredColumn === 'updatedAt' || sortConfig.key === 'updatedAt' ? (
                            sortConfig.key === 'updatedAt' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody className="tbody-td">
                {spinner ? (
                  <td colSpan={10} style={{ textAlign: 'center', height: '450px', verticalAlign: 'middle' }}>
                <div className="loading-container">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              </td>
              ) : Array.isArray(Budgetrules) && Budgetrules.length > 0 ? (
                Budgetrules.map((rule, index) => (
                  <tr className="tbody-tr:hover" key={index}>
                     <td>
                        <Form.Check
                            // checked={rule.failureOn ? true : selectedChecks.includes(rule.id)} 
                            // onChange={() => handleCheckboxChange(rule.id)}
                            // disabled={!report.failureOn} 
                            className='thead__Checkbox'
                            type='checkbox'
                            // checked={rule.isActive} 
                            style={{ margin: "3px", padding: 0, verticalAlign: 'middle' }}
                        />
                    </td>
                    <td>
                      <label className="switch">
                        <input 
                          type="checkbox" 
                          checked={isActive[rule._id] ?? rule.isActive } 
                          onChange={(e) => handleActiveStatus(rule._id, e.target.checked)}  
                          style={{ margin: "3px", padding: 0, verticalAlign: 'middle' }}
                        />
                        <span className="slider"></span>
                      </label>
                    </td>
                    <td>{rule.ruleName}</td>
                    <td>
                      {Array.isArray(rule.conditions) ? (
                        rule.conditions.map((condition, i) => {
                          const operatorSymbols = {
                            "GREATER_THAN": ">",
                            "GREATER_THAN_OR_EQUAL_TO": ">=",
                            "LESS_THAN": "<",
                            "LESS_THAN_OR_EQUAL_TO": "<=",
                            "EQUAL_TO": "=",
                            "NOT_EQUAL_TO": "!=",
                            "CONTAINS": "contains"
                          };

                          const operatorSymbol = operatorSymbols[condition.conditionOperator] || condition.conditionOperator;

                          return (
                            <div key={i}>
                              {condition.conditionType} {operatorSymbol} {condition.conditionValue}
                            </div>
                          );
                        })
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {rule.actionType?.actionName ? (
                        rule.actionType.actionName === "setBudget" ? (
                          `Set Budget by ${rule.actionType.actionValue}${rule.actionType.actionValueType === "Number" ? "$" : "%"}`
                        ) : rule.actionType.actionName === "Enabled" ? (
                          "Campaign Enabled"
                        ) : rule.actionType.actionName === "Paused" ? (
                          "Campaign Paused"
                        ) : rule.actionType.actionName === "Increase" ? (
                          `Increase Budget by ${rule.actionType.actionValue}${rule.actionType.actionValueType === "Number" ? "$" : "%"}`
                        ) : rule.actionType.actionName === "Decrease" ? (
                          `Decrease Budget by ${rule.actionType.actionValue}${
                            rule.actionType.actionValueType !== "Number" ? "%" : "$"
                          }`
                        ) : (
                          "-"
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{rule.times ? formatTimes(rule.times) : "-"}</td>
                    <td style={{ color: Array.isArray(rule.campaignIds) && rule.campaignIds.length > 0 ? 'blue' : 'black' }} onClick={() => handlecampaignsid(rule._id)}>
                      {Array.isArray(rule.campaignIds) ? rule.campaignIds.length : "-"}
                    </td>
                    <td>
                      {rule.updatedAt ? (
                        (() => {
                          const timeZoneCountry = "America/Los_Angeles"; 
                          const formattedDateTime = moment(rule.updatedAt)
                            .tz(timeZoneCountry)
                            .format("MM/DD/YYYY hh:mm:ss A z");
                          return formattedDateTime;
                        })()
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      
                    <div className="col-action-container text-right">
                    <div
                      id={"dropdownMenuButton" + ""}
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <img src={ActionDot} alt="actions" />
                    </div>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuButton"
                      style={{ height: "auto" }}
                    >
                      <li>
                        <p className="dropdown-item" onClick={() => handleAssign(rule.profileId,rule._id,searchCampaignpopup)}>
                          Assign
                        </p>
                      </li>
                      <li>
                        <p className="dropdown-item" onClick={() => handlEdit(rule._id)}>
                          Edit
                        </p>
                      </li>
                      <li>
                        <Popconfirm
                          title="Delete"
                          description={`Are you sure you want to delete the rule "${rule.ruleName}"?`}
                          onConfirm={() => deleterule(rule._id)} 
                          okText="Yes"
                          cancelText="No"
                        >
                          <p className="dropdown-item text-red" style={{ cursor: "pointer" }}>
                            Delete
                          </p>
                        </Popconfirm>
                      </li>
                    </ul>
                  </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center' }}>
                  No Rows 
                </td>
                </tr>
              )}
            </tbody>
            </table> 
        </div>
        <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={perPage}
                      onChange={(event) => applyDataLength(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {totalRow} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={lastPage}
                      page={activePage}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleChange}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div> 
          <div>
     
      <>
    {showAssign && assign && (
      <Modal show={showAssign} onHide={() => setShowAssign(false)} size="lg" aria-labelledby="example-modal-sizes-title-lg">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
            Associated Campaigns
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <div className="popup">
              <input
                type="text"
                className="text_search"
                placeholder="Search Here..."
                value={searchCampaign}
                onChange={handleInputChange} 
              />
              {/* <button className="Top-button" onClick={handleSearchClick} >
                Search
              </button> */}
              <button className="handleAddToTemplateClick " onClick={handleReset}>
                Reset
              </button>
            </div>
            <div className="data-mt-3"  >
              {assign.length > 0 ? (
                assign.map((item, index) => (
                  <div key={index} className="data-item">
                    <p>{item.name}</p>
                  </div>
                ))
              ) : (
                <p>No data available</p>
              )}
            </div>
           
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={PerPagecampaignsid}
                      onChange={(event) => applyDataLengthcampaignsid(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {TotalRowcampaignsid} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={LastPagecampaignsid}
                      page={ActivePagecampaignsid}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleChangecampaignsid}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          
          </Row>
        </Modal.Body>
      </Modal>
    )}
  </>
  <>
  {toTemplateModal && (
    <Modal
      show={showmodal}
      onHide={() => setToTemplateModal(null)}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="modal-contentpopup">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
            Add To Template
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <div className="Budget-tablepopup">
              {Array.isArray(toTemplateModal) && toTemplateModal.length > 0 ? (
                <table
                  className="full-table"
                  cellPadding="10"
                  style={{ width: '100%', borderCollapse: 'collapse' }}
                >
                  <thead className="table-heaad">
                    <tr>
                      <th>
                        
                      </th>
                      <th>Rule Name</th>
                      <th>Conditions</th>
                      <th>Action Type</th>
                      <th>Rule Time</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-td">
                    {toTemplateModal.map((item, index) => (
                      <tr key={index}>
                       <td>
                       <Form.Check
                                checked={selectedTemplateIds.includes(item._id)}
                                onChange={() => handleCheckboxChange(item)}
                                className="custom-checkbox"
                                type="checkbox"
                                style={{ margin: "3px", padding: 0, verticalAlign: "middle" }}
                            />
                          </td>
                        <td>{item.ruleName || '-'}</td>
                        <td>
                          {Array.isArray(item.conditions) ? (
                            item.conditions.map((condition, i) => {
                              const operatorSymbols = {
                                GREATER_THAN: '>',
                                GREATER_THAN_OR_EQUAL_TO: '>=',
                                LESS_THAN: '<',
                                LESS_THAN_OR_EQUAL_TO: '<=',
                                EQUAL_TO: '=',
                                NOT_EQUAL_TO: '!=',
                                CONTAINS: 'contains',
                              };
                              const operatorSymbol =
                                operatorSymbols[condition.conditionOperator] ||
                                condition.conditionOperator;
                              return (
                                <div key={i}>
                                  {condition.conditionType} {operatorSymbol}{' '}
                                  {condition.conditionValue}
                                </div>
                              );
                            })
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                      {item.actionType?.actionName ? (
                        item.actionType.actionName === "setBudget" ? (
                          `Set Budget by ${item.actionType.actionValue}${item.actionType.actionValueType === "Number" ? "$" : "%"}`
                        ) : item.actionType.actionName === "Enabled" ? (
                          "Campaign Enabled"
                        ) : item.actionType.actionName === "Paused" ? (
                          "Campaign Paused"
                        ) : item.actionType.actionName === "Increase" ? (
                          `Increase Budget by ${item.actionType.actionValue}${item.actionType.actionValueType === "Number" ? "$" : "%"}`
                        ) : item.actionType.actionName === "Decrease" ? (
                          `Decrease Budget by ${item.actionType.actionValue}${
                            item.actionType.actionValueType !== "Number" ? "%" : "$"
                          }`
                        ) : (
                          "-"
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                        <td>
                        {item.times ? 
                          (item.times.join(' ').slice(0, 25) + (item.times.join(' ').length > 10 ? '...' : '')) 
                          : '-'}
                      </td>
                      </tr> 
                    ))}
                  </tbody>
                </table>
                
              ) : (
                <p>No data available</p>
              )}
               <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={PerPageAddtotemplate}
                      onChange={(event) => applyDataLengthAddtotemplate(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {TotalRowAddtotemplate} total entries</span> 
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={LastPagAddtotemplate}
                      page={ActivePageAddtotemplate}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleAddtotemplate}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
              <div style={{justifyContent:"center",display:"flex",padding: "14px"}}>
                <button
                    title="Add to Template"
                    className="handleAddToTemplateClick"
                    onClick={() => AddtoTemplatebutton()}
                    >
                    Add to Template
              </button>
              </div>
            </div>
          </Row>
        </Modal.Body>
      </div>
    </Modal>
  )}
</>
  <>
  {templateModal && (
    <Modal
      show={fromtemplateshowmodal}
      onHide={() => setTemplateModal(null)}
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="modal-contentpopup">
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
            Add from Template
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
          <div className="popup">
              <input
                type="text"
                className="text_searchfromTemplate"
                placeholder="Search Here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                onClick={addfromtemplatehandleSearchClick} 
              />
              <button className="handleAddToTemplateClick" onClick={addfromtemplatehandleReset}>
                Reset
              </button>
            </div>
            <div className="Budget-tablepopup">
            {Array.isArray(templateModal) && templateModal.length > 0 ? (
                <table
                  className="full-table"
                  cellPadding="10"
                  style={{ width: '100%', borderCollapse: 'collapse' }}
                >
                  <thead className="table-heaad">
                    <tr>
                      <th>
                        
                      </th>
                      <th>Rule Name</th>
                      <th>Conditions</th>
                      <th>Action Type</th>
                      <th>Rule Time</th>
                      <th>Origin</th>
                    </tr>
                  </thead>
                  <tbody className="tbody-td">
                  
                  {(filteredData?.length > 0 ? filteredData : templateModal).map((item, index) => (
                    
                <tr key={index}>
                  <td>
                    <Form.Check
                      onChange={() => handleCheckboxChangeselectedCheckstemplateModal(item._id)}
                      className="custom-checkbox"
                      type="checkbox"
                      style={{ margin: "3px", padding: 0, verticalAlign: "middle" }}
                    />
                  </td>
                  <td>{item.ruleName || '-'}</td>
                  <td>
                    {Array.isArray(item.conditions) ? (
                      item.conditions.map((condition, i) => {
                        const operatorSymbols = {
                          GREATER_THAN: '>',
                          GREATER_THAN_OR_EQUAL_TO: '>=',
                          LESS_THAN: '<',
                          LESS_THAN_OR_EQUAL_TO: '<=',
                          EQUAL_TO: '=',
                          NOT_EQUAL_TO: '!=',
                          CONTAINS: 'contains',
                        };
                        const operatorSymbol = operatorSymbols[condition.conditionOperator] || condition.conditionOperator;
                        return (
                          <div key={i}>
                            {condition.conditionType} {operatorSymbol} {condition.conditionValue}
                          </div>
                        );
                      })
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    {item.actionType?.actionName ? (
                      item.actionType.actionName === "setBudget" ? (
                        `Set Budget by ${item.actionType.actionValue}${item.actionType.actionValueType === "Number" ? "$" : "%"}`
                      ) : item.actionType.actionName === "Enabled" ? (
                        "Campaign Enabled"
                      ) : item.actionType.actionName === "Paused" ? (
                        "Campaign Paused"
                      ) : item.actionType.actionName === "Increase" ? (
                        `Increase Budget by ${item.actionType.actionValue}${item.actionType.actionValueType === "Number" ? "$" : "%"}`
                      ) : item.actionType.actionName === "Decrease" ? (
                        `Decrease Budget by ${item.actionType.actionValue}${item.actionType.actionValueType !== "Number" ? "%" : "$"}`
                      ) : (
                        "-"
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {item.times
                      ? item.times.join(' ').slice(0, 25) +
                        (item.times.join(' ').length > 25 ? '...' : '')
                      : '-'}
                  </td>
                  <td>{item.profileName || '-'}</td>
                </tr>
              ))}

                </tbody>
                </table>
                
              ) : (
                <p>No data available</p>
              )}
              <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={PerPageAddfromtemplate}
                      onChange={(event) => applyDataLengthAddfromtemplate(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {TotalRowAddfromtemplate} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={LastPagAddfromtemplate}
                      page={ActivePageAddfromtemplate}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleAddfromtemplate}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div> 
              <div style={{justifyContent:"center",display:"flex",padding: "14px"}}>
                <button
                    title="Add to Template"
                    className="handleAddToTemplateClick"
                    onClick={() => handleAddToTemplateClick(ActivePageAddfromtemplate, PerPageAddfromtemplate)}
                    >
                    Import the Rules 
              </button>
              </div>
            </div>
          </Row>
        </Modal.Body>
      </div>
    </Modal>
  )}
</>
<>
  {showRules && (
    <Modal
      show={showRules}
      onHide={() => setShowRules(false)} 
      size="lg"
      aria-labelledby="example-modal-sizes-title-lg"
    >
      <div className="BudgetRules-modal-contentpopup">
      <Modal.Header closeButton onHide={() => {
        setShowRules(false);
        setId(''); 
        setRuleName('');
        setMainRuleData([
          {
            conditionType: "",
            conditionOperator: "",
            conditionValue: "",
            conditionValueType: "",
          },
        ]);
        
        setActionType({
          actionName: '',
          actionValue: '',
          actionValueType: ''
        });
        setTimeData([{}]);
      }}>
      <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
        {ids ? "Edit Budget Rule" : "Add Budget Rule"}
      </Modal.Title>
    </Modal.Header>


        <Modal.Body>
        <Row>
        <Col md={12} className="mb-3 rulename-border">
          <label htmlFor="ruleName" style={{ fontWeight: "bold" }}>
            Rule Name:
          </label>
          <input
            type="text"
            id="ruleName"
            className="form-control"
            placeholder="Enter rule a name"
            onChange={(e) => setRuleName(e.target.value)}
            value={ruleName}
          />
        </Col>

        <div className="row mt-2 rulename-border">
          <div className="plus_icon">
            <label htmlFor="timezone" style={{ fontWeight: "bold" }}>
              Conditions :
            </label>
            <AiOutlinePlus size={22} onClick={addConditionHandler} />
          </div>
          {mainRuleData.map((field, index) => (
            <Row key={index} className="mb-3">
              <Col md={3} className="mb-2">
                <select
                  className="form-control custom-dropdown"
                  value={field.conditionType}
                  onChange={(e) => {
                    const updatedData = [...mainRuleData];
                    updatedData[index].conditionType = e.target.value;
                    setMainRuleData(updatedData);
                  }}
                >
                  <option value="">Select</option>
                  {mainLabel.map((el, i) => (
                    <option key={i} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={3} className="mb-2">
                <select
                  className="form-control custom-dropdown"
                  value={field.conditionOperator}
                  onChange={(e) => {
                    const updatedData = [...mainRuleData];
                    updatedData[index].conditionOperator = e.target.value;
                    setMainRuleData(updatedData);
                  }}
                >
                  <option value="">Select</option>
                  {validatorLabel.map((el, i) => (
                    <option key={i} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>
              </Col>
              <Col md={3} className="mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Value"
                  value={field.conditionValue}
                  onChange={(e) => {
                    const updatedData = [...mainRuleData];
                    updatedData[index].conditionValue = e.target.value;
                    setMainRuleData(updatedData);
                  }}
                />
              </Col>
              <Col md={3} className="minifiest">
                <select
                  className="form-control custom-dropdown"
                  value={field.conditionValueType}
                  onChange={(e) => {
                    const updatedData = [...mainRuleData];
                    updatedData[index].conditionValueType = e.target.value;
                    setMainRuleData(updatedData);
                  }}
                >
                  <option value="">Select</option>
                  {selector.map((el, i) => (
                    <option key={i} value={el.value}>
                      {el.label}
                    </option>
                  ))}
                </select>
                <div className="minus_icon">
                  {index !== 0 && (
                    <AiFillDelete
                      size={22}
                      className="icon"
                      onClick={() => handleRemoveRule(index)}
                    />
                  )}
                </div>
              </Col>
            </Row>
          ))}
        </div>

        <Col md={12} className="mb-3">
          <label htmlFor="ruleType" style={{ fontWeight: "bold" }}>
            Action Type:
          </label>
          <Row>
            <Col md={3} className="mb-2">
              <select
                id="ruleType1"
                className="form-control custom-dropdown"
                name="actionName"
                value={actionType.actionName}
                onChange={(e) => handleActionType(e)}
              >
                <option value="">Select</option>
                {subValueType.map((el, index) => (
                  <option key={index} value={el.value}>
                    {el.label}
                  </option>
                ))}
              </select>
            </Col>

            <Col md={3} className="mb-2">
            {actionType.actionName !== "Paused" &&
                actionType.actionName !== "Enabled" && (
              <input
                type="text"
                id="Value"
                className="form-control"
                name="actionValue"
                placeholder="Value"
                value={actionType.actionValue}
                onChange={(e) => handleActionType(e)}
              />
              )}
            </Col>

            <Col md={3} className="mb-2">
              {actionType.actionName !== "Paused" &&
                actionType.actionName !== "Enabled" && (
                  <select
                    id="ruleType2"
                    className="form-control custom-dropdown"
                    name="actionValueType"
                    value={actionType.actionValueType}
                    onChange={(e) => handleActionType(e)}
                  >
                    <option value="">Select</option>
                    {selector.map((el, i) => (
                      <option key={i} value={el.value}>
                        {el.label}
                      </option>
                    ))}
                  </select>
                )}
            </Col>
          </Row>
        </Col>

        <Col md={12} className="mb-2">
      <div className="plus_icon">
        <label htmlFor="timezone" style={{ fontWeight: "bold" }}>
          Rule Times:
        </label>
        <AiOutlinePlus
          size={22}
          className="plus_icon"
          onClick={handleAddTimeField}
        />
      </div>

      <div className="row time"  
      style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
        }}>
        {timeData?.map((element, index) => (
          <div
            key={index}
            className="d-flex align-items-center col-md-2 mb-2"
            style={{ marginRight: "10px" }} 
          >
            <TimePicker
              className="form_rule"
              placeholder="Value"
              onChange={(e) => handleTimeChange(index, e)}
              value={element && typeof element === "string" ? dayjs(element, "HH:mm") : null} 
              format="hh:mm A"
              clearIcon={null}
              id={`mainRuleData-${index}`}
              name={`mainRuleData-${index}`}
            />
            {index !== 0 && (
              <AiFillDelete
                size={22}
                className="icon ml-2"
                onClick={() => handleRemoveTimeField(index)}
              />
            )}
          </div>
        ))}
      </div>
    </Col>
      </Row>

        </Modal.Body>

        <Modal.Footer  className="d-flex justify-content-center">
        <button
          className="Top-button"
          onClick={() => {
            setShowRules(false); 
            setId(''); 
            setRuleName(''); 
            setMainRuleData([
              {
                conditionType: "",
                conditionOperator: "",
                conditionValue: "",
                conditionValueType: "",
              },
            ]); 
            setActionType({
              actionName: '',
              actionValue: '',
              actionValueType: ''
            }); 
            setTimeData([{}]); 
          }}
          style={{ width: "200px" }}
        >
          Cancel
        </button>
        <button
          className="handleAddToTemplateClick"
          style={{width:"200px"}}
          onClick={() => {
            if(ids){
              handleupdate(ids);
            }else{
              handleApply();
            }
            
          }}
        >
         {ids? "Update" :"Create"}
        </button>
      </Modal.Footer>
      </div>
    </Modal>
  )}
</>

<>
{isPopupVisible && ruleid && (
        <Modal
          show={ruleid !== null}
          onHide={() => setruleid(null)}
          size="lg"
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <div className="BudgetRules-modal-contentpopup">
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
              List of Campaigns
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Row>
              <div className="List-Campaigns-pop">
              <input
                type="text"
                className="text_searchfromTemplatelistcampaigns"
                placeholder="Search Here..."
                value={searchCampaignpopup}
                onChange={(e) => setsearchCampaignpopup(e.target.value)} 
              />
              <div>
              <a download="sample excel format">
                <button className="handleAddToTemplateClick" onClick ={()=>{downloadExcelFile(selectedData)}} >Download Sample File</button>
              </a>
                <input
                  type="file"
                  accept=".xlsx"
                  id="assignFileInput"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <button
                  className="handleAddToTemplateClick"
                  onClick={() => {
                    const assignFileInput = document.getElementById("assignFileInput");
                    if (assignFileInput) {
                      assignFileInput.click();
                    }
                  }}
                >
                  Assign
                </button>
            <input
              type="file"
              accept=".xlsx"
              id="deassignFileInput"
              style={{ display: "none" }}
              onChange={handleDeAssign}
            />
            <button
              className="handleAddToTemplateClick"
              onClick={() => {
                const deassignFileInput = document.getElementById("deassignFileInput");
                if (deassignFileInput) {
                  deassignFileInput.click();
                }
              }}
            >
              De-Assign
            </button>
              </div>
              </div>
              {validExcelFile && (
                <div className="row col-11">
                  <p className="text-end filer_text"> File: Excel file selected</p>
                </div>
              )}

          <div className="row col-12 m-auto mb-2 checkbox-popup">
            <div className="col">
              <input
                type="checkbox"
                className="me-2"
                checked={selectAllCheckpopup}
                onChange={(e) => selectAllHandler(e)}
              />
              <label>
                <b> All Select</b>
              </label>
            </div>
            <div className="col d-flex align-items-center justify-content-end">
              <label className="me-2">
                <b>Selected</b>
              </label>
              <p className="m-0">{allIds.length}</p>
              
            </div>
          </div>

          <div className="row budgetpopup-data">
          {spinner ? (
            <p>Loading...</p>
          ) : ruleid.length > 0 ? (
            ruleid.map((item, index) => (
              <div key={index} className="col-md-6">
                <div className="col-1 pb-2 p-0" style={{ cursor: "pointer" }}>
                <input
                    type="checkbox"
                    id={`checkbox-${index}`}
                    checked={allIds.includes(item.campaignId)}
                    className="input_rule-checkbox"
                    onChange={(e) => handleAssigncampaignHandler(e, item, item.campaignId)} 
                  />
                  
                </div>
                <div className="pb-2 p-0">
                  <label
                    htmlFor={`checkbox-${index}`} 
                    style={{ marginLeft: "20px", marginBottom: "10px", cursor: "pointer" }}
                  >
                    {item.name}
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
        <div className="custom-table-footer">
            <Row>
              <Col md={5}>
                <form className="table-footer-left">
                  <span>Show </span>
                  <label>
                    <select
                      className="form-select"
                      defaultValue={PerPageAssign}
                      onChange={(event) => applyDataLengthAssign(event)}
                    >
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </label>
                  <span> of {TotalRowAssign} total entries</span>
                </form>
              </Col>
              <Col md={7}>
                <div className="table-footer-right">
                  <Stack spacing={2}>
                    <Pagination
                      count={LastPagAssign}
                      page={ActivePageAssign}
                      variant="outlined"
                      shape="rounded"
                      onChange={handleChangeassign}
                    />
                  </Stack>
                </div>
              </Col>
            </Row>
          </div> 
            
            </Row>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center">
            <button className="Top-button"  style={{ width: "200px" }} onClick={() => setruleid(null)}>
              Cancel
            </button>
            <button className="handleAddToTemplateClick" style={{ width: "200px" }} onClick={() => Assigncampaigns()}>
              Apply
            </button>
          </Modal.Footer>
          </div>
        </Modal>
      )}
    </>

    </div>
    </div>
        
  );
};

export default BudgetRules;



