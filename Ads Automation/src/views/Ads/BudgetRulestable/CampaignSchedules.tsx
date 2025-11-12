import React, { Component, useEffect, useState,useRef } from 'react';
import './BudgetTable.css'
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { Row, Col,Spinner,Modal,Tab,Nav  } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import moment from "moment-timezone";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import ActionDot from "../../../assets/images/icons/more-action-icon.svg";
import { Popconfirm } from "antd";
import { toast } from "react-toastify";
// import { saveAs } from "file-saver"; 
import fileDownload from "react-file-download";
import { AiOutlinePlus } from "react-icons/ai";
import {  TimePicker } from "antd";
import dayjs from 'dayjs';
import { id } from 'date-fns/locale';
import { Console } from 'console';
import * as xlsx from "xlsx";
import { handleLoader } from './loader';
import { getCampaign, ApicheckExcel } from "./APIcampaigns";
import { useDispatch, useSelector } from "react-redux";

interface CampaignSchedules{
    profileId:any;
    scheduleName:string;
    campaignIds:string;
    updatedAt:string;
    _id: string;
    selectedDay:string;
    starttimeData:string;
    EndtimeData:string;
}
interface CampaignSchedulesProps{
    condition: string;
  }
  interface Assign{
    name:string;
    pageCount: number;
  }
  interface ScheduleData {
    _id:any;
    scheduleName: string;
    profileId: string | number;
    countryCode: string;
    timezone: string;
  }
  interface CampaignsName{
    _id: string;
    length: number;
    dayName:String;
    endTime:string;
    startTime:string;
    scheduleName: string;
  }
  interface Campaign {
    _id: string;
    name: string;
    campaignId:string;
}
    interface getSchedulesCampaign {
      _id: string;
      name: string;
      selectedDay:string;
      starttimeData:string;
      EndtimeData:string;
  }
 
  const CampaignSchedules: React.FC<CampaignSchedulesProps> = (props) => {
  const [CampaignSchedules,setCampaignSchedules]=useState<CampaignSchedules[]>([])
  const [perPage, setPerPage] = useState(50);
  const [totalRow, setTotalRow] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [apiLoading, setApiLoading] = useState(false);
  const [spinner, setSpinner] = useState(false);  
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [assign, setAssign] = useState<Assign[] | null>(null); 
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchCampaign, setsearchCampaign] = useState("");
  const [AddSchedulerModal, setAddSchedulerModal] = useState(false);
  const [scheduleName, setscheduleName] = useState("");
  const [ excelSelected, setExcelSelected] = useState("");
  const [ids,setId]=useState("");
  const [ExportSchedules,setExportSchedules]=useState(false);
  const [editScheduleData, seteditScheduleData] = useState<ScheduleData | null>(null);
  const [GetScheduleData, setGetScheduleData] = useState<getSchedulesCampaign | null>(null);
  const [selectedData,setselectedData]=useState<any[]>([]);
  const [CampaignsName, setCampaignsName] = useState<CampaignsName | null>(null);
  const [activeTab, setActiveTab] = useState("campaignSchedules");
  const dispatch = useDispatch();

   const [tableData, setTableData] = useState<CampaignSchedules[]>(CampaignSchedules); 
      const [sortConfig, setSortConfig] = useState<{ key: keyof CampaignSchedules; direction: "asc" | "desc" }>({
      key: "scheduleName",
      direction: "asc", 
    });

    // const handleTabChange = (key) => {
    //   setActiveTab(key);
    // };

    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
    const [searchCampaignpopup, setsearchCampaignpopup] = useState("");
  const [validExcelFile, setValidExcelFile] = useState(false);

  //Assign pagination 
  const [ActivePageAssign, setActiveAssign] = useState(1); 
  const [TotalRowAssign,setTotalRowAssign]=useState(0)
  const [PerPageAssign,setPerPageAssign]=useState(50)
  const [LastPagAssign ,setLastAssign]=useState(1)
  const [Title ,setTitle]=useState([])
  const [campaignsAssign, setcampaignsAssign] = useState<Campaign[]>([]);
  const [campaignslist ,setcampaignslist]=useState([])

  const [selectAllCheckpopup, setSelectAllCheckpopup] = useState(false); 
  const [searchData, setSearchData] = useState<any[]>([]); 
 const [allIds, setAllIds] = useState<any>([]);

 // campaignsis pagination data 
 const [ActivePagecampaignsid,setActivePagecampaignsid] =useState(1)
 const [TotalRowcampaignsid,setTotalRowcampaignsid]=useState(0)
 const [PerPagecampaignsid,setPerPagecampaignsid]=useState(50)
 const [currentRuleId, setCurrentRuleId] = useState<string | null>(null);
 const [totalpagescampaignsid ,settotalpagescampaignsid]=useState(1)
 const [LastPagecampaignsid ,setLastPagecampaignsid]=useState(1)

 const [createscheduleid, setcreatescheduleid] = useState<string | null>(null);
 const [weekid, setweekid] = useState<string | null>(null);
 const [isActive ,setisActive]= useState<{ [key: string]: boolean }>({});
 
 const[scheduleId,setscheduleId] =useState('')
 const [isEditMode, setIsEditMode] = useState(false);
