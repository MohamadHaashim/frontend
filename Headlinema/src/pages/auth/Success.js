import React from "react";
import { useEffect, useState } from "react";
import Head from "../../layout/head/Head";
import { Block, BlockContent, BlockDes, BlockHead, BlockTitle } from "../../components/Component";
import PageContainer from "../../layout/page-container/PageContainer";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useLocation } from "react-router";
import axios from "axios";
import { notification } from "antd";
import logo from "../../assets/images/loadingGif.gif";
import Logo from "../../assets/images/logo1.png";

import Url from "../../Api";
import AuthFooter from "./AuthFooter";

const Success = () => {
  const location = useLocation();
  console.log(location);
  const userId = localStorage.getItem("userId");
  const region = localStorage.getItem("regionName");
  const [error, setError] = useState(false);
  const [id, setId] = useState("");
  const [spError, setSpError] = useState(false);
  const [vpError, setVpError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Show, setShow] = useState("");

  useEffect(() => {
    console.log(userId);
    console.log(region);
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const scope = searchParams.get("scope");
    const state = searchParams.get("state");
    const SPspapiOauthCode = searchParams.get("spapi_oauth_code");
    const SPsellingPartnerId = searchParams.get("selling_partner_id");
    const SPstate = searchParams.get("state");

    // Check if the state exists and handle accordingly
    if (state) {
      const part = state.split("_");
      const Id = part[1];
      setId(Id);
    } else {
      console.log("State parameter is missing.");
      setLoading(false);
      // notification.error({
      //   message: "Error",
      //   description: "Required parameters are missing from the URL.",
      //   duration: 1,
      // });
      setShow("Nothing");
    }

    if (code !== null && state !== null && scope !== null) {
      setShow("Ads");
      console.log(region);
      const callbackData = {
        scope: scope,
        code: code,
        userId: userId,
        state: state,
        name: region || "",
      };
      console.log("test: "+Url.api + Url.adds_callBack, callbackData);
      console.log("test1: "+callbackData);
      
      
      axios
        .post(Url.api + Url.adds_callBack, callbackData)
        .then((res) => {
          console.log(res);
          
          if (res.data.success === true) {
            setError(false);
            setLoading(false);
            const profile = res.data.result;
            localStorage.setItem("Profiles", JSON.stringify(profile));
            localStorage.setItem(
              "adsConnected",
              res.data.connected === false || res.data.connected === null ? "notConnected" : "Connected"
            );
            notification.success({
              message: "Success",
              description: "You have successfully connected",
              duration: 1,
            });
          } else {
            notification.warning({
              message: "Warning",
              description: res.data.message,
              duration: 1,
            });
            setError(true);
            setLoading(false);
          }
        })
        .catch((error) => {
          setError(true);
          setLoading(false);
          notification.error({
            message: "Error",
            description: "Something went wrong",
            duration: 1,
          });

          console.log(error);
        });
    } else if (SPspapiOauthCode !== null && SPstate !== null && SPsellingPartnerId !== null) {
      if (SPstate) {
        const parts = SPstate.split("|");
        const Type = parts[2];

        if (Type === "Seller") {
          setShow("Seller");
          const region = parts[0];
          const Id = parts[1];
          const Marketplace = parts[3]
          setId(Id);
          const callbackData = {
            spapi_oauth_code: SPspapiOauthCode,
            selling_partner_id: SPsellingPartnerId,
            userId: Id,
            region: region,
            MarketPlaceName: Marketplace
          };

          axios
            .post(Url.api + Url.sp_callBack, callbackData)
            .then((res) => {
              console.log(res.data);
              if (res.data.success === true) {
                const profile = res.data.spRegions;
                localStorage.setItem("SPProfiles", JSON.stringify(profile));
                localStorage.setItem(
                  "spId",
                  res.data.spConnected === false || res.data.spConnected === null ? "notConnected" : "Connected"
                );
                setSpError(false);
                setLoading(false);
                notification.success({
                  message: "Success",
                  description: "You have successfully connected",
                  duration: 1,
                });
              } else {
                setLoading(false);
                setSpError(true);
                notification.error({
                  message: "Error",
                  description: "Connection failed",
                  duration: 1,
                });
              }
            })
            .catch((error) => {
              setSpError(true);
              setLoading(false);
              console.log(error);
            });
        } else if (Type === "Vendor") {
          setShow("Vendor");
          const region = parts[0];
          const Id = parts[1];
          setId(Id);

          const callbackData = {
            spapi_oauth_code: SPspapiOauthCode,
            selling_partner_id: SPsellingPartnerId,
            userId: Id,
            region: region,
          };

          axios
            .post(Url.api + Url.sp_vendor_callBack, callbackData)
            .then((res) => {
              console.log(res.data);
              if (res.data.success === true) {
                const profile = res.data.spVendorRegions;
                localStorage.setItem("VPProfiles", JSON.stringify(profile));
                localStorage.setItem(
                  "vpId",
                  res.data.spConnected === false || res.data.spConnected === null ? "notConnected" : "Connected"
                );

                setVpError(false);
                setLoading(false);
                notification.success({
                  message: "Success",
                  description: "You have successfully connected",
                  duration: 1,
                });
              } else {
                setLoading(false);
                setVpError(true);
                notification.error({
                  message: "Error",
                  description: "Connection failed",
                  duration: 1,
                });
              }
            })
            .catch((error) => {
              setVpError(true);
              setLoading(false);
              console.log(error);
            });
        }
      } else {
        setLoading(false);
        // notification.error({
        //   message: "Error",
        //   description: "Required SPstate parameter is missing.",
        //   duration: 1,
        // });
        setShow("Nothing");
      }
    } else {
      // notification.error({
      //   message: "Error",
      //   description: "Something went wrong",
      //   duration: 1,
      // });

      setShow("Nothing");
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    if (id) {
      axios
        .get(Url.api + Url.userGetById + id)
        .then((res) => {
          console.log(res.data?.result);
          localStorage.setItem("userName", res.data.result?.userName);
          localStorage.setItem("userId", res.data.result?.userId);
          const profile = res.data.result?.profiles;
          localStorage.setItem("Profiles", JSON.stringify(profile));
          const Spprofile = res.data.result?.spRegions;
          localStorage.setItem("SPProfiles", JSON.stringify(Spprofile));
          const Vpprofile = res.data.result?.vendorRegions;
          localStorage.setItem("VPProfiles", JSON.stringify(Vpprofile));
          localStorage.setItem("adsConnected", res.data.result?.connected === false || res.data.result?.connected === null ? "notConnected" : "Connected");
          localStorage.setItem("spId", res.data.result?.spConnected === false || res.data.result?.spConnected === null ? "notConnected" : "Connected");
          localStorage.setItem("vpId", res.data.result?.spVendorConnected === false || res.data.result?.spVendorConnected === null ? "notConnected" : "Connected");
        })
        .catch((error) => {
          console.log(error);
        });
    }

  }, [id]);

  return (
    <React.Fragment>
      <Head title="Success" />
      {!loading ? (
        <div className="bg-login">
          <PageContainer>
            <Block className="nk-block-middle nk-auth-body">
              <BlockHead>
                {Show === "Ads" ? (
                  <BlockContent>
                    {!error ? (
                      <h4 style={{ color: "white" }}>You have successfully connected your Amazon PPC (ADS) account.</h4>
                    ) : (
                      <h4 style={{ color: "white" }}>Your Amazon PPC (ADS) account is not connected. Please retry.</h4>
                    )}
                    <BlockDes className="text">
                      <p className="">
                        <Link to={`${process.env.PUBLIC_URL}/user/connections`}>Go to Connection Page</Link>
                      </p>
                    </BlockDes>
                  </BlockContent>
                ) : Show === "Seller" ? (
                  <BlockContent>
                    {!spError ? (
                      <h4 style={{ color: "white" }}>You have successfully connected your Amazon Seller account.</h4>
                    ) : (
                      <h4 style={{ color: "white" }}>Your Amazon Seller account is not connected. Please retry.</h4>
                    )}
                    <BlockDes className="text">
                      <p className="">
                        <Link to={`${process.env.PUBLIC_URL}/user/connections`}>Go to Connection Page</Link>
                      </p>
                    </BlockDes>
                  </BlockContent>
                ) : Show === "Vendor" ? (
                  <BlockContent>
                    {!vpError ? (
                      <h4 style={{ color: "white" }}>You have successfully connected your Amazon Vendor account.</h4>
                    ) : (
                      <h4 style={{ color: "white" }}>Your Amazon Vendor account is not connected. Please retry.</h4>
                    )}
                    <BlockDes className="text">
                      <p className="">
                        <Link to={`${process.env.PUBLIC_URL}/user/connections`}>Go to Connection Page</Link>
                      </p>
                    </BlockDes>
                  </BlockContent>
                ) : Show === "Nothing" ? (
                  <BlockContent>
                    <h4 style={{ color: "white" }}>Somthing went wrong. Please retry.</h4>
                    <BlockDes className="text">
                      <p className="">
                        <Link to={`${process.env.PUBLIC_URL}/user/connections`}>Go to Connection Page</Link>
                      </p>
                    </BlockDes>
                  </BlockContent>
                ) : null}
              </BlockHead>
            </Block>
            <AuthFooter />
          </PageContainer>
        </div>
      ) : (
        <div className="bg-login">
          <PageContainer>
            <Block className="nk-block-middle nk-auth-body d-flex justify-content-center align-items-center">
              <BlockHead>
                <BlockContent>
                  <img src={logo} height={80} width={80} alt=""></img>
                </BlockContent>
              </BlockHead>
            </Block>
          </PageContainer>
        </div>
      )}
    </React.Fragment>
  );
};

export default Success;
