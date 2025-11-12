import React, { Component, useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import client from "../../../Graphql/apolloClient";
import { ASSIGN_CREATIVES_ITEM_QUERY } from "../../../Graphql/Queries";
import './index.css';
import Image1 from "../../../assets/images/search.svg";
import { toast } from "react-toastify";
import { format } from 'date-fns';

interface AssignCreativeList {
  campaignName: string;
  endDate: any;
  startDate: any;
  dealId: any;
  searchTerm: string;
  inventoryPrice: any;
  inventoryReports: any;
  inventoryType: string;
  id: string;
  inventoryName: string;
  inventoryThumbnailUrl: string;
  inventoryDetails: {
    resolution1Width: number;
    resolution1Height: number;
  };
}
interface AssignCreativeSummaryProps {
  setSearchs: (searchTerm: string) => void;
  campaignId: string;
}
const Assign_creative_summary: React.FC<AssignCreativeSummaryProps> = ({ setSearchs, campaignId }) => {
  const [searchInput, setSearchInput] = useState("");
  const [assignCreativeList, setAssignCreativeList] = useState<AssignCreativeList[]>([]);
  const [search, setSearch] = useState<string>("");
  const fetchContentHubList = async () => {
    const token = localStorage.getItem("authToken");
    // const id = localStorage.getItem("selectedCampaignId");
    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    const variables = {
      accessToken: token,
      id: campaignId,
      searchTerm: search,
      page: "0",
    };

    try {
      const { data } = await client.query({
        query: ASSIGN_CREATIVES_ITEM_QUERY,
        variables
      });
      setAssignCreativeList(data.assignCreativesItem);

    } catch (err) {
      console.error("Fetch Content Error:", err);
      toast.error("An unexpected error occurred while fetching content");
    }
  };

  useEffect(() => {
    fetchContentHubList();
  }, [search]);
  const handleSearchChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // const newSearchValue = event.target.value; // Get the new value from the input
    // setSearchInput(newSearchValue);  // Update local search input state (optional)
    // setSearchs(newSearchValue);  
    if (event.key === 'Enter') {
      event.preventDefault();
      setSearchInput(event.currentTarget.value);
      setSearchs(event.currentTarget.value);
    }    // Update the parent component's search state
  };
  const inputRef = useRef<HTMLInputElement>(null);
  const handleRotate = () => {
    setSearchs('');
    setSearchInput('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }
  return (
    <>
      <div className="assign-creative">
        <h4 className="assign_creative_header">Assign creative</h4>
        <div className="row mt-4">
          {(() => {
            const uniqueReports = new Set();
            return assignCreativeList
              .filter((content) => {
                if (uniqueReports.has(content.dealId)) {
                  return false;
                }
                uniqueReports.add(content.dealId);
                return true;
              })
              .map((content) => {
                const startDate = new Date(content.startDate.date);
                const endDate = new Date(content.endDate.date);
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                  return null;
                }

                const adjustedStartDate = startDate;
                const adjustedEndDate = endDate;

                const formattedStartDateForDisplay = format(adjustedStartDate, 'dd MMM yyyy');
                const formattedEndDateForDisplay = format(adjustedEndDate, 'dd MMM yyyy');

                return (
                  <React.Fragment key={content.dealId}>
                    <div className="col-md-2">
                      <p className="assign_row_data_head">Campaign name</p>
                      <p className="assign_row_data_head_data">{content.campaignName}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="assign_row_data_head">Deal ID</p>
                      <p className="assign_row_data_head_data">{content.dealId}</p>
                    </div>
                    <div className="col-md-3">
                      <p className="assign_row_data_head">Duration</p>
                      <p className="assign_row_data_head_data">{formattedStartDateForDisplay} - {formattedEndDateForDisplay}</p>
                    </div>
                  </React.Fragment>
                );
              });
          })()}

          <div className="col-md-4">
            <div className="input-group assign_creative_input_group">
              <span className="input-group-text search-icon assign_creative_search_icon">
                <img src={Image1} alt="" />
              </span>
              <input
                type="text"
                className="form-control border-bottom-only assign_creative_border_bottom_only"
                placeholder="Search billboard"
                aria-label="Search"
                ref={inputRef}
                onKeyDown={handleSearchChange}
              />
              <span>
                <i onClick={handleRotate} className="fa-solid fa-rotate"></i>
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <hr className="my-4 assign_border" />
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default Assign_creative_summary;
