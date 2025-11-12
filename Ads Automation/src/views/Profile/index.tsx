import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { Col, Row } from "react-bootstrap";
import axios from "axios";

import { toast } from "react-toastify";

interface Profile {
    countryCode: string;
    isActive: boolean;
    profileId: string;
    profileName: string;
    timezone: string;
  }

const Profile: React.FunctionComponent = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedprofiles, setSelectedProfiles] = useState<Profile[]>([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    let userToken = localStorage.getItem("userToken");
    let AuthToken = "Bearer " + userToken;
    axios
      .get("https://adsexpert-api.getgrowth.agency/Users/Profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthToken,
        },
      })
      .then((res) => {
        setProfiles(res.data.result.awsProfilesPreferences);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let value = "";
  const handleKeyDown = (e) => {
    value = e.target.value;
    console.log(value);
    
    if (e.key === "Enter") {
      setSearchValue(e.target.value);
      e.preventDefault();
    }
  };

  const search = () => {
    setSearchValue(value);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const searchString = searchValue.toLowerCase();
    return (
      profile.profileName.toLowerCase().includes(searchString) ||
      profile.profileId.toString().includes(searchString)
    );
  });

  const Save = () => {
    let userToken = localStorage.getItem("userToken");
    const requestdata = {
      profiles: profiles,
    };
    console.log(requestdata);
    if (selectedprofiles.length > 0) {
      axios
        .post(
          "https://adsexpert-api.getgrowth.agency/BackgroundServices/Ads/profiles",
          requestdata,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
            if(res.data.success === true){
                if(res.data.message === "Sync Queued successfully"){
                 toast("Profile sync successfully")
                 window.location.reload()
                }
                else{
                 toast("Something went wrong")
                }
           }
           else{
             toast("Profile sync failed")
           }
        })
        .catch((error) => {
          toast("Something went wrong");
        });
    } else {
      toast("Select or deselect any profile checkbox");
    }
  };

  const handleCheckboxChange = (profile, e) => {
    const updatedProfiles = profiles.map((p) =>
      p.profileId === profile.profileId
        ? { ...p, isActive: e.target.checked }
        : p
    );
    setProfiles(updatedProfiles);
    setSelectedProfiles(updatedProfiles)
  };

  return (
    <DashboardLayout>
      <Row className="ms-2 me-3">
        <div className="action-row d-flex justify-content-between mt-4 ">
          <div className="back-arrow-container d-flex align-items-center  ">
            <span className="title">Profile</span>
          </div>
        </div>

        <div className="profile-container mt-4">
          <div className="d-flex align-items-center justify-content-center">
            <form className="me-3 w-25">
              <div className="search-filter-container ">
                <i className="fa fa-search"></i>
                <input
                  type="text"
                  style={{ height: "40px" }}
                  placeholder="Search"
                  id="globalSearch"
                  name="globalSearch"
                  onKeyDown={handleKeyDown}
                />
              </div>
            </form>

            {/* <button
              className="btn btn-primary add-rules-btn pt-2 remove-button"
              style={{ height: "40px " }}
              onClick={search}
            >
              Search
            </button> */}
            <button
              className="btn btn-primary add-rules-btn pt-2 remove-button"
              style={{ height: "40px " }}
              onClick={Save}
            >
              Save
            </button>
          </div>
          <div className="profile-box my-4">
            {filteredProfiles.length !== 0 ? (
              <Row>
                <Col
                  className="d-flex  justify-content-center flex-wrap"
                >
                  <div className="profile-content">
                    {filteredProfiles
                      .filter((_, index) => index % 2 === 0)
                      .map((profile, index) => (
                        <div key={index} className="d-flex mb-2">
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            checked={profile.isActive}
                            onChange={(e) => handleCheckboxChange(profile, e)}
                          />
                          <div>{`${profile.profileName} | ${profile.countryCode} - ${profile.profileId}`}</div>
                        </div>
                      ))}
                  </div>
                  <div className="profile-content">
                    {filteredProfiles
                      .filter((_, index) => index % 2 !== 0)
                      .map((profile, index) => (
                        <div key={index} className="d-flex mb-2">
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            checked={profile.isActive}
                            onChange={(e) => handleCheckboxChange(profile, e)}
                          />
                         <div>{`${profile.profileName} | ${profile.countryCode} - ${profile.profileId}`}</div>
                        </div>
                      ))}
                  </div>
                </Col>
                {/* <Col
                  sm={12}
                  md={6}
                  className="d-flex align-items-center justify-content-center"
                >
                  <div className="profile-content">
                    {filteredProfiles
                      .filter((_, index) => index % 2 !== 0)
                      .map((profile, index) => (
                        <div key={index} className="d-flex mb-2">
                          <input
                            className="form-check-input me-3"
                            type="checkbox"
                            checked={profile.isActive}
                            onChange={(e) => handleCheckboxChange(profile, e)}
                          />
                          <div>{`${profile.profileName} - ${profile.profileId}`}</div>
                        </div>
                      ))}
                  </div>
                </Col> */}
              </Row>
            ) : (
              <Row className="">
                <h5
                  className="text-center align-content-center"
                  style={{ height: "400px" }}
                >
                  No Profiles
                </h5>
              </Row>
            )}
          </div>
        </div>
      </Row>
    </DashboardLayout>
  );
};

export default Profile;