const [starttimeData, setstartTimeData] = useState<string>('');
const [EndtimeData, setEndTimeData] = useState<string>('');
 const [Addtime ,setAddtime]=useState(false)
 const [selectedDay, setSelectedDay] = useState<string>("");
 const daysOfWeek = [
  "Select",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

  const applyDataLengthAssign = (e) => {
    setActiveAssign(1); 
    setPerPageAssign(Number(e.target.value)) 
};

const handleChangeassign = (event, value) => {
  setActiveAssign(Number(value))
};

const applyDataLengthcampaignsid = (e) => {
  setActivePagecampaignsid(1)
  setPerPagecampaignsid(Number(e.target.value)) 
};

const handleChangecampaignsid = (event, value: number) => {
  setActivePagecampaignsid(Number(value))
};


// import fileDownload from "js-file-download";

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

  const handleSort = (key: keyof CampaignSchedules) => {
    let direction: "asc" | "desc" = "asc";
  
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
  
    const sortedData = [...CampaignSchedules].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];
  
      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
  
      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }
  
      if (aValue && typeof aValue === "object" && "actionName" in aValue) {
        const aSubValue = (aValue as any).actionName ?? "";
        const bSubValue = (bValue as any)?.actionName ?? "";
        return direction === "asc"
          ? aSubValue.localeCompare(bSubValue)
          : bSubValue.localeCompare(aSubValue);
      }
  
      return 0;
    });
  
 
    setSortConfig({ key, direction });
    setCampaignSchedules(sortedData);
  };

  const toggleOptions = (id: string) => {
   
    setShowOptions(showOptions === id ? null : id); 
  };

  const handleChange = (event, value: number) => {
    setActivePage(Number(value))
  };

  const applyDataLength = (e) => {
    console.log("dataSize: ", e.target.value);
    setActivePage(1)
    setPerPage(Number(e.target.value)) 
  };

  const handleInputChange = (e) => {
    setsearchCampaign(e.target.value); 
  };
  
 
  const handleSearchClick = () => {
    if (CampaignSchedules.length > 0) {
      handlecampaignsid(CampaignSchedules[0]._id); 
    } else {
      console.error("No BudgetRules available to assign");
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };
  
  const handleReset = async () => {
    setsearchCampaign(""); 
  };

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

  const fetchgetSchedules = async (activePage: number, perPage: number, condition: string) => {
    let userToken = localStorage.getItem("budgetOptimizer");
    let AuthToken = "Bearer " + userToken;
    let profileId = localStorage.getItem("BudgetProfileId")
    setSpinner(true);
      try {
          const response = await fetch(
              `https://budget-api.getgrowth.agency/api/amazon/adSchedules/${profileId}/getSchedules`,
              {
                  method: 'POST', 
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: AuthToken,
                  },
                  body: JSON.stringify({
                      pageNo: activePage,
                      perPage:perPage ,
                      // type: selectedProfile,
                      // status:selectedstatus,
                      // currencyCode: 'USD',
                      // search: searchKeyFilter,
                      // timezone: 'America/Los_Angeles',
                  }),
              }
          );

          if (!response.ok) {
              throw new Error('Failed to fetch campaigns data.');
          }

          const data = await response.json();
          if (data?.data) {
            setCampaignSchedules(data.data);
              setTotalRow(data.totalRecords)
              setActivePage(data.currentPageNo)
              setLastPage(data.totalPages)
              
          }
          setSpinner(false);
          console.log(data.data, "Fetched Campaigns Data");
      } catch (err) {
        setSpinner(false);
        console.error(err);
       } finally {
        setApiLoading(false); 
      }

  };

  useEffect(() => {
    fetchgetSchedules(activePage,perPage,props.condition);
      }, [activePage,perPage,props.condition]); 
      

      const handlScheduleEdit = async () => {
        
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
        let profileId = localStorage.getItem("BudgetProfileId");
      
        setSpinner(true); 
        setAddSchedulerModal(true);
        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/adSchedules/updateSchedule/${editScheduleData?._id}`,
            {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
              body: JSON.stringify({
                scheduleName: scheduleName, 
                profileId: editScheduleData?.profileId, 
                countryCode: editScheduleData?.countryCode,
                timezone: editScheduleData?.timezone, 
              }),
            }
          );
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          setAddSchedulerModal(false);
          toast.success(data.message || "Updated successfully!");
          fetchgetSchedules(activePage,perPage,props.condition);
        } catch (error) {
          console.error("Error fetching data:", error); 
        } finally {
          setSpinner(false); 
        }
      };
      const handleEditData= async(campaignSchedulesData:any)=>{
        setAddSchedulerModal(true);
        setscheduleName(campaignSchedulesData?.scheduleName)
        setId(campaignSchedulesData?._id);
        seteditScheduleData(campaignSchedulesData);
        console.log(campaignSchedulesData,"editoneDaa"); 
      }

      const handlecampaignsid = async (id: string,search: string = "") => {
        
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
        let profileId = localStorage.getItem("BudgetProfileId")
          // setSpinner(true);
          setCurrentRuleId(id)
          try {
            const response = await fetch (
              `https://budget-api.getgrowth.agency/api/amazon/adSchedules/getAssignCampaigns/${id}`,
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
              setShowModal(true);
          } else {
              setAssign(null);
              setShowModal(false); 
          }
            setActivePagecampaignsid(data.currentPageNo);
            setTotalRowcampaignsid(data.totalRecords);
            settotalpagescampaignsid(data.totalpagescampaignsid);
            setLastPagecampaignsid(data.totalPages);
            
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

        const createSchedule = async () => {
          let userToken = localStorage.getItem("budgetOptimizer");
          let AuthToken = "Bearer " + userToken;
          let profileId = localStorage.getItem("BudgetProfileId");   
          
          try {
            const response = await fetch(
              "https://budget-api.getgrowth.agency/api/amazon/adSchedules/createSchedule",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: AuthToken,
                },
                body: JSON.stringify({
                  scheduleName: scheduleName,
                  profileId: profileId,
                  countryCode:"US",
                  timezone:"America/Los_Angeles"
                 
                }),
              }
            );
        
          const data = await response.json();
          setAddSchedulerModal(data.data);
          setAddSchedulerModal(false);
          toast.success(data.message || "Created Successfully!");
          fetchgetSchedules(activePage,perPage,props.condition);
          
        } catch (toast) {
          console.error("Error fetching data:", toast);
        }
      };

      const campaignsName = async (_id: string) => { 
        setscheduleId(_id)
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
        let profileId = localStorage.getItem("BudgetProfileId");   
        setcreatescheduleid(_id)
        
        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/adSchedules/getScheduleTimes/${_id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
              body: JSON.stringify({
                pageNo:1,
                perPage:50,
               
              }),
            }
          );
      
        const data = await response.json();
        setCampaignsName(data.data);
        setTitle(data.scheduleName) 
        setweekid(data.data[0]?._id || ''); 
        fetchgetSchedules(activePage,perPage,props.condition);

      } catch (toast) {
        console.error("Error fetching data:", toast);
      }
    };   
        
    const handleExport = async () => {
      // const dispatch = useDispatch();
      let userToken = localStorage.getItem("budgetOptimizer");
      let AuthToken = "Bearer " + userToken;
      let profileId = localStorage.getItem("BudgetProfileId");
      
      try {
        dispatch(handleLoader(true));
        
        const response = await fetch(
          `https://budget-api.getgrowth.agency/api/amazon/adSchedules/${profileId}/exportSheet`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: AuthToken,
            },
          }
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await response.json();
        if (!data.isSuccess) {
          throw new Error(data.message || "Export failed");
        }
        
        // Creating Excel file
        const workbook = xlsx.utils.book_new();
        
        const scheduleData = data.schedules.map(item => [
          item.scheduleName, item.dayName, item.startTime, item.endTime
        ]);
        const scheduleWorksheet = xlsx.utils.aoa_to_sheet([
          ['Schedule Name', 'Day', 'Start Time', 'End Time'], ...scheduleData
        ]);
        
        const campaignData = data.campaigns.map(item => [
          item.campaignId, item.campaignName, item.scheduleName
        ]);
        const campaignWorksheet = xlsx.utils.aoa_to_sheet([
          ['Campaign ID', 'Campaign Name', 'Schedule Name'], ...campaignData
        ]);
        
        xlsx.utils.book_append_sheet(workbook, scheduleWorksheet, 'Schedules');
        xlsx.utils.book_append_sheet(workbook, campaignWorksheet, 'Campaigns');
        
        const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'export-schedules.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.success("Export Schedule Download successfully!!");
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        dispatch(handleLoader(false));
      }
    };

   const deleterule = async (id: any) => {
          let userToken = localStorage.getItem("budgetOptimizer");
          let AuthToken = "Bearer " + userToken;
         
            try {
              const response = await fetch (
                `https://budget-api.getgrowth.agency/api/amazon/adSchedules/deleteSchedule/${id}`,
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
              fetchgetSchedules(activePage,perPage,props.condition);
            } catch (error) {
              setSpinner(false);
              console.error("Error fetching data:", error);
            }
  };

  const deleterulepopup = async (id: any) => {
    console.log(id,":weekid")
          let userToken = localStorage.getItem("budgetOptimizer");
          let AuthToken = "Bearer " + userToken;
         
            try {
              const response = await fetch (
                `https://budget-api.getgrowth.agency/api/amazon/adSchedules/deleteScheduleTime/${createscheduleid}/${id}`,
                {
                  method: 'DELETE', 
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: AuthToken,
                  },
              }
            );
            console.log(weekid,":dgbdgdgg")
              setSpinner(false);
              const data = await response.json();
              toast.success(data.message || "Deleted Successfully!");
              campaignsName(scheduleId);
            } catch (error) {
              setSpinner(false);
              console.error("Error fetching data:", error);
            }
  };
  
  const handlecampaignsAssign = async (_id: any,profileId: any) => {
        if(typeof(_id) === "string"){
        const selectedId = _id;
        const idToPass = Array.isArray(_id) ? _id.find((item) => item === selectedId) : _id;
        console.log(profileId, "idToPass");
        const userToken = localStorage.getItem("budgetOptimizer");
        const AuthToken = "Bearer " + userToken;
        try {
            const response = await fetch(`https://budget-api.getgrowth.agency/api/amazon/budgetRule/${profileId}/getCampaigns`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: AuthToken,
                },
                body: JSON.stringify({
                    search: searchCampaignpopup,
                    pageNo: ActivePageAssign,
                    perPage: PerPageAssign,
                }),
            });

            const data = await response.json();
            setcampaignsAssign(data.data);
            // setcampaignslist(data.data)
            setActiveAssign(data.activePage);
            setLastAssign(data.totalPages);
            setTotalRowAssign(data.totalRecords);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setSpinner(false); 
        }}
      }
      
      useEffect(() => {
        if (CampaignSchedules.length > 0) {
            const selectedCampaign = CampaignSchedules[0];
            if (selectedCampaign) {
                handlecampaignsAssign(selectedCampaign._id, selectedCampaign.profileId);
            }
        }
    }, [ActivePageAssign, PerPageAssign,searchCampaignpopup]); 

      const handleTabChange = (selectedKey: string | null) => {
        if (selectedKey === "assignSchedules" && CampaignSchedules.length > 0) {
            const selectedCampaign = CampaignSchedules[0]; 
            if (selectedCampaign) {
                handlecampaignsAssign(selectedCampaign._id, selectedCampaign.profileId);
            }
        }
        setActiveTab(selectedKey || ""); 
    };

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

    const handletimeformat = (time: string) => {
      const [hours, minutes] = time.split(":");
      const date = new Date();
      date.setHours(Number(hours), Number(minutes));
    
      return date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    const handlestartTimeChange = (e: any) => {
      setstartTimeData(e ? e.format('HH:mm') : ''); 
    };
    const handleEndTimeChange = (e: any) => {
      setEndTimeData(e ? e.format('HH:mm') : ''); 
    };

    const handleAddTime = async (createscheduleid: string | null) => {
      let userToken = localStorage.getItem("budgetOptimizer");
      let AuthToken = "Bearer " + userToken;
      let profileId = localStorage.getItem("BudgetProfileId")
        setSpinner(true);
        const dataToSend = {
          dayName: selectedDay,
          startTime: starttimeData,
          endTime: EndtimeData,
        };
        
        try {
          const response = await fetch (
            `https://budget-api.getgrowth.agency/api/amazon/adSchedules/createScheduleTime/${createscheduleid}`,
            {
              method: 'POST', 
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: AuthToken,
              },
              body: JSON.stringify(dataToSend),
          }
        );
          setSpinner(false);
          const data = await response.json();
          toast.success(data.message);
          campaignsName(scheduleId)
          setAddtime(false)
          fetchgetSchedules(activePage,perPage,props.condition);
          
        } catch (error) {
          setSpinner(false);
          console.error("Error fetching data:", error);
        }
      };

      const GetEditData = async (CampaignsName: any) => {
        if (!CampaignsName) return;
        setIsEditMode(true);
        setstartTimeData(CampaignsName.startTime || '');  
        setSelectedDay(CampaignsName.dayName || ''); 
        setEndTimeData(CampaignsName.endTime || ''); 
        setweekid(CampaignsName._id || '');
        setGetScheduleData(CampaignsName);
        setTimeout(() => setAddtime(true), 0);
    };
    

      const EditTime = async (createscheduleid) => {
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
        let profileId = localStorage.getItem("BudgetProfileId");
      
        setSpinner(true); 
        try {
          const response = await fetch(
            `https://budget-api.getgrowth.agency/api/amazon/adSchedules/updateScheduleTime/${createscheduleid}/${weekid}`,
            {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
              body: JSON.stringify({
                dayName: String(selectedDay),  
                startTime: String(starttimeData),  
                endTime: String(EndtimeData),  
              }),
            }
            
          );
          console.log(GetScheduleData,"update API")
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          setAddtime(false);
          toast.success(data.message || "Updated successfully!");
          campaignsName(scheduleId);
          fetchgetSchedules(activePage,perPage,props.condition);
        } catch (error) {
          console.error("Error fetching data:", error); 
        } finally {
          setSpinner(false); 
        }
      };
      const Activestatus = async (item: any, isActive: boolean) => {
        setisActive(item._id)
        console.log(item._id,"Active")
        let userToken = localStorage.getItem("budgetOptimizer");
        let AuthToken = "Bearer " + userToken;
        let profileId = localStorage.getItem("BudgetProfileId");
        setSpinner(true); 
        setCampaignSchedules(CampaignSchedules)
        const updatedStatus = !item.isActive;
          setisActive((prev) => ({ ...prev, [item.id]: updatedStatus }));
        
        try {
          const response = await fetch(
            ` https://budget-api.getgrowth.agency/api/amazon/adSchedules/changeScheduleStatus/${createscheduleid}/${item._id}`,
            {
              method: "POST", 
              headers: {
                "Content-Type": "application/json",
                Authorization: AuthToken,
              },
              body: JSON.stringify({
                isActive:updatedStatus
              }),
            }
          );
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const data = await response.json();
          toast.success(data.message || "Updated successfully!");
          fetchgetSchedules(activePage,perPage,props.condition);
          campaignsName(scheduleId);
          
        } catch (error) {
          console.error("Error fetching data:", error); 
          setisActive((prev) => ({ ...prev, [item.id]: item.isActive }));
        } finally {
          setSpinner(false); 
        }
      };

      const openAddTimeModal = () => {
        setAddtime(true);  
        setIsEditMode(false); 
        setstartTimeData('');
        setSelectedDay('');
        setEndTimeData('');
        setweekid('');
        setGetScheduleData(null);
    };


    const Assigncampaigns = async (_id) => {
      setscheduleId(_id)
            const userToken = localStorage.getItem("budgetOptimizer");
            const profileId = localStorage.getItem("BudgetProfileId");
            const AuthToken = "Bearer " + userToken;
            const campaignIds = allIds
            const Assigncampaigns = {
              campaignIds,
            };
            try {
                const response = await fetch(` https://budget-api.getgrowth.agency/api/amazon/adSchedules/updateSchedule/${_id}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: AuthToken,
                    },
                    body: JSON.stringify(Assigncampaigns),
                });
        
                if (!response.ok) {
                    toast.error(`HTTP error! Status: ${response.status}`);
                    return;
                }
        
                const data = await response.json();
                toast.success(data.message || "Created Successfully!");
                setCampaignsName(null);
                fetchgetSchedules(activePage,perPage,props.condition);
            } catch (error) {
                console.error("Error sending data to API:", error);
                toast.error("Failed to send data to the server.");
            }
        };


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
          const filteredArray = allIds.filter((item: string) => !ids.includes(item));
    
          setAllIds(filteredArray);
        };
    
        reader.readAsBinaryString(file);
      } else {
        alert("Please upload a valid Excel file (.xlsx)");
      }
    };
    
    const getIdsFromArray = (arr: any[]) => arr.slice(1).map((item) => item[0]);

  return (
    
    <div>
      <div className="col">
        <div>
          <Row className="mt-2 mb-2">
            <Col style={{justifyContent:"flex-end",display:"flex" }}> 
            <div className="campaigns">
            <button
              className="handleAddToTemplateClick"
              onClick={() => {
                // setAddFlag(true);
                // setEditId("");
                setAddSchedulerModal(true);
              }}
            >
              Create Schedule
            </button>
            <button
              className="Top-button"
              onClick={() => handleExport()}
            >
              Export Schedules
            </button>
            </div>
            </Col>
            </Row>
            </div>
            
    <div className='Budget-table' style={{ height: 500, width: "100%" }}>
            <table className= "full-table" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse'}}>
                <thead className='table-heaad'>
                    <tr>
                        <th 
                        onMouseEnter={() => setHoveredColumn('scheduleName')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('scheduleName')}>Schedule Name
                        {hoveredColumn === 'scheduleName' || sortConfig.key === 'scheduleName' ? (
                            sortConfig.key === 'scheduleName' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        {/* <th onClick={() => handleSort('campaignIds')}># of Campaigns
                        {sortConfig.key === 'campaignIds' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                        </th> */}
                        <th ># of Campaigns</th>
                        {/* <th onClick={() => handleSort('campaignIds')}># of Campaigns
                        {sortConfig.key === 'campaignIds' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                        </th> */}
                        <th 
                        onMouseEnter={() => setHoveredColumn('updatedAt')}
                        onMouseLeave={() => setHoveredColumn(null)}
                        onClick={() => handleSort('updatedAt')}>Updated At
                         {hoveredColumn === 'updatedAt' || sortConfig.key === 'updatedAt' ? (
                            sortConfig.key === 'updatedAt' ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ↑'
                        ) : ''}
                        </th>
                        <th></th>                     
                    </tr>
                </thead>
                <tbody className='tbody-td'>
                  {spinner ? (
                      <td colSpan={8} style={{ textAlign: 'center', height: '450px', verticalAlign: 'middle' }}>
                        <div className="loading-container">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </Spinner>
                        </div>
                      </td>
                    ) :
                    Array.isArray(CampaignSchedules) && CampaignSchedules.map((CampaignSchedules,index) => (
                        <tr className='tbody-tr:hover' key={index}> 
                             
                            <td onClick={() => campaignsName(CampaignSchedules._id)}>{CampaignSchedules.scheduleName}</td>
                          
                            <td style={{ color: Array.isArray(CampaignSchedules.campaignIds) && CampaignSchedules.campaignIds.length > 0 ? 'blue' : 'black' }}
                              onClick={() => { handlecampaignsid(CampaignSchedules._id)}}
                              >
                            {Array.isArray(CampaignSchedules.campaignIds) ? CampaignSchedules.campaignIds.length : "-"}
                          </td>
                          
                          <td>
                            {CampaignSchedules.updatedAt ? (
                              (() => {
                                const timeZoneCountry = "America/Los_Angeles"; 
                                const combinedDateTime = CampaignSchedules.updatedAt; 
                                const formattedDateTime = moment
                                  .utc(combinedDateTime) 
                                  .tz(timeZoneCountry) 
                                  .format("MM/DD/YYYY hh:mm:ss A z");
                                return formattedDateTime;
                              })()
                            ) : (
                              "-"
                            )}
                          </td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                           {/* <span
                              onClick={() => toggleOptions(CampaignSchedules._id)} 
                              className="threedot"
                              style={{ cursor: 'pointer' }}
                            >
                              <BsThreeDotsVertical className="threedot" />
                            </span>
      
                            
                            {showOptions === String(CampaignSchedules._id) && ( 
                              <div className="options">
                                <button onClick={() => handleEdit(CampaignSchedules)} className="edit-button">Edit</button>
                                <button onClick={() => handleDelete(CampaignSchedules)} className="red-button">Delete</button>
                              </div>
                            )} */}

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
                      aria-labelledby={"dropdownMenuButton" + ""}
                    >
                      {/* <li>
                        <Link
                          to={
                            ""
                          }
                        >
                        
                          <p className="dropdown-item">Assign</p>
                        </Link>
                      </li> */}
                      <li>
                        <Link
                          to={""}
                        >
                          <p className="dropdown-item" onClick={() => handleEditData(CampaignSchedules)}>Edit </p>
                        </Link>
                      </li>
                      <li>
                      <Popconfirm
                          title="Delete"
                          description={`Are you sure you want to delete the Schedules "${CampaignSchedules.scheduleName}"?`}
                          onConfirm={() => deleterule(CampaignSchedules._id)} 
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
                    ) , (
                      <tr>
                        <td  style={{ textAlign: "center" }}>
                        No rows
                        </td>
                      </tr>
                    ))}
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
              {AddSchedulerModal && (
                <Modal
                  show={AddSchedulerModal}
                  onHide={() => setAddSchedulerModal(false)}
                  size="lg"
                  aria-labelledby="example-modal-sizes-title-lg"
                >
                  <div className="schedulename-modal-contentpopup">
                    <Modal.Header closeButton
                    onHide={()=>{setId("");setscheduleName("")}}>
                      <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
                        {ids ? "Edit Schedule" : "Create Schedule"}
                      </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                      <Row>
                        <div>
                          Schedule Name
                          <input
                            type="text"
                            className="text_schedulename"
                            placeholder="Enter Schedule Name"
                            value={scheduleName}
                            onChange={(e) => setscheduleName(e.target.value)}
                          />
                        </div>
                      </Row>
                    </Modal.Body>

                    <Modal.Footer className="d-flex justify-content-center">
                    <button
                      className="Top-button"
                      style={{ width: "200px" }}
                      onClick={() => setAddSchedulerModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="handleAddToTemplateClick"
                      style={{ width: "200px" }}
                      onClick={() => {
                        if (ids) {
                          handlScheduleEdit();
                        } else {
                          createSchedule();
                        }
                      }}
                    >
                      {ids ? "Update" : "Create" }
                    </button>
                  </Modal.Footer>
                </div>
              </Modal>
              )}
            </>
            <>
            {CampaignsName && (
               <Modal 
               show={true} 
               onHide={() => setCampaignsName(null)}
               size="lg"
               aria-labelledby="example-modal-sizes-title-lg"
               >
               
               <Modal.Header closeButton>
                 <div className="d-flex w-100 justify-content-between align-items-center">
                   <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
                     {Title}
                   </Modal.Title>
                 </div>
               </Modal.Header>
               <Modal.Body>
                 <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
                   <Nav variant="tabs">
                   <div className="d-flex w-100 justify-content-between align-items-center">
                   <div className="d-flex" style={{ justifyContent: "flex-start" }}>
                     <Nav.Item>
                       <Nav.Link eventKey="campaignSchedules">Schedules</Nav.Link>
                     </Nav.Item>
                     <Nav.Item>
                       <Nav.Link eventKey="assignSchedules">Campaigns</Nav.Link>
                     </Nav.Item>
                     </div>
                     <div style={{ justifyContent: "flex-end" }}>
                      {activeTab === "campaignSchedules" && (
                      <button className="Top-button" onClick={openAddTimeModal}>Add Time</button>
                      )}
                   </div>
                   </div>
                   </Nav>
                   <Tab.Content>
                     <Tab.Pane eventKey="campaignSchedules">
                       <Row>
                         <table>
                         <thead className="table-heaad">
                             <tr>
                               <th>Active</th>
                               <th>Day of Week</th>
                               <th>Start Time</th>
                               <th>End Time</th>
                               <th></th>
                             </tr>
                           </thead>
                           <tbody className="campaignsScheduletbody-td td">
                             {Array.isArray(CampaignsName) &&
                               CampaignsName.map((item, index) => (
                                 <tr key={index} className="campaignsScheduletbody-td tr:hover">
                                   <td>
                                     <label className="switch">
                                       <input 
                                          type="checkbox" 
                                          style={{ margin: "3px", padding: 0, verticalAlign: "middle" }}
                                          checked={isActive[item._id] ?? item.isActive } 
                                          onChange={(e) => {
                                            Activestatus(item, e.target.checked);
                                          }}
                                       />
                                       <span className="slider"></span>
                                     </label>
                                   </td>
                                   <td>{item.dayName}</td>
                                   <td>{handletimeformat(item.startTime)}</td>
                                    <td>{handletimeformat(item.endTime)}</td>
                                   <td>
                                     <div className="col-action-container text-right">
                                       <div id={`dropdownMenuButton${index}`} data-bs-toggle="dropdown" aria-expanded="false">
                                         <img src={ActionDot} alt="actions" />
                                       </div>
                                       <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${index}`}>
                                         {/* <li>
                                           <p className="dropdown-item">Assign</p>
                                         </li> */}
                                         <li>
                                           <p className="dropdown-item" onClick={() => GetEditData(item)}>Edit</p>
                                         </li>
                                         <Popconfirm
                                              title="Delete"
                                              description={`Are you sure you want to delete the Schedules 
                                                "${item.dayName}""${item.startTime}""${item.endTime}"?`}
                                              onConfirm={() => deleterulepopup(item._id)} 
                                              okText="Yes"  
                                              cancelText="No"
                                            >
                                              <p className="dropdown-item text-red" style={{ cursor: "pointer" }}>
                                                Delete
                                              </p>
                                          </Popconfirm>
                                       </ul>
                                     </div>
                                   </td>
                                 </tr>
                               ))}
                           </tbody>
                         </table>
                       </Row>
                     </Tab.Pane>
        
                     <Tab.Pane eventKey="assignSchedules"> 
                       <div style={{ margin: "13px" }}>
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
                        <p className="text-end filer_text">File: Excel file selected</p>
                      </div>
                    )}
                    <div className="row col-12 m-auto mb-2 checkbox-popup">
                      <div className="col">
                        <input type="checkbox" className="me-2" 
                          checked={selectAllCheckpopup}
                          onChange={(e) => selectAllHandler(e)}
                          />
                        <label>
                          <b>All Select</b>
                        </label>
                      </div>
                      <div className="col d-flex align-items-center justify-content-end">
                        <label className="me-2">
                          <b>Selected</b>
                        </label>
                        <p className="m-0">{allIds.length}</p>
                      </div>
                    </div>
                       </div>
                       <div className="row budgetpopup-data">
                       {spinner ? (
                         <p>Loading...</p>
                       ) : Array.isArray(campaignsAssign) && campaignsAssign.length > 0 ? (
                        campaignsAssign.map((item, index) => (
                           <div key={index} className="col-md-6">
                             <div className="col-1 pb-2 p-0" style={{ cursor: "pointer" }}>
                               <input 
                               type="checkbox" 
                               id={`checkbox-${index}`} 
                               className="input_rule-checkbox" 
                               checked={allIds.includes(item.campaignId)}
                               onChange={(e) => handleAssigncampaignHandler(e, item, item.campaignId)} 
                               />
                             </div>
                             <div className="pb-2 p-0">
                               <label htmlFor={`checkbox-${index}`} style={{ marginLeft: "20px", cursor: "pointer" }}>
                                 {item.name}
                               </label>
                             </div>
                           </div>
                         ))
                       ) : (
                         <p>No data available</p>
                       )}
                      </div>
                       {/* Pagination */}
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
                     </Tab.Pane>
                   </Tab.Content>
                 </Tab.Container>
               </Modal.Body>
         
               <Modal.Footer className="d-flex justify-content-center">
                
                 {activeTab === "assignSchedules" && (
                  <button className="Top-button"  style={{ width: "200px" }} onClick={() => setCampaignsName(null)}>
                    Cancel
                  </button>
                    )}
                 {activeTab === "assignSchedules" && (
                    <button className="handleAddToTemplateClick" style={{ width: "200px" }} onClick={() => Assigncampaigns(scheduleId)} >Apply</button>
                  )}
                 
               </Modal.Footer>
             </Modal>
            )}
          </>
          <>
          {showModal && assign && (
                <Modal show={showModal}  onHide={() => setShowModal(false)} size="lg" aria-labelledby="example-modal-sizes-title-lg">
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
            {/* ADD TIME POPUP */}
            <>
            {Addtime && (
               <Modal 
               show={true} 
               onHide={() => setAddtime(false)}
               size="lg"
               aria-labelledby="example-modal-sizes-title-lg"
               >
                <div style={{margin:"10px 0px"}}>
                <Modal.Header closeButton>
                 <div className="d-flex w-100 justify-content-between align-items-center">
                   <Modal.Title id="example-modal-sizes-title-lg" style={{ fontSize: "17px" }}>
                    {isEditMode ? "Edit Time" : "Add Time"}
                   </Modal.Title>
                 </div>
               </Modal.Header>
               <Modal.Body  style={{ maxWidth: "none", overflow: "hidden" }}>
               <div>

               <Col md={3} className="mb-12" style={{ width:"500px", marginLeft:"30px" }}>
                <label htmlFor="daySelect" style={{ fontWeight: "bold" }}>Day Of Week</label>
                <select
                    className="form-control custom-dropdown"
                    id="daySelect"
                    value={selectedDay} 
                    style={{ marginTop: "10px" }}
                    onChange={(e) => setSelectedDay(e.target.value)}
                >
                    {daysOfWeek.map((day) => (
                        <option key={day} value={day}>
                            {day}
                        </option>
                    ))}
                </select>
            </Col>

                <Col md={12} className="mb-12" style={{ margin: "15px 30px" }}>
                    <label htmlFor="timezone" style={{ fontWeight: "bold" }}>Start Time</label>
                    <div className="row time">
                    <div
                        className="d-flex align-items-center col-md-2 mb-2"
                        style={{ marginRight: "10px", width: "525px" }}
                      >
                    <TimePicker
                        className="campaignsSchedulesform_rule"
                        placeholder="Value"
                        onChange={handlestartTimeChange}
                        value={starttimeData ? dayjs(starttimeData, "HH:mm") : null}
                        format="hh:mm A"
                        clearIcon={null}
                        id="startTime"
                        name="startTime"
                    />
                    </div>
                  </div>
                </Col>

                  <Col md={12} className="mb-12" style={{ margin: "15px 30px" }}>
                    <label htmlFor="timezone" style={{ fontWeight: "bold" }}>
                      End Time
                    </label>
                    <div className="row time">
                      <div
                        className="d-flex align-items-center col-md-2 mb-2"
                        style={{ marginRight: "10px", width: "525px" }}
                      >
                        <TimePicker
                          className="campaignsSchedulesform_rule"
                          placeholder="Value"
                          onChange={handleEndTimeChange}
                          value={EndtimeData && typeof EndtimeData === "string" ? dayjs(EndtimeData, "HH:mm") : null}
                          format="hh:mm A"
                          clearIcon={null}
                          id="endTime"
                          name="endTime"
                        />
                      </div>
                    </div>
                  </Col>
                </div>
               </Modal.Body>
               <Modal.Footer className="d-flex justify-content-center">
                <button className="Top-button"  style={{ width: "200px" }} onClick={() => setAddtime(false)}>
                  Cancel
                </button>
                <button className="handleAddToTemplateClick" style={{ width: "200px" }}
                 onClick={() =>
                  isEditMode ? EditTime(createscheduleid) : handleAddTime(createscheduleid)
                }
                >
                   {isEditMode ? "Update" : "Apply"}
                </button>
              </Modal.Footer>
              </div>
               </Modal>
            )}
            </>

          </div>
        </div>
        </div>
        
  );
};

export default CampaignSchedules;
