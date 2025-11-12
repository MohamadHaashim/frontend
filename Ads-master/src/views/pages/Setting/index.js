import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import {
  amazonGetData,
  amazonConnect,
  listingProfiles,
  mainAccountsList,
  checkConnectAccount,
  unlinkConnectAccount,
} from "../../../store/Action/amazonAction";
import { userProfileData } from "../../../store/Action/authActions";
import { useNavigate, useLocation } from "react-router-dom";
import Campaign from "./campaign/Campaign";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { handleLoader } from "../../../store/Action/loader";
import BudgetRule from "./budgetRule/BudgetRule";
import Reports from "./reports/Reports";
import timezone from "../../../helper/timezone";
import Title from "../../layout/Title/title";
import CampaignTiming from "./campaignTiming/CampaignTiming";
import RulesTiming from "./rulesTiming/rulesTiming";
import Schedular from "./campaignSchedular/Schedular";
import RuleSchedular from "./ruleSchedular/RuleSchedular";
import ReportHistory from "./reportHistory/ReportHistory";
import RuleHistory from "./ruleHistory/RuleHistory";
import CampaignHistory from "./campaignHistory/CampaignHistory";
import {
  ApiGoogleLogin,
  ApicheckGoogleLogin,
  ApiUnLinkGoogle,
} from "../../../api-wrapper/auth-wrapper/ApiAuth";
import AllAccount from './allAccount/AllAccount';
const Setting = () => {
  const location = useLocation();
  const { someProp, campaigProp, selectedcampagin, campaignFlags, loader } = location.state || {};
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [connected, setConnected] = useState(false);
  const [btnUrl, setBtnUrl] = useState();
  const [loaderValue, setLoaderValue] = useState(loader)

  const [switchTab, setSwitchTab] = useState(someProp ? someProp : "personal");
  const [profileData, setProfileData] = useState([]);
  const [managerData, setManagerData] = useState();
  const [managerList, setManagerList] = useState(false);
  const [userDetails, setUserDetails] = useState();
  const [viewCampaign, setViewCampaign] = useState(campaigProp ? campaigProp : false);
  const [selectedCampagin, setSelectedCampagin] = useState(selectedcampagin ? selectedcampagin : "");
  const [campaignFlag, setcampaignFlag] = useState(campaignFlags ? campaignFlags : false);

  const [timeZoneCountry, setTimeZoneCountry] = useState();

  const queryParameters = new URLSearchParams(window.location.search);
  const code = queryParameters.get("code");
  const userProfile = useSelector((state) => state.auth.userProfile);
  const connectionStatus = useSelector((state) => state.data.amazonConnected);

  const handleConnect = async () => {
    dispatch(handleLoader(true));
    try {
      const res = await dispatch(checkConnectAccount());
      dispatch(handleLoader(false));
      if (res.data.connect) {
        setConnected(true);
      }
    } catch (e) {
      dispatch(handleLoader(false));
    }
  };

  useEffect(() => {

    handleConnect();
    setLoaderValue(loader)


  }, []);

  useEffect(() => {
    if (connectionStatus?.connect) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [connectionStatus]);

  useEffect(() => {
    setUserDetails(userProfile?.profile);
  }, [userProfile]);

  const getUserDetails = async () => {
    try {
      await dispatch(userProfileData());
    } catch (e) {
      console.log("err::", e);
    }
  };
  useEffect(() => {

    getUserDetails();

  }, []);

  const navigate = useNavigate();

  const getData = async () => {
    try {
      const res = await dispatch(amazonGetData());

      if (res?.data?.auth_grant_url) {
        const link = `${res?.data?.auth_grant_url}?scope=${res?.data?.scope}&response_type=code&client_id=${res?.data?.client_id}&state=State&redirect_uri=${res?.data?.redirect_uri}`;
        setBtnUrl(link);
        setIsVisible(true);
      }
    } catch (e) {
      setIsVisible(false);
    }
  };

  useEffect(() => {

    getData();

  }, []);

  const connectAmazon = async () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const code = queryParameters.get("code");
    if (code) {
      const data = {
        code: code,
      };
      try {
        dispatch(handleLoader(true));
        const res = await dispatch(amazonConnect(data));
        if (res?.data?.data?.adsAccessToken) {
          dispatch(handleLoader(false));

          navigate("/settings");
          setConnected(true);
        }
      } catch (e) {
        dispatch(handleLoader(false));
      }
    } else {
      navigate("/settings");
    }
  };


  useEffect(() => {

    connectAmazon();

  }, [code]);

  const handleCampaign = async (id) => {
    navigate("/campaigns");
  };

  const handleUnlink = async () => {
    try {
      const res = await dispatch(unlinkConnectAccount());
      dispatch(handleLoader(false));
      if (res.data.connect === false) {
        setConnected(false);
      }
    } catch (e) {
      dispatch(handleLoader(false));
    }
  };
  const handleTabChange = (tab) => {

    if (tab === "connect") {
      // handleAccountTab();
      setcampaignFlag(false);
      setLoaderValue(true)
    } else if (tab == "campaign") {
      setcampaignFlag(true);
      setLoaderValue(true)


    } else if (tab === "personal") {
      setViewCampaign(false);
      setcampaignFlag(false);
      setLoaderValue(true)

    } else {
      setcampaignFlag(false);
      setLoaderValue(true)

    }
    setSwitchTab(tab);
  };
  useEffect(() => {
    if (selectedCampagin) {
      setTimeZoneCountry(
        timezone.find((x) => x.countryCode == selectedCampagin.countryCode)
          .timezone
      );
    }
  }, [selectedCampagin]);

  // google login  //
  const [googleFlag, setGoogleFlag] = useState(false);

  const googleHandler = () => {
    if (!googleFlag) {
      ApiGoogleLogin()
        .then((res) => {
          if (res.isSuccess) {
            if (res.authUrl) {
              window.location = res.authUrl;
            }

            checkGoogleLogin();
          }
        })
        .catch((err) => { });
    } else {
      ApiUnLinkGoogle()
        .then((result) => {
          checkGoogleLogin();
        })
        .catch((err) => { });
    }
  };



  const checkGoogleLogin = () => {
    ApicheckGoogleLogin()
      .then((res) => {
        setGoogleFlag(res.connect);
      })
      .catch((err) => { });
  };

  return (
    <div className="main-container">
      <>
        <Title name={"Settings"} />

        <div className="tab_container">
          <Tabs
            defaultActiveKey={switchTab}
            id="controlled-tab-example"
            // className="mb-3"
            activeKey={switchTab}
            onSelect={(tab) => handleTabChange(tab)}
          >
            <Tab className="tab_bg" eventKey="personal" title="Personal">
              <div className="row table-responsive p-0 m-0">
                <Table striped bordered hover className="m-0">
                  <tbody>
                    <tr>
                      <td className="col-12 col-lg-6">Name :</td>
                      <td>{userDetails?.fullName}</td>
                    </tr>
                    <tr>
                      <td>Phone :</td>
                      <td>{userDetails?.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td>Email :</td>
                      <td>{userDetails?.email}</td>
                    </tr>
                    {isVisible && (
                      <tr>
                        <td>Linked Amazon Ads Account :</td>
                        <td>
                          {connected ? (
                            <div className="d-flex align-items-center">
                              <p className="text-success p-0 m-0">Success</p>
                              <button
                                className="blue_btn mx-3"
                                href={""}
                                onClick={() => handleUnlink()}
                              >
                                Unlink your Account
                              </button>
                            </div>
                          ) : (
                            <button
                              className="blue_btn"
                              onClick={() => (window.location.href = btnUrl)}
                              style={{ color: "white" }}
                            >
                              Link Your Amazon Ads Account
                            </button>
                          )}
                        </td>
                      </tr>
                    )}

                  </tbody>
                </Table>
              </div>
            </Tab>
            {connected && (
              <Tab
                className="tab_bg"
                eventKey="connect"
                title="All Accounts"

              // onSelect={() => handleAccountTab()}
              >


                <AllAccount
                  // setSelectedCampagin={setSelectedCampagin}
                  setViewCampaign={setViewCampaign}
                  setSwitchTab={setSwitchTab}
                  loader={loaderValue}
                  switchTab={switchTab}
                // selectedCampagin={selectedCampagin}
                />
              </Tab>
            )}
            {viewCampaign && (
              <Tab className="tab_bg" eventKey="campaign" title="Campaigns">
                <Campaign
                  selectedCampagin={selectedCampagin}
                  campaignFlag={campaignFlag}
                  timeZoneCountry={timeZoneCountry}
                  switchTab={switchTab}
                />
              </Tab>
            )}

            {viewCampaign && (
              <Tab className="tab_bg" eventKey="budget" title="Budget Rules">
                <BudgetRule
                  selectedCampagin={selectedCampagin}
                  timeZoneCountry={timeZoneCountry}
                  switchTab={switchTab}
                />
              </Tab>
            )}

            {viewCampaign && (
              <Tab className="tab_bg" eventKey="report" title="Reports">
                <Reports
                  selectedCampagin={selectedCampagin}
                  timeZoneCountry={timeZoneCountry}
                  switchTab={switchTab}
                />
              </Tab>
            )}


            {viewCampaign && (
              <Tab
                className="tab_bg"
                eventKey="scheduler"
                title="Campaign Schedules"
              >
                <Schedular
                  selectedCampagin={selectedCampagin}
                  timeZoneCountry={timeZoneCountry}
                  switchTab={switchTab}
                />
              </Tab>
            )}


            {viewCampaign && (
              <Tab
                className="tab_bg"
                eventKey="campaignHistory"
                title="Campaign History"
              >
                <CampaignHistory
                  selectedCampagin={selectedCampagin}
                  timeZoneCountry={timeZoneCountry}
                  switchTab={switchTab}
                />
              </Tab>
            )}
          </Tabs>
        </div>
      </>
    </div>
  );
};
export default Setting;
