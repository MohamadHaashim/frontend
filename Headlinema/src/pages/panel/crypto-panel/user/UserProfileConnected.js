import React, { useEffect, useState } from "react";
import Head from "../../../../layout/head/Head";
import { Popconfirm, notification } from "antd";
import {
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Block,
  Icon,
  Button,
  Table,
} from "../../../../components/Component";
import { Card, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { useLocation } from "react-router";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import Table2 from "../../../../components/table/Table2";
import logout from "../../../../assets/images/LFA.png";
import disconnect from "../../../../assets/images/social-removebg-preview.png";
import process1 from "../../../../assets/images/process.gif";
import process2 from "../../../../assets/images/process.gif";
import process3 from "../../../../assets/images/process.gif";
import ReactCountryFlag from "react-country-flag";
import Url from "../../../../Api";

const UserProfileConnectedPage = () => {
  const location = useLocation();
  console.log(location);
  const spAccessToken = localStorage.getItem("spAccessToken");
  const marketPlace = localStorage.getItem("MarketplaceCountryCode");
  const RegionName = localStorage.getItem("RegionName");
  const RegionCode = localStorage.getItem("RegionCode");
  const [sellerMarketPlaceName, setSellerMarketPlaceName] = useState(localStorage.getItem("sellerMarketPlaceName"));
  const [sellerMarketplaceCode, setSellerMarketplaceCode] = useState(localStorage.getItem("sellerMarketPlaceCode"));
  const [vendorMarketPlaceName, setVendorMarketPlaceName] = useState(localStorage.getItem("vendorMarketPlaceName"));
  const [vendorMarketplaceCode, setVendorMarketplaceCode] = useState(localStorage.getItem("vendorMarketplaceCode"));

  const [sellerMarketPlace, setSellerMarketPlace] = useState([]);

  const spId = localStorage.getItem("spId");
  const vpId = localStorage.getItem("vpId");
  const ads = localStorage.getItem("adsConnected");

  const [adsConnected, setAdsConnected] = useState(ads);
  const [spConnected, setSpConnected] = useState(spId);
  const [VpConnected, setvpConnected] = useState(vpId);
  const [Process1, setProcess1] = useState(false);
  const [Process2, setProcess2] = useState(false);
  const [Process3, setProcess3] = useState(false);

  const userId = localStorage.getItem("userId");
  const Data = JSON.parse(localStorage.getItem("Profiles"));
  const SPData = JSON.parse(localStorage.getItem("SPProfiles"));
  const VPData = JSON.parse(localStorage.getItem("VPProfiles"));

  const [Region, setRegion] = useState([
    {
      countryCode: "EU",
      countryName: "Europe",
    },
    {
      countryCode: "NA",
      countryName: "North America",
    },
    {
      countryCode: "FE",
      countryName: "Far East",
    },
  ]);

  useEffect(() => {
    console.log(RegionName);
    if (RegionName === null) {
      localStorage.setItem("RegionName", "North America");
      localStorage.setItem("RegionCode", "NA");
    }
  }, []);

  useEffect(() => {
    const ads = localStorage.getItem("adsConnected");
    setAdsConnected(ads);
    console.log(ads);
  }, [adsConnected]);

  useEffect(() => {
    const sp = localStorage.getItem("spId");
    setSpConnected(sp);
    console.log(sp);
  }, [spConnected]);

  useEffect(() => {
    const sp = localStorage.getItem("vpId");
    setvpConnected(sp);
    console.log(sp);
  }, [VpConnected]);

  const sellerAccount = () => {
    axios
      .get(
        Url.api + `SellingPartner/AuthorizationURL?UserId=${userId}&MarketPlace=${sellerMarketplaceCode}`
      )
      .then((res) => {
        window.location.href = res.data;
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const vendorAccount = () => {
    axios
      .get(
        Url.api + `SellingPartner/VendorAuthorizationURL?UserId=${userId}&MarketPlace=${vendorMarketplaceCode}`
      )
      .then((res) => {
        window.location.href = res.data;
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Ads = () => {
    axios
      .get(
        Url.api + `AmazonAds/AuthorizationURL?UserId=${userId}&MarketPlace=${RegionCode}`
      )
      .then((res) => {
        console.log(res.data.result.regionName);
        localStorage.setItem("regionName", res.data.result.regionName);
        window.location.href = res.data.result.connectUrl;
        console.log(res.data.result.connectUrl);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const sellerDisconnect = () => {
    setProcess1(true);
    console.log(SPData);
    axios
      .delete(Url.api + Url.sp_seller_delete_auth, {
        data: {
          userId: userId,
          sellingPartnerId: SPData[0].sellingPartnerId,
          region: SPData[0].region,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data === "Account deleted successfully") {
          setProcess1(false);
          var emptyArray = [];
          var jsonString = JSON.stringify(emptyArray);
          localStorage.setItem("SPProfiles", jsonString);
          localStorage.setItem("spId", "notConnected");
          window.location.reload();
          notification.success({
            message: "Success",
            description: "Amazon seller account disconnected successfully.",
            duration: 1,
          });
        } else {
          setProcess1(false);
          notification.error({
            message: "Error",
            description: "Something went wrong",
            duration: 1,
          });
        }
      })
      .catch((error) => {
        setProcess1(false);
        notification.error({
          message: "Error",
          description: "Something went wrong",
          duration: 1,
        });
        console.log(error);
      });
  };

  const adsDisconnect = () => {
    setProcess3(true);
    axios
      .delete(Url.api + Url.adds_del_auth, {
        data: {
          userId: userId,
          connected: false,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data === "Account deletion successful") {
          setProcess3(false);
          var emptyArray = [];
          var jsonString = JSON.stringify(emptyArray);
          localStorage.setItem("Profiles", jsonString);
          localStorage.setItem("adsConnected", "notConnected");
          window.location.reload();
          notification.success({
            message: "Success",
            description: "Amazon PPC(ADS) account disconnected successfully.",
            duration: 1,
          });
        } else {
          setProcess3(false);
          notification.error({
            message: "Error",
            description: "Something went wrong",
            duration: 1,
          });
        }
      })
      .catch((error) => {
        setProcess3(false);
        notification.error({
          message: "Error",
          description: "Something went wrong",
          duration: 1,
        });
        console.log(error);
      });
  };

  const vendorDisconnect = () => {
    setProcess2(true);
    axios
      .delete(Url.api + Url.sp_vendor_del_auth, {
        data: {
          userId: userId,
          sellingPartnerId: VPData[0].sellingPartnerId,
          region: VPData[0].region,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data === "Account deleted successfully") {
          setProcess2(false);
          var emptyArray = [];
          var jsonString = JSON.stringify(emptyArray);
          localStorage.setItem("VPProfiles", jsonString);
          localStorage.setItem("vpId", "notConnected");
          window.location.reload();
          notification.success({
            message: "Success",
            description: "Amazon vendor account disconnected successfully.",
            duration: 1,
          });
        } else {
          setProcess2(false);
          notification.error({
            message: "Error",
            description: "Something went wrong",
            duration: 1,
          });
        }
      })
      .catch((error) => {
        setProcess2(false);
        notification.error({
          message: "Error",
          description: "Something went wrong",
          duration: 1,
        });
        console.log(error);
      });
  };

  const basicData = {
    header: ["Country", "Profile Name", "Profile Id", "Type", "Report Sync"],
    data: Data,
  };
  const SPbasicData = {
    header: ["SellingPartner Id", "Region", "Connected On"],
    data: SPData,
  };
  const VPbasicData = {
    header: ["SellingPartner Id", "Region", "Connected On"],
    data: VPData,
  };

  const RegionSelect = (region) => {
    localStorage.setItem("RegionName", region.countryName);
    localStorage.setItem("RegionCode", region.countryCode);
    if (RegionName) {
      axios
        .get(
          Url.api + `MarketPlace/RegionBasedMarketPlace?Region=${region.countryName}`
        )
        .then((res) => {
          console.log(res.data);
          const data = res.data.marketPlaces;
          const formattedCountries = data.map((countryString) => {
            const parts = countryString.split(" ");
            const countryName = parts.slice(0, -1).join(" ");

            const countryCode = parts[parts.length - 1].replace(/\(|\)/g, "");
            return { countryName, countryCode };
          });
          setSellerMarketPlaceName(formattedCountries[0].countryName);
          setSellerMarketplaceCode(formattedCountries[0].countryCode);
          setVendorMarketPlaceName(formattedCountries[0].countryName);
          setVendorMarketplaceCode(formattedCountries[0].countryCode);
          setSellerMarketPlace(formattedCountries);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    axios
      .get(
        Url.api + `MarketPlace/RegionBasedMarketPlace?Region=${sellerMarketPlaceName === null ? "North America" : RegionName
        }`
      )
      .then((res) => {
        console.log(res.data);
        const data = res.data.marketPlaces;
        const formattedCountries = data.map((countryString) => {
          const parts = countryString.split(" ");
          const countryName = parts.slice(0, -1).join(" ");
          const countryCode = parts[parts.length - 1].replace(/\(|\)/g, "");
          return { countryName, countryCode };
        });

        setSellerMarketPlace(formattedCountries);
        if (sellerMarketPlaceName === null) {
          setSellerMarketPlaceName(formattedCountries[0].countryName);
          setSellerMarketplaceCode(formattedCountries[0].countryCode);
        }
        if (vendorMarketPlaceName === null) {
          setVendorMarketPlaceName(formattedCountries[0].countryName);
          setVendorMarketplaceCode(formattedCountries[0].countryCode);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const sellerMarketPlaceSelect = (sm) => {
    setSellerMarketPlaceName(sm.countryName);
    setSellerMarketplaceCode(sm.countryCode);
  };

  const vendorMarketPlaceSelect = (sm) => {
    setVendorMarketPlaceName(sm.countryName);
    setVendorMarketplaceCode(sm.countryCode);
  };

  return (
    <React.Fragment>
      <Head title="Account - Connections"></Head>
      <Block className="pt-2 pt-md-5">
        <BlockHead>
          <BlockHeadContent className="d-flex justify-content-between align-items-center">
            <div className="">
              <BlockTitle tag="h5">Connect with Amazon account</BlockTitle>
              <BlockDes>
                <p>You can connect your Amazon Seller and Vendor profile.</p>
              </BlockDes>
            </div>

            <div>
              <UncontrolledDropdown>
                <DropdownToggle
                  tag="a"
                  href="#toggle"
                  onClick={(ev) => ev.preventDefault()}
                  className="dropdown-toggle nk-quick-nav-icon"
                >
                  <span
                    className="!font-bold text-xs user-name dropdown-indicator"
                    style={{ margin: "10px 0px 10px 10px" }}
                  >
                    {RegionName}
                  </span>
                </DropdownToggle>
                <DropdownMenu right style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {Region.map((region, index) => (
                    <ul className="language-list" key={index}>
                      <li>
                        <DropdownItem
                          tag="a"
                          href="#item"
                          className="language-item"
                          onClick={() => RegionSelect(region)}
                        >
                          <span className="language-name ">{region.countryName}</span>
                        </DropdownItem>
                      </li>
                    </ul>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </BlockHeadContent>
        </BlockHead>

        <h6 className="lead-text">Connect Your PPC (ADS) Account</h6>

        {adsConnected === "Connected" ? (
          <div>
            <Card className="card-bordered mt-2">
              <div className="card-inner">
                <div className="between-center flex-wrap flex-md-nowrap g-3">
                  <div className="media media-center gx-3 wide-xs">
                    <div className="media-object"></div>
                    <div className="media-content">
                      <p>You have successfully connected your Amazon PPC (ADS) account.</p>
                    </div>
                  </div>
                  <div className="nk-block-actions flex-shrink-0">
                    {!Process3 ? (
                      <div>
                        <Popconfirm
                          title="Disconnect"
                          description="Are you sure you want to disconnect from Amazon?"
                          onConfirm={adsDisconnect}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button color="yellow" >
                            {" "}
                            <img
                              src={disconnect}
                              height={23}
                              alt=""
                              width={23}
                              style={{ paddingRight: "5px" }}
                              className="pe-3"
                            ></img>{" "}
                            Disconnect
                          </Button>
                        </Popconfirm>
                      </div>
                    ) : (
                      <div style={{ paddingRight: "65px" }}>
                        <img alt="Login with Amazon" className="pe-5" src={process3} width="25" height="25" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <div className="mt-4">
              <Table basicData={basicData} />
            </div>
          </div>
        ) : (
          <div>
            <Card className="card-bordered mt-2">
              <div className="card-inner">
                <div className="between-center flex-wrap flex-md-nowrap g-3">
                  <div className="media media-center gx-3 wide-xs">
                    <div className="media-object"></div>
                    <div className="media-content">
                      <p>
                        You can connect with your Amazon PPC Account.{" "}
                        <em className="d-block text-soft">Not connected yet</em>
                      </p>
                      {/* <ProfileId /> */}
                    </div>
                  </div>
                  <div className="nk-block-actions flex-shrink-0">
                    <div>
                      <Button color="yellow" onClick={Ads}>
                        {" "}
                        <img
                          src={disconnect}
                          height={23}
                          width={23}
                          style={{ paddingRight: "5px" }}
                          className="pe-3"
                        ></img>{" "}
                        Login with Amazon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* <h6 className="lead-text pt-1">Connect Your Vendor Account</h6>
        {VpConnected === "Connected" ? (
          <>
            <Card className="card-bordered mt-2">
              <div className="card-inner ">
                <div className="between-center flex-wrap flex-md-nowrap g-3">
                  <div className="media media-center gx-3 wide-xs">
                    <div className="media-object"></div>
                    <div className="media-content">
                      <p>
                        You have successfully connected your Amazon Vendor account.<br></br>
                      </p>
                    </div>
                  </div>
                  <div className="nk-block-actions flex-shrink-0 d-flex">
                    <div style={{ marginRight: "15px" }}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          href="#toggle"
                          onClick={(ev) => ev.preventDefault()}
                          className="dropdown-toggle nk-quick-nav-icon"
                          style={{ padding: "10px" }}
                        >
                          <span className="me-2" style={{ marginRight: "10px" }}>
                            {vendorMarketplaceCode === "UK" ? (
                              <ReactCountryFlag
                                countryCode="GB"
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            ) : (
                              <ReactCountryFlag
                                countryCode={vendorMarketplaceCode}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            )}
                          </span>
                          <span className="!font-bold text-xs user-name dropdown-indicator">
                            {vendorMarketPlaceName}
                          </span>
                        </DropdownToggle>
                        <DropdownMenu right style={{ maxHeight: "250px", overflowY: "auto" }}>
                          {sellerMarketPlace.map((sm, index) => (
                            <ul className="language-list" key={index}>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#item"
                                  className="language-item"
                                  onClick={() => vendorMarketPlaceSelect(sm)}
                                >
                                  <span className="me-2">
                                    {sm.countryCode === "UK" ? (
                                      <ReactCountryFlag
                                        countryCode="GB"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    ) : (
                                      <ReactCountryFlag
                                        countryCode={sm.countryCode}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    )}
                                  </span>
                                  <span className="language-name">{sm.countryName}</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    {!Process2 ? (
                      <div>
                        <Popconfirm
                          title="Disconnect"
                          description="Are you sure you want to disconnect from Amazon?"
                          onConfirm={vendorDisconnect}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button color="yellow" onClick={vendorDisconnect}>
                            {" "}
                            <img
                              src={disconnect}
                              height={23}
                              alt=""
                              width={23}
                              style={{ paddingRight: "5px" }}
                              className="pe-3"
                            ></img>{" "}
                            Disconnect
                          </Button>
                        </Popconfirm>
                      </div>
                    ) : (
                      <div style={{ paddingRight: "65px" }}>
                        <img alt="Login with Amazon" className="pe-5" src={process2} width="25" height="25" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <div className="mt-4 mb-4">
              <Table2 basicData={VPbasicData} />
            </div>
          </>
        ) : (
          <>
            <Card className="card-bordered">
              <div className="card-inner">
                <div className="between-center flex-wrap flex-md-nowrap g-3">
                  <div className="media media-center gx-3 wide-xs">
                    <div className="media-object"></div>
                    <div className="media-content">
                      <p>
                        You can connect your Amazon Vendor Account.
                        <em className="d-block text-soft">Not connected yet</em>
                      </p>
                    </div>
                  </div>
                  <div className="nk-block-actions flex-shrink-0 d-flex">
                    <div style={{ marginRight: "15px" }}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          href="#toggle"
                          onClick={(ev) => ev.preventDefault()}
                          className="dropdown-toggle nk-quick-nav-icon"
                          style={{ padding: "10px" }}
                        >
                          <span className="me-2" style={{ marginRight: "10px" }}>
                            {vendorMarketplaceCode === "UK" ? (
                              <ReactCountryFlag
                                countryCode="GB"
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            ) : (
                              <ReactCountryFlag
                                countryCode={vendorMarketplaceCode}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            )}
                          </span>
                          <span className="!font-bold text-xs user-name dropdown-indicator">
                            {vendorMarketPlaceName}
                          </span>
                        </DropdownToggle>
                        <DropdownMenu right style={{ maxHeight: "250px", overflowY: "auto" }}>
                          {sellerMarketPlace.map((sm, index) => (
                            <ul className="language-list" key={index}>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#item"
                                  className="language-item"
                                  onClick={() => vendorMarketPlaceSelect(sm)}
                                >
                                  <span className="me-2">
                                    {sm.countryCode === "UK" ? (
                                      <ReactCountryFlag
                                        countryCode="GB"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    ) : (
                                      <ReactCountryFlag
                                        countryCode={sm.countryCode}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    )}
                                  </span>
                                  <span className="language-name">{sm.countryName}</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>

                    <div>
                      <Button color="yellow" onClick={vendorAccount}>
                        {" "}
                        <img
                          src={disconnect}
                          height={23}
                          width={23}
                          style={{ paddingRight: "5px" }}
                          className="pe-3"
                        ></img>{" "}
                        Login with Amazon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )} */}


        <h6 className="lead-text pt-1">Connect Your Seller Account</h6>
        {spConnected === "Connected" ? (
          <>
            <Card className="card-bordered">
              <div className="card-inner">
                <div className="between-center flex-wrap flex-md-nowrap g-3">
                  <div className="media media-center gx-3 wide-xs">
                    <div className="media-object"></div>
                    <div className="media-content">
                      <p>
                        You have successfully connected your Amazon Seller account.<br></br>
                      </p>
                    </div>
                  </div>
                  <div className="nk-block-actions flex-shrink-0 d-flex ">
                    <div style={{ marginRight: "15px" }}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          href="#toggle"
                          onClick={(ev) => ev.preventDefault()}
                          className="dropdown-toggle nk-quick-nav-icon"
                          style={{ padding: "10px" }}
                        >
                          <span className="me-2" style={{ marginRight: "10px" }}>
                            {sellerMarketplaceCode === "UK" ? (
                              <ReactCountryFlag
                                countryCode="GB"
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            ) : (
                              <ReactCountryFlag
                                countryCode={sellerMarketplaceCode}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            )}
                          </span>
                          <span className="!font-bold text-xs user-name dropdown-indicator">
                            {sellerMarketPlaceName}
                          </span>
                        </DropdownToggle>
                        <DropdownMenu right style={{ maxHeight: "250px", overflowY: "auto" }}>
                          {sellerMarketPlace.map((sm, index) => (
                            <ul className="language-list" key={index}>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#item"
                                  className="language-item"
                                  onClick={() => sellerMarketPlaceSelect(sm)}
                                >
                                  <span className="me-2">
                                    {sm.countryCode === "UK" ? (
                                      <ReactCountryFlag
                                        countryCode="GB"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    ) : (
                                      <ReactCountryFlag
                                        countryCode={sm.countryCode}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    )}
                                  </span>
                                  <span className="language-name">{sm.countryName}</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    {!Process1 ? (
                      <div>
                        <Popconfirm
                          title="Disconnect"
                          description="Are you sure you want to disconnect from Amazon?"
                          onConfirm={sellerDisconnect}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button color="yellow">
                            <img
                              src={disconnect}
                              alt=""
                              height={23}
                              width={23}
                              style={{ paddingRight: "5px" }}
                              className="pe-3"
                            ></img>{" "}
                            Disconnect
                          </Button>
                        </Popconfirm>
                      </div>
                    ) : (
                      <div style={{ paddingRight: "40px" }}>
                        <img alt="Login with Amazon" className="pe-5" src={process1} width="25" height="25" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            <div className="mt-4 mb-4">
              <Table2 basicData={SPbasicData} />
            </div>
          </>
        ) : (
          <>
            <Card className="card-bordered">
              <div className="card-inner">
                <div className="between-center flex-wrap flex-md-nowrap g-3">
                  <div className="media media-center gx-3 wide-xs">
                    <div className="media-object"></div>
                    <div className="media-content">
                      <p>
                        You can connect your Amazon Seller Account.
                        <em className="d-block text-soft">Not connected yet</em>
                      </p>
                    </div>
                  </div>
                  <div className="nk-block-actions flex-shrink-0 d-flex">
                    <div style={{ marginRight: "15px" }}>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          href="#toggle"
                          onClick={(ev) => ev.preventDefault()}
                          className="dropdown-toggle nk-quick-nav-icon"
                          style={{ padding: "10px" }}
                        >
                          <span className="me-2" style={{ marginRight: "10px" }}>
                            {sellerMarketplaceCode === "UK" ? (
                              <ReactCountryFlag
                                countryCode="GB"
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            ) : (
                              <ReactCountryFlag
                                countryCode={sellerMarketplaceCode}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  borderRadius: "5px",
                                }}
                                svg
                              />
                            )}
                          </span>
                          <span className="!font-bold text-xs user-name dropdown-indicator">
                            {sellerMarketPlaceName}
                          </span>
                        </DropdownToggle>
                        <DropdownMenu right style={{ maxHeight: "250px", overflowY: "auto" }}>
                          {sellerMarketPlace.map((sm, index) => (
                            <ul className="language-list" key={index}>
                              <li>
                                <DropdownItem
                                  tag="a"
                                  href="#item"
                                  className="language-item"
                                  onClick={() => sellerMarketPlaceSelect(sm)}
                                >
                                  <span className="me-2">
                                    {sm.countryCode === "UK" ? (
                                      <ReactCountryFlag
                                        countryCode="GB"
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    ) : (
                                      <ReactCountryFlag
                                        countryCode={sm.countryCode}
                                        style={{
                                          width: "25px",
                                          height: "25px",
                                          borderRadius: "5px",
                                        }}
                                        svg
                                      />
                                    )}
                                  </span>
                                  <span className="language-name">{sm.countryName}</span>
                                </DropdownItem>
                              </li>
                            </ul>
                          ))}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>

                    <div>
                      <Button color="yellow" onClick={sellerAccount}>
                        {" "}
                        <img
                          src={disconnect}
                          height={23}
                          width={23}
                          style={{ paddingRight: "5px" }}
                          className="pe-3"
                        ></img>{" "}
                        Login with Amazon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </Block>
    </React.Fragment>
  );
};
export default UserProfileConnectedPage;
