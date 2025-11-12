import React, { useEffect, useState } from "react";
import Head from "../../../../layout/head/Head";
import load from "../../../../assets/images/process.gif";
import {
  BlockBetween,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  // InputSwitch,
  Block,
  Button,
} from "../../../../components/Component";
import axios from "axios";
import Url from "../../../../Api";
const userEmail =localStorage.getItem("userEmail")

const UserProfileNotificationPage = () => {
  const [notificationData, setNotificationData] = useState({
    alerts: false,
    browserCheck: false,
    newsletters: false,
    featureUpdates: false,
    accountTips: false,
  });
  const[userData ,setUserData]=useState([])
  const[loading ,setLoading]=useState(false)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    axios
    .get(Url.api + Url.userGetById +userId)
    .then((res)=>{
      console.log(res.data?.result);
      setUserData(res.data?.result)
   if(res.data?.result.notifications !== null){
    setNotificationData((prevState) => ({
      ...prevState,
      alerts: res.data?.result?.notifications[0].alerts !== null ? res.data?.result.notifications[0].alerts : false ,
      browserCheck: res.data?.result.notifications[0].browserCheck !== null? res.data?.result.notifications[0].browserCheck :false,
      newsletters: res.data?.result.notifications[0].newsletters !== null ? res.data?.result.notifications[0].newsletters : false,
      featureUpdates: res.data?.result.notifications[0].featureUpdates !== null ? res.data?.result.notifications[0].featureUpdates : false,
      accountTips: res.data?.result.notifications[0].accountTips !== null ? res.data?.result.notifications[0].accountTips : false,
    }))
   }
    
    })
    .catch((error)=>{
      console.log(error);
    })

  }, [])

  const handleSwitchChange = (id) => {
    setNotificationData((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    console.log(notificationData);
  };

  const InputSwitch = ({ label, id }) => {
    const checked = notificationData[id];

    return (
      <React.Fragment>
        <input
          type="checkbox"
          className="custom-control-input"
          checked={checked}
          onChange={() => handleSwitchChange(id)}
          id={id}
        />
        <label className="custom-control-label" htmlFor={id}>
          {label}
        </label>
      </React.Fragment>
    );
  };

  const save = () => {
    setLoading(true)
    const updateData = {
      userId:userId,
      userName: userData.userName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      dateOfBirth: userData.dateOfBirth,
      addressLine1: userData.addressLine1,
      addressLine2: userData.addressLine2,
      state: userData.state,
      country: userData.country,
      alerts:notificationData.alerts,
      browserCheck:notificationData.browserCheck,
      newsletters:notificationData.newsletters,
      featureUpdates:notificationData.featureUpdates,
      accountTips:notificationData.accountTips,
    };
    console.log(updateData);

    axios
    .put(Url.api + Url.userUpdate, updateData)
    .then((res)=>{
      console.log(res.data?.result);
      setLoading(false)
    })
    .catch((error)=>{
      console.log(error);
      setLoading(false)
    })
  };

  return (
    <React.Fragment>
      <Head title="Account - Notifications"></Head>
      <Block className="pt-3 pt-md-5">
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h5">Security Alerts</BlockTitle>
              <BlockDes>
                <p>You will get only those email notification what you want.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <BlockContent>
          <div className="gy-3">
            <div className="g-item">
              <div className="custom-control custom-switch">
                <InputSwitch id="alerts" label="Email me whenever encounter unusual activity" />
              </div>
            </div>
            <div className="g-item">
              <div className="custom-control custom-switch">
                <InputSwitch id="browserCheck" label="Email me if new browser is used to sign in" />
              </div>
            </div>
          </div>
        </BlockContent>

        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle tag="h6">News</BlockTitle>
              <BlockDes>
                <p>You will get only those email notification what you want.</p>
              </BlockDes>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>

        <BlockContent>
          <div className="gy-3">
            <div className="g-item">
              <div className="custom-control custom-switch">
                <InputSwitch id="newsletters" label="Notify me by email about sales and latest news" />
              </div>
            </div>
            <div className="g-item">
              <div className="custom-control custom-switch">
                <InputSwitch id="featureUpdates" label="Email me about new features and updates" />
              </div>
            </div>
            <div className="g-item">
              <div className="custom-control custom-switch">
                <InputSwitch id="accountTips" label="Email me about tips on using account" />
              </div>
            </div>
          </div>
        </BlockContent>
        <BlockContent className="d-flex justify-content-end">
          <Button color="primary" onClick={save}>Save {loading &&<img src={load} alt="" height={20} width={20} ></img>}</Button>
        </BlockContent>
      </Block>
    </React.Fragment>
  );
};
export default UserProfileNotificationPage;
