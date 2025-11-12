import React from "react";
import { useEffect, useState } from "react";
import { ApisendGoogleCode } from '../../../api-wrapper/auth-wrapper/ApiAuth';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { handleLoader } from "../../../store/Action/loader";
import { listingProfiles, mainAccountsList, changeStatus, searchProfileIds, DashboardProfileIds } from '../../../store/Action/amazonAction';

const Dashboard = () => {
  let navigate = useNavigate()
  const [managerList, setManagerList] = useState(false);
  const [managerData, setManagerData] = useState();
  const [profileData, setProfileData] = useState([]);
  const [search, setSearch] = useState(false)
  const [searchValue, setSearchValue] = useState()
  const [searchData, setSearchData] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    DashboardProfile()
  }, []);


  const DashboardProfile = async () => {
    dispatch(handleLoader(true));

    try {
      const res = await dispatch(DashboardProfileIds());
      const updatedProfileData = res?.data?.data.map(item => ({ ...item, checked: item.isDashboard }));
      setProfileData(updatedProfileData)
      dispatch(handleLoader(false));
    } catch (e) {
      dispatch(handleLoader(false));
    }
  };

  const handleSearch = (event) => {
    if (event.target.value === "") {
      setSearch(false)
    }

    setSearchValue(event.target.value)
  }


  const searchProfile = async () => {
    dispatch(handleLoader(true));


    const data = {
      search: searchValue
    };
    try {
      setSearch(true)
      const res = await dispatch(DashboardProfileIds(data))

      if (res.status === 200) {

        dispatch(handleLoader(false));

        const updatedProfileData = res?.data?.data.map(item => ({ ...item, checked: item.isDashboard }));
        setSearchData(updatedProfileData)

      } else {

        dispatch(handleLoader(false));
        setSearch(false)

      }
    } catch (e) {
      dispatch(handleLoader(false));
      setSearch(false)


    }
  }

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const code = queryParameters.get("code");

    if (code) {
      let data = {
        code: code
      }
      ApisendGoogleCode(data)
        .then((res) => {
          navigate('/settings')
        }).catch((err) => {

        });
    }
  }, []);

  return (
    <div className="container-fluid flex-col p-2 p-lg-5">
      <div className="dashboardHeader">
        <h3>Dashboard</h3>
        <div className="row justify-content-center align-items-center ">
          <div className='row mt-2 d-flex flex-wrap gap-2 px-0'>
            {profileData?.length > 0 && (
              <><div className='col-5'>
                <input type="text" className='account_search w-100 h-100 p-2' onChange={handleSearch} placeholder='Search account..' />
              </div><div className='col-3'>
                  <button className='blue_btn' onClick={() => searchProfile()}>Search</button>
                </div></>
            )}

          </div>
          <div className="pt-3">
            {!search ? (
              profileData?.length > 0 &&
              profileData?.map((item, index) => (

                <div
                  key={index}
                  className="pb-3"
                  style={{ cursor: "pointer" }}
                  onClick={() => {

                    navigate('/settings', { state: { someProp: 'campaign', campaigProp: true, selectedcampagin: item, campaignFlags: true, loader: false } });
                  }}
                >
                  <label
                    className="listRow"
                    style={{ cursor: "pointer" }}
                  >

                    <h6
                      className="p-0 mx-2 my-0"
                      style={{ color: "#2E8BC0" }}
                    >
                      {item.name} - {item.type} - {item.countryCode} -{" "}
                      {item.profileId}
                    </h6>
                  </label>
                </div>
              ))
            ) : searchData.length > 0 && (
              searchData?.map((item, index) => (

                <div
                  key={index}
                  className="p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate('/settings', { state: { someProp: 'campaign', campaigProp: true, selectedcampagin: item, campaignFlags: true, loader: false } });
                    const updatedProfileData = [...profileData];
                    updatedProfileData[index].checked = !updatedProfileData[index].checked;
                    setProfileData(updatedProfileData);
                  }}
                >
                  <label
                    className="listRow"
                    style={{ cursor: "pointer" }}
                  >
                    {/* <input
                      type="checkbox"
                      // Check if item is in selectedCampagin
                      checked={item.checked}
                    /> */}
                    <h6
                      className="p-0 mx-2 my-0"
                      style={{ color: "#2E8BC0" }}
                    >
                      {item.name} - {item.type} - {item.countryCode} -{" "}
                      {item.profileId}
                    </h6>
                  </label>
                </div>
              ))
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
